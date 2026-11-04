"""Pytest fixtures and synthetic in-memory chest X-ray generators."""

import io
import os
import sys
import numpy as np
from PIL import Image
import pytest

# Ensure backend directory is on sys.path
BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


def make_synthetic_xray_bytes(
    width: int = 512,
    height: int = 512,
    fmt: str = "PNG",
    seed: int = 101,
    mean_brightness: float = 115.0,
    contrast_std: float = 42.0,
) -> bytes:
    """Create a realistic-looking synthetic chest radiograph in-memory with rib/lung gradients."""
    rng = np.random.default_rng(seed)
    y = np.linspace(-1.0, 1.0, height)[:, None]
    x = np.linspace(-1.0, 1.0, width)[None, :]

    # Simulated thoracic cage + dual lung radiolucent fields + high-frequency edge detail
    thorax = np.exp(-(x**2 * 1.4 + y**2 * 1.2))
    left_lung = np.exp(-(((x - 0.35) / 0.28) ** 2 + ((y + 0.05) / 0.55) ** 2))
    right_lung = np.exp(-(((x + 0.35) / 0.28) ** 2 + ((y + 0.05) / 0.55) ** 2))
    ribs = 0.12 * np.sin(y * 28.0) * thorax

    base = thorax - 0.55 * (left_lung + right_lung) + ribs
    base = (base - base.mean()) / (base.std() + 1e-6)

    # Add fine anatomical texture so Laplacian blur variance is well above threshold (>40)
    fine_texture = rng.normal(0.0, 0.35, size=(height, width))
    img = mean_brightness + (base * contrast_std * 0.85) + (fine_texture * contrast_std * 0.45)
    img_u8 = np.clip(img, 0, 255).astype(np.uint8)

    pil_img = Image.fromarray(img_u8, mode="L")
    buf = io.BytesIO()
    pil_img.save(buf, format=fmt)
    return buf.getvalue()


@pytest.fixture(scope="session")
def synthetic_png_bytes() -> bytes:
    return make_synthetic_xray_bytes(512, 512, fmt="PNG")


@pytest.fixture(scope="session")
def synthetic_jpeg_bytes() -> bytes:
    return make_synthetic_xray_bytes(512, 512, fmt="JPEG")

