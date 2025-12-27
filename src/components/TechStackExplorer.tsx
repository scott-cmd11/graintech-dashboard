import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import type {
  GrainSolution,
  SensingTech,
  FormFactor,
  UseCase,
} from "../data/grainTechEntities";
import type { AILayer } from "../utils/aiLayer";
import { aiLayerOrder, deriveAiLayers } from "../utils/aiLayer";
import { filterGrainSolutions, getGrainFilterOptions } from "../utils/grainFilters";
import { ExternalLink } from "lucide-react";
import { formatCompanyUrl, getCompanyUrl } from "../utils/companyLookup";
import { formatEnumLabel, formatEnumList } from "../utils/formatLabels";

interface TechStackExplorerProps {
  grainSolutions: GrainSolution[];
}

type ActiveFilter =
  | { category: "Sensing"; value: SensingTech }
  | { category: "AI"; value: AILayer }
  | { category: "FormFactor"; value: FormFactor }
  | { category: "UseCase"; value: UseCase };

const chipBase =
  "px-3 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500";

function toggleFilter<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export const TechStackExplorer = function TechStackExplorer({
  grainSolutions,
}: TechStackExplorerProps) {
  const [sensingTech, setSensingTech] = useState<SensingTech[]>([]);
  const [aiLayers, setAiLayers] = useState<AILayer[]>([]);
  const [formFactors, setFormFactors] = useState<FormFactor[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  const options = useMemo(() => {
    const base = getGrainFilterOptions(grainSolutions);
    return {
      sensing: base.sensing,
      ai: aiLayerOrder,
      formFactors: base.formFactors,
      useCases: base.useCases,
    };
  }, [grainSolutions]);

  const solutionsWithAi = useMemo(() => {
    return grainSolutions.map((solution) => ({
      solution,
      aiLayers: deriveAiLayers(solution),
    }));
  }, [grainSolutions]);

  const filteredSolutions = useMemo(() => {
    const baseFiltered = filterGrainSolutions(grainSolutions, {
      regions: [],
      sensing: sensingTech,
      formFactors,
      useCases,
    });
    return solutionsWithAi.filter(({ solution, aiLayers: layers }) => {
      if (!baseFiltered.includes(solution)) {
        return false;
      }
      const matchAi = aiLayers.length === 0 || layers.some((layer) => aiLayers.includes(layer));
      return matchAi;
    });
  }, [solutionsWithAi, grainSolutions, sensingTech, aiLayers, formFactors, useCases]);

  const activeFilters: ActiveFilter[] = [
    ...sensingTech.map((value) => ({ category: "Sensing" as const, value })),
    ...aiLayers.map((value) => ({ category: "AI" as const, value })),
    ...formFactors.map((value) => ({ category: "FormFactor" as const, value })),
    ...useCases.map((value) => ({ category: "UseCase" as const, value })),
  ];

  const handleRemoveFilter = (filter: ActiveFilter) => {
    if (filter.category === "Sensing") {
      setSensingTech((prev) => prev.filter((item) => item !== filter.value));
      return;
    }
    if (filter.category === "AI") {
      setAiLayers((prev) => prev.filter((item) => item !== filter.value));
      return;
    }
    if (filter.category === "FormFactor") {
      setFormFactors((prev) => prev.filter((item) => item !== filter.value));
      return;
    }
    setUseCases((prev) => prev.filter((item) => item !== filter.value));
  };

  const clearFilters = () => {
    setSensingTech([]);
    setAiLayers([]);
    setFormFactors([]);
    setUseCases([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Technology Stack Explorer
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore how sensing, AI, hardware, and use cases combine across the global grain AI ecosystem.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Sensing Tech
          </p>
          <div className="flex flex-wrap gap-2">
            {options.sensing.map((tech) => {
              const selected = sensingTech.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => setSensingTech((prev) => toggleFilter(prev, tech))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {formatEnumLabel(tech)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            AI Layer
          </p>
          <div className="flex flex-wrap gap-2">
            {options.ai.map((layer) => {
              const selected = aiLayers.includes(layer);
              return (
                <button
                  key={layer}
                  onClick={() => setAiLayers((prev) => toggleFilter(prev, layer))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {layer}
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
            {options.formFactors.map((factor) => {
              const selected = formFactors.includes(factor);
              return (
                <button
                  key={factor}
                  onClick={() => setFormFactors((prev) => toggleFilter(prev, factor))}
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
            Use Case
          </p>
          <div className="flex flex-wrap gap-2">
            {options.useCases.map((useCase) => {
              const selected = useCases.includes(useCase);
              return (
                <button
                  key={useCase}
                  onClick={() => setUseCases((prev) => toggleFilter(prev, useCase))}
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

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <button
              key={`${filter.category}-${filter.value}`}
              onClick={() => handleRemoveFilter(filter)}
              className="px-3 py-1 text-xs rounded-full border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            >
              {filter.category}: {filter.value}
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="group relative inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-help"
          >
            <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>How AI layers are derived</span>
            <div className="absolute mt-8 hidden group-hover:block group-focus-within:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 max-w-xs z-10">
              Vision CNN for RGB imagery. Spectral ML for NIR/HSI/spectral sensors. Edge AI for handheld
              or on-combine hardware. Cloud-based for traceability workflows.
            </div>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredSolutions.map(({ solution }) => {
          const companyUrl = getCompanyUrl(solution.company);
          return (
            <div
              key={solution.id}
              className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{solution.company}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{solution.productName}</p>
                  {companyUrl && (
                    <a
                      href={formatCompanyUrl(companyUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {solution.maturityLevel && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                    {solution.maturityLevel}
                  </span>
                )}
              </div>

            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Tech: {formatEnumList(solution.sensingTech)}</div>
              <div>Form: {formatEnumList(solution.formFactors)}</div>
              <div>Use cases: {formatEnumList(solution.useCases)}</div>
            </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {solution.formFactors.map((factor) => (
                  <span
                    key={`${solution.id}-${factor}`}
                    className="text-[10px] px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  >
                    {formatEnumLabel(factor)}
                  </span>
                ))}
                {solution.userSegments.map((segment) => (
                  <span
                    key={`${solution.id}-${segment}`}
                    className="text-[10px] px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
                  >
                    {formatEnumLabel(segment)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackExplorer;
