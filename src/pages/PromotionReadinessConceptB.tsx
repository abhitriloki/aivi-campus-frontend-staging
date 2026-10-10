import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Sparkles, Check, TrendingUp } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

export default function PromotionReadinessConceptB() {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Promotion Readiness & Growth Intelligence | AIVI Career OS</title>
        <meta
          name="description"
          content="Assess your internal promotion readiness, appraise achievement framing, and build data-backed progression cases for your manager."
        />
        <link rel="canonical" href="https://aivilabs.com/promotion-readiness-ai" />
      </Helmet>

      <PublicPageShell
        eyebrow="Promotion Readiness"
        title={<>Data-Backed <span className="text-[#FF6D4A]">Promotion Intelligence</span></>}
        description="Prepare for performance reviews, internal role moves, and salary appraisal negotiations with data-backed achievement framing."
        stats={[
          { value: "Internal Growth", label: "Structured appraisal & seniority evaluation" },
          { value: "Impact Framing", label: "Transform daily tasks into business revenue & impact" },
          { value: "Appraisal Proof", label: "Manager-ready summary sheets & justification logs" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/promotion"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Run Promotion Audit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Explore Growth Plans <Trophy className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock title="1. Achievement & Revenue Impact Framing">
          <p className="text-base leading-8 text-[#61707B]">
            Engineers and product managers often get passed over for promotion because their self-evaluations list operational duties rather than business impact. AIVI converts routine work logs into quantified impact statements (e.g. reduced latency by 35%, increased pipeline velocity by ₹12L).
          </p>
        </SectionBlock>

        <SectionBlock title="2. Seniority Gap & Competency Audit">
          <p className="text-base leading-8 text-[#61707B]">
            Compare your current output against the next seniority band requirements (e.g., SDE-1 to SDE-2 or APM to PM). AIVI highlights missing leadership signals, mentorship proofs, and system design responsibilities required for approval.
          </p>
        </SectionBlock>

        <SectionBlock title="3. Manager-Ready Appraisal Briefs">
          <p className="text-base leading-8 text-[#61707B]">
            Generate a crisp 1-page appraisal summary outlining your key contributions, peer collaboration evidence, and proposed growth goals to make your promotion discussion clear and non-negotiable.
          </p>
        </SectionBlock>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to secure your next promotion?</h3>
          <p className="text-xs text-slate-300">Run a comprehensive promotion readiness audit on your current performance.</p>
          <Link
            to="/dashboard/promotion"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D4A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#FF7A5B]"
          >
            Start Promotion Audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
}
