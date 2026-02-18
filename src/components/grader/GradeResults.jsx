import React from 'react';
import Icons from '../icons/Icons';

const gradeColor = (grade) => {
  if (!grade) return 'text-slate-400';
  const letter = grade.charAt(0);
  if (letter === 'A') return 'text-green-400';
  if (letter === 'B') return 'text-emerald-400';
  if (letter === 'C') return 'text-amber-400';
  return 'text-red-400';
};

const gradeBg = (grade) => {
  if (!grade) return 'bg-slate-500/20';
  const letter = grade.charAt(0);
  if (letter === 'A') return 'bg-green-500/20 border-green-500/30';
  if (letter === 'B') return 'bg-emerald-500/20 border-emerald-500/30';
  if (letter === 'C') return 'bg-amber-500/20 border-amber-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

const rubricLabel = (score) => {
  if (score >= 4) return { text: 'Advanced', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (score >= 3) return { text: 'Proficient', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (score >= 2) return { text: 'Developing', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  return { text: 'Beginning', color: 'text-red-400', bg: 'bg-red-500/20' };
};

function ReportCard({ results }) {
  return (
    <div className="space-y-4">
      <div className={`text-center p-6 rounded-2xl border ${gradeBg(results.overallGrade)}`}>
        <p className="text-sm text-slate-400 mb-1">Overall Grade</p>
        <p className={`text-5xl font-bold ${gradeColor(results.overallGrade)}`}>{results.overallGrade}</p>
        {results.overallScore != null && <p className="text-slate-400 mt-1">{results.overallScore}%</p>}
      </div>
      <div className="space-y-2">
        {(results.categories || []).map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sm">{cat.name}</span>
            <div className="flex items-center gap-2">
              {cat.score != null && <span className="text-xs text-slate-500">{cat.score}%</span>}
              <span className={`font-bold ${gradeColor(cat.grade)}`}>{cat.grade}</span>
            </div>
          </div>
        ))}
      </div>
      {(results.categories || []).some(c => c.feedback) && (
        <div className="space-y-2 pt-2">
          {results.categories.filter(c => c.feedback).map((cat, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-medium mb-1">{cat.name}</p>
              <p className="text-sm text-slate-400">{cat.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WrittenFeedback({ results }) {
  return (
    <div className="space-y-4">
      {(results.categories || []).map((cat, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-xl">
          <h4 className="font-medium mb-2">{cat.name}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{cat.feedback}</p>
        </div>
      ))}
      {results.summary && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-sm text-slate-300 leading-relaxed italic">{results.summary}</p>
        </div>
      )}
    </div>
  );
}

function RubricTable({ results }) {
  return (
    <div className="space-y-4">
      {results.overallScore != null && (
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <p className="text-sm text-slate-400 mb-1">Overall Score</p>
          <p className={`text-3xl font-bold ${rubricLabel(results.overallScore).color}`}>
            {results.overallScore.toFixed ? results.overallScore.toFixed(1) : results.overallScore} / 4
          </p>
        </div>
      )}
      <div className="space-y-2">
        {(results.categories || []).map((cat, i) => {
          const label = rubricLabel(cat.rubricScore);
          return (
            <div key={i} className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${label.bg} ${label.color}`}>
                    {label.text}
                  </span>
                  <span className="font-bold text-sm">{cat.rubricScore}/4</span>
                </div>
              </div>
              {cat.feedback && <p className="text-xs text-slate-400 mt-1">{cat.feedback}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GradeResults({ results, feedbackFormat, onNewGrade }) {
  return (
    <div className="space-y-4">
      {feedbackFormat === 'written' && <WrittenFeedback results={results} />}
      {feedbackFormat === 'rubric-table' && <RubricTable results={results} />}
      {feedbackFormat !== 'written' && feedbackFormat !== 'rubric-table' && <ReportCard results={results} />}

      {(results.strengths?.length > 0 || results.improvements?.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {results.strengths?.length > 0 && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                <Icons.check className="w-4 h-4" /> Strengths
              </p>
              <ul className="space-y-1">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {results.improvements?.length > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-1">
                <Icons.zap className="w-4 h-4" /> To Improve
              </p>
              <ul className="space-y-1">
                {results.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onNewGrade}
        className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all text-sm"
      >
        Grade Another
      </button>
    </div>
  );
}
