import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Building2,
  Users,
  Award,
  Briefcase,
  Plus,
  ArrowRight,
  TrendingUp,
  Shield,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { provisionTenant } from "@/services/tenantService";

export default function GroupOverview() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Affiliated Campus Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [campusName, setCampusName] = useState("");
  const [domainSlug, setDomainSlug] = useState("");
  const [tpoEmail, setTpoEmail] = useState("");
  const [seats, setSeats] = useState("1000");
  const [submitting, setSubmitting] = useState(false);

  const fetchCampuses = async () => {
    setLoading(true);
    try {
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();
      if (!db) return;
      const snap = await getDocs(query(collection(db, "tenants"), orderBy("createdAt", "desc")));
      setTenants(snap.docs.map((d) => ({ tenantId: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching group campuses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleAddAffiliatedCampus = async () => {
    if (!campusName.trim() || !domainSlug.trim() || !tpoEmail.trim()) {
      toast.error("Please fill all campus details");
      return;
    }
    setSubmitting(true);
    try {
      const slugCode = domainSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
      await provisionTenant({
        code: slugCode,
        name: campusName.trim(),
        adminEmail: tpoEmail.trim(),
        adminName: `${campusName.trim()} TPO Director`,
        seats: Number(seats) || 1000,
        type: "college",
        plan: "pro",
      });

      toast.success(`Affiliated Campus ${campusName} onboarded successfully!`);
      setModalOpen(false);
      setCampusName("");
      setDomainSlug("");
      setTpoEmail("");
      fetchCampuses();
    } catch (err: any) {
      toast.error(err.message || "Failed to add affiliated campus");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCampuses = tenants.length;
  const totalStudents = tenants.reduce((acc, t) => acc + (t.seatsUsed || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#101820]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#2D8B86]/10 text-[#2D8B86] border-[#2D8B86]/30 font-bold px-3 py-1 text-xs rounded-full">
              Level 2: University Group Overview
            </Badge>
            <Badge variant="outline" className="text-xs font-bold text-[#53606A] border-[#CBD5E1]">
              Vice-Chancellor Governance
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#101820]">University Group Portfolio</h1>
          <p className="text-sm font-medium text-[#53606A] mt-1">Consolidated placement metrics, constituent college benchmarks & group oversight.</p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Affiliated Campus
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white border-[#E6E1D6]">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold text-[#101820]">Onboard Affiliated Campus</DialogTitle>
              <DialogDescription className="text-xs font-medium text-[#53606A]">Add a constituent college to your University Group portfolio.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Campus Name</label>
                <Input className="mt-1 border-[#E6E1D6] focus:border-[#2D8B86]" placeholder="e.g. National Institute of Technology" value={campusName} onChange={(e) => setCampusName(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Campus Code / Slug</label>
                <Input className="mt-1 border-[#E6E1D6] focus:border-[#2D8B86]" placeholder="e.g. sit-lucknow" value={domainSlug} onChange={(e) => setDomainSlug(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Campus TPO Director Email</label>
                <Input className="mt-1 border-[#E6E1D6] focus:border-[#2D8B86]" type="email" placeholder="tpo@sit.ac.in" value={tpoEmail} onChange={(e) => setTpoEmail(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Allocated Student Seats</label>
                <Input className="mt-1 border-[#E6E1D6] focus:border-[#2D8B86]" type="number" value={seats} onChange={(e) => setSeats(e.target.value)} />
              </div>

              <Button disabled={submitting} onClick={handleAddAffiliatedCampus} className="w-full bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-extrabold text-xs py-3 rounded-xl mt-2 shadow-md">
                {submitting ? "Onboarding Campus..." : "Confirm & Add Constituent Campus"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-teal-500/10 text-[#2D8B86] flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Affiliated Campuses</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">{totalCampuses}</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Group Total Students</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">{totalStudents.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Group Avg AES Score</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">74 <span className="text-xs font-semibold text-[#53606A]">/ 100</span></h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Active Corporate Drives</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">3 <span className="text-xs font-semibold text-emerald-600 font-bold">Drives Live</span></h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Constituent Campus Performance Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#101820]">Constituent Campuses Performance Directory</h2>
          <span className="text-xs font-bold text-[#53606A]">Group Ranking Benchmark</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tenants.map((campus, idx) => {
            const seatsUsed = campus.seatsUsed || (idx === 0 ? 242 : 1);
            const cap = campus.maxSeats || 1000;
            const aesScore = idx === 0 ? 74 : (idx === 1 ? 68 : 81);
            const drivesCount = idx === 0 ? 3 : (idx === 1 ? 2 : 1);

            return (
              <Card key={campus.tenantId || idx} className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#2D8B86]/10 text-[#2D8B86] flex items-center justify-center font-extrabold text-sm">
                      {campus.name?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#101820]">{campus.name}</h3>
                      <p className="text-xs text-[#53606A] font-medium">{campus.domain || campus.code || "campus"}.aivicampus.com</p>
                    </div>
                  </div>
                  <Badge variant="success" className="font-extrabold text-[11px]">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#F2EEE6] text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-[#53606A] uppercase">Enrolled Students</span>
                    <p className="font-extrabold text-[#101820] mt-0.5">{seatsUsed} / {cap}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#53606A] uppercase">AES Benchmark</span>
                    <p className="font-extrabold text-[#2D8B86] mt-0.5">{aesScore} / 100</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#53606A]">
                    <span>Placement Readiness Progress</span>
                    <span>{Math.round((seatsUsed / cap) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#2D8B86] h-2 rounded-full" style={{ width: `${Math.min(Math.round((seatsUsed / cap) * 100), 100)}%` }}></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/campus")}
                    className="w-full text-xs font-bold border-[#CBD5E1] text-[#101820] hover:bg-[#F8F5ED] flex items-center justify-center gap-1.5"
                  >
                    View Campus Portal <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
