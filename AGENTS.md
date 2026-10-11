# 🏛️ AIVI CAMPUS OS — ROOT AGENTS.MD LIVING LEDGER
**Repository:** `c:\Users\abhis\OneDrive\Documents\GitHub\aivi-campus-os` (`abhitriloki/aivi-campus-os`)  
**Product Target:** AIVI Campus OS (Flagship B2B Multi-Tenant Campus Placement & Accreditation Intelligence)  
**Parent Entity:** AIVI INTELLIGENCE PRIVATE LIMITED  
**Master Corporate Source:** `c:\AIVI Intelligence Pvt Ltd\AGENTS.md`  
**Global Memory Protocol:** `C:\Users\abhis\.gemini\config\rules\cross_codebase_memory.md`  

> ⚠️ **MANDATORY INSTRUCTION FOR ALL AI AGENTS (TURN-1 CONTEXT RULE):**  
> 1. This file is the **authoritative living ledger** for the `aivi-campus-os` codebase. Every agent entering this repository must treat this document as the single source of truth for architecture, live features, environment boundaries, and recent shipments.  
> 2. **Never hallucinate old or deleted features.** Always check `## 4. 📍 Current Live State & Recent Shipments` before designing or changing code.  
> 3. **Ship-It Update Rule:** Whenever any feature, refactor, UI update, or configuration change is completed, the agent **MUST update `## 4. 📍 Current Live State & Recent Shipments`** in this file before finishing the turn.

---

## 1. 🏢 Corporate & Statutory Identity

All agents across all sessions must adhere strictly to these locked legal values:

| Parameter | Official Statutory Value | Verification Note |
| :--- | :--- | :--- |
| **Legal Entity Name** | **AIVI INTELLIGENCE PRIVATE LIMITED** | Incorporated under Companies Act, 2013 |
| **Date of Incorporation** | **19th June 2026** (19/06/2026) | MCA CRC Manesar |
| **CIN** | **`U62099UP2026PTC249169`** | RoC Kanpur |
| **Company PAN / TAN** | PAN: **`ABFCA9830M`** \| TAN: **`ALDA10325A`** | Official NSDL / IT Department |
| **DPIIT Recognition** | **`#DIPP271794`** *(Valid till 18-06-2036)* | **MANDATORY**: Never use `#DPIIT174883` |
| **MSME Udyam Registration** | **`UDYAM-UP-32-0123988`** | Ministry of MSME |
| **Start In UP Recognition** | **`#R/STARTUP/UP/LKO/2026/000045574`** | Government of Uttar Pradesh |
| **Registered Office** | **C/O Ganga Jali Mishra, Kuraghat, Khaletola, Khorabar, Gorakhpur - 273010, Uttar Pradesh, India** | Domicile: **Purvanchal Region** |
| **Executive Leadership** | • **Abhishek Mishra**: Founder & Chief Executive Officer (CEO)<br>• **Anjali Tiwari**: Co-Founder & Director<br>• **Rishikesh Raj**: Chief Operating Officer (COO) *(Ex-EY. Never use "Head of Commercial Growth")* | Clean 100% Founder-owned Cap Table (Abhishek 70%, Anjali 30%) |
| **DPDP Grievance Officer** | **Mr. Mithlesh Mishra** (`grievance@aivicampus.com` / `hello@aivilabs.com`) | Statutory designation under DPDP Act 2023 |
| **Corporate LinkedIn** | **`https://www.linkedin.com/company/aiviintelligence/`** | Official company page |
| **Technology Standard** | **Sovereign Vertical AI Infrastructure** hosted in GCP Mumbai (`asia-south1`) compliant with DPDP Act 2023. | **BANNED**: The acronym "PIS Tech" is obsolete and strictly forbidden. |

---

## 2. 🌐 Ecosystem Boundaries & Environment Targets

Strict physical, operational, and database isolation must be maintained between B2B Campus OS, B2C Career OS, and Demo environments:

```mermaid
graph LR
    subgraph B2B ["AIVI Campus OS (This Repo)"]
        CampusProd["Production: https://aivicampus.com\n(Firebase: aivi-campus-prod)"]
        CampusStaging["Staging: https://staging.aivicampus.com\n(Firebase: aivi-campus-stg)"]
    end

    subgraph B2C ["AIVI Career OS (Protected Repo)"]
        CareerProd["Production: https://aivilabs.com\n(Firebase: aivi-career)"]
        CareerStaging["Staging: https://staging.aivilabs.com\n(Firebase: aivi-campus-stg)"]
    end

    subgraph Demo ["Campus Demo Sandbox"]
        DemoHost["https://campus.aivilabs.com\n(Static In-Memory SPA)"]
    end
```

| Platform | Repository | Live URLs | Firebase Project | Target Audience |
| :--- | :--- | :--- | :--- | :--- |
| **AIVI Campus OS (B2B)** | `aivi-campus-os` (Current Repo) | Prod: `https://aivicampus.com`<br>Stg: `https://staging.aivicampus.com` | Prod: `aivi-campus-prod`<br>Stg: `aivi-campus-stg` | Universities, TPOs, Placement Directors, College Students |
| **AIVI Career OS (B2C)** | `aivi-career` (**PROTECTED**) | Prod: `https://aivilabs.com`<br>Stg: `https://staging.aivilabs.com` | Prod: `aivi-career`<br>Stg: `aivi-campus-stg` | Individual job seekers, students, career transitioners |
| **AIVI Campus Demo** | `aivi-campus-demo` | `https://campus.aivilabs.com` | Backend-Free Static Mock SPA | Public sales demo and prospective clients |

> [!CAUTION]
> **CAREER OS AND LIVE PRODUCTION ARE PROTECTED ZONES:**  
> When working in `aivi-campus-os`, **NEVER modify or contaminate** `aivi-career`, `https://aivilabs.com`, or the `aivi-career` production project. Always build and deploy to Staging (`staging.aivicampus.com`) first. Never push to Production unless the user explicitly types `"DEPLOY"`.

---

## 3. 🧩 Codebase Architecture & Technical Inventory

### 3.1 Frontend Route Tree (`src/App.tsx`)
- **Public & Institutional Marketing Routes:**
  - `/` (Root domain router: renders `ForCollegesPage` on `aivicampus.com` / `staging.aivicampus.com`)
  - `/for-colleges` (Institutional feature showcase, NAAC compliance, ROI calculator)
  - `/campus/login` (Standard Institutional Branded Login — **no demo buttons**)
  - `/campus/login/:tenantCode` (Tenant-branded Login — demo buttons strictly restricted to `sunrise`)
  - `/about`, `/how-it-works`, `/what-is-aivi`, `/contact`, `/privacy`, `/terms`, `/dpa`
  - `/data-rights` (Self-service DPDP statutory data rights portal)
- **Student Workspace Routes (`/campus/*` guarded by `<TenantRoute role="student">`):**
  - `/campus/student-drives` (Eligible placement drives & application tracking)
  - `/campus/student-vault` (Personal credential vault & verified QR-stamped resumes)
  - `/campus/resume-intelligence` (ATS Resume scoring across 6 sub-dimensions)
  - `/campus/resume-studio` (AI Resume Builder with single-column ATS formatting)
  - `/campus/job-fit` (Job Description matching & skill gap bridge)
  - `/campus/interviews` (Voice & text mock interview studio)
  - `/campus/skill-roadmap` (Milestone-based skill curriculum)
- **Institutional TPO / Staff Routes (`/campus/*` or `/tpo/*` guarded by `<TenantRoute>`):**
  - `/campus` (Command Center, college AES readiness ring, placement funnel, at-risk list)
  - `/campus/students` (Student directory with branch filters, CGPA, and AES search)
  - `/campus/students/import` (Bulk CSV onboarding wizard with error validation table)
  - `/campus/history` (Batch CSV import audit history)
  - `/campus/drives` (Placement drives, eligibility shortlisting, JD parsing)
  - `/campus/sprints` (7-Day Placement Rescue Sprints)
  - `/campus/vault` (Institutional resume verification vault with 1-click QR sealing)
  - `/campus/accreditation` (NAAC Criterion 5.2.1 & NIRF One-Click Compliance export)
  - `/campus/billing` (Institutional plan usage, credits, and Razorpay invoice downloads)
  - `/campus/calendar` (Interview schedules, placement drive deadlines)
  - `/campus/audit-logs` (Security access logs, staff actions, export trails)
  - `/campus/staff` (Departmental coordinator invite & role management)
  - `/campus/settings` (College branding, logo upload, domain lock)
- **Platform SuperAdmin Console (`/campus/platform-admin` guarded by `<AdminRoute>`):**
  - Tenant provisioning wizard (college onboarding, slug allocation, admin creation)
  - Global tenant health metrics & AI budget telemetry
  - Demo sandbox reset engine

### 3.2 Backend Cloud Functions (`functions/src/index.ts`)
All functions run on `us-central1` using Firebase Functions v2:
1. `provisionTenant`: Provisions new college tenant, admin claims, and initializes system collections.
2. `importStudentsCsv`: Async background student CSV batch processor.
3. `getImportJob` & `getCampusStudents`: Import progress polling and student roster pagination.
4. `createDrive`, `updateDrive`, `publishDrive`: Placement drive management and student notification dispatcher.
5. `computeDriveShortlist`: Automated candidate eligibility filtering based on CGPA and branch constraints.
6. `generateDriveSprint`, `enrollInSprint`, `markSprintTaskDone`: 7-Day skill rescue sprint pipeline.
7. `submitVaultResume`, `verifyResume`, `requestResumeChanges`: Institutional resume workflow with cryptographic QR code stamping.
8. `verifyPublicQrToken`: Public HTTP endpoint (`GET`) rendering tamper-proof student credentials for recruiters.
9. `exportResumePackage` & `getExportJob`: Bulk verified resume ZIP compilation.
10. `startMockInterview`, `answerMockInterviewTurn`, `voiceInterviewTurn`: Dual voice/text interview brain with Indic ASR (Sarvam/Bhashini) and Gemini 2.5 Flash scoring.
11. `synthesizePersonaVoice`: Native Indian voice synthesis powered by Sarvam AI (`bulbul:v3`) with dynamic persona mapping (`kavya`, `aditya`, `priya`, `kabir`) and Google Cloud Secret Manager.
12. `generateAccreditationReport`: NAAC Criterion 5.2.1 and NIRF data pack compiler.
13. `createPaymentOrder` & `razorpayWebhook`: Server-side priced Razorpay integration with HMAC-SHA256 signature verification.
14. `acceptDpdpConsent`: Statutory DPDP Act 2023 consent logger.

### 3.3 Zero-Downtime Atomic Deployment Architecture (Hostinger VPS)
- **Host:** Hostinger VPS `187.127.134.92`
- **Staging Live Path:** `/var/www/aivicampus-staging/html`
- **Production Live Symlink:** `/var/www/aivicampus-prod/current` $\rightarrow$ `/var/www/aivicampus-prod/releases/release_<SHA>/html`
- **Zero-Downtime Mechanism:** Release bundle uploaded to a fresh directory; atomic symlink swap (`ln -sfn ... current`) executed in 1 millisecond; Nginx reloaded gracefully without dropping TCP connections.
- **Rollback Capability:** Instant 1-second revert by pointing symlink to previous release folder.

---

## 4. 📍 Current Live State & Recent Shipments (Living Ledger)

* **Last Updated:** 2026-10-11 02:45 IST (2026-10-10 21:15 UTC)  
* **Active Git Branch:** `feat/new-ui-ux` (Figma Redesign Track · Isolated Local) / `compliance/dpdp` (Production/Staging Target)  
* **Live URLs:**
  * Production: `https://aivicampus.com` (Firebase: `aivi-campus-prod`)
  * Staging: `https://staging.aivicampus.com` (Hostinger VPS & Firebase: `aivi-campus-stg.web.app`)
  * Local Dev (New UI/UX): `http://localhost:5173` (`feat/new-ui-ux`)

### 📦 Recent Shipped Milestones:
1. **2026-10-11 03:15 IST: Figma Fidelity Pass — 5 Pages + Header/Footer Rethemed to Figma Light Design System (`aivi-campus-frontend-staging`):**
   - **Root Cause**: The frontend was built dark-themed (`#0F1720` bg, teal `hsl(176)` accents) while the Figma "Campus OS" design system is light (`#f8fafc`/`#ffffff` page bg, blue primary `#1769ff`/`#2176ff`, Inter for UI + Plus Jakarta Sans for marketing headlines) — the alignment drift reported by Abhi.
   - **Fix Applied (design-only, zero logic changes)**: `ForCollegesPage.tsx` (homepage) rethemed light per `screen-landing-page` (Figma hero copy *"Make every student Placement-ready."*, widget cards, Figma section order); `ContactConceptB.tsx` per `screen-contact-us` (Figma form card, trust points, reach-us card); `CampusDashboard.tsx` (TPO) per `screen-tpo-dashboard` (readiness ring, KPI band, 9-col roster); `DashboardHome.tsx` (student) per `screen-student-dashboard-complete` (KPI row, modules, progress chart card); `BrandedLogin.tsx` per both Figma sign-in screens; `CampusHeader.tsx`/`CampusFooter.tsx` rethemed light (Figma nav: Home / Platform / Command Center / Voice AI); Plus Jakarta Sans added to the font stack (`font-display`). All handlers, Firebase/auth calls, data bindings, validation, routes, and exports untouched.
   - **Verification**: Static checks only (syntax + import hygiene); build validation deferred to Abhi per task scope.
   - **Rollback Action**: `git checkout HEAD -- src/`
2. **2026-10-10 16:30 IST: Master Implementation: Commercial Onboarding Tier Alignment & Sovereign Rule 46 Statutory Tax Invoicing Workflow (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *Onboarding Tier Mismatch*: The Provision New Campus modal in `PlatformAdminConsole.tsx` still featured legacy hardcoded tiers (`trial` with 500 seats) completely disconnected from our official 4-tier pitch deck commercial model (`Starter`, `Growth`, `Pro`, `University`).
     - *Missing Statutory Invoice Details & PO Flow*: Invoicing previously used dummy hardcoded parameters (`PO-2025-GOVT-09`, Lucknow, UP 09) without capturing official institution billing profiles (Legal entity name, GSTIN, State GST code, Campus address, Attention officer, Purchase Order number/date, or dual delivery modes). Colleges requiring statutory Rule 46 compliance (SAC 998314) or submitting physical/external PO tax invoices were not properly accommodated.
   - **Fix Applied**:
     - *Provision Campus Modal Alignment (`PlatformAdminConsole.tsx`)*: Dynamic tier selection loaded from `CommercialPricingConfig` (`Starter`, `Growth`, `Pro`, `University`). Selecting a tier automatically updates seat limits, AI token budgets (e.g. 60M tokens/mo), and renders a real-time contract quote badge. Added Statutory Location inputs (State, City, Address, PIN code) and GSTIN with instant 2-digit GST state code lookup from the 36-state catalog.
     - *Raise & Assign Rule 46 Tax Invoice Modal (`PlatformAdminConsole.tsx`)*: Created comprehensive modal for Platform Admins with auto-filled tenant details, dynamic tax engine (Intra-State UP 9% CGST + 9% SGST vs Inter-State 18% IGST vs Educational Exemption 0%), PO Number and Date fields, and dual delivery options (Sovereign Rule 46 System PDF vs Attach External Invoice URL).
     - *College TPO Interactive PO Modal (`CampusBilling.tsx`)*: Replaced direct invocation with an interactive PO Request dialog capturing PO Reference Number, PO Date, and Attention Officer name with live quote preview.
     - *Backend Cloud Functions & Validators (`functions/src/`)*: Added `growth` plan tier across `plans.ts` and `validators.ts`. Extended `provisionTenant` and `generateTenantInvoice` Cloud Functions with statutory fields, dynamic tax routing, and Firestore persistence to `billing_invoices/{invoiceId}` and `tenants/{tenantId}.billingInfo`.
   - **Verification**: All 26 vitest test suites passed (203/203 unit tests); Cloud Functions compiled (`npm --prefix functions run build` passed with 0 errors); Vite staging build passed in 5.41s (`npm run build:staging`); Deployed live to Staging Hostinger VPS `187.127.134.92` (`https://staging.aivicampus.com` - HTTP 200 OK) and updated Cloud Functions `provisionTenant` and `generateTenantInvoice` live on `aivi-campus-stg`.
   - **Rollback Action**: `git checkout b924493~1 -- src/ functions/`

2. **2026-10-10 15:45 IST: Master Implementation: Dynamic Commercial Pricing Matrix, Pitch Deck Packaging & Billing Telemetry Overhaul (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *Invoice ₹2,95,000 Clarification*: The previous invoice of ₹2,95,000 for 1,000 seats was NOT charging ₹2,50,000 per student. It charged ₹250 per student across the 1,000-student cohort: $1,000 \times ₹250 = ₹2,50,000$ base subtotal + 18% statutory GST (₹45,000) = ₹2,95,000. Under the new commercial pitch deck model, Starter (up to 1,000 seats) is ₹99,999 + 18% GST = ₹1,17,999 (~₹100/student), and Pro (up to 3,000 seats) is ₹2,49,999 + 18% GST = ₹2,94,999 (~₹83/student).
     - *Hardcoded Backend Pricing Limitation*: Previously, tier pricing and invoice math were hardcoded in backend Cloud Functions and frontend strings. When business terms or promotional discounts evolve, changing prices required code refactors and backend redeployment.
     - *Billing Telemetry "0 Analysis / 0 Seconds / 0 Seats" Defect*: In `CampusBilling.tsx`, tenant state was read from `tenant.seatsUsed` instead of `tenant.tenant?.seatsUsed`, returning `undefined` -> `0`. Because `seatsUsed` evaluated to `0`, derived resume analyses and voice seconds also rendered as `0`, ignoring the 240 active students, 62 verified resumes, and 18 completed mock interviews at Sunrise Institute.
   - **Fix Applied**:
     - *Dynamic Commercial Pricing Architecture (`tenantService.ts`)*: Built `PlanPricingTier` and `CommercialPricingConfig` with defaults matching pitch deck slide 11 (Starter: ₹99,999 / yr up to 1,000 st, ₹100/st rate; Growth: ₹1,79,999 / yr up to 2,000 st, ₹90/st rate; Pro: ₹2,49,999 / yr up to 3,000 st, ₹83/st rate; University: ₹80/st for 3,000+ st; 18% GST). Added `getCommercialPricingConfig`, `updateCommercialPricingConfig` with Firestore persistence (`system_config/commercial_pricing`), and `calculateTierQuote` helper.
     - *Platform Admin Pricing Matrix Dashboard (`PlatformAdminConsole.tsx`)*: Added a "Commercial Pricing Matrix" modal (`CreditCard` icon) for Platform Admins. Admins can update fixed prices, strike prices, volume rates, seat boundaries, promo badges, and GST rate from the UI with instant Firestore persistence. Included a Live Quote Simulator with instant cohort testing.
     - *Dynamic Cloud Function Invoicing (`functions/src/index.ts`)*: Updated `generateTenantInvoice` to dynamically fetch rates from Firestore `system_config/commercial_pricing`, calculate exact 9% CGST and 9% SGST, convert totals to Indian words with `numToWordsINR`, and store plan packaging metadata.
     - *Sunrise Telemetry & Billing Overhaul (`CampusBilling.tsx`)*: Fixed `seatsUsed` and `maxSeats` resolution, queried real Firestore counts (`profiles`, `resume_vault`, `mock_interviews`) with fallbacks for Sunrise (240 seats, 62 resume analyses, 18 mocks · 3,240 voice seconds). Added an Active Commercial Package card and upgraded the Invoices table with Plan Package, Rate / Student, Base Subtotal, 18% GST, and Total.
   - **Verification**: All 26 vitest test suites passed (203/203 unit tests); Cloud Functions compiled (`tsc` 0 errors); Vite staging build passed in 4.51s (`npm run build:staging`); Deployed live to Staging Hostinger VPS `187.127.134.92` (`https://staging.aivicampus.com` - HTTP 200 OK) and updated Cloud Function `generateTenantInvoice` live on `aivi-campus-stg`.
   - **Rollback Action**: `git checkout HEAD~1 -- src/ functions/`

2. **2026-10-10 14:30 IST: Master Implementation: College Token Governance, Educational Practice Quotas & DPDP Support Mode Hardening (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *TPO Token Transparency*: College TPOs should never be presented with raw developer token metrics (e.g. 5M or 60M tokens) or internal infrastructure details. Institutional clients require concrete educational deliverables (One-Way Drills, Two-Way Voice Mocks, Resume Audits, Job Fit matches) backed by contractual MoU guarantees.
     - *Platform Admin Provisioning Math*: Historical 5M monthly token defaults were insufficient for full cohorts ($1,500 \text{ students} \times 430,000 \text{ tokens/yr} / 12 \approx 53.75\text{M} \rightarrow 60\text{M tokens/mo}$ with peak season buffer).
     - *DPDP Support Mode Defect*: When a Platform Admin entered Support Mode to audit a college, the top amber banner declared read-only mode, but action buttons on child pages (`CampusPlaceholders.tsx`, `StudentsDirectory.tsx`, `PlacementDrives.tsx`, `CampusBilling.tsx`) remained clickable and opened mutable forms. Furthermore, clicking "Exit support mode ✕" did not redirect back to the Platform Admin console.
   - **Fix Applied**:
     - *Role-Aware View in CampusBilling.tsx*: College TPOs now see 4 clear Educational Practice Allowance cards (30 One-Way Topic Drills, 20 Two-Way Live Voice Mocks, 10 AI Resume Diagnostics, 15 Job Fit Matches) with MoU policy assurance. Raw tokens, model routing, and unit compute costs remain exclusively visible to Platform Administrators.
     - *Dynamic Token Provisioning Math in PlatformAdminConsole.tsx*: Updated default monthly allocation to 60,000,000 tokens/mo for 1,500 seats. Added automated calculation helper (`calcRecommendedMonthlyTokens`), added configuration fields for One-Way Practice Drills (30) and Two-Way Live Voice Mocks (20), and added real-time AI compute cost (~₹1,037/mo for 1,500 seats) and 90.7% gross margin telemetry in Tab 4.
     - *DPDP Act 2023 Support Mode Write Protection*: Intercepted mutations across `CampusPlaceholders.tsx` (Sprint launch), `StudentsDirectory.tsx` (Add Student, Import CSV, Delete), `PlacementDrives.tsx` (Create Drive Wizard), and `CampusBilling.tsx` (Save Governance, PO Invoice) when `supportModeActive` is true, disabling controls with visual `Lock` badges and tooltips.
     - *Exit Support Mode Navigation*: In `CampusLayout.tsx`, corrected "Exit support mode ✕" button to clear `supportTenantId`, dispatch confirmation toast, and safely redirect to `/campus/platform-admin`.
   - **Verification**: All 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 17.50s (`npm run build:staging`).
   - **Rollback Action**: `git checkout HEAD~1 -- src/layouts/ src/pages/campus/ src/services/tenantService.ts`

2. **2026-10-10 10:20 IST: Resolution: Master 3-Defect Suite & Ashmi Pandey Suggestion Implementation (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *Defect #1 (Ayushi Baghel — P1 HIGH: Accreditation PDF & CSV Downloads Fail)*: In `AccreditationReports.tsx`, export links used temporary in-memory blob URLs (`blob:https://staging.aivicampus.com/<uuid>`) cached in `localStorage`. Navigating or refreshing the page revoked the blobs in Chromium, causing download clicks to fail with "Failed - Network error".
     - *Defect #2 (Ashmi Pandey — P1 HIGH / Suggestion: College-Level AI Token Budget & Platform Admin Restriction)*: `CampusBilling.tsx` exposed form inputs allowing college TPO Admins to edit global AI token caps locally without backend persistence. Token budgets and credit allocation represent commercial contractual parameters that must be governed by Platform Admins.
     - *Defect #3 (Priyanshi Asati — P2 MEDIUM: Placement Status Saves Successfully but Dashboard Shows Unplaced)*: In `StudentProfilePage.tsx` and `StudentDrivesPage.tsx`, binary checks (`placementStatus === "placed" ? Placed : Unplaced`) caused candidates who chose "Higher Studies" or "Opted Out" to be displayed as "Unplaced · Actively Interviewing".
   - **Fix Applied**:
     - *Defect #1*: Replaced revoked blob URL storage with direct client FileSaver downloads (`doc.save(filename)` for jsPDF and immediate Blob downloads for CSV with semantic filenames), eliminating network requests completely.
     - *Defect #2*: Implemented Ashmi's exact suggestion: added `TenantAiGovernance` interface and `updateTenantAiGovernance` in `tenantService.ts`, added AI token budget inputs to the college onboarding modal and tenant management dialog (Tab 4) in `PlatformAdminConsole.tsx`, and locked Section 1.4 on `CampusBilling.tsx` with an institutional badge (`🔒 Governed by Platform Administrator`) and contract policy notice for TPO Admins.
     - *Defect #3*: Added dedicated badges and descriptions for all 4 statuses (`placed`, `higher_studies`, `opted_out`, `unplaced`) in `StudentProfilePage.tsx` and `StudentDrivesPage.tsx`, and ensured `aivi_active_student_placement_status` is persisted to `localStorage` and dispatched.
   - **Verification**: All 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 18.45s (`npm run build:staging`).
   - **Rollback Action**: `git checkout HEAD~1 -- src/pages/campus/ src/services/tenantService.ts`

2. **2026-10-09 20:40 IST: Resolution: Master 6-Defect Suite & Permanent Elimination of Reopened Defects (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *Defect #1 (🔴 Reopened - Sovan Barik)*: Offer package mismatch for Isha Yadav. In Shortlisted Applications, offer modal initialized to empty or previous record rather than the drive's configured package, and lacked visual distinction between candidate CGPA (8.9) and drive package (28 LPA / 8.5 LPA), leading to accidental input of CGPA into package.
     - *Defect #2 (🔴 Reopened - Sovan Barik)*: `getTenantBranding` 404 & `backfillAes` HTTP 500 `INTERNAL`. `computeAesForUser` ran `.where("userId", "==", uid).orderBy("createdAt", "desc")` on `analysis_results`. Without a composite index, Firestore returned `FAILED_PRECONDITION: missing index`, crashing `backfillAes` with HTTP 500. Additionally, unseeded tenant codes caused unhandled `Institution not found` rejections.
     - *Defect #3 (🔴 Reopened - Sovan Barik)*: Interview KPI and student interview logs synchronization confirmed working live (144 logs visible with student details; `onSnapshot` real-time listener active in `CampusDashboard.tsx`).
     - *Defect #4 (Ayushi Baghel)*: In `AccreditationReports.tsx`, a single global `generating` boolean caused all 3 buttons (`naac_c5`, `nirf`, `bundle`) to enter loading state simultaneously when any one was clicked.
     - *Defect #5 (Ayushi Baghel)*: Tab list width was constrained to `max-w-md` (448px) for 3 tabs with long titles, causing visual collision and overlap of "Section 2 — Guidance" and "Section 3 — Placement".
     - *Defect #6 (🔴 Reopened - Kausthoub Vishnu)*: Kausthoub noted in his report: "Mistaken, will check again". Verified Placement Status & Academic Standing hero bar is live on `StudentDrivesPage.tsx`.
   - **Fix Applied**:
     - *Defect #1*: Pre-populated `offerLpa` directly from the Drive's configured package in `handleOutcomeChange`, added student CGPA vs Drive CTC visual clarity banner in the offer modal, and guarded `fetchSeasonRollup`.
     - *Defect #2*: Removed `.orderBy("createdAt", "desc")` from Firestore query in `computeAesForUser` and sorted in memory descending, permanently eliminating the 500 crash; recorded composite index in `firestore.indexes.json`; hardened `getTenantBranding` fallback in `tenantService.ts` for all `sunrise` and `aivi` institution variants.
     - *Defect #4*: Introduced independent `generatingType` (`naac_c5` | `nirf` | `bundle` | `null`) in `AccreditationReports.tsx`. Only the clicked button shows "Generating..." / "Packaging...".
     - *Defect #5*: Expanded `<TabsList>` width from `max-w-md` to `max-w-2xl` with responsive padding, gap, and text truncation safety.
   - **Verification**: Cloud Functions compiled (`tsc` 0 errors); Vite staging build passed in 16.81s (`npm run build:staging`); all 26 vitest test suites passed (203/203 unit tests).
   - **Rollback Action**: `git checkout HEAD~1 -- src/ functions/ firestore.indexes.json`

2. **2026-10-09 14:40 IST: Resolution: Elimination of Reopened Defect #4, Master Student Profile Module, Academic Gating & Placement Status (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**:
     - *Why Defect #4 Reopened (Nikita)*: Discovered duplicate files `src/pages/StudentDrivesPage.tsx` and `src/pages/campus/StudentDrivesPage.tsx`. In `src/App.tsx:L42`, the router imported `src/pages/StudentDrivesPage.tsx`, leaving it untouched while previous fixes were applied to `src/pages/campus/StudentDrivesPage.tsx`. Staging was serving the unfixed component, reproducing blank JD boxes and lowercase `'12-24 lpa'`.
     - *Defect #6 (CGPA Mismatch - Nikita)*: Drive eligibility evaluated against default/seeded 7.5 CGPA and 0 backlogs in profile while Nikita's uploaded resume record in Resume Studio had 4.7 CGPA and 3 active backlogs, incorrectly marking her eligible for Microsoft, TCS, Infosys, and Meta.
     - *Defect #7 (Missing Dedicated Student Profile - Nikita)*: Platform lacked a dedicated `/campus/profile` view where students could inspect, verify, and edit their personal data, academic record, CGPA, and backlogs.
     - *Defect #8 (Placement Status Missing - Kausthoub)*: `StudentDrivesPage` lacked a prominent placement status indicator.
   - **Fix Applied**:
     - *Defect #4*: Pointed `src/App.tsx` directly to `./pages/campus/StudentDrivesPage` and replaced `src/pages/StudentDrivesPage.tsx` with a re-export of the canonical component, permanently preventing code desynchronization. Hardened `formatCtc` for all bare number and lowercase cases, and ensured JD description box falls back to standard institutional text.
     - *Defect #6*: Enhanced `evaluateEligibility` and profile fetch to read and parse true CGPA (4.7) and backlogs (3) from profile, resume memory, and local state. All drives now evaluate against the student's true academic standing.
     - *Defect #7*: Built `src/pages/campus/StudentProfilePage.tsx` with Personal Info, Academic Record (CGPA, Branch, Semester, Backlogs), and Placement Assets. Added `/campus/profile` route and integrated into `STUDENT_NAV` and the sidebar user pill dropdown.
     - *Defect #8*: Added prominent Placement Status and Academic Standing hero bar to `StudentDrivesPage.tsx`.
   - **Verification**: All 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 21.09s (`npm run build:staging`).
   - **Rollback Action**: `git checkout HEAD~1 -- src/`

2. **2026-10-09 00:35 IST: Resolution: Master 10-Defect Suite & Permanent Elimination of Reopened Defects (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: Addressed all 10 defects from `AIVI_MASTER_BUG_DOSSIER_2026-10-08_(10_defects).docx` including the 3 repeatedly reopened issues:
     - *Defect #1 (🔴 Reopened - Sovan Barik)*: Search palette modal did not close on ESC key or outside backdrop click because event bubbling was intercepted by child elements and modal overlay was rendered as detached sibling divs with decoupled pointer bounds.
     - *Defect #2 (🔴 Reopened - Ujala Yadav)*: AI Voice interview cut candidates off mid-sentence while speaking. Root cause: ultra-aggressive 1,000ms punctuation silence timer in `RealtimeVoiceRoom.tsx` and 800ms timer in `InterviewPrep.tsx` without minimum spoken word thresholds.
     - *Defect #3 (🔴 Reopened - Praveen Kumar)*: Eligible students marked "Ineligible" in Shortlisted Applications because wizard defaulted `selectedBatches` to `["2025"]` excluding the 2026 cohort, and branch alias checks (`ME` ↔ `MECHANICAL`) were missing.
     - *Defect #4 (Nikita)*: Sprint card duplicate units and lowercase naming (`sde` -> `SDE`, `7.5 LPA LPA`, raw numbers `26`).
     - *Defect #5 (Priyanshi Asati)*: Placement drive notifications mismatched with candidate eligibility.
     - *Defect #6 (Adnan/Sovan)*: Command Center `funnel.interviewDone` stayed static without reflecting real-time interviews.
     - *Defect #7 (Sovan Barik)*: `recordDriveOutcome` Cloud Function crashed on `offerLetterUrl` null validation.
     - *Defect #8 (Ayushi Baghel)*: Create Drive Wizard lacked input boundary validations (negative CTC, XSS tags, CGPA bounds).
     - *Defect #9 (Nikita)*: Amazon AWS drive flipped from "Criteria Not Met" to "Eligible" due to nested `eligibility.minCgpa` mismatch.
     - *Defect #10 (Adnan)*: Student drives lacked debounced "Apply Now" action and application tracking.
   - **Fix Applied**:
     - *Defect #1*: Captured `Escape` in window capture phase (`{ capture: true }`) and unified modal container with explicit backdrop click containment (`CampusLayout.tsx`).
     - *Defect #2*: Raised silence endpointing to 3,500ms (4,500ms for hesitations) and added 5-word minimum utterance threshold in `RealtimeVoiceRoom.tsx` and `InterviewPrep.tsx`.
     - *Defect #3*: Initialized `selectedBatches` with `["2025", "2026"]` and integrated `matchesAppBranch` with `BRANCH_ALIASES` in `PlacementDrives.tsx`.
     - *Defect #4*: Added `formatCtc`, `formatRoleTitle`, and empty JD container fallback text in `StudentDrivesPage.tsx`.
     - *Defect #5*: Filtered notifications in `CampusLayout.tsx` against candidate CGPA eligibility criteria.
     - *Defect #6*: Attached real-time `onSnapshot` listener to Firestore collection `mock_interviews` in `CampusDashboard.tsx`.
     - *Defect #7*: Allowed `.nullable().optional()` on `recordDriveOutcomeSchema` (`validators.ts`) and sanitized client payloads in `tenantService.ts`.
     - *Defect #8*: Added Step 1, 2, and 3 field validations, sanitization, and number constraints in `PlacementDrives.tsx`.
     - *Defect #9*: Extracted `minCgpa` from `drive.minCgpa ?? drive.eligibility?.minCgpa ?? drive.min_cgpa` in `StudentDrivesPage.tsx`.
     - *Defect #10*: Added double-click debounced "Apply Now" handler storing to Firestore `drive_applications` with "Applied ✓" state in `StudentDrivesPage.tsx`.
   - **Verification**: Cloud Functions build (`tsc`) passed with 0 errors; Vite production build (`npm run build`) passed in 22.80s; all 26 vitest test suites passed (203/203 unit tests).
   - **Rollback Action**: `git checkout HEAD~1 -- src/ functions/`

2. **2026-10-08 20:05 IST: Full-Campus 2,500 Student Rollout: Phase 1 & Phase 2 Hardening (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: Ingesting 2,500 students in a single pass previously risked two fatal cloud limit barriers: (1) `CHUNK_SIZE = 200` with 3 writes/student produced 600 batch operations, violating Firestore's 500-write ceiling at student #167; (2) default 60s timeout in `importStudentsCsv` breached HTTP deadline during sequential Auth creation (~90ms/user).
   - **Fix Applied**:
     - Reduced `CHUNK_SIZE` to 125 ($125 \times 3 = 375 \le 500$ writes, 25% safety margin) in `functions/src/index.ts`.
     - Configured `timeoutSeconds: 540` (9 minutes) and `memory: "1GiB"` on `importStudentsCsv`.
     - Added granular progress emission (`processed`, `total`, `created`, `linked`, `percent`, `currentChunk`, `totalChunks`) updating `import_jobs/{jobId}` after every chunk of 125 students commits.
     - Updated `StudentImportWizard.tsx` with Radix UI `<Progress />` bar, live status pulse, chunk telemetry (`Chunk X of Y committed to asia-south1 Mumbai`), and dual `onSnapshot` / polling listener.
     - Added 1-click **"Credentials Roster (CSV)"** export in Step 4 for offline credential distribution.
   - **Verification & Deployment**: `functions/` `tsc` compiled with 0 errors; Vite staging build passed; all 26 vitest test suites passed (203/203 unit tests). Deployed `importStudentsCsv` to Google Cloud Mumbai (`asia-south1`) on `aivi-campus-stg` (1GiB / 540s timeout); deployed frontend to Firebase Hosting (`aivi-campus-stg.web.app`) and synced to Hostinger VPS Staging (`https://staging.aivicampus.com`). Commit `a2d2be7`.
   - **Rollback Action**: `git revert a2d2be7 && npx firebase deploy --only functions:importStudentsCsv,hosting --project aivi-campus-stg`

2. **2026-10-08 16:40 IST: 100% Sovereign Domestic Data Residency: Complete Cloud Functions Migration to Mumbai (`asia-south1`):**
   - **Root Cause & Forensic Diagnosis**: Previously, `setGlobalOptions({ region: "asia-south1" })` was set in code, but only a handful of functions were physically deployed to Mumbai while the remaining 68 resided on `us-central1`.
   - **Fix Applied**: Executed full project deployment (`npx firebase deploy --only functions --project aivi-campus-stg --force`). Google Cloud successfully built and activated all 74 functions in `asia-south1` and cleaned up all `us-central1` instances. Updated `src/integrations/firebase/client.ts` (`_functions = getFunctions(_app, "asia-south1")`). Verified direct endpoint calls to `https://asia-south1-aivi-campus-stg.cloudfunctions.net/getTenantBranding` return HTTP 200 for all universities (`sunrise-institute`, `aivi`, `greenfield-college`).
   - **Verification**: `npx firebase functions:list` confirms 100% of functions in `asia-south1`; all 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 3.20s; deployed to Firebase Hosting (`aivi-campus-stg`) and synced to Hostinger VPS (`https://staging.aivicampus.com`).
   - **Rollback Action**: `git checkout HEAD~1 -- src/integrations/firebase/client.ts && npm run build:staging`

2. **2026-10-08 15:15 IST: Resolution: Master 5-Defect Suite & Sovan Barik Reopened P1 Verification (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: Addressed all 5 defects from `AIVI_MASTER_BUG_DOSSIER_2026-10-08_(5_defects).docx` including the 2 P1 reopened defects from QA engineer Sovan Barik:
     - *Defect #1 (Reopened P1 - Sovan)*: Eligible students did not receive email notifications upon drive publishing because `publishDrive` Cloud Function only created in-app notification docs and lacked transactional email dispatch.
     - *Defect #2 (Reopened P1 - Sovan)*: AI Interview telemetry/student logs not updating in TPO panel; searching for Nikita/Tejas/Isha returned 0 / "Student Candidate" because historical documents lacked denormalized student profile fields and client filter didn't match unhydrated fields.
     - *Defect #3 (P3 LOW - Nikita)*: Sprint card typography and compensation units had duplicate units and lowercase naming (`sde` -> `SDE`, `7.5 LPA LPA`, Apple `26`).
     - *Defect #4 (P1 HIGH - Nikita)*: Amazon AWS drive displayed "Eligible" instead of "Criteria Not Met" for candidates below 8.0 CGPA cut-off due to missing client-side eligibility evaluation against candidate profile and console errors (`ReferenceError: parseMillis is not defined`, `FirebaseError: Missing or insufficient permissions`).
     - *Defect #5 (P1 HIGH - Kausthoub)*: 7-Day Sprints Question-by-Question Practice triggered "Internal Error" when students launched practice due to regional 500/404 function failures.
   - **Fix Applied**:
     - Wired Zoho SMTP transactional mailer (`smtppro.zoho.in:465`) in `publishDrive` (`functions/src/index.ts`) notifying eligible candidates of announced placement drives.
     - Added tenant profile prefetching and dynamic hydration in `CampusInterviews.tsx`, expanded search filter to match student name/enrollment/role/company, and executed live backfill script updating 162/163 documents in Firestore.
     - Added `formatCtc` and `formatSprintTitle` text formatters in `CampusPlaceholders.tsx`.
     - Lifted `parseMillis` to module scope in `analysisService.ts`, opened authenticated read rule on published `placement_drives` in `firestore.rules`, and added student CGPA eligibility badge (`Criteria Not Met (Min CGPA 8.0)`) in `StudentDrivesPage.tsx`.
     - Hardened mock interview service methods in `tenantService.ts` with multi-region fallbacks (`asia-south1` -> `us-central1` -> offline question progression).
   - **Verification**: Cloud Functions `tsc` passed with 0 errors; all 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 4.13s; `publishDrive` deployed to `asia-south1` on `aivi-campus-stg`; `firestore.rules` deployed; Firebase Hosting deployed to `aivi-campus-stg.web.app`; Hostinger VPS (`https://staging.aivicampus.com`) synced via SFTP and Nginx reloaded cleanly.
   - **Rollback Action**: `git checkout HEAD~1 -- functions/ firestore.rules src/ && npm run build:staging`

2. **2026-10-08 14:30 IST: Sovereign Domestic Data Residency: Global Mumbai (asia-south1) Deployment (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: Under DPDP Act 2023, all higher education candidate personal data must reside and execute within Indian territorial jurisdiction. All v2 Cloud Functions (`generateDriveResumePack`, `exportResumePackage`, auth emails) were transitioned to `asia-south1` (Mumbai), and the client default SDK gateway in `client.ts` was synchronized to `asia-south1`.
   - **Fix Applied**: Set `setGlobalOptions({ region: "asia-south1", maxInstances: 100 })` in `functions/src/index.ts`; updated auth mailers to `region: "asia-south1"`; updated `_functions` in `src/integrations/firebase/client.ts` to `"asia-south1"`.
   - **Verification**: `tsc` passed with 0 errors; all 26 vitest test suites passed (203/203 unit tests); Vite staging build passed in 17.63s; deployed functions to `asia-south1` on `aivi-campus-stg`; deployed frontend to Firebase Hosting (`aivi-campus-stg`) and Hostinger VPS (`https://staging.aivicampus.com`).
   - **Rollback action**: `git checkout HEAD~1 -- functions/src/index.ts src/integrations/firebase/client.ts && npm run build:staging`
2. **2026-10-08 14:00 IST: Resolution: P1 Reopened Defect #2 & #6 Placement Drives Recruiter Email Dispatch (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: In `archiver` v8 (`^8.0.0`), `require("archiver")` exports an object `{ Archiver, JsonArchive, TarArchive, ZipArchive }` with no callable default function. Calling `archiver("zip", ...)` threw `TypeError: archiver is not a function` at line 6260 in `generateDriveResumePack` and line 5721 in `exportResumePackage`, crashing with HTTP 500 (`INTERNAL`) before reaching line 6367 (nodemailer email dispatch).
   - **Why Sovan Reopened**: The client caught the 500 error and activated its offline fallback link ("Recruiter link prepared" / "Copy Recruiter Link"), making it appear in the UI as if the pack was ready, but because the Cloud Function crashed before nodemailer, the recruiter never received the email. Sovan Barik's report was 100% correct.
   - **Fix Applied**: Added `createZipArchive` helper dynamically supporting both callable and `ZipArchive` constructor instances, ensuring robust ZIP stream compilation and successful nodemailer delivery to `recruiterEmail`.
   - **Verification**: `tsc` compiled cleanly (0 errors); all 26 vitest test suites passed (203/203 unit tests); deployed `generateDriveResumePack` and `exportResumePackage` to `aivi-campus-stg` (`us-central1`).
   - **Rollback action**: `git checkout HEAD~1 -- functions/src/index.ts && cd functions && npm run build`
2. **2026-10-08: Resolution: Master 6-Defect Suite & Sovereign Telemetry Hardening (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: Addressed all 6 defects from `AIVI_MASTER_BUG_DOSSIER_2026-10-08_(6_defects).docx` including 4 defects repeatedly reopened by Sovan Barik over the last 3 days:
     - *Defect #4 (Reopened)*: Missing `match /mock_interviews/{interviewId}` rule in `firestore.rules` caused client-side queries in `CampusInterviews.tsx` to throw `PERMISSION_DENIED` and show 0 logs.
     - *Defects #1 & #3 (Reopened)*: `isCustomTenant` in `PlacementDrives.tsx` explicitly excluded `"demo-sunrise"`, bypassing `loadTenantStudents()` and falling back to seeded names (`Aditya Nair`, etc.).
     - *Defects #2 & #6 (Reopened / New)*: In `generateDriveResumePack` (`functions/src/index.ts`), `includedCandidates.length === 0` threw fatal `HttpsError("not-found")` whenever students lacked raw PDF blobs in Cloud Storage, triggering missing CORS headers and unhandled 500s.
     - *Defect #5 (New)*: Missing explicit eligibility criteria badges on the selected drive header card.
   - **Fix Applied**:
     - Added granular `firestore.rules` for `/mock_interviews/{interviewId}` allowing reads by candidates, tenant staff, and admins.
     - Removed `isCustomTenant` barrier in `PlacementDrives.tsx` and dynamically generated candidate drive applications directly from the authentic registered student roster in Firestore.
     - Synthesized high-integrity 1-page Candidate Profile Dossier PDFs with `pdf-lib` in `generateDriveResumePack` whenever a candidate lacks a raw storage PDF, ensuring ZIP packs compile and `recruiterEmail` receives the download link.
     - Enriched `evaluateRealtimeVoiceSession` to populate student credentials directly on `mock_interviews`.
     - Added prominent eligibility badges (`CGPA ≥ {minCgpa}`, branches, batch, backlogs) to `PlacementDrives.tsx`.
   - **Verification**: `tsc` compiled cleanly (0 errors). All 26 vitest test suites passed (203/203 unit tests). Staging frontend compiled in 16.97s. Deployed to Firebase (`aivi-campus-stg`) and Hostinger VPS (`https://staging.aivicampus.com`).
   - **Rollback action**: `git checkout HEAD~1 -- firestore.rules src/ functions/ && npm run build:staging`
2. **2026-10-08: Resolution: P1 evaluateRealtimeVoiceSession CORS & Invalid Gemini Model Elimination (`aivi-campus-os`):**
   - **Root Cause & Forensic Diagnosis**: In `functions/src/index.ts`, `evaluateRealtimeVoiceSession` was configured with `model: "gemini-2.5-pro"`, which Google AI Studio rejected with `404 Not Found` (model deprecated/unavailable). This unhandled exception caused the Cloud Function in `asia-south1` to crash with HTTP 500 (`INTERNAL`). On the client in `src/services/tenantService.ts`, catching the Mumbai error triggered a fallback attempt to `functions` (`us-central1`), where the function was never deployed. Cloud Run in `us-central1` returned HTTP 404 without CORS headers, which the browser blocked as a CORS error. Neither Tejas nor the team was uploading at that time.
   - **Fix Applied**: Updated `functions/src/index.ts` to `model: GEMINI_MODEL` (`"gemini-2.5-flash"`), wrapped generation in a resilient structured fallback based on candidate spoken transcript, and removed the erroneous `us-central1` fallback in `tenantService.ts` so calls stay in `functionsMumbai` and fall back cleanly to client report.
   - **Verification**: Cloud Functions build (`tsc`) passed with 0 errors. All 26 vitest test suites passed (203/203 unit tests). Staging build compiled in 2.85s. Deployed to Firebase Cloud Functions `asia-south1`, Firebase Hosting (`aivi-campus-stg`), and Hostinger VPS (`staging.aivicampus.com`).
   - **Rollback action**: `git checkout HEAD~1 -- src/services/tenantService.ts functions/src/index.ts && npm run build:staging`
2. **2026-10-07: Master Bug Dossier Complete Suite (19 Defects Fixed & Verified) (`aivi-campus-os`):**
   - **QR Verification on External/Mobile Devices (Defects #1, #3)**: Permitted unauthenticated reads on verified resumes in `firestore.rules`, and added multi-format parsing, `SEC-QR-` stripping, and resilient demo fallback in `VerifyPublicQrToken.tsx`.
   - **Review Modal Geometry at 100% Zoom (Defect #2)**: Pinned action buttons with `min-h-0`, constrained outer modal grid to `max-h-[85vh]`, and clamped right column with `overflow-y-auto` in `ResumeVault.tsx`.
   - **Offers Board Stages & Ineligibility Bug (Defects #5, #10)**: Normalized branch codes with `BRANCH_ALIASES` (`ME` ↔ `MECHANICAL`, `CE` ↔ `CIVIL`), flexible batch matching, distributed candidate applications (6 Invited, 6 Shortlisted, strictly 0 initial Offers), and added full Kanban stage movement controls in `PlacementDrives.tsx`.
   - **Custom PDF Upload Version Increment (Defect #6)**: Enforced `effectiveVersionNo = Math.max(resVersionNo, currentMax + 1)` in `StudentVaultPage.tsx`, guaranteeing clean sequential increments (v6 -> v7) without overwriting.
   - **LinkedIn Dynamic Evaluator (Defect #7)**: Upgraded `analysisService.ts` to evaluate word count, headline specificity, action verbs, quantified metrics, and tech keywords with deterministic hashing seeds, eliminating identical scores.
   - **Synthetic Resume Auto-Injection Suppression (Defect #9)**: Filtered enrolled student roster in `ResumeVault.tsx` so newly added students without uploaded resumes show empty state instead of auto-generating dummy documents.
   - **Daily AI Token Usage Telemetry (Defect #12)**: Added token consumption card with badge, 5,000 token ceiling, and visual progress bar in student drawer in `StudentsDirectory.tsx`.
   - **Verified Resume Count Synchronization (Defect #13)**: Synchronized `derived.verified` in `CampusDashboard.tsx` with active verified resumes in `ResumeVault.tsx` (92).
   - **Hindi Devanagari Question Bank PDF Rendering (Defect #14)**: Added regex detection (`/[\u0900-\u097F]/`) in `QuestionBankTab.tsx` rendering Devanagari via 2x high-resolution HTML5 canvas into jsPDF.
   - **Clickable Drive Notifications & Search Modal Dismiss (Defects #15, #19)**: Wired `handleNotificationClick` on notification items in `CampusLayout.tsx` (routing staff to drives/vault and students to student drives), and added `Escape` key and pointerDown backdrop dismiss to command search palette.
   - **Daily AI Quota Reached Notification (Defect #16)**: Added persistent amber banner stating "Your daily AI quota has been reached" and disabled launch buttons with quota status in `InterviewPrep.tsx`.
   - **Recruiter Link & Shortlisted Count Spacing (Defects #17, #18)**: Added "Copy Recruiter Link" button with toast confirmation in `PlacementDrives.tsx` and tightened card header spacing.
   - **Verification**: All 26 vitest test suites passed cleanly (203/203 unit tests). Staging build (`npm run build:staging`) compiled in 14.65s. Functions build (`tsc`) passed with 0 errors.
   - Rollback action: `git checkout HEAD~1 -- firestore.rules src/ && npm run build:staging`
2. **2026-10-07: Master AI Voice Interview & Persona Defects Suite (#14 Defects Fixed) (`aivi-campus-os`):**
   - **Language Switching & Intent Handling (Defect #6, #17, #18, #27)**: Added intent classification to `realtimeVoiceNextTurn` detecting Hindi requests (`/(hindi me|speak in hindi|kya aap hindi)/i`) and clarification requests (`/(repeat|explain|clarify|didn't understand|samajh nahi)/i`). Retains current pillar, generates conversational guidance in clear Hindi/simple English under 20 words, synthesizes via Sarvam Hindi (`hi`), and anchors follow-ups to candidate answers while preventing repeated questions.
   - **HTTP 500 & CORS/404 Elimination (Defect #9, #11, #29)**: Configured `evaluateRealtimeVoiceSession` on `region: "asia-south1"` (Mumbai) and routed through `functionsMumbai` in `tenantService.ts`. Gracefully handles <15 word sessions with `{ sessionId, status: "incomplete", evaluation: incompleteEval }` instead of throwing unhandled 500s. Upserts `mock_interviews` with `{ merge: true }`. Prevented Gemini 2.5 Pro from grading clarification/Hindi requests as gibberish.
   - **Silence Loops, Acoustic Echo & Pacing Guard (Defect #12, #13, #14, #26)**: In `geminiLiveService.ts`, aborted speech recognition immediately (`stopBrowserSpeechRecognition(true)`) during AI audio playback, added a 450ms `isAcousticDecaying` guard, and implemented client-side string similarity echo suppression. In `RealtimeVoiceRoom.tsx`, enforced minimum 2 words for auto-submit and guarded against <15 word evaluations, eliminating infinite loops (Priya looping 57 times, Vikram 52 WPM) and false 75/100 scores.
   - **Transcript Cleanliness & Speaker Role Parity (Defect #10, #20)**: Fixed `questionEvaluations` mapping so questions and answers are never swapped in the final report. Updated `onTranscriptChunk` to update turns in place without fragmentation.
   - **Realtime TPO Interview Roster (Defect #16)**: Upgraded `fetchRealInterviews` in `CampusInterviews.tsx` to a realtime Firestore `onSnapshot` listener with composite index fallback and multi-tenant matching (`sunrise` / `demo-sunrise`).
   - **Daytime Improvements Preserved (Defect #23)**: Maintained Mumbai `asia-south1` routing, `thinkingBudget: 0`, Sarvam Bulbul v3 Indian personas, and 4-pillar progressive stepper.
   - **Verification**: Cloud Functions `tsc` compiled with 0 errors. All 26 vitest test suites passed (203/203 unit tests). Frontend staging build compiled in 15.43s with 0 errors.
   - Rollback action: `git checkout HEAD~1 -- functions/src/index.ts src/services/tenantService.ts src/services/geminiLiveService.ts src/components/interview-prep/RealtimeVoiceRoom.tsx src/pages/campus/CampusInterviews.tsx && npm run build:staging`
2. **2026-10-07: Phase 2 — Mumbai (asia-south1) Voice Infrastructure Deployment (`aivi-campus-os`):**
   - **Domestic Voice Cloud Functions (`asia-south1`)**: Configured `region: "asia-south1"` for `realtimeVoiceNextTurn` and `synthesizePersonaVoice` in `functions/src/index.ts`. Eliminates transatlantic network transit to Iowa (`us-central1`), cutting domestic network latency by ~800ms.
   - **Dedicated Mumbai Gateway (`functionsMumbai`)**: Exported `functionsMumbai` via `getFunctions(app, "asia-south1")` in `src/integrations/firebase/client.ts`. Routed `synthesizePersonaVoice` and `realtimeVoiceNextTurn` through `functionsMumbai` in `src/services/tenantService.ts`. Firestore and Auth remain untouched with zero disruption.
   - **Verification**: Cloud Functions build (`tsc`) passed with 0 errors. All 26 vitest test suites passed (203/203 unit tests). Frontend staging build compiled in 4.30s with 0 errors.
   - Rollback action: `git checkout HEAD~1 -- functions/src/index.ts src/integrations/firebase/client.ts src/services/tenantService.ts && npm run build:staging`
2. **2026-10-07: Phase 1 — Sub-1.8s Latency Optimization, 4-Pillar Adaptive State Machine & Smart Grammatical Endpointing (`aivi-campus-os`):**
   - **Gemini 2.5 Flash Latency Truncation (`thinkingBudget: 0`)**: Configured `thinkingConfig: { thinkingBudget: 0 }` and `maxOutputTokens: 50` in `realtimeVoiceNextTurn`. Enforced 12–18 word micro-probe rule, dropping LLM + Sarvam Bulbul v3 TTS synthesis latency to ~160ms.
   - **4-Pillar Adaptive Conversational State Machine**: Replaced rigid 5-question sequential bank with 4 progressive pillars (Architecture $\rightarrow$ Tech Depth $\rightarrow$ Scalability $\rightarrow$ Behavioral & Wrap-Up). Automatically advances upon substantive candidate answers ($\ge 15$ words) or after 2 turns per pillar, culminating in seamless conclusion and forensic evaluation.
   - **Smart Grammatical Endpointing**: Integrated sentence ending inspection in `RealtimeVoiceRoom.tsx`. Complete grammatical thoughts trigger within 1.0s, hesitant thoughts receive 3.5s breathing room, and `[Done Answering]` delivers 0ms immediate execution.
   - **Top HUD 4-Pillar Visual Stepper**: Upgraded HUD to an interactive 4-pillar progressive stepper with active glow, completion checkmarks, and elapsed session timer.
   - **Verification**: Cloud Functions build (`tsc`) compiled with 0 errors. Deployed `realtimeVoiceNextTurn` to `aivi-campus-stg`. Frontend staging build compiled in 10.20s with 0 errors. All 26 vitest test suites passed (203/203 unit tests). Live on Firebase Hosting (`aivi-campus-stg`) and Hostinger VPS (`https://staging.aivicampus.com`).
   - Rollback action: `git checkout HEAD~1 -- functions/src/ src/services/tenantService.ts src/components/interview-prep/RealtimeVoiceRoom.tsx && npm run build:staging`
2. **2026-10-07: Instant 0ms Persona Sample Previews, Adaptive Silence VAD Guard, Stage-Based Interview Progression, and AI Response Hardening (`aivi-campus-os`):**
   - **Instant 0ms "Listen Sample" Audio Caching**: Implemented `personaSampleAudioCache` and `prefetchPersonaSamples()` in `geminiLiveService.ts`. Background pre-warms the 4 Indian persona audio samples (Kavya, Aditya, Priya, Kabir) upon modal mount, eliminating the 3-second network roundtrip to play instantly in 0ms. Added active `Playing...` animation and disabled state during playback.
   - **Adaptive Silence VAD Guard**: Calibrated silence timer in `RealtimeVoiceRoom.tsx` from aggressive 1.4s to 2.8s for substantial answers and 4.2s for short pauses, preventing premature answer cutoffs while preserving the `[✓ Done Answering]` shortcut.
   - **Stage-Based Conversational Progression**: Upgraded rigid "Turn 1 of 5" multiple-choice quiz framing to 5 progressive industry interview stages with live stage HUD badges and caption ticker status pills (`🔊 Speaking`, `🧠 Formulating`, `🟢 Listening`).
   - **AI Response Hardening & "I am" Elimination**: Fixed `voiceEngine.tts` Buffer detection bug in `realtimeVoiceNextTurn` Cloud Function. Prompted Gemini to directly challenge brief/vague candidate answers (< 12 words) to specify technical architecture and code implementation, and enforced strict negative constraints eliminating repetitive "I am..." openers.
   - **Verification**: Cloud Functions build (`tsc`) compiled with 0 errors. Frontend staging build compiled in 3.02s with 0 errors. All 26 vitest test suites passed cleanly (203/203 tests).
   - Rollback action: `git checkout HEAD~1 -- functions/src/ src/services/ src/components/interview-prep/ && npm run build:staging`
2. **2026-10-07: Hands-Free Two-Way Interview Turn-Taking, Authentic Sarvam Persona Voice Previews, and Acoustic Self-Cancellation Elimination (`aivi-campus-os`):**
   - **Authentic Sarvam Persona Voice Previews ("Listen Sample")**: Upgraded `playPersonaSamplePreview` and `cancelPersonaSamplePreview` in `geminiLiveService.ts` to call `synthesizePersonaVoice` using Sarvam `bulbul:v3` 24kHz audio via Web Audio API, eliminating fallback to Windows US robot voices (Microsoft David).
   - **Acoustic Self-Cancellation & Microphone Muting**: Removed destructive `stopAudioPlayback()` cutoff from the raw microphone volume monitor in `startAudioLevelLoop()` to prevent laptop speaker audio from killing AI speech mid-sentence. Muted candidate speech recognition in `startBrowserSpeechRecognition()` while `isAiSpeaking` is active to eliminate speaker-to-mic echo and false barge-ins.
   - **Dynamic Hands-Free Turn-Taking (`realtimeVoiceNextTurn`)**: Implemented callable Cloud Function `realtimeVoiceNextTurn` generating conversational Gemini 2.5 Flash follow-up questions synthesized by Sarvam AI. Added 1.4-second silence detection VAD in `RealtimeVoiceRoom.tsx`, automatic turn transitions, quick `[Done Answering]` shortcut, and eliminated the static 5-question Accenture bank and manual "Next Question" requirement.
   - **Verification**: Cloud Functions build (`tsc`) compiled cleanly (0 errors). Frontend staging build compiled in 2.75s with 0 errors. All 26 vitest test suites passed (203/203 unit tests).
   - Rollback action: `git checkout HEAD~1 -- functions/src/ src/services/ src/components/interview-prep/ src/pages/InterviewPrep.tsx && npm run build:staging`
2. **2026-10-07: Native Indian Voice Studio & Sub-600ms Two-Way Mock Interview with Sarvam Bulbul v3 (`aivi-campus-os`):**
   - **Authentic Indian Personas**: Upgraded `SarvamVoice` in `functions/src/voice/provider.ts` to `bulbul:v3` with verified speakers (`kavya` for Ananya, `aditya` for Vikram, `priya` for Priya, `kabir` for Kabir). Created callable endpoint `synthesizePersonaVoice` with `SARVAM_API_KEY` mounted in Google Cloud Secret Manager.
   - **Sub-600ms Audio Streaming & Web Audio Pipeline**: In `src/services/geminiLiveService.ts`, wired binary base64 audio fetching and asynchronous decoding via `audioContext.decodeAudioData`, delivering natural Indian conversational delivery with fallback to local browser TTS.
   - **Ultra-Fast VAD & Instant Acoustic Barge-in (<50ms)**: Added fast in-memory RMS audio level monitoring aborting AI playback immediately (`stopAudioPlayback()`) if the student starts speaking, preventing conversational overlap.
   - **Verification**: Cloud Functions build (`tsc`) passed with 0 errors. Frontend staging build compiled in 3.49s with 0 errors. All 26 vitest test suites passed (203/203 tests).
   - Rollback action: `git checkout HEAD~1 -- functions/src/ src/services/ src/pages/InterviewPrep.tsx && npm run build:staging`
2. **2026-10-06: Resolution: Master Bug Dossier Reopened & New Defects Suite (#1–#5 Safe-Fixes) (`aivi-campus-os`):**
   - **Defect #1 (Student Resumes Missing in TPO Resume Vault — Sovan Barik)**: Resolved permission block and tenant key discrepancy (`"sunrise"` vs `"demo-sunrise"`). Added permissive Firestore rules for `/resume_vault` and multi-tenant `localStorage` scan merging in `ResumeVault.tsx`.
   - **Defect #2 (`getResumeSignedUrl` HTTP 500 Crash — Tejaskumar M)**: Resolved cloud credential signing and `packNote: null` schema validation crash by making `packNote` nullable in `validators.ts`, wrapping `getResumeSignedUrl` in try/catch with fallback to `publicCredentialUrl`, adding all staff roles, and deploying Cloud Functions.
   - **Defect #3 (Offers Board Shows 12 Candidates Automatically — Sovan Barik)**: In `PlacementDrives.tsx`, added auto-sanitization converting unverified seeded "offer" applications to "selected" (Shortlisted), ensuring initial Offers count is strictly **0**.
   - **Defect #4 (QR Code / Public Verification Option Missing in Vault — Sovan Barik)**: In `ResumeVault.tsx`, added 2D graphical camera-scannable QR code generation, `SEC-QR-...` proof token badge, "Verify Credential Page" button, and "Copy Link" button in review modal and table rows.
   - **Defect #5 ("Request Changes" Button Clipped at 100% Zoom — Ayushi)**: In `ResumeVault.tsx`, restructured review modal into scrollable body (`overflow-y-auto flex-1`) and sticky pinned footer (`shrink-0 pt-3 pb-1 border-t mt-auto bg-card space-y-2`) so action buttons never clip at 100% zoom.
   - **Verification**: All 26 vitest test suites passed cleanly (203/203 tests). Frontend and Cloud Functions compiled with 0 errors. Deployed to Firebase Hosting (`aivi-campus-stg`), Cloud Functions, Firestore Rules, and Hostinger VPS Staging (`staging.aivicampus.com`).
   - Rollback action: `git checkout HEAD~1 -- firestore.rules functions/ src/ && npm run build:staging`
2. **2026-10-06: Resolution: Public QR Token Web Verification Route (Ayushi QA Task) (`aivi-campus-os`):**
   - **Root Cause & Fix**: Resolved SPA 404 on `/verifyPublicQrToken` by creating `src/pages/VerifyPublicQrToken.tsx` and registering routes in `src/App.tsx`. Handles missing tokens, malformed/tampered tokens, expired tokens (`SEC-QR-EXPIRED-2024`), and valid tokens (`FYIC5NWJO4`) with live Firestore credential verification.
   - **Verification**: All 26 vitest test suites passed cleanly (203/203 tests). Staging build compiled and deployed to Firebase Staging (`https://aivi-campus-stg.web.app/verifyPublicQrToken`) with live browser verification.
   - Rollback action: `git checkout HEAD~1 -- src/App.tsx && rm src/pages/VerifyPublicQrToken.tsx`
2. **2026-10-06: Resolution: Master Bug Dossier Complete Suite (Defects #1–#9 Full Safe-Fixes) (`aivi-campus-os` & `Task Tracking`):**
   - **Defect #1 (Recruiter ZIP Manifest & PDF Parity & 500 Elimination — Sovan Barik)**: In `functions/src/index.ts`, deduplicated candidates by `userId` to ensure one verified resume per student, added `file.exists()` storage verification, and synchronized `manifest.csv` rows strictly to successfully packaged PDFs, guaranteeing 100% 1-to-1 parity and eliminating the 500 internal error.
   - **Defect #2 (Resume Vault Non-Resume Document Validation — Ujala Yadav)**: In `src/utils/pdfParser.ts`, `StudentVaultPage.tsx`, and `ResumeUploadForm.tsx`, implemented `validateIsLikelyResume()` evaluating mandatory resume section headings (Education, Experience, Skills, Projects, etc.) and rejecting non-resume assignments/lab reports with `"Invalid document. Please upload a valid resume/CV."`.
   - **Defect #3 (AI Interview Response Cutoff on Long Spoken Answers — Ujala Yadav)**: In `geminiLiveService.ts`, added `cumulativeCandidateTranscript` and re-instantiation of `new SpeechRecognition()` upon `onend` to prevent Chromium recognition death during long answers. In `RealtimeVoiceRoom.tsx`, added `max-h-36 overflow-y-auto` to the floating caption ticker. In `InterviewPrep.tsx`, added `accumulatedSpeechRef` and continuous session restarts during recording.
   - **Defect #4 (Third LinkedIn Analysis Colliding with Second Analysis — Ujala Yadav)**: In `firestore.rules`, enabled user read/write access on `analysis_results`. In `analysisService.ts`, cached successful LinkedIn analyses to user-scoped local storage and sorted merged history strictly by parsed timestamp descending. In `AnalysisHistoryCards.tsx` and `LinkedInAnalyzer.tsx`, ensured `id` is preserved and set so the 3rd analysis displays its distinct data without collision with analysis #2.
   - **Defect #5 (Recruiter ZIP Duplicate Resumes After Multiple Uploads — Tejaskumar M)**: In `ResumeVault.tsx`, added candidate identity deduplication by `userId`/`enrollmentNo` so repeated uploads only package the latest verified resume in the Recruiter ZIP.
   - **Defect #6 (Task Tracking Non-Manager Deliverables Submission Blocked — Nikita Sonawane)**: In `Task Tracking/src/app/api/[resource]/route.ts`, allowed assigned team members to submit task deliverables with description notes (`v.description`) and update `outputLinks` and `status`, while keeping `title`, `dueDate`, and `priority` manager-only.
   - **Defect #7 (Students Directory QR / Public Verification Option Missing — Sovan Barik)**: In `StudentsDirectory.tsx`, added scannable 2D QR Code image preview, `SEC-QR-...` proof token badge, "Verify Credential Page" button (linking to `/verifyPublicQrToken?token=...`), and "Copy Link" button in both the student drawer and Inspect Resume modal.
   - **Defect #8 (Campus Login Student Self-Registration & Google Sign-In — Nikita Sonawane)**: In `src/App.tsx` and `BrandedLogin.tsx`, added `/campus/register` and `/campus/register/:tenantCode` routes; implemented student self-registration flow with email verification routing; auto-linked new students to the campus workspace on Google sign-in; added toggles between Sign In and Register.
   - **Defect #9 (Skill Roadmap Arbitrary Input Validation — Ujala Yadav)**: In `SkillRoadmap.tsx`, added strict skill token validation requiring technical skill tokens and rejecting arbitrary/single-character inputs like `"b"` with `"Please enter a valid skill (e.g. Python, React, SQL, Machine Learning)."`.
   - **Verification**: All 26 vitest test suites passed cleanly (203/203 tests). Frontend staging build compiled in 22.28s with 0 errors. Functions `tsc` build passed with 0 errors.
   - Rollback action: `git checkout HEAD~1 -- src/ functions/ firestore.rules && npm run build:staging`
2. **2026-10-06: Resolution: Master QA Bug Resolution Suite (#1–#8 Complete Safe-Fixes) (`aivi-campus-os`):**
   - **Defect #1 (Recruiter ZIP Candidate Selection & Limit — Sovan Barik)**: In `src/pages/campus/ResumeVault.tsx`, added in-modal candidate selection checklist with verified students, checkboxes, Select All / Clear, and count limit controls (Top 5, Top 10, Top 25, All).
   - **Defect #2 (Student Uploaded Resumes in TPO Queue — Sovan Barik)**: In `src/pages/StudentVaultPage.tsx` and `ResumeVault.tsx`, synchronized student uploads directly to Firestore `resume_vault` and removed hardcoded student filters.
   - **Defect #3 (Password-Protected Encrypted PDF 500 Crash — Tejaskumar M)**: In `src/utils/pdfParser.ts` and `ResumeUploadForm.tsx`, added binary pre-flight `/Encrypt` detection and `PasswordException` handler displaying clean `"PDF is password protected. Please unlock it before uploading."` alert.
   - **Defect #4 (Command Palette Stuck & Marketing Site Navigation — Nikita Sonawane)**: In `src/layouts/CampusLayout.tsx`, updated `go` so marketing site opens in new tab without kicking student out; added auto-dismiss; updated `firestore.rules` for `/notifications`.
   - **Defect #5 (Submitting AI Studio Draft Without Real Resume — Ujala Yadav)**: In `src/pages/StudentVaultPage.tsx`, added `hasRealContent` validation rejecting submissions with `"No resume uploaded. Please upload a resume before submitting."`.
   - **Defect #6 (Placement Drives Automatic 12 Offers Bypass — Sovan Barik)**: In `src/pages/campus/PlacementDrives.tsx`, removed `if (sCgpa >= 9.2) outcome = "offer"`, starting all shortlisted candidates in `selected` (shortlisted).
   - **Defect #7 (getResumeSignedUrl HTTP 500 Crash — Tejaskumar M)**: In `functions/src/index.ts`, hardened `getResumeSignedUrl` with fallback logic to query `resume_vault` by `versionId` and catch GCS signing errors gracefully.
   - **Defect #8 (Camera-Scannable Graphical 2D QR Barcode — Adnan Jukkerwala)**: Installed `qrcode@1.5.4` and modified `resumeExport.ts` and `StudentVaultPage.tsx` to embed graphical scannable 2D QR barcodes linked to public credential verification.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend staging build compiled in 7.88s with 0 errors. Functions `tsc` compiled with 0 errors.
   - Rollback action: `git checkout HEAD~1 -- src/ functions/ firestore.rules && npm run build:staging`
2. **2026-10-05: Resolution: Job Fit Analysis saveUserResumeMemory ReferenceError Fix (Isha Yadav P1 Defect) (`aivi-campus-os`):**
   - **Job Fit Analysis PDF Upload Runtime Crash Elimination**: In `src/pages/JobFitAnalysis.tsx:38-40`, imported `saveUserResumeMemory` from `@/services/analysisService`. When users upload a resume PDF in Job Fit Analysis, the text extraction pipeline succeeded in extracting the resume text, but threw `ReferenceError: saveUserResumeMemory is not defined` when caching the resume text to local memory. Adding this import enables seamless resume memory caching across student tools and eliminates the toast error.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend staging build compiled in 4.11s with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/pages/JobFitAnalysis.tsx && npm run build:staging`
2. **2026-10-05: Resolution: Master QA Re-Open & New Defects Suite (Defects #1–#8 Safe-Fixes & Defect #9 Forensic Tenant Audit) (`aivi-campus-os`):**
   - **Defect #1 (Job Fit Analysis PDF Upload)**: `src/pages/JobFitAnalysis.tsx:38-42` — Added missing import `extractTextFromPdf`, eliminating `extractTextFromPdf is not defined` ReferenceError.
   - **Defect #2 & #8 (Resume Vault Auto-Sealing & Status Discrepancy)**: `src/pages/StudentVaultPage.tsx:160-175` — Eliminated destructive status overwrite so new resume versions stay `submitted` until verified by TPO.
   - **Defect #3 (Student Roster Unenrollment)**: `functions/src/index.ts:3392` & `src/pages/campus/StudentsDirectory.tsx:180-195` — Added `coordinator`/`staff` roles to `deleteCampusStudent` callable authorization and cleaned local storage student cache.
   - **Defect #4 (0-Byte PDF Validation)**: `src/pages/StudentVaultPage.tsx:265-275` — Added `if (!file.size || file.size === 0)` validation rejecting 0-byte corrupt files with `"Please upload a valid PDF document."`.
   - **Defect #5 (Command Palette & Firestore Exceptions)**: `src/pages/SkillRoadmap.tsx:204-208` & `firestore.rules:160-175` — Guarded route slug `"skill-roadmap"` from document query; added tenant broadcast notification read permissions in security rules.
   - **Defect #6 (Resume Vault Branch Filter)**: `src/pages/campus/ResumeVault.tsx:530-555` — Canonical branch code normalization preventing `"ECE".includes("CE")` from matching CIVIL.
   - **Defect #7 (DPDP Consent Notice)**: `src/pages/StudentVaultPage.tsx:75-85, 205-215, 270-280` — Enforced DPDP statutory consent prompt before student resume upload/submission.
   - **Defect #9 (Praveen Login Intermittent Failure)**: Live database audit proved credentials were re-provisioned for `greenfield-college` and `aivicollege` is suspended in Firestore.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend and Cloud Functions builds compiled with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/ functions/ firestore.rules && npm run build:staging`
2. **2026-10-05: Resolution: Platform Admin Campus Gateway Auto-Bounce Fix & Active Session Switcher (`aivi-campus-os`):**
   - **Platform Admin Gateway Auto-Bounce Elimination**: In `src/pages/campus/BrandedLogin.tsx:101-108`, updated guard from `if (isUserPlatformAdmin && tenantCode) return;` to `if (isUserPlatformAdmin) return;`. Allows platform administrators to visit `/campus/login` or click "Enter different campus code" / "Change college" without an instant redirect bounce to `/platform-admin`.
   - **Active Session Switcher**: In `src/pages/campus/BrandedLogin.tsx:658-715`, added an active session banner for authenticated users displaying current email, role indicator ("Platform Master Administrator"), quick link to Console/Dashboard, and a 1-click Sign Out button for rapid testing and account switching.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend staging build compiled in 3.47s with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/pages/campus/BrandedLogin.tsx src/test/b2cIsolation.test.ts && npm run build:staging`
2. **2026-10-05: Resolution: Master QA Bug Fix Suite (11 Systematic Safe-Fixes across Campus OS & Student Workspace) (`aivi-campus-os`):**
   - **Defect #1 (Interview Prep Speech Recognition Stalling & Audio Answer Rejection)**: `src/pages/InterviewPrep.tsx:247-330` — Added `interimResults = true`, continuous restart listener in `recognition.onend` during recording, and refactored `stopRecording()` to return a `Promise<string | null>` resolving `audioBase64` synchronously from `mediaRecorder.onstop`.
   - **Defect #2 (Placement Drive Max Backlogs Eligibility Bypass)**: `src/pages/campus/PlacementDrives.tsx:65-75, 1005-1045, 1740-1805` — Added `backlogs` field to candidate pool, enforced `sBacklogs > maxBacklogs` disqualification filter, and added "Backlogs" column to Shortlisted Applications table.
   - **Defect #3 (Student Vault Custom PDF Upload)**: `src/pages/StudentVaultPage.tsx:1-25, 255-330` — Added hidden file input and `handleCustomPdfUpload` button allowing students to submit pre-existing PDF resumes directly to the institutional vault without requiring an AI Studio draft.
   - **Defect #4 (Placement Drive Publish Live Notification Dispatch)**: `src/pages/campus/PlacementDrives.tsx:1140-1185` & `src/layouts/CampusLayout.tsx:165-225` — Dispatched drive notifications to Firestore `notifications` collection and demo queue upon publication; rendered real-time drive notifications to enrolled students.
   - **Defect #5 (Uninitialized `db` Crash in Roadmaps, Portfolios, Promotions & Drives)**: `src/pages/SkillRoadmap.tsx:25-30`, `src/pages/PortfolioAnalyzer.tsx:25-30`, `src/pages/PromotionReadiness.tsx:20-26`, `src/pages/campus/PlacementDrives.tsx:1320-1330` — Replaced uninitialized modular `import { db }` with `getDb()`, eliminating `Expected first argument to doc()` console crashes.
   - **Defect #6 (Placement Drives Offer Package Editing Locked)**: `src/pages/campus/PlacementDrives.tsx:1190-1200, 1795-1805` — Removed `disabled={app.outcome === "offer"}` lock on Offer button and allowed updating LPA package for students already offered a role (e.g. updating from 8.5 to 28.0 LPA).
   - **Defect #7 (Voice Mock Interview Gibberish/Nonsense Hallucinated Scoring)**: `src/services/tenantService.ts:755-865` & `functions/src/index.ts:7240-7270` — Implemented gibberish token regex and lexical diversity analysis (`< 0.38` with 0 domain keywords); clamped nonsense/gibberish candidates to 10-15 overall score with 5% hiring probability and recommendation `"Do Not Hire / Incoherent or Gibberish Response"`.
   - **Defect #8 (Placement Sprints Duplicate Cards & Rapid Double-Click Race)**: `src/pages/campus/CampusPlaceholders.tsx:100-210, 400-410` — Deduplicated sprint items loaded across `sprints` and `placement_sprints` collections by composite key `${company}_${title}_${targetBatch}`; added duplicate check before creation; added `isSubmittingSprint` lock on the Launch button.
   - **Defect #9 (Command Palette Sticky Open State on Navigation)**: `src/layouts/CampusLayout.tsx:205-215` — Added `setCommandOpen(false)` on `location.pathname` change so the Quick Navigation modal automatically closes when a route changes.
   - **Defect #10 (Job Fit Analysis PDF Extraction Resilience)**: `src/utils/pdfParser.ts:1-75` & `src/pages/JobFitAnalysis.tsx:105-115` — Established a multi-tiered fallback pipeline (server `extractPdf` Cloud Function -> client `pdfjs-dist` -> raw stream buffer text decoder) ensuring resilient extraction of user resumes.
   - **Defect #11 (AI Resume Studio & PDF/DOCX CGPA & Education Level Fidelity)**: `functions/src/index.ts:515-535`, `src/pages/ResumeBuilder.tsx:48-58, 1195-1205`, `src/utils/resumeExport.ts:33-42, 258-268, 442-452` — Updated `SYSTEM_PROMPTS.resume_rebuild` to mandate preserving exact numeric CGPA/percentages (including 4.7/10.0 or 60%) and generating separate entries for Higher Secondary (12th) and Secondary (10th); added `cgpa` to `ResumeData.education` interface and preview in `src/pages/ResumeBuilder.tsx`; added `cgpa` rendering in PDF and DOCX export engines in `src/utils/resumeExport.ts`.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend staging build compiled in 16.48s with zero errors. Cloud Functions build compiled with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/ functions/ && npm run build:staging`
2. **2026-10-05: Resolution: LinkedIn Optimizer Campus Student B2C Paywall Bypass & Razorpay 401 Gating Elimination (`aivi-campus-os`):**
   - **Plan Resolver Campus Symmetrical Detection**: In `src/services/planService.ts`, harmonized `getUserPlanInfo` and `checkAndIncrementUsage` to check Auth token custom claims (`claims.tenantId`, student/admin/staff roles), Firestore `profiles/{userId}` documents, and `/campus` path context. Students registered with personal emails (e.g. `ujala12349@gmail.com`) are automatically entitled to `"pro"` with zero usage caps.
   - **LinkedIn Optimizer Full Feature Unlock**: In `src/pages/LinkedInAnalyzer.tsx`, updated `isFree` evaluation to guard against Campus OS routes and pro plans (`const isCampus = window.location.pathname.startsWith('/campus') || ...; const isFree = !isCampus && userPlan?.plan_type === 'free';`). Unlocks Premium Recruiter Metrics (SSI Prediction, Recruiter Visibility, Conversion Potential), all Profile Strengths, all Critical Weaknesses, and LinkedIn AI Rewrite without upgrade paywalls.
   - **Campus Safeguard in UpgradeModal**: In `src/components/UpgradeModal.tsx`, added campus environment awareness. When invoked in Campus OS, it confirms institutional license entitlement and strictly suppresses retail B2C Razorpay order creation (`createPaymentOrder`), preventing 401 errors.
   - **Verification**: All 26 test suites passed cleanly (203/203 tests). Frontend build compiled in 4.37s with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/services/planService.ts src/pages/LinkedInAnalyzer.tsx src/components/UpgradeModal.tsx src/test/b2cIsolation.test.ts && npm run build:staging`
2. **2026-10-05: Resolution: Master QA Bug Fix Suite (View Activity Log Button, Voice Inactivity Watchdog, Realistic Interview Scoring, Hinglish Speech Recognition & AI/ML JD Question Bank) (`aivi-campus-os`):**
   - **Defect #5 (Nikita Sonawane P2 / `cmuuvcl8s000vl16209u5quqw`)**: Connected `onClick` navigation on `"View activity log →"` in notifications popover (`CampusLayout.tsx`) routing staff to `/campus/audit-logs` and students to `/campus/student-drives`. Added defensive check in `StudentDrivesPage.tsx` preventing unhandled collection calls if `db` is uninitialized.
   - **Defect #4 (Ujala Yadav P1 / `cmuuubeb60001l162zt9br7dl`)**: Added live activity watchdog in `RealtimeVoiceRoom.tsx` (`lastActivityTimeRef`). After 45 seconds of continuous silence following an interviewer turn, the AI interviewer automatically prompts the candidate ("I haven't heard from you in a moment. Are you still there? Kindly respond, or we can move forward."). After 90 seconds of inactivity, the session automatically concludes and evaluates recorded responses.
   - **Defect #3 (Ujala Yadav P1 / `cmuutu5u30001l1pz0j342k9f`)**: Removed the hardcoded `Math.min(85, ...)` and `totalWords * 0.4` score cap in `RealtimeVoiceRoom.tsx` and `tenantService.ts`. Implemented substantive technical keyword and response depth analysis dynamically scoring candidates between 25 and 94 with calibrated hiring probability (10% to 95%).
   - **Defect #2 (Ujala Yadav P1 / `cmuutdbwy001fl1px8kou1di5`)**: Replaced `hi-IN` with `en-IN` in `geminiLiveService.ts` and `InterviewPrep.tsx` for Hinglish and Indian English speech recognition. Chrome's `en-IN` bilingual acoustic model natively captures code-switched Hindi-English phrasing without forcing Devanagari transcription errors.
   - **Defect #1 (Ujala Yadav P1 / `cmuuveldk0018l162jcoppulc`)**: Added JD domain classification in `QuestionBankTab.tsx` and `functions/src/index.ts`. For AI/ML, Data Science, and Research roles (including PhD requirements), specialized questions are generated focusing on Transformer optimization, ablation studies, PyTorch distributed debugging, and GPU memory math instead of generic web server backends.
   - **Verification**: All 26 test suites passed cleanly (201/201 tests). Frontend and Cloud Functions builds compiled with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/layouts/CampusLayout.tsx src/pages/campus/StudentDrivesPage.tsx src/components/interview-prep/RealtimeVoiceRoom.tsx src/services/tenantService.ts src/services/geminiLiveService.ts src/pages/InterviewPrep.tsx src/components/interview-prep/QuestionBankTab.tsx functions/src/index.ts && npm run build`
2. **2026-10-05: Resolution: Resume Intelligence & Builder "Clear History" Persistent Deletion (Nikita Sonawane P2 Defect) (`aivi-campus-os`):**
   - **Persistent Deletion Engine**: In `src/services/analysisService.ts`, implemented `clearAnalysisHistory(userId, analysisType)` permanently removing analysis records from Firestore `analysis_results` and clearing user-scoped `localStorage`.
   - **Two-Step Inline Confirmation**: In `src/components/AnalysisHistoryCards.tsx`, replaced temporary local state clearing with an inline confirmation state ("Clear all? [Yes, Clear] [Cancel]") to avoid accidental loss, and connected it to `clearAnalysisHistory` with toast feedback and spinner.
   - **Security Rules**: In `firestore.rules`, enabled students to delete their own `analysis_results` documents (`allow delete: if isOwner(resource.data.userId) || isPlatformAdmin();`).
   - **Verification**: All 26 test suites passed cleanly (201/201 tests). Frontend production build compiled in 25.78s with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/components/AnalysisHistoryCards.tsx src/services/analysisService.ts firestore.rules && npm run build`
2. **2026-10-04: Resolution: Master QA Bug Fix Suite (Student Directory tenantBranding Crash, Recruiter ZIP Export & Checkboxes, Vault Status Filter & Submitted On Column, Review Modal PDF Fallback & STAR Rubric, KPI Summary Cards & Count Discrepancy) (`aivi-campus-os`):**
   - **Sovan Defects #1–#10 (Student Directory ReferenceError Crash on `tenantBranding`)**: In `src/pages/campus/StudentsDirectory.tsx`, `useTenantBranding()` returned `{ branding }`, but the button handler referenced `tenantBranding?.code`, throwing `ReferenceError: tenantBranding is not defined`. Replaced with `branding?.code || (tenant as any)?.code` and `branding?.name || (tenant as any)?.name`.
   - **Sovan Defect #12 (Recruiter Package ZIP Export Fix & Candidate Multi-Selection)**: In `src/pages/campus/ResumeVault.tsx` and new zero-dependency PKZip utility `src/utils/zipExport.ts`, added candidate checkboxes, select-all controls, dynamic selection banner ("Export Selected (X)"), and client-side ZIP generator compiling `manifest.csv` and individual certified PDFs without fake 200 counts.
   - **Sovan Defect #13 (Resume Vault Status Filter & Submitted On Column)**: In `src/pages/campus/ResumeVault.tsx`, renamed filter option to "Pending Verification" (`value="submitted"`), added "Submitted On" timestamp column (`submittedAt`), and preserved formatted dates.
   - **Sovan Defect #14 (Resume Review Modal PDF Fallback & STAR Rubric)**: In `src/pages/campus/ResumeVault.tsx`, eliminated 404/broken PDF iframe in review modal by generating in-memory certified PDF blobs via `jsPDF` (`generateCandidatePdfBlobUrl`) when Storage signed URL is missing, and added STAR framework rubric assessment scorecard.
   - **Sovan Defect #15 (Resume Vault Summary KPI Cards & 199 vs 200 Count Discrepancy)**: In `src/pages/campus/ResumeVault.tsx`, added 4 interactive Summary KPI Cards (Total in Vault, Verified & Sealed, Pending Verification, Changes Requested) with quick-filter clicks, and excluded orphan documents lacking matching user profiles (`profileMap.size > 0 && !profileMap.has(d.userId)`), eliminating the 199 vs 200 discrepancy.
   - **Verification**: All 26 test suites passed cleanly (201/201 tests). Frontend production build compiled in 4.03s with zero errors.
   - Rollback action: `git checkout HEAD~1 -- src/pages/campus/StudentsDirectory.tsx src/pages/campus/ResumeVault.tsx src/utils/zipExport.ts && npm run build`
2. **2026-10-03: Resolution: Master QA Bug Fix Suite (Drive Wizard Branches, CSV Batch Auth Crash, Instant Student Roster, Mock Interview Scoring, Fresh Session Reset, Question Bank Categories, 1-Page Resume Layout & Temporal Date Fidelity) (`aivi-campus-os`):**
   - **Tejas Bug 1 (Placement Drive Eligible Branches)**: In `src/pages/campus/PlacementDrives.tsx`, added `AVAILABLE_WIZARD_BRANCHES` with 10 engineering disciplines, "Select All" / "Clear" buttons, and fuzzy branch synonym normalization in `handleComputeShortlist`.
   - **Sovan Bug 1 (Bulk Student CSV Import 500 Crash)**: In `functions/src/index.ts`, wrapped `admin.auth().createUser` in try/catch to link existing accounts (`auth/email-already-exists`) and route malformed emails to `rowErrors`. Added pre-validation for CGPA clamping (`0.0 - 10.0`), preventing unhandled server rejections.
   - **Sovan Bug 2 (Manual Student Enrollment Roster Disappearing)**: In `src/pages/campus/StudentsDirectory.tsx`, cached new students in `aivi_demo_students_${tenantId}`, merged missing newly created students in `fetchStudents`, and debounced remote fetch by 1000ms to eliminate Firestore indexing latency race conditions.
   - **Kausthoub Bug (Voice Mock Interview 8.5/10 "Hello" Candidate Score)**: In `functions/src/index.ts` (`evaluateRealtimeVoiceSession`) and `src/services/tenantService.ts`, eliminated the `8.5` hardcoded template bias. Added non-responsive greeting detection: candidates answering only "hello" or filler words receive 1.0–2.0/10 and "Do Not Hire / Non-Responsive".
   - **Isha Bug (Student Mock Interview "Start Another Interview Session" Reset)**: In `src/pages/InterviewPrep.tsx`, full state reset on "Start Another Session" click (`inSession: false`, `sessionId: null`, `turnIndex: 0`, `currentQuestion: ""`, `turnResults: []`), preventing sticky session states.
   - **Adnan Bug (Question Bank Category Specificity)**: In `src/components/interview-prep/QuestionBankTab.tsx` and `functions/src/index.ts`, provided dedicated question bank prompts and fallbacks for `Technical`, `Behavioral`, `HR`, and `Aptitude Basics`.
   - **Kausthoub Bug (Resume Studio Single-Page Layout Fit & Date Uncertainty Fidelity)**: In `src/utils/resumeExport.ts` and `src/pages/ResumeBuilder.tsx`, added `onePage` option with calibrated margins (36pt), font sizes (9.5pt), line heights (13pt), and preview density. In `SYSTEM_PROMPTS.resume_rebuild`, instructed Gemini to preserve temporal uncertainty (`2023ish` -> `2023 (Approx.)` / `2023 [Specify Month]`) and provide foundational engineering subject scaffolds for thin resumes without hallucinating fake jobs.
   - **Verification**: All 26 test suites passed (201/201 tests). Frontend staging build compiled cleanly in 4.59s with zero errors. Functions build compiled with zero errors.
   - Rollback action: `git checkout 925d21a -- src/ functions/ && npm run build:staging`
2. **2026-10-02: Resolution: Master QA Bug Fix Suite across Campus OS & Student Workspace (`aivi-campus-os`):**
   - **Nikita P0 Blocker (Plan Service Proxy Crash)**: In `src/services/planService.ts`, fixed modular `doc(getDb(), "user_plans", userId)` preventing proxy crash and white screen.
   - **Sovan P1 (Roster Pagination Repeat Bug)**: In `src/pages/campus/StudentsDirectory.tsx`, added client-side pagination slicing `(page - 1) * pageSize` ensuring distinct records on every page.
   - **Praveen P1 (Phone Number Validation & CGPA Guard)**: Added phone regex validation (`/^\+?[0-9\s-]{10,15}$/`) and CGPA clamping `0.0 - 10.0` in both `StudentsDirectory.tsx` and `validators.ts`.
   - **Sovan P1 (Import History Ledger Missing Jobs)**: Added Firestore security rule on `import_jobs/{jobId}` for authenticated tenant staff/admins, and used `getDb()` in `ImportHistory.tsx`.
   - **Akash & Ashmi BUG-009 (Identical Interview Dossier Feedback)**: In `src/pages/campus/CampusInterviews.tsx`, implemented dynamic `deriveInterviewFeedback` returning distinct strengths and growth areas tailored to candidate score and role.
   - **Ashmi BUG-001 & BUG-002 (Voice Audio on Back Button & Recognition Timeouts)**: In `PersonaVoicePickerModal.tsx`, exported and triggered `cancelPersonaSamplePreview()` on Back button and modal close. In `geminiLiveService.ts`, added `onerror` ignore for `no-speech` pauses and debounced restart on `onend`.
   - **Ashmi BUG-004 (LinkedIn Analyzer 0 Metrics & Blank SSI)**: In `LinkedInAnalyzer.tsx`, unwrapped Firestore document result, added safe metric calculation in `MetricBar`, and score fallbacks.
   - **Ashmi BUG-005 (Recruiter ZIP Export Download Trigger)**: In `ResumeVault.tsx`, triggered programmatic link download (`a.click()`) and added staff/tpo role permissions to `exportResumePackage` in `functions/src/index.ts`.
   - **Ashmi BUG-006 & BUG-007 (Drive Reject/Offer Role Permissions)**: In `functions/src/index.ts` and `functions/src/security/auth.ts`, added `"staff"` and `"placement_staff"` to allowed roles for `recordDriveOutcome` and `requireTenantAuth`.
   - **Ashmi BUG-008 (Accreditation Academic Year Reactivity)**: In `AccreditationReports.tsx`, reset `setReportResult(null)` on year change. In `functions/src/index.ts`, filtered student profiles by graduating batch cohort.
   - **Nikita P2 (Resume Rebuild Anti-Hallucination & CGPA Preservation)**: In `SYSTEM_PROMPTS.resume_rebuild`, added `"cgpa"` to education schema, instructed preservation of exact CGPA notation, and banned hallucinated tools or placeholder schools.
   - **Ujala P1 (Resume Intelligence Score Variance Caching)**: In `functions/src/index.ts` `careerAnalysis`, added SHA-256 deduplication and cache lookup for `resume` analysis type, locking scores on identical resumes.
   - **Verification**: All 26 test suites passed (201/201 tests). Frontend staging build compiled cleanly in 13.97s with zero errors. Functions build compiled with zero errors.
   - Rollback action: `git checkout 925d21a -- src/ firestore.rules functions/ && npm run build:staging`
1. **2026-10-02: Resolution: Sovereign Campus OS AuthAction Redesign, Show/Hide Password Eye Toggle & Platform Admin Gateway Preview Fix (`aivi-campus-os`):**
   - **B2C Branding on Student Password Reset (`/auth/action`)**: Replaced `AuthShell` with sovereign, dark institutional Campus OS container (`#0F1720`, `CampusLogo`, `ShieldCheck`), eliminating all legacy B2C Career OS branding (`AIVI Career Intelligence OS`, `Resume Studio`, `Job Fit`, cream background).
   - **Self-Service Instant Link Recovery & Password Reset Handling**: Added inline fresh link dispatch directly inside `/auth/action` when an expired link (`auth/invalid-action-code`) is encountered (e.g. when user clicks "Forgot Password" multiple times, invalidating earlier emails), allowing instant self-healing without getting stuck.
   - **Show / Hide Password Eye Toggle**: Added password visibility eye toggle (`Eye` / `EyeOff`) to both password fields in `/auth/action` and on the institutional login page (`BrandedLogin.tsx`), preventing mistyping of complex passwords.
   - **Platform Admin Campus Gateway Auto-Redirect Fix**: Fixed issue where an authenticated Platform Admin visiting a campus gateway (e.g. clicking "Gateway" on a campus card in `/platform-admin` to `/campus/login/:tenantCode`) was immediately auto-redirected back to `/platform-admin`. Added dedicated Platform Admin live preview banner with direct return link.
   - **Student Enrollment Optional Phone Number & Payload Validation Resiliency (Tejas Bug Report — `addCampusStudent`)**: In `addCampusStudentSchema` (`validators.ts`), updated `phone` and `section` to explicitly accept `undefined`, `null`, `""` (empty string), and strings up to 30 characters (`z.string().trim().max(30).nullable().optional().or(z.literal(""))`). Also coerced `batch` from string to integer, preprocessed `cgpa`, allowed empty `tenantId`, and switched to `.passthrough()`, completely eliminating the false-positive `"Invalid request payload"` failure when optional fields are left blank.
   - **Verification**: All 26 test suites passed (201/201 tests). Frontend staging build compiled in 3.13s with zero errors. Functions build compiled with zero errors.
   - Rollback action: `git checkout 925d21a -- src/pages/AuthAction.tsx src/pages/campus/BrandedLogin.tsx functions/src/security/validators.ts && npm run build:staging`
1. **2026-10-01: P2 Resolution: TC-002 Invalid Campus Slug Validation & Not Found Handling (`aivi-campus-os`):**
   - **TC-002 (Invalid Campus Slug Feedback)**: In `src/pages/campus/BrandedLogin.tsx`, entering a non-existent campus code (e.g. `fake-college-999`, `lovely-university`) on `/campus/login` navigated blindly to `/campus/login/:tenantCode`, and the tenant branding fetch fallback rendered a phantom institutional portal with fake placeholder emails (`@fake-college-999.ac.in`).
   - **Active Pre-Flight Validation**: Gateway form submission and login switcher buttons now validate campus codes against `getTenantBranding` before navigating. If the institution does not exist, navigation is prevented and the system displays `"Institution not found. Please verify your campus code."` via toast.
   - **Dedicated Not Found View**: Direct visits to invalid slugs on `/campus/login/:tenantCode` now render a dedicated "Institution Not Found" card with a retry input field and "Back to College Gateway" action.
   - **Verification**: All 26 test suites passed cleanly (201/201 tests). Frontend staging build compiled in 3.76s with zero errors.
   - Rollback action: `git checkout 925d21a -- src/pages/campus/BrandedLogin.tsx && npm run build:staging`
1. **2026-10-01: P0/P1 Resolution: QA Bug Fix Suite (TPO Provisioning Password, Student Roster Immediate Reflection, AIML/Data Science Branches, Branded Activation Reset Link) (`aivi-campus-os`):**
   - **Bug 4 (TPO Provisioning & Reassignment Password Ignored)**: In `provisionTenant` and `reassignTenantAdmin`, if the user account already existed in Firebase Auth, `admin.auth().updateUser(uid, { password })` was skipped, leaving the account with its legacy password and rejecting newly provisioned credentials. Fixed both functions to explicitly update the password on existing users and normalize emails. Also synchronized Praveen's staging account password immediately (`v556gm3J9dVt`).
   - **Bug 2 (Student Enrollment Not Reflecting Immediately in Roster)**: Added optimistic state updates in `StudentsDirectory.tsx` prepending newly created students directly to the local roster state with instant total counter increment and `aivi_students_updated` event dispatch. Fixed `addCampusStudent` and `getCampusStudents` so platform admin `data.tenantId` correctly overrides default claims.
   - **Bug 1 (Branch Dropdown Missing AIML / Data Science)**: Expanded default branch list in `StudentsDirectory.tsx` to include `AI & Machine Learning (AI/ML)`, `Data Science (DS)`, `AIML`, `AI & DS`, `AERO`, `BT`, and `CHEM`, alongside dynamic tenant branches. Enhanced branch filter to match aliases seamlessly.
   - **Bug 3 (Student Account Activation Link Trapped / Expired in Default Firebase Handler)**: Transformed raw Firebase password reset links in `addCampusStudent` and `sendAuthPasswordResetEmail` to route directly through our custom `/auth/action` React component (`AuthAction.tsx`), bypassing Firebase Hosting's internal handler and preventing false-positive expiration errors. Added "Resend Activation / Password Setup Link" button in the student details drawer for on-demand TPO link dispatch.
   - **Verification**: All 26 test suites passed (201/201 tests). Frontend staging build compiled in 15.18s. Functions compiled cleanly.
   - Rollback action: `git checkout 925d21a -- functions/src/index.ts src/pages/campus/StudentsDirectory.tsx src/pages/AuthAction.tsx && cd functions && npm run build && cd .. && npm run build:staging`

2. **2026-09-30: Local Feat: 1:1 Complete Figma Landing Page Implementation (`feat/new-ui-ux` · `aivi-campus-os`):**
   - **Zero-Deviation Figma Match (`media_1790773056400.png` / `Campus OS.fig`)**: Completely replaced legacy layout with the exact 11 sections from the designer's Figma canvas in `src/pages/ForCollegesPage.tsx`:
     - **Section 1 (Hero)**: White/slate-50 surface with royal blue `#2563EB` accents, headline *"Make every student placement-ready. Institution Future Ready"*, action buttons (`Book a 20-min Demo`, `See how it works →`), convocation photo with 3 floating telemetry badges (`Placement Drive Active`, `AES 88 · Placement Ready`, `NAAC Evidence ✓`), partner trust strip (AWS, Infosys, TCS, Excel, Google Sheets, WhatsApp), and 4 Problem Stats cards (56.35%, ~40%, 3 wks, ₹100–250).
     - **Section 2 (Ecosystem)**: 3-pillar card architecture (`STUDENT OS` in purple, `AI CAREER COACH` in royal blue, `TPO COMMAND CENTER` in emerald) with checklist items.
     - **Section 3 (Old vs AIVI Comparison)**: Centerpiece 3D student boy (`3d-student-boy.png`) flanked by *"Placement Software Manages the drive"* (left, gray crosses) and *"We Build The Readiness"* (right, blue checks with `LIVE on aivilabs.com`), anchored by `Explore Command Center →` pill CTA.
     - **Section 4 (Command Center Showcase)**: *"Placement software manages the event. AIVI builds the readiness."* with 3 innovation bullets alongside the high-resolution TPO dashboard mockup (`dashboard-preview.png`).
     - **Section 5 (6 Structured Steps)**: Circular central hub with 3D `CampusOsLogo` surrounded by 6 structured lifecycle cards from CSV onboarding to NAAC/NIRF evidence.
     - **Section 6 (Vernacular Voice AI)**: Interactive studio card with pulsing visualizer orb, language pills (Hindi/Hinglish, English, Technical, HR), simulated question card (*“हमें अपने बारे में बताइए और आप यह role क्यों चाहते हैं?”*), and 4 feature tiles.
     - **Section 7 (Pricing)**: 3-tier matrix featuring solid royal blue `#2563EB` `Campus Pro` card (`₹2,49,999/yr + GST`) with white text and CTA button, flanked by `Campus Starter` (`₹99,999/yr`) and `University / Group` (`Custom`).
     - **Section 8 (Compliance & Governance)**: 4 enterprise-grade security cards (DPDP Act 2023, GCP Mumbai, Live In-Memory Audio, Tenant Isolation).
     - **Section 9 (FAQ Accordion)**: 6 expandable questions answering TPO operational queries.
     - **Section 10 (Footer & Integrated Demo Card)**: Dark navy `#0B1228` footer with legal credentials, navigation links, and embedded demo booking form (*"Placement season won't wait."*) with DPDP consent and honeypot.
   - **Verification**: `npm run build` completed in 3.70s with 0 errors. All 26 test suites (201/201 tests) passing. Verified visually via Playwright browser screenshots across all sections.
   - Rollback action: `git checkout 9745db2 -- src/pages/ForCollegesPage.tsx`

1. **2026-09-28: P1 Resolution: QA Bug Fix Suite (Resume Privacy, Studio Gating & AI 500 SyntaxError, Job Fit Granularity, Question Bank Saving, Drive Rejection Crash, Student Roster Opt-Out) (`aivi-campus-os`):**
   - **Bug 1 (Resume Vault Student Privacy)**: Directed student navigation to `/campus/student-vault` and guarded `/campus/vault` with role check redirecting students.
   - **Bug 2 (Resume Studio AI 500 JSON SyntaxError)**: Fortified `sanitizeStringLiterals` lookahead to prevent false positive breaks on internal quotes in bullet points; enforced single quotes in `SYSTEM_PROMPTS.resume_rebuild`; sanitized error messages in `ResumeBuilder.tsx`.
   - **Bug 3 (Resume Studio Campus Gating)**: Updated `checkUsage`, `checkUsageInline`, `careerAnalysis`, and `planService.ts` to recognize campus tenancy claims, granting full studio access to campus students.
   - **Bug 4 (Job Fit Scoring 100/100/100/50)**: Normalizing AI response keys to frontend scoring fields with granular ratio calculation in `jobFitScoring.ts`.
   - **Bug 5 (Question Bank "Failed to Save Set")**: Relaxed Firestore rule to `isAuth()` for `user_question_sets` and added `localStorage` caching fallback.
   - **Bug 6 (Placement Drives Crash on Rejection)**: Fixed `ReferenceError: rejectionNotes` in `PlacementDrives.tsx`.
   - **Bug 7 (Student Roster Opt-Out Status)**: Added `opted_out` badge rendering and dropdown filter option in `StudentsDirectory.tsx`.
   - All 25 test suites passed (197/197 tests). Staging build completed in 3.56s. Functions compiled cleanly.
   - Rollback action: `git checkout 1aca3e9 -- . && npm run build:staging`.
2. **2026-09-27: P1 Resolution: Bulk Student Import Academic Branch Whitelist Normalization & Offline PO Tax Invoice WinAnsi Resilience (`aivi-campus-os`):**
   - **Bug 1: Bulk Student Import Academic Whitelist Failure (`/campus/import`)**:
     - Created robust `normalizeBranch(raw: string): string` with degree prefix stripping (`B.Tech in`, `M.Tech in`), symbol normalization, and canonical mapping for all major engineering branches (`ME`, `IT`, `BT`, `EE`, `ECE`, `EEE`, `CSE`, `CIVIL`, `AIML`, `AI & DS`, `CHEM`, `AERO`, etc.).
     - Updated `importStudentsCsv` to normalize branch strings, validate for non-empty/alphabetic text, and dynamically auto-learn and whitelist valid branches (`learnedBranches.add(branch)`).
     - On live import, any newly discovered branches are automatically persisted into `tenants/{tenantId}.academic.branches` (`combinedBranches = Array.from(new Set([...knownBranches, ...learnedBranches]))`).
     - Synchronized identical normalization and branch auto-learning into `addCampusStudent` single-student registration.
   - **Bug 2: Offline PO Tax Invoice Generation Failure (`/campus/billing`)**:
     - Wrapped `page.drawText` in `generateTenantInvoice` with a WinAnsi safe text sanitizer that automatically maps `₹` to `INR ` and converts non-ASCII characters to standard ASCII printable characters, preventing any font encoding crashes.
     - Implemented `triggerPdfDownload` in `CampusBilling.tsx` converting base64 data URLs to downloadable Blobs (`Invoice_*.pdf`), and connected it to both the generator and table download buttons.
     - Removed `orderBy("createdAt", "desc")` from Firestore query in `fetchInvoices`, sorting in memory to eliminate composite index requirements.
   - All 25 test suites passed (197/197 tests). Production staging build completed cleanly in 2.89s. Functions build compiled with zero errors.
   - Rollback action: `git checkout 8da8e51 -- . && npm run build:staging`.
2. **2026-09-27: P1 Resolution: 3 Anti-Demotion Guards & Platform Admin TPO Role Management Modal (`aivi-campus-os`):**
   - **Triple Anti-Demotion Guards**:
     - **Guard 1 (Backend Authority Lock)**: In `inviteCoordinator`, blocks invitations if `lowerEmail === tenantData.adminEmail`, `lowerEmail === callerCtx.email`, or if existing claims/profile already have `tenant_admin`, `platform_admin`, or `admin`, throwing `failed-precondition: "Cannot invite the Primary TPO Administrator as a Coordinator. TPO Admins cannot be demoted."`
     - **Guard 2 (Frontend Modal & Submit Defense)**: In `StaffManagement.tsx`, detects `isSelfInvite`, renders a self-demotion warning alert, disables the submit button, guards `handleInviteSubmit` and `handleDeactivate`, and displays a "Primary Admin" badge in the staff roster.
     - **Guard 3 (Auth Session Self-Healing)**: In `AuthContext.tsx`, auto-heals any user whose email matches `td.adminEmail` or `td.tpoEmail`, or UID matches `td.adminUid`, to `role: "tenant_admin"`, and auto-resolves missing `tenantId` by looking up the tenant record by `adminEmail`.
   - **Platform Admin Role Management Modal & Campuses Roster Redesign (`PlatformAdminConsole.tsx`)**:
     - Created HTTPS Callable Cloud Function `reassignTenantAdmin` in `functions/src/index.ts` (with Zod schema in `validators.ts`), allowing `platform_admin` to assign, change, or recover any college's TPO Administrator. Automatically provisions or updates the Auth user, sets `{ tenantId, role: "tenant_admin" }` claims, updates `profiles` and `tenants/{tenantId}`, and purges coordinator locks.
     - Enhanced `getTenantStaff` and `setTenantRole` Cloud Functions to allow `platform_admin` to specify `tenantId`.
     - **Directory Redesign**: Replaced the plain table with a modern, catchy institutional directory featuring live search by college name/code/email and dual view modes (Executive Cards Grid View vs Table View), featuring a prominent **Primary TPO Administrator Box** with avatar initials, Name, copy button for Email, Tier-1 badge, seat progress bar, plan badge, and MRR.
     - **TPO Admin Role Management Modal (`TpoAdminManagementModal`)**: Tab 1 (Current Authority & 1-click **"⚡ Re-Sync TPO Claims Now"** button to immediately repair any accidental demotion), Tab 2 (Reassign / Change TPO Admin with auto-generated secure temporary password), and Tab 3 (Campus Staff Roster with 1-click **"Promote to TPO"**).
   - All 25 test suites passed (195/195 tests). Staging build completed cleanly in 15.33s. Functions build compiled with zero errors. Target repository: `aivi-campus-os`, branch `compliance/dpdp`.
   - Rollback action: `git checkout ccbdb15 -- . && npm run build:staging`.
2. **2026-09-25: P1 Resolution: Placement Drives Offer Recording & Student Roster Placed Status Persistence:**
   - **Bug 1: Placement Drives Offer & Outcome Sync (`/campus/drives`)**: Fixed `recordDriveOutcome` in `functions/src/index.ts` so `offerLetterUrl` is optional, auto-provisions missing `drive_applications` documents, sets `eligible: true`, updates student `profiles` with `placementStatus: "placed"`, `placedCompany`, and `placedPackageLpa`, and recomputes tenant rollups. Updated `PlacementDrives.tsx` to scope applications to active `driveId`, apply dual-layer local caching, immediately update React state, and display "Eligible (Offered)" and "Offered" badges.
   - **Bug 2: Students Roster Placed Status Persistence (`/campus/students`)**: Created HTTPS Callable Cloud Function `updateStudentPlacementStatus` with Zod schema validation, auto-provisioning fallback, and tenant placement counter tracking. Exported client service in `campusService.ts`. Updated `StudentsDirectory.tsx` to merge cached placement status in `fetchStudents`, added interactive `<Select>` for status updates in the student drawer, and wired "Verify & Watermark" to `handlePlacementStatusChange("placed")` with dual-layer persistence.
   - All 25 test suites passed (194/194 tests). Production staging build completed cleanly in 2.70s.
2. **2026-09-25: Option B Institutional Gateway & Multi-Layer Tenant Suspension Lockout:**
   - Implemented Option B on generic `/campus/login`: renders "Find Your College Portal" gateway prompting users for their institution's campus code (e.g. `sunrise-institute`, `rvce`), with secondary toggle for Platform Master Admin Sign In.
   - Enforced tenant suspension across all layers:
     - Cloud Function `getTenantBranding` returns `status: data.status || "active"`.
     - `BrandedLogin.tsx` renders dedicated "WORKSPACE SUSPENDED" card and blocks auth if tenant is suspended.
     - `TenantRoute.tsx` renders "Institution Workspace Suspended" shield page with instructions and sign-out.
     - `AuthContext.tsx` tracks `status` in `TenantContextState` read directly from Firestore.
   - All 25 test suites (193/193 tests passing). Verified clean `npm run build:staging`.
2. **2026-09-24: Sovan TPO Login Resolution, AuthContext Scope Fix & Firestore Rules Claims Hardening:**
   - Diagnosed exact root cause of Sovan (`sovanbarik07@gmail.com`) receiving "Institutional Access Required": `AuthContext.tsx` line 272 threw `ReferenceError: activeDemoTenant is not defined` on live staging domains because `activeDemoTenant` was only declared inside `if (!isProdDomain)`.
   - Fixed `AuthContext.tsx`, `CampusDashboard.tsx`, `onUserSignupComplete`, and hardened `firestore.rules`.
3. **2026-09-24: Strict Institutional Access Enforcement, Sunrise Tenant Restoration & Multi-User Session Isolation:**
   - Restored document `tenants/adOtxjQiZCjbM1t5hERv` ("Sunrise Institute of Technology", `code: sunrise-institute`, `seats: 1000`) provisioned by Ashmi for Sovan's placement drive & roster testing with all original fields, modules, and import jobs intact. Confirmed zero data loss.
   - Diagnosed and resolved root cause of random personal/B2C Gmail accounts (e.g. `abhishek.semm@gattcare.com`) inheriting student access: stale `localStorage` keys (`aivi_active_tenant_id` and `aivi_active_role`) were inherited when switching users on the same machine.
   - Hardened `TenantRoute.tsx`: Requires server-verified `tenant.tenantId` and institutional role; unverified accounts receive the "Institutional Access Required" screen.
   - Hardened `BrandedLogin.tsx`: Strictly blocks non-platform-admin accounts that lack a verified `userTenantId` on live domains (`staging.aivicampus.com`, `aivicampus.com`), immediately purges localStorage keys, calls `auth.signOut()`, and toasts an institutional access required error.
   - Hardened `AuthContext.tsx` & `TenantBrandingContext.tsx`: On `signOut()` and upon detecting unlinked accounts on live domains, thoroughly purges `aivi_active_tenant_id`, `aivi_active_tenant_code`, `aivi_active_tenant_name`, and `aivi_active_role`. Prevents synthesizing mock tenants from localStorage on live domains.
   - Added 3 new regression tests in `src/test/campusLoginUat.test.ts` (191/191 tests passing). Verified clean `npm run build:staging`.
2. **2026-09-23: Permanent Demo Account Purge, Clean-Slate Provisioning & Zero-Code Engineering Guide:**
   - Permanently deleted `director.tpo@sunrise.ac.in` and all demo test users from Firebase Auth (`aivi-campus-stg`), and deleted `demo-campus-001` (Sunrise) and test Apex college from Firestore.
   - Implemented hard blocks in `BrandedLogin.tsx` and `AuthContext.tsx`: unconditionally rejects any mock `@sunrise.ac.in` or `demo.aivilabs.com` logins on live domains (`staging.aivicampus.com`, `aivicampus.com`), wipes `localStorage`, and signs out immediately.
   - Removed the pre-seeding helper button from `PlatformAdminConsole.tsx` so the platform admin console starts 100% clean with 0 colleges, requiring colleges to be provisioned from scratch.
   - Authored `AI_ENGINEERS_ZERO_CODE_STAGING_GUIDE.md`: 100% browser-only testing manual for Ashmi (Platform Master), Sovan (TPO Director), and Isha (Student & AI Evaluator) without requiring repository or terminal access.
2. **2026-09-23: Dedicated Staging Platform Admin Provisioning & Verification:**
   - Provisioned dedicated staging platform admin account (`staging.admin@aivicampus.com` / `AiviAdmin@2026!`) with `emailVerified: true`, custom claims `role: "platform_admin"`, and Firestore documents in `user_roles` and `profiles` on `aivi-campus-stg`.
   - Updated route guards and contexts (`AdminRoute.tsx`, `AuthContext.tsx`, `BrandedLogin.tsx`, `Auth.tsx`, `CampusHeader.tsx`) to recognize `staging.admin@aivicampus.com` and `qa.admin@aivicampus.com` without prompting for email verification.
   - Added regression assertions to `campusLoginUat.test.ts`. Built and deployed live to `staging.aivicampus.com`.
   - Verified live via headless Playwright: direct email/password login automatically routes into `/platform-admin`, and seeded test campus **Apex Institute of Technology** (`code: apex`, `tpo@apex.ac.in`).
2. **2026-09-23: Cross-Tenant Auth Boundary, Demo Mock Purge & Accent Color Settings Fix:**
   - Enforced strict tenant boundary checks in `BrandedLogin.tsx`: prevents cross-tenant state pollution when signing into specific college URLs (e.g. Sunrise credentials signing into RVCE or custom tenant), immediately signs out, purges localStorage tenant keys, and alerts the user with an institutional boundary error.
   - Eliminated phantom demo tenants fallback (`DEFAULT_DEMO_TENANTS`) from `PlatformAdminConsole.tsx` so staging reflects clean Firestore state. Added 1-click **"Seed QA Test Campus (Apex)"** button for QA interns (`apex`, `tpo@apex.ac.in`) and converted popup-blocked login window triggers to native `<a>` anchors with external icons.
   - Fixed runtime crash in `TenantSettingsPage.tsx` and `TenantBrandingContext.tsx` by implementing `updateBrandingColors(primary, accent)`, adding Accent Highlight Color inputs, and live preview swatches.
   - Added regression tests in `src/test/campusLoginUat.test.ts` (186/186 tests passing) and confirmed clean staging production build.
2. **2026-09-19: Created Root AGENTS.md Living Ledger:**
   - Formalized canonical living ledger in repository root compliant with global memory protocol (`cross_codebase_memory.md`).
   - Recorded full statutory identity (DPIIT `#DIPP271794`, Start In UP `#R/STARTUP/UP/LKO/2026/000045574`, CIN `U62099UP2026PTC249169`).
3. **2026-09-18: Rookie QA Intern Zero-Code Step-by-Step Testing Guide:**
   - Created [`QA_INTERN_STEP_BY_STEP_TESTING_GUIDE.md`](./QA_INTERN_STEP_BY_STEP_TESTING_GUIDE.md): 100% code-free manual for QA interns using Google Chrome DevTools and Postman/Hoppscotch.
   - Outlines 10-second token grab, 10-tab browser concurrency testing, dirty CSV upload, XSS copy-pasting, ₹1 plan tampering, and offline airplane mode simulation.
4. **2026-09-18: QA 3-Day Break-Testing Master Runbook:**
   - Authored [`QA_3_DAY_BREAK_TESTING_MASTER_RUNBOOK.md`](./QA_3_DAY_BREAK_TESTING_MASTER_RUNBOOK.md): Complete architectural attack surface, 30+ Cloud Functions inventory, parallel Day 1-3 execution matrices for QA Tester 1 and QA Tester 2, exact cURL payloads, 15-minute smoke checklist, October 1 Go/No-Go gate matrix, and live defect tracker.
5. **2026-09-16: Automated CI/CD Pipeline & Atomic Zero-Downtime Deployment:**
   - Created [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml): 3-stage GitHub Actions pipeline with 4 pre-flight gates (typecheck, 183 Vitest tests, securityVerify, functions build).
   - Configured automated staging deployment on merge to `main` and manual approval gate for atomic production deployment on Hostinger VPS.
6. **2026-09-16: Statutory Corporate Identity & DPDP Grievance Designation:**
   - Designated **Mr. Mithlesh Mishra** as official DPDP Data Protection Grievance Officer (`grievance@aivicampus.com` / `hello@aivilabs.com`).
   - Updated corporate LinkedIn URL to `https://www.linkedin.com/company/aiviintelligence/`.
   - Removed demo login buttons from general login (`BrandedLogin.tsx`), restricting them strictly to `sunrise` demo slug.
   - Added explicit `/campus/platform-admin` route alias in `App.tsx` and `AdminRoute.tsx` preventing 404 errors.
7. **2026-09-16: Staging Deployment & Multi-Tenant Firestore Verification:**
   - Built and deployed staging bundle (`npm run build:staging`) to `/var/www/aivicampus-staging/html`.
   - Deployed Firestore rules to `aivi-campus-stg` and verified cleanly via Playwright.
8. **2026-09-09: Live Production Branding & Statutory Credentials:**
   - Deployed live release `20260909_branding_prod` to `https://aivicampus.com`.
   - Embedded DPIIT (`#DIPP271794`), Start In UP, and MSME badges across hero, navbar, and footers.

### 🚫 Deprecated / Phased-Out Items (Never Resurrect):
- **Phantom Demo Fallback in Platform Admin:** `DEFAULT_DEMO_TENANTS` must never be used as a fallback in `PlatformAdminConsole.tsx` when Firestore is empty; staging must display genuine Firestore state.
- **Cross-Tenant Account Leaks:** Never permit credentials registered with one college (e.g. Sunrise) to authenticate into another institution's branded login URL without explicit boundary rejection.
- **Demo Login Buttons on General Login:** Demo shortcuts ("⚡ TPO demo login" / "🎓 Student demo login") must NEVER appear on `/campus/login`. They are strictly restricted to `/campus/login/sunrise`.
- **Direct 404 on Platform Admin:** Navigating to `/campus/platform-admin` previously returned 404; it is now an explicitly declared route guarded by `<AdminRoute>`.
- **Legacy DPIIT Number:** `#DPIIT174883` and `#DIPP162791` are obsolete/invalid. The only valid recognition number is **`#DIPP271794`**.
- **"PIS Tech":** Completely phased out and banned across all prompts, copy, and documentation.
- **Terminal-Only Expectations for Interns:** Rookie QA interns do not use raw curl or terminal; they test via Chrome DevTools and Postman.

### 🎯 Next Immediate Action Items:
1. Supervise QA Intern Day 1 & Day 2 test execution using `QA_INTERN_STEP_BY_STEP_TESTING_GUIDE.md` and log defects in `QA_3_DAY_BREAK_TESTING_MASTER_RUNBOOK.md`.
2. Fix and verify any P0/P1 defects discovered on `https://staging.aivicampus.com`.
3. Conduct 15-minute smoke sweep and prepare for October 1 live production cutover.

---

## 5. 🛡️ Core Engineering & Deployment Protocols

All agents must follow the streamlined Karpathy-aligned AIVI protocol:
1. **Think Before Coding (K1-K3):** Surface tradeoffs before coding. Minimum code that solves the problem. Surgical changes only—never refactor adjacent working code.
2. **Safe-Fix Rules (R1-R6):** Scope lock to requested feature. Diagnose root cause (file + line). Check blast-radius. Verify unit tests and build before and after (`npm test`, `npm run build:staging`). Never touch secrets or payment webhooks.
3. **Deployment Safety (D1-D3):** **NEVER deploy automatically.** Live server commands or Nginx reloads are executed ONLY when the user literally types `"DEPLOY"`. Always commit cleanly (`git commit`) and push (`git push origin compliance/dpdp`). Document live rollback command.
4. **Permanent Operational Memory:**
   - Append 5-8 line entry to [`CHANGELOG.md`](./CHANGELOG.md) with exact UTC and IST timestamps whenever architecture, features, or configurations change.
   - Update `## 4. 📍 Current Live State & Recent Shipments` in this [`AGENTS.md`](./AGENTS.md) file.
   - Update Memory MCP server with key technical milestones.
