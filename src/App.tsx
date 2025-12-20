import { useState, useMemo } from "react";
import {
  CHARITY_CONFIGS,
  calculateCharity,
  getDefaultInputs,
  type CharityInputs,
  type CharityType,
  type UnifiedResults,
} from "./lib/models";
import "./App.css";

function formatNumber(n: number, decimals = 1): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

function formatCurrency(n: number): string {
  return `$${formatNumber(n, 0)}`;
}

interface CharityCardProps {
  config: (typeof CHARITY_CONFIGS)[number];
  results: UnifiedResults;
  isExpanded: boolean;
  onToggleExpand: () => void;
  maxXBenchmark: number;
}

function CharityCard({
  config,
  results,
  isExpanded,
  onToggleExpand,
  maxXBenchmark,
}: CharityCardProps) {
  const barWidth = (results.finalXBenchmark / maxXBenchmark) * 100;

  return (
    <div className="charity-card">
      <div className="charity-header" style={{ borderLeftColor: config.color }}>
        <div className="charity-title">
          <span
            className="charity-abbrev"
            style={{ backgroundColor: config.color }}
          >
            {config.abbrev}
          </span>
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
        <div className="charity-params">
          <p className="param-description">{config.description}</p>
          <div className="param-details">
            <div className="param-row">
              <span className="param-label">Initial CE:</span>
              <span className="param-value">
                {results.initialXBenchmark.toFixed(2)}×
              </span>
            </div>
            <div className="param-row">
              <span className="param-label">Final CE:</span>
              <span className="param-value">
                {results.finalXBenchmark.toFixed(2)}×
              </span>
            </div>
            <div className="param-row">
              <span className="param-label">Adjustment factor:</span>
              <span className="param-value">
                {(results.finalXBenchmark / results.initialXBenchmark).toFixed(
                  2
                )}
                ×
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [expandedCharity, setExpandedCharity] = useState<CharityType | null>(
    null
  );

  // Initialize all charity inputs with defaults
  const [charityInputs] = useState<Record<CharityType, CharityInputs>>(() => {
    const inputs: Partial<Record<CharityType, CharityInputs>> = {};
    for (const config of CHARITY_CONFIGS) {
      inputs[config.type] = getDefaultInputs(config.type);
    }
    return inputs as Record<CharityType, CharityInputs>;
  });

  // Calculate results for all charities
  const charityResults = useMemo(() => {
    const results: Record<CharityType, UnifiedResults> = {} as Record<
      CharityType,
      UnifiedResults
    >;
    for (const config of CHARITY_CONFIGS) {
      results[config.type] = calculateCharity(charityInputs[config.type]);
    }
    return results;
  }, [charityInputs]);

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
            analysis for top charities. Compare how each charity performs
            relative to unconditional cash transfers.
          </p>
        </div>
        <div className="header-meta">
          <span className="version">November 2025 Model</span>
        </div>
      </header>

      <main className="main">
        <section className="charities-section">
          <div className="section-header">
            <h2>Top Charities Comparison</h2>
            <p>
              Cost-effectiveness expressed as multiples of GiveWell's benchmark
              (unconditional cash transfers). A value of 10× means $1 donated
              creates 10× the value of $1 in cash.
            </p>
          </div>

          <div className="charities-grid">
            {sortedCharities.map((config) => (
              <CharityCard
                key={config.type}
                config={config}
                results={charityResults[config.type]}
                isExpanded={expandedCharity === config.type}
                onToggleExpand={() =>
                  setExpandedCharity(
                    expandedCharity === config.type ? null : config.type
                  )
                }
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

          <div className="methodology-panel">
            <h3>About This Tool</h3>
            <p>
              This calculator replicates GiveWell's cost-effectiveness analysis
              methodology for their top 4 charities as of November 2025:
            </p>
            <ul>
              <li>
                <strong>AMF</strong>: Insecticide-treated bed nets
              </li>
              <li>
                <strong>Malaria Consortium</strong>: Seasonal malaria
                chemoprevention
              </li>
              <li>
                <strong>Helen Keller</strong>: Vitamin A supplementation
              </li>
              <li>
                <strong>New Incentives</strong>: Vaccination incentives
              </li>
            </ul>
            <p>
              Each charity uses a different calculation model with unique
              parameters and adjustment factors validated against GiveWell's
              published spreadsheets.
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
