import { describe, it, expect } from "vitest";
import {
  DEFAULT_MORAL_WEIGHTS,
  MORAL_WEIGHT_PRESETS,
  getAge5PlusMoralWeight,
  scaleMoralWeight,
  getUnder5Weight,
  getWeight,
  type MoralWeights,
} from "./moral-weights";

describe("Moral Weights", () => {
  describe("DEFAULT_MORAL_WEIGHTS", () => {
    it("has reasonable default values for age-based weights", () => {
      expect(DEFAULT_MORAL_WEIGHTS.under5).toBe(117);
      expect(DEFAULT_MORAL_WEIGHTS.age5to14).toBe(130);
      expect(DEFAULT_MORAL_WEIGHTS.age15to49).toBe(95);
      expect(DEFAULT_MORAL_WEIGHTS.age50plus).toBe(45);
    });

    it("has GiveWell's 4% discount rate", () => {
      expect(DEFAULT_MORAL_WEIGHTS.discountRate).toBe(0.04);
    });

    it("has higher weight for younger ages", () => {
      expect(DEFAULT_MORAL_WEIGHTS.age5to14).toBeGreaterThan(
        DEFAULT_MORAL_WEIGHTS.age50plus
      );
    });

    it("has default mode of manual", () => {
      expect(DEFAULT_MORAL_WEIGHTS.mode).toBe("manual");
    });

    it("has multiplier of 1", () => {
      expect(DEFAULT_MORAL_WEIGHTS.multiplier).toBe(1.0);
    });
  });

  describe("MORAL_WEIGHT_PRESETS", () => {
    it("includes GiveWell Default and other presets", () => {
      expect(MORAL_WEIGHT_PRESETS.length).toBeGreaterThanOrEqual(1);
      expect(MORAL_WEIGHT_PRESETS[0].name).toBe("GiveWell Default");
    });

    it("GiveWell Default preset matches DEFAULT_MORAL_WEIGHTS", () => {
      const giveWellPreset = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "GiveWell Default"
      );
      expect(giveWellPreset).toBeDefined();
      expect(giveWellPreset?.weights).toEqual(DEFAULT_MORAL_WEIGHTS);
    });

    it("Equal Lives preset has all weights at 100", () => {
      const equalLives = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "Equal Lives"
      );
      expect(equalLives).toBeDefined();
      expect(equalLives?.weights.under5).toBe(100);
      expect(equalLives?.weights.age50plus).toBe(100);
    });

    it("Lower Discount Rate preset uses 2%", () => {
      const lowerDiscount = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "Lower Discount Rate"
      );
      expect(lowerDiscount).toBeDefined();
      expect(lowerDiscount?.weights.discountRate).toBe(0.02);
    });
  });

  describe("getWeight", () => {
    it("returns base weight in manual mode", () => {
      expect(getWeight(DEFAULT_MORAL_WEIGHTS, "under5")).toBe(117);
      expect(getWeight(DEFAULT_MORAL_WEIGHTS, "age5to14")).toBe(130);
      expect(getWeight(DEFAULT_MORAL_WEIGHTS, "age15to49")).toBe(95);
      expect(getWeight(DEFAULT_MORAL_WEIGHTS, "age50plus")).toBe(45);
    });

    it("applies multiplier in simple mode", () => {
      const simpleWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple",
        multiplier: 2.0,
      };
      expect(getWeight(simpleWeights, "under5")).toBe(234);
      expect(getWeight(simpleWeights, "age5to14")).toBe(260);
    });
  });

  describe("getUnder5Weight", () => {
    it("returns under5 weight", () => {
      expect(getUnder5Weight(DEFAULT_MORAL_WEIGHTS)).toBe(117);
    });

    it("applies multiplier in simple mode", () => {
      const simpleWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple",
        multiplier: 1.5,
      };
      expect(getUnder5Weight(simpleWeights)).toBeCloseTo(117 * 1.5, 1);
    });
  });

  describe("getAge5PlusMoralWeight", () => {
    it("returns weighted average of age 5+ groups", () => {
      // Weights: 5-14 (30%), 15-49 (50%), 50+ (20%)
      // 130 * 0.3 + 95 * 0.5 + 45 * 0.2 = 39 + 47.5 + 9 = 95.5
      expect(getAge5PlusMoralWeight(DEFAULT_MORAL_WEIGHTS)).toBeCloseTo(95.5, 1);
    });

    it("returns 100 for equal weights", () => {
      const equalWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        age5to14: 100,
        age15to49: 100,
        age50plus: 100,
      };
      expect(getAge5PlusMoralWeight(equalWeights)).toBe(100);
    });

    it("applies multiplier in simple mode", () => {
      const simpleWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple",
        multiplier: 2.0,
      };
      expect(getAge5PlusMoralWeight(simpleWeights)).toBeCloseTo(95.5 * 2, 1);
    });
  });

  describe("scaleMoralWeight", () => {
    it("scales proportionally to custom weight", () => {
      const original = 117;
      const customUnder5 = 234; // 2x the default
      const result = scaleMoralWeight(original, customUnder5);
      expect(result).toBeCloseTo(234, 1); // Should be 2x
    });

    it("returns original when custom matches default reference", () => {
      const original = 117;
      const result = scaleMoralWeight(original, 117);
      expect(result).toBeCloseTo(original, 1);
    });

    it("scales down when custom weight is lower", () => {
      const original = 117;
      const customUnder5 = 58.5; // 0.5x the default
      const result = scaleMoralWeight(original, customUnder5);
      expect(result).toBeCloseTo(58.5, 1); // Should be 0.5x
    });
  });
});
