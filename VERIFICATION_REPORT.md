# GiveWell CEA Verification Report

## Executive Summary

This report compares the GiveWell CEA tool's calculations against GiveWell's official spreadsheets (downloaded December 2024).

**Status**: ✅ **CALCULATIONS VERIFIED - PARAMETERS OUTDATED**

- **Tool calculations**: ✅ Correct implementation of GiveWell's methodology
- **Test values**: ✅ All tests pass with values from GiveWell spreadsheets
- **Countries.ts parameters**: ❌ Contains outdated values from older GiveWell spreadsheets

## Detailed Findings

### 1. AMF (Against Malaria Foundation)

#### Calculation Verification

The AMF calculation model (`src/lib/models/amf.ts`) **correctly implements** GiveWell's methodology:

| Country | Metric | Tool Output | GiveWell Spreadsheet | Match |
|---------|--------|-------------|---------------------|-------|
| Chad | Final x Benchmark | 4.82 | 4.82 | ✅ |
| Chad | Final Cost per Life Saved | $15,639 | $15,639 | ✅ |
| Chad | Deaths Averted (U5) | 46.89 | 46.89 | ✅ |
| DRC | Final x Benchmark | 14.63 | 14.63 | ✅ |
| DRC | Final Cost per Life Saved | $5,101 | $5,101 | ✅ |
| DRC | Deaths Averted (U5) | 202.57 | 202.57 | ✅ |
| Nigeria (PMI) | Final x Benchmark | 13.25 | 13.25 | ✅ |
| Nigeria (PMI) | Final Cost per Life Saved | $5,192 | $5,192 | ✅ |
| Nigeria (PMI) | Deaths Averted (U5) | 144.59 | 144.59 | ✅ |
| Guinea | Final x Benchmark | 22.79 | 22.79 | ✅ |
| Guinea | Final Cost per Life Saved | $2,941 | $2,941 | ✅ |
| Guinea | Deaths Averted (U5) | 449.50 | 449.50 | ✅ |

**All AMF tests pass**: 24/24 ✅

#### Parameter Discrepancies in countries.ts

The `src/lib/models/countries.ts` file contains **outdated parameters** from an earlier version of GiveWell's spreadsheets:

| Country | Parameter | countries.ts | Current Spreadsheet | Difference |
|---------|-----------|--------------|-------------------|------------|
| Chad | Cost per U5 Reached | $7.73 | $15.19 | -49% ❌ |
| Chad | Malaria Mortality Rate | 0.00132 | 0.00151 | -13% ❌ |
| Chad | Adj: Older Mortalities | 0.472 | 0.297 | +59% ❌ |
| Chad | Adj: Developmental | 0.422 | 0.609 | -31% ❌ |
| Chad | Adj: Program Benefits | 0.500 | 0.529 | -5% ❌ |
| DRC | Cost per U5 Reached | $22.00 | $26.24 | -16% ❌ |
| DRC | Malaria Mortality Rate | 0.00306 | 0.00798 | -62% ❌ |
| DRC | Adj: Older Mortalities | 0.237 | 0.149 | +59% ❌ |
| DRC | Adj: Developmental | 0.341 | 0.492 | -31% ❌ |
| DRC | Adj: Program Benefits | 0.500 | 0.479 | +4% ❌ |

### 2. GiveWell Spreadsheet Structure

The official GiveWell AMF CEA spreadsheet (amf.xlsx) contains:

1. **Main CEA sheet**: Detailed calculations with country-specific columns
2. **Simple CEA sheet**: Simplified view with key inputs/outputs
3. **Inputs sheet**: All input parameters
4. **Supporting sheets**: Coverage models, mortality data, sensitivity analysis

Countries in current spreadsheet:
- Chad (Column I)
- DRC (Column J)
- Guinea (Column K)
- Nigeria - GF states (Column L)
- Nigeria - PMI states (Column M)
- South Sudan (Column N)
- Togo (Column O)
- Uganda (Column P)

### 3. Current Spreadsheet Values (from Simple CEA sheet)

#### Chad
```
Grant Size: $1,000,000
Cost per U5 Reached: $15.19
People U5 Reached: 65,838
Years Effective Coverage: 1.97
Malaria Mortality Rate: 0.1508%
ITN Effect on Deaths: 24.02%
Deaths Averted U5: 46.89
Cost per U5 Death Averted: $21,329
Initial x Benchmark: 1.64
Adj: Older Mortalities: 29.70%
Adj: Developmental: 60.89%
Adj: Program Benefits: 52.90%
Adj: Grantee: -4.00%
Adj: Leverage: -0.83%
Adj: Funging: -3.02%
FINAL x Benchmark: 4.82
FINAL Cost per Life Saved: $15,639
```

#### DRC
```
Grant Size: $1,000,000
Cost per U5 Reached: $26.24
People U5 Reached: 38,112
Years Effective Coverage: 1.19
Malaria Mortality Rate: 0.7983%
ITN Effect on Deaths: 55.83%
Deaths Averted U5: 203
Cost per U5 Death Averted: $4,937
Initial x Benchmark: 7.07
Adj: Older Mortalities: 14.95%
Adj: Developmental: 49.16%
Adj: Program Benefits: 47.90%
Adj: Grantee: -4.00%
Adj: Leverage: -0.41%
Adj: Funging: -14.62%
FINAL x Benchmark: 14.63
FINAL Cost per Life Saved: $5,101
```

## Recommendations

### 1. Update countries.ts Parameters (HIGH PRIORITY)

The hardcoded parameters in `src/lib/models/countries.ts` should be updated to match the current GiveWell spreadsheet values. This affects:

- `AMF_COUNTRY_PARAMS` - All 8 countries
- Potentially `MC_COUNTRY_PARAMS`, `HK_COUNTRY_PARAMS`, `NI_COUNTRY_PARAMS`, `GD_COUNTRY_PARAMS` (not yet verified)

### 2. Create Automated Extraction Script

To prevent future discrepancies, create a Python script that:
1. Reads GiveWell's Excel spreadsheets
2. Extracts all parameters for each country
3. Generates the TypeScript `countries.ts` file automatically
4. Can be run whenever GiveWell updates their models

### 3. Add Version Tracking

Add metadata to `countries.ts` indicating:
- Date of GiveWell spreadsheet
- Version/link to the specific spreadsheet used
- Last update date

Example:
```typescript
/**
 * GiveWell CEA Parameters
 *
 * Source: GiveWell's November 2025 CEA models
 * Last updated: 2025-12-22
 * Spreadsheet version: [specific version/date]
 */
```

### 4. Verification for Other Charities

Similar verification should be performed for:
- ❓ Malaria Consortium (malaria_consortium.xlsx)
- ❓ Helen Keller International (helen_keller.xlsx)
- ❓ New Incentives (new_incentives.xlsx)
- ❓ GiveDirectly (givedirectly.xlsx)
- ❓ Deworming programs (deworming.xlsx)

## Test Coverage

### AMF Tests ✅
- ✅ People reached calculation (4/4 countries tested)
- ✅ Deaths averted calculation (4/4 countries tested)
- ✅ Cost per death averted (4/4 countries tested)
- ✅ Initial cost-effectiveness (4/4 countries tested)
- ✅ Final cost-effectiveness (4/4 countries tested)
- ✅ Final cost per life saved (4/4 countries tested)

Total: **24/24 tests passing**

### Coverage Assessment
- Chad: ✅ Full coverage
- DRC: ✅ Full coverage
- Guinea: ✅ Full coverage
- Nigeria (PMI): ✅ Full coverage
- Nigeria (GF): ⚠️ Not tested (but parameters available)
- South Sudan: ⚠️ Not tested (but parameters available)
- Togo: ⚠️ Not tested (but parameters available)
- Uganda: ⚠️ Not tested (but parameters available)

## Methodology Notes

### How GiveWell Calculates Cost-Effectiveness

The tool correctly implements GiveWell's 7-step calculation:

1. **People Reached** = Grant Size / Cost per Under-5 Reached
2. **Deaths Averted** = People × Years Coverage × Mortality Rate × ITN Effect
3. **Cost per Death** = Grant Size / Deaths Averted
4. **Initial CE** = (Deaths × Moral Weight) / (Grant × Benchmark Value)
5. **Add Mortality 5+** = Initial CE × (1 + Older Adjustment)
6. **Add Development** = Previous × (1 + Developmental Adjustment)
7. **Apply Adjustments** = Previous × (1 + Program) × (1 + Grantee) × (1 + Leverage + Funging)

**Verification**: ✅ All calculations match GiveWell's spreadsheet outputs exactly

### Benchmark Value

GiveWell's benchmark: **0.00333 UoV per $1**

This represents the value of $1 given as unconditional cash transfers. All charity cost-effectiveness is expressed as multiples of this benchmark.

**Example**: AMF in Guinea is **22.79x benchmark**, meaning $1 to AMF in Guinea generates 22.79 times more value than $1 given directly as cash.

## Files Generated

1. `verify_cea_full.py` - Extracts all values from GiveWell spreadsheets
2. `verification_report.json` - Machine-readable comparison data
3. `explore_amf.py`, `explore_amf2.py` - Spreadsheet exploration scripts
4. `compare_amf_values.py` - Parameter comparison script
5. `VERIFICATION_REPORT.md` - This human-readable report

## Conclusion

✅ **The tool's CEA calculation logic is CORRECT and matches GiveWell's methodology perfectly.**

❌ **The hardcoded country parameters in `countries.ts` are OUTDATED and need updating.**

The discrepancies found are not in the calculation logic, but in the input parameters that were extracted from an older version of GiveWell's spreadsheets. Updating `countries.ts` with current values will ensure the tool produces accurate results that match GiveWell's current recommendations.

---

**Verified by**: CEA Verification Script
**Date**: December 22, 2025
**GiveWell Spreadsheet**: Against Malaria Foundation (November 2025)
**Test Results**: 24/24 passing ✅
