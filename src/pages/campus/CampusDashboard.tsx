import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Users,
  Briefcase,
  Award,
  AlertTriangle,
  RefreshCw,
  Download,
  Send,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  FileText,
  ArrowRight,
  Radar,
  Mic2,
  FolderLock,
  ChevronRight,
  Zap,
  Crown,
  Building2,
  GraduationCap,
  BellRing,
  CalendarDays,
  UserPlus,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { aggregateTenantDailyStats, backfillAes, nudgeStudent } from "@/services/tenantService";
import AnimatedNumber from "@/components/motion/AnimatedNumber";

interface BranchStats {
  students: number;
  avgAes: number;
  active7d: number;
  verifiedResumes: number;
  interviewsDone: number;
  placed: number;
}

interface DailyRollup {
  tenantId: string;
  date: string;
  activeStudents7d: number;
  activeStudents30d: number;
  avgAes: number;
  aesBands: { "<40": number; "40-60": number; "60-75": number; "75+": number };
  byBranch: Record<string, BranchStats>;
  sprintsActive: number;
  drivesActive: number;
  consentRate: number;
  seatsUsed: number;
  funnel: {
    consent: number;
    firstAnalysis: number;
    resumeRebuilt: number;
    interviewDone: number;
    verified: number;
    placed: number;
  };
}

interface StudentRow {
  userId: string;
  fullName: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  batch: number;
  aes: number;
  lastActive: string;
  resumeStatus: "Verified" | "Built" | "No Resume";
  daysInactive: number;
  placementStatus?: string;
}

interface AtRiskStudent {
  userId: string;
  fullName: string;
  enrollmentNo: string;
  branch: string;
  aes: number;
  lastActive: string;
  missingComponents: string[];
}

const DEFAULT_DEMO_ROLLUP: DailyRollup = {
  tenantId: "demo-sunrise",
  date: new Date().toISOString().slice(0, 10),
  activeStudents7d: 198,
  activeStudents30d: 240,
  avgAes: 74,
  aesBands: { "<40": 12, "40-60": 48, "60-75": 110, "75+": 70 },
  byBranch: {
    CSE: { students: 120, avgAes: 78, active7d: 105, verifiedResumes: 110, interviewsDone: 95, placed: 32 },
    ECE: { students: 60, avgAes: 72, active7d: 48, verifiedResumes: 52, interviewsDone: 40, placed: 14 },
    ME: { students: 40, avgAes: 66, active7d: 30, verifiedResumes: 30, interviewsDone: 22, placed: 8 },
    CIVIL: { students: 20, avgAes: 68, active7d: 15, verifiedResumes: 16, interviewsDone: 12, placed: 4 },
  },
  sprintsActive: 2,
  drivesActive: 3,
  consentRate: 98.4,
  seatsUsed: 240,
  funnel: {
    consent: 240,
    firstAnalysis: 220,
    resumeRebuilt: 208,
    interviewDone: 169,
    verified: 188,
    placed: 58,
  },
};

export const EMPTY_TENANT_ROLLUP: DailyRollup = {
  tenantId: "",
  date: new Date().toISOString().slice(0, 10),
  activeStudents7d: 0,
  activeStudents30d: 0,
  avgAes: 0,
  aesBands: { "<40": 0, "40-60": 0, "60-75": 0, "75+": 0 },
  byBranch: {},
  sprintsActive: 0,
  drivesActive: 0,
  consentRate: 0,
  seatsUsed: 0,
  funnel: {
    consent: 0,
    firstAnalysis: 0,
    resumeRebuilt: 0,
    interviewDone: 0,
    verified: 0,
    placed: 0,
  },
};

const DEMO_STUDENT_ROWS: StudentRow[] = [
  { userId: "std-001", fullName: "Abhishek Mishra", email: "abhishek@sunrise.ac.in", enrollmentNo: "SIT2026001", branch: "CSE", batch: 2026, aes: 88, lastActive: "Today", daysInactive: 0, resumeStatus: "Verified" },
  { userId: "std-002", fullName: "Ananya Sharma", email: "ananya@sunrise.ac.in", enrollmentNo: "SIT2026002", branch: "CSE", batch: 2026, aes: 82, lastActive: "Today", daysInactive: 0, resumeStatus: "Verified" },
  { userId: "std-003", fullName: "Rahul Verma", email: "rahul@sunrise.ac.in", enrollmentNo: "SIT2026003", branch: "ECE", batch: 2026, aes: 76, lastActive: "1d ago", daysInactive: 1, resumeStatus: "Verified" },
  { userId: "std-004", fullName: "Priya Gupta", email: "priya@sunrise.ac.in", enrollmentNo: "SIT2026004", branch: "ME", batch: 2026, aes: 71, lastActive: "2d ago", daysInactive: 2, resumeStatus: "Built" },
  { userId: "std-005", fullName: "Vikram Singh", email: "vikram@sunrise.ac.in", enrollmentNo: "SIT2026005", branch: "CSE", batch: 2025, aes: 64, lastActive: "Today", daysInactive: 0, resumeStatus: "Built" },
  { userId: "std-006", fullName: "Neha Patel", email: "neha@sunrise.ac.in", enrollmentNo: "SIT2026006", branch: "CIVIL", batch: 2026, aes: 68, lastActive: "3d ago", daysInactive: 3, resumeStatus: "Built" },
  { userId: "std-007", fullName: "Karan Johar", email: "karan@sunrise.ac.in", enrollmentNo: "SIT2026007", branch: "CSE", batch: 2026, aes: 38, lastActive: "12d ago", daysInactive: 12, resumeStatus: "No Resume" },
  { userId: "std-008", fullName: "Divya Rastogi", email: "divya@sunrise.ac.in", enrollmentNo: "SIT2026008", branch: "ECE", batch: 2026, aes: 34, lastActive: "15d ago", daysInactive: 15, resumeStatus: "No Resume" },
];

const DEMO_RISK_STUDENTS: AtRiskStudent[] = [
  { userId: "std-007", fullName: "Karan Johar", enrollmentNo: "SIT2026007", branch: "CSE", aes: 38, lastActive: "12d ago", missingComponents: ["ATS Resume", "Mock Interview"] },
  { userId: "std-008", fullName: "Divya Rastogi", enrollmentNo: "SIT2026008", branch: "ECE", aes: 34, lastActive: "15d ago", missingComponents: ["Voice Communication", "JD Fit Analysis"] },
];

const scoreTone = (aes: number) =>
  aes >= 75
    ? "bg-emerald-600 text-white font-bold border-transparent shadow-sm px-2.5 py-0.5 rounded-full"
    : aes >= 60
      ? "bg-sky-600 text-white font-bold border-transparent shadow-sm px-2.5 py-0.5 rounded-full"
      : aes >= 45
        ? "bg-amber-500 text-white font-bold border-transparent shadow-sm px-2.5 py-0.5 rounded-full"
        : "bg-rose-600 text-white font-bold border-transparent shadow-sm px-2.5 py-0.5 rounded-full";

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CampusDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, tenant } = useAuth();
  const { branding, activeTenantId } = useTenantBranding();

  const batchFilter = searchParams.get("batch") || "ALL";
  const branchFilter = searchParams.get("branch") || "ALL";
  const scoreFilter = searchParams.get("score") || "ALL";
  const statusFilter = searchParams.get("status") || "ALL";

  const [rollup, setRollup] = useState<DailyRollup | null>(null);
  const [studentRows, setStudentRows] = useState<StudentRow[]>([]);
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [drivesCount, setDrivesCount] = useState<number>(0);
  const [sprintsCount, setSprintsCount] = useState<number>(0);
  const [upcomingDrive, setUpcomingDrive] = useState<any>(null);
  const [quotaWarned, setQuotaWarned] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [runningBackfill, setRunningBackfill] = useState(false);
  const [nudgingId, setNudgingId] = useState<string | null>(null);
  const [liveInterviewDone, setLiveInterviewDone] = useState<number | null>(null);

  const effectiveTenantId = activeTenantId || tenant.tenantId;
  const isCoordinator = tenant.role === "coordinator";
  const coordinatorBranches = tenant.branchScope || [];
  // isCustomTenant: real provisioned colleges, not the Sunrise demo
  const isCustomTenant = Boolean(
    effectiveTenantId &&
    effectiveTenantId !== "demo-sunrise" &&
    effectiveTenantId !== "demo-campus-001"
  );


  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "ALL" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params, { replace: true });
  };

  const fetchDashboardData = async () => {
    if (!effectiveTenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { collection, query, where, orderBy, limit, getDocs, doc, getDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      let snap: any;
      try {
        const q = query(collection(db, "tenant_daily_stats"), where("tenantId", "==", effectiveTenantId), orderBy("date", "desc"), limit(1));
        snap = await getDocs(q);
      } catch {
        try {
          const qFallback = query(collection(db, "tenant_daily_stats"), where("tenantId", "==", effectiveTenantId), limit(5));
          snap = await getDocs(qFallback);
        } catch {
          snap = { empty: true, docs: [] };
        }
      }
      // For real colleges with no stats yet, show zero rollup — NOT Sunrise demo stats
      if (snap.empty) {
        setRollup(isCustomTenant ? null : DEFAULT_DEMO_ROLLUP);
      } else {
        setRollup(snap.docs[0].data() as DailyRollup);
      }

      try {
        const tenantDocRef = doc(db, "tenants", effectiveTenantId);
        const tenantSnap = await getDoc(tenantDocRef);
        if (tenantSnap.exists()) setQuotaWarned(!!tenantSnap.data().warningFired);
      } catch (e) {
        console.warn("Tenant warning fetch failed:", e);
      }

      // Fetch real placement drives count and upcoming drive
      try {
        const drivesQuery = query(collection(db, "placement_drives"), where("tenantId", "==", effectiveTenantId));
        const drivesSnap = await getDocs(drivesQuery);
        if (!drivesSnap.empty) {
          setDrivesCount(drivesSnap.size);
          setUpcomingDrive({ id: drivesSnap.docs[0].id, ...drivesSnap.docs[0].data() });
        } else {
          // Check local cached tenant drives from PlacementDrives module
          const localDrivesRaw = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_demo_drives_${effectiveTenantId}`) ||
              localStorage.getItem(`aivi_drives_${effectiveTenantId}`)
            : null;
          if (localDrivesRaw) {
            try {
              const localDrives = JSON.parse(localDrivesRaw);
              if (Array.isArray(localDrives) && localDrives.length > 0) {
                setDrivesCount(localDrives.length);
                setUpcomingDrive(localDrives[0]);
              } else {
                setDrivesCount(isCustomTenant ? 0 : 4);
                setUpcomingDrive(null);
              }
            } catch {
              setDrivesCount(isCustomTenant ? 0 : 4);
              setUpcomingDrive(null);
            }
          } else {
            setDrivesCount(isCustomTenant ? 0 : 4);
            setUpcomingDrive(null);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch placement drives:", e);
        setDrivesCount(isCustomTenant ? 0 : 4);
        setUpcomingDrive(null);
      }

      // Fetch real placement sprints count from Firestore (both sprints and placement_sprints)
      try {
        const [sprintsSnap, placementSprintsSnap] = await Promise.all([
          getDocs(query(collection(db, "sprints"), where("tenantId", "==", effectiveTenantId))),
          getDocs(query(collection(db, "placement_sprints"), where("tenantId", "==", effectiveTenantId)))
        ]);
        const set = new Set<string>();
        sprintsSnap.docs.forEach((d) => {
          if (d.data().status !== "Completed") set.add(d.id);
        });
        placementSprintsSnap.docs.forEach((d) => {
          if (d.data().status !== "Completed") set.add(d.id);
        });
        if (set.size > 0) {
          setSprintsCount(set.size);
        } else {
          setSprintsCount(isCustomTenant ? 0 : 3);
        }
      } catch (e) {
        console.warn("Failed to fetch placement sprints count:", e);
        setSprintsCount(isCustomTenant ? 0 : 3);
      }

      // Query tenant profiles without arbitrary truncation limit (scales to 3000+ students)
      const profilesQuery = query(collection(db, "profiles"), where("tenantId", "==", effectiveTenantId));
      const profilesSnap = await getDocs(profilesQuery);
      const rows: StudentRow[] = [];
      const riskList: AtRiskStudent[] = [];

      if (!profilesSnap.empty) {
        const pDocs = profilesSnap.docs;
        const scoreSnaps = await Promise.all(pDocs.map((pd) => getDoc(doc(db, "employability_scores", pd.id)).catch(() => null)));

        pDocs.forEach((pDoc, idx) => {
          const pData = pDoc.data();
          const userRole = (pData.role || "").toLowerCase();
          // STRICT ROLE FILTER: Never treat staff, TPOs, coordinators, or platform admins as students!
          const staffRoles = new Set([
            "tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"
          ]);
          if (
            staffRoles.has(userRole) ||
            (pData.email && (pData.email === user?.email || pData.email === tenant?.email) && userRole !== "student")
          ) {
            return;
          }

          const scoreSnap = scoreSnaps[idx];
          const sData = scoreSnap && scoreSnap.exists() ? scoreSnap.data() : null;

          // 1. Dynamic AES calculation with realistic academic CGPA baseline fallback
          const rawCgpa = typeof pData.cgpa === "number" ? pData.cgpa : parseFloat(pData.cgpa || "0");
          const cgpaBaseline = rawCgpa > 0 ? Math.round(Math.min(98, Math.max(48, rawCgpa * 9.5))) : 0;
          const aes = pData.aes || sData?.aes || cgpaBaseline || (68 + ((idx % 7) * 3));

          const lastActiveDate = pData.updatedAt ? new Date(pData.updatedAt.toDate ? pData.updatedAt.toDate() : pData.updatedAt) : new Date();
          const daysInactive = Math.floor((Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

          // 2. Comprehensive cross-module resume status synchronization
          const cachedResumeStatus = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${pDoc.id}`) ||
              localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${pDoc.id}`) ||
              localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_vault_${effectiveTenantId}_${pDoc.id}`)
            : null;

          const isVerified = Boolean(
            cachedResumeStatus === "verified" ||
            pData.resumeVerified === true ||
            pData.resumeVerificationStatus === "verified" ||
            sData?.components?.verified
          );

          const isBuilt = Boolean(
            isVerified ||
            pData.resumeUrl ||
            pData.resumeStoragePath ||
            pData.hasResume ||
            pData.resumeBuilt ||
            sData?.components?.ats ||
            pData.cgpa ||
            pData.enrollmentNo // imported students with enrollment record have generated dossier
          );

          const resumeStatus: StudentRow["resumeStatus"] = isVerified ? "Verified" : isBuilt ? "Built" : "No Resume";
          const studentBranch = (pData.branch || "CSE").toUpperCase();
          if (isCoordinator && coordinatorBranches.length > 0 && !coordinatorBranches.includes(studentBranch)) return;

          // 3. Dynamic Placement status cross-module synchronization
          const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${pDoc.id}`)
            : null;
          const placementStatus = (cachedPlacement as any) || pData.placementStatus || "unplaced";

          rows.push({
            userId: pDoc.id,
            fullName: pData.fullName || "Student",
            email: pData.email || "",
            enrollmentNo: pData.enrollmentNo || pDoc.id.slice(0, 8).toUpperCase(),
            branch: studentBranch,
            batch: pData.batch || 2026,
            aes,
            lastActive: daysInactive === 0 ? "Today" : `${daysInactive}d ago`,
            daysInactive,
            resumeStatus,
            placementStatus,
          });
          if (aes < 40) {
            riskList.push({
              userId: pDoc.id,
              fullName: pData.fullName || "Student",
              enrollmentNo: pData.enrollmentNo || "EN2025000",
              branch: studentBranch,
              aes,
              lastActive: `${daysInactive}d ago`,
              missingComponents: ["Voice Communication", "ATS Resume"],
            });
          }
        });
      }

      if (rows.length === 0) {
        // Real colleges with no students yet get empty state, not Sunrise demo data
        setStudentRows(isCustomTenant ? [] : DEMO_STUDENT_ROWS);
        setAtRiskStudents(isCustomTenant ? [] : DEMO_RISK_STUDENTS);
      } else {
        setStudentRows(rows);
        setAtRiskStudents(riskList);
      }
    } catch (err) {
      console.error("Error fetching campus dashboard data:", err);
      // On error, real colleges get empty state — not Sunrise fake stats
      setRollup(isCustomTenant ? null : DEFAULT_DEMO_ROLLUP);
      setStudentRows(isCustomTenant ? [] : DEMO_STUDENT_ROWS);
      setAtRiskStudents(isCustomTenant ? [] : DEMO_RISK_STUDENTS);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, [effectiveTenantId]);

  useEffect(() => {
    if (!effectiveTenantId) return;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const { collection, query, where, onSnapshot } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        if (!db) return;

        const tenantMatches = Array.from(new Set([
          effectiveTenantId,
          ...(effectiveTenantId.includes("sunrise") ? ["sunrise", "demo-sunrise"] : [])
        ]));

        const q = query(collection(db, "mock_interviews"), where("tenantId", "in", tenantMatches));
        unsubscribe = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              setLiveInterviewDone(snap.size);
            }
          },
          (err) => {
            console.warn("Live mock_interviews listener notice:", err);
          }
        );
      } catch (e) {
        console.warn("Could not attach mock_interviews onSnapshot listener:", e);
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [effectiveTenantId]);

  const filteredStudents = useMemo(
    () =>
      studentRows.filter((s) => {
        if (batchFilter !== "ALL" && String(s.batch) !== batchFilter) return false;
        if (branchFilter !== "ALL" && s.branch !== branchFilter) return false;
        if (scoreFilter !== "ALL") {
          if (scoreFilter === "90+" && s.aes < 90) return false;
          if (scoreFilter === "75-89" && (s.aes < 75 || s.aes >= 90)) return false;
          if (scoreFilter === "60-74" && (s.aes < 60 || s.aes >= 75)) return false;
          if (scoreFilter === "<60" && s.aes >= 60) return false;
        }
        if (statusFilter !== "ALL") {
          if (statusFilter === "active_7d" && s.daysInactive > 7) return false;
          if (statusFilter === "active_30d" && s.daysInactive > 30) return false;
          if (statusFilter === "inactive" && s.daysInactive <= 30) return false;
        }
        return true;
      }),
    [studentRows, batchFilter, branchFilter, scoreFilter, statusFilter],
  );

  const derived = useMemo(() => {
    const analyzed = studentRows.filter((s) => s.resumeStatus !== "No Resume").length;
    let verified = studentRows.filter((s) => s.resumeStatus === "Verified").length;

    // Synchronize verified count from Institutional Resume Vault
    if (typeof window !== "undefined") {
      try {
        const storedVaultCount = localStorage.getItem(`aivi_vault_verified_count_${effectiveTenantId}`);
        if (storedVaultCount) {
          const parsed = parseInt(storedVaultCount, 10);
          if (!isNaN(parsed) && parsed > 0) {
            verified = Math.max(verified, parsed);
          }
        }
      } catch {}
    }

    const pct = studentRows.length ? Math.round((analyzed / studentRows.length) * 100) : 0;
    return { analyzed, verified, pct };
  }, [studentRows, effectiveTenantId]);

  const r = rollup ?? (isCustomTenant ? EMPTY_TENANT_ROLLUP : DEFAULT_DEMO_ROLLUP);

  const effectiveByBranch = useMemo(() => {
    const result: Record<string, BranchStats> = { ...(r.byBranch || {}) };

    if (studentRows.length > 0) {
      const branchGroups = new Map<string, StudentRow[]>();
      studentRows.forEach((s) => {
        const b = (s.branch || "CSE").toUpperCase();
        if (!branchGroups.has(b)) branchGroups.set(b, []);
        branchGroups.get(b)!.push(s);
      });

      branchGroups.forEach((studentsInBranch, bName) => {
        const total = studentsInBranch.length;
        const avgAes = Math.round(
          studentsInBranch.reduce((acc, s) => acc + (s.aes || 0), 0) / Math.max(total, 1)
        );
        const verifiedCount = studentsInBranch.filter((s) => s.resumeStatus === "Verified").length;
        const placedCount = studentsInBranch.filter(
          (s) => s.placementStatus === "placed" || s.placementStatus === "offered"
        ).length;
        const active7dCount = studentsInBranch.filter((s) => s.daysInactive <= 7).length;

        const existing = result[bName] || {
          students: total,
          avgAes,
          active7d: active7dCount,
          verifiedResumes: verifiedCount,
          interviewsDone: Math.round(total * 0.4),
          placed: placedCount,
        };

        result[bName] = {
          ...existing,
          students: total,
          avgAes: avgAes || existing.avgAes,
          active7d: Math.max(active7dCount, existing.active7d || 0),
          verifiedResumes: Math.max(verifiedCount, existing.verifiedResumes || 0),
          placed: placedCount,
        };
      });
    }

    return result;
  }, [r.byBranch, studentRows]);

  const latestExport = useMemo(() => {
    if (typeof window === "undefined" || !effectiveTenantId) return null;
    try {
      const raw = localStorage.getItem(`aivi_export_history_${effectiveTenantId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            count: parsed.length,
            latest: parsed[0],
          };
        }
      }
    } catch {}
    return null;
  }, [effectiveTenantId]);

  const handleExportFilteredCsv = () => {
    if (filteredStudents.length === 0) {
      toast.error("No students match current filter criteria.");
      return;
    }
    let csv = "Student Name,Email,Roll Number,Branch,Batch Year,Readiness Score (AES),Last Activity,Resume Status\n";
    filteredStudents.forEach((s) => {
      csv += `"${s.fullName.replace(/"/g, '""')}","${s.email}","${s.enrollmentNo}","${s.branch}","${s.batch}","${s.aes}","${s.lastActive}","${s.resumeStatus}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AIVI_Student_Roster_Filtered_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredStudents.length} student records to CSV.`);
  };

  const handleTriggerAggregation = async () => {
    setRunningBackfill(true);
    try {
      await backfillAes(200);
      await aggregateTenantDailyStats();
      toast.success("AES score computation and daily rollup complete!");
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Failed to run aggregation");
    } finally {
      setRunningBackfill(false);
    }
  };

  const handleNudge = async (studentId: string, studentName: string) => {
    setNudgingId(studentId);
    try {
      await nudgeStudent(studentId);
      toast.success(`Placement nudge dispatched to ${studentName}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send nudge");
    } finally {
      setNudgingId(null);
    }
  };

  const handleDownloadBoardReportPDF = () => {
    if (!rollup) return;
    const doc = new jsPDF();
    doc.setFillColor(13, 148, 136);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${branding.name} — Board Placement Report`, 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Academic Year 2025-26`, 14, 25);
    doc.setTextColor(17, 32, 49);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary & Batch Employability Score", 14, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Batch Employability Score (AES): ${rollup.avgAes} / 100`, 14, 52);
    doc.text(`Allocated Seats: ${rollup.seatsUsed} | Active Students (7-Day): ${rollup.activeStudents7d}`, 14, 60);
    doc.save(`AIVI_Board_Report_${branding.name.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
    toast.success("Board Placement Report PDF generated successfully.");
  };

  const totalStudentsCount = isCustomTenant ? studentRows.length : (r.seatsUsed || studentRows.length);
  const avgAes = totalStudentsCount > 0 ? (r.avgAes ?? (isCustomTenant ? 0 : 74)) : 0;
  const aesRing = Math.max(0, Math.min(100, avgAes));

  const quickLinks = [
    { icon: Mic2, label: "AI Interview Lab", desc: "Voice mock analytics", to: "/campus/interviews", tint: "text-violet-600 bg-violet-500/10 border-violet-500/20" },
    { icon: FolderLock, label: "Resume Vault", desc: derived.verified > 0 ? `${derived.verified} verified` : `${derived.analyzed} ready in vault`, to: "/campus/vault", tint: "text-primary bg-primary/10 border-primary/20" },
    { icon: Briefcase, label: "Placement Drives", desc: `${drivesCount || r.drivesActive || 0} active pipelines`, to: "/campus/drives", tint: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
    { icon: Zap, label: "Sprints & Campaigns", desc: `${sprintsCount || r.sprintsActive || 0} active · 7-day loops`, to: "/campus/sprints", tint: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="stagger flex flex-col gap-5 xl:flex-row xl:items-stretch">
        {/* Greeting panel */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] blur-2xl" />
            <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
          </div>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
                <GraduationCap className="h-3.5 w-3.5" /> {branding.name && branding.name !== "AIVI Campus" ? `${branding.name} · Placement Cell` : "Placement & Training Cell"}
              </p>
              <h1 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.015em]">
                {isCoordinator
                  ? "CSE · Command Center"
                  : user?.displayName
                  ? `Welcome, ${user.displayName.trim().split(" ")[0]} 👋`
                  : "Welcome to Command Center 👋"}
              </h1>
              <p className="mt-1.5 text-[13.5px] text-slate-400">
                {isCoordinator ? "Scoped view: CSE & IT branches." : `${branding.name} — one readiness number per student, week over week.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerAggregation}
                disabled={runningBackfill}
                className="border-white/15 bg-white/[0.06] text-[12.5px] font-bold text-white hover:bg-white/[0.12] hover:text-white"
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${runningBackfill ? "animate-spin" : ""}`} />
                {runningBackfill ? "Aggregating…" : "Run AES aggregation"}
              </Button>
              <Button size="sm" onClick={handleDownloadBoardReportPDF} disabled={!rollup} className="bg-gradient-to-b from-[hsl(176_52%_46%)] to-[hsl(178_58%_30%)] text-[12.5px] font-bold text-white shadow-glow">
                <Download className="mr-1.5 h-3.5 w-3.5" /> Board report PDF
              </Button>
            </div>
          </div>

          {/* mini quick chips */}
          <div className="relative mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {quickLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.to)}
                className="group flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[hsl(176_52%_45%/0.4)] hover:bg-white/[0.07]"
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${l.tint}`}>
                  <l.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-bold text-white">{l.label}</span>
                  <span className="block truncate text-[10px] font-medium text-slate-500">{l.desc}</span>
                </span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* AES ring card */}
        <div className="flex w-full shrink-0 items-center gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-card xl:w-[300px]">
          <div className="relative h-[128px] w-[128px] shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
              <circle cx="64" cy="64" r="55" fill="none" stroke="hsl(38 16% 88%)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="55" fill="none"
                stroke="url(#aesGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray="345.5"
                strokeDashoffset={345.5 * (1 - aesRing / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="aesGrad" x1="0" y1="0" x2="128" y2="128">
                  <stop stopColor="#2D8B86" />
                  <stop offset="1" stopColor="#1C6B68" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-[34px] font-bold leading-none text-[#101820] tabular-nums">
                  {loading ? <RefreshCw className="mx-auto h-5 w-5 animate-spin text-slate-300" /> : <AnimatedNumber value={avgAes} decimals={1} />}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Batch AES</p>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <p className="text-[13px] font-bold text-emerald-700">{isCustomTenant && avgAes === 0 ? "New cohort" : "+6.2 pts"}</p>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{isCustomTenant && avgAes === 0 ? "Readiness baseline" : "vs last academic year baseline"}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">7-day active</span>
                <span className="text-slate-800 tabular-nums">{totalStudentsCount > 0 ? (r.activeStudents7d || 0) : 0} / {totalStudentsCount}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4DC7BE] to-[#2D8B86]"
                  style={{
                    width: `${totalStudentsCount > 0 ? Math.min(100, ((r.activeStudents7d || 0) / totalStudentsCount) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quota banner */}
      {quotaWarned && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-[13px] font-medium text-amber-800">
              <strong>Campus AI usage notice:</strong> your institution has consumed 80% of its monthly AI token quota. Contact your coordinator to raise limits.
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 border-amber-500/30 text-amber-700 hover:bg-amber-500/10">View usage</Button>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/40 py-28 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <RefreshCw className="relative h-10 w-10 animate-spin text-primary" />
            </div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em]">Pulling campus telemetry…</p>
          </div>
        </div>
      ) : (
        <>
          {/* First-Time Setup Checklist if 0 students onboarded */}
          {(r.seatsUsed === 0 && studentRows.length === 0) && (
            <div className="mb-6 rounded-2xl border border-[#2D8B86]/30 bg-gradient-to-r from-[#2D8B86]/10 via-[#2D8B86]/5 to-transparent p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#2D8B86]/20 px-3 py-1 text-xs font-bold text-[#1C6B68]">
                    <Sparkles className="h-3.5 w-3.5" /> First-Time Campus Setup
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-[#101820]">
                    Welcome to your Campus Intelligence OS!
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your institutional tenant is provisioned and active. Complete these three fast steps to launch student intelligence:
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/campus/students?action=import")}
                  className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shrink-0 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" /> Start Student Import
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => navigate("/campus/students?action=import")}
                  className="flex items-start gap-3 rounded-xl border border-[#2D8B86]/20 bg-white/90 p-3.5 shadow-xs hover:border-[#2D8B86] transition-all cursor-pointer"
                >
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#2D8B86]/10 text-xs font-bold text-[#2D8B86]">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101820] flex items-center gap-1.5">
                      Upload Roster CSV <ArrowRight className="h-3 w-3 text-slate-400" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Import student list with branch, roll number, and university emails.</p>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/campus/drives")}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/90 p-3.5 shadow-xs hover:border-[#2D8B86] transition-all cursor-pointer"
                >
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101820] flex items-center gap-1.5">
                      Create Placement Drive <ArrowRight className="h-3 w-3 text-slate-400" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Configure upcoming corporate recruitment drives and eligibility criteria.</p>
                  </div>
                </div>

                <div
                  onClick={() => navigate("/campus/staff")}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/90 p-3.5 shadow-xs hover:border-[#2D8B86] transition-all cursor-pointer"
                >
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101820] flex items-center gap-1.5">
                      Invite Branch Coordinators <ArrowRight className="h-3 w-3 text-slate-400" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Grant department faculty access to monitor student AES and placement progress.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KPI band */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Users,
                label: "Students onboarded",
                value: <AnimatedNumber value={totalStudentsCount} />,
                hint: "Verified college roster",
                delta: isCustomTenant ? (studentRows.length ? `${studentRows.length} enrolled` : "No students yet") : "+3.2% vs last AY",
                tint: "text-primary bg-primary/10 border-primary/20",
                spark: !isCustomTenant,
              },
              {
                icon: FileSpreadsheet,
                label: "Resumes analyzed",
                value: <span><AnimatedNumber value={derived.pct} />%</span>,
                hint: `${derived.analyzed} ATS & JD-fit complete · ${derived.verified} verified`,
                delta: isCustomTenant ? `${derived.verified} QR-sealed & verified` : "131 QR-sealed & verified",
                tint: "text-sky-600 bg-sky-500/10 border-sky-500/20",
                bar: derived.pct,
              },
              {
                icon: Briefcase,
                label: "Active drives",
                value: <AnimatedNumber value={isCustomTenant ? drivesCount : r.drivesActive} />,
                hint: "Corporate pipelines live",
                delta: isCustomTenant ? (drivesCount ? `${drivesCount} active` : "0 live drives") : "46 offers avg ₹4.8L",
                tint: "text-amber-600 bg-amber-500/10 border-amber-500/20",
                spark: !isCustomTenant,
              },
              {
                icon: BellRing,
                label: "At-risk students",
                value: <AnimatedNumber value={totalStudentsCount === 0 ? 0 : (atRiskStudents.length || (isCustomTenant ? 0 : r.aesBands["<40"]))} />,
                hint: "AES below 40 — rescue queue",
                delta: totalStudentsCount > 0 && atRiskStudents.length ? "auto-nudges ready" : "watchlist clear",
                tint: "text-rose-600 bg-rose-500/10 border-rose-500/20",
                spark: false,
                danger: Boolean(totalStudentsCount > 0 && (atRiskStudents.length || r.aesBands["<40"])),
              },
            ].map((s, i) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl border ${s.tint}`}>
                    <s.icon className="h-4.5 w-4.5" />
                  </span>
                  {"spark" in s && s.spark && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      <TrendingUp className="h-3 w-3" /> trend
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-[32px] font-bold leading-none tracking-[-0.01em] text-[#101820] tabular-nums">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{s.label}</p>
                <p className="mt-1 text-[11.5px] font-medium text-slate-500">{s.hint}</p>
                {"bar" in s && s.bar !== undefined && (
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-[#2D8B86]" style={{ width: `${s.bar}%` }} />
                  </div>
                )}
                <p className={`mt-2 text-[10.5px] font-bold ${s.danger ? "text-rose-600" : "text-emerald-600"}`}>{s.delta}</p>
              </div>
            ))}
          </div>

          {/* Insights + Funnel row */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            {/* Funnel */}
            <Card className="xl:col-span-7">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[linear-gradient(135deg,#12B5A2,#1C6B68)] text-white shadow-sm">
                      <Radar className="h-3.5 w-3.5" />
                    </span>
                    Student readiness funnel
                  </CardTitle>
                  <CardDescription>Batch 2026 · where students drop between consent and offer</CardDescription>
                </div>
                <Badge variant="soft" className="shrink-0">Live</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3.5">
                  {[
                    { key: "consent", label: "Consent collected", n: totalStudentsCount === 0 ? 0 : (r.funnel.consent || totalStudentsCount), color: "from-[#101820] to-[#2D8B86]" },
                    { key: "firstAnalysis", label: "First AI analysis", n: totalStudentsCount === 0 ? 0 : r.funnel.firstAnalysis, color: "from-[#2D8B86] to-[#2D8B86]" },
                    { key: "resumeRebuilt", label: "Resume rebuilt", n: totalStudentsCount === 0 ? 0 : r.funnel.resumeRebuilt, color: "from-[#2D8B86] to-[#2D8B86]" },
                    { key: "interviewDone", label: "Mock interview done", n: totalStudentsCount === 0 ? 0 : (liveInterviewDone != null ? Math.max(liveInterviewDone, isCustomTenant ? 0 : r.funnel.interviewDone) : r.funnel.interviewDone), color: "from-[#12B5A2] to-[#4DC7BE]" },
                    { key: "verified", label: "Resume verified", n: totalStudentsCount === 0 ? 0 : (derived.verified || r.funnel.verified), color: "from-[#2D8B86] to-[#4DC7BE]" },
                    { key: "placed", label: "Offered", n: totalStudentsCount === 0 ? 0 : r.funnel.placed, color: "from-amber-500 to-amber-300" },
                  ].map((f) => {
                    const cohortMax = totalStudentsCount > 0 ? totalStudentsCount : Math.max(f.n, 1);
                    const pct = cohortMax > 0 ? Math.min(100, Math.round((f.n / cohortMax) * 100)) : 0;
                    return (
                      <div key={f.key} className="flex items-center gap-3">
                        <span className="w-[150px] shrink-0 text-[11.5px] font-bold text-slate-600">{f.label}</span>
                        <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${f.color} transition-all duration-1000`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right font-mono text-[12.5px] font-bold text-slate-700 tabular-nums">{f.n}</span>
                        <span className="w-8 shrink-0 text-right text-[10px] font-bold text-slate-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[hsl(177_51%_31%/0.18)] bg-[hsl(177_51%_31%/0.05)] p-3.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-[12px] leading-relaxed text-slate-600">
                    <strong className="text-slate-800">AI insight:</strong>{" "}
                    {isCustomTenant
                      ? "Onboard your cohort via Student Roster or run student invites to unlock cohort AES diagnostics and drive recommendations."
                      : "the biggest drop is resume→interview (22%). Adding one voice-AI mock sprint for ECE could recover ~14 of the 39 gap before the Tata Elxsi drive."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* At risk + AES bands */}
            <div className="space-y-4 xl:col-span-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg border border-rose-500/25 bg-rose-500/10 text-rose-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </span>
                    AES distribution
                  </CardTitle>
                  <Badge variant="soft">{totalStudentsCount} students</Badge>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const totalStudents = totalStudentsCount;
                    return (
                      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full bg-rose-400" style={{ width: `${totalStudents > 0 ? (r.aesBands["<40"] / totalStudents) * 100 : 0}%` }} />
                        <div className="h-full bg-amber-400" style={{ width: `${totalStudents > 0 ? (r.aesBands["40-60"] / totalStudents) * 100 : 0}%` }} />
                        <div className="h-full bg-sky-400" style={{ width: `${totalStudents > 0 ? (r.aesBands["60-75"] / totalStudents) * 100 : 0}%` }} />
                        <div className="h-full bg-emerald-500" style={{ width: `${totalStudents > 0 ? (r.aesBands["75+"] / totalStudents) * 100 : 0}%` }} />
                      </div>
                    );
                  })()}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { label: "75+ · industry ready", n: totalStudentsCount > 0 ? r.aesBands["75+"] : 0, dot: "bg-emerald-500" },
                      { label: "60–75 · proficient", n: totalStudentsCount > 0 ? r.aesBands["60-75"] : 0, dot: "bg-sky-400" },
                      { label: "40–60 · developing", n: totalStudentsCount > 0 ? r.aesBands["40-60"] : 0, dot: "bg-amber-400" },
                      { label: "< 40 · at risk", n: totalStudentsCount > 0 ? r.aesBands["<40"] : 0, dot: "bg-rose-400" },
                    ].map((b) => (
                      <div key={b.label} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                        <span className={`h-2 w-2 rounded-full ${b.dot}`} />
                        <span className="flex-1 truncate text-[10.5px] font-semibold text-slate-600">{b.label}</span>
                        <span className="font-mono text-[12px] font-bold text-slate-800 tabular-nums">{b.n}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* At-risk rescue queue */}
              <Card className="border-rose-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[linear-gradient(135deg,#E2543E,#B33A27)] text-white shadow-sm">
                      <BellRing className="h-3.5 w-3.5" />
                    </span>
                    Rescue queue
                  </CardTitle>
                  <Badge variant="destructive" className="font-bold">{atRiskStudents.length} flagged</Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {atRiskStudents.length === 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5 text-[13px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> No students below the AES 40 threshold. Nice work!
                    </div>
                  )}
                  {atRiskStudents.map((s) => (
                    <div key={s.userId} className="group rounded-xl border border-border/70 bg-slate-50/60 p-3 transition hover:border-rose-500/25 hover:bg-white">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-rose-500/10 text-[10px] font-bold text-rose-600">{initialsOf(s.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-bold text-slate-800">{s.fullName}</p>
                          <p className="font-mono text-[10px] font-medium text-slate-400">{s.enrollmentNo} · {s.branch} · {s.lastActive}</p>
                        </div>
                        <Badge className={scoreTone(s.aes)}>{s.aes} AES</Badge>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          title="Dispatch AI nudge"
                          disabled={nudgingId === s.userId}
                          onClick={() => handleNudge(s.userId, s.fullName)}
                          className="shrink-0 border-primary/25 text-primary hover:bg-primary/10"
                        >
                          {nudgingId === s.userId ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.missingComponents.map((m) => (
                          <span key={m} className="rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[9.5px] font-bold text-rose-700">{m}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/campus/students")}
                    className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-border py-2 text-[11.5px] font-bold text-slate-500 transition hover:border-primary/40 hover:text-primary"
                  >
                    Open full roster <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters card */}
          <Card className="overflow-visible">
            <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-1.5 pr-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">
                  <Filter className="h-3.5 w-3.5 text-primary" /> Filters
                </span>
                <Select value={batchFilter} onValueChange={(val) => updateFilter("batch", val)}>
                  <SelectTrigger className="h-9 w-[118px] text-xs"><SelectValue placeholder="Batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All batches</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchFilter} onValueChange={(val) => updateFilter("branch", val)}>
                  <SelectTrigger className="h-9 w-[118px] text-xs"><SelectValue placeholder="Branch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All branches</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="EE">EE</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={scoreFilter} onValueChange={(val) => updateFilter("score", val)}>
                  <SelectTrigger className="h-9 w-[132px] text-xs"><SelectValue placeholder="Score band" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All scores</SelectItem>
                    <SelectItem value="90+">90+ · high ready</SelectItem>
                    <SelectItem value="75-89">75–89 · industry ready</SelectItem>
                    <SelectItem value="60-74">60–74 · proficient</SelectItem>
                    <SelectItem value="<60">&lt;60 · at risk</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(val) => updateFilter("status", val)}>
                  <SelectTrigger className="h-9 w-[136px] text-xs"><SelectValue placeholder="Activity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All activity</SelectItem>
                    <SelectItem value="active_7d">Active (7d)</SelectItem>
                    <SelectItem value="active_30d">Active (30d)</SelectItem>
                    <SelectItem value="inactive">Inactive (&gt;30d)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-[11px] font-bold text-slate-400 lg:inline">{filteredStudents.length} matched</span>
                <Button variant="outline" size="sm" onClick={handleExportFilteredCsv} className="text-[12px]">
                  <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Roster table */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-gradient-to-r from-white to-[hsl(177_51%_31%/0.03)] py-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-primary" /> Student readiness roster
                  <Badge variant="soft">{filteredStudents.length}</Badge>
                </CardTitle>
                <CardDescription>Per-student AES, activity telemetry and resume state.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/campus/students")} className="hidden text-[12px] text-primary sm:flex">
                Full directory <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="p-14 text-center text-muted-foreground">
                  <FileText className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="font-bold">{isCustomTenant && studentRows.length === 0 ? "No students onboarded yet" : "No students match these filters"}</p>
                  <p className="mt-1 text-xs">
                    {isCustomTenant && studentRows.length === 0
                      ? "Head to Student Roster to bulk-upload students via CSV or send student invites."
                      : "Reset batch / branch / score to see the roster again."}
                  </p>
                  {isCustomTenant && studentRows.length === 0 && (
                    <Button size="sm" onClick={() => navigate("/campus/students")} className="mt-4 bg-primary text-white">
                      Go to Student Roster
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Readiness score</TableHead>
                        <TableHead>Last active</TableHead>
                        <TableHead>Resume</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.slice(0, 8).map((student) => (
                        <TableRow key={student.userId}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[hsl(177_51%_31%/0.1)] text-[10px] font-bold text-primary">{initialsOf(student.fullName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-[13px] font-bold text-slate-800">{student.fullName}</p>
                                <p className="font-mono text-[10.5px] text-slate-400">{student.enrollmentNo}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline" className="text-[10.5px]">{student.branch}</Badge></TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">{student.batch}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${student.aes >= 75 ? "bg-emerald-500" : student.aes >= 60 ? "bg-sky-500" : "bg-rose-500"}`}
                                  style={{ width: `${Math.min(100, student.aes)}%` }}
                                />
                              </div>
                              <Badge className={scoreTone(student.aes)}>{student.aes}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${student.daysInactive <= 2 ? "bg-emerald-500" : student.daysInactive <= 7 ? "bg-amber-400" : "bg-rose-400"}`} />
                              {student.lastActive}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.resumeStatus === "Verified" ? "success" : student.resumeStatus === "Built" ? "soft" : "outline"}>
                              {student.resumeStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                              {student.resumeStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department performance */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/60 py-4">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-4.5 w-4.5 text-amber-500" /> Department baselines — AY 2025-26
              </CardTitle>
              <CardDescription>Server-aggregated metrics from tenant_daily_stats · branch readiness heatmap.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isCustomTenant && studentRows.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="font-bold">No Department Baselines Yet</p>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Branch-level readiness heatmaps and average AES scores will populate automatically once students are enrolled in their respective departments.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Avg AES</TableHead>
                        <TableHead>Active 7d</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Mock interviews</TableHead>
                        <TableHead>Placed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(effectiveByBranch).map(([bName, bStats]) => (
                        <TableRow key={bName}>
                          <TableCell>
                            <span className="flex items-center gap-2 font-bold text-slate-800">
                              <Building2 className="h-3.5 w-3.5 text-slate-300" /> {bName}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-600">{bStats.students}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={scoreTone(bStats.avgAes)}>{bStats.avgAes}</Badge>
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-[#4DC7BE] to-[#2D8B86]" style={{ width: `${bStats.avgAes}%` }} />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-600">{bStats.active7d}</TableCell>
                          <TableCell className="text-xs font-semibold text-emerald-600">{bStats.verifiedResumes}</TableCell>
                          <TableCell className="text-xs text-slate-600">{bStats.interviewsDone}</TableCell>
                          <TableCell>
                            <Badge variant="success">{bStats.placed}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* upcoming calendar teaser */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-card lg:col-span-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#F5B94A,#E08A2E)] text-white shadow-md">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div className="flex-1">
                {isCustomTenant && !upcomingDrive ? (
                  <>
                    <p className="text-[14px] font-bold text-slate-800">No active placement drives scheduled</p>
                    <p className="mt-0.5 text-[12.5px] text-slate-500">Create your first corporate hiring pipeline and invite students.</p>
                  </>
                ) : upcomingDrive ? (
                  <>
                    <p className="text-[14px] font-bold text-slate-800">{upcomingDrive.companyName || upcomingDrive.company || upcomingDrive.title} · {upcomingDrive.roleTitle || upcomingDrive.role || "Recruitment Drive"}</p>
                    <p className="mt-0.5 text-[12.5px] text-slate-500">{upcomingDrive.eligibility?.branches?.join("/") || "All branches"} · prep sprint active</p>
                  </>
                ) : (
                  <>
                    <p className="text-[14px] font-bold text-slate-800">Tata Elxsi · Software Engineer — drive starts in 4 days</p>
                    <p className="mt-0.5 text-[12.5px] text-slate-500">124 applied · 61 shortlisted · CSE/ECE · prep sprint auto-assigned</p>
                  </>
                )}
              </div>
              <Button variant="soft-primary" size="sm" onClick={() => navigate("/campus/drives")} className="hidden sm:flex">
                {isCustomTenant && !upcomingDrive ? "+ Create Drive" : "Manage drive"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#2D8B86,#1C6B68)] text-white shadow-md">
                <Award className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-slate-800">
                  {latestExport ? "NAAC data pack ready" : "NAAC draft ready"}
                </p>
                <p className="mt-0.5 text-[12.5px] text-slate-500">
                  {latestExport
                    ? `Criterion 5.2.1 · ${latestExport.count} pack${latestExport.count > 1 ? "s" : ""} generated · ${latestExport.latest.title || "SSR Evidence Ready"}`
                    : isCustomTenant
                    ? `Criterion 5.2.1 · ${r.funnel.placed || 5} offers logged · ${derived.verified} verified`
                    : "Criterion 5.2.1 · 172 records"}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => navigate("/campus/accreditation")}><ArrowRight className="h-4 w-4 text-primary" /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
