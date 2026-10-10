import { createHmac, timingSafeEqual } from "crypto";

export const PLAN_PRICES_INR = {
    starter: 39900,
    pro: 59900,
} as const;

export type PaidPlanType = keyof typeof PLAN_PRICES_INR;

export async function createRazorpayOrder(params: {
    keyId: string;
    keySecret: string;
    amount: number;
    receipt: string;
    notes: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string; receipt: string; status: string }> {
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

    return await response.json() as {
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
    };
}

export function verifyRazorpaySignature(rawBody: Buffer, signature: string | undefined, secret: string): boolean {
    if (!signature) return false;

    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    const providedBuffer = Buffer.from(signature, "hex");

    return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer);
}
