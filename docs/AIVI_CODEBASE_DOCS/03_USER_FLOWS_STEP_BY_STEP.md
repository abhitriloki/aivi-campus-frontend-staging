# Chapter 03 — Step-by-Step User Flows & End-to-End Journeys
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Application Pages & Services [`src/pages/Auth.tsx`], [`src/pages/ResumeIntelligence.tsx`], [`src/pages/JobFitAnalysis.tsx`], [`src/services/paymentService.ts`], [`functions/src/index.ts`], [`functions/src/demoSeeder.ts`]

---

## 1. Authentication & Account Management Flows

### FLOW-AUTH-01: Email & Password Registration
1. **User Action:** Visitor navigates to `/auth`, inputs full name, email address, and password into the signup form, and clicks "Create Account" [`src/pages/Auth.tsx`].
2. **System Action:** Client executes `createUserWithEmailAndPassword(auth, email, password)`. Firebase Auth provisions user record [`src/pages/Auth.tsx`].
3. **Cloud Function Trigger:** `onUserSignupComplete` auth v1 trigger fires automatically [`functions/src/index.ts`]:
   * Creates `profiles/{uid}` document initialized with `email`, `fullName`, `createdAt`.
   * Creates `user_plans/{uid}` document initialized with `planType: "free"`, `lifetime_resume_count: 0`, `lifetime_jobfit_count: 0`, `monthly_analysis_used: 0`.
   * Creates `user_roles/{uid}` document initialized with `role: "user"`.
4. **Email Verification Trigger:** Client automatically triggers `sendEmailVerification(user)` [`src/pages/Auth.tsx`].
5. **Success End-State:** SPA redirects user to `/verify-email` displaying screen: *"Verification email sent to <email>. Please verify your inbox before proceeding."* [`src/pages/VerifyEmail.tsx`].
6. **Known Failure Points:**
   * Email already in use -> Form displays alert: `"An account with this email already exists."`
   * Weak password (<6 chars) -> Form displays alert: `"Password should be at least 6 characters."`
   * Network error -> Form displays toast: `"Network error during registration. Please try again."`

---

### FLOW-AUTH-02: Verified Email Login & Unverified Block Flow
1. **User Action:** User navigates to `/login`, inputs credentials, and clicks "Sign In" [`src/pages/Auth.tsx`].
2. **System Action:** Client executes `signInWithEmailAndPassword(auth, email, password)` [`src/pages/Auth.tsx`].
3. **Verification Guard Check:** `AuthContext.tsx` reads `firebaseUser.emailVerified`:
   * **Case A (Verified):** Client fetches ID token claims and Firestore `user_roles/{uid}`. State updates `user` and `isAdmin`. SPA redirects to `/dashboard` [`src/contexts/AuthContext.tsx`].
   * **Case B (Unverified):** Client blocks dashboard navigation. SPA redirects immediately to `/verify-email` displaying banner: *"Email unverified. Check your inbox or click Resend."* [`src/components/ProtectedRoute.tsx`].
4. **Known Failure Points:**
   * Invalid credentials -> Auth card displays inline error: `"Invalid email or password."` [`src/pages/Auth.tsx`].
   * Unverified login attempt -> Forced redirect to `/verify-email` [`src/components/ProtectedRoute.tsx`].

---

### FLOW-AUTH-03: Google OAuth Single Sign-On (SSO)
1. **User Action:** Visitor clicks "Continue with Google" on `/auth` modal [`src/pages/Auth.tsx`].
2. **System Action:** Client executes `signInWithPopup(auth, googleProvider)` [`src/pages/Auth.tsx`].
3. **Backend Processing:** Firebase Auth provisions account (Google OAuth accounts auto-set `emailVerified: true`).
4. **Trigger & Profile Sync:** If new user, `onUserSignupComplete` creates `profiles`, `user_plans`, `user_roles` documents [`functions/src/index.ts`]. If existing user, `AuthContext` syncs custom claims [`src/contexts/AuthContext.tsx`].
5. **Success End-State:** User redirected instantly to `/dashboard` with active session [`src/pages/Auth.tsx`].
6. **Known Failure Points:**
   * Popup closed by user -> Form displays toast: `"Google sign-in popup was closed."`
   * Popup blocked by browser -> Form displays alert: `"Popup blocked by browser. Enable popups to sign in with Google."`

---

### FLOW-AUTH-04: Password Reset Loop
1. **User Action:** User clicks "Forgot Password?" on `/auth`, enters registered email, and clicks "Send Reset Link" [`src/pages/Auth.tsx`].
2. **System Action:** Client calls `sendPasswordResetEmail(auth, email)` [`src/pages/Auth.tsx`].
3. **Email Delivery:** Firebase sends password reset email containing link to `https://aivi-career.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=...` [`public/.htaccess`].
4. **Reset Execution:** User clicks email link, opens Firebase reset page, inputs new password, submits.
5. **Success End-State:** Password updated in Firebase Auth. User navigates back to `/login` to sign in.
6. **Known Failure Points:**
   * Non-existent email -> Form displays toast: `"If an account exists for this email, a reset link has been sent."` (Security anti-enumeration pattern).

---

### FLOW-AUTH-05: Account Deletion (GDPR / DPDP Compliance)
1. **User Action:** Authenticated user navigates to `/dashboard/settings`, scrolls to Danger Zone, types `"DELETE MY ACCOUNT"`, and clicks "Permanently Delete Account" [`src/pages/SettingsPage.tsx`].
2. **System Action:** Client invokes HTTPS Callable Cloud Function `deleteMyAccount()` [`functions/src/index.ts`].
3. **Backend Cascade Execution:** Function verifies auth (`requireVerifiedAuth`), then calls `deleteUserData(db, uid)` [`functions/src/privacy/deleteAccount.ts`]:
   * Queries and batch deletes user docs from `analysis_results`, `ai_usage_logs`, `resumes`, `job_descriptions`, `payment_orders`, `system_events` (batch size 450).
   * Deletes `profiles/{uid}`, `user_plans/{uid}`, `user_roles/{uid}`.
   * Deletes Firebase Auth user record via `admin.auth().deleteUser(uid)`.
4. **Success End-State:** Auth session terminated, local storage cleared, client redirected to `/` with toast: `"Your account and all associated data have been permanently deleted."` [`src/pages/SettingsPage.tsx`].
5. **Known Failure Points:**
   * Unverified email -> Throws `permission-denied: "Email verification required."`
   * Network interruption during deletion -> Throws `internal: "Failed to delete account data."`

---

## 2. B2C Core SaaS Module Flows

### FLOW-B2C-01: Resume Intelligence Analysis
1. **User Action:** User lands on `/dashboard/resume`, uploads a PDF/DOCX resume file or pastes raw resume text into the editor, and clicks "Run AI Resume Scoring" [`src/pages/ResumeIntelligence.tsx`].
2. **Client Parsing & Validation:** If file uploaded, client extracts raw text using `pdfParser.ts`. Validates text length (min 50 chars, max 50,000 chars) [`src/components/resume/ResumeUploadForm.tsx`].
3. **Cloud Function Call:** Client calls `httpsCallable("careerAnalysis")` with payload `{ analysisType: "resume", inputText: resumeText }` [`src/services/analysisService.ts`].
4. **Backend Processing & Gating:**
   * Function `careerAnalysis` verifies auth (`requireVerifiedAuth`) [`functions/src/index.ts`].
   * Checks rate limit doc `ai_rate_limits/{uid}_careerAnalysis` (max 3 req/min) [`functions/src/index.ts`].
   * Calls `checkUsageInline(uid, "resume")`: Checks if `user_plans/{uid}` has `lifetime_resume_count < 2` (if Free) or `monthly_analysis_used < 30` (if Starter) [`functions/src/index.ts`].
   * Invokes Gemini 2.5 Flash API with `SYSTEM_PROMPTS.resume` [`functions/src/index.ts`].
   * Formats JSON response, updates `user_plans/{uid}` counters, writes result document to `analysis_results/{id}`, and logs to `ai_usage_logs/{id}` [`functions/src/index.ts`].
5. **Success End-State:** UI renders overall score (0-100), score ring, ATS compatibility breakdown, bullet point improvement recommendations, and score guidance breakdown [`src/pages/ResumeIntelligence.tsx`].
6. **Known Failure Points:**
   * Free limit hit (>=2 uses) -> Modal popup: `"Free tier limit reached. Upgrade to Starter or Pro for unlimited resume scoring."`
   * Text too short (<50 chars) -> Inline error: `"Resume text is too short to analyze."`
   * Gemini API error/timeout -> Toast error: `"AI service is temporarily unavailable. Please try again."`

---

### FLOW-B2C-02: Job Fit Analysis Flow
1. **User Action:** User opens `/dashboard/job-fit`, selects a previously uploaded resume or pastes a new resume, pastes the target Job Description (JD), and clicks "Analyze Job Fit" [`src/pages/JobFitAnalysis.tsx`].
2. **Cloud Function Call:** Client calls `careerAnalysis` with `{ analysisType: "job_fit", inputText: resumeText, jobDescription: jdText }` [`src/services/analysisService.ts`].
3. **Backend Execution:** `careerAnalysis` verifies plan limits (`free` limit: 2 uses). Calls Gemini API with `SYSTEM_PROMPTS.job_fit` [`functions/src/index.ts`]. Writes analysis record to `analysis_results/{id}`.
4. **Success End-State:** Screen displays overall Match Percentage (computed via `jobFitScoring.ts`), Matched Skills tags, Missing Skills categorized into Critical/Moderate/Minor, Experience Match indicator, and Action Plan bullet rewrites [`src/pages/JobFitAnalysis.tsx`].
5. **Known Failure Points:**
   * Missing JD input -> Toast alert: `"Please provide both a resume and a job description."`
   * Usage limit exceeded -> Triggers `UpgradeModal.tsx`.

---

### FLOW-B2C-03: LinkedIn Profile Optimization (Starter / Pro Restricted)
1. **User Action:** User navigates to `/dashboard/linkedin`, pastes profile text, and clicks "Optimize LinkedIn Profile" [`src/pages/LinkedInAnalyzer.tsx`].
2. **Cloud Function Call:** Client calls `careerAnalysis` with `{ analysisType: "linkedin_optimize", inputText: profileText }` [`src/services/analysisService.ts`].
3. **Backend Feature Gate:** `checkUsageInline` checks `analysisType`. Rebuild & Optimize features return `allowed: false` for `free` plan:
   * Reason returned: `"The linkedin optimize feature is only available on Starter or Pro plans."` [`functions/src/index.ts`].
4. **Success End-State (If Paid User):** Screen displays Optimized Headline, Rewritten Executive About Section, Quantified Experience Bullet Points, and Strategic Keyword Additions [`src/pages/LinkedInAnalyzer.tsx`].
5. **Known Failure Points:**
   * Free plan user attempt -> Function throws `HttpsError("permission-denied")`, client pops up `UpgradeModal.tsx` displaying plan comparison table [`src/components/UpgradeModal.tsx`].

---

## 3. B2C Subscription & Payment Flows

### FLOW-PAY-01: Razorpay Subscription Upgrade (Starter / Pro)
1. **User Action:** User clicks "Upgrade" on `PlanUsageBanner` or Pricing Modal, selects "Starter (₹399/mo)" or "Pro (₹599/mo)", and clicks "Proceed to Payment" [`src/components/UpgradeModal.tsx`].
2. **Order Creation Call:** Client calls `paymentService.ts` function `startCheckout(planType, prefill)` [`src/services/paymentService.ts`].
3. **Backend Order Trigger:** Callable function `createPaymentOrder({ planType })` verifies user auth, fetches price (`starter`: 39900 paise, `pro`: 59900 paise) from `PLAN_PRICES_INR`, calls Razorpay API `/v1/orders`, creates `payment_orders/{orderId}` doc with status `created`, and returns `{ orderId, amount, currency, keyId }` [`functions/src/payments/razorpay.ts`].
4. **Script Loading & Modal Launch:** Client dynamically injects Razorpay Checkout JS (`https://checkout.razorpay.com/v1/checkout.js`) with 10s timeout error handler, then calls `new window.Razorpay(options).open()` [`src/services/paymentService.ts`].
5. **Payment Completion & Webhook:** User completes UPI/Card payment inside Razorpay modal. Razorpay sends server-to-server webhook `POST /webhooks/razorpay` (`razorpayWebhook` Cloud Function) [`functions/src/index.ts`]:
   * Validates HMAC-SHA256 signature against `RAZORPAY_WEBHOOK_SECRET`.
   * Checks `payment_events/{eventId}` for idempotency.
   * Updates `payment_orders/{orderId}` status to `paid`.
   * Updates `user_plans/{uid}` document to `plan_type: "starter"` or `"pro"`, resets monthly usage counter, and sets `paid_until` to `now + 30 days`.
6. **Success End-State:** Razorpay modal closes, client calls `refreshTenantContext()`, and UI updates header badge to "Starter Plan" or "Pro Plan" [`src/components/UpgradeModal.tsx`].
7. **Known Failure Points:**
   * Script blocked by adblocker/CSP -> Error toast: `"Unable to load Razorpay checkout script. Please check your network or adblocker/CSP settings."` [`src/services/paymentService.ts`].
   * User closes modal mid-payment -> Modal dismiss callback fires, logging `[Checkout Cancelled] User closed Razorpay modal.` No charge incurred [`src/services/paymentService.ts`].

---

## 4. Institutional B2B Campus OS Flows

### FLOW-CAMPUS-01: 1-Click Demo Campus Seeding (`seedDemoCampus`)
1. **User Action:** Platform Admin opens `/platform-admin` console and clicks "Seed Sunrise Demo Campus" [`src/pages/campus/PlatformAdminConsole.tsx`].
2. **Cloud Function Call:** Client calls `httpsCallable("seedDemoCampus")` with `{ confirmExisting: true }` [`functions/src/index.ts`].
3. **Backend Execution Loop (`runDemoSeeder`):** [`functions/src/demoSeeder.ts`]:
   * **Step 1 (5%):** Provisions `tenants/demo-sunrise` doc (Name: "Sunrise Engineering College, Lucknow", Plan: "pro", Seats: 3000, SeatsUsed: 242).
   * **Step 2 (15%):** Creates staff auth users & profiles: TPO Director (`tpo.director@demo.aivilabs.com`, role `tenant_admin`) & CSE Coordinator (`coordinator.cse@demo.aivilabs.com`, role `coordinator`, `branchScope: ["CSE"]`). Passwords set to `DemoUser@2026`. Sets custom claims `{ tenantId: "demo-sunrise", role: "..." }`.
   * **Step 3 (25%):** Provisions 240 Student Auth accounts & Profiles (`student1@demo.aivilabs.com` to `student240...`, password: `DemoStudent@2026`) across CSE(96), ECE(72), ME(72). Generates realistic CGPA distribution (5.2 - 9.6), AES scores (25-95), and DPDP consent flags.
   * **Step 4 (50%):** Creates 2 Placement Drives (`TCS Ninja 2026`, `Wipro Elite 2026`) and 54 Drive Applications.
   * **Step 5 (75%):** Seeds 100 Resume Vault records (60 verified, 12 submitted, 8 changes requested, 20 draft) and generates PDF byte buffers stamped with TPO verification QR codes via `pdf-lib` & `qrcode`.
   * **Step 6 (90%):** Seeds 35 Mock Interview sessions across Hindi, Hinglish, and English languages. Backfills `tenant_daily_stats`.
4. **Success End-State:** Console shows progress bar reach 100% and displays summary card: *"Seeded 242 Users, 240 Profiles, 100 Resumes, 2 Drives, 35 Mock Interviews."* [`src/pages/campus/PlatformAdminConsole.tsx`].
5. **Known Failure Points:**
   * Non-admin caller -> Throws `permission-denied: "Admin only."`

---

### FLOW-CAMPUS-02: Student Bulk CSV Import & Auto-Provisioning
1. **User Action:** TPO Admin opens `/campus/import`, drops a student roster CSV file, maps CSV headers (`Full Name`, `Email`, `Enrollment No`, `Branch`, `CGPA`, `Graduation Year`), and clicks "Execute Student Import" [`src/pages/campus/StudentImportWizard.tsx`].
2. **Cloud Function Call:** Client calls `httpsCallable("importStudentsCsv")` passing `{ tenantId, csvData }` [`functions/src/index.ts`].
3. **Backend Async Import Job:** `importStudentsCsv` creates an `import_jobs/{jobId}` document with status `processing`. Processes rows in batches:
   * Validates email syntax, enrollment number uniqueness, branch eligibility.
   * Provisions Firebase Auth user if not present, generates random temporary password, sets custom claims `{ tenantId, role: "student" }`.
   * Creates `profiles/{uid}` and `employability_scores/{uid}` documents.
   * Updates `import_jobs/{jobId}` doc with `processedRows`, `successCount`, `errorCount`, and sets status to `completed`.
4. **Success End-State:** UI displays import job summary: *"Import Complete: 150 Students Created, 0 Errors."* [`src/pages/campus/StudentImportWizard.tsx`].
5. **Known Failure Points:**
   * Exceeding tenant seat quota -> Function throws `resource-exhausted: "Tenant seat limit reached. Upgrade campus plan to add more students."`
   * Duplicate enrollment numbers -> Logged as row-level errors in `import_jobs` doc.

---

### FLOW-CAMPUS-03: Placement Drive Creation & Automated Shortlisting
1. **User Action:** TPO Admin opens `/campus/drives`, clicks "Create Placement Drive", inputs company details, pastes job description text, and clicks "Parse JD with AI" [`src/pages/campus/PlacementDrives.tsx`].
2. **Cloud Function Call:** Calls `parseDriveJd({ jdText })`. Function sends text to Gemini API with `SYSTEM_PROMPTS.drive_jd`, extracting `requiredSkills`, `minCgpa`, `branchesHint` [`functions/src/index.ts`].
3. **Drive Publication:** TPO reviews extracted criteria, sets `minCgpa: 6.5`, allowed branches `["CSE", "ECE"]`, and clicks "Publish Drive" (`publishDrive` callable function) [`functions/src/index.ts`].
4. **Shortlist Execution:** TPO clicks "Run AI Shortlist". Backend executes `computeDriveShortlist({ driveId })`:
   * Queries all `profiles` matching `tenantId` and allowed branches.
   * Filters students meeting `cgpa >= minCgpa` and active DPDP consent.
   * Evaluates student AES scores and updates `drive_applications` docs with `eligible: true` and `stageIndex: 1`.
5. **Success End-State:** Placement drive dashboard updates status to `published` and displays shortlist counter: *"38 Students Eligible and Shortlisted."* [`src/pages/campus/PlacementDrives.tsx`].
6. **Known Failure Points:**
   * Coordinator attempting to create drive outside assigned `branchScope` -> Throws `permission-denied: "Access denied for branch."`

---

### FLOW-CAMPUS-04: Vernacular AI Mock Interview Flow (Voice / Text)
1. **User Action:** Student opens `/campus/interviews`, selects interview mode ("Text" or "Voice"), selects preferred language ("Hindi", "Hinglish", or "English"), and clicks "Start Mock Interview" [`src/pages/campus/CampusInterviews.tsx`].
2. **Session Initialization:** Client calls `startMockInterview({ targetRole: "Software Engineer", language: "hi" })` [`functions/src/index.ts`]. Backend provisions a `mock_interviews/{sessionId}` doc with status `active` and returns first AI question.
3. **Voice Audio Handling:**
   * Browser requests microphone permission (`navigator.mediaDevices.getUserMedia`).
   * Student speaks answer in Hindi/Hinglish. Client records audio blob and passes text/audio to `answerMockInterviewTurn` callable function [`functions/src/index.ts`].
   * Backend invokes `voiceEngine` (Bhashini API or Speech-to-Text fallback) to transcribe and evaluate turn [`functions/src/voice/provider.ts`].
4. **Interview Completion:** After 5 turns, student clicks "Finish Interview". Backend calls `finishMockInterview({ sessionId })`, invokes Gemini to compute overall score, technical rating, fluency rating, and feedback summary, and updates `mock_interviews` doc [`functions/src/index.ts`].
5. **Success End-State:** Screen displays detailed interview scorecard, radar chart, turn-by-turn transcript, and audio playback buttons [`src/pages/campus/CampusInterviews.tsx`].
6. **Known Failure Points:**
   * Mic permission denied by user -> Browser alert: `"Microphone access denied. Please enable mic permissions in browser settings to use voice mode."` [`public/.htaccess`].
   * Student missing DPDP consent -> Callable function throws `failed-precondition: "DPDP consent required before running AI analysis."` [`functions/src/security/auth.ts`].
