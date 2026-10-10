import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Mic2,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  FileText,
  Eye,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Download,
  BarChart3,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import InterviewPrepHub from "@/components/interview-prep/InterviewPrepHub";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";

interface StudentInterviewRecord {
  id: string;
  studentName: string;
  enrollmentNo: string;
  branch: string;
  batch: string;
  company: string;
  role: string;
  persona: string;
  mode: "2-Way Live Voice" | "Structured 1-Way";
  score: number;
  recommendation: "Strong Hire" | "Hire" | "Borderline" | "Needs Remediation";
  date: string;
  speechTelemetry: {
    wpm: number;
    fillerWords: number;
    clarity: number;
  };
  keyStrengths: string[];
  growthAreas: string[];
}

const DEMO_STUDENT_INTERVIEWS: StudentInterviewRecord[] = [
  {
    id: "int-101",
    studentName: "Abhishek Mishra",
    enrollmentNo: "SEC26CSE001",
    branch: "CSE",
    batch: "2026",
    company: "Flipkart",
    role: "Software Development Engineer 1",
    persona: "Vikram (Bar Raiser)",
    mode: "2-Way Live Voice",
    score: 88,
    recommendation: "Strong Hire",
    date: "Today, 02:30 PM",
    speechTelemetry: { wpm: 138, fillerWords: 3, clarity: 92 },
    keyStrengths: ["Clean Data Structures trade-offs", "Structured STAR project walkthrough", "Sub-500ms voice response pacing"],
    growthAreas: ["Could expand on distributed cache eviction strategies"],
  },
  {
    id: "int-102",
    studentName: "Ananya Sharma",
    enrollmentNo: "SEC26CSE002",
    branch: "CSE",
    batch: "2026",
    company: "Amazon AWS",
    role: "SDE Cloud Architecture",
    persona: "Ananya (Tech Lead)",
    mode: "2-Way Live Voice",
    score: 92,
    recommendation: "Strong Hire",
    date: "Today, 11:15 AM",
    speechTelemetry: { wpm: 142, fillerWords: 2, clarity: 95 },
    keyStrengths: ["High architectural clarity", "Microservices resilience design", "Zero hesitation on Java concurrency"],
    growthAreas: ["Minor pacing acceleration during stressful edge cases"],
  },
  {
    id: "int-103",
    studentName: "Rahul Verma",
    enrollmentNo: "SEC26ECE012",
    branch: "ECE",
    batch: "2026",
    company: "TCS Digital",
    role: "Systems Engineer (Full Stack)",
    persona: "Kabir (Hinglish Mentor)",
    mode: "2-Way Live Voice",
    score: 74,
    recommendation: "Hire",
    date: "Yesterday, 04:45 PM",
    speechTelemetry: { wpm: 124, fillerWords: 8, clarity: 80 },
    keyStrengths: ["Solid OOP and relational database fundamentals", "Effective Hindi-to-English code explanations"],
    growthAreas: ["Improve confidence on time complexity proofs"],
  },
  {
    id: "int-104",
    studentName: "Sneha Patel",
    enrollmentNo: "SEC26ME005",
    branch: "ME",
    batch: "2026",
    company: "Deloitte USI",
    role: "Technology Consulting Analyst",
    persona: "Priya (HR Director)",
    mode: "Structured 1-Way",
    score: 82,
    recommendation: "Hire",
    date: "Yesterday, 02:10 PM",
    speechTelemetry: { wpm: 130, fillerWords: 4, clarity: 86 },
    keyStrengths: ["Polished executive communication", "Structured business situation breakdown"],
    growthAreas: ["Add quantifiable ROI metrics to behavioral examples"],
  },
  {
    id: "int-105",
    studentName: "Pooja Gupta",
    enrollmentNo: "SEC26ECE028",
    branch: "ECE",
    batch: "2026",
    company: "Accenture ADC",
    role: "Associate Software Engineer",
    persona: "Ananya (Tech Lead)",
    mode: "2-Way Live Voice",
    score: 85,
    recommendation: "Hire",
    date: "01 Sep 2026",
    speechTelemetry: { wpm: 135, fillerWords: 3, clarity: 89 },
    keyStrengths: ["Strong Spring Boot REST fundamentals", "Clean error handling explanations"],
    growthAreas: ["Review SQL index optimization query plans"],
  },
  {
    id: "int-106",
    studentName: "Devansh Mehta",
    enrollmentNo: "SEC26ECE051",
    branch: "ECE",
    batch: "2026",
    company: "Wipro Turbo",
    role: "Java Full Stack Developer",
    persona: "Kabir (Hinglish Mentor)",
    mode: "Structured 1-Way",
    score: 62,
    recommendation: "Needs Remediation",
    date: "31 Aug 2026",
    speechTelemetry: { wpm: 110, fillerWords: 14, clarity: 68 },
    keyStrengths: ["Understands basic loop constructs and Git"],
    growthAreas: ["High filler word frequency", "Needs practice on STAR behavioral answers and pointers"],
  },
];

export default function CampusInterviews() {
  const { tenant } = useAuth();
  const { activeTenantId } = useTenantBranding();
  const effectiveTenantId = activeTenantId || tenant?.tenantId;

  // If user is a Student, render the Student AI Practice Studio (InterviewPrepHub) directly!
  if (tenant?.role === "student") {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        <InterviewPrepHub defaultTab="mock" />
      </div>
    );
  }

  const isCustomTenant = Boolean(effectiveTenantId && effectiveTenantId !== "demo-sunrise" && effectiveTenantId !== "demo-campus-001");

  const isDemo = effectiveTenantId === "demo-sunrise" || effectiveTenantId === "demo-campus-001";

  const [interviews, setInterviews] = useState<StudentInterviewRecord[]>(() => {
    return isDemo ? DEMO_STUDENT_INTERVIEWS : [];
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedRecommendation, setSelectedRecommendation] = useState("ALL");

  // Detailed Scorecard Modal
  const [activeDossier, setActiveDossier] = useState<StudentInterviewRecord | null>(null);

  // Student Voice Studio Simulator Drawer (for TPO demo to faculty/deans)
  const [showDemoSimulator, setShowDemoSimulator] = useState(false);

  const deriveInterviewFeedback = (score: number, role: string, company: string, index: number) => {
    if (score >= 85) {
      const sPool = [
        [`Exemplary STAR framework delivery tailored to ${company}`, `High architectural reasoning in ${role} scaling`],
        [`Precise system design explanations with quantifiable trade-offs`, `Clear, confident technical articulation`],
        [`Superior problem decomposition skills`, `Deep domain mastery and proactive edge-case anticipation`],
      ];
      const gPool = [
        [`Refine multi-region fault tolerance justifications`, `Further tighten opening elevator pitch timing`],
        [`Deepen discussion on database partition sharding boundaries`, `Explore asynchronous event-driven trade-offs further`],
        [`Provide more explicit telemetry metrics for production monitoring`, `Pace complex algorithmic explanations evenly`],
      ];
      return {
        keyStrengths: sPool[index % sPool.length],
        growthAreas: gPool[index % gPool.length],
      };
    }
    if (score >= 78) {
      const sPool = [
        [`Solid foundational understanding of ${role} requirements`, `Good articulation of component interactions`],
        [`Clear problem-solving approach under sequential probing`, `Accurate data structures and API lifecycle knowledge`],
        [`Effective communication of past academic project milestones`, `Structured reasoning on edge case handling`],
      ];
      const gPool = [
        [`Optimize edge case time complexity and space trade-offs`, `Reduce hesitation on algorithmic scaling questions`],
        [`Quantify past project results with concrete percentages and KPIs`, `Elaborate more proactively on caching strategies`],
        [`Structure responses strictly using Situation-Task-Action-Result`, `Minimize filler words during transition phrases`],
      ];
      return {
        keyStrengths: sPool[index % sPool.length],
        growthAreas: gPool[index % gPool.length],
      };
    }
    if (score >= 70) {
      const sPool = [
        [`Basic conceptual familiarity with ${role} concepts`, `Professional composure and active listening`],
        [`Understands standard workflow patterns for ${company}`, `Receptive to hints during technical drills`],
      ];
      const gPool = [
        [`Needs deeper metric quantification in project impact`, `Review core system scaling and load balancing basics`],
        [`Elaborate with specific technical examples rather than high-level statements`, `Practice structured STAR responses to eliminate rambling`],
      ];
      return {
        keyStrengths: sPool[index % sPool.length],
        growthAreas: gPool[index % gPool.length],
      };
    }
    return {
      keyStrengths: [
        `Willingness to acknowledge knowledge gaps and learn`,
        `Basic familiarity with ${role} foundational concepts`,
      ],
      growthAreas: [
        `Fundamental review of domain core concepts required before placement drives`,
        `Practice live speech pacing and eliminate pauses during verbal drills`,
      ],
    };
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchRealInterviews = async () => {
      if (!effectiveTenantId) return;
      try {
        const { collection, query, where, orderBy, onSnapshot, getDocs } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        if (!db) return;

        const tenantMatches = Array.from(new Set([
          effectiveTenantId,
          ...(effectiveTenantId.includes("sunrise") ? ["sunrise", "demo-sunrise"] : [])
        ]));

        // Load tenant profile map to hydrate student details even if mock_interviews lacked them
        const profileMap = new Map<string, any>();
        try {
          const profilesSnap = await getDocs(query(collection(db, "profiles"), where("tenantId", "in", tenantMatches)));
          profilesSnap.docs.forEach((doc) => {
            const pData = doc.data();
            profileMap.set(doc.id, pData);
            if (pData.userId) profileMap.set(pData.userId, pData);
          });
        } catch (pErr) {
          console.warn("Could not preload tenant profiles map:", pErr);
        }

        const parseDocs = (docs: any[]) => {
          return docs.map((d) => {
            const data = d.data();
            const prof = profileMap.get(data.userId) || profileMap.get(data.candidateId) || profileMap.get(d.id);
            const studentName = data.studentName || data.userName || prof?.fullName || prof?.name || (prof?.firstName ? `${prof.firstName} ${prof?.lastName || ""}`.trim() : "") || "Student Candidate";
            const enrollmentNo = data.enrollmentNo || prof?.enrollmentNo || "EN2026000";
            const branch = data.branch || prof?.branch || "CSE";
            const batch = data.batch || prof?.batch || "2026";
            return {
              id: d.id,
              studentName,
              enrollmentNo,
              branch,
              batch,
              company: data.company || "Target Company",
              role: data.targetRole || "Software Engineer",
              persona: data.personaName || "AI Panel",
              mode: data.mode === "realtime" ? "2-Way Live Voice" : "Structured 1-Way",
              score: data.evaluation?.overallScore != null
                ? (data.evaluation.overallScore <= 10 ? Math.round(data.evaluation.overallScore * 10) : Math.round(data.evaluation.overallScore))
                : (data.score || 80),
              recommendation: data.evaluation?.hiringRecommendation || "Hire",
              date: data.createdAt ? new Date(data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt).toLocaleDateString("en-IN") : "Recent",
              speechTelemetry: {
                wpm: data.evaluation?.speechTelemetry?.estimatedWpm || 135,
                fillerWords: data.evaluation?.speechTelemetry?.fillerWordCount || 3,
                clarity: data.evaluation?.speechTelemetry?.clarityScore || 88,
              },
              keyStrengths: data.evaluation?.questionEvaluations?.[0]?.strengths || ["Technical depth in core fundamentals"],
              growthAreas: data.evaluation?.questionEvaluations?.[0]?.gapsIdentified || ["Continue practicing timed coding problems"],
            };
          });
        };

        // Try ordered query with fallback to in-memory sort if index is missing
        try {
          const q = query(
            collection(db, "mock_interviews"),
            where("tenantId", "in", tenantMatches),
            orderBy("createdAt", "desc")
          );

          unsubscribe = onSnapshot(q, (snap) => {
            if (!snap.empty) {
              setInterviews(parseDocs(snap.docs));
            } else if (effectiveTenantId?.includes("sunrise") || isDemo) {
              setInterviews(DEMO_STUDENT_INTERVIEWS);
            }
          }, async (err) => {
            console.warn("Ordered snapshot notice, using resilient in-memory sort:", err);
            const fallbackQ = query(
              collection(db, "mock_interviews"),
              where("tenantId", "in", tenantMatches)
            );
            const snap = await getDocs(fallbackQ);
            if (!snap.empty) {
              const sortedDocs = [...snap.docs].sort((a, b) => {
                const aTime = a.data()?.createdAt?.seconds || 0;
                const bTime = b.data()?.createdAt?.seconds || 0;
                return bTime - aTime;
              });
              setInterviews(parseDocs(sortedDocs));
            } else if (effectiveTenantId?.includes("sunrise") || isDemo) {
              setInterviews(DEMO_STUDENT_INTERVIEWS);
            }
          });
        } catch {
          const fallbackQ = query(
            collection(db, "mock_interviews"),
            where("tenantId", "in", tenantMatches)
          );
          const snap = await getDocs(fallbackQ);
          if (!snap.empty) {
            const sortedDocs = [...snap.docs].sort((a, b) => {
              const aTime = a.data()?.createdAt?.seconds || 0;
              const bTime = b.data()?.createdAt?.seconds || 0;
              return bTime - aTime;
            });
            setInterviews(parseDocs(sortedDocs));
          } else if (effectiveTenantId?.includes("sunrise") || isDemo) {
            setInterviews(DEMO_STUDENT_INTERVIEWS);
          }
        }

      } catch (e) {
        console.warn("Interview fetch exception:", e);
      }
    };

    fetchRealInterviews();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [effectiveTenantId, isCustomTenant]);


  const filteredInterviews = interviews.filter((item) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      item.studentName.toLowerCase().includes(searchLower) ||
      item.enrollmentNo.toLowerCase().includes(searchLower) ||
      item.company.toLowerCase().includes(searchLower) ||
      item.role.toLowerCase().includes(searchLower);
    const matchesBranch = selectedBranch === "ALL" || item.branch === selectedBranch;
    const matchesCompany = selectedCompany === "ALL" || item.company === selectedCompany;
    const matchesRec = selectedRecommendation === "ALL" || item.recommendation === selectedRecommendation;
    return matchesSearch && matchesBranch && matchesCompany && matchesRec;
  });

  const getRecBadge = (rec: StudentInterviewRecord["recommendation"]) => {
    switch (rec) {
      case "Strong Hire":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 font-bold">Strong Hire</Badge>;
      case "Hire":
        return <Badge className="bg-teal-500/10 text-primary border-teal-200 font-bold">Hire</Badge>;
      case "Borderline":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 font-bold">Borderline</Badge>;
      case "Needs Remediation":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200 font-bold">Remediation</Badge>;
    }
  };

  const handleDownloadDossier = (record: StudentInterviewRecord) => {
    const headers = ["Student Name", "Enrollment No", "Branch", "Batch", "Target Company", "Role", "Overall Score", "Hiring Recommendation", "WPM", "Filler Words", "Speech Clarity"];
    const row = [
      `"${record.studentName}"`,
      record.enrollmentNo,
      record.branch,
      record.batch,
      `"${record.company}"`,
      `"${record.role}"`,
      `${record.score}/100`,
      `"${record.recommendation}"`,
      record.speechTelemetry.wpm,
      record.speechTelemetry.fillerWords,
      `${record.speechTelemetry.clarity}%`,
    ];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${record.studentName.replace(/\s+/g, "_")}_AI_Interview_Dossier.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Diagnostic Dossier exported for ${record.studentName}!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#101820]">AI Mock Interview Oversight & Diagnostic Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit log of student voice mock interviews, Gemini 2.0 forensic evaluations, and batch hiring readiness.
          </p>
        </div>

        <Button
          onClick={() => setShowDemoSimulator(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Radio className="h-4 w-4 text-[#20CFC0] animate-pulse" />
          Preview Live Voice Studio
        </Button>
      </div>

      {/* Institutional Overview Stats */}
      {(() => {
        const totalMocks = interviews.length;
        const avgTechScore = totalMocks > 0
          ? (interviews.reduce((acc, curr) => acc + curr.score, 0) / totalMocks).toFixed(1)
          : null;
        const starAvg = totalMocks > 0
          ? Math.round(interviews.reduce((acc, curr) => acc + (curr.speechTelemetry?.clarity || 80), 0) / totalMocks)
          : null;
        const strongHireCount = interviews.filter((i) => i.recommendation === "Strong Hire").length;

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mocks Completed</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Mic2 className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#101820] mt-2">{totalMocks}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                {totalMocks > 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <TrendingUp className="h-3 w-3" /> Active placement drive
                  </span>
                ) : (
                  "No mock sessions completed yet"
                )}
              </p>
            </Card>

            <Card className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Technical Score</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#101820] mt-2">
                {avgTechScore ? `${avgTechScore} / 100` : "— / 100"}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {totalMocks > 0 ? "Evaluated technical benchmark" : "Awaiting student interview submissions"}
              </p>
            </Card>

            <Card className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">STAR Behavioral Avg</span>
                <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#101820] mt-2">
                {starAvg !== null ? `${starAvg}%` : "—"}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {totalMocks > 0 ? "Speech clarity & pacing metric" : "Speech telemetry will appear here"}
              </p>
            </Card>

            <Card className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Campus Strong Hire Pool</span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#101820] mt-2">{strongHireCount} Students</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {strongHireCount > 0 ? "Ready for Day-1 Corporate Drives" : "Candidates scoring 85+ appear here"}
              </p>
            </Card>
          </div>
        );
      })()}

      {/* Filter & Search Bar */}
      <Card className="border border-slate-200 bg-white p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student, enrollment, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Companies</option>
              <option value="Flipkart">Flipkart</option>
              <option value="Amazon AWS">Amazon AWS</option>
              <option value="TCS Digital">TCS Digital</option>
              <option value="Deloitte USI">Deloitte USI</option>
              <option value="Accenture ADC">Accenture ADC</option>
              <option value="Wipro Turbo">Wipro Turbo</option>
            </select>

            <select
              value={selectedRecommendation}
              onChange={(e) => setSelectedRecommendation(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Recommendations</option>
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="Borderline">Borderline</option>
              <option value="Needs Remediation">Needs Remediation</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Student Mock Interview Audit Table */}
      <Card className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#101820]">Student Mock Interview Logs ({filteredInterviews.length})</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Audit individual candidate speech telemetry, technical depth, and forensic scores.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="text-xs font-bold text-slate-700">Student</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Enrollment / Branch</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Target Company & Role</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Persona & Mode</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Score & Recommendation</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Date</TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Mic2 className="h-8 w-8 opacity-40 text-primary" />
                        <p className="font-semibold text-sm">No Mock Interview Logs Yet</p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Once your students complete 2-Way AI Voice or Structured technical interviews, their forensic audio metrics and bar-raiser scores will appear here.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInterviews.map((record) => (
                    <TableRow key={record.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900 block">{record.studentName}</span>
                        <span className="text-[11px] text-slate-500">{record.batch} Batch</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-slate-800 font-semibold block">{record.enrollmentNo}</span>
                        <span className="text-[11px] text-slate-500">{record.branch} Engineering</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900 block">{record.company}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[180px] block">{record.role}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-slate-700 block">{record.persona}</span>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                            {record.mode}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#101820]">{record.score}%</span>
                          {getRecBadge(record.recommendation)}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{record.date}</TableCell>
                      <TableCell className="text-right space-x-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveDossier(record)}
                          className="h-8 text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-primary" />
                          Dossier
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadDossier(record)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 cursor-pointer"
                          title="Download CSV Dossier"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Forensic Diagnostic Dossier Modal */}
      <Dialog open={!!activeDossier} onOpenChange={(open) => !open && setActiveDossier(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {activeDossier && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-lg font-bold text-[#101820]">
                      {activeDossier.studentName} — Forensic Interview Dossier
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                      Simulated {activeDossier.company} • {activeDossier.role} with {activeDossier.persona}
                    </DialogDescription>
                  </div>
                  {getRecBadge(activeDossier.recommendation)}
                </div>
              </DialogHeader>

              {/* Score & Telemetry Header */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-2xl font-black text-primary">{activeDossier.score}%</p>
                  <p className="text-xs text-slate-500">Overall Readiness</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-2xl font-black text-slate-900">{activeDossier.speechTelemetry.wpm}</p>
                  <p className="text-xs text-slate-500">Speech WPM (Optimal)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-2xl font-black text-slate-900">{activeDossier.speechTelemetry.fillerWords}</p>
                  <p className="text-xs text-slate-500">Filler Words Detected</p>
                </div>
              </div>

              {/* Strengths & Growth Areas */}
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Key Strengths Observed
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
                    {activeDossier.keyStrengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> TPO Action & Remediation Notes
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
                    {activeDossier.growthAreas.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setActiveDossier(null)}>
                  Close
                </Button>
                <Button
                  className="flex-1 bg-primary text-white cursor-pointer"
                  onClick={() => handleDownloadDossier(activeDossier)}
                >
                  <Download className="h-4 w-4 mr-1.5" /> Download Full Dossier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Demo Student Voice Practice Studio Dialog (For Dean/Faculty Demos) */}
      <Dialog open={showDemoSimulator} onOpenChange={setShowDemoSimulator}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base font-bold text-[#101820] flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary animate-pulse" /> Student Voice Studio Simulator
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Interactive preview of what students experience when practicing live voice interviews with Gemini 2.0.
            </DialogDescription>
          </DialogHeader>
          <InterviewPrepHub defaultTab="mock" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
