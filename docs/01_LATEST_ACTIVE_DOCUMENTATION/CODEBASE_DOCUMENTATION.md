# AIVI Career Intelligence OS - Codebase Documentation

This document provides a comprehensive technical overview of the AIVI Career Intelligence OS codebase. It maps out the system architecture, folder hierarchies, data models, key workflows, routing structures, and local environment configurations.

---

## 1. System Architecture Overview

AIVI is built on a **Firebase-first architecture**, utilizing static web hosting on the client-side, and severless, event-driven components on the backend. It connects directly with Google Gemini for AI analysis and Razorpay for payments.

### 1.1. Technical Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui components, framer-motion (animations), recharts (data visualization).
* **Routing & Client State**: `react-router-dom` (client-side routing) and `@tanstack/react-query` (asynchronous server state management).
* **Authentication**: Firebase Authentication (Email/Password & Google OAuth).
* **Database**: Cloud Firestore.
* **Backend API**: Node.js Firebase Cloud Functions (v2 HTTPS Callables).
* **File Processing**: PDF parsing via Cloud Functions (`pdfjs-dist`).
* **Hosting**: 
  * **Firebase Hosting** (staging/testing).
  * **Hostinger** Apache static hosting (production: [aivilabs.com](https://www.aivilabs.com/)).
* **AI Provider**: Google Gemini (`gemini-2.5-flash`) called via secure server-side Cloud Functions.
* **Payments**: Razorpay gateway integrated via client SDK and verified server-side webhook signatures.

### 1.2. High-Level Architecture Flow

```mermaid
flowchart TD
    User["Browser Client (User)"]
    Admin["Browser Client (Admin)"]
    ViteHost["Static Hosting Hostinger / Firebase Hosting"]
    FirebaseAuth["Firebase Authentication"]
    CloudFunctions["Firebase Cloud Functions (V2 Callable API)"]
    Firestore["Cloud Firestore Database"]
    Gemini["Google Gemini API (gemini-2.5-flash)"]
    Razorpay["Razorpay Gateway"]

    User -->|Loads Frontend| ViteHost
    User -->|Auth Sign-in/Sign-up| FirebaseAuth
    User -->|Call API (with Auth Token)| CloudFunctions
    Admin -->|Admin Dashboard Ops| CloudFunctions

    CloudFunctions -->|Read/Write User Data| Firestore
    CloudFunctions -->|Verify Tokens| FirebaseAuth
    CloudFunctions -->|Structured Prompts| Gemini
    CloudFunctions -->|Generate Subscription Orders| Razorpay

    Razorpay -->|Signed Webhooks| CloudFunctions
```

---

## 2. Directory Structure

Below is the directory tree highlighting the primary files, configs, and directories of the project.

```
aivi-career/
├── .env.local                    # Local environment variables (Vite-specific)
├── .firebaserc                   # Firebase project targets
├── firebase.json                 # Firebase services, rewrites, CSP headers
├── firestore.rules               # Security rules restricting database access
├── firestore.indexes.json        # Composite indexes for Firestore queries
├── package.json                  # Frontend scripts and dependencies
├── tailwind.config.ts            # Tailwind CSS styling configurations
├── tsconfig.json                 # TypeScript rules
├── public/                       # Static public assets
│   ├── .htaccess                 # Apache rewrite engine and CSP (Hostinger)
│   ├── robots.txt                # Search indexing guidelines
│   └── sitemap.xml               # Site map links for SEO
├── functions/                    # Backend Firebase Cloud Functions
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript rules for backend
│   └── src/                      # Backend source files
│       ├── index.ts              # Entry points, callable API endpoints, auth hooks
│       ├── payments/
│       │   └── razorpay.ts       # Razorpay order and signature helpers
│       ├── privacy/
│       │   └── deleteAccount.ts  # Account deletion logic
│       └── security/
│           ├── aiGuards.ts       # Gemini API safeguards and budget checks
│           ├── auth.ts           # Token verification & role helpers
│           ├── errors.ts         # Logging and formatting safety helpers
│           ├── rateLimit.ts      # Cloud Function rate limiters
│           └── validators.ts     # Zod payload validation
├── src/                          # Frontend React Client
│   ├── main.tsx                  # Main entry point
│   ├── App.tsx                   # Routing config, layout hooks, Providers
│   ├── components/               # Shared React UI components (shadcn/ui style)
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth status and session state provider
│   ├── integrations/
│   │   └── firebase/
│   │       └── client.ts         # Browser SDK Firebase Config
│   ├── layouts/
│   │   └── DashboardLayout.tsx   # Dashboard layout structure
│   ├── pages/                    # Frontend Pages & SEO views
│   ├── services/
│   │   ├── analysisService.ts    # Frontend call wrappers to Cloud Functions
│   │   ├── paymentService.ts     # Checkout loaders & transaction triggers
│   │   └── planService.ts        # Direct Firestore checks & trial coupon claims
│   └── utils/
│       ├── jobFitScoring.ts      # Client scoring algorithm
│       ├── pdfParser.ts          # PDF binary parser triggers
│       └── resumeExport.ts       # jsPDF & docx compiler logic
```

### 2.1. Primary Folder Descriptions
* **`functions/`**: Contains the Node.js backend. All AI calls, billing actions, and system level modifications run here to prevent token/secret exposure.
* **`public/`**: Stores static assets that are copied directly into the build folder. Includes the Apache `.htaccess` configuration containing route fallback rewrites and the Content-Security-Policy (CSP) applied by Hostinger.
* **`src/components/`**: Houses reusable UI widgets, page layouts, form inputs, feedback indicators, and common cards.
* **`src/services/`**: Encapsulates the integration layer, translating client UI calls into Firebase Callable API triggers or Firestore queries.
* **`src/utils/`**: General helpers, including parsing PDF files on client load, client-side score validation calculations, and docx/pdf exporter compilers.

---

## 3. Database Architecture & Data Model

AIVI stores persistent state in **Cloud Firestore** using standard document collections. Client-side access is gated by `firestore.rules`, while write operations to transactional collections are restricted to server-side functions.

### 3.1. Primary Firestore Collections

#### 3.1.1. `profiles/{userId}`
Stores user profile information.
* **Fields**:
  * `userId`: `String` (Firebase Auth UID)
  * `fullName`: `String` (User display name)
  * `email`: `String` (User email)
  * `createdAt`: `Timestamp` (Registration date)
  * `updatedAt`: `Timestamp` (Last profile change)
* **Access Rules**: Owners can read/write their own profile; admins can read all profiles.

#### 3.1.2. `user_plans/{userId}`
Stores quotas, subscriptions, and lifetime usage metrics.
* **Fields**:
  * `userId`: `String` (Firebase Auth UID)
  * `planType`: `String` (`free`, `starter`, `pro`, `admin`)
  * `monthlyAnalysisUsed`: `Number` (Counter reset monthly)
  * `monthlyResetDate`: `Timestamp` (Boundary date for usage counter resets)
  * `trial`: `Boolean` (Indicates active trial status)
  * `trialExpiresAt`: `Timestamp | null` (Trial deadline)
  * `trialUsed`: `Boolean` (Flag preventing multiple trial claims)
  * `billing_status`: `String` (`active`, `suspended`, `cancelled`)
  * `paid_until`: `Timestamp | null` (Expiry of paid subscription)
  * `lastPaymentId`: `String | null` (Last Razorpay payment ID)
  * `lastOrderId`: `String | null` (Last Razorpay order ID)
  * `lifetime_resume_count`, `lifetime_jobfit_count`, `lifetime_roadmap_count`, etc.: `Number` (Telemetric tracking counters)
* **Access Rules**: Owners and admins can read; **writes are denied** to the client (server-only updates).

#### 3.1.3. `user_roles/{userId}`
Governs Role-Based Access Control (RBAC).
* **Fields**:
  * `userId`: `String` (Firebase Auth UID)
  * `role`: `String` (`user` or `admin`)
  * `createdAt`: `Timestamp`
* **Access Rules**: Owners and admins can read; only admins can write.

#### 3.1.4. `analysis_results/{analysisId}`
Stores generated reports cached from Gemini.
* **Fields**:
  * `userId`: `String` (Owner's UID)
  * `analysisType`: `String` (`resume`, `job_fit`, `roadmap`, `interview`, `promotion`, `portfolio`, `linkedin`)
  * `result`: `Map` (The raw structured JSON output returned by Gemini)
  * `scores`: `Map` (The calculated metrics for the analysis)
  * `contentHash`: `String | null` (Cryptographic hash of request inputs used for caching)
  * `createdAt`: `Timestamp`
* **Access Rules**: Owners can read; **writes are denied** to the client (Cloud Functions write results).

#### 3.1.5. `ai_usage_logs/{logId}`
Tracks LLM invocation costs and token usage.
* **Fields**:
  * `userId`: `String`
  * `endpoint`: `String` (Cloud function name)
  * `prompt_tokens`: `Number`
  * `completion_tokens`: `Number`
  * `total_tokens`: `Number`
  * `costUsd`: `Number` (Estimate based on current Gemini pricing API weights)
  * `timestamp`: `Timestamp`
* **Access Rules**: Owners and admins can read; client writes are completely blocked.

#### 3.1.6. `payment_orders/{razorpayOrderId}`
Tracks payment checkouts.
* **Fields**:
  * `userId`: `String`
  * `planType`: `String`
  * `amount`: `Number`
  * `currency`: `String`
  * `status`: `String` (`created`, `paid`, `failed`)
  * `paymentId`: `String | null`
* **Access Rules**: Owners can read; client writes are blocked.

### 3.2. Tenancy & Security Model
* **Logical Isolation**: No tenant scoping is required. Single-database tenancy relies on query filters matching `userId == request.auth.uid`.
* **Zero-Client Writes**: No client can edit user plans or directly save analysis reports. A system transaction must happen on the backend via Cloud Functions.
* **Verification Gate**: All endpoints (except public Landing pages) check `request.auth.token.email_verified == true`. Verification is enforced in both frontend routes and Cloud Function call validations.

---

## 4. Key Workflows & Code Implementation

This section traces data flow through core operations and shows where they are implemented.

### 4.1. PDF Resume Upload & Parsing
```
[User Browser] (File Select) 
  --> [src/utils/pdfParser.ts] (FileReader Base64 conversion)
  --> [Firebase extractPdf Callable] 
  --> [functions/src/index.ts] (using pdfjs-dist)
  --> returns parsed text to Frontend
```
* **Client Implementation**: [pdfParser.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/src/utils/pdfParser.ts)
* **Backend Endpoint**: `extractPdf` in [functions/src/index.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/index.ts)

### 4.2. Secure AI Analysis Pipeline
```
[React Page] 
  --> Calls checkAndIncrementUsage() (checks client-side quota early)
  --> Invokes runAnalysis() wrapper
  --> [Cloud Function: careerAnalysis]
      ├── requireVerifiedAuth() (Token validation)
      ├── checkUsageInline() (Database quota subtraction check)
      ├── validatePayload() (Zod validation)
      ├── rateLimiter() (DDoS prevention)
      ├── callGemini() (LLM request & telemetry logging)
      └── saves result to analysis_results
```
* **Client Wrapper**: [analysisService.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/src/services/analysisService.ts)
* **Backend Endpoint**: `careerAnalysis` in [functions/src/index.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/index.ts)
* **API Constraints**:
  * Zod Validation: [validators.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/security/validators.ts)
  * Quota Enforcement: `checkUsageInline` in [functions/src/index.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/index.ts)
  * AI Guards & Cost Tracking: [aiGuards.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/security/aiGuards.ts)

### 4.3. Payment Checkout & Subscription Entitlements
```
[Upgrade Button] 
  --> [src/services/paymentService.ts] (Triggers createPaymentOrder)
  --> [Cloud Function: createPaymentOrder] (Registers Razorpay Order)
  --> Opens Razorpay Checkout Overlay
  --> Razorpay Webhook Call --> [Cloud Function: razorpayWebhook]
      ├── Verifies signature using webhook secret
      ├── Logs event to payment_events (Idempotency check)
      ├── Updates user_plans (Upgrades plan type, resets counters)
```
* **Client Integration**: [paymentService.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/src/services/paymentService.ts)
* **Webhook Handler**: `razorpayWebhook` in [functions/src/index.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/index.ts)
* **Security Validation**: [razorpay.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/payments/razorpay.ts)

### 4.4. Coupon Claim Transaction (`FIRST1000`)
```
[Client Claims Trial] 
  --> Cloud Function applyCoupon
  --> Starts Database Transaction
      ├── Read count of system_stats/beta. Abort if >= 1000
      ├── Read user_plans/{uid}. Abort if trialUsed === true
      └── Update user_plans (starter plan + 30-day expiry) & Increments count
```
* **Implementation**: `applyCoupon` in [functions/src/index.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/functions/src/index.ts)

---

## 5. Interface and Routing Details

The React frontend utilizes `react-router-dom` for application navigation.

### 5.1. Route Mappings

| Path | Component | Access Type | Description |
|---|---|---|---|
| `/` | `Landing.tsx` | Public | Main marketing page |
| `/about` | `About.tsx` | Public | Product / Team overview |
| `/how-it-works` | `HowItWorks.tsx` | Public | Process walkthrough |
| `/contact` | `Contact.tsx` | Public | Contact support form |
| `/auth` / `/login` | `Auth.tsx` | Public / Guest | Authentication portal |
| `/verify-email` | `VerifyEmail.tsx` | Public / Auth | Restricts unverified logins |
| `/dashboard` | `DashboardHome.tsx` | Protected | User Command Center |
| `/dashboard/resume` | `ResumeIntelligence.tsx`| Protected | Resume analyzer and ATS scoring |
| `/dashboard/builder` | `ResumeBuilder.tsx` | Protected | Generative resume studio (Phase 1) |
| `/dashboard/job-fit` | `JobFitAnalysis.tsx` | Protected | JD comparison radar module |
| `/dashboard/roadmap` | `SkillRoadmap.tsx` | Protected | 30/60/90 learning roadmap |
| `/dashboard/interview` | `InterviewPrep.tsx` | Protected | Interview question drill engine |
| `/dashboard/promotion` | `PromotionReadiness.tsx`| Protected | Career level progression evaluator |
| `/dashboard/portfolio` | `PortfolioAnalyzer.tsx` | Protected | Project link validator & score |
| `/dashboard/linkedin` | `LinkedInAnalyzer.tsx` | Protected | Profile optimizers |
| `/dashboard/settings` | `SettingsPage.tsx` | Protected | User account dashboard setting values |
| `/dashboard/admin` | `AdminDashboard.tsx` | Admin-Only | Telemetry, roles, & usage controls |

### 5.2. Special UI Configurations
* **Responsive Layouts**: Fully responsive dashboard layouts supported by collapsible Sidebars and Mobile Nav modules.
* **Toast Notification Feeds**: Integrated `sonner` and `shadcn/ui` toast engines to capture asynchronous API updates.
* **Visual Exporters**: Core Resume Builder supports client-side document layout conversion to `.pdf` and `.docx` formats via [resumeExport.ts](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/src/utils/resumeExport.ts).

---

## 6. Environment & Execution Configuration

### 6.1. Environment Schema

#### 6.1.1. Frontend (`.env.local`)
Create a `.env.local` file in the root directory to store client configuration variables:
```env
VITE_FIREBASE_API_KEY=AIzaSyC8R2soNLEGcy...
VITE_FIREBASE_AUTH_DOMAIN=aivi-career.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aivi-career
VITE_FIREBASE_STORAGE_BUCKET=aivi-career.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=873630515719
VITE_FIREBASE_APP_ID=1:873630515719:web:d111dcd1d...
VITE_USE_FIREBASE_EMULATOR=false
```

#### 6.1.2. Backend Secrets (GCP Secret Manager)
Deploy configuration secrets directly to your Firebase Functions project using the CLI:
```bash
firebase functions:secrets:set GEMINI_API_KEY="your-gemini-api-key"
firebase functions:secrets:set RAZORPAY_KEY_ID="your-razorpay-key-id"
firebase functions:secrets:set RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
firebase functions:secrets:set SMTP_PASSWORD="smtp-authentication-password"
```

---

### 6.2. Development and Build Commands

#### 6.2.1. Initial Installation
Install dependency bundles in both the root workspace and backend cloud function directory:
```bash
# Install root package.json dependencies
npm install

# Install Cloud Functions package.json dependencies
npm --prefix functions install
```

#### 6.2.2. Running Locally (with Emulators)
Start local Firebase emulators for Firestore, Auth, and Functions, and run Vite dev server:
1. Set `VITE_USE_FIREBASE_EMULATOR=true` in your `.env.local` file.
2. In a terminal, start the Firebase Emulators:
   ```bash
   firebase emulators:start
   ```
3. In a separate terminal, launch the local React server:
   ```bash
   npm run dev
   ```

#### 6.2.3. Executing Verification Checks
Before deploying, execute verification audits:
```bash
# Run security checks (verifies credentials and CSP configurations)
npm run security:verify

# Run unit tests
npm test

# Audit dependency vulnerability trees
npm run security:audit
```

#### 6.2.4. Production Compiling
Build the optimized static files and compile typescript code for Cloud Functions:
```bash
# Build Vite client output (compiled into /dist)
npm run build

# Compile TypeScript functions (compiled into functions/lib)
npm --prefix functions run build
```

#### 6.2.5. Firebase Deployment
To deploy security rules, indexes, backend server endpoints, and Firebase Hosting:
```bash
firebase deploy
```

#### 6.2.6. Hostinger Deployment
When deploying to Hostinger:
1. Run `npm run build` to copy the `.htaccess` configuration to `/dist`.
2. Compress the `/dist` directory files into a `.zip` archive.
3. Upload the archive contents directly to your Hostinger server directory (normally `public_html/`).

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
