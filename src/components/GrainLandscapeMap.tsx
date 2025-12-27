import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Globe, ExternalLink, ChevronDown, ChevronUp, Building2, Search, X, Download, Share2, Filter as FilterIcon } from "lucide-react";
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
import { sensingColors } from "../constants/grainTechColors";
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
  const isControlled = Boolean(onFiltersChange);
  const [localRegions, setLocalRegions] = useState<Region[]>([]);
  const [localSensing, setLocalSensing] = useState<SensingTech[]>([]);
  const [localFormFactors, setLocalFormFactors] = useState<FormFactor[]>([]);
  const [localUseCases, setLocalUseCases] = useState<UseCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSummaryOpen, setFilterSummaryOpen] = useState(true);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [filterMode, setFilterMode] = useState<"or" | "and">("or");
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    search: true,
    regions: false,
    sensing: false,
    formFactors: false,
    useCases: false,
  });
  const [localCompaniesOpen, setLocalCompaniesOpen] = useState(defaultCompaniesOpen);

  const toggleFilterSection = (section: keyof typeof expandedFilterSections) => {
    setExpandedFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const isCompaniesControlled = typeof companiesOpen === "boolean" && Boolean(onCompaniesToggle);
  const resolvedCompaniesOpen = isCompaniesControlled ? (companiesOpen as boolean) : localCompaniesOpen;
  const toggleCompaniesOpen = () => {
    if (isCompaniesControlled && onCompaniesToggle) {
      onCompaniesToggle();
      return;
    }
    setLocalCompaniesOpen((prev) => !prev);
  };

  const fallbackFilters = {
    regions: localRegions,
    sensing: localSensing,
    formFactors: localFormFactors,
    useCases: localUseCases,
  };

  const activeFilters = filters ?? fallbackFilters;

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
    let results = grainSolutions;

    if (filterMode === "or") {
      // OR mode: use standard logic (OR within category, AND between categories)
      results = filterGrainSolutions(grainSolutions, {
        regions: activeFilters.regions,
        sensing: activeFilters.sensing,
        formFactors: activeFilters.formFactors,
        useCases: activeFilters.useCases,
      });
    } else {
      // AND mode: require ALL filters to match
      results = grainSolutions.filter((solution) => {
        const passesRegions =
          activeFilters.regions.length === 0 ||
          activeFilters.regions.every((r) => solution.regions.includes(r));
        const passesSensing =
          activeFilters.sensing.length === 0 ||
          activeFilters.sensing.every((s) => solution.sensingTech.includes(s));
        const passesFormFactors =
          activeFilters.formFactors.length === 0 ||
          activeFilters.formFactors.every((f) => solution.formFactors.includes(f));
        const passesUseCases =
          activeFilters.useCases.length === 0 ||
          activeFilters.useCases.every((u) => solution.useCases.includes(u));

        return passesRegions && passesSensing && passesFormFactors && passesUseCases;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (solution) =>
          solution.company.toLowerCase().includes(term) ||
          solution.productName.toLowerCase().includes(term)
      );
    }

    return results;
  }, [grainSolutions, activeFilters, searchTerm, filterMode]);

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

  const maturityBreakdown = useMemo(() => {
    return {
      Commercial: filteredSolutions.filter((s) => s.maturityLevel === "Commercial").length,
      Pilot: filteredSolutions.filter((s) => s.maturityLevel === "Pilot").length,
      Experimental: filteredSolutions.filter((s) => s.maturityLevel === "Experimental").length,
      NationalProgram: filteredSolutions.filter((s) => s.maturityLevel === "NationalProgram").length,
      NoLocation: filteredSolutions.filter(
        (s) => typeof s.primaryLat !== "number" || typeof s.primaryLng !== "number"
      ).length,
    };
  }, [filteredSolutions]);

  const exportToCSV = () => {
    if (filteredSolutions.length === 0) {
      alert("No solutions to export");
      return;
    }

    const headers = [
      "Company",
      "Product",
      "Regions",
      "Sensing Tech",
      "Form Factors",
      "Use Cases",
      "Maturity Level",
      "User Segments",
    ];

    const rows = filteredSolutions.map((solution) => [
      solution.company,
      solution.productName,
      solution.regions.join("; "),
      solution.sensingTech.join("; "),
      solution.formFactors.join("; "),
      solution.useCases.join("; "),
      solution.maturityLevel || "N/A",
      solution.userSegments.join("; "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "grain-solutions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareFilters = async () => {
    const filterParams = new URLSearchParams();
    if (searchTerm) filterParams.set("search", searchTerm);
    if (activeFilters.regions.length > 0) {
      filterParams.set("regions", activeFilters.regions.join(","));
    }
    if (activeFilters.sensing.length > 0) {
      filterParams.set("sensing", activeFilters.sensing.join(","));
    }
    if (activeFilters.formFactors.length > 0) {
      filterParams.set("formFactors", activeFilters.formFactors.join(","));
    }
    if (activeFilters.useCases.length > 0) {
      filterParams.set("useCases", activeFilters.useCases.join(","));
    }

    const shareUrl =
      `${window.location.origin}${window.location.pathname}?${filterParams.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Grain Landscape Filter",
          text: `View my filtered grain quality inspection solutions (${filteredSolutions.length} results)`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Filter URL copied to clipboard!");
    }
  };

  const ITEMS_PER_PAGE = 12;
  const paginatedVisibleWithLocations = useMemo(() => {
    const start = (companiesPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return visibleWithLocations.slice(start, end);
  }, [visibleWithLocations, companiesPage]);

  const totalPagesWithLocations = Math.ceil(visibleWithLocations.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Global AI Grain Landscape
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {filteredSolutions.length} of {grainSolutions.length} solutions
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5">
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{maturityBreakdown.Commercial}</span> Commercial
              {maturityBreakdown.Pilot > 0 && (
                <>
                  {" • "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{maturityBreakdown.Pilot}</span> Pilot
                </>
              )}
              {maturityBreakdown.Experimental > 0 && (
                <>
                  {" • "}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{maturityBreakdown.Experimental}</span> Experimental
                </>
              )}
            </div>
            {maturityBreakdown.NoLocation > 0 && (
              <div>
                <span className="text-gray-400 dark:text-gray-500">{maturityBreakdown.NoLocation} without location data</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <FilterIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs text-blue-700 dark:text-blue-300 mr-auto">Filter mode:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterMode("or")}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  filterMode === "or"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900"
                }`}
              >
                OR
              </button>
              <button
                onClick={() => setFilterMode("and")}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  filterMode === "and"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900"
                }`}
              >
                AND
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  updateFilters({
                    regions: activeFilters.regions,
                    sensing: activeFilters.sensing,
                    formFactors: ["HandheldSensor" as FormFactor, "OnCombine" as FormFactor, "Smartphone" as FormFactor],
                    useCases: activeFilters.useCases,
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Field Solutions
              </button>
              <button
                onClick={() =>
                  updateFilters({
                    regions: activeFilters.regions,
                    sensing: activeFilters.sensing,
                    formFactors: ["Benchtop" as FormFactor, "LabSystem" as FormFactor],
                    useCases: activeFilters.useCases,
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Lab Systems
              </button>
              <button
                onClick={() =>
                  updateFilters({
                    regions: activeFilters.regions,
                    sensing: activeFilters.sensing,
                    formFactors: activeFilters.formFactors,
                    useCases: ["ElevatorGrading" as UseCase, "RegulatoryExport" as UseCase],
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Grade & Export
              </button>
              <button
                onClick={() =>
                  updateFilters({
                    regions: activeFilters.regions,
                    sensing: activeFilters.sensing,
                    formFactors: activeFilters.formFactors,
                    useCases: ["OnFarmPreGrading" as UseCase, "MandiProcurement" as UseCase],
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Farmer/Trader
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={() => toggleFilterSection("search")}
              className="flex items-center gap-2 w-full text-left mb-2 sm:mb-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex-1">
                Search
              </p>
              <div className="sm:hidden">
                {expandedFilterSections.search ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {(expandedFilterSections.search || true) && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search companies or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleFilterSection("regions")}
              className="flex items-center gap-2 w-full text-left mb-2 sm:mb-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex-1">
                Regions
              </p>
              <div className="sm:hidden">
                {expandedFilterSections.regions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {(expandedFilterSections.regions || true) && (
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
            )}
          </div>

          <div>
            <button
              onClick={() => toggleFilterSection("sensing")}
              className="flex items-center gap-2 w-full text-left mb-2 sm:mb-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex-1">
                Sensing Tech
              </p>
              <div className="sm:hidden">
                {expandedFilterSections.sensing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {(expandedFilterSections.sensing || true) && (
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
            )}
          </div>

          <div>
            <button
              onClick={() => toggleFilterSection("formFactors")}
              className="flex items-center gap-2 w-full text-left mb-2 sm:mb-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex-1">
                Form Factor
              </p>
              <div className="sm:hidden">
                {expandedFilterSections.formFactors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {(expandedFilterSections.formFactors || true) && (
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
            )}
          </div>

          <div>
            <button
              onClick={() => toggleFilterSection("useCases")}
              className="flex items-center gap-2 w-full text-left mb-2 sm:mb-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex-1">
                Use Cases
              </p>
              <div className="sm:hidden">
                {expandedFilterSections.useCases ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {(expandedFilterSections.useCases || true) && (
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
            )}
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

      {(searchTerm || activeFilters.regions.length > 0 || activeFilters.sensing.length > 0 || activeFilters.formFactors.length > 0 || activeFilters.useCases.length > 0) && (
        <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilterSummaryOpen(!filterSummaryOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2 w-full"
          >
            <span>Active Filters</span>
            {filterSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {filterSummaryOpen && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs">
                  <span>Search: {searchTerm}</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {activeFilters.regions.map((region) => (
                <div
                  key={region}
                  className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(region)}</span>
                  <button
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        regions: prev.regions.filter((r) => r !== region),
                      }))
                    }
                    className="hover:text-emerald-900 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeFilters.sensing.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: sensingColors[tech] }}
                >
                  <span>{formatEnumLabel(tech)}</span>
                  <button
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        sensing: prev.sensing.filter((s) => s !== tech),
                      }))
                    }
                    className="hover:opacity-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeFilters.formFactors.map((factor) => (
                <div
                  key={factor}
                  className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(factor)}</span>
                  <button
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        formFactors: prev.formFactors.filter((f) => f !== factor),
                      }))
                    }
                    className="hover:text-blue-900 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeFilters.useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(useCase)}</span>
                  <button
                    onClick={() =>
                      updateFilters((prev) => ({
                        ...prev,
                        useCases: prev.useCases.filter((u) => u !== useCase),
                      }))
                    }
                    className="hover:text-amber-900 dark:hover:text-amber-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
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

      <div className="mt-4 p-3 sm:p-0 sm:mt-4 sticky bottom-0 sm:static bg-white dark:bg-gray-800 sm:bg-transparent dark:sm:bg-transparent border-t border-gray-200 dark:border-gray-700 sm:border-0 rounded-t-lg sm:rounded-none grid gap-3 sm:flex sm:items-center sm:justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          {Object.entries(sensingColors).map(([tech, color]) => (
            <div key={tech} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] sm:text-xs">{tech}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <span className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">Deployment scale:</span>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {maturityOrder.map((level) => {
              const score = maturityScores[level];
              return (
                <span key={level} className="inline-flex items-center gap-1 sm:gap-2">
                  <span
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    style={{ width: `${8 + score * 2}px`, height: `${8 + score * 2}px` }}
                    title={level}
                  />
                  <span className="text-[10px] sm:text-xs">{level}</span>
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
                {sortedSolutions.length} filtered results {maturityBreakdown.NoLocation > 0 && `(${maturityBreakdown.NoLocation} without location)`}
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
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={shareFilters}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Share filtered view"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </button>
        {resolvedCompaniesOpen && (
          <div id="landscape-companies-panel" className="px-6 pb-6 space-y-6">
            {visibleWithLocations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Solutions on Map ({visibleWithLocations.length})
                  </h4>
                  {totalPagesWithLocations > 1 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Page {companiesPage} of {totalPagesWithLocations}
                    </span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedVisibleWithLocations.map((solution) => {
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
                {totalPagesWithLocations > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCompaniesPage(Math.max(1, companiesPage - 1))}
                      disabled={companiesPage === 1}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    {Array.from({ length: totalPagesWithLocations }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCompaniesPage(page)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          companiesPage === page
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCompaniesPage(Math.min(totalPagesWithLocations, companiesPage + 1))}
                      disabled={companiesPage === totalPagesWithLocations}
                      className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
            {maturityBreakdown.NoLocation > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  No Location Data ({maturityBreakdown.NoLocation})
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    These solutions are available but location data is not yet entered:
                  </p>
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {sortedSolutions
                      .filter(
                        (s) =>
                          typeof s.primaryLat !== "number" || typeof s.primaryLng !== "number"
                      )
                      .map((solution) => {
                        const companyUrl = getCompanyUrl(solution.company);
                        return (
                          <div
                            key={solution.id}
                            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-3"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                                  {solution.company}
                                </h5>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {solution.productName}
                                </p>
                                {companyUrl && (
                                  <a
                                    href={formatCompanyUrl(companyUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800"
                                  >
                                    Website
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                              {solution.maturityLevel && (
                                <span className="text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                  {solution.maturityLevel}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-600 dark:text-gray-400 space-y-0.5">
                              <div>Regions: {formatEnumList(solution.regions)}</div>
                              <div>Tech: {formatEnumList(solution.sensingTech)}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default GrainLandscapeMap;
