# Chapter 02 — Complete SPA Route Map & Guard Specification
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Application Routing Manifest [`src/App.tsx`], Route Guard Components [`src/components/ProtectedRoute.tsx`], [`src/components/AdminRoute.tsx`], [`src/components/TenantRoute.tsx`], [`src/components/CampusRoute.tsx`]

---

## 1. Master Route Map Table (Exhaustive Enumeration of All 52 SPA Routes)

The table below enumerates **EVERY** accessible path within the Single Page Application (SPA), including public marketing pages, B2C SaaS dashboard tools, institutional B2B campus OS routes, platform admin consoles, and Programmatic SEO pages [`src/App.tsx`]:

| # | Path | Page Component File | Access Guard | Layout / Wrapper Used | Primary Purpose | Key User Actions | Redirect on Guard Failure | Parameters |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `/` | `Landing.tsx` | Public | None | Main product landing page | Explore features, view pricing, click sign-in / signup | N/A | None |
| 2 | `/auth` | `Auth.tsx` | Public | `AuthShell.tsx` | Unified login & registration interface | Email/Password login, Signup, Google OAuth, Toggle modes | Redirect to `/dashboard` if authenticated | None |
| 3 | `/login` | `Auth.tsx` | Public | `AuthShell.tsx` | Alias for `/auth` | Email/Password login, Signup, Google OAuth | Redirect to `/dashboard` if authenticated | None |
| 4 | `/verify-email` | `VerifyEmail.tsx` | Public (Auth required to resend) | None | Email verification landing & status check | Resend verification email, check verification state | Redirect to `/login` if unauthenticated | None |
| 5 | `/about` | `About.tsx` | Public | `PublicPageShell.tsx` | Company background & mission statement | View team info, mission, technology overview | N/A | None |
| 6 | `/how-it-works` | `HowItWorks.tsx` | Public | `PublicPageShell.tsx` | Detailed explanation of AI analysis pipeline | Read methodology, view feature summaries | N/A | None |
| 7 | `/what-is-aivi` | `WhatIsAivi.tsx` | Public | `PublicPageShell.tsx` | Conceptual overview of Career Intelligence OS | View core metrics, benefits, comparison | N/A | None |
| 8 | `/ai-resume-builder` | `AIResumeBuilderPage.tsx` | Public | `PublicPageShell.tsx` | Public landing for Resume Builder tool | View templates, CTA to build resume | N/A | None |
| 9 | `/linkedin-optimization` | `LinkedInOptimizationPageConceptB.tsx` | Public | `PublicPageShell.tsx` | Public landing for LinkedIn Analyzer | View optimization steps, CTA to analyze profile | N/A | None |
| 10 | `/contact` | `Contact.tsx` | Public | `PublicPageShell.tsx` | Contact & sales inquiry form | Submit contact inquiry, send message | N/A | None |
| 11 | `/privacy` | `Privacy.tsx` | Public | `PublicPageShell.tsx` | GDPR & DPDP privacy policy | Read privacy rights, data retention policy | N/A | None |
| 12 | `/terms` | `Terms.tsx` | Public | `PublicPageShell.tsx` | Terms of Service agreement | Read terms, usage conditions, billing rules | N/A | None |
| 13 | `/campus/login` | `BrandedLogin.tsx` | Public | None | Institutional branded login portal | Enter tenant code, authenticate as campus user | Redirect to `/campus` if authenticated with tenant | None |
| 14 | `/campus/login/:tenantCode` | `BrandedLogin.tsx` | Public | None | Tenant-specific branded login portal | Load tenant logo/colors, authenticate campus user | Redirect to `/campus` if authenticated with tenant | `tenantCode` |
| 15 | `/ai-resume-builder-for-freshers` | `AIResumeBuilderFreshersConceptB.tsx` | Public | `PublicPageShell.tsx` | SEO Programmatic page for freshers | Read fresher resume guide, CTA to sign up | N/A | None |
| 16 | `/resume-scoring-software` | `ResumeScoringSoftware.tsx` | Public | `PublicPageShell.tsx` | SEO Programmatic page for ATS scoring | Compare scoring tools, CTA to analyze | N/A | None |
| 17 | `/job-fit-analysis-tool` | `JobFitAnalysisTool.tsx` | Public | `PublicPageShell.tsx` | SEO Programmatic page for Job Fit | Read job matching guide, CTA to test fit | N/A | None |
| 18 | `/career-gap-analysis-ai` | `CareerGapAnalysisAIConceptB.tsx` | Public | `PublicPageShell.tsx` | SEO Programmatic page for Career Gaps | Read career gap guide, CTA to analyze | N/A | None |
| 19 | `/ai-vs-chatgpt-vs-gemini` | `AIVsChatGPTVsGeminiConceptB.tsx` | Public | `PublicPageShell.tsx` | SEO Programmatic page comparing LLMs | Read LLM comparison benchmark, CTA | N/A | None |
| 20 | `/dashboard` | `DashboardHome.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | B2C SaaS main user dashboard | View recent analyses, usage limits, plan status | Redirect to `/auth` or `/verify-email` | None |
| 21 | `/dashboard/resume` | `ResumeIntelligence.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | Resume Intelligence scoring tool | Upload resume PDF/text, run analysis, view scores | Redirect to `/auth` or `/verify-email` | None |
| 22 | `/dashboard/job-fit` | `JobFitAnalysis.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | Job Fit Analysis tool | Paste JD + Resume, run match, view gap breakdown | Redirect to `/auth` or `/verify-email` | None |
| 23 | `/dashboard/roadmap` | `SkillRoadmap.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | Personal Skill Roadmap generator | Select target role/skills, view 30/60/90 day plan | Redirect to `/auth` or `/verify-email` | None |
| 24 | `/dashboard/interview` | `InterviewPrep.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | AI Interview Preparation question bank | Select category, generate questions, practice answers | Redirect to `/auth` or `/verify-email` | None |
| 25 | `/dashboard/promotion` | `PromotionReadiness.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | Promotion Readiness evaluator | Input current & target role, view readiness score | Redirect to `/auth` or `/verify-email` | None |
| 26 | `/dashboard/portfolio` | `PortfolioAnalyzer.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | Portfolio project evaluator | Input project details/links, analyze depth & quality | Redirect to `/auth` or `/verify-email` | None |
| 27 | `/dashboard/linkedin` | `LinkedInAnalyzer.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | LinkedIn Profile Analyzer & Optimizer | Paste profile text, run SSI check, generate rewrite | Redirect to `/auth` or `/verify-email` | None |
| 28 | `/dashboard/drives` | `StudentDrivesPage.tsx` | Auth-only + Email Verified (Student) | `DashboardLayout.tsx` | Student placement drive dashboard | View active drives, apply for drive, check status | Redirect to `/auth` or `/verify-email` | None |
| 29 | `/dashboard/vault` | `StudentVaultPage.tsx` | Auth-only + Email Verified (Student) | `DashboardLayout.tsx` | Student resume vault portal | Upload resume to vault, request verification, download | Redirect to `/auth` or `/verify-email` | None |
| 30 | `/dashboard/settings` | `SettingsPage.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | User profile & subscription settings | Update profile, view plan details, delete account | Redirect to `/auth` or `/verify-email` | None |
| 31 | `/dashboard/admin` | `AdminDashboard.tsx` | Platform Admin Only | `DashboardLayout.tsx` | B2C Platform Admin Management | View system stats, update user plans, view events | Redirect to `/dashboard` if not platform admin | None |
| 32 | `/dashboard/builder` | `ResumeBuilder.tsx` | Auth-only + Email Verified | `DashboardLayout.tsx` | ATS Resume Rebuilder & Editor | Input profile details, auto-fill AI rewrite, export PDF | Redirect to `/auth` or `/verify-email` | None |
| 33 | `/campus` | `CampusDashboard.tsx` | Tenant Role (`tenant_admin`/`coordinator`/`student`) | `CampusLayout.tsx` | Institutional TPO command center | View campus analytics, AES scores, quick action cards | Redirect to `/campus/login` or `/dashboard` | None |
| 34 | `/campus/students` | `StudentsDirectory.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Student directory & roster manager | Filter by branch/batch, view student AES, nudge student | Redirect to `/campus` if unauthorized | None |
| 35 | `/campus/import` | `StudentImportWizard.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Bulk CSV student import wizard | Upload CSV file, map columns, execute import job | Redirect to `/campus` if unauthorized | None |
| 36 | `/campus/history` | `ImportHistory.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Historical CSV import log | View past import jobs, check errors, view row counts | Redirect to `/campus` if unauthorized | None |
| 37 | `/campus/drives` | `PlacementDrives.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Campus placement drive manager | Create drive, parse JD, compute shortlist, publish | Redirect to `/campus` if unauthorized | None |
| 38 | `/campus/sprints` | `PlacementSprints.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Placement prep sprint manager | Generate drive sprint, assign tasks, track progress | Redirect to `/campus` if unauthorized | None |
| 39 | `/campus/vault` | `ResumeVault.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Campus resume vault & verification | Review student resumes, verify resume, request changes | Redirect to `/campus` if unauthorized | None |
| 40 | `/campus/interviews` | `CampusInterviews.tsx` | Tenant Staff / Student | `CampusLayout.tsx` | Vernacular AI mock interview center | Start mock interview, select language, review scores | Redirect to `/campus` if unauthorized | None |
| 41 | `/campus/accreditation` | `AccreditationReports.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | NAAC/NIRF accreditation report export | Generate NAAC report job, export state readiness CSV | Redirect to `/campus` if unauthorized | None |
| 42 | `/campus/billing` | `CampusBilling.tsx` | Tenant Admin (`tenant_admin`) | `CampusLayout.tsx` | Institutional seat & invoice manager | View seat usage, view invoices, upgrade seat tier | Redirect to `/campus` if unauthorized | None |
| 43 | `/campus/calendar` | `CampusCalendar.tsx` | Tenant Staff / Student | `CampusLayout.tsx` | Campus placement & drive calendar | View scheduled drives, export ICS calendar files | Redirect to `/campus` if unauthorized | None |
| 44 | `/campus/audit-logs` | `AuditLogsPage.tsx` | Tenant Staff (`tenant_admin`/`coordinator`) | `CampusLayout.tsx` | Institutional security audit logs | View system access logs, filter by user/action, export | Redirect to `/campus` if unauthorized | None |
| 45 | `/campus/staff` | `StaffManagement.tsx` | Tenant Admin (`tenant_admin`) | `CampusLayout.tsx` | Campus staff & coordinator manager | Invite coordinator, assign branchScope, deactivate staff | Redirect to `/campus` if unauthorized | None |
| 46 | `/campus/settings` | `TenantSettingsPage.tsx` | Tenant Admin (`tenant_admin`) | `CampusLayout.tsx` | Tenant branding & policy settings | Update primary/accent color, upload logo, set headline | Redirect to `/campus` if unauthorized | None |
| 47 | `/campus-admin` | `PlatformAdminConsole.tsx` | Platform Admin Only | None | Institutional platform admin console | Provision new tenant, update plan/seats, seed demo | Redirect to `/dashboard` if not platform admin | None |
| 48 | `/platform-admin` | `PlatformAdminConsole.tsx` | Platform Admin Only | None | Alias for `/campus-admin` | Provision tenant, toggle status, manage institutional API | Redirect to `/dashboard` if not platform admin | None |
| 49 | `/dpa` | `DpaPage.tsx` | Public | `PublicPageShell.tsx` | Data Processing Addendum (DPDP compliance) | Review institutional data processing terms | N/A | None |
| 50 | `/for-colleges` | `ForCollegesPage.tsx` | Public | `PublicPageShell.tsx` | B2B Institutional landing page | View college features, request institutional demo | N/A | None |
| 51 | `/__/auth/action` | Managed by Firebase / `.htaccess` | Public | None | Firebase auth action callback target | Handle email verification & password reset links | Redirects 302 to Firebase domain | `mode`, `oobCode` |
| 52 | `*` | `NotFound.tsx` | Public | None | 404 Catch-All error page | Display 404 alert, provide button to return home | N/A | Wildcard |

---

## 2. Special Routing Behaviors & Guard Architecture

### 2.1 404 Catch-All Behavior
Any non-matching route path triggers the wildcard `<Route path="*" element={<NotFound />} />` [`src/App.tsx`]. `NotFound.tsx` renders a branded 404 view displaying `"Page Not Found"`, explaining that the requested resource does not exist or has moved, and providing an explicit primary CTA button directing the user back to `/` or `/dashboard`.

### 2.2 Auth Action Routes (`/__/auth/action`)
Standard Firebase Auth action handlers (email verification confirmation, password reset confirmation, and email sign-in link processing) land on the Firebase hosting auth handler URL [`public/.htaccess`].
* **Apache Rewrite Interception:** Requests directed to `http://<custom-domain>/__/auth/action` are HTTP 302 redirected via `.htaccess` to `https://aivi-career.firebaseapp.com/__/auth/action$1` [`public/.htaccess`].
* **Custom SPA Verification Handler (`/verify-email`):** When a user triggers an email verification check in the SPA, `VerifyEmail.tsx` polls `user.reload()` and checks `user.emailVerified`. Once verified, the page automatically refreshes tenant claims via `refreshTenantContext()` and redirects the user to `/dashboard` [`src/pages/VerifyEmail.tsx`].

### 2.3 Code-Splitting & Lazy Loading Strategy
To optimize initial bundle size and page load speed, all non-landing routes in `App.tsx` are code-split using `React.lazy()` and wrapped in a single top-level `<Suspense fallback={<PageLoader />}>` boundary [`src/App.tsx`]:
* **Eagerly Loaded Component:** `Landing.tsx` is imported synchronously to ensure instantaneous First Contentful Paint (FCP) for public visitors [`src/App.tsx`].
* **Lazy Loaded Components:** All SaaS dashboard tools, SEO landing pages, institutional campus pages, and admin consoles are lazy-loaded via dynamic ES module imports, e.g., `const ResumeIntelligence = lazy(() => import("./pages/ResumeIntelligence"))` [`src/App.tsx`].
* **Placeholder Lazy Loaders:** `PlacementSprints` and `TenantSettingsPage` are loaded lazily from the modular component export `CampusPlaceholders.tsx` [`src/App.tsx`].
