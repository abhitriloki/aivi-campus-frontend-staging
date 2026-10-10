# Database Schema — AIVI Career Intelligence Platform
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Database**: Cloud Firestore

All application data resides in Google Cloud Firestore. Every collection enforces strict Security Rules:

## Core Collection Schemas

### 1. `users/{uid}`
- `uid` (String): Primary key matching Firebase Auth UID.
- `email` (String): Candidate email address.
- `displayName` (String | Null): User name.
- `photoURL` (String | Null): Avatar URL.
- `createdAt` (Timestamp): Account creation datetime.

### 2. `user_plans/{uid}`
- `plan_type` (String): `"free"` | `"starter"` | `"pro"` | `"admin"`.
- `monthly_usage` (Integer): Count of analyses executed in the current monthly cycle.
- `trialUsed` (Boolean): Flag set to true upon consuming promotional coupons (e.g. `FIRST1000`).
- `betaExpiry` (Timestamp | Null): Expiration date for granted trial plans.
- Lifetime counters: `lifetime_resume_count`, `lifetime_jobfit_count`, `lifetime_roadmap_count`, `lifetime_interview_count`, `lifetime_promotion_count`, `lifetime_portfolio_count`, `lifetime_rebuild_count`, `lifetime_linkedin_count`, `lifetime_linkedin_opt_count`.

### 3. `user_roles/{uid}`
- `role` (String): `"admin"` | `"staff"` | `"student"`.

### 4. `system_stats/beta`
- `count` (Integer): Atomic counter tracking redemptions of the `FIRST1000` promotional coupon.

### 5. `analysis_results/{resultId}`
- Diagnostic scorecards persisted by `saveAnalysisResult`: `userId`, `analysisType`, `score`, `overallGuidance`, `structuredOutput`, `createdAt`.

### 6. `ai_usage_logs/{logId}`
- Telemetry: `user_id`, `endpoint`, `model`, `prompt_tokens`, `completion_tokens`, `timestamp`.
