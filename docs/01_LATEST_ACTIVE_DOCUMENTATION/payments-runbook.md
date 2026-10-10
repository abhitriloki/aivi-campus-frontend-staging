# AIVI Career & AIVI Campus Payments Operations Runbook

This runbook outlines operational procedures, go-live checklists, key rotation, and troubleshooting steps for Razorpay payment integration.

---

## 1. Go-Live & Production Activation Checklist

- [ ] **Razorpay Merchant KYC**: Complete business KYC & bank account verification on [dashboard.razorpay.com](https://dashboard.razorpay.com).
- [ ] **Generate Live API Keys**:
  - Navigate to **Settings → API Keys → Generate Live Key**.
  - Copy `RAZORPAY_KEY_ID` (starts with `rzp_live_`) and `RAZORPAY_KEY_SECRET`.
- [ ] **Set Secret Manager Keys**:
  ```bash
  firebase secrets:set RAZORPAY_KEY_ID
  firebase secrets:set RAZORPAY_KEY_SECRET
  firebase secrets:set RAZORPAY_WEBHOOK_SECRET
  ```
- [ ] **Register Webhook Endpoint**:
  - Webhook URL: `https://aivi-career.firebaseapp.com/webhooks/razorpay` (or `https://api.aivilabs.com/webhooks/razorpay`).
  - Active Events: `payment.captured`, `order.paid`, `payment.failed`, `refund.processed`, `subscription.cancelled`.
  - Secret: Enter `RAZORPAY_WEBHOOK_SECRET`.
- [ ] **Frontend Build Key Injection**:
  - Set `VITE_RAZORPAY_KEY_ID=rzp_live_...` in production deployment environment before running `npm run build`.

---

## 2. Key Rotation Procedure

1. Generate a secondary key pair in Razorpay Dashboard.
2. Update Firebase Secrets:
   ```bash
   firebase secrets:set RAZORPAY_KEY_SECRET
   ```
3. Redeploy Firebase Functions:
   ```bash
   firebase deploy --only functions:createPaymentOrder,functions:razorpayWebhook
   ```
4. Update frontend `VITE_RAZORPAY_KEY_ID` in production CI/CD environment and rebuild SPA bundle.
5. Revoke old key pair in Razorpay Dashboard after verifying active traffic logs.

---

## 3. Test Mode Card Reference

| Test Parameter | Value |
|---|---|
| **Test Card Number** | `4111 1111 1111 1111` (Visa) / `5200 0000 0000 0000` (Mastercard) |
| **Expiry Date** | Any future date (e.g. `12/29`) |
| **CVV** | `123` |
| **OTP (Authenticating)** | `1234` |
| **UPI Virtual Payment Address (VPA)** | `success@razorpay` (Success) / `failure@razorpay` (Failure) |

---

## 4. Monitoring & Cloud Logging Alerts

- **Cloud Logging Filter for Webhook Errors**:
  `resource.type="cloud_run_revision" AND textPayload=~"razorpayWebhook failed"`
- **Failed Payment Orders Telemetry Collection**:
  Monitored in Firestore `system_stats/payment_telemetry`.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
