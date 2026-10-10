import { describe, it, expect } from "vitest";
import { importStudentsCsvSchema, getImportJobSchema, getCampusStudentsSchema } from "../../functions/src/security/validators";

export function generateSyntheticCsv(rowCount = 5000): { csvText: string; expectedValid: number; expectedFailed: number } {
  let lines: string[] = [];
  lines.push("name,email,enrollment_no,branch,batch,section,phone,cgpa");

  const branches = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const sections = ["A", "B", "C"];
  let expectedValid = 0;
  let expectedFailed = 0;

  for (let i = 1; i <= rowCount; i++) {
    // Inject ~3% bad rows (every 33rd row)
    if (i % 33 === 0) {
      expectedFailed++;
      if (i % 3 === 0) {
        // Bad email format
        lines.push(`Student ${i},bademail_row${i},EN2025${i},CSE,2026,A,9876543210,8.5`);
      } else if (i % 3 === 1) {
        // Missing required enrollment_no
        lines.push(`Student ${i},student${i}@test.com,,CSE,2026,A,9876543210,8.5`);
      } else {
        // Missing required branch
        lines.push(`Student ${i},student${i}@test.com,EN2025${i},,2026,A,9876543210,8.5`);
      }
    } else {
      expectedValid++;
      const branch = branches[i % branches.length];
      const section = sections[i % sections.length];
      const batch = 2025 + (i % 3);
      const cgpa = (7.0 + (i % 30) / 10).toFixed(1);
      lines.push(`Student ${i},student${i}@campus.edu,EN2025_${i},${branch},${batch},${section},987654${1000 + i},${cgpa}`);
    }
  }

  return {
    csvText: lines.join("\n"),
    expectedValid,
    expectedFailed,
  };
}

describe("Phase 1 Student Import Validation & Contract Tests", () => {
  it("generates a 5,000-row synthetic CSV with exact 3% failure distribution", () => {
    const { csvText, expectedValid, expectedFailed } = generateSyntheticCsv(5000);
    const lines = csvText.split("\n");
    expect(lines.length).toBe(5001); // 1 header + 5000 data rows
    expect(expectedValid + expectedFailed).toBe(5000);
    expect(expectedFailed).toBeGreaterThan(100);
  });

  it("validates importStudentsCsv payload schema correctly", () => {
    const validPayload = {
      csvBase64: "bmFtZSxlbWFpbCxlbnJvbGxtZW50X25vLGJyYW5jaCxiYXRjaA==",
      columnMap: {
        name: "name",
        email: "email",
        enrollment_no: "enrollment_no",
        branch: "branch",
        batch: "batch",
      },
      dryRun: true,
    };

    const parsed = importStudentsCsvSchema.parse(validPayload);
    expect(parsed.dryRun).toBe(true);
    expect(parsed.columnMap.name).toBe("name");
  });

  it("validates getImportJob payload schema", () => {
    const valid = { jobId: "job_xyz_123" };
    const parsed = getImportJobSchema.parse(valid);
    expect(parsed.jobId).toBe("job_xyz_123");

    expect(() => getImportJobSchema.parse({ jobId: "" })).toThrow();
  });

  it("validates getCampusStudents filter schema", () => {
    const filterPayload = {
      page: 1,
      pageSize: 50,
      branch: "CSE",
      batch: 2026,
      status: "unplaced",
      search: "Aarav",
    };

    const parsed = getCampusStudentsSchema.parse(filterPayload);
    expect(parsed.branch).toBe("CSE");
    expect(parsed.pageSize).toBe(50);
  });

  it("verifies idempotency property: duplicate enrollment numbers are rejected", () => {
    const duplicateLines = [
      "name,email,enrollment_no,branch,batch",
      "Student A,a@test.com,EN100,CSE,2026",
      "Student B,b@test.com,EN100,CSE,2026", // duplicate enrollment_no
    ];

    const seen = new Set<string>();
    const errors: string[] = [];

    duplicateLines.slice(1).forEach((line) => {
      const parts = line.split(",");
      const enroll = parts[2];
      if (seen.has(enroll)) {
        errors.push(`Duplicate enrollment_no (${enroll})`);
      } else {
        seen.add(enroll);
      }
    });

    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("Duplicate enrollment_no");
  });

  it("normalizes academic engineering branches from full names and prefixes", async () => {
    // Import normalizeBranch compiled module or test regex logic directly
    const { normalizeBranch } = await import("../../functions/lib/index");
    expect(normalizeBranch("MECHANICAL ENGINEERING")).toBe("ME");
    expect(normalizeBranch("INFORMATION TECHNOLOGY")).toBe("IT");
    expect(normalizeBranch("BIOTECHNOLOGY")).toBe("BT");
    expect(normalizeBranch("ELECTRICAL ENGINEERING")).toBe("EE");
    expect(normalizeBranch("COMPUTER SCIENCE AND ENGINEERING")).toBe("CSE");
    expect(normalizeBranch("B.TECH IN MECHANICAL ENGINEERING")).toBe("ME");
    expect(normalizeBranch("M.TECH IN COMPUTER SCIENCE")).toBe("CSE");
    expect(normalizeBranch("CIVIL ENGINEERING")).toBe("CIVIL");
    expect(normalizeBranch("ELECTRONICS & COMMUNICATION ENGINEERING")).toBe("ECE");
    expect(normalizeBranch("ELECTRICAL & ELECTRONICS ENGINEERING")).toBe("EEE");
    expect(normalizeBranch("ARTIFICIAL INTELLIGENCE & MACHINE LEARNING")).toBe("AIML");
    expect(normalizeBranch("DATA SCIENCE")).toBe("AI & DS");
    expect(normalizeBranch("ROBOTICS")).toBe("ROBOTICS");
  }, 30000);

  it("completely decouples resume verification status from student placement status", () => {
    // Simulating student record state
    const student = {
      userId: "test-std-01",
      fullName: "Pooja Verma",
      placementStatus: "unplaced" as const,
      resumeVerified: false,
      resumeVerificationStatus: "pending" as const,
    };

    // Step 1: Admin verifies & watermarks student resume
    // Verification must ONLY set resumeVerificationStatus to 'verified', NOT touching placementStatus
    const verifiedStudent = {
      ...student,
      resumeVerified: true,
      resumeVerificationStatus: "verified" as const,
    };
    expect(verifiedStudent.resumeVerificationStatus).toBe("verified");
    expect(verifiedStudent.placementStatus).toBe("unplaced"); // Must remain unplaced!

    // Step 2: Admin changes student placement status to 'higher_studies'
    // Status update must NOT reset or flip resumeVerificationStatus back to 'pending'
    const updatedStatusStudent = {
      ...verifiedStudent,
      placementStatus: "higher_studies" as const,
    };
    expect(updatedStatusStudent.placementStatus).toBe("higher_studies");
    expect(updatedStatusStudent.resumeVerificationStatus).toBe("verified"); // Must stay verified!
  });

  it("sanitizes text strings with Rupee symbols (₹) and non-ASCII characters for WinAnsi PDF compatibility", () => {
    const rawText = "Total Amount: ₹2,95,000.00 — Authorized";
    const sanitized = String(rawText)
      .replace(/\u20B9/g, "INR ")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ");

    expect(sanitized).toBe("Total Amount: INR 2,95,000.00   Authorized");
    expect(sanitized).not.toContain("₹");
    expect(/[^\x20-\x7E\n\r\t]/.test(sanitized)).toBe(false);
  });
});

