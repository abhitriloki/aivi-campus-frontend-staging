# AIVI System Documentation - Admin Dashboard

The Admin Dashboard provides high-level organizational visibility, tracking financial health via AI compute costs, processing user override behaviors, and delivering business intelligence around trial conversions.

**Path**: `/dashboard/admin`
**Component**: `src/pages/AdminDashboard.tsx`
**Access**: Gated entirely by `useAuth().isAdmin` validating against the `user_roles` collection.

## 1. User Management System
- **View Layer**: Renders an infinite-scrollable or paginated table extracting directly from the `users` and `user_plans` interconnected collections.
- **Fields Logged**:
  - Name, Email, Auth UID
  - Registration Date
  - Current Plan Type
  - Monthly Usage (Quota utilized this cycle)
  - Trial Consumed Status

## 2. Plan Modification Capability
To account for edge cases, customer support interventions, or VIP comping, Admins can instantly alter the billing state of any user.
- **Action**: Utilizing the `<select>` tag on individual rows to switch between `"free"`, `"starter"`, `"pro"`.
- **Execution**: The dashboard invokes a direct server-side write to the user's `user_plans` document. Because the Admin holds the `isAdmin()` authorization validated by Firebase Security Rules, this direct mutation is permitted. 
- **Effect**: Changes are instant. The user next page refresh will trigger the new quota limits.

## 3. AI Intelligence Analytics & Dashboard
The paramount feature of the Dashboard is analyzing operational overheads. AIVI uses LLMs; LLMs charge by the token.

### 3.1. Tracking Core Metrics
- **Total active users / Total Beta redemptions**: Extracts from `snapshot.size` indexing or counting total elements where `plan_type` != `free`.
- **Top Feature Usage**: Which modules are burning the most quotas? (E.g. Is Resume Intelligence executed 10x more than Job Fit Analysis?) 

### 3.2. Fetch AI Logs Command
The Admin board calls a heavy read request across `ai_usage_logs`.
- **Data Aggregation**: Sums all `prompt_tokens` and `completion_tokens` array mapped instances grouping by `endpoint`.
- **Cost Calculation (Estimated)**: The frontend (or caching backend chron) maps constant multpliers.
  - `(totalPromptTokens / 1_000_000) * 0.075` = Prompt USD.
  - `(totalCompletionTokens / 1_000_000) * 0.30` = Completion USD.
  - Displays Total Projected USD Cost alongside the equivalent INR.
- **Unit Economics UI**: Maps out explicitly: "Starter Tier Revenue Projected vs AI Load Expense Projected".

## 4. Known Dashboard Limitations & Optimizations
- **Scaling limitation**: Currently, if the `ai_usage_logs` sub-collection scales to 500,000 entries, pulling the raw snapshot on initial dashboard load would consume massive Firestore Read costs and crash the browser window memory.
- **Future Roadmap**: Implement a Firebase Scheduled Function (Every 24 hours). The function performs the aggregation server-side and writes a flat JSON variable to an `analytics/daily` singleton document. The Admin Dashboard will just query this fast, single-document cache going forward.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
