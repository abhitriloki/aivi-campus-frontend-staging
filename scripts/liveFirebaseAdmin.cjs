"use strict";

const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
let admin;
try {
    admin = require("firebase-admin");
} catch (_error) {
    admin = require(path.join(repoRoot, "functions", "node_modules", "firebase-admin"));
}

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : null;

if (credentialsPath && credentialsPath.startsWith(repoRoot + path.sep)) {
    throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS must point outside the repository. " +
        "Do not keep Firebase service account keys in this project tree."
    );
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId:
            process.env.FIREBASE_PROJECT_ID ||
            process.env.GOOGLE_CLOUD_PROJECT ||
            process.env.GCLOUD_PROJECT ||
            "aivi-career",
    });
}

module.exports = admin;
