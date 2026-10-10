import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, Compass, MapPin, Target, Zap, ArrowRight, BookOpen } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const CareerGapAnalysisAIConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Career Skill Gap Analysis & 30-Day Roadmap - AIVI Career OS</title>
        <meta
          name="description"
          content="Identify missing technical skills and experience gaps holding back your career switch or promotion. Get a 30-day role-specific skill acquisition roadmap."
        />
        <link rel="canonical" href="https://aivilabs.com/career-gap-analysis-ai" />
      </Helmet>

      <PublicPageShell
        eyebrow="Skill Roadmap & Gap Intelligence v2"
        title={<>Close the gap between your current profile &amp; your <span className="text-[#FF6D4A]">dream role</span></>}
        description="AIVI evaluates your current skill profile against industry standards for your target role, generating a step-by-step 30-day skill acquisition and project roadmap."
        stats={[
          { value: "30 Days", label: "Actionable step-by-step learning roadmap" },
          { value: "Skill Radar", label: "Identify technical & domain knowledge gaps" },
          { value: "Targeted", label: "Tailored for software, data, product & AI roles" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/roadmap"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Generate Skill Roadmap <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/job-fit-analysis-tool"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Check Job Fit First <Target className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="Why Random Learning Wastes Months of Preparation"
          description="Most job seekers attempt to learn everything at once without knowing which exact skills hiring managers prioritize for specific job roles."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Target}
              title="Role-Specific Benchmark Audit"
              description="Benchmark your current resume skills against live industry expectations for roles like SDE-1, Data Analyst, Product Analyst, or DevOps."
            />
            <FeatureCard
              icon={Compass}
              title="Priority Skill Matrix"
              description="Distinguish between high-priority blocker skills (must-haves for shortlisting) and secondary nice-to-know topics."
              accent="coral"
            />
            <FeatureCard
              icon={BookOpen}
              title="Targeted Project Recommendations"
              description="Get recommendations for practical capstone projects that demonstrate your new skills directly on your resume."
              accent="teal"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="How the 30-Day Skill Roadmap Works"
          description="A structured, week-by-week execution plan to upgrade your market readiness."
        >
          <BulletPanel
            items={[
              {
                title: "Week 1: Core Technical Prerequisites",
                text: "Focus on closing critical hard skill gaps (e.g. SQL indexing, REST API architecture, Git workflows).",
              },
              {
                title: "Week 2-3: Hands-On Capstone Building",
                text: "Build a deployment-ready project that incorporates all missing technical keywords required by recruiters.",
              },
              {
                title: "Week 4: Portfolio Integration & Resume Update",
                text: "Add new project bullets directly into Resume Studio and recalculate your 85%+ Job Fit score.",
              },
            ]}
          />
        </SectionBlock>

        <CtaPanel
          title="Discover your exact skill roadmap today"
          text="Let AIVI analyze your current CV against your target job title and build your custom 30-day skill acquisition roadmap."
          primaryLabel="Generate Skill Roadmap"
          primaryTo="/dashboard/roadmap"
          secondaryLabel="Check Job Fit"
          secondaryTo="/job-fit-analysis-tool"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default CareerGapAnalysisAIConceptB;
