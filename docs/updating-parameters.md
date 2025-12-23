# Updating GiveWell CEA Parameters

This guide explains how to update the tool's parameters when GiveWell releases new CEA models.

## When to Update

Update parameters when:
- GiveWell publishes updated CEA spreadsheets
- You notice discrepancies between tool outputs and GiveWell's website
- GiveWell announces methodology changes

GiveWell typically updates their models:
- Annually (major updates)
- Quarterly (parameter adjustments)
- Ad-hoc (when new evidence emerges)

## Current Status

**Last Verified**: December 22, 2025
**Spreadsheet Version**: November 2025
**Status**: ⚠️ countries.ts parameters are outdated

## Update Process

### 1. Download Latest Spreadsheets

Download from [GiveWell's website](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models):

```bash
mkdir -p data/givewell-spreadsheets
cd data/givewell-spreadsheets

# Download the latest Excel files for each charity
# - amf.xlsx
# - malaria_consortium.xlsx
# - helen_keller.xlsx
# - new_incentives.xlsx
# - givedirectly.xlsx
# - deworming.xlsx
```

### 2. Extract Parameters

Run the extraction script to generate updated parameters:

```bash
python3 scripts/extract_givewell_parameters.py
```

This will:
1. Read all Excel spreadsheets
2. Extract country-specific parameters
3. Generate an updated `countries.ts` file
4. Show a diff of changes

### 3. Review Changes

Check the generated diff:

```bash
git diff src/lib/models/countries.ts
```

Review for:
- Significant parameter changes (>10%)
- New countries added/removed
- Changes in adjustment factors
- Moral weight updates

### 4. Update Tests

If parameters changed significantly, update test expected values:

```bash
# Run tests to see failures
bun test

# Update test files with new expected values
# Files: src/lib/models/*.test.ts
```

### 5. Verify Calculations

Run the verification script to ensure accuracy:

```bash
python3 verify_cea_full.py
```

This compares tool outputs with spreadsheet values.

### 6. Update Version Info

In `src/lib/models/countries.ts`, update the header comment:

```typescript
/**
 * Country-Level Data for GiveWell CEA Models
 *
 * Data extracted from GiveWell's CEA spreadsheets (MONTH YEAR).
 * Source: https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models
 *
 * Last Updated: YYYY-MM-DD
 * Spreadsheet Version: [version if available]
 */
```

### 7. Commit Changes

```bash
git add src/lib/models/countries.ts
git add src/lib/models/*.test.ts  # if tests updated
git commit -m "Update GiveWell CEA parameters (MONTH YEAR)"
```

## Manual Extraction (if script unavailable)

If the automated extraction script doesn't work:

### For AMF

1. Open `data/givewell-spreadsheets/amf.xlsx`
2. Go to "Simple CEA" sheet
3. For each country (columns I, J, K, etc.):
   - Row 10: `costPerUnder5Reached`
   - Row 12: `yearsEffectiveCoverage`
   - Row 13: `malariaMortalityRate`
   - Row 14: `itnEffectOnDeaths`
   - Row 19: `moralWeightUnder5`
   - Row 23: `adjustmentOlderMortalities`
   - Row 24: `adjustmentDevelopmental`
   - Row 32: `adjustmentProgramBenefits`
   - Row 33: `adjustmentGrantee`
   - Row 34: `adjustmentLeverage`
   - Row 35: `adjustmentFunging`

4. For `adjustmentLeverageFungingForCostPerLife`:
   - Check Main CEA sheet for combined leverage/funging adjustment

### For Other Charities

Similar process - each spreadsheet has a "Simple CEA" or equivalent sheet with parameters.

## Verification Checklist

After updating parameters:

- [ ] All tests pass (`bun test`)
- [ ] Verification script shows matches (`python3 verify_cea_full.py`)
- [ ] Key metrics match GiveWell's website
- [ ] Version info updated in code comments
- [ ] Changes documented in commit message
- [ ] No unintended parameter changes

## Common Issues

### Issue: Spreadsheet structure changed

**Solution**: Update extraction logic in `scripts/extract_givewell_parameters.py`

### Issue: New countries added

**Solution**:
1. Add to country constants (e.g., `AMF_COUNTRIES`)
2. Add to country names mapping
3. Add parameters to country params object
4. Add utility function call

### Issue: Tests failing after update

**Solution**:
1. Check if methodology changed
2. Update expected values in test files
3. Verify calculation logic still matches GiveWell's

### Issue: Large parameter changes

**Solution**:
1. Double-check extraction
2. Verify against multiple sources
3. Check GiveWell's changelog for methodology updates
4. Consider creating a comparison report

## Resources

- [GiveWell CEA Models](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models)
- [GiveWell's Changelog](https://www.givewell.org/research/our-research-process/changelog)
- Tool verification scripts: `verify_cea_full.py`, `compare_amf_values.py`
- This tool's test suite: `src/lib/models/*.test.ts`

## Questions?

If you encounter issues:
1. Check VERIFICATION_REPORT.md for known discrepancies
2. Review GiveWell's methodology documentation
3. Compare manually with GiveWell's online calculators
4. Create an issue documenting the problem
