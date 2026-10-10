import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";

export default function DpaPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <LegalHeaderFooterWrapper>
      <div className="p-6 max-w-4xl mx-auto space-y-6 w-full py-10 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] !text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md border border-[#334155] transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-[#60A5FA]" />
              <span>Print / Save DPA PDF</span>
            </button>
          </div>
        </div>

        <Card className="border-slate-200 bg-white p-8 space-y-6 shadow-sm">
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-1">DPDP 2023 Aligned</Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Institutional Data Processing Agreement (DPA)</h1>
            <p className="text-sm text-slate-500">Standard Legal Data Processing Addendum for Indian Colleges & Universities.</p>
          </div>

          {/* Roles */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Controller & Processor Roles</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under the Digital Personal Data Protection (DPDP) Act 2023 of India:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>Data Fiduciary / Controller:</strong> The Partner Institution (College/University TPO Cell) which collects student data for placement operations.</li>
              <li><strong>Data Processor:</strong> AIVI Intelligence Private Limited, operating the AIVI Campus AI Career Intelligence OS platform.</li>
            </ul>
          </div>

          {/* Sub-processors */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Authorized Sub-Processors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Google Cloud Platform (GCP)</strong>
                <p className="text-slate-500 mt-0.5">Firebase Auth & Firestore database hosting in asia-south1 (Mumbai, India).</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Sarvam AI</strong>
                <p className="text-slate-500 mt-0.5">Vernacular voice & speech processing (audio processed in live memory, transcript only saved).</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Hostinger Infrastructure</strong>
                <p className="text-slate-500 mt-0.5">Secure web application server hosting and edge delivery.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>Razorpay Software Pvt Ltd</strong>
                <p className="text-slate-500 mt-0.5">Commercial tax invoicing & payment gateway webhooks.</p>
              </div>
            </div>
          </div>

          {/* Retention & Purge */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Data Retention & Dual-Confirmation Purge</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student personal data is retained during the active contract period. Upon contract termination:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li>A <strong>90-day grace clock</strong> is initiated during which data remains read-only.</li>
              <li>After 90 days, a <code>purgeTenantData</code> operation with dual platform-admin key confirmation permanently deletes all Firestore documents, Storage exports, and Auth records.</li>
              <li>Graduated student batches are cold-archived to encrypted Cloud Storage upon institutional request.</li>
            </ul>
          </div>

          {/* Student Rights & Grievance */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">4. Student DPDP Rights & Grievance Redressal</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students retain the right to review, update, or request deletion of their personal career documents.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-900">Grievance Redressal Officer:</p>
              <p className="text-slate-600">Email: hello@aivilabs.com | AIVI Intelligence Legal & Compliance Cell</p>
            </div>
          </div>
        </Card>
      </div>
    </LegalHeaderFooterWrapper>
  );
}
