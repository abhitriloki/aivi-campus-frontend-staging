# AIVI Career & Campus OS — Master System Documentation
> **Version**: 2.5.0 (Master CTO Technical Handover Edition) | **Updated**: October 1, 2026  
> **Authoritative Entity**: AIVI INTELLIGENCE PRIVATE LIMITED (CIN `U62099UP2026PTC249169`)

Welcome to the internal system documentation for the **AIVI Career Intelligence OS** (B2C) and **AIVI Campus OS** (B2B) platforms.

---

## 🌟 Master Technical Documentation (Start Here)
- **[LATEST_TECHNICAL_DOCUMENTATION_2026-10-01.md](./01_LATEST_ACTIVE_DOCUMENTATION/LATEST_TECHNICAL_DOCUMENTATION_2026-10-01.md)** — **The authoritative, complete technical handover document for the CTO.** Covers the entire dual-platform topology, Cloud Functions v2 registry, Gemini 2.5 Flash multimodal vision, Web Audio 16kHz live voice studio, sliding window rate limiting, Firestore security rules, decoupled placement states, Hostinger VPS Nginx reverse proxy, complete bug history (B1-B14), and the 8-engineer QA testing protocol.

---

## 📚 Structured Documentation Modules

### Part 1: Architecture & Platform Topologies
- **[01. Product Overview](./01_Product_Overview.md)** — Core product vision, positioning, and module taxonomy.
- **[02. System Architecture](./02_System_Architecture.md)** — Full-stack mapping (React 18 + Vite + Firebase v10 + Hostinger VPS).
- **[03. Backend Functions](./03_Backend_Functions.md)** — Deep dive into all Cloud Functions v2 endpoints, trust boundaries, and quota logic.
- **[04. Firestore Schema](./04_Firestore_Schema.md)** — Comprehensive NoSQL collections, relational mappings, and data models.
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** — In-depth architectural guide for senior backend and infrastructure engineers.
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** — Field-by-field schema reference and state transition definitions.
- **[API_DOCS.md](./API_DOCS.md)** — Request/response contracts for all HTTPS Callable endpoints.

### Part 2: Security, Compliance & Governance
- **[05. Security Rules](./05_Security_Rules.md)** — Production Firestore Security Rules enforcing RBAC and multi-tenant isolation.
- **[06. Trial System Logic](./06_Trial_System_Logic.md)** — Atomic transaction logic governing the `FIRST1000` beta quota.
- **[13. Incident Handling](./13_Incident_Handling.md)** — Standard operating procedures for outages, API degradation, and security events.

### Part 3: AI Models, Telemetry & Unit Economics
- **[08. AI Cost Model](./08_AI_Cost_Model.md)** — Breakdown of Gemini 2.5 Flash token costs, unit margins (>99%), and abuse prevention.
- **[09. Pricing & Monetization](./09_Pricing_Monetization.md)** — Tier boundaries, quota ceilings, and monetization architecture.
- **[07. Admin Dashboard](./07_Admin_Dashboard.md)** — Superadmin controls, role elevations, and token monitoring.

### Part 4: DevOps, Deployments & Forensic Bug Ledger
- **[10. Deployment & DevOps](./10_Deployment_DevOps.md)** — Hostinger VPS setup, SFTP automated deployments, and Nginx SSL termination.
- **[11. Environment Variables](./11_Environment_Variables.md)** — Secret management via GCP Secret Manager and environment modes.
- **[12. Known Bugs & History](./12_Known_Bugs_History.md)** — Complete forensic ledger of all 14 major bugs (B1 to B14) and permanent fixes.
- **[14. Scalability Plan](./14_Scalability_Plan.md)** — Architecture roadmap from 1,000 beta users to 100,000+ MAUs.
