"""Image Quality Guardian (FR-05)."""

from typing import Any, Dict, List
import cv2
import numpy as np

from app.config import settings


def evaluate_image_quality(
    gray_8bit: np.ndarray, width: int, height: int
) -> Dict[str, Any]:
    """
    Evaluate technical radiograph suitability on standardized 8-bit [0, 255] grayscale image (FR-05).
    """
    warnings: List[str] = []

    # 1. Dimensions check (Min 224 x 224 px)
    if height < settings.STRICT_MODEL_MIN_DIMENSION or width < settings.STRICT_MODEL_MIN_DIMENSION:
        warnings.append("LOW_RESOLUTION")

    # 2. Brightness check: Mean pixel intensity
    brightness = float(np.mean(gray_8bit))
    if brightness < settings.BRIGHTNESS_MIN:
        warnings.append("UNDEREXPOSED")
    elif brightness > settings.BRIGHTNESS_MAX:
        warnings.append("OVEREXPOSED")

    # 3. RMS Contrast check: Standard deviation of pixel intensities
    contrast = float(np.std(gray_8bit))
    if contrast < settings.RMS_CONTRAST_MIN:
        warnings.append("LOW_CONTRAST")

    # 4. Blur estimation: Variance of Laplacian on 224x224 standardized view
    img_224 = cv2.resize(
        gray_8bit.astype(np.float32),
        (settings.INPUT_SIZE, settings.INPUT_SIZE),
        interpolation=cv2.INTER_AREA,
    )
    laplacian = cv2.Laplacian(img_224.astype(np.float64), cv2.CV_64F)
    blur_score = float(laplacian.var())
    if blur_score < settings.BLUR_VARIANCE_MIN:
        warnings.append("EXCESSIVE_BLUR")

    # 5. Readability / Dynamic Range: (P99 - P1) / 255.0
    p1, p99 = np.percentile(gray_8bit, [1.0, 99.0])
    dynamic_range = float((p99 - p1) / 255.0)
    if dynamic_range < settings.DYNAMIC_RANGE_MIN:
        warnings.append("BLANK_OR_CORRUPT_SIGNAL")

    # 6. Thoracic Central vs Lateral Profile Check
    # In chest radiographs, the spine/mediastinum center is denser than lateral lung zones
    if width >= 64:
        col_w = width // 3
        left_m = float(np.mean(gray_8bit[:, :col_w]))
        center_m = float(np.mean(gray_8bit[:, col_w : 2 * col_w]))
        right_m = float(np.mean(gray_8bit[:, 2 * col_w :]))
        if center_m < left_m * 0.45 and center_m < right_m * 0.45:
            warnings.append("ATYPICAL_ANATOMY")

    # Quality Status Classification
    critical_flags = {"LOW_RESOLUTION", "BLANK_OR_CORRUPT_SIGNAL", "ATYPICAL_ANATOMY", "NON_RADIOGRAPHIC_IMAGE"}
    if any(flag in critical_flags for flag in warnings) or len(warnings) >= 2:
        status = "inadequate"
    elif len(warnings) == 1:
        status = "suboptimal"
    else:
        status = "acceptable"

    return {
        "status": status,
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "blur_score": round(blur_score, 2),
        "dynamic_range": round(dynamic_range, 4),
        "dimensions": {"width": int(width), "height": int(height)},
        "warnings": warnings,
        "review_recommended": status != "acceptable",
    }

