#!/usr/bin/env python3
"""Download GiveWell November 2025 CEA spreadsheets for all charities."""
import requests
import os

SPREADSHEETS = {
    "amf": "1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc",
    "malaria-consortium": "1De3ZnT2Co5ts6Ccm9guWl8Ew31grzrZZwGfPtp-_t50",
    "helen-keller": "1L6D1mf8AMKoUHrN0gBGiJjtstic4RvqLZCxXZ99kdnA",
    "new-incentives": "1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM",
}

os.makedirs("data", exist_ok=True)

for name, sheet_id in SPREADSHEETS.items():
    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=xlsx"
    print(f"Downloading {name}...")
    response = requests.get(url, timeout=60)
    response.raise_for_status()

    filepath = f"data/givewell-{name}.xlsx"
    with open(filepath, "wb") as f:
        f.write(response.content)

    print(f"  Downloaded {len(response.content)} bytes to {filepath}")

print("\nAll spreadsheets downloaded!")
