import { describe, it, expect } from "vitest";
import {
  applyMoralWeights,
  getDefaultInputs,
  calculateCharity,
  DEFAULT_MORAL_WEIGHTS,
  type MoralWeights,
} from "./index";

describe("applyMoralWeights", () => {
  describe("AMF", () => {
    it("applies moral weights to AMF inputs", () => {
      const inputs = getDefaultInputs("amf");
      const customWeights: MoralWeights = {
        under5: 150,
        age5to14: 120,
        age15plus: 90,
      };

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("amf");
      if (result.type === "amf") {
        expect(result.inputs.moralWeightUnder5).toBe(150);
        // age5PlusWeight should be (120 + 90) / 2 = 105
        expect(result.inputs.moralWeight5Plus).toBe(105);
      }
    });

    it("changes cost-effectiveness when moral weights change", () => {
      const inputs = getDefaultInputs("amf");

      // Calculate with default weights
      const defaultResult = calculateCharity(
        applyMoralWeights(inputs, DEFAULT_MORAL_WEIGHTS)
      );

      // Calculate with doubled under-5 weight
      const customWeights: MoralWeights = {
        under5: DEFAULT_MORAL_WEIGHTS.under5 * 2,
        age5to14: DEFAULT_MORAL_WEIGHTS.age5to14 * 2,
        age15plus: DEFAULT_MORAL_WEIGHTS.age15plus * 2,
      };
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
      const customWeights: MoralWeights = {
        under5: 200,
        age5to14: 100,
        age15plus: 50,
      };

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
      const customWeights: MoralWeights = {
        under5: 130,
        age5to14: 110,
        age15plus: 80,
      };

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
      const customWeights: MoralWeights = {
        under5: 140,
        age5to14: 100,
        age15plus: 70,
      };

      const result = applyMoralWeights(inputs, customWeights);
      expect(result.type).toBe("new-incentives");
      if (result.type === "new-incentives") {
        expect(result.inputs.moralWeightUnder5).toBe(140);
      }
    });
  });

  describe("All charities", () => {
    it("preserves non-moral-weight inputs", () => {
      const types = ["amf", "malaria-consortium", "helen-keller", "new-incentives"] as const;
      const customWeights: MoralWeights = {
        under5: 150,
        age5to14: 100,
        age15plus: 75,
      };

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
});
