import { describe, it, expect, beforeEach } from "vitest";
import { getTenantBranding, listTenantsPublic } from "../services/tenantService";

describe("Dynamic Tenant Onboarding & Branding Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("resolves created demo tenant branding from localStorage without falling back to Sunrise", async () => {
    const demoTenant = {
      tenantId: "t-aivi-test123",
      id: "t-aivi-test123",
      code: "aivi",
      name: "AIVI Institute of Technology",
      adminEmail: "director@aivi.ac.in",
      adminName: "Dr. Aivi Director",
      adminPassword: "AiviCampus@2026",
      maxSeats: 2500,
      seats: 2500,
      seatsUsed: 0,
      status: "active",
      type: "college",
      plan: "pro",
      branding: {
        logoUrl: "https://example.com/logo.png",
        primaryColor: "#0D9488",
        accentColor: "#F59E0B",
        loginHeadline: "Sign in to AIVI Institute of Technology Placement Portal",
      },
    };

    localStorage.setItem("aivi_demo_created_tenants", JSON.stringify([demoTenant]));

    const resolved = await getTenantBranding("aivi");
    expect(resolved).toBeDefined();
    expect(resolved.name).toBe("AIVI Institute of Technology");
    expect(resolved.code).toBe("AIVI");
    expect(resolved.branding.primaryColor).toBe("#0D9488");
    expect((resolved as any).adminEmail).toBe("director@aivi.ac.in");
  });

  it("merges created demo tenants into listTenantsPublic response", async () => {
    const demoTenant = {
      tenantId: "t-delhi-tech",
      id: "t-delhi-tech",
      code: "delhiteck",
      name: "Delhi Tech Campus",
      adminEmail: "tpo@delhitech.ac.in",
      adminName: "Prof. Tech",
      maxSeats: 1500,
      status: "active",
      type: "university",
      plan: "university",
    };

    localStorage.setItem("aivi_demo_created_tenants", JSON.stringify([demoTenant]));

    const res = await listTenantsPublic();
    expect(res.tenants.length).toBeGreaterThan(0);
    const found = res.tenants.find((t) => t.id === "t-delhi-tech" || t.code === "DELHITECK");
    expect(found).toBeDefined();
    expect(found?.name).toBe("Delhi Tech Campus");
  }, 15000);

  it("verifies student CSV parsing structure conforms to student directory fields", () => {
    const sampleCsv = "name,email,enrollment_no,branch,batch,phone,cgpa\nJohn Doe,john@aivi.ac.in,ENR001,CSE,2026,9876543210,8.9";
    const lines = sampleCsv.split("\n");
    const headers = lines[0].split(",");
    const values = lines[1].split(",");

    expect(headers).toContain("email");
    expect(headers).toContain("name");
    expect(headers).toContain("branch");
    expect(values[headers.indexOf("email")]).toBe("john@aivi.ac.in");
    expect(parseFloat(values[headers.indexOf("cgpa")])).toBe(8.9);
  });
});
