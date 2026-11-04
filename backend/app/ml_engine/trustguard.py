"""TrustGuard Deterministic Safety Engine & Priority Rules P1–P7 (FR-09, FR-10)."""

from typing import Any, Dict, List, Tuple

from app.config import settings


def evaluate_trustguard(
    image_quality: Dict[str, Any],
    ood: Dict[str, Any],
    stability: Dict[str, Any],
    uncertainty: Dict[str, Any],
    predictions: Dict[str, float],
) -> Dict[str, Any]:
    """
    Evaluate deterministic Priority Rules P1 through P7 (FR-09 & FR-10).
    TrustGuard synthesizes all active reliability outputs into a deterministic decision
    without ever declaring a patient 'healthy' or 'cleared'.
    """
    triggered_rules: List[str] = []
    reasons: List[str] = []
    decision: str = "standard_triage"

    # P1: image_quality.status == "inadequate" -> "unreliable_input"
    if image_quality.get("status") == "inadequate":
        triggered_rules.append("P1")
        reasons.append("IMAGE_QUALITY_INADEQUATE")
        decision = "unreliable_input"

    # P2: ood.status == "out_of_distribution" -> "review_recommended"
    if ood.get("status") == "out_of_distribution":
        triggered_rules.append("P2")
        reasons.append("OOD_INPUT_DETECTED")
        if decision != "unreliable_input":
            decision = "review_recommended"

    # P3: stability.status == "unstable" -> "review_recommended"
    if stability.get("status") == "unstable":
        triggered_rules.append("P3")
        reasons.append("PREDICTION_INSTABILITY_HIGH")
        if decision != "unreliable_input":
            decision = "review_recommended"

    # P4: image_quality.status == "suboptimal" -> "review_recommended"
    if image_quality.get("status") == "suboptimal":
        triggered_rules.append("P4")
        reasons.append("IMAGE_QUALITY_SUBOPTIMAL")
        if decision != "unreliable_input":
            decision = "review_recommended"

    # P5: uncertainty.status == "calibrated" with ambiguous set -> "review_recommended"
    if uncertainty.get("status") == "calibrated":
        ambiguous = uncertainty.get("ambiguous_findings") or []
        pred_set = uncertainty.get("prediction_set")
        if len(ambiguous) > 0 or (isinstance(pred_set, list) and len(pred_set) > 1):
            triggered_rules.append("P5")
            reasons.append("CONFORMAL_SET_AMBIGUOUS")
            if decision != "unreliable_input":
                decision = "review_recommended"

    # P6: Any finding score >= 0.50 OR uncalibrated advanced modules -> "review_recommended"
    any_elevated = any(
        score >= settings.TRIAGE_THRESHOLD for score in predictions.values()
    )
    is_uncalibrated = uncertainty.get("status") != "calibrated"
    if any_elevated or is_uncalibrated:
        triggered_rules.append("P6")
        reasons.append("ELEVATED_SCORE_OR_UNCALIBRATED_PIPELINE_REVIEW")
        if decision != "unreliable_input":
            decision = "review_recommended"

    # P7: All active checks pass & all scores < 0.50 (with calibrated modules) -> "standard_triage"
    if not triggered_rules:
        triggered_rules.append("P7")
        reasons.append("ALL_RELIABILITY_CHECKS_PASSED")
        decision = "standard_triage"

    return {
        "decision": decision,
        "priority_rule": triggered_rules[0],
        "triggered_rules": triggered_rules,
        "reasons": reasons,
        "safe_for_automated_clearance": False,
        "clinical_disclaimer": (
            "Experimental AI triage research prototype. Outputs are uncalibrated model "
            "activations and never declare a patient healthy or disease-free."
        ),
    }


def map_to_frontend_safety_and_triage(
    trustguard: Dict[str, Any],
    legacy_3class_scores: Dict[str, float],
    legacy_conformal: Dict[str, Any],
) -> Tuple[Dict[str, Any], str]:
    """
    Map TrustGuard output and 3-class proxy scores into the existing frontend's
    `safety_policy` and `triage` fields (`NORMAL` | `TB_CONSISTENT` | `MALIGNANCY_SUSPICIOUS` | `UNCERTAIN_DUAL_RISK`).
    """
    decision = trustguard.get("decision", "review_recommended")
    pred_set: List[str] = legacy_conformal.get("prediction_set", [])
    tb_score = legacy_3class_scores.get("tb_consistent", 0.0)
    mal_score = legacy_3class_scores.get("malignancy_suspicious", 0.0)

    human_reasons: List[str] = []
    for code in trustguard.get("reasons", []):
        if code == "IMAGE_QUALITY_INADEQUATE":
            human_reasons.append(
                "Input image quality is inadequate (low resolution, blank signal, or severe exposure/blur). Manual review required."
            )
        elif code == "OOD_INPUT_DETECTED":
            human_reasons.append(
                "Input feature distribution deviates from reference thoracic radiographs (Out-of-Distribution)."
            )
        elif code == "PREDICTION_INSTABILITY_HIGH":
            human_reasons.append(
                "Model predictions showed high sensitivity under controlled brightness/contrast/noise perturbations."
            )
        elif code == "IMAGE_QUALITY_SUBOPTIMAL":
            human_reasons.append(
                "Suboptimal radiograph exposure, contrast, or sharpness flagged by ImageQualityGuardian."
            )
        elif code == "CONFORMAL_SET_AMBIGUOUS":
            human_reasons.append(
                "Calibrated conformal prediction set contains boundary-ambiguous or competing findings."
            )
        elif code == "ELEVATED_SCORE_OR_UNCALIBRATED_PIPELINE_REVIEW":
            human_reasons.append(
                "Elevated radiographic finding activation (>= 0.50) or uncalibrated model pipeline requires clinician interpretation."
            )
        elif code == "ALL_RELIABILITY_CHECKS_PASSED":
            human_reasons.append(
                "All technical reliability checks passed and all 18 radiographic finding scores are below 0.50."
            )

    # Determine 4-tier triage outcome for the existing frontend UI
    if (
        decision == "unreliable_input"
        or "P2" in trustguard.get("triggered_rules", [])
        or "P3" in trustguard.get("triggered_rules", [])
        or ("tb_consistent" in pred_set and "malignancy_suspicious" in pred_set)
        or (tb_score >= 0.45 and mal_score >= 0.45)
        or len(pred_set) == 0
    ):
        triage = "UNCERTAIN_DUAL_RISK"
        abstained = True
    elif "malignancy_suspicious" in pred_set or mal_score >= 0.50:
        triage = "MALIGNANCY_SUSPICIOUS"
        abstained = False
    elif "tb_consistent" in pred_set or tb_score >= 0.50:
        triage = "TB_CONSISTENT"
        abstained = False
    else:
        triage = "NORMAL"
        abstained = False

    safety_policy = {
        "version": settings.POLICY_VERSION,
        "abstained": abstained,
        "triggered_rules": trustguard.get("reasons", []),
        "reasons": human_reasons,
    }
    return safety_policy, triage

