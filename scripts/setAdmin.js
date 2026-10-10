#!/usr/bin/env node
/**
 * setAdmin.js — Promote a Firebase Auth user to admin role in the Firestore emulator.
 *
 * Usage:
 *   node scripts/setAdmin.js <uid>
 *   node scripts/setAdmin.js <uid> --plan pro
 *
 * Prerequisites:
 *   - Firebase emulator must be running (firebase emulators:start)
 *   - Run from the project root: node scripts/setAdmin.js YOUR_UID_HERE
 *
 * To find a user's UID:
 *   Open Firebase Emulator UI → http://localhost:4000 → Authentication tab
 *   Copy the UID from the user list.
 */

const http = require("http");

const PROJECT_ID = "demo-aivi-career"; // Must match firebase.json emulator projectId
const FIRESTORE_HOST = "localhost";
const FIRESTORE_PORT = 8080;

const uid = process.argv[2];
const planFlag = process.argv.indexOf("--plan");
const planType = planFlag !== -1 ? process.argv[planFlag + 1] : null;

if (!uid) {
    console.error("Usage: node scripts/setAdmin.js <uid> [--plan pro|starter|free]");
    process.exit(1);
}

// ─── Firestore REST helpers ──────────────────────────────────────────────────

function firestorePatch(collection, docId, fields) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ fields });
        const path = `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

        const req = http.request(
            {
                hostname: FIRESTORE_HOST,
                port: FIRESTORE_PORT,
                path,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                },
            },
            (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            }
        );
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

function str(value) {
    return { stringValue: value };
}

function ts(date) {
    return { timestampValue: date.toISOString() };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    const now = new Date();

    console.log(`\n🔧 Promoting UID: ${uid}`);

    // 1. Set role → admin
    await firestorePatch("user_roles", uid, {
        userId: str(uid),
        role: str("admin"),
        updatedAt: ts(now),
    });
    console.log("  ✅ user_roles → role: admin");

    // 2. Optionally set plan
    if (planType) {
        await firestorePatch("user_plans", uid, {
            plan_type: str(planType),
            planType: str(planType),
            updatedAt: ts(now),
        });
        console.log(`  ✅ user_plans → plan_type: ${planType}`);
    }

    console.log("\n✔  Done. Admin privileges are active immediately.");
    console.log("   Sign out and sign back in for the UI to reflect the change.\n");
}

main().catch((err) => {
    console.error("\n❌ Error:", err.message);
    console.error(
        "   Is the Firestore emulator running on port 8080? (firebase emulators:start)\n"
    );
    process.exit(1);
});
