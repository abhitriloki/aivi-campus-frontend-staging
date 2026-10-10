# Chapter 12 — QA Ready Summary & Master Test Index
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Compiled Documentation Set (Chapters 00–11)

---

## 1. Master Flow Test Index

The table below indexes all user flows documented in Chapter 03 for manual and automated QA test suite generation:

| Flow ID | Flow Name | Primary Actor | # Steps | Happy-Path Expected Result | Main Touch Points (UI + Functions + Collections) |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `FLOW-AUTH-01` | Email Signup | Public Visitor | 5 | User account created; redirected to `/verify-email` | `Auth.tsx` -> `onUserSignupComplete` -> `profiles`, `user_plans` |
| `FLOW-AUTH-02` | Verified Login | Registered User | 4 | User authenticated; redirected to `/dashboard` | `Auth.tsx` -> `AuthContext.tsx` -> `profiles` |
| `FLOW-AUTH-03` | Google SSO | Public Visitor | 5 | OAuth popup completes; user logged into `/dashboard` | `Auth.tsx` -> Firebase Auth -> `profiles`, `user_roles` |
| `FLOW-AUTH-04` | Password Reset | Registered User | 5 | Password reset email sent; password updated | `Auth.tsx` -> Firebase Auth -> `.htaccess` |
| `FLOW-AUTH-05` | Account Deletion| Authenticated User| 4 | User data purged from 9 collections; auth deleted | `SettingsPage.tsx` -> `deleteMyAccount` -> All Collections |
| `FLOW-B2C-01` | Resume Scoring | B2C User | 5 | Score breakdown rendered; usage counter incremented | `ResumeIntelligence.tsx` -> `careerAnalysis` -> `analysis_results` |
| `FLOW-B2C-02` | Job Fit Analysis | B2C User | 4 | Match percentage & skill gaps rendered | `JobFitAnalysis.tsx` -> `careerAnalysis` -> `analysis_results` |
| `FLOW-B2C-03` | LinkedIn Optimizer| Starter/Pro User | 4 | Optimized headline & about rewrite displayed | `LinkedInAnalyzer.tsx` -> `careerAnalysis` -> `user_plans` |
| `FLOW-PAY-01` | Razorpay Upgrade | B2C User | 6 | Razorpay modal completes; plan updated to Starter/Pro| `UpgradeModal.tsx` -> `createPaymentOrder` -> `user_plans` |
| `FLOW-CAMPUS-01`| Demo Seeding | Platform Admin | 4 | Demo campus, 242 users, drives & resumes seeded | `PlatformAdminConsole.tsx` -> `seedDemoCampus` -> `tenants` |
| `FLOW-CAMPUS-02`| CSV Student Import| Tenant Staff | 4 | 150 student accounts created from CSV file | `StudentImportWizard.tsx` -> `importStudentsCsv` -> `import_jobs` |
| `FLOW-CAMPUS-03`| Drive & Shortlist| Tenant Staff | 5 | JD parsed by AI; eligible students shortlisted | `PlacementDrives.tsx` -> `computeDriveShortlist` -> `drives` |
| `FLOW-CAMPUS-04`| Vernacular Interview| Campus Student | 5 | Spoken turns transcribed; scorecard generated | `CampusInterviews.tsx` -> `startMockInterview` -> `mock_interviews` |

---

## 2. Screen State Inventory per Major Module

| Screen / Page | Loading State Indicator | Empty State Indicator | Error State Indicator | Success State Render |
| :--- | :--- | :--- | :--- | :--- |
| **`/dashboard/resume`** | Animated spinner + `"Analyzing resume with AI..."` | `"No resume uploaded. Drag & drop PDF or paste text."` | Alert banner: `"Failed to analyze resume. Try again."` | Circular Score Ring + ATS Heatmap + Bullet Suggestions |
| **`/dashboard/job-fit`** | Progress bar + `"Computing job fit match..."` | `"Paste Job Description to compare against resume."` | Alert banner: `"Please provide both resume and JD."` | Overall Match Percentage + Skill Overlap + Action Plan |
| **`/campus/drives`** | Skeleton cards + `"Fetching placement drives..."` | `"No placement drives created for batch 2026."` | Toast error: `"Access denied for branch scope."` | Placement Drives Table + Shortlist Count Badge |
| **`/campus/vault`** | Loading spinner + `"Loading Resume Vault..."` | `"No resumes submitted to campus vault."` | Alert banner: `"Failed to load vault documents."` | Student Resume Roster + Verification Status + QR Seal |
| **`/campus/interviews`**| Waveform loader + `"Initializing AI voice engine..."` | `"No mock interview sessions recorded."` | Alert banner: `"Microphone permission denied."` | Vernacular Scorecard + Radar Chart + Transcript Player |

---

## 3. Top-20 QA Pre-Bug Checklist

Before reporting a software bug during testing, QA engineers must verify the following checks:
1. Is the email address verified (`emailVerified == true`)?
2. Is the environment set to Staging (`IS_STAGING: true`)?
3. Is the user assigned the correct role in custom claims (`b2c`, `student`, `coordinator`, `tenant_admin`, `platform_admin`)?
4. If testing Coordinator role, is the target student within the coordinator's assigned `branchScope`?
5. Has the student accepted the DPDP Privacy Consent prompt (`dpdpConsent: true`)?
6. Has the user exceeded the Free tier limit (2 lifetime resume/job fit uses)?
7. Has the user exceeded the rate limit (3 calls in 60 seconds)?
8. If testing payments, is Razorpay in Test Mode?
9. Is the browser popup blocker disabled?
10. Is microphone access enabled for Vernacular Voice Interviews?
