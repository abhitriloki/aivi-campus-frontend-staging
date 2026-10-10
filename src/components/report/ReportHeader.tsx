import React from "react";
import Chip from "./Chip";
import { Sparkles, RotateCcw } from "lucide-react";

interface ReportHeaderProps {
  title: string;
  category?: string;
  subtitle?: string;
  score?: number;
  badgeText?: string;
  onNewAnalysis?: () => void;
  actions?: React.ReactNode;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  category = "AI Intelligence Report",
  subtitle,
  score,
  badgeText,
  onNewAnalysis,
  actions,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        {onNewAnalysis && (
          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#1E293B] hover:-translate-y-0.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#24B7A9]" /> Start New Analysis
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
              {category}
            </span>
            {badgeText && (
              <Chip variant="success" icon={Sparkles}>
                {badgeText}
              </Chip>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[#475569]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {score !== undefined && (
          <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-white/95 px-4 py-2.5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Overall Score</span>
            <span className="text-xl font-extrabold text-[#0F172A]">{score}/100</span>
          </div>
        )}
        {actions}
      </div>
    </div>
  );
};

export default ReportHeader;
