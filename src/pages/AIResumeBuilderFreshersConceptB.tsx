import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle2, FileText, LayoutTemplate, Target, Zap, ArrowRight, GraduationCap } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const AIResumeBuilderFreshersConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Best AI Resume Builder for Freshers & Students - AIVI Career OS</title>
        <meta
          name="description"
          content="Create a high-scoring ATS resume with zero prior work experience. Convert college projects, hackathons, certifications, and leadership into recruiter-ready bullets."
        />
        <link rel="canonical" href="https://aivilabs.com/ai-resume-builder-for-freshers" />
      </Helmet>

      <PublicPageShell
        eyebrow="Fresher Resume Studio v2"
        title={<>Build a high-scoring resume even with <span className="text-[#FF6D4A]">zero corporate experience</span></>}
        description="AIVI guides students and freshers to convert academic projects, hackathons, certifications, and campus leadership into a recruiter-ready resume without forcing empty work experience sections."
        stats={[
          { value: "Zero Exp", label: "No prior formal job required to build a strong draft" },
          { value: "100% ATS", label: "Taleo, Workday & Greenhouse safe single-column templates" },
          { value: "Guided", label: "Step-by-step wizard for project & skill positioning" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Build My First Resume <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-resume-builder"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              See All 4 Studio Paths <GraduationCap className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="Why Standard Resume Templates Fail Freshers"
          description="Generic templates leave entry-level candidates with blank work history sections and weak self-positioning."
        >
          <BulletPanel
            items={[
              {
                title: "Academic & Side Project Experience Buried",
                text: "College capstones, GitHub repositories, and hackathons are your strongest proof points, but traditional templates relegate them to the bottom.",
              },
              {
                title: "Passive Phrasing Weakens Profile Credibility",
                text: "Raw student notes like 'helped with project' sound weak to recruiters. AIVI transforms them into 'Engineered full-stack CRUD application using React and Firebase.'",
              },
              {
                title: "Template Confusion & ATS Formatting Failures",
                text: "Multi-column design templates fail ATS parsers. AIVI enforces single-column structures that guarantee 100% text extraction.",
              },
            ]}
          />
        </SectionBlock>

        <SectionBlock
          title="How AIVI Empowers College Students & Entry-Level Job Seekers"
          description="Build confidence from day one with step-by-step guided prompts designed specifically for early-career candidates."
        >
          <FeatureGrid>
            <FeatureCard
              icon={FileText}
              title="Project-First Layouts"
              description="Position capstones, internships, and open-source contributions front and center where recruiters look first."
              accent="teal"
            />
            <FeatureCard
              icon={Target}
              title="Skill Language Translation"
              description="Translate college coursework, lab assignments, and self-taught certifications into industry-standard technical terminology."
              accent="coral"
            />
            <FeatureCard
              icon={CheckCircle2}
              title="ATS-Safe Section Ordering"
              description="Enforce standardized headings (Summary, Technical Skills, Projects, Education, Certifications) to pass automated screeners."
            />
            <FeatureCard
              icon={Zap}
              title="Metric Bullet Suggestions"
              description="Automatically add realistic project metrics (e.g. improved execution speed by 25%, tested across 100+ data inputs)."
            />
            <FeatureCard
              icon={LayoutTemplate}
              title="Campus Drive Optimization"
              description="Tailor your resume specifically for campus placement drives (TCS, Infosys, Accenture, Wipro, Product Startups)."
            />
            <FeatureCard
              icon={Briefcase}
              title="Internship & Entry Role Modes"
              description="Adapt your core profile with 1-click for different role tracks (Software Developer, Data Analyst, Product Analyst, Sales)."
              accent="coral"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="Who This Is Built For"
          description="Empowering the next generation of talent across engineering, management, and technical institutes in Bharat."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Final-Year Engineering & Degree Students",
                text: "Create an ATS-approved resume for campus placement drives and company-specific recruitment packages.",
              },
              {
                title: "Recent Graduates & Job Seekers",
                text: "Build a polished application without fabricating work experience, focusing on hands-on project proof.",
              },
              {
                title: "Self-Taught Developers & Bootcamp Alumni",
                text: "Package self-driven projects, certifications, and portfolio links into a professional story that recruiters trust.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#E7ECEF] bg-white p-6 shadow-xs space-y-3">
                <div className="h-8 w-8 rounded-xl bg-[#FFF0EB] text-[#FF6D4A] flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#112031]">{item.title}</h3>
                <p className="text-sm leading-6 text-[#61707B]">{item.text}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <CtaPanel
          title="Build your first professional resume today"
          text="Let AIVI guide you through creating an ATS-friendly resume from your college projects and skills in less than 10 minutes."
          primaryLabel="Build My First Resume"
          primaryTo="/dashboard"
          secondaryLabel="Explore Resume Studio"
          secondaryTo="/ai-resume-builder"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default AIResumeBuilderFreshersConceptB;
