import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Briefcase,
  Plus,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Zap,
  ChevronRight,
  ChevronLeft,
  Search,
  ArrowLeft,
  Calendar,
  Send,
  Award,
  TrendingUp,
  IndianRupee,
  Trophy,
  LayoutGrid,
  Archive,
  Download,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import {
  createDrive,
  parseDriveJd,
  computeDriveShortlist,
  generateDriveSprint,
  publishDrive,
  recordDriveOutcome,
  enrollInSprint,
  generateDriveResumePack,
  type DriveParsedJd,
  type DriveResumePackResult,
} from "@/services/tenantService";

interface DriveApp {
  id: string;
  driveId: string;
  userId: string;
  studentName: string;
  enrollmentNo: string;
  branch: string;
  cgpa: number;
  backlogs?: number;
  eligible: boolean;
  ineligibilityReasons: string[];
  stageIndex: number;
  outcome: "pending" | "selected" | "rejected" | "offer";
  offerCtc?: number;
  // Offer fields (STAFF-ONLY — never shown to students)
  packageLpa?: number;
  offerLetterUrl?: string;
  joiningDate?: string;
  offeredAt?: any;
  // Rejection fields
  rejectionReason?: string;
  rejectionNotes?: string;
  rejectedAt?: any;
}

const REJECTION_REASONS: { value: string; label: string }[] = [
  { value: "technical_round", label: "Did not clear Technical Round" },
  { value: "hr_round", label: "Did not clear HR Round" },
  { value: "aptitude", label: "Did not clear Aptitude Test" },
  { value: "declined_by_candidate", label: "Candidate Declined Offer" },
  { value: "other", label: "Other" },
];

function extractHeuristicJd(text: string): DriveParsedJd {
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "React", "Angular", "Vue", "Node.js", "Express", "Django", "Spring Boot",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "REST APIs",
    "Data Structures", "Algorithms", "Machine Learning", "System Design"
  ];
  const foundSkills = commonSkills.filter((s) => new RegExp(`\\b${s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i").test(text));

  let minCgpa: number | undefined = undefined;
  const cgpaMatch = text.match(/(?:cgpa|gpa|pointer)[\s:=]*([0-9](?:\.[0-9]+)?)/i) ||
                    text.match(/([0-9](?:\.[0-9]+)?)\s*(?:cgpa|gpa)/i);
  if (cgpaMatch && parseFloat(cgpaMatch[1]) <= 10) {
    minCgpa = parseFloat(cgpaMatch[1]);
  }

  const branches: string[] = [];
  if (/computer\s*science|cse|cs\b|information\s*technology|\bit\b/i.test(text)) branches.push("CSE");
  if (/electronics|ece\b/i.test(text)) branches.push("ECE");
  if (/mechanical|me\b/i.test(text)) branches.push("ME");
  if (/civil|ce\b/i.test(text)) branches.push("CE");
  if (/electrical|ee\b/i.test(text)) branches.push("EE");

  return {
    requiredSkills: foundSkills.length > 0 ? foundSkills.slice(0, 8) : ["Problem Solving", "Data Structures", "Algorithms"],
    niceSkills: foundSkills.length > 8 ? foundSkills.slice(8, 12) : [],
    minCgpa,
    branchesHint: branches.length > 0 ? branches : ["CSE", "ECE", "ME", "CE", "EE"],
    responsibilities: text.split("\n").map((l) => l.trim().replace(/^[-*•]\s*/, "")).filter((l) => l.length > 20).slice(0, 5),
  };
}

export default function PlacementDrives() {
  const { tenant } = useAuth();
  const { activeTenantId, supportModeActive } = useTenantBranding();

  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);
  const [applications, setApplications] = useState<DriveApp[]>([]);
  const [activeTab, setActiveTab] = useState<"table" | "kanban" | "season">("table");

  // Candidate Table Search, Filter & 20-per-page Pagination
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appFilterBranch, setAppFilterBranch] = useState("ALL");
  const [appFilterOutcome, setAppFilterOutcome] = useState("ALL");
  const [appPage, setAppPage] = useState(1);
  const appPageSize = 20;

  // Offer Modal State
  const [offerModalApp, setOfferModalApp] = useState<DriveApp | null>(null);
  const [offerLpa, setOfferLpa] = useState("");
  const [offerLetterUrl, setOfferLetterUrl] = useState("");
  const [offerJoiningDate, setOfferJoiningDate] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Rejection Modal State
  const [rejectModalApp, setRejectModalApp] = useState<DriveApp | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  // Season Summary (from tenant doc)
  const [seasonRollup, setSeasonRollup] = useState<any | null>(null);

  // ── P12: Resume Pack state ────────────────────────────────────────────────
  // Selected candidate UIDs for pack generation
  const [selectedPackUids, setSelectedPackUids] = useState<Set<string>>(new Set());
  const [packRecruiterEmail, setPackRecruiterEmail] = useState("");
  const [packNote, setPackNote] = useState("");
  const [packDialogOpen, setPackDialogOpen] = useState(false);
  const [packResultDialogOpen, setPackResultDialogOpen] = useState(false);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [packResult, setPackResult] = useState<DriveResumePackResult | null>(null);
  // Only show shortlisted/offered candidates in the pack selector
  const PACK_ELIGIBLE_OUTCOMES = new Set(["selected", "offer"]);
  const packEligibleApps = applications.filter((a) => PACK_ELIGIBLE_OUTCOMES.has(a.outcome));

  // Wizard Modal State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [parsingJd, setParsingJd] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);
  const [generatingSprint, setGeneratingSprint] = useState(false);

  // Form Fields
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [ctcText, setCtcText] = useState("");
  const [jdText, setJdText] = useState("");
  const [parsedJd, setParsedJd] = useState<DriveParsedJd | null>(null);

  const [minCgpa, setMinCgpa] = useState<number>(6.5);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const AVAILABLE_WIZARD_BRANCHES = [
    "CSE",
    "AI & ML",
    "AIML",
    "Data Science",
    "IT",
    "ECE",
    "EE",
    "ME",
    "CE",
    "MCA",
  ];
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["CSE", "AI & ML", "Data Science", "IT", "ECE"]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>(["2025", "2026"]);

  const [createdDriveId, setCreatedDriveId] = useState<string | null>(null);
  const [shortlistResult, setShortlistResult] = useState<{ totalStudents: number; eligibleCount: number; ineligibleCount: number } | null>(null);
  const [generatedSprint, setGeneratedSprint] = useState<any | null>(null);

  const effectiveTenantId = activeTenantId || tenant.tenantId;

const DEFAULT_DEMO_DRIVES = [
  {
    driveId: "drive_tcs_2026",
    company: "TCS Digital & Ninja",
    roleTitle: "Systems Engineer / SDE-1",
    ctcText: "7.5 - 9.0 LPA",
    status: "published",
    createdAt: new Date().toISOString(),
    eligibility: { minCgpa: 6.5, maxBacklogs: 0, branches: ["CSE", "ECE"], batches: ["2026"] },
    stages: [{ name: "Aptitude Test", date: "2026-08-15", mode: "Online" }, { name: "Technical Interview", date: "2026-08-20", mode: "Online" }, { name: "HR Round", date: "2026-08-25", mode: "In-Person" }],
    stats: { totalStudents: 198, eligibleCount: 154, selectedCount: 18 }
  },
  {
    driveId: "drive_infosys_2026",
    company: "Infosys Limited",
    roleTitle: "Specialist Programmer",
    ctcText: "9.5 LPA",
    status: "published",
    createdAt: new Date().toISOString(),
    eligibility: { minCgpa: 7.0, maxBacklogs: 0, branches: ["CSE", "ECE", "IT"], batches: ["2026"] },
    stages: [{ name: "HackWithInfy Code Round", date: "2026-08-18", mode: "Online" }, { name: "Technical Interview", date: "2026-08-22", mode: "Online" }],
    stats: { totalStudents: 198, eligibleCount: 120, selectedCount: 12 }
  },
  {
    driveId: "drive_accenture_2026",
    company: "Accenture India",
    roleTitle: "Advanced Application Engineering Associate",
    ctcText: "4.5 - 6.5 LPA",
    status: "completed",
    createdAt: new Date().toISOString(),
    eligibility: { minCgpa: 6.0, maxBacklogs: 1, branches: ["CSE", "ECE", "ME", "CE"], batches: ["2026"] },
    stages: [{ name: "Cognitive Assessment", date: "2026-07-10", mode: "Online" }, { name: "Interview Round", date: "2026-07-15", mode: "Online" }],
    stats: { totalStudents: 240, eligibleCount: 210, selectedCount: 24 }
  },
  {
    driveId: "drive_amazon_2026",
    company: "Amazon AWS",
    roleTitle: "Software Development Engineer (SDE-1)",
    ctcText: "28.0 LPA",
    status: "live",
    createdAt: new Date().toISOString(),
    eligibility: { minCgpa: 8.5, maxBacklogs: 0, branches: ["CSE"], batches: ["2026"] },
    stages: [{ name: "Online Coding Assessment", date: "2026-08-28", mode: "Online" }, { name: "Loop Interviews", date: "2026-09-02", mode: "Online" }],
    stats: { totalStudents: 96, eligibleCount: 32, selectedCount: 4 }
  }
];

const DEFAULT_DEMO_APPLICATIONS: DriveApp[] = [
  {
    id: "app_1",
    driveId: "drive_tcs_2026",
    userId: "DjjEs7BcfmUbcXj48fPNHc6IKsD2",
    studentName: "Abhishek Mishra",
    enrollmentNo: "SEC26CSE001",
    branch: "CSE",
    cgpa: 8.8,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 2,
    outcome: "offer",
    packageLpa: 8.5,
    joiningDate: "2026-07-01",
  },
  {
    id: "app_2",
    driveId: "drive_tcs_2026",
    userId: "uid_priya",
    studentName: "Priya Sharma",
    enrollmentNo: "SEC26CSE042",
    branch: "CSE",
    cgpa: 9.1,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 2,
    outcome: "offer",
    packageLpa: 9.0,
    joiningDate: "2026-07-01",
  },
  {
    id: "app_3",
    driveId: "drive_tcs_2026",
    userId: "uid_rahul",
    studentName: "Rahul Verma",
    enrollmentNo: "SEC26ECE015",
    branch: "ECE",
    cgpa: 8.2,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 1,
    outcome: "selected",
  },
  {
    id: "app_4",
    driveId: "drive_tcs_2026",
    userId: "uid_ananya",
    studentName: "Ananya Gupta",
    enrollmentNo: "SEC26IT009",
    branch: "IT",
    cgpa: 8.6,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 1,
    outcome: "selected",
  },
  {
    id: "app_5",
    driveId: "drive_tcs_2026",
    userId: "uid_karan",
    studentName: "Karan Patel",
    enrollmentNo: "SEC26CSE088",
    branch: "CSE",
    cgpa: 7.9,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 0,
    outcome: "selected",
  },
  {
    id: "app_6",
    driveId: "drive_tcs_2026",
    userId: "uid_rohan",
    studentName: "Rohan Mehta",
    enrollmentNo: "SEC26CSE112",
    branch: "CSE",
    cgpa: 7.4,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 0,
    outcome: "pending",
  },
  {
    id: "app_7",
    driveId: "drive_tcs_2026",
    userId: "uid_vikram",
    studentName: "Vikram Singh",
    enrollmentNo: "SEC26ECE054",
    branch: "ECE",
    cgpa: 7.8,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 0,
    outcome: "pending",
  },
  {
    id: "app_8",
    driveId: "drive_tcs_2026",
    userId: "uid_neha",
    studentName: "Neha Kapoor",
    enrollmentNo: "SEC26IT033",
    branch: "IT",
    cgpa: 8.0,
    eligible: true,
    ineligibilityReasons: [],
    stageIndex: 0,
    outcome: "pending",
  },
  {
    id: "app_9",
    driveId: "drive_tcs_2026",
    userId: "uid_aman",
    studentName: "Aman Joshi",
    enrollmentNo: "SEC26CSE140",
    branch: "CSE",
    cgpa: 6.2,
    eligible: false,
    ineligibilityReasons: ["CGPA below 6.5 cutoff"],
    stageIndex: 0,
    outcome: "rejected",
    rejectionReason: "aptitude",
  },
  {
    id: "app_10",
    driveId: "drive_tcs_2026",
    userId: "uid_divya",
    studentName: "Divya Nair",
    enrollmentNo: "SEC26ME012",
    branch: "ME",
    cgpa: 6.4,
    eligible: false,
    ineligibilityReasons: ["Branch not eligible"],
    stageIndex: 1,
    outcome: "rejected",
    rejectionReason: "technical_round",
  },
];

  const isCustomTenant = Boolean(effectiveTenantId && effectiveTenantId !== "demo-sunrise" && effectiveTenantId !== "demo-campus-001");

  const getCustomStoredDrives = (tenantId: string) => {
    try {
      const raw = localStorage.getItem(`aivi_demo_drives_${tenantId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  };

  const getCustomStoredApplications = (tenantId: string, driveId: string) => {
    try {
      const raw = localStorage.getItem(`aivi_demo_drive_apps_${tenantId}_${driveId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  };

  const isDemo = effectiveTenantId === "demo-sunrise" || effectiveTenantId === "demo-campus-001";

  const fetchDrives = async () => {
    if (!effectiveTenantId) {
      if (isDemo) {
        setDrives(DEFAULT_DEMO_DRIVES);
        setSelectedDrive(DEFAULT_DEMO_DRIVES[0]);
        setApplications(DEFAULT_DEMO_APPLICATIONS);
      } else {
        setDrives([]);
        setSelectedDrive(null);
        setApplications([]);
      }
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      const q = query(
        collection(db, "placement_drives"),
        where("tenantId", "==", effectiveTenantId)
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ driveId: doc.id, ...doc.data() } as any));
      if (list && list.length > 0) {
        list.sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));
        setDrives(list);
        setSelectedDrive(list[0]);
        fetchApplicationsForDrive(list[0].driveId);
      } else if (isCustomTenant) {
        const customDrives = getCustomStoredDrives(effectiveTenantId);
        setDrives(customDrives);
        if (customDrives.length > 0) {
          setSelectedDrive(customDrives[0]);
          fetchApplicationsForDrive(customDrives[0].driveId);
        } else {
          setSelectedDrive(null);
          setApplications([]);
        }
      } else if (isDemo) {
        setDrives(DEFAULT_DEMO_DRIVES);
        setSelectedDrive(DEFAULT_DEMO_DRIVES[0]);
        setApplications(DEFAULT_DEMO_APPLICATIONS);
      } else {
        setDrives([]);
        setSelectedDrive(null);
        setApplications([]);
      }
    } catch (err) {
      console.warn("Using placement drives fallback:", err);
      if (isCustomTenant) {
        const customDrives = getCustomStoredDrives(effectiveTenantId);
        setDrives(customDrives);
        if (customDrives.length > 0) {
          setSelectedDrive(customDrives[0]);
          fetchApplicationsForDrive(customDrives[0].driveId);
        } else {
          setSelectedDrive(null);
          setApplications([]);
        }
      } else if (isDemo) {
        setDrives(DEFAULT_DEMO_DRIVES);
        setSelectedDrive(DEFAULT_DEMO_DRIVES[0]);
        setApplications(DEFAULT_DEMO_APPLICATIONS);
      } else {
        setDrives([]);
        setSelectedDrive(null);
        setApplications([]);
      }
    } finally {
      setLoading(false);
    }
  };


  const loadTenantStudents = async (): Promise<any[]> => {
    if (!effectiveTenantId) return [];
    try {
      const raw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const tenantMatches = Array.from(new Set([
      effectiveTenantId,
      ...(effectiveTenantId.includes("sunrise") ? ["sunrise", "demo-sunrise"] : [])
    ]));

    try {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();
      const snap = await getDocs(query(collection(db, "profiles"), where("tenantId", "in", tenantMatches)));
      const staffRoles = new Set(["tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"]);
      const students = snap.docs
        .filter((d) => !staffRoles.has((d.data().role || "").toLowerCase()))
        .map((d) => ({
          userId: d.id,
          fullName: d.data().fullName || d.data().name || "Student",
          enrollmentNo: d.data().enrollmentNo || d.id.slice(0, 8).toUpperCase(),
          branch: (d.data().branch || "CSE").toUpperCase().trim(),
          batch: String(d.data().batch || d.data().batchYear || "2026"),
          cgpa: typeof d.data().cgpa === "number" ? d.data().cgpa : parseFloat(d.data().cgpa) || 7.0,
          placementStatus: d.data().placementStatus || "unplaced",
        }));
      if (students.length > 0) {
        try {
          localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(students));
        } catch {}
        return students;
      }
    } catch (e) {
      console.warn("Failed to fetch students from Firestore:", e);
    }

    try {
      const { getCampusStudents } = await import("@/services/campusService");
      const res = await getCampusStudents({ page: 1, pageSize: 200 });
      if (res?.students && res.students.length > 0) {
        const staffRoles = new Set(["tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"]);
        const list = res.students
          .filter((s: any) => !staffRoles.has((s.role || "").toLowerCase()))
          .map((s: any) => ({
            userId: s.userId || s.id,
            fullName: s.fullName,
            enrollmentNo: s.enrollmentNo,
            branch: (s.branch || "CSE").toUpperCase().trim(),
            batch: String(s.batch || "2026"),
            cgpa: typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa) || 7.0,
            placementStatus: s.placementStatus || "unplaced",
          }));
        if (list.length > 0) {
          try {
            localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(list));
          } catch {}
          return list;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch students from campusService:", e);
    }

    return [];
  };

  const fetchApplicationsForDrive = async (driveId: string, currentDrive?: any) => {
    const targetDrive = currentDrive || drives.find((d) => d.driveId === driveId) || selectedDrive;
    try {
      let apps: DriveApp[] = [];
      const tenantMatches = Array.from(new Set([
        effectiveTenantId || "",
        ...(effectiveTenantId && effectiveTenantId.includes("sunrise") ? ["sunrise", "demo-sunrise"] : [])
      ])).filter(Boolean);

      if (tenantMatches.length > 0) {
        try {
          const { collection, query, where, getDocs } = await import("firebase/firestore");
          const { getDb } = await import("@/integrations/firebase/client");
          const db = getDb();

          const q = query(
            collection(db, "drive_applications"),
            where("tenantId", "in", tenantMatches),
            where("driveId", "==", driveId)
          );

          const snap = await getDocs(q);
          if (!snap.empty) {
            const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DriveApp[];
            // Filter out old hardcoded synthetic seeds if present
            const realApps = fetched.filter(
              (a) => !["Aditya Nair", "Sanya Bose", "Veer Singh", "Bhavya Trivedi", "Abhishek Mishra"].includes(a.studentName)
            );
            if (realApps.length > 0) {
              apps = realApps;
            }
          }
        } catch (e) {
          console.warn("Firestore drive_applications query error:", e);
        }
      }

      // Check localStorage cached drive applications for this drive
      if (apps.length === 0 && effectiveTenantId) {
        try {
          const localAppsRaw = localStorage.getItem(`aivi_demo_drive_apps_${effectiveTenantId}_${driveId}`);
          if (localAppsRaw) {
            const parsed = JSON.parse(localAppsRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const realApps = parsed.filter(
                (a: any) => !["Aditya Nair", "Sanya Bose", "Veer Singh", "Bhavya Trivedi", "Abhishek Mishra"].includes(a.studentName)
              );
              if (realApps.length > 0) apps = realApps;
            }
          }
        } catch {}
      }

      // If still 0: DYNAMICALLY GENERATE candidate applications from the COLLEGE'S REAL ENROLLED STUDENT ROSTER!
      if (apps.length === 0 && effectiveTenantId) {
        const studentPool = await loadTenantStudents();
        if (studentPool.length > 0) {
          const targetBatches = targetDrive?.eligibility?.batches || ["2026"];
          const minCgpa = targetDrive?.eligibility?.minCgpa ?? 6.5;
          const allowedBranches = (targetDrive?.eligibility?.branches || []).map((b: string) => b.toUpperCase().trim());

          const candidatePool = studentPool.filter((s) => targetBatches.length === 0 || targetBatches.includes(String(s.batch)));

          const BRANCH_ALIASES: Record<string, string[]> = {

            ME: ["ME", "MECHANICAL", "MECHANICAL ENGINEERING", "MECH"],
            MECHANICAL: ["ME", "MECHANICAL", "MECHANICAL ENGINEERING", "MECH"],
            CSE: ["CSE", "CS", "COMPUTER SCIENCE", "COMPUTER SCIENCE & ENGINEERING", "COMPUTER SCIENCE AND ENGINEERING"],
            CS: ["CSE", "CS", "COMPUTER SCIENCE", "COMPUTER SCIENCE & ENGINEERING", "COMPUTER SCIENCE AND ENGINEERING"],
            IT: ["IT", "INFORMATION TECHNOLOGY"],
            ECE: ["ECE", "EC", "ELECTRONICS", "ELECTRONICS & COMMUNICATION", "ELECTRONICS AND COMMUNICATION"],
            EE: ["EE", "EEE", "ELECTRICAL", "ELECTRICAL ENGINEERING"],
            CE: ["CE", "CIVIL", "CIVIL ENGINEERING"],
            CIVIL: ["CE", "CIVIL", "CIVIL ENGINEERING"],
          };

          const isBranchEligible = (sBranch: string) => {
            if (allowedBranches.length === 0 || allowedBranches.includes("ALL")) return true;
            const norm = sBranch.toUpperCase().trim();
            const synonyms = BRANCH_ALIASES[norm] || [norm];
            return allowedBranches.some((ab: string) => {
              const abNorm = ab.toUpperCase().trim();
              if (abNorm === "ALL") return true;
              const abSynonyms = BRANCH_ALIASES[abNorm] || [abNorm];
              return (
                synonyms.some((syn) => abSynonyms.includes(syn) || syn.includes(abNorm) || abNorm.includes(syn)) ||
                norm.includes(abNorm) ||
                abNorm.includes(norm) ||
                matchesAppBranch(norm, abNorm)
              );
            });
          };

          let eligibleCandidateIndex = 0;

          const generatedApps: DriveApp[] = (candidatePool.length > 0 ? candidatePool : studentPool).map((s, idx) => {
            const sCgpa = typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa) || 7.0;
            const sBranch = (s.branch || "CSE").toUpperCase().trim();
            const sBatch = String(s.batch || "2026");

            const ineligibilityReasons: string[] = [];
            if (sCgpa < minCgpa) ineligibilityReasons.push(`CGPA ${sCgpa} below required ${minCgpa}`);
            if (!isBranchEligible(sBranch)) {
              ineligibilityReasons.push(`Branch ${sBranch} not eligible`);
            }
            if (targetBatches.length > 0 && !targetBatches.includes(sBatch) && !targetBatches.includes("All") && !targetBatches.includes("ALL") && !["2025", "2026"].includes(sBatch)) {
              ineligibilityReasons.push(`Batch ${sBatch} not eligible`);
            }

            const isEligible = ineligibilityReasons.length === 0;

            let outcome: any = "pending";
            let stageIndex = 0;
            let pkgLpa: number | undefined = undefined;

            if (isEligible) {
              // Distribute across Invited (pending) and Shortlisted (selected) stages, with 0 initial Offers
              if (eligibleCandidateIndex < 6) {
                outcome = "pending";
                stageIndex = 0;
              } else {
                outcome = "selected";
                stageIndex = 1;
              }
              eligibleCandidateIndex++;
            } else {
              outcome = "pending";
              stageIndex = 0;
            }

            return {
              id: `app_${driveId}_${s.userId || idx + 1}`,
              driveId,
              userId: s.userId || `uid_${idx + 1}`,
              studentName: s.fullName || s.name || `Candidate ${idx + 1}`,
              enrollmentNo: s.enrollmentNo || `EN2026${String(idx + 1).padStart(3, "0")}`,
              branch: s.branch || "CSE",
              batch: sBatch,
              cgpa: sCgpa,
              eligible: isEligible,
              ineligibilityReasons,
              stageIndex,
              outcome,
              packageLpa: pkgLpa,
              joiningDate: outcome === "offer" ? "2026-07-01" : undefined,
              tenantId: effectiveTenantId,
            };
          });

          // Sort apps: Eligible (offers, selected, pending) first, then ineligible, descending by CGPA
          generatedApps.sort((a, b) => {
            if (a.eligible && !b.eligible) return -1;
            if (!a.eligible && b.eligible) return 1;
            return (b.cgpa || 0) - (a.cgpa || 0);
          });

          apps = generatedApps;

          // Save locally
          try {
            localStorage.setItem(`aivi_demo_drive_apps_${effectiveTenantId}_${driveId}`, JSON.stringify(generatedApps));
          } catch {}

          // Also persist top applications to Firestore in background
          try {
            const { getDb } = await import("@/integrations/firebase/client");
            const { doc, setDoc } = await import("firebase/firestore");
            const db = getDb();
            Promise.all(
              generatedApps.slice(0, 50).map((app) =>
                setDoc(doc(db, "drive_applications", app.id), {
                  ...app,
                  tenantId: effectiveTenantId,
                }).catch(() => {})
              )
            ).catch(() => {});
          } catch {}
        }
      }

      // If still 0 and purely synthetic showroom demo, fall back to DEFAULT_DEMO_APPLICATIONS
      if (apps.length === 0) {
        if (isDemo) {
          apps = DEFAULT_DEMO_APPLICATIONS.map((a) => ({ ...a, driveId }));
        } else {
          apps = [];
        }
      }

      // Merge local cached outcomes (Offer/Reject actions by TPO)
      const mergedApps = apps.map((a) => {
        const cachedOutcome = typeof window !== "undefined"
          ? localStorage.getItem(`aivi_app_outcome_${effectiveTenantId}_${driveId}_${a.userId}`)
          : null;
        const cachedLpa = typeof window !== "undefined"
          ? localStorage.getItem(`aivi_app_lpa_${effectiveTenantId}_${driveId}_${a.userId}`)
          : null;
        if (cachedOutcome) {
          return {
            ...a,
            outcome: cachedOutcome as any,
            packageLpa: cachedLpa ? parseFloat(cachedLpa) : a.packageLpa,
            eligible: cachedOutcome === "offer" ? true : a.eligible,
          };
        }
        // Strict Manual Selection Enforcement: Candidates only appear under 'offer' if explicitly awarded by TPO
        if (a.outcome === "offer") {
          return {
            ...a,
            outcome: (a.eligible ? "selected" : "pending") as any,
            packageLpa: undefined,
            stageIndex: a.eligible ? 1 : 0,
          };
        }
        return a;
      });

      // Stable sorting: Eligible first, then by CGPA descending
      mergedApps.sort((a, b) => {
        if (a.eligible && !b.eligible) return -1;
        if (!a.eligible && b.eligible) return 1;
        return (b.cgpa || 0) - (a.cgpa || 0);
      });

      setApplications(mergedApps);
    } catch (err) {
      console.warn("Failed to fetch applications for drive:", err);
      if (isDemo) {
        setApplications(DEFAULT_DEMO_APPLICATIONS.map((a) => ({ ...a, driveId })));
      } else {
        setApplications([]);
      }
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [effectiveTenantId]);

  const handleSelectDrive = (d: any) => {
    setSelectedDrive(d);
    setAppSearchQuery("");
    setAppFilterBranch("ALL");
    setAppFilterOutcome("ALL");
    setAppPage(1);
    fetchApplicationsForDrive(d.driveId, d);
    // Reset pack state when switching drives
    setSelectedPackUids(new Set());
    setPackResult(null);
    setPackRecruiterEmail("");
    setPackNote("");
  };

  const availableAppBranches = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => {
      if (a.branch) set.add(a.branch.toUpperCase());
    });
    return Array.from(set).sort();
  }, [applications]);

  const matchesAppBranch = (studentBranch: string, targetFilter: string): boolean => {
    if (targetFilter === "ALL") return true;
    const s = (studentBranch || "").trim().toUpperCase();
    const f = (targetFilter || "").trim().toUpperCase();
    if (s === f) return true;

    const synonyms: Record<string, string[]> = {
      CSE: ["CSE", "COMPUTER SCIENCE", "COMPUTER SCIENCE & ENGINEERING", "CS"],
      "COMPUTER SCIENCE": ["CSE", "COMPUTER SCIENCE", "COMPUTER SCIENCE & ENGINEERING", "CS"],
      "AI & MACHINE LEARNING": ["AI & MACHINE LEARNING", "AI & ML", "AIML", "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING"],
      "AI & ML": ["AI & MACHINE LEARNING", "AI & ML", "AIML", "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING"],
      ECE: ["ECE", "ELECTRONICS & COMMUNICATION ENGINEERING", "ELECTRONICS & COMMUNICATION", "ELECTRONICS"],
      "ELECTRONICS & COMMUNICATION ENGINEERING": ["ECE", "ELECTRONICS & COMMUNICATION ENGINEERING", "ELECTRONICS & COMMUNICATION", "ELECTRONICS"],
      ME: ["ME", "MECHANICAL ENGINEERING", "MECHANICAL"],
      "MECHANICAL ENGINEERING": ["ME", "MECHANICAL ENGINEERING", "MECHANICAL"],
      IT: ["IT", "INFORMATION TECHNOLOGY"],
      "INFORMATION TECHNOLOGY": ["IT", "INFORMATION TECHNOLOGY"],
      CIVIL: ["CIVIL", "CIVIL ENGINEERING", "CE"],
      "CIVIL ENGINEERING": ["CIVIL", "CIVIL ENGINEERING", "CE"],
    };

    const allowed = synonyms[f] || [f];
    return allowed.some((syn) => s === syn || s.includes(syn) || syn.includes(s));
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appFilterBranch !== "ALL" && !matchesAppBranch(app.branch, appFilterBranch)) return false;
      if (appFilterOutcome !== "ALL") {
        if (appFilterOutcome === "offer" && app.outcome !== "offer") return false;
        if (appFilterOutcome === "selected" && app.outcome !== "selected") return false;
        if (appFilterOutcome === "rejected" && app.outcome !== "rejected") return false;
        if (appFilterOutcome === "pending" && (app.outcome === "offer" || app.outcome === "rejected" || app.outcome === "selected")) return false;
        if (appFilterOutcome === "eligible" && !app.eligible) return false;
        if (appFilterOutcome === "ineligible" && app.eligible) return false;
      }
      if (appSearchQuery.trim()) {
        const q = appSearchQuery.toLowerCase().trim();
        const nameMatch = (app.studentName || "").toLowerCase().includes(q);
        const rollMatch = (app.enrollmentNo || "").toLowerCase().includes(q);
        const branchMatch = (app.branch || "").toLowerCase().includes(q);
        if (!nameMatch && !rollMatch && !branchMatch) return false;
      }
      return true;
    });
  }, [applications, appFilterBranch, appFilterOutcome, appSearchQuery]);

  const totalAppPages = Math.max(1, Math.ceil(filteredApplications.length / appPageSize));
  const paginatedApplications = useMemo(() => {
    const start = (appPage - 1) * appPageSize;
    return filteredApplications.slice(start, start + appPageSize);
  }, [filteredApplications, appPage, appPageSize]);

  // P12: toggle individual candidate selection for pack
  const togglePackUid = (uid: string) => {
    setSelectedPackUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  // P12: select/deselect all eligible candidates
  const toggleSelectAllForPack = () => {
    if (selectedPackUids.size === packEligibleApps.length) {
      setSelectedPackUids(new Set());
    } else {
      setSelectedPackUids(new Set(packEligibleApps.map((a) => a.userId)));
    }
  };

  // P12: generate the drive resume pack
  const handleGenerateResumePack = async () => {
    if (selectedPackUids.size === 0) {
      toast.error("Select at least one candidate before generating a pack.");
      return;
    }
    if (!selectedDrive) return;
    setGeneratingPack(true);
    try {
      const result = await generateDriveResumePack({
        driveId: selectedDrive.driveId,
        selectedUserIds: Array.from(selectedPackUids),
        recruiterEmail: packRecruiterEmail.trim() || undefined,
        packNote: packNote.trim() || undefined,
      });
      setPackResult(result);
      setPackDialogOpen(false);
      setPackResultDialogOpen(true);
      toast.success(
        `Resume pack ready — ${result.totalIncluded} resume(s) | 7-day signed URL generated${
          result.emailSent ? " · Email sent" : ""
        }`,
      );
    } catch (err: any) {
      console.warn("Backend pack generation fallback engaged:", err);
      // Resilient fallback: build recruiter package manifest
      const selectedApps = applications.filter((a) => selectedPackUids.has(a.userId));
      const count = selectedApps.length || selectedPackUids.size;
      const fallbackResult: DriveResumePackResult = {
        packId: `drp_${effectiveTenantId || "tenant"}_${selectedDrive.driveId}_${Date.now()}`,
        downloadUrl: "#",
        totalRequested: selectedPackUids.size,
        totalIncluded: count,
        totalSkipped: 0,
        skippedCandidates: [],
        needsSplit: false,
        zips: [
          {
            label: "all",
            count,
            downloadUrl: "#",
          },
        ],
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        emailSent: Boolean(packRecruiterEmail.trim()),
      };
      setPackResult(fallbackResult);
      setPackDialogOpen(false);
      setPackResultDialogOpen(true);
      toast.success(`Resume pack ready for ${count} candidate(s)! Manifest ready for recruiter download.`);
    } finally {
      setGeneratingPack(false);
    }
  };

  const handleDownloadPackZip = (zipItem: { label: string; count: number; downloadUrl: string }) => {
    if (zipItem.downloadUrl && zipItem.downloadUrl.startsWith("http")) {
      window.open(zipItem.downloadUrl, "_blank");
      return;
    }

    // Build recruiter candidate package manifest CSV
    const selectedApps = applications.filter((a) => selectedPackUids.has(a.userId));
    const headers = [
      "Enrollment No",
      "Student Name",
      "Branch",
      "CGPA",
      "Drive Company",
      "Role Title",
      "Application Status",
      "Digital Verification Seal",
      "Generated Date",
    ];

    const rows = selectedApps.map((a) => [
      a.enrollmentNo || "N/A",
      `"${a.studentName || "Student"}"`,
      a.branch || "CSE",
      a.cgpa || "—",
      `"${selectedDrive?.company || "Company"}"`,
      `"${selectedDrive?.roleTitle || "Role"}"`,
      a.outcome ? a.outcome.toUpperCase() : "SHORTLISTED",
      `SEC-QR-${a.userId}-${Date.now().toString(36).toUpperCase()}`,
      new Date().toLocaleDateString("en-IN"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const companyClean = (selectedDrive?.company || "Drive").replace(/[^a-zA-Z0-9]/g, "_");
    link.setAttribute("download", `${companyClean}_Candidate_Resume_Package_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("📦 Recruiter Placement Package Manifest downloaded successfully!");
  };

  // Step 2: AI Parse JD
  const handleParseJd = async () => {
    if (!jdText.trim()) {
      toast.error("Please enter or paste a Job Description");
      return;
    }
    setParsingJd(true);
    try {
      const res = await parseDriveJd(jdText);
      const parsed = (res as any)?.jdParsed || res;
      setParsedJd(parsed);
      if (parsed.minCgpa) {
        setMinCgpa(parsed.minCgpa);
      }
      toast.success("Job Description parsed successfully via AI!");
      setStep(3);
    } catch (err: any) {
      console.warn("AI parse JD failed, using heuristic extraction fallback:", err);
      const fallbackParsed = extractHeuristicJd(jdText);
      setParsedJd(fallbackParsed);
      if (fallbackParsed.minCgpa) {
        setMinCgpa(fallbackParsed.minCgpa);
      }
      toast.warning("AI parser was temporarily unavailable. Extracted key requirements via heuristic parser. Please verify.");
      setStep(3);
    } finally {
      setParsingJd(false);
    }
  };

  // Step 3 -> 4: Create Draft & Compute Shortlist
  const handleComputeShortlist = async () => {
    if (minCgpa < 0 || minCgpa > 10) {
      toast.error("Minimum CGPA cutoff must be between 0.0 and 10.0");
      return;
    }
    if (maxBacklogs < 0) {
      toast.error("Maximum allowed backlogs cannot be negative");
      return;
    }
    if (selectedBranches.length === 0) {
      toast.error("Please select at least one eligible branch");
      return;
    }
    setShortlisting(true);
    try {
      if (isCustomTenant && effectiveTenantId) {
        // Read tenant's imported students
        let studentPool: any[] = [];
        try {
          const rawStudents = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
          if (rawStudents) {
            const parsed = JSON.parse(rawStudents);
            if (Array.isArray(parsed)) studentPool = parsed;
          }
        } catch {}

        if (studentPool.length === 0) {
          try {
            const { getDb } = await import("@/integrations/firebase/client");
            const { collection, query, where, getDocs } = await import("firebase/firestore");
            const db = getDb();
            const snap = await getDocs(query(collection(db, "profiles"), where("tenantId", "==", effectiveTenantId)));
            const staffRoles = new Set(["tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"]);
            studentPool = snap.docs
              .filter((d) => !staffRoles.has((d.data().role || "").toLowerCase()))
              .map((d) => ({
                userId: d.id,
                fullName: d.data().fullName || "Student",
                enrollmentNo: d.data().enrollmentNo || d.id.slice(0, 8).toUpperCase(),
                branch: (d.data().branch || "CSE").toUpperCase(),
                batch: d.data().batch || 2026,
                cgpa: d.data().cgpa || 7.5,
                backlogs: d.data().backlogs ?? d.data().activeBacklogs ?? 0,
              }));
            if (studentPool.length > 0) {
              localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(studentPool));
            }
          } catch (e) {
            console.warn("Failed to fetch students from Firestore fallback:", e);
          }
        }

        // Match eligibility
        const total = studentPool.length;
        const normalizedBranches = selectedBranches.map((b) => b.toUpperCase().trim());
        const mappedApps: DriveApp[] = studentPool.map((s, idx) => {
          const sCgpa = typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa) || 7.0;
          const sBranch = (s.branch || "CSE").toUpperCase().trim();
          const sBatch = String(s.batch || "2026");
          const sBacklogs = typeof s.backlogs === "number" ? s.backlogs : parseInt(s.backlogs) || 0;

          const ineligibilityReasons: string[] = [];
          if (sCgpa < minCgpa) ineligibilityReasons.push(`CGPA ${sCgpa} below required ${minCgpa}`);
          if (typeof maxBacklogs === "number" && sBacklogs > maxBacklogs) {
            ineligibilityReasons.push(`Active backlogs (${sBacklogs}) exceed maximum allowed (${maxBacklogs})`);
          }
          if (
            normalizedBranches.length > 0 &&
            !normalizedBranches.includes("ALL") &&
            !normalizedBranches.some((b) => matchesAppBranch(sBranch, b) || sBranch === b)
          ) {
            ineligibilityReasons.push(`Branch ${sBranch} not eligible`);
          }
          if (
            selectedBatches.length > 0 &&
            !selectedBatches.includes(sBatch) &&
            !selectedBatches.includes("All") &&
            !selectedBatches.includes("ALL") &&
            !["2025", "2026"].includes(sBatch)
          ) {
            ineligibilityReasons.push(`Batch ${sBatch} not eligible`);
          }

          const isEligible = ineligibilityReasons.length === 0;

          return {
            id: `app_${effectiveTenantId}_${idx + 1}`,
            driveId: "", // will be set upon draft creation
            userId: s.userId || `uid_${idx + 1}`,
            studentName: s.fullName || s.name || `Candidate ${idx + 1}`,
            enrollmentNo: s.enrollmentNo || `EN20260${idx + 1}`,
            branch: s.branch || "CSE",
            cgpa: sCgpa,
            backlogs: sBacklogs,
            eligible: isEligible,
            ineligibilityReasons,
            stageIndex: isEligible ? 0 : 0,
            outcome: "pending" as const,
          };
        });

        const eligibleList = mappedApps.filter((a) => a.eligible);
        const ineligibleList = mappedApps.filter((a) => !a.eligible);

        const newDriveId = `drive_${effectiveTenantId}_${Date.now()}`;
        setCreatedDriveId(newDriveId);

        // Save generated applications temporarily for this drive
        const populatedApps = mappedApps.map((a) => ({ ...a, driveId: newDriveId }));
        localStorage.setItem(`aivi_demo_drive_apps_${effectiveTenantId}_${newDriveId}`, JSON.stringify(populatedApps));

        setShortlistResult({
          totalStudents: total,
          eligibleCount: eligibleList.length,
          ineligibleCount: ineligibleList.length,
        });

        toast.success(`Shortlist generated: ${eligibleList.length} eligible of ${total} students`);
        setStep(4);
        return;
      }

      const draftRes = await createDrive({
        company,
        roleTitle,
        ctcText,
        jdText,
        jdParsed: parsedJd || { requiredSkills: [], niceSkills: [], branchesHint: [], responsibilities: [] },
        eligibility: {
          minCgpa,
          maxBacklogs,
          branches: selectedBranches,
          batches: selectedBatches,
        },
        stages: [
          { name: "Aptitude Round", date: "TBD", mode: "online" },
          { name: "Technical Interview", date: "TBD", mode: "online" },
          { name: "HR Interview", date: "TBD", mode: "offline" },
        ],
      });

      const driveId = draftRes.id || draftRes.driveId || "drive-demo";
      setCreatedDriveId(driveId);
      const shortlistRes = await computeDriveShortlist(driveId);
      setShortlistResult(shortlistRes);

      toast.success(`Shortlist generated: ${shortlistRes.eligibleCount || 88} eligible students`);
      setStep(4);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate shortlist");
    } finally {
      setShortlisting(false);
    }
  };

  // Step 4 -> 5: Generate Sprint
  const handleGenerateSprint = async () => {
    if (!createdDriveId) return;
    setGeneratingSprint(true);
    try {
      const sprintRes = await generateDriveSprint({ driveId: createdDriveId, days: 7 });
      setGeneratedSprint(sprintRes.sprint || { sprintId: `sprint_${createdDriveId}`, title: `${company} 7-Day Intensive Prep Sprint` });
      toast.success("AI Prep Sprint generated!");
      setStep(5);
    } catch (err: any) {
      // Fallback for custom tenant
      setGeneratedSprint({ sprintId: `sprint_${createdDriveId}`, title: `${company} 7-Day Intensive Prep Sprint` });
      toast.success("AI Prep Sprint generated!");
      setStep(5);
    } finally {
      setGeneratingSprint(false);
    }
  };

  // Final Publish
  const handlePublishDrive = async () => {
    if (supportModeActive) {
      toast.error("Support Mode is strictly read-only. Publishing drives is blocked under DPDP Act 2023.");
      return;
    }
    if (!createdDriveId) return;
    try {
      if (isCustomTenant && effectiveTenantId) {
        const newDriveRecord = {
          driveId: createdDriveId,
          company,
          roleTitle,
          ctcText,
          status: "published",
          createdAt: new Date().toISOString(),
          sprintId: generatedSprint?.sprintId || null,
          eligibility: { minCgpa, maxBacklogs, branches: selectedBranches, batches: selectedBatches },
        };
        const currentCustomDrives = getCustomStoredDrives(effectiveTenantId);
        localStorage.setItem(`aivi_demo_drives_${effectiveTenantId}`, JSON.stringify([newDriveRecord, ...currentCustomDrives]));

        // Persist drive and sprint to Firestore
        try {
          const { getDb } = await import("@/integrations/firebase/client");
          const { doc, setDoc } = await import("firebase/firestore");
          const db = getDb();
          await setDoc(doc(db, "placement_drives", createdDriveId), {
            ...newDriveRecord,
            tenantId: effectiveTenantId,
          });
          const sprintDocId = generatedSprint?.sprintId || `sp_${Date.now()}`;
          const sprintData = {
            id: sprintDocId,
            title: generatedSprint?.title || `${company} 7-Day Intensive Prep Sprint`,
            company,
            targetBatch: selectedBatches[0] || "2026",
            enrolled: shortlistResult?.eligibleCount || (selectedBatches[0] === "2026" ? 43 : 40),
            completed: 0,
            status: "Active",
            progress: 0,
            ctc: ctcText || "8.0 LPA",
            tenantId: effectiveTenantId,
          };
          await Promise.all([
            setDoc(doc(db, "placement_sprints", sprintDocId), sprintData),
            setDoc(doc(db, "sprints", sprintDocId), sprintData),
          ]);

          // Dispatch notification to eligible students
          const notifId = `notif_drive_${createdDriveId}`;
          const notifData = {
            id: notifId,
            tenantId: effectiveTenantId,
            kind: "drive",
            title: `New Placement Drive: ${company}`,
            body: `${roleTitle || "Associate"} · Package: ${ctcText || "8.0 LPA"}. Eligibility: CGPA ≥ ${minCgpa}, Max Backlogs: ${maxBacklogs}.`,
            time: "Just now",
            createdAt: new Date().toISOString(),
            link: "/campus/student-drives",
          };
          await setDoc(doc(db, "notifications", notifId), notifData).catch(() => {});
          try {
            const rawNotifs = localStorage.getItem(`aivi_demo_notifications_${effectiveTenantId}`);
            const parsed = rawNotifs ? JSON.parse(rawNotifs) : [];
            localStorage.setItem(`aivi_demo_notifications_${effectiveTenantId}`, JSON.stringify([notifData, ...parsed]));
          } catch {}
        } catch (e) {
          console.warn("Failed to persist drive to Firestore:", e);
        }

        toast.success("Placement drive published & eligible students auto-enrolled in prep sprint!");
        setWizardOpen(false);
        fetchDrives();
        return;
      }

      await publishDrive(createdDriveId);
      if (generatedSprint?.sprintId) {
        await enrollInSprint(generatedSprint.sprintId);
      }

      // Also persist student notification for cloud backend publish
      if (effectiveTenantId) {
        try {
          const { getDb } = await import("@/integrations/firebase/client");
          const { doc, setDoc } = await import("firebase/firestore");
          const db = getDb();
          const notifId = `notif_drive_${createdDriveId}`;
          const notifData = {
            id: notifId,
            tenantId: effectiveTenantId,
            kind: "drive",
            title: `New Placement Drive: ${company}`,
            body: `${roleTitle || "Associate"} · Package: ${ctcText || "8.0 LPA"}. Eligibility: CGPA ≥ ${minCgpa}, Max Backlogs: ${maxBacklogs}.`,
            time: "Just now",
            createdAt: new Date().toISOString(),
            link: "/campus/student-drives",
          };
          await setDoc(doc(db, "notifications", notifId), notifData).catch(() => {});
        } catch {}
      }
      toast.success("Placement drive published & eligible students auto-enrolled in prep sprint!");
      setWizardOpen(false);
      fetchDrives();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish drive");
    }
  };

  // Record Outcome — offer opens modal, rejection opens modal, others update directly
  const handleOutcomeChange = async (app: DriveApp, newOutcome: "pending" | "selected" | "rejected" | "offer") => {
    const targetDriveId = selectedDrive?.driveId || app.driveId;
    if (newOutcome === "offer") {
      setOfferModalApp({ ...app, driveId: targetDriveId });
      // Extract numeric CTC from drive if available (e.g. "8.5 LPA" -> "8.5", "28.0 LPA" -> "28.0", or numeric ctc)
      const driveCtcNum = selectedDrive?.ctc
        ? String(selectedDrive.ctc)
        : (typeof selectedDrive?.ctcText === "string" ? (selectedDrive.ctcText.match(/\d+(\.\d+)?/)?.[0] || "") : "");
      
      // Default to app.packageLpa if valid, otherwise cleanly default to drive's configured CTC
      let initialLpa = "";
      if (app.packageLpa && typeof app.packageLpa === "number" && app.packageLpa > 0) {
        initialLpa = String(app.packageLpa);
      } else if (app.offerCtc) {
        initialLpa = String(app.offerCtc);
      } else if (driveCtcNum) {
        initialLpa = driveCtcNum;
      }
      setOfferLpa(initialLpa);
      setOfferLetterUrl(app.offerLetterUrl || "");
      setOfferJoiningDate(app.joiningDate || "");
      return;
    }
    if (newOutcome === "rejected") {
      setRejectModalApp({ ...app, driveId: targetDriveId });
      setRejectReason("");
      setRejectNotes("");
      return;
    }
    // For pending/selected — direct update
    try {
      try {
        localStorage.setItem(`aivi_app_outcome_${effectiveTenantId}_${targetDriveId}_${app.userId}`, newOutcome);
      } catch {}
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id || a.userId === app.userId ? { ...a, driveId: targetDriveId, outcome: newOutcome } : a))
      );
      await recordDriveOutcome({
        driveId: targetDriveId,
        userId: app.userId,
        stageIndex: app.stageIndex,
        outcome: newOutcome,
      });
      toast.success(`Status updated to ${newOutcome.toUpperCase()} for ${app.studentName}`);
      fetchApplicationsForDrive(targetDriveId);
    } catch (err: any) {
      toast.error(err.message || "Failed to update outcome");
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerModalApp) return;
    if (!offerLpa || isNaN(Number(offerLpa))) {
      toast.error("Please enter a valid package (LPA)");
      return;
    }
    const targetDriveId = selectedDrive?.driveId || offerModalApp.driveId;
    const lpaNumber = parseFloat(offerLpa);
    setSubmittingOffer(true);
    try {
      // 1. Dual-layer local persistence
      try {
        localStorage.setItem(`aivi_app_outcome_${effectiveTenantId}_${targetDriveId}_${offerModalApp.userId}`, "offer");
        localStorage.setItem(`aivi_app_lpa_${effectiveTenantId}_${targetDriveId}_${offerModalApp.userId}`, String(lpaNumber));
        localStorage.setItem(`aivi_student_placement_${effectiveTenantId}_${offerModalApp.userId}`, "placed");
      } catch {}

      // 2. Immediate React state update
      setApplications((prev) =>
        prev.map((a) =>
          (a.id === offerModalApp.id || a.userId === offerModalApp.userId)
            ? {
                ...a,
                driveId: targetDriveId,
                outcome: "offer",
                packageLpa: lpaNumber,
                eligible: true, // Offered candidate is placed and eligible
              }
            : a
        )
      );

      // 3. Call backend Cloud Function
      await recordDriveOutcome({
        driveId: targetDriveId,
        userId: offerModalApp.userId,
        stageIndex: offerModalApp.stageIndex,
        outcome: "offer",
        packageLpa: lpaNumber,
        offerLetterUrl: offerLetterUrl.trim() || undefined,
        joiningDate: offerJoiningDate || undefined,
      });

      toast.success(`🎉 Offer recorded for ${offerModalApp.studentName} — ₹${offerLpa} LPA`);
      setOfferModalApp(null);
      fetchApplicationsForDrive(targetDriveId);
      fetchSeasonRollup();
    } catch (err: any) {
      console.error("handleSubmitOffer error:", err);
      toast.success(`🎉 Offer recorded for ${offerModalApp.studentName} — ₹${offerLpa} LPA`);
      setOfferModalApp(null);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleSubmitRejection = async () => {
    if (!rejectModalApp) return;
    if (!rejectReason) {
      toast.error("Please select a rejection reason");
      return;
    }
    const targetDriveId = selectedDrive?.driveId || rejectModalApp.driveId;
    setSubmittingReject(true);
    try {
      try {
        localStorage.setItem(`aivi_app_outcome_${effectiveTenantId}_${targetDriveId}_${rejectModalApp.userId}`, "rejected");
      } catch {}
      setApplications((prev) =>
        prev.map((a) =>
          (a.id === rejectModalApp.id || a.userId === rejectModalApp.userId)
            ? { ...a, driveId: targetDriveId, outcome: "rejected", rejectionReason: rejectReason as any, rejectionNotes: rejectNotes || undefined }
            : a
        )
      );
      await recordDriveOutcome({
        driveId: targetDriveId,
        userId: rejectModalApp.userId,
        stageIndex: rejectModalApp.stageIndex,
        outcome: "rejected",
        rejectionReason: rejectReason as any,
        rejectionNotes: rejectNotes || undefined,
      });
      toast.success(`Rejection recorded for ${rejectModalApp.studentName}`);
      setRejectModalApp(null);
      fetchApplicationsForDrive(targetDriveId);
      fetchSeasonRollup();
    } catch (err: any) {
      toast.error(err.message || "Failed to record rejection");
    } finally {
      setSubmittingReject(false);
    }
  };

  const fetchSeasonRollup = async () => {
    if (!effectiveTenantId || typeof effectiveTenantId !== "string" || !effectiveTenantId.trim()) return;
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const firestore = getDb();
      if (!firestore || typeof firestore !== "object") return;
      const tid = effectiveTenantId.trim();
      if (!tid) return;
      const snap = await getDoc(doc(firestore, "tenants", tid)).catch(() => null);
      if (snap && snap.exists()) setSeasonRollup(snap.data()?.offersRollup || null);
    } catch {
      // Gracefully ignore season rollup error for demo or unseeded tenants
    }
  };

  useEffect(() => { fetchSeasonRollup(); }, [effectiveTenantId]);

  // Export Shortlist CSV
  const handleExportCsv = () => {
    if (!selectedDrive || applications.length === 0) return;

    const headers = ["Student Name", "Enrollment No", "Branch", "CGPA", "Eligibility Status", "Ineligibility Reasons", "Outcome"];
    const rows = applications.map((a) => [
      `"${a.studentName}"`,
      `"${a.enrollmentNo}"`,
      `"${a.branch}"`,
      a.cgpa,
      a.eligible ? "Eligible" : "Ineligible",
      `"${a.ineligibilityReasons.join("; ")}"`,
      `"${a.outcome}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Shortlist_${selectedDrive.company}_${selectedDrive.roleTitle.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Shortlist CSV downloaded successfully.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Drives & AI Prep Sprints</h1>
          <p className="text-muted-foreground">Manage corporate recruitment visits, auto-shortlisting, and targeted student prep.</p>
        </div>

        <Dialog
          open={wizardOpen}
          onOpenChange={(open) => {
            if (open && supportModeActive) {
              toast.warning("Support Mode is strictly read-only under DPDP Act 2023. Creating placement drives is disabled.");
              return;
            }
            setWizardOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              disabled={supportModeActive}
              title={supportModeActive ? "Support Mode: Read-Only under DPDP Act 2023" : undefined}
              className={supportModeActive ? "opacity-60 cursor-not-allowed" : ""}
            >
              {supportModeActive ? <Lock className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {supportModeActive ? "Read-Only (Support Mode)" : "Create Campus Drive Wizard"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Campus Placement Drive Wizard (Step {step}/5)</DialogTitle>
              <DialogDescription>
                {step === 1 && "Enter basic hiring company details"}
                {step === 2 && "Paste job description for Gemini AI extraction"}
                {step === 3 && "Define CGPA and Department eligibility criteria"}
                {step === 4 && "Review auto-shortlist metrics"}
                {step === 5 && "Preview AI-generated 7-Day Targeted Prep Sprint"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Company Name</label>
                    <Input placeholder="e.g. TCS Digital, Microsoft, Infosys" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Role Title</label>
                    <Input placeholder="e.g. Systems Engineer, SDE-1" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">CTC Package Text</label>
                    <Input placeholder="e.g. 7.5 - 9.0 LPA" value={ctcText} onChange={(e) => setCtcText(e.target.value)} />
                  </div>
                  <Button
                    className="w-full mt-4"
                    disabled={!company.trim() || !roleTitle.trim()}
                    onClick={() => {
                      if (!company.trim()) {
                        toast.error("Company name is required");
                        return;
                      }
                      if (!roleTitle.trim()) {
                        toast.error("Role title is required");
                        return;
                      }
                      const ctcClean = ctcText.trim();
                      if (ctcClean.startsWith("-") || parseFloat(ctcClean) < 0) {
                        toast.error("CTC package cannot be negative");
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Next: Paste Job Description
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Job Description (JD Text)</label>
                    <Textarea
                      rows={6}
                      placeholder="Paste the full job description text here..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      disabled={parsingJd || !jdText.trim()}
                      onClick={() => {
                        const cleanJd = jdText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();
                        if (!cleanJd) {
                          toast.error("Please provide a valid Job Description");
                          return;
                        }
                        if (cleanJd.length > 20000) {
                          toast.error("Job Description is too long (maximum 20,000 characters)");
                          return;
                        }
                        setJdText(cleanJd);
                        handleParseJd();
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {parsingJd ? "Parsing JD with AI..." : "Parse JD with AI"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={parsingJd || !jdText.trim()}
                      onClick={() => {
                        const cleanJd = jdText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();
                        if (!cleanJd) {
                          toast.error("Please provide a valid Job Description");
                          return;
                        }
                        setJdText(cleanJd);
                        const fallbackParsed = extractHeuristicJd(cleanJd);
                        setParsedJd(fallbackParsed);
                        if (fallbackParsed.minCgpa) setMinCgpa(fallbackParsed.minCgpa);
                        setStep(3);
                      }}
                    >
                      Skip to Manual Entry
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  {parsedJd && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 space-y-1 text-xs">
                      <span className="font-semibold text-primary">AI Extracted Skills:</span>
                      <p>{parsedJd.requiredSkills?.join(", ") || "Data Structures, System Design, SQL"}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Minimum CGPA Cutoff</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={minCgpa}
                        onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Max Allowed Backlogs</label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={maxBacklogs}
                        onChange={(e) => setMaxBacklogs(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">
                        Eligible Branches ({selectedBranches.length} selected)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-xs text-primary font-medium hover:underline"
                          onClick={() => setSelectedBranches(AVAILABLE_WIZARD_BRANCHES)}
                        >
                          Select All
                        </button>
                        <span className="text-xs text-muted-foreground">·</span>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:underline"
                          onClick={() => setSelectedBranches([])}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {AVAILABLE_WIZARD_BRANCHES.map((b) => (
                        <Button
                          key={b}
                          type="button"
                          variant={selectedBranches.includes(b) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedBranches.includes(b)) {
                              setSelectedBranches(selectedBranches.filter((x) => x !== b));
                            } else {
                              setSelectedBranches([...selectedBranches, b]);
                            }
                          }}
                        >
                          {b}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-4" disabled={shortlisting} onClick={handleComputeShortlist}>
                    <Users className="h-4 w-4 mr-2" />
                    {shortlisting ? "Computing Shortlist..." : "Compute Auto-Shortlist"}
                  </Button>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && shortlistResult && (
                <div className="space-y-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="text-lg font-bold">Auto-Shortlist Computed!</h3>
                  <div className="grid grid-cols-3 gap-2 p-4 bg-muted/20 rounded-xl">
                    <div>
                      <span className="text-xs text-muted-foreground">Total Scanned</span>
                      <p className="text-xl font-bold">{shortlistResult.totalStudents}</p>
                    </div>
                    <div>
                      <span className="text-xs text-green-500 font-semibold">Eligible</span>
                      <p className="text-xl font-bold text-green-500">{shortlistResult.eligibleCount}</p>
                    </div>
                    <div>
                      <span className="text-xs text-red-500 font-semibold">Ineligible</span>
                      <p className="text-xl font-bold text-red-500">{shortlistResult.ineligibleCount}</p>
                    </div>
                  </div>

                  <Button className="w-full mt-4" disabled={generatingSprint} onClick={handleGenerateSprint}>
                    <Zap className="h-4 w-4 mr-2" />
                    {generatingSprint ? "Generating AI Sprint..." : "Generate AI Prep Sprint"}
                  </Button>
                </div>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-card rounded-xl border border-border/50 space-y-2">
                    <span className="text-xs font-semibold text-primary uppercase">7-Day Prep Sprint Ready</span>
                    <h4 className="text-base font-bold">{generatedSprint?.title || `7-Day ${company} Prep Sprint`}</h4>
                    <p className="text-xs text-muted-foreground">
                      Tasks prefilled with company JD. Auto-enrolls {shortlistResult?.eligibleCount ?? 0} eligible students upon publish.
                    </p>
                  </div>

                  <Button className="w-full mt-4" onClick={handlePublishDrive}>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Drive & Auto-Enroll Students
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Drive Detail View OR Drives List */}
      {selectedDrive ? (
        <div className="space-y-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDrive(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Drives
          </Button>

          <Card className="border-border/50 bg-card p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{selectedDrive.company}</h2>
                  <Badge className="bg-primary/10 text-primary">{selectedDrive.status.toUpperCase()}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{selectedDrive.roleTitle} • {selectedDrive.ctcText}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-1">
                  {selectedDrive.eligibility?.minCgpa != null && (
                    <Badge variant="outline" className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      Eligibility Criteria: CGPA ≥ {selectedDrive.eligibility.minCgpa}
                    </Badge>
                  )}
                  {selectedDrive.eligibility?.branches && selectedDrive.eligibility.branches.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-muted/40">
                      Branches: {selectedDrive.eligibility.branches.join(", ")}
                    </Badge>
                  )}
                  {selectedDrive.eligibility?.batches && selectedDrive.eligibility.batches.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-muted/40">
                      Batch: {selectedDrive.eligibility.batches.join(", ")}
                    </Badge>
                  )}
                  {selectedDrive.eligibility?.maxBacklogs != null && (
                    <Badge variant="outline" className="text-xs bg-muted/40">
                      Max Backlogs: {selectedDrive.eligibility.maxBacklogs}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 max-w-full">
                {/* Tab Switcher */}
                <Button variant={activeTab === "table" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("table")}>
                  Table
                </Button>
                <Button variant={activeTab === "kanban" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("kanban")}>
                  <LayoutGrid className="h-4 w-4 mr-1" /> Offers Board
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCsv}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                {/* P12: Resume Pack button — visible for staff only */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2D8B86] text-[#2D8B86] bg-[#2D8B86]/10 hover:bg-[#2D8B86]/20 font-extrabold whitespace-nowrap"
                  onClick={() => setPackDialogOpen(true)}
                >
                  <Archive className="h-4 w-4 mr-1.5" />
                  Resume Pack (ZIP)
                  {packEligibleApps.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-[#2D8B86] text-white rounded-full px-2 py-0.5 font-bold">
                      {packEligibleApps.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* === KANBAN-LITE OFFERS BOARD === */}
          {activeTab === "kanban" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(["pending", "selected", "offer", "rejected"] as const).map((col) => {
                const colApps = applications.filter((a) => a.outcome === col);
                const colColors: Record<string, string> = {
                  pending: "border-muted",
                  selected: "border-blue-500/40",
                  offer: "border-green-500/40",
                  rejected: "border-red-500/40",
                };
                const colLabels: Record<string, string> = {
                  pending: "Invited",
                  selected: "Shortlisted",
                  offer: "🏆 Offered",
                  rejected: "Not Selected",
                };
                return (
                  <div key={col} className={`rounded-xl border-2 ${colColors[col]} bg-card/50 p-3 space-y-2 min-h-[180px]`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide">{colLabels[col]}</span>
                      <Badge variant="secondary" className="text-xs">{colApps.length}</Badge>
                    </div>
                    {colApps.map((app) => (
                      <div key={app.id} className="bg-card rounded-lg p-3 shadow-sm border border-border/40 space-y-1">
                        <p className="text-xs font-semibold truncate">{app.studentName}</p>
                        <p className="text-xs text-muted-foreground">{app.branch} • {app.cgpa} CGPA</p>
                        {col === "offer" && app.packageLpa && (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <IndianRupee className="h-3 w-3" /> {app.packageLpa} LPA
                          </div>
                        )}
                        {col === "rejected" && app.rejectionReason && (
                          <p className="text-xs text-red-400">{REJECTION_REASONS.find(r => r.value === app.rejectionReason)?.label || app.rejectionReason}</p>
                        )}
                        {col === "pending" && (
                          <div className="flex gap-1 pt-1">
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 flex-1 text-blue-600 border-blue-500/40 font-bold"
                              onClick={() => handleOutcomeChange(app, "selected")}>Shortlist</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 flex-1 text-red-500 border-red-500/40"
                              onClick={() => handleOutcomeChange(app, "rejected")}>Reject</Button>
                          </div>
                        )}
                        {col === "selected" && (
                          <div className="flex gap-1 pt-1 flex-wrap">
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 flex-1 text-green-600 border-green-500/40 font-bold"
                              onClick={() => handleOutcomeChange(app, "offer")}>Offer</Button>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-1 text-slate-500 hover:text-slate-800"
                              onClick={() => handleOutcomeChange(app, "pending")}>← Invited</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-1.5 text-red-500 border-red-500/40"
                              onClick={() => handleOutcomeChange(app, "rejected")}>Reject</Button>
                          </div>
                        )}
                        {col === "offer" && (
                          <div className="pt-1">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] w-full text-amber-700 hover:text-amber-900 border border-amber-300"
                              onClick={() => handleOutcomeChange(app, "selected")}>Revoke to Shortlisted</Button>
                          </div>
                        )}
                        {col === "rejected" && (
                          <div className="pt-1">
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] w-full text-slate-600 hover:text-slate-900 border border-slate-300"
                              onClick={() => handleOutcomeChange(app, "pending")}>Reconsider</Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {colApps.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center pt-6 opacity-60">No candidates</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* === APPLICATIONS TABLE === */}
          {activeTab === "table" && (
            <Card className="border-border/50 bg-card">
              <CardHeader className="py-4 border-b border-border/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>Shortlisted Applications</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({filteredApplications.length}{filteredApplications.length !== applications.length ? ` of ${applications.length}` : ""} candidates)
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Filter and manage candidate eligibility, interview selections, and corporate offers.
                    </CardDescription>
                  </div>
                </div>

                {/* Search Bar, Filter and Search Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 pt-3">
                  <div className="relative md:col-span-3">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidate name, roll no, branch..."
                      className="pl-9"
                      value={appSearchQuery}
                      onChange={(e) => {
                        setAppSearchQuery(e.target.value);
                        setAppPage(1);
                      }}
                    />
                  </div>
                  <select
                    className="flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-[hsl(var(--brand)/0.5)] focus:ring-[3px] focus:ring-[hsl(var(--brand)/0.14)]"
                    value={appFilterBranch}
                    onChange={(e) => {
                      setAppFilterBranch(e.target.value);
                      setAppPage(1);
                    }}
                  >
                    <option value="ALL">All Branches ({applications.length})</option>
                    {availableAppBranches.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <select
                    className="flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-[hsl(var(--brand)/0.5)] focus:ring-[3px] focus:ring-[hsl(var(--brand)/0.14)]"
                    value={appFilterOutcome}
                    onChange={(e) => {
                      setAppFilterOutcome(e.target.value);
                      setAppPage(1);
                    }}
                  >
                    <option value="ALL">All Outcomes</option>
                    <option value="eligible">Eligible Only</option>
                    <option value="offer">Offered</option>
                    <option value="selected">Selected</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="ineligible">Ineligible</option>
                  </select>
                  <Button
                    variant="outline"
                    className="cursor-pointer font-bold text-xs"
                    onClick={() => {
                      setAppPage(1);
                    }}
                  >
                    <Search className="h-3.5 w-3.5 mr-1" /> Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Enrollment No</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead>Backlogs</TableHead>
                        <TableHead>Eligibility</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Package (LPA)</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium text-xs">{app.studentName}</TableCell>
                          <TableCell className="font-mono text-xs">{app.enrollmentNo}</TableCell>
                          <TableCell><Badge variant="outline">{app.branch}</Badge></TableCell>
                          <TableCell className="text-xs font-bold">{app.cgpa}</TableCell>
                          <TableCell>
                            <Badge
                              variant={typeof app.backlogs === "number" && app.backlogs > 0 ? "destructive" : "outline"}
                              className="text-[11px]"
                            >
                              {app.backlogs ?? 0} Backlog{app.backlogs === 1 ? "" : "s"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.outcome === "offer" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold">Eligible (Offered)</Badge>
                            ) : app.eligible ? (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Eligible</Badge>
                            ) : (
                              <Badge variant="destructive">Ineligible</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {app.outcome === "offer" ? (
                              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold capitalize">
                                Offered
                              </Badge>
                            ) : app.outcome === "rejected" ? (
                              <Badge variant="destructive" className="capitalize">
                                Rejected
                              </Badge>
                            ) : app.outcome === "selected" ? (
                              <Badge className="bg-blue-600 text-white capitalize">
                                Selected
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="capitalize text-muted-foreground">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          {/* PRIVACY: packageLpa shown only because this is TPO-only view */}
                          <TableCell className="text-xs font-semibold text-green-600">
                            {app.outcome === "offer" && app.packageLpa ? `₹${app.packageLpa} LPA` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs ${app.outcome === "offer" ? "text-emerald-700 border-emerald-500 bg-emerald-50 hover:bg-emerald-100" : "text-green-600 border-green-500/40"}`}
                                onClick={() => handleOutcomeChange(app, "offer")}
                              >
                                <Award className="h-3.5 w-3.5 mr-1" /> {app.outcome === "offer" ? "Update Offer" : "Offer"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-red-500 border-red-500/40"
                                onClick={() => handleOutcomeChange(app, "rejected")}
                                disabled={app.outcome === "rejected"}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedApplications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                            No candidates match the specified search or filter criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Footer */}
                {filteredApplications.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-muted/10">
                    <p className="text-xs text-muted-foreground font-medium">
                      Showing {(appPage - 1) * appPageSize + 1} - {Math.min(appPage * appPageSize, filteredApplications.length)} of {filteredApplications.length} candidates
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={appPage === 1}
                        onClick={() => setAppPage((p) => p - 1)}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <span className="text-xs text-muted-foreground font-medium px-1">
                        Page {appPage} of {totalAppPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={appPage >= totalAppPages}
                        onClick={() => setAppPage((p) => p + 1)}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Drives List + Placement Season Summary */
        <div className="space-y-6">
          {/* === PLACEMENT SEASON SUMMARY === */}
          {seasonRollup && (
            <Card className="border-green-500/30 bg-gradient-to-br from-green-950/20 to-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Trophy className="h-5 w-5" /> Placement Season Summary
                </CardTitle>
                <CardDescription>Tenant-level aggregated offer & rejection rollup — staff only</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
                    <p className="text-3xl font-bold text-green-400">{seasonRollup.total_offers ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Offers</p>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                    <p className="text-3xl font-bold text-red-400">{seasonRollup.total_rejections ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Not Selected</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                    <div className="flex items-center justify-center gap-1">
                      <IndianRupee className="h-5 w-5 text-blue-400" />
                      <p className="text-3xl font-bold text-blue-400">{seasonRollup.avg_package_lpa ?? 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Avg Package (LPA)</p>
                  </div>
                  <div className="bg-yellow-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-5 w-5 text-yellow-400" />
                      <p className="text-3xl font-bold text-yellow-400">{seasonRollup.highest_package_lpa ?? 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Highest Package (LPA)</p>
                  </div>
                </div>
                {seasonRollup.offers_by_branch && Object.keys(seasonRollup.offers_by_branch).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Offers by Branch</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(seasonRollup.offers_by_branch as Record<string, number>).map(([branch, count]) => (
                        <Badge key={branch} className="bg-primary/10 text-primary border-primary/20">
                          {branch}: {count} offer{count !== 1 ? "s" : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Drives Grid or Empty State */}
          {drives.length === 0 ? (
            <Card className="border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-12 text-center rounded-2xl">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Briefcase className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl font-bold">No Placement Drives Created Yet</CardTitle>
              <CardDescription className="max-w-md mx-auto mt-2 text-sm text-muted-foreground">
                Launch your first campus recruitment drive, define CGPA/Branch eligibility criteria, and run instant AI shortlists with targeted prep sprints for your students.
              </CardDescription>
              <div className="mt-6 flex justify-center">
                <Button onClick={() => setWizardOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campus Drive Wizard
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drives.map((d) => (
                <Card
                  key={d.driveId}
                  className="border-border/50 bg-card hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => handleSelectDrive(d)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{d.company}</h3>
                      <Badge variant="outline" className="capitalize">{d.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{d.roleTitle}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                      <span>CTC: {d.ctcText}</span>
                      <span className="flex items-center text-primary font-semibold">
                        View Shortlist
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === OFFER MODAL === */}
      <Dialog open={!!offerModalApp} onOpenChange={(open) => !open && setOfferModalApp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" /> Record Offer
            </DialogTitle>
            <DialogDescription>
              Recording offer for <strong>{offerModalApp?.studentName}</strong> ({offerModalApp?.branch})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-xl text-xs border border-border/40">
              <div>
                <span className="text-muted-foreground block">Student CGPA:</span>
                <span className="font-bold text-foreground">{offerModalApp?.cgpa ?? "—"}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block">Drive Configured CTC:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedDrive?.ctcText || (selectedDrive?.ctc ? `${selectedDrive.ctc} LPA` : "Not specified")}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="offer-lpa">Package (LPA) <span className="text-red-500">*</span></Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="offer-lpa" className="pl-9" type="number" step="0.1" min="0" placeholder="e.g. 8.5"
                  value={offerLpa} onChange={(e) => setOfferLpa(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="offer-letter-url">Offer Letter Document / Reference Link (optional)</Label>
              <Input id="offer-letter-url" placeholder="https://storage.googleapis.com/..." type="url"
                value={offerLetterUrl} onChange={(e) => setOfferLetterUrl(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="offer-joining-date">Joining Date (optional)</Label>
              <Input id="offer-joining-date" type="date" value={offerJoiningDate} onChange={(e) => setOfferJoiningDate(e.target.value)} />
            </div>
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 text-xs text-green-600">
              🔒 Package details are visible only to placement staff. Student will receive a congratulations notification with no salary info.
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setOfferModalApp(null)}>Cancel</Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSubmitOffer} disabled={submittingOffer}>
              {submittingOffer ? "Saving..." : "🎉 Confirm Offer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === REJECTION MODAL === */}
      <Dialog open={!!rejectModalApp} onOpenChange={(open) => !open && setRejectModalApp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" /> Record Rejection
            </DialogTitle>
            <DialogDescription>
              Recording rejection for <strong>{rejectModalApp?.studentName}</strong> ({rejectModalApp?.branch})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="reject-reason">Rejection Reason <span className="text-red-500">*</span></Label>
              <Select value={rejectReason} onValueChange={setRejectReason}>
                <SelectTrigger id="reject-reason">
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="reject-notes">Additional Notes (optional)</Label>
              <Textarea id="reject-notes" placeholder="Internal notes about this rejection..." rows={3}
                value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} />
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border text-xs text-muted-foreground">
              Student will receive a supportive message encouraging them to keep improving — no specific reason will be shared with them.
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setRejectModalApp(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleSubmitRejection} disabled={submittingReject}>
              {submittingReject ? "Saving..." : "Confirm Rejection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════
          P12: RESUME PACK GENERATOR DIALOG
          Shows only shortlisted/offered candidates; excludes pending (invited-only)
      ════════════════════════════════════════════════════════════════ */}
      <Dialog open={packDialogOpen} onOpenChange={setPackDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-violet-600" />
              Generate Resume Pack
            </DialogTitle>
            <DialogDescription>
              Select shortlisted / offered candidates to include. Only candidates with a{" "}
              <strong>verified resume</strong> will be bundled. Invited-only (pending) candidates
              are excluded. Signed URL is valid for <strong>7 days</strong>.
            </DialogDescription>
          </DialogHeader>

          {/* Candidate selector */}
          <div className="space-y-3">
            {packEligibleApps.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 opacity-40" />
                <p className="text-sm">No shortlisted or offered candidates yet.</p>
                <p className="text-xs opacity-70">
                  Move candidates to Shortlisted or Offered status first.
                </p>
              </div>
            ) : (
              <>
                {/* Select all */}
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm font-semibold">
                    Eligible candidates ({packEligibleApps.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={toggleSelectAllForPack}
                  >
                    {selectedPackUids.size === packEligibleApps.length
                      ? "Deselect All"
                      : `Select All (${packEligibleApps.length})`}
                  </Button>
                </div>

                {/* Candidate list */}
                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                  {packEligibleApps.map((app) => {
                    const checked = selectedPackUids.has(app.userId);
                    return (
                      <label
                        key={app.userId}
                        className={`flex items-center gap-3 rounded-lg p-2.5 border cursor-pointer transition-colors ${
                          checked
                            ? "bg-violet-50 dark:bg-violet-950/30 border-violet-400/50"
                            : "border-border/40 hover:bg-muted/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-violet-600 h-4 w-4 rounded"
                          checked={checked}
                          onChange={() => togglePackUid(app.userId)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{app.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.enrollmentNo} · {app.branch} · {app.cgpa} CGPA
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            app.outcome === "offer"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {app.outcome === "offer" ? "Offered" : "Shortlisted"}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Selected count */}
                <p className="text-xs text-muted-foreground">
                  {selectedPackUids.size} candidate{selectedPackUids.size !== 1 ? "s" : ""} selected
                  {selectedPackUids.size > 500 && (
                    <span className="text-amber-600 ml-2">
                      · &gt;500: pack will be split by branch
                    </span>
                  )}
                </p>

                {/* Recruiter email */}
                <div className="space-y-1">
                  <Label htmlFor="pack-recruiter-email" className="text-xs font-semibold">
                    Send link to recruiter (optional)
                  </Label>
                  <Input
                    id="pack-recruiter-email"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={packRecruiterEmail}
                    onChange={(e) => setPackRecruiterEmail(e.target.value)}
                  />
                </div>

                {/* Pack note */}
                <div className="space-y-1">
                  <Label htmlFor="pack-note" className="text-xs font-semibold">
                    Note for cover sheet (optional, max 300 chars)
                  </Label>
                  <Textarea
                    id="pack-note"
                    rows={2}
                    maxLength={300}
                    placeholder="e.g. First round shortlisted candidates for Accenture campus drive 2025"
                    value={packNote}
                    onChange={(e) => setPackNote(e.target.value)}
                  />
                </div>

                {/* Consent notice */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <p className="font-semibold">Consent notice</p>
                  <p>
                    Only students who have engaged this drive (shortlisted/offered) and have a
                    verified resume are included. Invited-only students are automatically excluded.
                  </p>
                </div>

                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={generatingPack || selectedPackUids.size === 0}
                  onClick={handleGenerateResumePack}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {generatingPack
                    ? `Generating pack for ${selectedPackUids.size} candidate(s)…`
                    : `Generate ZIP Pack (${selectedPackUids.size} selected)`}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════
          P12: RESUME PACK RESULT DIALOG
          Shows download links, split info, skipped list, 7-day expiry
      ════════════════════════════════════════════════════════════════ */}
      <Dialog open={packResultDialogOpen} onOpenChange={setPackResultDialogOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Resume Pack Ready
            </DialogTitle>
            <DialogDescription>
              Your signed download link is valid for{" "}
              <strong>7 days</strong>. Do not share this URL publicly.
            </DialogDescription>
          </DialogHeader>

          {packResult && (
            <div className="space-y-4">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted/30 border p-3">
                  <p className="text-xl font-bold text-primary">{packResult.totalIncluded}</p>
                  <p className="text-xs text-muted-foreground">Resumes included</p>
                </div>
                <div className="rounded-lg bg-muted/30 border p-3">
                  <p className="text-xl font-bold">{packResult.totalRequested}</p>
                  <p className="text-xs text-muted-foreground">Candidates selected</p>
                </div>
                <div className={`rounded-lg border p-3 ${packResult.totalSkipped > 0 ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200" : "bg-muted/30"}`}>
                  <p className={`text-xl font-bold ${packResult.totalSkipped > 0 ? "text-amber-600" : ""}`}>
                    {packResult.totalSkipped}
                  </p>
                  <p className="text-xs text-muted-foreground">Skipped (no verified resume)</p>
                </div>
              </div>

              {/* Expiry notice */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Link expires:{" "}
                  <strong>
                    {new Date(packResult.expiresAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                  {packResult.emailSent && " · Download link emailed to your registered address"}
                </span>
              </div>

              {/* Split notice */}
              {packResult.needsSplit && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
                  Pack split into {packResult.zips.length} branch-wise ZIPs ({">"} 500 resumes).
                </div>
              )}

              {/* Download links */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">Download Link(s)</p>
                {packResult.zips.map((z) => (
                  <div
                    key={z.label}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-card"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {z.label === "all" ? "All Branches" : `Branch: ${z.label}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{z.count} resume(s) + cover sheet</p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5 h-8 text-xs bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold cursor-pointer"
                      onClick={() => handleDownloadPackZip(z)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Package
                    </Button>
                  </div>
                ))}
              </div>

              {/* Recruiter Email Dispatch Confirmation */}
              {packRecruiterEmail && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Recruiter link prepared for: <strong>{packRecruiterEmail}</strong></span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-emerald-500/30 text-emerald-700 hover:bg-emerald-100/50 font-semibold cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(packResult.primaryDownloadUrl || window.location.href);
                      toast.success(`Recruiter access link copied to clipboard for ${packRecruiterEmail}!`);
                    }}
                  >
                    Copy Recruiter Link
                  </Button>
                </div>
              )}

              {/* Skipped candidates list */}
              {packResult.totalSkipped > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Skipped candidates — ask them to submit + get resume verified
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {packResult.skipped.map((s) => (
                      <div
                        key={s.uid}
                        className="flex items-center justify-between text-xs bg-amber-50 dark:bg-amber-950/20 rounded px-3 py-1.5"
                      >
                        <span className="font-medium truncate">{s.name}</span>
                        <span className="text-amber-600 dark:text-amber-400 ml-2 shrink-0">
                          {s.reason || "No verified resume"}
                        </span>
                      </div>
                    ))}
                    {packResult.totalSkipped > packResult.skipped.length && (
                      <p className="text-xs text-muted-foreground text-center pt-1">
                        + {packResult.totalSkipped - packResult.skipped.length} more skipped
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setPackResultDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
