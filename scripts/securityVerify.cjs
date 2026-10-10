"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const legacyName = "supa" + "base";
const failures = [];

function fail(message) {
    failures.push(message);
}

function read(file) {
    return fs.readFileSync(path.join(repoRoot, file), "utf8");
}

function exists(relPath) {
    return fs.existsSync(path.join(repoRoot, relPath));
}

function git(args) {
    return execFileSync("git", args, {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    }).trim();
}

function walk(dir, visitor) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(repoRoot, full).replace(/\\/g, "/");
        if (entry.isDirectory()) {
            if (
                rel === ".git" ||
                rel === "node_modules" ||
                rel === "functions/node_modules" ||
                rel === "functions/lib" ||
                rel === "dist" ||
                rel === "dist-ssr"
            ) {
                continue;
            }
            walk(full, visitor);
        } else {
            visitor(full, rel);
        }
    }
}

for (const rel of [legacyName, `src/integrations/${legacyName}`, "docs/migration"]) {
    if (exists(rel)) fail(`Legacy backend path must not exist: ${rel}`);
}

for (const file of ["package.json", "package-lock.json", "functions/package.json", "functions/package-lock.json"]) {
    if (exists(file) && read(file).toLowerCase().includes(legacyName)) {
        fail(`Legacy backend dependency/reference found in ${file}`);
    }
}

const textExtensions = new Set([
    ".cjs", ".css", ".html", ".js", ".json", ".md", ".mjs", ".rules", ".toml", ".ts", ".tsx", ".txt", ".yml", ".yaml",
]);

walk(repoRoot, (full, rel) => {
    if (!textExtensions.has(path.extname(rel).toLowerCase())) return;
    const content = fs.readFileSync(full, "utf8").toLowerCase();
    if (content.includes(legacyName)) fail(`Legacy backend reference found in ${rel}`);
});

const trackedSecrets = git(["ls-files", "--", ".env", ".env.local", "service-account.json"]);
if (trackedSecrets) fail(`Secret file is tracked by git: ${trackedSecrets}`);

walk(repoRoot, (_full, rel) => {
    const lower = path.basename(rel).toLowerCase();
    if (
        lower === "service-account.json" ||
        lower.includes("service-account") ||
        lower.includes("google-application-credentials")
    ) {
        fail(`Service account credential-like file exists in repository tree: ${rel}`);
    }
});

const firebaseJson = JSON.parse(read("firebase.json"));
const hostingObj = Array.isArray(firebaseJson.hosting)
    ? firebaseJson.hosting.find(h => h.target === "default") || firebaseJson.hosting[0]
    : firebaseJson.hosting;
const headerPairs = new Map();
for (const block of hostingObj?.headers ?? []) {
    for (const header of block.headers ?? []) {
        headerPairs.set(String(header.key).toLowerCase(), String(header.value));
    }
}
for (const key of ["strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "content-security-policy"]) {
    if (!headerPairs.has(key)) fail(`Missing Firebase Hosting security header: ${key}`);
}
if (!headerPairs.get("content-security-policy")?.includes("frame-ancestors 'none'")) {
    fail("Content-Security-Policy must include frame-ancestors 'none'");
}

const rules = read("firestore.rules");
for (const invariant of [
    "match /user_plans/{userId}",
    "allow write: if false",
    "match /analysis_results/{docId}",
    "match /payment_orders/{docId}",
]) {
    if (!rules.includes(invariant)) fail(`Firestore rule invariant missing: ${invariant}`);
}

for (const script of ["scripts/setAdminLive.cjs", "scripts/verifyAndTrial.cjs", "scripts/repairUsersLive.cjs"]) {
    if (!read(script).includes("ALLOW_LIVE_ADMIN_SCRIPT")) {
        fail(`Mutating live admin script is missing break-glass gate: ${script}`);
    }
}

const functionsSource = read("functions/src/index.ts");
for (const invariant of [
    "RAZORPAY_WEBHOOK_SECRET",
    "verifyRazorpaySignature",
    "revocationEvents",
    "billing_status",
    "paid_until",
]) {
    if (!functionsSource.includes(invariant)) fail(`Payment security invariant missing from functions/src/index.ts: ${invariant}`);
}

// Ensure .firebaserc has NO default aivi-career
if (exists(".firebaserc")) {
    const rc = JSON.parse(read(".firebaserc"));
    if (rc.projects?.default) {
        fail(`.firebaserc must not contain a default project. Found: ${rc.projects.default}`);
    }
}

// Production reference scan: client code must not hardcode aivi-career
const clientCode = read("src/integrations/firebase/client.ts");
if (clientCode.includes('"aivi-career"') || clientCode.includes("'aivi-career'")) {
    // Only allowed inside explicit rejection guard
    if (!clientCode.includes('projectId === "aivi-career"')) {
        fail("src/integrations/firebase/client.ts contains hardcoded aivi-career reference outside validation guards.");
    }
}

if (failures.length) {
    console.error("Security verification failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
}

console.log("Security verification passed.");
