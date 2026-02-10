import { useState, useMemo } from "react";
import { CHARITY_CONFIGS, type MoralWeights } from "../lib/models";
import { runSensitivitySweep, PARAM_RANGES, type SweepableParam } from "../lib/sensitivity";

interface SensitivityAnalysisProps {
  moralWeights: MoralWeights;
  grantSize: number;
}

export function SensitivityAnalysis({ moralWeights, grantSize }: SensitivityAnalysisProps) {
  const [selectedParam, setSelectedParam] = useState<SweepableParam>("under5");

  const sweepData = useMemo(
    () => runSensitivitySweep(moralWeights, selectedParam, grantSize, 20),
    [moralWeights, selectedParam, grantSize]
  );

  const paramConfig = PARAM_RANGES[selectedParam];

  // Chart dimensions
  const width = 300;
  const height = 200;
  const margin = { top: 12, right: 12, bottom: 28, left: 40 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  // Compute Y range from data
  const allY = sweepData.flatMap(d => Object.values(d.charityResults));
  const yMin = Math.max(0, Math.floor(Math.min(...allY)));
  const yMax = Math.ceil(Math.max(...allY));
  const yRange = yMax - yMin || 1;

  const xScale = (v: number) => margin.left + ((v - paramConfig.min) / (paramConfig.max - paramConfig.min)) * plotW;
  const yScale = (v: number) => margin.top + plotH - ((v - yMin) / yRange) * plotH;

  // Build polyline paths per charity
  const charityLines = CHARITY_CONFIGS.map(config => {
    const points = sweepData
      .map(d => `${xScale(d.paramValue).toFixed(1)},${yScale(d.charityResults[config.type]).toFixed(1)}`)
      .join(" ");
    return { type: config.type, color: config.color, abbrev: config.abbrev, points };
  });

  // X axis ticks (5 ticks)
  const xTicks = Array.from({ length: 5 }, (_, i) => paramConfig.min + (paramConfig.max - paramConfig.min) * (i / 4));
  // Y axis ticks (4 ticks)
  const yTicks = Array.from({ length: 4 }, (_, i) => yMin + yRange * (i / 3));

  return (
    <div className="sensitivity-panel">
      <h3>Sensitivity analysis</h3>
      <div className="sensitivity-controls">
        <label htmlFor="sensitivity-param">Parameter:</label>
        <select
          id="sensitivity-param"
          value={selectedParam}
          onChange={e => setSelectedParam(e.target.value as SweepableParam)}
        >
          {(Object.keys(PARAM_RANGES) as SweepableParam[]).map(p => (
            <option key={p} value={p}>{PARAM_RANGES[p].label}</option>
          ))}
        </select>
      </div>

      <svg className="sensitivity-chart" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={`ygrid-${i}`}
            x1={margin.left}
            x2={width - margin.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="var(--color-border, #e5e3df)"
            strokeWidth={0.5}
          />
        ))}

        {/* Y axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={`ylabel-${i}`}
            x={margin.left - 4}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            fill="var(--color-text-muted, #8a8a9e)"
          >
            {tick.toFixed(0)}x
          </text>
        ))}

        {/* X axis labels */}
        {xTicks.map((tick, i) => (
          <text
            key={`xlabel-${i}`}
            x={xScale(tick)}
            y={height - 4}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono, monospace)"
            fill="var(--color-text-muted, #8a8a9e)"
          >
            {paramConfig.format(tick)}
          </text>
        ))}

        {/* Charity lines */}
        {charityLines.map(line => (
          <polyline
            key={line.type}
            points={line.points}
            fill="none"
            stroke={line.color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ))}

        {/* Current value indicator */}
        <line
          x1={xScale(moralWeights[selectedParam] as number)}
          x2={xScale(moralWeights[selectedParam] as number)}
          y1={margin.top}
          y2={margin.top + plotH}
          stroke="var(--color-ink, #1a1a2e)"
          strokeWidth={1}
          strokeDasharray="3,3"
          opacity={0.5}
        />
      </svg>

      <div className="sensitivity-legend">
        {charityLines.map(line => (
          <span key={line.type} className="sensitivity-legend-item">
            <span className="sensitivity-legend-swatch" style={{ background: line.color }} />
            {line.abbrev}
          </span>
        ))}
      </div>
    </div>
  );
}
