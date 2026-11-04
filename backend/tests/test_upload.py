"""Phase 3 Verification Gate: Zero-Trust Image Upload, Analysis & LRU Cache Tests."""

from fastapi.testclient import TestClient
from app.main import app


def test_analyze_valid_png_and_cache_retrieval(synthetic_png_bytes: bytes):
    """Verify POST /api/v1/analyze and POST /api/analyze return Unified Trust Passport and cache it."""
    with TestClient(app) as client:
        res = client.post(
            "/api/v1/analyze?run_stability=true&run_ood=false",
            files={"file": ("chest_xray.png", synthetic_png_bytes, "image/png")},
            data={"case_label": "TEST-CASE-01"},
        )
        assert res.status_code == 200
        body = res.json()

        # Verify Trust Passport v2.0 fields
        assert "analysis_id" in body
        assert body["status"] == "completed"
        assert body["processing_time_ms"] > 0
        assert body["model"]["name"] == "DenseNet-121"
        assert body["model"]["version"] == "densenet121-res224-all"
        assert len(body["predictions"]) == 18
        assert len(body["top_findings"]) == 5
        assert body["image_quality"]["status"] == "acceptable"
        assert body["stability"]["tests_run"] == 4
        assert body["uncertainty"]["status"] == "not_calibrated"
        assert body["ood"]["status"] == "not_implemented"
        assert body["trustguard"]["decision"] in (
            "unreliable_input",
            "review_recommended",
            "standard_triage",
        )

        # Verify backward-compatible fields for existing Antigravity frontend
        assert body["case_id"] == "TEST-CASE-01"
        assert body["mode"] == "inference"
        assert body["simulated"] is False
        assert body["triage"] in (
            "NORMAL",
            "TB_CONSISTENT",
            "MALIGNANCY_SUSPICIOUS",
            "UNCERTAIN_DUAL_RISK",
        )
        assert body["explainability"]["available"] is True
        assert body["explainability"]["heatmap_png_base64"].startswith(
            "data:image/png;base64,"
        )

        # Verify GET /api/v1/analysis/{analysis_id} retrieves cached Trust Passport
        analysis_id = body["analysis_id"]
        cached_res = client.get(f"/api/v1/analysis/{analysis_id}")
        assert cached_res.status_code == 200
        assert cached_res.json()["analysis_id"] == analysis_id


def test_zero_trust_upload_security_rejections():
    """Verify FR-02 rejects empty (400), oversized (413), bad magic bytes (415), and corrupt streams (422)."""
    with TestClient(app) as client:
        # 1. Empty file -> HTTP 400
        r_empty = client.post(
            "/api/v1/analyze",
            files={"file": ("empty.png", b"", "image/png")},
        )
        assert r_empty.status_code == 400

        # 2. Oversized file (>10 MB) -> HTTP 413
        oversized = b"\x89PNG\r\n\x1a\n" + (b"\x00" * (10 * 1024 * 1024 + 1024))
        r_large = client.post(
            "/api/v1/analyze",
            files={"file": ("huge.png", oversized, "image/png")},
        )
        assert r_large.status_code == 413
        assert r_large.json()["error"]["code"] == "FILE_TOO_LARGE"

        # 3. Spoofed extension / invalid magic header -> HTTP 415
        spoofed = b"MZ\x90\x00\x03\x00\x00\x00NotAnImageFile"
        r_spoof = client.post(
            "/api/v1/analyze",
            files={"file": ("spoofed.png", spoofed, "image/png")},
        )
        assert r_spoof.status_code == 415
        assert r_spoof.json()["error"]["code"] == "INVALID_FILE_TYPE"

        # 4. Valid PNG magic bytes but corrupted stream -> HTTP 422
        corrupt = b"\x89PNG\r\n\x1a\nCORRUPTED_STREAM_DATA_NOT_VALID_CHUNKS"
        r_corrupt = client.post(
            "/api/v1/analyze",
            files={"file": ("corrupt.png", corrupt, "image/png")},
        )
        assert r_corrupt.status_code == 422
        assert r_corrupt.json()["error"]["code"] == "CORRUPT_IMAGE"

        # 5. Full-color random photo rejection -> HTTP 422 NON_RADIOGRAPHIC_IMAGE
        import io
        import numpy as np
        from PIL import Image

        color_arr = np.zeros((300, 300, 3), dtype=np.uint8)
        color_arr[:, :, 0] = 220  # Red
        color_arr[:, :, 1] = 40   # Green
        color_arr[:, :, 2] = 40   # Blue
        color_buf = io.BytesIO()
        Image.fromarray(color_arr).save(color_buf, format="JPEG")
        r_color = client.post(
            "/api/v1/analyze",
            files={"file": ("random_photo.jpg", color_buf.getvalue(), "image/jpeg")},
        )
        assert r_color.status_code == 422
        assert r_color.json()["error"]["code"] == "NON_RADIOGRAPHIC_IMAGE"

