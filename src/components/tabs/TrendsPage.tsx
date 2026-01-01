import { TrendingUp, Globe, Zap, BarChart3, Users, Lightbulb, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import {
  adoptionTrends,
  regionalData,
  sensingTechTrends,
  companyMilestones,
  useCaseAdoption,
  emergingTechnologies,
  marketProjections,
  futureOutlook,
} from '../../data/trends';

export function TrendsPage() {
  // Calculate colors for charts
  const colors = ['#D4A440', '#4A7C35', '#6B4423', '#5B8AA6', '#A84432'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Market Trends and Outlook
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analysis of grain quality technology adoption, market evolution, and future opportunities
        </p>
      </div>

      {/* 1. Technology Adoption Trends */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-grain-gold" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Technology Adoption Trends</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Market shift from benchtop lab systems to mobile and inline grading solutions (2018-2025)
        </p>

        {/* Adoption Chart */}
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-4 pb-4" style={{ minWidth: '600px' }}>
            {adoptionTrends.map((trend) => (
              <div key={trend.year} className="flex-1 text-center">
                <div className="relative h-64 mb-2 flex items-flex-end gap-1 justify-center">
                  {/* Benchtop bar */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-6 rounded-t"
                      style={{
                        height: `${(trend.benchtop / 70) * 200}px`,
                        backgroundColor: colors[0],
                      }}
                    />
                  </div>
                  {/* Mobile bar */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-6 rounded-t"
                      style={{
                        height: `${(trend.mobile / 70) * 200}px`,
                        backgroundColor: colors[1],
                      }}
                    />
                  </div>
                  {/* Inline bar */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-6 rounded-t"
                      style={{
                        height: `${(trend.inline / 70) * 200}px`,
                        backgroundColor: colors[2],
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{trend.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[0] }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Benchtop Lab Systems</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[1] }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Mobile/Handheld</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[2] }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Inline Industrial</span>
          </div>
        </div>
      </section>

      {/* 2. Regional Market Expansion */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-sky-blue" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Regional Market Expansion</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Global distribution of grain technology companies and regional adoption rates
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {regionalData.map((region) => (
            <div
              key={region.region}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{region.region}</h4>
                <span className="text-xs font-bold px-2 py-1 rounded bg-growth-green/10 text-growth-green">
                  +{region.growth}% YoY
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Companies</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{region.companies}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Adoption Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{region.adoption}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-sky-blue rounded-full h-2"
                      style={{ width: `${region.adoption}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Market Share</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{region.marketShare}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Sensing Technology Evolution */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-grain-gold" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sensing Technology Evolution</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Adoption and maturity levels of different sensing technologies in grain quality assessment
        </p>

        <div className="space-y-4">
          {sensingTechTrends
            .sort((a, b) => b.adoption - a.adoption)
            .map((tech) => (
              <div key={tech.technology}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tech.technology}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {tech.yearsInMarket} years • {tech.maturity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{tech.adoption}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`rounded-full h-3 transition-all ${tech.maturity === 'Mature'
                      ? 'bg-growth-green'
                      : tech.maturity === 'Commercial'
                        ? 'bg-sky-blue'
                        : tech.maturity === 'Pilot'
                          ? 'bg-grain-gold'
                          : 'bg-soil-brown'
                      }`}
                    style={{ width: `${tech.adoption}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 4. Market Size & Investment Trends */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-soil-brown" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Market Size & Growth Projections</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Estimated grain technology market size (in millions USD) with 15%+ compound annual growth
        </p>

        <div className="overflow-x-auto">
          <div className="flex gap-3 pb-4" style={{ minWidth: '600px' }}>
            {marketProjections.map((proj) => (
              <div key={proj.year} className="flex-1 text-center">
                <div className="relative h-48 mb-2 flex items-flex-end justify-center">
                  <div
                    className="w-8 rounded-t"
                    style={{
                      height: `${(proj.marketSize / 415) * 180}px`,
                      backgroundColor: colors[2],
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">${proj.marketSize}M</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{proj.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citations for Market Chart */}
        <div className="mb-6 flex flex-wrap gap-4">
          {marketProjections
            .filter(p => p.citations && p.citations.length > 0)
            .map(p => (
              <div key={p.year} className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <span className="font-semibold">{p.year} Projection:</span>
                {p.citations?.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1">
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            ))
          }
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-growth-green mb-1">15-16%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Annual Growth Rate</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-sky-blue mb-1">$415M</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">2027 Projected Market</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-grain-gold mb-1">2.8x</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Growth since 2020</div>
          </div>
        </div>
      </section>

      {/* 5. Company Growth Timeline */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-growth-green" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Company Growth Timeline</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Key company milestones and market developments
        </p>

        <div className="space-y-4">
          {companyMilestones
            .sort((a, b) => a.year - b.year)
            .map((milestone, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-grain-gold border-2 border-white dark:border-gray-800" />
                  {idx < companyMilestones.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{milestone.company}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.event}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${milestone.type === 'Founding'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : milestone.type === 'Product Launch'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : milestone.type === 'Funding'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}
                    >
                      {milestone.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{milestone.year}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 6. Use Case Adoption */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Use Case Adoption Trends</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Fastest-growing applications for grain quality technology
        </p>

        <div className="space-y-4">
          {useCaseAdoption
            .sort((a, b) => b.growth - a.growth)
            .map((useCase) => (
              <div key={useCase.useCase}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{useCase.useCase}</h4>
                  <span className="text-xs text-growth-green font-bold">+{useCase.growth}%</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-growth-green rounded-full h-2"
                        style={{ width: `${useCase.adoption}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">{useCase.adoption}%</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 7. Emerging Technologies */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-sky-blue" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Emerging Technologies</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Cutting-edge technologies that will shape the future of grain quality assessment
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {emergingTechnologies.map((tech) => (
            <div
              key={tech.name}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{tech.name}</h4>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${tech.maturityLevel === 'Commercial'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : tech.maturityLevel === 'Pilot'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {tech.maturityLevel}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{tech.description}</p>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Readiness</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{tech.readinessPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-sky-blue rounded-full h-2"
                    style={{ width: `${tech.readinessPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Applications:</span>
                  <ul className="flex flex-wrap gap-1 mt-1">
                    {tech.applications.slice(0, 2).map((app) => (
                      <li key={app} className="text-gray-600 dark:text-gray-400">
                        • {app}
                      </li>
                    ))}
                    {tech.applications.length > 2 && (
                      <li className="text-gray-600 dark:text-gray-400">• +{tech.applications.length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>

              {tech.expectedCommercialDate && (
                <p className="text-xs text-grain-gold font-semibold mt-3">
                  Expected commercial: {tech.expectedCommercialDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Future Outlook */}
      <section className="space-y-6">
        {/* Next 3 Years */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Next 3 Years: Key Predictions
          </h3>
          <ul className="space-y-3">
            {futureOutlook.nextThreeYears.map((prediction, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-growth-green flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{prediction}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Areas to Watch */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Key Areas to Watch
          </h3>
          <ul className="space-y-3">
            {futureOutlook.keyAreasToWatch.map((area, idx) => (
              <li key={idx} className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-sky-blue flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Potential Risks
          </h3>
          <ul className="space-y-2">
            {futureOutlook.risks.map((risk, idx) => (
              <li key={idx} className="text-sm text-amber-800 dark:text-amber-200">
                • {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Market Opportunities
          </h3>
          <ul className="space-y-2">
            {futureOutlook.opportunities.map((opp, idx) => (
              <li key={idx} className="text-sm text-green-800 dark:text-green-200">
                • {opp}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default TrendsPage;
