/**
 * Moral Weights Configuration
 *
 * GiveWell's cost-effectiveness analysis uses "moral weights" to convert
 * deaths averted into units of value (UoV). These weights reflect the
 * ethical value assigned to preventing deaths at different ages.
 *
 * The default values are derived from GiveWell's moral weights spreadsheet,
 * which considers:
 * - Years of life lost (younger deaths = more years lost)
 * - Discount rate for future life-years
 * - Value of statistical life year
 *
 * Users can adjust these weights to reflect their own ethical preferences.
 *
 * GiveWell offers three input modes:
 * 1. Simple: Single multiplier on consumption value
 * 2. Manual: Direct entry of all moral weight values
 * 3. Granular: Age-based breakdown with intervention-specific adjustments
 */

export type MoralWeightMode = "simple" | "manual" | "granular";

export interface MoralWeights {
  /**
   * Input mode selection
   */
  mode: MoralWeightMode;

  /**
   * Simple mode: Multiplier on consumption value
   * Value of 1 = GiveWell defaults, 2 = double weight on mortality, etc.
   */
  consumptionMultiplier: number;

  // =========================================================================
  // Intervention-specific under-5 weights
  // =========================================================================

  /**
   * Value of averting one under-5 death from malaria (ITNs, SMC).
   * Default: 116.25 UoV
   */
  under5Malaria: number;

  /**
   * Value of averting one under-5 death from vitamin A deficiency.
   * Default: 118.73 UoV (slightly higher due to age distribution)
   */
  under5VitaminA: number;

  /**
   * Value of averting one under-5 death through vaccination.
   * Default: 116.25 UoV
   */
  under5Vaccines: number;

  // =========================================================================
  // Age-specific weights for non-under-5 mortality
  // =========================================================================

  /**
   * Value of averting death for age 5+ in malaria context.
   * Used for "older mortalities" adjustment in AMF/MC.
   * Default: 73.19 UoV
   */
  age5PlusMalaria: number;

  /**
   * Value of averting death for ages 5-14 (primarily vaccines).
   * Default: 134 UoV
   */
  age5to14: number;

  /**
   * Value of averting death for ages 15-49 (primarily vaccines).
   * Default: 104 UoV
   */
  age15to49: number;

  /**
   * Value of averting death for ages 50-74 (primarily vaccines).
   * Default: 42 UoV
   */
  age50to74: number;

  // =========================================================================
  // Economic parameters
  // =========================================================================

  /**
   * Discount rate for future benefits (real, annual).
   * GiveWell uses 4% for discounting future consumption/income gains.
   */
  discountRate: number;
}

/**
 * GiveWell's default moral weights from November 2025 spreadsheets.
 */
export const DEFAULT_MORAL_WEIGHTS: MoralWeights = {
  mode: "manual",
  consumptionMultiplier: 1.0,

  // Intervention-specific under-5 weights
  under5Malaria: 116.25,
  under5VitaminA: 118.73,
  under5Vaccines: 116.25,

  // Age-specific weights
  age5PlusMalaria: 73.19,
  age5to14: 134,
  age15to49: 104,
  age50to74: 42,

  // Economic
  discountRate: 0.04,
};

/**
 * Legacy MoralWeights for backwards compatibility
 * Maps to the simplified interface used in existing code
 */
export interface LegacyMoralWeights {
  under5: number;
  age5to14: number;
  age15plus: number;
  discountRate: number;
}

/**
 * Convert expanded moral weights to legacy format for existing calculations
 */
export function toLegacyWeights(weights: MoralWeights): LegacyMoralWeights {
  if (weights.mode === "simple") {
    // Apply multiplier to default weights
    return {
      under5: 116.25 * weights.consumptionMultiplier,
      age5to14: 95 * weights.consumptionMultiplier,
      age15plus: 73.19 * weights.consumptionMultiplier,
      discountRate: weights.discountRate,
    };
  }

  // For manual/granular, use average of intervention-specific weights
  const avgUnder5 = (weights.under5Malaria + weights.under5VitaminA + weights.under5Vaccines) / 3;
  const avgAge15plus = (weights.age15to49 + weights.age50to74) / 2;

  return {
    under5: avgUnder5,
    age5to14: weights.age5to14,
    age15plus: avgAge15plus,
    discountRate: weights.discountRate,
  };
}

/**
 * Get the appropriate under-5 moral weight for a specific intervention type
 */
export function getUnder5Weight(
  weights: MoralWeights,
  intervention: "malaria" | "vitaminA" | "vaccines" | "cash"
): number {
  if (weights.mode === "simple") {
    return 116.25 * weights.consumptionMultiplier;
  }

  switch (intervention) {
    case "malaria":
      return weights.under5Malaria;
    case "vitaminA":
      return weights.under5VitaminA;
    case "vaccines":
      return weights.under5Vaccines;
    case "cash":
      return weights.under5Malaria; // Use malaria as default for cash
  }
}

/**
 * Get the 5+ moral weight for malaria interventions
 */
export function getAge5PlusWeight(weights: MoralWeights): number {
  if (weights.mode === "simple") {
    return 73.19 * weights.consumptionMultiplier;
  }
  return weights.age5PlusMalaria;
}

/**
 * Calculate a weighted average moral weight for ages 5+
 * This is used in the "older mortalities" adjustment calculation.
 */
export function getAge5PlusMoralWeight(weights: MoralWeights | LegacyMoralWeights): number {
  if ("mode" in weights) {
    // New format
    return getAge5PlusWeight(weights);
  }
  // Legacy format
  return (weights.age5to14 + weights.age15plus) / 2;
}

/**
 * Preset moral weight configurations representing different ethical views.
 */
export interface MoralWeightPreset {
  name: string;
  description: string;
  weights: MoralWeights;
}

export const MORAL_WEIGHT_PRESETS: MoralWeightPreset[] = [
  {
    name: "GiveWell Default",
    description: "GiveWell's standard moral weights based on expected life-years (4% discount rate)",
    weights: DEFAULT_MORAL_WEIGHTS,
  },
  {
    name: "Equal Lives",
    description: "All lives valued equally regardless of age (no life-year discounting)",
    weights: {
      ...DEFAULT_MORAL_WEIGHTS,
      under5Malaria: 100,
      under5VitaminA: 100,
      under5Vaccines: 100,
      age5PlusMalaria: 100,
      age5to14: 100,
      age15to49: 100,
      age50to74: 100,
    },
  },
  {
    name: "Higher Child Value",
    description: "Prioritizes preventing child deaths (2x weight on under-5)",
    weights: {
      ...DEFAULT_MORAL_WEIGHTS,
      consumptionMultiplier: 1.0,
      under5Malaria: 232.5,
      under5VitaminA: 237.46,
      under5Vaccines: 232.5,
    },
  },
  {
    name: "Lower Discount Rate",
    description: "Uses 2% discount rate instead of 4% (values future more)",
    weights: {
      ...DEFAULT_MORAL_WEIGHTS,
      discountRate: 0.02,
    },
  },
];

/**
 * Apply custom moral weights to charity input parameters.
 * This scales the moral weight parameters proportionally.
 */
export function scaleMoralWeight(
  defaultWeight: number,
  customWeight: number,
  defaultReference: number = DEFAULT_MORAL_WEIGHTS.under5Malaria
): number {
  return defaultWeight * (customWeight / defaultReference);
}
