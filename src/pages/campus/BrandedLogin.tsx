import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  SAMLAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Fingerprint,
  Radar,
  Mic2,
  Award,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Check,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { getTenantBranding, provisionSsoUser } from "@/services/tenantService";
import { requestPasswordResetEmail } from "@/services/authEmailService";
import CampusLogo from "@/components/CampusLogo";
import { motion } from "framer-motion";

import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { useAuth } from "@/contexts/AuthContext";


const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function BrandedLogin({ defaultMode = "login" }: { defaultMode?: "login" | "register" } = {}) {
  const { tenantCode } = useParams<{ tenantCode?: string }>();
  const { subdomainSlug } = useTenantBranding();
  const { refreshTenantContext, user, signOut, isAdmin, tenant } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<"login" | "register">(defaultMode);
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [campusCodeInput, setCampusCodeInput] = useState("");
  const [isPlatformAdminMode, setIsPlatformAdminMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "tpo" | "faculty">("tpo");
  const [tenantBranding, setTenantBranding] = useState<any>(null);
  const [loadingBranding, setLoadingBranding] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/register")) {
      setAuthMode("register");
      setSelectedRole("student");
    }
  }, []);

  // isDemoMode: ONLY show demo shortcuts when explicitly visiting the Sunrise demo slug
  const isDemoMode =
    typeof window !== "undefined" &&
    (window.location.hostname === "demo-next.aivilabs.com" ||
      window.location.hostname.includes("demo-next") ||
      tenantCode === "sunrise" ||
      subdomainSlug === "sunrise");

  const loggingInRef = useRef(false);

  const isUserPlatformAdmin = Boolean(
    user && (
      user.email === "abhi.triloki@gmail.com" ||
      user.email === "abhitriloki@gmail.com" ||
      user.email === "staging.admin@aivicampus.com" ||
      user.email === "qa.admin@aivicampus.com" ||
      tenant?.role === "platform_admin" ||
      isAdmin
    )
  );

  useEffect(() => {
    // If a mock demo user is in state when visiting demo login, clear it so they see the login form cleanly (only when not actively logging in)
    if (!loggingInRef.current && !submitting && isDemoMode && user && ((user as any).uid?.startsWith("demo-") || user.email === "director.tpo@sunrise.ac.in")) {
      signOut();
      return;
    }

    // If an authenticated non-demo user lands on /campus/login, automatically route them
    const isMockDemoUser = user && ((user as any).uid?.startsWith("demo-") || user.email === "director.tpo@sunrise.ac.in");
    if (user && !loggingInRef.current && !submitting && !isMockDemoUser) {
      // If an already-authenticated platform admin is previewing the campus gateway (/campus/login)
      // or a specific branded college (/campus/login/:tenantCode), DO NOT auto-redirect them back to /platform-admin.
      // Allow them to inspect, preview gateways, or sign out.
      if (isUserPlatformAdmin) {
        return;
      }
      routeUserAfterAuth(user.email || "");
    }
  }, [user, isDemoMode, submitting, tenantCode, isUserPlatformAdmin]);

  useEffect(() => {
    // Don't fall back to "sunrise" — if no slug, show the generic portal
    const slug = tenantCode || subdomainSlug;
    if (!slug) {
      document.title = "AIVI Campus | Institutional Placement Portal";
      // No tenant identified — show generic AIVI Campus portal (no Sunrise branding)
      setTenantBranding({
        id: "",
        code: "",
        name: "AIVI Campus",
        type: "college",
        branding: {
          logoUrl: "",
          primaryColor: "#2D8B86",
          accentColor: "#20CFC0",
          loginHeadline: "Sign in to your institutional placement portal",
        },
      });
      setIsNotFound(false);
      setLoadingBranding(false);
      return;
    }

    setLoadingBranding(true);
    setIsNotFound(false);

    getTenantBranding(slug)
      .then((data) => {
        if (data && data.id) {
          setTenantBranding(data);
          setIsNotFound(false);
          const isLiveHost = typeof window !== "undefined" && (
            window.location.hostname === "aivicampus.com" ||
            window.location.hostname === "www.aivicampus.com" ||
            window.location.hostname === "staging.aivicampus.com" ||
            window.location.hostname === "isolation-staging.aivicampus.com" ||
            window.location.hostname.endsWith(".aivicampus.com")
          );
          if (!isLiveHost) {
            try {
              localStorage.setItem("aivi_active_tenant_id", data.id);
              localStorage.setItem("aivi_active_tenant_code", data.code?.toLowerCase());
              localStorage.setItem("aivi_active_tenant_name", data.name);
            } catch {}
          }
        } else {
          document.title = "Institution Not Found | AIVI Campus";
          setIsNotFound(true);
          setTenantBranding(null);
          toast.error("Institution not found. Please verify your campus code.");
        }
        setLoadingBranding(false);
      })
      .catch((err) => {
        console.error("Error loading tenant branding:", err);
        document.title = "Institution Not Found | AIVI Campus";
        setIsNotFound(true);
        setTenantBranding(null);
        toast.error("Institution not found. Please verify your campus code.");
        setLoadingBranding(false);
      });
  }, [tenantCode, subdomainSlug]);



  const routeUserAfterAuth = async (userEmail: string) => {
    const lowerEmail = userEmail.toLowerCase();
    const currentUser = auth.currentUser;
    let effectiveRole = "";
    let userTenantId = "";

    if (currentUser) {
      try {
        const idToken = await currentUser.getIdTokenResult(true);
        const claims = idToken.claims;
        if (claims.role) {
          effectiveRole = claims.role as string;
        }
        if (claims.tenantId || claims.tenant_id) {
          userTenantId = (claims.tenantId || claims.tenant_id) as string;
        }
      } catch (claimsErr) {
        console.warn("Could not fetch claims on login:", claimsErr);
      }

      // If claims did not provide role or tenantId, check user_roles and profiles
      if (!effectiveRole || !userTenantId) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          const [roleSnap, profileSnap] = await Promise.all([
            getDoc(doc(db, "user_roles", currentUser.uid)).catch(() => null),
            getDoc(doc(db, "profiles", currentUser.uid)).catch(() => null),
          ]);
          const roleData = roleSnap && roleSnap.exists() ? roleSnap.data() : null;
          const profileData = profileSnap && profileSnap.exists() ? profileSnap.data() : null;
          if (roleData?.role) effectiveRole = roleData.role;
          else if (profileData?.role) effectiveRole = profileData.role;

          if (roleData?.tenantId) userTenantId = roleData.tenantId;
          else if (profileData?.tenantId) userTenantId = profileData.tenantId;
        } catch (dbErr) {
          console.warn("Could not fetch user role or profile from firestore:", dbErr);
        }
      }
    }

    const isPlatformAdmin =
      lowerEmail === "abhi.triloki@gmail.com" ||
      lowerEmail === "abhitriloki@gmail.com" ||
      lowerEmail === "staging.admin@aivicampus.com" ||
      lowerEmail === "qa.admin@aivicampus.com" ||
      effectiveRole === "platform_admin";

    const isLiveDomain = typeof window !== "undefined" && (
      window.location.hostname === "aivicampus.com" ||
      window.location.hostname === "www.aivicampus.com" ||
      window.location.hostname === "staging.aivicampus.com" ||
      window.location.hostname === "isolation-staging.aivicampus.com" ||
      window.location.hostname.endsWith(".aivicampus.com")
    );

    // Hard block: Mock Sunrise demo accounts are strictly prohibited on live production/staging environments
    if (isLiveDomain && (lowerEmail.endsWith("@sunrise.ac.in") || lowerEmail.includes("demo.aivilabs.com"))) {
      loggingInRef.current = false;
      setSubmitting(false);
      try {
        await auth.signOut();
        localStorage.removeItem("aivi_active_tenant_id");
        localStorage.removeItem("aivi_active_tenant_code");
        localStorage.removeItem("aivi_active_tenant_name");
        localStorage.removeItem("aivi_active_role");
      } catch {}
      toast.error("Access Denied: Mock demo accounts (@sunrise.ac.in) are disabled on the live platform. Please create and sign in with a real institutional college account.");
      return;
    }

    // Strict Institutional Gate: On live staging/production domains, any non-platform-admin account
    // MUST have a verified tenant affiliation. Unaffiliated / random B2C Google accounts cannot log in.
    if (isLiveDomain && !isPlatformAdmin && !userTenantId) {
      if (tenantBranding?.id) {
        // Automatically associate new student account with the current campus workspace
        try {
          const { doc, setDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          userTenantId = tenantBranding.id;
          if (!effectiveRole) effectiveRole = "student";
          await Promise.all([
            setDoc(
              doc(db, "profiles", currentUser.uid),
              {
                id: currentUser.uid,
                email: currentUser.email || userEmail,
                name: currentUser.displayName || fullName || userEmail.split("@")[0],
                tenantId: tenantBranding.id,
                role: effectiveRole,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            ),
            setDoc(
              doc(db, "user_roles", currentUser.uid),
              {
                role: effectiveRole,
                tenantId: tenantBranding.id,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            ),
          ]);
        } catch (linkErr) {
          console.warn("Could not auto-link student to tenant:", linkErr);
        }
      } else {
        loggingInRef.current = false;
        setSubmitting(false);
        try {
          await auth.signOut();
          localStorage.removeItem("aivi_active_tenant_id");
          localStorage.removeItem("aivi_active_tenant_code");
          localStorage.removeItem("aivi_active_tenant_name");
          localStorage.removeItem("aivi_active_role");
        } catch {}
        toast.error(`Institutional Access Required: Your account (${userEmail}) is not associated with an accredited campus workspace. Please contact your college placement cell or TPO.`);
        return;
      }
    }

    // Strict Tenant Suspension Gate: Check if the user's institution has status === "suspended"
    if (!isPlatformAdmin) {
      let isSuspended = false;
      let tenantDisplayName = tenantBranding?.name || "Your institution";

      if (userTenantId) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();
          const tDoc = await getDoc(doc(db, "tenants", userTenantId)).catch(() => null);
          if (tDoc && tDoc.exists()) {
            const td = tDoc.data();
            tenantDisplayName = td?.name || tenantDisplayName;
            if (td?.status === "suspended") {
              isSuspended = true;
            }
          }
        } catch (err) {
          console.warn("Could not check tenant status in firestore:", err);
        }
      } else if (tenantBranding?.status === "suspended") {
        isSuspended = true;
      }

      if (isSuspended) {
        loggingInRef.current = false;
        setSubmitting(false);
        try {
          await auth.signOut();
          localStorage.removeItem("aivi_active_tenant_id");
          localStorage.removeItem("aivi_active_tenant_code");
          localStorage.removeItem("aivi_active_tenant_name");
          localStorage.removeItem("aivi_active_role");
        } catch {}
        toast.error(`Institution Workspace Suspended: Access for ${tenantDisplayName} is currently suspended. Please contact your college administration or AIVI Support.`);
        return;
      }
    }

    // Strict Tenant Boundary Enforcement:
    // If the user visits a specific branded college URL (e.g. /campus/login/rvce)
    const activeUrlTenantId = (tenantBranding?.id || "").toLowerCase();
    const activeUrlTenantCode = (tenantBranding?.code || tenantCode || "").toLowerCase();
    const isSpecificBrandedPortal = Boolean(activeUrlTenantId && activeUrlTenantCode);

    const isSunriseExplicit =
      !isLiveDomain &&
      (isDemoMode || activeUrlTenantCode === "sunrise" || activeUrlTenantId === "demo-sunrise" || activeUrlTenantId === "t-sunrise") && (
        lowerEmail === "director.tpo@sunrise.ac.in" ||
        lowerEmail === "abhishek@sunrise.ac.in" ||
        lowerEmail === "aarav.sharma@sunrise.ac.in" ||
        lowerEmail === "student1@demo.aivilabs.com" ||
        lowerEmail.endsWith("@sunrise.ac.in")
      );

    if (!isPlatformAdmin && isSpecificBrandedPortal) {
      // 1. If Sunrise account attempts to log into a non-sunrise tenant
      if (lowerEmail.endsWith("@sunrise.ac.in") && activeUrlTenantCode !== "sunrise" && activeUrlTenantId !== "demo-sunrise" && activeUrlTenantId !== "t-sunrise") {
        loggingInRef.current = false;
        setSubmitting(false);
        try {
          await auth.signOut();
          localStorage.removeItem("aivi_active_tenant_id");
          localStorage.removeItem("aivi_active_tenant_code");
          localStorage.removeItem("aivi_active_tenant_name");
          localStorage.removeItem("aivi_active_role");
        } catch {}
        toast.error(`Access Denied: Account ${userEmail} is registered with Sunrise College, not ${tenantBranding?.name || "this institution"}. Please use your college login portal.`);
        return;
      }

      // 2. If user has a known tenantId from token or database, verify strict match
      if (userTenantId) {
        const userTid = userTenantId.toLowerCase();
        const matchesId = userTid === activeUrlTenantId;
        const matchesCode = activeUrlTenantCode && (userTid.includes(activeUrlTenantCode) || activeUrlTenantCode.includes(userTid));
        if (!matchesId && !matchesCode && !isSunriseExplicit) {
          loggingInRef.current = false;
          setSubmitting(false);
          try {
            await auth.signOut();
            localStorage.removeItem("aivi_active_tenant_id");
            localStorage.removeItem("aivi_active_tenant_code");
            localStorage.removeItem("aivi_active_tenant_name");
            localStorage.removeItem("aivi_active_role");
          } catch {}
          toast.error(`Access Denied: Your account is registered with a different institution. Please sign in via your college portal.`);
          return;
        }
      }
    }

    const effectiveTenantId = userTenantId || (!isLiveDomain ? tenantBranding?.id || (isSunriseExplicit ? "demo-sunrise" : "") : "");
    const adminEmail = (tenantBranding as any)?.adminEmail?.toLowerCase();
    const isTenantAdmin =
      !isPlatformAdmin && (
        effectiveRole === "tenant_admin" ||
        effectiveRole === "coordinator" ||
        effectiveRole === "placement_director" ||
        effectiveRole === "tpo" ||
        Boolean(adminEmail && lowerEmail === adminEmail) ||
        (isSunriseExplicit && lowerEmail === "director.tpo@sunrise.ac.in") ||
        (!effectiveRole && selectedRole !== "student")
      );

    const isStudent = !isPlatformAdmin && !isTenantAdmin && (
      effectiveRole === "student" ||
      (isSunriseExplicit && (
        lowerEmail === "abhishek@sunrise.ac.in" ||
        lowerEmail === "aarav.sharma@sunrise.ac.in" ||
        lowerEmail === "student1@demo.aivilabs.com"
      )) ||
      (!isLiveDomain && lowerEmail.includes("student")) ||
      (!effectiveRole && selectedRole === "student")
    );

    const isSunriseDemoUser = isSunriseExplicit;

    const activeTenantId =
      effectiveTenantId ||
      (!isLiveDomain ? tenantBranding?.id : "") ||
      (isSunriseDemoUser ? "demo-sunrise" : "");
    const activeTenantCode =
      tenantBranding?.code?.toLowerCase() ||
      (isSunriseDemoUser ? "sunrise" : "");
    let activeTenantName = tenantBranding?.name || (isSunriseDemoUser ? "Sunrise Institute of Technology" : "");
    if (!activeTenantName && userTenantId) {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        const tDoc = await getDoc(doc(db, "tenants", userTenantId)).catch(() => null);
        if (tDoc && tDoc.exists()) {
          activeTenantName = tDoc.data()?.name || "";
        }
      } catch {}
    }
    if (!activeTenantName) {
      activeTenantName = isSunriseDemoUser ? "Sunrise Institute of Technology" : "AIVI Campus";
    }

    try {
      if (activeTenantId) localStorage.setItem("aivi_active_tenant_id", activeTenantId);
      if (activeTenantCode) localStorage.setItem("aivi_active_tenant_code", activeTenantCode);
      if (activeTenantName) localStorage.setItem("aivi_active_tenant_name", activeTenantName);
      if (!isPlatformAdmin) {
        localStorage.setItem("aivi_active_role", isStudent ? "student" : "tenant_admin");
      }
    } catch {}

    try {
      await refreshTenantContext(currentUser);
    } catch {}

    const isPasswordProvider = currentUser.providerData?.some(
      (p) => p.providerId === "password"
    );
    if (isPasswordProvider && !currentUser.emailVerified && isLiveDomain) {
      loggingInRef.current = false;
      setSubmitting(false);
      toast.info("Please verify your email address to access your campus workspace.");
      navigate("/verify-email");
      return;
    }

    const targetUrl = isPlatformAdmin
      ? "/platform-admin"
      : isStudent
      ? "/campus/student-drives"
      : "/campus";

    toast.success("Signed in successfully!");

    try {
      navigate(targetUrl, { replace: true });
    } catch {}

    // Fallback: If router state is pending, force browser navigation after short tick
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (window.location.pathname.includes("/campus/login") || window.location.pathname === "/") {
          window.location.assign(targetUrl);
        }
      }, 150);
    }
  };

  const handleForgotPassword = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      toast.error("Please enter your email address in the field above first.");
      return;
    }
    setSubmitting(true);
    try {
      const targetTenantCode = tenantBranding?.code || tenantCode || undefined;
      const targetTenantName = tenantBranding?.name || undefined;
      await requestPasswordResetEmail(targetEmail, targetTenantCode, targetTenantName);
      const displayName = targetTenantName || (targetTenantCode ? `${targetTenantCode.toUpperCase()} Portal` : "your campus portal");
      toast.success(`Password reset instructions for ${displayName} have been sent to ${targetEmail}.`);
    } catch (err: any) {
      console.error("Password reset error:", err);
      toast.error(err.message || "Could not send password reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const performLogin = async (loginEmail: string, loginPass: string) => {
    loggingInRef.current = true;
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      await routeUserAfterAuth(loginEmail);
    } catch (err: any) {
      loggingInRef.current = false;
      console.error("Login failed:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-login-credentials"
      ) {
        toast.error("Invalid email or password. Please verify your institutional credentials or contact your TPO.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please wait a few minutes before trying again.");
      } else {
        toast.error(err.message || "Authentication failed. Please check your credentials.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !password) {
      toast.error("Please enter your student email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    const activeTenantId = tenantBranding?.id;
    if (!activeTenantId) {
      toast.error("Campus workspace could not be identified. Please enter your college code.");
      return;
    }

    loggingInRef.current = true;
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      try {
        await updateProfile(cred.user, { displayName: fullName.trim() });
      } catch {}

      try {
        await sendEmailVerification(cred.user);
      } catch (evErr) {
        console.warn("Failed to send verification email:", evErr);
      }

      try {
        const { doc, setDoc } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        await Promise.all([
          setDoc(
            doc(db, "profiles", cred.user.uid),
            {
              id: cred.user.uid,
              name: fullName.trim(),
              email: cred.user.email || email.trim(),
              tenantId: activeTenantId,
              role: "student",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ),
          setDoc(
            doc(db, "user_roles", cred.user.uid),
            {
              role: "student",
              tenantId: activeTenantId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ),
        ]);
      } catch (dbErr) {
        console.warn("Could not save profile during registration:", dbErr);
      }

      toast.success("Account created! Verification link sent to your email.");
      navigate("/verify-email");
    } catch (err: any) {
      loggingInRef.current = false;
      const msg =
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in instead."
          : err.message || "Registration failed.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your institutional email and password.");
      return;
    }
    await performLogin(email, password);
  };

  const handleGoogleLogin = async () => {
    loggingInRef.current = true;
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await routeUserAfterAuth(cred.user.email || "");
    } catch (err: any) {
      loggingInRef.current = false;
      toast.error(err.message || "Google authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSsoLogin = async () => {
    if (!tenantBranding?.sso?.providerId) {
      toast.error("SSO Provider is not configured for this institution.");
      return;
    }
    loggingInRef.current = true;
    setSubmitting(true);
    try {
      let provider: SAMLAuthProvider | OAuthProvider;
      if (tenantBranding.sso.protocol === "saml") {
        provider = new SAMLAuthProvider(tenantBranding.sso.providerId);
      } else {
        provider = new OAuthProvider(tenantBranding.sso.providerId);
      }

      const cred = await signInWithPopup(auth, provider);
      await provisionSsoUser(tenantBranding.id);
      toast.success(`Signed in via ${tenantBranding.name} Single Sign-On!`);
      await routeUserAfterAuth(cred.user.email || "");
    } catch (err: any) {
      loggingInRef.current = false;
      console.error("SSO Authentication error:", err);
      setSsoError("Single Sign-On authentication was unsuccessful. Please verify your institutional login.");
    } finally {
      setSubmitting(false);
    }
  };

  const autofillAndLogin = async (kind: "tpo" | "student") => {
    if (kind === "tpo") {
      const tpoEmail = (tenantBranding as any)?.adminEmail || "director.tpo@sunrise.ac.in";
      const tpoPass = (tenantBranding as any)?.adminPassword || "DemoTpo2025!";
      setEmail(tpoEmail);
      setPassword(tpoPass);
      await performLogin(tpoEmail, tpoPass);
    } else {
      const codeStr = tenantBranding?.code?.toLowerCase() || "sunrise";
      const studentEmail = codeStr === "sunrise" ? "abhishek@sunrise.ac.in" : `student1@${codeStr}.ac.in`;
      const studentPass = "DemoStudent@2026";
      setEmail(studentEmail);
      setPassword(studentPass);
      await performLogin(studentEmail, studentPass);
    }
  };

  if (loadingBranding) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F1720]">
        <div className="relative mb-6 h-12 w-12 animate-spin rounded-full border-2 border-[hsl(176_52%_45%)] border-t-transparent [animation-duration:0.9s]" />
        <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-500">Loading institutional portal…</p>
      </div>
    );
  }

  const name = tenantBranding?.name || "AIVI Campus";
  const slug = tenantCode || subdomainSlug;
  const isGenericGateway = !slug;
  const isSuspended = tenantBranding?.status === "suspended";


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F1720] text-slate-100">
      {/* Platform Master Admin Live Preview Notice */}
      {isUserPlatformAdmin && tenantCode && (
        <div className="relative z-30 flex items-center justify-between border-b border-amber-500/25 bg-amber-950/40 px-6 py-2.5 text-xs text-amber-200 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-300">Platform Master Admin Preview Mode:</span>
            <span>Logged in as <strong>{user?.email}</strong>. Inspecting <strong>{tenantBranding?.name || tenantCode}</strong> portal.</span>
          </div>
          <Link
            to="/platform-admin"
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-300 transition hover:bg-amber-500/20 hover:text-white"
          >
            <span>Return to Master Admin Console</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* ambient glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-52 top-[-160px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,hsl(177_51%_36%/0.4),transparent)] blur-2xl" />
        <div className="absolute bottom-[-220px] right-[-120px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,hsl(177_51%_38%/0.22),transparent)] blur-2xl" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.035)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.035)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_20%,black,transparent)]" />
      </div>

      {/* top-left brand — official transparent AIVI Campus mark */}
      <Link
        to="/"
        className={`absolute left-6 ${isUserPlatformAdmin && tenantCode ? "top-16" : "top-6"} z-20 flex items-center gap-3 transition-transform hover:scale-[1.02]`}
      >
        <CampusLogo onDark className="h-11 w-[170px]" imgClassName="h-9 w-full" />
      </Link>
      <Link
        to="/"
        className={`absolute right-6 ${isUserPlatformAdmin && tenantCode ? "top-16" : "top-6"} z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12.5px] font-bold text-slate-300 backdrop-blur transition hover:border-white/25 hover:text-white`}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to site
      </Link>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1240px] items-center gap-12 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left showcase */}
        <div className="hidden lg:block">
          <motion.div initial={fade.initial} animate={fade.animate} transition={{ duration: 0.7 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-[hsl(176_52%_45%/0.3)] bg-[hsl(176_52%_45%/0.08)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
              <Fingerprint className="h-3.5 w-3.5" /> Institutional Single Sign-On
            </p>
            <h1 className="mt-6 max-w-xl font-display text-[clamp(2.4rem,4.4vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-white">
              Welcome back to your <span className="text-[hsl(176_52%_62%)]">campus command center.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
              Every student's Employability Score, every drive pipeline, every NAAC export — in one place. Sign in to
              continue where your placement cell left off.
            </p>

            {/* feature chips */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { icon: Radar, t: "Live AES", s: "batch readiness" },
                { icon: Mic2, t: "Voice AI", s: "Hindi mock rounds" },
                { icon: Award, t: "NAAC packs", s: "one-click exports" },
              ].map((f) => (
                <div
                  key={f.t}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur transition hover:border-[hsl(176_52%_45%/0.35)]"
                >
                  <f.icon className="h-5 w-5 text-[hsl(176_52%_60%)]" />
                  <p className="mt-2.5 text-[13px] font-bold text-white">{f.t}</p>
                  <p className="text-[10.5px] font-medium text-slate-500">{f.s}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto w-full max-w-[460px]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101820]/90 p-7 shadow-[0_60px_140px_-50px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(176_52%_55%/0.6)] to-transparent" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(177_51%_36%/0.25),transparent_70%)] blur-xl" />

            {/* Active Account Switcher Banner */}
            {user && !((user as any).uid?.startsWith("demo-") || user.email === "director.tpo@sunrise.ac.in") && (
              <div className="relative mb-6 rounded-2xl border border-[hsl(176_52%_45%/0.3)] bg-[hsl(176_52%_45%/0.08)] p-3.5 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[hsl(176_52%_62%)]">
                      Active Session
                    </p>
                    <p className="truncate text-[12.5px] font-bold text-white mt-0.5">{user.email}</p>
                    <p className="text-[10.5px] text-slate-400">
                      {isUserPlatformAdmin
                        ? "Platform Master Administrator"
                        : "Institutional User"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUserPlatformAdmin ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => navigate("/platform-admin")}
                        className="h-7 rounded-lg bg-[hsl(176_52%_45%/0.25)] hover:bg-[hsl(176_52%_45%/0.4)] text-[hsl(176_52%_70%)] text-[11px] font-bold border border-[hsl(176_52%_45%/0.4)] cursor-pointer"
                      >
                        Console →
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => routeUserAfterAuth(user.email || "")}
                        className="h-7 rounded-lg bg-[hsl(176_52%_45%/0.25)] hover:bg-[hsl(176_52%_45%/0.4)] text-[hsl(176_52%_70%)] text-[11px] font-bold border border-[hsl(176_52%_45%/0.4)] cursor-pointer"
                      >
                        Dashboard →
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await signOut();
                        toast.success("Signed out successfully. You can now sign in with a different account.");
                      }}
                      className="h-7 rounded-lg border-white/10 hover:bg-white/10 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isGenericGateway && !isPlatformAdminMode ? (
              <div>
                {/* Find Your College Portal Gateway */}
                <div className="relative text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[hsl(176_52%_45%/0.35)] bg-gradient-to-b from-[#101820] to-[#101820] text-[hsl(176_52%_60%)] shadow-[0_12px_30px_-10px_hsl(177_51%_40%/0.6)]">
                    <Building2 className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[hsl(176_52%_62%)]">
                    INSTITUTIONAL GATEWAY
                  </p>
                  <h1 className="mt-1.5 font-display text-[24px] font-semibold leading-tight text-white">Find Your College Portal</h1>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    Enter your institution's campus code or slug to access your accredited placement workspace.
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const clean = campusCodeInput.trim().toLowerCase();
                    if (!clean) {
                      toast.error("Please enter your institution's campus code.");
                      return;
                    }
                    setIsValidatingCode(true);
                    try {
                      const data = await getTenantBranding(clean);
                      if (data && data.id) {
                        navigate(`/campus/login/${encodeURIComponent(clean)}`);
                      } else {
                        toast.error("Institution not found. Please verify your campus code.");
                      }
                    } catch {
                      toast.error("Institution not found. Please verify your campus code.");
                    } finally {
                      setIsValidatingCode(false);
                    }
                  }}
                  className="relative mt-6 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="gateway-code"
                      className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                    >
                      Campus code or slug
                      <span className="rounded bg-[hsl(176_52%_45%/0.1)] px-2 py-0.5 font-mono text-[10px] font-bold text-[hsl(176_52%_60%)]">
                        e.g. sunrise-institute, rvce
                      </span>
                    </label>
                    <Input
                      id="gateway-code"
                      type="text"
                      value={campusCodeInput}
                      onChange={(e) => setCampusCodeInput(e.target.value.toLowerCase().trim())}
                      placeholder="Enter your campus code"
                      autoFocus
                      required
                      disabled={isValidatingCode}
                      className="h-12 rounded-xl border-white/10 bg-[#0F1720]/80 font-mono text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)] text-[14px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isValidatingCode}
                    className="group h-12 w-full rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_29%))] text-[15px] font-bold text-white shadow-[0_16px_36px_-12px_hsl(176_52%_44%/0.9),inset_0_1px_0_hsl(0_0%_100%/0.3)] hover:-translate-y-0.5 hover:brightness-110"
                  >
                    {isValidatingCode ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Validating Campus Code...
                      </span>
                    ) : (
                      <>
                        Continue to College Portal
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-[12px] text-slate-400">
                  <p className="flex items-start gap-2">
                    <span className="font-semibold text-slate-300 shrink-0">• Placement Cell:</span>
                    <span>Students & faculty must access their accredited college portal. Ask your TPO for your college URL.</span>
                  </p>
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#101820] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      platform administration
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlatformAdminMode(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-white transition py-1.5 cursor-pointer rounded-lg hover:bg-white/[0.04]"
                >
                  <Lock className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" /> Platform Master Admin Sign In
                </button>
              </div>
            ) : isNotFound ? (
              <div>
                {/* Institution Not Found Card */}
                <div className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 shadow-lg">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-rose-400">
                    CAMPUS NOT FOUND
                  </span>
                  <h1 className="mt-3 font-display text-[22px] font-semibold leading-tight text-white">Institution Not Found</h1>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-300 font-medium">
                    Institution not found. Please verify your campus code.
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                    No accredited placement workspace was found matching code <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">{slug}</span>.
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-[#0F1720]/80 p-4 space-y-3">
                  <label className="block text-[12px] font-bold text-slate-300 text-left">
                    Try a different campus code:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={campusCodeInput}
                      onChange={(e) => setCampusCodeInput(e.target.value.toLowerCase().trim())}
                      placeholder="e.g. sunrise-institute, rvce"
                      disabled={isValidatingCode}
                      className="h-10 flex-1 rounded-xl border-white/10 bg-[#101820] font-mono text-[13px] text-slate-200 placeholder:text-slate-600"
                    />
                    <Button
                      type="button"
                      disabled={isValidatingCode}
                      onClick={async () => {
                        const clean = campusCodeInput.trim().toLowerCase();
                        if (!clean) {
                          toast.error("Please enter your institution's campus code.");
                          return;
                        }
                        setIsValidatingCode(true);
                        try {
                          const data = await getTenantBranding(clean);
                          if (data && data.id) {
                            navigate(`/campus/login/${encodeURIComponent(clean)}`);
                          } else {
                            toast.error("Institution not found. Please verify your campus code.");
                          }
                        } catch {
                          toast.error("Institution not found. Please verify your campus code.");
                        } finally {
                          setIsValidatingCode(false);
                        }
                      }}
                      className="h-10 rounded-xl px-4 text-[13px] font-bold"
                    >
                      {isValidatingCode ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <>Go <ArrowRight className="h-3.5 w-3.5 ml-1" /></>}
                    </Button>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setCampusCodeInput("");
                      navigate("/campus/login");
                    }}
                    className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 text-[13.5px] font-bold text-white border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to College Gateway
                  </Button>
                </div>
              </div>
            ) : isSuspended ? (
              <div>
                {/* Suspended Institution Card */}
                <div className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shadow-lg">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-amber-400">
                    WORKSPACE SUSPENDED
                  </span>
                  <h1 className="mt-3 font-display text-[22px] font-semibold leading-tight text-white">{name}</h1>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                    The placement workspace for this institution has been temporarily suspended by system governance. Active placement drives, mock interview labs, and student rosters are offline.
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-[12px] text-amber-200/90 text-left space-y-2">
                  <p className="font-semibold text-amber-300">How to restore institutional access:</p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>Contact your campus Placement Cell or Dean of Academic Affairs.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>Reach out to AIVI Enterprise Support at <a href="mailto:hello@aivilabs.com" className="text-white underline font-medium">hello@aivilabs.com</a>.</span>
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={() => navigate("/campus/login")}
                    className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 text-[13.5px] font-bold text-white border border-white/10 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Enter Different Campus Code
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {isPlatformAdminMode ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsPlatformAdminMode(false)}
                      className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-400 hover:text-white mb-4 transition cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" /> {isGenericGateway ? "Back to College Search" : `Back to ${name} Sign In`}
                    </button>
                    <div className="relative text-center">
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[hsl(176_52%_45%/0.35)] bg-gradient-to-b from-[#101820] to-[#101820] text-[hsl(176_52%_60%)] shadow-md">
                        <Lock className="h-5 w-5" />
                      </span>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[hsl(176_52%_62%)]">
                        SYSTEM CONTROL
                      </p>
                      <h1 className="mt-1 font-display text-[22px] font-semibold leading-tight text-white">Master Admin Sign In</h1>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">
                        Sign in with authorized AIVI platform administrator credentials.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <Link
                        to="/campus/login"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition"
                      >
                        <ArrowLeft className="h-3 w-3" /> Change college
                      </Link>
                    </div>
                    <div className="relative text-center">
                      {tenantBranding?.branding?.logoUrl ? (
                        <img
                          src={tenantBranding.branding.logoUrl}
                          alt={name}
                          className="mx-auto h-14 w-14 rounded-2xl border border-white/10 bg-white p-1.5 object-contain shadow-lg"
                        />
                      ) : (
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[hsl(176_52%_45%/0.35)] bg-gradient-to-b from-[#101820] to-[#101820] text-[hsl(176_52%_60%)] shadow-[0_12px_30px_-10px_hsl(177_51%_40%/0.6)]">
                          <Building2 className="h-6 w-6" />
                        </span>
                      )}
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[hsl(176_52%_62%)]">
                        {authMode === "register" ? "STUDENT SELF-REGISTRATION" : tenantBranding?.code && tenantBranding.code.trim() ? tenantBranding.code : "AIVI CAMPUS"}
                      </p>
                      <h1 className="mt-1.5 font-display text-[24px] font-semibold leading-tight text-white">{name}</h1>
                      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                        {authMode === "register"
                          ? "Create your student account to access your placement workspace."
                          : tenantBranding?.branding?.loginHeadline || "Sign in to access your campus career intelligence OS."}
                      </p>
                    </div>
                  </div>
                )}

                {/* sso error notice */}
                {ssoError && (
                  <div className="mt-5 space-y-2 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-3.5 text-[12px] text-red-200">
                    <p className="flex items-center gap-2 font-bold text-red-300">
                      <AlertCircle className="h-4 w-4" /> Institutional SSO Notice / संस्थान लॉगिन त्रुटि
                    </p>
                    <p>{ssoError}</p>
                  </div>
                )}

                {/* quick 1-click demo role fill — ONLY shown on localhost or the Sunrise demo slug */}
                {isDemoMode && (
                  <div className="relative mt-6 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => autofillAndLogin("tpo")}
                      disabled={submitting}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[hsl(176_52%_45%/0.3)] bg-[hsl(176_52%_45%/0.08)] px-3 py-2.5 text-[11.5px] font-bold text-[hsl(176_52%_66%)] transition hover:bg-[hsl(176_52%_45%/0.16)] cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> ⚡ TPO demo login
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillAndLogin("student")}
                      disabled={submitting}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11.5px] font-bold text-slate-300 transition hover:bg-white/[0.09] cursor-pointer"
                    >
                      🎓 Student demo login
                    </button>
                  </div>
                )}

                {/* sso button */}
                {tenantBranding?.sso?.providerId && (
                  <>
                    <Button
                      onClick={handleSsoLogin}
                      disabled={submitting}
                      className="mt-4 h-11 w-full rounded-xl bg-[linear-gradient(120deg,#1C6B68,#2D8B86)] text-[14px] font-bold text-white shadow-[0_10px_28px_-10px_hsl(176_52%_50%/0.8)] hover:brightness-110"
                    >
                      <ShieldCheck className="h-4 w-4" /> {tenantBranding.sso.buttonText || `Sign in with ${name}`}
                    </Button>
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.08]" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#101820] px-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          or with email
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* 3-Pill Role Selector (Student | TPO / Admin | Faculty) */}
                {/* 3-Pill Role Selector (Student | TPO / Admin | Faculty) */}
                {!isGenericGateway && !isPlatformAdminMode && authMode === "login" && (
                  <div className="relative mt-5 mb-4">
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.04] p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("student")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[12px] font-bold transition cursor-pointer ${
                          selectedRole === "student"
                            ? "bg-[linear-gradient(180deg,hsl(176_52%_46%/0.35),hsl(178_58%_29%/0.35))] text-[hsl(176_52%_66%)] border border-[hsl(176_52%_45%/0.5)] shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                        }`}
                      >
                        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Student</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("tpo")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[12px] font-bold transition cursor-pointer ${
                          selectedRole === "tpo"
                            ? "bg-[linear-gradient(180deg,hsl(176_52%_46%/0.35),hsl(178_58%_29%/0.35))] text-[hsl(176_52%_66%)] border border-[hsl(176_52%_45%/0.5)] shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                        }`}
                      >
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">TPO / Admin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole("faculty")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[12px] font-bold transition cursor-pointer ${
                          selectedRole === "faculty"
                            ? "bg-[linear-gradient(180deg,hsl(176_52%_46%/0.35),hsl(178_58%_29%/0.35))] text-[hsl(176_52%_66%)] border border-[hsl(176_52%_45%/0.5)] shadow-sm"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                        }`}
                      >
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Faculty</span>
                      </button>
                    </div>

                    {/* Role Context Hint */}
                    <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
                      {selectedRole === "student" && "🎓 Student Placement & AI Mock Interview Lab"}
                      {selectedRole === "tpo" && "🏢 Placement Cell, Deans & Campus Directors"}
                      {selectedRole === "faculty" && "👥 Department Coordinators & Faculty Evaluators"}
                    </p>
                  </div>
                )}

                {/* Form: Register vs Login */}
                {authMode === "register" ? (
                  <form onSubmit={handleRegister} className="relative mt-4 space-y-3.5">
                    <div>
                      <label
                        htmlFor="register-fullname"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        Full Name
                      </label>
                      <Input
                        id="register-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Nikita Sonawane"
                        required
                        className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="register-email"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        Student Email
                        <span className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-500">
                          <Mail className="h-3 w-3" /> @{tenantBranding?.code?.toLowerCase() || "campus"}.ac.in
                        </span>
                      </label>
                      <Input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`e.g. student@${tenantBranding?.code?.toLowerCase() || "campus"}.ac.in`}
                        required
                        className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="register-password"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        Password (min 6 characters)
                      </label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          minLength={6}
                          className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 font-mono text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)] pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="register-confirm-password"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        Confirm Password
                      </label>
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                        className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 font-mono text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)]"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="group h-12 w-full rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_29%))] text-[15px] font-bold text-white shadow-[0_16px_36px_-12px_hsl(176_52%_44%/0.9),inset_0_1px_0_hsl(0_0%_100%/0.3)] hover:-translate-y-0.5 hover:brightness-110 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Creating Account…
                        </>
                      ) : (
                        <>
                          Create Student Account
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailLogin} className="relative mt-4 space-y-3.5">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        {isPlatformAdminMode
                          ? "Administrator email"
                          : selectedRole === "student"
                          ? "College Student Email / USN"
                          : selectedRole === "faculty"
                          ? "Faculty Coordinator Email"
                          : "Placement Officer / TPO Email"}
                        <span className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-500">
                          <Mail className="h-3 w-3" /> @{isPlatformAdminMode ? "aivicampus.com" : `${tenantBranding?.code?.toLowerCase() || "campus"}.ac.in`}
                        </span>
                      </label>
                      <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          isPlatformAdminMode
                            ? "staging.admin@aivicampus.com"
                            : selectedRole === "student"
                            ? `e.g. student@${tenantBranding?.code?.toLowerCase() || "campus"}.ac.in`
                            : selectedRole === "faculty"
                            ? `e.g. faculty.cse@${tenantBranding?.code?.toLowerCase() || "campus"}.ac.in`
                            : `e.g. ${(tenantBranding as any)?.adminEmail || `director.tpo@${tenantBranding?.code?.toLowerCase() || "campus"}.ac.in`}`
                        }
                        required
                        className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="login-password"
                        className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-slate-300"
                      >
                        Password
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          disabled={submitting}
                          className="flex items-center gap-1 text-[10.5px] font-semibold text-[hsl(176_52%_60%)] hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          <KeyRound className="h-3 w-3" /> Forgot?
                        </button>
                      </label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="h-11 rounded-xl border-white/10 bg-[#0F1720]/80 font-mono text-slate-100 placeholder:text-slate-600 hover:border-white/20 focus:border-[hsl(176_52%_50%/0.6)] pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="group h-12 w-full rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_29%))] text-[15px] font-bold text-white shadow-[0_16px_36px_-12px_hsl(176_52%_44%/0.9),inset_0_1px_0_hsl(0_0%_100%/0.3)] hover:-translate-y-0.5 hover:brightness-110"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Signing in…
                        </>
                      ) : (
                        <>
                          {isPlatformAdminMode
                            ? "Sign in to System Control"
                            : selectedRole === "student"
                            ? "Sign in to Student Placement Lab"
                            : selectedRole === "faculty"
                            ? "Sign in to Coordinator Dashboard"
                            : "Sign in to Command Center"}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                )}

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#101820] px-3 text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      or
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="h-11 w-full rounded-xl border-white/12 bg-white/[0.03] text-[13.5px] font-bold text-slate-200 hover:bg-white/[0.08] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 mr-2">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  {authMode === "register" ? "Sign up with Google Workspace" : "Sign in with Google Workspace"}
                </Button>

                {!isGenericGateway && !isPlatformAdminMode && authMode === "login" && (
                  <div className="mt-4 text-center">
                    <p className="text-[12.5px] text-slate-400">
                      New student at {name}?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("register");
                          setSelectedRole("student");
                          if (tenantCode) {
                            navigate(`/campus/register/${tenantCode}`);
                          }
                        }}
                        className="font-bold text-[hsl(176_52%_62%)] hover:underline cursor-pointer"
                      >
                        Create Student Account →
                      </button>
                    </p>
                  </div>
                )}

                {authMode === "register" && (
                  <div className="mt-4 text-center">
                    <p className="text-[12.5px] text-slate-400">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("login");
                          if (tenantCode) {
                            navigate(`/campus/login/${tenantCode}`);
                          }
                        }}
                        className="font-bold text-[hsl(176_52%_62%)] hover:underline cursor-pointer"
                      >
                        Sign in to your account →
                      </button>
                    </p>
                  </div>
                )}

                {/* campus code selector */}
                {!isGenericGateway && (
                  <div className="relative mt-5 rounded-2xl border border-white/[0.07] bg-[#0F1720]/50 p-4">
                    <p className="flex items-center justify-between text-[11.5px] font-bold text-slate-400">
                      Have a specific campus code?
                      <span className="rounded bg-[hsl(176_52%_45%/0.1)] px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-[hsl(176_52%_60%)]">
                        e.g. your-college
                      </span>
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <Input
                        value={campusCodeInput}
                        onChange={(e) => setCampusCodeInput(e.target.value.toLowerCase().trim())}
                        placeholder="Enter code"
                        disabled={isValidatingCode}
                        className="h-9 flex-1 rounded-lg border-white/10 bg-[#101820] font-mono text-[12px] text-slate-200 placeholder:text-slate-600"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={isValidatingCode}
                        onClick={async () => {
                          const clean = campusCodeInput.trim().toLowerCase();
                          if (!clean) {
                            toast.error("Please enter a valid campus code.");
                            return;
                          }
                          setIsValidatingCode(true);
                          try {
                            const data = await getTenantBranding(clean);
                            if (data && data.id) {
                              navigate(`/campus/login/${encodeURIComponent(clean)}`);
                            } else {
                              toast.error("Institution not found. Please verify your campus code.");
                            }
                          } catch {
                            toast.error("Institution not found. Please verify your campus code.");
                          } finally {
                            setIsValidatingCode(false);
                          }
                        }}
                        className="h-9 rounded-lg px-4 text-[12px]"
                      >
                        {isValidatingCode ? <RefreshCw className="h-3 w-3 animate-spin" /> : <>Go <ArrowRight className="h-3 w-3 ml-1" /></>}
                      </Button>
                    </div>
                  </div>
                )}

                {!isPlatformAdminMode && (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.08]" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#101820] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          platform administration
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPlatformAdminMode(true)}
                      className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-white transition py-1.5 cursor-pointer rounded-lg hover:bg-white/[0.04]"
                    >
                      <Lock className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" /> Platform Master Admin Sign In
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="relative mt-5 flex items-center justify-between text-[11.5px] font-semibold">
              <Link
                to="/#demo"
                className="flex items-center gap-1 text-slate-400 transition hover:text-[hsl(176_52%_60%)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" /> Book a college demo
              </Link>
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/80" /> DPDP · India-hosted
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-slate-600">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            Powered by AIVI Campus Intelligence OS — AIVI Intelligence Private Limited
          </div>
        </motion.div>
      </div>
    </div>
  );
}
