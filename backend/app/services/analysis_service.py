"""Threadpool Pipeline Orchestrator & 100-item In-Memory LRU Store."""

from collections import OrderedDict
from datetime import datetime, timezone
import time
from typing import Any, Dict, Optional
import uuid

from app.config import settings
from app.ml_engine.image_quality import evaluate_image_quality
from app.ml_engine.inference import derive_legacy_3class_scores, map_18_scores
from app.ml_engine.ood_detection import evaluate_ood
from app.ml_engine.preprocessing import decode_and_extract_grayscale, preprocess_for_xrv
from app.ml_engine.stability import run_vectorized_inference_and_stability
from app.ml_engine.trustguard import evaluate_trustguard, map_to_frontend_safety_and_triage
from app.ml_engine.uncertainty import build_legacy_conformal_set, evaluate_conformal_uncertainty
from app.services.model_service import ModelService


class AnalysisService:
    """Orchestrates end-to-end radiograph analysis and maintains an in-memory LRU cache."""

    def __init__(self, max_cache_size: int = settings.LRU_CACHE_SIZE):
        self.max_cache_size = max_cache_size
        self._cache: "OrderedDict[str, Dict[str, Any]]" = OrderedDict()

    def _put_cache(self, analysis_id: str, payload: Dict[str, Any]) -> None:
        if analysis_id in self._cache:
            self._cache.move_to_end(analysis_id)
        self._cache[analysis_id] = payload
        while len(self._cache) > self.max_cache_size:
            self._cache.popitem(last=False)

    def get_cached_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        if analysis_id in self._cache:
            self._cache.move_to_end(analysis_id)
            return self._cache[analysis_id]
        return None

    def execute_analysis_pipeline(
        self,
        raw_bytes: bytes,
        model_service: ModelService,
        run_stability: bool = True,
        run_ood: bool = False,
        case_label: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Execute the synchronous 5-stage analysis pipeline (designed to run inside FastAPI's
        run_in_threadpool worker so the async event loop is never blocked).
        """
        t0 = time.perf_counter()

        # 1. Decode in-memory & run ImageQualityGuardian (FR-05)
        gray_8bit, raw_gray, maxval, width, height = decode_and_extract_grayscale(raw_bytes)
        image_quality = evaluate_image_quality(gray_8bit, width, height)

        # 2. TorchXRayVision Preprocessing (FR-03)
        preprocessed_tensor = preprocess_for_xrv(
            raw_gray,
            maxval=maxval,
            target_size=settings.INPUT_SIZE,
            device=model_service.device,
        )

        # 3. Vectorized DenseNet-121 Inference & Stability Challenge (FR-04, FR-06)
        primary_scores, primary_features, stability = run_vectorized_inference_and_stability(
            model_service.engine,
            preprocessed_tensor,
            run_stability=run_stability,
        )
        predictions, top_findings = map_18_scores(
            primary_scores, model_service.engine.pathologies
        )
        legacy_3class = derive_legacy_3class_scores(predictions)

        # Compute spatial saliency heatmap for existing frontend Grad-CAM overlay
        heatmap_b64 = model_service.engine.generate_saliency_heatmap_base64(preprocessed_tensor)

        # 4. Reliability Hooks: Conformal Uncertainty & Penultimate Feature OOD (FR-07, FR-08)
        uncertainty = evaluate_conformal_uncertainty(predictions)
        ood = evaluate_ood(primary_features, run_ood=run_ood)
        legacy_conformal = build_legacy_conformal_set(legacy_3class, uncertainty)

        # 5. TrustGuard Deterministic Safety Engine (FR-09, FR-10)
        trustguard = evaluate_trustguard(
            image_quality=image_quality,
            ood=ood,
            stability=stability,
            uncertainty=uncertainty,
            predictions=predictions,
        )
        safety_policy, triage = map_to_frontend_safety_and_triage(
            trustguard=trustguard,
            legacy_3class_scores=legacy_3class,
            legacy_conformal=legacy_conformal,
        )

        elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 2)
        analysis_uuid = str(uuid.uuid4())
        case_id = case_label.strip() if (case_label and case_label.strip()) else f"LGD-{analysis_uuid[:8].upper()}"
        iso_now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        passport: Dict[str, Any] = {
            "analysis_id": analysis_uuid,
            "timestamp_utc": iso_now,
            "processing_time_ms": elapsed_ms,
            "status": "completed",
            "model": {
                "name": settings.MODEL_NAME,
                "version": settings.MODEL_WEIGHTS,
                "device": model_service.device,
                "score_type": "uncalibrated_model_scores",
                "scores": legacy_3class,
                "calibrated": False,
            },
            "predictions": predictions,
            "top_findings": top_findings,
            "image_quality": image_quality,
            "stability": stability,
            "uncertainty": uncertainty,
            "ood": ood,
            "trustguard": trustguard,
            # Existing Frontend Backward-Compatible Fields
            "case_id": case_id,
            "mode": "inference",
            "simulated": False,
            "timestamp": iso_now,
            "conformal": legacy_conformal,
            "safety_policy": safety_policy,
            "triage": triage,
            "explainability": {
                "available": heatmap_b64 is not None,
                "method": "gradcam" if heatmap_b64 is not None else None,
                "heatmap_png_base64": heatmap_b64,
                "note": (
                    "Convolutional spatial activation map extracted from DenseNet-121 final feature block. "
                    "Heatmaps indicate model attention and do not prove a diagnosis."
                ),
            },
            "limitations": [
                "Pretrained DenseNet-121 (densenet121-res224-all) outputs 18 radiographic finding activations, not calibrated clinical probabilities.",
                "Model does not output a dedicated Tuberculosis score; Nodule, Mass, and Lung Lesion activations are not confirmed malignancy diagnoses.",
                "TrustGuard never declares a patient healthy or cleared; clinical correlation is mandatory.",
            ],
        }

        self._put_cache(analysis_uuid, passport)
        self._put_cache(case_id, passport)
        return passport


analysis_service_singleton = AnalysisService()

