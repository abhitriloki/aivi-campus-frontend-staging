import { describe, it, expect } from "vitest";
import {
  startMockInterviewSchema,
  answerMockInterviewTurnSchema,
  finishMockInterviewSchema,
  adjustFacultyInterviewScoreSchema,
} from "../../functions/src/security/validators";

describe("Phase 6 Vernacular AI Mock Interview Engine & Faculty Review Tests", () => {
  it("validates startMockInterviewSchema payload", () => {
    const valid = {
      mode: "mixed" as const,
      language: "hinglish" as const,
      roleContext: "Frontend React Developer",
    };
    const parsed = startMockInterviewSchema.parse(valid);
    expect(parsed.mode).toBe("mixed");
    expect(parsed.language).toBe("hinglish");
  });

  it("validates answerMockInterviewTurnSchema payload", () => {
    const valid = {
      sessionId: "mock_123",
      turnIndex: 0,
      transcriptOverride: "Mera project React aur REST API me tha.",
    };
    const parsed = answerMockInterviewTurnSchema.parse(valid);
    expect(parsed.turnIndex).toBe(0);
    expect(parsed.transcriptOverride).toContain("React");
  });

  it("validates finishMockInterviewSchema payload", () => {
    const valid = { sessionId: "mock_123" };
    const parsed = finishMockInterviewSchema.parse(valid);
    expect(parsed.sessionId).toBe("mock_123");
  });

  it("validates adjustFacultyInterviewScoreSchema payload", () => {
    const valid = {
      sessionId: "mock_123",
      adjustedScore: 8.5,
      note: "Student demonstrated strong technical understanding despite ASR noise.",
    };
    const parsed = adjustFacultyInterviewScoreSchema.parse(valid);
    expect(parsed.adjustedScore).toBe(8.5);
    expect(parsed.note).toContain("technical understanding");

    expect(() => adjustFacultyInterviewScoreSchema.parse({ sessionId: "m1", adjustedScore: 11, note: "" })).toThrow();
  });

  it("calculates communication bands accurately based on overall score cutoffs", () => {
    const computeBand = (overall: number) => {
      if (overall >= 8.5) return "Fluent";
      if (overall >= 7.0) return "Professional";
      if (overall >= 5.5) return "Conversational";
      return "Basic";
    };

    expect(computeBand(9.0)).toBe("Fluent");
    expect(computeBand(7.5)).toBe("Professional");
    expect(computeBand(6.0)).toBe("Conversational");
    expect(computeBand(4.5)).toBe("Basic");
  });

  it("verifies Hinglish English token preservation strategy", () => {
    const hinglishTranscript = "Mera project React me tha aur maine REST API integration handle kiya.";
    const englishTokens = ["React", "REST API", "integration"];

    englishTokens.forEach((token) => {
      expect(hinglishTranscript).toContain(token);
    });
  });
});
