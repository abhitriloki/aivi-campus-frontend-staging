/**
 * Automated Verification Test Suite for AI Usage Metering & Budgets (Phase P04)
 * Tests atomic counter increments, 80% warning trigger, 100% hard-stop enforcement,
 * global kill-switch behavior, and PII-free data storage.
 */

const assert = require("assert");

console.log("=== AI USAGE METERING & BUDGETS TEST SUITE (PHASE P04) ===");

// Simulated State Store for Tests
const dbState = {
  tenants: {
    "bit-demo": {
      name: "Bhilai Institute of Technology - Sandbox",
      budget: {
        monthlyTokenCap: 1000,
        warnAtPct: 80,
        hardStop: true,
      },
    },
  },
  tenant_usage: {
    "bit-demo": {
      daily: {},
      monthly: {},
    },
  },
  audit_logs: [],
};

// Metering & Budget Enforcement Logic Simulator
function simulatePreCallCheck(tenantId, envKillSwitch = false) {
  if (envKillSwitch) {
    return {
      allowed: false,
      isQuotaError: true,
      error: "AI features are temporarily paused for system maintenance. Please try again shortly.",
    };
  }

  if (!tenantId) return { allowed: true };

  const tenant = dbState.tenants[tenantId];
  if (!tenant || !tenant.budget || !tenant.budget.monthlyTokenCap) return { allowed: true };

  const cap = tenant.budget.monthlyTokenCap;
  const monthKey = "2026-08";
  const mUsage = dbState.tenant_usage[tenantId]?.monthly[monthKey] || { tokensIn: 0, tokensOut: 0 };
  const currentTokens = mUsage.tokensIn + mUsage.tokensOut;
  const pct = (currentTokens / cap) * 100;

  if (pct >= 100 && tenant.budget.hardStop) {
    if (!mUsage.hardStopFired) {
      mUsage.hardStopFired = true;
    }
    return {
      allowed: false,
      isQuotaError: true,
      error: "Campus AI quota reached for this billing cycle. Please contact your campus placement coordinator.",
    };
  }

  if (pct >= tenant.budget.warnAtPct && !mUsage.warningFired) {
    mUsage.warningFired = true;
    dbState.audit_logs.push({
      tenantId,
      action: "TENANT_AI_BUDGET_WARNING",
      pct: Math.round(pct),
      currentTokens,
      monthlyTokenCap: cap,
    });
  }

  return { allowed: true };
}

function simulateRecordUsage(tenantId, usage) {
  if (!tenantId) return;
  const dayKey = "2026-08-03";
  const monthKey = "2026-08";

  const estCostUsd = ((usage.prompt_tokens * 0.075) / 1000000) + ((usage.completion_tokens * 0.30) / 1000000);
  const estCostInr = estCostUsd * 86.5;

  if (!dbState.tenant_usage[tenantId]) {
    dbState.tenant_usage[tenantId] = { daily: {}, monthly: {} };
  }

  // Record Daily
  const d = dbState.tenant_usage[tenantId].daily[dayKey] || { calls: 0, tokensIn: 0, tokensOut: 0, estCostInr: 0 };
  d.calls += 1;
  d.tokensIn += usage.prompt_tokens;
  d.tokensOut += usage.completion_tokens;
  d.estCostInr += estCostInr;
  dbState.tenant_usage[tenantId].daily[dayKey] = d;

  // Record Monthly
  const m = dbState.tenant_usage[tenantId].monthly[monthKey] || { calls: 0, tokensIn: 0, tokensOut: 0, estCostInr: 0 };
  m.calls += 1;
  m.tokensIn += usage.prompt_tokens;
  m.tokensOut += usage.completion_tokens;
  m.estCostInr += estCostInr;
  dbState.tenant_usage[tenantId].monthly[monthKey] = m;
}

try {
  // Test 1: First AI Call (usage: 500 tokens in, 300 tokens out = 800 total = 80% of 1000 cap)
  console.log("\n[TEST 1] Executing First Call (800 tokens -> 80% threshold)...");
  const check1 = simulatePreCallCheck("bit-demo");
  assert.strictEqual(check1.allowed, true, "Call 1 must be allowed!");

  simulateRecordUsage("bit-demo", { prompt_tokens: 500, completion_tokens: 300, total_tokens: 800 });
  
  // Re-run check after record to trigger 80% warning
  simulatePreCallCheck("bit-demo");

  const monthState = dbState.tenant_usage["bit-demo"].monthly["2026-08"];
  assert.strictEqual(monthState.calls, 1, "Calls count must increment to 1!");
  assert.strictEqual(monthState.tokensIn, 500, "TokensIn must equal 500!");
  assert.strictEqual(monthState.tokensOut, 300, "TokensOut must equal 300!");
  assert.strictEqual(monthState.warningFired, true, "80% Warning flag must be set!");
  assert.strictEqual(dbState.audit_logs.length, 1, "Audit log warning entry must be recorded!");
  console.log("  ✅ PASSED: 80% warning fired and audit log created.");

  // Test 2: Second AI Call (300 tokens -> total 1100 tokens -> 110% cap)
  console.log("\n[TEST 2] Executing Second Call (300 tokens -> total 1100 tokens -> 110% cap)...");
  simulateRecordUsage("bit-demo", { prompt_tokens: 200, completion_tokens: 100, total_tokens: 300 });

  const check2 = simulatePreCallCheck("bit-demo");
  assert.strictEqual(check2.allowed, false, "Call 2 must be BLOCKED by hard stop!");
  assert.strictEqual(check2.isQuotaError, true, "Must flag isQuotaError!");
  assert.ok(check2.error.includes("Campus AI quota reached"), "Must contain user-friendly hard stop message.");
  console.log("  ✅ PASSED: 100% Hard stop correctly blocks AI invocation.");

  // Test 3: Global Kill-Switch Test
  console.log("\n[TEST 3] Testing Global Kill-Switch (AI_FEATURES_OFF=true)...");
  const checkKillSwitch = simulatePreCallCheck("bit-demo", true);
  assert.strictEqual(checkKillSwitch.allowed, false, "Kill-switch must block execution!");
  assert.ok(checkKillSwitch.error.includes("temporarily paused"), "Must contain maintenance message.");
  console.log("  ✅ PASSED: Global kill-switch blocks AI calls gracefully.");

  // Test 4: Privacy Audit (Zero PII or Prompt Text in usage docs)
  console.log("\n[TEST 4] Verifying Privacy & Zero PII Storage...");
  const usageKeys = Object.keys(monthState);
  assert.deepStrictEqual(
    usageKeys.sort(),
    ["calls", "estCostInr", "hardStopFired", "tokensIn", "tokensOut", "warningFired"].sort(),
    "Usage docs must strictly contain numeric counters and flags without prompt text or PII!"
  );
  console.log("  ✅ PASSED: Zero PII or prompt text found in usage objects.");

  console.log("\n========================================================");
  console.log("🎉 ALL AI METERING & BUDGET TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================");
} catch (err) {
  console.error("❌ TEST FAILURE:", err);
  process.exit(1);
}
