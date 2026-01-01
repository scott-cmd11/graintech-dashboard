import { useState, useMemo, useCallback, useEffect } from 'react';

// Types
import type { TabId } from './types';

// Context
import { ThemeProvider } from './context/ThemeContext';

// Hooks
import { useUrlState } from './hooks/useUrlState';

// Data
import {
  companiesData,
} from './data';

// Components
import { Header, Sidebar } from './components/layout';
import {
  LandscapeTab,
  AnalyticsTab,
  ResearchTab,
  RegulationsTab,
  HistoryTab,
  DatasetsTab,
  TimelineTab,
  ScenariosTab,
  AboutTab,
  GlossaryTab,
  TrendsPage,
  NewsTab,
  GithubTab,
  ResearchPapersTab
} from './components/tabs';

// Main Dashboard Component
function Dashboard() {
  const { getStateFromUrl, setUrlState } = useUrlState();

  // Initialize state from URL
  const urlState = getStateFromUrl();

  // Global State
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (urlState.tab === 'landscape' || urlState.tab === 'tech-stack') {
      return 'ai-landscape';
    }
    return (urlState.tab as TabId) || 'about';
  });
  const [searchTerm, setSearchTerm] = useState(urlState.search || '');
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [companiesOpen, setCompaniesOpen] = useState(() => urlState.companiesOpen !== false);
  const [expandedDataset, setExpandedDataset] = useState<number | null>(null);

  // Update URL when state changes
  useEffect(() => {
    setUrlState({
      tab: activeTab,
      companiesOpen,
      search: searchTerm,
    });
  }, [activeTab, setUrlState, companiesOpen, searchTerm]);

  // Scroll to top when tab changes
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [activeTab]);

  const handleToggleDataset = useCallback((index: number) => {
    setExpandedDataset((prev) => (prev === index ? null : index));
  }, []);

  // Shared Stats (memoized for child tabs)
  const stats = useMemo(() => {
    const crops = new Set<string>();
    companiesData.forEach((c) => {
      if (c.crops) c.crops.forEach((crop) => crops.add(crop));
    });

    const countries = new Set<string>();
    companiesData.forEach((c) => {
      if (c.country) {
        c.country.split('/').forEach((country) => countries.add(country.trim()));
      }
    });

    const types = new Set<string>();
    companiesData.forEach((c) => types.add(c.type));

    return {
      allCrops: Array.from(crops).sort(),
      allCountries: Array.from(countries).sort(),
      allTypes: Array.from(types).sort(),
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors flex flex-col">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 pb-24 border-l border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'about' && <AboutTab onNavigate={setActiveTab} />}
            {activeTab === 'glossary' && <GlossaryTab searchTerm={searchTerm} />}
            {activeTab === 'trends' && <TrendsPage />}

            {activeTab === 'ai-landscape' && (
              <LandscapeTab
                companiesOpen={companiesOpen}
                onCompaniesToggle={() => setCompaniesOpen(prev => !prev)}
                searchTerm={searchTerm}
              />
            )}

            {activeTab === 'insights' && (
              <AnalyticsTab
                allCountries={stats.allCountries}
                allCrops={stats.allCrops}
                allTypes={stats.allTypes}
                searchTerm={searchTerm}
              />
            )}

            {activeTab === 'timeline' && <TimelineTab />}
            {activeTab === 'scenarios' && <ScenariosTab />}
            {activeTab === 'datasets' && (
              <DatasetsTab
                expandedDataset={expandedDataset}
                onToggleDataset={handleToggleDataset}
                searchTerm={searchTerm}
              />
            )}
            {activeTab === 'research' && <ResearchTab />}
            {activeTab === 'regulations' && <RegulationsTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'news' && <NewsTab />}
            {activeTab === 'github-repos' && <GithubTab />}
            {activeTab === 'research-papers' && <ResearchPapersTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
