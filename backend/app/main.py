"""FastAPI Application Entrypoint & Singleton Lifespan Loader (FR-01)."""

from contextlib import asynccontextmanager
from typing import Any, Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from app.api.routes import router
from app.config import settings
from app.services.model_service import model_service_singleton


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load DenseNet-121 once on startup and store on app.state.model_service."""
    model_service_singleton.initialize()
    app.state.model_service = model_service_singleton
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "LUNGGUARD v2.0 — AI-assisted chest X-ray triage & multi-layer reliability "
        "assessment service (TorchXRayVision DenseNet-121 + TrustGuard Safety Engine)."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root_index() -> Dict[str, Any]:
    """Root endpoint welcoming visitors and providing navigation links."""
    return {
        "service": "LUNGGUARD v2.0 AI Backend",
        "status": "healthy",
        "model": "TorchXRayVision DenseNet-121 (densenet121-res224-all)",
        "interactive_api_docs": "http://localhost:8000/docs",
        "health_check": "http://localhost:8000/api/health",
        "frontend_website": "http://localhost:5173",
        "message": (
            "To view the LUNGUARD 3D animated web application, open http://localhost:5173. "
            "To test the backend API interactively, open http://localhost:8000/docs."
        ),
    }


app.include_router(router)
