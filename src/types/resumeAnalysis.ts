export interface BulletImprovement {
  original: string;
  suggestion: string;
  reason?: string;
}

export interface ScoreGuidanceItem {
  verdict: "Good" | "Needs Improvement" | "Critical" | "Not Applicable" | string;
  why: string;
  how_to_improve: string[];
}

export interface ResumeScores {
  ats_compatibility: number;
  keyword_optimization: number;
  technical_depth: number;
  leadership_signal: number;
  quantification: number;
  clarity: number;
  [key: string]: number;
}

export interface ResumeAnalysisResult {
  overall_score?: number;
  seniority_level?: string;
  top_skills?: string[];
  missing_sections?: string[];
  buzzwords_detected?: string[];
  weak_bullets: BulletImprovement[];
  overall_guidance?: string;
  summary?: string;
  scores: ResumeScores;
  score_guidance: Record<string, ScoreGuidanceItem>;
}

export const DEFAULT_SCORE_KEYS = [
  "ats_compatibility",
  "keyword_optimization",
  "technical_depth",
  "leadership_signal",
  "quantification",
  "clarity",
] as const;

/**
 * Clamps a score value to a finite integer/number between 0 and 100.
 * Any invalid, NaN, non-numeric, or infinite values become 0.
 */
function normalizeScoreValue(val: unknown): number {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return 0;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(100, Math.max(0, Math.round(parsed)));
  }
  if (typeof val === "number") {
    if (!Number.isFinite(val)) return 0;
    return Math.min(100, Math.max(0, Math.round(val)));
  }
  return 0;
}

/**
 * Ensures an array contains only valid, non-empty strings.
 * Filters out non-string types, nulls, undefined, and empty/whitespace-only values.
 */
function normalizeStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed) {
        result.push(trimmed);
      }
    }
  }
  return result;
}

/**
 * Safely normalizes an optional string property.
 * Returns a non-empty string or undefined.
 */
function normalizeOptionalString(val: unknown): string | undefined {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed ? trimmed : undefined;
  }
  return undefined;
}

export function normalizeResumeAnalysis(raw: unknown): ResumeAnalysisResult {
  if (!raw || typeof raw !== "object") {
    return {
      overall_score: 0,
      seniority_level: "—",
      top_skills: [],
      missing_sections: [],
      buzzwords_detected: [],
      weak_bullets: [],
      scores: {
        ats_compatibility: 0,
        keyword_optimization: 0,
        technical_depth: 0,
        leadership_signal: 0,
        quantification: 0,
        clarity: 0,
      },
      score_guidance: {},
    };
  }

  const data = raw as Record<string, any>;
  const rawScores = data.scores && typeof data.scores === "object" ? data.scores : {};

  // Pick first defined score candidate (supporting both number and numeric string)
  const resolveScore = (...candidates: unknown[]): number => {
    for (const c of candidates) {
      if (c !== undefined && c !== null && c !== "") {
        return normalizeScoreValue(c);
      }
    }
    return 0;
  };

  // 1. Normalize every score to a finite number clamped between 0 and 100
  // Nested canonical values must take precedence over legacy top-level aliases.
  const scores: ResumeScores = {
    ats_compatibility: resolveScore(
      rawScores.ats_compatibility,
      rawScores.ats,
      rawScores.ats_score,
      data.ats_compatibility,
      data.ats_score
    ),
    keyword_optimization: resolveScore(
      rawScores.keyword_optimization,
      rawScores.keywords,
      data.keyword_optimization,
      data.keyword_score
    ),
    technical_depth: resolveScore(
      rawScores.technical_depth,
      rawScores.technical,
      data.technical_depth
    ),
    leadership_signal: resolveScore(
      rawScores.leadership_signal,
      rawScores.leadership,
      data.leadership_signal
    ),
    quantification: resolveScore(
      rawScores.quantification,
      rawScores.metrics,
      data.quantification,
      data.impact_score
    ),
    clarity: resolveScore(
      rawScores.clarity,
      data.clarity,
      data.clarity_score
    ),
  };

  for (const [key, val] of Object.entries(rawScores)) {
    if (!(key in scores)) {
      scores[key] = normalizeScoreValue(val);
    }
  }

  // 2. If weak_bullets is missing or empty, fall back to a populated bullet_improvements array
  const rawBullets: any[] =
    Array.isArray(data.weak_bullets) && data.weak_bullets.length > 0
      ? data.weak_bullets
      : Array.isArray(data.bullet_improvements) && data.bullet_improvements.length > 0
      ? data.bullet_improvements
      : [];

  const weak_bullets: BulletImprovement[] = [];
  for (const b of rawBullets) {
    if (!b) continue;
    if (typeof b === "string") {
      const trimmed = b.trim();
      if (trimmed) {
        weak_bullets.push({ original: trimmed, suggestion: "" });
      }
      continue;
    }
    const original = typeof b.text === "string"
      ? b.text
      : typeof b.original === "string"
      ? b.original
      : typeof b.bullet === "string"
      ? b.bullet
      : typeof b.before === "string"
      ? b.before
      : "";

    const suggestion = typeof b.suggestion === "string"
      ? b.suggestion
      : typeof b.improved === "string"
      ? b.improved
      : typeof b.better === "string"
      ? b.better
      : typeof b.after === "string"
      ? b.after
      : "";

    const reason = typeof b.reason === "string"
      ? b.reason
      : typeof b.why === "string"
      ? b.why
      : undefined;

    if (original.trim() || suggestion.trim()) {
      weak_bullets.push({
        original: original.trim(),
        suggestion: suggestion.trim(),
        ...(reason && reason.trim() ? { reason: reason.trim() } : {}),
      });
    }
  }

  // 3. Normalize score guidance
  const rawGuidance =
    data.score_guidance && typeof data.score_guidance === "object"
      ? data.score_guidance
      : data.guidance && typeof data.guidance === "object"
      ? data.guidance
      : {};
  const score_guidance: Record<string, ScoreGuidanceItem> = {};

  for (const key of DEFAULT_SCORE_KEYS) {
    const rawItem =
      rawGuidance[key] ||
      (key === "ats_compatibility" ? rawGuidance.ats || rawGuidance.ats_score : undefined) ||
      (key === "keyword_optimization" ? rawGuidance.keywords : undefined) ||
      (key === "technical_depth" ? rawGuidance.technical : undefined) ||
      (key === "leadership_signal" ? rawGuidance.leadership : undefined) ||
      (key === "quantification" ? rawGuidance.metrics : undefined);

    if (rawItem && typeof rawItem === "object") {
      score_guidance[key] = {
        verdict: typeof rawItem.verdict === "string"
          ? rawItem.verdict
          : scores[key] >= 75
          ? "Good"
          : scores[key] >= 50
          ? "Needs Improvement"
          : "Critical",
        why: typeof rawItem.why === "string"
          ? rawItem.why
          : typeof rawItem.explanation === "string"
          ? rawItem.explanation
          : typeof rawItem.description === "string"
          ? rawItem.description
          : "",
        how_to_improve: normalizeStringArray(rawItem.how_to_improve ?? rawItem.tips),
      };
    }
  }

  for (const [key, val] of Object.entries(rawGuidance)) {
    if (!score_guidance[key] && val && typeof val === "object") {
      const item = val as Record<string, any>;
      score_guidance[key] = {
        verdict: typeof item.verdict === "string" ? item.verdict : "Needs Improvement",
        why: typeof item.why === "string"
          ? item.why
          : typeof item.explanation === "string"
          ? item.explanation
          : "",
        how_to_improve: normalizeStringArray(item.how_to_improve),
      };
    }
  }

  // 4. Safely normalize seniority_level, overall_guidance, and summary as optional strings
  const seniority_level = normalizeOptionalString(data.seniority_level) ?? "—";
  const overall_guidance = normalizeOptionalString(data.overall_guidance ?? data.summary_guidance);
  const summary = normalizeOptionalString(data.summary);

  return {
    overall_score: normalizeScoreValue(data.overall_score),
    seniority_level,
    top_skills: normalizeStringArray(data.top_skills),
    missing_sections: normalizeStringArray(data.missing_sections),
    buzzwords_detected: normalizeStringArray(data.buzzwords_detected),
    weak_bullets,
    overall_guidance,
    summary,
    scores,
    score_guidance,
  };
}
