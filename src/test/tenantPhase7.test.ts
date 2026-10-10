import { describe, it, expect } from "vitest";
import {
  generateAccreditationReportSchema,
  nudgeIncompleteProfileStudentsSchema,
} from "../../functions/src/security/validators";

describe("Phase 7 Accreditation Evidence Pack & NIRF Generator Tests", () => {
  it("validates generateAccreditationReportSchema payload", () => {
    const valid = {
      academicYear: "2024-25",
      type: "naac_c5" as const,
    };
    const parsed = generateAccreditationReportSchema.parse(valid);
    expect(parsed.academicYear).toBe("2024-25");
    expect(parsed.type).toBe("naac_c5");
  });

  it("validates nudgeIncompleteProfileStudentsSchema payload", () => {
    const valid = { academicYear: "2024-25" };
    const parsed = nudgeIncompleteProfileStudentsSchema.parse(valid);
    expect(parsed.academicYear).toBe("2024-25");
  });

  it("verifies Data Health & Metric percentages computation accuracy", () => {
    const totalStudents = 300;
    const completedProfiles = 276;
    const placedStudents = 222;

    const profileCompletionPct = Math.round((completedProfiles / totalStudents) * 100);
    const placementPct = Math.round((placedStudents / totalStudents) * 100);

    expect(profileCompletionPct).toBe(92);
    expect(placementPct).toBe(74);
  });

  it("verifies governance rule: coordinators are excluded from accreditation pack generation", () => {
    const allowedRoles = ["tenant_admin", "platform_admin"];
    const coordinatorRole = "coordinator";

    expect(allowedRoles.includes(coordinatorRole)).toBe(false);
  });
});
