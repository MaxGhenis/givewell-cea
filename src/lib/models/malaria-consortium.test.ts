import { describe, it, expect } from "vitest";
import {
  calculateMalariaConsortium,
  type MalariaConsortiumInputs,
  type MalariaConsortiumResults,
} from "./malaria-consortium";

// Test data extracted from GiveWell's November 2025 Malaria Consortium CEA spreadsheet
// https://docs.google.com/spreadsheets/d/1De3ZnT2Co5ts6Ccm9guWl8Ew31grzrZZwGfPtp-_t50

const testCases: Record<
  string,
  { inputs: MalariaConsortiumInputs; expected: MalariaConsortiumResults }
> = {
  Burkina_Faso: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 6.332845822,
      malariaMortalityRate: 0.004748326636,
      proportionMortalityDuringSeason: 0.7,
      smcEffect: 0.7936949983,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.06857112185,
      adjustmentDevelopmental: 0.3132874116,
      adjustmentProgramBenefits: 0.191,
      adjustmentGrantee: -0.08,
      adjustmentLeverage: -0.004005444451,
      adjustmentFunging: -0.3963757375,
    },
    expected: {
      childrenReached: 157906.8918,
      deathsAvertedUnder5: 416.5751457,
      costPerDeathAverted: 2400.527276,
      initialXBenchmark: 14.43671251,
      finalXBenchmark: 13.31086766,
    },
  },
  Chad: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 7.014881547,
      malariaMortalityRate: 0.004788735461,
      proportionMortalityDuringSeason: 0.7,
      smcEffect: 0.7936949983,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.05499180912,
      adjustmentDevelopmental: 0.2079650431,
      adjustmentProgramBenefits: 0.241,
      adjustmentGrantee: -0.08,
      adjustmentLeverage: -0.005978161521,
      adjustmentFunging: -0.2278305143,
    },
    expected: {
      childrenReached: 142554.0821,
      deathsAvertedUnder5: 379.273228,
      costPerDeathAverted: 2636.621639,
      initialXBenchmark: 13.14398761,
      finalXBenchmark: 14.65302985,
    },
  },
  Cote_dIvoire: {
    inputs: {
      grantSize: 1_000_000,
      costPerChildReached: 11.44972958,
      malariaMortalityRate: 0.004222107914,
      proportionMortalityDuringSeason: 0.7,
      smcEffect: 0.7936949983,
      moralWeightUnder5: 116.25262,
      adjustmentOlderMortalities: 0.1046351707,
      adjustmentDevelopmental: 0.3707863359,
      adjustmentProgramBenefits: 0.141,
      adjustmentGrantee: -0.08,
      adjustmentLeverage: -0.008251293564,
      adjustmentFunging: -0.2369353924,
    },
    expected: {
      childrenReached: 87338.30724,
      deathsAvertedUnder5: 204.8734983,
      costPerDeathAverted: 4881.060794,
      initialXBenchmark: 7.100039034,
      finalXBenchmark: 8.518485599,
    },
  },
};

describe("Malaria Consortium Cost-Effectiveness Model", () => {
  describe("Children reached calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates children reached correctly for ${region}`, () => {
        const result = calculateMalariaConsortium(inputs);
        expect(result.childrenReached).toBeCloseTo(expected.childrenReached, 0);
      });
    });
  });

  describe("Deaths averted calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates deaths averted correctly for ${region}`, () => {
        const result = calculateMalariaConsortium(inputs);
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
        const result = calculateMalariaConsortium(inputs);
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
        const result = calculateMalariaConsortium(inputs);
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
        const result = calculateMalariaConsortium(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected.finalXBenchmark, 1);
      });
    });
  });
});
