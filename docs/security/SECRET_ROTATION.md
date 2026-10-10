# Secret Rotation Checklist

## Completed Containment

- The exposed Firebase service account key was revoked in Google Cloud.
- Local git history was rewritten to remove prior `.env`, `.env.local`, and service account JSON paths.
- The cleaned `main` history was force-pushed to GitHub.
- Repository scripts now use Application Default Credentials and reject credential JSON files stored inside the repository tree.

## Required Before Production Traffic

Rotate or confirm rotation for every value that may have existed in historical local env files:

- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- SMTP credentials, if configured
- Any Firebase Admin SDK private keys ever generated for local use

## Proof Commands

```powershell
git ls-files -- .env .env.local service-account.json
git log --all --name-only --pretty=format:%H -- .env .env.local service-account.json
npm run security:verify
```

Expected result:

- The first two git commands return no secret paths.
- `npm run security:verify` passes.

## Long-Term Rotation Cadence

- Rotate payment and AI provider keys at least every 90 days.
- Rotate immediately after staff offboarding, suspected workstation compromise, or accidental disclosure.
- Prefer Firebase Secrets or Google Secret Manager for all server-side values.
- Do not create long-lived service account JSON keys unless there is no viable workload-identity or application-default-credential option.
