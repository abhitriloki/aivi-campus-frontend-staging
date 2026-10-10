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

- **September 6, 2026 (P0 Security Hardening, Credential Redaction & VPS Key Migration)**:
  - **Exposed Password Redaction**: Conducted deep audit across codebase and active documentation. Redacted plaintext VPS root passwords across all technical documentation (`PROJECT_DOCUMENTATION.md`, `LATEST_TECHNICAL_DOCUMENTATION_*.md`) and deployment automation scripts (`deploy_production.py`, `deploy_aivicampus_prod.py`, `deploy_staging.py`, `deploy_aivicampus_staging.py`).
  - **Zero-Password SSH Deployment**: Upgraded all Python SFTP deploy scripts to authenticate using ed25519 SSH keys (`~/.ssh/id_ed25519_aivi`) with fallback to the `AIVI_VPS_PASSWORD` environment variable, ensuring zero secrets are committed or stored on disk in scripts.
  - **Sarvam AI Hardcoded Fallback API Key Removal**: Removed hardcoded fallback Sarvam AI API subscription key from `functions/src/voice/provider.ts` and compiled runtime bundles (`functions/lib/voice/provider.js`), strictly enforcing `process.env.SARVAM_API_KEY`.
  - **Production Readiness Audit Artifact**: Documented all 18 core architectural, security, and deployment dimensions in `AIVI_CAMPUS_AND_CAREER_OS_FULL_AUDIT_2026-09-06.md`.
- **September 6, 2026 (Firebase Domain Authorization & Full Technical SEO / AIO / AEO Architecture for aivicampus.com)**:
  - **Firebase Auth Domain Authorization**: Programmatically updated Google Cloud Identity Toolkit OAuth configuration via Cloud API (`PATCH /admin/v2/projects/aivi-career/config?updateMask=authorizedDomains`) to register `"aivicampus.com"`, `"www.aivicampus.com"`, `"staging.aivicampus.com"`, `"aivilabs.com"`, `"www.aivilabs.com"`, `"staging.aivilabs.com"`, `"campus.aivilabs.com"`, and `"campus.staging.aivilabs.com"`. Eliminates `auth/unauthorized-domain` errors for email and social sign-in.
  - **Platform Admin Meta Title & Branding Guard**: Resolved issue where Platform Admin Console displayed demo branding ("Sunrise Institute of Technology"). Added `<Helmet>` in `PlatformAdminConsole.tsx` with dedicated title `"Platform Master Console | AIVI Campus Intelligence OS"` and `noindex, nofollow` robot directives. Added route check in `TenantBrandingContext.tsx` preventing `/platform-admin` and `/campus-admin` from inheriting tenant branding names, and strictly guarded `activeTenant` on production domains from resolving to demo or Sunrise fixtures.
  - **Industry-Leading SEO / AIO / AEO Engine (`ForCollegesPage.tsx`)**: Upgraded metadata across `ForCollegesPage.tsx` and `src/pages/campus/ForCollegesPage.tsx` with targeted title (`AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells`), comprehensive description, high-intent keyword density, canonical link (`https://aivicampus.com/`), Open Graph tags, and Twitter Cards (`summary_large_image`).
  - **Machine-Readable Schema.org Graph (AIO / AEO)**: Implemented structured `@graph` containing `SoftwareApplication` & `EducationalApplication` with detailed feature lists and pricing offers, `FAQPage` covering top institutional search intents (for Perplexity, Google SGE, and ChatGPT Search citation), `Organization` entity (`AIVI Intelligence Private Limited`), and `WebSite` entity.
  - **AI Crawler Directives & Dual Sitemaps**: Updated `public/robots.txt` with explicit permissions for `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, and linked both `https://aivicampus.com/sitemap.xml` and `https://aivilabs.com/sitemap.xml`. Appended `aivicampus.com` routes to `public/sitemap.xml`.
  - **Zero-Latency Static SEO Injection on VPS**: Enhanced `deploy_aivicampus_prod.py` and `deploy_aivicampus_staging.py` to automatically inject pre-rendered AIVI Campus title, canonical, and Open Graph tags directly into server `index.html` during deployment, guaranteeing instantaneous metadata indexing for social crawlers and search engine spiders before JS hydration.
  - **Campus Footer Routing & Location Alignment (`CampusFooter.tsx`)**: Replaced legacy `campus.aivilabs.com` external demo URLs in Privacy Policy, Terms of Service, and Data Processing Addendum with React Router `<Link to={l.to}>` bindings (`/privacy`, `/terms`, `/dpa`), keeping visitors within the institutional `aivicampus.com` domain. Corrected corporate location from Bengaluru to Gorakhpur, UP, India (`AIVI Intelligence Private Limited` headquarters) and maintained direct email affordance to `hello@aivilabs.com`.
  - **Book a Demo Form Integration & Bot Suppression (`ForCollegesPage.tsx`)**: Integrated `submitContactForm` Cloud Function into the demo request form, ensuring all institutional demo submissions trigger automated email dispatch to `hello@aivilabs.com` and branded confirmation to the requester, with hidden honeypot validation (`name="website"`) for bot suppression.
  - **Verification**: Vite build successful (0 errors, 2.75s), Vitest test suite verified (no new failures), git diff strictly confined to required SEO, footer, and tenant guard files.
- **September 6, 2026 (For Colleges Redirection Updated to Production Domain aivicampus.com)**:
  - **Redirect Standardization**: Updated all "For Colleges (B2B)" affordances across the B2C consumer application (`GlobalHeader.tsx` desktop and mobile drawer, `AudienceSwitcher.tsx` pill, and `AboutConceptB.tsx`) to link directly to production `https://aivicampus.com` (and `https://staging.aivicampus.com` in staging), replacing legacy redirect targets to `campus.aivilabs.com`.
  - **Verification**: Built cleanly via Vite (2.96s), unit tests passing, zero regression on landing page or consumer paths.
- **September 6, 2026 (BrandedLogin Runtime ReferenceError & Navigation Fix on aivicampus.com)**:
  - **Root Cause Resolution**: Resolved unhandled runtime exception (`ReferenceError: useAuth is not defined at BrandedLogin.tsx:64`) triggered when clicking "TPO & Student Login" from `aivicampus.com`. Added missing `import { useAuth } from "@/contexts/AuthContext";` in `src/pages/campus/BrandedLogin.tsx`.
  - **Verification**: Built clean in Vite (3.08s), committed and pushed to `campus/p14-sso` (commit `2c314f5`), and deployed live to Staging (`https://staging.aivicampus.com`) and Production (`https://aivicampus.com`). Live UI navigation and zero-error console logging verified via Playwright MCP (`browser_navigate` + `browser_click` + `browser_console_messages` + DOM snapshot).
- **September 6, 2026 (Dedicated B2B Domain Routing for aivicampus.com Production & Staging)**:
  - **Root Cause Resolution**: Resolved issue where visiting `https://aivicampus.com` rendered the B2C career landing page. `isCampusDomain` in `src/utils/domainHelper.ts` was updated to explicitly recognize `aivicampus.com`, `www.aivicampus.com`, `staging.aivicampus.com`, and `*.aivicampus.com`.
  - **Domain Segregation**: `aivicampus.com` serves strictly the B2B Campus OS experience (`ForCollegesPage` at `/`, `CampusLayout` across `/campus/*` and `/tpo/*`, and `BrandedLogin` at `/campus/login`). B2C Career consumer tools remain strictly segregated to `aivilabs.com`.
  - **Subdomain Routing**: Partner college subdomains (e.g. `<tenant>.aivicampus.com`) resolve dynamically via `extractSubdomainSlug` and `TenantBrandingContext` to render college-branded login and command center portals.
  - **Regression Test Suite**: Added `src/test/aivicampusDomain.test.ts` with 5 automated unit tests verifying host detection, slug extraction, and B2C vs B2B segregation (all 5 passing).
  - **Deployment**: Both `https://aivicampus.com` (Production) and `https://staging.aivicampus.com` (Staging) deployed via SFTP to VPS `187.127.134.92`, Nginx reloaded, and verified live with HTTP/2 200 OK. Committed to `campus/p14-sso`.
- **September 6, 2026 (Campus Multi-Tenant Data Isolation Across Drives, Vault, Sprints, Interviews & Accreditation)**:
  - **Route Parity for Student Onboarding**: Registered `<Route path="students/import" ... />` alongside `/campus/import` so direct URLs (`https://campus.aivilabs.com/campus/students/import`) never throw 404.
  - **Placement Drives & Auto-Shortlisting Isolation (`PlacementDrives.tsx`)**: Decoupled default Sunrise placement drives. When logged into any custom college tenant (`effectiveTenantId !== "demo-sunrise"`), existing mock records are replaced with a clear empty state inviting the TPO to create their first drive. When a drive is created and auto-shortlisting is executed, the wizard dynamically scans the college's uploaded students (`aivi_demo_students_<tenantId>`), applies CGPA/Branch eligibility filters, generates tenant-scoped applicant records (`DriveApp[]`), and saves them under `aivi_demo_drive_apps_<tenantId>_<driveId>`.
  - **Institutional Resume Vault Isolation (`ResumeVault.tsx`)**: Replaced hardcoded Sunrise sealed records with dynamic binding to uploaded college students or an empty state queue explaining student resume submission. Custom recruiters package downloads dynamically generate manifests for the active college.
  - **AI Interview Lab Forensic Logs Isolation (`CampusInterviews.tsx`)**: Isolated interview practice logs and speech telemetry so newly onboarded colleges do not inherit Sunrise student dossiers. Once students are imported, the dashboard dynamically surfaces telemetry records reflecting the actual enrolled candidate roster.
  - **Sprints & Placement Campaigns Isolation (`CampusPlaceholders.tsx`)**: Decoupled hardcoded TCS/Infosys Sunrise bootcamps. Custom colleges store and manage independent prep campaigns (`aivi_demo_sprints_<tenantId>`), auto-enrolling their active student count.
  - **NAAC Criterion 5 & NIRF Outcomes Isolation (`AccreditationReports.tsx`)**: Replaced 2,400 static student metrics with dynamic calculation derived in real time from the tenant's uploaded student roster (placed percentage, branch breakdown, missing data health, and automated official DCS PDF/CSV generation). Export history is cleanly isolated per tenant.
  - **Deployment**: Verified through Vitest and production Vite build (clean in 2.94s). Committed to `campus/p14-sso` (commit `432ea1f`) and deployed live to Production VPS (`https://campus.aivilabs.com`) and Staging VPS.
- **September 6, 2026 (Dynamic Tenant Onboarding, Branded Login Binding & Student CSV Persistence)**:
  - **Dynamic Tenant Context & Branded Login Binding**: Enhanced `BrandedLogin.tsx`, `AuthContext.tsx`, and `TenantBrandingContext.tsx` so newly created colleges (from `/platform-admin`) are immediately recognized at `/campus/login/:tenantCode`. Dynamic institutional email label (`@<code-or-domain>`), custom TPO login credentials, and college name/branding dynamically hydrate the command center without falling back to Sunrise defaults.
  - **TPO Admin vs Student Classification**: Fixed classification logic in `performLogin` where emails containing common substrings were mistakenly tagged as students instead of tenant administrators.
  - **Full Student Onboarding Flow & Isolation**: Enhanced `StudentImportWizard.tsx` (`handleExecuteLiveImport`) to parse uploaded CSV rosters into validated student records and persist them under tenant-isolated local storage (`aivi_demo_students_<tenantId>`). Updated `StudentsDirectory.tsx` to read the active college's imported roster, display real student records with search/filters, and dispatch real-time refresh events across browser contexts.
  - **Unit Regression Tests**: Added `src/test/dynamicTenantOnboarding.test.ts` verifying custom tenant branding resolution, tenant list merging, and CSV row schema conformity (3/3 tests passing).
  - **Deployment**: Committed to `campus/p14-sso` and deployed live to Production VPS (`https://campus.aivilabs.com`, `https://aivilabs.com`) and Staging VPS (`https://staging.aivilabs.com`).
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
- **September 7, 2026 (Campus OS Staging Isolation Hardening & Multi-Tenant Rollup Isolation)**:
  - **Redundant Branded Login Link Removal (`CampusLayout.tsx`)**: Removed unneeded "Open branded login" menu item from the authenticated user profile dropdown to prevent unnecessary redirects to login when already authenticated.
  - **Custom Tenant Stats Isolation (`CampusDashboard.tsx`)**: Decoupled default Sunrise mock telemetry (`DEFAULT_DEMO_ROLLUP`, 240 students, 3 active drives, and hardcoded "Morning, Dr. Verma 👋") from custom provisioned institutions. Introduced `EMPTY_TENANT_ROLLUP` with clean zero-counts for newly onboarded colleges, dynamic user greeting (`Welcome, <FirstName> 👋` via `useAuth() { user, tenant }`), contextual delta badges, and empty-state roster prompts guiding TPOs to upload their student cohort.
  - **Staff Management Coordinator Guidance (`StaffManagement.tsx`)**: Enhanced the "Invite Placement Coordinator" modal with explicit onboarding instructions informing TPOs that invited coordinators can log in either via "Sign in with Google Workspace" using their institutional email or by clicking "Forgot Password" on the login page to set their password.
  - **Header Action Streamlining (`CampusHeader.tsx`)**: Replaced the verbose "TPO & Student Login" desktop and mobile buttons with a clean "Sign In" CTA. This unifies access across TPO Directors, Placement Coordinators, Department CSC Staff, and Students without cluttering the navbar, preserving "Book a Demo" as the primary enterprise sales action.
  - **Student DPDP Consent Modal Integration (`CampusLayout.tsx` & `ResumeIntelligence.tsx`)**:
    - Mounted `<DpdpConsentModal>` directly in `CampusLayout.tsx` with automated Firestore consent check (`profiles/{uid}.dpdpConsent`) on login for institutional students.
    - Added window event listener for `"open-dpdp-modal"`, enabling child pages to trigger the DPDP consent modal on demand.
    - In `ResumeIntelligence.tsx`, caught `DPDP consent required before running AI analysis` errors during resume drafting/analysis and immediately dispatched `open-dpdp-modal` with user guidance toast to review and accept the DPDP Act 2023 consent notice without crashing or freezing.
  - **September 7, 2026 (Staging Session Persistence Across Refresh & Nanosecond Auth Bounce Fix)**:
    - **Auth Listener Decoupling from Route Changes (`AuthContext.tsx`)**: Removed `[location.pathname]` dependency from `AuthContext`'s `useEffect`. Tied `initAuth()` to component mount `[]`, eliminating listener teardown and re-subscription on every route transition.
    - **Safe Active Role Preservation on Staging**: Removed unconditional `localStorage.removeItem("aivi_active_role")` execution on `isProd` during route changes, preserving institutional student and TPO director sessions across page reloads.
    - **Firestore Profile Affiliation Fallback (`AuthContext.tsx` & `BrandedLogin.tsx`)**: Added fallback query to `profiles/{uid}` alongside `user_roles/{uid}`. If token claims are pending or delayed upon login or page refresh, student role and institutional `tenantId` are accurately hydrated directly from the verified Firestore profile document.
  - **September 7, 2026 (Resume Intelligence Cross-Account Report Isolation & Session Memory Cleanup)**:
    - **Root Cause**: `runAnalysis` and `saveAnalysisResult` in `src/services/analysisService.ts` cached reports to `localStorage` under an unscoped global key (`aivi_local_history_${analysisType}`). When Student 1 ran an analysis, logged out, and Student 2 logged in on the same machine, Student 2 had no analyses in Firestore (`snap.empty === true`). `getLatestAnalysis` fell back to the unscoped key and returned Student 1's report to Student 2.
    - **User-Scoped Analysis Caching (`analysisService.ts`)**: Scoped all local fallback caching strictly by authenticated user ID (`aivi_local_history_${userId}_${analysisType}`). In `getLatestAnalysis` and `getAnalysisHistory`, purged any legacy unscoped keys and restricted fallbacks strictly to the requesting user's UID. Switched `collection(db, ...)` queries to `getDb()` to guarantee unproxied, `instanceof Firestore`-compliant execution.
    - **Session Logout Hygiene (`AuthContext.tsx`)**: Enhanced `signOut` to purge all cached resume texts (`aivi_user_resume_text*`), latest analysis blobs, and local history caches from `localStorage` and `sessionStorage`, guaranteeing no residual student data leaks across successive logins on shared campus terminals.
    - **Unit Regression Tests**: Added test in `src/test/resumeIntelligenceReport.test.tsx` verifying that logging in as a second student with no analyses renders the upload mode and never leaks the first student's report (16/16 tests passing in suite, 183 total tests across 24 files passing).
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

