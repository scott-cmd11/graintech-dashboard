import { useMemo, useState } from "react";
import { SlidersHorizontal, TrendingUp } from "lucide-react";
import type { Region } from "../data/grainTechEntities";
import { calculateScenario } from "../utils/scenarioModel";
import { SimpleBarChart } from "./Charts";

const regions: Region[] = [
  "North America",
  "Europe",
  "Australia",
  "India",
  "China",
  "Latin America",
  "Middle East",
  "Global",
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return `$${Math.round(value)}`;
}

function formatHours(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M hrs`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K hrs`;
  }
  return `${Math.round(value)} hrs`;
}

export const ScenarioExplorer = function ScenarioExplorer() {
  const [region, setRegion] = useState<Region>("Global");
  const [onFarmAdoption, setOnFarmAdoption] = useState(25);
  const [elevatorAdoption, setElevatorAdoption] = useState(25);
  const [regulatoryAdoption, setRegulatoryAdoption] = useState(10);

  const outputs = useMemo(
    () =>
      calculateScenario({
        region,
        onFarmAdoption,
        elevatorAdoption,
        regulatoryAdoption,
      }),
    [region, onFarmAdoption, elevatorAdoption, regulatoryAdoption]
  );

  const curveData = useMemo(() => {
    const levels = [10, 25, 50, 75, 100];
    return levels.map((level) => {
      const result = calculateScenario({
        region,
        onFarmAdoption: level,
        elevatorAdoption: level,
        regulatoryAdoption: level,
      });
      return {
        label: `${level}%`,
        value: Math.round(result.incrementalValueUSD / 1_000_000),
      };
    });
  }, [region]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <SlidersHorizontal className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Scenario Explorer
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Explore how adoption levels influence value capture, time saved, and risk reduction. The model
        is illustrative and based on simplified assumptions.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Region
            </label>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value as Region)}
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span>On-farm adoption</span>
                <span>{onFarmAdoption}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={onFarmAdoption}
                onChange={(event) => setOnFarmAdoption(Number(event.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span>Elevator adoption</span>
                <span>{elevatorAdoption}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={elevatorAdoption}
                onChange={(event) => setElevatorAdoption(Number(event.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span>Regulatory adoption</span>
                <span>{regulatoryAdoption}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={regulatoryAdoption}
                onChange={(event) => setRegulatoryAdoption(Number(event.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Incremental value
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {formatCurrency(outputs.incrementalValueUSD)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Based on {Math.round(outputs.avgAdoption * 100)}% blended adoption
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Time saved
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {formatHours(outputs.timeSavedHours)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Estimated savings across modeled receival samples
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Risk reduction score
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {outputs.riskReductionScore}/100
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Higher means fewer grading disputes
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Value vs. blended adoption (USD millions)
        </div>
        <SimpleBarChart data={curveData} color="bg-emerald-500 hover:bg-emerald-600" />
      </div>
    </div>
  );
};

export default ScenarioExplorer;
