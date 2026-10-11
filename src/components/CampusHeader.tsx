import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CampusLogo from "@/components/CampusLogo";

/* Figma: screen-landing-page HEADER — Home / Platform / Command Center / Voice AI */
const NAV = [
  { id: "top", label: "Home" },
  { id: "features", label: "Platform" },
  { id: "evidence", label: "Command Center" },
  { id: "voice", label: "Voice AI" },
];

export default function CampusHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, tenant } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollNav = (elementId: string) => {
    setMobileOpen(false);
    if (elementId === "top") {
      if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
      else navigate("/");
      return;
    }
    const el = document.getElementById(elementId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    navigate("/");
    setTimeout(() => {
      const target = document.getElementById(elementId);
      if (target) {
        const y = target.getBoundingClientRect().top + window.pageYOffset - 78;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 180);
  };

  const userEmail = (user?.email || "").toLowerCase();
  const isPlatformAdmin =
    userEmail === "abhi.triloki@gmail.com" ||
    userEmail === "abhitriloki@gmail.com" ||
    tenant.role === "platform_admin";
  const isStudent =
    tenant.role === "student" ||
    userEmail.includes("student") ||
    userEmail.includes("aarav");
  const dashboardPath = !user
    ? "/campus/login"
    : isPlatformAdmin
    ? "/platform-admin"
    : isStudent
    ? "/campus/student-drives"
    : "/campus";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[9999] flex h-7 items-center justify-center bg-cyan-500 px-3 text-center text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md">
        ⚠️ TEST MIRROR — CAMPUS OS STAGING (aivi-campus-stg) — NO PRODUCTION DATA
      </div>
      <header
        className={`fixed inset-x-0 top-7 z-[80] transition-all duration-500 ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/90 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            : "border-b border-slate-200/60 bg-white/80 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex h-[75px] max-w-[1220px] items-center justify-between px-5 lg:px-8">
          <Link
            to="/"
            onClick={() => handleScrollNav("top")}
            className="flex items-center transition-transform hover:scale-[1.02]"
          >
            <CampusLogo className="h-14 w-[190px] sm:h-16 sm:w-[230px]" imgClassName="h-12 w-full sm:h-14" />
          </Link>

          {/* Figma: 16px/500 #0f172a nav items */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollNav(item.id)}
                className="rounded-lg px-3.5 py-2 text-[16px] font-medium text-[#0f172a] transition-colors duration-200 hover:text-[#2176ff]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Figma: TPO & Student Login (blue outline) + Book a Demo (gradient) */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to={user ? dashboardPath : "/campus/login"}
              className="rounded-md border border-[#2176ff]/50 bg-white px-4 py-2 text-[12px] font-medium text-[#2176ff] transition hover:border-[#2176ff] hover:bg-[#2176ff]/5"
            >
              {user ? "Open Campus OS" : "TPO & Student Login"}
            </Link>
            <button
              onClick={() => handleScrollNav("demo")}
              className="flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,#6231d7,#2176ff)] px-5 py-2.5 text-[12px] font-medium text-[#f8fafc] shadow-[0_8px_20px_-8px_rgba(33,118,255,0.65)] transition hover:brightness-110"
            >
              Book a Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#0f172a] shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-1 px-5 py-5">
                {NAV.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.035 * i, duration: 0.28 }}
                    onClick={() => handleScrollNav(item.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#0f172a] transition hover:bg-slate-100"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-[#2176ff]" />
                  </motion.button>
                ))}
                <div className="grid gap-2.5 pt-4">
                  <button
                    onClick={() => handleScrollNav("demo")}
                    className="h-12 w-full rounded-md bg-[linear-gradient(135deg,#6231d7,#2176ff)] text-[15px] font-medium text-white"
                  >
                    Book a Demo
                  </button>
                  <Link to={user ? dashboardPath : "/campus/login"}>
                    <span className="flex h-12 w-full items-center justify-center rounded-md border border-[#2176ff]/50 text-[15px] font-medium text-[#2176ff]">
                      {user ? "Open Campus OS" : "TPO & Student Login"}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
