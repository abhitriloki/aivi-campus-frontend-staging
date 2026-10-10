import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, FileCheck, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";

/**
 * LEGAL NOTICE: DRAFT PREPARED FOR STATUTORY DPDP ACT 2023 COMPLIANCE
 * NOTE: SUBJECT TO FINAL REVIEW BY ADVOCATE / DATA PROTECTION OFFICER (DPO).
 */

export default function Terms() {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Terms of Service & Data Protection | AIVI Campus — DPDP Aligned</title>
        <meta
          name="description"
          content="Terms of Service and statutory Data Protection terms for AIVI Campus under India's DPDP Act 2023. Governs institutional campus licensing, student data protection, and platform usage."
        />
        <link rel="canonical" href="https://aivicampus.com/terms" />
      </Helmet>

      <div className="p-6 max-w-4xl mx-auto space-y-6 w-full py-10 text-slate-900">
        {/* Header Back Link */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>
          <Link to="/privacy" className="text-xs font-semibold text-teal-700 hover:underline">
            Read Privacy Notice →
          </Link>
        </div>

        <Card className="border-slate-200 bg-white p-8 md:p-10 space-y-8 shadow-sm rounded-2xl">
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold px-2.5 py-0.5">
                DPDP Act 2023 Aligned
              </Badge>
              <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-[11px]">
                Effective Date: 16 September 2026 · Version 2.0
              </Badge>
              <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px]">
                Draft: Marked for Legal Counsel Review
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Terms & Conditions of Service
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              These Terms & Conditions govern institutional access, student accounts, and data processing across the AIVI Campus Operating System, operated by <strong>AIVI Intelligence Private Limited</strong> (CIN: U62099UP2026PTC249169).
            </p>
          </div>

          {/* Section 1: Platform Usage & Ownership */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-teal-600" />
              1. Platform Usage & Ownership
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AIVI Campus is designed and operated by <strong>AIVI Intelligence Private Limited</strong>. By accessing or deploying AIVI Campus across an educational institution, participating colleges, universities, Training & Placement Officers (TPOs), faculty coordinators, and students agree to provide accurate information and use the platform strictly for legitimate career development, placement automation, accreditation evidence preparation, and institutional governance. Unauthorized access, account credential sharing, automated scraping, or reverse-engineering platform algorithms is strictly prohibited.
            </p>
          </div>

          {/* Section 2: AI-Generated Content Disclaimer */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. AI-Generated Career Insights & Disclaimer</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AIVI Campus employs artificial intelligence algorithms to evaluate resumes, compute continuous AIVI Employability Scores (AES), analyze job fit alignment, and conduct vernacular voice mock interviews. While models are tuned to industry placement standards, AI outputs are advisory tools designed to supplement, not replace, human institutional mentorship. AIVI does not guarantee employment offers, selection outcomes, or salary packages with third-party recruiting companies.
            </p>
          </div>

          {/* Section 3: Subscriptions & Campus Licensing */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Subscriptions & Institutional Campus Licensing</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Institutional B2B campus licenses are governed by formal service agreements executed between AIVI Intelligence Private Limited and the partner college or university trust. Licenses cover specified student seat allocations, placement modules, and accreditation tools. Fee schedules, billing cycles, and invoice settlements are processed via authorized payment gateway partners (Razorpay) or official institutional purchase orders.
            </p>
          </div>

          {/* Section 4: Data Protection & DPDP Act 2023 Clause */}
          <div className="space-y-4 p-5 rounded-2xl bg-teal-50/60 border border-teal-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              4. Data Protection & Institutional Fiduciary Clause (DPDP Act 2023)
            </h2>
            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Statutory Compliance:</strong> Both parties agree to strictly adhere to the provisions of the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
              </p>
              <p>
                <strong>Fiduciary & Processor Roles:</strong> For all student data uploaded by the college (including roster CSVs, enrollment numbers, academic marks, and department records), the participating institution is the <strong>Data Fiduciary</strong> that has collected lawful student consent. AIVI acts as the authorized <strong>Data Processor</strong> processing such data solely pursuant to the institution's instructions and the <Link to="/dpa" className="text-teal-800 font-bold underline">Data Processing Addendum (DPA)</Link>.
              </p>
              <p>
                <strong>Strict Purpose Limitation:</strong> Student personal data, uploaded resumes, and interview responses shall NEVER be sold, rented, monetized, or shared with third-party advertisers. Data shall NOT be used to train public generative AI foundational models.
              </p>
              <p>
                <strong>Security & Data Residency:</strong> All institutional and student personal data is stored strictly within sovereign Indian territory at Google Cloud Platform, Mumbai Region (<code className="text-xs bg-white px-1 py-0.5 rounded border border-teal-200">asia-south1</code>), protected by AES-256 encryption at rest and TLS 1.3 encryption in transit.
              </p>
              <p>
                <strong>Erasure & Data Rights:</strong> In compliance with Section 12 of the DPDP Act, students and institutions may at any time exercise their statutory rights of access, correction, or erasure via our online <Link to="/data-rights" className="text-teal-800 font-bold underline">Data Rights Portal</Link> or by writing to <a href="mailto:grievance@aivicampus.com" className="text-teal-800 font-bold underline">grievance@aivicampus.com</a>.
              </p>
            </div>
          </div>

          {/* Section 5: Governing Law & Jurisdiction */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Governing Law & Dispute Resolution</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              These Terms of Service and any institutional agreements are governed exclusively by the laws of India. Any legal dispute, claim, or controversy arising out of or relating to platform usage shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gorakhpur, Uttar Pradesh, India</strong>.
            </p>
          </div>

          {/* Section 6: Grievance Officer & Statutory Contact */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-600" />
              6. Grievance Redressal Desk (DPDP Act Section 13)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              For any questions regarding these terms, contractual agreements, or to escalate data protection grievances:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <p><strong>Designated Officer:</strong> Mr. Abhishek Mishra, Data Protection Officer</p>
              <p><strong>Company:</strong> AIVI Intelligence Private Limited</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@aivicampus.com" className="font-semibold text-teal-700 underline">grievance@aivicampus.com</a> (copy: <a href="mailto:hello@aivilabs.com" className="text-teal-700 underline">hello@aivilabs.com</a>)</p>
              <p><strong>SLA:</strong> Acknowledged within 24 hours · Formal resolution within 30 days.</p>
            </div>
          </div>
        </Card>
      </div>
    </LegalHeaderFooterWrapper>
  );
}
