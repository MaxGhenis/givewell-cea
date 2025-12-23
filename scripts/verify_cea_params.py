#!/usr/bin/env python3
"""
Verify CEA parameters against GiveWell spreadsheets.
Extracts key parameters from xlsx files and compares with our code.
"""

import pandas as pd
from pathlib import Path

DATA_DIR = Path("data/givewell-spreadsheets")


def read_main_cea(xlsx_path: Path, sheet_name: str = "Main CEA") -> pd.DataFrame:
    """Read Main CEA sheet with proper structure."""
    df = pd.read_excel(xlsx_path, sheet_name=sheet_name, header=None)
    return df


def extract_amf_params():
    """Extract AMF country parameters."""
    print("\n" + "=" * 80)
    print("AMF PARAMETERS")
    print("=" * 80)

    # List sheets first
    xlsx = pd.ExcelFile(DATA_DIR / "amf.xlsx")
    print(f"\nAvailable sheets: {xlsx.sheet_names}")

    df = read_main_cea(DATA_DIR / "amf.xlsx")

    # Row 2 (index 1) has country names starting at column I (index 8)
    countries = df.iloc[1, 8:16].tolist()
    print(f"\nCountries: {countries}")

    # Key parameters and their row numbers (1-indexed from spreadsheet)
    params = {
        "Cost-effectiveness (xbenchmark)": 4,
        "Cost per ITN distributed": 28,
        "Effective coverage years per net": 43,
        "ITN effect on mortality (under-5)": 69,
        "Malaria mortality rate (1-59mo)": 70,
        "Under-5 deaths averted": 77,
        "5+ deaths averted": 85,
    }

    print("\nKey Parameters:")
    for name, row in params.items():
        values = df.iloc[row - 1, 8:16].tolist()
        print(f"  Row {row}: {name}")
        print(f"    {values}")

    # Get leverage/funging - find the right sheet name
    lf_sheet = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    if lf_sheet:
        lf_df = pd.read_excel(DATA_DIR / "amf.xlsx", sheet_name=lf_sheet[0], header=None)
        print(f"\n  Leverage/Funging (from '{lf_sheet[0]}'):")
        lf_params = {
            "Leverage (crowding in)": 111,
            "Funging (crowding out)": 112,
        }
        for name, row in lf_params.items():
            values = lf_df.iloc[row - 1, 8:16].tolist()
            print(f"    Row {row}: {name}: {values}")


def extract_mc_params():
    """Extract Malaria Consortium parameters."""
    print("\n" + "=" * 80)
    print("MALARIA CONSORTIUM PARAMETERS")
    print("=" * 80)

    df = read_main_cea(DATA_DIR / "malaria_consortium.xlsx")

    # Get country/variant names
    countries = df.iloc[1, 8:16].tolist()
    print(f"\nCountries/Variants: {countries}")

    params = {
        "Cost-effectiveness (xbenchmark)": 4,
        "Cost per SMC cycle": 28,
        "Cycles per year": 29,
        "Cost per child (all cycles)": 30,
        "SMC effect on mortality": 49,
        "Malaria mortality rate (3-59mo)": 50,
    }

    print("\nKey Parameters:")
    for name, row in params.items():
        values = df.iloc[row - 1, 8:16].tolist()
        print(f"  Row {row}: {name}")
        print(f"    {values}")


def extract_hk_params():
    """Extract Helen Keller parameters."""
    print("\n" + "=" * 80)
    print("HELEN KELLER PARAMETERS")
    print("=" * 80)

    df = read_main_cea(DATA_DIR / "helen_keller.xlsx")

    countries = df.iloc[1, 8:16].tolist()
    print(f"\nCountries: {countries}")

    params = {
        "Cost-effectiveness (xbenchmark)": 4,
        "Cost per VAS delivered": 33,
        "Cost per child (year of VAS)": 35,
        "Proportion counterfactual": 42,
        "VAS effect on mortality": 54,
        "Mortality rate (6-59mo)": 55,
    }

    print("\nKey Parameters:")
    for name, row in params.items():
        values = df.iloc[row - 1, 8:16].tolist()
        print(f"  Row {row}: {name}")
        print(f"    {values}")


def extract_ni_params():
    """Extract New Incentives parameters."""
    print("\n" + "=" * 80)
    print("NEW INCENTIVES PARAMETERS")
    print("=" * 80)

    df = read_main_cea(DATA_DIR / "new_incentives.xlsx")

    # Row 3 has state names
    states = df.iloc[2, 8:17].tolist()
    print(f"\nNigerian States: {states}")

    params = {
        "Cost-effectiveness (xbenchmark)": 4,
        "Proportion counterfactual": 25,
        "Prob death unvaccinated (under-5)": 46,
        "Under-5 deaths averted": 48,
    }

    print("\nKey Parameters:")
    for name, row in params.items():
        values = df.iloc[row - 1, 8:17].tolist()
        print(f"  Row {row}: {name}")
        print(f"    {values}")


def extract_gd_params():
    """Extract GiveDirectly parameters."""
    print("\n" + "=" * 80)
    print("GIVEDIRECTLY PARAMETERS")
    print("=" * 80)

    # GiveDirectly has different structure - use Country sheet
    df = pd.read_excel(DATA_DIR / "givedirectly.xlsx", sheet_name="Country", header=None)

    # Row 1 has countries
    countries = df.iloc[0, 1:6].tolist()
    print(f"\nCountries: {countries}")

    # Extract key rows
    print("\nKey Parameters from 'Country' sheet:")
    for i in range(min(20, len(df))):
        row = df.iloc[i].tolist()
        if row[0] and str(row[0]).strip():
            print(f"  Row {i+1}: {row[0]}: {row[1:6]}")


def extract_dw_params():
    """Extract Deworming parameters."""
    print("\n" + "=" * 80)
    print("DEWORMING PARAMETERS")
    print("=" * 80)

    # List available sheets
    xlsx = pd.ExcelFile(DATA_DIR / "deworming.xlsx")
    print(f"\nAvailable sheets: {xlsx.sheet_names}")

    # Read Deworm the World sheet
    df = pd.read_excel(DATA_DIR / "deworming.xlsx", sheet_name="Deworm the World", header=None)
    print(f"\nDeworm the World sheet - first 30 rows with content:")
    for i in range(min(30, len(df))):
        row = df.iloc[i].tolist()
        # Print rows that have content in first few columns
        if any(str(cell).strip() for cell in row[:5] if pd.notna(cell)):
            print(f"  Row {i+1}: {row[:8]}")


def main():
    print("=" * 80)
    print("GIVEWELL CEA PARAMETER VERIFICATION")
    print("=" * 80)

    extract_amf_params()
    extract_mc_params()
    extract_hk_params()
    extract_ni_params()
    extract_gd_params()
    extract_dw_params()


if __name__ == "__main__":
    main()
