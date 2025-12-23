#!/usr/bin/env python3
"""
Fetch GiveWell CEA spreadsheet data using Google Sheets API.
"""

import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
]

TOKEN_PATH = os.environ.get(
    "GOOGLE_TOKEN_FILE",
    os.path.expanduser("~/.config/policyengine/google-token.json"),
)
CREDENTIALS_FILE = os.environ.get(
    "GOOGLE_CREDENTIALS_FILE",
    os.path.expanduser("~/.config/policyengine/google-credentials.json"),
)

# GiveWell CEA Spreadsheet IDs
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


def list_sheets(service, spreadsheet_id: str) -> list[str]:
    """List all sheet names in a spreadsheet."""
    result = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    return [sheet["properties"]["title"] for sheet in result.get("sheets", [])]


def get_sheet_data(service, spreadsheet_id: str, range_name: str) -> list[list]:
    """Get data from a specific sheet range."""
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    return result.get("values", [])


def print_main_cea_data(service, name: str, spreadsheet_id: str):
    """Print the Main CEA sheet data to understand structure."""
    print(f"\n{'=' * 60}")
    print(f"{name.upper()} - Main CEA Data")
    print(f"{'=' * 60}")

    try:
        # Get the first 100 rows and columns A-Z to understand structure
        if name == "givedirectly":
            # GiveDirectly uses different sheet names
            data = get_sheet_data(service, spreadsheet_id, "New CEA!A1:Z100")
        elif name == "deworming":
            # Deworming has per-charity sheets
            data = get_sheet_data(service, spreadsheet_id, "Deworm the World!A1:Z50")
        else:
            data = get_sheet_data(service, spreadsheet_id, "Main CEA!A1:Z100")

        # Print first 50 rows to see structure
        for i, row in enumerate(data[:50]):
            # Only print rows that have content
            if any(cell.strip() for cell in row if cell):
                print(f"Row {i+1}: {row[:10]}")  # First 10 columns
    except Exception as e:
        print(f"Error: {e}")


def extract_amf_data(service, spreadsheet_id: str):
    """Extract AMF country-level parameters."""
    print("\n" + "=" * 80)
    print("AMF - Full Data Extraction")
    print("=" * 80)

    # Get all data from Main CEA (rows 1-200, columns A-Q to cover all countries)
    data = get_sheet_data(service, spreadsheet_id, "Main CEA!A1:Q200")

    # Row 2 has country names starting at column I (index 8)
    if len(data) > 1:
        countries = data[1][8:] if len(data[1]) > 8 else []
        countries = [c.strip() for c in countries if c.strip()]
        print(f"Countries: {countries}")

    # Print all rows with their values to understand the full structure
    print("\nAll rows with data:")
    for i, row in enumerate(data):
        if len(row) > 8:
            # Get description from column E (index 4)
            desc = row[4] if len(row) > 4 else ""
            if desc and isinstance(desc, str) and len(desc) > 3:
                values = row[8:16]  # Country columns (8 countries)
                print(f"Row {i+1:3d}: {desc[:65]:<65} | {values}")


def extract_sheet_data(service, spreadsheet_id: str, sheet_name: str, label: str):
    """Extract data from a specific sheet."""
    print(f"\n{'=' * 80}")
    print(f"{label}")
    print(f"{'=' * 80}")

    data = get_sheet_data(service, spreadsheet_id, f"{sheet_name}!A1:Q300")

    # Row 2 has country names if applicable
    if len(data) > 1 and len(data[1]) > 8:
        countries = data[1][8:16]
        countries = [c.strip() for c in countries if c and c.strip()]
        if countries:
            print(f"Countries: {countries}")

    print("\nAll rows with data:")
    for i, row in enumerate(data):
        if len(row) > 4:
            desc = row[4] if len(row) > 4 else row[0] if row else ""
            if desc and isinstance(desc, str) and len(desc) > 3:
                values = row[8:16] if len(row) > 8 else []
                print(f"Row {i+1:3d}: {desc[:65]:<65} | {values}")


def extract_all_cea_data(service):
    """Extract key parameters from all CEA spreadsheets."""

    print("\n" + "=" * 80)
    print("Extracting All CEA Data for Verification")
    print("=" * 80)

    # AMF - Key parameters from Main CEA
    print("\n--- AMF Countries & Key Data ---")
    amf_data = get_sheet_data(service, SPREADSHEETS["amf"], "Main CEA!A1:Q220")

    # Get country headers
    if len(amf_data) > 1:
        countries = amf_data[1][8:16]
        print(f"Countries: {countries}")

    # Extract key rows
    key_rows = {
        "Cost-effectiveness": 4,
        "Cost per ITN": 28,
        "Effective coverage years": 43,
        "Malaria mortality rate (1-59mo)": 70,
        "ITN effect on mortality": 69,
        "Adjustment insecticide resistance": 66,
        "Under-5 deaths averted": 77,
        "5+ deaths averted": 85,
    }

    for label, row_num in key_rows.items():
        if row_num <= len(amf_data):
            row = amf_data[row_num - 1]
            values = row[8:16] if len(row) > 8 else []
            print(f"  Row {row_num}: {label}: {values}")

    # Get leverage/funging from that sheet
    lf_data = get_sheet_data(service, SPREADSHEETS["amf"], "Leverage/Funging!A1:Q130")
    print("\n  Leverage/Funging:")
    lf_rows = {
        "Leverage (crowding in)": 111,
        "Funging (crowding out)": 112,
        "Total L+F adjustment": 113,
    }
    for label, row_num in lf_rows.items():
        if row_num <= len(lf_data):
            row = lf_data[row_num - 1]
            values = row[8:16] if len(row) > 8 else []
            print(f"    Row {row_num}: {label}: {values}")

    # Malaria Consortium
    print("\n--- Malaria Consortium Countries & Key Data ---")
    mc_data = get_sheet_data(service, SPREADSHEETS["malaria_consortium"], "Main CEA!A1:Q150")
    if len(mc_data) > 1:
        countries = mc_data[1][8:16] if len(mc_data[1]) > 8 else []
        countries = [c for c in countries if c.strip()]
        print(f"Countries: {countries}")

    for i, row in enumerate(mc_data[:100]):
        if len(row) > 8:
            desc = row[4] if len(row) > 4 else ""
            if desc and any(kw in desc.lower() for kw in ["cost per", "mortality", "effect", "smc", "coverage"]):
                values = row[8:16]
                print(f"  Row {i+1}: {desc[:50]}: {values}")

    # Helen Keller
    print("\n--- Helen Keller Countries & Key Data ---")
    hk_data = get_sheet_data(service, SPREADSHEETS["helen_keller"], "Main CEA!A1:Q150")
    if len(hk_data) > 1:
        countries = hk_data[1][8:16] if len(hk_data[1]) > 8 else []
        countries = [c for c in countries if c.strip()]
        print(f"Countries: {countries}")

    for i, row in enumerate(hk_data[:100]):
        if len(row) > 8:
            desc = row[4] if len(row) > 4 else ""
            if desc and any(kw in desc.lower() for kw in ["cost per", "mortality", "effect", "vitamin", "coverage", "vas"]):
                values = row[8:16]
                print(f"  Row {i+1}: {desc[:50]}: {values}")

    # New Incentives
    print("\n--- New Incentives States & Key Data ---")
    ni_data = get_sheet_data(service, SPREADSHEETS["new_incentives"], "Main CEA!A1:Q150")
    if len(ni_data) > 1:
        states = ni_data[1][8:16] if len(ni_data[1]) > 8 else []
        states = [s for s in states if s.strip()]
        print(f"States: {states}")

    for i, row in enumerate(ni_data[:100]):
        if len(row) > 8:
            desc = row[4] if len(row) > 4 else ""
            if desc and any(kw in desc.lower() for kw in ["cost per", "mortality", "vaccine", "coverage", "death"]):
                values = row[8:16]
                print(f"  Row {i+1}: {desc[:50]}: {values}")

    # GiveDirectly
    print("\n--- GiveDirectly Countries & Key Data ---")
    gd_data = get_sheet_data(service, SPREADSHEETS["givedirectly"], "New CEA!A1:Q100")
    if len(gd_data) > 1:
        countries = gd_data[1][8:16] if len(gd_data[1]) > 8 else []
        countries = [c for c in countries if c.strip()]
        print(f"Countries: {countries}")

    for i, row in enumerate(gd_data[:80]):
        if len(row) > 4:
            desc = row[4] if len(row) > 4 else row[0] if row else ""
            if desc and any(kw in desc.lower() for kw in ["transfer", "consumption", "cost", "overhead", "mortality"]):
                values = row[8:16] if len(row) > 8 else []
                print(f"  Row {i+1}: {desc[:50]}: {values}")


def debug_structure(service):
    """Debug the structure of problematic sheets."""

    # New Incentives - get row 3 which might have state names
    print("\n--- New Incentives Row 3 (may have state names) ---")
    ni_data = get_sheet_data(service, SPREADSHEETS["new_incentives"], "Main CEA!A1:Q10")
    for i, row in enumerate(ni_data[:5]):
        print(f"Row {i+1}: {row}")

    # GiveDirectly - check multiple sheets
    print("\n--- GiveDirectly 'Country' sheet ---")
    gd_country = get_sheet_data(service, SPREADSHEETS["givedirectly"], "Country!A1:J30")
    for i, row in enumerate(gd_country[:20]):
        if row:
            print(f"Row {i+1}: {row}")

    print("\n--- GiveDirectly 'Analysis' sheet structure ---")
    gd_analysis = get_sheet_data(service, SPREADSHEETS["givedirectly"], "Analysis!A1:K30")
    for i, row in enumerate(gd_analysis[:20]):
        if row:
            print(f"Row {i+1}: {row}")


def main():
    print("Authenticating with Google Sheets API...")
    creds = get_google_credentials()
    service = build("sheets", "v4", credentials=creds)
    print("Authentication successful!")

    debug_structure(service)


if __name__ == "__main__":
    main()
