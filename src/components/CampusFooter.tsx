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
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#0F1720] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(177_51%_34%/0.18),transparent)] blur-2xl" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-5 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.1fr]">
          {/* Brand */}
          <div>
            <CampusLogo className="h-16 w-[220px]" imgClassName="h-14 w-full" />
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-slate-400">
              The Employability OS for Indian colleges — AI career coaching, TPO command center, vernacular voice
              practice and one-click NAAC/NIRF evidence, in English and Hindi.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[hsl(176_52%_45%/0.25)] bg-[hsl(176_52%_45%/0.08)] px-3.5 py-2.5 text-[11.5px] font-bold text-[hsl(176_52%_62%)] w-fit">
              <ShieldCheck className="h-4 w-4" />
              DPDP 2023 aligned · Data hosted in India (Google Cloud Mumbai)
            </div>
          </div>

          {/* Columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1 text-[13px] font-medium text-slate-300 transition-colors hover:text-white"
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
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Governance</h4>
            <ul className="mt-4 space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-[12.5px] font-medium text-slate-400">
              <a href="mailto:hello@aivilabs.com" className="flex items-center gap-2 transition-colors hover:text-white">
                <Mail className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" /> hello@aivilabs.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" /> Gorakhpur, UP, India · serving campuses nationwide
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-7 sm:flex-row">
          <p className="text-[11.5px] font-medium text-slate-500">
            © {new Date().getFullYear()} AIVI Intelligence Private Limited. All rights reserved. Built with the AIVI Career OS engine.
          </p>
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(176_52%_55%)]" />
            Criterion-ready · AICTE · NAAC · NIRF · DPDP
          </p>
        </div>
      </div>
    </footer>
  );
}
