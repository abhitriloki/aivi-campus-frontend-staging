# AIVI Career Intelligence Platform - Product Documentation

> **Note on Visuals:** Screenshots & recordings have been captured sequentially to reflect the exact flow. Highlight boxes, arrows, and numbered annotations (via Nano Banana) are described for each visual asset.

## Table of Contents
1. [Part 1: Landing Page Documentation](#part-1-landing-page-documentation)
2. [Part 2: Signup / Login Flow](#part-2-signup--login-flow)
3. [Part 3: Dashboard Overview](#part-3-dashboard-overview)
4. [Part 4: Resume Intelligence Module](#part-4-resume-intelligence-module)
5. [Part 5: Resume Rebuild / Resume Builder Module (CRITICAL)](#part-5-resume-rebuild--resume-builder-module-critical)
6. [Part 6: Job Fit Analysis](#part-6-job-fit-analysis)
7. [Part 7: Skill Roadmap](#part-7-skill-roadmap)
8. [Part 8: Interview Intelligence](#part-8-interview-intelligence)
9. [Part 9: Promotion Readiness](#part-9-promotion-readiness)
10. [Part 10: Portfolio Analyzer](#part-10-portfolio-analyzer)
11. [Part 11: LinkedIn Analyzer](#part-11-linkedin-analyzer)
12. [Part 12: Plan Gating & Paywall](#part-12-plan-gating--paywall)
13. [Part 13: Admin Dashboard](#part-13-admin-dashboard)

---

## Part 1: Landing Page Documentation

### 1.1 Hero Section
**Visual Requirement:** 
- Full hero section screenshot.
![Hero Section](./images/aivi_hero_section_1772196236500.png)
- *Nano Banana Annotation:* Box around the headline, arrow pointing to the primary CTA.
- **Description:** Showcases the platform's core promise to job seekers with an immediate call to action to boost their career. 
- **User Intent:** Hook the user immediately to understand value.

### 1.2 Value Proposition & Feature Highlights
**Visual Requirement:**
- Screenshot of the feature highlights section.
![Features Section](./images/aivi_features_section_1772196257014.png)
- *Nano Banana Annotation:* Numbered annotations on the 3 core pillars (Intelligence, Rebuild, Interview).
- **Description:** Clearly breaks down what tools are available.
- **User Intent:** Build trust and demonstrate comprehensive offering.

### 1.3 CTA Buttons & Navigation Structure
**Visual Requirement:**
- Screenshot of Top Nav & secondary CTA.
![Product Dropdown](./images/aivi_product_dropdown_1772197262179.png)
![AI Tools Dropdown](./images/aivi_ai_tools_dropdown_1772197275143.png)
- *Nano Banana Annotation:* Box highlighting the Dropdown Menus and 'Sign In' Button.
- **Description:** Enables easy discovery of CU pages for SEO and easy login for returning users.
- **User Intent:** Seamless navigation depending on whether user is top-of-funnel (exploring tools) or bottom-of-funnel (ready to log in).

### 1.4 Footer & SEO Structure
**Visual Requirement:**
- Screenshot of the bottom footer containing links.
![Footer Section](./images/aivi_footer_section_1772197231152.png)
- *Nano Banana Annotation:* Highlighting the links to the CU pages and policy pages.
- **Description:** Anchors the domain structure and distributes link equity across tool-specific bottom-of-funnel pages.
- **User Intent:** Deep dive into specific capabilities or verify company legitimacy.

---

## Part 2: Signup / Login Flow

### 2.1 Login Experience
**Visual Requirement:**
- Screenshot of the login page.
![Login Page](./images/aivi_login_page_1772197301921.png)
- *Nano Banana Annotation:* Highlight the OAuth (Google/LinkedIn) vs standard Email/Password input forms.
- **Description:** Secure, frictionless entry point to the platform.
- **User Intent:** Access account quickly without hassle.

### 2.2 Redirect Behavior & Error Handling
**Visual Requirement:**
- Video/Screenshot showing post-login redirect.
- *Nano Banana Annotation:* Arrow illustrating transition from Login straight to Dashboard.
- **Description:** Upon successful authentication, users are instantly guided to their localized dashboard to review past analysis and usage quota.
- **User Intent:** Confirm successful auth and land on the control center.

---

## Part 3: Dashboard Overview

### 3.1 Main Dashboard View
**Visual Requirement:**
- Screenshot of the main Career Intelligence Dashboard.
![Dashboard Overview](./images/aivi_dashboard_overview_1772197331379.png)
- *Nano Banana Annotation:* Box around the 'Starter Beta Trial Active' banner, and numbered markers on Overall Score, Skills Tracked, and Analysis Usage. 
- **Description:** The central hub where all AI intelligence is aggregated. Users see their recent resume score, remaining trial/plan limits, and quick-links to all modules.
- **User Intent:** Get a quick pulse on current career standing and available quota.

### 3.2 Plan Gating & Usage Tracking
**Visual Requirement:**
- Close-up screenshot of the Usage/Plan widget.
- *Nano Banana Annotation:* Highlight box around '1/30 Analyses Used (Trial)' and the 'Upgrade Early' button.
- **Description:** Clearly shows the user's current tier (Free vs Paid) and limits feature abuse. Free limits drive upgrades.
- **User Intent:** Check eligibility to run new scans and navigate to pricing.

---

## Part 4: Resume Intelligence Module

### 4.1 Score Breakdown & ATS Check
**Visual Requirement:**
- Screenshot of the completed Resume Analysis results page.
![Resume Score Breakdown](./images/resume_intelligence_scores_1772197661612.png)
- *Nano Banana Annotation:* Numbered markers on Overall Score, Impact Score, Brevity Score, and ATS compatibility.
- **Description:** A deterministic rating engine providing immediate visual feedback on the resume's effectiveness.
- **User Intent:** Know exactly where the resume fails ATS scans and human review.

### 4.2 Technical Depth & Keyword Optimization
**Visual Requirement:**
- Screenshot of the technical skills parsed and keyword suggestions in the Resume Analysis.
![Keyword Optimization](./images/resume_intelligence_detailed_guidance_1772198403899.png)
- *Nano Banana Annotation:* Arrow pointing to missing/suggested keywords.
- **Description:** The system compares the resume against industry standards to find weak buzzwords and suggest high-value alternatives.
- **User Intent:** Ensure no critical hard skills are missing for their targeted seniority.

### 4.3 Weak Bullet Suggestions & Seniority Guidance
**Visual Requirement:**
- Screenshot of the 'Areas for Improvement' or weak bullets section.
![Weak Bullet Suggestions](./images/resume_intelligence_bullet_suggestions_bottom_1772197724225.png)
- *Nano Banana Annotation:* Highlight specific ai-generated structured advice.
- **Description:** Pinpoints exactly which achievements lack quantification and what the detected seniority level is versus what it should be.
- **User Intent:** Get actionable advice on exactly what to rewrite.

---

## Part 5: Resume Rebuild / Resume Builder Module (CRITICAL)

### 5.1 Resume Builder Interface & Loading State
**Visual Requirement:**
- Full-page screenshot of the Resume Builder interface before generation.
- Screenshot of the 'Target Role' input field and loading state.
![Resume Builder Initial](./images/resume_builder_initial_state_1772197834290.png)
![Resume Builder Loading](./images/resume_builder_loading_state_1772198183021.png)
- *Nano Banana Annotation:* Highlight the 'Target Role' input box and the primary 'Rebuild Resume' generate button.
- **Description:** A premium workflow where the user inputs their current resume and target job title. This initiates a deep regeneration phase instead of a simple review.
- **User Intent:** Transform an existing mediocre resume into a highly targeted, ATS-optimized version tailored to a specific job title.

### 5.2 Fully Rebuilt Output & Quantified Impact
**Visual Requirement:**
- Screenshot of the fully rebuilt resume output.
![Rebuilt Resume Output](./images/resume_builder_full_page_1772198443575.png)
- *Nano Banana Annotation:* Use arrows to connect 'Before' and 'After' differences. Highlight quantified metrics and keyword injections mathematically added by AI.
- **Description:** This core paid feature does not merely rephrase text. It structurally improves bullet points by injecting context-aware keywords and expanding implied achievements into concrete numeric impacts.
- **Strategic Use Case:** Essential for users applying to specific high-competition roles where ATS keyword alignment is mandatory.

### 5.3 Version History & Paywall Friction
**Visual Requirement:**
- Screenshot showing version saving and any regeneration paywall limitations.
- *Nano Banana Annotation:* Box around the 'Save Version' and 'Download' action buttons. Highlight the credit deduction / paid restriction logic.
- **Description:** Users can save different optimized versions for different job families. The ability to continually regenerate is gated behind the paid tier to sustain token costs and drive ROI up for premium users.
- **How to Use Resume Builder:**
  1. Upload current resume or select an existing one.
  2. Enter the specific Target Role.
  3. Review the newly quantified and ATS-optimized bullet improvements.
  4. Download or Save the version for direct application submission.

---

## Part 6: Job Fit Analysis

### 6.1 Job Match Scoring
**Visual Requirement:**
- Screenshot of the Job Fit Analysis result showing the Job Match %.
![Job Match Scoring](./images/job_fit_analysis_results_1772198786426.png)
- *Nano Banana Annotation:* Numbered annotations on Eligibility Score, Shortlist Probability, and Role Fit Index.
- **Description:** A deterministic engine comparing the parsed resume directly against a target Job Description.
- **User Intent:** Evaluate chances of getting an interview before spending time applying.

### 6.2 Missing & Matched Skills
**Visual Requirement:**
- Screenshot of the Missing Skills and Tool Gaps comparison.
- *Nano Banana Annotation:* Highlight the Red 'Missing' badges and the Green 'Matched' badges.
- **Description:** Clearly delineates which keywords the ATS will flag as missing, and any experience gaps identified.
- **Strategic Usage:** Use this gap list to either update the resume via Rebuild or pursue rapid upskilling.

---

## Part 7: Skill Roadmap

### 7.1 Generated Career Roadmap
**Visual Requirement:**
- Screenshot of the 30/60/90 day Skill Roadmap generated.
![30 Day Roadmap](./images/skill_roadmap_30_day_1772198921485.png)
![60 Day Roadmap](./images/skill_roadmap_60_day_1772198934694.png)
![90 Day Roadmap](./images/skill_roadmap_90_day_1772198948203.png)
- *Nano Banana Annotation:* Box around the timeline structure and recommended learning resources.
- **Description:** AI generates a personalized curriculum to bridge the exact gaps identified in the Job Fit Analysis.
- **Practical Application:** Users transition from identifying their weaknesses to actively fixing them via actionable timelines.

---

## Part 8: Interview Intelligence

### 8.1 Categorized Interview Questions
**Visual Requirement:**
- Screenshot of the Interview Intelligence module showing Categorized Questions.
![Categorized Questions 1](./images/interview_prep_technical_1772199134058.png)
![Categorized Questions 2](./images/interview_prep_technical_more_1772199147647.png)
- *Nano Banana Annotation:* Highlight a specific technical question and its corresponding sample answer.
- **Description:** Generates structured, role-specific behavioral and technical interview questions based on the resume and target role.
- **User Preparation:** Moves beyond generic AI chat to structured interview drilling.

---

## Part 9: Promotion Readiness

### 9.1 Readiness Score & Gap Analysis
**Visual Requirement:**
- Full section screenshot of Promotion Readiness.
![Promotion Readiness](./images/promotion_readiness_analysis_1772199311545.png)
- *Nano Banana Annotation:* Box around the Readiness Score and the estimated Timeline.
- **Description:** Positions the user for internal advancement by analyzing current impact versus next-level requirements.
- **Positioning Strategy:** Helps employed users negotiate titles and salary bumps internally.

---

## Part 10: Portfolio Analyzer

### 10.1 Portfolio Scoring Logic
**Visual Requirement:**
- Screenshot of the Portfolio Analyzer results.
![Portfolio Analyzer](./images/portfolio_analyzer_results_1772199423648.png)
- *Nano Banana Annotation:* Highlight Depth Score, Attractiveness Score, and specific suggestions.
- **Description:** Reads project repositories or portfolio links to grade the visible proof of work.
- **Scoring Logic:** Grades based on technical complexity (Depth) and presentation (Attractiveness).

---

## Part 11: LinkedIn Analyzer

### 11.1 Profile Optimization
**Visual Requirement:**
- Screenshot of LinkedIn input and Optimization Output.
![LinkedIn Input](./images/linkedin_analyzer_input_1772199471292.png)
![LinkedIn Output](./images/linkedin_analyzer_results_1772199454143.png)
- *Nano Banana Annotation:* Highlight Headline suggestions and Experience improvements.
- **Description:** Extends resume intelligence to the public LinkedIn profile to increase inbound recruiter traffic.

---

## Part 12: Plan Gating & Paywall

### 12.1 Monetization Structure
**Visual Requirement:**
- Screenshot of the Upgrade Modal or Regenerate Restriction for free-tier users.
![Subscription Status](./images/plan_gating_subscription_1772199505457.png)
![Pricing Comparison](./images/pricing_plans_comparison_1772199520548.png)
- *Nano Banana Annotation:* Box around the pricing table and the 'Upgrade to Pro' CTA.
- **Description:** Demonstrates the freemium token model, how free runs exhaust, and the conversion funnel to the paid plan.

---

## Part 13: Admin Dashboard

### 13.1 Usage & Cost Tracking
**Visual Requirement:**
- Screenshot of the Admin Dashboard.
> *Note: Admin dashboard was inaccessible with the provided credentials. The route `/admin` returned a 404.*
- *Nano Banana Annotation:* Highlight AI Cost Tracking, Usage Logs, and Revenue analytics.
- **Description:** Internal control center for monitoring token spend against Gemini APIs and managing trial statuses.

---
**End of Documentation**

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
