import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ScanSearch,
  Radar,
  ShieldCheck,
  RefreshCw,
  History,
} from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import ScoreBar from "../components/ScoreBar";
import InsightCard from "../components/InsightCard";
import ResumeUploadForm from "@/components/resume/ResumeUploadForm";
import UpgradeModal from "@/components/UpgradeModal";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Radar as RechartsRadar,
} from "recharts";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import { runAnalysis, getLatestAnalysis, saveAnalysisResult } from "@/services/analysisService";
import { checkAndIncrementUsage } from "@/services/planService";
import { getDb } from "@/integrations/firebase/client";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ReportHeader,
  ReportSectionCard,
  Chip,
  WeakBetterBlock,
  ReportLoadingState,
} from "@/components/report";
import { Button } from "@/components/ui/button";
import {
  ResumeAnalysisResult,
  BulletImprovement,
  ScoreGuidanceItem,
  normalizeResumeAnalysis,
} from "@/types/resumeAnalysis";

const ResumeIntelligence = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"upload" | "results">("upload");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [results, setResults] = useState<ResumeAnalysisResult | null>(null);
  const [expandedGuidance, setExpandedGuidance] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    // Treat Firestore as the sole source of truth for real Campus OS.
    // Unscoped browser caching is removed to prevent cross-user/cross-tenant report leakage.
    setResults(null);
    setExpandedGuidance(null);
    setMode("upload");

    if (!user?.uid) {
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    let isCurrent = true;

    const loadLatest = async () => {
      try {
        const data = await getLatestAnalysis(user.uid, "resume");
        if (!isCurrent) return;
        if (data && (data.overall_score !== undefined || data.scores)) {
          setResults(normalizeResumeAnalysis(data));
          setMode("results");
        } else {
          setMode("upload");
        }
      } catch (err) {
        console.warn("Could not fetch latest Firestore analysis:", err);
        if (isCurrent) {
          setMode("upload");
        }
      } finally {
        if (isCurrent) {
          setInitialLoading(false);
        }
      }
    };
    loadLatest();

    return () => {
      isCurrent = false;
    };
  }, [user?.uid]);

  const handleAnalyze = async (resumeText: string) => {
    setLoading(true);
    const effectiveUid = user?.uid || "demo-student-uid";
    try {
      const usageCheck = await checkAndIncrementUsage(effectiveUid, "resume");
      if (!usageCheck.allowed && user) {
        toast.error(`Usage check failed. Plan: ${usageCheck.plan}, Reason: ${usageCheck.reason}`);
        setShowUpgrade(true);
        setLoading(false);
        return;
      }

      const { result } = await runAnalysis({
        analysis_type: "resume",
        resume_text: resumeText,
        userId: user?.uid,
      });

      if (user?.uid) {
        try {
          const firestoreDb = getDb();
          const existingQ = query(
            collection(firestoreDb, "resumes"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const existingSnap = await getDocs(existingQ);
          if (!existingSnap.empty) {
            await updateDoc(doc(firestoreDb, "resumes", existingSnap.docs[0].id), {
              content: resumeText,
              updatedAt: serverTimestamp(),
            });
          } else {
            await addDoc(collection(firestoreDb, "resumes"), {
              userId: user.uid,
              content: resumeText,
              title: "My Resume",
              createdAt: serverTimestamp(),
            });
          }
        } catch {}
      }

      setResults(normalizeResumeAnalysis(result));
      setMode("results");
      toast.success("Resume analysis complete!");
    } catch (error: any) {
      if (error.message?.includes("DPDP consent required")) {
        window.dispatchEvent(new CustomEvent("open-dpdp-modal"));
        toast.error("DPDP consent required. Please review and accept the data privacy notice.");
      } else {
        toast.error(error.message || "Analysis failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const heroSignals = useMemo(
    () => [
      {
        title: "Overall Strength",
        body: "See a single resume score before you optimize anything else.",
        icon: ShieldCheck,
      },
      {
        title: "Radar Breakdown",
        body: "Understand ATS, keyword, clarity, metrics, leadership, and technical depth.",
        icon: Radar,
      },
      {
        title: "Rewrite Guidance",
        body: "Review weak bullets, missing sections, and specific improvement notes.",
        icon: Lightbulb,
      },
    ],
    []
  );

  if (initialLoading) {
    return <ReportLoadingState label="Loading your resume intelligence history..." />;
  }

  if (mode === "upload" || !results) {
    return (
      <div className="space-y-8 pb-16">
        {/* Editorial Header */}
        <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] blur-2xl" />
            <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
          </div>
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
                <ScanSearch className="h-3.5 w-3.5" /> AI Career Intelligence Suite
              </p>
              <h1 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.015em]">
                Resume Intelligence &amp; ATS Audit
              </h1>
              <p className="mt-1 max-w-2xl text-[13.5px] text-slate-400 leading-relaxed">
                Upload your PDF or paste your resume text to compute your institutional Employability Score (AES), keyword density, STAR metrics, and AI rewrite recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
          <ResumeUploadForm onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Analysis History Section */}
        <div className="space-y-3 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <History className="h-4 w-4 text-primary" /> Past Resume Analysis History
          </div>
          <AnalysisHistoryCards
            analysisType="resume"
            labelExtractor={(row) => ({
              label: row?.targetRole ? `Target: ${row.targetRole}` : "Resume Intelligence Audit",
              sublabel: row?.overallScore ? `ATS Score: ${row.overallScore}%` : undefined,
            })}
            onSelect={(item) => {
              setResults(normalizeResumeAnalysis(item));
              setMode("results");
            }}
          />
        </div>

        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="resume" />
      </div>
    );
  }

  const scores = results.scores || {};
  const guidance = results.score_guidance || {};

  const radarData = [
    { subject: "ATS Match", score: scores.ats_compatibility || 0 },
    { subject: "Keywords", score: scores.keyword_optimization || 0 },
    { subject: "Tech Depth", score: scores.technical_depth || 0 },
    { subject: "Leadership", score: scores.leadership_signal || 0 },
    { subject: "STAR Impact", score: scores.quantification || 0 },
    { subject: "Clarity", score: scores.clarity || 0 },
  ];

  const overallScore = results.overall_score || 0;
  const weakBullets = results.weak_bullets || [];

  const verdictColor = (verdict: string) => {
    if (verdict === "Good") return "text-[#169C8F]";
    if (verdict === "Needs Improvement") return "text-[#D59C45]";
    return "text-[#D95D39]";
  };

  const verdictIcon = (verdict: string) => {
    if (verdict === "Good") return <CheckCircle className="h-4 w-4 text-[#169C8F]" />;
    if (verdict === "Not Applicable") return <AlertCircle className="h-4 w-4 text-[#8A97A1]" />;
    return <AlertCircle className="h-4 w-4 text-[#D59C45]" />;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top action strip */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
            Resume Intelligence Dossier
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Seniority: <span className="font-semibold text-primary">{results.seniority_level || "—"}</span> &bull; AI Dimensional Analysis &amp; ATS Audit Results
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="font-bold text-xs"
          onClick={() => setMode("upload")}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-primary" /> Analyze Another Resume
        </Button>
      </div>

      {/* Overall Guidance Banner */}
      {results.overall_guidance && (
        <motion.div
          className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                Executive Strategy Guidance
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-slate-800">
                {results.overall_guidance}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Score Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-card lg:col-span-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Overall Strength</p>
          <ScoreRing score={overallScore} size={140} />
          <p className="mt-4 font-display font-bold text-lg text-slate-900">
            {overallScore >= 80 ? "Placement Ready" : overallScore >= 65 ? "Competitive Foundation" : "Needs Optimization"}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
            Calibrated against institutional tier-1 corporate placement standards.
          </p>
        </div>

        {/* Radar Chart */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-card lg:col-span-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dimensional Competency Radar</p>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11, fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <RechartsRadar name="Score" dataKey="score" stroke="#1C6B68" fill="#20CFC0" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Score Guidance Accordion */}
      {Object.keys(guidance).length > 0 && (
        <ReportSectionCard
          title="Detailed Score Guidance"
          subtitle="Dimension-by-dimension diagnostic breakdown and concrete improvement steps"
          icon={TrendingUp}
        >
          <div className="space-y-3">
            {Object.entries(guidance).map(([key, g]: [string, ScoreGuidanceItem]) => {
              const isExpanded = expandedGuidance === key;
              const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              const dimensionScore = scores[key] || 0;
              return (
                <div key={key} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FAFBFB] transition-all">
                  <button
                    type="button"
                    onClick={() => setExpandedGuidance(isExpanded ? null : key)}
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {verdictIcon(g.verdict)}
                      <span className="text-sm font-bold text-slate-900">{label}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${verdictColor(g.verdict)} bg-slate-100`}>
                        {dimensionScore}/100 — {g.verdict}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="space-y-3 border-t border-[#E2E8F0] bg-white p-4 pt-3">
                      <p className="text-sm leading-relaxed text-slate-600">{g.why}</p>
                      {g.how_to_improve?.length > 0 && (
                        <div className="pt-2">
                          <h5 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                            <RefreshCw className="h-3.5 w-3.5 text-primary" /> How to Improve
                          </h5>
                          <ul className="space-y-2">
                            {g.how_to_improve.map((tip: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                  {i + 1}
                                </span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ReportSectionCard>
      )}

      {/* Bullet Point AI Enhancements */}
      {weakBullets.length > 0 && (
        <ReportSectionCard
          title="Bullet Point AI Enhancements"
          subtitle="Weak vs. Better before-and-after recommendations using the STAR framework"
          icon={Sparkles}
        >
          <div className="space-y-3">
            {weakBullets.map((item: BulletImprovement, idx: number) => (
              <WeakBetterBlock
                key={idx}
                original={item.original}
                suggestion={item.suggestion}
              />
            ))}
          </div>
        </ReportSectionCard>
      )}

      {/* Skills & Sections */}
      <div className="grid gap-5 md:grid-cols-3">
        {results.missing_sections && results.missing_sections.length > 0 && (
          <ReportSectionCard title="Missing Sections">
            <div className="flex flex-wrap gap-2">
              {results.missing_sections.map((section: string) => (
                <Chip key={section} variant="warning">
                  {section}
                </Chip>
              ))}
            </div>
          </ReportSectionCard>
        )}

        {results.buzzwords_detected && results.buzzwords_detected.length > 0 && (
          <ReportSectionCard title="Overused Buzzwords">
            <div className="flex flex-wrap gap-2">
              {results.buzzwords_detected.map((word: string) => (
                <Chip key={word} variant="danger">
                  {word}
                </Chip>
              ))}
            </div>
          </ReportSectionCard>
        )}

        {results.top_skills && results.top_skills.length > 0 && (
          <ReportSectionCard title="Detected Technical Skills">
            <div className="flex flex-wrap gap-2">
              {results.top_skills.map((skill: string) => (
                <Chip key={skill} variant="success">
                  {skill}
                </Chip>
              ))}
            </div>
          </ReportSectionCard>
        )}
      </div>

      {results.summary && (
        <ReportSectionCard title="AI Diagnostic Executive Summary">
          <p className="text-sm leading-relaxed text-[#334155]">{results.summary}</p>
        </ReportSectionCard>
      )}

      {/* History Section at bottom */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <History className="h-4 w-4 text-primary" /> Past Resume Analysis History
        </div>
        <AnalysisHistoryCards
          analysisType="resume"
          labelExtractor={(row) => ({
            label: row?.targetRole ? `Target: ${row.targetRole}` : "Resume Intelligence Audit",
            sublabel: row?.overallScore ? `ATS Score: ${row.overallScore}%` : undefined,
          })}
          onSelect={(item) => {
            setResults(normalizeResumeAnalysis(item));
            setMode("results");
          }}
        />
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="resume" />
    </div>
  );
};

export default ResumeIntelligence;
