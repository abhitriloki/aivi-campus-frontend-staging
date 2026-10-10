import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AiviLogo from "./AiviLogo";
import { Menu, X, ChevronDown } from "lucide-react";
import PromoBanner from "./PromoBanner";

type NavLink = {
  label: string;
  path?: string;
  hash?: string;
  children?: { label: string; path: string; description?: string }[];
};

const navStructure: NavLink[] = [
  { label: "Home", path: "/" },
  {
    label: "Product",
    children: [
      { label: "Resume Intelligence", path: "/ai-resume-builder", description: "Build and rebuild ATS resumes" },
      { label: "Job Fit Analysis", path: "/job-fit-analysis-tool", description: "Compare your CV against any JD" },
      { label: "Skill Roadmap", path: "/career-gap-analysis-ai", description: "Discover what skills you are missing" },
      { label: "Interview Intelligence", path: "/interview-intelligence", description: "Vernacular voice AI mock interviews" },
      { label: "Promotion Readiness", path: "/promotion-readiness-ai", description: "Assess internal growth potential" },
      { label: "Portfolio Analyzer", path: "/portfolio-analyzer-ai", description: "Analyze your project showcase" },
    ]
  },
  {
    label: "AI Tools",
    children: [
      { label: "AI Resume Builder", path: "/ai-resume-builder-for-freshers" },
      { label: "Resume Scoring Software", path: "/resume-scoring-software" },
      { label: "Job Fit Analysis Tool", path: "/job-fit-analysis-tool" },
      { label: "LinkedIn Optimizer", path: "/linkedin-optimization" },
      { label: "Career Gap Analysis AI", path: "/career-gap-analysis-ai" },
      { label: "AIVI vs ChatGPT", path: "/ai-vs-chatgpt-vs-gemini" },
      { label: "What is AIVI?", path: "/what-is-aivi" },
    ]
  },
  { label: "Pricing", hash: "#pricing" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "For Colleges", path: "/for-colleges" },
];

const GlobalHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isForColleges = location.pathname === "/for-colleges";
  const isLightHeader = true;

  const handleNavClick = (link: NavLink) => {
    if (link.hash) {
      if (location.pathname === "/") {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      } else if (location.pathname === "/for-colleges" && link.hash === "#demo") {
        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + link.hash);
      }
    }
  };

  const toggleMobileMenu = (label: string) => {
    setMobileExpandedMenu(mobileExpandedMenu === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7ECEF] bg-white/95 backdrop-blur-md">
      <PromoBanner />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl border border-[#E5E8EC] bg-white p-2 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
            <AiviLogo size={20} className="text-[#D59C45]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-semibold leading-none text-[#112031]">AIVI</span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#7E8A94]">Career Intelligence OS</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navStructure.map((link) => {
            if (link.children) {
              return (
                <div key={link.label} className="group relative">
                  <button
                    className="inline-flex h-10 items-center gap-1 text-sm font-medium text-[#55626D] hover:text-[#112031] transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-1/2 hidden -translate-x-1/2 pt-2 group-hover:block z-50">
                    <div className="w-64 rounded-2xl border border-[#E7ECEF] bg-white p-2 text-[#112031] shadow-xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="group/item flex flex-col gap-1 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#F7FAFB]"
                        >
                          <span className="text-sm font-medium text-[#112031] group-hover/item:text-[#FF6D4A] transition-colors">{child.label}</span>
                          {child.description && (
                            <span className="text-xs text-[#7B8892]">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            if (link.hash) {
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="inline-flex h-10 items-center text-sm font-medium text-[#55626D] hover:text-[#112031] transition-colors"
                >
                  {link.label}
                </button>
              );
            }
            if (link.label === "For Colleges") {
              const CAMPUS_URL = typeof window !== "undefined" && window.location.hostname.includes("staging")
                ? "https://staging.aivicampus.com"
                : "https://aivicampus.com";
              return (
                <a
                  key={link.label}
                  href={CAMPUS_URL}
                  className="inline-flex h-10 items-center text-sm font-medium text-[#55626D] hover:text-[#112031] transition-colors"
                >
                  {link.label}
                  <span className="ml-1 rounded border border-teal-300 bg-teal-50 px-1 text-[10px] font-bold text-teal-700">
                    B2B
                  </span>
                </a>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path || "/"}
                className={`inline-flex h-10 items-center text-sm transition-colors ${
                  location.pathname === link.path
                    ? "font-bold text-[#112031]"
                    : "font-medium text-[#55626D] hover:text-[#112031]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/auth"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#55626D] hover:bg-[#F6F8FA] hover:text-[#112031] transition-colors"
          >
            Sign In
          </Link>

          {isForColleges ? (
            <button
              onClick={() => {
                document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 bg-[#FF6D4A] text-white shadow-[0_18px_50px_-24px_rgba(255,109,74,0.5)] hover:bg-[#FF7A5B]"
            >
              Book a Demo
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 bg-[#FF6D4A] text-white shadow-[0_18px_50px_-24px_rgba(255,109,74,0.5)] hover:bg-[#FF7A5B]"
            >
              Enter AIVI
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 text-[#112031] md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="max-h-[80vh] space-y-3 overflow-y-auto border-t border-[#E9ECEF] bg-white px-6 py-4 md:hidden">
          {navStructure.map((link) => {
            if (link.children) {
              const isExpanded = mobileExpandedMenu === link.label;
              return (
                <div key={link.label} className="block">
                  <button
                    onClick={() => toggleMobileMenu(link.label)}
                    className="flex w-full items-center justify-between border-b border-[#E9ECEF] py-2 text-sm font-medium text-[#112031]"
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="mt-2 mb-2 space-y-1 border-l-2 border-[#FF6D4A]/30 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-sm text-[#55626D] hover:text-[#112031]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            if (link.hash) {
              return (
                <button
                  key={link.label}
                  onClick={() => { setMobileOpen(false); handleNavClick(link); }}
                  className="block w-full border-b border-[#E9ECEF] py-2 text-left text-sm font-medium text-[#112031]"
                >
                  {link.label}
                </button>
              );
            }
            if (link.label === "For Colleges") {
              const CAMPUS_URL = typeof window !== "undefined" && window.location.hostname.includes("staging")
                ? "https://staging.aivicampus.com"
                : "https://aivicampus.com";
              return (
                <a
                  key={link.label}
                  href={CAMPUS_URL}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-[#E9ECEF] py-2 text-sm font-medium text-[#112031]"
                >
                  {link.label}
                  <span className="ml-1.5 rounded border border-teal-300 bg-teal-50 px-1 text-[10px] font-bold text-teal-700">
                    B2B
                  </span>
                </a>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path || "/"}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-[#E9ECEF] py-2 text-sm font-medium text-[#112031]"
              >
                {link.label}
              </Link>
            );
          })}
          <div className="space-y-2 pt-3">
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-[#55626D]">
              Sign In
            </Link>
            {isForColleges ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full rounded-2xl bg-[#FF6D4A] py-3 text-center text-sm font-semibold text-white shadow-md"
              >
                Book a Demo
              </button>
            ) : (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-2xl bg-[#FF6D4A] py-3 text-center text-sm font-semibold text-white shadow-md"
              >
                Enter AIVI
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;
