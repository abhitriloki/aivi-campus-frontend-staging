import { Link } from "react-router-dom";
import AiviLogo from "./AiviLogo";
import { Shield } from "lucide-react";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";

const GlobalFooter = () => {
  const { branding } = useTenantBranding();
  const CAMPUS_URL = typeof window !== "undefined" && window.location.hostname.includes("staging")
    ? "https://staging.aivicampus.com"
    : "https://aivicampus.com";

  return (
    <footer className="border-t border-[#E7ECEF] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFB_100%)] py-16 text-[#112031]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4 md:gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-[#E5E8EC] bg-white p-2 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
              <AiviLogo size={20} className="text-[#D59C45]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-semibold leading-none text-[#112031]">AIVI</span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#7E8A94]">Career Intelligence OS</span>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#62707C]">
            The strategic operating system for ambitious professionals who want clearer positioning, sharper applications, and more confident career decisions.
          </p>
          <p className="text-xs text-[#62707C] leading-relaxed max-w-sm">
            AIVI Career &amp; AIVI Campus are products of{" "}
            <a href="https://aiviintelligence.com/" className="font-semibold text-[#112031] hover:underline">
              AIVI Intelligence
            </a>{" "}
            — India's AI-first SaaS product studio.
          </p>
          <div className="mt-1 flex items-center gap-2 rounded-full border border-[#DDEAEC] bg-white px-3 py-2 w-fit shadow-[0_12px_30px_-24px_rgba(17,32,49,0.16)]">
            <Shield className="h-3.5 w-3.5 text-[#19A89A]" />
            <span className="text-xs text-[#6D7A85]">Secure, encrypted, and built for premium career workflows</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#FF8C6B]">For Individuals</h4>
          <Link to="/ai-resume-builder" className="text-[#62707C] transition-colors hover:text-[#112031]">Resume Intelligence</Link>
          <Link to="/job-fit-analysis-tool" className="text-[#62707C] transition-colors hover:text-[#112031]">Job Fit Analysis</Link>
          <Link to="/career-gap-analysis-ai" className="text-[#62707C] transition-colors hover:text-[#112031]">Skill Roadmap</Link>
          <Link to="/interview-intelligence" className="text-[#62707C] transition-colors hover:text-[#112031]">Interview Intelligence</Link>
          <Link to="/promotion-readiness-ai" className="text-[#62707C] transition-colors hover:text-[#112031]">Promotion Readiness</Link>
          <Link to="/portfolio-analyzer-ai" className="text-[#62707C] transition-colors hover:text-[#112031]">Portfolio Analyzer</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#24B7A9]">For Campuses (B2B)</h4>
          <a href={CAMPUS_URL} className="font-semibold text-[#169C8F] transition-colors hover:underline">AIVI Campus by AIVI Intelligence</a>
          <a href={`${CAMPUS_URL}#demo`} className="text-[#62707C] transition-colors hover:text-[#112031]">Book 20-Min Demo</a>
          <a href={`${CAMPUS_URL}/campus/login`} className="text-[#62707C] transition-colors hover:text-[#112031]">Institutional Login</a>
          <a href={`${CAMPUS_URL}/dpa`} className="text-[#62707C] transition-colors hover:text-[#112031]">Data Processing Addendum (DPA)</a>
          <a href={`${CAMPUS_URL}#pricing`} className="text-[#62707C] transition-colors hover:text-[#112031]">Campus Licensing</a>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#FF8C6B]">Company & Legal</h4>
          <Link to="/about" className="text-[#62707C] transition-colors hover:text-[#112031]">About Us</Link>
          <Link to="/contact" className="text-[#62707C] transition-colors hover:text-[#112031]">Contact</Link>
          <Link to="/privacy" className="text-[#62707C] transition-colors hover:text-[#112031]">Privacy Notice (DPDP)</Link>
          <Link to="/data-rights" className="text-[#62707C] transition-colors hover:text-[#112031]">Data Rights & Erasure</Link>
          <Link to="/terms" className="text-[#62707C] transition-colors hover:text-[#112031]">Terms of Service</Link>
          <a href={`${CAMPUS_URL}/dpa`} className="text-[#62707C] transition-colors hover:text-[#112031]">DPDP Act Compliance</a>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between border-t border-[#E7ECEF] px-6 pt-8 text-xs text-[#7E8A94] md:flex-row gap-4">
        <p>© 2026 AIVI Campus — A Product of AIVI Intelligence Private Limited (CIN: U62099UP2026PTC249169). All rights reserved.</p>
        {branding.name && branding.name !== "AIVI Campus" && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-200 text-[#112031] font-semibold text-[11px]">
            <span>{branding.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-700 font-normal">Powered by AIVI Campus OS</span>
          </div>
        )}
      </div>
    </footer>
  );
};

export default GlobalFooter;
