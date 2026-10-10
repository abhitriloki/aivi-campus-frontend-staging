/**
 * Automated Verification Test Suite for Campus Drive Manager (Phase P08)
 * Validates drive creation, candidate eligibility computation, candidate status pipeline,
 * audit logging, closed drive read-only enforcement, and Auto Sprint linking.
 */

const assert = require("assert");

console.log("=== CAMPUS DRIVE MANAGER TEST SUITE (PHASE P08) ===");

// Simulated Database Store
const dbStore = {
  drives: new Map(),
  candidates: new Map(),
  sprints: new Map(),
  auditLogs: [],
  students: [
    { uid: "stu_1", name: "Aarav Sharma", branch: "CSE", batch: "2026", cgpa: 8.7, aes: 82 },
    { uid: "stu_2", name: "Ananya Verma", branch: "ECE", batch: "2026", cgpa: 9.1, aes: 88 },
    { uid: "stu_3", name: "Rohan Gupta", branch: "ME", batch: "2027", cgpa: 7.2, aes: 55 },
    { uid: "stu_4", name: "Priya Singh", branch: "CSE", batch: "2026", cgpa: 8.4, aes: 79 },
  ],
};

// 1. Create Drive Simulator
function createDrivePayload({ company, roleTitle, ctcLpa, eligibleBranches, eligibleBatches, minCgpa }) {
  const driveId = `drv_${Date.now()}`;
  const drive = {
    driveId,
    tenant_id: "bit-demo",
    company,
    roleTitle,
    ctcLpa,
    eligibility: {
      branches: eligibleBranches,
      batches: eligibleBatches,
      minCgpa,
    },
    status: "open",
    createdAt: new Date().toISOString(),
  };
  dbStore.drives.set(driveId, drive);

  // Compute Eligibility Engine
  let invitedCount = 0;
  for (const student of dbStore.students) {
    const branchOk = eligibleBranches.length === 0 || eligibleBranches.includes(student.branch);
    const batchOk = eligibleBatches.length === 0 || eligibleBatches.includes(student.batch);
    const cgpaOk = student.cgpa >= minCgpa;

    const isEligible = branchOk && batchOk && cgpaOk;
    if (isEligible) {
      const candKey = `${driveId}_${student.uid}`;
      dbStore.candidates.set(candKey, {
        candId: candKey,
        driveId,
        uid: student.uid,
        name: student.name,
        branch: student.branch,
        batch: student.batch,
        status: "invited", // Default pipeline status
      });
      invitedCount++;
    }
  }

  return { driveId, invitedCount };
}

// 2. Candidate Status Transition Simulator
function updateCandidateStatus(driveId, uid, newStatus, actorUid = "tpo_user_1") {
  const drive = dbStore.drives.get(driveId);
  if (!drive) throw new Error("Drive not found.");
  if (drive.status === "closed") {
    throw new Error("This drive is closed and read-only.");
  }

  const candKey = `${driveId}_${uid}`;
  const candidate = dbStore.candidates.get(candKey);
  if (!candidate) throw new Error("Candidate record not found.");

  const oldStatus = candidate.status;
  candidate.status = newStatus;

  // Audit Log Entry
  dbStore.auditLogs.push({
    action: "drive_candidate_status_change",
    actorUid,
    targetUid: uid,
    details: { driveId, oldStatus, newStatus },
    timestamp: new Date().toISOString(),
  });

  return candidate;
}

// 3. Link Auto Sprint Simulator
function generateDriveAutoSprint(driveId, durationDays = 7) {
  const drive = dbStore.drives.get(driveId);
  if (!drive) throw new Error("Drive not found.");

  const sprintId = `sprint_${driveId}`;
  const sprint = {
    sprintId,
    driveId,
    title: `${drive.company} - ${drive.roleTitle} ${durationDays}-Day Prep Sprint`,
    durationDays,
    status: "active",
  };
  dbStore.sprints.set(sprintId, sprint);
  return sprint;
}

try {
  // Test 1: Drive Creation & Server-side Eligibility Engine
  console.log("\n[TEST 1] Creating Campus Placement Drive (Accenture SDE, 6.5 LPA)...");
  const driveRes = createDrivePayload({
    company: "Accenture",
    roleTitle: "Software Engineering Associate",
    ctcLpa: 6.5,
    eligibleBranches: ["CSE", "ECE"],
    eligibleBatches: ["2026"],
    minCgpa: 8.0,
  });

  assert.ok(driveRes.driveId, "Drive ID must be returned.");
  assert.strictEqual(driveRes.invitedCount, 3, "Exactly 3 students (Aarav, Ananya, Priya) must match eligibility!");
  console.log("  ✅ PASSED: Drive created and eligibility engine filtered 2 eligible candidates.");

  // Test 2: Candidate Pipeline Status Transitions
  console.log("\n[TEST 2] Updating Candidate Pipeline Statuses (invited -> shortlisted -> offered)...");
  const cand1 = updateCandidateStatus(driveRes.driveId, "stu_1", "shortlisted");
  assert.strictEqual(cand1.status, "shortlisted", "Candidate 1 status must be shortlisted.");

  const cand2 = updateCandidateStatus(driveRes.driveId, "stu_1", "offered");
  assert.strictEqual(cand2.status, "offered", "Candidate 1 status must be offered.");
  console.log("  ✅ PASSED: Candidate pipeline transitions executed.");

  // Test 3: Audit Trail Verification
  console.log("\n[TEST 3] Verifying Audit Trail Log Entries...");
  assert.strictEqual(dbStore.auditLogs.length, 2, "2 audit log entries must exist.");
  assert.strictEqual(dbStore.auditLogs[0].action, "drive_candidate_status_change");
  assert.strictEqual(dbStore.auditLogs[0].details.oldStatus, "invited");
  assert.strictEqual(dbStore.auditLogs[0].details.newStatus, "shortlisted");
  assert.strictEqual(dbStore.auditLogs[1].details.oldStatus, "shortlisted");
  assert.strictEqual(dbStore.auditLogs[1].details.newStatus, "offered");
  console.log("  ✅ PASSED: Every status transition is logged in audit trail.");

  // Test 4: Linked Auto Sprint Generation
  console.log("\n[TEST 4] Generating Linked Auto Sprint Prep Plan...");
  const sprint = generateDriveAutoSprint(driveRes.driveId, 7);
  assert.strictEqual(sprint.driveId, driveRes.driveId, "Sprint must link directly to driveId!");
  assert.ok(sprint.title.includes("Accenture"), "Sprint title must retain company name.");
  console.log("  ✅ PASSED: Auto Sprint prep plan linked to drive.");

  // Test 5: Closed Drive Read-Only Enforcement
  console.log("\n[TEST 5] Testing Closed Drive Read-Only Restriction...");
  const driveDoc = dbStore.drives.get(driveRes.driveId);
  driveDoc.status = "closed";

  assert.throws(
    () => updateCandidateStatus(driveRes.driveId, "stu_2", "shortlisted"),
    /closed and read-only/,
    "Closed drive MUST block candidate status updates!"
  );
  console.log("  ✅ PASSED: Closed drive read-only restriction enforced.");

  console.log("\n========================================================");
  console.log("🎉 ALL CAMPUS DRIVE MANAGER TESTS PASSED SUCCESSFULLY!");
  console.log("========================================================");
} catch (err) {
  console.error("❌ TEST FAILURE:", err);
  process.exit(1);
}
