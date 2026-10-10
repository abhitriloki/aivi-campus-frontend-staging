import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Linkedin,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Loader2,
  ShieldCheck,
  Wand2,
  Plus,
  ExternalLink,
  Info,
  Check,
  Search,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import ScoreBar from "../components/ScoreBar";
import InsightCard from "../components/InsightCard";
import ResumeUploadForm from "@/components/resume/ResumeUploadForm";
import UpgradeModal from "@/components/UpgradeModal";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import {
  analyzeLinkedInProfile,
  optimizeLinkedInProfile,
  getLatestAnalysis,
  getUserResumeMemory,
} from "@/services/analysisService";
import { checkAndIncrementUsage, getUserPlanInfo, PlanInfo } from "@/services/planService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LinkedInAnalyzer = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"upload" | "results">("upload");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<PlanInfo | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [urlSaved, setUrlSaved] = useState(false);
  const [connectedProfile, setConnectedProfile] = useState<any>(null);
  const [authenticatingLinkedIn, setAuthenticatingLinkedIn] = useState(false);

  const memoryText = getUserResumeMemory();
  const autoInitialText = useMemo(() => {
    if (connectedProfile) {
      const profileLink = (linkedinUrl && !linkedinUrl.includes("/in/V_"))
        ? linkedinUrl
        : (connectedProfile.profileUrl && !connectedProfile.profileUrl.includes("/in/V_") ? connectedProfile.profileUrl : "");
      const header = `NAME: ${connectedProfile.name || ""}\nEMAIL: ${connectedProfile.email || ""}${profileLink ? `\nLINKEDIN PROFILE: ${profileLink}` : ""}\n\n`;
      if (memoryText && memoryText.trim()) {
        return header + memoryText;
      }
      return header;
    }
    return memoryText;
  }, [connectedProfile, memoryText, linkedinUrl]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "LINKEDIN_AUTH_CODE") {
        const { code, error } = event.data;
        if (error) {
          toast.error(`LinkedIn Login Error: ${error}`);
          setAuthenticatingLinkedIn(false);
          return;
        }
        if (code) {
          try {
            setAuthenticatingLinkedIn(true);
            const { httpsCallable } = await import("firebase/functions");
            const { functions } = await import("@/integrations/firebase/client");
            const fn = httpsCallable(functions, "exchangeLinkedInCode");
            const redirectUri = window.location.origin + "/auth/linkedin/callback";
            const res: any = await fn({ code, redirectUri });
            if (res.data?.profile) {
              setConnectedProfile(res.data.profile);
              if (res.data.profile.profileUrl) {
                setLinkedinUrl(res.data.profile.profileUrl);
                setUrlSaved(true);
              }
              toast.success(`Connected to LinkedIn as ${res.data.profile.name}!`);
            }
          } catch (err: any) {
            toast.error(err.message || "Failed to authenticate LinkedIn account");
          } finally {
            setAuthenticatingLinkedIn(false);
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleLinkedInConnect = () => {
    const clientId = "86mup2dj0eqm14";
    const redirectUri = window.location.origin + "/auth/linkedin/callback";
    const scope = "openid profile email";
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem("linkedin_oauth_state", state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    const width = 600;
    const height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const popup = window.open(authUrl, "LinkedInAuth", `width=${width},height=${height},top=${top},left=${left}`);
    setAuthenticatingLinkedIn(true);

    if (!popup) {
      toast.error("Pop-up was blocked by browser. Please allow pop-ups or paste your profile text below.");
      setAuthenticatingLinkedIn(false);
      return;
    }

    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer);
          setAuthenticatingLinkedIn(false);
        }
      } catch {
        // Suppress Cross-Origin-Opener-Policy access errors
      }
    }, 1200);

    // Timeout safety fallback: 45 seconds
    setTimeout(() => {
      clearInterval(timer);
      setAuthenticatingLinkedIn(false);
    }, 45000);
  };

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      try {
        const plan = await getUserPlanInfo(user.uid);
        setUserPlan(plan);

        const data = await getLatestAnalysis(user.uid, "linkedin_analyze");
        if (data && data.id) {
          setAnalysisId(data.id);
          setResults(data);
          setMode("results");

          const optData = await getLatestAnalysis(user.uid, "linkedin_optimize");
          if (optData && optData.parentAnalysisId === data.id) {
            setOptimizedData(optData);
          }
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [user]);

  const handleAnalyze = async (profileText: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const usageCheck = await checkAndIncrementUsage(user.uid, "linkedin_analyze");
      if (!usageCheck.allowed) {
        toast.error(`Usage check failed. Reason: ${usageCheck.reason}`);
        setShowUpgrade(true);
        return;
      }

      const response = await analyzeLinkedInProfile(profileText);
      setResults(response.result);
      setAnalysisId(response.analysisId);
      setOptimizedData(null);
      setMode("results");
      toast.success("LinkedIn profile analyzed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!user || !analysisId) return;

    const isCampus = typeof window !== "undefined" && (
      window.location.pathname.startsWith("/campus") ||
      window.location.hostname.includes("aivicampus.com") ||
      userPlan?.plan_type === "pro"
    );
    if (!isCampus && userPlan?.plan_type === "free") {
      setShowUpgrade(true);
      return;
    }

    setOptimizing(true);
    try {
      const response = await optimizeLinkedInProfile(analysisId, targetRole, industry);
      setOptimizedData(response.result);

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "linkedin_optimize_used");
      }

      toast.success("LinkedIn profile beautifully optimized!");
    } catch (error: any) {
      toast.error(error.message || "Optimization failed. Upgrade might be required.");
      if (
        error.message?.includes("Upgrade required") ||
        error?.code === "functions/resource-exhausted"
      ) {
        setShowUpgrade(true);
      }
    } finally {
      setOptimizing(false);
    }
  };

  const heroSignals = useMemo(
    () => [
      {
        title: "Search Visibility",
        body: "Review how recruiter-friendly your profile looks before they ever click.",
        icon: Search,
      },
      {
        title: "Authority Tone",
        body: "Measure headline strength, positioning, and professional credibility.",
        icon: ShieldCheck,
      },
      {
        title: "Rewrite Layer",
        body: "Generate a stronger headline, about section, and experience rewrite.",
        icon: Wand2,
      },
    ],
    []
  );

  if (initialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF6D4A]"></div>
      </div>
    );
  }

  if (mode === "upload" || !results) {
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
                <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                Tailored Resume & LinkedIn Best-Fit Optimizer
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  Optimize your resume and LinkedIn profile for maximum recruiter visibility.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Analyze your profile like a conversion surface, not just a social page. This
                  workspace scores visibility, positioning, authority tone, and keyword alignment,
                  then unlocks a rewrite layer for stronger recruiter outcomes.
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
                  Review flow
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Diagnose your profile first, then rewrite it for stronger visibility.
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Paste a PDF export or full text version of your LinkedIn profile.",
                  "Generate authority, headline, keyword, and recruiter-visibility insights.",
                  "Unlock premium recruiter metrics when the plan allows it.",
                  "Run the rewrite layer to create a stronger headline, about section, and experience wording.",
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
                  Profile strategy
                </p>
                <p className="mt-2 text-sm leading-6 text-[#EAF4F5]">
                  This is the public-profile layer of the product. It should feel related to Resume
                  Intelligence, but focused on recruiter discovery and positioning rather than ATS.
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
                <h2 className="mt-2 text-2xl font-semibold text-[#112031]">LinkedIn & Resume Best-Fit Workspace</h2>
              </div>
              <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                Active
              </span>
            </div>

            {/* LinkedIn Identity Verification Card */}
            <div className="mb-6 rounded-[1.4rem] border border-[#CBD5E1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-5 shadow-sm space-y-4">
              {connectedProfile ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    {connectedProfile.picture ? (
                      <img src={connectedProfile.picture} alt={connectedProfile.name} className="h-11 w-11 rounded-full border border-emerald-300 shadow-sm" />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-extrabold text-sm">
                        {connectedProfile.name?.[0] || "L"}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-[#0F172A]">{connectedProfile.name}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <Check className="h-3 w-3 text-emerald-600" /> Identity Verified
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{connectedProfile.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectedProfile(null);
                      toast.info("LinkedIn identity disconnected.");
                    }}
                    className="text-xs font-semibold text-[#64748B] hover:text-rose-600 underline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                        Verify Your LinkedIn Identity
                      </h3>
                      <p className="text-xs text-[#55626D] mt-0.5">Authenticate with 1-click to attach your verified profile identity to recruiter audits.</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={authenticatingLinkedIn}
                      onClick={handleLinkedInConnect}
                      className="bg-[#0A66C2] hover:bg-[#084e96] text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {authenticatingLinkedIn ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <Linkedin className="h-4 w-4 fill-current" />
                          Verify LinkedIn Identity
                        </>
                      )}
                    </button>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => {
                          setLinkedinUrl(e.target.value);
                          setUrlSaved(false);
                        }}
                        placeholder="https://www.linkedin.com/in/yourprofile"
                        className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#112031] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#169C8F]/30"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (linkedinUrl.trim()) {
                            setUrlSaved(true);
                            toast.success("LinkedIn profile URL attached as context!");
                          } else {
                            toast.error("Please enter a valid LinkedIn URL");
                          }
                        }}
                        className="shrink-0 bg-[#169C8F] hover:bg-[#138479] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        {urlSaved ? "Saved ✓" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex items-start gap-2.5 text-xs text-[#475569]">
                <Info className="h-4 w-4 text-[#169C8F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0F172A]">How to run your AI Recruiter Audit:</p>
                  <p className="mt-1 leading-relaxed text-[#55626D]">
                    LinkedIn restricts automated web scraping of private profiles. To perform an instant AI audit, <strong>Verify your account above</strong>, then <strong>upload your LinkedIn PDF export</strong> (LinkedIn Profile → <em>More</em> → <em>Save to PDF</em>), or <strong>paste your profile text</strong> below.
                  </p>
                </div>
              </div>
            </div>

            {connectedProfile && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">
                    {memoryText?.trim()
                      ? "Auto-filled Headline, Experience & Education from Resume Memory!"
                      : `Identity Verified (${connectedProfile.name}). Upload your profile PDF export below (LinkedIn → More → Save to PDF) or paste text to run full Recruiter Audit.`}
                  </span>
                </div>
                {memoryText?.trim() && (
                  <button
                    type="button"
                    onClick={() => handleAnalyze(autoInitialText)}
                    disabled={loading}
                    className="bg-[#169C8F] hover:bg-[#138479] text-white font-extrabold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                  >
                    {loading ? "Analyzing..." : "⚡ Run AI Audit Now"}
                  </button>
                )}
              </div>
            )}

            <ResumeUploadForm
              onAnalyze={handleAnalyze}
              loading={loading}
              title="LinkedIn Profile Intelligence"
              description="Transform your LinkedIn profile from a static digital resume into a recruiter magnet. Upload a PDF export of your profile or paste the full profile text to review visibility, authority tone, and conversion potential."
              showHeader={false}
              initialText={autoInitialText}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                What you receive
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Authority score and recruiter-facing visibility signals.",
                  "Headline, keyword, and search optimization review.",
                  "Strengths and weaknesses segmented for faster profile fixes.",
                  "Rewrite-ready optimization output when the feature is used.",
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
                    title: "Refine Positioning",
                    body: "Use this to align your public profile with the roles you want next.",
                  },
                  {
                    title: "Support Resume Studio",
                    body: "Mirror the stronger headline, tone, and positioning in your resume.",
                  },
                  {
                    title: "Improve recruiter flow",
                    body: "Keep resume, LinkedIn, and Job Fit outputs telling the same story.",
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
            analysisType="linkedin_analyze"
            onSelect={async (historyItem) => {
              const actualResult = historyItem.result || historyItem;
              setResults(actualResult);
              setAnalysisId(historyItem.id || (actualResult as any)?.id);
              setMode("results");
              setOptimizedData(null);
            }}
            labelExtractor={(row) => {
              const r = row.result || row;
              return {
                label: r.career_level_detected ? `LinkedIn - ${r.career_level_detected}` : "LinkedIn Analysis",
                sublabel: `Score: ${r.overall_score || row.overall_score || 0}%`,
              };
            }}
          />
        </div>

        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="resume" />
      </div>
    );
  }

  const activeResults = results?.result || results || {};
  const scores = activeResults?.scores || {};
  const premium = activeResults?.premium_metrics || {};
  const isCampus = typeof window !== "undefined" && (
    window.location.pathname.startsWith("/campus") ||
    window.location.hostname.includes("aivicampus.com") ||
    userPlan?.plan_type === "pro"
  );
  const isFree = !isCampus && userPlan?.plan_type === "free";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B7680]">
            LinkedIn Intelligence Dashboard
          </p>
          <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-extrabold text-[#112031]">
            <Linkedin className="h-6 w-6 text-[#0A66C2]" />
            LinkedIn Analyzer
          </h1>
          <p className="mt-1 text-xs font-semibold text-[#55626D]">
            Career Level:{" "}
            <span className="font-extrabold text-[#FF6D4A]">{activeResults.career_level_detected || "Professional"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setResults(null);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#169C8F] hover:bg-[#138479] px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            + New Analysis
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard title="Authority Score" value={activeResults.overall_score || 72} icon={FileText} delay={0} />
        <InsightCard title="Headline Strength" value={scores.headline_strength || activeResults.headline_strength || 75} icon={TrendingUp} delay={0.1} />
        <InsightCard title="Keyword ROI" value={scores.keyword_optimization || activeResults.keyword_optimization || 70} icon={Lightbulb} delay={0.2} />
        <InsightCard title="Search Visibility" value={scores.recruiter_search_visibility || activeResults.recruiter_search_visibility || 74} icon={CheckCircle} delay={0.3} />
      </div>

      {activeResults.positioning_analysis && (
        <motion.div
          className="rounded-[1.8rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] text-[#E3C26D]">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#112031]">Positioning Analysis</h3>
              <p className="mt-1 text-sm leading-7 text-[#46535D]">{activeResults.positioning_analysis}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-[#112031]">Core Dimensions</h3>
          <div className="space-y-4">
            {Object.entries(scores).map(([key, val], i) => (
              <ScoreBar
                key={key}
                label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                score={val as number}
                delay={0.2 + i * 0.05}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#112031]">
            <Sparkles className="h-5 w-5 text-[#FF6D4A]" />
            Premium Recruiter Metrics
          </h3>
          {isFree ? (
            <div className="flex h-56 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#D9E4E8] bg-[linear-gradient(180deg,#FCFCFA_0%,#F7FBFB_100%)] p-6 text-center">
              <Linkedin className="mb-3 h-8 w-8 text-[#0A66C2]/45" />
              <h4 className="mb-1 font-semibold text-[#112031]">SSI & Conversion Potential Hidden</h4>
              <p className="mb-4 text-xs leading-6 text-[#66727C]">
                Upgrade to Pro to see how recruiters may rank your profile behind the scenes.
              </p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="rounded-2xl bg-[#FF6D4A] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B]"
              >
                Unlock Metrics
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <MetricBar
                label="SSI Prediction"
                value={premium.linkedin_ssi_prediction ?? Math.min(95, Math.round((activeResults.overall_score || 72) * 0.95))}
                tone="blue"
              />
              <MetricBar
                label="Recruiter Visibility"
                value={premium.recruiter_visibility_score ?? Math.min(98, Math.round(scores.recruiter_search_visibility || 75))}
                tone="purple"
              />
              <MetricBar
                label="Conversion Potential"
                value={premium.profile_conversion_potential ?? Math.min(94, Math.round((activeResults.overall_score || 70) * 0.92))}
                tone="green"
              />
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          className="rounded-[1.9rem] border border-[#D6ECE6] bg-[#F7FFFC] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#169C8F]">
            <CheckCircle className="h-5 w-5" />
            Profile Strengths
          </h3>
          <ul className="space-y-2">
            {Array.isArray(activeResults.strengths)
              ? (isFree ? activeResults.strengths.slice(0, 2) : activeResults.strengths).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#112031]">
                    <span className="mt-0.5 text-xs text-[#169C8F]">•</span> {s}
                  </li>
                ))
              : null}
            {isFree && Array.isArray(activeResults.strengths) && activeResults.strengths.length > 2 && (
              <li className="mt-2 text-sm italic text-[#66727C]">
                + {activeResults.strengths.length - 2} more strengths hidden
              </li>
            )}
          </ul>
        </motion.div>

        <motion.div
          className="rounded-[1.9rem] border border-[#F0DDD8] bg-[#FFF8F7] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#D95D39]">
            <AlertCircle className="h-5 w-5" />
            Critical Weaknesses
          </h3>
          <ul className="space-y-2">
            {isFree ? (
              <li className="flex items-center justify-between rounded-[1.2rem] bg-[#FFF1ED] p-3 text-sm text-[#112031]">
                <span>
                  <span className="font-bold text-[#D95D39]">
                    {Array.isArray(activeResults.weaknesses) ? activeResults.weaknesses.length : 0}
                  </span>{" "}
                  critical issues found
                </span>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="rounded-xl border border-[#E7ECEF] bg-white px-3 py-1.5 text-xs font-semibold text-[#112031]"
                >
                  Reveal All
                </button>
              </li>
            ) : Array.isArray(activeResults.weaknesses) ? (
              activeResults.weaknesses.map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#112031]">
                  <span className="mt-0.5 text-xs text-[#D95D39]">•</span> {w}
                </li>
              ))
            ) : null}
          </ul>
        </motion.div>
      </div>

      <motion.div
        className="rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFA_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-[#112031]">
          <Sparkles className="h-5 w-5 text-[#FF6D4A]" />
          LinkedIn AI Rewrite
        </h2>
        <p className="mb-6 text-sm text-[#66727C]">
          Rewrite your profile with stronger metrics, cleaner positioning, and a more executive tone.
        </p>

        {!optimizedData ? (
          <div className="max-w-lg space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#112031]">Target Role (Optional)</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Senior Product Manager"
                className="w-full rounded-2xl border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#112031]">Industry (Optional)</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="FinTech"
                className="w-full rounded-2xl border border-[#E7ECEF] bg-white px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {optimizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Optimizing Profile...
                </>
              ) : (
                <>Generate Optimized Profile Rewrite</>
              )}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="rounded-[1.4rem] border border-[#D9F0EC] bg-[linear-gradient(90deg,#F4FFFD_0%,#FFF8F2_100%)] p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#FF6D4A]">
                Authority Shift Strategy
              </h4>
              <p className="text-sm font-medium text-[#112031]">{optimizedData.authority_positioning_shift}</p>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A97A1]">
                Optimized Headline
              </h4>
              <div className="rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFBF8] p-3 text-sm font-medium text-[#112031]">
                {optimizedData.optimized_headline}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A97A1]">
                Optimized About Section
              </h4>
              <div className="rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFBF8] p-4 text-sm leading-7 text-[#112031] whitespace-pre-wrap">
                {optimizedData.optimized_about}
              </div>
            </div>

            {Array.isArray(optimizedData.optimized_experience) && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A97A1]">
                  Optimized Experience
                </h4>
                <div className="space-y-3">
                  {optimizedData.optimized_experience.map((exp: any, i: number) => (
                    <div key={i} className="rounded-[1.2rem] border border-[#E7ECEF] bg-[#FCFBF8] p-4">
                      <h5 className="mb-2 text-sm font-bold text-[#112031]">{exp.title || "Experience"}</h5>
                      <div className="whitespace-pre-wrap text-sm leading-7 text-[#66727C]">
                        {exp.rewritten_description || exp.description || ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setOptimizedData(null)}
              className="text-sm font-medium text-[#FF6D4A] hover:underline"
            >
              Discard & Regenerate
            </button>
          </div>
        )}
      </motion.div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="resume" />
    </div>
  );
};

const MetricBar = ({
  label,
  value,
  tone,
}: {
  label: string;
  value?: number | null;
  tone: "blue" | "purple" | "green";
}) => {
  const safeVal = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const toneMap = {
    blue: "bg-[#1F86FF]",
    purple: "bg-[#8B5CF6]",
    green: "bg-[#169C8F]",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[#66727C]">{label}</span>
        <span className="font-medium text-[#112031]">{safeVal}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#EEF3F5]">
        <div className={`h-full rounded-full ${toneMap[tone]}`} style={{ width: `${safeVal}%` }}></div>
      </div>
    </div>
  );
};

export default LinkedInAnalyzer;
