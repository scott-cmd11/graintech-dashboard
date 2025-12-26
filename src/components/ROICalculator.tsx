import { memo, useState, useMemo } from 'react';
import { Calculator, DollarSign, Clock, TrendingUp, Info } from 'lucide-react';

interface ROICalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ROICalculator = memo(function ROICalculator({ isOpen, onClose }: ROICalculatorProps) {
  const [samplesPerDay, setSamplesPerDay] = useState(50);
  const [manualTimePerSample, setManualTimePerSample] = useState(5); // minutes
  const [laborCostPerHour, setLaborCostPerHour] = useState(25);
  const [deviceCost, setDeviceCost] = useState(15000);
  const [deviceTimePerSample, setDeviceTimePerSample] = useState(1); // minutes
  const [workDaysPerYear, setWorkDaysPerYear] = useState(250);

  const calculations = useMemo(() => {
    // Manual costs
    const manualHoursPerDay = (samplesPerDay * manualTimePerSample) / 60;
    const manualCostPerDay = manualHoursPerDay * laborCostPerHour;
    const manualCostPerYear = manualCostPerDay * workDaysPerYear;

    // Automated costs
    const deviceHoursPerDay = (samplesPerDay * deviceTimePerSample) / 60;
    const deviceLaborCostPerDay = deviceHoursPerDay * laborCostPerHour * 0.5; // 50% supervision
    const deviceLaborCostPerYear = deviceLaborCostPerDay * workDaysPerYear;

    // Savings
    const yearlyLaborSavings = manualCostPerYear - deviceLaborCostPerYear;
    const paybackMonths = deviceCost / (yearlyLaborSavings / 12);
    const fiveYearROI = ((yearlyLaborSavings * 5 - deviceCost) / deviceCost) * 100;

    // Time savings
    const timeSavedPerDayHours = manualHoursPerDay - deviceHoursPerDay;
    const timeSavedPerYearHours = timeSavedPerDayHours * workDaysPerYear;

    return {
      manualCostPerYear,
      deviceLaborCostPerYear,
      yearlyLaborSavings,
      paybackMonths: Math.max(0, paybackMonths),
      fiveYearROI,
      timeSavedPerDayHours,
      timeSavedPerYearHours,
    };
  }, [samplesPerDay, manualTimePerSample, laborCostPerHour, deviceCost, deviceTimePerSample, workDaysPerYear]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ROI Calculator</h2>
              <p className="text-gray-600 dark:text-gray-400">Estimate your return on investment</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your Operation</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Samples per day
                </label>
                <input
                  type="number"
                  value={samplesPerDay}
                  onChange={(e) => setSamplesPerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manual time per sample (minutes)
                </label>
                <input
                  type="number"
                  value={manualTimePerSample}
                  onChange={(e) => setManualTimePerSample(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Labor cost per hour ($)
                </label>
                <input
                  type="number"
                  value={laborCostPerHour}
                  onChange={(e) => setLaborCostPerHour(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Device cost ($)
                </label>
                <input
                  type="number"
                  value={deviceCost}
                  onChange={(e) => setDeviceCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Device time per sample (minutes)
                </label>
                <input
                  type="number"
                  value={deviceTimePerSample}
                  onChange={(e) => setDeviceTimePerSample(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work days per year
                </label>
                <input
                  type="number"
                  value={workDaysPerYear}
                  onChange={(e) => setWorkDaysPerYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Results</h3>

              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-300 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Manual Cost (Yearly)</span>
                </div>
                <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                  ${calculations.manualCostPerYear.toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-300 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Yearly Savings</span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                  ${calculations.yearlyLaborSavings.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Payback Period</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                  {calculations.paybackMonths.toFixed(1)} months
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">5-Year ROI</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  {calculations.fiveYearROI.toFixed(0)}%
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Time Saved (Yearly)</span>
                </div>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                  {calculations.timeSavedPerYearHours.toFixed(0)} hours
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This calculator provides estimates based on labor cost savings. Actual ROI may vary based on
              accuracy improvements, reduced waste, and compliance benefits.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-gray-900 dark:bg-gray-600 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
});

export default ROICalculator;
