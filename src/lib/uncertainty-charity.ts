/**
 * Charity-specific Monte Carlo Simulation
 *
 * This module provides functions to run uncertainty analysis on each
 * charity's cost-effectiveness calculations.
 */

import {
  runMonteCarloSimulation,
  sampleLogNormal,
  sampleTruncatedNormal,
  type MonteCarloResults,
} from "./uncertainty";
export type { MonteCarloResults } from "./uncertainty";
import {
  calculateCharity,
  type CharityInputs,
  type CharityType,
} from "./models";
import type { AMFInputs } from "./models/amf";
import type { MalariaConsortiumInputs } from "./models/malaria-consortium";
import type { HelenKellerInputs } from "./models/helen-keller";
import type { NewIncentivesInputs } from "./models/new-incentives";

/**
 * Configuration for uncertainty ranges.
 * Values represent the factor (e.g., 0.2 = ±20%) for each parameter type.
 */
export interface UncertaintyConfig {
  costPerReached: number;
  mortalityRate: number;
  interventionEffect: number;
  yearsOfCoverage: number;
  adjustments: number;
}

export const DEFAULT_UNCERTAINTY_CONFIG: UncertaintyConfig = {
  costPerReached: 0.2,
  mortalityRate: 0.3,
  interventionEffect: 0.25,
  yearsOfCoverage: 0.15,
  adjustments: 0.4,
};

/**
 * Sample AMF inputs with uncertainty
 */
function sampleAMFInputs(
  baseInputs: AMFInputs,
  config: UncertaintyConfig
): AMFInputs {
  return {
    ...baseInputs,
    costPerUnder5Reached: sampleLogNormal(
      baseInputs.costPerUnder5Reached,
      baseInputs.costPerUnder5Reached * (1 - config.costPerReached),
      baseInputs.costPerUnder5Reached * (1 + config.costPerReached)
    ),
    malariaMortalityRate: sampleLogNormal(
      baseInputs.malariaMortalityRate,
      baseInputs.malariaMortalityRate * (1 - config.mortalityRate),
      baseInputs.malariaMortalityRate * (1 + config.mortalityRate)
    ),
    itnEffectOnDeaths: sampleTruncatedNormal(
      baseInputs.itnEffectOnDeaths,
      baseInputs.itnEffectOnDeaths * config.interventionEffect,
      0.05,
      0.8
    ),
    yearsEffectiveCoverage: sampleLogNormal(
      baseInputs.yearsEffectiveCoverage,
      baseInputs.yearsEffectiveCoverage * (1 - config.yearsOfCoverage),
      baseInputs.yearsEffectiveCoverage * (1 + config.yearsOfCoverage)
    ),
    adjustmentOlderMortalities: sampleTruncatedNormal(
      baseInputs.adjustmentOlderMortalities,
      baseInputs.adjustmentOlderMortalities * config.adjustments,
      0,
      1
    ),
    adjustmentDevelopmental: sampleTruncatedNormal(
      baseInputs.adjustmentDevelopmental,
      baseInputs.adjustmentDevelopmental * config.adjustments,
      0,
      1.5
    ),
  };
}

/**
 * Sample Malaria Consortium inputs with uncertainty
 */
function sampleMCInputs(
  baseInputs: MalariaConsortiumInputs,
  config: UncertaintyConfig
): MalariaConsortiumInputs {
  return {
    ...baseInputs,
    costPerChildReached: sampleLogNormal(
      baseInputs.costPerChildReached,
      baseInputs.costPerChildReached * (1 - config.costPerReached),
      baseInputs.costPerChildReached * (1 + config.costPerReached)
    ),
    malariaMortalityRate: sampleLogNormal(
      baseInputs.malariaMortalityRate,
      baseInputs.malariaMortalityRate * (1 - config.mortalityRate),
      baseInputs.malariaMortalityRate * (1 + config.mortalityRate)
    ),
    smcEffect: sampleTruncatedNormal(
      baseInputs.smcEffect,
      baseInputs.smcEffect * config.interventionEffect,
      0.3,
      1
    ),
    adjustmentOlderMortalities: sampleTruncatedNormal(
      baseInputs.adjustmentOlderMortalities,
      baseInputs.adjustmentOlderMortalities * config.adjustments,
      0,
      0.5
    ),
    adjustmentDevelopmental: sampleTruncatedNormal(
      baseInputs.adjustmentDevelopmental,
      baseInputs.adjustmentDevelopmental * config.adjustments,
      0,
      1
    ),
  };
}

/**
 * Sample Helen Keller inputs with uncertainty
 */
function sampleHKInputs(
  baseInputs: HelenKellerInputs,
  config: UncertaintyConfig
): HelenKellerInputs {
  return {
    ...baseInputs,
    costPerPersonUnder5: sampleLogNormal(
      baseInputs.costPerPersonUnder5,
      baseInputs.costPerPersonUnder5 * (1 - config.costPerReached),
      baseInputs.costPerPersonUnder5 * (1 + config.costPerReached)
    ),
    mortalityRateUnder5: sampleLogNormal(
      baseInputs.mortalityRateUnder5,
      baseInputs.mortalityRateUnder5 * (1 - config.mortalityRate),
      baseInputs.mortalityRateUnder5 * (1 + config.mortalityRate)
    ),
    vasEffect: sampleTruncatedNormal(
      baseInputs.vasEffect,
      baseInputs.vasEffect * config.interventionEffect,
      0.02,
      0.2
    ),
    adjustmentDevelopmental: sampleTruncatedNormal(
      baseInputs.adjustmentDevelopmental,
      baseInputs.adjustmentDevelopmental * config.adjustments,
      0,
      0.5
    ),
  };
}

/**
 * Sample New Incentives inputs with uncertainty
 */
function sampleNIInputs(
  baseInputs: NewIncentivesInputs,
  config: UncertaintyConfig
): NewIncentivesInputs {
  return {
    ...baseInputs,
    costPerChildReached: sampleLogNormal(
      baseInputs.costPerChildReached,
      baseInputs.costPerChildReached * (1 - config.costPerReached),
      baseInputs.costPerChildReached * (1 + config.costPerReached)
    ),
    probabilityDeathUnvaccinated: sampleLogNormal(
      baseInputs.probabilityDeathUnvaccinated,
      baseInputs.probabilityDeathUnvaccinated * (1 - config.mortalityRate),
      baseInputs.probabilityDeathUnvaccinated * (1 + config.mortalityRate)
    ),
    vaccineEffect: sampleTruncatedNormal(
      baseInputs.vaccineEffect,
      baseInputs.vaccineEffect * config.interventionEffect,
      0.3,
      0.8
    ),
    adjustmentOlderMortalities: sampleTruncatedNormal(
      baseInputs.adjustmentOlderMortalities,
      baseInputs.adjustmentOlderMortalities * config.adjustments,
      0,
      0.4
    ),
    adjustmentDevelopmental: sampleTruncatedNormal(
      baseInputs.adjustmentDevelopmental,
      baseInputs.adjustmentDevelopmental * config.adjustments,
      0,
      0.5
    ),
  };
}

/**
 * Run Monte Carlo simulation for a charity's cost-effectiveness
 */
export function runCharityMonteCarlo(
  charityInputs: CharityInputs,
  numSimulations = 1000,
  config: UncertaintyConfig = DEFAULT_UNCERTAINTY_CONFIG
): MonteCarloResults {
  const sampleFn = (): CharityInputs => {
    switch (charityInputs.type) {
      case "amf":
        return {
          type: "amf",
          inputs: sampleAMFInputs(charityInputs.inputs, config),
        };
      case "malaria-consortium":
        return {
          type: "malaria-consortium",
          inputs: sampleMCInputs(charityInputs.inputs, config),
        };
      case "helen-keller":
        return {
          type: "helen-keller",
          inputs: sampleHKInputs(charityInputs.inputs, config),
        };
      case "new-incentives":
        return {
          type: "new-incentives",
          inputs: sampleNIInputs(charityInputs.inputs, config),
        };
    }
  };

  const calculateFn = (inputs: CharityInputs): number => {
    return calculateCharity(inputs).finalXBenchmark;
  };

  return runMonteCarloSimulation(numSimulations, sampleFn, calculateFn);
}

/**
 * Results for all charities
 */
export interface AllCharitiesMonteCarloResults {
  amf: MonteCarloResults;
  "malaria-consortium": MonteCarloResults;
  "helen-keller": MonteCarloResults;
  "new-incentives": MonteCarloResults;
}

/**
 * Run Monte Carlo for all charities
 */
export function runAllCharitiesMonteCarlo(
  allInputs: Record<CharityType, CharityInputs>,
  numSimulations = 1000,
  config: UncertaintyConfig = DEFAULT_UNCERTAINTY_CONFIG
): AllCharitiesMonteCarloResults {
  return {
    amf: runCharityMonteCarlo(allInputs.amf, numSimulations, config),
    "malaria-consortium": runCharityMonteCarlo(
      allInputs["malaria-consortium"],
      numSimulations,
      config
    ),
    "helen-keller": runCharityMonteCarlo(
      allInputs["helen-keller"],
      numSimulations,
      config
    ),
    "new-incentives": runCharityMonteCarlo(
      allInputs["new-incentives"],
      numSimulations,
      config
    ),
  };
}
