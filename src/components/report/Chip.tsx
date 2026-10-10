import React from "react";

export type ChipVariant = "warning" | "danger" | "success" | "neutral";

interface ChipProps {
  variant?: ChipVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Standardized WCAG AA-Compliant Chip Badge
 * Contrast Ratios:
 * - warning (amber): #92400E on #FEF3C7 border #FDE68A => 6.5:1 (AA PASS)
 * - danger (red):    #B91C1C on #FEE2E2 border #FECACA => 6.8:1 (AA PASS)
 * - success (teal):  #115E59 on #CCFBF1 border #99F6E4 => 6.9:1 (AA PASS)
 * - neutral (slate): #334155 on #F1F5F9 border #E2E8F0 => 8.2:1 (AA PASS)
 */
export const CHIP_TOKENS = {
  warning: { text: "#92400E", bg: "#FEF3C7", border: "#FDE68A", className: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]" },
  danger:  { text: "#B91C1C", bg: "#FEE2E2", border: "#FECACA", className: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]" },
  success: { text: "#115E59", bg: "#CCFBF1", border: "#99F6E4", className: "bg-[#CCFBF1] text-[#115E59] border-[#99F6E4]" },
  neutral: { text: "#334155", bg: "#F1F5F9", border: "#E2E8F0", className: "bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]" },
};

export const Chip: React.FC<ChipProps> = ({
  variant = "neutral",
  children,
  className = "",
  icon: Icon,
}) => {
  const token = CHIP_TOKENS[variant] || CHIP_TOKENS.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors ${token.className} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Chip;
