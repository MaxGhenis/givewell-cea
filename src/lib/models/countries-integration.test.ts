/**
 * Integration tests: Country parameters -> Calculation models -> finalXBenchmark
 *
 * These tests verify that the country-level parameters in countries.ts,
 * when run through the corresponding calculation models, produce correct
 * finalXBenchmark values consistent with GiveWell's November 2025 spreadsheets.
 *
 * Unlike the unit tests (amf.test.ts, etc.) which test individual formulas
 * with explicit inputs, these integration tests verify the full pipeline:
 *   getXInputsForCountry(country) -> calculateX(inputs) -> finalXBenchmark
 */

import { describe, it, expect } from "vitest";

import { calculateAMF } from "./amf";
import { calculateMalariaConsortium } from "./malaria-consortium";
import { calculateHelenKeller } from "./helen-keller";
import { calculateNewIncentives } from "./new-incentives";
import { calculateGiveDirectly } from "./givedirectly";
import { calculateDeworming } from "./deworming";
import { calculateDewormingEvidenceAction } from "./deworming-evidence-action";

import {
  AMF_COUNTRIES,
  AMF_COUNTRY_NAMES,
  getAMFInputsForCountry,
  MC_COUNTRIES,
  MC_COUNTRY_NAMES,
  getMCInputsForCountry,
  HK_COUNTRIES,
  HK_COUNTRY_NAMES,
  getHKInputsForCountry,
  NI_COUNTRIES,
  NI_COUNTRY_NAMES,
  getNIInputsForCountry,
  GD_COUNTRIES,
  GD_COUNTRY_NAMES,
  getGDInputsForCountry,
  DW_VARIANTS,
  DW_VARIANT_NAMES,
  getDWInputsForVariant,
  DEA_COUNTRIES,
  DEA_COUNTRY_NAMES,
  getDEAInputsForCountry,
} from "./countries";

import { calculateCharity } from "./index";

const GRANT_SIZE = 1_000_000;

// ============================================================================
// AMF Integration Tests
// ============================================================================

describe("AMF country integration", () => {
  const expectedValues: Partial<Record<(typeof AMF_COUNTRIES)[number], number>> = {
    chad: 4.82,
    drc: 14.63,
    guinea: 22.79,
    nigeria_pmi: 13.25,
  };

  describe("known finalXBenchmark values", () => {
    for (const [country, expected] of Object.entries(expectedValues)) {
      it(`${AMF_COUNTRY_NAMES[country as (typeof AMF_COUNTRIES)[number]]}: finalXBenchmark ~ ${expected}`, () => {
        const inputs = getAMFInputsForCountry(country as (typeof AMF_COUNTRIES)[number], GRANT_SIZE);
        const result = calculateAMF(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected, 1);
      });
    }
  });

  describe("all countries produce valid positive results", () => {
    for (const country of AMF_COUNTRIES) {
      it(`${AMF_COUNTRY_NAMES[country]} produces a finite positive finalXBenchmark`, () => {
        const inputs = getAMFInputsForCountry(country, GRANT_SIZE);
        const result = calculateAMF(inputs);
        expect(result.finalXBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.finalXBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const country of AMF_COUNTRIES) {
      it(`${AMF_COUNTRY_NAMES[country]} matches via calculateCharity`, () => {
        const inputs = getAMFInputsForCountry(country, GRANT_SIZE);
        const direct = calculateAMF(inputs);
        const unified = calculateCharity({ type: "amf", inputs });
        expect(unified.finalXBenchmark).toBeCloseTo(direct.finalXBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// Malaria Consortium Integration Tests
// ============================================================================

describe("Malaria Consortium country integration", () => {
  const expectedValues: Partial<Record<(typeof MC_COUNTRIES)[number], number>> = {
    burkina_faso: 13.31,
    chad: 14.65,
    cote_divoire: 8.52,
  };

  describe("known finalXBenchmark values", () => {
    for (const [country, expected] of Object.entries(expectedValues)) {
      it(`${MC_COUNTRY_NAMES[country as (typeof MC_COUNTRIES)[number]]}: finalXBenchmark ~ ${expected}`, () => {
        const inputs = getMCInputsForCountry(country as (typeof MC_COUNTRIES)[number], GRANT_SIZE);
        const result = calculateMalariaConsortium(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected, 1);
      });
    }
  });

  describe("all countries produce valid positive results", () => {
    for (const country of MC_COUNTRIES) {
      it(`${MC_COUNTRY_NAMES[country]} produces a finite positive finalXBenchmark`, () => {
        const inputs = getMCInputsForCountry(country, GRANT_SIZE);
        const result = calculateMalariaConsortium(inputs);
        expect(result.finalXBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.finalXBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const country of MC_COUNTRIES) {
      it(`${MC_COUNTRY_NAMES[country]} matches via calculateCharity`, () => {
        const inputs = getMCInputsForCountry(country, GRANT_SIZE);
        const direct = calculateMalariaConsortium(inputs);
        const unified = calculateCharity({ type: "malaria-consortium", inputs });
        expect(unified.finalXBenchmark).toBeCloseTo(direct.finalXBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// Helen Keller Integration Tests
// ============================================================================

describe("Helen Keller country integration", () => {
  const expectedValues: Partial<Record<(typeof HK_COUNTRIES)[number], number>> = {
    burkina_faso: 6.85,
    cameroon: 8.08,
    drc: 29.88,
  };

  describe("known finalXBenchmark values", () => {
    for (const [country, expected] of Object.entries(expectedValues)) {
      it(`${HK_COUNTRY_NAMES[country as (typeof HK_COUNTRIES)[number]]}: finalXBenchmark ~ ${expected}`, () => {
        const inputs = getHKInputsForCountry(country as (typeof HK_COUNTRIES)[number], GRANT_SIZE);
        const result = calculateHelenKeller(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected, 1);
      });
    }
  });

  describe("all countries produce valid positive results", () => {
    for (const country of HK_COUNTRIES) {
      it(`${HK_COUNTRY_NAMES[country]} produces a finite positive finalXBenchmark`, () => {
        const inputs = getHKInputsForCountry(country, GRANT_SIZE);
        const result = calculateHelenKeller(inputs);
        expect(result.finalXBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.finalXBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const country of HK_COUNTRIES) {
      it(`${HK_COUNTRY_NAMES[country]} matches via calculateCharity`, () => {
        const inputs = getHKInputsForCountry(country, GRANT_SIZE);
        const direct = calculateHelenKeller(inputs);
        const unified = calculateCharity({ type: "helen-keller", inputs });
        expect(unified.finalXBenchmark).toBeCloseTo(direct.finalXBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// New Incentives Integration Tests
// ============================================================================

describe("New Incentives country integration", () => {
  const expectedValues: Partial<Record<(typeof NI_COUNTRIES)[number], number>> = {
    bauchi: 20.04,
    gombe: 10.02,
    jigawa: 18.18,
  };

  describe("known finalXBenchmark values", () => {
    for (const [country, expected] of Object.entries(expectedValues)) {
      it(`${NI_COUNTRY_NAMES[country as (typeof NI_COUNTRIES)[number]]}: finalXBenchmark ~ ${expected}`, () => {
        const inputs = getNIInputsForCountry(country as (typeof NI_COUNTRIES)[number], GRANT_SIZE);
        const result = calculateNewIncentives(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected, 1);
      });
    }
  });

  describe("all countries produce valid positive results", () => {
    for (const country of NI_COUNTRIES) {
      it(`${NI_COUNTRY_NAMES[country]} produces a finite positive finalXBenchmark`, () => {
        const inputs = getNIInputsForCountry(country, GRANT_SIZE);
        const result = calculateNewIncentives(inputs);
        expect(result.finalXBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.finalXBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const country of NI_COUNTRIES) {
      it(`${NI_COUNTRY_NAMES[country]} matches via calculateCharity`, () => {
        const inputs = getNIInputsForCountry(country, GRANT_SIZE);
        const direct = calculateNewIncentives(inputs);
        const unified = calculateCharity({ type: "new-incentives", inputs });
        expect(unified.finalXBenchmark).toBeCloseTo(direct.finalXBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// GiveDirectly Integration Tests
// ============================================================================

describe("GiveDirectly country integration", () => {
  describe("all countries produce valid positive results", () => {
    for (const country of GD_COUNTRIES) {
      it(`${GD_COUNTRY_NAMES[country]} produces a finite positive xBenchmark`, () => {
        const inputs = getGDInputsForCountry(country, GRANT_SIZE);
        const result = calculateGiveDirectly(inputs);
        expect(result.xBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.xBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const country of GD_COUNTRIES) {
      it(`${GD_COUNTRY_NAMES[country]} matches via calculateCharity`, () => {
        const inputs = getGDInputsForCountry(country, GRANT_SIZE);
        const direct = calculateGiveDirectly(inputs);
        const unified = calculateCharity({ type: "givedirectly", inputs });
        // GiveDirectly uses xBenchmark for both initial and final
        expect(unified.finalXBenchmark).toBeCloseTo(direct.xBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// Deworming (generic model) Integration Tests
// ============================================================================

describe("Deworming variant integration", () => {
  describe("all variants produce valid positive results", () => {
    for (const variant of DW_VARIANTS) {
      it(`${DW_VARIANT_NAMES[variant]} produces a finite positive xBenchmark`, () => {
        const inputs = getDWInputsForVariant(variant, GRANT_SIZE);
        const result = calculateDeworming(inputs);
        expect(result.xBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.xBenchmark)).toBe(true);
      });
    }
  });

  describe("calculateCharity wrapper matches direct calculation", () => {
    for (const variant of DW_VARIANTS) {
      it(`${DW_VARIANT_NAMES[variant]} matches via calculateCharity`, () => {
        const inputs = getDWInputsForVariant(variant, GRANT_SIZE);
        const direct = calculateDeworming(inputs);
        const unified = calculateCharity({ type: "deworming", inputs });
        expect(unified.finalXBenchmark).toBeCloseTo(direct.xBenchmark, 10);
      });
    }
  });
});

// ============================================================================
// Deworming Evidence Action Integration Tests
// ============================================================================

describe("Deworming Evidence Action country integration", () => {
  const expectedValues: Partial<Record<(typeof DEA_COUNTRIES)[number], number>> = {
    kenya: 34.47,
    oyo_nigeria: 14.72,
    ogun_nigeria: 13.98,
  };

  describe("known finalXBenchmark values", () => {
    for (const [country, expected] of Object.entries(expectedValues)) {
      it(`${DEA_COUNTRY_NAMES[country as (typeof DEA_COUNTRIES)[number]]}: finalXBenchmark ~ ${expected}`, () => {
        const inputs = getDEAInputsForCountry(country as (typeof DEA_COUNTRIES)[number]);
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.finalXBenchmark).toBeCloseTo(expected, 1);
      });
    }
  });

  describe("all countries produce valid positive results", () => {
    for (const country of DEA_COUNTRIES) {
      it(`${DEA_COUNTRY_NAMES[country]} produces a finite positive finalXBenchmark`, () => {
        const inputs = getDEAInputsForCountry(country);
        const result = calculateDewormingEvidenceAction(inputs);
        expect(result.finalXBenchmark).toBeGreaterThan(0);
        expect(Number.isFinite(result.finalXBenchmark)).toBe(true);
      });
    }
  });
});
