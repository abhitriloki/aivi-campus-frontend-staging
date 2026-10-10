# Monitoring, Alerting, and Backup Runbook

## Required Production Monitoring

Enable Firebase and Google Cloud Error Reporting for Cloud Functions.

Create Cloud Logging alert policies for:

- Cloud Functions logs with `severity>=ERROR`.
- `razorpayWebhook failed`.
- `amount_mismatch` payment order status.
- Repeated `resource-exhausted` responses from AI endpoints.
- Daily AI usage above the approved launch baseline.

Enable billing alerts for:

- Firebase and Google Cloud.
- Gemini usage.
- Razorpay payment anomalies.

During launch week, review:

- `ai_usage_logs`
- `payment_events`
- `payment_orders`
- Cloud Function error logs

## Required Backup Strategy

Enable scheduled Firestore exports to a private Google Cloud Storage bucket.

Recommended cadence:

- Daily export retained for 30 days.
- Weekly export retained for 12 weeks.
- Monthly export retained for 12 months.

Minimum setup outline:

```powershell
gcloud storage buckets create gs://aivi-career-firestore-backups --location=asia-south1 --uniform-bucket-level-access
gcloud firestore export gs://aivi-career-firestore-backups/manual-prelaunch-$(Get-Date -Format yyyyMMdd)
```

Access control:

- Grant bucket access only to production admins and the Firestore service agent.
- Do not make the bucket public.
- Test restore into a non-production Firebase project before launch.

## Deployment Secrets

Firebase Functions secrets required:

- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Recommended commands:

```powershell
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
firebase functions:secrets:access GEMINI_API_KEY
```

Optional runtime config:

- `DAILY_AI_CALL_LIMIT`
- SMTP credentials if email notification delivery is enabled.

## Launch Checks

- `npm run security:verify`
- `npm run build`
- `npm --prefix functions run build`
- `npm test`
- `npm run security:audit`
- `firebase deploy --only firestore:rules,firestore:indexes,functions,hosting`
- Confirm `/healthz` returns HTTP 200 after deploy.
- Confirm Razorpay webhook URL points to `/webhooks/razorpay` or the direct Cloud Function URL.
- Confirm the Razorpay webhook secret matches `RAZORPAY_WEBHOOK_SECRET`.
