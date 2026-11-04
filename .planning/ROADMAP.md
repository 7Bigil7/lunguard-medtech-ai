# LUNGGUARD v2.0 — Phased Execution Roadmap (`ROADMAP.md`)

## Milestone: Backend Development & Pre-Existing Frontend Integration

### Phase 0: Tool Audit & Frontend Discovery
- [x] Read-only audit of workspace and frontend config
- [x] Audit Python interpreter and installed packages
- [x] Hardware acceleration check (CPU baseline configured)
- [x] TorchXRayVision cache check
- [x] User approval for missing packages & model weight download (**APPROVED**)

### Phase 1: Core AI Engine
- [x] Implement `backend/app/config.py` (Thresholds, upload caps, CORS origins)
- [x] Implement `backend/app/ml_engine/model.py` (TorchXRayVision DenseNet-121 loader & 1024-d feature hook)
- [x] Implement `backend/app/ml_engine/preprocessing.py` (Grayscale, xrv.normalize [-1024, 1024], XRayCenterCrop, XRayResizer)
- [x] Implement `backend/app/ml_engine/inference.py` (Batch inference under `torch.inference_mode()`)
- [x] Verification Gate: `pytest backend/tests/test_inference.py` passed with all 18 labels verified

### Phase 2: Reliability & TrustGuard
- [x] Implement `backend/app/ml_engine/image_quality.py` (Laplacian blur variance, RMS contrast, brightness range)
- [x] Implement `backend/app/ml_engine/stability.py` (Vectorized 5-sample perturbation challenge)
- [x] Implement `backend/app/ml_engine/uncertainty.py` (Conformal prediction honest fallback)
- [x] Implement `backend/app/ml_engine/ood_detection.py` (Penultimate feature distance OOD fallback)
- [x] Implement `backend/app/ml_engine/trustguard.py` (Deterministic P1–P7 priority rule evaluator)
- [x] Verification Gate: `pytest backend/tests/test_trustguard.py` passed deterministic P1–P7 checks

### Phase 3: FastAPI & Security
- [x] Implement `backend/app/schemas.py` (Pydantic v2 TrustPassport & error contracts)
- [x] Implement `backend/app/utils/image_validation.py` (In-memory magic-byte inspection, size cap, zero disk writes)
- [x] Implement `backend/app/services/model_service.py` (Singleton DenseNet-121 lifespan holder)
- [x] Implement `backend/app/services/analysis_service.py` (Threadpool pipeline orchestrator & 100-item LRU cache)
- [x] Implement `backend/app/api/routes.py` and `backend/app/main.py`
- [x] Verification Gate: `pytest backend/tests/test_health.py` and `test_upload.py` passed (10/10 tests passed)

### Phase 4: Existing Frontend Integration
- [x] Configure CORS for frontend ports (`5173`, `4173`)
- [x] Dual routing active (`/api/health` + `/api/v1/health`, `/api/analyze` + `/api/v1/analyze`)
- [x] Integrated `TrustPassportPanel.tsx` in `frontend/src/pages/Workspace.tsx`
- [x] Verified frontend TypeScript (`0 errors`) and Oxlint (`0 warnings, 0 errors`)
- [x] Verified all 45 Vitest frontend test suites pass 100%
- [x] Live end-to-end integration verified: Real chest radiograph inference executed in 821ms on CPU!
