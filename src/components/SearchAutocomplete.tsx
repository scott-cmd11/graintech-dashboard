import React, { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, Building2, Sprout, Cpu } from 'lucide-react';
import type { Company } from '../types';

interface SearchAutocompleteProps {
  companies: Company[];
  onSelect: (value: string, type: string) => void;
}

interface Suggestion {
  type: 'company' | 'crop' | 'tech';
  value: string;
  company?: Company;
}

export const SearchAutocomplete = memo(function SearchAutocomplete({
  companies,
  onSelect,
}: SearchAutocompleteProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Generate suggestions
  const suggestions = useMemo((): Suggestion[] => {
    if (value.length < 2) return [];

    const searchLower = value.toLowerCase();
    const results: Suggestion[] = [];

    // Company matches
    companies
      .filter((c) => c.name.toLowerCase().includes(searchLower) || c.product.toLowerCase().includes(searchLower))
      .slice(0, 5)
      .forEach((company) => {
        results.push({ type: 'company', value: company.name, company });
      });

    // Crop matches
    const cropMatches = new Set<string>();
    companies.forEach((c) => {
      c.crops.forEach((crop) => {
        if (crop.toLowerCase().includes(searchLower)) {
          cropMatches.add(crop);
        }
      });
    });
    Array.from(cropMatches)
      .slice(0, 3)
      .forEach((crop) => {
        results.push({ type: 'crop', value: crop });
      });

    // Tech matches
    const techMatches = new Set<string>();
    companies.forEach((c) => {
      if (c.tech.toLowerCase().includes(searchLower)) {
        techMatches.add(c.tech);
      }
    });
    Array.from(techMatches)
      .slice(0, 3)
      .forEach((tech) => {
        results.push({ type: 'tech', value: tech });
      });

    return results.slice(0, 10);
  }, [value, companies]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setIsOpen(true);
      setSelectedIndex(-1);
    },
    []
  );

  const handleClear = useCallback(() => {
    setValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      onSelect(suggestion.value, suggestion.type);
      setValue('');
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, handleSelect]
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[selectedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'company':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'crop':
        return <Sprout className="w-4 h-4 text-green-500" />;
      case 'tech':
        return <Cpu className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Quick search: type company, crop, or technology..."
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Quick search"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {value && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.value}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(suggestion)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-amber-50 dark:bg-amber-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {getIcon(suggestion.type)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {suggestion.value}
                </p>
                {suggestion.type === 'company' && suggestion.company && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.company.product} - {suggestion.company.country}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                {suggestion.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchAutocomplete;
