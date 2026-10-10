import React from "react";
import Chip from "./Chip";
import FormattedText from "../markdownFormatter";

interface WeakBetterBlockProps {
  original: string;
  suggestion: string;
  originalLabel?: string;
  suggestionLabel?: string;
  className?: string;
}

/**
 * Standardized WEAK / BETTER Comparison Component
 * - WEAK bullet: #64748B (slate-500) strikethrough, amber-800 badge (6.5:1 AA PASS)
 * - BETTER bullet: #1E293B (slate-800) font-medium, teal-800 badge (6.9:1 AA PASS)
 */
export const WeakBetterBlock: React.FC<WeakBetterBlockProps> = ({
  original,
  suggestion,
  originalLabel = "WEAK",
  suggestionLabel = "BETTER",
  className = "",
}) => {
  return (
    <div className={`space-y-3 rounded-[1.4rem] border border-[#E2E8F0] bg-[#FAFBFB] p-4 transition-all hover:bg-white ${className}`}>
      <div className="flex items-start gap-3">
        <Chip variant="warning" className="shrink-0">
          {originalLabel}
        </Chip>
        <div className="mt-0.5 text-sm text-[#64748B] line-through break-words leading-relaxed">
          <FormattedText content={original} />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Chip variant="success" className="shrink-0">
          {suggestionLabel}
        </Chip>
        <div className="mt-0.5 text-sm font-medium text-[#1E293B] break-words leading-relaxed">
          <FormattedText content={suggestion} />
        </div>
      </div>
    </div>
  );
};

export default WeakBetterBlock;
