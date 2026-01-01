import { BookOpen, Target, Lightbulb, Users, Building, Database, BrainCircuit, Scale, History } from 'lucide-react';
import type { TabId } from '../../types';

export function AboutTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-growth-green to-grain-gold" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-lg bg-growth-green/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-growth-green" />
            </div>
          </div>
          <div>
            <h2 className="text-heading-2 font-bold text-gray-900 dark:text-gray-100 mb-2">
              About This Dashboard
            </h2>
            <p className="text-body-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
              This dashboard tracks how farmers and grain handlers are using digital tools to check grain quality.
              Traditionally, inspectors relied solely on visual inspection. Now, advanced cameras, sensors, and AI
              are equipping these experts with new data to grade faster and with greater consistency. This dashboard
              shows what tools exist and how they support the modern grain supply chain.
            </p>
          </div>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-growth-green to-growth-green-dark rounded-xl p-8 text-white shadow-md">
          <Target className="w-10 h-10 mb-6 text-white/80" />
          <h3 className="text-heading-3 font-bold mb-4">Why This Matters</h3>
          <p className="text-body-sm leading-relaxed">
            Grain quality affects everything: what farmers get paid, how much food we can make from each bushel,
            and whether crops can be shipped overseas. By augmenting inspectors with objective digital tools,
            we ensure safer assessment, fairer prices, faster trade, and less waste.
          </p>
        </div>

        <div className="bg-gradient-to-br from-grain-gold to-grain-gold-dark rounded-xl p-8 text-white shadow-md">
          <Lightbulb className="w-10 h-10 mb-6 text-white/80" />
          <h3 className="text-heading-3 font-bold mb-4">What We Track</h3>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => onNavigate('ai-landscape')}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-medium"><strong>Companies</strong> building digital grain grading tools</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('datasets')}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-medium"><strong>Public datasets</strong> used to train AI models</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('research')}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-medium"><strong>Research</strong> on computer vision for agriculture</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('regulations')}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-medium"><strong>Government rules</strong> that allow or require digital grading</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('history')}
                className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                  <History className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-medium"><strong>History</strong> of how grain grading evolved</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-heading-3 font-bold text-gray-900 dark:text-gray-100 mb-8">How We Collect This Information</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="bg-sky-blue/10 rounded-lg p-8 mb-6 inline-block">
              <span className="text-heading-3 font-bold text-sky-blue">1</span>
            </div>
            <h4 className="text-heading-4 font-bold text-gray-900 dark:text-gray-100 mb-4">Company Research</h4>
            <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We review company websites, press releases, and industry publications to find tools currently available
              and understand what problems they solve.
            </p>
          </div>
          <div>
            <div className="bg-growth-green/10 rounded-lg p-8 mb-6 inline-block">
              <span className="text-heading-3 font-bold text-growth-green">2</span>
            </div>
            <h4 className="text-heading-4 font-bold text-gray-900 dark:text-gray-100 mb-4">Academic Papers</h4>
            <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We track peer-reviewed research on AI and computer vision applied to grain quality measurement to understand
              what's scientifically possible.
            </p>
          </div>
          <div>
            <div className="bg-grain-gold/10 rounded-lg p-8 mb-6 inline-block">
              <span className="text-heading-3 font-bold text-grain-gold">3</span>
            </div>
            <h4 className="text-heading-4 font-bold text-gray-900 dark:text-gray-100 mb-4">Government Sources</h4>
            <p className="text-body-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We monitor regulatory updates from grain inspection agencies in major grain-producing countries to track
              how rules are changing.
            </p>
          </div>
        </div>
      </div>

      {/* Context: Why Digitization Matters */}
      <div className="bg-gradient-to-r from-soil-brown to-soil-brown-dark rounded-xl p-8 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="shrink-0">
            <Users className="w-16 h-16 text-white/80" />
          </div>
          <div>
            <h3 className="text-heading-3 font-bold mb-4">Why Grain Quality Matters to Everyone</h3>
            <p className="text-body-sm leading-relaxed mb-6">
              Every day, billions of people eat food made from grain: bread, pasta, rice, tortillas, cereal, beer, and more.
              The quality of that grain determines its nutritional value, taste, color, and safety.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-body-sm">
              <div>
                <span className="font-bold block mb-2">For Farmers</span>
                Quality determines their income—good grain gets premium prices.
              </div>
              <div>
                <span className="font-bold block mb-2">For Food Companies</span>
                It determines what products they can make and their quality.
              </div>
              <div>
                <span className="font-bold block mb-2">For Consumers</span>
                It determines what's on grocery shelves and what we feed our families.
              </div>
            </div>
            <p className="text-body-sm leading-relaxed mt-6">
              Digital grading makes this whole system more transparent and fair. By combining human expertise with
              objective data, we create a grading standard that everyone can trust and verify. That means less conflict,
              fairer prices, and better food security.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}
