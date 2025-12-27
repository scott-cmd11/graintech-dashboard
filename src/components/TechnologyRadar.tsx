import { memo, useMemo, useState } from 'react';
import { Radar } from 'lucide-react';
import type { Company } from '../types';

interface TechnologyRadarProps {
  companies: Company[];
}

interface TechItem {
  name: string;
  quadrant: number;
  ring: number;
  count: number;
}

const quadrantNames = ['Sensors & Optics', 'AI & Software', 'Hardware', 'Mobile & IoT'];
const ringNames = ['Adopt', 'Trial', 'Assess', 'Hold'];
const ringColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

// Categorize technologies
function categorizeTech(tech: string): { quadrant: number; ring: number } {
  const techLower = tech.toLowerCase();

  // Determine quadrant
  let quadrant = 0;
  if (techLower.includes('camera') || techLower.includes('light') || techLower.includes('laser') || techLower.includes('nir') || techLower.includes('spectral')) {
    quadrant = 0; // Sensors & Optics
  } else if (techLower.includes('ai') || techLower.includes('software') || techLower.includes('web') || techLower.includes('network')) {
    quadrant = 1; // AI & Software
  } else if (techLower.includes('robot') || techLower.includes('auto') || techLower.includes('machine') || techLower.includes('sort')) {
    quadrant = 2; // Hardware
  } else if (techLower.includes('phone') || techLower.includes('mobile') || techLower.includes('app') || techLower.includes('iot')) {
    quadrant = 3; // Mobile & IoT
  }

  // Determine ring (maturity)
  let ring = 2; // Default: Assess
  if (techLower.includes('established') || techLower.includes('standard')) {
    ring = 0; // Adopt
  } else if (techLower.includes('advanced') || techLower.includes('high-res')) {
    ring = 1; // Trial
  } else if (techLower.includes('smart') || techLower.includes('ai')) {
    ring = 1; // Trial
  }

  return { quadrant, ring };
}

export const TechnologyRadar = memo(function TechnologyRadar({ companies }: TechnologyRadarProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);

  const techItems = useMemo(() => {
    const techMap = new Map<string, TechItem>();

    companies.forEach((company) => {
      const { quadrant, ring } = categorizeTech(company.tech);
      const key = company.tech;

      if (techMap.has(key)) {
        const existing = techMap.get(key)!;
        existing.count++;
      } else {
        techMap.set(key, { name: company.tech, quadrant, ring, count: 1 });
      }
    });

    return Array.from(techMap.values());
  }, [companies]);

  const filteredItems = selectedQuadrant !== null
    ? techItems.filter((item) => item.quadrant === selectedQuadrant)
    : techItems;

  // Calculate positions for radar visualization
  const getPosition = (item: TechItem, index: number, total: number) => {
    const quadrantAngle = (item.quadrant * 90 + 45) * (Math.PI / 180);
    const ringRadius = 30 + item.ring * 20;
    const spread = (index / total - 0.5) * 0.5;

    const x = 150 + Math.cos(quadrantAngle + spread) * ringRadius;
    const y = 150 + Math.sin(quadrantAngle + spread) * ringRadius;

    return { x, y };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Radar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Technology Radar</h3>
      </div>

      {/* Quadrant Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedQuadrant(null)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selectedQuadrant === null
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {quadrantNames.map((name, i) => (
          <button
            key={i}
            onClick={() => setSelectedQuadrant(i)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedQuadrant === i
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="relative">
        <svg viewBox="0 0 300 300" className="w-full max-w-[320px] sm:max-w-md mx-auto">
          {/* Rings */}
          {[0, 1, 2, 3].map((ring) => (
            <circle
              key={ring}
              cx="150"
              cy="150"
              r={30 + ring * 25}
              fill="none"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              strokeWidth="1"
            />
          ))}

          {/* Quadrant lines */}
          <line x1="150" y1="30" x2="150" y2="270" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <line x1="30" y1="150" x2="270" y2="150" stroke="#e5e7eb" className="dark:stroke-gray-700" />

          {/* Quadrant labels */}
          {quadrantNames.map((name, i) => {
            const angle = (i * 90 + 45) * (Math.PI / 180);
            const x = 150 + Math.cos(angle) * 120;
            const y = 150 + Math.sin(angle) * 120;
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                className="text-[9px] sm:text-xs fill-gray-500 dark:fill-gray-400"
              >
                {name}
              </text>
            );
          })}

          {/* Tech dots */}
          {filteredItems.map((item, index) => {
            const pos = getPosition(item, index, filteredItems.length);
            return (
              <g key={item.name}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={4 + item.count * 2}
                  fill={ringColors[item.ring]}
                  className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <title>{item.name} ({item.count} companies)</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {ringNames.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: ringColors[i] }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
          </div>
        ))}
      </div>

      {/* Tech List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {filteredItems.slice(0, 12).map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: ringColors[item.ring] }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
              {item.name}
            </span>
            <span className="text-xs text-gray-400 ml-auto">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TechnologyRadar;
