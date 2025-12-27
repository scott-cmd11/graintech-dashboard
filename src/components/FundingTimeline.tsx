import { memo, useMemo } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import type { Company } from '../types';

interface FundingTimelineProps {
  companies: Company[];
}

interface FundingEvent {
  company: string;
  amount: string;
  type: string;
  year: number;
  color: string;
}

// Parse funding info to extract amounts, types, and years.
function parseFunding(funding: string): { amount: string; type: string; year?: number } {
  const amountMatch = funding.match(/\$[\d.]+[MBK]?/i);
  const amount = amountMatch ? amountMatch[0] : '';

  const yearMatch = funding.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : undefined;

  let type = 'Other';
  if (funding.toLowerCase().includes('seed')) type = 'Seed';
  else if (funding.toLowerCase().includes('series a')) type = 'Series A';
  else if (funding.toLowerCase().includes('series b')) type = 'Series B';
  else if (funding.toLowerCase().includes('corp')) type = 'Corporate';
  else if (funding.toLowerCase().includes('grant')) type = 'Grant';
  else if (funding.toLowerCase().includes('partnership')) type = 'Partnership';

  return { amount, type, year };
}

const typeColors: Record<string, string> = {
  'Seed': 'bg-green-500',
  'Series A': 'bg-blue-500',
  'Series B': 'bg-purple-500',
  'Corporate': 'bg-gray-500',
  'Grant': 'bg-amber-500',
  'Partnership': 'bg-teal-500',
  'Other': 'bg-gray-400',
};

export const FundingTimeline = memo(function FundingTimeline({ companies }: FundingTimelineProps) {
  const fundingEvents = useMemo(() => {
    const events: FundingEvent[] = [];

    companies.forEach((company) => {
      const { amount, type, year } = parseFunding(company.funding);
      if ((amount || type !== 'Other') && year) {
        events.push({
          company: company.name,
          amount: amount || company.funding,
          type,
          year,
          color: typeColors[type] || typeColors['Other'],
        });
      }
    });

    return events.sort((a, b) => b.year - a.year).slice(0, 10);
  }, [companies]);

  const fundingByType = useMemo(() => {
    const counts: Record<string, number> = {};
    fundingEvents.forEach((event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [fundingEvents]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Funding Activity</h3>
      </div>

      {/* Funding Type Summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {fundingByType.map(([type, count]) => (
          <div
            key={type}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
          >
            <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {type}: {count}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {fundingEvents.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4 pl-8">
              <div
                className={`absolute left-2 w-5 h-5 rounded-full ${event.color} border-4 border-white dark:border-gray-800 z-10`}
              />
              <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {event.company}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{event.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${event.color}`}>
                    {event.type}
                  </span>
                  {event.amount && (
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {event.amount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Raised */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
        <div className="flex items-center gap-2 text-green-800 dark:text-green-300 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Industry Trend</span>
        </div>
        <p className="text-sm text-green-700 dark:text-green-400">
          Recent funding mentions include seed rounds, Series A, and partnerships reported in 2024-2025.
        </p>
      </div>
    </div>
  );
});

export default FundingTimeline;
