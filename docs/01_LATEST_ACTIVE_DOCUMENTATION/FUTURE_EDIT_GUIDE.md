# Future Edit Guide

Use this guide when changing AIVI after the Firebase cleanup.

## Add Or Edit An AI Feature

1. Add or update the prompt in `functions/src/index.ts`.
2. Add request validation in `functions/src/security/validators.ts`.
3. Enforce auth, quota, and rate limiting before model calls.
4. Add or update the frontend service wrapper in `src/services/`.
5. Persist results to Firestore only after validating ownership.
6. Run `npm --prefix functions run build` and `npm test`.

## Add A Firestore Collection

1. Define the collection shape in `docs/DATABASE_SCHEMA.md`.
2. Add reads/writes through Cloud Functions when privileged access is needed.
3. Update `firestore.rules` for any client-readable path.
4. Add admin dashboard visibility only if operationally necessary.

## Add A Payment Feature

1. Keep pricing and plan mapping server-side.
2. Create orders through `createPaymentOrder`.
3. Grant or revoke access only from signed Razorpay webhooks.
4. Store idempotency records in `payment_events`.
5. Test duplicate webhook delivery.

## Add An Admin Script

1. Prefer a Cloud Function if the operation is part of normal product behavior.
2. If a live script is necessary, require `ALLOW_LIVE_ADMIN_SCRIPT=true`.
3. Use Application Default Credentials through `scripts/liveFirebaseAdmin.cjs`.
4. Never add service account JSON files to the repository.

## Deployment Checklist

```bash
npm run build
npm --prefix functions run build
npm test
firebase deploy
```

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
