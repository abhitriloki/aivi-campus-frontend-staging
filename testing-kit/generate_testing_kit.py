from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Iterable

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation


ROOT = Path(__file__).resolve().parent
TODAY = "June 1, 2026"
VERSION = "v1.0"
PRODUCT = "AIVI Career Intelligence OS"
TAGLINE = "AI career analysis, resume rebuilding, and job-fit intelligence in one connected workspace."


NAV_ROUTES = [
    ("/", "Main landing page"),
    ("/about", "Company and product overview"),
    ("/how-it-works", "How AIVI workflow works"),
    ("/what-is-aivi", "Explainer page"),
    ("/ai-resume-builder", "Public resume builder page"),
    ("/linkedin-optimization", "Public LinkedIn optimization page"),
    ("/contact", "Contact form"),
    ("/privacy", "Privacy policy"),
    ("/terms", "Terms of service"),
    ("/ai-resume-builder-for-freshers", "Fresher SEO landing page"),
    ("/resume-scoring-software", "Resume scoring SEO page"),
    ("/job-fit-analysis-tool", "Job-fit SEO page"),
    ("/career-gap-analysis-ai", "Career gap SEO page"),
    ("/ai-vs-chatgpt-vs-gemini", "Comparison SEO page"),
    ("/auth", "Login and signup"),
    ("/login", "Auth alias"),
    ("/verify-email", "Email verification page"),
    ("/dashboard", "Dashboard home"),
    ("/dashboard/resume", "Resume Intelligence"),
    ("/dashboard/builder", "Resume Studio"),
    ("/dashboard/job-fit", "Job Fit Analysis"),
    ("/dashboard/roadmap", "Skill Roadmap"),
    ("/dashboard/interview", "Interview Prep"),
    ("/dashboard/promotion", "Promotion Readiness"),
    ("/dashboard/portfolio", "Portfolio Analyzer"),
    ("/dashboard/linkedin", "LinkedIn Analyzer"),
    ("/dashboard/settings", "Settings and billing"),
    ("/dashboard/admin", "Admin dashboard"),
]

FUNCTIONS = [
    ("onUserSignupComplete", "Auth trigger", "Creates profile, free plan, and user role documents."),
    ("applyCoupon", "Callable", "Applies FIRST1000 beta Starter trial with transaction cap."),
    ("checkUsage", "Callable", "Reads plan limits before a user starts an analysis."),
    ("getUserPlanInfo", "Callable", "Returns plan, trial, and quota data for UI display."),
    ("careerAnalysis", "Callable", "Main Gemini-backed endpoint for resume, job fit, roadmap, interview, promotion, portfolio, and resume rebuild."),
    ("saveAnalysisResult", "Callable", "Saves client-computed scores with an analysis result."),
    ("extractPdf", "Callable", "Extracts text from PDF resumes through Gemini multimodal processing."),
    ("adminUpdateUser", "Callable", "Admin-only role, plan, and quota override."),
    ("linkedinAnalyze", "Callable", "Analyzes LinkedIn profile text."),
    ("linkedinOptimize", "Callable", "Generates optimized LinkedIn profile copy from a prior analysis."),
    ("submitContactForm", "Callable", "Stores contact form messages and optionally emails hello@aivilabs.com."),
    ("createPaymentOrder", "Callable", "Creates server-priced Razorpay orders for Starter and Pro."),
    ("razorpayWebhook", "HTTP", "Verifies signed Razorpay events and grants or revokes paid access."),
    ("deleteMyAccount", "Callable", "Deletes a user's product data and Firebase Auth account."),
    ("healthz", "HTTP", "Simple service health endpoint."),
]

PLANS = [
    ("Free", "INR 0", "2 resume analyses, 2 job-fit analyses, 2 LinkedIn analyses, 1 each for roadmap/interview/promotion/portfolio. No resume rebuild or LinkedIn optimization."),
    ("Starter", "INR 399/month", "30 monthly analyses, beta trial eligibility through FIRST1000, premium workflows unlocked."),
    ("Pro", "INR 599/month", "Unlimited analysis usage in current implementation, premium workflows, priority/heavy user access."),
    ("Admin", "Internal", "Unlimited platform access, admin dashboard, role and plan management."),
]

TECH_STACK = [
    "React 18, Vite, TypeScript, React Router DOM",
    "Tailwind CSS, shadcn-style local UI components, Radix UI, Lucide icons, Framer Motion",
    "Firebase Auth, Cloud Firestore, Firebase Cloud Functions, Firebase Hosting",
    "Gemini model gemini-2.5-flash through server-side functions",
    "Razorpay Checkout, Razorpay Orders API, signed Razorpay webhooks",
    "Nodemailer with Hostinger SMTP for contact form notifications",
    "jsPDF and docx for resume export",
]


def set_cell_shading(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_table_borders(table) -> None:
    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = OxmlElement(f"w:{edge}")
        tag.set(qn("w:val"), "single")
        tag.set(qn("w:sz"), "4")
        tag.set(qn("w:space"), "0")
        tag.set(qn("w:color"), "DADCE0")
        borders.append(tag)
    tbl_pr.append(borders)


def add_toc(doc: Document) -> None:
    p = doc.add_paragraph()
    run = p.add_run()
    fld_char = OxmlElement("w:fldChar")
    fld_char.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = 'TOC \\o "1-3" \\h \\z \\u'
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "separate")
    fld_char3 = OxmlElement("w:fldChar")
    fld_char3.set(qn("w:fldCharType"), "end")
    run._r.extend([fld_char, instr, fld_char2, fld_char3])
    doc.add_paragraph("Right-click this table in Microsoft Word and choose Update Field if page numbers are not shown immediately.")


def apply_doc_styles(doc: Document) -> None:
    section = doc.sections[0]
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.15

    for name, size, color, before, after in [
        ("Heading 1", 16, "2E74B5", 16, 8),
        ("Heading 2", 13, "2E74B5", 12, 6),
        ("Heading 3", 12, "1F4D78", 8, 4),
    ]:
        style = styles[name]
        style.font.name = "Calibri"
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(color)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)


def cover(doc: Document, subtitle: str) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(PRODUCT)
    r.font.size = Pt(26)
    r.font.bold = True
    r.font.color.rgb = RGBColor.from_string("0B2545")
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(TAGLINE)
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor.from_string("555555")
    doc.add_paragraph()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(subtitle)
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = RGBColor.from_string("2E74B5")
    doc.add_paragraph()
    meta = doc.add_table(rows=3, cols=2)
    meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    rows = [("Version", VERSION), ("Date", TODAY), ("Prepared for", "AIVI Labs QA onboarding")]
    for i, (k, v) in enumerate(rows):
        meta.cell(i, 0).text = k
        meta.cell(i, 1).text = v
        for c in meta.row_cells(i):
            c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    set_table_borders(meta)
    doc.add_page_break()


def add_bullets(doc: Document, items: Iterable[str]) -> None:
    for item in items:
        doc.add_paragraph(item, style="List Bullet")


def add_numbered(doc: Document, items: Iterable[str]) -> None:
    for item in items:
        doc.add_paragraph(item, style="List Number")


def add_table(doc: Document, headers: list[str], rows: list[list[str]]) -> None:
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        set_cell_shading(cell, "E8EEF5")
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.bold = True
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            cells[i].text = value


def add_sheet_explanation(doc: Document, sheet_name: str, purpose: str, columns: list[tuple[str, str]], sample: str, mistakes: list[str]) -> None:
    doc.add_heading(sheet_name, level=3)
    doc.add_paragraph(f"What this sheet is for: {purpose}")
    add_table(doc, ["Column", "Plain-English meaning"], [[c, d] for c, d in columns])
    doc.add_paragraph("How to fill it correctly:")
    doc.add_paragraph(sample)
    doc.add_paragraph("Common mistakes to avoid:")
    add_bullets(doc, mistakes)
    doc.add_paragraph("Status values: Pass means the product behaved correctly. Fail means a bug was found. Blocked means you could not test because setup, access, data, or another bug stopped you. Not Tested means the row is planned but has not been executed yet.")
    doc.add_paragraph("Severity levels: Critical means users, money, private data, or production deployment are at serious risk. High means a main workflow is broken or a serious security weakness exists. Medium means an important feature is wrong but there is a workaround. Low means a small UI, wording, or polish issue.")
    doc.add_paragraph("Escalate immediately when the bug affects login, payment, plan access, data privacy, admin access, account deletion, or any vulnerability that exposes another user's data. For small layout or wording issues, log the bug and continue testing.")


def build_teaching_script() -> None:
    doc = Document()
    apply_doc_styles(doc)
    cover(doc, "Intern Onboarding & Teaching Guide")
    doc.add_heading("Table of Contents", level=1)
    add_toc(doc)

    doc.add_heading("Section 1 - Welcome & What We Do", level=1)
    doc.add_paragraph("Welcome to AIVI Labs. Let us start from zero. AIVI stands for Artificial Intelligence Visibility Insights. In simple words, we help students, job seekers, and working professionals understand why their resume, LinkedIn profile, or job application is not getting the right result, and then we help them improve it.")
    doc.add_paragraph("The problem we are solving is very practical. Many people apply for jobs, but they do not know whether their resume is clear, whether it matches the job description, whether it will pass ATS software, or whether their LinkedIn profile looks strong to a recruiter. AIVI gives them structured feedback, scores, action plans, and improved resume or LinkedIn content.")
    doc.add_paragraph("Our customers are freshers, active job seekers, career switchers, mid-level professionals, and people preparing for promotion. The product matters because career decisions affect income, confidence, and opportunity. A confusing or insecure product can hurt real users at a very important moment.")
    doc.add_paragraph("Your job for the next 3 months is to find everything that is broken, confusing, or insecure in this product before real users and paying customers start using it. You are the last line of defence before we go live.")

    doc.add_heading("Section 2 - Understanding the Product (Product Brief)", level=1)
    doc.add_paragraph("When a user lands on the website, they first see public pages that explain AIVI, the tools, and the benefits. They can read pages like About, How It Works, AI Resume Builder, LinkedIn Optimization, Resume Scoring Software, and Job Fit Analysis Tool. If they want to use the product, they go to Auth or Login.")
    add_numbered(doc, [
        "Landing page: the user learns what AIVI does and clicks a call-to-action.",
        "Signup: the user creates an account with email/password or Google. A verification email is sent.",
        "Verify email: the user must verify the email before protected dashboard tools work.",
        "Login: Firebase Auth stores the session in browser local persistence.",
        "Dashboard: the user sees plan status, recent analysis history, and feature entry points.",
        "Core action: the user uploads or pastes career content, such as a resume, job description, LinkedIn text, role target, or project list.",
        "Result: the backend calls Gemini, stores the result in Firestore, and the frontend renders scores, guidance, action plans, or generated resume content.",
        "Billing: if the user exceeds free limits or wants premium tools, they can apply FIRST1000 or pay through Razorpay for Starter or Pro.",
    ])
    doc.add_heading("Major features", level=2)
    add_table(doc, ["Feature", "What it does"], [
        ["Resume Intelligence", "Analyzes resume quality, ATS compatibility, keywords, quantified impact, leadership signal, clarity, weak bullets, and missing sections."],
        ["Job Fit Analysis", "Compares resume text with a job description, calculates match score, highlights missing skills, and sends context into Resume Studio."],
        ["Resume Studio", "Generates or tailors a resume from full rebuild, quick edit, JD tailor, or first-resume modes, with PDF and DOCX export."],
        ["Skill Roadmap", "Turns missing skills into a 30/60/90-day learning plan with resources and project ideas."],
        ["Interview Prep", "Creates technical, behavioral, resume-defense, case-study, and weak-area interview questions."],
        ["Promotion Readiness", "Compares current role and target role, then gives readiness score, gaps, and action plan."],
        ["Portfolio Analyzer", "Reviews projects for technical depth and attractiveness to hiring teams."],
        ["LinkedIn Analyzer", "Scores LinkedIn profile authority, recruiter visibility, keyword quality, and brand clarity."],
        ["LinkedIn Optimize", "Creates improved LinkedIn headline, About section, and experience content."],
        ["Admin Dashboard", "Lets admins review users, plans, usage, contact messages, and update roles/plans."],
        ["Settings", "Lets users edit profile, change password, manage billing/trial, notifications, and delete account."],
    ])
    doc.add_heading("User types", level=2)
    add_table(doc, ["User type", "What they can do"], [
        ["Free user", "Use limited lifetime analyses: resume 2, job fit 2, LinkedIn analyze 2, and 1 each for roadmap, interview, promotion, and portfolio. Cannot use resume rebuild or LinkedIn optimization."],
        ["Paid Starter user", "Use 30 monthly analyses and premium workflows. Starter costs INR 399/month or may be granted for 30 days through FIRST1000."],
        ["Paid Pro user", "Use the platform as a heavy user with unlimited analysis behavior in the current implementation. Pro costs INR 599/month."],
        ["Admin", "Bypasses normal limits, sees admin dashboard, manages roles/plans, resets quotas, and reads operational data allowed by rules."],
    ])
    doc.add_heading("Pricing plans", level=2)
    add_table(doc, ["Plan", "Price", "Includes"], PLANS)
    doc.add_heading("Payments in simple terms", level=2)
    doc.add_paragraph("The user does not create their own payment amount. The frontend asks the backend to create an order for Starter or Pro. The backend uses fixed prices from code: Starter INR 399/month and Pro INR 599/month. Razorpay Checkout opens in the browser. After payment, Razorpay sends a signed webhook to the backend. The backend verifies the signature, checks the amount and currency, records the event once, and only then updates the user's plan.")
    doc.add_heading("What happens in the background when a core action runs", level=2)
    add_numbered(doc, [
        "The frontend checks that the user is logged in and email verified.",
        "The page calls a Firebase Cloud Function, not Gemini directly.",
        "The function validates the input using schemas, checks rate limits, checks quota, and checks admin status.",
        "If allowed, the function wraps user text safely and sends it to Gemini using a strict JSON prompt.",
        "The function parses the JSON answer, estimates token cost, saves the result in analysis_results, and logs usage in ai_usage_logs.",
        "The frontend receives the result, displays it, and may also save client-computed scores.",
    ])

    doc.add_heading("Section 3 - Tools You Will Use", level=1)
    tools = [
        ("Browser DevTools", [
            "Browser DevTools is a built-in testing window in Chrome or Edge. Open it with F12 or Ctrl+Shift+I.",
            "The Network tab shows every request the page makes, including Firebase callable functions, scripts, images, and errors. Use it to see whether a request succeeded, failed, was blocked, or returned the wrong status.",
            "The Console tab shows JavaScript errors, warnings, and logs. Use it to catch frontend crashes, missing environment variables, Firebase permission errors, and failed payment script loading.",
        ]),
        ("Postman", [
            "Postman is an API testing tool. Install it from postman.com.",
            "A GET request asks a server for data. A POST request sends data to a server. For Firebase callable functions, most calls are POST-like because the frontend sends structured data.",
            "To add an auth token, open Authorization, choose Bearer Token, and paste a valid Firebase ID token. Then send the request and check status, JSON body, error messages, and whether sensitive fields are exposed.",
        ]),
        ("Burp Suite Community Edition", [
            "Burp Suite is a web security testing proxy. It sits between the browser and the internet so you can inspect and modify requests.",
            "Install Burp Community, set the browser proxy to 127.0.0.1:8080, and install Burp's CA certificate if testing HTTPS.",
            "An intercepted request shows method, URL, headers, cookies or auth data, and body. You can forward it, drop it, or send it to Repeater to change fields like planType, analysisType, or IDs and see if the backend blocks tampering.",
        ]),
        ("OWASP ZAP", [
            "OWASP ZAP is a free security scanner. Install it from zaproxy.org.",
            "For a basic scan, start ZAP, enter the local or staging site URL, spider the site, then run an active scan only against approved test environments.",
            "Results are alerts. High risk alerts need immediate review. Medium and low alerts still need logging, but many scanner findings require manual confirmation.",
        ]),
        ("Excel Testing Tracker", [
            "The tracker is the single source of truth for test cases, security checks, bugs, daily progress, and final readiness.",
            "Do not keep separate private lists. If it is tested, blocked, or broken, it belongs in the tracker.",
        ]),
        ("Loom or screen recorder", [
            "Use Loom, Windows Snipping Tool video capture, or another recorder when a bug is hard to explain with one screenshot.",
            "Record the URL, the action, the exact wrong result, the console or network error if visible, and the expected result in your voice or notes.",
        ]),
    ]
    for title, paras in tools:
        doc.add_heading(title, level=2)
        for para in paras:
            doc.add_paragraph(para)

    doc.add_heading("Section 4 - How to Use the Testing Tracker (Excel)", level=1)
    add_sheet_explanation(
        doc,
        "Functional Test Cases",
        "Use this sheet to test every normal product feature and user flow.",
        [
            ("Test ID", "Unique ID, for example FT-001."),
            ("Module", "Product area, for example Auth or Resume Studio."),
            ("Test Scenario", "What you are testing in one clear sentence."),
            ("Pre-conditions", "What must be ready before testing, such as a verified user."),
            ("Steps to Reproduce", "Exact numbered steps the tester follows."),
            ("Expected Result", "What should happen if the product is correct."),
            ("Actual Result", "What really happened during testing."),
            ("Status", "Pass, Fail, Blocked, or Not Tested."),
            ("Severity", "Critical, High, Medium, or Low based on user/business impact."),
            ("Tester Name", "Your name."),
            ("Date Tested", "The date you ran the test."),
            ("Screenshot/Video Link", "Evidence link if needed."),
            ("Notes", "Extra context such as browser, account, or test data."),
        ],
        "Sample row: FT-021 | Job Fit Analysis | Analyze resume against JD | Verified free user with remaining job-fit quota | 1. Login 2. Open /dashboard/job-fit 3. Paste resume 4. Paste JD 5. Click Analyze | A score, missing skills, breakdown, and action plan appear | Score appeared and action plan rendered | Pass | High | Priya | 2026-06-07 | Loom link | Tested on Chrome.",
        ["Writing vague steps like 'test job fit'.", "Leaving failed Actual Result blank.", "Using Critical for small spelling mistakes.", "Forgetting evidence for Fail rows."],
    )
    add_sheet_explanation(
        doc,
        "Security Test Cases",
        "Use this sheet to test attack vectors and security controls.",
        [
            ("Test ID", "Unique security test ID, for example ST-001."),
            ("Attack Category", "OWASP or product-specific category such as Broken Auth or Payment Bypass."),
            ("Attack Name", "The specific attack, such as Change planType in createPaymentOrder."),
            ("Target (URL or Endpoint)", "Route, callable function, webhook, or Firestore collection."),
            ("Method", "Manual, Postman, Burp, ZAP, or DevTools."),
            ("Payload or Input Used", "The suspicious input you used."),
            ("Expected Behaviour", "The safe behavior expected."),
            ("Actual Behaviour", "What happened."),
            ("Vulnerable (Y/N)", "Y if exploitable, N if properly blocked."),
            ("Severity", "Risk level if vulnerable."),
            ("Tester Name", "Your name."),
            ("Date Tested", "Date of test."),
            ("Notes", "Evidence, tokens used, account type, or scanner finding reference."),
        ],
        "Sample row: ST-011 | Payment Bypass | Change client plan to pro without payment | user_plans/{uid} | Burp/Console | Attempt Firestore write plan_type='pro' | Firestore denies write | Permission denied | N | Critical | Rahul | 2026-06-12 | Rules blocked client write.",
        ["Testing active scans against production without approval.", "Marking Vulnerable=Y without reproducing manually.", "Pasting real secrets into the tracker.", "Not recording the exact endpoint."],
    )
    add_sheet_explanation(
        doc,
        "Bug Tracker",
        "Use this sheet to log every confirmed defect found from functional, security, UI, performance, or content testing.",
        [
            ("Bug ID", "Unique ID, for example BUG-001."),
            ("Date Reported", "When you found it."),
            ("Product", "AIVI Career Intelligence OS."),
            ("Module", "Where the bug belongs."),
            ("Bug Title", "Short clear title."),
            ("Description", "Plain explanation of the problem."),
            ("Steps to Reproduce", "Exact numbered steps."),
            ("Expected", "Correct behavior."),
            ("Actual", "Wrong behavior."),
            ("Severity", "Impact level."),
            ("Priority", "How urgently the team should fix it."),
            ("Status", "Open, In Progress, Fixed, Verified, or Closed."),
            ("Reported By", "Your name."),
            ("Assigned To", "Owner if known."),
            ("Fixed By", "Developer who fixed it."),
            ("Date Fixed", "Fix date."),
            ("Verified By", "Tester who retested."),
            ("Date Verified", "Verification date."),
            ("Notes", "Screenshots, logs, links, or environment details."),
        ],
        "Sample row: BUG-004 | 2026-06-10 | AIVI Career Intelligence OS | Settings/Billing | Starter checkout opens wrong amount | User selected Starter but Razorpay displayed Pro amount | 1. Login 2. Settings 3. Click Starter upgrade | Razorpay should show INR 399 | Razorpay showed INR 599 | Critical | P0 | Open | Asha | Founder |  |  |  |  | Screen recording link.",
        ["Logging duplicate bugs without linking them.", "Writing emotional titles like 'Everything broken'.", "Skipping expected vs actual result.", "Closing a bug without verification."],
    )
    add_sheet_explanation(
        doc,
        "Daily Log",
        "Use this sheet every day to record what you tested and what you found.",
        [
            ("Date", "Work date."),
            ("Intern Name", "Your name."),
            ("Product", "AIVI Career Intelligence OS."),
            ("Module Tested", "Area tested that day."),
            ("Test Cases Completed", "How many tracker rows you executed."),
            ("Bugs Found (count)", "Number of new confirmed bugs."),
            ("Bug IDs", "IDs logged that day."),
            ("Blockers", "Anything preventing progress."),
            ("Hours Spent", "Time spent testing."),
            ("Notes", "Short summary."),
        ],
        "Sample row: 2026-06-14 | Neha | AIVI Career Intelligence OS | Auth and Verify Email | 9 | 2 | BUG-007, BUG-008 | Google login test account not available | 4 | Completed email/password flows.",
        ["Waiting until Friday to fill daily activity.", "Counting exploratory clicks as completed test cases without tracker IDs.", "Writing blockers without asking for help."],
    )
    add_sheet_explanation(
        doc,
        "Sign-Off Dashboard",
        "This sheet summarizes test progress automatically with formulas.",
        [
            ("Metric", "The thing being counted, such as Passed or Critical bugs open."),
            ("Value", "Formula result based on tracker sheets."),
            ("Notes", "Explanation or readiness meaning."),
        ],
        "Sample use: if Functional Passed says 45 and Functional Total says 60, the team knows 15 functional rows still need work. If Critical bugs open is more than zero, production is not ready.",
        ["Typing manual numbers over formulas.", "Deleting formula rows.", "Calling production ready while Critical or High payment/auth bugs are open."],
    )

    doc.add_heading("Section 5 - Rules, Conduct & Expectations", level=1)
    add_bullets(doc, [
        "Daily standup time: 10:00 AM IST. Format: what did I test yesterday, what did I find, what am I testing today, and what blockers do I have.",
        "Weekly review: every Friday. The tracker must be up to date, all bugs must have evidence, and all failed cases must link to Bug IDs.",
        "Critical bugs: do not wait for standup. Message the founder directly when login, payment, personal data, admin access, account deletion, or cross-user data exposure is affected.",
        "Data confidentiality: you are looking at real product code, payment flows, and possibly user data. Nothing leaves the team. No screenshots on personal social media. No sharing credentials.",
        "Ask for help: try for 20 minutes first. Write what you tried, what you expected, what happened, and the exact error. Then ask.",
        "Certificate conditions: complete all 3 months, submit the final test report, attend all reviews, keep tracker evidence clean, and behave professionally.",
        "Professional behavior: be punctual, honest, careful with production-like data, and never fake test results.",
    ])

    doc.add_heading("Section 6 - Week-by-Week Testing Plan", level=1)
    week_rows = []
    focuses = [
        ("Product orientation and public pages", "Functional Test Cases, Daily Log", "Browser, DevTools", "All public routes smoke-tested with mobile and desktop notes."),
        ("Auth and protected routing", "Functional Test Cases, Bug Tracker", "Browser, DevTools, Postman", "Signup, login, Google login, password reset, email verification, and session persistence tested."),
        ("Dashboard shell and navigation", "Functional Test Cases, Daily Log", "Browser, DevTools", "Sidebar, dashboard cards, history, plan banner, and sign-out verified."),
        ("Resume Intelligence", "Functional Test Cases, Bug Tracker", "Browser, DevTools, Loom", "Resume paste/upload, PDF extraction, analysis rendering, and history tested."),
        ("Job Fit Analysis and Resume Studio bridge", "Functional Test Cases", "Browser, DevTools", "Resume plus JD analysis and Tailor Resume For This JD bridge tested."),
        ("Resume Studio exports", "Functional Test Cases, Bug Tracker", "Browser, DevTools, Word/PDF viewer", "Full rebuild, quick edit, JD tailor, first resume, PDF export, and DOCX export tested."),
        ("Roadmap, Interview, Promotion, Portfolio", "Functional Test Cases", "Browser, DevTools", "All remaining AI modules tested with valid and invalid inputs."),
        ("LinkedIn and Settings", "Functional Test Cases, Bug Tracker", "Browser, DevTools", "LinkedIn analyze/optimize, profile, password, coupon, billing, notifications, and account deletion tested."),
        ("Payment and trial system", "Functional Test Cases, Security Test Cases", "Browser, DevTools, Burp, Postman", "FIRST1000, Starter/Pro checkout, webhook assumptions, and plan updates validated."),
        ("Security testing", "Security Test Cases, Bug Tracker", "Burp, OWASP ZAP, Postman", "OWASP Top 10 and Firebase-specific authorization checks tested."),
        ("Regression and performance", "Functional Test Cases, Daily Log", "Browser, DevTools Lighthouse/Performance", "Failed areas retested, load/performance observations logged."),
        ("Final sign-off", "Sign-Off Dashboard, Final Report", "Excel, Word, Browser", "Tracker complete, final report submitted, readiness recommendation prepared."),
    ]
    for i, row in enumerate(focuses, start=1):
        week_rows.append([f"Week {i}", *row])
    add_table(doc, ["Week", "Focus area", "Tracker sheet", "Tools", "End deliverable"], week_rows)

    doc.add_heading("Section 7 - How to Write a Good Bug Report", level=1)
    doc.add_paragraph("A good bug report helps a developer reproduce the issue without calling you. It has a clear title, exact steps, expected result, actual result, severity, evidence, and the URL or endpoint.")
    add_table(doc, ["Bad example", "Good example"], [[
        "Title: Payment broken. Steps: Click payment. Result: Not working.",
        "Title: Starter checkout opens but does not show Razorpay window after createPaymentOrder succeeds. Steps: 1. Login as verified free user. 2. Open /dashboard/settings. 3. Click Upgrade to Starter. 4. Watch Network tab for createPaymentOrder. Expected: Razorpay checkout opens with INR 399. Actual: createPaymentOrder returns 200, but no checkout appears and Console shows Razorpay checkout is unavailable. Severity: Critical. Evidence: Loom link and Console screenshot. URL: /dashboard/settings."
    ]])

    doc.add_heading("Section 8 - Common Bugs to Look For (Cheat Sheet)", level=1)
    cheat = {
        "UI/UX bugs": ["Buttons hidden on mobile matter because users may be unable to complete signup or analysis.", "Text overlap or unreadable colors matter because users may misunderstand results.", "Broken links matter because landing pages drive trust and conversion."],
        "Functional bugs": ["Forms accepting empty or invalid inputs waste AI calls and frustrate users.", "Analysis result sections missing means the AI JSON or frontend renderer may be out of sync.", "History not loading means users lose access to previous work."],
        "Auth bugs": ["Unverified users entering dashboard weakens account trust controls.", "Admin menu showing to normal users is a serious authorization signal.", "Session loss after refresh creates a poor dashboard experience."],
        "Payment bugs": ["Wrong amount in checkout can cause revenue and trust damage.", "Plan becoming Pro without verified webhook is a critical payment bypass.", "Refund/dispute not downgrading access can create free paid usage."],
        "Security issues": ["IDOR means one user can read or change another user's data by changing an ID.", "XSS means malicious script can run in another user's browser.", "API key exposure means attackers can spend company money or attack backend services.", "Rate limit bypass can burn Gemini cost."],
        "Performance issues": ["Slow dashboard loads can hide important controls and increase bounce.", "Large resume export bundle can delay the Resume Studio page.", "Admin loading all logs can become expensive and slow at scale."],
    }
    for cat, items in cheat.items():
        doc.add_heading(cat, level=2)
        add_bullets(doc, items)

    doc.save(ROOT / "01_Intern_Teaching_Script.docx")


def build_product_brief() -> None:
    doc = Document()
    apply_doc_styles(doc)
    cover(doc, "Product Brief (Founder Reference)")
    doc.add_heading("Product Overview", level=1)
    doc.add_paragraph(f"{PRODUCT} is a Firebase-backed AI career platform that helps users diagnose, improve, and act on career readiness across resumes, job descriptions, skills, interviews, portfolios, promotions, and LinkedIn profiles.")
    doc.add_heading("Problem Being Solved", level=1)
    doc.add_paragraph("Job seekers and professionals use disconnected tools. AIVI connects diagnosis and action: analyze the resume, compare it with a JD, identify gaps, rebuild the resume, create a skill plan, and prepare for interviews.")
    doc.add_heading("Target Users", level=1)
    add_bullets(doc, ["Freshers and college graduates", "Active job seekers", "Career switchers", "Mid-level professionals pursuing better roles", "Employees preparing for promotion", "Admins/founders monitoring product readiness and costs"])
    doc.add_heading("Core Value Proposition", level=1)
    doc.add_paragraph("AIVI turns raw career material into structured, job-specific intelligence and improved documents, reducing guesswork and expensive manual coaching.")
    doc.add_heading("Full Feature List", level=1)
    add_table(doc, ["Area", "Capability"], [
        ["Public site", "Landing, About, How It Works, What Is AIVI, product/SEO pages, Contact, Privacy, Terms."],
        ["Auth", "Email signup/login, Google login, email verification, password reset, local persistence."],
        ["Dashboard", "Plan status, analysis history, feature launch points, usage prompt."],
        ["AI modules", "Resume, job fit, roadmap, interview, promotion, portfolio, resume rebuild, LinkedIn analyze, LinkedIn optimize."],
        ["Exports", "Resume Studio PDF and DOCX export."],
        ["Billing", "FIRST1000 trial, Razorpay Starter/Pro checkout, signed webhook entitlement updates."],
        ["Admin", "User/plan/role visibility, quota reset, AI usage and contact message review."],
        ["Privacy", "Self-service account deletion through deleteMyAccount."],
    ])
    doc.add_heading("All User Flows", level=1)
    add_bullets(doc, [f"{route}: {purpose}" for route, purpose in NAV_ROUTES])
    doc.add_heading("Pricing Plans", level=1)
    add_table(doc, ["Plan", "Price", "Includes"], PLANS)
    doc.add_heading("Payment and Billing Flow", level=1)
    add_numbered(doc, [
        "User selects Starter or Pro from Settings.",
        "Frontend calls createPaymentOrder with planType only.",
        "Cloud Function validates auth and plan type, then creates a Razorpay order using server-side prices.",
        "Razorpay Checkout opens with key ID, order ID, amount, currency, and prefill details.",
        "Razorpay sends signed webhook events to razorpayWebhook.",
        "Webhook verifies signature, deduplicates event, checks amount/currency, and grants plan on payment.captured.",
        "Failed, refunded, disputed, cancelled, halted, or completed events suspend or downgrade access.",
    ])
    doc.add_heading("Tech Stack Summary", level=1)
    add_bullets(doc, TECH_STACK)
    doc.add_heading("External APIs Used", level=1)
    add_table(doc, ["External API/service", "Use"], [
        ["Google Gemini", "AI JSON analysis, resume rebuild, LinkedIn optimization, PDF text extraction."],
        ["Firebase Auth", "User identity, Google sign-in, email verification, password reset."],
        ["Cloud Firestore", "Profiles, user plans, roles, analysis results, usage logs, payment records, contact messages."],
        ["Firebase Cloud Functions", "Trusted backend validation, AI calls, payments, admin updates, deletion."],
        ["Razorpay", "Payment orders, checkout, signed webhooks."],
        ["Hostinger SMTP via Nodemailer", "Contact form email notifications."],
    ])
    doc.add_heading("Known Limitations", level=1)
    add_bullets(doc, [
        "Admin dashboard currently reads raw operational collections and may need aggregation before large-scale production usage.",
        "Resume Studio includes heavy PDF/DOCX export libraries; build passes but may show bundle size warnings.",
        "FIRST1000 protects beta access, but App Check or stronger anti-abuse controls should be considered if mass signup attacks appear.",
        "The documentation contains some historical collection names; actual current implementation centers on analysis_results and profiles.",
        "Formula-based job-fit scoring depends on AI returning the expected structured JSON.",
    ])
    doc.add_heading("Production Readiness Status", level=1)
    doc.add_paragraph("Status: pre-production QA-ready, not automatically production-ready. The codebase includes server-side validation, verified auth checks, Firestore rules, signed payment webhooks, rate limits, quota enforcement, and deployment documentation. Remaining readiness depends on executing the testing tracker, closing Critical/High bugs, verifying payment/webhook behavior in a Razorpay test environment, and completing final sign-off.")
    doc.save(ROOT / "02_Product_Brief_Founder.docx")


def functional_rows() -> list[list[str]]:
    rows = []
    items = [
        ("Public Site", "Landing page loads", "/", "Open / on desktop and mobile", "Hero, navigation, pricing/CTA, footer, and no console errors."),
        ("Public Site", "Global header navigation", "/", "Click Product, AI Tools, public route links", "Each menu item opens the correct route."),
        ("Public Site", "Mobile menu", "/", "Resize to mobile and open menu", "Menu opens, nested links work, no overlap."),
        ("Public Site", "Footer links", "/", "Click footer routes", "Each footer link routes correctly."),
        ("Public Site", "Cookie consent", "/", "Accept and decline cookie banner", "Choice persists and banner hides."),
        ("Public Site", "About page", "/about", "Open route and refresh", "Content renders and direct refresh works."),
        ("Public Site", "How It Works page", "/how-it-works", "Open route and refresh", "Workflow content renders."),
        ("Public Site", "What Is AIVI page", "/what-is-aivi", "Open route and refresh", "Explainer content renders."),
        ("Public Site", "AI Resume Builder public page", "/ai-resume-builder", "Open route and click CTA", "CTA leads to auth/dashboard path."),
        ("Public Site", "LinkedIn Optimization page", "/linkedin-optimization", "Open route and click CTA", "CTA works without JS errors."),
        ("Public Site", "SEO fresher page", "/ai-resume-builder-for-freshers", "Open route", "Fresher page content renders."),
        ("Public Site", "Resume Scoring SEO page", "/resume-scoring-software", "Open route", "Page renders and CTA works."),
        ("Public Site", "Job Fit Tool SEO page", "/job-fit-analysis-tool", "Open route", "Page renders and CTA works."),
        ("Public Site", "Career Gap SEO page", "/career-gap-analysis-ai", "Open route", "Page renders and CTA works."),
        ("Public Site", "AI vs tools page", "/ai-vs-chatgpt-vs-gemini", "Open route", "Page renders and comparison content is visible."),
        ("Contact", "Contact validation", "/contact", "Submit empty fields", "Validation prevents submission."),
        ("Contact", "Contact submission", "/contact", "Fill valid name, email, subject, message and submit", "submitContactForm succeeds and success toast appears."),
        ("Auth", "Email signup", "/auth", "Create account with full name, email, password", "Account created, verification email sent, user navigates to verify page."),
        ("Auth", "Email login verified user", "/auth", "Login with verified account", "User lands on /dashboard."),
        ("Auth", "Unverified user blocked", "/auth", "Login with unverified email", "User is sent to /verify-email and dashboard is blocked."),
        ("Auth", "Google login", "/auth", "Click Google", "Google popup completes and verified user reaches dashboard."),
        ("Auth", "Forgot password", "/auth", "Enter email and click Forgot password", "Password reset email request succeeds."),
        ("Auth", "Show/hide password", "/auth", "Toggle eye icon", "Password visibility toggles."),
        ("Verify Email", "Resend verification", "/verify-email", "Click resend", "Verification email request succeeds or proper error shown."),
        ("Verify Email", "Check verification", "/verify-email", "Verify account externally, click check", "User reaches dashboard after reload/check."),
        ("Protected Route", "Unauthenticated dashboard redirect", "/dashboard", "Open /dashboard in signed-out browser", "Redirects to /auth."),
        ("Dashboard", "Dashboard home loads", "/dashboard", "Login and open dashboard", "Plan banner, cards, and history render."),
        ("Dashboard", "Sidebar navigation", "/dashboard", "Click each sidebar item", "Each protected route opens and active state updates."),
        ("Dashboard", "Sidebar collapse/mobile", "/dashboard", "Collapse sidebar and test mobile menu", "Navigation stays usable."),
        ("Dashboard", "Sign out", "/dashboard", "Click sign out", "Session ends and protected routes redirect."),
        ("Resume Intelligence", "Resume paste analysis", "/dashboard/resume", "Paste resume and click Analyze", "checkUsage and careerAnalysis run; score and guidance render."),
        ("Resume Intelligence", "Resume empty input validation", "/dashboard/resume", "Attempt analyze without resume text", "User sees validation error and no AI call."),
        ("Resume Intelligence", "PDF upload/extraction", "/dashboard/resume", "Upload valid PDF resume", "extractPdf returns text or a clear error."),
        ("Resume Intelligence", "Resume stored in resumes collection", "/dashboard/resume", "Analyze resume", "resumes document is created/updated for the user."),
        ("Resume Intelligence", "Latest analysis history", "/dashboard/resume", "Run analysis then refresh", "Latest resume analysis is visible."),
        ("Job Fit", "Resume plus JD analysis", "/dashboard/job-fit", "Paste resume and job description, click Analyze", "Job-fit score, matched/missing skills, breakdown, action plan render."),
        ("Job Fit", "Missing JD validation", "/dashboard/job-fit", "Submit resume without JD", "Validation blocks or helpful error appears."),
        ("Job Fit", "Intent selector", "/dashboard/job-fit", "Change analysis intent", "Selected intent changes request context/UI state."),
        ("Job Fit", "Focus chips", "/dashboard/job-fit", "Toggle focus areas", "Chips change selected focus list."),
        ("Job Fit", "Cached duplicate job fit", "/dashboard/job-fit", "Run same resume+JD twice", "Second result may return cached=true without duplicate AI cost."),
        ("Job Fit", "Tailor Resume bridge", "/dashboard/job-fit", "Click Tailor Resume For This JD after result", "Resume Studio opens with resume, JD, target role, and guidance prefilled."),
        ("Resume Studio", "Full rebuild mode", "/dashboard/builder", "Choose Full Rebuild, enter resume and target role, generate", "resume_rebuild runs for eligible plan and preview renders."),
        ("Resume Studio", "Quick edit mode", "/dashboard/builder", "Choose Quick Edit and submit guidance", "Generated resume respects requested edits."),
        ("Resume Studio", "JD tailor mode", "/dashboard/builder", "Choose JD Tailor and include JD", "Generated resume is aligned to the JD."),
        ("Resume Studio", "First resume mode", "/dashboard/builder", "Fill fresher fields and generate", "Generated structured resume includes education/projects/skills."),
        ("Resume Studio", "Control mode selection", "/dashboard/builder", "Toggle AI control mode", "Selected mode persists in compiled request."),
        ("Resume Studio", "Optimization target chips", "/dashboard/builder", "Toggle target chips", "Selected targets appear in request guidance."),
        ("Resume Studio", "Tone and length selectors", "/dashboard/builder", "Change tone and length", "Chosen preferences affect compiled prompt."),
        ("Resume Studio", "PDF export", "/dashboard/builder", "Generate resume then click Download PDF", "PDF downloads and opens."),
        ("Resume Studio", "DOCX export", "/dashboard/builder", "Generate resume then click Download DOCX", "DOCX downloads and opens in Word."),
        ("Skill Roadmap", "Roadmap generation", "/dashboard/roadmap", "Enter missing skills/resume context and generate", "30/60/90 plan renders with resources and projects."),
        ("Interview Prep", "Interview question generation", "/dashboard/interview", "Enter resume and optional JD, generate", "Question banks render by category."),
        ("Promotion Readiness", "Promotion analysis", "/dashboard/promotion", "Enter current role, target role, resume, generate", "Readiness score, gaps, timeline, action plan render."),
        ("Portfolio Analyzer", "Add/remove project", "/dashboard/portfolio", "Add two projects, remove one", "Project fields update correctly."),
        ("Portfolio Analyzer", "Portfolio generation", "/dashboard/portfolio", "Enter projects and generate", "Depth/attractiveness scores and project suggestions render."),
        ("LinkedIn", "LinkedIn analyze", "/dashboard/linkedin", "Paste LinkedIn text and analyze", "Recruiter visibility/profile score renders."),
        ("LinkedIn", "LinkedIn optimize eligible user", "/dashboard/linkedin", "After analysis, enter target role/industry and optimize", "Optimized headline/about/experience render."),
        ("LinkedIn", "LinkedIn optimize blocked free user", "/dashboard/linkedin", "Attempt optimize as free user", "Upgrade/modal or resource-exhausted message appears."),
        ("Settings", "Profile update", "/dashboard/settings", "Edit display name/profile fields and save", "Profile updates or shows success."),
        ("Settings", "Password change", "/dashboard/settings", "Enter password change flow", "Change request succeeds or requires re-auth with clear error."),
        ("Settings", "Apply FIRST1000 coupon", "/dashboard/settings", "Enter FIRST1000 and apply", "Starter trial activates if unused and cap available."),
        ("Settings", "Invalid coupon", "/dashboard/settings", "Enter invalid coupon", "Invalid coupon error appears."),
        ("Settings", "Starter checkout", "/dashboard/settings", "Click Starter upgrade", "createPaymentOrder returns Starter order and Razorpay opens INR 399."),
        ("Settings", "Pro checkout", "/dashboard/settings", "Click Pro upgrade", "createPaymentOrder returns Pro order and Razorpay opens INR 599."),
        ("Settings", "Notification toggles", "/dashboard/settings", "Toggle notifications and save", "Success state appears and UI retains values."),
        ("Settings", "Account deletion", "/dashboard/settings", "Trigger delete account in test account", "deleteMyAccount deletes user data/auth or shows confirmation error safely."),
        ("Admin", "Admin route blocked for normal user", "/dashboard/admin", "Open admin as normal verified user", "Access denied or redirect."),
        ("Admin", "Admin dashboard loads for admin", "/dashboard/admin", "Open admin as admin", "Users, plans, usage, analysis, and contact sections render."),
        ("Admin", "Admin role toggle", "/dashboard/admin", "Toggle user role in test data", "adminUpdateUser updates user_roles and UI refreshes."),
        ("Admin", "Admin plan update", "/dashboard/admin", "Change test user plan", "user_plans updates via callable and access changes."),
        ("Admin", "Admin quota reset", "/dashboard/admin", "Click reset quota", "Monthly/lifetime counters reset for test user."),
        ("Backend", "healthz endpoint", "/healthz", "Open deployed function health URL", "Returns JSON ok true."),
        ("Error Handling", "Rate limit message", "Callable functions", "Rapidly trigger approved test function over limit", "User receives clear too-many-requests message."),
    ]
    for idx, (module, scenario, target, steps, expected) in enumerate(items, 1):
        rows.append([f"FT-{idx:03d}", module, scenario, f"Route/endpoint available: {target}", steps, expected, "", "", "Medium", "", "", "", ""])
    return rows


def security_rows() -> list[list[str]]:
    items = [
        ("Injection", "SQL/NoSQL injection in contact form", "/contact submitContactForm", "Postman/Burp", "' OR '1'='1 in fields", "Input is treated as plain text and schema limits apply.", "High"),
        ("Injection", "Callable payload extra fields", "careerAnalysis", "Postman", "Add unexpected admin=true field", "Zod strict schema rejects invalid payload.", "Medium"),
        ("XSS", "Stored XSS in contact message", "/contact", "Browser/Burp", "<script>alert(1)</script>", "Script is not executed in admin UI; content is escaped.", "High"),
        ("XSS", "Resume text XSS", "/dashboard/resume", "Browser", "<img src=x onerror=alert(1)>", "Result/history rendering does not execute script.", "High"),
        ("Broken Auth", "Unauthenticated callable", "careerAnalysis", "Postman", "No Firebase auth token", "Function returns unauthenticated.", "Critical"),
        ("Broken Auth", "Unverified email callable", "careerAnalysis", "Postman", "Token for unverified account", "Function returns permission-denied.", "High"),
        ("Broken Auth", "Protected route direct access", "/dashboard", "Browser", "Signed out browser", "Redirects to auth.", "High"),
        ("IDOR", "Read another user's analysis", "analysis_results/{id}", "Console/Postman", "Use another user's doc ID", "Firestore rules deny read.", "Critical"),
        ("IDOR", "LinkedIn optimize another analysis", "linkedinOptimize", "Postman/Burp", "analysisId owned by another user", "Function returns permission-denied.", "Critical"),
        ("IDOR", "Read another user plan", "user_plans/{uid}", "Console", "getDoc for another uid", "Firestore rules deny unless admin.", "Critical"),
        ("Access Control", "Normal user open admin route", "/dashboard/admin", "Browser", "Normal verified account", "AdminRoute blocks access.", "High"),
        ("Access Control", "Normal user call adminUpdateUser", "adminUpdateUser", "Postman", "targetUserId of test user", "Function requires admin and denies.", "Critical"),
        ("API Key Exposure", "Frontend bundle secret scan", "dist/assets or source", "rg/DevTools", "Search GEMINI_API_KEY, RAZORPAY_KEY_SECRET, SMTP_PASSWORD", "No server secrets exposed in client bundle.", "Critical"),
        ("API Key Exposure", "Firebase public config only", ".env.example/client bundle", "Manual", "Inspect VITE_ variables", "Only public Firebase client config is present.", "Medium"),
        ("Payment Bypass", "Client write plan to Pro", "user_plans/{uid}", "Console", "setDoc plan_type='pro'", "Firestore denies client write.", "Critical"),
        ("Payment Bypass", "Tamper checkout amount", "createPaymentOrder", "Burp", "Send amount=1 with planType=pro", "Function ignores client amount and uses server price.", "Critical"),
        ("Payment Bypass", "Invalid plan type", "createPaymentOrder", "Postman", "planType='enterprise'", "Schema rejects invalid plan.", "High"),
        ("Payment Bypass", "Fake webhook unsigned", "razorpayWebhook", "Postman", "POST without signature", "HTTP 400 Invalid signature.", "Critical"),
        ("Payment Bypass", "Webhook amount mismatch", "razorpayWebhook", "Postman/Razorpay test", "Captured event with wrong amount", "Order marked amount_mismatch and plan not granted.", "Critical"),
        ("Payment Bypass", "Replay webhook event", "razorpayWebhook", "Postman/Razorpay test", "Send same valid event twice", "payment_events idempotency prevents double processing.", "High"),
        ("Rate Limit", "careerAnalysis rate limit", "careerAnalysis", "Postman", ">10 requests/minute", "Function returns resource-exhausted.", "High"),
        ("Rate Limit", "contact form rate limit", "submitContactForm", "Postman", ">3 requests/hour/IP", "Function returns too many requests.", "Medium"),
        ("Rate Limit", "coupon brute force", "applyCoupon", "Burp", "Many coupon guesses", "Rate limit blocks repeated attempts.", "Medium"),
        ("CSRF", "Callable from foreign site", "Firebase callable", "Manual", "Attempt cross-site unauthenticated call", "Auth token required; no sensitive action without valid token.", "Medium"),
        ("Sensitive Data", "Analysis response leakage", "careerAnalysis", "DevTools", "Inspect response body", "Only current user's result is returned; no secrets or other user data.", "Critical"),
        ("Sensitive Data", "Error message leakage", "Functions errors", "Postman", "Cause backend provider error", "safeError hides stack/secrets.", "High"),
        ("Sensitive Data", "Admin data visible to normal user", "/dashboard/admin/Firestore", "Browser", "Normal account", "Rules/route deny operational collections.", "Critical"),
        ("Input Validation", "Oversized resume text", "careerAnalysis", "Postman", "resume_text >120000 chars", "Schema rejects payload.", "Medium"),
        ("Input Validation", "Oversized PDF", "extractPdf", "Postman", "pdf_base64 >12MB", "Schema rejects payload.", "Medium"),
        ("Input Validation", "Malformed missing_skills", "careerAnalysis roadmap", "Postman", "missing_skills as string", "Schema rejects payload.", "Medium"),
        ("Business Logic", "Free resume rebuild", "careerAnalysis resume_rebuild", "Postman", "Free user resume_rebuild", "Function blocks Starter/Pro-only feature.", "High"),
        ("Business Logic", "Free quota exhaustion", "checkUsage/careerAnalysis", "Browser", "Run beyond free lifetime limit", "Further calls are blocked.", "High"),
        ("Business Logic", "Expired trial access", "careerAnalysis", "Manual test data", "Set trialExpiresAt in past", "Function downgrades/blocks trial access.", "High"),
        ("Data Deletion", "Delete account ownership", "deleteMyAccount", "Postman", "Try deleting another user", "Function deletes only authenticated user.", "Critical"),
        ("Security Headers", "Hosting headers", "Firebase Hosting", "DevTools/ZAP", "Inspect deployed response headers", "Reasonable cache/security headers present or issue logged.", "Medium"),
        ("CORS/Origin", "Functions origin abuse", "Callable/HTTP", "Postman", "Send arbitrary Origin", "Callable auth and webhook signatures remain enforced.", "Medium"),
        ("Dependency Risk", "npm audit high vulnerabilities", "package lock", "Shell", "npm audit --audit-level=high", "No unresolved high vulnerabilities.", "High"),
        ("Logging", "PII in console logs", "Cloud logs/browser", "Manual", "Submit resume and inspect logs available to tester", "No full resume, secret, or payment data in logs.", "High"),
    ]
    rows = []
    for idx, (cat, name, target, method, payload, expected, severity) in enumerate(items, 1):
        rows.append([f"ST-{idx:03d}", cat, name, target, method, payload, expected, "", "", severity, "", "", ""])
    return rows


def style_workbook(ws, widths: dict[int, int]) -> None:
    header_fill = PatternFill("solid", fgColor="17365D")
    header_font = Font(name="Arial", bold=True, color="FFFFFF")
    thin = Side(style="thin", color="D9E2F3")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = border
    ws.freeze_panes = "A2"
    for row in ws.iter_rows(min_row=2):
        fill = PatternFill("solid", fgColor="F8FBFE" if row[0].row % 2 == 0 else "FFFFFF")
        for cell in row:
            cell.fill = fill
            cell.font = Font(name="Arial", size=10)
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = border
    for idx, width in widths.items():
        ws.column_dimensions[get_column_letter(idx)].width = width
    ws.auto_filter.ref = ws.dimensions


def add_list_validation(ws, col_letter: str, values: list[str], start=2, end=500) -> None:
    dv = DataValidation(type="list", formula1='"' + ",".join(values) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f"{col_letter}{start}:{col_letter}{end}")


def build_tracker() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    functional_headers = ["Test ID", "Module", "Test Scenario", "Pre-conditions", "Steps to Reproduce", "Expected Result", "Actual Result", "Status", "Severity", "Tester Name", "Date Tested", "Screenshot/Video Link", "Notes"]
    ws = wb.create_sheet("Functional Test Cases")
    ws.append(functional_headers)
    for row in functional_rows():
        ws.append(row)
    style_workbook(ws, {1: 12, 2: 20, 3: 34, 4: 32, 5: 44, 6: 44, 7: 28, 8: 14, 9: 14, 10: 18, 11: 16, 12: 26, 13: 28})
    add_list_validation(ws, "H", ["Pass", "Fail", "Blocked", "Not Tested"])
    add_list_validation(ws, "I", ["Critical", "High", "Medium", "Low"])
    max_row = 500
    status_colors = {"Pass": "C6EFCE", "Fail": "FFC7CE", "Blocked": "FCE4D6", "Not Tested": "D9EAD3"}
    for status, color in status_colors.items():
        ws.conditional_formatting.add(f"H2:H{max_row}", FormulaRule(formula=[f'$H2="{status}"'], fill=PatternFill("solid", fgColor=color)))

    security_headers = ["Test ID", "Attack Category", "Attack Name", "Target (URL or Endpoint)", "Method", "Payload or Input Used", "Expected Behaviour", "Actual Behaviour", "Vulnerable (Y/N)", "Severity", "Tester Name", "Date Tested", "Notes"]
    ws = wb.create_sheet("Security Test Cases")
    ws.append(security_headers)
    for row in security_rows():
        ws.append(row)
    style_workbook(ws, {1: 12, 2: 22, 3: 34, 4: 28, 5: 18, 6: 32, 7: 40, 8: 28, 9: 18, 10: 14, 11: 18, 12: 16, 13: 28})
    add_list_validation(ws, "I", ["Y", "N"])
    add_list_validation(ws, "J", ["Critical", "High", "Medium", "Low"])
    ws.conditional_formatting.add(f"I2:I{max_row}", FormulaRule(formula=['$I2="Y"'], fill=PatternFill("solid", fgColor="FFC7CE")))
    ws.conditional_formatting.add(f"I2:I{max_row}", FormulaRule(formula=['$I2="N"'], fill=PatternFill("solid", fgColor="C6EFCE")))

    bug_headers = ["Bug ID", "Date Reported", "Product", "Module", "Bug Title", "Description", "Steps to Reproduce", "Expected", "Actual", "Severity", "Priority", "Status", "Reported By", "Assigned To", "Fixed By", "Date Fixed", "Verified By", "Date Verified", "Notes"]
    ws = wb.create_sheet("Bug Tracker")
    ws.append(bug_headers)
    for _ in range(100):
        ws.append([""] * len(bug_headers))
    style_workbook(ws, {1: 12, 2: 16, 3: 24, 4: 20, 5: 34, 6: 36, 7: 42, 8: 28, 9: 28, 10: 14, 11: 12, 12: 16, 13: 18, 14: 18, 15: 18, 16: 16, 17: 18, 18: 16, 19: 28})
    add_list_validation(ws, "J", ["Critical", "High", "Medium", "Low"])
    add_list_validation(ws, "K", ["P0", "P1", "P2", "P3"])
    add_list_validation(ws, "L", ["Open", "In Progress", "Fixed", "Verified", "Closed"])
    status_fills = {"Open": "FFC7CE", "In Progress": "FCE4D6", "Fixed": "BDD7EE", "Verified": "C6EFCE", "Closed": "D9D9D9"}
    for status, color in status_fills.items():
        ws.conditional_formatting.add(f"L2:L{max_row}", FormulaRule(formula=[f'$L2="{status}"'], fill=PatternFill("solid", fgColor=color)))
    severity_fills = {"Critical": ("9C0006", "FFFFFF"), "High": ("F4B183", "000000"), "Medium": ("FFF2CC", "000000"), "Low": ("C6EFCE", "000000")}
    for sev, (fill, font) in severity_fills.items():
        ws.conditional_formatting.add(f"J2:J{max_row}", FormulaRule(formula=[f'$J2="{sev}"'], fill=PatternFill("solid", fgColor=fill), font=Font(color=font, bold=(sev == "Critical"))))

    daily_headers = ["Date", "Intern Name", "Product", "Module Tested", "Test Cases Completed", "Bugs Found (count)", "Bug IDs", "Blockers", "Hours Spent", "Notes"]
    ws = wb.create_sheet("Daily Log")
    ws.append(daily_headers)
    for _ in range(90):
        ws.append([""] * len(daily_headers))
    style_workbook(ws, {1: 16, 2: 20, 3: 26, 4: 24, 5: 20, 6: 18, 7: 22, 8: 30, 9: 14, 10: 36})

    ws = wb.create_sheet("Sign-Off Dashboard")
    ws.sheet_view.showGridLines = False
    title_fill = PatternFill("solid", fgColor="17365D")
    section_fill = PatternFill("solid", fgColor="D9EAF7")
    metric_fill = PatternFill("solid", fgColor="F8FBFE")
    ws.merge_cells("A1:D1")
    ws["A1"] = "AIVI QA Sign-Off Dashboard"
    ws["A1"].font = Font(name="Arial", bold=True, size=16, color="FFFFFF")
    ws["A1"].fill = title_fill
    ws["A1"].alignment = Alignment(horizontal="center")
    dashboard_rows = [
        ("A3", "Functional Testing"),
        ("A4", "Total functional test cases", '=COUNTA(\'Functional Test Cases\'!A2:A500)'),
        ("A5", "Passed", '=COUNTIF(\'Functional Test Cases\'!H2:H500,"Pass")'),
        ("A6", "Failed", '=COUNTIF(\'Functional Test Cases\'!H2:H500,"Fail")'),
        ("A7", "Blocked", '=COUNTIF(\'Functional Test Cases\'!H2:H500,"Blocked")'),
        ("A8", "Not Tested", '=COUNTA(\'Functional Test Cases\'!A2:A500)-COUNTIF(\'Functional Test Cases\'!H2:H500,"Pass")-COUNTIF(\'Functional Test Cases\'!H2:H500,"Fail")-COUNTIF(\'Functional Test Cases\'!H2:H500,"Blocked")'),
        ("A9", "% Complete", '=IF(B4=0,0,(B5+B6+B7)/B4)'),
        ("A11", "Security Testing"),
        ("A12", "Total security test cases", '=COUNTA(\'Security Test Cases\'!A2:A500)'),
        ("A13", "Passed", '=COUNTIF(\'Security Test Cases\'!I2:I500,"N")'),
        ("A14", "Failed", '=COUNTIF(\'Security Test Cases\'!I2:I500,"Y")'),
        ("A15", "Not Tested", '=COUNTA(\'Security Test Cases\'!A2:A500)-COUNTIF(\'Security Test Cases\'!I2:I500,"N")-COUNTIF(\'Security Test Cases\'!I2:I500,"Y")'),
        ("A16", "% Complete", '=IF(B12=0,0,(B13+B14)/B12)'),
        ("A18", "Bug Status"),
        ("A19", "Total bugs reported", '=COUNTA(\'Bug Tracker\'!A2:A500)'),
        ("A20", "Open", '=COUNTIF(\'Bug Tracker\'!L2:L500,"Open")'),
        ("A21", "In Progress", '=COUNTIF(\'Bug Tracker\'!L2:L500,"In Progress")'),
        ("A22", "Fixed", '=COUNTIF(\'Bug Tracker\'!L2:L500,"Fixed")'),
        ("A23", "Verified", '=COUNTIF(\'Bug Tracker\'!L2:L500,"Verified")'),
        ("A24", "Closed", '=COUNTIF(\'Bug Tracker\'!L2:L500,"Closed")'),
        ("A25", "Critical bugs open", '=COUNTIFS(\'Bug Tracker\'!J2:J500,"Critical",\'Bug Tracker\'!L2:L500,"<>Closed",\'Bug Tracker\'!L2:L500,"<>Verified",\'Bug Tracker\'!L2:L500,"<>")'),
        ("A26", "High bugs open", '=COUNTIFS(\'Bug Tracker\'!J2:J500,"High",\'Bug Tracker\'!L2:L500,"<>Closed",\'Bug Tracker\'!L2:L500,"<>Verified",\'Bug Tracker\'!L2:L500,"<>")'),
        ("A28", "Overall production readiness score", '=IF((B4+B12)=0,0,((B5+B13)+B24)/(B4+B12+B19))'),
        ("A29", "Recommendation", '=IF(AND(B28>0.9,B25=0),"READY FOR PRODUCTION","NOT READY - "&(B6+B7+B8+B14+B15+B20+B21+B22+B25+B26)&" issues pending")'),
    ]
    for cell, label, *formula in dashboard_rows:
        row = int(cell[1:])
        ws[cell] = label
        if formula:
            ws[f"B{row}"] = formula[0]
        if label in {"Functional Testing", "Security Testing", "Bug Status"}:
            ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=4)
            ws[cell].font = Font(name="Arial", bold=True, color="17365D", size=13)
            ws[cell].fill = section_fill
        else:
            ws[cell].font = Font(name="Arial", bold=True)
            ws[f"B{row}"].fill = metric_fill
            ws[f"B{row}"].font = Font(name="Arial", bold=True, color="17365D")
            ws[f"B{row}"].alignment = Alignment(horizontal="center")
    for c in range(1, 5):
        ws.column_dimensions[get_column_letter(c)].width = [38, 18, 22, 22][c - 1]
    for pct in ["B9", "B16", "B28"]:
        ws[pct].number_format = "0.0%"
    ws["A31"] = "Notes"
    ws["B31"] = "Dashboard formulas count test cases, security outcomes, bug status, and readiness. Do not overwrite formulas."
    ws.merge_cells("B31:D31")

    wb.calculation.fullCalcOnLoad = True
    wb.calculation.forceFullCalc = True
    wb.calculation.calcMode = "auto"
    wb.save(ROOT / "03_Testing_Tracker.xlsx")


def build_signoff_template() -> None:
    doc = Document()
    apply_doc_styles(doc)
    cover(doc, "Final Sign-Off Report Template")
    doc.add_heading("Executive Summary", level=1)
    add_table(doc, ["Field", "Intern response"], [
        ["Overall verdict", ""],
        ["Total tests run", ""],
        ["Total bugs found", ""],
        ["Critical issues resolved", ""],
        ["Production readiness recommendation", ""],
    ])
    doc.add_heading("Test Coverage Summary", level=1)
    add_table(doc, ["Module", "Total cases", "Passed", "Failed", "Coverage %"], [["", "", "", "", ""] for _ in range(10)])
    doc.add_heading("Top 10 Bugs Found", level=1)
    add_table(doc, ["Bug ID", "Title", "Severity", "Status", "Resolution"], [["", "", "", "", ""] for _ in range(10)])
    doc.add_heading("Security Assessment Summary", level=1)
    doc.add_paragraph("Attack vectors tested:")
    doc.add_paragraph("")
    doc.add_paragraph("Vulnerabilities found:")
    doc.add_paragraph("")
    doc.add_paragraph("Vulnerabilities fixed and verified:")
    doc.add_paragraph("")
    doc.add_heading("Outstanding Issues", level=1)
    add_table(doc, ["Bug ID", "Module", "Severity", "Status", "Reason still open", "Production impact"], [["", "", "", "", "", ""] for _ in range(8)])
    doc.add_heading("Production Readiness Verdict", level=1)
    add_bullets(doc, ["[ ] Ready", "[ ] Not Ready", "[ ] Conditionally Ready"])
    doc.add_paragraph("Conditions if conditionally ready:")
    doc.add_paragraph("")
    doc.add_heading("Intern Declaration", level=1)
    doc.add_paragraph("We confirm that the above testing was conducted thoroughly and to the best of our ability.")
    add_table(doc, ["Intern name", "Signature", "Date"], [["", "", ""], ["", "", ""], ["", "", ""], ["", "", ""]])
    doc.add_heading("Founder Sign-Off", level=1)
    doc.add_paragraph("I confirm receipt of this report and authorise production deployment.")
    add_table(doc, ["Founder name", "Signature", "Date"], [["", "", ""]])
    doc.save(ROOT / "04_Final_Signoff_Report_Template.docx")


def main() -> None:
    ROOT.mkdir(exist_ok=True)
    build_teaching_script()
    build_product_brief()
    build_tracker()
    build_signoff_template()
    print("Generated all testing-kit artifacts.")


if __name__ == "__main__":
    main()
