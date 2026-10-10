import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Copy, ArrowRight, Loader2, X } from "lucide-react";
import { extractTextFromPdf, validateIsLikelyResume } from "@/utils/pdfParser";
import { toast } from "sonner";
import { saveUserResumeMemory, getUserResumeMemory } from "@/services/analysisService";

interface ResumeUploadFormProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
  title?: string;
  description?: string;
  showHeader?: boolean;
  buttonLabel?: string;
  initialText?: string;
}

const ResumeUploadForm = ({
  onAnalyze,
  loading,
  title = "Resume Intelligence Engine",
  description = "The Resume Intelligence Engine performs a comprehensive analysis of your resume across six critical dimensions: ATS compatibility, keyword optimization, technical depth, leadership signals, quantification of achievements, and overall clarity. It identifies weak bullet points, missing sections, overused buzzwords, and provides specific rewrite suggestions.",
  showHeader = true,
  buttonLabel = "Build Resume Draft",
  initialText = "",
}: ResumeUploadFormProps) => {
  const [inputMethod, setInputMethod] = useState<"file" | "paste">("paste");
  const [resumeText, setResumeText] = useState(() => initialText || getUserResumeMemory());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textToUse = initialText || getUserResumeMemory();
    setResumeText(textToUse);
    if (textToUse?.trim()) {
      setInputMethod("paste");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialText]);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setSelectedFile(file);
    setInputMethod("file");
    setParsing(true);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        toast.error("Could not extract text. The PDF may be image-based.");
        setSelectedFile(null);
        return;
      }
      const validation = validateIsLikelyResume(text, file.name);
      if (!validation.isValid) {
        toast.error(validation.reason || "Invalid document. Please upload a valid resume/CV.");
        setSelectedFile(null);
        return;
      }
      setResumeText(text);
      saveUserResumeMemory(text);
      toast.success(`Extracted ${text.split(/\s+/).length} words from PDF`);
    } catch (err: any) {
      console.error("PDF parse error:", err);
      toast.error(err?.message || "Failed to parse PDF. Try pasting text instead.");
      setSelectedFile(null);
    } finally {
      setParsing(false);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const clearFile = () => {
    setSelectedFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!resumeText.trim()) {
      toast.error("Please provide your resume text first");
      return;
    }
    saveUserResumeMemory(resumeText);
    onAnalyze(resumeText);
  };

  return (
    <div
      className="space-y-8"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {showHeader && (
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">{title}</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-[#334155] font-medium">{description}</p>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[#475569] font-medium">
            <strong className="font-bold text-[#0F172A]">Inputs required:</strong> Your resume — either
            paste the text directly or upload a PDF file (up to 10MB).{" "}
            <strong className="font-bold text-[#0F172A]">What you'll receive:</strong> A print-ready rebuilt
            resume draft using your existing experience and inputs.
          </p>
        </div>
      )}

      <div className="inline-flex rounded-full border border-[#E6ECEF] bg-white/90 p-1.5 shadow-[0_16px_38px_-28px_rgba(17,32,49,0.22)]">
        {[
          { key: "paste" as const, label: "Paste Text", icon: Copy },
          { key: "file" as const, label: "Upload PDF", icon: Upload },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setInputMethod(m.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
              inputMethod === m.key
                ? "bg-[#112F3A] text-white shadow-[0_14px_28px_-22px_rgba(17,47,58,0.52)]"
                : "text-[#66727C] hover:text-[#112031]"
            }`}
          >
            <m.icon className="h-4 w-4" />
            {m.label}
          </button>
        ))}
      </div>

      {inputMethod === "paste" ? (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="h-72 w-full resize-none rounded-[1.8rem] border border-[#E7ECEF] bg-white/96 p-5 text-sm leading-7 text-[#112031] placeholder:text-[#9AA5AD] shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
          />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {!selectedFile ? (
            <div
              className={`cursor-pointer rounded-[1.9rem] border-2 border-dashed p-14 text-center transition-all ${
                isDragging
                  ? "border-[#24B7A9] bg-[#F3FFFD]"
                  : "border-[#DCE6E8] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFA_100%)] hover:border-[#7AD7CC]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              {parsing ? (
                <>
                  <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#24B7A9]" />
                  <h3 className="font-medium text-[#112031]">Extracting text from PDF...</h3>
                </>
              ) : (
                <>
                  <Upload
                    className={`mx-auto mb-4 h-10 w-10 ${
                      isDragging ? "text-[#24B7A9]" : "text-[#7B8892]"
                    }`}
                  />
                  <h3 className="font-medium text-[#112031]">
                    {isDragging ? "Drop your PDF here" : "Drag & drop or click to upload PDF"}
                  </h3>
                  <p className="mt-1 text-sm text-[#66727C]">PDF files up to 10MB</p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-[1.8rem] border border-[#E7ECEF] bg-white/96 p-4 shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#EFFBFA_0%,#FFF4EF_100%)] text-[#FF6D4A]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#112031]">{selectedFile.name}</p>
                    <p className="text-xs text-[#66727C]">
                      {(selectedFile.size / 1024).toFixed(0)} KB · {resumeText.split(/\s+/).length}{" "}
                      words extracted
                    </p>
                  </div>
                </div>
                <button onClick={clearFile} className="p-1 text-[#7B8892] hover:text-[#112031]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="h-44 w-full resize-none rounded-[1.3rem] border border-[#E7ECEF] bg-[#FCFCFA] p-4 text-xs leading-6 text-[#112031] focus:outline-none focus:ring-2 focus:ring-[#24B7A9]/25"
                placeholder="Extracted text preview..."
              />
            </div>
          )}
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || parsing || !resumeText.trim()}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_52px_-26px_rgba(255,109,74,0.46)] transition-all hover:-translate-y-0.5 hover:bg-[#FF7A5B] disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Building resume..." : buttonLabel}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default ResumeUploadForm;
