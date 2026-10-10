import * as admin from "firebase-admin";

const USER_SCOPED_COLLECTIONS = [
    "analysis_results",
    "ai_usage_logs",
    "resumes",
    "job_descriptions",
    "payment_orders",
    "system_events",
];

async function deleteQuery(db: admin.firestore.Firestore, query: admin.firestore.Query): Promise<number> {
    let deleted = 0;

    while (true) {
        const snap = await query.limit(450).get();
        if (snap.empty) break;

        const batch = db.batch();
        snap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        deleted += snap.size;

        if (snap.size < 450) break;
    }

    return deleted;
}

export async function deleteUserData(db: admin.firestore.Firestore, userId: string): Promise<{ deletedDocs: number }> {
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
    } catch (storageErr) {
        console.warn(`[deleteUserData] Cloud Storage purge warning for ${userId}:`, storageErr);
    }

    await admin.auth().deleteUser(userId);
    return { deletedDocs };
}
