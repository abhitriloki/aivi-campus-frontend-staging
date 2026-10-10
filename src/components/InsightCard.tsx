import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  children?: ReactNode;
}

const InsightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  delay = 0,
  children,
}: InsightCardProps) => {
  const trendTone =
    trend === "up" ? "text-[#169C8F]" : trend === "down" ? "text-[#D95D39]" : "text-[#8A97A1]";

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[#E7ECEF] bg-white/92 p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-30px_rgba(17,32,49,0.18)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[2.1rem] font-semibold tracking-[-0.05em] text-[#112031]">{value}</span>
            {trend && <span className={`text-xs font-semibold ${trendTone}`}>{trend === "up" ? "Up" : trend === "down" ? "Down" : "Stable"}</span>}
          </div>
          {subtitle && <p className="mt-2 max-w-[18rem] text-sm leading-6 text-[#66727C]">{subtitle}</p>}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {children}
    </motion.div>
  );
};

export default InsightCard;
