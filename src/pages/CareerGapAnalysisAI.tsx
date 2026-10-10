export { default } from "./CareerGapAnalysisAIConceptB";
/*
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, TrendingUp, Compass, MapPin, Map, LineChart, Target } from "lucide-react";

const CareerGapAnalysisAI = () => {
    return (
        <div className="min-h-screen bg-background dark">
            <Helmet>
                <title>Career Gap Analysis AI & Skill Mapping | AIVI Career Intelligence</title>
                <meta name="description" content="Generate 30, 60, and 90-day learning roadmaps based on your current resume and target job. Our Career Gap Analysis AI identifies exact skills you need to upskill." />
                <link rel="canonical" href="https://aivilabs.com/career-gap-analysis-ai" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="Career Gap Analysis AI & Skill Mapping | AIVI Career Intelligence" />
                <meta property="og:description" content="Generate 30, 60, and 90-day learning roadmaps based on your current resume and target job. Our Career Gap Analysis AI identifies exact skills you need to upskill." />
                <meta property="og:url" content="https://aivilabs.com/career-gap-analysis-ai" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://aivilabs.com/og-image.png" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Career Gap Analysis AI & Skill Mapping | AIVI Career Intelligence" />
                <meta name="twitter:description" content="Generate 30, 60, and 90-day learning roadmaps based on your current resume and target job." />
                <meta name="twitter:image" content="https://aivilabs.com/og-image.png" />

                <script type="application/ld+json">
                    {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "What is Career Gap Analysis AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "It is an intelligent system that evaluates your current resume against your target role or industry standard, identifying the exact technical and soft skills you are missing."
                }
              }, {
                "@type": "Question",
                "name": "How does the Skill Roadmap work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Once gaps are identified, the AI generates a customized 30-day, 60-day, and 90-day learning roadmap outlining what to learn, in what order, to bridge those gaps."
                }
              }, {
                "@type": "Question",
                "name": "Is it suitable for pivoting careers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, it is highly effective for career switchers as it clearly maps out which existing skills are transferable and which new domain-specific skills must be acquired."
                }
              }, {
                "@type": "Question",
                "name": "Where does the AI get its skill requirements?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "It parses the target job description you provide or maps against industry-standard requirements for the job title you designate in the dashboard."
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
                "name": "Career Gap Analysis AI",
                "item": "https://aivilabs.com/career-gap-analysis-ai"
              }]
            }
          `}
                </script>
            </Helmet>

            <GlobalHeader />

            <main className="page-offset pb-20 max-w-5xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                        <TrendingUp className="h-4 w-4" /> Actionable Upskilling Plans
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        Predictive <span className="text-gradient hover-glow">Career Gap Analysis</span> AI
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        Identify what's holding you back. Get a personalized 30, 60, and 90-day learning roadmap mapped directly to the skills you need for your target role.
                    </p>
                </motion.div>

                <div className="space-y-16">
                    {/* The Problem */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">Upskill With Precision, Not Guesses</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Most professionals stall in their careers because they don't know exactly what to learn next. Is it a new programming language? Better leadership skills? A certification?
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Our <strong>Career Gap Analysis AI</strong> takes your current resume, compares it against the industry requirements for your next target title, and isolates your weaknesses mathematically.
                        </p>
                    </motion.section>

                    {/* How It Works */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">Perfect for Career Pivoters and Climbers</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                            Switching from marketing to data analytics? Transitioning from military to civilian corporate roles? The platform intelligently maps <em>transferable skills</em> you already possess so you don't start from scratch.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                {
                                    icon: MapPin,
                                    title: "Deficit Mapping",
                                    desc: "We tell you the exact keywords missing from your technical stack based on your target job."
                                },
                                {
                                    icon: Compass,
                                    title: "Time-Boxed Roadmaps",
                                    desc: "Generates structured 30-day basics, 60-day intermediate, and 90-day advanced plans."
                                },
                                {
                                    icon: LineChart,
                                    title: "ROI Prioritization",
                                    desc: "Organizes skills into Core Requirements vs Nice-to-Haves so you focus on highest ROI activities first."
                                },
                                {
                                    icon: Map,
                                    title: "Strategic Learning",
                                    desc: "Stop watching random tutorials. Follow a directed curriculum based on employer demands."
                                },
                                {
                                    icon: Target,
                                    title: "Transferable Skills",
                                    desc: "Automatically detects soft skills you can port over from vastly different industries."
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "Live Industry Data",
                                    desc: "Recommendations are powered by continuous analysis of thousands of active job postings."
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
                            <h2 className="text-3xl font-bold text-foreground mb-4">Calculate Your Next Move</h2>
                            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                                Don't waste another six months learning the wrong technology. Generate your custom learning roadmap today.
                            </p>
                            <a href="/login" className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold px-10 py-4 rounded-lg hover:opacity-90 shadow-lg text-lg transition-transform hover:scale-105">
                                Build My Roadmap Free
                            </a>
                        </div>
                    </motion.section>

                    {/* FAQ */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-8">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="1" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">What is Career Gap Analysis AI?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    It is an intelligent system that evaluates your current resume against your target role or industry standard, identifying the exact technical and soft skills you are missing.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="2" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">How does the Skill Roadmap work?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    Once gaps are identified, the AI generates a customized 30-day, 60-day, and 90-day learning roadmap outlining what to learn, in what order, to bridge those gaps.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="3" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Is it suitable for pivoting careers?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    Yes, it is highly effective for career switchers as it clearly maps out which existing skills are transferable and which new domain-specific skills must be acquired.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="4" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Where does the AI get its skill requirements?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    It parses the target job description you provide or maps against industry-standard requirements for the job title you designate in the dashboard.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.section>

                    {/* Related Tools */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-8 border-t border-border mt-12">
                        <h2 className="text-2xl font-bold mb-8 text-foreground text-center">Related Career Tools</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link to="/job-fit-analysis-tool" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-foreground">Job Fit Analysis Tool</h3>
                                <p className="text-sm text-muted-foreground">Find out if you are ready to apply.</p>
                            </Link>
                            <Link to="/ai-vs-chatgpt-vs-gemini" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg mb-2 text-foreground">AIVI vs ChatGPT</h3>
                                <p className="text-sm text-muted-foreground">Why bespoke AI models are superior.</p>
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

export default CareerGapAnalysisAI;
*/
