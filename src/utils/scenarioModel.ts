import type { Region } from "../data/grainTechEntities";

export interface ScenarioInputs {
  onFarmAdoption: number;
  elevatorAdoption: number;
  regulatoryAdoption: number;
  region: Region;
}

export interface ScenarioOutputs {
  incrementalValueUSD: number;
  timeSavedHours: number;
  riskReductionScore: number;
  avgAdoption: number;
  accuracyGainPct: number;
  timeSavedSeconds: number;
}

const baselineAccuracyPct = 88;
const aiAccuracyPct = 95;
const baselineTimeSeconds = 180;
const aiTimeSeconds = 60;

const regionValuePerPctPerTon: Record<Region, number> = {
  "North America": 2.4,
  "Europe": 2.1,
  "Australia": 2.2,
  "India": 1.5,
  "China": 1.6,
  "Latin America": 1.8,
  "Middle East": 1.9,
  "Global": 2.0,
};

const regionModeledTons: Record<Region, number> = {
  "North America": 20_000_000,
  "Europe": 18_000_000,
  "Australia": 8_000_000,
  "India": 25_000_000,
  "China": 30_000_000,
  "Latin America": 16_000_000,
  "Middle East": 7_000_000,
  "Global": 100_000_000,
};

// Illustrative assumptions:
// - AI improves grading accuracy and reduces test time.
// - Value scales with modeled tons and adoption.
// - One sample per 50 tons is used to estimate time saved.
export function calculateScenario(inputs: ScenarioInputs): ScenarioOutputs {
  const onFarm = inputs.onFarmAdoption / 100;
  const elevator = inputs.elevatorAdoption / 100;
  const regulatory = inputs.regulatoryAdoption / 100;

  const avgAdoption = (onFarm + elevator + regulatory) / 3;
  const accuracyGainPct = aiAccuracyPct - baselineAccuracyPct;
  const timeSavedSeconds = baselineTimeSeconds - aiTimeSeconds;

  const modeledTons = regionModeledTons[inputs.region];
  const valuePerPctPerTon = regionValuePerPctPerTon[inputs.region];

  const incrementalValueUSD =
    modeledTons * avgAdoption * accuracyGainPct * valuePerPctPerTon;

  const samples = modeledTons / 50;
  const timeSavedHours = (samples * timeSavedSeconds * avgAdoption) / 3600;

  const riskReductionScore = Math.min(
    100,
    Math.round(avgAdoption * 100 * (accuracyGainPct / 10))
  );

  return {
    incrementalValueUSD,
    timeSavedHours,
    riskReductionScore,
    avgAdoption,
    accuracyGainPct,
    timeSavedSeconds,
  };
}
