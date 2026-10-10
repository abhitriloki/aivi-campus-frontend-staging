if (process.env.ALLOW_LIVE_ADMIN_SCRIPT !== "true") {
    console.error("Live admin writes are disabled. Set ALLOW_LIVE_ADMIN_SCRIPT=true only for an approved break-glass run.");
    process.exit(1);
}

const admin = require("./liveFirebaseAdmin.cjs");

const db = admin.firestore();
const auth = admin.auth();

async function main() {
    console.log("🛠 Starting User Repair Script...");
    const now = new Date();
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const listUsersResult = await auth.listUsers();
    console.log(`Found ${listUsersResult.users.length} users in Auth.`);

    for (const userRecord of listUsersResult.users) {
        const uid = userRecord.uid;
        console.log(`\nChecking UID: ${uid} (${userRecord.email})`);

        const profileRef = db.collection("profiles").doc(uid);
        const profileSnap = await profileRef.get();

        if (!profileSnap.exists) {
            console.log(`  ➕ Creating missing profile...`);
            await profileRef.set({
                userId: uid,
                fullName: userRecord.displayName || "Unknown User",
                email: userRecord.email || "",
                createdAt: now,
                updatedAt: now
            });
        } else {
            console.log(`  ✅ Profile already exists.`);
        }

        const planRef = db.collection("user_plans").doc(uid);
        const planSnap = await planRef.get();
        if (!planSnap.exists) {
            console.log(`  ➕ Creating missing plan (free)...`);
            await planRef.set({
                userId: uid,
                planType: "free",
                monthlyAnalysisUsed: 0,
                monthlyResetDate: thirtyDaysLater,
                plan_type: "free",
                monthly_analysis_used: 0,
                monthly_reset_date: thirtyDaysLater,
                createdAt: now,
                updatedAt: now
            });
        }

        const roleRef = db.collection("user_roles").doc(uid);
        const roleSnap = await roleRef.get();
        if (!roleSnap.exists) {
            console.log(`  ➕ Creating missing role (user)...`);
            await roleRef.set({
                userId: uid,
                role: "user",
                createdAt: now
            });
        }
    }

    console.log("\n✔ Repair complete. Refresh your Admin Dashboard.");
    process.exit(0);
}

main().catch(console.error);
