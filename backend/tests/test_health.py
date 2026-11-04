"""Phase 3 Verification Gate: Health & Model-Info Endpoint Tests."""

from fastapi.testclient import TestClient
from app.main import app


def test_health_endpoints_v1_and_legacy():
    """Verify both /api/v1/health and /api/health return expected readiness status."""
    with TestClient(app) as client:
        res_v1 = client.get("/api/v1/health")
        assert res_v1.status_code == 200
        data_v1 = res_v1.json()
        assert data_v1["status"] == "healthy"
        assert data_v1["model_loaded"] is True
        assert data_v1["model_name"] == "DenseNet-121"
        assert data_v1["device"] in ("cpu", "cuda", "mps")

        res_legacy = client.get("/api/health")
        assert res_legacy.status_code == 200
        data_legacy = res_legacy.json()
        assert data_legacy["status"] == "ok"
        assert data_legacy["model_loaded"] is True
        assert data_legacy["mode"] == "inference"


def test_model_info_endpoint():
    """Verify /api/v1/model-info returns architecture and all 18 labels."""
    with TestClient(app) as client:
        res = client.get("/api/v1/model-info")
        assert res.status_code == 200
        data = res.json()
        assert data["model_name"] == "DenseNet-121"
        assert data["weights_version"] == "densenet121-res224-all"
        assert data["num_labels"] == 18
        assert len(data["labels"]) == 18
        assert "Atelectasis" in data["labels"]
        assert "Nodule" in data["labels"]

