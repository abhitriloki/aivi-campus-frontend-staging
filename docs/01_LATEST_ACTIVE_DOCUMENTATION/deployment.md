# 🚀 AIVI Campus — Enterprise University Deployment & Onboarding Manual

> **Document Purpose**: Technical & Operational Handbook for Platform Developers, University IT Administrators, and Training & Placement Officers (TPO).  
> **Version**: 2.4.0 (Enterprise Multi-Tenant Edition)  
> **Classification**: Operational Specification & Deployment Protocol  

---

## 📋 Executive Summary & System Overview

**AIVI Campus** is an AI-powered Enterprise Career Operating System designed for Higher Education Institutions (Universities, Engineering Colleges, and Management Institutes). It bridges the gap between institutional placement administration, student career preparation, and corporate recruiter verification.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             PLATFORM ARCHITECTURE                                │
├──────────────────────────┬──────────────────────────┬────────────────────────────┤
│   SUPER ADMIN CONSOLE    │     TPO COMMAND CENTER   │      STUDENT AI OS         │
│   • Tenant Provisioning  │   • Drive Management     │   • Resume Studio          │
│   • License Management   │   • Verified Resume Pack │   • AI Job Fit Analysis    │
│   • Custom Branding      │   • Offers Kanban Board  │   • Vernacular Interviews  │
│   • System Audit Logs    │   • NAAC/NIRF Exporter   │   • Resume Vault           │
└──────────────────────────┴──────────────────────────┴────────────────────────────┘
```

---

## 🤝 Deliverables & Requirements Matrix

### 1. What AIVI Campus Provides (Platform Team Deliverables)
* **Dedicated Multi-Tenant Instance**: White-labeled portal with custom university subdomain (e.g., `glbajaj.aivilabs.com` or `campus.university.ac.in`).
* **Custom Brand Identity**: University logo, custom color palette, and institutional favicon integration.
* **Campus Enterprise Access**: Unlimited AI runs for all enrolled students (Resume Tailoring, Job Fit, Vernacular AI Mock Interviews, Skill Roadmaps).
* **QR Resume Verification Engine**: Automated cryptographically sealed QR codes on all student PDF resumes linked to official university records.
* **Accreditation Exporter**: 1-click filing data packs formatted for NAAC Criteria 5.2.1, NIRF Metric 4.1, and AICTE compliance.
* **Corporate Recruiter Exporter**: Password-protected, 7-day signed ZIP packages for corporate HR teams.

---

### 2. Requirements Matrix (Our Side vs. University Side)

| Phase | Required From Our Side (AIVI Platform) | Required From University Side (IT & TPO) |
| :--- | :--- | :--- |
| **Domain & DNS** | Provision SSL certificate & Nginx reverse proxy routes | CNAME DNS record pointing `campus.university.ac.in` $\rightarrow$ `srv1862029.hstgr.cloud` (or sub-path route) |
| **Branding** | Configure theme tokens, primary hex color (`#169C8F`), dark/light logos | High-resolution PNG/SVG university logo + official hex color code |
| **Authentication** | Configure SAML 2.0 / Google OAuth tenant identity provider | Enable Google Workspace SSO or provide SAML metadata URL for university domain (`@university.ac.in`) |
| **Student Roster** | Validate, parse, and bulk-provision student accounts in Firestore | Upload master student data via standardized CSV template |
| **TPO Accounts** | Provision `placement_director` & `placement_staff` administrative roles | Provide name, official email, and department of TPO staff |

---

## 🛠️ Step-by-Step University Onboarding Protocol

```
Step 1: Super Admin Provisioning (Platform Console)
       │
       ▼
Step 2: DNS & SSO Identity Provider Setup (University IT)
       │
       ▼
Step 3: TPO Admin Account Activation & Staff Roles Setup (Placement Director)
       │
       ▼
Step 4: Student Data Ingestion via CSV or SAML SSO (University IT & TPO)
       │
       ▼
Step 5: Campus Drive Launch & Student Portal Access (Go-Live)
```

---

## 📊 Student Data Ingestion & Schema Specification

To populate the student roster, the University IT / TPO team uploads a single master `.csv` file. 

### 1. CSV Column Schema (Exact Header Names & Specifications)

| Column Header | Data Type | Required? | Description / Format | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | **YES** | Official institutional email address | `student1@sunrise.ac.in` |
| `fullName` | String | **YES** | Student's legal full name | `Abhishek Mishra` |
| `enrollmentNo` | String | **YES** | University Roll Number / Registration ID | `SEC26CSE001` |
| `branch` | String | **YES** | Academic Department / Branch (`CSE`, `ECE`, `ME`, `CE`, `IT`, `EE`, `MBA`, `MCA`) | `CSE` |
| `batch` | Integer | **YES** | Passing Graduation Year (4-digit integer) | `2026` |
| `cgpa` | Float | **YES** | Cumulative Grade Point Average (0.0 to 10.0 scale) | `8.8` |
| `phone` | String | Optional | 10-digit mobile number for SMS/WhatsApp notifications | `9876543210` |
| `gender` | String | Optional | Gender (`Male`, `Female`, `Other`) for NAAC EDI metrics | `Male` |
| `backlogs` | Integer | Optional | Count of active backlogs/arrears (Default: `0`) | `0` |
| `placementStatus` | String | Optional | Current status (`unplaced`, `placed`, `higher_studies`) | `unplaced` |

---

### 2. Raw Sample CSV Data

```csv
email,fullName,enrollmentNo,branch,batch,cgpa,phone,gender,backlogs,placementStatus
student1@sunrise.ac.in,Abhishek Mishra,SEC26CSE001,CSE,2026,8.8,9876543210,Male,0,unplaced
priya.sharma@sunrise.ac.in,Priya Sharma,SEC26CSE042,CSE,2026,9.1,9876543211,Female,0,placed
rahul.verma@sunrise.ac.in,Rahul Verma,SEC26ECE015,ECE,2026,8.2,9876543212,Male,0,unplaced
ananya.gupta@sunrise.ac.in,Ananya Gupta,SEC26IT009,IT,2026,8.6,9876543213,Female,0,unplaced
karan.patel@sunrise.ac.in,Karan Patel,SEC26CSE088,CSE,2026,7.9,9876543214,Male,0,unplaced
```

---

## 🔑 User Provisioning & Access Modes

AIVI Campus supports **three user creation methods**:

```
                              ┌────────────────────────────────────────┐
                              │     USER PROVISIONING ARCHITECTURE     │
                              └───────────────────┬────────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐                      ┌─────────────────┐
│  BULK CSV IMPORT│                      │  SAML 2.0 / SSO │                      │ MANUAL TPO CREATION│
│ (TPO Roster)    │                      │ (Auto-Provision)│                      │ (Individual)    │
└─────────────────┘                      └─────────────────┘                      └─────────────────┘
```

### Method 1: Bulk CSV Roster Import (Recommended for Day 1)
1. TPO logs into `/campus/students`.
2. Clicks **`Import Students Wizard`**.
3. Uploads the verified `.csv` file.
4. The system validates entries, provisions Firebase Auth accounts, sets Firestore claims (`tenantId`, `role: "student"`), and sends automated welcome emails with password setup links.

### Method 2: Institutional SAML 2.0 / Google Workspace SSO (Zero Paperwork)
1. University IT provides their Google Workspace / Microsoft Entra ID SAML metadata.
2. Platform team enables SSO for the university's domain (e.g. `@university.ac.in`).
3. Students navigate to `campus.university.ac.in` and click **"Sign in with College Account"**.
4. Profiles are auto-created on first login with pre-assigned `Campus Enterprise` entitlements.

### Method 3: Manual TPO & Staff Account Creation
* **Super Admin / Placement Director** opens **`Staff & Roles`** (`/campus/staff`).
* Clicks **`+ Add Staff Member`**.
* Enters Name, Institutional Email, and assigns role (`placement_director`, `placement_staff`, or `faculty_coordinator`).

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Feature Module | Super Admin | Placement Director (TPO) | Placement Staff | Student | Recruiter (Public Link) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Command Center Dashboard** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Students Roster Management** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create & Publish Drives** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Mark Offers & Rejections** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Export Verified Resume Pack** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Recruiter Feedback Link** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **NAAC / NIRF Reports Exporter**| ✅ | ✅ | ❌ | ❌ | ❌ |
| **Audit & DPDP Logs** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **AI Resume Studio & Job Fit** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **AI Vernacular Interviews** | ✅ | ❌ | ❌ | ✅ | ❌ |

---

## 🔄 Complete Operational Lifecycle Walkthrough

### Phase 1: Drive Publishing (TPO)
1. TPO logs in at `https://staging.aivilabs.com/campus/login`.
2. Opens **Placement Drives** $\rightarrow$ **`+ Post New Drive`**.
3. Inputs Job Title (*Systems Engineer*), Company (*TCS Digital*), CTC (*₹7.5 LPA*), and pastes JD.
4. Sets cutoffs (CGPA $\ge 6.5$, CSE/ECE/IT branches, Batch 2026).
5. Clicks **`Publish Drive & Launch 7-Day Sprint`**.

### Phase 2: Student Prep & Application (Student)
1. Student logs into their dashboard.
2. Views recommended drive under **Campus Placement Drives**.
3. Clicks **`Apply for Drive`**.
4. Runs **Job Fit Analysis** against the Capgemini JD to identify missing resume keywords.
5. Completes **AI Mock Interview Sprints** in Hindi/English to prepare for technical rounds.

### Phase 3: Shortlisting & Recruiter Export (TPO to Corporate HR)
1. TPO views candidate applications on the **Offers Board**.
2. Selects shortlisted students and clicks **`Export Verified Resume Pack`**.
3. Enters corporate recruiter email (`campus@tcs.com`) and cover note.
4. System generates a 7-day signed ZIP package containing:
   * Standardized PDF Resumes with embedded **QR Verification Seals**.
   * Master Roster Excel (`Candidate_Placement_Roster.xlsx`).
5. Recruiter scans QR code on any resume to verify authenticity directly against official university records.

### Phase 4: Offer Logging & Accreditation (TPO)
1. TPO clicks **`+ Mark Offer`** for hired candidates (entering CTC & Joining Date).
2. Student profile status updates to **Placed**.
3. At year-end, TPO opens **Accreditation** (`/campus/accreditation`) and clicks **`Generate NAAC C5 Pack`** or **`NIRF Table Pack`** to download ready-to-file compliance reports.

---

## 🔒 Security, Data Privacy & DPDP Compliance

* **DPDP 2023 Compliance**: Students explicitly grant data processing consent during profile setup.
* **Audit Logging**: All administrative actions (resume downloads, recruiter exports, offer changes) are immutably logged with actor email, timestamp, action type, and IP address under `/campus/audit-logs`.
* **Data Encryption**: All data is encrypted in transit (TLS 1.3) and at rest (AES-256).

---

## 📞 Support & Operational Escalations

* **Platform Engineering Lead**: `dev@aivilabs.com`
* **University Onboarding Support**: `support@aivilabs.com`
* **Emergency VPS Infrastructure Ops**: Root access via SSH (`187.127.134.92`)

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
