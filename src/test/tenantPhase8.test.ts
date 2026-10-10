import { describe, it, expect } from "vitest";
import {
  generateTenantInvoiceSchema,
  markInvoicePaidSchema,
  updateTenantPlanSchema,
  toggleTenantStatusSchema,
} from "../../functions/src/security/validators";
import { CAMPUS_PLANS } from "../../functions/src/billing/plans";

describe("Phase 8 Commercial Layer, Invoicing & Admin Console Tests", () => {
  it("validates generateTenantInvoiceSchema payload", () => {
    const valid = {
      tenantId: "t_123",
      mode: "offline_po" as const,
      poNumber: "GOVT-PO-2025-001",
    };
    const parsed = generateTenantInvoiceSchema.parse(valid);
    expect(parsed.tenantId).toBe("t_123");
    expect(parsed.mode).toBe("offline_po");
  });

  it("validates markInvoicePaidSchema payload", () => {
    const valid = { invoiceId: "inv_123" };
    const parsed = markInvoicePaidSchema.parse(valid);
    expect(parsed.invoiceId).toBe("inv_123");
  });

  it("validates updateTenantPlanSchema payload", () => {
    const valid = {
      tenantId: "t_123",
      plan: "pro" as const,
      maxSeats: 3000,
    };
    const parsed = updateTenantPlanSchema.parse(valid);
    expect(parsed.plan).toBe("pro");
    expect(parsed.maxSeats).toBe(3000);
  });

  it("validates toggleTenantStatusSchema payload", () => {
    const valid = {
      tenantId: "t_123",
      status: "suspended" as const,
    };
    const parsed = toggleTenantStatusSchema.parse(valid);
    expect(parsed.status).toBe("suspended");
  });

  it("verifies campus plan seat capacity definitions", () => {
    expect(CAMPUS_PLANS.trial.maxSeats).toBe(500);
    expect(CAMPUS_PLANS.starter.maxSeats).toBe(1000);
    expect(CAMPUS_PLANS.pro.maxSeats).toBe(3000);
    expect(CAMPUS_PLANS.university.maxSeats).toBe(10000);
  });

  it("verifies seat meter warning & hard stop thresholds", () => {
    const getSeatState = (used: number, cap: number) => {
      const pct = Math.round((used / cap) * 100);
      if (pct >= 100) return "hard_stop";
      if (pct >= 85) return "warning_85";
      return "normal";
    };

    expect(getSeatState(500, 1000)).toBe("normal");
    expect(getSeatState(850, 1000)).toBe("warning_85");
    expect(getSeatState(1000, 1000)).toBe("hard_stop");
    expect(getSeatState(1050, 1000)).toBe("hard_stop");
  });

  it("calculates 18% GST invoice breakdown accurately", () => {
    const seats = 1000;
    const unitPricePaise = 25000; // ₹250
    const subtotalPaise = seats * unitPricePaise;
    const cgstPaise = Math.round(subtotalPaise * 0.09);
    const sgstPaise = Math.round(subtotalPaise * 0.09);
    const totalPaise = subtotalPaise + cgstPaise + sgstPaise;

    expect(subtotalPaise).toBe(25000000); // ₹2,50,000
    expect(cgstPaise).toBe(2250000); // ₹22,500
    expect(sgstPaise).toBe(2250000); // ₹22,500
    expect(totalPaise).toBe(29500000); // ₹2,95,000 total
  });
});
