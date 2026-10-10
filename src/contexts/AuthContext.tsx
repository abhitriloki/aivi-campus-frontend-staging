import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useLocation } from "react-router-dom";

export interface TenantContextState {
  tenantId: string | null;
  role: "platform_admin" | "tenant_admin" | "placement_director" | "tpo" | "coordinator" | "student" | "b2c";
  branchScope: string[];
  status?: "active" | "suspended" | "trial_expired";
  tenant?: any;
}

const defaultTenantState: TenantContextState = {
  tenantId: null,
  role: "b2c",
  branchScope: [],
  status: "active",
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  tenant: TenantContextState;
  signOut: () => Promise<void>;
  refreshTenantContext: (targetUser?: User | null) => Promise<void>;
  switchUserRole: (role: "tenant_admin" | "coordinator" | "student" | "platform_admin") => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  tenant: defaultTenantState,
  signOut: async () => { },
  refreshTenantContext: async (_targetUser?: User | null) => { },
  switchUserRole: () => { },
});

const ROLE_PRESETS = {
  tenant_admin: {
    email: "director.tpo@sunrise.ac.in",
    displayName: "Dr. Alok Verma",
    role: "tenant_admin" as const,
    branchScope: [],
  },
  coordinator: {
    email: "coordinator.cse@demo.aivilabs.com",
    displayName: "Prof. Sunita Rao",
    role: "coordinator" as const,
    branchScope: ["CSE", "IT"],
  },
  student: {
    email: "abhishek@sunrise.ac.in",
    displayName: "Aarav Sharma",
    role: "student" as const,
    branchScope: ["CSE"],
  },
  platform_admin: {
    email: "admin@aivilabs.com",
    displayName: "Platform Superadmin",
    role: "platform_admin" as const,
    branchScope: [],
  },
};

const getActiveDemoTenant = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("aivi_demo_created_tenants");
    const activeId = localStorage.getItem("aivi_active_tenant_id");
    const activeCode = localStorage.getItem("aivi_active_tenant_code");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (activeId || activeCode) {
          const found = parsed.find(
            (t: any) =>
              (activeId && (t.tenantId === activeId || t.id === activeId)) ||
              (activeCode && t.code?.toLowerCase() === activeCode.toLowerCase())
          );
          if (found) return found;
        }
        return parsed[0];
      }
    }
  } catch {}
  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tenant, setTenant] = useState<TenantContextState>(defaultTenantState);
  const location = useLocation();

  const applyPresetRole = (roleKey: keyof typeof ROLE_PRESETS) => {
    const preset = ROLE_PRESETS[roleKey] || ROLE_PRESETS.tenant_admin;
    const activeDemoTenant = getActiveDemoTenant();
    const effectiveTenantId = activeDemoTenant ? (activeDemoTenant.tenantId || activeDemoTenant.id) : "demo-sunrise";

    setTenant({
      tenantId: effectiveTenantId,
      role: preset.role,
      branchScope: preset.branchScope,
      status: "active",
    });
    setIsAdmin(preset.role === "platform_admin");

    let effectiveDisplayName = preset.displayName;
    let effectiveEmail = preset.email;
    if (activeDemoTenant && preset.role === "tenant_admin") {
      effectiveDisplayName = activeDemoTenant.adminName || `${activeDemoTenant.name} Director`;
      effectiveEmail = activeDemoTenant.adminEmail || `director.tpo@${activeDemoTenant.code}.ac.in`;
    }

    setUser((prev) => ({
      uid: prev?.uid || `demo-${roleKey}-uid`,
      email: prev?.email || effectiveEmail,
      displayName: prev?.displayName || effectiveDisplayName,
      emailVerified: true,
      getIdTokenResult: async () => ({
        claims: {
          role: preset.role,
          tenantId: effectiveTenantId,
          branchScope: preset.branchScope,
        },
      }),
    } as any));
  };

  const fetchTenantContext = async (firebaseUser: User) => {
    try {
      const userEmail = (firebaseUser.email || "").toLowerCase();
      const isOwnerAdmin =
        userEmail === "abhi.triloki@gmail.com" ||
        userEmail === "abhitriloki@gmail.com" ||
        userEmail === "staging.admin@aivicampus.com" ||
        userEmail === "qa.admin@aivicampus.com";

      if (isOwnerAdmin) {
        setIsAdmin(true);
        setTenant({
          tenantId: null,
          role: "platform_admin",
          branchScope: [],
          status: "active",
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

      if (isProdDomain && (userEmail.endsWith("@sunrise.ac.in") || userEmail.includes("demo.aivilabs.com"))) {
        try {
          const { auth } = await import("@/integrations/firebase/client");
          await auth.signOut();
          localStorage.removeItem("aivi_active_tenant_id");
          localStorage.removeItem("aivi_active_tenant_code");
          localStorage.removeItem("aivi_active_tenant_name");
          localStorage.removeItem("aivi_active_role");
        } catch {}
        setUser(null);
        setIsAdmin(false);
        setTenant(defaultTenantState);
        return;
      }

      if (!isProdDomain) {
        const activeDemoTenant = getActiveDemoTenant();

        // Check if user matches a created demo tenant's TPO admin
        let matchedCreatedTenant: any = null;
        try {
          const rawTenants = localStorage.getItem("aivi_demo_created_tenants");
          if (rawTenants) {
            const tenantsList = JSON.parse(rawTenants);
            if (Array.isArray(tenantsList)) {
              matchedCreatedTenant = tenantsList.find(
                (t: any) => t.adminEmail?.toLowerCase() === userEmail
              );
            }
          }
        } catch {}

        if (matchedCreatedTenant) {
          const tId = matchedCreatedTenant.tenantId || matchedCreatedTenant.id;
          try {
            localStorage.setItem("aivi_active_tenant_id", tId);
            localStorage.setItem("aivi_active_tenant_code", matchedCreatedTenant.code?.toLowerCase());
            localStorage.setItem("aivi_active_tenant_name", matchedCreatedTenant.name);
            localStorage.setItem("aivi_active_role", "tenant_admin");
          } catch {}
          setTenant({
            tenantId: tId,
            role: "tenant_admin",
            branchScope: [],
            status: "active",
          });
          setIsAdmin(false);
          setUser((prev) => prev ? ({
            ...prev,
            displayName: matchedCreatedTenant.adminName || prev.displayName,
          } as any) : prev);
          return;
        }

        const savedRole = localStorage.getItem("aivi_active_role") as keyof typeof ROLE_PRESETS | null;
        if (savedRole && ROLE_PRESETS[savedRole]) {
          applyPresetRole(savedRole);
          return;
        }
      }

      let idTokenResult: any = null;
      try {
        idTokenResult = await firebaseUser.getIdTokenResult(true);
      } catch {
        try {
          idTokenResult = await firebaseUser.getIdTokenResult();
        } catch {}
      }
      const claims = idTokenResult?.claims || {};

      let roleData: any = null;
      let profileData: any = null;
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        const [roleSnap, profileSnap] = await Promise.all([
          getDoc(doc(db, "user_roles", firebaseUser.uid)).catch(() => null),
          getDoc(doc(db, "profiles", firebaseUser.uid)).catch(() => null),
        ]);
        if (roleSnap && roleSnap.exists()) roleData = roleSnap.data();
        if (profileSnap && profileSnap.exists()) profileData = profileSnap.data();
      } catch (roleErr) {
        // user_roles or profiles read is optional legacy check - ignore if unavailable
      }

      const legacyAdmin = roleData?.role === "admin";

      let role: TenantContextState["role"] =
        (claims.role as any) ||
        (roleData?.role as any) ||
        (profileData?.role as any) ||
        "b2c";
      let tenantId: string | null =
        (claims.tenantId as string) ||
        (claims.tenant_id as string) ||
        roleData?.tenantId ||
        profileData?.tenantId ||
        null;

      if (
        userEmail === "abhi.triloki@gmail.com" ||
        userEmail === "abhitriloki@gmail.com" ||
        userEmail === "staging.admin@aivicampus.com" ||
        userEmail === "qa.admin@aivicampus.com" ||
        claims.role === "platform_admin" ||
        claims.role === "admin" ||
        role === "platform_admin" ||
        legacyAdmin
      ) {
        role = "platform_admin";
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      if (role === "platform_admin") {
        // Platform admin doesn't need tenant overrides
      } else if (!isProdDomain) {
        const activeDemoTenant = getActiveDemoTenant();
        const demoTenantId = activeDemoTenant ? (activeDemoTenant.tenantId || activeDemoTenant.id) : "demo-sunrise";

        if (
          userEmail === "director.tpo@sunrise.ac.in" ||
          userEmail === "tpo.director@demo.aivilabs.com" ||
          userEmail === "tpo@sunrise.ac.in"
        ) {
          role = "tenant_admin";
          tenantId = "demo-sunrise";
        } else if (
          userEmail === "abhishek@sunrise.ac.in" ||
          userEmail === "aarav.sharma@sunrise.ac.in" ||
          userEmail === "student1@demo.aivilabs.com" ||
          (!tenantId && userEmail.includes("student"))
        ) {
          role = "student";
          tenantId = demoTenantId;
        } else if (userEmail === "coordinator.cse@demo.aivilabs.com") {
          role = "coordinator";
          tenantId = demoTenantId;
        }
      }

      // Prioritize explicit custom claims role and tenantId if present
      if (claims.role && claims.role !== "b2c" && claims.role !== "user") {
        role = claims.role as any;
      }
      if (claims.tenantId || claims.tenant_id) {
        tenantId = (claims.tenantId || claims.tenant_id) as string;
      }

      // If tenantId exists, check tenant_members as a reliable fallback if role is still ambiguous
      if (tenantId && (role === "b2c" || role === "user")) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          const memberSnap = await getDoc(doc(db, "tenant_members", `${tenantId}_${firebaseUser.uid}`)).catch(() => null);
          if (memberSnap && memberSnap.exists()) {
            const memberData = memberSnap.data();
            if (memberData?.role) {
              role = memberData.role;
            }
          }
        } catch {}
      }

      if (isProdDomain && role !== "platform_admin" && !tenantId) {
        try {
          localStorage.removeItem("aivi_active_tenant_id");
          localStorage.removeItem("aivi_active_tenant_code");
          localStorage.removeItem("aivi_active_tenant_name");
          localStorage.removeItem("aivi_active_role");
        } catch {}
      }

      let tenantStatus: "active" | "suspended" | "trial_expired" = "active";
      let tenantDocData: any = null;
      if (tenantId) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          const tSnap = await getDoc(doc(db, "tenants", tenantId)).catch(() => null);
          if (tSnap && tSnap.exists()) {
            const td = tSnap.data();
            tenantDocData = {
              id: tSnap.id,
              code: td?.code || "",
              name: td?.name || "",
              type: td?.type || "college",
              status: td?.status || "active",
              seats: td?.seats || 1000,
              seatsUsed: td?.seatsUsed || 0,
              modules: td?.modules || [],
              branding: td?.branding || {},
              academicYear: td?.academicYear || "2025-26",
            };
            if (td?.status) {
              tenantStatus = td.status;
            }
            if (td?.name) {
              try {
                localStorage.setItem("aivi_active_tenant_name", td.name);
                if (td.code) localStorage.setItem("aivi_active_tenant_code", td.code);
                localStorage.setItem("aivi_active_tenant_id", tSnap.id);
              } catch {}
            }

            // Guard 3: Self-Healing Anti-Demotion Guard
            // If the user's email matches td.adminEmail / td.tpoEmail, or UID matches td.adminUid,
            // they are officially the designated Primary TPO Administrator of this institution.
            // Automatically heal their role in this session to "tenant_admin".
            if (
              role !== "platform_admin" &&
              (
                (userEmail && (
                  userEmail === td?.adminEmail?.toLowerCase() ||
                  userEmail === td?.tpoEmail?.toLowerCase()
                )) ||
                firebaseUser.uid === td?.adminUid
              )
            ) {
              if (role !== "tenant_admin") {
                console.warn("AuthContext: Self-healing role to tenant_admin for Primary TPO Administrator:", userEmail);
                role = "tenant_admin";
              }
            }
          }
        } catch (tErr) {
          console.warn("AuthContext: Could not check tenant doc status:", tErr);
        }
      }

      // If tenantId was missing but user is registered as adminEmail on a tenant, self-heal connection
      if (!tenantId && role !== "platform_admin" && userEmail) {
        try {
          const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          const q = query(collection(db, "tenants"), where("adminEmail", "==", userEmail), limit(1));
          const qSnap = await getDocs(q).catch(() => null);
          if (qSnap && !qSnap.empty) {
            const foundDoc = qSnap.docs[0];
            tenantId = foundDoc.id;
            role = "tenant_admin";
            const td = foundDoc.data();
            tenantDocData = {
              id: foundDoc.id,
              code: td?.code || "",
              name: td?.name || "",
              type: td?.type || "college",
              status: td?.status || "active",
              seats: td?.seats || 1000,
              seatsUsed: td?.seatsUsed || 0,
              modules: td?.modules || [],
              branding: td?.branding || {},
              academicYear: td?.academicYear || "2025-26",
            };
            if (td?.status) tenantStatus = td.status;
            try {
              localStorage.setItem("aivi_active_tenant_name", td.name || "");
              if (td.code) localStorage.setItem("aivi_active_tenant_code", td.code);
              localStorage.setItem("aivi_active_tenant_id", foundDoc.id);
            } catch {}
          }
        } catch (adminLookupErr) {
          console.warn("AuthContext: Could not check tenants by adminEmail:", adminLookupErr);
        }
      }

      setTenant({
        tenantId,
        role,
        branchScope: (claims.branchScope as string[]) || [],
        status: tenantStatus,
        tenant: tenantDocData,
      });
    } catch (error) {
      console.error("AuthContext: Error fetching tenant claims:", error);
      const userEmail = (firebaseUser?.email || "").toLowerCase();
      if (
        userEmail === "abhi.triloki@gmail.com" ||
        userEmail === "abhitriloki@gmail.com" ||
        userEmail === "staging.admin@aivicampus.com" ||
        userEmail === "qa.admin@aivicampus.com"
      ) {
        setIsAdmin(true);
        setTenant({
          tenantId: null,
          role: "platform_admin",
          branchScope: [],
          status: "active",
        });
      } else {
        setIsAdmin(false);
        setTenant(defaultTenantState);
      }
    }
  };

  const switchUserRole = (newRole: "tenant_admin" | "coordinator" | "student" | "platform_admin") => {
    try {
      localStorage.setItem("aivi_active_role", newRole);
    } catch {}
    applyPresetRole(newRole);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      const isProd = typeof window !== "undefined" && (
        window.location.hostname === "aivicampus.com" ||
        window.location.hostname === "www.aivicampus.com" ||
        window.location.hostname === "staging.aivicampus.com" ||
        window.location.hostname === "isolation-staging.aivicampus.com"
      );
      const isLoginRoute = window.location.pathname.startsWith("/campus/login");

      if (!isProd && !isLoginRoute) {
        const savedRole = localStorage.getItem("aivi_active_role") as keyof typeof ROLE_PRESETS | null;
        if (savedRole && ROLE_PRESETS[savedRole]) {
          applyPresetRole(savedRole);
        } else if (window.location.pathname.startsWith("/campus")) {
          applyPresetRole("tenant_admin");
        }
      }

      const { onAuthStateChanged } = await import("firebase/auth");
      const { auth, authPersistenceReady } = await import("@/integrations/firebase/client");

      await authPersistenceReady;

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const uEmail = (firebaseUser.email || "").toLowerCase();
          if (
            uEmail === "abhi.triloki@gmail.com" ||
            uEmail === "abhitriloki@gmail.com" ||
            uEmail === "staging.admin@aivicampus.com" ||
            uEmail === "qa.admin@aivicampus.com"
          ) {
            setIsAdmin(true);
          }
          setUser(firebaseUser);
          await fetchTenantContext(firebaseUser);
        } else {
          if (!isProd && !window.location.pathname.startsWith("/campus/login")) {
            const currentSavedRole = localStorage.getItem("aivi_active_role") as keyof typeof ROLE_PRESETS | null;
            if (currentSavedRole && ROLE_PRESETS[currentSavedRole]) {
              applyPresetRole(currentSavedRole);
            } else if (window.location.pathname.startsWith("/campus")) {
              applyPresetRole("tenant_admin");
            } else {
              setUser(null);
              setIsAdmin(false);
              setTenant(defaultTenantState);
            }
          } else {
            setUser(null);
            setIsAdmin(false);
            setTenant(defaultTenantState);
          }
        }

        setLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      localStorage.removeItem("aivi_active_tenant_id");
      localStorage.removeItem("aivi_active_tenant_code");
      localStorage.removeItem("aivi_active_tenant_name");
      localStorage.removeItem("aivi_active_role");
      localStorage.removeItem("aivi_tenant_branding_override");
      localStorage.removeItem("aivi_user_resume_text");
      localStorage.removeItem("aivi_latest_resume_analysis");
      sessionStorage.removeItem("aivi_latest_resume_analysis");
      sessionStorage.removeItem("aivi_prefill_jd");
      // Clean up all local analysis history and resume memory caches to prevent cross-account leak
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("aivi_local_history_") || key.startsWith("aivi_user_resume_text"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
    const { signOut: firebaseSignOut } = await import("firebase/auth");
    const { auth } = await import("@/integrations/firebase/client");
    await firebaseSignOut(auth);
    setUser(null);
    setTenant(defaultTenantState);
  };

  const refreshTenantContext = async (targetUser?: User | null) => {
    const activeFirebaseUser = targetUser || user;
    if (activeFirebaseUser) {
      await fetchTenantContext(activeFirebaseUser);
    } else {
      try {
        const { auth } = await import("@/integrations/firebase/client");
        if (auth.currentUser) {
          await fetchTenantContext(auth.currentUser);
        }
      } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, tenant, signOut, refreshTenantContext, switchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useTenant = () => {
  const { tenant } = useAuth();
  return tenant;
};
