# Future Roadmap

## Payments

Razorpay order creation and signed webhook handling are implemented. Future payment work should focus on:

- Subscription renewal event coverage.
- Staging webhook replay tests.
- Reconciliation dashboard for `payment_orders` and `payment_events`.
- Optional international payment provider support only after the India payment path is stable.

## SEO And Public Pages

The current app is a Vite React SPA. If SEO expansion becomes a priority:

- Move public marketing pages to SSR or static generation.
- Keep the authenticated app on the current Firebase-backed SPA path.
- Preserve Firebase Auth authorized domains during any domain split.

## AI And Product Expansion

- Personal tone profile for resume and LinkedIn rewrites.
- Saved resume versions and before/after diff.
- Application tracker.
- Enterprise dashboards for cohort analytics.
- Deeper admin observability for AI cost and plan conversion.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
