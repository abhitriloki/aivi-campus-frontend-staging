# AIVI Career & Campus OS — Master Project Documentation

> **Version**: 2.4.0  
> **Last Updated**: August 13, 2026  
> **Legal Entity**: AIVI Intelligence Private Limited  
> **Headquarters**: Gorakhpur, Uttar Pradesh, India  
> **Authoritative Baseline**: Production & Staging Verified Codebase  

---

## Table of Contents
1. [Executive Summary & Brand Overview](#1-executive-summary--brand-overview)
2. [System Architecture & High-Level Topology](#2-system-architecture--high-level-topology)
3. [Core Technology Stack & Specific Version Registry](#3-core-technology-stack--specific-version-registry)
4. [Subdomain Routing & Multi-Tenant Segregation Architecture](#4-subdomain-routing--multi-tenant-segregation-architecture)
5. [Frontend Application Architecture & Route Registry](#5-frontend-application-architecture--route-registry)
6. [Design System, Styling Tokens & Component Library](#6-design-system-styling-tokens--component-library)
7. [Firebase Integration & Authentication Architecture](#7-firebase-integration--authentication-architecture)
8. [Firestore Database Schema & Collection Rules](#8-firestore-database-schema--collection-rules)
9. [Cloud Functions Architecture & API Registry](#9-cloud-functions-architecture--api-registry)
10. [AI Engine Integration (Gemini, Sarvam AI & Prompt Pipeline)](#10-ai-engine-integration-gemini-sarvam-ai--prompt-pipeline)
11. [Payment Gateway Integration (Razorpay Orders & Webhooks)](#11-payment-gateway-integration-razorpay-orders--webhooks)
12. [Security & Compliance Protocol (DPDP Act 2023 & Security Rules)](#12-security--compliance-protocol-dpdp-act-2023--security-rules)
13. [B2B Multi-Tenant Campus OS Architecture](#13-b2b-multi-tenant-campus-os-architecture)
14. [SAML / OIDC Single Sign-On (SSO) Protocol for Partner Colleges](#14-saml--oidc-single-sign-on-sso-protocol-for-partner-colleges)
15. [Student Vault & Verified Resume ZIP Exporter Protocol](#15-student-vault--verified-resume-zip-exporter-protocol)
16. [AI Mock Interview & Vernacular Voice AI Mode](#16-ai-mock-interview--vernacular-voice-ai-mode)
17. [Placement Drives & Candidate Pipeline Management](#17-placement-drives--candidate-pipeline-management)
18. [NAAC & NIRF Accreditation Audit Report Generator](#18-naac--nirf-accreditation-audit-report-generator)
19. [Dynamic Legal Shell & Subdomain-Aware Navigation](#19-dynamic-legal-shell--subdomain-aware-navigation)
20. [Plan Entitlements, Monetization & Billing Architecture](#20-plan-entitlements-monetization--billing-architecture)
21. [Environmental Configuration & Secrets Management](#21-environmental-configuration--secrets-management)
22. [Infrastructure, Hosting & VPS Deployment Protocols](#22-infrastructure-hosting--vps-deployment-protocols)
23. [Deployment Safety Protocol & Staging-First Workflow (Rules D1-D6)](#23-deployment-safety-protocol--staging-first-workflow-rules-d1-d6)
24. [Testing & QA Automation (Vitest, Playwright, TestSprite)](#24-testing--qa-automation-vitest-playwright-testsprite)
25. [Error Handling, Logging & Observability](#25-error-handling-logging--observability)
26. [Performance Optimization, Caching & Bundle Strategy](#26-performance-optimization-caching--bundle-strategy)
27. [SEO, Social Previews (Open Graph) & Generative Engine Optimization (GEO)](#27-seo-social-previews-open-graph--generative-engine-optimization-geo)
28. [MCP Server Integrations & Autonomous Tooling Registry](#28-mcp-server-integrations--autonomous-tooling-registry)
29. [Administrative Console & Superadmin Management](#29-administrative-console--superadmin-management)
30. [Disaster Recovery, Backup Procedures & Incident Playbook](#30-disaster-recovery-backup-procedures--incident-playbook)
31. [Third-Party Services & Sub-processors Directory](#31-third-party-services--sub-processors-directory)
32. [Developer Onboarding, Local Setup & Troubleshooting Guide](#32-developer-onboarding-local-setup--troubleshooting-guide)
33. [Future Engineering Roadmap & Enhancement Strategy](#33-future-engineering-roadmap--enhancement-strategy)
34. [Milestone & Fix Log](#34-milestone--fix-log)

---

## 1. Executive Summary & Brand Overview

**AIVI** (AI Voice & Career Intelligence) is India's leading purpose-built **AI Career Operating System (Career OS)** and **Campus Intelligence Platform**. Owned and operated by **AIVI Intelligence Private Limited** (headquartered in Gorakhpur, Uttar Pradesh), AIVI bridges the gap between academic preparation and recruiter expectations for students, freshers, working professionals, and higher education institutions across Bharat.

### Core Value Propositions
1. **For Individual Candidates (B2C — `aivilabs.com`)**:
   - **Resume Studio v2**: 4 specialized creation paths (First Resume Wizard, Quick Edits & Metrics, Targeted JD Keyword Tailoring, and Full Structural Rebuilds). Enforces single-column Taleo, Workday, and Greenhouse ATS parser safety.
   - **Job Fit Analysis Tool**: 0–100% instant match calculation, missing keyword radar, and 1-click bridge into tailored resume rebuilds.
   - **Vernacular Voice AI Mock Interview**: Interactive speech practice in Hindi, Hinglish, and English with STAR framework scoring and real-time confidence metrics.
   - **Skill Gap Roadmap**: 30-day role-specific skill acquisition and capstone project guidance.
   - **Promotion Readiness & Portfolio Analyzer**: Business impact statement conversion and GitHub repository code quality audit.

2. **For Higher Education Institutions & TPOs (B2B — `campus.aivilabs.com`)**:
   - **Multi-Tenant Campus Portal**: Isolated tenant branding, custom subdomains, SAML/OIDC SSO integration, and bulk student onboarding wizards.
   - **Placement Drive Management**: Shortlisting pipelines, drive scheduling, status updates, and automated candidate communications.
   - **Verified Resume Vault & ZIP Exporter**: Streamed zip archive generation of verified PDF resumes for company campus hiring.
   - **NAAC & NIRF Accreditation Audit Generator**: Automated generation of official criterion compliance reports and PDF downloads.

---

## 2. System Architecture & High-Level Topology

AIVI utilizes a decoupled, serverless frontend-and-functions architecture paired with a dedicated Hostinger KVM 4 VPS reverse proxy.

```mermaid
graph TD
    Client[Browser / Client App] --> DomainRouter{Domain Router}
    
    DomainRouter -->|aivilabs.com / staging.aivilabs.com| B2CLanding[B2C Career OS App]
    DomainRouter -->|campus.aivilabs.com / campus.staging.aivilabs.com| B2BCampus[B2B Campus OS Portal]

    B2CLanding --> GlobalHeader[Global Header & Nav]
    B2BCampus --> CampusHeader[Campus Header & Subdomain Nav]

    Client --> FirebaseSDK[Firebase Web SDK v12.14.0]
    FirebaseSDK --> FirebaseAuth[Firebase Auth]
    FirebaseSDK --> FirestoreDB[(Cloud Firestore DB)]
    FirebaseSDK --> Storage[(Firebase Cloud Storage)]

    Client --> CloudFunctions[Firebase Cloud Functions Node 20]
    CloudFunctions --> GeminiSDK[@google/generative-ai Node SDK]
    CloudFunctions --> SarvamAI[Sarvam AI Voice STT/TTS API]
    CloudFunctions --> Razorpay[Razorpay Orders API & Webhooks]
    CloudFunctions --> Nodemailer[Nodemailer SMTP Gateway]
    CloudFunctions --> Archiver[Archiver ZIP Stream Engine]

    HostingerVPS[Hostinger KVM 4 VPS 187.127.134.92] --> NginxProxy[Nginx Web Server]
    NginxProxy -->|/var/www/staging-aivi-campus/html| StagingDist[Staging Build Bundle]
    NginxProxy -->|/var/www/aivi-campus/html| ProdDist[Production Build Bundle]
```

---

## 3. Core Technology Stack & Specific Version Registry

### Frontend Technologies
| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **Vite** | `^8.2.0` | Next-gen frontend tooling and build engine |
| **React** | `^18.3.1` | Core UI component framework |
| **React Router DOM** | `^6.30.1` | Declarative client-side routing |
| **TypeScript** | `^5.8.3` | Strict type safety and compilation |
| **Tailwind CSS** | `^3.4.17` | Utility-first CSS styling engine |
| **Framer Motion** | `^12.34.0` | High-performance UI animation library |
| **Firebase SDK** | `^12.14.0` | Client Auth, Firestore & Storage integration |
| **Lucide React** | `^0.462.0` | Modern SVG iconography |
| **jsPDF** | `^4.2.1` | Client-side PDF document compilation |
| **Docx** | `^9.6.1` | Word DOCX export generation |
| **Recharts** | `^2.15.4` | Radar and analytics chart visualizations |
| **React Hook Form** | `^7.61.1` | Form state management |
| **Zod** | `^3.25.76` | Schema validation |
| **Vitest** | `^4.1.7` | Automated unit testing framework |

### Backend & Cloud Functions Technologies
| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `20.x` | Cloud Functions runtime execution engine |
| **Firebase Functions** | `^7.2.5` | Serverless backend API endpoint handler |
| **Firebase Admin** | `^13.10.0` | Privileged database and auth administration |
| **@google/generative-ai** | `^0.24.1` | Official Gemini AI SDK integration |
| **Archiver** | `^8.0.0` | Server-side ZIP stream compression |
| **Pdf-Lib** | `^1.17.1` | Server-side PDF manipulation & watermark stamping |
| **Nodemailer** | `^9.0.3` | SMTP transactional email processing |
| **QRCode** | `^1.5.4` | Server-side QR code rendering |

---

## 4. Subdomain Routing & Multi-Tenant Segregation Architecture

AIVI enforces strict domain-level segregation to prevent data leakage between public consumer users and institutional campus tenants.

```typescript
// src/utils/domainHelper.ts
export const isCampusDomain = (hostname: string): boolean => {
  return hostname.startsWith("campus.") || hostname.includes("campus.staging.aivilabs.com");
};

export const getCampusUrl = (): string => {
  if (typeof window === "undefined") return "https://campus.aivilabs.com";
  return window.location.hostname.includes("staging")
    ? "https://campus.staging.aivilabs.com"
    : "https://campus.aivilabs.com";
};
```

### Domain Routing Rules
1. **`aivilabs.com` / `staging.aivilabs.com`**:
   - Renders `RootDomainRouter` $\rightarrow$ `LandingConceptB.tsx` (B2C Career OS).
   - Renders `GlobalHeader` and `GlobalFooter`.
2. **`campus.aivilabs.com` / `campus.staging.aivilabs.com`**:
   - Renders `RootDomainRouter` $\rightarrow$ `ForCollegesPage.tsx` (B2B Institutional Portal).
   - Renders `CampusHeader` and `CampusFooter`.
   - Legal subpage URLs (`/dpa`, `/privacy`, `/terms`) dynamically mount institutional headers when accessed from `campus.` subdomains via `LegalHeaderFooterWrapper.tsx`.

---

## 5. Frontend Application Architecture & Route Registry

All routes are declared in `src/App.tsx` using React lazy loading and suspense boundaries.

### Public & Marketing Routes (`aivilabs.com`)
- `/`: B2C Landing Page (`LandingConceptB.tsx`)
- `/auth`, `/login`: User Authentication (`Auth.tsx`)
- `/verify-email`: Email Verification (`VerifyEmail.tsx`)
- `/about`: GEO/LLM-Optimized About Page (`AboutConceptB.tsx`)
- `/how-it-works`: Step-by-Step Workflow Guide (`HowItWorksConceptB.tsx`)
- `/what-is-aivi`: Platform Architectural Overview (`WhatIsAiviConceptB.tsx`)
- `/ai-resume-builder`: Resume Intelligence Product Page (`AIResumeBuilderPageConceptB.tsx`)
- `/job-fit-analysis-tool`: Job Fit Product Page (`JobFitAnalysisToolConceptB.tsx`)
- `/career-gap-analysis-ai`: Skill Roadmap Product Page (`CareerGapAnalysisAIConceptB.tsx`)
- `/interview-intelligence`: Vernacular Voice AI Product Page (`InterviewIntelligenceConceptB.tsx`)
- `/promotion-readiness-ai`: Promotion Readiness Product Page (`PromotionReadinessConceptB.tsx`)
- `/portfolio-analyzer-ai`: Portfolio Showcase Product Page (`PortfolioAnalyzerConceptB.tsx`)
- `/ai-resume-builder-for-freshers`: Fresher Resume Guide (`AIResumeBuilderFreshersConceptB.tsx`)
- `/resume-scoring-software`: ATS Checker Guide (`ResumeScoringSoftwareConceptB.tsx`)
- `/linkedin-optimization`: LinkedIn Optimizer Guide (`LinkedInOptimizationPageConceptB.tsx`)
- `/ai-vs-chatgpt-vs-gemini`: Comparison Guide (`AIVsChatGPTVsGeminiConceptB.tsx`)
- `/contact`: Support & Contact Page (`ContactConceptB.tsx`)
- `/privacy`: Privacy Policy — DPDP Aligned (`Privacy.tsx`)
- `/terms`: Terms of Service (`Terms.tsx`)
- `/dpa`: Data Processing Agreement (`DpaPage.tsx`)

### B2C Candidate Dashboard Routes (`/dashboard/*`)
- `/dashboard`: Candidate Dashboard Overview (`DashboardHome.tsx`)
- `/dashboard/builder`: Resume Builder Workspace (`ResumeBuilder.tsx`)
- `/dashboard/resume`: Resume Intelligence Diagnostic (`ResumeIntelligence.tsx`)
- `/dashboard/job-fit`: Job Fit Calculator Tool (`JobFitAnalysis.tsx`)
- `/dashboard/roadmap`: Skill Gap Roadmap (`SkillRoadmap.tsx`)
- `/dashboard/interview`: Vernacular Voice AI Practice (`InterviewPrep.tsx`)
- `/dashboard/promotion`: Promotion Readiness Audit (`PromotionReadiness.tsx`)
- `/dashboard/portfolio`: Portfolio Showcase Audit (`PortfolioAnalyzer.tsx`)
- `/dashboard/linkedin`: LinkedIn Optimizer Workspace (`LinkedInAnalyzer.tsx`)
- `/dashboard/settings`: Account & Entitlements Settings (`SettingsPage.tsx`)

### B2B Campus OS Routes (`/tpo/*` & `/campus/*`)
- `/campus/login`, `/campus/login/:tenantCode`: Branded Institutional SSO Login (`BrandedLogin.tsx`)
- `/tpo`: Campus Portal Home (`CampusDashboard.tsx`)
- `/tpo/students`: Bulk Student Directory (`StudentsDirectory.tsx`)
- `/tpo/import`: Student Import Wizard (`StudentImportWizard.tsx`)
- `/tpo/drives`: Placement Drives & Shortlisting Pipeline (`PlacementDrives.tsx`)
- `/tpo/vault`: Verified Student Resume Vault (`ResumeVault.tsx`)
- `/tpo/interviews`: Institutional AI Interview Prep (`CampusInterviews.tsx`)
- `/tpo/accreditation`: NAAC / NIRF Audit Generator (`AccreditationReports.tsx`)
- `/tpo/billing`: Campus Subscription & Usage Metering (`CampusBilling.tsx`)
- `/tpo/calendar`: Campus Placement Calendar (`CampusCalendar.tsx`)
- `/tpo/audit-logs`: Audit Logging Console (`AuditLogsPage.tsx`)
- `/tpo/admin-console`: Platform Superadmin Console (`PlatformAdminConsole.tsx`)

---

## 6. Design System, Styling Tokens & Component Library

AIVI uses Vanilla CSS tokens combined with Tailwind CSS for rich UI aesthetics.

### Color Palette Tokens
```css
/* Core Color Palette */
--coral-primary: #FF6D4A;
--coral-hover: #FF7A5B;
--teal-primary: #169C8F;
--teal-accent: #24B7A9;
--slate-dark: #0F172A;
--slate-ink: #112031;
--surface-peach: linear-gradient(180deg, #FFFDF8 0%, #FFF4EE 42%, #F4FAF9 100%);
```

### Key UI Features
- **Glassmorphism**: `.glass` utilities with `backdrop-blur-xl` and semi-transparent borders.
- **Top Badges**: Consolidated audience pills (`<AudienceSwitcher />`) and AI Co-Pilot indicators.
- **Micro-Animations**: Framer Motion `fadeUp` transitions and ambient glow orbs.

---

## 7. Firebase Integration & Authentication Architecture

Firebase Auth powers user identity across B2C and B2B tenants.

### Auth Mechanisms
- **Email/Password**: Standard signup and login flows with email verification (`VerifyEmail.tsx`).
- **Google OAuth**: One-click social sign-in via `signInWithPopup(auth, googleProvider)`.
- **Tenant SSO**: Custom claims (`tenantId`, `role: "tpo" | "student" | "admin"`) injected via Cloud Functions upon login.

---

## 8. Firestore Database Schema & Collection Rules

Security rules enforce multi-tenant isolation (`request.auth.token.tenantId == resource.data.tenantId`).

### Major Collections
1. **`users`**: `{ uid, email, displayName, photoURL, createdAt, plan: "free" | "starter" | "pro" }`
2. **`tenants`**: `{ id, slug, name, domain, logoUrl, primaryColor, ssoEnabled, createdAt }`
3. **`students`**: `{ id, tenantId, rollNumber, name, email, department, passoutYear, cgpa, verifiedResumeUrl }`
4. **`placement_drives`**: `{ id, tenantId, companyName, roleTitle, ctc, driveDate, status, shortlistedStudents: [] }`
5. **`resume_vault`**: `{ id, studentId, tenantId, resumeUrl, verifiedAt, verifiedBy, score }`
6. **`accreditation_reports`**: `{ id, tenantId, year, criterion: {}, pdfUrl, generatedAt }`
7. **`ai_usage_logs`**: `{ id, userId, tenantId, feature: "mock_interview" | "resume_rebuild", tokensUsed, costInr, timestamp }`

---

## 9. Cloud Functions Architecture & API Registry

All cloud functions run in `functions/src/index.ts` on Node 20 runtime.

### Primary Callable Cloud Functions
1. **`generateAccreditationReport`**: Computes NAAC/NIRF metrics and generates downloadable audit reports.
2. **`exportResumePackage`**: Streams a zip file of verified student PDF resumes for placement drives using `archiver`.
3. **`startMockInterviewTurn`**: Initializes a Sarvam AI / Gemini voice interview turn.
4. **`answerMockInterviewTurn`**: Evaluates candidate spoken answers against STAR criteria.
5. **`finishMockInterviewTurn`**: Finalizes mock interview turn and records overall scores.
6. **`createRazorpayOrder`**: Generates Razorpay payment orders.
7. **`handleRazorpayWebhook`**: Verifies HMAC-SHA256 signatures and provisions plan entitlements.

---

## 10. AI Engine Integration (Gemini, Sarvam AI & Prompt Pipeline)

AIVI pairs deterministic parsing algorithms with generative AI APIs.

### AI Pipeline
- **Google Gemini SDK (`@google/generative-ai`)**: Used for structured resume bullet rewriting, JD match keyword extraction, and gap identification.
- **Sarvam AI Engine**: Used for low-latency Speech-to-Text (STT) and Text-to-Speech (TTS) in Hindi, Hinglish, and English during Vernacular Voice AI mock interviews.
- **In-Memory Audio Processing**: Voice audio is processed in live memory streams and is **never stored** on disk or database servers.

---

## 11. Payment Gateway Integration (Razorpay Orders & Webhooks)

Razorpay handles subscription and single-purchase payments.

### Payment Execution Flow
1. Client calls `createRazorpayOrder({ planId })` Cloud Function.
2. Backend returns `order_id`, `amount`, `currency`.
3. Client opens Razorpay Checkout modal (`integrate_razorpay_checkout`).
4. Upon payment completion, Razorpay fires `payment.captured` webhook.
5. Cloud Function verifies `x-razorpay-signature` using `crypto.createHmac("sha256", secret)` before granting credits.

---

## 12. Security & Compliance Protocol (DPDP Act 2023 & Security Rules)

AIVI complies with India's **Digital Personal Data Protection (DPDP) Act 2023**.

### Compliance Checklist
- **Data Residency**: All candidate data hosted in Google Cloud Mumbai (`asia-south1`).
- **Explicit Consent**: `DpdpConsentModal.tsx` captures affirmative user consent before processing CV documents.
- **Data Minimization**: Voice audio processed strictly in temporary memory; zero audio files stored on servers.

---

## 13. B2B Multi-Tenant Campus OS Architecture

Allows colleges to manage student placement readiness under their own brand.

### Key Capabilities
- **Branded Login (`BrandedLogin.tsx`)**: Custom colors, logos, and college domain detection.
- **Bulk Import Wizard (`StudentImportWizard.tsx`)**: CSV/Excel bulk upload of student records with validation.

---

## 14. SAML / OIDC Single Sign-On (SSO) Protocol for Partner Colleges

Partner colleges integrate enterprise identity providers (Microsoft Entra ID, Google Workspace SSO, Shibboleth).

```
College IdP ---> SAML 2.0 / OIDC Response ---> Firebase Auth SAML Provider ---> AIVI Campus Claim Token
```

---

## 15. Student Vault & Verified Resume ZIP Exporter Protocol

TPO officers export verified candidate resumes in bulk for company placement drives.

### ZIP Exporter Workflow
1. TPO selects candidate shortlist in `PlacementDrives.tsx`.
2. Invokes `exportResumePackage({ driveId, studentIds })`.
3. Cloud Function retrieves signed Cloud Storage URLs, streams files into `archiver`, and generates a download link.

---

## 16. AI Mock Interview & Vernacular Voice AI Mode

Allows candidates to practice interviews in Hindi, Hinglish, or English.

### Scoring Dimensions
- **STAR Framework Compliance** (Situation, Task, Action, Result)
- **Technical Knowledge Accuracy**
- **Confidence & Speaking Pace**

---

## 17. Placement Drives & Candidate Pipeline Management

TPOs track active campus placement drives across 4 pipeline stages:
`Shortlisted` $\rightarrow$ `Interview Scheduled` $\rightarrow$ `Technical Evaluation` $\rightarrow$ `Offer Extended`

---

## 18. NAAC & NIRF Accreditation Audit Report Generator

Generates institutional compliance metrics for accreditation bodies:
- **NAAC Criterion 5.2.1**: Placement percentage of graduating students.
- **NIRF Metric 3.a**: Higher education and placement progression stats.

---

## 19. Dynamic Legal Shell & Subdomain-Aware Navigation

`LegalHeaderFooterWrapper.tsx` ensures legal subpages (`/dpa`, `/privacy`, `/terms`) render domain-appropriate headers (`CampusHeader` vs `GlobalHeader`).

---

## 20. Plan Entitlements, Monetization & Billing Architecture

- **Free Tier** (`₹0`): Basic resume audit, 1 Job Fit check.
- **Starter Plan** (`₹399`): Full Resume Studio access, 10 Job Fit checks, 2 AI Mock Interviews.
- **Pro Plan** (`₹599`): Unlimited Resume Studio rebuilds, 50 Job Fit checks, Vernacular Voice AI access.

---

## 21. Environmental Configuration & Secrets Management

Configuration parameters are stored in `.env.production` and `.env.staging`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=aivi-career.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aivi-career
VITE_FIREBASE_STORAGE_BUCKET=aivi-career.firebasestorage.app
```

---

## 22. Infrastructure, Hosting & VPS Deployment Protocols

Frontend bundles are hosted on a Hostinger KVM 4 VPS reverse proxy.

### Hostinger VPS Specifications
- **IP Address**: `187.127.134.92`
- **SSH Port**: `22`
- **User**: `root`
- **Authentication**: SSH Public Key (`id_ed25519_aivi.pub`) / Environment Variable `AIVI_VPS_PASSWORD` (Password authentication disabled; plaintext credentials prohibited)
- **Nginx Web Root (Staging)**: `/var/www/aivicampus-staging/html`
- **Nginx Web Root (Production)**: `/var/www/aivicampus-prod/html`

---

## 23. Deployment Safety Protocol & Staging-First Workflow (Rules D1-D6)

### Golden Deployment Rules
- **D1 NEVER DEPLOY AUTOMATICALLY**: Fixing a bug or building a feature does NOT trigger deployment.
- **D2 MCP = READ-ONLY BY DEFAULT**: Server mutations require explicit approval.
- **D3 EVERY CHANGE = COMMIT + PUSH**: Commit with `fix: <what broke>` and push to GitHub.
- **D4 PRODUCTION = PIPELINE ONLY**: Deployment flows through verified scripts.
- **D5 STAGING-FIRST**: Deploy to Staging (`python scripts/deploy_staging.py`) first.
- **D6 PRODUCTION COMMAND**: Deploy to Production ONLY when the user explicitly types `"DEPLOY"` (`python scripts/deploy_production.py`).

---

## 24. Testing & QA Automation (Vitest, Playwright, TestSprite)

- **Unit Testing**: `npm test` runs Vitest test suites.
- **E2E Testing**: Playwright browser automation tests.
- **QA Automation**: TestSprite MCP server integration for frontend test plan execution.

---

## 25. Error Handling, Logging & Observability

- **Sentry / Console Logger**: Captured in client runtime handlers.
- **Cloud Functions Logs**: Viewed via `firebase functions:log`.

---

## 26. Performance Optimization, Caching & Bundle Strategy

- **Code Splitting**: React `lazy()` and `Suspense` for all subpages.
- **Vite Rolldown Optimizer**: Production bundle compiled in ~2.5 seconds.
- **Nginx Cache Control**: Long-lived asset caching with cache-busted filenames.

---

## 27. SEO, Social Previews (Open Graph) & Generative Engine Optimization (GEO)

- **Open Graph Image**: `https://aivilabs.com/og-image.png?v=3` (1200x630 high-converting graphic).
- **JSON-LD Schema**: Embedded `Organization` and `SoftwareApplication` schemas for LLM indexers (ChatGPT, Perplexity, Gemini, Claude).

---

## 28. MCP Server Integrations & Autonomous Tooling Registry

Configured in `C:\Users\abhis\.gemini\config\mcp_config.json`:
- `@modelcontextprotocol/server-memory`: Global Knowledge Graph server.
- `@digitalocean/mcp`, `hostinger-api-mcp`, `@playwright/mcp@latest`, `firebase-tools mcp`, `razorpay-mcp-server`.

---

## 29. Administrative Console & Superadmin Management

Superadmin portal accessible at `/tpo/admin-console` (`PlatformAdminConsole.tsx`) for system health, tenant management, and global usage analytics.

---

## 30. Disaster Recovery, Backup Procedures & Incident Playbook

- **Firestore Daily Exports**: Automated backups stored in Google Cloud Storage.
- **One-Line Rollback Command**:
  `git checkout main; python scripts/deploy_production.py`

---

## 31. Third-Party Services & Sub-processors Directory

1. **Google Cloud Platform / Firebase** (Auth, Firestore, Cloud Storage, Functions)
2. **Google Gemini AI** (LLM Generative Engine)
3. **Sarvam AI** (Voice STT / TTS Engine)
4. **Razorpay Payments** (INR Payment Gateway)
5. **Hostinger VPS** (Nginx Hosting Infrastructure)

---

## 32. Developer Onboarding, Local Setup & Troubleshooting Guide

### Prerequisites
- Node.js `v20.x`
- Python `3.12`

### Quick Start
```bash
git clone https://github.com/abhitriloki/aivi-career.git
cd aivi-career
npm install
npm run dev
```

---

## 33. Future Engineering Roadmap & Enhancement Strategy

- **Mobile Native App (React Native)**
- **Automated Resume Parsing from LinkedIn URLs**
- **AI Mock Interview Video Analysis (Eye Contact & Facial Cue Tracking)**

---

## 34. Milestone & Fix Log

### Recent Milestones & Verified Bug Fixes
- **September 5, 2026 (Live Voice Mock Interview Zero-Speech Abort Guard, CORS Configuration & Resilient Promotion JSON Parsing)**:
  - Fixed false 8.8 Strong Hire evaluation when candidate terminates session without answering questions (`RealtimeVoiceRoom.tsx` & `tenantService.ts`). Removed synthetic mock turn insertion and added candidate speech threshold check (`candidateTurns.length === 0 || totalCandidateWords < 5`) showing an incomplete/aborted session state instead of generating arbitrary scoring dossiers.
  - Added `cors: true` to `startRealtimeVoiceSession` and `evaluateRealtimeVoiceSession` in `functions/src/index.ts` to eliminate browser CORS preflight errors from web origins.
  - Fortified `parseGeminiJson` in `functions/src/index.ts` against LLM syntax defects (unquoted property names, trailing commas, single-quoted keys, markdown code fences, and conversational surrounding text) to resolve AI Error (500) JSON parse crashes.
  - Added resilient high-fidelity client-side fallback in `PromotionReadiness.tsx` to ensure users are never blocked by upstream API or formatting anomalies.
  - Added 3 regression tests in `src/test/b2cIsolation.test.ts` verifying zero-speech abort detection and resilient LLM JSON parsing.
- **August 31, 2026 (Phase P15: Real-Time Gemini 2.0 Live Voice AI Interview Studio)**:
  - Built Real-Time Gemini 2.0 Multimodal Live Audio Engine (<500ms voice turnaround, eliminating Sarvam AI).
  - Integrated 4 Industry Interviewer Personas (Ananya, Vikram, Priya, Kabir) with 1-click audio sample previews.
  - Built 3D Audio-Reactive Fluid Voice Mesh Orb (`VoiceFluidOrb.tsx`) tracking mic volume and pitch frequencies in real time.
  - Built Ambient Dark-Mode Studio Stage (`RealtimeVoiceRoom.tsx`) with floating real-time caption stream ticker and tactile bottom bar.
  - Implemented Gemini 2.5 Pro Post-Interview Forensic Evaluation (`evaluateRealtimeVoiceSession`) generating Question-by-Question Deep Dive (Student Answer vs Identified Flaws vs Senior Staff Engineer Model Answer).
  - Created 1-Click High-Resolution PDF Exporter (`jsPDF` + `html2canvas`), Print-Optimized Layout (`@media print`), and Public Shareable Link.
  - Added backend schemas in `functions/src/security/validators.ts` and callables in `functions/src/index.ts`.
  - Built and verified with 0 TypeScript/Vite errors. Ready for Staging VPS deployment.
- **August 9, 2026**:
  - Fixed hero section CTA alignment to ensure 100% above-the-fold visibility.
  - Shortened vertical section gap padding across landing page (`py-8 sm:py-14`).
  - Fixed `.page-offset` top-padding gap (eliminated 98px white space below header on inner pages).
  - Created 6 dedicated public marketing pages under Product menu.
  - Upgraded all 7 AI Tools pages to AIVI v2 features.
  - GEO / LLM-optimized About page with JSON-LD schema.
  - Updated Open Graph image (`/og-image.png?v=3`) for social sharing.
  - Fixed PromoBanner display on home page.
  - Commit Hash: `a18b9be`
  - Deployed & Verified on Staging (`https://staging.aivilabs.com`) and Production (`https://aivilabs.com`).
