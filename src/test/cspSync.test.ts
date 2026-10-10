import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Content-Security-Policy Sync Test", () => {
  it("verifies public/.htaccess and firebase.json CSP directives match and contain Razorpay domains", () => {
    const htaccessPath = path.resolve(__dirname, "../../public/.htaccess");
    const firebaseJsonPath = path.resolve(__dirname, "../../firebase.json");

    const htaccessContent = fs.readFileSync(htaccessPath, "utf-8");
    const firebaseJsonContent = fs.readFileSync(firebaseJsonPath, "utf-8");

    const htaccessCspMatch = htaccessContent.match(/Header set Content-Security-Policy "([^"]+)"/);
    expect(htaccessCspMatch).not.toBeNull();
    const htaccessCsp = htaccessCspMatch![1];

    const firebaseJson = JSON.parse(firebaseJsonContent);
    const hostingConfig = Array.isArray(firebaseJson.hosting)
      ? firebaseJson.hosting.find((h: any) => h.target === "default") || firebaseJson.hosting[0]
      : firebaseJson.hosting;
    const firebaseHeaders = hostingConfig.headers[0].headers;
    const firebaseCspObj = firebaseHeaders.find((h: any) => h.key === "Content-Security-Policy");
    expect(firebaseCspObj).toBeDefined();
    const firebaseCsp = firebaseCspObj.value;

    // Both CSPs must match exactly
    expect(htaccessCsp).toBe(firebaseCsp);

    // Must contain essential Razorpay domains
    expect(htaccessCsp).toContain("https://checkout.razorpay.com");
    expect(htaccessCsp).toContain("https://api.razorpay.com");
    expect(htaccessCsp).toContain("https://lumberjack.razorpay.com");
  });
});
