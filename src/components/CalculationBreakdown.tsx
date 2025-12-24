/**
 * Calculation Breakdown Components
 *
 * Visualizes the step-by-step calculations for each charity's
 * cost-effectiveness analysis with inline editable values.
 */

import { useMemo, useState, useRef, useEffect } from "react";
import type { AMFInputs } from "../lib/models/amf";
import type { MalariaConsortiumInputs } from "../lib/models/malaria-consortium";
import type { HelenKellerInputs } from "../lib/models/helen-keller";
import type { NewIncentivesInputs } from "../lib/models/new-incentives";
import type { GiveDirectlyInputs } from "../lib/models/givedirectly";
import type { DewormingInputs } from "../lib/models/deworming";
import type { CharityInputs, UnifiedResults } from "../lib/models";

// Static value component - for displaying values that can't be edited inline (like grant size)
function StaticValue({ value, label }: { value: number; label: string }) {
  const displayValue = value >= 1000000
    ? `$${(value / 1000000).toFixed(1)}M`
    : `$${value.toLocaleString()}`;

  return (
    <span className="static-value" title={label}>
      <span className="value-display static">{displayValue}</span>
      <span className="value-label">{label}</span>
    </span>
  );
}

// Editable value component - click to edit inline
interface EditableValueProps {
  value: number;
  onChange: (value: number) => void;
  format: "currency" | "percent" | "decimal" | "number" | "currencySmall";
  min?: number;
  max?: number;
  step?: number;
  label: string;  // Required label shown below the value
  source?: { text: string; url?: string };
}

function EditableValue({ value, onChange, format, min, max, step = 0.01, label, source }: EditableValueProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = () => {
    switch (format) {
      case "currency":
        return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${value.toLocaleString()}`;
      case "currencySmall":
        return `$${value.toFixed(2)}`;
      case "percent":
        return `${(value * 100).toFixed(2)}%`;
      case "decimal":
        return value.toFixed(3);
      case "number":
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
  };

  const handleClick = () => {
    let editValue: string;
    switch (format) {
      case "percent":
        editValue = (value * 100).toFixed(2);
        break;
      case "currency":
        editValue = value.toFixed(0);
        break;
      case "currencySmall":
        editValue = value.toFixed(2);
        break;
      case "decimal":
        editValue = value.toFixed(3);
        break;
      case "number":
        editValue = value.toFixed(0);
        break;
      default:
        editValue = value.toString();
    }
    setInputValue(editValue);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    let newValue = parseFloat(inputValue);
    if (!isNaN(newValue)) {
      if (format === "percent") newValue = newValue / 100;
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);
      onChange(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const inputStep = format === "percent" ? (step || 0.01) * 100 : step;

  return (
    <span className="editable-value-wrapper" title={source?.text || label}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          className="editable-value-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          step={inputStep}
        />
      ) : (
        <span className="editable-display" onClick={handleClick}>{displayValue()}</span>
      )}
      <span className="value-label">
        {source?.url ? (
          <a href={source.url} target="_blank" rel="noopener noreferrer">{label}</a>
        ) : (
          label
        )}
      </span>
    </span>
  );
}

// Read-only computed value
function ComputedValue({ value, format }: { value: number; format: "currency" | "number" | "decimal" }) {
  const display = () => {
    switch (format) {
      case "currency":
        return value >= 1000000 ? `$${(value / 1000000).toFixed(2)}M`
          : value >= 1000 ? `$${(value / 1000).toFixed(1)}K`
          : `$${value.toFixed(0)}`;
      case "number":
        return value >= 1000000 ? `${(value / 1000000).toFixed(2)}M`
          : value >= 1000 ? `${(value / 1000).toFixed(1)}K`
          : value.toFixed(1);
      case "decimal":
        return value.toFixed(2);
    }
  };
  return <span className="computed-value">{display()}</span>;
}

// Result value (highlighted)
function ResultValue({ value, unit }: { value: number; unit: string }) {
  const display = value >= 100 ? value.toFixed(1) : value >= 1 ? value.toFixed(2) : value.toFixed(3);
  return <span className="result-value">{display}{unit}</span>;
}

interface SourceLinkProps {
  text: string;
  url?: string;
}

function SourceLink({ text, url }: SourceLinkProps) {
  return (
    <div className="source-link-row">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}

// AMF Calculation Breakdown
function AMFBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: AMFInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof AMFInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const peopleReached = inputs.grantSize / inputs.costPerUnder5Reached;
    const deathsAverted = peopleReached * inputs.yearsEffectiveCoverage *
      inputs.malariaMortalityRate * inputs.itnEffectOnDeaths;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    const ceWithOlder = initialCE * (1 + inputs.adjustmentOlderMortalities);
    const ceWithDev = ceWithOlder * (1 + inputs.adjustmentDevelopmental);
    return { peopleReached, deathsAverted, valueGenerated, benchmarkValue, initialCE, ceWithOlder, ceWithDev };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Children Reached</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ "}
              <EditableValue
                value={inputs.costPerUnder5Reached}
                onChange={(v) => onInputChange("costPerUnder5Reached", v)}
                format="currencySmall"
                min={1}
                max={50}
                label="Cost per net"
                source={{ text: "Cost per insecticide-treated net (ITN) delivered to a child under 5, including manufacturing, shipping, and distribution costs. Varies by country.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" = "}
              <ComputedValue value={intermediates.peopleReached} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Deaths Averted (Under 5)</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.peopleReached} format="number" />
              {" × "}
              <EditableValue
                value={inputs.yearsEffectiveCoverage}
                onChange={(v) => onInputChange("yearsEffectiveCoverage", v)}
                format="decimal"
                min={0.5}
                max={5}
                label="Coverage yrs"
                source={{ text: "Average years of effective protection per ITN. Nets degrade over time; this accounts for physical wear and insecticide decay.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" × "}
              <EditableValue
                value={inputs.malariaMortalityRate}
                onChange={(v) => onInputChange("malariaMortalityRate", v)}
                format="percent"
                min={0.0001}
                max={0.01}
                label="Mortality rate"
                source={{ text: "Annual probability of death from malaria for children under 5 in program areas. Based on WHO and IHME data. Varies significantly by country/region.", url: "https://www.who.int/teams/global-malaria-programme/reports/world-malaria-report-2023" }}
              />
              {" × "}
              <EditableValue
                value={inputs.itnEffectOnDeaths}
                onChange={(v) => onInputChange("itnEffectOnDeaths", v)}
                format="percent"
                min={0.05}
                max={0.8}
                label="ITN effect"
                source={{ text: "Relative reduction in all-cause child mortality from sleeping under an ITN. Lengeler 2004 Cochrane Review found ~17-24% reduction in child mortality in endemic areas.", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000363.pub2/full" }}
              />
              {" = "}
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Value Generated</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
              {" × "}
              <EditableValue
                value={inputs.moralWeightUnder5}
                onChange={(v) => onInputChange("moralWeightUnder5", v)}
                format="number"
                min={50}
                max={200}
                label="Moral weight"
                source={{ text: "Units of Value (UoV) per under-5 death averted. Based on ~52 expected life-years saved. GiveWell's moral weights tool allows customization.", url: "https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw" }}
              />
              {" UoV = "}
              <ComputedValue value={intermediates.valueGenerated} format="number" />
              {" UoV"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Initial Cost-Effectiveness</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.valueGenerated} format="number" />
              {" ÷ "}
              <ComputedValue value={intermediates.benchmarkValue} format="number" />
              {" = "}
              <ComputedValue value={intermediates.initialCE} format="decimal" />
              {"× benchmark"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">5</div>
          <div className="step-content">
            <div className="step-title">Adjustments</div>
            <div className="step-formula adjustments-list">
              <div>
                × (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={1} label="5+ deaths" source={{ text: "Additional benefit from deaths averted in ages 5+. ITNs also protect older household members who share sleeping spaces.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) older mortalities
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={1} label="Dev. benefits" source={{ text: "Long-term developmental benefits from reduced malaria morbidity: improved cognition, school attendance, and future income.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) developmental
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={-0.5} max={1} label="Program" source={{ text: "Other program benefits: health system strengthening, community health worker training, surveillance improvements.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) program benefits
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.5} max={0.5} label="Leverage" source={{ text: "Government/donor co-funding attracted by GiveWell's funding (positive = GiveWell funding unlocks additional resources).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.5} max={0} label="Funging" source={{ text: "Reduction for displacing funding that would have come from other sources (e.g., if government would have funded these nets anyway).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) leverage & funging
              </div>
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell November 2025 CEA Spreadsheet" url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" />
      </div>
    </div>
  );
}

// Malaria Consortium Breakdown
function MCBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: MalariaConsortiumInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof MalariaConsortiumInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const childrenReached = inputs.grantSize / inputs.costPerChildReached;
    const deathsAverted = childrenReached * inputs.malariaMortalityRate *
      inputs.proportionMortalityDuringSeason * inputs.smcEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { childrenReached, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Children Reached</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ "}
              <EditableValue
                value={inputs.costPerChildReached}
                onChange={(v) => onInputChange("costPerChildReached", v)}
                format="currencySmall"
                min={1}
                max={20}
                label="Cost per cycle"
                source={{ text: "Cost per child per SMC cycle: 3-4 monthly doses of sulfadoxine-pyrimethamine + amodiaquine (SP+AQ) administered during peak malaria transmission season.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" = "}
              <ComputedValue value={intermediates.childrenReached} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Deaths Averted</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.childrenReached} format="number" />
              {" × "}
              <EditableValue
                value={inputs.malariaMortalityRate}
                onChange={(v) => onInputChange("malariaMortalityRate", v)}
                format="percent"
                min={0.001}
                max={0.02}
                label="Mortality rate"
                source={{ text: "Annual probability of death from malaria for children under 5 in program areas. Based on WHO/IHME burden estimates for Sahel region.", url: "https://www.who.int/teams/global-malaria-programme/reports/world-malaria-report-2023" }}
              />
              {" × "}
              <EditableValue
                value={inputs.proportionMortalityDuringSeason}
                onChange={(v) => onInputChange("proportionMortalityDuringSeason", v)}
                format="percent"
                min={0.3}
                max={1}
                label="In season"
                source={{ text: "Proportion of annual malaria deaths occurring during SMC delivery period (typically July-October rainy season when transmission peaks).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" × "}
              <EditableValue
                value={inputs.smcEffect}
                onChange={(v) => onInputChange("smcEffect", v)}
                format="percent"
                min={0.3}
                max={1}
                label="SMC effect"
                source={{ text: "Protective efficacy of SMC against malaria mortality. Meremikwu 2012 Cochrane review found ~75% reduction in clinical malaria episodes; mortality effect estimated at ~70-80%.", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006657.pub2/full" }}
              />
              {" = "}
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Value & Initial CE</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
              {" × "}
              <EditableValue
                value={inputs.moralWeightUnder5}
                onChange={(v) => onInputChange("moralWeightUnder5", v)}
                format="number"
                min={50}
                max={200}
                label="Moral weight"
                source={{ text: "Units of Value (UoV) per under-5 death averted. Based on ~52 expected life-years saved.", url: "https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw" }}
              />
              {" ÷ benchmark = "}
              <ComputedValue value={intermediates.initialCE} format="decimal" />
              {"×"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Adjustments</div>
            <div className="step-formula adjustments-list">
              <div>× (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={0.5} label="5+ deaths" source={{ text: "Additional benefit from deaths averted in ages 5+. SMC primarily targets children under 5, but may have some effect on older siblings.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) older mortalities</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.8} label="Dev. benefits" source={{ text: "Long-term developmental benefits from reduced malaria morbidity: fewer fevers, less anemia, improved cognitive development.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={0.5} label="Program" source={{ text: "Other program benefits: health system strengthening, community health worker capacity, disease surveillance.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.1} max={0.1} label="Leverage" source={{ text: "Government/donor co-funding attracted by GiveWell funding.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.5} max={0} label="Funging" source={{ text: "Reduction for displacing funding that would have come from other sources (e.g., Global Fund, national governments).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) leverage & funging</div>
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell November 2025 CEA Spreadsheet" url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" />
      </div>
    </div>
  );
}

// Helen Keller Breakdown
function HKBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: HelenKellerInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof HelenKellerInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const peopleReached = inputs.grantSize / inputs.costPerPersonUnder5;
    const incrementalReached = peopleReached * (1 - inputs.proportionReachedCounterfactual);
    const deathsAverted = incrementalReached * inputs.mortalityRateUnder5 * inputs.vasEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { peopleReached, incrementalReached, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Children Reached</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ "}
              <EditableValue value={inputs.costPerPersonUnder5} onChange={(v) => onInputChange("costPerPersonUnder5", v)} format="currencySmall" min={0.5} max={10} label="Cost per dose" source={{ text: "Cost to deliver one high-dose Vitamin A supplement (200,000 IU capsule) to a child under 5, including distribution costs", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />
              {" = "}
              <ComputedValue value={intermediates.peopleReached} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Incremental (Counterfactual-Adjusted)</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.peopleReached} format="number" />
              {" × (1 − "}
              <EditableValue value={inputs.proportionReachedCounterfactual} onChange={(v) => onInputChange("proportionReachedCounterfactual", v)} format="percent" min={0} max={0.8} label="Counterfactual" source={{ text: "Proportion of children who would have received Vitamin A supplementation anyway from government or other programs", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />
              {") = "}
              <ComputedValue value={intermediates.incrementalReached} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Deaths Averted</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.incrementalReached} format="number" />
              {" × "}
              <EditableValue value={inputs.mortalityRateUnder5} onChange={(v) => onInputChange("mortalityRateUnder5", v)} format="percent" min={0.001} max={0.02} label="Mortality rate" source={{ text: "Annual probability of death for children under 5 in program areas (varies by country)", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />
              {" × "}
              <EditableValue value={inputs.vasEffect} onChange={(v) => onInputChange("vasEffect", v)} format="percent" min={0.02} max={0.2} label="VAS effect" source={{ text: "Relative reduction in all-cause mortality from Vitamin A supplementation. Meta-analysis of 17 RCTs found 12-24% reduction.", url: "https://www.bmj.com/content/357/bmj.j2340" }} />
              {" = "}
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Value & Initial CE</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
              {" × "}
              <EditableValue value={inputs.moralWeightUnder5} onChange={(v) => onInputChange("moralWeightUnder5", v)} format="number" min={50} max={200} label="Moral weight" source={{ text: "Units of Value per under-5 death averted. Based on ~52 DALYs saved per death averted.", url: "https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw" }} />
              {" ÷ benchmark = "}
              <ComputedValue value={intermediates.initialCE} format="decimal" />
              {"×"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">5</div>
          <div className="step-content">
            <div className="step-title">Adjustments</div>
            <div className="step-formula adjustments-list">
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.5} label="Dev. benefits" source={{ text: "Long-term developmental benefits (improved vision, immune function) beyond mortality reduction", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={1} label="Program" source={{ text: "Other program benefits (health system strengthening, training)", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentGrantee} onChange={(v) => onInputChange("adjustmentGrantee", v)} format="percent" min={-0.3} max={0.1} label="Grantee" source={{ text: "Adjustment for HKI-specific factors (track record, monitoring quality)", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) grantee</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.2} max={0.1} label="Leverage" source={{ text: "Government/other funder contributions attracted by GiveWell funding", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.6} max={0} label="Funging" source={{ text: "Reduction for displacing funding that would have come from other sources", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) leverage & funging</div>
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell November 2025 CEA Spreadsheet" url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" />
      </div>
    </div>
  );
}

// New Incentives Breakdown
function NIBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: NewIncentivesInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof NewIncentivesInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const childrenReached = inputs.grantSize / inputs.costPerChildReached;
    const incrementalVaccinated = childrenReached * (1 - inputs.proportionReachedCounterfactual);
    const deathsAverted = incrementalVaccinated * inputs.probabilityDeathUnvaccinated * inputs.vaccineEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { childrenReached, incrementalVaccinated, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Children Reached</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ "}
              <EditableValue
                value={inputs.costPerChildReached}
                onChange={(v) => onInputChange("costPerChildReached", v)}
                format="currencySmall"
                min={5}
                max={50}
                label="Cost per child"
                source={{ text: "Cost per child reached with conditional cash incentives for completing vaccination schedule. Includes cash transfers (~$22 per child), program delivery, and monitoring costs.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" = "}
              <ComputedValue value={intermediates.childrenReached} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Incremental Vaccinations</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.childrenReached} format="number" />
              {" × (1 − "}
              <EditableValue
                value={inputs.proportionReachedCounterfactual}
                onChange={(v) => onInputChange("proportionReachedCounterfactual", v)}
                format="percent"
                min={0.5}
                max={0.95}
                label="Counterfactual"
                source={{ text: "Proportion of children who would have been vaccinated anyway without the cash incentive. Based on baseline vaccination rates in program areas (~18% for full schedule).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {") = "}
              <ComputedValue value={intermediates.incrementalVaccinated} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Deaths Averted</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.incrementalVaccinated} format="number" />
              {" × "}
              <EditableValue
                value={inputs.probabilityDeathUnvaccinated}
                onChange={(v) => onInputChange("probabilityDeathUnvaccinated", v)}
                format="percent"
                min={0.01}
                max={0.1}
                label="Death prob."
                source={{ text: "Probability of death from vaccine-preventable diseases for unvaccinated children in program areas (Nigeria). Covers measles, polio, diphtheria, tetanus, pertussis, Hep B.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
              />
              {" × "}
              <EditableValue
                value={inputs.vaccineEffect}
                onChange={(v) => onInputChange("vaccineEffect", v)}
                format="percent"
                min={0.3}
                max={0.8}
                label="Vaccine effect"
                source={{ text: "Weighted average vaccine efficacy across the vaccine schedule. Individual vaccines range from 80-99% efficacy; this is the mortality-weighted average.", url: "https://www.who.int/immunization/documents/positionpapers/en/" }}
              />
              {" = "}
              <ComputedValue value={intermediates.deathsAverted} format="decimal" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Adjustments</div>
            <div className="step-formula adjustments-list">
              <div>× (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={0.4} label="5+ deaths" source={{ text: "Additional benefit from deaths averted in ages 5+. Vaccination protection often extends beyond age 5 (e.g., measles immunity).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) older mortalities</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.5} label="Dev. benefits" source={{ text: "Long-term developmental benefits from reduced morbidity: fewer sick days, better nutrition absorption, improved cognitive outcomes.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentConsumption} onChange={(v) => onInputChange("adjustmentConsumption", v)} format="percent" min={0} max={0.2} label="Consumption" source={{ text: "Direct benefit from cash transfers to households: increased consumption and poverty reduction.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) consumption</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={1} label="Program" source={{ text: "Other program benefits: health facility strengthening, vaccine supply chain improvements, community awareness.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.2} max={0.1} label="Leverage" source={{ text: "Government co-funding and program expansion attracted by GiveWell funding.", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.2} max={0} label="Funging" source={{ text: "Reduction for displacing funding that would have come from other sources (e.g., Gavi, Nigerian government).", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }} />) leverage & funging</div>
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell November 2025 CEA Spreadsheet" url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" />
      </div>
    </div>
  );
}

// GiveDirectly Breakdown
function GDBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: GiveDirectlyInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof GiveDirectlyInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const costPerHH = inputs.transferAmount * (1 + inputs.overheadRate);
    const households = inputs.grantSize / costPerHH;
    const people = households * inputs.householdSize;
    const annualIncrease = inputs.transferAmount / inputs.consumptionPersistenceYears;
    const utilityGain = Math.log((inputs.baselineConsumption + annualIncrease) / inputs.baselineConsumption);
    const consumptionValue = utilityGain * inputs.householdSize * inputs.consumptionPersistenceYears * households;
    const spilloverValue = consumptionValue * (inputs.spilloverMultiplier - 1) * (1 - inputs.spilloverDiscount);
    const under5Pop = people * inputs.proportionUnder5;
    const deathsAverted = under5Pop * inputs.under5MortalityRate * inputs.mortalityEffect * (1 - inputs.mortalityDiscount);
    const mortalityValue = deathsAverted * inputs.moralWeightUnder5;
    const totalValue = consumptionValue + spilloverValue + mortalityValue;
    return { costPerHH, households, people, consumptionValue, spilloverValue, deathsAverted, mortalityValue, totalValue };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Households Reached</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ ("}
              <EditableValue
                value={inputs.transferAmount}
                onChange={(v) => onInputChange("transferAmount", v)}
                format="currency"
                min={500}
                max={2000}
                step={50}
                label="Transfer amt"
                source={{ text: "Cash transfer per household. GiveDirectly typically transfers $1,000-1,500 as a lump sum or in installments.", url: "https://www.givedirectly.org/research-on-cash-transfers/" }}
              />
              {" × (1 + "}
              <EditableValue
                value={inputs.overheadRate}
                onChange={(v) => onInputChange("overheadRate", v)}
                format="percent"
                min={0.1}
                max={0.4}
                label="Overhead"
                source={{ text: "GiveDirectly's operating costs as a percentage of transfers. Includes targeting, enrollment, mobile money fees, and monitoring.", url: "https://www.givedirectly.org/operating-model/" }}
              />
              {")) = "}
              <ComputedValue value={intermediates.households} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Consumption Value (log utility)</div>
            <div className="step-formula">
              ln((
              <EditableValue
                value={inputs.baselineConsumption}
                onChange={(v) => onInputChange("baselineConsumption", v)}
                format="currency"
                min={300}
                max={1000}
                step={10}
                label="Baseline $"
                source={{ text: "Annual per-capita consumption before transfer (PPP-adjusted USD). Varies by country: Kenya ~$652, Rwanda ~$600, Liberia ~$450.", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }}
              />
              {" + transfer ÷ "}
              <EditableValue
                value={inputs.consumptionPersistenceYears}
                onChange={(v) => onInputChange("consumptionPersistenceYears", v)}
                format="number"
                min={1}
                max={20}
                label="Persist. yrs"
                source={{ text: "Years over which consumption benefits persist. GiveWell assumes ~10 years based on long-term follow-up studies showing sustained effects.", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }}
              />
              {" yrs) / baseline) × HH × yrs = "}
              <ComputedValue value={intermediates.consumptionValue} format="number" />
              {" UoV"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Spillover Value</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.consumptionValue} format="number" />
              {" × ("}
              <EditableValue
                value={inputs.spilloverMultiplier}
                onChange={(v) => onInputChange("spilloverMultiplier", v)}
                format="decimal"
                min={1}
                max={4}
                step={0.1}
                label="Spillover mult"
                source={{ text: "General equilibrium multiplier: Egger et al. 2022 found ~$2.60 in local economy benefits per $1 transferred. Captures effects on non-recipients through increased local spending.", url: "https://www.nber.org/papers/w26600" }}
              />
              {" − 1) × (1 − "}
              <EditableValue
                value={inputs.spilloverDiscount}
                onChange={(v) => onInputChange("spilloverDiscount", v)}
                format="percent"
                min={0}
                max={0.8}
                label="Discount"
                source={{ text: "GiveWell's discount for uncertainty in spillover estimates. Applied because Egger study may not generalize to all GiveDirectly contexts.", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }}
              />
              {") = "}
              <ComputedValue value={intermediates.spilloverValue} format="number" />
              {" UoV"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Mortality Value</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.people} format="number" />
              {" people × "}
              <EditableValue
                value={inputs.proportionUnder5}
                onChange={(v) => onInputChange("proportionUnder5", v)}
                format="percent"
                min={0.05}
                max={0.3}
                label="% under 5"
                source={{ text: "Proportion of household members who are children under 5. Based on demographic data for program countries.", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }}
              />
              {" u5 × "}
              <EditableValue
                value={inputs.under5MortalityRate}
                onChange={(v) => onInputChange("under5MortalityRate", v)}
                format="percent"
                min={0.01}
                max={0.1}
                label="U5 mort. rate"
                source={{ text: "Under-5 mortality rate in program areas. Varies significantly by country: Kenya ~4%, DRC ~8%, Rwanda ~3%.", url: "https://data.worldbank.org/indicator/SH.DYN.MORT" }}
              />
              {" × "}
              <EditableValue
                value={inputs.mortalityEffect}
                onChange={(v) => onInputChange("mortalityEffect", v)}
                format="percent"
                min={0}
                max={0.5}
                label="Cash effect"
                source={{ text: "Effect of cash transfers on child mortality. Banerjee et al. 2023 found 46% reduction; GiveWell applies 50% discount for uncertainty, yielding ~23%.", url: "https://www.pnas.org/doi/10.1073/pnas.2215588120" }}
              />
              {" × (1 − "}
              <EditableValue
                value={inputs.mortalityDiscount}
                onChange={(v) => onInputChange("mortalityDiscount", v)}
                format="percent"
                min={0}
                max={0.8}
                label="Discount"
                source={{ text: "Additional discount for uncertainty in mortality effect estimates. Reflects concerns about external validity and publication bias.", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }}
              />
              {") × "}
              <EditableValue
                value={inputs.moralWeightUnder5}
                onChange={(v) => onInputChange("moralWeightUnder5", v)}
                format="number"
                min={50}
                max={200}
                label="Moral weight"
                source={{ text: "Units of Value (UoV) per under-5 death averted. Based on ~52 expected life-years saved.", url: "https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw" }}
              />
              {" = "}
              <ComputedValue value={intermediates.mortalityValue} format="number" />
              {" UoV"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <div className="step-formula">
              (<ComputedValue value={intermediates.consumptionValue} format="number" /> + <ComputedValue value={intermediates.spilloverValue} format="number" /> + <ComputedValue value={intermediates.mortalityValue} format="number" />) ÷ (grant × benchmark)
            </div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell November 2024 Cash Transfer Re-evaluation" url="https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" />
      </div>
    </div>
  );
}

// Deworming Breakdown
function DWBreakdown({
  inputs,
  results,
  onInputChange
}: {
  inputs: DewormingInputs;
  results: UnifiedResults;
  onInputChange: (key: keyof DewormingInputs, value: number) => void;
}) {
  const intermediates = useMemo(() => {
    const childrenTreated = inputs.grantSize / (inputs.costPerChildTreated * inputs.roundsPerYear);
    const childrenBenefiting = childrenTreated * inputs.infectionPrevalence;
    const yearsUntilBenefits = inputs.ageIncomeBenefitsBegin - inputs.averageAgeAtTreatment;
    const annualGain = inputs.baselineIncome * inputs.incomeEffect * inputs.wormBurdenAdjustment *
      inputs.programAdjustment * inputs.evidenceAdjustment;

    let pvPerChild = 0;
    for (let y = 0; y < inputs.benefitDurationYears; y++) {
      const decay = Math.pow(1 - inputs.benefitDecayRate, y);
      const discount = Math.pow(1 + inputs.discountRate, -(yearsUntilBenefits + y));
      pvPerChild += annualGain * decay * discount;
    }

    const logUtility = Math.log(1 + pvPerChild / inputs.baselineIncome);
    const totalValue = logUtility * childrenBenefiting;

    return { childrenTreated, childrenBenefiting, annualGain, pvPerChild, totalValue };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <div className="calc-flow">
        <div className="calc-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <div className="step-title">Children Treated</div>
            <div className="step-formula">
              <StaticValue value={inputs.grantSize} label="Grant size (set at top)" />
              {" ÷ "}
              <EditableValue
                value={inputs.costPerChildTreated}
                onChange={(v) => onInputChange("costPerChildTreated", v)}
                format="currencySmall"
                min={0.2}
                max={2}
                step={0.05}
                label="Cost per dose"
                source={{ text: "Cost per child per treatment round. Includes albendazole/mebendazole tablets (~$0.02), distribution, training, and monitoring. Extremely low cost due to donated drugs and school-based delivery.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" = "}
              <ComputedValue value={intermediates.childrenTreated} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <div className="step-title">Children Benefiting (infected)</div>
            <div className="step-formula">
              <ComputedValue value={intermediates.childrenTreated} format="number" />
              {" × "}
              <EditableValue
                value={inputs.infectionPrevalence}
                onChange={(v) => onInputChange("infectionPrevalence", v)}
                format="percent"
                min={0.1}
                max={0.8}
                label="Prevalence"
                source={{ text: "Proportion of children with soil-transmitted helminth (STH) or schistosomiasis infections. Varies widely by location: 20-80% in endemic areas. Only infected children benefit from treatment.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" = "}
              <ComputedValue value={intermediates.childrenBenefiting} format="number" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <div className="step-title">Annual Income Gain (adjusted)</div>
            <div className="step-formula">
              <EditableValue
                value={inputs.baselineIncome}
                onChange={(v) => onInputChange("baselineIncome", v)}
                format="currency"
                min={400}
                max={1500}
                step={50}
                label="Baseline $"
                source={{ text: "Annual per-capita income in adulthood (PPP-adjusted USD). Benefits accrue decades after treatment when children enter workforce.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" × "}
              <EditableValue
                value={inputs.incomeEffect}
                onChange={(v) => onInputChange("incomeEffect", v)}
                format="percent"
                min={0.05}
                max={0.25}
                label="Income effect"
                source={{ text: "Long-term income effect from childhood deworming. Miguel & Kremer 2004 20-year follow-up found ~13% increase in labor earnings. One of the most debated estimates in development economics.", url: "https://www.pnas.org/doi/10.1073/pnas.2023185118" }}
              />
              {" × "}
              <EditableValue
                value={inputs.wormBurdenAdjustment}
                onChange={(v) => onInputChange("wormBurdenAdjustment", v)}
                format="percent"
                min={0.1}
                max={1}
                label="Worm burden"
                source={{ text: "Adjustment for worm burden intensity. Original Kenya study had very high intensity; current programs may have lower baseline infection severity.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" × "}
              <EditableValue
                value={inputs.programAdjustment}
                onChange={(v) => onInputChange("programAdjustment", v)}
                format="percent"
                min={0.3}
                max={1}
                label="Program adj"
                source={{ text: "Adjustment for program delivery quality differences between original study (researcher-administered) and current large-scale government programs.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" × "}
              <EditableValue
                value={inputs.evidenceAdjustment}
                onChange={(v) => onInputChange("evidenceAdjustment", v)}
                format="percent"
                min={0.2}
                max={1}
                label="Evidence adj"
                source={{ text: "GiveWell's discount for uncertainty in evidence base. Deworming evidence is controversial: Cochrane reviews found limited short-term effects, but long-term income effects are from single study cluster.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" = "}
              <ComputedValue value={intermediates.annualGain} format="currency" />
              {"/yr"}
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">4</div>
          <div className="step-content">
            <div className="step-title">Present Value per Child</div>
            <div className="step-formula">
              Sum over{" "}
              <EditableValue
                value={inputs.benefitDurationYears}
                onChange={(v) => onInputChange("benefitDurationYears", v)}
                format="number"
                min={10}
                max={50}
                step={5}
                label="Years"
                source={{ text: "Working years over which income benefits persist. Assumes benefits last from age 18 until retirement (~40 years of working life).", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {" years, discounted at "}
              <EditableValue
                value={inputs.discountRate}
                onChange={(v) => onInputChange("discountRate", v)}
                format="percent"
                min={0.01}
                max={0.1}
                label="Discount rate"
                source={{ text: "Discount rate for future benefits. GiveWell uses 4% real discount rate. Benefits are discounted from treatment age (~8) through working years.", url: "https://www.givewell.org/international/technical/programs/deworming" }}
              />
              {", decay "}
              <EditableValue
                value={inputs.benefitDecayRate}
                onChange={(v) => onInputChange("benefitDecayRate", v)}
                format="percent"
                min={0}
                max={0.2}
                label="Decay rate"
                source={{ text: "Annual decay in income benefits. Happier Lives Institute argues for ~12% annual decay; GiveWell assumes 0%. Higher decay significantly reduces cost-effectiveness.", url: "https://www.happierlivesinstitute.org/report/deworming/" }}
              />
              {" = "}
              <ComputedValue value={intermediates.pvPerChild} format="currency" />
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card">
          <div className="step-number">5</div>
          <div className="step-content">
            <div className="step-title">Total Value (log utility)</div>
            <div className="step-formula">
              ln(1 + <ComputedValue value={intermediates.pvPerChild} format="currency" /> / baseline) × <ComputedValue value={intermediates.childrenBenefiting} format="number" /> = <ComputedValue value={intermediates.totalValue} format="number" /> UoV
            </div>
          </div>
        </div>

        <div className="calc-arrow">↓</div>

        <div className="calc-step-card result-card">
          <div className="step-content">
            <div className="step-title">Final Cost-Effectiveness</div>
            <ResultValue value={results.finalXBenchmark} unit="× benchmark" />
          </div>
        </div>
      </div>

      <div className="sources-footer">
        <SourceLink text="GiveWell Deworming Analysis" url="https://www.givewell.org/international/technical/programs/deworming" />
      </div>
    </div>
  );
}

// Main component
interface CalculationBreakdownProps {
  charityInputs: CharityInputs;
  results: UnifiedResults;
  onInputChange: (charityInputs: CharityInputs) => void;
}

export function CalculationBreakdown({ charityInputs, results, onInputChange }: CalculationBreakdownProps) {
  switch (charityInputs.type) {
    case "amf":
      return <AMFBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "amf", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
    case "malaria-consortium":
      return <MCBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "malaria-consortium", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
    case "helen-keller":
      return <HKBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "helen-keller", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
    case "new-incentives":
      return <NIBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "new-incentives", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
    case "givedirectly":
      return <GDBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "givedirectly", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
    case "deworming":
      return <DWBreakdown
        inputs={charityInputs.inputs}
        results={results}
        onInputChange={(key, value) => onInputChange({ type: "deworming", inputs: { ...charityInputs.inputs, [key]: value } })}
      />;
  }
}
