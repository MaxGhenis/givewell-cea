/**
 * Calculation Breakdown Components
 *
 * Visualizes the step-by-step calculations for each charity's
 * cost-effectiveness analysis with intermediate values and source citations.
 */

import { useMemo } from "react";
import type { AMFInputs } from "../lib/models/amf";
import type { MalariaConsortiumInputs } from "../lib/models/malaria-consortium";
import type { HelenKellerInputs } from "../lib/models/helen-keller";
import type { NewIncentivesInputs } from "../lib/models/new-incentives";
import type { GiveDirectlyInputs } from "../lib/models/givedirectly";
import type { DewormingInputs } from "../lib/models/deworming";
import type { CharityInputs, UnifiedResults } from "../lib/models";

interface CalculationStepProps {
  label: string;
  formula?: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  indent?: number;
}

function CalculationStep({ label, formula, value, unit, highlight, indent = 0 }: CalculationStepProps) {
  const displayValue = typeof value === "number"
    ? (value >= 1000000 ? `${(value / 1000000).toFixed(2)}M`
      : value >= 1000 ? `${(value / 1000).toFixed(2)}K`
      : value >= 1 ? value.toFixed(2)
      : value >= 0.0001 ? value.toFixed(4)
      : value.toExponential(2))
    : value;

  return (
    <div
      className={`calc-step ${highlight ? "calc-step-highlight" : ""}`}
      style={{ marginLeft: `${indent * 16}px` }}
    >
      <div className="calc-step-label">{label}</div>
      {formula && <div className="calc-step-formula">{formula}</div>}
      <div className="calc-step-value">
        {displayValue}{unit && <span className="calc-step-unit">{unit}</span>}
      </div>
    </div>
  );
}

interface SourceCitationProps {
  parameter: string;
  source: string;
  url?: string;
}

function SourceCitation({ parameter, source, url }: SourceCitationProps) {
  return (
    <div className="source-citation">
      <span className="source-param">{parameter}:</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="source-link">
          {source}
        </a>
      ) : (
        <span className="source-text">{source}</span>
      )}
    </div>
  );
}

// AMF Calculation Breakdown
function AMFBreakdown({ inputs, results }: { inputs: AMFInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const peopleReached = inputs.grantSize / inputs.costPerUnder5Reached;
    const deathsAverted = peopleReached * inputs.yearsEffectiveCoverage *
      inputs.malariaMortalityRate * inputs.itnEffectOnDeaths;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    const ceWithOlder = initialCE * (1 + inputs.adjustmentOlderMortalities);
    const ceWithDev = ceWithOlder * (1 + inputs.adjustmentDevelopmental);
    return { peopleReached, deathsAverted, valueGenerated, benchmarkValue, initialCE, ceWithOlder, ceWithDev };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. People Reached</h5>
        <CalculationStep
          label="Grant size ÷ Cost per child"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ $${inputs.costPerUnder5Reached.toFixed(2)}`}
          value={intermediates.peopleReached}
          unit=" children"
        />
      </div>

      <div className="calc-section">
        <h5>2. Deaths Averted (Under 5)</h5>
        <CalculationStep
          label="Children × Years × Mortality Rate × ITN Effect"
          formula={`${(intermediates.peopleReached/1000).toFixed(1)}K × ${inputs.yearsEffectiveCoverage.toFixed(2)} × ${(inputs.malariaMortalityRate*100).toFixed(3)}% × ${(inputs.itnEffectOnDeaths*100).toFixed(1)}%`}
          value={intermediates.deathsAverted}
          unit=" deaths averted"
        />
      </div>

      <div className="calc-section">
        <h5>3. Value Generated</h5>
        <CalculationStep
          label="Deaths averted × Moral weight"
          formula={`${intermediates.deathsAverted.toFixed(1)} × ${inputs.moralWeightUnder5.toFixed(1)} UoV`}
          value={intermediates.valueGenerated}
          unit=" UoV"
        />
      </div>

      <div className="calc-section">
        <h5>4. Initial Cost-Effectiveness</h5>
        <CalculationStep
          label="Value ÷ Benchmark value"
          formula={`${intermediates.valueGenerated.toFixed(0)} ÷ ${intermediates.benchmarkValue.toFixed(0)}`}
          value={intermediates.initialCE}
          unit="× benchmark"
        />
      </div>

      <div className="calc-section">
        <h5>5. Adjustments Applied</h5>
        <CalculationStep
          label="+ Older mortalities"
          formula={`× (1 + ${(inputs.adjustmentOlderMortalities*100).toFixed(1)}%)`}
          value={intermediates.ceWithOlder}
          unit="×"
          indent={1}
        />
        <CalculationStep
          label="+ Developmental benefits"
          formula={`× (1 + ${(inputs.adjustmentDevelopmental*100).toFixed(1)}%)`}
          value={intermediates.ceWithDev}
          unit="×"
          indent={1}
        />
        <CalculationStep
          label="+ Program benefits, grantee, leverage, funging"
          formula={`× (1 + ${(inputs.adjustmentProgramBenefits*100).toFixed(0)}%) × (1 ${inputs.adjustmentGrantee >= 0 ? '+' : ''}${(inputs.adjustmentGrantee*100).toFixed(0)}%) × ...`}
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
          indent={1}
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Cost per child"
          source="GiveWell Nov 2025 CEA, 'AMF' sheet, Row 8"
          url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc"
        />
        <SourceCitation
          parameter="Malaria mortality rate"
          source="GiveWell Nov 2025 CEA, derived from WHO data"
          url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc"
        />
        <SourceCitation
          parameter="ITN effect on deaths"
          source="Cochrane Review meta-analysis (Lengeler 2004)"
          url="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000363.pub2/full"
        />
        <SourceCitation
          parameter="Moral weights"
          source="GiveWell Moral Weights Tool"
          url="https://docs.google.com/spreadsheets/d/11HsJLpq0Suf3SK_PmzzWpK1tr_BTd364j0l3xVvSCQw"
        />
      </div>
    </div>
  );
}

// Malaria Consortium Breakdown
function MCBreakdown({ inputs, results }: { inputs: MalariaConsortiumInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const childrenReached = inputs.grantSize / inputs.costPerChildReached;
    const deathsAverted = childrenReached * inputs.malariaMortalityRate *
      inputs.proportionMortalityDuringSeason * inputs.smcEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { childrenReached, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. Children Reached</h5>
        <CalculationStep
          label="Grant size ÷ Cost per child"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ $${inputs.costPerChildReached.toFixed(2)}`}
          value={intermediates.childrenReached}
          unit=" children"
        />
      </div>

      <div className="calc-section">
        <h5>2. Deaths Averted</h5>
        <CalculationStep
          label="Children × Mortality × Season proportion × SMC effect"
          formula={`${(intermediates.childrenReached/1000).toFixed(0)}K × ${(inputs.malariaMortalityRate*100).toFixed(2)}% × ${(inputs.proportionMortalityDuringSeason*100).toFixed(0)}% × ${(inputs.smcEffect*100).toFixed(0)}%`}
          value={intermediates.deathsAverted}
          unit=" deaths"
        />
      </div>

      <div className="calc-section">
        <h5>3. Initial Cost-Effectiveness</h5>
        <CalculationStep
          label="(Deaths × Moral weight) ÷ Benchmark"
          value={intermediates.initialCE}
          unit="× benchmark"
        />
      </div>

      <div className="calc-section">
        <h5>4. Final (with adjustments)</h5>
        <CalculationStep
          label="After older mortalities, developmental, program adjustments"
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Cost per child"
          source="GiveWell Nov 2025 CEA, 'SMC' sheet"
          url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc"
        />
        <SourceCitation
          parameter="SMC effect"
          source="Meremikwu et al. Cochrane Review (2012)"
          url="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD006657.pub2/full"
        />
      </div>
    </div>
  );
}

// Helen Keller Breakdown
function HKBreakdown({ inputs, results }: { inputs: HelenKellerInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const peopleReached = inputs.grantSize / inputs.costPerPersonUnder5;
    const incrementalReached = peopleReached * (1 - inputs.proportionReachedCounterfactual);
    const deathsAverted = incrementalReached * inputs.mortalityRateUnder5 * inputs.vasEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { peopleReached, incrementalReached, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. People Reached</h5>
        <CalculationStep
          label="Grant size ÷ Cost per child"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ $${inputs.costPerPersonUnder5.toFixed(2)}`}
          value={intermediates.peopleReached}
          unit=" children"
        />
        <CalculationStep
          label="Incremental (counterfactual-adjusted)"
          formula={`${(intermediates.peopleReached/1000000).toFixed(2)}M × (1 - ${(inputs.proportionReachedCounterfactual*100).toFixed(0)}%)`}
          value={intermediates.incrementalReached}
          unit=" children"
          indent={1}
        />
      </div>

      <div className="calc-section">
        <h5>2. Deaths Averted</h5>
        <CalculationStep
          label="Incremental × Mortality rate × VAS effect"
          formula={`${(intermediates.incrementalReached/1000000).toFixed(2)}M × ${(inputs.mortalityRateUnder5*100).toFixed(2)}% × ${(inputs.vasEffect*100).toFixed(1)}%`}
          value={intermediates.deathsAverted}
          unit=" deaths"
        />
      </div>

      <div className="calc-section">
        <h5>3. Initial Cost-Effectiveness</h5>
        <CalculationStep
          label="(Deaths × Moral weight) ÷ Benchmark"
          value={intermediates.initialCE}
          unit="× benchmark"
        />
      </div>

      <div className="calc-section">
        <h5>4. Final (with adjustments)</h5>
        <CalculationStep
          label="After developmental, program, leverage, funging adjustments"
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Cost per child"
          source="GiveWell Nov 2025 CEA, 'VAS' sheet"
          url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc"
        />
        <SourceCitation
          parameter="VAS effect on mortality"
          source="Imdad et al. BMJ (2017) meta-analysis"
          url="https://www.bmj.com/content/357/bmj.j2340"
        />
      </div>
    </div>
  );
}

// New Incentives Breakdown
function NIBreakdown({ inputs, results }: { inputs: NewIncentivesInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const childrenReached = inputs.grantSize / inputs.costPerChildReached;
    const incrementalVaccinated = childrenReached * (1 - inputs.proportionReachedCounterfactual);
    const deathsAverted = incrementalVaccinated * inputs.probabilityDeathUnvaccinated * inputs.vaccineEffect;
    const valueGenerated = deathsAverted * inputs.moralWeightUnder5;
    const benchmarkValue = inputs.grantSize * 0.00333;
    const initialCE = valueGenerated / benchmarkValue;
    return { childrenReached, incrementalVaccinated, deathsAverted, valueGenerated, benchmarkValue, initialCE };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. Children Reached</h5>
        <CalculationStep
          label="Grant size ÷ Cost per child"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ $${inputs.costPerChildReached.toFixed(2)}`}
          value={intermediates.childrenReached}
          unit=" children"
        />
        <CalculationStep
          label="Incremental vaccinations"
          formula={`${(intermediates.childrenReached/1000).toFixed(1)}K × (1 - ${(inputs.proportionReachedCounterfactual*100).toFixed(1)}%)`}
          value={intermediates.incrementalVaccinated}
          unit=" children"
          indent={1}
        />
      </div>

      <div className="calc-section">
        <h5>2. Deaths Averted</h5>
        <CalculationStep
          label="Incremental × Death prob. × Vaccine effect"
          formula={`${intermediates.incrementalVaccinated.toFixed(0)} × ${(inputs.probabilityDeathUnvaccinated*100).toFixed(1)}% × ${(inputs.vaccineEffect*100).toFixed(0)}%`}
          value={intermediates.deathsAverted}
          unit=" deaths"
        />
      </div>

      <div className="calc-section">
        <h5>3. Initial Cost-Effectiveness</h5>
        <CalculationStep
          label="(Deaths × Moral weight) ÷ Benchmark"
          value={intermediates.initialCE}
          unit="× benchmark"
        />
      </div>

      <div className="calc-section">
        <h5>4. Final (with adjustments)</h5>
        <CalculationStep
          label="After older mortalities, developmental, consumption, program adjustments"
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Cost per child"
          source="GiveWell Nov 2025 CEA, 'NI' sheet"
          url="https://docs.google.com/spreadsheets/d/1VEtie59TgRvZSEVjfG7qcKBKcQyJn8zO91Lau9YNqXc"
        />
        <SourceCitation
          parameter="Vaccine effect"
          source="WHO vaccine efficacy data"
          url="https://www.who.int/teams/immunization-vaccines-and-biologicals"
        />
      </div>
    </div>
  );
}

// GiveDirectly Breakdown
function GDBreakdown({ inputs, results }: { inputs: GiveDirectlyInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const costPerHH = inputs.transferAmount * (1 + inputs.overheadRate);
    const households = inputs.grantSize / costPerHH;
    const people = households * inputs.householdSize;
    const annualIncrease = inputs.transferAmount / inputs.consumptionPersistenceYears;
    const utilityGain = Math.log((inputs.baselineConsumption + annualIncrease) / inputs.baselineConsumption);
    const consumptionValue = utilityGain * inputs.householdSize * inputs.consumptionPersistenceYears * households;
    const spilloverValue = consumptionValue * (inputs.spilloverMultiplier - 1) * (1 - inputs.spilloverDiscount);
    const under5Pop = people * inputs.proportionUnder5;
    const deathsAverted = under5Pop * inputs.under5MortalityRate * inputs.mortalityEffect * (1 - inputs.mortalityDiscount);
    const mortalityValue = deathsAverted * inputs.moralWeightUnder5;
    const totalValue = consumptionValue + spilloverValue + mortalityValue;
    return { costPerHH, households, people, consumptionValue, spilloverValue, deathsAverted, mortalityValue, totalValue };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. Households Reached</h5>
        <CalculationStep
          label="Grant ÷ (Transfer × (1 + Overhead))"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ ($${inputs.transferAmount} × ${(1+inputs.overheadRate).toFixed(2)})`}
          value={intermediates.households}
          unit=" households"
        />
        <CalculationStep
          label="People reached"
          formula={`${intermediates.households.toFixed(0)} × ${inputs.householdSize}`}
          value={intermediates.people}
          unit=" people"
          indent={1}
        />
      </div>

      <div className="calc-section">
        <h5>2. Consumption Value (log utility)</h5>
        <CalculationStep
          label="ln((baseline + transfer/years) / baseline) × HH size × years × HHs"
          value={intermediates.consumptionValue}
          unit=" UoV"
        />
      </div>

      <div className="calc-section">
        <h5>3. Spillover Value</h5>
        <CalculationStep
          label="Consumption × (multiplier - 1) × (1 - discount)"
          formula={`${intermediates.consumptionValue.toFixed(0)} × ${(inputs.spilloverMultiplier-1).toFixed(1)} × ${(1-inputs.spilloverDiscount).toFixed(2)}`}
          value={intermediates.spilloverValue}
          unit=" UoV"
        />
      </div>

      <div className="calc-section">
        <h5>4. Mortality Value</h5>
        <CalculationStep
          label="Under-5 deaths averted × moral weight"
          formula={`${intermediates.deathsAverted.toFixed(2)} × ${inputs.moralWeightUnder5}`}
          value={intermediates.mortalityValue}
          unit=" UoV"
        />
      </div>

      <div className="calc-section">
        <h5>5. Total Cost-Effectiveness</h5>
        <CalculationStep
          label="(Consumption + Spillover + Mortality) ÷ (Grant × benchmark)"
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Spillover multiplier (2.5×)"
          source="Egger et al. (2022) - Kenya GE effects"
          url="https://www.nber.org/papers/w26600"
        />
        <SourceCitation
          parameter="Mortality effect (23%)"
          source="Banerjee et al. (2023), discounted 50%"
          url="https://www.pnas.org/doi/10.1073/pnas.2215588120"
        />
        <SourceCitation
          parameter="Baseline consumption"
          source="GiveWell Nov 2024 Re-evaluation"
          url="https://blog.givewell.org/2024/11/12/re-evaluating-the-impact-of-unconditional-cash-transfers/"
        />
      </div>
    </div>
  );
}

// Deworming Breakdown
function DWBreakdown({ inputs, results }: { inputs: DewormingInputs; results: UnifiedResults }) {
  const intermediates = useMemo(() => {
    const childrenTreated = inputs.grantSize / (inputs.costPerChildTreated * inputs.roundsPerYear);
    const childrenBenefiting = childrenTreated * inputs.infectionPrevalence;
    const yearsUntilBenefits = inputs.ageIncomeBenefitsBegin - inputs.averageAgeAtTreatment;
    const annualGain = inputs.baselineIncome * inputs.incomeEffect * inputs.wormBurdenAdjustment *
      inputs.programAdjustment * inputs.evidenceAdjustment;

    // Simplified PV calculation
    let pvPerChild = 0;
    for (let y = 0; y < inputs.benefitDurationYears; y++) {
      const decay = Math.pow(1 - inputs.benefitDecayRate, y);
      const discount = Math.pow(1 + inputs.discountRate, -(yearsUntilBenefits + y));
      pvPerChild += annualGain * decay * discount;
    }

    const totalPV = pvPerChild * childrenBenefiting;
    const logUtility = Math.log(1 + pvPerChild / inputs.baselineIncome);
    const totalValue = logUtility * childrenBenefiting;

    return { childrenTreated, childrenBenefiting, annualGain, pvPerChild, totalPV, totalValue };
  }, [inputs]);

  return (
    <div className="calculation-breakdown">
      <h4>Calculation Breakdown</h4>

      <div className="calc-section">
        <h5>1. Children Treated</h5>
        <CalculationStep
          label="Grant ÷ Cost per child"
          formula={`$${(inputs.grantSize/1000000).toFixed(1)}M ÷ $${inputs.costPerChildTreated.toFixed(2)}`}
          value={intermediates.childrenTreated}
          unit=" children"
        />
        <CalculationStep
          label="Children benefiting (infected)"
          formula={`${(intermediates.childrenTreated/1000000).toFixed(1)}M × ${(inputs.infectionPrevalence*100).toFixed(0)}%`}
          value={intermediates.childrenBenefiting}
          unit=" children"
          indent={1}
        />
      </div>

      <div className="calc-section">
        <h5>2. Annual Income Gain (adjusted)</h5>
        <CalculationStep
          label="Baseline × Effect × Worm burden × Program × Evidence"
          formula={`$${inputs.baselineIncome} × ${(inputs.incomeEffect*100).toFixed(0)}% × ${(inputs.wormBurdenAdjustment*100).toFixed(0)}% × ${(inputs.programAdjustment*100).toFixed(0)}% × ${(inputs.evidenceAdjustment*100).toFixed(0)}%`}
          value={intermediates.annualGain}
          unit="/year"
        />
      </div>

      <div className="calc-section">
        <h5>3. Present Value per Child</h5>
        <CalculationStep
          label={`Sum over ${inputs.benefitDurationYears} years, discounted at ${(inputs.discountRate*100).toFixed(0)}%`}
          value={intermediates.pvPerChild}
          unit=" (PV)"
        />
      </div>

      <div className="calc-section">
        <h5>4. Total Value (log utility)</h5>
        <CalculationStep
          label="ln(1 + PV/baseline) × children benefiting"
          value={intermediates.totalValue}
          unit=" UoV"
        />
      </div>

      <div className="calc-section">
        <h5>5. Cost-Effectiveness</h5>
        <CalculationStep
          label="Total value ÷ (Grant × benchmark)"
          value={results.finalXBenchmark}
          unit="× benchmark"
          highlight
        />
      </div>

      <div className="sources-section">
        <h5>Parameter Sources</h5>
        <SourceCitation
          parameter="Income effect (13%)"
          source="Miguel & Kremer (2004) + 20-year follow-up"
          url="https://www.pnas.org/doi/10.1073/pnas.2023185118"
        />
        <SourceCitation
          parameter="Worm burden adjustment"
          source="GiveWell Sept 2023 CEA"
          url="https://www.givewell.org/how-we-work/our-criteria/cost-effectiveness/cost-effectiveness-models"
        />
        <SourceCitation
          parameter="Evidence adjustment (50%)"
          source="GiveWell replicability discount"
          url="https://www.givewell.org/international/technical/programs/deworming"
        />
      </div>
    </div>
  );
}

// Main component that renders the appropriate breakdown
interface CalculationBreakdownProps {
  charityInputs: CharityInputs;
  results: UnifiedResults;
}

export function CalculationBreakdown({ charityInputs, results }: CalculationBreakdownProps) {
  switch (charityInputs.type) {
    case "amf":
      return <AMFBreakdown inputs={charityInputs.inputs} results={results} />;
    case "malaria-consortium":
      return <MCBreakdown inputs={charityInputs.inputs} results={results} />;
    case "helen-keller":
      return <HKBreakdown inputs={charityInputs.inputs} results={results} />;
    case "new-incentives":
      return <NIBreakdown inputs={charityInputs.inputs} results={results} />;
    case "givedirectly":
      return <GDBreakdown inputs={charityInputs.inputs} results={results} />;
    case "deworming":
      return <DWBreakdown inputs={charityInputs.inputs} results={results} />;
  }
}
