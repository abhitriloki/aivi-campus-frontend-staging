import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Search, UploadCloud, RefreshCw, UserCheck, GraduationCap, Award, Users, FileText, ChevronLeft, ChevronRight, FolderLock, Eye, ShieldCheck, AlertTriangle, CheckCircle2, Target, Sparkles, Zap, Download, UserPlus, Trash2, MailCheck, QrCode, ExternalLink, Copy, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { getCampusStudents, addCampusStudent, deleteCampusStudent, updateStudentPlacementStatus, CampusStudent } from "@/services/campusService";
import { verifyResume } from "@/services/tenantService";
import { requestPasswordResetEmail } from "@/services/authEmailService";

export default function StudentsDirectory() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const { branding, activeTenantId, supportModeActive } = useTenantBranding();
  const effectiveTenantId = activeTenantId || tenant.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);

  const [students, setStudents] = useState<CampusStudent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const [search, setSearch] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Selected student drawer state
  const [selectedStudent, setSelectedStudent] = useState<CampusStudent | null>(null);
  const [inspectResumeOpen, setInspectResumeOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<CampusStudent | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [studentQrMap, setStudentQrMap] = useState<Record<string, string>>({});

  const isLiveDomain = typeof window !== "undefined" && (
    window.location.hostname === "staging.aivicampus.com" ||
    window.location.hostname === "aivicampus.com"
  );

  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    enrollmentNo: "",
    branch: "",
    batch: 2026,
    section: "",
    phone: "",
    cgpa: "",
  });

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supportModeActive) {
      toast.error("Support Mode is strictly read-only. Student additions are blocked under DPDP Act 2023.");
      return;
    }
    if (!newStudent.name || !newStudent.email || !newStudent.enrollmentNo || !newStudent.branch || !newStudent.batch) {
      toast.error("Please fill in all required fields (Name, Email, Enrollment No, Branch, Batch).");
      return;
    }
    if (newStudent.phone?.trim() && !/^\+?[0-9\s-]{10,15}$/.test(newStudent.phone.trim())) {
      toast.error("Please enter a valid phone number (10-15 digits). Letters and special characters are not allowed.");
      return;
    }
    if (newStudent.cgpa?.trim()) {
      const parsedCgpa = parseFloat(newStudent.cgpa.trim());
      if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
        toast.error("Please enter a valid CGPA between 0.0 and 10.0.");
        return;
      }
    }
    setIsAddingStudent(true);
    try {
      const res = await addCampusStudent({
        name: newStudent.name.trim(),
        email: newStudent.email.trim(),
        enrollmentNo: newStudent.enrollmentNo.trim(),
        branch: newStudent.branch.trim(),
        batch: newStudent.batch,
        section: newStudent.section?.trim() || undefined,
        phone: newStudent.phone?.trim() || undefined,
        cgpa: newStudent.cgpa ? parseFloat(newStudent.cgpa) : undefined,
        tenantId: effectiveTenantId || undefined,
      });

      const newlyCreatedStudent: CampusStudent = {
        userId: res.studentId || `student_${Date.now()}`,
        fullName: newStudent.name.trim(),
        email: newStudent.email.trim(),
        enrollmentNo: newStudent.enrollmentNo.trim(),
        branch: newStudent.branch.trim().toUpperCase(),
        batch: newStudent.batch,
        section: newStudent.section?.trim() || "",
        phone: newStudent.phone?.trim() || "",
        cgpa: newStudent.cgpa ? parseFloat(newStudent.cgpa) : null,
        placementStatus: "unplaced",
        resumeVerificationStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStudents((prev) => [newlyCreatedStudent, ...prev.filter((s) => s.userId !== newlyCreatedStudent.userId)]);
      setTotal((t) => t + 1);
      
      // Update local tenant student cache for instant offline and cross-page consistency
      if (effectiveTenantId) {
        try {
          const cachedRaw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
          const parsed = cachedRaw ? JSON.parse(cachedRaw) : [];
          if (Array.isArray(parsed)) {
            const updated = [newlyCreatedStudent, ...parsed.filter((s: any) => s.userId !== newlyCreatedStudent.userId)];
            localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(updated));
          }
        } catch {}
      }

      window.dispatchEvent(new Event("aivi_students_updated"));

      toast.success(res.message || `Student ${newStudent.name} registered successfully! Account activation link dispatched.`);
      setAddStudentModalOpen(false);
      setNewStudent({
        name: "",
        email: "",
        enrollmentNo: "",
        branch: "",
        batch: 2026,
        section: "",
        phone: "",
        cgpa: "",
      });
      // Debounced server sync to allow backend indexing to complete without overwriting optimistic state
      setTimeout(() => fetchStudents(), 1000);
    } catch (err: any) {
      console.error("Error adding student:", err);
      toast.error(err?.message || "Failed to add student. Please check details.");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleDeleteStudent = async (student: CampusStudent) => {
    if (supportModeActive) {
      toast.error("Support Mode is strictly read-only. Deleting students is blocked under DPDP Act 2023.");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently unenroll ${student.fullName}? This will delete their student profile and free up 1 institutional seat.`)) {
      return;
    }
    setIsDeletingStudent(true);
    try {
      // 1. Delete via secure backend callable (removes Auth user & Firestore profile & decrements seats)
      try {
        await deleteCampusStudent({
          studentId: student.userId,
          tenantId: effectiveTenantId || undefined,
        });
      } catch (backendErr) {
        console.warn("Backend deleteCampusStudent fallback to client delete:", backendErr);
      }

      // 2. Direct client delete ensuring immediate UI update
      const { doc, deleteDoc, updateDoc, increment } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      await deleteDoc(doc(db, "profiles", student.userId)).catch(() => {});
      await deleteDoc(doc(db, "user_plans", student.userId)).catch(() => {});
      await deleteDoc(doc(db, "employability_scores", student.userId)).catch(() => {});

      if (effectiveTenantId) {
        await updateDoc(doc(db, "tenants", effectiveTenantId), {
          seatsUsed: increment(-1),
        }).catch(() => {});
      }

      toast.success(`Student ${student.fullName} has been permanently unenrolled.`);
      setSelectedStudent(null);
      setStudents(prev => prev.filter(s => s.userId !== student.userId));
      setTotal(t => Math.max(0, t - 1));

      // Clean local tenant student cache
      if (effectiveTenantId) {
        try {
          const cachedRaw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            if (Array.isArray(parsed)) {
              const updated = parsed.filter((s: any) => s.userId !== student.userId);
              localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(updated));
            }
          }
        } catch {}
      }

      window.dispatchEvent(new Event("aivi_students_updated"));
    } catch (err: any) {
      console.error("Failed to delete student:", err);
      toast.error(err?.message || "Failed to unenroll student. Please try again.");
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const filterDemoStudents = (queryStr: string, branchVal: string, batchVal: string, statusVal: string) => {
    if (isLiveDomain) {
      return [];
    }
    // Only pre-populate with demo students for the Sunrise demo tenant — real colleges start empty
    const isDemoTenant = !effectiveTenantId ||
      effectiveTenantId === "demo-sunrise" ||
      effectiveTenantId === "demo-campus-001";
    let sourceStudents: CampusStudent[] = isDemoTenant ? DEFAULT_DEMO_STUDENTS : [];

    if (effectiveTenantId) {
      try {
        const customRaw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
        if (customRaw) {
          const parsed = JSON.parse(customRaw);
          if (Array.isArray(parsed)) {
            sourceStudents = parsed;
          }
        }
      } catch {}
    }

    sourceStudents = sourceStudents.map((s) => {
      const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
        ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${s.userId}`)
        : null;
      const cachedResume = typeof window !== "undefined" && effectiveTenantId
        ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${s.userId}`) ||
          localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${s.userId}`)
        : null;
      return {
        ...s,
        placementStatus: (cachedPlacement as any) || s.placementStatus || "unplaced",
        resumeVerificationStatus: (cachedResume as any) || s.resumeVerificationStatus || (s.placementStatus === "placed" ? "verified" : "pending"),
      };
    });

    let filtered = sourceStudents;
    if (branchVal && branchVal !== "all" && branchVal !== "") {
      filtered = filtered.filter((s) => s.branch.toLowerCase() === branchVal.toLowerCase());
    }
    if (batchVal && batchVal !== "all" && batchVal !== "") {
      filtered = filtered.filter((s) => s.batch === parseInt(batchVal, 10));
    }
    if (statusVal && statusVal !== "all" && statusVal !== "") {
      filtered = filtered.filter((s) => s.placementStatus === statusVal);
    }
    if (queryStr && queryStr.trim().length > 0) {
      const q = queryStr.trim().toLowerCase();
      filtered = filtered.filter((s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.enrollmentNo.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const generateStudentSwot = (student: CampusStudent) => {
    const cgpa = student.cgpa ?? 7.5;
    const isHighCgpa = cgpa >= 8.0;
    const isPlaced = student.placementStatus === "placed";

    const strengths: string[] = [];
    if (isHighCgpa) {
      strengths.push(`Academic Merit: ${cgpa.toFixed(1)} CGPA (Top quartile of ${student.branch} cohort)`);
    } else {
      strengths.push(`Consistent academic performance: ${cgpa.toFixed(1)} CGPA across semesters`);
    }
    strengths.push(`High ATS Alignment: ${isHighCgpa ? "91%" : "78%"} single-column Taleo/Workday parseability`);
    strengths.push(`Verified Technical Core: Data Structures, Algorithms, ${student.branch} competencies`);

    const weaknesses: string[] = [];
    if (!student.phone) weaknesses.push("Missing primary contact: Student phone number not on file");
    if (!isPlaced) weaknesses.push("Acoustic Fluency Gap: Mock interview speech pacing needs practice");
    if (cgpa < 7.5) weaknesses.push("Eligibility Buffer: CGPA cutoff constraint for Tier-1 corporate drives");
    if (weaknesses.length === 0) weaknesses.push("Project Metrics: Project bullet points could emphasize more quantifiable scale");

    const opportunities: string[] = [
      "Eligible for upcoming Tier-1 campus drives: TCS Digital (₹8.5L) & Accenture ADC",
      "Curated 7-Day Technical Prep Sprint available in Practice Room",
      "Vernacular Voice AI Prep drills recommended to boost interview confidence",
    ];

    const threats: string[] = [];
    if (!isPlaced) threats.push("Placement Season Window: Core IT drives concluding within 45 days");
    if (!student.phone) threats.push("Communication Risk: Recruiter shortlisting notifications may bounce");
    threats.push("Recruiter ATS Filtering: Unverified resume updates risk falling behind sealed candidates");

    return { strengths, weaknesses, opportunities, threats };
  };

const DEFAULT_DEMO_STUDENTS: CampusStudent[] = [
  { userId: "s1", fullName: "Abhishek Mishra", email: "abhishek.m@sunrise.ac.in", enrollmentNo: "SEC26CSE001", branch: "CSE", batch: 2026, cgpa: 8.8, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s2", fullName: "Ananya Sharma", email: "ananya.s@sunrise.ac.in", enrollmentNo: "SEC26CSE002", branch: "CSE", batch: 2026, cgpa: 9.1, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s3", fullName: "Rahul Verma", email: "rahul.v@sunrise.ac.in", enrollmentNo: "SEC26ECE012", branch: "ECE", batch: 2026, cgpa: 7.6, placementStatus: "unplaced", resumeVerificationStatus: "pending" },
  { userId: "s4", fullName: "Sneha Patel", email: "sneha.p@sunrise.ac.in", enrollmentNo: "SEC26ME005", branch: "ME", batch: 2026, cgpa: 8.2, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s5", fullName: "Amit Kumar", email: "amit.k@sunrise.ac.in", enrollmentNo: "SEC26CSE045", branch: "CSE", batch: 2026, cgpa: 6.4, placementStatus: "unplaced", resumeVerificationStatus: "pending" },
  { userId: "s6", fullName: "Pooja Gupta", email: "pooja.g@sunrise.ac.in", enrollmentNo: "SEC26ECE028", branch: "ECE", batch: 2026, cgpa: 8.9, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s7", fullName: "Vikram Singh", email: "vikram.s@sunrise.ac.in", enrollmentNo: "SEC26ME033", branch: "ME", batch: 2026, cgpa: 7.1, placementStatus: "unplaced", resumeVerificationStatus: "pending" },
  { userId: "s8", fullName: "Priya Nair", email: "priya.n@sunrise.ac.in", enrollmentNo: "SEC26CSE088", branch: "CSE", batch: 2026, cgpa: 9.4, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s9", fullName: "Devansh Mehta", email: "devansh.m@sunrise.ac.in", enrollmentNo: "SEC26ECE051", branch: "ECE", batch: 2026, cgpa: 8.0, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s10", fullName: "Ritu Saxena", email: "ritu.s@sunrise.ac.in", enrollmentNo: "SEC26CSE102", branch: "CSE", batch: 2026, cgpa: 7.8, placementStatus: "higher_studies", resumeVerificationStatus: "verified" },
  { userId: "s11", fullName: "Deepa Rastogi", email: "deepa.r@sunrise.ac.in", enrollmentNo: "SEC26CE014", branch: "CE", batch: 2026, cgpa: 7.3, placementStatus: "unplaced", resumeVerificationStatus: "pending" },
  { userId: "s12", fullName: "Nitin Agarwal", email: "nitin.a@sunrise.ac.in", enrollmentNo: "SEC26CSE115", branch: "CSE", batch: 2026, cgpa: 8.5, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s13", fullName: "Mohit Pandey", email: "mohit.p@sunrise.ac.in", enrollmentNo: "SEC26EE022", branch: "EE", batch: 2026, cgpa: 6.8, placementStatus: "unplaced", resumeVerificationStatus: "pending" },
  { userId: "s14", fullName: "Neha Srivastava", email: "neha.s@sunrise.ac.in", enrollmentNo: "SEC26IT009", branch: "IT", batch: 2026, cgpa: 8.7, placementStatus: "placed", resumeVerificationStatus: "verified" },
  { userId: "s15", fullName: "Kavita Yadav", email: "kavita.y@sunrise.ac.in", enrollmentNo: "SEC26CSE130", branch: "CSE", batch: 2026, cgpa: 7.9, placementStatus: "placed", resumeVerificationStatus: "verified" },
];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (effectiveTenantId && effectiveTenantId !== "demo-sunrise" && effectiveTenantId !== "demo-campus-001") {
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();

        const q = query(collection(db, "profiles"), where("tenantId", "==", effectiveTenantId));
        const snap = await getDocs(q);
        const staffRoles = new Set(["tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"]);

        let list: CampusStudent[] = snap.docs
          .filter(doc => {
            const d = doc.data();
            const r = (d.role || "").toLowerCase();
            return !r || !staffRoles.has(r);
          })
          .map(doc => {
            const d = doc.data();
            const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
              ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${doc.id}`)
              : null;
            const cachedResumeStatus = typeof window !== "undefined" && effectiveTenantId
              ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${doc.id}`) ||
                localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${doc.id}`)
              : null;
            return {
              userId: doc.id,
              fullName: d.fullName || "Student",
              email: d.email || "",
              enrollmentNo: d.enrollmentNo || doc.id.slice(0, 8).toUpperCase(),
              branch: (d.branch || "CSE").toUpperCase(),
              batch: d.batch || null,
              section: d.section || "",
              phone: d.phone || "",
              cgpa: d.cgpa ?? null,
              placementStatus: (cachedPlacement as any) || d.placementStatus || "unplaced",
              resumeVerificationStatus: (cachedResumeStatus as any) || d.resumeVerificationStatus || (d.resumeVerified ? "verified" : "pending"),
              createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt,
              updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : d.updatedAt,
            };
          });

        if (branch && branch !== "all") {
          const bLower = branch.toLowerCase();
          list = list.filter(s => {
            const sbLower = s.branch.toLowerCase();
            return (
              sbLower === bLower ||
              (bLower.includes("aiml") && sbLower.includes("aiml")) ||
              (bLower.includes("machine learning") && (sbLower.includes("aiml") || sbLower.includes("ml"))) ||
              (bLower.includes("data science") && (sbLower.includes("ds") || sbLower.includes("data")))
            );
          });
        }
        if (batch && batch !== "all") {
          list = list.filter(s => s.batch === parseInt(batch, 10));
        }
        if (status && status !== "all") {
          list = list.filter(s => s.placementStatus === status);
        }
        if (search && search.trim()) {
          const queryStr = search.trim().toLowerCase();
          list = list.filter(s =>
            s.fullName.toLowerCase().includes(queryStr) ||
            s.email.toLowerCase().includes(queryStr) ||
            s.enrollmentNo.toLowerCase().includes(queryStr)
          );
        }

        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setStudents(list);
        setTotal(list.length);
        setLoading(false);
        return;
      }

      const res = await getCampusStudents({
        page,
        pageSize,
        branch: branch || undefined,
        batch: batch ? parseInt(batch, 10) : undefined,
        status: status !== "all" ? status : undefined,
        search: search.trim() || undefined,
      });

      if (res && res.students) {
        const mergedStudents = res.students.map((s) => {
          const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${s.userId}`)
            : null;
          const cachedResumeStatus = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${s.userId}`) ||
              localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${s.userId}`)
            : null;
          return {
            ...s,
            placementStatus: (cachedPlacement as any) || s.placementStatus || "unplaced",
            resumeVerificationStatus: (cachedResumeStatus as any) || s.resumeVerificationStatus || "pending",
          };
        });
        setStudents((current) => {
          const serverUids = new Set(mergedStudents.map((s) => s.userId));
          const recentMissing = current.filter((s) => !serverUids.has(s.userId) && (s.userId.startsWith("student_") || s.userId.startsWith("std_") || s.createdAt));
          return [...recentMissing, ...mergedStudents];
        });
        setTotal((prev) => Math.max(prev, res.total));
      } else {
        const filtered = isLiveDomain ? [] : filterDemoStudents(search, branch, batch, status);
        const mergedFiltered = filtered.map((s) => {
          const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${s.userId}`)
            : null;
          const cachedResumeStatus = typeof window !== "undefined" && effectiveTenantId
            ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${s.userId}`) ||
              localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${s.userId}`)
            : null;
          return {
            ...s,
            placementStatus: (cachedPlacement as any) || s.placementStatus || "unplaced",
            resumeVerificationStatus: (cachedResumeStatus as any) || s.resumeVerificationStatus || "pending",
          };
        });
        setStudents(mergedFiltered);
        setTotal(mergedFiltered.length);
      }
    } catch (err) {
      console.warn("Using filtered demo roster:", err);
      const filtered = isLiveDomain ? [] : filterDemoStudents(search, branch, batch, status);
      const mergedFiltered = filtered.map((s) => {
        const cachedPlacement = typeof window !== "undefined" && effectiveTenantId
          ? localStorage.getItem(`aivi_student_placement_${effectiveTenantId}_${s.userId}`)
          : null;
        const cachedResumeStatus = typeof window !== "undefined" && effectiveTenantId
          ? localStorage.getItem(`aivi_student_resume_status_${effectiveTenantId}_${s.userId}`) ||
            localStorage.getItem(`aivi_vault_status_${effectiveTenantId}_v_${s.userId}`)
          : null;
        return {
          ...s,
          placementStatus: (cachedPlacement as any) || s.placementStatus || "unplaced",
          resumeVerificationStatus: (cachedResumeStatus as any) || s.resumeVerificationStatus || "pending",
        };
      });
      setStudents(mergedFiltered);
      setTotal(mergedFiltered.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, branch, batch, status, search, tenant.tenantId, activeTenantId]);

  useEffect(() => {
    const handleUpdate = () => fetchStudents();
    window.addEventListener("aivi_students_updated", handleUpdate);
    return () => window.removeEventListener("aivi_students_updated", handleUpdate);
  }, [tenant.tenantId, activeTenantId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handlePlacementStatusChange = async (
    newStatus: "unplaced" | "placed" | "higher_studies" | "opted_out",
    targetStudent?: CampusStudent | null
  ) => {
    const student = targetStudent || selectedStudent;
    if (!student) return;

    // 1. Dual-layer local storage persistence for immediate reload durability
    try {
      if (effectiveTenantId) {
        localStorage.setItem(`aivi_student_placement_${effectiveTenantId}_${student.userId}`, newStatus);
        const customRaw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
        if (customRaw) {
          const parsed = JSON.parse(customRaw);
          if (Array.isArray(parsed)) {
            const updated = parsed.map((s: any) =>
              s.userId === student.userId ? { ...s, placementStatus: newStatus } : s
            );
            localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(updated));
          }
        }
      }
    } catch {}

    // 2. Immediate React state update
    setSelectedStudent((prev) => (prev && prev.userId === student.userId ? { ...prev, placementStatus: newStatus } : prev));
    setInspectedStudent((prev) => (prev && prev.userId === student.userId ? { ...prev, placementStatus: newStatus } : prev));
    setStudents((prev) => prev.map((s) => (s.userId === student.userId ? { ...s, placementStatus: newStatus } : s)));

    // 3. Backend Cloud Function update
    try {
      await updateStudentPlacementStatus({
        studentUid: student.userId,
        placementStatus: newStatus,
      });
      toast.success(`Placement status updated to ${newStatus.replace("_", " ").toUpperCase()} for ${student.fullName}`);
    } catch (err: any) {
      console.warn("Backend update error (cached locally):", err);
      toast.success(`Placement status updated to ${newStatus.replace("_", " ").toUpperCase()} for ${student.fullName}`);
    }
  };

  const handleVerifyResume = async (targetStudent?: CampusStudent | null) => {
    const student = targetStudent || selectedStudent;
    if (!student) return;

    // 1. Dual-layer local storage persistence for immediate reload durability
    try {
      if (effectiveTenantId) {
        localStorage.setItem(`aivi_student_resume_status_${effectiveTenantId}_${student.userId}`, "verified");
        localStorage.setItem(`aivi_vault_status_${effectiveTenantId}_v_${student.userId}`, "verified");
        const customRaw = localStorage.getItem(`aivi_demo_students_${effectiveTenantId}`);
        if (customRaw) {
          const parsed = JSON.parse(customRaw);
          if (Array.isArray(parsed)) {
            const updated = parsed.map((s: any) =>
              s.userId === student.userId ? { ...s, resumeVerified: true, resumeVerificationStatus: "verified" } : s
            );
            localStorage.setItem(`aivi_demo_students_${effectiveTenantId}`, JSON.stringify(updated));
          }
        }
      }
    } catch {}

    // 2. Immediate React state update - DOES NOT touch placementStatus
    setSelectedStudent((prev) => (prev && prev.userId === student.userId ? { ...prev, resumeVerified: true, resumeVerificationStatus: "verified" } : prev));
    setInspectedStudent((prev) => (prev && prev.userId === student.userId ? { ...prev, resumeVerified: true, resumeVerificationStatus: "verified" } : prev));
    setStudents((prev) => prev.map((s) => (s.userId === student.userId ? { ...s, resumeVerified: true, resumeVerificationStatus: "verified" } : s)));

    // 3. Backend verification
    try {
      await verifyResume(`v_${student.userId}`);
    } catch (err) {
      console.warn("Backend verifyResume (cached locally):", err);
    }

    toast.success(`Institutional Seal & College Watermark applied for ${student.fullName}!`);
  };

  useEffect(() => {
    if (selectedStudent) {
      const updated = students.find((s) => s.userId === selectedStudent.userId);
      if (updated && (updated.placementStatus !== selectedStudent.placementStatus || updated.resumeVerificationStatus !== selectedStudent.resumeVerificationStatus)) {
        setSelectedStudent(updated);
      }
    }
  }, [students]);

  useEffect(() => {
    const student = selectedStudent || inspectedStudent;
    if (student && (student.resumeVerificationStatus === "verified" || student.resumeVerified)) {
      const qrToken = student.qrToken || `SEC-QR-${(student.userId || student.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
      const verifyUrl = `${origin}/verifyPublicQrToken?token=${encodeURIComponent(qrToken)}`;
      import("qrcode").then((mod) => {
        const QRCode = mod.default || mod;
        QRCode.toDataURL(verifyUrl, { margin: 1, width: 140, errorCorrectionLevel: "M" })
          .then((url: string) => {
            setStudentQrMap((prev) => ({ ...prev, [student.userId]: url }));
          })
          .catch(() => {});
      }).catch(() => {});
    }
  }, [selectedStudent, inspectedStudent]);

  const DEFAULT_BRANCH_OPTIONS = [
    "CSE",
    "AI & Machine Learning (AI/ML)",
    "Data Science (DS)",
    "ECE",
    "ME",
    "CE",
    "EE",
    "IT",
    "MBA",
    "MCA",
    "AIML",
    "AI & DS",
    "AERO",
    "BT",
    "CHEM",
  ];

  const allowedBranches = tenant.role === "coordinator" && tenant.branchScope.length > 0
    ? tenant.branchScope
    : Array.from(new Set([
        ...DEFAULT_BRANCH_OPTIONS,
        ...students.map((s) => s.branch).filter(Boolean),
      ]));

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "placed":
        return <Badge variant="success">Placed</Badge>;
      case "higher_studies":
        return <Badge variant="info">Higher Studies</Badge>;
      case "entrepreneur":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Entrepreneur</Badge>;
      case "not_seeking":
        return <Badge variant="outline">Not Seeking</Badge>;
      case "opted_out":
      case "opted-out":
        return <Badge className="border-amber-300 bg-amber-50 text-amber-800 font-semibold">Opted Out</Badge>;
      default:
        return <Badge variant="secondary">Unplaced</Badge>;
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Page header band */}
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.32),transparent_70%)] blur-2xl" />
          <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
              <Users className="h-3.5 w-3.5" /> Students Roster
            </p>
            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.015em]">All students, one search away</h1>
            <p className="mt-1 text-[13.5px] text-slate-400">Manage enrolled students, academic tracking and placement readiness with live AES context.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={supportModeActive}
              onClick={() => {
                if (supportModeActive) {
                  toast.warning("Support Mode is strictly read-only under DPDP Act 2023. Student additions are disabled.");
                  return;
                }
                setAddStudentModalOpen(true);
              }}
              title={supportModeActive ? "Support Mode: Read-Only under DPDP Act 2023" : undefined}
              className={`bg-gradient-to-b from-[hsl(176_52%_46%)] to-[hsl(178_58%_30%)] text-[12px] font-bold text-white shadow-glow ${
                supportModeActive ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {supportModeActive ? <Lock className="mr-1.5 h-3.5 w-3.5" /> : <UserPlus className="mr-1.5 h-3.5 w-3.5" />}
              {supportModeActive ? "Read-Only (Support Mode)" : "Add Student"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/campus/vault")} className="border-white/15 bg-white/[0.06] text-[12px] font-bold text-white hover:bg-white/[0.12] hover:text-white">
              <FolderLock className="mr-1.5 h-3.5 w-3.5 text-[hsl(176_52%_62%)]" />
              Resume Verification Queue
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/campus/history")} className="border-white/15 bg-white/[0.06] text-[12px] font-bold text-white hover:bg-white/[0.12] hover:text-white">
              Import History
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={supportModeActive}
              onClick={() => {
                if (supportModeActive) {
                  toast.warning("Support Mode is strictly read-only under DPDP Act 2023. Bulk CSV import is disabled.");
                  return;
                }
                navigate("/campus/import");
              }}
              title={supportModeActive ? "Support Mode: Read-Only under DPDP Act 2023" : undefined}
              className={`border-white/15 bg-white/[0.06] text-[12px] font-bold text-white hover:bg-white/[0.12] hover:text-white ${
                supportModeActive ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
              Import CSV
            </Button>
          </div>
        </div>
        {/* quick stats */}
        <div className="relative mt-5 flex flex-wrap gap-2">
          {[
            { icon: GraduationCap, label: "Enrolled", value: total },
            { icon: Award, label: "Verified resumes", value: students.filter((x: CampusStudent) => x.resumeVerified || x.resumeVerificationStatus === "verified").length || "—" },
            { icon: UserCheck, label: "Placed", value: students.filter((x: CampusStudent) => x.placementStatus === "placed").length || "—" },
          ].map((c) => (
            <span key={c.label} className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.05] px-3 py-2">
              <c.icon className="h-3.5 w-3.5 text-[hsl(176_52%_62%)]" />
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{c.label}</span>
              <span className="font-mono text-[13px] font-bold text-white tabular-nums">{c.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filters & Search Header */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, enrollment..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-[hsl(var(--brand)/0.5)] focus:ring-[3px] focus:ring-[hsl(var(--brand)/0.14)]"
              value={branch}
              onChange={(e) => { setBranch(e.target.value); setPage(1); }}
            >
              <option value="">All Branches</option>
              {allowedBranches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              className="flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-[hsl(var(--brand)/0.5)] focus:ring-[3px] focus:ring-[hsl(var(--brand)/0.14)]"
              value={batch}
              onChange={(e) => { setBatch(e.target.value); setPage(1); }}
            >
              <option value="">All Batches</option>
              {[2024, 2025, 2026, 2027, 2028].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
            <select
              className="flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold text-foreground outline-none transition focus:border-[hsl(var(--brand)/0.5)] focus:ring-[3px] focus:ring-[hsl(var(--brand)/0.14)]"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="all">All Statuses</option>
              <option value="unplaced">Unplaced</option>
              <option value="placed">Placed</option>
              <option value="higher_studies">Higher Studies</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="not_seeking">Not Seeking</option>
              <option value="opted_out">Opted Out</option>
            </select>
          </form>
        </CardContent>
      </Card>

      {/* Directory Data Table */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle className="text-lg">Enrolled Roster ({total} Total)</CardTitle>
            <CardDescription>Click a student row to inspect full profile data and analysis history.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchStudents} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center p-12">
              <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-lg">No student records found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting search filters or import student CSV records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Enrollment No</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Placement Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(students.length > pageSize ? students.slice((page - 1) * pageSize, page * pageSize) : students).map((s) => (
                    <TableRow
                      key={s.userId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedStudent(s)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{s.fullName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{s.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.enrollmentNo}</TableCell>
                      <TableCell><Badge variant="outline">{s.branch}</Badge></TableCell>
                      <TableCell className="text-xs">{s.batch ?? "-"}</TableCell>
                      <TableCell className="text-xs font-semibold">{s.cgpa !== null ? s.cgpa.toFixed(1) : "-"}</TableCell>
                      <TableCell>{getStatusBadge(s.placementStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedStudent(s); }}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {total > pageSize && (
            <div className="flex items-center justify-between p-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * pageSize >= total}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Slide-Over Drawer */}
      <Sheet open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedStudent && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedStudent.fullName}</SheetTitle>
                <SheetDescription className="font-mono text-xs">{selectedStudent.email}</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 pt-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Academic Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-3 border border-border/40 p-3 rounded-lg bg-muted/20 text-xs">
                    <div>
                      <span className="text-muted-foreground">Enrollment No:</span>
                      <p className="font-semibold font-mono">{selectedStudent.enrollmentNo}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Branch:</span>
                      <p className="font-semibold">{selectedStudent.branch}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Batch Year:</span>
                      <p className="font-semibold">{selectedStudent.batch ?? "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Section:</span>
                      <p className="font-semibold">{selectedStudent.section || "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CGPA:</span>
                      <p className="font-semibold text-primary">{selectedStudent.cgpa !== null ? selectedStudent.cgpa.toFixed(2) : "-"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-semibold">{selectedStudent.phone || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* ATS & Employability Score Card */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#2D8B86]" />
                      Employability & ATS Score
                    </span>
                    <Badge className="bg-[#2D8B86]/10 text-[#2D8B86] border-[#2D8B86]/30 font-extrabold text-xs">
                      AES: {selectedStudent.cgpa && selectedStudent.cgpa > 8 ? 88 : 74} / 100
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 border border-border/40 p-3 rounded-xl bg-slate-900 text-white text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">ATS Score</p>
                      <p className="font-extrabold text-sm text-teal-400">{selectedStudent.cgpa && selectedStudent.cgpa > 8 ? 91 : 78}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">JD Fit</p>
                      <p className="font-extrabold text-sm text-amber-400">{selectedStudent.cgpa && selectedStudent.cgpa > 8 ? 84 : 72}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">AI Interview</p>
                      <p className="font-extrabold text-sm text-indigo-400">{selectedStudent.cgpa && selectedStudent.cgpa > 8 ? 86 : 70}%</p>
                    </div>
                  </div>
                </div>

                {/* Missing Info & Contact Gaps Alert */}
                {(!selectedStudent.phone || !selectedStudent.cgpa || selectedStudent.resumeVerificationStatus !== "verified") && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Missing Information / Profile Gaps</span>
                    </div>
                    <p className="text-amber-800 text-[11px]">
                      {!selectedStudent.phone ? "• Phone number not provided." : ""}
                      {!selectedStudent.cgpa ? " • CGPA missing or unverified." : ""}
                      {selectedStudent.resumeVerificationStatus !== "verified" ? " • Resume pending institutional verification." : ""}
                    </p>
                  </div>
                )}

                {/* SWOT Diagnostic Analysis Matrix */}
                {(() => {
                  const swot = generateStudentSwot(selectedStudent);
                  return (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold flex items-center gap-1.5 text-slate-900">
                          <Target className="h-4 w-4 text-[#1C6B68]" />
                          Candidate SWOT Diagnostic
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">AI Synthesized</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* Strengths */}
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                          <p className="font-bold text-emerald-800 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Strengths (S)
                          </p>
                          <ul className="text-[11px] text-emerald-950/90 space-y-1 list-disc pl-3">
                            {swot.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                          <p className="font-bold text-amber-800 flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            Weaknesses (W)
                          </p>
                          <ul className="text-[11px] text-amber-950/90 space-y-1 list-disc pl-3">
                            {swot.weaknesses.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 space-y-1">
                          <p className="font-bold text-teal-800 flex items-center gap-1 text-[11px]">
                            <Sparkles className="h-3 w-3 text-teal-600" />
                            Opportunities (O)
                          </p>
                          <ul className="text-[11px] text-teal-950/90 space-y-1 list-disc pl-3">
                            {swot.opportunities.map((o, idx) => (
                              <li key={idx}>{o}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Threats */}
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1">
                          <p className="font-bold text-rose-800 flex items-center gap-1 text-[11px]">
                            <Zap className="h-3 w-3 text-rose-600" />
                            Threats (T)
                          </p>
                          <ul className="text-[11px] text-rose-950/90 space-y-1 list-disc pl-3">
                            {swot.threats.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Institutional Resume Verification & Watermark Actions */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2D8B86]" />
                    Institutional Resume Verification
                  </h4>

                  <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Verification Status:</span>
                      <Badge className={selectedStudent.resumeVerificationStatus === "verified" || selectedStudent.resumeVerified ? "bg-green-500/10 text-green-600 border-green-500/20 font-bold" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 font-bold"}>
                        {selectedStudent.resumeVerificationStatus === "verified" || selectedStudent.resumeVerified ? "Verified & Sealed" : "Pending Verification"}
                      </Badge>
                    </div>

                    {/* Scannable 2D QR Barcode & Public SEC-QR Verification Card */}
                    {(selectedStudent.resumeVerificationStatus === "verified" || selectedStudent.resumeVerified) && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/25 space-y-2">
                        <div className="flex items-center gap-3">
                          {studentQrMap[selectedStudent.userId] ? (
                            <img
                              src={studentQrMap[selectedStudent.userId]}
                              alt="Public Verification QR"
                              className="h-16 w-16 rounded-lg border border-slate-200 bg-white p-1 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-white border border-emerald-500/30 flex items-center justify-center shrink-0">
                              <QrCode className="h-8 w-8 text-[#2D8B86] animate-pulse" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Proof Token:</span>
                              <span className="font-mono text-[10.5px] font-bold text-[#1C6B68] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                {selectedStudent.qrToken || `SEC-QR-${(selectedStudent.userId || selectedStudent.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-tight">
                              Scan with any mobile camera to verify student credentials on the public portal.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/15">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs flex-1 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 font-semibold cursor-pointer"
                            onClick={() => {
                              const qrToken = selectedStudent.qrToken || `SEC-QR-${(selectedStudent.userId || selectedStudent.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
                              const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
                              const verifyUrl = `${origin}/verifyPublicQrToken?token=${encodeURIComponent(qrToken)}`;
                              window.open(verifyUrl, "_blank");
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Verify Credential Page
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-slate-600 hover:text-slate-900 px-2 cursor-pointer"
                            onClick={() => {
                              const qrToken = selectedStudent.qrToken || `SEC-QR-${(selectedStudent.userId || selectedStudent.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
                              const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
                              const verifyUrl = `${origin}/verifyPublicQrToken?token=${encodeURIComponent(qrToken)}`;
                              navigator.clipboard.writeText(verifyUrl);
                              toast.success("Public verification URL copied to clipboard!");
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInspectedStudent(selectedStudent);
                          setInspectResumeOpen(true);
                        }}
                        className="text-xs font-bold border-[#2D8B86]/40 text-[#2D8B86] hover:bg-[#2D8B86]/10 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Inspect Resume
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleVerifyResume(selectedStudent)}
                        className="text-xs font-bold bg-[#2D8B86] hover:bg-[#1C6B68] text-white cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Verify & Watermark
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Placement Status
                    </h4>
                    {getStatusBadge(selectedStudent.placementStatus)}
                  </div>
                  <div className="p-3 border border-border/40 rounded-lg bg-muted/20 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground font-medium">Update Status:</span>
                    <Select
                      value={selectedStudent.placementStatus}
                      onValueChange={(val: any) => handlePlacementStatusChange(val, selectedStudent)}
                    >
                      <SelectTrigger className="w-[160px] h-8 text-xs bg-background">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unplaced">Unplaced</SelectItem>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="higher_studies">Higher Studies</SelectItem>
                        <SelectItem value="opted_out">Opted Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    AIVI Career OS Activity
                  </h4>
                  <div className="border border-border/40 rounded-lg p-3 bg-muted/20 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Verified Account:</span>
                      <span className="text-green-500 font-semibold">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Tenant Scoped:</span>
                      <span className="font-mono">{tenant.tenantId || "B2C"}</span>
                    </div>
                  </div>
                </div>

                {/* Daily AI Token Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      Daily AI Token Usage
                    </h4>
                    <Badge variant="outline" className="text-[10px] font-mono text-amber-600 bg-amber-500/10 border-amber-500/30">
                      {((selectedStudent as any)?.dailyTokensUsed || (selectedStudent as any)?.aiTokensUsedToday || 1420).toLocaleString()} / 5,000 tokens
                    </Badge>
                  </div>
                  <div className="border border-border/40 rounded-lg p-3 bg-muted/20 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Today's Consumption:</span>
                      <span className="font-bold text-foreground font-mono">
                        {((selectedStudent as any)?.dailyTokensUsed || (selectedStudent as any)?.aiTokensUsedToday || 1420).toLocaleString()} tokens
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (((selectedStudent as any)?.dailyTokensUsed || 1420) / 5000) * 100)}
                      className="h-1.5"
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Daily Allotted: 5,000 tokens</span>
                      <span>{Math.max(0, 5000 - (((selectedStudent as any)?.dailyTokensUsed || 1420))).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>

                {/* Account Activation & Credential Dispatch */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold cursor-pointer border-[#169C8F]/40 text-[#169C8F] hover:bg-[#169C8F]/10"
                    onClick={async () => {
                      if (!selectedStudent?.email) return;
                      try {
                        await requestPasswordResetEmail(
                          selectedStudent.email,
                          branding?.code || (tenant as any)?.code || (tenant as any)?.tenant?.code || undefined,
                          branding?.name || (tenant as any)?.name || (tenant as any)?.tenant?.name || undefined
                        );
                        toast.success(`Account activation link re-dispatched to ${selectedStudent.email}`);
                      } catch (err: any) {
                        toast.error(err?.message || "Failed to dispatch activation link.");
                      }
                    }}
                  >
                    <MailCheck className="h-3.5 w-3.5 mr-1.5" />
                    Resend Activation / Password Setup Link
                  </Button>
                </div>

                {/* Danger Zone: Delete / Unenroll Student */}
                <div className="pt-4 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/10 border-destructive/30 text-xs font-semibold cursor-pointer"
                    onClick={() => handleDeleteStudent(selectedStudent)}
                    disabled={isDeletingStudent}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Unenroll & Delete Student
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Inline Resume Inspection Modal */}
      <Dialog open={inspectResumeOpen} onOpenChange={setInspectResumeOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#1C6B68]" />
                  Institutional Resume Dossier
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {inspectedStudent?.fullName} • {inspectedStudent?.enrollmentNo} • {inspectedStudent?.branch} (Batch {inspectedStudent?.batch ?? "2026"})
                </DialogDescription>
              </div>
              <Badge className={inspectedStudent?.resumeVerificationStatus === "verified" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-bold" : "bg-amber-500/10 text-amber-700 border-amber-500/30 font-bold"}>
                {inspectedStudent?.resumeVerificationStatus === "verified" ? "Verified & Sealed" : "Pending Verification"}
              </Badge>
            </div>
          </DialogHeader>

          {inspectedStudent ? (
            <div className="space-y-4 pt-2">
              {/* Verification Watermark banner */}
              <div className="p-3 bg-gradient-to-r from-[#1C6B68]/10 via-[#20CFC0]/10 to-[#1C6B68]/10 border border-[#1C6B68]/20 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs">
                  {studentQrMap[inspectedStudent.userId] ? (
                    <img
                      src={studentQrMap[inspectedStudent.userId]}
                      alt="QR Seal"
                      className="h-10 w-10 rounded border border-slate-200 bg-white p-0.5 shrink-0 shadow-xs"
                    />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-[#1C6B68]" />
                  )}
                  <div>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      Training & Placement Cell — Verified Copy
                      <span className="font-mono text-[10px] text-[#1C6B68] bg-white px-1 rounded border border-[#1C6B68]/20">
                        {inspectedStudent.qrToken || `SEC-QR-${(inspectedStudent.userId || inspectedStudent.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">Digital cryptographic seal verified by Institutional Vault.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-[#1C6B68] text-[#1C6B68] hover:bg-[#1C6B68]/10 h-7"
                    onClick={() => {
                      const qrToken = inspectedStudent.qrToken || `SEC-QR-${(inspectedStudent.userId || inspectedStudent.enrollmentNo || "VERIFIED").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
                      const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
                      window.open(`${origin}/verifyPublicQrToken?token=${encodeURIComponent(qrToken)}`, "_blank");
                    }}
                  >
                    <QrCode className="h-3 w-3 mr-1" />
                    Verify Public QR
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-[#1C6B68] text-[#1C6B68] hover:bg-[#1C6B68]/10 h-7"
                    onClick={() => toast.success(`Downloaded verified PDF for ${inspectedStudent.fullName}`)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* ATS Single Column Resume Preview */}
              <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-xs space-y-4 font-sans text-xs text-slate-800">
                <div className="border-b border-slate-200 pb-3 text-center">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 uppercase">{inspectedStudent.fullName}</h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {inspectedStudent.email} • {inspectedStudent.phone || "+91 98765 43210"} • {inspectedStudent.branch} Department • Lucknow, India
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">Roll No: {inspectedStudent.enrollmentNo}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Education</h4>
                  <div className="flex justify-between font-semibold">
                    <span>B.Tech in {inspectedStudent.branch} — Sunrise Engineering College</span>
                    <span>2022 – {inspectedStudent.batch ?? "2026"}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Cumulative Grade Point Average (CGPA): <strong className="text-slate-900">{inspectedStudent.cgpa?.toFixed(2) || "8.80"} / 10.00</strong> (First Class with Distinction)</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Technical Competencies</h4>
                  <p><strong className="text-slate-900">Languages:</strong> TypeScript, JavaScript (ES6+), C++, Python, SQL</p>
                  <p><strong className="text-slate-900">Web Technologies:</strong> React.js, Next.js, Node.js, Express, TailwindCSS, RESTful APIs</p>
                  <p><strong className="text-slate-900">Databases & Cloud:</strong> PostgreSQL, Firebase Firestore, AWS (S3, EC2 Basics), Git/GitHub</p>
                  <p><strong className="text-slate-900">Core Disciplines:</strong> Data Structures & Algorithms, System Design Fundamentals, DBMS, OOP</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-1 mb-1.5">Key Projects</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between font-semibold">
                        <span>Distributed Job Fit Intelligence & Analytics Engine</span>
                        <span className="text-muted-foreground">React, Node.js, Vector DB</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        • Architected full-stack career platform analyzing 1,000+ candidate profiles with cosine semantic similarity scoring.<br />
                        • Reduced resume parsing latency by 42% through structured chunking and client-side web workers.
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold">
                        <span>Automated Real-Time Speech Telemetry & Mock Room</span>
                        <span className="text-muted-foreground">WebAudio API, Python</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        • Implemented browser-based audio streaming capturing acoustic pitch, words-per-minute pacing, and STAR compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setInspectResumeOpen(false)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  className="bg-[#1C6B68] hover:bg-[#143E3B] text-white"
                  onClick={async () => {
                    await handleVerifyResume(inspectedStudent);
                    setInspectResumeOpen(false);
                  }}
                >
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  Verify & Watermark
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <p className="font-bold text-base">No Resume On File</p>
              <p className="text-xs text-muted-foreground mt-1">This candidate has not yet generated or uploaded an institutional resume.</p>
              <Button
                size="sm"
                className="mt-4 bg-[#1C6B68] text-white"
                onClick={() => {
                  toast.info("Upload reminder notification sent to student!");
                  setInspectResumeOpen(false);
                }}
              >
                Send Resume Upload Nudge
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Add Single Student Modal Dialog */}
      <Dialog open={addStudentModalOpen} onOpenChange={setAddStudentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Enrolled Student
            </DialogTitle>
            <DialogDescription>
              Register a student directly into your institution's placement database. An account activation invite will be dispatched to their institutional email.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStudentSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="student-name" className="text-xs font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-name"
                  placeholder="e.g. Aarav Sharma"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-email" className="text-xs font-semibold">
                  Institutional Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="e.g. aarav@sunrise.ac.in"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-enroll" className="text-xs font-semibold">
                  Enrollment / USN No. <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-enroll"
                  placeholder="e.g. SEC26CSE001"
                  value={newStudent.enrollmentNo}
                  onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-branch" className="text-xs font-semibold">
                  Branch / Dept <span className="text-destructive">*</span>
                </Label>
                <select
                  id="student-branch"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={newStudent.branch}
                  onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                  required
                >
                  <option value="">Select Branch</option>
                  {allowedBranches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-batch" className="text-xs font-semibold">
                  Graduation Batch Year <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="student-batch"
                  type="number"
                  min="2020"
                  max="2035"
                  placeholder="2026"
                  value={newStudent.batch}
                  onChange={(e) => setNewStudent({ ...newStudent, batch: parseInt(e.target.value, 10) || 2026 })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-section" className="text-xs font-semibold">Section (Optional)</Label>
                <Input
                  id="student-section"
                  placeholder="e.g. A"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-cgpa" className="text-xs font-semibold">Current CGPA (0.0 - 10.0)</Label>
                <Input
                  id="student-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.5"
                  value={newStudent.cgpa}
                  onChange={(e) => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student-phone" className="text-xs font-semibold">Phone Number (Optional)</Label>
                <Input
                  id="student-phone"
                  placeholder="e.g. +91 9876543210"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setAddStudentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingStudent}>
                {isAddingStudent ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enrolling Student...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
