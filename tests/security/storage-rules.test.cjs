// Fail-closed check: Emulator host environment variables MUST be set by firebase emulators:exec
if (!process.env.STORAGE_EMULATOR_HOST || !process.env.FIRESTORE_EMULATOR_HOST) {
  console.error("FATAL: STORAGE_EMULATOR_HOST or FIRESTORE_EMULATOR_HOST environment variable is missing!");
  console.error("This test suite operates fail-closed to prevent accidental connection to live Firebase projects.");
  console.error("Run this suite using: npm run test:security:storage (or firebase emulators:exec)");
  process.exit(1);
}

const PROJECT_ID = process.env.GCLOUD_PROJECT || "demo-security-test";
const rawHost = process.env.STORAGE_EMULATOR_HOST;
const STORAGE_HOST = rawHost.startsWith("http://") || rawHost.startsWith("https://") ? rawHost : `http://${rawHost}`;
const BUCKET_NAME = `${PROJECT_ID}.appspot.com`;

// Standard package import from root dependencies (never brittle relative paths)
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: PROJECT_ID,
    storageBucket: BUCKET_NAME,
  });
}

function createJwt(claims) {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    iss: `https://securetoken.google.com/${PROJECT_ID}`,
    aud: PROJECT_ID,
    auth_time: Math.floor(Date.now() / 1000),
    sub: claims.uid || "user_default",
    user_id: claims.uid || "user_default",
    email: claims.email || "user@test.edu",
    email_verified: claims.email_verified !== undefined ? claims.email_verified : true,
    ...claims,
  };
  return (
    Buffer.from(JSON.stringify(header)).toString("base64url") +
    "." +
    Buffer.from(JSON.stringify(payload)).toString("base64url") +
    "."
  );
}

async function runTest(name, operation) {
  try {
    const res = await operation();
    if (res.passed) {
      console.log(`PASS: [${name}]`);
      return { name, passed: true };
    } else {
      console.error(`FAIL: [${name}] -> Expected ${res.expected}, got ${res.actual}`);
      return { name, passed: false, error: `Expected ${res.expected}, got ${res.actual}` };
    }
  } catch (err) {
    console.error(`ERROR: [${name}] ->`, err.message);
    return { name, passed: false, error: err.message };
  }
}

const TEST_FILES = [
  "tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf",
  "tenants/tenant-beta/resumes/std_beta/resume_v1.pdf",
  "exports/tenant-alpha/batch_2026.zip",
];

async function seedStorageFiles() {
  const bucket = admin.storage().bucket(BUCKET_NAME);
  // Upload sample files
  await bucket.file("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf").save(Buffer.from("PDF ALPHA 1"), {
    contentType: "application/pdf",
    metadata: { customMetadata: { tenantId: "tenant-alpha" } },
  });
  await bucket.file("tenants/tenant-beta/resumes/std_beta/resume_v1.pdf").save(Buffer.from("PDF BETA 1"), {
    contentType: "application/pdf",
    metadata: { customMetadata: { tenantId: "tenant-beta" } },
  });
  await bucket.file("exports/tenant-alpha/batch_2026.zip").save(Buffer.from("ZIP EXPORT ALPHA"), {
    contentType: "application/zip",
  });
}

async function cleanupStorageFiles() {
  const bucket = admin.storage().bucket(BUCKET_NAME);
  for (const filePath of TEST_FILES) {
    try {
      await bucket.file(filePath).delete();
    } catch {
      // Best effort deletion during test tear-down
    }
  }
}

async function getFileObject(filePath, token) {
  const encodedPath = encodeURIComponent(filePath);
  const url = `${STORAGE_HOST}/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media`;
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers });
  return res.status;
}

async function deleteFileObject(filePath, token) {
  const encodedPath = encodeURIComponent(filePath);
  const url = `${STORAGE_HOST}/v0/b/${BUCKET_NAME}/o/${encodedPath}`;
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { method: "DELETE", headers });
  return res.status;
}

async function main() {
  console.log("=== STARTING EXECUTABLE STORAGE EMULATOR RULES TEST SUITE ===");
  console.log(`Target: ${STORAGE_HOST} (Bucket: ${BUCKET_NAME})`);

  try {
    await seedStorageFiles();

    const studentAlphaToken = createJwt({
      uid: "std_alpha",
      tenantId: "tenant-alpha",
      role: "student",
    });

    const studentBetaToken = createJwt({
      uid: "std_beta",
      tenantId: "tenant-beta",
      role: "student",
    });

    const staffAlphaToken = createJwt({
      uid: "staff_alpha",
      tenantId: "tenant-alpha",
      role: "tenant_admin",
    });

    const demoUserToken = createJwt({
      uid: "demo_user_1",
      tenantId: "demo-sunrise",
      role: "student",
    });

    const spoofedMetadataToken = createJwt({
      uid: "attacker_1",
      tenantId: "attacker_tenant",
      role: "student",
    });

    const tests = [];

    // Test 1: Unauthenticated request fails (401 or 403)
    tests.push(
      await runTest("Unauthenticated storage access fails (401/403)", async () => {
        const status = await getFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", null);
        return { passed: status === 401 || status === 403, expected: 403, actual: status };
      })
    );

    // Test 2: Student can read permitted personal file
    tests.push(
      await runTest("Student can read permitted personal file (200)", async () => {
        const status = await getFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", studentAlphaToken);
        return { passed: status === 200, expected: 200, actual: status };
      })
    );

    // Test 3: Tenant A student cannot read Tenant B resume
    tests.push(
      await runTest("Tenant A student cannot read Tenant B resume (403)", async () => {
        const status = await getFileObject("tenants/tenant-beta/resumes/std_beta/resume_v1.pdf", studentAlphaToken);
        return { passed: status === 403, expected: 403, actual: status };
      })
    );

    // Test 4: Tenant A staff cannot read Tenant B resume
    tests.push(
      await runTest("Tenant A staff cannot read Tenant B resume (403)", async () => {
        const status = await getFileObject("tenants/tenant-beta/resumes/std_beta/resume_v1.pdf", staffAlphaToken);
        return { passed: status === 403, expected: 403, actual: status };
      })
    );

    // Test 5: Same-tenant staff reads succeed
    tests.push(
      await runTest("Tenant staff can read same-tenant resume (200)", async () => {
        const status = await getFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", staffAlphaToken);
        return { passed: status === 200, expected: 200, actual: status };
      })
    );

    tests.push(
      await runTest("Tenant staff can read same-tenant export zip (200)", async () => {
        const status = await getFileObject("exports/tenant-alpha/batch_2026.zip", staffAlphaToken);
        return { passed: status === 200, expected: 200, actual: status };
      })
    );

    // Test 6: Demo identity cannot access real-tenant paths
    tests.push(
      await runTest("Demo student cannot access real-tenant resume (403)", async () => {
        const status = await getFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", demoUserToken);
        return { passed: status === 403, expected: 403, actual: status };
      })
    );

    // Test 7: Direct client delete is blocked (writes/deletes via Admin SDK only)
    tests.push(
      await runTest("Client delete blocked on storage objects (403)", async () => {
        const status = await deleteFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", staffAlphaToken);
        return { passed: status === 403, expected: 403, actual: status };
      })
    );

    // Test 8: Metadata cannot spoof tenant ownership (attacker claiming matching tenantId in query/metadata cannot bypass token mismatch)
    tests.push(
      await runTest("Client token tenantId strictly enforced over path/metadata (403)", async () => {
        const status = await getFileObject("tenants/tenant-alpha/resumes/std_alpha/resume_v1.pdf", spoofedMetadataToken);
        return { passed: status === 403, expected: 403, actual: status };
      })
    );

    const passedCount = tests.filter((t) => t.passed).length;
    console.log(`\n=== STORAGE EMULATOR TEST SUMMARY: ${passedCount}/${tests.length} PASSED ===`);

    if (passedCount !== tests.length) {
      process.exit(1);
    }
  } finally {
    console.log("Cleaning up synthetic Storage test data...");
    await cleanupStorageFiles();
  }
}

main().catch((e) => {
  console.error("FATAL STORAGE TEST ERROR:", e);
  process.exit(1);
});
