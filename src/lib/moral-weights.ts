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
 */

export interface MoralWeights {
  /**
   * Value (in UoV) of averting one death of a person under age 5.
   * Default: ~116-118 UoV based on GiveWell's calculations.
   */
  under5: number;

  /**
   * Value (in UoV) of averting one death of a person age 5-14.
   * Used for calculating "older mortalities" adjustment.
   * Default: ~73-119 UoV depending on exact age range.
   */
  age5to14: number;

  /**
   * Value (in UoV) of averting one death of a person age 15+.
   * Default: ~50-70 UoV (lower due to fewer remaining life-years).
   */
  age15plus: number;
}

/**
 * GiveWell's default moral weights from November 2025 spreadsheets.
 *
 * These represent the "units of value" assigned to averting deaths
 * at different ages, calibrated so that 1 UoV ≈ the value of
 * doubling consumption for one person for one year.
 */
export const DEFAULT_MORAL_WEIGHTS: MoralWeights = {
  under5: 116.25, // Average from GiveWell spreadsheets (ranges 116.25-118.73)
  age5to14: 95.0, // Midpoint estimate for 5-14 age range
  age15plus: 73.19, // From AMF spreadsheet for 5+ adjustment
};

/**
 * Calculate a weighted average moral weight for ages 5+
 * This is used in the "older mortalities" adjustment calculation.
 */
export function getAge5PlusMoralWeight(weights: MoralWeights): number {
  // Simple average of 5-14 and 15+ for now
  // In a more sophisticated model, this would weight by mortality distribution
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
    description: "GiveWell's standard moral weights based on expected life-years",
    weights: DEFAULT_MORAL_WEIGHTS,
  },
  {
    name: "Equal Value",
    description: "All lives valued equally regardless of age",
    weights: {
      under5: 100,
      age5to14: 100,
      age15plus: 100,
    },
  },
  {
    name: "Child-Focused",
    description: "Higher weight on younger lives (more years saved)",
    weights: {
      under5: 150,
      age5to14: 100,
      age15plus: 60,
    },
  },
  {
    name: "Low Discount Rate",
    description: "Higher weights overall (less discounting of future years)",
    weights: {
      under5: 140,
      age5to14: 115,
      age15plus: 90,
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
