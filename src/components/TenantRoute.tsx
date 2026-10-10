import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ShieldAlert, ArrowRight, Mail } from "lucide-react";

const TenantRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, tenant, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/campus/login" replace />;

  const userEmail = (user.email || "").toLowerCase();
  const isPlatformAdmin =
    isAdmin ||
    userEmail === "abhi.triloki@gmail.com" ||
    userEmail === "abhitriloki@gmail.com" ||
    tenant.role === "platform_admin";

  const isLiveDomain = typeof window !== "undefined" && (
    window.location.hostname === "aivicampus.com" ||
    window.location.hostname === "www.aivicampus.com" ||
    window.location.hostname === "staging.aivicampus.com" ||
    window.location.hostname === "isolation-staging.aivicampus.com" ||
    window.location.hostname.endsWith(".aivicampus.com")
  );

  const activeLocalTenantId = !isLiveDomain && typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null;
  const activeLocalRole = !isLiveDomain && typeof window !== "undefined" ? localStorage.getItem("aivi_active_role") : null;
  const effectiveTenantId = tenant.tenantId || activeLocalTenantId;
  const effectiveRole = tenant.role !== "b2c" ? tenant.role : (activeLocalRole || "b2c");

  // Legitimate institutional access: platform admin OR a verified user affiliated with an accredited tenant
  const hasInstitutionalAccess =
    isPlatformAdmin ||
    Boolean(effectiveTenantId && effectiveRole !== "b2c" && effectiveRole !== "user") ||
    (!isLiveDomain && (userEmail === "director.tpo@sunrise.ac.in" || userEmail.endsWith("@sunrise.ac.in")));

  if (!hasInstitutionalAccess) {
    return (
      <div className="min-h-screen bg-[#0B1118] text-slate-100 flex flex-col items-center justify-center p-5">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#121B26]/90 p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Institutional Access Required</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Your account <span className="font-semibold text-slate-200">({user.email})</span> is not associated with an accredited institutional workspace on AIVI Campus.
          </p>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-xs text-slate-400 text-left mb-6 space-y-2.5">
            <p className="flex items-start gap-2">
              <span className="font-bold text-slate-200 shrink-0">• TPOs & Faculty:</span>
              <span>Sign in with your official university domain or institutional Google Workspace.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-slate-200 shrink-0">• Students:</span>
              <span>Sign in with the email address registered on your college's placement roster.</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-primary/90"
            >
              Sign Out & Use Institutional Email <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="mailto:hello@aivilabs.com"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition mt-2"
            >
              <Mail className="h-3.5 w-3.5" /> Contact Campus Support / Placement Cell
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Tenant Suspension Guard: If workspace is suspended, block access and explain clearly
  if (!isPlatformAdmin && tenant.status === "suspended") {
    return (
      <div className="min-h-screen bg-[#0B1118] text-slate-100 flex flex-col items-center justify-center p-5">
        <div className="max-w-md w-full rounded-2xl border border-amber-500/25 bg-[#121B26]/90 p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Institution Workspace Suspended</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The placement workspace for your institution has been temporarily suspended by system governance or campus administration. Access to placement drives, student rosters, and analytics is currently disabled.
          </p>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-xs text-slate-400 text-left mb-6 space-y-2.5">
            <p className="text-slate-300 font-semibold">How to restore access:</p>
            <p className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0">•</span>
              <span>Contact your College Placement Cell or Dean of Academic Affairs.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0">•</span>
              <span>Reach out to AIVI Support at <a href="mailto:hello@aivilabs.com" className="text-primary hover:underline font-medium">hello@aivilabs.com</a>.</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-primary/90 cursor-pointer"
            >
              Sign Out <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="mailto:hello@aivilabs.com"
              className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition mt-2"
            >
              <Mail className="h-3.5 w-3.5" /> Contact Campus Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TenantRoute;
