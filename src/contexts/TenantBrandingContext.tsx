import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { TenantSummary, TenantBranding, listTenantsPublic, getTenantBranding } from "@/services/tenantService";
import { ensureTenantAccent, accessibleOn } from "@/utils/contrastGuard";
import { CampusPortalNotFound } from "@/components/CampusPortalNotFound";

export function extractSubdomainSlug(hostname: string): string | null {
  if (!hostname) return null;
  const cleanHost = hostname.toLowerCase().trim();

  // Ignore localhost / IP / standard bare domains & main campus domains
  if (
    cleanHost === "localhost" ||
    cleanHost === "127.0.0.1" ||
    cleanHost === "aivilabs.com" ||
    cleanHost === "www.aivilabs.com" ||
    cleanHost === "app.aivilabs.com" ||
    cleanHost === "campus.aivilabs.com" ||
    cleanHost === "staging.aivilabs.com" ||
    cleanHost === "campus.staging.aivilabs.com" ||
    cleanHost === "campus.localhost" ||
    cleanHost === "aivicampus.com" ||
    cleanHost === "www.aivicampus.com" ||
    cleanHost === "app.aivicampus.com" ||
    cleanHost === "staging.aivicampus.com" ||
    cleanHost === "demo-next.aivilabs.com" ||
    cleanHost === "isolation-staging.aivicampus.com"
  ) {
    return null;
  }

  // Handle {slug}.staging.aivicampus.com
  if (cleanHost.endsWith(".staging.aivicampus.com")) {
    const prefix = cleanHost.replace(".staging.aivicampus.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" ? slug : null;
  }

  // Handle {slug}.aivicampus.com
  if (cleanHost.endsWith(".aivicampus.com")) {
    const prefix = cleanHost.replace(".aivicampus.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" && slug !== "staging" ? slug : null;
  }

  // Handle {slug}.staging.aivilabs.com
  if (cleanHost.endsWith(".staging.aivilabs.com")) {
    const prefix = cleanHost.replace(".staging.aivilabs.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" && slug !== "campus" ? slug : null;
  }

  // Handle {slug}.aivilabs.com
  if (cleanHost.endsWith(".aivilabs.com")) {
    const prefix = cleanHost.replace(".aivilabs.com", "");
    const parts = prefix.split(".");
    const slug = parts[parts.length - 1];
    return slug && slug !== "www" && slug !== "app" && slug !== "staging" && slug !== "campus" ? slug : null;
  }

  // Handle local dev test subdomains e.g. bit-demo.localhost
  if (cleanHost.includes(".localhost")) {
    const slug = cleanHost.split(".localhost")[0];
    return slug && slug !== "www" && slug !== "campus" ? slug : null;
  }

  return null;
}

interface TenantBrandingContextType {
  branding: {
    logoUrl: string;
    primaryColor: string;
    primaryForeground: string;
    accentColor: string;
    loginHeadline: string;
    name: string;
    code?: string;
  };
  supportModeActive: boolean;
  activeTenantId: string | null;
  allTenants: TenantSummary[];
  subdomainSlug: string | null;
  subdomainTenant: TenantBranding | null;
  subdomainNotFound: boolean;
  setSupportTenantId: (tenantId: string | null) => void;
  refreshBranding: () => void;
  updateBrandingColors: (primary: string, accent?: string) => void;
}

const DEFAULT_BRANDING = {
  logoUrl: "",
  primaryColor: "#1C6B68",
  primaryForeground: "#ffffff",
  accentColor: "#20CFC0",
  loginHeadline: "Sign in to your institutional placement portal",
  name: "AIVI Campus",
  code: "",
};


const TenantBrandingContext = createContext<TenantBrandingContextType>({
  branding: DEFAULT_BRANDING,
  supportModeActive: false,
  activeTenantId: null,
  allTenants: [],
  subdomainSlug: null,
  subdomainTenant: null,
  subdomainNotFound: false,
  setSupportTenantId: () => {},
  refreshBranding: () => {},
  updateBrandingColors: () => {},
});

export const TenantBrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useAuth();
  const [supportTenantId, setSupportTenantId] = useState<string | null>(null);
  const [allTenants, setAllTenants] = useState<TenantSummary[]>([]);
  const [activeBranding, setActiveBranding] = useState(DEFAULT_BRANDING);

  const updateBrandingColors = (primary: string, accent?: string) => {
    const newAccent = accent || activeBranding.accentColor;
    const updated = {
      ...activeBranding,
      primaryColor: primary,
      accentColor: newAccent,
    };
    setActiveBranding(updated);
    try {
      document.documentElement.style.setProperty("--primary", primary);
      document.documentElement.style.setProperty("--tenant-primary", primary);
      document.documentElement.style.setProperty("--tenant-accent", newAccent);
      localStorage.setItem(
        "aivi_tenant_branding_override",
        JSON.stringify({ primaryColor: primary, accentColor: newAccent })
      );
    } catch {}
  };
  
  // Subdomain state
  const [subdomainSlug, setSubdomainSlug] = useState<string | null>(() => {
    return extractSubdomainSlug(window.location.hostname);
  });
  const [subdomainTenant, setSubdomainTenant] = useState<TenantBranding | null>(null);
  const [subdomainNotFound, setSubdomainNotFound] = useState(false);
  const [loadingSubdomain, setLoadingSubdomain] = useState(!!subdomainSlug);

  // 1. Fetch Subdomain Tenant Branding if Subdomain Slug is present
  useEffect(() => {
    if (!subdomainSlug) {
      setLoadingSubdomain(false);
      return;
    }

    let isMounted = true;
    setLoadingSubdomain(true);

    getTenantBranding(subdomainSlug)
      .then((res) => {
        if (!isMounted) return;
        setSubdomainTenant(res);
        setSubdomainNotFound(false);
        // Apply title bar document.title
        document.title = `${res.name} | AIVI Campus Portal`;
      })
      .catch((err) => {
        console.warn(`Subdomain tenant '${subdomainSlug}' not found:`, err);
        if (!isMounted) return;
        setSubdomainTenant(null);
        setSubdomainNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoadingSubdomain(false);
      });

    return () => {
      isMounted = false;
    };
  }, [subdomainSlug]);

  // 2. Fetch available tenants for switcher & dynamic branding
  useEffect(() => {
    listTenantsPublic()
      .then((res) => setAllTenants(res.tenants || []))
      .catch((err) => console.error("Error loading tenants for switcher:", err));
  }, [tenant.role]);

  // 3. Determine active branding with Contrast Guard auto-correction
  useEffect(() => {
    // Priority 1: Subdomain Tenant
    if (subdomainTenant) {
      const rawPrimary = subdomainTenant.branding.primaryColor || "#169C8F";
      const safePrimary = ensureTenantAccent(rawPrimary, "#0b131e", 3.0);
      const safePrimaryFg = accessibleOn(safePrimary);
      const safeAccent = ensureTenantAccent(subdomainTenant.branding.accentColor || "#FF6D4A", "#0b131e", 3.0);

      setActiveBranding({
        logoUrl: subdomainTenant.branding.logoUrl || "",
        primaryColor: safePrimary,
        primaryForeground: safePrimaryFg,
        accentColor: safeAccent,
        loginHeadline: subdomainTenant.branding.loginHeadline || `Sign in to ${subdomainTenant.name} Placement Portal`,
        name: subdomainTenant.name || "AIVI Campus",
        code: subdomainTenant.code || "",
      });
      return;
    }

    const isProdDomain = typeof window !== "undefined" && (
      window.location.hostname === "aivicampus.com" ||
      window.location.hostname === "www.aivicampus.com" ||
      window.location.hostname === "staging.aivicampus.com" ||
      window.location.hostname === "isolation-staging.aivicampus.com" ||
      window.location.hostname.endsWith(".aivicampus.com")
    );

    // Priority 2: Admin Support Switcher / Auth Tenant Context / Active Created College
    let activeTenant: TenantSummary | null | undefined = tenant.tenant;
    if (tenant.role === "platform_admin" && supportTenantId) {
      activeTenant = allTenants.find((t) => t.id === supportTenantId);
    }
    if (!activeTenant) {
      const activeId = tenant.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);
      const activeCode = typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_code") : null;
      if (activeId || activeCode) {
        activeTenant = allTenants.find(
          (t) =>
            (activeId && (t.id === activeId || (t as any).tenantId === activeId)) ||
            (activeCode && t.code.toLowerCase() === activeCode.toLowerCase())
        );
      }
    }
    // On live production/staging domains, never resolve to the mock fixture demo-sunrise
    if (
      isProdDomain &&
      activeTenant &&
      (
        activeTenant.id === "demo-sunrise" ||
        activeTenant.id === "demo-campus-001"
      )
    ) {
      activeTenant = null;
    }

    if (!activeTenant && !isProdDomain) {
      const activeId = tenant.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);
      const activeName = typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_name") : null;
      if (activeName && activeId && activeId !== "demo-sunrise" && activeId !== "demo-campus-001") {
        activeTenant = {
          id: activeId,
          code: (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_code") : "campus") || "campus",
          name: activeName,
          type: "college",
          plan: "pro",
          status: "active",
          seats: 1000,
          seatsUsed: 0,
          modules: ["aes", "vault", "drive", "voice", "analytics"],
          branding: {
            logoUrl: "",
            primaryColor: "#169C8F",
            accentColor: "#FF6D4A",
            loginHeadline: `Sign in to ${activeName} Placement Portal`,
          },
          academicYear: "2025-26",
        };
      }
    }

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const isAdminRoute = pathname.startsWith("/platform-admin") || pathname.startsWith("/campus-admin");

    if (activeTenant) {
      const rawPrimary = activeTenant.branding?.primaryColor || "#169C8F";
      const safePrimary = ensureTenantAccent(rawPrimary, "#0b131e", 3.0);
      const safePrimaryFg = accessibleOn(safePrimary);
      const safeAccent = ensureTenantAccent(activeTenant.branding?.accentColor || "#FF6D4A", "#0b131e", 3.0);

      if (isAdminRoute) {
        document.title = "Platform Master Console | AIVI Campus Intelligence OS";
      } else {
        document.title = `${activeTenant.name} | AIVI Campus Portal`;
      }

      setActiveBranding({
        logoUrl: activeTenant.branding?.logoUrl || "",
        primaryColor: safePrimary,
        primaryForeground: safePrimaryFg,
        accentColor: safeAccent,
        loginHeadline: activeTenant.branding?.loginHeadline || "Sign in to your institutional placement portal",
        name: activeTenant.name || "AIVI Campus",
        code: activeTenant.code || "",
      });
    } else {
      if (isAdminRoute) {
        document.title = "Platform Master Console | AIVI Campus Intelligence OS";
      } else {
        document.title = "AIVI Campus — AI Employability OS for Colleges & Universities";
      }
      setActiveBranding(DEFAULT_BRANDING);
    }
  }, [subdomainTenant, tenant.tenant, supportTenantId, allTenants, tenant.role, tenant.tenantId]);


  // 4. Apply CSS color variables dynamically to root document
  useEffect(() => {
    if (activeBranding.primaryColor) {
      document.documentElement.style.setProperty("--tenant-primary", activeBranding.primaryColor);
      document.documentElement.style.setProperty("--tenant-primary-fg", activeBranding.primaryForeground);
      document.documentElement.style.setProperty("--tenant-accent", activeBranding.accentColor);
    }
  }, [activeBranding]);

  const supportModeActive = tenant.role === "platform_admin" && !!supportTenantId;
  const activeTenantId = subdomainSlug
    ? (subdomainTenant?.id || subdomainSlug)
    : (supportModeActive ? supportTenantId : tenant.tenantId);

  // If loading subdomain branding initially
  if (loadingSubdomain) {
    return (
      <div className="min-h-screen bg-[#0B131E] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading campus portal...</span>
        </div>
      </div>
    );
  }

  // If subdomain slug present but tenant document not found
  if (subdomainSlug && subdomainNotFound) {
    return <CampusPortalNotFound slug={subdomainSlug} />;
  }

  return (
    <TenantBrandingContext.Provider
      value={{
        branding: activeBranding,
        supportModeActive,
        activeTenantId,
        allTenants,
        subdomainSlug,
        subdomainTenant,
        subdomainNotFound,
        setSupportTenantId,
        refreshBranding: () => {},
        updateBrandingColors,
      }}
    >
      {children}
    </TenantBrandingContext.Provider>
  );
};

export const useTenantBranding = () => useContext(TenantBrandingContext);
