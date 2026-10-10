import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AiviLogo from "@/components/AiviLogo";
import { ArrowRight, BriefcaseBusiness, SearchCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  rightTitle?: string;
  rightSubtitle?: string;
  metricLabel?: string;
  metricValue?: string;
  metricCaption?: string;
};

const workflowPoints = [
  { icon: BriefcaseBusiness, label: "Resume Studio", detail: "Create, tailor, and rebuild faster." },
  { icon: SearchCheck, label: "Job Fit", detail: "Turn every JD into a gap map." },
  { icon: Sparkles, label: "Career Signal", detail: "Move from guesswork to clarity." },
];

const AuthShell = ({
  eyebrow,
  title,
  description,
  children,
  rightTitle = "Resume fit. Market signal. Career momentum.",
  rightSubtitle = "AIVI helps ambitious professionals move from resume edits to job-ready positioning in one connected workflow.",
  metricLabel = "Live readiness view",
  metricValue = "92%",
  metricCaption = "Typical clarity lift after diagnosis and targeted resume improvement.",
}: AuthShellProps) => {
  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#112031]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-4rem] top-24 h-80 w-80 rounded-full bg-[#5ED0C5]/18 blur-3xl" />
        <div className="absolute right-[-5rem] top-16 h-96 w-96 rounded-full bg-[#FFB198]/22 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-[#84E2DA]/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-8 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto w-full max-w-xl"
          >
            <Link to="/" className="inline-flex items-center gap-3 rounded-full border border-[#E3ECEB] bg-white/92 px-4 py-3 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <div className="rounded-2xl border border-[#E5E8EC] bg-white p-2 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.22)]">
                <AiviLogo size={22} className="text-[#D59C45]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-semibold leading-none tracking-tight text-[#112031]">AIVI</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#7E8A94]">Career Intelligence OS</span>
              </div>
            </Link>

            <div className="mt-8 rounded-[2rem] border border-[#E6ECEE] bg-white/86 p-7 shadow-[0_24px_60px_-34px_rgba(17,32,49,0.16)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF8C6B]">{eyebrow}</p>
              <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#112031] sm:text-[2.9rem]">{title}</h1>
              <p className="mt-4 max-w-lg text-base leading-8 text-[#5D6C79]">{description}</p>
              <div className="mt-8">{children}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-[2.4rem] border border-[#E4ECEA] bg-[linear-gradient(180deg,#FFFDF9_0%,#F4FBFB_100%)] p-7 shadow-[0_30px_80px_-34px_rgba(17,32,49,0.22)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(66,198,188,0.15),transparent_26%),radial-gradient(circle_at_86%_14%,rgba(255,112,73,0.16),transparent_24%),radial-gradient(circle_at_62%_72%,rgba(66,198,188,0.1),transparent_28%)]" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6B818D]">Executive briefing</p>
                    <h2 className="mt-4 max-w-md text-[2.6rem] font-bold leading-[0.98] tracking-[-0.05em] text-[#112031]">
                      {rightTitle}
                    </h2>
                    <p className="mt-4 max-w-lg text-base leading-8 text-[#61717D]">{rightSubtitle}</p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[#DBF0EC] bg-white px-5 py-4 shadow-[0_22px_54px_-30px_rgba(45,174,164,0.38)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7B8B95]">{metricLabel}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(#1BAA9D_0deg,#1BAA9D_331deg,#DFF1EE_331deg)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#112031]">
                          {metricValue}
                        </div>
                      </div>
                      <p className="max-w-[9rem] text-sm leading-6 text-[#5D6C79]">{metricCaption}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[2rem] bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] p-6 text-white shadow-[0_34px_90px_-36px_rgba(17,49,59,0.65)]">
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A5CCD0]">
                      Resume Studio Workflow
                    </div>
                    <p className="mt-5 text-[2rem] font-semibold leading-[1.03] tracking-[-0.04em]">
                      Tailor once.
                      <br />
                      Apply smarter.
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {["Resume Score", "JD Match", "Readiness Lift"].map((label, index) => (
                        <div key={label} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-[#8FBABF]">{label}</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{["82", "88", "+16%"][index]}</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6D4A] px-4 py-3 text-sm font-semibold text-white">
                      Open Resume Studio
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {workflowPoints.map((point, index) => (
                      <div
                        key={point.label}
                        className={`rounded-[1.7rem] border p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] ${
                          index === 2 ? "border-[#FFD8CC] bg-[#FFF4EF]" : "border-[#E8EEEE] bg-white/90"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                              index === 2 ? "bg-[#FFE0D6] text-[#FF6D4A]" : "bg-[#EFFBFA] text-[#1BAA9D]"
                            }`}
                          >
                            <point.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#112031]">{point.label}</p>
                            <p className="mt-1 text-sm leading-6 text-[#61717D]">{point.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
