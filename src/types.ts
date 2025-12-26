// Company Types
export interface Company {
  id: number;
  name: string;
  product: string;
  country: string;
  type: CompanyType;
  tech: string;
  description: string;
  funding: string;
  crops: string[];
  speed: string;
  url: string;
  citations?: string[];
}

export type CompanyType =
  | 'Benchtop'
  | 'Mobile'
  | 'Handheld Light Sensor'
  | 'Software'
  | 'Mobile + Device'
  | 'Benchtop + In-line'
  | 'In-line + Benchtop'
  | 'In-line'
  | 'Unknown';

export type FilterType = 'All' | CompanyType;

export type SortOption = 'name' | 'country' | 'funding' | 'type';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortOption;
  direction: SortDirection;
}

// Dataset Types
export interface Dataset {
  name: string;
  images: string;
  annotations: string;
  description: string;
  source: string;
  url: string;
  license: string;
  year: string;
  crops: string[];
  tasks: string[];
  details: string;
  format: string;
  challenges: string;
  citations?: string[];
}

// Tech Category Types
export interface TechCategory {
  name: string;
  icon: React.ReactNode;
  desc: string;
  companies: string[];
}

// History Types
export interface HistoryEra {
  era: string;
  title: string;
  desc: string;
  metric: string;
  icon: React.ReactNode;
}

// Grading Philosophy Types
export interface GradingPhilosophy {
  region: string;
  philosophy: string;
  metric: string;
  authority: string;
}

// AI Research Types
export interface Algorithm {
  name: string;
  role: string;
  desc: string;
  icon: React.ReactNode;
  url: string;
  citations?: string[];
}

export interface CropDeepDive {
  crop: string;
  focus: string;
  detail: string;
  accuracy: string;
  url: string;
  citations?: string[];
}

export interface FutureTrend {
  title: string;
  desc: string;
}

export interface AIResearchData {
  algorithms: Algorithm[];
  cropDeepDives: CropDeepDive[];
  futureTrends: FutureTrend[];
}

// Regulatory Types
export interface RegulatoryRegion {
  name: string;
  agency: string;
  legislation: string;
  keyChange: string;
  driver: string;
  status: string;
  icon: React.ReactNode;
  url: string;
  citations?: string[];
}

export interface RegulatoryData {
  regions: RegulatoryRegion[];
}

// Market Stats Types
export interface MarketStat {
  label: string;
  value: string;
  growth: string;
  citations?: string[];
}

// Chart Types
export interface BarChartData {
  label: string;
  value: number;
}

export interface DonutChartData {
  label: string;
  value: number;
  color: string;
}

// Tab Types
export type TabId =
  | 'landscape'
  | 'insights'
  | 'datasets'
  | 'research'
  | 'regulations'
  | 'history'
  | 'trends';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Pagination Types
export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Export Types
export type ExportFormat = 'csv' | 'json';
