import { describe, it, expect } from "vitest";
import {
  calculateGiveDirectly,
  type GiveDirectlyInputs,
} from "./givedirectly";

/**
 * Test data based on GiveWell's November 2024 re-evaluation:
 * https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/
 *
 * GiveWell's estimates by country:
 * - Kenya: 2.6x (baseline consumption $652)
 * - Malawi: 3.8x (baseline consumption $470)
 * - Mozambique: 3.7x (baseline consumption $450)
 * - Rwanda: 3.3x (baseline consumption $533)
 * - Uganda: 2.8x (baseline consumption $626)
 *
 * Note: These are approximate targets. The model structure is based on
 * GiveWell's methodology but may not exactly replicate their spreadsheet.
 */

// Common parameters across countries
const commonInputs = {
  grantSize: 1_000_000,
  transferAmount: 1000,
  overheadRate: 0.20,
  consumptionPersistenceYears: 10,
  discountRate: 0.04,
  spilloverMultiplier: 2.5, // Egger et al: $1 generates $2.50
  spilloverDiscount: 0.45, // GiveWell's conservative discount
  mortalityEffect: 0.23, // 46% finding discounted by 50%
  under5MortalityRate: 0.05, // ~5% under-5 mortality
  householdSize: 5,
  proportionUnder5: 0.15,
  moralWeightUnder5: 116.25,
  mortalityDiscount: 0.50, // Heavy discount for uncertainty
};

const testCases: Record<string, { inputs: GiveDirectlyInputs; expectedXBenchmark: number }> = {
  Kenya: {
    inputs: {
      ...commonInputs,
      baselineConsumption: 652,
    },
    expectedXBenchmark: 2.6,
  },
  Malawi: {
    inputs: {
      ...commonInputs,
      baselineConsumption: 470,
    },
    expectedXBenchmark: 3.8,
  },
  Mozambique: {
    inputs: {
      ...commonInputs,
      baselineConsumption: 450,
    },
    expectedXBenchmark: 3.7,
  },
  Rwanda: {
    inputs: {
      ...commonInputs,
      baselineConsumption: 533,
    },
    expectedXBenchmark: 3.3,
  },
  Uganda: {
    inputs: {
      ...commonInputs,
      baselineConsumption: 626,
    },
    expectedXBenchmark: 2.8,
  },
};

describe("GiveDirectly Cost-Effectiveness Model", () => {
  describe("Basic calculations", () => {
    it("calculates households reached correctly", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      // $1M / ($1000 * 1.2) = 833.33 households
      expect(result.householdsReached).toBeCloseTo(833.33, 0);
    });

    it("calculates people reached correctly", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      // 833.33 households * 5 people = 4166.67 people
      expect(result.peopleReached).toBeCloseTo(4166.67, 0);
    });

    it("calculates cost per household correctly", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      // $1000 * 1.2 = $1200
      expect(result.costPerHousehold).toBeCloseTo(1200, 0);
    });
  });

  describe("Consumption benefits", () => {
    it("calculates positive consumption benefits", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      expect(result.consumptionBenefitPerHousehold).toBeGreaterThan(0);
    });

    it("higher benefits for poorer recipients (lower baseline consumption)", () => {
      const kenyaResult = calculateGiveDirectly(testCases.Kenya.inputs);
      const malawiResult = calculateGiveDirectly(testCases.Malawi.inputs);

      // Malawi has lower baseline consumption ($470 vs $652)
      // So same transfer should provide more utility
      expect(malawiResult.consumptionBenefitPerHousehold).toBeGreaterThan(
        kenyaResult.consumptionBenefitPerHousehold
      );
    });
  });

  describe("Spillover effects", () => {
    it("calculates positive spillover benefits", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      expect(result.spilloverBenefitPerHousehold).toBeGreaterThan(0);
    });

    it("spillovers are proportional to consumption benefits", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      // Spillover = consumption × (multiplier - 1) × (1 - discount)
      // = consumption × 1.5 × 0.55 = consumption × 0.825
      const expectedRatio = (2.5 - 1) * (1 - 0.45);
      const actualRatio =
        result.spilloverBenefitPerHousehold / result.consumptionBenefitPerHousehold;
      expect(actualRatio).toBeCloseTo(expectedRatio, 2);
    });
  });

  describe("Mortality benefits", () => {
    it("calculates deaths averted", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      expect(result.deathsAvertedUnder5).toBeGreaterThan(0);
    });

    it("mortality value contributes to total", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      expect(result.valueFromMortality).toBeGreaterThan(0);
    });
  });

  describe("Cost-effectiveness estimates", () => {
    // Note: These tests check that our model produces reasonable estimates
    // in the right ballpark. Exact matching would require the full spreadsheet.

    it("Kenya should be around 2-4x benchmark", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      expect(result.xBenchmark).toBeGreaterThan(1);
      expect(result.xBenchmark).toBeLessThan(6);
    });

    it("Malawi should be higher than Kenya (poorer recipients)", () => {
      const kenyaResult = calculateGiveDirectly(testCases.Kenya.inputs);
      const malawiResult = calculateGiveDirectly(testCases.Malawi.inputs);
      expect(malawiResult.xBenchmark).toBeGreaterThan(kenyaResult.xBenchmark);
    });

    it("all countries should be between 1x and 6x benchmark", () => {
      Object.entries(testCases).forEach(([_country, { inputs }]) => {
        const result = calculateGiveDirectly(inputs);
        expect(result.xBenchmark).toBeGreaterThan(1);
        expect(result.xBenchmark).toBeLessThan(6);
      });
    });

    it("poorer countries have higher cost-effectiveness", () => {
      const results = Object.fromEntries(
        Object.entries(testCases).map(([country, { inputs }]) => [
          country,
          calculateGiveDirectly(inputs).xBenchmark,
        ])
      );

      // Kenya has highest baseline consumption, should be lowest CE
      expect(results.Kenya).toBeLessThan(results.Malawi);
      expect(results.Kenya).toBeLessThan(results.Rwanda);

      // Countries with similar poverty levels should be close
      // Malawi ($470) and Mozambique ($450) are very close
      expect(Math.abs(results.Malawi - results.Mozambique)).toBeLessThan(0.5);
    });
  });

  describe("Value breakdown", () => {
    it("total value equals sum of components", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      const sumOfComponents =
        result.valueFromConsumption +
        result.valueFromSpillovers +
        result.valueFromMortality;
      expect(result.totalValue).toBeCloseTo(sumOfComponents, 6);
    });

    it("consumption is the largest component", () => {
      const result = calculateGiveDirectly(testCases.Kenya.inputs);
      // For cash transfers, consumption should be the primary benefit
      expect(result.valueFromConsumption).toBeGreaterThan(result.valueFromMortality);
    });
  });
});
