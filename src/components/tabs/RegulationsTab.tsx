import { useState, useEffect } from 'react';
import { Gavel, ExternalLink, BookOpen } from 'lucide-react';
import { regulatoryData } from '../../data';
import { Skeleton, SkeletonGrid } from '../Skeleton';

export function RegulationsTab() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 900);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                </div>
                <SkeletonGrid count={4} />
            </div>
        );
    }
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Gavel className="w-8 h-8 text-blue-700 dark:text-blue-400" />
                    <div>
                        <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">
                            How rules are changing
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 section-lead">
                            How governments are updating rules for AI and digital grading.
                        </p>
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Rules are moving from visual checks to automated, science-based checks. Canada and the US are updating laws, while South America uses faster decrees to allow digital inspection.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {regulatoryData.regions.map((region, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors">
                                    {region.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{region.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        {region.agency}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                                {region.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Key Legislation</p>
                                <div className="flex items-start gap-2">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{region.legislation}</p>
                                    <a
                                        href={region.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 shrink-0 mt-0.5"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-200">
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wide">
                                    Key change
                                </p>
                                <p className="text-sm">{region.keyChange}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Main driver</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{region.driver}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Gavel className="w-64 h-64" />
                </div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                    Who is responsible for AI decisions?
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-3xl relative z-10">
                    A key issue is responsibility. If AI makes a grading decision that causes a loss, who is accountable? Unlike a human inspector who follows a public visual guide, AI uses private algorithms.
                </p>
                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                        <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                            US approach
                        </span>
                        <span className="text-sm font-medium text-gray-200">
                            Strict "Inspection Technology Evaluation" (ITE) rules require re-certification when algorithms change.
                        </span>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                        <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                            Australian approach
                        </span>
                        <span className="text-sm font-medium text-gray-200">
                            Industry framework sets rules for data ownership and algorithm transparency.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
