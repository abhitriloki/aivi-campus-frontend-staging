# AIVI System Documentation — Backend Cloud Functions v2
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Location**: `functions/src/index.ts`

All backend compute operations execute as HTTPS Callable Cloud Functions (v2) on Node.js 20.

## 1. Cloud Function Registry

### 1.1. `careerAnalysis`
- **Purpose**: Core multi-module evaluation engine.
- **Supported Modes**: `resume` (6 ATS sub-scores, weak bullets), `job_fit` (skill taxonomy & match %), `roadmap` (4-week milestones), `promotion` (level gap audit), `portfolio` (GitHub/system design check), `interview` (question bank).
- **AI Model**: `gemini-2.5-flash`.
- **Security**: Inbound data wrapped in `AI_TRUST_BOUNDARY` to prevent prompt injection. Output sanitized by `parseGeminiJson`.

### 1.2. `extractPdf`
- **Purpose**: High-fidelity multimodal PDF parsing engine.
- **Model**: `gemini-2.5-flash` multimodal vision.
- **Architecture**: Ingests base64-encoded PDF documents directly into Gemini's multimodal vision API (`mimeType: 'application/pdf'`). Circumvents traditional PDF.js text extraction failures on multi-column layouts, scanned resumes, and stylized fonts.

### 1.3. `linkedinAnalyze`
- **Purpose**: Ingests raw LinkedIn profile text and outputs Recruiter Appeal Score (0-100) and section critique.
- **Rate Limiting**: Enforces an in-memory **Sliding-Window Rate Limiter (3 requests / 60 seconds per UID)**.

### 1.4. `linkedinOptimize`
- **Purpose**: Full generative rewrite of LinkedIn Headline, About, and Experience sections based on target role.
- **Plan Gating**: Restricted server-side to Starter and Pro plan subscribers.

### 1.5. `checkUsage` & `getUserPlanInfo`
- **Purpose**: Public authenticated endpoints returning remaining monthly quotas, lifetime usage counts, active plan tier, and beta trial flags.

### 1.6. `applyCoupon`
- **Purpose**: Atomic beta trial redemption engine (e.g. `FIRST1000`).
- **Transaction**: Reads `system_stats/beta`, checks atomic count `< 1000`, updates user's `plan_type` to `starter` for 30 days, sets `trialUsed: true`, and increments counter atomically.

### 1.7. `adminUpdateUser`
- **Purpose**: Admin-only privilege management endpoint.
- **Authorization**: Guarded by `user_roles/{uid}.role === "admin"`. Allows user role elevation, quota resets, and trial lock clearing.

### 1.8. `submitContactForm`
- **Purpose**: Inbound contact and institutional demo request processor.
- **Delivery**: Transmits notifications to `hello@aivilabs.com` via Hostinger SMTP gateway with hidden honeypot validation (`name="website"`) for automated bot suppression.

### 1.9. `onUserSignupComplete`
- **Purpose**: Auth `user.onCreate` trigger. Automatically seeds `users/{uid}`, `user_plans/{uid}` (free baseline), and `user_roles/{uid}`.
