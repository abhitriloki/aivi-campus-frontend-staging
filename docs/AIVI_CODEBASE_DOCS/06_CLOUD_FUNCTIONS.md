# Chapter 06 — Cloud Functions Specification & API Catalogue
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Cloud Functions Source [`functions/src/index.ts`], [`functions/src/security/auth.ts`], [`functions/src/payments/razorpay.ts`], [`functions/src/demoSeeder.ts`]

---

## 1. Executive Summary & Runtime Configuration

The backend is built on **Firebase Cloud Functions v2 (Node.js 20 runtime in region `us-central1`)** [`functions/src/index.ts`]. A total of **78 Cloud Functions** are exported from `functions/src/index.ts`.

* **AI Model Config:** `GEMINI_MODEL = "gemini-2.5-flash"` [`functions/src/index.ts`].
* **Rate Limits:** `ai_rate_limits/{uid}_{functionName}` enforces max 3 calls/min [`functions/src/index.ts`].

---

## 2. Cloud Functions Catalogue (Grouped by Domain)

Below is the complete specification for all 78 Cloud Functions:

### 2.1 Domain A: Auth Triggers & User Lifecycle Functions
* **`onUserSignupComplete` (Auth v1 Trigger):** Fires on `user().onCreate`. Provisions `profiles/{uid}`, `user_plans/{uid}`, `user_roles/{uid}` documents [`functions/src/index.ts`].
* **`deleteMyAccount` (HTTPS Callable):** Requires auth. Calls `deleteUserData(db, uid)` to cascade delete user data across 9 collections and delete auth user [`functions/src/index.ts`].
* **`bootstrapPlatformAdmin` (HTTPS Request):** Validates caller email against `PLATFORM_ADMIN_ALLOWLIST`. Injects `{ role: "platform_admin" }` claims [`functions/src/index.ts`].
* **`adminUpdateUser` (HTTPS Callable):** Requires admin. Updates user role/plan records [`functions/src/index.ts`].

### 2.2 Domain B: B2C SaaS AI Career Analysis Functions
* **`careerAnalysis` (HTTPS Callable):** Core AI engine. Accepts `{ analysisType, inputText, jobDescription, targetRole }`. Enforces auth, email verification, rate limits, and plan usage. Calls Gemini 2.5 Flash. Writes to `analysis_results` and `ai_usage_logs` [`functions/src/index.ts`].
* **`saveAnalysisResult` (HTTPS Callable):** Manually saves analysis results to Firestore [`functions/src/index.ts`].
* **`extractPdf` (HTTPS Callable):** Ingests PDF file Base64 and returns extracted raw text [`functions/src/index.ts`].
* **`checkUsage` (HTTPS Callable):** Queries remaining plan limits for user [`functions/src/index.ts`].
* **`getUserPlanInfo` (HTTPS Callable):** Fetches plan details, expiration dates, and billing status [`functions/src/index.ts`].
* **`applyCoupon` (HTTPS Callable):** Validates and applies discount promo coupon codes [`functions/src/index.ts`].
* **`onAnalysisResultCreated` (Firestore Trigger):** Listens to `analysis_results/{id}` creation. Auto-updates aggregate user counters [`functions/src/index.ts`].

### 2.3 Domain C: B2C Payments & Billing Functions
* **`createPaymentOrder` (HTTPS Callable):** Authenticates user, calls Razorpay `/v1/orders` (Starter: ₹399, Pro: ₹599), writes `payment_orders` document [`functions/src/index.ts`].
* **`razorpayWebhook` (HTTPS Request):** Endpoint `/webhooks/razorpay`. Verifies HMAC-SHA256 signature. Processes `payment.captured` event idempotently using `payment_events`, activates `user_plans` [`functions/src/index.ts`].

### 2.4 Domain D: Multi-Tenant Campus Management Functions
* **`provisionTenant` (HTTPS Callable):** Admin function to set up new institutional tenant document [`functions/src/index.ts`].
* **`setTenantRole` (HTTPS Callable):** Admin/Tenant Admin function to assign roles and claims [`functions/src/index.ts`].
* **`getMyTenantContext` (HTTPS Callable):** Returns user's tenant context, branding, and role [`functions/src/index.ts`].
* **`importStudentsCsv` (HTTPS Callable):** Bulk CSV student import wizard backend [`functions/src/index.ts`].
* **`getImportJob` (HTTPS Callable):** Polls status of async CSV import job [`functions/src/index.ts`].
* **`getCampusStudents` (HTTPS Callable):** Returns paginated student roster for staff [`functions/src/index.ts`].
* **`getTenantBranding` (HTTPS Callable):** Public endpoint fetching custom logo and colors for tenant login [`functions/src/index.ts`].
* **`acceptDpdpConsent` (HTTPS Callable):** Records student Digital Personal Data Protection consent [`functions/src/index.ts`].
* **`inviteCoordinator` (HTTPS Callable):** Invites departmental staff and assigns `branchScope` [`functions/src/index.ts`].
* **`deactivateStaff` (HTTPS Callable):** Revokes staff coordinator access [`functions/src/index.ts`].
* **`getTenantStaff` (HTTPS Callable):** Lists institutional staff directory [`functions/src/index.ts`].
* **`listTenantsPublic` (HTTPS Callable):** Lists active campuses for public dropdown selection [`functions/src/index.ts`].

### 2.5 Domain E: Placement Drives & Sprints Functions
* **`parseDriveJd` (HTTPS Callable):** Uses Gemini to extract required skills, min CGPA, and branches from corporate JD [`functions/src/index.ts`].
* **`createDrive` (HTTPS Callable):** Creates new placement drive record [`functions/src/index.ts`].
* **`updateDrive` (HTTPS Callable):** Updates drive criteria [`functions/src/index.ts`].
* **`computeDriveShortlist` (HTTPS Callable):** Evaluates student CGPA, AES, and DPDP consent to compute shortlist [`functions/src/index.ts`].
* **`publishDrive` (HTTPS Callable):** Changes drive status to `published` [`functions/src/index.ts`].
* **`generateDriveSprint` (HTTPS Callable):** Generates day-by-day prep sprint using AI [`functions/src/index.ts`].
* **`enrollInSprint` (HTTPS Callable):** Enrolls student in preparation sprint [`functions/src/index.ts`].
* **`markSprintTaskDone` (HTTPS Callable):** Updates task completion state in sprint enrollment [`functions/src/index.ts`].
* **`recordDriveOutcome` (HTTPS Callable):** Records final selection / offer CTC for drive applicant [`functions/src/index.ts`].

### 2.6 Domain F: Resume Vault & Verification Functions
* **`submitVaultResume` (HTTPS Callable):** Uploads student resume to campus vault [`functions/src/index.ts`].
* **`verifyResume` (HTTPS Callable):** TPO function to approve resume and stamp verification QR code [`functions/src/index.ts`].
* **`requestResumeChanges` (HTTPS Callable):** TPO function to request resume revisions [`functions/src/index.ts`].
* **`getResumeSignedUrl` (HTTPS Callable):** Generates temporary Storage download URL [`functions/src/index.ts`].
* **`verifyPublicQrToken` (HTTPS Request):** Public URL endpoint verifying QR seal authenticity [`functions/src/index.ts`].
* **`exportResumePackage` (HTTPS Callable):** Compiles ZIP archive of verified student resumes [`functions/src/index.ts`].
* **`getExportJob` (HTTPS Callable):** Polls status of bulk ZIP export job [`functions/src/index.ts`].

### 2.7 Domain G: Vernacular AI Mock Interview Functions
* **`startMockInterview` (HTTPS Callable):** Initializes mock interview session [`functions/src/index.ts`].
* **`answerMockInterviewTurn` (HTTPS Callable):** Processes spoken/written turn via Bhashini / AI [`functions/src/index.ts`].
* **`finishMockInterview` (HTTPS Callable):** Computes final scorecard and radar metrics [`functions/src/index.ts`].
* **`adjustFacultyInterviewScore` (HTTPS Callable):** Allows faculty to override AI interview score [`functions/src/index.ts`].

### 2.8 Domain H: Reporting, Analytics & Cron Functions
* **`generateAccreditationReport` (HTTPS Callable):** Generates NAAC/NIRF accreditation PDF/CSV [`functions/src/index.ts`].
* **`nudgeStudent` (HTTPS Callable):** Sends email nudge to student [`functions/src/index.ts`].
* **`nudgeIncompleteProfileStudents` (HTTPS Callable):** Sends bulk nudges to incomplete profiles [`functions/src/index.ts`].
* **`generateTenantInvoice` (HTTPS Callable):** Generates institutional PDF invoice [`functions/src/index.ts`].
* **`markInvoicePaid` (HTTPS Callable):** Updates invoice status [`functions/src/index.ts`].
* **`updateTenantPlan` (HTTPS Callable):** Modifies institutional seat count / plan [`functions/src/index.ts`].
* **`toggleTenantStatus` (HTTPS Callable):** Enables/disables tenant access [`functions/src/index.ts`].
* **`tenantStatsNightly` (Scheduled Cron):** Nightly aggregate stats calculation cron [`functions/src/index.ts`].
* **`nightlyTrialExpiryCron` (Scheduled Cron):** Auto-downgrades expired Starter trials [`functions/src/index.ts`].
* **`renewalRemindersCron` (Scheduled Cron):** Sends email reminders for upcoming renewals [`functions/src/index.ts`].
* **`createAnnouncement` (HTTPS Callable):** Publishes campus announcement [`functions/src/index.ts`].
* **`markAnnouncementRead` (HTTPS Callable):** Marks announcement read [`functions/src/index.ts`].
* **`createCampusEvent` (HTTPS Callable):** Adds event to campus calendar [`functions/src/index.ts`].
* **`getEventIcsFile` (HTTPS Callable):** Exports ICS calendar file [`functions/src/index.ts`].
* **`generateParentProgressReport` (HTTPS Callable):** Generates shareable parent progress report [`functions/src/index.ts`].
* **`verifyPublicParentReportToken` (HTTPS Request):** Public token endpoint for parents [`functions/src/index.ts`].
* **`exportAuditLogs` (HTTPS Callable):** Exports institutional audit logs to CSV [`functions/src/index.ts`].
* **`generateTenantApiKey` (HTTPS Callable):** Issues institutional API credentials [`functions/src/index.ts`].
* **`exportStateGovReadinessData` (HTTPS Callable):** Exports state government compliance data [`functions/src/index.ts`].
* **`purgeTenantData` (HTTPS Callable):** Complete institutional data purge [`functions/src/index.ts`].
* **`purgeTenantDataStub` (HTTPS Callable):** Deprecated stub wrapper [`functions/src/index.ts`].
* **`archiveGraduatedBatch` (HTTPS Callable):** Archives graduating student class [`functions/src/index.ts`].
* **`getMultiCampusGroupRollup` (HTTPS Callable):** Aggregates multi-campus group metrics [`functions/src/index.ts`].
* **`backfillAes` (HTTPS Callable):** Recalculates student AES scores [`functions/src/index.ts`].
* **`aggregateTenantDailyStats` (HTTPS Callable):** Manually triggers daily stats aggregation [`functions/src/index.ts`].

### 2.9 Domain I: Additional B2C & System Support Functions
* **`linkedinAnalyze` (HTTPS Callable):** Analyzes LinkedIn profile authority [`functions/src/index.ts`].
* **`linkedinOptimize` (HTTPS Callable):** Generates executive LinkedIn rewrite [`functions/src/index.ts`].
* **`submitContactForm` (HTTPS Callable):** Processes public contact form inquiry [`functions/src/index.ts`].
* **`seedDemoCampus` (HTTPS Callable):** Triggers 1-click demo seeder [`functions/src/index.ts`].
* **`getDemoSeedJob` (HTTPS Callable):** Polls demo seeder execution job [`functions/src/index.ts`].
* **`resetDemoCampus` (HTTPS Callable):** Hard-resets demo campus data [`functions/src/index.ts`].
* **`healthz` (HTTPS Request):** Public health check returning `{ status: "ok" }` [`functions/src/index.ts`].
* **`processMailQueue` (Firestore Trigger):** Listens to `mail_queue/{id}` and dispatches SMTP emails [`functions/src/index.ts`].
