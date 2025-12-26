import React, { memo, useCallback } from 'react';
import {
  Building2,
  PieChart,
  Database,
  BrainCircuit,
  Scale,
  History,
  TrendingUp,
} from 'lucide-react';
import type { TabId, TabConfig } from '../types';

const tabs: TabConfig[] = [
  { id: 'landscape', label: 'Companies', icon: <Building2 className="w-4 h-4" /> },
  { id: 'insights', label: 'Analytics', icon: <PieChart className="w-4 h-4" /> },
  { id: 'datasets', label: 'Datasets', icon: <Database className="w-4 h-4" /> },
  { id: 'research', label: 'AI Progress', icon: <BrainCircuit className="w-4 h-4" /> },
  { id: 'regulations', label: 'Regulations', icon: <Scale className="w-4 h-4" /> },
  { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
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
      className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700"
      aria-label="Main navigation"
    >
      <div
        className="max-w-6xl mx-auto flex gap-1 p-2 overflow-x-auto"
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
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
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
