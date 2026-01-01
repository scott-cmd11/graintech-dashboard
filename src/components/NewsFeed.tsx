import { memo, useState, useEffect, useMemo } from 'react';
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Newspaper,
  RefreshCw,
  User,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import { companiesData } from '../data';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  imageUrl?: string;
  category?: string;
}

// CORS proxies in order of preference
const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&json`,
];

// Fallback sample news data (displays if RSS feeds fail)
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'fallback-1',
    title: 'Grain inspectors could use more technology, lawmakers told',
    source: 'Agri-Pulse',
    date: '2025-06-26T16:59:00Z',
    summary: 'Witnesses at a House Agriculture subcommittee hearing... emphasized that grain inspectors need access to new technology.',
    url: 'https://www.agri-pulse.com/articles/23117-grain-inspectors-could-use-more-technology-lawmakers-told',
    category: 'Regulation',
  },
  {
    id: 'fallback-2',
    title: 'ZoomAgri lands $6m from GrainCorp and others',
    source: 'AgFunderNews',
    date: '2023-07-27T07:00:00Z',
    summary: 'ZoomAgri lands $6m from GrainCorp and others to expand AI-powered grain inspection system.',
    url: 'https://agfundernews.com/zoomagri-lands-6m-from-graincorp-and-others-to-expand-ai-powered-grain-inspection-system',
    category: 'Industry',
  },
  {
    id: 'fallback-3',
    title: 'Ground Truth Agriculture Advancing Grain Grading',
    source: 'SaskTrade',
    date: '2025-05-13T00:00:00Z',
    summary: 'Ground Truth Agriculture uses a combination of machine vision and near-infrared spectroscopy (NIRS) to analyze grain quality.',
    url: 'https://investsk.ca/2025/05/13/ground-truth-agriculture-advancing-grain-grading-with-cutting-edge-agtech/',
    category: 'Innovation',
  },
  {
    id: 'fallback-4',
    title: 'GoMicro AI web app live for five Australian crops',
    source: 'Grain Central',
    date: '2023-06-21T00:00:00Z',
    summary: 'GoMicro’s AI grain assessment technology is now available as a web app for wheat, barley, canola, lentils and peas.',
    url: 'https://www.graincentral.com/ag-tech/gomicro-ai-web-app-live-for-five-australian-crops/',
    category: 'Technology',
  },
];

// Helper function to build Google News RSS URL
function getGoogleNewsRssUrl(query: string): string {
  // Use US English but query can be global
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

// Helper function to fetch RSS feed with multiple proxy fallbacks
async function fetchRSSFeed(query: string, categoryName: string): Promise<NewsItem[]> {
  const feedUrl = getGoogleNewsRssUrl(query);

  for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
    try {
      const proxyUrl = CORS_PROXIES[proxyIndex](feedUrl);
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) continue;

      let feedContent = '';
      if (proxyIndex === 0 || proxyIndex === 1) {
        feedContent = await response.text();
      } else {
        const data = await response.json();
        feedContent = data.contents || '';
      }

      if (!feedContent) continue;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(feedContent, 'text/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

      const items = xmlDoc.getElementsByTagName('item');
      const newsItems: NewsItem[] = [];

      Array.from(items).slice(0, 10).forEach((item, index) => {
        const title = item.getElementsByTagName('title')[0]?.textContent || 'No title';
        const link = item.getElementsByTagName('link')[0]?.textContent || '';
        const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || new Date().toISOString();
        // Google News RSS descriptions often contain HTML anchors, we want just text if possible, or use snippet
        let description = item.getElementsByTagName('description')[0]?.textContent || '';

        // Google News RSS descriptions are often just links, so let's try to extract source from title if needed
        // Format often: "Title - Source"
        let source = categoryName;
        const titleParts = title.split(' - ');
        if (titleParts.length > 1) {
          source = titleParts[titleParts.length - 1]; // Last part is usually source
        }

        // Clean up description HTML
        const cleanDescription = description
          .replace(/<a[^>]*>.*?<\/a>/g, '') // Remove links
          .replace(/<[^>]*>/g, '') // Remove other tags
          .replace(/&nbsp;/g, ' ')
          .trim();

        if (title && link) {
          newsItems.push({
            id: `${query}-${index}-${Date.now()}`,
            title,
            source: source,
            date: pubDate,
            summary: cleanDescription || title, // Fallback to title if summary is empty
            url: link,
            category: categoryName
          });
        }
      });

      if (newsItems.length > 0) return newsItems;
    } catch (error) {
      console.warn(`Proxy ${proxyIndex} failed for ${query}:`, error);
      continue;
    }
  }
  return [];
}

export const NewsFeed = memo(function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Default "Industry" queries
  const defaultQueries = useMemo(() => [
    { q: 'Grain Quality Technology', name: 'Industry' },
    { q: 'Grain Inspection Innovation', name: 'Innovation' },
    { q: 'ZoomAgri Australia', name: 'ZoomAgri' }, // Specific user request
    { q: 'GoMicro Grain', name: 'GoMicro' },
    { q: 'Grainship Technology', name: 'Logistics' }
  ], []);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      setError(null);
      setNews([]);

      try {
        let queriesToFetch = [];

        if (selectedCompanyId === 'all') {
          queriesToFetch = defaultQueries;
        } else {
          const company = companiesData.find(c => c.id.toString() === selectedCompanyId);
          if (company) {
            // Smart query construction
            queriesToFetch = [
              { q: `"${company.name}" grain`, name: company.name }, // Exact match preferred
              { q: `${company.name} ${company.product}`, name: 'Product' },
              { q: `${company.name} technology`, name: 'Tech' }
            ];
          }
        }

        // If manual search query exists, override
        if (searchQuery) {
          queriesToFetch = [{ q: searchQuery, name: 'Search' }];
        }

        const promises = queriesToFetch.map(q => fetchRSSFeed(q.q, q.name));
        const results = await Promise.all(promises);

        const combinedNews = results
          .flat()
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.title === item.title) // Dedup by title
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (combinedNews.length > 0) {
          setNews(combinedNews);
        } else {
          // If filtering by specific company yields no results, might be good to show fallback or empty state
          // For 'all', show fallback
          if (selectedCompanyId === 'all' && !searchQuery) {
            setNews(FALLBACK_NEWS);
          }
        }
      } catch (err) {
        console.error('Failed to load news', err);
        if (selectedCompanyId === 'all') setNews(FALLBACK_NEWS);
        setError('Failed to fetch latest updates');
      } finally {
        setLoading(false);
      }
    }

    // Debounce basic search, but load immediately on category change
    const timeoutId = setTimeout(loadNews, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedCompanyId, searchQuery, defaultQueries]);

  const displayedNews = showAll ? news : news.slice(0, 9); // Show more by default

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Company Filter */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedCompanyId}
              onChange={(e) => {
                setSelectedCompanyId(e.target.value);
                setSearchQuery(''); // Clear manual search
              }}
              className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Global Industry News</option>
              <optgroup label="Filter by Technology">
                {companiesData.sort((a, b) => a.name.localeCompare(b.name)).map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Manual Search */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 display-font">
              {selectedCompanyId !== 'all'
                ? `${companiesData.find(c => c.id.toString() === selectedCompanyId)?.name} News`
                : 'Latest Industry Updates'}
            </h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Powered by Google News
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="h-36 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center text-red-800 dark:text-red-200">
            {error}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recent news found for this specific query.</p>
            <button
              onClick={() => setSelectedCompanyId('all')}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Back to Global News
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {displayedNews.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md h-full"
              >
                <div className="p-5 flex flex-col h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50">
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                        {item.source}
                      </span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-indigo-600 transition-colors">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h4>
                  </div>

                  {/* Summary snippet if available and not same as title */}
                  {item.summary && item.summary !== item.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                      {item.summary}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      Read Article
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {news.length > 9 && !loading && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-8 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show all {news.length} articles <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

export default NewsFeed;
