"""
AIVI Google Drive Direct API OAuth Sync Script
Authenticates with Google OAuth and creates an organized 'AIVI Career OS - Complete Documentation Master'
folder structure in Google Drive, uploading all 4 documentation categories.
"""

import os
import sys
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DOCS_DIR = os.path.join(PROJECT_ROOT, "docs")
TOKEN_FILE = os.path.join(PROJECT_ROOT, "scripts", "gdrive_token.pickle")
CLIENT_SECRET_FILE = os.path.join(PROJECT_ROOT, "scripts", "client_secret.json")

def get_drive_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET_FILE):
                print(f"[ERROR] client_secret.json not found at {CLIENT_SECRET_FILE}")
                print("Please download client_secret.json from Google Cloud Console (OAuth 2.0 Client IDs)")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
            
    return build('drive', 'v3', credentials=creds)

def create_drive_folder(service, folder_name, parent_id=None):
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
        
    folder = service.files().create(body=file_metadata, fields='id').execute()
    return folder.get('id')

def upload_file_to_drive(service, file_path, drive_folder_id):
    file_name = os.path.basename(file_path)
    file_metadata = {
        'name': file_name,
        'parents': [drive_folder_id]
    }
    
    mime_type = 'text/plain'
    if file_name.endswith('.md'):
        mime_type = 'text/markdown'
    elif file_name.endswith('.pdf'):
        mime_type = 'application/pdf'
    elif file_name.endswith('.docx'):
        mime_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    elif file_name.endswith('.html'):
        mime_type = 'text/html'
        
    media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"  [Uploaded] {file_name} -> Drive ID: {file.get('id')}")
    return file.get('id')

def main():
    print("Initializing Google Drive Direct API OAuth Sync...")
    service = get_drive_service()
    if not service:
        sys.exit(1)

    print("[1/2] Creating root folder 'AIVI Career OS - Complete Documentation Master' in Google Drive...")
    root_folder_id = create_drive_folder(service, "AIVI Career OS - Complete Documentation Master")
    print(f"Created Root Folder ID: {root_folder_id}")

    categories = [
        "01_LATEST_ACTIVE_DOCUMENTATION",
        "02_HISTORICAL_ARCHIVES_AND_LEGACY",
        "03_INTERN_GUIDES_AND_WORKSHOPS",
        "04_SALES_AND_DEMO_GUIDES"
    ]

    print("[2/2] Uploading all documentation categories...")
    for cat in categories:
        cat_dir = os.path.join(DOCS_DIR, cat)
        if os.path.exists(cat_dir):
            print(f"\nCreating category folder: {cat}...")
            cat_folder_id = create_drive_folder(service, cat, parent_id=root_folder_id)
            for fname in os.listdir(cat_dir):
                file_path = os.path.join(cat_dir, fname)
                if os.path.isfile(file_path):
                    upload_file_to_drive(service, file_path, cat_folder_id)

    print("\n[SUCCESS] All documentation successfully uploaded to Google Drive!")
    print(f"Folder Link: https://drive.google.com/drive/folders/{root_folder_id}")

if __name__ == "__main__":
    main()
