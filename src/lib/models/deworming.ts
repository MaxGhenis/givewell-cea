/**
 * Deworming Cost-Effectiveness Model
 *
 * Based on GiveWell's methodology using long-term income effects from
 * Miguel & Kremer (2004) and follow-up studies.
 *
 * Key references:
 * - https://www.givewell.org/international/technical/programs/deworming
 * - https://www.pnas.org/doi/10.1073/pnas.2023185118 (20-year follow-up)
 * - https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models/September-2023-version
 *
 * This model calculates cost-effectiveness based on:
 * 1. Cost per child treated
 * 2. Long-term income effects (from earnings gains)
 * 3. Worm burden adjustment (prevalence in target vs study population)
 * 4. Duration of benefits (with optional decay)
 */

/**
 * GiveWell's benchmark value for comparison
 */
export const BENCHMARK_VALUE_PER_DOLLAR = 0.00333;

export interface DewormingInputs {
  /** Grant size in USD */
  grantSize: number;

  /** Cost per child treated per round (USD) */
  costPerChildTreated: number;

  /** Number of treatment rounds per year */
  roundsPerYear: number;

  /** Proportion of treated children actually infected with worms */
  infectionPrevalence: number;

  /** Long-term income effect (proportion increase in earnings, e.g., 0.13 = 13%) */
  incomeEffect: number;

  /** Worm burden adjustment - ratio of worm burden in target vs study population */
  wormBurdenAdjustment: number;

  /** Years over which income benefits persist */
  benefitDurationYears: number;

  /** Annual decay rate of benefits (0 = no decay, 0.12 = 12% annual decay) */
  benefitDecayRate: number;

  /** Discount rate for future income */
  discountRate: number;

  /** Baseline annual income of beneficiaries (PPP USD) */
  baselineIncome: number;

  /** Average age of treatment (years) */
  averageAgeAtTreatment: number;

  /** Age at which income benefits begin (typically after education) */
  ageIncomeBenefitsBegin: number;

  /** Adjustment for program coverage/quality */
  programAdjustment: number;

  /** Adjustment for uncertainty in evidence */
  evidenceAdjustment: number;
}

export interface DewormingResults {
  /** Number of children treated */
  childrenTreated: number;

  /** Number of children benefiting (infected and treated) */
  childrenBenefiting: number;

  /** Present value of income gains per benefiting child */
  pvIncomeGainPerChild: number;

  /** Total present value of income gains */
  totalPvIncomeGains: number;

  /** Value in units of value (comparable to benchmark) */
  totalValue: number;

  /** Cost-effectiveness in multiples of benchmark */
  xBenchmark: number;
}

/**
 * Calculate deworming cost-effectiveness
 */
export function calculateDeworming(inputs: DewormingInputs): DewormingResults {
  // Total annual cost per child
  const annualCostPerChild = inputs.costPerChildTreated * inputs.roundsPerYear;

  // Number of children treated
  const childrenTreated = inputs.grantSize / annualCostPerChild;

  // Children who actually benefit (those infected)
  const childrenBenefiting = childrenTreated * inputs.infectionPrevalence;

  // Years until income benefits begin
  const yearsUntilBenefits = inputs.ageIncomeBenefitsBegin - inputs.averageAgeAtTreatment;

  // Calculate present value of income gains per child
  // Income gain each year = baseline income × income effect × worm burden adj
  const annualIncomeGain =
    inputs.baselineIncome *
    inputs.incomeEffect *
    inputs.wormBurdenAdjustment *
    inputs.programAdjustment *
    inputs.evidenceAdjustment;

  // Sum discounted income gains over benefit duration
  let pvIncomeGainPerChild = 0;
  for (let year = 0; year < inputs.benefitDurationYears; year++) {
    // Years from treatment to this income year
    const yearsFromTreatment = yearsUntilBenefits + year;

    // Apply benefit decay
    const decayMultiplier = Math.pow(1 - inputs.benefitDecayRate, year);

    // Discount to present value
    const discountFactor = Math.pow(1 + inputs.discountRate, -yearsFromTreatment);

    pvIncomeGainPerChild += annualIncomeGain * decayMultiplier * discountFactor;
  }

  // Total present value of income gains
  const totalPvIncomeGains = pvIncomeGainPerChild * childrenBenefiting;

  // Convert to units of value
  // GiveWell uses log utility: value = ln(1 + gain/baseline)
  // For small gains relative to baseline, this approximates gain/baseline
  // Then multiply by baseline consumption doubling value
  //
  // The benchmark is ~0.00333 UoV per dollar, which represents
  // the value of doubling consumption for someone at the poverty line.
  // Income gains are valued at log utility rate relative to consumption.
  const logUtilityValue = Math.log(1 + pvIncomeGainPerChild / inputs.baselineIncome);
  const totalValue = logUtilityValue * childrenBenefiting;

  // Cost-effectiveness as multiple of benchmark
  // Scale appropriately - benchmark is per dollar spent
  const xBenchmark = (totalValue / inputs.grantSize) / BENCHMARK_VALUE_PER_DOLLAR;

  return {
    childrenTreated,
    childrenBenefiting,
    pvIncomeGainPerChild,
    totalPvIncomeGains,
    totalValue,
    xBenchmark,
  };
}
