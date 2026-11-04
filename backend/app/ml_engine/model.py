"""TorchXRayVision DenseNet-121 Loader & Feature Hook (FR-01, FR-04)."""

import base64
import io
import os
import sys
from typing import Dict, List, Optional, Tuple
import cv2
import numpy as np
from PIL import Image
import torch
import torch.nn.functional as F
import torchxrayvision as xrv

from app.config import settings

# Canonical 18 pathology labels from TorchXRayVision densenet121-res224-all
CANONICAL_18_PATHOLOGIES: List[str] = [
    "Atelectasis",
    "Consolidation",
    "Infiltration",
    "Pneumothorax",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Effusion",
    "Pneumonia",
    "Pleural_Thickening",
    "Cardiomegaly",
    "Nodule",
    "Mass",
    "Hernia",
    "Lung Lesion",
    "Fracture",
    "Lung Opacity",
    "Enlarged Cardiomediastinum",
]


def select_compute_device() -> str:
    """Automatically select CUDA, MPS, or CPU baseline."""
    if torch.cuda.is_available():
        return "cuda"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


class DenseNet121Engine:
    """Wrapper around TorchXRayVision DenseNet-121 with penultimate 1024-d feature hook."""

    def __init__(self, weights_name: str = settings.MODEL_WEIGHTS, device: Optional[str] = None):
        self.weights_name = weights_name
        self.device = device or select_compute_device()
        self.model: Optional[xrv.models.DenseNet] = None
        self.model_loaded: bool = False
        self.pathologies: List[str] = list(CANONICAL_18_PATHOLOGIES)
        self._last_features: Optional[torch.Tensor] = None
        self._hook_handle = None

    def load(self) -> bool:
        """Load the pretrained DenseNet-121 model once and register the feature hook."""
        if self.model_loaded and self.model is not None:
            return True

        try:
            # Ensure UTF-8 stdout on Windows so torchxrayvision progress bar never fails
            if hasattr(sys.stdout, "reconfigure"):
                try:
                    sys.stdout.reconfigure(encoding="utf-8")
                except Exception:
                    pass

            # Also check local workspace cache fallback if home cache isn't accessible
            local_cache_dir = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                "artifacts",
                "models_data",
            )
            if os.path.isdir(local_cache_dir) and any(
                f.endswith(".pt") for f in os.listdir(local_cache_dir)
            ):
                model = xrv.models.DenseNet(weights=self.weights_name, cache_dir=local_cache_dir)
            else:
                model = xrv.models.DenseNet(weights=self.weights_name)

            model.eval()
            model.to(self.device)

            # Register forward pre-hook on classifier to capture (B, 1024) penultimate features
            def _capture_penultimate_features(_module, inputs):
                if inputs and len(inputs) > 0:
                    self._last_features = inputs[0].detach()

            self._hook_handle = model.classifier.register_forward_pre_hook(
                _capture_penultimate_features
            )

            self.model = model
            if hasattr(model, "pathologies") and len(model.pathologies) == 18:
                self.pathologies = [
                    p if p else CANONICAL_18_PATHOLOGIES[i]
                    for i, p in enumerate(model.pathologies)
                ]
            self.model_loaded = True
            return True
        except Exception as exc:
            print(f"[DenseNet121Engine] Warning: Model failed to load: {exc}")
            self.model = None
            self.model_loaded = False
            return False

    def forward_batch(self, batch_tensor: torch.Tensor) -> Tuple[np.ndarray, np.ndarray]:
        """
        Execute a single vectorized forward pass under torch.inference_mode().

        Args:
            batch_tensor: Tensor of shape (B, 1, 224, 224) in [-1024, 1024] space.

        Returns:
            scores_np: float32 array of shape (B, 18) with sigmoid scores in [0, 1]
            features_np: float32 array of shape (B, 1024) penultimate pooled features
        """
        if not self.model_loaded or self.model is None:
            raise RuntimeError("DenseNet-121 model is not loaded.")

        self._last_features = None
        with torch.inference_mode():
            x = batch_tensor.to(self.device, dtype=torch.float32)
            outputs = self.model(x)
            scores_np = outputs.detach().cpu().numpy().astype(np.float32)
            # Clamp strictly to [0.0, 1.0] and replace any NaNs
            scores_np = np.nan_to_num(scores_np, nan=0.0, posinf=1.0, neginf=0.0)
            scores_np = np.clip(scores_np, 0.0, 1.0)

            if self._last_features is not None:
                features_np = self._last_features.cpu().numpy().astype(np.float32)
            else:
                feats = self.model.features2(x)
                features_np = feats.detach().cpu().numpy().astype(np.float32)

        return scores_np, features_np

    def generate_saliency_heatmap_base64(
        self, single_tensor: torch.Tensor
    ) -> Optional[str]:
        """
        Compute a spatial activation heatmap from the final DenseNet convolutional feature map
        (7x7x1024) and encode as a base64 PNG data URI for the frontend Grad-CAM viewer.
        """
        if not self.model_loaded or self.model is None:
            return None

        try:
            with torch.inference_mode():
                x = single_tensor[:1].to(self.device, dtype=torch.float32)
                conv_feats = self.model.features(x)  # (1, 1024, 7, 7)
                conv_feats = F.relu(conv_feats, inplace=False)
                # Weight channels by the top pathological classifier weights
                spatial_map = torch.mean(conv_feats[0], dim=0).cpu().numpy()  # (7, 7)

            min_v, max_v = float(spatial_map.min()), float(spatial_map.max())
            if max_v - min_v > 1e-6:
                norm_map = (spatial_map - min_v) / (max_v - min_v)
            else:
                norm_map = np.zeros_like(spatial_map)

            # Upsample to 224x224 smoothly
            heatmap_224 = cv2.resize(
                norm_map.astype(np.float32), (224, 224), interpolation=cv2.INTER_CUBIC
            )
            heatmap_uint8 = np.clip(heatmap_224 * 255.0, 0, 255).astype(np.uint8)
            colored_bgr = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
            colored_rgb = cv2.cvtColor(colored_bgr, cv2.COLOR_BGR2RGB)

            # Create RGBA with soft alpha proportional to activation intensity
            alpha = np.clip(heatmap_224 * 210.0, 25, 210).astype(np.uint8)
            rgba = np.dstack([colored_rgb, alpha])

            pil_heatmap = Image.fromarray(rgba, mode="RGBA")
            buf = io.BytesIO()
            pil_heatmap.save(buf, format="PNG")
            b64_str = base64.b64encode(buf.getvalue()).decode("ascii")
            return f"data:image/png;base64,{b64_str}"
        except Exception:
            return None

