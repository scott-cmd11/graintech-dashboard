import React, { memo, useCallback } from 'react';
import {
  PieChart,
  Database,
  BrainCircuit,
  Scale,
  History,
  TrendingUp,
  Newspaper,
  Globe,
  Calendar,
  Wand2,
  Github,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import type { TabId, TabConfig } from '../types';

interface TabGroup {
  title: string;
  tabs: TabConfig[];
}

const groupedTabs: TabGroup[] = [
  {
    title: 'Overview',
    tabs: [
      { id: 'about', label: 'About', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Market Intelligence',
    tabs: [
      { id: 'ai-landscape', label: 'Landscape', icon: <Globe className="w-4 h-4" /> },
      { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
      { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Analysis',
    tabs: [
      { id: 'insights', label: 'Analytics', icon: <PieChart className="w-4 h-4" /> },
      { id: 'scenarios', label: 'Scenarios', icon: <Wand2 className="w-4 h-4" /> },
      { id: 'regulations', label: 'Regulations', icon: <Scale className="w-4 h-4" /> },
      { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Reference & Data',
    tabs: [
      { id: 'research', label: 'AI Progress', icon: <BrainCircuit className="w-4 h-4" /> },
      { id: 'research-papers', label: 'Research Papers', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
      { id: 'github-repos', label: 'Github Repos', icon: <Github className="w-4 h-4" /> },
      { id: 'glossary', label: 'Glossary', icon: <HelpCircle className="w-4 h-4" /> },
    ],
  },
];

// Flattened list for keyboard navigation
const allTabs = groupedTabs.flatMap(group => group.tabs);

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const TabNav = memo(function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % allTabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = allTabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      onTabChange(allTabs[newIndex].id);
    },
    [onTabChange]
  );

  return (
    <nav
      className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl lg:sticky lg:top-24 z-30 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar"
      aria-label="Main navigation"
    >
      <div
        className="flex gap-1 p-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible"
        role="tablist"
        aria-label="Dashboard sections"
      >
        {groupedTabs.map((group, groupIndex) => (
          <div key={group.title} className="flex lg:flex-col shrink-0 gap-1 lg:gap-0 lg:mb-4 last:mb-0">
            <h3 className="hidden lg:block px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {group.title}
            </h3>
            {group.tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const globalIndex = allTabs.findIndex(t => t.id === tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, globalIndex)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 lg:justify-start lg:w-full ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
            {/* Visual separator for mobile only */}
            {groupIndex < groupedTabs.length - 1 && (
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2 self-center lg:hidden" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
});

export default TabNav;
