# Firebase Authentication Setup Guide

Follow these steps to configure Google and LinkedIn sign-in for your application.

## 1. Google Sign-In Setup

1.  **Go to Firebase Console**: Open [console.firebase.google.com](https://console.firebase.google.com/) and select your project.
2.  **Navigate to Auth**: Click on **Build** in the left sidebar, then select **Authentication**.
3.  **Sign-in method**: Click on the **Sign-in method** tab.
4.  **Add Provider**: Click **Add new provider** and select **Google**.
5.  **Enable**: Toggle the **Enable** switch in the top right.
6.  **Support Email**: Select a project support email from the dropdown (usually your email).
7.  **Save**: Click **Save**.

> **Note**: For web applications, this is usually all you need. Firebase automatically creates a Google Cloud Project Client ID for you.

## 2. LinkedIn Sign-In Setup

This requires configuration in both the LinkedIn Developer Portal and Firebase Console.

### Part A: Firebase Console (Get Redirect URI)
1.  In Firebase Console > Authentication > Sign-in method, click **Add new provider** -> **LinkedIn**.
2.  **Enable**: Toggle the switch to Enable.
3.  **Copy Redirect URI**: Look for the **OAuth redirect URI** field (e.g., `https://YOUR-PROJECT-ID.firebaseapp.com/__/auth/handler`). **Copy this URL**.
4.  Keep this window open.

### Part B: LinkedIn Developers (Get Keys)
1.  Go to [LinkedIn Developers](https://www.linkedin.com/developers/) and sign in.
2.  Click **Create App**.
3.  **App Name**: Enter your app name (e.g., AIVI Career).
4.  **LinkedIn Page**: You need to link a company page (create a dummy one if needed).
5.  **Logo**: Upload a logo.
6.  Once created, go to the **Auth** tab.
7.  **OAuth 2.0 settings**: Find "Authorized redirect URLs for your app".
8.  **Paste Redirect URI**: Click "Edit" and paste the link you copied from Firebase (Step A-3). Click **Update**.
9.  **Credentials**: On the same page (or under "Auth"), find **Client ID** and **Client Secret**. Copy these.

### Part C: Finish in Firebase
1.  Go back to the Firebase Console window.
2.  **Paste Keys**: Paste the **Client ID** and **Client Secret** from LinkedIn into the respective fields.
3.  **Save**: Click **Save**.

## 3. Add Authorized Domains

This ensures your app allows sign-ins only from trust sources.

1.  In Firebase Console > Authentication, click the **Settings** tab.
2.  Select **Authorized domains**.
3.  Click **Add domain**.
4.  Add the following:
    - `localhost` (should be there by default)
    - `127.0.0.1` (optional, good for local dev)
    - Your production domain (e.g., `aivi-career.web.app` or `your-custom-domain.com`).

## 4. Verification
1.  Restart your local development server.
2.  Go to the Login page (`/auth`).
3.  Click "Continue with Google". A popup should appear allowing you to sign in.
4.  If it fails, check the browser console for specific error messages (usually "Client ID not authorized" or "Domain not authorized").

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
