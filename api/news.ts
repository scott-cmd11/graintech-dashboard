export const config = {
  runtime: 'edge',
};

const RSS_FEEDS = [
  'https://www.google.ca/alerts/feeds/03030665084568507357/5452083690063778198',
  'https://www.google.ca/alerts/feeds/03030665084568507357/6657544371106105633',
  'https://www.google.ca/alerts/feeds/03030665084568507357/17711904352499016105',
  'https://www.google.ca/alerts/feeds/03030665084568507357/7719612955356284469',
];

const WHITELISTED_HOSTS = new Set([
  'www.fossanalytics.com',
  'fossanalytics.com',
  'www.cgrain.ai',
  'cgrain.ai',
  'www.videometer.com',
  'videometer.com',
  'www.qualysense.com',
  'qualysense.com',
  'www.grainsense.com',
  'grainsense.com',
  'www.zoomagri.com',
  'zoomagri.com',
  'www.global-wheat.com',
  'global-wheat.com',
  'github.com',
]);

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, ''); // Strip HTML tags
}

function extractUrl(content: string): string {
  const match = content.match(/href="([^"]+)"/);
  return match ? match[1] : '';
}

function isWhitelisted(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return WHITELISTED_HOSTS.has(host);
  } catch {
    return false;
  }
}

async function fetchFeed(url: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    const xml = await response.text();

    const items: NewsItem[] = [];

    // Parse entries from Atom feed
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    let index = 0;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];

      // Extract title
      const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const title = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';

      // Extract link
      const linkMatch = entry.match(/<link[^>]*href="([^"]+)"/);
      const url = linkMatch ? linkMatch[1] : '';

      // Extract content/summary
      const contentMatch = entry.match(/<content[^>]*>([\s\S]*?)<\/content>/);
      const content = contentMatch ? decodeHtmlEntities(contentMatch[1]) : '';

      // Extract published date
      const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
      const published = publishedMatch ? publishedMatch[1] : new Date().toISOString();

      // Extract source from content or use Google Alerts
      const sourceMatch = content.match(/^([^-]+)-/);
      const source = sourceMatch ? sourceMatch[1].trim() : 'Google Alerts';

      if (title && url && isWhitelisted(url)) {
        items.push({
          id: `alert-${index++}`,
          title: title.substring(0, 200),
          source,
          date: published,
          summary: content.substring(0, 300) + (content.length > 300 ? '...' : ''),
          url,
        });
      }
    }

    return items;
  } catch (error) {
    console.error('Error fetching feed:', url, error);
    return [];
  }
}

export default async function handler() {
  try {
    // Fetch all feeds in parallel
    const feedPromises = RSS_FEEDS.map(fetchFeed);
    const feedResults = await Promise.all(feedPromises);

    // Combine all articles
    let allArticles = feedResults.flat();

    // Remove duplicates by URL
    const seen = new Set<string>();
    allArticles = allArticles.filter((article) => {
      if (seen.has(article.url)) return false;
      seen.add(article.url);
      return true;
    });

    // Sort by date (newest first)
    allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Limit to 20 articles
    allArticles = allArticles.slice(0, 20);

    return new Response(JSON.stringify({ articles: allArticles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=1800', // Cache for 30 minutes
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news', articles: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
