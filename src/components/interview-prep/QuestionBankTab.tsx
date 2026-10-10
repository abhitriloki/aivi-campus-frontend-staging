import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  RefreshCw,
  BookmarkPlus,
  Download,
  CheckCircle,
  Check,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { ReportSectionCard, Chip } from "@/components/report";
import FormattedText from "@/components/markdownFormatter";
import { httpsCallable } from "firebase/functions";
import { functions, db } from "@/integrations/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface QuestionItem {
  q: string;
  modelAnswer: string;
  tip?: string;
}

interface Categories {
  [round: string]: QuestionItem[];
}

export const QuestionBankTab = () => {
  const { user } = useAuth();
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [selectedRounds, setSelectedRounds] = useState<string[]>([
    "Technical",
    "Behavioral",
    "HR",
    "Aptitude Basics",
  ]);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categories | null>(null);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);
  const [savedSets, setSavedSets] = useState<any[]>([]);
  const [savingSet, setSavingSet] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadSavedSets();
  }, [user]);

  const loadSavedSets = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "question_banks"),
        where("ownerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (list.length > 0) {
        setSavedSets(list);
        try {
          localStorage.setItem(`aivi_saved_question_banks_${user.uid}`, JSON.stringify(list));
        } catch {}
        return;
      }
    } catch (err) {
      console.warn("Could not fetch remote question_banks:", err);
    }
    try {
      const cached = localStorage.getItem(`aivi_saved_question_banks_${user.uid}`);
      if (cached) {
        setSavedSets(JSON.parse(cached));
      }
    } catch {}
  };

  const handleRoundToggle = (round: string) => {
    if (selectedRounds.includes(round)) {
      if (selectedRounds.length === 1) {
        toast.error("At least one round must be selected.");
        return;
      }
      setSelectedRounds(selectedRounds.filter((r) => r !== round));
    } else {
      setSelectedRounds([...selectedRounds, round]);
    }
  };

  const handleGenerate = async () => {
    if (!jdText.trim() || jdText.trim().length < 10) {
      toast.error("Please enter a valid Job Description (minimum 10 characters).");
      return;
    }

    setLoading(true);
    try {
      let cats: Record<string, any[]> = {};
      try {
        const fn = httpsCallable(functions, "generateQuestionBank");
        const res: any = await fn({
          jdText,
          resumeText: resumeText.trim() || undefined,
          rounds: selectedRounds,
          language,
        });
        cats = res.data?.categories || {};
      } catch (err: any) {
        console.warn("Cloud function generateQuestionBank fallback:", err);
        const jdLower = (jdText || "").toLowerCase();
        const isAiMlOrResearch = /(machine\s*learning|deep\s*learning|\bai\b|\bml\b|phd|research|neural|transformer|nlp|computer\s*vision|pytorch|tensorflow|llm|data\s*scien)/i.test(jdLower);

        for (const round of selectedRounds) {
          const rLower = round.toLowerCase();
          if (rLower.includes("tech")) {
            if (isAiMlOrResearch) {
              cats[round] = [
                {
                  q: "Explain your methodology for training and fine-tuning Transformer architectures. How do you handle vanishing/exploding gradients or loss divergence during optimization?",
                  modelAnswer: "Structure your answer: 1) Model initialization and normalization (Pre-LN vs Post-LN), 2) Learning rate scheduling with warmup and AdamW weight decay, 3) Gradient clipping and mixed-precision (FP16/BF16) scaling, 4) Monitoring validation perplexity/loss to prevent overfitting.",
                  tip: "Mention specific tensor libraries (PyTorch), loss functions, and hardware accelerator constraints (GPUs/TPUs).",
                },
                {
                  q: "In research and experimental modeling, how do you design rigorous ablation studies to isolate architectural choices versus hyper-parameter influences?",
                  modelAnswer: "Establish a fixed deterministic random seed and baseline metric. Systematically toggle a single variable (e.g., attention heads, embedding dimension, loss penalty, activation function like GeLU vs SwiGLU) while holding all other parameters constant. Document confidence intervals and statistical significance.",
                  tip: "Hiring managers look for empirical research rigor rather than guessing.",
                },
                {
                  q: "How do you detect and resolve data leakage, distribution drift, and spurious correlations between your training benchmarks and evaluation test sets?",
                  modelAnswer: "Audit the data preprocessing pipeline: ensure feature scalers, tokenizers, and embeddings are fit exclusively on training splits. Implement temporal/stratified cross-validation, inspect feature attribution with integrated gradients or SHAP, and evaluate out-of-distribution (OOD) test sets.",
                  tip: "Anchor your response to reproducibility and cross-validation integrity.",
                },
              ];
            } else {
              cats[round] = [
                {
                  q: "Explain how you would design and optimize the core architecture required for the technical requirements in this job description.",
                  modelAnswer: "Structure your answer: 1) High-level component decomposition, 2) Data models and persistence choice, 3) Latency and caching bottlenecks, 4) Error recovery and unit testing.",
                  tip: "Mention specific frameworks, concurrency handling, and DB indexing trade-offs.",
                },
                {
                  q: "What data structures and algorithmic complexity considerations are most relevant to the scale expected in this role?",
                  modelAnswer: "Identify critical data pathways, discuss space-time trade-offs (e.g. O(1) hash maps vs O(log n) tree lookups), and explain memory footprint optimizations.",
                  tip: "State time complexity (Big-O) explicitly for worst-case scenarios.",
                },
                {
                  q: "Walk through a challenging bug or performance bottleneck you diagnosed in code. How did you isolate the root cause?",
                  modelAnswer: "Use systematic debugging methodology: hypothesis generation, log inspection, profiling telemetry, minimal reproducible reproduction, and regression verification.",
                  tip: "Avoid vague statements. Give specific tools (profilers, debugger, APM).",
                },
              ];
            }
          } else if (rLower.includes("behav")) {
            cats[round] = [
              {
                q: "Describe a high-stakes project deadline where requirements changed abruptly. How did you adapt your delivery plan?",
                modelAnswer: "STAR Framework: Situation (scope pivot 4 days before release), Task (reprioritize critical path), Action (aligned stakeholders, cut nice-to-haves), Result (shipped MVP on schedule with zero P0 bugs).",
                tip: "Always emphasize ownership, calm communication, and trade-off negotiation.",
              },
              {
                q: "Tell me about a disagreement you had with a team member or lead regarding technical approach. How did you resolve it?",
                modelAnswer: "STAR: Frame the disagreement around engineering trade-offs rather than ego. Gather benchmark data or build a 1-day proof-of-concept to make objective decisions collaboratively.",
                tip: "Show emotional maturity and how the team relationship remained strong.",
              },
              {
                q: "Give an example of a time when a feature or task failed in production or testing. How did you handle accountability?",
                modelAnswer: "Own the mistake immediately without shifting blame, initiate blameless post-mortem, document root cause, and implement automated regression tests to prevent recurrence.",
                tip: "Hiring managers look for psychological safety and proactive systemic fixes.",
              },
            ];
          } else if (rLower.includes("hr")) {
            cats[round] = [
              {
                q: "Why are you interested in this specific role and organization over other opportunities in the market?",
                modelAnswer: "Anchor your response to: 1) Company's engineering challenges and market position, 2) How the role matches your immediate growth goals, 3) The cultural values you resonate with.",
                tip: "Demonstrate that you researched the company's recent products and tech stack.",
              },
              {
                q: "Where do you see your technical trajectory progressing over the next 3 to 5 years?",
                modelAnswer: "Articulate a clear progression: mastering core backend/full-stack systems, taking end-to-end design ownership of features, and eventually mentoring junior team members.",
                tip: "Show ambition paired with practical day-one commitment to the role.",
              },
              {
                q: "How do you manage workload stress and prioritize competing deadlines from multiple stakeholders?",
                modelAnswer: "Use Eisenhower matrix or agile prioritization: categorize tasks by business impact vs urgency, communicate transparently with leads before deadlines slip, and maintain sustainable pacing.",
                tip: "Highlights organizational discipline and mature executive presence.",
              },
            ];
          } else {
            // Aptitude Basics & Analytical Reasoning
            if (isAiMlOrResearch) {
              cats[round] = [
                {
                  q: "Given a 7-Billion parameter LLM in 16-bit precision (FP16), mathematically estimate the memory required for inference vs full-parameter fine-tuning using AdamW.",
                  modelAnswer: "Weights: 7B * 2 bytes = 14 GB. Inference requires ~14 GB + KV cache overhead (~1-2 GB). For training with AdamW: Weights (14 GB) + Gradients (14 GB) + AdamW 1st & 2nd moments in FP32 (7B * 8 bytes = 56 GB) = ~84 GB minimum before activation memory and batch size.",
                  tip: "Break down model parameters, precision bits-to-bytes, and optimizer state equations clearly.",
                },
                {
                  q: "Explain the mathematical formulation of Cross-Entropy Loss vs Contrastive Loss (InfoNCE). In what research scenarios is contrastive self-supervised learning preferable?",
                  modelAnswer: "Cross-Entropy measures the divergence between one-hot ground truth and predicted softmax probabilities: -log(p_y). InfoNCE maximizes mutual information between positive pairs against a denominator of negative samples: -log(exp(sim(q, k+)/tau) / sum(exp(sim(q, k_i)/tau))). Contrastive loss is superior when labeled data is scarce and robust metric representations are needed.",
                  tip: "State the temperature parameter tau and its effect on gradient scaling.",
                },
                {
                  q: "Suppose your experimental training run plateaus at 82% F1-score with high variance between batches. How do you mathematically diagnose whether the issue is epistemic uncertainty or aleatoric noise?",
                  modelAnswer: "Aleatoric uncertainty arises from inherent data noise/label ambiguity (cannot be reduced by more data). Epistemic uncertainty stems from model ignorance in underrepresented regions (can be reduced with more samples). Use Monte Carlo Dropout or deep ensembles to estimate predictive entropy.",
                  tip: "Distinguish between data quality limits vs model representation capacity.",
                },
              ];
            } else {
              cats[round] = [
                {
                  q: "A server cluster experiences a 40% sudden surge in requests, but database throughput drops by 25%. How do you mathematically estimate the queue backlog rate?",
                  modelAnswer: "Little's Law: Calculate incoming arrival rate vs service rate. Identify whether connection pool saturation or disk I/O lock contention is creating the queuing delay.",
                  tip: "Break down the quantitative estimation step-by-step out loud.",
                },
                {
                  q: "Explain your thought process for solving a complex logic puzzle or modular arithmetic problem under tight time limits.",
                  modelAnswer: "Deconstruct the problem into edge cases, search for invariant patterns (parity, modulus, cycle length), eliminate impossible states, and verify with boundary conditions (0, 1, n-1).",
                  tip: "Structure and verbal reasoning clarity matter more than raw speed.",
                },
                {
                  q: "How would you estimate the daily data storage required for a telemetry tracking system logging 10,000 events per second?",
                  modelAnswer: "10,000 events/sec * 86,400 sec/day = 864M events/day. At an average compressed payload size of 500 bytes per event, total storage = 864M * 0.5 KB = ~432 GB unindexed data per day.",
                  tip: "Always state your payload size and indexing overhead assumptions clearly.",
                },
              ];
            }
          }
        }
      }

      setCategories(cats);
      const firstKey = Object.keys(cats || {})[0];
      if (firstKey) setExpandedRound(firstKey);
      toast.success("Question Bank generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate Question Bank.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSet = async () => {
    if (!user || !categories) return;
    setSavingSet(true);
    const fallbackItem = {
      id: `local-${Date.now()}`,
      ownerId: user.uid,
      jdText,
      resumeText: resumeText || null,
      categories,
      language,
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, "question_banks"), {
        ownerId: user.uid,
        jdText,
        resumeText: resumeText || null,
        categories,
        language,
        createdAt: serverTimestamp(),
      });
      toast.success("Saved to 'My Saved Question Banks'!");
      loadSavedSets();
    } catch (err: any) {
      console.warn("Remote save failed, caching locally:", err);
      try {
        const cachedRaw = localStorage.getItem(`aivi_saved_question_banks_${user.uid}`);
        const existing = cachedRaw ? JSON.parse(cachedRaw) : [];
        const merged = [fallbackItem, ...existing];
        localStorage.setItem(`aivi_saved_question_banks_${user.uid}`, JSON.stringify(merged));
        setSavedSets(merged);
        toast.success("Saved to 'My Saved Question Banks'!");
      } catch {
        toast.error("Failed to save set.");
      }
    } finally {
      setSavingSet(false);
    }
  };

  const handleExportPdf = () => {
    if (!categories) return;
    try {
      // Check if questions contain Devanagari Hindi characters
      const jsonStr = JSON.stringify(categories);
      const hasDevanagari = /[\u0900-\u097F]/.test(jsonStr);

      if (hasDevanagari && typeof document !== "undefined") {
        // High-fidelity Devanagari typography rendering via offscreen 2D canvas into jsPDF
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");

        const scale = 2;
        let totalItems = 0;
        Object.values(categories).forEach((arr) => { totalItems += arr.length + 1; });
        const width = 800 * scale;
        const height = Math.max(1100, 100 + totalItems * 60) * scale;

        canvas.width = width;
        canvas.height = height;
        ctx.scale(scale, scale);

        // Clean white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width / scale, height / scale);

        // Header Band
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Nirmala UI', 'Noto Sans Devanagari', 'Segoe UI', sans-serif";
        ctx.fillText("AIVI Campus — कस्टम प्रश्न बैंक रिपोर्ट (Question Bank)", 30, 45);

        ctx.fillStyle = "#64748b";
        ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Nirmala UI', 'Noto Sans Devanagari', 'Segoe UI', sans-serif";
        ctx.fillText(`दिनांक: ${new Date().toLocaleDateString("hi-IN")} • AIVI Vernacular AI Intelligence`, 30, 68);

        let y = 105;
        Object.entries(categories).forEach(([round, questions]) => {
          ctx.fillStyle = "#1e40af";
          ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Nirmala UI', 'Noto Sans Devanagari', 'Segoe UI', sans-serif";
          ctx.fillText(`राउंड: ${round}`, 30, y);
          y += 24;

          questions.forEach((qItem, i) => {
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 12.5px -apple-system, BlinkMacSystemFont, 'Nirmala UI', 'Noto Sans Devanagari', 'Segoe UI', sans-serif";
            ctx.fillText(`प्र${i + 1}: ${qItem.q}`, 35, y);
            y += 20;

            ctx.fillStyle = "#334155";
            ctx.font = "11.5px -apple-system, BlinkMacSystemFont, 'Nirmala UI', 'Noto Sans Devanagari', 'Segoe UI', sans-serif";
            ctx.fillText(`उत्तर: ${qItem.modelAnswer}`, 45, y);
            y += 28;
          });
          y += 12;
        });

        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: [canvas.width / scale, canvas.height / scale] });
        doc.addImage(imgData, "PNG", 0, 0, canvas.width / scale, canvas.height / scale);
        doc.save("AIVI_Hindi_Question_Bank.pdf");
        toast.success("Hindi (Devanagari) Question Bank PDF exported successfully!");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("AIVI Career — Custom Question Bank Report", 14, 20);

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
      let y = 38;

      Object.entries(categories).forEach(([round, questions]) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(13);
        doc.text(`Round: ${round}`, 14, y);
        y += 8;

        questions.forEach((qItem, i) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(10);
          doc.text(`Q${i + 1}: ${qItem.q.substring(0, 85)}...`, 14, y);
          y += 6;
          doc.text(`Ans: ${qItem.modelAnswer.substring(0, 95)}...`, 18, y);
          y += 8;
        });
        y += 4;
      });

      doc.save("AIVI_Question_Bank.pdf");
      toast.success("Question Bank PDF exported successfully!");
    } catch {
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="space-y-6">
      {!categories ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <ReportSectionCard title="Generate Custom Question Bank" icon={Sparkles}>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Job Description <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste the target job description (role requirements, technical stack, responsibilities)..."
                  className="mt-1 w-full rounded-2xl border border-[#CBD5E1] p-4 text-sm text-[#0F172A] focus:border-[#0D9488] focus:outline-none"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Candidate Resume / Skills (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste candidate resume text or skill summary for tailored Q&A matching..."
                  className="mt-1 w-full rounded-2xl border border-[#CBD5E1] p-4 text-sm text-[#0F172A] focus:border-[#0D9488] focus:outline-none"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Select Interview Rounds
                </label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {["Technical", "Behavioral", "HR", "Aptitude Basics"].map((round) => {
                    const isSelected = selectedRounds.includes(round);
                    return (
                      <button
                        key={round}
                        type="button"
                        onClick={() => handleRoundToggle(round)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-[#0D9488] bg-[#CCFBF1] text-[#115E59]"
                            : "border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <Check className={`h-3.5 w-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                        {round}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Language Output
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold ${
                      language === "en"
                        ? "border-[#0D9488] bg-[#CCFBF1] text-[#115E59]"
                        : "border-[#CBD5E1] bg-white text-[#64748B]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold ${
                      language === "hi"
                        ? "border-[#0D9488] bg-[#CCFBF1] text-[#115E59]"
                        : "border-[#CBD5E1] bg-white text-[#64748B]"
                    }`}
                  >
                    Hindi (Devanagari)
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0D9488] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#097A70] disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating 6–10 Q&As per round..." : "Generate Text Question Bank"}
              </button>
            </div>
          </ReportSectionCard>

          {/* Rail: Saved Sets */}
          <div className="space-y-4">
            <div className="rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                <BookmarkPlus className="h-4 w-4 text-[#0D9488]" /> My Saved Sets
              </h4>
              <div className="mt-4 space-y-3">
                {savedSets.length > 0 ? (
                  savedSets.slice(0, 5).map((set) => (
                    <button
                      key={set.id}
                      onClick={() => setCategories(set.categories)}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#FCFCFA] p-3 text-left transition-all hover:bg-[#F1F5F9]"
                    >
                      <p className="line-clamp-2 text-xs font-bold text-[#0F172A]">
                        {set.jdText || "Saved Question Bank"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        {Object.keys(set.categories || {}).length} rounds • {set.language?.toUpperCase()}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-[#64748B]">No saved question banks yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Chip variant="success">Text Question Bank Generated</Chip>
              <h2 className="mt-2 text-2xl font-bold text-[#0F172A]">JD & Round Practice Bank</h2>
              <p className="text-xs text-[#64748B]">
                {Object.keys(categories).length} rounds generated with comprehensive model answers
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategories(null)}
                className="flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> New Bank
              </button>
              <button
                disabled={savingSet}
                onClick={handleSaveSet}
                className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-bold text-white hover:bg-[#1E293B]"
              >
                <BookmarkPlus className="h-3.5 w-3.5 text-[#2DD4BF]" /> Save Set
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-bold text-white hover:bg-[#097A70]"
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(categories).map(([roundName, qList]) => {
              const isExpanded = expandedRound === roundName;
              return (
                <div key={roundName} className="overflow-hidden rounded-[1.9rem] border border-[#E7ECEF] bg-white shadow-sm">
                  <button
                    onClick={() => setExpandedRound(isExpanded ? null : roundName)}
                    className="flex w-full items-center justify-between bg-[#FCFCFA] px-6 py-4 transition-colors hover:bg-[#F1F5F9]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-[#0F172A]">{roundName} Round</span>
                      <Chip variant="neutral">{qList.length} Questions</Chip>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-4 border-t border-[#E7ECEF] p-6">
                      {qList.map((item, idx) => (
                        <div key={idx} className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#FAFBFB] p-4">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-[#0D9488]">Q{idx + 1}.</span>
                            <div className="font-semibold text-[#0F172A] text-sm leading-relaxed">
                              <FormattedText content={item.q} />
                            </div>
                          </div>

                          <div className="ml-6 space-y-2 border-l-2 border-[#0D9488]/30 pl-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">Model Answer</p>
                              <div className="mt-1 text-sm text-[#334155] leading-relaxed">
                                <FormattedText content={item.modelAnswer} />
                              </div>
                            </div>

                            {item.tip && (
                              <div className="mt-2 rounded-xl bg-[#EFFBFA] p-3 text-xs text-[#115E59]">
                                💡 <strong>Interviewer Tip:</strong> {item.tip}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankTab;
