import { useState, useEffect } from 'react';
import { BrainCircuit, ExternalLink, Sprout, Network } from 'lucide-react';
import { aiResearchData } from '../../data';
import { Skeleton, SkeletonGrid } from '../Skeleton';

export function ResearchTab() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-64" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                    </div>
                    <SkeletonGrid count={4} />
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">
                            AI in grain grading: 2024-2025 review
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 section-lead">
                            Recent work in deep learning and computer vision for agriculture.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-6">
                    {aiResearchData.algorithms.length > 0 ? (
                        aiResearchData.algorithms.map((algo, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                        {algo.icon}
                                    </div>
                                    <a
                                        href={algo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        title="Read paper"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{algo.name}</h3>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
                                    {algo.role}
                                </span>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{algo.desc}</p>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400">
                            No verified AI research entries yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Crop-specific results
                    </h3>
                    <div className="space-y-4">
                        {aiResearchData.cropDeepDives.length > 0 ? (
                            aiResearchData.cropDeepDives.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.crop}</span>
                                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                {item.focus}
                                            </span>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-1"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <span className="block text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {item.accuracy}
                                        </span>
                                        <span className="text-xs text-gray-400">Accuracy</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                No verified crop deep-dives yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Network className="w-5 h-5 text-indigo-400" />
                            What's next
                        </h3>
                        <div className="space-y-3">
                            {aiResearchData.futureTrends.length > 0 ? (
                                aiResearchData.futureTrends.map((trend, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <h4 className="font-bold text-indigo-200 mb-1 text-sm">{trend.title}</h4>
                                        <p className="text-xs text-indigo-50 leading-relaxed">{trend.desc}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-indigo-100/80 text-center">
                                    No verified trend notes yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800">
                        <h3 className="text-lg font-bold text-teal-900 dark:text-teal-200 mb-2">Why it matters</h3>
                        <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                            AI is moving from hand-built rules to models that learn patterns. This can track grain quality in real time and support identity preservation at scale.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
