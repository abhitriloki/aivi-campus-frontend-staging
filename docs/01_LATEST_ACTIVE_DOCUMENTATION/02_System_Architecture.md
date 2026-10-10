# AIVI Career Intelligence OS — System Architecture
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Authoritative State**: Production & Staging Verified

## 1. Stack Overview

### 1.1. Frontend Architecture
- **Framework**: React 18.3.1
- **Build Tool / Bundler**: Vite 5.4.1 (ESBuild development server with Rollup production tree-shaking)
- **Architecture Paradigm**: Client-Side Rendered (CSR) Single Page Application (SPA)
- **Styling**: Tailwind CSS 3.4.1 + Radix UI Primitives (`@radix-ui/*`) + Lucide React icon tokens
- **Routing**: `react-router-dom` v6.26.1 with `<ProtectedRoute>` guards, role validation (`isStudent`, `isStaff`, `isAdmin`), and dynamic subdomain recognition
- **State Management**:
  - Global Identity: `AuthContext` (`src/contexts/AuthContext.tsx`) with lifecycle bound to component mount
  - Multi-Tenant Branding: `TenantBrandingContext` (`src/contexts/TenantBrandingContext.tsx`)
  - Remote Data / Caching: `@tanstack/react-query` initialized in `App.tsx`
- **Audio & Visualizer Layer**: Web Audio API (16kHz AudioContext, AnalyserNode) + 3D fluid mesh canvas (`VoiceFluidOrb.tsx`)

### 1.2. Backend & Cloud Infrastructure
- **Platform**: Google Firebase v9/v10 & Google Cloud Platform (GCP Mumbai `asia-south1` & `us-central1`)
- **Compute Layer**: Firebase Cloud Functions v2 (Node.js 20 runtime) executing HTTPS Callable endpoints
- **Database**: Cloud Firestore (NoSQL Document Store, Multi-Region replication, strict Security Rules)
- **Storage**: Firebase Cloud Storage (Encrypted GCP Buckets for student resumes and accreditation artifacts)
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth 2.0, Session JWT verification)
- **Edge Reverse Proxy**: Hostinger KVM 4 VPS (`187.127.134.92`), Nginx 1.24+ with automated SSL/TLS termination

## 2. Infrastructure & Hosting Topology

### 2.1. Dual-Platform Hosting Boundaries
- **B2C Career OS**: `https://aivilabs.com` (Production) & `https://staging.aivilabs.com` (Staging) | Firebase Project: `aivi-career`
- **B2B Campus OS**: `https://aivicampus.com` (Production) & `https://staging.aivicampus.com` (Staging) | Hostinger VPS `187.127.134.92` & Firebase Project: `aivi-campus-prod`
- **Campus Demo**: `https://campus.aivilabs.com` | Hostinger VPS `187.127.134.92` (Static in-memory demo SPA)

### 2.2. Build Modes & Staging Protection
- **Staging Mode**: Must compile with `npm run build:staging`. Sets `VITE_APP_ENV=staging`, authorizing `staging.aivicampus.com` and `staging.aivilabs.com`.
- **Production Mode**: Compiled with `npm run build`. Authorizes production apex domains.
- **Automated Deployment**: `scripts/deploy_aivicampus_staging.py` securely transfers the bundle via SFTP to `/var/www/aivicampus-staging/html` and issues a passwordless Nginx reload (`systemctl reload nginx`).

## 3. Core Architecture Flow

1. **User Authentication**: Client authenticates via Firebase Auth. JWT token is attached to `onAuthStateChanged`.
2. **Quota Check**: Before executing generative functions, `checkUsage` verifies monthly and lifetime limits.
3. **AI Execution**: Cloud Function extracts request payload, validates schema, wraps input in `AI_TRUST_BOUNDARY` markers, and calls `gemini-2.5-flash` or Sarvam AI.
4. **Token Telemetry**: Token usage is recorded in `ai_usage_logs` and the user's `monthly_usage` counter increments atomically.
5. **Score Persistence**: Calculated scores are persisted to Firestore `analysis_results` and cached locally under user-scoped keys.
