import { memo, useState } from 'react';
import { Newspaper, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import curatedNews from '../data/curatedNews.json';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category?: string;
}

export const NewsFeed = memo(function NewsFeed() {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const news: NewsItem[] = curatedNews;

  const filteredNews = filter
    ? news.filter((item) => item.category === filter)
    : news;

  const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 4);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Industry News</h3>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filter === null
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('company')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filter === 'company'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Companies
        </button>
        <button
          onClick={() => setFilter('dataset')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filter === 'dataset'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Datasets
        </button>
      </div>

      <div className="space-y-4">
        {displayedNews.map((item) => (
          <article
            key={item.id}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{item.source}</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.date)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {item.summary}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Visit Website
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length > 4 && (
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
              Show All ({filteredNews.length} items)
            </>
          )}
        </button>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Curated industry resources • Updated regularly
      </p>
    </div>
  );
});

export default NewsFeed;
