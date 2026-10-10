# AIVI System Documentation — Pricing & Monetization
> **Version**: 2.5.0 | **Updated**: October 1, 2026 | **Authoritative State**: Production Verified

AIVI operates a high-margin freemium business model with strict separation between free discovery tools and generative AI workflows.

## 1. Plan Tiers & Feature Matrix

| Feature / Quota | Free Discovery Tier | Starter Plan (₹399 / mo) | Pro Plan (₹599 / mo) | Campus Institutional |
| :--- | :--- | :--- | :--- | :--- |
| **Target Audience** | Organic Signups / Trials | Active Job Seekers | Power Candidates & Execs | Colleges & Placement Cells |
| **Resume ATS Diagnostics** | 2 Lifetime | 30 Monthly | Unlimited Monthly | Unlimited for Cohort |
| **Job Fit Matcher** | 2 Lifetime | 30 Monthly | Unlimited Monthly | Unlimited for Cohort |
| **Skill Learning Roadmap** | 1 Lifetime | Full Access (4-Week) | Full Priority Access | Batch Curriculum Sync |
| **Live 2-Way Voice Studio** | 1 Lifetime Session | 5 Full Sessions / mo | Unlimited Sessions | Unlimited Practice Sprints |
| **Resume Studio Rebuilder** | 0 (Locked) | Unlimited Rebuilds | Unlimited + LaTeX | Official QR Seal Minting |
| **LinkedIn Optimization** | 0 (Locked) | Included | Priority AI Processing | Not Applicable |
| **Accreditation SSR Exports**| Not Applicable | Not Applicable | Not Applicable | NAAC C5.2.1 & NIRF Packs |

## 2. Beta Promotional Strategy (`FIRST1000`)
- **Promotional Mechanism**: First 1,000 registered users can redeem coupon code `FIRST1000` in `/dashboard/settings`.
- **Entitlement**: Grants 30 days of full **Starter Tier** access (₹399 value) completely free.
- **Enforcement**: Handled via atomic Firestore transaction in `functions/src/index.ts` on `system_stats/beta`. The 1,001st user receives an automatic *"Promotion has reached its 1,000 user limit"* notice.
