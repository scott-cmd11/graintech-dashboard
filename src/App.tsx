import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Cpu,
  Sun,
  Moon,
  Globe,
  ExternalLink,
  TrendingUp,
  Database,
  BrainCircuit,
  Gavel,
  BookOpen,
  ScrollText,
  Network,
  Sprout,
  Printer,
  Filter,
} from 'lucide-react';

// Types
import type { TabId } from './types';
import type { FormFactor, Region, SensingTech, UseCase } from './data/grainTechEntities';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Hooks
import { useUrlState } from './hooks/useUrlState';

// Data
import {
  companiesData,
  datasetsData,
  historyData,
  globalGradingPhilosophies,
  aiResearchData,
  regulatoryData,
  grainSolutions,
  adoptionEvents,
} from './data';

// Components
import {
  SimpleHorizontalBarChart,
  SimpleDonutChart,
  TabNav,
  DatasetCard,
  FundingTimeline,
  TechnologyRadar,
  NewsFeed,
  ShareButton,
  GrainLandscapeMap,
  TechStackExplorer,
  GrainComparisonMatrix,
  GrainAdoptionTimeline,
  ScenarioExplorer,
  GitHubReposExplorer,
} from './components';

// Utils
// Header Component
function Header() {
  const { toggleTheme, isDark } = useTheme();
  const { getShareableUrl } = useUrlState();

  return (
    <header className="brand-hero text-white py-8 sm:py-10 px-4 sm:px-6 shadow-lg no-print">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-10 h-10 text-blue-200" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight display-font">GrainTech Intelligence</h1>
            </div>
            <p className="text-blue-100 text-sm sm:text-lg max-w-xl">
              How grain quality checks are going digital
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-blue-200/80">
              <span>{companiesData.length} Companies</span>
              <span>|</span>
              <span>{datasetsData.length} Datasets</span>
              <span>|</span>
              <span>Global</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Share Button */}
            <ShareButton url={getShareableUrl({})} title="GrainTech Intelligence Dashboard" />

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors w-full sm:w-auto"
              title="Print"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

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

// View Toggle Component
function ViewToggle({
  activeView,
  onViewChange
}: {
  activeView: 'map' | 'table' | 'stack';
  onViewChange: (view: 'map' | 'table' | 'stack') => void;
}) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
      {(['map', 'table', 'stack'] as const).map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeView === view
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {view === 'map' ? 'Map' : view === 'table' ? 'Table' : 'Tech Stack'}
        </button>
      ))}
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const { getStateFromUrl, setUrlState } = useUrlState();

  // Initialize state from URL
  const urlState = getStateFromUrl();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (urlState.tab === 'landscape' || urlState.tab === 'tech-stack') {
      return 'ai-landscape';
    }
    return (urlState.tab as TabId) || 'ai-landscape';
  });

  // Selection State
  const [expandedDataset, setExpandedDataset] = useState<number | null>(null);
  const [landscapeView, setLandscapeView] = useState<'map' | 'table' | 'stack'>(() => {
    if (urlState.tab === 'tech-stack') return 'stack';
    return 'map';
  });
  const [companiesOpen, setCompaniesOpen] = useState(() => urlState.companiesOpen !== false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [landscapeFilters, setLandscapeFilters] = useState({
    regions: [] as Region[],
    sensing: [] as SensingTech[],
    formFactors: [] as FormFactor[],
    useCases: [] as UseCase[],
  });

  // Update URL when state changes
  useEffect(() => {
    setUrlState({
      tab: activeTab,
      companiesOpen,
    });
  }, [activeTab, setUrlState, companiesOpen]);

  const handleToggleDataset = useCallback((index: number) => {
    setExpandedDataset((prev) => (prev === index ? null : index));
  }, []);

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
      <div className="flex gap-6 h-[calc(100vh-200px)] overflow-hidden">
        {/* Sidebar Navigation & Filters */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 lg:flex flex-col hidden`}>
          <div className="p-6 space-y-6">
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </aside>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Toggle sidebar"
        >
          <Filter className="w-6 h-6" />
        </button>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 pb-24">
          {activeTab === 'ai-landscape' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* View Toggle */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Grain Technology Landscape</h2>
                <ViewToggle activeView={landscapeView} onViewChange={setLandscapeView} />
              </div>

              {/* Map View */}
              {landscapeView === 'map' && (
                <div className="space-y-6">
                  <GrainLandscapeMap
                    grainSolutions={grainSolutions}
                    filters={landscapeFilters}
                    onFiltersChange={setLandscapeFilters}
                    showFilters={true}
                    companiesOpen={companiesOpen}
                    onCompaniesToggle={() => setCompaniesOpen((prev) => !prev)}
                  />
                </div>
              )}

              {/* Table View */}
              {landscapeView === 'table' && (
                <div className="space-y-6">
                  <GrainComparisonMatrix grainSolutions={grainSolutions} />
                </div>
              )}

              {/* Tech Stack View */}
              {landscapeView === 'stack' && (
                <div className="space-y-6">
                  <TechStackExplorer
                    grainSolutions={grainSolutions}
                    variant="standalone"
                    filters={{
                      regions: landscapeFilters.regions,
                      sensingTech: landscapeFilters.sensing,
                      formFactors: landscapeFilters.formFactors,
                      useCases: landscapeFilters.useCases,
                    }}
                    onFiltersChange={(next) =>
                      setLandscapeFilters((prev) => ({
                        ...prev,
                        regions: next.regions ?? prev.regions,
                        sensing: next.sensingTech,
                        formFactors: next.formFactors,
                        useCases: next.useCases,
                      }))
                    }
                    showSharedFilters={true}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <GrainAdoptionTimeline adoptionEvents={adoptionEvents} grainSolutions={grainSolutions} />
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <ScenarioExplorer />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Cards at top */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Cpu className="w-16 h-16" />
                </div>
                <h3 className="text-blue-100 font-medium text-xs uppercase tracking-wider mb-1">Companies</h3>
                <p className="text-3xl font-bold">{companiesData.length}</p>
                <p className="text-xs text-blue-100 mt-1">Tracked globally</p>
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
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <BrainCircuit className="w-16 h-16" />
                </div>
                <h3 className="text-teal-100 font-medium text-xs uppercase tracking-wider mb-1">Device Types</h3>
                <p className="text-3xl font-bold">{allTypes.length}</p>
                <p className="text-xs text-teal-100 mt-1">Categories</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 text-center">
                  Technology breakdown
                </h3>
                <SimpleDonutChart data={techStats} />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Computer vision leads, followed by spectroscopy.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 text-center">
                  Device type breakdown
                </h3>
                <SimpleHorizontalBarChart data={deviceTypeStats} color="bg-blue-500" />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Benchtop and mobile tools are most common.
                </p>
              </div>
            </div>

            {/* Technology Radar & Funding Timeline */}
            <div className="grid lg:grid-cols-2 gap-6">
              <TechnologyRadar companies={companiesData} />
              <FundingTimeline companies={companiesData} />
            </div>

            {/* Top crops */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                Top crops
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
                <Database className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Open datasets</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 section-lead">
                Public datasets for training grain quality models.
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
                  No verified datasets yet.
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
                  <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">
                    AI in grain grading: 2024-2025 review
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 section-lead">
                    Recent work in deep learning and computer vision for agriculture.
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
                          title="Read paper"
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
                    No verified AI research entries yet.
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Crop-specific results
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
                      No verified crop deep-dives yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-xl p-6 text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-indigo-400" />
                    What's next
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
                        No verified trend notes yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800">
                  <h3 className="text-lg font-bold text-teal-900 dark:text-teal-200 mb-2">Why it matters</h3>
                  <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
                    AI is moving from hand-built rules to models that learn patterns. This can track grain quality in real time and support identity preservation at scale.
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
                  <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">
                    How rules are changing
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 section-lead">
                    How governments are updating rules for AI and digital grading.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Rules are moving from visual checks to automated, science-based checks. Canada and the US are updating laws, while South America uses faster decrees to allow digital inspection.
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
                        Key change
                      </p>
                      <p className="text-sm">{region.keyChange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Main driver</p>
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
                Who is responsible for AI decisions?
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-3xl relative z-10">
                A key issue is responsibility. If AI makes a grading decision that causes a loss, who is accountable? Unlike a human inspector who follows a public visual guide, AI uses private algorithms.
              </p>
              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                    US approach
                  </span>
                  <span className="text-sm font-medium text-gray-200">
                    Strict "Inspection Technology Evaluation" (ITE) rules require re-certification when algorithms change.
                  </span>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <span className="block text-xs text-gray-400 uppercase tracking-wide mb-1 font-bold">
                    Australian approach
                  </span>
                  <span className="text-sm font-medium text-gray-200">
                    Industry framework sets rules for data ownership and algorithm transparency.
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
                <ScrollText className="w-8 h-8 text-blue-900 dark:text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100">How grading built trust</h2>
                  <p className="text-gray-600 dark:text-gray-400 section-lead">
                    A short history of grain grading and standards
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Grain grading has always tried to bring order to a natural product. It started with visual checks in markets and grew into lab tests and AI. The goal is the same: turn a biological product into a tradable asset.
              </p>
            </div>

            <div className="relative pl-4 md:pl-0">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
              <div className="space-y-8">
                {historyData.map((era, i) => (
                  <div key={i} className="relative flex flex-col md:flex-row gap-6 items-start group">
                    <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-800 shadow-sm z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <div className="text-blue-900 dark:text-blue-400">{era.icon}</div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-400 tracking-wider">
                          {era.era}
                        </span>
                        <div className="md:hidden text-blue-900 dark:text-blue-400 mb-2">{era.icon}</div>
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
                <Globe className="w-6 h-6 text-blue-400" />
                How grading works around the world
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalGradingPhilosophies.map((philosophy, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <h4 className="font-bold text-lg text-blue-400 mb-1">{philosophy.region}</h4>
                    <p className="text-sm font-medium text-slate-200 mb-3">{philosophy.philosophy}</p>
                    <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
                      <div>
                        <span className="block text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                          Key measure
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
            <h2 className="text-2xl font-bold section-title text-gray-900 dark:text-gray-100 mb-4">Market trends and outlook</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">Europe leads</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Lab systems from FOSS, Cgrain, Videometer, and Zeutec set the bar for accuracy.
                </p>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> High accuracy
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">
                  On-site grading
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Phones and portable tools bring grading to farm gates and receival points.
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> Fast adoption
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 relative z-10">
                  Local control
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  Exporting regions invest in local grading tech to protect variety purity.
                </p>
                <div className="mt-4 flex items-center text-teal-600 dark:text-teal-400 font-bold text-sm relative z-10">
                  <TrendingUp className="w-4 h-4 mr-1" /> Strategic focus
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">Data</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Training data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Large datasets like GrainSpace, GrainSet, and GWHD help models learn.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">Ops</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Automation in bulk handling</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated inspection lines and inline sorting are growing in major storage and export hubs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <NewsFeed />
          </div>
        )}

        {/* GitHub Repos Tab */}
        {activeTab === 'github-repos' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <GitHubReposExplorer />
          </div>
        )}
        </main>
      </div>

    </>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 py-6 mt-12 no-print">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm">
        <p>GrainTech Intelligence Report - Research compiled in December 2025</p>
        <p className="text-gray-500 mt-1">
          Data comes from the citations listed in the dataset
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
      <div className="min-h-screen app-shell transition-colors duration-300">
        <Header />
        <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium">
            Disclaimer: AI-generated content. Unofficial and for developmental use only.
          </div>
        </div>
        <Dashboard />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
