const admin = require("./liveFirebaseAdmin.cjs");

const db = admin.firestore();

async function main() {
    console.log("--- Roles ---");
    const roles = await db.collection("user_roles").get();
    roles.forEach(doc => console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`));

    console.log("\n--- Plans ---");
    const plans = await db.collection("user_plans").get();
    plans.forEach(doc => console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`));

    process.exit(0);
}

main().catch(console.error);
