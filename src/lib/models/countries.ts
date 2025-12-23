/**
 * Country-Level Data for GiveWell CEA Models
 *
 * Each charity operates in multiple countries with different:
 * - Costs per person reached
 * - Mortality/disease burden rates
 * - Intervention effectiveness
 * - Leverage and funging adjustments
 *
 * Data extracted from GiveWell's CEA spreadsheets (December 2024).
 * Source: https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models
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

export const AMF_COUNTRIES = ["chad", "drc", "guinea", "nigeria_pmi", "nigeria_pmi", "south_sudan", "togo", "uganda"] as const;
export type AMFCountry = (typeof AMF_COUNTRIES)[number];

export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {
  chad: "Chad",
  drc: "DRC",
  guinea: "Guinea",
  nigeria_pmi: "Nigeria (PMI)",
  nigeria_pmi: "Nigeria (PMI)",
  south_sudan: "South Sudan",
  togo: "Togo",
  uganda: "Uganda",
};

export const AMF_COUNTRY_PARAMS: Record<AMFCountry, Omit<AMFInputs, "grantSize">> = {
  chad: {
    costPerUnder5Reached: 7.7272378268518445,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.001318997688,
    itnEffectOnDeaths: 0.2402078397,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.47169681817450737,
    adjustmentDevelopmental: 0.42208607116088437,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.008308060237,
    adjustmentFunging: -0.0302403437,
    adjustmentLeverageFungingForCostPerLife: -0.03854840393,
  },
  drc: {
    costPerUnder5Reached: 22.00245560826086,
    yearsEffectiveCoverage: 1.192516657,
    malariaMortalityRate: 0.00305644734,
    itnEffectOnDeaths: 0.558318464,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.237437667144635,
    adjustmentDevelopmental: 0.3407822685279659,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.004114250426,
    adjustmentFunging: -0.1461607338,
    adjustmentLeverageFungingForCostPerLife: -0.1502749842,
  },
  guinea: {
    costPerUnder5Reached: 9.009516634396245,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.003673911359,
    itnEffectOnDeaths: 0.4600684292,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.3085548506680807,
    adjustmentDevelopmental: 0.21873710270948332,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001382525591,
    adjustmentFunging: -0.3003019883,
    adjustmentLeverageFungingForCostPerLife: -0.3016845139,
  },
  nigeria_pmi: {
    costPerUnder5Reached: 11.153117808796214,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.002704804276,
    itnEffectOnDeaths: 0.5016739686,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.58288007665042,
    adjustmentDevelopmental: 0.2721599706548075,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001698012775,
    adjustmentFunging: -0.280617756,
    adjustmentLeverageFungingForCostPerLife: -0.2823157688,
  },
  nigeria_pmi: {
    costPerUnder5Reached: 16.64438116351702,
    yearsEffectiveCoverage: 1.31712103,
    malariaMortalityRate: 0.002906550552,
    itnEffectOnDeaths: 0.5016739686,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.6860078176818069,
    adjustmentDevelopmental: 0.35141061442294236,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.003159222382,
    adjustmentFunging: -0.1400660492,
    adjustmentLeverageFungingForCostPerLife: -0.1432252715,
  },
  south_sudan: {
    costPerUnder5Reached: 19.73766454128133,
    yearsEffectiveCoverage: 1.26901599,
    malariaMortalityRate: 0.002516179553,
    itnEffectOnDeaths: 0.4018858601,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.21923717947979204,
    adjustmentDevelopmental: 0.31480032553361653,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.01129290244,
    adjustmentFunging: -0.05985331551,
    adjustmentLeverageFungingForCostPerLife: -0.07114621795,
  },
  togo: {
    costPerUnder5Reached: 11.724992907894746,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.001639136168,
    itnEffectOnDeaths: 0.3892651892,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 1.5127695797196918,
    adjustmentDevelopmental: 0.42675409186909896,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001691670199,
    adjustmentFunging: -0.4161821599,
    adjustmentLeverageFungingForCostPerLife: -0.4178738301,
  },
  uganda: {
    costPerUnder5Reached: 11.267692556909397,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.002350482231,
    itnEffectOnDeaths: 0.513467417,
    moralWeightUnder5: 116.25262,
    moralWeight5Plus: 73.1914,
    adjustmentOlderMortalities: 0.23931426778760814,
    adjustmentDevelopmental: 0.32744501769424805,
    adjustmentProgramBenefits: 0.5,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001853405826,
    adjustmentFunging: -0.319351647,
    adjustmentLeverageFungingForCostPerLife: -0.3212050528,
  },
};

// ============================================================================
// Malaria Consortium Country Data
// ============================================================================

export const MC_COUNTRIES = ["burkina_faso", "chad", "cote_divoire", "drc_haut_katanga", "drc_haut_lomami", "drc_lualaba", "drc_tanganyika", "mozambique"] as const;
export type MCCountry = (typeof MC_COUNTRIES)[number];

export const MC_COUNTRY_NAMES: Record<MCCountry, string> = {
  burkina_faso: "Burkina Faso",
  chad: "Chad",
  cote_divoire: "Côte d'Ivoire",
  drc_haut_katanga: "DRC (Haut-Katanga)",
  drc_haut_lomami: "DRC (Haut-Lomami)",
  drc_lualaba: "DRC (Lualaba)",
  drc_tanganyika: "DRC (Tanganyika)",
  mozambique: "Mozambique",
};

export const MC_COUNTRY_PARAMS: Record<MCCountry, Omit<MalariaConsortiumInputs, "grantSize">> = {
  burkina_faso: {
    costPerChildReached: 7.079888783,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.00315503431,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.004005444451,
    adjustmentFunging: -0.3963757375,
  },
  chad: {
    costPerChildReached: 7.774884,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.002792265575,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.005978161521,
    adjustmentFunging: -0.2278305143,
  },
  cote_divoire: {
    costPerChildReached: 12.628485,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.002741628515,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.008251293564,
    adjustmentFunging: -0.2369353924,
  },
  drc_haut_katanga: {
    costPerChildReached: 7.774884,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.003454895225,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01325496647,
    adjustmentFunging: -0.08945215206,
  },
  drc_haut_lomami: {
    costPerChildReached: 7.774884,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.003711160168,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01201759933,
    adjustmentFunging: -0.09510436685,
  },
  drc_lualaba: {
    costPerChildReached: 7.774884,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.004094440972,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01101204018,
    adjustmentFunging: -0.09969769741,
  },
  drc_tanganyika: {
    costPerChildReached: 7.774884,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.004420467179,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01045530457,
    adjustmentFunging: -0.1022408304,
  },
  mozambique: {
    costPerChildReached: 8.29327176,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.003218223424,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.07,
    adjustmentDevelopmental: 0.25,
    adjustmentProgramBenefits: 0.2,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01033457603,
    adjustmentFunging: -0.206034612,
  },
};

// ============================================================================
// Helen Keller Country Data
// ============================================================================

export const HK_COUNTRIES = ["burkina_faso", "cameroon", "cote_divoire", "drc", "guinea", "madagascar", "mali", "niger"] as const;
export type HKCountry = (typeof HK_COUNTRIES)[number];

export const HK_COUNTRY_NAMES: Record<HKCountry, string> = {
  burkina_faso: "Burkina Faso",
  cameroon: "Cameroon",
  cote_divoire: "Côte d'Ivoire",
  drc: "DRC",
  guinea: "Guinea",
  madagascar: "Madagascar",
  mali: "Mali",
  niger: "Niger",
};

export const HK_COUNTRY_PARAMS: Record<HKCountry, Omit<HelenKellerInputs, "grantSize">> = {
  burkina_faso: {
    costPerPersonUnder5: 3.082185694,
    proportionReachedCounterfactual: 0.29,
    mortalityRateUnder5: 0.00768056853,
    vasEffect: 0.07838157426,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  cameroon: {
    costPerPersonUnder5: 2.332565381,
    proportionReachedCounterfactual: 0.225,
    mortalityRateUnder5: 0.007760641772,
    vasEffect: 0.05093724878,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  cote_divoire: {
    costPerPersonUnder5: 1.721045038,
    proportionReachedCounterfactual: 0.4,
    mortalityRateUnder5: 0.006878675197,
    vasEffect: 0.03391123072,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  drc: {
    costPerPersonUnder5: 1.136321932,
    proportionReachedCounterfactual: 0.2,
    mortalityRateUnder5: 0.007638451922,
    vasEffect: 0.0821653677,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  guinea: {
    costPerPersonUnder5: 2.722337786,
    proportionReachedCounterfactual: 0.183,
    mortalityRateUnder5: 0.01077486656,
    vasEffect: 0.05485420005,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  madagascar: {
    costPerPersonUnder5: 1.657949711,
    proportionReachedCounterfactual: 0.33,
    mortalityRateUnder5: 0.005417604289,
    vasEffect: 0.08065721292,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  mali: {
    costPerPersonUnder5: 1.7445797,
    proportionReachedCounterfactual: 0.214,
    mortalityRateUnder5: 0.01094252387,
    vasEffect: 0.06329668544,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
  niger: {
    costPerPersonUnder5: 0.9732277909,
    proportionReachedCounterfactual: 0.15,
    mortalityRateUnder5: 0.01362766939,
    vasEffect: 0.1110232225,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: 0,
    adjustmentFunging: -0.14,
  },
};

// ============================================================================
// New Incentives Country Data (Nigerian States)
// ============================================================================

export const NI_COUNTRIES = ["bauchi", "gombe", "jigawa", "kaduna", "kano", "katsina", "kebbi", "sokoto", "zamfara"] as const;
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
    proportionReachedCounterfactual: 0.5631563197,
    probabilityDeathUnvaccinated: 0.0565350252,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  gombe: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.6825510244999999,
    probabilityDeathUnvaccinated: 0.0419922518,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  jigawa: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.6386904092,
    probabilityDeathUnvaccinated: 0.06324757807,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  kaduna: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.6102268381,
    probabilityDeathUnvaccinated: 0.02844017379,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  kano: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.5925868042,
    probabilityDeathUnvaccinated: 0.04002462599,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  katsina: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.5562042497999999,
    probabilityDeathUnvaccinated: 0.04391236882,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  kebbi: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.42892732710000003,
    probabilityDeathUnvaccinated: 0.05121048602,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  sokoto: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.3888949932,
    probabilityDeathUnvaccinated: 0.06360765684,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
  },
  zamfara: {
    costPerChildReached: 18.21,
    proportionReachedCounterfactual: 0.5310077321,
    probabilityDeathUnvaccinated: 0.0777728788,
    vaccineEffect: 0.52,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.18,
    adjustmentDevelopmental: 0.28,
    adjustmentConsumption: 0.06,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.003,
    adjustmentFunging: -0.12,
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
    baselineConsumption: 651.9660358,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 4.2,
    proportionUnder5: 0.1287912678,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  malawi: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 469.9848552,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 4.5,
    proportionUnder5: 0.1512502679,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  mozambique: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 449.7814891,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 4.4,
    proportionUnder5: 0.1613260862,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  rwanda: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 532.6413912,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 4.3,
    proportionUnder5: 0.137321374,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
  uganda: {
    transferAmount: 1000,
    overheadRate: 0.20,
    baselineConsumption: 625.5532756,
    consumptionPersistenceYears: 10,
    discountRate: 0.04,
    spilloverMultiplier: 2.5,
    spilloverDiscount: 0.45,
    mortalityEffect: 0.23,
    under5MortalityRate: 0.05,
    householdSize: 4.8,
    proportionUnder5: 0.1665377343,
    moralWeightUnder5: 116.25,
    mortalityDiscount: 0.50,
  },
};

// ============================================================================
// Deworming Country/Variant Data
// Note: GiveWell's deworming model has location-specific data (Kenya, Pakistan)
// This simplified version uses representative parameters.
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
