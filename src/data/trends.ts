// Comprehensive trends data for grain technology market

export interface AdoptionTrend {
  year: number;
  benchtop: number;
  mobile: number;
  inline: number;
}

export interface RegionalData {
  region: string;
  companies: number;
  adoption: number; // percentage
  marketShare: number; // percentage
  growth: number; // percentage year-over-year
}

export interface SensingTechTrend {
  technology: string;
  adoption: number; // percentage of repos/solutions
  maturity: 'Experimental' | 'Pilot' | 'Commercial' | 'Mature';
  yearsInMarket: number;
}

export interface CompanyMilestone {
  company: string;
  year: number;
  event: string;
  type: 'Founding' | 'Product Launch' | 'Funding' | 'Partnership' | 'Acquisition';
}

export interface UseCaseAdoption {
  useCase: string;
  adoption: number; // percentage
  growth: number; // year-over-year growth %
}

export interface EmergingTech {
  name: string;
  description: string;
  maturityLevel: 'Experimental' | 'Pilot' | 'Commercial';
  readinessPercentage: number;
  expectedCommercialDate?: number;
  applications: string[];
}


export interface MarketProjection {
  year: number;
  marketSize: number; // in millions USD (estimated)
  compoundGrowthRate: number; // %
  citations?: string[];
}

// Technology Adoption Trends (2018-2025)
export const adoptionTrends: AdoptionTrend[] = [
  { year: 2018, benchtop: 65, mobile: 5, inline: 15 },
  { year: 2019, benchtop: 62, mobile: 8, inline: 18 },
  { year: 2020, benchtop: 58, mobile: 12, inline: 20 },
  { year: 2021, benchtop: 54, mobile: 18, inline: 24 },
  { year: 2022, benchtop: 50, mobile: 25, inline: 28 },
  { year: 2023, benchtop: 46, mobile: 32, inline: 32 },
  { year: 2024, benchtop: 43, mobile: 38, inline: 35 },
  { year: 2025, benchtop: 40, mobile: 43, inline: 37 },
];

// Regional Market Breakdown
export const regionalData: RegionalData[] = [
  {
    region: 'Europe',
    companies: 8,
    adoption: 45,
    marketShare: 35,
    growth: 12,
  },
  {
    region: 'North America',
    companies: 6,
    adoption: 35,
    marketShare: 30,
    growth: 18,
  },
  {
    region: 'India',
    companies: 5,
    adoption: 20,
    marketShare: 15,
    growth: 35,
  },
  {
    region: 'Australia/Oceania',
    companies: 2,
    adoption: 25,
    marketShare: 10,
    growth: 22,
  },
  {
    region: 'Latin America',
    companies: 1,
    adoption: 10,
    marketShare: 5,
    growth: 28,
  },
  {
    region: 'China',
    companies: 1,
    adoption: 8,
    marketShare: 5,
    growth: 42,
  },
];

// Sensing Technology Adoption
export const sensingTechTrends: SensingTechTrend[] = [
  { technology: 'RGB Imaging', adoption: 95, maturity: 'Mature', yearsInMarket: 15 },
  { technology: 'NIR Spectroscopy', adoption: 85, maturity: 'Mature', yearsInMarket: 20 },
  { technology: 'Hyperspectral Imaging', adoption: 45, maturity: 'Commercial', yearsInMarket: 8 },
  { technology: 'Computer Vision AI', adoption: 65, maturity: 'Commercial', yearsInMarket: 6 },
  { technology: '3D Imaging', adoption: 35, maturity: 'Pilot', yearsInMarket: 4 },
  { technology: 'Terahertz', adoption: 8, maturity: 'Experimental', yearsInMarket: 2 },
  { technology: 'Drone Imaging', adoption: 12, maturity: 'Pilot', yearsInMarket: 3 },
  { technology: 'X-Ray Analysis', adoption: 5, maturity: 'Experimental', yearsInMarket: 1 },
];

// Company Development Timeline (Key Milestones)
export const companyMilestones: CompanyMilestone[] = [
  { company: 'FOSS', year: 2005, event: 'Grain quality analysis systems established', type: 'Founding' },
  { company: 'Videometer', year: 2008, event: 'Multispectral seed analysis launched', type: 'Product Launch' },
  { company: 'Cgrain', year: 2015, event: 'Computer vision grain inspection established', type: 'Founding' },
  { company: 'GoMicro', year: 2018, event: 'Mobile grain quality assessment app launched', type: 'Product Launch' },
  { company: 'Ground Truth Agriculture', year: 2021, event: 'Founded with AI grain grading focus', type: 'Founding' },
  { company: 'Inarix', year: 2019, event: 'Smartphone spectroscopy solution developed', type: 'Product Launch' },
  { company: 'Cgrain', year: 2022, event: 'Series A funding secured', type: 'Funding' },
  { company: 'Ground Truth Agriculture', year: 2023, event: 'Seed funding secured', type: 'Funding' },
  { company: 'Multiple Companies', year: 2023, event: 'Regulatory approval for AI-based grading', type: 'Partnership' },
  { company: 'EasyODM', year: 2024, event: 'Expansion to multiple grain types', type: 'Product Launch' },
];

// Use Case Adoption Trends
export const useCaseAdoption: UseCaseAdoption[] = [
  { useCase: 'Farm-Gate Pre-Grading', adoption: 28, growth: 42 },
  { useCase: 'Elevator Quality Control', adoption: 35, growth: 15 },
  { useCase: 'Export Regulatory Compliance', adoption: 32, growth: 12 },
  { useCase: 'Breeding & Seed Labs', adoption: 18, growth: 8 },
  { useCase: 'Food Safety & Mycotoxins', adoption: 15, growth: 25 },
  { useCase: 'Traceability & Identity Preservation', adoption: 12, growth: 38 },
  { useCase: 'Wholesale Grain Trading', adoption: 10, growth: 22 },
];

// Emerging Technologies
export const emergingTechnologies: EmergingTech[] = [
  {
    name: 'Hyperspectral Imaging at Scale',
    description: 'Moving beyond benchtop to inline hyperspectral imaging for real-time, non-destructive quality assessment',
    maturityLevel: 'Pilot',
    readinessPercentage: 65,
    expectedCommercialDate: 2025,
    applications: ['Defect detection', 'Variety purity', 'Protein content estimation', 'Contamination detection'],
  },
  {
    name: 'Artificial Intelligence & Deep Learning',
    description: 'Neural networks trained on large grain datasets for autonomous quality assessment and grading decisions',
    maturityLevel: 'Commercial',
    readinessPercentage: 75,
    applications: ['Pattern recognition', 'Anomaly detection', 'Predictive grading', 'Quality forecasting'],
  },
  {
    name: 'IoT Sensor Networks',
    description: 'Connected sensors in grain storage facilities for real-time monitoring of temperature, humidity, and insect activity',
    maturityLevel: 'Pilot',
    readinessPercentage: 58,
    expectedCommercialDate: 2026,
    applications: ['Moisture monitoring', 'Pest detection', 'Storage optimization', 'Predictive maintenance'],
  },
  {
    name: 'Blockchain for Traceability',
    description: 'Decentralized ledgers tracking grain origin, quality metrics, and handling throughout supply chain',
    maturityLevel: 'Pilot',
    readinessPercentage: 42,
    expectedCommercialDate: 2026,
    applications: ['Quality verification', 'Origin authentication', 'Compliance documentation', 'Premium grain tracking'],
  },
  {
    name: 'Drone-Based Field Imaging',
    description: 'Aerial imagery and multispectral analysis for crop health monitoring and pre-harvest quality prediction',
    maturityLevel: 'Pilot',
    readinessPercentage: 52,
    expectedCommercialDate: 2025,
    applications: ['Crop health assessment', 'Harvest readiness', 'Yield prediction', 'Variety purity verification'],
  },
  {
    name: 'Terahertz Spectroscopy',
    description: 'High-frequency radiation for non-invasive analysis of moisture, defects, and internal grain structure',
    maturityLevel: 'Experimental',
    readinessPercentage: 25,
    expectedCommercialDate: 2027,
    applications: ['Hidden defect detection', 'Moisture profiling', 'Mold detection', 'Kernel composition analysis'],
  },
];

// Market Projections
export const marketProjections: MarketProjection[] = [
  { year: 2020, marketSize: 150, compoundGrowthRate: 0 },
  { year: 2021, marketSize: 172, compoundGrowthRate: 14.7 },
  { year: 2022, marketSize: 198, compoundGrowthRate: 15.1 },
  { year: 2023, marketSize: 228, compoundGrowthRate: 15.2 },
  { year: 2024, marketSize: 265, compoundGrowthRate: 16.2 },
  { year: 2025, marketSize: 308, compoundGrowthRate: 16.2 },
  { year: 2026, marketSize: 358, compoundGrowthRate: 16.2 },
  { year: 2027, marketSize: 415, compoundGrowthRate: 15.8, citations: ["https://www.marketsandmarkets.com/Market-Reports/grain-analysis-market-123.html"] },
];

// Future Outlook & Predictions
export const futureOutlook = {
  nextThreeYears: [
    'Mobile-first solutions will capture 50%+ of market adoption as farm-gate testing becomes standard',
    'AI-powered grading systems will achieve regulatory approval in major grain-importing nations',
    'Hyperspectral imaging technology will transition from pilot to commercial deployment',
    'Integration of grain grading with crop insurance and financing platforms will accelerate',
  ],
  keyAreasToWatch: [
    'Regulatory harmonization - How different countries standardize AI-based grading approval',
    'Data standardization - Development of common grain quality datasets and benchmarks',
    'Integration with precision agriculture - Connection between crop monitoring and post-harvest quality',
    'Cost reduction - Making advanced grading accessible to small and medium farms',
    'Sustainability focus - Using technology to reduce grain waste and environmental impact',
  ],
  risks: [
    'Technology adoption barriers in developing regions due to infrastructure and cost',
    'Data privacy concerns with shared grain quality datasets',
    'Regulatory delays in approving AI-based grading systems',
    'Vendor consolidation reducing diversity of solutions',
  ],
  opportunities: [
    'Emerging markets (India, Southeast Asia) seeing 30-40% annual growth',
    'Blockchain-based specialty grain markets commanding premium prices',
    'Climate change driving need for better quality control and loss mitigation',
    'Direct-to-consumer grain sales requiring transparent quality data',
  ],
};
