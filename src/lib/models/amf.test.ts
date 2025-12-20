import { describe, it, expect } from "vitest";
import { calculateAMF, type AMFInputs, type AMFResults } from "./amf";

// Test data extracted from GiveWell's November 2025 AMF CEA spreadsheet
// https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc

const testCases: Record<string, { inputs: AMFInputs; expected: AMFResults }> = {
  Chad: {
    inputs: {
      grantSize: 1_000_000,
      costPerUnder5Reached: 15.18872526,
      yearsEffectiveCoverage: 1.965608617,
      malariaMortalityRate: 0.001508254121,
      itnEffectOnDeaths: 0.2402078397,
      moralWeightUnder5: 116.253,
      moralWeight5Plus: 73.19,
      adjustmentOlderMortalities: 0.2969752467,
      adjustmentDevelopmental: 0.6089414816,
      adjustmentProgramBenefits: 0.529,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.008308060237,
      adjustmentFunging: -0.0302403437,
      adjustmentLeverageFungingForCostPerLife: -0.07328863116,
    },
    expected: {
      peopleUnder5Reached: 65838.30986,
      deathsAvertedUnder5: 46.8853777,
      costPerUnder5DeathAverted: 21328.61137,
      initialXBenchmark: 1.6368012,
      finalXBenchmark: 4.820299402,
      finalCostPerLifeSaved: 15638.66725,
    },
  },
  DRC: {
    inputs: {
      grantSize: 1_000_000,
      costPerUnder5Reached: 26.23829482,
      yearsEffectiveCoverage: 1.192516657,
      malariaMortalityRate: 0.007982855406,
      itnEffectOnDeaths: 0.558318464,
      moralWeightUnder5: 116.253,
      moralWeight5Plus: 73.19,
      adjustmentOlderMortalities: 0.1494882031,
      adjustmentDevelopmental: 0.4916448888,
      adjustmentProgramBenefits: 0.479,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.004114250426,
      adjustmentFunging: -0.1461607338,
      adjustmentLeverageFungingForCostPerLife: -0.2179172422,
    },
    expected: {
      peopleUnder5Reached: 38112.23279,
      deathsAvertedUnder5: 202.5671883,
      costPerUnder5DeathAverted: 4936.633659,
      initialXBenchmark: 7.071761672,
      finalXBenchmark: 14.62902526,
      finalCostPerLifeSaved: 5100.994521,
    },
  },
  Nigeria_PMI: {
    inputs: {
      grantSize: 1_000_000,
      costPerUnder5Reached: 21.92266447,
      yearsEffectiveCoverage: 1.31712103,
      malariaMortalityRate: 0.004797231947,
      itnEffectOnDeaths: 0.5016739686,
      moralWeightUnder5: 116.253,
      moralWeight5Plus: 73.19,
      adjustmentOlderMortalities: 0.4319031483,
      adjustmentDevelopmental: 0.5069783506,
      adjustmentProgramBenefits: 0.479,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.003159222382,
      adjustmentFunging: -0.1400660492,
      adjustmentLeverageFungingForCostPerLife: -0.2099236337,
    },
    expected: {
      peopleUnder5Reached: 45614.89327,
      deathsAvertedUnder5: 144.5921218,
      costPerUnder5DeathAverted: 6916.006123,
      initialXBenchmark: 5.04781171,
      finalXBenchmark: 13.25042655,
      finalCostPerLifeSaved: 5191.904725,
    },
  },
  Guinea: {
    inputs: {
      grantSize: 1_000_000,
      costPerUnder5Reached: 17.70918353,
      yearsEffectiveCoverage: 1.965608617,
      malariaMortalityRate: 0.008802499665,
      itnEffectOnDeaths: 0.4600684292,
      moralWeightUnder5: 116.253,
      moralWeight5Plus: 73.19,
      adjustmentOlderMortalities: 0.1942628175,
      adjustmentDevelopmental: 0.3155709332,
      adjustmentProgramBenefits: 0.379,
      adjustmentGrantee: -0.04,
      adjustmentLeverage: -0.001382525591,
      adjustmentFunging: -0.3003019883,
      adjustmentLeverageFungingForCostPerLife: -0.4218399916,
    },
    expected: {
      peopleUnder5Reached: 56467.87714,
      deathsAvertedUnder5: 449.4971659,
      costPerUnder5DeathAverted: 2224.708132,
      initialXBenchmark: 15.69225922,
      finalXBenchmark: 22.79223041,
      finalCostPerLifeSaved: 2940.580429,
    },
  },
};

describe("AMF Cost-Effectiveness Model", () => {
  describe("People reached calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates people under 5 reached correctly for ${region}`, () => {
        const result = calculateAMF(inputs);
        expect(result.peopleUnder5Reached).toBeCloseTo(
          expected.peopleUnder5Reached,
          0
        );
      });
    });
  });

  describe("Deaths averted calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates deaths averted correctly for ${region}`, () => {
        const result = calculateAMF(inputs);
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
        const result = calculateAMF(inputs);
        expect(result.costPerUnder5DeathAverted).toBeCloseTo(
          expected.costPerUnder5DeathAverted,
          0
        );
      });
    });
  });

  describe("Initial cost-effectiveness calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates initial xBenchmark correctly for ${region}`, () => {
        const result = calculateAMF(inputs);
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
        const result = calculateAMF(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected.finalXBenchmark, 1);
      });
    });
  });

  describe("Final cost per life saved", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates final cost per life saved correctly for ${region}`, () => {
        const result = calculateAMF(inputs);
        expect(result.finalCostPerLifeSaved).toBeCloseTo(
          expected.finalCostPerLifeSaved,
          0
        );
      });
    });
  });
});
