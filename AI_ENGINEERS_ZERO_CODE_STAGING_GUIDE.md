# 🧠 AIVI CAMPUS OS — AI ENGINEERS ZERO-CODE STAGING TESTING & IMPROVEMENT GUIDE
**Document Version:** `2.1.0-BROWSER-ONLY`  
**Target Environment:** Staging Live (`https://staging.aivicampus.com`)  
**Access Level:** 100% Web Browser Testing (No Git / No Repository / No Terminal Access Required)  
**Core AI Engineering Trio:**  
- **Ashmi** — Role 1: Platform Master Administrator  
- **Sovan** — Role 2: Institutional TPO Admin Lead  
- **Isha** — Role 3: Candidate & AI Evaluator Lead  

---

## 1. 🎯 Purpose & Testing Strategy

This guide is designed for **Ashmi**, **Sovan**, and **Isha** to break-test and evaluate **AIVI Campus OS** on the live staging environment (`https://staging.aivicampus.com`). 

You will **not** touch code or use a terminal. You will test the real, running production-mirror platform end-to-end through your web browser using real data:
- Real Firebase Authentication
- Real multi-tenant Firestore isolation
- Real Cloud Functions connected to Google Gemini 2.5 Flash
- Real Web Audio API and Speech Recognition in the browser

The goal is to test how the three foundational roles collaborate in sequence:
```
[Ashmi: Platform Admin] ──(Provisions College)──> [Sovan: TPO Director] ──(Creates Drives)──> [Isha: Student] ──(AI Tools & Voice Studio)
```

---

## 2. 🔑 Master Staging Credentials & Starting URLs

All testing takes place on **`https://staging.aivicampus.com`**.

| Role | Engineer | Login URL | Email ID | Password | Destination |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Platform Master** | **Ashmi** | `https://staging.aivicampus.com/campus/login` | **`staging.admin@aivicampus.com`** | **`AiviAdmin@2026!`** | `/platform-admin` |
| **TPO Director** | **Sovan** | `https://staging.aivicampus.com/campus/login/<slug>` | *Created by Ashmi in Step 1* | *Set by Ashmi* | `/campus` |
| **Student Candidate** | **Isha** | `https://staging.aivicampus.com/campus/login/<slug>` | *Created via College Sign Up* | *Set by Isha* | `/campus/student-drives` |

> ⚠️ **Important Security Rule:**  
> Demo accounts (`@sunrise.ac.in`) are strictly disabled on staging. Every user must belong to a genuine college created during testing.

---

## 3. 📋 Step-by-Step Collaborative Testing Workflow

---

### 👑 PHASE 1: ASHMI (Platform Master Lead) — Create College From Scratch

**Goal**: Provision a fresh college tenant with custom seat limits and TPO credentials.

1. **Log in to Platform Master Console**:
   - Open Chrome and navigate to: **`https://staging.aivicampus.com/campus/login`**
   - Enter:
     - **Email:** `staging.admin@aivicampus.com`
     - **Password:** `AiviAdmin@2026!`
   - Click **Sign In**. You will land on **`https://staging.aivicampus.com/platform-admin`**.
2. **Inspect the Console**:
   - Verify that the active campuses count shows the genuine database state (starts empty/clean).
3. **Provision a New Campus**:
   - Click the green **"+ Provision New Campus"** button in the header.
   - Enter your test institution details:
     - **Campus Code / Slug**: Choose a clean, unique lowercase slug, e.g. `vit` or `nit` or `apex`.
     - **Institution Type**: Select `College (Single Campus)` or `University`.
     - **Institution Full Name**: e.g., `Vellore Institute of Technology` or `National Institute of Tech`.
     - **Subscription Plan**: Select `Pro (3,000 Seats)`.
     - **Student Seat Capacity**: Enter `1500`.
     - **Admin Contact Email**: Enter **Sovan's email address** (e.g. `sovan@vit.ac.in` or Sovan's real email).
     - **Admin Contact Name**: `Prof. Sovan (TPO Director)`.
     - **Admin Initial Password**: Set a secure password for Sovan (e.g. `VitTpo@2026!`).
   - Click **"Complete Institutional Onboarding"**.
4. **Handoff to Sovan**:
   - Note the generated branded login URL:  
     👉 **`https://staging.aivicampus.com/campus/login/<your-slug>`**
   - Share the URL, TPO email, and password with **Sovan**.

---

### 🏛️ PHASE 2: SOVAN (Institutional TPO Admin Lead) — Manage Campus & Drives

**Goal**: Log into the branded institutional portal, customize branding, and launch placement drives.

1. **Access Your Branded College Portal**:
   - Open Chrome and navigate to your college URL:  
     👉 **`https://staging.aivicampus.com/campus/login/<slug>`**
   - Verify that the page dynamically loads your college name and customized headline.
2. **Sign in as TPO Director**:
   - Enter the TPO email and password created by Ashmi in Phase 1.
   - Click **Sign In**. You will land on the **TPO Command Center (`/campus`)**.
3. **Customize Institutional Branding**:
   - Navigate to **Settings** (`/campus/settings`) in the sidebar.
   - Test changing the **Primary Brand Color** and **Accent Highlight Color** using the color pickers.
   - Verify that the live preview swatch updates dynamically and changes save without crashing.
4. **Create a Placement Drive**:
   - Navigate to **Placement Drives** (`/campus/drives`).
   - Click **"+ Create New Placement Drive"**.
   - Fill in real company data:
     - **Company Name**: e.g., `Google`, `Microsoft`, or `Zomato`.
     - **Role Title**: e.g., `Software Development Engineer (SDE-1)`.
     - **Job Description**: Paste a realistic 3-paragraph job description including requirements (e.g. React, Node.js, Python, System Design).
     - **Eligibility Criteria**: Min CGPA `7.5`, Allowed Branches: `CSE`, `IT`, `ECE`.
     - **CTC Package**: e.g., `₹18 LPA`.
   - Save the drive and verify it appears in the Active Drives table.
5. **Handoff to Isha**:
   - Share the college portal URL (`https://staging.aivicampus.com/campus/login/<slug>`) with **Isha**.

---

### 🎓 PHASE 3: ISHA (Student & AI Evaluator Lead) — Stress-Test AI Engines

**Goal**: Experience the candidate workflow, upload real resumes, and evaluate all AI scoring pipelines.

1. **Sign Up / Log In as Student**:
   - Open the college portal: **`https://staging.aivicampus.com/campus/login/<slug>`**.
   - Click **"Sign Up"** or log in with a student email (e.g. `isha.student@<slug>.ac.in` / `StudentPass@2026!`).
   - Accept the DPDP Act 2023 Consent Modal.
2. **Test 1: AI Resume Intelligence (`/dashboard/resume` or `/campus/resume`)**:
   - Upload a real multi-page PDF resume.
   - **Evaluate**:
     - Does the Gemini 2.5 Flash parser extract text accurately without scrambling sections?
     - Are the 6 ATS sub-scores (Impact, Brevity, Style, Structure, Skills, ATS Compatibility) realistic?
     - Check the **Weak Bullets** section: Does the AI provide concrete, quantifiable rewrite suggestions?
3. **Test 2: Job Fit Analysis (`/dashboard/job-fit`)**:
   - Paste the Job Description created by Sovan in Phase 2.
   - Run the analysis against your resume.
   - **Evaluate**:
     - Is the match percentage realistic (not hardcoded 100% or 0%)?
     - Does the missing skill taxonomy accurately identify required technologies missing from the resume?
4. **Test 3: 2-Way Real-Time Voice Studio (`/dashboard/interview`)**:
   - Click **"Start Live Voice Interview"**.
   - Allow browser microphone permissions when prompted.
   - **Evaluate**:
     - Does the 3D fluid orb visualizer react smoothly to your voice frequency?
     - Does the AI interviewer ask relevant technical questions based on the role?
     - **Test the Abort Guard**: Speak nothing for 15 seconds and end the interview. Verify it aborts cleanly with *"Incomplete Session (<5 words spoken)"* rather than awarding a fake high score.
     - **Complete a Real Session**: Answer 3 questions speaking naturally for 30-45 seconds each.
     - **Evaluate Final Scorecard**: Check the STAR rubric evaluation, filler-word counter, and WPM pace telemetry.

---

## 4. 📝 Bug & Improvement Reporting Format

When Ashmi, Sovan, or Isha find a bug or identify an AI improvement, document it using this format:

```markdown
### 🐛 BUG / IMPROVEMENT REPORT
- **Reported By**: Ashmi / Sovan / Isha
- **Date & Time**: YYYY-MM-DD HH:MM
- **URL**: e.g., https://staging.aivicampus.com/campus/drives
- **Role Used**: Platform Admin / TPO Admin / Student
- **Severity**:
  - [ ] P0 - Blocker (Page crashes, white screen, cannot log in)
  - [ ] P1 - Major (AI returns error 500, incorrect score, feature fails)
  - [ ] P2 - Minor / AI Quality (Hallucinated suggestion, slow voice latency)
  - [ ] P3 - UI / Polish (Misaligned button, text truncation)

#### Steps to Reproduce:
1. Go to `...`
2. Click on `...`
3. Enter payload: `...`

#### Observed Behavior:
What actually happened (include exact error message if visible).

#### Expected Behavior:
What should have happened.

#### AI Quality Evaluation:
(If applicable) Were the Gemini suggestions relevant, actionable, and accurate?
```

---

*AIVI Campus OS — Enterprise AI Employability Intelligence.*
