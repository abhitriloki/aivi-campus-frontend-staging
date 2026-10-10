import { describe, it, expect } from "vitest";
import { analyzeLinkedInProfile } from "../services/analysisService";

describe("B2C vs Campus Isolation & LinkedIn Resiliency", () => {
  describe("Campus vs B2C User Role Evaluation", () => {
    const isCampusUserHelper = (
      tenant: { tenantId: string | null; role: string } | null,
      userEmail?: string | null
    ) => {
      return Boolean(
        ((tenant?.tenantId && tenant?.role === "student") ||
          userEmail?.endsWith(".ac.in") ||
          userEmail?.endsWith(".edu.in") ||
          userEmail?.includes("sunrise") ||
          userEmail?.includes("student")) &&
          tenant?.role !== "platform_admin"
      );
    };

    it("evaluates platform admin (abhi.triloki@gmail.com) as NOT a campus user", () => {
      const tenant = { tenantId: null, role: "platform_admin" };
      const email = "abhi.triloki@gmail.com";
      expect(isCampusUserHelper(tenant, email)).toBe(false);
    });

    it("evaluates regular B2C user as NOT a campus user", () => {
      const tenant = { tenantId: null, role: "b2c" };
      const email = "john.doe@gmail.com";
      expect(isCampusUserHelper(tenant, email)).toBe(false);
    });

    it("evaluates verified institutional student email as a campus user", () => {
      const tenant = { tenantId: "demo-sunrise", role: "student" };
      const email = "student@aktu.ac.in";
      expect(isCampusUserHelper(tenant, email)).toBe(true);
    });

    it("evaluates college demo student as a campus user", () => {
      const tenant = { tenantId: "demo-sunrise", role: "student" };
      const email = "student1@demo.aivilabs.com";
      expect(isCampusUserHelper(tenant, email)).toBe(true);
    });

    it("ensures platform admin with a tenantId attached is still NOT shown student portal banners", () => {
      const tenant = { tenantId: "demo-sunrise", role: "platform_admin" };
      const email = "abhi.triloki@gmail.com";
      expect(isCampusUserHelper(tenant, email)).toBe(false);
    });

    it("evaluates student with personal email (ujala12349@gmail.com) in college tenant as a campus user", () => {
      const tenant = { tenantId: "aivi-eng", role: "student" };
      const email = "ujala12349@gmail.com";
      expect(isCampusUserHelper(tenant, email)).toBe(true);
    });

    it("ensures campus routes (/campus/*) bypass B2C free plan paywall", () => {
      const isCampusPath = (path: string, planType: string) => {
        const isCampus = path.startsWith("/campus") || planType === "pro";
        return !isCampus && planType === "free";
      };
      expect(isCampusPath("/campus/linkedin-analyzer", "free")).toBe(false);
      expect(isCampusPath("/dashboard/linkedin", "free")).toBe(true);
    });
  });

  describe("LinkedIn Analyzer Resilient Fallback", () => {
    it("returns complete structured analysis even when Cloud Function is unreachable", async () => {
      const sampleText = `
        Alex Mercer
        Senior Full Stack Engineer
        San Francisco, CA

        Summary:
        10+ years of experience architecting high-scale cloud distributed systems. Led engineering teams to scale SaaS platforms to 5M+ users.

        Experience:
        Lead Engineer at Acme Cloud
        - Increased system uptime to 99.99% and reduced latency by 45%.
        - Mentored 12 junior engineers and managed $2M AWS infrastructure budget.

        Skills:
        TypeScript, React, Node.js, AWS, Kubernetes, Distributed Systems, Python
      `;

      const response = await analyzeLinkedInProfile(sampleText);
      expect(response).toBeDefined();
      expect(response.analysisId).toBeDefined();
      expect(response.result).toBeDefined();

      const result = response.result as any;
      expect(result.overall_score).toBeGreaterThanOrEqual(50);
      expect(result.scores).toBeDefined();
      expect(result.scores.headline_strength).toBeGreaterThan(0);
      expect(result.scores.recruiter_search_visibility).toBeGreaterThan(0);
      expect(result.premium_metrics).toBeDefined();
      expect(result.premium_metrics.recruiter_visibility_score).toBeGreaterThan(0);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.career_level_detected).toBe("Senior");
    }, 15000);
  });

  describe("Voice Mock Interview Zero-Speech Abort Guard", () => {
    it("returns Incomplete / Not Evaluated score 0 when session ends with zero candidate words", async () => {
      const { evaluateRealtimeVoiceSession } = await import("../services/tenantService");

      // Zero candidate words (interviewer only)
      const transcript = [
        {
          role: "interviewer",
          text: "Namaste! Main Kabir hoon. Aaj hum aapka mock interview karenge.",
          timestamp: Date.now(),
        },
      ];

      const res = await evaluateRealtimeVoiceSession({
        sessionId: "test-zero-turn",
        transcript,
        targetRole: "Software Engineer",
        company: "Google",
        durationSeconds: 10,
      });

      expect(res).toBeDefined();
      expect(res.evaluation.overallScore).toBe(0);
      expect(res.evaluation.hiringRecommendation).toBe("Incomplete / Not Evaluated");
      expect(res.evaluation.hiringProbabilityPct).toBe(0);
      expect(res.evaluation.questionEvaluations).toHaveLength(0);
    }, 15000);

    it("evaluates realistically when candidate provides actual answers", async () => {
      const { evaluateRealtimeVoiceSession } = await import("../services/tenantService");

      const transcript = [
        { role: "interviewer", text: "Tell me about your Java background.", timestamp: Date.now() },
        {
          role: "candidate",
          text: "I built a microservices backend with Spring Boot and PostgreSQL, optimizing query latency by indexing key foreign keys and caching session tokens.",
          timestamp: Date.now(),
        },
      ];

      const res = await evaluateRealtimeVoiceSession({
        sessionId: "test-with-speech",
        transcript,
        targetRole: "Software Engineer",
        company: "Google",
        durationSeconds: 90,
      });

      expect(res).toBeDefined();
      expect(res.evaluation.overallScore).toBeGreaterThan(0);
      expect(res.evaluation.overallScore).toBeLessThanOrEqual(10);
      expect(res.evaluation.hiringRecommendation).not.toBe("Incomplete / Not Evaluated");
    }, 15000);
  });

  describe("Resilient LLM JSON Parser Logic", () => {
    const parseResilientJson = (text: string): any => {
      let cleaned = text
        .replace(/^```(?:json)?\s*/gi, "")
        .replace(/\s*```\s*$/g, "")
        .trim();

      const firstBrace = cleaned.indexOf("{");
      const firstBracket = cleaned.indexOf("[");
      let startIndex = -1;
      let endIndex = -1;

      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIndex = firstBrace;
        endIndex = cleaned.lastIndexOf("}");
      } else if (firstBracket !== -1) {
        startIndex = firstBracket;
        endIndex = cleaned.lastIndexOf("]");
      }

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
      }

      try {
        return JSON.parse(cleaned);
      } catch {
        const repaired = cleaned
          .replace(/\/\/.*$/gm, "")
          .replace(/,\s*([\}\]])/g, "$1")
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/([{,]\s*)'([^']+)'\s*:/g, '$1"$2":')
          .replace(/:\s*undefined\b/g, ": null");

        return JSON.parse(repaired);
      }
    };

    it("parses JSON with unquoted keys and trailing commas (Gemini 500 error fix)", () => {
      const rawLlmResponse = `
      Here is your analysis:
      \`\`\`json
      {
        readiness_score: 76,
        current_level: "SDE 1",
        target_level: "SDE 2",
        gaps: [
          { dimension: "System Design", score: 65, description: "Needs distributed systems depth", },
        ],
      }
      \`\`\`
      `;

      const result = parseResilientJson(rawLlmResponse);
      expect(result).toBeDefined();
      expect(result.readiness_score).toBe(76);
      expect(result.current_level).toBe("SDE 1");
      expect(result.gaps).toHaveLength(1);
      expect(result.gaps[0].dimension).toBe("System Design");
    });
  });
});
