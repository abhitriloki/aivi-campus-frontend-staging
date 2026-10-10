# Technical Report: AIVI Campus OS Standalone Segregation & Subdomain Migration

**Project:** AIVI Career & Campus Operating System  
**Prepared For:** Engineering Leadership & Management  
**Date:** August 8, 2026  
**Status:** 100% Verified & Live in Production  

---

## Executive Summary

This report documents the architectural transformation of **AIVI Campus OS** from a shared route (`/for-colleges` on `aivilabs.com`) into a **100% standalone, enterprise-grade B2B platform** hosted on dedicated subdomains (`campus.aivilabs.com` and `campus.staging.aivilabs.com`).

The primary objective was achieved without breaking any existing B2C candidate functionality, without creating a secondary Firebase project, and without causing 404 errors or SSL certificate warnings on production.

---

## 1. Domain & Infrastructure Architecture

We established a 4-tier domain hierarchy on Hostinger VPS (`187.127.134.92`) managed under a single codebase and unified Firebase infrastructure.

### Subdomain Allocation Table

| Domain / Subdomain | Target Audience | Web Server Path | Environment | SSL Status |
| :--- | :--- | :--- | :--- | :--- |
| `aivilabs.com` | B2C Candidates & Freshers | `/var/www/aivi-career/html` | Production | ✅ Active |
| `www.aivilabs.com` | B2C Candidates & Freshers | `/var/www/aivi-career/html` | Production | ✅ Active |
| **`campus.aivilabs.com`** | **Universities, TPOs & Colleges** | **`/var/www/aivi-campus/html`** | **Production** | **✅ Active** |
| `staging.aivilabs.com` | B2C Staging Testbed | `/var/www/staging-aivi-career/html` | Staging | ✅ Active |
| **`campus.staging.aivilabs.com`** | **Campus OS B2B Staging Testbed** | **`/var/www/staging-aivi-campus/html`** | **Staging** | **✅ Active** |

### VPS Web Server (Nginx) & SSL Setup
1. **Nginx Site Configurations**: Created `/etc/nginx/sites-available/aivi-campus` and `/etc/nginx/sites-available/staging-aivi-campus` with fallback `try_files $uri $uri/ /index.html` to support client-side React SPA routing.
2. **Let's Encrypt Certbot Expansion**: Expanded multi-domain SAN certificates using:
   ```bash
   certbot --nginx -d aivilabs.com -d www.aivilabs.com -d campus.aivilabs.com --expand
   certbot --nginx -d staging.aivilabs.com -d campus.staging.aivilabs.com --expand
   ```
   *Result: 100% Green HTTPS padlock on all 5 domains without certificate common name warnings.*

---

## 2. Frontend Architecture & Domain Segregation

To avoid maintaining two separate codebases, we implemented a **single-codebase, domain-aware Single Page Application (SPA)** strategy.

### Key Modifications

1. **`TenantBrandingContext.tsx` (`extractSubdomainSlug`)**:
   * **Problem**: Previously, `extractSubdomainSlug` stripped `.aivilabs.com` to find college tenant identifiers (e.g. `bit.aivilabs.com` $\rightarrow$ `"bit"`). When visiting `campus.aivilabs.com`, it extracted `"campus"` and attempted to load a non-existent college tenant named `"campus"`, resulting in a `Campus Portal Not Found` screen.
   * **Solution**: Added `"campus"` to the exclusion list alongside `"www"`, `"app"`, and `"staging"`. `campus.aivilabs.com` is now recognized as the main Campus OS platform directly.

2. **Domain Helper Utility (`src/utils/domainHelper.ts`)**:
   * Built `isCampusDomain(hostname)` to detect `campus.aivilabs.com`, `campus.staging.aivilabs.com`, `campus.localhost`, and college tenant subdomains.

3. **Dynamic Root Route (`App.tsx`)**:
   * Updated the root `/` route:
     * When accessed via `campus.aivilabs.com` or `campus.staging.aivilabs.com`, it automatically renders `ForCollegesPage.tsx` (Campus OS Landing Page).
     * When accessed via `aivilabs.com`, it renders `Landing.tsx` (B2C Candidate Landing Page).

---

## 3. Dedicated B2B Header, Footer & Visual Polish

To ensure Campus OS presents a premium, human-designed corporate aesthetic for University Chancellors and TPO Directors:

1. **Official AIVI Campus Logo**:
   * Integrated the official **AIVI CAMPUS** logo (Graduation Cap on 'A' with `CAMPUS` in bright blue).
   * Converted to a 100% transparent PNG with a tight bounding box (`476x324px`).
   * Loaded via Vite module import (`import campusLogo from "@/assets/aivi-campus-logo.png"`) to generate cache-busting hashed filenames (`aivi-campus-logo-K7r7Gsvk.png`).

2. **Dedicated `CampusHeader.tsx`**:
   * Compact, sleek header bar (`h-16`).
   * Clear navigation links with smooth-scroll section offsets: `Home`, `Features`, `AI Mock Interview`, `Speech Analytics`, `NAAC / NIRF`, `Pricing`, `FAQ`.
   * High-contrast **TPO & Student Login** button (Bold white text on dark navy `#0F172A`).
   * Removed redundant B2C header links and Hero switcher toggle buttons.

3. **Dedicated `CampusFooter.tsx`**:
   * Contains DPDP Act 2023 compliance badge, Data Processing Addendum (DPA) policy links, institutional contact email (`hello@aivilabs.com`), and WhatsApp TPO helpline.

---

## 4. TPO & Student Role Security

1. **Firebase Authorized Domains**:
   * Added `campus.aivilabs.com` and `campus.staging.aivilabs.com` in Firebase Console under Authentication $\rightarrow$ Settings $\rightarrow$ Authorized Domains.

2. **TPO Command Center Authorization (`TenantRoute.tsx` & `AuthContext.tsx`)**:
   * **Problem**: Previously, `TenantRoute` only checked for `tenant_admin` and `coordinator`, redirecting TPO Directors (`placement_director`) to `/dashboard` (Student candidate view).
   * **Solution**: Updated `TenantRoute` and `AuthContext` to include `placement_director`, `tpo`, and automatic email detection (`tpo@sunrise.ac.in`, `tpo@...`, `director@...`). TPOs now land directly on the **Campus Command Center (`/campus`)**.

---

## 5. Automated Deployment & Safety Protocols

1. **Deployment Scripts**:
   * `python scripts/deploy_staging.py` $\rightarrow$ Builds `dist/` and uploads to `/var/www/staging-aivi-campus/html` on VPS.
   * `python scripts/deploy_production.py` $\rightarrow$ Builds `dist/` and uploads to `/var/www/aivi-campus/html` on VPS.

2. **Enforced Deployment Safety Rule (`.agents/rules/deployment_safety.md`)**:
   * All ongoing feature and bug fix deployments default to **Staging only**.
   * Production deployments (`deploy_production.py`) strictly require explicit user confirmation before execution.

---

## Conclusion & Verification Links

The standalone migration is complete, verified, and operational across all environments.

* **Campus OS Production**: [https://campus.aivilabs.com](https://campus.aivilabs.com)
* **Campus TPO Login**: [https://campus.aivilabs.com/campus/login](https://campus.aivilabs.com/campus/login)
* **Campus OS Staging**: [https://campus.staging.aivilabs.com](https://campus.staging.aivilabs.com)
* **B2C Candidate OS**: [https://www.aivilabs.com](https://www.aivilabs.com)
