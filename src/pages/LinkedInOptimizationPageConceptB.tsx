import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, Share2, Sparkles, Zap, ArrowRight, UserCheck, Search } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const LinkedInOptimizationPageConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>LinkedIn Profile & Portfolio Optimizer v2 - AIVI Career OS</title>
        <meta
          name="description"
          content="Optimize your LinkedIn profile for high recruiter search visibility. Generate searchable headlines, compelling About sections, and recruiter-ready project showcases."
        />
        <link rel="canonical" href="https://aivilabs.com/linkedin-optimization" />
      </Helmet>

      <PublicPageShell
        eyebrow="LinkedIn & Portfolio Intelligence v2"
        title={<>Turn your LinkedIn profile into a <span className="text-[#FF6D4A]">recruiter magnet</span></>}
        description="Recruiters search LinkedIn using strict keyword algorithms. AIVI optimizes your Headline, About summary, and project showcases so you show up in recruiter search results."
        stats={[
          { value: "3.2x", label: "Increase in inbound recruiter profile views" },
          { value: "Keywords", label: "Recruiter search term density optimization" },
          { value: "1-Click", label: "Sync resume achievements to LinkedIn sections" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/linkedin"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Optimize My LinkedIn <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/portfolio-analyzer-ai"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Analyze Portfolio Showcase <Share2 className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="Why Standard LinkedIn Profiles Get Ignored"
          description="Most candidates copy-paste generic job titles without strategic keywords. Recruiters filter profiles by specific tech stacks, tools, and domain keywords."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Search}
              title="Recruiter Searchability Audit"
              description="Identify search terms missing from your Headline, About summary, and experience fields that prevent recruiters from finding your profile."
              accent="coral"
            />
            <FeatureCard
              icon={UserCheck}
              title="Headline & About Section Rewriter"
              description="Generate high-converting headlines that communicate your exact role focus, core skills, and key metrics in one glance."
            />
            <FeatureCard
              icon={Zap}
              title="Project & Portfolio Formatting"
              description="Format your GitHub repositories, capstone projects, and live links into clean featured showcase blocks."
              accent="teal"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="3 High-Impact Optimizations for LinkedIn v2"
          description="Transform your profile from a static resume duplicate into an engaging career landing page."
        >
          <BulletPanel
            items={[
              {
                title: "1. Search-Optimized Headline Framing",
                text: "Replace 'Student at XYZ University' with 'Full Stack Developer | React, Node.js, AWS | Building Scalable Web Apps & APIs'.",
              },
              {
                title: "2. Storytelling About Section",
                text: "Craft an engaging 3-paragraph summary covering your technical background, major achievements, and current career goals.",
              },
              {
                title: "3. Direct Resume-to-LinkedIn Alignment",
                text: "Synchronize your quantified resume experience bullet points directly into your LinkedIn position descriptions.",
              },
            ]}
          />
        </SectionBlock>

        <CtaPanel
          title="Boost your recruiter inbound messages today"
          text="Let AIVI audit your LinkedIn profile and generate recruiter-friendly headline and summary recommendations in under 5 minutes."
          primaryLabel="Optimize My LinkedIn"
          primaryTo="/dashboard/linkedin"
          secondaryLabel="Analyze Portfolio"
          secondaryTo="/portfolio-analyzer-ai"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default LinkedInOptimizationPageConceptB;
