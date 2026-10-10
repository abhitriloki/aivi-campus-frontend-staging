# AIVI System Documentation - Beta Trial System Logic

The AIVI platform's launch strategy hinges on a controlled, low-resource beta period. We offer 1,000 users free access to the "Starter" plan for 30 days to test the AI engines and gather qualitative feedback. Because generative AI incurs direct compute costs per token, enforcing a strict cap on this trial is existentially critical.

## 1. The `applyCoupon` Cloud Function
The trial claim system bypasses all client-logic and interfaces with Firebase via the `applyCoupon` HTTPS callable function.

- **Trigger**: The user clicks "Apply" on the `TrialActivationModal.tsx` component, sending the code "FIRST1000".

## 2. Transaction-Level Explanation

To ensure concurrent claims (e.g., 50 users clicking "Apply" exactly as the counter hits 999) do not bypass the cap, the system uses a **Firestore Transaction**. A transaction ensures that if any underlying data changes during execution, the operation completely aborts and retries.

### Internal Logic Flow:
1. **Init Transaction**: `db.runTransaction(async (transaction) => { ... })`
2. **Read System Count**: 
   - `const betaRef = db.collection('system_stats').doc('beta');`
   - `const betaSnap = await transaction.get(betaRef);`
3. **Condition 1**: Does `betaSnap.data().count >= 1000`? If yes, throw Error("Beta quota exceeded").
4. **Read User Plan**:
   - `const planRef = db.collection('user_plans').doc(uid);`
   - `const planSnap = await transaction.get(planRef);`
5. **Condition 2**: Does `planSnap.data().trialUsed === true`? If yes, throw Error("Trial already consumed on this account").
6. **Mutate Data Execution Array**:
   - Calculate Expiry: `const expiry = new Date(); expiry.setDate(expiry.getDate() + 30);`
   - **Write 1**: Update User Plan. `transaction.update(planRef, { plan_type: "starter", trialUsed: true, betaExpiry: expiry });`
   - **Write 2**: Increment counter. `transaction.update(betaRef, { count: betaSnap.data().count + 1 });`
7. **Commit**: System automatically commits.

## 3. Auto-Downgrade & Expiration Logic
- **Flag**: The `betaExpiry` field is an explicit UTC timestamp.
- **Chronological Hook / Check**: While we can implement a daily chron job to sweep expired users, the more efficient route is to evaluate `betaExpiry` asynchronously on the `onCall` checks or via `App.tsx` global mount hooks.
- **Result**: Upon expiration, the status natively degenerates to `free`. Their generated reports remain permanently viewable, but the `Generate`/`Optimize` endpoints will throw `resource-exhausted` RPC errors until they provide payment.

## 4. Abuse Prevention Scenarios

| Scenario | Preventive Mechanism |
|----------|----------------------|
| **Scripted Mass Registration** | Requires valid Firebase Auth execution. While someone could script 1,000 new accounts, standard Cloud Function rate limits prevent sudden surges. Furthermore, Google reCAPTCHA v3 or Firebase AppCheck can optionally wrap this function if attack vectors are detected. |
| **Tampering Counters limit** | The user cannot spoof the API call parameters, and passing `{count: -100}` via injection fails because the function explicitly drives the incrementing logic on the server internally (`count + 1`). |
| **Double Clicks / Network Delay** | The atomic locking of transactions guarantees `trialUsed` flags are definitively true on subsequent process attempts. |

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
