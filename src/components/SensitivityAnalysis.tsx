import { useState, useMemo } from "react";
import {
  CHARITY_CONFIGS,
  calculateCharity,
  applyMoralWeights,
  type CharityType,
  type MoralWeights,
  // Country data for computing best across variants
  AMF_COUNTRIES,
  MC_COUNTRIES,
  HK_COUNTRIES,
  NI_COUNTRIES,
  GD_COUNTRIES,
  DW_VARIANTS,
  getAMFInputsForCountry,
  getMCInputsForCountry,
  getHKInputsForCountry,
  getNIInputsForCountry,
  getGDInputsForCountry,
  getDWInputsForVariant,
  type CharityInputs,
} from "../lib/models";

export type SweepableParam = "under5" | "age5to14" | "age15to49" | "age50plus" | "discountRate";

interface SweepPoint {
  paramValue: number;
  charityResults: Record<CharityType, number>;
}

const PARAM_RANGES: Record<SweepableParam, { min: number; max: number; label: string; format: (v: number) => string }> = {
  under5: { min: 50, max: 200, label: "Under-5 moral weight", format: (v) => v.toFixed(0) },
  age5to14: { min: 50, max: 200, label: "Age 5-14 weight", format: (v) => v.toFixed(0) },
  age15to49: { min: 30, max: 200, label: "Age 15-49 weight", format: (v) => v.toFixed(0) },
  age50plus: { min: 10, max: 150, label: "Age 50+ weight", format: (v) => v.toFixed(0) },
  discountRate: { min: 0, max: 0.10, label: "Discount rate", format: (v) => `${(v * 100).toFixed(1)}%` },
};

function getBestXBenchmark(
  charityType: CharityType,
  moralWeights: MoralWeights,
  grantSize: number
): number {
  let best = -Infinity;

  const compute = (inputs: CharityInputs) => {
    const withWeights = applyMoralWeights(inputs, moralWeights);
    const result = calculateCharity(withWeights);
    if (result.finalXBenchmark > best) best = result.finalXBenchmark;
  };

  switch (charityType) {
    case "amf":
      for (const c of AMF_COUNTRIES) compute({ type: "amf", inputs: getAMFInputsForCountry(c, grantSize) });
      break;
    case "malaria-consortium":
      for (const c of MC_COUNTRIES) compute({ type: "malaria-consortium", inputs: getMCInputsForCountry(c, grantSize) });
      break;
    case "helen-keller":
      for (const c of HK_COUNTRIES) compute({ type: "helen-keller", inputs: getHKInputsForCountry(c, grantSize) });
      break;
    case "new-incentives":
      for (const c of NI_COUNTRIES) compute({ type: "new-incentives", inputs: getNIInputsForCountry(c, grantSize) });
      break;
    case "givedirectly":
      for (const c of GD_COUNTRIES) compute({ type: "givedirectly", inputs: getGDInputsForCountry(c, grantSize) });
      break;
    case "deworming":
      for (const c of DW_VARIANTS) compute({ type: "deworming", inputs: getDWInputsForVariant(c, grantSize) });
      break;
  }

  return best;
}

export function runSensitivitySweep(
  baseMoralWeights: MoralWeights,
  param: SweepableParam,
  grantSize: number,
  numPoints: number = 20
): SweepPoint[] {
  const range = PARAM_RANGES[param];
  const step = (range.max - range.min) / (numPoints - 1);

  const results: SweepPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const paramValue = range.min + step * i;
    const modifiedWeights: MoralWeights = { ...baseMoralWeights, [param]: paramValue };

    const charityResults: Record<string, number> = {};
    for (const config of CHARITY_CONFIGS) {
      charityResults[config.type] = getBestXBenchmark(config.type, modifiedWeights, grantSize);
    }

    results.push({ paramValue, charityResults: charityResults as Record<CharityType, number> });
  }

  return results;
}

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
