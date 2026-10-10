import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CampusLogo from "@/components/CampusLogo";

const NAV = [
  { id: "features", label: "Platform" },
  { id: "evidence", label: "Command Center" },
  { id: "voice", label: "Voice AI" },
  { id: "audit", label: "Free Audit" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
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
          ? "border-b border-white/[0.08] bg-[#0F1720]/90 shadow-[0_14px_40px_-16px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          : "border-b border-white/[0.05] bg-[#0F1720]/75 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1220px] items-center justify-between px-5 lg:px-8">
        {/* Transparent Seamless Official AIVI Campus Logo */}
        <Link to="/" onClick={() => handleScrollNav("top")} className="flex items-center transition-transform hover:scale-[1.02]">
          <CampusLogo className="h-14 sm:h-16 w-[190px] sm:w-[230px]" imgClassName="h-12 sm:h-14 w-full" />
        </Link>

        {/* Crisp White Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScrollNav(item.id)}
              className="group relative rounded-xl px-3.5 py-2 text-[13.5px] font-semibold text-slate-300 transition-colors duration-300 hover:text-white"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-x-3 bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-[hsl(176_52%_55%)] to-[hsl(177_51%_40%)] shadow-[0_0_8px_hsl(176_52%_55%/0.8)] transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to={user ? dashboardPath : "/campus/login"}
            className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[13px] font-bold text-slate-200 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
          >
            {user ? "Open Campus OS" : "Sign In"}
          </Link>
          <Button
            onClick={() => handleScrollNav("demo")}
            className="h-10 rounded-full bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_30%))] px-5 text-[13px] font-bold text-white shadow-[0_8px_24px_-6px_hsl(177_51%_42%/0.75),inset_0_1px_0_hsl(0_0%_100%/0.35)] hover:brightness-110"
          >
            Book a Demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white shadow-sm transition hover:bg-white/[0.1] lg:hidden"
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
            className="border-t border-white/[0.08] bg-[#0F1720]/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-1 px-5 py-5">
              {NAV.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.035 * i, duration: 0.28 }}
                  onClick={() => handleScrollNav(item.id)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-bold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-[hsl(176_52%_50%)]" />
                </motion.button>
              ))}
              <div className="grid gap-2.5 pt-4">
                <Button
                  onClick={() => handleScrollNav("demo")}
                  className="h-12 w-full rounded-xl bg-[linear-gradient(180deg,hsl(176_52%_46%),hsl(178_58%_30%))] text-[15px] font-bold text-white shadow-glow"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" /> Book a 20-minute demo
                </Button>
                <Link to={user ? dashboardPath : "/campus/login"}>
                  <Button variant="outline" className="h-12 w-full rounded-xl border-white/15 bg-white/[0.04] text-[15px] font-bold text-white hover:bg-white/[0.1]">
                    {user ? "Open Campus OS" : "Sign In"}
                  </Button>
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
