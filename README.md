# LUNGUARD: Uncertainty-Aware Chest X-Ray Triage & Escalation Prototype

> **DEXATHON 2026 — Round 2 Prototype Submission (Software Project)**  
> **Submission Deadline:** October 28, 2026  
> **Round 2 Requirement:** Front-End Interface Code (`frontend/`)  
> **Developer:** Bharath (Solo Front-End / Full-Stack Track)  
> **Team:** Bharath, Vivek, Harshitha, Ananya

---

## Mandatory Clinical & Research Disclaimer

> **IMPORTANT:** Lunguard is an experimental research prototype intended to demonstrate uncertainty-aware chest X-ray decision support. It is **NOT** a certified diagnostic medical device, has not received regulatory clearance (FDA, CE, or CDSCO), and is **NOT** a substitute for professional radiological interpretation or microbiological testing.
>
> **No trained deep-learning model or clinical validation exists yet.** The prototype demonstrates the complete user interface, conformal decision-support architecture, and client-side safety guardrails. Outputs must not independently determine patient diagnosis or treatment.

---

## 1. Project Overview & Clinical Problem

In tuberculosis-endemic regions such as India, high clinical index of suspicion for TB is standard practice. However, several radiological presentations of active or chronic tuberculosis (e.g. apical cavitary disease, infiltrates, fibrotic scars, and solitary tuberculomas) can resemble pulmonary malignancy on plain chest radiographs.

This diagnostic overlap presents a tangible risk of **diagnostic anchoring**, where a lesion is presumed to be TB while an underlying neoplasm goes unrecognized during early treatable stages.

Rather than forcing an artificial, overconfident single-class diagnosis, **LUNGUARD** introduces an uncertainty-aware triage framework:
1. Generates **conformal prediction sets** guaranteeing statistical error coverage under exchangeability assumptions.
2. Applies a **deterministic safety policy** that abstains from forced single-label prediction when infectious and neoplastic boundaries overlap.
3. Routes cases into one of four standardized triage classifications, prioritizing clinician escalation for ambiguous presentations.

---

## 2. The Four Standardized Triage Outcomes

| Outcome | Visual Status | Clinical Definition & Guidance |
| :--- | :--- | :--- |
| **NORMAL** | Emerald • CheckCircle2 | *"No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings."* |
| **TB-CONSISTENT** | Warm Amber • AlertTriangle | *"Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required."* |
| **MALIGNANCY-SUSPICIOUS** | Crimson / Rose • AlertOctagon | *"Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended."* |
| **UNCERTAIN / DUAL-RISK** *(Key Focus)* | Deep Violet / Warning Shield | *"UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED. The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps."* |

*Note on Uncertainty:* An `UNCERTAIN / DUAL-RISK` outcome does **not** diagnose simultaneous dual disease. It indicates that the machine learning system cannot reliably differentiate the findings, and patient safety dictates immediate human clinician evaluation.

---

## 3. Project Structure

```
lunguard-medtech-ai/
├── frontend/                     # ← SUBMIT THIS FOLDER FOR ROUND 2
│   ├── src/
│   │   ├── components/
│   │   │   ├── analysis/        # ImageUploader, AnalysisProgressBar, NeutralErrorAlert
│   │   │   ├── layout/          # Header, DemoModeBanner, Footer
│   │   │   └── results/         # TriageBanner, ModelScoresPanel, ConformalSetPanel,
│   │   │                        # SafetyPolicyPanel, GradCamViewer, CaseSummaryPanel
│   │   ├── context/             # AppContext, useApp hook (system mode state)
│   │   ├── data/                # evaluation.json (typed unmeasured benchmark matrix)
│   │   ├── lib/                 # fileValidation.ts (magic bytes), schemas.ts (Zod)
│   │   ├── pages/               # Landing, Workspace, SafetyEngine, Evaluation
│   │   ├── services/            # apiClient.ts (real API), demoSimulator.ts (simulated scenarios)
│   │   ├── tests/               # Vitest test suite (27 unit tests)
│   │   ├── types/               # api.ts (TypeScript API contract types)
│   │   ├── App.tsx
│   │   ├── index.css            # Tailwind + self-hosted Inter font + print stylesheet
│   │   └── main.tsx
│   ├── public/                  # Favicon & sample CXR verification assets
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   └── README.md                # Planned FastAPI service architecture & specification
├── docs/
│   ├── PLAN.md                  # Development plan & execution logs
│   ├── API_CONTRACT.md          # Formal REST API contract & Zod schemas
│   └── DESIGN_NOTES.md          # Clinical palette, typography, & accessibility decisions
├── scripts/
│   └── generate_test_images.mjs # Sample image generation for verification
├── .gitignore
└── README.md                    # Root project documentation (this file)
```

---

## 4. Submission Instructions for Round 2

The DEXATHON 2026 Round 2 requirements call for the **Front-End Interface Code**.
- **Submission Folder:** Submit the `frontend/` directory (along with root `README.md` and `docs/`).
- **Dependencies:** All dependencies are declared in `frontend/package.json`. No external CDNs or remote font services are loaded at runtime.

---

## 5. Setup & Running Instructions (Windows PowerShell)

Ensure Node.js (version 18+; tested on Node v22.21.0, npm 10.9.4) is installed.

### Step 1: Open Windows PowerShell and navigate to the front-end directory
```powershell
cd "c:\Users\viji\OneDrive\Desktop\lunguard medtech ai\frontend"
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Run the Development Server
```powershell
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### Step 4: Run the Automated Verification Suite
```powershell
# 1. Typecheck (strict mode)
npm run typecheck

# 2. Linting (clean zero warnings)
npm run lint

# 3. Unit & Integration Tests (Vitest)
npm run test

# 4. Production Build Bundle
npm run build
```

---

## 6. How to Use Simulated Demo Mode

Because there is no live model or backend running yet, LUNGUARD includes a **Simulated Demo Mode**:
1. When you first launch the app with the backend offline, the top header indicates `Backend Offline`.
2. Click **"Enter Simulated Demo Mode"** in the header banner.
3. A persistent amber banner will lock across the top:
   > *"SIMULATED DEMO MODE. Results below are scripted examples, not real AI inference on your image."*
4. In the banner or dropzone, select any of the four scenarios:
   - **Scenario 1:** `Uncertain / Dual-Risk (Key Focus)`
   - **Scenario 2:** `TB-Consistent`
   - **Scenario 3:** `Malignancy-Suspicious`
   - **Scenario 4:** `Normal`
5. On the **Analysis Workspace** (`/workspace`):
   - Click **"Load Sample CXR (512×512)"** (or drag and drop your own CXR file).
   - Click **"Analyze X-ray"**.
   - Watch the multi-step progress bar transition through Preprocessing, Feature Extraction, Conformal Set Construction, and Safety Policy Evaluation.
   - Inspect the resulting **Triage Banner**, **Model Output Scores**, **Conformal Prediction Set**, **Safety Policy Firewall Reasons**, **Grad-CAM Attention Heatmap** (with opacity slider and side-by-side / overlay toggles), and **Case Summary**.
6. Test error validation by clicking **"Test Spoofed File"** or **"Test Undersized"** in the dropzone to observe immediate client-side rejection before any inference is requested.

---

## 7. Environment Variables (`frontend/.env.example`)

Copy `.env.example` to `.env` to override default settings:

```env
# Backend API Base URL (FastAPI)
VITE_API_BASE_URL=http://localhost:8000

# Set to true to start directly in Simulated Demo Mode without probing backend
VITE_DEMO_MODE=false
```

---

## 8. How a Python/FastAPI Backend Connects Later

The front-end is decoupled from the simulator and communicates through a typed API client (`src/services/apiClient.ts`). When the backend is ready:

1. Launch the FastAPI service on `http://localhost:8000`.
2. Ensure backend CORS allows `http://localhost:5173`.
3. The front-end will automatically detect the backend via `GET /api/health` and switch from `Backend Offline` to `LIVE INFERENCE`.
4. Uploading an image in Live Mode sends a `multipart/form-data` POST request to `POST /api/analyze`.
5. Responses are validated at runtime against Zod schemas in `src/lib/schemas.ts`.
6. Full request/response contracts and error envelopes are documented in [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).

---

## 9. Datasets Under Consideration & Attributions

Developing and evaluating the future model relies on public research cohorts:
1. **NIH ChestX-ray14:** National Institutes of Health Clinical Center (112,120 frontal chest radiographs).
2. **Shenzhen TB Dataset:** Shenzhen No. 3 People's Hospital & U.S. National Library of Medicine.
3. **Montgomery County TB Set:** Department of Health and Human Services of Montgomery County, Maryland.
4. **Stanford CheXpert:** Stanford ML Group (224,316 chest radiographs).

*Dataset Caveat:* These datasets differ in acquisition parameters, patient demographics, and label definitions. None of them jointly provide confirmed biopsy-verified labels for co-occurring TB and lung malignancy. Independent calibration and prospective validation remain mandatory.

---

## 10. Known Limitations

1. **Simulation in Round 2:** The Grad-CAM heatmaps and model scores rendered in Demo Mode are scripted prototype examples.
2. **Exchangeability Assumption:** The theoretical coverage guarantee of conformal prediction ($1 - \alpha$) holds only when test patients follow the calibration data distribution.
3. **Engineering Target vs Result:** The 98% malignancy-sensitivity figure is an **engineering design specification**, not an experimentally achieved or clinically validated statistic.
