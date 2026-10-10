# Chapter 11 — Seeded Test Accounts & QA Environment Setup
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Seeder Code & Configuration [`functions/src/demoSeeder.ts`], [`src/config/campusConfig.ts`], [`scripts/setAdmin.cjs`]

---

## 1. Seeded Demo Campus Summary

The repository includes a 1-click seeder (`runDemoSeeder`) designed to provision a complete institutional environment for manual QA testing and product demonstrations [`functions/src/demoSeeder.ts`]:

* **Demo Tenant Name:** `"Sunrise Engineering College, Lucknow"`
* **Demo Tenant Code (`tenantId`):** `"demo-sunrise"`
* **Plan Tier & Seats:** `"pro"` Plan Tier | `3000` Total Seats | `242` Seats Used
* **Demo Email Domain:** `@demo.aivilabs.com` (Non-deliverable safety domain)

---

## 2. Seeded Test Account Credentials Inventory

The seeder configures standard test accounts across all system roles [`functions/src/demoSeeder.ts`]:

| System Role | Display Name | Email Address | Default Password | Custom Claims / Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Admin** | Platform Administrator | `abhi.triloki@gmail.com` | User Configured | `{ role: "platform_admin" }` |
| **Tenant Admin (TPO)** | Dr. Alok Verma | `tpo.director@demo.aivilabs.com` | `DemoUser@2026` | `{ tenantId: "demo-sunrise", role: "tenant_admin" }` |
| **Department Coordinator**| Prof. Sunita Rao | `coordinator.cse@demo.aivilabs.com` | `DemoUser@2026` | `{ tenantId: "demo-sunrise", role: "coordinator", branchScope: ["CSE"] }` |
| **Student 1 (CSE Batch 26)**| Aarav Sharma | `student1@demo.aivilabs.com` | `DemoStudent@2026` | `{ tenantId: "demo-sunrise", role: "student" }` |
| **Student 2 (ECE Batch 26)**| Aditi Verma | `student97@demo.aivilabs.com` | `DemoStudent@2026` | `{ tenantId: "demo-sunrise", role: "student" }` |
| **Student 3 (ME Batch 26)** | Ananya Gupta | `student169@demo.aivilabs.com` | `DemoStudent@2026` | `{ tenantId: "demo-sunrise", role: "student" }` |

---

## 3. Seeder Execution & Hard-Reset Commands

### 3.1 Provision / Re-seed Demo Campus
Execute HTTPS Callable Cloud Function `seedDemoCampus` via Platform Admin Console at `/platform-admin` or via script [`functions/src/index.ts`]:
```typescript
const seedFn = httpsCallable(functions, "seedDemoCampus");
await seedFn({ confirmExisting: true });
```

### 3.2 Hard-Reset / Purge Demo Campus
Execute HTTPS Callable Cloud Function `resetDemoCampus` [`functions/src/index.ts`]:
```typescript
const resetFn = httpsCallable(functions, "resetDemoCampus");
await resetFn({ confirmPhrase: "DELETE DEMO" });
```
* **Purge Execution:** Deletes all documents in `profiles`, `employability_scores`, `placement_drives`, `drive_applications`, `resume_vault`, `mock_interviews`, `tenant_daily_stats`, and `audit_logs` where `tenantId == "demo-sunrise"`. Deletes staff Auth accounts [`functions/src/demoSeeder.ts`].

---

## 4. Test Payment Card & Checkout Sandbox Details

When testing payments in Staging environment (`IS_STAGING: true`), use Razorpay Test Mode credentials [`src/services/paymentService.ts`]:
* **Razorpay Test Key ID:** Injected automatically in Staging build mode.
* **Test Card Number:** `4111 1111 1111 1111`
* **Expiry Date:** Any future date (e.g., `12/30`)
* **CVV:** `123`
* **Test OTP:** `123456` (Triggers payment capture success callback).

---

## 5. ENVIRONMENT SAFETY BOX

> [!CAUTION]
> **STRICT SAFETY RULES FOR MANUAL QA & AUTOMATED TESTING:**
> 1. **Production Isolation:** Production Firebase project `aivi-career` must **NEVER** be targeted for destructive testing, bulk seeder resets, or mock user creation.
> 2. **Staging Environment:** All manual QA walkthroughs and seeder tests must be performed exclusively in Staging project `aivi-campus-stg` (`stage.aivilabs.com`).
> 3. **Non-Deliverable Domains:** When creating test users, always use the `@demo.aivilabs.com` domain to prevent sending emails to real individuals.
