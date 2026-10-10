import { Helmet } from "react-helmet-async";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";
import { Activity, Map, SearchCheck, UploadCloud, Zap } from "lucide-react";

const HowItWorksConceptB = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>How It Works - AIVI Career Intelligence</title>
        <meta
          name="description"
          content="Discover how AIVI analyzes your resume, evaluates job fit, and generates custom skill roadmaps. See our 3-step process to optimize your career trajectory and land more interviews."
        />
        <link rel="canonical" href="https://aivilabs.com/how-it-works" />
      </Helmet>

      <GlobalHeader />

      <PublicPageShell
        eyebrow="How It Works"
        title={<>A connected workflow from profile input to career action</>}
        description="AIVI is designed to move users from raw professional data to specific, practical next steps. The product is not one tool. It is a sequence."
        stats={[
          { value: "3", label: "Core steps in the intelligence process" },
          { value: "6", label: "Career analysis engines across the platform" },
          { value: "1", label: "Unified workflow instead of disconnected tools" },
        ]}
      >
        <SectionBlock
          title="The 3-step intelligence process"
          description="The strongest AIVI experience is simple: bring your context, let the system analyze it, then act on the highest-value recommendation."
        >
          <BulletPanel
            items={[
              {
                title: "Upload and extract",
                text: "Users upload a resume, paste content, or provide a job description. AIVI parses experience, skills, formatting signal, and target-role context.",
              },
              {
                title: "Analyze and compare",
                text: "The system evaluates ATS quality, JD alignment, missing keywords, capability gaps, and supporting career signals across the relevant module.",
              },
              {
                title: "Act with a guided next step",
                text: "Instead of stopping at a score, AIVI helps users rebuild, tailor, improve, or plan their next move based on what the analysis surfaced.",
              },
            ]}
            dark
          />
        </SectionBlock>

        <SectionBlock
          title="What the engines do"
          description="Each engine is focused on one kind of decision, but they are meant to work together."
        >
          <FeatureGrid>
            <FeatureCard icon={UploadCloud} title="Resume Studio" description="Create a first resume, improve an existing one, tailor it for a role, or rebuild it from scratch." />
            <FeatureCard icon={SearchCheck} title="Job Fit Analysis" description="Measure match quality against a JD, identify missing keywords, and surface specific improvement opportunities." />
            <FeatureCard icon={Activity} title="Resume Intelligence" description="Score structural quality, ATS readiness, clarity, and recruiter-facing signal across the document." accent="coral" />
            <FeatureCard icon={Map} title="Skill Roadmap" description="Turn skill gaps into a realistic growth path based on the role the user wants next." />
            <FeatureCard icon={Zap} title="Interview Intelligence" description="Generate preparation prompts and answer structures informed by the user’s role target and profile." />
          </FeatureGrid>
        </SectionBlock>

        <CtaPanel
          title="The best AIVI loop starts with a resume and a job description"
          text="That is where the most immediate value appears: diagnose what is weak, measure match quality, then move directly into a stronger resume version."
          primaryLabel="Try Resume Studio"
          primaryTo="/dashboard"
          secondaryLabel="See Job Fit Tool"
          secondaryTo="/job-fit-analysis-tool"
        />
      </PublicPageShell>

      <GlobalFooter />
    </div>
  );
};

export default HowItWorksConceptB;
