import React, { memo, useCallback } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Dataset } from '../types';

interface DatasetCardProps {
  dataset: Dataset;
  isExpanded: boolean;
  onToggle: () => void;
}

export const DatasetCard = memo(function DatasetCard({
  dataset,
  isExpanded,
  onToggle,
}: DatasetCardProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header - Clickable */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${dataset.name} - ${isExpanded ? 'collapse' : 'expand'} details`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{dataset.name}</h3>
              {dataset.year && (
                <span className="text-xs bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-700">
                  {dataset.year}
                </span>
              )}
              {dataset.license && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-700">
                  {dataset.license}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dataset.description}</p>
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              {dataset.images && (
                <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                  {dataset.images} images
                </span>
              )}
              {dataset.annotations && (
                <span className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {dataset.annotations}
                </span>
              )}
              {dataset.crops.length > 0 && (
                <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                  {dataset.crops.join(', ')}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full" aria-hidden="true">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                Source
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{dataset.source}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                Format
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{dataset.format}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-semibold">
                Tasks
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Dataset tasks">
                {dataset.tasks.map((task, j) => (
                  <span
                    key={j}
                    role="listitem"
                    className="text-xs bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-400 px-2 py-1 rounded shadow-sm"
                  >
                    {task}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">
                Challenges
              </p>
              {dataset.challenges && (
                <p className="text-sm text-gray-900 dark:text-gray-100">{dataset.challenges}</p>
              )}
            </div>
          </div>
          {dataset.details && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              {dataset.details}
            </p>
          )}
          <a
            href={`https://${dataset.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Access Dataset at {dataset.url}
          </a>
        </div>
      )}
    </div>
  );
});

export default DatasetCard;
