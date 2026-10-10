import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Campus OS Staging UAT Login & Navigation Fixes", () => {
  const brandedLoginPath = path.resolve(__dirname, "../pages/campus/BrandedLogin.tsx");
  const campusHeaderPath = path.resolve(__dirname, "../components/CampusHeader.tsx");
  const adminRoutePath = path.resolve(__dirname, "../components/AdminRoute.tsx");

  it("ensures BrandedLogin imports requestPasswordResetEmail and wires handleForgotPassword to Forgot? button", () => {
    const code = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(code).toContain('import { requestPasswordResetEmail } from "@/services/authEmailService";');
    expect(code).toContain("const handleForgotPassword = async () =>");
    expect(code).toContain("onClick={handleForgotPassword}");
  });

  it("ensures BrandedLogin auto-signout effect does not sign out real authenticated staging users", () => {
    const code = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(code).toContain("isDemoMode && user && ((user as any).uid?.startsWith(\"demo-\") || user.email === \"director.tpo@sunrise.ac.in\")");
  });

  it("ensures BrandedLogin routes both Google and SSO logins via routeUserAfterAuth", () => {
    const code = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(code).toContain("const routeUserAfterAuth = async (userEmail: string) =>");
    expect(code).toContain("await routeUserAfterAuth(cred.user.email || \"\");");
  });

  it("ensures CampusHeader routes campus users to platform-admin, student-drives, or campus, and uses Sign In button", () => {
    const code = fs.readFileSync(campusHeaderPath, "utf-8");
    expect(code).toContain("dashboardPath = !user");
    expect(code).toContain('? "/platform-admin"');
    expect(code).toContain('? "/campus/student-drives"');
    expect(code).toContain(': "/campus";');
    expect(code).not.toContain('isTpoUser ? "/campus" : user ? "/dashboard" : "/campus/login"');
    expect(code).toContain('"Sign In"');
    expect(code).not.toContain("TPO & Student Login");
  });

  it("ensures AdminRoute redirects non-admin users on campus domains to /campus and unauthenticated users to /campus/login", () => {
    const code = fs.readFileSync(adminRoutePath, "utf-8");
    expect(code).toContain('if (!user) return <Navigate to={isCampus ? "/campus/login" : "/auth"} replace />;');
    expect(code).toContain('if (!isAdmin) return <Navigate to={isCampus ? "/campus" : "/dashboard"} replace />;');
  });

  it("ensures AdminRoute calculates isAdmin safely including abhi.triloki@gmail.com without campus bounce", () => {
    const code = fs.readFileSync(adminRoutePath, "utf-8");
    expect(code).toContain('userEmail === "abhi.triloki@gmail.com"');
    expect(code).toContain('userEmail === "abhitriloki@gmail.com"');
  });

  it("ensures AuthContext prioritizes owner platform admin resolution and safely handles user_roles reads", () => {
    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const code = fs.readFileSync(authContextPath, "utf-8");
    expect(code).toContain('userEmail === "abhi.triloki@gmail.com"');
    expect(code).toContain('userEmail === "abhitriloki@gmail.com"');
    expect(code).toContain('role: "platform_admin"');
    expect(code).toContain('setIsAdmin(true);');
  });

  it("ensures Auth.tsx handleGoogleLogin routes platform admin to /platform-admin on campus domains", () => {
    const authPath = path.resolve(__dirname, "../pages/Auth.tsx");
    const code = fs.readFileSync(authPath, "utf-8");
    expect(code).toContain('lowerEmail === "abhi.triloki@gmail.com"');
    expect(code).toContain('navigate("/platform-admin");');
  });

  it("ensures TenantRoute blocks unassigned personal users with Institutional Access Required", () => {
    const tenantRoutePath = path.resolve(__dirname, "../components/TenantRoute.tsx");
    const code = fs.readFileSync(tenantRoutePath, "utf-8");
    expect(code).toContain("hasInstitutionalAccess");
    expect(code).toContain("Institutional Access Required");
    expect(code).toContain("Sign Out & Use Institutional Email");
  });

  it("ensures CampusLayout removes the prototype role switcher dropdown and preserves notification constants", () => {
    const campusLayoutPath = path.resolve(__dirname, "../layouts/CampusLayout.tsx");
    const code = fs.readFileSync(campusLayoutPath, "utf-8");
    expect(code).not.toContain("ROLE_OPTIONS");
    expect(code).not.toContain("Preview As (UI designer)");
    expect(code).not.toContain("Open branded login");
    expect(code).toContain("const NOTIFICATIONS =");
    expect(code).toContain("const ONBOARDING_NOTIFICATIONS =");
  });

  it("ensures CampusDashboard uses EMPTY_TENANT_ROLLUP for custom tenants and dynamic greeting", () => {
    const dashboardPath = path.resolve(__dirname, "../pages/campus/CampusDashboard.tsx");
    const code = fs.readFileSync(dashboardPath, "utf-8");
    expect(code).toContain("const { user, tenant } = useAuth();");
    expect(code).toContain("EMPTY_TENANT_ROLLUP");
    expect(code).toContain("const r = rollup ?? (isCustomTenant ? EMPTY_TENANT_ROLLUP : DEFAULT_DEMO_ROLLUP);");
    expect(code).not.toContain('"Morning, Dr. Verma 👋"');
    expect(code).toContain("Welcome to Command Center 👋");
  });

  it("ensures StaffManagement provides explicit coordinator login instructions", () => {
    const staffPath = path.resolve(__dirname, "../pages/campus/StaffManagement.tsx");
    const code = fs.readFileSync(staffPath, "utf-8");
    expect(code).toContain("How the coordinator logs in:");
    expect(code).toContain("Sign in with Google Workspace");
    expect(code).toContain("branchScopeInput === \"ALL\"");
  });

  it("ensures CampusLayout renders DpdpConsentModal for students and ResumeIntelligence handles DPDP errors", () => {
    const campusLayoutPath = path.resolve(__dirname, "../layouts/CampusLayout.tsx");
    const layoutCode = fs.readFileSync(campusLayoutPath, "utf-8");
    expect(layoutCode).toContain("DpdpConsentModal");
    expect(layoutCode).toContain("dpdpConsent");

    const resumePath = path.resolve(__dirname, "../pages/ResumeIntelligence.tsx");
    const resumeCode = fs.readFileSync(resumePath, "utf-8");
    expect(resumeCode).toContain("open-dpdp-modal");
  });

  it("ensures BrandedLogin includes demo-next domain and guards against auto-signout during active demo logins", () => {
    const code = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(code).toContain('window.location.hostname === "demo-next.aivilabs.com"');
    expect(code).toContain("const loggingInRef = useRef(false);");
    expect(code).toContain("!loggingInRef.current");
    expect(code).toContain("loggingInRef.current = true;");
    expect(code).toContain('isSunriseDemoUser ? "demo-sunrise" : ""');
  });

  it("ensures AuthContext does not tie auth listener to location.pathname and includes profile fallback", () => {
    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const code = fs.readFileSync(authContextPath, "utf-8");
    // Listener is mounted once with [] rather than tearing down on every [location.pathname]
    expect(code).toMatch(/useEffect\(\(\)\s*=>\s*\{\s*let unsubscribe:/);
    expect(code).toMatch(/},\s*\[\]\);/);
    // Profiles fallback is present alongside user_roles
    expect(code).toContain('getDoc(doc(db, "profiles", firebaseUser.uid))');
    expect(code).toContain("(profileData?.role as any)");
    expect(code).toContain("profileData?.tenantId");
  });

  it("ensures BrandedLogin strictly rejects cross-tenant login leaks and clears local storage", () => {
    const code = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(code).toContain('lowerEmail.endsWith("@sunrise.ac.in") && activeUrlTenantCode !== "sunrise"');
    expect(code).toContain("Access Denied: Account");
    expect(code).toContain("Access Denied: Your account is registered with a different institution");
    expect(code).toContain('localStorage.removeItem("aivi_active_tenant_id");');
  });

  it("ensures PlatformAdminConsole eliminates phantom demo tenants fallback and provides Provision New Campus", () => {
    const platformAdminPath = path.resolve(__dirname, "../pages/campus/PlatformAdminConsole.tsx");
    const code = fs.readFileSync(platformAdminPath, "utf-8");
    expect(code).toContain("Provision New Campus");
    // Should not fall back to DEFAULT_DEMO_TENANTS when database is empty
    expect(code).not.toContain("setTenants(DEFAULT_DEMO_TENANTS);");
  });

  it("ensures TenantBrandingContext and TenantSettingsPage implement updateBrandingColors safely", () => {
    const contextPath = path.resolve(__dirname, "../contexts/TenantBrandingContext.tsx");
    const contextCode = fs.readFileSync(contextPath, "utf-8");
    expect(contextCode).toContain("updateBrandingColors: (primary: string, accent?: string) => void;");
    expect(contextCode).toContain("const updateBrandingColors = (primary: string, accent?: string) =>");

    const settingsPath = path.resolve(__dirname, "../pages/campus/TenantSettingsPage.tsx");
    const settingsCode = fs.readFileSync(settingsPath, "utf-8");
    expect(settingsCode).toContain("updateBrandingColors(primaryColor, accentColor);");
  });

  it("ensures staging.admin@aivicampus.com is recognized across AdminRoute, AuthContext, and BrandedLogin", () => {
    const adminRouteCode = fs.readFileSync(adminRoutePath, "utf-8");
    expect(adminRouteCode).toContain('userEmail === "staging.admin@aivicampus.com"');

    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const authContextCode = fs.readFileSync(authContextPath, "utf-8");
    expect(authContextCode).toContain('userEmail === "staging.admin@aivicampus.com"');

    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(brandedLoginCode).toContain('lowerEmail === "staging.admin@aivicampus.com"');
  });

  it("ensures BrandedLogin blocks unaffiliated users without institutional tenantId on live domains", () => {
    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(brandedLoginCode).toContain("if (isLiveDomain && !isPlatformAdmin && !userTenantId)");
    expect(brandedLoginCode).toContain("Institutional Access Required: Your account");
  });

  it("ensures AuthContext and BrandedLogin purge local tenant credentials on unlinked logins and on signOut", () => {
    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const authCode = fs.readFileSync(authContextPath, "utf-8");
    expect(authCode).toContain('localStorage.removeItem("aivi_active_tenant_id");');
    expect(authCode).toContain('localStorage.removeItem("aivi_active_tenant_name");');
    expect(authCode).toContain('if (isProdDomain && role !== "platform_admin" && !tenantId)');

    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(brandedLoginCode).toContain("const isLiveHost = typeof window !== \"undefined\"");
  });

  it("ensures TenantBrandingContext prevents unverified localStorage fallback on live domains", () => {
    const contextPath = path.resolve(__dirname, "../contexts/TenantBrandingContext.tsx");
    const contextCode = fs.readFileSync(contextPath, "utf-8");
    expect(contextCode).toContain("if (!activeTenant && !isProdDomain)");
  });

  it("ensures BrandedLogin implements Option B institutional-first gating with Find Your College Portal and master admin sign-in toggle", () => {
    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(brandedLoginCode).toContain("Find Your College Portal");
    expect(brandedLoginCode).toContain("isGenericGateway && !isPlatformAdminMode");
    expect(brandedLoginCode).toContain("Platform Master Admin Sign In");
    expect(brandedLoginCode).toContain("Continue to College Portal");
    expect(brandedLoginCode).toContain("navigate(`/campus/login/${encodeURIComponent(clean)}`)");
  });

  it("ensures TenantRoute, AuthContext, and BrandedLogin strictly enforce tenant suspension", () => {
    const tenantRoutePath = path.resolve(__dirname, "../components/TenantRoute.tsx");
    const tenantRouteCode = fs.readFileSync(tenantRoutePath, "utf-8");
    expect(tenantRouteCode).toContain('if (!isPlatformAdmin && tenant.status === "suspended")');
    expect(tenantRouteCode).toContain("Institution Workspace Suspended");

    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const authCode = fs.readFileSync(authContextPath, "utf-8");
    expect(authCode).toContain('status?: "active" | "suspended" | "trial_expired";');
    expect(authCode).toContain("const tSnap = await getDoc(doc(db, \"tenants\", tenantId))");
    expect(authCode).toContain("tenantStatus = td.status;");

    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    expect(brandedLoginCode).toContain("WORKSPACE SUSPENDED");
    expect(brandedLoginCode).toContain("Strict Tenant Suspension Gate:");
    expect(brandedLoginCode).toContain("Institution Workspace Suspended: Access for");
  });

  it("ensures success toast is deferred until tenant authorization passes and real tenant names are preserved", () => {
    const brandedLoginCode = fs.readFileSync(brandedLoginPath, "utf-8");
    // Ensure performLogin and handleGoogleLogin don't fire premature toast.success before routeUserAfterAuth
    expect(brandedLoginCode).not.toMatch(/await signInWithEmailAndPassword[^;]+;\s*toast\.success\(/);
    expect(brandedLoginCode).not.toMatch(/await signInWithPopup[^;]+;\s*toast\.success\(/);
    expect(brandedLoginCode).toContain('toast.success("Signed in successfully!");');

    // Ensure AuthContext populates tenantDocData into tenant.tenant
    const authContextPath = path.resolve(__dirname, "../contexts/AuthContext.tsx");
    const authCode = fs.readFileSync(authContextPath, "utf-8");
    expect(authCode).toContain("tenant: tenantDocData,");

    // Ensure TenantBrandingContext does not nuke real tenants containing 'sunrise' in their name
    const contextPath = path.resolve(__dirname, "../contexts/TenantBrandingContext.tsx");
    const contextCode = fs.readFileSync(contextPath, "utf-8");
    expect(contextCode).not.toContain('activeTenant.name?.toLowerCase().includes("sunrise")');
    expect(contextCode).not.toContain('activeTenant.code?.toLowerCase().includes("sunrise")');
    expect(contextCode).toContain('activeTenant.id === "demo-sunrise"');
  });
});

