// Glossary data for GrainTech Dashboard
// Plain language definitions at 8th-grade reading level
// All definitions include examples and related terms

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "AI (Artificial Intelligence)",
    definition: "Computer programs that can learn patterns from examples, like teaching a computer to recognize damaged grain by showing it thousands of photos.",
    example: "An AI model trained on 100,000 wheat kernel images can spot defects faster than a human inspector.",
    relatedTerms: ["Machine Learning", "Computer Vision"]
  },
  {
    term: "Benchtop Analyzer",
    definition: "A tabletop machine in a lab or grain facility that examines grain samples, usually taking a few minutes per sample.",
    example: "A farmer brings a bucket of wheat to the local elevator, where a benchtop analyzer checks the protein level.",
    relatedTerms: ["Sensor", "Imaging"]
  },
  {
    term: "Computer Vision",
    definition: "Technology that lets computers 'see' and understand images, used to identify grain defects, count kernels, or measure size.",
    example: "A phone app uses computer vision to count the number of broken kernels in a handful of grain.",
    relatedTerms: ["AI", "Image Analysis"]
  },
  {
    term: "Defect",
    definition: "Any problem with a grain kernel, like damage from insects, mold, sprouting, or breaking during harvest.",
    example: "A wheat sample with 5% defects (damaged kernels) gets a lower grade and price than clean wheat.",
    relatedTerms: ["Quality", "Grading"]
  },
  {
    term: "Grade",
    definition: "A quality category assigned to grain based on how it looks and tests, like 'Grade 1' or 'Grade 2'. Higher grades usually mean better quality and higher prices.",
    example: "Grade 1 wheat has very few defects and commands a premium price for export.",
    relatedTerms: ["Quality Standards", "Inspection"]
  },
  {
    term: "Grading",
    definition: "The process of examining grain to determine its quality category, historically done by hand, now increasingly done with digital tools.",
    example: "Traditional grading involves a trained inspector looking at grain under a light; digital grading uses cameras and sensors.",
    relatedTerms: ["Quality Testing", "Inspection"]
  },
  {
    term: "Identity Preservation",
    definition: "Keeping specific varieties of grain separate from harvest through processing, important for specialty crops and non-GMO claims.",
    example: "A pasta company pays extra for identity-preserved durum wheat to guarantee the exact variety they need.",
    relatedTerms: ["Traceability", "Variety Purity"]
  },
  {
    term: "Imaging",
    definition: "Taking pictures of grain kernels (using regular cameras, special light sensors, or 3D scanners) to measure quality traits.",
    example: "A benchtop imager takes photos of 500 kernels at once to measure their size and color.",
    relatedTerms: ["Computer Vision", "Sensors"]
  },
  {
    term: "Inline Grading",
    definition: "Automatic quality testing that happens while grain is moving on a conveyor belt or through a pipe, with no need to stop and take samples.",
    example: "At a grain terminal, inline grading checks protein levels continuously as wheat flows into storage bins.",
    relatedTerms: ["Automation", "Real-time Analysis"]
  },
  {
    term: "Kernel",
    definition: "A single seed of grain (like one wheat berry, one corn kernel, or one rice grain).",
    example: "A typical wheat sample contains thousands of kernels.",
    relatedTerms: ["Seed", "Grain"]
  },
  {
    term: "Machine Learning",
    definition: "A type of AI where computers improve at a task by studying examples, rather than following pre-programmed rules.",
    example: "Instead of programming rules like 'if color is brown, it's damaged', machine learning lets the computer find patterns in thousands of examples.",
    relatedTerms: ["AI", "Training Data"]
  },
  {
    term: "Mobile Grading",
    definition: "Using a smartphone or handheld device to check grain quality in the field or at a farm gate, instead of sending samples to a lab.",
    example: "A grain buyer uses a phone app to estimate protein content before making an offer at the farm.",
    relatedTerms: ["Sensor", "Grading"]
  },
  {
    term: "NIR (Near-Infrared Spectroscopy)",
    definition: "A technology that shines invisible light through grain to measure chemical properties like protein, moisture, and oil without damaging the sample.",
    example: "An NIR sensor can measure wheat protein in 30 seconds without grinding or destroying the sample.",
    relatedTerms: ["Spectroscopy", "Sensor"]
  },
  {
    term: "Protein Content",
    definition: "The percentage of protein in grain, a key quality measure for wheat (affects baking), barley (affects malting), and soybeans (affects feed value).",
    example: "Bread wheat with 13% protein is more valuable than wheat with 10% protein.",
    relatedTerms: ["Quality", "NIR"]
  },
  {
    term: "Quality Standards",
    definition: "Official rules that define what measurements and defect levels are acceptable for each grain grade, set by government agencies.",
    example: "The USDA sets standards like 'Hard Red Winter Wheat Grade 2 must have at least 58 lbs/bushel test weight.'",
    relatedTerms: ["Grading", "Regulations"]
  },
  {
    term: "Receival Point",
    definition: "A location where farmers deliver grain for storage or sale, like a grain elevator, co-op, or terminal.",
    example: "At the receival point, grain is tested for quality before the farmer is paid.",
    relatedTerms: ["Grading", "Quality Standards"]
  },
  {
    term: "Sensor",
    definition: "A device that detects and measures physical properties like color, moisture, temperature, or chemical composition.",
    example: "A moisture sensor in a combine tells the farmer when grain is dry enough to harvest.",
    relatedTerms: ["Imaging", "Spectroscopy"]
  },
  {
    term: "Spectroscopy",
    definition: "The science of using light to analyze what things are made of, used in grain grading to measure protein, oil, and moisture.",
    example: "Multispectral imaging uses several colors of light to detect subtle differences in grain quality.",
    relatedTerms: ["NIR", "Imaging"]
  },
  {
    term: "Test Weight",
    definition: "How much a specific volume of grain weighs, measured in pounds per bushel (US) or kilograms per hectoliter (metric). Heavier usually means better quality.",
    example: "Wheat with 62 lbs/bushel test weight is denser and more valuable than wheat with 58 lbs/bushel.",
    relatedTerms: ["Quality", "Grade"]
  },
  {
    term: "Training Data",
    definition: "A collection of examples (like thousands of photos of good and bad grain) used to teach an AI model what to look for.",
    example: "A dataset with 500,000 labeled wheat kernel images is used as training data for a defect detection AI.",
    relatedTerms: ["Machine Learning", "AI"]
  },
  {
    term: "Variety",
    definition: "A specific type of grain bred for certain traits, like 'Marquis wheat' or 'Pioneer 1234 corn.' Different varieties have different quality and growing characteristics.",
    example: "Durum wheat varieties are used for pasta, while hard red varieties are used for bread.",
    relatedTerms: ["Identity Preservation", "Variety Purity"]
  },
  {
    term: "Variety Purity",
    definition: "The percentage of kernels in a sample that belong to the labeled variety, important for specialty markets and breeding programs.",
    example: "A certified seed lot must have 99.5% variety purity to be sold as pure seed.",
    relatedTerms: ["Identity Preservation", "Quality Control"]
  }
];
