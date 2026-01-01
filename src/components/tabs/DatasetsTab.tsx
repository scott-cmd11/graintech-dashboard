import { useState, useEffect, useMemo } from 'react';
import { Database } from 'lucide-react';
import { DatasetCard, Skeleton } from '../index';
import { datasetsData } from '../../data';

interface DatasetsTabProps {
    expandedDataset: number | null;
    onToggleDataset: (index: number) => void;
    searchTerm?: string;
}

export function DatasetsTab({ expandedDataset, onToggleDataset, searchTerm = "" }: DatasetsTabProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Filter datasets based on search term
    const filteredDatasets = useMemo(() => {
        if (!searchTerm.trim()) return datasetsData;
        const query = searchTerm.toLowerCase();
        return datasetsData.filter(d =>
            d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            (d.crops && d.crops.some(crop => crop.toLowerCase().includes(query)))
        );
    }, [searchTerm]);

    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <Database className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Open datasets</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 section-lead">
                    Public datasets for training grain quality models.
                </p>
            </div>

            <div className="space-y-4">
                {filteredDatasets.length > 0 ? (
                    filteredDatasets.map((dataset, i) => (
                        <DatasetCard
                            key={i}
                            dataset={dataset}
                            isExpanded={expandedDataset === i}
                            onToggle={() => onToggleDataset(i)}
                        />
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? `No datasets found matching "${searchTerm}"` : "No verified datasets yet."}
                    </div>
                )}
            </div>
        </div>
    );
}
