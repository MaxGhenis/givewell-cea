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
 * - Donor preferences (from IDinsight surveys)
 * - Discount rate for future life-years
 *
 * GiveWell's weights peak at ages 5-9 (134 UoV), not at birth, reflecting
 * that their weights incorporate preferences beyond pure life-years.
 *
 * Age curve from GiveWell:
 * - Early neonatal: 84
 * - Ages 1-4: 127
 * - Ages 5-9: 134 (peak)
 * - Age 40: 86
 * - Ages 80+: 12
 */

export type MoralWeightMode = "simple" | "manual";

export interface MoralWeights {
  /**
   * Input mode selection
   * - simple: Single multiplier on all default weights
   * - manual: Direct entry of age-specific weights
   */
  mode: MoralWeightMode;

  /**
   * Simple mode: Multiplier on all weights
   * Value of 1 = GiveWell defaults, 2 = double all weights, etc.
   */
  multiplier: number;

  /**
   * Value of averting one death of a person under age 5.
   * GiveWell uses ~117 UoV (weighted avg of neonatal through age 4).
   */
  under5: number;

  /**
   * Value of averting one death of a person age 5-14.
   * GiveWell uses ~130 UoV (near the peak of their curve).
   */
  age5to14: number;

  /**
   * Value of averting one death of a person age 15-49.
   * GiveWell uses ~95 UoV (declining from peak).
   */
  age15to49: number;

  /**
   * Value of averting one death of a person age 50+.
   * GiveWell uses ~45 UoV (weighted avg of older ages).
   */
  age50plus: number;

  /**
   * Discount rate for future benefits (real, annual).
   * GiveWell uses 4% for discounting future consumption/income gains.
   */
  discountRate: number;
}

/**
 * GiveWell's default moral weights from November 2025 spreadsheets.
 * These are simplified age-band averages from their more granular curve.
 */
export const DEFAULT_MORAL_WEIGHTS: MoralWeights = {
  mode: "manual",
  multiplier: 1.0,
  under5: 117,      // Weighted avg of neonatal (84) through age 4 (127)
  age5to14: 130,    // Near peak (134 at ages 5-9)
  age15to49: 95,    // Declining from peak
  age50plus: 45,    // Weighted avg of older ages (down to 12 at 80+)
  discountRate: 0.04,
};

/**
 * Get the effective moral weight for a given age group,
 * applying the multiplier if in simple mode.
 */
export function getWeight(weights: MoralWeights, ageGroup: "under5" | "age5to14" | "age15to49" | "age50plus"): number {
  const baseWeight = weights[ageGroup];
  if (weights.mode === "simple") {
    return baseWeight * weights.multiplier;
  }
  return baseWeight;
}

/**
 * Get the under-5 moral weight (most commonly used).
 */
export function getUnder5Weight(weights: MoralWeights): number {
  return getWeight(weights, "under5");
}

/**
 * Get a weighted average for ages 5+ (used in "older mortalities" adjustment).
 * Weights roughly by mortality distribution in program areas.
 */
export function getAge5PlusWeight(weights: MoralWeights): number {
  // Rough weighting: 5-14 (30%), 15-49 (50%), 50+ (20%)
  const w5to14 = getWeight(weights, "age5to14");
  const w15to49 = getWeight(weights, "age15to49");
  const w50plus = getWeight(weights, "age50plus");
  return w5to14 * 0.3 + w15to49 * 0.5 + w50plus * 0.2;
}

/**
 * Legacy compatibility function
 */
export function getAge5PlusMoralWeight(weights: MoralWeights): number {
  return getAge5PlusWeight(weights);
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
    description: "GiveWell's standard moral weights (peaks at ages 5-9, 4% discount)",
    weights: DEFAULT_MORAL_WEIGHTS,
  },
  {
    name: "Equal Lives",
    description: "All lives valued equally regardless of age",
    weights: {
      ...DEFAULT_MORAL_WEIGHTS,
      under5: 100,
      age5to14: 100,
      age15to49: 100,
      age50plus: 100,
    },
  },
  {
    name: "Pure Life-Years",
    description: "Weight purely by remaining life expectancy",
    weights: {
      ...DEFAULT_MORAL_WEIGHTS,
      under5: 140,    // ~70 years remaining
      age5to14: 130,  // ~65 years remaining
      age15to49: 90,  // ~45 years remaining
      age50plus: 40,  // ~20 years remaining
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
  defaultReference: number = DEFAULT_MORAL_WEIGHTS.under5
): number {
  return defaultWeight * (customWeight / defaultReference);
}
