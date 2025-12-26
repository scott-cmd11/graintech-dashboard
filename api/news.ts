export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const apiKey = process.env.GNEWS_API_KEY as string | undefined;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Search queries focused on grain quality assessment technology
  const searchQueries = [
    'grain quality analysis AI',
    'grain sorting technology',
    'wheat quality assessment',
    'GrainSense OR FOSS grain',
    'seed quality inspection AI',
  ];

  try {
    // Fetch from multiple queries to get diverse results
    const allArticles: Array<{
      title: string;
      description: string;
      url: string;
      image: string;
      publishedAt: string;
      source: { name: string };
    }> = [];

    // Use broader query that returns results on free tier
    const query = encodeURIComponent('wheat OR grain OR agriculture AI');
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&token=${apiKey}`
    );

    const data = await response.json();

    if (data.articles) {
      allArticles.push(...data.articles);
    }

    // Remove duplicates by URL
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex((a) => a.url === article.url)
    );

    return new Response(JSON.stringify({ articles: uniqueArticles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
