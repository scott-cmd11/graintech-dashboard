import { memo, useState, useEffect } from 'react';
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
} from 'lucide-react';

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

// Google Alerts RSS Feed URLs
const RSS_FEEDS = [
  {
    url: 'https://www.google.ca/alerts/feeds/03030665084568507357/5452083690063778198',
    name: 'Grain Quality',
  },
  {
    url: 'https://www.google.ca/alerts/feeds/03030665084568507357/6657544371106105633',
    name: 'Grain Technology',
  },
  {
    url: 'https://www.google.ca/alerts/feeds/03030665084568507357/17711904352499016105',
    name: 'Agricultural Innovation',
  },
  {
    url: 'https://www.google.ca/alerts/feeds/03030665084568507357/7719612955356284469',
    name: 'Grain Inspection',
  },
];

// CORS proxies in order of preference
const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&json`,
];

// Fallback sample news data (displays if RSS feeds fail) - Real published sources with actual dates
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'fallback-1',
    title: 'Grain inspectors could use more technology, lawmakers told',
    source: 'Agri-Pulse Communications',
    date: '2025-06-26T16:59:00Z',
    summary: 'Witnesses at a House Agriculture subcommittee hearing on reauthorization of the U.S. Grain Standards Act emphasized that grain inspectors need access to new technology. The American Association of Grain Inspection and Weighing Agencies noted that grain inspection has relied on the same basic technology for 100 years.',
    url: 'https://www.agri-pulse.com/articles/23117-grain-inspectors-could-use-more-technology-lawmakers-told',
    category: 'Regulation',
  },
  {
    id: 'fallback-2',
    title: 'Spoiled Grain? There Are Apps for That',
    source: 'AgWeb',
    date: '2024-03-05T00:00:00Z',
    summary: 'Mobile applications are bringing grain quality assessment technology directly to farmers. These apps enable real-time testing at the point of harvest, helping farmers make informed decisions about grain handling and storage.',
    url: 'https://www.agweb.com/news/business/technology/spoiled-grain-there-are-apps',
    category: 'Technology',
  },
  {
    id: 'fallback-3',
    title: 'Ground Truth Agriculture Advancing Grain Grading with Cutting-Edge AgTech',
    source: 'Saskatchewan Trade and Invest',
    date: '2025-05-13T00:00:00Z',
    summary: 'Ground Truth Agriculture uses a combination of machine vision and near-infrared spectroscopy (NIRS) to analyze grain quality factors. The technology provides results that are consistent, accurate, and aligned with industry standards.',
    url: 'https://investsk.ca/2025/05/13/ground-truth-agriculture-advancing-grain-grading-with-cutting-edge-agtech/',
    category: 'Innovation',
  },
  {
    id: 'fallback-4',
    title: 'Advances in Hyperspectral Imaging Technology for Grain Quality and Safety Detection',
    source: 'MDPI (Food Science Journal)',
    date: '2025-08-26T00:00:00Z',
    summary: 'Hyperspectral imaging (HSI) technology offers a non-destructive, efficient, and rapid alternative for grain quality assessment by integrating spatial and spectral data. This approach enables identification of defects, contamination, and quality parameters.',
    url: 'https://www.mdpi.com/2304-8158/14/17/2977',
    category: 'Research',
  },
  {
    id: 'fallback-5',
    title: 'Precision agriculture use increases with farm size and varies widely by technology',
    source: 'USDA Economic Research Service',
    date: '2024-12-10T00:00:00Z',
    summary: 'USDA research shows adoption of precision agriculture technologies has increased substantially over the past 20 years. Guidance autosteering systems were used by 52% of midsize farms and 70% of large-scale crop farms in 2023, up from single digits in the early 2000s.',
    url: 'https://www.ers.usda.gov/data-products/charts-of-note/chart-detail?chartId=110550',
    category: 'Research',
  },
  {
    id: 'fallback-6',
    title: 'The Era of Precision Agriculture Takes Shape',
    source: 'AEM (Association of Equipment Manufacturers)',
    date: '2024-03-17T00:00:00Z',
    summary: 'The precision agriculture market continues to expand as equipment manufacturers develop advanced optical sorters, automated grain handling systems, and IoT-enabled sensors. These technologies promise increased yields and improved grain quality through data-driven decision making.',
    url: 'https://www.aem.org/news/the-era-of-precision-agriculture-has-arrived',
    category: 'Industry',
  },
];

// Helper function to fetch RSS feed with multiple proxy fallbacks
async function fetchRSSFeed(feedUrl: string, feedName: string): Promise<NewsItem[]> {
  for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
    try {
      const proxyUrl = CORS_PROXIES[proxyIndex](feedUrl);
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        continue; // Try next proxy
      }

      let feedContent = '';

      // Handle different proxy response formats
      if (proxyIndex === 0 || proxyIndex === 1) {
        feedContent = await response.text();
      } else {
        const data = await response.json();
        feedContent = data.contents || '';
      }

      if (!feedContent) {
        continue;
      }

      // Parse the XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(feedContent, 'text/xml');

      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        console.error(`Failed to parse RSS feed: ${feedName}`);
        continue;
      }

      const items = xmlDoc.getElementsByTagName('item');
      const newsItems: NewsItem[] = [];

      Array.from(items).slice(0, 20).forEach((item, index) => {
        const title = item.getElementsByTagName('title')[0]?.textContent || 'No title';
        const link = item.getElementsByTagName('link')[0]?.textContent || '';
        const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || new Date().toISOString();
        const description = item.getElementsByTagName('description')[0]?.textContent || '';

        // Clean up HTML from description
        const cleanDescription = description
          .replace(/<[^>]*>/g, '')
          .substring(0, 150)
          .trim();

        if (title && link) {
          newsItems.push({
            id: `${feedName}-${index}-${Date.now()}`,
            title,
            source: feedName,
            date: pubDate,
            summary: cleanDescription || 'No summary available',
            url: link,
          });
        }
      });

      if (newsItems.length > 0) {
        return newsItems;
      }
    } catch (error) {
      console.warn(`Proxy ${proxyIndex} failed for ${feedName}:`, error);
      continue; // Try next proxy
    }
  }

  console.error(`All proxies failed for RSS feed: ${feedName}`);
  return [];
}

// Cache management functions
function getCachedNews(): NewsItem[] {
  try {
    const cached = localStorage.getItem('graintech_news_cache');
    if (!cached) return [];

    const { articles, timestamp } = JSON.parse(cached);
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Return cached articles if less than 24 hours old
    if (Date.now() - timestamp < oneDayMs) {
      return articles;
    }
  } catch (error) {
    console.error('Error reading news cache:', error);
  }
  return [];
}

function setCachedNews(articles: NewsItem[]): void {
  try {
    localStorage.setItem('graintech_news_cache', JSON.stringify({
      articles,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Error saving news cache:', error);
  }
}

export const NewsFeed = memo(function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function fetchAllFeeds() {
      try {
        // Load cached articles immediately
        const cachedNews = getCachedNews();
        if (cachedNews.length > 0) {
          setNews(cachedNews);
          setIsCached(true);
          setError(null);
        }

        // Still load, but only show loading if no cache
        if (cachedNews.length === 0) {
          setLoading(true);
        }

        // Fetch all RSS feeds in parallel
        const feedPromises = RSS_FEEDS.map((feed) =>
          fetchRSSFeed(feed.url, feed.name)
        );

        const allFeeds = await Promise.all(feedPromises);

        // Combine all feeds and sort by date (newest first)
        const combinedNews = allFeeds
          .flat()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (combinedNews.length > 0) {
          setNews(combinedNews);
          setCachedNews(combinedNews);
          setError(null);
          setIsCached(false);
        } else if (cachedNews.length === 0) {
          // Use fallback news if no RSS feeds and no cache available
          setNews(FALLBACK_NEWS);
          setError(null);
          setIsCached(false);
          setIsFallback(true);
        }
      } catch (error) {
        console.error('Error fetching news feeds:', error);
        // Use fallback news if fetch fails and no cached articles
        if (news.length === 0) {
          setNews(FALLBACK_NEWS);
          setError(null);
          setIsFallback(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAllFeeds();
  }, []);

  const displayedNews = showAll ? news : news.slice(0, 5);

  const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  const parseDate = (value: string) => {
    if (isDateOnly(value)) {
      return new Date(`${value}T00:00:00`);
    }
    return new Date(value);
  };

  const formatDate = (value: string) => {
    const date = parseDate(value);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (value: string) => {
    if (isDateOnly(value)) return null;
    const date = parseDate(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const gradients = [
    'from-amber-500/80 via-orange-500/70 to-rose-500/70',
    'from-emerald-500/80 via-teal-500/70 to-cyan-500/70',
    'from-sky-500/80 via-blue-500/70 to-indigo-500/70',
    'from-fuchsia-500/80 via-purple-500/70 to-indigo-500/70',
  ];

  const getGradient = (source: string) => {
    const hash = source.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getSourceInitials = (source: string) => {
    const parts = source.split(' ').filter(Boolean);
    const initials = parts.map((part) => part[0]).slice(0, 2).join('');
    return initials ? initials.toUpperCase() : 'GI';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 display-font">Industry news</h3>
        </div>
        {!loading && news.length > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            From Google Alerts
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="h-36 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-300">Unable to load news</h4>
            <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">{error}</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">No news articles available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedNews.map((item) => {
            const timeLabel = formatTime(item.date);
            const imageUrl = item.imageUrl;
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`relative h-36 w-full ${
                    imageUrl ? 'bg-slate-900' : `bg-gradient-to-br ${getGradient(item.source)}`
                  }`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-slate-900/30" />
                  {item.category && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/90">
                      {item.category}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                      Source
                    </span>
                    <div className="text-xl font-semibold text-white">{getSourceInitials(item.source)}</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.source}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </span>
                    {timeLabel && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {timeLabel}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {item.summary}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200"
                  >
                    Read more
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {news.length > 5 && !loading && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-6 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-1"
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
        {isFallback ? '📚 Sample articles (showing when live feeds are unavailable)' : isCached ? '📦 Cached articles (will refresh tomorrow)' : 'News curated from Google Alerts feeds. Refreshes daily.'}
      </p>
    </div>
  );
});

export default NewsFeed;
