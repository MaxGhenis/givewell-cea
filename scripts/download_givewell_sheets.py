#!/usr/bin/env python3
"""Download GiveWell CEA spreadsheets as xlsx files."""

import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

TOKEN_PATH = os.environ.get(
    "GOOGLE_TOKEN_FILE",
    os.path.expanduser("~/.config/policyengine/google-token.json"),
)
CREDENTIALS_FILE = os.environ.get(
    "GOOGLE_CREDENTIALS_FILE",
    os.path.expanduser("~/.config/policyengine/google-credentials.json"),
)

OUTPUT_DIR = "data/givewell-spreadsheets"

SPREADSHEETS = {
    "amf": "1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc",
    "malaria_consortium": "1De3ZnT2Co5ts6Ccm9guWl8Ew31grzrZZwGfPtp-_t50",
    "helen_keller": "1L6D1mf8AMKoUHrN0gBGiJjtstic4RvqLZCxXZ99kdnA",
    "new_incentives": "1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM",
    "givedirectly": "1LqkkwWCud9qGjSJmw9re6DIm5ocpPOaqOJ-KIEVLppk",
    "deworming": "18ROI6dRdKsNfXg5gIyBa1_7eYOjowfbw5n65zkrLnvc",
}


def get_google_credentials():
    """Get Google OAuth credentials, refreshing if needed."""
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as f:
            f.write(creds.to_json())
    return creds


def download_as_xlsx(service, file_id: str, output_path: str):
    """Download a Google Sheet as xlsx."""
    request = service.files().export_media(
        fileId=file_id,
        mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
        print(f"  Download {int(status.progress() * 100)}%")

    with open(output_path, "wb") as f:
        f.write(fh.getvalue())


def main():
    print("Authenticating with Google Drive API...")
    creds = get_google_credentials()
    service = build("drive", "v3", credentials=creds)
    print("Authentication successful!\n")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for name, file_id in SPREADSHEETS.items():
        output_path = os.path.join(OUTPUT_DIR, f"{name}.xlsx")
        print(f"Downloading {name}...")
        try:
            download_as_xlsx(service, file_id, output_path)
            print(f"  Saved to {output_path}\n")
        except Exception as e:
            print(f"  Error: {e}\n")

    print("Done!")


if __name__ == "__main__":
    main()
