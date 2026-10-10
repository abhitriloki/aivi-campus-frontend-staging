# Incident Handling Plan

This plan covers production incidents for the Firebase-hosted AIVI application.

## Severity Levels

| Severity | Meaning | Examples |
| --- | --- | --- |
| SEV-1 | Active data, billing, auth, or cost-impacting incident. | AI spend spike, payment entitlement abuse, exposed secret, widespread auth failure. |
| SEV-2 | Major product degradation without confirmed data or billing impact. | AI features failing, checkout failing, admin dashboard unavailable. |
| SEV-3 | Limited issue or degraded non-critical path. | Contact form email failure, analytics issue, isolated UI bug. |

## SEV-1: Secret Exposure

Immediate actions:

1. Revoke the exposed key in the provider console.
2. Disable affected Firebase Functions if abuse is ongoing.
3. Rotate dependent secrets in Firebase Secrets.
4. Run `npm run security:verify`.
5. Review Cloud Logging for unauthorized use.
6. Write a short post-incident record with timeline, blast radius, and prevention.

## SEV-1: AI Cost Spike

Immediate actions:

1. Disable or rotate `GEMINI_API_KEY`.
2. Query `ai_usage_logs` for the highest-volume UID and endpoint.
3. Temporarily lower `DAILY_AI_CALL_LIMIT` if needed.
4. Disable the abusive account in Firebase Auth if abuse is confirmed.
5. Review rate-limit and quota code before re-enabling the key.

## SEV-1: Payment Entitlement Abuse

Immediate actions:

1. Confirm Razorpay webhook signature verification is active.
2. Check `payment_events` and `payment_orders` for duplicate or mismatched events.
3. Suspend affected `user_plans/{uid}` documents.
4. Verify the Razorpay dashboard sends capture, refund, dispute, failure, and cancellation-like events.
5. Replay a signed test webhook in staging before restoring launch traffic.

## SEV-2: Auth Or Function Outage

Immediate actions:

1. Check Firebase Status Dashboard.
2. Check Cloud Function logs.
3. Verify Firebase Auth authorized domains.
4. Confirm latest deploy did not change `firebase.json`, `firestore.rules`, or function secrets unexpectedly.

## Communications

- Post a short status banner if user-facing AI or payment flows are degraded.
- Avoid disclosing sensitive technical detail while an incident is active.
- After resolution, publish only user-relevant impact and remediation.

## Post-Incident Checklist

- Root cause identified.
- Logs preserved.
- Secrets rotated if relevant.
- Tests or automation added to prevent recurrence.
- `security/` tracker and docs updated if the incident changes launch risk.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
