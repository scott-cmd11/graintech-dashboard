import { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  Table2,
  Search,
  X,
  Share2,
  CheckSquare,
  Square,
  ChevronUp,
  ChevronDown,
  Play,
} from "lucide-react";
import type {
  GrainSolution,
  Region,
  FormFactor,
  SensingTech,
  UseCase,
} from "../data/grainTechEntities";
import { filterGrainSolutions, getGrainFilterOptions } from "../utils/grainFilters";
import { exportGrainSolutions } from "../utils/export";
import type { ExportFormat } from "../types";
import { formatCompanyUrl, getCompanyUrl } from "../utils/companyLookup";
import { formatEnumLabel, formatEnumList } from "../utils/formatLabels";
import { sensingColors } from "../constants/grainTechColors";

interface GrainComparisonMatrixProps {
  grainSolutions: GrainSolution[];
}

type ColumnKey =
  | "company"
  | "product"
  | "regions"
  | "sensingTech"
  | "formFactors"
  | "useCases"
  | "accuracy"
  | "throughput"
  | "duration"
  | "maturity"
  | "video";

type SortDirection = "asc" | "desc";

const columnLabels: Record<ColumnKey, string> = {
  company: "Company",
  product: "Product",
  regions: "Regions",
  sensingTech: "Primary Tech",
  formFactors: "Form Factors",
  useCases: "Primary Use Cases",
  accuracy: "Accuracy (%)",
  throughput: "Throughput (samples/hr)",
  duration: "Test Duration (sec)",
  maturity: "Maturity",
  video: "Demo Video",
};

const numericColumns: ColumnKey[] = ["accuracy", "throughput", "duration"];
const defaultColumns: ColumnKey[] = [
  "company",
  "product",
  "regions",
  "sensingTech",
  "formFactors",
  "useCases",
  "accuracy",
  "throughput",
  "duration",
  "maturity",
];
const compactColumns: ColumnKey[] = ["company", "product", "sensingTech", "maturity"];
const presetColumns: Record<"performance" | "stack" | "business", ColumnKey[]> = {
  performance: ["company", "product", "accuracy", "throughput", "duration", "maturity"],
  stack: ["company", "product", "sensingTech", "formFactors", "useCases", "regions", "maturity"],
  business: ["company", "product", "regions", "formFactors", "useCases", "maturity"],
};

const chipBase =
  "px-3 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500";

function toggleFilter<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

function getPerformanceColor(value: number | undefined, column: "accuracy" | "throughput" | "duration"): string {
  if (value === undefined) return "text-gray-700 dark:text-gray-200";

  if (column === "accuracy") {
    if (value >= 95) return "text-green-700 dark:text-green-400 font-semibold";
    if (value >= 90) return "text-emerald-700 dark:text-emerald-400";
    if (value >= 85) return "text-yellow-700 dark:text-yellow-400";
    return "text-orange-700 dark:text-orange-400";
  }

  if (column === "throughput") {
    if (value >= 1000) return "text-green-700 dark:text-green-400 font-semibold";
    if (value >= 100) return "text-emerald-700 dark:text-emerald-400";
    if (value >= 50) return "text-yellow-700 dark:text-yellow-400";
    return "text-orange-700 dark:text-orange-400";
  }

  if (column === "duration") {
    if (value <= 30) return "text-green-700 dark:text-green-400 font-semibold";
    if (value <= 60) return "text-emerald-700 dark:text-emerald-400";
    if (value <= 120) return "text-yellow-700 dark:text-yellow-400";
    return "text-orange-700 dark:text-orange-400";
  }

  return "text-gray-700 dark:text-gray-200";
}

function formatShortList(values: string[], max = 2): string {
  return formatEnumList(values, max);
}

function getPrimaryTech(solution: GrainSolution): string {
  return solution.sensingTech[0] ?? "RGB";
}

function getCellValue(solution: GrainSolution, column: ColumnKey): string | number {
  switch (column) {
    case "company":
      return solution.company;
    case "product":
      return solution.productName;
    case "regions":
      return formatShortList(solution.regions);
    case "sensingTech":
      return formatEnumLabel(getPrimaryTech(solution));
    case "formFactors":
      return formatEnumList(solution.formFactors);
    case "useCases":
      return formatShortList(solution.useCases);
    case "accuracy":
      return solution.accuracyPercent ?? "";
    case "throughput":
      return solution.throughputSamplesPerHour ?? "";
    case "duration":
      return solution.avgTestDurationSeconds ?? "";
    case "maturity":
      return solution.maturityLevel ?? "";
    default:
      return "";
  }
}

export const GrainComparisonMatrix = function GrainComparisonMatrix({
  grainSolutions,
}: GrainComparisonMatrixProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [sensing, setSensing] = useState<SensingTech[]>([]);
  const [formFactors, setFormFactors] = useState<FormFactor[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(defaultColumns);
  const [compactView, setCompactView] = useState(false);
  const [sortKey, setSortKey] = useState<ColumnKey>("company");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pinnedColumn, setPinnedColumn] = useState<ColumnKey | "none">("company");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filterSummaryOpen, setFilterSummaryOpen] = useState(true);

  const options = useMemo(() => {
    return getGrainFilterOptions(grainSolutions);
  }, [grainSolutions]);

  const filteredSolutions = useMemo(() => {
    let results = filterGrainSolutions(grainSolutions, {
      regions,
      sensing,
      formFactors,
      useCases,
    });

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (solution) =>
          solution.company.toLowerCase().includes(term) ||
          solution.productName.toLowerCase().includes(term)
      );
    }

    return results;
  }, [grainSolutions, regions, sensing, formFactors, useCases, searchTerm]);

  const sortedSolutions = useMemo(() => {
    const sorted = [...filteredSolutions];
    const isNumeric = numericColumns.includes(sortKey);
    sorted.sort((a, b) => {
      const aVal = getCellValue(a, sortKey);
      const bVal = getCellValue(b, sortKey);

      if (isNumeric) {
        const aNum = typeof aVal === "number" ? aVal : Number.NaN;
        const bNum = typeof bVal === "number" ? bVal : Number.NaN;
        if (Number.isNaN(aNum) && Number.isNaN(bNum)) return 0;
        if (Number.isNaN(aNum)) return 1;
        if (Number.isNaN(bNum)) return -1;
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
    return sorted;
  }, [filteredSolutions, sortKey, sortDirection]);

  const baseColumns = compactView ? compactColumns : visibleColumns;
  const activeColumns =
    pinnedColumn !== "none" && baseColumns.includes(pinnedColumn)
      ? [pinnedColumn, ...baseColumns.filter((column) => column !== pinnedColumn)]
      : baseColumns;

  const activeFilters = [
    ...regions.map((value) => ({ category: "Region", value })),
    ...sensing.map((value) => ({ category: "Sensing", value })),
    ...formFactors.map((value) => ({ category: "FormFactor", value })),
    ...useCases.map((value) => ({ category: "UseCase", value })),
  ];

  const toggleSort = (column: ColumnKey) => {
    if (sortKey === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(column);
    setSortDirection("asc");
  };

  const clearFilters = () => {
    setRegions([]);
    setSensing([]);
    setFormFactors([]);
    setUseCases([]);
  };

  const applyPreset = (preset: keyof typeof presetColumns) => {
    setVisibleColumns(presetColumns[preset]);
    setCompactView(false);
  };

  useEffect(() => {
    if (pinnedColumn !== "none" && !baseColumns.includes(pinnedColumn)) {
      setPinnedColumn("none");
    }
  }, [baseColumns, pinnedColumn]);

  const handleExport = (format: ExportFormat) => {
    exportGrainSolutions(sortedSolutions, format);
  };

  const shareFilters = async () => {
    const filterParams = new URLSearchParams();
    if (searchTerm) filterParams.set("search", searchTerm);
    if (regions.length > 0) filterParams.set("regions", regions.join(","));
    if (sensing.length > 0) filterParams.set("sensing", sensing.join(","));
    if (formFactors.length > 0) filterParams.set("formFactors", formFactors.join(","));
    if (useCases.length > 0) filterParams.set("useCases", useCases.join(","));

    const shareUrl = `${window.location.origin}${window.location.pathname}?${filterParams.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Grain Comparison Filter",
          text: `View my filtered grain solutions comparison (${filteredSolutions.length} results)`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Filter URL copied to clipboard!");
    }
  };

  const toggleRowSelection = (solutionId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(solutionId)) {
      newSelection.delete(solutionId);
    } else {
      newSelection.add(solutionId);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === sortedSolutions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedSolutions.map((s) => s.id)));
    }
  };

  const getSelectedSolutions = () => {
    return sortedSolutions.filter((s) => selectedRows.has(s.id));
  };

  const maturityBreakdown = useMemo(() => {
    return {
      Commercial: filteredSolutions.filter((s) => s.maturityLevel === "Commercial").length,
      Pilot: filteredSolutions.filter((s) => s.maturityLevel === "Pilot").length,
      Experimental: filteredSolutions.filter((s) => s.maturityLevel === "Experimental").length,
    };
  }, [filteredSolutions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Table2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Grain Comparison Matrix
            </h3>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Compare solutions across sensing, hardware, use cases, and performance metrics.
              </p>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5">
                <span>
                  {filteredSolutions.length} of {grainSolutions.length} solutions
                  {maturityBreakdown.Commercial > 0 && (
                    <>
                      {" • "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{maturityBreakdown.Commercial}</span> Commercial
                    </>
                  )}
                  {maturityBreakdown.Pilot > 0 && (
                    <>
                      {" • "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{maturityBreakdown.Pilot}</span> Pilot
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedRows.size > 0 && (
            <button
              onClick={() => {
                const selected = getSelectedSolutions();
                console.log("Comparing:", selected);
                alert(`Ready to compare ${selected.length} solutions. (Modal integration coming soon)`);
              }}
              className="px-3 py-2 text-xs rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors inline-flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              Compare ({selectedRows.size})
            </button>
          )}
          <button
            onClick={shareFilters}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Share filtered view"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCompactView((prev) => !prev)}
            className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {compactView ? "Expanded view" : "Compact view"}
          </button>
          <div className="relative group">
            <button className="px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-10">
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("json")}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {(searchTerm || regions.length > 0 || sensing.length > 0 || formFactors.length > 0 || useCases.length > 0) && (
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
              {regions.map((region) => (
                <div
                  key={region}
                  className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(region)}</span>
                  <button
                    onClick={() => setRegions((prev) => prev.filter((r) => r !== region))}
                    className="hover:text-emerald-900 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {sensing.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: sensingColors[tech] }}
                >
                  <span>{formatEnumLabel(tech)}</span>
                  <button
                    onClick={() => setSensing((prev) => prev.filter((s) => s !== tech))}
                    className="hover:opacity-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {formFactors.map((factor) => (
                <div
                  key={factor}
                  className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(factor)}</span>
                  <button
                    onClick={() => setFormFactors((prev) => prev.filter((f) => f !== factor))}
                    className="hover:text-indigo-900 dark:hover:text-indigo-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs"
                >
                  <span>{formatEnumLabel(useCase)}</span>
                  <button
                    onClick={() => setUseCases((prev) => prev.filter((u) => u !== useCase))}
                    className="hover:text-teal-900 dark:hover:text-teal-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          Search
        </p>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search companies or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Regions
          </p>
          <div className="flex flex-wrap gap-2">
            {options.regions.map((region) => {
              const selected = regions.includes(region);
              return (
                <button
                  key={region}
                  onClick={() => setRegions((prev) => toggleFilter(prev, region))}
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
            {options.sensing.map((tech) => {
              const selected = sensing.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => setSensing((prev) => toggleFilter(prev, tech))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-blue-500 border-blue-500 text-white"
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
            Form Factors
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
                      ? "bg-indigo-500 border-indigo-500 text-white"
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
            {options.useCases.map((useCase) => {
              const selected = useCases.includes(useCase);
              return (
                <button
                  key={useCase}
                  onClick={() => setUseCases((prev) => toggleFilter(prev, useCase))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-teal-500 border-teal-500 text-white"
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <button
            key={`${filter.category}-${filter.value}`}
            onClick={() => {
              if (filter.category === "Region") {
                setRegions((prev) => prev.filter((item) => item !== filter.value));
                return;
              }
              if (filter.category === "Sensing") {
                setSensing((prev) => prev.filter((item) => item !== filter.value));
                return;
              }
              if (filter.category === "FormFactor") {
                setFormFactors((prev) => prev.filter((item) => item !== filter.value));
                return;
              }
              setUseCases((prev) => prev.filter((item) => item !== filter.value));
            }}
            className="px-3 py-1 text-xs rounded-full border border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50"
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

      <div className="mt-6">
        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset("performance")}
                className="px-3 py-1 text-xs rounded-full border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
              >
                Performance Only
              </button>
              <button
                onClick={() => applyPreset("stack")}
                className="px-3 py-1 text-xs rounded-full border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
              >
                Stack Only
              </button>
              <button
                onClick={() => applyPreset("business")}
                className="px-3 py-1 text-xs rounded-full border border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50"
              >
                Business Only
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Pinned column
            </p>
            <div className="flex flex-wrap gap-2">
              {(["none", ...baseColumns] as const).map((column) => {
                const selected = pinnedColumn === column;
                const label = column === "none" ? "None" : columnLabels[column];
                return (
                  <button
                    key={column}
                    onClick={() => setPinnedColumn(column)}
                    className={`${chipBase} ${
                      selected
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Columns
            </p>
            <div className="flex flex-wrap gap-2">
              {defaultColumns.map((column) => {
                const selected = visibleColumns.includes(column);
                return (
                  <button
                    key={column}
                    onClick={() => setVisibleColumns((prev) => toggleFilter(prev, column))}
                    className={`${chipBase} ${
                      selected
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {columnLabels[column]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white dark:bg-gray-800">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left text-xs font-semibold uppercase tracking-wide px-3 py-2 text-gray-500 dark:text-gray-400 w-12">
                <button
                  onClick={toggleAllRows}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title={selectedRows.size === sortedSolutions.length ? "Deselect all" : "Select all"}
                >
                  {selectedRows.size === sortedSolutions.length ? (
                    <CheckSquare className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {activeColumns.map((column, index) => {
                const isSortable = numericColumns.includes(column) || column === "company" || column === "product" || column === "maturity";
                const isActiveSort = sortKey === column;
                return (
                  <th
                    key={column}
                    className={`text-left text-xs font-semibold uppercase tracking-wide px-3 py-2 text-gray-500 dark:text-gray-400 ${
                      isSortable ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" : ""
                    } ${
                      index === 0 && pinnedColumn !== "none"
                        ? "sticky left-12 bg-white dark:bg-gray-800 shadow-[2px_0_0_rgba(0,0,0,0.06)]"
                        : ""
                    }`}
                    onClick={() => {
                      if (isSortable) {
                        toggleSort(column);
                      }
                    }}
                  >
                    {columnLabels[column]}
                    {isActiveSort && (
                      <span className="ml-1 text-[10px]">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedSolutions.map((solution) => {
              const companyUrl = solution.url || getCompanyUrl(solution.company);
              const isSelected = selectedRows.has(solution.id);
              return (
              <tr
                key={solution.id}
                className={`group border-b border-gray-100 dark:border-gray-700 ${
                  isSelected ? "bg-teal-50 dark:bg-teal-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                }`}
              >
                <td className="px-3 py-3 w-12 text-center">
                  <button
                    onClick={() => toggleRowSelection(solution.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </td>
                {activeColumns.map((column, index) => (
                  <td
                    key={`${solution.id}-${column}`}
                    className={`px-3 py-3 text-sm text-gray-700 dark:text-gray-200 align-top ${
                      index === 0 && pinnedColumn !== "none"
                        ? "sticky left-12 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/40 shadow-[2px_0_0_rgba(0,0,0,0.06)]"
                        : ""
                    }`}
                  >
                    {column === "company" ? (
                      companyUrl ? (
                        <a
                          href={formatCompanyUrl(companyUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          {solution.company}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          {solution.company}
                        </span>
                      )
                    ) : column === "formFactors" ? (
                      <div className="flex flex-wrap gap-1">
                        {solution.formFactors.map((factor) => (
                          <span
                            key={`${solution.id}-${factor}`}
                            className="text-[10px] px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                          >
                            {formatEnumLabel(factor)}
                          </span>
                        ))}
                      </div>
                    ) : column === "useCases" ? (
                      <div className="flex flex-wrap gap-1">
                        {solution.useCases.map((useCase) => (
                          <span
                            key={`${solution.id}-${useCase}`}
                            className="text-[10px] px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700"
                          >
                            {formatEnumLabel(useCase)}
                          </span>
                        ))}
                      </div>
                    ) : column === "accuracy" || column === "throughput" || column === "duration" ? (
                      <span
                        className={`text-sm ${getPerformanceColor(
                          getCellValue(solution, column) as number | undefined,
                          column as "accuracy" | "throughput" | "duration"
                        )}`}
                      >
                        {getCellValue(solution, column) || "—"}
                      </span>
                    ) : column === "video" ? (
                      solution.videoUrl ? (
                        <a
                          href={solution.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Watch demo video"
                        >
                          <Play className="w-4 h-4" />
                          <span className="text-sm">Watch</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {getCellValue(solution, column) || "—"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrainComparisonMatrix;
