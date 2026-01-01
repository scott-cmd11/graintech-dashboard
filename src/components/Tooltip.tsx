import { useState, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  term: string;
  definition: string;
  children?: ReactNode;
}

/**
 * Tooltip component for explaining technical terms
 * Shows a definition on hover or when focused (keyboard accessible)
 * Uses plain language definitions at 8th-grade reading level
 */
export function Tooltip({ term, definition, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className="inline-flex items-center gap-4 cursor-help border-b border-dotted border-gray-400 dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-300 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-label={`${term}: ${definition}`}
      >
        {children || term}
        <HelpCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-hidden="true" />
      </span>

      {/* Tooltip popup */}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-12 px-16 py-12 bg-gray-900 dark:bg-gray-700 text-white text-body-sm rounded-lg shadow-lg z-50 max-w-xs whitespace-normal">
          <div className="font-bold block mb-6 text-base">{term}</div>
          <p className="text-gray-100 dark:text-gray-200">{definition}</p>
          {/* Tooltip pointer arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </span>
  );
}
