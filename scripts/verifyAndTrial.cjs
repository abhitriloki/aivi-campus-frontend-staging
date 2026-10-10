if (process.env.ALLOW_LIVE_ADMIN_SCRIPT !== "true") {
    console.error("Live admin writes are disabled. Set ALLOW_LIVE_ADMIN_SCRIPT=true only for an approved break-glass run.");
    process.exit(1);
}

const admin = require("./liveFirebaseAdmin.cjs");

const auth = admin.auth();
const db = admin.firestore();
const email = process.argv[2];

if (!email) {
    console.error("Usage: node scripts/verifyAndTrial.cjs <EMAIL>");
    process.exit(1);
}

async function main() {
    console.log(`\n🔍 Finding user by email: ${email}...`);

    try {
        const userRecord = await auth.getUserByEmail(email);
        const uid = userRecord.uid;
        console.log(`✅ Found UID: ${uid}`);

        // 1. Manually verify email
        await auth.updateUser(uid, { emailVerified: true });
        console.log(`✅ Email verified for ${email}`);

        // 2. Fetch current plan
        const planRef = db.collection("user_plans").doc(uid);
        const planSnap = await planRef.get();

        const mode = process.argv[3] || "verify"; // verify, activate_trial, expire_trial, max_usage

        if (mode === "activate_trial") {
            const now = admin.firestore.Timestamp.now();
            const expiresAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + 30 * 24 * 60 * 60 * 1000);
            await planRef.update({
                planType: "starter",
                plan_type: "starter",
                trial: true,
                trialExpiresAt: expiresAt,
                trialUsed: true,
                couponCode: "FIRST1000",
                updatedAt: now
            });
            console.log("✅ Trial ACTIVATED for 30 days.");
        } else if (mode === "expire_trial") {
            const pastDate = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
            await planRef.update({
                trialExpiresAt: pastDate,
                updatedAt: admin.firestore.Timestamp.now()
            });
            console.log("✅ Trial EXPIRED (set to 1 day ago).");
        } else if (mode === "max_usage") {
            await planRef.update({
                monthly_analysis_used: 30,
                updatedAt: admin.firestore.Timestamp.now()
            });
            console.log("✅ Usage set to MAX (30/30).");
        }

        const updatedSnap = await planRef.get();
        console.log("\nFinal Plan Document:", updatedSnap.data());

        console.log("\n🚀 Script mode completed.");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }

    process.exit(0);
}

main();
