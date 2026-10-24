# LUNGUARD Front-End Development Plan & Specification

**Project:** LUNGUARD — Uncertainty-Aware Chest X-Ray Triage & Escalation Prototype  
**Submission:** DEXATHON 2026 Round 2 (Software Project Prototype)  
**Developer:** Bharath (Solo Front-End / Full-Stack Track)  
**Date:** October 23, 2026  
**Status:** In Progress (Execution Wave 1)

---

## 1. Context & Scope
- **Current Phase:** Complete, polished, robust React + TypeScript + Tailwind CSS front-end with an interactive, multi-scenario Simulated Demo Mode and a strict API contract for subsequent FastAPI backend integration.
- **Out of Scope for this Phase:** Live model training, live Grad-CAM generation, FastAPI backend execution, databases, authentication, external cloud services.
- **Git Safety Rule:** NO git push, NO git commit, NO git remote add. All git history operations are manual by the user.

---

## 2. Key Technical Assumptions
1. **Host Environment:** Windows PC with Node.js v22.21.0 and npm 10.9.4.
2. **Font & Assets:** Self-hosted font package (`@fontsource/inter`) to avoid runtime CDN dependencies and ensure offline/air-gapped reliability during evaluation.
3. **Validation Strategy:** In-memory client-side binary validation inspecting magic bytes (PNG: `89 50 4E 47`, JPEG: `FF D8 FF`), MIME type, dimension thresholds (min 224x224), and decodability before any analysis is invoked.
4. **State & Mode Management:** Central application-level mode hook/context tracking `checking`, `live`, `backend-unavailable`, and `demo`. Demo mode is explicit and non-silent.
5. **No Placeholders / Real Schemas:** Zod runtime validation rejects corrupt/malformed API payloads into a neutral error screen without polluting clinical triage channels.

---

## 3. Step-by-Step Implementation Roadmap

### Wave 1: Foundation & Tooling
- Scaffold `frontend/` using Vite with React + TypeScript.
- Install and configure Tailwind CSS, PostCSS, Autoprefixer, Lucide icons, `@fontsource/inter`, Zod, React Router, Vitest, React Testing Library.
- Set up root and frontend `.gitignore`.
- Set up `docs/API_CONTRACT.md` and `docs/DESIGN_NOTES.md`.
- Create placeholder `backend/README.md` defining backend architecture and contract.

### Wave 2: Core Architecture & Services
- Define TypeScript API contract types (`src/types/api.ts`) and Zod schemas (`src/lib/schemas.ts`).
- Build `src/services/apiClient.ts` with AbortController, timeouts, health checking (`/api/health`), and runtime schema validation.
- Build `src/services/demoSimulator.ts` providing the 4 deterministic simulated scenarios (Normal, TB-Consistent, Malignancy-Suspicious, Uncertain / Dual-Risk) with synthetic scores, conformal sets, policy rules, and base64 Grad-CAM overlays.
- Create App state context for system mode (`checking`, `live`, `backend-unavailable`, `demo`).

### Wave 3: Layout, Navigation & Global State
- Build persistent top navigation bar with brand mark, route links, and live backend connection badge.
- Build global persistent Simulated Demo Mode banner with clear indicator and exit controls.
- Build clinical footer with mandatory research prototype disclaimer, DEXATHON 2026 attribution, and team credits.

### Wave 4: Workspace & File Validation
- Create drag-and-drop & file picker component with keyboard navigation.
- Implement client-side binary magic-byte inspector (`src/lib/fileValidation.ts`) checking PNG/JPEG signatures, max 10MB, and min 224x224 dimensions.
- Implement image metadata preview (filename, file size, image dimensions) with instant remove/replace.
- Case label input with clear privacy warning (no PHI/PII).
- Multi-step progress pipeline bar (Preprocessing → Feature Extraction → Conformal Inference → Safety Evaluation).

### Wave 5: Results Display & Decision Support
- Implement Triage Outcome Banner displaying the 4 exact outcome texts:
  - Normal
  - TB-Consistent
  - Malignancy-Suspicious
  - Uncertain / Dual-Risk (emphasized clinical escalation treatment)
- Model output scores breakdown (with clear disclaimer on raw vs calibrated scores).
- Conformal prediction set chips with alpha coverage explanation.
- Safety-policy decision panel with rule explanations and abstention status.
- Grad-CAM heatmap inspection panel with opacity slider, toggle, and dual-view comparison.
- Case summary and limitations drawer.
- Print stylesheet / export summary.
- Dedicated neutral error boundary component for network or schema failures.

### Wave 6: Comprehensive Core Pages
- **Landing Page (`/`):** Clinical rationale in TB-endemic regions, uncertainty-aware paradigm, 4-tier cards, architecture summary, research disclaimer, team credits.
- **Safety Engine (`/safety-engine`):** Interactive SVG pipeline diagram, statistical coverage vs engineering target breakdown (98% sensitivity target context), policy configuration rules.
- **Model Evaluation (`/evaluation`):** Typed `src/data/evaluation.json` structure, honest "Not yet measured" matrix, datasets under consideration analysis, target metrics.

### Wave 7: Automated Testing & Verification
- Vitest suite for:
  - Magic-byte file validation (valid PNG, JPEG, spoofed, corrupted, oversized).
  - Triage outcome exact texts and semantic icon pairings.
  - Dedicated neutral error component separation from triage states.
  - Demo banner and simulated badges presence.
  - Runtime Zod schema rejection of malformed API payloads.
  - Evaluation page rendering "Not yet measured" with zero fabricated figures.
- Verification checks: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.

### Wave 8: Manual End-to-End Walkthrough & Polish
- Browser subagent walkthrough across desktop and mobile viewports.
- Keyboard navigation and accessibility contrast check.
- Final documentation: root `README.md`.
