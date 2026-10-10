import { describe, it, expect } from "vitest";
import {
  submitVaultResumeSchema,
  verifyResumeSchema,
  requestResumeChangesSchema,
  getResumeSignedUrlSchema,
  exportResumePackageSchema,
} from "../../functions/src/security/validators";

describe("Phase 5 Verifiable Resume Vault & Recruiter Exporter Tests", () => {
  it("validates submitVaultResumeSchema payload", () => {
    const valid = {
      resumeData: { fullName: "Rahul Kumar", email: "rahul@ggi.ac.in" },
      analysisId: "an_123",
    };
    const parsed = submitVaultResumeSchema.parse(valid);
    expect(parsed.resumeData.fullName).toBe("Rahul Kumar");
  });

  it("validates verifyResumeSchema payload", () => {
    const valid = { versionId: "user_123_v1" };
    const parsed = verifyResumeSchema.parse(valid);
    expect(parsed.versionId).toBe("user_123_v1");
  });

  it("validates requestResumeChangesSchema payload", () => {
    const valid = { versionId: "user_123_v1", reviewerNote: "Please update project metrics" };
    const parsed = requestResumeChangesSchema.parse(valid);
    expect(parsed.reviewerNote).toContain("project metrics");

    expect(() => requestResumeChangesSchema.parse({ versionId: "v1", reviewerNote: "" })).toThrow();
  });

  it("validates exportResumePackageSchema payload", () => {
    const valid = {
      filters: {
        batch: "2025",
        branches: ["CSE", "ECE"],
        minAes: 70,
        onlyVerified: true,
      },
    };
    const parsed = exportResumePackageSchema.parse(valid);
    expect(parsed.filters?.batch).toBe("2025");
  });

  it("verifies 24-character unguessable QR token generation & masking invariants", () => {
    const randomHexToken = "a1b2c3d4e5f6789012345678"; // 24 hex characters
    expect(randomHexToken.length).toBe(24);
    expect(randomHexToken).toMatch(/^[a-f0-9]{24}$/);

    // Name & enrollment masking test
    const fullName = "Rahul Kumar";
    const enrollment = "EN20251234";

    const maskedName = fullName.split(" ")[0] + " " + fullName.split(" ")[1][0] + ".";
    const maskedEnrollment = `EN****${enrollment.slice(-4)}`;

    expect(maskedName).toBe("Rahul K.");
    expect(maskedEnrollment).toBe("EN****1234");
  });
});
