# Business Logic

AIVI business logic is implemented in Firebase Cloud Functions and Firestore.

## Plans

| Plan | Purpose |
| --- | --- |
| `free` | Limited trial usage and restricted premium features. |
| `starter` | Paid or trial-backed monthly quota. |
| `pro` | Higher/unlimited paid access, depending on feature. |
| `admin` | Internal bypass for operations and testing. |

Plan state is stored in `user_plans/{uid}`. Role state is stored in `user_roles/{uid}`.

## Quota Enforcement

Usage is checked and incremented server-side in `functions/src/index.ts` before AI calls. Free users are limited by lifetime counters; paid plans use monthly counters.

## Trial System

The `FIRST1000` campaign is handled by `applyCoupon`. Trial activation updates the user's plan document and records operational events.

## AI Analysis

AI modules call Gemini through Firebase Cloud Functions only. The frontend should not call model providers directly.

Core AI entry points:

- `careerAnalysis`
- `extractPdf`
- `linkedinAnalyze`
- `linkedinOptimize`

## Payments

Payment orders are created by `createPaymentOrder`. Prices are defined server-side in `functions/src/payments/razorpay.ts`.

Paid access is granted only after a signed Razorpay `payment.captured` webhook. Refund, dispute, failed, cancelled, halted, and completed subscription events suspend or downgrade paid access.

## Admin Operations

Admin updates go through `adminUpdateUser` or explicitly gated live scripts. Mutating live scripts require `ALLOW_LIVE_ADMIN_SCRIPT=true`.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
