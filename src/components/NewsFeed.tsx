import React, { memo, useState, useMemo } from 'react';
import { Newspaper, ExternalLink, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: 'funding' | 'product' | 'partnership' | 'research' | 'industry';
  summary: string;
  url?: string;
  companyMentions?: string[];
}

// Mock news data - in production this would come from an API
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'GrainTech Sector Sees Record Investment in 2024',
    source: 'AgTech Weekly',
    date: '2024-12-20',
    category: 'funding',
    summary: 'The grain technology sector has attracted over $500M in venture capital this year, with AI-powered quality analysis leading the charge.',
    companyMentions: ['Intello Labs', 'Grainsense'],
  },
  {
    id: '2',
    title: 'New NIR Spectroscopy Standards Announced for Grain Testing',
    source: 'Grain Quality Journal',
    date: '2024-12-18',
    category: 'industry',
    summary: 'International standards body releases updated guidelines for near-infrared spectroscopy in grain quality assessment.',
    companyMentions: ['Perten', 'Foss'],
  },
  {
    id: '3',
    title: 'AI Vision Systems Revolutionize Grain Sorting Accuracy',
    source: 'Smart Agriculture Today',
    date: '2024-12-15',
    category: 'research',
    summary: 'New research shows AI-powered vision systems achieving 99.5% accuracy in detecting grain defects and foreign materials.',
    companyMentions: ['Satake', 'Buhler'],
  },
  {
    id: '4',
    title: 'Mobile Grain Testing Apps Gain Traction Among Farmers',
    source: 'Farm Technology News',
    date: '2024-12-12',
    category: 'product',
    summary: 'Smartphone-based grain analysis tools are seeing rapid adoption, with downloads up 300% year over year.',
    companyMentions: ['Intello Labs', 'AgriTech Mobile'],
  },
  {
    id: '5',
    title: 'Major Partnership Announced for Global Grain Quality Network',
    source: 'Global Ag News',
    date: '2024-12-10',
    category: 'partnership',
    summary: 'Leading grain technology companies form consortium to create unified quality data standards and sharing protocols.',
    companyMentions: ['Perten', 'Foss', 'Buhler'],
  },
  {
    id: '6',
    title: 'Hyperspectral Imaging Breakthrough for Mycotoxin Detection',
    source: 'Food Safety Quarterly',
    date: '2024-12-08',
    category: 'research',
    summary: 'Researchers develop real-time hyperspectral imaging system capable of detecting mycotoxin contamination at parts-per-billion levels.',
  },
  {
    id: '7',
    title: 'Series B Funding Secured for Handheld Grain Analyzer Startup',
    source: 'AgTech Investor',
    date: '2024-12-05',
    category: 'funding',
    summary: 'Finnish startup secures $25M to expand production of portable NIR grain analyzers for emerging markets.',
    companyMentions: ['Grainsense'],
  },
  {
    id: '8',
    title: 'Integration of IoT Sensors in Grain Storage Facilities',
    source: 'Smart Farming Magazine',
    date: '2024-12-01',
    category: 'product',
    summary: 'New IoT-enabled monitoring systems track grain quality in real-time throughout storage, reducing spoilage by up to 40%.',
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  funding: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  product: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  partnership: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  research: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  industry: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400' },
};

const categoryLabels: Record<string, string> = {
  funding: 'Funding',
  product: 'Product',
  partnership: 'Partnership',
  research: 'Research',
  industry: 'Industry',
};

export const NewsFeed = memo(function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const filteredNews = useMemo(() => {
    let news = selectedCategory
      ? mockNews.filter((item) => item.category === selectedCategory)
      : mockNews;
    return showAll ? news : news.slice(0, 4);
  }, [selectedCategory, showAll]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Industry News</h3>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selectedCategory === null
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === key
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const colors = categoryColors[item.category];

          return (
            <article
              key={item.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
                      {categoryLabels[item.category]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.source}</p>

                  {isExpanded && (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.summary}</p>
                      {item.companyMentions && item.companyMentions.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-3 h-3 text-gray-400" />
                          {item.companyMentions.map((company) => (
                            <span
                              key={company}
                              className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Show More/Less */}
      {mockNews.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-1"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All ({mockNews.length} articles)
            </>
          )}
        </button>
      )}
    </div>
  );
});

export default NewsFeed;
