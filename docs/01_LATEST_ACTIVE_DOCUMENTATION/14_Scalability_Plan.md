# AIVI System Documentation - Scalability Plan

While AIVI functionally supports its initial seed 1,000 beta users smoothly, crossing the threshold from 1,000 to 100,000 MAUs (Monthly Active Users) requires explicit strategic refactoring to prevent cascading compute costs and database thrashing.

## 1. Database (Firestore) Scalability Limits
Firestore charges primarily by Document Reads and Writes (approx. $0.06 per 100k reads).

### 1.1 The Admin Dashboard Read Crisis
- **Current Architecture**: Loading `/dashboard/admin` calls a direct query sweeping thousands of records (`users`, `user_plans`, `ai_usage_logs`) sequentially iterating and running math loops to sum totals.
- **The Limit**: If the system holds 25,000 active users, a single admin load performs 25,000 global read operations (costing real money) and takes seconds to paint the UI.
- **Scaling Solution**: Implement explicit **Data Aggregation via Cloud Schedulers**. 
   - A Node backend process triggers nightly via `pubsub`.
   - It performs the 25k iteration count server-side.
   - It writes the final integer sums into a single document: `analytics/monthly_summary`.
   - The React UI strictly only queries that single document (consuming 1 total READ) displaying near-instant KPI matrices.

## 2. Server Compute (Cloud Functions) Limitations
Cloud functions (via HTTPS callable interactions) require cold starts. A function must initialize Node.js natively from a zero-state if unused for periods of time. 

### 2.1 PDF Parsing Overload
- **Current Architecture**: The `extractPdf` mechanism currently handles PDF parsing arrays in-memory on the serverless compute Node. 
- **The Limit**: Heavily formatted, multi-megabyte PDFs containing massive string arrays and custom images can blow through default memory allocations (`256MB`), throwing `Memory Limit Exceeded` unhandled exceptions terminating execution entirely halfway through.
- **Scaling Solution**:
   - Implement Firebase Storage buckets.
   - Frontend uploads the PDF binary to Cloud Storage. 
   - The upload inherently triggers an asynchronous, heavy-duty backend function configured explicitly with `2GB/4GB` memory allowances.
   - Function writes the extracted text efficiently straight back to the user's `resume_analyses` document silently. Client receives a WebSocket/Subscription alert to update the UI indicating "Extraction Complete".

## 3. Organic Discovery (SEO Scaling)
- **Current Architecture**: Primary landing and optimization pages (`/about`, `/linkedin-optimization`) are Client Side Rendered (CSR). Google executes JS heavily, but other engines (Bing) generally index poor, empty DOMs on React SPAs.
- **Scaling Solution (Next.js Hybrid)**: 
   - Migrate purely public-facing landing structures explicitly to a Next.js framework (Server Side Rendering - SSR or SSG static generation). 
   - Deploy Next.js to Vercel/similar host. 
   - Direct the Next.js CTA buttons safely over seamlessly to the actual underlying React SPA dashboard sub-domain structure `app.aivisibilityinsights.com` ensuring maximum indexing capabilities without destroying the core React feature set.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
