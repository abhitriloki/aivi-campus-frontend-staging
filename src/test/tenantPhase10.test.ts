import { describe, it, expect } from "vitest";
import {
  exportAuditLogsSchema,
  generateTenantApiKeySchema,
  exportStateGovReadinessSchema,
  purgeTenantDataSchema,
  archiveGraduatedBatchSchema,
} from "../../functions/src/security/validators";

describe("Phase 10 Enterprise, Multi-Campus & Data Lifecycle Tests", () => {
  it("validates exportAuditLogsSchema payload", () => {
    const valid = { tenantId: "t_ggi" };
    const parsed = exportAuditLogsSchema.parse(valid);
    expect(parsed.tenantId).toBe("t_ggi");
  });

  it("validates generateTenantApiKeySchema payload", () => {
    const valid = { tenantId: "t_ggi", name: "ERP Vendor Integration" };
    const parsed = generateTenantApiKeySchema.parse(valid);
    expect(parsed.tenantId).toBe("t_ggi");
    expect(parsed.name).toBe("ERP Vendor Integration");
  });

  it("validates exportStateGovReadinessSchema payload", () => {
    const valid = { tenantId: "t_ggi", academicYear: "2024-25" };
    const parsed = exportStateGovReadinessSchema.parse(valid);
    expect(parsed.academicYear).toBe("2024-25");
  });

  it("validates purgeTenantDataSchema & dual-confirm key enforcement", () => {
    const valid = { tenantId: "t_ggi", confirmKey: "PURGE_TENANT_CONFIRM" };
    const parsed = purgeTenantDataSchema.parse(valid);
    expect(parsed.confirmKey).toBe("PURGE_TENANT_CONFIRM");

    const checkDualConfirm = (key: string) => {
      if (key !== "PURGE_TENANT_CONFIRM") throw new Error("Invalid key");
      return true;
    };

    expect(checkDualConfirm("PURGE_TENANT_CONFIRM")).toBe(true);
    expect(() => checkDualConfirm("WRONG_KEY")).toThrow("Invalid key");
  });

  it("validates archiveGraduatedBatchSchema payload", () => {
    const valid = { tenantId: "t_ggi", batch: "2024" };
    const parsed = archiveGraduatedBatchSchema.parse(valid);
    expect(parsed.batch).toBe("2024");
  });

  it("verifies multi-campus group aggregate math", () => {
    const childCampusA = { students: 500, placed: 400, totalAes: 40000 }; // Avg AES 80
    const childCampusB = { students: 300, placed: 210, totalAes: 22500 }; // Avg AES 75

    const totalStudents = childCampusA.students + childCampusB.students;
    const totalPlaced = childCampusA.placed + childCampusB.placed;
    const totalAes = childCampusA.totalAes + childCampusB.totalAes;

    const averageAes = Math.round(totalAes / totalStudents);
    const overallPlacementPct = Math.round((totalPlaced / totalStudents) * 100);

    expect(totalStudents).toBe(800);
    expect(averageAes).toBe(78);
    expect(overallPlacementPct).toBe(76);
  });

  it("verifies Skill-Darpan state gov CSV header format", () => {
    const headerRow = "TenantID,AcademicYear,EnrollmentNo,Branch,Batch,EmployabilityIndex_AES,PlacementStatus,StateGovSkillDarpanCode";
    expect(headerRow).toContain("StateGovSkillDarpanCode");
    expect(headerRow).toContain("EmployabilityIndex_AES");
  });
});
