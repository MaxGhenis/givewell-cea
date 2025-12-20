/**
 * Unified charity calculation interface
 *
 * This module provides a unified interface for calculating cost-effectiveness
 * across all GiveWell top charities, despite their different underlying models.
 */

import {
  calculateAMF,
  type AMFInputs,
  BENCHMARK_VALUE_PER_DOLLAR as AMF_BENCHMARK,
} from "./amf";
import {
  calculateMalariaConsortium,
  type MalariaConsortiumInputs,
  BENCHMARK_VALUE_PER_DOLLAR as MC_BENCHMARK,
} from "./malaria-consortium";
import {
  calculateHelenKeller,
  type HelenKellerInputs,
  BENCHMARK_VALUE_PER_DOLLAR as HK_BENCHMARK,
} from "./helen-keller";
import {
  calculateNewIncentives,
  type NewIncentivesInputs,
  BENCHMARK_VALUE_PER_DOLLAR as NI_BENCHMARK,
} from "./new-incentives";

export type CharityType = "amf" | "malaria-consortium" | "helen-keller" | "new-incentives";

export interface UnifiedResults {
  /** Number of children/people reached */
  peopleReached: number;
  /** Number of deaths averted among under-5s */
  deathsAvertedUnder5: number;
  /** Cost per death averted (USD) */
  costPerDeathAverted: number;
  /** Initial cost-effectiveness in multiples of benchmark */
  initialXBenchmark: number;
  /** Final cost-effectiveness in multiples of benchmark */
  finalXBenchmark: number;
  /** The benchmark value used for this charity */
  benchmarkValue: number;
}

export interface CharityConfig {
  name: string;
  abbrev: string;
  type: CharityType;
  color: string;
  description: string;
}

export const CHARITY_CONFIGS: CharityConfig[] = [
  {
    name: "Against Malaria Foundation",
    abbrev: "AMF",
    type: "amf",
    color: "#0D5C63",
    description: "Distributes insecticide-treated bed nets to prevent malaria",
  },
  {
    name: "Malaria Consortium",
    abbrev: "MC",
    type: "malaria-consortium",
    color: "#1B7F79",
    description: "Provides seasonal malaria chemoprevention to children",
  },
  {
    name: "Helen Keller International",
    abbrev: "HKI",
    type: "helen-keller",
    color: "#2A9D8F",
    description: "Delivers vitamin A supplementation to prevent child mortality",
  },
  {
    name: "New Incentives",
    abbrev: "NI",
    type: "new-incentives",
    color: "#48B89F",
    description: "Uses cash incentives to increase childhood vaccination rates",
  },
];

// Default inputs for each charity from GiveWell November 2025 spreadsheets
export const DEFAULT_AMF_INPUTS: AMFInputs = {
  grantSize: 1_000_000,
  costPerUnder5Reached: 15.18872526,
  yearsEffectiveCoverage: 1.965608617,
  malariaMortalityRate: 0.001508254121,
  itnEffectOnDeaths: 0.2402078397,
  moralWeightUnder5: 116.253,
  moralWeight5Plus: 73.19,
  adjustmentOlderMortalities: 0.2969752467,
  adjustmentDevelopmental: 0.6089414816,
  adjustmentProgramBenefits: 0.529,
  adjustmentGrantee: -0.04,
  adjustmentLeverage: -0.008308060237,
  adjustmentFunging: -0.0302403437,
  adjustmentLeverageFungingForCostPerLife: -0.07328863116,
};

export const DEFAULT_MC_INPUTS: MalariaConsortiumInputs = {
  grantSize: 1_000_000,
  costPerChildReached: 6.332845822,
  malariaMortalityRate: 0.004748326636,
  proportionMortalityDuringSeason: 0.7,
  smcEffect: 0.7936949983,
  moralWeightUnder5: 116.25262,
  adjustmentOlderMortalities: 0.06857112185,
  adjustmentDevelopmental: 0.3132874116,
  adjustmentProgramBenefits: 0.191,
  adjustmentGrantee: -0.08,
  adjustmentLeverage: -0.004005444451,
  adjustmentFunging: -0.3963757375,
};

export const DEFAULT_HK_INPUTS: HelenKellerInputs = {
  grantSize: 1_000_000,
  costPerPersonUnder5: 0.7726989139,
  proportionReachedCounterfactual: 0.2,
  mortalityRateUnder5: 0.008000689165,
  vasEffect: 0.0821653677,
  moralWeightUnder5: 118.73259,
  adjustmentDevelopmental: 0.245176,
  adjustmentProgramBenefits: 0.565,
  adjustmentGrantee: -0.04,
  adjustmentLeverage: -0.01067378404,
  adjustmentFunging: -0.3262977865,
};

export const DEFAULT_NI_INPUTS: NewIncentivesInputs = {
  grantSize: 1_000_000,
  costPerChildReached: 18.21258998,
  proportionReachedCounterfactual: 0.8147744577,
  probabilityDeathUnvaccinated: 0.0565350252,
  vaccineEffect: 0.5225560494,
  moralWeightUnder5: 116.25262,
  adjustmentOlderMortalities: 0.1828063546,
  adjustmentDevelopmental: 0.2802178229,
  adjustmentConsumption: 0.04675478943,
  adjustmentProgramBenefits: 0.503,
  adjustmentGrantee: -0.07,
  adjustmentLeverage: -0.04421833055,
  adjustmentFunging: -0.0934652923,
};

export type CharityInputs =
  | { type: "amf"; inputs: AMFInputs }
  | { type: "malaria-consortium"; inputs: MalariaConsortiumInputs }
  | { type: "helen-keller"; inputs: HelenKellerInputs }
  | { type: "new-incentives"; inputs: NewIncentivesInputs };

/**
 * Calculate cost-effectiveness for any charity and return unified results
 */
export function calculateCharity(charity: CharityInputs): UnifiedResults {
  switch (charity.type) {
    case "amf": {
      const results = calculateAMF(charity.inputs);
      return {
        peopleReached: results.peopleUnder5Reached,
        deathsAvertedUnder5: results.deathsAvertedUnder5,
        costPerDeathAverted: results.costPerUnder5DeathAverted,
        initialXBenchmark: results.initialXBenchmark,
        finalXBenchmark: results.finalXBenchmark,
        benchmarkValue: AMF_BENCHMARK,
      };
    }
    case "malaria-consortium": {
      const results = calculateMalariaConsortium(charity.inputs);
      return {
        peopleReached: results.childrenReached,
        deathsAvertedUnder5: results.deathsAvertedUnder5,
        costPerDeathAverted: results.costPerDeathAverted,
        initialXBenchmark: results.initialXBenchmark,
        finalXBenchmark: results.finalXBenchmark,
        benchmarkValue: MC_BENCHMARK,
      };
    }
    case "helen-keller": {
      const results = calculateHelenKeller(charity.inputs);
      return {
        peopleReached: results.peopleUnder5Reached,
        deathsAvertedUnder5: results.deathsAvertedUnder5,
        costPerDeathAverted: results.costPerDeathAverted,
        initialXBenchmark: results.initialXBenchmark,
        finalXBenchmark: results.finalXBenchmark,
        benchmarkValue: HK_BENCHMARK,
      };
    }
    case "new-incentives": {
      const results = calculateNewIncentives(charity.inputs);
      return {
        peopleReached: results.childrenReached,
        deathsAvertedUnder5: results.deathsAvertedUnder5,
        costPerDeathAverted: results.costPerDeathAverted,
        initialXBenchmark: results.initialXBenchmark,
        finalXBenchmark: results.finalXBenchmark,
        benchmarkValue: NI_BENCHMARK,
      };
    }
  }
}

/**
 * Get default inputs for a charity type
 */
export function getDefaultInputs(type: CharityType): CharityInputs {
  switch (type) {
    case "amf":
      return { type: "amf", inputs: { ...DEFAULT_AMF_INPUTS } };
    case "malaria-consortium":
      return { type: "malaria-consortium", inputs: { ...DEFAULT_MC_INPUTS } };
    case "helen-keller":
      return { type: "helen-keller", inputs: { ...DEFAULT_HK_INPUTS } };
    case "new-incentives":
      return { type: "new-incentives", inputs: { ...DEFAULT_NI_INPUTS } };
  }
}
