import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Plus,
  Send,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ReportSectionCard, Chip } from "@/components/report";
import FormattedText from "@/components/markdownFormatter";
import { httpsCallable } from "firebase/functions";
import { functions, db } from "@/integrations/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import registryData from "../../../scripts/seed-data/companyPacks.registry.json";
import { COMPANY_PACKS_DATA, QuestionDoc } from "@/data/companyPacksData";

interface CompanyPack {
  company: string;
  companySlug: string;
  industryGroup: string;
  roleTracks: string[];
  hiringType?: string;
  logoLetter: string;
  difficultyFocus?: string;
  version?: string;
  questionCount?: number;
  isCustom?: boolean;
  reviewStatus?: "curated" | "unreviewed";
  disclaimer?: string;
  ownerId?: string | null;
  seeded?: boolean;
}

export const CompanyLibraryTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedPack, setSelectedPack] = useState<CompanyPack | null>(null);
  const [packQuestions, setPackQuestions] = useState<QuestionDoc[]>([]);
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>("All");
  const [loadingPack, setLoadingPack] = useState(false);
  const [customPacks, setCustomPacks] = useState<CompanyPack[]>([]);

  // Other Modal State
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customRoleTrack, setCustomRoleTrack] = useState("");
  const [generatingCustom, setGeneratingCustom] = useState(false);
  const [requestingPack, setRequestingPack] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadCustomPacks();
  }, [user]);

  const loadCustomPacks = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "company_question_packs"),
        where("ownerId", "==", user.uid),
        where("isCustom", "==", true)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ companySlug: doc.id, ...doc.data() } as CompanyPack));
      setCustomPacks(list);
    } catch {
    }
  };

  const loadPackQuestions = async (pack: CompanyPack) => {
    const slug = pack.companySlug || (pack as any).slug || "";
    setSelectedPack({ ...pack, companySlug: slug });
    setLoadingPack(true);
    try {
      // 1. Static lookup for 36 curated company packs (100% instant, guaranteed synchronous)
      if (slug && COMPANY_PACKS_DATA[slug]?.questions?.length > 0) {
        setPackQuestions(COMPANY_PACKS_DATA[slug].questions);
        setLoadingPack(false);
        return;
      }

      // 2. Fallback to Firestore subcollection query (for user custom generated packs)
      if (slug) {
        const qSnap = await getDocs(
          collection(db, "company_question_packs", slug, "questions")
        );
        if (!qSnap.empty) {
          const list = qSnap.docs.map((doc) => doc.data() as QuestionDoc);
          setPackQuestions(list);
          return;
        }
      }
      setPackQuestions([]);
    } catch (err) {
      console.warn("Error loading pack questions:", err);
      setPackQuestions([]);
    } finally {
      setLoadingPack(false);
    }
  };

  const handleGenerateCustom = async () => {
    if (!customCompanyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }
    setGeneratingCustom(true);
    try {
      const fn = httpsCallable(functions, "generateCustomQuestionPack");
      const res: any = await fn({
        companyName: customCompanyName.trim(),
        roleTrack: customRoleTrack.trim() || undefined,
      });

      setShowOtherModal(false);
      setCustomCompanyName("");
      setCustomRoleTrack("");
      toast.success("Custom Question Pack generated!");
      loadCustomPacks();
      loadPackQuestions(res.data.packData);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate custom pack.");
    } finally {
      setGeneratingCustom(false);
    }
  };

  const handleRequestPack = async () => {
    if (!customCompanyName.trim()) {
      toast.error("Please enter a company name to request.");
      return;
    }
    setRequestingPack(true);
    try {
      const fn = httpsCallable(functions, "requestCompanyPack");
      const res: any = await fn({ companyName: customCompanyName.trim() });
      toast.success(res.data.message || "Noted — we review requests weekly.");
      setShowOtherModal(false);
    } catch (err: any) {
      toast.error(err.message || "Request failed.");
    } finally {
      setRequestingPack(false);
    }
  };

  const allPacks = useMemo(() => {
    const registryPacks = (registryData as any[]).map((p) => ({
      ...p,
      companySlug: p.companySlug || p.slug || "",
    })) as CompanyPack[];
    return [...registryPacks, ...customPacks];
  }, [customPacks]);

  const filteredPacks = useMemo(() => {
    return allPacks.filter((pack) => {
      const matchesSearch =
        pack.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pack.industryGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pack.roleTracks.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry = selectedIndustry === "All" || pack.industryGroup === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });
  }, [allPacks, searchQuery, selectedIndustry]);

  const groupedPacks = useMemo(() => {
    const groups: { [key: string]: CompanyPack[] } = {};
    filteredPacks.forEach((pack) => {
      const group = pack.industryGroup || "Other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(pack);
    });
    return groups;
  }, [filteredPacks]);

  const filteredQuestions = useMemo(() => {
    if (selectedRoundFilter === "All") return packQuestions;
    return packQuestions.filter((q) => q.round === selectedRoundFilter);
  }, [packQuestions, selectedRoundFilter]);

  return (
    <div className="space-y-6">
      {!selectedPack ? (
        <div className="space-y-6">
          {/* Top Bar & Filters */}
          <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search 36+ companies (e.g. TCS, Amazon, Deloitte, Google)..."
                className="w-full rounded-2xl border border-[#CBD5E1] py-3 pl-11 pr-4 text-sm text-[#0F172A] focus:border-[#0D9488] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "IT Services & Consulting",
                "Product & Big Tech",
                "Big 4 & Consulting",
                "Banking & Financial Services",
                "Fintech & E-Commerce",
                "Custom Packs",
              ].map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    selectedIndustry === ind
                      ? "border-[#0D9488] bg-[#CCFBF1] text-[#115E59]"
                      : "border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {ind}
                </button>
              ))}
              <button
                onClick={() => setShowOtherModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#097A70]"
              >
                <Plus className="h-4 w-4" /> Other Company
              </button>
            </div>
          </div>

          {/* Grouped Company Catalog */}
          <div className="space-y-8">
            {Object.entries(groupedPacks).map(([groupName, packs]) => (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                  <Building2 className="h-4 w-4 text-[#0D9488]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                    {groupName} ({packs.length})
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {packs.map((pack) => (
                    <motion.div
                      key={pack.companySlug}
                      onClick={() => loadPackQuestions(pack)}
                      className="cursor-pointer overflow-hidden rounded-[1.6rem] border border-[#E7ECEF] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#0D9488] hover:shadow-md"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-lg font-extrabold text-[#2DD4BF]">
                            {pack.logoLetter}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#0F172A]">{pack.company}</h4>
                            <p className="text-xs text-[#64748B]">{pack.hiringType || "On-Campus"}</p>
                          </div>
                        </div>

                        {pack.isCustom ? (
                          <Chip variant="warning">Unreviewed</Chip>
                        ) : (
                          <Chip variant="success">Curated</Chip>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {pack.roleTracks.map((role) => (
                          <span
                            key={role}
                            className="rounded-lg bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#334155]"
                          >
                            {role}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3 text-xs font-semibold text-[#64748B]">
                        <span>{pack.questionCount || 26} Practice Qs</span>
                        <span className="flex items-center text-[#0D9488] font-bold">
                          View Pack <ChevronRight className="h-4 w-4 ml-0.5" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Pack Detail View */
        <div className="space-y-6">
          <div className="space-y-4 rounded-[1.9rem] border border-[#E7ECEF] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F172A] text-2xl font-extrabold text-[#2DD4BF]">
                  {selectedPack.logoLetter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#0F172A]">{selectedPack.company}</h2>
                    {selectedPack.isCustom ? (
                      <Chip variant="warning">Unreviewed AI draft</Chip>
                    ) : (
                      <Chip variant="success">Curated Pack</Chip>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B]">
                    {selectedPack.industryGroup} • {selectedPack.roleTracks.join(", ")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPack(null)}
                className="self-start rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                ← Back to Catalog
              </button>
            </div>

            {/* Verbatim Disclaimer Header */}
            <div className="rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-3 text-xs text-[#92400E] font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" />
              <span>{selectedPack.disclaimer || "Practice questions based on commonly reported candidate interview experiences. Not official company content."}</span>
            </div>

            {/* Round Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["All", "Aptitude Basics", "Technical", "Behavioral", "HR"].map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRoundFilter(round)}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedRoundFilter === round
                      ? "border-[#0D9488] bg-[#CCFBF1] text-[#115E59]"
                      : "border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {round}
                </button>
              ))}
            </div>
          </div>

          {/* Question List Accordions */}
          {loadingPack ? (
            <div className="p-12 text-center text-sm font-semibold text-[#64748B]">
              Loading {selectedPack.company} question pack...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => (
                <div key={idx} className="rounded-[1.6rem] border border-[#E7ECEF] bg-white p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Chip variant="neutral">{q.round}</Chip>
                      <Chip variant={q.difficulty === "hard" ? "danger" : q.difficulty === "medium" ? "warning" : "success"}>
                        {q.difficulty || "medium"}
                      </Chip>
                      <Chip variant="neutral">{q.frequency || "common"}</Chip>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {q.tags?.map((t) => (
                        <span key={t} className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#0D9488]">Q{idx + 1}.</span>
                    <div className="text-sm font-semibold text-[#0F172A] leading-relaxed">
                      <FormattedText content={q.text} />
                    </div>
                  </div>

                  <div className="ml-6 border-l-2 border-[#0D9488]/30 pl-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">Model Answer</p>
                    <div className="text-sm text-[#334155] leading-relaxed">
                      <FormattedText content={q.modelAnswer} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OTHER COMPANY MODAL */}
      {showOtherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[1.9rem] border border-[#E2E8F0] bg-white p-6 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F172A]">Generate Custom Company Pack</h3>
              <button onClick={() => setShowOtherModal(false)} className="text-sm font-bold text-[#64748B]">✕</button>
            </div>

            <p className="text-xs text-[#64748B]">
              Can't find your target company in the 36 curated packs? Generate an on-demand AI custom pack (~20 Qs).
            </p>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Company Name *</label>
              <input
                type="text"
                placeholder="e.g. Swiggy, Cred, Intel, NVIDIA"
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] p-3 text-sm text-[#0F172A]"
                value={customCompanyName}
                onChange={(e) => setCustomCompanyName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Role Track (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Backend Engineer, Data Analyst"
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] p-3 text-sm text-[#0F172A]"
                value={customRoleTrack}
                onChange={(e) => setCustomRoleTrack(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                disabled={generatingCustom}
                onClick={handleGenerateCustom}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0D9488] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#097A70]"
              >
                <Sparkles className="h-4 w-4" />
                {generatingCustom ? "Generating Custom Pack..." : "Generate AI Custom Pack (~20 Qs)"}
              </button>

              <button
                disabled={requestingPack}
                onClick={handleRequestPack}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white py-3 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                <Send className="h-3.5 w-3.5" />
                {requestingPack ? "Submitting Request..." : "Request Official Curated Pack"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CompanyLibraryTab;
