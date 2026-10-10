import { describe, it, expect } from "vitest";
import {
  getTenantBrandingSchema,
  acceptDpdpConsentSchema,
  inviteCoordinatorSchema,
  deactivateStaffSchema,
} from "../../functions/src/security/validators";

describe("Phase 2 Campus Branding, DPDP Consent & Staff Management Tests", () => {
  it("validates getTenantBrandingSchema payload correctly", () => {
    const valid = { code: "ggi" };
    const parsed = getTenantBrandingSchema.parse(valid);
    expect(parsed.code).toBe("ggi");

    expect(() => getTenantBrandingSchema.parse({ code: "" })).toThrow();
  });

  it("validates acceptDpdpConsentSchema payload with defaults", () => {
    const defaultPayload = {};
    const parsed = acceptDpdpConsentSchema.parse(defaultPayload);
    expect(parsed.locale).toBe("en");
    expect(parsed.version).toBe("v1.0");

    const hindiPayload = { locale: "hi", version: "v1.1" };
    const parsedHindi = acceptDpdpConsentSchema.parse(hindiPayload);
    expect(parsedHindi.locale).toBe("hi");
    expect(parsedHindi.version).toBe("v1.1");
  });

  it("validates inviteCoordinatorSchema with branchScope filtering", () => {
    const payload = {
      name: "Prof. Rajesh Kumar",
      email: "rajesh@ggi.ac.in",
      branchScope: ["CSE", "ECE"],
    };

    const parsed = inviteCoordinatorSchema.parse(payload);
    expect(parsed.name).toBe("Prof. Rajesh Kumar");
    expect(parsed.branchScope).toEqual(["CSE", "ECE"]);
  });

  it("validates deactivateStaffSchema payload", () => {
    const payload = { targetUid: "user_coord_123" };
    const parsed = deactivateStaffSchema.parse(payload);
    expect(parsed.targetUid).toBe("user_coord_123");
  });

  it("seeds 3 demo tenants with distinct branding palettes", () => {
    const demoTenants = [
      {
        code: "ggi",
        name: "Gulzar Group of Institutions",
        branding: { logoUrl: "https://ggi.ac.in/logo.png", primaryColor: "#169C8F", loginHeadline: "GGI Placement Portal" },
      },
      {
        code: "cu",
        name: "Chandigarh University",
        branding: { logoUrl: "https://cuchd.in/logo.png", primaryColor: "#E11D48", loginHeadline: "CU Career Command Center" },
      },
      {
        code: "lpu",
        name: "Lovely Professional University",
        branding: { logoUrl: "https://lpu.in/logo.png", primaryColor: "#2563EB", loginHeadline: "LPU Placement Cell" },
      },
    ];

    expect(demoTenants.length).toBe(3);
    const codes = new Set(demoTenants.map((t) => t.code));
    expect(codes.size).toBe(3);
    expect(demoTenants[0].branding.primaryColor).not.toBe(demoTenants[1].branding.primaryColor);
  });
});
