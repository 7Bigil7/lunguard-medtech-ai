# LUNGUARD — 3-Minute Demo Video Script & Teleprompter

> **DEXATHON 2K26 — Round 2 Prototype Submission**  
> **Target Duration:** Exactly 2:50 – 3:00 Minutes (180 Seconds)  
> **Pace:** Confident, brisk (~135-140 words per minute)  
> **Platform:** Record on localhost (`http://localhost:5173` or `http://localhost:4173`)  

---

## ⏱️ At-A-Glance Timeline (180 Seconds)

| Time | Duration | Screen / Page | Primary Action | Key Message |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 – 0:30** | 30s | **Landing (`/`)** | Start on Home hero | Clinical problem (TB vs Cancer diagnostic anchoring) & LUNGUARD idea |
| **0:30 – 1:05** | 35s | **Workspace (`/workspace`)** | Load synthetic CXR | Client-side magic bytes & **real local image quality checks** |
| **1:05 – 1:55** | 50s | **Workspace (`/workspace`)** | Run Scenario D, then open Comparison | 6-stage pipeline, `UNCERTAIN / DUAL-RISK` abstention, & 4-outcome modal |
| **1:55 – 2:35** | 40s | **Safety Engine (`/safety-engine`)** | Interact with Explorer | **Live pure TypeScript policy code** reacting to sliders & toggles |
| **2:35 – 3:00** | 25s | **Evaluation (`/evaluation`)** | Scroll to metrics & toy visual | Scientific honesty ("Not yet measured") & closing wrap-up |

---

## 🎬 Word-For-Word Script & Action Cues

### [0:00 – 0:30] Introduction: Clinical Problem & The Core Idea
*Screen: Home Page (`http://localhost:5173/`)*  
*Visual Cue: Point cursor to the headline and the persistent amber "SIMULATED DEMO MODE" banner.*

> **Spoken Words:**  
> "Hello judges. I'm presenting **LUNGUARD**, an uncertainty-aware chest X-ray triage and escalation prototype.
> 
> In tuberculosis-endemic regions like India, clinicians face a dangerous trap called **diagnostic anchoring**: an abnormal lung opacity is reflexively assumed to be TB, accidentally missing an early curable lung cancer.
> 
> Most AI models force an overconfident single guess. LUNGUARD takes a safety-first approach: using **conformal prediction sets** and a **deterministic safety policy**, it explicitly detects ambiguity and **abstains** when findings overlap, escalating the case to human specialists.
> 
> Notice our persistent banner: this is an honest research prototype running in simulated demo mode."

*(Elapsed Time: ~0:30)*

---

### [0:30 – 1:05] Workspace, File Integrity & Real Local Checks
*Action: Click **"Launch Analysis Workspace"** (or top nav "Analysis Workspace").*  
*Screen: `/workspace`*  
*Action: Click **"Load Synthetic Placeholder CXR (512×512)"**.*  
*Visual Cue: Point to the "Basic image quality checks (computed locally)" panel below the preview.*

> **Spoken Words:**  
> "Entering the Analysis Workspace, we first validate file intake: client-side MIME checks and binary **magic-byte inspection** prevent spoofed files.
> 
> I'll load our synthetic placeholder image. Look at this panel below: **'Basic image quality checks'**. 
> 
> This is **genuine, live client-side code** running in the browser canvas right now. It calculates real image dimensions, verifies grayscale consistency by measuring RGB channel variance, and computes mean brightness and contrast standard deviation. If an image is uncharacteristic of a radiograph, it displays a gentle, non-diagnostic warning."

*(Elapsed Time: ~1:05)*

---

### [1:05 – 1:55] Staged Pipeline, Uncertain Escalation & Side-by-Side Modal
*Action: Under "Presenter: choose simulated scenario", pick **`d. UNCERTAIN / DUAL-RISK (uncertain or conflicting findings)`**.*  
*Action: Click **"Analyze X-ray"**.*  
*Visual Cue: Watch the 6-stage progress bar complete, then scroll smoothly through results.*

> **Spoken Words:**  
> "Now let's demonstrate our key differentiator: **Scenario D — UNCERTAIN / DUAL-RISK**.
> 
> Watch the 6-stage deterministic pipeline progress from validation to triage.
> 
> The results separate three distinct concepts:
> First, **Model Scores** show illustrative values where both TB and Malignancy scored high.
> Second, the **Conformal Prediction Set** includes both diseases simultaneously.
> Third, our **Safety Policy Engine** detects this conflict and triggers rule `RULE-CP-MULTI-HIGH-RISK`.
> 
> The system outputs: **'UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED'**. It does not guess. The workflow guidance explains that the model has abstained to prevent diagnostic anchoring and mandate senior clinician review.
> 
> I can also click **'Compare All 4 Scenarios Side-by-Side'** to see how all four outcomes—Normal, TB, Malignancy, and Uncertain—are handled consistently."

*Action: Close the modal after 5 seconds.*  
*(Elapsed Time: ~1:55)*

---

### [1:55 – 2:35] Safety Engine: Live Interactive Policy Explorer
*Action: Click **"Safety Engine"** in the top navigation bar.*  
*Screen: `/safety-engine`*  
*Action: Scroll directly to the **"Interactive Safety Policy Explorer"**.*  
*Visual Cue: Toggle checkboxes and drag sliders while speaking.*

> **Spoken Words:**  
> "On the **Safety Engine** page, we explain the mathematics of conformal prediction. 
> 
> While the deep-learning vision backend is planned for future work, this **Safety Policy Explorer is REAL, LIVE CODE**. The function `evaluateSafetyPolicy` is running pure TypeScript logic in memory.
> 
> Watch this: if the prediction set only contains **Tuberculosis**, the policy outputs `TB-CONSISTENT`.
> But the moment the model is uncertain and adds **Malignancy** to the set, the policy immediately fires rule `RULE-CP-MULTI-HIGH-RISK` and abstains to `UNCERTAIN / DUAL-RISK`!
> If the model has zero confidence and returns an empty set, rule `RULE-CP-EMPTY-SET` escalates as well.
> 
> We state clearly: conformal coverage holds under exchangeability assumptions, not as a magic clinical guarantee."

*(Elapsed Time: ~2:35)*

---

### [2:35 – 3:00] Evaluation Transparency & Closing
*Action: Click **"Evaluation"** in the top navigation bar.*  
*Screen: `/evaluation`*  
*Visual Cue: Show the "Not yet measured" badges, then glance at the watermarked toy graph.*

> **Spoken Words:**  
> "Finally, on the **Evaluation** page, we maintain complete scientific honesty. Every benchmark metric displays **'Not yet measured'**—we have not fabricated accuracy or AUROC numbers.
> 
> We include this watermarked illustrative curve to explain error budget trade-offs, and outline our 5-point roadmap for proper multi-center clinical validation.
> 
> In conclusion: LUNGUARD proves how AI can prioritize patient safety by knowing when to say 'I am uncertain'. Thank you!"

*(Elapsed Time: ~2:55 – 3:00)*

---

## 💡 Quick Tips for a Flawless 3-Minute Take

1. **Pre-test the clicks**: Click each button once before hitting record so your browser has assets cached and animations are smooth.
2. **Leave 5 seconds of silence**: Stay quiet for 2 seconds after clicking record and 2 seconds before stopping—makes trimming clean and easy.
3. **Keep the mouse steady**: Move the cursor smoothly between buttons; avoid rapid jittering or circling.
4. **Recording tool**: Use Windows Game Bar (`Win + Alt + R`) or OBS Studio at 1080p 60fps.
5. **Private Window Check**: After uploading to Google Drive, open an Incognito window to confirm the link plays without requiring a login!
