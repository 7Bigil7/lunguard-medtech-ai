"""Singleton DenseNet-121 Model Service (FR-01)."""

from typing import Optional
from app.ml_engine.model import DenseNet121Engine


class ModelService:
    """Manages the singleton DenseNet-121 model instance across the FastAPI lifespan."""

    def __init__(self):
        self.engine = DenseNet121Engine()

    def initialize(self) -> bool:
        """Load the pretrained TorchXRayVision DenseNet-121 weights."""
        return self.engine.load()

    @property
    def is_ready(self) -> bool:
        return self.engine.model_loaded and self.engine.model is not None

    @property
    def device(self) -> str:
        return self.engine.device


# Default module-level singleton fallback
model_service_singleton = ModelService()

