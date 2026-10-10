import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, Lock, FileText, UserCheck, AlertCircle, RefreshCw, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";

/**
 * LEGAL NOTICE: DRAFT PREPARED FOR STATUTORY DPDP ACT 2023 COMPLIANCE
 * NOTE: SUBJECT TO FINAL REVIEW BY ADVOCATE / DATA PROTECTION OFFICER (DPO).
 */

export default function Privacy() {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Privacy Notice | AIVI Campus — DPDP Act 2023 Compliant</title>
        <meta
          name="description"
          content="Statutory Privacy Notice for AIVI Campus under India's Digital Personal Data Protection (DPDP) Act, 2023. Explains data collection, processing purposes, retention, third-party sub-processors, and data principal rights."
        />
        <link rel="canonical" href="https://aivicampus.com/privacy" />
      </Helmet>

      <div className="p-6 max-w-4xl mx-auto space-y-6 w-full py-10 text-slate-900">
        {/* Navigation Link */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>
          <Link
            to="/data-rights"
            className="inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Exercise Your Data Rights (DPDP) →
          </Link>
        </div>

        <Card className="border-slate-200 bg-white p-8 md:p-10 space-y-8 shadow-sm rounded-2xl">
          {/* Header */}
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold px-2.5 py-0.5">
                DPDP Act 2023 Statutory Notice
              </Badge>
              <Badge variant="outline" className="border-slate-300 text-slate-600 font-mono text-[11px]">
                Effective Date: 16 September 2026 · Version 2.0
              </Badge>
              <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px]">
                Draft: Marked for Legal Counsel Review
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              AIVI Campus Privacy Notice
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              This statutory Privacy Notice is issued by <strong>AIVI Intelligence Private Limited</strong> in compliance with 
              Sections 5, 6, 8, 11, 12, 13, and 14 of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> (Act No. 22 of 2023, Republic of India). 
              It governs the collection, processing, storage, and erasure of personal data across the AIVI Campus Operating System (including <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">aivicampus.com</code> and partner institutional subdomains).
            </p>
          </div>

          {/* Section 1: Data Fiduciary & Statutory Identity */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              1. Identity of the Data Fiduciary
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
              <p><strong>Entity Name:</strong> AIVI INTELLIGENCE PRIVATE LIMITED</p>
              <p><strong>Corporate Identity Number (CIN):</strong> U62099UP2026PTC249169</p>
              <p><strong>Permanent Account Number (PAN):</strong> ABFCA9830M</p>
              <p><strong>Statutory Recognition:</strong> DPIIT Recognized (#DIPP271794) · Start In UP (#R/STARTUP/UP/LKO/2026/000045574) · MSME Udyam (UDYAM-UP-32-0123988)</p>
              <p><strong>Registered Office:</strong> C/O Ganga Jali Mishra, Kuraghat, Khaletola, Khorabar, Gorakhpur - 273010, Uttar Pradesh, India</p>
              <p><strong>Corporate Operational Centers:</strong> New Delhi NCR & Gorakhpur, Uttar Pradesh, India</p>
              <p><strong>Parent Corporate Portal:</strong> <a href="https://aiviintelligence.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline">https://aiviintelligence.com</a></p>
              <p className="pt-2 text-slate-500 italic">
                *Note for Institutional Context: Where an educational institution (College or University) contracts with AIVI Campus to manage campus placement drives, the College acts as the primary <strong>Data Fiduciary</strong> and AIVI acts as the authorized <strong>Data Processor</strong> in accordance with our institutional Data Processing Addendum (DPA). For direct student-initiated career workflows, AIVI acts as a Data Fiduciary.
              </p>
            </div>
          </div>

          {/* Section 2: What Personal Data is Collected */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              2. Itemised Personal Data We Collect
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with the principle of <strong>Data Minimization</strong> (Section 6(1) DPDP Act), AIVI collects only personal data strictly required to deliver career readiness and placement automation:
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Data Category</th>
                    <th className="p-3">Specific Fields</th>
                    <th className="p-3">Source of Collection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Academic & Institutional Roster</td>
                    <td className="p-3">Full name, institutional email address, enrollment / roll number, department branch, batch year, cumulative CGPA / percentage.</td>
                    <td className="p-3">TPO authorized CSV roster upload or direct student institutional sign-in.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Career Documents & Resumes</td>
                    <td className="p-3">Uploaded PDF/DOCX resumes, project descriptions, skills inventory, certifications, target job descriptions.</td>
                    <td className="p-3">Uploaded directly by the student for ATS scoring and vault verification.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Vernacular Mock Interview Audio & Telemetry</td>
                    <td className="p-3">Real-time acoustic speech telemetry (Words Per Minute, filler words count, response transcripts in English/Hindi). <em>Note: Raw MP3 audio streams are processed in ephemeral memory and never saved to persistent storage.</em></td>
                    <td className="p-3">Live conversational interview session in browser via Web Audio API.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Institutional TPO & Faculty Contacts</td>
                    <td className="p-3">Officer name, designation, official phone number, college name, city, student capacity.</td>
                    <td className="p-3">Institutional audit request or coordinator invitation form.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Technical & Access Logs</td>
                    <td className="p-3">IP address (anonymized in analytics), device browser type, sign-in timestamp, session security tokens.</td>
                    <td className="p-3">Automated security audit logging for fraud prevention and DPDP accountability.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
              ⚠️ <strong>Prohibited Data Declaration:</strong> AIVI Campus NEVER collects, processes, or stores Aadhaar numbers, PAN cards of students, biometric fingerprints, religious or political beliefs, or banking credentials of students.
            </div>
          </div>

          {/* Section 3: Purposes of Processing */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Specific Purposes of Processing (Section 4 & 6)</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We process personal data solely for specified, lawful, and affirmative purposes:
            </p>
            <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside leading-relaxed">
              <li><strong>Placement Readiness Benchmarking:</strong> Computing continuous AIVI Employability Scores (AES) and skill roadmaps.</li>
              <li><strong>Campus Placement Drives:</strong> Enabling TPO cells to create drives, filter eligible batches, and export verified cryptographic resume packages.</li>
              <li><strong>Accreditation Compliance:</strong> Generating aggregated, verifiable evidence reports for NAAC Criterion 5.2.1 and NIRF Metric 3.a rankings.</li>
              <li><strong>Vernacular Voice Coaching:</strong> Delivering live, AI-powered conversational interview coaching in Hindi and English with forensic feedback rubrics.</li>
              <li><strong>Security & Authentication:</strong> Ensuring role-based access control (RBAC) across student, coordinator, TPO, and platform administrator tiers.</li>
            </ul>
          </div>

          {/* Section 4: Data Retention & Storage Policy */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Storage, Encryption & Retention Periods</h2>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Geographic Data Residency:</strong> All primary databases (Firestore), storage buckets (Cloud Storage), and computing clusters are physically located within the Republic of India at <strong>Google Cloud Platform, Mumbai Region (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">asia-south1</code>)</strong>. No student data is transferred cross-border.
              </p>
              <p>
                <strong>Cryptographic Safeguards:</strong> Data at rest is encrypted using 256-bit Advanced Encryption Standard (AES-256). All data in transit is encrypted using Transport Layer Security (TLS 1.3 / HTTPS).
              </p>
              <p>
                <strong>Statutory Retention Schedules:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li><strong>Active Students:</strong> Retained for the duration of the student's degree enrollment at the partner institution.</li>
                <li><strong>Post-Graduation Retention:</strong> Retained for up to 12 months following batch graduation solely to satisfy NAAC/NIRF institutional placement audit verification, after which accounts are archived or anonymized.</li>
                <li><strong>Live Voice Audio:</strong> Never retained on persistent disks. Only the text transcript and numeric telemetry remain on file.</li>
                <li><strong>On-Demand Erasure:</strong> Purged from live database systems within 30 days of receiving a verified Data Principal deletion request.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Authorized Sub-processors */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Authorized Third-Party Sub-Processors</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              AIVI engages vetted third-party service providers bound by strict confidentiality and DPDP data protection contracts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Google Cloud Platform (India)</span>
                <span className="text-slate-600 text-[11px]">Primary infrastructure host (Mumbai <code className="text-[10px] bg-slate-200 px-1 py-0.5 rounded">asia-south1</code>) for Firebase Auth, Firestore, and Cloud Functions.</span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Google Gemini Enterprise AI</span>
                <span className="text-slate-600 text-[11px]">AI evaluation engine for resume analysis & mock interview feedback. Bound by zero-data-retention and zero-model-training terms.</span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Hostinger SMTP Infrastructure</span>
                <span className="text-slate-600 text-[11px]">Transactional email dispatch for coordinator invitations, TPO credential notices, and password resets.</span>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50">
                <span className="font-bold text-slate-900 block">Razorpay Software Private Limited</span>
                <span className="text-slate-600 text-[11px]">PCI-DSS compliant payment gateway for institutional campus licensing and invoice settlements.</span>
              </div>
            </div>
          </div>

          {/* Section 6: Data Principal Rights */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-600" />
              6. Your Statutory Rights as a Data Principal
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under Chapter III of the DPDP Act 2023, every student, faculty member, and placement officer possesses enforceable legal rights:
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-slate-900">A. Right to Access Summary of Personal Data (Section 11)</span>
                <p className="text-slate-600">You may request a copy and complete inventory of all personal data processed by AIVI, including identities of any third parties with whom data was shared.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-slate-900">B. Right to Correction and Erasure (Section 12)</span>
                <p className="text-slate-600">You may request correction of inaccurate data, completion of incomplete records, or permanent erasure of personal data that is no longer necessary.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-slate-900">C. Right to Withdraw Consent (Section 6(4))</span>
                <p className="text-slate-600">You have the right to withdraw your consent at any time as easily as it was given, without affecting the lawfulness of processing undertaken prior to withdrawal.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-slate-900">D. Right of Grievance Redressal (Section 13)</span>
                <p className="text-slate-600">You have the right to register grievances with our dedicated Data Protection Officer and receive prompt, documented redressal.</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="font-bold text-slate-900">E. Right to Nominate (Section 14)</span>
                <p className="text-slate-600">You have the right to nominate an individual to exercise your data rights in the event of death or incapacity.</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/data-rights"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-all"
              >
                Submit a Data Rights Request Online →
              </Link>
            </div>
          </div>

          {/* Section 7: Grievance Officer & Statutory Contact */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-teal-600" />
              7. Grievance Officer & Data Protection Officer (DPO) Contact
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pursuant to Section 13(1) of the DPDP Act 2023, AIVI has appointed a designated Grievance Officer to resolve any privacy queries, consent withdrawals, or data rights requests:
            </p>
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-slate-800 space-y-2">
              <p><strong>Designated Grievance Officer:</strong> Mr. Mithlesh Mishra</p>
              <p><strong>Designation:</strong> Data Protection Grievance Officer, AIVI Intelligence Pvt Ltd</p>
              <p><strong>Official Grievance Email:</strong> <a href="mailto:grievance@aivicampus.com" className="font-bold text-teal-800 underline">grievance@aivicampus.com</a> (monitored via <a href="mailto:hello@aivilabs.com" className="font-semibold text-teal-800 underline">hello@aivilabs.com</a>)</p>
              <p><strong>Physical Address:</strong> Kuraghat, Khaletola, Khorabar, Gorakhpur - 273010, Uttar Pradesh, India</p>
              <p><strong>Statutory SLA Timelines:</strong> Every grievance is acknowledged within <strong>24 hours</strong> of receipt and definitively resolved within <strong>30 calendar days</strong>.</p>
              <p className="text-[11px] text-slate-600 pt-1">
                If your grievance is not resolved within 30 days, you retain the statutory right to escalate your complaint directly to the <strong>Data Protection Board of India (DPBI)</strong>.
              </p>
            </div>
          </div>

          {/* Section 8: Legal Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-[11px] text-slate-600 leading-relaxed space-y-1">
            <span className="font-bold text-slate-800 block flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              Statutory Documentation Notice
            </span>
            <p>
              This document represents AIVI's operational privacy protocol formulated in strict accordance with the Digital Personal Data Protection Act, 2023 (DPDP). 
              Institutional partner colleges may execute customized Data Processing Addendums (DPAs) incorporating specific university statutes. 
              This text is marked for periodic review by qualified Legal Counsel and the Data Protection Officer.
            </p>
          </div>
        </Card>
      </div>
    </LegalHeaderFooterWrapper>
  );
}

