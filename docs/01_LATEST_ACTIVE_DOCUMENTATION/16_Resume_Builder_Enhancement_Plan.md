# AIVI Resume Builder Enhancement Plan

This document defines the product direction, feature roadmap, phased implementation plan, and design-first execution approach for upgrading AIVI's current Resume Builder into a more complete and differentiated **Resume Studio** experience.

---

## 1. Purpose

The current Resume Builder is functional, but it is too narrow in workflow:

- It assumes the user already has a resume.
- It assumes the user wants a full rebuild.
- It does not support guided partial edits.
- It does not support first-time users or freshers creating a resume from scratch.
- It does not yet feel like a premium career workflow product.

The goal of this enhancement is to turn the current builder into a broader, more intelligent system that supports:

- Existing professionals improving an existing resume
- Users tailoring a resume for a specific role
- Users performing a full AI-led rebuild
- Freshers / college students creating a first resume from zero

This upgrade should be handled in two major tracks:

1. **Documentation and product planning**
2. **Design exploration before code changes**

Only after design is finalized should implementation begin.

---

## 2. Proposed Product Rename

The current name "Resume Builder" feels too generic and too close to commodity AI tooling.

Recommended product naming options:

- Resume Studio
- Resume Rebuild Studio
- Resume Optimization Lab
- AIVI Resume Copilot

**Recommended working name:** `Resume Studio`

Reason:
- Feels more premium
- Covers both editing and creation
- Supports multiple workflows under one product surface

---

## 3. Product Problem Statement

The current experience mainly supports one user story:

- "I have a resume, and I want AIVI to rebuild it."

But actual users have multiple starting points:

- "I only want small edits."
- "I want to optimize this for one job."
- "I want a full rewrite."
- "I am a fresher and do not have a resume yet."

The new system must support these user intents explicitly.

---

## 4. Target User Types

### 4.1 Experienced Professional

Needs:
- Improve resume quality
- Tailor for specific job roles
- Strengthen impact language
- Increase ATS readiness

### 4.2 Career Switcher

Needs:
- Reframe previous experience
- Translate transferable skills
- Align with a new target industry

### 4.3 Active Job Seeker

Needs:
- Fast role-specific tailoring
- Quick iteration for multiple applications
- Version saving

### 4.4 Fresher / College Student / First-Time Job Seeker

Needs:
- Build first resume without existing material
- Convert projects/internships into strong bullet points
- Create a professional summary/objective
- Understand what sections should exist

---

## 5. New Core Product Structure

The enhanced Resume Studio should begin with a primary intent selector:

### 5.1 Entry Paths

Users should choose one of four options:

1. `Improve my existing resume`
2. `Tailor my resume for a role`
3. `Rebuild my resume completely`
4. `Create my first resume`

These four paths define the future information architecture of the product.

---

## 6. Functional Modes

### 6.1 Improve Existing Resume

Use case:
- User already has a resume
- User wants minimal or focused changes

Expected capabilities:
- Rewrite summary only
- Improve bullet points
- Add stronger metrics
- Fix ATS issues
- Improve clarity and brevity
- Rewrite selected sections only

### 6.2 Tailor Resume for a Role

Use case:
- User has a base resume
- User wants to adapt it for a target role or job description

Expected capabilities:
- Role-specific summary rewrite
- Keyword alignment
- Skills reprioritization
- More relevant bullet emphasis
- Optional job-description-based tailoring

### 6.3 Full Resume Rebuild

Use case:
- User wants AIVI to take over and fully rewrite the document

Expected capabilities:
- Full summary generation
- Strong bullet rewrites throughout
- Cleaner structure
- ATS-first formatting
- New skills section organization
- New role-targeted version output

### 6.4 Create First Resume

Use case:
- Fresher or first-time user has no existing resume

Expected capabilities:
- Guided data collection
- Project-to-bullet generation
- Internship bullet generation
- Objective/summary creation
- Skill section generation
- Section ordering recommendations
- ATS-safe first resume generation

---

## 7. New Top-Level Features

### 7.1 AI Guidance Box

Add a user instruction field such as:

`What would you like changed?`

Purpose:
- Lets users control the AI
- Supports partial edits
- Makes the tool feel more intentional and less generic

Example prompts:
- "Improve only the summary"
- "Make this resume more ATS friendly"
- "Rewrite only my latest experience"
- "Make the tone more leadership-focused"
- "Shorten this to one page"

### 7.2 Optimization Controls

Allow users to choose what AIVI should optimize:

- Summary
- Experience bullets
- Skills
- Projects
- ATS keywords
- Formatting
- Leadership tone
- Quantification
- Conciseness

### 7.3 AI Autonomy Setting

Add a control for:

- `Let AI fully optimize`
- `Follow my instructions closely`

This creates trust and gives users more control over the output style.

### 7.4 Optional Job Description Input

For tailoring or rebuilding, allow:

- Target role
- Optional job description

This improves output quality and makes the builder more application-focused.

### 7.5 Tone / Style Control

Allow users to choose desired output tone:

- Professional
- Executive
- Concise
- Impact-driven
- Fresher-friendly

### 7.6 Resume Length / Format Control

Examples:

- 1-page
- 2-page
- Keep current length

### 7.7 Before / After Comparison

The future output experience should not show only the final resume.

It should also show:

- What changed
- Why it changed
- Before vs after bullets
- Keywords added
- ATS improvements

### 7.8 Version Saving

Future capability:
- Save multiple versions by target role or job

### 7.9 First Resume Guided Builder

Special flow for freshers:
- Guided form-based input
- Education-first structure
- Project-centric bullet generation
- Internship rewriting
- Resume objective generation

---

## 8. Fresher / First Resume Feature Requirements

This is a critical expansion and should be part of the official roadmap.

### 8.1 Why It Matters

Freshers often:

- Do not have a resume yet
- Do not know how to describe projects professionally
- Have no formal experience
- Need structure, not just rewriting

Without this path, AIVI excludes a large high-growth user segment.

### 8.2 Fresh Resume Input Fields

The first-resume workflow should collect:

- Full name
- Email
- Phone
- LinkedIn
- Portfolio / GitHub
- Location
- Target role
- Career objective
- Education
- College name
- Degree
- Branch / field
- Graduation year
- CGPA / percentage
- Skills
- Projects
- Internships
- Certifications
- Achievements
- Hackathons
- Positions of responsibility
- Volunteer work

### 8.3 AI Assistance for Freshers

The system should:

- Turn raw project descriptions into strong bullets
- Suggest missing sections
- Improve wording and clarity
- Convert student experience into professional signals
- Create a strong first summary/objective
- Recommend a better section order

---

## 9. Experience Principles for the Redesigned Page

The Resume Studio should feel like a premium workspace, not a simple upload form.

### 9.1 Desired UX Qualities

- Clear
- Guided
- Premium
- Trustworthy
- Controllable
- Outcome-focused

### 9.2 The Page Should Feel Like

- A writing studio
- A guided strategist workspace
- A premium optimization tool

### 9.3 The Page Should Not Feel Like

- A generic AI SaaS form
- A one-click black box
- A basic prompt box

---

## 10. Future Page Structure

The future Resume Studio page should be organized into the following blocks:

### 10.1 Strategy Header

Contains:

- Product name
- One-line promise
- Mode selector
- Trust labels such as ATS-safe / role-tailored / export-ready

### 10.2 Input Workspace

Contains:

- Resume input method
- Target role
- Optional job description
- Guidance box
- Tone/style options
- Length options

### 10.3 Optimization Controls

Contains:

- Toggles or checkboxes for what to optimize

### 10.4 Output Workspace

Contains:

- Final resume preview
- Before/after comparison
- Section-level changes
- Export / save actions

### 10.5 Fresher Guided Flow

Contains:

- Structured form sections
- Smart suggestions
- AI generation of first resume content

---

## 11. Phased Implementation Plan

This work should be executed in phases.

## Phase 0: Documentation and Planning

Objective:
- Finalize product direction before design or code work

Tasks:
- Create official Resume Builder enhancement document
- Confirm product naming direction
- Confirm the four core user flows
- Align roadmap with future full-site redesign planning

Deliverables:
- This document
- Approved product scope

## Phase 1: Design-Only Exploration

Objective:
- Redesign the Resume Studio experience visually and structurally without changing code

Tasks:
- Create wireframe for Resume Studio
- Explore multiple visual concepts
- Define final layout blocks
- Define fresher flow entry
- Define partial edit / full rebuild UX
- Define premium output view structure

Deliverables:
- Final page concept
- Final information architecture
- Final design system direction for this feature

Important:
- No production code changes yet

## Phase 2: Core Workflow Refactor

Objective:
- Replace the current one-path builder with a structured multi-mode system

Tasks:
- Add entry path selector
- Add guidance box
- Add optimization controls
- Add autonomy setting
- Add job description input
- Add tone selector
- Add length selector

Deliverables:
- New Resume Studio input experience

## Phase 3: Existing Resume Intelligence Upgrade

Objective:
- Improve the editing and rebuild experience for users who already have a resume

Tasks:
- Support partial edits
- Support targeted tailoring
- Support full rebuild
- Improve prompts and backend handling for each mode
- Improve output structure and result rendering

Deliverables:
- Better output quality
- Better user control
- Better relevance per use case

## Phase 4: Fresher / First Resume Flow

Objective:
- Launch the create-first-resume experience

Tasks:
- Build structured fresher input flow
- Generate summaries/objectives
- Convert projects/internships into bullets
- Add student-specific templates
- Add missing-section suggestions

Deliverables:
- End-to-end fresher resume generation flow

## Phase 5: Output Premium Layer

Objective:
- Make results feel more premium and differentiated

Tasks:
- Add before/after diff
- Show why changes were made
- Show keywords added
- Show ATS impact summary
- Add improved section navigation

Deliverables:
- More compelling output UX
- Stronger perceived product value

## Phase 6: Versioning and Growth Features

Objective:
- Improve retention and monetization

Tasks:
- Save multiple resume versions
- Save versions by job/role
- Add score comparisons between versions
- Add role-based template suggestions
- Add future resume-to-cover-letter or resume-to-LinkedIn bridges

Deliverables:
- Better retention loop
- Stronger premium positioning

---

## 12. Recommended Execution Order

The recommended order of work is:

1. Finalize this documentation
2. Complete the full-site design direction exploration
3. Finalize the Resume Studio visual/UX design
4. Begin phased implementation of Resume Studio
5. Expand to fresher flow
6. Add premium output and versioning

This sequence reduces rework and ensures the resume feature aligns with the broader website redesign.

---

## 13. Monetization Opportunities

The upgraded Resume Studio can support stronger monetization.

### 13.1 Free Tier

Potential access:

- Limited preview
- Limited quick edit usage
- Partial output visibility

### 13.2 Starter Tier

Potential access:

- Full tailoring
- Full rebuild
- Multiple generations per month

### 13.3 Pro Tier

Potential access:

- Unlimited rebuilds
- Version saving
- Before/after comparison
- Export formats
- Premium tone presets
- Fresher plus advanced role kits

---

## 14. Success Metrics

Once implemented, success should be evaluated using:

- Resume Builder usage rate
- Completion rate per mode
- Fresher flow adoption
- Upgrade conversion rate from Resume Studio
- Repeat usage per user
- Saved version count
- Export/download rate

---

## 15. Risks to Avoid

- Overloading the first screen with too many fields
- Mixing fresher and existing-resume flows in a confusing way
- Keeping the UX too close to a generic AI prompt box
- Implementing features before final design direction is approved
- Launching too many modes without clear onboarding

---

## 16. Immediate Next Step

After this document:

1. Move into the **design phase**
2. Redesign the complete website direction first
3. Finalize the Resume Studio design without altering production code
4. Return to this document as the implementation source of truth
5. Build Resume Studio phase by phase

---

## 17. Final Positioning Statement

The upgraded AIVI Resume Builder should no longer be positioned as just a rebuild tool.

It should become:

**AIVI Resume Studio**

A structured workspace that helps users:

- improve an existing resume
- tailor it for a role
- fully rebuild it
- or create a first resume from scratch

This is the correct long-term direction for both product quality and market differentiation.

---
### 🌐 Live Production & Infrastructure Baseline (August 17, 2026)
* **B2C Platform (`aivilabs.com`)**: Resume Studio v2 (4 creation paths), Job Fit Analysis (0-100% match radar), Vernacular Voice AI (Hindi/Hinglish/English), Skill Gap Roadmap, Promotion Readiness, Portfolio Analyzer.
* **B2B Campus OS (`campus.aivilabs.com`)**: Institutional white-label portal, SAML/OIDC SSO, Bulk Student Directory CSV Import, Placement Drives Pipeline Manager, Verified Student Resume Vault & ZIP Exporter (`exportResumePackage`), NAAC Criterion 5.2.1 & NIRF Metric 3.a Accreditation Audit Generator (`generateAccreditationReport`).
* **Transactional Email Gateway**: Zoho Mail India (`smtppro.zoho.in`, Port 465 SSL, `hello@aivilabs.com`).
* **Payment Gateway**: Razorpay Live Mode (`rzp_live_TEYQVaN7SquSvs`), HMAC-SHA256 signature verified webhooks (`/webhooks/razorpay`).
* **Hosting & VPS**: Hostinger KVM 4 VPS (`187.127.134.92`, Port 22 SSH), Staging (`/var/www/staging-aivi-campus/html`) & Production (`/var/www/aivi-campus/html`).
* **Deployment Safety Protocol**: Rules D1-D6 banning automatic deploys. Production deploys require explicit prompt `"DEPLOY"`.
