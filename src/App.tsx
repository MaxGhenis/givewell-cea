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
  type MoralWeightMode,
  DEFAULT_AMF_INPUTS,
  DEFAULT_MC_INPUTS,
  DEFAULT_HK_INPUTS,
  DEFAULT_NI_INPUTS,
  DEFAULT_GD_INPUTS,
  DEFAULT_DW_INPUTS,
  DEFAULT_MORAL_WEIGHTS,
  MORAL_WEIGHT_PRESETS,
  // Country data
  AMF_COUNTRIES,
  AMF_COUNTRY_NAMES,
  MC_COUNTRIES,
  MC_COUNTRY_NAMES,
  HK_COUNTRIES,
  HK_COUNTRY_NAMES,
  NI_COUNTRIES,
  NI_COUNTRY_NAMES,
  GD_COUNTRIES,
  GD_COUNTRY_NAMES,
  DW_VARIANTS,
  DW_VARIANT_NAMES,
  getAMFInputsForCountry,
  getMCInputsForCountry,
  getHKInputsForCountry,
  getNIInputsForCountry,
  getGDInputsForCountry,
  getDWInputsForVariant,
  type AMFCountry,
  type MCCountry,
  type HKCountry,
  type NICountry,
  type GDCountry,
  type DWVariant,
} from "./lib/models";
import { CalculationBreakdown } from "./components/CalculationBreakdown";
import { CountryComparison } from "./components/CountryComparison";
import "./App.css";

function formatNumber(n: number, decimals = 1): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

function formatCurrency(n: number, decimals = 1): string {
  return `$${formatNumber(n, decimals)}`;
}

interface MoralWeightsPanelProps {
  weights: MoralWeights;
  onChange: (weights: MoralWeights) => void;
  onReset: () => void;
}

function MoralWeightsPanel({ weights, onChange, onReset }: MoralWeightsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const handleWeightChange = (key: keyof MoralWeights, value: number | MoralWeightMode) => {
    onChange({ ...weights, [key]: value });
  };

  const handlePresetChange = (presetName: string) => {
    const preset = MORAL_WEIGHT_PRESETS.find(p => p.name === presetName);
    if (preset) {
      onChange(preset.weights);
    }
  };

  return (
    <div className="moral-weights-panel">
      <div className="panel-header" onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer" }}>
        <h3>Moral Weights {expanded ? "▼" : "▶"}</h3>
      </div>

      {expanded && (
        <>
          <p className="panel-description">
            Adjust the value assigned to averting deaths at different ages.
            GiveWell's weights peak at ages 5-9 (134), reflecting both years
            of life saved and donor preferences.
          </p>

          <div className="mode-selector">
            <label>Input Mode:</label>
            <select
              value={weights.mode}
              onChange={(e) => handleWeightChange("mode", e.target.value as MoralWeightMode)}
            >
              <option value="simple">Simple (multiplier)</option>
              <option value="manual">Manual (age-specific)</option>
            </select>
          </div>

          <div className="preset-selector">
            <label>Preset:</label>
            <select
              onChange={(e) => handlePresetChange(e.target.value)}
              value=""
            >
              <option value="" disabled>Load preset...</option>
              {MORAL_WEIGHT_PRESETS.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {weights.mode === "simple" ? (
            <div className="weights-grid">
              <div className="weight-input">
                <label>Weight Multiplier</label>
                <div className="weight-value-row">
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={weights.multiplier}
                    onChange={(e) => handleWeightChange("multiplier", parseFloat(e.target.value))}
                  />
                  <span className="weight-value">{weights.multiplier.toFixed(1)}x</span>
                </div>
                <span className="weight-hint">Scales all age weights (1x = GiveWell default)</span>
              </div>
            </div>
          ) : (
            <div className="weights-grid">
              <div className="weight-section">
                <h4>Age-Specific Weights</h4>
                <div className="weight-input">
                  <label>Under 5 years</label>
                  <div className="weight-value-row">
                    <input
                      type="range"
                      min={50}
                      max={250}
                      step={1}
                      value={weights.under5}
                      onChange={(e) => handleWeightChange("under5", parseFloat(e.target.value))}
                    />
                    <span className="weight-value">{weights.under5.toFixed(0)}</span>
                  </div>
                </div>
                <div className="weight-input">
                  <label>Ages 5-14</label>
                  <div className="weight-value-row">
                    <input
                      type="range"
                      min={50}
                      max={250}
                      step={1}
                      value={weights.age5to14}
                      onChange={(e) => handleWeightChange("age5to14", parseFloat(e.target.value))}
                    />
                    <span className="weight-value">{weights.age5to14.toFixed(0)}</span>
                  </div>
                </div>
                <div className="weight-input">
                  <label>Ages 15-49</label>
                  <div className="weight-value-row">
                    <input
                      type="range"
                      min={30}
                      max={200}
                      step={1}
                      value={weights.age15to49}
                      onChange={(e) => handleWeightChange("age15to49", parseFloat(e.target.value))}
                    />
                    <span className="weight-value">{weights.age15to49.toFixed(0)}</span>
                  </div>
                </div>
                <div className="weight-input">
                  <label>Ages 50+</label>
                  <div className="weight-value-row">
                    <input
                      type="range"
                      min={10}
                      max={150}
                      step={1}
                      value={weights.age50plus}
                      onChange={(e) => handleWeightChange("age50plus", parseFloat(e.target.value))}
                    />
                    <span className="weight-value">{weights.age50plus.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="weight-input discount-rate-input">
            <label>Discount Rate</label>
            <div className="weight-value-row">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={weights.discountRate * 100}
                onChange={(e) => handleWeightChange("discountRate", parseFloat(e.target.value) / 100)}
              />
              <span className="weight-value">{(weights.discountRate * 100).toFixed(1)}%</span>
            </div>
            <span className="weight-hint">Rate for discounting future benefits (GiveWell uses 4%)</span>
          </div>

          <button className="reset-weights-btn" onClick={onReset}>
            Reset to GiveWell defaults
          </button>
        </>
      )}
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
  onCountryChange: (country: string) => void;
  selectedCountry: string;
  maxXBenchmark: number;
  onCompareCountries: () => void;
}

// Get country options for a charity type
function getCountryOptions(charityType: CharityType): { value: string; label: string }[] {
  switch (charityType) {
    case "amf":
      return AMF_COUNTRIES.map(c => ({ value: c, label: AMF_COUNTRY_NAMES[c] }));
    case "malaria-consortium":
      return MC_COUNTRIES.map(c => ({ value: c, label: MC_COUNTRY_NAMES[c] }));
    case "helen-keller":
      return HK_COUNTRIES.map(c => ({ value: c, label: HK_COUNTRY_NAMES[c] }));
    case "new-incentives":
      return NI_COUNTRIES.map(c => ({ value: c, label: NI_COUNTRY_NAMES[c] }));
    case "givedirectly":
      return GD_COUNTRIES.map(c => ({ value: c, label: GD_COUNTRY_NAMES[c] }));
    case "deworming":
      return DW_VARIANTS.map(c => ({ value: c, label: DW_VARIANT_NAMES[c] }));
  }
}

function CharityCard({
  config,
  charityInputs,
  results,
  isExpanded,
  onToggleExpand,
  onInputChange,
  onCountryChange,
  selectedCountry,
  maxXBenchmark,
  onCompareCountries,
}: CharityCardProps) {
  const barWidth = (results.finalXBenchmark / maxXBenchmark) * 100;

  // Get grant size for display in labels
  const grantSize = charityInputs.inputs.grantSize;
  const grantLabel = grantSize >= 1_000_000
    ? `$${(grantSize / 1_000_000).toFixed(grantSize % 1_000_000 === 0 ? 0 : 1)}M`
    : `$${(grantSize / 1_000).toFixed(0)}K`;

  return (
    <div className="charity-card">
      <div className="charity-header" style={{ borderLeftColor: config.color }}>
        <div className="charity-title">
          <a
            href={config.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="charity-logo-container"
            onClick={(e) => e.stopPropagation()}
          >
            {config.logoUrl ? (
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
            ) : null}
            <span
              className="charity-abbrev"
              style={{
                backgroundColor: config.color,
                display: config.logoUrl ? "none" : "flex"
              }}
            >
              {config.abbrev}
            </span>
          </a>
          <div className="charity-name-row">
            <h3>{config.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <select
                className="country-selector"
                value={selectedCountry}
                onChange={(e) => onCountryChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                {getCountryOptions(config.type).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                className="compare-countries-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareCountries();
                }}
                title="Compare countries"
              >
                Compare
              </button>
            </div>
          </div>
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
              {results.costPerDeathAverted === Infinity ? "N/A" : formatCurrency(results.costPerDeathAverted)}
            </span>
            <span className="metric-label-sm">cost per death averted</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {results.deathsAvertedUnder5 === 0 ? "N/A" : results.deathsAvertedUnder5.toFixed(0)}
            </span>
            <span className="metric-label-sm">deaths averted per {grantLabel}</span>
          </div>
          <div className="metric">
            <span className="metric-value-sm">
              {formatNumber(results.peopleReached, 0)}
            </span>
            <span className="metric-label-sm">people reached per {grantLabel}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="charity-params" onClick={(e) => e.stopPropagation()}>
          <p className="param-description">{config.description}</p>

          <p className="edit-hint">
            Click any highlighted value below to edit it.
          </p>
          <CalculationBreakdown
            charityInputs={charityInputs}
            results={results}
            onInputChange={onInputChange}
          />
        </div>
      )}
    </div>
  );
}

// Country selection type
type SelectedCountries = {
  amf: AMFCountry;
  "malaria-consortium": MCCountry;
  "helen-keller": HKCountry;
  "new-incentives": NICountry;
  givedirectly: GDCountry;
  deworming: DWVariant;
};

function App() {
  const [expandedCharity, setExpandedCharity] = useState<CharityType | null>(null);
  const [comparisonCharity, setComparisonCharity] = useState<CharityType | null>(null);

  // Country selection state
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountries>({
    amf: "chad",
    "malaria-consortium": "burkina_faso",
    "helen-keller": "drc",
    "new-incentives": "bauchi",
    givedirectly: "kenya",
    deworming: "base",
  });

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
      "givedirectly": { type: "givedirectly", inputs: { ...DEFAULT_GD_INPUTS } },
      "deworming": { type: "deworming", inputs: { ...DEFAULT_DW_INPUTS } },
    });
    setMoralWeights({ ...DEFAULT_MORAL_WEIGHTS });
  }, []);

  // Handle country change - updates inputs to country-specific values
  const handleCountryChange = useCallback((charityType: CharityType, country: string) => {
    const grantSize = charityInputs[charityType].inputs.grantSize;

    switch (charityType) {
      case "amf":
        setSelectedCountries(prev => ({ ...prev, amf: country as AMFCountry }));
        setCharityInputs(prev => ({
          ...prev,
          amf: { type: "amf", inputs: getAMFInputsForCountry(country as AMFCountry, grantSize) },
        }));
        break;
      case "malaria-consortium":
        setSelectedCountries(prev => ({ ...prev, "malaria-consortium": country as MCCountry }));
        setCharityInputs(prev => ({
          ...prev,
          "malaria-consortium": { type: "malaria-consortium", inputs: getMCInputsForCountry(country as MCCountry, grantSize) },
        }));
        break;
      case "helen-keller":
        setSelectedCountries(prev => ({ ...prev, "helen-keller": country as HKCountry }));
        setCharityInputs(prev => ({
          ...prev,
          "helen-keller": { type: "helen-keller", inputs: getHKInputsForCountry(country as HKCountry, grantSize) },
        }));
        break;
      case "new-incentives":
        setSelectedCountries(prev => ({ ...prev, "new-incentives": country as NICountry }));
        setCharityInputs(prev => ({
          ...prev,
          "new-incentives": { type: "new-incentives", inputs: getNIInputsForCountry(country as NICountry, grantSize) },
        }));
        break;
      case "givedirectly":
        setSelectedCountries(prev => ({ ...prev, givedirectly: country as GDCountry }));
        setCharityInputs(prev => ({
          ...prev,
          givedirectly: { type: "givedirectly", inputs: getGDInputsForCountry(country as GDCountry, grantSize) },
        }));
        break;
      case "deworming":
        setSelectedCountries(prev => ({ ...prev, deworming: country as DWVariant }));
        setCharityInputs(prev => ({
          ...prev,
          deworming: { type: "deworming", inputs: getDWInputsForVariant(country as DWVariant, grantSize) },
        }));
        break;
    }
  }, [charityInputs]);

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

      <div className="disclaimer-banner">
        Independent tool by <a href="https://maxghenis.com">Max Ghenis</a> — not affiliated with GiveWell.
        See <a href="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" target="_blank" rel="noopener noreferrer">GiveWell's official CEA spreadsheet</a>.
      </div>

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
                onCountryChange={(country) => handleCountryChange(config.type, country)}
                selectedCountry={selectedCountries[config.type]}
                maxXBenchmark={maxXBenchmark}
                onCompareCountries={() => setComparisonCharity(config.type)}
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
                      ...Object.values(charityResults)
                        .map((r) => r.costPerDeathAverted)
                        .filter((c) => c !== Infinity)
                    )
                  )}
                </span>
                <span className="stat-label">Lowest cost per death averted</span>
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
              An independent, open-source calculator replicating GiveWell's
              cost-effectiveness methodology for their top charities
              (November 2024-2025 CEA):
            </p>
            <ul className="charity-list">
              {CHARITY_CONFIGS.map((config) => (
                <li key={config.type} className="charity-list-item">
                  <a
                    href={config.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="charity-list-logo-link"
                  >
                    {config.logoUrl ? (
                      <img
                        src={config.logoUrl}
                        alt={`${config.abbrev} logo`}
                        className="charity-list-logo"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span
                      className="charity-list-abbrev"
                      style={{
                        backgroundColor: config.color,
                        display: config.logoUrl ? "none" : "flex"
                      }}
                    >
                      {config.abbrev}
                    </span>
                  </a>
                  <span>
                    <a href={config.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <strong>{config.abbrev}</strong>
                    </a>: {config.description}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Each charity uses a different calculation model with unique
              parameters validated against GiveWell's published spreadsheets
              with 120+ tests.
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

      {comparisonCharity && (
        <CountryComparison
          charityType={comparisonCharity}
          moralWeights={moralWeights}
          onClose={() => setComparisonCharity(null)}
        />
      )}

      <footer className="footer">
        <p>
          Built by{" "}
          <a href="https://maxghenis.com">Max Ghenis</a> (not affiliated with GiveWell).{" "}
          Data from{" "}
          <a href="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc" target="_blank" rel="noopener noreferrer">
            GiveWell's November 2025 CEA
          </a>.
          <br />
          <a href="https://github.com/MaxGhenis/givewell-cea" className="github-link">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View source
          </a>{" "}
          |{" "}
          <a href="https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models" target="_blank" rel="noopener noreferrer">
            GiveWell CEA methodology
          </a>
        </p>
        <p className="disclaimer">
          This is an independent, open-source tool for educational purposes—not
          an official GiveWell product. For official cost-effectiveness
          estimates, refer to{" "}
          <a href="https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models">
            GiveWell's published analyses
          </a>.
        </p>
      </footer>
    </div>
  );
}

export default App;
