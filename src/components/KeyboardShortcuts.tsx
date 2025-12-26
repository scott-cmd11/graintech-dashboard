import { memo, useEffect, useCallback, useState } from 'react';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
  onViewDetails: () => void;
  onFocusSearch: () => void;
  onToggleDarkMode: () => void;
}

interface ShortcutHelp {
  key: string;
  description: string;
}

const shortcuts: ShortcutHelp[] = [
  { key: 'J', description: 'Next company' },
  { key: 'K', description: 'Previous company' },
  { key: 'F', description: 'Toggle favorite' },
  { key: 'C', description: 'Toggle compare' },
  { key: 'Enter', description: 'View details' },
  { key: '/', description: 'Focus search' },
  { key: 'D', description: 'Toggle dark mode' },
  { key: '?', description: 'Show shortcuts' },
];

export const KeyboardShortcuts = memo(function KeyboardShortcuts({
  onNavigateNext,
  onNavigatePrev,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onFocusSearch,
  onToggleDarkMode,
}: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Handle shortcuts
      switch (e.key.toLowerCase()) {
        case 'j':
          e.preventDefault();
          onNavigateNext();
          break;
        case 'k':
          e.preventDefault();
          onNavigatePrev();
          break;
        case 'f':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onToggleFavorite();
          }
          break;
        case 'c':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onToggleCompare();
          }
          break;
        case 'enter':
          e.preventDefault();
          onViewDetails();
          break;
        case '/':
          e.preventDefault();
          onFocusSearch();
          break;
        case 'escape':
          if (showHelp) {
            setShowHelp(false);
          }
          break;
        case 'd':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onToggleDarkMode();
          }
          break;
        case '?':
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
      }
    },
    [onNavigateNext, onNavigatePrev, onToggleFavorite, onToggleCompare, onViewDetails, onFocusSearch, onToggleDarkMode, showHelp]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 left-6 z-40 p-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors no-print"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <Keyboard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h2>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono font-bold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> or click outside to close
        </p>
      </div>
    </div>
  );
});

export default KeyboardShortcuts;
