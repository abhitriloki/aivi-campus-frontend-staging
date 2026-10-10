import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResumeIntelligence from "@/pages/ResumeIntelligence";
import { normalizeResumeAnalysis } from "@/types/resumeAnalysis";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick }: any) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
    section: ({ children, className }: any) => (
      <section className={className}>
        {children}
      </section>
    ),
    span: ({ children, className }: any) => (
      <span className={className}>
        {children}
      </span>
    ),
    circle: () => <circle />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 300 }}>
        {children}
      </div>
    ),
  };
});

let mockLatestAnalysisData: any = null;

let mockGetLatestAnalysisOverride: any = null;

vi.mock("@/services/analysisService", () => ({
  getLatestAnalysis: vi.fn(async (...args: any[]) => {
    if (mockGetLatestAnalysisOverride) {
      return mockGetLatestAnalysisOverride(...args);
    }
    return mockLatestAnalysisData;
  }),
  runAnalysis: vi.fn(async () => ({ result: mockLatestAnalysisData })),
  getAnalysisHistory: vi.fn(async () => []),
  saveAnalysisResult: vi.fn(async () => {}),
  getUserResumeMemory: vi.fn(() => ""),
  saveUserResumeMemory: vi.fn(() => {}),
}));

let mockUser: any = { uid: "test-user-123", email: "test@example.com" };

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock("@/services/planService", () => ({
  checkAndIncrementUsage: vi.fn(async () => ({ allowed: true, plan: "pro" })),
}));

vi.mock("@/integrations/firebase/client", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(async () => ({ empty: true, docs: [] })),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("Resume Intelligence Dossier Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { uid: "test-user-123", email: "test@example.com" };
    mockGetLatestAnalysisOverride = null;
    localStorage.clear();
    sessionStorage.clear();
  });

  it("Gemini weak_bullets renders non-empty WEAK and BETTER text", async () => {
    mockLatestAnalysisData = {
      overall_score: 82,
      seniority_level: "Mid Level",
      scores: {
        ats_compatibility: 85,
        keyword_optimization: 78,
        technical_depth: 80,
        leadership_signal: 70,
        quantification: 65,
        clarity: 90,
      },
      score_guidance: {},
      weak_bullets: [
        {
          text: "Handled bug fixes and maintenance for internal tools.",
          suggestion: "Resolved 45+ high-priority software defects reducing sprint turnaround by 30%.",
        },
      ],
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    expect(screen.getByText(/Handled bug fixes and maintenance for internal tools/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolved 45\+ high-priority software defects reducing sprint turnaround by 30%/i)).toBeInTheDocument();
  });

  it("legacy bullet_improvements renders non-empty WEAK and BETTER text", async () => {
    mockLatestAnalysisData = {
      overall_score: 75,
      seniority_level: "Senior",
      scores: {
        ats_compatibility: 70,
        keyword_optimization: 72,
        technical_depth: 75,
        leadership_signal: 68,
        quantification: 60,
        clarity: 80,
      },
      bullet_improvements: [
        {
          original: "Responsible for team code reviews.",
          improved: "Spearheaded peer review guidelines across 8 engineers to boost code quality by 25%.",
        },
      ],
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    expect(screen.getByText(/Responsible for team code reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/Spearheaded peer review guidelines across 8 engineers to boost code quality by 25%/i)).toBeInTheDocument();
  });

  it("overall_guidance banner renders when provided", async () => {
    const testGuidance = "Focus on adding quantifiable metrics and leadership indicators to your engineering experience.";
    mockLatestAnalysisData = {
      overall_score: 79,
      seniority_level: "Mid-Level",
      overall_guidance: testGuidance,
      scores: {
        ats_compatibility: 75,
      },
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    expect(screen.getByText("Executive Strategy Guidance")).toBeInTheDocument();
    expect(screen.getByText(testGuidance)).toBeInTheDocument();
  });

  it("all 6 guidance dimensions render properly", async () => {
    mockLatestAnalysisData = {
      overall_score: 88,
      seniority_level: "Lead",
      scores: {
        ats_compatibility: 90,
        keyword_optimization: 85,
        technical_depth: 88,
        leadership_signal: 82,
        quantification: 78,
        clarity: 92,
      },
      score_guidance: {
        ats_compatibility: {
          verdict: "Good",
          why: "Standard headings and clean formatting ensure high ATS parsing rate.",
          how_to_improve: ["Keep font consistent."],
        },
        keyword_optimization: {
          verdict: "Good",
          why: "High match rate with domain terminology.",
          how_to_improve: ["Include cloud tools."],
        },
        technical_depth: {
          verdict: "Good",
          why: "Clear description of system design and technologies used.",
          how_to_improve: ["Elaborate on database architecture."],
        },
        leadership_signal: {
          verdict: "Needs Improvement",
          why: "More initiative examples needed in project descriptions.",
          how_to_improve: ["Mention cross-functional collaboration."],
        },
        quantification: {
          verdict: "Needs Improvement",
          why: "Add metrics to demonstrate business outcomes.",
          how_to_improve: ["Specify percentage improvements and user counts."],
        },
        clarity: {
          verdict: "Good",
          why: "Concise and easy to read.",
          how_to_improve: ["Remove redundant phrasing."],
        },
      },
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    const guidanceHeader = screen.getByText("Detailed Score Guidance");
    expect(guidanceHeader).toBeInTheDocument();
    const guidanceContainer = guidanceHeader.closest(".overflow-hidden") || guidanceHeader.parentElement!;

    // Verify all 6 dimension headers exist within Detailed Score Guidance
    expect(within(guidanceContainer).getByText("Ats Compatibility")).toBeInTheDocument();
    expect(within(guidanceContainer).getByText("Keyword Optimization")).toBeInTheDocument();
    expect(within(guidanceContainer).getByText("Technical Depth")).toBeInTheDocument();
    expect(within(guidanceContainer).getByText("Leadership Signal")).toBeInTheDocument();
    expect(within(guidanceContainer).getByText("Quantification")).toBeInTheDocument();
    expect(within(guidanceContainer).getByText("Clarity")).toBeInTheDocument();
  });

  it("accordion expansion displays Why and numbered how_to_improve items", async () => {
    mockLatestAnalysisData = {
      overall_score: 75,
      seniority_level: "Senior",
      scores: {
        ats_compatibility: 65,
      },
      score_guidance: {
        ats_compatibility: {
          verdict: "Needs Improvement",
          why: "Tables and complex multi-column structures prevent proper ATS extraction.",
          how_to_improve: [
            "Convert multi-column tables to a single-column layout.",
            "Use standard section headings like Experience and Education.",
          ],
        },
      },
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    const guidanceHeader = screen.getByText("Detailed Score Guidance");
    const guidanceContainer = guidanceHeader.closest(".overflow-hidden") || guidanceHeader.parentElement!;

    const atsAccordionButton = within(guidanceContainer).getByText("Ats Compatibility").closest("button");
    expect(atsAccordionButton).not.toBeNull();

    fireEvent.click(atsAccordionButton!);

    expect(screen.getByText("Tables and complex multi-column structures prevent proper ATS extraction.")).toBeInTheDocument();
    expect(screen.getByText("How to Improve")).toBeInTheDocument();
    expect(screen.getByText("Convert multi-column tables to a single-column layout.")).toBeInTheDocument();
    expect(screen.getByText("Use standard section headings like Experience and Education.")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("missing optional fields do not crash and handle empty payloads safely", () => {
    const normalized = normalizeResumeAnalysis(null);
    expect(normalized.overall_score).toBe(0);
    expect(normalized.weak_bullets).toEqual([]);
    expect(normalized.scores.ats_compatibility).toBe(0);

    const emptyObj = normalizeResumeAnalysis({});
    expect(emptyObj.overall_score).toBe(0);
    expect(emptyObj.weak_bullets).toEqual([]);

    const partialData = normalizeResumeAnalysis({
      scores: null,
      score_guidance: null,
      weak_bullets: null,
      overall_guidance: null,
    });
    expect(partialData.overall_score).toBe(0);
    expect(partialData.weak_bullets).toEqual([]);
    expect(partialData.scores.ats_compatibility).toBe(0);
    expect(partialData.score_guidance).toEqual({});
  });

  it("empty weak_bullets falls back to populated bullet_improvements array", () => {
    const dataWithEmptyWeakBullets = {
      weak_bullets: [],
      bullet_improvements: [
        {
          original: "Old legacy bullet item",
          improved: "Enhanced actionable bullet item",
          reason: "Clear impact",
        },
      ],
    };

    const normalized = normalizeResumeAnalysis(dataWithEmptyWeakBullets);
    expect(normalized.weak_bullets).toHaveLength(1);
    expect(normalized.weak_bullets[0].original).toBe("Old legacy bullet item");
    expect(normalized.weak_bullets[0].suggestion).toBe("Enhanced actionable bullet item");
    expect(normalized.weak_bullets[0].reason).toBe("Clear impact");
  });

  it("normalizes NaN, invalid, infinite, negative, and out-of-range scores clamped between 0 and 100", () => {
    const rawData = {
      overall_score: 150, // out of range -> clamped to 100
      scores: {
        ats_compatibility: -25, // negative -> clamped to 0
        keyword_optimization: NaN, // NaN -> 0
        technical_depth: Infinity, // Infinity -> 0
        leadership_signal: -Infinity, // -Infinity -> 0
        quantification: "not-a-number", // invalid string -> 0
        clarity: "95", // numeric string -> 95
        custom_metric: 250, // custom metric clamped -> 100
      },
    };

    const normalized = normalizeResumeAnalysis(rawData);
    expect(normalized.overall_score).toBe(100);
    expect(normalized.scores.ats_compatibility).toBe(0);
    expect(normalized.scores.keyword_optimization).toBe(0);
    expect(normalized.scores.technical_depth).toBe(0);
    expect(normalized.scores.leadership_signal).toBe(0);
    expect(normalized.scores.quantification).toBe(0);
    expect(normalized.scores.clarity).toBe(95);
    expect(normalized.scores.custom_metric).toBe(100);
  });

  it("filters non-string values out of top_skills, missing_sections, and buzzwords_detected", () => {
    const rawData = {
      top_skills: ["TypeScript", null, 123, undefined, { skill: "React" }, "Node.js", ""],
      missing_sections: [null, "Certifications", false, "Projects", "   "],
      buzzwords_detected: ["Synergy", true, 999, "Go-getter"],
      seniority_level: 42 as any, // non-string -> fallback "—"
      overall_guidance: null,
      summary: 12345 as any, // non-string -> undefined
    };

    const normalized = normalizeResumeAnalysis(rawData);
    expect(normalized.top_skills).toEqual(["TypeScript", "Node.js"]);
    expect(normalized.missing_sections).toEqual(["Certifications", "Projects"]);
    expect(normalized.buzzwords_detected).toEqual(["Synergy", "Go-getter"]);
    expect(normalized.seniority_level).toBe("—");
    expect(normalized.overall_guidance).toBeUndefined();
    expect(normalized.summary).toBeUndefined();
  });

  it("ignores unscoped legacy local/session cache and relies solely on Firestore / authenticated context", async () => {
    localStorage.setItem(
      "aivi_latest_resume_analysis",
      JSON.stringify({
        overall_score: 99,
        scores: { ats_compatibility: 99 },
      })
    );
    sessionStorage.setItem(
      "aivi_latest_resume_analysis",
      JSON.stringify({
        overall_score: 99,
        scores: { ats_compatibility: 99 },
      })
    );

    mockLatestAnalysisData = {
      overall_score: 64,
      seniority_level: "Junior",
      scores: { ats_compatibility: 64 },
    };

    render(<ResumeIntelligence />);

    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    // Firestore score is 64, legacy cache was 99. Verify 64 is displayed and 99 is never rendered.
    expect(screen.getByText("64")).toBeInTheDocument();
    expect(screen.queryByText("99")).not.toBeInTheDocument();
  });

  it("clears report state and switches to upload mode when user logs out or has no uid", async () => {
    mockUser = null;
    mockLatestAnalysisData = {
      overall_score: 85,
      scores: { ats_compatibility: 85 },
    };

    render(<ResumeIntelligence />);

    // In upload mode with no active user, the header should state the upload prompt
    expect(await screen.findByText("Resume Intelligence & ATS Audit")).toBeInTheDocument();
    expect(screen.queryByText("Resume Intelligence Dossier")).not.toBeInTheDocument();
  });

  it("normalizes top-level score aliases across all 6 dimensions", () => {
    const rawData = {
      overall_score: 75,
      ats_compatibility: 82,
      keyword_score: 74,
      technical_depth: 88,
      leadership_signal: 79,
      impact_score: 68,
      clarity_score: 91,
    };

    const normalized = normalizeResumeAnalysis(rawData);
    expect(normalized.scores.ats_compatibility).toBe(82);
    expect(normalized.scores.keyword_optimization).toBe(74);
    expect(normalized.scores.technical_depth).toBe(88);
    expect(normalized.scores.leadership_signal).toBe(79);
    expect(normalized.scores.quantification).toBe(68);
    expect(normalized.scores.clarity).toBe(91);
  });

  it("gives nested canonical scores precedence over top-level score aliases", () => {
    const rawData = {
      overall_score: 85,
      scores: {
        ats_compatibility: 92,
        keyword_optimization: 87,
        technical_depth: 81,
        leadership_signal: 83,
        quantification: 77,
        clarity: 89,
      },
      // Conflicting top-level aliases
      ats_score: 40,
      keyword_score: 35,
      technical_depth: 50,
      leadership: 45,
      impact_score: 30,
      clarity_score: 55,
    };

    const normalized = normalizeResumeAnalysis(rawData);
    expect(normalized.scores.ats_compatibility).toBe(92);
    expect(normalized.scores.keyword_optimization).toBe(87);
    expect(normalized.scores.technical_depth).toBe(81);
    expect(normalized.scores.leadership_signal).toBe(83);
    expect(normalized.scores.quantification).toBe(77);
    expect(normalized.scores.clarity).toBe(89);
  });

  it("resolves invalid, non-finite, or malformed top-level score aliases to 0", () => {
    const rawData = {
      ats_score: "invalid_number",
      keyword_score: null,
      technical_depth: undefined,
      leadership: NaN,
      impact_score: -Infinity,
      clarity_score: {},
    };

    const normalized = normalizeResumeAnalysis(rawData);
    expect(normalized.scores.ats_compatibility).toBe(0);
    expect(normalized.scores.keyword_optimization).toBe(0);
    expect(normalized.scores.technical_depth).toBe(0);
    expect(normalized.scores.leadership_signal).toBe(0);
    expect(normalized.scores.quantification).toBe(0);
    expect(normalized.scores.clarity).toBe(0);
  });


  it("protects against stale completion when switching from User A to User B, and clears immediately on logout", async () => {
    let resolveUserA: (val: any) => void = () => {};
    let resolveUserB: (val: any) => void = () => {};

    const promiseA = new Promise((res) => {
      resolveUserA = res;
    });
    const promiseB = new Promise((res) => {
      resolveUserB = res;
    });

    mockGetLatestAnalysisOverride = (uid: string) => {
      if (uid === "user-a") return promiseA;
      if (uid === "user-b") return promiseB;
      return Promise.resolve(null);
    };

    // 1. Mount with User A
    mockUser = { uid: "user-a", email: "a@campus.edu" };
    const { rerender } = render(<ResumeIntelligence />);

    // In-flight loading state
    expect(screen.getByText(/Analyzing with AI|Loading/i)).toBeInTheDocument();

    // 2. Switch context to User B before A resolves
    mockUser = { uid: "user-b", email: "b@campus.edu" };
    rerender(<ResumeIntelligence />);

    // 3. Resolve User A's deferred response
    resolveUserA({
      overall_score: 95,
      seniority_level: "Principal",
      scores: { ats_compatibility: 95 },
    });

    // Wait microtask tick - verify User A's score 95 is NEVER displayed
    await Promise.resolve();
    expect(screen.queryByText("95")).not.toBeInTheDocument();

    // 4. Resolve User B's response
    resolveUserB({
      overall_score: 72,
      seniority_level: "Junior",
      scores: { ats_compatibility: 72 },
    });

    // Verify only User B's report is rendered
    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.queryByText("95")).not.toBeInTheDocument();

    // 5. Logout during an unresolved request and prove upload mode remains visible
    let resolveUserC: (val: any) => void = () => {};
    mockGetLatestAnalysisOverride = (uid: string) => {
      if (uid === "user-c") {
        return new Promise((res) => {
          resolveUserC = res;
        });
      }
      return Promise.resolve(null);
    };

    mockUser = { uid: "user-c", email: "c@campus.edu" };
    rerender(<ResumeIntelligence />);

    // In-flight request for C, now log out
    mockUser = null;
    rerender(<ResumeIntelligence />);

    // Should immediately clear and display upload view
    expect(await screen.findByText("Resume Intelligence & ATS Audit")).toBeInTheDocument();
    expect(screen.queryByText("Resume Intelligence Dossier")).not.toBeInTheDocument();

    // Even if C's request now resolves, it must not update state
    resolveUserC({
      overall_score: 88,
      scores: { ats_compatibility: 88 },
    });
    await Promise.resolve();

    expect(screen.getByText("Resume Intelligence & ATS Audit")).toBeInTheDocument();
    expect(screen.queryByText("Resume Intelligence Dossier")).not.toBeInTheDocument();
    expect(screen.queryByText("88")).not.toBeInTheDocument();
  });

  it("ensures logging in as another student with no analyses shows upload mode and never previous student's report", async () => {
    // 1. Student A logs in and has an analysis
    mockUser = { uid: "student-a-uid", email: "student.a@college.edu" };
    mockLatestAnalysisData = {
      overall_score: 91,
      scores: { ats_compatibility: 91 },
      seniority_level: "Mid-Level",
    };

    const { rerender } = render(<ResumeIntelligence />);
    expect(await screen.findByText("Resume Intelligence Dossier")).toBeInTheDocument();
    expect(screen.getByText("91")).toBeInTheDocument();

    // 2. Student A logs out -> report disappears
    mockUser = null;
    mockLatestAnalysisData = null;
    rerender(<ResumeIntelligence />);
    expect(await screen.findByText("Resume Intelligence & ATS Audit")).toBeInTheDocument();
    expect(screen.queryByText("Resume Intelligence Dossier")).not.toBeInTheDocument();

    // 3. Student B logs in with NO prior analyses
    mockUser = { uid: "student-b-uid", email: "student.b@college.edu" };
    mockLatestAnalysisData = null;
    rerender(<ResumeIntelligence />);

    // Must remain in upload mode, and Student A's score 91 must NEVER appear
    expect(await screen.findByText("Resume Intelligence & ATS Audit")).toBeInTheDocument();
    expect(screen.queryByText("Resume Intelligence Dossier")).not.toBeInTheDocument();
    expect(screen.queryByText("91")).not.toBeInTheDocument();
  });
});

