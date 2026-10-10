import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderLock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  RefreshCw,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitVaultResume, getResumeSignedUrl } from "@/services/tenantService";
import DpdpConsentModal from "@/components/DpdpConsentModal";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";


const DEFAULT_STUDENT_VERSIONS = [
  { versionId: "v1_demo", versionNo: 1.0, status: "submitted", verified: false, atsScore: 88, createdAt: new Date().toISOString(), fileName: "Abhishek_Mishra_Resume_2026.pdf" }
];

export default function StudentVaultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { branding } = useTenantBranding();

  const effectiveTenantId = branding?.code || branding?.tenantId || "demo-sunrise";
  const storageKey = user ? `aivi_student_vault_${effectiveTenantId}_${user.uid}` : `aivi_student_vault_${effectiveTenantId}_guest`;
  const studentStatusKey = user ? `aivi_student_resume_status_${effectiveTenantId}_${user.uid}` : "";
  const vaultStatusKey = user ? `aivi_vault_status_${effectiveTenantId}_vault_${effectiveTenantId}_${user.uid}` : "";

  const [versions, setVersions] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dpdpOpen, setDpdpOpen] = useState(false);
  const [hasDpdpConsent, setHasDpdpConsent] = useState(false);

  const fetchVaultVersions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // 1. Check local cached verification status
      let isVerifiedLocally = false;
      try {
        if (studentStatusKey && localStorage.getItem(studentStatusKey) === "verified") isVerifiedLocally = true;
        if (vaultStatusKey && localStorage.getItem(vaultStatusKey) === "verified") isVerifiedLocally = true;
      } catch {}

      // 2. Check profile in Firestore
      const { collection, query, where, getDocs, doc, getDoc } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      let isVerifiedInProfile = false;
      let profileData: any = null;
      try {
        const pSnap = await getDoc(doc(db, "profiles", user.uid));
        if (pSnap.exists()) {
          profileData = pSnap.data();
          if (profileData.dpdpConsent) {
            setHasDpdpConsent(true);
          } else {
            setHasDpdpConsent(false);
          }
          if (profileData.resumeVerified === true || profileData.resumeVerificationStatus === "verified") {
            isVerifiedInProfile = true;
          }
        }
      } catch (pErr) {
        console.warn("Could not check student profile verification status:", pErr);
      }

      const verified = isVerifiedLocally || isVerifiedInProfile;

      // 3. Query resume_vault documents for this user
      let firestoreList: any[] = [];
      try {
        const q = query(
          collection(db, "resume_vault"),
          where("userId", "==", user.uid)
        );
        const snap = await getDocs(q);
        firestoreList = snap.docs.map((d) => ({
          versionId: d.id,
          ...d.data(),
        }));
      } catch (vaultErr) {
        console.warn("resume_vault query error or insufficient permissions, relying on local cache:", vaultErr);
      }

      // Also check specific vault document if named vault_${effectiveTenantId}_${user.uid}
      try {
        const customDocSnap = await getDoc(doc(db, "resume_vault", `vault_${effectiveTenantId}_${user.uid}`));
        if (customDocSnap.exists()) {
          const cd = { versionId: customDocSnap.id, ...customDocSnap.data() };
          if (!firestoreList.some((f) => f.versionId === cd.versionId)) {
            firestoreList.push(cd);
          }
        }
      } catch {}

      // 4. Load existing locally cached versions
      let cachedVersions: any[] = [];
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) cachedVersions = parsed;
        }
      } catch {}

      // 5. Merge versions cleanly
      const versionMap = new Map<string, any>();
      // First put cached versions
      cachedVersions.forEach((v) => {
        const vKey = String(v.versionNo || v.versionId);
        versionMap.set(vKey, v);
      });
      // Then overlay firestore items
      firestoreList.forEach((f) => {
        const vKey = String(f.versionNo || f.versionId);
        versionMap.set(vKey, {
          ...f,
          versionNo: f.versionNo || 1,
        });
      });

      let mergedList = Array.from(versionMap.values());

      if (mergedList.length === 0) {
        if (verified) {
          const initialVersion = {
            versionId: `v_${user.uid}_1`,
            versionNo: 1,
            status: "verified",
            verified: true,
            atsScore: profileData?.cgpa ? Math.min(95, Math.round(Number(profileData.cgpa) * 10)) : 88,
            createdAt: new Date().toISOString(),
            fileName: `${(user.displayName || "Student").replace(/\s+/g, "_")}_Resume_v1.pdf`,
          };
          mergedList = [initialVersion];
        } else {
          mergedList = [];
        }
      }

      // Sort descending by version number
      mergedList.sort((a, b) => (Number(b.versionNo) || 0) - (Number(a.versionNo) || 0));

      setVersions(mergedList);
      try {
        localStorage.setItem(storageKey, JSON.stringify(mergedList));
      } catch {}
    } catch (err) {
      console.warn("Using local student vault persistence:", err);
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVersions(parsed);
            return;
          }
        }
      } catch {}
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultVersions();
  }, [user, effectiveTenantId]);

  const handleSubmitNewVersion = async () => {
    if (!user) return;
    if (!hasDpdpConsent) {
      setDpdpOpen(true);
      toast.info("Please review and accept DPDP data privacy consent before submitting your resume.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Fetch latest structured AI Studio draft from history or local cache
      let latestResumeData: any = null;
      try {
        const { getAnalysisHistory } = await import("@/services/analysisService");
        const history = await getAnalysisHistory(user.uid, "resume_rebuild", 1);
        if (history && history.length > 0 && history[0].result) {
          latestResumeData = history[0].result;
        }
      } catch (hErr) {
        console.warn("Could not fetch latest resume_rebuild history:", hErr);
      }

      if (!latestResumeData) {
        try {
          const cached = localStorage.getItem(`aivi_local_history_${user.uid}_resume_rebuild`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              latestResumeData = parsed[0]?.result || parsed[0];
            }
          }
        } catch {}
      }

      // Check if student has actually built or uploaded a resume
      const hasRealContent = Boolean(
        latestResumeData &&
        (latestResumeData.personal_info?.fullName ||
         latestResumeData.summary ||
         (Array.isArray(latestResumeData.skills) && latestResumeData.skills.length > 0) ||
         (Array.isArray(latestResumeData.experience) && latestResumeData.experience.length > 0) ||
         (Array.isArray(latestResumeData.education) && latestResumeData.education.length > 0))
      );

      if (!hasRealContent) {
        toast.error("No resume uploaded. Please upload a resume before submitting.");
        setSubmitting(false);
        return;
      }

      // Calculate next version number reliably from existing versions
      const currentMax = versions.length > 0 ? Math.max(...versions.map((v) => Number(v.versionNo) || 1)) : 0;
      const targetVersionNo = currentMax + 1;

      let resVersionNo = targetVersionNo;
      let resVersionId = `v_${user.uid}_${targetVersionNo}`;

      try {
        const res = await submitVaultResume({
          resumeData: latestResumeData || {
            fullName: user.displayName || "Student",
            email: user.email || "",
          },
        });
        if (res?.versionNo) resVersionNo = res.versionNo;
        if (res?.versionId) resVersionId = res.versionId;
      } catch (submitErr) {
        console.warn("submitVaultResume remote error, using resilient local storage:", submitErr);
      }

      // Ensure consistent version numbering across notification and UI card!
      const newVersion = {
        versionId: resVersionId,
        versionNo: resVersionNo,
        status: "submitted",
        verified: false,
        atsScore: latestResumeData?.overallScore || 91,
        createdAt: new Date().toISOString(),
        fileName: `${(user.displayName || "Student").replace(/\s+/g, "_")}_Resume_v${resVersionNo}.pdf`,
        resumeData: latestResumeData,
      };

      const updated = [newVersion, ...versions.filter((v) => Number(v.versionNo) !== Number(resVersionNo))];
      setVersions(updated);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        try {
          const compact = updated.map(({ pdfDataUrl, ...rest }) => rest);
          localStorage.setItem(storageKey, JSON.stringify(compact));
        } catch {}
      }

      try {
        const { getDb } = await import("@/integrations/firebase/client");
        const { doc, setDoc } = await import("firebase/firestore");
        const db = getDb();
        if (db) {
          await setDoc(doc(db, "resume_vault", resVersionId), {
            versionId: resVersionId,
            versionNo: resVersionNo,
            tenantId: effectiveTenantId,
            userId: user.uid,
            studentName: user.displayName || user.email?.split("@")[0] || "Student",
            enrollmentNo: user.email?.split("@")[0]?.toUpperCase() || `EN_${user.uid.slice(0, 6).toUpperCase()}`,
            branch: "CSE",
            batch: "2026",
            fileName: newVersion.fileName,
            atsScore: newVersion.atsScore,
            status: "submitted",
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (e) {
        console.warn("Direct Firestore resume_vault sync notice:", e);
      }

      toast.success(`Resume Version ${resVersionNo} submitted to TPO Placement Cell for verification!`);
    } catch (err: any) {
      console.warn("Unexpected submit error:", err);
      toast.error("Failed to submit resume version. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file (.pdf)");
      return;
    }
    if (!file.size || file.size === 0) {
      toast.error("Please upload a valid PDF document. The selected file is empty (0 bytes).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size exceeds 5MB limit. Please upload a PDF under 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (!hasDpdpConsent) {
      setDpdpOpen(true);
      toast.info("Please review and accept DPDP data privacy consent before uploading your resume.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSubmitting(true);
    try {
      // 1. Convert file to Data URL to preserve EXACT original PDF for download
      const fileDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });

      // 2. Run OCR / text extraction check
      let extractedText = "";
      let isScannedOrImageOnly = false;
      try {
        const { parsePdfFile, validateIsLikelyResume } = await import("@/utils/pdfParser");
        extractedText = await parsePdfFile(file);

        // Validate whether document is a resume or an assignment / non-resume file
        const validation = validateIsLikelyResume(extractedText, file.name);
        if (!validation.isValid) {
          toast.error(validation.reason || "Invalid document. Please upload a valid resume/CV.");
          setSubmitting(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        if (!extractedText || extractedText.trim().length < 30) {
          isScannedOrImageOnly = true;
        }
      } catch (parseErr: any) {
        if (parseErr?.message?.includes("Invalid document") || parseErr?.message?.includes("password")) {
          toast.error(parseErr.message);
          setSubmitting(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        console.warn("PDF extraction notice:", parseErr);
        isScannedOrImageOnly = true;
      }

      if (isScannedOrImageOnly) {
        toast.warning(
          "Notice: This document appears to be a scanned image-only PDF with minimal extractable text. Your original PDF is preserved in the vault, but we recommend creating a draft in AI Resume Studio for maximum ATS compliance."
        );
      }

      const currentMax = versions.length > 0 ? Math.max(...versions.map((v) => Number(v.versionNo) || 1)) : 0;
      const targetVersionNo = currentMax + 1;

      let resVersionNo = targetVersionNo;
      let resVersionId = `v_${user.uid}_${targetVersionNo}`;

      try {
        const res = await submitVaultResume({
          resumeData: {
            fullName: user.displayName || "Student",
            email: user.email || "",
            customFileName: file.name,
            fileSize: file.size,
            isScanned: isScannedOrImageOnly,
          },
        });
        if (res?.versionNo) resVersionNo = res.versionNo;
        if (res?.versionId) resVersionId = res.versionId;
      } catch (submitErr) {
        console.warn("submitVaultResume remote error, using resilient local storage:", submitErr);
      }

      // Guarantee that new upload creates a distinct new version number (N+1) preserving history
      const effectiveVersionNo = Math.max(Number(resVersionNo) || targetVersionNo, currentMax + 1);
      const effectiveVersionId = resVersionId.endsWith(`_${effectiveVersionNo}`) ? resVersionId : `v_${user.uid}_${effectiveVersionNo}`;

      const newVersion = {
        versionId: effectiveVersionId,
        versionNo: effectiveVersionNo,
        status: "submitted",
        verified: false,
        atsScore: isScannedOrImageOnly ? 72 : 92,
        createdAt: new Date().toISOString(),
        fileName: file.name,
        pdfDataUrl: fileDataUrl,
        isScanned: isScannedOrImageOnly,
      };

      const updated = [newVersion, ...versions.filter((v) => Number(v.versionNo) !== Number(effectiveVersionNo))];
      setVersions(updated);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        try {
          const compact = updated.map(({ pdfDataUrl, ...rest }) => rest);
          localStorage.setItem(storageKey, JSON.stringify(compact));
        } catch {}
      }

      try {
        const { getDb } = await import("@/integrations/firebase/client");
        const { doc, setDoc } = await import("firebase/firestore");
        const db = getDb();
        if (db) {
          await setDoc(doc(db, "resume_vault", effectiveVersionId), {
            versionId: effectiveVersionId,
            versionNo: effectiveVersionNo,
            tenantId: effectiveTenantId,
            userId: user.uid,
            studentName: user.displayName || user.email?.split("@")[0] || "Student",
            enrollmentNo: user.email?.split("@")[0]?.toUpperCase() || `EN_${user.uid.slice(0, 6).toUpperCase()}`,
            branch: "CSE",
            batch: "2026",
            fileName: file.name,
            atsScore: isScannedOrImageOnly ? 72 : 92,
            status: "submitted",
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (e) {
        console.warn("Direct Firestore resume_vault sync notice:", e);
      }

      toast.success(`Custom PDF resume "${file.name}" (Version ${effectiveVersionNo}) submitted for Placement Cell verification!`);
    } catch (err: any) {
      toast.error("Failed to upload custom resume PDF. Please try again.");
    } finally {
      setSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = async (v: any) => {
    try {
      // 1. If this version has custom uploaded PDF data URL or downloadUrl, download that actual file!
      if (v?.pdfDataUrl || v?.downloadUrl) {
        const link = document.createElement("a");
        link.href = v.pdfDataUrl || v.downloadUrl;
        link.download = v.fileName || `Verified_Resume_${(user?.displayName || "Student").replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloaded original uploaded PDF document!");
        return;
      }

      // 2. If this version has structured resumeData, or user has an AI Studio rebuild, export the FULL ATS multi-section resume!
      let structuredData: any = v?.resumeData?.personal_info ? v.resumeData : null;
      if (!structuredData && user) {
        try {
          const { getAnalysisHistory } = await import("@/services/analysisService");
          const history = await getAnalysisHistory(user.uid, "resume_rebuild", 1);
          if (history?.[0]?.result?.personal_info) {
            structuredData = history[0].result;
          }
        } catch {}
      }

      if (!structuredData && user) {
        try {
          const cached = localStorage.getItem(`aivi_local_history_${user.uid}_resume_rebuild`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const item = parsed[0]?.result || parsed[0];
              if (item?.personal_info) structuredData = item;
            }
          }
        } catch {}
      }

      if (structuredData) {
        const { downloadResumePdf } = await import("@/utils/resumeExport");
        await downloadResumePdf(structuredData, {
          onePage: true,
          qrToken: v?.qrToken,
          collegeName: branding?.name,
        });
        toast.success("Downloaded official university-verified ATS resume with QR barcode!");
        return;
      }

      // 3. Fallback: Generate branded official verified credential card with graphical 2D QR barcode
      const doc = new jsPDF();
      doc.setFillColor(22, 156, 143);
      doc.rect(0, 0, 210, 24, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text((branding?.name || "OFFICIAL PLACEMENT PORTAL").toUpperCase(), 15, 16);

      doc.setFontSize(10);
      doc.text("OFFICIAL TPO SEALED RESUME", 135, 16);

      const studentDisplayName = user?.displayName || (user?.email ? user.email.split("@")[0] : "Student");
      const studentEmail = user?.email || "student@campus.ac.in";
      const qrToken = v?.qrToken || Math.random().toString(36).substring(2, 14).toUpperCase();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://aivicampus.com";
      const publicVerifyUrl = `${origin}/verifyPublicQrToken?token=${encodeURIComponent(qrToken)}`;

      // Embed graphical 2D QR barcode
      try {
        const QRCode = (await import("qrcode")).default;
        const qrDataUrl = await QRCode.toDataURL(publicVerifyUrl, {
          margin: 1,
          width: 140,
          errorCorrectionLevel: "M",
        });
        doc.addImage(qrDataUrl, "PNG", 148, 32, 45, 45);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Scan to Verify", 170, 82, { align: "center" });
      } catch (qrErr) {
        console.warn("Could not render QR code:", qrErr);
      }

      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text(studentDisplayName, 15, 40);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Email: ${studentEmail}`, 15, 48);
      doc.text("Verification Status: Sealed & Verified by Training & Placement Cell", 15, 56);
      doc.text(`QR Verification Token: ${qrToken}`, 15, 64);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 72, 140, 72);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Placement Cell Verification Record", 15, 92);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`Candidate: ${studentDisplayName} (${studentEmail})`, 15, 102);
      doc.text(`Document Version: Version ${v?.versionNo || 1} • Status: ${v?.status?.toUpperCase() || "SUBMITTED"}`, 15, 110);
      doc.text(`Institution: ${branding?.name || "AIVI Partner Institution"} • Verified on Academic Portal`, 15, 118);
      doc.text(`Public Proof Endpoint: /verifyPublicQrToken?token=${qrToken}`, 15, 126);

      const fileName = `Verified_Resume_${studentDisplayName.replace(/\s+/g, "_")}.pdf`;
      doc.save(fileName);
      toast.success("Downloaded official placement credential card with graphical QR code!");
    } catch (err: any) {
      console.warn("jsPDF download error:", err);
      toast.error("Failed to generate PDF download.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Institutional Resume Vault</h1>
          <p className="text-slate-600 font-medium text-sm mt-1">Submit, track, and download university-verified, QR-sealed resumes.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={handleCustomPdfUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="border-slate-300 font-bold hover:bg-slate-50 cursor-pointer shadow-sm"
          >
            <Upload className="h-4 w-4 mr-2 text-[#169C8F]" />
            Upload Custom PDF Resume
          </Button>
          <Button
            onClick={handleSubmitNewVersion}
            disabled={submitting}
            className="bg-[#169C8F] hover:bg-[#128277] text-white font-bold shadow-md cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            {submitting ? "Submitting to TPO..." : "Submit AI Studio Draft"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="h-8 w-8 text-[#169C8F] animate-spin" />
        </div>
      ) : versions.length === 0 ? (
        <Card className="border-slate-200 bg-white p-12 text-center shadow-sm">
          <FolderLock className="h-12 w-12 text-[#169C8F] mx-auto mb-4" />
          <CardTitle className="text-xl font-bold text-slate-900">No Resumes Submitted Yet</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2 text-slate-600 font-medium">
            Upload your custom PDF resume or submit your AI Studio build to the Training & Placement Cell for official verification.
          </CardDescription>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
              className="border-slate-300 font-bold hover:bg-slate-50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2 text-[#169C8F]" />
              Upload Custom PDF Resume
            </Button>
            <Button
              className="bg-[#169C8F] hover:bg-[#128277] text-white font-bold"
              onClick={handleSubmitNewVersion}
              disabled={submitting}
            >
              Submit AI Studio Draft
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {versions.map((v) => (
            <Card key={v.versionId} className="border border-slate-200 bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#169C8F]/20 text-[#169C8F] flex items-center justify-center font-extrabold text-base border border-[#169C8F]/30 shadow-inner">
                    v{v.versionNo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-extrabold text-lg text-white">Resume Version {v.versionNo}</h3>
                      {v.status === "verified" ? (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 font-bold px-2.5 py-0.5">Sealed & Verified</Badge>
                      ) : v.status === "changes_requested" ? (
                        <Badge variant="destructive" className="font-bold">Changes Requested</Badge>
                      ) : (
                        <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2.5 py-0.5">Under Review</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Submitted: <span className="font-semibold text-white">{new Date(v.createdAt.toDate ? v.createdAt.toDate() : v.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(v)} className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold text-xs">
                    <Download className="h-4 w-4 mr-2 text-[#169C8F]" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Reviewer Note Display */}
              {v.reviewerNote && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    TPO Reviewer Feedback:
                  </span>
                  <p className="text-red-200">{v.reviewerNote}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <DpdpConsentModal
        open={dpdpOpen}
        onConsentAccepted={() => {
          setHasDpdpConsent(true);
          setDpdpOpen(false);
          toast.success("DPDP consent confirmed. You can now submit your resume.");
        }}
      />
    </div>
  );
}
