import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Globe, ExternalLink, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import type {
  GrainSolution,
  Region,
  FormFactor,
  SensingTech,
  UseCase,
  UserSegment,
  MaturityLevel,
} from "../data/grainTechEntities";
import { filterGrainSolutions, getGrainFilterOptions } from "../utils/grainFilters";
import { formatCompanyUrl, getCompanyUrl } from "../utils/companyLookup";
import { formatEnumLabel, formatEnumList } from "../utils/formatLabels";
import "leaflet/dist/leaflet.css";

interface GrainLandscapeMapProps {
  grainSolutions: GrainSolution[];
  filters?: {
    regions: Region[];
    sensing: SensingTech[];
    formFactors: FormFactor[];
    useCases: UseCase[];
  };
  onFiltersChange?: (filters: {
    regions: Region[];
    sensing: SensingTech[];
    formFactors: FormFactor[];
    useCases: UseCase[];
  }) => void;
  showFilters?: boolean;
  companiesOpen?: boolean;
  onCompaniesToggle?: () => void;
  defaultCompaniesOpen?: boolean;
}

const sensingColors: Record<SensingTech, string> = {
  RGB: "#22c55e",
  NIR: "#3b82f6",
  HSI: "#8b5cf6",
  SpectralImaging: "#f59e0b",
  Terahertz: "#ef4444",
  XRay: "#0ea5e9",
  DroneImaging: "#14b8a6",
};

const maturityScores: Record<MaturityLevel, number> = {
  Experimental: 1,
  Pilot: 2,
  Commercial: 3,
  NationalProgram: 4,
};

const maturityOrder: MaturityLevel[] = [
  "Experimental",
  "Pilot",
  "Commercial",
  "NationalProgram",
];

const chipBase =
  "px-3 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500";

function toggleFilter<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

function getDeploymentScore(solution: GrainSolution): number {
  if (!solution.maturityLevel) {
    return 2;
  }
  return maturityScores[solution.maturityLevel] ?? 2;
}

export const GrainLandscapeMap = function GrainLandscapeMap({
  grainSolutions,
  filters,
  onFiltersChange,
  showFilters = true,
  companiesOpen,
  onCompaniesToggle,
  defaultCompaniesOpen = true,
}: GrainLandscapeMapProps) {
  const isControlled = Boolean(filters && onFiltersChange);
  const [localRegions, setLocalRegions] = useState<Region[]>([]);
  const [localSensing, setLocalSensing] = useState<SensingTech[]>([]);
  const [localFormFactors, setLocalFormFactors] = useState<FormFactor[]>([]);
  const [localUseCases, setLocalUseCases] = useState<UseCase[]>([]);
  const [localCompaniesOpen, setLocalCompaniesOpen] = useState(defaultCompaniesOpen);
  const isCompaniesControlled = typeof companiesOpen === "boolean" && Boolean(onCompaniesToggle);
  const resolvedCompaniesOpen = isCompaniesControlled ? (companiesOpen as boolean) : localCompaniesOpen;
  const toggleCompaniesOpen = () => {
    if (isCompaniesControlled && onCompaniesToggle) {
      onCompaniesToggle();
      return;
    }
    setLocalCompaniesOpen((prev) => !prev);
  };

  const activeFilters = isControlled
    ? filters
    : {
        regions: localRegions,
        sensing: localSensing,
        formFactors: localFormFactors,
        useCases: localUseCases,
      };

  const updateFilters = (
    updater:
      | {
          regions: Region[];
          sensing: SensingTech[];
          formFactors: FormFactor[];
          useCases: UseCase[];
        }
      | ((
          prev: {
            regions: Region[];
            sensing: SensingTech[];
            formFactors: FormFactor[];
            useCases: UseCase[];
          }
        ) => {
          regions: Region[];
          sensing: SensingTech[];
          formFactors: FormFactor[];
          useCases: UseCase[];
        })
  ) => {
    const next = typeof updater === "function" ? updater(activeFilters) : updater;
    if (isControlled && onFiltersChange) {
      onFiltersChange(next);
      return;
    }
    setLocalRegions(next.regions);
    setLocalSensing(next.sensing);
    setLocalFormFactors(next.formFactors);
    setLocalUseCases(next.useCases);
  };

  const availableFilters = useMemo(() => {
    return getGrainFilterOptions(grainSolutions);
  }, [grainSolutions]);

  const filteredSolutions = useMemo(() => {
    return filterGrainSolutions(grainSolutions, {
      regions: activeFilters.regions,
      sensing: activeFilters.sensing,
      formFactors: activeFilters.formFactors,
      useCases: activeFilters.useCases,
    });
  }, [grainSolutions, activeFilters]);

  const sortedSolutions = useMemo(() => {
    return [...filteredSolutions].sort((a, b) => a.company.localeCompare(b.company));
  }, [filteredSolutions]);

  const visibleWithLocations = sortedSolutions.filter(
    (solution) => typeof solution.primaryLat === "number" && typeof solution.primaryLng === "number"
  );

  const resetFilters = () => {
    updateFilters({
      regions: [],
      sensing: [],
      formFactors: [],
      useCases: [],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Global AI Grain Landscape
          </h3>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filteredSolutions.length} of {grainSolutions.length} solutions
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Regions
            </p>
            <div className="flex flex-wrap gap-2">
              {availableFilters.regions.map((region) => {
                const selected = activeFilters.regions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        regions: toggleFilter(prev.regions, region),
                      }))
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
                const selected = activeFilters.sensing.includes(tech);
                const color = sensingColors[tech];
                return (
                  <button
                    key={tech}
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        sensing: toggleFilter(prev.sensing, tech),
                      }))
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
                const selected = activeFilters.formFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        formFactors: toggleFilter(prev.formFactors, factor),
                      }))
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
                const selected = activeFilters.useCases.includes(useCase);
                return (
                  <button
                    key={useCase}
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        useCases: toggleFilter(prev.useCases, useCase),
                      }))
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

          {(activeFilters.regions.length > 0 ||
            activeFilters.sensing.length > 0 ||
            activeFilters.formFactors.length > 0 ||
            activeFilters.useCases.length > 0) && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[360px] sm:h-[420px]">
        <MapContainer
          center={[15, 0]}
          zoom={2.2}
          minZoom={1.5}
          maxZoom={6}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {visibleWithLocations.map((solution) => {
            const mainTech = solution.sensingTech[0] ?? "RGB";
            const color = sensingColors[mainTech] ?? "#22c55e";
            const radius = 4 + getDeploymentScore(solution) * 2;
            const companyUrl = getCompanyUrl(solution.company);
            return (
              <CircleMarker
                key={solution.id}
                center={[solution.primaryLat as number, solution.primaryLng as number]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  color: "#ffffff",
                  weight: 1.5,
                  opacity: 1,
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div className="text-sm min-w-[180px]">
                    <div className="font-semibold text-gray-900">{solution.company}</div>
                    <div className="text-xs text-gray-500 mb-2">{solution.productName}</div>
                    <div className="text-xs text-gray-700">
                      Regions: {formatEnumList(solution.regions)}
                    </div>
                    <div className="text-xs text-gray-700">
                      Tech: {formatEnumList(solution.sensingTech)}
                    </div>
                    {solution.maturityLevel && (
                      <div className="text-xs text-gray-700">
                        Maturity: {solution.maturityLevel}
                      </div>
                    )}
                    {companyUrl && (
                      <a
                        href={formatCompanyUrl(companyUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:flex sm:items-center sm:justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          {Object.entries(sensingColors).map(([tech, color]) => (
            <div key={tech} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span>{tech}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <span className="text-gray-500 dark:text-gray-400">Deployment scale:</span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {maturityOrder.map((level) => {
              const score = maturityScores[level];
              return (
                <span key={level} className="inline-flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    style={{ width: `${8 + score * 2}px`, height: `${8 + score * 2}px` }}
                    title={level}
                  />
                  <span>{level}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={toggleCompaniesOpen}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          aria-expanded={resolvedCompaniesOpen}
          aria-controls="landscape-companies-panel"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Companies & Solutions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sortedSolutions.length} filtered results
              </p>
            </div>
          </div>
          <span className="text-gray-400 dark:text-gray-500">
            {resolvedCompaniesOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </span>
        </button>
        {resolvedCompaniesOpen && (
          <div id="landscape-companies-panel" className="px-6 pb-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedSolutions.map((solution) => {
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
                    <div>Regions: {formatEnumList(solution.regions)}</div>
                    <div>Tech: {formatEnumList(solution.sensingTech)}</div>
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
                      {solution.userSegments.map((segment: UserSegment) => (
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
        )}
      </section>
    </div>
  );
};

export default GrainLandscapeMap;
