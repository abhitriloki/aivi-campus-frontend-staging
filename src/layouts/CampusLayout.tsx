import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { RBACMatrix } from "@/config/rbac";
import CampusLogo from "@/components/CampusLogo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DpdpConsentModal from "@/components/DpdpConsentModal";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Zap,
  FolderLock,
  Mic2,
  Award,
  CreditCard,
  UserCheck,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Building2,
  CalendarDays,
  Search,
  Bell,
  Command,
  ChevronsUpDown,
  ChevronRight,
  Sparkles,
  CircleCheck,
  TriangleAlert,
  FileWarning,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  Fingerprint,
  User,
} from "lucide-react";

/* ---------------------------------- Nav model ---------------------------------- */

interface NavItem {
  path: string;
  label: string;
  hint: string;
  icon: typeof LayoutDashboard;
}

const ALL_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Command",
    items: [
      { path: "/campus", label: "Command Center", hint: "Live campus overview", icon: LayoutDashboard },
      { path: "/campus/group-overview", label: "Group Portfolio", hint: "Multi-campus rollup", icon: Building2 },
    ],
  },
  {
    section: "Readiness",
    items: [
      { path: "/campus/students", label: "Students Roster", hint: "AES · branch · batch", icon: Users },
      { path: "/campus/drives", label: "Placement Drives", hint: "Pipeline & shortlists", icon: Briefcase },
      { path: "/campus/sprints", label: "Sprints & Campaigns", hint: "7-day prep loops", icon: Zap },
      { path: "/campus/vault", label: "Resume Vault", hint: "Verified QR resumes", icon: FolderLock },
    ],
  },
  {
    section: "AI & Proof",
    items: [
      { path: "/campus/interviews", label: "AI Interview Lab", hint: "Voice mock analytics", icon: Mic2 },
      { path: "/campus/accreditation", label: "NAAC / NIRF Evidence", hint: "One-click report packs", icon: Award },
      { path: "/campus/calendar", label: "Placement Calendar", hint: "Drives · PPTs · deadlines", icon: CalendarDays },
    ],
  },
  {
    section: "Operations",
    items: [
      { path: "/campus/billing", label: "Billing & Seats", hint: "License & invoices", icon: CreditCard },
      { path: "/campus/staff", label: "Staff & Roles", hint: "Permissions matrix", icon: UserCheck },
      { path: "/campus/audit-logs", label: "Audit & DPDP Logs", hint: "Privacy trail", icon: Fingerprint },
      { path: "/campus/settings", label: "Tenant Settings", hint: "Branding · SSO", icon: Settings },
    ],
  },
];

const STUDENT_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Institutional Placement Hub",
    items: [
      { path: "/campus/profile", label: "My Profile", hint: "Academic & placement dossier", icon: User },
      { path: "/campus/student-drives", label: "My Placement Drives", hint: "Eligible drives & JD match", icon: Briefcase },
      { path: "/campus/sprints", label: "7-Day Sprints", hint: "Placement readiness loops", icon: Zap },
      { path: "/campus/student-vault", label: "My Verified Resume", hint: "College QR-sealed vault", icon: FolderLock },
    ],
  },
  {
    section: "AI Career Intelligence Suite",
    items: [
      { path: "/campus/resume-intelligence", label: "Resume Intelligence", hint: "ATS score & AI audit", icon: Award },
      { path: "/campus/resume-studio", label: "Resume Studio", hint: "AI resume builder & editor", icon: Sparkles },
      { path: "/campus/job-fit", label: "Job Fit Analysis", hint: "JD match & keyword gaps", icon: LayoutDashboard },
      { path: "/campus/interviews", label: "AI Interview Lab", hint: "2-way vernacular voice mock", icon: Mic2 },
      { path: "/campus/skill-roadmap", label: "Skill Roadmap", hint: "Personalized 30-day plan", icon: CalendarDays },
      { path: "/campus/linkedin-analyzer", label: "LinkedIn Optimizer", hint: "Recruiter profile audit", icon: Users },
    ],
  },
];

const NOTIFICATIONS = [
  { id: 1, kind: "alert", icon: TriangleAlert, tint: "text-amber-600 bg-amber-500/10 border-amber-500/20", title: "18 at-risk students flagged", body: "AES < 40 · Resume & mock-interview nudges queued for CSE · ECE.", time: "2m ago" },
  { id: 2, kind: "drive", icon: Briefcase, tint: "text-primary bg-primary/10 border-primary/20", title: "Tata Elxsi drive — shortlist ready", body: "61 of 124 applicants cleared JD filters. Review by 6 PM.", time: "18m ago" },
  { id: 3, kind: "vault", icon: CircleCheck, tint: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", title: "28 resumes verified & QR-sealed", body: "Vault package v3 is ready for the campus drive export.", time: "1h ago" },
  { id: 4, kind: "report", icon: FileWarning, tint: "text-rose-600 bg-rose-500/10 border-rose-500/20", title: "NAAC Criterion 5.2.1 — draft ready", body: "Evidence pack compiled. Review before downloading.", time: "Yesterday" },
] as const;

const ONBOARDING_NOTIFICATIONS = [
  { id: 1, kind: "onboard", icon: TriangleAlert, tint: "text-primary bg-primary/10 border-primary/20", title: "Import your first students", body: "Go to Students → Import CSV to onboard your student roster.", time: "Now" },
  { id: 2, kind: "onboard", icon: Briefcase, tint: "text-sky-600 bg-sky-500/10 border-sky-500/20", title: "Create your first placement drive", body: "Once students are onboarded, create a drive to start shortlisting.", time: "" },
] as const;

const STUDENT_NOTIFICATIONS = [
  { id: 1, kind: "drive", icon: Briefcase, tint: "text-primary bg-primary/10 border-primary/20", title: "Campus drives active", body: "Review eligible recruiter drives and verify your JD match in My Placement Drives.", time: "Now" },
  { id: 2, kind: "sprint", icon: Zap, tint: "text-amber-600 bg-amber-500/10 border-amber-500/20", title: "AI Placement Sprint assigned", body: "Complete your 7-day interview drills and aptitude benchmarks.", time: "Today" },
  { id: 3, kind: "vault", icon: CircleCheck, tint: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", title: "Verified Resume Vault", body: "Ensure your resume has the college verification QR seal before the drive.", time: "1d ago" },
] as const;

const sectionIcon = (path: string) => [...ALL_NAV, ...STUDENT_NAV].find((s) => s.items.some((i) => i.path === path));

export default function CampusLayout() {
  const { user, tenant, signOut } = useAuth();
  const { branding, supportModeActive, allTenants, setSupportTenantId, activeTenantId } = useTenantBranding();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const isPlatformAdmin = tenant.role === "platform_admin";
  // On aivicampus.com production, never show the demo environment banner regardless of tenantId
  const isProductionDomain = typeof window !== "undefined" && (
    window.location.hostname === "aivicampus.com" ||
    window.location.hostname === "www.aivicampus.com" ||
    window.location.hostname === "staging.aivicampus.com"
  );
  // isDemo is ONLY true for the Sunrise demo environment AND not on production aivicampus.com
  const isDemo =
    !isProductionDomain && (
      tenant.tenantId === "demo-sunrise" ||
      activeTenantId === "demo-sunrise" ||
      tenant.tenantId === "demo-campus-001" ||
      (!tenant.tenantId && !activeTenantId)
    );
  const userRole = RBACMatrix.normalizeRole(tenant.role);
  const isStaff = Boolean(
    userRole === "tenant_admin" ||
    userRole === "tpo" ||
    userRole === "placement_director" ||
    userRole === "coordinator" ||
    userRole === "admin" ||
    userRole === "platform_admin"
  );
  const isStudent = !isStaff;

  const [customNotifications, setCustomNotifications] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadDynamicNotifications = async () => {
      if (!user) return;
      const tenantId = tenant.tenantId || activeTenantId;
      if (!tenantId || tenantId === "demo-sunrise" || tenantId.startsWith("demo-")) return;

      const fetched: any[] = [];
      try {
        const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        if (db) {
          const q = query(
            collection(db, "notifications"),
            where("tenantId", "==", tenantId),
            limit(10)
          );
          const snap = await getDocs(q);
          snap.docs.forEach((d) => {
            const data = d.data();
            fetched.push({
              id: d.id,
              kind: data.kind || "drive",
              title: data.title || "Campus Placement Notification",
              body: data.body || "",
              time: data.time || "Recent",
              icon: Briefcase,
              tint: "text-primary bg-primary/10 border-primary/20",
            });
          });
        }
      } catch (err) {
        // Silently skip if tenant notifications are restricted or unindexed
      }

      // Check local storage queue for newly published drives in demo
      try {
        const raw = localStorage.getItem(`aivi_demo_notifications_${tenantId}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((p) => {
              if (!fetched.some((f) => f.id === p.id)) {
                fetched.push({
                  id: p.id,
                  kind: p.kind || "drive",
                  title: p.title || "Campus Placement Notification",
                  body: p.body || "",
                  time: p.time || "Recent",
                  icon: Briefcase,
                  tint: "text-primary bg-primary/10 border-primary/20",
                });
              }
            });
          }
        }
      } catch {}

      if (isMounted && fetched.length > 0) {
        setCustomNotifications(fetched);
      }
    };

    loadDynamicNotifications();
    return () => {
      isMounted = false;
    };
  }, [tenant.tenantId, activeTenantId]);

  const baseNotifications = isStudent
    ? STUDENT_NOTIFICATIONS
    : isDemo
      ? NOTIFICATIONS
      : ONBOARDING_NOTIFICATIONS;

  const liveNotifications = useMemo(() => {
    if (customNotifications.length > 0) {
      return [...customNotifications, ...baseNotifications];
    }
    return baseNotifications;
  }, [customNotifications, baseNotifications]);

  const [studentProfile, setStudentProfile] = useState<any>(null);

  const finalNotifications = useMemo(() => {
    let list = liveNotifications;
    if (isStudent) {
      list = liveNotifications.filter((n) => {
        const isAmazon = (n.title?.toLowerCase().includes("amazon") || n.body?.toLowerCase().includes("amazon"));
        const candCgpa = typeof studentProfile?.cgpa === "number" ? studentProfile.cgpa : parseFloat(studentProfile?.cgpa) || 7.2;
        if (isAmazon && candCgpa < 8.0) {
          return false;
        }
        const cgpaMatch = n.body?.match(/cgpa\s*[≥>=]\s*([\d.]+)/i) || n.title?.match(/cgpa\s*[≥>=]\s*([\d.]+)/i);
        if (cgpaMatch) {
          const requiredCgpa = parseFloat(cgpaMatch[1]);
          if (candCgpa < requiredCgpa) {
            return false;
          }
        }
        return true;
      });

      if (!list.some((n) => n.title?.toLowerCase().includes("tcs"))) {
        list = [
          {
            id: "tcs_eligible_notif",
            kind: "drive",
            icon: Briefcase,
            tint: "text-primary bg-primary/10 border-primary/20",
            title: "New Placement Drive: TCS Digital",
            body: "Systems Engineer & Full Stack Developer · Package: 7.5 LPA. You are eligible!",
            time: "Active",
          },
          ...list,
        ];
      }
    }
    return list;
  }, [liveNotifications, isStudent, studentProfile]);

  const [dpdpOpen, setDpdpOpen] = useState(false);

  // If user is a student belonging to an institution, check if DPDP consent has been recorded
  useEffect(() => {
    if (user && tenant.tenantId && userRole === "student") {
      import("firebase/firestore").then(async ({ doc, getDoc }) => {
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        const profileSnap = await getDoc(doc(db, "profiles", user.uid));
        if (profileSnap.exists()) {
          setStudentProfile(profileSnap.data());
          if (!profileSnap.data()?.dpdpConsent) {
            setDpdpOpen(true);
          }
        } else {
          setDpdpOpen(true);
        }
      }).catch((err) => {
        console.warn("DPDP profile check:", err);
      });
    }
  }, [user, tenant.tenantId, userRole]);

  useEffect(() => {
    const handleOpenDpdp = () => setDpdpOpen(true);
    window.addEventListener("open-dpdp-modal", handleOpenDpdp);
    return () => window.removeEventListener("open-dpdp-modal", handleOpenDpdp);
  }, []);

  // Auto-redirect student from root /campus to /campus/student-drives
  useEffect(() => {
    if (userRole === "student" && (location.pathname === "/campus" || location.pathname === "/campus/")) {
      navigate("/campus/student-drives", { replace: true });
    }
  }, [userRole, location.pathname, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    setCommandOpen(false);
  }, [location.pathname]);
  const nav = useMemo(() => {
    if (userRole === "student") {
      return STUDENT_NAV;
    }
    return ALL_NAV.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (isPlatformAdmin) return true;
        return RBACMatrix.isRouteAllowed(userRole, item.path);
      }),
    })).filter((section) => section.items.length > 0);
  }, [userRole, isPlatformAdmin]);

  const flatNav = useMemo(() => nav.flatMap((s) => s.items), [nav]);

  /* Keyboard shortcut + ESC + outside-click close for the command palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" || e.key === "Esc" || e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        commandInputRef.current?.blur();
        setCommandOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!commandOpen) return;
      const target = e.target as Node;
      if (commandRef.current && !commandRef.current.contains(target)) {
        commandInputRef.current?.blur();
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [commandOpen]);

  useEffect(() => {
    if (commandOpen) {
      setCommandQuery("");
      setSelectedIndex(0);
      setTimeout(() => commandInputRef.current?.focus(), 60);
      // lock scroll while the palette is open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [commandOpen]);


  const initials = (user?.displayName || user?.email || "AIVI")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const currentSection = sectionIcon(location.pathname);
  const activeLabel =
    currentSection?.items.find((i) => (i.path === "/campus" ? location.pathname === "/campus" : location.pathname.startsWith(i.path)))?.label ??
    (location.pathname.startsWith("/campus/login") ? "Branded Login" : "Command Center");

  const go = (path: string) => {
    commandInputRef.current?.blur();
    setCommandOpen(false);
    setMobileOpen(false);
    setCommandQuery("");
    if (path.startsWith("http://") || path.startsWith("https://") || path === "/" || path === "/for-colleges") {
      window.open(path.startsWith("http") ? path : window.location.origin + path, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(path);
  };

  /* ------------------------------ Sidebar content ------------------------------ */

  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Brand — official AIVI Campus wordmark (production logo) */}
      <div className={`flex items-center gap-2.5 px-4 pt-5 pb-4 ${mobile ? "pr-12" : ""} ${collapsed && !mobile ? "justify-center px-0" : ""}`}>
        {collapsed && !mobile ? (
          <CampusLogo className="h-10 w-10" imgClassName="h-8 w-full" />
        ) : (
          <CampusLogo className="h-12 w-[180px] shrink-0" imgClassName="h-10 w-full" />
        )}
      </div>

      {/* Institution strip */}
      {!collapsed || mobile ? (
        <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-2">
          {branding?.branding?.logoUrl ? (
            <img src={branding.branding.logoUrl} alt={branding.name} className="h-4 w-4 object-contain rounded" />
          ) : (
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[#4DC7BE]" />
          )}
          <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-300">
            {branding?.name || "AIVI Campus"}
          </p>

          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        </div>
      ) : null}

      {/* Nav */}
      <nav
        className="flex-1 space-y-2.5 overflow-y-auto px-2.5 py-2 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {nav.map((section) => (
          <div key={section.section}>
            {!collapsed || mobile ? (
              <p className="px-2 pb-1 text-[9.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {section.section}
              </p>
            ) : (
              <div className="mx-auto mb-1 h-px w-6 bg-white/10" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.path === "/campus"
                    ? location.pathname === "/campus"
                    : location.pathname.startsWith(item.path);
                return (
                  <NavLink key={item.path} to={item.path} title={item.label} className="group relative block rounded-xl">
                    <span
                      className={`relative flex items-center gap-2.5 rounded-xl px-2.5 py-[6.5px] text-[12.5px] font-semibold transition-all duration-200 ${
                        collapsed && !mobile ? "justify-center px-0" : ""
                      } ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-slate-100"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={mobile ? "mnav" : "snav"}
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-xl border border-[hsl(176_52%_52%/0.35)] bg-[linear-gradient(120deg,hsl(178_58%_30%/0.5),hsl(178_58%_24%/0.22))] shadow-[0_0_22px_-6px_hsl(176_52%_46%/0.7),inset_0_1px_0_hsl(0_0%_100%/0.12)]"
                        />
                      )}
                      <item.icon
                        className={`relative z-10 h-4 w-4 shrink-0 transition-colors duration-200 ${
                          isActive ? "text-[#4DC7BE] drop-shadow-[0_0_6px_hsl(176_52%_60%/0.8)]" : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      />
                      {(!collapsed || mobile) && <span className="relative z-10 truncate">{item.label}</span>}
                      {(!collapsed || mobile) && isActive && (
                        <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-[#4DC7BE] shadow-[0_0_8px_hsl(176_52%_65%/0.9)]" />
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 p-3">
        <div className={`flex items-center gap-2.5 ${!collapsed || mobile ? "" : "flex-col"}`}>
          <div className="relative min-w-0 flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.08]">
                  <Avatar className="h-8 w-8 border border-white/15">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback className="bg-[linear-gradient(135deg,#1C6B68,#143E3B)] text-[11px] font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {(!collapsed || mobile) && (
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-100">
                        {user?.displayName || "Guest User"}
                      </span>
                      <span className="block truncate text-[10px] font-medium capitalize text-slate-500">
                        {tenant.role.replace("_", " ")}
                      </span>
                    </span>
                  )}
                  {(!collapsed || mobile) && <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  Signed in as {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/campus/profile")} className="text-[13px] font-semibold">
                  <User className="h-4 w-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut().then(() => navigate("/"))} className="text-[13px] font-semibold text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden md:grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white ${collapsed ? "" : ""}`}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );

  /* ------------------------------ Render ---------------------------------------- */

  const showStagingBanner =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("staging") ||
      window.location.hostname.includes("isolation"));

  const handleNotificationClick = (n: any) => {
    setNotificationsOpen(false);
    if (n.targetPath) {
      navigate(n.targetPath);
      return;
    }
    if (isStaff) {
      if (n.kind === "drive") navigate("/campus/drives");
      else if (n.kind === "vault") navigate("/campus/vault");
      else if (n.kind === "sprint") navigate("/campus/sprints");
      else if (n.kind === "alert") navigate("/campus/students");
      else if (n.kind === "report") navigate("/campus/accreditation");
      else if (n.kind === "onboard") {
        if (n.title.toLowerCase().includes("import")) navigate("/campus/students/import");
        else navigate("/campus/drives");
      } else {
        navigate("/campus/drives");
      }
    } else {
      if (n.kind === "drive") navigate("/campus/student-drives");
      else if (n.kind === "vault") navigate("/campus/student-vault");
      else if (n.kind === "sprint") navigate("/campus/sprints");
      else navigate("/campus/student-drives");
    }
  };

  return (
    <div className="campus-theme min-h-screen bg-[#F5F0E8] text-[#101820]">
      {/* Test mirror warning banner */}
      {showStagingBanner && (
        <div className="sticky top-0 z-[100] flex h-7 items-center justify-center bg-cyan-500 px-3 text-center text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-sm">
          ⚠️ TEST MIRROR — CAMPUS OS STAGING (aivi-campus-stg) — NO PRODUCTION DATA
        </div>
      )}

      {/* Support mode banner */}
      <AnimatePresence>
        {supportModeActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-[70] overflow-hidden border-b border-amber-500/30 bg-[linear-gradient(90deg,#5B3E0A,#7A520C)] px-4 text-amber-100"
          >
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 py-2 text-[12px] font-semibold">
              <span className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Support Mode — viewing “{branding.name}” read-only. Writes are disabled.
              </span>
              <button
                onClick={() => {
                  setSupportTenantId(null);
                  toast.info("Exited Support Mode. Returned to Platform Admin Master Console.");
                  navigate("/campus/platform-admin");
                }}
                className="rounded-lg bg-amber-950/50 px-2.5 py-1 text-[11px] font-bold text-amber-100 transition hover:bg-amber-950/80 cursor-pointer"
              >
                Exit support mode ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex min-h-screen">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_88%_-6%,hsl(176_52%_86%/0.6),transparent_60%),radial-gradient(760px_420px_at_-6%_28%,hsl(42_60%_90%/0.8),transparent_55%)]" />
          <div className="bg-grid absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        {/* ================= Desktop sidebar ================= */}
        <aside
          className={`sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-white/[0.06] transition-[width] duration-300 lg:flex ${
            collapsed ? "w-[84px]" : "w-[262px]"
          }`}
          style={{
            background:
              "linear-gradient(180deg, #101820 0%, #0F1720 42%, #101820 100%)",
            boxShadow: "8px 0 40px -22px hsl(210 33% 5% / 0.7)",
          }}
        >
          {/* ambient teal glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,hsl(177_51%_36%/0.32),transparent_70%)] blur-2xl" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom,hsl(178_58%_28%/0.16),transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.045)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.045)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col">
            <SidebarBody />
          </div>
        </aside>

        {/* ================= Main column ================= */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-50 border-b border-[hsl(38_16%_84%/0.75)] bg-[hsl(42_33%_97%/0.82)] backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
              {/* Mobile brand */}
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-slate-700 lg:hidden"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>

              {/* Title + context */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span className="hidden sm:inline">{branding.name}</span>
                  <ChevronRight className="hidden h-3 w-3 sm:inline" />
                  <span className="text-primary">{currentSection?.section ?? "Workspace"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-[17px] font-bold tracking-[-0.01em] text-slate-900">{activeLabel}</h1>
                  <span className="hidden items-center gap-1 rounded-md border border-[hsl(177_51%_31%/0.25)] bg-[hsl(177_51%_31%/0.07)] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-primary md:inline-flex">
                    <span className="h-1 w-1 animate-pulse-soft rounded-full bg-primary" />
                    AY {tenant.tenant?.academicYear || "2025-26"}
                  </span>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                {isPlatformAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hidden h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary sm:flex">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span className="max-w-[130px] truncate">{branding.name}</span>
                        <ChevronsUpDown className="h-3 w-3 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Institutions (AIVI managed)</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allTenants.map((t) => (
                        <DropdownMenuItem key={t.id} onClick={() => setSupportTenantId(t.id === "demo-sunrise" ? null : t.id)}>
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-[13px] font-semibold">{t.name}</span>
                            {t.id === activeTenantId && <CircleCheck className="h-4 w-4 shrink-0 text-primary" />}
                          </span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/platform-admin")} className="text-[13px] font-semibold text-emerald-600">
                        <Shield className="h-4 w-4" /> Open Master Console
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* ⌘K search */}
                <button
                  onClick={() => setCommandOpen(true)}
                  className="group hidden h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-[13px] font-medium text-slate-500 transition hover:border-primary/35 hover:text-slate-700 md:flex"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary" />
                  <span>Search…</span>
                  <kbd className="ml-3 flex items-center gap-0.5 rounded-md border border-border bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                    ⌘K
                  </kbd>
                </button>

                {/* Notifications */}
                <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <PopoverTrigger asChild>
                    <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-slate-600 transition hover:border-primary/40 hover:text-primary">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#E2543E] text-[8.5px] font-bold text-white shadow-[0_0_0_2px_hsl(37_35%_96%)]">
                        {finalNotifications.length}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[360px] p-0" sideOffset={10}>
                    <div className="flex items-center justify-between border-b px-4 py-3">
                      <p className="text-sm font-bold text-slate-900">Notifications</p>
                      <Badge variant="soft">Live</Badge>
                    </div>
                    <div className="max-h-[340px] space-y-1 overflow-y-auto p-2">
                      {finalNotifications.map((n) => (
                        <div
                          key={n.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleNotificationClick(n)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleNotificationClick(n);
                            }
                          }}
                          className="flex cursor-pointer gap-3 rounded-xl p-2.5 transition hover:bg-slate-100/90 active:scale-[0.99] focus:outline-none focus:ring-1 focus:ring-primary/40"
                        >
                          <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${n.tint}`}>
                            <n.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold leading-snug text-slate-900">{n.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{n.body}</p>
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-slate-500 hover:text-slate-800"
                        onClick={() => {
                          setNotificationsOpen(false);
                          if (isStaff) {
                            navigate("/campus/audit-logs");
                          } else {
                            navigate("/campus/student-drives");
                          }
                        }}
                      >
                        View activity log →
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Mobile search */}
                <button
                  onClick={() => setCommandOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-slate-600 md:hidden"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Sample data strip */}
          {isDemo && (
            <div className="relative z-10 flex items-center gap-2 overflow-hidden border-b border-[hsl(177_51%_31%/0.16)] bg-[linear-gradient(90deg,hsl(178_58%_26%/0.07),hsl(42_70%_52%/0.08),hsl(178_58%_26%/0.07))] px-4 py-1.5 sm:px-6">
              <Sparkles className="h-3 w-3 shrink-0 text-primary" />
              <p className="truncate text-[11px] font-bold tracking-wide text-slate-600">
                Sample data environment — {branding?.name || "AIVI Campus"} · {tenant.tenantId === "demo-sunrise" ? "2,400 enrolled" : "Institutional workspace active"}
              </p>
              <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-border sm:flex">
                <Shield className="h-3 w-3 text-primary" />
                DPDP aligned · India-hosted
              </span>
            </div>
          )}

          {/* Page content with route transition */}
          <main className="relative flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pt-7">
            <div className="mx-auto max-w-[1440px]">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 14, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* ================= Mobile drawer ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[80] bg-[#0F1720]/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 330, damping: 36 }}
              className="fixed inset-y-0 left-0 z-[85] flex w-[292px] flex-col border-r border-white/10 lg:hidden"
              style={{ background: "linear-gradient(180deg, #101820, #0F1720 55%, #101820)" }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 z-10 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex min-h-0 flex-1 flex-col">
                <SidebarBody mobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= ⌘K Command palette ================= */}
      <AnimatePresence>
        {commandOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                commandInputRef.current?.blur();
                setCommandOpen(false);
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                commandInputRef.current?.blur();
                setCommandOpen(false);
              }
            }}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0F1720]/55 p-4 pt-[12vh] backdrop-blur-[6px]"
          >
            <motion.div
              ref={commandRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search and navigate the campus OS"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-[min(620px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  ref={commandInputRef}
                  value={commandQuery}
                  onChange={(e) => {
                    setCommandQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      commandInputRef.current?.blur();
                      setCommandOpen(false);
                      return;
                    }
                    const q = commandQuery.trim().toLowerCase();
                    const navMatches = flatNav.filter((i) => !q || i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
                    const actions = [
                      { icon: Users, label: "Import students (CSV)", hint: "Bulk onboarding wizard", path: "/campus/import" },
                      { icon: Award, label: "Generate NAAC evidence pack", hint: "Criterion 5.2.1 · one click", path: "/campus/accreditation" },
                      { icon: LayoutDashboard, label: "Open platform marketing site", hint: "AIVI Campus OS Overview (opens in new tab)", path: "/" },
                      { icon: Mic2, label: "AI Interview Lab", hint: "Voice mock analytics", path: "/campus/interviews" },
                      { icon: Settings, label: "Tenant settings & SSO", hint: "Branding · roles", path: "/campus/settings" },
                    ].filter((a) => !q || a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
                    const totalItems = navMatches.length + actions.length;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSelectedIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSelectedIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      const combined = [...navMatches, ...actions];
                      if (combined[selectedIndex]) {
                        go(combined[selectedIndex].path);
                      }
                    }
                  }}
                  placeholder="Jump to a module, student batch, report…"
                  className="w-full bg-transparent py-4 text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  onClick={() => {
                    commandInputRef.current?.blur();
                    setCommandOpen(false);
                  }}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  title="Close (Esc)"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {(() => {
                const q = commandQuery.trim().toLowerCase();
                const navMatches = flatNav.filter((i) => !q || i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
                const actions = [
                  { icon: Users, label: "Import students (CSV)", hint: "Bulk onboarding wizard", path: "/campus/import" },
                  { icon: Award, label: "Generate NAAC evidence pack", hint: "Criterion 5.2.1 · one click", path: "/campus/accreditation" },
                  { icon: LayoutDashboard, label: "Open platform marketing site", hint: "AIVI Campus OS Overview (opens in new tab)", path: "/" },
                  { icon: Mic2, label: "AI Interview Lab", hint: "Voice mock analytics", path: "/campus/interviews" },
                  { icon: Settings, label: "Tenant settings & SSO", hint: "Branding · roles", path: "/campus/settings" },
                ].filter((a) => !q || a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));

                return (
                  <div className="max-h-[46vh] overflow-y-auto p-2">
                    {navMatches.length === 0 && actions.length === 0 ? (
                      <div className="px-3 py-10 text-center">
                        <Search className="mx-auto mb-3 h-8 w-8 text-slate-200" />
                        <p className="text-[13.5px] font-bold text-slate-700">No matches for “{commandQuery}”</p>
                        <p className="mt-1 text-xs text-slate-400">Try a module name like “vault” or “drives”.</p>
                      </div>
                    ) : (
                      <>
                        {navMatches.length > 0 && (
                          <>
                            <p className="px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Workspace
                            </p>
                            {navMatches.map((item, idx) => (
                              <CommandRow
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                hint={item.hint}
                                onPick={() => go(item.path)}
                                isCurrent={location.pathname === item.path || (item.path !== "/campus" && location.pathname.startsWith(item.path))}
                                isHighlighted={selectedIndex === idx}
                              />
                            ))}
                          </>
                        )}
                        {actions.length > 0 && (
                          <>
                            <p className="px-2 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Quick actions
                            </p>
                            {actions.map((a, aIdx) => (
                              <CommandRow
                                key={a.label}
                                icon={a.icon}
                                label={a.label}
                                hint={a.hint}
                                onPick={() => go(a.path)}
                                isHighlighted={selectedIndex === navMatches.length + aIdx}
                              />
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center gap-3 border-t border-border bg-slate-50/60 px-4 py-2 text-[10.5px] font-semibold text-slate-400">
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono">↵</kbd> open</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-card px-1 py-0.5 font-mono">esc</kbd> close</span>
                <span className="ml-auto flex items-center gap-1"><Command className="h-3 w-3" /> AI-powered campus OS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DPDP Act 2023 Student Data Privacy Consent Dialog */}
      <DpdpConsentModal open={dpdpOpen} onConsentAccepted={() => setDpdpOpen(false)} />
    </div>
  );
}

/* Small row used inside the command palette (keeps CMK dependency optional) */
function CommandRow({
  icon: Icon,
  label,
  hint,
  onPick,
  isCurrent,
  isHighlighted,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  hint?: string;
  onPick: () => void;
  isCurrent?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <button
      onClick={onPick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        isHighlighted
          ? "bg-[#2D8B86]/10 ring-1 ring-[#2D8B86]"
          : isCurrent
            ? "bg-accent/70"
            : "hover:bg-accent/50"
      }`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-primary shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-bold text-slate-900">{label}</span>
        {hint && <span className="block text-[11.5px] font-medium text-slate-500">{hint}</span>}
      </span>
      {isCurrent ? <Badge variant="soft">Here</Badge> : <ChevronRight className="h-4 w-4 text-slate-300" />}
    </button>
  );
}
