# Chapter 07 — Razorpay Billing, Pricing & Entitlements
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Payment Services & Cloud Functions [`src/services/paymentService.ts`], [`functions/src/payments/razorpay.ts`], [`functions/src/index.ts`]

---

## 1. B2C SaaS Plan Catalog & Pricing Structure

The B2C product offers three subscription tiers defined in backend and frontend code bases [`functions/src/payments/razorpay.ts`], [`functions/src/index.ts`]:

| Plan Tier Name | Plan Key | Price (INR / Month) | Razorpay Amount (Paise) | Analysis Limits | Restricted Features |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Free Tier** | `"free"` | ₹0 | 0 | Resume (2), Job Fit (2), Roadmap (1), Interview (1), Promotion (1), Portfolio (1) | Blocked from Resume Rebuilder & LinkedIn Optimizer |
| **Starter Tier** | `"starter"` | ₹399 / mo | 39900 paise | 30 Monthly Analyses Across All Tools | Access to Resume Rebuilder & LinkedIn Optimizer |
| **Pro Tier** | `"pro"` | ₹599 / mo | 59900 paise | **UNLIMITED** Analyses Across All Tools | Access to ALL Features + Priority AI Execution |

---

## 2. Order Creation & Public Key Usage

1. **Order Trigger (`createPaymentOrder`):** The client invokes HTTPS Callable `createPaymentOrder({ planType: "starter" | "pro" })` [`src/services/paymentService.ts`].
2. **Backend Authentication & Razorpay API Call:**
   * Function verifies caller auth (`requireVerifiedAuth`) [`functions/src/index.ts`].
   * Reads `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from Firebase environment secrets [`functions/src/payments/razorpay.ts`].
   * Dispatches HTTPS POST request to `https://api.razorpay.com/v1/orders` using Basic Authentication (`Buffer.from(keyId:keySecret)`).
   * Creates a `payment_orders/{orderId}` document in Firestore storing `userId`, `planType`, `amount`, `currency: "INR"`, `status: "created"`, `createdAt` [`functions/src/index.ts`].
   * Returns `{ orderId, amount, currency, keyId }` to the client.

3. **Client Checkout Script Ingestion:**
   * Frontend dynamically injects `<script src="https://checkout.razorpay.com/v1/checkout.js">` into document body [`src/services/paymentService.ts`].
   * Includes a 10-second CSP/Network fallback timer [`src/services/paymentService.ts`].
   * Ingests public `keyId` returned from server order call (never hardcoded in bundle).

---

## 3. Webhook Endpoint, Signature Verification & Entitlement Chain

### 3.1 Webhook Endpoint & Signature Math
* **Endpoint URL:** `https://<domain>/webhooks/razorpay` (rewritten via `firebase.json` to Cloud Function `razorpayWebhook`) [`firebase.json`].
* **Signature Header:** `X-Razorpay-Signature` [`functions/src/index.ts`].
* **HMAC Verification Code (`verifyRazorpaySignature`):**
  ```typescript
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(signature, "hex");
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
  ```
  Uses timing-safe buffer comparison to eliminate side-channel timing attacks [`functions/src/payments/razorpay.ts`].

### 3.2 Idempotency & Entitlement Activation Chain
1. Webhook reads event payload. Filters for `event == "payment.captured"`.
2. **Idempotency Check:** Checks if `payment_events/{eventId}` document exists. If exists, ignores duplicate webhook and returns HTTP 200 [`functions/src/index.ts`].
3. **Database Transactions:**
   * Writes `payment_events/{eventId}` storing payload and timestamp.
   * Updates `payment_orders/{orderId}` to `status: "paid"`.
   * Updates `user_plans/{uid}` document:
     * Sets `planType: "starter"` (or `"pro"`).
     * Sets `plan_type: "starter"` (or `"pro"`).
     * Resets `monthly_analysis_used: 0`.
     * Sets `monthly_reset_date: serverTimestamp()`.
     * Sets `paid_until: now + 30 days`.
     * Sets `billing_status: "active"`.
