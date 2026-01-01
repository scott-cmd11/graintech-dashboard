import { useState, useEffect } from 'react';
import { ScrollText, Globe, ExternalLink } from 'lucide-react';
import { historyData, globalGradingPhilosophies } from '../../data';
import { Skeleton } from '../Skeleton';

export function HistoryTab() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 700);
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
                <div className="space-y-6">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <ScrollText className="w-8 h-8 text-blue-900 dark:text-blue-400" />
                    <div>
                        <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">How grading built trust</h2>
                        <p className="text-gray-600 dark:text-gray-400 section-lead">
                            A short history of grain grading and standards
                        </p>
                    </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Grain grading has always tried to bring order to a natural product. It started with visual checks in markets and grew into lab tests and AI. The goal is the same: turn a biological product into a tradable asset.
                </p>
            </div>

            <div className="relative pl-4 md:pl-0">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
                <div className="space-y-8">
                    {historyData.map((era, i) => (
                        <div key={i} className="relative flex flex-col md:flex-row gap-6 items-start group">
                            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-800 shadow-sm z-10 shrink-0 group-hover:scale-110 transition-transform">
                                <div className="text-blue-900 dark:text-blue-400">{era.icon}</div>
                            </div>
                            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-900 dark:text-blue-400 tracking-wider">
                                        {era.era}
                                    </span>
                                    <div className="md:hidden text-blue-900 dark:text-blue-400 mb-2">{era.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{era.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{era.desc}</p>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 inline-block border border-gray-100 dark:border-gray-600">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase block mb-1">
                                        Primary Metric
                                    </span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{era.metric}</span>
                                </div>

                                {era.citations && era.citations.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">Sources:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {era.citations.map((url, idx) => (
                                                <a
                                                    key={idx}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                                                    title={url}
                                                >
                                                    Source {idx + 1}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white mt-12 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    How grading works around the world
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {globalGradingPhilosophies.map((philosophy, i) => (
                        <div
                            key={i}
                            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <h4 className="font-bold text-lg text-blue-400 mb-1">{philosophy.region}</h4>
                            <p className="text-sm font-medium text-slate-200 mb-3">{philosophy.philosophy}</p>
                            <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                                <div>
                                    <span className="block text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                                        Key measure
                                    </span>
                                    {philosophy.metric}
                                </div>
                                <div>
                                    <span className="block text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                                        Authority
                                    </span>
                                    {philosophy.authority}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
