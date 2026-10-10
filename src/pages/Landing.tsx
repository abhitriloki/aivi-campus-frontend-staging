export { default } from "./LandingConceptB";
/*
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import AiviLogo from "@/components/AiviLogo";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  FileSpreadsheet,
  LineChart,
  Mic,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const heroMetrics = [
  { label: "Resume creation and rebuild paths", value: "4" },
  { label: "JD-tailoring actions preloaded", value: "1 click" },
  { label: "Job fit scoring and gap views", value: "Instant" },
];

const trustedCompanies = [
  {
    name: "Google",
    render: () => <span className="text-[1.9rem] font-medium tracking-[-0.05em] text-[#737373]">Google</span>,
  },
  {
    name: "Microsoft",
    render: () => (
      <span className="flex items-center gap-2 text-[1.55rem] font-medium tracking-[-0.04em] text-[#737373]">
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="h-2.5 w-2.5 bg-[#8A8A8A]" />
          <span className="h-2.5 w-2.5 bg-[#8A8A8A]" />
          <span className="h-2.5 w-2.5 bg-[#8A8A8A]" />
          <span className="h-2.5 w-2.5 bg-[#8A8A8A]" />
        </span>
        Microsoft
      </span>
    ),
  },
  {
    name: "Amazon",
    render: () => (
      <span className="relative text-[1.85rem] font-semibold lowercase tracking-[-0.05em] text-[#737373]">
        amazon
        <span className="absolute left-[0.2rem] top-[1.6rem] h-[2px] w-[3.2rem] rounded-full bg-[#8A8A8A] before:absolute before:right-[-1px] before:top-[-2px] before:h-0 before:w-0 before:border-y-[4px] before:border-l-[6px] before:border-y-transparent before:border-l-[#8A8A8A] before:content-['']" />
      </span>
    ),
  },
  {
    name: "Meta",
    render: () => (
      <span className="flex items-center gap-2 text-[1.65rem] font-medium tracking-[-0.05em] text-[#737373]">
        <span className="relative h-4 w-7">
          <span className="absolute left-0 top-0 h-4 w-3.5 rounded-[999px] border-2 border-[#8A8A8A]" />
          <span className="absolute right-0 top-0 h-4 w-3.5 rounded-[999px] border-2 border-[#8A8A8A]" />
        </span>
        Meta
      </span>
    ),
  },
  {
    name: "TCS",
    render: () => (
      <span className="flex items-center gap-2 text-[#737373]">
        <span className="text-[1.9rem] font-semibold lowercase tracking-[-0.06em]">tcs</span>
        <span className="max-w-[4.4rem] text-left text-[0.48rem] font-semibold uppercase leading-[1.05] tracking-[0.08em] text-[#8A8A8A]">
          Tata Consultancy Services
        </span>
      </span>
    ),
  },
  {
    name: "Deloitte",
    render: () => <span className="text-[1.7rem] font-semibold tracking-[-0.05em] text-[#737373]">Deloitte.</span>,
  },
  {
    name: "EY",
    render: () => (
      <span className="relative flex items-center text-[#737373]">
        <span className="absolute -top-2 left-1 h-[5px] w-7 -skew-x-[28deg] bg-[#8A8A8A]" />
        <span className="text-[1.95rem] font-bold tracking-[-0.08em]">EY</span>
      </span>
    ),
  },
  {
    name: "Adobe",
    render: () => (
      <span className="flex items-center gap-2 text-[1.45rem] font-medium tracking-[-0.04em] text-[#737373]">
        <span className="relative h-5 w-5 overflow-hidden">
          <span className="absolute left-0 top-0 h-full w-[45%] skew-x-[-18deg] bg-[#8A8A8A]" />
          <span className="absolute right-0 top-0 h-full w-[45%] skew-x-[18deg] bg-[#8A8A8A]" />
          <span className="absolute left-[38%] top-[42%] h-[2px] w-[24%] bg-[#F7F1E8]" />
        </span>
        Adobe
      </span>
    ),
  },
];

const coreJourney = [
  {
    title: "Resume Studio",
    description:
      "Create a first resume, improve an existing one, tailor for a role, or run a full rebuild with AI guidance and controlled editing paths.",
  },
  {
    title: "Job Fit Intelligence",
    description:
      "Upload a resume and JD, measure match quality, identify real gaps, surface missing keywords, and understand what can be fixed through tailoring.",
  },
  {
    title: "One-click JD Rebuild",
    description:
      "Move directly from analysis into Resume Studio with role context, rewrite suggestions, and section priorities already loaded from Job Fit.",
  },
];

const modules: { icon: LucideIcon; title: string; detail: string; stat: string; featured?: boolean }[] = [
  {
    icon: FileText,
    title: "Resume Studio",
    detail: "Give users four clear starting paths: create first resume, improve existing resume, tailor for a role, or run a full rebuild from scratch.",
    stat: "Primary conversion workflow",
    featured: true,
  },
  {
    icon: Target,
    title: "Job Fit Intelligence",
    detail: "Turn every JD into a score, a gap map, and a rebuild opportunity by showing exactly where the resume matches, where it fails, and what to change next.",
    stat: "Primary conversion workflow",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "JD-Based Rebuild Bridge",
    detail: "Connect Job Fit results directly to Resume Studio so the user can rebuild for the exact role without starting over or re-entering context.",
    stat: "Signature product bridge",
  },
  {
    icon: Route,
    title: "Skill Roadmap",
    detail: "Turn missing competencies into 30/60/90-day growth plans aligned to your desired next role.",
    stat: "Gap-to-growth planning",
  },
  {
    icon: Mic,
    title: "Interview Intelligence",
    detail: "Generate role-aware questions, answer structures, and preparation pathways from your actual profile context.",
    stat: "Role-specific prep system",
  },
  {
    icon: TrendingUp,
    title: "Promotion Readiness",
    detail: "Assess how your current achievements map to the next level and where your advancement narrative is weak.",
    stat: "Internal mobility analysis",
  },
];

const userPaths = [
  {
    heading: "For first-time resume builders",
    text: "Freshers and students can start with guided inputs, projects, education, and goals instead of being forced to upload a resume they do not have yet.",
  },
  {
    heading: "For active job seekers",
    text: "Professionals with an existing resume can measure fit against a real JD, see what is missing, and rebuild specifically for the role they are applying to.",
  },
  {
    heading: "For ambitious professionals",
    text: "Experienced users can optimize for stronger positioning, internal growth, leadership narratives, and sharper application quality across multiple role targets.",
  },
];

const proofSignals = [
  {
    label: "Resume paths",
    value: "Create, improve, tailor, rebuild",
  },
  {
    label: "Job Fit output",
    value: "Score, gaps, keywords, next actions",
  },
  {
    label: "Signature bridge",
    value: "One-click JD to Resume Studio handoff",
  },
];

const tractionStats = [
  { value: "50,000+", label: "Professionals trust AIVI", icon: Clock3 },
  { value: "1M+", label: "Resumes analyzed", icon: FileSpreadsheet },
  { value: "90%", label: "Users improve their score", icon: Sparkles },
  { value: "4.8/5", label: "Average user rating", icon: Trophy },
];

const testimonials = [
  {
    quote: "AIVI helped me increase my job match score from 55% to 89% and land my dream role.",
    name: "Neha Sharma",
    title: "Product Manager",
  },
  {
    quote: "The roadmap and interview prep gave me the confidence to crack multiple interviews.",
    name: "Rohit Verma",
    title: "Software Engineer",
  },
  {
    quote: "My LinkedIn profile optimization brought 3x more recruiter views in 2 weeks.",
    name: "Ankit Singh",
    title: "Data Analyst",
  },
];

const pricingPlans = [
  {
    name: "Discovery",
    price: "₹0",
    subtitle: "Start with structured visibility into your resume and career positioning.",
    features: [
      "Core diagnostic previews",
      "Limited lifetime usage",
      "Job fit and resume insight access",
      "Upgrade when active search begins",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Starter",
    price: "₹399",
    subtitle: "For active job seekers ready to move from insight to action.",
    features: [
      "30 analyses each month",
      "Resume rebuild and tailoring workflows",
      "Full roadmaps and interview preparation",
      "Priority access to strategic optimization tools",
    ],
    cta: "Start Starter",
    featured: true,
  },
  {
    name: "Pro",
    price: "₹599",
    subtitle: "For ambitious professionals managing multiple role targets and deeper optimization loops.",
    features: [
      "Unlimited strategic analyses",
      "Advanced optimization access",
      "Versioning and export-focused workflow",
      "Highest-value career intelligence stack",
    ],
    cta: "Go Pro",
    featured: false,
  },
];

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#pricing") {
      setTimeout(() => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background dark">
      <GlobalHeader />
      <main className="overflow-x-hidden">
        <section className="relative overflow-hidden border-b border-[#E4D7C7] bg-[linear-gradient(180deg,#FBF7F0_0%,#F7F1E8_48%,#F3E8D8_100%)] pt-32 text-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(28,107,104,0.12),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(221,181,107,0.26),transparent_24%),radial-gradient(circle_at_50%_72%,rgba(70,166,157,0.10),transparent_32%)]" />
          <div className="hero-grid absolute inset-0 opacity-20" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DDB56B]/50 to-transparent" />
          <div className="absolute left-[-5rem] top-24 h-64 w-64 rounded-full bg-[#68B7AE]/16 blur-3xl" />
          <div className="absolute right-[-4rem] top-10 h-72 w-72 rounded-full bg-[#E6C37B]/24 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#D9C7B2] bg-white/70 px-4 py-2 text-sm text-[#43505B] shadow-[0_14px_34px_-24px_rgba(16,24,32,0.35)] backdrop-blur">
                <AiviLogo size={18} className="text-[#101820]" />
                Resume Studio + Job Fit Intelligence in one system
              </div>

              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.03em] text-[#101820] sm:text-6xl lg:text-7xl">
                Build the <span className="text-[#DDB56B]">right resume</span> for the exact job you want
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#55616B] sm:text-xl">
                Create a first resume, improve an existing one, measure job fit against any JD, and rebuild strategically with missing keywords and rewrite actions already loaded.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#B5965A] px-7 py-4 text-sm font-semibold text-[#101820] shadow-[0_24px_60px_-28px_rgba(181,150,90,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C6A66A]"
                >
                  Start Resume Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#methodology"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#CBB89F] bg-white/75 px-7 py-4 text-sm font-semibold text-[#101820] transition-colors hover:bg-white"
                >
                  See How Job Fit Works
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {heroMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 * index + 0.35, duration: 0.55 }}
                    className="rounded-2xl border border-[#DDCFBF] bg-white/72 px-4 py-5 shadow-[0_18px_40px_-28px_rgba(16,24,32,0.3)] backdrop-blur"
                  >
                    <p className="text-3xl font-semibold tracking-tight text-[#E4C486]">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5C6871]">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative rounded-[2.2rem] border border-[#E2D4C5] bg-white/80 p-5 shadow-[0_36px_90px_-46px_rgba(16,24,32,0.35)] backdrop-blur">
                <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-[#60B7AC]/18 blur-2xl" />
                <div className="absolute -right-6 top-24 h-28 w-28 rounded-full bg-[#E6C37B]/22 blur-2xl" />
                <div className="relative rounded-[1.7rem] border border-[#E8DED2] bg-[linear-gradient(180deg,#FFFDF9_0%,#FCF7EF_100%)] p-4 text-[#121A21]">
                  <div className="mb-5 flex items-center justify-between rounded-[1.25rem] border border-[#EEE4D7] bg-white px-4 py-3 shadow-[0_14px_30px_-24px_rgba(16,24,32,0.2)]">
                    <div className="flex items-center gap-3">
                      <AiviLogo size={22} className="text-[#101820]" />
                      <div>
                        <p className="text-sm font-semibold tracking-wide">AIVI / Career Intelligence OS</p>
                        <p className="text-xs text-[#69737C]">Resume Studio and JD optimization workspace</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-[#E8DDD0] px-3 py-1 text-xs font-semibold text-[#1C6B68]">
                      Live tailoring preview
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[1.6rem] border border-[#1A232A] bg-[linear-gradient(180deg,#101820_0%,#16212A_100%)] p-5 text-[#F4EFE7] shadow-[0_28px_70px_-40px_rgba(16,24,32,0.7)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-[#9EAAB3]">Resume Studio</p>
                          <h2 className="mt-3 font-display text-3xl leading-none">
                            Build. Compare. Rebuild for the JD.
                          </h2>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3">
                          <Sparkles className="h-5 w-5 text-[#B5965A]" />
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Resume Score", value: "82" },
                          { label: "JD Match", value: "88" },
                          { label: "Missing Keywords", value: "12" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/6 p-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-[#8F9CA7]">{item.label}</p>
                            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#C8D0D6]">Tailoring actions ready to apply</span>
                          <span className="font-semibold text-[#F4EFE7]">9 rewrites</span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "74%" }}
                            transition={{ duration: 1.3, delay: 0.7 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#1C6B68] to-[#B5965A]"
                          />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-[#8F9CA7]">Selected mode</p>
                            <p className="mt-1 text-lg font-semibold">Targeted Tailor for Product Manager JD</p>
                          </div>
                          <LineChart className="h-7 w-7 text-[#B5965A]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[1.45rem] border border-[#E1D2C1] bg-white p-4 shadow-[0_18px_40px_-28px_rgba(16,24,32,0.22)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-[#E7F1EF] p-3 text-[#1C6B68]">
                              <Target className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Job Fit Intelligence</p>
                              <p className="text-xs text-[#69737C]">Gap-aware JD scoring</p>
                            </div>
                          </div>
                          <span className="text-2xl font-semibold text-[#1C6B68]">88%</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          {["Target role parsed", "Critical gaps identified", "Resume tailoring ready"].map((line) => (
                            <div key={line} className="flex items-center gap-2 text-sm text-[#34404A]">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#1C6B68]" />
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.45rem] border border-[#E3D4BD] bg-[linear-gradient(180deg,#FFF7E8_0%,#F8EBCF_100%)] p-4 shadow-[0_18px_40px_-28px_rgba(181,150,90,0.38)]">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#69737C]">One-click next move</p>
                        <p className="mt-3 font-display text-3xl text-[#101820]">Rebuild your resume for this JD</p>
                        <p className="mt-3 text-sm leading-6 text-[#48545E]">
                          Open Resume Studio with missing keywords, bullet rewrites, target role context, and section priorities already prefilled from Job Fit.
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#101820]">
                          Launch Resume Studio
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="rounded-[1.45rem] border border-[#D6DCE0] bg-[linear-gradient(180deg,#F1FBF9_0%,#E3F2EF_100%)] p-4 shadow-[0_18px_40px_-28px_rgba(28,107,104,0.2)]">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#5F6C76]">Missing keyword cluster</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {["Roadmapping", "Stakeholder Alignment", "SQL", "Experimentation", "Analytics"].map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-[#B8D5CF] bg-white/80 px-3 py-1 text-xs font-semibold text-[#1C6B68]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="absolute -bottom-10 left-10 hidden max-w-[15rem] rounded-[1.4rem] border border-[#E2D4C4] bg-white/88 p-4 text-[#101820] shadow-[0_22px_50px_-30px_rgba(16,24,32,0.28)] backdrop-blur xl:block"
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 className="h-4 w-4 text-[#B5965A]" />
                  Resume impact
                </div>
                <p className="text-3xl font-semibold text-[#B5965A]">+18%</p>
                <p className="mt-1 text-sm leading-6 text-[#5A6771]">
                  projected shortlist lift after JD-based tailoring from Job Fit results.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border/50 bg-[#F7F1E8] py-8">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#9C7A3B]">
                Trusted by professionals from top companies
              </p>
              <div className="mt-6 grid grid-cols-2 gap-6 text-center sm:grid-cols-4 lg:grid-cols-8">
                {trustedCompanies.map((company) => (
                  <div
                    key={company.name}
                    className="flex min-h-[3.75rem] items-center justify-center"
                  >
                    {company.render()}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="methodology" className="border-b border-border/50 bg-background py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
                  Core workflow
                </p>
                <h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.96] tracking-[-0.03em] text-foreground">
                  The first experience should answer one question: how do I get the right resume for this job?
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                AIVI’s strongest loop starts with Resume Studio, sharpens with Job Fit Intelligence, and closes with a JD-based rebuild path that turns analysis into an immediate next step.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {coreJourney.map((step, index) => (
                <motion.div
                  key={step.title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-[1.75rem] border border-border bg-card p-7 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
                      Step {index + 1}
                    </span>
                    <div className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                      Core USP
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F1E8] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#B5965A]">
                Conversion engines
              </p>
              <h2 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.03em] text-[#101820]">
                Powerful intelligence. Real career impact.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#55616B]">
                AIVI combines Resume Studio, Job Fit, and focused career systems to show users where they stand and what to do next.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={`group rounded-[1.75rem] border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${
                    module.featured
                      ? "border-[#D8C8B0] bg-[#FFFDF9]"
                      : "border-[#E2D6C6] bg-[#FFFDF9]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-[1.15rem] p-3 ${module.featured ? "bg-[#1C6B68] text-[#F8F3EB]" : "bg-[#E8F2F0] text-[#1C6B68]"}`}>
                      <module.icon className="h-5 w-5" />
                    </div>
                    <span className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6B34]">
                      {module.stat}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#101820]">{module.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#4D5963]">{module.detail}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1C6B68]">
                    Explore feature
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="mt-10 grid gap-px overflow-hidden rounded-[1.8rem] border border-[#1A222A] bg-[#1A222A] lg:grid-cols-4"
            >
              {tractionStats.map((item) => (
                <div key={item.label} className="bg-[#101820] px-6 py-6 text-[#F4EFE7]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#123438] text-[#DDB56B] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-4xl font-semibold tracking-tight text-[#DDB56B]">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[#C0C8CE]">{item.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp}
              className="grid gap-8 rounded-[2.25rem] border border-border bg-card p-8 shadow-card lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="rounded-[1.8rem] bg-[#101820] p-8 text-[#F4EFE7] shadow-elevated">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9FB1B7]">Built for real starting points</p>
                <h2 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.03em]">
                  The product should work whether the user has nothing, something, or a specific JD in hand
                </h2>
                <p className="mt-5 max-w-md text-base leading-8 text-[#C3CBD0]">
                  AIVI is strongest when it adapts to the user’s actual situation instead of forcing everyone into the same upload-and-generate flow.
                </p>

                <div className="mt-10 space-y-4">
                  {proofSignals.map((signal) => (
                    <div key={signal.label} className="rounded-[1.3rem] border border-white/8 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#92A1AA]">{signal.label}</p>
                      <p className="mt-2 text-lg font-semibold leading-7 text-[#F4EFE7]">{signal.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                {userPaths.map((item, index) => (
                  <motion.div
                    key={item.heading}
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    className="rounded-[1.75rem] border border-border bg-background p-7 shadow-card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground">{item.heading}</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#F7F1E8] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              {...fadeUp}
              className="rounded-[2.2rem] border border-[#1D252C] bg-[#101820] p-8 text-[#F4EFE7] shadow-elevated"
            >
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr_1.05fr_1.05fr]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4AB61]">
                    Real people. Real results.
                  </p>
                  <h2 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.03em]">
                    Careers transformed with AIVI
                  </h2>
                  <p className="mt-5 max-w-xs text-base leading-8 text-[#C3CBD0]">
                    See how professionals used Resume Studio, Job Fit, and targeted guidance to improve the quality of their applications.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8FD1C7]">
                    Read more stories
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {testimonials.map((item) => (
                  <div key={item.name} className="rounded-[1.6rem] border border-white/8 bg-white/5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9D1C7] text-sm font-semibold text-[#101820]">
                        {item.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F4EFE7]">{item.name}</p>
                        <p className="text-xs text-[#AEB7BD]">{item.title}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-lg leading-8 text-[#F4EFE7]">
                      “{item.quote}”
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="border-y border-border/50 bg-[#F7F1E8] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#B5965A]">Pricing</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.96] tracking-[-0.03em] text-[#101820]">
                Start with diagnostics. Upgrade when you want tailored execution.
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#55616B]">
                The pricing model should make it easy to explore Resume Studio and Job Fit first, then unlock deeper rebuild, tailoring, and repeat optimization workflows when the search becomes active.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 xl:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className={`rounded-[2rem] border p-8 shadow-card ${plan.featured ? "border-[#B5965A] bg-[#101820] text-[#F4EFE7] shadow-elevated" : "border-[#E2D6C6] bg-[#FFFDF9] text-[#101820]"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                    {plan.featured && (
                      <span className="rounded-full bg-[#B5965A]/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#E8C98B]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                    <span className={`pb-1 text-sm ${plan.featured ? "text-[#B6C0C6]" : "text-[#66727A]"}`}>
                      / month
                    </span>
                  </div>
                  <p className={`mt-4 text-sm leading-7 ${plan.featured ? "text-[#C6CDD1]" : "text-[#55616B]"}`}>
                    {plan.subtitle}
                  </p>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className={`mt-1 h-4 w-4 shrink-0 ${plan.featured ? "text-[#DDB56B]" : "text-[#1C6B68]"}`} />
                        <span className={`text-sm leading-7 ${plan.featured ? "text-[#E2E7EA]" : "text-[#55616B]"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/dashboard"
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                      plan.featured
                        ? "bg-[#B5965A] text-[#101820] hover:-translate-y-0.5 hover:bg-[#C6A66A]"
                        : "border border-[#D8C8B0] bg-[#B5965A]/12 text-[#101820] hover:bg-[#B5965A]/18"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              {...fadeUp}
              className="overflow-hidden rounded-[2.25rem] border border-border bg-gradient-to-r from-[#101820] via-[#152028] to-[#1A242B] px-8 py-14 text-center text-[#F4EFE7] shadow-elevated sm:px-14"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9FB1B7]">
                Strategic next step
              </p>
              <h2 className="mx-auto mt-5 max-w-4xl font-display text-5xl leading-[0.96] tracking-[-0.03em]">
                Start with your resume, bring a JD, and let AIVI show you exactly what to fix next
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#C3CBD0]">
                Whether you are creating a first resume, improving an old one, or tailoring for a role, the fastest value in AIVI comes from the Resume Studio and Job Fit workflow working together.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#B5965A] px-7 py-4 text-sm font-semibold text-[#101820] shadow-[0_24px_60px_-28px_rgba(181,150,90,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C6A66A]"
                >
                  Open Resume Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/job-fit-analysis-tool"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#B5965A]/35 bg-[#B5965A]/12 px-7 py-4 text-sm font-semibold text-[#F4EFE7] transition-colors hover:bg-[#B5965A]/18"
                >
                  Analyze Job Fit
                  <BriefcaseBusiness className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Landing;
*/
