import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  ArrowRight,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Github,
  Layers3,
  Trophy,
  Wand2,
} from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import ScoreBar from "../components/ScoreBar";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuth } from "../contexts/AuthContext";
import { runAnalysis } from "../services/analysisService";
import { checkAndIncrementUsage } from "../services/planService";
import { toast } from "sonner";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";

interface ProjectInput {
  name: string;
  desc: string;
}

interface ProjectResult {
  name: string;
  depth_score: number;
  attractiveness_score: number;
  suggestion: string;
}

interface PortfolioResult {
  overall_depth_score: number;
  overall_attractiveness_score: number;
  projects: ProjectResult[];
  summary: string;
}

const PortfolioAnalyzer = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"input" | "results">("input");
  const [projects, setProjects] = useState<ProjectInput[]>([{ name: "", desc: "" }]);
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PortfolioResult | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroSignals = useMemo(
    () => [
      {
        title: "Project Depth",
        body: "Evaluate whether the work shows technical substance or only surface-level execution.",
        icon: Layers3,
      },
      {
        title: "Hiring Attractiveness",
        body: "See which projects are likely to create stronger recruiter and interviewer interest.",
        icon: Trophy,
      },
      {
        title: "Project Upgrades",
        body: "Get clearer guidance on how to make each project more portfolio-worthy.",
        icon: Wand2,
      },
    ],
    []
  );

  // Helper to normalize data structure
  const normalizeData = (data: any) => {
    if (!data) return null;
    const normalized = { ...data };

    // Map backend 'projects_analyzed' to frontend 'projects'
    if (!normalized.projects && normalized.projects_analyzed) {
      normalized.projects = normalized.projects_analyzed.map((p: any) => ({
        name: p.name,
        depth_score: p.depth_score ?? (p.complexity === "High" ? 90 : p.complexity === "Medium" ? 70 : 50),
        attractiveness_score: p.attractiveness_score ?? 75,
        suggestion: p.suggestion || p.improvements?.[0] || "No specific suggestion."
      }));
    }

    if (normalized.overall_attractiveness_score === undefined) {
      normalized.overall_attractiveness_score = normalized.overall_depth_score || 0;
    }

    return normalized as PortfolioResult;
  };

  useEffect(() => {
    const loadData = async () => {
      // Case 1: State
      if (location.state?.result) {
        const normalized = normalizeData(location.state.result);
        if (normalized) {
          setResult(normalized);
          setMode("results");
        }
        return;
      }

      // Case 2: ID
      const analysisId = params.analysisId || (location.pathname.split("/").pop() !== "portfolio" ? location.pathname.split("/").pop() : null);

      if (analysisId && analysisId !== "portfolio") {
        setLoading(true);
        try {
          const db = getDb();
          if (!db) {
            setError("Database connection unavailable.");
            return;
          }
          const docRef = doc(db, "analysis_results", analysisId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data().result;
            const normalized = normalizeData(data);
            if (normalized && normalized.projects?.length > 0) {
              setResult(normalized);
              setMode("results");
            } else {
              setError("Invalid portfolio data found.");
            }
          } else {
            setError("Analysis not found.");
          }
        } catch (err) {
          console.error(err);
          setError("Failed to load analysis.");
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [location.state, params, location.pathname]);

  const addProject = () => setProjects([...projects, { name: "", desc: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: keyof ProjectInput, value: string) => {
    setProjects(projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const handleAnalyze = async () => {
    const validProjects = projects.filter(p => p.name.trim() && p.desc.trim());
    if (validProjects.length === 0 && !githubUrl.trim()) {
      toast.error("Please add at least one project with a name and description.");
      return;
    }
    if (!user) { toast.error("Please sign in."); return; }

    const usageCheck = await checkAndIncrementUsage(user.uid, "portfolio");
    if (!usageCheck.allowed) { setShowUpgrade(true); return; }

    setLoading(true);
    setError(null);
    try {
      const projectsPayload = validProjects.map(p => ({
        name: p.name,
        description: p.desc + (githubUrl ? ` (GitHub: ${githubUrl})` : ""),
      }));
      const { result: data } = await runAnalysis({
        analysis_type: "portfolio",
        projects: projectsPayload.length > 0 ? projectsPayload : [{ name: "GitHub Profile", description: `GitHub profile: ${githubUrl}` }],
      });
      // careerAnalysis Cloud Function already saves result and logs usage

      const normalized = normalizeData(data);
      setResult(normalized);
      setMode("results");
      setHistoryKey(k => k + 1);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (histResult: any) => {
    const normalized = normalizeData(histResult);
    if (!normalized || !normalized.projects) {
      console.error("Invalid history data:", histResult);
      toast.error("Invalid history data");
      return;
    }
    setResult(normalized);
    setMode("results");
    window.scrollTo(0, 0);
  };

  if (loading && !result && mode === "results") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading analysis...</p>
      </div>
    );
  }

  if (error && mode === "results") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive opacity-50" />
        <p className="text-muted-foreground">{error}</p>
        <button onClick={() => { setMode("input"); setError(null); navigate("/portfolio"); }} className="text-primary hover:underline">
          Start new portfolio analysis
        </button>
      </div>
    );
  }

  if (mode === "input") {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.section
          className="overflow-hidden rounded-[2.2rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-6 shadow-[0_24px_60px_-34px_rgba(17,32,49,0.18)] lg:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E4ECEA] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6A7680]">
                <FolderOpen className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Portfolio Analyzer
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  See whether your projects actually make your profile stronger.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Portfolio Analyzer reviews your projects like a hiring manager would. It scores
                  technical depth and hiring attractiveness, then shows which projects strengthen
                  your case and which ones still need better proof, structure, or storytelling.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {heroSignals.map((signal) => (
                  <div
                    key={signal.title}
                    className="rounded-[1.6rem] border border-[#E7ECEF] bg-white/92 p-4 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                      <signal.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-[#112031]">{signal.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#66727C]">{signal.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] p-6 text-white shadow-[0_28px_70px_-36px_rgba(17,49,59,0.52)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                  Portfolio flow
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Turn scattered project work into a stronger proof-of-skill narrative.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Add your GitHub profile if you want the analysis to carry that context too.",
                  "Enter project names and clear descriptions of what each project does and your role in it.",
                  "Generate overall portfolio scores plus per-project breakdowns.",
                  "Review the suggestions to decide which projects need more depth, clarity, or stronger outcomes.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E3C26D]" />
                    <p className="text-sm leading-6 text-[#EAF4F5]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.3rem] border border-[#28515A] bg-[#234651] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                  Connected workflow
                </p>
                <p className="mt-2 text-sm leading-6 text-[#EAF4F5]">
                  This page supports Resume Studio and Interview Prep by helping users identify which
                  projects are worth highlighting, rewriting, or defending more strongly.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                  Current live path
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#112031]">Portfolio evaluation workspace</h2>
              </div>
              <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                Active
              </span>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">
                  GitHub profile
                  <span className="ml-2 text-xs font-normal text-[#7D8891]">(optional)</span>
                </label>
                <div className="relative">
                  <Github className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A97A1]" />
                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFCFA] py-3 pl-11 pr-4 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#112031]">Projects</label>
                  <button
                    onClick={addProject}
                    className="inline-flex items-center gap-1 rounded-full bg-[#EFFBFA] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#169C8F] transition-colors hover:bg-[#DFF6F2]"
                  >
                    <Plus className="h-3 w-3" />
                    Add Project
                  </button>
                </div>

                {projects.map((p, i) => (
                  <div
                    key={i}
                    className="relative space-y-3 rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4"
                  >
                    {projects.length > 1 && (
                      <button
                        onClick={() => removeProject(i)}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8A97A1] transition-colors hover:text-[#112031]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <input
                      value={p.name}
                      onChange={(e) => updateProject(i, "name", e.target.value)}
                      placeholder="Project name"
                      className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                    />
                    <textarea
                      value={p.desc}
                      onChange={(e) => updateProject(i, "desc", e.target.value)}
                      placeholder="What it does, tech stack, complexity, business outcome, and the role you played..."
                      className="h-24 w-full resize-none rounded-[1.2rem] border border-[#E7ECEF] bg-white px-4 py-3 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    Analyze Portfolio
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                What you receive
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Overall project depth and hiring-attractiveness scores.",
                  "Per-project score breakdowns rather than one flat opinion.",
                  "Suggestions to make each project more compelling.",
                  "A portfolio summary that helps decide what to keep highlighting.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#EFFBFA] text-[#169C8F]">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-[#46535D]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F7FBFB_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                Where this fits next
              </p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    title: "Strengthen resume proof",
                    body: "Use the best projects to support stronger bullets and portfolio-ready evidence in Resume Studio.",
                  },
                  {
                    title: "Prepare project defense",
                    body: "Carry the strongest projects into Interview Prep for better storytelling and technical defense.",
                  },
                  {
                    title: "Refine public signal",
                    body: "Use stronger project framing in LinkedIn and portfolio-facing surfaces too.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#FF6D4A]" />
                    <div>
                      <p className="text-sm font-semibold text-[#112031]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#66727C]">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
          <AnalysisHistoryCards
            key={historyKey}
            analysisType="portfolio"
            onSelect={handleHistorySelect}
            labelExtractor={(result) => ({
              label: result?.projects?.map((p: any) => p.name).slice(0, 3).join(", ") || "Portfolio Analysis",
              sublabel: `Depth: ${result?.overall_depth_score || 0}%`,
            })}
          />
        </div>
        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="portfolio" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            onClick={() => {
              setMode("input");
              setResult(null);
            }}
            className="text-sm text-[#66727C] transition-colors hover:text-[#112031]"
          >
            ← New portfolio analysis
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
              Portfolio Results
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#112031]">Project Quality Analysis</h1>
            <p className="mt-1 text-sm text-[#66727C]">
              <span className="font-medium text-[#FF6D4A]">{result.projects.length}</span> projects analyzed from a hiring perspective
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-[#E7ECEF] bg-white/90 px-4 py-3 text-sm text-[#66727C]">
            Review which projects deserve more depth, better framing, or stronger business proof
          </div>
        </div>
      </div>

      {/* Project Information Metadata Section (QA Bug Fix) */}
      <div className="rounded-[1.6rem] border border-[#E7ECEF] bg-white/95 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          <Github className="h-4 w-4 text-[#0D9488]" /> Project & Repository Context
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Project / Repositories</span>
            <p className="mt-1 font-bold text-[#0F172A] truncate">
              {result.projects.map((p) => p.name).join(", ") || "Analyzed Project"}
            </p>
          </div>
          <div className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Repository URL</span>
            <p className="mt-1 font-bold text-[#0F172A] truncate">
              {githubUrl ? githubUrl : "Manual Text Input"}
            </p>
          </div>
          <div className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Scan Type</span>
            <p className="mt-1 font-bold text-[#0F172A]">
              Full Depth & Recruiter Attraction Audit
            </p>
          </div>
          <div className="rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Analysis Date</span>
            <p className="mt-1 font-bold text-[#0F172A]">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
              Technical substance
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#112031]">Project Depth</h3>
          </div>
          <div className="flex justify-center">
            <ScoreRing
              score={result.overall_depth_score}
              size={160}
              strokeWidth={10}
              label="Project Depth"
              sublabel={
                result.overall_depth_score >= 75
                  ? "Strong"
                  : result.overall_depth_score >= 50
                    ? "Average"
                    : "Needs Work"
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
              Recruiter appeal
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#112031]">Hiring Attractiveness</h3>
          </div>
          <div className="flex justify-center">
            <ScoreRing
              score={result.overall_attractiveness_score}
              size={160}
              strokeWidth={10}
              label="Hiring Attractiveness"
              sublabel={
                result.overall_attractiveness_score >= 75
                  ? "Excellent"
                  : result.overall_attractiveness_score >= 50
                    ? "Good"
                    : "Improve"
              }
            />
          </div>
        </motion.div>
      </div>

      {result.summary && (
        <motion.div
          className="rounded-[1.8rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#112031]">Portfolio Summary</h3>
              <p className="mt-1 text-sm leading-7 text-[#46535D]">{result.summary}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {result.projects.map((p, i) => (
          <motion.div
            key={p.name}
            className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <h3 className="text-lg font-semibold text-[#112031]">{p.name}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                <ScoreBar label="Project Depth" score={p.depth_score} delay={0.3 + i * 0.08} />
              </div>
              <div className="rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                <ScoreBar
                  label="Hiring Attractiveness"
                  score={p.attractiveness_score}
                  delay={0.4 + i * 0.08}
                />
              </div>
            </div>
            <div className="mt-4 rounded-[1.4rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                Recommendation
              </p>
              <p className="mt-2 text-sm leading-7 text-[#112031]">{p.suggestion}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="portfolio" />
    </div>
  );
};

export default PortfolioAnalyzer;
