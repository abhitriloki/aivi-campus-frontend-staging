# 🎓 AIVI Campus OS — Official Staging Frontend Replica

> **CONFIDENTIAL & PROPRIETARY** — **AIVI Intelligence Private Limited**  
> **Repository:** `abhitriloki/aivi-campus-frontend-staging`  
> **Purpose:** Pristine, decoupled staging frontend replica for rapid UI/UX Figma integration, Muse workflows, and styling updates.

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development (Connected Directly to Live Staging)
```bash
npm run dev
```
Your local frontend will launch at `http://localhost:5173` and is pre-configured to communicate seamlessly with the live **AIVI Campus Staging Backend** (`aivi-campus-stg`).

### 3. Verify Production/Staging Build
```bash
npm run build:staging
```

---

## 🗺️ Project Architecture

```
aivi-campus-frontend-staging/
├── public/                 # Static brand assets, convocation images, icons
├── src/
│   ├── components/         # Reusable UI widgets, navigation, header, footer
│   ├── contexts/           # Global AuthContext & TenantBrandingContext
│   ├── layouts/            # Institutional CampusLayout & DashboardLayout
│   ├── pages/              # Primary route screens (Landing, TPO Dashboard, Drives, Vault)
│   ├── services/           # Backend API connectors (campusService, tenantService, authService)
│   └── types/              # TypeScript schemas for students, drives, and tenants
├── .env.staging            # Active Firebase Staging Project credentials (aivi-campus-stg)
├── .env                    # Local default linking directly to .env.staging
├── vite.config.ts          # Vite bundler configuration
└── tailwind.config.ts      # Tailwind CSS design tokens
```

---

## 🔌 Connecting to Staging Backend

All backend Cloud Functions and Firestore collections are already wired inside `src/services/`.
- **Firebase Project:** `aivi-campus-stg`
- **Auth Provider:** Google Workspace SSO & Email/Password
- **Data Collections:** `tenants`, `profiles`, `placement_drives`, `sprints`, `resume_vault`

When you merge new Figma components into `src/pages/` or `src/components/`, keep the event handlers (`onSubmit`, `onClick`) and data properties intact so that backend workflows continue executing smoothly.
