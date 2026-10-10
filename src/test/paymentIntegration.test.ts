import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Payment Gateway Integration & Diagnostics Suite", () => {
  it("verifies Razorpay CSP domains exist in both public/.htaccess and firebase.json", () => {
    const htaccess = fs.readFileSync(path.resolve(__dirname, "../../public/.htaccess"), "utf-8");
    const firebaseJson = fs.readFileSync(path.resolve(__dirname, "../../firebase.json"), "utf-8");

    // Must include checkout, api, and lumberjack endpoints in connect-src / frame-src / script-src
    const requiredDomains = [
      "https://checkout.razorpay.com",
      "https://api.razorpay.com",
      "https://lumberjack.razorpay.com",
    ];

    requiredDomains.forEach((domain) => {
      expect(htaccess).toContain(domain);
      expect(firebaseJson).toContain(domain);
    });
  });

  it("verifies payment service loader timeout and error handling is defined", async () => {
    const paymentServiceCode = fs.readFileSync(path.resolve(__dirname, "../services/paymentService.ts"), "utf-8");

    expect(paymentServiceCode).toContain("loadRazorpay");
    expect(paymentServiceCode).toContain("10000"); // 10s loader timeout
    expect(paymentServiceCode).toContain("ondismiss");
    expect(paymentServiceCode).toContain("Unable to load Razorpay checkout script");
  });

  it("verifies createPaymentOrder preflight validation in Cloud Functions", () => {
    const functionsCode = fs.readFileSync(path.resolve(__dirname, "../../functions/src/index.ts"), "utf-8");

    expect(functionsCode).toContain("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET");
    expect(functionsCode).toContain("failed-precondition");
    expect(functionsCode).toContain("payment_telemetry");
    expect(functionsCode).toContain("already_processed");
  });
});
