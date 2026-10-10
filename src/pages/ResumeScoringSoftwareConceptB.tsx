import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, SearchCheck, Zap, ArrowRight, BarChart3, AlertTriangle } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const ResumeScoringSoftwareConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>ATS Resume Scoring Software & Checker v2 - AIVI Career OS</title>
        <meta
          name="description"
          content="Test your resume against top ATS parser screeners (Taleo, Workday, Greenhouse). Get 4-tier score breakdown: Action Verbs, Metrics Density, ATS Formatting, and Keyword Matching."
        />
        <link rel="canonical" href="https://aivilabs.com/resume-scoring-software" />
      </Helmet>

      <PublicPageShell
        eyebrow="Resume Scoring Engine v2"
        title={<>Enterprise-Grade <span className="text-[#FF6D4A]">ATS Resume Checker</span> &amp; Score Diagnostic</>}
        description="Audit your resume before submitting applications. AIVI simulates applicant tracking system (ATS) parsers to catch formatting errors, weak metrics, and keyword gaps."
        stats={[
          { value: "4 Scores", label: "Action Verbs, Metrics, Formatting & Keywords" },
          { value: "Taleo/Workday", label: "Simulates major enterprise parser algorithms" },
          { value: "Instant", label: "1-click fix integration inside Resume Studio" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Score My Resume Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/job-fit-analysis-tool"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Calculate JD Fit <BarChart3 className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="Why 75% of Resumes Never Reach Human Recruiters"
          description="Enterprise ATS software automatically discards resumes with parsing errors, multi-column tables, missing keywords, or non-standard headings."
        >
          <FeatureGrid>
            <FeatureCard
              icon={AlertTriangle}
              title="Multi-Column Parsing Crashes"
              description="Complex graphics, sidebars, and dual-column layouts scramble text when read by ATS software. AIVI flags these errors immediately."
              accent="coral"
            />
            <FeatureCard
              icon={SearchCheck}
              title="Low Action-Verb & Metric Density"
              description="Passive bullet points without numerical metrics (%, $, volume) trigger low relevance scores in automated screeners."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Non-Standard Heading Mismatch"
              description="Creative titles like 'My Journey' instead of 'Work Experience' cause parsers to miss entire sections of your background."
              accent="teal"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="The 4 Core Pillars of AIVI Resume Scoring"
          description="Our diagnostic algorithm provides comprehensive feedback across all key hiring dimensions."
        >
          <BulletPanel
            items={[
              {
                title: "1. ATS Structural Compliance (0-100)",
                text: "Verifies font safety, text extractability, margin spacing, and single-column layout integrity.",
              },
              {
                title: "2. Action-Verb & Impact Metric Score (0-100)",
                text: "Measures the strength of your achievement bullets and ensures every experience section contains quantified results.",
              },
              {
                title: "3. Keyword & Skill Alignment (0-100)",
                text: "Detects hard technical skills, software proficiencies, and industry keywords expected by hiring managers.",
              },
              {
                title: "4. Brevity & Readability Index (0-100)",
                text: "Checks line length, bullet conciseness, and document page length to ensure optimal recruiter scan times.",
              },
            ]}
          />
        </SectionBlock>

        <SectionBlock
          title="From Diagnosis to 1-Click Fix in Resume Studio"
          description="Don't just inspect your score — fix every issue instantly."
        >
          <div className="rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white text-center space-y-4">
            <h3 className="text-xl font-bold">Bridge Your Score Directly into Resume Studio</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Once AIVI diagnoses your resume score gaps, launch Resume Studio with preloaded suggestions to upgrade your bullets and achieve a 90%+ score.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D4A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#FF7A5B]"
            >
              Fix Resume Score Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </SectionBlock>

        <CtaPanel
          title="Test your resume ATS score before applying"
          text="Upload your current CV and let AIVI reveal your formatting errors, metric density, and keyword match scores in seconds."
          primaryLabel="Run Resume Score Audit"
          primaryTo="/dashboard"
          secondaryLabel="Learn About Job Fit"
          secondaryTo="/job-fit-analysis-tool"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default ResumeScoringSoftwareConceptB;
