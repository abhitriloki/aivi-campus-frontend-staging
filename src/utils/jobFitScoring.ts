// Deterministic scoring engine for Job Fit Analysis
// All scores are formula-based — no AI-generated numbers

export interface StructuredJobFitData {
  job_title: string;
  company_name: string;
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  required_tools: string[];
  matched_tools: string[];
  missing_tools: string[];
  experience_required_years: number;
  experience_detected_years: number;
  keyword_overlap_count: number;
  total_required_keywords: number;
  seniority_alignment_score: number; // 0-1
  // AI still provides these for display
  skill_overlap_data?: { skill: string; resume: number; job: number }[];
  action_plan?: any;
  summary?: string;
}

export interface ComputedScores {
  job_match_percentage: number;
  eligibility_score: number;
  shortlist_probability: number;
  role_fit_index: number;
  // Ratios for breakdown
  skill_ratio: number;
  tool_ratio: number;
  experience_ratio: number;
  keyword_ratio: number;
  seniority_alignment: number;
}

export function normalizeJobFitData(raw: any): StructuredJobFitData {
  if (!raw) return raw;

  const reqSkills: string[] = Array.isArray(raw.required_skills) ? raw.required_skills : [];
  const matchSkills: string[] = Array.isArray(raw.matched_skills) ? raw.matched_skills : [];
  const missSkills: string[] = Array.isArray(raw.missing_skills) ? raw.missing_skills : [];

  const toolsMatched: string[] = Array.isArray(raw.matched_tools)
    ? raw.matched_tools
    : (Array.isArray(raw.tools_matched) ? raw.tools_matched : []);
  const toolsMissing: string[] = Array.isArray(raw.missing_tools)
    ? raw.missing_tools
    : (Array.isArray(raw.tools_missing) ? raw.tools_missing : []);
  const reqTools: string[] = Array.isArray(raw.required_tools) && raw.required_tools.length > 0
    ? raw.required_tools
    : [...toolsMatched, ...toolsMissing];

  const expRequired: number = typeof raw.experience_required_years === "number"
    ? raw.experience_required_years
    : (typeof raw.experience_match?.required_years === "number"
        ? raw.experience_match.required_years
        : (raw.experience_match?.match === false ? 2 : 1));

  const expDetected: number = typeof raw.experience_detected_years === "number"
    ? raw.experience_detected_years
    : (typeof raw.experience_match?.candidate_years === "number"
        ? raw.experience_match.candidate_years
        : (raw.experience_match?.match ? expRequired : 0.5));

  const jdKeywords: string[] = Array.isArray(raw.keywords_from_jd) ? raw.keywords_from_jd : [];
  const resKeywords: string[] = Array.isArray(raw.keywords_in_resume) ? raw.keywords_in_resume : [];
  const totKeywords: number = typeof raw.total_required_keywords === "number" && raw.total_required_keywords > 0
    ? raw.total_required_keywords
    : (jdKeywords.length > 0 ? jdKeywords.length : Math.max(reqSkills.length, 6));

  const keyOverlap: number = typeof raw.keyword_overlap_count === "number"
    ? raw.keyword_overlap_count
    : (resKeywords.length > 0
        ? resKeywords.filter((k: string) => jdKeywords.some((jk: string) => jk.toLowerCase() === k.toLowerCase())).length || resKeywords.length
        : matchSkills.length);

  let seniority = 0.7;
  if (typeof raw.seniority_alignment_score === "number") {
    seniority = raw.seniority_alignment_score;
  } else if (typeof raw.seniority_fit === "boolean") {
    seniority = raw.seniority_fit ? 0.88 : 0.52;
  }

  return {
    ...raw,
    job_title: raw.job_title || "Target Role",
    company_name: raw.company_name || "Enterprise Employer",
    required_skills: reqSkills,
    matched_skills: matchSkills,
    missing_skills: missSkills,
    required_tools: reqTools,
    matched_tools: toolsMatched,
    missing_tools: toolsMissing,
    experience_required_years: expRequired,
    experience_detected_years: expDetected,
    total_required_keywords: totKeywords,
    keyword_overlap_count: keyOverlap,
    seniority_alignment_score: seniority,
  };
}

function safeRatio(numerator: number, denominator: number, fallback = 0.75): number {
  if (denominator <= 0) return fallback;
  return Math.max(0, Math.min(numerator / denominator, 1));
}

export function computeScores(rawInput: StructuredJobFitData | any): ComputedScores {
  const data = normalizeJobFitData(rawInput);

  const totalRequiredSkills = data.required_skills?.length || 0;
  const matchedSkillsCount = data.matched_skills?.length || 0;
  const totalRequiredTools = data.required_tools?.length || 0;
  const matchedToolsCount = data.matched_tools?.length || 0;

  const skillRatio = safeRatio(matchedSkillsCount, totalRequiredSkills, 0.7);
  const toolRatio = safeRatio(matchedToolsCount, totalRequiredTools, 0.65);
  const experienceRatio = safeRatio(data.experience_detected_years || 0, data.experience_required_years || 1, 0.6);
  const keywordRatio = safeRatio(data.keyword_overlap_count || 0, data.total_required_keywords || 1, 0.65);
  const seniorityAlignment = Math.max(0.1, Math.min(data.seniority_alignment_score || 0.7, 1));

  const jobMatch = Math.max(25, Math.min(98, Math.round((0.4 * skillRatio + 0.25 * toolRatio + 0.2 * experienceRatio + 0.15 * keywordRatio) * 100)));
  const eligibility = Math.max(20, Math.min(98, Math.round((0.6 * skillRatio + 0.4 * experienceRatio) * 100)));
  const shortlist = Math.max(20, Math.min(98, Math.round((0.45 * skillRatio + 0.3 * keywordRatio + 0.25 * toolRatio) * 100)));
  const roleFit = Math.max(20, Math.min(98, Math.round(((0.6 * skillRatio + 0.4 * seniorityAlignment)) * 100)));

  return {
    job_match_percentage: jobMatch,
    eligibility_score: eligibility,
    shortlist_probability: shortlist,
    role_fit_index: roleFit,
    skill_ratio: Math.round(skillRatio * 100),
    tool_ratio: Math.round(toolRatio * 100),
    experience_ratio: Math.round(experienceRatio * 100),
    keyword_ratio: Math.round(keywordRatio * 100),
    seniority_alignment: Math.round(seniorityAlignment * 100),
  };
}

export function computeEstimatedImpact(data: StructuredJobFitData): ComputedScores {
  // Simulate: what if all missing critical skills were matched?
  const criticalMissing = data.missing_skills?.filter(Boolean) || [];
  const simulatedData: StructuredJobFitData = {
    ...data,
    matched_skills: [...(data.matched_skills || []), ...criticalMissing],
    missing_skills: [],
  };
  return computeScores(simulatedData);
}

export interface ScoreBreakdownItem {
  label: string;
  score: number;
  detail: string;
  formula: string;
}

export function getScoreBreakdown(data: StructuredJobFitData, scores: ComputedScores): ScoreBreakdownItem[] {
  return [
    {
      label: "Skill Overlap",
      score: scores.skill_ratio,
      detail: `${data.matched_skills?.length || 0} matched out of ${data.required_skills?.length || 0} required skills`,
      formula: "matched_skills / required_skills",
    },
    {
      label: "Tool Match",
      score: scores.tool_ratio,
      detail: `${data.matched_tools?.length || 0} matched out of ${data.required_tools?.length || 0} required tools`,
      formula: "matched_tools / required_tools",
    },
    {
      label: "Experience Match",
      score: scores.experience_ratio,
      detail: `${data.experience_detected_years || 0} years detected vs ${data.experience_required_years || 0} required`,
      formula: "min(detected_years / required_years, 1)",
    },
    {
      label: "Keyword Match",
      score: scores.keyword_ratio,
      detail: `${data.keyword_overlap_count || 0} keywords matched out of ${data.total_required_keywords || 0}`,
      formula: "keyword_overlap / total_required_keywords",
    },
    {
      label: "Seniority Alignment",
      score: scores.seniority_alignment,
      detail: `Alignment score: ${scores.seniority_alignment}%`,
      formula: "AI-extracted alignment (0-1 scale)",
    },
  ];
}
