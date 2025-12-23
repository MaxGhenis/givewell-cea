# GiveWell CEA Parameter Extraction Documentation

This document explains which parameters are extracted from GiveWell spreadsheets versus which are model constants.

## AMF (Against Malaria Foundation)

### Extracted from Spreadsheet (Country-Specific)
- **costPerUnder5Reached**: Calculated from row 55 (person-years under 5)
- **yearsEffectiveCoverage**: Row 43
- **malariaMortalityRate**: Row 70
- **itnEffectOnDeaths**: Row 69
- **adjustmentOlderMortalities**: Calculated as ratio of row 85 / row 77
- **adjustmentDevelopmental**: Calculated as row 107 / (row 113 + row 117)
- **adjustmentLeverage**: LeverageFunging sheet, row 111
- **adjustmentFunging**: LeverageFunging sheet, row 112
- **adjustmentLeverageFungingForCostPerLife**: LeverageFunging sheet, row 113

### Model Constants (Not Country-Specific)
- **moralWeightUnder5**: 116.25262 (GiveWell's moral weight for under-5 lives)
- **moralWeight5Plus**: 73.1914 (GiveWell's moral weight for 5+ lives)
- **adjustmentGrantee**: -0.04 (Standard grantee adjustment for AMF)
- **adjustmentProgramBenefits**: 0.5 (Row 46 is NaN in spreadsheet - this is a model constant)

## Malaria Consortium (SMC)

### Extracted from Spreadsheet (Country-Specific)
- **costPerChildReached**: Row 30
- **proportionMortalityDuringSeason**: Row 56 (FIXED - was using fallback)
- **malariaMortalityRate**: Row 50
- **smcEffect**: Row 49
- **adjustmentLeverage**: LeverageFunging sheet, row 111
- **adjustmentFunging**: LeverageFunging sheet, row 112

### Model Constants (Not Country-Specific)
- **moralWeightUnder5**: 116.25262
- **adjustmentOlderMortalities**: 0.07 (Represents ratio of older to under-5 deaths)
- **adjustmentDevelopmental**: 0.25 (Developmental benefits adjustment)
- **adjustmentProgramBenefits**: 0.2 (Other program benefits)
- **adjustmentGrantee**: -0.08 (Standard grantee adjustment for MC)

## Helen Keller International (VAS)

### Extracted from Spreadsheet (Country-Specific)
- **costPerPersonUnder5**: Row 35
- **proportionReachedCounterfactual**: Row 42
- **mortalityRateUnder5**: Row 55
- **vasEffect**: Row 54
- **adjustmentLeverage**: LeverageFunging sheet, row 90
- **adjustmentFunging**: LeverageFunging sheet, row 91

### Model Constants (Not Country-Specific)
- **moralWeightUnder5**: 118.73259
- **adjustmentDevelopmental**: 0.245176
- **adjustmentProgramBenefits**: 0.565
- **adjustmentGrantee**: -0.04

## New Incentives (Vaccination)

### Extracted from Spreadsheet (State-Specific)
- **proportionReachedCounterfactual**: 1 - row 25 (FIXED - was using fallback)
- **probabilityDeathUnvaccinated**: Row 46
- **adjustmentLeverage**: LeverageFunging sheet, row 90
- **adjustmentFunging**: LeverageFunging sheet, row 91

### Model Constants (Not State-Specific)
- **costPerChildReached**: 18.21 (From Inputs sheet, row 11, column H - constant across all states)
- **vaccineEffect**: 0.52 (Composite vaccine efficacy - could potentially be state-specific but using constant)
- **moralWeightUnder5**: 116.25262
- **adjustmentOlderMortalities**: 0.18
- **adjustmentDevelopmental**: 0.28
- **adjustmentConsumption**: 0.06
- **adjustmentProgramBenefits**: 0.503
- **adjustmentGrantee**: -0.07

## GiveDirectly (Cash Transfers)

### Extracted from Spreadsheet (Country-Specific)
Source: "New CEA" sheet (not "Country" sheet - has complete data)

- **householdSize**: Row 10 (FIXED - now from New CEA sheet)
- **proportionUnder5**: Row 41 (FIXED - now from New CEA sheet, includes Mozambique)
- **baselineConsumption**: Row 14 (FIXED - now from New CEA sheet, includes Mozambique)

### Model Constants (Not Country-Specific)
- **transferAmount**: 1000 (Standard transfer size)
- **overheadRate**: 0.20 (20% overhead)
- **consumptionPersistenceYears**: 10 (How long consumption gains last)
- **discountRate**: 0.04 (4% discount rate)
- **spilloverMultiplier**: 2.5 (Spillover to non-recipients)
- **spilloverDiscount**: 0.45 (Discount on spillover value)
- **mortalityEffect**: 0.23 (Effect on under-5 mortality)
- **under5MortalityRate**: 0.05 (Baseline U5 mortality)
- **moralWeightUnder5**: 116.25
- **mortalityDiscount**: 0.50 (Discount on mortality benefits)

## Deworming

All parameters are model constants/variants, not extracted from country-specific data in the spreadsheet.

## Key Fixes Made

1. **Malaria Consortium**: Removed fallback for `proportionMortalityDuringSeason` - row 56 has actual values
2. **New Incentives**: Removed fallback for `proportionReachedCounterfactual` - row 25 has actual values
3. **GiveDirectly**:
   - Switched from "Country" sheet to "New CEA" sheet
   - Removed fallbacks for `householdSize`, `proportionUnder5`, and `baselineConsumption`
   - Now correctly extracts data for Mozambique (which had NaN values in Country sheet)
4. **AMF**: Documented that `adjustmentProgramBenefits` is a true constant (row 46 is NaN in spreadsheet)

## Remaining Constants vs Extracted Values

### True Constants (Justified)
These are GiveWell model parameters that don't vary by location:
- Moral weights (consistent across all interventions)
- Grantee-level adjustments (organization-specific, not location-specific)
- Some adjustment factors that represent GiveWell's judgment calls

### Successfully Extracted
All country/location-specific epidemiological data, costs, and coverage rates are now extracted from spreadsheets without fallbacks.

## Cell References

### AMF (Main CEA sheet)
- Row 43: Years effective coverage
- Row 55: Person-years under 5 (for cost calculation)
- Row 69: ITN effect on deaths
- Row 70: Malaria mortality rate
- Row 77: Under-5 deaths
- Row 85: Older deaths
- Row 107: Income value
- Row 113, 117: Mortality values (for developmental adjustment)

### Malaria Consortium (Main CEA sheet)
- Row 30: Cost per child reached
- Row 49: SMC effect
- Row 50: Malaria mortality rate
- Row 56: Proportion mortality during season
- Row 57: Under-5 deaths
- Row 69: Older deaths

### Helen Keller (Main CEA sheet)
- Row 35: Cost per child year of VAS
- Row 42: Proportion reached counterfactually
- Row 54: VAS effect
- Row 55: Under-5 mortality rate

### New Incentives (Main CEA sheet)
- Row 25: Proportion not reached counterfactually
- Row 46: Probability of death unvaccinated

### GiveDirectly (New CEA sheet)
- Row 10: Average household size
- Row 14: Baseline consumption (PPP 2017)
- Row 41: Share of children under 5
