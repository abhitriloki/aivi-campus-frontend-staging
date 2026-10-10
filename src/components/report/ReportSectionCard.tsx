import React from "react";
import { motion } from "framer-motion";

interface ReportSectionCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  delay?: number;
}

export const ReportSectionCard: React.FC<ReportSectionCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-[#EFFBFA] text-[#0D9488]",
  children,
  className = "",
  headerAction,
  delay = 0,
}) => {
  return (
    <motion.div
      className={`overflow-hidden rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {title && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
              {subtitle && <p className="mt-0.5 text-xs text-[#64748B]">{subtitle}</p>}
            </div>
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default ReportSectionCard;
