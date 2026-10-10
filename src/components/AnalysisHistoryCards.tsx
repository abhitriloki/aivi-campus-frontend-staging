import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Clock, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { getAnalysisHistory, clearAnalysisHistory } from "@/services/analysisService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HistoryItem {
  id: string;
  createdAt: any;
  result: any;
  scores: any;
  label: string;
  sublabel?: string;
}

interface Props {
  analysisType: string;
  onSelect: (result: any, scores: any) => void;
  labelExtractor?: (result: any) => { label: string; sublabel?: string };
}

const AnalysisHistoryCards = ({ analysisType, onSelect, labelExtractor }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getAnalysisHistory(user.uid, analysisType, 20);
        const defaultExtractor = (row: any) => ({
          label: row?.title || row?.targetRole || row?.jobTitle || `${analysisType.replace(/_/g, " ").toUpperCase()} Analysis`,
          sublabel: row?.overallScore || row?.score ? `Score: ${row.overallScore || row.score}%` : undefined,
        });
        const extractor = typeof labelExtractor === "function" ? labelExtractor : defaultExtractor;

        if (Array.isArray(data)) {
          setHistory(
            data.map((row: any) => {
              let extracted = { label: "Analysis Record", sublabel: undefined as string | undefined };
              try {
                extracted = extractor(row) || extracted;
              } catch (e) {
                console.warn("Error extracting label for history row:", e);
              }
              const rowId = row.id || `hist_${Math.random()}`;
              return {
                id: rowId,
                createdAt: row.createdAt,
                result: typeof row === "object" && row !== null ? { ...row, id: rowId } : row,
                scores: row.scores,
                label: extracted.label,
                sublabel: extracted.sublabel,
              };
            })
          );
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Failed to fetch analysis history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, analysisType, labelExtractor]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-[#66727C]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading history...
      </div>
    );
  }

  if (history.length === 0) return null;

  const formatDate = (ts: any) => {
    if (!ts) return "";
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmClear = async () => {
    if (!user) {
      setHistory([]);
      return;
    }
    setClearing(true);
    try {
      await clearAnalysisHistory(user.uid, analysisType);
      setHistory([]);
      toast({
        title: "History Cleared",
        description: "All previous analyses have been permanently deleted.",
      });
    } catch (err) {
      console.error("Failed to clear analysis history:", err);
      toast({
        title: "Clear Failed",
        description: "Could not completely clear history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#66727C]" />
          <h3 className="text-sm font-semibold text-[#112031]">Previous Analyses</h3>
          <span className="rounded-full bg-[#F3F7F8] px-2 py-0.5 text-xs text-[#66727C]">
            {history.length}
          </span>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#EF4444]">Clear all?</span>
            <button
              onClick={handleConfirmClear}
              disabled={clearing}
              className="rounded px-2 py-0.5 text-xs font-semibold bg-[#EF4444] text-white transition-opacity hover:bg-[#DC2626] disabled:opacity-50"
            >
              {clearing ? <Loader2 className="inline h-3 w-3 animate-spin" /> : "Yes, Clear"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={clearing}
              className="rounded px-1.5 py-0.5 text-xs text-[#66727C] transition-colors hover:text-[#112031]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1 text-xs font-medium text-[#7B8892] transition-colors hover:text-[#EF4444]"
          >
            <Trash2 className="h-3 w-3" />
            Clear History
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => onSelect(item.result, item.scores)}
            className="group rounded-[1.5rem] border border-[#E7ECEF] bg-white/94 p-4 text-left shadow-[0_18px_44px_-28px_rgba(17,32,49,0.14)] transition-all hover:-translate-y-0.5 hover:border-[#D5E6E3]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#112031]">{item.label}</p>
                {item.sublabel && (
                  <p className="mt-0.5 truncate text-xs text-[#66727C]">{item.sublabel}</p>
                )}
              </div>
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#8A97A1] transition-colors group-hover:text-[#FF6D4A]" />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#7B8892]">
              <Clock className="h-3 w-3" />
              {formatDate(item.createdAt)}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistoryCards;
