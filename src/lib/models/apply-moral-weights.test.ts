import { describe, it, expect } from "vitest";
import {
  applyMoralWeights,
  getDefaultInputs,
  calculateCharity,
  DEFAULT_MORAL_WEIGHTS,
  type MoralWeights,
} from "./index";

// Helper to create a custom MoralWeights object
function createCustomWeights(overrides: Partial<MoralWeights> = {}): MoralWeights {
  return {
    ...DEFAULT_MORAL_WEIGHTS,
    ...overrides,
  };
}

describe("applyMoralWeights", () => {
  describe("AMF", () => {
    it("applies moral weights to AMF inputs", () => {
      const inputs = getDefaultInputs("amf");
      const customWeights = createCustomWeights({
        under5: 150,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("amf");
      if (result.type === "amf") {
        expect(result.inputs.moralWeightUnder5).toBe(150);
        // age5Plus is weighted average: 130*0.3 + 95*0.5 + 45*0.2 = 95.5
        expect(result.inputs.moralWeight5Plus).toBeCloseTo(95.5, 1);
      }
    });

    it("changes cost-effectiveness when moral weights change", () => {
      const inputs = getDefaultInputs("amf");

      // Calculate with default weights
      const defaultResult = calculateCharity(
        applyMoralWeights(inputs, DEFAULT_MORAL_WEIGHTS)
      );

      // Calculate with doubled under5 weight
      const customWeights = createCustomWeights({
        under5: DEFAULT_MORAL_WEIGHTS.under5 * 2,
      });
      const customResult = calculateCharity(
        applyMoralWeights(inputs, customWeights)
      );

      // Cost-effectiveness should increase (though not necessarily double due to other factors)
      expect(customResult.finalXBenchmark).toBeGreaterThan(
        defaultResult.finalXBenchmark * 1.5
      );
    });
  });

  describe("Malaria Consortium", () => {
    it("applies moral weights to MC inputs", () => {
      const inputs = getDefaultInputs("malaria-consortium");
      const customWeights = createCustomWeights({
        under5: 200,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("malaria-consortium");
      if (result.type === "malaria-consortium") {
        expect(result.inputs.moralWeightUnder5).toBe(200);
      }
    });
  });

  describe("Helen Keller", () => {
    it("applies moral weights to HK inputs", () => {
      const inputs = getDefaultInputs("helen-keller");
      const customWeights = createCustomWeights({
        under5: 130,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("helen-keller");
      if (result.type === "helen-keller") {
        expect(result.inputs.moralWeightUnder5).toBe(130);
      }
    });
  });

  describe("New Incentives", () => {
    it("applies moral weights to NI inputs", () => {
      const inputs = getDefaultInputs("new-incentives");
      const customWeights = createCustomWeights({
        under5: 140,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("new-incentives");
      if (result.type === "new-incentives") {
        expect(result.inputs.moralWeightUnder5).toBe(140);
      }
    });
  });

  describe("GiveDirectly", () => {
    it("applies discount rate and moral weight to GD inputs", () => {
      const inputs = getDefaultInputs("givedirectly");
      const customWeights = createCustomWeights({
        discountRate: 0.02,
        under5: 150,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("givedirectly");
      if (result.type === "givedirectly") {
        expect(result.inputs.discountRate).toBe(0.02);
        expect(result.inputs.moralWeightUnder5).toBe(150);
      }
    });
  });

  describe("Deworming", () => {
    it("applies discount rate to deworming inputs", () => {
      const inputs = getDefaultInputs("deworming");
      const customWeights = createCustomWeights({
        discountRate: 0.02,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("deworming");
      if (result.type === "deworming") {
        expect(result.inputs.discountRate).toBe(0.02);
      }
    });
  });

  describe("All charities", () => {
    it("preserves non-moral-weight inputs", () => {
      const types = ["amf", "malaria-consortium", "helen-keller", "new-incentives"] as const;
      const customWeights = createCustomWeights({
        under5: 150,
      });

      for (const type of types) {
        const original = getDefaultInputs(type);
        const modified = applyMoralWeights(original, customWeights);

        // Grant size should be preserved
        if (original.type === "amf" && modified.type === "amf") {
          expect(modified.inputs.grantSize).toBe(original.inputs.grantSize);
        }
      }
    });
  });

  describe("Simple mode", () => {
    it("applies multiplier in simple mode", () => {
      const inputs = getDefaultInputs("amf");
      const simpleWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple",
        multiplier: 2.0,
      };

      const result = applyMoralWeights(inputs, simpleWeights);
      if (result.type === "amf") {
        // Should apply 2x multiplier to default under5 weight (117)
        expect(result.inputs.moralWeightUnder5).toBeCloseTo(117 * 2, 1);
      }
    });
  });

  describe("Age 5+ weighted average", () => {
    it("calculates correct weighted average for ages 5+", () => {
      const inputs = getDefaultInputs("amf");
      const customWeights = createCustomWeights({
        age5to14: 100,
        age15to49: 80,
        age50plus: 40,
      });

      const result = applyMoralWeights(inputs, customWeights);
      if (result.type === "amf") {
        // Weighted avg: 100*0.3 + 80*0.5 + 40*0.2 = 30 + 40 + 8 = 78
        expect(result.inputs.moralWeight5Plus).toBeCloseTo(78, 1);
      }
    });
  });
});
