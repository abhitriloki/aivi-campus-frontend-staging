import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v2/https";

export async function enforceRateLimit(
    db: admin.firestore.Firestore,
    key: string,
    maxRequests: number,
    windowSeconds: number
): Promise<void> {
    const safeKey = key.replace(/[^a-zA-Z0-9:_-]/g, "_").substring(0, 240);
    const rateLimitRef = db.collection("rate_limits").doc(safeKey);

    await db.runTransaction(async (txn) => {
        const snap = await txn.get(rateLimitRef);
        const now = admin.firestore.Timestamp.now();
        const resetAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + windowSeconds * 1000);

        if (!snap.exists || now.toMillis() > snap.data()!.resetAt.toMillis()) {
            txn.set(rateLimitRef, { count: 1, resetAt, updatedAt: now });
            return;
        }

        const data = snap.data()!;
        if ((data.count ?? 0) >= maxRequests) {
            throw new HttpsError("resource-exhausted", "Too many requests. Please try again later.");
        }

        txn.update(rateLimitRef, {
            count: (data.count ?? 0) + 1,
            updatedAt: now,
        });
    });
}
