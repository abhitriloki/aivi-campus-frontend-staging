# Razorpay Payment Gateway Smoke Test Protocol

This document outlines the step-by-step end-to-end payment verification protocol for AIVI Career / AIVI Campus.

---

## 1. Test Key Credentials Setup
- **Staging / Local Emulator**:
  - `RAZORPAY_KEY_ID`: `rzp_test_...`
  - `RAZORPAY_KEY_SECRET`: `test_secret_...`
  - `RAZORPAY_WEBHOOK_SECRET`: `whsec_test_123`
- **Production (Hostinger + Cloud Functions)**:
  - `RAZORPAY_KEY_ID`: `rzp_live_...`
  - `RAZORPAY_KEY_SECRET`: set via `firebase secrets:set RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`: set via `firebase secrets:set RAZORPAY_WEBHOOK_SECRET`

---

## 2. Test Execution Steps

### Step A: Order Creation (`createPaymentOrder`)
1. Log in as a registered user.
2. Trigger order creation via `createPaymentOrder({ planType: "starter" })`.
3. **Expected Outcome**:
   - Returns `{ orderId: "order_...", amount: 39900, currency: "INR", keyId: "rzp_..." }`.
   - Document created in `payment_orders/{orderId}` with `status: "created"`.

### Step B: Razorpay Popup & Mock Payment
1. In test mode, use Razorpay test card:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g. `12/28`)
   - CVV: `123`
   - OTP: `1234`
2. **Expected Outcome**:
   - Payment succeeds in popup.
   - Client logs `[Checkout Success] Payment Captured: pay_...`.

### Step C: Webhook Processing (`razorpayWebhook`)
1. Razorpay posts signed webhook payload (`x-razorpay-signature`) to `https://aivi-career.firebaseapp.com/webhooks/razorpay`.
2. **Expected Outcome**:
   - Signature verified against `RAZORPAY_WEBHOOK_SECRET`.
   - Document created in `payment_events/{eventId}`.
   - `payment_orders/{orderId}` status updated to `"captured"`.
   - `user_plans/{userId}` updated: `billing_status: "active"`, `planType: "starter"`, `paid_until` set to +30 days.
   - System stats updated in `system_stats/payment_telemetry`.

### Step D: Replay Attack / Re-delivery Safety Test
1. Re-send the EXACT same webhook HTTP payload with signature.
2. **Expected Outcome**:
   - Webhook returns `200 OK` with JSON `{ status: "already_processed", message: "Event already handled" }`.
   - `user_plans` document is NOT double-extended.

### Step E: Simulated Network/CSP Failure Test
1. Block `checkout.razorpay.com` in browser DevTools Network tab.
2. Click "Upgrade to Starter".
3. **Expected Outcome**:
   - User sees clear toast: *"Razorpay checkout script failed to load. Please disable adblockers or check network/CSP settings."*
   - No infinite loading spinner.

---

## 3. Webhook CLI Smoke Verification Command
```bash
curl -X POST https://aivi-career.firebaseapp.com/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: MOCK_SIG" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test123","order_id":"order_test123","amount":39900,"currency":"INR"}}}}'
```
*(Expected output when signature is invalid: `HTTP 400 Invalid signature`)*
