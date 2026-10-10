"""
AIVI Google Drive Bulk Sync Script
Uses central C:/Users/abhis/gdrive_sync.py to upload all 4 documentation categories
directly into Google Drive root folder '1fq0qINf5DqoCrGLk_F06uQQRyr_0MG0I' -> 'AIVI Career OS'
"""

import os
import sys
from pathlib import Path

sys.path.append("C:/Users/abhis")
from gdrive_sync import GoogleDriveSync

PROJECT_ROOT = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
DOCS_DIR = PROJECT_ROOT / "docs"

def main():
    print("=======================================================")
    print("🚀 SYNCING ALL 4 CATEGORIES TO GOOGLE DRIVE")
    print("=======================================================")

    sync = GoogleDriveSync("1fq0qINf5DqoCrGLk_F06uQQRyr_0MG0I")
    proj_folder_id = sync.find_or_create_folder("AIVI Career OS", sync.root_folder_id)
    print(f"📁 Project Folder in Google Drive: 'AIVI Career OS' (ID: {proj_folder_id})")

    categories = [
        "01_LATEST_ACTIVE_DOCUMENTATION",
        "02_HISTORICAL_ARCHIVES_AND_LEGACY",
        "03_INTERN_GUIDES_AND_WORKSHOPS",
        "04_SALES_AND_DEMO_GUIDES",
    ]

    total_uploaded = 0
    for cat in categories:
        cat_dir = DOCS_DIR / cat
        if cat_dir.exists():
            print(f"\n📂 Syncing Category: {cat}...")
            cat_folder_id = sync.find_or_create_folder(cat, proj_folder_id)
            for file_path in cat_dir.glob("*"):
                if file_path.is_file():
                    try:
                        sync.upload_or_update_file(str(file_path), cat_folder_id)
                        total_uploaded += 1
                    except Exception as e:
                        print(f"  ❌ Failed {file_path.name}: {e}")

    print("\n=======================================================")
    print(f"✅ GOOGLE DRIVE SYNC COMPLETE! Uploaded {total_uploaded} files.")
    print(f"🔗 Google Drive Folder URL: https://drive.google.com/drive/folders/{proj_folder_id}")
    print("=======================================================")

if __name__ == "__main__":
    main()
