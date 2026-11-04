"""Phase 1 Verification Gate: Core AI Engine & 18-Pathology Inference Tests."""

import numpy as np
import torch
from app.ml_engine.model import CANONICAL_18_PATHOLOGIES, DenseNet121Engine
from app.ml_engine.preprocessing import decode_and_extract_grayscale, preprocess_for_xrv
from app.ml_engine.inference import run_single_inference, derive_legacy_3class_scores


def test_preprocessing_pipeline_shape_and_range(synthetic_png_bytes: bytes):
    """Verify FR-03 preprocessing maps image to (1, 1, 224, 224) in [-1024, 1024]."""
    gray_8bit, raw_gray, maxval, width, height = decode_and_extract_grayscale(
        synthetic_png_bytes
    )
    assert width == 512 and height == 512
    assert maxval == 255
    assert gray_8bit.shape == (512, 512)

    tensor = preprocess_for_xrv(raw_gray, maxval=maxval, target_size=224, device="cpu")
    assert isinstance(tensor, torch.Tensor)
    assert tensor.shape == (1, 1, 224, 224)
    assert tensor.dtype == torch.float32
    assert float(tensor.min()) >= -1024.0
    assert float(tensor.max()) <= 1024.0


def test_densenet121_inference_and_18_labels(synthetic_png_bytes: bytes):
    """Verify FR-01 & FR-04: DenseNet-121 loads, extracts 1024-d features, and outputs all 18 labels."""
    engine = DenseNet121Engine()
    loaded = engine.load()
    assert loaded is True
    assert engine.model_loaded is True
    assert len(engine.pathologies) == 18

    _, raw_gray, maxval, _, _ = decode_and_extract_grayscale(synthetic_png_bytes)
    tensor = preprocess_for_xrv(raw_gray, maxval=maxval, target_size=224, device=engine.device)

    result = run_single_inference(engine, tensor)
    assert result["score_type"] == "uncalibrated_model_scores_not_clinical_probabilities"

    predictions = result["predictions"]
    assert len(predictions) == 18
    for label in CANONICAL_18_PATHOLOGIES:
        assert label in predictions
        score = predictions[label]
        assert isinstance(score, float)
        assert 0.0 <= score <= 1.0

    # Verify penultimate 1024-d feature vector extracted via hook in same forward pass
    feats = result["penultimate_features_1d"]
    assert isinstance(feats, np.ndarray)
    assert feats.shape == (1024,)

    # Verify top_findings is sorted descending
    top_findings = result["top_findings"]
    assert len(top_findings) == 5
    scores_list = [item["score"] for item in top_findings]
    assert scores_list == sorted(scores_list, reverse=True)

    # Verify 3-class legacy mapping for existing frontend UI
    legacy_scores = derive_legacy_3class_scores(predictions)
    assert set(legacy_scores.keys()) == {"normal", "tb_consistent", "malignancy_suspicious"}
    for v in legacy_scores.values():
        assert 0.0 <= v <= 1.0

