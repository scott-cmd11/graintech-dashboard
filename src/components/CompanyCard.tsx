import React, { memo, useCallback } from 'react';
import { Globe, Zap, Heart, GitCompare } from 'lucide-react';
import type { Company } from '../types';
import { typeColors } from '../data';

interface CompanyCardProps {
  company: Company;
  isFavorite: boolean;
  isSelected: boolean;
  onSelect: (company: Company) => void;
  onToggleFavorite: (companyId: number) => void;
  onToggleCompare: (companyId: number) => void;
  compareCount: number;
  maxCompare?: number;
}

export const CompanyCard = memo(function CompanyCard({
  company,
  isFavorite,
  isSelected,
  onSelect,
  onToggleFavorite,
  onToggleCompare,
  compareCount,
  maxCompare = 3,
}: CompanyCardProps) {
  const handleCardClick = useCallback(() => {
    onSelect(company);
  }, [company, onSelect]);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(company.id);
    },
    [company.id, onToggleFavorite]
  );

  const handleCompareClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isSelected && compareCount >= maxCompare) {
        return; // Don't allow more than max
      }
      onToggleCompare(company.id);
    },
    [company.id, isSelected, compareCount, maxCompare, onToggleCompare]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(company);
      }
    },
    [company, onSelect]
  );

  const colorClass = typeColors[company.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${company.name}`}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-300 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500 shadow-lg'
          : 'border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base sm:text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{company.product}</p>
          </div>
          <span
            className={`text-[10px] px-2 py-1 rounded-full shrink-0 whitespace-nowrap font-medium uppercase tracking-wide ${colorClass}`}
          >
            {company.type}
          </span>
        </div>

        {/* Location */}
        {company.country && (
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-3">
            <Globe className="w-3 h-3" aria-hidden="true" />
            <span>{company.country}</span>
          </div>
        )}

        {/* Crops */}
        {company.crops.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label="Supported crops">
            {company.crops.slice(0, 3).map((crop, i) => (
              <span
                key={i}
                role="listitem"
                className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-100 dark:border-green-800"
              >
                {crop}
              </span>
            ))}
            {company.crops.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                +{company.crops.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Tech & Actions */}
        <div className="pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
          <p className="text-[11px] sm:text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" aria-hidden="true" />
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{company.tech}</span>
          </p>

          <div className="flex items-center gap-1">
            {/* Compare Button */}
            <button
              onClick={handleCompareClick}
              disabled={!isSelected && compareCount >= maxCompare}
              aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
              aria-pressed={isSelected}
              className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isSelected
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : compareCount >= maxCompare
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
              className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isFavorite
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CompanyCard;
