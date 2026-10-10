# Chapter 10 — Security Rules & Plain-English Permissions Matrix
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Security Rules Manifest [`firestore.rules`], [`storage.rules`]

---

## 1. Firestore Security Rules Permissions Matrix [`firestore.rules`]

The table below provides a plain-English translation of all 32 collection security rules defined in `firestore.rules`:

| Collection Path Pattern | Unauthenticated | Verified Email User | Owner User | Tenant Student | Tenant Staff | Platform Admin | Direct Client Writes Allowed? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/tenants/{tenantId}` | Denied | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/tenant_members/{memberId}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/import_jobs/{jobId}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/placement_drives/{driveId}` | Denied | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/drive_applications/{appId}`| Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/sprints/{sprintId}` | Denied | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/sprint_enrollments/{id}` | Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/resume_vault/{versionId}` | Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/export_jobs/{exportId}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/mock_interviews/{sessionId}`| Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/acc_report_jobs/{jobId}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/billing_invoices/{id}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/campus_announcements/{id}`| Denied | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/campus_events/{id}` | Denied | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/parent_reports/{id}` | Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/audit_logs/{id}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/tenant_api_keys/{id}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/employability_scores/{uid}`| Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/tenant_daily_stats/{id}` | Denied | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/profiles/{userId}` | Denied | Denied | Read / Write | Denied | Read Scoped | Read / Write | **YES** (Owner User Write Allowed) |
| `/user_plans/{userId}` | Denied | Denied | Read Only | Denied | Read Tenant | Read Only | **NO** (Functions Admin SDK Only) |
| `/user_roles/{userId}` | Denied | Denied | Read Own | Denied | Denied | Read / Write | **NO** (Admin Write Only) |
| `/resumes/{docId}` | Denied | Denied | Full CRUD | Denied | Denied | Denied | **YES** (Owner User CRUD Allowed) |
| `/job_descriptions/{docId}` | Denied | Denied | Full CRUD | Denied | Denied | Denied | **YES** (Owner User CRUD Allowed) |
| `/analysis_results/{docId}` | Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/ai_usage_logs/{docId}` | Denied | Denied | Read Own | Read Own | Read Tenant | Read All | **NO** (Functions Admin SDK Only) |
| `/payment_orders/{docId}` | Denied | Denied | Read Own | Denied | Denied | Read All | **NO** (Functions Admin SDK Only) |

---

## 2. Cloud Storage Rules Permissions Matrix [`storage.rules`]

| Storage Path Pattern | Unauthenticated | Verified Email User | Owner User | Tenant Staff | Platform Admin | Direct Client Writes Allowed? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/tenants/{tenantId}/resumes/{userId}/{filename}` | Denied | Denied | Read Only | Read Only | Read Only | **NO** (Functions Admin SDK Only) |
| `/exports/{tenantId}/{filename}` | Denied | Denied | Denied | Read Only | Read Only | **NO** (Functions Admin SDK Only) |

---

## 3. Rules Drift & Security Mismatches ⚠️[RULES-DRIFT]

1. ⚠️[RULES-DRIFT: Client Write on Profiles]: `firestore.rules` allows direct client `write` access on `/profiles/{userId}` for owner users [`firestore.rules`]. However, Cloud Functions (`onUserSignupComplete`, `importStudentsCsv`) also modify `profiles` documents via Server Admin SDK. Care must be taken so clients cannot tamper with sensitive fields like `tenantId`, `role`, or `cgpa`.
2. ⚠️[RULES-DRIFT: Duplicate audit_logs Match Blocks]: `firestore.rules` contains two separate match declarations for `match /audit_logs/{id}` (line 207 and line 261) [`firestore.rules`]. While both enforce identical read-only permissions for staff/admin, the duplicate block should be consolidated during future refactoring.
