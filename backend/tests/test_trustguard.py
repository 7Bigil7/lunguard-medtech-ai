"""Phase 2 Verification Gate: Image Quality, Stability Challenge & Deterministic P1–P7 TrustGuard Rules."""

import numpy as np
import torch

from app.ml_engine.image_quality import evaluate_image_quality
from app.ml_engine.stability import build_perturbation_batch, compute_stability_metrics
from app.ml_engine.uncertainty import evaluate_conformal_uncertainty
from app.ml_engine.ood_detection import evaluate_ood
from app.ml_engine.trustguard import evaluate_trustguard
from app.ml_engine.preprocessing import decode_and_extract_grayscale


def test_image_quality_acceptable_vs_inadequate(synthetic_png_bytes: bytes):
    """Verify FR-05 ImageQualityGuardian classifies good X-ray as acceptable and blank/tiny as inadequate."""
    gray_8bit, _, _, w, h = decode_and_extract_grayscale(synthetic_png_bytes)
    iq = evaluate_image_quality(gray_8bit, w, h)
    assert iq["status"] == "acceptable"
    assert iq["warnings"] == []
    assert iq["review_recommended"] is False

    # Blank uniform image -> inadequate with BLANK_OR_CORRUPT_SIGNAL & LOW_CONTRAST
    blank = np.full((256, 256), 120.0, dtype=np.float32)
    iq_blank = evaluate_image_quality(blank, 256, 256)
    assert iq_blank["status"] == "inadequate"
    assert "BLANK_OR_CORRUPT_SIGNAL" in iq_blank["warnings"]
    assert "LOW_CONTRAST" in iq_blank["warnings"]
    assert iq_blank["review_recommended"] is True

    # Low resolution (<224) -> inadequate with LOW_RESOLUTION
    small = gray_8bit[:160, :160]
    iq_small = evaluate_image_quality(small, 160, 160)
    assert iq_small["status"] == "inadequate"
    assert "LOW_RESOLUTION" in iq_small["warnings"]


def test_vectorized_perturbation_batch_and_stability():
    """Verify FR-06 builds deterministic (5, 1, 224, 224) batch and computes stability status."""
    base_tensor = torch.zeros((1, 1, 224, 224), dtype=torch.float32)
    batch1 = build_perturbation_batch(base_tensor, seed=42)
    batch2 = build_perturbation_batch(base_tensor, seed=42)
    assert batch1.shape == (5, 1, 224, 224)
    assert torch.allclose(batch1, batch2)

    # Stable synthetic score matrix (5, 18)
    stable_scores = np.full((5, 18), 0.20, dtype=np.float32)
    stable_scores[1:] += 0.01
    res_stable = compute_stability_metrics(stable_scores)
    assert res_stable["status"] == "stable"
    assert res_stable["tests_run"] == 4
    assert res_stable["disagreement_rate"] == 0.0

    # Unstable score matrix with large delta (>0.20) and threshold flipping
    unstable_scores = np.full((5, 18), 0.48, dtype=np.float32)
    unstable_scores[1, :5] = 0.78  # Delta = 0.30, flips 5/18 labels across 0.50
    res_unstable = compute_stability_metrics(unstable_scores)
    assert res_unstable["status"] == "unstable"
    assert res_unstable["max_score_delta"] > 0.20
    assert res_unstable["disagreement_rate"] > 0.10


def test_honest_fallbacks_when_uncalibrated():
    """Verify FR-07 and FR-08 never fabricate numbers when calibration files are absent."""
    unc = evaluate_conformal_uncertainty({"Atelectasis": 0.4}, quantiles_path="/nonexistent/path.json")
    assert unc == {
        "status": "not_calibrated",
        "prediction_set": None,
        "ambiguous_findings": [],
    }

    feats = np.zeros((1024,), dtype=np.float32)
    ood = evaluate_ood(feats, run_ood=True, stats_path="/nonexistent/stats.npz")
    assert ood == {
        "status": "not_implemented",
        "score": None,
        "threshold": None,
    }


def test_trustguard_priority_rules_p1_to_p7():
    """Verify FR-09 & FR-10 deterministic priority rules P1 through P7."""
    low_preds = {"Atelectasis": 0.12, "Nodule": 0.08}
    high_preds = {"Atelectasis": 0.65, "Nodule": 0.55}

    iq_ok = {"status": "acceptable"}
    iq_sub = {"status": "suboptimal"}
    iq_bad = {"status": "inadequate"}

    ood_ok = {"status": "in_distribution"}
    ood_bad = {"status": "out_of_distribution"}

    stab_ok = {"status": "stable"}
    stab_bad = {"status": "unstable"}

    unc_calib_clean = {"status": "calibrated", "prediction_set": ["Atelectasis"], "ambiguous_findings": []}
    unc_calib_ambig = {"status": "calibrated", "prediction_set": ["Atelectasis", "Nodule"], "ambiguous_findings": ["Nodule"]}
    unc_uncalib = {"status": "not_calibrated", "prediction_set": None, "ambiguous_findings": []}

    # P1: Inadequate image quality -> unreliable_input
    r1 = evaluate_trustguard(iq_bad, ood_ok, stab_ok, unc_calib_clean, low_preds)
    assert r1["decision"] == "unreliable_input"
    assert r1["priority_rule"] == "P1"
    assert "IMAGE_QUALITY_INADEQUATE" in r1["reasons"]

    # P2: Out of distribution -> review_recommended
    r2 = evaluate_trustguard(iq_ok, ood_bad, stab_ok, unc_calib_clean, low_preds)
    assert r2["decision"] == "review_recommended"
    assert r2["priority_rule"] == "P2"
    assert "OOD_INPUT_DETECTED" in r2["reasons"]

    # P3: Unstable predictions -> review_recommended
    r3 = evaluate_trustguard(iq_ok, ood_ok, stab_bad, unc_calib_clean, low_preds)
    assert r3["decision"] == "review_recommended"
    assert r3["priority_rule"] == "P3"
    assert "PREDICTION_INSTABILITY_HIGH" in r3["reasons"]

    # P4: Suboptimal image quality -> review_recommended
    r4 = evaluate_trustguard(iq_sub, ood_ok, stab_ok, unc_calib_clean, low_preds)
    assert r4["decision"] == "review_recommended"
    assert r4["priority_rule"] == "P4"
    assert "IMAGE_QUALITY_SUBOPTIMAL" in r4["reasons"]

    # P5: Calibrated with ambiguous conformal set -> review_recommended
    r5 = evaluate_trustguard(iq_ok, ood_ok, stab_ok, unc_calib_ambig, low_preds)
    assert r5["decision"] == "review_recommended"
    assert r5["priority_rule"] == "P5"
    assert "CONFORMAL_SET_AMBIGUOUS" in r5["reasons"]

    # P6: Elevated score >= 0.50 or uncalibrated pipeline -> review_recommended
    r6 = evaluate_trustguard(iq_ok, ood_ok, stab_ok, unc_uncalib, high_preds)
    assert r6["decision"] == "review_recommended"
    assert r6["priority_rule"] == "P6"
    assert "ELEVATED_SCORE_OR_UNCALIBRATED_PIPELINE_REVIEW" in r6["reasons"]

    # P7: All active checks pass & all scores < 0.50 (with calibrated modules) -> standard_triage
    r7 = evaluate_trustguard(iq_ok, ood_ok, stab_ok, unc_calib_clean, low_preds)
    assert r7["decision"] == "standard_triage"
    assert r7["priority_rule"] == "P7"
    assert r7["reasons"] == ["ALL_RELIABILITY_CHECKS_PASSED"]
    assert r7["safe_for_automated_clearance"] is False

