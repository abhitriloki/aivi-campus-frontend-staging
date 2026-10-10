import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Bell,
  Download,
  Plus,
  Share2,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import {
  createAnnouncement,
  createCampusEvent,
  getEventIcsFile,
  generateParentProgressReport,
} from "@/services/tenantService";
import CampusLeaderboard from "@/components/campus/CampusLeaderboard";

export default function CampusCalendar() {
  const { user, tenant } = useAuth();
  const { activeTenantId } = useTenantBranding();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement State
  const [ancOpen, setAncOpen] = useState(false);
  const [ancTitle, setAncTitle] = useState("");
  const [ancBody, setAncBody] = useState("");
  const [ancBatch, setAncBatch] = useState("ALL");
  const [ancBranch, setAncBranch] = useState("ALL");
  const [submittingAnc, setSubmittingAnc] = useState(false);

  // Parent Report State
  const [reportLocale, setReportLocale] = useState<"hi" | "en">("hi");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any | null>(null);

  const effectiveTenantId = activeTenantId || tenant.tenantId;

  const fetchData = async () => {
    if (!effectiveTenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();
      if (!db) return;

      const ancSnap = await getDocs(
        query(
          collection(db, "campus_announcements"),
          where("tenantId", "==", effectiveTenantId),
          orderBy("createdAt", "desc")
        )
      );
      setAnnouncements(ancSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const evtSnap = await getDocs(
        query(
          collection(db, "campus_events"),
          where("tenantId", "==", effectiveTenantId),
          orderBy("startDate", "asc")
        )
      );
      setEvents(evtSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [effectiveTenantId]);

  const handleCreateAnnouncement = async () => {
    if (!ancTitle.trim() || !ancBody.trim()) {
      toast.error("Title and body required");
      return;
    }
    setSubmittingAnc(true);
    try {
      await createAnnouncement({
        title: ancTitle,
        body: ancBody,
        targetBatch: ancBatch,
        targetBranch: ancBranch,
      });

      toast.success("Announcement broadcasted and emails enqueued!");
      setAncOpen(false);
      setAncTitle("");
      setAncBody("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create announcement");
    } finally {
      setSubmittingAnc(false);
    }
  };

  const handleDownloadIcs = async (eventId: string) => {
    try {
      const res = await getEventIcsFile(eventId);
      const blob = new Blob([res.icsContent], { type: "text/calendar;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campus_event_${eventId}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(".ics Calendar event downloaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to download .ics");
    }
  };

  const handleGenerateParentReport = async () => {
    if (!user?.uid) return;
    setGeneratingReport(true);
    try {
      const res = await generateParentProgressReport({
        userId: user.uid,
        locale: reportLocale,
      });

      setReportResult(res);
      toast.success(`Parent Progress Report (${reportLocale.toUpperCase()}) generated!`);
    } catch (err: any) {
      toast.error(err.message || "Parent report generation failed");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Calendar & Engagement Center</h1>
          <p className="text-muted-foreground">Announcements broadcast, .ics event sync, parent progress reports & leaderboards.</p>
        </div>

        <Dialog open={ancOpen} onOpenChange={setAncOpen}>
          <DialogTrigger asChild>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Compose Announcement
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Compose Campus Broadcast Announcement</DialogTitle>
              <DialogDescription>Delivers via email queue and student in-app bell notification.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Title</label>
                <Input className="mt-1" placeholder="e.g. TCS Ninja Technical Round Instructions" value={ancTitle} onChange={(e) => setAncTitle(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Announcement Body</label>
                <Textarea className="mt-1" placeholder="Write full details..." rows={4} value={ancBody} onChange={(e) => setAncBody(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Target Batch</label>
                  <select className="w-full mt-1 p-2 bg-card border border-border rounded-lg text-xs" value={ancBatch} onChange={(e) => setAncBatch(e.target.value)}>
                    <option value="ALL">All Batches</option>
                    <option value="2025">Batch 2025</option>
                    <option value="2026">Batch 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Target Branch</label>
                  <select className="w-full mt-1 p-2 bg-card border border-border rounded-lg text-xs" value={ancBranch} onChange={(e) => setAncBranch(e.target.value)}>
                    <option value="ALL">All Branches</option>
                    <option value="CSE">CSE Branch</option>
                    <option value="ECE">ECE Branch</option>
                    <option value="ME">Mechanical</option>
                  </select>
                </div>
              </div>

              <Button className="w-full mt-2" disabled={submittingAnc} onClick={handleCreateAnnouncement}>
                {submittingAnc ? "Broadcasting..." : "Send Announcement Broadcast"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Parent Progress Report Signature Feature Card */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/10 via-card to-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-1">Signature Engagement Feature</Badge>
            <h3 className="text-xl font-bold">Monthly Parent Progress Report (Hindi / English PDF)</h3>
            <p className="text-xs text-muted-foreground">Generate 1-page parent progress card with 72h WhatsApp deep-link & Devanagari text.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="p-2 bg-card border border-border rounded-xl text-xs font-bold"
              value={reportLocale}
              onChange={(e: any) => setReportLocale(e.target.value)}
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>

            <Button disabled={generatingReport} onClick={handleGenerateParentReport}>
              <Sparkles className="h-4 w-4 mr-2" />
              {generatingReport ? "Generating..." : "Generate Parent Report"}
            </Button>
          </div>
        </div>

        {reportResult && (
          <div className="p-4 bg-muted/20 border border-border/50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-green-500">Report Generated Successfully! Token: {reportResult.publicToken}</span>
              <a href={reportResult.downloadUrl} download target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  PDF Download
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a href={reportResult.whatsAppDeepLink} target="_blank" rel="noreferrer" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share via WhatsApp (72-Hour Link)
                </Button>
              </a>
            </div>
          </div>
        )}
      </Card>

      {/* Events Calendar Section */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Upcoming Placement Drives & Campus Events</CardTitle>
          <CardDescription>Click `.ics` to sync placement drive deadlines directly into Google Calendar or Apple Calendar.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Sync Calendar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                      No upcoming custom campus events created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-bold text-xs">
                        {e.title}
                        <span className="block text-muted-foreground font-normal">{e.description}</span>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="uppercase">{e.eventType}</Badge></TableCell>
                      <TableCell className="text-xs font-semibold">{new Date(e.startDate).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{e.location}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadIcs(e.id)}>
                          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                          .ics Sync
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

      {/* Announcements Feed Section */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Broadcast Announcements ({announcements.length})</CardTitle>
          <CardDescription>Live student read receipt tracking.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title & Message</TableHead>
                  <TableHead>Targets</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead className="text-right">Read Receipts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-bold text-xs">
                      {a.title}
                      <span className="block text-muted-foreground font-normal mt-0.5">{a.body}</span>
                    </TableCell>
                    <TableCell className="text-xs">
                      Batch: {a.targetBatch} | Branch: {a.targetBranch}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {a.readCount || 0} Students Read
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Campus Leaderboard Component */}
      <CampusLeaderboard />
    </div>
  );
}
