# LUNGUARD API Specification & Contract

**Version:** 1.0.0-draft  
**Protocol:** HTTP/1.1 REST + JSON  
**Base URL:** Configurable via `VITE_API_BASE_URL` (default: `http://localhost:8000`)  
**CORS Policy:** The backend service must permit origins: `http://localhost:5173` (Vite dev server) and `http://127.0.0.1:5173`. Supported headers: `Content-Type`, `Accept`.

---

## 1. Endpoints

### 1.1 Health Check Probe
- **Endpoint:** `GET /api/health`
- **Description:** Verifies service availability, model readiness, and active inference mode.
- **Success Response:** `200 OK`
```json
{
  "status": "ok",
  "model_loaded": true,
  "mode": "inference",
  "model_name": "DenseNet-121-CXR-v1.0",
  "policy_version": "v1.2-conservative",
  "version": "1.0.0"
}
```
*Note:* If `model_loaded` is `false`, the front-end marks the backend as unavailable for live inference.

---

### 1.2 Image Analysis & Triage
- **Endpoint:** `POST /api/analyze`
- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  - `file`: (Required, binary) Chest radiograph in PNG or JPEG format. Max size: 10 MB (10,485,760 bytes). Minimum dimensions: 224x224 px.
  - `case_label`: (Optional, string) User-supplied non-PHI identifier.
- **Success Response:** `200 OK`
```json
{
  "case_id": "LGD-20261023-8942",
  "status": "completed",
  "mode": "inference",
  "simulated": false,
  "timestamp": "2026-10-23T15:20:00.000Z",
  "model": {
    "name": "DenseNet-121-CXR-v1.0",
    "scores": {
      "normal": 0.12,
      "tb_consistent": 0.68,
      "malignancy_suspicious": 0.74
    },
    "calibrated": false
  },
  "conformal": {
    "prediction_set": [
      "tb_consistent",
      "malignancy_suspicious"
    ],
    "target_coverage": 0.95,
    "method": "split_conformal_lac"
  },
  "safety_policy": {
    "version": "v1.2-conservative",
    "abstained": true,
    "triggered_rules": [
      "RULE_MULTI_CLASS_HIGH_RISK_OVERLAP",
      "RULE_MALIGNANCY_SENSITIVITY_THRESHOLD"
    ],
    "reasons": [
      "Prediction set includes both TB-consistent and Malignancy-suspicious classes with non-separable confidence margins.",
      "Safety policy triggered abstention to mandate clinician differential evaluation."
    ]
  },
  "triage": "UNCERTAIN_DUAL_RISK",
  "explainability": {
    "available": true,
    "method": "gradcam",
    "heatmap_png_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "note": "Heatmaps show where the model's attention was concentrated. They do not prove a diagnosis."
  },
  "limitations": [
    "Prototype model trained on retrospective public cohorts; external hospital calibration is pending.",
    "Raw scores represent uncalibrated sigmoid activations.",
    "Conformal prediction guarantee assumes exchangeability between training and test distributions."
  ]
}
```

---

## 2. Triage Output Enum
The `triage` field in the response must be strictly one of the following four enum values:

| Enum Code | Label | Clinical Meaning |
| :--- | :--- | :--- |
| `NORMAL` | Normal | No significant abnormality identified by the model. |
| `TB_CONSISTENT` | TB-Consistent | Radiological features consistent with active/prior tuberculosis. |
| `MALIGNANCY_SUSPICIOUS` | Malignancy-Suspicious | Pulmonary nodule, mass, or consolidation suspicious for neoplastic process. |
| `UNCERTAIN_DUAL_RISK` | Uncertain / Dual-Risk | Ambiguous, overlapping, or abstained model prediction requiring urgent clinician escalation. |

---

## 3. Standard Error Envelope
All `4xx` and `5xx` errors return a standard JSON structure:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only valid PNG and JPEG images are supported."
  }
}
```

### Recognized Error Codes:
- `INVALID_FILE_TYPE`: File extension or magic bytes do not match PNG/JPEG.
- `FILE_TOO_LARGE`: Payload exceeds 10 MB limit.
- `CORRUPT_IMAGE`: Payload cannot be decoded as a valid image.
- `IMAGE_TOO_SMALL`: Image dimensions are below 224x224 pixels.
- `MODEL_UNAVAILABLE`: Backend model is not loaded or runtime memory error occurred.
- `INFERENCE_FAILED`: Forward pass failed during inference or Grad-CAM computation.
- `INTERNAL_ERROR`: Unhandled backend exception.
