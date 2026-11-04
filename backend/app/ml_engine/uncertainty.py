"""Conformal Uncertainty Module & Honest Fallback (FR-07)."""

import json
import os
from typing import Any, Dict, List, Optional

ARTIFACT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "artifacts",
    "conformal_quantiles.json",
)


def evaluate_conformal_uncertainty(
    predictions: Dict[str, float],
    quantiles_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Evaluate split conformal uncertainty (FR-07).
    When backend/artifacts/conformal_quantiles.json is present, computes calibrated prediction sets.
    When calibration data is absent in MVP, honestly returns status="not_calibrated".
    """
    path = quantiles_path or ARTIFACT_PATH
    if not os.path.isfile(path):
        return {
            "status": "not_calibrated",
            "prediction_set": None,
            "ambiguous_findings": [],
        }

    try:
        with open(path, "r", encoding="utf-8") as f:
            calib = json.load(f)

        thresholds: Dict[str, float] = calib.get("thresholds", {})
        margin: float = float(calib.get("ambiguity_margin", 0.08))

        prediction_set: List[str] = []
        ambiguous_findings: List[str] = []

        for label, score in predictions.items():
            q_hat = float(thresholds.get(label, 0.50))
            if score >= q_hat:
                prediction_set.append(label)
            if abs(score - q_hat) <= margin:
                ambiguous_findings.append(label)

        return {
            "status": "calibrated",
            "prediction_set": prediction_set,
            "ambiguous_findings": ambiguous_findings,
        }
    except Exception:
        return {
            "status": "not_calibrated",
            "prediction_set": None,
            "ambiguous_findings": [],
        }


def build_legacy_conformal_set(
    legacy_3class_scores: Dict[str, float],
    uncertainty_result: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Build the `conformal` object expected by the existing frontend Zod schema (`ConformalPredictionSchema`)
    while preserving strict honesty (`target_coverage: null` when uncalibrated).
    """
    pred_set: List[str] = []
    tb_score = legacy_3class_scores.get("tb_consistent", 0.0)
    mal_score = legacy_3class_scores.get("malignancy_suspicious", 0.0)

    if tb_score >= 0.45:
        pred_set.append("tb_consistent")
    if mal_score >= 0.45:
        pred_set.append("malignancy_suspicious")
    if not pred_set and legacy_3class_scores.get("normal", 0.0) >= 0.50:
        pred_set.append("normal")

    is_calibrated = uncertainty_result.get("status") == "calibrated"
    return {
        "prediction_set": pred_set,
        "target_coverage": 0.95 if is_calibrated else None,
        "method": (
            "split_conformal_calibrated"
            if is_calibrated
            else "not_calibrated_uncalibrated_threshold_set"
        ),
    }

