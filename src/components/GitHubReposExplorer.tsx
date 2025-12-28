import { useMemo, useState, useEffect } from 'react';
import { Github, Star, Code, Calendar, ExternalLink, Loader } from 'lucide-react';
import type { GitHubRepo } from '../types';

interface CategorizedRepos {
  [category: string]: GitHubRepo[];
}

const SEARCH_QUERIES = [
  { query: 'agricultural grain quality inspection', category: 'Agriculture' },
  { query: 'grain quality assessment machine learning', category: 'AI/ML' },
  { query: 'crop inspection computer vision', category: 'Computer Vision' },
  { query: 'agricultural quality control AI', category: 'AI/ML' },
  { query: 'grain classification agriculture', category: 'Computer Vision' },
  { query: 'agricultural imaging detection', category: 'Computer Vision' },
  { query: 'crop quality evaluation AI', category: 'AI/ML' },
  { query: 'agricultural automation vision', category: 'Agriculture' },
];

// Keywords to filter out non-agricultural results
const EXCLUDE_KEYWORDS = [
  'audio',
  'sound',
  'music',
  'texture filter',
  'image enhancement',
  'noise reduction',
  'webpack',
  'graphql',
  'database',
  'css',
  'web framework',
];

// Helper function to check if a repo should be excluded
function shouldExcludeRepo(item: any): boolean {
  const name = (item.name || '').toLowerCase();
  const description = (item.description || '').toLowerCase();
  const topics = (item.topics || []).map((t: string) => t.toLowerCase()).join(' ');
  const language = (item.language || '').toLowerCase();

  const fullContent = `${name} ${description} ${topics} ${language}`;

  return EXCLUDE_KEYWORDS.some(keyword => fullContent.includes(keyword));
}

export const GitHubReposExplorer = function GitHubReposExplorer() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch repos from GitHub API
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        const allRepos: Map<number, GitHubRepo> = new Map();

        // Fetch from multiple search queries
        for (const { query } of SEARCH_QUERIES) {
          const response = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+sort:stars&per_page=10`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );

          if (!response.ok) {
            continue; // Skip this query if it fails
          }

          const data = await response.json();

          if (data.items) {
            data.items.forEach((item: any) => {
              if (!allRepos.has(item.id) && !shouldExcludeRepo(item)) {
                allRepos.set(item.id, {
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  url: item.html_url,
                  language: item.language,
                  stars: item.stargazers_count,
                  forks: item.forks_count,
                  updated_at: item.updated_at,
                  topics: item.topics || [],
                });
              }
            });
          }

          // Rate limiting - add a small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Convert to array and sort by stars
        const sortedRepos = Array.from(allRepos.values()).sort((a, b) => b.stars - a.stars);
        setRepos(sortedRepos);
        setError(null);
      } catch (err) {
        setError('Failed to fetch repositories. Please try again later.');
        console.error('GitHub API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Categorize repos based on topics and language
  const categorizedRepos = useMemo(() => {
    const categorized: CategorizedRepos = {
      'AI/ML': [],
      'Computer Vision': [],
      'Agriculture': [],
      'Open Source Tools': [],
      'All': repos,
    };

    repos.forEach((repo) => {
      const topics = repo.topics.map(t => t.toLowerCase());
      const description = (repo.description || '').toLowerCase();

      // Classify by topics and content
      if (
        topics.includes('machine-learning') ||
        topics.includes('artificial-intelligence') ||
        topics.includes('deep-learning') ||
        topics.includes('neural-network') ||
        description.includes('ai') ||
        description.includes('machine learning') ||
        description.includes('neural')
      ) {
        categorized['AI/ML'].push(repo);
      } else if (
        topics.includes('computer-vision') ||
        topics.includes('image-processing') ||
        topics.includes('opencv') ||
        description.includes('computer vision') ||
        description.includes('image detection') ||
        description.includes('object detection')
      ) {
        categorized['Computer Vision'].push(repo);
      } else if (
        topics.includes('agriculture') ||
        topics.includes('crop') ||
        topics.includes('farming') ||
        description.includes('crop') ||
        description.includes('farm') ||
        description.includes('agriculture')
      ) {
        categorized['Agriculture'].push(repo);
      } else if (
        topics.includes('tool') ||
        topics.includes('utility') ||
        description.includes('tool') ||
        description.includes('library')
      ) {
        categorized['Open Source Tools'].push(repo);
      }
    });

    return categorized;
  }, [repos]);

  const displayedRepos = selectedCategory
    ? categorizedRepos[selectedCategory] || []
    : repos;

  const categories = useMemo(() => {
    return Object.keys(categorizedRepos).map((cat) => ({
      name: cat,
      count: categorizedRepos[cat].length,
    }));
  }, [categorizedRepos]);

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Open Source Resources
          </h3>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 text-amber-700 dark:text-amber-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Open Source Resources
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Growing list of GitHub repositories related to grain quality, AI, and agricultural technology. Updated dynamically from GitHub search.
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <Loader className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-gray-600 dark:text-gray-400">Discovering repositories...</span>
          </div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
                    selectedCategory === cat.name
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-teal-600 dark:hover:border-teal-500'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Repos Count */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
              Showing {displayedRepos.length} {selectedCategory ? `${selectedCategory}` : ''} repositories
            </p>

            {/* Repos Grid */}
            {displayedRepos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayedRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {repo.name}
                        </h4>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 flex-shrink-0 mt-0.5" />
                    </div>

                    {/* Description */}
                    {repo.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {repo.description}
                      </p>
                    )}

                    {/* Topics */}
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 3 && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 px-2 py-0.5">
                            +{repo.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          <span className="line-clamp-1">{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium">{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No repositories found in this category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubReposExplorer;
