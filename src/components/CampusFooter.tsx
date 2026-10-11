import { Link } from "react-router-dom";
import { ShieldCheck, Mail, MapPin, Sparkles, ArrowUpRight } from "lucide-react";
import CampusLogo from "@/components/CampusLogo";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "TPO Command Center", to: "/campus" },
      { label: "Students Roster & AES", to: "/campus/students" },
      { label: "Placement Drive Manager", to: "/campus/drives" },
      { label: "AI Interview Lab", to: "/campus/interviews" },
      { label: "Resume Vault", to: "/campus/vault" },
    ],
  },
  {
    title: "For Institutions",
    links: [
      { label: "NAAC / NIRF Evidence", to: "/campus/accreditation" },
      { label: "Pricing", to: "/#pricing" },
      { label: "60-Day Free Audit", to: "/#audit" },
      { label: "Group Portfolio", to: "/campus/group-overview" },
      { label: "Master Console", to: "/platform-admin" },
    ],
  },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Data Processing Addendum", to: "/dpa" },
];

export default function CampusFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-[#f5f8fc] text-[#24334a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(219,234,254,0.7),transparent)] blur-2xl" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-5 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.1fr]">
          {/* Brand */}
          <div>
            <p className="text-[12px] font-medium tracking-wide text-[#47607e]">A Product of AIVI Intelligence Private Limited</p>
            <CampusLogo className="mt-3 h-16 w-[220px]" imgClassName="h-14 w-full" />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-[#516782]">
              The Employability OS for Indian colleges — AI career coaching, TPO command center, vernacular voice
              practice and one-click NAAC/NIRF evidence, in English and Hindi.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12px] font-semibold text-[#13653f] w-fit">
              <ShieldCheck className="h-4 w-4" />
              DPDP 2023 aligned · Data hosted in India (Google Cloud Mumbai)
            </div>
          </div>

          {/* Columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#4d6482]">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1 text-[13.5px] font-normal text-[#24334a] transition-colors hover:text-[#2176ff]"
                    >
                      <span className="link-underline">{l.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal & contact */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#4d6482]">Governance</h4>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13.5px] font-normal text-[#24334a] transition-colors hover:text-[#2176ff]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-[12.5px] font-medium text-[#4f647e]">
              <a href="mailto:hello@aivilabs.com" className="flex items-center gap-2 transition-colors hover:text-[#2176ff]">
                <Mail className="h-3.5 w-3.5 text-[#2176ff]" /> hello@aivilabs.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#2176ff]" /> Gorakhpur, UP, India · serving campuses nationwide
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-7 sm:flex-row">
          <p className="text-[11.5px] font-medium text-[#5f7490]">
            © {new Date().getFullYear()} AIVI Intelligence Private Limited. All rights reserved. Built with the AIVI Career OS engine.
          </p>
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#5f7490]">
            <Sparkles className="h-3.5 w-3.5 text-[#2176ff]" />
            Criterion-ready · AICTE · NAAC · NIRF · DPDP
          </p>
        </div>
      </div>
    </footer>
  );
}
