# 🏛️ AIVI Campus OS — Master QA & Intern Testing Handbook

> **Version**: 3.0.0 (Production Release Baseline)  
> **Last Updated**: September 3, 2026  
> **Target Audience**: Software Engineering Interns, QA Engineers, Product Operations & TPO Champions  
> **Testing Environment**: Staging Sandbox (`https://staging.aivilabs.com/campus`)  
> **Live Demo Target**: Production Demo (`https://campus.aivilabs.com`)  

---

## 📋 Table of Contents
1. [Environment & URL Architecture](#1-environment--url-architecture)
2. [Step 0: How Interns Start (Zero-Password Sandbox Provisioning)](#2-step-0-how-interns-start-zero-password-sandbox-provisioning)
3. [TPO Director Workspace (`role: tenant_admin`) — Menu by Menu Deep Dive](#3-tpo-director-workspace-role-tenant_admin--menu-by-menu-deep-dive)
   - [3.1 Command Center Dashboard (`/campus`)](#31-command-center-dashboard-campus)
   - [3.2 Students Roster & AES Engine (`/campus/students`)](#32-students-roster--aes-engine-campusstudents)
   - [3.3 Student Import Wizard & History (`/campus/import` & `/campus/history`)](#33-student-import-wizard--history-campusimport--campushistory)
   - [3.4 Placement Drives & 4-Stage Pipeline (`/campus/drives`)](#34-placement-drives--4-stage-pipeline-campusdrives)
   - [3.5 7-Day Curated Placement Sprints (`/campus/sprints`)](#35-7-day-curated-placement-sprints-campussprints)
   - [3.6 Recruiter Verified Resume Vault & ZIP Package (`/campus/vault`)](#36-recruiter-verified-resume-vault--zip-package-campusvault)
   - [3.7 AI Interview Lab & Forensic Speech Telemetry (`/campus/interviews`)](#37-ai-interview-lab--forensic-speech-telemetry-campusinterviews)
   - [3.8 NAAC Criterion 5 & NIRF 2026 DCS Evidence Hub (`/campus/accreditation`)](#38-naac-criterion-5--nirf-2026-dcs-evidence-hub-campusaccreditation)
   - [3.9 Placement Calendar (`/campus/calendar`)](#39-placement-calendar-campuscalendar)
   - [3.10 Billing & Seat Allocation (`/campus/billing`)](#310-billing--seat-allocation-campusbilling)
   - [3.11 Staff & Role Delegation (`/campus/staff`)](#311-staff--role-delegation-campusstaff)
4. [Department Coordinator Workspace (`role: coordinator`)](#4-department-coordinator-workspace-role-coordinator)
5. [Student Practice Hub (`role: student`)](#5-student-practice-hub-role-student)
   - [5.1 AI Voice Mock Interview Practice Room](#51-ai-voice-mock-interview-practice-room)
   - [5.2 4-Path ATS Resume Studio](#52-4-path-ats-resume-studio)
   - [5.3 Job Fit Analysis & Gap Radar](#53-job-fit-analysis--gap-radar)
   - [5.4 30-Day Skill Growth Roadmap](#54-30-day-skill-growth-roadmap)
   - [5.5 Verified Resume Vault & Digital QR Proof](#55-verified-resume-vault--digital-qr-proof)
   - [5.6 Student Drives Board](#56-student-drives-board)
6. [Platform Superadmin Workspace (`role: platform_admin`)](#6-platform-superadmin-workspace-role-platform_admin)
   - [6.1 Master Multi-Tenant Console (`/platform-admin`)](#61-master-multi-tenant-console-platform-admin)
   - [6.2 Institutional Tenant Settings (`/campus/settings`)](#62-institutional-tenant-settings-campussettings)
   - [6.3 DPDP Act 2023 Compliance & Audit Logs (`/campus/audit-logs`)](#63-dpdp-act-2023-compliance--audit-logs-campusaudit-logs)
7. [Sample Test Datasets (Ready to Copy & Paste)](#7-sample-test-datasets-ready-to-copy--paste)
8. [Intern Bug Reporting & Verification Protocol](#8-intern-bug-reporting--verification-protocol)

---

## 1. Environment & URL Architecture

AIVI operates on a strictly segregated domain matrix:

| Environment | Purpose | Target URL | Web Server Root |
| :--- | :--- | :--- | :--- |
| **🧪 Demo Staging** | Full testing sandbox with demo role switcher & college provisioning | `https://staging.aivilabs.com/campus` | Hostinger VPS: `/var/www/staging-aivi-campus/html` |
| **🎪 Demo Live** | Presentation server with pixel-perfect B2B dark-teal landing page | `https://campus.aivilabs.com` | Hostinger VPS: `/var/www/aivi-campus/html` |
| **💼 Consumer B2C** | Individual job-seeker platform (Resume Studio, JD Fit, B2C Voice) | `https://staging.aivilabs.com` | Untouched & Isolated |
| **🚀 Production Live** | Upcoming production URL for institutional contracts (SSO only) | `https://aivicampus.com` | Production Pipeline Target |

---

## 2. Step 0: How Interns Start (Zero-Password Sandbox Provisioning)

Interns do **NOT** require the founder's Google/Gmail credentials to test. Follow this exact flow:

1. **Open Staging Portal**: Navigate to [**`https://staging.aivilabs.com/campus`**](https://staging.aivilabs.com/campus).
2. **Switch to Superadmin**: In the top-right header, click the Role Switcher dropdown and select **"Platform Admin"**.
3. **Open Master Console**: In the top bar, click the Institution dropdown (`Sunrise Engineering...`) and select **"🛡️ Open Master Console"**.
4. **Provision a Test University**:
   - Click **"+ Provision New College"**.
   - **College Name**: e.g., `RV College of Engineering, Bengaluru` (or `IIT Delhi Pilot`).
   - **Campus Slug**: `rvce` (URL-safe code).
   - **Allocated Seats**: `1000`
   - **Plan**: `pro` (₹2,49,999)
   - **Director Email**: `director.tpo@rvce.edu.in`
   - **Director Name**: `Dr. K. S. Geetha`
5. **Instant Activation**: Click **"Provision Institutional Portal"**. The system instantly creates the tenant workspace.
6. **Switch Active College**: Click the top Institution dropdown and select your new college (`RV College of Engineering`) to begin testing with an empty, clean database!

---

## 3. TPO Director Workspace (`role: tenant_admin`) — Menu by Menu Deep Dive

The TPO Director is the primary decision-maker and institutional operator.

### 3.1 Command Center Dashboard (`/campus`)
* **Purpose**: Single-pane executive overview of the university's placement health, active drives, and accreditation posture.
* **Key Visuals & Metrics Explained**:
  1. **Batch Employability Score (AES)**: Overall composite index (0–100) representing how ready the current batch is for corporate hiring.
  2. **`Run AES Aggregation` Button**: Triggers an instant recalculation of all student sub-scores (ATS resume score 25%, technical JD fit 25%, mock interview fluency 25%, and verified skills 25%).
  3. **`Board Report PDF` Button**: Generates a 1-page executive summary PDF with visual score rings and branch breakdowns ready to present to the College Chairman or Principal.
  4. **Top 4 KPI Cards**:
     - *Students Onboarded*: Total verified roster count vs license seat limit.
     - *Resumes Analyzed*: Percentage of students who completed ATS & JD-fit checks.
     - *Active Drives*: Number of corporate placement drives currently accepting applications.
     - *At-Risk Students*: Students with an AES $< 40$ who require emergency 1-on-1 counseling.
  5. **Student Readiness Funnel**: Real-time conversion tracker showing student drop-off across 5 milestones: `Consent Collected` $\rightarrow$ `Profile Complete` $\rightarrow$ `Resume Built` $\rightarrow$ `Drive Shortlisted` $\rightarrow$ `Offers Extended`.
  6. **AES Distribution Bar**: Visual breakdown across 4 color-coded bands:
     - 🟢 **Job-Ready ($\ge 75$)**: Ready for Tier-1 product/consulting drives (₹8–24 LPA).
     - 💎 **Trainable (60–74)**: Ready for mass recruiters; needs 1 week of sprint practice.
     - 🟡 **Borderline (40–59)**: Weak resume or low interview fluency; needs AI mock drills.
     - 🔴 **Critical At-Risk ($< 40$)**: Incomplete profile or failing technical assessments.

---

### 3.2 Students Roster & AES Engine (`/campus/students`)
* **Purpose**: Directory of all enrolled students with live employability telemetry.
* **Testing Steps**:
  1. Filter students by **Branch** (`CSE`, `ECE`, `IT`, `Mechanical`) or **Graduation Year** (`2026`).
  2. Search by student name or roll number.
  3. Click on any student card to inspect their **4-Part AES Breakdown**:
     - *Resume Score (25%)*: ATS parseability and quantifiable action verb impact.
     - *JD Fit Score (25%)*: Match percentage against target department benchmark roles.
     - *Mock Interview Score (25%)*: Speech fluency, filler word ratio, and STAR method rating.
     - *Skill Depth (25%)*: Verified technical skills and projects in Resume Vault.
  4. Click **"Nudge Incomplete Profiles"**: Triggers an automated notification to students missing CGPA or phone numbers.

---

### 3.3 Student Import Wizard & History (`/campus/import` & `/campus/history`)
* **Purpose**: Bulk onboarding engine to ingest 1,000+ student records in seconds via CSV.
* **Testing Steps**:
  1. Open `/campus/import`.
  2. Download the official CSV template.
  3. Upload your CSV file (see Section 7 for sample data).
  4. **Validation Engine**: Verify that the importer automatically validates:
     - Duplicate emails or roll numbers.
     - Invalid CGPA values (must be $0.0 - 10.0$).
     - Missing mandatory columns.
  5. Click **"Validate & Ingest Students"**.
  6. Navigate to `/campus/history` to verify the batch import log with timestamp, total ingested rows, and error counts.

---

### 3.4 Placement Drives & 4-Stage Pipeline (`/campus/drives`)
* **Purpose**: Corporate campus recruitment manager and automated candidate pipeline.
* **Testing Steps**:
  1. Click **"+ Create Placement Drive"**.
  2. Enter details:
     - *Company Name*: `TCS Digital`
     - *Role*: `Associate Software Engineer`
     - *CTC Package*: `8.5 LPA`
     - *Eligible Branches*: Select `CSE`, `IT`, `ECE`
     - *Minimum CGPA*: `7.5`
  3. Click **"Create & Run Auto-Shortlist"**:
     - The platform automatically matches all students meeting the criteria and places them in the **Shortlisted** column.
  4. Test the **Kanban Drag-and-Drop Pipeline**:
     - Move candidate cards across: `Shortlisted` $\rightarrow$ `Interview Scheduled` $\rightarrow$ `Technical Evaluation` $\rightarrow$ `Offer Extended`.
  5. Mark a student as `Offered` $\rightarrow$ Verify that the student's status updates immediately and flows into NAAC Metric 5.2.1!

---

### 3.5 7-Day Curated Placement Sprints (`/campus/sprints`)
* **Purpose**: Automated 7-day preparation track assigned to shortlisted candidates prior to company arrival.
* **Testing Steps**:
  1. Select an active drive (e.g. `TCS Digital`).
  2. Click **"Launch 7-Day Prep Sprint"**.
  3. Verify that shortlisted students receive a structured daily curriculum:
     - Day 1–2: Resume Keyword Tailoring for TCS Digital.
     - Day 3–4: Core Technical & DSA Mock Drills.
     - Day 5–6: AI Vernacular Behavioral & STAR Voice Mock Interview.
     - Day 7: Final Readiness Assessment & QR Resume Verification.

---

### 3.6 Recruiter Verified Resume Vault & ZIP Package (`/campus/vault`)
* **Purpose**: Institutional resume repository with recruiter digital verification and bulk ZIP exporter.
* **Testing Steps**:
  1. Filter candidates by drive or branch.
  2. Verify that each verified student has an institutional digital seal.
  3. Click **"Recruiter QR Verification Link"**:
     - Verify it opens a public recruiter verification page displaying candidate name, college, CGPA, verified skills, and authenticity hash.
  4. Click **"Export Recruiter Package (ZIP)"**:
     - Verify the platform generates a ZIP bundle containing all candidate PDFs named systematically (`RollNo_FullName.pdf`) along with a `manifest.csv` summary table!

---

### 3.7 AI Interview Lab & Forensic Speech Telemetry (`/campus/interviews`)
* **Purpose**: Comprehensive institutional diagnostic hub where TPO directors inspect audio-verbal competence across the batch.
* **Testing Steps**:
  1. Open `/campus/interviews` while logged in as **TPO Director**.
  2. Verify the **Batch Speech Telemetry**:
     - *Average Words Per Minute (WPM)*: Target pace is 120–150 WPM.
     - *Filler Word Percentage*: Tracks frequency of "um", "uh", "like", "you know".
     - *STAR Structure Compliance Rate*: Percentage of answers structured with Situation, Task, Action, Result.
     - *Language Distribution*: English vs Hindi vs Hinglish practice sessions.
  3. Open a **Student Interview Turn Log**:
     - Inspect the question audio prompt, student speech transcript, AI confidence score, and bulleted constructive feedback.

---

### 3.8 NAAC Criterion 5 & NIRF 2026 DCS Evidence Hub (`/campus/accreditation`)
* **Purpose**: One-click generation of official Government of India accreditation filings.
* **Testing Steps**:
  1. Open `/campus/accreditation` and select Academic Year (`2024-25` or `2025-26`).
  2. Click **"Generate NIRF Table Pack"**:
     - Verify downloaded PDF matches the **Ministry of Education NIRF 2026 Data Capturing System (DCS)** standard grid:
       - 3-Year Comparative Placement Table (`Academic Year`, `Intake`, `Lateral Entry`, `Graduating`, `Placed Count`, `Median CTC in INR & Words`, `Higher Studies`).
       - Student Strength & Social Equity Breakdown matrix.
  3. Click **"Generate NAAC Criterion 5 Pack"**:
     - Verify downloaded PDF matches the **NAAC Self Study Report (SSR)** grid:
       - Metric 5.1.3: Capacity Building & Skills Enhancement (Soft Skills, Language/Vernacular AI, ICT Sprints).
       - Metric 5.2.1: Outgoing Candidate Placement Roster with Roll No, Student Name, Employer, Package LPA, and Verifiable QR URL.
  4. Click **"Download CSV Roster"**: Verify it outputs the official NAAC DVV Excel-compliant CSV template!

---

### 3.9 Placement Calendar (`/campus/calendar`)
* **Purpose**: Unified schedule of company drive dates, test deadlines, and faculty mock review sessions.
* **Testing Steps**:
  1. Click on any date to create a placement event (e.g. *Amazon On-Campus Online Test*).
  2. Verify event displays on the calendar grid with color-coded company tags.

---

### 3.10 Billing & Seat Allocation (`/campus/billing`)
* **Purpose**: Manage institutional plan tiers, seat consumption, and GST invoices.
* **Testing Steps**:
  1. Inspect the seat progress bar (e.g. *1,840 / 2,400 Seats Utilized*).
  2. Verify active tier badge (`Campus Starter` / `Campus Pro` / `University Group`).
  3. Click **"Download Annual Invoice (PDF)"** $\rightarrow$ verifies GST-compliant institutional billing receipt.

---

### 3.11 Staff & Role Delegation (`/campus/staff`)
* **Purpose**: Add and manage Department Coordinators and live live placement assistants.
* **Testing Steps**:
  1. Click **"+ Add Staff Member"**.
  2. Enter Name, Email, and assign Scope (`CSE Department`, `ECE Department`, or `All Branches`).
  3. Verify the coordinator appears in the active staff directory.

---

## 4. Department Coordinator Workspace (`role: coordinator`)

Department Coordinators (e.g. `Prof. Sunita Rao - CSE Department`) have a **Branch-Scoped View**:
* **Branch Lock**: They can only see and manage students within their assigned branch (`CSE` / `IT`).
* **Placement Pipeline**: Can shortlist departmental candidates and monitor student practice hours.
* **Access Restrictions**: Cannot modify billing, cannot delete the institution, and cannot access other departments' private student logs.

---

## 5. Student Practice Hub (`role: student`)

When an intern switches role to **Student (`Aarav Sharma`)**, the interface transforms into a personal AI Career Practice Room.

### 5.1 AI Voice Mock Interview Practice Room (`/campus/interviews`)
* **Direct Practice Room**: The student sees their practice studio (NOT staff oversight logs).
* **Testing Steps**:
  1. Select a practice track: *General Technical*, *STAR Behavioral*, or *TCS Digital Technical Sprint*.
  2. Select language mode: **English**, **Hindi**, or **Hinglish**.
  3. Click **"Start Voice Turn"**:
     - Verify browser asks for microphone permission.
     - The fluid 3D voice visualizer reacts to speech in real-time.
     - AI asks a contextual interview question.
     - Student speaks answer $\rightarrow$ AI generates instant STAR score and actionable tips.
  4. Confirm audio is processed in live memory and **never stored as raw MP3 on disk** (DPDP compliant).

### 5.2 4-Path ATS Resume Studio (`/campus/resume-studio`)
* Test all 4 creation modes:
  - *Path 1: Fresher Wizard* (Converts projects/internships into strong bullets).
  - *Path 2: Quick Bullet Enhancer* (Adds metrics and action verbs).
  - *Path 3: JD Tailor* (Matches keywords from a specific job description).
  - *Path 4: Full AI Rebuild* (Outputs clean single-column ATS format).

### 5.3 Job Fit Analysis & Gap Radar (`/campus/job-fit`)
* Upload a student resume and paste a target Job Description.
* Verify the **0–100% Match Ring** and Missing Critical Skills Radar.
* Click **"Rebuild for this JD"** $\rightarrow$ verifies 1-click handoff into Resume Studio.

### 5.4 30-Day Skill Growth Roadmap (`/campus/skill-roadmap`)
* Generates a 4-week structured milestone plan to bridge identified missing skills.

### 5.5 Verified Resume Vault & Digital QR Proof (`/campus/student-vault`)
* Student submits their polished resume for institutional verification.
* Once verified, student downloads their **University-Sealed PDF** with a permanent verifiable QR code.

### 5.6 Student Drives Board (`/campus/student-drives`)
* View eligible campus drives and submit their verified resume in 1 click!

---

## 6. Platform Superadmin Workspace (`role: platform_admin`)

Platform Admins manage all partner colleges across India.

### 6.1 Master Multi-Tenant Console (`/platform-admin`)
* **Multi-College Provisioning**: Add any college, set seat limits, assign director emails.
* **Global Tenant Toggles**: Instant status toggle between `Active` and `Suspended`.
* **Tenant Search & Filter**: Search by institution name, code, or tier.

### 6.2 Institutional Tenant Settings (`/campus/settings`)
* Upload college logo (PNG/SVG).
* Configure primary brand color (e.g. `#1C6B68`).
* Set custom domain / subdomain mapping.

### 6.3 DPDP Act 2023 Compliance & Audit Logs (`/campus/audit-logs`)
* Immutable audit trail logging every admin action, student consent acceptance, and data export with UTC timestamp and actor email.

---

## 7. Sample Test Datasets (Ready to Copy & Paste)

### 📄 7.1 Sample Student Roster CSV (Save as `sample_students.csv`)
```csv
RollNumber,FullName,Email,Branch,CGPA,GraduationYear,Phone
RV26CSE001,Aarav Sharma,aarav.sharma@rvce.edu.in,CSE,8.9,2026,+919876543210
RV26CSE002,Priya Patel,priya.patel@rvce.edu.in,CSE,9.2,2026,+919876543211
RV26ECE014,Rohan Verma,rohan.verma@rvce.edu.in,ECE,7.8,2026,+919876543212
RV26IT025,Ananya Iyer,ananya.iyer@rvce.edu.in,IT,8.4,2026,+919876543213
RV26ME030,Karan Malhotra,karan.m@rvce.edu.in,ME,7.2,2026,+919876543214
RV26CSE045,Sneha Kulkarni,sneha.k@rvce.edu.in,CSE,8.1,2026,+919876543215
RV26ECE052,Vikram Aditya,vikram.a@rvce.edu.in,ECE,6.9,2026,+919876543216
```

---

### 💼 7.2 Sample Job Description for Placement Drive Creation
```text
Company: TCS Digital
Role: Associate Software Engineer (ASE)
CTC: ₹8.5 LPA
Location: Bengaluru / Hyderabad / Pune

Job Description:
We are hiring high-potential engineering graduates with strong problem-solving capabilities, proficiency in Data Structures and Algorithms, modern Web Technologies (React, Node.js, Python/Java), and Cloud fundamentals (AWS/GCP). 

Eligibility:
- B.Tech CSE, IT, ECE (2026 Batch)
- Minimum 7.5 CGPA with no active backlogs
- Strong communication skills and willingness to work in agile teams
```

---

## 8. Intern Bug Reporting & Verification Protocol

When you discover an anomaly or bug during testing, log it in this standardized format:

```markdown
### 🐛 Bug Report
- **URL**: [e.g. https://staging.aivilabs.com/campus/drives]
- **Active Role**: [e.g. TPO Director / Student / Platform Admin]
- **Steps to Reproduce**:
  1. Clicked "+ Create Placement Drive"
  2. Entered package 8.5 LPA and clicked submit
- **Expected Behavior**: Drive should create and appear in Kanban board.
- **Actual Behavior**: Spinner looped or error toast displayed.
- **Console Log / Screenshot**: [Attach browser console log]
```

Happy Testing! 🚀

