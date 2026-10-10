import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";

const parsePdfClientSide = async (file: File): Promise<string> => {
  if (!(window as any).pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        try {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve();
        } catch {
          resolve();
        }
      };
      script.onerror = () => reject(new Error("Failed to load PDF parser CDN"));
      document.head.appendChild(script);
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};

// Resilient raw buffer extraction when external libraries / CDNs are unavailable or blocked
const extractRawTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8");
    const raw = decoder.decode(arrayBuffer);

    const textPieces: string[] = [];
    const parenMatches = raw.match(/\(([^()]{2,100})\)\s*T[jJ]/g);
    if (parenMatches && parenMatches.length > 5) {
      parenMatches.forEach((m) => {
        const clean = m.replace(/^\(/, "").replace(/\)\s*T[jJ]$/, "").trim();
        if (clean.length > 1) textPieces.push(clean);
      });
    }

    if (textPieces.length < 15) {
      const words = raw.match(/[A-Za-z0-9@._+-]{3,30}/g) || [];
      const filtered = words.filter(
        (w) =>
          !/^(obj|endobj|stream|endstream|xref|trailer|startxref|Catalog|Pages|Page|Font|Type|Subtype|Widths|Length|Filter|FlateDecode)$/i.test(w)
      );
      if (filtered.length > 20) {
        return filtered.join(" ");
      }
    }

    return textPieces.join(" ");
  } catch (err) {
    console.warn("Raw PDF buffer text extraction fallback notice:", err);
    return "";
  }
};

export const checkIsPdfEncrypted = async (file: File): Promise<boolean> => {
  try {
    const slice = await file.slice(0, Math.min(file.size, 1024 * 1024)).arrayBuffer();
    const text = new TextDecoder("latin1").decode(slice);
    if (/\/Encrypt\s+[0-9]+\s+[0-9]+\s+R|\/Encrypt\s*<<|\/Encrypt\b/i.test(text)) {
      return true;
    }
  } catch (e) {
    console.warn("PDF encryption check notice:", e);
  }
  return false;
};

export const parsePdfFile = async (file: File): Promise<string> => {
  // 0. Pre-flight check for password protection / encrypted PDF
  const isEncrypted = await checkIsPdfEncrypted(file);
  if (isEncrypted) {
    throw new Error("PDF is password protected. Please unlock it.");
  }

  // 1. Try server-side extractPdf Cloud Function
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

    const { getFunctionsInstance } = await import("@/integrations/firebase/client");
    const functionsInstance = getFunctionsInstance();
    const fn = httpsCallable<{ pdf_base64: string }, { text: string }>(
      functionsInstance,
      "extractPdf"
    );
    const response = await fn({ pdf_base64: base64 });
    if (response.data?.text?.trim()) {
      return response.data.text;
    }
  } catch (err: any) {
    if (
      err?.name === "PasswordException" ||
      err?.message?.toLowerCase().includes("password") ||
      err?.message?.toLowerCase().includes("encrypted")
    ) {
      throw new Error("PDF is password protected. Please unlock it.");
    }
    console.warn("[pdfParser] Cloud function extractPdf unavailable; using client-side engine:", err);
  }

  // 2. Try client-side pdf.js
  try {
    const clientText = await parsePdfClientSide(file);
    if (clientText && clientText.trim().length > 30) {
      return clientText;
    }
  } catch (clientErr: any) {
    if (
      clientErr?.name === "PasswordException" ||
      clientErr?.message?.toLowerCase().includes("password") ||
      clientErr?.message?.toLowerCase().includes("encrypted")
    ) {
      throw new Error("PDF is password protected. Please unlock it.");
    }
    console.warn("[pdfParser] Client-side pdf.js unavailable; trying raw buffer parser:", clientErr);
  }

  // 3. Try raw buffer stream extraction
  const rawText = await extractRawTextFromPdf(file);
  if (rawText && rawText.trim().length > 30) {
    return rawText;
  }

  throw new Error("Unable to parse text from this PDF file. It may be scanned or image-only.");
};

// Alias for backward compatibility with ResumeUploadForm.tsx
export const extractTextFromPdf = parsePdfFile;

/**
 * Deterministic validator to detect whether extracted PDF text is actually a resume/CV
 * rather than an assignment, lab manual, syllabus, project report, or unrelated document.
 */
export const validateIsLikelyResume = (text: string, fileName = ""): { isValid: boolean; reason?: string } => {
  const lowerText = (text || "").toLowerCase();
  const lowerName = (fileName || "").toLowerCase();

  // 1. File name indicators for explicitly non-resume files
  const nonResumeFileKeywords = [
    "assignment",
    "lab_report",
    "lab report",
    "practical",
    "experiment",
    "homework",
    "term_paper",
    "term paper",
    "thesis",
    "dissertation",
    "syllabus",
    "question_paper",
    "lecture",
  ];
  if (nonResumeFileKeywords.some((kw) => lowerName.includes(kw))) {
    return {
      isValid: false,
      reason: "Invalid document. Please upload a valid resume/CV instead of an assignment or report.",
    };
  }

  // 2. Check for explicit assignment / lab manual / academic report headers in text
  const isAssignmentOrReport = /\b(assignment\s*([0-9#:]|no|number)|experiment\s*(no|number|[0-9])|practical\s*(no|number|[0-9])|lab\s*manual|homework\s*([0-9#:]|no)|submitted\s*to\s*:|course\s*instructor)\b/i.test(
    lowerText
  );

  // 3. Count standard resume structural sections
  const resumeAnchorPatterns = [
    /\b(education|academic\s+background|qualifications?)\b/i,
    /\b(experience|internships?|work\s+history|employment)\b/i,
    /\b(skills?|technical\s+skills|core\s+competencies|technologies)\b/i,
    /\b(projects?|academic\s+projects|personal\s+projects)\b/i,
    /\b(summary|professional\s+summary|career\s+objective|about\s+me)\b/i,
    /\b(certifications?|licenses?|achievements?|awards?)\b/i,
    /\b(b\.?tech|bachelor|master|m\.?tech|diploma|degree|cgpa|gpa)\b/i,
    /\b(curriculum\s+vitae|\bresume\b)\b/i,
    /\b(github|linkedin|portfolio)\b/i,
  ];

  const matchedAnchors = resumeAnchorPatterns.filter((pat) => pat.test(lowerText)).length;

  if (isAssignmentOrReport && matchedAnchors < 3) {
    return {
      isValid: false,
      reason: "Invalid document. The uploaded file appears to be an academic assignment or report rather than a resume/CV.",
    };
  }

  // If text is long enough to have structure, require at least 2 distinct resume sections
  if (lowerText.length > 80 && matchedAnchors < 2) {
    // If filename explicitly says resume or cv, give benefit of the doubt if at least 1 anchor matched
    if ((lowerName.includes("resume") || lowerName.includes("cv")) && matchedAnchors >= 1) {
      return { isValid: true };
    }
    return {
      isValid: false,
      reason: "Invalid document. Please upload a valid resume/CV containing standard sections (Education, Skills, Experience, or Projects).",
    };
  }

  return { isValid: true };
};


