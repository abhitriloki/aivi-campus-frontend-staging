"""
AIVI Google Drive Documentation Sync Utility
Automates local-to-cloud synchronization of all 4 documentation categories:
1. 01_LATEST_ACTIVE_DOCUMENTATION
2. 02_HISTORICAL_ARCHIVES_AND_LEGACY
3. 03_INTERN_GUIDES_AND_WORKSHOPS
4. 04_SALES_AND_DEMO_GUIDES
"""

import os
import sys
import shutil

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(PROJECT_ROOT, "docs")

DEFAULT_DRIVE_TARGETS = [
    os.path.expanduser("~/OneDrive/AIVI_Documentation_Drive"),
    os.path.expanduser("~/Google Drive/AIVI_Documentation_Drive"),
    os.path.expanduser("~/GoogleDrive/AIVI_Documentation_Drive"),
    "G:/My Drive/AIVI_Documentation_Drive",
]

def sync_to_cloud(destination_folder=None):
    target = destination_folder
    if not target:
        for d in DEFAULT_DRIVE_TARGETS:
            parent = os.path.dirname(d)
            if os.path.exists(parent):
                target = d
                break
        if not target:
            target = DEFAULT_DRIVE_TARGETS[0]

    os.makedirs(target, exist_ok=True)
    print(f"Syncing documentation to Cloud Drive path: {target}")

    categories = [
        "01_LATEST_ACTIVE_DOCUMENTATION",
        "02_HISTORICAL_ARCHIVES_AND_LEGACY",
        "03_INTERN_GUIDES_AND_WORKSHOPS",
        "04_SALES_AND_DEMO_GUIDES",
    ]

    total_synced = 0
    for cat in categories:
        src_cat = os.path.join(DOCS_DIR, cat)
        dst_cat = os.path.join(target, cat)
        if os.path.exists(src_cat):
            os.makedirs(dst_cat, exist_ok=True)
            for fname in os.listdir(src_cat):
                src_file = os.path.join(src_cat, fname)
                if os.path.isfile(src_file):
                    shutil.copy2(src_file, os.path.join(dst_cat, fname))
                    total_synced += 1

    print(f"[OK] Successfully synced {total_synced} documentation files into 4 categories at {target}")
    return target

if __name__ == "__main__":
    dest = sys.argv[1] if len(sys.argv) > 1 else None
    sync_to_cloud(dest)
