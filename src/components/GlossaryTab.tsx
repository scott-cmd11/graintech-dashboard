import { useState, useMemo, useRef } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { glossaryTerms } from '../data/glossary';

export function GlossaryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTermClick = (term: string) => {
    setSearchQuery(term);
    // Scroll to top
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter terms by search query
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return glossaryTerms;
    const query = searchQuery.toLowerCase();
    return glossaryTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group filtered terms alphabetically
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof glossaryTerms> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  return (
    <div ref={containerRef} className="space-y-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-16 mb-24">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-lg bg-grain-gold/10 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-grain-gold" />
            </div>
          </div>
          <div>
            <h2 className="text-heading-1 font-bold text-gray-900 dark:text-gray-100 mb-8">
              Glossary: Plain Language Definitions
            </h2>
            <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
              Technical terms explained in everyday language. These definitions are written at an 8th-grade reading level
              to make grain technology accessible to everyone. Each term includes an example and related terms to explore.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-16 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Search className="w-20 h-20" />
          </div>
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-48 pr-40 py-12 text-body border border-gray-200 dark:border-gray-600 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-growth-green
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Clear search"
            >
              <X className="w-20 h-20" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Index of All Terms */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-24">
        <h3 className="text-heading-2 font-bold text-gray-900 dark:text-gray-100 mb-16">
          All Terms
        </h3>
        <div className="flex flex-wrap gap-4">
          {glossaryTerms.map((term) => (
            <button
              key={term.term}
              onClick={() => handleTermClick(term.term)}
              className="text-sm bg-growth-green/10 text-growth-green hover:bg-growth-green/20
                         dark:bg-growth-green/20 dark:text-growth-green-light dark:hover:bg-growth-green/30
                         px-10 py-4 rounded transition-colors font-medium"
              title={`Search for "${term.term}"`}
            >
              {term.term}
            </button>
          ))}
        </div>
      </div>

      {/* Terms organized by letter */}
      {Object.entries(groupedTerms)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, terms]) => (
          <div key={letter}>
            {/* Sticky letter header */}
            <div className="bg-gradient-to-r from-growth-green to-growth-green-dark text-white px-20 py-12 rounded-lg mb-20 sticky top-0 z-10">
              <h3 className="text-heading-2 font-bold">{letter}</h3>
            </div>

            {/* Term cards */}
            <div className="space-y-20">
              {terms.map((term) => (
                <div
                  key={term.term}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700
                             p-24 hover:shadow-md transition-shadow"
                >
                  {/* Term Title */}
                  <h4 className="text-heading-3 font-bold text-gray-900 dark:text-gray-100 mb-12">
                    {term.term}
                  </h4>

                  {/* Definition */}
                  <p className="text-body text-gray-700 dark:text-gray-300 leading-relaxed mb-16">
                    {term.definition}
                  </p>

                  {/* Example - if available */}
                  {term.example && (
                    <div className="bg-grain-gold/10 border-l-4 border-grain-gold pl-16 pr-16 py-12 rounded mb-16">
                      <p className="text-body-sm text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-grain-gold">Example: </span>
                        {term.example}
                      </p>
                    </div>
                  )}

                  {/* Related Terms - if available */}
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-body-sm font-semibold text-gray-500 dark:text-gray-400">
                        Related:
                      </span>
                      <div className="flex flex-wrap gap-8">
                        {term.relatedTerms.map((related) => (
                          <button
                            key={related}
                            onClick={() => setSearchQuery(related)}
                            className="text-body-sm bg-sky-blue/10 text-sky-blue hover:bg-sky-blue/20
                                     dark:bg-sky-blue/20 dark:text-sky-blue-light dark:hover:bg-sky-blue/30
                                     px-12 py-6 rounded-full transition-colors font-medium"
                            title={`Search for "${related}"`}
                          >
                            {related}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* No results message */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-48">
          <p className="text-body text-gray-500 dark:text-gray-400 mb-8">
            No terms found matching "<strong>{searchQuery}</strong>".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-body font-semibold text-growth-green hover:text-growth-green-dark"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
