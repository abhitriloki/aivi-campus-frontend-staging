import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Sparkles, Check, ShieldCheck, MessageSquare } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

export default function InterviewIntelligenceConceptB() {
  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>Vernacular Voice AI Mock Interview | AIVI Career OS</title>
        <meta
          name="description"
          content="Practice mock interviews in Hindi, Hinglish, and English with AI voice feedback, STAR framework scoring, and real-time confidence tracking."
        />
        <link rel="canonical" href="https://aivilabs.com/interview-intelligence" />
      </Helmet>

      <PublicPageShell
        eyebrow="Interview Intelligence"
        title={<>Vernacular Voice AI <span className="text-[#FF6D4A]">Mock Interviews</span></>}
        description="Practice behavioral & technical turns in Hindi, Hinglish, or English. Get instant feedback on STAR framework structure, technical accuracy, and speaking confidence."
        stats={[
          { value: "Hindi & English", label: "Vernacular voice practice in your comfort language" },
          { value: "STAR Method", label: "Structured answer scoring & instant feedback" },
          { value: "Live Audio", label: "Processed live in memory — audio never stored" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard/interview"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Start AI Mock Interview <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              Try Free Practice Turn <Mic className="h-4 w-4" />
            </Link>
          </>
        }
      >
        <SectionBlock title="1. Vernacular Voice AI Engine (Hindi & Hinglish)">
          <p className="text-base leading-8 text-[#61707B]">
            Many ambitious candidates know the correct answer but struggle to articulate it in fluent English under high interview pressure. AIVI's voice co-pilot allows you to practice in Hindi or Hinglish first, then translates your thoughts into structured, high-scoring English answers for real recruiters.
          </p>
        </SectionBlock>

        <SectionBlock title="2. STAR Framework & Technical Scoring">
          <p className="text-base leading-8 text-[#61707B]">
            Every mock answer is evaluated against Situation, Task, Action, and Result (STAR) criteria. AIVI checks whether you provided specific metrics, highlighted your exact role in team projects, and answered the core technical question directly.
          </p>
        </SectionBlock>

        <SectionBlock title="3. Privacy & Memory Security">
          <p className="text-base leading-8 text-[#61707B]">
            Your voice audio is processed live in temporary memory during your interview session and is never stored on servers. Only anonymized text transcripts are saved in your private account history for your review.
          </p>
        </SectionBlock>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Ready to master your next interview?</h3>
          <p className="text-xs text-slate-300">Launch an interactive mock interview tailored to your target job role in seconds.</p>
          <Link
            to="/dashboard/interview"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6D4A] px-5 py-3 text-xs font-semibold text-white hover:bg-[#FF7A5B]"
          >
            Start Mock Interview Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
}
