import React from "react";
import { Loader2, FileX, AlertTriangle, Sparkles } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const ReportLoadingState: React.FC<LoadingStateProps> = ({
  message = "Analyzing with AI... Please wait.",
}) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-8 text-center shadow-sm">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFFBFA] text-[#0D9488]">
      <Loader2 className="h-7 w-7 animate-spin text-[#0D9488]" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-[#0F172A]">{message}</h3>
    <p className="mt-1 text-xs text-[#64748B]">Parsing document and evaluating skills against industry benchmark standards.</p>
  </div>
);

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export const ReportEmptyState: React.FC<EmptyStateProps> = ({
  title = "No Analysis Available",
  description = "Upload a document or paste content to generate an instant AI report.",
  onAction,
  actionText = "Start Analysis",
}) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.9rem] border border-[#E7ECEF] bg-white/94 p-8 text-center shadow-sm">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[#64748B]">
      <FileX className="h-7 w-7" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-[#0F172A]">{title}</h3>
    <p className="mt-1 max-w-sm text-xs text-[#64748B]">{description}</p>
    {onAction && (
      <button
        onClick={onAction}
        className="mt-5 flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
      >
        <Sparkles className="h-4 w-4" />
        {actionText}
      </button>
    )}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ReportErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to Generate Report",
  message = "An error occurred while generating the analysis. Please check your connection and try again.",
  onRetry,
}) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[1.9rem] border border-[#FEE2E2] bg-[#FEF2F2]/60 p-8 text-center shadow-sm">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#B91C1C]">
      <AlertTriangle className="h-7 w-7" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-[#B91C1C]">{title}</h3>
    <p className="mt-1 max-w-sm text-xs text-[#7F1D1D]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-5 rounded-xl bg-[#B91C1C] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#991B1B]"
      >
        Try Again
      </button>
    )}
  </div>
);
