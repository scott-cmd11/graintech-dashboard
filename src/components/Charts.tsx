import { memo, useMemo } from 'react';
import type { BarChartData, DonutChartData } from '../types';

interface SimpleBarChartProps {
  data: BarChartData[];
  color?: string;
  className?: string;
}

export const SimpleBarChart = memo(function SimpleBarChart({
  data,
  color = 'bg-amber-500 hover:bg-amber-600',
  className = '',
}: SimpleBarChartProps) {
  const max = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const barMaxHeight = 120; // pixels for the bar area

  return (
    <div className={`flex items-end gap-2 w-full pt-6 ${className}`} role="img" aria-label="Bar chart">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center group"
          role="listitem"
          aria-label={`${d.label}: ${d.value}`}
        >
          {/* Tooltip */}
          <div className="relative w-full">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {d.label}: {d.value}
            </div>
          </div>
          {/* Bar */}
          <div
            className={`w-full rounded-t-sm transition-all duration-500 ${color}`}
            style={{ height: `${Math.max((d.value / max) * barMaxHeight, 4)}px` }}
            aria-hidden="true"
          />
          {/* Label */}
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
            {d.label}
          </p>
        </div>
      ))}
    </div>
  );
});

interface SimpleDonutChartProps {
  data: DonutChartData[];
  className?: string;
  showLegend?: boolean;
}

export const SimpleDonutChart = memo(function SimpleDonutChart({
  data,
  className = '',
  showLegend = true,
}: SimpleDonutChartProps) {
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const paths = useMemo(() => {
    let cumulativePercent = 0;

    return data.map((d) => {
      const startPercent = cumulativePercent;
      const percentage = d.value / total;
      cumulativePercent += percentage;

      const startAngle = startPercent * 2 * Math.PI;
      const endAngle = cumulativePercent * 2 * Math.PI;

      const x1 = 50 + 40 * Math.cos(startAngle);
      const y1 = 50 + 40 * Math.sin(startAngle);
      const x2 = 50 + 40 * Math.cos(endAngle);
      const y2 = 50 + 40 * Math.sin(endAngle);

      const largeArc = percentage > 0.5 ? 1 : 0;

      return {
        d: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: d.color,
        label: d.label,
        value: d.value,
        percentage: (percentage * 100).toFixed(1),
      };
    });
  }, [data, total]);

  return (
    <div className={`relative ${className}`}>
      <div className="w-48 h-48 mx-auto">
        <svg
          viewBox="0 0 100 100"
          className="transform -rotate-90"
          role="img"
          aria-label="Donut chart showing distribution"
        >
          {paths.map((path, i) => (
            <path
              key={i}
              d={path.d}
              fill={path.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label={`${path.label}: ${path.percentage}%`}
            >
              <title>{`${path.label}: ${path.value} (${path.percentage}%)`}</title>
            </path>
          ))}
          <circle cx="50" cy="50" r="25" className="fill-white dark:fill-gray-800" />
        </svg>
      </div>

      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs" role="list" aria-label="Chart legend">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1" role="listitem">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
                aria-hidden="true"
              />
              <span className="text-gray-600 dark:text-gray-400 truncate">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default { SimpleBarChart, SimpleDonutChart };
