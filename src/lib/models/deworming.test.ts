import { describe, it, expect } from "vitest";
import {
  calculateDeworming,
  type DewormingInputs,
} from "./deworming";

/**
 * Test data based on GiveWell's deworming cost-effectiveness methodology
 *
 * Key sources:
 * - Miguel & Kremer (2004) and 20-year follow-up (Hamory et al., 2021)
 * - GiveWell September 2023 CEA
 * - GiveWell reports ~16x benchmark overall, ~35x for Kenya
 */

// Base parameters from GiveWell's methodology
// Calibrated to produce ~16x benchmark (GiveWell's approximate estimate)
const baseInputs: DewormingInputs = {
  grantSize: 1_000_000,
  costPerChildTreated: 0.50, // Approximate all-in cost
  roundsPerYear: 1,
  infectionPrevalence: 0.40, // 40% of treated children infected
  incomeEffect: 0.13, // 13% income increase from Miguel & Kremer
  wormBurdenAdjustment: 0.25, // Substantial adjustment for lower worm burden
  benefitDurationYears: 40,
  benefitDecayRate: 0.0, // GiveWell's default (no decay)
  discountRate: 0.04,
  baselineIncome: 800, // PPP USD - higher baseline
  averageAgeAtTreatment: 8,
  ageIncomeBenefitsBegin: 18,
  programAdjustment: 0.75, // 75% program quality
  evidenceAdjustment: 0.50, // 50% confidence in evidence (major source of uncertainty)
};

// Kenya has higher worm burden, so higher cost-effectiveness
const kenyaInputs: DewormingInputs = {
  ...baseInputs,
  wormBurdenAdjustment: 0.8, // Higher worm burden
  infectionPrevalence: 0.60, // Higher prevalence
};

// Lower prevalence region
const lowPrevalenceInputs: DewormingInputs = {
  ...baseInputs,
  wormBurdenAdjustment: 0.3,
  infectionPrevalence: 0.25,
};

describe("Deworming Cost-Effectiveness Model", () => {
  describe("Basic calculations", () => {
    it("calculates children treated correctly", () => {
      const result = calculateDeworming(baseInputs);
      // $1M / $0.50 = 2,000,000 children
      expect(result.childrenTreated).toBe(2_000_000);
    });

    it("calculates children benefiting correctly", () => {
      const result = calculateDeworming(baseInputs);
      // 2M * 0.4 = 800,000 children
      expect(result.childrenBenefiting).toBe(800_000);
    });

    it("calculates positive income gains", () => {
      const result = calculateDeworming(baseInputs);
      expect(result.pvIncomeGainPerChild).toBeGreaterThan(0);
      expect(result.totalPvIncomeGains).toBeGreaterThan(0);
    });
  });

  describe("Cost-effectiveness estimates", () => {
    it("base case should be in reasonable range (10-50x)", () => {
      const result = calculateDeworming(baseInputs);
      // GiveWell estimates ~16x overall, ~35x for Kenya
      // Our calibrated model should be in this range
      expect(result.xBenchmark).toBeGreaterThan(10);
      expect(result.xBenchmark).toBeLessThan(50);
    });

    it("Kenya (high prevalence) should be higher than base", () => {
      const baseResult = calculateDeworming(baseInputs);
      const kenyaResult = calculateDeworming(kenyaInputs);
      expect(kenyaResult.xBenchmark).toBeGreaterThan(baseResult.xBenchmark);
    });

    it("low prevalence should be lower than base", () => {
      const baseResult = calculateDeworming(baseInputs);
      const lowResult = calculateDeworming(lowPrevalenceInputs);
      expect(lowResult.xBenchmark).toBeLessThan(baseResult.xBenchmark);
    });
  });

  describe("Effect of benefit decay", () => {
    it("decay reduces cost-effectiveness", () => {
      const noDecayResult = calculateDeworming({
        ...baseInputs,
        benefitDecayRate: 0,
      });
      const withDecayResult = calculateDeworming({
        ...baseInputs,
        benefitDecayRate: 0.12, // 12% annual decay per HLI critique
      });
      expect(withDecayResult.xBenchmark).toBeLessThan(noDecayResult.xBenchmark);
    });

    it("12% decay reduces CE by substantial amount", () => {
      const noDecayResult = calculateDeworming({
        ...baseInputs,
        benefitDecayRate: 0,
      });
      const withDecayResult = calculateDeworming({
        ...baseInputs,
        benefitDecayRate: 0.12,
      });
      // HLI found 60% reduction; our simplified model should show significant reduction
      const reduction = 1 - withDecayResult.xBenchmark / noDecayResult.xBenchmark;
      expect(reduction).toBeGreaterThan(0.3); // At least 30% reduction
    });
  });

  describe("Sensitivity to key parameters", () => {
    it("lower cost per child increases CE", () => {
      const higherCost = calculateDeworming({
        ...baseInputs,
        costPerChildTreated: 0.75,
      });
      const lowerCost = calculateDeworming({
        ...baseInputs,
        costPerChildTreated: 0.35,
      });
      expect(lowerCost.xBenchmark).toBeGreaterThan(higherCost.xBenchmark);
    });

    it("higher worm burden adjustment increases CE", () => {
      const lowBurden = calculateDeworming({
        ...baseInputs,
        wormBurdenAdjustment: 0.3,
      });
      const highBurden = calculateDeworming({
        ...baseInputs,
        wormBurdenAdjustment: 0.8,
      });
      expect(highBurden.xBenchmark).toBeGreaterThan(lowBurden.xBenchmark);
    });

    it("higher discount rate decreases CE", () => {
      const lowDiscount = calculateDeworming({
        ...baseInputs,
        discountRate: 0.02,
      });
      const highDiscount = calculateDeworming({
        ...baseInputs,
        discountRate: 0.06,
      });
      expect(lowDiscount.xBenchmark).toBeGreaterThan(highDiscount.xBenchmark);
    });
  });
});
