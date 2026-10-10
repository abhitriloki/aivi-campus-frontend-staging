# AIVI Campus — DPDP Act (India) Compliance Progress & Audit Ledger
**Target Platform:** AIVI Campus OS (`aivicampus.com`)  
**Statutory Framework:** Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)  
**Branch:** `compliance/dpdp` (Zero remote pushes)  
**Ledger Updated:** 2026-09-16 14:55 IST  

---

### 1. Personal Data Inventory, Trackers & Third-Party Services

#### A. Personal Data Collection Points
1. **Institutional Lead & Campus Audit Forms (`ForCollegesPage.tsx`)**:
   - *Data Fields:* Officer Full Name, Designation, Work Email, WhatsApp Phone Number, Institution Name, City, Student Strength.
   - *Legal Basis:* Section 4(1)(a) & Section 6 — Explicit consent for scheduling demo & sample data setup.
2. **Platform Admin Provisioning Console (`PlatformAdminConsole.tsx`)**:
   - *Data Fields:* TPO Admin Full Name, Official Email Address, Generated/Configured Password, Institution Code, Student Seat Quota.
   - *Legal Basis:* Contractual necessity & institutional onboarding.
3. **Student CSV Bulk Import (`StudentImportWizard.tsx`)**:
   - *Data Fields:* Student Full Name, Institutional Email, Enrollment Number, Academic Branch, Batch Year, Cumulative CGPA.
   - *Minimization Verification:* Zero Aadhaar, PAN, banking, religious, or biometric data collected.
4. **Student Resume Vault & ATS Analysis (`ResumeIntelligence.tsx`, `ResumeVault.tsx`)**:
   - *Data Fields:* Uploaded PDF/DOCX resumes (employment history, education, skills, projects, phone, email), extracted textual contents.
   - *Legal Basis:* Affirmative student consent via `DpdpConsentModal.tsx` before document ingestion.
5. **Vernacular Mock Interview Studio (`RealtimeVoiceRoom.tsx`, `InterviewPrep.tsx`)**:
   - *Data Fields:* Real-time microphone audio stream, speech-to-text transcripts (Hindi/English), acoustic metrics (Words Per Minute, filler words count, competency scores).
   - *Storage Posture:* Raw audio streams are processed in ephemeral live browser memory and **never stored as raw audio files on persistent disk**.
6. **Coordinator Invitation (`StaffManagement.tsx`)**:
   - *Data Fields:* Coordinator Name, Official Email, Assigned Academic Department, Role.
7. **Technical & Access Telemetry (`BrandedLogin.tsx`, Nginx access logs)**:
   - *Data Fields:* Anonymized IP addresses, session authentication tokens, sign-in timestamps.

#### B. Trackers & Analytics
- **Google Analytics 4 (`G-XG2DNV7E1C`)**: Gated behind `CookieConsent.tsx`. Disabled by default with `window['ga-disable-G-XG2DNV7E1C'] = true` until user explicitly grants affirmative opt-in. IP anonymization enabled.
- **Google Fonts CDN (`fonts.googleapis.com`)**: Static font stylesheet delivery.

#### C. Third-Party Data Processors
- **Google Cloud Platform (India — Mumbai `asia-south1`)**: Primary data residency host for Firebase Auth, Firestore, Cloud Functions, and Cloud Storage.
- **Google Gemini Enterprise AI**: API evaluation pipeline for resume and interview scoring, operating under enterprise zero-data-retention and zero-model-training terms.
- **Hostinger SMTP Services (`smtp.hostinger.com`)**: Encrypted transactional email dispatch for credentials and notifications.
- **Razorpay Software Private Limited**: PCI-DSS certified payment gateway for institutional campus licensing.

---

### 2. What Was Built & Implemented

| Item | Component / File | Purpose & DPDP Section Addressed |
| :--- | :--- | :--- |
| **1. Statutory Privacy Notice** | `src/pages/Privacy.tsx` | Complete statutory notice under Sections 5, 6, 8, 11, 12, 13, 14. Details data categories, retention schedules, India-based residency (`asia-south1`), sub-processors, and Data Principal rights. Marked for legal review. |
| **2. Data Rights Request Portal** | `src/pages/DataRightsPage.tsx`<br>`src/App.tsx` (`/data-rights`) | Self-service statutory request form for Data Principals to exercise Section 11 (Access), Section 12 (Correction/Erasure), Section 6(4) (Consent Withdrawal), Section 13 (Grievance), and Section 14 (Nomination). Includes instant receipt with 24h SLA. |
| **3. Non-Essential Tracker Gating** | `index.html`<br>`src/components/CookieConsent.tsx`<br>`src/utils/analytics.ts` | Gated GA4 telemetry behind explicit opt-in banner. Default `ga-disable-G-XG2DNV7E1C = true`. Consent status verified before emitting page views or event metrics. |
| **4. Opt-in Consent Checkboxes** | `src/pages/ForCollegesPage.tsx`<br>`src/pages/campus/ForCollegesPage.tsx` | Added unticked, unbundled checkboxes (Mandatory Audit Data Processing Consent + Optional Placement Benchmark Insights). Validation prevents submission without affirmative consent. Stored in payload. |
| **5. Grievance Contact Publication** | `src/components/CampusFooter.tsx`<br>`src/components/GlobalFooter.tsx`<br>`src/pages/Privacy.tsx` | Published explicit Grievance Officer details: Abhishek Mishra, DPO (`grievance@aivicampus.com`, Gorakhpur/NCR, SLA: 24h ack, 30d resolution) across footers and legal pages. |
| **6. Data Protection Terms Clause** | `src/pages/Terms.tsx` | Added Section 4 "Data Protection & Institutional Fiduciary Clause", defining College (Data Fiduciary) vs AIVI (Data Processor), purpose limitation, zero advertising, and DPA incorporation. |
| **7. Data Breach Runbook** | `BREACH_RUNBOOK.md` | Incident response runbook under Section 8(6) DPDP Act & CERT-In directions: 72h DPBI notice template, 6h CERT-In template, student notification template, and TPO briefing template. |

---

### 3. Flagged Security Gaps (AppSec Audit)

1. **Unverified Captcha on Public Lead Forms (`ForCollegesPage.tsx`, `Contact.tsx`)**:
   - *Finding:* Currently relies only on client-side honeypot input (`<input name="website" className="hidden" />`).
   - *Risk:* Vulnerable to automated bot spam and volumetric denial-of-wallet on transactional SMTP or Cloud Function invocations.
   - *Recommendation:* Integrate server-verified Cloudflare Turnstile or Google reCAPTCHA Enterprise before open public marketing push.
2. **Fail-Open Error Swallowing in Provisioning & Login**:
   - *Finding:* `PlatformAdminConsole.tsx:223` and `BrandedLogin.tsx:306` swallow backend authentication/provisioning failures and flash success toasts.
   - *Risk:* False sense of security and confusing ghost redirects for users and administrators.
   - *Remediation Status:* Planned for Phase 1 code fixes (reverting to fail-closed error surfacing).
3. **Orphan Cloud Storage PDF Cleanup on User Erasure**:
   - *Finding:* `deleteUserData` (`functions/src/privacy/deleteAccount.ts`) purges Firestore collections (`analysis_results`, `resumes`, `profiles`) but does not call `admin.storage().bucket().deleteFiles()` for PDF files.
   - *Risk:* Raw resume PDFs could remain in Google Cloud Storage buckets after a student exercises their Right to Erasure.
   - *Remediation:* Add Google Cloud Storage bucket path purging in `deleteUserData`.
4. **Subdomain Wildcard HTTPS Enforcement**:
   - *Finding:* Institutional subdomains (`<college>.aivicampus.com`) route through Nginx.
   - *Risk:* If a newly provisioned tenant uses a custom slug not covered by Let's Encrypt wildcard SAN certificate, browser security warnings will display.
   - *Remediation:* Verify wildcard `*.aivicampus.com` SSL certificate deployment on Hostinger VPS node `187.127.134.92`.

---

### 4. Items Marked for Formal Legal Counsel / Advocate Review

- [ ] **Dual Fiduciary vs Processor Allocation**: Confirm that our contract language accurately designates the partner university as Data Fiduciary and AIVI as Data Processor for institutional placements, while designating AIVI as Data Fiduciary for direct B2C registrations.
- [ ] **Statutory Retention vs Accreditation Audit Conflict**: Review the 12-month post-graduation retention window against AICTE/NAAC requirements for 5-year retrospective placement audit trails.
- [ ] **Section 9 Minor Data Protocol**: Legal confirmation that higher education students under 18 years of age (e.g. 17-year-old first-year enrollees) are covered under institutional loco-parentis consent or require verified parental consent workflows.
- [ ] **Data Protection Board of India (DPBI) Registration**: File official DPO particulars with the DPBI once the central government operationalizes the electronic portal under the DPDP Rules.

---

### 5. Open Technical Action Items
1. Run full automated Vitest test suite (`npm run test`) and production build verification (`npm run build`).
2. Implement Cloud Storage PDF deletion in `functions/src/privacy/deleteAccount.ts`.
3. Resolve the wrong-password redirect loop in `BrandedLogin.tsx` and dynamic password generation in `PlatformAdminConsole.tsx`.
