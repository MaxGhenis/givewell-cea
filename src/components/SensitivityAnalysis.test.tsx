import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SensitivityAnalysis } from "./SensitivityAnalysis";
import { runSensitivitySweep } from "../lib/sensitivity";
import { DEFAULT_MORAL_WEIGHTS, CHARITY_CONFIGS } from "../lib/models";

describe("runSensitivitySweep", () => {
  it("produces correct number of sample points", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "under5", 1_000_000, 10);
    expect(results).toHaveLength(10);
  });

  it("produces results for all 6 charities", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "under5", 1_000_000, 5);
    const charityTypes = CHARITY_CONFIGS.map(c => c.type);
    for (const point of results) {
      for (const charityType of charityTypes) {
        expect(point.charityResults[charityType]).toBeDefined();
        expect(typeof point.charityResults[charityType]).toBe("number");
        expect(Number.isFinite(point.charityResults[charityType])).toBe(true);
      }
    }
  });

  it("sweeps under5 weight from 50 to 200", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "under5", 1_000_000, 5);
    const paramValues = results.map(r => r.paramValue);
    expect(paramValues[0]).toBeCloseTo(50);
    expect(paramValues[paramValues.length - 1]).toBeCloseTo(200);
    // Values should be monotonically increasing
    for (let i = 1; i < paramValues.length; i++) {
      expect(paramValues[i]).toBeGreaterThan(paramValues[i - 1]);
    }
  });

  it("sweeps discount rate from 0 to 0.10", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "discountRate", 1_000_000, 5);
    const paramValues = results.map(r => r.paramValue);
    expect(paramValues[0]).toBeCloseTo(0);
    expect(paramValues[paramValues.length - 1]).toBeCloseTo(0.10);
  });

  it("changing under5 weight actually changes output for mortality-focused charities", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "under5", 1_000_000, 5);
    // AMF results should differ when under5 weight changes
    const firstAmf = results[0].charityResults["amf"];
    const lastAmf = results[results.length - 1].charityResults["amf"];
    expect(firstAmf).not.toBeCloseTo(lastAmf, 1);
  });

  it("changing discount rate actually changes output for GiveDirectly and deworming", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "discountRate", 1_000_000, 5);
    const firstGD = results[0].charityResults["givedirectly"];
    const lastGD = results[results.length - 1].charityResults["givedirectly"];
    expect(firstGD).not.toBeCloseTo(lastGD, 1);

    const firstDW = results[0].charityResults["deworming"];
    const lastDW = results[results.length - 1].charityResults["deworming"];
    expect(firstDW).not.toBeCloseTo(lastDW, 1);
  });

  it("returns the best xBenchmark across country variants for each charity", () => {
    const results = runSensitivitySweep(DEFAULT_MORAL_WEIGHTS, "under5", 1_000_000, 3);
    // Each charity result should be a positive number (the best across countries)
    for (const point of results) {
      for (const val of Object.values(point.charityResults)) {
        expect(val).toBeGreaterThan(0);
      }
    }
  });
});

describe("SensitivityAnalysis component", () => {
  const defaultProps = {
    moralWeights: DEFAULT_MORAL_WEIGHTS,
    grantSize: 1_000_000,
  };

  it("renders the panel with a heading", () => {
    render(<SensitivityAnalysis {...defaultProps} />);
    expect(screen.getByText("Sensitivity analysis")).toBeInTheDocument();
  });

  it("renders a parameter dropdown", () => {
    render(<SensitivityAnalysis {...defaultProps} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("renders an SVG chart", () => {
    render(<SensitivityAnalysis {...defaultProps} />);
    const svg = document.querySelector("svg.sensitivity-chart");
    expect(svg).toBeInTheDocument();
  });

  it("renders a legend with charity names", () => {
    render(<SensitivityAnalysis {...defaultProps} />);
    // Check for at least a few charity abbreviations in legend
    expect(screen.getByText("AMF")).toBeInTheDocument();
    expect(screen.getByText("GD")).toBeInTheDocument();
  });

  it("can change the swept parameter via dropdown", () => {
    render(<SensitivityAnalysis {...defaultProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "discountRate" } });
    // Should still render without errors
    const svg = document.querySelector("svg.sensitivity-chart");
    expect(svg).toBeInTheDocument();
  });
});
