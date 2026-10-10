export { default } from "./LinkedInOptimizationPageConceptB";
/*
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import { Linkedin, Eye, TrendingUp, Users, Target, Search } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const LinkedInOptimizationPage = () => {
    return (
        <div className="min-h-screen bg-background dark">
            <Helmet>
                <title>LinkedIn Profile Optimization AI - AIVI Career Intelligence</title>
                <meta name="description" content="Optimize your LinkedIn profile for recruiters. Our AI analyzes your headline, about section, and experience to help you rank higher in recruiter searches and attract inbound opportunities." />
                <link rel="canonical" href="https://aivilabs.com/linkedin-optimization" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="LinkedIn Profile Optimization AI - AIVI Career Intelligence" />
                <meta property="og:description" content="Optimize your LinkedIn profile for recruiters. Our AI analyzes your headline, about section, and experience to help you rank higher in recruiter searches and attract inbound opportunities." />
                <meta property="og:url" content="https://aivilabs.com/linkedin-optimization" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://aivilabs.com/og-image.png" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="LinkedIn Profile Optimization AI - AIVI Career Intelligence" />
                <meta name="twitter:description" content="Optimize your LinkedIn profile for recruiters. Our AI analyzes your headline, about section, and experience to help you rank higher in recruiter searches and attract inbound opportunities." />
                <meta name="twitter:image" content="https://aivilabs.com/og-image.png" />

                <script type="application/ld+json">
                    {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "Why is LinkedIn optimization important for my career?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "LinkedIn is the primary platform recruiters use to source candidates. An optimized profile ensures you appear in their search results and passively attract opportunities without applying."
                }
              }, {
                "@type": "Question",
                "name": "What does the AIVI LinkedIn Optimizer analyze?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI analyzes your industry alignment, profile completeness, keyword density, and authority positioning to ensure you rank high in recruiter searches."
                }
              }, {
                "@type": "Question",
                "name": "Will this require me to manually rewrite my entire profile?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. AIVI provides optimized, copy-and-paste rewrites for your headline and summary based on recruiter data, saving you hours of work."
                }
              }, {
                "@type": "Question",
                "name": "How do I get my LinkedIn profile into AIVI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply download your profile as a PDF directly from LinkedIn and upload it to our secured platform. The AI instantly extracts and analyzes your data."
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
                "name": "LinkedIn Profile Optimization",
                "item": "https://aivilabs.com/linkedin-optimization"
              }]
            }
          `}
                </script>
            </Helmet>

            <GlobalHeader />

            <main className="page-offset pb-20 max-w-5xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 font-medium text-sm mb-6 border border-blue-500/20">
                        <Linkedin className="h-4 w-4" /> Professional Branding Engine
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        AI LinkedIn <span className="text-gradient">Optimization</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        Turn your LinkedIn profile into a 24/7 magnet for recruiters. Get a complete, data-driven audit of your entire profile and receive optimized, copy-and-paste rewrites for your headline and summary to drastically increase your visibility and inbound opportunities.
                    </p>
                </motion.div>

                <div className="space-y-16">
                    {/* The Power of LinkedIn */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">Why Your LinkedIn Profile is More Important Than Your Resume</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In the modern hiring landscape, an exceptional resume is only half the battle. While a resume is a static document you use to actively apply for a specific job, your LinkedIn profile is a dynamic, public-facing landing page that serves as your professional brand. Executive recruiters, sourcing teams, and hiring managers use LinkedIn Recruiter daily to search for talent.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If your profile is unoptimized, you are practically invisible in these recruiter searches. You are missing out on the "hidden job market"—opportunities that are never publicly posted because recruiters source candidates directly. A fully optimized profile signals authority, expertise, and passively attracts high-quality job offers while you focus on your current work.
                        </p>
                    </motion.section>

                    {/* How the Optimization Works */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-6">How AIVI Optimizes Your Profile</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                            AIVI approaches LinkedIn optimization not with generic advice, but with algorithmic precision. We analyze your profile exactly how LinkedIn's own search algorithm (SEO) views it.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                {
                                    icon: Search,
                                    title: "Keyword Injection",
                                    desc: "We analyze your target role and industry, identifying the exact high-value keywords recruiters search for, and seamlessly integrate them into your profile."
                                },
                                {
                                    icon: Eye,
                                    title: "Headline Re-Engineering",
                                    desc: "Your headline is the most heavily weighted SEO factor on LinkedIn. We rewrite weak headlines into powerful positioning statements that grab attention immediately."
                                },
                                {
                                    icon: Target,
                                    title: "About Section Storytelling",
                                    desc: "We rewrite your summary from a dry biography into an engaging narrative that highlights your unique value proposition, technical skills, and leadership impact."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Experience Optimization",
                                    desc: "We provide strategic shifts for your experience section, ensuring that your current responsibilities are framed around measurable achievements."
                                },
                                {
                                    icon: Users,
                                    title: "Recruiter Appeal Scoring",
                                    desc: "We grade your current profile with a 'Recruiter Appeal Score', telling you exactly how a hiring manager perceives your profile at first glance."
                                },
                                {
                                    icon: Linkedin,
                                    title: "One-Click PDF Import",
                                    desc: "There is no complex setup. Simply download your profile as a PDF directly from LinkedIn, upload it to AIVI safely, and let the AI do the heavy lifting."
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

                    {/* Use Cases */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                        <h2 className="text-3xl font-semibold text-foreground mb-6">Use Cases for the Optimization Tool</h2>
                        <ul className="list-disc list-inside space-y-4 text-muted-foreground leading-relaxed text-lg mb-6">
                            <li>
                                <strong className="text-foreground">The Passive Job Seeker:</strong> You are happy at your current company but open to exceptional offers. An optimized profile ensures top-tier recruiters can find you and present lucrative opportunities without you lifting a finger.
                            </li>
                            <li>
                                <strong className="text-foreground">The Career Transitioner:</strong> Moving from Sales to Product Management? AIVI will rewrite your headline and summary to highlight your transferable skills, repositioning your brand for your new target industry.
                            </li>
                            <li>
                                <strong className="text-foreground">Freelancers & Consultants:</strong> Your LinkedIn profile is your storefront. Our AI helps craft an "About" section that acts as a sales pitch, converting profile views into client inquiries.
                            </li>
                        </ul>
                    </motion.section>

                    {/* Deep Dive & Benefits */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-4">Detailed Benefits & Analysis Insights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The AIVI LinkedIn Optimizer provides a deep dive into four critical metrics:
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-card border border-border rounded-lg">
                                <h3 className="font-bold text-foreground">1. Industry Alignment Score</h3>
                                <p className="text-sm text-muted-foreground mt-1">Measures how well your profile vocabulary matches standard terms used by professionals in your desired field.</p>
                            </div>
                            <div className="p-4 bg-card border border-border rounded-lg">
                                <h3 className="font-bold text-foreground">2. Profile Completeness</h3>
                                <p className="text-sm text-muted-foreground mt-1">Flags missing sections or underutilized fields that LinkedIn's algorithm penalizes you for leaving empty.</p>
                            </div>
                            <div className="p-4 bg-card border border-border rounded-lg">
                                <h3 className="font-bold text-foreground">3. Keyword Density</h3>
                                <p className="text-sm text-muted-foreground mt-1">Ensures you have the right density of hard skills (e.g., Python, Agile, SEO) so you rank high in Recruiter searches.</p>
                            </div>
                            <div className="p-4 bg-card border border-border rounded-lg">
                                <h3 className="font-bold text-foreground">4. Authority Positioning</h3>
                                <p className="text-sm text-muted-foreground mt-1">Analyzes the tone of your profile. Are you presenting yourself as a doer, a manager, or an industry thought leader?</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                            By addressing these areas through our AI-generated recommendations, you guarantee that your profile stands out among thousands of applicants.
                        </p>

                        <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/10 rounded-2xl p-10 border border-blue-500/20 text-center shadow-sm">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Unlock Your Inbound Potential</h2>
                            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                                Transform your professional brand today. Use AIVI to grade and completely rewrite your LinkedIn profile. Let the opportunities come to you.
                            </p>
                            <a href="/login" className="inline-flex items-center justify-center bg-blue-600 text-white font-bold px-10 py-4 rounded-lg hover:bg-blue-700 shadow-lg text-lg transition-transform hover:scale-105">
                                Optimize My Profile Now
                            </a>
                        </div>
                    </motion.section>

                    {/* FAQ */}
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h2 className="text-3xl font-semibold text-foreground mb-8">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="1" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Why is LinkedIn optimization important for my career?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    LinkedIn is the primary platform recruiters use to source candidates. An optimized profile ensures you appear in their search results and passively attract opportunities without applying.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="2" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">What does the AIVI LinkedIn Optimizer analyze?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    Our AI analyzes your industry alignment, profile completeness, keyword density, and authority positioning to ensure you rank high in recruiter searches.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="3" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">Will this require me to manually rewrite my entire profile?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    No. AIVI provides optimized, copy-and-paste rewrites for your headline and summary based on recruiter data, saving you hours of work.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="4" className="bg-card border-border rounded-lg mb-4 px-6 border">
                                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary transition-colors py-6">How do I get my LinkedIn profile into AIVI?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6">
                                    Simply download your profile as a PDF directly from LinkedIn and upload it to our secured platform. The AI instantly extracts and analyzes your data.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.section>

                </div>
            </main>

            <GlobalFooter />
        </div>
    );
};

export default LinkedInOptimizationPage;
*/
