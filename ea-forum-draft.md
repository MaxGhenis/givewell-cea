# Interactive GiveWell Cost-Effectiveness Calculator

I built an open-source, interactive version of GiveWell's cost-effectiveness analysis (CEA) for their top charities: https://maxghenis.github.io/givewell-cea/

## What it does

The calculator replicates GiveWell's November 2024-2025 CEA methodology for six charity programs:
- Against Malaria Foundation (AMF)
- Malaria Consortium (seasonal malaria chemoprevention)
- Helen Keller International (Vitamin A supplementation)
- New Incentives (conditional cash transfers for vaccination)
- GiveDirectly (unconditional cash transfers)
- Deworming programs

For each charity, you can:
- **See cost-effectiveness across all locales** - The tool shows the full range, not just one number. AMF's effectiveness varies from ~12x to ~156x GiveWell's benchmark depending on country.
- **Click any locale** to see detailed metrics (cost per death averted, deaths averted, people reached)
- **Edit calculation parameters** to see how different assumptions affect results
- **Set a custom grant size** to model different funding scenarios

## Why I built this

GiveWell publishes extraordinarily detailed spreadsheets, but they're hard to explore interactively. I wanted to:

1. **Make the range visible** - There's no single "cost-effectiveness of AMF." It varies significantly by country and assumptions. The tool makes this immediately clear.

2. **Enable parameter exploration** - What if mortality reduction from nets is 10% lower? What if we weight child deaths differently? You can adjust and see instantly.

3. **Provide a validated open-source implementation** - The codebase has 175 tests validating calculations against GiveWell's published figures.

## Technical details

- Built with React/TypeScript, runs entirely in the browser
- Each charity model follows GiveWell's exact methodology with country-specific parameters
- Cost-effectiveness expressed as multiples of GiveWell's benchmark (unconditional cash transfers)
- Source code: https://github.com/MaxGhenis/givewell-cea

## Caveats

- **Not affiliated with GiveWell** - This is an independent implementation
- **Parameters may drift** - GiveWell updates their models; I'll try to keep up but may lag
- **Simplified in places** - Some edge cases in GiveWell's spreadsheets aren't replicated
- **Not investment advice** - This is for educational exploration, not definitive funding decisions

## Feedback welcome

I'd appreciate feedback on:
- Bugs or discrepancies with GiveWell's numbers
- UX improvements
- Additional features that would be useful

The tool is open source and contributions are welcome.

---

*Disclosure: I have no affiliation with any of the charities or with GiveWell. I donate to GiveWell's top charities.*
