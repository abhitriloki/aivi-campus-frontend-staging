# Project Master Context

AIVI is a Firebase-first Career Intelligence OS. The active production backend is Firebase Auth, Cloud Firestore, Firebase Cloud Functions, Firebase Hosting, Gemini, and Razorpay.

## Product Surface

Primary modules:

- Resume intelligence
- Job-fit analysis
- Skill roadmap generation
- Interview preparation
- Promotion readiness
- Portfolio analysis
- Resume rebuild
- LinkedIn analysis and optimization

## Active Architecture

| Area | Production Choice |
| --- | --- |
| Auth | Firebase Auth |
| Database | Cloud Firestore |
| Backend | Firebase Cloud Functions |
| Hosting | Firebase Hosting |
| AI | Gemini through server-side functions |
| Payments | Razorpay through server-side order creation and signed webhooks |

## Source Map

| Path | Purpose |
| --- | --- |
| `src/` | React frontend. |
| `src/integrations/firebase/client.ts` | Firebase browser SDK initialization. |
| `src/services/` | Frontend service wrappers around Firebase Functions and Firestore. |
| `functions/src/` | Firebase Cloud Functions source. |
| `firestore.rules` | Firestore security rules. |
| `firebase.json` | Hosting, redirects, headers, and function routing. |
| `docs/` | Firebase-only product and technical docs. |

## Security Principles

- Do not expose server secrets to the frontend.
- Do not add direct privileged database writes from the frontend.
- Enforce auth, validation, quota, and rate limiting in Cloud Functions.
- Keep payment entitlements server-controlled.
- Keep admin scripts gated behind explicit break-glass environment variables.

## Deployment

```bash
npm run build
npm --prefix functions run build
firebase deploy
```

Server-only secrets must be configured with Firebase Secrets or the deployment platform secret manager.
