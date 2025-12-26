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
  { id: 1, name: "Cgrain", product: "Cgrain Value / Sorter", country: "Sweden", type: "Benchtop", tech: "Cameras + Mirrors", description: "Uses mirrors to see every side of the grain kernel at once, so no defects are hidden. The 'Sorter' model can physically separate good seeds from bad ones.", funding: "Lantmannen partnership", crops: ["Wheat", "Barley", "Rice", "Oats"], speed: "8-12 kernels/sec", url: "www.cgrain.se" },
  { id: 2, name: "FOSS", product: "EyeFoss", country: "Denmark", type: "Benchtop", tech: "Lasers + Cameras", description: "The industry standard. Uses lasers to see wrinkles and dents on the grain surface, and cameras to check the color. Connects to the internet for easy updates.", funding: "Established Corp", crops: ["Wheat", "Barley"], speed: "10,000 kernels/4min", url: "www.fossanalytics.com" },
  { id: 3, name: "QualySense", product: "QSorter Explorer", country: "Switzerland", type: "Benchtop", tech: "Light Sensors + Robotics", description: "Checks the quality inside each individual kernel very fast. It measures protein and oil levels for every single seed.", funding: "USDA/AGROSCOPE collab", crops: ["All grains", "Coffee", "Seeds"], speed: "30-50 kernels/sec", url: "www.qualysense.com" },
  { id: 4, name: "ZoomAgri", product: "ZoomSpex / ZoomVarieties", country: "Argentina/Australia", type: "Benchtop", tech: "High-Detail Scanner", description: "Uses a scanner to identify exactly what type of barley is in the sample. Helps keep premium grain batches separate from standard ones.", funding: "$11M (Series A, GrainCorp led)", crops: ["Barley", "Wheat", "Corn", "Soy"], speed: "<3 min/sample", url: "www.zoomagri.com" },
  { id: 5, name: "GoMicro", product: "GoMicro Assessor", country: "Singapore/Australia", type: "Mobile", tech: "Phone Camera + Attachment", description: "A low-cost attachment ($330) for your phone. Lets farmers check grain quality right on the farm so they don't get rejected at the elevator.", funding: "Bayer Crop Science Award", crops: ["Lentils", "Wheat", "Corn", "Soy", "Chickpeas"], speed: "<1 min/sample", url: "www.gomicro.co" },
  { id: 6, name: "Inarix", product: "PocketLab", country: "France", type: "Mobile", tech: "Smartphone AI", description: "Uses advanced AI to work well even with different phone cameras and outdoor lighting. Very accurate at telling different barley types apart.", funding: "3.1M seed", crops: ["Barley", "Wheat", "Soy"], speed: "<20 sec", url: "www.inarix.com" },
  { id: 7, name: "GrainSense", product: "GS Go / GS Lab / GS Combine", country: "Finland", type: "Handheld Light Sensor", tech: "Portable Light Sensor", description: "A battery-powered handheld device. Measures protein and moisture in seconds. New models can be mounted directly on harvest machinery.", funding: "Nordic innovation", crops: ["All cereals", "Oilseeds"], speed: "Seconds", url: "www.grainsense.com" },
  { id: 8, name: "Videometer", product: "VideometerLab 4", country: "Denmark", type: "Benchtop", tech: "Advanced Light Imaging", description: "Uses 19 different types of light (colors humans can't see) to spot diseases like Fusarium before they are visible to the naked eye.", funding: "Established Corp", crops: ["All seeds", "Research applications"], speed: "Seconds/petri dish", url: "www.videometer.com" },
  { id: 9, name: "Zeutec", product: "SpectraAlyzer GRAIN VISION AI", country: "Germany", type: "Benchtop", tech: "Cameras + 3D Lights", description: "Uses special 3D lights to remove shadows, making it easier to measure the length and width of kernels accurately.", funding: "Established Corp", crops: ["Rice", "Wheat", "Quinoa", "Seeds"], speed: "60-90 sec", url: "www.zeutec.com" },
  { id: 10, name: "Cropify", product: "Cropify Opal", country: "Australia", type: "Benchtop", tech: "Dual Cameras + AI", description: "Specifically trained to find weed seeds that are banned in export markets. Also helps track sustainability data.", funding: "GrainInnovate backed", crops: ["Lentils", "Chickpeas", "Faba beans"], speed: "~6 min/sample", url: "www.cropify.com.au" },
  { id: 11, name: "Indyn/Platypus Vision", product: "Platypus", country: "Australia", type: "Benchtop", tech: "High-Res Vision", description: "Analyzes a large sample (1 liter) quickly. Has a 'Supervisor Mode' where a human can double-check the AI's work to build trust.", funding: "Self-funded, seeking partners", crops: ["Cereals", "Pulses", "Tree nuts"], speed: "Minutes", url: "www.indyn.com.au" },
  { id: 12, name: "Agsure", product: "Agsure Device", country: "India", type: "Mobile + Device", tech: "Camera + Internet of Things", description: "Affordable hardware (~$1,800) designed for rice mills. Checks if rice kernels are broken or chalky.", funding: "$21M Series A (AgNext parent)", crops: ["Rice", "Wheat", "Pulses"], speed: "30 sec", url: "www.agnext.com" },
  { id: 13, name: "Grain Discovery", product: "Digital Passport Platform", country: "Canada", type: "Software", tech: "Digital Tracking", description: "Creates 'digital passports' for soybeans. This links the quality of the bean directly to the buyer, ensuring farmers get paid for quality.", funding: "Protein Industries Canada", crops: ["Soy", "Corn", "Wheat", "Lentils"], speed: "Real-time", url: "www.graindiscovery.com" },
  { id: 14, name: "Ground Truth Ag", product: "Benchtop + On-Combine Units", country: "Canada", type: "Benchtop + In-line", tech: "Cameras + Light Sensors", description: "Combines visual cameras and light sensors in one machine. Can sort high-protein wheat from low-protein wheat right during harvest.", funding: "$4M Seed + $4.5M Protein Industries Canada", crops: ["Wheat", "Lentils", "Soy", "Durum", "Oats", "Faba beans"], speed: "Real-time", url: "groundtruth.ag" },
  { id: 15, name: "Upjao", product: "Upjao Easy / Upjao Ultra", country: "India", type: "Mobile + Device", tech: "Smart AI Network", description: "An app for traders and a scanner for mills. Helps small farmers get a fair grade for their crops.", funding: "Pusa Krishi Grant", crops: ["Wheat", "Rice", "Maize", "Soybean", "Pulses", "Millets"], speed: "<30 sec", url: "www.upjao.com" },
  { id: 16, name: "Deimos Laboratory", product: "Visual Analysis Device", country: "Australia", type: "Benchtop", tech: "Self-Cleaning AI", description: "A printer-sized machine that cleans itself with air bursts so dust doesn't mess up the camera. Very fast.", funding: "CBH Group JV", crops: ["Wheat", "Barley", "WA Broad-acre crops"], speed: "10,000 kernels/<4 min", url: "deimos.com.au" },
  { id: 17, name: "EasyODM", product: "Grain Sample Analysis System", country: "Lithuania", type: "Benchtop", tech: "Web Software", description: "Allows labs to connect their own cameras to EasyODM's software. Replaces slow manual inspections with fast AI checks.", funding: "Self-funded", crops: ["Wheat", "Barley", "Hemp", "Soy", "Corn", "Chickpeas", "Quinoa"], speed: "3 sec/sample", url: "easyodm.tech" },
  { id: 18, name: "Nebulaa", product: "MATT Automatic Grain Analyser", country: "India", type: "Benchtop", tech: "Multi-Angle Vision", description: "Uses cameras to look at kernels from many angles. Claims to be 20 times faster than a human chemist.", funding: "$295K Seed (Swasa Agro)", crops: ["Rice", "Wheat", "Cereals", "Pulses"], speed: "<1 min/sample", url: "nebulaa.in" },
  { id: 19, name: "Vibe Imaging Analytics", product: "QM3i Analyzers", country: "USA/Israel", type: "Benchtop", tech: "High-Res Optics", description: "Fast analysis in under a minute. Designed to work nights and weekends to help when there aren't enough human staff.", funding: "Global distribution network", crops: ["Rice", "Wheat", "Barley", "Seeds", "Coffee"], speed: "<1 min", url: "vibeia.com" },
  { id: 20, name: "SuperGeo AI Tech", product: "Grain Grading App", country: "Canada", type: "Mobile", tech: "Location AI", description: "Calculates kernel weight automatically using a piece of paper for scale. Detects frost and heat damage in wheat.", funding: "Mitacs partnership", crops: ["Wheat", "Barley", "Canola", "Oats"], speed: "Seconds", url: "sga.ai" },
  { id: 21, name: "Grainkart/GrainScope", product: "GrainScope AI Analyzer", country: "India", type: "Benchtop", tech: "AI Marketplace", description: "Building a 'Grain Bazaar' where buyers trust the quality because it was checked by an objective AI, not a person.", funding: "Self-funded", crops: ["Rice", "Paddy", "FRK"], speed: "<1 min", url: "grainscope.ai" },
  { id: 22, name: "Keyetech", product: "AI Intelligent Sorting Machine", country: "China", type: "In-line", tech: "High-Contrast Cameras", description: "Uses powerful cameras to find very small defects like mold or foreign seeds that look similar to the grain.", funding: "National High-tech Enterprise", crops: ["Rice", "Grains", "Miscellaneous grains"], speed: "Real-time", url: "www.keyeintelligent.com" },
  { id: 23, name: "Shandong Hongsheng", product: "Fully Automated Inspection Platform", country: "China", type: "In-line + Benchtop", tech: "Auto-Weighing", description: "A large industrial system for state storage. It checks individual kernels and weighs them automatically for reports.", funding: "Specialized New Enterprise", crops: ["Wheat", "Rice", "Corn", "Grains"], speed: "Fully automated", url: "en.hosheng.cn" },
  { id: 24, name: "John Deere", product: "HarvestLab 3000", country: "USA/Global", type: "In-line", tech: "Light Sensors (On-Combine)", description: "Senses protein, starch, and oil levels while the harvester is running. Creates maps showing where the best quality grain grew.", funding: "Public Corp (DE)", crops: ["Wheat", "Barley", "Corn", "Canola"], speed: "Real-time (Stream)", url: "www.deere.com" },
  { id: 25, name: "Case IH", product: "Harvest Command", country: "USA/Global", type: "In-line", tech: "Cameras + Automation", description: "Automatically changes combine settings if it sees broken grain. It watches for cracks and dirt to keep quality high.", funding: "CNH Industrial", crops: ["Wheat", "Corn", "Soy", "Canola"], speed: "Real-time (Control Loop)", url: "www.caseih.com" },
  { id: 26, name: "Next Instruments", product: "CropScan 3300H", country: "Australia", type: "In-line", tech: "Light Sensors + Logistics", description: "Analyzes protein in real-time on the combine. Helps farmers sort grain into different bins based on quality right in the field.", funding: "Private", crops: ["Cereals", "Oilseeds"], speed: "Real-time", url: "www.nextinstruments.net" }
];

export const datasetsData: Dataset[] = [
  { name: "Global Wheat Head Detection", images: "4,700+", annotations: "190,000+ heads", description: "The standard dataset for counting wheat heads in the field. Used to estimate how much crop will be produced.", source: "ETH Zurich + 10 institutions", url: "www.global-wheat.com", license: "CC BY 4.0", year: "2020-2021", crops: ["Wheat"], tasks: ["Object Detection", "Counting", "Plant Analysis"], details: "Contains high-resolution images from fields in France, UK, Canada, Australia, Japan, China, and Switzerland. It helps AI learn what wheat looks like in different countries and lighting conditions.", format: "COCO JSON annotations", challenges: "Overlapping heads, variable lighting, motion blur" },
  { name: "GrainSpace", images: "5.25M", annotations: "Expert Labels", description: "A massive collection that ensures AI trained on expensive scanners also works on cheap phones.", source: "UNSW Sydney", url: "github.com/hellodfan/GrainSpace", license: "CC BY-NC-SA 4.0", year: "2022", crops: ["Wheat", "Maize", "Rice"], tasks: ["Recognition", "Device Adaptation", "Defect Spotting"], details: "Images taken with three different devices: professional industrial cameras, lab cameras, and smartphones. This helps developers build apps that work for farmers with just a phone.", format: "PNG images + CSV metadata", challenges: "Different camera qualities, subtle defect variations" },
  { name: "GrainSet", images: "350K+", annotations: "8 Categories", description: "A benchmark for checking grain quality. Very detailed labels for shape, size, and damage.", source: "Nature Scientific Data 2023", url: "github.com/hellodfan/GrainSet", license: "CC BY 4.0", year: "2023", crops: ["Wheat", "Maize", "Sorghum", "Rice"], tasks: ["Defect Classification", "Quality Grading", "Anomaly Detection"], details: "Images capture the entire surface of the kernel. It includes categories for mold, insect damage, sprouted seeds, broken seeds, heat damage, and immature seeds.", format: "PNG images + XML annotations", challenges: "Working across different crop types" },
  { name: "Soybean Seeds Quality Set", images: "5,500+", annotations: "Defect Categories", description: "A focused dataset for spotting defects in soybeans, like broken skins or spots.", source: "GTS.AI / Research", url: "gts.ai/dataset-download", license: "Research", year: "2024", crops: ["Soybean"], tasks: ["Segmentation", "Defect Detection"], details: "Perfect for training AI to grade soybeans for food exports, where visual appearance is very important.", format: "Images + Masks", challenges: "Subtle color variations" },
  { name: "Aruzz22.5K", images: "23,000+", annotations: "20 Rice Varieties", description: "Used to teach AI how to tell different types of rice apart, like Basmati vs. Jasmine.", source: "Mendeley Data / Kaggle", url: "data.mendeley.com/datasets/3mn9843tz2/4", license: "CC BY 4.0", year: "2024", crops: ["Rice"], tasks: ["Variety ID", "Fine Recognition"], details: "Helps prevent fraud where cheap rice is mixed with expensive premium rice.", format: "JPG images", challenges: "Very similar shapes between varieties" },
  { name: "WisWheat", images: "High-res", annotations: "Text Descriptions", description: "Combines images of wheat with written descriptions of defects.", source: "arXiv / Research Community", url: "arxiv.org/html/2506.06084v1", license: "Open Access", year: "2025", crops: ["Wheat"], tasks: ["Defect Detection", "Grading", "Vision-Language"], details: "The latest research connecting computer vision (seeing) with natural language (reading/writing descriptions).", format: "Images + Text Descriptions", challenges: "Combining text and image data" },
  { name: "Corn Kernel Images", images: "Various", annotations: "Fungal/Surface", description: "Datasets for spotting mold and surface damage on corn.", source: "Kaggle / Research", url: "kaggle.com", license: "Open", year: "2024", crops: ["Corn"], tasks: ["Fungal Detection"], details: "Focuses on finding mold, which is a major safety risk for corn storage.", format: "RGB", challenges: "Complex textures" }
];

export const techCategories: TechCategory[] = [
  { name: "Standard Cameras (RGB)", icon: React.createElement(Eye, { className: "w-5 h-5" }), desc: "Uses regular cameras to see defects and shapes", companies: ["Cgrain", "ZoomAgri", "GoMicro", "Cropify", "Deimos", "EasyODM"] },
  { name: "Light Sensors (NIR)", icon: React.createElement(Zap, { className: "w-5 h-5" }), desc: "Measures protein, moisture, and oil inside the grain", companies: ["QualySense", "GrainSense", "FOSS Infratec", "Ground Truth", "John Deere"] },
  { name: "Advanced Light Sensors", icon: React.createElement(Microscope, { className: "w-5 h-5" }), desc: "Uses many types of light to find hidden mold", companies: ["Videometer", "Zeutec", "Platypus Vision"] },
  { name: "Mobile / Smartphone", icon: React.createElement(Smartphone, { className: "w-5 h-5" }), desc: "Low-cost tools that use your phone", companies: ["GoMicro", "Inarix", "Agsure", "SuperGeo AI", "Upjao"] },
  { name: "Industrial / In-line", icon: React.createElement(Factory, { className: "w-5 h-5" }), desc: "Big machines for high-volume processing", companies: ["Keyetech", "Shandong Hongsheng", "John Deere", "Case IH", "Next Instruments"] }
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
    { name: "DINOv2 (Smart AI)", role: "Self-Learning", desc: "Learns from images without needing humans to label them first. Works well in bad lighting.", icon: React.createElement(Eye, { className: "w-5 h-5 text-indigo-600" }), url: "https://arxiv.org/abs/2304.07193" },
    { name: "Swin AI Model", role: "Detail Expert", desc: "Excellent at focusing on small details. Very good at spotting specific defects like mold or cracks.", icon: React.createElement(ScanLine, { className: "w-5 h-5 text-purple-600" }), url: "https://arxiv.org/abs/2103.14030" },
    { name: "SSDINet (Fast AI)", role: "Speed King", desc: "Designed for speed. Can sort soybeans in milliseconds on high-speed conveyor belts.", icon: React.createElement(Zap, { className: "w-5 h-5 text-yellow-600" }), url: "https://ieeexplore.ieee.org/document/9696236" },
    { name: "Spectral AI", role: "Light Reader", desc: "Reads raw data from light sensors directly to understand chemical composition.", icon: React.createElement(BrainCircuit, { className: "w-5 h-5 text-blue-600" }), url: "https://www.nature.com/articles/s41598-021-93739-7" }
  ],
  cropDeepDives: [
    { crop: "Rice", focus: "Chalkiness & Fake Premium", detail: "AI can spot the difference between expensive Basmati rice and cheaper rice mixed in, with 96% accuracy.", accuracy: "96.87% (Accuracy)", url: "https://www.sciencedirect.com/science/article/pii/S016816992100456X" },
    { crop: "Wheat", focus: "Disease & Bugs", detail: "AI identifies disease marks and bug damage much better than humans can.", accuracy: "98.00% (Accuracy)", url: "https://www.frontiersin.org/articles/10.3389/fpls.2020.556434/full" },
    { crop: "Maize", focus: "Mold & Damage", detail: "New AI models classify moldy and broken kernels with near-perfect precision.", accuracy: "99.89% (Accuracy)", url: "https://www.mdpi.com/2076-3417/12/11/5688" },
    { crop: "Toxins", focus: "Invisible Safety Threats", detail: "Special cameras can see dangerous toxins (like Aflatoxin) before they are visible to the eye.", accuracy: "98.42% (Safety)", url: "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/hyperspectral-imaging" }
  ],
  futureTrends: [
    { title: "Combining Sensors", desc: "Using cameras AND lasers together to see both the outside shape and the inside chemistry." },
    { title: "Smart Harvesters", desc: "Machines like John Deere's that process data right in the field while harvesting." },
    { title: "Digital Passports", desc: "Digital records that travel with the grain, proving its quality and safety." }
  ]
};

export const regulatoryData: RegulatoryData = {
  regions: [
    {
      name: "Canada",
      agency: "Canadian Grain Commission",
      legislation: "Modernizing Old Rules",
      keyChange: "Making it easier to update grading rules without waiting for long legal processes. Using science to set standards.",
      driver: "Better Standards for Farmers",
      status: "Changing Rules",
      icon: React.createElement(Building2, { className: "w-6 h-6 text-red-600" }),
      url: "https://www.grainscanada.gc.ca/en/grain-quality/official-grain-grading-guide/"
    },
    {
      name: "United States",
      agency: "USDA FGIS",
      legislation: "Grain Standards Act",
      keyChange: "Created a formal process to test and approve new AI technology. Focus on food safety tracking.",
      driver: "Standardization",
      status: "Formal Process",
      icon: React.createElement(Gavel, { className: "w-6 h-6 text-blue-600" }),
      url: "https://www.ams.usda.gov/rules-regulations/usgsa"
    },
    {
      name: "Argentina",
      agency: "SENASA",
      legislation: "New Decree 2025",
      keyChange: "Mandating digital tracking. Using AI sensors to do routine checks so ships can leave ports faster.",
      driver: "Speed & Tax Tracking",
      status: "Rapid Adoption",
      icon: React.createElement(Globe, { className: "w-6 h-6 text-sky-600" }),
      url: "https://www.argentina.gob.ar/senasa"
    },
    {
      name: "Australia",
      agency: "Grain Trade Australia",
      legislation: "Industry Self-Regulation",
      keyChange: "Turning their visual grading guides into digital datasets to train AI.",
      driver: "Efficiency",
      status: "Industry Led",
      icon: React.createElement(Sprout, { className: "w-6 h-6 text-amber-600" }),
      url: "https://www.graintrade.org.au/commodity_standards"
    },
    {
      name: "Europe / UK",
      agency: "EU Commission",
      legislation: "Digital Product Passport",
      keyChange: "Linking quality data to environmental data. Subsidies for buying optical sorters.",
      driver: "Sustainability & Safety",
      status: "Early Stage",
      icon: React.createElement(BookOpen, { className: "w-6 h-6 text-indigo-600" }),
      url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal/industry-mobilised-clean-and-circular-economy_en"
    }
  ]
};

export const marketStats: MarketStat[] = [
  { label: "Global Grain Analysis Market", value: "$4.1B", growth: "+8.5%" },
  { label: "AI Adoption in Agriculture", value: "22%", growth: "+35%" },
  { label: "Digital Grain Samples Tracked", value: "12M+", growth: "+150%" }
];

// Type color mapping
export const typeColors: Record<string, string> = {
  "Benchtop": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Mobile": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Handheld Light Sensor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Software": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Mobile + Device": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Benchtop + In-line": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "In-line + Benchtop": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "In-line": "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
};
