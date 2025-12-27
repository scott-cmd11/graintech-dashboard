import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, TrendingUp, RotateCcw, TrendingDown, Check, AlertCircle } from "lucide-react";
import type { Region } from "../data/grainTechEntities";
import { calculateScenario } from "../utils/scenarioModel";
import { SimpleLineChart } from "./Charts";

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

// Animated counter component
function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return <span className="transition-all duration-300">{displayValue}</span>;
}

// Get color based on metric values
function getValueColor(value: number, maxValue: number, type: 'value' | 'time' | 'risk'): string {
  const percentage = (value / maxValue) * 100;

  if (type === 'value' || type === 'time') {
    if (percentage >= 75) return 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50 border-emerald-300 dark:border-emerald-700';
    if (percentage >= 50) return 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 border-blue-300 dark:border-blue-700';
    if (percentage >= 25) return 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50 border-amber-300 dark:border-amber-700';
    return 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/50 border-gray-300 dark:border-gray-700';
  }

  // For risk (higher is better)
  if (percentage >= 75) return 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50 border-emerald-300 dark:border-emerald-700';
  if (percentage >= 50) return 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 border-blue-300 dark:border-blue-700';
  return 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50 border-amber-300 dark:border-amber-700';
}

// Get confidence level display
function getConfidenceLevel(score: number): { level: string; badge: string; icon: React.ReactNode } {
  if (score >= 85) {
    return {
      level: 'Very High Confidence',
      badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      icon: <Check className="w-4 h-4" />,
    };
  }
  if (score >= 70) {
    return {
      level: 'High Confidence',
      badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700',
      icon: <Check className="w-4 h-4" />,
    };
  }
  if (score >= 50) {
    return {
      level: 'Medium Confidence',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      icon: <AlertCircle className="w-4 h-4" />,
    };
  }
  return {
    level: 'Building Confidence',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    icon: <AlertCircle className="w-4 h-4" />,
  };
}

export const ScenarioExplorer = function ScenarioExplorer() {
  const [region, setRegion] = useState<Region>("Global");
  const [onFarmAdoption, setOnFarmAdoption] = useState(25);
  const [elevatorAdoption, setElevatorAdoption] = useState(25);
  const [regulatoryAdoption, setRegulatoryAdoption] = useState(10);

  // Track baseline for comparison
  const [baselineOnFarm] = useState(25);
  const [baselineElevator] = useState(25);
  const [baselineRegulatory] = useState(10);

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

  const baseline = useMemo(
    () =>
      calculateScenario({
        region,
        onFarmAdoption: baselineOnFarm,
        elevatorAdoption: baselineElevator,
        regulatoryAdoption: baselineRegulatory,
      }),
    [region, baselineOnFarm, baselineElevator, baselineRegulatory]
  );

  // Calculate improvement percentages
  const valueImprovement = baseline.incrementalValueUSD > 0
    ? ((outputs.incrementalValueUSD - baseline.incrementalValueUSD) / baseline.incrementalValueUSD * 100)
    : 0;
  const timeImprovement = baseline.timeSavedHours > 0
    ? ((outputs.timeSavedHours - baseline.timeSavedHours) / baseline.timeSavedHours * 100)
    : 0;
  const riskImprovement = baseline.riskReductionScore > 0
    ? ((outputs.riskReductionScore - baseline.riskReductionScore) / baseline.riskReductionScore * 100)
    : 0;

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

  const maxValue = Math.max(...curveData.map(d => d.value));
  const maxHours = Math.max(outputs.timeSavedHours, baseline.timeSavedHours);

  // Quick preset functions
  const applyPreset = (name: string) => {
    switch (name) {
      case 'conservative':
        setOnFarmAdoption(10);
        setElevatorAdoption(15);
        setRegulatoryAdoption(5);
        break;
      case 'moderate':
        setOnFarmAdoption(50);
        setElevatorAdoption(50);
        setRegulatoryAdoption(50);
        break;
      case 'aggressive':
        setOnFarmAdoption(100);
        setElevatorAdoption(100);
        setRegulatoryAdoption(100);
        break;
      case 'reset':
        setOnFarmAdoption(baselineOnFarm);
        setElevatorAdoption(baselineElevator);
        setRegulatoryAdoption(baselineRegulatory);
        break;
    }
  };

  return (
    <div className="space-y-6">
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

        {/* QUICK PRESETS */}
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            ⚡ Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('conservative')}
              className="px-3 py-1.5 text-xs rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors border border-orange-200 dark:border-orange-700 font-medium"
            >
              Conservative (10%)
            </button>
            <button
              onClick={() => applyPreset('moderate')}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-700 font-medium"
            >
              Moderate (50%)
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="px-3 py-1.5 text-xs rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-700 font-medium"
            >
              Aggressive (100%)
            </button>
            <button
              onClick={() => applyPreset('reset')}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

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

          {/* METRIC CARDS WITH COLOR CODING */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className={`rounded-xl border p-4 bg-gradient-to-br transition-all duration-300 ${getValueColor(outputs.incrementalValueUSD, maxValue * 1_000_000, 'value')}`}>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                Incremental Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                <AnimatedCounter value={formatCurrency(outputs.incrementalValueUSD)} />
              </p>
              {valueImprovement !== 0 && (
                <div className="flex items-center gap-1 text-xs mt-2">
                  {valueImprovement > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{valueImprovement.toFixed(0)}% vs baseline</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{valueImprovement.toFixed(0)}% vs baseline</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
                {Math.round(outputs.avgAdoption * 100)}% blended adoption
              </p>
            </div>

            <div className={`rounded-xl border p-4 bg-gradient-to-br transition-all duration-300 ${getValueColor(outputs.timeSavedHours, maxHours, 'time')}`}>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                Time Saved
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                <AnimatedCounter value={formatHours(outputs.timeSavedHours)} />
              </p>
              {timeImprovement !== 0 && (
                <div className="flex items-center gap-1 text-xs mt-2">
                  {timeImprovement > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{timeImprovement.toFixed(0)}% vs baseline</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{timeImprovement.toFixed(0)}% vs baseline</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
                Estimated savings per season
              </p>
            </div>

            <div className={`rounded-xl border p-4 bg-gradient-to-br transition-all duration-300 ${getValueColor(outputs.riskReductionScore, 100, 'risk')}`}>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-medium">
                Grading Confidence
              </p>
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm ${getConfidenceLevel(outputs.riskReductionScore).badge}`}>
                  {getConfidenceLevel(outputs.riskReductionScore).icon}
                  <span>{getConfidenceLevel(outputs.riskReductionScore).level}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Score: <span className="font-bold text-gray-900 dark:text-gray-100"><AnimatedCounter value={`${outputs.riskReductionScore}/100`} /></span>
                </p>
              </div>
              {riskImprovement !== 0 && (
                <div className="flex items-center gap-1 text-xs mt-3">
                  {riskImprovement > 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{riskImprovement.toFixed(0)}% more confident</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-600 dark:text-amber-400 font-medium">{riskImprovement.toFixed(0)}% less confident</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
                Higher confidence = fewer grading disputes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VALUE CURVE CHART */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Value Growth Curve</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">USD millions across all adoption rates</span>
        </div>
        <SimpleLineChart data={curveData} color="stroke-emerald-500" />
      </div>
    </div>
  );
};

export default ScenarioExplorer;
