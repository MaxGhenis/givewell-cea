# GiveWell CEA Calculator: An Open-Source Web Tool for Cost-Effectiveness Analysis

I'm excited to share an open-source web tool that replicates GiveWell's cost-effectiveness analysis (CEA) for their top 4 recommended charities.

**Live tool**: [maxghenis.github.io/givewell-cea-tool](https://maxghenis.github.io/givewell-cea-tool)

**Source code**: [github.com/MaxGhenis/givewell-cea-tool](https://github.com/MaxGhenis/givewell-cea-tool)

## What This Tool Does

The GiveWell CEA Calculator allows you to:

1. **Compare cost-effectiveness** across GiveWell's top 4 charities:
   - Against Malaria Foundation (insecticide-treated bed nets)
   - Malaria Consortium (seasonal malaria chemoprevention)
   - Helen Keller International (vitamin A supplementation)
   - New Incentives (vaccination incentives)

2. **View key metrics** for each charity:
   - Cost-effectiveness as multiples of cash transfers
   - Cost per death averted
   - Deaths averted per $1M grant
   - People/children reached

3. **Understand the calculation flow**:
   - Initial cost-effectiveness from mortality benefits
   - Adjustment factors (older mortalities, developmental, leverage/funging)
   - Final cost-effectiveness after all adjustments

## Technical Details

### Validated Against GiveWell's Spreadsheets

All calculations are validated against GiveWell's November 2025 cost-effectiveness analysis spreadsheets using test-driven development (TDD). The test suite includes:

- 24 tests for Against Malaria Foundation
- 15 tests for Malaria Consortium
- 18 tests for Helen Keller International
- 18 tests for New Incentives

Each test case uses actual values from GiveWell's published spreadsheets across multiple regions (Chad, DRC, Nigeria, Guinea, Burkina Faso, etc.).

### Key Findings During Development

1. **Different benchmark values**: GiveWell uses slightly different benchmark values across spreadsheets (0.00333 for AMF/New Incentives vs 0.003355 for Malaria Consortium/Helen Keller). This likely reflects different update cycles.

2. **Unique calculation models**: Each charity has a distinct calculation methodology:
   - AMF: Years of effective coverage × mortality rate × ITN effect
   - Malaria Consortium: Proportion of mortality during SMC season × SMC effect
   - Helen Keller: Counterfactual adjustment for existing VAS coverage
   - New Incentives: Counterfactual adjustment for baseline vaccination rates

3. **Adjustment factors vary significantly**: The ratio of final to initial cost-effectiveness ranges from ~0.9× (Malaria Consortium in Burkina Faso due to high funging) to ~2.9× (AMF in Chad with high developmental benefits).

### Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom editorial design
- **Testing**: Vitest with 75+ passing tests
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## Roadmap

Future features I'm considering:

1. **Interactive parameter editing**: Allow users to adjust inputs and see real-time recalculation
2. **Moral weights customization**: Let users apply their own moral weights for different age groups
3. **Uncertainty analysis**: Monte Carlo simulation to show confidence intervals
4. **Historical comparison**: Compare cost-effectiveness across GiveWell's analysis versions

## Contributions Welcome

This is an open-source project and contributions are welcome:
- Report issues or suggest features on [GitHub](https://github.com/MaxGhenis/givewell-cea-tool/issues)
- Submit pull requests for improvements
- Help validate calculations against additional spreadsheet versions

## Acknowledgments

- GiveWell for publishing their cost-effectiveness analyses openly
- The EA community for inspiring transparent, evidence-based giving

---

*Note: This is an independent project for educational purposes. For official cost-effectiveness estimates, please refer to [GiveWell's published analyses](https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models).*
