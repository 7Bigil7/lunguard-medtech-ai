"""FastAPI REST Endpoints & Trust Passport Routes (PRD Section 6)."""

from typing import Any, Dict, Optional
from fastapi import APIRouter, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse

from app.config import settings
from app.ml_engine.model import CANONICAL_18_PATHOLOGIES
from app.schemas import ModelMetadataEndpointResponse, UnifiedTrustPassportResponse
from app.services.analysis_service import analysis_service_singleton
from app.services.model_service import ModelService, model_service_singleton
from app.utils.image_validation import UploadValidationError, validate_image_bytes

router = APIRouter()


def _get_model_service(request: Request) -> ModelService:
    svc: Optional[ModelService] = getattr(request.app.state, "model_service", None)
    return svc if svc is not None else model_service_singleton


@router.get("/api/health", tags=["Health"])
async def health_check_legacy(request: Request) -> Dict[str, Any]:
    """Health check endpoint formatted for the existing Antigravity frontend (`status: "ok"`)."""
    svc = _get_model_service(request)
    return {
        "status": "ok",
        "health_status": "healthy" if svc.is_ready else "degraded",
        "model_loaded": svc.is_ready,
        "mode": "inference" if svc.is_ready else "development",
        "model_name": settings.MODEL_NAME,
        "device": svc.device,
        "policy_version": settings.POLICY_VERSION,
        "version": settings.APP_VERSION,
    }


@router.get("/api/v1/health", tags=["Health"])
async def health_check_v1(request: Request) -> Dict[str, Any]:
    """Canonical PRD v2.0 health check endpoint (`status: "healthy"`)."""
    svc = _get_model_service(request)
    return {
        "status": "healthy" if svc.is_ready else "degraded",
        "model_loaded": svc.is_ready,
        "mode": "inference" if svc.is_ready else "development",
        "model_name": settings.MODEL_NAME,
        "device": svc.device,
        "policy_version": settings.POLICY_VERSION,
        "version": settings.APP_VERSION,
    }


@router.get(
    "/api/v1/model-info",
    response_model=ModelMetadataEndpointResponse,
    tags=["Model"],
)
@router.get(
    "/api/model-info",
    response_model=ModelMetadataEndpointResponse,
    tags=["Model"],
)
async def get_model_info(request: Request) -> ModelMetadataEndpointResponse:
    """Return model architecture, weights version, input shape, and all 18 pathology labels."""
    svc = _get_model_service(request)
    return ModelMetadataEndpointResponse(
        model_name=settings.MODEL_NAME,
        weights_version=settings.MODEL_WEIGHTS,
        device=svc.device,
        input_shape=[settings.INPUT_SIZE, settings.INPUT_SIZE, 1],
        num_labels=len(CANONICAL_18_PATHOLOGIES),
        labels=list(CANONICAL_18_PATHOLOGIES),
        score_type="uncalibrated_model_scores_not_clinical_probabilities",
        clinical_scope_limitation=(
            "Outputs 18 radiographic finding activations. Does not output a dedicated "
            "Tuberculosis score, and Nodule, Mass, and Lung Lesion scores must never be "
            "presented as confirmed malignancy diagnoses."
        ),
    )


@router.post(
    "/api/v1/analyze",
    response_model=UnifiedTrustPassportResponse,
    tags=["Analysis"],
)
@router.post(
    "/api/analyze",
    response_model=UnifiedTrustPassportResponse,
    tags=["Analysis"],
)
async def analyze_xray(
    request: Request,
    file: Optional[UploadFile] = File(default=None),
    case_label: Optional[str] = Form(default=None),
    run_stability: bool = Query(default=True),
    run_ood: bool = Query(default=False),
) -> Any:
    """
    Analyze an uploaded chest radiograph in-memory and return the Unified Trust Passport.
    Never writes uploaded radiographs to disk (io.BytesIO only).
    """
    if file is None:
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "detail": "Missing required file upload.",
                "error": {
                    "code": "CORRUPT_IMAGE",
                    "message": "No image file provided in multipart upload.",
                },
            },
        )

    raw_bytes = await file.read()

    # In-memory security & magic-byte validation (FR-02)
    try:
        validate_image_bytes(raw_bytes, filename=file.filename or "")
    except UploadValidationError as exc:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "status": "error",
                "detail": exc.message,
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                },
            },
        )

    svc = _get_model_service(request)
    if not svc.is_ready:
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "detail": "Model weights are not loaded.",
                "error": {
                    "code": "MODEL_UNAVAILABLE",
                    "message": "DenseNet-121 model is currently unavailable.",
                },
            },
        )

    try:
        result = await run_in_threadpool(
            analysis_service_singleton.execute_analysis_pipeline,
            raw_bytes,
            svc,
            run_stability,
            run_ood,
            case_label,
        )
        return result
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "detail": f"Inference pipeline failed: {exc}",
                "error": {
                    "code": "INFERENCE_FAILED",
                    "message": f"Inference pipeline failed: {exc}",
                },
            },
        )


@router.get(
    "/api/v1/analysis/{analysis_id}",
    response_model=UnifiedTrustPassportResponse,
    tags=["Analysis"],
)
@router.get(
    "/api/analysis/{analysis_id}",
    response_model=UnifiedTrustPassportResponse,
    tags=["Analysis"],
)
async def get_cached_analysis_by_id(analysis_id: str) -> Any:
    """Retrieve a cached Trust Passport from the in-memory 100-item LRU store."""
    cached = analysis_service_singleton.get_cached_analysis(analysis_id)
    if cached is None:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis ID '{analysis_id}' not found in memory cache.",
        )
    return cached

