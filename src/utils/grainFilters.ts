import type {
  GrainSolution,
  Region,
  SensingTech,
  FormFactor,
  UseCase,
} from "../data/grainTechEntities";

export interface GrainFilterState {
  regions: Region[];
  sensing: SensingTech[];
  formFactors: FormFactor[];
  useCases: UseCase[];
}

export interface GrainFilterOptions {
  regions: Region[];
  sensing: SensingTech[];
  formFactors: FormFactor[];
  useCases: UseCase[];
}

export function getGrainFilterOptions(solutions: GrainSolution[]): GrainFilterOptions {
  const regionsSet = new Set<Region>();
  const sensingSet = new Set<SensingTech>();
  const formFactorSet = new Set<FormFactor>();
  const useCaseSet = new Set<UseCase>();

  solutions.forEach((solution) => {
    solution.regions.forEach((region) => regionsSet.add(region));
    solution.sensingTech.forEach((tech) => sensingSet.add(tech));
    solution.formFactors.forEach((factor) => formFactorSet.add(factor));
    solution.useCases.forEach((useCase) => useCaseSet.add(useCase));
  });

  return {
    regions: Array.from(regionsSet).sort(),
    sensing: Array.from(sensingSet).sort(),
    formFactors: Array.from(formFactorSet).sort(),
    useCases: Array.from(useCaseSet).sort(),
  };
}

export function filterGrainSolutions(
  solutions: GrainSolution[],
  filters: GrainFilterState
): GrainSolution[] {
  return solutions.filter((solution) => {
    const matchRegions =
      filters.regions.length === 0 ||
      solution.regions.some((region) => filters.regions.includes(region));
    const matchSensing =
      filters.sensing.length === 0 ||
      solution.sensingTech.some((tech) => filters.sensing.includes(tech));
    const matchFormFactors =
      filters.formFactors.length === 0 ||
      solution.formFactors.some((factor) => filters.formFactors.includes(factor));
    const matchUseCases =
      filters.useCases.length === 0 ||
      solution.useCases.some((useCase) => filters.useCases.includes(useCase));

    return matchRegions && matchSensing && matchFormFactors && matchUseCases;
  });
}
