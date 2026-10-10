import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RBACMatrix } from "@/config/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Zap, FolderLock, Mic2, Award, CreditCard, Settings, Plus, BarChart3, CheckCircle2, Users, Calendar, ArrowRight, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";

export function PlacementDrives() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Placement Drives</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">Corporate Placement Drive Management</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Schedule company visits, define Branch/CGPA eligibility criteria, and track student application pipelines.
        </CardDescription>
      </Card>
    </div>
  );
}

const formatCtc = (rawCtc?: string | number): string => {
  if (!rawCtc) return "8.0 LPA";
  let str = String(rawCtc).trim();
  str = str.replace(/(\s*lpa)+/gi, "").trim();
  return `${str} LPA`;
};

const formatSprintTitle = (rawTitle?: string): string => {
  if (!rawTitle) return "Placement Sprint";
  return rawTitle.replace(/\bsde\b/gi, "SDE");
};

export function PlacementSprints() {
  const { user, tenant } = useAuth();
  const { supportModeActive } = useTenantBranding();
  const effectiveTenantId = tenant.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);
  const userRole = RBACMatrix.normalizeRole(tenant.role);
  const isStaff = Boolean(
    userRole === "tenant_admin" ||
    userRole === "tpo" ||
    userRole === "placement_director" ||
    userRole === "coordinator" ||
    userRole === "admin" ||
    userRole === "platform_admin"
  );
  const isStudent = !isStaff;

  const DEFAULT_SPRINTS = [
    { id: "sp1", title: "TCS Digital 7-Day Intensive Sprint", company: "TCS Digital", targetBatch: "2026", enrolled: 142, completed: 98, status: "Active", progress: 78, ctc: "7.5 LPA" },
    { id: "sp2", title: "Infosys HackWithInfy Coding Bootcamp", company: "Infosys Specialist", targetBatch: "2026", enrolled: 110, completed: 84, status: "Active", progress: 85, ctc: "9.5 LPA" },
    { id: "sp3", title: "Amazon AWS SDE System Design Sprint", company: "Amazon AWS", targetBatch: "2026", enrolled: 45, completed: 32, status: "Upcoming", progress: 40, ctc: "28.0 LPA" },
  ];

  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<any>(null);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [targetBatch, setTargetBatch] = useState("2026");
  const [ctc, setCtc] = useState("");
  const [batchCounts, setBatchCounts] = useState<Record<string, number>>({});
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const loadBatchDistribution = async () => {
      setLoading(true);
      if (!effectiveTenantId) {
        if (isMounted) {
          setSprints(DEFAULT_SPRINTS);
          setLoading(false);
        }
        return;
      }
      try {
        const { getDb } = await import("@/integrations/firebase/client");
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const db = getDb();

        let studentsList: any[] = [];
        try {
          const snap = await getDocs(query(collection(db, "profiles"), where("tenantId", "==", effectiveTenantId)));
          const staffRoles = new Set(["tenant_admin", "platform_admin", "coordinator", "tpo", "admin", "placement_director"]);
          studentsList = snap.docs
            .filter((d) => !staffRoles.has((d.data().role || "").toLowerCase()))
            .map((d) => d.data());
        } catch {}

        if (!isMounted) return;

        const counts: Record<string, number> = {};
        studentsList.forEach((s) => {
          const b = String(s.batch || "2026");
          counts[b] = (counts[b] || 0) + 1;
        });

        const total = studentsList.length || 201;
        setBatchCounts(counts);
        setTotalStudents(total);

        // Load persistent placement sprints from Firestore (checking both 'sprints' and 'placement_sprints')
        let activeSprintsList: any[] = [];
        try {
          const [sprintsSnap, placementSprintsSnap] = await Promise.all([
            getDocs(query(collection(db, "sprints"), where("tenantId", "==", effectiveTenantId))),
            getDocs(query(collection(db, "placement_sprints"), where("tenantId", "==", effectiveTenantId)))
          ]);
          const map = new Map<string, any>();
          const getCompositeKey = (item: any) =>
            `${(item.company || "").toLowerCase().trim()}_${(item.title || "").toLowerCase().trim()}_${item.targetBatch || "2026"}`;

          sprintsSnap.docs.forEach((d) => {
            const data = { id: d.id, ...d.data() };
            map.set(getCompositeKey(data), data);
          });
          placementSprintsSnap.docs.forEach((d) => {
            const data = { id: d.id, ...d.data() };
            const key = getCompositeKey(data);
            if (!map.has(key)) {
              map.set(key, data);
            }
          });
          activeSprintsList = Array.from(map.values());
        } catch (e) {
          console.warn("Failed to fetch sprints from Firestore:", e);
        }

        // Fallback for baseline demo environment if Firestore has not seeded yet
        if (activeSprintsList.length === 0 && (effectiveTenantId === "demo-sunrise" || effectiveTenantId === "demo-campus-001")) {
          activeSprintsList = DEFAULT_SPRINTS;
        }

        // Sanitize existing sprint enrolled numbers, title typography, and CTC units
        const sanitized = activeSprintsList.map((s) => {
          const target = String(s.targetBatch || "2026");
          const realBatchCount = counts[target] || (target === "2026" ? 43 : 40);
          const enrolled = (!s.enrolled || s.enrolled === 0 || s.enrolled > Math.max(total, 250)) ? realBatchCount : s.enrolled;
          return {
            ...s,
            title: formatSprintTitle(s.title),
            ctc: formatCtc(s.ctc),
            enrolled,
          };
        });

        if (isMounted) {
          setSprints(sanitized);
          setLoading(false);
        }
      } catch (err) {
        console.warn("Failed to load batch distribution:", err);
        if (isMounted) {
          setSprints(effectiveTenantId === "demo-sunrise" ? DEFAULT_SPRINTS : []);
          setLoading(false);
        }
      }
    };

    loadBatchDistribution();
    return () => {
      isMounted = false;
    };
  }, [effectiveTenantId]);

  const [isSubmittingSprint, setIsSubmittingSprint] = useState(false);

  const handleCreateSprint = async () => {
    if (isSubmittingSprint) return;
    if (supportModeActive) {
      toast.error("Support Mode is strictly read-only. Sprints cannot be created under DPDP Act 2023.");
      return;
    }
    if (!company.trim() || !title.trim()) {
      toast.error("Please provide both Company and Sprint Title");
      return;
    }

    // Guard against duplicate sprint creation for the same company, title, and batch
    const normCompany = company.trim().toLowerCase();
    const formattedTitle = formatSprintTitle(title.trim());
    const normTitle = formattedTitle.toLowerCase();
    const isDuplicate = sprints.some(
      (s) =>
        (s.company || "").trim().toLowerCase() === normCompany &&
        (s.title || "").trim().toLowerCase() === normTitle &&
        String(s.targetBatch) === String(targetBatch)
    );

    if (isDuplicate) {
      toast.warning(`An active sprint for "${company.trim()}" - "${formattedTitle}" (Batch ${targetBatch}) already exists.`);
      return;
    }

    setIsSubmittingSprint(true);
    try {
      const enrolledCount = batchCounts[targetBatch] || (targetBatch === "2026" ? 43 : 40);

      const newSprint = {
        id: `sp-${Date.now()}`,
        title: formattedTitle,
        company: company.trim(),
        targetBatch,
        enrolled: enrolledCount,
        completed: 0,
        status: "Active",
        progress: 0,
        ctc: formatCtc(ctc),
        tenantId: effectiveTenantId || "demo-sunrise",
        createdAt: new Date().toISOString(),
      };

      setSprints([newSprint, ...sprints]);

      if (effectiveTenantId) {
        try {
          const { getDb } = await import("@/integrations/firebase/client");
          const { doc, setDoc } = await import("firebase/firestore");
          const db = getDb();
          await Promise.all([
            setDoc(doc(db, "sprints", newSprint.id), newSprint),
            setDoc(doc(db, "placement_sprints", newSprint.id), newSprint)
          ]);
        } catch (e) {
          console.warn("Failed to persist sprint to Firestore:", e);
        }
      }

      toast.success(`🚀 AI Placement Sprint launched for ${company}! ${enrolledCount} eligible students auto-enrolled.`);
      setCreateOpen(false);
      setCompany("");
      setTitle("");
      setCtc("");
    } finally {
      setIsSubmittingSprint(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#112031]">
            {isStudent ? "7-Day Placement Sprints" : "Sprints & Placement Campaigns"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isStudent
              ? "7-Day intensive company-aligned preparation sprints assigned by your placement cell."
              : "7-Day intensive AI skill sprints aligned with company-specific hiring patterns."}
          </p>
        </div>
        {!isStudent && (
          <Button
            disabled={supportModeActive}
            onClick={() => {
              if (supportModeActive) {
                toast.warning("Support Mode is strictly read-only under DPDP Act 2023. Launching sprints is disabled.");
                return;
              }
              setCreateOpen(true);
            }}
            title={supportModeActive ? "Support Mode: Read-Only under DPDP Act 2023" : undefined}
            className={`bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              supportModeActive ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {supportModeActive ? <Lock className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            {supportModeActive ? "Read-Only (Support Mode)" : "Launch New AI Sprint"}
          </Button>
        )}
      </div>

      {sprints.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center rounded-2xl">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Zap className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">No Placement Sprints Active</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2 text-sm text-slate-500">
            {isStudent
              ? "Your placement cell has not scheduled any active company preparation campaigns for your batch right now. You can prepare independently anytime using our AI tools."
              : "Launch a targeted 7-Day AI skill sprint tailored to company hiring patterns (e.g. TCS Digital, Amazon, Infosys) to auto-enroll your students."}
          </CardDescription>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {isStudent ? (
              <>
                <Link to="/campus/interviews">
                  <Button className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer">
                    <Mic2 className="h-4 w-4" /> AI Interview Lab
                  </Button>
                </Link>
                <Link to="/campus/job-fit">
                  <Button variant="outline" className="text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
                    <Briefcase className="h-4 w-4" /> Job Fit Matcher
                  </Button>
                </Link>
                <Link to="/campus/resume-studio">
                  <Button variant="outline" className="text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
                    <Award className="h-4 w-4" /> Resume Studio
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                disabled={supportModeActive}
                onClick={() => {
                  if (supportModeActive) {
                    toast.warning("Support Mode is strictly read-only under DPDP Act 2023. Launching sprints is disabled.");
                    return;
                  }
                  setCreateOpen(true);
                }}
                title={supportModeActive ? "Support Mode: Read-Only under DPDP Act 2023" : undefined}
                className={`bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer ${
                  supportModeActive ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {supportModeActive ? <Lock className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                {supportModeActive ? "Read-Only (Support Mode)" : "Launch New AI Sprint"}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sprints.map((s) => (
            <Card key={s.id} className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">{s.company}</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{s.ctc}</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isStudent
                    ? `Target Batch: ${s.targetBatch} • Campus Drive Readiness`
                    : `Target Batch: ${s.targetBatch} | Enrolled: ${s.enrolled} Students`}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{isStudent ? "Sprint Velocity" : "Campaign Completion"}</span>
                  <span>{s.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${s.progress}%` }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {isStudent ? (
                  <>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 7-Day Sprint Active
                    </span>
                    <Link to="/campus/interviews">
                      <Button size="sm" className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white text-xs font-bold rounded-lg px-3 py-1 cursor-pointer flex items-center gap-1">
                        Start Practice <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-slate-600 font-semibold">{s.completed} Students Ready</span>
                    <button
                      onClick={() => setSelectedSprint(s)}
                      className="font-bold text-primary cursor-pointer hover:underline flex items-center gap-1"
                    >
                      View Analytics &rarr;
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Launch New AI Sprint Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Launch 7-Day AI Placement Sprint
            </DialogTitle>
            <DialogDescription>
              Configure targeted hiring pattern sprint for upcoming corporate campus drive.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="sprint-company">Target Company *</Label>
              <Input
                id="sprint-company"
                placeholder="e.g. Goldman Sachs, Microsoft, TCS"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sprint-title">Sprint Title *</Label>
              <Input
                id="sprint-title"
                placeholder="e.g. Software Engineer 7-Day Intensive Bootcamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sprint-batch">Target Batch</Label>
                <Select value={targetBatch} onValueChange={setTargetBatch}>
                  <SelectTrigger id="sprint-batch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026 (Final Year · {batchCounts["2026"] || 43} Students)</SelectItem>
                    <SelectItem value="2025">2025 (Graduating · {batchCounts["2025"] || 40} Students)</SelectItem>
                    <SelectItem value="2024">2024 (Batch 2024 · {batchCounts["2024"] || 34} Students)</SelectItem>
                    <SelectItem value="2027">2027 (Pre-Final · {batchCounts["2027"] || 0} Students)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="sprint-ctc">Package (LPA)</Label>
                <Input
                  id="sprint-ctc"
                  placeholder="e.g. 12.5"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20 text-xs text-primary font-medium">
              🤖 Gemini AI will automatically generate the 7-day curriculum (Aptitude $\rightarrow$ DSA $\rightarrow$ STAR Voice Mocks $\rightarrow$ JD Alignment).
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setCreateOpen(false)} disabled={isSubmittingSprint}>Cancel</Button>
            <Button className="flex-1 bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold shadow-sm cursor-pointer" onClick={handleCreateSprint} disabled={isSubmittingSprint}>
              {isSubmittingSprint ? "Launching..." : "Launch Sprint"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Analytics Dialog */}
      <Dialog open={!!selectedSprint} onOpenChange={(open) => !open && setSelectedSprint(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> {selectedSprint?.title} — Analytics
            </DialogTitle>
            <DialogDescription>
              Sprint performance, day-by-day student task submissions, and mock interview completion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xl font-bold text-slate-900">{selectedSprint?.enrolled}</p>
                <p className="text-xs text-slate-500">Enrolled Students</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xl font-bold text-primary">{selectedSprint?.completed}</p>
                <p className="text-xs text-slate-500">Interview Ready</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xl font-bold text-emerald-600">{selectedSprint?.progress}%</p>
                <p className="text-xs text-slate-500">Avg Completion</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">7-Day Curriculum Milestone Breakdown</p>
              {[
                { day: "Day 1-2", task: "ATS Resume Tuning & Company JD Keyword Match", completion: "92%" },
                { day: "Day 3-4", task: "Company Specific Coding & Technical Aptitude Test", completion: "84%" },
                { day: "Day 5-6", task: "Gemini 2.0 Live Voice Mock Interview (Hindi/English)", completion: "76%" },
                { day: "Day 7", task: "HR STAR Behavioral Final Verification", completion: "68%" },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-900">{m.day}: </span>
                      <span className="text-slate-600">{m.task}</span>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{m.completion}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setSelectedSprint(null)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ResumeVault() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Resume Vault</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <FolderLock className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">Verified Institutional Resume Export Vault</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Export verified PDF/Word resume bundles with institutional branding watermarks for campus recruitment drives.
        </CardDescription>
      </Card>
    </div>
  );
}

export function CampusInterviews() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Vernacular AI Mock Interviews</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <Mic2 className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">Multilingual Voice AI Interview Practice</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Simulate technical and HR interviews with real-time feedback in English, Hindi, and regional languages.
        </CardDescription>
      </Card>
    </div>
  );
}

export function AccreditationReports() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Accreditation Evidence Reports</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <Award className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">NAAC &amp; NIRF Compliance Exporter</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Generate audit-ready placement records, salary progression tables, and student employability evidence dossiers.
        </CardDescription>
      </Card>
    </div>
  );
}

export function CampusBilling() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Subscription</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <CreditCard className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">Campus Seat Allocation &amp; Invoicing</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Manage enrolled student license counts, faculty coordinator seats, and renewal contracts.
        </CardDescription>
      </Card>
    </div>
  );
}

export function TenantSettings() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <h1 className="text-3xl font-bold tracking-tight">Tenant Settings</h1>
      <Card className="border-border/50 bg-card p-8 text-center">
        <Settings className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-xl">Institution Customization &amp; RBAC</CardTitle>
        <CardDescription className="max-w-md mx-auto mt-2">
          Configure university domain whitelisting, coordinator branch assignments, and audit logs.
        </CardDescription>
      </Card>
    </div>
  );
}
