# AIVI System Documentation - Environment Variables

The project separates public frontend configuration from server-only secrets.

## Frontend Environment

Use `.env.local` for local development and `.env.example` as the template.

Only public Firebase browser configuration belongs in Vite variables:

```env
VITE_FIREBASE_API_KEY=replace-with-public-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:replace-with-app-id
VITE_GA_MEASUREMENT_ID=
```

These values identify the Firebase project for the browser SDK. They are not server secrets; Firestore safety comes from Firebase Auth, Firestore rules, and backend authorization.

## Backend Secrets

Server-only values must be configured through Firebase Functions secrets or Google Secret Manager.

Required:

```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

Optional:

```bash
firebase functions:secrets:set SMTP_PASSWORD
```

Runtime tuning:

```env
DAILY_AI_CALL_LIMIT=20
```

## Never Commit

- `.env`
- `.env.local`
- service account JSON files
- Google application credential JSON files
- Razorpay secrets
- Gemini keys
- SMTP passwords

Run this before deploy:

```bash
npm run security:verify
```

## Secret Rotation

See `docs/security/SECRET_ROTATION.md` for the current rotation checklist and proof commands.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
