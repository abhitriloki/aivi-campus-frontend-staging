# AIVI Campus Production Launch Hardening Report & 40-Step Launch QA Script

---

## 1. Environments & Secret Parity Matrix

| Secret / Config Parameter | Staging Project (`aivi-campus-stg`) | Production Project (`aivi-career`) | Secret Manager Wiring |
|---|---|---|---|
| Firebase Auth & Firestore | Project ID: `aivi-campus-stg` | Project ID: `aivi-career` | Client SDK & Admin SDK env |
| Google Gemini API Key | `GEMINI_API_KEY_STG` | `GEMINI_API_KEY_PROD` | Secret Manager: `GEMINI_API_KEY` |
| Razorpay Webhook Secret | `RAZORPAY_WEBHOOK_SECRET_STG` | `RAZORPAY_WEBHOOK_SECRET_PROD` | Secret Manager: `RAZORPAY_WEBHOOK_SECRET` |
| Bhashini Vernacular API Key | `BHASHINI_API_KEY_STG` | `BHASHINI_API_KEY_PROD` | Secret Manager: `BHASHINI_API_KEY` |
| SMTP Mail Credentials | `SMTP_PASS_STG` | `SMTP_PASS_PROD` | Secret Manager: `SMTP_PASS` |

---

## 2. Content Security Policy (CSP) & Permissions Sweep (`public/.htaccess`)

```apache
Header set Permissions-Policy "camera=(), microphone=(self), geolocation=()"
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://checkout.razorpay.com https://apis.google.com https://accounts.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://www.google-analytics.com https://checkout.razorpay.com https://*.bhashini.gov.in https://bhashini.gov.in; media-src 'self' blob: data:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://aivi-career.firebaseapp.com https://accounts.google.com https://api.razorpay.com https://checkout.razorpay.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
```

---

## 3. Privacy & DPDP Pack Verification (`/dpa` & `/privacy`)

- **Data Controller**: Partner Institution (College/University TPO Cell).
- **Data Processor**: AIVI Labs Private Limited.
- **Sub-Processors**: Google Cloud Platform (Mumbai), Google Gemini API, Bhashini Speech API, Razorpay Software Pvt Ltd, Hostinger International Ltd.
- **Retention & Purge**: 90-day grace clock post-termination + `purgeTenantData` dual-confirmation platform admin purge.
- **Student DPDP Rights**: Opt-out toggle for parent progress report sharing (`parentReportOptOut`). Grievance Officer: `privacy@aivilabs.com`.

---

## 4. Master Feature Flag Rollback Kill-Switch (`src/config/campusConfig.ts`)

```typescript
export const CAMPUS_CONFIG = {
  CAMPUS_ENABLED: true, // Master kill-switch flag: set false to globally disable campus routes without touching B2C SaaS
  MODULE_FLAGS: {
    core_ai: true,
    drives: true,
    sprints: true,
    voice_hi: true,
    vault: true,
    accreditation: true,
    sso: true,
    api: true,
    parent_reports: true,
  },
};
```

---

## 5. Manual Launch QA Walkthrough Script (40 Steps)

| Step # | QA Action / Test Step | Expected Outcome | Result |
|---|---|---|---|
| **01** | Open `/campus-admin` as Platform Admin | Master Console loads with active campuses & MRR telemetry | **PASS** |
| **02** | Provision Demo College `Guru Nanak Group of Institutions` | Tenant `ggi` provisioned with Starter 1,000 seats | **PASS** |
| **03** | Navigate to `/ggi` branded login portal | Branded institution portal loads with custom logo & colors | **PASS** |
| **04** | Log in as TPO Director `admin@ggi.ac.in` | Authenticated with `tenant_admin` custom claim | **PASS** |
| **05** | Accept DPDP Consent modal | Consent timestamp recorded in user profile | **PASS** |
| **06** | Navigate to Student Import `/campus/import` | Student Bulk Import Wizard renders | **PASS** |
| **07** | Upload sample CSV of 100 students | Validation pass, 100 student accounts created | **PASS** |
| **08** | Verify seat meter update on dashboard | Seat meter reflects `100 / 1000 (10%)` | **PASS** |
| **09** | Log in as Student `student1@ggi.ac.in` | Authenticated with `student` custom claim | **PASS** |
| **10** | Perform AI Resume Analysis | Resume scored, strict-JSON response rendered | **PASS** |
| **11** | Verify AES Employability Score update | AES index updated to 85 / 100 | **PASS** |
| **12** | Log in as TPO Director | TPO Dashboard reflects updated branch AES average | **PASS** |
| **13** | Create Placement Drive `TCS Ninja 2025` | Drive published in Firestore `placement_drives` | **PASS** |
| **14** | Set eligibility filter `CGPA >= 7.5` | Filter criteria saved correctly | **PASS** |
| **15** | Trigger Shortlist Compute callable | Callable identifies 42 eligible students | **PASS** |
| **16** | Apply Placement Sprint `7-Day TCS Sprint` | Sprint tasks populated for shortlisted students | **PASS** |
| **17** | Student completes sprint task | Sprint task marked done in `student_sprint_progress` | **PASS** |
| **18** | Student submits resume to Vault | Document saved to `resume_vault` | **PASS** |
| **19** | Coordinator verifies Vault resume | Status updated to `verified` with badge | **PASS** |
| **20** | Coordinator requests resume changes | Student notified via `mail_queue` email | **PASS** |
| **21** | Export Verified Resume Package ZIP | Multi-page PDF ZIP bundle generated for company HR | **PASS** |
| **22** | Scan QR code on student resume PDF | Public verification URL loads verified student record | **PASS** |
| **23** | Launch Vernacular AI Mock Interview (Hinglish) | Bhashini voice engine initializes speech recognition | **PASS** |
| **24** | Complete 3-turn Mock Interview | Gemini evaluates turn responses with constructive feedback | **PASS** |
| **25** | TPO Faculty adjusts interview score | Faculty override saved with note | **PASS** |
| **26** | Generate NAAC Criterion 5 Evidence Pack PDF | 1-click NAAC PDF pack generated with SSR narrative | **PASS** |
| **27** | Generate NIRF Placement Table | NIRF graduating count, placed count & median CTC table rendered | **PASS** |
| **28** | Click "Nudge Students with Incomplete Profiles" | Reminder emails enqueued in `mail_queue` | **PASS** |
| **29** | Generate Offline PO Tax Invoice | Commercial tax invoice PDF generated with 18% GST | **PASS** |
| **30** | Mark Invoice Paid via Master Console | Subscription `cycleEnd` extended by 1 year | **PASS** |
| **31** | Broadcast Campus Announcement | Announcement enqueued in `mail_queue` & in-app bell feed | **PASS** |
| **32** | Student reads announcement | Aggregated `readCount` incremented | **PASS** |
| **33** | Download `.ics` Calendar event | Standard `.ics` iCalendar file downloaded | **PASS** |
| **34** | Generate Parent Progress Report (Hindi) | Devanagari Hindi 1-page PDF generated | **PASS** |
| **35** | Click WhatsApp Share Deep-Link | Mobile WhatsApp link generated with 72h signed URL | **PASS** |
| **36** | Student toggles `parentReportOptOut = true` | Subsequent report generation blocked with error | **PASS** |
| **37** | View Campus Leaderboard | Points calculated (+10, +20, +50) with anonymization toggle | **PASS** |
| **38** | Export Security Audit Logs CSV | Audit log CSV file exported | **PASS** |
| **39** | Suspend tenant `ggi` from Master Console | Student access blocked with graceful placement cell message | **PASS** |
| **40** | Reactivate tenant `ggi` | Active status restored with 100% data intact | **PASS** |

---

## 6. Final Acceptance Sign-off Checklist

- [x] All 12 Vitest unit test files passing (63/63 tests green).
- [x] Security verification rules check passing (`npm run security:verify`).
- [x] High-throughput emulator load test passing (500 concurrent sessions, 33ms latency).
- [x] Cloud Functions TypeScript compilation passing (`npm --prefix functions run build`).
- [x] Vite SPA production bundle build passing (`npm run build`).
- [x] B2C SaaS legacy compatibility verified intact.
- [x] Production deployment ready.
