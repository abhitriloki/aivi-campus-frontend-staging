import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserCheck, UserPlus, ShieldAlert, RefreshCw, Layers, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getTenantStaff, inviteCoordinator, deactivateStaff, StaffMember } from "@/services/tenantService";

export default function StaffManagement() {
  const { tenant, user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal state
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [branchScopeInput, setBranchScopeInput] = useState("CSE");
  const [roleScope, setRoleScope] = useState<"coordinator" | "placement_director">("coordinator");
  const [inviting, setInviting] = useState(false);

const DEFAULT_DEMO_STAFF: StaffMember[] = [
  { uid: "st1", email: "tpo@sunrise.ac.in", fullName: "Dr. Rajesh Sharma", role: "placement_director", branchScope: [], active: true, createdAt: new Date().toISOString() },
  { uid: "st2", email: "ankit.verma@sunrise.ac.in", fullName: "Prof. Ankit Verma", role: "coordinator", branchScope: ["CSE"], active: true, createdAt: new Date().toISOString() },
  { uid: "st3", email: "sunita.rao@sunrise.ac.in", fullName: "Dr. Sunita Rao", role: "coordinator", branchScope: ["ECE"], active: true, createdAt: new Date().toISOString() },
  { uid: "st4", email: "vikram.m@sunrise.ac.in", fullName: "Prof. Vikram Malhotra", role: "coordinator", branchScope: ["ME", "CE"], active: true, createdAt: new Date().toISOString() },
];

  const fetchStaff = async () => {
    setLoading(true);
    const isDemo = tenant.tenantId === "demo-sunrise" || tenant.tenantId === "demo-campus-001";
    try {
      const res = await getTenantStaff();
      if (res && res.staff && res.staff.length > 0) {
        setStaff(res.staff);
      } else if (isDemo) {
        setStaff(DEFAULT_DEMO_STAFF);
      } else {
        setStaff([]);
      }
    } catch (err: any) {
      console.warn("Using staff roster fallback:", err);
      if (isDemo) {
        setStaff(DEFAULT_DEMO_STAFF);
      } else {
        setStaff([]);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) {
      toast.error("Name and email are required.");
      return;
    }

    if (inviteEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      toast.error("Self-demotion prevented: You cannot invite your own administrative account as a coordinator.");
      return;
    }

    const branchScope = branchScopeInput === "ALL"
      ? []
      : branchScopeInput
          .split(",")
          .map((b) => b.trim().toUpperCase())
          .filter(Boolean);

    setInviting(true);
    try {
      const res = await inviteCoordinator({
        name: inviteName,
        email: inviteEmail,
        branchScope,
      });
      if (res && res.emailDispatched === false) {
        toast.warning(`Staff coordinator added! However, invitation email could not be confirmed. Please share credentials directly.`);
      } else {
        toast.success(`Coordinator invitation and credentials dispatched to ${inviteEmail}`);
      }
      setInviteOpen(false);
      setInviteName("");
      setInviteEmail("");
      fetchStaff();
    } catch (err: any) {
      toast.error(err.message || "Failed to invite coordinator");
    } finally {
      setInviting(false);
    }
  };

  const handleDeactivate = async (uid: string, name: string) => {
    if (uid === user?.uid) {
      toast.error("You cannot deactivate your own administrative account.");
      return;
    }

    if (!confirm(`Are you sure you want to deactivate ${name}? Their staff access will be revoked immediately.`)) {
      return;
    }

    try {
      await deactivateStaff(uid);
      toast.success(`Staff member ${name} deactivated.`);
      fetchStaff();
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate staff member");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage TPO Directors, Placement Coordinators, and branch scope access control.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold shadow-md cursor-pointer">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Placement Coordinator
        </Button>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Institutional Staff Roster
            </CardTitle>
            <CardDescription>Authorized staff members with access to your campus placement portal.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchStaff} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-border rounded-xl">
              <UserCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-lg">No staff members found</p>
              <p className="text-sm text-muted-foreground mt-1">Invite placement coordinators to assist with drive management.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border/40 rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned Branch Scope</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.memberId}>
                      <TableCell className="font-semibold">{member.name}</TableCell>
                      <TableCell className="font-mono text-xs">{member.email}</TableCell>
                      <TableCell>
                        <Badge variant={member.role === "tenant_admin" ? "default" : "outline"} className="capitalize">
                          {member.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.branchScope.length === 0 ? (
                          <span className="text-xs text-muted-foreground">All Branches (Global)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {member.branchScope.map((b) => (
                              <Badge key={b} variant="secondary" className="text-[10px]">
                                {b}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "default" : "destructive"}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {member.role === "tenant_admin" ? (
                          <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 bg-emerald-50 font-bold">
                            <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" />
                            Primary Admin
                          </Badge>
                        ) : member.uid === user?.uid || member.email?.toLowerCase() === user?.email?.toLowerCase() ? (
                          <span className="text-[11px] text-muted-foreground font-medium">You</span>
                        ) : member.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeactivate(member.uid, member.name)}
                          >
                            <ShieldAlert className="h-4 w-4 mr-1" />
                            Deactivate
                          </Button>
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

      {/* Invite Coordinator Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md bg-white border-[#E6E1D6]">
          <form onSubmit={handleInviteSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold text-[#101820] flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#2D8B86]" />
                Invite Placement Coordinator
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-[#53606A]">
                Grant institutional staff portal access with branch-level or full campus permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">1. Full Name</label>
                <Input
                  placeholder="e.g. Prof. Rajesh Kumar"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">2. Institutional Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. rajesh.kumar@institution.edu.in"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                  required
                />
                {inviteEmail && user?.email && inviteEmail.trim().toLowerCase() === user.email.toLowerCase() && (
                  <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[11.5px] leading-relaxed text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="block font-bold text-amber-950 mb-0.5">Self-Demotion Prevented:</strong>
                      This email matches your currently signed-in Primary TPO Admin account. You cannot invite or convert your own account into a coordinator.
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">3. Assigned Academic Branch</label>
                <select
                  className="w-full p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820] focus:border-[#2D8B86]"
                  value={branchScopeInput}
                  onChange={(e) => setBranchScopeInput(e.target.value)}
                >
                  <option value="CSE">Computer Science Engineering (CSE)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                  <option value="CSE, ECE">CSE & ECE Joint Scope</option>
                  <option value="ALL">All Academic Branches (Full Scope)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">4. Role Scope / Access Tier</label>
                <select
                  className="w-full p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820] focus:border-[#2D8B86]"
                  value={roleScope}
                  onChange={(e: any) => setRoleScope(e.target.value)}
                >
                  <option value="coordinator">Placement Coordinator (Branch Scope Restricted)</option>
                  <option value="placement_director">Placement Officer / Director (Full Campus Access)</option>
                </select>
              </div>

              <div className="rounded-xl border border-[#2D8B86]/20 bg-[#2D8B86]/[0.06] p-3 text-[11.5px] leading-relaxed text-[#143E3B]">
                <strong className="block font-bold text-[#1C6B68] mb-0.5">💡 How the coordinator logs in:</strong>
                They will receive an invitation email. They can sign in directly using <strong>&quot;Sign in with Google Workspace&quot;</strong> with this institutional email, or click <strong>&quot;Forgot Password&quot;</strong> on the Campus Login page to set their password.
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)} className="text-xs font-bold border-[#E6E1D6]">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={inviting || !!(inviteEmail && user?.email && inviteEmail.trim().toLowerCase() === user.email.toLowerCase())}
                className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-extrabold text-xs shadow-md disabled:opacity-50"
              >
                {inviting ? "Sending Invitation..." : "Send Invitation & Access Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
