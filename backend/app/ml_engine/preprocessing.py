"""TorchXRayVision-Compatible Image Preprocessing Pipeline (FR-03)."""

import io
from typing import Tuple
import cv2
import numpy as np
from PIL import Image
import torch
import torchxrayvision as xrv


def decode_and_extract_grayscale(image_bytes: bytes) -> Tuple[np.ndarray, np.ndarray, int, int, int]:
    """
    Decode raw image bytes in-memory into:
    - gray_8bit: standardized 8-bit [0, 255] 2D float32 array for ImageQualityGuardian
    - raw_gray: original bit-depth 2D float32 array for xrv.datasets.normalize
    - maxval: 255 for 8-bit or 65535 for 16-bit images
    - width, height: original pixel dimensions
    """
    with Image.open(io.BytesIO(image_bytes)) as pil_img:
        width, height = pil_img.size
        mode = pil_img.mode
        arr = np.array(pil_img)

    # Determine bit depth and convert to 2D single-channel grayscale
    if arr.dtype == np.uint16 or mode in ("I;16", "I;16B", "I;16L", "I"):
        maxval = 65535
        if arr.ndim == 3:
            raw_gray = arr[:, :, 0].astype(np.float32)
        else:
            raw_gray = arr.astype(np.float32)
        gray_8bit = np.clip(raw_gray / 257.0, 0.0, 255.0).astype(np.float32)
    else:
        maxval = 255
        if arr.ndim == 3:
            if arr.shape[2] == 4:
                # RGBA -> RGB -> Grayscale using standard luminance weights
                rgb = arr[:, :, :3].astype(np.float32)
            else:
                rgb = arr.astype(np.float32)
            raw_gray = (
                0.2989 * rgb[:, :, 0] + 0.5870 * rgb[:, :, 1] + 0.1140 * rgb[:, :, 2]
            ).astype(np.float32)
        else:
            raw_gray = arr.astype(np.float32)
        gray_8bit = np.clip(raw_gray, 0.0, 255.0).astype(np.float32)

    return gray_8bit, raw_gray, maxval, width, height


def preprocess_for_xrv(
    raw_gray: np.ndarray,
    maxval: int = 255,
    target_size: int = 224,
    device: str = "cpu",
) -> torch.Tensor:
    """
    Execute the canonical TorchXRayVision preprocessing pipeline (FR-03):
    1. xrv.datasets.normalize(img, maxval=maxval) -> [-1024.0, 1024.0]
    2. Expand channel axis to (1, H, W)
    3. xrv.datasets.XRayCenterCrop()
    4. xrv.datasets.XRayResizer(224, engine="cv2")
    5. Convert to PyTorch float32 tensor of shape (1, 1, 224, 224)
    """
    # Step 1: Normalize to [-1024.0, 1024.0]
    img_norm = xrv.datasets.normalize(raw_gray, maxval=maxval)

    # Step 2: Expand channel axis to (1, H, W)
    if img_norm.ndim == 2:
        img_chw = img_norm[np.newaxis, :, :]
    else:
        img_chw = img_norm

    # Step 3: Center crop
    center_crop = xrv.datasets.XRayCenterCrop()
    img_cropped = center_crop(img_chw)

    # Step 4: Resize to (1, 224, 224)
    try:
        resizer = xrv.datasets.XRayResizer(target_size, engine="cv2")
        img_resized = resizer(img_cropped)
    except Exception:
        # Fallback direct cv2 resize preserving [-1024, 1024] float32 values
        resized_2d = cv2.resize(
            img_cropped[0].astype(np.float32),
            (target_size, target_size),
            interpolation=cv2.INTER_AREA,
        )
        img_resized = resized_2d[np.newaxis, :, :]

    # Ensure strictly [-1024.0, 1024.0] float32 and shape (1, 1, 224, 224)
    img_resized = np.clip(img_resized, -1024.0, 1024.0).astype(np.float32)
    tensor = torch.from_numpy(img_resized).unsqueeze(0).to(device=device, dtype=torch.float32)
    return tensor

