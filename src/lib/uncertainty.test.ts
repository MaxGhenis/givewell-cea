import { describe, it, expect } from "vitest";
import {
  sampleLogNormal,
  sampleTruncatedNormal,
  percentile,
  standardDeviation,
  runMonteCarloSimulation,
  createHistogram,
} from "./uncertainty";

describe("Uncertainty Analysis", () => {
  describe("sampleLogNormal", () => {
    it("returns values around the median", () => {
      const samples: number[] = [];
      for (let i = 0; i < 1000; i++) {
        samples.push(sampleLogNormal(100, 80, 125));
      }
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      // Mean should be close to median (within 30%)
      expect(mean).toBeGreaterThan(70);
      expect(mean).toBeLessThan(150);
    });

    it("produces positive values", () => {
      for (let i = 0; i < 100; i++) {
        const sample = sampleLogNormal(100, 80, 125);
        expect(sample).toBeGreaterThan(0);
      }
    });

    it("respects the uncertainty range roughly", () => {
      const samples: number[] = [];
      for (let i = 0; i < 1000; i++) {
        samples.push(sampleLogNormal(100, 50, 200));
      }
      samples.sort((a, b) => a - b);

      // Check that most values fall within a reasonable range
      const p10 = percentile(samples, 0.1);
      const p90 = percentile(samples, 0.9);

      // Should be roughly in the specified range (with some tolerance)
      expect(p10).toBeGreaterThan(30);
      expect(p90).toBeLessThan(300);
    });
  });

  describe("sampleTruncatedNormal", () => {
    it("returns values within bounds", () => {
      for (let i = 0; i < 100; i++) {
        const sample = sampleTruncatedNormal(0.5, 0.2, 0, 1);
        expect(sample).toBeGreaterThanOrEqual(0);
        expect(sample).toBeLessThanOrEqual(1);
      }
    });

    it("centers around the mean", () => {
      const samples: number[] = [];
      for (let i = 0; i < 1000; i++) {
        samples.push(sampleTruncatedNormal(0.5, 0.1, 0, 1));
      }
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      expect(mean).toBeCloseTo(0.5, 1);
    });
  });

  describe("percentile", () => {
    it("returns correct percentiles for simple array", () => {
      const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(percentile(sorted, 0.5)).toBe(5.5); // Median
      expect(percentile(sorted, 0)).toBe(1); // Min
      expect(percentile(sorted, 1)).toBe(10); // Max
    });

    it("interpolates correctly", () => {
      const sorted = [0, 100];
      expect(percentile(sorted, 0.25)).toBe(25);
      expect(percentile(sorted, 0.5)).toBe(50);
      expect(percentile(sorted, 0.75)).toBe(75);
    });

    it("handles empty array", () => {
      expect(percentile([], 0.5)).toBe(0);
    });
  });

  describe("standardDeviation", () => {
    it("returns 0 for single value", () => {
      expect(standardDeviation([5], 5)).toBe(0);
    });

    it("calculates correctly for known values", () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sd = standardDeviation(values, mean);
      expect(sd).toBeCloseTo(2, 0);
    });
  });

  describe("runMonteCarloSimulation", () => {
    it("runs correct number of simulations", () => {
      const result = runMonteCarloSimulation(
        500,
        () => ({ value: 100 }),
        (p) => p.value + (Math.random() - 0.5) * 20
      );
      expect(result.samples.length).toBe(500);
      expect(result.numSimulations).toBe(500);
    });

    it("calculates statistics correctly", () => {
      // Use deterministic values for testing
      let callCount = 0;
      const result = runMonteCarloSimulation(
        100,
        () => ({ index: callCount++ }),
        (p) => p.index // Returns 0, 1, 2, ..., 99
      );

      expect(result.mean).toBeCloseTo(49.5, 1);
      expect(result.median).toBeCloseTo(49.5, 1);
      expect(result.percentile5).toBeLessThan(10);
      expect(result.percentile95).toBeGreaterThan(90);
    });

    it("filters out invalid values", () => {
      const result = runMonteCarloSimulation(
        100,
        () => ({}),
        () => (Math.random() > 0.5 ? 10 : NaN)
      );
      // All samples should be valid (10)
      expect(result.samples.every((s) => s === 10)).toBe(true);
    });
  });

  describe("createHistogram", () => {
    it("creates correct number of bins", () => {
      const samples = Array.from({ length: 100 }, (_, i) => i);
      const histogram = createHistogram(samples, 10);
      expect(histogram.length).toBe(10);
    });

    it("counts samples in bins correctly", () => {
      const samples = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const histogram = createHistogram(samples, 5);
      // Each bin should have 2 samples
      expect(histogram.every((b) => b.count === 2)).toBe(true);
    });

    it("calculates percentages correctly", () => {
      const samples = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const histogram = createHistogram(samples, 5);
      // Each bin should have 20% of samples
      expect(histogram.every((b) => b.percentage === 20)).toBe(true);
    });

    it("handles empty array", () => {
      const histogram = createHistogram([]);
      expect(histogram.length).toBe(0);
    });
  });
});
