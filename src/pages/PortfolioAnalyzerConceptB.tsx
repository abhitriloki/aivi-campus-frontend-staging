import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Share2, Sparkles, Check, Code } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

export default function PortfolioAnalyzerConceptB() {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Portfolio & Project Showcase Analyzer | AIVI Career OS</title>
        <meta
          name="description"
          content="Audit your GitHub projects and portfolio showcases to pass technical recruiter screeners and demonstrate production-grade experience."
        />
        <link rel="canonical" href="https://aivilabs.com/portfolio-analyzer-ai" />
      </Helmet>

      <PublicPageShell
        eyebrow="Portfolio Analyzer"
        title={<>Recruiter-Ready <span className="text-[#FF6D4A]">Portfolio Showcase</span></>}
        description="Audit your GitHub repositories, project code quality, and live portfolio showcases to pass technical recruiter screeners."
        stats={[
          { value: "GitHub & Web", label: "Analyze project code, READMEs & live demos" },
          { value: "Production Check", label: "Identify missing architectural & deployment details" },
          { value: "1-Click Bullet", label: "Generate recruiter-friendly project impact summaries" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Analyze My Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Try Sample Audit <Share2 className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock title="1. Recruiter Readability & README Audit">
          <p className="text-base leading-8 text-[#61707B]">
            Recruiters spend less than 15 seconds scanning project repositories. AIVI checks whether your project READMEs contain live deployment links, architecture diagrams, tech stack badges, and clear problem-solution statements.
          </p>
        </SectionBlock>

        <SectionBlock title="2. Production-Grade Engineering Signals">
          <p className="text-base leading-8 text-[#61707B]">
            Differentiate your portfolio from generic tutorial clones. AIVI flags missing production signals such as unit test coverage, CI/CD pipeline configs, database indexing, and containerization setup.
          </p>
        </SectionBlock>

        <SectionBlock title="3. 1-Click Project Bullet Summaries">
          <p className="text-base leading-8 text-[#61707B]">
            Automatically extract technical highlights from your code and convert them into 3 high-impact resume bullet points pre-tailored to paste into your CV.
          </p>
        </SectionBlock>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to optimize your project portfolio?</h3>
          <p className="text-xs text-slate-300">Run an instant AI audit on your GitHub profile and project links.</p>
          <Link
            to="/dashboard/portfolio"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D4A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#FF7A5B]"
          >
            Start Portfolio Audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
}
