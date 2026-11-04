"""Batch Inference & Score Mapping Engine (FR-04)."""

from typing import Any, Dict, List, Tuple
import numpy as np
import torch

from app.ml_engine.model import CANONICAL_18_PATHOLOGIES, DenseNet121Engine


def map_18_scores(
    scores_1d: np.ndarray,
    pathology_names: List[str] = CANONICAL_18_PATHOLOGIES,
    top_k: int = 5,
) -> Tuple[Dict[str, float], List[Dict[str, Any]]]:
    """
    Map a 1D (18,) sigmoid score array into:
    - predictions: Dict[str, float] of all 18 labels rounded to 4 decimal places
    - top_findings: Sorted descending list of {"label": str, "score": float}
    """
    predictions: Dict[str, float] = {}
    for idx, label in enumerate(pathology_names):
        val = float(scores_1d[idx]) if idx < len(scores_1d) else 0.0
        val = max(0.0, min(1.0, val))
        predictions[label] = round(val, 4)

    sorted_items = sorted(predictions.items(), key=lambda kv: kv[1], reverse=True)
    top_findings = [{"label": k, "score": v} for k, v in sorted_items[:top_k]]
    return predictions, top_findings


def derive_legacy_3class_scores(predictions: Dict[str, float]) -> Dict[str, float]:
    """
    Derive the 3 high-level proxy scores expected by the existing frontend UI
    (`normal`, `tb_consistent`, `malignancy_suspicious`) from the 18 TorchXRayVision findings:
    - tb_consistent proxy: max of (Infiltration, Consolidation, Cavitation/Fibrosis, Pleural_Thickening, Pneumonia)
    - malignancy_suspicious proxy: max of (Mass, Nodule, Lung Lesion, Lung Opacity)
    - normal proxy: 1.0 - max(all 18 finding scores)
    Note: Explicitly labeled as uncalibrated proxy activations, not clinical probabilities.
    """
    tb_proxies = [
        predictions.get("Infiltration", 0.0),
        predictions.get("Consolidation", 0.0),
        predictions.get("Fibrosis", 0.0),
        predictions.get("Pneumonia", 0.0),
        predictions.get("Pleural_Thickening", 0.0),
    ]
    mal_proxies = [
        predictions.get("Mass", 0.0),
        predictions.get("Nodule", 0.0),
        predictions.get("Lung Lesion", 0.0),
        predictions.get("Lung Opacity", 0.0) * 0.85,
    ]
    tb_score = round(float(max(tb_proxies)), 4)
    mal_score = round(float(max(mal_proxies)), 4)
    max_any = max(predictions.values()) if predictions else 0.0
    normal_score = round(float(max(0.0, min(1.0, 1.0 - max_any * 0.85))), 4)

    return {
        "normal": normal_score,
        "tb_consistent": tb_score,
        "malignancy_suspicious": mal_score,
    }


def run_single_inference(
    engine: DenseNet121Engine, preprocessed_tensor: torch.Tensor
) -> Dict[str, Any]:
    """
    Run single-sample (1, 1, 224, 224) forward pass and return mapped scores and features.
    """
    scores_batch, features_batch = engine.forward_batch(preprocessed_tensor)
    primary_scores = scores_batch[0]
    primary_features = features_batch[0]
    predictions, top_findings = map_18_scores(primary_scores, engine.pathologies)

    return {
        "score_type": "uncalibrated_model_scores_not_clinical_probabilities",
        "predictions": predictions,
        "top_findings": top_findings,
        "raw_scores_1d": primary_scores,
        "penultimate_features_1d": primary_features,
    }

