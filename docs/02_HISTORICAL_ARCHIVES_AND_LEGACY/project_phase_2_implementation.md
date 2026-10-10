# AIVI Career Intelligence - Current Implementation Context

This document replaces the older Phase 2 planning snapshot. The project is now Firebase-only and includes the recent security remediation work.

## Current Product Modules

- Resume Intelligence
- Job Fit Analysis
- Skill Roadmap
- Interview Intelligence
- Promotion Readiness
- Portfolio Analyzer
- Resume Rebuild Engine
- LinkedIn Profile Analyzer
- Admin Analytics Dashboard
- Coupon and trial system
- Razorpay payment order and webhook flow

## Current Architecture

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Auth: Firebase Auth
- Backend: Firebase Cloud Functions
- Database: Cloud Firestore
- AI: Gemini through server-side functions
- Payments: Razorpay through server-created orders and signed webhooks
- Production Web Hosting: Hostinger Apache static web hosting (https://www.aivilabs.com/)
- Staging/Routing Hosting: Firebase Hosting

## Non-Negotiable Security Rules

1. Gemini and Razorpay secrets must never be exposed to the frontend.
2. All AI calls must go through Cloud Functions.
3. Plan validation must happen before model calls.
4. Free, starter, pro, and admin access must be determined server-side.
5. Client writes to `user_plans`, payment state, analysis results, and usage logs are denied.
6. Razorpay webhook signatures must be verified before entitlement changes.
7. Refund, dispute, failed, cancelled, halted, and completed subscription-like events must suspend or downgrade access.
8. Live admin scripts require `ALLOW_LIVE_ADMIN_SCRIPT=true`.
9. The repository must remain free of service account JSON files and real `.env` secrets.
10. `npm run security:verify` must pass before deploy.

## Monetization State

Public INR pricing:

- Starter: INR 399/month
- Pro: INR 599/month

Payments use Razorpay. International provider expansion is future work and should not be documented as active until implemented.

## Verification Commands

```bash
npm run security:verify
npm test
npm run build
npm --prefix functions run build
npm run security:audit
```

## Remaining External Launch Gates

- Configure Firebase Functions secrets in production.
- Confirm Razorpay dashboard webhook events include capture, refund, dispute, failure, and cancellation-like events.
- Enable billing alerts and scheduled Firestore exports.
- Run a low-value payment smoke test.
- Verify that Google/Gmail logins and email verification action redirects are fully tested end-to-end on `https://www.aivilabs.com/`.
