/**
 * Country-Level Data for GiveWell CEA Models
 *
 * Each charity operates in multiple countries with different:
 * - Costs per person reached
 * - Mortality/disease burden rates
 * - Intervention effectiveness
 * - Leverage and funging adjustments
 *
 * Data extracted from GiveWell's November 2025 CEA spreadsheets.
 */

import type { AMFInputs } from "./amf";
import type { MCInputs } from "./malaria-consortium";
import type { HKInputs } from "./helen-keller";
import type { NIInputs } from "./new-incentives";
import type { GiveDirectlyInputs } from "./givedirectly";
import type { DewormingInputs } from "./deworming";

// ============================================================================
// AMF Country Data
// ============================================================================

export const AMF_COUNTRIES = ["chad", "drc", "nigeria_pmi", "guinea"] as const;
export type AMFCountry = (typeof AMF_COUNTRIES)[number];

export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {
  chad: "Chad",
  drc: "DRC",
  nigeria_pmi: "Nigeria (PMI)",
  guinea: "Guinea",
};

export const AMF_COUNTRY_PARAMS: Record<AMFCountry, Omit<AMFInputs, "grantSize">> = {
  chad: {
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
  },
  drc: {
    costPerUnder5Reached: 26.23829482,
    yearsEffectiveCoverage: 1.192516657,
    malariaMortalityRate: 0.007982855406,
    itnEffectOnDeaths: 0.558318464,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.1494882031,
    adjustmentDevelopmental: 0.4916448888,
    adjustmentProgramBenefits: 0.479,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004114250426,
    adjustmentFunging: -0.1461607338,
    adjustmentLeverageFungingForCostPerLife: -0.2179172422,
  },
  nigeria_pmi: {
    costPerUnder5Reached: 21.92266447,
    yearsEffectiveCoverage: 1.31712103,
    malariaMortalityRate: 0.004797231947,
    itnEffectOnDeaths: 0.5016739686,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.4319031483,
    adjustmentDevelopmental: 0.5069783506,
    adjustmentProgramBenefits: 0.479,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.003159222382,
    adjustmentFunging: -0.1400660492,
    adjustmentLeverageFungingForCostPerLife: -0.2099236337,
  },
  guinea: {
    costPerUnder5Reached: 17.70918353,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.008802499665,
    itnEffectOnDeaths: 0.4600684292,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.1942628175,
    adjustmentDevelopmental: 0.3155709332,
    adjustmentProgramBenefits: 0.379,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001382525591,
    adjustmentFunging: -0.3003019883,
    adjustmentLeverageFungingForCostPerLife: -0.3835720195,
  },
};

// ============================================================================
// Malaria Consortium Country Data
// ============================================================================

export const MC_COUNTRIES = ["burkina_faso", "chad", "cote_divoire"] as const;
export type MCCountry = (typeof MC_COUNTRIES)[number];

export const MC_COUNTRY_NAMES: Record<MCCountry, string> = {
  burkina_faso: "Burkina Faso",
  chad: "Chad",
  cote_divoire: "Cote d'Ivoire",
};

export const MC_COUNTRY_PARAMS: Record<MCCountry, Omit<MCInputs, "grantSize">> = {
  burkina_faso: {
    costPerChildReached: 6.330085089,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004754093567,
    smcEffect: 0.7937,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.06889605587,
    adjustmentDevelopmental: 0.261298284,
    adjustmentProgramBenefits: 0.211,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.005037936798,
    adjustmentFunging: -0.1161207089,
  },
  chad: {
    costPerChildReached: 7.428571429,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004693141034,
    smcEffect: 0.7937,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.0729729247,
    adjustmentDevelopmental: 0.2088227748,
    adjustmentProgramBenefits: 0.241,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.003636695412,
    adjustmentFunging: -0.1003135254,
  },
  cote_divoire: {
    costPerChildReached: 11.45361285,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004221197266,
    smcEffect: 0.7937,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1052689153,
    adjustmentDevelopmental: 0.3714078461,
    adjustmentProgramBenefits: 0.141,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.003512195122,
    adjustmentFunging: -0.1326295825,
  },
};

// ============================================================================
// Helen Keller Country Data
// ============================================================================

export const HK_COUNTRIES = ["burkina_faso", "cameroon", "drc"] as const;
export type HKCountry = (typeof HK_COUNTRIES)[number];

export const HK_COUNTRY_NAMES: Record<HKCountry, string> = {
  burkina_faso: "Burkina Faso",
  cameroon: "Cameroon",
  drc: "DRC",
};

export const HK_COUNTRY_PARAMS: Record<HKCountry, Omit<HKInputs, "grantSize">> = {
  burkina_faso: {
    costPerPersonUnder5: 2.339766082,
    proportionReachedCounterfactual: 0.2856,
    mortalityRateUnder5: 0.007969882519,
    vasEffect: 0.05692666599,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001570098888,
    adjustmentFunging: -0.1428803827,
  },
  cameroon: {
    costPerPersonUnder5: 1.232456,
    proportionReachedCounterfactual: 0.2512,
    mortalityRateUnder5: 0.007115,
    vasEffect: 0.051,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.14,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.12,
  },
  drc: {
    costPerPersonUnder5: 0.7702666312,
    proportionReachedCounterfactual: 0.2,
    mortalityRateUnder5: 0.008,
    vasEffect: 0.082,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.15,
  },
};

// ============================================================================
// New Incentives Country Data (Nigerian States)
// ============================================================================

export const NI_COUNTRIES = ["bauchi", "gombe", "jigawa"] as const;
export type NICountry = (typeof NI_COUNTRIES)[number];

export const NI_COUNTRY_NAMES: Record<NICountry, string> = {
  bauchi: "Bauchi",
  gombe: "Gombe",
  jigawa: "Jigawa",
};

export const NI_COUNTRY_PARAMS: Record<NICountry, Omit<NIInputs, "grantSize">> = {
  bauchi: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.8147,
    probabilityDeathUnvaccinated: 0.0466,
    vaccineEffect: 0.5226,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1828,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.0467,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  gombe: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.88,
    probabilityDeathUnvaccinated: 0.0419,
    vaccineEffect: 0.535,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.175,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.0973,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0025,
    adjustmentFunging: -0.11,
  },
  jigawa: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.8278,
    probabilityDeathUnvaccinated: 0.0632,
    vaccineEffect: 0.5508,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1666,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.065,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0028,
    adjustmentFunging: -0.115,
  },
};

// ============================================================================
// GiveDirectly Country Data
// ============================================================================

export const GD_COUNTRIES = ["kenya", "malawi", "mozambique", "rwanda", "uganda"] as const;
export type GDCountry = (typeof GD_COUNTRIES)[number];

export const GD_COUNTRY_NAMES: Record<GDCountry, string> = {
  kenya: "Kenya",
  malawi: "Malawi",
  mozambique: "Mozambique",
  rwanda: "Rwanda",
  uganda: "Uganda",
};

export const GD_COUNTRY_PARAMS: Record<GDCountry, Omit<GiveDirectlyInputs, "grantSize">> = {
  kenya: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 652,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 5,
    proportionUnder5: 0.15,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  malawi: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 470,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.04,
    householdSize: 5,
    proportionUnder5: 0.16,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  mozambique: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 450,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.07,
    householdSize: 5,
    proportionUnder5: 0.17,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  rwanda: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 533,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.03,
    householdSize: 5,
    proportionUnder5: 0.14,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  uganda: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 626,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.04,
    householdSize: 5,
    proportionUnder5: 0.16,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
};

// ============================================================================
// Deworming Country/Variant Data
// ============================================================================

export const DW_VARIANTS = ["base", "kenya_high", "low_prevalence"] as const;
export type DWVariant = (typeof DW_VARIANTS)[number];

export const DW_VARIANT_NAMES: Record<DWVariant, string> = {
  base: "Base Case",
  kenya_high: "Kenya (High Prevalence)",
  low_prevalence: "Low Prevalence",
};

export const DW_VARIANT_PARAMS: Record<DWVariant, Omit<DewormingInputs, "grantSize">> = {
  base: {
    costPerChildTreated: 0.50,
    roundsPerYear: 1,
    wormBurdenAdjustment: 0.25,
    infectionPrevalence: 0.40,
    incomeEffect: 0.13,
    benefitDurationYears: 40,
    discountRate: 0.04,
    baselineIncome: 800,
    averageAgeAtTreatment: 8,
    ageIncomeBenefitsBegin: 18,
    programAdjustment: 0.75,
    evidenceAdjustment: 0.50,
  },
  kenya_high: {
    costPerChildTreated: 0.50,
    roundsPerYear: 1,
    wormBurdenAdjustment: 0.80,
    infectionPrevalence: 0.60,
    incomeEffect: 0.13,
    benefitDurationYears: 40,
    discountRate: 0.04,
    baselineIncome: 800,
    averageAgeAtTreatment: 8,
    ageIncomeBenefitsBegin: 18,
    programAdjustment: 0.75,
    evidenceAdjustment: 0.50,
  },
  low_prevalence: {
    costPerChildTreated: 0.50,
    roundsPerYear: 1,
    wormBurdenAdjustment: 0.25,
    infectionPrevalence: 0.25,
    incomeEffect: 0.13,
    benefitDurationYears: 40,
    discountRate: 0.04,
    baselineIncome: 800,
    averageAgeAtTreatment: 8,
    ageIncomeBenefitsBegin: 18,
    programAdjustment: 0.75,
    evidenceAdjustment: 0.50,
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

export function getAMFInputsForCountry(country: AMFCountry, grantSize: number = 1_000_000): AMFInputs {
  return { ...AMF_COUNTRY_PARAMS[country], grantSize };
}

export function getMCInputsForCountry(country: MCCountry, grantSize: number = 1_000_000): MCInputs {
  return { ...MC_COUNTRY_PARAMS[country], grantSize };
}

export function getHKInputsForCountry(country: HKCountry, grantSize: number = 1_000_000): HKInputs {
  return { ...HK_COUNTRY_PARAMS[country], grantSize };
}

export function getNIInputsForCountry(country: NICountry, grantSize: number = 1_000_000): NIInputs {
  return { ...NI_COUNTRY_PARAMS[country], grantSize };
}

export function getGDInputsForCountry(country: GDCountry, grantSize: number = 1_000_000): GiveDirectlyInputs {
  return { ...GD_COUNTRY_PARAMS[country], grantSize };
}

export function getDWInputsForVariant(variant: DWVariant, grantSize: number = 1_000_000): DewormingInputs {
  return { ...DW_VARIANT_PARAMS[variant], grantSize };
}
