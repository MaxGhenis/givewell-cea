/**
 * Parameter Summary Component
 *
 * Shows a clear summary of the most important parameters for each charity
 * Displays them in an easy-to-scan format with highlights for key values
 */

import type { CharityInputs } from "../lib/models";

interface ParameterSummaryProps {
  charityInputs: CharityInputs;
  charityName: string;
}

// Define key parameters for each charity type
const KEY_PARAMETERS: Record<string, Array<{ key: string; label: string; format: "currency" | "percent" | "decimal" | "number" }>> = {
  amf: [
    { key: "costPerUnder5Reached", label: "Cost per child reached", format: "currency" },
    { key: "malariaMortalityRate", label: "Malaria mortality rate", format: "percent" },
    { key: "itnEffectOnDeaths", label: "Net effect on deaths", format: "percent" },
    { key: "yearsEffectiveCoverage", label: "Years of coverage", format: "decimal" },
  ],
  "malaria-consortium": [
    { key: "costPerChildReached", label: "Cost per child reached", format: "currency" },
    { key: "malariaMortalityRate", label: "Malaria mortality rate", format: "percent" },
    { key: "smcEffect", label: "SMC effect", format: "percent" },
    { key: "proportionMortalityDuringSeason", label: "Mortality during season", format: "percent" },
  ],
  "helen-keller": [
    { key: "costPerPersonUnder5", label: "Cost per person", format: "currency" },
    { key: "mortalityRateUnder5", label: "Under-5 mortality rate", format: "percent" },
    { key: "vasEffect", label: "VAS effect", format: "percent" },
    { key: "proportionReachedCounterfactual", label: "Counterfactual coverage", format: "percent" },
  ],
  "new-incentives": [
    { key: "costPerChildReached", label: "Cost per child reached", format: "currency" },
    { key: "probabilityDeathUnvaccinated", label: "Death probability (unvaccinated)", format: "percent" },
    { key: "vaccineEffect", label: "Vaccine effect", format: "percent" },
    { key: "proportionReachedCounterfactual", label: "Counterfactual coverage", format: "percent" },
  ],
  givedirectly: [
    { key: "transferAmount", label: "Transfer amount", format: "currency" },
    { key: "baselineConsumption", label: "Baseline consumption", format: "currency" },
    { key: "overheadRate", label: "Overhead rate", format: "percent" },
    { key: "consumptionPersistenceYears", label: "Benefit duration (years)", format: "number" },
  ],
  deworming: [
    { key: "costPerChildTreated", label: "Cost per child treated", format: "currency" },
    { key: "incomeEffect", label: "Income effect", format: "percent" },
    { key: "infectionPrevalence", label: "Infection prevalence", format: "percent" },
    { key: "benefitDurationYears", label: "Benefit duration (years)", format: "number" },
  ],
};

function formatValue(value: number, format: "currency" | "percent" | "decimal" | "number"): string {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percent":
      return `${(value * 100).toFixed(2)}%`;
    case "decimal":
      return value.toFixed(2);
    case "number":
      return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}

export function ParameterSummary({ charityInputs, charityName }: ParameterSummaryProps) {
  const keyParams = KEY_PARAMETERS[charityInputs.type] || [];
  const inputs = charityInputs.inputs as any;

  return (
    <div className="parameter-summary">
      <h4>Key Parameters</h4>
      <div className="key-params-grid">
        {keyParams.map((param) => {
          const value = inputs[param.key];
          if (value === undefined) return null;

          return (
            <div key={param.key} className="key-param-card">
              <span className="key-param-label">{param.label}</span>
              <span className="key-param-value">{formatValue(value, param.format)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
