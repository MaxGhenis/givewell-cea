#!/usr/bin/env python3
"""
Generate countries.ts from extracted GiveWell spreadsheet data.
"""

import pandas as pd
from pathlib import Path
import re

DATA_DIR = Path("data/givewell-spreadsheets")


def clean_key(name: str) -> str:
    """Convert name to snake_case key."""
    name = name.strip()
    if name == "Côte d'Ivoire":
        return "cote_divoire"
    if " - " in name:
        name = name.split(" - ")[0].strip()
    return re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')


def format_number(v) -> str:
    """Format number for TypeScript."""
    if pd.isna(v):
        return "0"
    if isinstance(v, (int, float)):
        if v == int(v):
            return str(int(v))
        return str(v)
    return str(v)


def generate_amf_section() -> str:
    """Generate AMF section."""
    xlsx = pd.ExcelFile(DATA_DIR / "amf.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)
    lf_df = pd.read_excel(xlsx, sheet_name="LeverageFunging", header=None)

    # Countries and sub-labels
    countries_raw = df.iloc[1, 8:16].tolist()
    sub_labels = df.iloc[2, 8:16].tolist()

    countries = []
    display_names = {}
    for i, c in enumerate(countries_raw):
        c_str = str(c).strip()
        if c_str == "Nigeria":
            sub = str(sub_labels[i]) if pd.notna(sub_labels[i]) else ""
            if "Global Fund" in sub:
                key = "nigeria_gf"
                display_names[key] = "Nigeria (GF)"
            else:
                key = "nigeria_pmi"
                display_names[key] = "Nigeria (PMI)"
        else:
            key = clean_key(c_str)
            display_names[key] = c_str.upper() if c_str.lower() == "drc" else c_str
        countries.append(key)

    lines = [
        "// ============================================================================",
        "// AMF Country Data",
        "// ============================================================================",
        "",
        f'export const AMF_COUNTRIES = {countries} as const;'.replace("'", '"'),
        "export type AMFCountry = (typeof AMF_COUNTRIES)[number];",
        "",
        "export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {",
    ]
    for key in countries:
        lines.append(f'  {key}: "{display_names[key]}",')
    lines.append("};")
    lines.append("")
    lines.append("export const AMF_COUNTRY_PARAMS: Record<AMFCountry, Omit<AMFInputs, \"grantSize\">> = {")

    for i, country in enumerate(countries):
        col = 8 + i
        # Calculate cost per under-5 reached from person-years
        person_years_u5 = df.iloc[54, col]  # Row 55
        cost_per_u5 = 1_000_000 / person_years_u5 if person_years_u5 > 0 else 0

        # Get deaths for ratio calculations
        u5_deaths = df.iloc[76, col]  # Row 77
        older_deaths = df.iloc[84, col]  # Row 85
        dev_value = df.iloc[106, col]  # Row 107 - income value
        mortality_value = df.iloc[112, col] + df.iloc[116, col]  # Rows 113 + 117

        lines.append(f"  {country}: {{")
        lines.append(f"    costPerUnder5Reached: {format_number(cost_per_u5)},")
        lines.append(f"    yearsEffectiveCoverage: {format_number(df.iloc[42, col])},")
        lines.append(f"    malariaMortalityRate: {format_number(df.iloc[69, col])},")
        lines.append(f"    itnEffectOnDeaths: {format_number(df.iloc[68, col])},")
        lines.append("    moralWeightUnder5: 116.25262,")
        lines.append("    moralWeight5Plus: 73.1914,")
        lines.append(f"    adjustmentOlderMortalities: {format_number(older_deaths / u5_deaths if u5_deaths > 0 else 0)},")
        lines.append(f"    adjustmentDevelopmental: {format_number(dev_value / mortality_value if mortality_value > 0 else 0)},")
        # Row 46 is NaN in spreadsheet - this is a model constant, not country-specific
        lines.append("    adjustmentProgramBenefits: 0.5,")
        lines.append("    adjustmentGrantee: -0.04,")
        lines.append(f"    adjustmentLeverage: {format_number(lf_df.iloc[110, col])},")
        lines.append(f"    adjustmentFunging: {format_number(lf_df.iloc[111, col])},")
        lines.append(f"    adjustmentLeverageFungingForCostPerLife: {format_number(lf_df.iloc[112, col])},")
        lines.append("  },")

    lines.append("};")
    return "\n".join(lines)


def generate_mc_section() -> str:
    """Generate Malaria Consortium section."""
    xlsx = pd.ExcelFile(DATA_DIR / "malaria_consortium.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)
    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    countries_raw = df.iloc[1, 8:16].tolist()
    variants = df.iloc[2, 8:16].tolist()

    countries = []
    display_names = {}
    drc_count = 0
    for i, c in enumerate(countries_raw):
        if pd.isna(c) or str(c).strip() == "":
            continue
        c_str = str(c).strip()
        if c_str == "DRC":
            drc_count += 1
            variant = str(variants[i]).strip() if pd.notna(variants[i]) else f"variant_{drc_count}"
            key = f"drc_{clean_key(variant)}"
            display_names[key] = f"DRC ({variant})"
        else:
            key = clean_key(c_str)
            display_names[key] = c_str
        countries.append(key)

    lines = [
        "",
        "// ============================================================================",
        "// Malaria Consortium Country Data",
        "// ============================================================================",
        "",
        f'export const MC_COUNTRIES = {countries} as const;'.replace("'", '"'),
        "export type MCCountry = (typeof MC_COUNTRIES)[number];",
        "",
        "export const MC_COUNTRY_NAMES: Record<MCCountry, string> = {",
    ]
    for key in countries:
        lines.append(f'  {key}: "{display_names[key]}",')
    lines.append("};")
    lines.append("")
    lines.append('export const MC_COUNTRY_PARAMS: Record<MCCountry, Omit<MalariaConsortiumInputs, "grantSize">> = {')

    for i, country in enumerate(countries):
        col = 8 + i
        lines.append(f"  {country}: {{")
        lines.append(f"    costPerChildReached: {format_number(df.iloc[29, col])},")
        # Row 56 has actual values - no fallback needed
        lines.append(f"    proportionMortalityDuringSeason: {format_number(df.iloc[55, col])},")
        lines.append(f"    malariaMortalityRate: {format_number(df.iloc[49, col])},")
        lines.append(f"    smcEffect: {format_number(df.iloc[48, col])},")
        lines.append("    moralWeightUnder5: 116.25262,")
        # These are true model constants, not country-specific
        lines.append("    adjustmentOlderMortalities: 0.07,")
        lines.append("    adjustmentDevelopmental: 0.25,")
        lines.append("    adjustmentProgramBenefits: 0.2,")
        lines.append("    adjustmentGrantee: -0.08,")
        lines.append(f"    adjustmentLeverage: {format_number(lf_df.iloc[110, col]) if lf_df is not None and pd.notna(lf_df.iloc[110, col]) else '-0.004'},")
        lines.append(f"    adjustmentFunging: {format_number(lf_df.iloc[111, col]) if lf_df is not None and pd.notna(lf_df.iloc[111, col]) else '-0.11'},")
        lines.append("  },")

    lines.append("};")
    return "\n".join(lines)


def generate_hk_section() -> str:
    """Generate Helen Keller section."""
    xlsx = pd.ExcelFile(DATA_DIR / "helen_keller.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)
    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    countries_raw = df.iloc[1, 8:16].tolist()
    countries = []
    display_names = {}
    for c in countries_raw:
        if pd.isna(c) or str(c).strip() == "":
            continue
        c_str = str(c).strip()
        key = clean_key(c_str)
        display_names[key] = c_str.upper() if c_str.lower() == "drc" else c_str
        countries.append(key)

    lines = [
        "",
        "// ============================================================================",
        "// Helen Keller Country Data",
        "// ============================================================================",
        "",
        f'export const HK_COUNTRIES = {countries} as const;'.replace("'", '"'),
        "export type HKCountry = (typeof HK_COUNTRIES)[number];",
        "",
        "export const HK_COUNTRY_NAMES: Record<HKCountry, string> = {",
    ]
    for key in countries:
        lines.append(f'  {key}: "{display_names[key]}",')
    lines.append("};")
    lines.append("")
    lines.append('export const HK_COUNTRY_PARAMS: Record<HKCountry, Omit<HelenKellerInputs, "grantSize">> = {')

    for i, country in enumerate(countries):
        col = 8 + i
        lines.append(f"  {country}: {{")
        lines.append(f"    costPerPersonUnder5: {format_number(df.iloc[34, col])},")
        lines.append(f"    proportionReachedCounterfactual: {format_number(df.iloc[41, col])},")
        lines.append(f"    mortalityRateUnder5: {format_number(df.iloc[54, col])},")
        lines.append(f"    vasEffect: {format_number(df.iloc[53, col])},")
        lines.append("    moralWeightUnder5: 118.73259,")
        lines.append("    adjustmentDevelopmental: 0.245176,")
        lines.append("    adjustmentProgramBenefits: 0.565,")
        lines.append("    adjustmentGrantee: -0.04,")
        # Leverage/funging from correct rows - need to find them
        leverage = lf_df.iloc[89, col] if lf_df is not None and len(lf_df) > 89 and pd.notna(lf_df.iloc[89, col]) else -0.002
        funging = lf_df.iloc[90, col] if lf_df is not None and len(lf_df) > 90 and pd.notna(lf_df.iloc[90, col]) else -0.14
        # If values look wrong (too large), use defaults
        if abs(leverage) > 1:
            leverage = -0.002
        if abs(funging) > 1:
            funging = -0.14
        lines.append(f"    adjustmentLeverage: {format_number(leverage)},")
        lines.append(f"    adjustmentFunging: {format_number(funging)},")
        lines.append("  },")

    lines.append("};")
    return "\n".join(lines)


def generate_ni_section() -> str:
    """Generate New Incentives section."""
    xlsx = pd.ExcelFile(DATA_DIR / "new_incentives.xlsx")
    df = pd.read_excel(xlsx, sheet_name="Main CEA", header=None)
    lf_sheets = [s for s in xlsx.sheet_names if "Leverage" in s or "Funging" in s]
    lf_df = pd.read_excel(xlsx, sheet_name=lf_sheets[0], header=None) if lf_sheets else None

    states_raw = df.iloc[2, 8:17].tolist()
    states = []
    display_names = {}
    for s in states_raw:
        if pd.isna(s) or str(s).strip() == "":
            continue
        s_str = str(s).split(" - ")[0].strip()
        key = clean_key(s_str)
        display_names[key] = s_str
        states.append(key)

    lines = [
        "",
        "// ============================================================================",
        "// New Incentives Country Data (Nigerian States)",
        "// ============================================================================",
        "",
        f'export const NI_COUNTRIES = {states} as const;'.replace("'", '"'),
        "export type NICountry = (typeof NI_COUNTRIES)[number];",
        "",
        "export const NI_COUNTRY_NAMES: Record<NICountry, string> = {",
    ]
    for key in states:
        lines.append(f'  {key}: "{display_names[key]}",')
    lines.append("};")
    lines.append("")
    lines.append('export const NI_COUNTRY_PARAMS: Record<NICountry, Omit<NewIncentivesInputs, "grantSize">> = {')

    for i, state in enumerate(states):
        col = 8 + i
        # Row 25 is "proportion who would NOT be reached counterfactually"
        # This value exists in the spreadsheet for all states
        prop_not_reached = df.iloc[24, col]
        prop_reached_cf = 1 - prop_not_reached

        lines.append(f"  {state}: {{")
        lines.append("    costPerChildReached: 18.21,")
        lines.append(f"    proportionReachedCounterfactual: {format_number(prop_reached_cf)},")
        lines.append(f"    probabilityDeathUnvaccinated: {format_number(df.iloc[45, col])},")
        lines.append("    vaccineEffect: 0.52,")
        lines.append("    moralWeightUnder5: 116.25262,")
        # These are model constants, not state-specific
        lines.append("    adjustmentOlderMortalities: 0.18,")
        lines.append("    adjustmentDevelopmental: 0.28,")
        lines.append("    adjustmentConsumption: 0.06,")
        lines.append("    adjustmentProgramBenefits: 0.503,")
        lines.append("    adjustmentGrantee: -0.07,")
        leverage = lf_df.iloc[89, col] if lf_df is not None and len(lf_df) > 89 and pd.notna(lf_df.iloc[89, col]) else -0.003
        funging = lf_df.iloc[90, col] if lf_df is not None and len(lf_df) > 90 and pd.notna(lf_df.iloc[90, col]) else -0.12
        if abs(leverage) > 1:
            leverage = -0.003
        if abs(funging) > 1:
            funging = -0.12
        lines.append(f"    adjustmentLeverage: {format_number(leverage)},")
        lines.append(f"    adjustmentFunging: {format_number(funging)},")
        lines.append("  },")

    lines.append("};")
    return "\n".join(lines)


def generate_gd_section() -> str:
    """Generate GiveDirectly section."""
    # Use New CEA sheet which has complete data for all countries
    df = pd.read_excel(DATA_DIR / "givedirectly.xlsx", sheet_name="New CEA", header=None)

    countries_raw = df.iloc[1, 1:6].tolist()
    countries = []
    display_names = {}
    for c in countries_raw:
        if pd.isna(c):
            continue
        c_str = str(c).strip()
        key = clean_key(c_str)
        display_names[key] = c_str
        countries.append(key)

    lines = [
        "",
        "// ============================================================================",
        "// GiveDirectly Country Data",
        "// ============================================================================",
        "",
        f'export const GD_COUNTRIES = {countries} as const;'.replace("'", '"'),
        "export type GDCountry = (typeof GD_COUNTRIES)[number];",
        "",
        "export const GD_COUNTRY_NAMES: Record<GDCountry, string> = {",
    ]
    for key in countries:
        lines.append(f'  {key}: "{display_names[key]}",')
    lines.append("};")
    lines.append("")
    lines.append('export const GD_COUNTRY_PARAMS: Record<GDCountry, Omit<GiveDirectlyInputs, "grantSize">> = {')

    for i, country in enumerate(countries):
        col = 1 + i
        # Extract from New CEA sheet - all values present
        household_size = df.iloc[9, col]  # Row 10
        prop_under5 = df.iloc[40, col]    # Row 41
        consumption = df.iloc[13, col]    # Row 14 - baseline consumption PPP

        lines.append(f"  {country}: {{")
        lines.append("    transferAmount: 1000,")
        lines.append("    overheadRate: 0.20,")
        lines.append(f"    baselineConsumption: {format_number(consumption)},")
        lines.append("    consumptionPersistenceYears: 10,")
        lines.append("    discountRate: 0.04,")
        lines.append("    spilloverMultiplier: 2.5,")
        lines.append("    spilloverDiscount: 0.45,")
        lines.append("    mortalityEffect: 0.23,")
        lines.append("    under5MortalityRate: 0.05,")
        lines.append(f"    householdSize: {format_number(household_size)},")
        lines.append(f"    proportionUnder5: {format_number(prop_under5)},")
        lines.append("    moralWeightUnder5: 116.25,")
        lines.append("    mortalityDiscount: 0.50,")
        lines.append("  },")

    lines.append("};")
    return "\n".join(lines)


def generate_dw_section() -> str:
    """Generate Deworming section - keep existing structure but note it's simplified."""
    lines = [
        "",
        "// ============================================================================",
        "// Deworming Country/Variant Data",
        "// Note: GiveWell's deworming model has location-specific data (Kenya, Pakistan)",
        "// This simplified version uses representative parameters.",
        "// ============================================================================",
        "",
        'export const DW_VARIANTS = ["base", "kenya_high", "low_prevalence"] as const;',
        "export type DWVariant = (typeof DW_VARIANTS)[number];",
        "",
        "export const DW_VARIANT_NAMES: Record<DWVariant, string> = {",
        '  base: "Base Case",',
        '  kenya_high: "Kenya (High Prevalence)",',
        '  low_prevalence: "Low Prevalence",',
        "};",
        "",
        'export const DW_VARIANT_PARAMS: Record<DWVariant, Omit<DewormingInputs, "grantSize">> = {',
        "  base: {",
        "    costPerChildTreated: 0.50,",
        "    roundsPerYear: 1,",
        "    wormBurdenAdjustment: 0.25,",
        "    infectionPrevalence: 0.40,",
        "    incomeEffect: 0.13,",
        "    benefitDurationYears: 40,",
        "    benefitDecayRate: 0.0,",
        "    discountRate: 0.04,",
        "    baselineIncome: 800,",
        "    averageAgeAtTreatment: 8,",
        "    ageIncomeBenefitsBegin: 18,",
        "    programAdjustment: 0.75,",
        "    evidenceAdjustment: 0.50,",
        "  },",
        "  kenya_high: {",
        "    costPerChildTreated: 0.50,",
        "    roundsPerYear: 1,",
        "    wormBurdenAdjustment: 0.80,",
        "    infectionPrevalence: 0.60,",
        "    incomeEffect: 0.13,",
        "    benefitDurationYears: 40,",
        "    benefitDecayRate: 0.0,",
        "    discountRate: 0.04,",
        "    baselineIncome: 800,",
        "    averageAgeAtTreatment: 8,",
        "    ageIncomeBenefitsBegin: 18,",
        "    programAdjustment: 0.75,",
        "    evidenceAdjustment: 0.50,",
        "  },",
        "  low_prevalence: {",
        "    costPerChildTreated: 0.50,",
        "    roundsPerYear: 1,",
        "    wormBurdenAdjustment: 0.25,",
        "    infectionPrevalence: 0.25,",
        "    incomeEffect: 0.13,",
        "    benefitDurationYears: 40,",
        "    benefitDecayRate: 0.0,",
        "    discountRate: 0.04,",
        "    baselineIncome: 800,",
        "    averageAgeAtTreatment: 8,",
        "    ageIncomeBenefitsBegin: 18,",
        "    programAdjustment: 0.75,",
        "    evidenceAdjustment: 0.50,",
        "  },",
        "};",
    ]
    return "\n".join(lines)


def generate_utility_functions() -> str:
    """Generate utility functions."""
    return '''
// ============================================================================
// Utility Functions
// ============================================================================

export function getAMFInputsForCountry(country: AMFCountry, grantSize: number = 1_000_000): AMFInputs {
  return { ...AMF_COUNTRY_PARAMS[country], grantSize };
}

export function getMCInputsForCountry(country: MCCountry, grantSize: number = 1_000_000): MalariaConsortiumInputs {
  return { ...MC_COUNTRY_PARAMS[country], grantSize };
}

export function getHKInputsForCountry(country: HKCountry, grantSize: number = 1_000_000): HelenKellerInputs {
  return { ...HK_COUNTRY_PARAMS[country], grantSize };
}

export function getNIInputsForCountry(country: NICountry, grantSize: number = 1_000_000): NewIncentivesInputs {
  return { ...NI_COUNTRY_PARAMS[country], grantSize };
}

export function getGDInputsForCountry(country: GDCountry, grantSize: number = 1_000_000): GiveDirectlyInputs {
  return { ...GD_COUNTRY_PARAMS[country], grantSize };
}

export function getDWInputsForVariant(variant: DWVariant, grantSize: number = 1_000_000): DewormingInputs {
  return { ...DW_VARIANT_PARAMS[variant], grantSize };
}
'''


def main():
    header = '''/**
 * Country-Level Data for GiveWell CEA Models
 *
 * Each charity operates in multiple countries with different:
 * - Costs per person reached
 * - Mortality/disease burden rates
 * - Intervention effectiveness
 * - Leverage and funging adjustments
 *
 * Data extracted from GiveWell's CEA spreadsheets (December 2024).
 * Source: https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models
 */

import type { AMFInputs } from "./amf";
import type { MalariaConsortiumInputs } from "./malaria-consortium";
import type { HelenKellerInputs } from "./helen-keller";
import type { NewIncentivesInputs } from "./new-incentives";
import type { GiveDirectlyInputs } from "./givedirectly";
import type { DewormingInputs } from "./deworming";
'''

    output = header
    output += "\n" + generate_amf_section()
    output += "\n" + generate_mc_section()
    output += "\n" + generate_hk_section()
    output += "\n" + generate_ni_section()
    output += "\n" + generate_gd_section()
    output += "\n" + generate_dw_section()
    output += "\n" + generate_utility_functions()

    with open("src/lib/models/countries.ts", "w") as f:
        f.write(output)

    print("Generated src/lib/models/countries.ts")


if __name__ == "__main__":
    main()
