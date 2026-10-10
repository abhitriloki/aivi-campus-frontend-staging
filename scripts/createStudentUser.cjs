"use strict";
const admin = require("./liveFirebaseAdmin.cjs");

async function main() {
    const auth = admin.auth();
    const db = admin.firestore();

    const studentAccount = {
        email: "student1@sunrise.ac.in",
        password: "DemoStudent@2026",
        name: "Abhishek Mishra",
        enrollmentNo: "SEC26CSE001",
        branch: "CSE",
        batch: 2026,
        tenantId: "demo-sunrise",
        role: "student"
    };

    let uid;
    try {
        const user = await auth.getUserByEmail(studentAccount.email);
        uid = user.uid;
        await auth.updateUser(uid, {
            password: studentAccount.password,
            displayName: studentAccount.name,
            emailVerified: true
        });
        console.log(`Updated existing student user: ${studentAccount.email} (${uid})`);
    } catch (e) {
        const created = await auth.createUser({
            email: studentAccount.email,
            password: studentAccount.password,
            displayName: studentAccount.name,
            emailVerified: true
        });
        uid = created.uid;
        console.log(`Created new student user: ${studentAccount.email} (${uid})`);
    }

    // Custom Claims
    await auth.setCustomUserClaims(uid, {
        tenantId: "demo-sunrise",
        role: "student"
    });

    // Firestore Profiles Document
    await db.collection("profiles").doc(uid).set({
        userId: uid,
        tenantId: "demo-sunrise",
        role: "student",
        fullName: studentAccount.name,
        email: studentAccount.email,
        enrollmentNo: studentAccount.enrollmentNo,
        branch: studentAccount.branch,
        batch: studentAccount.batch,
        cgpa: 8.8,
        placementStatus: "unplaced",
        dpdpConsent: true,
        dpdpConsentedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Firestore User Roles Document
    await db.collection("user_roles").doc(uid).set({
        userId: uid,
        role: "student",
        tenantId: "demo-sunrise",
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Firestore User Plans Document
    await db.collection("user_plans").doc(uid).set({
        userId: uid,
        planType: "pro",
        plan_type: "pro",
        trial: false,
        trialUsed: true,
        monthly_analysis_used: 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log("✅ Successfully created & set claims for Student account student1@sunrise.ac.in!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Error creating student account:", err);
    process.exit(1);
});
