import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

type HeroStat = {
  label: string;
  value: string;
};

type PublicPageShellProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  stats?: HeroStat[];
  actions?: ReactNode;
  children: ReactNode;
};

export const PublicPageShell = ({
  eyebrow,
  title,
  description,
  stats = [],
  actions,
  children,
}: PublicPageShellProps) => {
  const heroStats = stats.slice(0, 3);

  return (
    <main className="page-offset overflow-x-hidden bg-[linear-gradient(180deg,#FFFCF8_0%,#F8FBFB_20%,#FFFFFF_100%)] pb-8">
      <section className="relative overflow-hidden border-b border-[#E9EEF1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(66,198,188,0.11),transparent_24%),radial-gradient(circle_at_84%_14%,rgba(255,112,73,0.12),transparent_22%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              {eyebrow && (
                <div className="inline-flex items-center rounded-full border border-[#DDEBE8] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4E6C7A] shadow-[0_14px_30px_-24px_rgba(17,32,49,0.18)]">
                  {eyebrow}
                </div>
              )}
              <h1 className="mt-5 font-sans text-4xl font-extrabold leading-[0.98] tracking-[-0.05em] text-[#112031] sm:text-5xl lg:text-[4.3rem]">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5D6C79]">
                {description}
              </p>
              {actions && <div className="mt-8 flex flex-col gap-4 sm:flex-row">{actions}</div>}
              {stats.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.5rem] border border-[#E6ECEF] bg-white/90 px-5 py-5 shadow-[0_18px_44px_-30px_rgba(17,32,49,0.16)]"
                    >
                      <p className="text-3xl font-bold tracking-[-0.04em] text-[#112031]">{stat.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[#687681]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-[#89E1DA]/30 blur-3xl" />
              <div className="absolute -right-8 bottom-4 h-36 w-36 rounded-full bg-[#FFC5AE]/35 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.25rem] border border-[#E4ECEF] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(244,251,250,0.95)_54%,rgba(255,245,239,0.96)_100%)] p-6 shadow-[0_34px_90px_-38px_rgba(17,32,49,0.22)]">
                <div className="rounded-[1.75rem] border border-[#E9EEEF] bg-[#122230] p-6 text-white shadow-[0_24px_54px_-24px_rgba(17,32,49,0.42)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/55">AIVI Intelligence</p>
                      <h3 className="mt-3 max-w-[14rem] text-3xl font-semibold leading-tight tracking-[-0.04em]">
                        {eyebrow ?? "Career workflow"}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-[#F0C66E]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    {heroStats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`rounded-[1.35rem] border p-4 ${
                          index === 0
                            ? "border-[#F0C66E]/30 bg-white/8"
                            : "border-white/10 bg-white/[0.05]"
                        }`}
                      >
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
                        <p className="mt-2 text-sm leading-6 text-white/62">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">Recommended next step</p>
                      <p className="mt-3 max-w-[16rem] text-2xl font-semibold leading-tight tracking-[-0.04em]">
                        Move from insight into a stronger, role-ready version.
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">Workflow view</p>
                      <div className="mt-3 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2">
                          <p className="text-sm font-medium text-white">Diagnose</p>
                          <p className="mt-1 text-xs leading-5 text-white/55">Understand the real gap first.</p>
                        </div>
                        <div className="rounded-2xl border border-[#F0C66E]/25 bg-[#F0C66E]/10 px-3 py-2">
                          <p className="text-sm font-medium text-white">Rebuild</p>
                          <p className="mt-1 text-xs leading-5 text-white/60">Turn signal into a sharper next version.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:pb-10 sm:pt-16">{children}</div>
    </main>
  );
};

export const SectionBlock = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <motion.section {...fadeUp} className="mb-14 last:mb-0">
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#112031] sm:text-[2.15rem]">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-[#61707B]">{description}</p>}
    </div>
    <div className="mt-8">{children}</div>
  </motion.section>
);

export const FeatureGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{children}</div>
);

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  accent = "teal",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "teal" | "coral";
}) => (
  <motion.div
    {...fadeUp}
    className={`rounded-[1.75rem] border bg-white p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] ${
      accent === "coral" ? "border-[#FFD8CE]" : "border-[#E4F0ED]"
    }`}
  >
    <div
      className={`inline-flex rounded-2xl p-3 ${
        accent === "coral" ? "bg-[#FFF1EC] text-[#FF6D4A]" : "bg-[#EFFBFA] text-[#19A89A]"
      }`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#112031]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-[#61707B]">{description}</p>
  </motion.div>
);

export const BulletPanel = ({
  items,
  dark = false,
}: {
  items: { title: string; text: string }[];
  dark?: boolean;
}) => (
  <div
    className={`grid gap-5 rounded-[2rem] border p-6 sm:p-8 ${
      dark
        ? "border-[#1C404B] bg-[#143641] text-white shadow-[0_28px_70px_-34px_rgba(15,59,70,0.45)]"
        : "border-[#E7ECEF] bg-white text-[#112031] shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
    }`}
  >
    {items.map((item, index) => (
      <div key={item.title} className="flex gap-4">
        <div
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            dark ? "bg-white/10 text-[#E3C26D]" : "bg-[#EFFBFA] text-[#19A89A]"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${dark ? "text-white" : "text-[#112031]"}`}>{item.title}</h3>
          <p className={`mt-1 text-sm leading-7 ${dark ? "text-[#D5E3E5]" : "text-[#61707B]"}`}>{item.text}</p>
        </div>
      </div>
    ))}
  </div>
);

export const CtaPanel = ({
  title,
  text,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: {
  title: string;
  text: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}) => (
  <motion.div
    {...fadeUp}
    className="overflow-hidden rounded-[2.2rem] border border-[#E7ECEF] bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFA_60%,#FFF4EF_100%)] px-8 py-10 shadow-[0_24px_64px_-36px_rgba(17,32,49,0.18)]"
  >
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#112031] sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[#61707B]">{text}</p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          to={primaryTo}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_48px_-24px_rgba(255,109,74,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FF7A5B]"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {secondaryLabel && secondaryTo && (
          <Link
            to={secondaryTo}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDE7EA] bg-white px-6 py-4 text-sm font-semibold text-[#112031] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9CD9D1]"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  </motion.div>
);

export default PublicPageShell;
