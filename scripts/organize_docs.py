"""
AIVI Documentation Auditor & Categorizer Script
Organizes all project documentation into 4 clean standard categories:
1. 01_LATEST_ACTIVE_DOCUMENTATION
2. 02_HISTORICAL_ARCHIVES_AND_LEGACY
3. 03_INTERN_GUIDES_AND_WORKSHOPS
4. 04_SALES_AND_DEMO_GUIDES
"""

import os
import shutil

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs"))

CATEGORIES = {
    "01_LATEST_ACTIVE_DOCUMENTATION": [
        "PROJECT_DOCUMENTATION.md",
        "LATEST_TECHNICAL_DOCUMENTATION_2026-08-17.md",
        "LATEST_TECHNICAL_DOCUMENTATION_2026-08-13.md",
        "01_Product_Overview.md",
        "02_System_Architecture.md",
        "03_Backend_Functions.md",
        "04_Firestore_Schema.md",
        "05_Security_Rules.md",
        "06_Trial_System_Logic.md",
        "07_Admin_Dashboard.md",
        "08_AI_Cost_Model.md",
        "09_Pricing_Monetization.md",
        "10_Deployment_DevOps.md",
        "11_Environment_Variables.md",
        "12_Known_Bugs_History.md",
        "13_Incident_Handling.md",
        "14_Scalability_Plan.md",
        "15_Future_Roadmap.md",
        "16_Resume_Builder_Enhancement_Plan.md",
        "17_Job_Fit_Analysis_Enhancement_Plan.md",
        "18_AIVI_Brand_Guidelines.md",
        "19_AIVI_Project_Handoff_Guide.md",
        "20_AIVI_Campus_Standalone_Subdomain_Architecture.md",
        "AIVI_Product_Documentation.md",
        "API_DOCS.md",
        "BUSINESS_LOGIC.md",
        "CODEBASE_DOCUMENTATION.md",
        "DATABASE_SCHEMA.md",
        "TECHNICAL_ARCHITECTURE.md",
        "deployment.md",
        "latency_benchmarks.md",
        "payments-runbook.md",
        "firebase_setup_guide.md",
        "FUTURE_EDIT_GUIDE.md"
    ],
    "02_HISTORICAL_ARCHIVES_AND_LEGACY": [
        "Final_Project_DOCUMENTATION_July.md",
        "AIVI_Career_Intelligence_Full_Documentation.docx",
        "AIVI_Career_Intelligence_Full_Documentation.pdf",
        "AIVI_Career_Intelligence_OS_Documentation.docx",
        "AIVI_Career_Intelligence_OS_Documentation.pdf",
        "PROJECT_MASTER_CONTEXT.md",
        "project_phase_2_implementation.md",
        "launch-hardening-report.md"
    ],
    "03_INTERN_GUIDES_AND_WORKSHOPS": [
        "AIVI_Campus_QA_Testing_Guide_for_Interns.md",
        "admin_guide.md",
        "campus-onboarding-runbook.md",
        "campus-theming-contrast-rules.md",
        "AIVI_Campus_Standalone_Segregation_Architecture_Report.md"
    ],
    "04_SALES_AND_DEMO_GUIDES": [
        "AIVI_Career_and_Campus_OS_Complete_Feature_Guide.md",
        "AIVI_Career_and_Campus_OS_Complete_Sales_and_Demo_Walkthrough.md",
        "AIVI_Media_Kit.html",
        "AI_PROMPT_STRUCTURE.md"
    ]
}

def organize():
    print(f"Organizing docs in {DOCS_DIR}...")
    for cat in CATEGORIES.keys():
        cat_path = os.path.join(DOCS_DIR, cat)
        os.makedirs(cat_path, exist_ok=True)

    # Check root level files to copy into docs if present
    root_dir = os.path.abspath(os.path.join(DOCS_DIR, ".."))
    frontend_dir = os.path.join(root_dir, "frontend")

    # Sync PROJECT_DOCUMENTATION from frontend/ if present
    if os.path.exists(os.path.join(frontend_dir, "PROJECT_DOCUMENTATION.md")):
        shutil.copy2(
            os.path.join(frontend_dir, "PROJECT_DOCUMENTATION.md"),
            os.path.join(DOCS_DIR, "01_LATEST_ACTIVE_DOCUMENTATION", "PROJECT_DOCUMENTATION.md")
        )

    # Move files into subdirectories
    for cat_name, file_list in CATEGORIES.items():
        cat_dir = os.path.join(DOCS_DIR, cat_name)
        for fname in file_list:
            src = os.path.join(DOCS_DIR, fname)
            dst = os.path.join(cat_dir, fname)
            if os.path.exists(src):
                shutil.move(src, dst)
                print(f"Moved {fname} -> {cat_name}/")

    print("\nDocumentation organization complete!")

if __name__ == "__main__":
    organize()
