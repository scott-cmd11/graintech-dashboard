import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Cpu,
  Sun,
  Moon,
  Globe,
  ExternalLink,
  TrendingUp,
  GitCompare,
  Database,
  BrainCircuit,
  Gavel,
  BookOpen,
  ScrollText,
  Network,
  Sprout,
  Printer,
} from 'lucide-react';

// Types
import type { TabId, FilterType, SortOption, SortDirection, Company, ExportFormat } from './types';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePagination } from './hooks/usePagination';
import { useUrlState } from './hooks/useUrlState';

// Data
import {
  companiesData,
  datasetsData,
  techCategories,
  historyData,
  globalGradingPhilosophies,
  aiResearchData,
  regulatoryData,
  marketStats,
} from './data';

// Components
import {
  SimpleHorizontalBarChart,
  SimpleDonutChart,
  TabNav,
  CompanyCard,
  Modal,
  DatasetCard,
  SearchFilter,
  CompareModal,
  Pagination,
  WorldMap,
  AdvancedFilters,
  KeyboardShortcuts,
  FundingTimeline,
  TechnologyRadar,
  NewsFeed,
  ShareButton,
} from './components';

// Utils
import { exportCompanies, exportFavorites } from './utils/export';

// Header Component
function Header() {
  const { toggleTheme, isDark } = useTheme();
  const { getShareableUrl } = useUrlState();

  return (
    <header className="bg-gradient-to-r from-amber-600 to-green-700 dark:from-amber-800 dark:to-green-900 text-white py-10 px-6 shadow-lg no-print">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-10 h-10 text-amber-200" aria-hidden="true" />
              <h1 className="text-3xl font-bold tracking-tight">GrainTech Intelligence</h1>
            </div>
            <p className="text-amber-100 text-lg max-w-xl">
              The Digital Transformation of Grain Quality Assessment
            </p>
            <div className="flex gap-4 mt-4 text-xs font-medium uppercase tracking-wider text-amber-200/80">
              <span>{companiesData.length} Companies</span>
              <span>•</span>
              <span>{datasetsData.length} Datasets</span>
              <span>•</span>
              <span>Global Scope</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            {/* Share Button */}
            <ShareButton url={getShareableUrl({})} title="GrainTech Intelligence Dashboard" />

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Market Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              {marketStats.length > 0 ? (
                marketStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-white font-bold text-lg md:text-xl">{stat.value}</p>
                    <p className="text-amber-200 text-[10px] md:text-xs uppercase">{stat.label}</p>
                    <p className="text-green-300 text-xs font-bold">{stat.growth}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-xs text-amber-100/80">
                  Verified market stats pending sources.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="print-header print-only">
        <h1>GrainTech Intelligence Dashboard</h1>
        <p>Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </header>
  );
}

// Main Dashboard Component
function Dashboard() {
  const { toggleTheme } = useTheme();
  const { getStateFromUrl, setUrlState } = useUrlState();

  // Initialize state from URL
  const urlState = getStateFromUrl();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabId>((urlState.tab as TabId) || 'landscape');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState(urlState.search || '');
  const [filterType, setFilterType] = useState<FilterType>((urlState.type as FilterType) || 'All');
  const [sortField, setSortField] = useState<SortOption>((urlState.sort as SortOption) || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Advanced Filters
  const [advancedFilters, setAdvancedFilters] = useState({
    crops: [] as string[],
    countries: [] as string[],
    types: [] as string[],
  });

  // Selection State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [expandedDataset, setExpandedDataset] = useState<number | null>(null);

  // Favorites (persisted)
  const [favorites, setFavorites] = useLocalStorage<number[]>('graintech-favorites', []);

  // Compare State
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Focused company for keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Update URL when state changes
  useEffect(() => {
    setUrlState({
      tab: activeTab,
      search: searchTerm,
      type: filterType,
      sort: sortField,
      company: selectedCompany?.id,
    });
  }, [activeTab, searchTerm, filterType, sortField, selectedCompany, setUrlState]);

  // Handle sort toggle
  const handleSortChange = useCallback(
    (field: SortOption) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField]
  );

  // Filtered and sorted companies
  const filteredCompanies = useMemo(() => {
    let result = companiesData.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.crops.some((crop) => crop.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        filterType === 'All' ||
        c.type === filterType ||
        (filterType === 'In-line' && c.type.includes('In-line')) ||
        (filterType === 'Mobile' && c.type.includes('Mobile'));

      const matchesFavorites = !showFavoritesOnly || favorites.includes(c.id);

      // Advanced filters
      const matchesCrops =
        advancedFilters.crops.length === 0 ||
        c.crops.some((crop) => advancedFilters.crops.includes(crop));
      const matchesCountries =
        advancedFilters.countries.length === 0 ||
        advancedFilters.countries.some((country) => c.country.includes(country));
      const matchesTypes =
        advancedFilters.types.length === 0 || advancedFilters.types.includes(c.type);

      return matchesSearch && matchesType && matchesFavorites && matchesCrops && matchesCountries && matchesTypes;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      return 0;
    });

    return result;
  }, [searchTerm, filterType, showFavoritesOnly, favorites, sortField, sortDirection, advancedFilters]);

  // Pagination
  const pagination = usePagination<Company>({
    totalItems: filteredCompanies.length,
    initialItemsPerPage: 9,
  });

  const paginatedCompanies = useMemo(
    () => pagination.paginateItems(filteredCompanies),
    [pagination, filteredCompanies]
  );

  // Handlers
  const handleToggleFavorite = useCallback(
    (companyId: number) => {
      setFavorites((prev) =>
        prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
      );
    },
    [setFavorites]
  );

  const handleToggleCompare = useCallback((companyId: number) => {
    setCompareIds((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
    );
  }, []);

  const handleRemoveFromCompare = useCallback((companyId: number) => {
    setCompareIds((prev) => prev.filter((id) => id !== companyId));
  }, []);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (showFavoritesOnly && favorites.length > 0) {
        exportFavorites(companiesData, favorites, format);
      } else {
        exportCompanies(filteredCompanies, format);
      }
    },
    [showFavoritesOnly, favorites, filteredCompanies]
  );

  const handleToggleDataset = useCallback((index: number) => {
    setExpandedDataset((prev) => (prev === index ? null : index));
  }, []);

  // Keyboard navigation handlers
  const handleNavigateNext = useCallback(() => {
    setFocusedIndex((prev) => Math.min(prev + 1, paginatedCompanies.length - 1));
  }, [paginatedCompanies.length]);

  const handleNavigatePrev = useCallback(() => {
    setFocusedIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleToggleFocusedFavorite = useCallback(() => {
    if (paginatedCompanies[focusedIndex]) {
      handleToggleFavorite(paginatedCompanies[focusedIndex].id);
    }
  }, [paginatedCompanies, focusedIndex, handleToggleFavorite]);

  const handleToggleFocusedCompare = useCallback(() => {
    if (paginatedCompanies[focusedIndex]) {
      handleToggleCompare(paginatedCompanies[focusedIndex].id);
    }
  }, [paginatedCompanies, focusedIndex, handleToggleCompare]);

  const handleViewFocusedDetails = useCallback(() => {
    if (paginatedCompanies[focusedIndex]) {
      setSelectedCompany(paginatedCompanies[focusedIndex]);
    }
  }, [paginatedCompanies, focusedIndex]);

  // Focus search
  const handleFocusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    searchInput?.focus();
  }, []);

  // Map country click handler
  const handleCountryClick = useCallback((country: string) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }));
  }, []);

  // Companies to compare
  const compareCompanies = useMemo(
    () => companiesData.filter((c) => compareIds.includes(c.id)),
    [compareIds]
  );

  // Chart data
  const techStats = useMemo(() => {
    const stats: Record<string, number> = {};
    companiesData.forEach((c) => {
      let type = 'Other';
      if (c.tech.includes('Camera')) type = 'Computer Vision';
      else if (c.tech.includes('NIR') || c.tech.includes('Light')) type = 'Spectroscopy';
      else if (c.tech.includes('App') || c.tech.includes('Phone')) type = 'Mobile AI';
      else if (c.tech.includes('Laser')) type = 'Laser/3D';
      stats[type] = (stats[type] || 0) + 1;
    });
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];
    return Object.entries(stats).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
  }, []);

  // Device type stats for bar chart
  const deviceTypeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    companiesData.forEach((c) => {
      const type = c.type || 'Other';
      stats[type] = (stats[type] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // Get filter options
  const allCrops = useMemo(() => {
    const crops = new Set<string>();
    companiesData.forEach((c) => c.crops.forEach((crop) => crops.add(crop)));
    return Array.from(crops).sort();
  }, []);

  const allCountries = useMemo(() => {
    const countries = new Set<string>();
    companiesData.forEach((c) => {
      if (!c.country) {
        return;
      }
      c.country.split('/').forEach((country) => countries.add(country.trim()));
    });
    return Array.from(countries).sort();
  }, []);

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    companiesData.forEach((c) => types.add(c.type));
    return Array.from(types).sort();
  }, []);

  return (
    <>
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        onToggleFavorite={handleToggleFocusedFavorite}
        onToggleCompare={handleToggleFocusedCompare}
        onViewDetails={handleViewFocusedDetails}
        onFocusSearch={handleFocusSearch}
        onToggleDarkMode={toggleTheme}
      />

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
        {/* Companies Tab */}
        {activeTab === 'landscape' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterChange={setFilterType}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly((p) => !p)}
              favoritesCount={favorites.length}
              onExport={handleExport}
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              crops={allCrops}
              countries={allCountries}
              types={allTypes}
              selectedCrops={advancedFilters.crops}
              selectedCountries={advancedFilters.countries}
              selectedTypes={advancedFilters.types}
              onCropsChange={(crops) => setAdvancedFilters((p) => ({ ...p, crops }))}
              onCountriesChange={(countries) => setAdvancedFilters((p) => ({ ...p, countries }))}
              onTypesChange={(types) => setAdvancedFilters((p) => ({ ...p, types }))}
              onReset={() => setAdvancedFilters({ crops: [], countries: [], types: [] })}
            />

            {/* Compare Bar */}
            {compareIds.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-800 dark:text-blue-200 font-medium">
                    {compareIds.length} companies selected for comparison
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCompare(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Compare Now
                  </button>
                  <button
                    onClick={() => setCompareIds([])}
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* World Map */}
            <WorldMap
              companies={companiesData}
              onCountryClick={handleCountryClick}
              selectedCountries={advancedFilters.countries}
            />

            {/* Tech Categories */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {techCategories.map((cat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-colors"
                >
                  <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400 mb-2">
                    <div className="shrink-0 p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                      {cat.icon}
                    </div>
                    <span className="font-semibold text-sm leading-tight break-words pt-1">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>

            {/* Company Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isFavorite={favorites.includes(company.id)}
                  isSelected={compareIds.includes(company.id)}
                  onSelect={setSelectedCompany}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  compareCount={compareIds.length}
                />
              ))}
            </div>

            {paginatedCompanies.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No companies found matching your criteria.
              </div>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageNumbers={pagination.pageNumbers}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={filteredCompanies.length}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              onPageChange={pagination.setCurrentPage}
              onItemsPerPageChange={pagination.setItemsPerPage}
              onNextPage={pagination.goToNextPage}
              onPrevPage={pagination.goToPrevPage}
              onFirstPage={pagination.goToFirstPage}
              onLastPage={pagination.goToLastPage}
            />

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
              {filteredCompanies.length < companiesData.length && ` (filtered from ${companiesData.length})`}
            </p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards at top */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Cpu className="w-16 h-16" />
                </div>
                <h3 className="text-amber-100 font-medium text-xs uppercase tracking-wider mb-1">Companies</h3>
                <p className="text-3xl font-bold">{companiesData.length}</p>
                <p className="text-xs text-amber-100 mt-1">Tracked globally</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Globe className="w-16 h-16" />
                </div>
                <h3 className="text-blue-100 font-medium text-xs uppercase tracking-wider mb-1">Countries</h3>
                <p className="text-3xl font-bold">{allCountries.length}</p>
                <p className="text-xs text-blue-100 mt-1">Active markets</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sprout className="w-16 h-16" />
                </div>
                <h3 className="text-green-100 font-medium text-xs uppercase tracking-wider mb-1">Crop Types</h3>
                <p className="text-3xl font-bold">{allCrops.length}</p>
                <p className="text-xs text-green-100 mt-1">Supported</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <BrainCircuit className="w-16 h-16" />
                </div>
                <h3 className="text-purple-100 font-medium text-xs uppercase tracking-wider mb-1">Device Types</h3>
                <p className="text-3xl font-bold">{allTypes.length}</p>
                <p className="text-xs text-purple-100 mt-1">Categories</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 text-center">
                  Technology Breakdown
                </h3>
                <SimpleDonutChart data={techStats} />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Computer Vision leads, followed by Spectroscopy solutions
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-center">
                  Device Types Distribution
                </h3>
                <SimpleHorizontalBarChart data={deviceTypeStats} color="bg-blue-500" />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Benchtop and Mobile solutions dominate the market
                </p>
              </div>
            </div>

            {/* Technology Radar & Funding Timeline */}
            <div className="grid lg:grid-cols-2 gap-6">
              <TechnologyRadar companies={companiesData} />
              <FundingTimeline companies={companiesData} />
            </div>

            {/* News Feed */}
            <NewsFeed />

            {/* Top Crops Covered */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                Top Crops Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {allCrops.slice(0, 15).map((crop) => {
                  const count = companiesData.filter((c) => c.crops.includes(crop)).length;
                  return (
                    <div
                      key={crop}
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">{crop}</span>
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === 'datasets' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Open Research Datasets</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Curated collection of publicly available datasets for training grain quality AI models
              </p>
            </div>

            <div className="space-y-4">
              {datasetsData.length > 0 ? (
                datasetsData.map((dataset, i) => (
                  <DatasetCard
                    key={i}
                    dataset={dataset}
                    isExpanded={expandedDataset === i}
                    onToggle={() => handleToggleDataset(i)}
                  />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No verified datasets available yet. Add citations to populate this section.
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Research Tab */}
        {activeTab === 'research' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    AI in Grain Metrology: 2024-2025 Review
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    State-of-the-art developments in Deep Learning and Computer Vision for agriculture
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">
                {aiResearchData.algorithms.length > 0 ? (
                  aiResearchData.algorithms.map((algo, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                          {algo.icon}
                        </div>
                        <a
                          href={algo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          title="Read Paper"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{algo.name}</h3>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-2">
                        {algo.role}
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{algo.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400">
                    No verified AI research entries yet. Add citations to populate this section.
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Crop-Specific Breakthroughs
                </h3>
                <div className="space-y-4">
                  {aiResearchData.cropDeepDives.length > 0 ? (
                    aiResearchData.cropDeepDives.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{item.crop}</span>
                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                              {item.focus}
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="block text-lg font-bold text-blue-600 dark:text-blue-400">
                            {item.accuracy}
                          </span>
                          <span className="text-xs text-gray-400">Accuracy</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      No verified crop deep-dives yet. Add citations to populate this section.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-indigo-400" />
                    Emerging Horizons
                  </h3>
                  <div className="space-y-3">
                    {aiResearchData.futureTrends.length > 0 ? (
                      aiResearchData.futureTrends.map((trend, i) => (
                        <div
                          key={i}
                          className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors"
                        >
                          <h4 className="font-bold text-indigo-200 mb-1 text-sm">{trend.title}</h4>
                          <p className="text-xs text-indigo-50 leading-relaxed">{trend.desc}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-indigo-100/80 text-center">
                        No verified trend notes yet. Add citations to populate this section.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-100 dark:border-orange-800">
                  <h3 className="text-lg font-bold text-orange-900 dark:text-orange-200 mb-2">Why it matters?</h3>
                  <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                    We are moving from "feature engineering" (humans defining rules) to "feature learning" (AI
                    discovering patterns). This enables the shift to <strong>Digital Grain</strong>, where every kernel
                    is profiled in real-time, enabling true Identity Preservation at industrial scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regulations Tab */}
        {activeTab === 'regulations' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-8 h-8 text-blue-700 dark:text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    The Digitization of Regulation
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    How governments are rewriting laws to accommodate AI and digital grading.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The global regulatory landscape is shifting from rigid visual inspection to automated, science-based
                verification. Canada and the US are modernizing statutory frameworks, while South America utilizes
                executive decrees for rapid digital fiscalization.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {regulatoryData.regions.map((region, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:border-blue-100 dark:group-hover:border-blue-800 transition-colors">
                        {region.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{region.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                          {region.agency}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                      {region.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Key Legislation</p>
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{region.legislation}</p>
                        <a
                          href={region.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 shrink-0 mt-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-900 dark:text-blue-200">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1 uppercase tracking-wide">
                        Major Shift
                      </p>
                      <p className="text-sm">{region.keyChange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Primary Driver</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{region.driver}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Gavel className="w-64 h-64" />
              </div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-gray-400" />
                The "Black Box" Liability Challenge
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-3xl relative z-10">
                A major hurdle for regulators is the "Black Box" problem: If an AI makes a grading decision that results
                in a financial loss, who is liable? Unlike a human inspector who follows a public visual guide, AI uses
                proprietary algorithms.
              </p>
              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                    The US Solution
                  </span>
                  <span className="text-sm font-medium text-gray-200">
                    Strict "Inspection Technology Evaluation" (ITE) requiring re-certification if algorithms change.
                  </span>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                    The Australian Solution
                  </span>
                  <span className="text-sm font-medium text-gray-200">
                    Industry stewardship framework establishing principles for data ownership and algorithmic
                    transparency.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <ScrollText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">The Architecture of Trust</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    A Global History of Grain Grading & Standardization
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The history of grain grading is the history of civilization attempting to impose order on nature. What
                began as simple visual inspection in ancient markets has evolved into a complex global system of
                chemical analysis and artificial intelligence. The goal remains the same: translating a biological
                product into an economic asset.
              </p>
            </div>

            <div className="relative pl-4 md:pl-0">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
              <div className="space-y-8">
                {historyData.map((era, i) => (
                  <div key={i} className="relative flex flex-col md:flex-row gap-6 items-start group">
                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-amber-100 dark:border-amber-800 shadow-sm z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <div className="text-amber-600 dark:text-amber-400">{era.icon}</div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                          {era.era}
                        </span>
                        <div className="md:hidden text-amber-600 dark:text-amber-400 mb-2">{era.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{era.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{era.desc}</p>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 inline-block border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase block mb-1">
                          Primary Metric
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{era.metric}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white mt-12 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-amber-400" />
                Global Grading Philosophies
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalGradingPhilosophies.map((philosophy, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="font-bold text-lg text-amber-400 mb-1">{philosophy.region}</h4>
                    <p className="text-sm font-medium text-slate-200 mb-3">{philosophy.philosophy}</p>
                    <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                      <div>
                        <span className="block text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                          Key Metric
                        </span>
                        {philosophy.metric}
                      </div>
                      <div>
                        <span className="block text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                          Authority
                        </span>
                        {philosophy.authority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Market Trends & Outlook</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">European Vanguard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Lab-grade automation led by FOSS, Cgrain, Videometer, and Zeutec continues to set precision benchmarks.
                </p>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> High Precision
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">
                  Edge Grading
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Smartphone and portable tools push grading to farm gates and receival points.
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> Rapid Adoption
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">
                  Sovereign Grading
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Exporting regions invest in domestic grading tech to protect varietal integrity.
                </p>
                <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> Strategic Priority
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">Data</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Dataset Infrastructure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Large-scale datasets such as GrainSpace, GrainSet, and GWHD are foundational to model accuracy.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">Ops</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Automation in Bulk Handling</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated inspection lines and inline sorting are expanding in major storage and export hubs.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedCompany && (
        <Modal
          company={selectedCompany}
          isFavorite={favorites.includes(selectedCompany.id)}
          onClose={() => setSelectedCompany(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {showCompare && compareCompanies.length > 0 && (
        <CompareModal
          companies={compareCompanies}
          onClose={() => setShowCompare(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}
    </>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 py-6 mt-12 no-print">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm">
        <p>GrainTech Intelligence Report - Research compiled December 2025</p>
        <p className="text-gray-500 mt-1">
          Data sourced from the citations listed in the dataset
        </p>
        <p className="text-gray-500 mt-1">
          {companiesData.length} Companies - {datasetsData.length} Datasets Tracked
        </p>
        <p className="text-gray-500 mt-2 text-xs">
          Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">?</kbd> for keyboard shortcuts
        </p>
      </div>
    </footer>
  );
}

// Main App with Providers
export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative font-sans transition-colors duration-300">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
