import React, { useState } from 'react';
import Icons from '../icons/Icons';

export default function FocusMode({ focusGoal, focusAmbiance, focusShowStats, focusTypewriter, onExit }) {
  // Bug fix #5: Focus text state lives here and persists while focus is open
  const [focusText, setFocusText] = useState('');

  const wordCount = focusText.split(/\s+/).filter(w => w).length;

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
        <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
          <Icons.x className="w-5 h-5" />
        </button>
        {focusShowStats && (
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span>{wordCount} / {focusGoal} words</span>
            <span>{Math.round((wordCount / focusGoal) * 100)}%</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{focusAmbiance !== 'none' ? '🎵 ' + focusAmbiance : ''}</span>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
          style={{ width: `${Math.min((wordCount / focusGoal) * 100, 100)}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <textarea
          value={focusText}
          onChange={e => setFocusText(e.target.value)}
          placeholder="Begin writing..."
          className={`w-full max-w-3xl h-full bg-transparent text-slate-200 focus:outline-none resize-none text-xl leading-relaxed placeholder-slate-600 ${focusTypewriter ? 'text-center' : ''}`}
          autoFocus
          style={{ caretColor: '#6366f1' }}
        />
      </div>

      {wordCount >= focusGoal && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/30 px-6 py-3 rounded-full flex items-center gap-3">
          <Icons.check className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">Goal reached! Keep going or exit when ready.</span>
        </div>
      )}
    </div>
  );
}
