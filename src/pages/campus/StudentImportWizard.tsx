import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, ArrowRight, ArrowLeft, RefreshCw, UploadCloud, Layers } from "lucide-react";
import { toast } from "sonner";
import { importStudentsCsv, getImportJob, ImportJobData, RowError } from "@/services/campusService";

const SAMPLE_CSV = `name,email,enrollment_no,branch,batch,section,phone,cgpa
Aarav Sharma,aarav.sharma@aivi.ac.in,EN2026001,CSE,2026,A,9876543210,8.7
Ananya Verma,ananya.verma@aivi.ac.in,EN2026002,ECE,2026,B,9876543211,9.1
Rohan Gupta,rohan.gupta@aivi.ac.in,EN2026003,ME,2027,A,9876543212,7.9
Priya Singh,priya.singh@aivi.ac.in,EN2026004,CSE,2026,A,9876543213,8.4
Aditya Kumar,aditya.kumar@aivi.ac.in,EN2026005,IT,2026,B,9876543214,8.2
Sneha Patel,sneha.patel@aivi.ac.in,EN2026006,ECE,2026,A,9876543215,8.8
Rahul Mishra,rahul.mishra@aivi.ac.in,EN2026007,CSE,2026,C,9876543216,7.6
Pooja Reddy,pooja.reddy@aivi.ac.in,EN2026008,EE,2027,A,9876543217,8.0
Vikram Singh,vikram.singh@aivi.ac.in,EN2026009,ME,2026,B,9876543218,7.3
Deepa Nair,deepa.nair@aivi.ac.in,EN2026010,CSE,2026,A,9876543219,9.4
Kunal Joshi,kunal.joshi@aivi.ac.in,EN2026011,CE,2027,B,9876543220,7.1
Neha Srivastava,neha.srivastava@aivi.ac.in,EN2026012,IT,2026,A,9876543221,8.9
Mohit Chauhan,mohit.chauhan@aivi.ac.in,EN2026013,ECE,2026,C,9876543222,6.9
Ritu Saxena,ritu.saxena@aivi.ac.in,EN2026014,CSE,2026,B,9876543223,8.5
Nitin Agarwal,nitin.agarwal@aivi.ac.in,EN2026015,EE,2026,A,9876543224,7.8
Kavita Yadav,kavita.yadav@aivi.ac.in,EN2026016,ME,2027,C,9876543225,8.1
Devansh Mehta,devansh.mehta@aivi.ac.in,EN2026017,CSE,2026,A,9876543226,9.2
Swati Deshmukh,swati.deshmukh@aivi.ac.in,EN2026018,ECE,2026,B,9876543227,7.7
Arjun Bhatia,arjun.bhatia@aivi.ac.in,EN2026019,IT,2027,A,9876543228,8.3
Meera Pillai,meera.pillai@aivi.ac.in,EN2026020,CE,2026,A,9876543229,7.4
Siddharth Rao,siddharth.rao@aivi.ac.in,EN2026021,CSE,2026,C,9876543230,8.6
Divya Kulkarni,divya.kulkarni@aivi.ac.in,EN2026022,EE,2027,B,9876543231,8.2
Gaurav Pandey,gaurav.pandey@aivi.ac.in,EN2026023,ME,2026,A,9876543232,7.5
Ishita Sen,ishita.sen@aivi.ac.in,EN2026024,CSE,2026,B,9876543233,9.0
Harsh Vardhan,harsh.vardhan@aivi.ac.in,EN2026025,ECE,2026,A,9876543234,7.2
Tanvi Kapoor,tanvi.kapoor@aivi.ac.in,EN2026026,IT,2026,B,9876543235,8.7
Yashwant Rawat,yashwant.rawat@aivi.ac.in,EN2026027,CE,2027,A,9876543236,6.8
Aniket Dubey,aniket.dubey@aivi.ac.in,EN2026028,CSE,2026,A,9876543237,8.8
Shreya Ghosh,shreya.ghosh@aivi.ac.in,EN2026029,EE,2026,C,9876543238,8.4
Alok Tiwari,alok.tiwari@aivi.ac.in,EN2026030,ME,2027,B,9876543239,7.0
Bhavna Menon,bhavna.menon@aivi.ac.in,EN2026031,CSE,2026,B,9876543240,9.3
Prateek Jain,prateek.jain@aivi.ac.in,EN2026032,ECE,2026,A,9876543241,8.0
Riya Singhal,riya.singhal@aivi.ac.in,EN2026033,IT,2026,C,9876543242,8.6
Sameer Roy,sameer.roy@aivi.ac.in,EN2026034,CE,2027,A,9876543243,7.6
Pallavi Nambiar,pallavi.nambiar@aivi.ac.in,EN2026035,CSE,2026,A,9876543244,9.5
Varun Chawla,varun.chawla@aivi.ac.in,EN2026036,EE,2026,B,9876543245,7.9
Monika Saxena,monika.saxena@aivi.ac.in,EN2026037,ME,2026,C,9876543246,7.8
Tarun Sethi,tarun.sethi@aivi.ac.in,EN2026038,ECE,2027,A,9876543247,8.3
Komal Biswas,komal.biswas@aivi.ac.in,EN2026039,CSE,2026,B,9876543248,8.5
Manas Tripathi,manas.tripathi@aivi.ac.in,EN2026040,IT,2026,A,9876543249,8.1
Ankita Hegde,ankita.hegde@aivi.ac.in,EN2026041,CE,2026,B,9876543250,7.3
Rajat Soni,rajat.soni@aivi.ac.in,EN2026042,CSE,2027,A,9876543251,8.9
Preeti Das,preeti.das@aivi.ac.in,EN2026043,ECE,2026,C,9876543252,7.5
Vaibhav Khatri,vaibhav.khatri@aivi.ac.in,EN2026044,EE,2026,A,9876543253,8.0
Shruti Malviya,shruti.malviya@aivi.ac.in,EN2026045,ME,2027,B,9876543254,7.7
Tushar Agrawal,tushar.agrawal@aivi.ac.in,EN2026046,CSE,2026,A,9876543255,9.2
Parul Mittal,parul.mittal@aivi.ac.in,EN2026047,IT,2026,B,9876543256,8.8
Chetan Rajput,chetan.rajput@aivi.ac.in,EN2026048,ECE,2026,A,9876543257,7.4
Lavanya Murthy,lavanya.murthy@aivi.ac.in,EN2026049,CE,2027,C,9876543258,8.2
Abhay Nair,abhay.nair@aivi.ac.in,EN2026050,CSE,2026,B,9876543259,8.7
`;

const STANDARD_FIELDS = [
  { key: "name", label: "Student Name", required: true },
  { key: "email", label: "Email Address", required: true },
  { key: "enrollment_no", label: "Enrollment No.", required: true },
  { key: "branch", label: "Branch / Dept", required: true },
  { key: "batch", label: "Batch Year", required: true },
  { key: "section", label: "Section", required: false },
  { key: "phone", label: "Phone Number", required: false },
  { key: "cgpa", label: "CGPA", required: false },
];

import { useAuth } from "@/contexts/AuthContext";

export default function StudentImportWizard() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvBase64, setCsvBase64] = useState<string>("");
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [dryRun, setDryRun] = useState<boolean>(true);

  const [validating, setValidating] = useState<boolean>(false);
  const [dryRunReport, setDryRunReport] = useState<ImportJobData | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [liveReport, setLiveReport] = useState<ImportJobData | null>(null);
  const [importProgress, setImportProgress] = useState<{
    percent: number;
    processed: number;
    total: number;
    created: number;
    linked: number;
    currentChunk: number;
    totalChunks: number;
  }>({
    percent: 0,
    processed: 0,
    total: 0,
    created: 0,
    linked: 0,
    currentChunk: 0,
    totalChunks: 0,
  });

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_student_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10 MB limit.");
      return;
    }

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const base64 = btoa(unescape(encodeURIComponent(content)));
      setCsvBase64(base64);

      // Simple header & preview extraction
      const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
        setDetectedHeaders(headers);

        const defaultMap: Record<string, string> = {};
        STANDARD_FIELDS.forEach(f => {
          const match = headers.find(h => h.toLowerCase() === f.key || h.toLowerCase().includes(f.key));
          if (match) defaultMap[f.key] = match;
        });
        setColumnMap(defaultMap);

        const sampleRows = lines.slice(1, 6).map(l => l.split(",").map(cell => cell.trim().replace(/^"|"$/g, "")));
        setPreviewRows(sampleRows);
      }
    };
    reader.readAsText(file);
  };

  const handleRunValidation = async () => {
    if (!csvBase64) return;
    setValidating(true);
    try {
      const report = await importStudentsCsv({
        csvBase64,
        columnMap,
        dryRun: true,
      });
      setDryRunReport(report);
      setStep(3);
      if (report.totals.failed > 0 && report.totals.valid === 0) {
        toast.error(`All ${report.totals.failed} rows failed validation. Inspect error diagnostics below.`);
      } else if (report.totals.failed > 0) {
        toast.warning(`Validation complete with ${report.totals.failed} row errors. ${report.totals.valid} valid rows ready to import.`);
      } else {
        toast.success(`Validation complete! All ${report.totals.valid} rows are valid and ready to import.`);
      }
    } catch (err: any) {
      console.error("Dry-run validation error:", err);
      toast.error(err?.message || "Failed to validate CSV with cloud service. Please check column mappings and data format.");
    } finally {
      setValidating(false);
    }
  };

  const handleExecuteLiveImport = async () => {
    if (!csvBase64) return;
    setImporting(true);

    const totalValid = dryRunReport?.totals.valid || 0;
    const estChunks = Math.max(1, Math.ceil(totalValid / 125));
    setImportProgress({
      percent: 5,
      processed: 0,
      total: totalValid,
      created: 0,
      linked: 0,
      currentChunk: 1,
      totalChunks: estChunks,
    });

    const targetJobId = dryRunReport?.jobId;
    let unsubscribe: (() => void) | null = null;
    let pollInterval: any = null;

    if (targetJobId) {
      // 1. Subscribe to real-time Firestore updates
      try {
        const { doc, onSnapshot } = await import("firebase/firestore");
        const { getDb } = await import("@/integrations/firebase/client");
        const db = getDb();
        unsubscribe = onSnapshot(doc(db, "import_jobs", targetJobId), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data?.progress) {
              setImportProgress({
                percent: Math.min(100, Math.max(5, data.progress.percent || 0)),
                processed: data.progress.processed || 0,
                total: data.progress.total || totalValid,
                created: data.progress.created || 0,
                linked: data.progress.linked || 0,
                currentChunk: data.progress.currentChunk || 1,
                totalChunks: data.progress.totalChunks || estChunks,
              });
            }
          }
        });
      } catch (subErr) {
        console.warn("[StudentImportWizard] Real-time listener engaging polling fallback:", subErr);
      }

      // 2. Resilient backup polling every 3.5 seconds
      pollInterval = setInterval(async () => {
        try {
          const latestJob = await getImportJob(targetJobId);
          if (latestJob?.progress) {
            setImportProgress({
              percent: Math.min(100, Math.max(5, latestJob.progress.percent || 0)),
              processed: latestJob.progress.processed || 0,
              total: latestJob.progress.total || totalValid,
              created: latestJob.progress.created || 0,
              linked: latestJob.progress.linked || 0,
              currentChunk: latestJob.progress.currentChunk || 1,
              totalChunks: latestJob.progress.totalChunks || estChunks,
            });
          }
        } catch {}
      }, 3500);
    }

    try {
      const report = await importStudentsCsv({
        csvBase64,
        columnMap,
        dryRun: false,
        jobId: targetJobId,
      });
      setImportProgress(prev => ({ ...prev, percent: 100, processed: totalValid }));
      setLiveReport(report);
      setStep(4);
      if (report.totals.failed > 0 && report.totals.created === 0 && report.totals.linked === 0) {
        toast.error(`Live import completed with 0 successful accounts and ${report.totals.failed} failed rows.`);
      } else {
        toast.success(`Student import completed successfully! ${report.totals.created} accounts provisioned in Cloud database.`);
      }
    } catch (err: any) {
      console.error("Live import execution error:", err);
      toast.error(err?.message || "Failed to execute live student import. Please check connection and try again.");
    } finally {
      if (unsubscribe) unsubscribe();
      if (pollInterval) clearInterval(pollInterval);
      setImporting(false);
    }
  };

  const handleDownloadCredentialsCSV = () => {
    if (!csvBase64) return;
    try {
      const decoded = decodeURIComponent(escape(atob(csvBase64)));
      const lines = decoded.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim().length > 0);
      if (lines.length < 2) return;

      const portalSlug = tenant?.slug || tenant?.id || "sunrise";
      const loginUrl = `https://aivicampus.com/campus/login/${portalSlug}`;

      let credCsv = "Student Name,Email,Enrollment No,Branch,Batch,Campus Login URL,Status\n";
      const dataLines = lines.slice(1);
      dataLines.forEach((line) => {
        const parts = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
        const name = parts[0] || "";
        const email = parts[1] || "";
        const enroll = parts[2] || "";
        const branch = parts[3] || "";
        const batch = parts[4] || "";
        credCsv += `"${name.replace(/"/g, '""')}","${email}","${enroll}","${branch}","${batch}","${loginUrl}","Provisioned"\n`;
      });

      const blob = new Blob([credCsv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_credentials_roster_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Credentials roster CSV downloaded successfully!");
    } catch (e) {
      console.error("Error generating credentials CSV:", e);
      toast.error("Failed to generate credentials CSV.");
    }
  };

  const downloadErrorReportCSV = (errors: RowError[]) => {
    let csv = "Row,Student Name,Email,Reason\n";
    errors.forEach(e => {
      csv += `"${e.rowNumber}","${e.studentName.replace(/"/g, '""')}","${e.email}","${e.reason.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `import_errors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Student Import</h1>
          <p className="text-muted-foreground">Import student rosters, create accounts, and dispatch onboarding invites.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/campus/history")}>
            <Layers className="h-4 w-4 mr-2" />
            Import History
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSample}>
            <Download className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
        </div>
      </div>

      {/* Wizard Progress Header */}
      <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-4">
        {[
          { stepNum: 1, title: "1. Upload File" },
          { stepNum: 2, title: "2. Map Columns" },
          { stepNum: 3, title: "3. Validate & Report" },
          { stepNum: 4, title: "4. Complete Import" },
        ].map((s) => (
          <div
            key={s.stepNum}
            className={`flex items-center justify-center p-2 text-sm font-medium rounded-md transition-colors ${
              step === s.stepNum
                ? "bg-primary text-primary-foreground font-semibold"
                : step > s.stepNum
                ? "bg-muted text-foreground"
                : "text-muted-foreground opacity-50"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* STEP 1: Upload File */}
      {step === 1 && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Step 1: Upload CSV File</CardTitle>
            <CardDescription>Select a .csv file containing student records (up to 10 MB).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-12 text-center cursor-pointer bg-background/50 hover:bg-background/80 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">Click to select CSV file or drag and drop here</p>
              <p className="text-xs text-muted-foreground mt-2">Required fields: Name, Email, Enrollment No, Branch, Batch</p>
              {csvFile && (
                <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  <FileSpreadsheet className="h-4 w-4" />
                  {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={() => navigate("/campus/students")}>Cancel</Button>
              <Button disabled={!csvFile} onClick={() => setStep(2)}>
                Next: Map Columns
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Map Columns */}
      {step === 2 && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Step 2: Map Columns</CardTitle>
            <CardDescription>Match standard AIVI Campus fields with the column headers from your uploaded CSV.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STANDARD_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1.5 border border-border/40 p-3 rounded-lg bg-background/50">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-sm">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    <Badge variant={field.required ? "default" : "outline"} className="text-xs">
                      {field.required ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={columnMap[field.key] || ""}
                    onChange={(e) => setColumnMap({ ...columnMap, [field.key]: e.target.value })}
                  >
                    <option value="">-- Select CSV Header --</option>
                    {detectedHeaders.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {previewRows.length > 0 && (
              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-semibold">CSV Sample Preview (First 5 Rows)</h4>
                <div className="overflow-x-auto border border-border/40 rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {detectedHeaders.map((h, i) => (
                          <TableHead key={i} className="text-xs">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((row, rIdx) => (
                        <TableRow key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <TableCell key={cIdx} className="text-xs">{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleRunValidation} disabled={validating}>
                {validating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Validation...
                  </>
                ) : (
                  <>
                    Run Dry-Run Validation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Validate & Dry-Run Report */}
      {step === 3 && dryRunReport && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Step 3: Validation & Dry-Run Report</span>
              <Badge variant={dryRun ? "outline" : "destructive"}>
                {dryRun ? "Dry Run Mode (Safe Preview)" : "Live Mode (Database Writes)"}
              </Badge>
            </CardTitle>
            <CardDescription>Review validation statistics and row error diagnostics before executing the live import.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-border/40 p-4 rounded-xl bg-background/50 text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Rows</p>
                <p className="text-2xl font-bold mt-1">{dryRunReport.totals.rows}</p>
              </div>
              <div className="border border-green-500/30 p-4 rounded-xl bg-green-500/5 text-center">
                <p className="text-xs text-green-500 uppercase font-semibold">Valid & Ready</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{dryRunReport.totals.valid}</p>
                <span className="text-xs text-muted-foreground">({dryRunReport.totals.created} New / {dryRunReport.totals.linked} Linked)</span>
              </div>
              <div className="border border-yellow-500/30 p-4 rounded-xl bg-yellow-500/5 text-center">
                <p className="text-xs text-yellow-500 uppercase font-semibold">Skipped / Duplicates</p>
                <p className="text-2xl font-bold text-yellow-500 mt-1">{dryRunReport.totals.skipped}</p>
              </div>
              <div className="border border-red-500/30 p-4 rounded-xl bg-red-500/5 text-center">
                <p className="text-xs text-red-500 uppercase font-semibold">Failed Rows</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{dryRunReport.totals.failed}</p>
              </div>
            </div>

            {/* Error diagnostics table */}
            {dryRunReport.rowErrors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Row Error Diagnostics ({dryRunReport.rowErrors.length} errors)
                  </h4>
                  <Button variant="outline" size="sm" onClick={() => downloadErrorReportCSV(dryRunReport.rowErrors)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Error CSV
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto border border-border/40 rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Row</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Error Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dryRunReport.rowErrors.slice(0, 50).map((err, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{err.rowNumber}</TableCell>
                          <TableCell className="text-xs">{err.studentName || "-"}</TableCell>
                          <TableCell className="text-xs font-mono">{err.email || "-"}</TableCell>
                          <TableCell className="text-xs text-destructive">{err.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Live Real-time Progress Bar & Chunk Telemetry */}
            {importing && (
              <div className="p-5 border border-primary/30 rounded-xl bg-primary/5 space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm">Provisioning Student Accounts (asia-south1 Mumbai)</h4>
                      <p className="text-xs text-muted-foreground">
                        Secure sovereign database writes · Chunk {importProgress.currentChunk} of {importProgress.totalChunks || 1}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs w-fit">
                    {importProgress.percent}% Completed
                  </Badge>
                </div>

                <Progress value={importProgress.percent} className="h-2.5 bg-primary/10" />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-background/80 p-2.5 rounded-lg border border-border/40">
                    <span className="text-muted-foreground block text-[11px]">Processed Roster</span>
                    <span className="font-semibold text-sm">{importProgress.processed} / {dryRunReport.totals.valid}</span>
                  </div>
                  <div className="bg-background/80 p-2.5 rounded-lg border border-border/40">
                    <span className="text-muted-foreground block text-[11px]">New Accounts</span>
                    <span className="font-semibold text-sm text-green-500">+{importProgress.created} Created</span>
                  </div>
                  <div className="bg-background/80 p-2.5 rounded-lg border border-border/40 col-span-2 sm:col-span-1">
                    <span className="text-muted-foreground block text-[11px]">Existing Linked</span>
                    <span className="font-semibold text-sm text-blue-500">+{importProgress.linked} Linked</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground text-center">
                  ⚡ Do not close this browser window. Accounts are being created with custom claims and credentials in Google Cloud.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Column Map
              </Button>
              <Button onClick={handleExecuteLiveImport} disabled={importing || dryRunReport.totals.valid === 0}>
                {importing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Executing Live Import...
                  </>
                ) : (
                  <>
                    Proceed with Live Import ({dryRunReport.totals.valid} Students)
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Import Complete */}
      {step === 4 && liveReport && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-6 w-6" />
              Live Import Complete!
            </CardTitle>
            <CardDescription>Accounts have been provisioned and email invitations have been dispatched.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-border/40 p-4 rounded-xl bg-background/50 text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Processed</p>
                <p className="text-2xl font-bold mt-1">{liveReport.totals.rows}</p>
              </div>
              <div className="border border-green-500/30 p-4 rounded-xl bg-green-500/5 text-center">
                <p className="text-xs text-green-500 uppercase font-semibold">Created Accounts</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{liveReport.totals.created}</p>
              </div>
              <div className="border border-blue-500/30 p-4 rounded-xl bg-blue-500/5 text-center">
                <p className="text-xs text-blue-500 uppercase font-semibold">Linked Accounts</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">{liveReport.totals.linked}</p>
              </div>
              <div className="border border-red-500/30 p-4 rounded-xl bg-red-500/5 text-center">
                <p className="text-xs text-red-500 uppercase font-semibold">Skipped / Failed</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{liveReport.totals.failed}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate("/campus/history")}>
                View Import History
              </Button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handleDownloadCredentialsCSV} className="flex-1 sm:flex-initial">
                  <Download className="h-4 w-4 mr-2" />
                  Credentials Roster (CSV)
                </Button>
                <Button onClick={() => navigate("/campus/students")} className="flex-1 sm:flex-initial">
                  Go to Students Directory
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
