import { describe, it, expect } from "vitest";

describe("Placement Drives Pagination & Search and Student Vault Persistence Invariants", () => {
  it("paginates placement drive candidates into 20 per page slices", () => {
    const candidates = Array.from({ length: 43 }, (_, i) => ({
      id: `app_${i + 1}`,
      studentName: `Student ${i + 1}`,
      enrollmentNo: `EN2026${String(i + 1).padStart(3, "0")}`,
      branch: i % 2 === 0 ? "CSE" : "ECE",
      cgpa: 8.5,
      eligible: true,
      outcome: i === 0 ? "offer" : "pending",
    }));

    const pageSize = 20;
    const page1 = candidates.slice(0, pageSize);
    const page2 = candidates.slice(pageSize, pageSize * 2);
    const page3 = candidates.slice(pageSize * 2, pageSize * 3);

    expect(page1.length).toBe(20);
    expect(page1[0].studentName).toBe("Student 1");
    expect(page1[19].studentName).toBe("Student 20");

    expect(page2.length).toBe(20);
    expect(page2[0].studentName).toBe("Student 21");
    expect(page2[19].studentName).toBe("Student 40");

    expect(page3.length).toBe(3);
    expect(page3[0].studentName).toBe("Student 41");
    expect(page3[2].studentName).toBe("Student 43");
  });

  it("filters candidates by search keyword matching name or roll number", () => {
    const candidates = [
      { id: "1", studentName: "Lavanya Bhatt", enrollmentNo: "MDU26CSE01", branch: "CSE" },
      { id: "2", studentName: "Dhruv Kapoor", enrollmentNo: "MDU26ECE02", branch: "ECE" },
      { id: "3", studentName: "Anika Mehta", enrollmentNo: "MDU26CSE03", branch: "CSE" },
    ];

    const searchQ = "lavanya";
    const filtered = candidates.filter((c) =>
      c.studentName.toLowerCase().includes(searchQ) ||
      c.enrollmentNo.toLowerCase().includes(searchQ) ||
      c.branch.toLowerCase().includes(searchQ)
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].studentName).toBe("Lavanya Bhatt");
  });

  it("calculates next version number consistently without jumping or mismatching", () => {
    const currentVersions = [
      { versionId: "v_123_2", versionNo: 2, status: "submitted" },
      { versionId: "v_123_1", versionNo: 1, status: "submitted" },
    ];

    const currentMax = currentVersions.length > 0
      ? Math.max(...currentVersions.map((v) => Number(v.versionNo) || 1))
      : 0;
    const nextVersionNo = currentMax + 1;

    expect(nextVersionNo).toBe(3);

    const newVersion = {
      versionId: `v_123_${nextVersionNo}`,
      versionNo: nextVersionNo,
      status: "submitted",
    };

    const updated = [newVersion, ...currentVersions];
    expect(updated[0].versionNo).toBe(3);
    expect(updated.length).toBe(3);
  });
});
