import { Cpu, Globe, Sprout, BrainCircuit } from 'lucide-react';
import { SimpleDonutChart, SimpleHorizontalBarChart, TechnologyRadar, FundingTimeline } from '../index';
import { companiesData } from '../../data';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton, SkeletonChart, SkeletonGrid } from '../Skeleton';

export function AnalyticsTab({ allCountries, allCrops, allTypes, searchTerm = "" }: { allCountries: string[], allCrops: string[], allTypes: string[], searchTerm?: string }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Filter companies based on search term
    const filteredCompanies = useMemo(() => {
        if (!searchTerm.trim()) return companiesData;
        const query = searchTerm.toLowerCase();
        return companiesData.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.product.toLowerCase().includes(query) ||
            c.tech.toLowerCase().includes(query) ||
            (c.crops && c.crops.some(crop => crop.toLowerCase().includes(query)))
        );
    }, [searchTerm]);

    // Chart data
    const techStats = useMemo(() => {
        const stats: Record<string, number> = {};
        filteredCompanies.forEach((c) => {
            let type = 'Other';
            if (c.tech.includes('Camera')) type = 'Computer Vision';
            else if (c.tech.includes('NIR') || c.tech.includes('Light')) type = 'Spectroscopy';
            else if (c.tech.includes('App') || c.tech.includes('Phone')) type = 'Mobile AI';
            else if (c.tech.includes('Laser')) type = 'Laser/3D';
            stats[type] = (stats[type] || 0) + 1;
        });
        const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];
        return Object.entries(stats).map(([label, value], index) => ({
            label,
            value,
            color: colors[index % colors.length],
        }));
    }, [filteredCompanies]);

    // Device type stats for bar chart
    const deviceTypeStats = useMemo(() => {
        const stats: Record<string, number> = {};
        filteredCompanies.forEach((c) => {
            const type = c.type || 'Other';
            stats[type] = (stats[type] || 0) + 1;
        });
        return Object.entries(stats)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredCompanies]);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <SkeletonChart />
                    <SkeletonChart />
                </div>
                <SkeletonGrid count={3} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards at top */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Cpu className="w-16 h-16" />
                    </div>
                    <h3 className="text-blue-100 font-medium text-xs uppercase tracking-wider mb-1">Companies</h3>
                    <p className="text-3xl font-bold">{companiesData.length}</p>
                    <p className="text-xs text-blue-100 mt-1">Tracked globally</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Globe className="w-16 h-16" />
                    </div>
                    <h3 className="text-blue-100 font-medium text-xs uppercase tracking-wider mb-1">Countries</h3>
                    <p className="text-3xl font-bold">{allCountries.length}</p>
                    <p className="text-xs text-blue-100 mt-1">Active markets</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Sprout className="w-16 h-16" />
                    </div>
                    <h3 className="text-green-100 font-medium text-xs uppercase tracking-wider mb-1">Crop Types</h3>
                    <p className="text-3xl font-bold">{allCrops.length}</p>
                    <p className="text-xs text-green-100 mt-1">Supported</p>
                </div>
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <BrainCircuit className="w-16 h-16" />
                    </div>
                    <h3 className="text-teal-100 font-medium text-xs uppercase tracking-wider mb-1">Device Types</h3>
                    <p className="text-3xl font-bold">{allTypes.length}</p>
                    <p className="text-xs text-teal-100 mt-1">Categories</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 text-center">
                        Technology breakdown
                    </h3>
                    <SimpleDonutChart data={techStats} />
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Computer vision leads, followed by spectroscopy.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-center">
                        Device type breakdown
                    </h3>
                    <SimpleHorizontalBarChart data={deviceTypeStats} color="bg-blue-500" />
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Benchtop and mobile tools are most common.
                    </p>
                </div>
            </div>

            {/* Technology Radar & Funding Timeline */}
            <div className="grid lg:grid-cols-2 gap-6">
                <TechnologyRadar companies={companiesData} />
                <FundingTimeline companies={companiesData} />
            </div>

            {/* Top crops */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Top crops
                </h3>
                <div className="flex flex-wrap gap-2">
                    {allCrops.slice(0, 15).map((crop) => {
                        const count = companiesData.filter((c) => c.crops.includes(crop)).length;
                        return (
                            <div
                                key={crop}
                                className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800"
                            >
                                <span className="text-sm font-medium text-green-800 dark:text-green-300">{crop}</span>
                                <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded-full">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
