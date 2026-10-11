import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanUsageBanner from "../components/PlanUsageBanner";
import {
  FileText,
  Target,
  Route,
  Mic,
  TrendingUp,
  FolderOpen,
  FolderLock,
  BriefcaseBusiness,
  Zap,
  Sparkles,
  Ticket,
  ArrowRight,
  PenTool,
  Clock3,
  History,
  LayoutGrid,
  BarChart3,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAllLatestAnalyses } from "@/services/analysisService";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPlanInfo, type PlanInfo } from "@/services/planService";
import UpgradeModal from "@/components/UpgradeModal";
import TrialActivationModal from "@/components/TrialActivationModal";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";


const modules = [
  { path: "/dashboard/resume", icon: FileText, title: "Resume Intelligence", desc: "Upload your resume for deep analysis.", type: "resume" },
  { path: "/dashboard/job-fit", icon: Target, title: "Job Fit Analysis", desc: "Compare resume against job descriptions.", type: "job_fit" },
  { path: "/dashboard/builder", icon: PenTool, title: "Resume Studio", desc: "Create, rebuild, and tailor resumes.", type: "builder" },
  { path: "/dashboard/roadmap", icon: Route, title: "Skill Roadmap", desc: "Get personalized learning plans.", type: "roadmap" },
  { path: "/dashboard/interview", icon: Mic, title: "Interview Prep", desc: "AI-generated interview questions.", type: "interview" },
  { path: "/dashboard/promotion", icon: TrendingUp, title: "Promotion Readiness", desc: "Assess your advancement potential.", type: "promotion" },
  { path: "/dashboard/portfolio", icon: FolderOpen, title: "Portfolio Analyzer", desc: "Evaluate your project portfolio.", type: "portfolio" },
];

const rotatingHighlights = [
  "Resume Studio and Job Fit should work together, not as separate tools.",
  "Use Job Fit after every resume revision to improve alignment before you apply.",
  "Keep your strongest resume, latest score, and next move visible in one workspace.",
];

const analysisLabels: Record<string, string> = {
  resume: "Resume Intelligence",
  job_fit: "Job Fit Analysis",
  roadmap: "Skill Roadmap",
  interview: "Interview Prep",
  promotion: "Promotion Readiness",
  portfolio: "Portfolio Analyzer",
  linkedin: "LinkedIn Analyzer",
};

// Figma (screen-student-dashboard-complete): per-module icon tile tints
const moduleTileStyles: Record<string, { bg: string; fg: string }> = {
  resume: { bg: "#fef2f2", fg: "#ef4444" },
  job_fit: { bg: "#fef2f2", fg: "#ef4444" },
  builder: { bg: "#fef2f2", fg: "#ef4444" },
  roadmap: { bg: "#fff7ed", fg: "#ea580c" },
  interview: { bg: "#fef2f2", fg: "#ef4444" },
  promotion: { bg: "#fff7ed", fg: "#ea580c" },
  portfolio: { bg: "#fef2f2", fg: "#ef4444" },
};

// Figma: recent-run icon tiles cycle through three styles
const runTileStyles = [
  { bg: "#fef2f2", fg: "#e88f00" },
  { bg: "#8a38f5", fg: "#ffffff" },
  { bg: "#01b32c", fg: "#ffffff" },
];

const DashboardHome = () => {
  const { user, tenant } = useAuth();
  const { branding } = useTenantBranding();


  const isCampusUser = Boolean(
    ((tenant?.tenantId && tenant?.role === "student") ||
    user?.email?.endsWith(".ac.in") ||
    user?.email?.endsWith(".edu.in")) &&
    tenant?.role !== "platform_admin"
  );

  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [skillsCount, setSkillsCount] = useState<number | null>(null);
  const [moduleScores, setModuleScores] = useState<Record<string, number | null>>({});
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHighlightIndex((current) => (current + 1) % rotatingHighlights.length);
    }, 4200);
    return () => window.clearInterval(interval);
  }, []);

  const fetchPlanInfo = async () => {
    if (!user) return;
    const info = await getUserPlanInfo(user.uid);
    setPlanInfo(info);

    const now = Date.now();
    if (info.trial && info.trialExpiresAt) {
      const expiryDate = info.trialExpiresAt.seconds * 1000;
      if (now >= expiryDate) {
        setShowUpgradeModal(true);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      const analyses = await getAllLatestAnalyses(user.uid);
      setRecentAnalyses(analyses.slice(0, 6));

      if (analyses && analyses.length > 0) {
        const latestByType: Record<string, any> = {};
        for (const a of analyses) {
          if (!latestByType[(a as any).analysisType]) {
            latestByType[(a as any).analysisType] = a;
          }
        }

        const resumeResult = latestByType["resume"];
        if (resumeResult) {
          setOverallScore(resumeResult.overall_score || null);
          setSkillsCount(resumeResult.top_skills?.length || null);
        }

        const scores: Record<string, number | null> = {};
        for (const type of Object.keys(latestByType)) {
          const r = latestByType[type] as any;
          scores[type] = r?.overall_score || r?.readiness_score || r?.job_match_percentage || r?.overall_depth_score || null;
        }
        setModuleScores(scores);
      }
    };

    loadDashboardData();
    fetchPlanInfo();
  }, [user]);

  const recentHistoryCards = useMemo(() => {
    return recentAnalyses.map((item) => {
      const score =
        item?.overall_score ??
        item?.readiness_score ??
        item?.job_match_percentage ??
        item?.overall_depth_score ??
        null;
      return {
        id: item.id,
        title: analysisLabels[item.analysisType] || item.analysisType,
        score,
        createdAt: item.createdAt,
      };
    });
  }, [recentAnalyses]);

  const formatDate = (ts: any) => {
    if (!ts) return "";
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderTrialBanner = () => {
    if (isCampusUser) return null;
    if (!planInfo?.trial || !planInfo.trialExpiresAt) return null;

    const now = Date.now();
    const expiry = planInfo.trialExpiresAt.seconds * 1000;
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return null;

    return (
      <motion.div
        className="rounded-[1.7rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#112031]">Starter beta trial is active</p>
              <p className="mt-1 text-sm leading-7 text-[#66727C]">
                Your free trial expires in {days} {days === 1 ? "day" : "days"}.
              </p>
            </div>
          </div>

          <Link
            to="/#pricing"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#112031] shadow-[0_12px_30px_-22px_rgba(17,32,49,0.14)] transition-all hover:-translate-y-0.5"
          >
            View pricing
            <ArrowRight className="h-4 w-4 text-[#FF6D4A]" />
          </Link>
        </div>
      </motion.div>
    );
  };

  const renderActivationButton = () => {
    if (isCampusUser) return null;
    if (planInfo?.plan_type !== "free" || planInfo?.trialUsed) return null;

    return (
      <motion.div
        className="rounded-[1.8rem] border border-dashed border-[#7AD7CC] bg-[linear-gradient(90deg,#F3FFFD_0%,#FFF7F3_100%)] p-5 shadow-[0_18px_50px_-34px_rgba(17,32,49,0.16)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFFBFA] text-[#1BAA9D]">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#112031]">Launch Offer: 30-Day Free Trial</h3>
              <p className="text-sm text-[#66727C]">Unlock Starter features for 30 days. No credit card required.</p>
            </div>
          </div>
          <Button
            onClick={() => setShowActivationModal(true)}
            className="h-auto rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] hover:bg-[#FF7A5B]"
          >
            Activate Trial Now
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Figma: title block — Inter 32/600 #000 + Inter 16/400 #000 */}
      <div>
        <motion.h1
          className="text-[32px] font-semibold leading-[1.2] text-black"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Career Intelligence Dashboard
        </motion.h1>
        <p className="mt-1 text-base text-black">Welcome back. Your latest insights are shown below.</p>
      </div>

      {renderTrialBanner()}
      {renderActivationButton()}

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <TrialActivationModal
        open={showActivationModal}
        onOpenChange={setShowActivationModal}
        onSuccess={fetchPlanInfo}
      />

      {/* Figma: kpi-row — card 1 blue gradient w/ white text, cards 2-3 white */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          className="rounded-[20px] border border-[#e5eaf2] bg-[linear-gradient(180deg,#2176ff_0%,#1769ff_100%)] p-5 shadow-[0_6px_18px_rgba(16,26,53,0.031)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold text-white">Overall Score</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
              <Zap className="h-4 w-4 text-[#2176ff]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[40px] font-semibold leading-none text-white">{overallScore ?? "—"}</span>
            {overallScore != null && <span className="text-[10px] font-normal text-white/90">/100</span>}
          </div>
          <p className="mt-2 text-[10px] text-white/90">
            {overallScore ? "From latest resume analysis" : "Complete an analysis to see"}
          </p>
        </motion.div>

        <motion.div
          className="rounded-[20px] border border-white bg-white p-5 shadow-[0_6px_18px_rgba(16,26,53,0.031)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold text-[#64748b]">Skills Tracked</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2176ff]">
              <Target className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[40px] font-semibold leading-none text-black">{skillsCount ?? "—"}</span>
          </div>
          <p className="mt-2 text-[10px] text-[#64748b]">
            {skillsCount ? "Detected From Resume" : "Upload resume to detect"}
          </p>
        </motion.div>

        <Link to="/dashboard/promotion" className="block">
          <motion.div
            className="rounded-[20px] border border-white bg-white p-5 shadow-[0_6px_18px_rgba(16,26,53,0.031)] transition-all duration-300 hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs font-semibold text-[#64748b]">Promotion Readiness</p>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2176ff]">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-[40px] font-semibold leading-none text-black">
                {moduleScores["promotion"] ? `${moduleScores["promotion"]}%` : "—"}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-[#64748b]">
              {moduleScores["promotion"] ? "From promotion analysis" : "Click To Analyse"}
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Figma: IntelligenceModulesSection — white card, 2-col grid */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
            <LayoutGrid className="h-4 w-4 text-[#2563eb]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0f172a]">Intelligence Modules</h2>
            <p className="text-xs text-[#94a3b8]">Explore AI-powered tools to analyze, improve and accelerate your career journey.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {modules.map((mod, i) => {
            const tile = moduleTileStyles[mod.type] ?? { bg: "#eff6ff", fg: "#2563eb" };
            return (
              <Link key={mod.path} to={mod.path} className="block">
                <motion.div
                  className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c7d7f5] hover:shadow-[0_12px_28px_-18px_rgba(33,118,255,0.25)]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06 }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: tile.bg }}
                  >
                    <mod.icon className="h-5 w-5" style={{ color: tile.fg }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#0f172a]">{mod.title}</h3>
                    <p className="mt-0.5 text-[11px] text-[#94a3b8]">{mod.desc}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {moduleScores[mod.type] != null ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2176ff]">
                        <span className="font-display text-xs font-bold text-[#1769ff]">{moduleScores[mod.type]}</span>
                      </div>
                    ) : (
                      <span className="rounded-full bg-[#2176ff] px-2 py-[3px] text-[10px] font-bold text-white">New</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[#3b82f6]" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Figma: Frame 471 — career progress chart + recent analyzer runs */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <motion.div
          className="rounded-2xl border border-[#e2e8f0] bg-white p-6 lg:flex-[1.3]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                <BarChart3 className="h-4 w-4 text-[#2563eb]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">Your Career Progress</h2>
                <p className="text-xs text-[#94a3b8]">Track your improvement across key dimensions.</p>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5"
            >
              <span className="text-xs font-semibold text-[#334155]">Overall Score</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8]" />
            </div>
          </div>

          <div aria-hidden="true" className="mt-5">
            <svg viewBox="0 0 500 200" className="h-auto w-full">
              <defs>
                <linearGradient id="dashBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fa6ff" />
                  <stop offset="100%" stopColor="#5495ff" />
                </linearGradient>
              </defs>
              {[15, 55, 95, 135, 175].map((y) => (
                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#cfd6de" strokeWidth="1" />
              ))}
              {[
                { x: 54.5, h: 80 },
                { x: 174.5, h: 121 },
                { x: 294.5, h: 150 },
                { x: 414.5, h: 62 },
              ].map((b, idx) => (
                <rect
                  key={idx}
                  x={b.x}
                  y={175 - b.h}
                  width="31"
                  height={b.h}
                  rx="6"
                  fill="url(#dashBarGrad)"
                  opacity="0.85"
                />
              ))}
              <path
                d="M70,80 C110,60 150,45 190,42 C230,39 270,20 310,22 C350,24 390,70 430,98"
                fill="none"
                stroke="#2176ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {[
                [70, 80],
                [190, 42],
                [310, 22],
                [430, 98],
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#2176ff" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>
            <div className="mt-2 flex justify-between px-1">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                <span
                  key={m}
                  className={
                    m === "Oct"
                      ? "font-display text-[11px] font-bold text-[#2563eb]"
                      : "font-display text-[11px] font-medium text-[#94a3b8]"
                  }
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {recentHistoryCards.length > 0 && (
          <motion.div
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 lg:flex-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2176ff]">
                <History className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0f172a]">Recent analyzer runs</h2>
                <p className="text-xs text-[#94a3b8]">Your latest analysis history and scores in one place.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {recentHistoryCards.map((item, index) => {
                const tile = runTileStyles[index % runTileStyles.length];
                return (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] p-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.04 }}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: tile.bg }}
                    >
                      <FileText className="h-4 w-4" style={{ color: tile.fg }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#1e293b]">{item.title}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Clock3 className="h-3 w-3 text-[#94a3b8]" />
                        <span className="text-[11px] text-[#94a3b8]">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                    {item.score != null ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d4e3ff]">
                        <span className="font-display text-[11px] font-bold text-[#2176ff]">{item.score}</span>
                      </div>
                    ) : (
                      <span className="shrink-0 rounded-md bg-[#d4e3ff] px-2 py-[3px] font-display text-[10px] font-bold text-[#2176ff]">
                        Saved
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Figma: vault Section — light theme (was dark slate), blue CTAs */}
      {isCampusUser && (
        <div className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[linear-gradient(90deg,#ffffff_0%,#eff6ff_50%,#f8fafc_100%)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#3b82f6] opacity-40 blur-[64px]"
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-block rounded-full border border-[#cfe0ff] bg-[#eff6ff] px-2.5 py-1 text-[10px] font-semibold text-[#2176ff]">
                {branding?.name ? `${branding.name} — Placement Portal` : "Institutional Placement Portal"}
              </span>
              <h3 className="text-2xl font-semibold text-[#0f172a]">Institutional Resume Vault & Placement Drives</h3>
              <p className="text-base text-[#475569]">Submit your AI-audited resume for TPO verification, college seal & active placement drives.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link to="/dashboard/vault">
                <Button className="h-10 rounded-[10px] bg-[linear-gradient(90deg,#2563eb_0%,#3b82f6_100%)] px-5 text-sm font-semibold text-[#fefcff] hover:brightness-110">
                  <FolderLock className="mr-1.5 h-4 w-4" />
                  Open Resume Vault
                </Button>
              </Link>
              <Link to="/dashboard/drives">
                <Button
                  variant="outline"
                  className="h-10 rounded-[10px] border-[#1769ff]/40 bg-[#f8fafc] px-5 text-sm font-semibold text-[#1769ff] hover:bg-[#eef4ff] hover:text-[#1769ff]"
                >
                  <BriefcaseBusiness className="mr-1.5 h-4 w-4" />
                  Placement Drives
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[1.6rem] border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F4FBFB_100%)] px-5 py-4 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EFFBFA] text-[#1BAA9D]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">Highlighted workflow</p>
              <div className="relative min-h-[1.75rem] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={highlightIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="text-sm font-semibold text-[#112031]"
                  >
                    {rotatingHighlights[highlightIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="text-sm text-[#66727C]">Keep the main action visible while your plan and scores stay below.</div>
        </div>
      </div>

      <PlanUsageBanner />

      {!overallScore && (
        <motion.div
          className="rounded-[1.8rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#112031]">Ready to begin?</h3>
              <p className="mt-1 text-sm text-[#66727C]">Upload your resume and a target job description to get your first career intelligence report.</p>
            </div>
            <Link
              to="/dashboard/resume"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B]"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
