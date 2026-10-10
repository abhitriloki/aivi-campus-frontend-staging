# AIVI System Documentation — Known Bugs & Forensic Resolutions Ledger
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Authoritative Engineering Record**

This document catalogs every significant bug, race condition, permission trap, and architectural defect encountered and resolved across the AIVI platform.

| Bug ID | Title & Module | Root Cause | Permanent Resolution |
| :---: | :--- | :--- | :--- |
| **B1** | **`onUserCreate` Timestamp Crash** | Mixing V8 `admin.firestore.FieldValue.serverTimestamp()` with V9 modular SDK caused fatal unhandled exceptions during Auth signup. | Refactored initialization to native Node `new Date()` within cloud function server instances. |
| **B2** | **Hostinger Deep Link 404 MIME Collision** | Navigating to direct paths (e.g. `/about`) caused static Apache web server to return 404 HTML instead of JS bundle, crashing Vite hydration. | Added `.htaccess` wildcard rewrite rules mapping all paths cleanly to `index.html - [L]`. |
| **B3** | **Gemini Model 404 Endpoint Error** | Requesting deprecated model strings against regional endpoints triggered 404 from `@google/generative-ai`. | Standardized on `gemini-2.5-flash` with UTF-8 byte order mark (BOM) sanitization on API keys. |
| **B4** | **Firebase OAuth Unauthorized Domain** | Production and staging domains (`aivilabs.com`, `aivicampus.com`) missing from GCP Identity Toolkit OAuth whitelist. | Programmatically authorized all apex and subdomains via Google Cloud Identity Toolkit API. |
| **B5** | **Zero-Speech Voice Interview False Score** | Candidates terminating voice sessions without speaking received synthetic 8.8 Strong Hire evaluations. | Implemented candidate speech threshold check (`candidateTurns.length === 0 || totalCandidateWords < 5`) showing clean aborted session state. |
| **B6** | **LLM JSON Parsing Crashes (500 Error)** | Gemini responses contained trailing commas, single-quoted keys, or markdown backticks breaking `JSON.parse`. | Built robust `parseGeminiJson` with regex stripping for markdown fences and unquoted keys. |
| **B7** | **Student Cross-Account Report Leakage** | `analysisService.ts` cached reports under an unscoped global key `aivi_local_history_${analysisType}`. | Scoped all local caching strictly by user ID: `aivi_local_history_${userId}_${analysisType}`. Purged on logout. |
| **B8** | **Staging Auth Nanosecond Session Bounce** | `AuthContext.tsx` re-triggered `initAuth()` on every pathname change, dropping sessions during routing. | Decoupled `initAuth()` from route changes; bound listener strictly to component mount `[]`. |
| **B9** | **Silent Firestore `PERMISSION_DENIED` on Sprints** | Strict rules blocked TPO writes to `/sprints`, causing writes to trap silently in TPO's browser `localStorage`. | Hardened Firestore rules for `sprints`, `placement_sprints`, and `drives`. Implemented direct atomic persistence. |
| **B10** | **Student Role Leakage & Admin Controls** | Role guard relied on `localStorage.getItem("aivi_active_role")`, allowing students to see TPO buttons. | Refactored guard so non-staff users strictly default to `isStudent = !isStaff` with zero admin leakage. |
| **B11** | **Coupled Placement & Resume Status Bug** | Updating placement status to "Higher Studies" accidentally overwrote resume verification status. | Decoupled fields in Firestore schema; both properties now execute completely independently. |
| **B12** | **NAAC SSR PDF Black Box Table Rendering** | jsPDF autoTable rendered black rectangles and overlapping columns in Metric 5.2.1 candidate roster. | Applied light-grey zebra styling, explicit column widths, and strict graduating batch scoping. |
| **B13** | **Staging Fail-Closed Domain Authorization** | Deploying production bundle to staging triggered fail-closed security block on `staging.aivicampus.com`. | Enforced `npm run build:staging` deployment workflow with automated environment injection. |
| **B14** | **Accidental Figma Redesign Ingestion** | Unsolicited UI redesign modified authentic login and landing page layout. | Executed surgical revert to authentic design; established global Figma safeguard rule. |
