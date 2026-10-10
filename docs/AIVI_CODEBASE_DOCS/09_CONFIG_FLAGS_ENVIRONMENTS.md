# Chapter 09 — Configuration Flags & Environments Inventory
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Configuration & Env Files [`src/config/campusConfig.ts`], [`.env.example`], [`functions/.env.example`], [`firebase.json`]

---

## 1. Feature Flags & Kill-Switch Inventory [`src/config/campusConfig.ts`]

The application includes a master configuration toggle system in `src/config/campusConfig.ts` to allow instant feature rollbacks and institutional module gating:

| Feature Flag Key | Default Value | Gated Capabilities / System Effect | System Effect If Flipped to `false` |
| :--- | :---: | :--- | :--- |
| `CAMPUS_ENABLED` | `true` | Master kill-switch for all B2B Institutional Campus OS features | Institutional routes fallback gracefully without breaking B2C SaaS |
| `MODULE_FLAGS.core_ai` | `true` | Gates core Gemini AI analysis engine | Disables AI analysis calls; returns offline fallback state |
| `MODULE_FLAGS.drives` | `true` | Gates Placement Drives management and shortlisting | Hides Placement Drives tab and disables drive APIs |
| `MODULE_FLAGS.sprints` | `true` | Gates Placement Prep Sprints and daily tasks | Hides Sprints tab and disables sprint enrollment |
| `MODULE_FLAGS.voice_hi` | `true` | Gates Hindi & Hinglish Vernacular Voice Mock Interviews | Hides voice toggle; defaults mock interviews to English text mode |
| `MODULE_FLAGS.vault` | `true` | Gates Campus Resume Vault and QR verification | Hides Resume Vault tab and disables QR seal verification |
| `MODULE_FLAGS.accreditation` | `true` | Gates NAAC / NIRF Accreditation Report exports | Hides Accreditation tab and disables export jobs |
| `MODULE_FLAGS.sso` | `true` | Gates Single Sign-On and institutional domain login | Hides branded SSO login buttons |
| `MODULE_FLAGS.api` | `true` | Gates Institutional REST API access keys | Revokes external API access |
| `MODULE_FLAGS.parent_reports` | `true` | Gates Parent Progress Report generation and public link | Disables parent report sharing links |

---

## 2. Environment Variables Inventory

### 2.1 SPA Frontend Variables (`.env.example`)
* `VITE_FIREBASE_API_KEY`: Public Firebase browser API key [`src/integrations/firebase/client.ts`].
* `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth domain (`aivi-career.firebaseapp.com` or `aivi-campus-stg.firebaseapp.com`).
* `VITE_FIREBASE_PROJECT_ID`: Firebase project ID identifier (`aivi-career` or `aivi-campus-stg`).
* `VITE_FIREBASE_STORAGE_BUCKET`: Storage bucket URL (`aivi-career.appspot.com`).
* `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase Cloud Messaging sender ID.
* `VITE_FIREBASE_APP_ID`: Firebase Web Application identifier string.
* `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 Measurement ID.

### 2.2 Backend Functions Secrets (`functions/.env.example`)
* `GEMINI_API_KEY`: Server-only secret key for Google Gemini 2.5 Flash API [`functions/src/index.ts`].
* `RAZORPAY_KEY_ID`: Razorpay Public API key ID (`rzp_live_...` or `rzp_test_...`) [`functions/src/payments/razorpay.ts`].
* `RAZORPAY_KEY_SECRET`: Server-only secret key for Razorpay order creation [`functions/src/payments/razorpay.ts`].
* `RAZORPAY_WEBHOOK_SECRET`: Server-only secret key for Razorpay webhook HMAC validation [`functions/src/index.ts`].
* `DAILY_AI_CALL_LIMIT`: Runtime tuning variable setting daily max AI calls per user (Default: `20`) [`functions/src/index.ts`].
