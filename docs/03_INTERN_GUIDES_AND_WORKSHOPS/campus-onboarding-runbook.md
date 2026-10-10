# AIVI Campus Institutional Onboarding Runbook

This document details the step-by-step procedure for provisioning and onboarding a new college/university (Training & Placement Cell) onto AIVI Campus.

---

## 1. Zero-Downtime Provisioning Architecture

Selling to a university = **PROVISIONING**, NOT deploying.
- All institutions run on the same production Firebase Cloud Functions and Firestore backend.
- Time-to-live from deal sign to students logging in is **< 60 minutes**.

---

## 2. Onboarding Workflow (5 Steps)

### Step 1: Provision Tenant in Master Console (`/campus-admin`)
1. Platform Admin logs into `/campus-admin`.
2. Click **"Provision New Campus Tenant"**.
3. Fill in:
   - **Institution Name**: e.g., *Guru Nanak Group of Institutions*
   - **Campus Code Slug**: e.g., `ggi` (URL-safe, 2-64 chars)
   - **Plan**: `starter` (1,000 seats), `pro` (3,000 seats), or `university` (custom)
   - **Allocated Seat Limit**: e.g., `1000`
   - **TPO Director Email**: `admin@ggi.ac.in`
4. Click **"Provision Institutional Portal"**.
5. System creates `tenants/ggi` document and sets custom claim `role: "tenant_admin"`, `tenantId: "ggi"` on `admin@ggi.ac.in`.

### Step 2: System Email Invitation
The TPO Director receives an automated email invitation:
- **Portal Link**: `https://aivilabs.com/campus/login/ggi`
- **Initial Setup Instructions**.

### Step 3: TPO Setup Wizard
1. TPO Director logs into `https://aivilabs.com/campus/login/ggi`.
2. Navigates to **Tenant Settings** (`/campus/settings`):
   - Uploads institutional logo PNG/SVG.
   - Configures brand primary color.
   - Defines academic year (e.g. `2025-26`) and active branches (`CSE`, `ECE`, `ME`, `EE`, `MBA`).
   - Accepts DPDP Act 2023 Consent terms.

### Step 4: CSV Student Bulk Onboarding
1. TPO Director or Coordinator navigates to **Student Import Wizard** (`/campus/import`).
2. Uploads student roster CSV file containing:
   - `fullName`, `email`, `enrollmentNo`, `branch`, `academicYear`
3. Click **"Validate & Provision Accounts"**.
4. System creates student Auth profiles with custom claim `{ tenantId: "ggi", role: "student" }`.

### Step 5: Student Portal Activation
Students receive welcome invitation emails and sign in via `https://aivilabs.com/campus/login/ggi`.

---

## 3. Vanity Custom Subdomain Architecture (V2 Note)

- **Planned Structure**: Custom domain mapping via wildcard DNS `*.aivilabs.com` and Firebase Hosting rewrites.
- **Current V1 Route**: Path-based institutional portals (`/campus/login/:tenantCode`).
- **Feature Flag**: `CAMPUS_CONFIG.CUSTOM_SUBDOMAIN_ENABLED = false` (default disabled for V1 launch).
