# LUNGUARD Front-End Development Plan & Upgrade Specification

**Project:** LUNGUARD — Uncertainty-Aware Chest X-Ray Triage & Escalation Prototype  
**Submission:** DEXATHON 2026 Round 2 (Software Project Prototype)  
**Track:** Senior Front-End Engineer & Hackathon Mentor Prototype Upgrade  
**Date:** October 27, 2026  
**Status:** Completed & Empirically Verified (Ready for Video Recording & Submission)

---

## 1. Executive Summary & Baseline Audit (Step 0)

### Current System Status
- **Host Environment:** Windows PC, Node.js `v22.21.0`, npm `10.9.4`.
- **Framework & Libraries:** React `19.3.1`, Vite `8.3.4`, TypeScript `6.0.3`, Tailwind CSS `3.4.19`, Lucide React `1.61.0`, Zod `4.6.7`, Vitest `5.0.5`, Oxlint `1.88.0`.
- **Baseline Verification (October 27, 2026):**
  - `npm run typecheck`: **PASSED** (0 errors).
  - `npm run lint`: **PASSED** (0 errors, 0 warnings across 39 files).
  - `npm run test`: **PASSED** (6 test suites, 27 tests passing).
  - `npm run build`: **PASSED** (Vite production bundle generated successfully).

### Identified Gaps against Round 2 Requirements
1. **Default Mode & Dead-End Handling:** When no backend is running, `AppContext` previously fell back to `backend-unavailable` and hid the demo banner. *Requirement: Boot directly into clearly labeled `SIMULATED DEMO MODE` when backend is unreachable, with a persistent top banner on every route.*
2. **Sample Image & Honesty:** `ImageUploader` previously had a button labeled `Load Sample CXR (512x512)` using `patient_cxr_512x512.png`. *Requirement: Never fabricate or bundle images presented as real patient X-rays. Replace with a synthetic placeholder (e.g. gradient canvas labeled "SYNTHETIC PLACEHOLDER, NOT A REAL X-RAY") in `public/samples/`.*
3. **Genuine Client-side Image Checks:** Missing local image quality computation (dimensions, aspect ratio, grayscale detection, mean brightness, contrast measure, and non-diagnostic advisory warning for abnormal exposure/color).
4. **Deterministic Simulated Pipeline & Staged Progress:** Workspace simulated run should follow a deterministic staged pipeline (Validate → Preprocess → Model scores → Conformal prediction set → Safety policy → Triage) with identical output per scenario, clear SIMULATED disclaimers on every card, and a side-by-side scenario comparison view.
5. **Pure TypeScript Safety Policy & Interactive Explorer:** Abstention/escalation rules need to be extracted into a pure, testable function (`src/lib/safetyPolicy.ts`), and the Safety Engine page needs an interactive "Safety Policy Explorer" with sliders and toggles demonstrating live abstention triggers.
6. **Evaluation Page Additions:** Needs a clearly watermarked toy illustrative section on conformal sets vs. abstention tradeoffs, plus a "Demonstration vs. Validated Evaluation" explainer.
7. **Static Hosting Compatibility & Routing:** SPA fallback configuration (`_redirects`, `vercel.json`, `404.html`) and relative asset paths (`base: './'`) for reliable video recording and static host preview.
8. **Testing Coverage:** Add tests for `safetyPolicy.ts`, image quality checks, all four scenario exact texts, and banner behaviors.
9. **Documentation:** Comprehensive `README.md` and `docs/DEMO_VIDEO_GUIDE.md` for a 5-minute recording.

---

## 2. Technical Assumptions & Constraints
1. **Zero External API / Zero Telemetry:** Completely air-gapped, no external network calls, no analytics.
2. **Memory-Only Image Lifecycles:** Uploaded files stay strictly in memory via `URL.createObjectURL` and are revoked on unmount or reset. No `localStorage`, no uploads.
3. **Absolute Transparency:** All simulated numbers labeled as illustrative outputs; all targets (e.g. 98% malignancy sensitivity) stated as unvalidated engineering goals.
4. **No Git Automation:** Git history commands (`git commit`, `git push`, etc.) are left entirely to the user.

---

## 3. Implementation Phases & Working Order
- **Phase 1 (Completed):** Default Demo Mode boot, persistent banner on all routes, mode resilience (`src/context/AppContext.tsx`, `src/components/layout/DemoModeBanner.tsx`).
- **Phase 2 (Completed):** Synthetic placeholder sample in `public/samples/synthetic_cxr_placeholder.png`, image intake upgrade, strict MIME + magic bytes.
- **Phase 3 (Completed):** Client-side genuine image quality analyzer (`src/lib/imageQuality.ts`) & UI panel in Workspace.
- **Phase 4 (Completed):** Deterministic staged pipeline, 4 scenarios with exact clinical triage text, "What this outcome means" workflow guidance, and side-by-side scenario comparison (`AllScenariosModal.tsx`).
- **Phase 5 (Completed):** Pure TypeScript safety policy module (`src/lib/safetyPolicy.ts`, version `demo-policy-v1`) & live interactive Safety Policy Explorer on `/safety-engine`.
- **Phase 6 (Completed):** Evaluation page additions: synthetic toy concept visual + "Demonstration vs Validated Evaluation" guidance (`src/pages/Evaluation.tsx`).
- **Phase 7 (Completed):** Static hosting & routing review (Vite `base: './'`, `public/_redirects`, `public/404.html`, `vercel.json`).
- **Phase 8 (Completed):** Vitest test suite expansion for new modules & baseline verification (45 tests across 9 suites).
- **Phase 9 (Completed):** Responsive layouts and accessibility checks across mobile (390px), tablet (768px), and desktop (1366px+).
- **Phase 10 (Completed):** Comprehensive root `README.md` and `docs/DEMO_VIDEO_GUIDE.md`.

---

## 4. Final Empirical Verification Log (October 27, 2026)

| Command | Working Directory | Result | Notes / Details |
| :--- | :--- | :--- | :--- |
| `npm run typecheck` | `frontend/` | ✅ **0 Errors** | Strict TypeScript check passed (`tsc --noEmit`). |
| `npm run lint` | `frontend/` | ✅ **0 Errors, 0 Warnings** | Oxlint verified 46 source files across the project. |
| `npm run test` | `frontend/` | ✅ **45 Passed (9 Suites)** | Vitest unit and integration test suite passed cleanly in 11.41s. |
| `npm run build` | `frontend/` | ✅ **Build Succeeded** | Vite compiled relative `./assets/` production bundle in `dist/`. |
| Server Health Check | `http://127.0.0.1:5173/` | ✅ **HTTP 200 OK** | Serves valid HTML with `<div id="root"></div>` and responsive header. |

### Test Suite Distribution (45 Tests)
- `src/tests/fileValidation.test.ts` (6 tests): Valid PNG/JPEG, magic bytes check, spoofed files, oversized files, corrupt files.
- `src/tests/safetyPolicy.test.ts` (7 tests): Empty prediction set, single-class sets, dual-risk overlap, score escalation overrides.
- `src/tests/scenariosDeterministic.test.ts` (6 tests): Determinism across all four scenarios, exact triage wording, and pipeline state progression.
- `src/tests/imageQuality.test.ts` (5 tests): Canvas pixel analysis, grayscale detection, mean brightness, luminance contrast standard deviation, and quality warnings.
- `src/tests/apiClientAndSchema.test.ts` (6 tests): Zod schema contracts, network error isolation, API contract adherence.
- `src/tests/triageBanner.test.tsx` (6 tests): Exact clinical text renders for each outcome, SIMULATED badge presence.
- `src/tests/demoModeAndBanner.test.tsx` (3 tests): Default demo mode startup, persistent banner presence on all routes.
- `src/tests/neutralErrorAlert.test.tsx` (2 tests): Neutral error isolation (never resembles an uncertain triage result).
- `src/tests/evaluationPage.test.tsx` (4 tests): "Not yet measured" benchmark preservation, watermarked toy synthetic visual, validation requirements.
