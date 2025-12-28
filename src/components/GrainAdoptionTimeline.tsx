import { useMemo, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import type { AdoptionEvent } from "../data/adoptionTimeline";
import type {
  GrainSolution,
  Region,
} from "../data/grainTechEntities";
import { formatCompanyUrl, getCompanyUrl } from "../utils/companyLookup";

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
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

  const grouped = useMemo(() => {
    const byYear = new Map<number, AdoptionEvent[]>();
    filteredEvents.forEach((event) => {
      const list = byYear.get(event.year) ?? [];
      list.push(event);
      byYear.set(event.year, list);
    });
    return Array.from(byYear.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, events]) => ({
        year,
        events: events.sort((a, b) => (b.month ?? 0) - (a.month ?? 0)),
      }));
  }, [filteredEvents]);

  const activeEvent = activeEventId
    ? filteredEvents.find((event) => event.id === activeEventId)
    : null;
  const relatedSolutions = activeEvent ? matchCompanies(activeEvent, grainSolutions) : [];

  const clearFilters = () => {
    setRegions([]);
    setCategories([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Adoption Timeline
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A curated view of product launches, pilots, and policy milestones across regions.
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filteredEvents.length} events
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Regions
          </p>
          <div className="flex flex-wrap gap-2">
            {regionOptions.map((region) => {
              const selected = regions.includes(region as Region);
              return (
                <button
                  key={region}
                  onClick={() => setRegions((prev) => toggleFilter(prev, region as Region))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const selected = categories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => setCategories((prev) => toggleFilter(prev, category))}
                  className={`${chipBase} ${
                    selected
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {(regions.length > 0 || categories.length > 0) && (
        <button
          onClick={clearFilters}
          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mb-4"
        >
          Clear filters
        </button>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.year} className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {group.year}
              </div>
              <div className="space-y-4">
                {group.events.map((event) => {
                  const related = matchCompanies(event, grainSolutions);
                  return (
                    <div key={event.id} className="relative group">
                      <button
                        onClick={() => setActiveEventId(event.id)}
                        className={`w-full text-left rounded-xl border p-4 transition-colors ${
                          activeEventId === event.id
                            ? "border-teal-300 dark:border-teal-600 bg-teal-50/60 dark:bg-teal-900/20"
                            : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-3 h-3 rounded-full ${categoryColors[event.category]}`} />
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {event.category}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{event.region}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      </button>

                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 max-w-sm z-10">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {event.title}
                        </div>
                        <div>{event.description}</div>
                        <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                          {event.month && monthNames[event.month - 1]
                            ? `${monthNames[event.month - 1]} ${event.year}`
                            : event.year} • {event.region} • {event.category}
                        </div>
                        {related.length > 0 && (
                          <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                            Related: {related.map((solution) => solution.company).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 h-fit">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Event details
          </h4>
          {activeEvent ? (
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {activeEvent.title}
                </span>
                <p className="mt-1">{activeEvent.description}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Region:</span>{" "}
                {activeEvent.region}
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Category:</span>{" "}
                {activeEvent.category}
              </div>
              {relatedSolutions.length > 0 ? (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Related solutions:
                  </span>
                  <div className="mt-2 space-y-2">
                    {relatedSolutions.map((solution) => {
                      const companyUrl = solution.url || getCompanyUrl(solution.company);
                      return (
                        <div key={solution.id} className="rounded-lg bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span>{solution.company}</span>
                            {companyUrl && (
                              <a
                                href={formatCompanyUrl(companyUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {solution.productName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  No related solutions linked.
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select an event to see details and related solutions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrainAdoptionTimeline;
