import { useMemo, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import type { AdoptionEvent } from "../data/adoptionTimeline";
import type {
  GrainSolution,
  Region,
} from "../data/grainTechEntities";
import { formatCompanyUrl, getCompanyUrl } from "../utils/companyLookup";
import { formatEnumLabel } from "../utils/formatLabels";

interface GrainAdoptionTimelineProps {
  adoptionEvents: AdoptionEvent[];
  grainSolutions: GrainSolution[];
}

const categoryColors: Record<AdoptionEvent["category"], string> = {
  ProductLaunch: "bg-emerald-600",
  Regulation: "bg-blue-500",
  Pilot: "bg-amber-500",
  NationalProgram: "bg-teal-600",
  Other: "bg-slate-500",
};

const chipBase =
  "px-3 py-1 text-xs rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500";


function toggleFilter<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

function matchCompanies(event: AdoptionEvent, solutions: GrainSolution[]): GrainSolution[] {
  if (!event.relatedCompanyIds || event.relatedCompanyIds.length === 0) {
    return [];
  }
  const needles = event.relatedCompanyIds.map((id) => id.toLowerCase());
  return solutions.filter((solution) => {
    const hay = `${solution.company} ${solution.productName}`.toLowerCase();
    return needles.some((needle) => hay.includes(needle));
  });
}

export const GrainAdoptionTimeline = function GrainAdoptionTimeline({
  adoptionEvents,
  grainSolutions,
}: GrainAdoptionTimelineProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<AdoptionEvent["category"][]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const regionOptions = useMemo(() => {
    const set = new Set<Region | "Global">();
    adoptionEvents.forEach((event) => set.add(event.region));
    return Array.from(set).sort();
  }, [adoptionEvents]);

  const categoryOptions = useMemo(() => {
    const set = new Set<AdoptionEvent["category"]>();
    adoptionEvents.forEach((event) => set.add(event.category));
    return Array.from(set).sort();
  }, [adoptionEvents]);

  const filteredEvents = useMemo(() => {
    return adoptionEvents.filter((event) => {
      const matchRegion = regions.length === 0 || regions.includes(event.region as Region);
      const matchCategory = categories.length === 0 || categories.includes(event.category);
      return matchRegion && matchCategory;
    });
  }, [adoptionEvents, regions, categories]);

  // Sort Newest -> Oldest for horizontal timeline (Left -> Right)
  const grouped = useMemo(() => {
    const byYear = new Map<number, AdoptionEvent[]>();
    filteredEvents.forEach((event) => {
      const list = byYear.get(event.year) ?? [];
      list.push(event);
      byYear.set(event.year, list);
    });
    return Array.from(byYear.entries())
      .sort((a, b) => b[0] - a[0]) // DESCENDING
      .map(([year, events]) => ({
        year,
        events: events.sort((a, b) => (b.month ?? 0) - (a.month ?? 0)),
      }));
  }, [filteredEvents]);

  const clearFilters = () => {
    setRegions([]);
    setCategories([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Adoption Timeline
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tracking the evolution of grading technology over time.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
            {filteredEvents.length} milestones
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-start gap-8 py-4 border-y border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Regions</span>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <button
                  key={region}
                  onClick={() => setRegions((prev) => toggleFilter(prev, region as Region))}
                  className={`${chipBase} ${regions.includes(region as Region)
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-emerald-400"
                    }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Categories</span>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategories((prev) => toggleFilter(prev, category))}
                  className={`${chipBase} ${categories.includes(category)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400"
                    }`}
                >
                  {formatEnumLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {(regions.length > 0 || categories.length > 0) && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline self-end pb-1">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        className="flex overflow-x-auto pb-8 pt-4 gap-8 custom-scrollbar relative min-h-[400px]"
      >
        {grouped.map((group) => (
          <div key={group.year} className="flex-shrink-0 flex flex-col gap-4 snap-start relative">
            {/* Year Marker */}
            <div className="text-4xl font-black text-gray-200 dark:text-gray-700 select-none sticky left-0 leading-none">
              {group.year}
            </div>

            <div className="flex gap-4">
              {group.events.map((event) => {
                const isActive = activeEventId === event.id;
                const relatedSolutions = isActive ? matchCompanies(event, grainSolutions) : [];

                return (
                  <div
                    key={event.id}
                    className={`w-[320px] bg-white dark:bg-gray-800 rounded-xl border transition-all flex flex-col shadow-sm hover:shadow-md ${isActive
                      ? "border-teal-500 ring-1 ring-teal-500 z-10 scale-[1.02]"
                      : "border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    {/* Card Content */}
                    <div
                      className="p-5 flex-1 cursor-pointer"
                      onClick={() => setActiveEventId(isActive ? null : event.id)}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2 h-2 rounded-full ${categoryColors[event.category]}`} />
                        <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">
                          {formatEnumLabel(event.category)}
                        </span>
                        <span className="ml-auto text-[10px] font-mono text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {event.region}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                        {event.description}
                      </p>
                    </div>

                    {/* Footer / Source Link */}
                    {event.url && (
                      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">Source Available</span>
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Verify Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Inline Expansion for Solutions */}
                    {isActive && relatedSolutions.length > 0 && (
                      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-teal-50/50 dark:bg-gray-800/80 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-xs font-bold text-teal-800 dark:text-teal-400 mb-2">Related Technology:</p>
                        <div className="space-y-2">
                          {relatedSolutions.map(sol => (
                            <div key={sol.id} className="text-xs bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                              <div className="font-semibold">{sol.company}</div>
                              <div className="text-gray-500">{sol.productName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* Right padding for scroll snapping */}
        <div className="w-8 shrink-0" />
      </div>
    </div>
  );
};

export default GrainAdoptionTimeline;
