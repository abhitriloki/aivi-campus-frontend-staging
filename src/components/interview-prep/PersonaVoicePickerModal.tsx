import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Mic,
  Volume2,
  Play,
  CheckCircle2,
  Shield,
  Zap,
  Building2,
  ChevronRight,
  ArrowLeft,
  Flame,
  Award,
} from "lucide-react";
import {
  INTERVIEWER_PERSONAS,
  COMPANY_DRIVE_TEMPLATES,
  InterviewerPersona,
  CompanyDriveTemplate,
} from "@/services/personaVoiceData";
import { playPersonaSamplePreview, cancelPersonaSamplePreview, prefetchPersonaSamples } from "@/services/geminiLiveService";
import { toast } from "sonner";

interface PersonaVoicePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLaunchSession: (config: {
    personaId: "ananya" | "vikram" | "priya" | "kabir";
    voiceId: "Aoede" | "Fenrir" | "Kore" | "Puck";
    company: string;
    targetRole: string;
    jdText?: string;
    strictness: "gentle" | "realistic" | "bar_raiser";
    language: "en" | "hi" | "hinglish";
  }) => void;
  initialCompany?: string;
  initialRole?: string;
}

export const PersonaVoicePickerModal: React.FC<PersonaVoicePickerModalProps> = ({
  open,
  onOpenChange,
  onLaunchSession,
  initialCompany = "Accenture ADC",
  initialRole = "Associate Software Engineer (Java)",
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [playingPersonaId, setPlayingPersonaId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      prefetchPersonaSamples(INTERVIEWER_PERSONAS);
    } else {
      cancelPersonaSamplePreview();
      setPlayingPersonaId(null);
    }
    return () => {
      cancelPersonaSamplePreview();
      setPlayingPersonaId(null);
    };
  }, [open]);

  // Setup State
  const [selectedCompany, setSelectedCompany] = useState(initialCompany);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [customJd, setCustomJd] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<InterviewerPersona>(
    INTERVIEWER_PERSONAS[0]
  );
  const [strictness, setStrictness] = useState<"gentle" | "realistic" | "bar_raiser">("realistic");
  const [language, setLanguage] = useState<"en" | "hi" | "hinglish">("en");

  // Mic Test State
  const [micTesting, setMicTesting] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micPassed, setMicPassed] = useState(false);

  // Select company template
  const handleSelectTemplate = (tpl: CompanyDriveTemplate) => {
    setSelectedCompany(tpl.companyName);
    setSelectedRole(tpl.roleTitle);
    const persona = INTERVIEWER_PERSONAS.find((p) => p.id === tpl.suggestedPersona);
    if (persona) setSelectedPersona(persona);
  };

  // Test microphone stream for Step 3
  const handleTestMic = async () => {
    setMicTesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let count = 0;
      const interval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        const lvl = Math.min(100, Math.round((avg / 128) * 100));
        setMicLevel(lvl);
        count++;

        if (count > 25) {
          clearInterval(interval);
          stream.getTracks().forEach((t) => t.stop());
          audioCtx.close();
          setMicTesting(false);
          setMicPassed(true);
          toast.success("Microphone calibrated successfully!");
        }
      }, 100);
    } catch (err: any) {
      setMicTesting(false);
      toast.error("Microphone permission denied. Please allow microphone access.");
    }
  };

  const handleFinalLaunch = () => {
    onLaunchSession({
      personaId: selectedPersona.id,
      voiceId: selectedPersona.voiceId,
      company: selectedCompany,
      targetRole: selectedRole,
      jdText: customJd.trim() || undefined,
      strictness,
      language,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-200 p-0 shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-[#101820] via-[#101820] to-[#143E3B] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(176_52%_45%/0.2)] text-[hsl(176_52%_62%)] border border-[hsl(176_52%_45%/0.35)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  Real-Time AI Voice Interview Studio
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Powered by Google Gemini 2.0 Live Full-Duplex Audio Engine
                </DialogDescription>
              </div>
            </div>
            <Badge className="bg-[hsl(176_52%_45%/0.2)] text-[hsl(176_52%_62%)] border-[hsl(176_52%_45%/0.4)] text-xs font-bold">
              Step {step} of 3
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* STEP 1: Company & Role */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Select Target Company Drive or Custom Role
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The AI interviewer will customize technical depth and rubrics to this exact company.
                </p>
              </div>

              {/* Pre-built Templates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANY_DRIVE_TEMPLATES.map((tpl) => {
                  const isSelected = selectedCompany === tpl.companyName;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                        isSelected
                          ? "border-[#1C6B68] bg-[#1C6B68]/8 shadow-sm ring-2 ring-[#20CFC0]/40"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{tpl.companyName}</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          Pass: {tpl.benchmarkScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{tpl.roleTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tpl.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div className="pt-2 space-y-3 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Company Name</label>
                    <Input
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      placeholder="e.g. Accenture, Amazon, Infosys"
                      className="mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Target Role Title</label>
                    <Input
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      placeholder="e.g. Java SDE, Full Stack Engineer"
                      className="mt-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Paste Job Description (Optional for deep JD matching)
                  </label>
                  <Textarea
                    value={customJd}
                    onChange={(e) => setCustomJd(e.target.value)}
                    rows={2}
                    placeholder="Paste specific JD requirements, skills, or responsibilities..."
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  Next: Choose Persona & Voice
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Persona & Voice Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Choose Interviewer Persona & Voice Accent
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Each persona possesses distinct questioning styles, feedback strictness, and vocal expressiveness.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {INTERVIEWER_PERSONAS.map((persona) => {
                  const isSelected = selectedPersona.id === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 relative ${
                        isSelected
                          ? "border-[#1C6B68] bg-[#1C6B68]/8 shadow-md ring-2 ring-[#20CFC0]/40"
                          : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={persona.avatarUrl}
                            alt={persona.name}
                            className="h-11 w-11 rounded-full object-cover border border-slate-200 shadow-xs"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                              {persona.name}
                              {isSelected && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                              )}
                            </h4>
                            <span className="text-[11px] text-slate-500 block font-medium">
                              {persona.roleTitle}
                            </span>
                          </div>
                        </div>
                        <Badge className={`text-[10px] ${persona.tagColor}`}>
                          {persona.styleBadge}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {persona.description}
                      </p>

                      {/* 1-Click Audio Preview Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          Voice: {persona.voiceId} ({persona.accent})
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={playingPersonaId === persona.id}
                          onClick={async (e) => {
                            e.stopPropagation();
                            setPlayingPersonaId(persona.id);
                            try {
                              await playPersonaSamplePreview(persona.sampleAudioText, persona.id, persona.id === "kabir" || language === "hi");
                            } finally {
                              setPlayingPersonaId(null);
                            }
                          }}
                          className="h-7 text-[11px] px-2.5 text-primary bg-primary/10 border-primary/20 hover:bg-primary/20 flex items-center gap-1.5"
                        >
                          {playingPersonaId === persona.id ? (
                            <>
                              <Volume2 className="h-3 w-3 animate-pulse text-primary" />
                              Playing...
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 fill-primary" />
                              Listen Sample
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strictness & Language Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700">Interview Strictness</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {[
                      { id: "gentle", label: "Gentle", icon: Shield },
                      { id: "realistic", label: "Realistic", icon: Award },
                      { id: "bar_raiser", label: "Bar Raiser", icon: Flame },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStrictness(item.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          strictness === item.id
                            ? "bg-[#101820] text-white border-[#101820]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <item.icon className="h-3 w-3" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Language Mode</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {[
                      { id: "en", label: "English" },
                      { id: "hinglish", label: "Hinglish" },
                      { id: "hi", label: "Hindi" },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setLanguage(lang.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          language === lang.id
                            ? "bg-[#101820] text-white border-[#101820]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    cancelPersonaSamplePreview();
                    setStep(1);
                  }}
                  className="text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    cancelPersonaSamplePreview();
                    setStep(3);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  Next: Audio Check & Launch
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Audio Check & Launch */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Hardware Check & Ready to Launch
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your microphone input is working clearly for real-time full-duplex conversation.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Target Company & Role:</span>
                  <span className="font-bold text-slate-900">
                    {selectedCompany} • {selectedRole}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Interviewer Persona:</span>
                  <span className="font-bold text-primary">
                    {selectedPersona.name} ({selectedPersona.roleTitle})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Evaluation Strictness:</span>
                  <span className="font-bold uppercase text-slate-900">{strictness}</span>
                </div>
              </div>

              {/* Mic Calibration Area */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Mic className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Microphone Calibration & Echo Guard
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTestMic}
                    disabled={micTesting}
                    className="text-xs h-7"
                  >
                    {micTesting ? "Listening..." : "Test 3-Sec Mic Level"}
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Input Volume Frequency</span>
                    <span>{micLevel}%</span>
                  </div>
                  <Progress value={micLevel} className="h-2 bg-slate-100" />
                </div>

                {micPassed && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Microphone is clear and ready for real-time live interview!
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <Button
                  onClick={handleFinalLaunch}
                  className="bg-gradient-to-r from-[#1C6B68] to-[#20CFC0] hover:from-[#155351] hover:to-[#18B5A7] text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(32,207,192,0.35)] px-6 py-2.5 rounded-xl cursor-pointer border border-[#20CFC0]/30"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  Start Live Voice Interview Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
