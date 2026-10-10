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
exports.deleteUserData = deleteUserData;
const admin = __importStar(require("firebase-admin"));
const USER_SCOPED_COLLECTIONS = [
    "analysis_results",
    "ai_usage_logs",
    "resumes",
    "job_descriptions",
    "payment_orders",
    "system_events",
];
async function deleteQuery(db, query) {
    let deleted = 0;
    while (true) {
        const snap = await query.limit(450).get();
        if (snap.empty)
            break;
        const batch = db.batch();
        snap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        deleted += snap.size;
        if (snap.size < 450)
            break;
    }
    return deleted;
}
async function deleteUserData(db, userId) {
    let deletedDocs = 0;
    for (const collection of USER_SCOPED_COLLECTIONS) {
        deletedDocs += await deleteQuery(db, db.collection(collection).where("userId", "==", userId));
    }
    const batch = db.batch();
    ["profiles", "user_plans", "user_roles"].forEach((collection) => {
        batch.delete(db.collection(collection).doc(userId));
    });
    await batch.commit();
    deletedDocs += 3;
    // DPDP Erasure Mandate: Cascade deletion to Google Cloud Storage for uploaded resumes and artifacts
    try {
        const bucket = admin.storage().bucket();
        await bucket.deleteFiles({ prefix: `resumes/${userId}/` });
        await bucket.deleteFiles({ prefix: `users/${userId}/` });
    }
    catch (storageErr) {
        console.warn(`[deleteUserData] Cloud Storage purge warning for ${userId}:`, storageErr);
    }
    await admin.auth().deleteUser(userId);
    return { deletedDocs };
}
//# sourceMappingURL=deleteAccount.js.map