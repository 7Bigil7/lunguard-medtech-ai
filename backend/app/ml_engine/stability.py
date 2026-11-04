"""Vectorized Prediction Stability Challenge (FR-06)."""

from typing import Any, Dict, Tuple
import cv2
import numpy as np
import torch

from app.config import settings
from app.ml_engine.model import DenseNet121Engine


def build_perturbation_batch(
    original_tensor: torch.Tensor, seed: int = settings.PERTURBATION_SEED
) -> torch.Tensor:
    """
    Build a (5, 1, 224, 224) batch tensor in [-1024, 1024] space containing:
    [0] Original preprocessed tensor
    [1] Brightness Shift (+5%): clip(T + 102.4, -1024, 1024)
    [2] Contrast Change (-8%): clip((T - mu_T) * 0.92 + mu_T, -1024, 1024)
    [3] Mild Gaussian Noise: clip(T + N(0, sigma=25.0), -1024, 1024) with fixed seed=42
    [4] Mild Gaussian Blur: 3x3 Gaussian kernel with sigma=0.6
    """
    orig_2d = original_tensor[0, 0].detach().cpu().numpy().astype(np.float32)

    # 1. Brightness Shift (+5% of 2048 dynamic range = +102.4)
    p1_bright = np.clip(orig_2d + 102.4, -1024.0, 1024.0)

    # 2. Contrast Change (-8%)
    mu_t = float(np.mean(orig_2d))
    p2_contrast = np.clip((orig_2d - mu_t) * 0.92 + mu_t, -1024.0, 1024.0)

    # 3. Mild Gaussian Noise (sigma=25.0, deterministic seed=42)
    rng = np.random.default_rng(seed)
    noise = rng.normal(loc=0.0, scale=25.0, size=orig_2d.shape).astype(np.float32)
    p3_noise = np.clip(orig_2d + noise, -1024.0, 1024.0)

    # 4. Mild Gaussian Blur (3x3 kernel, sigma=0.6)
    p4_blur = cv2.GaussianBlur(orig_2d, (3, 3), sigmaX=0.6, sigmaY=0.6)
    p4_blur = np.clip(p4_blur, -1024.0, 1024.0).astype(np.float32)

    stacked = np.stack([orig_2d, p1_bright, p2_contrast, p3_noise, p4_blur], axis=0)
    batch_tensor = torch.from_numpy(stacked[:, np.newaxis, :, :]).to(
        device=original_tensor.device, dtype=torch.float32
    )
    return batch_tensor


def compute_stability_metrics(scores_batch: np.ndarray) -> Dict[str, Any]:
    """
    Compute stability metrics from a (5, 18) batch of sigmoid scores:
    - scores_batch[0] is the original (18,) vector
    - scores_batch[1:5] are the 4 perturbed (4, 18) vectors
    """
    orig_scores = scores_batch[0]  # (18,)
    perturbed_scores = scores_batch[1:]  # (4, 18)

    abs_diffs = np.abs(perturbed_scores - orig_scores[np.newaxis, :])  # (4, 18)
    mean_score_variation = float(np.mean(abs_diffs))
    max_score_delta = float(np.max(abs_diffs))

    # Disagreement rate: fraction of the 18 labels that flip across 0.50 threshold in any perturbation
    orig_binary = orig_scores >= settings.TRIAGE_THRESHOLD  # (18,)
    pert_binary = perturbed_scores >= settings.TRIAGE_THRESHOLD  # (4, 18)
    flipped_per_label = np.any(pert_binary != orig_binary[np.newaxis, :], axis=0)  # (18,)
    disagreement_rate = float(np.mean(flipped_per_label.astype(np.float32)))

    stability_score = float(max(0.0, min(1.0, 1.0 - 5.0 * mean_score_variation)))

    # Classify status per FR-06
    if (
        max_score_delta > settings.MODERATE_MAX_DELTA
        or disagreement_rate > settings.STABLE_DISAGREEMENT
    ):
        status = "unstable"
    elif max_score_delta > settings.STABLE_MAX_DELTA:
        status = "moderate_instability"
    else:
        status = "stable"

    return {
        "status": status,
        "tests_run": int(perturbed_scores.shape[0]),
        "score": round(stability_score, 4),
        "mean_score_variation": round(mean_score_variation, 4),
        "max_score_delta": round(max_score_delta, 4),
        "disagreement_rate": round(disagreement_rate, 4),
    }


def run_vectorized_inference_and_stability(
    engine: DenseNet121Engine,
    preprocessed_tensor: torch.Tensor,
    run_stability: bool = True,
) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
    """
    Execute either a single (1, 1, 224, 224) forward pass or a vectorized (5, 1, 224, 224)
    forward pass extracting primary scores, primary 1024-d features, and stability metrics.
    """
    if run_stability:
        batch_tensor = build_perturbation_batch(preprocessed_tensor)
        scores_batch, features_batch = engine.forward_batch(batch_tensor)
        stability = compute_stability_metrics(scores_batch)
        return scores_batch[0], features_batch[0], stability

    scores_batch, features_batch = engine.forward_batch(preprocessed_tensor)
    stability = {
        "status": "skipped",
        "tests_run": 0,
        "score": None,
        "mean_score_variation": None,
        "max_score_delta": None,
        "disagreement_rate": None,
    }
    return scores_batch[0], features_batch[0], stability

