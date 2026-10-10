import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animated?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 75) return "#1C6B68"; // Deep Teal
  if (score >= 60) return "#20CFC0"; // Electric Mint
  if (score >= 40) return "#D97706"; // Amber 600
  return "#E11D48"; // Rose 600
};

const ScoreRing = ({ score, size = 140, strokeWidth = 8, label, sublabel, animated = true }: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Visible track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-extrabold text-[#0F172A] tracking-tight"
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs font-semibold text-[#475569]">/100</span>
        </div>
      </div>
      {label && <span className="text-sm font-bold text-[#0F172A]">{label}</span>}
      {sublabel && <span className="text-xs font-medium text-[#475569]">{sublabel}</span>}
    </div>
  );
};

export default ScoreRing;
