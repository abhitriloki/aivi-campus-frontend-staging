import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import AudienceSwitcher from "@/components/AudienceSwitcher";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  SearchCheck,
  Sparkles,
  ShieldCheck,
  Route,
  Mic,
  Trophy,
  Share2,
  Zap,
  Target,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const heroFloat = { duration: 6.5, repeat: Infinity, ease: "easeInOut" as const };

interface ModuleCard {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  bullets: string[];
  cta: string;
  link: string;
  accent: "coral" | "teal" | "navy" | "amber";
}

const modules: ModuleCard[] = [
  {
    icon: FileText,
    title: "1. Resume Studio",
    subtitle: "ATS-Optimized Resume Engine",
    tag: "Core Builder",
    description: "Build a high-impact, ATS-compliant resume from scratch or rebuild an existing one with AI guidance.",
    bullets: [
      "4 starting paths: Fresh, Rebuild, Tailor & Improve",
      "Instant ATS keyword density & formatting check",
      "One-click action verb & metric rewrites"
    ],
    cta: "Build Perfect Resume",
    link: "/ai-resume-builder",
    accent: "coral"
  },
  {
    icon: SearchCheck,
    title: "2. Job Fit Intelligence",
    subtitle: "JD vs Resume Match Engine",
    tag: "Match & Gap Map",
    description: "Compare your resume against any target Job Description and receive a precise percentage match score.",
    bullets: [
      "0–100% instant match quality score",
      "Missing critical skill & keyword radar",
      "Actionable gap-fix recommendations"
    ],
    cta: "Run Job Fit Analysis",
    link: "/job-fit-analysis-tool",
    accent: "teal"
  },
  {
    icon: Route,
    title: "3. Skill Gap Roadmap",
    subtitle: "30-Day Growth Intelligence",
    tag: "Skill Upgrade",
    description: "Identify exact technical and soft skill deficits for your desired role with structured learning steps.",
    bullets: [
      "Role-specific competency tree audit",
      "30-day prioritized learning milestones",
      "Recommended projects & verification tasks"
    ],
    cta: "Explore Skill Roadmap",
    link: "/career-gap-analysis-ai",
    accent: "navy"
  },
  {
    icon: Mic,
    title: "4. Vernacular Voice AI Mock Interview",
    subtitle: "Interactive Voice Practice",
    tag: "Hindi & Hinglish",
    description: "Practice technical and behavioral interview turns in Hindi, Hinglish, or English with instant voice feedback.",
    bullets: [
      "Practice in Hindi, Hinglish & English",
      "STAR framework structure scoring",
      "Real-time feedback on confidence & depth"
    ],
    cta: "Start Voice Practice",
    link: "/dashboard",
    accent: "amber"
  },
  {
    icon: Trophy,
    title: "5. Promotion & Growth Readiness",
    subtitle: "Internal Advancement Audit",
    tag: "Career Elevation",
    description: "Prepare for appraisals, internal role transitions, and senior leadership positioning with data-backed metrics.",
    bullets: [
      "Leadership impact & achievement framing",
      "Appraisal justification scorecard",
      "Seniority progression gap audit"
    ],
    cta: "Assess Growth Potential",
    link: "/dashboard",
    accent: "coral"
  },
  {
    icon: Share2,
    title: "6. LinkedIn & Portfolio Analyzer",
    subtitle: "Recruiter Reach Optimizer",
    tag: "Profile Visibility",
    description: "Turn your LinkedIn profile and GitHub portfolio into high-converting recruiter magnets.",
    bullets: [
      "Recruiter searchability & keyword audit",
      "High-converting headline & summary writer",
      "Project showcase & impact formatting"
    ],
    cta: "Optimize Profile",
    link: "/linkedin-optimization",
    accent: "teal"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    suffix: "forever",
    detail: "Discovery",
    features: [
      "Try all 6 modules",
      "Limited lifetime access",
      "Resume and Job Match preview",
      "Basic score breakdown",
      "See core AIVI workflow before upgrading",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Starter",
    price: "₹399",
    suffix: "/month",
    detail: "30-Day Free Trial for First 1000 Users",
    badge: "Beta Trial",
    features: [
      "30 analyses per month",
      "Full Skill Roadmap",
      "Interview Intelligence",
      "Promotion Readiness",
      "Portfolio Analyzer",
      "Resume Rewrite",
      "Version tracking",
      "Built for active job seekers",
    ],
    cta: "Start Starter Plan",
    featured: true,
  },
  {
    name: "Pro",
    price: "₹599",
    suffix: "/month",
    detail: "Advanced",
    features: [
      "Highest analysis limits (fair-use caps apply)",
      "Priority AI processing",
      "Advanced career insights",
      "Export reports (PDF)",
      "Mock interviews (coming soon)",
      "Premium support",
      "Everything in Starter, with deeper optimization",
    ],
    cta: "Go Pro",
    featured: false,
  },
];

const LandingConceptB = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#pricing") {
      setTimeout(() => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#112031]">
      <Helmet>
        <title>AIVI Career OS — AI Career Intelligence for Bharat</title>
        <meta
          name="description"
          content="Resume Studio, Job Fit Analysis, Vernacular Voice AI, and 6 AI Career Modules built for students, freshers, and professionals across India."
        />
        <meta property="og:title" content="AIVI Career OS — AI Career Intelligence for Bharat" />
        <meta property="og:description" content="Resume Studio, Job Fit Analysis, Vernacular Voice AI, and 6 AI Career Modules built for students, freshers, and professionals across India." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png?v=3" />
        <meta property="og:image:secure_url" content="/og-image.png?v=3" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIVI Career OS — AI Career Intelligence for Bharat" />
        <meta name="twitter:description" content="Resume Studio, Job Fit Analysis, Vernacular Voice AI, and 6 AI Career Modules built for students, freshers, and professionals across India." />
        <meta name="twitter:image" content="/og-image.png?v=3" />
      </Helmet>

      <GlobalHeader />
      <main className="overflow-x-hidden">
        {/* HERO SECTION WITH RICH PEACH/CORAL BACKDROP */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFDF8_0%,#FFF4EE_42%,#F4FAF9_100%)] pt-4 sm:pt-6 pb-6 sm:pb-8 border-b border-[#E6ECEF]">
          {/* Ambient Glow Orbs */}
          <div className="absolute -left-20 top-4 h-72 w-72 rounded-full bg-[#FF8A63]/14 blur-3xl pointer-events-none" />
          <div className="absolute right-[-3rem] top-2 h-80 w-80 rounded-full bg-[#57CEC2]/14 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
                {/* Top Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <AudienceSwitcher variant="light" />
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD5C8] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF6D4A] shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" /> AI Co-Pilot for Bharat
                  </div>
                </div>

                <h1 className="font-sans text-3xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#112031] sm:text-5xl lg:text-[3.8rem]">
                  Your best resume.<br />For the <span className="text-[#FF6D4A]">right job.</span><br />Every time.
                </h1>
                
                <p className="mt-2.5 max-w-lg text-sm sm:text-base leading-6 sm:leading-7 text-[#5D6C79]">
                  Resume Studio. Job Fit Analysis. One-click JD-based rebuild. Vernacular Voice AI. Everything you need to get more interviews.
                </p>

                {/* Primary CTA Buttons (Always Above the Fold) */}
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(255,109,74,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF7A5B] w-full sm:w-auto">
                    Build My Perfect Resume <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/job-fit-analysis-tool" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-5 py-3.5 text-sm font-semibold text-[#112031] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9CD9D1] w-full sm:w-auto">
                    Try Job Fit Analysis <BriefcaseBusiness className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-2.5 text-xs font-semibold text-[#64727E]">
                  For final-year students, freshers &amp; working professionals — Hindi, Hinglish &amp; English.
                </p>
              </motion.div>

              {/* Right Column: Interactive Hero Mock UI */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-[38rem]">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ ...heroFloat, duration: 5.8 }} className="hidden sm:block absolute right-6 top-0 z-20 w-[11.5rem] rotate-[6deg] rounded-[1.8rem] border border-[#DBF0EC] bg-white p-3.5 shadow-lg">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7B8B95]">Job Fit Score</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[conic-gradient(#1BAA9D_0deg,#1BAA9D_331deg,#DFF1EE_331deg)]">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-[#112031]">92%</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#112031]">Excellent Match</p>
                      <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-[#E7F4F2]">
                        <div className="h-full w-[92%] rounded-full bg-[#24B7A9]" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 8, 0], rotate: [-8, -6, -8] }} transition={{ ...heroFloat, duration: 6.4 }} className="relative z-10 mt-6 sm:mt-14 mx-auto w-full max-w-[17.5rem] sm:max-w-none sm:w-[18rem] rounded-[1.8rem] bg-[#0F172A] p-4 text-white shadow-xl">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">One-Click Rebuild</div>
                  <p className="mt-3 text-xs leading-5 text-[#C9E2E4]">Generate a tailored resume for the job instantly.</p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#9BC6CA]">Loaded from Job Fit</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Roadmapping", "SQL", "Stakeholder Alignment"].map((chip) => (
                        <span key={chip} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[#EAF6F5]">{chip}</span>
                      ))}
                    </div>
                  </div>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF6D4A] px-3.5 py-2.5 text-xs font-semibold text-white">
                    Rebuild for This JD <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>

                <motion.div animate={{ y: [0, -6, 0], rotate: [5, 3, 5] }} transition={{ ...heroFloat, duration: 7 }} className="hidden sm:block absolute bottom-2 right-0 z-10 w-[13rem] rounded-[1.6rem] border border-[#DCE9E7] bg-white p-3.5 shadow-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7B8B95]">Missing Keywords</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Roadmapping", "Stakeholder Alignment", "A/B Testing", "SQL", "Analytics"].map((chip) => (
                      <span key={chip} className="rounded-full border border-[#D5EDEA] bg-[#F3FBFA] px-2.5 py-0.5 text-[10px] font-semibold text-[#158B80]">{chip}</span>
                    ))}
                  </div>
                </motion.div>

                {/* Candidate Mock Card */}
                <div className="hidden sm:block absolute left-8 top-[3.5rem] z-30 w-[11rem] rounded-[1.3rem] border border-[#E6EFF0] bg-white px-3 py-2 shadow-md">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7F8F98]">Candidate</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#112031]">Aman Verma</p>
                  <p className="text-[11px] text-[#6C7B86]">Product Analyst, Noida</p>
                  <div className="mt-2 flex gap-1 text-[9px] font-semibold text-[#4E6C7A]">
                    <span className="rounded-full bg-[#EFFAFA] px-2 py-0.5">Experience</span>
                    <span className="rounded-full bg-[#FFF0EC] px-2 py-0.5">Analytics</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Trust Chips Strip */}
            <motion.div {...fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#E6ECEF] bg-white px-4 py-2.5 shadow-xs">
              {["DPDP-aligned", "Data hosted in India", "Audio never stored", "DPIIT-recognized startup"].map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-[#5D6C79]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#169C8F]" />
                  {chip}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 6-MODULE FULL FEATURE SHOWCASE GRID */}
        <section className="bg-white py-8 sm:py-14 border-b border-[#E6ECEF]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF8C6B]">Complete Career Operating System</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#112031] sm:text-5xl">
                6 Powerful AI Modules. <span className="text-[#24B7A9]">One Co-Pilot.</span>
              </h2>
              <p className="mt-2.5 text-xs sm:text-base text-[#64727E] max-w-xl mx-auto">
                Everything you need to move from blind job applications to focused, high-conversion career growth.
              </p>
            </motion.div>

            {/* 6 Module Cards Grid */}
            <div className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod, index) => {
                const IconComponent = mod.icon;
                return (
                  <motion.div
                    key={mod.title}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className="flex flex-col justify-between rounded-[2rem] border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
                  >
                    <div>
                      {/* Top Tag & Icon */}
                      <div className="flex items-center justify-between">
                        <div className={`rounded-2xl p-3.5 ${
                          mod.accent === "coral" ? "bg-[#FFF0EB] text-[#FF6D4A]" :
                          mod.accent === "teal" ? "bg-[#EFFBFA] text-[#169C8F]" :
                          mod.accent === "amber" ? "bg-[#FFFBEB] text-[#D97706]" :
                          "bg-[#F1F5F9] text-[#0F172A]"
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {mod.tag}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-bold tracking-tight text-[#112031]">{mod.title}</h3>
                      <p className="text-xs font-semibold text-[#169C8F] mt-0.5">{mod.subtitle}</p>
                      <p className="mt-2.5 text-sm leading-6 text-[#64727E]">{mod.description}</p>

                      {/* Bullets */}
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3.5">
                        {mod.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-start gap-2 text-xs text-[#52606D]">
                            <Check className="h-4 w-4 shrink-0 text-[#169C8F] mt-0.5" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-slate-100">
                      <Link
                        to={mod.link}
                        className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white group-hover:bg-[#FF6D4A] transition-colors"
                      >
                        <span>{mod.cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Product Fact Strip */}
            <motion.div {...fadeUp} className="mt-10 rounded-2xl border border-slate-800 bg-[#0F172A] p-4 sm:p-5 text-center text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
                <Zap className="h-4 w-4 text-[#38BDF8]" />
                <span>6 Career Modules</span>
                <span className="text-slate-500">•</span>
                <span>ATS + JD Analysis</span>
                <span className="text-slate-500">•</span>
                <span>Vernacular Voice AI (Hindi &amp; English)</span>
                <span className="text-slate-500">•</span>
                <span>PDF Reports</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#34D399]">DPDP 2023 Aligned</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3-STEP REBUILD WORKFLOW SECTION */}
        <section className="bg-[#FAFBFD] py-8 sm:py-14 border-b border-[#E6ECEF]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF8C6B]">Simple 3-Step Workflow</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#112031] sm:text-4xl">
                How AIVI Rebuilds Your Application
              </h2>
            </motion.div>

            <div className="mt-8 sm:mt-10 grid gap-6 md:grid-cols-3">
              <motion.div {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#FFF0EB] text-[#FF6D4A] flex items-center justify-center font-bold text-lg">1</div>
                <h3 className="text-lg font-bold text-[#112031]">Input Resume &amp; Target JD</h3>
                <p className="text-xs text-[#64727E] leading-relaxed">
                  Upload your existing resume PDF or text, alongside the target job description you want to apply for.
                </p>
              </motion.div>

              <motion.div {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#EFFBFA] text-[#169C8F] flex items-center justify-center font-bold text-lg">2</div>
                <h3 className="text-lg font-bold text-[#112031]">Instant Gap &amp; ATS Audit</h3>
                <p className="text-xs text-[#64727E] leading-relaxed">
                  AIVI evaluates keyword density, formatting compliance, missing technical skills, and overall fit score.
                </p>
              </motion.div>

              <motion.div {...fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold text-lg">3</div>
                <h3 className="text-lg font-bold text-[#112031]">1-Click Tailored Rebuild</h3>
                <p className="text-xs text-[#64727E] leading-relaxed">
                  Export a clean ATS-optimized PDF resume pre-tailored to pass recruiter screeners and land interviews.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="bg-white py-8 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF8C6B]">Fair pricing. Big impact.</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#112031] sm:text-5xl">Plans for every ambition</h2>
            </motion.div>

            <div className="mt-12 grid gap-6 xl:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`relative rounded-[2rem] border p-8 ${
                    plan.featured
                      ? "border-[#20B8AB] bg-white shadow-md"
                      : "border-[#ECE8DF] bg-white shadow-xs"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25C3B5] px-4 py-1.5 text-xs font-semibold text-[#0E2332]">
                      {plan.badge}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#112031]">{plan.name}</h3>
                      <p className="mt-1 text-sm text-[#74818B]">{plan.detail}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-[-0.05em] text-[#112031]">{plan.price}</span>
                    <span className="pb-1 text-sm text-[#74818B]">{plan.suffix}</span>
                  </div>

                  <div className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className={`mt-1 h-4 w-4 shrink-0 ${plan.featured ? "text-[#17AF9F]" : "text-[#1BAA9D]"}`} />
                        <span className="text-sm leading-7 text-[#5D6C79]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/dashboard"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                      plan.featured
                        ? "bg-[#25C3B5] text-[#0C2230] hover:bg-[#1CA89C]"
                        : "border border-[#E3E7EB] bg-white text-[#112031] hover:bg-[#F8FAFB]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
};

export default LandingConceptB;
