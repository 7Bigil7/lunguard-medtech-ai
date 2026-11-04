# LUNGUARD — Master Study Guide & Jury Defense Manual
> **Complete Clinical, Technical & Presentation Preparation Handbook**  
> **Project:** LUNGUARD — Uncertainty-Aware Chest X-Ray Triage & Escalation Prototype  
> **Event / Context:** DEXATHON 2K26 (Software Project Prototype Submission)  
> **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Vitest, Canvas API  

---

## Table of Contents
1. [Executive Summary & The "Big Idea"](#1-executive-summary--the-big-idea)
2. [The Clinical Background: Why This Matters](#2-the-clinical-background-why-this-matters)
   - [The Tuberculosis vs. Lung Malignancy Dilemma](#the-tuberculosis-vs-lung-malignancy-dilemma)
   - [The Danger of "Diagnostic Anchoring"](#the-danger-of-diagnostic-anchoring)
   - [Why Existing Commercial Medical AI Fails Here](#why-existing-col Abstention](#the-concept-of-model-abstention)
   - [The Deterministic Safety Policy Engine](#the-deterministic-safety-policy-engine)
4. [The Four Standardized Triage Outcomes](#4-the-four-standardized-triage-outcomes)
5. [Deep Dive into Codebase Architecture](#5-deep-dive-into-codebase-architecture)
   - [What is Genuinely Computed Locallymmercial-medical-ai-fails-here)
3. [The Technical Core: How LUNGUARD Works](#3-the-technical-core-how-lunguard-works)
   - [Conformal Prediction Sets vs. Point Probabilities](#conformal-prediction-sets-vs-point-probabilities)
   - [The Concept of Mode on the Client](#what-is-genuinely-computed-locally-on-the-client)
   - [What is Scripted / Simulated Demo Mode](#what-is-scripted--simulated-demo-mode)
   - [File & Directory Map](#file--directory-map)
6. [Step-by-Step Live Demo Presentation Guide](#6-step-by-step-live-demo-presentation-guide)
7. [Pitch Formulas (30-Sec, 90-Sec, 3-Minute)](#7-pitch-formulas)
8. [Jury Defense: 15 Toughest Questions & High-Scoring Answers](#8-jury-defense-15-toughest-questions--high-scoring-answers)
9. [Key Terms & Definitions Glossary](#9-key-terms--definitions-glossary)

---

# 1. Executive Summary & The "Big Idea"

### One-Sentence Definition:
> **LUNGUARD is an uncertainty-aware chest radiograph triage prototype that detects diagnostic ambiguity between Tuberculosis and Lung Cancer, replacing overconfident single guesses with conformal prediction sets and a deterministic safety policy that abstains and escalates when risk is unclear.**

### The Problem in 3 Points:
1. In high-TB regions (e.g., India), abnormal lung shadows on an X-ray are routinely assumed to be Tuberculosis.
2. But early-stage Lung Cancer mimics Tuberculosis radiologically (cavitary lesions, apical shadows, nodules).
3. Misdiagnosing cancer as TB delays oncological treatment by 3 to 6 months—often turning an operable Stage I cancer into an incurable Stage IV.

### The Solution:
LUNGUARD introduces **Abstention as a Safety Feature**. If an X-ray presents features of both TB and Cancer, or if the model's confidence is insufficient, it **refuses to guess** a single disease. Instead, it triggers an `UNCERTAIN / DUAL-RISK` escalation pathway that mandates senior human specialist review and contrast-enhanced CT scanning.

---

# 2. The Clinical Background: Why This Matters

### The Tuberculosis vs. Lung Malignancy Dilemma
- **Tuberculosis (TB)** is one of the world's deadliest infectious killers, especially in developing regions.
- **Bronchogenic Carcinoma (Lung Cancer)** is the leading cause of cancer mortality worldwide.
- **The Radiological Overlap:**
  - *Apical infiltrates and consolidation* can be TB or Pancoast/apical tumors.
  - *Cavitary lesions* (thick-walled cavities) occur in active post-primary TB, but squamous cell lung carcinoma frequently cavitates as well.
  - *Solitary pulmonary nodules* (coin lesions) can be tuberculomas (benign granulomas) or malignant solitary tumors.

### The Danger of "Diagnostic Anchoring"
- **Diagnostic Anchoring** is a recognized cognitive bias in clinical medicine where a physician fixates on an initial diagnostic impression (e.g., "This patient is coughing and has an apical cavity in India $\to$ it must be TB") and fails to adjust their opinion even when new information or inconsistent signs appear.
- Patients are placed on empiric anti-TB therapy (ATT) for months. While waiting for sputum tests or symptom resolution, the undetected malignant tumor metastasizes.

### Why Existing Commercial Medical AI Fails Here
- Most AI tools use standard Deep Learning classifiers with a **Softmax output layer**.
- Softmax forces probabilities to sum to $1.0$ (or independent Sigmoid thresholds like $>0.50$).
- When an AI sees an ambiguous film, it might output: `TB: 54%, Malignancy: 46%`. An argmax classification simply outputs **"Tuberculosis"**.
- This gives the clinician a false sense of security. The AI has hidden its internal epistemic uncertainty behind an overconfident single label.

---

# 3. The Technical Core: How LUNGUARD Works

```
[ Upload CXR Image ]
         │
         ▼
[ Stage 1: File Validation (Magic Bytes & Size Cap) ]
         │
         ▼
[ Stage 2: Client-side Image Quality Checks (Canvas Pixel Analysis) ]
         │
         ▼
[ Stage 3: Vision Model Feature Extraction & Score Generation ]
         │
         ▼
[ Stage 4: Statistical Conformal Prediction Set Construction ]
         │
         ▼
[ Stage 5: Deterministic Safety Policy Firewall Engine ]
         │
         ▼
[ Stage 6: Actionable Standardized Clinical Triage Outcome ]
```

### Conformal Prediction Sets vs. Point Probabilities
1. **What is Conformal Prediction (CP)?**
   - It is a distribution-free uncertainty quantification framework that sits on top of any machine-learning model.
   - Instead of predicting a single label $\hat{y}$, it predicts a **set of labels** $C(X) \subseteq \{ \text{Normal}, \text{TB}, \text{Malignancy} \}$.
   - It provides a rigorous theoretical statistical guarantee:
     $$\mathbb{P}(Y \in C(X)) \ge 1 - \alpha$$
     Where $\alpha$ is a pre-defined error rate (e.g., if $\alpha = 0.05$, the true diagnosis is guaranteed to be contained inside the predicted set at least $95\%$ of the time).
2. **The Key Assumption:**
   - **Exchangeability**: The calibration dataset $D_{\text{cal}}$ and future test patients must be drawn from the same underlying distribution. If a patient population shifts (e.g., pediatric vs. adult, AP portable vs. PA standing), adaptive calibration is required.

### The Concept of Model Abstention
- In high-stakes medicine, **knowing when NOT to answer is as important as answering correctly**.
- When the prediction set contains multiple competing high-risk diagnoses (e.g., $\{\text{TB}, \text{Malignancy}\}$), or when the model is so uncertain that the set is empty ($\emptyset$), the model **abstains**.
- Abstention prevents fatal diagnostic anchoring by explicitly declaring: *"The system cannot safely distinguish these findings; immediate senior human clinician review is required."*

### The Deterministic Safety Policy Engine
The safety policy is an algorithmic firewall (`src/lib/safetyPolicy.ts`, version `demo-policy-v1`) that inspects the raw scores and conformal prediction set:

1. **Rule `RULE-CP-EMPTY-SET`:**
   - If the conformal prediction set is empty ($|C(X)| = 0$), the model has zero confidence under the coverage guarantee $\to$ **Escalate to `UNCERTAIN / DUAL-RISK`**.
2. **Rule `RULE-CP-MULTI-HIGH-RISK`:**
   - If the prediction set contains *both* Tuberculosis and Malignancy $\to$ **Escalate to `UNCERTAIN / DUAL-RISK`**.
3. **Rule `RULE-SCORE-OVERRIDE-COLLISION`:**
   - If raw uncalibrated scores for both TB and Malignancy exceed the safety threshold ($\ge 0.40$) simultaneously $\to$ **Escalate to `UNCERTAIN / DUAL-RISK`**.
4. **Rule `RULE-CP-SINGLE-CLASS`:**
   - If the prediction set cleanly contains only one condition (and no safety overrides trigger), route to that specific pathway (`TB_CONSISTENT` or `MALIGNANCY_SUSPICIOUS`).
5. **Rule `RULE-NORMAL-BASELINE`:**
   - If the set contains only Normal and all disease scores are below alert limits $\to$ Route to `NORMAL`.

---

# 4. The Four Standardized Triage Outcomes

LUNGUARD translates mathematical sets into 4 clear, standardized clinical actions:

| Outcome | Visual Token & Color | Exact Triage Output Text | Actionable Workflow Next Step |
| :--- | :--- | :--- | :--- |
| **NORMAL** | Emerald (`CheckCircle2`)<br>`emerald-700` | *"No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings."* | **Lower apparent risk.** Findings do not suggest acute referral on imaging alone. Routine clinical correlation and standard outpatient care. |
| **TB-CONSISTENT** | Warm Amber (`AlertTriangle`)<br>`amber-800` | *"Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required."* | **Elevated risk (Infectious).** Fast-track microbiological testing (sputum smear microscopy, GeneXpert/NAAT) and national TB programme notification without oncologist panic. |
| **MALIGNANCY-SUSPICIOUS** | Crimson (`AlertOctagon`)<br>`rose-800` | *"Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended."* | **High-risk escalation.** Expedited clinician review, contrast-enhanced CT thorax, pulmonology referral, and biopsy preparation. |
| **UNCERTAIN / DUAL-RISK**<br>*(Key Differentiator)* | Deep Violet (`ShieldAlert`)<br>`purple-900` | *"UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED. The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps."* | **Mandatory Human Escalation (Abstention).** Prevents fatal diagnostic anchoring. Halts single-track empiric treatment. Mandates immediate dual-track evaluation: sputum testing PLUS urgent cross-sectional imaging (CT). |

---

# 5. Deep Dive into Codebase Architecture

### What is Genuinely Computed Locally on the Client:
1. **Magic-Byte Binary Inspection** (`src/lib/fileValidation.ts`):
   - Reads the raw ArrayBuffer headers of uploaded files.
   - Detects spoofed extensions: Checks PNG header (`89 50 4E 47`) and JPEG header (`FF D8 FF`). If an `.exe` or corrupt file is renamed `.png`, it is blocked client-side.
   - Enforces 10 MB file cap and 128×128 minimum resolution.
2. **Live Image Quality Pixel Analysis** (`src/lib/imageQuality.ts`):
   - Loads the image into an offscreen HTML5 `<canvas>`.
   - Reads `ctx.getImageData()` to calculate real pixel statistics:
     - Exact dimensions and aspect ratio.
     - Grayscale verification via RGB channel saturation variance: Medical radiographs are grayscale. If channel variance is high, it warns that the image is a color photo or illustration.
     - Mean luminance brightness ($0-255$ and percentage).
     - Luminance contrast (standard deviation of sampled pixels).
     - Non-diagnostic advisory warnings for underexposed, overexposed, or inverted films.
3. **Pure TypeScript Safety Policy Engine** (`src/lib/safetyPolicy.ts`):
   - A fully functional, deterministic algorithmic rule engine (`evaluateSafetyPolicy`).
   - Powers the interactive sliders and toggles on `/safety-engine`.

### What is Scripted / Simulated Demo Mode:
- **Model Output Scores**: Illustrative demonstration numbers (clearly watermarked: *"Simulated model output scores, not calibrated probabilities"*).
- **Conformal Sets & Grad-CAM Heatmaps**: Preconfigured visual representations (watermarked: *"Illustrative placeholder, not derived from your image"*).
- **Benchmark Evaluation Matrix**: Transparently displays **"Not yet measured"** to uphold scientific and academic honesty.

### File & Directory Map
```
frontend/src/
├── lib/
│   ├── safetyPolicy.ts          # Pure TS deterministic rules & abstention logic
│   ├── imageQuality.ts          # Genuine HTML5 Canvas pixel & grayscale analysis
│   ├── fileValidation.ts        # Client-side magic-byte inspection
│   └── schemas.ts               # Zod validation schemas matching backend contract
├── components/
│   ├── layout/                  # Header, Navigation, DemoModeBanner
│   ├── workspace/               # ImageUploader, QualityChecks, PipelineProgress
│   ├── results/                 # TriageBanner, GradCamViewer, AllScenariosModal
│   └── safety/                  # SafetyPolicyExplorer (Interactive sliders/toggles)
├── pages/
│   ├── Landing.tsx              # Rationale, problem framing, architecture
│   ├── Workspace.tsx            # Main 6-stage triage analysis workflow
│   ├── SafetyEngine.tsx         # Conformal prediction math & live explorer
│   └── Evaluation.tsx           # Honest benchmark table & clinical roadmap
├── services/demoSimulator.ts    # Deterministic scenario data generator
└── tests/                       # 9 Vitest suites / 45 passing unit & integration tests
```

---

# 6. Step-by-Step Live Demo Presentation Guide

When you present to the jury, use this **proven 5-step flow** (Total Time: ~3 minutes):

### Step 1: Landing Page (`/`) — 30 Seconds
- **Action:** Open `http://localhost:5173/` or `http://localhost:4173/`. Point to the header.
- **What to say:**
  > "Respected judges, this is **LUNGUARD**, an uncertainty-aware chest radiograph triage prototype.
  > In countries like India, doctors face a dangerous cognitive trap called **diagnostic anchoring**: when an X-ray shows an abnormal shadow, it is almost always assumed to be Tuberculosis. But early-stage Lung Cancer mimics TB radiologically. Misdiagnosing it delays cancer treatment by months.
  > Most AI models output an overconfident single guess. LUNGUARD introduces **Abstention as a Safety Feature** using conformal prediction sets and a deterministic safety policy.
  > Notice our amber top banner: we maintain total academic honesty—this prototype runs in a transparent simulated demo mode."

### Step 2: Workspace & Real Pixel Quality Checks (`/workspace`) — 35 Seconds
- **Action:** Click **"Analysis Workspace"** in the top navbar. Click **"Load Synthetic Placeholder CXR (512×512)"**.
- **What to say:**
  > "In the Analysis Workspace, we first secure file intake: we inspect binary **magic bytes** client-side to block malicious or spoofed files.
  > Once loaded, look at this panel: **'Basic image quality checks (computed locally)'**.
  > This is **genuine, live client-side code** running in an offscreen HTML5 canvas right now. It calculates real pixel dimensions, verifies grayscale consistency by measuring RGB channel variance, and computes mean luminance and contrast standard deviation. If an image is inverted or non-radiographic, it raises a gentle advisory."

### Step 3: Run Scenario D (The Differentiator) (`/workspace`) — 45 Seconds
- **Action:** Under the scenario selector, choose **`d. UNCERTAIN / DUAL-RISK`**. Click **"Analyze X-ray"**.
- **What to say:**
  > "Now let me demonstrate our core innovation: **Scenario D — UNCERTAIN / DUAL-RISK**.
  > Watch the 6-stage pipeline execute: from validation to conformal sets to safety policy.
  > Look at the result:
  > 1. Raw model scores show high confidence for both TB and Malignancy.
  > 2. The Conformal Prediction Set includes both conditions simultaneously.
  > 3. Our safety policy firewall triggers rule `RULE-CP-MULTI-HIGH-RISK`.
  > Instead of guessing, the system outputs: **'UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED'**.
  > This halts single-track diagnostic anchoring and forces immediate multidisciplinary human escalation: ordering sputum tests and an expedited contrast-enhanced chest CT simultaneously."

### Step 4: Show All 4 Scenarios Side-by-Side (`/workspace`) — 25 Seconds
- **Action:** Click the button **"Compare All 4 Scenarios Side-by-Side"**.
- **What to say:**
  > "By opening our comparison modal, you can see how all four clinical pathways operate with standardized color tokens, explicit icons, and non-prescriptive clinical guidance: Normal, TB-Consistent, Malignancy-Suspicious, and Dual-Risk Abstention."
- **Action:** Close the modal.

### Step 5: Safety Policy Explorer (`/safety-engine`) — 45 Seconds
- **Action:** Click **"Safety Engine"** in the top navbar. Scroll to the **Interactive Safety Policy Explorer**.
- **What to say:**
  > "On our Safety Engine page, we provide an interactive testbed. **This is live TypeScript code executing in the browser**.
  > If I set the prediction set to only Tuberculosis, the policy engine outputs `TB-CONSISTENT`.
  > But watch what happens when I check Malignancy as well—the policy immediately fires `RULE-CP-MULTI-HIGH-RISK` and flips to `UNCERTAIN / DUAL-RISK`!
  > If the model has zero confidence and returns an empty set, `RULE-CP-EMPTY-SET` escalates as well.
  > We conclude with our Evaluation page, where we honestly state all formal benchmark metrics as 'Not yet measured' pending ethical approval and clinical trials."

---

# 7. Pitch Formulas

### 30-Second Elevator Pitch
> *"In tuberculosis-endemic regions, early lung cancer is frequently misdiagnosed as TB because both present as apical cavities and opacities on chest X-rays. This cognitive bias—diagnostic anchoring—delays cancer treatment until it is too late. LUNGUARD is an uncertainty-aware triage system that replaces overconfident AI guesses with conformal prediction sets and a deterministic safety policy. When an X-ray is ambiguous, LUNGUARD abstains and triggers an 'Uncertain / Dual-Risk' escalation, protecting patients by mandating human specialist review."*

### 90-Second Fast Pitch
> *"Good morning. When an AI looks at an abnormal chest X-ray in India, it faces a lethal dilemma: Is this Tuberculosis, or is it early-stage Lung Cancer?
> Radiologically, the two diseases can be nearly indistinguishable on plain radiographs. Standard AI uses Softmax to force a single guess, reinforcing a doctor's natural tendency toward 'diagnostic anchoring'—assuming everything is TB.
> LUNGUARD solves this by introducing **Abstention as a Clinical Safety Feature**.
> We built a 6-stage triage pipeline:
> First, client-side magic-byte and canvas pixel quality checks verify the radiograph.
> Second, rather than single labels, the model generates statistical conformal prediction sets.
> Third, our deterministic safety policy evaluates the set against strict clinical rules. If the set contains both TB and Malignancy, or if confidence is low, the AI refuses to guess.
> It outputs a high-priority 'UNCERTAIN / DUAL-RISK' triage category, halting empiric treatment and fast-tracking both microbiological tests and a contrast-enhanced CT.
> In our prototype, all client-side checks and safety engine rules are real, fully tested TypeScript code verified by 45 automated unit tests."*

---

# 8. Jury Defense: 15 Toughest Questions & High-Scoring Answers

### Category A: Clinical & Medical Integrity

#### Q1: "Why not just let the radiologist decide? Why do we need an AI for this?"
> **Answer:** *"In high-burden, resource-constrained primary healthcare centers in rural and semi-urban India, radiographs are rarely read immediately by specialized thoracic radiologists. They are interpreted by overburdened general practitioners or medical officers who see hundreds of TB patients a week. Diagnostic anchoring is a well-documented human cognitive pitfall in these settings. LUNGUARD is not replacing radiologists; it acts as an automated safety net to prevent premature diagnostic closure before the patient leaves the clinic."*

#### Q2: "Can a patient have BOTH Tuberculosis and Lung Malignancy at the same time?"
> **Answer:** *"Yes, absolutely. Co-existence of active pulmonary TB and bronchogenic carcinoma is a documented clinical phenomenon, and old TB scars can undergo malignant transformation (scar carcinoma). When LUNGUARD outputs `UNCERTAIN / DUAL-RISK`, it does NOT claim to diagnose co-infection. Rather, it indicates that the imaging findings cannot reliably rule out either pathology, mandating that the clinician initiate both microbiological workups and oncological cross-sectional imaging simultaneously."*

#### Q3: "What specific clinical workup does LUNGUARD recommend for an 'Uncertain / Dual-Risk' result?"
> **Answer:** *"In accordance with responsible medical AI design, LUNGUARD's guidance is non-prescriptive and respects clinical autonomy. It advises a dual-track escalation:
> 1. Sputum smear microscopy and GeneXpert/NAAT for microbiological confirmation of TB.
> 2. An urgent contrast-enhanced CT of the thorax and pulmonology consultation to evaluate the suspicious lesion.
> It explicitly cautions against starting empiric anti-TB treatment without active follow-up imaging."*

---

### Category B: Machine Learning & Conformal Prediction

#### Q4: "Why use Conformal Prediction instead of just setting a threshold on Softmax probabilities (e.g., probability > 0.5)?"
> **Answer:** *"Softmax probabilities are notorious for being poorly calibrated, especially in deep neural networks. A model can output 92% confidence on an out-of-distribution or ambiguous image simply because of extreme logit scaling. Conformal Prediction is distribution-free and provides rigorous statistical guarantees: given an error rate $\alpha$, the true label will be in the predicted set with probability $1 - \alpha$. When confidence is low, the set naturally expands to include multiple labels or becomes empty. This mathematically justifies abstention rather than relying on arbitrary heuristic probability cutoffs."*

#### Q5: "What is the Exchangeability Assumption in Conformal Prediction, and what happens if it fails?"
> **Answer:** *"Exchangeability assumes that future test cases come from the same joint data distribution as the calibration split $D_{\text{cal}}$. In medical imaging, this assumption can be violated by distribution shifts—such as transitioning from adult hospital standing PA films to portable bedside AP films or pediatric patients. If exchangeability is violated, the coverage guarantee ($1 - \alpha$) degrades. That is why in our planned architecture, we incorporate adaptive conformal inference and domain-conditioned calibration subsets."*

#### Q6: "What datasets will you use to train the full vision model?"
> **Answer:** *"We have identified four primary curated cohorts:
> 1. **NIH ChestX-ray14** (112,120 radiographs) for baseline thoracic abnormality feature representations.
> 2. **Shenzhen No. 3 People's Hospital TB Dataset** & **Montgomery County TB Set** for verified tuberculosis presentations.
> 3. **Stanford CheXpert** (224,316 radiographs).
> Crucially, because no open-source dataset contains confirmed co-occurring TB and lung cancer labels, we must calibrate on a dedicated, multi-center hospital cohort with biopsy-confirmed pathology before clinical deployment."*

---

### Category C: Architecture & Codebase Rigor

#### Q7: "How much of this application is REAL vs. FAKE/SIMULATED?"
*(CRITICAL QUESTION — Answer with complete transparency!)*
> **Answer:** *"We believe scientific honesty is paramount in medical software.
> **What is 100% REAL and live right now:**
> 1. **File Validation:** Binary magic-byte inspection (blocking spoofed files) is real client-side code.
> 2. **Image Quality Analysis:** Grayscale RGB channel variance, mean brightness, and contrast standard deviation are genuinely calculated in the browser using HTML5 Canvas pixel manipulation.
> 3. **The Safety Policy Firewall:** The module `evaluateSafetyPolicy` is real TypeScript logic with 45 passing unit tests.
> **What is SIMULATED:**
> The deep-learning model weights, model scores, and Grad-CAM heatmaps are simulated demo assets. Our Evaluation page transparently displays 'Not yet measured' for benchmarks because a model without formal clinical trial validation should never claim clinical accuracy."*

#### Q8: "Why DenseNet-121 initialized with TorchXRayVision for your planned backend?"
> **Answer:** *"DenseNet-121 is the gold standard architecture in chest radiograph analysis (proven in CheXNet and TorchXRayVision). Its dense connectivity pattern allows feature reuse across all layers, making it exceptionally effective at capturing both fine-grained textural patterns (such as micro-nodules and early infiltrates) and high-level anatomical structures (such as lung fields and cardiac borders), with fewer parameters than ResNet-152."*

#### Q9: "Why build client-side image checks when the backend could do it?"
> **Answer:** *"In rural telemedicine and edge-deployed hospital networks, bandwidth is precious. By computing binary magic-byte integrity and pixel quality checks directly in the browser's Canvas API, we catch corrupted, inverted, or non-diagnostic images instantly. This saves unnecessary backend network transmissions and gives instantaneous feedback to the clinic operator."*

#### Q10: "How do your tests verify determinism across all scenarios?"
> **Answer:** *"Our Vitest suite includes `scenariosDeterministic.test.ts`. It runs all four scenarios (`Normal`, `TB-Consistent`, `Malignancy-Suspicious`, and `Uncertain`) through the 6-stage pipeline and asserts that every single run produces the exact clinical string, exact status tokens, and exact rule trigger IDs without random fluctuations."*

---

### Category D: Regulations, Ethics & Security

#### Q11: "Is this certified by CDSCO, FDA, or CE?"
> **Answer:** *"No. LUNGUARD is strictly a research and educational prototype submitted for DEXATHON 2K26. It carries persistent warning banners on every page explicitly stating that it is not a certified diagnostic medical device, has not received regulatory clearance, and must never be used to guide real patient clinical decisions."*

#### Q12: "How do you protect patient privacy (HIPAA / GDPR / DISHA)?"
> **Answer:** *"In our prototype:
> 1. **Zero Data Retention:** Uploaded images stay strictly in browser memory via short-lived blob URLs (`URL.createObjectURL`) and are revoked on unmount or reset.
> 2. **No LocalStorage & No Telemetry:** No patient images or identifiers are written to disk, local storage, cookies, or external analytics servers.
> 3. **Air-Gapped Operation:** All typography and assets are self-hosted."*

#### Q13: "What is Grad-CAM, and what are its clinical limitations?"
> **Answer:** *"Grad-CAM (Gradient-weighted Class Activation Mapping) produces coarse visual heatmaps showing which convolutional feature maps contributed most to a classification. While useful for high-level visual sanity checks, Grad-CAM has known clinical limitations: it lacks pixel-level precision, cannot distinguish true pathology from correlated artifacts (like radiopaque hospital markers), and should never be treated as an exact anatomical tumor boundary."*

#### Q14: "What happens if a user uploads a photo of a dog or a car?"
> **Answer:** *"Our client-side image quality analyzer detects high RGB channel saturation variance and flags that the image is a color photo rather than a grayscale radiograph. Furthermore, in the planned ML backend, out-of-distribution (OOD) detection using Mahalanobis distance embeddings rejects non-radiographic images before reaching the classifier."*

#### Q15: "What is your roadmap after this hackathon?"
> **Answer:** *"Our 3-stage roadmap:
> 1. **Phase 1 (Done):** Complete front-end research prototype with genuine client-side checks, deterministic safety policy, and 45 passing tests.
> 2. **Phase 2 (Months 1–3):** Deploy the FastAPI backend with DenseNet-121 fine-tuned on NIH/Shenzhen cohorts, implementing inductive conformal calibration (MAPIE) with $1-\alpha=0.95$ coverage.
> 3. **Phase 3 (Months 4–12):** Partner with an academic medical institution to conduct a blinded retrospective reader study, evaluating whether LUNGUARD's abstention reduces clinician diagnostic anchoring errors."*

---

# 9. Key Terms & Definitions Glossary

- **Diagnostic Anchoring:** A cognitive bias where a clinician latches onto an initial finding (TB) and prematurely closes diagnostic exploration, missing competing diseases (Cancer).
- **Conformal Prediction (CP):** A mathematical framework that produces prediction sets with statistically guaranteed error bounds under exchangeability assumptions.
- **Abstention:** The deliberate decision by an AI system to refuse to provide a single classification when uncertainty or dual-risk is detected.
- **Exchangeability:** The statistical property that the order of data points does not affect their joint distribution (a weaker condition than independent and identically distributed, i.i.d.).
- **Grad-CAM:** Gradient-weighted Class Activation Mapping; visualizes class-discriminative saliency on neural network feature maps.
- **Magic Bytes:** The first few bytes of a file header that uniquely identify the true file format (e.g., `89 50 4E 47` for PNG) regardless of file extension.
- **DenseNet-121:** A deep convolutional neural network architecture where each layer is connected to all subsequent layers, highly effective for radiograph analysis.
- **Non-Conformity Score:** A measure in conformal prediction quantifying how unusual a new test sample looks relative to prior training samples.

---
*Document prepared for study, presentation rehearsals, and jury evaluation.*

