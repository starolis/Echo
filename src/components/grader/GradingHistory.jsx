import React, { useState } from 'react';
import Icons from '../icons/Icons';
import GradeResults from './GradeResults';

const gradeColor = (grade) => {
  if (!grade) return 'text-slate-400';
  const letter = String(grade).charAt(0);
  if (letter === 'A') return 'text-green-400';
  if (letter === 'B') return 'text-emerald-400';
  if (letter === 'C') return 'text-amber-400';
  return 'text-red-400';
};

export default function GradingHistory({ history, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-8 text-center">
        <Icons.award className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400">No grading history yet.</p>
        <p className="text-slate-500 text-sm mt-1">Grade some writing and it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...history].reverse().map(entry => (
        <div key={entry.id} className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{entry.rubricName}</span>
                <span className="text-xs text-slate-500">
                  {new Date(entry.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{entry.textSnippet}</p>
            </div>
            <div className="flex items-center gap-3 ml-3">
              {entry.overallGrade && (
                <span className={`text-lg font-bold ${gradeColor(entry.overallGrade)}`}>{entry.overallGrade}</span>
              )}
              {entry.overallScore != null && !entry.overallGrade && (
                <span className="text-lg font-bold text-indigo-400">{entry.overallScore}/4</span>
              )}
              <Icons.chevronRight className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === entry.id ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {expandedId === entry.id && (
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
              <GradeResults
                results={entry.results}
                feedbackFormat={entry.feedbackFormat}
                onNewGrade={() => setExpandedId(null)}
              />
              <button
                onClick={() => onDelete(entry.id)}
                className="mt-3 w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                Delete this grade
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
