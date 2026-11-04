"""Zero-Trust Image Upload & In-Memory Magic-Byte Validation (FR-02)."""

import io
from typing import Tuple
import numpy as np
from PIL import Image

from app.config import settings

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
JPEG_MAGIC = b"\xff\xd8\xff"


class UploadValidationError(Exception):
    """Exception raised when an uploaded file fails security or integrity validation."""

    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


def validate_image_bytes(raw_bytes: bytes, filename: str = "") -> Tuple[int, int, str]:
    """
    Validate raw image bytes strictly in memory (io.BytesIO — zero disk writes) per FR-02:
    1. Reject empty files (0 bytes -> HTTP 400)
    2. Reject oversized files (>10 MB -> HTTP 413)
    3. Verify binary magic headers (PNG \\x89PNG\\r\\n\\x1a\\n or JPEG \\xff\\xd8\\xff -> HTTP 415)
    4. Verify stream integrity via PIL.Image.verify() (corrupted -> HTTP 422)
    5. Verify minimum dimensions (below 128x128 -> HTTP 422 IMAGE_TOO_SMALL)
    6. Verify radiograph plausibility: reject full-color photos, non-radiographic aspect ratios,
       and blank/document images (HTTP 422 NON_RADIOGRAPHIC_IMAGE).
    """
    if not raw_bytes or len(raw_bytes) == 0:
        raise UploadValidationError(
            status_code=400,
            code="CORRUPT_IMAGE",
            message="Uploaded file is empty (0 bytes).",
        )

    if len(raw_bytes) > settings.max_upload_bytes:
        raise UploadValidationError(
            status_code=413,
            code="FILE_TOO_LARGE",
            message=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB} MB.",
        )

    is_png = raw_bytes.startswith(PNG_MAGIC)
    is_jpeg = raw_bytes.startswith(JPEG_MAGIC)
    if not (is_png or is_jpeg):
        raise UploadValidationError(
            status_code=415,
            code="INVALID_FILE_TYPE",
            message="Unsupported file signature. Only valid PNG and JPEG images are supported.",
        )

    # PIL integrity verification in-memory
    try:
        with Image.open(io.BytesIO(raw_bytes)) as img_verify:
            img_verify.verify()

        with Image.open(io.BytesIO(raw_bytes)) as img_check:
            img_check.load()
            width, height = img_check.size
            fmt = img_check.format or ("PNG" if is_png else "JPEG")
            mode = img_check.mode

            # Radiograph Plausibility Check 1: Aspect Ratio
            aspect_ratio = float(width) / float(height if height > 0 else 1)
            if aspect_ratio < 0.35 or aspect_ratio > 2.50:
                raise UploadValidationError(
                    status_code=422,
                    code="INVALID_ASPECT_RATIO",
                    message=(
                        f"Image aspect ratio ({aspect_ratio:.2f}) is atypical for chest radiography. "
                        "Expected standard frontal PA or AP orientation (between 0.35 and 2.50)."
                    ),
                )

            # Radiograph Plausibility Check 2: Color Saturation (Reject random color photos)
            if mode in ("RGB", "RGBA"):
                arr = np.array(img_check)
                if arr.ndim == 3 and arr.shape[2] >= 3:
                    h, w = arr.shape[:2]
                    step = max(1, int(np.sqrt((h * w) / 40000)))
                    sub = arr[::step, ::step, :3].astype(np.float32)
                    r = sub[:, :, 0]
                    g = sub[:, :, 1]
                    b = sub[:, :, 2]
                    channel_diff = np.maximum(
                        np.abs(r - g), np.maximum(np.abs(r - b), np.abs(g - b))
                    )
                    mean_color_diff = float(np.mean(channel_diff))
                    median_color_diff = float(np.median(channel_diff))

                    # Clinical radiographs are monochromatic (median color diff ~ 0.0), even if they have
                    # small colored burned-in markers (like green/yellow "L" or "R" labels).
                    # Natural color photos (selfies, cars, pets, nature) have median_color_diff > 25.0 and mean > 40.0
                    if median_color_diff > 25.0 and mean_color_diff > 40.0:
                        raise UploadValidationError(
                            status_code=422,
                            code="NON_RADIOGRAPHIC_IMAGE",
                            message=(
                                f"Uploaded file appears to be a full-color photograph (color deviation {mean_color_diff:.1f} > 40.0). "
                                "LUNGUARD strictly requires monochromatic chest radiographs."
                            ),
                        )

            # Radiograph Plausibility Check 3: Reject text documents, UI screenshots, mockups, or blank screens
            if mode in ("RGB", "RGBA"):
                gray_sub = 0.2989 * r + 0.5870 * g + 0.1140 * b
            else:
                arr_gray = np.array(img_check)
                h, w = arr_gray.shape[:2]
                step = max(1, int(np.sqrt((h * w) / 40000)))
                gray_sub = arr_gray[::step, ::step].astype(np.float32)

            mean_brightness = float(np.mean(gray_sub))
            near_white_pct = float(np.mean(gray_sub > 235))
            near_black_pct = float(np.mean(gray_sub < 5))

            # UI mockups, documents, and web screenshots have bright white/light canvas backgrounds (>45% white or mean > 185)
            if mean_brightness > 185.0 or near_white_pct > 0.45:
                raise UploadValidationError(
                    status_code=422,
                    code="NON_RADIOGRAPHIC_IMAGE",
                    message=(
                        f"Uploaded image appears to be a graphic mockup, UI screenshot, or document (mean brightness {mean_brightness:.1f}, {near_white_pct * 100:.1f}% white canvas). "
                        "LungGuard strictly requires diagnostic chest radiographs with anatomical thoracic parenchyma."
                    ),
                )
            if near_black_pct > 0.94 or mean_brightness < 15.0:
                raise UploadValidationError(
                    status_code=422,
                    code="NON_RADIOGRAPHIC_IMAGE",
                    message="Uploaded image is predominantly blank or completely underexposed. LungGuard requires diagnostic chest X-ray radiographs.",
                )

    except UploadValidationError:
        raise
    except Exception as exc:
        raise UploadValidationError(
            status_code=422,
            code="CORRUPT_IMAGE",
            message=f"Corrupted or unreadable image stream: {exc}",
        ) from exc

    if width < settings.MIN_IMAGE_DIMENSION or height < settings.MIN_IMAGE_DIMENSION:
        raise UploadValidationError(
            status_code=422,
            code="IMAGE_TOO_SMALL",
            message=(
                f"Image dimensions ({width}x{height}) are below minimum required "
                f"{settings.MIN_IMAGE_DIMENSION}x{settings.MIN_IMAGE_DIMENSION} pixels."
            ),
        )

    return width, height, fmt


