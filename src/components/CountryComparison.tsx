/**
 * Country Comparison Component
 *
 * Allows users to select and compare multiple countries/variants for a specific charity
 * Shows side-by-side parameter values and highlights differences
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// This component handles heterogeneous country/variant types across charities,
// making strict typing impractical without significant type gymnastics.

import { useState, useMemo } from "react";
import type { CharityType } from "../lib/models";
import {
  AMF_COUNTRIES,
  AMF_COUNTRY_NAMES,
  AMF_COUNTRY_PARAMS,
  MC_COUNTRIES,
  MC_COUNTRY_NAMES,
  MC_COUNTRY_PARAMS,
  HK_COUNTRIES,
  HK_COUNTRY_NAMES,
  HK_COUNTRY_PARAMS,
  NI_COUNTRIES,
  NI_COUNTRY_NAMES,
  NI_COUNTRY_PARAMS,
  GD_COUNTRIES,
  GD_COUNTRY_NAMES,
  GD_COUNTRY_PARAMS,
  DW_VARIANTS,
  DW_VARIANT_NAMES,
  DW_VARIANT_PARAMS,
  getAMFInputsForCountry,
  getMCInputsForCountry,
  getHKInputsForCountry,
  getNIInputsForCountry,
  getGDInputsForCountry,
  getDWInputsForVariant,
  calculateCharity,
  applyMoralWeights,
  type MoralWeights,
  type CharityInputs,
} from "../lib/models";

interface CountryComparisonProps {
  charityType: CharityType;
  moralWeights: MoralWeights;
  onClose: () => void;
}

// Type guard to get country data
function getCountryData(charityType: CharityType): {
  countries: readonly string[];
  names: Record<string, string>;
  params: Record<string, Record<string, number>>;
  getInputs: (country: any, grantSize: number) => any;
} {
  switch (charityType) {
    case "amf":
      return {
        countries: AMF_COUNTRIES,
        names: AMF_COUNTRY_NAMES,
        params: AMF_COUNTRY_PARAMS,
        getInputs: getAMFInputsForCountry,
      };
    case "malaria-consortium":
      return {
        countries: MC_COUNTRIES,
        names: MC_COUNTRY_NAMES,
        params: MC_COUNTRY_PARAMS,
        getInputs: getMCInputsForCountry,
      };
    case "helen-keller":
      return {
        countries: HK_COUNTRIES,
        names: HK_COUNTRY_NAMES,
        params: HK_COUNTRY_PARAMS,
        getInputs: getHKInputsForCountry,
      };
    case "new-incentives":
      return {
        countries: NI_COUNTRIES,
        names: NI_COUNTRY_NAMES,
        params: NI_COUNTRY_PARAMS,
        getInputs: getNIInputsForCountry,
      };
    case "givedirectly":
      return {
        countries: GD_COUNTRIES,
        names: GD_COUNTRY_NAMES,
        params: GD_COUNTRY_PARAMS,
        getInputs: getGDInputsForCountry,
      };
    case "deworming":
      return {
        countries: DW_VARIANTS,
        names: DW_VARIANT_NAMES,
        params: DW_VARIANT_PARAMS,
        getInputs: getDWInputsForVariant,
      };
  }
}

// Helper to format parameter names nicely
function formatParamName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper to format parameter values
function formatParamValue(value: number): string {
  if (Math.abs(value) < 0.001) return value.toExponential(3);
  if (Math.abs(value) < 0.1) return value.toFixed(4);
  if (Math.abs(value) < 1) return value.toFixed(3);
  if (Math.abs(value) < 100) return value.toFixed(2);
  if (Math.abs(value) < 10000) return value.toFixed(1);
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// Check if values differ significantly
function valuesDiffer(values: number[]): boolean {
  if (values.length <= 1) return false;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  // Consider different if range is > 5% of average (or both are non-zero and different)
  return max - min > Math.abs(avg) * 0.05 || (min !== max && min !== 0 && max !== 0);
}

export function CountryComparison({ charityType, moralWeights, onClose }: CountryComparisonProps) {
  const countryData = getCountryData(charityType);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    countryData.countries[0],
    countryData.countries[Math.min(1, countryData.countries.length - 1)],
  ]);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  // Calculate results for each selected country
  const results = useMemo(() => {
    return selectedCountries.map((country) => {
      const inputs = countryData.getInputs(country as any, 1_000_000);
      const charityInputs = { type: charityType, inputs } as CharityInputs;
      const withWeights = applyMoralWeights(charityInputs, moralWeights);
      const result = calculateCharity(withWeights);
      return { country, result };
    });
  }, [selectedCountries, charityType, countryData, moralWeights]);

  // Get all parameter keys from the first country
  const paramKeys = useMemo(() => {
    if (selectedCountries.length === 0) return [];
    const firstCountryParams = countryData.params[selectedCountries[0] as any];
    return Object.keys(firstCountryParams);
  }, [selectedCountries, countryData]);

  return (
    <div className="country-comparison-overlay" onClick={onClose}>
      <div className="country-comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <h2>Compare Countries</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="country-selector-grid">
          <p>Select countries to compare (choose 2 or more):</p>
          <div className="country-checkboxes">
            {countryData.countries.map((country) => (
              <label key={country} className="country-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country)}
                  onChange={() => toggleCountry(country)}
                />
                <span>{countryData.names[country as any]}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedCountries.length >= 2 && (
          <>
            <div className="comparison-results">
              <h3>Cost-Effectiveness Comparison</h3>

              {/* Bar chart visualization */}
              <div className="comparison-bar-chart">
                {results
                  .sort((a, b) => b.result.finalXBenchmark - a.result.finalXBenchmark)
                  .map(({ country, result }) => {
                    const maxValue = Math.max(...results.map((r) => r.result.finalXBenchmark));
                    const barWidth = (result.finalXBenchmark / maxValue) * 100;

                    return (
                      <div key={country} className="bar-chart-row">
                        <span className="bar-chart-label">
                          {countryData.names[country as any]}
                        </span>
                        <div className="bar-chart-bar-container">
                          <div
                            className="bar-chart-bar"
                            style={{ width: `${barWidth}%` }}
                          >
                            <span className="bar-chart-value">
                              {result.finalXBenchmark.toFixed(1)}×
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <h3 style={{ marginTop: "2rem" }}>Detailed Results</h3>
              <div className="results-grid">
                {results.map(({ country, result }) => (
                  <div key={country} className="result-card">
                    <h4>{countryData.names[country as any]}</h4>
                    <div className="result-metric">
                      <span className="metric-value-large">
                        {result.finalXBenchmark.toFixed(1)}×
                      </span>
                      <span className="metric-label">cost-effectiveness</span>
                    </div>
                    <div className="result-details">
                      <div>
                        <strong>Cost per death averted:</strong>{" "}
                        {result.costPerDeathAverted === Infinity
                          ? "N/A"
                          : `$${result.costPerDeathAverted.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}`}
                      </div>
                      <div>
                        <strong>Deaths averted:</strong>{" "}
                        {result.deathsAvertedUnder5 === 0
                          ? "N/A"
                          : result.deathsAvertedUnder5.toFixed(0)}
                      </div>
                      <div>
                        <strong>People reached:</strong>{" "}
                        {result.peopleReached.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="comparison-chart">
              <h3>Parameter Comparison</h3>
              <p className="comparison-hint">
                Parameters with significant differences are highlighted in yellow
              </p>
              <div className="params-table-container">
                <table className="params-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      {selectedCountries.map((country) => (
                        <th key={country}>{countryData.names[country as any]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paramKeys.map((key) => {
                      const values = selectedCountries.map(
                        (country) => (countryData.params[country as any] as any)[key]
                      );
                      const differs = valuesDiffer(values);

                      return (
                        <tr key={key} className={differs ? "differs" : ""}>
                          <td className="param-name">{formatParamName(key)}</td>
                          {values.map((value, idx) => (
                            <td key={idx} className="param-value">
                              {formatParamValue(value)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedCountries.length < 2 && (
          <div className="comparison-empty">
            <p>Please select at least 2 countries to compare</p>
          </div>
        )}
      </div>
    </div>
  );
}
