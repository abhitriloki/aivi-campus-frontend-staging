# 20: AIVI Campus Standalone Subdomain Architecture & Segregation Guide

**Project:** AIVI Career & Campus Operating System  
**Prepared For:** Engineering Leadership, DevOps & Management  
**Date:** August 8, 2026  
**Status:** 100% Verified & Live in Production  

---

## Executive Summary

This document details the complete technical implementation for transforming **AIVI Campus OS** from a shared route (`/for-colleges` on `aivilabs.com`) into a **100% standalone B2B enterprise platform** hosted on dedicated subdomains (`campus.aivilabs.com` and `campus.staging.aivilabs.com`).

All changes were implemented under a **single React/TypeScript codebase** and a **unified Firebase project**, guaranteeing zero breaking changes to existing B2C candidate workflows (`aivilabs.com`).

---

## 1. Domain & Infrastructure Topology

We established a 4-tier domain hierarchy on Hostinger VPS (`187.127.134.92`).

### Subdomain Allocation Matrix

| Domain / Subdomain | Target Audience | Hostinger VPS Web Server Path | Environment | SSL Status |
| :--- | :--- | :--- | :--- | :--- |
| `aivilabs.com` | B2C Candidates & Job Seekers | `/var/www/aivi-career/html` | Production | ✅ Active |
| `www.aivilabs.com` | B2C Candidates & Job Seekers | `/var/www/aivi-career/html` | Production | ✅ Active |
| **`campus.aivilabs.com`** | **Universities, TPOs & Colleges** | **`/var/www/aivi-campus/html`** | **Production** | **✅ Active** |
| `staging.aivilabs.com` | B2C Staging Testbed | `/var/www/staging-aivi-career/html` | Staging | ✅ Active |
| **`campus.staging.aivilabs.com`** | **Campus OS B2B Staging Testbed** | **`/var/www/staging-aivi-campus/html`** | **Staging** | **✅ Active** |

### VPS Nginx Configuration & Let's Encrypt SSL
* **Nginx Sites**: Created `/etc/nginx/sites-available/aivi-campus` and `/etc/nginx/sites-available/staging-aivi-campus` with fallback `try_files $uri $uri/ /index.html`.
* **Let's Encrypt Certbot Expansion**: Expanded multi-domain SAN certificates using:
  ```bash
  certbot --nginx -d aivilabs.com -d www.aivilabs.com -d campus.aivilabs.com --expand
  certbot --nginx -d staging.aivilabs.com -d campus.staging.aivilabs.com --expand
  ```

---

## 2. Frontend Architecture & Domain-Aware Routing

1. **`TenantBrandingContext.tsx` (`extractSubdomainSlug`)**:
   * Updated `extractSubdomainSlug` to ignore `"campus"` alongside `"www"`, `"app"`, and `"staging"`.
   * Prevents `campus.aivilabs.com` from attempting to query a non-existent college tenant named `"campus"` in Firestore.

2. **Domain Helper Utility (`src/utils/domainHelper.ts`)**:
   * Helper `isCampusDomain(hostname)` detects `campus.aivilabs.com`, `campus.staging.aivilabs.com`, `campus.localhost`, and college tenant subdomains.

3. **Dynamic Root Route (`App.tsx`)**:
   * Root `/` route dynamically switches layout:
     * On `campus.` domains $\rightarrow$ renders `ForCollegesPage.tsx` with dedicated B2B header/footer.
     * On `aivilabs.com` $\rightarrow$ renders `Landing.tsx` for B2C candidates.

---

## 3. Dedicated B2B Header, Footer & Branding Assets

1. **Official AIVI Campus Logo (`/aivi-campus-logo.png`)**:
   * 100% transparent PNG with a tight bounding box (`476x324px`) around the graduation cap and text mark.
   * Imported via Vite module import (`import campusLogo from "@/assets/aivi-campus-logo.png"`) to generate cache-busting hashed filenames.

2. **Dedicated `CampusHeader.tsx`**:
   * Compact, sleek header bar (`h-16`).
   * Smooth-scroll section navigation: `Home`, `Features`, `AI Mock Interview`, `Speech Analytics`, `NAAC / NIRF`, `Pricing`, `FAQ`.
   * High-contrast **TPO & Student Login** button (Bold white text on dark navy `#0F172A`).

3. **Dedicated `CampusFooter.tsx`**:
   * Institutional desk contact details (`hello@aivilabs.com`, WhatsApp TPO helpline).
   * DPDP Act 2023 compliance badge & Data Processing Addendum (DPA) policy links.

---

## 4. TPO & Student Role Authorization

1. **Firebase Authorized Domains**:
   * Added `campus.aivilabs.com` and `campus.staging.aivilabs.com` in Firebase Console under Authentication $\rightarrow$ Settings $\rightarrow$ Authorized Domains.

2. **TPO Command Center Authorization (`TenantRoute.tsx` & `AuthContext.tsx`)**:
   * Authorized `placement_director`, `tpo`, `tenant_admin`, and `coordinator` roles to access `/campus`.
   * Added automatic email detection (`tpo@sunrise.ac.in`, `tpo@...`, `director@...`) so TPOs land directly on the **Campus Command Center (`/campus`)**.

---

## 5. Deployment Safety Protocols

* Created **`.agents/rules/deployment_safety.md`**:
  * Default builds deploy **ONLY to Staging** (`python scripts/deploy_staging.py`).
  * Deployments to Production (`python scripts/deploy_production.py`) require explicit user confirmation.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
