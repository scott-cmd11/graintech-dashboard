import type { Company, Dataset, ExportFormat } from '../types';
import type { GrainSolution } from '../data/grainTechEntities';

// Helper to escape CSV values
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = Array.isArray(value) ? value.join(', ') : String(value);

  // If the value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

// Convert companies to CSV
function companiesToCSV(companies: Company[]): string {
  const headers = [
    'ID',
    'Name',
    'Product',
    'Country',
    'Type',
    'Technology',
    'Description',
    'Funding',
    'Crops',
    'Speed',
    'URL',
  ];

  const rows = companies.map(company => [
    company.id,
    company.name,
    company.product,
    company.country,
    company.type,
    company.tech,
    company.description,
    company.funding,
    company.crops,
    company.speed,
    company.url,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSVValue).join(',')),
  ].join('\n');

  return csvContent;
}

// Convert datasets to CSV
function datasetsToCSV(datasets: Dataset[]): string {
  const headers = [
    'Name',
    'Images',
    'Annotations',
    'Description',
    'Source',
    'URL',
    'License',
    'Year',
    'Crops',
    'Tasks',
    'Details',
    'Format',
    'Challenges',
  ];

  const rows = datasets.map(dataset => [
    dataset.name,
    dataset.images,
    dataset.annotations,
    dataset.description,
    dataset.source,
    dataset.url,
    dataset.license,
    dataset.year,
    dataset.crops,
    dataset.tasks,
    dataset.details,
    dataset.format,
    dataset.challenges,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSVValue).join(',')),
  ].join('\n');

  return csvContent;
}

// Convert grain solutions to CSV
function grainSolutionsToCSV(solutions: GrainSolution[]): string {
  const headers = [
    'ID',
    'Company',
    'Product',
    'Regions',
    'Form Factors',
    'Sensing Tech',
    'Use Cases',
    'User Segments',
    'Throughput Samples Per Hour',
    'Avg Test Duration Seconds',
    'Accuracy Percent',
    'Sample Size Grams',
    'Maturity Level',
    'Notes',
    'Primary Lat',
    'Primary Lng',
  ];

  const rows = solutions.map(solution => [
    solution.id,
    solution.company,
    solution.productName,
    solution.regions,
    solution.formFactors,
    solution.sensingTech,
    solution.useCases,
    solution.userSegments,
    solution.throughputSamplesPerHour ?? '',
    solution.avgTestDurationSeconds ?? '',
    solution.accuracyPercent ?? '',
    solution.sampleSizeGrams ?? '',
    solution.maturityLevel ?? '',
    solution.notes ?? '',
    solution.primaryLat ?? '',
    solution.primaryLng ?? '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSVValue).join(',')),
  ].join('\n');

  return csvContent;
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export companies
export function exportCompanies(
  companies: Company[],
  format: ExportFormat,
  filename = 'graintech-companies'
): void {
  if (format === 'csv') {
    const csv = companiesToCSV(companies);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const json = JSON.stringify(companies, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
}

// Export datasets
export function exportDatasets(
  datasets: Dataset[],
  format: ExportFormat,
  filename = 'graintech-datasets'
): void {
  if (format === 'csv') {
    const csv = datasetsToCSV(datasets);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const json = JSON.stringify(datasets, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
}

// Export all data
export function exportAllData(
  companies: Company[],
  datasets: Dataset[],
  format: ExportFormat,
  filename = 'graintech-data'
): void {
  const allData = {
    exportedAt: new Date().toISOString(),
    companies,
    datasets,
  };

  if (format === 'csv') {
    // For CSV, export companies and datasets separately
    const companiesCSV = companiesToCSV(companies);
    const datasetsCSV = datasetsToCSV(datasets);

    downloadFile(companiesCSV, `${filename}-companies.csv`, 'text/csv;charset=utf-8;');
    // Small delay to prevent browser blocking
    setTimeout(() => {
      downloadFile(datasetsCSV, `${filename}-datasets.csv`, 'text/csv;charset=utf-8;');
    }, 100);
  } else {
    const json = JSON.stringify(allData, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
}

// Export favorites
export function exportFavorites(
  companies: Company[],
  favoriteIds: number[],
  format: ExportFormat,
  filename = 'graintech-favorites'
): void {
  const favorites = companies.filter(c => favoriteIds.includes(c.id));
  exportCompanies(favorites, format, filename);
}

// Export grain solutions
export function exportGrainSolutions(
  solutions: GrainSolution[],
  format: ExportFormat,
  filename = 'graintech-solutions'
): void {
  if (format === 'csv') {
    const csv = grainSolutionsToCSV(solutions);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const json = JSON.stringify(solutions, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
}
