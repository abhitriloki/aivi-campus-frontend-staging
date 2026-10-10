import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sparkles, RefreshCw, Trash2, ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

export default function DemoToolsCard() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const [stepName, setStepName] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [confirmSeedOpen, setConfirmSeedOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Poll job status if jobId is present
  useEffect(() => {
    if (!jobId || status === "completed" || status === "failed") return;

    const interval = setInterval(async () => {
      try {
        const getJob = httpsCallable<{ jobId: string }, any>(functions, "getDemoSeedJob");
        const res = await getJob({ jobId });
        const data = res.data;
        if (data) {
          setProgressPct(data.pct || 0);
          setStepName(data.step || "Processing...");
          if (data.counts) setCounts(data.counts);
          if (data.status === "completed") {
            setStatus("completed");
            toast.success("Demo campus seeded successfully! 240 students & drives ready.");
            clearInterval(interval);
          } else if (data.status === "failed") {
            setStatus("failed");
            toast.error(data.errorMessage || "Seeding failed.");
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling demo seed job error:", err);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleStartSeed = async (confirmExisting = false) => {
    setSubmitting(true);
    try {
      const seedFn = httpsCallable<{ confirmExisting?: boolean }, { jobId: string; status?: string }>(functions, "seedDemoCampus");
      const res = await seedFn({ confirmExisting });
      if (res.data.status === "exists_confirmation_required") {
        setConfirmSeedOpen(true);
      } else {
        setJobId(res.data.jobId);
        setStatus("running");
        setProgressPct(5);
        setStepName("Job queued...");
        toast.info("1-Click Demo Campus Seeder initiated...");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start demo seeder.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetDemo = async () => {
    if (confirmPhrase !== "DELETE DEMO") {
      toast.error("Please type DELETE DEMO to confirm.");
      return;
    }
    setSubmitting(true);
    try {
      const resetFn = httpsCallable<{ confirmPhrase: string }, any>(functions, "resetDemoCampus");
      await resetFn({ confirmPhrase });
      toast.success("Demo campus data wiped cleanly!");
      setConfirmResetOpen(false);
      setConfirmPhrase("");
      setJobId(null);
      setStatus("idle");
      setProgressPct(0);
      setCounts({});
    } catch (err: any) {
      toast.error(err.message || "Reset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-[#169C8F]/30 bg-gradient-to-br from-white via-[#F4FBFA] to-[#E6F7F5] p-6 shadow-[0_12px_32px_-20px_rgba(22,156,143,0.25)]">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#169C8F]" />
            <CardTitle className="text-lg font-extrabold text-[#112031]">1-Click Demo Campus Seeder</CardTitle>
          </div>
          <Badge className={`px-3 py-1 text-xs font-bold rounded-full ${
            status === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
            status === "running" ? "bg-cyan-100 text-cyan-800 border-cyan-300 animate-pulse" :
            "bg-[#169C8F]/15 text-[#169C8F] border border-[#169C8F]/30"
          }`}>
            {status === "completed" ? "Ready (Sunrise College)" : status === "running" ? `Seeding (${progressPct}%)` : "Demo Ready"}
          </Badge>
        </div>
        <CardDescription className="text-xs font-medium text-[#55626D] leading-relaxed mt-1">
          Instantly populate a complete, realistic demo campus (Sunrise Engineering College, Lucknow) with 240 students, AES scores, drives, resumes, and mock interviews for founder sales presentations.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        {/* Progress Bar during execution */}
        {status === "running" && (
          <div className="space-y-2 p-4 bg-cyan-50/70 rounded-xl border border-cyan-200">
            <div className="flex justify-between text-xs font-bold text-cyan-950">
              <span>{stepName}</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        )}

        {/* Counts summary if completed */}
        {status === "completed" && Object.keys(counts).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
            <div><span className="font-bold text-emerald-950">{counts.students || 240}</span> Students</div>
            <div><span className="font-bold text-emerald-950">{counts.drives || 2}</span> Placement Drives</div>
            <div><span className="font-bold text-emerald-950">{counts.resumes || 100}</span> Resume Vault PDFs</div>
            <div><span className="font-bold text-emerald-950">{counts.interviews || 35}</span> AI Interviews</div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            onClick={() => handleStartSeed(false)}
            disabled={submitting || status === "running"}
            className="bg-[#169C8F] hover:bg-[#138479] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            {submitting || status === "running" ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Seeding Demo Campus...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Load Demo Campus (Sunrise)
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            onClick={() => setConfirmResetOpen(true)}
            disabled={submitting || status === "running"}
            className="bg-[#FF6D4A] hover:bg-[#E85B38] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Reset & Wipe Demo
          </Button>

          <a href="/campus/login/demo-sunrise" target="_blank" rel="noopener noreferrer" className="ml-auto">
            <Button variant="outline" size="sm" className="font-bold text-xs bg-white text-[#112031] border-[#E5E8EC] hover:bg-[#F8FAFC] rounded-xl shadow-sm">
              Open Demo as TPO
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </a>
        </div>
      </CardContent>

      {/* Confirmation Modal for Overwriting Existing Seed */}
      <Dialog open={confirmSeedOpen} onOpenChange={setConfirmSeedOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Overwrite Existing Demo Data?</DialogTitle>
            <DialogDescription className="text-xs">
              Demo campus &ldquo;demo-sunrise&rdquo; is already seeded. Do you want to re-run the seeder and update all student scores and drives?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmSeedOpen(false)}>Cancel</Button>
            <Button onClick={() => { setConfirmSeedOpen(false); handleStartSeed(true); }}>
              Yes, Overwrite Demo Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Reset & Wipe */}
      <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Hard-Reset Demo Campus Data
            </DialogTitle>
            <DialogDescription className="text-xs space-y-2">
              This action will permanently delete all seeded students, profiles, AES scores, drives, resumes, and interview records for tenant <code className="font-mono text-destructive">demo-sunrise</code>.
              <br />
              Type <strong className="font-bold text-slate-900">DELETE DEMO</strong> to confirm:
            </DialogDescription>
          </DialogHeader>

          <Input
            value={confirmPhrase}
            onChange={(e) => setConfirmPhrase(e.target.value)}
            placeholder="DELETE DEMO"
            className="font-mono text-xs"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmResetOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleResetDemo} disabled={confirmPhrase !== "DELETE DEMO" || submitting}>
              Confirm Hard Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
