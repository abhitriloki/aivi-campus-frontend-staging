/**
 * 🎙️ AIVI Real-Time Gemini 2.0 Live Voice Streaming Engine
 * Full-duplex audio client with Web Audio API, VAD, and instant interruption support.
 */

export interface LiveVoiceEventHandlers {
  onAiSpeakingChange?: (speaking: boolean) => void;
  onUserSpeakingChange?: (speaking: boolean) => void;
  onAudioLevelChange?: (level: number) => void; // 0 to 100
  onTranscriptChunk?: (chunk: { role: "interviewer" | "candidate"; text: string; isFinal: boolean }) => void;
  onError?: (errorMsg: string) => void;
  onSessionEnded?: () => void;
}

export interface LiveVoiceSessionConfig {
  sessionId: string;
  systemInstruction: string;
  voiceName: "Aoede" | "Fenrir" | "Kore" | "Puck";
  initialGreeting: string;
  personaId: string;
  company: string;
  targetRole: string;
}

function findBestVoice(voices: SpeechSynthesisVoice[], isHindiOrHinglish: boolean, isFemale: boolean): SpeechSynthesisVoice | undefined {
  if (isHindiOrHinglish) {
    // 1. Try finding native Hindi voice
    const hindiVoice = voices.find(
      (v) =>
        v.lang === "hi-IN" ||
        v.lang.startsWith("hi") ||
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("hemant") ||
        v.name.toLowerCase().includes("swara") ||
        v.name.toLowerCase().includes("kalpana") ||
        v.name.toLowerCase().includes("lekha")
    );
    if (hindiVoice) return hindiVoice;

    // 2. Try finding Indian English voice
    const indianVoice = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("heera") ||
        v.name.toLowerCase().includes("neerja") ||
        v.name.toLowerCase().includes("ravi")
    );
    if (indianVoice) return indianVoice;
  }

  // Standard English Voice Picker
  return (
    voices.find(
      (v) =>
        (v.lang === "en-IN" || v.lang.includes("en-GB") || v.lang.includes("en-US")) &&
        (isFemale
          ? v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha") || v.name.toLowerCase().includes("aria")
          : v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("guy") || v.name.toLowerCase().includes("george"))
    ) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

import { synthesizePersonaVoice } from "@/services/tenantService";

export class GeminiLiveVoiceSession {
  private config: LiveVoiceSessionConfig;
  private handlers: LiveVoiceEventHandlers;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private isConnected = false;
  private isMuted = false;
  private isAiSpeaking = false;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private currentTtsAbortController: AbortController | null = null;
  private transcriptHistory: Array<{ role: "interviewer" | "candidate"; text: string; timestamp: number }> = [];
  private recognition: any = null;
  private lastSpokenAiText = "";
  private isAcousticDecaying = false;

  private stopBrowserSpeechRecognition(abort = false): void {
    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        if (abort) {
          this.recognition.abort();
        } else {
          this.recognition.stop();
        }
      } catch {}
      this.recognition = null;
    }
  }

  constructor(config: LiveVoiceSessionConfig, handlers: LiveVoiceEventHandlers) {
    this.config = config;
    this.handlers = handlers;
  }

  async start(): Promise<void> {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const source = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);

      this.isConnected = true;
      this.startAudioLevelLoop();
      this.startBrowserSpeechRecognition();

      setTimeout(() => {
        this.speakAiResponse(this.config.initialGreeting);
      }, 600);

    } catch (err: any) {
      console.error("Failed to start realtime voice session:", err);
      this.handlers.onError?.(err.message || "Microphone access denied or audio initialization failed.");
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((t) => (t.enabled = !muted));
    }
  }

  public stopAudioPlayback(): void {
    if (this.currentTtsAbortController) {
      this.currentTtsAbortController.abort();
      this.currentTtsAbortController = null;
    }
    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop();
        this.currentAudioSource.disconnect();
      } catch {}
      this.currentAudioSource = null;
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    this.isAiSpeaking = false;
    this.handlers.onAiSpeakingChange?.(false);
  }

  private cumulativeCandidateTranscript = "";
  private aiSpeechStartTime = 0;

  async speakAudioWithText(audioBase64: string, text: string): Promise<void> {
    if (!this.isConnected) return;
    this.stopAudioPlayback();
    this.stopBrowserSpeechRecognition(true);
    this.lastSpokenAiText = text;
    this.cumulativeCandidateTranscript = "";
    this.isAiSpeaking = true;
    this.isAcousticDecaying = true;
    this.aiSpeechStartTime = Date.now();
    this.handlers.onAiSpeakingChange?.(true);

    this.transcriptHistory.push({
      role: "interviewer",
      text,
      timestamp: Date.now(),
    });

    this.handlers.onTranscriptChunk?.({
      role: "interviewer",
      text,
      isFinal: true,
    });

    if (audioBase64 && this.audioContext) {
      try {
        if (this.audioContext.state === "suspended") {
          await this.audioContext.resume();
        }
        const binaryStr = atob(audioBase64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer.slice(0));
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        source.onended = () => {
          if (this.currentAudioSource === source) {
            this.currentAudioSource = null;
            this.isAiSpeaking = false;
            this.handlers.onAiSpeakingChange?.(false);
            // ⚡ Acoustic Decay Guard: Wait 450ms for room reverberation to settle
            setTimeout(() => {
              this.isAcousticDecaying = false;
              if (this.isConnected && !this.isAiSpeaking && !this.isMuted) {
                this.startBrowserSpeechRecognition();
              }
            }, 450);
          }
        };

        this.currentAudioSource = source;
        source.start(0);
        return;
      } catch (decodeErr) {
        console.warn("Direct audio decode notice, falling back to speech synthesis:", decodeErr);
      }
    }

    // Fallback if audioBase64 was not provided or failed
    await this.speakAiResponse(text);
  }

  async speakAiResponse(text: string): Promise<void> {
    if (!text || !this.isConnected) return;

    this.stopAudioPlayback();
    this.stopBrowserSpeechRecognition(true);
    this.lastSpokenAiText = text;
    this.cumulativeCandidateTranscript = "";
    this.isAiSpeaking = true;
    this.isAcousticDecaying = true;
    this.aiSpeechStartTime = Date.now();
    this.handlers.onAiSpeakingChange?.(true);
    this.transcriptHistory.push({
      role: "interviewer",
      text,
      timestamp: Date.now(),
    });

    this.handlers.onTranscriptChunk?.({
      role: "interviewer",
      text,
      isFinal: true,
    });

    const isHindiOrHinglish =
      this.config.personaId === "kabir" ||
      /[\u0900-\u097F]/.test(text) ||
      text.toLowerCase().includes("namaste") ||
      text.toLowerCase().includes("aapka");

    // ── Primary: High-fidelity Indian Voice Synthesis via Sarvam bulbul:v3 ──
    const abortCtrl = new AbortController();
    this.currentTtsAbortController = abortCtrl;

    try {
      const res = await synthesizePersonaVoice({
        text,
        personaId: this.config.personaId,
        language: isHindiOrHinglish ? "hi" : "en",
      });

      if (abortCtrl.signal.aborted || !this.isConnected) return;

      if (res && res.audioBase64 && this.audioContext) {
        if (this.audioContext.state === "suspended") {
          await this.audioContext.resume();
        }

        const binaryStr = atob(res.audioBase64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer.slice(0));
        if (abortCtrl.signal.aborted || !this.isConnected) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        source.onended = () => {
          if (this.currentAudioSource === source) {
            this.currentAudioSource = null;
            this.isAiSpeaking = false;
            this.handlers.onAiSpeakingChange?.(false);
            // ⚡ Acoustic Decay Guard: Wait 450ms for room/speaker reverberation to decay before mic re-engages
            setTimeout(() => {
              this.isAcousticDecaying = false;
              if (this.isConnected && !this.isAiSpeaking && !this.isMuted) {
                this.startBrowserSpeechRecognition();
              }
            }, 450);
          }
        };

        this.currentAudioSource = source;
        source.start(0);
        return;
      }
    } catch (err) {
      console.warn("[geminiLiveService] Sarvam TTS notice (falling back to browser speech):", err);
    }

    // ── Graceful Fallback: Local Browser SpeechSynthesis ──
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const isFemale = this.config.voiceName === "Aoede" || this.config.voiceName === "Kore" || this.config.personaId === "priya" || this.config.personaId === "ananya";

      utterance.lang = isHindiOrHinglish ? "hi-IN" : "en-IN";

      const voices = window.speechSynthesis.getVoices();
      const targetVoice = findBestVoice(voices, isHindiOrHinglish, isFemale);

      if (targetVoice) utterance.voice = targetVoice;
      utterance.rate = 1.0;
      utterance.pitch = isFemale ? 1.05 : 0.95;

      utterance.onend = () => {
        this.isAiSpeaking = false;
        this.handlers.onAiSpeakingChange?.(false);
        setTimeout(() => {
          this.isAcousticDecaying = false;
          if (this.isConnected && !this.isAiSpeaking && !this.isMuted) {
            this.startBrowserSpeechRecognition();
          }
        }, 450);
      };

      utterance.onerror = () => {
        this.isAiSpeaking = false;
        this.handlers.onAiSpeakingChange?.(false);
        setTimeout(() => {
          this.isAcousticDecaying = false;
          if (this.isConnected && !this.isAiSpeaking && !this.isMuted) {
            this.startBrowserSpeechRecognition();
          }
        }, 450);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        this.isAiSpeaking = false;
        this.handlers.onAiSpeakingChange?.(false);
        this.isAcousticDecaying = false;
      }, text.length * 60);
    }
  }

  public resetCandidateTurnTranscript(): void {
    this.cumulativeCandidateTranscript = "";
  }

  private startBrowserSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // en-IN model natively handles Indian English and bilingual Hinglish code-switching in Chromium
    recognition.lang = "en-IN";

    let sessionFinalTranscript = "";

    recognition.onresult = (event: any) => {
      // While AI is speaking or audio reverberation is decaying, ignore speaker audio pickup
      if (this.isAiSpeaking || this.isAcousticDecaying) {
        return;
      }

      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          sessionFinalTranscript += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const activeText = (this.cumulativeCandidateTranscript + " " + sessionFinalTranscript + " " + interim).trim();

      // Echo suppression: If candidate audio mirrors the AI question just spoken from the speakers, drop it
      if (this.lastSpokenAiText && activeText) {
        const cleanAi = this.lastSpokenAiText.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        const cleanActive = activeText.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        if (cleanAi && cleanActive && (cleanAi.includes(cleanActive) || cleanActive.includes(cleanAi))) {
          return;
        }
      }

      if (activeText) {
        this.handlers.onUserSpeakingChange?.(true);

        this.handlers.onTranscriptChunk?.({
          role: "candidate",
          text: activeText,
          isFinal: false,
        });
      }
    };

    recognition.onerror = (event: any) => {
      // "no-speech" or short pauses should not terminate session
      if (event.error === "no-speech") {
        return;
      }
      console.warn("Speech recognition notice:", event.error);
    };

    recognition.onend = () => {
      this.cumulativeCandidateTranscript = (this.cumulativeCandidateTranscript + " " + sessionFinalTranscript).trim();
      if (this.isConnected) {
        setTimeout(() => {
          if (this.isConnected) {
            try {
              this.startBrowserSpeechRecognition();
            } catch {}
          }
        }, 120);
      }
    };

    try {
      recognition.start();
      this.recognition = recognition;
    } catch {}
  }

  private startAudioLevelLoop(): void {
    const dataArray = new Uint8Array(this.analyser?.frequencyBinCount || 64);

    const checkLevel = () => {
      if (!this.isConnected || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalizedLevel = Math.min(100, Math.round((avg / 128) * 100));

      // Level drives only the visualizer equalizers and fluid orb (no acoustic self-cutoff)
      this.handlers.onAudioLevelChange?.(normalizedLevel);
      this.animFrameId = requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  getTranscript(): Array<{ role: "interviewer" | "candidate"; text: string; timestamp: number }> {
    return [...this.transcriptHistory];
  }

  end(): void {
    this.isConnected = false;
    this.stopAudioPlayback();

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.handlers.onSessionEnded?.();
  }
}

/**
 * Global audio references and in-memory cache for instant 0ms persona sample preview
 */
let previewAudioContext: AudioContext | null = null;
let previewAudioSource: AudioBufferSourceNode | null = null;
let previewAbortController: AbortController | null = null;
const personaSampleAudioCache = new Map<string, AudioBuffer>();

/**
 * Pre-warms Indian voice sample previews in the background so "Listen Sample" plays in 0ms.
 */
export async function prefetchPersonaSamples(
  personas: Array<{ id: string; sampleAudioText: string }>
): Promise<void> {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!previewAudioContext || previewAudioContext.state === "closed") {
    previewAudioContext = new AudioCtx({ sampleRate: 24000 });
  }

  for (const p of personas) {
    if (personaSampleAudioCache.has(p.id)) continue;
    try {
      const isHindiOrHinglish = p.id === "kabir";
      const res = await synthesizePersonaVoice({
        text: p.sampleAudioText,
        personaId: p.id,
        language: isHindiOrHinglish ? "hi" : "en",
      });
      if (res?.audioBase64 && previewAudioContext) {
        const binaryStr = atob(res.audioBase64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const audioBuffer = await previewAudioContext.decodeAudioData(bytes.buffer.slice(0));
        personaSampleAudioCache.set(p.id, audioBuffer);
      }
    } catch {
      // Pre-warm silently ignores errors
    }
  }
}

/**
 * Helper to play high-fidelity Sarvam Indian audio sample preview for any persona in 1 click (instant 0ms if cached)
 */
export async function playPersonaSamplePreview(
  sampleText: string,
  personaIdOrGender: string,
  isHindi = false
): Promise<void> {
  cancelPersonaSamplePreview();

  let personaId = "vikram";
  const lowered = (personaIdOrGender || "").toLowerCase();
  if (["ananya", "vikram", "priya", "kabir"].includes(lowered)) {
    personaId = lowered;
  } else if (personaIdOrGender === "Female") {
    personaId = "ananya";
  } else if (personaIdOrGender === "Male") {
    personaId = "vikram";
  }

  const isHindiOrHinglish =
    isHindi ||
    personaId === "kabir" ||
    /[\u0900-\u097F]/.test(sampleText) ||
    sampleText.toLowerCase().includes("namaste") ||
    sampleText.toLowerCase().includes("aapka");

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!previewAudioContext || previewAudioContext.state === "closed") {
    previewAudioContext = new AudioCtx({ sampleRate: 24000 });
  }

  // 0. Instant Cache Playback (0ms latency)
  if (personaSampleAudioCache.has(personaId)) {
    try {
      if (previewAudioContext.state === "suspended") {
        await previewAudioContext.resume();
      }
      const source = previewAudioContext.createBufferSource();
      source.buffer = personaSampleAudioCache.get(personaId)!;
      source.connect(previewAudioContext.destination);
      source.onended = () => {
        if (previewAudioSource === source) {
          previewAudioSource = null;
        }
      };
      previewAudioSource = source;
      source.start(0);
      return;
    } catch (e) {
      console.warn("Cached sample playback fallback:", e);
    }
  }

  const abortCtrl = new AbortController();
  previewAbortController = abortCtrl;

  // 1. Primary: Real Sarvam bulbul:v3 native Indian voice preview
  try {
    const res = await synthesizePersonaVoice({
      text: sampleText,
      personaId,
      language: isHindiOrHinglish ? "hi" : "en",
    });

    if (abortCtrl.signal.aborted || !res?.audioBase64) return;

    if (previewAudioContext.state === "suspended") {
      await previewAudioContext.resume();
    }

    const binaryStr = atob(res.audioBase64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const audioBuffer = await previewAudioContext.decodeAudioData(bytes.buffer.slice(0));
    personaSampleAudioCache.set(personaId, audioBuffer);

    if (abortCtrl.signal.aborted) return;

    const source = previewAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(previewAudioContext.destination);

    source.onended = () => {
      if (previewAudioSource === source) {
        previewAudioSource = null;
      }
    };

    previewAudioSource = source;
    source.start(0);
    return;
  } catch (err) {
    console.warn("Sarvam sample preview notice (falling back to browser speech):", err);
  }

  // 2. Fallback to browser SpeechSynthesis if network/cloud call fails
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(sampleText);
  const isFemale = personaId === "ananya" || personaId === "priya";
  utterance.lang = isHindiOrHinglish ? "hi-IN" : "en-IN";
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = findBestVoice(voices, isHindiOrHinglish, isFemale);
  if (targetVoice) utterance.voice = targetVoice;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel any ongoing persona preview audio immediately
 */
export function cancelPersonaSamplePreview(): void {
  if (previewAbortController) {
    previewAbortController.abort();
    previewAbortController = null;
  }
  if (previewAudioSource) {
    try {
      previewAudioSource.stop();
      previewAudioSource.disconnect();
    } catch {}
    previewAudioSource = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
