/**
 * Guidelines & Clinical Standards Reference Content
 * All display wording and links are centralized here for easy maintenance.
 */

// TODO: Replace with official NTEP guideline URL once confirmed by clinical partner
export const NTEP_GUIDELINE_URL_TODO: string | null = null

export interface GuidelineCard {
  id: string
  title: string
  organization: string
  badgeText?: string
  summary: string[]
  relation: string
  sourceUrl?: string
  sourceLabel?: string
  sourcePending?: boolean
}

export interface GuidelinesData {
  title: string
  subtitle: string
  cards: GuidelineCard[]
  footerNotice: string
}

export const GUIDELINES_CONTENT: GuidelinesData = {
  title: 'Guidelines: Standards & Guidance Reference',
  subtitle:
    'LungGuard is designed with reference to the following guidance. This is not a certification or regulatory approval.',
  cards: [
    {
      id: 'who-cad-tb',
      title: 'WHO guidance on computer-aided detection (CAD) for TB',
      organization: 'World Health Organization (WHO)',
      badgeText: 'Global CAD Protocol',
      summary: [
        'WHO recommends that CAD software may be used in place of human readers to interpret digital chest X-rays for TB screening and triage in people aged 15 and over (conditional recommendation, low certainty of evidence).',
        'WHO guidance also covers the initial calibration of CAD technologies.',
      ],
      relation:
        'It is built as a triage-support tool for TB screening, and it flags uncertain cases for human review.',
      sourceUrl: 'https://tbksp.who.int/en/node/1317',
      sourceLabel: 'View Official WHO Guidance',
      sourcePending: false,
    },
    {
      id: 'india-ntep',
      title: 'India NTEP diagnostic guidance',
      organization: 'National Tuberculosis Elimination Programme (NTEP)',
      badgeText: 'National Clinical Workflow',
      summary: [
        'NTEP uses chest X-ray as a triage tool, followed by bacteriological confirmation with a WHO-recommended rapid molecular test.',
      ],
      relation:
        'Cases it cannot confidently classify are escalated for clinician review and confirmatory testing, not given a final label.',
      sourcePending: true,
    },
    {
      id: 'bis-is-23485',
      title:
        'BIS IS 23485:2019 (Medical devices: Quality Management System and Essential Principles of safety and performance)',
      organization: 'Bureau of Indian Standards (BIS)',
      badgeText: 'Device Quality & Safety Standard',
      summary: [
        'Published by the Bureau of Indian Standards. Covers quality management system requirements and essential principles of safety and performance for medical devices, and was formed by combining ISO 13485:2016, ISO 16142-1:2016 and ISO 16142-2:2017.',
      ],
      relation:
        'Used as a design reference for documentation, risk thinking and traceability. LungGuard is a prototype and is NOT certified under this standard.',
      sourceUrl:
        'https://www.bis.gov.in/bis-publishes-is-23485-medical-devices-quality-management-system-requirements-and-essential-principles-of-safety-performance-for-medical-devices',
      sourceLabel: 'View BIS IS 23485:2019 Publication',
      sourcePending: false,
    },
  ],
  footerNotice:
    'Hackathon prototype. Triage support, not diagnosis. Not certified, not clinically validated, not a regulatory submission. Guideline summaries are paraphrased; please read the original documents. Last reviewed: November 2026.',
}
