# AIVI Campus — Staging Deployment & Setup Runbook

This runbook guides you step-by-step to deploy **AIVI Campus** to the Firebase Staging Environment (`aivi-campus-stg`) for remote QA testing.

---

## Step 1: Firebase Authentication & Target Selection

Open your terminal in the root directory of `aivi-career` and run:

```bash
# 1. Log in to Firebase CLI
npx firebase login

# 2. Switch active CLI context to the staging project
npx firebase use staging
```

---

## Step 2: Configure Staging Cloud Functions Secrets

Set the required secrets for Cloud Functions on the staging environment (`aivi-campus-stg`). Enter secret values when prompted.

```bash
# Set Setup Token for One-Time Admin Bootstrap
npx firebase functions:secrets:set SETUP_TOKEN

# Set Gemini AI API Key
npx firebase functions:secrets:set GEMINI_API_KEY

# Set Razorpay Staging Test Secret (rzp_test_...)
npx firebase functions:secrets:set RAZORPAY_KEY_SECRET

# Set Bhashini API Credentials (Optional / Mock default available)
npx firebase functions:secrets:set BHASHINI_API_KEY
npx firebase functions:secrets:set BHASHINI_USER_ID
```

*(Optional)* Configure Mail Safety Allowlist environment variable:
```bash
npx firebase functions:config:set mail.allowlist="gmail.com,outlook.com"
```

---

## Step 3: Build Frontend SPA for Staging

Create your local `.env.staging` by copying the tracked template:
```bash
cp .env.staging.example .env.staging
```
*(Note: `.env.staging` contains local configuration and is git-ignored. Never commit real credentials).*

Build the React frontend using the `.env.staging` configuration:

```bash
npm run build:staging
```

---

## Step 4: Deploy to Firebase Staging

Deploy Hosting (with `X-Robots-Tag: noindex,nofollow`), Cloud Functions, Firestore Rules, and Storage Rules to staging:

```bash
npx firebase deploy --only hosting,functions,firestore:rules,storage:rules
```

---

## Step 5: One-Time Platform Admin Bootstrap (Staging Only)

After deployment succeeds, initialize your founder Platform Admin account by navigating to the following URL in your web browser:

```http
https://us-central1-aivi-campus-stg.cloudfunctions.net/bootstrapPlatformAdmin?email=YOUR_EMAIL@DOMAIN.COM&token=YOUR_SETUP_TOKEN
```

### Response Expected:
```text
OK — platform admin ready. Log in now.
```

> **Note**: This bootstrap endpoint **self-locks** after the first admin user is created. Subsequent calls will return `403 Refused: Platform admin is already bootstrapped and self-locked.`

---

## Step 6: Log In to Staging App & QA Portal

1. Navigate to `https://aivi-campus-stg.web.app` or `https://aivi-campus-stg.firebaseapp.com`.
2. Sign in with `YOUR_EMAIL@DOMAIN.COM`.
3. Open `/platform-admin` to access the Platform Admin Console.
4. Access `/campus-admin` to test tenant features or click **"Seed Demo Campus Data"** in Demo Tools.
