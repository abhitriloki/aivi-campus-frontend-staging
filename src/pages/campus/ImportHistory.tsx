import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, UploadCloud, Layers, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { ImportJobData, RowError, rollbackImportJob } from "@/services/campusService";

export default function ImportHistory() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const { branding, activeTenantId } = useTenantBranding();
  const effectiveTenantId = activeTenantId || tenant.tenantId || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);

  const [jobs, setJobs] = useState<ImportJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!effectiveTenantId) {
      setLoading(false);
      return;
    }

    try {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      const q = query(
        collection(db, "import_jobs"),
        where("tenantId", "==", effectiveTenantId)
      );

      const snap = await getDocs(q);
      const fetchedJobs: ImportJobData[] = snap.docs.map(doc => {
        const d = doc.data();
        return {
          jobId: d.jobId || doc.id,
          tenantId: d.tenantId,
          createdBy: d.createdBy,
          totals: d.totals || { rows: 0, valid: 0, created: 0, linked: 0, skipped: 0, failed: 0 },
          rowErrors: d.rowErrors || [],
          dryRun: d.dryRun ?? false,
          status: d.status || "completed",
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt,
          completedAt: d.completedAt?.toDate ? d.completedAt.toDate().toISOString() : d.completedAt,
        };
      });

      fetchedJobs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setJobs(fetchedJobs);
    } catch (err) {
      console.error("Error fetching import history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [effectiveTenantId]);

  const handleRollback = async (job: ImportJobData) => {
    if (!window.confirm(`Are you sure you want to rollback import job ${job.jobId.slice(0, 8)}? This will permanently delete all student candidates created in this batch and restore your institutional seats.`)) {
      return;
    }
    setRollingBackId(job.jobId);
    try {
      const res = await rollbackImportJob({
        jobId: job.jobId,
        tenantId: effectiveTenantId || undefined,
      });
      toast.success(res.message || "Import batch successfully rolled back.");
      setJobs(prev => prev.map(j => j.jobId === job.jobId ? { ...j, status: "rolled_back" as any } : j));
      window.dispatchEvent(new Event("aivi_students_updated"));
    } catch (err: any) {
      console.error("Rollback failed:", err);
      toast.error(err?.message || "Failed to rollback import batch.");
    } finally {
      setRollingBackId(null);
    }
  };

  const downloadErrorReportCSV = (jobId: string, errors: RowError[]) => {
    let csv = "Row,Student Name,Email,Reason\n";
    errors.forEach(e => {
      csv += `"${e.rowNumber}","${(e.studentName || "").replace(/"/g, '""')}","${e.email}","${(e.reason || "").replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `import_errors_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import History Ledger</h1>
          <p className="text-muted-foreground">Historical CSV roster import jobs, dry-run validations, and row error reports.</p>
        </div>
        <Button onClick={() => navigate("/campus/import")}>
          <UploadCloud className="h-4 w-4 mr-2" />
          New CSV Import
        </Button>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Past Import Jobs
          </CardTitle>
          <CardDescription>All historical import executions and dry-run pre-validations for your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-border rounded-xl">
              <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-lg">No import jobs found</p>
              <p className="text-sm text-muted-foreground mt-1">Upload your first student roster CSV to populate the directory.</p>
              <Button className="mt-4" onClick={() => navigate("/campus/import")}>Start Import</Button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border/40 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Linked</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.jobId}>
                      <TableCell className="font-mono text-xs">{j.jobId.slice(0, 12)}...</TableCell>
                      <TableCell className="text-xs">
                        {j.createdAt ? new Date(j.createdAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={j.dryRun ? "outline" : "default"}>
                          {j.dryRun ? "Dry Run" : "Live Import"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-semibold">{j.totals.rows}</TableCell>
                      <TableCell className="text-xs text-green-500 font-semibold">{j.totals.created}</TableCell>
                      <TableCell className="text-xs text-blue-500 font-semibold">{j.totals.linked}</TableCell>
                      <TableCell className="text-xs text-red-500 font-semibold">{j.totals.failed}</TableCell>
                      <TableCell className="text-right space-x-1">
                        {j.status === "rolled_back" ? (
                          <Badge variant="outline" className="text-destructive border-destructive/30 text-[10px]">
                            Rolled Back
                          </Badge>
                        ) : !j.dryRun && (j.totals.created > 0 || j.totals.linked > 0) && (tenant.role === "tenant_admin" || tenant.role === "platform_admin") ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => handleRollback(j)}
                            disabled={rollingBackId === j.jobId}
                          >
                            <RotateCcw className={`h-3.5 w-3.5 mr-1 ${rollingBackId === j.jobId ? "animate-spin" : ""}`} />
                            Rollback
                          </Button>
                        ) : null}
                        {j.rowErrors.length > 0 ? (
                          <Button variant="ghost" size="sm" onClick={() => downloadErrorReportCSV(j.jobId, j.rowErrors)}>
                            <Download className="h-4 w-4 mr-1 text-destructive" />
                            Errors ({j.rowErrors.length})
                          </Button>
                        ) : j.status !== "rolled_back" && !(!j.dryRun && (j.totals.created > 0 || j.totals.linked > 0)) ? (
                          <span className="text-xs text-muted-foreground">Clean</span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
