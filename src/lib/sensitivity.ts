import {
  CHARITY_CONFIGS,
  calculateCharity,
  applyMoralWeights,
  type CharityType,
  type MoralWeights,
  type CharityInputs,
  AMF_COUNTRIES,
  MC_COUNTRIES,
  HK_COUNTRIES,
  NI_COUNTRIES,
  GD_COUNTRIES,
  DW_VARIANTS,
  getAMFInputsForCountry,
  getMCInputsForCountry,
  getHKInputsForCountry,
  getNIInputsForCountry,
  getGDInputsForCountry,
  getDWInputsForVariant,
} from "./models";

export type SweepableParam = "under5" | "age5to14" | "age15to49" | "age50plus" | "discountRate";

export interface SweepPoint {
  paramValue: number;
  charityResults: Record<CharityType, number>;
}

export const PARAM_RANGES: Record<SweepableParam, { min: number; max: number; label: string; format: (v: number) => string }> = {
  under5: { min: 50, max: 200, label: "Under-5 moral weight", format: (v) => v.toFixed(0) },
  age5to14: { min: 50, max: 200, label: "Age 5-14 weight", format: (v) => v.toFixed(0) },
  age15to49: { min: 30, max: 200, label: "Age 15-49 weight", format: (v) => v.toFixed(0) },
  age50plus: { min: 10, max: 150, label: "Age 50+ weight", format: (v) => v.toFixed(0) },
  discountRate: { min: 0, max: 0.10, label: "Discount rate", format: (v) => `${(v * 100).toFixed(1)}%` },
};

function getBestXBenchmark(
  charityType: CharityType,
  moralWeights: MoralWeights,
  grantSize: number
): number {
  let best = -Infinity;

  const compute = (inputs: CharityInputs) => {
    const withWeights = applyMoralWeights(inputs, moralWeights);
    const result = calculateCharity(withWeights);
    if (result.finalXBenchmark > best) best = result.finalXBenchmark;
  };

  switch (charityType) {
    case "amf":
      for (const c of AMF_COUNTRIES) compute({ type: "amf", inputs: getAMFInputsForCountry(c, grantSize) });
      break;
    case "malaria-consortium":
      for (const c of MC_COUNTRIES) compute({ type: "malaria-consortium", inputs: getMCInputsForCountry(c, grantSize) });
      break;
    case "helen-keller":
      for (const c of HK_COUNTRIES) compute({ type: "helen-keller", inputs: getHKInputsForCountry(c, grantSize) });
      break;
    case "new-incentives":
      for (const c of NI_COUNTRIES) compute({ type: "new-incentives", inputs: getNIInputsForCountry(c, grantSize) });
      break;
    case "givedirectly":
      for (const c of GD_COUNTRIES) compute({ type: "givedirectly", inputs: getGDInputsForCountry(c, grantSize) });
      break;
    case "deworming":
      for (const c of DW_VARIANTS) compute({ type: "deworming", inputs: getDWInputsForVariant(c, grantSize) });
      break;
  }

  return best;
}

export function runSensitivitySweep(
  baseMoralWeights: MoralWeights,
  param: SweepableParam,
  grantSize: number,
  numPoints: number = 20
): SweepPoint[] {
  const range = PARAM_RANGES[param];
  const step = (range.max - range.min) / (numPoints - 1);

  const results: SweepPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const paramValue = range.min + step * i;
    const modifiedWeights: MoralWeights = { ...baseMoralWeights, [param]: paramValue };

    const charityResults: Record<string, number> = {};
    for (const config of CHARITY_CONFIGS) {
      charityResults[config.type] = getBestXBenchmark(config.type, modifiedWeights, grantSize);
    }

    results.push({ paramValue, charityResults: charityResults as Record<CharityType, number> });
  }

  return results;
}
