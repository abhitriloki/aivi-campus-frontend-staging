import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  delay?: number;
}

const getBarColor = (score: number) => {
  if (score >= 80) return "bg-[#0D9488]";
  if (score >= 65) return "bg-[#0284C7]";
  if (score >= 50) return "bg-[#D97706]";
  if (score >= 35) return "bg-[#EA580C]";
  return "bg-[#DC2626]";
};

const ScoreBar = ({ label, score, maxScore = 100, delay = 0 }: ScoreBarProps) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[#334155]">{label}</span>
        <span className="font-mono font-bold text-[#0F172A]">{score}</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#E2E8F0] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBarColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
