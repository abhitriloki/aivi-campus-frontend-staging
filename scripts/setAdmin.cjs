#!/usr/bin/env node
"use strict";
/**
 * setAdmin.cjs — Promote a user to admin role using firebase-admin pointed at the emulator.
 *
 * Usage (run from the PROJECT ROOT):
 *   cd functions && node ../scripts/setAdmin.cjs <uid>
 *   cd functions && node ../scripts/setAdmin.cjs <uid> --plan pro
 *
 * Requires: firebase emulators:start must be running
 */

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

// Run this from the functions/ dir so firebase-admin resolves from node_modules there
const admin = require("firebase-admin");

const PROJECT_ID = "demo-aivi-career";

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const uid = process.argv[2];
const planFlag = process.argv.indexOf("--plan");
const planType = planFlag !== -1 ? process.argv[planFlag + 1] : null;

if (!uid) {
    console.error("Usage: node ../scripts/setAdmin.cjs <uid> [--plan pro|starter|free]");
    process.exit(1);
}

async function main() {
    const now = new Date();
    console.log(`\n🔧 Promoting UID: ${uid}`);

    await db.collection("user_roles").doc(uid).set(
        { userId: uid, role: "admin", updatedAt: now },
        { merge: true }
    );
    console.log("  ✅ user_roles → role: admin");

    if (planType) {
        await db.collection("user_plans").doc(uid).set(
            { userId: uid, planType, plan_type: planType, updatedAt: now },
            { merge: true }
        );
        console.log(`  ✅ user_plans → planType: ${planType}`);
    }

    console.log("\n✔  Done. Sign out and back in for the UI to refresh.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌ Error:", err.message);
    console.error("   Is the Firestore emulator running? (firebase emulators:start)\n");
    process.exit(1);
});
