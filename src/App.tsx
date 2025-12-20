import { useState, useMemo } from "react";
import { calculateAMF, type AMFInputs } from "./lib/models/amf";
import "./App.css";

// Default inputs for each charity (from GiveWell November 2025 CEA)
const defaultInputs: Record<string, AMFInputs> = {
  "Against Malaria Foundation": {
    grantSize: 1_000_000,
    costPerUnder5Reached: 15.19,
    yearsEffectiveCoverage: 1.97,
    malariaMortalityRate: 0.00151,
    itnEffectOnDeaths: 0.24,
    moralWeightUnder5: 116.25,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.297,
    adjustmentDevelopmental: 0.609,
    adjustmentProgramBenefits: 0.529,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.0083,
    adjustmentFunging: -0.0302,
    adjustmentLeverageFungingForCostPerLife: -0.0733,
  },
  "Malaria Consortium": {
    grantSize: 1_000_000,
    costPerUnder5Reached: 4.5,
    yearsEffectiveCoverage: 0.33,
    malariaMortalityRate: 0.0045,
    itnEffectOnDeaths: 0.28,
    moralWeightUnder5: 116.25,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.15,
    adjustmentDevelopmental: 0.45,
    adjustmentProgramBenefits: 0.479,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.005,
    adjustmentFunging: -0.12,
    adjustmentLeverageFungingForCostPerLife: -0.18,
  },
  "Helen Keller International": {
    grantSize: 1_000_000,
    costPerUnder5Reached: 1.1,
    yearsEffectiveCoverage: 0.5,
    malariaMortalityRate: 0.0008,
    itnEffectOnDeaths: 0.12,
    moralWeightUnder5: 116.25,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.35,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.379,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.15,
    adjustmentLeverageFungingForCostPerLife: -0.22,
  },
  "New Incentives": {
    grantSize: 1_000_000,
    costPerUnder5Reached: 45,
    yearsEffectiveCoverage: 5,
    malariaMortalityRate: 0.015,
    itnEffectOnDeaths: 0.018,
    moralWeightUnder5: 116.25,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.08,
    adjustmentDevelopmental: 0.3,
    adjustmentProgramBenefits: 0.35,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.08,
    adjustmentLeverageFungingForCostPerLife: -0.12,
  },
};

const charityColors: Record<string, string> = {
  "Against Malaria Foundation": "#0D5C63",
  "Malaria Consortium": "#1B7F79",
  "Helen Keller International": "#2A9D8F",
  "New Incentives": "#48B89F",
};

const charityAbbrevs: Record<string, string> = {
  "Against Malaria Foundation": "AMF",
  "Malaria Consortium": "MC",
  "Helen Keller International": "HKI",
  "New Incentives": "NI",
};

function formatNumber(n: number, decimals = 1): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

function formatCurrency(n: number): string {
  return `$${formatNumber(n, 0)}`;
}

interface CharityCardProps {
  name: string;
  inputs: AMFInputs;
  onInputChange: (key: keyof AMFInputs, value: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  maxXBenchmark: number;
}

function CharityCard({
  name,
  inputs,
  onInputChange,
  isExpanded,
  onToggleExpand,
  maxXBenchmark,
}: CharityCardProps) {
  const results = useMemo(() => calculateAMF(inputs), [inputs]);
  const color = charityColors[name];
  const abbrev = charityAbbrevs[name];
  const barWidth = (results.finalXBenchmark / maxXBenchmark) * 100;

  // Calculate value breakdown
  const totalAdjustment = 1 + inputs.adjustmentOlderMortalities + inputs.adjustmentDevelopmental;
  const under5Pct = 1 / totalAdjustment;
  const olderPct = inputs.adjustmentOlderMortalities / totalAdjustment;
  const devPct = inputs.adjustmentDevelopmental / totalAdjustment;

  return (
    <div className="charity-card">
      <div className="charity-header" style={{ borderLeftColor: color }}>
        <div className="charity-title">
          <span className="charity-abbrev" style={{ backgroundColor: color }}>
            {abbrev}
          </span>
          <h3>{name}</h3>
        </div>
        <button className="expand-btn" onClick={onToggleExpand}>
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      <div className="charity-metrics">
        <div className="metric-primary">
          <span className="metric-value" style={{ color }}>
            {results.finalXBenchmark.toFixed(1)}×
          </span>
          <span className="metric-label">cost-effectiveness</span>
        </div>

        <div className="metric-bar-container">
          <div
            className="metric-bar"
            style={{ width: `${barWidth}%`, backgroundColor: color }}
          />
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-value-sm">
              {formatCurrency(results.finalCostPerLifeSaved)}
            </span>
            <span className="metric-label-sm">per life saved</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {results.deathsAvertedUnder5.toFixed(0)}
            </span>
            <span className="metric-label-sm">deaths averted</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {formatNumber(results.peopleUnder5Reached, 0)}
            </span>
            <span className="metric-label-sm">children reached</span>
          </div>
        </div>

        <div className="value-breakdown">
          <div className="breakdown-label">Value from:</div>
          <div className="breakdown-bars">
            <div
              className="breakdown-segment"
              style={{ width: `${under5Pct * 100}%`, backgroundColor: color }}
              title={`Under-5 deaths: ${(under5Pct * 100).toFixed(0)}%`}
            />
            <div
              className="breakdown-segment"
              style={{
                width: `${olderPct * 100}%`,
                backgroundColor: color,
                opacity: 0.6,
              }}
              title={`5+ deaths: ${(olderPct * 100).toFixed(0)}%`}
            />
            <div
              className="breakdown-segment"
              style={{
                width: `${devPct * 100}%`,
                backgroundColor: color,
                opacity: 0.3,
              }}
              title={`Developmental: ${(devPct * 100).toFixed(0)}%`}
            />
          </div>
          <div className="breakdown-legend">
            <span>
              <i style={{ backgroundColor: color }} />
              Under-5
            </span>
            <span>
              <i style={{ backgroundColor: color, opacity: 0.6 }} />
              5+ years
            </span>
            <span>
              <i style={{ backgroundColor: color, opacity: 0.3 }} />
              Developmental
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="charity-params">
          <div className="params-section">
            <h4>Program Parameters</h4>
            <div className="param-grid">
              <InputField
                label="Grant size"
                value={inputs.grantSize}
                onChange={(v) => onInputChange("grantSize", v)}
                min={100000}
                max={10000000}
                step={100000}
                format="currency"
              />
              <InputField
                label="Cost per child reached"
                value={inputs.costPerUnder5Reached}
                onChange={(v) => onInputChange("costPerUnder5Reached", v)}
                min={0.5}
                max={100}
                step={0.5}
                format="currency"
              />
              <InputField
                label="Years of coverage"
                value={inputs.yearsEffectiveCoverage}
                onChange={(v) => onInputChange("yearsEffectiveCoverage", v)}
                min={0.1}
                max={5}
                step={0.1}
                format="decimal"
              />
              <InputField
                label="Mortality rate"
                value={inputs.malariaMortalityRate}
                onChange={(v) => onInputChange("malariaMortalityRate", v)}
                min={0.0001}
                max={0.02}
                step={0.0001}
                format="percent"
              />
              <InputField
                label="Intervention effect"
                value={inputs.itnEffectOnDeaths}
                onChange={(v) => onInputChange("itnEffectOnDeaths", v)}
                min={0.05}
                max={0.8}
                step={0.01}
                format="percent"
              />
            </div>
          </div>

          <div className="params-section">
            <h4>Adjustments</h4>
            <div className="param-grid">
              <InputField
                label="Older mortalities adj."
                value={inputs.adjustmentOlderMortalities}
                onChange={(v) => onInputChange("adjustmentOlderMortalities", v)}
                min={0}
                max={1}
                step={0.01}
                format="percent"
              />
              <InputField
                label="Developmental adj."
                value={inputs.adjustmentDevelopmental}
                onChange={(v) => onInputChange("adjustmentDevelopmental", v)}
                min={0}
                max={1}
                step={0.01}
                format="percent"
              />
              <InputField
                label="Program benefits adj."
                value={inputs.adjustmentProgramBenefits}
                onChange={(v) => onInputChange("adjustmentProgramBenefits", v)}
                min={-0.5}
                max={1}
                step={0.01}
                format="percent"
              />
              <InputField
                label="Leverage adj."
                value={inputs.adjustmentLeverage}
                onChange={(v) => onInputChange("adjustmentLeverage", v)}
                min={-0.5}
                max={0.5}
                step={0.01}
                format="percent"
              />
              <InputField
                label="Funging adj."
                value={inputs.adjustmentFunging}
                onChange={(v) => onInputChange("adjustmentFunging", v)}
                min={-0.5}
                max={0}
                step={0.01}
                format="percent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: "currency" | "percent" | "decimal";
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
        return value >= 1000 ? `$${formatNumber(value, 0)}` : `$${value}`;
      case "percent":
        return `${(value * 100).toFixed(1)}%`;
      case "decimal":
        return value.toFixed(2);
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

interface MoralWeightsPanelProps {
  weights: { under5: number; fivePlus: number };
  onChange: (key: "under5" | "fivePlus", value: number) => void;
}

function MoralWeightsPanel({ weights, onChange }: MoralWeightsPanelProps) {
  return (
    <div className="moral-weights-panel">
      <h3>Moral Weights</h3>
      <p className="panel-description">
        How much do you value preventing deaths at different ages? GiveWell's
        default weights are based on expected life-years saved.
      </p>
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
              onChange={(e) => onChange("under5", parseFloat(e.target.value))}
            />
            <span className="weight-value">{weights.under5.toFixed(0)} UoV</span>
          </div>
        </div>
        <div className="weight-input">
          <label>5+ years</label>
          <div className="weight-value-row">
            <input
              type="range"
              min={30}
              max={150}
              step={1}
              value={weights.fivePlus}
              onChange={(e) => onChange("fivePlus", parseFloat(e.target.value))}
            />
            <span className="weight-value">
              {weights.fivePlus.toFixed(0)} UoV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [charityInputs, setCharityInputs] = useState(defaultInputs);
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null);
  const [moralWeights, setMoralWeights] = useState({
    under5: 116.25,
    fivePlus: 73.19,
  });

  // Apply moral weights to all charities
  const inputsWithWeights = useMemo(() => {
    const updated: Record<string, AMFInputs> = {};
    for (const [name, inputs] of Object.entries(charityInputs)) {
      updated[name] = {
        ...inputs,
        moralWeightUnder5: moralWeights.under5,
        moralWeight5Plus: moralWeights.fivePlus,
      };
    }
    return updated;
  }, [charityInputs, moralWeights]);

  // Calculate max xBenchmark for bar scaling
  const maxXBenchmark = useMemo(() => {
    let max = 0;
    for (const inputs of Object.values(inputsWithWeights)) {
      const results = calculateAMF(inputs);
      if (results.finalXBenchmark > max) max = results.finalXBenchmark;
    }
    return max * 1.1; // Add 10% padding
  }, [inputsWithWeights]);

  const handleInputChange = (
    charity: string,
    key: keyof AMFInputs,
    value: number
  ) => {
    setCharityInputs((prev) => ({
      ...prev,
      [charity]: {
        ...prev[charity],
        [key]: value,
      },
    }));
  };

  const handleWeightChange = (key: "under5" | "fivePlus", value: number) => {
    setMoralWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    setCharityInputs(defaultInputs);
    setMoralWeights({ under5: 116.25, fivePlus: 73.19 });
  };

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
              (unconditional cash transfers)
            </p>
          </div>

          <div className="charities-grid">
            {Object.entries(inputsWithWeights).map(([name, inputs]) => (
              <CharityCard
                key={name}
                name={name}
                inputs={inputs}
                onInputChange={(key, value) =>
                  handleInputChange(name, key, value)
                }
                isExpanded={expandedCharity === name}
                onToggleExpand={() =>
                  setExpandedCharity(expandedCharity === name ? null : name)
                }
                maxXBenchmark={maxXBenchmark}
              />
            ))}
          </div>
        </section>

        <aside className="sidebar">
          <MoralWeightsPanel
            weights={moralWeights}
            onChange={handleWeightChange}
          />

          <div className="methodology-panel">
            <h3>About This Tool</h3>
            <p>
              This calculator replicates GiveWell's cost-effectiveness analysis
              methodology. The model calculates:
            </p>
            <ol>
              <li>People reached = Grant ÷ Cost per person</li>
              <li>Deaths averted = People × Coverage × Mortality × Effect</li>
              <li>Value = Deaths × Moral weight</li>
              <li>CE = Value ÷ (Grant × Benchmark)</li>
            </ol>
            <p>
              Adjustments are applied for benefits to older age groups,
              developmental impacts, and leverage/funging effects.
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
