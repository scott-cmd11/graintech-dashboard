import { memo, useState, useEffect } from 'react';
import { Newspaper, Clock, ChevronDown, ChevronUp, ExternalLink, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  image?: string;
}

// API key is now stored server-side in Vercel environment variables

// Curated industry news about grain quality tech companies
const curatedNews: NewsItem[] = [
  {
    id: 'c1',
    title: 'FOSS Analytical Solutions for Grain Quality Testing',
    source: 'FOSS',
    date: new Date().toISOString(),
    summary: 'FOSS provides rapid analytical solutions for grain testing, including NIR technology for protein, moisture, and oil content analysis.',
    url: 'https://www.fossanalytics.com/en/industries/grain',
  },
  {
    id: 'c2',
    title: 'GrainSense: Portable Grain Analyzer Technology',
    source: 'GrainSense',
    date: new Date().toISOString(),
    summary: 'GrainSense offers handheld NIR analyzers for instant protein, moisture, and oil measurements directly in the field.',
    url: 'https://grainsense.com/',
  },
  {
    id: 'c3',
    title: 'Cgrain Value: AI-Powered Grain Quality Analysis',
    source: 'Cgrain',
    date: new Date().toISOString(),
    summary: 'Cgrain Value uses computer vision and AI to analyze grain samples for quality parameters including damaged kernels and foreign matter.',
    url: 'https://cgrain.com/',
  },
  {
    id: 'c4',
    title: 'Global Wheat Head Detection Dataset Released',
    source: 'Global Wheat Challenge',
    date: new Date().toISOString(),
    summary: 'The Global Wheat Head Detection dataset provides annotated images for developing AI models for wheat phenotyping.',
    url: 'http://www.global-wheat.com/',
  },
  {
    id: 'c5',
    title: 'Videometer Multispectral Imaging for Seed Analysis',
    source: 'Videometer',
    date: new Date().toISOString(),
    summary: 'Videometer offers multispectral imaging solutions for seed quality assessment, variety identification, and disease detection.',
    url: 'https://videometer.com/',
  },
];

// Fallback uses curated news
const fallbackNews = curatedNews;

export const NewsFeed = memo(function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          const liveNews: NewsItem[] = data.articles.map((article: {
            title: string;
            description: string;
            url: string;
            image: string;
            publishedAt: string;
            source: { name: string };
          }, index: number) => ({
            id: String(index + 1),
            title: article.title,
            summary: article.description || 'No description available',
            url: article.url,
            image: article.image,
            date: article.publishedAt,
            source: article.source?.name || 'Unknown Source',
          }));
          // Combine live news with curated industry news
          setNews([...liveNews.slice(0, 5), ...curatedNews.slice(0, 5)]);
        } else {
          setNews(curatedNews);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews(fallbackNews);
        setError('Failed to load live news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const displayedNews = showAll ? news : news.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Industry News</h3>
        </div>
        {error && (
          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Using cached data
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
        <>
          <div className="space-y-4">
            {displayedNews.map((item) => (
              <article
                key={item.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg shrink-0 hidden sm:block"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.source}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {item.summary}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                    >
                      Read more
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {news.length > 4 && (
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
                  Show All ({news.length} articles)
                </>
              )}
            </button>
          )}
        </>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Powered by GNews
      </p>
    </div>
  );
});

export default NewsFeed;
