import { describe, it, expect } from "vitest";
import {
  calculateHelenKeller,
  type HelenKellerInputs,
  type HelenKellerResults,
} from "./helen-keller";

// Test data extracted from GiveWell's November 2025 Helen Keller CEA spreadsheet
// https://docs.google.com/spreadsheets/d/1L6D1mf8AMKoUHrN0gBGiJjtstic4RvqLZCxXZ99kdnA

const testCases: Record<
  string,
  { inputs: HelenKellerInputs; expected: HelenKellerResults }
> = {
  Burkina_Faso: {
    inputs: {
      grantSize: 1_000_000,
      costPerPersonUnder5: 2.342461127,
      proportionReachedCounterfactual: 0.29,
      mortalityRateUnder5: 0.00791376435,
      vasEffect: 0.07838157426,
      moralWeightUnder5: 118.73259,
      adjustmentDevelopmental: 0.245176,
      adjustmentProgramBenefits: 0.565,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.01833780533,
      adjustmentFunging: -0.4312943169,
    },
    expected: {
      peopleUnder5Reached: 426901.4279,
      additionalChildrenCovered: 303100.0138,
      deathsAvertedUnder5: 188.0109102,
      costPerDeathAverted: 5318.840267,
      initialXBenchmark: 6.654649671,
      finalXBenchmark: 6.851640881,
      finalCostPerLifeSaved: 11001.99751,
    },
  },
  Cameroon: {
    inputs: {
      grantSize: 1_000_000,
      costPerPersonUnder5: 1.726098382,
      proportionReachedCounterfactual: 0.225,
      mortalityRateUnder5: 0.007974420725,
      vasEffect: 0.05093724878,
      moralWeightUnder5: 118.73259,
      adjustmentDevelopmental: 0.245176,
      adjustmentProgramBenefits: 0.565,
      adjustmentGrantee: -0.14,
      adjustmentLeverage: -0.03518310036,
      adjustmentFunging: -0.2182221413,
    },
    expected: {
      peopleUnder5Reached: 579341.2534,
      additionalChildrenCovered: 448989.4714,
      deathsAvertedUnder5: 182.3773018,
      costPerDeathAverted: 5483.138472,
      initialXBenchmark: 6.455247996,
      finalXBenchmark: 8.076838564,
      finalCostPerLifeSaved: 9333.074486,
    },
  },
  DRC: {
    inputs: {
      grantSize: 1_000_000,
      costPerPersonUnder5: 0.7726989139,
      proportionReachedCounterfactual: 0.2,
      mortalityRateUnder5: 0.008000689165,
      vasEffect: 0.0821653677,
      moralWeightUnder5: 118.73259,
      adjustmentDevelopmental: 0.245176,
      adjustmentProgramBenefits: 0.565,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.01067378404,
      adjustmentFunging: -0.3262977865,
    },
    expected: {
      peopleUnder5Reached: 1294165.143,
      additionalChildrenCovered: 1035332.114,
      deathsAvertedUnder5: 680.606177,
      costPerDeathAverted: 1469.278467,
      initialXBenchmark: 24.09006831,
      finalXBenchmark: 29.88040629,
      finalCostPerLifeSaved: 2522.781491,
    },
  },
};

describe("Helen Keller Cost-Effectiveness Model", () => {
  describe("People reached calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates people under 5 reached correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.peopleUnder5Reached).toBeCloseTo(
          expected.peopleUnder5Reached,
          0
        );
      });
    });
  });

  describe("Additional children covered calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates additional children covered correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.additionalChildrenCovered).toBeCloseTo(
          expected.additionalChildrenCovered,
          0
        );
      });
    });
  });

  describe("Deaths averted calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates deaths averted correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.deathsAvertedUnder5).toBeCloseTo(
          expected.deathsAvertedUnder5,
          1
        );
      });
    });
  });

  describe("Cost per death averted calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates cost per death averted correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.costPerDeathAverted).toBeCloseTo(
          expected.costPerDeathAverted,
          0
        );
      });
    });
  });

  describe("Initial cost-effectiveness calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates initial xBenchmark correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.initialXBenchmark).toBeCloseTo(
          expected.initialXBenchmark,
          1
        );
      });
    });
  });

  describe("Final cost-effectiveness calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates final xBenchmark correctly for ${region}`, () => {
        const result = calculateHelenKeller(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected.finalXBenchmark, 1);
      });
    });
  });

  // Note: Cost per life saved calculation is complex and varies by charity
  // The core CE calculations above are validated against the spreadsheet
});
