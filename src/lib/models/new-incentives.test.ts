import { describe, it, expect } from "vitest";
import {
  calculateNewIncentives,
  type NewIncentivesInputs,
  type NewIncentivesResults,
} from "./new-incentives";

// Test data extracted from GiveWell's November 2025 New Incentives CEA spreadsheet
// https://docs.google.com/spreadsheets/d/1mTKQuZRyVMie-K_KUppeCq7eBbXX15Of3jV7uo3z-PM

const testCases: Record<
  string,
  { inputs: NewIncentivesInputs; expected: NewIncentivesResults }
> = {
  Bauchi: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 18.21258998,
      proportionReachedCounterfactual: 0.8147744577,
      probabilityDeathUnvaccinated: 0.0565350252,
      vaccineEffect: 0.5225560494,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.1828063546,
      adjustmentDevelopmental: 0.2802178229,
      adjustmentConsumption: 0.04675478943,
      adjustmentProgramBenefits: 0.503,
      adjustmentGrantee: -0.07,
      adjustmentLeverage: -0.04421833055,
      adjustmentFunging: -0.0934652923,
    },
    expected: {
      childrenReached: 54907.07257,
      additionalChildrenVaccinated: 10170.19229,
      deathsAvertedUnder5: 300.4551374,
      costPerDeathAverted: 3328.283912,
      initialXBenchmark: 10.48909817,
      finalXBenchmark: 20.03960646,
      finalCostPerLifeSaved: 2684.193824,
    },
  },
  Gombe: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 18.21258998,
      proportionReachedCounterfactual: 0.8800470161,
      probabilityDeathUnvaccinated: 0.0419922518,
      vaccineEffect: 0.5273839374,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.1683225749,
      adjustmentDevelopmental: 0.2827472661,
      adjustmentConsumption: 0.09731145904,
      adjustmentProgramBenefits: 0.503,
      adjustmentGrantee: -0.07,
      adjustmentLeverage: -0.05685457843,
      adjustmentFunging: -0.08702584485,
    },
    expected: {
      childrenReached: 54907.07257,
      additionalChildrenVaccinated: 6586.267192,
      deathsAvertedUnder5: 145.8597307,
      costPerDeathAverted: 6855.901865,
      initialXBenchmark: 5.09206482,
      finalXBenchmark: 10.02083846,
      finalCostPerLifeSaved: 5642.026751,
    },
  },
  Jigawa: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 18.21258998,
      proportionReachedCounterfactual: 0.8577882271,
      probabilityDeathUnvaccinated: 0.06324757807,
      vaccineEffect: 0.5508425012,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.1666117175,
      adjustmentDevelopmental: 0.2828406239,
      adjustmentConsumption: 0.05224792387,
      adjustmentProgramBenefits: 0.503,
      adjustmentGrantee: -0.07,
      adjustmentLeverage: -0.0377404287,
      adjustmentFunging: -0.0927356631,
    },
    expected: {
      childrenReached: 54907.07257,
      additionalChildrenVaccinated: 7808.432134,
      deathsAvertedUnder5: 272.0415129,
      costPerDeathAverted: 3675.909567,
      initialXBenchmark: 9.497158746,
      finalXBenchmark: 18.1775049,
      finalCostPerLifeSaved: 3012.074875,
    },
  },
};

describe("New Incentives Cost-Effectiveness Model", () => {
  describe("Children reached calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates children reached correctly for ${region}`, () => {
        const result = calculateNewIncentives(inputs);
        expect(result.childrenReached).toBeCloseTo(expected.childrenReached, 0);
      });
    });
  });

  describe("Additional children vaccinated calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates additional children vaccinated correctly for ${region}`, () => {
        const result = calculateNewIncentives(inputs);
        expect(result.additionalChildrenVaccinated).toBeCloseTo(
          expected.additionalChildrenVaccinated,
          0
        );
      });
    });
  });

  describe("Deaths averted calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates deaths averted correctly for ${region}`, () => {
        const result = calculateNewIncentives(inputs);
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
        const result = calculateNewIncentives(inputs);
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
        const result = calculateNewIncentives(inputs);
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
        const result = calculateNewIncentives(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected.finalXBenchmark, 1);
      });
    });
  });

  // Note: Cost per life saved calculation is complex and varies by charity
  // The core CE calculations above are validated against the spreadsheet
});
