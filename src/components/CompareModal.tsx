import React, { memo, useEffect, useCallback, useRef } from 'react';
import { X, ExternalLink, Zap, Check, Minus } from 'lucide-react';
import type { Company } from '../types';

interface CompareModalProps {
  companies: Company[];
  onClose: () => void;
  onRemove: (companyId: number) => void;
}

interface ComparisonRow {
  label: string;
  key: keyof Company | 'crops';
  render?: (value: unknown, company: Company) => React.ReactNode;
}

const comparisonRows: ComparisonRow[] = [
  { label: 'Product', key: 'product' },
  { label: 'Country', key: 'country' },
  { label: 'Type', key: 'type' },
  { label: 'Technology', key: 'tech' },
  { label: 'Speed', key: 'speed' },
  { label: 'Funding', key: 'funding' },
  {
    label: 'Crops',
    key: 'crops',
    render: (value) => {
      const crops = value as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {crops.map((crop, i) => (
            <span
              key={i}
              className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded"
            >
              {crop}
            </span>
          ))}
        </div>
      );
    },
  },
];

// Find common crops between all companies
function getCommonCrops(companies: Company[]): string[] {
  if (companies.length === 0) return [];

  const firstCrops = new Set(companies[0].crops);
  return companies[0].crops.filter((crop) =>
    companies.every((company) => company.crops.includes(crop))
  );
}

export const CompareModal = memo(function CompareModal({
  companies,
  onClose,
  onRemove,
}: CompareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const commonCrops = getCommonCrops(companies);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          <h2 id="compare-modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Compare Companies ({companies.length})
          </h2>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="text-left p-4 font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide w-32">
                  Attribute
                </th>
                {companies.map((company) => (
                  <th key={company.id} className="p-4 text-left min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                          {company.name}
                        </h3>
                        <a
                          href={`https://${company.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Website
                        </a>
                      </div>
                      <button
                        onClick={() => onRemove(company.id)}
                        aria-label={`Remove ${company.name} from comparison`}
                        className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr
                  key={row.key}
                  className={
                    index % 2 === 0
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50/50 dark:bg-gray-900/30'
                  }
                >
                  <td className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide align-top">
                    {row.label}
                  </td>
                  {companies.map((company) => (
                    <td key={company.id} className="p-4 text-gray-900 dark:text-gray-100 align-top">
                      {row.render ? (
                        row.render(company[row.key], company)
                      ) : row.key === 'tech' ? (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <Zap className="w-4 h-4" />
                          {String(company[row.key])}
                        </span>
                      ) : (
                        String(company[row.key])
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Description Row */}
              <tr className="bg-white dark:bg-gray-800">
                <td className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide align-top">
                  Description
                </td>
                {companies.map((company) => (
                  <td key={company.id} className="p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed align-top">
                    {company.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer - Common Features */}
        {commonCrops.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 shrink-0">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Common Crops Supported:
              <span className="font-normal">{commonCrops.join(', ')}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default CompareModal;
