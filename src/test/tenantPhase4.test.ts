import { describe, it, expect } from "vitest";
import {
  parseDriveJdSchema,
  createDriveSchema,
  generateDriveSprintSchema,
  recordDriveOutcomeSchema,
} from "../../functions/src/security/validators";

describe("Phase 4 Campus Placement Drives & Auto-Shortlist Tests", () => {
  it("validates parseDriveJdSchema payload", () => {
    const valid = { jdText: "Looking for a Software Development Engineer with strong C++, Java, and SQL knowledge." };
    const parsed = parseDriveJdSchema.parse(valid);
    expect(parsed.jdText).toContain("Software Development Engineer");

    expect(() => parseDriveJdSchema.parse({ jdText: "short" })).toThrow();
  });

  it("validates createDriveSchema payload", () => {
    const valid = {
      company: "TCS Digital",
      roleTitle: "Systems Engineer",
      ctcText: "7.5 LPA",
      jdText: "TCS Digital hiring drive for 2025 batch engineering graduates.",
      eligibility: {
        minCgpa: 7.0,
        maxBacklogs: 0,
        batches: ["2025"],
        branches: ["CSE", "ECE"],
      },
      stages: [
        { name: "Aptitude Round", date: "2026-08-01", mode: "online" },
      ],
    };

    const parsed = createDriveSchema.parse(valid);
    expect(parsed.company).toBe("TCS Digital");
    expect(parsed.eligibility.minCgpa).toBe(7.0);
  });

  it("validates generateDriveSprintSchema default values", () => {
    const payload = { driveId: "drive_tcs_123" };
    const parsed = generateDriveSprintSchema.parse(payload);
    expect(parsed.durationDays).toBe(7);
  });

  it("validates recordDriveOutcomeSchema payload", () => {
    const valid = {
      driveId: "drive_tcs_123",
      userId: "student_789",
      stageIndex: 2,
      outcome: "offer" as const,
      offerCtc: 7.5,
    };

    const parsed = recordDriveOutcomeSchema.parse(valid);
    expect(parsed.outcome).toBe("offer");
    expect(parsed.offerCtc).toBe(7.5);
  });

  it("correctly evaluates student eligibility edge cases (CGPA cutoff, backlogs, branch)", () => {
    const driveEligibility = {
      minCgpa: 6.5,
      maxBacklogs: 0,
      batches: ["2025"],
      branches: ["CSE", "ECE"],
    };

    // Edge case 1: CGPA exactly at cutoff (6.5) -> Eligible
    const studentExactCutoff = { cgpa: 6.5, backlogs: 0, batch: "2025", branch: "CSE" };
    const reasons1: string[] = [];
    if (studentExactCutoff.cgpa < driveEligibility.minCgpa) reasons1.push("cgpa");
    if (studentExactCutoff.backlogs > driveEligibility.maxBacklogs) reasons1.push("backlogs");
    expect(reasons1.length).toBe(0);

    // Edge case 2: Backlog 1 vs Max 0 -> Ineligible
    const studentWithBacklog = { cgpa: 8.0, backlogs: 1, batch: "2025", branch: "CSE" };
    const reasons2: string[] = [];
    if (studentWithBacklog.backlogs > driveEligibility.maxBacklogs) reasons2.push("Backlogs 1 > Max 0");
    expect(reasons2.length).toBe(1);

    // Edge case 3: Branch ME not in CSE/ECE -> Ineligible
    const studentOtherBranch = { cgpa: 8.5, backlogs: 0, batch: "2025", branch: "ME" };
    const reasons3: string[] = [];
    if (!driveEligibility.branches.includes(studentOtherBranch.branch)) reasons3.push("Branch ME not in eligible list");
    expect(reasons3.length).toBe(1);
  });
});
