import { Cpu, Sun, Moon, Printer, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUrlState } from '../../hooks/useUrlState';
import { ShareButton } from '../ShareButton';
import { companiesData, datasetsData } from '../../data';

interface HeaderProps {
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

export function Header({ onSearchChange, searchTerm }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const { getShareableUrl } = useUrlState();

  return (
    <header className="brand-hero text-white py-8 sm:py-10 px-4 sm:px-6 shadow-lg no-print">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-10 h-10 text-blue-200" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight display-font">GrainTech Intelligence</h1>
            </div>
            <p className="text-blue-100 text-sm sm:text-lg max-w-xl">
              How grain quality checks are going digital
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-blue-200/80">
              <span>{companiesData.length} Companies</span>
              <span>|</span>
              <span>{datasetsData.length} Datasets</span>
              <span>|</span>
              <span>Global</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch lg:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Global Search */}
            <div className="relative flex-1 sm:min-w-[240px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/60">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search across dashboard..."
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                aria-label="Search"
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Share Button */}
              <ShareButton url={getShareableUrl({})} title="GrainTech Intelligence Dashboard" />

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors flex-1 sm:flex-none"
                title="Print"
              >
                <Printer className="w-4 h-4" />
                <span className="sm:inline">Print</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="print-header print-only">
        <h1>GrainTech Intelligence Dashboard</h1>
        <p>Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </header>
  );
}
