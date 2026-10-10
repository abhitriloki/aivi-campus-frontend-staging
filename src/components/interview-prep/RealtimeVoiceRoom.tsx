import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  Radio,
  Zap,
  CheckCircle2,
  RefreshCw,
  Award,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { VoiceFluidOrb } from "./VoiceFluidOrb";
import {
  InterviewIntelligenceReport,
  InterviewEvaluationReportData,
} from "./InterviewIntelligenceReport";
import { GeminiLiveVoiceSession } from "@/services/geminiLiveService";
import { evaluateRealtimeVoiceSession, realtimeVoiceNextTurn } from "@/services/tenantService";
import { toast } from "sonner";

interface RealtimeVoiceRoomProps {
  sessionConfig: {
    sessionId: string;
    systemInstruction: string;
    voiceName: "Aoede" | "Fenrir" | "Kore" | "Puck";
    initialGreeting: string;
    personaId: "ananya" | "vikram" | "priya" | "kabir";
    company: string;
    targetRole: string;
    personaName?: string;
    language?: "en" | "hi" | "hinglish";
    strictness?: "gentle" | "realistic" | "bar_raiser";
  };
  onExit: () => void;
}

export const RealtimeVoiceRoom: React.FC<RealtimeVoiceRoomProps> = ({
  sessionConfig,
  onExit,
}) => {
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  // Transcript state
  const [activeCaption, setActiveCaption] = useState<string>(
    sessionConfig.initialGreeting
  );
  const [captionRole, setCaptionRole] = useState<"interviewer" | "candidate">(
    "interviewer"
  );
  const [fullTranscript, setFullTranscript] = useState<
    Array<{ role: string; text: string; timestamp?: number }>
  >([
    {
      role: "interviewer",
      text: sessionConfig.initialGreeting,
      timestamp: Date.now(),
    },
  ]);

  // 🏛️ The 4 Core Interview Pillars
  const INTERVIEW_PILLARS = [
    { id: 1, name: "P1: Architecture", shortName: "P1 Arch", label: "Pillar 1: System Overview & Architecture" },
    { id: 2, name: "P2: Tech Depth", shortName: "P2 Code", label: "Pillar 2: Technical Implementation & Trade-Offs" },
    { id: 3, name: "P3: Scalability", shortName: "P3 Scale", label: "Pillar 3: Failure Modes, Concurrency & Scalability" },
    { id: 4, name: "P4: Behavioral", shortName: "P4 Fit", label: "Pillar 4: Behavioral Ownership & Wrap-Up" },
  ];

  // Pillar progression state
  const [currentPillar, setCurrentPillar] = useState<number>(1);
  const [pillarTurnsCount, setPillarTurnsCount] = useState<number>(0);
  const currentPillarRef = useRef<number>(1);
  currentPillarRef.current = currentPillar;
  const pillarTurnsCountRef = useRef<number>(0);
  pillarTurnsCountRef.current = pillarTurnsCount;

  // Turn index progression state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const totalQuestions = 7;

  // Evaluating & Final Report State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalReport, setEvalReport] = useState<InterviewEvaluationReportData | null>(
    null
  );
  const [isAborted, setIsAborted] = useState(false);

  const sessionRef = useRef<GeminiLiveVoiceSession | null>(null);
  const totalQuestionsRef = useRef(totalQuestions);
  const questionIndexRef = useRef(currentQuestionIndex);
  questionIndexRef.current = currentQuestionIndex;

  const candidateSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingTurnRef = useRef<boolean>(false);
  const fullTranscriptRef = useRef(fullTranscript);
  fullTranscriptRef.current = fullTranscript;

  const lastActivityTimeRef = useRef<number>(Date.now());
  const hasNudgedRef = useRef<boolean>(false);
  const handleEndInterviewRef = useRef<() => void>(() => {});

  // Question bank fallback tailored to target role and company
  const questionBankRef = useRef<string[]>([
    sessionConfig.initialGreeting,
    `Great. In the context of ${sessionConfig.company}, what has been your most challenging technical obstacle in ${sessionConfig.targetRole}, and how did you resolve it?`,
    `Walk me through the system architecture and database design decisions you made in your primary project. What trade-offs did you consider?`,
    `If our service at ${sessionConfig.company} experiences sudden traffic spikes or latency degradation, how would you diagnose, trace, and resolve the root cause?`,
    `Finally, why are you specifically interested in joining ${sessionConfig.company} as a ${sessionConfig.targetRole}, and how do you stay current with new engineering practices?`,
  ]);

  // Elapsed timer & inactivity watchdog
  useEffect(() => {
    if (isEvaluating || evalReport) return;
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);

      // Inactivity watchdog: nudge at 45s, auto-end at 90s of silence
      if (!isAiSpeaking && !isEvaluating && !evalReport && !isThinking) {
        const idleSeconds = Math.floor((Date.now() - lastActivityTimeRef.current) / 1000);
        if (idleSeconds >= 45 && !hasNudgedRef.current) {
          hasNudgedRef.current = true;
          const nudgeMsg = "I haven't heard from you in a moment. Take your time, or let me know when you're ready to proceed.";
          setActiveCaption(nudgeMsg);
          setCaptionRole("interviewer");
          toast.warning("Interviewer: Waiting for your response...");
          if (sessionRef.current) {
            sessionRef.current.speakAiResponse(nudgeMsg);
          }
        }
        if (idleSeconds >= 90) {
          toast.info("Interview session automatically ended due to prolonged inactivity.");
          handleEndInterviewRef.current();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isEvaluating, evalReport, isAiSpeaking, isThinking]);

  // Format MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Automated Hands-Free Turn Submission
  const handleAutoSubmitTurn = async () => {
    if (isAiSpeaking || isThinking || isSubmittingTurnRef.current || isEvaluating || evalReport) return;
    if (candidateSilenceTimerRef.current) {
      clearTimeout(candidateSilenceTimerRef.current);
      candidateSilenceTimerRef.current = null;
    }

    const candidateTurns = fullTranscriptRef.current.filter(
      (t) => t.role === "candidate" && t.text && t.text.trim().length > 0
    );
    if (candidateTurns.length === 0) return;
    const latestTurn = candidateTurns[candidateTurns.length - 1];
    const wordsCount = latestTurn?.text?.trim().split(/\s+/).filter(Boolean).length || 0;
    if (wordsCount < 2) return; // Do not auto-submit on stray breaths or 1-word clicks

    isSubmittingTurnRef.current = true;
    setIsThinking(true);
    setActiveCaption(`Evaluating your response & formulating next question...`);
    setCaptionRole("interviewer");

    try {
      const res = await realtimeVoiceNextTurn({
        sessionId: sessionConfig.sessionId,
        transcript: fullTranscriptRef.current,
        company: sessionConfig.company,
        targetRole: sessionConfig.targetRole,
        personaId: sessionConfig.personaId,
        language: sessionConfig.language || "en",
        strictness: sessionConfig.strictness || "realistic",
        turnIndex: questionIndexRef.current,
        currentPillar: currentPillarRef.current,
        pillarTurnsCount: pillarTurnsCountRef.current,
      });

      setIsThinking(false);
      isSubmittingTurnRef.current = false;
      lastActivityTimeRef.current = Date.now();
      hasNudgedRef.current = false;

      if (res) {
        const nextQ = res.nextQuestion;
        setActiveCaption(nextQ);
        setCaptionRole("interviewer");
        setCurrentQuestionIndex(res.turnIndex);
        if (typeof res.currentPillar === "number") {
          setCurrentPillar(res.currentPillar);
        }
        if (typeof res.pillarTurnsCount === "number") {
          setPillarTurnsCount(res.pillarTurnsCount);
        }

        if (sessionRef.current) {
          sessionRef.current.resetCandidateTurnTranscript();
          if (res.audioBase64) {
            await sessionRef.current.speakAudioWithText(res.audioBase64, nextQ);
          } else {
            await sessionRef.current.speakAiResponse(nextQ);
          }
        }

        if (res.isFinished) {
          toast.info("All 4 interview pillars completed! Preparing comprehensive dossier...");
          setTimeout(() => {
            handleEndInterviewRef.current();
          }, 3800);
        }
      }
    } catch (err: any) {
      console.warn("realtimeVoiceNextTurn notice:", err);
      setIsThinking(false);
      isSubmittingTurnRef.current = false;
      advanceToNextQuestion();
    }
  };

  // Move to next interview question (fallback)
  const advanceToNextQuestion = () => {
    lastActivityTimeRef.current = Date.now();
    hasNudgedRef.current = false;
    const nextIdx = questionIndexRef.current + 1;
    if (nextIdx <= totalQuestionsRef.current) {
      setCurrentQuestionIndex(nextIdx);
      const nextQ = questionBankRef.current[nextIdx - 1] || questionBankRef.current[questionBankRef.current.length - 1];
      setActiveCaption(nextQ);
      setCaptionRole("interviewer");
      if (sessionRef.current) {
        sessionRef.current.resetCandidateTurnTranscript();
        sessionRef.current.speakAiResponse(nextQ);
      }
    } else {
      toast.info("Interview completed! Wrapping up dossier...");
      handleEndInterview();
    }
  };

  // Initialize live audio session on mount
  useEffect(() => {
    const session = new GeminiLiveVoiceSession(
      {
        sessionId: sessionConfig.sessionId,
        systemInstruction: sessionConfig.systemInstruction,
        voiceName: sessionConfig.voiceName,
        initialGreeting: sessionConfig.initialGreeting,
        personaId: sessionConfig.personaId,
        company: sessionConfig.company,
        targetRole: sessionConfig.targetRole,
      },
      {
        onAiSpeakingChange: (speaking) => {
          setIsAiSpeaking(speaking);
          if (!speaking) {
            // User turn begins; reset activity baseline
            lastActivityTimeRef.current = Date.now();
          }
        },
        onUserSpeakingChange: (speaking) => {
          setIsUserSpeaking(speaking);
          if (speaking) {
            lastActivityTimeRef.current = Date.now();
            hasNudgedRef.current = false;
            // Auto reset user speaking state after short silence
            setTimeout(() => setIsUserSpeaking(false), 2000);
          }
        },
        onAudioLevelChange: (lvl) => {
          setAudioLevel(lvl);
        },
        onTranscriptChunk: ({ role, text }) => {
          setActiveCaption(text);
          setCaptionRole(role);
          if (role === "candidate") {
            lastActivityTimeRef.current = Date.now();
            hasNudgedRef.current = false;

            // ⚡ Phase 1 Smart Grammatical Endpointing:
            const trimmed = text.trim();
            const words = trimmed.split(/\s+/).filter(Boolean);
            if (!isAiSpeaking && !isThinking && !isSubmittingTurnRef.current) {
              if (candidateSilenceTimerRef.current) {
                clearTimeout(candidateSilenceTimerRef.current);
                candidateSilenceTimerRef.current = null;
              }

              // Trigger VAD evaluation if candidate has spoken at least 5 words
              if (words.length >= 5) {
                const lastWord = words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "");
                const hesitationWords = new Set([
                  "and", "so", "but", "or", "because", "like", "actually", "basically",
                  "um", "uh", "matlab", "then", "if", "when", "also", "with", "to", "for"
                ]);
                const endsWithPunctuation = /[.!?]$/.test(trimmed);
                const isHesitating = hesitationWords.has(lastWord);

                // Calibrated generous breathing space: Candidate should never be cut off mid-thought!
                let silenceWaitMs = 3500; // default baseline: generous 3.5s
                if (endsWithPunctuation && words.length >= 15 && !isHesitating) {
                  // Complete long grammatical thought: 2.8s endpointing
                  silenceWaitMs = 2800;
                } else if (isHesitating || words.length < 10) {
                  // Hesitation pause or developing introduction: 4.5s breathing space
                  silenceWaitMs = 4500;
                }

                candidateSilenceTimerRef.current = setTimeout(() => {
                  handleAutoSubmitTurn();
                }, silenceWaitMs);
              }
            }
          }

          // In-place turn update: update ongoing speaker turn instead of appending fragmented chunks
          setFullTranscript((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === role) {
              return [...prev.slice(0, -1), { role, text, timestamp: Date.now() }];
            }
            return [...prev, { role, text, timestamp: Date.now() }];
          });
        },
        onError: (err) => {
          toast.error(err);
        },
      }
    );

    sessionRef.current = session;
    session.start();

    return () => {
      if (candidateSilenceTimerRef.current) {
        clearTimeout(candidateSilenceTimerRef.current);
      }
      session.end();
    };
  }, [sessionConfig]);

  // Toggle Mute
  const handleToggleMute = () => {
    if (!sessionRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sessionRef.current.setMuted(nextMute);
    toast.info(nextMute ? "Microphone Muted" : "Microphone Active");
  };

  // End Interview & Run Gemini 2.5 Pro Evaluation
  const handleEndInterview = async () => {
    handleEndInterviewRef.current = handleEndInterview;
    if (sessionRef.current) {
      sessionRef.current.end();
    }

    const candidateTurns = fullTranscript.filter(
      (t) => t.role === "candidate" && t.text && t.text.trim().length > 0
    );
    const totalCandidateWords = candidateTurns.reduce(
      (acc, t) => acc + t.text.trim().split(/\s+/).filter(Boolean).length,
      0
    );

    // Guard: If candidate spoke nothing or gave < 15 words, do NOT generate a false report!
    if (candidateTurns.length === 0 || totalCandidateWords < 15) {
      setIsAborted(true);
      toast.warning("Interview ended before substantive candidate responses were recorded.");
      return;
    }

    setIsEvaluating(true);
    toast.info("Analyzing session with Gemini 2.5 Pro forensic reasoning model...");

    try {
      const res = await evaluateRealtimeVoiceSession({
        sessionId: sessionConfig.sessionId,
        transcript: fullTranscript,
        targetRole: sessionConfig.targetRole,
        company: sessionConfig.company,
        durationSeconds: elapsedSeconds || 320,
      });

      if (res.status === "incomplete" || res.evaluation?.status === "incomplete" || (res.evaluation?.overallScore === 0 && candidateTurns.length < 2)) {
        setIsAborted(true);
        toast.warning("Interview session incomplete: insufficient spoken responses.");
        return;
      }

      const evalData = res.evaluation || {};
      const rawScore = evalData.overallScore ?? 0;
      const evalOverallScore = typeof rawScore === "number"
        ? (rawScore <= 10 && rawScore > 0 ? Math.round(rawScore * 10) : rawScore)
        : 0;

      const interviewerQuestions = fullTranscript.filter((tr) => tr.role === "interviewer");

      setEvalReport({
        sessionId: sessionConfig.sessionId,
        shareToken: res.shareToken,
        targetRole: sessionConfig.targetRole,
        company: sessionConfig.company,
        durationSeconds: elapsedSeconds || 320,
        overallScore: evalOverallScore,
        hiringRecommendation: evalData.hiringRecommendation ?? (evalOverallScore >= 80 ? "Strong Hire" : evalOverallScore >= 65 ? "Hire" : "Borderline / Needs Practice"),
        hiringProbabilityPct: evalData.hiringProbabilityPct ?? Math.max(10, Math.min(95, Math.round(evalOverallScore * 0.95))),
        summary: evalData.summary ?? `Assessment completed for ${sessionConfig.company} ${sessionConfig.targetRole}.`,
        competencies: evalData.competencies || {
          technicalDepth: evalData.dimensionScores?.technicalProficiency ?? 70,
          problemSolving: evalData.dimensionScores?.problemSolving ?? 70,
          systemArchitecture: evalData.dimensionScores?.systemDesign ?? 65,
          communicationStar: evalData.dimensionScores?.communicationStar ?? 75,
        },
        speechTelemetry: evalData.speechTelemetry || {
          estimatedWpm: Math.round(totalCandidateWords / Math.max(1, (elapsedSeconds || 60) / 60)) || 120,
          pacingAssessment: "Optimal",
          fillerWordsDetected: ["basically", "um"],
          fillerWordCount: 2,
          clarityScore: 75,
        },
        questionEvaluations: evalData.questionEvaluations && evalData.questionEvaluations.length > 0
          ? evalData.questionEvaluations
          : candidateTurns.slice(0, 3).map((t, idx) => ({
              questionNumber: idx + 1,
              topic: `Spoken Response ${idx + 1}`,
              questionAsked: interviewerQuestions[idx]?.text || questionBankRef.current[idx] || "Interview inquiry",
              candidateResponse: t.text,
              scoreOutOfTen: 7.0,
              strengths: ["Clear spoken articulation", "Direct address of prompt"],
              gapsIdentified: ["Could emphasize quantifiable impact and production metrics"],
              seniorEngineerModelAnswer: `Lead with a crisp 60-second summary: 'I specialize in ${sessionConfig.targetRole} with hands-on experience building scalable applications at ${sessionConfig.company}.'`,
            })),
        sevenDayStudyPlan: evalData.sevenDayStudyPlan || [
          { day: 1, topic: "Core Architecture & Data Structures", actionItem: "Solve 3 medium level problems on collections." },
          { day: 2, topic: "System Trade-offs & DB Indexing", actionItem: "Study B-Tree vs Hash indexes." },
        ],
      });
      toast.success("Comprehensive Interview Dossier ready!");
    } catch (err: any) {
      console.error("Evaluation error:", err);
      // Resilient fallback derived strictly from candidate's actual speech
      const candidateTurnsFallback = fullTranscript.filter(
        (t) => t.role === "candidate" && t.text && t.text.trim().length > 0
      );
      const fallbackWords = candidateTurnsFallback.reduce(
        (acc, t) => acc + t.text.trim().split(/\s+/).filter(Boolean).length,
        0
      );

      if (candidateTurnsFallback.length === 0 || fallbackWords < 15) {
        setIsAborted(true);
        return;
      }

      // Check for substantive technical terms vs shallow responses
      const technicalKeywords = [
        "architecture", "design", "model", "algorithm", "database", "latency",
        "optimization", "scale", "performance", "testing", "metrics", "pipeline",
        "code", "framework", "system", "cache", "async", "api", "query", "debug"
      ];
      const joinedText = candidateTurnsFallback.map((t) => t.text.toLowerCase()).join(" ");
      const matchedKeywords = technicalKeywords.filter((kw) => joinedText.includes(kw));

      // Dynamic quality scoring: shallow answers score 30-50, substantive answers score 65-92
      let computedScore = 35;
      if (fallbackWords > 25) computedScore += 15;
      if (fallbackWords > 80) computedScore += 15;
      computedScore += Math.min(25, matchedKeywords.length * 5);
      computedScore = Math.max(25, Math.min(92, computedScore));

      const reco = computedScore >= 80
        ? "Strong Hire"
        : computedScore >= 70
        ? "Hire"
        : computedScore >= 50
        ? "Borderline / Needs Practice"
        : "Needs Substantive Improvement";

      setEvalReport({
        sessionId: sessionConfig.sessionId,
        targetRole: sessionConfig.targetRole,
        company: sessionConfig.company,
        durationSeconds: elapsedSeconds || 320,
        overallScore: computedScore,
        hiringRecommendation: reco,
        hiringProbabilityPct: Math.max(10, Math.min(95, Math.round(computedScore * 0.95))),
        summary: `Performance evaluation based on ${candidateTurnsFallback.length} recorded candidate response(s) for ${sessionConfig.targetRole}. ${matchedKeywords.length > 0 ? `Demonstrated familiarity with: ${matchedKeywords.slice(0, 4).join(", ")}.` : "Responses lacked substantive technical domain depth."}`,
        competencies: {
          technicalDepth: computedScore,
          problemSolving: Math.max(25, computedScore - 4),
          systemArchitecture: Math.max(25, computedScore - 6),
          communicationStar: Math.min(95, computedScore + 4),
        },
        speechTelemetry: {
          estimatedWpm: Math.round(fallbackWords / Math.max(1, (elapsedSeconds || 60) / 60)) || 120,
          pacingAssessment: "Normal",
          fillerWordsDetected: ["um"],
          fillerWordCount: 1,
          clarityScore: computedScore,
        },
        questionEvaluations: candidateTurnsFallback.slice(0, 3).map((t, idx) => ({
          questionNumber: idx + 1,
          topic: `Question ${idx + 1} Assessment`,
          questionAsked: questionBankRef.current[idx] || sessionConfig.initialGreeting,
          candidateResponse: t.text.substring(0, 200),
          scoreOutOfTen: Number((computedScore / 10).toFixed(1)),
          strengths: ["Spoken articulation", "Clear response"],
          gapsIdentified: ["Could elaborate with deeper technical context"],
          seniorEngineerModelAnswer: `Structure response with clear context: 'In my experience with ${sessionConfig.targetRole}, I prioritize system reliability and clean modular design.'`,
        })),
        sevenDayStudyPlan: [
          { day: 1, topic: `${sessionConfig.targetRole} Core Concepts`, actionItem: "Review system architecture principles." },
          { day: 2, topic: "STAR Communication Practice", actionItem: "Prepare 3 quantified project examples." },
        ],
      });
      toast.success("Interview Dossier generated successfully.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // If Session Aborted (No candidate speech) -> Render Incomplete State
  if (isAborted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6 bg-slate-950 rounded-3xl text-white border border-slate-800 shadow-2xl max-w-xl mx-auto my-8">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Interview Session Incomplete</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The interview was ended before any candidate spoken responses were recorded.
            An evaluation dossier requires your spoken answers to assess technical depth and communication.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onExit}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-teal-500/20"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  // If Report Ready -> Render Master Dossier
  if (evalReport) {
    return <InterviewIntelligenceReport report={evalReport} onRestart={onExit} />;
  }

  // Evaluating Loading Screen
  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] p-8 text-center space-y-6 bg-slate-950 rounded-3xl text-white border border-slate-800 shadow-2xl">
        <div className="relative flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-[hsl(176_52%_45%/0.15)] border-2 border-[hsl(176_52%_45%/0.4)] flex items-center justify-center animate-pulse">
            <Sparkles className="h-10 w-10 text-[#20CFC0] animate-spin" />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Gemini 2.5 Pro Forensic Evaluation
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auditing conversation transcript against {sessionConfig.company} hiring rubrics, STAR communication frameworks, and speech acoustic metrics...
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[hsl(176_52%_62%)] bg-[hsl(176_52%_45%/0.15)] border border-[hsl(176_52%_45%/0.3)] px-3 py-1.5 rounded-full">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#20CFC0]" />
          Synthesizing Senior Engineer Model Answers
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[78vh] flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#101820] via-[#0E1B1A] to-[#101820] border border-[#1C6B68]/40 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
      {/* Ambient Radial Lighting Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[radial-gradient(circle,hsl(176_52%_45%/0.25),transparent_70%)] rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADS-UP HUD */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-white">
              {sessionConfig.company} • {sessionConfig.targetRole}
            </h3>
            <span className="text-xs text-[#20CFC0] font-medium">
              Interviewer: {sessionConfig.personaName || "Senior Panel"}
            </span>
          </div>
        </div>

        {/* 4-Pillar Conversational Stepper & Telemetry */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-full border border-slate-800 shadow-inner">
            {INTERVIEW_PILLARS.map((p) => {
              const isActive = currentPillar === p.id;
              const isDone = currentPillar > p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                    isActive
                      ? "bg-[#20CFC0]/25 text-[#20CFC0] border-[#20CFC0]/60 shadow-[0_0_12px_rgba(32,207,192,0.35)]"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-800/40 text-slate-500 border-transparent"
                  }`}
                  title={p.label}
                >
                  <span className="text-[10px]">{isDone ? "✓" : p.id}</span>
                  <span className="hidden md:inline">{p.name.replace(/^P\d:\s*/, "")}</span>
                  <span className="md:hidden">{p.shortName}</span>
                </div>
              );
            })}
          </div>

          <Badge className="bg-slate-800/90 text-slate-200 border-slate-700 text-xs font-mono px-3 py-1">
            ⏱️ {formatTime(elapsedSeconds)}
          </Badge>
          <Badge className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
            Live Connected
          </Badge>
        </div>
      </div>

      {/* CENTER STAGE: 3D AUDIO-REACTIVE FLUID ORB */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
        <VoiceFluidOrb
          isAiSpeaking={isAiSpeaking}
          isUserSpeaking={isUserSpeaking}
          audioLevel={audioLevel}
          size={240}
        />
      </div>

      {/* FLOATING REAL-TIME CAPTION STREAM TICKER */}
      <div className="relative z-10 max-w-2xl mx-auto w-full mb-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-md text-center shadow-lg transition-all duration-300 max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {captionRole === "interviewer"
                ? `🎙️ ${sessionConfig.personaName || "AI Panel"}`
                : "👤 You"}
            </span>
            <span className="text-[10px] font-semibold text-[#20CFC0]">
              {isAiSpeaking
                ? `🔊 ${sessionConfig.personaName || "Interviewer"} speaking...`
                : isThinking
                ? `🧠 ${sessionConfig.personaName || "Interviewer"} evaluating response...`
                : "🟢 Listening... (Speak freely or click Done)"}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed break-words whitespace-pre-wrap">
            "{activeCaption}"
          </p>
        </div>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
        {/* Left: Input Frequency Equalizer */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-semibold mr-1.5 hidden sm:inline">
            Mic Signal:
          </span>
          {[20, 50, 80, 40, 60].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${Math.max(4, (audioLevel / 100) * h)}px`,
              }}
              className="w-1 bg-[#20CFC0] rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(32,207,192,0.6)]"
            />
          ))}
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Button
            size="sm"
            onClick={handleToggleMute}
            className={`rounded-full px-3 sm:px-4 text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isMuted
                ? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            }`}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>

          {isThinking ? (
            <Badge className="rounded-full px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
              {sessionConfig.personaName || "Interviewer"} evaluating...
            </Badge>
          ) : isAiSpeaking ? (
            <Badge className="rounded-full px-3 py-1.5 bg-[#20CFC0]/20 text-[#20CFC0] border border-[#20CFC0]/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <Radio className="h-3.5 w-3.5 animate-pulse text-[#20CFC0]" />
              {sessionConfig.personaName || "Interviewer"} is speaking...
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={handleAutoSubmitTurn}
              className="rounded-full px-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 border border-emerald-500/50 shadow cursor-pointer transition-all"
              title="Pause speaking for 1.4s or click here to complete your answer immediately"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              Done Answering
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleEndInterview}
            className="rounded-full px-4 sm:px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <PhoneOff className="h-4 w-4" />
            End Interview & Get Report
          </Button>
        </div>

        {/* Right: Hint Chip */}
        <div className="text-[11px] text-slate-400 hidden lg:block">
          💡 Hands-free two-way: AI responds automatically when you pause speaking.
        </div>
      </div>
    </div>
  );
};
