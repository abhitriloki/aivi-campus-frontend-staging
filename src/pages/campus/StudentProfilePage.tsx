import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Award,
  FileText,
  Phone,
  Mail,
  Building2,
  Sparkles,
  Calendar,
  Edit3,
  Save,
  ArrowRight,
  BookOpen,
  FolderLock,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserResumeMemory } from "@/services/analysisService";

export interface StudentProfileData {
  fullName: string;
  enrollmentNo: string;
  email: string;
  phone: string;
  branch: string;
  semester: string;
  batch: number;
  cgpa: number;
  backlogs: number;
  backlogDetails?: string;
  placementStatus: "unplaced" | "placed" | "higher_studies" | "opted_out";
  placedCompany?: string;
  placedPackageLpa?: number;
  resumeVerified?: boolean;
}

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const { user, tenant } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Profile fields state
  const [profile, setProfile] = useState<StudentProfileData>({
    fullName: user?.displayName || "Student Candidate",
    enrollmentNo: "ENR-2026-084",
    email: user?.email || "",
    phone: "+91 98765 43210",
    branch: "CSE",
    semester: "Semester 7",
    batch: 2026,
    cgpa: 7.2,
    backlogs: 0,
    backlogDetails: "",
    placementStatus: "unplaced",
    placedCompany: "",
    placedPackageLpa: 0,
    resumeVerified: false,
  });

  // Edit form state
  const [form, setForm] = useState<StudentProfileData>(profile);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        setLoading(true);
        const { doc, getDoc } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();

        let firestoreData: any = null;
        if (db) {
          try {
            const snap = await getDoc(doc(db, "profiles", user.uid));
            if (snap.exists()) {
              firestoreData = snap.data();
            }
          } catch (e) {
            console.warn("Could not read Firestore profile:", e);
          }
        }

        // Check localStorage cache
        let localData: any = null;
        try {
          const raw = localStorage.getItem(`aivi_student_profile_${user.uid}`);
          if (raw) localData = JSON.parse(raw);
        } catch {}

        // Check resume text in memory for any academic stats if not yet explicitly saved
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

        const resolvedCgpa =
          typeof firestoreData?.cgpa === "number"
            ? firestoreData.cgpa
            : typeof localData?.cgpa === "number"
            ? localData.cgpa
            : typeof extractedCgpa === "number"
            ? extractedCgpa
            : 7.2;

        const resolvedBacklogs =
          typeof firestoreData?.backlogs === "number"
            ? firestoreData.backlogs
            : typeof localData?.backlogs === "number"
            ? localData.backlogs
            : typeof extractedBacklogs === "number"
            ? extractedBacklogs
            : 0;

        const finalProfile: StudentProfileData = {
          fullName:
            firestoreData?.fullName ||
            firestoreData?.name ||
            localData?.fullName ||
            user.displayName ||
            "Student Candidate",
          enrollmentNo:
            firestoreData?.enrollmentNo ||
            localData?.enrollmentNo ||
            `ENR-${tenant?.tenantId?.slice(0, 4) || "SUN"}-2026`,
          email: firestoreData?.email || user.email || "",
          phone: firestoreData?.phone || localData?.phone || "+91 98765 43210",
          branch: firestoreData?.branch || localData?.branch || "CSE",
          semester: firestoreData?.semester || localData?.semester || "Semester 7",
          batch: typeof firestoreData?.batch === "number" ? firestoreData.batch : localData?.batch || 2026,
          cgpa: resolvedCgpa,
          backlogs: resolvedBacklogs,
          backlogDetails:
            firestoreData?.backlogDetails ||
            localData?.backlogDetails ||
            (resolvedBacklogs > 0 ? "Data Structures & Algorithms, Discrete Mathematics, Database Systems" : ""),
          placementStatus:
            localStorage.getItem("aivi_active_student_placement_status") ||
            firestoreData?.placementStatus ||
            localData?.placementStatus ||
            "unplaced",
          placedCompany:
            localStorage.getItem("aivi_active_student_placed_company") ||
            firestoreData?.placedCompany ||
            localData?.placedCompany ||
            "",
          placedPackageLpa: localStorage.getItem("aivi_active_student_placed_package")
            ? Number(localStorage.getItem("aivi_active_student_placed_package"))
            : firestoreData?.placedPackageLpa || localData?.placedPackageLpa || 0,
          resumeVerified: Boolean(firestoreData?.resumeVerified || localData?.resumeVerified),
        };

        setProfile(finalProfile);
        setForm(finalProfile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, tenant]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (form.cgpa < 0 || form.cgpa > 10) {
      toast.error("Please enter a valid CGPA between 0.0 and 10.0");
      return;
    }
    if (form.backlogs < 0) {
      toast.error("Backlogs count cannot be negative");
      return;
    }

    setSaving(true);
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      const payload = {
        fullName: form.fullName.trim(),
        enrollmentNo: form.enrollmentNo.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        branch: form.branch.trim().toUpperCase(),
        semester: form.semester.trim(),
        batch: Number(form.batch) || 2026,
        cgpa: parseFloat(Number(form.cgpa).toFixed(2)),
        backlogs: parseInt(String(form.backlogs), 10) || 0,
        backlogDetails: form.backlogDetails?.trim() || "",
        placementStatus: form.placementStatus,
        placedCompany: form.placedCompany?.trim() || "",
        placedPackageLpa: Number(form.placedPackageLpa) || 0,
        updatedAt: new Date().toISOString(),
      };

      if (db) {
        await setDoc(doc(db, "profiles", user.uid), payload, { merge: true });
      }

      // Also persist to localStorage for instant local reactivity
      localStorage.setItem(`aivi_student_profile_${user.uid}`, JSON.stringify({ ...profile, ...payload }));
      localStorage.setItem("aivi_active_student_cgpa", String(payload.cgpa));
      localStorage.setItem("aivi_active_student_backlogs", String(payload.backlogs));
      localStorage.setItem("aivi_active_student_placement_status", payload.placementStatus || "unplaced");
      if (payload.placedCompany) {
        localStorage.setItem("aivi_active_student_placed_company", payload.placedCompany);
      } else {
        localStorage.removeItem("aivi_active_student_placed_company");
      }
      if (payload.placedPackageLpa) {
        localStorage.setItem("aivi_active_student_placed_package", String(payload.placedPackageLpa));
      } else {
        localStorage.removeItem("aivi_active_student_placed_package");
      }

      // Dispatch storage event so StudentDrivesPage immediately picks up the new academic values
      window.dispatchEvent(new Event("aivi_profile_updated"));

      setProfile((prev) => ({ ...prev, ...(payload as any) }));
      setEditModalOpen(false);
      toast.success("Academic & Placement profile updated successfully! 🎓");
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      // Fallback local save
      const payload = { ...form };
      localStorage.setItem(`aivi_student_profile_${user.uid}`, JSON.stringify(payload));
      localStorage.setItem("aivi_active_student_cgpa", String(payload.cgpa));
      localStorage.setItem("aivi_active_student_backlogs", String(payload.backlogs));
      localStorage.setItem("aivi_active_student_placement_status", payload.placementStatus || "unplaced");
      if (payload.placedCompany) {
        localStorage.setItem("aivi_active_student_placed_company", payload.placedCompany);
      } else {
        localStorage.removeItem("aivi_active_student_placed_company");
      }
      if (payload.placedPackageLpa) {
        localStorage.setItem("aivi_active_student_placed_package", String(payload.placedPackageLpa));
      } else {
        localStorage.removeItem("aivi_active_student_placed_package");
      }
      window.dispatchEvent(new Event("aivi_profile_updated"));
      setProfile(payload);
      setEditModalOpen(false);
      toast.success("Profile saved locally! 🎓");
      toast.success("Profile saved locally! 🎓");
    } finally {
      setSaving(false);
    }
  };

  const isCriticalStanding = profile.backlogs > 0 || profile.cgpa < 5.0;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white shadow-[0_20px_50px_-24px_hsl(210_33%_10%/0.5)] lg:p-7">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] blur-2xl" />
          <div className="bg-grid-light absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_90%_at_0%_0%,black,transparent)]" />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(176_52%_62%)]">
              <User className="h-3.5 w-3.5" /> Institutional Academic Dossier
            </p>
            <h1 className="mt-1.5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.015em]">
              Student Master Profile
            </h1>
            <p className="mt-1 max-w-2xl text-[13.5px] text-slate-400 leading-relaxed">
              Official institutional academic and placement dossier used by the Training &amp; Placement Cell for drive shortlisting, CGPA/backlog eligibility gating, and recruiter accreditation packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isCriticalStanding ? (
              <Badge variant="destructive" className="px-3.5 py-1.5 text-xs font-bold bg-rose-500/20 text-rose-300 border-rose-500/30">
                <AlertCircle className="mr-1.5 h-3.5 w-3.5" /> Critical Academic Standing
              </Badge>
            ) : (
              <Badge variant="success" className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Good Standing
              </Badge>
            )}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setForm(profile)}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold h-9 px-4 rounded-xl shadow-md gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Records
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display font-bold text-lg text-slate-900">
                    Edit Student Master Profile
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Update your official academic standing, verified CGPA, active backlogs, and contact information. These values govern your eligibility in corporate placement drives.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="enrollmentNo" className="text-xs font-bold text-slate-700">Enrollment / University Roll No</Label>
                      <Input
                        id="enrollmentNo"
                        value={form.enrollmentNo}
                        onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
                        required
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">College Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="branch" className="text-xs font-bold text-slate-700">Branch / Dept</Label>
                      <Input
                        id="branch"
                        value={form.branch}
                        onChange={(e) => setForm({ ...form, branch: e.target.value.toUpperCase() })}
                        placeholder="CSE, ECE, ME"
                        required
                        className="text-xs uppercase"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="semester" className="text-xs font-bold text-slate-700">Semester</Label>
                      <Input
                        id="semester"
                        value={form.semester}
                        onChange={(e) => setForm({ ...form, semester: e.target.value })}
                        placeholder="Semester 7"
                        required
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="batch" className="text-xs font-bold text-slate-700">Graduation Batch</Label>
                      <Input
                        id="batch"
                        type="number"
                        value={form.batch}
                        onChange={(e) => setForm({ ...form, batch: parseInt(e.target.value, 10) || 2026 })}
                        required
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Academic Gating Parameters */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-3">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-amber-700" /> Placement Eligibility Parameters
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="cgpa" className="text-xs font-bold text-slate-800">
                          Current Verified CGPA (0.0 to 10.0)
                        </Label>
                        <Input
                          id="cgpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={form.cgpa}
                          onChange={(e) => setForm({ ...form, cgpa: parseFloat(e.target.value) || 0 })}
                          required
                          className="text-xs font-bold bg-white"
                        />
                        <span className="text-[10px] text-slate-500">e.g. 4.7 or 7.5</span>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="backlogs" className="text-xs font-bold text-slate-800">
                          Active Backlogs Count
                        </Label>
                        <Input
                          id="backlogs"
                          type="number"
                          min="0"
                          max="20"
                          value={form.backlogs}
                          onChange={(e) => setForm({ ...form, backlogs: parseInt(e.target.value, 10) || 0 })}
                          required
                          className="text-xs font-bold bg-white"
                        />
                        <span className="text-[10px] text-slate-500">0 for clear academic standing</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="backlogDetails" className="text-xs font-bold text-slate-800">
                        Backlog Subjects / Re-appear Pending (if any)
                      </Label>
                      <Input
                        id="backlogDetails"
                        value={form.backlogDetails || ""}
                        onChange={(e) => setForm({ ...form, backlogDetails: e.target.value })}
                        placeholder="e.g. Data Structures, Discrete Mathematics"
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Placement Status */}
                  <div className="space-y-1.5">
                    <Label htmlFor="placementStatus" className="text-xs font-bold text-slate-700">Placement Status</Label>
                    <select
                      id="placementStatus"
                      value={form.placementStatus}
                      onChange={(e) => setForm({ ...form, placementStatus: e.target.value as any })}
                      className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="unplaced">Unplaced (Seeking Placement · Actively Interviewing)</option>
                      <option value="placed">Placed (Offer Received)</option>
                      <option value="higher_studies">Higher Studies</option>
                      <option value="opted_out">Opted Out</option>
                    </select>
                  </div>

                  {form.placementStatus === "placed" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
                      <div className="space-y-1.5">
                        <Label htmlFor="placedCompany" className="text-xs font-bold text-emerald-900">Placed Company</Label>
                        <Input
                          id="placedCompany"
                          value={form.placedCompany || ""}
                          onChange={(e) => setForm({ ...form, placedCompany: e.target.value })}
                          placeholder="e.g. Tata Consultancy Services"
                          className="text-xs bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="placedPackageLpa" className="text-xs font-bold text-emerald-900">Package (LPA)</Label>
                        <Input
                          id="placedPackageLpa"
                          type="number"
                          step="0.1"
                          value={form.placedPackageLpa || ""}
                          onChange={(e) => setForm({ ...form, placedPackageLpa: parseFloat(e.target.value) || 0 })}
                          placeholder="e.g. 7.5"
                          className="text-xs bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditModalOpen(false)}
                      className="text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {saving ? "Saving..." : "Save Master Profile"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main 3-Column Profile Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Academic Standing & Gating */}
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-primary" /> Academic Dossier
              </span>
              <Badge variant="outline" className="text-[10px] font-bold">
                Batch {profile.batch}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Academic Standing</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Evaluated against corporate drive eligibility criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CGPA Ring / Score */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-slate-50/60">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  Current Verified CGPA
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className={`text-2xl font-bold font-display ${profile.cgpa < 6.0 ? "text-rose-600" : profile.cgpa >= 7.5 ? "text-emerald-600" : "text-amber-600"}`}>
                    {profile.cgpa.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
                </div>
              </div>
              <Badge
                variant={profile.cgpa < 6.0 ? "destructive" : profile.cgpa >= 7.5 ? "success" : "secondary"}
                className="text-[11px] font-bold px-2.5 py-1"
              >
                {profile.cgpa < 6.0 ? "Below Cut-off" : profile.cgpa >= 7.5 ? "High Performing" : "Average"}
              </Badge>
            </div>

            {/* Backlogs */}
            <div className={`p-4 rounded-xl border ${profile.backlogs > 0 ? "border-rose-200 bg-rose-50/50" : "border-emerald-200 bg-emerald-50/40"}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600 block">
                  Active Backlogs
                </span>
                <span className={`text-sm font-bold ${profile.backlogs > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                  {profile.backlogs === 0 ? "0 (All Cleared ✓)" : `${profile.backlogs} Active Backlog(s)`}
                </span>
              </div>
              {profile.backlogs > 0 && profile.backlogDetails && (
                <p className="mt-2 text-[11px] font-semibold text-rose-600 leading-relaxed border-t border-rose-200/60 pt-2">
                  <span className="font-bold">Subjects:</span> {profile.backlogDetails}
                </p>
              )}
            </div>

            {/* Branch & Semester Details */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                <span className="text-slate-500 font-medium">Department / Branch</span>
                <span className="font-bold text-slate-800">{profile.branch}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                <span className="text-slate-500 font-medium">Current Semester</span>
                <span className="font-bold text-slate-800">{profile.semester}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">Degree Status</span>
                <span className="font-bold text-slate-800">B.Tech Regular</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Personal & Identity Details */}
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Student Identity
              </span>
              <Badge variant="outline" className="text-[10px] font-bold">
                {tenant?.name || "Sunrise Institute"}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Personal &amp; Contact Info</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Institutional verified student profile records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/60 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-slate-900 text-sm truncate">{profile.fullName}</p>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">Enrollment: {profile.enrollmentNo}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Gating Summary Alert */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Drive Gating Status
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {profile.backlogs > 0 ? (
                  <>
                    Your profile has <strong className="text-rose-600">{profile.backlogs} active backlogs</strong> and a CGPA of <strong className="text-slate-900">{profile.cgpa.toFixed(1)}</strong>. Drives requiring 0 backlogs or minimum CGPA &gt; {profile.cgpa.toFixed(1)} are restricted.
                  </>
                ) : (
                  <>
                    Your academic record is clear with <strong className="text-emerald-700">0 active backlogs</strong>. Eligible for all corporate drives matching your CGPA threshold ({profile.cgpa.toFixed(1)}).
                  </>
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-1 text-xs font-bold rounded-lg border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate("/campus/student-drives")}
              >
                <Briefcase className="mr-1.5 h-3.5 w-3.5 text-primary" />
                View My Placement Drives
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Column 3: Placement Status & Master Assets */}
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Placement Hub
              </span>
              <Badge
                variant={profile.placementStatus === "placed" ? "success" : "secondary"}
                className={`text-[10px] font-bold ${
                  profile.placementStatus === "placed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : profile.placementStatus === "higher_studies"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : profile.placementStatus === "opted_out"
                    ? "bg-slate-100 text-slate-700 border-slate-300"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                }`}
              >
                {profile.placementStatus === "placed"
                  ? "Offer Received ✓"
                  : profile.placementStatus === "higher_studies"
                  ? "Higher Studies 🎓"
                  : profile.placementStatus === "opted_out"
                  ? "Opted Out"
                  : "Seeking Placement"}
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Placement &amp; Assets</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Verified credential vault &amp; application telemetry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Placement Status Box */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-slate-50/60">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">
                Current Placement Status
              </span>
              <p className="mt-1 font-display font-bold text-slate-900 text-sm">
                {profile.placementStatus === "placed"
                  ? `Placed at ${profile.placedCompany || "Top Recruiter"}`
                  : profile.placementStatus === "higher_studies"
                  ? "Higher Studies · Masters / GATE / GRE Preparation 🎓"
                  : profile.placementStatus === "opted_out"
                  ? "Opted Out of Campus Placement Drives"
                  : "Unplaced · Seeking Placement · Actively Interviewing"}
              </p>
              {profile.placementStatus === "placed" && profile.placedPackageLpa ? (
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                  Compensation: ₹{profile.placedPackageLpa} LPA
                </p>
              ) : null}
            </div>

            {/* Resume Assets */}
            <div className="space-y-2 pt-1">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">
                Career Intelligence Assets
              </span>

              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/campus/student-vault")}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <FolderLock className="h-4 w-4 text-primary group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Verified Resume Vault</p>
                    <p className="text-[10px] text-slate-500">College QR-sealed credential</p>
                  </div>
                </div>
                <Badge variant={profile.resumeVerified ? "success" : "secondary"} className="text-[9.5px] font-bold">
                  {profile.resumeVerified ? "Verified ✓" : "Pending"}
                </Badge>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/campus/resume-studio")}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-primary group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Resume Studio</p>
                    <p className="text-[10px] text-slate-500">Edit experience, bullets, and CGPA</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition" />
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/campus/interviews")}
                className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-primary group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Voice Mock Interview</p>
                    <p className="text-[10px] text-slate-500">Company question pack rehearsal</p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
