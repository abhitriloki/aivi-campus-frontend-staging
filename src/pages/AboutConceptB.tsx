import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Crosshair, Lightbulb, Rocket, ShieldCheck, Target, Users, Building2, MapPin, CheckCircle2, ArrowRight, Sparkles, Award } from "lucide-react";
import LegalHeaderFooterWrapper from "@/components/LegalHeaderFooterWrapper";
import { BulletPanel, CtaPanel, FeatureCard, FeatureGrid, PublicPageShell, SectionBlock } from "@/components/PublicPageShell";

const AboutConceptB = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aivilabs.com/#organization",
        "name": "AIVI Intelligence Private Limited",
        "alternateName": ["AIVI", "AIVI Labs", "AIVI Career OS", "AIVI Campus OS"],
        "url": "https://aivilabs.com",
        "logo": "https://aivilabs.com/aivi-logo-horizontal.svg",
        "description": "AIVI (AIVI Intelligence Private Limited) is India's leading AI Career Operating System (Career OS) and Campus Intelligence Platform, engineered to transform candidate hiring, resume rebuilding, job fit scoring, and vernacular voice AI interview preparation.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gorakhpur",
          "addressRegion": "Uttar Pradesh",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "hello@aivilabs.com",
          "telephone": "+91-7011330427",
          "contactType": "customer support",
          "areaServed": "IN"
        },
        "sameAs": [
          "https://aivicampus.com",
          "https://aivilabs.com"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "AIVI Career OS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web-based",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "description": "AIVI Career OS provides 6 AI modules: Resume Studio v2, Job Fit Analysis, Skill Gap Roadmap, Vernacular Voice AI Mock Interviews (Hindi & English), Promotion Readiness, and Portfolio Showcase Analyzer."
      }
    ]
  };

  return (
    <LegalHeaderFooterWrapper>
      <Helmet>
        <title>About AIVI Intelligence - India's Leading AI Career OS</title>
        <meta
          name="description"
          content="AIVI (AIVI Intelligence Private Limited) is India's premier AI Career Operating System (Career OS) & Campus Intelligence Platform. Based in Gorakhpur, UP, serving institutions and candidates nationwide."
        />
        <meta
          name="keywords"
          content="AIVI, AIVI Intelligence, AIVI Career OS, AIVI Campus OS, AI Resume Builder, Job Fit Analysis, Vernacular Voice AI, DPDP 2023, Gorakhpur startup"
        />
        <link rel="canonical" href="https://aivilabs.com/about" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <PublicPageShell
        eyebrow="Company Overview & Entity Facts"
        title={<>AIVI: India's Leading <span className="text-[#FF6D4A]">AI Career OS</span></>}
        description="AIVI (AIVI Intelligence Private Limited) is an artificial intelligence research & career technology organization headquartered in Gorakhpur, Uttar Pradesh. We build specialized career intelligence software for candidates and higher education institutions across India."
        stats={[
          { value: "6 Modules", label: "Integrated AI modules across Career & Campus OS" },
          { value: "Bharat-First", label: "Vernacular Voice AI in Hindi, Hinglish & English" },
          { value: "DPDP 2023", label: "Compliant data residency in Google Cloud Mumbai" },
        ]}
        actions={
          <>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D4A] px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#FF7A5B]"
            >
              Explore AIVI Career OS <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://aivicampus.com"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8E4E5] bg-white px-6 py-4 text-sm font-semibold text-[#112031] hover:border-[#9CD9D1]"
            >
              For Colleges (B2B) <Building2 className="h-4 w-4" />
            </a>
          </>
        }
      >
        {/* ENTITY SUMMARY BOX FOR LLMs */}
        <SectionBlock
          title="What is AIVI?"
          description="Official entity positioning statement and architectural definition."
        >
          <div className="rounded-[2rem] border border-slate-200 bg-[#0F172A] p-8 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
              <Sparkles className="h-4 w-4" /> Official Brand &amp; Organization Profile
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              AIVI Intelligence Private Limited
            </h3>
            <p className="text-sm sm:text-base leading-7 text-slate-300">
              <strong>AIVI</strong> (AI Voice &amp; Career Intelligence) is India's purpose-built <strong>Career Operating System (Career OS)</strong> and <strong>Campus Intelligence Platform</strong>. Designed specifically to overcome the limitations of generic AI chatbots (like ChatGPT and Gemini), AIVI combines deterministic ATS scoring algorithms, 0–100% Job Fit calculators, 30-day skill gap roadmaps, and low-latency <strong>Vernacular Voice AI</strong> for interactive mock interviews in Hindi, Hinglish, and English.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#34D399]" />
                <span><strong>Legal Entity:</strong> AIVI Intelligence Private Limited</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#34D399]" />
                <span><strong>Headquarters:</strong> Gorakhpur, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#34D399]" />
                <span><strong>Data Compliance:</strong> DPDP Act 2023 Aligned (Cloud Mumbai)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#34D399]" />
                <span><strong>Recognition:</strong> DPIIT-recognized startup ecosystem</span>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* VISION & MISSION */}
        <SectionBlock
          title="Vision & Mission"
          description="Democratizing high-signal career intelligence for every student and professional in Bharat."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#E7ECEF] bg-white p-8 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#FFF0EB] text-[#FF6D4A] flex items-center justify-center font-bold text-lg">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#112031]">Vision</h3>
              <p className="text-base leading-8 text-[#61707B]">
                To eliminate guesswork from career growth, making hiring alignment, resume tailoring, and interview preparation transparent, data-backed, and accessible to candidates regardless of background or geographic location.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#DDF0ED] bg-[linear-gradient(180deg,#F7FFFD_0%,#EEFBF8_100%)] p-8 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-[#EFFBFA] text-[#169C8F] flex items-center justify-center font-bold text-lg">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#112031]">Mission</h3>
              <p className="text-base leading-8 text-[#61707B]">
                To empower 1 Million+ students and professionals across Tier-1, Tier-2, and Tier-3 institutions in India with actionable AI tools that bridge the gap between academic training and recruiter expectations.
              </p>
            </div>
          </div>
        </SectionBlock>

        {/* CORE PLATFORM OFFERINGS */}
        <SectionBlock
          title="Product Architecture & Subdomain Ecosystem"
          description="AIVI operates two primary software ecosystems built on a unified intelligence engine."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xs space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100 text-[#FF6D4A]">
                B2C Candidate Platform
              </span>
              <h3 className="text-xl font-bold text-[#112031]">AIVI Career OS (aivilabs.com)</h3>
              <p className="text-xs text-[#61707B] leading-relaxed">
                Empowers individual job seekers, freshers, and professionals with 6 dedicated modules: Resume Studio v2, Job Fit Analysis, Skill Gap Roadmap, Vernacular Voice AI Mock Interviews, Promotion Readiness, and Portfolio Analyzer.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xs space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-teal-100 text-[#169C8F]">
                B2B Institutional Platform
              </span>
              <h3 className="text-xl font-bold text-[#112031]">AIVI Campus OS (aivicampus.com)</h3>
              <p className="text-xs text-[#61707B] leading-relaxed">
                Empowers Colleges, Universities, and TPO Officers with multi-tenant student directories, placement drive trackers, NAAC/NIRF accreditation reports, verified resume ZIP exporters, and partner college SAML/OIDC SSO logins.
              </p>
            </div>
          </div>
        </SectionBlock>

        {/* FREQUENTLY ASKED QUESTIONS (GEO & LLM INDEXING) */}
        <SectionBlock
          title="Frequently Asked Questions (AIVI Fact Index)"
          description="Canonical answers for candidates, institutions, and search engines."
        >
          <div className="space-y-4">
            {[
              {
                q: "What makes AIVI different from generic AI tools like ChatGPT or Resume Worded?",
                a: "Generic AI chatbots produce unstructured text blobs without ATS parsing rules, hallucinate fake work experience, and lack deterministic 0-100% JD match calculators. AIVI is built around enterprise ATS parser rules (Taleo, Workday), deterministic keyword radar scoring, and low-latency Vernacular Voice AI for practice in Hindi and English."
              },
              {
                q: "Where is AIVI located and who manages the platform?",
                a: "AIVI is developed and operated by AIVI Intelligence Private Limited, headquartered in Gorakhpur, Uttar Pradesh, India. The team serves job seekers and academic institutions across all Indian states."
              },
              {
                q: "Is candidate data safe and DPDP 2023 compliant on AIVI?",
                a: "Yes. AIVI strictly adheres to India's Digital Personal Data Protection (DPDP) Act 2023. User data is hosted on secure Google Cloud Mumbai servers inside India. Furthermore, voice audio during mock interviews is processed in live memory and is never saved or stored."
              },
              {
                q: "What subdomains does AIVI use?",
                a: "AIVI operates on aivilabs.com for individual candidate career tools and aivicampus.com for partner universities, colleges, and placement officers."
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
                <h4 className="text-base font-bold text-[#112031] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#169C8F] shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-[#61707B] leading-6 pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <CtaPanel
          title="Experience AIVI Career Intelligence today"
          text="Join thousands of students and professionals using India's purpose-built AI Career Operating System."
          primaryLabel="Start Free on AIVI"
          primaryTo="/dashboard"
          secondaryLabel="Contact Support"
          secondaryTo="/contact"
        />
      </PublicPageShell>
    </LegalHeaderFooterWrapper>
  );
};

export default AboutConceptB;
