import React from 'react';
import Icons from '../icons/Icons';

export default function GoalModal({ selectedDate, goalForm, setGoalForm, onSave, onClose }) {
  if (!selectedDate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Set Writing Goal</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <Icons.x className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400">
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Goal Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setGoalForm(prev => ({ ...prev, type: 'words' }))} className={`p-3 rounded-xl text-center transition-all ${goalForm.type === 'words' ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                <Icons.edit className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Words</span>
              </button>
              <button onClick={() => setGoalForm(prev => ({ ...prev, type: 'time' }))} className={`p-3 rounded-xl text-center transition-all ${goalForm.type === 'time' ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                <Icons.clock className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Time</span>
              </button>
              <button onClick={() => setGoalForm(prev => ({ ...prev, type: 'custom' }))} className={`p-3 rounded-xl text-center transition-all ${goalForm.type === 'custom' ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/10'}`}>
                <Icons.star className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Custom</span>
              </button>
            </div>
          </div>

          {goalForm.type === 'custom' ? (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Describe your goal</label>
              <input
                type="text"
                value={goalForm.description || ''}
                onChange={e => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g. Finish chapter 3, Write a poem about nature..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Target ({goalForm.type === 'words' ? 'words' : 'minutes'})
              </label>
              <input type="number" min="1" value={goalForm.target} onChange={e => setGoalForm(prev => ({ ...prev, target: Math.max(1, Number(e.target.value) || 1) }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-2">Scheduled Time (optional)</label>
            <input type="time" value={goalForm.time} onChange={e => setGoalForm(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes (optional)</label>
            <textarea
              value={goalForm.notes || ''}
              onChange={e => setGoalForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any extra details or reminders..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm resize-none placeholder-slate-500"
            />
          </div>

          <button onClick={onSave} className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30">
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}
