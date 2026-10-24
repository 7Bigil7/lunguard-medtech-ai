# LUNGUARD Design System & UX Notes

**Project:** LUNGUARD Medtech AI  
**Role:** Clinical Decision-Support Triage Prototype  
**Audience:** Clinicians, Radiologists, DEXATHON 2026 Technical & Clinical Judges

---

## 1. Design Philosophy
LUNGUARD avoids generic consumer AI tropes (floating neon orbs, oversized gradients, generic "AI brain" art, inflated accuracy badges). Instead, it adopts the restrained, utilitarian visual language of hospital workstations and PACS/RIS diagnostic viewers.

### Core Principles
1. **Never Color Alone:** Every semantic status (Normal, TB-Consistent, Malignancy, Uncertain) pairs an accessible color token with an unambiguous icon and explicit textual label.
2. **Concept Separation:** In the code and UI, three concepts are never conflated:
   - *Model output scores* (raw uncalibrated model outputs),
   - *Conformal prediction set* (statistically bounded class sets),
   - *Safety-policy decision* (rule-based deterministic escalation logic).
3. **Humility & Non-Prescriptive Guidance:** Next-step recommendations defer to the clinician without prescribing proprietary lab tests or medical interventions.
4. **Air-Gapped Reliability:** All typography is self-hosted (`@fontsource/inter`), ensuring full offline functionality.

---

## 2. Color Palette & Semantic Tokens

### Neutral & Foundation
- `slate-950` (`#020617`): Deep clinical navy background for contrast framing and dark headers.
- `slate-900` (`#0f172a`): Primary surface for dark UI panels and contrast overlays.
- `slate-800` (`#1e293b`): Subtle dark borders, interactive cards.
- `slate-50` (`#f8fafc`): Off-white background for high-contrast light mode workspace.
- `teal-600` (`#0d9488`): Primary accent for actions and interactive system elements.

### Semantic Triage Outcomes
1. **Normal (`NORMAL`):**
   - Theme: Sage / Emerald (`emerald-700` text, `emerald-50` background, `emerald-500` border).
   - Icon: `CheckCircle2`.
   - Wording: "No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings."
2. **TB-Consistent (`TB_CONSISTENT`):**
   - Theme: Amber / Ochre (`amber-800` text, `amber-50` background, `amber-500` border).
   - Icon: `AlertTriangle`.
   - Wording: "Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required."
3. **Malignancy-Suspicious (`MALIGNANCY_SUSPICIOUS`):**
   - Theme: Rose / Crimson (`rose-800` text, `rose-50` background, `rose-500` border).
   - Icon: `AlertOctagon`.
   - Wording: "Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended."
4. **Uncertain / Dual-Risk (`UNCERTAIN_DUAL_RISK`):**
   - Theme: Deep Violet & Warning Border (`purple-900` text, `purple-50` background, `purple-600` accent border).
   - Icon: `ShieldAlert`.
   - Visual Treatment: High-contrast callout banner with dual warning badges.
   - Headline: "UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED."
   - Wording: "The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps."

### System Modes
- **Live Mode:** Teal badge (`bg-teal-50 text-teal-700 border-teal-300`).
- **Simulated Demo Mode:** Amber warning badge & full-width banner (`bg-amber-500 text-amber-950`).
- **Backend Unavailable:** Slate muted badge (`bg-slate-100 text-slate-700 border-slate-300`).

---

## 3. Typography Scale
- Body & UI: `Inter`, system-ui fallback stack.
- Monospace / Data: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`.
- Contrast minimum: WCAG 2.1 AA (4.5:1 for body copy, 3:1 for large text and UI components).
- Focus rings: High-visibility 2px teal offset outline for all keyboard-focusable controls.
- Motion: CSS transitions wrapped in `@media (prefers-reduced-motion: no-preference)`.
