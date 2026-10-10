# Security Check Snapshot

This file is a lightweight Firebase-only security snapshot. The formal audit artifacts are in `security/`.

## Current Production Backend

| Area | Status |
| --- | --- |
| Auth | Firebase Auth |
| Database | Cloud Firestore |
| Backend | Firebase Cloud Functions |
| Hosting | Firebase Hosting |
| Payments | Razorpay |
| AI | Gemini through server-side functions |

## Key Security Controls

| Control | Status | Notes |
| --- | --- | --- |
| Secrets in repo | Improved | Service account JSON was removed from the working tree and history; exposed key was revoked. |
| Auth checks | Present | Core callable functions use verified Firebase Auth helpers. |
| Admin checks | Present | Admin actions check `user_roles/{uid}`. |
| Firestore rules | Present | Rules are in `firestore.rules`; privileged writes stay server-side. |
| Payment webhook signatures | Present | Razorpay webhook verifies `x-razorpay-signature`. |
| Payment entitlement revocation | Improved | Refund, dispute, failure, and cancellation-like events suspend/downgrade paid access. |
| Rate limiting | Present | Firestore-backed rate limits exist for public and expensive callables. |
| AI input validation | Present | Cloud Functions validate request bodies before model calls. |
| Security headers | Present | Firebase Hosting headers are configured in `firebase.json`. |

## Remaining Review Areas

- Verify Firebase Secrets are configured in production.
- Deploy current Cloud Functions after security fixes.
- Confirm Razorpay dashboard webhook events include capture, refund, dispute, failure, and cancellation-like events.
- Add automated dependency scanning to CI.
- Add a recurring backup/export procedure for Firestore.
