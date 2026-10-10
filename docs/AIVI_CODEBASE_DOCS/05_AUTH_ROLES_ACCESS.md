# Chapter 05 — Auth Architecture, Roles & Access Control
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Auth Context & Guard Files [`src/contexts/AuthContext.tsx`], [`src/components/ProtectedRoute.tsx`], [`src/components/AdminRoute.tsx`], [`src/components/TenantRoute.tsx`], [`functions/src/security/auth.ts`], [`functions/src/index.ts`]

---

## 1. Authentication Architecture & Identity Model

AIVI Career Intelligence OS uses **Firebase Authentication** as its core identity provider, supporting standard Email/Password credentials and Google OAuth Single Sign-On [`src/pages/Auth.tsx`].

### 1.1 Session Persistence & Lifecycle [`src/integrations/firebase/client.ts`]
* **Persistence Mechanism:** Configured to `browserLocalPersistence`. User sessions remain active across tab closes and browser restarts until explicit logout [`src/integrations/firebase/client.ts`].
* **Email Verification Enforcement:** Email verification is enforced at both frontend and backend layers:
  * **Frontend Enforcement:** `ProtectedRoute.tsx` checks `user.emailVerified`. If `false`, the user is redirected to `/verify-email` [`src/components/ProtectedRoute.tsx`].
  * **Backend Enforcement:** `requireVerifiedAuth()` in `functions/src/security/auth.ts` fetches the user record via `admin.auth().getUser(uid)` and checks `authUser.emailVerified`. If `false`, it throws `HttpsError("permission-denied", "Email verification required.")` [`functions/src/security/auth.ts`].

---

## 2. Multi-Tenant Custom Claims Model

User permissions across B2C SaaS and B2B Institutional Campus portals are driven by Firebase Auth **Custom Claims** set on the user's JWT ID Token [`functions/src/security/auth.ts`]:

| Custom Claim Key | Data Type | Permitted Values | Purpose / Scope |
| :--- | :--- | :--- | :--- |
| `role` | `string` | `"platform_admin"`, `"group_admin"`, `"tenant_admin"`, `"coordinator"`, `"student"`, `"b2c"` | Defines global role level across SPA and security rules |
| `tenantId` | `string \| null` | Tenant Slug (e.g. `"demo-sunrise"`) or `null` | Scopes user access strictly to their assigned institution |
| `branchScope` | `string[]` | Array of Branch Slugs, e.g. `["CSE", "ECE"]` | Restricts Coordinator access to specific academic departments |

### 2.1 Claims Setting & Refresh Lifecycle [`src/contexts/AuthContext.tsx`]
1. **Setting Claims:** Claims are written server-side via Cloud Functions (`setTenantRole`, `provisionTenant`, `inviteCoordinator`, `importStudentsCsv`, `seedDemoCampus`) using `admin.auth().setCustomUserClaims(uid, { role, tenantId, branchScope })` [`functions/src/index.ts`].
2. **Propagating Claims to Client:** When claims are modified on the backend, the client must force token refresh to receive updated claims. `AuthContext.tsx` exposes `refreshTenantContext()` which executes `firebaseUser.getIdTokenResult(true)` [`src/contexts/AuthContext.tsx`].

---

## 3. Platform Admin Bootstrap Mechanism

To prevent unauthorized escalation, platform admin privileges are gated through strict bootstrap logic [`functions/src/demoSeeder.ts`], [`functions/src/security/auth.ts`]:

1. **Email Allowlist:** Backend functions check `PLATFORM_ADMIN_ALLOWLIST = ["abhi.triloki@gmail.com"]` [`functions/src/demoSeeder.ts`].
2. **Bootstrap Endpoint:** The HTTPS endpoint `bootstrapPlatformAdmin` verifies caller identity against the allowlist and applies custom claims `{ role: "platform_admin" }` [`functions/src/index.ts`].
3. **Legacy Fallback:** `isAdminUser()` in `functions/src/security/auth.ts` checks both the token claim `role == "platform_admin"` and the Firestore `user_roles/{uid}` document (`role == "admin"`) for backward compatibility [`functions/src/security/auth.ts`].

---

## 4. Role Capability Matrix

| Feature / Capability | Public User | B2C Free User | B2C Starter User | B2C Pro User | Campus Student | Tenant Coordinator | Tenant Admin | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| View Marketing & SEO Pages | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Run Resume Intelligence Scoring | No | Yes (2 Limit) | Yes (30/mo) | Yes (Unlimited) | Yes | Yes | Yes | Yes |
| Run Job Fit Analysis | No | Yes (2 Limit) | Yes (30/mo) | Yes (Unlimited) | Yes | Yes | Yes | Yes |
| Access Resume Rebuilder & LinkedIn Optimizer | No | No | Yes | Yes | Yes | Yes | Yes | Yes |
| View Campus Placement Drives | No | No | No | No | Yes | Yes | Yes | Yes |
| Apply for Placement Drives | No | No | No | No | Yes | No | No | No |
| Run AI Shortlisting & Publish Drives | No | No | No | No | No | Yes (Scoped) | Yes | Yes |
| Manage Staff & Invite Coordinators | No | No | No | No | No | No | Yes | Yes |
| Provision Tenants & Seed Demo | No | No | No | No | No | No | No | Yes |

---

## 5. Route Guard Matrix & Behavior on Unauthorized Access

| Route Group | Guard Component File | Required Role / Claims | Unauthorized Behavior |
| :--- | :--- | :--- | :--- |
| `/dashboard/*` | `ProtectedRoute.tsx` | Authenticated + `emailVerified == true` | Redirects unauth to `/auth`; redirects unverified to `/verify-email` |
| `/dashboard/admin` | `AdminRoute.tsx` | `isAdmin == true` (`platform_admin`) | Redirects non-admin users to `/dashboard` |
| `/campus/*` | `TenantRoute.tsx` | Valid `tenantId` claim & Tenant Role | Redirects non-campus users to `/campus/login` or `/dashboard` |
| `/platform-admin` | `AdminRoute.tsx` | Platform Admin (`abhi.triloki@gmail.com`)| Redirects non-admin users to `/dashboard` |
