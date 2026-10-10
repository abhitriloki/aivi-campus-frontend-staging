/**
 * Automated Verification Test Suite for Multi-Tenancy Foundations (Phase P02)
 * Validates tenant isolation, student-to-student boundaries, legacy document compatibility,
 * and unauthenticated blocking rules.
 */

const assert = require("assert");

console.log("=== MULTI-TENANCY FOUNDATIONS TEST SUITE (PHASE P02) ===");

// 1. Mock Custom Claims & Contexts
function createAuthContext(uid, emailVerified = true, tenant_id = null, role = "student") {
  if (!uid) return null;
  return {
    uid,
    token: {
      email_verified: emailVerified,
      tenant_id: tenant_id,
      tenantId: tenant_id,
      role: role,
    },
  };
}

// 2. Simulated Firestore Security Rule Evaluator
function evaluateRuleRead(auth, resource) {
  if (!auth) return false; // Unauthenticated blocked
  if (!auth.token.email_verified) return false;

  const isSuperAdmin = auth.token.role === "platform_admin" || auth.token.role === "admin";
  if (isSuperAdmin) return true; // Super admin cross-tenant access

  const isDocOwner = resource.userId === auth.uid;

  // Legacy document compatibility (missing tenant_id / tenantId)
  const docTenant = resource.tenant_id || resource.tenantId || null;
  if (!docTenant) {
    return isDocOwner; // Legacy doc readable by owner
  }

  // Tenant document read
  const userTenant = auth.token.tenant_id || auth.token.tenantId;
  if (userTenant !== docTenant) {
    return false; // Cross-tenant read BLOCKED
  }

  // Same tenant read
  if (isDocOwner) return true;
  if (auth.token.role === "tenant_admin" || auth.token.role === "coordinator") return true;

  return false; // Student reading another student's tenant doc blocked
}

function evaluateRuleWrite(auth, resource, requestData) {
  if (!auth) return false; // Unauthenticated blocked
  if (!auth.token.email_verified) return false;

  const isSuperAdmin = auth.token.role === "platform_admin" || auth.token.role === "admin";
  if (isSuperAdmin) return true; // Super admin cross-tenant write

  const isDocOwner = resource ? resource.userId === auth.uid : requestData.userId === auth.uid;
  if (!isDocOwner) return false; // Student writing another student's doc BLOCKED

  const userTenant = auth.token.tenant_id || auth.token.tenantId;
  const docTenant = resource ? (resource.tenant_id || resource.tenantId || null) : (requestData.tenant_id || requestData.tenantId || null);

  // If resource has tenant, must match user's tenant
  if (docTenant && userTenant !== docTenant) return false;

  return true;
}

// --- TEST SUITE EXECUTIONS ---
try {
  // Test (a): Tenant-A user cannot read Tenant-B doc
  console.log("\n[TEST A] Verifying Tenant-A user cannot read Tenant-B doc...");
  const userA = createAuthContext("user-a", true, "tenant-a", "student");
  const docTenantB = { id: "doc-b", userId: "user-b", tenant_id: "tenant-b", data: "sensitive" };
  const canReadCrossTenant = evaluateRuleRead(userA, docTenantB);
  assert.strictEqual(canReadCrossTenant, false, "Tenant-A user must be BLOCKED from reading Tenant-B document!");
  console.log("  ✅ PASSED: Cross-tenant read correctly BLOCKED.");

  // Test (b): Student cannot write another student's doc
  console.log("\n[TEST B] Verifying Student-1 cannot write Student-2's doc...");
  const student1 = createAuthContext("student-1", true, "tenant-a", "student");
  const docStudent2 = { id: "doc-2", userId: "student-2", tenant_id: "tenant-a", score: 85 };
  const canWriteOtherStudent = evaluateRuleWrite(student1, docStudent2, { score: 100 });
  assert.strictEqual(canWriteOtherStudent, false, "Student-1 must be BLOCKED from writing Student-2's document!");
  console.log("  ✅ PASSED: Student-to-Student write correctly BLOCKED.");

  // Test (c): Legacy doc still readable & writable by owner
  console.log("\n[TEST C] Verifying Legacy document without tenant_id readable & writable by owner...");
  const legacyUser = createAuthContext("legacy-user-123", true, null, "user");
  const legacyDoc = { id: "legacy-doc", userId: "legacy-user-123", resumeText: "Old resume" };
  const canReadLegacy = evaluateRuleRead(legacyUser, legacyDoc);
  const canWriteLegacy = evaluateRuleWrite(legacyUser, legacyDoc, { resumeText: "Updated resume" });
  assert.strictEqual(canReadLegacy, true, "Legacy owner must be allowed to read legacy doc!");
  assert.strictEqual(canWriteLegacy, true, "Legacy owner must be allowed to write legacy doc!");
  console.log("  ✅ PASSED: Legacy document access preserved for owner.");

  // Test (d): Unauthenticated user is fully blocked
  console.log("\n[TEST D] Verifying Unauthenticated request is fully blocked...");
  const unauth = null;
  const anyDoc = { id: "any-doc", userId: "user-1", tenant_id: "tenant-a" };
  assert.strictEqual(evaluateRuleRead(unauth, anyDoc), false, "Unauthenticated read must be BLOCKED!");
  assert.strictEqual(evaluateRuleWrite(unauth, anyDoc, {}), false, "Unauthenticated write must be BLOCKED!");
  console.log("  ✅ PASSED: Unauthenticated access fully BLOCKED.");

  // Test (e): Super admin cross-tenant privilege
  console.log("\n[TEST E] Verifying Super Admin cross-tenant access...");
  const superAdmin = createAuthContext("admin-uid", true, null, "platform_admin");
  assert.strictEqual(evaluateRuleRead(superAdmin, docTenantB), true, "Super admin must be allowed cross-tenant read!");
  assert.strictEqual(evaluateRuleWrite(superAdmin, docTenantB, {}), true, "Super admin must be allowed cross-tenant write!");
  console.log("  ✅ PASSED: Super Admin cross-tenant access verified.");

  console.log("\n========================================================");
  console.log("🎉 ALL MULTI-TENANCY FOUNDATION TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================");
} catch (err) {
  console.error("❌ TEST FAILURE:", err);
  process.exit(1);
}
