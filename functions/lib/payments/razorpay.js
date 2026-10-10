"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_PRICES_INR = void 0;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyRazorpaySignature = verifyRazorpaySignature;
const crypto_1 = require("crypto");
exports.PLAN_PRICES_INR = {
    starter: 39900,
    pro: 59900,
};
async function createRazorpayOrder(params) {
    const cleanKeyId = params.keyId.trim();
    const cleanKeySecret = params.keySecret.trim();
    const auth = Buffer.from(`${cleanKeyId}:${cleanKeySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: params.amount,
            currency: "INR",
            receipt: params.receipt,
            notes: params.notes,
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Razorpay Order Error] Status ${response.status}:`, errorText);
        throw new Error(`Razorpay order creation failed with status ${response.status}`);
    }
    return await response.json();
}
function verifyRazorpaySignature(rawBody, signature, secret) {
    if (!signature)
        return false;
    const expected = (0, crypto_1.createHmac)("sha256", secret).update(rawBody).digest("hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    const providedBuffer = Buffer.from(signature, "hex");
    return expectedBuffer.length === providedBuffer.length && (0, crypto_1.timingSafeEqual)(expectedBuffer, providedBuffer);
}
//# sourceMappingURL=razorpay.js.map