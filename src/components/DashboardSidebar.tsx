import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AiviLogo from "./AiviLogo";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Target,
  Route,
  Mic,
  TrendingUp,
  FolderOpen,
  FolderLock,
  Linkedin,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  PenTool,
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/vault", label: "Institutional Resume Vault", icon: FolderLock, campusOnly: true },
  { path: "/dashboard/drives", label: "Campus Placement Drives", icon: BriefcaseBusiness, campusOnly: true },
  { path: "/dashboard/resume", label: "Resume Intelligence", icon: FileText },
  { path: "/dashboard/builder", label: "Resume Studio", icon: PenTool },
  { path: "/dashboard/job-fit", label: "Job Fit Analysis", icon: Target },
  { path: "/dashboard/linkedin", label: "LinkedIn Analyzer", icon: Linkedin },
  { path: "/dashboard/roadmap", label: "Skill Roadmap", icon: Route },
  { path: "/dashboard/interview", label: "Interview Prep", icon: Mic },
  { path: "/dashboard/promotion", label: "Promotion Readiness", icon: TrendingUp },
  { path: "/dashboard/portfolio", label: "Portfolio Analyzer", icon: FolderOpen },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ mobileOpen, setMobileOpen }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin, user, tenant } = useAuth();

  const isCampusUser = Boolean(
    ((tenant?.tenantId && tenant?.role === "student") ||
    user?.email?.endsWith(".ac.in") ||
    user?.email?.endsWith(".edu.in")) &&
    tenant?.role !== "platform_admin"
  );

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.campusOnly) {
        return isCampusUser;
      }
      return true;
    });
  }, [isCampusUser]);

  const initials = useMemo(() => {
    const source = user?.displayName || user?.email || "A";
    return source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user?.displayName, user?.email]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const itemBase =
    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#112031]/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F7FBFB_100%)] shadow-[0_24px_64px_-46px_rgba(17,32,49,0.28)] transition-transform duration-300 md:sticky ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        animate={{ width: collapsed ? 88 : 286 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between border-b border-[#E8EDEE] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[#E5E8EC] bg-white p-2 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.22)]">
              <AiviLogo size={24} className="text-[#D59C45]" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="font-display text-xl font-bold leading-none tracking-tight text-[#0F172A]">AIVI</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#475569] font-bold">Career Intelligence OS</div>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 text-[#475569] transition-colors hover:bg-white/90 hover:text-[#0F172A] md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[#E8EDEE] px-4 py-3">
          <div
            className={`rounded-[1.6rem] border border-[#E4ECEA] bg-white/90 shadow-[0_16px_42px_-28px_rgba(17,32,49,0.16)] ${
              collapsed ? "px-3 py-3" : "px-4 py-3"
            }`}
          >
            <div className={`flex ${collapsed ? "justify-center" : "items-center gap-3"}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-sm font-semibold text-white">
                {initials || "A"}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#0F172A]">{user?.displayName || "Career Builder"}</p>
                  <p className="truncate text-xs font-semibold text-[#475569]">{user?.email || "Signed in"}</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-[#F5FBFA] px-3 py-1.5">
                <div className="flex items-center gap-2 text-[#0D9488]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Workspace</span>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6D4A] shadow-xs">
                  Beta
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`${itemBase} ${
                    isActive
                      ? "bg-[linear-gradient(90deg,#FFF4EF_0%,#F3FBFA_100%)] text-[#0F172A] font-bold shadow-[0_14px_34px_-24px_rgba(17,32,49,0.14)] border border-[#E2E8F0]"
                      : "text-[#1E293B] font-semibold hover:bg-white hover:text-[#0F172A] hover:shadow-xs"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#FF6D4A_0%,#25C3B5_100%)]"
                      transition={{ duration: 0.25 }}
                    />
                  )}

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                      isActive ? "bg-white text-[#FF6D4A] shadow-xs" : "bg-[#F1F5F9] text-[#334155] group-hover:bg-[#EFFBFA] group-hover:text-[#0D9488]"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </div>

                  {!collapsed && (
                    <div className="min-w-0">
                      <span className={`block truncate text-sm ${isActive ? "font-bold text-[#0F172A]" : "font-semibold text-[#1E293B] group-hover:text-[#0F172A]"}`}>{item.label}</span>
                      {isActive && (
                        <span className="mt-0.5 block text-xs font-semibold text-[#475569]">
                          {item.path === "/dashboard"
                            ? "Your career command center"
                            : item.label === "Resume Studio"
                              ? "Build and tailor faster"
                              : "Open module"}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
            {isAdmin && (
              <NavLink
                to="/dashboard/admin"
                onClick={() => setMobileOpen(false)}
                className={`${itemBase} ${
                  location.pathname === "/dashboard/admin"
                    ? "bg-[linear-gradient(90deg,#FFF4EF_0%,#F3FBFA_100%)] text-[#0F172A] font-bold border border-[#E2E8F0]"
                    : "text-[#1E293B] font-semibold hover:bg-white hover:text-[#0F172A]"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#334155]">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                {!collapsed && <span className="text-sm font-semibold text-[#1E293B]">Admin Panel</span>}
              </NavLink>
            )}

            {(tenant.role === "tenant_admin" || tenant.role === "coordinator" || tenant.role === "platform_admin") && (
              <NavLink
                to="/campus/students"
                onClick={() => setMobileOpen(false)}
                className={`${itemBase} ${
                  location.pathname.startsWith("/campus")
                    ? "bg-[linear-gradient(90deg,#FFF4EF_0%,#F3FBFA_100%)] text-[#0F172A] font-bold border border-[#E2E8F0]"
                    : "text-[#1E293B] font-semibold hover:bg-white hover:text-[#0F172A]"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#334155]">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                {!collapsed && <span className="text-sm font-semibold text-[#1E293B]">Campus Students</span>}
              </NavLink>
            )}

            <NavLink
              to="/dashboard/settings"
              onClick={() => setMobileOpen(false)}
              className={`${itemBase} text-[#1E293B] font-semibold hover:bg-white hover:text-[#0F172A]`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#334155]">
                <Settings className="h-4.5 w-4.5" />
              </div>
              {!collapsed && <span className="text-sm font-semibold text-[#1E293B]">Settings</span>}
            </NavLink>

            <button
              onClick={handleSignOut}
              className={`${itemBase} w-full text-[#1E293B] font-semibold hover:bg-white hover:text-[#0F172A]`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#334155]">
                <LogOut className="h-4.5 w-4.5" />
              </div>
              {!collapsed && <span className="text-sm font-semibold text-[#1E293B]">Sign Out</span>}
            </button>
          </nav>

          {!collapsed && (
            <div className="mt-3 hidden rounded-[1.4rem] bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] p-3.5 text-white shadow-[0_26px_60px_-34px_rgba(17,49,59,0.54)] xl:block">
              <div className="flex items-center gap-2 text-[#A5CCD0]">
                <BriefcaseBusiness className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Next move</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold leading-6">Run Job Fit after each resume revision to keep your score moving.</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 hidden rounded-full border border-[#E3E8EC] bg-white p-1.5 shadow-[0_12px_30px_-18px_rgba(17,32,49,0.22)] transition-colors hover:bg-[#FBFCFC] md:flex"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5 text-[#55626D]" /> : <ChevronLeft className="h-3.5 w-3.5 text-[#55626D]" />}
        </button>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
