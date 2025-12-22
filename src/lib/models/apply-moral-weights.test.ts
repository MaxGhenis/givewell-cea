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
        under5Malaria: 150,
        age5PlusMalaria: 100,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("amf");
      if (result.type === "amf") {
        expect(result.inputs.moralWeightUnder5).toBe(150);
        expect(result.inputs.moralWeight5Plus).toBe(100);
      }
    });

    it("changes cost-effectiveness when moral weights change", () => {
      const inputs = getDefaultInputs("amf");

      // Calculate with default weights
      const defaultResult = calculateCharity(
        applyMoralWeights(inputs, DEFAULT_MORAL_WEIGHTS)
      );

      // Calculate with doubled malaria weights
      const customWeights = createCustomWeights({
        under5Malaria: DEFAULT_MORAL_WEIGHTS.under5Malaria * 2,
        age5PlusMalaria: DEFAULT_MORAL_WEIGHTS.age5PlusMalaria * 2,
      });
      const customResult = calculateCharity(
        applyMoralWeights(inputs, customWeights)
      );

      // Cost-effectiveness should roughly double
      expect(customResult.finalXBenchmark).toBeGreaterThan(
        defaultResult.finalXBenchmark * 1.5
      );
    });
  });

  describe("Malaria Consortium", () => {
    it("applies moral weights to MC inputs", () => {
      const inputs = getDefaultInputs("malaria-consortium");
      const customWeights = createCustomWeights({
        under5Malaria: 200,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("malaria-consortium");
      if (result.type === "malaria-consortium") {
        expect(result.inputs.moralWeightUnder5).toBe(200);
      }
    });
  });

  describe("Helen Keller", () => {
    it("applies moral weights to HK inputs using vitamin A weight", () => {
      const inputs = getDefaultInputs("helen-keller");
      const customWeights = createCustomWeights({
        under5VitaminA: 130,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("helen-keller");
      if (result.type === "helen-keller") {
        expect(result.inputs.moralWeightUnder5).toBe(130);
      }
    });
  });

  describe("New Incentives", () => {
    it("applies moral weights to NI inputs using vaccine weight", () => {
      const inputs = getDefaultInputs("new-incentives");
      const customWeights = createCustomWeights({
        under5Vaccines: 140,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("new-incentives");
      if (result.type === "new-incentives") {
        expect(result.inputs.moralWeightUnder5).toBe(140);
      }
    });
  });

  describe("GiveDirectly", () => {
    it("applies discount rate to GD inputs", () => {
      const inputs = getDefaultInputs("givedirectly");
      const customWeights = createCustomWeights({
        discountRate: 0.02,
      });

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("givedirectly");
      if (result.type === "givedirectly") {
        expect(result.inputs.discountRate).toBe(0.02);
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
        under5Malaria: 150,
        under5VitaminA: 150,
        under5Vaccines: 150,
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
    it("applies consumption multiplier in simple mode", () => {
      const inputs = getDefaultInputs("amf");
      const simpleWeights: MoralWeights = {
        ...DEFAULT_MORAL_WEIGHTS,
        mode: "simple",
        consumptionMultiplier: 2.0,
      };

      const result = applyMoralWeights(inputs, simpleWeights);
      if (result.type === "amf") {
        // Should apply 2x multiplier to default malaria weight
        expect(result.inputs.moralWeightUnder5).toBeCloseTo(116.25 * 2, 1);
      }
    });
  });
});
