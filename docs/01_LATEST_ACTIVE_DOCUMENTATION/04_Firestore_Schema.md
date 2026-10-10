# AIVI System Documentation — Firestore Database Schema
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Database**: Cloud Firestore

## 1. Collections & Data Models

### 1.1. `users/{uid}`
- `uid` (String): Firebase Auth unique ID.
- `email` (String): Registered email address.
- `displayName` (String): Full name.
- `tenantId` (String | Null): Associated college tenant (e.g. `sunrise-institute`).
- `createdAt` (Timestamp): Registration timestamp.

### 1.2. `user_plans/{uid}`
- `plan_type` (Enum String): `"free"` | `"starter"` | `"pro"` | `"admin"`.
- `monthly_usage` (Integer): Count of analyses executed in active billing month.
- `trialUsed` (Boolean): Flag set to true upon beta coupon consumption.
- `betaExpiry` (Timestamp | Null): Expiration date of granted trial tier.
- `lifetime_*_count` (Integer): Permanent lifetime counters across all tools.

### 1.3. `user_roles/{uid}`
- `role` (Enum String): `"admin"` | `"staff"` | `"tpo"` | `"faculty"` | `"student"`.

### 1.4. `profiles/{uid}`
- Student academic profile: `branch`, `cgpa`, `backlogs`, `graduatingBatch`, `placementStatus` (`"unplaced"`, `"placed"`, `"higher_studies"`, `"opted_out"`), `resumeVerified` (Boolean), `dpdpConsent` (Boolean).

### 1.5. `resume_vault/{resumeId}`
- Review queue records: `studentId`, `tenantId`, `status` (`"submitted"`, `"verified"`, `"changes_requested"`), `qrToken`, `watermarkApplied`, `reviewerNotes`, `submittedAt`.

### 1.6. `placement_drives/{driveId}`
- Corporate drives: `tenantId`, `companyName`, `roleTitle`, `ctcLpa`, `criteria` (`minCgpa`, `branches`, `maxBacklogs`), `deadline`, `status`.

### 1.7. `drive_applications/{appId}`
- Applications: `driveId`, `studentId`, `tenantId`, `appliedAt`, `status` (`"applied"`, `"shortlisted"`, `"offered"`), `offeredCtc`.

### 1.8. `sprints/{sprintId}` & `placement_sprints/{sprintId}`
- Company prep bootcamps: `tenantId`, `company`, `title`, `durationDays`, `activeStudents`, `targetRole`.

### 1.9. `accreditation_exports/{exportId}`
- NAAC/NIRF audit jobs: `tenantId`, `academicYear`, `pdfDownloadUrl`, `csvDownloadUrl`, `generatedAt`, `generatedBy`.

### 1.10. `system_stats/beta`
- Singleton counter: `count` (Integer) tracking total `FIRST1000` coupon redemptions.
