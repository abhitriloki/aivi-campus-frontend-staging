import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, Crosshair, Search, Target, Zap, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const JobFitAnalysisToolConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Job Fit Analysis Tool & ATS Match Calculator | AIVI Career OS</title>
        <meta
          name="description"
          content="Compare your resume against any target job description in seconds. Get 0-100% instant match scores, missing keyword checklists, and 1-click tailored resume rebuilds."
        />
        <link rel="canonical" href="https://aivilabs.com/job-fit-analysis-tool" />
      </Helmet>

      <PublicPageShell
        eyebrow="Job Fit Intelligence v2"
        title={<>See where your resume matches, <span className="text-[#FF6D4A]">where it fails</span>, &amp; what to change next</>}
        description="AIVI Job Fit Analysis goes far beyond a static score. It breaks down missing technical keywords, role framing gaps, and bridges directly into 1-click resume rebuilds."
        stats={[
          { value: "0-100%", label: "Instant ATS & Recruiter Match Score" },
          { value: "Keywords", label: "Exact missing technical & soft skill checklist" },
          { value: "1-Click", label: "Preloaded context bridge into Resume Studio" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/job-fit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Analyze My Job Fit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-resume-builder"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Open Resume Studio <Sparkles className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="Why Blind Job Applications Get Rejected"
          description="Sending the same generic CV to 50 companies results in low callback rates. ATS screeners filter out applications that miss role-specific keywords."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Target}
              title="Automated JD Parsing"
              description="Extract required technical stack proficiencies, tools, domain experience, and soft skill signals from any job posting instantly."
            />
            <FeatureCard
              icon={Search}
              title="Missing Keyword Radar"
              description="Identify exact missing keywords (e.g. System Architecture, SQL, Stakeholder Alignment) holding back your match score."
              accent="coral"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Actionable Improvement Steps"
              description="Receive clear instructions on where to add missing keywords: in your executive summary, project bullets, or skills section."
              accent="teal"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="3 Key Insights Delivered by Job Fit v2"
          description="Transform raw job descriptions into clear strategic directions before submitting your application."
        >
          <BulletPanel
            items={[
              {
                title: "1. Match Percentage & Recruiter Viability",
                text: "Know instantly if your CV passes the 75%+ match threshold required for enterprise recruiter callbacks.",
              },
              {
                title: "2. Role-Specific Technical Gap Breakdown",
                text: "Distinguish between critical hard skill requirements (e.g. React/Node.js) and secondary nice-to-have qualifications.",
              },
              {
                title: "3. Direct 1-Click Rebuild Bridge",
                text: "Don't manually copy-paste keywords. Click 'Rebuild for this JD' to load missing terms directly into Resume Studio.",
              },
            ]}
            dark
          />
        </SectionBlock>

        <SectionBlock
          title="How Job Fit Bridges Directly into Resume Studio"
          description="Analysis is useless without action. AIVI seamlessly connects diagnosis to automated output."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Crosshair}
              title="Role-Aware Diagnosis"
              description="Understand what hiring managers are rewarding in your target industry before spending hours tweaking your resume."
            />
            <FeatureCard
              icon={Zap}
              title="1-Click Tailored Output"
              description="The missing keywords found in Job Fit are automatically suggested during your Resume Studio editing session."
              accent="coral"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Higher Interview Conversion"
              description="Submitting JD-tailored resumes increases your interview callback rates by up to 3.5x compared to generic resumes."
            />
          </FeatureGrid>
        </SectionBlock>

        <CtaPanel
          title="Stop blind applying — test your job fit score now"
          text="Paste your resume alongside your target job description and let AIVI reveal your exact match score and missing keywords."
          primaryLabel="Analyze Job Fit Now"
          primaryTo="/dashboard/job-fit"
          secondaryLabel="Explore Resume Studio"
          secondaryTo="/ai-resume-builder"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default JobFitAnalysisToolConceptB;
