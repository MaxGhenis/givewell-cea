/**
 * Country-Level Data for GiveWell CEA Models
 *
 * Each charity operates in multiple countries with different:
 * - Costs per person reached
 * - Mortality/disease burden rates
 * - Intervention effectiveness
 * - Leverage and funging adjustments
 *
 * Data extracted from GiveWell's CEA spreadsheets (November 2025).
 * Cross-validated against test cases derived from the same spreadsheets.
 * Source: https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models
 */

import type { AMFInputs } from "./amf";
import type { MalariaConsortiumInputs } from "./malaria-consortium";
import type { HelenKellerInputs } from "./helen-keller";
import type { NewIncentivesInputs } from "./new-incentives";
import type { GiveDirectlyInputs } from "./givedirectly";
import type { DewormingInputs } from "./deworming";
import type { DewormingEvidenceActionInputs } from "./deworming-evidence-action";

// ============================================================================
// AMF Country Data
// ============================================================================

export const AMF_COUNTRIES = ["chad", "drc", "guinea", "nigeria_gf", "nigeria_pmi", "south_sudan", "togo", "uganda"] as const;
export type AMFCountry = (typeof AMF_COUNTRIES)[number];

export const AMF_COUNTRY_NAMES: Record<AMFCountry, string> = {
  chad: "Chad",
  drc: "DRC",
  guinea: "Guinea",
  nigeria_gf: "Nigeria (GF)",
  nigeria_pmi: "Nigeria (PMI)",
  south_sudan: "South Sudan",
  togo: "Togo",
  uganda: "Uganda",
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
    adjustmentLeverageFungingForCostPerLife: -0.4218399916,
  },
  nigeria_gf: {
    costPerUnder5Reached: 21.92266447,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.005508102085,
    itnEffectOnDeaths: 0.5016739686,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.3669750309,
    adjustmentDevelopmental: 0.39264384,
    adjustmentProgramBenefits: 0.479,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001698012775,
    adjustmentFunging: -0.280617756,
    adjustmentLeverageFungingForCostPerLife: -0.337154462,
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
  south_sudan: {
    costPerUnder5Reached: 25.0474119,
    yearsEffectiveCoverage: 1.26901599,
    malariaMortalityRate: 0.004952000966,
    itnEffectOnDeaths: 0.4018858601,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.1380293716,
    adjustmentDevelopmental: 0.4541608685,
    adjustmentProgramBenefits: 0.379,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.01129290244,
    adjustmentFunging: -0.05985331551,
    adjustmentLeverageFungingForCostPerLife: -0.2404964513,
  },
  togo: {
    costPerUnder5Reached: 23.04674709,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.003125463445,
    itnEffectOnDeaths: 0.3892651892,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.9524234677,
    adjustmentDevelopmental: 0.6156760122,
    adjustmentProgramBenefits: 0.379,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001691670199,
    adjustmentFunging: -0.4161821599,
    adjustmentLeverageFungingForCostPerLife: -0.5185695578,
  },
  uganda: {
    costPerUnder5Reached: 22.14787358,
    yearsEffectiveCoverage: 1.965608617,
    malariaMortalityRate: 0.006442007678,
    itnEffectOnDeaths: 0.513467417,
    moralWeightUnder5: 116.253,
    moralWeight5Plus: 73.19,
    adjustmentOlderMortalities: 0.1506696907,
    adjustmentDevelopmental: 0.4724033031,
    adjustmentProgramBenefits: 0.379,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.001853405826,
    adjustmentFunging: -0.319351647,
    adjustmentLeverageFungingForCostPerLife: -0.4387973311,
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
    costPerChildReached: 6.332845822,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004748326636,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.06857112185,
    adjustmentDevelopmental: 0.3132874116,
    adjustmentProgramBenefits: 0.191,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.004005444451,
    adjustmentFunging: -0.3963757375,
  },
  chad: {
    costPerChildReached: 7.014881547,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004788735461,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.05499180911,
    adjustmentDevelopmental: 0.2079650431,
    adjustmentProgramBenefits: 0.241,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.005978161521,
    adjustmentFunging: -0.2278305143,
  },
  cote_divoire: {
    costPerChildReached: 11.44972958,
    proportionMortalityDuringSeason: 0.7,
    malariaMortalityRate: 0.004222107914,
    smcEffect: 0.7936949983,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1046351707,
    adjustmentDevelopmental: 0.3707863359,
    adjustmentProgramBenefits: 0.141,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.008251293564,
    adjustmentFunging: -0.2369353924,
  },
  drc_haut_katanga: {
    costPerChildReached: 7.31518434,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.005380999312,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.02957330074,
    adjustmentDevelopmental: 0.3037230971,
    adjustmentProgramBenefits: 0.181,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01325496647,
    adjustmentFunging: -0.08945215206,
  },
  drc_haut_lomami: {
    costPerChildReached: 7.31518434,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.005780131961,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.02955908324,
    adjustmentDevelopmental: 0.338682090,
    adjustmentProgramBenefits: 0.181,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01201759933,
    adjustmentFunging: -0.09510436685,
  },
  drc_lualaba: {
    costPerChildReached: 7.31518434,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.006377091814,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.02956301138,
    adjustmentDevelopmental: 0.3241610621,
    adjustmentProgramBenefits: 0.181,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01101204018,
    adjustmentFunging: -0.09969769741,
  },
  drc_tanganyika: {
    costPerChildReached: 7.31518434,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.006884877632,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.02958346881,
    adjustmentDevelopmental: 0.2917834796,
    adjustmentProgramBenefits: 0.181,
    adjustmentGrantee: -0.08,
    adjustmentLeverage: -0.01045530457,
    adjustmentFunging: -0.1022408304,
  },
  mozambique: {
    costPerChildReached: 7.418197238,
    proportionMortalityDuringSeason: 0.515,
    malariaMortalityRate: 0.004674469524,
    smcEffect: 0.5952712487,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1484034087,
    adjustmentDevelopmental: 0.3389651363,
    adjustmentProgramBenefits: 0.181,
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
    costPerPersonUnder5: 2.342461127,
    proportionReachedCounterfactual: 0.29,
    mortalityRateUnder5: 0.00791376435,
    vasEffect: 0.07838157426,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.01833780533,
    adjustmentFunging: -0.4312943169,
  },
  cameroon: {
    costPerPersonUnder5: 1.726098382,
    proportionReachedCounterfactual: 0.225,
    mortalityRateUnder5: 0.007974420725,
    vasEffect: 0.05093724878,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.14,
    adjustmentLeverage: -0.03518310036,
    adjustmentFunging: -0.2182221413,
  },
  cote_divoire: {
    costPerPersonUnder5: 1.221941977,
    proportionReachedCounterfactual: 0.4,
    mortalityRateUnder5: 0.00698802485,
    vasEffect: 0.03391123072,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.09,
    adjustmentLeverage: -0.06549112545,
    adjustmentFunging: -0.153989403,
  },
  drc: {
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
  },
  guinea: {
    costPerPersonUnder5: 2.041753339,
    proportionReachedCounterfactual: 0.183,
    mortalityRateUnder5: 0.01103947453,
    vasEffect: 0.05485420005,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.02315151842,
    adjustmentFunging: -0.243082613,
  },
  madagascar: {
    costPerPersonUnder5: 1.177144295,
    proportionReachedCounterfactual: 0.33,
    mortalityRateUnder5: 0.005591435732,
    vasEffect: 0.08065721292,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.04,
    adjustmentLeverage: -0.02420126536,
    adjustmentFunging: -0.284714654,
  },
  mali: {
    costPerPersonUnder5: 1.238651587,
    proportionReachedCounterfactual: 0.214,
    mortalityRateUnder5: 0.01138621406,
    vasEffect: 0.06329668544,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.12,
    adjustmentLeverage: -0.01378466208,
    adjustmentFunging: -0.3764015403,
  },
  niger: {
    costPerPersonUnder5: 0.6131335083,
    proportionReachedCounterfactual: 0.15,
    mortalityRateUnder5: 0.01442794725,
    vasEffect: 0.1110232225,
    moralWeightUnder5: 118.73259,
    adjustmentDevelopmental: 0.245176,
    adjustmentProgramBenefits: 0.565,
    adjustmentGrantee: -0.14,
    adjustmentLeverage: -0.004246113154,
    adjustmentFunging: -0.3950269901,
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
  },
  gombe: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.8800470161,
    probabilityDeathUnvaccinated: 0.0419922518,
    vaccineEffect: 0.5273839374,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1683225749,
    adjustmentDevelopmental: 0.2827472661,
    adjustmentConsumption: 0.09731145904,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.05685457843,
    adjustmentFunging: -0.08702584485,
  },
  jigawa: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.8577882271,
    probabilityDeathUnvaccinated: 0.06324757807,
    vaccineEffect: 0.5508425012,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1666117175,
    adjustmentDevelopmental: 0.2828406239,
    adjustmentConsumption: 0.05224792387,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.0377404287,
    adjustmentFunging: -0.0927356631,
  },
  kaduna: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.8423238217,
    probabilityDeathUnvaccinated: 0.02844017379,
    vaccineEffect: 0.5437120524,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.16479314,
    adjustmentDevelopmental: 0.2837290535,
    adjustmentConsumption: 0.1062638393,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.08094931709,
    adjustmentFunging: -0.08594691079,
  },
  kano: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.8323011824,
    probabilityDeathUnvaccinated: 0.04002462599,
    vaccineEffect: 0.5159530939,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1608801044,
    adjustmentDevelopmental: 0.2849654572,
    adjustmentConsumption: 0.07499436694,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.062527746,
    adjustmentFunging: -0.08979372015,
  },
  katsina: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.8104791282,
    probabilityDeathUnvaccinated: 0.04391236882,
    vaccineEffect: 0.5458220838,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1983290736,
    adjustmentDevelopmental: 0.2779754152,
    adjustmentConsumption: 0.05569053102,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.05343454263,
    adjustmentFunging: -0.092282267,
  },
  kebbi: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.7193271108,
    probabilityDeathUnvaccinated: 0.05121048602,
    vaccineEffect: 0.5582439524,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1924333576,
    adjustmentDevelopmental: 0.2789453801,
    adjustmentConsumption: 0.03165960299,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.04603517759,
    adjustmentFunging: -0.09551033376,
  },
  sokoto: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.6846869654,
    probabilityDeathUnvaccinated: 0.06360765684,
    vaccineEffect: 0.5300120224,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1974807771,
    adjustmentDevelopmental: 0.278460293,
    adjustmentConsumption: 0.02380576441,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.03918562727,
    adjustmentFunging: -0.09659819372,
  },
  zamfara: {
    costPerChildReached: 18.21258998,
    proportionReachedCounterfactual: 0.7943821971,
    probabilityDeathUnvaccinated: 0.0777728788,
    vaccineEffect: 0.5446171515,
    moralWeightUnder5: 116.25262,
    adjustmentOlderMortalities: 0.1640051924,
    adjustmentDevelopmental: 0.2838368371,
    adjustmentConsumption: 0.02976665367,
    adjustmentProgramBenefits: 0.503,
    adjustmentGrantee: -0.07,
    adjustmentLeverage: -0.03176670886,
    adjustmentFunging: -0.09577101439,
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

// ============================================================================
// Deworming (Evidence Action / Deworm the World) Country Data
// ============================================================================

export const DEA_COUNTRIES = [
  "kenya",
  "ajk_pakistan",
  "balochistan_pakistan",
  "gilgit_baltistan_pakistan",
  "islamabad_pakistan",
  "khyber_pakhtunkhwa_pakistan",
  "punjab_pakistan",
  "sindh_pakistan",
  "lagos_nigeria",
  "oyo_nigeria",
  "ogun_nigeria",
  "rivers_nigeria",
  "cross_river_nigeria",
] as const;
export type DEACountry = (typeof DEA_COUNTRIES)[number];

export const DEA_COUNTRY_NAMES: Record<DEACountry, string> = {
  kenya: "Kenya",
  ajk_pakistan: "Azad Jammu and Kashmir, Pakistan",
  balochistan_pakistan: "Balochistan, Pakistan",
  gilgit_baltistan_pakistan: "Gilgit-Baltistan, Pakistan",
  islamabad_pakistan: "Islamabad Capital Territory, Pakistan",
  khyber_pakhtunkhwa_pakistan: "Khyber Pakhtunkhwa, Pakistan",
  punjab_pakistan: "Punjab, Pakistan",
  sindh_pakistan: "Sindh, Pakistan",
  lagos_nigeria: "Lagos, Nigeria",
  oyo_nigeria: "Oyo, Nigeria",
  ogun_nigeria: "Ogun, Nigeria",
  rivers_nigeria: "Rivers, Nigeria",
  cross_river_nigeria: "Cross River, Nigeria",
};

export const DEA_COUNTRY_PARAMS: Record<DEACountry, Omit<DewormingEvidenceActionInputs, "grantSize">> = {
  kenya: {
    percentageCostsDtW: 0.6082843,
    costPerChildPerYear: 0.64757,
    wormBurdenAdjustment: 0.20523514303046,
    pvBenefitsLnConsumption: 0.04233400171,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.2557848955,
  },
  ajk_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0355752,
    pvBenefitsLnConsumption: 0.00733812229,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.1579093422,
  },
  balochistan_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0128676,
    pvBenefitsLnConsumption: 0.002654209179,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.05848865867,
  },
  gilgit_baltistan_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.1264055,
    pvBenefitsLnConsumption: 0.02607375411,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.1983918901,
  },
  islamabad_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0075692,
    pvBenefitsLnConsumption: 0.00156130437,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: -0.05054174521,
  },
  khyber_pakhtunkhwa_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0531569,
    pvBenefitsLnConsumption: 0.01096471229,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.1765432645,
  },
  punjab_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0075692,
    pvBenefitsLnConsumption: 0.00156130437,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: -0.05054174521,
  },
  sindh_pakistan: {
    percentageCostsDtW: 0.4014779,
    costPerChildPerYear: 0.74247,
    wormBurdenAdjustment: 0.0128676,
    pvBenefitsLnConsumption: 0.002654209179,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.91,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.05848865867,
  },
  lagos_nigeria: {
    percentageCostsDtW: 0.6735345,
    costPerChildPerYear: 0.75506,
    wormBurdenAdjustment: 0.0700532622286556,
    pvBenefitsLnConsumption: 0.01444993718,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.87,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.1612619753,
  },
  oyo_nigeria: {
    percentageCostsDtW: 0.6084396,
    costPerChildPerYear: 0.78975,
    wormBurdenAdjustment: 0.110769485470474,
    pvBenefitsLnConsumption: 0.02284850206,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.87,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.267543532,
  },
  ogun_nigeria: {
    percentageCostsDtW: 0.6270353204610798,
    costPerChildPerYear: 1.518246103,
    wormBurdenAdjustment: 0.205235143030462,
    pvBenefitsLnConsumption: 0.04233400171,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.87,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.2486821258,
  },
  rivers_nigeria: {
    percentageCostsDtW: 0.6220757005833413,
    costPerChildPerYear: 0.7480077174,
    wormBurdenAdjustment: 0.0832610819812009,
    pvBenefitsLnConsumption: 0.01717432373,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.87,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.2114001128,
  },
  cross_river_nigeria: {
    percentageCostsDtW: 0.589401613589314,
    costPerChildPerYear: 1.16122759803812,
    wormBurdenAdjustment: 0.123383074085492,
    pvBenefitsLnConsumption: 0.02545031612,
    valueLnConsumptionUnit: 1.442695041,
    charityAdjustmentFactor: 0.87,
    interventionAdjustmentFactor: 1.073,
    leverageFungingPercentChange: 0.2456553871,
  },
};

export function getDEAInputsForCountry(country: DEACountry, grantSize: number = 100_000): DewormingEvidenceActionInputs {
  return { ...DEA_COUNTRY_PARAMS[country], grantSize };
}
