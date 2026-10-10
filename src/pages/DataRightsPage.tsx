import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Clock, FileCheck2, UserX, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";

export default function DataRightsPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "student",
    institution: "",
    requestType: "access_summary",
    description: "",
    declaration: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.description.trim()) {
      toast.error("Please fill all mandatory fields.");
      return;
    }

    if (!form.declaration) {
      toast.error("Please confirm the statutory Data Principal declaration.");
      return;
    }

    setSubmitting(true);
    const trackingId = `REQ-DPDP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const payload = {
      trackingId,
      ...form,
      status: "received",
      submittedAt: new Date().toISOString(),
      statutorySlaDays: 30,
      acknowledgmentDueHours: 24,
    };

    try {
      const { collection, addDoc } = await import("firebase/firestore");
      const { db, functions } = await import("@/integrations/firebase/client");
      const { httpsCallable } = await import("firebase/functions");

      await addDoc(collection(db, "data_rights_requests"), payload);

      // Dispatch alert email to hello@aivilabs.com and grievance desk
      try {
        const sendAlert = httpsCallable(functions, "submitContactForm");
        await sendAlert({
          type: "dpdp_request",
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          institution: form.institution.trim() || undefined,
          subject: `[DPDP Statutory Request: ${form.requestType.toUpperCase()}] ${trackingId} - ${form.fullName}`,
          message: `NEW STATUTORY DATA PRINCIPAL REQUEST (DPDP Act 2023)\n\nTracking ID: ${trackingId}\nRequest Type: ${form.requestType}\nData Principal: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.phone || "N/A"}\nInstitution: ${form.institution || "N/A"}\nRole: ${form.role || "N/A"}\nSubmitted At: ${payload.submittedAt}\nStatutory SLA: 24h ack, 30d resolution.\n\nDescription / Specific Details:\n${form.description || "No additional comments provided."}\n\nAssigned Grievance Officer: Mithlesh Mishra (grievance@aivicampus.com)`,
        });
      } catch (emailErr) {
        console.warn("[DataRights] Alert email dispatch skipped or offline:", emailErr);
      }
    } catch (err) {
      console.warn("[DataRights] Storing offline / fallback:", err);
      try {
        const stored = JSON.parse(localStorage.getItem("aivi_dpdp_requests") || "[]");
        stored.push(payload);
        localStorage.setItem("aivi_dpdp_requests", JSON.stringify(stored));
      } catch {}
    } finally {
      setSubmittedRequest(payload);
      setSubmitting(false);
      toast.success(`Data Rights Request recorded: ${trackingId}`);
    }
  };

  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Data Rights & Erasure Request | AIVI Campus — DPDP Act 2023</title>
        <meta
          name="description"
          content="Submit a statutory Data Principal request under India's DPDP Act 2023. Exercise your Right to Access, Correction, Erasure, or Consent Withdrawal."
        />
        <link rel="canonical" href="https://aivicampus.com/data-rights" />
      </Helmet>

      <div className="p-6 max-w-3xl mx-auto space-y-6 w-full py-10 text-slate-900">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>
          <Link to="/privacy" className="text-xs font-semibold text-teal-700 hover:underline">
            Read Full Privacy Notice →
          </Link>
        </div>

        {submittedRequest ? (
          <Card className="border-emerald-200 bg-white p-8 md:p-10 space-y-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-1">
                  Request Formally Received
                </Badge>
                <h1 className="text-2xl font-extrabold text-slate-900">Statutory Request Acknowledgment</h1>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p><strong>Tracking Reference ID:</strong> <code className="bg-white px-2 py-1 rounded border border-slate-300 font-mono font-bold text-teal-800">{submittedRequest.trackingId}</code></p>
              <p><strong>Data Principal:</strong> {submittedRequest.fullName} ({submittedRequest.email})</p>
              <p><strong>Request Category:</strong> {submittedRequest.requestType.toUpperCase().replace(/_/g, " ")}</p>
              <p><strong>Submission Timestamp:</strong> {new Date(submittedRequest.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
              <p><strong>Statutory SLA:</strong> Acknowledgment within <strong>24 hours</strong>; formal resolution within <strong>30 calendar days</strong>.</p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1.5 leading-relaxed">
              <span className="font-bold block flex items-center gap-1.5 text-teal-950">
                <Clock className="h-4 w-4 text-teal-700" /> What Happens Next?
              </span>
              <p>
                Our Data Protection Officer (DPO) will verify your institutional identity and proceed with processing your request. 
                For erasure requests, a confirmation audit certificate will be transmitted to your email upon permanent removal of database documents.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSubmittedRequest(null)}
                className="text-xs font-bold text-slate-700"
              >
                Submit Another Request
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
              >
                Print / Save Acknowledgment Receipt
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-slate-200 bg-white p-8 md:p-10 space-y-6 shadow-sm rounded-2xl">
            <div className="space-y-2 border-b border-slate-200 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-teal-100 text-teal-800 border-teal-200 font-semibold px-2.5 py-0.5">
                  DPDP Act 2023 Section 11, 12, 13
                </Badge>
                <Badge variant="outline" className="text-slate-600 font-mono text-[11px]">
                  Statutory Rights Portal
                </Badge>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Exercise Your Data Rights
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Under India's Digital Personal Data Protection Act 2023, you have the enforceable right to access, correct, erase, or withdraw consent for your personal data stored on AIVI Campus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Data Principal Full Name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Registered Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. rahul.sharma@college.ac.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Institutional Role
                  </label>
                  <select
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="student">Enrolled Student</option>
                    <option value="alumni">Graduated Student / Alumni</option>
                    <option value="tpo">Training & Placement Officer (TPO)</option>
                    <option value="faculty">Faculty / Department Coordinator</option>
                    <option value="other">Other Campus Stakeholder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    College / Campus Name or Code (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Sunrise Institute of Technology"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className="border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Statutory Right Exercised *
                </label>
                <select
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  value={form.requestType}
                  onChange={(e) => setForm({ ...form, requestType: e.target.value })}
                >
                  <option value="access_summary">Right to Access: Summary of Personal Data & Processing (Section 11)</option>
                  <option value="correction">Right to Correction: Rectify Inaccurate or Outdated Data (Section 12)</option>
                  <option value="erasure">Right to Erasure: Permanently Delete My Account & Stored Data (Section 12)</option>
                  <option value="withdraw_consent">Right to Withdraw Consent: Revoke DPDP Processing Consent (Section 6(4))</option>
                  <option value="grievance">Right of Grievance: Lodge Formal Redressal Complaint (Section 13)</option>
                  <option value="nominate">Right to Nominate: Register Nominee for Incapacity/Death (Section 14)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Details of Your Request *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe your specific request in detail (e.g., specific documents to delete, information to update, or nature of grievance)..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.declaration}
                    onChange={(e) => setForm({ ...form, declaration: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    <strong>Statutory Data Principal Declaration:</strong> I declare that I am the Data Principal associated with the registered email provided, or an authorized legal guardian/representative, making a bona fide request under the Digital Personal Data Protection Act, 2023.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#169C8F] hover:bg-[#128076] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {submitting ? "Submitting Statutory Request..." : "Submit Statutory Data Rights Request"}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p>Direct escalations: <a href="mailto:grievance@aivicampus.com" className="text-teal-700 font-semibold underline">grievance@aivicampus.com</a></p>
              <p>Grievance Officer: Mr. Abhishek Mishra, Data Protection Officer · SLA: 24h ack / 30d resolution.</p>
            </div>
          </Card>
        )}
      </div>
    </LegalHeaderFooterWrapper>
  );
}
