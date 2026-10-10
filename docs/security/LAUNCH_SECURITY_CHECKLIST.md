# Launch Security Checklist

## Phase 0 - Emergency Fixes

- [x] Exposed Firebase service account key revoked.
- [x] Secret-bearing files removed from the active tree.
- [x] Git history rewritten and pushed after removing prior secret paths.
- [x] Live admin scripts moved to Application Default Credentials.

## Phase 1 - Pre-Production Fixes

- [x] Legacy unused backend platform code and docs removed.
- [x] Razorpay webhook verifies signatures.
- [x] Razorpay refund, dispute, failed, cancelled, halted, and completed subscription events suspend or downgrade paid access.
- [x] Server-side Razorpay order pricing enforced.
- [x] Mutating live admin scripts require `ALLOW_LIVE_ADMIN_SCRIPT=true`.
- [x] Firebase-only architecture docs regenerated.

## Phase 2 - Launch Week Fixes

- [x] `npm run security:verify` added for repeatable repository verification.
- [x] `.env.example` and `functions/.env.example` added without real secrets.
- [x] Monitoring, backup, and deployment-secret runbooks documented.
- [x] Incident response playbook updated for Firebase, AI spend, and payment abuse.
- [x] Security audit DOCX/XLSX artifacts regenerated for the Firebase-only system.

## Phase 3 - Ongoing Hardening

- [x] GitHub Actions Security CI added.
- [x] CI runs dependency install, security verification, tests, frontend build, functions build, and high-severity audits.
- [x] Secret rotation cadence documented.
- [x] Firestore backup and restore expectations documented.

## Phase 4 - Ongoing Security Practices

- [x] Automated dependency audit command added.
- [x] Repository security verification command added.
- [x] Incident-response process documented.
- [x] Secret rotation schedule documented.
- [x] Monitoring and backup runbook documented.

## External Launch Gates

These require production console access and cannot be proven from repository code alone:

- [ ] Set all Firebase Functions secrets in the production project.
- [ ] Deploy Firestore rules, indexes, functions, and hosting.
- [ ] Confirm Razorpay dashboard webhook points to the production URL.
- [ ] Confirm Razorpay dashboard sends capture, refund, dispute, failure, and cancellation-like events.
- [ ] Enable billing alerts for Firebase/GCP, Gemini, and Razorpay.
- [ ] Enable scheduled Firestore exports.
- [ ] Run a production smoke test with a low-value Razorpay test payment.
- [ ] Confirm Cloud Logging alert policies fire in staging.
- [ ] Confirm legal pages match current data collection and payment behavior.
