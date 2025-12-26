import React from 'react';
import {
  Eye,
  Zap,
  Microscope,
  Smartphone,
  Factory,
  Scale,
  FlaskConical,
  Cpu,
  Building2,
  Gavel,
  Globe,
  Sprout,
  BookOpen,
  ScanLine,
  BrainCircuit,
} from 'lucide-react';
import type {
  Company,
  Dataset,
  TechCategory,
  HistoryEra,
  GradingPhilosophy,
  AIResearchData,
  RegulatoryData,
  MarketStat,
} from '../types';

export const companiesData: Company[] = [
  { id: 1, name: "Cgrain", product: "Cgrain Value / Value Pro / Value Sorter", country: "Sweden", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.cgrain.ai" , citations: ["https://www.cgrain.ai/products/", "https://www.cgrain.ai/about-us/"] },
  { id: 2, name: "FOSS", product: "EyeFoss", country: "Denmark", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: ["Wheat", "Barley", "Durum"], speed: "See source", url: "www.fossanalytics.com" , citations: ["https://www.fossanalytics.com/en/products/eyefoss"] },
  { id: 3, name: "QualySense", product: "QSorter Explorer", country: "Switzerland", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.qualysense.com" , citations: ["https://www.qualysense.com/"] },
  { id: 4, name: "ZoomAgri", product: "ZoomVarieties / ZoomSpex", country: "Argentina/Spain", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: ["Barley", "Wheat", "Corn", "Soy"], speed: "See source", url: "www.zoomagri.com" , citations: ["https://zoomagri.com/en/home/"] },
  { id: 5, name: "GoMicro", product: "GoMicro Grain Assessment", country: "Australia", type: "Mobile", tech: "See source", description: "See source", funding: "See source", crops: ["Wheat", "Lentils", "Corn", "Chickpea", "Soy"], speed: "See source", url: "www.gomicro.co" , citations: ["https://www.graincentral.com/ag-tech/gomicro-ai-web-app-live-for-five-australian-crops/", "https://www.gomicro.co/grain/"] },
  { id: 6, name: "Inarix", product: "PocketLab", country: "France", type: "Mobile", tech: "See source", description: "See source", funding: "See source", crops: ["Barley"], speed: "See source", url: "www.inarix.com" , citations: ["https://www.agriland.ie/farming-news/your-smartphone-can-now-be-used-to-determine-grain-quality/"] },
  { id: 7, name: "GrainSense", product: "GS Lab / GS Combine", country: "Finland", type: "Handheld Light Sensor", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.grainsense.com" , citations: ["https://grainsense.com/blogs/news/grainsense-advances-grain-quality-analysis-with-breakthrough-algorithm-update"] },
  { id: 8, name: "Videometer", product: "SeedLab / SeedSorter", country: "Denmark", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.videometer.com" , citations: ["https://videometer.com/videometer-seedlab/", "https://videometer.com/videometer-seedsorter/"] },
  { id: 9, name: "Zeutec", product: "SpectraAlyzer GRAIN VISION AI", country: "Germany", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.zeutec.com" , citations: ["https://spectraalyzer.com/grain-vision-ai/"] },
  { id: 10, name: "Cropify", product: "Cropify Opal", country: "Australia", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: ["Lentils", "Chickpeas"], speed: "See source", url: "www.cropify.io" , citations: ["https://www.graincentral.com/ag-tech/cropify-to-launch-in-field-lentil-testing-at-wimmera-sites/", "https://www.forbes.com.au/news/entrepreneurs/aussie-ai-driven-grain-grading-company-cropify-reaps-2-million/"] },
  { id: 11, name: "Indyn/Platypus Vision", product: "Platypus", country: "Australia", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.indyn.com.au" , citations: ["https://www.growag.com/article/platypus-machine-billed-future-grain-and-cereal-imaging"] },
  { id: 12, name: "Agsure", product: "Agsure Grain Quality Analyzer", country: "India", type: "Mobile + Device", tech: "See source", description: "See source", funding: "See source", crops: ["Rice"], speed: "See source", url: "www.agnext.com" , citations: ["https://www.agsure.in/shop/fg00001-agsure-grain-quality-analyzer-2", "https://play.google.com/store/apps/details?id=com.tt.ylp_quality_app"] },
  { id: 13, name: "Grain Discovery", product: "Smartphone grain quality assurance tool", country: "Canada", type: "Software", tech: "See source", description: "See source", funding: "See source", crops: ["Soybean", "Corn"], speed: "See source", url: "www.graindiscovery.com" , citations: ["https://www.proteinindustriescanada.ca/projects/phone-grain-quality-tool"] },
  { id: 14, name: "Ground Truth Ag", product: "Benchtop Grain Analyzer", country: "Canada", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "groundtruth.ag" , citations: ["https://grainswest.com/2025/09/data-upgrade/", "https://datainnovation.org/2025/09/5-qs-with-kyle-folk-ceo-of-ground-truth-ag/"] },
  { id: 15, name: "Upjao", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.upjao.com" , citations: ["https://www.upjao.com"] },
  { id: 16, name: "Deimos Laboratory", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "deimos.com.au" , citations: ["https://deimos.com.au"] },
  { id: 17, name: "EasyODM", product: "Grain Sample Analysis System", country: "See source", type: "Software", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "easyodm.tech" , citations: ["https://easyodm.tech/grain-sample-analysis/"] },
  { id: 18, name: "Nebulaa", product: "MATT Automatic Grain Analyser", country: "India", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: ["Wheat", "Rice", "Cereals", "Pulses"], speed: "See source", url: "nebulaa.in" , citations: ["https://www.neo.nebulaa.in/matt_home", "https://www.indiatimes.com/technology/news/this-startup-built-an-ai-based-grain-analyser-that-will-tell-farmers-exact-quality-of-the-crop-355901.html"] },
  { id: 19, name: "Vibe Imaging Analytics", product: "QM3i Analyzers", country: "USA/Israel", type: "Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "vibeia.com" , citations: ["https://www.vibeia.com/"] },
  { id: 20, name: "SuperGeo AI Tech", product: "Grain Grading App", country: "Canada", type: "Mobile", tech: "See source", description: "See source", funding: "See source", crops: ["Wheat", "Canola", "Peas", "Lentils"], speed: "See source", url: "sga.ai" , citations: ["https://globalnews.ca/news/9981761/saskatchewan-based-tech-company-ai-grain-grading-app/", "https://sga.ai/products/grain/"] },
  { id: 21, name: "Grainkart/GrainScope", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "grainscope.ai" , citations: ["https://grainscope.ai"] },
  { id: 22, name: "Keyetech", product: "KVS-G AI Grain Quality Analyzer", country: "China", type: "In-line", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "en.keyetech.com" , citations: ["https://www.keyevisions.com/ai-algorithm-system-grain-quality-analyzer"] },
  { id: 23, name: "Shandong Hongsheng", product: "Automated Grain Quality Inspection Platform", country: "China", type: "In-line + Benchtop", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "en.hosheng.cn" , citations: ["http://en.hosheng.cn/site-List-7"] },
  { id: 24, name: "John Deere", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.deere.com" , citations: ["https://www.deere.com"] },
  { id: 25, name: "Case IH", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.caseih.com" , citations: ["https://www.caseih.com"] },
  { id: 26, name: "Next Instruments", product: "See source", country: "See source", type: "Unknown", tech: "See source", description: "See source", funding: "See source", crops: [], speed: "See source", url: "www.nextinstruments.net" , citations: ["https://www.nextinstruments.net"] }
];

export const datasetsData: Dataset[] = [
  {
    name: "Global Wheat Head Detection",
    images: "6,500",
    annotations: "275,000+ heads",
    description: "Wheat head detection dataset used in the Global Wheat Challenge.",
    source: "Global Wheat Head Dataset",
    url: "www.global-wheat.com",
    license: "See source",
    year: "2020-2021",
    crops: ["Wheat"],
    tasks: ["Object Detection", "Counting", "Plant Analysis"],
    details: "Field images across diverse geographies and growth stages.",
    format: "Images + bounding boxes",
    challenges: "Occlusion, motion blur, variable lighting",
    citations: ["https://www.sciencedirect.com/science/article/pii/S2643651524000591", "https://arxiv.org/pdf/2105.07660"],
  },
  {
    name: "GrainSpace",
    images: "5.25M",
    annotations: "Expert labels",
    description: "Large-scale dataset for cereal grain inspection and recognition.",
    source: "GrainSpace",
    url: "github.com/hellodfan/GrainSpace",
    license: "CC BY-NC-SA 4.0",
    year: "2022",
    crops: ["Wheat", "Maize", "Rice"],
    tasks: ["Recognition", "Device Adaptation", "Defect Spotting"],
    details: "Captured with professional, lab, and mobile devices across multiple regions.",
    format: "PNG images + CSV metadata",
    challenges: "Domain shift across devices",
    citations: ["https://github.com/hellodfan/GrainSpace", "https://arxiv.org/abs/2203.05306"],
  },
  {
    name: "GrainSet",
    images: "350K+",
    annotations: "8 categories",
    description: "Annotated grain kernel image database for visual quality inspection.",
    source: "Nature Scientific Data 2023",
    url: "github.com/hellodfan/GrainSet",
    license: "See source",
    year: "2023",
    crops: ["Wheat", "Maize", "Sorghum", "Rice"],
    tasks: ["Defect Classification", "Quality Grading", "Anomaly Detection"],
    details: "Single-kernel images with expert annotations across four cereal crops.",
    format: "High-resolution images + XML annotations",
    challenges: "Cross-crop variability",
    citations: ["https://www.nature.com/articles/s41597-023-02660-8"],
  },
  {
    name: "Aruzz22.5K",
    images: "23,650 augmented + 4,730 original",
    annotations: "20 rice varieties",
    description: "Image dataset of 20 rice varieties from Bangladesh.",
    source: "Mendeley Data",
    url: "data.mendeley.com/datasets/3mn9843tz2/4",
    license: "See source",
    year: "2024",
    crops: ["Rice"],
    tasks: ["Variety ID", "Fine Recognition"],
    details: "Captured with an iPhone 11; includes original and augmented sets.",
    format: "JPG images",
    challenges: "Low-resolution originals",
    citations: ["https://data.mendeley.com/datasets/3mn9843tz2/4"],
  },
  {
    name: "Soybean Seeds (Kaggle)",
    images: "5,513",
    annotations: "5 categories",
    description: "Soybean seed images categorized by GB1352-2009 standards.",
    source: "Kaggle",
    url: "www.kaggle.com/datasets/warcoder/soyabean-seeds",
    license: "See source",
    year: "See source",
    crops: ["Soybean"],
    tasks: ["Defect Classification"],
    details: "Categories include intact, spotted, immature, broken, and skin-damaged.",
    format: "Images",
    challenges: "See source",
    citations: ["https://www.kaggle.com/datasets/warcoder/soyabean-seeds"],
  },
  {
    name: "Corn Kernel Images",
    images: "78,881",
    annotations: "Kernel images",
    description: "Maize kernel images for quality and counting tasks.",
    source: "Kaggle",
    url: "www.kaggle.com/datasets/mineral-earth-sciences-llc/corn-kernel-images",
    license: "See source",
    year: "See source",
    crops: ["Corn"],
    tasks: ["Counting", "Quality Classification"],
    details: "Individual kernel photos with associated metadata.",
    format: "Images",
    challenges: "See source",
    citations: ["https://www.kaggle.com/datasets/mineral-earth-sciences-llc/corn-kernel-images"],
  },
  {
    name: "OzBarley",
    images: "See source",
    annotations: "Hyperspectral + genomic data",
    description: "Genotype-to-phenotype dataset linking imaging and genomic traits for barley.",
    source: "ARDC",
    url: "ardc.edu.au/project/ozbarley/",
    license: "See source",
    year: "See source",
    crops: ["Barley"],
    tasks: ["Phenotyping", "Breeding"],
    details: "VNIR/SWIR hyperspectral imaging paired with genomic data.",
    format: "Hyperspectral + metadata",
    challenges: "See source",
    citations: ["https://ardc.edu.au/project/ozbarley/"],
  },
  {
    name: "WisWheat",
    images: "60,022 image-text pairs (reported)",
    annotations: "Text descriptions",
    description: "Vision-language dataset for wheat management.",
    source: "arXiv preprint",
    url: "arxiv.org/html/2506.06084v1",
    license: "See source",
    year: "2025",
    crops: ["Wheat"],
    tasks: ["Vision-Language", "Wheat Management"],
    details: "Three-tier image-text dataset for wheat-related tasks.",
    format: "Images + text",
    challenges: "See source",
    citations: ["https://arxiv.org/html/2506.06084v1"],
  },
];

export const techCategories: TechCategory[] = [
  { name: "Standard Cameras (RGB)", icon: React.createElement(Eye, { className: "w-5 h-5" }), desc: "See source", companies: [] },
  { name: "Light Sensors (NIR)", icon: React.createElement(Zap, { className: "w-5 h-5" }), desc: "See source", companies: [] },
  { name: "Advanced Light Sensors", icon: React.createElement(Microscope, { className: "w-5 h-5" }), desc: "See source", companies: [] },
  { name: "Mobile / Smartphone", icon: React.createElement(Smartphone, { className: "w-5 h-5" }), desc: "See source", companies: [] },
  { name: "Industrial / In-line", icon: React.createElement(Factory, { className: "w-5 h-5" }), desc: "See source", companies: [] }
];

export const historyData: HistoryEra[] = [
  {
    era: "Ancient - 1800s",
    title: "Checking by Eye",
    desc: "Grain was valued by where it came from (e.g., 'Sicilian Wheat'). Buyers had to inspect specific sacks personally to trust them.",
    metric: "Visual & Origin",
    icon: React.createElement(Eye, { className: "w-6 h-6 text-amber-600" })
  },
  {
    era: "1856 - 1900",
    title: "Inventing 'Grades'",
    desc: "The Chicago Board of Trade invented 'Grades' (like Grade No. 2) so grain could be mixed together in big silos and traded easily without checking every sack.",
    metric: "Volume & Weight",
    icon: React.createElement(Factory, { className: "w-6 h-6 text-gray-600" })
  },
  {
    era: "1916 - 1925",
    title: "Government Standards",
    desc: "Governments in the US and Canada created official inspection rules to stop corruption and unfair mixing of bad grain with good grain.",
    metric: "Standardized Defects",
    icon: React.createElement(Scale, { className: "w-6 h-6 text-blue-600" })
  },
  {
    era: "1960s - 1990s",
    title: "The Chemistry Era",
    desc: "Scientists invented sensors (NIR) to measure protein and oil. Grading moved from just 'how it looks' to 'what is inside it'.",
    metric: "Protein & Chemical Content",
    icon: React.createElement(FlaskConical, { className: "w-6 h-6 text-purple-600" })
  },
  {
    era: "2020s - Future",
    title: "The Digital Return",
    desc: "AI allows us to track every single kernel again. We can now have the efficiency of bulk shipping but the specific details of the ancient system.",
    metric: "Digital Analysis",
    icon: React.createElement(Cpu, { className: "w-6 h-6 text-green-600" })
  }
];

export const globalGradingPhilosophies: GradingPhilosophy[] = [
  { region: "USA", philosophy: "Objective / Numbers", metric: "Test Weight, Damage", authority: "Federal (FGIS)" },
  { region: "Canada", philosophy: "Science-Based", metric: "Variety + Protein", authority: "CGC" },
  { region: "Commonwealth", philosophy: "Fair Average Quality", metric: "Seasonal Standard", authority: "GAFTA" },
  { region: "Russia/USSR", philosophy: "State Technical", metric: "Wet Gluten Content", authority: "GOST" }
];

export const aiResearchData: AIResearchData = {
  algorithms: [
    {
      name: "DINOv2",
      role: "Self-Supervised Vision",
      desc: "Self-supervised vision model for learning image representations.",
      icon: React.createElement(Eye, { className: "w-5 h-5 text-indigo-600" }),
      url: "https://arxiv.org/abs/2304.07193",
      citations: ["https://arxiv.org/abs/2304.07193"]
    },
    {
      name: "Swin Transformer",
      role: "Hierarchical Vision Transformer",
      desc: "Vision transformer architecture with shifted window attention.",
      icon: React.createElement(ScanLine, { className: "w-5 h-5 text-purple-600" }),
      url: "https://arxiv.org/abs/2103.14030",
      citations: ["https://arxiv.org/abs/2103.14030"]
    }
  ],
  cropDeepDives: [],
  futureTrends: []
};

export const regulatoryData: RegulatoryData = {
  regions: [
    {
      name: "Canada",
      agency: "Canadian Grain Commission",
      legislation: "Modernizing Old Rules",
      keyChange: "See source",
      driver: "See source",
      status: "See source",
      icon: React.createElement(Building2, { className: "w-6 h-6 text-red-600" }),
      url: "https://www.grainscanada.gc.ca/en/grain-quality/official-grain-grading-guide/",
      citations: ["https://www.grainscanada.gc.ca/en/grain-quality/official-grain-grading-guide/"]
    },
    {
      name: "United States",
      agency: "USDA FGIS",
      legislation: "Grain Standards Act",
      keyChange: "See source",
      driver: "See source",
      status: "See source",
      icon: React.createElement(Gavel, { className: "w-6 h-6 text-blue-600" }),
      url: "https://www.ams.usda.gov/rules-regulations/usgsa",
      citations: ["https://www.ams.usda.gov/rules-regulations/usgsa"]
    },
    {
      name: "Argentina",
      agency: "SENASA",
      legislation: "Digital Modernization",
      keyChange: "See source",
      driver: "See source",
      status: "See source",
      icon: React.createElement(Globe, { className: "w-6 h-6 text-sky-600" }),
      url: "https://www.argentina.gob.ar/senasa",
      citations: ["https://www.argentina.gob.ar/senasa"]
    },
    {
      name: "Australia",
      agency: "Grain Trade Australia",
      legislation: "Industry Self-Regulation",
      keyChange: "See source",
      driver: "See source",
      status: "See source",
      icon: React.createElement(Sprout, { className: "w-6 h-6 text-amber-600" }),
      url: "https://graintrade.org.au/",
      citations: ["https://graintrade.org.au/"]
    },
    {
      name: "Europe / UK",
      agency: "EU Commission",
      legislation: "Ecodesign Regulation (ESPR)",
      keyChange: "See source",
      driver: "See source",
      status: "See source",
      icon: React.createElement(BookOpen, { className: "w-6 h-6 text-indigo-600" }),
      url: "https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/ecodesign-sustainable-products-regulation_en",
      citations: [
        "https://commission.europa.eu/energy-climate-change-environment/standards-tools-and-labels/products-labelling-rules-and-requirements/ecodesign-sustainable-products-regulation_en"
      ]
    }
  ]
};

export const marketStats: MarketStat[] = [];

// Type color mapping
export const typeColors: Record<string, string> = {
  "Benchtop": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Mobile": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Handheld Light Sensor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Software": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Mobile + Device": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Benchtop + In-line": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "In-line + Benchtop": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "In-line": "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  "Unknown": "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
};
