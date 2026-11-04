"""Configuration and thresholds for LUNGGUARD v2.0 FastAPI Backend."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and clinical safety thresholds."""

    APP_NAME: str = "LUNGGUARD v2.0 API"
    APP_VERSION: str = "2.0.0"
    POLICY_VERSION: str = "trustguard-v2.0"

    # Model settings
    MODEL_NAME: str = "DenseNet-121"
    MODEL_WEIGHTS: str = "densenet121-res224-all"
    INPUT_SIZE: int = 224

    # Upload & security constraints (FR-02)
    MAX_UPLOAD_SIZE_MB: int = 10
    MIN_IMAGE_DIMENSION: int = 128  # Supports 128+ for frontend tests, flags <224 as LOW_RESOLUTION
    STRICT_MODEL_MIN_DIMENSION: int = 224

    # CORS origins for existing frontend
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Image Quality Guardian thresholds (FR-05)
    BRIGHTNESS_MIN: float = 40.0
    BRIGHTNESS_MAX: float = 215.0
    RMS_CONTRAST_MIN: float = 25.0
    BLUR_VARIANCE_MIN: float = 40.0
    DYNAMIC_RANGE_MIN: float = 0.20

    # Stability Challenge thresholds (FR-06)
    TRIAGE_THRESHOLD: float = 0.50
    STABLE_MAX_DELTA: float = 0.12
    MODERATE_MAX_DELTA: float = 0.20
    STABLE_DISAGREEMENT: float = 0.10
    PERTURBATION_SEED: int = 42

    # Cache configuration
    LRU_CACHE_SIZE: int = 100

    model_config = SettingsConfigDict(env_prefix="LUNGGUARD_", extra="ignore")

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


settings = Settings()

