import React, { memo, useEffect, useCallback, useRef } from 'react';
import { X, ExternalLink, Zap, Heart } from 'lucide-react';
import type { Company } from '../types';

interface ModalProps {
  company: Company;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (companyId: number) => void;
}

export const Modal = memo(function Modal({
  company,
  isFavorite,
  onClose,
  onToggleFavorite,
}: ModalProps) {
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

    // Focus the modal
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

  const handleFavoriteClick = useCallback(() => {
    onToggleFavorite(company.id);
  }, [company.id, onToggleFavorite]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 id="modal-title" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {company.name}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">{company.product}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isFavorite
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
                Location
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{company.country}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
                Type
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{company.type}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
                Speed
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{company.speed}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
                Funding
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{company.funding}</p>
            </div>
          </div>

          {/* Technology */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">
              Technology
            </p>
            <p className="font-medium text-amber-700 dark:text-amber-400 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" aria-hidden="true" />
              {company.tech}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase">
              Description
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{company.description}</p>
          </div>

          {/* Crops */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase">
              Supported Crops
            </p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Supported crops">
              {company.crops.map((crop, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <a
              href={`https://${company.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Modal;
