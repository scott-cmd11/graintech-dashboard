import React, { memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
}

const itemsPerPageOptions = [6, 9, 12, 18, 24];

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  pageNumbers,
  hasNextPage,
  hasPrevPage,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
}: PaginationProps) {
  const handleItemsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onItemsPerPageChange(Number(e.target.value));
    },
    [onItemsPerPageChange]
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Info */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{startIndex + 1}</span> to{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{endIndex}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-1" role="navigation" aria-label="Pagination">
        {/* First Page */}
        <button
          onClick={onFirstPage}
          disabled={!hasPrevPage}
          aria-label="Go to first page"
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            hasPrevPage
              ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          aria-label="Go to previous page"
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            hasPrevPage
              ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`px-3 py-1 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                currentPage === page
                  ? 'bg-amber-500 text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 text-sm rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Page */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          aria-label="Go to next page"
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            hasNextPage
              ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={onLastPage}
          disabled={!hasNextPage}
          aria-label="Go to last page"
          className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            hasNextPage
              ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Items Per Page */}
      <div className="flex items-center gap-2">
        <label htmlFor="items-per-page" className="text-sm text-gray-500 dark:text-gray-400">
          Per page:
        </label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

export default Pagination;
