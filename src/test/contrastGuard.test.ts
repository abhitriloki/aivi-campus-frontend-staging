import { describe, it, expect } from "vitest";
import {
  getLuminance,
  getContrastRatio,
  accessibleOn,
  ensureTenantAccent,
} from "../utils/contrastGuard";
import { CHIP_TOKENS } from "../components/report/Chip";

describe("Contrast Guard Utility Tests (WCAG 2.1 AA Compliance)", () => {
  it("calculates relative luminance correctly", () => {
    expect(getLuminance("#ffffff")).toBeCloseTo(1.0, 2);
    expect(getLuminance("#000000")).toBeCloseTo(0.0, 2);
  });

  it("calculates contrast ratio between black and white", () => {
    const ratio = getContrastRatio("#ffffff", "#000000");
    expect(ratio).toBeCloseTo(21.0, 1);
  });

  it("recommends accessible foreground text (#ffffff or #0f172a) with >= 4.5:1 contrast", () => {
    // Dark background -> White text
    expect(accessibleOn("#000000")).toBe("#ffffff");
    expect(accessibleOn("#0b131e")).toBe("#ffffff");

    // Light / Mid-luminance background -> Dark text for maximum WCAG AA readability
    expect(accessibleOn("#ffffff")).toBe("#0f172a");
    expect(accessibleOn("#66CCFF")).toBe("#0f172a");
    expect(accessibleOn("#FFFF00")).toBe("#0f172a");

    // Verify contrast ratio is always >= 4.5:1
    const bg = "#169C8F";
    const text = accessibleOn(bg);
    const ratio = getContrastRatio(bg, text);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("auto-corrects terrible high-luminance tenant colors for dark backgrounds", () => {
    const terribleAccent = "#66CCFF";
    const darkBg = "#0b131e";

    const safeAccent = ensureTenantAccent(terribleAccent, darkBg, 3.0);
    const ratio = getContrastRatio(safeAccent, darkBg);

    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("auto-corrects neon yellow accent for light backgrounds", () => {
    const neonYellow = "#FFFF00";
    const lightBg = "#ffffff";

    const safeAccent = ensureTenantAccent(neonYellow, lightBg, 3.0);
    const ratio = getContrastRatio(safeAccent, lightBg);

    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("leaves compliant brand colors intact", () => {
    const brandTeal = "#169C8F";
    const darkBg = "#0b131e";

    const safeAccent = ensureTenantAccent(brandTeal, darkBg, 3.0);
    expect(safeAccent).toBe(brandTeal);
  });

  it("asserts all 4 Report Kit chip design tokens satisfy WCAG AA >= 4.5:1 contrast", () => {
    Object.entries(CHIP_TOKENS).forEach(([name, token]) => {
      const ratio = getContrastRatio(token.text, token.bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
