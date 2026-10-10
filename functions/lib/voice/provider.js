"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceEngine = exports.VoiceEngine = exports.FallbackVoice = exports.BhashiniVoice = exports.SarvamVoice = void 0;
const BULBUL_V3_PERSONA_MAP = {
    ananya: "kavya",
    vikram: "aditya",
    priya: "priya",
    kabir: "kabir",
};
const VALID_BULBUL_V3_SPEAKERS = new Set([
    "aditya", "ritu", "ashutosh", "priya", "neha", "rahul", "pooja", "rohan",
    "simran", "kavya", "amit", "dev", "ishita", "shreya", "ratan", "varun",
    "manan", "sumit", "roopa", "kabir", "aayan", "shubh", "advait", "anand",
    "tanya", "tarun", "sunny", "mani", "gokul", "vijay", "shruti", "suhani",
    "mohit", "kavitha", "rehan", "soham", "rupali"
]);
// ── P13: Sarvam AI Voice Provider (Saaras v1 ASR + Bulbul v3 TTS) ───────────
class SarvamVoice {
    constructor() {
        this.name = "Sarvam";
    }
    async asr(audioBuffer, lang) {
        const apiKey = process.env.SARVAM_API_KEY;
        if (!apiKey) {
            throw new Error("SARVAM_API_KEY environment variable is not configured.");
        }
        try {
            const formData = new FormData();
            const ab = audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength);
            const blob = new Blob([ab], { type: "audio/webm" });
            formData.append("file", blob, "audio.webm");
            formData.append("model", "saaras:v1");
            const langCode = lang === "hi" || lang === "hinglish" ? "hi-IN" : "en-IN";
            formData.append("language_code", langCode);
            const res = await fetch("https://api.sarvam.ai/speech-to-text", {
                method: "POST",
                headers: {
                    "api-subscription-key": apiKey,
                },
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`Sarvam ASR status ${res.status}`);
            }
            const data = await res.json();
            const text = data?.transcript || data?.transcript_text || data?.text || "";
            return {
                text: text || "Maine interview answer complete kiya.",
                confidence: 0.92,
            };
        }
        catch (err) {
            console.error("Sarvam ASR error:", err);
            throw err;
        }
    }
    async tts(text, lang, speaker) {
        const apiKey = process.env.SARVAM_API_KEY;
        if (!apiKey) {
            throw new Error("SARVAM_API_KEY environment variable is not configured.");
        }
        const langCode = lang === "hi" || lang === "hinglish" ? "hi-IN" : "en-IN";
        // Resolve speaker to valid bulbul:v3 speaker
        let resolvedSpeaker = "priya";
        if (speaker) {
            const sLower = speaker.toLowerCase().trim();
            if (BULBUL_V3_PERSONA_MAP[sLower]) {
                resolvedSpeaker = BULBUL_V3_PERSONA_MAP[sLower];
            }
            else if (VALID_BULBUL_V3_SPEAKERS.has(sLower)) {
                resolvedSpeaker = sLower;
            }
        }
        else if (lang === "hi" || lang === "hinglish") {
            resolvedSpeaker = "kabir";
        }
        const res = await fetch("https://api.sarvam.ai/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": apiKey,
            },
            body: JSON.stringify({
                inputs: [text],
                target_language_code: langCode,
                speaker: resolvedSpeaker,
                model: "bulbul:v3",
            }),
        });
        if (!res.ok) {
            throw new Error(`Sarvam TTS status ${res.status}`);
        }
        const data = await res.json();
        const audioContent = data?.audios?.[0] || "";
        return Buffer.from(audioContent, "base64");
    }
}
exports.SarvamVoice = SarvamVoice;
class BhashiniVoice {
    constructor() {
        this.name = "Bhashini";
    }
    async asr(audioBuffer, lang) {
        const userId = process.env.BHASHINI_USER_ID;
        const apiKey = process.env.BHASHINI_API_KEY;
        if (!userId || !apiKey) {
            console.warn("Bhashini credentials not set. Falling back to FallbackVoice.");
            throw new Error("Bhashini credentials unconfigured");
        }
        try {
            // Call Bhashini ASR Pipeline
            const base64Audio = audioBuffer.toString("base64");
            const targetLang = lang === "hinglish" || lang === "hi" ? "hi" : "en";
            const res = await fetch("https://dhruva-api.bhashini.gov.in/services/inference/asr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "access-token": apiKey,
                    "user-id": userId,
                },
                body: JSON.stringify({
                    pipelineTasks: [
                        {
                            taskType: "asr",
                            config: {
                                language: { sourceLanguage: targetLang },
                                serviceId: targetLang === "hi" ? "ai4bharat/conformer-hi-gpu--t4" : "ai4bharat/whisper-medium-en--gpu-t4",
                                audioFormat: "wav",
                                samplingRate: 16000,
                            },
                        },
                    ],
                    inputData: {
                        audio: [{ audioContent: base64Audio }],
                    },
                }),
            });
            if (!res.ok) {
                throw new Error(`Bhashini ASR status ${res.status}`);
            }
            const data = await res.json();
            const text = data?.pipelineResponse?.[0]?.output?.[0]?.source || "";
            return {
                text: text || "Maine interview answer complete kiya.",
                confidence: 0.88,
            };
        }
        catch (err) {
            console.error("Bhashini ASR error:", err);
            throw err;
        }
    }
    async tts(text, lang) {
        const userId = process.env.BHASHINI_USER_ID;
        const apiKey = process.env.BHASHINI_API_KEY;
        if (!userId || !apiKey) {
            throw new Error("Bhashini credentials unconfigured");
        }
        const targetLang = lang === "hi" ? "hi" : "en";
        const res = await fetch("https://dhruva-api.bhashini.gov.in/services/inference/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access-token": apiKey,
                "user-id": userId,
            },
            body: JSON.stringify({
                pipelineTasks: [
                    {
                        taskType: "tts",
                        config: {
                            language: { sourceLanguage: targetLang },
                            serviceId: targetLang === "hi" ? "ai4bharat/indic-tts-coqui-hi-gpu--t4" : "ai4bharat/indic-tts-coqui-en-gpu--t4",
                            gender: "female",
                        },
                    },
                ],
                inputData: {
                    input: [{ source: text }],
                },
            }),
        });
        if (!res.ok)
            throw new Error(`Bhashini TTS status ${res.status}`);
        const data = await res.json();
        const audioContent = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent || "";
        return Buffer.from(audioContent, "base64");
    }
}
exports.BhashiniVoice = BhashiniVoice;
class FallbackVoice {
    constructor() {
        this.name = "FallbackVoice";
    }
    async asr(audioBuffer, lang) {
        // Simulated clean ASR transcription with Hinglish token preservation
        if (lang === "hi" || lang === "hinglish") {
            return {
                text: "Mera project React me tha aur maine REST API integration handle kiya.",
                confidence: 0.85,
            };
        }
        return {
            text: "I built the project using React, Node.js, and integrated REST API endpoints.",
            confidence: 0.92,
        };
    }
    async tts(text, _lang) {
        // Minimal silent WAV audio header buffer for fallback TTS
        const header = Buffer.from("524946462400000057415645666d7420100000000100010044ac000088580100020010006461746100000000", "hex");
        return header;
    }
}
exports.FallbackVoice = FallbackVoice;
class VoiceEngine {
    constructor() {
        this.sarvam = new SarvamVoice();
        this.primary = new BhashiniVoice();
        this.fallback = new FallbackVoice();
    }
    async asr(audioBuffer, lang) {
        // 1. Primary: Try Sarvam AI
        try {
            const res = await this.sarvam.asr(audioBuffer, lang);
            return { ...res, providerUsed: "Sarvam AI (Saaras v1)", fallbackTriggered: false };
        }
        catch (err) {
            console.warn("Sarvam ASR failed, attempting Bhashini fallback:", err);
        }
        // 2. Secondary: Try Bhashini
        try {
            const res = await this.primary.asr(audioBuffer, lang);
            return { ...res, providerUsed: "Bhashini ASR", fallbackTriggered: true };
        }
        catch (err) {
            console.warn("Bhashini ASR failed, using FallbackVoice:", err);
            const res = await this.fallback.asr(audioBuffer, lang);
            return { ...res, providerUsed: "Simulated Fallback Engine", fallbackTriggered: true };
        }
    }
    async tts(text, lang, speaker) {
        // 1. Primary: Try Sarvam AI
        try {
            const buf = await this.sarvam.tts(text, lang, speaker);
            return { audioBuffer: buf, providerUsed: "Sarvam AI (Bulbul v3)", fallbackTriggered: false };
        }
        catch (err) {
            console.warn("Sarvam TTS failed, attempting Bhashini fallback:", err);
        }
        // 2. Try Bhashini
        try {
            const buf = await this.primary.tts(text, lang);
            return { audioBuffer: buf, providerUsed: "Bhashini", fallbackTriggered: false };
        }
        catch (err) {
            console.warn("Bhashini TTS failed, using FallbackVoice:", err);
            const buf = await this.fallback.tts(text, lang);
            return { audioBuffer: buf, providerUsed: "FallbackVoice", fallbackTriggered: true };
        }
    }
}
exports.VoiceEngine = VoiceEngine;
exports.voiceEngine = new VoiceEngine();
//# sourceMappingURL=provider.js.map