import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, Bot, Cpu, Sparkles } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const AIVsChatGPTVsGeminiConceptB = () => {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>AIVI vs ChatGPT vs Gemini - Specialized AI Career Operating System</title>
        <meta
          name="description"
          content="Why generic AI chatbots (ChatGPT & Gemini) fail at resume creation, ATS parsing, and mock interviews — and why AIVI's specialized career engine wins."
        />
        <link rel="canonical" href="https://aivilabs.com/ai-vs-chatgpt-vs-gemini" />
      </Helmet>

      <PublicPageShell
        eyebrow="Specialized AI vs Generic LLMs"
        title={<>Why generic chatbots fail at resumes — <span className="text-[#FF6D4A]">Why AIVI v2 wins</span></>}
        description="ChatGPT and Gemini are great for general writing, but they lack ATS parser rules, create unformatted text blobs, hallucinate experience, and cannot conduct real-time voice interviews."
        stats={[
          { value: "ATS Safe", label: "Taleo & Workday parsing rules built into the engine" },
          { value: "Vernacular", label: "Real-time Hindi & English voice practice co-pilot" },
          { value: "0 Hallucinations", label: "Deterministic JD scoring & metric verification" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Try AIVI Career OS Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai-resume-builder"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Explore Resume Studio <Sparkles className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock
          title="The Limits of Generic AI for Career Applications"
          description="When you ask ChatGPT or Gemini to 'write a resume', you get fluff phrasing and unstructured text that fails enterprise recruitment screeners."
        >
          <FeatureGrid>
            <FeatureCard
              icon={Bot}
              title="Generic Chatbots Lack ATS Parser Rules"
              description="ChatGPT has no knowledge of Taleo or Workday single-column parsing constraints, leading to rejected multi-column formatting."
              accent="coral"
            />
            <FeatureCard
              icon={Cpu}
              title="No Deterministic Job Fit Scoring"
              description="Generic LLMs give vague compliments ('Looks great!') instead of calculating exact 0-100% keyword density scores."
            />
            <FeatureCard
              icon={Zap}
              title="No Real-Time Vernacular Voice Engine"
              description="ChatGPT cannot conduct interactive, low-latency audio interviews with live STAR framework scoring in Hindi, Hinglish, and English."
              accent="teal"
            />
          </FeatureGrid>
        </SectionBlock>

        <SectionBlock
          title="Comparison Summary: AIVI vs Generic AI"
          description="See why serious job seekers in Bharat choose AIVI for their applications."
        >
          <BulletPanel
            items={[
              {
                title: "1. Purpose-Built Career Operating System",
                text: "AIVI is engineered specifically for resume rebuilding, ATS diagnostics, skill gap roadmaps, and voice interview prep.",
              },
              {
                title: "2. DPDP 2023 Compliant & Indian Data Hosting",
                text: "Your resume and personal identity data are hosted in secure Google Cloud Mumbai servers under strict DPDP guidelines.",
              },
              {
                title: "3. Direct Bridge from Analysis to Rebuild",
                text: "AIVI seamlessly connects your Job Fit analysis gaps to 1-click Resume Studio rebuilds without manual prompt engineering.",
              },
            ]}
          />
        </SectionBlock>

        <CtaPanel
          title="Experience purpose-built AI career co-piloting"
          text="Switch from generic chatbot prompts to a structured, outcome-driven career platform today."
          primaryLabel="Start Free with AIVI"
          primaryTo="/dashboard"
          secondaryLabel="Explore All 6 AI Modules"
          secondaryTo="/"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default AIVsChatGPTVsGeminiConceptB;
