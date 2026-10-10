import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Task P16 — Safe Staging Deployment & Configuration Verification", () => {
  it("verifies .env.staging.example template file exists and contains staging parameters", () => {
    const envPath = path.resolve(__dirname, "../../.env.staging.example");
    expect(fs.existsSync(envPath)).toBe(true);

    const envContent = fs.readFileSync(envPath, "utf-8");
    expect(envContent).toContain("VITE_APP_PRODUCT=CAMPUS_OS");
    expect(envContent).toContain("VITE_APP_ENVIRONMENT=staging");
    expect(envContent).toContain("VITE_FIREBASE_PROJECT_ID=aivi-campus-stg");
    expect(envContent).toContain("VITE_FIREBASE_AUTH_DOMAIN=aivi-campus-stg.firebaseapp.com");
    expect(envContent).toContain("VITE_FIREBASE_API_KEY=");
    expect(envContent).toContain("VITE_FIREBASE_STORAGE_BUCKET=aivi-campus-stg.appspot.com");
    expect(envContent).toContain("VITE_FIREBASE_MESSAGING_SENDER_ID=");
    expect(envContent).toContain("VITE_FIREBASE_APP_ID=");
    expect(envContent).toContain("VITE_BUILD_VERSION=");
    expect(envContent).toContain("VITE_GIT_COMMIT_SHA=");
    expect(envContent).toContain("VITE_RAZORPAY_KEY_ID=");
  });

  it("verifies package.json contains build:staging script", () => {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    expect(pkg.scripts["build:staging"]).toBe("vite build --mode staging");
  });

  it("verifies .firebaserc contains staging project target aivi-campus-stg and no default aivi-career", () => {
    const firebaseRcPath = path.resolve(__dirname, "../../.firebaserc");
    const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, "utf-8"));

    expect(firebaseRc.projects.staging).toBe("aivi-campus-stg");
    expect(firebaseRc.projects.default).toBeUndefined();
  });

  it("verifies firebase.json contains hosting configuration with X-Robots-Tag: noindex, nofollow", () => {
    const firebaseJsonPath = path.resolve(__dirname, "../../firebase.json");
    const firebaseJson = JSON.parse(fs.readFileSync(firebaseJsonPath, "utf-8"));

    const hostingConfig = Array.isArray(firebaseJson.hosting) ? firebaseJson.hosting[0] : firebaseJson.hosting;
    expect(hostingConfig).toBeDefined();

    const headers = hostingConfig.headers[0].headers;
    const robotsTag = headers.find((hdr: any) => hdr.key === "X-Robots-Tag");
    expect(robotsTag).toBeDefined();
    expect(robotsTag.value).toBe("noindex, nofollow");
  });

  it("verifies functions/src/index.ts exports processMailQueue and bootstrapPlatformAdmin with safety guards", () => {
    const indexCode = fs.readFileSync(path.resolve(__dirname, "../../functions/src/index.ts"), "utf-8");

    expect(indexCode).toContain("export const processMailQueue = onDocumentCreated");
    expect(indexCode).toContain("MAIL_ALLOWLIST");
    expect(indexCode).toContain("suppressed: true");

    expect(indexCode).toContain("export const bootstrapPlatformAdmin = onRequest");
    expect(indexCode).toContain('currentProject === "aivi-career"');
    expect(indexCode).toContain("SETUP_TOKEN");
    expect(indexCode).toContain("BOOTSTRAP_PLATFORM_ADMIN");
  });

  it("verifies STAGING_COMMANDS.md runbook exists and contains setup instructions", () => {
    const runbookPath = path.resolve(__dirname, "../../STAGING_COMMANDS.md");
    expect(fs.existsSync(runbookPath)).toBe(true);

    const runbookContent = fs.readFileSync(runbookPath, "utf-8");
    expect(runbookContent).toContain("npx firebase login");
    expect(runbookContent).toContain("npx firebase use staging");
    expect(runbookContent).toContain("npm run build:staging");
    expect(runbookContent).toContain("bootstrapPlatformAdmin");
  });
});
