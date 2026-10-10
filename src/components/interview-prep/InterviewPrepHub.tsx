import { useState } from "react";
import { BookOpen, Building2, Bot } from "lucide-react";
import QuestionBankTab from "./QuestionBankTab";
import CompanyLibraryTab from "./CompanyLibraryTab";
import { MockInterviewRoom } from "@/pages/InterviewPrep";

interface InterviewPrepHubProps {
  defaultTab?: "bank" | "company" | "mock";
}

export const InterviewPrepHub: React.FC<InterviewPrepHubProps> = ({ defaultTab = "mock" }) => {
  const [activeTab, setActiveTab] = useState<"bank" | "company" | "mock">(defaultTab);

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Top Banner / Segmented Tab Control */}
      <div className="flex flex-col gap-4 rounded-[1.9rem] border border-[#E7ECEF] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">
            Interview Intelligence Hub
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0F172A]">Practice & Master Career Interviews</h1>
        </div>

        {/* Segmented Control - Stacked at 375px */}
        <div className="flex flex-col gap-1.5 rounded-2xl bg-[#F1F5F9] p-1.5 sm:flex-row">
          <button
            onClick={() => setActiveTab("bank")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "bank"
                ? "bg-white text-[#0D9488] shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Question Bank
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "company"
                ? "bg-white text-[#0D9488] shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Company Packs (36+)
          </button>

          <button
            onClick={() => setActiveTab("mock")}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "mock"
                ? "bg-white text-[#0D9488] shadow-sm"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Bot className="h-4 w-4" />
            Mock Interview Room
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "bank" && <QuestionBankTab />}
      {activeTab === "company" && <CompanyLibraryTab />}
      {activeTab === "mock" && <MockInterviewRoom />}
    </div>
  );
};

export default InterviewPrepHub;
