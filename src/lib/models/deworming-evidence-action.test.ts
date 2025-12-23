import { describe, it, expect } from "vitest";
import {
  calculateDewormingEvidenceAction,
  type DewormingEvidenceActionInputs,
  type DewormingEvidenceActionResults,
} from "./deworming-evidence-action";

// Test data extracted from GiveWell's Deworming CEA spreadsheet (Deworm the World sheet)
// Data source: data/givewell-spreadsheets/deworming.xlsx

const testCases: Record<
  string,
  { inputs: DewormingEvidenceActionInputs; expected: DewormingEvidenceActionResults }
> = {
  Kenya: {
    inputs: {
      grantSize: 100000,
      costPerChildPerYear: 0.64757,
      percentageCostsDtW: 0.6082843,
      wormBurdenAdjustment: 0.20523514303046,
      pvBenefitsLnConsumption: 0.04233400171,
      valueLnConsumptionUnit: 1.442695041,
      charityAdjustmentFactor: 0.91,
      interventionAdjustmentFactor: 1.073,
      leverageFungingPercentChange: 0.2557848955,
    },
    expected: {
      childrenDewormedPerYear: 253867.246,
      unitsValuePerYearDeworming: 0.06107505433,
      totalUnitsValueInitial: 15504.95584,
      unitsValuePerDollarInitial: 0.09431421211,
      initialXBenchmark: 28.11544429,
      xBenchmarkAfterCharityAdj: 25.5850543,
      xBenchmarkAfterInterventionAdj: 27.45276327,
      finalXBenchmark: 34.47476545,
    },
  },
  "Azad Jammu and Kashmir, Pakistan": {
    inputs: {
      grantSize: 100000,
      costPerChildPerYear: 0.74247,
      percentageCostsDtW: 0.4014779,
      wormBurdenAdjustment: 0.0355752,
      pvBenefitsLnConsumption: 0.00733812229,
      valueLnConsumptionUnit: 1.442695041,
      charityAdjustmentFactor: 0.91,
      interventionAdjustmentFactor: 1.073,
      leverageFungingPercentChange: 0.1579093422,
    },
    expected: {
      childrenDewormedPerYear: 335474.4471,
      unitsValuePerYearDeworming: 0.01058667264,
      totalUnitsValueInitial: 3551.55815,
      unitsValuePerDollarInitial: 0.01425872108,
      initialXBenchmark: 4.250581849,
      xBenchmarkAfterCharityAdj: 3.868029483,
      xBenchmarkAfterInterventionAdj: 4.150395635,
      finalXBenchmark: 4.805781879,
    },
  },
  "Gilgit-Baltistan, Pakistan": {
    inputs: {
      grantSize: 100000,
      costPerChildPerYear: 0.74247,
      percentageCostsDtW: 0.4014779,
      wormBurdenAdjustment: 0.1264055,
      pvBenefitsLnConsumption: 0.02607375411,
      valueLnConsumptionUnit: 1.442695041,
      charityAdjustmentFactor: 0.91,
      interventionAdjustmentFactor: 1.073,
      leverageFungingPercentChange: 0.1983918901,
    },
    expected: {
      childrenDewormedPerYear: 335474.4471,
      unitsValuePerYearDeworming: 0.03761647575,
      totalUnitsValueInitial: 12619.3664,
      unitsValuePerDollarInitial: 0.05066396723,
      initialXBenchmark: 15.1031315,
      xBenchmarkAfterCharityAdj: 13.74384967,
      xBenchmarkAfterInterventionAdj: 14.7471507,
      finalXBenchmark: 17.6728658,
    },
  },
  "Lagos, Nigeria": {
    inputs: {
      grantSize: 100000,
      costPerChildPerYear: 0.75506,
      percentageCostsDtW: 0.6735345,
      wormBurdenAdjustment: 0.0700532622286556,
      pvBenefitsLnConsumption: 0.01444993718,
      valueLnConsumptionUnit: 1.442695041,
      charityAdjustmentFactor: 0.87,
      interventionAdjustmentFactor: 1.073,
      leverageFungingPercentChange: 0.1612619753,
    },
    expected: {
      childrenDewormedPerYear: 196634.0345,
      unitsValuePerYearDeworming: 0.02084685271,
      totalUnitsValueInitial: 4099.200754,
      unitsValuePerDollarInitial: 0.0276095313,
      initialXBenchmark: 8.230511838,
      xBenchmarkAfterCharityAdj: 7.160545299,
      xBenchmarkAfterInterventionAdj: 7.683265106,
      finalXBenchmark: 8.922283614,
    },
  },
};

describe("Deworming (Evidence Action) Cost-Effectiveness Model", () => {
  describe("Children dewormed calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates children dewormed per year correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.childrenDewormedPerYear).toBeCloseTo(
          expected.childrenDewormedPerYear,
          1
        );
      });
    });
  });

  describe("Units of value per year of deworming", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates units of value per year of deworming correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.unitsValuePerYearDeworming).toBeCloseTo(
          expected.unitsValuePerYearDeworming,
          6
        );
      });
    });
  });

  describe("Initial value generation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates total units of value (initial) correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.totalUnitsValueInitial).toBeCloseTo(
          expected.totalUnitsValueInitial,
          1
        );
      });
    });
  });

  describe("Initial cost-effectiveness calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates initial xBenchmark correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.initialXBenchmark).toBeCloseTo(
          expected.initialXBenchmark,
          2
        );
      });
    });
  });

  describe("Charity-level adjustments", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates xBenchmark after charity adjustments correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.xBenchmarkAfterCharityAdj).toBeCloseTo(
          expected.xBenchmarkAfterCharityAdj,
          2
        );
      });
    });
  });

  describe("Intervention-level adjustments", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates xBenchmark after intervention adjustments correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.xBenchmarkAfterInterventionAdj).toBeCloseTo(
          expected.xBenchmarkAfterInterventionAdj,
          2
        );
      });
    });
  });

  describe("Final cost-effectiveness calculation", () => {
    Object.entries(testCases).forEach(([region, { inputs, expected }]) => {
      it(`calculates final xBenchmark correctly for ${region}`, () => {
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(
          expected.finalXBenchmark,
          2
        );
      });
    });
  });
});
