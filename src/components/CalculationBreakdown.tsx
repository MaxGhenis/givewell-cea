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

// Editable value component - click to edit inline
interface EditableValueProps {
  value: number;
  onChange: (value: number) => void;
  format: "currency" | "percent" | "decimal" | "number" | "currencySmall";
  min?: number;
  max?: number;
  step?: number;
  source?: { text: string; url?: string };
}

function EditableValue({ value, onChange, format, min, max, step = 0.01, source }: EditableValueProps) {
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
    const editValue = format === "percent" ? (value * 100).toFixed(2) : value.toString();
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

  // Get a short label from the source text (first few words or abbreviation)
  const getShortLabel = (text: string) => {
    // Return first ~20 chars or first 3 words
    const words = text.split(" ");
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(" ") + "…";
  };

  return (
    <span className="editable-value-wrapper">
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
        <span className="editable-display" onClick={handleClick} title="Click to edit">{displayValue()}</span>
      )}
      {source && (
        <span className="param-label" title={source.text}>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {getShortLabel(source.text)}
            </a>
          ) : (
            getShortLabel(source.text)
          )}
        </span>
      )}
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ "}
              <EditableValue
                value={inputs.costPerUnder5Reached}
                onChange={(v) => onInputChange("costPerUnder5Reached", v)}
                format="currencySmall"
                min={1}
                max={50}
                source={{ text: "GiveWell Nov 2025 CEA", url: "https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" }}
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
                source={{ text: "Years of effective ITN coverage" }}
              />
              {" × "}
              <EditableValue
                value={inputs.malariaMortalityRate}
                onChange={(v) => onInputChange("malariaMortalityRate", v)}
                format="percent"
                min={0.0001}
                max={0.01}
                source={{ text: "Malaria-attributable mortality rate (WHO)" }}
              />
              {" × "}
              <EditableValue
                value={inputs.itnEffectOnDeaths}
                onChange={(v) => onInputChange("itnEffectOnDeaths", v)}
                format="percent"
                min={0.05}
                max={0.8}
                source={{ text: "Lengeler 2004 Cochrane Review", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000363.pub2/full" }}
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
                source={{ text: "GiveWell Moral Weights", url: "https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw" }}
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
                × (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={1} source={{ text: "5+ mortality benefits" }} />) older mortalities
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={1} source={{ text: "Long-term developmental benefits" }} />) developmental
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={-0.5} max={1} />) program benefits
              </div>
              <div>
                × (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.5} max={0.5} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.5} max={0} />) leverage & funging
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ "}
              <EditableValue value={inputs.costPerChildReached} onChange={(v) => onInputChange("costPerChildReached", v)} format="currencySmall" min={1} max={20} source={{ text: "GiveWell Nov 2025 CEA" }} />
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
              <EditableValue value={inputs.malariaMortalityRate} onChange={(v) => onInputChange("malariaMortalityRate", v)} format="percent" min={0.001} max={0.02} source={{ text: "Malaria mortality rate" }} />
              {" × "}
              <EditableValue value={inputs.proportionMortalityDuringSeason} onChange={(v) => onInputChange("proportionMortalityDuringSeason", v)} format="percent" min={0.3} max={1} source={{ text: "Proportion during SMC season" }} />
              {" × "}
              <EditableValue value={inputs.smcEffect} onChange={(v) => onInputChange("smcEffect", v)} format="percent" min={0.3} max={1} source={{ text: "Meremikwu 2012 Cochrane", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006657.pub2/full" }} />
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
              <EditableValue value={inputs.moralWeightUnder5} onChange={(v) => onInputChange("moralWeightUnder5", v)} format="number" min={50} max={200} />
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
              <div>× (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={0.5} />) older mortalities</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.8} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={0.5} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.1} max={0.1} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.5} max={0} />) leverage & funging</div>
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ "}
              <EditableValue value={inputs.costPerPersonUnder5} onChange={(v) => onInputChange("costPerPersonUnder5", v)} format="currencySmall" min={0.5} max={10} source={{ text: "GiveWell Nov 2025 CEA" }} />
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
              <EditableValue value={inputs.proportionReachedCounterfactual} onChange={(v) => onInputChange("proportionReachedCounterfactual", v)} format="percent" min={0} max={0.8} source={{ text: "Would have received VAS anyway" }} />
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
              <EditableValue value={inputs.mortalityRateUnder5} onChange={(v) => onInputChange("mortalityRateUnder5", v)} format="percent" min={0.001} max={0.02} source={{ text: "Under-5 mortality rate" }} />
              {" × "}
              <EditableValue value={inputs.vasEffect} onChange={(v) => onInputChange("vasEffect", v)} format="percent" min={0.02} max={0.2} source={{ text: "Imdad 2017 BMJ", url: "https://www.bmj.com/content/357/bmj.j2340" }} />
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
              <EditableValue value={inputs.moralWeightUnder5} onChange={(v) => onInputChange("moralWeightUnder5", v)} format="number" min={50} max={200} />
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
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.5} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={1} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentGrantee} onChange={(v) => onInputChange("adjustmentGrantee", v)} format="percent" min={-0.3} max={0.1} />) grantee</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.2} max={0.1} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.6} max={0} />) leverage & funging</div>
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ "}
              <EditableValue value={inputs.costPerChildReached} onChange={(v) => onInputChange("costPerChildReached", v)} format="currencySmall" min={5} max={50} source={{ text: "GiveWell Nov 2025 CEA" }} />
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
              <EditableValue value={inputs.proportionReachedCounterfactual} onChange={(v) => onInputChange("proportionReachedCounterfactual", v)} format="percent" min={0.5} max={0.95} source={{ text: "Would have been vaccinated anyway" }} />
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
              <EditableValue value={inputs.probabilityDeathUnvaccinated} onChange={(v) => onInputChange("probabilityDeathUnvaccinated", v)} format="percent" min={0.01} max={0.1} source={{ text: "Death probability if unvaccinated" }} />
              {" × "}
              <EditableValue value={inputs.vaccineEffect} onChange={(v) => onInputChange("vaccineEffect", v)} format="percent" min={0.3} max={0.8} source={{ text: "Vaccine efficacy (WHO)" }} />
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
              <div>× (1 + <EditableValue value={inputs.adjustmentOlderMortalities} onChange={(v) => onInputChange("adjustmentOlderMortalities", v)} format="percent" min={0} max={0.4} />) older mortalities</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentDevelopmental} onChange={(v) => onInputChange("adjustmentDevelopmental", v)} format="percent" min={0} max={0.5} />) developmental</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentConsumption} onChange={(v) => onInputChange("adjustmentConsumption", v)} format="percent" min={0} max={0.2} />) consumption</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentProgramBenefits} onChange={(v) => onInputChange("adjustmentProgramBenefits", v)} format="percent" min={0} max={1} />) program</div>
              <div>× (1 + <EditableValue value={inputs.adjustmentLeverage} onChange={(v) => onInputChange("adjustmentLeverage", v)} format="percent" min={-0.2} max={0.1} /> + <EditableValue value={inputs.adjustmentFunging} onChange={(v) => onInputChange("adjustmentFunging", v)} format="percent" min={-0.2} max={0} />) leverage & funging</div>
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ ("}
              <EditableValue value={inputs.transferAmount} onChange={(v) => onInputChange("transferAmount", v)} format="currency" min={500} max={2000} step={50} source={{ text: "Transfer per household" }} />
              {" × (1 + "}
              <EditableValue value={inputs.overheadRate} onChange={(v) => onInputChange("overheadRate", v)} format="percent" min={0.1} max={0.4} source={{ text: "GiveDirectly overhead" }} />
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
              <EditableValue value={inputs.baselineConsumption} onChange={(v) => onInputChange("baselineConsumption", v)} format="currency" min={300} max={1000} step={10} source={{ text: "Baseline consumption (PPP)", url: "https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/" }} />
              {" + transfer ÷ "}
              <EditableValue value={inputs.consumptionPersistenceYears} onChange={(v) => onInputChange("consumptionPersistenceYears", v)} format="number" min={1} max={20} />
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
              <EditableValue value={inputs.spilloverMultiplier} onChange={(v) => onInputChange("spilloverMultiplier", v)} format="decimal" min={1} max={4} step={0.1} source={{ text: "Egger 2022 GE effects", url: "https://www.nber.org/papers/w26600" }} />
              {" − 1) × (1 − "}
              <EditableValue value={inputs.spilloverDiscount} onChange={(v) => onInputChange("spilloverDiscount", v)} format="percent" min={0} max={0.8} source={{ text: "GiveWell uncertainty discount" }} />
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
              <EditableValue value={inputs.proportionUnder5} onChange={(v) => onInputChange("proportionUnder5", v)} format="percent" min={0.05} max={0.3} />
              {" u5 × "}
              <EditableValue value={inputs.under5MortalityRate} onChange={(v) => onInputChange("under5MortalityRate", v)} format="percent" min={0.01} max={0.1} />
              {" × "}
              <EditableValue value={inputs.mortalityEffect} onChange={(v) => onInputChange("mortalityEffect", v)} format="percent" min={0} max={0.5} source={{ text: "Banerjee 2023 (46% finding × 50% discount)", url: "https://www.pnas.org/doi/10.1073/pnas.2215588120" }} />
              {" × (1 − "}
              <EditableValue value={inputs.mortalityDiscount} onChange={(v) => onInputChange("mortalityDiscount", v)} format="percent" min={0} max={0.8} />
              {") × "}
              <EditableValue value={inputs.moralWeightUnder5} onChange={(v) => onInputChange("moralWeightUnder5", v)} format="number" min={50} max={200} />
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
              <EditableValue value={inputs.grantSize} onChange={(v) => onInputChange("grantSize", v)} format="currency" min={100000} max={100000000} step={100000} />
              {" ÷ "}
              <EditableValue value={inputs.costPerChildTreated} onChange={(v) => onInputChange("costPerChildTreated", v)} format="currencySmall" min={0.2} max={2} step={0.05} source={{ text: "Cost per treatment round" }} />
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
              <EditableValue value={inputs.infectionPrevalence} onChange={(v) => onInputChange("infectionPrevalence", v)} format="percent" min={0.1} max={0.8} source={{ text: "Worm infection prevalence" }} />
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
              <EditableValue value={inputs.baselineIncome} onChange={(v) => onInputChange("baselineIncome", v)} format="currency" min={400} max={1500} step={50} source={{ text: "Baseline income (PPP)" }} />
              {" × "}
              <EditableValue value={inputs.incomeEffect} onChange={(v) => onInputChange("incomeEffect", v)} format="percent" min={0.05} max={0.25} source={{ text: "Miguel & Kremer long-term effect", url: "https://www.pnas.org/doi/10.1073/pnas.2023185118" }} />
              {" × "}
              <EditableValue value={inputs.wormBurdenAdjustment} onChange={(v) => onInputChange("wormBurdenAdjustment", v)} format="percent" min={0.1} max={1} source={{ text: "Worm burden vs study population" }} />
              {" × "}
              <EditableValue value={inputs.programAdjustment} onChange={(v) => onInputChange("programAdjustment", v)} format="percent" min={0.3} max={1} />
              {" × "}
              <EditableValue value={inputs.evidenceAdjustment} onChange={(v) => onInputChange("evidenceAdjustment", v)} format="percent" min={0.2} max={1} source={{ text: "GiveWell replicability discount" }} />
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
              <EditableValue value={inputs.benefitDurationYears} onChange={(v) => onInputChange("benefitDurationYears", v)} format="number" min={10} max={50} step={5} />
              {" years, discounted at "}
              <EditableValue value={inputs.discountRate} onChange={(v) => onInputChange("discountRate", v)} format="percent" min={0.01} max={0.1} />
              {", decay "}
              <EditableValue value={inputs.benefitDecayRate} onChange={(v) => onInputChange("benefitDecayRate", v)} format="percent" min={0} max={0.2} source={{ text: "Benefit decay (HLI critique: 12%)" }} />
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
