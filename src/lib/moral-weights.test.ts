import { describe, it, expect } from "vitest";
import {
  DEFAULT_MORAL_WEIGHTS,
  MORAL_WEIGHT_PRESETS,
  getAge5PlusMoralWeight,
  scaleMoralWeight,
} from "./moral-weights";

describe("Moral Weights", () => {
  describe("DEFAULT_MORAL_WEIGHTS", () => {
    it("has reasonable default values", () => {
      expect(DEFAULT_MORAL_WEIGHTS.under5).toBeCloseTo(116.25, 1);
      expect(DEFAULT_MORAL_WEIGHTS.age5to14).toBeCloseTo(95.0, 1);
      expect(DEFAULT_MORAL_WEIGHTS.age15plus).toBeCloseTo(73.19, 1);
    });

    it("has higher weight for younger ages", () => {
      expect(DEFAULT_MORAL_WEIGHTS.under5).toBeGreaterThan(
        DEFAULT_MORAL_WEIGHTS.age5to14
      );
      expect(DEFAULT_MORAL_WEIGHTS.age5to14).toBeGreaterThan(
        DEFAULT_MORAL_WEIGHTS.age15plus
      );
    });
  });

  describe("MORAL_WEIGHT_PRESETS", () => {
    it("includes GiveWell Default preset", () => {
      const giveWellPreset = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "GiveWell Default"
      );
      expect(giveWellPreset).toBeDefined();
      expect(giveWellPreset?.weights).toEqual(DEFAULT_MORAL_WEIGHTS);
    });

    it("includes Equal Value preset with same weights for all ages", () => {
      const equalPreset = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "Equal Value"
      );
      expect(equalPreset).toBeDefined();
      expect(equalPreset?.weights.under5).toBe(equalPreset?.weights.age5to14);
      expect(equalPreset?.weights.age5to14).toBe(equalPreset?.weights.age15plus);
    });

    it("includes Child-Focused preset with higher under-5 weight", () => {
      const childFocused = MORAL_WEIGHT_PRESETS.find(
        (p) => p.name === "Child-Focused"
      );
      expect(childFocused).toBeDefined();
      expect(childFocused?.weights.under5).toBeGreaterThan(
        childFocused?.weights.age5to14!
      );
    });
  });

  describe("getAge5PlusMoralWeight", () => {
    it("returns average of 5-14 and 15+ weights", () => {
      const result = getAge5PlusMoralWeight(DEFAULT_MORAL_WEIGHTS);
      const expected =
        (DEFAULT_MORAL_WEIGHTS.age5to14 + DEFAULT_MORAL_WEIGHTS.age15plus) / 2;
      expect(result).toBeCloseTo(expected, 2);
    });

    it("returns correct value for equal weights", () => {
      const equalWeights = { under5: 100, age5to14: 100, age15plus: 100 };
      expect(getAge5PlusMoralWeight(equalWeights)).toBe(100);
    });
  });

  describe("scaleMoralWeight", () => {
    it("scales proportionally to custom weight", () => {
      // If user doubles the under-5 weight, other weights should double too
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
