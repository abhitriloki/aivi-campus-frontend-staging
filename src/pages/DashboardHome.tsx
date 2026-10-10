import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InsightCard from "../components/InsightCard";
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
      <div>
        <motion.h1
          className="text-2xl font-bold text-[#112031]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Career Intelligence Dashboard
        </motion.h1>
        <p className="mt-1 text-[#66727C]">Welcome back. Your latest insights are shown below.</p>
      </div>
      
      {isCampusUser && (
        <div className="rounded-2xl border border-[#169C8F]/30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#169C8F]/20 text-[#169C8F] text-xs font-bold border border-[#169C8F]/40">
                {branding?.name ? `${branding.name} — Placement Portal` : "Institutional Placement Portal"}
              </span>

            </div>
            <h3 className="text-xl font-extrabold text-white">Institutional Resume Vault & Placement Drives</h3>
            <p className="text-xs text-slate-300">Submit your AI-audited resume for TPO verification, college seal & active placement drives.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/dashboard/vault">
              <Button className="bg-[#169C8F] hover:bg-[#128277] text-white font-bold text-xs">
                <FolderLock className="h-4 w-4 mr-1.5" />
                Open Resume Vault
              </Button>
            </Link>
            <Link to="/dashboard/drives">
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 text-xs font-bold">
                <BriefcaseBusiness className="h-4 w-4 mr-1.5" />
                Placement Drives
              </Button>
            </Link>
          </div>
        </div>
      )}

      {renderTrialBanner()}
      {renderActivationButton()}

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <TrialActivationModal
        open={showActivationModal}
        onOpenChange={setShowActivationModal}
        onSuccess={fetchPlanInfo}
      />

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="Overall Score"
          value={overallScore ?? "—"}
          subtitle={overallScore ? "From latest resume analysis" : "Complete an analysis to see"}
          icon={Zap}
          delay={0}
        />
        <InsightCard
          title="Skills Tracked"
          value={skillsCount ?? "—"}
          subtitle={skillsCount ? "Detected from resume" : "Upload resume to detect"}
          icon={Target}
          delay={0.1}
        />
        <Link to="/dashboard/promotion">
          <InsightCard
            title="Promotion Readiness"
            value={moduleScores["promotion"] ? `${moduleScores["promotion"]}%` : "—"}
            subtitle={moduleScores["promotion"] ? "From promotion analysis" : "Click to run analysis"}
            icon={TrendingUp}
            delay={0.2}
          />
        </Link>
      </div>

      {recentHistoryCards.length > 0 && (
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#112031]">Recent analyzer runs</h2>
              <p className="text-sm text-[#66727C]">Your latest analysis history and scores in one place.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentHistoryCards.map((item, index) => (
              <motion.div
                key={item.id}
                className="rounded-[1.5rem] border border-[#E7ECEF] bg-[#FCFBF8] p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.04 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#112031]">{item.title}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#7B8892]">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="rounded-full bg-[#EFFBFA] px-3 py-1 text-xs font-semibold text-[#169C8F]">
                    {item.score != null ? item.score : "Saved"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#112031]">Intelligence Modules</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod, i) => (
            <Link key={mod.path} to={mod.path}>
              <motion.div
                className="group rounded-[1.6rem] border border-[#E7ECEF] bg-white/94 p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D5E6E3] hover:shadow-[0_22px_50px_-28px_rgba(17,32,49,0.16)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] p-3 text-[#FF6D4A]">
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#112031]">{mod.title}</h3>
                    <p className="mt-1 text-xs text-[#66727C]">{mod.desc}</p>
                  </div>
                  <div className="shrink-0">
                    {moduleScores[mod.type] != null ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#24B7A9] bg-[#EFFBFA]">
                        <span className="text-sm font-bold text-[#169C8F]">{moduleScores[mod.type]}</span>
                      </div>
                    ) : (
                      <span className="rounded-full bg-[#FFF4EF] px-2.5 py-1 text-xs font-semibold text-[#FF6D4A]">New</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

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
