# Admin & Verification Guide

## 1. How to Make Yourself an Admin (Live)

Since the Emulator UI is not available in production, you must use the provided script.

### Prerequisites
1.  **Authenticate with application-default credentials**:
    -   Use `gcloud auth application-default login`, Workload Identity, or CI-provided credentials.
    -   If `GOOGLE_APPLICATION_CREDENTIALS` is used, the JSON key path must be outside this repository.
    -   Never save Firebase service account keys as `service-account.json` in the project root.

### Running the Script
Open your terminal and run:

```bash
# Basic Admin Promotion
ALLOW_LIVE_ADMIN_SCRIPT=true node scripts/setAdminLive.cjs <YOUR_USER_ID>

# Admin Promotion + Pro Plan
ALLOW_LIVE_ADMIN_SCRIPT=true node scripts/setAdminLive.cjs <YOUR_USER_ID> --plan pro
```

Live write scripts are disabled unless `ALLOW_LIVE_ADMIN_SCRIPT=true` is set for the current command. Use this only during an approved break-glass/admin-maintenance run.

You can find your User ID in the **Firebase Console -> Authentication** tab.

## 2. Email Verification Flow

New users will now see a verification screen upon sign-up.

1.  **User signs up** (Email/Password).
2.  **App sends verification email** automatically.
3.  **User is redirected** to `/verify-email`.
4.  **Dashboard Access** is blocked until they verify.
5.  **User clicks link** in email -> Clicks "I've Verified" in app -> Access Granted.

**Note**: Admin users bypass usage limits, but they still need a verified email to access the protected dashboard route unless we exempt them in code. (Currently, all users need verification).
