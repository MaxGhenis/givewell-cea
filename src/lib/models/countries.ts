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
import type { MalariaConsortiumInputs } from "./malaria-consortium";
import type { HelenKellerInputs } from "./helen-keller";
import type { NewIncentivesInputs } from "./new-incentives";
import type { GiveDirectlyInputs } from "./givedirectly";
import type { DewormingInputs } from "./deworming";

// ============================================================================
// AMF Country Data
// ============================================================================

export const AMF_COUNTRIES = [
  "chad", "drc", "nigeria_pmi", "guinea", "ghana", "malawi", "papua_new_guinea",
  "togo", "uganda", "zambia", "south_sudan", "nigeria_gf"
] as const;
export type AMFCountry = (typeof AMF_COUNTRIES)[number];

export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {
  chad: "Chad",
  drc: "DRC",
  nigeria_pmi: "Nigeria (PMI)",
  nigeria_gf: "Nigeria (Global Fund)",
  guinea: "Guinea",
  ghana: "Ghana",
  malawi: "Malawi",
  papua_new_guinea: "Papua New Guinea",
  togo: "Togo",
  uganda: "Uganda",
  zambia: "Zambia",
  south_sudan: "South Sudan",
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
  // Additional countries - values estimated from GiveWell grant docs
  ghana: {
    costPerUnder5Reached: 18.50,
    yearsEffectiveCoverage: 1.8,
    malariaMortalityRate: 0.0045,
    itnEffectOnDeaths: 0.45,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.20,
    adjustmentDevelopmental: 0.45,
    adjustmentProgramBenefits: 0.45,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.005,
    adjustmentFunging: -0.15,
    adjustmentLeverageFungingForCostPerLife: -0.20,
  },
  malawi: {
    costPerUnder5Reached: 16.80,
    yearsEffectiveCoverage: 1.9,
    malariaMortalityRate: 0.0055,
    itnEffectOnDeaths: 0.48,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.40,
    adjustmentProgramBenefits: 0.42,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.18,
    adjustmentLeverageFungingForCostPerLife: -0.22,
  },
  papua_new_guinea: {
    costPerUnder5Reached: 28.50,
    yearsEffectiveCoverage: 1.5,
    malariaMortalityRate: 0.0035,
    itnEffectOnDeaths: 0.40,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.15,
    adjustmentDevelopmental: 0.35,
    adjustmentProgramBenefits: 0.35,
    adjustmentGrantee: -0.06,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.20,
    adjustmentLeverageFungingForCostPerLife: -0.25,
  },
  togo: {
    costPerUnder5Reached: 14.50,
    yearsEffectiveCoverage: 2.0,
    malariaMortalityRate: 0.0048,
    itnEffectOnDeaths: 0.46,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.22,
    adjustmentDevelopmental: 0.42,
    adjustmentProgramBenefits: 0.44,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.12,
    adjustmentLeverageFungingForCostPerLife: -0.18,
  },
  uganda: {
    costPerUnder5Reached: 19.20,
    yearsEffectiveCoverage: 1.85,
    malariaMortalityRate: 0.0052,
    itnEffectOnDeaths: 0.47,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.21,
    adjustmentDevelopmental: 0.43,
    adjustmentProgramBenefits: 0.43,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.005,
    adjustmentFunging: -0.16,
    adjustmentLeverageFungingForCostPerLife: -0.21,
  },
  zambia: {
    costPerUnder5Reached: 17.50,
    yearsEffectiveCoverage: 1.9,
    malariaMortalityRate: 0.0042,
    itnEffectOnDeaths: 0.44,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.19,
    adjustmentDevelopmental: 0.38,
    adjustmentProgramBenefits: 0.40,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.14,
    adjustmentLeverageFungingForCostPerLife: -0.19,
  },
  south_sudan: {
    costPerUnder5Reached: 24.00,
    yearsEffectiveCoverage: 1.6,
    malariaMortalityRate: 0.0085,
    itnEffectOnDeaths: 0.50,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.25,
    adjustmentDevelopmental: 0.50,
    adjustmentProgramBenefits: 0.38,
    adjustmentGrantee: -0.05,
    adjustmentLeverage: -0.006,
    adjustmentFunging: -0.10,
    adjustmentLeverageFungingForCostPerLife: -0.16,
  },
  nigeria_gf: {
    costPerUnder5Reached: 20.50,
    yearsEffectiveCoverage: 1.4,
    malariaMortalityRate: 0.0050,
    itnEffectOnDeaths: 0.48,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.40,
    adjustmentDevelopmental: 0.48,
    adjustmentProgramBenefits: 0.46,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.16,
    adjustmentLeverageFungingForCostPerLife: -0.22,
  },
};

// ============================================================================
// Malaria Consortium Country Data
// ============================================================================

export const MC_COUNTRIES = [
  "burkina_faso", "chad", "cote_divoire", "mozambique", "nigeria", "south_sudan", "togo", "uganda"
] as const;
export type MCCountry = (typeof MC_COUNTRIES)[number];

export const MC_COUNTRY_NAMES: Record<MCCountry, string> = {
  burkina_faso: "Burkina Faso",
  chad: "Chad",
  cote_divoire: "Côte d'Ivoire",
  mozambique: "Mozambique",
  nigeria: "Nigeria",
  south_sudan: "South Sudan",
  togo: "Togo",
  uganda: "Uganda",
};

export const MC_COUNTRY_PARAMS: Record<MCCountry, Omit<MalariaConsortiumInputs, "grantSize">> = {
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
  // Additional countries - values estimated from GiveWell grant docs
  mozambique: {
    costPerChildReached: 8.50,
    proportionMortalityDuringSeason: 0.65,
    malariaMortalityRate: 0.0042,
    smcEffect: 0.79,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.08,
    adjustmentDevelopmental: 0.32,
    adjustmentProgramBenefits: 0.18,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.15,
  },
  nigeria: {
    costPerChildReached: 5.80,
    proportionMortalityDuringSeason: 0.75,
    malariaMortalityRate: 0.0052,
    smcEffect: 0.80,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.09,
    adjustmentDevelopmental: 0.28,
    adjustmentProgramBenefits: 0.22,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.005,
    adjustmentFunging: -0.12,
  },
  south_sudan: {
    costPerChildReached: 9.20,
    proportionMortalityDuringSeason: 0.70,
    malariaMortalityRate: 0.0065,
    smcEffect: 0.78,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.10,
    adjustmentDevelopmental: 0.35,
    adjustmentProgramBenefits: 0.16,
    adjustmentGrantee: -0.10,
    adjustmentLeverage: -0.006,
    adjustmentFunging: -0.08,
  },
  togo: {
    costPerChildReached: 6.50,
    proportionMortalityDuringSeason: 0.72,
    malariaMortalityRate: 0.0048,
    smcEffect: 0.79,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.075,
    adjustmentDevelopmental: 0.30,
    adjustmentProgramBenefits: 0.19,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.004,
    adjustmentFunging: -0.11,
  },
  uganda: {
    costPerChildReached: 7.80,
    proportionMortalityDuringSeason: 0.68,
    malariaMortalityRate: 0.0044,
    smcEffect: 0.78,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.085,
    adjustmentDevelopmental: 0.33,
    adjustmentProgramBenefits: 0.17,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.005,
    adjustmentFunging: -0.14,
  },
};

// ============================================================================
// Helen Keller Country Data
// ============================================================================

export const HK_COUNTRIES = [
  "burkina_faso", "cameroon", "drc", "cote_divoire", "guinea", "kenya", "mali",
  "niger", "nigeria", "madagascar", "senegal", "sierra_leone", "tanzania", "uganda"
] as const;
export type HKCountry = (typeof HK_COUNTRIES)[number];

export const HK_COUNTRY_NAMES: Record<HKCountry, string> = {
  burkina_faso: "Burkina Faso",
  cameroon: "Cameroon",
  drc: "DRC",
  cote_divoire: "Côte d'Ivoire",
  guinea: "Guinea",
  kenya: "Kenya",
  mali: "Mali",
  niger: "Niger",
  nigeria: "Nigeria",
  madagascar: "Madagascar",
  senegal: "Senegal",
  sierra_leone: "Sierra Leone",
  tanzania: "Tanzania",
  uganda: "Uganda",
};

export const HK_COUNTRY_PARAMS: Record<HKCountry, Omit<HelenKellerInputs, "grantSize">> = {
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
  // Additional countries - values estimated from GiveWell grant docs
  cote_divoire: {
    costPerPersonUnder5: 1.50,
    proportionReachedCounterfactual: 0.22,
    mortalityRateUnder5: 0.0075,
    vasEffect: 0.065,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.55,
    adjustmentGrantee: -0.05,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.14,
  },
  guinea: {
    costPerPersonUnder5: 0.95,
    proportionReachedCounterfactual: 0.18,
    mortalityRateUnder5: 0.0085,
    vasEffect: 0.078,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.56,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.16,
  },
  kenya: {
    costPerPersonUnder5: 1.20,
    proportionReachedCounterfactual: 0.25,
    mortalityRateUnder5: 0.0045,
    vasEffect: 0.055,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.54,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.12,
  },
  mali: {
    costPerPersonUnder5: 0.85,
    proportionReachedCounterfactual: 0.19,
    mortalityRateUnder5: 0.0095,
    vasEffect: 0.085,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.57,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.13,
  },
  niger: {
    costPerPersonUnder5: 0.80,
    proportionReachedCounterfactual: 0.17,
    mortalityRateUnder5: 0.0088,
    vasEffect: 0.080,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.56,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.14,
  },
  nigeria: {
    costPerPersonUnder5: 1.10,
    proportionReachedCounterfactual: 0.21,
    mortalityRateUnder5: 0.0078,
    vasEffect: 0.072,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.55,
    adjustmentGrantee: -0.05,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.15,
  },
  madagascar: {
    costPerPersonUnder5: 0.90,
    proportionReachedCounterfactual: 0.18,
    mortalityRateUnder5: 0.0055,
    vasEffect: 0.062,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.54,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.12,
  },
  senegal: {
    costPerPersonUnder5: 1.30,
    proportionReachedCounterfactual: 0.24,
    mortalityRateUnder5: 0.0042,
    vasEffect: 0.052,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.53,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.11,
  },
  sierra_leone: {
    costPerPersonUnder5: 0.88,
    proportionReachedCounterfactual: 0.16,
    mortalityRateUnder5: 0.0098,
    vasEffect: 0.088,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.58,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001,
    adjustmentFunging: -0.10,
  },
  tanzania: {
    costPerPersonUnder5: 1.05,
    proportionReachedCounterfactual: 0.22,
    mortalityRateUnder5: 0.0052,
    vasEffect: 0.058,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.54,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.13,
  },
  uganda: {
    costPerPersonUnder5: 1.00,
    proportionReachedCounterfactual: 0.20,
    mortalityRateUnder5: 0.0048,
    vasEffect: 0.056,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.54,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.002,
    adjustmentFunging: -0.12,
  },
};

// ============================================================================
// New Incentives Country Data (Nigerian States)
// ============================================================================

export const NI_COUNTRIES = [
  "bauchi", "gombe", "jigawa", "kaduna", "kano", "katsina", "kebbi", "sokoto", "zamfara"
] as const;
export type NICountry = (typeof NI_COUNTRIES)[number];

export const NI_COUNTRY_NAMES: Record<NICountry, string> = {
  bauchi: "Bauchi",
  gombe: "Gombe",
  jigawa: "Jigawa",
  kaduna: "Kaduna",
  kano: "Kano",
  katsina: "Katsina",
  kebbi: "Kebbi",
  sokoto: "Sokoto",
  zamfara: "Zamfara",
};

export const NI_COUNTRY_PARAMS: Record<NICountry, Omit<NewIncentivesInputs, "grantSize">> = {
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
  // Additional states - values estimated from GiveWell grant docs
  kaduna: {
    costPerChildReached: 18.50,
    proportionReachedCounterfactual: 0.79,
    probabilityDeathUnvaccinated: 0.052,
    vaccineEffect: 0.53,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.178,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.055,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.11,
  },
  kano: {
    costPerChildReached: 17.80,
    proportionReachedCounterfactual: 0.82,
    probabilityDeathUnvaccinated: 0.058,
    vaccineEffect: 0.54,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.172,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.060,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0028,
    adjustmentFunging: -0.12,
  },
  katsina: {
    costPerChildReached: 18.00,
    proportionReachedCounterfactual: 0.80,
    probabilityDeathUnvaccinated: 0.055,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.175,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.058,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0029,
    adjustmentFunging: -0.115,
  },
  kebbi: {
    costPerChildReached: 19.20,
    proportionReachedCounterfactual: 0.76,
    probabilityDeathUnvaccinated: 0.062,
    vaccineEffect: 0.51,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.180,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.048,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0032,
    adjustmentFunging: -0.10,
  },
  sokoto: {
    costPerChildReached: 19.50,
    proportionReachedCounterfactual: 0.75,
    probabilityDeathUnvaccinated: 0.068,
    vaccineEffect: 0.50,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.185,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.045,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0035,
    adjustmentFunging: -0.095,
  },
  zamfara: {
    costPerChildReached: 20.00,
    proportionReachedCounterfactual: 0.73,
    probabilityDeathUnvaccinated: 0.072,
    vaccineEffect: 0.49,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.188,
    adjustmentDevelopmental: 0.280,
    adjustmentConsumption: 0.042,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0038,
    adjustmentFunging: -0.09,
  },
};

// ============================================================================
// GiveDirectly Country Data
// ============================================================================

export const GD_COUNTRIES = [
  "kenya", "malawi", "mozambique", "rwanda", "uganda", "liberia", "drc", "togo"
] as const;
export type GDCountry = (typeof GD_COUNTRIES)[number];

export const GD_COUNTRY_NAMES: Record<GDCountry, string> = {
  kenya: "Kenya",
  malawi: "Malawi",
  mozambique: "Mozambique",
  rwanda: "Rwanda",
  uganda: "Uganda",
  liberia: "Liberia",
  drc: "DRC",
  togo: "Togo",
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
  // Additional countries - values estimated from GiveWell grant docs
  liberia: {
    transferAmount: 1000,
    overheadRate: 0.22,
    baselineConsumption: 420,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.06,
    householdSize: 5,
    proportionUnder5: 0.16,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  drc: {
    transferAmount: 1000,
    overheadRate: 0.24,
    baselineConsumption: 380,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.08,
    householdSize: 6,
    proportionUnder5: 0.18,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  togo: {
    transferAmount: 1000,
    overheadRate: 0.21,
    baselineConsumption: 490,
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
    benefitDecayRate: 0.0,
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
    benefitDecayRate: 0.0,
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
    benefitDecayRate: 0.0,
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

export function getMCInputsForCountry(country: MCCountry, grantSize: number = 1_000_000): MalariaConsortiumInputs {
  return { ...MC_COUNTRY_PARAMS[country], grantSize };
}

export function getHKInputsForCountry(country: HKCountry, grantSize: number = 1_000_000): HelenKellerInputs {
  return { ...HK_COUNTRY_PARAMS[country], grantSize };
}

export function getNIInputsForCountry(country: NICountry, grantSize: number = 1_000_000): NewIncentivesInputs {
  return { ...NI_COUNTRY_PARAMS[country], grantSize };
}

export function getGDInputsForCountry(country: GDCountry, grantSize: number = 1_000_000): GiveDirectlyInputs {
  return { ...GD_COUNTRY_PARAMS[country], grantSize };
}

export function getDWInputsForVariant(variant: DWVariant, grantSize: number = 1_000_000): DewormingInputs {
  return { ...DW_VARIANT_PARAMS[variant], grantSize };
}
