"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceRateLimit = enforceRateLimit;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
async function enforceRateLimit(db, key, maxRequests, windowSeconds) {
    const safeKey = key.replace(/[^a-zA-Z0-9:_-]/g, "_").substring(0, 240);
    const rateLimitRef = db.collection("rate_limits").doc(safeKey);
    await db.runTransaction(async (txn) => {
        const snap = await txn.get(rateLimitRef);
        const now = admin.firestore.Timestamp.now();
        const resetAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + windowSeconds * 1000);
        if (!snap.exists || now.toMillis() > snap.data().resetAt.toMillis()) {
            txn.set(rateLimitRef, { count: 1, resetAt, updatedAt: now });
            return;
        }
        const data = snap.data();
        if ((data.count ?? 0) >= maxRequests) {
            throw new https_1.HttpsError("resource-exhausted", "Too many requests. Please try again later.");
        }
        txn.update(rateLimitRef, {
            count: (data.count ?? 0) + 1,
            updatedAt: now,
        });
    });
}
//# sourceMappingURL=rateLimit.js.map