import { memo, useState, useEffect } from 'react';
import { Newspaper, Clock, ChevronDown, ChevronUp, ExternalLink, RefreshCw } from 'lucide-react';
import curatedNews from '../data/curatedNews.json';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category?: string;
  citations?: string[];
}

export const NewsFeed = memo(function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showCurated, setShowCurated] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles);
        } else {
          setNews(curatedNews);
          setShowCurated(true);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(curatedNews);
        setShowCurated(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const displayedNews = showAll ? news : news.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 display-font">Industry news</h3>
        </div>
        {!loading && !showCurated && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Live (whitelisted sources)
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
      <div className="space-y-4">
        {displayedNews.map((item) => (
          <article
            key={item.id}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {item.source}
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(item.date)}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {item.summary}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
              >
                Read article
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
      )}

      {news.length > 5 && !loading && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-1"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show all ({news.length} articles)
            </>
          )}
        </button>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        {showCurated ? 'Curated industry resources from verified sources.' : 'Live feed from whitelisted sources.'}
      </p>
    </div>
  );
});

export default NewsFeed;
