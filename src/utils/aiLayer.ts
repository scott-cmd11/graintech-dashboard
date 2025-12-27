import type { GrainSolution, SensingTech, FormFactor, UseCase } from "../data/grainTechEntities";

export type AILayer = "Vision CNN" | "Spectral ML" | "Edge AI" | "Cloud-based";

const spectralSignals: SensingTech[] = ["NIR", "HSI", "SpectralImaging", "Terahertz", "XRay"];
const edgeFormFactors: FormFactor[] = ["Smartphone", "OnCombine", "HandheldSensor"];
const cloudUseCases: UseCase[] = ["Traceability"];

export function deriveAiLayers(solution: GrainSolution): AILayer[] {
  const layers = new Set<AILayer>();

  if (solution.sensingTech.includes("RGB") || solution.sensingTech.length > 0) {
    layers.add("Vision CNN");
  }

  if (solution.sensingTech.some((tech) => spectralSignals.includes(tech))) {
    layers.add("Spectral ML");
  }

  if (solution.formFactors.some((factor) => edgeFormFactors.includes(factor))) {
    layers.add("Edge AI");
  }

  if (solution.useCases.some((useCase) => cloudUseCases.includes(useCase))) {
    layers.add("Cloud-based");
  }

  if (layers.size === 0) {
    layers.add("Vision CNN");
  }

  return Array.from(layers);
}

export const aiLayerOrder: AILayer[] = ["Vision CNN", "Spectral ML", "Edge AI", "Cloud-based"];
