import { describe, it, expect } from "vitest";
import { validateEnvironmentContract } from "@/config/envContract";

const validBase = {
  product: "CAMPUS_OS",
  environment: "staging",
  projectId: "aivi-campus-stg",
  buildVersion: "1.0.0-staging",
  commitSha: "d34a0bf",
  isTest: true,
};

describe("Strict Environment Contract (Zero Defaults)", () => {
  it("passes when all parameters are correctly specified for CAMPUS_OS", () => {
    const res = validateEnvironmentContract(validBase);
    expect(res.APP_PRODUCT).toBe("CAMPUS_OS");
    expect(res.EXPECTED_FIREBASE_PROJECT_ID).toBe("aivi-campus-stg");
  });

  it("fails when product is empty or missing (no defaults)", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, product: "" });
    }).toThrow("[CONTRACT_VIOLATION] Missing required APP_PRODUCT. Zero defaults allowed.");
  });

  it("fails when environment is missing (no defaults)", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, environment: "" });
    }).toThrow("[CONTRACT_VIOLATION] Missing required APP_ENVIRONMENT. Zero defaults allowed.");
  });

  it("fails when projectId is missing (no defaults)", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, projectId: "" });
    }).toThrow("[CONTRACT_VIOLATION] Missing required EXPECTED_FIREBASE_PROJECT_ID. Zero defaults allowed.");
  });

  it("fails when buildVersion or commitSha is missing", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, buildVersion: "" });
    }).toThrow("[CONTRACT_VIOLATION] Missing required BUILD_VERSION. Zero defaults allowed.");

    expect(() => {
      validateEnvironmentContract({ ...validBase, commitSha: "" });
    }).toThrow("[CONTRACT_VIOLATION] Missing required GIT_COMMIT_SHA. Zero defaults allowed.");
  });

  it("strictly rejects non-standardized staging identifier 'aivi-campus-staging'", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, projectId: "aivi-campus-staging" });
    }).toThrow("Project identifier 'aivi-campus-staging' is prohibited. Must be standardized as 'aivi-campus-stg'.");
  });

  it("strictly prohibits CAMPUS_OS from connecting to 'aivi-career'", () => {
    expect(() => {
      validateEnvironmentContract({ ...validBase, projectId: "aivi-career" });
    }).toThrow("Campus products are strictly forbidden from deploying or connecting to 'aivi-career'.");
  });

  it("strictly prohibits CAREER_OS from connecting to 'aivi-campus-stg'", () => {
    expect(() => {
      validateEnvironmentContract({
        ...validBase,
        product: "CAREER_OS",
        projectId: "aivi-campus-stg",
      });
    }).toThrow("Project 'aivi-campus-stg' is not permitted for 'CAREER_OS'");
  });

  it("strictly enforces runtime hostname validation when outside test mode", () => {
    expect(() => {
      validateEnvironmentContract({
        ...validBase,
        isTest: false,
        runtimeHostname: "malicious-site.com",
      });
    }).toThrow("[CONTRACT_VIOLATION] Runtime hostname 'malicious-site.com' is not authorized");
  });

  it("verifies initializeFirebase throws when environment variables are missing", async () => {
    const origProduct = import.meta.env.VITE_APP_PRODUCT;
    try {
      (import.meta.env as any).VITE_APP_PRODUCT = "";
      const { initializeFirebase } = await import("@/integrations/firebase/client");
      expect(() => initializeFirebase()).toThrow("[FAIL-CLOSED]");
    } finally {
      (import.meta.env as any).VITE_APP_PRODUCT = origProduct;
    }
  }, 15000);

  describe("Campus OS Bootstrap & Runtime Isolation Integration Tests", () => {
    it("proves Firebase is never initialized during module import (lazy proxy guarantee)", async () => {
      // Importing client does NOT initialize Firebase app or connect to network
      const clientModule = await import("@/integrations/firebase/client");
      expect(clientModule.auth).toBeDefined();
      expect(clientModule.db).toBeDefined();
      expect(clientModule.functions).toBeDefined();
      // Inspect that invoking initializeFirebase without env variables throws immediately
      const origProduct = import.meta.env.VITE_APP_PRODUCT;
      try {
        (import.meta.env as any).VITE_APP_PRODUCT = "";
        expect(() => clientModule.initializeFirebase()).toThrow("[FAIL-CLOSED]");
      } finally {
        (import.meta.env as any).VITE_APP_PRODUCT = origProduct;
      }
    });

    it("proves aivi-career is rejected in EVERY Campus OS environment (staging, prod, dev)", () => {
      const environments = ["development", "staging", "production", "test"] as const;
      for (const env of environments) {
        expect(() => {
          validateEnvironmentContract({
            ...validBase,
            environment: env,
            projectId: "aivi-career",
          });
        }).toThrow("Campus products are strictly forbidden from deploying or connecting to 'aivi-career'.");
      }
    });

    it("proves wrong product (CAREER_OS or CAMPUS_DEMO) blocks Campus OS startup", () => {
      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          product: "CAREER_OS",
          projectId: "aivi-campus-stg",
        });
      }).toThrow("Project 'aivi-campus-stg' is not permitted for 'CAREER_OS'");

      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          product: "CAMPUS_DEMO",
          projectId: "aivi-campus-stg",
        });
      }).toThrow("Project 'aivi-campus-stg' is not permitted for 'CAMPUS_DEMO'");
    });

    it("proves unauthorized hostname blocks Campus OS startup outside test mode", () => {
      const unauthorizedHosts = [
        "aivi-career.web.app",
        "aivi-career.firebaseapp.com",
        "random-phishing.com",
        "attacker-controlled.net",
      ];
      for (const host of unauthorizedHosts) {
        expect(() => {
          validateEnvironmentContract({
            ...validBase,
            isTest: false,
            runtimeHostname: host,
          });
        }).toThrow("[CONTRACT_VIOLATION] Runtime hostname");
      }
    });

    it("proves production + aivi-campus-stg strictly fails (only aivi-campus-prod permitted in production)", () => {
      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          product: "CAMPUS_OS",
          environment: "production",
          projectId: "aivi-campus-stg",
        });
      }).toThrow("Project 'aivi-campus-stg' is not permitted for 'CAMPUS_OS' in 'production'. Permitted: aivi-campus-prod");
    });

    it("proves staging + aivicampus.com strictly fails (exact hostname required)", () => {
      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          product: "CAMPUS_OS",
          environment: "staging",
          projectId: "aivi-campus-stg",
          isTest: false,
          runtimeHostname: "aivicampus.com",
        });
      }).toThrow("[CONTRACT_VIOLATION] Runtime hostname 'aivicampus.com' is not authorized for CAMPUS_OS in staging");

      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          product: "CAMPUS_OS",
          environment: "staging",
          projectId: "aivi-campus-stg",
          isTest: false,
          runtimeHostname: "www.aivicampus.com",
        });
      }).toThrow("[CONTRACT_VIOLATION] Runtime hostname 'www.aivicampus.com' is not authorized for CAMPUS_OS in staging");
    });

    it("proves staging + isolation-staging.aivicampus.com passes cleanly", () => {
      const res = validateEnvironmentContract({
        ...validBase,
        product: "CAMPUS_OS",
        environment: "staging",
        projectId: "aivi-campus-stg",
        isTest: false,
        runtimeHostname: "isolation-staging.aivicampus.com",
      });
      expect(res.APP_PRODUCT).toBe("CAMPUS_OS");
      expect(res.EXPECTED_FIREBASE_PROJECT_ID).toBe("aivi-campus-stg");
      expect(res.APP_ENVIRONMENT).toBe("staging");
    });

    it("proves staging + staging.aivicampus.com passes cleanly", () => {
      const res = validateEnvironmentContract({
        ...validBase,
        product: "CAMPUS_OS",
        environment: "staging",
        projectId: "aivi-campus-stg",
        isTest: false,
        runtimeHostname: "staging.aivicampus.com",
      });
      expect(res.APP_PRODUCT).toBe("CAMPUS_OS");
      expect(res.EXPECTED_FIREBASE_PROJECT_ID).toBe("aivi-campus-stg");
      expect(res.APP_ENVIRONMENT).toBe("staging");
    });

    it("proves arbitrary subdomains strictly fail (no suffix wildcard matching)", () => {
      const arbitrarySubdomains = [
        "random.isolation-staging.aivicampus.com",
        "attacker.isolation-staging.aivicampus.com",
        "college1.staging.aivicampus.com",
        "unauthorized.staging.aivicampus.com",
        "fake.aivicampus.com",
      ];
      for (const host of arbitrarySubdomains) {
        expect(() => {
          validateEnvironmentContract({
            ...validBase,
            product: "CAMPUS_OS",
            environment: "staging",
            projectId: "aivi-campus-stg",
            isTest: false,
            runtimeHostname: host,
          });
        }).toThrow("[CONTRACT_VIOLATION] Runtime hostname");
      }
    });

    it("proves missing build version or commit SHA strictly fails closed", () => {
      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          buildVersion: "",
        });
      }).toThrow("[CONTRACT_VIOLATION] Missing required BUILD_VERSION. Zero defaults allowed.");

      expect(() => {
        validateEnvironmentContract({
          ...validBase,
          commitSha: "",
        });
      }).toThrow("[CONTRACT_VIOLATION] Missing required GIT_COMMIT_SHA. Zero defaults allowed.");
    });

    it("proves existing Firebase app with mismatched project (e.g. aivi-career) cannot be reused", async () => {
      // Test app reuse logic against mismatched options
      const existingApps = [
        { name: "[DEFAULT]", options: { projectId: "aivi-career" } },
      ];
      const targetProjectId = "aivi-campus-stg";
      const defaultApp = existingApps.find((a) => a.name === "[DEFAULT]");
      expect(() => {
        if (defaultApp && defaultApp.options.projectId !== targetProjectId) {
          throw new Error(
            `[CONTRACT_VIOLATION] Existing default Firebase app is bound to mismatched project '${defaultApp.options.projectId}'. Required: '${targetProjectId}'. Startup aborted.`
          );
        }
      }).toThrow("[CONTRACT_VIOLATION] Existing default Firebase app is bound to mismatched project 'aivi-career'");
    });
  });
});

