export { default } from "./AIVsChatGPTVsGeminiConceptB";
/*
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, Bot, Scale, BrainCircuit, ShieldCheck, Target, Calculator } from "lucide-react";

const AIVsChatGPTVsGemini = () => {
    return (
        <div className="min-h-screen bg-background dark">
            <Helmet>
                <title>AIVI vs ChatGPT vs Gemini for Resumes | AIVI Career Intelligence</title>
                <meta name="description" content="Discover why generic AI like ChatGPT and Gemini fail at resume building compared to AIVI's deterministic Career Intelligence models." />
                <link rel="canonical" href="https://aivilabs.com/ai-vs-chatgpt-vs-gemini" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="AIVI vs ChatGPT vs Gemini for Resumes | AIVI Career Intelligence" />
                <meta property="og:description" content="Discover why generic AI like ChatGPT and Gemini fail at resume building compared to AIVI's deterministic Career Intelligence models." />
                <meta property="og:url" content="https://aivilabs.com/ai-vs-chatgpt-vs-gemini" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://aivilabs.com/og-image.png" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AIVI vs ChatGPT vs Gemini for Resumes | AIVI Career Intelligence" />
                <meta name="twitter:description" content="Discover why generic AI like ChatGPT and Gemini fail at resume building compared to AIVI's deterministic Career Intelligence models." />
                <meta name="twitter:image" content="https://aivilabs.com/og-image.png" />

                <script type="application/ld+json">
                    {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "Can I just use ChatGPT for my resume?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While ChatGPT can rewrite sentences, it hallucinates skills, ruins ATS formatting, and lacks the deterministic matching needed to specifically align keywords with corporate HR systems."
                }
              }, {
                "@type": "Question",
                "name": "Why is AIVI better than Gemini for career tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AIVI layers industry-specific deterministic logic over its foundational language models, ensuring that metrics, acronyms, and structure are preserved exactly as recruiters expect."
                }
              }, {
                "@type": "Question",
                "name": "Does AIVI hallucinate job experience?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. AIVI strictly rewrites existing data for maximum impact. It is logically bound from inventing past jobs or technical skills you do not possess."
                }
              }, {
                "@type": "Question",
                "name": "Does AIVI use ChatGPT or Gemini under the hood?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AIVI utilizes a variety of state-of-the-art foundation models (including customized endpoints from leading AI providers) wrapped heavily in proprietary programmatic scoring engines to guarantee accuracy."
                }
              }]
            }
          `}
                </script>
                <script type="application/ld+json">
                    {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://aivilabs.com/"
              }, {
                "@type": "ListItem",
                "position": 2,
                "name": "AI Tools"
              }, {
                "@type": "ListItem",
                "position": 3,
                "name": "AIVI vs ChatGPT vs Gemini",
                "item": "https://aivilabs.com/ai-vs-chatgpt-vs-gemini"
              }]
            }
          `}
                </script>
            </Helmet>

            <GlobalHeader />

            <main className="page-offset pb-20 max-w-5xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                        <Scale className="h-4 w-4" /> The Truth About General AI
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        <span className="text-gradient hover-glow">AIVI</span> vs ChatGPT vs Gemini
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        Why generic conversational language models are ruining resumes and how specialized Career Intelligence fixes the problem deterministically.
                    </p>
                </motion.div>

                <div className="space-y-16">
                    {/* The Problem */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">The "ChatGPT Resume" Problem</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We've all seen it: a candidate submits a resume packed with robotic phrasing, hallucinated skills, and zero measurable impact.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Recruiters effortlessly spot "ChatGPT resumes" because general AI models are trained to be conversational, not to navigate complex corporate Applicant Tracking Systems (ATS). They prioritize sounding polite over passing parsing gates.
                        </p>
                    </motion.section>

                    {/* How It Works */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">What AIVI Does Differently</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                            General models require you to become a prompt-engineering expert just to get a halfway decent bullet point. AIVI replaces manual prompting with pre-engineered, mathematically-bound pipelines:
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                {
                                    icon: BrainCircuit,
                                    title: "Specialized Determinism",
                                    desc: "AIVI is a focused extraction engine. It isolates your hard truths and optimizes the formatting without inventing fiction."
                                },
                                {
                                    icon: Bot,
                                    title: "No Risk of Hallucinations",
                                    desc: "Unlike standard chatbots, AIVI cannot accidentally invent a senior data science certification that doesn't exist."
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Built-in ATS Logic",
                                    desc: "It inherently knows what formatting breaks HR parsers and prevents you from making structural errors."
                                },
                                {
                                    icon: Calculator,
                                    title: "Quantifiable Guardrails",
                                    desc: "Forces you to document the impact of an action, rather than letting the AI use flowery narrative."
                                },
                                {
                                    icon: Target,
                                    title: "1-Click Job Fit Scoring",
                                    desc: "Directly contrasts your document against LIVE job postings with math, rather than vague conversational feedback."
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "No Prompting Required",
                                    desc: "You don't need to know how to talk to a robot. Simply fill in the blanks and let the scoring engine direct you."
                                }
                            ].map((feature, i) => (
                                <div key={feature.title} className="p-6 rounded-xl border border-border bg-card">
                                    <feature.icon className="h-6 w-6 text-primary mb-4" />
                                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Call to Action */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-10 border border-primary/20 text-center shadow-sm">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Don't Trust Your Career to a Chatbot</h2>
                            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                                Upgrade to a dedicated, high-precision Career Intelligence operating system designed natively to beat human bias and automated tracking systems.
                            </p>
                            <a href="/login" className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold px-10 py-4 rounded-lg hover:opacity-90 shadow-lg text-lg transition-transform hover:scale-105">
                                Try Specialized AI Free
                            </a>
                        </div>
                    </motion.section>

                    {/* FAQ */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-8">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="1" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Can I just use ChatGPT for my resume?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    While ChatGPT can rewrite sentences, it hallucinates skills, ruins ATS formatting, and lacks the deterministic matching needed to specifically align keywords with corporate HR systems.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="2" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Why is AIVI better than Gemini for career tools?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    AIVI layers industry-specific deterministic logic over its foundational language models, ensuring that metrics, acronyms, and structure are preserved exactly as recruiters expect.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="3" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Does AIVI hallucinate job experience?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    No. AIVI strictly rewrites existing data for maximum impact. It is logically bound from inventing past jobs or technical skills you do not possess.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="4" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Does AIVI use ChatGPT or Gemini under the hood?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    AIVI utilizes a variety of state-of-the-art foundation models (including customized endpoints from leading AI providers) wrapped heavily in proprietary programmatic scoring engines to guarantee accuracy.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.section>

                    {/* Related Tools */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-8 border-t border-border mt-12">
                        <h2 className="text-2xl font-bold mb-8 text-foreground text-center">Related Career Tools</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link to="/ai-resume-builder-for-freshers" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-foreground">AI Resume Builder</h3>
                                <p className="text-sm text-muted-foreground">The deterministic way to write resumes.</p>
                            </Link>
                            <Link to="/job-fit-analysis-tool" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-foreground">Job Fit Analysis Tool</h3>
                                <p className="text-sm text-muted-foreground">Score your resume automatically.</p>
                            </Link>
                            <Link to="/linkedin-optimization" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-foreground">LinkedIn Optimizer</h3>
                                <p className="text-sm text-muted-foreground">Improve recruiter search visibility.</p>
                            </Link>
                        </div>
                    </motion.section>

                </div>
            </main>

            <GlobalFooter />
        </div>
    );
};

export default AIVsChatGPTVsGemini;
*/
