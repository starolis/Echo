import React, { useState } from 'react';
import { QUIZ_QUESTIONS, buildProfileFromAnswers } from '../../constants/quizQuestions';
import Icons from '../icons/Icons';

export default function WriterQuiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUIZ_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (value) => {
    if (question.type === 'multi') {
      const current = answers[question.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const canProceed = question.type === 'multi'
    ? (answers[question.id] || []).length > 0
    : !!answers[question.id];

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const profile = buildProfileFromAnswers(answers);
      onComplete({
        completedAt: new Date().toISOString(),
        answers,
        profile,
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isSelected = (value) => {
    if (question.type === 'multi') {
      return (answers[question.id] || []).includes(value);
    }
    return answers[question.id] === value;
  };

  const isLast = currentIndex === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 z-50 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
             style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-indigo-400 text-sm font-medium">{question.category}</span>
            <p className="text-slate-400 text-sm mt-1">Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</p>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white text-center mb-8">{question.question}</h2>
          {question.type === 'multi' && (
            <p className="text-slate-400 text-sm text-center mb-6">Select all that apply</p>
          )}

          {/* Options */}
          <div className="space-y-3 max-w-lg mx-auto">
            {question.options.map(opt => (
              <button key={opt.value} onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                  isSelected(opt.value)
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-${question.type === 'multi' ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 ${
                    isSelected(opt.value) ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                  }`}>
                    {isSelected(opt.value) && <Icons.check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{opt.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 max-w-lg mx-auto">
            <button onClick={handleBack} disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                currentIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'
              }`}>
              Back
            </button>
            <button onClick={handleNext} disabled={!canProceed}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}>
              {isLast ? 'Complete Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
