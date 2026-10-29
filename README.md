# LUNGUARD: Uncertainty-Aware Chest X-Ray Triage & Escalation Prototype

> **DEXATHON 2K26 — Round 2 Prototype Submission**  
> **Submission Deadline:** October 28, 2026, 11:00 PM  
> **Round 2 Scope:** Front-End Research Prototype Interface (`frontend/`)  
> **Project URL (Local):** `http://localhost:5173` (Development) or `http://localhost:4173` (Production Preview)  
> **Operating Environment:** Windows PC (PowerShell)  

---

## ⚠️ Mandatory Research & Clinical Disclaimer

> **CRITICAL DISCLAIMER:** LUNGUARD is an experimental research prototype created for demonstration purposes. It is **NOT** a certified diagnostic medical device, has **NOT** received regulatory clearance or approval (FDA, CE, CDSCO, or WHO), and is **NOT** clinically validated or suitable for clinical practice.
>
> **No trained machine-learning model or live backend inference is active in this prototype.** All model scores, conformal prediction sets, and Grad-CAM visualizations displayed in demo mode are deterministic, scripted illustrative examples. Numbers do **NOT** represent clinically calibrated probabilities. This software must never be used to guide patient diagnosis, triage, or clinical management.

---

## 1. Clinical Context & The Core Idea

In tuberculosis-endemic regions such as India, high clinical index of suspicion for TB is standard practice. However, several radiological presentations of active or chronic tuberculosis (apical cavitary disease, infiltrates, fibrotic volume loss, and solitary tuberculomas) closely resemble pulmonary malignancy on plain chest radiographs.

This diagnostic overlap presents a significant clinical hazard: **diagnostic anchoring**, where an abnormal opacity is reflexively assumed to be TB, delaying the diagnosis and oncological workup of a curable early-stage lung cancer.

### The LUNGUARD Approach: Uncertainty-Aware Triage with Abstention
Rather than forcing an overconfident, single-label classification on ambiguous films, LUNGUARD implements:
1. **Conformal Prediction Sets**: Constructs statistical multi-label prediction sets with rigorous error coverage guarantees under exchangeability assumptions.
2. **Deterministic Safety Policy Engine**: Evaluates prediction sets against codified clinical escalation rules. If the model is uncertain or if infectious (TB) and neoplastic (Malignancy) features co-occur, the system **abstains** from a single label and triggers an escalation pathway.
3. **Four Standardized Triage Outcomes**: Translates complex probabilistic sets into actionable, standardized clinician workflow categories.

---

## 2. The Four Standardized Triage Outcomes

Each scenario maps deterministically to an exact, standardized triage result and actionable workflow guidance:

| Scenario / Outcome | Visual Status | Exact Triage Result Text | Clinician Workflow Meaning |
| :--- | :--- | :--- | :--- |
| **a. NORMAL** | Emerald • CheckCircle2 | *"No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings."* | **Lower apparent risk**: Routine clinical correlation. Findings do not suggest acute referral on imaging alone, but clinical assessment governs. |
| **b. TB-CONSISTENT** | Warm Amber • AlertTriangle | *"Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required."* | **Elevated risk (Infectious)**: Prompts microbiological confirmation (sputum smear, GeneXpert/NAAT) and national TB programme notification without oncological escalation. |
| **c. MALIGNANCY-SUSPICIOUS** | Crimson • AlertOctagon | *"Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended."* | **High-risk escalation**: Expedited clinician review, contrast-enhanced CT thorax, and pulmonology/oncology referral. |
| **d. UNCERTAIN / DUAL-RISK** *(Key Differentiator)* | Deep Violet • ShieldAlert | *"UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED. The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps."* | **Mandatory human escalation**: Model abstention triggered because the prediction set contains multiple competing diagnoses or insufficient confidence. Prevents fatal diagnostic anchoring. |

*Crucial Note on Uncertainty:* An `UNCERTAIN / DUAL-RISK` outcome does **not** diagnose concurrent co-infection and cancer. It indicates that the machine learning system cannot reliably differentiate the radiological findings, and patient safety dictates immediate human specialist review.

---

## 3. Architecture: Implemented Prototype vs. Planned Backend

| Component | Status in Round 2 Prototype | Implementation Details |
| :--- | :--- | :--- |
| **Front-End Interface** | ✅ **Fully Implemented** | React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, accessible responsive layouts (1366px, 768px, 390px). |
| **Input File Validation** | ✅ **Fully Implemented** | Client-side MIME type check, magic-byte inspection (PNG `89 50 4E 47`, JPEG `FF D8 FF`), size cap (10 MB), minimum dimensions (128×128). |
| **Local Image Quality Checks** | ✅ **Fully Implemented** | Genuine client-side pixel analysis (canvas): dimensions, aspect ratio, grayscale/color channel variance, mean brightness, contrast standard deviation, and non-diagnostic warnings. |
| **Safety Policy Engine** | ✅ **Fully Implemented** | Pure deterministic TypeScript module (`src/lib/safetyPolicy.ts`, version `demo-policy-v1`). Codifies rules for empty sets, multi-class collision, and high-risk overrides. |
| **Interactive Safety Explorer** | ✅ **Fully Implemented** | Live testbed on `/safety-engine`: adjust simulated score sliders and toggle prediction set classes to watch the real policy engine trigger abstention live. |
| **Four Simulated Scenarios** | ✅ **Fully Implemented** | Deterministic 6-stage pipeline: `1. Validate → 2. Preprocess → 3. Model scores → 4. Conformal prediction set → 5. Safety policy → 6. Triage`. |
| **All Scenarios Comparison** | ✅ **Fully Implemented** | Side-by-side 4-column modal in Analysis Workspace comparing all 4 clinical pathways simultaneously. |
| **Evaluation Framework** | ✅ **Fully Implemented** | Honest "Not yet measured" benchmark matrix + watermarked illustrative toy visual on coverage tradeoffs + validation requirements roadmap. |
| **Python / FastAPI Backend** | 📋 *Planned (Post-Hackathon)* | REST service (`POST /api/analyze`, `GET /api/health`), Zod schema alignment in `src/lib/schemas.ts`. |
| **Deep Learning Vision Model** | 📋 *Planned (Post-Hackathon)* | DenseNet-121 backbone initialized with TorchXRayVision weights fine-tuned on curated chest radiographs. |
| **Statistical Conformal Calibration** | 📋 *Planned (Post-Hackathon)* | MAPIE / custom inductive conformal prediction calibrated on held-out patient splits ($D_{\text{cal}}$) with theoretical coverage guarantee ($1 - \alpha$). |
| **Grad-CAM Saliency Maps** | 📋 *Planned (Post-Hackathon)* | Real backpropagation saliency heatmaps generated on convolutional feature maps. |

---

## 4. Genuinely Computed Pieces vs. Simulated Components

To ensure complete scientific integrity and transparency for judges:

### 1. What is Genuinely Computed on the Client
- **Magic-Byte File Integrity**: Inspects binary headers of uploaded files to detect spoofed extensions (`.exe` renamed to `.png`).
- **Local Pixel Analysis Panel**: Reads uploaded image data into an offscreen HTML5 canvas to calculate:
  - Pixel dimensions and aspect ratio.
  - Color saturation variance across R/G/B channels (verifying if image is approximately grayscale as expected for radiologic films).
  - Mean luminance brightness ($0 - 255$ and percentage).
  - Luminance contrast measure (standard deviation across sampled pixels).
  - Gentle, non-diagnostic warnings when images deviate substantially from typical radiograph norms (e.g. inverted colors, extreme underexposure). Labeled explicitly: *"Basic image quality checks (computed locally). These do not assess clinical content."*
- **Safety Policy Firewall**: The logic deciding between Normal, TB, Malignancy, and Escalation is **actual, live TypeScript code** (`evaluateSafetyPolicy`). It evaluates inputs algorithmically rather than displaying hardcoded text blobs.

### 2. What is Scripted / Simulated
- **Model Output Scores**: Labeled as *"Simulated model output scores (illustrative, not calibrated probabilities)"*.
- **Conformal Prediction Sets**: Preconfigured illustrative sets demonstrating the statistical output format.
- **Grad-CAM Heatmaps**: Labeled as *"Illustrative placeholder, not derived from your image."*
- **Evaluation Metrics**: All formal performance figures display **"Not yet measured"**.

---

## 5. Quickstart & Running Instructions (Windows PowerShell)

Ensure Node.js (version 18+; verified on Node v22.21.0, npm 10.9.4) is installed.

### Step 1: Open Windows PowerShell and navigate to the `frontend` folder
```powershell
cd "c:\Users\viji\OneDrive\Desktop\lunguard medtech ai\frontend"
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Launch in Development Mode
```powershell
npm run dev
```
Open your browser at **`http://localhost:5173`**. The app automatically boots directly into **Simulated Demo Mode** with a persistent top banner.

### Step 4: Run the Production Preview (Recommended for Demo Video Recording)
For the smoothest recording experience without HMR dev overhead:
```powershell
npm run build
npm run preview
```
Open **`http://localhost:4173`** in your browser.

### Step 5: Run the Verification Suite
```powershell
# TypeScript Strict Typechecking (0 errors)
npm run typecheck

# Linting with Oxlint (0 errors, 0 warnings across 46 files)
npm run lint

# Automated Unit & Integration Tests (45 passing tests across 9 suites)
npm run test
```

---

## 6. How Simulated Demo Mode Works

When no backend is running (or when `VITE_DEMO_MODE=true`), LUNGUARD launches directly into **Simulated Demo Mode**:
1. **Persistent Banner**: Displays across every page:
   > *"SIMULATED DEMO MODE. Results are scripted examples, not real AI inference on your image."*
2. **Analysis Workspace (`/workspace`)**:
   - Click **"Load Synthetic Placeholder CXR (512×512)"** or drag and drop any test image.
   - Inspect the **"Basic image quality checks (computed locally)"** panel showing calculated dimensions, aspect ratio, grayscale confirmation, brightness, and contrast.
   - Select any scenario from the **"Presenter: choose simulated scenario"** selector:
     - `a. NORMAL (lower apparent risk)`
     - `b. TB-CONSISTENT (elevated risk)`
     - `c. MALIGNANCY-SUSPICIOUS (high-risk escalation)`
     - `d. UNCERTAIN / DUAL-RISK (uncertain or conflicting findings)`
   - Click **"Analyze X-ray"**.
   - Observe the 6-stage deterministic pipeline progress bar (`1. Validate → 2. Preprocess → 3. Model scores → 4. Conformal prediction set → 5. Safety policy → 6. Triage`).
   - Review the structurally isolated result panels:
     - Triage Banner with exact clinical text and "What this outcome means" workflow guidance.
     - Simulated Model Scores with illustrative disclaimers.
     - Conformal Prediction Set membership pills.
     - Safety Policy Decision Engine triggered rule IDs and clinical rationales.
     - Grad-CAM heatmap viewer with opacity slider and overlay/side-by-side toggle.
     - Case Summary card with copyable clinical handoff text.
   - Click **"Compare All 4 Scenarios Side-by-Side"** to open a comprehensive 4-column overview of how the system handles different presentations.
   - Click **"New Case / Reset"** to return to the clean initial state.
3. **Safety Engine Explorer (`/safety-engine`)**:
   - Scroll to the **Interactive Safety Policy Explorer**.
   - Click preset scenario buttons or manually drag the TB and Malignancy score sliders.
   - Toggle prediction set membership checkboxes.
   - Observe the real `evaluateSafetyPolicy` function re-evaluate in real time, displaying active safety rules and abstention triggers.
4. **Evaluation Page (`/evaluation`)**:
   - View the honest **"Not yet measured"** benchmark matrix.
   - Explore the watermarked **"ILLUSTRATIVE EXAMPLE (synthetic data, not model results)"** conceptual curve on coverage vs. set size tradeoffs.
   - Review the **Demonstration vs. Validated Evaluation** 5-point requirements guide for clinical validity.

---

## 7. Static Hosting & Deployment Options

The production build (`frontend/dist`) is configured with relative base paths (`base: './'` in `vite.config.ts`), making it deployable on any static hosting platform:

| Static Platform | Configuration Provided | How to Deploy |
| :--- | :--- | :--- |
| **Netlify** | `frontend/public/_redirects` (`/* /index.html 200`) | Drag-and-drop the `frontend/dist` folder into Netlify Drop, or connect repository with build directory set to `frontend/dist`. |
| **Vercel** | `frontend/vercel.json` SPA rewrite rule | Import project into Vercel, set Root Directory to `frontend`, output directory is automatically `dist`. |
| **GitHub Pages** | `frontend/public/404.html` SPA fallback script | Deploy `frontend/dist` to `gh-pages` branch. The relative base path ensures assets load correctly under subpaths. |

*(Note: Per competition instructions, do not deploy or push anything automatically; these files are included for your manual use if desired).*

---

## 8. Datasets Under Consideration & Attributions

Training and validating the planned multi-class model will utilize curated open-source cohorts:
1. **NIH ChestX-ray14**: National Institutes of Health Clinical Center (112,120 frontal chest radiographs).
2. **Shenzhen TB Dataset**: Shenzhen No. 3 People's Hospital & U.S. National Library of Medicine.
3. **Montgomery County TB Set**: Department of Health and Human Services of Montgomery County, Maryland.
4. **Stanford CheXpert**: Stanford ML Group (224,316 chest radiographs).

*Dataset Caveat:* These datasets differ in acquisition parameters, patient demographics, and label definitions. None provide confirmed biopsy-verified labels for co-occurring TB and lung malignancy. Independent calibration on a dedicated clinical cohort remains mandatory.

---

## 9. Known Limitations

1. **Simulated Model Outputs**: Saliency heatmaps and output scores in Round 2 are scripted demonstration assets.
2. **Exchangeability Assumption**: The theoretical coverage guarantee ($1 - \alpha$) of conformal prediction requires test patients to be statistically exchangeable with the calibration split. Distribution shifts (e.g. pediatric vs. adult, portable AP vs. standing PA) violate exchangeability and necessitate adaptive calibration.
3. **Target vs. Measured Sensitivity**: The 98% malignancy sensitivity target referenced in engineering requirements is a **design specification**, not an experimentally achieved or clinically validated metric.

---

## 10. File & Directory Reference

Clickable links to primary modules (using forward-slash paths):
- Safety Policy Module: [`src/lib/safetyPolicy.ts`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/lib/safetyPolicy.ts)
- Image Quality Checks: [`src/lib/imageQuality.ts`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/lib/imageQuality.ts)
- File Validation (Magic Bytes): [`src/lib/fileValidation.ts`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/lib/fileValidation.ts)
- Deterministic Simulator: [`src/services/demoSimulator.ts`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/services/demoSimulator.ts)
- Safety Policy Explorer: [`src/components/safety/SafetyPolicyExplorer.tsx`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/components/safety/SafetyPolicyExplorer.tsx)
- Side-by-Side Scenarios Modal: [`src/components/results/AllScenariosModal.tsx`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/frontend/src/components/results/AllScenariosModal.tsx)
- Demo Video Guide: [`docs/DEMO_VIDEO_GUIDE.md`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/docs/DEMO_VIDEO_GUIDE.md)
- Development Plan & Verification Log: [`docs/PLAN.md`](file:///c:/Users/viji/OneDrive/Desktop/lunguard%20medtech%20ai/docs/PLAN.md)
