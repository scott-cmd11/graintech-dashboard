import { memo, useState, useCallback } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedFiltersProps {
  crops: string[];
  countries: string[];
  types: string[];
  selectedCrops: string[];
  selectedCountries: string[];
  selectedTypes: string[];
  onCropsChange: (crops: string[]) => void;
  onCountriesChange: (countries: string[]) => void;
  onTypesChange: (types: string[]) => void;
  onReset: () => void;
}

export const AdvancedFilters = memo(function AdvancedFilters({
  crops,
  countries,
  types,
  selectedCrops,
  selectedCountries,
  selectedTypes,
  onCropsChange,
  onCountriesChange,
  onTypesChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCropToggle = useCallback(
    (crop: string) => {
      if (selectedCrops.includes(crop)) {
        onCropsChange(selectedCrops.filter((c) => c !== crop));
      } else {
        onCropsChange([...selectedCrops, crop]);
      }
    },
    [selectedCrops, onCropsChange]
  );

  const handleCountryToggle = useCallback(
    (country: string) => {
      if (selectedCountries.includes(country)) {
        onCountriesChange(selectedCountries.filter((c) => c !== country));
      } else {
        onCountriesChange([...selectedCountries, country]);
      }
    },
    [selectedCountries, onCountriesChange]
  );

  const handleTypeToggle = useCallback(
    (type: string) => {
      if (selectedTypes.includes(type)) {
        onTypesChange(selectedTypes.filter((t) => t !== type));
      } else {
        onTypesChange([...selectedTypes, type]);
      }
    },
    [selectedTypes, onTypesChange]
  );

  const totalFilters = selectedCrops.length + selectedCountries.length + selectedTypes.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Advanced Filters</span>
          {totalFilters > 0 && (
            <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalFilters}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
          {/* Clear All */}
          {totalFilters > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mb-4"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}

          {/* Crops */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Crops</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {crops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => handleCropToggle(crop)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCrops.includes(crop)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Countries</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => handleCountryToggle(country)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCountries.includes(country)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Types */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Device Types</h4>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedTypes.includes(type)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdvancedFilters;
