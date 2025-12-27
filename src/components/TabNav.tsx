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
  Table2,
  Calendar,
  Wand2,
  Github,
} from 'lucide-react';
import type { TabId, TabConfig } from '../types';

const tabs: TabConfig[] = [
  { id: 'ai-landscape', label: 'Landscape', icon: <Globe className="w-4 h-4" /> },
  { id: 'comparison', label: 'Comparison', icon: <Table2 className="w-4 h-4" /> },
  { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
  { id: 'scenarios', label: 'Scenarios', icon: <Wand2 className="w-4 h-4" /> },
  { id: 'insights', label: 'Analytics', icon: <PieChart className="w-4 h-4" /> },
  { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
  { id: 'research', label: 'AI Progress', icon: <BrainCircuit className="w-4 h-4" /> },
  { id: 'regulations', label: 'Regulations', icon: <Scale className="w-4 h-4" /> },
  { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
  { id: 'github-repos', label: 'Resources', icon: <Github className="w-4 h-4" /> },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const TabNav = memo(function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      onTabChange(tabs[newIndex].id);
    },
    [onTabChange]
  );

  return (
    <nav
      className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl lg:sticky lg:top-24 z-30"
      aria-label="Main navigation"
    >
      <div
        className="flex gap-1 p-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible"
        role="tablist"
        aria-label="Dashboard sections"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 lg:justify-start lg:w-full ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

export default TabNav;
