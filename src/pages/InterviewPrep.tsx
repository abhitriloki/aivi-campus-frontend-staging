import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Square,
  Sparkles,
  Bot,
  CheckCircle2,
  Award,
  ShieldCheck,
  Type,
  Check,
  Volume2,
  VolumeX,
  Shield,
  Info,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { startMockInterview, answerMockInterviewTurn, finishMockInterview, voiceInterviewTurn, startRealtimeVoiceSession } from "@/services/tenantService";
import { ReportHeader, Chip } from "@/components/report";
import FormattedText from "@/components/markdownFormatter";
import InterviewPrepHub from "@/components/interview-prep/InterviewPrepHub";
import { PersonaVoicePickerModal } from "@/components/interview-prep/PersonaVoicePickerModal";
import { RealtimeVoiceRoom } from "@/components/interview-prep/RealtimeVoiceRoom";
import { INTERVIEWER_PERSONAS } from "@/services/personaVoiceData";

const SILENCE_MS = 3500;

export function MockInterviewRoom() {
  // Practice Type Selector: "realtime" (2-Way) vs "structured" (1-Way Drill)
  const [practiceType, setPracticeType] = useState<"realtime" | "structured">("realtime");

  // Daily AI Quota Tracking (Defect #16)
  const [dailyQuotaReached, setDailyQuotaReached] = useState<boolean>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      return localStorage.getItem(`aivi_daily_quota_reached_${today}`) === "true";
    } catch {
      return false;
    }
  });

  const markQuotaReached = () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`aivi_daily_quota_reached_${today}`, "true");
    } catch {}
    setDailyQuotaReached(true);
    toast.warning("Your daily AI quota has been reached.");
  };

  useEffect(() => {
    const onQuota = () => {
      markQuotaReached();
    };
    window.addEventListener("aivi-daily-quota-reached", onQuota);
    return () => window.removeEventListener("aivi-daily-quota-reached", onQuota);
  }, []);

  // Real-Time Studio State
  const [realtimeActive, setRealtimeActive] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [realtimeConfig, setRealtimeConfig] = useState<any | null>(null);
  const [launchingRealtime, setLaunchingRealtime] = useState(false);

  // Setup State (Structured Mode)
  const [inSession, setInSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"hr" | "technical" | "mixed">("mixed");
  const [language, setLanguage] = useState<"hi" | "hinglish" | "en">("hinglish");
  const [roleContext, setRoleContext] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [handsFreeMode, setHandsFreeMode] = useState<boolean>(true);

  const handleLaunchRealtimeSession = async (config: any) => {
    setLaunchingRealtime(true);
    try {
      const res = await startRealtimeVoiceSession({
        personaId: config.personaId,
        voiceId: config.voiceId,
        company: config.company,
        targetRole: config.targetRole,
        jdText: config.jdText,
        language: config.language,
        strictness: config.strictness,
      });

      const personaObj = INTERVIEWER_PERSONAS.find((p) => p.id === config.personaId);

      setRealtimeConfig({
        sessionId: res.sessionId,
        systemInstruction: res.systemInstruction,
        voiceName: res.voiceConfig?.voiceName || config.voiceId,
        initialGreeting: res.initialGreeting,
        personaId: config.personaId,
        company: config.company,
        targetRole: config.targetRole,
        personaName: personaObj ? `${personaObj.name} (${personaObj.roleTitle})` : "Senior Panel",
        language: config.language || "en",
        strictness: config.strictness || "realistic",
      });
      setRealtimeActive(true);
      toast.success(`🎙️ Live Voice Interview connected with ${personaObj?.name || "Panel"}!`);
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("quota") || err?.message?.toLowerCase().includes("resource-exhausted")) {
        markQuotaReached();
      }
      console.warn("Realtime voice launch note:", err);
      const personaObj = INTERVIEWER_PERSONAS.find((p) => p.id === config.personaId);
      setRealtimeConfig({
        sessionId: `realtime_${Date.now()}`,
        systemInstruction: "You are a senior technical interviewer.",
        voiceName: config.voiceId || "Fenrir",
        initialGreeting: `Hello! Welcome to your ${config.company} ${config.targetRole} interview. To begin, could you introduce yourself and walk me through your key projects?`,
        personaId: config.personaId,
        company: config.company,
        targetRole: config.targetRole,
        personaName: personaObj ? `${personaObj.name} (${personaObj.roleTitle})` : "Senior Panel",
        language: config.language || "en",
        strictness: config.strictness || "realistic",
      });
      setRealtimeActive(true);
    } finally {
      setLaunchingRealtime(false);
    }
  };

  // VAD & Silence Detection Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenRef = useRef<boolean>(false);
  const vadAnimationRef = useRef<number | null>(null);
  const accumulatedSpeechRef = useRef<string>("");

  // Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [ttsBase64, setTtsBase64] = useState<string | null>(null);
  const [textMode, setTextMode] = useState(false);

  // Recording State
  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [transcriptOverride, setTranscriptOverride] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [audioRecordedBadge, setAudioRecordedBadge] = useState(false);

  // Results State
  const [turnResults, setTurnResults] = useState<any[]>([]);
  const [latestResult, setLatestResult] = useState<any | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // TTS is disabled — questions are shown as text only for clarity.
  // Hands-Free mode auto-opens mic when inSession starts or new question arrives.
  useEffect(() => {
    if (inSession && handsFreeMode && !recording) {
      // Small delay to let the new question render before mic opens
      const timer = setTimeout(() => {
        startRecording();
      }, 600);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, inSession]);

  const handleStartSession = async () => {
    setLoading(true);
    try {
      const res = await startMockInterview({
        mode,
        language,
        roleContext: roleContext || undefined,
        questionCount,
      });

      setSessionId(res.sessionId);
      setCurrentQuestion(res.question1.text);
      setTtsBase64(res.question1.ttsBase64);
      setTurnIndex(0);
      setTurnResults([]);
      setLatestResult(null);
      setSummary(null);
      setInSession(true);

      toast.success("AI Mock Interview session started!");
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("quota") || err?.message?.toLowerCase().includes("resource-exhausted")) {
        markQuotaReached();
      }
      console.warn("startMockInterview notice:", err);
      toast.error(err.message || "Failed to start interview session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const recordingRef = useRef<boolean>(false);

  const startRecording = async () => {
    try {
      setAudioRecordedBadge(false);
      setAudioBase64(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      recordingRef.current = true;
      setRecording(true);

      // WebAudio AnalyserNode VAD (Voice Activity Detection)
      if (handsFreeMode) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          analyserRef.current = analyser;
          hasSpokenRef.current = false;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;

            if (average > 10) {
              hasSpokenRef.current = true;
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
            } else if (hasSpokenRef.current && !silenceTimerRef.current) {
              const currentSpeech = (accumulatedSpeechRef.current || "").trim();
              const wordCount = currentSpeech.split(/\s+/).filter(Boolean).length;
              if (wordCount >= 5) {
                silenceTimerRef.current = setTimeout(() => {
                  toast.info("Silence detected. Auto-submitting response...");
                  const submitBtn = document.getElementById("submit-answer-btn");
                  if (submitBtn) submitBtn.click();
                }, SILENCE_MS);
              }
            }

            vadAnimationRef.current = requestAnimationFrame(checkVolume);
          };

          vadAnimationRef.current = requestAnimationFrame(checkVolume);
        } catch (vadErr) {
          console.warn("VAD setup notice:", vadErr);
        }
      }

      // Start Browser Live Speech Recognition if supported with continuous accumulation
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        accumulatedSpeechRef.current = "";

        const startRecognitionInstance = () => {
          if (!recordingRef.current) return;
          try {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language === "hi" ? "hi-IN" : "en-IN";

            let currentSessionFinal = "";

            recognition.onresult = (event: any) => {
              let interim = "";
              for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                  currentSessionFinal += event.results[i][0].transcript + " ";
                } else {
                  interim += event.results[i][0].transcript;
                }
              }
              const fullSpeech = (accumulatedSpeechRef.current + " " + currentSessionFinal + " " + interim).trim();
              if (fullSpeech) {
                setTranscriptOverride(fullSpeech);
              }
            };

            recognition.onerror = (e: any) => {
              if (e.error === "no-speech") return;
              console.warn("Speech recognition notice:", e.error);
            };

            recognition.onend = () => {
              accumulatedSpeechRef.current = (accumulatedSpeechRef.current + " " + currentSessionFinal).trim();
              if (recordingRef.current) {
                setTimeout(startRecognitionInstance, 120);
              }
            };

            recognition.start();
            recognitionRef.current = recognition;
          } catch (rErr) {
            console.warn("Recognition start error:", rErr);
          }
        };

        startRecognitionInstance();
      }
    } catch (err) {
      toast.error("Microphone access denied. Falling back to manual controls.");
      setHandsFreeMode(false);
    }
  };

  const stopRecording = (): Promise<string | null> => {
    return new Promise((resolve) => {
      recordingRef.current = false;
      if (vadAnimationRef.current) {
        cancelAnimationFrame(vadAnimationRef.current);
        vadAnimationRef.current = null;
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setRecording(false);

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            setAudioBase64(base64);
            setAudioRecordedBadge(true);
            resolve(base64);
          };
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(audioBase64);
      }
    });
  };

  const handleSubmitAnswer = async () => {
    if (!sessionId) return;

    let currentAudio = audioBase64;
    if (recording) {
      currentAudio = await stopRecording();
    }

    if (!transcriptOverride.trim() && !currentAudio) {
      toast.error("Please record an audio answer or type your response before submitting.");
      return;
    }

    setEvaluating(true);

    // ── Voice Mode Route (Server-side STT + Sarvam ASR) ──────────────────────
    if (!textMode && currentAudio) {
      try {
        const res = await voiceInterviewTurn({
          sessionId,
          turnIndex,
          audioBase64: currentAudio,
        });

        if (res.isQuotaExceeded) {
          markQuotaReached();
          toast.warning(res.message || "Your daily AI quota has been reached.");
          setTextMode(true);
          setEvaluating(false);
          return;
        }

        setLatestResult(res);
        setTurnResults((prev) => [...prev, res]);
        // Show Sarvam transcription in box, clear for next turn if finished
        if (res.transcript) {
          setTranscriptOverride(res.transcript);
        }
        setAudioBase64(null);
        setAudioRecordedBadge(false);

        if (res.isFinished || !res.nextQuestion) {
          const finRes = await finishMockInterview(sessionId);
          setSummary(finRes);
        } else {
          setTurnIndex(res.turnIndex + 1);
          setCurrentQuestion(res.nextQuestion.text);
          setTtsBase64(res.nextQuestion.ttsBase64 || null);
          // Clear transcript box for next answer
          setTimeout(() => setTranscriptOverride(""), 1500);
        }
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes("quota") || err?.message?.toLowerCase().includes("resource-exhausted")) {
          markQuotaReached();
        }
        toast.error("Voice processing error. Switching to Text Mode — please type your answer.");
        setTextMode(true);
      } finally {
        setEvaluating(false);
      }
      return;
    }

    // ── Text Mode / Fallback Route ──────────────────────────────────────────
    try {
      const res = await answerMockInterviewTurn({
        sessionId,
        turnIndex,
        audioBase64: audioBase64 || undefined,
        transcriptOverride: transcriptOverride.trim() || undefined,
      });

      setLatestResult(res);
      setTurnResults((prev) => [...prev, res]);
      setAudioBase64(null);
      setAudioRecordedBadge(false);

      if (res.isFinished || !res.nextQuestion) {
        const finRes = await finishMockInterview(sessionId);
        setSummary(finRes);
      } else {
        setTurnIndex(res.turnIndex + 1);
        setCurrentQuestion(res.nextQuestion.text);
        setTtsBase64(res.nextQuestion.ttsBase64 || null);
        // Clear transcript box for next answer
        setTimeout(() => setTranscriptOverride(""), 1500);
      }
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("quota") || err?.message?.toLowerCase().includes("resource-exhausted")) {
        markQuotaReached();
      }
      toast.error(err.message || "Failed to evaluate answer");
    } finally {
      setEvaluating(false);
    }
  };

  // If in Real-Time Voice Room Session
  if (realtimeActive && realtimeConfig) {
    return (
      <div className="max-w-5xl mx-auto pb-12">
        <RealtimeVoiceRoom
          sessionConfig={realtimeConfig}
          onExit={() => setRealtimeActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Persona Voice Picker Modal */}
      <PersonaVoicePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onLaunchSession={handleLaunchRealtimeSession}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">AI Mock Interview Studio</h1>
        <p className="text-sm text-[#475569]">Select your preferred practice mode: live 2-way conversation or structured 1-way question drills.</p>
      </div>

      {/* Daily AI Quota Reached Notification (Defect #16) */}
      {dailyQuotaReached && (
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 text-amber-900 shadow-sm animate-in fade-in">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-300 bg-white text-amber-600 shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Your daily AI quota has been reached.</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              You have exhausted your allocated daily AI interview session limit. Your quota will reset automatically at midnight. You can continue practicing using the question bank and text drills.
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-amber-800 border-amber-300 bg-amber-100/70 font-bold text-xs py-1 px-2.5">
            Daily Quota Exhausted
          </Badge>
        </div>
      )}

      {/* MODE SELECTOR SEGMENTED CONTROL */}
      {!inSession && !summary && (
        <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setPracticeType("realtime")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              practiceType === "realtime"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Radio className={`h-4 w-4 ${practiceType === "realtime" ? "text-[#20CFC0] animate-pulse" : "text-slate-400"}`} />
            <span>🎙️ Full-Duplex Real-Time Voice Studio (2-Way Conversation)</span>
            <Badge className="bg-[#20CFC0] text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2">NEW</Badge>
          </button>

          <button
            type="button"
            onClick={() => setPracticeType("structured")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              practiceType === "structured"
                ? "bg-white text-primary shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Bot className="h-4 w-4 text-primary" />
            <span>📝 Step-by-Step Question Drill (1-Way Practice)</span>
          </button>
        </div>
      )}

      {/* 1. REAL-TIME GEMINI 2.0 LIVE STUDIO (2-WAY) */}
      {!inSession && !summary && practiceType === "realtime" && (
        <div className="rounded-3xl border border-[#1C6B68]/50 bg-gradient-to-br from-[#101820] via-[#101820] to-[#143E3B] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[radial-gradient(circle,hsl(176_52%_45%/0.35),transparent_70%)] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(176_52%_45%/0.2)] text-[hsl(176_52%_62%)] border border-[hsl(176_52%_45%/0.35)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <Badge className="bg-[hsl(176_52%_45%/0.2)] text-[hsl(176_52%_62%)] border-[hsl(176_52%_45%/0.4)] text-xs font-bold uppercase tracking-wider">
                  AIVI Real-Time Voice • Sub-500ms
                </Badge>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                2-Way Conversational Voice Interview
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Talk naturally through your microphone with zero turn-delays. Pick your target company (Accenture, TCS, Amazon), choose an interviewer persona (Bar Raiser, HR, Hinglish Mentor), and receive a Forensic Diagnostic Dossier with Senior Engineer model answers and 1-click PDF download.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Full-Duplex Interruption
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  4 Industry Personas
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  AIVI Forensic Scorecard & PDF
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                size="lg"
                onClick={() => setPickerOpen(true)}
                disabled={launchingRealtime || dailyQuotaReached}
                className="bg-gradient-to-r from-[#1C6B68] to-[#20CFC0] hover:from-[#155351] hover:to-[#18B5A7] text-white font-extrabold text-sm px-6 py-6 rounded-2xl shadow-[0_0_25px_rgba(32,207,192,0.35)] flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer border border-[#20CFC0]/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Radio className="h-5 w-5 animate-pulse text-white" />
                {dailyQuotaReached ? "Daily AI Quota Reached" : launchingRealtime ? "Connecting..." : "Launch Real-Time Live Studio"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STRUCTURED STEP-BY-STEP DRILL (1-WAY) */}
      {!inSession && !summary && practiceType === "structured" && (
        <Card className="border-[#E2E8F0] bg-white p-6 space-y-6 shadow-sm rounded-[1.9rem]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F172A]">Structured Question-by-Question Practice</h3>
              <Badge variant="outline" className="text-xs text-slate-500">
                1-Way Recording
              </Badge>
            </div>
            <p className="text-xs text-[#64748B]">Answer questions one by one with recorded answers, live speech transcription, and turn evaluations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Interview Mode</label>
              <select
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] bg-white p-3 text-sm font-semibold text-[#0F172A]"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
              >
                <option value="mixed">Mixed (Technical + HR)</option>
                <option value="technical">Technical Focus</option>
                <option value="hr">HR & Behavioral Focus</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Language Context</label>
              <select
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] bg-white p-3 text-sm font-semibold text-[#0F172A]"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="hinglish">Hinglish (Hindi + English)</option>
                <option value="en">English Only</option>
                <option value="hi">Hindi Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Session Length & Question Count</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {[
                { count: 3, label: "Express Sprint", time: "~8 Mins", desc: "Quick practice round" },
                { count: 6, label: "Standard Round", time: "~15 Mins", desc: "Standard campus interview" },
                { count: 10, label: "Technical Drill", time: "~25 Mins", desc: "Deep technical evaluation" },
                { count: 15, label: "Full Marathon", time: "~40 Mins", desc: "Complete multi-stage mock" },
              ].map((opt) => (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => setQuestionCount(opt.count)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    questionCount === opt.count
                      ? "border-[#0D9488] bg-[#CCFBF1]/30 ring-2 ring-[#0D9488]/20"
                      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#0F172A]">{opt.count} Questions</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">{opt.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#0D9488] mt-1">{opt.label}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Hands-Free Conversational Mode</label>
            <div
              onClick={() => setHandsFreeMode(!handsFreeMode)}
              className={`mt-2 p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                handsFreeMode
                  ? "border-[#0D9488] bg-[#CCFBF1]/20 ring-2 ring-[#0D9488]/20"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-lg ${handsFreeMode ? "bg-[#0D9488] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0F172A]">
                    {handsFreeMode ? "🟢 Hands-Free Conversational Mode (Active)" : "⚪ Manual Push-to-Talk Mode"}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {handsFreeMode
                      ? "Mic auto-opens after questions end and auto-submits after 2.5s silence."
                      : "Click 'Start Recording' and 'Submit' manually for each question."}
                  </p>
                </div>
              </div>
              <Badge className={handsFreeMode ? "bg-[#0D9488] text-white" : "bg-[#94A3B8] text-white"}>
                {handsFreeMode ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
          </div>

          <Button
            className="w-full h-12 bg-[#0D9488] hover:bg-[#097A70] text-white font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || dailyQuotaReached}
            onClick={handleStartSession}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {dailyQuotaReached ? "Daily AI Quota Reached (Resets Midnight)" : loading ? "Preparing Interview Plan..." : `Start ${questionCount}-Question AI Mock Interview`}
          </Button>
        </Card>
      )}

      {/* 3. SUMMARY SCREEN */}
      {summary && (
        <div className="space-y-6">
          <ReportHeader
            title={`${summary.communicationBand || "Interview"} Performance`}
            category="AI Interview Scorecard"
            subtitle={`Overall Aggregate Rating: ${summary.aggregateScores?.overall || 0} / 10`}
            score={Math.round((summary.aggregateScores?.overall || 0) * 10)}
            badgeText={summary.communicationBand ? `${summary.communicationBand} Band` : "Completed"}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Content</span>
              <p className="font-extrabold text-2xl text-[#0F172A] mt-1">{summary.aggregateScores?.content || 0}/10</p>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Fluency</span>
              <p className="font-extrabold text-2xl text-[#0F172A] mt-1">{summary.aggregateScores?.fluency || 0}/10</p>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Vocabulary</span>
              <p className="font-extrabold text-2xl text-[#0F172A] mt-1">{summary.aggregateScores?.vocabulary || 0}/10</p>
            </div>
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
              <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Structure</span>
              <p className="font-extrabold text-2xl text-[#0F172A] mt-1">{summary.aggregateScores?.structure || 0}/10</p>
            </div>
          </div>

          <div className="text-left space-y-3 bg-white border border-[#E2E8F0] p-6 rounded-[1.9rem] shadow-sm">
            <h4 className="font-bold text-base text-[#0F172A]">Personalized AI Action Plan</h4>
            <ul className="space-y-2 text-sm text-[#334155]">
              {summary.tips?.map((t: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-[#0D9488]">{idx + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl"
            onClick={() => {
              setSummary(null);
              setInSession(false);
              setSessionId(null);
              setTurnIndex(0);
              setCurrentQuestion("");
              setTurnResults([]);
              setLatestResult(null);
              setTranscriptOverride("");
              setAudioBase64(null);
              setTtsBase64(null);
              setEvaluating(false);
              setRecording(false);
            }}
          >
            Start Another Interview Session
          </Button>
        </div>
      )}

      {/* 4. ACTIVE SPEAKING ROOM (STRUCTURED) */}
      {inSession && !summary && (
        /* Active Speaking Room */
        <div className="space-y-6">
          {/* Avatar & Question Header */}
          <Card className="border-[#E2E8F0] bg-white p-6 flex flex-col items-center text-center space-y-4 rounded-[1.9rem] shadow-sm">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-[#CCFBF1] text-[#115E59] flex items-center justify-center border-2 border-[#99F6E4] animate-pulse">
                <Bot className="h-10 w-10" />
              </div>
            </div>

            <div>
              <Chip variant="neutral">Question {turnIndex + 1} of {questionCount}</Chip>
              <h2 className="text-xl font-bold max-w-xl text-[#0F172A] mt-2">{currentQuestion}</h2>
            </div>
          </Card>

          {/* Answer Input Controls */}
          <Card className="border-[#E2E8F0] bg-white p-6 space-y-4 rounded-[1.9rem] shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0F172A]">Your Response</h3>
              <Button variant="ghost" size="sm" onClick={() => setTextMode(!textMode)}>
                <Type className="h-4 w-4 mr-1 text-[#0D9488]" />
                {textMode ? "Switch to Voice Mode" : "Low Bandwidth Text Mode"}
              </Button>
            </div>

            {!textMode ? (
              <div className="flex flex-col items-center space-y-3 py-4">
                {/* One-Line DPDP Privacy Notice */}
                <div className="flex items-center gap-1.5 text-xs text-[#0D9488] bg-[#CCFBF1]/50 px-3 py-1.5 rounded-full border border-[#99F6E4]">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Privacy Notice / गोपनीयता सूचना: Audio is processed live in memory and never saved. केवल ट्रांसक्रिप्ट सहेजा जाता है।</span>
                </div>

                {!recording ? (
                  <Button
                    size="lg"
                    className="rounded-full h-16 w-16 bg-[#0D9488] hover:bg-[#097A70] text-white shadow-md transition-all hover:scale-105"
                    onClick={startRecording}
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      size="lg"
                      className="rounded-full h-16 w-16 bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-[0_0_24px_rgba(220,38,38,0.6)] animate-pulse transition-all hover:scale-105"
                      onClick={stopRecording}
                    >
                      <Square className="h-7 w-7 fill-white" />
                    </Button>
                    {/* Live Waveform Indicator */}
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-1 bg-[#DC2626] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-5 w-1 bg-[#DC2626] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-4 w-1 bg-[#DC2626] rounded-full animate-bounce"></span>
                      <span className="h-6 w-1 bg-[#DC2626] rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                      <span className="h-3 w-1 bg-[#DC2626] rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                    </div>
                  </div>
                )}
                <p className="text-xs font-semibold text-[#64748B]">
                  {recording ? "🔴 Recording in progress... Click the red square to stop." : "Click the microphone button to start speaking your answer."}
                </p>
                {audioRecordedBadge && (
                  <Chip variant="success">
                    <Check className="h-3.5 w-3.5 mr-1" /> Audio Recorded & Speech Transcribed
                  </Chip>
                )}
              </div>
            ) : null}

            {/* Editable Transcript Box */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Transcript Correction Box (Live speech or type text response)
              </label>
              <Textarea
                rows={4}
                className="mt-1 border-[#CBD5E1] text-[#0F172A] focus:border-[#0D9488]"
                placeholder="Your spoken words will appear here in real-time, or you can type directly..."
                value={transcriptOverride}
                onChange={(e) => setTranscriptOverride(e.target.value)}
              />
            </div>

            <Button
              id="submit-answer-btn"
              className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl"
              disabled={evaluating}
              onClick={handleSubmitAnswer}
            >
              <Sparkles className="h-4 w-4 mr-2 text-[#2DD4BF]" />
              {evaluating ? "Evaluating & Scoring Answer..." : "Submit Answer for Scoring"}
            </Button>
          </Card>

          {/* Latest Turn Feedback */}
          {latestResult && (
            <Card className="border-[#E2E8F0] bg-white p-5 space-y-3 rounded-[1.9rem] shadow-sm">
              <h4 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                Turn {latestResult.turnIndex + 1} Evaluation Scores
              </h4>

              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[#64748B]">Content:</span> <strong className="text-[#0F172A] text-sm">{latestResult.scores?.content || 0}/10</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[#64748B]">Fluency:</span> <strong className="text-[#0F172A] text-sm">{latestResult.scores?.fluency || 0}/10</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[#64748B]">Vocab:</span> <strong className="text-[#0F172A] text-sm">{latestResult.scores?.vocabulary || 0}/10</strong>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <span className="text-[#64748B]">Structure:</span> <strong className="text-[#0F172A] text-sm">{latestResult.scores?.structure || 0}/10</strong>
                </div>
              </div>

              {/* Delivery Analytics Badge Grid (Yoodli-Killer) */}
              {latestResult.deliveryMetrics && (
                <div className="grid grid-cols-3 gap-3 text-center text-xs pt-1">
                  <div className="p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-[#166534]">
                    <span className="font-bold text-[10px] uppercase tracking-wider block text-[#15803D]">Speech Pace</span>
                    <strong className="text-sm font-extrabold">{latestResult.deliveryMetrics.wpm || 135} WPM</strong>
                  </div>
                  <div className="p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[#991B1B]">
                    <span className="font-bold text-[10px] uppercase tracking-wider block text-[#991B1B]">Filler Words</span>
                    <strong className="text-sm font-extrabold">{latestResult.deliveryMetrics.fillerCount || 0} detected</strong>
                  </div>
                  <div className="p-2.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-[#854D0E]">
                    <span className="font-bold text-[10px] uppercase tracking-wider block text-[#854D0E]">Hesitations</span>
                    <strong className="text-sm font-extrabold">{latestResult.deliveryMetrics.pauseCount || 0} pauses</strong>
                  </div>
                </div>
              )}

              <div className="text-xs space-y-2 bg-[#F1F5F9] p-4 rounded-xl text-[#334155]">
                <div><strong className="text-[#0F172A]">Feedback (English):</strong> <FormattedText content={latestResult.feedbackEn} /></div>
                {latestResult.feedbackHi && <div><strong className="text-[#0F172A]">Feedback (Hindi):</strong> <FormattedText content={latestResult.feedbackHi} /></div>}
                {latestResult.modelAnswerEn && (
                  <div className="text-[#0D9488] font-semibold mt-1">
                    <strong className="text-[#0F172A]">Model Answer:</strong> <FormattedText content={latestResult.modelAnswerEn} />
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewPrepPage() {
  return <InterviewPrepHub defaultTab="mock" />;
}
