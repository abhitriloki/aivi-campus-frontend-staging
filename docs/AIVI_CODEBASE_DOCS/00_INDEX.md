# Chapter 00 — Codebase Index & Master Repository Map
**Document Version:** 2.5.0  
**Date:** 2026-07-23  
**Source Baseline:** Codebase Commit State (`codex/security-phase-1-containment`) [package.json], [functions/package.json]

---

## 1. How to Read These Documentation Chapters
This documentation suite was written to serve as the **single source of truth** for human solution architects, lead engineers, security auditors, and AI agents. It describes the entire **AIVI Career Intelligence OS & Multi-Tenant Campus OS** codebase with zero dependence on reading source files directly.

Every statement in these documents is backed by authoritative source file references enclosed in brackets, e.g., `[src/App.tsx]` or `[functions/src/index.ts]`. Where discrepancy or drift exists between legacy markdown documentation and executable code, the code strictly takes precedence and is flagged with `⚠️[DOC-DRIFT: ...]`. Where code paths are unconfigured or ambiguous, they are flagged with `⚠️[UNCERTAIN: ...]`. Mismatches between security rules and frontend components are marked `⚠️[RULES-DRIFT: ...]`.

---

## 2. Master Repository Directory Map

Below is the top-level and major sub-directory inventory of the repository, including each directory's 1-line technical purpose:

| Directory Path | Purpose / Technical Responsibility |
| :--- | :--- |
| `/.firebase/` | Firebase local CLI deployment caches and hosting state [`.firebase/hosting.ZGlzdA.cache`] |
| `/docs/` | Historical design specifications, security runbooks, phase reports, and master documentation |
| `/docs/AIVI_CODEBASE_DOCS/` | **[THIS DIRECTORY]** Complete, exhaustive 13-chapter factual documentation set |
| `/docs/images/` | Visual product screenshots and verification walkthrough captures |
| `/docs/security/` | Security audit reports, secret rotation runbooks, and launch security checklists |
| `/functions/` | Firebase Cloud Functions v2 backend environment (Node.js 20 TypeScript workspace) |
| `/functions/lib/` | Compiled JavaScript output directory for Firebase Cloud Functions runtime [`functions/tsconfig.json`] |
| `/functions/src/` | TypeScript source code for Cloud Functions callable APIs, triggers, and scheduled crons [`functions/src/index.ts`] |
| `/functions/src/billing/` | Campus institutional pricing tiers, plan schemas, and billing logic [`functions/src/billing/plans.ts`] |
| `/functions/src/payments/` | Razorpay payment order creation, webhook verification, and HMAC signature math [`functions/src/payments/razorpay.ts`] |
| `/functions/src/privacy/` | GDPR/DPDP compliant account deletion and cascading record purging logic [`functions/src/privacy/deleteAccount.ts`] |
| `/functions/src/security/` | Backend security guards: Auth role validators, AI input sanitization, rate limiters, errors [`functions/src/security/auth.ts`] |
| `/functions/src/voice/` | Multi-lingual TTS/STT provider integrations for Bhashini and Google Speech [`functions/src/voice/provider.ts`] |
| `/pitch-prep/` | Investor Q&A generators and pitch deck supporting files |
| `/public/` | Static web assets, branding SVGs, SEO robots.txt, sitemap.xml, and Apache Hostinger `.htaccess` [`public/.htaccess`] |
| `/public/brand/` | Official AIVI app logos, marks, dark/light SVG variants, and favicons |
| `/scripts/` | Maintenance, backfill, security verification, live admin tools, and firestore backup drill CJS scripts |
| `/security/` | Security audit trackers, fix plans, and spreadsheet trackers |
| `/src/` | Frontend Single Page Application (SPA) source code built with React 18, Vite 8, and TailwindCSS |
| `/src/ai/prompts/` | Client-side prompt templates and prompt helper constants [`src/ai/prompts/index.ts`] |
| `/src/assets/` | High-resolution background graphics and static image assets |
| `/src/components/` | Shared UI components, navigation headers, footers, route guards, banners, and modals |
| `/src/components/campus/` | Institutional multi-tenant components (Campus Leaderboard, Demo tools card, Radix wrappers) |
| `/src/components/resume/` | File upload forms and drag-and-drop resume ingestion components [`src/components/resume/ResumeUploadForm.tsx`] |
| `/src/components/ui/` | Radix UI primitives styled with TailwindCSS and `class-variance-authority` (Shadcn UI) |
| `/src/config/` | Master application configurations, feature flags, campus kill-switches, and scoring parameters [`src/config/campusConfig.ts`] |
| `/src/contexts/` | React Context providers for Auth state, tenant branding, custom claims, and theme management [`src/contexts/AuthContext.tsx`] |
| `/src/hooks/` | Custom React hooks for viewport detection (`use-mobile`) and toast notifications (`use-toast`) |
| `/src/integrations/firebase/` | Firebase SDK client initialization, auth persistence setup, and emulator wiring [`src/integrations/firebase/client.ts`] |
| `/src/layouts/` | Page layout wrappers (`DashboardLayout`, `CampusLayout`) providing sidebars, breadcrumbs, and headers |
| `/src/pages/` | Application pages for public marketing, SEO landing, B2C SaaS dashboard, and B2B campus OS |
| `/src/pages/campus/` | Institutional B2B portal pages (Placement Drives, Student Directory, Accreditation, Resume Vault) |
| `/src/services/` | API abstraction services wrapping Firebase `httpsCallable` functions and Firestore queries [`src/services/analysisService.ts`] |
| `/src/test/` | Unit, integration, CSP, contrast guard, and tenant phase test suites [`vitest.config.ts`] |
| `/src/utils/` | Utility functions for CSS class merging (`clsx`), PDF parsing, CSV export, and job fit scoring |
| `/testing-kit/` | Founder product briefs, intern teaching scripts, and QA testing trackers |

---

## 3. Complete Tech Stack & Dependency Inventory

### 3.1 SPA Frontend Stack [`package.json`]
* **Core Framework:** React v18.3.1 (`react`, `react-dom`)
* **Build Tool & Bundler:** Vite v8.0.14 (`@vitejs/plugin-react-swc` v4.3.1)
* **Language & Type System:** TypeScript v5.8.3
* **Routing:** React Router DOM v6.30.1 (`react-router-dom`)
* **State & Server Query Management:** TanStack React Query v5.83.0 (`@tanstack/react-query`)
* **Styling & Design System:** TailwindCSS v3.4.17 (`autoprefixer` v10.4.21, `postcss` v8.5.6, `@tailwindcss/typography` v0.5.16)
* **Component Primitives:** Radix UI (`@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, etc.)
* **Iconography & Motion:** Lucide React v0.462.0 (`lucide-react`), Framer Motion v12.34.0 (`framer-motion`)
* **Form & Validation:** React Hook Form v7.61.1 (`react-hook-form`), Zod v3.25.76 (`zod`), Hookform Resolvers v3.10.0 (`@hookform/resolvers`)
* **Client Database & Auth:** Firebase Web SDK v12.14.0 (`firebase`)
* **Data Visualization & Export:** Recharts v2.15.4 (`recharts`), jsPDF v4.2.1 (`jspdf`), Docx v9.6.1 (`docx`)
* **Notification Systems:** Sonner v1.7.4 (`sonner`), Radix Toast (`@radix-ui/react-toast`)
* **SEO & Head Management:** React Helmet Async v2.0.5 (`react-helmet-async`)
* **Unit Testing:** Vitest v4.1.7 (`vitest`), Testing Library React v16.0.0 (`@testing-library/react`), JSDOM v20.0.3 (`jsdom`)

### 3.2 Backend Cloud Functions Stack [`functions/package.json`]
* **Runtime Engine:** Node.js 20 LTS (`"engines": { "node": "20" }`)
* **Server Framework:** Firebase Admin SDK v13.10.0 (`firebase-admin`), Firebase Functions v2 SDK v7.2.5 (`firebase-functions`)
* **Language:** TypeScript v5.3.3 (`tsc`)
* **AI Provider SDK:** Google Generative AI SDK v0.24.1 (`@google/generative-ai`)
* **PDF & Media Processing:** PDF-Lib v1.17.1 (`pdf-lib`), QRCode v1.5.4 (`qrcode`), Archiver v8.0.0 (`archiver`)
* **Email Provider:** Nodemailer v8.0.1 (`nodemailer`)
* **Validation:** Zod v4.4.3 (`zod`)
* **Override Dependencies:** `uuid` v11.1.1 (`"overrides": { "uuid": "^11.1.1" }`)

---

## 4. Master Script & Command Inventory

All package management, build, test, and deployment scripts defined across root `package.json` and `functions/package.json` are listed below:

| Context | Command Script | Command String | Purpose |
| :--- | :--- | :--- | :--- |
| Root | `npm run dev` | `vite` | Launch local Vite development server with HMR |
| Root | `npm run build` | `vite build` | Compile production SPA bundle into `/dist` directory |
| Root | `npm run build:staging` | `vite build --mode staging` | Compile staging SPA bundle using `.env.staging` variables |
| Root | `npm run build:dev` | `vite build --mode development` | Compile dev SPA bundle |
| Root | `npm run lint` | `eslint .` | Execute ESLint code formatting and rule checks |
| Root | `npm run preview` | `vite preview` | Locally serve compiled production `/dist` bundle |
| Root | `npm run security:verify` | `node scripts/securityVerify.cjs` | Run automated security verification audit against codebase |
| Root | `npm run security:audit` | `npm audit --audit-level=high && npm --prefix functions audit --audit-level=high` | Perform dependency vulnerability security scan |
| Root | `npm run test` | `vitest run` | Execute unit and integration test suite once |
| Root | `npm run test:watch` | `vitest` | Execute Vitest runner in interactive watch mode |
| Functions | `npm --prefix functions run build` | `tsc` | Compile backend TypeScript code into `functions/lib` |
| Functions | `npm --prefix functions run build:watch` | `tsc --watch` | Watch backend TypeScript source and auto-compile |
| Functions | `npm --prefix functions run serve` | `npm run build && firebase emulators:start --only functions` | Build and start local Firebase Functions emulator |
| Functions | `npm --prefix functions run shell` | `npm run build && firebase functions:shell` | Launch interactive REPL shell for Cloud Functions |
| Functions | `npm --prefix functions run start` | `npm run shell` | Alias for functions REPL shell |
| Functions | `npm --prefix functions run deploy` | `firebase deploy --only functions` | Deploy Cloud Functions backend to Firebase production |
| Functions | `npm --prefix functions run logs` | `firebase functions:log` | Tail live Google Cloud / Firebase execution logs |

---

## 5. Summary of the 13 Documentation Chapters

1. **Chapter 00 — INDEX.md:** Master repo directory map, complete tech stack versions, NPM script inventory, and document index.
2. **Chapter 01 — ARCHITECTURE.md:** End-to-end system architecture, SPA ↔ Firebase ↔ Cloud Functions ↔ External API flows, hosting setup (`.htaccess`, `firebase.json`), environments (staging vs production), and `/src` ASCII module map.
3. **Chapter 02 — ROUTE_MAP_COMPLETE.md:** Master table of all 50+ frontend routes, guards, wrappers, purposes, key actions, parameters, redirects, 404 handling, and auth-action handler routes.
4. **Chapter 03 — USER_FLOWS_STEP_BY_STEP.md:** Step-by-step click-level user journeys for Auth, B2C Core Modules, B2C Payments, Contact Forms, and B2B Institutional Campus OS, ending with known failure points.
5. **Chapter 04 — DATABASE_DESIGN.md:** Exhaustive specification of all 32 Firestore collections, subcollections, fields, data types, validators, Firestore security indexes, Storage bucket paths, and document shapes.
6. **Chapter 05 — AUTH_ROLES_ACCESS.md:** Authentication architecture, session persistence, multi-tenant custom claims model (`role`, `tenantId`, `branchScope`), platform admin bootstrap, and RBAC capability matrix.
7. **Chapter 06 — CLOUD_FUNCTIONS.md:** Comprehensive reference for all 78 Cloud Functions exported in `functions/src/index.ts` detailing triggers, auth requirements, Zod schemas, step execution, and error states.
8. **Chapter 07 — PAYMENTS_RAZORPAY.md:** Razorpay billing architecture, pricing catalog (INR paise), order creation, public key injection, webhook HMAC signature verification, entitlement updates, and refund policies.
9. **Chapter 08 — ERROR_STATES_MESSAGES.md:** Master Catalogue of 50+ user-visible error strings, trigger conditions, screen locations, and a 20-scenario "Symptom -> Probable Cause -> Checks" QA diagnostic guide.
10. **Chapter 09 — CONFIG_FLAGS_ENVIRONMENTS.md:** Feature flags (`CAMPUS_ENABLED`, `MODULE_FLAGS`), environment variables inventory (names only), secrets manifest, staging vs production differences.
11. **Chapter 10 — SECURITY_RULES_PLAIN.md:** Plain-English translation of `firestore.rules` and `storage.rules` into role-by-role CRUD permissions matrices, highlighting any `⚠️[RULES-DRIFT]`.
12. **Chapter 11 — TEST_DATA_ACCOUNTS.md:** Tester guide detailing seeded demo campus (`demo-sunrise`), staff and student test accounts, seeder commands, test payment credentials, and production safety rules.
13. **Chapter 12 — QA_READY_SUMMARY.md:** Condensed design input chapter containing the Master Test Index, screen state inventory (loading/empty/error/success), top-20 bug checklist, and role coverage matrix.
