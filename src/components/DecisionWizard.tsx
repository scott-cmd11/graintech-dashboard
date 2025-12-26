import React, { memo, useState, useCallback } from 'react';
import { Wand2, ChevronRight, ChevronLeft, Check, RotateCcw } from 'lucide-react';
import type { Company } from '../types';

interface DecisionWizardProps {
  companies: Company[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (company: Company) => void;
}

interface Question {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    filter: (company: Company) => boolean;
  }[];
}

const questions: Question[] = [
  {
    id: 'budget',
    question: 'What is your budget range?',
    options: [
      {
        label: 'Low cost (< $2,000)',
        value: 'low',
        filter: (c) => c.type === 'Mobile' || c.funding.includes('Self-funded'),
      },
      {
        label: 'Medium ($2,000 - $20,000)',
        value: 'medium',
        filter: (c) => c.type === 'Benchtop' || c.type === 'Handheld Light Sensor',
      },
      {
        label: 'High (> $20,000)',
        value: 'high',
        filter: (c) => c.type.includes('In-line') || c.funding.includes('Corp'),
      },
    ],
  },
  {
    id: 'portability',
    question: 'Do you need portability?',
    options: [
      {
        label: 'Yes, must be portable/mobile',
        value: 'portable',
        filter: (c) => c.type === 'Mobile' || c.type === 'Handheld Light Sensor' || c.type === 'Mobile + Device',
      },
      {
        label: 'Lab/stationary is fine',
        value: 'stationary',
        filter: (c) => c.type === 'Benchtop' || c.type.includes('In-line'),
      },
      {
        label: 'No preference',
        value: 'any',
        filter: () => true,
      },
    ],
  },
  {
    id: 'speed',
    question: 'How important is analysis speed?',
    options: [
      {
        label: 'Real-time is essential',
        value: 'realtime',
        filter: (c) => c.speed.toLowerCase().includes('real-time') || c.speed.toLowerCase().includes('seconds'),
      },
      {
        label: 'Under 1 minute is acceptable',
        value: 'fast',
        filter: (c) => c.speed.includes('sec') || c.speed.includes('min'),
      },
      {
        label: 'Speed is not critical',
        value: 'any',
        filter: () => true,
      },
    ],
  },
  {
    id: 'crops',
    question: 'What crops do you primarily work with?',
    options: [
      {
        label: 'Wheat & Barley',
        value: 'wheat',
        filter: (c) => c.crops.some((crop) => crop.toLowerCase().includes('wheat') || crop.toLowerCase().includes('barley')),
      },
      {
        label: 'Rice',
        value: 'rice',
        filter: (c) => c.crops.some((crop) => crop.toLowerCase().includes('rice')),
      },
      {
        label: 'Corn/Maize',
        value: 'corn',
        filter: (c) => c.crops.some((crop) => crop.toLowerCase().includes('corn') || crop.toLowerCase().includes('maize')),
      },
      {
        label: 'Pulses/Legumes',
        value: 'pulses',
        filter: (c) => c.crops.some((crop) => crop.toLowerCase().includes('lentil') || crop.toLowerCase().includes('chickpea') || crop.toLowerCase().includes('pulse')),
      },
    ],
  },
  {
    id: 'measurement',
    question: 'What do you need to measure?',
    options: [
      {
        label: 'Visual defects & grading',
        value: 'visual',
        filter: (c) => c.tech.toLowerCase().includes('camera') || c.tech.toLowerCase().includes('vision'),
      },
      {
        label: 'Protein & moisture content',
        value: 'composition',
        filter: (c) => c.tech.toLowerCase().includes('nir') || c.tech.toLowerCase().includes('light sensor') || c.tech.toLowerCase().includes('spectral'),
      },
      {
        label: 'Both visual and composition',
        value: 'both',
        filter: (c) => (c.tech.toLowerCase().includes('camera') && c.tech.toLowerCase().includes('sensor')) || c.tech.toLowerCase().includes('light'),
      },
    ],
  },
];

export const DecisionWizard = memo(function DecisionWizard({
  companies,
  isOpen,
  onClose,
  onSelectCompany,
}: DecisionWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
  }, []);

  // Filter companies based on answers
  const filteredCompanies = companies.filter((company) => {
    return Object.entries(answers).every(([questionId, answerValue]) => {
      const question = questions.find((q) => q.id === questionId);
      const option = question?.options.find((o) => o.value === answerValue);
      return option ? option.filter(company) : true;
    });
  });

  const isComplete = Object.keys(answers).length === questions.length;
  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion?.id];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Find Your Solution</h2>
              <p className="text-gray-600 dark:text-gray-400">Answer a few questions to find the best match</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {questions.length}</span>
              <span>{filteredCompanies.length} matches</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {!isComplete ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        currentAnswer === option.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                        {currentAnswer === option.value && (
                          <Check className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Your Top Matches ({filteredCompanies.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredCompanies.slice(0, 5).map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        onSelectCompany(company);
                        onClose();
                      }}
                      className="w-full p-4 text-left rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100">{company.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{company.product}</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{company.tech}</p>
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          {company.type}
                        </span>
                      </div>
                    </button>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No exact matches found. Try adjusting your criteria.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default DecisionWizard;
