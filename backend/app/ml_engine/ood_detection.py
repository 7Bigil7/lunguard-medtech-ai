"""Out-of-Distribution (OOD) Feature Distance Module & Honest Fallback (FR-08)."""

import os
from typing import Any, Dict, Optional
import numpy as np

OOD_STATS_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "artifacts",
    "ood_reference_stats.npz",
)


def evaluate_ood(
    penultimate_features_1d: np.ndarray,
    run_ood: bool = False,
    stats_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Evaluate penultimate 1024-d DenseNet feature distance against reference distribution (FR-08).
    When reference stats are absent in MVP, honestly returns status="not_implemented" and score=None.
    """
    path = stats_path or OOD_STATS_PATH
    if not run_ood or not os.path.isfile(path):
        return {
            "status": "not_implemented",
            "score": None,
            "threshold": None,
        }

    try:
        data = np.load(path)
        mean_vec = data["mean"].astype(np.float32)
        inv_cov = data["inv_cov"].astype(np.float32)
        threshold = float(data["threshold"])

        diff = penultimate_features_1d.astype(np.float32) - mean_vec
        dist = float(np.sqrt(np.maximum(0.0, diff @ inv_cov @ diff)))

        status = "out_of_distribution" if dist > threshold else "in_distribution"
        return {
            "status": status,
            "score": round(dist, 4),
            "threshold": round(threshold, 4),
        }
    except Exception:
        return {
            "status": "not_implemented",
            "score": None,
            "threshold": None,
        }

