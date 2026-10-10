# Deployment & DevOps

AIVI is primarily hosted on Hostinger for production static files, with Firebase Hosting acting as a secondary endpoint and staging environment. Cloud Functions, Firestore rules, and Firestore indexes are deployed directly to Firebase.

## Local Verification

Run these before any deploy:

```bash
npm run security:verify
npm test
npm run build
npm --prefix functions run build
npm run security:audit
```

## Hostinger Deploy (Production Client)

1. Run `npm run build` to generate the Vite compilation in `/dist`. This copies the production static assets and [.htaccess](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/public/.htaccess) into `/dist`.
2. Ensure that `npm run security:verify` passes.
3. Compress the `/dist` directory contents into a `.zip` archive.
4. Upload this archive directly to Hostinger's web root (normally `public_html/`) for `https://www.aivilabs.com/` and extract it.

## Firebase Deploy (Backend & Staging)

To deploy backend functions, firestore rules/indexes, and staging hosting:
```bash
firebase deploy --only firestore:rules,firestore:indexes,functions,hosting
```

## Hosting Security

Security headers are configured in both [firebase.json](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/firebase.json) (for staging/routing) and [.htaccess](file:///c:/Users/abhis/OneDrive/Documents/GitHub/aivi-career/public/.htaccess) (for Hostinger):

- **HSTS (Strict-Transport-Security)**: Enforces HTTPS connections.
- **X-Content-Type-Options**: Set to `nosniff`.
- **X-Frame-Options**: Set to `DENY` to prevent clickjacking.
- **Referrer-Policy**: Set to `strict-origin-when-cross-origin`.
- **Permissions-Policy**: Restricts browser API access.
- **Content Security Policy (CSP)**: Securely configured to whitelist scripts and frames from Razorpay (`checkout.razorpay.com`), Google Identity Services (`accounts.google.com`, `apis.google.com`), and your Firebase Auth action handler.
- **Action Link Redirect**: `.htaccess` includes a rewrite rule that intercepts verification action endpoints (`/__/auth/action`) and redirects them to Firebase Hosting backend handlers maintaining query parameters, ensuring email verification doesn't fail on Hostinger.

## Post-Deploy Checks

- `/healthz` returns HTTP 200.
- Auth login and email verification work.
- Firestore rules are deployed.
- `createPaymentOrder` creates a Razorpay order with server-side pricing.
- A signed Razorpay test webhook updates `payment_events`, `payment_orders`, and `user_plans`.
- AI endpoints enforce quota and rate limits.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
