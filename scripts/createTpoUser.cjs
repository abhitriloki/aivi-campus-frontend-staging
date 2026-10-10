"use strict";
const admin = require("./liveFirebaseAdmin.cjs");

async function main() {
    const auth = admin.auth();
    const db = admin.firestore();

    const tpoAccounts = [
        { email: "tpo@sunrise.ac.in", password: "DemoTpo2025!", name: "Dr. Rajesh Sharma", role: "tenant_admin" },
        { email: "tpo.director@demo.aivilabs.com", password: "AiviCampus@2026", name: "Dr. Rajesh Sharma", role: "tenant_admin" }
    ];

    for (const acc of tpoAccounts) {
        let uid;
        try {
            const user = await auth.getUserByEmail(acc.email);
            uid = user.uid;
            await auth.updateUser(uid, {
                password: acc.password,
                displayName: acc.name,
                emailVerified: true
            });
            console.log(`Updated existing user: ${acc.email} (${uid})`);
        } catch (e) {
            const created = await auth.createUser({
                email: acc.email,
                password: acc.password,
                displayName: acc.name,
                emailVerified: true
            });
            uid = created.uid;
            console.log(`Created new user: ${acc.email} (${uid})`);
        }

        // Set Custom Claims for tenant_admin role and demo-sunrise tenantId
        await auth.setCustomUserClaims(uid, {
            tenantId: "demo-sunrise",
            role: "tenant_admin"
        });

        // Set Firestore profiles document
        await db.collection("profiles").doc(uid).set({
            userId: uid,
            tenantId: "demo-sunrise",
            role: "tenant_admin",
            fullName: acc.name,
            email: acc.email,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Set user_roles document
        await db.collection("user_roles").doc(uid).set({
            userId: uid,
            role: "tenant_admin",
            tenantId: "demo-sunrise",
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    console.log("✅ Successfully created & set claims for TPO Director accounts!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Error creating TPO accounts:", err);
    process.exit(1);
});
