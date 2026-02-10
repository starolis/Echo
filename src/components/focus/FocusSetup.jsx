import React from 'react';
import Icons from '../icons/Icons';

const AMBIANCES = [
  { id: 'none', label: 'None', icon: '🔇' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'fire', label: 'Fireplace', icon: '🔥' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
];

export default function FocusSetup({ focusGoal, setFocusGoal, focusAmbiance, setFocusAmbiance, focusShowStats, setFocusShowStats, focusTypewriter, setFocusTypewriter, onEnter }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Focus Mode</h1>
      <p className="text-slate-400">Enter a distraction-free writing environment with customizable ambiance.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 space-y-6">
          <h3 className="font-semibold">Session Settings</h3>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Word Goal</label>
            <select value={focusGoal} onChange={e => setFocusGoal(Number(e.target.value))} className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[250, 500, 750, 1000, 1500, 2000, 3000, 5000].map(w => (
                <option key={w} value={w}>{w} words</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Ambiance</label>
            <div className="grid grid-cols-2 gap-2">
              {AMBIANCES.map(amb => (
                <button
                  key={amb.id}
                  onClick={() => setFocusAmbiance(amb.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    focusAmbiance === amb.id
                      ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{amb.icon}</span>
                  <p className="text-sm mt-1">{amb.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
              <span>Show word count</span>
              <button onClick={() => setFocusShowStats(!focusShowStats)} className={`w-12 h-6 rounded-full transition-all ${focusShowStats ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${focusShowStats ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
              <span>Typewriter mode</span>
              <button onClick={() => setFocusTypewriter(!focusTypewriter)} className={`w-12 h-6 rounded-full transition-all ${focusTypewriter ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${focusTypewriter ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </label>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 flex flex-col">
          <h3 className="font-semibold mb-4">Ready to Focus?</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
              <Icons.focus className="w-12 h-12" />
            </div>
            <p className="text-slate-400 mb-6">
              Focus mode hides all distractions and lets you concentrate on your writing.
            </p>
            <button
              onClick={onEnter}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20"
            >
              Enter Focus Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
