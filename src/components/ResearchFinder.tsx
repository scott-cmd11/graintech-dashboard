import { useState } from 'react';
import { Search, GraduationCap, BookOpen, FileText, ArrowUpRight } from 'lucide-react';

const SUGGESTED_TOPICS = [
    "Hyperspectral imaging grain quality",
    "Deep learning wheat classification",
    "Mycotoxin detection computer vision",
    "Soybean grading automation",
    "NIR spectroscopy calibration",
    "Grain moisture prediction machine learning"
];

export const ResearchFinder = function ResearchFinder() {
    const [query, setQuery] = useState('');

    const handleSearch = (platform: 'google' | 'semantic' | 'arxiv') => {
        const searchTerm = query.trim() || "grain quality assessment technology";
        let url = '';

        switch (platform) {
            case 'google':
                url = `https://scholar.google.com/scholar?q=${encodeURIComponent(searchTerm)}`;
                break;
            case 'semantic':
                url = `https://www.semanticscholar.org/search?q=${encodeURIComponent(searchTerm)}`;
                break;
            case 'arxiv':
                url = `https://arxiv.org/search/?query=${encodeURIComponent(searchTerm)}&searchtype=all`;
                break;
        }

        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleApplyTopic = (topic: string) => {
        setQuery(topic);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Find Research Papers
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Search across academic databases for the latest studies on grain technology.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="e.g., 'Computer vision for barley defects'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch('google')}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                    />
                </div>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => handleSearch('google')}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Google Scholar</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                    </button>

                    <button
                        onClick={() => handleSearch('semantic')}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Semantic Scholar</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                    </button>

                    <button
                        onClick={() => handleSearch('arxiv')}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                    >
                        <span className="font-bold font-serif">α</span>
                        <span>arXiv.org</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70" />
                    </button>
                </div>

                {/* Suggested Topics */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Quick suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TOPICS.map((topic) => (
                            <button
                                key={topic}
                                onClick={() => handleApplyTopic(topic)}
                                className="px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
