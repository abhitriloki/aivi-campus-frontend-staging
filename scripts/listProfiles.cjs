const admin = require("./liveFirebaseAdmin.cjs");

const db = admin.firestore();

async function main() {
    const profiles = await db.collection("profiles").get();
    console.log(`Total profiles found: ${profiles.size}`);
    profiles.forEach(doc => {
        console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
    });
    process.exit(0);
}

main().catch(console.error);
