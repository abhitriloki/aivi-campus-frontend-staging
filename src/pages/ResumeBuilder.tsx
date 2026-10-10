import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FilePlus2,
  FileText,
  PenTool,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import ResumeUploadForm from "@/components/resume/ResumeUploadForm";
import UpgradeModal from "@/components/UpgradeModal";
import { runAnalysis } from "@/services/analysisService";
import { checkAndIncrementUsage, getUserPlanInfo } from "@/services/planService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import AnalysisHistoryCards from "@/components/AnalysisHistoryCards";
import { useLocation } from "react-router-dom";
import { downloadResumeDocx, downloadResumePdf, type ExportableResumeData } from "@/utils/resumeExport";

interface ResumeData {
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    linkedin_url: string;
    portfolio_url: string;
    location: string;
  };
  summary: string;
  skills: {
    Technical: string[];
    Soft: string[];
    Tools: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    dates: string;
    location: string;
    description: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    dates: string;
    cgpa?: string;
    details: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

type ScreenMode = "input" | "preview";
type StudioMode = "full_rebuild" | "quick_edit" | "jd_tailor" | "first_resume";
type ControlMode = "auto" | "guided";
type ResumeTone = "impact-driven" | "executive" | "concise" | "professional";
type ResumeLength = "keep-structure" | "one-page" | "two-page";

interface FresherProfile {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
  targetRole: string;
  education: string;
  graduationYear: string;
  cgpa: string;
  skills: string;
  projects: string;
  internships: string;
  certifications: string;
  achievements: string;
  responsibilities: string;
}

const studioModeCopy: Record<
  StudioMode,
  {
    title: string;
    status: string;
    detail: string;
    icon: typeof Wand2;
    submitLabel: string;
    helper: string;
  }
> = {
  full_rebuild: {
    title: "Full Rebuild",
    status: "Live",
    detail:
      "Upload or paste your current resume and rebuild it into a stronger, cleaner, role-aware draft.",
    icon: Wand2,
    submitLabel: "Rebuild Resume Draft",
    helper:
      "Best for users who want AIVI to take over the rewrite and produce a polished new version from their existing resume.",
  },
  quick_edit: {
    title: "Quick Edit",
    status: "Live",
    detail:
      "Guide AIVI on what to change in your existing resume instead of forcing a complete rewrite.",
    icon: PenTool,
    submitLabel: "Apply Guided Resume Edits",
    helper:
      "Best for summary rewrites, bullet tightening, ATS improvements, or smaller section-level adjustments.",
  },
  jd_tailor: {
    title: "JD Tailor",
    status: "Live",
    detail:
      "Tailor your resume to a target job description and role while preserving the strongest parts of your existing profile.",
    icon: Target,
    submitLabel: "Tailor Resume For This JD",
    helper:
      "Best for users who already have a resume and want a sharper version for one specific job opening.",
  },
  first_resume: {
    title: "First Resume",
    status: "Live",
    detail:
      "Create a first ATS-ready resume from structured fresher inputs without needing an existing resume file.",
    icon: BriefcaseBusiness,
    submitLabel: "Create First Resume Draft",
    helper:
      "Best for freshers, students, and first-time job seekers who need a professional draft built from scratch.",
  },
};

const guidanceChips = [
  "Make it more ATS friendly",
  "Shorten to 1 page",
  "Rewrite only experience section",
  "Improve summary",
  "Add stronger metrics",
  "Tailor for product roles",
  "Make tone more leadership-focused",
];

const optimizationOptions = [
  "Professional summary",
  "Experience bullets",
  "Skills section",
  "ATS keywords",
  "Project section",
  "Quantification",
  "Formatting clarity",
  "Leadership tone",
];

const toneOptions: { key: ResumeTone; label: string }[] = [
  { key: "impact-driven", label: "Impact-driven" },
  { key: "executive", label: "Executive" },
  { key: "concise", label: "Concise" },
  { key: "professional", label: "Professional" },
];

const lengthOptions: { key: ResumeLength; label: string }[] = [
  { key: "keep-structure", label: "Keep structure" },
  { key: "one-page", label: "1 page" },
  { key: "two-page", label: "2 page" },
];

const fresherExamples = [
  "Built a college project with real users or measurable outcome",
  "Completed internship tasks and what changed because of your work",
  "Relevant certifications, hackathons, campus roles, or competitions",
];

const emptyFresherProfile: FresherProfile = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  location: "",
  targetRole: "",
  education: "",
  graduationYear: "",
  cgpa: "",
  skills: "",
  projects: "",
  internships: "",
  certifications: "",
  achievements: "",
  responsibilities: "",
};

const toggleSelection = (current: string[], item: string) => {
  return current.includes(item)
    ? current.filter((entry) => entry !== item)
    : [...current, item];
};

const buildFresherResumeText = (profile: FresherProfile) => {
  return [
    "FRESHER RESUME PROFILE",
    `Full Name: ${profile.fullName}`,
    `Email: ${profile.email || "Not provided"}`,
    `Phone: ${profile.phone || "Not provided"}`,
    `LinkedIn: ${profile.linkedin || "Not provided"}`,
    `GitHub Profile: ${profile.github || "Not provided"}`,
    `Portfolio: ${profile.portfolio || "Not provided"}`,
    `Location: ${profile.location || "Not provided"}`,
    `Target Role: ${profile.targetRole || "Not provided"}`,
    "",
    "EDUCATION",
    `${profile.education || "Not provided"}`,
    `Graduation Year: ${profile.graduationYear || "Not provided"}`,
    `CGPA / Percentage: ${profile.cgpa || "Not provided"}`,
    "",
    "SKILLS",
    profile.skills || "Not provided",
    "",
    "PROJECTS",
    profile.projects || "Not provided",
    "",
    "INTERNSHIPS / EXPERIENCE",
    profile.internships || "Not provided",
    "",
    "CERTIFICATIONS",
    profile.certifications || "Not provided",
    "",
    "ACHIEVEMENTS",
    profile.achievements || "Not provided",
    "",
    "POSITIONS OF RESPONSIBILITY / LEADERSHIP",
    profile.responsibilities || "Not provided",
  ].join("\n");
};

const buildStudioPayload = ({
  mode,
  resumeText,
  targetRole,
  jobDescription,
  guidance,
  controlMode,
  optimizationTargets,
  tone,
  length,
}: {
  mode: StudioMode;
  resumeText: string;
  targetRole: string;
  jobDescription: string;
  guidance: string;
  controlMode: ControlMode;
  optimizationTargets: string[];
  tone: ResumeTone;
  length: ResumeLength;
}) => {
  const sections = [
    `RESUME STUDIO MODE: ${studioModeCopy[mode].title}`,
    `TARGET ROLE: ${targetRole || "Not provided"}`,
    `CONTROL MODE: ${controlMode === "auto" ? "Let AI fully optimize" : "Follow my instructions closely"}`,
    `RESUME TONE: ${tone}`,
    `LENGTH PREFERENCE: ${length}`,
  ];

  if (optimizationTargets.length > 0) {
    sections.push(`OPTIMIZE THESE AREAS: ${optimizationTargets.join(", ")}`);
  }

  if (guidance.trim()) {
    sections.push(`SPECIFIC USER INSTRUCTIONS:\n${guidance.trim()}`);
  }

  if (mode === "jd_tailor" && jobDescription.trim()) {
    sections.push(`TARGET JOB DESCRIPTION:\n${jobDescription.trim()}`);
  }

  sections.push(`SOURCE RESUME CONTENT:\n${resumeText.trim()}`);
  return sections.join("\n\n");
};

const validateFresherProfile = (profile: FresherProfile) => {
  if (!profile.fullName.trim()) return "Please enter the candidate's full name.";
  if (!profile.targetRole.trim()) return "Please enter a target role for the first resume.";
  if (!profile.education.trim()) return "Please add education details.";
  if (!profile.skills.trim()) return "Please add at least some core skills.";
  if (!profile.projects.trim() && !profile.internships.trim()) {
    return "Please add at least one project or internship experience.";
  }
  return null;
};

const ResumeBuilder = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [screenMode, setScreenMode] = useState<ScreenMode>("input");
  const [studioMode, setStudioMode] = useState<StudioMode>("full_rebuild");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [guidance, setGuidance] = useState("");
  const [controlMode, setControlMode] = useState<ControlMode>("auto");
  const [tone, setTone] = useState<ResumeTone>("impact-driven");
  const [length, setLength] = useState<ResumeLength>("keep-structure");
  const [optimizationTargets, setOptimizationTargets] = useState<string[]>([
    "Professional summary",
    "Experience bullets",
    "ATS keywords",
  ]);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [fresherProfile, setFresherProfile] = useState<FresherProfile>(emptyFresherProfile);
  const [lastSubmittedMode, setLastSubmittedMode] = useState<StudioMode>("full_rebuild");
  const [prefilledResumeText, setPrefilledResumeText] = useState("");

  useEffect(() => {
    const state = location.state as
      | {
          studioMode?: StudioMode;
          targetRole?: string;
          jobDescription?: string;
          guidance?: string;
          resumeText?: string;
        }
      | undefined;

    if (!state) return;

    if (state.studioMode) setStudioMode(state.studioMode);
    if (state.targetRole) setTargetRole(state.targetRole);
    if (state.jobDescription) setJobDescription(state.jobDescription);
    if (state.guidance) {
      setGuidance((current) => (current ? current : state.guidance || ""));
      setControlMode("guided");
    }
    if (state.resumeText) setPrefilledResumeText(state.resumeText);
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const selectedMode = studioModeCopy[studioMode];

  const studioSignals = useMemo(
    () => [
      "Choose the exact resume goal instead of forcing every user into a full rebuild.",
      "Guide the AI with precise edit instructions or let it optimize the whole resume automatically.",
      "Create a first resume for freshers by converting projects, education, and achievements into ATS-ready content.",
    ],
    []
  );

  const handleRunResumeBuild = async (compiledResumeText: string, submittedMode: StudioMode) => {
    if (!user) return;
    setLoading(true);

    try {
      const usageCheck = await checkAndIncrementUsage(user.uid, "resume_rebuild");
      if (!usageCheck.allowed) {
        toast.error(`Upgrade required: ${usageCheck.reason}`);
        setShowUpgrade(true);
        setLoading(false);
        return;
      }

      const { result } = await runAnalysis({
        analysis_type: "resume_rebuild",
        resume_text: compiledResumeText,
        target_role:
          submittedMode === "first_resume"
            ? fresherProfile.targetRole || targetRole
            : targetRole,
      });

      setResumeData(result as ResumeData);
      setLastSubmittedMode(submittedMode);
      setScreenMode("preview");

      const planInfo = await getUserPlanInfo(user.uid);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "resume_rebuild_used", {
          plan_type: planInfo?.plan_type || "free",
          user_role: isAdmin ? "admin" : "user",
          studio_mode: submittedMode,
        });
      }

      toast.success(
        submittedMode === "first_resume"
          ? "First resume draft created successfully!"
          : "Resume studio draft generated successfully!"
      );
    } catch (error: any) {
      if (error.message?.includes("resource-exhausted") || error.message?.includes("Upgrade") || error.message?.includes("Starter or Pro")) {
        setShowUpgrade(true);
      } else {
        const raw = error.message || "";
        const cleanMsg = raw.includes("JSON") || raw.includes("SyntaxError")
          ? "The AI response could not be formatted. Please retry generation."
          : raw
          ? raw.replace(/^AI Error \(\d+\):\s*/i, "").replace(/^SyntaxError:\s*/i, "")
          : "Failed to generate resume. Please try again.";
        toast.error(cleanMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExistingResumeSubmit = async (resumeText: string) => {
    if (studioMode === "jd_tailor" && !jobDescription.trim()) {
      toast.error("Please add the job description you want to tailor this resume for.");
      return;
    }

    const payload = buildStudioPayload({
      mode: studioMode,
      resumeText,
      targetRole,
      jobDescription,
      guidance,
      controlMode,
      optimizationTargets,
      tone,
      length,
    });

    await handleRunResumeBuild(payload, studioMode);
  };

  const handleFirstResumeSubmit = async () => {
    const validation = validateFresherProfile(fresherProfile);
    if (validation) {
      toast.error(validation);
      return;
    }

    const profileText = buildFresherResumeText(fresherProfile);
    const payload = buildStudioPayload({
      mode: "first_resume",
      resumeText: profileText,
      targetRole: fresherProfile.targetRole || targetRole,
      jobDescription,
      guidance,
      controlMode,
      optimizationTargets,
      tone,
      length,
    });

    await handleRunResumeBuild(payload, "first_resume");
  };

  const handleDownloadPdf = async () => {
    if (!resumeData) return;
    try {
      await downloadResumePdf(resumeData as ExportableResumeData, { onePage: length === "one-page" });
      toast.success("PDF downloaded successfully.");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to download PDF.");
    }
  };

  const handleDownloadDocx = async () => {
    if (!resumeData) return;
    try {
      await downloadResumeDocx(resumeData as ExportableResumeData);
      toast.success("DOCX downloaded successfully.");
    } catch (error) {
      console.error("DOCX export failed:", error);
      toast.error("Failed to download DOCX.");
    }
  };

  if (screenMode === "input") {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.section
          className="overflow-hidden rounded-[2.2rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-6 shadow-[0_24px_60px_-34px_rgba(17,32,49,0.18)] lg:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E4ECEA] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6A7680]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Resume Studio
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#112031] md:text-5xl">
                  Choose the right resume workflow before you generate the draft.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[#66727C]">
                  Resume Studio now supports four Phase 1 entry paths. Users can rebuild a resume,
                  guide small edits, tailor to a JD, or create a first resume from fresher inputs
                  without changing the backend analysis engine.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {(Object.entries(studioModeCopy) as [StudioMode, (typeof studioModeCopy)[StudioMode]][]).map(
                  ([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setStudioMode(key)}
                      className={`rounded-[1.6rem] border p-4 text-left shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] transition-all ${
                        studioMode === key
                          ? "border-[#D5E6E3] bg-white/96 ring-2 ring-[#24B7A9]/15"
                          : "border-[#E7ECEF] bg-white/72 hover:bg-white/90"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            studioMode === key
                              ? "bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]"
                              : "bg-[#F4F7F8] text-[#8A97A1]"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            studioMode === key
                              ? "bg-[#112F3A] text-white"
                              : "bg-[#F3F7F8] text-[#7B8892]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-[#112031]">{item.title}</h3>
                      <p className="mt-2 text-xs leading-6 text-[#66727C]">{item.detail}</p>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,#11313B_0%,#173B46_100%)] p-6 text-white shadow-[0_28px_70px_-36px_rgba(17,49,59,0.52)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                  Phase 1 live now
                </p>
                <Sparkles className="h-5 w-5 text-[#E3C26D]" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                {selectedMode.title === "First Resume"
                  ? "Turn fresher inputs into a recruiter-ready resume draft."
                  : "Use one rebuild engine across multiple resume goals."}
              </h2>
              <div className="mt-6 space-y-3">
                {studioSignals.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E3C26D]" />
                    <p className="text-sm leading-6 text-[#EAF4F5]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.3rem] border border-[#28515A] bg-[#234651] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5CCD0]">
                  Current mode
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{selectedMode.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#EAF4F5]">{selectedMode.helper}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                    Active workflow
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#112031]">
                    {selectedMode.title}
                  </h2>
                </div>
                <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
                  {selectedMode.status}
                </span>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.6rem] border border-[#E7ECEF] bg-[linear-gradient(90deg,#FFFDF9_0%,#F4FBFB_100%)] p-5">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#112031]">How should AIVI work?</p>
                    <div className="inline-flex rounded-full border border-[#E6ECEF] bg-white/90 p-1">
                      {[
                        { key: "auto" as const, label: "Let AI fully optimize" },
                        { key: "guided" as const, label: "Follow my instructions closely" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setControlMode(item.key)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                            controlMode === item.key
                              ? "bg-[#112F3A] text-white"
                              : "text-[#66727C]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="mb-2 block text-sm font-medium text-[#112031]">
                    What would you like changed?
                  </label>
                  <textarea
                    value={guidance}
                    onChange={(e) => setGuidance(e.target.value)}
                    placeholder={
                      studioMode === "first_resume"
                        ? "Example: Emphasize projects over coursework, keep the tone confident, and make the summary fresher-friendly."
                        : "Example: Improve the summary, shorten weak bullets, add stronger metrics, and make the resume more ATS friendly."
                    }
                    className="h-36 w-full resize-none rounded-[1.35rem] border border-[#E7ECEF] bg-white px-4 py-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                  />
                  <p className="mt-2 text-xs leading-6 text-[#66727C]">
                    Tell AIVI exactly what to improve, or leave this blank and let it optimize the
                    whole resume automatically.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {guidanceChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() =>
                          setGuidance((current) => (current ? `${current}${current.endsWith(".") ? " " : ". "}${chip}` : chip))
                        }
                        className="rounded-full border border-[#E7ECEF] bg-white px-3 py-2 text-xs font-medium text-[#55626D] transition-colors hover:border-[#D2E7E3] hover:text-[#112031]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
                    <label className="mb-2 block text-sm font-medium text-[#112031]">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder={
                        studioMode === "first_resume"
                          ? "e.g. Software Engineer, Data Analyst"
                          : "e.g. Senior Frontend Engineer, Product Manager"
                      }
                      className="w-full rounded-2xl border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                    />
                  </div>

                  <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
                    <label className="mb-2 block text-sm font-medium text-[#112031]">Resume Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {toneOptions.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setTone(item.key)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                            tone === item.key
                              ? "bg-[#112F3A] text-white"
                              : "border border-[#E7ECEF] bg-[#FCFCFA] text-[#66727C]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
                    <label className="mb-3 block text-sm font-medium text-[#112031]">
                      What should AIVI optimize?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {optimizationOptions.map((item) => (
                        <button
                          key={item}
                          onClick={() =>
                            setOptimizationTargets((current) => toggleSelection(current, item))
                          }
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                            optimizationTargets.includes(item)
                              ? "bg-[#EFFBFA] text-[#169C8F]"
                              : "border border-[#E7ECEF] bg-[#FCFCFA] text-[#66727C]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
                    <label className="mb-3 block text-sm font-medium text-[#112031]">
                      Resume Length
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {lengthOptions.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setLength(item.key)}
                          className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                            length === item.key
                              ? "bg-[#FFF4EF] text-[#FF6D4A]"
                              : "border border-[#E7ECEF] bg-[#FCFCFA] text-[#66727C]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {studioMode === "jd_tailor" && (
                  <div className="rounded-[1.45rem] border border-[#E7ECEF] bg-white p-5">
                    <label className="mb-2 block text-sm font-medium text-[#112031]">
                      Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the target job description here so AIVI can tailor the resume for that exact role."
                      className="h-44 w-full resize-none rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                    />
                  </div>
                )}

                {studioMode === "first_resume" ? (
                  <div className="rounded-[1.6rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFA_100%)] p-5">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                          Fresher input flow
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[#112031]">
                          Create a first resume from structured details
                        </h3>
                      </div>
                      <div className="rounded-2xl bg-[#EFFBFA] p-3 text-[#169C8F]">
                        <FilePlus2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        ["Full Name", "fullName", "e.g. Priya Sharma"],
                        ["Email", "email", "you@example.com"],
                        ["Phone", "phone", "+91 98xxxxxxx"],
                        ["LinkedIn", "linkedin", "linkedin.com/in/yourname"],
                        ["GitHub Profile", "github", "github.com/yourusername"],
                        ["Portfolio", "portfolio", "portfolio link"],
                        ["Location", "location", "City, State"],
                        ["Target Role", "targetRole", "e.g. Data Analyst"],
                        ["Graduation Year", "graduationYear", "2025"],
                        ["CGPA / Percentage", "cgpa", "8.6 CGPA / 82%"],
                      ].map(([label, key, placeholder]) => (
                        <div key={key} className={key === "portfolio" || key === "location" ? "" : ""}>
                          <label className="mb-2 block text-sm font-medium text-[#112031]">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={fresherProfile[key as keyof FresherProfile]}
                            onChange={(e) =>
                              setFresherProfile((current) => ({
                                ...current,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder={placeholder}
                            className="w-full rounded-2xl border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-3 text-sm text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 space-y-4">
                      {[
                        {
                          label: "Education",
                          key: "education",
                          placeholder: "Degree, college, specialization, relevant coursework, honors...",
                        },
                        {
                          label: "Skills",
                          key: "skills",
                          placeholder: "List technical skills, tools, languages, soft skills...",
                        },
                        {
                          label: "Projects",
                          key: "projects",
                          placeholder: "Describe 1-3 projects with what you built, tools used, and the result.",
                        },
                        {
                          label: "Internships / Experience",
                          key: "internships",
                          placeholder: "Add internships, freelance work, training, or any practical experience.",
                        },
                        {
                          label: "Certifications",
                          key: "certifications",
                          placeholder: "Relevant certifications, bootcamps, courses completed...",
                        },
                        {
                          label: "Achievements",
                          key: "achievements",
                          placeholder: "Hackathons, competitions, awards, scholarships...",
                        },
                        {
                          label: "Positions of Responsibility / Leadership",
                          key: "responsibilities",
                          placeholder: "Club roles, event management, leadership responsibilities...",
                        },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="mb-2 block text-sm font-medium text-[#112031]">
                            {field.label}
                          </label>
                          <textarea
                            value={fresherProfile[field.key as keyof FresherProfile]}
                            onChange={(e) =>
                              setFresherProfile((current) => ({
                                ...current,
                                [field.key]: e.target.value,
                              }))
                            }
                            placeholder={field.placeholder}
                            className="h-28 w-full resize-none rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] px-4 py-4 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-[1.35rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4">
                      <p className="text-sm font-semibold text-[#112031]">Helpful fresher inputs</p>
                      <div className="mt-3 space-y-2">
                        {fresherExamples.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#FF6D4A]" />
                            <p className="text-sm leading-6 text-[#66727C]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleFirstResumeSubmit}
                      disabled={loading}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? "Building resume..." : selectedMode.submitLabel}
                      {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <ResumeUploadForm
                    onAnalyze={handleExistingResumeSubmit}
                    loading={loading}
                    showHeader={false}
                    buttonLabel={selectedMode.submitLabel}
                    initialText={prefilledResumeText}
                  />
                )}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <AnalysisHistoryCards
                analysisType="resume_rebuild"
                onSelect={(result, _scores) => {
                  setResumeData(result as ResumeData);
                  setLastSubmittedMode("full_rebuild");
                  setScreenMode("preview");
                }}
                labelExtractor={(row) => ({
                  label: row.personal_info?.first_name
                    ? `Resume - ${row.personal_info.first_name} ${row.personal_info.last_name}`
                    : "Resume Build",
                  sublabel: row.summary
                    ? row.summary.substring(0, 48) + "..."
                    : "Rebuilt Resume",
                })}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                What this mode delivers
              </p>
              <div className="mt-4 space-y-3">
                {[
                  selectedMode.helper,
                  studioMode === "jd_tailor"
                    ? "The job description is packaged into the rebuild context so the draft leans toward that role."
                    : studioMode === "first_resume"
                      ? "Fresher inputs are converted into structured resume content before AIVI writes the final draft."
                      : "Your edit instructions are injected into the rebuild context so the result follows your intent more closely.",
                  "The preview stays print-friendly so the result can still be saved as PDF immediately.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#EFFBFA] text-[#169C8F]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-[#46535D]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F7FBFB_100%)] p-6 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
                Phase 1 rollout included
              </p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    title: "Mode Selection",
                    body: "Users can now choose how they want to work with AIVI before they submit content.",
                  },
                  {
                    title: "Guided AI Box",
                    body: "Resume Studio now captures exact change requests instead of relying only on a target role.",
                  },
                  {
                    title: "Fresher Entry Path",
                    body: "Freshers can build a first resume from projects, education, and achievements without a source resume file.",
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

        <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} analysisType="resume_rebuild" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-[linear-gradient(120deg,#FFFDF9_0%,#F2FBFA_48%,#FFF7F0_100%)] p-5 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            onClick={() => setScreenMode("input")}
            className="flex items-center gap-2 text-sm text-[#66727C] transition-colors hover:text-[#112031]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Studio
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#98A4AC]">
              Resume Studio Output
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#112031]">
              {resumeData?.personal_info.first_name
                ? `${resumeData.personal_info.first_name} ${resumeData.personal_info.last_name}`
                : "Rebuilt Resume Draft"}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="hidden rounded-2xl border border-[#E7ECEF] bg-white/90 px-4 py-3 text-sm text-[#66727C] lg:flex lg:items-center lg:gap-2">
            <Sparkles className="h-4 w-4 text-[#FF6D4A]" />
            Download-ready resume generated
          </div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B]"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button
            onClick={handleDownloadDocx}
            className="flex items-center gap-2 rounded-2xl border border-[#E7ECEF] bg-white px-4 py-3 text-sm font-semibold text-[#112031] shadow-[0_12px_30px_-22px_rgba(17,32,49,0.14)] transition-all hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4 text-[#169C8F]" /> Download DOCX
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#E7ECEF] bg-[linear-gradient(180deg,#FCFBF8_0%,#F8FBFB_100%)] p-4 shadow-[0_24px_60px_-34px_rgba(17,32,49,0.18)]">
        <div className="mb-4 flex flex-wrap items-center gap-2 px-2 no-print">
          <span className="rounded-full bg-[#112F3A] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {studioModeCopy[lastSubmittedMode].title}
          </span>
          {(lastSubmittedMode === "first_resume"
            ? fresherProfile.targetRole || targetRole
            : targetRole) && (
            <span className="rounded-full bg-[#EFFBFA] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#169C8F]">
              Target Role: {lastSubmittedMode === "first_resume" ? fresherProfile.targetRole || targetRole : targetRole}
            </span>
          )}
          <span className="rounded-full bg-[#FFF4EF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF6D4A]">
            Studio Draft
          </span>
        </div>

        <div
          className={`mx-auto max-w-[210mm] rounded-[1.4rem] bg-white text-black shadow-lg print:w-full print:max-w-none print:p-0 print:shadow-none ${
            length === "one-page"
              ? "p-6 md:p-8 space-y-3.5 min-h-[297mm] text-[13px]"
              : "min-h-[297mm] p-8 md:p-12 space-y-6"
          }`}
          id="resume-preview"
        >
          {resumeData && (
            <>
              <div className={`${length === "one-page" ? "mb-3 border-b border-gray-800 pb-3" : "mb-6 border-b-2 border-gray-800 pb-6"} text-center`}>
                <h1 className={`${length === "one-page" ? "mb-1 text-2xl" : "mb-2 text-4xl"} font-bold uppercase tracking-wide`}>
                  {resumeData.personal_info.first_name} {resumeData.personal_info.last_name}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  {resumeData.personal_info.location && <span>{resumeData.personal_info.location}</span>}
                  {resumeData.personal_info.phone && <span>• {resumeData.personal_info.phone}</span>}
                  {resumeData.personal_info.email && <span>• {resumeData.personal_info.email}</span>}
                  {resumeData.personal_info.linkedin_url && (
                    <span>
                      •{" "}
                      <a
                        href={resumeData.personal_info.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        LinkedIn
                      </a>
                    </span>
                  )}
                  {resumeData.personal_info.portfolio_url && (
                    <span>
                      •{" "}
                      <a
                        href={resumeData.personal_info.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        Portfolio
                      </a>
                    </span>
                  )}
                </div>
              </div>

              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Professional Summary
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-800">{resumeData.summary}</p>
                </div>
              )}

              {resumeData.experience && resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Professional Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="mb-1 flex justify-between">
                          <h3 className="font-bold text-gray-900">{exp.role}</h3>
                          <span className="text-sm font-medium text-gray-600">{exp.dates}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                          <span className="italic text-gray-700">{exp.company}</span>
                          <span className="text-sm text-gray-500">{exp.location}</span>
                        </div>
                        <ul className="ml-4 list-outside list-disc space-y-1">
                          {exp.description.map((bullet, j) => (
                            <li key={j} className="pl-1 text-sm leading-snug text-gray-800">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.projects && resumeData.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Key Projects
                  </h2>
                  <div className="space-y-3">
                    {resumeData.projects.map((proj, i) => (
                      <div key={i}>
                        <div className="mb-1 flex items-baseline gap-2">
                          <h3 className="font-bold text-gray-900">{proj.name}</h3>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              [View Project]
                            </a>
                          )}
                        </div>
                        <p className="mb-1 text-sm text-gray-800">{proj.description}</p>
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Tech Stack:</span>{" "}
                          {proj.technologies.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Skills
                  </h2>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {resumeData.skills.Technical && resumeData.skills.Technical.length > 0 && (
                      <div className="flex">
                        <span className="w-24 shrink-0 font-bold text-gray-900">Technical:</span>
                        <span className="text-gray-800">
                          {resumeData.skills.Technical.join(", ")}
                        </span>
                      </div>
                    )}
                    {resumeData.skills.Tools && resumeData.skills.Tools.length > 0 && (
                      <div className="flex">
                        <span className="w-24 shrink-0 font-bold text-gray-900">Tools:</span>
                        <span className="text-gray-800">{resumeData.skills.Tools.join(", ")}</span>
                      </div>
                    )}
                    {resumeData.skills.Soft && resumeData.skills.Soft.length > 0 && (
                      <div className="flex">
                        <span className="w-24 shrink-0 font-bold text-gray-900">Soft Skills:</span>
                        <span className="text-gray-800">{resumeData.skills.Soft.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {resumeData.education && resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu, i) => (
                      <div key={i}>
                        <div className="flex justify-between">
                          <h3 className="font-bold text-gray-900">{edu.school}</h3>
                          <span className="text-sm text-gray-600">{edu.dates}</span>
                        </div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-gray-800">
                            {edu.degree}
                            {edu.field ? `, ${edu.field}` : ""}
                          </span>
                          {edu.cgpa && (
                            <span className="text-sm font-semibold text-gray-700">
                              {edu.cgpa}
                            </span>
                          )}
                        </div>
                        {edu.details && edu.details.length > 0 && (
                          <ul className="ml-4 list-outside list-disc">
                            {edu.details.map((d, j) => (
                              <li key={j} className="text-sm text-gray-700">
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 border-b border-gray-300 pb-1 text-lg font-bold uppercase">
                    Certifications
                  </h2>
                  <ul className="space-y-1">
                    {resumeData.certifications.map((cert, i) => (
                      <li key={i} className="flex justify-between text-sm text-gray-800">
                        <span>
                          <span className="font-semibold">{cert.name}</span> — {cert.issuer}
                        </span>
                        <span className="text-gray-600">{cert.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
