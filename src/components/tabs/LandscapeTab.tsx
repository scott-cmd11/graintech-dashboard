import { useState, useEffect } from 'react';
import { GrainLandscapeMap, GrainComparisonMatrix, TechStackExplorer } from '../index';
import { Skeleton } from '../Skeleton';
import { grainSolutions } from '../../data';
import type { Region, SensingTech, FormFactor, UseCase } from '../../data/grainTechEntities';

interface LandscapeTabProps {
    companiesOpen: boolean;
    onCompaniesToggle: () => void;
    searchTerm?: string;
}

function ViewToggle({
    activeView,
    onViewChange
}: {
    activeView: 'map' | 'table' | 'stack';
    onViewChange: (view: 'map' | 'table' | 'stack') => void;
}) {
    return (
        <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
            {(['map', 'table', 'stack'] as const).map((view) => (
                <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${activeView === view
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    {view === 'map' ? 'Map' : view === 'table' ? 'Table' : 'Tech Stack'}
                </button>
            ))}
        </div>
    );
}

export function LandscapeTab({ companiesOpen, onCompaniesToggle, searchTerm }: LandscapeTabProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [landscapeView, setLandscapeView] = useState<'map' | 'table' | 'stack'>('map');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const [landscapeFilters, setLandscapeFilters] = useState({
        regions: [] as Region[],
        sensing: [] as SensingTech[],
        formFactors: [] as FormFactor[],
        useCases: [] as UseCase[],
    });

    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                </div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* View Toggle */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grain Technology Landscape</h2>
                <ViewToggle activeView={landscapeView} onViewChange={setLandscapeView} />
            </div>

            {/* Map View */}
            {landscapeView === 'map' && (
                <div className="space-y-6">
                    <GrainLandscapeMap
                        grainSolutions={grainSolutions}
                        filters={landscapeFilters}
                        onFiltersChange={setLandscapeFilters}
                        showFilters={true}
                        companiesOpen={companiesOpen}
                        onCompaniesToggle={onCompaniesToggle}
                        externalSearchTerm={searchTerm}
                    />
                </div>
            )}

            {/* Table View */}
            {landscapeView === 'table' && (
                <div className="space-y-6">
                    <GrainComparisonMatrix
                        grainSolutions={grainSolutions}
                        externalSearchTerm={searchTerm}
                    />
                </div>
            )}

            {/* Tech Stack View */}
            {landscapeView === 'stack' && (
                <div className="space-y-6">
                    <TechStackExplorer
                        grainSolutions={grainSolutions}
                        variant="standalone"
                        filters={{
                            regions: landscapeFilters.regions,
                            sensingTech: landscapeFilters.sensing,
                            formFactors: landscapeFilters.formFactors,
                            useCases: landscapeFilters.useCases,
                        }}
                        onFiltersChange={(next) =>
                            setLandscapeFilters((prev) => ({
                                ...prev,
                                regions: next.regions ?? prev.regions,
                                sensing: next.sensingTech,
                                formFactors: next.formFactors,
                                useCases: next.useCases,
                            }))
                        }
                        showSharedFilters={true}
                    />
                </div>
            )}
        </div>
    );
}
