import React, { memo, useCallback } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Heart,
  X,
} from 'lucide-react';
import type { FilterType, SortOption, SortDirection, ExportFormat } from '../types';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: FilterType;
  onFilterChange: (value: FilterType) => void;
  sortField: SortOption;
  sortDirection: SortDirection;
  onSortChange: (field: SortOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  onExport: (format: ExportFormat) => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'All', label: 'All Types' },
  { value: 'Benchtop', label: 'Benchtop' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Handheld Light Sensor', label: 'Handheld NIR' },
  { value: 'In-line', label: 'In-line/Industrial' },
  { value: 'Software', label: 'Software' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'country', label: 'Country' },
  { value: 'type', label: 'Type' },
  { value: 'funding', label: 'Funding' },
];

export const SearchFilter = memo(function SearchFilter({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  onExport,
}: SearchFilterProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange(e.target.value as FilterType);
    },
    [onFilterChange]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value as SortOption);
    },
    [onSortChange]
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full lg:flex-1 min-w-0 sm:min-w-64">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search companies, products, or crops..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search companies"
          className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <select
          value={filterType}
          onChange={handleFilterChange}
          aria-label="Filter by type"
          className="w-full sm:w-auto px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <ArrowUpDown className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <select
          value={sortField}
          onChange={handleSortChange}
          aria-label="Sort by"
          className="w-full sm:w-auto px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} {sortField === option.value && (sortDirection === 'asc' ? '↑' : '↓')}
            </option>
          ))}
        </select>
      </div>

      {/* Favorites Toggle */}
      <button
        onClick={onToggleFavorites}
        aria-label={showFavoritesOnly ? 'Show all companies' : 'Show favorites only'}
        aria-pressed={showFavoritesOnly}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto ${
          showFavoritesOnly
            ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">
          Favorites {favoritesCount > 0 && `(${favoritesCount})`}
        </span>
      </button>

      {/* Export Dropdown */}
      <div className="relative group w-full sm:w-auto">
        <button
          aria-label="Export data"
          aria-haspopup="true"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-10">
          <button
            onClick={() => onExport('csv')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
          >
            Export CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
});

export default SearchFilter;
