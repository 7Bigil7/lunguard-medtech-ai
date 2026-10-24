# LUNGUARD Backend (Planned Architecture)

> **Status:** Research Prototype Architecture Specification — Not Implemented in Round 2.  
> The Round 2 DEXATHON 2026 deliverable focuses exclusively on the front-end user interface and decision-support workflow.

---

## Overview

The planned LUNGUARD backend will be a Python service using **FastAPI**, designed to execute conformal uncertainty-aware triage on digitized chest X-rays.

When implemented, the backend will expose the REST API defined in [docs/API_CONTRACT.md](../docs/API_CONTRACT.md).

---

## Planned Pipeline Components

1. **Inference Engine (`PyTorch` / `TorchXRayVision` / `DenseNet-121`):**
   - Preprocessing: Standardize image resizing (224x224 or 512x512), histogram equalization, and normalization.
   - Backbone: DenseNet-121 pre-trained on chest radiographs (e.g. CheXpert / NIH ChestX-ray14) with fine-tuning for TB and malignancy detection.
   - Output: Raw logits and Platt/temperature-calibrated probabilities across classes (`normal`, `tb_consistent`, `malignancy_suspicious`).

2. **Conformal Prediction Layer (`MAPIE` / Custom Split Conformal):**
   - Applies inductive/split conformal prediction calibrated on an independent holdout set.
   - Computes prediction sets $C(X) \subseteq \{\text{normal}, \text{tb\_consistent}, \text{malignancy\_suspicious}\}$ with statistical coverage guarantee $1 - \alpha$ under exchangeability.

3. **Deterministic Safety Policy:**
   - Evaluates the prediction set and raw confidence margins.
   - **Abstention triggers:** Multi-class prediction sets containing high-risk classes (e.g. both TB and Malignancy), empty prediction sets, or borderline confidence.
   - Emits one of four triage classifications:
     - `NORMAL`
     - `TB_CONSISTENT`
     - `MALIGNANCY_SUSPICIOUS`
     - `UNCERTAIN_DUAL_RISK`

4. **Explainability (`Grad-CAM`):**
   - Computes gradient-weighted class activation maps from the final convolutional layer of DenseNet-121 for suspicious classes.
   - Converts the activation map into an alpha-composited PNG base64 stream for visual inspection.

---

## Target API Endpoints

- `GET /api/health`: Health probe reporting model loading status and runtime mode.
- `POST /api/analyze`: Multipart image upload endpoint returning structured triage classification, prediction sets, and explainability overlay.

For full schema details, consult [`docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

---

## Planned Directory Structure

```
backend/
├── app/
│   ├── api/          # FastAPI routers and route handlers
│   ├── core/         # Configuration, logging, safety policy
│   ├── models/       # PyTorch DenseNet-121 architecture & weights
│   ├── conformal/    # MAPIE / Conformal calibration and inference
│   ├── explain/      # Grad-CAM implementation
│   └── schemas/      # Pydantic models matching API_CONTRACT.md
├── tests/
├── requirements.txt
└── main.py
```
