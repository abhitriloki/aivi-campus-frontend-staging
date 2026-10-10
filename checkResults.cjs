const admin = require("./scripts/liveFirebaseAdmin.cjs");

const db = admin.firestore();

async function check() {
    const snap = await db.collection("analysis_results").orderBy("createdAt", "desc").limit(5).get();
    snap.forEach(doc => {
        console.log("DOC ID:", doc.id);
        const data = doc.data();
        console.log("Analysis Type:", data.analysisType);
        console.log("Result type:", typeof data.result);
        // Is it a string?
        if (typeof data.result === "string") {
            console.log("String Result Preview:", data.result.substring(0, 100));
        } else {
            console.log("Object Result Keys:", Object.keys(data.result || {}));
            if (data.result && data.result.overall_score !== undefined) {
                console.log("overall_score:", data.result.overall_score);
            }
        }
        console.log("---");
    });
}

check().catch(console.error);
