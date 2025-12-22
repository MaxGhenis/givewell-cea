import { describe, it, expect } from "vitest";
import {
  DEFAULT_MORAL_WEIGHTS,
  MORAL_WEIGHT_PRESETS,
  getAge5PlusMoralWeight,
  scaleMoralWeight,
  toLegacyWeights,
  getUnder5Weight,
  type LegacyMoralWeights,
} from "./moral-weights";

describe("Moral Weights", () => {
  describe("DEFAULT_MORAL_WEIGHTS", () => {
    it("has reasonable default values for intervention-specific weights", () => {
      expect(DEFAULT_MORAL_WEIGHTS.under5Malaria).toBeCloseTo(116.25, 1);
      expect(DEFAULT_MORAL_WEIGHTS.under5VitaminA).toBeCloseTo(118.73, 1);
      expect(DEFAULT_MORAL_WEIGHTS.under5Vaccines).toBeCloseTo(116.25, 1);
      expect(DEFAULT_MORAL_WEIGHTS.age5PlusMalaria).toBeCloseTo(73.19, 1);
      expect(DEFAULT_MORAL_WEIGHTS.age5to14).toBeCloseTo(134, 0);
      expect(DEFAULT_MORAL_WEIGHTS.age15to49).toBeCloseTo(104, 0);
      expect(DEFAULT_MORAL_WEIGHTS.age50to74).toBeCloseTo(42, 0);
    });

    it("has GiveWell's 4% discount rate", () => {
      expect(DEFAULT_MORAL_WEIGHTS.discountRate).toBe(0.04);
    });

    it("has higher weight for younger ages in malaria context", () => {
      expect(DEFAULT_MORAL_WEIGHTS.under5Malaria).toBeGreaterThan(
        DEFAULT_MORAL_WEIGHTS.age5PlusMalaria
      );
    });

    it("has default mode of manual", () => {
      expect(DEFAULT_MORAL_WEIGHTS.mode).toBe("manual");
    });

    it("has consumption multiplier of 1", () => {
      expect(DEFAULT_MORAL_WEIGHTS.consumptionMultiplier).toBe(1.0);
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
      expect(equalLives?.weights.under5Malaria).toBe(100);
      expect(equalLives?.weights.age50to74).toBe(100);
    });
  });

  describe("toLegacyWeights", () => {
    it("converts new format to legacy format", () => {
      const legacy = toLegacyWeights(DEFAULT_MORAL_WEIGHTS);
      // Average of 3 under-5 weights
      const expectedUnder5 = (116.25 + 118.73 + 116.25) / 3;
      expect(legacy.under5).toBeCloseTo(expectedUnder5, 1);
      expect(legacy.age5to14).toBe(134);
      // Average of 15-49 and 50-74
      expect(legacy.age15plus).toBeCloseTo((104 + 42) / 2, 1);
      expect(legacy.discountRate).toBe(0.04);
    });

    it("applies consumption multiplier in simple mode", () => {
      const simpleWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple" as const,
        consumptionMultiplier: 2.0,
      };
      const legacy = toLegacyWeights(simpleWeights);
      expect(legacy.under5).toBeCloseTo(116.25 * 2, 1);
      expect(legacy.age5to14).toBeCloseTo(95 * 2, 1);
      expect(legacy.age15plus).toBeCloseTo(73.19 * 2, 1);
    });
  });

  describe("getUnder5Weight", () => {
    it("returns correct weight for each intervention", () => {
      expect(getUnder5Weight(DEFAULT_MORAL_WEIGHTS, "malaria")).toBe(116.25);
      expect(getUnder5Weight(DEFAULT_MORAL_WEIGHTS, "vitaminA")).toBe(118.73);
      expect(getUnder5Weight(DEFAULT_MORAL_WEIGHTS, "vaccines")).toBe(116.25);
      expect(getUnder5Weight(DEFAULT_MORAL_WEIGHTS, "cash")).toBe(116.25);
    });

    it("applies multiplier in simple mode", () => {
      const simpleWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple" as const,
        consumptionMultiplier: 1.5,
      };
      expect(getUnder5Weight(simpleWeights, "malaria")).toBeCloseTo(116.25 * 1.5, 1);
    });
  });

  describe("getAge5PlusMoralWeight", () => {
    it("returns age5PlusMalaria weight for new format", () => {
      const result = getAge5PlusMoralWeight(DEFAULT_MORAL_WEIGHTS);
      expect(result).toBeCloseTo(73.19, 1);
    });

    it("returns average of 5-14 and 15+ for legacy format", () => {
      const legacyWeights: LegacyMoralWeights = {
        under5: 116.25,
        age5to14: 95,
        age15plus: 73.19,
        discountRate: 0.04,
      };
      const result = getAge5PlusMoralWeight(legacyWeights);
      expect(result).toBeCloseTo((95 + 73.19) / 2, 1);
    });

    it("returns correct value for equal weights in legacy format", () => {
      const equalWeights: LegacyMoralWeights = {
        under5: 100,
        age5to14: 100,
        age15plus: 100,
        discountRate: 0.04,
      };
      expect(getAge5PlusMoralWeight(equalWeights)).toBe(100);
    });
  });

  describe("scaleMoralWeight", () => {
    it("scales proportionally to custom weight", () => {
      const original = 116.25;
      const customUnder5 = 232.5; // 2x the default
      const result = scaleMoralWeight(original, customUnder5);
      expect(result).toBeCloseTo(232.5, 1); // Should be 2x
    });

    it("returns original when custom matches default reference", () => {
      const original = 116.25;
      const result = scaleMoralWeight(original, 116.25);
      expect(result).toBeCloseTo(original, 1);
    });

    it("scales down when custom weight is lower", () => {
      const original = 116.25;
      const customUnder5 = 58.125; // 0.5x the default
      const result = scaleMoralWeight(original, customUnder5);
      expect(result).toBeCloseTo(58.125, 1); // Should be 0.5x
    });
  });
});
