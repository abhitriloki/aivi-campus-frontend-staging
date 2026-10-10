if (process.env.ALLOW_LIVE_ADMIN_SCRIPT !== "true") {
    console.error("Live admin writes are disabled. Set ALLOW_LIVE_ADMIN_SCRIPT=true only for an approved break-glass run.");
    process.exit(1);
}

const admin = require("./liveFirebaseAdmin.cjs");

const db = admin.firestore();

// ─── ARGS ────────────────────────────────────────────────────────────────────
const uid = process.argv[2];
const planFlag = process.argv.indexOf("--plan");
const planType = planFlag !== -1 ? process.argv[planFlag + 1] : null;

if (!uid) {
    console.error("\nUsage: node scripts/setAdminLive.js <UID> [--plan pro|starter|free]");
    console.error("Example: node scripts/setAdminLive.js abc123xyz --plan pro\n");
    process.exit(1);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
    const now = new Date();
    console.log(`\n🔧 Promoting UID: ${uid} in LIVE database...`);

    try {
        // 1. Update Role
        await db.collection("user_roles").doc(uid).set(
            { userId: uid, role: "admin", updatedAt: now },
            { merge: true }
        );
        console.log("  ✅ user_roles → role: admin");

        // 2. Update Plan (optional)
        if (planType) {
            await db.collection("user_plans").doc(uid).set(
                {
                    userId: uid,
                    planType,
                    plan_type: planType,
                    updatedAt: now
                },
                { merge: true }
            );
            console.log(`  ✅ user_plans → planType: ${planType}`);
        }

        // 3. Create/Update Profile (required for AdminDashboard user list)
        await db.collection("profiles").doc(uid).set(
            {
                userId: uid,
                fullName: "Admin User", // Placeholder or fetch from Auth
                updatedAt: now,
                createdAt: now
            },
            { merge: true }
        );
        console.log("  ✅ profiles → Created/Updated");

        console.log("\n✔  Success! The user is now an admin.");
        // Force simple exit
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error updating user:", error);
        process.exit(1);
    }
}

main();
