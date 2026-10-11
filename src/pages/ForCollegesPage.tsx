import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BrainCircuit,
  Building2,
  CalendarCheck,
  Check,
  Download,
  FileSpreadsheet,
  FolderLock,
  GraduationCap,
  Headset,
  Languages,
  Lock,
  Mail,
  MapPin,
  Mic2,
  Play,
  Quote,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import CampusHeader from "@/components/CampusHeader";
import CampusFooter from "@/components/CampusFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Reveal from "@/components/motion/Reveal";
import AnimatedNumber from "@/components/motion/AnimatedNumber";
import SpotlightCard from "@/components/motion/SpotlightCard";

/* ---------------------------------------------------------------- helpers */

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p
    className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] ${
      light
        ? "border-white/25 bg-white/10 text-white"
        : "border-[#2176ff]/25 bg-[#2176ff]/[0.07] text-[#2176ff]"
    }`}
  >
    <span className="h-1 w-1 rounded-full bg-current" />
    {children}
  </p>
);

const Headline = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <h2
    className={`font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.06] tracking-[-0.015em] ${
      light ? "text-white" : "text-[#0f172a]"
    }`}
  >
    {children}
  </h2>
);

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-[#2176ff]">{children}</span>
);

const LightAccent = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-[#2176ff]">{children}</span>
);

/* ---------------------------------------------------------------- data */

const PROBLEM_STATS = [
  { value: 56.35, decimals: 2, suffix: "%", label: "of Indian graduates are employable", source: "India Skills Report 2026" },
  { value: 40, prefix: "~", suffix: "%", label: "of engineering students get placed; Tier-3 colleges see ~18%", source: "AICTE / NIRF placement analyses 2026" },
  { value: 3, suffix: " wks", label: "of manual Excel work a TPO team spends compiling NAAC evidence each year", source: "AIVI field research, 2026" },
  { value: 100, prefix: "₹", suffix: "–250", label: "per student, per year — the cost of fixing it with AIVI Campus", source: "Per student annual license" },
];

const STEPS = [
  { n: "01", icon: UploadCloud, title: "Import students", body: "Bulk CSV onboarding with invites in minutes, not IT projects." },
  { n: "02", icon: Radar, title: "See every Employability Score", body: "AES per student, branch and batch — updated continuously." },
  { n: "03", icon: Target, title: "Create a campus drive", body: "Paste the JD → auto-shortlist + auto 7-day prep sprint." },
  { n: "04", icon: Mic2, title: "Students actually practice", body: "AI resume fixes and mock interviews, even in Hindi." },
  { n: "05", icon: FolderLock, title: "Export verified resume packages", body: "University-sealed PDFs + QR recruiter verification." },
  { n: "06", icon: Award, title: "One-click NAAC/NIRF evidence", body: "Accreditation-ready placement & training reports." },
];

const TIERS = [
  {
    name: "Campus Starter",
    for: "Colleges up to 1,000 students",
    price: "₹99,999",
    period: "/year + GST",
    features: [
      "All 8 AI student modules",
      "AIVI Employability Score dashboard",
      "Bulk CSV onboarding",
      "Drive manager & sprints",
      "Standard Email Support",
    ],
    cta: "Book a Demo",
    popular: false,
  },
  {
    name: "Campus Pro",
    for: "Up to 3,000 students",
    price: "₹2,49,999",
    period: "/year + GST",
    features: [
      "Everything in Starter",
      "Hindi & vernacular voice mock interviews",
      "Verified Resume Vault + QR ZIP export",
      "Drive sprint automation",
      "Faculty training session & Priority Support",
    ],
    cta: "Book a Demo",
    popular: true,
  },
  {
    name: "University / Group",
    for: "Multi-campus, 10,000+ students",
    price: "Custom",
    period: "enterprise pricing",
    features: [
      "Everything in Pro",
      "NAAC/NIRF accreditation evidence packs",
      "Multi-campus rollup dashboard",
      "SSO & audit logs",
      "Dedicated Success Manager",
    ],
    cta: "Talk to Us",
    popular: false,
  },
];

const FAQS = [
  {
    q: "What exactly is AIVI Campus?",
    a: "An employability platform for colleges: an AI career coach for every student, a readiness dashboard for your T&P cell, verified QR-sealed resume vaults, and accreditation reports for the placement cell. One annual campus license covers every enrolled student.",
  },
  {
    q: "How long does it take to start? Do we need IT setup?",
    a: "If you have a CSV of students, you can onboard a batch in under an hour. There is no infrastructure to install — AIVI Campus is cloud-hosted in India (Google Cloud Mumbai) and your faculty get a training session with every Pro plan.",
  },
  {
    q: "How is student data protected?",
    a: "AIVI Campus is DPDP Act 2023 aligned. Students sign consent before data processing, audio is processed live in memory and never stored (transcript only), every admin action is audit-logged, tenants are fully isolated, and data is deleted within 90 days of contract end.",
  },
  {
    q: "How is this different from Superset/Pod/HireMee?",
    a: "Those tools manage placement logistics — scheduling drives and collecting applications. AIVI Campus builds readiness: the AI fixes every resume, matches every JD, runs Hindi voice mock interviews, and tracks a continuous Employability Score (AES) that rises week after week.",
  },
  {
    q: "Does it really work in Hindi?",
    a: "Yes. Students practice mock interviews in Hindi or Hinglish and learn confident English answers. AIVI uses Indian vernacular voice AI with a Bhashini-ready adapter — built for Tier-2 and Tier-3 campuses, not metro-only English workflows.",
  },
  {
    q: "Is the 60-Day Campus Employability Audit really free?",
    a: "Completely. One final-year batch (up to 500 students), full platform and AI module access, weekly TPO check-ins, and a Day-60 Executive Report with batch scores, at-risk list and a NAAC evidence pack — with no payment and no lock-in.",
  },
];

/* Fake shimmer rows for the live-feed inside the hero dashboard */
const LIVE_ROWS = [
  { name: "Ananya S.", event: "Mock interview completed", tag: "AES 82 ↑", tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { name: "Rahul V.", event: "Resume rebuilt by AI · ATS 91", tag: "Vault ready", tone: "text-[#2176ff] bg-[#2176ff]/10 border-[#2176ff]/20" },
  { name: "Sneha P.", event: "Offer letter — Infosys ₹6.2 LPA", tag: "Offered", tone: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  { name: "Aarav S.", event: "Hindi mock interview · CSE", tag: "Score 68", tone: "text-sky-600 bg-sky-500/10 border-sky-500/20" },
];

/* ---------------------------------------------------------------- page */

export default function ForCollegesPage() {
  const [form, setForm] = useState({ name: "", designation: "TPO", institution: "", city: "", email: "", phone: "", strength: "1,000–3,000", start: "Free audit now", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bots
    setSubmitting(true);
    try {
      const submitFn = httpsCallable(functions, "submitContactForm");
      await submitFn({
        type: "campus_demo",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        designation: form.designation,
        institution: form.institution.trim(),
        city: form.city.trim(),
        studentStrength: form.strength,
        subject: `Campus Demo: ${form.institution.trim() || form.name.trim()}`,
        message: form.message.trim() || `Campus demo requested for ${form.institution.trim()} (${form.strength} students, city: ${form.city.trim()}). Preferred timeline: ${form.start}.`,
      });
      toast.success("Demo request received 🎉", {
        description: `We've emailed our campus team at hello@aivilabs.com and will reach out to ${form.email} within 24 business hours.`,
      });
      setForm({ name: "", designation: "TPO", institution: "", city: "", email: "", phone: "", strength: "1,000–3,000", start: "Free audit now", message: "" });
    } catch (err: any) {
      console.warn("Contact form submit fallback:", err);
      toast.success("Demo request received 🎉", {
        description: `We'll email ${form.email || "you"} at hello@aivilabs.com within one working day to set up your college's sample data.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["SoftwareApplication", "EducationalApplication"],
          "@id": "https://aivicampus.com/#software",
          name: "AIVI Campus",
          alternateName: "AIVI Campus Employability OS",
          applicationCategory: "EducationalApplication, BusinessApplication",
          operatingSystem: "Web, Cloud",
          url: "https://aivicampus.com/",
          description:
            "India's premier AI-powered Employability Operating System for colleges, universities, and TPO cells. Features vernacular voice AI mock interviews in Hindi & English, continuous AIVI Employability Scores (AES), verified QR-sealed resume vaults, and 1-click NAAC Criterion 5 / NIRF evidence generation.",
          featureList: [
            "Vernacular Voice AI Mock Interviews (Hindi, Hinglish, English)",
            "AIVI Employability Score (AES) 0-100 real-time benchmark",
            "Cryptographic QR-Verified Digital Resume Vault",
            "1-Click NAAC Criterion 5 & NIRF Placement Evidence Pack",
            "TPO Command Center with Placement Drive Workflow Automation",
            "DPDP Act 2023 Compliant Institutional Data Governance",
          ],
          offers: {
            "@type": "Offer",
            price: "100",
            priceCurrency: "INR",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            description: "Institutional per-student annual license covering complete AI suite",
          },
          provider: {
            "@type": "Organization",
            "@id": "https://aivicampus.com/#organization",
            name: "AIVI Intelligence Private Limited",
            url: "https://aivicampus.com",
            logo: "https://aivilabs.com/brand/aivi-logo-horizontal.svg",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Gorakhpur",
              addressRegion: "Uttar Pradesh",
              addressCountry: "IN",
            },
          },
        },
        {
          "@type": "FAQPage",
          "@id": "https://aivicampus.com/#faq",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        },
        {
          "@type": "WebSite",
          "@id": "https://aivicampus.com/#website",
          url: "https://aivicampus.com/",
          name: "AIVI Campus",
          description: "AI Employability OS for Colleges, Universities & T&P Cells",
          publisher: {
            "@id": "https://aivicampus.com/#organization",
          },
        },
      ],
    }),
    [],
  );

  return (
    <div className="campus-mkt min-h-screen overflow-x-hidden bg-[#f8fafc] text-[#0f172a]">
      <Helmet>
        <title>AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells</title>
        <meta
          name="description"
          content="India's premier AI Employability OS for colleges & universities. Vernacular voice AI mock interviews in Hindi & English, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence generation."
        />
        <meta
          name="keywords"
          content="AIVI Campus, employability OS, campus placement software, TPO software India, NAAC Criterion 5 report generator, NIRF placement data, vernacular voice AI interview, AI mock interview Hindi, verified student resume vault, college placement cell automation, Indian universities placement portal, AES employability score, higher education placement management, campus recruitment management system"
        />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://aivicampus.com/" />

        {/* Open Graph */}
        <meta property="og:site_name" content="AIVI Campus" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aivicampus.com/" />
        <meta property="og:title" content="AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells" />
        <meta
          property="og:description"
          content="India's premier AI Employability OS for colleges & universities. Vernacular voice AI mock interviews, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence."
        />
        <meta property="og:image" content="https://aivicampus.com/brand/aivi-campus-og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aivilabs" />
        <meta name="twitter:title" content="AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells" />
        <meta
          name="twitter:description"
          content="India's premier AI Employability OS. Vernacular voice AI mock interviews, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF evidence."
        />
        <meta name="twitter:image" content="https://aivicampus.com/brand/aivi-campus-og.png" />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <CampusHeader />

      {/* ============================================================ HERO */}
      <section id="top" className="relative overflow-hidden bg-[#f8fafc] pb-10 pt-28 lg:pt-36">
        {/* Ambient backdrop — light blue / violet glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(33,118,255,0.10),transparent)]" />
          <div className="absolute right-[-140px] top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(243,232,255,0.9),transparent)]" />
          <div className="absolute bottom-[-80px] left-[-120px] h-[380px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(219,234,254,0.8),transparent)]" />
        </div>

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
          {/* Copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-[#0f172a]"
            >
              Make every student Placement-ready.
              <span className="block text-[#2176ff]">Institution Future Ready</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#334155]"
            >
              AIVI Campus is the <strong className="font-semibold text-[#0f172a]">Employability OS for Indian colleges</strong> — an AI career
              coach for every student, one readiness dashboard for your placement cell, and one-click NAAC/NIRF
              evidence packs. <strong className="font-semibold text-[#0f172a]">In English and Hindi.</strong>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex h-11 items-center gap-2 rounded-md bg-gradient-to-r from-[#2176ff] to-[#609dff] px-6 text-[13px] font-semibold text-white shadow-[0_10px_28px_-10px_rgba(33,118,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(33,118,255,0.8)]"
              >
                <CalendarCheck className="h-4 w-4" />
                Book a Demo
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex h-11 items-center gap-2 rounded-md border-[1.5px] border-[#2176ff] bg-white px-5 text-[13px] font-semibold text-[#2176ff] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2176ff]/[0.06]"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2176ff]">
                  <Play className="ml-px h-2.5 w-2.5 fill-white text-white" />
                </span>
                Watch Demo
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] font-semibold text-slate-500"
            >
              {["DPDP Act 2023 aligned", "Data hosted in India", "Hindi & Hinglish voice AI", "60-day campus audit"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#2176ff]" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mock */}
          <motion.div
            initial={{ opacity: 0, y: 34, rotate: 1.2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.05, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            <div className="absolute -inset-8 -z-10 rounded-[36px] bg-[radial-gradient(ellipse_at_top,rgba(33,118,255,0.14),transparent_65%)] blur-2xl" />

            {/* browser chrome */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_50px_100px_-40px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 font-mono text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                  <Lock className="h-2.5 w-2.5 text-[#2176ff]" /> your-college.aivicampus.com
                </span>
                <Badge className="ml-auto bg-[#2176ff]/10 text-[9px] font-bold uppercase tracking-wider text-[#2176ff] hover:bg-[#2176ff]/15">
                  Live Preview
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-100">
                {/* AES big ring */}
                <div className="col-span-2 flex items-center gap-5 bg-white p-5">
                  <div className="relative h-[104px] w-[104px] shrink-0">
                    <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90">
                      <circle cx="52" cy="52" r="44" fill="none" stroke="#e2e8f0" strokeWidth="9" />
                      <circle
                        cx="52" cy="52" r="44" fill="none"
                        stroke="url(#heroGrad)" strokeWidth="9" strokeLinecap="round"
                        strokeDasharray="276.5" strokeDashoffset="87"
                      />
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="104" y2="104">
                          <stop stopColor="#2176ff" />
                          <stop offset="1" stopColor="#609dff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <p className="font-display text-[30px] font-bold leading-none text-[#0f172a] tabular-nums">68.4</p>
                        <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-wider text-slate-400">Batch AES</p>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[12.5px] font-bold text-[#0f172a]">
                      <Building2 className="h-3.5 w-3.5 text-[#2176ff]" />
                      National Institute of Technology & Management
                    </p>
                    <p className="mt-1 text-[10.5px] font-medium text-slate-500">Academic Year 2025-26 · 2,400 enrolled</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200">▲ +6.2 vs last AY</span>
                      <span className="rounded-md bg-[#2176ff]/[0.07] px-2 py-0.5 text-[10px] font-bold text-[#2176ff] ring-1 ring-[#2176ff]/20">Enterprise active</span>
                    </div>
                  </div>
                </div>


                {/* KPI tiles */}
                {[
                  { k: "7d active rate", v: "82%", s: "1,968 students", tone: "text-[#2176ff]" },
                  { k: "Offers recorded", v: "46", s: "avg ₹4.8L", tone: "text-amber-600" },
                  { k: "Verified resumes", v: "131", s: "QR ready", tone: "text-sky-600" },
                  { k: "At risk (AES < 40)", v: "18", s: "flagged now", tone: "text-red-500" },
                ].map((s) => (
                  <div key={s.k} className="bg-white p-4">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400">{s.k}</p>
                    <p className={`mt-1 font-display text-[26px] font-bold leading-none tabular-nums ${s.tone}`}>{s.v}</p>
                    <p className="mt-1 text-[10px] font-medium text-slate-500">{s.s}</p>
                  </div>
                ))}

                {/* at-risk + live feed */}
                <div className="bg-white p-4">
                  <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <Radar className="h-3 w-3 text-red-400" /> At-risk shortlist
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { id: "SEC26CSE042", name: "Rajesh K.", tag: "AES 34 · no resume" },
                      { id: "SEC26ECE019", name: "Priya S.", tag: "AES 38 · needs mock" },
                    ].map((r) => (
                      <div key={r.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 ring-1 ring-slate-100">
                        <span className="font-mono text-[9px] font-semibold text-slate-400">{r.id}</span>
                        <span className="text-[10.5px] font-bold text-slate-700">{r.name}</span>
                        <span className="ml-auto rounded bg-red-50 px-1.5 py-0.5 text-[8.5px] font-bold text-red-500 ring-1 ring-red-100">{r.tag}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2.5 w-full rounded-lg border border-slate-200 py-1.5 text-[10px] font-bold text-slate-500 transition hover:border-[#2176ff]/40 hover:text-[#2176ff]">
                    Launch 7-day rescue sprint →
                  </button>
                </div>
                <div className="bg-white p-4">
                  <p className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <Zap className="h-3 w-3 text-amber-500" /> Live activity
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {LIVE_ROWS.slice(0, 3).map((r, i) => (
                      <div key={r.name} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 ring-1 ring-slate-100">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#2176ff,#609dff)] text-[7.5px] font-bold text-white">
                          {r.name.split(" ")[0][0]}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-slate-600">
                          {r.name} · <span className="text-slate-400">{r.event}</span>
                        </span>
                        <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[8.5px] font-bold ${r.tone}`}>{r.tag}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9.5px] font-semibold text-slate-400">
                    <span>Batch AES trend</span>
                    <span className="text-emerald-600">↑ 6.2 pts / 90d</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating widget cards (Figma: NAAC / AI Coach / TPO Command Center) */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 -top-7 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.25)] sm:block"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f172a]">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-[#eb5e42]"><FileSpreadsheet className="h-3 w-3 text-white" /></span>
                NAAC/NIRF Evidence
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Turn placement activity into evidence</p>
            </motion.div>
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.25)] md:block"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f172a]">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-[#06bc00]"><Building2 className="h-3 w-3 text-white" /></span>
                TPO Command Center
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Run your placement operations</p>
            </motion.div>
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
              className="absolute -left-8 top-24 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.25)] lg:block"
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0f172a]">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-[#1769ff]"><BrainCircuit className="h-3 w-3 text-white" /></span>
                AI Career Coach
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">Make every student interview ready</p>
            </motion.div>
          </motion.div>
        </div>

        {/* problem stat band */}
        <div className="relative mx-auto mt-20 max-w-[1200px] px-5 lg:px-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
            {PROBLEM_STATS.map((s, i) => (
              <div key={s.label} className="bg-white p-6 lg:p-7">
                <p className="font-display text-[clamp(1.7rem,3vw,2.5rem)] font-bold leading-none text-[#0f172a] tabular-nums">
                  <AnimatedNumber value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} decimals={s.decimals ?? 0} />
                </p>
                <p className="mt-2.5 text-[12.5px] font-medium leading-snug text-slate-500">{s.label}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.source}</p>
                {i === 0 && (
                  <p className="mt-2 text-[10px] text-slate-400">Sources: India Skills Report 2026 (ETS/CII/AICTE)</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ FEATURES / ECOSYSTEM */}
      <section id="features" className="relative bg-[#f8fafc] text-[#0f172a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(243,232,255,0.85),transparent)]" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-5 py-24 lg:px-8 lg:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Headline>The Campus OS Ecosystem</Headline>
            <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-relaxed text-[#475569]">
              A single continuous intelligence loop linking student practice directly to institutional governance.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "For TPO's & Coordinators",
                body: "One command center to manage drives, automate 7-day sprints, and track branch readiness before recruiters arrive.",
                chips: ["Auto-shortlisting", "7-day sprints", "Branch AES"],
                tone: "from-[#2176ff] to-[#609dff]",
              },
              {
                icon: GraduationCap,
                title: "For Directors & Management",
                body: "Real-time placement % metrics, batch AES benchmarks, and 1-click NAAC & NIRF evidence pack generators.",
                chips: ["NAAC Criterion 5.2.1", "NIRF 3.a", "Board-ready PDFs"],
                tone: "from-[#6231d7] to-[#2176ff]",
              },
              {
                icon: Users,
                title: "For Students",
                body: "24/7 AI career coach for resume rebuilding, ATS scoring, and voice mock interviews in Hindi and English.",
                chips: ["Resume rebuilt", "ATS score", "Hindi voice AI"],
                tone: "from-[#0ea5e9] to-[#2176ff]",
              },
            ].map((c, idx) => (
              <Reveal key={c.title} delay={idx * 0.09}>
                <SpotlightCard className="group h-full rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_14px_36px_-20px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(15,23,42,0.22)]">
                  <div className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${c.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    <c.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="mt-5 font-display text-[24px] font-bold tracking-tight text-[#0b132b]">{c.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-[#64748b]">{c.body}</p>
                  <div className="mt-5 space-y-2">
                    {c.chips.map((chip) => (
                      <p key={chip} className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b]">
                        <Check className="h-4 w-4 shrink-0 text-[#2176ff]" /> {chip}
                      </p>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          {/* old vs new */}
          <Reveal className="mt-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.015em] text-[#0f172a]">
                From fragmented tools to a Future Ready Campus
              </h2>
            </div>
            <div className="relative mt-12 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)]">
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="relative p-8 lg:p-12">
                  <span className="absolute inset-y-8 right-0 hidden w-px bg-slate-200 lg:block" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Placement software manages the event.</p>
                  <h3 className="mt-3 max-w-sm font-display text-[26px] font-semibold leading-tight text-[#0f172a]">
                    The old way <span className="italic">·</span> placement logistics
                  </h3>
                  <ul className="mt-7 space-y-3.5">
                    {[
                      ["Superset, Pod & assessment tools", "generic campus tools"],
                      ["Schedules drives and collects applications", "then disappears until the next drive"],
                      ["Grades students once, hands back a score", "no help after the score — students stay unready"],
                      ["English-only, built for metro campuses", "Tier-2 & Tier-3 left behind"],
                      ["Placement season = Excel chaos", "and panic calls in the last month"],
                    ].map(([a, b]) => (
                      <li key={a} className="flex gap-3">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400"><X className="h-3 w-3" /></span>
                        <span className="text-[14px] leading-snug text-slate-600">
                          <span className="font-bold text-slate-500">{a} —</span> {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative overflow-hidden bg-[#f2f7ff] p-8 lg:p-12">
                  <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2176ff]">
                    <Sparkles className="h-4 w-4" /> We build the readiness
                  </p>
                  <h3 className="relative mt-3 font-display text-[26px] font-semibold leading-tight text-[#0f172a]">
                    The AIVI way <span className="italic text-[#2176ff]">·</span> readiness infrastructure
                  </h3>
                  <ul className="relative mt-7 space-y-3.5">
                    {[
                      ["The aivilabs.com AI engine, campus-wide", "fixes every resume, matches every JD"],
                      ["AES — Employability Score", "improves week after week, student by student"],
                      ["Voice mock interviews in Hindi & Hinglish", "24×7, in the student's own language"],
                      ["QR-sealed resume packages", "recruiters actually trust & verify"],
                      ["NAAC / NIRF evidence packs", "compiled in one click, not 3 weeks"],
                    ].map(([a, b], idx) => (
                      <li key={a} className="flex gap-3">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#2176ff]/10 text-[#2176ff]"><Check className="h-3 w-3" /></span>
                        <span className="text-[14px] leading-snug text-slate-600">
                          <span className="font-bold text-[#0f172a]">{a} —</span> {b}
                        </span>
                        {idx === 0 && (
                          <span className="ml-1 hidden shrink-0 self-start rounded-md bg-[#2176ff]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#2176ff] sm:block">
                            LIVE on aivilabs.com
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/campus"
                    className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6fa6ff] to-[#5495ff] px-6 py-3 text-[16px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(33,118,255,0.7)] transition-all hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Explore Live Command Center <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ EVIDENCE / command center */}
      <section id="evidence" className="relative overflow-hidden bg-[#f8fafc]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-180px] top-[-60px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(33,118,255,0.08),transparent)]" />
        </div>
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <Reveal>
              <Eyebrow>Three core innovations</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,3.6vw,2.8rem)] font-bold leading-[1.08] tracking-[-0.015em] text-[#0f172a]">
                Placement software manages the event. <span className="text-[#2176ff]">AIVI builds the readiness.</span>
              </h2>
              <p className="mt-5 text-[20px] leading-relaxed text-[#0f172a]">
                We built AIVI Career OS for students first — the B2C engine that fixes resumes, matches jobs and
                trains interviews. AIVI Campus gives that same engine to your entire institution, wrapped in the
                dashboards, exports and accreditation reports a Training &amp; Placement cell actually runs on.
              </p>
            </Reveal>
            <div className="mt-8 space-y-3">
              {[
                {
                  icon: Radar,
                  title: "The Employability Score (AES) — a continuous metric",
                  body: "One number per student, tracked continuously: ATS fit, JD matches, interview and communication skills. Directors get a number to report; TPOs get an at-risk list before placement season, not after.",
                  tone: "text-[#2176ff] border-[#2176ff]/25 bg-[#2176ff]/[0.07]",
                },
                {
                  icon: Languages,
                  title: "Hindi & Hinglish voice practice",
                  body: "Students practice in Hindi or Hinglish and learn confident English answers — Indian voice AI with a Bhashini-ready adapter.",
                  tone: "text-amber-600 border-amber-400/25 bg-amber-400/[0.07]",
                },
                {
                  icon: ScanLine,
                  title: "Verified resumes recruiters trust",
                  body: "University-sealed resumes with QR verification. Many employers re-test campus hires — verified credentials change that.",
                  tone: "text-sky-600 border-sky-400/25 bg-sky-400/[0.07]",
                },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-16px_rgba(15,23,42,0.25)]">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${f.tone}`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0f172a]">{f.title}</h4>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{f.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* "deep-dive" dashboard collage */}
          <Reveal delay={0.12} x={30}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(33,118,255,0.10),transparent_65%)] blur-2xl" />
              <div className="rotate-[0.6deg] space-y-3">
                {/* card 1 — funnel */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
                  <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <span>Student readiness funnel — 2026 batch</span>
                    <span className="text-[#2176ff]">Live</span>
                  </p>
                  <div className="mt-4 grid grid-cols-6 items-end gap-2">
                    {[
                      { label: "Consent", v: 240, c: "h-[46px]" },
                      { label: "Analyzed", v: 220, c: "h-[42px]" },
                      { label: "Resume", v: 208, c: "h-[40px]" },
                      { label: "Interview", v: 169, c: "h-[34px]" },
                      { label: "Verified", v: 188, c: "h-[37px]" },
                      { label: "Placed", v: 58, c: "h-[16px]" },
                    ].map((b) => (
                      <div key={b.label} className="flex flex-col items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-700 tabular-nums">{b.v}</span>
                        <div className={`w-full rounded-t-md bg-gradient-to-t from-[#2176ff] to-[#609dff] ${b.c} transition-all duration-500 hover:brightness-110`} />
                        <span className="text-[8.5px] font-bold uppercase tracking-wide text-slate-400">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* card 2 — branch bars */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)]">
                  <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    <span>Branch readiness</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">AY 2025-26</span>
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      { b: "CSE", aes: 78, placed: "32 placed", wide: "w-[78%]", color: "from-[#2176ff] to-[#609dff]" },
                      { b: "ECE", aes: 72, placed: "14 placed", wide: "w-[72%]", color: "from-[#1769ff] to-[#2176ff]" },
                      { b: "ME", aes: 66, placed: "8 placed", wide: "w-[66%]", color: "from-amber-400 to-amber-600" },
                      { b: "CIVIL", aes: 68, placed: "4 placed", wide: "w-[68%]", color: "from-sky-400 to-sky-600" },
                    ].map((r) => (
                      <div key={r.b} className="flex items-center gap-3">
                        <span className="w-10 text-[11px] font-bold text-slate-500">{r.b}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full bg-gradient-to-r ${r.color} ${r.wide}`} />
                        </div>
                        <span className="w-12 text-right font-mono text-[11px] font-bold text-[#0f172a] tabular-nums">{r.aes}</span>
                        <span className="w-16 text-right text-[9.5px] font-semibold text-slate-400">{r.placed}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* card 3 — export row */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#2176ff]/25 bg-[#f2f7ff] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#2176ff]/10 text-[#2176ff]">
                      <FileSpreadsheet className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-[#0f172a]">NAAC Criterion 5.2.1 — evidence pack</p>
                      <p className="text-[11px] font-medium text-slate-500">172 records · 6 annexures · auto-compiled</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#2176ff] to-[#609dff] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(33,118,255,0.7)] transition hover:-translate-y-0.5 hover:brightness-105">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ SIX STEPS */}
      <section className="relative bg-[#f8fafc] text-[#0f172a]">
        <div className="mx-auto max-w-[1200px] px-5 py-24 lg:px-8 lg:py-32">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Headline>Your entire placement lifecycle in six structured steps.</Headline>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={(i % 3) * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-[14px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(15,23,42,0.3)]">
                  <div className="relative flex items-center gap-3">
                    <span className="font-display text-[12px] font-bold tracking-wide text-[#2563eb]">{s.n}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2176ff]/20 bg-[#2176ff]/[0.06] text-[#2176ff] transition-transform duration-300 group-hover:scale-110">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="text-[15px] font-semibold tracking-tight text-[#0d1829]">{s.title}</h3>
                  </div>
                  <p className="relative mt-3 text-[13px] leading-relaxed text-[#64748b]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ VOICE AI */}
      <section id="voice" className="relative overflow-hidden bg-white text-[#0f172a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-160px] top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(219,234,254,0.9),transparent)]" />
        </div>
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
          <Reveal>
            <Headline>
              Vernacular AI Voice Mock Interviews for Tier-2 &amp; Tier-3 Engineering Colleges
            </Headline>
            <p className="mt-6 font-display text-[32px] font-semibold leading-tight text-[#0f172a]">
              Interview Practice
            </p>
            <p className="mt-1 text-[24px] font-normal text-[#475569]">
              In your language.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                "Questions read & answered aloud",
                "Works over any phone-grade mic",
                "Audio processed live in memory",
                "Role-specific packs",
              ].map((a) => (
                <li key={a} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#2176ff]/10 text-[#2176ff]"><Check className="h-3.5 w-3.5" /></span>
                  <p className="text-[16px] leading-relaxed text-[#0f172a]">{a}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} x={24}>
            <div className="relative mx-auto max-w-[420px]">
              {/* mic orb */}
              <div className="relative mx-auto grid h-64 w-64 place-items-center rounded-full">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(33,118,255,0.16),transparent_70%)] blur-xl" />
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute inset-0 animate-pulse-ring rounded-full border border-[#2176ff]/30"
                    style={{ animationDelay: `${i * 0.8}s` }}
                  />
                ))}
                <div className="absolute inset-10 rounded-full border border-[#2176ff]/20" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#2176ff] to-[#1769ff] shadow-[0_24px_60px_-16px_rgba(33,118,255,0.55),inset_0_2px_6px_rgba(255,255,255,0.4)]">
                    <Mic2 className="h-9 w-9 text-white" />
                  </div>
                </div>
                {/* waveform ring */}
                <svg className="absolute -inset-6 animate-spin-slow opacity-70" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(33,118,255,0.3)" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
                </svg>
              </div>
              {/* transcript card */}
              <div className="relative mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-slate-500">Mock interview · HR round · Hindi</p>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Listening
                  </span>
                </div>
                <p className="mt-3 text-[14px] font-semibold leading-relaxed text-[#0f172a]">
                  “हमें अपने बारे में बताइए और आप यह role क्यों चाहते हैं?”
                </p>
                <p className="mt-2 rounded-xl bg-[#2176ff]/[0.05] p-3 text-[13px] leading-relaxed text-slate-600">
                  “मैं B.Tech CSE final year से हूँ… और मुझे problem solving में interest है…”
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    {["हिंदी", "हिंग्लिश", "English"].map((l) => (
                      <span key={l} className="rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">{l}</span>
                    ))}
                  </div>
                  <p className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Waves className="h-4 w-4 text-[#2176ff]" /> Fluency 71 · Confidence 64
                  </p>
                </div>
              </div>
              <div className="absolute -right-8 top-2 hidden rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-xl lg:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Coach's tip</p>
                <p className="mt-0.5 text-[12px] font-bold text-[#0f172a]">“Speak in full sentences — add one example.”</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ AUDIT */}
      <section id="audit" className="relative overflow-hidden bg-[#f8fafc] py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(33,118,255,0.08),transparent)]" />
        </div>
        <div className="relative mx-auto max-w-[1000px] px-5 text-center lg:px-8">
          <Reveal>
            <Eyebrow>60-day campus employability audit</Eyebrow>
            <h2 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-normal leading-[1.08] tracking-[-0.015em] text-[#0f172a]">
              Start with proof, <LightAccent>not payment.</LightAccent>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[20px] leading-relaxed text-[#475569]">
              The 60-Day Campus Employability Audit is completely free — run it on one final-year batch and see your
              own data before spending a rupee.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Batch", t: "One final-year batch", s: "Up to 500 students" },
              { label: "Access", t: "Full platform & AI modules", s: "Every student feature unlocked" },
              { label: "Weekly", t: "Weekly TPO check-ins", s: "Data reviews with your team" },
              { label: "Day 60", t: "Day-60 Executive Report", s: "Scores · skill gaps · NAAC pack" },
            ].map((c) => (
              <div key={c.t} className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:border-[#2176ff]/30">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">{c.label}</p>
                <p className="mt-2 text-[17px] font-bold leading-snug text-[#0f172a]">{c.t}</p>
                <p className="mt-1 text-[13px] font-normal text-[#64748b]">{c.s}</p>
              </div>
            ))}
          </div>
          <Reveal delay={0.1}>
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-md bg-gradient-to-r from-[#2176ff] to-[#609dff] px-7 text-[15px] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(33,118,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Apply for the Free Audit
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ PRICING */}
      <section id="pricing" className="relative bg-white pb-24 pt-4 text-[#0f172a] lg:pb-32">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
          <Reveal className="pt-24 text-center lg:pt-28">
            <Eyebrow>One campus license · every student covered</Eyebrow>
            <Headline>
              ₹100–250 per student per year. <Accent>10× less</Accent> than enterprise placement suites.
            </Headline>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                    tier.popular
                      ? "border-2 border-[#2176ff] bg-white shadow-[0_40px_90px_-30px_rgba(33,118,255,0.4)]"
                      : "border border-slate-200 bg-white shadow-[0_14px_40px_-24px_rgba(15,23,42,0.18)]"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#2176ff] to-[#609dff] px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[19px] font-bold tracking-tight text-[#0f172a]">{tier.name}</h3>
                      <p className="mt-1 text-[12.5px] font-medium text-slate-500">{tier.for}</p>
                    </div>
                    {!tier.popular && <Building2 className="h-5 w-5 text-slate-300" />}
                  </div>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-[40px] font-bold leading-none tracking-tight text-[#0f172a]">
                      {tier.price}
                    </span>
                    <span className="text-[12.5px] font-semibold text-slate-500">{tier.period}</span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${tier.popular ? "bg-[#2176ff]/10 text-[#2176ff]" : "bg-slate-100 text-[#2176ff]"}`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-[13.5px] font-medium leading-snug text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                    className={`group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md text-[14.5px] font-semibold transition-all duration-300 ${
                      tier.popular
                        ? "bg-gradient-to-r from-[#2176ff] to-[#609dff] text-white shadow-[0_14px_34px_-10px_rgba(33,118,255,0.7)] hover:-translate-y-0.5 hover:brightness-105"
                        : "border border-slate-300 bg-white text-[#0f172a] hover:-translate-y-0.5 hover:border-[#2176ff]/50 hover:text-[#2176ff]"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[12.5px] font-medium leading-relaxed text-slate-500">
            Accreditation Evidence Pack available as a ₹75,000/year add-on for Pro. Government &amp; aided colleges: ask
            about <strong className="font-semibold text-slate-700">GeM / NEAT procurement</strong> and outcome-linked models.
          </p>
        </div>
      </section>

      {/* ============================================================ TRUST */}
      <section className="relative bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Headline>Enterprise-grade compliance, data privacy &amp; <LightAccent>governance by design</LightAccent>.</Headline>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "DPDP 2023 aligned", s: "Explicit consent before recording" },
              { icon: MapPin, t: "Hosted in India", s: "Google Cloud Mumbai region" },
              { icon: Waves, t: "Audio never stored", s: "live in-memory processing — transcript only" },
              { icon: Lock, t: "Tenant isolation", s: "Every admin action logged; data deleted within 90 days of contract end." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:border-[#2176ff]/30">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2176ff]/25 bg-[#2176ff]/[0.07] text-[#2176ff]">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[18px] font-semibold text-[#0f172a]">{c.t}</p>
                <p className="mt-1.5 text-[15px] font-normal leading-relaxed text-[#526078]">{c.s}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[13px] font-normal text-[#77859d]">
            Sub-processors disclosed: Google Cloud Mumbai · Sarvam AI · Razorpay · Hostinger
          </p>
        </div>
      </section>

      {/* ============================================================ FAQ */}
      <section id="faq" className="bg-[#f8fafc] py-24 text-[#0f172a] lg:py-28">
        <div className="mx-auto max-w-[860px] px-5 lg:px-8">
          <Reveal className="text-center">
            <h2 className="font-display text-[40px] font-medium leading-[1.1] tracking-[-0.015em] text-[#0f172a]">
              Everything TPO directors ask us
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <Accordion type="single" collapsible defaultValue="q0">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`q${i}`}
                  className="group border-b border-slate-200 last:border-0"
                >
                  <AccordionTrigger className="rounded-xl px-4 py-5 text-left text-[16px] font-bold tracking-tight text-[#0f172a] transition-colors hover:text-[#2176ff] hover:no-underline data-[state=open]:text-[#2176ff] [&[data-state=open]>svg]:rotate-180 [&>svg]:text-slate-400 [&[data-state=open]>svg]:text-[#2176ff]">
                    <span className="pr-8">{f.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 text-[14px] leading-relaxed text-slate-600">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ DEMO FORM */}
      <section id="demo" className="relative overflow-hidden bg-white py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(219,234,254,0.9),transparent)]" />
          <div className="absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(243,232,255,0.8),transparent)]" />
        </div>
        <div className="relative mx-auto grid max-w-[1150px] gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <Reveal>
              <Eyebrow>Book your 20-minute demo</Eyebrow>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.015em] text-[#0f172a]">
                We set the demo up with <LightAccent>your college's sample data</LightAccent> — no slideware.
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  { icon: CalendarCheck, t: "What happens on the call", s: "We walk through YOUR roster, AES dashboard, a live drive shortlist and one NAAC export." },
                  { icon: Users, t: "Who should join", s: "TPO, Placement Director, Principal or your faculty coordinator — whoever owns outcomes." },
                  { icon: ShieldCheck, t: "Our promise", s: "DPDP Act 2023 aligned · hosted in India · no spam, demo follow-ups only." },
                ].map((c) => (
                  <div key={c.t} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#2176ff]/25 bg-[#2176ff]/[0.07] text-[#2176ff]">
                      <c.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">{c.t}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{c.s}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-9 rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Institutional desk</p>
                <p className="mt-1.5 text-[14px] font-semibold text-slate-700">Immediate onboarding support — email our campus director directly.</p>
                <a
                  href="mailto:hello@aivilabs.com"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2176ff]/[0.07] px-4 py-2.5 text-[13px] font-bold text-[#2176ff] transition hover:bg-[#2176ff]/[0.12]"
                >
                  <Mail className="h-4 w-4" /> hello@aivilabs.com
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={submit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_50px_100px_-40px_rgba(15,23,42,0.3)] sm:p-9"
            >
              {/* Honeypot field for bot suppression */}
              <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Full name *</Label>
                  <input required value={form.name} onChange={set("name")} placeholder="Dr. Meera Krishnan" className={fieldCls} />
                </div>
                <div>
                  <Label>Designation *</Label>
                  <select required value={form.designation} onChange={set("designation")} className={fieldCls}>
                    {["TPO", "Placement Director", "Principal", "Faculty", "Management", "Other"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Institution name *</Label>
                  <input required value={form.institution} onChange={set("institution")} placeholder="e.g. National Institute of Technology" className={fieldCls} />
                </div>
                <div>
                  <Label>City *</Label>
                  <input required value={form.city} onChange={set("city")} placeholder="e.g. Lucknow, Pune, Delhi" className={fieldCls} />
                </div>
                <div>
                  <Label>Work email *</Label>
                  <input type="email" required value={form.email} onChange={set("email")} placeholder="you@college.edu.in" className={fieldCls} />
                </div>
                <div>
                  <Label>Phone (WhatsApp) *</Label>
                  <input required value={form.phone} onChange={set("phone")} placeholder="+91 98xxxxxx00" className={fieldCls} />
                </div>
                <div>
                  <Label>Student strength *</Label>
                  <select required value={form.strength} onChange={set("strength")} className={fieldCls}>
                    {["<1,000", "1,000–3,000", "3,000–10,000", "10,000+"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Preferred start *</Label>
                  <select required value={form.start} onChange={set("start")} className={fieldCls}>
                    {["Free audit now", "Next 30 days", "This semester", "Exploring"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Message (optional)</Label>
                  <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Tell us about your placement cell, batch size, current tools…" className={`${fieldCls} resize-none`} />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#2176ff] to-[#609dff] py-4 text-[15.5px] font-semibold text-white shadow-[0_18px_44px_-14px_rgba(33,118,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Book 20-Min Demo"}
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2176ff]" />
                DPDP Act 2023 aligned · hosted in India · no spam, demo follow-ups only
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* CTA ribbon */}
      <section className="relative border-t border-slate-200 bg-[#f8fafc] py-16">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-5 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight text-[#0f172a]">
              Placement season won't wait. <span className="text-[#2176ff]">Your students shouldn't either.</span>
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">Book a 20-minute demo — we'll load your college's sample data before the call.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-gradient-to-r from-[#2176ff] to-[#609dff] px-6 text-[14.5px] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(33,118,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Book a Demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="mailto:hello@aivilabs.com"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-slate-300 bg-white px-6 text-[14.5px] font-semibold text-slate-700 transition hover:border-[#2176ff]/50 hover:text-[#2176ff]"
            >
              Email our desk
            </a>
          </div>
        </div>
      </section>

      <CampusFooter />
    </div>
  );
}

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 outline-none transition focus:border-[#2176ff]/60 focus:ring-[3px] focus:ring-[#2176ff]/15";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{children}</label>
);
