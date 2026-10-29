# LUNGUARD — 5-Minute Demo Video Recording Guide

> **DEXATHON 2K26 — Round 2 Prototype Submission**  
> **Video Limit:** Maximum 5 Minutes  
> **Host / Platform:** Google Drive Link ("Anyone with the link can view")  
> **Presenter:** Bharath / LUNGUARD Team  

---

## 1. Pre-Recording Checklist (Do This 10 Minutes Before Recording)

### Screen & System Setup
- [ ] **Resolution**: Set display resolution to standard 1080p (1920×1080) or 1440p. Ensure scale is 100% or 125% so text is crisp.
- [ ] **Notifications**: Enable Windows "Do Not Disturb" / Focus Assist (Settings → System → Focus).
- [ ] **Clean Desktop**: Close WhatsApp, Discord, Slack, email clients, and background browser tabs.
- [ ] **Microphone Check**: Do a 15-second test recording in OBS Studio / Windows Game Bar (Win + Alt + R) to verify audio levels and eliminate background fan noise.

### Browser Setup
- [ ] **Browser**: Google Chrome or Edge.
- [ ] **Zoom Level**: Set zoom to 100% (Ctrl + 0).
- [ ] **Browser Mode**: Full screen or clean maximized window without distracting bookmarks bar (Ctrl + Shift + B to toggle bookmarks).
- [ ] **Launch Production Preview**:
  ```powershell
  cd "c:\Users\viji\OneDrive\Desktop\lunguard medtech ai\frontend"
  npm run build
  npm run preview
  ```
  Open **`http://localhost:4173`** (or `http://localhost:5173`).
- [ ] **Verify Default State**: Notice the top amber banner is active:
  > *"SIMULATED DEMO MODE. Results are scripted examples, not real AI inference on your image."*
- [ ] **Tabs to Have Ready (Optional)**:
  - Tab 1: `http://localhost:4173` (LUNGUARD landing / home page)
  - Tab 2: `http://localhost:4173/safety-engine` (Pre-loaded as backup)
  - Tab 3: `http://localhost:4173/evaluation` (Pre-loaded as backup)

---

## 2. Recommended Scenario Order

**Why this order matters:**
Demonstrating **Uncertain / Dual-Risk first or second** immediately establishes LUNGUARD’s unique thesis: we are **not** showing off an overconfident classifier that guesses; we are showing a safety-first system that knows when to abstain.

1. **Upload & Local Checks**: Load the synthetic placeholder image.
2. **Scenario d (Key Differentiator)**: `UNCERTAIN / DUAL-RISK` — show the safety policy triggering abstention and requiring specialist human review.
3. **Scenario c**: `MALIGNANCY-SUSPICIOUS` — show expedited oncological escalation.
4. **Scenario b**: `TB-CONSISTENT` — show infectious disease pathway.
5. **Scenario a**: `NORMAL` — show lower apparent risk with routine clinical correlation disclaimer.
6. **Side-by-Side Modal**: Click **"Compare All 4 Scenarios Side-by-Side"** for a quick 10-second visual comparison.

---

## 3. 5-Minute Script & Timeline Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 0:00 - 0:40 │ Problem, Clinical Hazard, & The Core Idea                    │
│ 0:40 - 1:30 │ Workspace, File Integrity, & Local Image Quality Checks      │
│ 1:30 - 3:15 │ The 4 Scenarios with Staged Pipeline & Workflow Meanings      │
│ 3:15 - 4:15 │ Safety Engine: Live Interactive Policy Explorer              │
│ 4:15 - 4:45 │ Evaluation Page: Transparency, Metrics, & Architecture       │
│ 4:45 - 5:00 │ Closing Disclaimer & Future Roadmap                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Segment 1: Problem & The Core Idea (0:00 – 0:40)
*Screen: Landing Page (`/`)*

> **What to Say:**  
> "Hello judges. I'm presenting **LUNGUARD**, an uncertainty-aware chest X-ray triage and escalation research prototype for DEXATHON 2K26 Round 2.
>
> In high-tuberculosis regions like India, clinicians often face a dangerous trap called **diagnostic anchoring**: an abnormal lung opacity on a chest X-ray is reflexively treated as TB, while an underlying early-stage lung cancer is missed until it's too late.
>
> Most AI models today force a confident single prediction. LUNGUARD takes a safety-first approach: using **conformal prediction sets** and a **deterministic safety policy**, it explicitly detects clinical ambiguity and **abstains** when findings could represent either disease, immediately escalating the case for specialist human review."

---

### Segment 2: Upload, File Validation, & Real Local Checks (0:40 – 1:30)
*Action: Click "Launch Analysis Workspace"*  
*Screen: Workspace (`/workspace`)*

> **What to Say:**  
> "Let's enter the Analysis Workspace. First, notice the persistent banner at the top: we are in **Simulated Demo Mode**. We are completely transparent that this prototype does not run live patient inference.
>
> Let's look at the upload system. It performs rigorous client-side checks: MIME types, 10 megabyte limits, and binary **magic-byte inspection** to prevent spoofed files.
>
> I'll click **'Load Synthetic Placeholder CXR'**. Notice this small panel below: **'Basic image quality checks (computed locally)'**. This is **genuine, live client-side code** running right now in the browser canvas. It computes real image dimensions, confirms the image is approximately grayscale by checking RGB channel variance, and calculates mean brightness and luminance contrast. If someone uploads an inverted or non-radiographic image, it warns them immediately without claiming clinical diagnosis."

---

### Segment 3: The Four Scenarios & Staged Pipeline (1:30 – 3:15)
*Action: Use the "Presenter: choose simulated scenario" control*

#### 3A. Scenario d: UNCERTAIN / DUAL-RISK (1:30 – 2:15)
*Action: Select `d. UNCERTAIN / DUAL-RISK (uncertain or conflicting findings)` and click "Analyze X-ray"*

> **What to Say:**  
> "Now let's run our primary scenario: **UNCERTAIN / DUAL-RISK**. Watch the 6-stage pipeline progress: `Validate → Preprocess → Model scores → Conformal prediction set → Safety policy → Triage`.
>
> Here are the results, clearly separated into three distinct concepts:
> 1. **Model Scores**: Shows simulated illustrative scores where both TB and Malignancy scored high.
> 2. **Conformal Prediction Set**: The statistical set includes both `{Tuberculosis, Malignancy}`.
> 3. **Safety Policy Decision**: The firewall detected a multi-class collision and triggered Rule `RULE-CP-MULTI-HIGH-RISK`.
>
> Notice the exact triage banner: **'UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED'**. It does not guess. The 'What this outcome means' section explains to the clinician: this is model abstention designed to prevent diagnostic anchoring and trigger immediate senior radiologist review. All panels carry prominent **SIMULATED** and placeholder badges."

#### 3B. Scenario c: MALIGNANCY-SUSPICIOUS (2:15 – 2:40)
*Action: Select `c. MALIGNANCY-SUSPICIOUS`, click "Analyze X-ray"*

> **What to Say:**  
> "If we run Scenario C, the model score for Malignancy triggers immediate oncological escalation wording, advising an expedited CT thorax and pulmonology consultation."

#### 3C. Scenario b: TB-CONSISTENT & Scenario a: NORMAL (2:40 – 3:00)
*Action: Quickly select Scenario B, run, then Scenario A, run*

> **What to Say:**  
> "Scenario B routes to the infectious disease pathway for sputum and GeneXpert confirmation. Scenario A shows Normal, but maintains a clear caveat: a normal result does not exclude disease and requires clinical correlation."

#### 3D. Side-by-Side Comparison Modal (3:00 – 3:15)
*Action: Click "Compare All 4 Scenarios Side-by-Side"*

> **What to Say:**  
> "We can also open this comparison view to see all four triage pathways side-by-side, demonstrating how the safety engine handles varying risk levels consistently."

---

### Segment 4: Safety Engine & Interactive Policy Explorer (3:15 – 4:15)
*Action: Click "Safety Engine" in the top navigation bar*  
*Screen: `/safety-engine`*

> **What to Say:**  
> "Now let's visit the **Safety Engine** page. This is where the core contribution lives.
>
> While our deep-learning model is planned for future backend integration, this **Safety Policy Explorer is REAL, LIVE CODE**. The function `evaluateSafetyPolicy` is running pure TypeScript logic right here in memory.
>
> Watch what happens when I adjust the sliders or toggle classes in the prediction set:
> - If the prediction set has only **Tuberculosis**, the policy outputs `TB-CONSISTENT`.
> - But the moment the model is uncertain and adds **Malignancy** to the set, the policy immediately triggers rule `RULE-CP-MULTI-HIGH-RISK` and abstains, forcing an `UNCERTAIN / DUAL-RISK` triage!
> - If the prediction set is **empty** because the model has zero confidence, Rule `RULE-CP-EMPTY-SET` fires and also escalates!
>
> We also state clearly: conformal prediction guarantees coverage only when calibration assumptions hold; it does not magically create clinical sensitivity."

---

### Segment 5: Evaluation & Architecture Honesty (4:15 – 4:45)
*Action: Click "Evaluation" in the top navigation bar*  
*Screen: `/evaluation`*

> **What to Say:**  
> "On the Evaluation page, we maintain complete scientific honesty. Every benchmark metric displays **'Not yet measured'**. We have not fabricated any accuracy or AUROC numbers.
>
> We include this watermarked illustrative curve to explain how the error budget ($1 - \alpha$) controls abstention rates mathematically, and we provide a 5-point blueprint of what a real clinical validation requires: labeled held-out test data, patient-level separation, and independent multi-center calibration."

---

### Segment 6: Closing & Disclaimer (4:45 – 5:00)
*Action: Navigate back to Home (`/`) or Workspace (`/workspace`)*

> **What to Say:**  
> "To conclude: LUNGUARD demonstrates a complete, reliable, and honest prototype of uncertainty-aware triage for DEXATHON 2K26 Round 2. It proves how intelligent abstention can safeguard patients against diagnostic anchoring.
>
> Thank you for your time and evaluation."

---

## 4. Submission & Google Drive Link Checklist

When you finish recording:

1. **Verify File Duration**: Check the recorded video file (`.mp4` or `.mkv`). Confirm duration is **under 5 minutes** (e.g., 4:45 - 4:55).
2. **Audio Check**: Play back the first 30 seconds and the last 30 seconds to make sure your voice is clear and audible.
3. **Upload to Google Drive**:
   - Upload the file to your Google Drive.
   - Right-click the uploaded video → Click **Share** (or "Get link").
   - Under General access, change from "Restricted" to:  
     👉 **"Anyone with the link"**  
     👉 Role: **"Viewer"**
   - Click **"Copy link"**.
4. **MANDATORY Private / Incognito Test**:
   - Open a **New InPrivate / Incognito Window** in Chrome or Edge (Ctrl + Shift + N).
   - Paste the Google Drive link.
   - Confirm that the video loads and plays **without asking you to sign into Google**.
   - If it prompts for login, fix the sharing permissions immediately!
5. **Submit Link**: Paste the verified link into the DEXATHON Round 2 submission form before **11:00 PM on 28 October 2026**.
