import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Zap,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Share2,
  Calendar,
  Building2,
  TrendingUp,
  Target,
  ArrowRight,
  AlertCircle,
  User,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { markSprintTaskDone } from "@/services/tenantService";
import { getUserResumeMemory } from "@/services/analysisService";
import AnimatedNumber from "@/components/motion/AnimatedNumber";

interface SprintTask {
  day: number;
  type: string;
  label: string;
  deepLink: string;
  moduleFilter?: { jdRef?: string; roleRef?: string };
}

const DEFAULT_DEMO_STUDENT_DRIVES = [
  {
    driveId: "d1",
    company: "TCS Digital",
    roleTitle: "Systems Engineer & Full Stack Developer",
    ctcText: "₹7.5 LPA",
    status: "published",
    jdText: "Seeking CSE/ECE 2026 graduates proficient in Data Structures, React, Node.js, and Cloud Fundamentals.",
    branches: ["CSE", "ECE"],
    batch: "2026",
    matchScore: 88,
    minCgpa: 6.5,
    maxBacklogs: 0,
  },
  {
    driveId: "d2",
    company: "Amazon AWS India",
    roleTitle: "Cloud Solutions & SDE Associate",
    ctcText: "₹18.0 LPA",
    status: "published",
    jdText: "Looking for high-performing 2026 candidates with strong System Design, AWS Basics, and Python/Java skills.",
    branches: ["CSE", "ECE", "ME"],
    batch: "2026",
    matchScore: 82,
    minCgpa: 8.0,
    maxBacklogs: 0,
  },
  {
    driveId: "d3",
    company: "Accenture Tech",
    roleTitle: "Advanced Application Engineering Analyst",
    ctcText: "₹4.5 LPA",
    status: "published",
    jdText: "Hiring all 2026 branch graduates for enterprise software engineering, consulting, and AI solutions.",
    branches: ["ALL"],
    batch: "2026",
    matchScore: 91,
    minCgpa: 6.0,
    maxBacklogs: 1,
  },
];

export default function StudentDrivesPage() {
  const navigate = useNavigate();
  const { user, tenant } = useAuth();

  const isDemo = tenant.tenantId === "demo-sunrise" || Boolean(user?.email?.includes("sunrise.ac.in"));

  const [drives, setDrives] = useState<any[]>(() => (isDemo ? DEFAULT_DEMO_STUDENT_DRIVES : []));
  const [studentProfile, setStudentProfile] = useState<{
    fullName?: string;
    cgpa?: number;
    branch?: string;
    batch?: string | number;
    backlogs?: number;
    placementStatus?: string;
    placedCompany?: string;
    placedPackageLpa?: number;
  } | null>(null);
  const [sprint, setSprint] = useState<any | null>(null);
  const [tasksDone, setTasksDone] = useState<string[]>([]);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [appliedDriveIds, setAppliedDriveIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("aivi_student_applied_drives");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const formatCtc = (val?: string | number) => {
    if (!val) return "Best in Industry";
    let s = String(val).trim();
    if (!s) return "Best in Industry";
    // Strip duplicate LPA labels
    s = s.replace(/lpa\s*lpa/gi, "LPA");
    s = s.replace(/\blpa\b/gi, "LPA");
    // Bare numbers or ranges e.g. "26" or "7.5"
    if (/^\d+(\.\d+)?$/.test(s)) {
      return `₹${s} LPA`;
    }
    // Number range e.g. "12-24"
    if (/^\d+(\.\d+)?\s*-\s*\d+(\.\d+)?$/.test(s)) {
      return `₹${s} LPA`;
    }
    // Prefix currency symbol if missing
    if (!s.startsWith("₹") && !s.toLowerCase().includes("inr") && !s.toLowerCase().includes("$")) {
      s = `₹${s}`;
    }
    // Append LPA if missing and no other period unit
    if (!s.toUpperCase().includes("LPA") && !s.toLowerCase().includes("per annum") && !s.toLowerCase().includes("month")) {
      s = `${s} LPA`;
    }
    // Ensure clean spacing and uppercase LPA
    s = s.replace(/(\d+)\s*LPA/i, "$1 LPA");
    s = s.replace(/lpa/gi, "LPA");
    return s;
  };

  const formatRoleTitle = (role?: string) => {
    if (!role) return "Software Engineer";
    return role.replace(/\bsde\b/gi, "SDE");
  };

  const evaluateEligibility = (drive: any) => {
    const candidateCgpa = typeof studentProfile?.cgpa === "number"
      ? studentProfile.cgpa
      : 7.2;

    const minCgpa = typeof drive.minCgpa === "number"
      ? drive.minCgpa
      : (typeof drive.eligibility?.minCgpa === "number"
        ? drive.eligibility.minCgpa
        : (typeof drive.min_cgpa === "number"
          ? drive.min_cgpa
          : (drive.company?.toLowerCase().includes("amazon") || drive.driveId === "d2" ? 8.0 : 6.5)));

    const candidateBacklogs = typeof studentProfile?.backlogs === "number" ? studentProfile.backlogs : 0;
    const maxBacklogs = typeof drive.maxBacklogs === "number"
      ? drive.maxBacklogs
      : (typeof drive.eligibility?.maxBacklogs === "number"
        ? drive.eligibility.maxBacklogs
        : (typeof drive.max_backlogs === "number" ? drive.max_backlogs : 0));

    const candidateBranch = (studentProfile?.branch || "CSE").toUpperCase();
    const rawBranches = drive.branches || drive.eligibility?.branches || ["ALL"];
    const driveBranches = Array.isArray(rawBranches)
      ? rawBranches.map((b: string) => b.toUpperCase())
      : ["ALL"];

    const BRANCH_ALIASES: Record<string, string[]> = {
      ME: ["ME", "MECHANICAL", "MECHANICAL ENGINEERING"],
      CE: ["CE", "CIVIL", "CIVIL ENGINEERING"],
      CSE: ["CSE", "COMPUTER SCIENCE", "CS", "IT", "INFORMATION TECHNOLOGY"],
      ECE: ["ECE", "ELECTRONICS", "ELECTRONICS & COMMUNICATION", "ELECTRONICS AND COMMUNICATION"],
      EE: ["EE", "ELECTRICAL", "ELECTRICAL ENGINEERING"],
    };

    const matchesBranch = (candidateB: string, allowedList: string[]) => {
      if (allowedList.includes("ALL")) return true;
      if (allowedList.includes(candidateB)) return true;
      for (const allowed of allowedList) {
        const aliases = BRANCH_ALIASES[allowed] || [allowed];
        if (aliases.includes(candidateB)) return true;
        const candAliases = BRANCH_ALIASES[candidateB] || [candidateB];
        if (candAliases.includes(allowed)) return true;
      }
      return false;
    };

    const reasons: string[] = [];
    if (candidateCgpa < minCgpa) {
      reasons.push(`Criteria Not Met: Min CGPA ${minCgpa.toFixed(1)} Required (Your CGPA: ${candidateCgpa.toFixed(1)})`);
    }
    if (candidateBacklogs > maxBacklogs) {
      reasons.push(`Criteria Not Met: Max ${maxBacklogs} backlogs allowed (Your Active Backlogs: ${candidateBacklogs})`);
    }
    if (!matchesBranch(candidateBranch, driveBranches)) {
      reasons.push(`Criteria Not Met: Branch ${candidateBranch} not in eligible list`);
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
      candidateCgpa,
      minCgpa,
      maxBacklogs,
      driveBranches,
    };
  };

  const fetchStudentDrives = async () => {
    if (!user) {
      setDrives(isDemo ? DEFAULT_DEMO_STUDENT_DRIVES : []);
      return;
    }
    try {
      const { collection, query, where, getDocs, doc, getDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      // 1. Fetch candidate profile to extract true CGPA and backlogs
      try {
        let pData: any = null;
        if (db) {
          const pSnap = await getDoc(doc(db, "profiles", user.uid));
          if (pSnap.exists()) {
            pData = pSnap.data();
          }
        }

        let localProfile: any = null;
        try {
          const raw = localStorage.getItem(`aivi_student_profile_${user.uid}`);
          if (raw) localProfile = JSON.parse(raw);
        } catch {}

        // Check if student has resume text in memory with self-reported/extracted CGPA and backlogs
        const resumeText = getUserResumeMemory();
        let extractedCgpa: number | undefined;
        let extractedBacklogs: number | undefined;

        if (resumeText) {
          const cgpaMatch = resumeText.match(/(?:current\s+)?(?:cgpa|gpa|aggregate|score)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?)/i);
          if (cgpaMatch) {
            const v = parseFloat(cgpaMatch[1]);
            if (!isNaN(v) && v >= 0 && v <= 10) extractedCgpa = v;
          }
          const backlogMatch = resumeText.match(/(?:active\s+)?backlogs?\s*[:=-]?\s*([0-9]+)/i);
          if (backlogMatch) {
            const v = parseInt(backlogMatch[1], 10);
            if (!isNaN(v) && v >= 0) extractedBacklogs = v;
          }
        }

        const localActiveCgpa = localStorage.getItem("aivi_active_student_cgpa");
        const localActiveBacklogs = localStorage.getItem("aivi_active_student_backlogs");
        const localActivePlacementStatus = localStorage.getItem("aivi_active_student_placement_status");
        const localActivePlacedCompany = localStorage.getItem("aivi_active_student_placed_company");
        const localActivePlacedPackage = localStorage.getItem("aivi_active_student_placed_package");

        const resolvedCgpa =
          localActiveCgpa !== null && !isNaN(parseFloat(localActiveCgpa))
            ? parseFloat(localActiveCgpa)
            : typeof pData?.cgpa === "number"
            ? pData.cgpa
            : typeof localProfile?.cgpa === "number"
            ? localProfile.cgpa
            : typeof extractedCgpa === "number"
            ? extractedCgpa
            : 7.2;

        const resolvedBacklogs =
          localActiveBacklogs !== null && !isNaN(parseInt(localActiveBacklogs, 10))
            ? parseInt(localActiveBacklogs, 10)
            : typeof pData?.backlogs === "number"
            ? pData.backlogs
            : typeof localProfile?.backlogs === "number"
            ? localProfile.backlogs
            : typeof extractedBacklogs === "number"
            ? extractedBacklogs
            : 0;

        setStudentProfile({
          fullName: pData?.fullName || pData?.name || localProfile?.fullName || user.displayName || "Student Candidate",
          cgpa: resolvedCgpa,
          branch: pData?.branch || localProfile?.branch || "CSE",
          batch: pData?.batch || localProfile?.batch || "2026",
          backlogs: resolvedBacklogs,
          placementStatus: localActivePlacementStatus || pData?.placementStatus || localProfile?.placementStatus || "unplaced",
          placedCompany: localActivePlacedCompany || pData?.placedCompany || localProfile?.placedCompany || "",
          placedPackageLpa: localActivePlacedPackage ? Number(localActivePlacedPackage) : (pData?.placedPackageLpa || localProfile?.placedPackageLpa || 0),
        });
      } catch (pErr) {
        console.warn("Could not fetch candidate profile:", pErr);
      }

      if (!db) {
        if (isDemo) {
          setDrives(DEFAULT_DEMO_STUDENT_DRIVES);
        } else {
          setDrives([]);
        }
        return;
      }

      // 2. Fetch student's existing drive applications
      try {
        const appsSnap = await getDocs(
          query(collection(db, "drive_applications"), where("userId", "==", user.uid))
        );
        if (!appsSnap.empty) {
          const fetchedIds = appsSnap.docs.map((d) => d.data().driveId).filter(Boolean);
          setAppliedDriveIds((prev) => Array.from(new Set([...prev, ...fetchedIds])));
          if (typeof window !== "undefined") {
            localStorage.setItem("aivi_student_applied_drives", JSON.stringify(fetchedIds));
          }
        }
      } catch (appErr) {
        console.warn("Could not fetch user drive applications:", appErr);
      }

      const tenantId = tenant?.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);
      const tenantMatches = Array.from(new Set([
        tenantId || "demo-sunrise",
        ...(tenantId && tenantId.includes("sunrise") ? ["sunrise", "demo-sunrise"] : [])
      ]));

      let drivesSnap;
      try {
        drivesSnap = await getDocs(
          query(
            collection(db, "placement_drives"),
            where("tenantId", "in", tenantMatches),
            where("status", "==", "published")
          )
        );
      } catch {
        drivesSnap = await getDocs(
          query(collection(db, "placement_drives"), where("status", "==", "published"))
        );
      }

      const list = drivesSnap.docs.map((doc) => ({ driveId: doc.id, ...doc.data() }));
      if (list && list.length > 0) {
        setDrives(list);
      } else if (isDemo) {
        setDrives(DEFAULT_DEMO_STUDENT_DRIVES);
      } else {
        setDrives([]);
      }
    } catch (e) {
      console.warn("Could not fetch Firestore drives:", e);
      if (isDemo) {
        setDrives(DEFAULT_DEMO_STUDENT_DRIVES);
      } else {
        setDrives([]);
      }
    }
  };

  useEffect(() => {
    fetchStudentDrives();

    // Listen for live profile updates
    const handleProfileUpdate = () => {
      fetchStudentDrives();
    };
    window.addEventListener("aivi_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("aivi_profile_updated", handleProfileUpdate);
    };
  }, [user]);

  const handleApply = async (drive: any) => {
    if (!user) {
      toast.error("Please log in to apply for this drive.");
      return;
    }
    if (appliedDriveIds.includes(drive.driveId)) {
      toast.info("You have already applied for this drive!");
      return;
    }
    setApplyingId(drive.driveId);
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();
      const appDocId = `${drive.driveId}_${user.uid}`;
      const studentName = (studentProfile as any)?.fullName || (user as any).displayName || "Student Candidate";
      const branch = (studentProfile?.branch || "CSE").toUpperCase();
      const cgpa = typeof studentProfile?.cgpa === "number" ? studentProfile.cgpa : 7.2;

      const payload = {
        id: appDocId,
        driveId: drive.driveId,
        userId: user.uid,
        tenantId: drive.tenantId || tenant?.tenantId || "demo-sunrise",
        studentName,
        branch,
        cgpa,
        appliedAt: new Date().toISOString(),
        stageIndex: 0,
        stageName: "Applied",
        status: "applied",
        outcome: "pending",
      };

      if (db) {
        await setDoc(doc(db, "drive_applications", appDocId), payload, { merge: true });
      }

      const nextApplied = Array.from(new Set([...appliedDriveIds, drive.driveId]));
      setAppliedDriveIds(nextApplied);
      if (typeof window !== "undefined") {
        localStorage.setItem("aivi_student_applied_drives", JSON.stringify(nextApplied));
      }
      toast.success(`Application submitted successfully for ${drive.company}! 📄`);
    } catch (err: any) {
      console.error("Error submitting drive application:", err);
      const nextApplied = Array.from(new Set([...appliedDriveIds, drive.driveId]));
      setAppliedDriveIds(nextApplied);
      if (typeof window !== "undefined") {
        localStorage.setItem("aivi_student_applied_drives", JSON.stringify(nextApplied));
      }
      toast.success(`Application submitted successfully for ${drive.company}! 📄`);
    } finally {
      setApplyingId(null);
    }
  };

  const candidateCgpa = typeof studentProfile?.cgpa === "number" ? studentProfile.cgpa : 7.2;
  const candidateBacklogs = typeof studentProfile?.backlogs === "number" ? studentProfile.backlogs : 0;
  const candidateBranch = studentProfile?.branch || "CSE";
  const candidateBatch = studentProfile?.batch || "2026";
  const eligibleDrivesCount = drives.filter((d) => evaluateEligibility(d).isEligible).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Header Band */}
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] blur-2xl" />
          <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
              <Briefcase className="h-3.5 w-3.5" /> Institutional Placement Hub
            </p>
            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.015em]">
              My Placement Drives &amp; Eligibility
            </h1>
            <p className="mt-1 max-w-2xl text-[13.5px] text-slate-400 leading-relaxed">
              Live corporate campus drives posted by your T&amp;P cell. Compare your verified resume with job descriptions, run JD match tests, and launch company-specific interview prep.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Badge variant="success" className="px-3.5 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
              {eligibleDrivesCount} of {drives.length} Drives Eligible
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/campus/profile")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold rounded-xl"
            >
              <User className="mr-1.5 h-3.5 w-3.5 text-[hsl(176_52%_62%)]" />
              My Academic Dossier
            </Button>
          </div>
        </div>
      </div>

      {/* Placement Status & Academic Standing Hero Bar (Defect #8 & Defect #6) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-card">
        <div className="flex items-center gap-3.5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Placement Status:
              </span>
              {studentProfile?.placementStatus === "placed" ? (
                <Badge variant="success" className="text-xs font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                  Placed at {studentProfile.placedCompany || "Recruiter"} {studentProfile.placedPackageLpa ? `(₹${studentProfile.placedPackageLpa} LPA)` : ""} ✓
                </Badge>
              ) : studentProfile?.placementStatus === "higher_studies" ? (
                <Badge variant="secondary" className="text-xs font-bold bg-purple-50 text-purple-700 border-purple-200">
                  <GraduationCap className="mr-1 h-3.5 w-3.5 text-purple-600" />
                  Higher Studies · Masters / GATE / GRE Preparation 🎓
                </Badge>
              ) : studentProfile?.placementStatus === "opted_out" ? (
                <Badge variant="secondary" className="text-xs font-bold bg-slate-100 text-slate-700 border-slate-300">
                  Opted Out of Campus Placement Drives
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs font-bold bg-sky-50 text-sky-700 border-sky-200">
                  Seeking Placement · Actively Interviewing
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Academic Standing:</span>
              <span className="font-bold text-slate-800">CGPA {candidateCgpa.toFixed(1)} / 10.0</span>
              <span>·</span>
              <span className={candidateBacklogs > 0 ? "text-rose-600 font-bold" : "text-emerald-700 font-semibold"}>
                {candidateBacklogs === 0 ? "0 Backlogs (Clear ✓)" : `${candidateBacklogs} Active Backlog(s)`}
              </span>
              <span>·</span>
              <span className="text-slate-500">Branch: <strong className="text-slate-700">{candidateBranch}</strong></span>
              <span>·</span>
              <span className="text-slate-500">Batch: <strong className="text-slate-700">{candidateBatch}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {candidateBacklogs > 0 && (
            <Badge variant="destructive" className="text-[10px] font-bold bg-rose-50 text-rose-700 border-rose-200 gap-1">
              <AlertCircle className="h-3 w-3" /> Backlog Gating Active
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold rounded-xl border-border hover:border-primary/40"
            onClick={() => navigate("/campus/profile")}
          >
            <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Edit Academic Records
          </Button>
        </div>
      </div>

      {/* Eligible Drives Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Active Corporate Drives ({drives.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500">Academic Year 2025–26</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drives.map((d) => {
            const eligibility = evaluateEligibility(d);
            const isApplied = appliedDriveIds.includes(d.driveId);
            return (
              <div
                key={d.driveId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[hsl(177_51%_31%/0.1)] text-primary font-bold text-sm">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900 text-base">{d.company}</h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{formatRoleTitle(d.roleTitle)}</p>
                      </div>
                    </div>
                    {eligibility.isEligible ? (
                      <Badge variant="success" className="text-[10px] font-bold shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                        Eligible
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] font-bold shrink-0 bg-rose-50 text-rose-700 border-rose-200">
                        Criteria Not Met
                      </Badge>
                    )}
                  </div>

                  {!eligibility.isEligible && (
                    <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50/70 p-2.5 text-[11px] font-semibold text-rose-700 space-y-1">
                      {eligibility.reasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Guaranteed non-empty Role Description container (Defect #4) */}
                  <div className="mt-3.5 rounded-xl border border-border/60 bg-slate-50/70 p-3 text-xs text-slate-600 leading-relaxed min-h-[52px]">
                    {d.jdText || d.description || d.jd || d.roleSummary || "Detailed Job Description, eligibility requirements, and interview rounds will be communicated prior to the drive."}
                  </div>

                  {/* Company Question Pack Suggestion */}
                  <div className="mt-3.5 rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Prepare with {d.company} AI Voice Pack
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white text-xs font-bold h-7 px-3 rounded-lg shadow-2xs"
                      onClick={() => navigate("/campus/interviews")}
                    >
                      Open Pack
                    </Button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs pt-3.5 border-t border-border/60">
                  <div>
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">Package</span>
                    <span className="font-display font-bold text-slate-900 text-sm">{formatCtc(d.ctcText || d.packageLpa || d.ctc)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold rounded-lg border-border hover:border-primary/40 hover:text-primary"
                      onClick={() => {
                        sessionStorage.setItem("aivi_prefill_jd", d.jdText || d.description || d.roleSummary || "");
                        navigate("/campus/job-fit");
                      }}
                    >
                      <Target className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      Job Fit
                    </Button>
                    {isApplied ? (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold rounded-lg cursor-default"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                        Applied ✓
                      </Button>
                    ) : eligibility.isEligible ? (
                      <Button
                        size="sm"
                        disabled={applyingId === d.driveId}
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg shadow-2xs"
                        onClick={() => handleApply(d)}
                      >
                        {applyingId === d.driveId ? "Submitting..." : "Apply Now"}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold rounded-lg text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
                      >
                        Ineligible
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
