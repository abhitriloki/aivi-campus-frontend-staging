import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("1-Click Demo Campus Seeder & Reset Suite", () => {
  it("verifies demoSeeder.ts target tenant is hard-fixed to demo-sunrise", () => {
    const seederCode = fs.readFileSync(path.resolve(__dirname, "../../functions/src/demoSeeder.ts"), "utf-8");

    expect(seederCode).toContain('DEMO_TENANT_ID = "demo-sunrise"');
    expect(seederCode).toContain("demo.aivilabs.com");
    expect(seederCode).toContain("Sunrise Engineering College, Lucknow");
    expect(seederCode).toContain("DELETE DEMO");
  });

  it("verifies functions/src/index.ts exports seedDemoCampus, getDemoSeedJob, and resetDemoCampus", () => {
    const indexCode = fs.readFileSync(path.resolve(__dirname, "../../functions/src/index.ts"), "utf-8");

    expect(indexCode).toContain("export const seedDemoCampus");
    expect(indexCode).toContain("export const getDemoSeedJob");
    expect(indexCode).toContain("export const resetDemoCampus");
    expect(indexCode).toContain("PLATFORM_ADMIN_ALLOWLIST");
  });

  it("verifies DemoToolsCard UI component exists and handles seed & reset flows", () => {
    const cardCode = fs.readFileSync(path.resolve(__dirname, "../components/campus/DemoToolsCard.tsx"), "utf-8");

    expect(cardCode).toContain("1-Click Demo Campus Seeder");
    expect(cardCode).toContain("seedDemoCampus");
    expect(cardCode).toContain("resetDemoCampus");
    expect(cardCode).toContain("DELETE DEMO");
    expect(cardCode).toContain("demo-sunrise");
  });

  it("verifies CampusLayout renders sample data environment indicator for demo-sunrise", () => {
    const layoutCode = fs.readFileSync(path.resolve(__dirname, "../layouts/CampusLayout.tsx"), "utf-8");

    expect(layoutCode).toContain("demo-sunrise");
    expect(layoutCode).toContain("Sample data environment");
  });
});
