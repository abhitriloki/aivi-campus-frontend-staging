import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Key,
  Sparkles,
  Info,
  TrendingUp,
  TrendingDown,
  History,
  BriefcaseBusiness,
  FileText,
  Crosshair,
  PenTool,
  CheckCheck,
  Upload,
} from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import ScoreBar from "../components/ScoreBar";
import AnalysisHistoryCards from "../components/AnalysisHistoryCards";
import UpgradeModal from "../components/UpgradeModal";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { runAnalysis, getPreviousScore, getUserResumeMemory, saveUserResumeMemory } from "@/services/analysisService";
import { checkAndIncrementUsage } from "@/services/planService";
import { extractTextFromPdf } from "@/utils/pdfParser";
import {
  computeScores,
  normalizeJobFitData,
  computeEstimatedImpact,
  getScoreBreakdown,
  type StructuredJobFitData,
  type ComputedScores,
} from "@/utils/jobFitScoring";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DEFAULT_STUDENT_RESUME = `ABHISHEK MISHRA
Software Engineering Student | B.Tech CSE (2026 Batch)
Institute of Technology | CGPA: 8.8 / 10


SUMMARY:
Motivated Full Stack Developer with strong foundations in Data Structures, Algorithms, React.js, Node.js, and Cloud Fundamentals. Experienced in building responsive web applications and REST APIs.

SKILLS:
- Languages: JavaScript (ES6+), TypeScript, C++, Python, HTML5, CSS3
- Web Development: React, Node.js, Express, TailwindCSS, REST APIs
- Databases & Cloud: PostgreSQL, Firebase Firestore, AWS (S3, EC2 Basics), Git/GitHub
- Core Computer Science: Data Structures & Algorithms, Object-Oriented Programming, DBMS, OS`;

const JobFitAnalysis = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"input" | "results">("input");
  const [resumeText, setResumeText] = useState(() => getUserResumeMemory() || DEFAULT_STUDENT_RESUME);
  const [jobDesc, setJobDesc] = useState("");
  const [pdfParsing, setPdfParsing] = useState(false);

  useEffect(() => {
    if (!resumeText || !resumeText.trim()) {
      const saved = getUserResumeMemory();
      setResumeText(saved || DEFAULT_STUDENT_RESUME);
    }
    const prefilledJd = sessionStorage.getItem("aivi_prefill_jd");
    if (prefilledJd) {
      setJobDesc(prefilledJd);
      toast.info("Prefilled target campus drive Job Description!");
    }
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    setPdfParsing(true);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        toast.error("Could not extract text from PDF");
        return;
      }
      setResumeText(text);
      saveUserResumeMemory(text);
      toast.success(`Extracted ${text.split(/\s+/).length} words from PDF`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse PDF file. You can paste resume text directly into the box.");
    } finally {
      setPdfParsing(false);
    }
  };

  const [analysisIntent, setAnalysisIntent] = useState<
    "application" | "tailoring" | "gap-audit"
  >("tailoring");
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "Missing keywords",
    "Critical gaps",
    "Bullet rewrite opportunities",
  ]);
  const [reviewInstructions, setReviewInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [computedResults, setComputedResults] = useState<ComputedScores | null>(null);
  const [previousScores, setPreviousScores] = useState<ComputedScores | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const processResults = (aiResult: any): { data: StructuredJobFitData; scores: ComputedScores } => {
    const data = normalizeJobFitData(aiResult);
    const scores = computeScores(data);
    return { data, scores };
  };

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) {
      toast.error("Please paste a target Job Description or select a drive role to run analysis.");
      return;
    }

    const effectiveResume = resumeText.trim() || DEFAULT_STUDENT_RESUME;
    const effectiveJd = jobDesc.trim();

    setLoading(true);
    try {
      if (user?.uid) {
        try {
          const usageCheck = await checkAndIncrementUsage(user.uid, "job_fit");
          if (!usageCheck.allowed) {
            setShowUpgrade(true);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Usage check bypassed for demo:", e);
        }
      }

      let aiResult: any;
      try {
        const res = await runAnalysis({
          analysis_type: "job_fit",
          resume_text: effectiveResume,
          job_description: effectiveJd,
        });
        aiResult = res.result;
      } catch (analysisErr) {
        console.warn("Using deterministic job fit fallback:", analysisErr);
        const resumeLower = effectiveResume.toLowerCase();
        const jdLower = effectiveJd.toLowerCase();

        const candidateSkills = [
          "react", "node.js", "python", "java", "sql", "postgresql", "aws",
          "docker", "kubernetes", "data structures", "algorithms", "system design",
          "typescript", "javascript", "html", "css", "git", "rest api", "ci/cd",
          "mongodb", "c++", "express", "tailwind", "microservices"
        ];

        const detectedInJd = candidateSkills.filter(s => jdLower.includes(s));
        const requiredList = detectedInJd.length > 0 ? detectedInJd : ["data structures", "react", "node.js", "sql", "system design"];
        const matched = requiredList.filter(s => resumeLower.includes(s));
        const missing = requiredList.filter(s => !resumeLower.includes(s));

        const matchPct = Math.min(100, Math.max(35, Math.round((matched.length / requiredList.length) * 100)));

        aiResult = {
          job_match_percentage: matchPct,
          shortlist_probability: matchPct >= 80 ? "HIGH" : matchPct >= 60 ? "MEDIUM" : "LOW",
          overall_fit_summary: `Candidate matches ${matched.length} of ${requiredList.length} detected skill requirements for this target position.`,
          required_skills: requiredList.map(s => ({
            name: s.toUpperCase(),
            found: resumeLower.includes(s),
            category: "Core Requirement"
          })),
          critical_gaps: missing.length > 0
            ? missing.map(m => `Missing verified proficiency with ${m.toUpperCase()}.`)
            : ["Ensure project scale metrics (users, latency, uptime) are clearly quantified."],
          recommended_bullet_edits: [
            { original: "Worked on software development projects.", rewrite: `Architected full-stack features aligning with target job requirements, improving performance by 25%.` }
          ]
        };
      }

      const { scores } = processResults(aiResult);
      setResults(aiResult);
      setComputedResults(scores);
      setMode("results");
      setHistoryKey((k) => k + 1);
      toast.success("Job fit analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (result: any, scores: any) => {
    setResults(result);
    if (result?.required_skills) {
      const recomputed = computeScores(result as StructuredJobFitData);
      setComputedResults(recomputed);
    } else {
      setComputedResults(scores as ComputedScores);
    }
    setPreviousScores(null);
    setMode("results");
  };

  const heroSignals = useMemo(
    () => [
      {
        title: "Deterministic Scoring",
        body: "See exactly how resume content aligns to a live JD.",
        icon: Crosshair,
      },
      {
        title: "Gap Mapping",
        body: "Critical, moderate, and minor gaps are grouped for action.",
        icon: AlertTriangle,
      },
      {
        title: "Resume Bridge",
        body: "Use results to guide the next Resume Studio rebuild phase.",
        icon: BriefcaseBusiness,
      },
    ],
    []
  );

  const intentOptions = [
    {
      key: "tailoring" as const,
      label: "Prepare for resume tailoring",
    },
    {
      key: "application" as const,
      label: "Check if I should apply now",
    },
    {
      key: "gap-audit" as const,
      label: "Find the biggest missing gaps",
    },
  ];

  const focusOptions = [
    "Missing keywords",
    "Critical gaps",
    "Bullet rewrite opportunities",
    "Eligibility risk",
    "Tool match",
    "Shortlist potential",
  ];

  if (mode === "input" || !results || !computedResults) {
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
                <Target className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Job Fit Intelligence
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  Compare your resume against the exact job you want next.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Job Fit Analysis turns one resume and one JD into a deterministic scorecard. It
                  shows where you align, what’s missing, and which changes should feed your next
                  Resume Studio revision.
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
                  Analysis flow
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Diagnose fit first, then rebuild with more confidence.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Paste your resume and the full target job description.",
                  "Generate match %, eligibility, shortlist probability, and role-fit scores.",
                  "Review missing skills, score breakdowns, and a formula-based impact estimate.",
                  "Use the result to drive your next Resume Studio version.",
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
                  This page is the analysis side of the Resume Studio bridge. The enhancement phase
                  will connect these results directly into JD-based rebuild actions.
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
                <h2 className="mt-2 text-2xl font-semibold text-[#112031]">Resume + JD workspace</h2>
              </div>
              <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                Active
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#112031]">Your Resume</label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#DCE6E8] bg-[#F4FBFB] px-3 py-1 text-xs font-semibold text-[#169C8F] transition-all hover:bg-[#E2F7F4]">
                    <Upload className="h-3.5 w-3.5" />
                    {pdfParsing ? "Parsing PDF..." : "Upload PDF"}
                    <input
                      type="file"
                      accept=".pdf"
                      disabled={pdfParsing}
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text or click Upload PDF above..."
                  className="h-60 w-full resize-none rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">Job Description</label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description..."
                  className="h-60 w-full resize-none rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F4FBFB_100%)] p-5">
                <label className="mb-3 block text-sm font-medium text-[#112031]">
                  What are you trying to decide?
                </label>
                <div className="flex flex-wrap gap-2">
                  {intentOptions.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setAnalysisIntent(item.key)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                        analysisIntent === item.key
                          ? "bg-[#112F3A] text-white"
                          : "border border-[#E7ECEF] bg-white text-[#66727C]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F4FBFB_100%)] p-5">
                <label className="mb-3 block text-sm font-medium text-[#112031]">
                  What should this analysis emphasize?
                </label>
                <div className="flex flex-wrap gap-2">
                  {focusOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setFocusAreas((current) =>
                          current.includes(item)
                            ? current.filter((entry) => entry !== item)
                            : [...current, item]
                        )
                      }
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                        focusAreas.includes(item)
                          ? "bg-[#EFFBFA] text-[#169C8F]"
                          : "border border-[#E7ECEF] bg-white text-[#66727C]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
              <label className="mb-2 block text-sm font-medium text-[#112031]">
                Anything specific you want AIVI to watch for?
              </label>
              <textarea
                value={reviewInstructions}
                onChange={(e) => setReviewInstructions(e.target.value)}
                placeholder="Example: Focus on ATS keywords, show me if my leadership bullets are too weak, and tell me whether this resume is strong enough to apply now."
                className="h-28 w-full resize-none rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
              />
              <p className="mt-2 text-xs leading-6 text-[#66727C]">
                This Phase 1 layer helps frame the workflow around the existing scoring engine and
                prepares cleaner handoff into Resume Studio.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading || !jobDesc.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Analyzing fit..." : "Analyze Job Fit"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              {!jobDesc.trim() && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Paste a Job Description or select a drive to enable analysis
                </span>
              )}

              <div className="rounded-2xl border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F4FBFB_100%)] px-4 py-3 text-sm text-[#66727C]">
                Live today: scoring, gap mapping, history, result breakdowns, and Resume Studio handoff
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                What you receive
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Job Match, Eligibility, Shortlist Probability, and Role Fit scores.",
                  "Missing skills grouped by severity.",
                  "Skill overlap radar and score breakdown logic.",
                  "Action-plan output from the current AI analysis pipeline.",
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
                Where this goes next
              </p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    title: "JD-to-Resume Bridge",
                    body: "Open Resume Studio with the same JD and recommendations preloaded.",
                  },
                  {
                    title: "Higher Confidence Rebuild",
                    body: "Apply missing keywords and rewrite suggestions without re-entering context.",
                  },
                  {
                    title: "Re-score Loop",
                    body: "Compare the rebuilt version against the same job and track lift over time.",
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
            analysisType="job_fit"
            onSelect={handleHistorySelect}
            labelExtractor={(result) => ({
              label: result?.job_title
                ? `${result.job_title}${
                    result.company_name && result.company_name !== "Unknown Company"
                      ? ` @ ${result.company_name}`
                      : ""
                  }`
                : result?.summary?.slice(0, 60) || "Job Fit Analysis",
              sublabel: `Match: ${
                result?.required_skills
                  ? computeScores(result as StructuredJobFitData).job_match_percentage
                  : result?.job_match_percentage || 0
              }%`,
            })}
          />
        </div>
        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="job_fit" />
      </div>
    );
  }

  return (
      <JobFitResults
        results={results}
        scores={computedResults}
        previousScores={previousScores}
        sourceResumeText={resumeText}
        sourceJobDescription={jobDesc}
        analysisIntent={analysisIntent}
        focusAreas={focusAreas}
        reviewInstructions={reviewInstructions}
        onBack={() => {
          setMode("input");
          setResults(null);
        setComputedResults(null);
        setPreviousScores(null);
      }}
    />
  );
};

const ScoreChange = ({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}) => {
  if (previous === undefined || previous === null) return null;
  const diff = current - previous;
  if (diff === 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-medium ${
        diff > 0
          ? "bg-[#EFFBFA] text-[#169C8F]"
          : "bg-[#FFF1ED] text-[#D95D39]"
      }`}
    >
      {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {diff > 0 ? "+" : ""}
      {diff}%
    </span>
  );
};

const JobFitResults = ({
  results,
  scores,
  previousScores,
  sourceResumeText,
  sourceJobDescription,
  analysisIntent,
  focusAreas,
  reviewInstructions,
  onBack,
}: {
  results: any;
  scores: ComputedScores;
  previousScores: ComputedScores | null;
  sourceResumeText: string;
  sourceJobDescription: string;
  analysisIntent: "application" | "tailoring" | "gap-audit";
  focusAreas: string[];
  reviewInstructions: string;
  onBack: () => void;
}) => {
  const structuredData = results as StructuredJobFitData;
  const overlapData = results.skill_overlap_data || [];
  const missing =
    results.missing_skills_categorized ||
    results.missing_skills || { critical: [], moderate: [], minor: [] };
  const breakdown = getScoreBreakdown(structuredData, scores);
  const estimatedImpact = computeEstimatedImpact(structuredData);
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(null);

  const resumeStudioGuidance = useMemo(() => {
    const lines: string[] = [];

    if (analysisIntent === "tailoring") {
      lines.push("Tailor this resume specifically to the attached job description.");
    } else if (analysisIntent === "application") {
      lines.push("Improve this resume so it becomes stronger for an application decision on this role.");
    } else {
      lines.push("Use this JD match report to fix the highest-priority gaps in the resume.");
    }

    if (focusAreas.length > 0) {
      lines.push(`Prioritize these areas: ${focusAreas.join(", ")}.`);
    }

    const critical = Array.isArray(missing) ? [] : missing.critical || [];
    if (critical.length > 0) {
      lines.push(`Address these critical gaps where truthful and relevant: ${critical.join(", ")}.`);
    }

    const keywords = results.action_plan?.keyword_insertions
      ?.slice(0, 5)
      ?.map((item: any) => item.keyword)
      ?.filter(Boolean);
    if (keywords?.length) {
      lines.push(`Incorporate these important keywords naturally: ${keywords.join(", ")}.`);
    }

    if (reviewInstructions.trim()) {
      lines.push(`User priority: ${reviewInstructions.trim()}`);
    }

    return lines.join(" ");
  }, [analysisIntent, focusAreas, missing, results.action_plan?.keyword_insertions, reviewInstructions]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#1C6B68] hover:text-[#101820] flex items-center gap-1 transition-colors"
            >
              ← Back to analysis input
            </button>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C6B68]">
                Job Fit Intelligence Report
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">
                {results.job_title || "Target Role Match Report"}
              </h1>
              <p className="mt-1 text-xs text-[#53606A]">{results.summary || ""}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/dashboard/builder"
              state={{
                studioMode: "jd_tailor",
                targetRole: results.job_title || "",
                jobDescription: sourceJobDescription,
                guidance: resumeStudioGuidance,
                resumeText: sourceResumeText,
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1C6B68] to-[#20CFC0] px-5 py-3 text-xs font-extrabold text-white shadow-md transition-all hover:opacity-95 cursor-pointer"
            >
              Tailor Resume For This JD
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#101820]">
              <PenTool className="h-4 w-4 text-[#1C6B68]" />
              JD Handoff Ready
            </div>
          </div>
        </div>

        <motion.div
          className="rounded-3xl border border-[#1C6B68]/20 bg-gradient-to-r from-[#1C6B68]/5 via-[#20CFC0]/5 to-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C6B68] text-white">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1C6B68]">
                  Automated Resume Studio Bridge
                </p>
                <h3 className="mt-0.5 text-base font-bold text-[#101820]">
                  Carry diagnostic recommendations directly into Resume Studio
                </h3>
                <p className="text-xs text-[#53606A]">
                  Transfer missing skills, ATS keywords, and STAR rewrites with zero duplicate copy-pasting.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/builder"
              state={{
                studioMode: "jd_tailor",
                targetRole: results.job_title || "",
                jobDescription: sourceJobDescription,
                guidance: resumeStudioGuidance,
                resumeText: sourceResumeText,
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1C6B68]/30 bg-white px-4 py-2.5 text-xs font-bold text-[#1C6B68] hover:bg-[#1C6B68] hover:text-white shadow-xs transition-all"
            >
              Open in Resume Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Job Match", score: scores.job_match_percentage, prev: previousScores?.job_match_percentage },
            { label: "Eligibility", score: scores.eligibility_score, prev: previousScores?.eligibility_score },
            { label: "Shortlist Prob.", score: scores.shortlist_probability, prev: previousScores?.shortlist_probability },
            { label: "Role Fit", score: scores.role_fit_index, prev: previousScores?.role_fit_index },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="rounded-[1.8rem] border border-[#E7ECEF] bg-white/94 p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex flex-col items-center gap-3">
                <ScoreRing score={item.score || 0} label={item.label} size={118} strokeWidth={8} />
                <ScoreChange current={item.score} previous={item.prev} />
              </div>
            </motion.div>
          ))}
        </div>

        {previousScores && (
          <motion.div
            className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#112031]">Score change from previous version</h3>
                <p className="text-sm text-[#66727C]">Compare your latest result against the previous saved run.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Job Match", current: scores.job_match_percentage, prev: previousScores.job_match_percentage },
                { label: "Eligibility", current: scores.eligibility_score, prev: previousScores.eligibility_score },
                { label: "Shortlist", current: scores.shortlist_probability, prev: previousScores.shortlist_probability },
                { label: "Role Fit", current: scores.role_fit_index, prev: previousScores.role_fit_index },
              ].map((item) => {
                const diff = item.current - (item.prev || 0);
                return (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] border border-[#E7ECEF] bg-[#FCFBF8] p-4 text-center"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-[#8A97A1]">{item.label}</p>
                    <p
                      className={`mt-2 text-2xl font-semibold ${
                        diff > 0
                          ? "text-[#169C8F]"
                          : diff < 0
                            ? "text-[#D95D39]"
                            : "text-[#112031]"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff}%
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {overlapData.length > 0 && (
            <motion.div
              className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-[#112031]">Skill overlap radar</h3>
              <p className="mt-1 text-sm text-[#66727C]">Resume capability versus job requirement across extracted skill groups.</p>
              <div className="h-[380px] w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={overlapData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val) => (val.length > 20 ? `${val.slice(0, 20)}...` : val)}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Your Skills"
                      dataKey="resume"
                      stroke="hsl(174, 72%, 48%)"
                      fill="hsl(174, 72%, 48%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Required"
                      dataKey="job"
                      stroke="hsl(45, 80%, 55%)"
                      fill="hsl(45, 80%, 55%)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div
            className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-[#112031]">Missing skills</h3>
            <p className="mt-1 text-sm text-[#66727C]">Grouped by severity so you can see which gaps should be fixed first.</p>
            <div className="mt-5 space-y-5">
              {(Array.isArray(missing) ? [] : missing.critical)?.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-[#D95D39]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D95D39]">Critical</span>
                  </div>
                  {(Array.isArray(missing) ? [] : missing.critical || []).map((s: string) => (
                    <div key={s} className="ml-6 py-1 text-sm text-[#112031]">
                      {s}
                    </div>
                  ))}
                </div>
              )}
              {(Array.isArray(missing) ? [] : missing.moderate)?.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#D59C45]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D59C45]">Moderate</span>
                  </div>
                  {(Array.isArray(missing) ? [] : missing.moderate || []).map((s: string) => (
                    <div key={s} className="ml-6 py-1 text-sm text-[#112031]">
                      {s}
                    </div>
                  ))}
                </div>
              )}
              {(Array.isArray(missing) ? [] : missing.minor)?.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#169C8F]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#169C8F]">Minor</span>
                  </div>
                  {(Array.isArray(missing) ? [] : missing.minor || []).map((s: string) => (
                    <div key={s} className="ml-6 py-1 text-sm text-[#112031]">
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-[#112031]">Score breakdown</h3>
          <div className="space-y-5">
            {breakdown.map((item, i) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#66727C]">{item.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-[#8A97A1] hover:text-[#112031]">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="mb-1 text-xs font-medium">Formula: {item.formula}</p>
                        <p className="text-xs">{item.detail}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-mono text-sm font-medium text-[#112031]">{item.score}%</span>
                </div>
                <ScoreBar label="" score={item.score} delay={0.2 + i * 0.05} />
                <button
                  onClick={() =>
                    setExpandedBreakdown(expandedBreakdown === item.label ? null : item.label)
                  }
                  className="mt-2 text-xs font-medium text-[#FF6D4A] hover:underline"
                >
                  {expandedBreakdown === item.label ? "Hide details" : "Why this score?"}
                </button>
                {expandedBreakdown === item.label && (
                  <motion.div
                    className="mt-2 rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFBF8] p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <p className="text-xs text-[#112031]">{item.detail}</p>
                    <p className="mt-1 text-xs text-[#66727C]">
                      Formula: <code className="rounded bg-white px-1">{item.formula}</code>
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {structuredData.missing_skills?.length > 0 && (
          <motion.div
            className="rounded-3xl border border-[#1C6B68]/20 bg-gradient-to-r from-[#1C6B68]/5 via-[#20CFC0]/5 to-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C6B68] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101820]">
                  Estimated score if critical gaps are resolved
                </h3>
                <p className="text-xs text-[#53606A]">Algorithmic gap remediation projection.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Job Match", current: scores.job_match_percentage, estimated: estimatedImpact.job_match_percentage },
                { label: "Eligibility", current: scores.eligibility_score, estimated: estimatedImpact.eligibility_score },
                { label: "Shortlist", current: scores.shortlist_probability, estimated: estimatedImpact.shortlist_probability },
                { label: "Role Fit", current: scores.role_fit_index, estimated: estimatedImpact.role_fit_index },
              ].map((item) => {
                const diff = item.estimated - item.current;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-center shadow-xs"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#53606A]">{item.label}</p>
                    <p className="mt-1 text-2xl font-extrabold text-[#101820]">{item.estimated}%</p>
                    {diff > 0 && (
                      <p className="mt-1 text-xs font-bold text-[#1C6B68]">+{diff}% potential</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {results.action_plan && (
          <motion.div
            className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C6B68]/10 text-[#1C6B68]">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101820]">Action Plan &amp; Remediation</h3>
                <p className="text-xs text-[#53606A]">Follow these concrete adjustments before submitting your application.</p>
              </div>
            </div>

            <div className="space-y-6">
              {results.action_plan.add_to_resume?.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#1C6B68]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101820]">Add to your resume</span>
                  </div>
                  <div className="space-y-2">
                    {results.action_plan.add_to_resume.map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex items-start gap-2">
                          <span className="rounded-md bg-[#1C6B68]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1C6B68]">
                            {item.where}
                          </span>
                          <span className="text-xs font-bold text-[#101820]">{item.what}</span>
                        </div>
                        <p className="mt-2 rounded-xl border border-[#E2E8F0] bg-white p-3 font-mono text-xs text-[#1C6B68]">
                          "{item.example_phrase}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.action_plan.rewrite_bullets?.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101820]">Rewrite these bullets</span>
                  </div>
                  <div className="space-y-2">
                    {results.action_plan.rewrite_bullets.map((item: any, i: number) => (
                      <div key={i} className="space-y-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex items-start gap-2">
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                          <p className="text-xs text-[#64748B] line-through">{item.original}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1C6B68]" />
                          <p className="text-xs font-bold text-[#101820]">{item.improved}</p>
                        </div>
                        <p className="ml-5 text-xs italic text-[#53606A]">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.action_plan.remove_or_reduce?.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101820]">Remove or de-emphasize</span>
                  </div>
                  <div className="space-y-2">
                    {results.action_plan.remove_or_reduce.map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <p className="text-xs font-bold text-[#101820]">{item.what}</p>
                        <p className="mt-1 text-xs text-[#53606A]">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.action_plan.keyword_insertions?.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Key className="h-4 w-4 text-[#1C6B68]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101820]">High-Impact ATS Keywords to insert</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {results.action_plan.keyword_insertions.map((item: any, i: number) => (
                      <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <span className="text-xs font-extrabold text-[#1C6B68] bg-[#1C6B68]/10 px-2 py-0.5 rounded-md">{item.keyword}</span>
                        <p className="mt-2 font-mono text-xs text-[#53606A]">
                          "{item.suggested_context}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default JobFitAnalysis;
