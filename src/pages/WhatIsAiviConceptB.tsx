import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, Sparkles, Rocket, Globe } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const WhatIsAiviConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>What is AIVI? - The AI Career Operating System for Bharat</title>
        <meta
          name="description"
          content="Learn how AIVI Career OS combines 6 AI modules — Resume Studio, Job Fit Analysis, Skill Roadmap, Vernacular Voice AI Mock Interviews, Promotion Readiness, and Portfolio Analyzer."
        />
        <link rel="canonical" href="https://aivilabs.com/what-is-aivi" />
      </Helmet>

      <PublicPageShell
        eyebrow="Platform Overview"
        title={<>AIVI: The Complete <span className="text-[#FF6D4A]">AI Career OS</span> for Bharat</>}
        description="AIVI (AI Voice & Career Intelligence) is India's first end-to-end career co-pilot designed to transform job search, resume tailoring, and interview prep into structured, high-converting outcomes."
        stats={[
          { value: "6 Modules", label: "Resume, Job Fit, Roadmap, Voice AI, Promotion & Portfolio" },
          { value: "Bharat First", label: "Vernacular voice support in Hindi, Hinglish & English" },
          { value: "DPDP 2023", label: "Data hosted securely in India — Audio never stored" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Explore Home Page <Sparkles className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="The 6 Core Modules of AIVI v2"
          description="Everything candidates need to move from blind applications to focused career growth."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Rocket}
              title="1. Resume Studio v2"
              description="4 specialized creation paths: First Resume Wizard, Quick Edits, Targeted JD Tailoring, and Full AI Rebuilds."
              accent="coral"
            />
            <FeatureCard
              icon={Zap}
              title="2. Job Fit Intelligence"
              description="0-100% instant ATS match scoring, missing keyword radar, and 1-click bridge into tailored resume rebuilds."
            />
            <FeatureCard
              icon={Globe}
              title="3. Skill Roadmap AI"
              description="30-day role-specific skill acquisition roadmaps to bridge technical gaps between your profile and target jobs."
              accent="teal"
            />
            <FeatureCard
              icon={Sparkles}
              title="4. Vernacular Voice AI Interviews"
              description="Practice behavioral & technical turns in Hindi, Hinglish, or English with STAR framework scoring."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="5. Promotion & Growth Readiness"
              description="Frame daily tasks into business revenue metrics to prepare for appraisals and internal role switches."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="6. Portfolio & Project Showcase"
              description="Audit GitHub repositories, project code quality, and generate recruiter-friendly bullet summaries."
              accent="coral"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="Security & Compliance Standards"
          description="Built from the ground up to respect user privacy and regulatory requirements."
        >
          <BulletPanel
            items={[
              {
                title: "DPDP Act 2023 Aligned",
                text: "Full compliance with India's Digital Personal Data Protection Act, providing explicit user consent controls.",
              },
              {
                title: "Google Cloud Mumbai Data Residency",
                text: "All candidate profiles and application data are securely stored on cloud infrastructure located strictly within India.",
              },
              {
                title: "In-Memory Audio Processing",
                text: "Voice AI interview audio is processed in live temporary memory and is NEVER stored or saved on servers.",
              },
            ]}
          />
        </SectionBlock>

        <CtaPanel
          title="Join thousands of students & professionals on AIVI"
          text="Create your free account today and experience the power of a dedicated AI Career Operating System."
          primaryLabel="Start Free Now"
          primaryTo="/dashboard"
          secondaryLabel="Learn About Pricing"
          secondaryTo="/#pricing"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default WhatIsAiviConceptB;
