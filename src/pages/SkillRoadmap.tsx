import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Route,
  BookOpen,
  Clock,
  ExternalLink,
  Award,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Target,
  GraduationCap,
  Layers3,
  Rocket,
  BriefcaseBusiness,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { runAnalysis } from "../services/analysisService";
import { checkAndIncrementUsage } from "../services/planService";
import { toast } from "sonner";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import UpgradeModal from "@/components/UpgradeModal";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";

interface RoadmapSkill {
  name: string;
  importance: string;
  learning_time: string;
  free_resources: string[];
  paid_courses: string[];
  exercise: string;
  project_idea: string;
  certification: string;
  interview_questions: string[];
}

interface RoadmapResult {
  skills: RoadmapSkill[];
  thirty_day_plan: string[];
  sixty_day_plan: string[];
  ninety_day_plan: string[];
}

const plans = ["30-Day Sprint", "60-Day Growth", "90-Day Mastery"];

const SkillRoadmap = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams(); // For /roadmap/:analysisId
  const navigate = useNavigate();

  const [mode, setMode] = useState<"input" | "results">("input");
  const [activePlan, setActivePlan] = useState(0);
  const [expandedSkill, setExpandedSkill] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [missingSkills, setMissingSkills] = useState("");
  const [historyKey, setHistoryKey] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroSignals = useMemo(
    () => [
      {
        title: "Gap Prioritization",
        body: "Turn a loose skill list into a ranked roadmap with urgency and effort clarity.",
        icon: Target,
      },
      {
        title: "30 / 60 / 90 Plan",
        body: "Get a staged learning sequence instead of random upskilling across too many topics.",
        icon: Layers3,
      },
      {
        title: "Proof Of Learning",
        body: "See projects, certifications, exercises, and interview questions for each skill.",
        icon: GraduationCap,
      },
    ],
    []
  );

  const planMeta = [
    {
      title: "30-Day Sprint",
      subtitle: "Immediate learning momentum",
      accent: "Focus",
      icon: Rocket,
    },
    {
      title: "60-Day Growth",
      subtitle: "Role-ready capability building",
      accent: "Build",
      icon: Layers3,
    },
    {
      title: "90-Day Mastery",
      subtitle: "Portfolio, interviews, and positioning",
      accent: "Advance",
      icon: BriefcaseBusiness,
    },
  ];

  const importanceTone = (importance: string) => {
    if (importance === "Critical") {
      return "border-[#FFD8CF] bg-[#FFF1ED] text-[#D95D39]";
    }
    if (importance === "High") {
      return "border-[#F6E3B8] bg-[#FFF8E7] text-[#B7802D]";
    }
    return "border-[#D6ECE6] bg-[#EFFBFA] text-[#169C8F]";
  };

  // Helper to normalize data — maps backend schema to frontend RoadmapSkill shape
  const normalizeData = (data: any) => {
    if (!data) return null;
    const normalized = { ...data };

    // Backend returns "skill_gaps" → frontend expects "skills" with RoadmapSkill shape
    if (!normalized.skills && normalized.skill_gaps) {
      normalized.skills = normalized.skill_gaps.map((sg: any) => ({
        name: sg.skill || sg.name || "Unknown Skill",
        importance: sg.priority || "Medium",
        learning_time: sg.estimated_weeks ? `${sg.estimated_weeks} weeks` : "4 weeks",
        free_resources: (sg.resources || []).filter((_: any, i: number) => i % 2 === 0),
        paid_courses: (sg.resources || []).filter((_: any, i: number) => i % 2 === 1),
        exercise: sg.exercise || `Practice ${sg.skill || "this skill"} with a hands-on project`,
        project_idea: sg.project_idea || `Build a project using ${sg.skill || "this skill"}`,
        certification: sg.certification || "See official documentation for certifications",
        interview_questions: sg.interview_questions || [`Explain your experience with ${sg.skill || "this skill"}`],
      }));
    }

    // If skills already exist but may lack required array properties, ensure they're safe
    if (normalized.skills) {
      normalized.skills = normalized.skills.map((s: any) => ({
        ...s,
        free_resources: s.free_resources || [],
        paid_courses: s.paid_courses || [],
        interview_questions: s.interview_questions || [],
        exercise: s.exercise || "",
        project_idea: s.project_idea || "",
        certification: s.certification || "",
        importance: s.importance || s.priority || "Medium",
        learning_time: s.learning_time || "4 weeks",
      }));
    }

    // Backend returns "learning_path" (phases 1/2/3) → frontend expects thirty/sixty/ninety_day_plan
    if (normalized.learning_path && Array.isArray(normalized.learning_path)) {
      const phases = normalized.learning_path;
      if (!normalized.thirty_day_plan) {
        const p1 = phases.find((p: any) => p.phase === 1) || phases[0];
        normalized.thirty_day_plan = p1
          ? (p1.milestones || p1.focus_areas || []).map((m: any) => typeof m === "string" ? m : m.task || "")
          : [];
      }
      if (!normalized.sixty_day_plan) {
        const p2 = phases.find((p: any) => p.phase === 2) || phases[1];
        normalized.sixty_day_plan = p2
          ? (p2.milestones || p2.focus_areas || []).map((m: any) => typeof m === "string" ? m : m.task || "")
          : [];
      }
      if (!normalized.ninety_day_plan) {
        const p3 = phases.find((p: any) => p.phase === 3) || phases[2];
        normalized.ninety_day_plan = p3
          ? (p3.milestones || p3.focus_areas || []).map((m: any) => typeof m === "string" ? m : m.task || "")
          : [];
      }
    }

    // Ensure all plan arrays exist
    if (!normalized.thirty_day_plan) normalized.thirty_day_plan = [];
    if (!normalized.sixty_day_plan) normalized.sixty_day_plan = [];
    if (!normalized.ninety_day_plan) normalized.ninety_day_plan = [];

    // Ensure skills array exists
    if (!normalized.skills) normalized.skills = [];

    return normalized as RoadmapResult;
  };

  // Load data on mount (from state or URL param)
  useEffect(() => {
    const loadData = async () => {
      // Case 1: Data passed via navigation state
      if (location.state?.result) {
        const normalized = normalizeData(location.state.result);
        if (normalized && normalized.skills?.length > 0) {
          setResult(normalized);
          setMode("results");
        }
        return;
      }

      // Case 2: ID in URL (e.g. /campus/skill-roadmap/:analysisId)
      const lastSegment = location.pathname.split("/").filter(Boolean).pop();
      const isRouteSlug = !lastSegment || lastSegment === "roadmap" || lastSegment === "skill-roadmap";
      const analysisId = params.analysisId || (!isRouteSlug ? lastSegment : null);

      if (analysisId && !isRouteSlug) {
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

            if (normalized && normalized.skills?.length > 0) {
              setResult(normalized);
              setMode("results");
            } else {
              setError("Invalid roadmap data found.");
            }
          } else {
            setError("Roadmap not found.");
          }
        } catch (err) {
          console.error("Error loading roadmap:", err);
          setError("Failed to load roadmap.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [location.state, params, location.pathname]);

  const handleAnalyze = async () => {
    const rawInput = missingSkills.trim();
    if (!rawInput) {
      toast.error("Please enter at least some skills to build a roadmap for.");
      return;
    }

    const skillsList = rawInput.split(",").map(s => s.trim()).filter(Boolean);
    const allowedSingleLetters = new Set(["c", "r"]);
    const validSkillRegex = /^[a-zA-Z0-9+#.\s/-]{2,50}$/;
    const hasValidSkill = skillsList.some(s => {
      const lower = s.toLowerCase();
      if (allowedSingleLetters.has(lower)) return true;
      return lower.length >= 2 && validSkillRegex.test(s) && !/^[0-9]+$/.test(s);
    });

    if (!hasValidSkill) {
      toast.error("Please enter a valid skill (e.g. Python, React, SQL, Machine Learning).");
      return;
    }

    if (!user) { toast.error("Please sign in."); return; }

    const usageCheck = await checkAndIncrementUsage(user.uid, "roadmap");
    if (!usageCheck.allowed) { setShowUpgrade(true); return; }

    setLoading(true);
    setError(null);
    try {
      const skillsList = missingSkills.split(",").map(s => s.trim()).filter(Boolean);
      const payload: any = {
        analysis_type: "roadmap",
        missing_skills: { critical: skillsList.slice(0, 3), moderate: skillsList.slice(3, 6), minor: skillsList.slice(6) },
      };
      if (resumeText && resumeText.trim()) {
        payload.resume_text = resumeText.trim();
      }
      const { result: data } = await runAnalysis(payload);
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
    if (!normalized || !normalized.skills || normalized.skills.length === 0) {
      console.error("Invalid history data:", histResult);
      toast.error("Invalid history data");
      return;
    }
    setResult(normalized);
    setMode("results");
    window.scrollTo(0, 0);
  };

  const activePlanSteps = result
    ? activePlan === 0 ? result.thirty_day_plan : activePlan === 1 ? result.sixty_day_plan : result.ninety_day_plan
    : [];

  // Loading state for fetching via ID
  if (loading && !result && mode === "results") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your roadmap...</p>
      </div>
    );
  }

  // Error state
  if (error && mode === "results") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive opacity-50" />
        <p className="text-muted-foreground">{error}</p>
        <button onClick={() => { setMode("input"); setError(null); navigate("/roadmap"); }} className="text-primary hover:underline">
          Create a new roadmap
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
                <Route className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Skill Roadmap
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  Build a learning roadmap based on the role you actually want.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Skill Roadmap converts your missing skills into a practical 30, 60, and 90-day
                  progression system. Instead of learning randomly, users get resource direction,
                  execution ideas, portfolio proof points, and interview prep for each skill.
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
                  Roadmap flow
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Move from vague skill gaps to one role-ready learning sequence.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "List the skills you need to learn or improve for your next role.",
                  "Optionally add resume context so the roadmap reflects your current baseline.",
                  "Generate a 30 / 60 / 90-day progression instead of one flat checklist.",
                  "Review resources, projects, certifications, and interview preparation for every skill.",
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
                  This is the learning-action layer of AIVI. It works best after Resume Intelligence
                  and Job Fit identify the exact gaps that should shape the roadmap.
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
                <h2 className="mt-2 text-2xl font-semibold text-[#112031]">Roadmap generation workspace</h2>
              </div>
              <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                Active
              </span>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">
                  Skills to learn or strengthen
                </label>
                <textarea
                  value={missingSkills}
                  onChange={(e) => setMissingSkills(e.target.value)}
                  placeholder="e.g. AWS, GraphQL, Docker, Kubernetes, TypeScript, System Design..."
                  className="h-28 w-full resize-none rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
                <p className="text-xs leading-6 text-[#7D8891]">
                  Separate each skill with a comma. Start with the gaps that matter most for your next role.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">
                  Resume context
                  <span className="ml-2 text-xs font-normal text-[#7D8891]">(optional)</span>
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here if you want the roadmap to reflect your current background and experience level..."
                  className="h-40 w-full resize-none rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Route className="h-4 w-4" />
                    Generate Roadmap
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
                  "Prioritized skills with importance and learning-time estimates.",
                  "Three staged plans for sprint, growth, and mastery timelines.",
                  "Free resources, paid courses, practical exercises, and portfolio projects.",
                  "Certification ideas and interview questions for each skill.",
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
                    title: "Support Job Fit",
                    body: "Use missing skills from role analysis to create a more accurate roadmap.",
                  },
                  {
                    title: "Guide Resume Studio",
                    body: "Translate roadmap progress into stronger resume projects and bullets later.",
                  },
                  {
                    title: "Track capability growth",
                    body: "Keep one visible plan for what to learn now, next, and before interviews.",
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
            analysisType="roadmap"
            onSelect={handleHistorySelect}
            labelExtractor={(result) => {
              const skills = result?.skills || result?.skill_gaps || [];
              return {
                label: skills.map((s: any) => s.name || s.skill).slice(0, 3).join(", ") || "Skill Roadmap",
                sublabel: `${skills.length} skills`,
              };
            }}
          />
        </div>

        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="roadmap" />
      </div>
    );
  }

  // Defensive check: Ensure result exists before rendering results view
  if (!result || !result.skills) return null;

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
            ← New roadmap
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
              Skill Roadmap Results
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#112031]">Role-Aligned Learning Plan</h1>
            <p className="mt-1 text-sm text-[#66727C]">
              <span className="font-medium text-[#FF6D4A]">{result.skills.length}</span> prioritized skills mapped into one progression system
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-[#E7ECEF] bg-white/90 px-4 py-3 text-sm text-[#66727C]">
            Use this roadmap after Resume Intelligence and Job Fit expose your biggest gaps
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {planMeta.map((plan, i) => (
          <button
            key={plan.title}
            onClick={() => setActivePlan(i)}
            className={`rounded-[1.7rem] border p-5 text-left transition-all ${
              activePlan === i
                ? "border-[#D9F0EC] bg-[linear-gradient(180deg,#F7FFFD_0%,#FFF8F2_100%)] shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
                : "border-[#E7ECEF] bg-white/94 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                  {plan.accent}
                </div>
                <h3 className="text-lg font-semibold text-[#112031]">{plan.title}</h3>
                <p className="text-sm leading-6 text-[#66727C]">{plan.subtitle}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                <plan.icon className="h-5 w-5" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {activePlanSteps.length > 0 && (
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          key={activePlan}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                {planMeta[activePlan].accent} phase
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#112031]">{plans[activePlan]} Steps</h3>
            </div>
            <div className="rounded-2xl bg-[#F3FBFA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
              {activePlanSteps.length} milestones
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {activePlanSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#112031]">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {result.skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="overflow-hidden rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <button
              onClick={() => setExpandedSkill(expandedSkill === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-[#FCFCFA]"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${importanceTone(skill.importance)}`}>
                  {skill.importance}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#112031]">{skill.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#66727C]">
                    <Clock className="h-4 w-4 text-[#169C8F]" />
                    Estimated learning time: {skill.learning_time}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 shrink-0 text-[#8A97A1] transition-transform ${expandedSkill === i ? "rotate-90" : ""}`}
              />
            </button>

            {expandedSkill === i && (
              <motion.div
                className="space-y-5 border-t border-[#E7ECEF] px-5 pb-5 pt-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                      Free Resources
                    </h4>
                    <div className="space-y-2.5">
                      {skill.free_resources.length > 0 ? (
                        skill.free_resources.map((r) => (
                          <div key={r} className="flex items-start gap-2 text-sm leading-7 text-[#112031]">
                            <BookOpen className="mt-1 h-4 w-4 shrink-0 text-[#169C8F]" />
                            <span>{r}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#7D8891]">No free resources suggested in this run.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                      Paid Courses
                    </h4>
                    <div className="space-y-2.5">
                      {skill.paid_courses.length > 0 ? (
                        skill.paid_courses.map((r) => (
                          <div key={r} className="flex items-start gap-2 text-sm leading-7 text-[#112031]">
                            <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#FF6D4A]" />
                            <span>{r}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#7D8891]">No paid courses suggested in this run.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F7FBFB_100%)] p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                      Practical Exercise
                    </h4>
                    <p className="text-sm leading-7 text-[#112031]">{skill.exercise || "No exercise suggested."}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F7FBFB_100%)] p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                      Portfolio Project Idea
                    </h4>
                    <p className="text-sm leading-7 text-[#112031]">{skill.project_idea || "No project idea suggested."}</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                        Recommended Certification
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-[#112031]">
                        {skill.certification || "No certification suggested."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#E7ECEF] bg-white p-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A97A1]">
                    Interview Questions
                  </h4>
                  <div className="space-y-2.5">
                    {skill.interview_questions.length > 0 ? (
                      skill.interview_questions.map((q, qi) => (
                        <div key={qi} className="flex items-start gap-3 rounded-2xl bg-[#FCFCFA] px-4 py-3">
                          <span className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#FF6D4A]">
                            Q{qi + 1}
                          </span>
                          <p className="text-sm leading-7 text-[#112031]">{q}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7D8891]">No interview questions suggested in this run.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="roadmap" />
    </div>
  );
};

export default SkillRoadmap;
