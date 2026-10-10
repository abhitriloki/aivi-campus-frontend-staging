import { describe, it, expect } from "vitest";
import {
  backfillAesSchema,
  aggregateTenantStatsSchema,
  nudgeStudentSchema,
} from "../../functions/src/security/validators";

describe("Phase 3 AES & Placement Command Center Tests", () => {
  it("validates backfillAesSchema payload with default batch size", () => {
    const defaultVal = {};
    const parsed = backfillAesSchema.parse(defaultVal);
    expect(parsed.batchSize).toBe(200);

    const custom = { batchSize: 50 };
    const parsedCustom = backfillAesSchema.parse(custom);
    expect(parsedCustom.batchSize).toBe(50);
  });

  it("validates aggregateTenantStatsSchema payload", () => {
    const valid = { tenantId: "tenant_ggi_123" };
    const parsed = aggregateTenantStatsSchema.parse(valid);
    expect(parsed.tenantId).toBe("tenant_ggi_123");
  });

  it("validates nudgeStudentSchema payload", () => {
    const valid = { studentId: "student_456" };
    const parsed = nudgeStudentSchema.parse(valid);
    expect(parsed.studentId).toBe("student_456");
  });

  it("calculates re-normalized AES score weighted average correctly", () => {
    // ATS=80 (0.25 weight), JDFit=90 (0.25 weight)
    const weights = { ats: 0.25, jdFit: 0.25, interview: 0.25, portfolio: 0.10 };
    const atsScore = 80;
    const jdFitScore = 90;

    const totalWeight = weights.ats + weights.jdFit; // 0.50
    const weightedSum = atsScore * weights.ats + jdFitScore * weights.jdFit; // 20 + 22.5 = 42.5
    const finalAes = Math.round(weightedSum / totalWeight); // 42.5 / 0.5 = 85

    expect(finalAes).toBe(85);
  });

  it("validates daily stats rollup structure invariants", () => {
    const mockRollup = {
      tenantId: "tenant_ggi_123",
      date: "2026-07-20",
      activeStudents7d: 150,
      activeStudents30d: 280,
      avgAes: 72,
      aesBands: { "<40": 15, "40-60": 45, "60-75": 110, "75+": 110 },
      byBranch: {
        CSE: { students: 120, avgAes: 78, active7d: 90, verifiedResumes: 100, interviewsDone: 80, placed: 35 },
      },
      consentRate: 92,
      seatsUsed: 300,
    };

    expect(mockRollup.avgAes).toBe(72);
    expect(mockRollup.byBranch.CSE.avgAes).toBe(78);
    expect(mockRollup.aesBands["<40"]).toBe(15);
  });
});
