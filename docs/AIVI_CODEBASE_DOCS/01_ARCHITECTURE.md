# Chapter 01 — System Architecture & Topology
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Codebase Architecture Files [`src/App.tsx`], [`functions/src/index.ts`], [`public/.htaccess`], [`firebase.json`], [`src/config/campusConfig.ts`]

---

## 1. End-to-End System Architecture

AIVI Career Intelligence OS & Institutional Campus OS is built as a serverless, multi-tenant hybrid cloud architecture comprising a React SPA frontend, Firebase Authentication, Cloud Firestore, Cloud Functions v2 (Node.js 20), Cloud Storage, and external API integrations.

```
+---------------------------------------------------------------------------------------+
|                                    USER BROWSER                                       |
|  React 18 SPA (Vite 8) | Radix UI | TailwindCSS | TanStack Query | Framer Motion         |
+-----------------------------------+---------------------------------------------------+
                                    |
            +-----------------------+-----------------------+
            | (HTTPS / WSS)                                 | (HTTPS Calls)
            v                                               v
+-----------------------+                       +---------------------------------------+
| Firebase Auth Service |                       | Firebase Cloud Functions v2           |
| Password & Google Provider |                  | (Node.js 20 Runtime in us-central1)   |
| Custom Claims Injection |                     +---+---------------+---------------+---+
+-----------+-----------+                           |               |               |
            | (ID Tokens)                           |               |               |
            v                                       v               v               v
+-----------------------+                       +-------+       +-------+       +-------+
| Cloud Firestore DB    |                       |Gemini |       |Razor- |       |SMTP / |
| (Multi-Tenant Rules)  |                       |2.5 AI |       |pay API|       |Nodem. |
+-----------------------+                       +-------+       +-------+       +-------+
            ^                                       ^               ^               ^
            | (Admin SDK Writes)                    |               |               |
            +---------------------------------------+---------------+---------------+
```

### 1.1 External Integration Topology
* **Google Gemini AI API (`gemini-2.5-flash`):** Serves as the intelligence engine for resume scoring, job fit analysis, skill roadmaps, interview question generation, promotion readiness, portfolio analysis, LinkedIn optimization, and placement drive JD parsing [`functions/src/index.ts`].
* **Razorpay Payment Gateway:** Manages B2C SaaS order creation, checkout modal triggering, and asynchronous webhook processing for plan activation (`starter` @ ₹399/mo, `pro` @ ₹599/mo) [`functions/src/payments/razorpay.ts`].
* **SMTP / Nodemailer Email Service:** Handles outbound transaction emails, including contact form notifications and system alerts [`functions/src/index.ts`].
* **Bhashini / Google Voice Services:** Provides multi-lingual speech-to-text (STT) and text-to-speech (TTS) engines for Vernacular Campus Mock Interviews in Hindi, Hinglish, and English [`functions/src/voice/provider.ts`].
* **Firebase Cloud Storage:** Stores verified student resume PDFs (`/tenants/{tenantId}/resumes/{userId}/{filename}`) and bulk zip export packages (`/exports/{tenantId}/{filename}`) [`storage.rules`].

---

## 2. Request Data-Flow Diagrams

### 2.1 AI Career Analysis Data Flow (`careerAnalysis`)

```
User (Browser)               React Component            Firebase Client         Cloud Function          Gemini API              Firestore DB
    |                               |                          |                       |                     |                       |
    |-- Input Resume/JD Text ------>|                          |                       |                     |                       |
    |   Click "Analyze"             |-- Call analysisService ->|                       |                     |                       |
    |                               |                          |-- httpsCallable ---->|                     |                       |
    |                               |                          |   ("careerAnalysis")  |                     |                       |
    |                               |                          |                       |-- Verify Token & --->|                       |
    |                               |                          |                       |   Email Verification|                       |
    |                               |                          |                       |-- Rate Limit Check ------------------------->| (ai_rate_limits)
    |                               |                          |                       |-- Inline Usage Check ------------------------>| (user_plans)
    |                               |                          |                       |-- Call Gemini API ->|                       |
    |                               |                          |                       |                     |-- Return JSON ------->|
    |                               |                          |                       |<- Parse & Validate -|                       |
    |                               |                          |                       |-- Write Result Doc ------------------------->| (analysis_results)
    |                               |                          |                       |-- Log Usage Doc ---------------------------->| (ai_usage_logs)
    |                               |<-- Return Result Data ---|<-- Response JSON -----|                     |                       |
    |<-- Display Heatmap & Guidance-|                          |                       |                     |                       |
```

**Plain Text Data Flow Summary:**
1. The user inputs resume/JD text in the UI and clicks Analyze.
2. Frontend calls `careerAnalysis` HTTPS Callable Cloud Function via Firebase SDK [`src/services/analysisService.ts`].
3. The backend validates user authentication, email verification (`email_verified == true`), rate limits (3 calls/min per user), and daily AI call limits [`functions/src/security/rateLimit.ts`].
4. The backend checks plan entitlement (`checkUsageInline`) against `user_plans` [`functions/src/index.ts`].
5. The backend dispatches structured prompt to Google Gemini 2.5 Flash API via HTTPS REST [`functions/src/index.ts`].
6. Gemini returns JSON output. Backend validates JSON structure via Zod, saves the analysis record into `analysis_results`, updates usage counters in `user_plans`, logs execution to `ai_usage_logs`, and returns payload to client.

---

### 2.2 Payment & Plan Activation Data Flow (`createPaymentOrder` + `razorpayWebhook`)

```
User (Browser)          Payment Service         Cloud Function           Razorpay API           Razorpay Webhook        Firestore DB
    |                         |                        |                      |                        |                     |
    |-- Click "Upgrade" ----->|                        |                      |                        |                     |
    |                         |-- Call Callable ------>|                      |                        |                     |
    |                         |   "createPaymentOrder" |                      |                        |                     |
    |                         |                        |-- Verify Auth ------>|                        |                     |
    |                         |                        |-- Create Order ----->|                        |                     |
    |                         |                        |   (Basic Auth)       |-- Return Order ID ---->|                     |
    |                         |                        |-- Write Doc -------------------------------------------------------->| (payment_orders)
    |                         |<-- Return Order ID ----|<-- Response JSON ----|                        |                     |
    |-- Open Razorpay Modal ->|                        |                      |                        |                     |
    |   Complete Payment      |                        |                      |                        |                     |
    |                         |---------------------------------------------->|-- Process Transaction -|                     |
    |                         |                        |                      |                        |-- Send Event ------>|
    |                         |                        |                      |                        |   (X-Razorpay-Sig)  |
    |                         |                        |                      |                        |                     |-- Verify HMAC Sig
    |                         |                        |                      |                        |                     |-- Write payment_events
    |                         |                        |                      |                        |                     |-- Update user_plans
    |<-- Close Modal (Success)-|<-- Trigger Callback ---+                      +                        +                     |
```

**Plain Text Data Flow Summary:**
1. User clicks "Upgrade" on Pricing Modal/Page. Client calls `createPaymentOrder` callable Cloud Function [`src/services/paymentService.ts`].
2. Backend authenticates user, fetches plan pricing (`starter`: ₹399, `pro`: ₹599), calls Razorpay API `/v1/orders`, creates a `payment_orders` document with status `created`, and returns `orderId` and public `keyId` [`functions/src/payments/razorpay.ts`].
3. Frontend dynamically loads Razorpay Checkout JS script (with 10s CSP fallback timer) and opens checkout modal [`src/services/paymentService.ts`].
4. User completes payment. Razorpay dispatches asynchronous HTTPS POST webhook to `/webhooks/razorpay` (`razorpayWebhook` Cloud Function).
5. Webhook function verifies HMAC-SHA256 signature against `RAZORPAY_WEBHOOK_SECRET`. On `payment.captured` event, it atomically writes a `payment_events` document for idempotency, updates `payment_orders` status to `paid`, and updates `user_plans` document to activate `starter` or `pro` tier [`functions/src/index.ts`].

---

## 3. Web Hosting & Environment Infrastructure Setup

### 3.1 Hostinger Public HTML & Apache Configuration [`public/.htaccess`]
The production frontend build is hosted on Hostinger web hosting. Navigation routing, auth redirects, and security headers are enforced via Apache `.htaccess`:

* **Single Page Application Rewrite Rule:** All requests for non-existent physical files or directories are transparently rewritten to `/index.html` [`public/.htaccess`].
* **Firebase Auth Action Redirect Rule:**
  ```apache
  RewriteRule ^/?__/auth/action(.*)$ https://aivi-career.firebaseapp.com/__/auth/action$1 [R=302,L,NE]
  ```
  This guarantees that standard Firebase password reset, email verification, and email link sign-in callbacks landing on custom domain endpoints redirect cleanly to the canonical Firebase auth action handler [`public/.htaccess`].
* **Browser Caching Directives:** Static assets (`.js`, `.css`, `.png`, `.svg`, `.webp`) are assigned immutable long-term caching (`max-age=31536000, immutable`). Dynamic `.html` files are assigned `no-cache, no-store, must-revalidate` [`public/.htaccess`].

### 3.2 Firebase Hosting Configuration [`firebase.json`]
* **Public Directory:** `dist`
* **Custom Rewrites:**
  * `/healthz` -> Cloud Function `healthz`
  * `/webhooks/razorpay` -> Cloud Function `razorpayWebhook`
  * `**` -> SPA destination `/index.html`
* **Security Headers Injected:**
  * `X-Robots-Tag`: `noindex, nofollow`
  * `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
  * `X-Content-Type-Options`: `nosniff`
  * `X-Frame-Options`: `DENY`
  * `Referrer-Policy`: `strict-origin-when-cross-origin`
  * `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`
  * `Content-Security-Policy`: Explicit whitelist allowing Razorpay (`checkout.razorpay.com`, `api.razorpay.com`), Google APIs, Google Fonts, and Bhashini speech services (`bhashini.gov.in`) [`firebase.json`].

---

## 4. Multi-Environment Topology (Staging vs Production)

The project operates under strict two-environment isolation governed by environment variables and Firebase project configs [`src/config/campusConfig.ts`]:

| Environment Property | Staging Environment | Production Environment |
| :--- | :--- | :--- |
| **Firebase Project ID** | `aivi-campus-stg` | `aivi-career` |
| **Firebase Auth Domain** | `aivi-campus-stg.firebaseapp.com` | `aivi-career.firebaseapp.com` |
| **Custom Web Domain** | `stage.aivilabs.com` (or preview URL) | `aivilabs.com` / `aivi-career.web.app` |
| **Razorpay API Keys** | Test Mode (`rzp_test_...`) | Live Mode (`rzp_live_...`) |
| **Environment Flag (`IS_STAGING`)** | `true` (Triggers visual staging banner) | `false` |
| **Robots Indexing** | Strictly Blocked (`noindex, nofollow`) | Selective Indexing (SEO Pages Allowed) |
| **Demo Campus Seeder** | Full execution permitted [`demoSeeder.ts`] | Strictly Restricted [`demoSeeder.ts`] |

Environment selection is driven at build time via Vite modes (`--mode staging` vs default production build) [`package.json`].

---

## 5. Frontend Module & Folder Structure ASCII Map

```
src/
├── ai/
│   └── prompts/            # Centralized system prompts & AI response schemas
├── assets/                 # Hero graphics & static images
├── components/
│   ├── AdminRoute.tsx      # Platform Admin guard component
│   ├── AiviLogo.tsx         # SVG Logo branding component
│   ├── AnalysisHistoryCards.tsx # Historical analysis rendering cards
│   ├── AudienceSwitcher.tsx # Role/Audience navigation toggle
│   ├── AuthShell.tsx       # Authentication page layout wrapper
│   ├── CampusRoute.tsx     # Institutional route guard wrapper
│   ├── CookieConsent.tsx   # GDPR cookie compliance popup
│   ├── DashboardSidebar.tsx# B2C Dashboard navigation sidebar
│   ├── DpdpConsentModal.tsx# Digital Personal Data Protection consent popup
│   ├── GlobalFooter.tsx    # Application footer with links & copyright
│   ├── GlobalHeader.tsx    # Navigation bar & user auth dropdown
│   ├── InsightCard.tsx     # Score breakdown & recommendation card
│   ├── NavLink.tsx         # Accessible navigation link wrapper
│   ├── PlanUsageBanner.tsx # Free/Starter plan usage warning banner
│   ├── PromoBanner.tsx     # Promotional & discount alert banner
│   ├── ProtectedRoute.tsx  # Auth & email verification route guard
│   ├── PublicPageShell.tsx # Public marketing page wrapper layout
│   ├── ScoreBar.tsx        # Horizontal score progress bar
│   ├── ScoreRing.tsx       # Circular SVG score indicator
│   ├── ScrollToTop.tsx     # Route change scroll reset handler
│   ├── TenantRoute.tsx     # Multi-tenant campus context guard
│   ├── TrialActivationModal.tsx # Free trial claim dialog
│   ├── UpgradeModal.tsx    # Plan upgrade modal with Razorpay checkout
│   ├── campus/             # Institutional B2B feature components
│   │   ├── CampusLeaderboard.tsx
│   │   ├── CampusRadixWrappers.tsx
│   │   └── DemoToolsCard.tsx
│   ├── resume/             # Drag-and-drop resume upload form
│   └── ui/                 # 40+ Shadcn/Radix UI primitive components
├── config/
│   ├── campusConfig.ts     # Master feature flags & domain whitelists
│   └── scoring_config.ts   # Client-side scoring algorithm constants
├── contexts/
│   ├── AuthContext.tsx     # Auth state, custom claims & tenant context
│   └── TenantBrandingContext.tsx # Dynamic institutional branding provider
├── hooks/
│   ├── use-mobile.tsx      # Mobile screen width detection hook
│   └── use-toast.ts        # Toast notification trigger hook
├── integrations/
│   └── firebase/
│       └── client.ts       # Firebase app, auth, db, functions init
├── layouts/
│   ├── CampusLayout.tsx    # Institutional portal sidebar & breadcrumbs
│   └── DashboardLayout.tsx # B2C SaaS dashboard navigation layout
├── pages/                  # 30+ Public, SaaS, and B2B SPA Pages
│   └── campus/             # 12 Institutional B2B Campus Pages
├── services/               # Client API & Cloud Function wrapper services
│   ├── analysisService.ts  # AI Career analysis invocation wrappers
│   ├── campusService.ts    # Placement drives, sprints & vault services
│   ├── paymentService.ts   # Razorpay checkout script & order triggers
│   ├── planService.ts      # User plan details & usage query services
│   └── tenantService.ts    # Tenant provisioning & staff management
├── test/                   # Vitest unit & integration test suites
└── utils/                  # Utility helpers (PDF parsing, CSV, scoring)
```
