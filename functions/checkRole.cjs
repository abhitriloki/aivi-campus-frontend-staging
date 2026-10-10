const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
admin.initializeApp({ projectId: "demo-aivi-career" });
const db = admin.firestore();

const uid = "KZYd3Za19fbZbtaBsdMzwLMOMmRZ";

async function checkRole() {
    const doc = await db.collection("user_roles").doc(uid).get();
    console.log("Current Check:");
    console.log(doc.data());
}

checkRole();
