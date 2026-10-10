import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FileText, PenTool, SearchCheck, Sparkles, Wand2, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const AIResumeBuilderPageConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>AI Resume Builder & Rebuilder v2 - AIVI Career OS</title>
        <meta
          name="description"
          content="Build, rewrite, and tailor ATS-friendly resumes in Resume Studio. 4 specialized starting paths: First Resume Wizard, Quick Edits, Targeted JD Tailoring, and Full AI Rebuild."
        />
        <link rel="canonical" href="https://aivilabs.com/ai-resume-builder" />
      </Helmet>

      <PublicPageShell
        eyebrow="Resume Studio v2"
        title={<>Build, rewrite, &amp; tailor your resume with <span className="text-[#FF6D4A]">precision AI</span></>}
        description="AIVI Resume Studio offers 4 specialized workflows: step-by-step first resume creation, targeted bullet metric upgrades, one-click JD tailoring, and full structural rebuilds."
        stats={[
          { value: "4 Paths", label: "First Resume, Quick Edits, JD Tailor, Full Rebuild" },
          { value: "1-Click", label: "JD-based resume keyword injection" },
          { value: "100% ATS", label: "Taleo, Workday & Greenhouse parser safe" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Open Resume Studio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/job-fit-analysis-tool"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Try Job Fit Analysis <Sparkles className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="4 Specialized Resume Studio Paths"
          description="Different career stages require different resume workflows. Choose the exact path tailored to your immediate goal."
        >
          <FeatureGrid>
            <FeatureCard
              icon={FileText}
              title="1. First Resume Creation"
              description="Guided wizard for freshers & students. Converts course projects, hackathons, and campus activities into credible experience bullet points."
              accent="teal"
            />
            <FeatureCard
              icon={PenTool}
              title="2. Quick Edits & Metric Enhancements"
              description="Tighten bullet points, fix passive phrasing, and add quantified metrics (revenue %, latency reduction, user growth) without altering your whole layout."
            />
            <FeatureCard
              icon={SearchCheck}
              title="3. Targeted JD Tailoring"
              description="Paste any job description to automatically inject missing technical skills, domain keywords, and role-specific summaries into your document."
              accent="coral"
            />
            <FeatureCard
              icon={Wand2}
              title="4. Full AI Rebuild"
              description="Transform outdated, multi-column CVs into single-column, 100% ATS-compliant layouts that pass enterprise recruiter screeners."
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="Why AIVI Resume Studio Outperforms Generic AI Tools"
          description="Generic AI chatbots produce generic text that fails ATS scanners and sounds fake to human recruiters. AIVI uses deterministic ATS scoring paired with role-aware AI."
        >
          <BulletPanel
            items={[
              {
                title: "Taleo & Workday ATS Parser Compliance",
                text: "Formats your resume cleanly into standard single-column layouts with standard section titles so ATS screeners parse 100% of your technical skills.",
              },
              {
                title: "Quantified Action-Verb Engine",
                text: "Replaces weak phrasing like 'worked on API' with high-impact bullets like 'Engineered high-throughput REST APIs handling 50k daily active requests.'",
              },
              {
                title: "Seamless Job Fit Integration",
                text: "Directly bridges from Job Fit Analysis. Diagnosed keyword gaps are preloaded into Resume Studio for 1-click tailored rebuilds.",
              },
            ]}
          />
        </SectionBlock>

        <SectionBlock
          title="Designed for Every Career Level in India"
          description="Whether you are applying for campus placements or preparing for senior role switches, Resume Studio adapts to your career stage."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Students & Freshers",
                text: "Highlight capstone projects, coding profiles, and campus leadership when you don't have corporate work experience yet.",
              },
              {
                title: "Working Professionals",
                text: "Frame your daily responsibilities into strategic business metrics, leadership accomplishments, and tech stack proficiencies.",
              },
              {
                title: "Career Switchers",
                text: "Identify transferable skills from your previous background and align your summary directly with your target industry expectations.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-[#E7ECEF] bg-white p-6 shadow-xs space-y-3">
                <div className="h-8 w-8 rounded-xl bg-[#EFFBFA] text-[#169C8F] flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#112031]">{item.title}</h3>
                <p className="text-sm leading-6 text-[#61707B]">{item.text}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <CtaPanel
          title="Build your job-winning resume in minutes"
          text="Launch Resume Studio now to create your first resume, edit an existing draft, or rebuild specifically for a target job description."
          primaryLabel="Open Resume Studio"
          primaryTo="/dashboard"
          secondaryLabel="Build Fresher Resume"
          secondaryTo="/ai-resume-builder-for-freshers"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default AIResumeBuilderPageConceptB;
