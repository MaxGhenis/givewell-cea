#!/usr/bin/env python3
"""
Extract all CEA parameters from GiveWell spreadsheets and generate TypeScript.
"""

import pandas as pd
from pathlib import Path
import json
import re

DATA_DIR = Path("data/givewell-spreadsheets")


def clean_country_key(name: str) -> str:
    """Convert country name to snake_case key."""
    # Handle special cases
    name = name.strip()
    if name == "Côte d'Ivoire":
        return "cote_divoire"
    if "Nigeria" in name and "GF" in name:
        return "nigeria_gf"
    if "Nigeria" in name and "PMI" in name:
        return "nigeria_pmi"
    if "cohort" in name.lower():
        # Extract state name before "cohort"
        name = name.split(" - ")[0].strip()

    # General conversion
    return re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')


def extract_amf_params() -> dict:
    """Extract all AMF country parameters."""
    print("Extracting AMF parameters...")

    xlsx = pd.ExcelFile(DATA_DIR / "amf.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)
    lf_df = pd.read_excel(xlsx, sheet_name="LeverageFunging", header=None)

    # Countries from row 2
    countries_raw = df.iloc[1, 8:16].tolist()
    # Row 3 has sub-labels like "GF" and "PMI" for Nigeria
    sub_labels = df.iloc[2, 8:16].tolist()

    countries = []
    for i, c in enumerate(countries_raw):
        if c == "Nigeria":
            sub = str(sub_labels[i]) if pd.notna(sub_labels[i]) else ""
            if "GF" in sub or "Global Fund" in sub:
                countries.append("nigeria_gf")
            elif "PMI" in sub:
                countries.append("nigeria_pmi")
            else:
                countries.append(f"nigeria_{i}")
        else:
            countries.append(clean_country_key(str(c)))

    print(f"  Countries: {countries}")

    # Extract parameters for each country
    result = {}
    for i, country in enumerate(countries):
        col = 8 + i

        # Get values from specific rows
        cost_per_itn = df.iloc[27, col]  # Row 28
        people_per_net = df.iloc[40, col]  # Row 41
        effective_coverage = df.iloc[42, col]  # Row 43

        # Calculate cost per under-5 reached
        # From spreadsheet structure: cost per ITN / (people per net * proportion under 5 * effective years)
        prop_under5 = df.iloc[49, col]  # Row 50 - proportion under 5

        # Cost per person-year of coverage for under-5s
        # This is derived from the spreadsheet calculations
        person_years_u5 = df.iloc[54, col]  # Row 55 - person-years under 5
        grant_size = 1_000_000  # Standard grant
        cost_per_u5_reached = grant_size / person_years_u5 if person_years_u5 > 0 else 0

        params = {
            "costPerUnder5Reached": cost_per_u5_reached,
            "yearsEffectiveCoverage": df.iloc[42, col],  # Row 43
            "malariaMortalityRate": df.iloc[69, col],  # Row 70
            "itnEffectOnDeaths": df.iloc[68, col],  # Row 69
            "moralWeightUnder5": 116.25262,  # Standard value
            "moralWeight5Plus": 73.1914,  # Standard value
            # Ratios from spreadsheet
            "adjustmentOlderMortalities": df.iloc[84, col] / df.iloc[76, col] if df.iloc[76, col] > 0 else 0,  # Row 85/77
            "adjustmentDevelopmental": df.iloc[106, col] / (df.iloc[112, col] + df.iloc[116, col]) if (df.iloc[112, col] + df.iloc[116, col]) > 0 else 0,
            "adjustmentProgramBenefits": df.iloc[45, col] if pd.notna(df.iloc[45, col]) else 0.5,  # Row 46
            "adjustmentGrantee": -0.04,  # Standard value
            "adjustmentLeverage": lf_df.iloc[110, col],  # Row 111
            "adjustmentFunging": lf_df.iloc[111, col],  # Row 112
            "adjustmentLeverageFungingForCostPerLife": lf_df.iloc[112, col],  # Row 113
        }

        result[country] = params

    return result


def extract_mc_params() -> dict:
    """Extract Malaria Consortium parameters."""
    print("Extracting Malaria Consortium parameters...")

    xlsx = pd.ExcelFile(DATA_DIR / "malaria_consortium.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)

    # Find leverage/funging sheet
    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    # Countries from row 2
    countries_raw = df.iloc[1, 8:16].tolist()
    # Row 3 might have variant info
    variants = df.iloc[2, 8:16].tolist()

    countries = []
    drc_count = 0
    for i, c in enumerate(countries_raw):
        if pd.isna(c) or str(c).strip() == "":
            continue
        c_str = str(c).strip()
        if c_str == "DRC":
            drc_count += 1
            variant = str(variants[i]).strip() if pd.notna(variants[i]) else f"v{drc_count}"
            countries.append(f"drc_{clean_country_key(variant)}")
        else:
            countries.append(clean_country_key(c_str))

    print(f"  Countries/Variants: {countries}")

    result = {}
    for i, country in enumerate(countries):
        col = 8 + i

        # Cost per child reached (all cycles)
        cost_per_child = df.iloc[29, col]  # Row 30

        params = {
            "costPerChildReached": cost_per_child,
            "proportionMortalityDuringSeason": 0.7,  # Row 56 shows 70% for most
            "malariaMortalityRate": df.iloc[49, col],  # Row 50
            "smcEffect": df.iloc[48, col],  # Row 49
            "moralWeightUnder5": 116.25262,
            "adjustmentOlderMortalities": 0.07,  # Approximate from spreadsheet
            "adjustmentDevelopmental": 0.25,  # Approximate
            "adjustmentProgramBenefits": 0.2,  # Approximate
            "adjustmentGrantee": -0.08,
            "adjustmentLeverage": lf_df.iloc[110, col] if lf_df is not None and len(lf_df) > 110 else -0.004,
            "adjustmentFunging": lf_df.iloc[111, col] if lf_df is not None and len(lf_df) > 111 else -0.11,
        }

        result[country] = params

    return result


def extract_hk_params() -> dict:
    """Extract Helen Keller parameters."""
    print("Extracting Helen Keller parameters...")

    xlsx = pd.ExcelFile(DATA_DIR / "helen_keller.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)

    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    countries_raw = df.iloc[1, 8:16].tolist()
    countries = [clean_country_key(str(c)) for c in countries_raw if pd.notna(c) and str(c).strip()]

    print(f"  Countries: {countries}")

    result = {}
    for i, country in enumerate(countries):
        col = 8 + i

        params = {
            "costPerPersonUnder5": df.iloc[34, col],  # Row 35 - cost per child year of VAS
            "proportionReachedCounterfactual": df.iloc[41, col],  # Row 42
            "mortalityRateUnder5": df.iloc[54, col],  # Row 55
            "vasEffect": df.iloc[53, col],  # Row 54
            "moralWeightUnder5": 118.73259,
            "adjustmentDevelopmental": 0.245176,
            "adjustmentProgramBenefits": 0.565,
            "adjustmentGrantee": -0.04,
            "adjustmentLeverage": lf_df.iloc[110, col] if lf_df is not None and len(lf_df) > 110 else -0.002,
            "adjustmentFunging": lf_df.iloc[111, col] if lf_df is not None and len(lf_df) > 111 else -0.14,
        }

        result[country] = params

    return result


def extract_ni_params() -> dict:
    """Extract New Incentives parameters."""
    print("Extracting New Incentives parameters...")

    xlsx = pd.ExcelFile(DATA_DIR / "new_incentives.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)

    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    # Row 3 has state names
    states_raw = df.iloc[2, 8:17].tolist()
    states = [clean_country_key(str(s).split(" - ")[0]) for s in states_raw if pd.notna(s) and str(s).strip()]

    print(f"  States: {states}")

    result = {}
    for i, state in enumerate(states):
        col = 8 + i

        # Get cost per child - need to find the right row
        # Looking at the structure, cost data is around row 15-20
        cost_per_child = df.iloc[14, col] if pd.notna(df.iloc[14, col]) else 18.21  # Approximate

        params = {
            "costPerChildReached": cost_per_child if cost_per_child > 0 else 18.21,
            "proportionReachedCounterfactual": 1 - df.iloc[24, col],  # Row 25 is proportion who wouldn't be reached
            "probabilityDeathUnvaccinated": df.iloc[45, col],  # Row 46
            "vaccineEffect": 0.52,  # Approximate from spreadsheet
            "moralWeightUnder5": 116.25262,
            "adjustmentOlderMortalities": 0.18,
            "adjustmentDevelopmental": 0.28,
            "adjustmentConsumption": 0.06,
            "adjustmentProgramBenefits": 0.503,
            "adjustmentGrantee": -0.07,
            "adjustmentLeverage": lf_df.iloc[110, col] if lf_df is not None and len(lf_df) > 110 else -0.003,
            "adjustmentFunging": lf_df.iloc[111, col] if lf_df is not None and len(lf_df) > 111 else -0.12,
        }

        result[state] = params

    return result


def extract_gd_params() -> dict:
    """Extract GiveDirectly parameters."""
    print("Extracting GiveDirectly parameters...")

    df = pd.read_excel(DATA_DIR / "givedirectly.xlsx", sheet_name="Country", header=None)

    countries_raw = df.iloc[0, 1:6].tolist()
    countries = [clean_country_key(str(c)) for c in countries_raw if pd.notna(c)]

    print(f"  Countries: {countries}")

    result = {}
    for i, country in enumerate(countries):
        col = 1 + i

        # Extract values from Country sheet
        household_size = df.iloc[3, col] if pd.notna(df.iloc[3, col]) else 4.5  # Row 4
        prop_under5 = df.iloc[5, col] if pd.notna(df.iloc[5, col]) else 0.15  # Row 6
        consumption = df.iloc[8, col] if pd.notna(df.iloc[8, col]) else 500  # Row 9

        params = {
            "transferAmount": 1000,
            "overheadRate": 0.20,
            "baselineConsumption": consumption,
            "consumptionPersistenceYears": 10,
            "discountRate": 0.04,
            "spilloverMultiplier": 2.5,
            "spilloverDiscount": 0.45,
            "mortalityEffect": 0.23,
            "under5MortalityRate": 0.05,  # Approximate
            "householdSize": household_size,
            "proportionUnder5": prop_under5,
            "moralWeightUnder5": 116.25,
            "mortalityDiscount": 0.50,
        }

        result[country] = params

    return result


def generate_typescript(amf: dict, mc: dict, hk: dict, ni: dict, gd: dict) -> str:
    """Generate TypeScript code for all parameters."""

    def format_value(v):
        if isinstance(v, float):
            if abs(v) < 0.0001:
                return f"{v}"
            return f"{v}"
        return str(v)

    def format_params(params: dict, indent: int = 4) -> str:
        lines = []
        for k, v in params.items():
            lines.append(f"{' ' * indent}{k}: {format_value(v)},")
        return "\n".join(lines)

    # Generate AMF section
    amf_countries = list(amf.keys())
    amf_names = {k: k.replace("_", " ").title().replace("Gf", "(GF)").replace("Pmi", "(PMI)").replace("Drc", "DRC") for k in amf_countries}

    output = []
    output.append("// AMF Countries")
    output.append(f"export const AMF_COUNTRIES = {json.dumps(amf_countries)} as const;")
    output.append(f"export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {json.dumps(amf_names, indent=2)};")
    output.append("")
    output.append("export const AMF_COUNTRY_PARAMS: Record<AMFCountry, Omit<AMFInputs, 'grantSize'>> = {")
    for country, params in amf.items():
        output.append(f"  {country}: {{")
        output.append(format_params(params, 4))
        output.append("  },")
    output.append("};")

    return "\n".join(output)


def main():
    print("=" * 60)
    print("Extracting all CEA parameters from spreadsheets")
    print("=" * 60)

    amf = extract_amf_params()
    mc = extract_mc_params()
    hk = extract_hk_params()
    ni = extract_ni_params()
    gd = extract_gd_params()

    # Save as JSON for easier inspection
    all_params = {
        "amf": amf,
        "malaria_consortium": mc,
        "helen_keller": hk,
        "new_incentives": ni,
        "givedirectly": gd,
    }

    with open("data/extracted_params.json", "w") as f:
        json.dump(all_params, f, indent=2, default=str)

    print("\n" + "=" * 60)
    print("Saved to data/extracted_params.json")
    print("=" * 60)

    # Print summary
    print(f"\nAMF: {len(amf)} countries")
    print(f"Malaria Consortium: {len(mc)} countries/variants")
    print(f"Helen Keller: {len(hk)} countries")
    print(f"New Incentives: {len(ni)} states")
    print(f"GiveDirectly: {len(gd)} countries")


if __name__ == "__main__":
    main()
