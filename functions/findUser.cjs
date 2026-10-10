process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

const admin = require("firebase-admin");
try {
    admin.initializeApp({ projectId: "demo-aivi-career" });
} catch (e) { }

const email = "abhi.triloki@gmail.com";

async function findUser() {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        console.log(`UID: ${userRecord.uid}`);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.log('User not found');
        } else {
            console.log('Error:', error);
        }
    }
}

findUser();
