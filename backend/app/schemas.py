"""Pydantic v2 Unified Trust Passport & Backward/Forward Compatible Schemas."""

from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class LegacyThreeClassScores(BaseModel):
    normal: float = Field(..., ge=0.0, le=1.0)
    tb_consistent: float = Field(..., ge=0.0, le=1.0)
    malignancy_suspicious: float = Field(..., ge=0.0, le=1.0)


class ModelInfoBlock(BaseModel):
    name: str = "DenseNet-121"
    version: str = "densenet121-res224-all"
    device: str = "cpu"
    score_type: str = "uncalibrated_model_scores"
    scores: LegacyThreeClassScores
    calibrated: bool = False


class TopFindingItem(BaseModel):
    label: str
    score: float


class ImageDimensions(BaseModel):
    width: int
    height: int


class ImageQualityReport(BaseModel):
    status: Literal["acceptable", "suboptimal", "inadequate"]
    brightness: float
    contrast: float
    blur_score: float
    dynamic_range: float
    dimensions: ImageDimensions
    warnings: List[str]
    review_recommended: bool


class StabilityReport(BaseModel):
    status: Literal["stable", "moderate_instability", "unstable", "skipped"]
    tests_run: int
    score: Optional[float] = None
    mean_score_variation: Optional[float] = None
    max_score_delta: Optional[float] = None
    disagreement_rate: Optional[float] = None


class UncertaintyReport(BaseModel):
    status: Literal["calibrated", "not_calibrated"]
    prediction_set: Optional[List[str]] = None
    ambiguous_findings: List[str] = Field(default_factory=list)


class OODReport(BaseModel):
    status: Literal["in_distribution", "out_of_distribution", "not_implemented"]
    score: Optional[float] = None
    threshold: Optional[float] = None


class TrustGuardReport(BaseModel):
    decision: Literal["unreliable_input", "review_recommended", "standard_triage"]
    priority_rule: str
    triggered_rules: List[str]
    reasons: List[str]
    safe_for_automated_clearance: bool = False
    clinical_disclaimer: str


class ConformalFrontendBlock(BaseModel):
    prediction_set: List[Literal["normal", "tb_consistent", "malignancy_suspicious"]]
    target_coverage: Optional[float] = None
    method: str


class SafetyPolicyFrontendBlock(BaseModel):
    version: str
    abstained: bool
    triggered_rules: List[str]
    reasons: List[str]


class ExplainabilityFrontendBlock(BaseModel):
    available: bool
    method: Optional[Literal["gradcam"]] = None
    heatmap_png_base64: Optional[str] = None
    note: Optional[str] = None


class UnifiedTrustPassportResponse(BaseModel):
    """
    Canonical Trust Passport JSON Contract (PRD Section 6) unified with the
    existing Antigravity Frontend AnalysisResponseSchema.
    """

    # Canonical Trust Passport v2.0 fields
    analysis_id: str
    timestamp_utc: str
    processing_time_ms: float
    status: Literal["completed"] = "completed"
    model: ModelInfoBlock
    predictions: Dict[str, float]
    top_findings: List[TopFindingItem]
    image_quality: ImageQualityReport
    stability: StabilityReport
    uncertainty: UncertaintyReport
    ood: OODReport
    trustguard: TrustGuardReport

    # Existing Frontend Backward-Compatible fields
    case_id: str
    mode: Literal["inference", "simulated"] = "inference"
    simulated: bool = False
    timestamp: str
    conformal: ConformalFrontendBlock
    safety_policy: SafetyPolicyFrontendBlock
    triage: Literal[
        "NORMAL", "TB_CONSISTENT", "MALIGNANCY_SUSPICIOUS", "UNCERTAIN_DUAL_RISK"
    ]
    explainability: ExplainabilityFrontendBlock
    limitations: List[str]


class HealthResponseModel(BaseModel):
    status: str = "ok"
    health_status: str = "healthy"
    model_loaded: bool
    mode: Literal["inference", "development"] = "inference"
    model_name: Optional[str] = "DenseNet-121"
    device: str = "cpu"
    policy_version: Optional[str] = "trustguard-v2.0"
    version: str = "2.0.0"


class ModelMetadataEndpointResponse(BaseModel):
    model_name: str
    weights_version: str
    device: str
    input_shape: List[int]
    num_labels: int
    labels: List[str]
    score_type: str
    clinical_scope_limitation: str

