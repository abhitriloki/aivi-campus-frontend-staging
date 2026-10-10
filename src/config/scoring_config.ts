export const scoringConfig = {
  resume_weight: 0.30,
  job_match_weight: 0.40,
  promotion_weight: 0.15,
  portfolio_weight: 0.15,

  resume_scores: {
    ats_compatibility: { weight: 0.20, label: "ATS Compatibility" },
    keyword_optimization: { weight: 0.15, label: "Keyword Optimization" },
    technical_depth: { weight: 0.20, label: "Technical Depth" },
    leadership_signal: { weight: 0.10, label: "Leadership Signal" },
    quantification: { weight: 0.15, label: "Quantification" },
    clarity: { weight: 0.10, label: "Clarity" },
    formatting: { weight: 0.10, label: "Formatting" },
  },

  job_match_scores: {
    skill_overlap: { weight: 0.30, label: "Skill Overlap" },
    experience_match: { weight: 0.25, label: "Experience Match" },
    seniority_alignment: { weight: 0.20, label: "Seniority Alignment" },
    keyword_match: { weight: 0.15, label: "Keyword Match" },
    tool_match: { weight: 0.10, label: "Tool Match" },
  },

  skill_gap_severity: {
    critical: { threshold: 0.8, label: "Critical", color: "score-critical" },
    moderate: { threshold: 0.5, label: "Moderate", color: "score-moderate" },
    minor: { threshold: 0, label: "Minor", color: "score-good" },
  },

  tiers: {
    free: {
      lifetime_limits: {
        resume: 2,
        job_fit: 2,
        roadmap: 1,
        interview: 1,
        promotion: 1,
        portfolio: 1,
      },
      features: ["resume_score", "basic_job_match"],
    },
    starter: {
      monthly_analyses: 30,
      price_inr: 399,
      features: [
        "resume_score", "full_job_match", "skill_roadmap",
        "interview_intelligence", "promotion_readiness",
        "portfolio_analysis", "resume_rewrite",
        "version_tracking", "score_tracking",
      ],
    },
    pro: {
      monthly_analyses: -1, // unlimited
      price_inr: 599,
      features: [
        "resume_score", "full_job_match", "skill_roadmap",
        "interview_intelligence", "promotion_readiness",
        "portfolio_analysis", "resume_rewrite",
        "version_tracking", "score_tracking",
        "priority_processing", "advanced_insights",
        "pdf_export", "version_history", "premium_support",
      ],
    },
  },
};
