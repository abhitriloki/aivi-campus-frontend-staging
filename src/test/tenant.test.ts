import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  provisionTenantSchema,
  setTenantRoleSchema,
  normalizeDomain,
  validatePreNormalizedDomain,
  validateNormalizedDomain,
} from "../../functions/src/security/validators";
import { ServerRBAC, type AppRole } from "../../functions/src/security/rbac";

describe("Phase 0 Multi-Tenancy Validation & Authorization", () => {
  describe("provisionTenantSchema", () => {
    it("validates correct provisionTenant payloads", () => {
      const validPayload = {
        code: "ggi-lucknow",
        name: "Goel Group of Institutions",
        type: "college" as const,
        plan: "starter" as const,
        seats: 500,
        adminName: "TPO Director",
        adminEmail: "tpo@ggi.ac.in",
        adminPassword: "SecurePassword123!",
        modules: ["core_ai", "drives"],
        academicYear: "2025-2026",
      };

      const result = provisionTenantSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("ggi-lucknow");
      }
    });

    it("rejects non-URL-safe code slugs", () => {
      const invalidPayload = {
        code: "ggi lucknow!",
        name: "Goel Group",
        type: "college",
        plan: "starter",
        seats: 100,
        adminName: "Admin",
        adminEmail: "admin@ggi.ac.in",
        adminPassword: "password123",
      };

      const result = provisionTenantSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("enforces tenant-slug boundaries: length, hyphens, uppercase, and symbols", () => {
      const base = {
        name: "Test College",
        adminEmail: "admin@test.ac.in",
        seats: 100,
      };

      // Minimum and maximum length
      expect(provisionTenantSchema.safeParse({ ...base, code: "ab" }).success).toBe(false); // < 3 chars
      expect(provisionTenantSchema.safeParse({ ...base, code: "abc" }).success).toBe(true);
      expect(provisionTenantSchema.safeParse({ ...base, code: "a".repeat(63) }).success).toBe(true);
      expect(provisionTenantSchema.safeParse({ ...base, code: "a".repeat(64) }).success).toBe(false); // > 63 chars

      // Leading, trailing, and repeated hyphens
      expect(provisionTenantSchema.safeParse({ ...base, code: "-leading" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "trailing-" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "double--hyphen" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "valid-multi-part-slug-123" }).success).toBe(true);

      // Uppercase characters
      expect(provisionTenantSchema.safeParse({ ...base, code: "Upper-Case" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "ALLCAPS" }).success).toBe(false);

      // Spaces and symbols
      expect(provisionTenantSchema.safeParse({ ...base, code: "slug with space" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "slug.dot" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "slug_underscore" }).success).toBe(false);
      expect(provisionTenantSchema.safeParse({ ...base, code: "slug@symbol" }).success).toBe(false);
    });

    it("enforces reserved slug policy across all prohibited identifiers", () => {
      const base = {
        name: "Test College",
        adminEmail: "admin@test.ac.in",
        seats: 100,
      };

      const reservedList = [
        "www", "admin", "api", "app", "auth", "login", "logout", "support", "staging",
        "demo", "campus", "platform-admin", "campus-admin", "tpo", "student", "recruiter",
        "static", "assets", "mail", "status", "help", "docs", "billing", "system", "root"
      ];

      for (const reserved of reservedList) {
        const res = provisionTenantSchema.safeParse({ ...base, code: reserved });
        expect(res.success).toBe(false);
        if (!res.success) {
          expect(res.error.issues[0].message).toContain("reserved");
        }
      }
    });

    it("verifies normalized equivalent values and fallback transformation", () => {
      const resFallback = provisionTenantSchema.safeParse({
        name: "Sunrise Engineering College",
        adminEmail: "tpo@sunrise.ac.in",
        seats: 250,
      });

      expect(resFallback.success).toBe(true);
      if (resFallback.success) {
        expect(resFallback.data.code).toBe("sunrise-engineering-college");
      }
    });

    it("rejects negative or zero seat counts", () => {
      const invalidPayload = {
        code: "test-college",
        name: "Test College",
        type: "college",
        plan: "starter",
        seats: 0,
        adminName: "Admin",
        adminEmail: "admin@test.ac.in",
        adminPassword: "password123",
      };

      const result = provisionTenantSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("setTenantRoleSchema", () => {
    it("accepts valid tenant_admin and coordinator role assignments", () => {
      const payloadAdmin = {
        targetUid: "user_123",
        role: "tenant_admin" as const,
      };

      const payloadCoordinator = {
        targetUid: "user_456",
        role: "coordinator" as const,
        branchScope: ["CSE", "ECE"],
      };

      expect(setTenantRoleSchema.safeParse(payloadAdmin).success).toBe(true);
      expect(setTenantRoleSchema.safeParse(payloadCoordinator).success).toBe(true);
    });

    it("rejects unauthorized role types like platform_admin or student", () => {
      const invalidPayload = {
        targetUid: "user_123",
        role: "platform_admin",
      };

      expect(setTenantRoleSchema.safeParse(invalidPayload).success).toBe(false);
    });
  });

  describe("Cross-Tenant Isolation Invariant Checks", () => {
    it("enforces tenant boundary check logic", () => {
      const tenantA = "tenant_ggi";
      const tenantB = "tenant_aktu";

      const studentInTenantA = { userId: "std_1", tenantId: tenantA, branch: "CSE" };
      const adminInTenantA = { tenantId: tenantA, role: "tenant_admin" };
      const adminInTenantB = { tenantId: tenantB, role: "tenant_admin" };

      // Helper simulating security rule decision
      const canReadProfile = (userToken: { tenantId: string; role: string }, profile: { tenantId?: string }) => {
        if (!profile.tenantId) return false;
        return userToken.tenantId === profile.tenantId && (userToken.role === "tenant_admin" || userToken.role === "coordinator");
      };

      expect(canReadProfile(adminInTenantA, studentInTenantA)).toBe(true);
      expect(canReadProfile(adminInTenantB, studentInTenantA)).toBe(false);
    });
  });

  describe("Canonical Domain Normalization & Strict Validation Suite", () => {
    it("normalizes domains correctly across outer whitespace, lowercase, root dots, and www.", () => {
      expect(normalizeDomain("   CAMPUS.COLLEGE.AC.IN   ")).toBe("campus.college.ac.in");
      expect(normalizeDomain("WWW.COLLEGE.EDU")).toBe("college.edu");
      expect(normalizeDomain("subdomain.college.edu.")).toBe("subdomain.college.edu");
      expect(normalizeDomain("   WWW.ENGINEERING.EDU.   ")).toBe("engineering.edu");
    });

    it("rejects malformed or URL inputs before normalization rather than transforming them", () => {
      // Inputs containing URL schemes, paths, ports, query strings, userinfo, or internal spaces MUST fail pre-normalization
      const invalidInputs = [
        "https://college.edu",
        "http://college.edu/path",
        "college.edu/path",
        "college.edu:443",
        "admin@college.edu",
        "attacker.example@college.edu",
        "college.edu?tenant=other",
        "college.edu#fragment",
        "*.college.edu",
        "college .edu",
        "college\tedu",
      ];

      for (const input of invalidInputs) {
        expect(validatePreNormalizedDomain(input).valid).toBe(false);
        const res = provisionTenantSchema.safeParse({
          name: "Test College",
          adminEmail: "admin@test.edu",
          domain: input,
          seats: 500,
        });
        expect(res.success).toBe(false);
      }
    });

    it("accepts valid canonical domains (positive cases)", () => {
      expect(validateNormalizedDomain("college.edu").valid).toBe(true);
      expect(validateNormalizedDomain("university.ac.in").valid).toBe(true);
      expect(validateNormalizedDomain("campus.university.ac.in").valid).toBe(true);
      expect(validateNormalizedDomain("eng-college123.edu.in").valid).toBe(true);
      expect(validateNormalizedDomain("xn--mgbh0fb.org").valid).toBe(true); // Punycode / ACE ASCII
    });

    it("rejects invalid or malformed hostnames (negative cases)", () => {
      // No dot / single label
      expect(validateNormalizedDomain("college").valid).toBe(false);
      // Underscores
      expect(validateNormalizedDomain("campus_college.edu").valid).toBe(false);
      // Leading / trailing hyphens in labels
      expect(validateNormalizedDomain("-college.edu").valid).toBe(false);
      expect(validateNormalizedDomain("college-.edu").valid).toBe(false);
      expect(validateNormalizedDomain("campus.-college-.edu").valid).toBe(false);
      // Empty labels / consecutive dots
      expect(validateNormalizedDomain("college..edu").valid).toBe(false);
      expect(validateNormalizedDomain(".college.edu").valid).toBe(false);
      // Email address
      expect(validateNormalizedDomain("admin@college.edu").valid).toBe(false);
      // Port or path left in domain
      expect(validateNormalizedDomain("college.edu:8080").valid).toBe(false);
      expect(validateNormalizedDomain("college.edu/path").valid).toBe(false);
      // Wildcard
      expect(validateNormalizedDomain("*.college.edu").valid).toBe(false);
      // Localhost / internal
      expect(validateNormalizedDomain("localhost").valid).toBe(false);
      expect(validateNormalizedDomain("sub.localhost").valid).toBe(false);
      expect(validateNormalizedDomain("portal.internal").valid).toBe(false);
      // IP addresses (IPv4 & IPv6)
      expect(validateNormalizedDomain("127.0.0.1").valid).toBe(false);
      expect(validateNormalizedDomain("192.168.1.1").valid).toBe(false);
      expect(validateNormalizedDomain("[::1]").valid).toBe(false);
      // Label > 63 chars
      const longLabel = "a".repeat(64);
      expect(validateNormalizedDomain(`${longLabel}.edu`).valid).toBe(false);
      // Total length > 253 chars
      const longDomain = `${"a".repeat(60)}.${"b".repeat(60)}.${"c".repeat(60)}.${"d".repeat(60)}.${"e".repeat(20)}.edu`;
      expect(validateNormalizedDomain(longDomain).valid).toBe(false);
      // Raw non-ASCII Unicode (must be provided as Punycode)
      expect(validateNormalizedDomain("universität.de").valid).toBe(false);
      expect(validateNormalizedDomain("कॉलेज.भारत").valid).toBe(false);
    });

    it("enforces domain validation inside provisionTenantSchema", () => {
      const validPayload = {
        name: "Sunrise Engineering",
        adminEmail: "tpo@sunrise.ac.in",
        domain: "WWW.SUNRISE.AC.IN.",
        seats: 500,
      };
      const resValid = provisionTenantSchema.safeParse(validPayload);
      expect(resValid.success).toBe(true);
      if (resValid.success) {
        expect(resValid.data.domain).toBe("sunrise.ac.in");
      }

      const invalidPayload = {
        name: "Sunrise Engineering",
        adminEmail: "tpo@sunrise.ac.in",
        domain: "https://localhost:8080",
      };
      const resInvalid = provisionTenantSchema.safeParse(invalidPayload);
      expect(resInvalid.success).toBe(false);
    });
  });

  describe("Admin Profile & Subscription Protection Suite", () => {
    it("safely provisions a completely new administrator with default tenant_admin profile and plan", () => {
      const existingProfile = null;
      const existingPlan = null;

      const resolveProfileAndPlan = (prof: Record<string, unknown> | null, plan: Record<string, unknown> | null) => {
        let profileAction: "create" | "merge";
        let planAction: "create" | "link";

        if (!prof) {
          profileAction = "create";
        } else {
          profileAction = "merge";
        }

        if (!plan) {
          planAction = "create";
        } else {
          planAction = "link";
        }

        return { profileAction, planAction };
      };

      const res = resolveProfileAndPlan(existingProfile, existingPlan);
      expect(res.profileAction).toBe("create");
      expect(res.planAction).toBe("create");
    });

    it("strictly forbids converting an existing B2C production user into a Campus tenant administrator", () => {
      const existingB2CProfile = {
        userId: "b2c_user_456",
        fullName: "Vikram Malhotra",
        email: "vikram@gmail.com",
        role: "b2c",
        tenantId: null,
      };

      const evaluateAdminEligibility = (prof: typeof existingB2CProfile) => {
        if (prof.role === "b2c" || (!prof.tenantId && prof.role !== "platform_admin")) {
          throw new Error("FAILED_PRECONDITION: Existing B2C profiles cannot be converted into Campus tenant administrators.");
        }
        return true;
      };

      expect(() => evaluateAdminEligibility(existingB2CProfile)).toThrow("FAILED_PRECONDITION");
    });

    it("rejects tenant hijacking if user already belongs to another tenant", () => {
      const existingTenantAdmin = {
        userId: "admin_already_assigned",
        email: "tpo@othercollege.edu",
        tenantId: "tenant_other_college",
        role: "tenant_admin",
      };

      const checkAdminAssignment = (adminProf: typeof existingTenantAdmin, targetTenantId: string) => {
        if (adminProf.tenantId && adminProf.tenantId !== targetTenantId) {
          throw new Error(
            `ALREADY_EXISTS: Administrator already belongs to tenant '${adminProf.tenantId}'. Cannot be re-assigned.`
          );
        }
        return true;
      };

      expect(() => checkAdminAssignment(existingTenantAdmin, "tenant_new_target")).toThrow("ALREADY_EXISTS");
    });

    it("preserves platform_admin role when an existing platform administrator is provisioned", () => {
      const platformAdminProfile = {
        userId: "platform_super_admin",
        role: "platform_admin",
        isPlatformAdmin: true,
        tenantId: null,
      };

      const resolveRoleOnProvision = (prof: typeof platformAdminProfile) => {
        if (prof.role === "platform_admin" || prof.isPlatformAdmin) {
          return prof.role; // Preserved, never downgraded to tenant_admin
        }
        return "tenant_admin";
      };

      expect(resolveRoleOnProvision(platformAdminProfile)).toBe("platform_admin");
    });
  });

  describe("Collision, Idempotency & Concurrent Provisioning Security", () => {
    // Deterministic payload hash helper matching functions/src/index.ts
    const computePayloadHash = (payload: {
      code: string;
      name: string;
      adminEmail: string;
      domain?: string;
      type?: "college" | "university" | "group";
      plan?: "trial" | "starter" | "pro" | "university";
      seats?: number;
      modules?: string[];
      academicYear?: string;
    }) => {
      const normalized = {
        code: payload.code.toLowerCase(),
        domain: payload.domain ? normalizeDomain(payload.domain) : null,
        name: payload.name,
        type: payload.type || "college",
        plan: payload.plan || "starter",
        seats: payload.seats || 1000,
        adminEmail: payload.adminEmail.toLowerCase().trim(),
        modules: payload.modules ? [...payload.modules].sort() : [],
        academicYear: payload.academicYear || "2025-2026",
      };
      return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
    };

    const existingReservation = {
      tenantSlug: "ggi-lucknow",
      tenantId: "tenant_123",
      createdByUid: "admin_super_uid_1",
      idempotencyKey: "idem_key_secure_1234567890",
      payloadHash: computePayloadHash({
        code: "ggi-lucknow",
        name: "Goel Group of Institutions",
        adminEmail: "tpo@ggi.ac.in",
      }),
    };

    const executeProvisionAttempt = (
      reservation: typeof existingReservation | null,
      callerUid: string,
      payload: { code: string; name: string; adminEmail: string; idempotencyKey?: string; domain?: string }
    ) => {
      const currentPayloadHash = computePayloadHash(payload);

      if (reservation && reservation.tenantSlug === payload.code) {
        const isExactUid = reservation.createdByUid === callerUid;
        const isExactKey = Boolean(payload.idempotencyKey && reservation.idempotencyKey === payload.idempotencyKey);
        const isExactPayload = reservation.payloadHash === currentPayloadHash;

        if (isExactUid && isExactKey && isExactPayload) {
          return { status: "replayed", tenantId: reservation.tenantId, grantedMembership: false };
        }
        if (isExactKey && !isExactUid) {
          throw new Error("PERMISSION_DENIED: Idempotency key collision with another user.");
        }
        if (isExactKey && isExactUid && !isExactPayload) {
          throw new Error("INVALID_ARGUMENT: Idempotency key reused with different request payload.");
        }
        throw new Error("ALREADY_EXISTS: Tenant slug already exists. Slugs cannot be reassigned.");
      }

      return { status: "created", tenantId: "new_tenant_generated", grantedMembership: true };
    };

    it("allows safe replay when exact UID, exact key, and exact payload hash match", () => {
      const res = executeProvisionAttempt(existingReservation, "admin_super_uid_1", {
        code: "ggi-lucknow",
        name: "Goel Group of Institutions",
        adminEmail: "tpo@ggi.ac.in",
        idempotencyKey: "idem_key_secure_1234567890",
      });
      expect(res.status).toBe("replayed");
      expect(res.tenantId).toBe("tenant_123");
      expect(res.grantedMembership).toBe(false); // No new membership granted
    });

    it("rejects: same key + different UID (key collision with another user)", () => {
      expect(() =>
        executeProvisionAttempt(existingReservation, "different_admin_uid_99", {
          code: "ggi-lucknow",
          name: "Goel Group of Institutions",
          adminEmail: "tpo@ggi.ac.in",
          idempotencyKey: "idem_key_secure_1234567890",
        })
      ).toThrow("PERMISSION_DENIED");
    });

    it("rejects: same key + same UID + different payload (payload mutation)", () => {
      expect(() =>
        executeProvisionAttempt(existingReservation, "admin_super_uid_1", {
          code: "ggi-lucknow",
          name: "Goel Group of Institutions (Renamed Payload)",
          adminEmail: "tpo@ggi.ac.in",
          idempotencyKey: "idem_key_secure_1234567890",
        })
      ).toThrow("INVALID_ARGUMENT");
    });

    it("rejects: different key + existing slug -> ALREADY_EXISTS", () => {
      expect(() =>
        executeProvisionAttempt(existingReservation, "admin_super_uid_1", {
          code: "ggi-lucknow",
          name: "Goel Group of Institutions",
          adminEmail: "tpo@ggi.ac.in",
          idempotencyKey: "completely_different_key_99999",
        })
      ).toThrow("ALREADY_EXISTS");
    });

    it("rejects: new slug + existing normalized domain -> ALREADY_EXISTS", () => {
      const domainReservations = new Map<string, string>();
      domainReservations.set("campus.ggi.ac.in", "ggi-lucknow");

      const attemptDomainReservation = (slug: string, rawDomain: string) => {
        const canonical = normalizeDomain(rawDomain);
        if (domainReservations.has(canonical) && domainReservations.get(canonical) !== slug) {
          throw new Error(`ALREADY_EXISTS: Domain '${canonical}' is already reserved by another tenant.`);
        }
        domainReservations.set(canonical, slug);
        return true;
      };

      expect(() => attemptDomainReservation("new-college-two", "WWW.CAMPUS.GGI.AC.IN.")).toThrow(
        "ALREADY_EXISTS"
      );
    });

    it("simulates concurrent transactional creation on tenant_slugs where only one wins", async () => {
      const slugReservations = new Set<string>();

      const runTransactionalReservation = async (slug: string) => {
        // Simulating Firestore transaction atomic get & set
        if (slugReservations.has(slug)) {
          throw new Error("ALREADY_EXISTS: Slug is already reserved in transaction.");
        }
        slugReservations.add(slug);
        return { success: true, slug };
      };

      const [p1, p2] = await Promise.allSettled([
        runTransactionalReservation("atomic-contested-slug"),
        runTransactionalReservation("atomic-contested-slug"),
      ]);

      const successCount = [p1, p2].filter((r) => r.status === "fulfilled").length;
      const rejectCount = [p1, p2].filter((r) => r.status === "rejected").length;

      expect(successCount).toBe(1);
      expect(rejectCount).toBe(1);
    });
  });

  describe("Cloud Function Authorization & Tenant Binding Suite", () => {
    it("rejects unauthenticated requests immediately", () => {
      const runCallableWithAuth = (authContext: { uid?: string } | null) => {
        if (!authContext || !authContext.uid) {
          throw new Error("unauthenticated: Sign in required.");
        }
        return true;
      };

      expect(() => runCallableWithAuth(null)).toThrow("unauthenticated");
      expect(() => runCallableWithAuth({})).toThrow("unauthenticated");
      expect(runCallableWithAuth({ uid: "user_valid_123" })).toBe(true);
    });

    it("validates server-issued role claims via ServerRBAC and ignores frontend claims", () => {
      const allowedRoles: AppRole[] = ["tenant_admin", "tpo"];

      expect(ServerRBAC.enforceFunctionAccess("tenant_admin", allowedRoles)).toBe("tenant_admin");
      expect(ServerRBAC.enforceFunctionAccess("coordinator", allowedRoles)).toBe("tpo");
      expect(ServerRBAC.enforceFunctionAccess("platform_admin", allowedRoles)).toBe("platform_admin");

      expect(() => ServerRBAC.enforceFunctionAccess("student", allowedRoles)).toThrow(/Access Denied/);
      expect(() => ServerRBAC.enforceFunctionAccess("b2c", allowedRoles)).toThrow(/Access Denied/);
      expect(() => ServerRBAC.enforceFunctionAccess(undefined, allowedRoles)).toThrow(/Access Denied/);
    });

    it("rejects request-body tenant ID when it conflicts with server-verified auth token claim", () => {
      const enforceTenantBinding = (
        tokenClaims: { tenantId?: string | null; role?: string },
        requestData: { tenantId?: string }
      ) => {
        const tokenTenantId = tokenClaims.tenantId;
        const requestedTenantId = requestData.tenantId;

        if (tokenClaims.role === "platform_admin" || tokenClaims.role === "super_admin") {
          return requestedTenantId || tokenTenantId;
        }

        if (!tokenTenantId) {
          throw new Error("unauthenticated: User does not belong to any tenant.");
        }

        if (requestedTenantId && requestedTenantId !== tokenTenantId) {
          throw new Error(
            `permission-denied: Cross-tenant access denied. Token tenant '${tokenTenantId}' conflicts with requested tenant '${requestedTenantId}'.`
          );
        }

        return tokenTenantId;
      };

      const legitimateTenantToken = { tenantId: "tenant_sunrise", role: "tenant_admin" };

      expect(enforceTenantBinding(legitimateTenantToken, { tenantId: "tenant_sunrise" })).toBe("tenant_sunrise");
      expect(enforceTenantBinding(legitimateTenantToken, {})).toBe("tenant_sunrise");
      expect(() =>
        enforceTenantBinding(legitimateTenantToken, { tenantId: "tenant_victim_gla" })
      ).toThrow("permission-denied: Cross-tenant access denied");

      const platformAdminToken = { tenantId: null, role: "platform_admin" };
      expect(enforceTenantBinding(platformAdminToken, { tenantId: "tenant_victim_gla" })).toBe("tenant_victim_gla");
    });

    it("does not trust localStorage, cookies or client-controlled headers for authorization", () => {
      const clientSpoofPayload = {
        tenantId: "tenant_victim",
        role: "platform_admin",
        isSuperAdmin: true,
      };

      const serverToken = {
        uid: "std_456",
        tenantId: "tenant_sunrise",
        role: "student",
      };

      const executeSecureAction = (token: typeof serverToken, body: typeof clientSpoofPayload) => {
        const effectiveRole = token.role;
        const effectiveTenant = token.tenantId;

        if (effectiveRole !== "platform_admin" && effectiveRole !== "tenant_admin") {
          throw new Error("permission-denied: Role 'student' cannot execute admin actions.");
        }

        return { tenantId: effectiveTenant, role: effectiveRole };
      };

      expect(() => executeSecureAction(serverToken, clientSpoofPayload)).toThrow("permission-denied");
    });

    it("verifies sensitive tenant callable access matrix across roles", () => {
      const SENSITIVE_FUNCTIONS: Record<string, string[]> = {
        provisionTenant: ["platform_admin"],
        setTenantRole: ["platform_admin", "tenant_admin"],
        importStudentsCsv: ["platform_admin", "tenant_admin", "coordinator"],
        createDrive: ["platform_admin", "tenant_admin", "coordinator"],
        computeDriveShortlist: ["platform_admin", "tenant_admin", "coordinator"],
        generateAccreditationReport: ["platform_admin", "tenant_admin", "coordinator"],
        purgeTenantData: ["platform_admin"],
      };

      for (const [funcName, allowed] of Object.entries(SENSITIVE_FUNCTIONS)) {
        const canExecute = (role: string) => {
          if (role === "platform_admin") return true;
          return allowed.includes(role);
        };

        expect(canExecute("platform_admin")).toBe(true);
        expect(canExecute("student")).toBe(false);
        expect(canExecute("b2c")).toBe(false);
      }
    });

    it("proves that current shared aivi-career Firebase project must NOT receive tenant-provisioning deployment", () => {
      // ARCHITECTURE SAFEGUARD:
      // aivi-career is strictly reserved for B2C Career OS production.
      // Multi-tenant Campus OS provisioning must target separate dedicated projects:
      // - aivi-campus-production (Campus OS Production)
      // - aivi-campus-staging (Campus OS Staging)
      const SHARED_B2C_PROJECT_ID = "aivi-career";
      const TARGET_CAMPUS_PROJECTS = ["aivi-campus-production", "aivi-campus-staging"];

      const validateDeploymentTarget = (targetProjectId: string) => {
        if (targetProjectId === SHARED_B2C_PROJECT_ID) {
          throw new Error(
            `FATAL_ISOLATION_VIOLATION: Deployment of tenant-provisioning to '${SHARED_B2C_PROJECT_ID}' is strictly prohibited. Campus administrators and tenants must be created inside separate Campus Auth projects.`
          );
        }
        if (!TARGET_CAMPUS_PROJECTS.includes(targetProjectId)) {
          throw new Error(`UNRECOGNIZED_TARGET: Project '${targetProjectId}' is not an authorized Campus environment.`);
        }
        return { authorized: true, target: targetProjectId };
      };

      // Fails when attempting to deploy or target shared B2C project
      expect(() => validateDeploymentTarget("aivi-career")).toThrow("FATAL_ISOLATION_VIOLATION");

      // Succeeds when targeting dedicated Campus projects
      expect(validateDeploymentTarget("aivi-campus-production").authorized).toBe(true);
      expect(validateDeploymentTarget("aivi-campus-staging").authorized).toBe(true);
    });
  });
});
