/**
 * Uncertainty Analysis Module
 *
 * This module provides Monte Carlo simulation capabilities for estimating
 * uncertainty in cost-effectiveness calculations. Instead of point estimates,
 * users can see probability distributions and confidence intervals.
 *
 * Key concepts:
 * - Each parameter can have an uncertainty range (typically ± some percentage)
 * - Monte Carlo runs many simulations with randomly sampled parameters
 * - Results show the distribution of possible outcomes
 */

/**
 * Represents uncertainty around a parameter value.
 * Parameters are assumed to follow a log-normal distribution to prevent
 * negative values and reflect the typically right-skewed nature of estimates.
 */
export interface ParameterUncertainty {
  /** The parameter name/key */
  name: string;
  /** The central (most likely) value */
  value: number;
  /** Lower bound (e.g., 10th percentile) */
  low: number;
  /** Upper bound (e.g., 90th percentile) */
  high: number;
}

/**
 * Results from a Monte Carlo simulation
 */
export interface MonteCarloResults {
  /** Number of simulations run */
  numSimulations: number;
  /** All simulated values (sorted) */
  samples: number[];
  /** Mean of all simulations */
  mean: number;
  /** Median (50th percentile) */
  median: number;
  /** 5th percentile (lower bound of 90% CI) */
  percentile5: number;
  /** 10th percentile */
  percentile10: number;
  /** 25th percentile (lower quartile) */
  percentile25: number;
  /** 75th percentile (upper quartile) */
  percentile75: number;
  /** 90th percentile */
  percentile90: number;
  /** 95th percentile (upper bound of 90% CI) */
  percentile95: number;
  /** Standard deviation */
  stdDev: number;
}

/**
 * Default uncertainty ranges for key parameters.
 * These represent typical uncertainty in GiveWell's estimates.
 */
export const DEFAULT_UNCERTAINTY_RANGES = {
  // Program parameters typically have ±20-30% uncertainty
  costPerReached: 0.2, // ±20%
  mortalityRate: 0.3, // ±30%
  interventionEffect: 0.25, // ±25%
  yearsOfCoverage: 0.15, // ±15%

  // Adjustment factors have higher uncertainty
  developmentalAdjustment: 0.5, // ±50%
  fungingAdjustment: 0.5, // ±50%
  leverageAdjustment: 0.4, // ±40%

  // Moral weights have moderate uncertainty
  moralWeight: 0.2, // ±20%
};

/**
 * Generate a random sample from a log-normal distribution.
 *
 * Log-normal is appropriate for cost-effectiveness parameters because:
 * 1. Values are always positive
 * 2. Uncertainties are often proportional to the value
 * 3. True distributions tend to be right-skewed
 *
 * @param median - The median value (geometric mean of log-normal)
 * @param low - The value at the 10th percentile
 * @param high - The value at the 90th percentile
 */
export function sampleLogNormal(
  median: number,
  low: number,
  high: number
): number {
  // Calculate log parameters
  const mu = Math.log(median);

  // Use the ratio of high/low to estimate sigma
  // For log-normal: log(high/low) ≈ 2 * z * sigma where z is the z-score
  const z = 1.645; // Z-score for 10th/90th percentile
  const sigma = Math.log(high / low) / (2 * z);

  // Generate standard normal random variable using Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const standardNormal =
    Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Transform to log-normal
  return Math.exp(mu + sigma * standardNormal);
}

/**
 * Generate a random sample from a truncated normal distribution.
 * Useful for parameters that can be negative (like adjustment factors)
 * but should stay within reasonable bounds.
 */
export function sampleTruncatedNormal(
  mean: number,
  stdDev: number,
  min: number,
  max: number
): number {
  let sample: number;
  let attempts = 0;

  // Rejection sampling with max attempts
  do {
    const u1 = Math.random();
    const u2 = Math.random();
    const standardNormal =
      Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    sample = mean + stdDev * standardNormal;
    attempts++;
  } while ((sample < min || sample > max) && attempts < 100);

  // Clamp if we hit max attempts
  return Math.max(min, Math.min(max, sample));
}

/**
 * Calculate percentile from sorted array
 */
export function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  const index = (sortedArray.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1];
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff =
    squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Run Monte Carlo simulation on a calculation function.
 *
 * @param numSimulations - Number of simulations to run (default 1000)
 * @param sampleParameters - Function that returns randomly sampled parameters
 * @param calculate - Function that calculates the result from parameters
 */
export function runMonteCarloSimulation<T>(
  numSimulations: number,
  sampleParameters: () => T,
  calculate: (params: T) => number
): MonteCarloResults {
  const samples: number[] = [];

  for (let i = 0; i < numSimulations; i++) {
    const params = sampleParameters();
    const result = calculate(params);
    if (isFinite(result) && !isNaN(result)) {
      samples.push(result);
    }
  }

  // Sort for percentile calculations
  samples.sort((a, b) => a - b);

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const median = percentile(samples, 0.5);
  const stdDev = standardDeviation(samples, mean);

  return {
    numSimulations,
    samples,
    mean,
    median,
    percentile5: percentile(samples, 0.05),
    percentile10: percentile(samples, 0.1),
    percentile25: percentile(samples, 0.25),
    percentile75: percentile(samples, 0.75),
    percentile90: percentile(samples, 0.9),
    percentile95: percentile(samples, 0.95),
    stdDev,
  };
}

/**
 * Create histogram bins from Monte Carlo results
 */
export interface HistogramBin {
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export function createHistogram(
  samples: number[],
  numBins = 20
): HistogramBin[] {
  if (samples.length === 0) return [];

  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const binWidth = (max - min) / numBins;

  const bins: HistogramBin[] = [];
  for (let i = 0; i < numBins; i++) {
    bins.push({
      min: min + i * binWidth,
      max: min + (i + 1) * binWidth,
      count: 0,
      percentage: 0,
    });
  }

  // Count samples in each bin
  for (const sample of samples) {
    const binIndex = Math.min(
      Math.floor((sample - min) / binWidth),
      numBins - 1
    );
    bins[binIndex].count++;
  }

  // Calculate percentages
  for (const bin of bins) {
    bin.percentage = (bin.count / samples.length) * 100;
  }

  return bins;
}
