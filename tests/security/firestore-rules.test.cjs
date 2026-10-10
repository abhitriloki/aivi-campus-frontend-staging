// Fail-closed check: Emulator host environment variable MUST be set by firebase emulators:exec
if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error("FATAL: FIRESTORE_EMULATOR_HOST environment variable is missing!");
  console.error("This test suite operates fail-closed to prevent accidental connection to live Firebase projects.");
  console.error("Run this suite using: npm run test:security:firestore (or firebase emulators:exec)");
  process.exit(1);
}

const PROJECT_ID = process.env.GCLOUD_PROJECT || "demo-security-test";
const FIRESTORE_HOST = `http://${process.env.FIRESTORE_EMULATOR_HOST}`;

// Standard package import from root dependencies (never brittle relative paths)
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}
const db = admin.firestore();

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

const TEST_DOCS = [
  "tenants/tenant-alpha",
  "tenants/tenant-beta",
  "profiles/std_alpha",
  "profiles/std_beta",
  "tenant_members/tenant-alpha_tpo_alpha",
  "placement_drives/drive_alpha",
  "placement_drives/drive_beta",
  "tenant_slugs/alpha-tech",
  "tenant_slugs/beta-univ",
  "tenant_domains/alpha-tech.edu",
  "tenant_domains/beta-univ.edu",
];

async function cleanupSyntheticData() {
  for (const docPath of TEST_DOCS) {
    try {
      await db.doc(docPath).delete();
    } catch {
      // Best effort deletion during test tear-down
    }
  }
}

async function main() {
  console.log("=== STARTING EXECUTABLE FIRESTORE EMULATOR RULES TEST SUITE ===");
  console.log(`Target: ${FIRESTORE_HOST} (Project: ${PROJECT_ID})`);

  try {
    // 1. Seed fixture documents using Admin SDK (bypasses security rules cleanly)
    await db.doc("tenants/tenant-alpha").set({
      name: "Alpha Institute of Tech",
      code: "alpha-tech",
    });

    await db.doc("tenants/tenant-beta").set({
      name: "Beta University",
      code: "beta-univ",
    });

    await db.doc("profiles/std_alpha").set({
      fullName: "Aarav Sharma",
      tenantId: "tenant-alpha",
      role: "student",
      branch: "CSE",
    });

    await db.doc("profiles/std_beta").set({
      fullName: "Priya Patel",
      tenantId: "tenant-beta",
      role: "student",
      branch: "ECE",
    });

    await db.doc("tenant_members/tenant-alpha_tpo_alpha").set({
      tenantId: "tenant-alpha",
      uid: "tpo_alpha",
      role: "tpo",
      branchScope: [],
    });

    await db.doc("placement_drives/drive_alpha").set({
      company: "TechCorp",
      tenantId: "tenant-alpha",
    });

    await db.doc("placement_drives/drive_beta").set({
      company: "GlobalBank",
      tenantId: "tenant-beta",
    });

    const tests = [];

    // Tokens
    const unauthHeader = {};
    const studentAlphaToken = createJwt({
      uid: "std_alpha",
      tenant_id: "tenant-alpha",
      tenantId: "tenant-alpha",
      role: "student",
    });
    const studentBetaToken = createJwt({
      uid: "std_beta",
      tenant_id: "tenant-beta",
      tenantId: "tenant-beta",
      role: "student",
    });
    const staffAlphaToken = createJwt({
      uid: "tpo_alpha",
      tenant_id: "tenant-alpha",
      tenantId: "tenant-alpha",
      role: "tpo",
    });
    const platformAdminToken = createJwt({
      uid: "super_admin_1",
      role: "platform_admin",
      isPlatformAdmin: true,
    });

    // Test 1: Unauthenticated read to tenant document is rejected (403)
    tests.push(
      await runTest("Unauthenticated access fails (403)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/tenants/tenant-alpha`, {
          headers: unauthHeader,
        });
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 2: Cross-tenant tenant document read is rejected (403)
    tests.push(
      await runTest("Cross-tenant tenant doc read fails (403)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/tenants/tenant-beta`, {
          headers: { Authorization: `Bearer ${studentAlphaToken}` },
        });
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 3: Same-tenant tenant document read succeeds (200)
    tests.push(
      await runTest("Same-tenant tenant doc read succeeds (200)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/tenants/tenant-alpha`, {
          headers: { Authorization: `Bearer ${studentAlphaToken}` },
        });
        return { passed: res.status === 200, expected: 200, actual: res.status };
      })
    );

    // Test 4: Cross-tenant student profile read is rejected (403)
    tests.push(
      await runTest("Cross-tenant student profile read fails (403)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles/std_beta`, {
          headers: { Authorization: `Bearer ${studentAlphaToken}` },
        });
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 5: Same-tenant student profile read succeeds (200)
    tests.push(
      await runTest("Same-tenant student profile read succeeds (200)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles/std_alpha`, {
          headers: { Authorization: `Bearer ${studentAlphaToken}` },
        });
        return { passed: res.status === 200, expected: 200, actual: res.status };
      })
    );

    // Test 6: Cross-tenant placement drive read is rejected (403)
    tests.push(
      await runTest("Cross-tenant placement drive read fails (403)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/placement_drives/drive_beta`, {
          headers: { Authorization: `Bearer ${studentAlphaToken}` },
        });
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 7: Student attempting to elevate own role in profile fails (403)
    tests.push(
      await runTest("Student modifying role in profile fails (403)", async () => {
        const res = await fetch(
          `${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles/std_alpha?updateMask.fieldPaths=role`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${studentAlphaToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: { role: { stringValue: "tenant_admin" } },
            }),
          }
        );
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 8: Student attempting to change tenantId in profile fails (403)
    tests.push(
      await runTest("Student modifying tenantId in profile fails (403)", async () => {
        const res = await fetch(
          `${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles/std_alpha?updateMask.fieldPaths=tenantId`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${studentAlphaToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: { tenantId: { stringValue: "tenant-beta" } },
            }),
          }
        );
        return { passed: res.status === 403, expected: 403, actual: res.status };
      })
    );

    // Test 9: Student updating non-administrative profile field (fullName) succeeds (200)
    tests.push(
      await runTest("Student updating safe field (fullName) succeeds (200)", async () => {
        const res = await fetch(
          `${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles/std_alpha?updateMask.fieldPaths=fullName`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${studentAlphaToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fields: { fullName: { stringValue: "Aarav Sharma (Updated)" } },
            }),
          }
        );
        return { passed: res.status === 200, expected: 200, actual: res.status };
      })
    );

    // Test 10: Platform admin universal read on any tenant succeeds (200)
    tests.push(
      await runTest("Platform admin universal tenant read succeeds (200)", async () => {
        const res = await fetch(`${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/tenants/tenant-beta`, {
          headers: { Authorization: `Bearer ${platformAdminToken}` },
        });
        return { passed: res.status === 200, expected: 200, actual: res.status };
      })
    );

    const passedCount = tests.filter((t) => t.passed).length;
    console.log(`\n=== FIRESTORE EMULATOR TEST SUMMARY: ${passedCount}/${tests.length} PASSED ===`);

    if (passedCount !== tests.length) {
      process.exit(1);
    }
  } finally {
    console.log("Cleaning up synthetic Firestore test data...");
    await cleanupSyntheticData();
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
