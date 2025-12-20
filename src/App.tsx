import { useState, useMemo, useCallback } from "react";
import {
  CHARITY_CONFIGS,
  calculateCharity,
  getDefaultInputs,
  applyMoralWeights,
  type CharityInputs,
  type CharityType,
  type UnifiedResults,
  type MoralWeights,
  DEFAULT_AMF_INPUTS,
  DEFAULT_MC_INPUTS,
  DEFAULT_HK_INPUTS,
  DEFAULT_NI_INPUTS,
  DEFAULT_MORAL_WEIGHTS,
  MORAL_WEIGHT_PRESETS,
} from "./lib/models";
import type { AMFInputs } from "./lib/models/amf";
import type { MalariaConsortiumInputs } from "./lib/models/malaria-consortium";
import type { HelenKellerInputs } from "./lib/models/helen-keller";
import type { NewIncentivesInputs } from "./lib/models/new-incentives";
import "./App.css";

function formatNumber(n: number, decimals = 1): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

function formatCurrency(n: number): string {
  return `$${formatNumber(n, 0)}`;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: "currency" | "percent" | "decimal" | "number";
}

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: InputFieldProps) {
  const displayValue = () => {
    switch (format) {
      case "currency":
        return value >= 1000 ? `$${formatNumber(value, 0)}` : `$${value.toFixed(2)}`;
      case "percent":
        return `${(value * 100).toFixed(2)}%`;
      case "decimal":
        return value.toFixed(3);
      case "number":
        return value.toFixed(0);
    }
  };

  return (
    <div className="input-field">
      <label>{label}</label>
      <div className="input-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <span className="input-value">{displayValue()}</span>
      </div>
    </div>
  );
}

// Parameter configurations for each charity type
function AMFParams({ inputs, onChange }: { inputs: AMFInputs; onChange: (key: keyof AMFInputs, value: number) => void }) {
  return (
    <>
      <div className="params-section">
        <h4>Program Parameters</h4>
        <div className="param-grid">
          <InputField
            label="Grant size"
            value={inputs.grantSize}
            onChange={(v) => onChange("grantSize", v)}
            min={100000}
            max={10000000}
            step={100000}
            format="currency"
          />
          <InputField
            label="Cost per child reached"
            value={inputs.costPerUnder5Reached}
            onChange={(v) => onChange("costPerUnder5Reached", v)}
            min={1}
            max={50}
            step={0.5}
            format="currency"
          />
          <InputField
            label="Years of coverage"
            value={inputs.yearsEffectiveCoverage}
            onChange={(v) => onChange("yearsEffectiveCoverage", v)}
            min={0.5}
            max={5}
            step={0.1}
            format="decimal"
          />
          <InputField
            label="Malaria mortality rate"
            value={inputs.malariaMortalityRate}
            onChange={(v) => onChange("malariaMortalityRate", v)}
            min={0.0001}
            max={0.01}
            step={0.0001}
            format="percent"
          />
          <InputField
            label="ITN effect on deaths"
            value={inputs.itnEffectOnDeaths}
            onChange={(v) => onChange("itnEffectOnDeaths", v)}
            min={0.05}
            max={0.8}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
      <div className="params-section">
        <h4>Adjustment Factors</h4>
        <div className="param-grid">
          <InputField
            label="Older mortalities adj."
            value={inputs.adjustmentOlderMortalities}
            onChange={(v) => onChange("adjustmentOlderMortalities", v)}
            min={0}
            max={1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Developmental adj."
            value={inputs.adjustmentDevelopmental}
            onChange={(v) => onChange("adjustmentDevelopmental", v)}
            min={0}
            max={1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Program benefits adj."
            value={inputs.adjustmentProgramBenefits}
            onChange={(v) => onChange("adjustmentProgramBenefits", v)}
            min={-0.5}
            max={1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Leverage adj."
            value={inputs.adjustmentLeverage}
            onChange={(v) => onChange("adjustmentLeverage", v)}
            min={-0.5}
            max={0.5}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Funging adj."
            value={inputs.adjustmentFunging}
            onChange={(v) => onChange("adjustmentFunging", v)}
            min={-0.5}
            max={0}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
    </>
  );
}

function MCParams({ inputs, onChange }: { inputs: MalariaConsortiumInputs; onChange: (key: keyof MalariaConsortiumInputs, value: number) => void }) {
  return (
    <>
      <div className="params-section">
        <h4>Program Parameters</h4>
        <div className="param-grid">
          <InputField
            label="Grant size"
            value={inputs.grantSize}
            onChange={(v) => onChange("grantSize", v)}
            min={100000}
            max={10000000}
            step={100000}
            format="currency"
          />
          <InputField
            label="Cost per child reached"
            value={inputs.costPerChildReached}
            onChange={(v) => onChange("costPerChildReached", v)}
            min={1}
            max={20}
            step={0.5}
            format="currency"
          />
          <InputField
            label="Malaria mortality rate"
            value={inputs.malariaMortalityRate}
            onChange={(v) => onChange("malariaMortalityRate", v)}
            min={0.001}
            max={0.02}
            step={0.0005}
            format="percent"
          />
          <InputField
            label="Mortality during season"
            value={inputs.proportionMortalityDuringSeason}
            onChange={(v) => onChange("proportionMortalityDuringSeason", v)}
            min={0.3}
            max={1}
            step={0.05}
            format="percent"
          />
          <InputField
            label="SMC effect on deaths"
            value={inputs.smcEffect}
            onChange={(v) => onChange("smcEffect", v)}
            min={0.3}
            max={1}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
      <div className="params-section">
        <h4>Adjustment Factors</h4>
        <div className="param-grid">
          <InputField
            label="Older mortalities adj."
            value={inputs.adjustmentOlderMortalities}
            onChange={(v) => onChange("adjustmentOlderMortalities", v)}
            min={0}
            max={0.5}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Developmental adj."
            value={inputs.adjustmentDevelopmental}
            onChange={(v) => onChange("adjustmentDevelopmental", v)}
            min={0}
            max={0.8}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Program benefits adj."
            value={inputs.adjustmentProgramBenefits}
            onChange={(v) => onChange("adjustmentProgramBenefits", v)}
            min={0}
            max={0.5}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Leverage adj."
            value={inputs.adjustmentLeverage}
            onChange={(v) => onChange("adjustmentLeverage", v)}
            min={-0.1}
            max={0.1}
            step={0.005}
            format="percent"
          />
          <InputField
            label="Funging adj."
            value={inputs.adjustmentFunging}
            onChange={(v) => onChange("adjustmentFunging", v)}
            min={-0.5}
            max={0}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
    </>
  );
}

function HKParams({ inputs, onChange }: { inputs: HelenKellerInputs; onChange: (key: keyof HelenKellerInputs, value: number) => void }) {
  return (
    <>
      <div className="params-section">
        <h4>Program Parameters</h4>
        <div className="param-grid">
          <InputField
            label="Grant size"
            value={inputs.grantSize}
            onChange={(v) => onChange("grantSize", v)}
            min={100000}
            max={10000000}
            step={100000}
            format="currency"
          />
          <InputField
            label="Cost per child reached"
            value={inputs.costPerPersonUnder5}
            onChange={(v) => onChange("costPerPersonUnder5", v)}
            min={0.5}
            max={10}
            step={0.1}
            format="currency"
          />
          <InputField
            label="Counterfactual coverage"
            value={inputs.proportionReachedCounterfactual}
            onChange={(v) => onChange("proportionReachedCounterfactual", v)}
            min={0}
            max={0.8}
            step={0.05}
            format="percent"
          />
          <InputField
            label="Under-5 mortality rate"
            value={inputs.mortalityRateUnder5}
            onChange={(v) => onChange("mortalityRateUnder5", v)}
            min={0.001}
            max={0.02}
            step={0.0005}
            format="percent"
          />
          <InputField
            label="VAS effect on mortality"
            value={inputs.vasEffect}
            onChange={(v) => onChange("vasEffect", v)}
            min={0.02}
            max={0.2}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
      <div className="params-section">
        <h4>Adjustment Factors</h4>
        <div className="param-grid">
          <InputField
            label="Developmental adj."
            value={inputs.adjustmentDevelopmental}
            onChange={(v) => onChange("adjustmentDevelopmental", v)}
            min={0}
            max={0.5}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Program benefits adj."
            value={inputs.adjustmentProgramBenefits}
            onChange={(v) => onChange("adjustmentProgramBenefits", v)}
            min={0}
            max={1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Grantee adj."
            value={inputs.adjustmentGrantee}
            onChange={(v) => onChange("adjustmentGrantee", v)}
            min={-0.3}
            max={0.1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Leverage adj."
            value={inputs.adjustmentLeverage}
            onChange={(v) => onChange("adjustmentLeverage", v)}
            min={-0.2}
            max={0.1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Funging adj."
            value={inputs.adjustmentFunging}
            onChange={(v) => onChange("adjustmentFunging", v)}
            min={-0.6}
            max={0}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
    </>
  );
}

function NIParams({ inputs, onChange }: { inputs: NewIncentivesInputs; onChange: (key: keyof NewIncentivesInputs, value: number) => void }) {
  return (
    <>
      <div className="params-section">
        <h4>Program Parameters</h4>
        <div className="param-grid">
          <InputField
            label="Grant size"
            value={inputs.grantSize}
            onChange={(v) => onChange("grantSize", v)}
            min={100000}
            max={10000000}
            step={100000}
            format="currency"
          />
          <InputField
            label="Cost per child reached"
            value={inputs.costPerChildReached}
            onChange={(v) => onChange("costPerChildReached", v)}
            min={5}
            max={50}
            step={1}
            format="currency"
          />
          <InputField
            label="Counterfactual vaccination"
            value={inputs.proportionReachedCounterfactual}
            onChange={(v) => onChange("proportionReachedCounterfactual", v)}
            min={0.5}
            max={0.95}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Death prob. unvaccinated"
            value={inputs.probabilityDeathUnvaccinated}
            onChange={(v) => onChange("probabilityDeathUnvaccinated", v)}
            min={0.01}
            max={0.1}
            step={0.005}
            format="percent"
          />
          <InputField
            label="Vaccine effect"
            value={inputs.vaccineEffect}
            onChange={(v) => onChange("vaccineEffect", v)}
            min={0.3}
            max={0.8}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
      <div className="params-section">
        <h4>Adjustment Factors</h4>
        <div className="param-grid">
          <InputField
            label="Older mortalities adj."
            value={inputs.adjustmentOlderMortalities}
            onChange={(v) => onChange("adjustmentOlderMortalities", v)}
            min={0}
            max={0.4}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Developmental adj."
            value={inputs.adjustmentDevelopmental}
            onChange={(v) => onChange("adjustmentDevelopmental", v)}
            min={0}
            max={0.5}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Consumption adj."
            value={inputs.adjustmentConsumption}
            onChange={(v) => onChange("adjustmentConsumption", v)}
            min={0}
            max={0.2}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Program benefits adj."
            value={inputs.adjustmentProgramBenefits}
            onChange={(v) => onChange("adjustmentProgramBenefits", v)}
            min={0}
            max={1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Leverage adj."
            value={inputs.adjustmentLeverage}
            onChange={(v) => onChange("adjustmentLeverage", v)}
            min={-0.2}
            max={0.1}
            step={0.01}
            format="percent"
          />
          <InputField
            label="Funging adj."
            value={inputs.adjustmentFunging}
            onChange={(v) => onChange("adjustmentFunging", v)}
            min={-0.2}
            max={0}
            step={0.01}
            format="percent"
          />
        </div>
      </div>
    </>
  );
}

interface MoralWeightsPanelProps {
  weights: MoralWeights;
  onChange: (weights: MoralWeights) => void;
  onReset: () => void;
}

function MoralWeightsPanel({ weights, onChange, onReset }: MoralWeightsPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = MORAL_WEIGHT_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      onChange(preset.weights);
    }
  };

  const handleWeightChange = (key: keyof MoralWeights, value: number) => {
    setSelectedPreset("custom");
    onChange({ ...weights, [key]: value });
  };

  return (
    <div className="moral-weights-panel">
      <h3>Moral Weights</h3>
      <p className="panel-description">
        Adjust the value assigned to averting deaths at different ages.
        Higher values mean saving that age group is considered more valuable.
      </p>

      <div className="preset-selector">
        <label>Preset:</label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          <option value="custom">Custom</option>
          {MORAL_WEIGHT_PRESETS.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="weights-grid">
        <div className="weight-input">
          <label>Under 5 years</label>
          <div className="weight-value-row">
            <input
              type="range"
              min={50}
              max={200}
              step={1}
              value={weights.under5}
              onChange={(e) => handleWeightChange("under5", parseFloat(e.target.value))}
            />
            <span className="weight-value">{weights.under5.toFixed(1)}</span>
          </div>
        </div>

        <div className="weight-input">
          <label>Ages 5-14</label>
          <div className="weight-value-row">
            <input
              type="range"
              min={50}
              max={150}
              step={1}
              value={weights.age5to14}
              onChange={(e) => handleWeightChange("age5to14", parseFloat(e.target.value))}
            />
            <span className="weight-value">{weights.age5to14.toFixed(1)}</span>
          </div>
        </div>

        <div className="weight-input">
          <label>Ages 15+</label>
          <div className="weight-value-row">
            <input
              type="range"
              min={30}
              max={120}
              step={1}
              value={weights.age15plus}
              onChange={(e) => handleWeightChange("age15plus", parseFloat(e.target.value))}
            />
            <span className="weight-value">{weights.age15plus.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <button className="reset-weights-btn" onClick={onReset}>
        Reset to GiveWell defaults
      </button>
    </div>
  );
}

interface CharityCardProps {
  config: (typeof CHARITY_CONFIGS)[number];
  charityInputs: CharityInputs;
  results: UnifiedResults;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onInputChange: (inputs: CharityInputs) => void;
  maxXBenchmark: number;
}

function CharityCard({
  config,
  charityInputs,
  results,
  isExpanded,
  onToggleExpand,
  onInputChange,
  maxXBenchmark,
}: CharityCardProps) {
  const barWidth = (results.finalXBenchmark / maxXBenchmark) * 100;

  const handleAMFChange = useCallback((key: keyof AMFInputs, value: number) => {
    if (charityInputs.type === "amf") {
      onInputChange({ type: "amf", inputs: { ...charityInputs.inputs, [key]: value } });
    }
  }, [charityInputs, onInputChange]);

  const handleMCChange = useCallback((key: keyof MalariaConsortiumInputs, value: number) => {
    if (charityInputs.type === "malaria-consortium") {
      onInputChange({ type: "malaria-consortium", inputs: { ...charityInputs.inputs, [key]: value } });
    }
  }, [charityInputs, onInputChange]);

  const handleHKChange = useCallback((key: keyof HelenKellerInputs, value: number) => {
    if (charityInputs.type === "helen-keller") {
      onInputChange({ type: "helen-keller", inputs: { ...charityInputs.inputs, [key]: value } });
    }
  }, [charityInputs, onInputChange]);

  const handleNIChange = useCallback((key: keyof NewIncentivesInputs, value: number) => {
    if (charityInputs.type === "new-incentives") {
      onInputChange({ type: "new-incentives", inputs: { ...charityInputs.inputs, [key]: value } });
    }
  }, [charityInputs, onInputChange]);

  return (
    <div className="charity-card">
      <div className="charity-header" style={{ borderLeftColor: config.color }}>
        <div className="charity-title">
          <div className="charity-logo-container">
            <img
              src={config.logoUrl}
              alt={`${config.name} logo`}
              className="charity-logo"
              onError={(e) => {
                // Fallback to abbreviation if logo fails to load
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <span
              className="charity-abbrev"
              style={{ backgroundColor: config.color, display: "none" }}
            >
              {config.abbrev}
            </span>
          </div>
          <h3>{config.name}</h3>
        </div>
        <button className="expand-btn" onClick={onToggleExpand}>
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      <div className="charity-metrics">
        <div className="metric-primary">
          <span className="metric-value" style={{ color: config.color }}>
            {results.finalXBenchmark.toFixed(1)}×
          </span>
          <span className="metric-label">cost-effectiveness</span>
        </div>

        <div className="metric-bar-container">
          <div
            className="metric-bar"
            style={{ width: `${barWidth}%`, backgroundColor: config.color }}
          />
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-value-sm">
              {formatCurrency(results.costPerDeathAverted)}
            </span>
            <span className="metric-label-sm">per death averted</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {results.deathsAvertedUnder5.toFixed(0)}
            </span>
            <span className="metric-label-sm">deaths averted</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {formatNumber(results.peopleReached, 0)}
            </span>
            <span className="metric-label-sm">children reached</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="charity-params" onClick={(e) => e.stopPropagation()}>
          <p className="param-description">{config.description}</p>

          {charityInputs.type === "amf" && (
            <AMFParams inputs={charityInputs.inputs} onChange={handleAMFChange} />
          )}
          {charityInputs.type === "malaria-consortium" && (
            <MCParams inputs={charityInputs.inputs} onChange={handleMCChange} />
          )}
          {charityInputs.type === "helen-keller" && (
            <HKParams inputs={charityInputs.inputs} onChange={handleHKChange} />
          )}
          {charityInputs.type === "new-incentives" && (
            <NIParams inputs={charityInputs.inputs} onChange={handleNIChange} />
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [expandedCharity, setExpandedCharity] = useState<CharityType | null>(null);

  // Moral weights state
  const [moralWeights, setMoralWeights] = useState<MoralWeights>({
    ...DEFAULT_MORAL_WEIGHTS,
  });

  // Initialize all charity inputs with defaults
  const [charityInputs, setCharityInputs] = useState<Record<CharityType, CharityInputs>>(() => {
    const inputs: Partial<Record<CharityType, CharityInputs>> = {};
    for (const config of CHARITY_CONFIGS) {
      inputs[config.type] = getDefaultInputs(config.type);
    }
    return inputs as Record<CharityType, CharityInputs>;
  });

  const handleInputChange = useCallback((type: CharityType, inputs: CharityInputs) => {
    setCharityInputs(prev => ({
      ...prev,
      [type]: inputs,
    }));
  }, []);

  const handleMoralWeightsChange = useCallback((weights: MoralWeights) => {
    setMoralWeights(weights);
  }, []);

  const resetMoralWeights = useCallback(() => {
    setMoralWeights({ ...DEFAULT_MORAL_WEIGHTS });
  }, []);

  const resetToDefaults = useCallback(() => {
    setCharityInputs({
      "amf": { type: "amf", inputs: { ...DEFAULT_AMF_INPUTS } },
      "malaria-consortium": { type: "malaria-consortium", inputs: { ...DEFAULT_MC_INPUTS } },
      "helen-keller": { type: "helen-keller", inputs: { ...DEFAULT_HK_INPUTS } },
      "new-incentives": { type: "new-incentives", inputs: { ...DEFAULT_NI_INPUTS } },
    });
    setMoralWeights({ ...DEFAULT_MORAL_WEIGHTS });
  }, []);

  // Calculate results for all charities with moral weights applied
  const charityResults = useMemo(() => {
    const results: Record<CharityType, UnifiedResults> = {} as Record<
      CharityType,
      UnifiedResults
    >;
    for (const config of CHARITY_CONFIGS) {
      // Apply moral weights to charity inputs before calculating
      const inputsWithWeights = applyMoralWeights(
        charityInputs[config.type],
        moralWeights
      );
      results[config.type] = calculateCharity(inputsWithWeights);
    }
    return results;
  }, [charityInputs, moralWeights]);

  // Calculate max xBenchmark for bar scaling
  const maxXBenchmark = useMemo(() => {
    let max = 0;
    for (const results of Object.values(charityResults)) {
      if (results.finalXBenchmark > max) max = results.finalXBenchmark;
    }
    return max * 1.1; // Add 10% padding
  }, [charityResults]);

  // Sort charities by cost-effectiveness
  const sortedCharities = useMemo(() => {
    return [...CHARITY_CONFIGS].sort(
      (a, b) =>
        charityResults[b.type].finalXBenchmark -
        charityResults[a.type].finalXBenchmark
    );
  }, [charityResults]);

  return (
    <div className="app">
      <div className="grain-overlay" />

      <header className="header">
        <div className="header-content">
          <h1>GiveWell CEA Calculator</h1>
          <p className="subtitle">
            An open-source implementation of GiveWell's cost-effectiveness
            analysis for top charities. Adjust parameters to explore how
            different assumptions affect relative effectiveness.
          </p>
        </div>
        <div className="header-meta">
          <span className="version">November 2025 Model</span>
          <button className="reset-btn" onClick={resetToDefaults}>
            Reset to defaults
          </button>
        </div>
      </header>

      <main className="main">
        <section className="charities-section">
          <div className="section-header">
            <h2>Top Charities Comparison</h2>
            <p>
              Cost-effectiveness expressed as multiples of GiveWell's benchmark
              (unconditional cash transfers). Click + to expand and adjust parameters.
            </p>
          </div>

          <div className="charities-grid">
            {sortedCharities.map((config) => (
              <CharityCard
                key={config.type}
                config={config}
                charityInputs={charityInputs[config.type]}
                results={charityResults[config.type]}
                isExpanded={expandedCharity === config.type}
                onToggleExpand={() =>
                  setExpandedCharity(
                    expandedCharity === config.type ? null : config.type
                  )
                }
                onInputChange={(inputs) => handleInputChange(config.type, inputs)}
                maxXBenchmark={maxXBenchmark}
              />
            ))}
          </div>
        </section>

        <aside className="sidebar">
          <div className="summary-panel">
            <h3>Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-value">
                  {Math.max(
                    ...Object.values(charityResults).map(
                      (r) => r.finalXBenchmark
                    )
                  ).toFixed(1)}
                  ×
                </span>
                <span className="stat-label">Best cost-effectiveness</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">
                  {formatCurrency(
                    Math.min(
                      ...Object.values(charityResults).map(
                        (r) => r.costPerDeathAverted
                      )
                    )
                  )}
                </span>
                <span className="stat-label">Lowest cost per death averted</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">
                  {Object.values(charityResults)
                    .reduce((sum, r) => sum + r.deathsAvertedUnder5, 0)
                    .toFixed(0)}
                </span>
                <span className="stat-label">
                  Total deaths averted per $4M
                </span>
              </div>
            </div>
          </div>

          <MoralWeightsPanel
            weights={moralWeights}
            onChange={handleMoralWeightsChange}
            onReset={resetMoralWeights}
          />

          <div className="methodology-panel">
            <h3>About This Tool</h3>
            <p>
              This calculator replicates GiveWell's cost-effectiveness analysis
              methodology for their top 4 charities as of November 2025:
            </p>
            <ul className="charity-list">
              {CHARITY_CONFIGS.map((config) => (
                <li key={config.type} className="charity-list-item">
                  <img
                    src={config.logoUrl}
                    alt={`${config.abbrev} logo`}
                    className="charity-list-logo"
                  />
                  <span>
                    <strong>{config.abbrev}</strong>: {config.description}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Each charity uses a different calculation model with unique
              parameters validated against GiveWell's published spreadsheets
              with 75+ tests.
            </p>
            <a
              href="https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness"
              target="_blank"
              rel="noopener noreferrer"
              className="methodology-link"
            >
              Read GiveWell's methodology →
            </a>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <p>
          Open source project by{" "}
          <a href="https://github.com/MaxGhenis">Max Ghenis</a>. Data from{" "}
          <a href="https://www.givewell.org">GiveWell</a>'s November 2025 CEA.
          <br />
          <a href="https://github.com/MaxGhenis/givewell-cea-tool">
            View source on GitHub
          </a>
        </p>
        <p className="disclaimer">
          This is an independent implementation for educational purposes. For
          official cost-effectiveness estimates, refer to GiveWell's published
          analyses.
        </p>
      </footer>
    </div>
  );
}

export default App;
