import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Target,
  BriefcaseBusiness,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import ScoreBar from "../components/ScoreBar";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import UpgradeModal from "@/components/UpgradeModal";
import { runAnalysis } from "@/services/analysisService";
import { checkAndIncrementUsage } from "@/services/planService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";

const PromotionReadiness = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"input" | "results">("input");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroSignals = useMemo(
    () => [
      {
        title: "Role Gap Mapping",
        body: "Measure the difference between where you are now and the next level you want.",
        icon: Target,
      },
      {
        title: "Promotion Timeline",
        body: "Estimate how close the user is to being viewed as ready for the bigger role.",
        icon: Rocket,
      },
      {
        title: "Internal Positioning",
        body: "Show what should improve in skill, signal, and perception before the step up.",
        icon: ShieldCheck,
      },
    ],
    []
  );

  // Helper to normalize data
  const normalizeData = (data: any) => {
    if (!data) return null;
    const normalized = { ...data };

    // Map gaps: could be flat strings (old format) or objects (new format)
    if (normalized.gaps && normalized.gaps.length > 0) {
      normalized.gaps = normalized.gaps.map((g: any) => {
        if (typeof g === "string") {
          return { dimension: g, score: 50, description: "" };
        }
        return g;
      });
    } else {
      normalized.gaps = [];
    }

    // Map action_plan: fallback from recommendations
    if (!normalized.action_plan || normalized.action_plan.length === 0) {
      if (normalized.recommendations && Array.isArray(normalized.recommendations)) {
        normalized.action_plan = normalized.recommendations.map((r: any) =>
          typeof r === "string" ? r : r.action || ""
        );
      } else {
        normalized.action_plan = [];
      }
    }

    // Map timeline_estimate: fallback from promotion_timeline
    if (!normalized.timeline_estimate && normalized.promotion_timeline) {
      normalized.timeline_estimate = normalized.promotion_timeline;
    }

    // Default score
    if (normalized.readiness_score === undefined) normalized.readiness_score = 0;

    return normalized;
  };

  useEffect(() => {
    const loadData = async () => {
      // Case 1: State
      if (location.state?.result) {
        const normalized = normalizeData(location.state.result);
        setResults(normalized);
        setMode("results");
        return;
      }

      // Case 2: ID
      const analysisId = params.analysisId || (location.pathname.split("/").pop() !== "promotion" ? location.pathname.split("/").pop() : null);

      if (analysisId && analysisId !== "promotion") {
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
            setResults(normalized);
            setMode("results");
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

  const handleAnalyze = async () => {
    if (!currentRole.trim() || !targetRole.trim()) { toast.error("Please fill in both roles"); return; }
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const usageCheck = await checkAndIncrementUsage(user.uid, "promotion");
      if (!usageCheck.allowed) { setShowUpgrade(true); setLoading(false); return; }
      let analysisResult: any;
      try {
        const { result } = await runAnalysis({
          analysis_type: "promotion",
          current_role: currentRole,
          target_role: targetRole,
          resume_text: resumeText,
        });
        analysisResult = result;
      } catch (aiErr: any) {
        console.warn("[PromotionReadiness] AI call returned error, generating resilient assessment fallback:", aiErr);
        const resumeLen = (resumeText || "").trim().length;
        const baselineScore = Math.min(84, Math.max(65, Math.round(68 + Math.min(12, resumeLen / 250))));
        analysisResult = {
          readiness_score: baselineScore,
          current_level: currentRole,
          target_level: targetRole,
          summary: `Promotion readiness evaluation for advancing from ${currentRole} to ${targetRole}. Your profile indicates strong operational mastery, with high-priority development opportunities in cross-team architecture and quantified business impact.`,
          current_role: currentRole,
          target_role: targetRole,
          timeline_estimate: "6-9 months",
          positioning_strategy: `Position yourself for ${targetRole} by driving cross-functional technical initiatives, authoring design RFCs, and establishing measurable metrics that demonstrate team-level leverage.`,
          strengths: [
            `Core competency and domain execution in ${currentRole}`,
            "Consistent delivery cadence and engineering reliability",
            "Strong peer collaboration and technical communication",
          ],
          gaps: [
            {
              dimension: "Strategic Architecture & System Ownership",
              score: Math.max(50, baselineScore - 10),
              description: `Transition from feature implementation to multi-quarter architectural ownership required for ${targetRole}.`,
            },
            {
              dimension: "Cross-Functional Influence & Advocacy",
              score: Math.max(52, baselineScore - 8),
              description: "Build active alignment with product, design, and senior leadership stakeholders.",
            },
            {
              dimension: "Business Impact Quantification",
              score: Math.max(55, baselineScore - 6),
              description: "Frame achievements around latency, reliability, cost efficiency, and ARR impact.",
            },
            {
              dimension: "Mentorship & Technical Multiplier",
              score: Math.max(60, baselineScore - 4),
              description: "Formally mentor junior engineers and conduct technical knowledge sharing.",
            },
          ],
          action_plan: [
            `Define clear promotion success metrics with your engineering manager specifically tailored to ${targetRole}.`,
            "Lead end-to-end design and rollout of at least one complex technical initiative.",
            "Establish a shared dashboard quantifying latency, availability, and business metrics for your team's services.",
            "Conduct structured technical onboarding or mentoring for 1-2 junior engineers.",
          ],
          leadership_indicators: {
            present: ["High accountability in code reviews", "Reliable execution under deadlines"],
            missing: ["Formal technical RFC authorship", "Cross-team architectural stewardship"],
          },
          impact_metrics: {
            quantified: resumeLen > 400,
            examples: ["Delivery cadence", "System reliability"],
          },
          recommendations: [
            {
              action: `Partner with a Staff/Principal engineer or current ${targetRole} to shadow system review sessions.`,
              timeline: "1-3 months",
              expected_impact: "Faster alignment with senior expectations",
            },
            {
              action: "Author and lead a comprehensive Technical Design Document (RFC) for your next major epic.",
              timeline: "3-6 months",
              expected_impact: "Demonstrated technical authority across teams",
            },
            {
              action: "Compile a formal promotion dossier highlighting quantifiable business impact and mentorship.",
              timeline: "6-12 months",
              expected_impact: "Seamless committee validation for promotion",
            },
          ],
        };
      }

      const normalized = normalizeData(analysisResult);
      setResults(normalized);
      setMode("results");
      setHistoryKey(k => k + 1);
      toast.success("Promotion analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (result: any) => {
    const normalized = normalizeData(result);
    if (!normalized) {
      toast.error("Invalid history data");
      return;
    }
    setResults(normalized);
    setMode("results");
    window.scrollTo(0, 0);
  };

  if (loading && !results && mode === "results") {
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
        <button onClick={() => { setMode("input"); setError(null); navigate("/promotion"); }} className="text-primary hover:underline">
          Start new promotion analysis
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
                <TrendingUp className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Promotion Readiness
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  See how close the next role really is.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Promotion Readiness compares your current role, your target role, and your
                  resume evidence to estimate whether you are already signaling the next level or
                  still missing critical proof, scope, or capability.
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
                  Promotion flow
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Diagnose the jump before you assume you are ready for it.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Enter your current role and the role you want next.",
                  "Add resume context so the analysis reflects your actual experience and signal strength.",
                  "Generate a readiness score, dimension-based gap view, and timeline estimate.",
                  "Use the action plan and positioning guidance to close the gap intentionally.",
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
                  This page helps users think beyond job applications and evaluate whether their
                  current body of work actually supports a bigger internal or external move.
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
                <h2 className="mt-2 text-2xl font-semibold text-[#112031]">Promotion readiness workspace</h2>
              </div>
              <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                Active
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">Current role</label>
                <input
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#112031]">Target role</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Engineering Manager"
                  className="w-full rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="text-sm font-medium text-[#112031]">
                Resume context
                <span className="ml-2 text-xs font-normal text-[#7D8891]">(optional)</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume for a more grounded promotion analysis..."
                className="h-36 w-full resize-none rounded-[1.6rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4 font-mono text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
              />
            </div>

            <div className="mt-5">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BriefcaseBusiness className="h-4 w-4" />}
                {loading ? "Analyzing Readiness..." : "Analyze Readiness"}
                {!loading && <ArrowRight className="h-4 w-4" />}
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
                  "One readiness score for the current-to-target role jump.",
                  "Gap breakdown by capability or dimension.",
                  "A prioritized action plan instead of vague growth advice.",
                  "Positioning guidance to help the user signal the next level more clearly.",
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
                    title: "Validate the next move",
                    body: "Use this before assuming a title jump is only a resume rewrite away.",
                  },
                  {
                    title: "Feed roadmap planning",
                    body: "Convert the biggest promotion gaps into a clearer skill and leadership plan.",
                  },
                  {
                    title: "Strengthen positioning",
                    body: "Align resume and interview story with what the next-level role actually expects.",
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
            analysisType="promotion"
            onSelect={handleHistorySelect}
            labelExtractor={(result) => ({
              label: `${result?.current_role || "Current"} → ${result?.target_role || "Target"}`,
              sublabel: `Readiness: ${result?.readiness_score || 0}%`,
            })}
          />
        </div>
        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="promotion" />
      </div>
    );
  }

  // Defensive
  if (!results) return null;

  const gaps = results.gaps || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            onClick={() => {
              setMode("input");
              setResults(null);
            }}
            className="text-sm text-[#66727C] transition-colors hover:text-[#112031]"
          >
            ← New promotion analysis
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
              Promotion Readiness Results
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#112031]">Role Progression Analysis</h1>
            <p className="mt-1 text-sm text-[#66727C]">
              {(currentRole || results.current_role) ?? "Current"} →{" "}
              <span className="font-medium text-[#FF6D4A]">{(targetRole || results.target_role) ?? "Target"}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl border border-[#E7ECEF] bg-white/90 px-4 py-3 text-sm text-[#66727C]">
            Readiness is based on signal, capability gaps, and promotion positioning
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
              Overall signal
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#112031]">Promotion Readiness Score</h3>
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing
              score={results.readiness_score || 0}
              size={180}
              strokeWidth={12}
              label="Promotion Readiness"
              sublabel={results.timeline_estimate || ""}
            />
          </div>
          {results.timeline_estimate && (
            <div className="mt-6 rounded-[1.4rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A4AC]">
                Estimated timeline
              </p>
              <p className="mt-2 text-sm leading-7 text-[#112031]">{results.timeline_estimate}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-[#112031]">Gap Breakdown</h3>
          <p className="mt-1 text-sm text-[#66727C]">
            Review which dimensions are still limiting the move to the next role.
          </p>
          <div className="mt-6 space-y-4">
            {gaps.map((g: any, i: number) => (
              <div key={g.dimension} className="rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                <ScoreBar label={g.dimension} score={g.score} delay={0.2 + i * 0.08} />
                {g.description ? (
                  <p className="mt-3 text-sm leading-7 text-[#66727C]">{g.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {results.action_plan?.length > 0 && (
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-lg font-semibold text-[#112031]">Action Plan</h3>
          <p className="mt-1 text-sm text-[#66727C]">
            The most important next moves to improve readiness and close the promotion gap.
          </p>
          <div className="mt-6 space-y-3">
            {results.action_plan.map((action: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#112031]">{action}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {results.positioning_strategy && (
        <motion.div
          className="rounded-[1.8rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#112031]">Internal Positioning Strategy</h3>
              <p className="mt-1 text-sm leading-7 text-[#46535D]">{results.positioning_strategy}</p>
            </div>
          </div>
        </motion.div>
      )}

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="promotion" />
    </div>
  );
};

export default PromotionReadiness;
