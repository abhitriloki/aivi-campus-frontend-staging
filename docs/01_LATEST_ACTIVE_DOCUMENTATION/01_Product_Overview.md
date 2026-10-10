# AIVI Career Intelligence OS - Product Overview

## 1. Vision of AIVI
AIVI (Artificial Intelligence Visibility Insights) is built to be the definitive **Career Intelligence OS**. Moving beyond traditional keyword-stuffing resume builders, AIVI acts as a personal, AI-powered career strategist. It translates a professional's raw experience into targeted, high-impact narratives that align with market demands, enabling users to consistently surface in the "hidden job market."

## 2. Core Positioning
AIVI is positioned as a structured intelligence platform that reverse-engineers recruiter expectations, applicant tracking systems (ATS), and industry standards to score, evaluate, and iteratively improve a candidate's entire professional footprint. It acts as an autonomous career coach, copywriter, and strategist in one.

## 3. Primary Modules

### 3.1. Resume Intelligence (`/dashboard/resume`)
- **Function**: Deep structural analysis of a user's uploaded resume.
- **Output**: Actionable feedback on impact phrasing, metric inclusion, and ATS formatting compatibility.
- **Value**: Identifies precise weaknesses in phrasing that cause ATS rejection.

### 3.2. Job Fit Analysis (`/dashboard/job-fit`)
- **Function**: Compares a target job description against the user's profile.
- **Output**: Generates a match score, highlights missing hard/soft keywords, and suggests strategic pivot points.
- **Value**: Prevents "spray and pray" application strategies by giving a calculated probability of success.

### 3.3. LinkedIn Analyzer & Optimization (`/dashboard/linkedin`)
- **Function**: Evaluates the user's LinkedIn profile for recruiter appeal based on industry benchmarks.
- **Output**: Generates a "Recruiter Appeal Score," rewrites the Headline, About section, and Experience bullet points structured specifically for the LinkedIn search algorithm.
- **Value**: Converts passive profiles into inbound recruiter magnets.

### 3.4. AI Resume Builder (`/dashboard/builder`)
- **Function**: A generative compilation engine that drafts a brand new, ATS-compliant resume strictly using the "Action + Metric + Result" format tailored to a specific target role.
- **Output**: A fully generated resume with impact-first phrasing.
- **Value**: Eliminates writer's block and guarantees ATS parsing success.

### 3.5. Skill Roadmap (`/dashboard/roadmap`)
- **Function**: Identifies current skill gaps based on the user's target trajectory.
- **Output**: Constructs a prioritized 30/60/90-day learning path.
- **Value**: Shifts focus from passive job seeking to active upskilling.

### 3.6. Interview Prep (`/dashboard/interview`)
- **Function**: Simulates technical, behavioral, and situational interview questions specific to the user's profile and target role.
- **Output**: Question banks and optimal STAR-method response frameworks.
- **Value**: Builds confidence before the actual interview loop.

### 3.7. Promotion Readiness (`/dashboard/promotion`)
- **Function**: Analyzes current responsibilities against next-level market expectations.
- **Output**: Builds a documented case for career advancement or salary negotiation.
- **Value**: Empowers employees to negotiate based on structured data.

### 3.8. Portfolio Analyzer (`/dashboard/portfolio`)
- **Function**: Evaluates external links (GitHub, Behance, Personal Sites).
- **Output**: Feedback on professional consistency and impact.
- **Value**: Ensures the user's entire digital footprint aligns with their resume.

## 4. Target Users
- **Active Job Seekers**: Professionals experiencing low callback rates needing immediate optimization to bypass ATS filters.
- **Mid-Level Professionals**: Employees looking to pivot industries or position themselves for senior/managerial roles but struggling to translate their experience into leadership metrics.
- **Recent Graduates**: Entry-level candidates needing assistance translating academic projects into professional impact statements.

## 5. Value Proposition
AIVI saves users dozens of hours of manual tailoring, eliminates the guesswork of ATS optimization, and provides senior-level career coaching insights at a fraction of the cost of human career consultants (₹399/mo vs ₹15,000+ for a professional resume writer).

## 6. Beta Strategy (First 1000 Users)
To generate initial traction, stress-test the AI model infrastructure, and build a localized user base, AIVI is currently running a strict, server-enforced **FIRST1000** campaign. 
- **Logic**: This coupon grants a 100% discount access to the "Starter" tier.
- **Enforcement**: Capped strictly at 1,000 successful redemptions via a secure Firestore transaction count (`system_stats/beta`), seeding the platform with active feedback while strictly controlling generative AI compute overhead.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
