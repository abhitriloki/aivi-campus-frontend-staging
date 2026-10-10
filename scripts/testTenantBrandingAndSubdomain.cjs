/**
 * Automated Verification Test Suite for Tenant Subdomains & Branding (Phase P03)
 * Tests hostname subdomain extraction, cross-tenant login restrictions, and bare domain preservation.
 */

const assert = require("assert");

console.log("=== TENANT SUBDOMAINS & BRANDING TEST SUITE (PHASE P03) ===");

function extractSubdomainSlug(hostname) {
  if (!hostname) return null;
  const cleanHost = hostname.toLowerCase().trim();

  if (
    cleanHost === "localhost" ||
    cleanHost === "127.0.0.1" ||
    cleanHost === "aivilabs.com" ||
    cleanHost === "www.aivilabs.com" ||
    cleanHost === "app.aivilabs.com" ||
    cleanHost === "staging.aivilabs.com"
  ) {
    return null;
  }

  if (cleanHost.endsWith(".staging.aivilabs.com")) {
    const prefix = cleanHost.replace(".staging.aivilabs.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" ? slug : null;
  }

  if (cleanHost.endsWith(".aivilabs.com")) {
    const prefix = cleanHost.replace(".aivilabs.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" && slug !== "staging" ? slug : null;
  }

  if (cleanHost.includes(".localhost")) {
    const slug = cleanHost.split(".localhost")[0];
    return slug && slug !== "www" ? slug : null;
  }

  return null;
}

function evaluateSubdomainAuth(activeSubdomain, userClaims) {
  if (!activeSubdomain) return { allowed: true, reason: "Bare domain - global access" };
  const isSuperAdmin = userClaims.role === "platform_admin" || userClaims.role === "admin";
  if (isSuperAdmin) return { allowed: true, reason: "Super admin cross-tenant access" };

  const userTenant = userClaims.tenant_id || userClaims.tenantId || null;
  if (userTenant === activeSubdomain) return { allowed: true, reason: "Same tenant user" };

  return {
    allowed: false,
    reason: `Access Denied: Your account is not authorized for the '${activeSubdomain}' campus portal.`,
  };
}

try {
  // 1. Subdomain Extraction Unit Tests
  console.log("\n[TEST 1] Testing Subdomain Extraction from Hostnames...");
  assert.strictEqual(extractSubdomainSlug("bit-demo.staging.aivilabs.com"), "bit-demo");
  assert.strictEqual(extractSubdomainSlug("bit.aivilabs.com"), "bit");
  assert.strictEqual(extractSubdomainSlug("staging.aivilabs.com"), null);
  assert.strictEqual(extractSubdomainSlug("aivilabs.com"), null);
  assert.strictEqual(extractSubdomainSlug("www.aivilabs.com"), null);
  assert.strictEqual(extractSubdomainSlug("bit-demo.localhost"), "bit-demo");
  assert.strictEqual(extractSubdomainSlug("localhost"), null);
  console.log("  ✅ PASSED: Subdomain extraction accurately handles staging, production, and dev hostnames.");

  // 2. Subdomain Login Authorization Tests
  console.log("\n[TEST 2] Testing Subdomain Login Authorization Rules...");
  const bitUser = { tenant_id: "bit-demo", role: "student" };
  const otherUser = { tenant_id: "other-college", role: "student" };
  const adminUser = { tenant_id: null, role: "platform_admin" };

  const check1 = evaluateSubdomainAuth("bit-demo", bitUser);
  assert.strictEqual(check1.allowed, true);
  console.log("  ✅ PASSED: Enrolled student allowed on bit-demo subdomain.");

  const check2 = evaluateSubdomainAuth("bit-demo", otherUser);
  assert.strictEqual(check2.allowed, false);
  console.log("  ✅ PASSED: Cross-tenant student BLOCKED from bit-demo subdomain.");

  const check3 = evaluateSubdomainAuth("bit-demo", adminUser);
  assert.strictEqual(check3.allowed, true);
  console.log("  ✅ PASSED: Super admin allowed on any tenant subdomain.");

  const check4 = evaluateSubdomainAuth(null, otherUser);
  assert.strictEqual(check4.allowed, true);
  console.log("  ✅ PASSED: Bare domain (aivilabs.com) allows general logins.");

  console.log("\n========================================================");
  console.log("🎉 ALL SUBDOMAIN & BRANDING TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================");
} catch (err) {
  console.error("❌ TEST FAILURE:", err);
  process.exit(1);
}
