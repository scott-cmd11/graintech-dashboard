import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import type { FormFactor, GrainSolution, Region, SensingTech, UseCase } from "../data/grainTechEntities";
import { getGrainFilterOptions } from "../utils/grainFilters";
import { formatEnumLabel } from "../utils/formatLabels";
import { sensingColors } from "../constants/grainTechColors";

interface GrainLandscapeFiltersProps {
  grainSolutions: GrainSolution[];
  filters: {
    regions: Region[];
    sensing: SensingTech[];
    formFactors: FormFactor[];
    useCases: UseCase[];
  };
  onFiltersChange: (filters: {
    regions: Region[];
    sensing: SensingTech[];
    formFactors: FormFactor[];
    useCases: UseCase[];
  }) => void;
  variant?: "standalone" | "embedded";
  collapsible?: boolean;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const chipBase =
  "px-3 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500";

function toggleFilter<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export const GrainLandscapeFilters = function GrainLandscapeFilters({
  grainSolutions,
  filters,
  onFiltersChange,
  variant = "standalone",
  collapsible = false,
  defaultOpen = true,
  isOpen,
  onToggle,
}: GrainLandscapeFiltersProps) {
  const isEmbedded = variant === "embedded";
  const isControlled = typeof isOpen === "boolean" && Boolean(onToggle);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const resolvedOpen = isControlled ? (isOpen as boolean) : internalOpen;
  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
      return;
    }
    setInternalOpen((prev) => !prev);
  };
  const availableFilters = useMemo(() => {
    return getGrainFilterOptions(grainSolutions);
  }, [grainSolutions]);

  const resetFilters = () => {
    onFiltersChange({
      regions: [],
      sensing: [],
      formFactors: [],
      useCases: [],
    });
  };

  const content = (
    <>
      {isEmbedded && (
        <>
          {(filters.regions.length > 0 ||
            filters.sensing.length > 0 ||
            filters.formFactors.length > 0 ||
            filters.useCases.length > 0) && (
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
      {(resolvedOpen || !collapsible) && (
        <div id="landscape-filters-panel" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Regions
            </p>
            <div className="flex flex-wrap gap-2">
              {availableFilters.regions.map((region) => {
                const selected = filters.regions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        regions: toggleFilter(filters.regions, region),
                      })
                    }
                    className={`${chipBase} ${
                      selected
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {formatEnumLabel(region)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Sensing Tech
            </p>
            <div className="flex flex-wrap gap-2">
              {availableFilters.sensing.map((tech) => {
                const selected = filters.sensing.includes(tech);
                const color = sensingColors[tech];
                return (
                  <button
                    key={tech}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        sensing: toggleFilter(filters.sensing, tech),
                      })
                    }
                    className={`${chipBase} ${
                      selected
                        ? "text-white"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                    style={selected ? { backgroundColor: color, borderColor: color } : undefined}
                  >
                    {formatEnumLabel(tech)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Form Factor
            </p>
            <div className="flex flex-wrap gap-2">
              {availableFilters.formFactors.map((factor) => {
                const selected = filters.formFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        formFactors: toggleFilter(filters.formFactors, factor),
                      })
                    }
                    className={`${chipBase} ${
                      selected
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {formatEnumLabel(factor)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Use Cases
            </p>
            <div className="flex flex-wrap gap-2">
              {availableFilters.useCases.map((useCase) => {
                const selected = filters.useCases.includes(useCase);
                return (
                  <button
                    key={useCase}
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        useCases: toggleFilter(filters.useCases, useCase),
                      })
                    }
                    className={`${chipBase} ${
                      selected
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {formatEnumLabel(useCase)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isEmbedded) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        {collapsible ? (
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-3 text-left hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-expanded={resolvedOpen}
            aria-controls="landscape-filters-panel"
          >
            <span className="text-emerald-600 dark:text-emerald-400">
              <Filter className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Landscape Filters
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apply once to update the map and technology stack view.
              </p>
            </div>
            <span className="text-gray-400 dark:text-gray-500 ml-2">
              {resolvedOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </span>
          </button>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Landscape Filters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Apply once to update the map and technology stack view.
            </p>
          </div>
        )}
        {(filters.regions.length > 0 ||
          filters.sensing.length > 0 ||
          filters.formFactors.length > 0 ||
          filters.useCases.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Clear all filters
          </button>
        )}
      </div>
      {content}
    </div>
  );
};

export default GrainLandscapeFilters;
