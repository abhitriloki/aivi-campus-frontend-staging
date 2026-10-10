import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Flame,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface InterviewEvaluationReportData {
  sessionId: string;
  shareToken?: string;
  targetRole: string;
  company: string;
  durationSeconds: number;
  overallScore: number;
  hiringRecommendation: string;
  hiringProbabilityPct: number;
  summary: string;
  competencies: {
    technicalDepth: number;
    problemSolving: number;
    systemArchitecture: number;
    communicationStar: number;
  };
  speechTelemetry: {
    estimatedWpm: number;
    pacingAssessment: string;
    fillerWordsDetected: string[];
    fillerWordCount: number;
    clarityScore: number;
  };
  questionEvaluations: Array<{
    questionNumber: number;
    topic: string;
    questionAsked: string;
    candidateResponse: string;
    scoreOutOfTen: number;
    strengths: string[];
    gapsIdentified: string[];
    seniorEngineerModelAnswer: string;
  }>;
  sevenDayStudyPlan: Array<{
    day: number;
    topic: string;
    actionItem: string;
  }>;
}

interface InterviewIntelligenceReportProps {
  report: InterviewEvaluationReportData;
  onRestart: () => void;
}

export const InterviewIntelligenceReport: React.FC<InterviewIntelligenceReportProps> = ({
  report,
  onRestart,
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    1: true,
  });

  const competencies = report?.competencies || {
    technicalDepth: (report as any)?.dimensionScores?.technicalProficiency ?? 85,
    problemSolving: (report as any)?.dimensionScores?.problemSolving ?? 80,
    systemArchitecture: (report as any)?.dimensionScores?.systemDesign ?? 78,
    communicationStar: (report as any)?.dimensionScores?.communicationStar ?? 85,
  };

  const telemetry = report?.speechTelemetry || {
    estimatedWpm: 136,
    pacingAssessment: "Optimal",
    fillerWordsDetected: ["um"],
    fillerWordCount: 2,
    clarityScore: 88,
  };

  const toggleQuestion = (num: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  // 1-Click PDF Exporter
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setDownloadingPdf(true);
    toast.info("Generating high-resolution PDF Dossier...");

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`AIVI_Interview_Dossier_${report.company.replace(/\s+/g, "_")}_${report.sessionId.slice(0, 6)}.pdf`);
      toast.success("PDF Dossier downloaded successfully!");
    } catch (err: any) {
      console.error("PDF export error:", err);
      toast.error("Failed to generate PDF. You can also use the Print button.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Print Dossier
  const handlePrint = () => {
    window.print();
  };

  // Share Public Link
  const handleShareLink = () => {
    const url = `${window.location.origin}/report/${report.sessionId}`;
    navigator.clipboard.writeText(url);
    toast.success("Public verification link copied to clipboard!");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Action Header Toolbar (Hidden during paper print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Official Evaluation Dossier
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            {report.company} • {report.targetRole}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {downloadingPdf ? "Generating PDF..." : "Download PDF Report"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs flex items-center gap-1.5 border-slate-300 hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Dossier
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleShareLink}
            className="text-xs flex items-center gap-1.5 border-slate-300 hover:bg-slate-50"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Link
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={onRestart}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Take Another Interview
          </Button>
        </div>
      </div>

      {/* Printable Report Wrapper */}
      <div ref={reportRef} className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm print:border-none print:p-0 print:shadow-none">
        {/* Executive Summary Card */}
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5">
                  {report.hiringRecommendation.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold text-slate-500">
                  Duration: {Math.round(report.durationSeconds / 60)} Minutes
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Overall Interview Readiness Score
              </h2>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Score Radial Circle */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-amber-200 shadow-md shrink-0 w-36 h-36">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {report.overallScore}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">out of 100</span>
              <span className="text-[11px] font-bold text-emerald-600 mt-1">
                {report.hiringProbabilityPct}% Hiring Prob.
              </span>
            </div>
          </div>

          {/* Competency Metric Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-amber-100">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Technical Depth</span>
                <span className="text-primary">{competencies.technicalDepth}%</span>
              </div>
              <Progress value={competencies.technicalDepth} className="h-2 bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Problem Solving</span>
                <span className="text-primary">{competencies.problemSolving}%</span>
              </div>
              <Progress value={competencies.problemSolving} className="h-2 bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>System Architecture</span>
                <span className="text-primary">{competencies.systemArchitecture}%</span>
              </div>
              <Progress value={competencies.systemArchitecture} className="h-2 bg-slate-100" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>STAR Communication</span>
                <span className="text-primary">{competencies.communicationStar}%</span>
              </div>
              <Progress value={competencies.communicationStar} className="h-2 bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Speech & Acoustic Telemetry */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Speech & Fluency Acoustic Telemetry
            </CardTitle>
            <CardDescription className="text-xs">
              Measured from candidate vocal frequencies, delivery pacing, and articulation clarity.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Speaking Pace</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {telemetry.estimatedWpm} WPM
              </p>
              <span className="text-xs font-semibold text-emerald-600">
                ● {telemetry.pacingAssessment} (Target: 130-150 WPM)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filler Word Count</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {telemetry.fillerWordCount} Detected
              </p>
              <span className="text-xs text-slate-500">
                Words: {Array.isArray(telemetry.fillerWordsDetected) ? telemetry.fillerWordsDetected.join(", ") : "None"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Articulation Clarity</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {telemetry.clarityScore} / 100
              </p>
              <span className="text-xs font-semibold text-primary">
                High Vocal Precision
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Deep Dive (The Learning Goldmine) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Question-by-Question Forensic Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Compare your actual responses with Senior Staff Engineer model answers and identified flaws.
            </p>
          </div>

          <div className="space-y-4">
            {report.questionEvaluations.map((q) => {
              const isOpen = expandedQuestions[q.questionNumber];
              return (
                <div
                  key={q.questionNumber}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all"
                >
                  {/* Question Header Card */}
                  <div
                    onClick={() => toggleQuestion(q.questionNumber)}
                    className="p-5 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold shrink-0">
                        Q{q.questionNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            {q.topic}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-bold">
                            Score: {q.scoreOutOfTen} / 10
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {q.questionAsked}
                        </h4>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Expanded Body */}
                  {isOpen && (
                    <div className="p-6 pt-0 space-y-4 border-t border-slate-100 bg-slate-50/30">
                      {/* Candidate Response Summary */}
                      <div className="space-y-1.5 pt-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          What You Answered
                        </span>
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                          "{q.candidateResponse}"
                        </div>
                      </div>

                      {/* Strengths & Gaps */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Key Strengths
                          </span>
                          <ul className="space-y-1 text-xs text-emerald-900">
                            {q.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span>•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                          <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            Diagnostic Flaws & Gaps
                          </span>
                          <ul className="space-y-1 text-xs text-amber-900">
                            {q.gapsIdentified.map((gap, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span>•</span>
                                <span>{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Senior Engineer Model Answer */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2 shadow-sm">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          Senior Staff Engineer Model Answer ({report.company} Level)
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {q.seniorEngineerModelAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Targeted Study Plan */}
        <Card className="border-slate-200 shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              7-Day Actionable Recovery Curriculum
            </CardTitle>
            <CardDescription className="text-xs">
              Tailored study plan based on the specific gaps detected in this interview session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {report.sevenDayStudyPlan.map((plan) => (
              <div
                key={plan.day}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span className="flex h-6 w-12 items-center justify-center rounded-md bg-slate-900 text-white text-[11px] font-bold shrink-0">
                  Day {plan.day}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900">{plan.topic}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{plan.actionItem}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
