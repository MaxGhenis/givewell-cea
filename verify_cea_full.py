#!/usr/bin/env python3
"""
Complete CEA Verification Script

Extracts final cost-effectiveness values from GiveWell spreadsheets and compares
them with the tool's TypeScript implementation.
"""

import openpyxl
import subprocess
import json
from pathlib import Path
from typing import Dict, Any, Optional

# Directory containing GiveWell spreadsheets
DATA_DIR = Path(__file__).parent / "data" / "givewell-spreadsheets"

def extract_amf_country_values(sheet, country_col: str) -> Dict[str, Any]:
    """Extract CEA values for a specific AMF country from the Simple CEA sheet."""
    try:
        return {
            "grant_size": sheet[f"{country_col}7"].value,
            "cost_per_under5_reached": sheet[f"{country_col}10"].value,
            "people_under5_reached": sheet[f"{country_col}11"].value,
            "years_effective_coverage": sheet[f"{country_col}12"].value,
            "malaria_mortality_rate": sheet[f"{country_col}13"].value,
            "itn_effect_on_deaths": sheet[f"{country_col}14"].value,
            "deaths_averted_under5": sheet[f"{country_col}15"].value,
            "cost_per_under5_death_averted": sheet[f"{country_col}18"].value,
            "initial_x_benchmark": sheet[f"{country_col}20"].value,
            "adjustment_older_mortalities": sheet[f"{country_col}23"].value,
            "adjustment_developmental": sheet[f"{country_col}24"].value,
            "adjustment_program_benefits": sheet[f"{country_col}32"].value,
            "adjustment_grantee": sheet[f"{country_col}33"].value,
            "adjustment_leverage": sheet[f"{country_col}34"].value,
            "adjustment_funging": sheet[f"{country_col}35"].value,
            "final_x_benchmark": sheet[f"{country_col}38"].value,
            "final_cost_per_life_saved": sheet[f"{country_col}39"].value,
        }
    except Exception as e:
        print(f"Error extracting AMF values from column {country_col}: {e}")
        return {}

def extract_amf_values(filepath: Path) -> Dict[str, Dict[str, Any]]:
    """Extract all AMF country values."""
    wb = openpyxl.load_workbook(filepath, data_only=True)
    simple_sheet = wb["Simple CEA"]

    # Map country names to columns based on what we saw in row 2
    country_columns = {
        "chad": "I",
        "drc": "J",
        "guinea": "K",
        "nigeria_gf": "L",
        "nigeria_pmi": "M",
        "south_sudan": "N",
        "togo": "O",
        "uganda": "P",
    }

    results = {}
    for country_key, col in country_columns.items():
        country_data = extract_amf_country_values(simple_sheet, col)
        if country_data:
            results[country_key] = country_data

    return results

def run_tool_calculations() -> Dict[str, Any]:
    """Run the TypeScript tool to get calculated values."""
    # We'll need to create a small script to extract values
    # For now, let's run the existing tests
    try:
        result = subprocess.run(
            ["bun", "test", "src/lib/models/amf.test.ts"],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        return {"stdout": result.stdout, "stderr": result.stderr, "returncode": result.returncode}
    except Exception as e:
        print(f"Error running tool: {e}")
        return {}

def compare_values(spreadsheet_val: float, tool_val: float, tolerance: float = 0.01) -> Dict[str, Any]:
    """
    Compare two values and return comparison result.

    Args:
        spreadsheet_val: Value from GiveWell spreadsheet
        tool_val: Value from our tool
        tolerance: Acceptable relative difference (default 1%)

    Returns:
        Dict with match status and difference info
    """
    if spreadsheet_val is None or tool_val is None:
        return {"match": False, "reason": "missing_value"}

    if spreadsheet_val == 0:
        abs_diff = abs(tool_val - spreadsheet_val)
        return {
            "match": abs_diff < tolerance,
            "abs_diff": abs_diff,
            "spreadsheet": spreadsheet_val,
            "tool": tool_val,
        }

    rel_diff = abs((tool_val - spreadsheet_val) / spreadsheet_val)
    match = rel_diff < tolerance

    return {
        "match": match,
        "rel_diff_pct": rel_diff * 100,
        "abs_diff": tool_val - spreadsheet_val,
        "spreadsheet": spreadsheet_val,
        "tool": tool_val,
    }

def format_number(val: Any) -> str:
    """Format a number for display."""
    if val is None:
        return "N/A"
    if isinstance(val, (int, float)):
        if abs(val) < 0.01:
            return f"{val:.6f}"
        elif abs(val) < 1:
            return f"{val:.4f}"
        elif abs(val) < 100:
            return f"{val:.2f}"
        else:
            return f"{val:,.0f}"
    return str(val)

def main():
    """Main verification routine."""
    print("=" * 80)
    print("GiveWell CEA Verification Report")
    print("=" * 80)
    print()

    # Extract AMF values from spreadsheet
    print("Extracting values from GiveWell AMF spreadsheet...")
    amf_file = DATA_DIR / "amf.xlsx"
    amf_spreadsheet_values = extract_amf_values(amf_file)

    print(f"Successfully extracted data for {len(amf_spreadsheet_values)} AMF countries")
    print()

    # Display extracted values in a table format
    print("=" * 80)
    print("AMF SPREADSHEET VALUES (from GiveWell)")
    print("=" * 80)
    print()

    for country, values in amf_spreadsheet_values.items():
        print(f"\n{country.upper().replace('_', ' ')}:")
        print("-" * 60)

        key_metrics = [
            ("Grant Size", "grant_size", "$"),
            ("Cost per U5 Reached", "cost_per_under5_reached", "$"),
            ("People U5 Reached", "people_under5_reached", "#"),
            ("Years Effective Coverage", "years_effective_coverage", "years"),
            ("Malaria Mortality Rate", "malaria_mortality_rate", "%"),
            ("ITN Effect on Deaths", "itn_effect_on_deaths", "%"),
            ("Deaths Averted U5", "deaths_averted_under5", "#"),
            ("Cost per U5 Death Averted", "cost_per_under5_death_averted", "$"),
            ("Initial x Benchmark", "initial_x_benchmark", "x"),
            ("Adj: Older Mortalities", "adjustment_older_mortalities", "%"),
            ("Adj: Developmental", "adjustment_developmental", "%"),
            ("Adj: Program Benefits", "adjustment_program_benefits", "%"),
            ("Adj: Grantee", "adjustment_grantee", "%"),
            ("Adj: Leverage", "adjustment_leverage", "%"),
            ("Adj: Funging", "adjustment_funging", "%"),
            ("FINAL x Benchmark", "final_x_benchmark", "x"),
            ("FINAL Cost per Life Saved", "final_cost_per_life_saved", "$"),
        ]

        for label, key, unit in key_metrics:
            val = values.get(key)
            formatted = format_number(val)
            print(f"  {label:.<40} {formatted:>15} {unit}")

    # Save results
    output_file = Path(__file__).parent / "verification_report.json"
    with open(output_file, 'w') as f:
        json.dump({
            "amf": amf_spreadsheet_values,
        }, f, indent=2)

    print()
    print("=" * 80)
    print(f"Full report saved to: {output_file}")
    print("=" * 80)
    print()

    # Instructions for next steps
    print("NEXT STEPS:")
    print("-" * 80)
    print("1. Run TypeScript tests: bun test src/lib/models/amf.test.ts")
    print("2. Extract calculated values from the tests")
    print("3. Compare with the spreadsheet values above")
    print()
    print("Key metrics to verify:")
    print("  - Final x Benchmark (cost-effectiveness)")
    print("  - Final Cost per Life Saved")
    print("  - Deaths Averted")
    print()

if __name__ == "__main__":
    main()
