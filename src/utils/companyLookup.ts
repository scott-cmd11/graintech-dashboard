import { companiesData } from "../data";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

const companyUrlMap = new Map(
  companiesData
    .filter((company) => company.url)
    .map((company) => [normalize(company.name), company.url])
);

export function getCompanyUrl(name: string): string | null {
  const normalized = normalize(name);
  const direct = companyUrlMap.get(normalized);
  if (direct) {
    return direct;
  }

  for (const [key, url] of companyUrlMap.entries()) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }

  return null;
}

export function formatCompanyUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}
