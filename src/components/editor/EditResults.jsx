import React from 'react';
import Icons from '../icons/Icons';

export default function EditResults({ editResult, highlightedChangeIdx, setHighlightedChangeIdx, onAccept, onDismiss }) {
  if (!editResult) return null;

  if (editResult.error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
        <p className="text-red-400">{editResult.feedback}</p>
        <button onClick={onDismiss} className="mt-2 text-sm text-slate-400 hover:text-white">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-gradient-to-r from-green-600/10 to-emerald-600/10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-green-400 flex items-center gap-2">
              <Icons.check className="w-5 h-5" /> Edit Complete
            </h3>
            <p className="text-sm text-slate-300 mt-1">{editResult.feedback}</p>
          </div>
          {editResult.stats && (
            <div className="text-right text-sm">
              <p className="text-slate-400">{editResult.stats.wordsBefore} → {editResult.stats.wordsAfter} words</p>
              <p className="text-indigo-400">{editResult.stats.changesCount || editResult.changes?.length || 0} changes</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        <div className="p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Changes Made</h4>
          {editResult.changes && editResult.changes.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {editResult.changes.map((change, i) => (
                <button
                  key={i}
                  onClick={() => setHighlightedChangeIdx(highlightedChangeIdx === i ? null : i)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    highlightedChangeIdx === i
                      ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/50 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-red-400/80 line-through text-sm flex-1">{change.original}</span>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <span className="text-green-400 text-sm flex-1">{change.revised}</span>
                  </div>
                  {change.reason && (
                    <p className="text-xs text-slate-500 mt-2 italic">{change.reason}</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No specific changes tracked</p>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Improved Version</h4>
          <div className="bg-slate-900/50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {highlightedChangeIdx !== null && editResult.changes[highlightedChangeIdx] ? (
                editResult.result.split(editResult.changes[highlightedChangeIdx].revised).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <mark className="bg-indigo-500/30 text-indigo-200 px-1 rounded">
                        {editResult.changes[highlightedChangeIdx].revised}
                      </mark>
                    )}
                  </React.Fragment>
                ))
              ) : (
                editResult.result
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 flex gap-3">
        <button
          onClick={onAccept}
          className="flex-1 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800"
        >
          <Icons.check className="w-5 h-5" /> Accept Changes
        </button>
        <button
          onClick={onDismiss}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2"
        >
          <Icons.x className="w-5 h-5" /> Dismiss
        </button>
      </div>
    </div>
  );
}
