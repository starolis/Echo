import React from 'react';
import Icons from '../icons/Icons';

export default function SprintTimer({ sprintTime, setSprintTime, sprintWordGoal, setSprintWordGoal, sprintRunning, sprintTimeLeft, sprintWords, sprintText, setSprintText, formatTime, onStart, onPause, onResume, onReset }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-8 text-center border-b border-white/5 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10">
        <div className="text-7xl font-mono font-bold mb-4">
          {sprintTimeLeft > 0 ? formatTime(sprintTimeLeft) : formatTime(sprintTime * 60)}
        </div>
        <div className="flex items-center justify-center gap-8 text-sm">
          <div>
            <span className="text-slate-400">Words Written</span>
            <p className="text-2xl font-bold text-green-400">{sprintWords}</p>
          </div>
          <div>
            <span className="text-slate-400">Goal</span>
            <p className="text-2xl font-bold">{sprintWordGoal}</p>
          </div>
          <div>
            <span className="text-slate-400">Progress</span>
            <p className="text-2xl font-bold text-indigo-400">{sprintWordGoal > 0 ? Math.round((sprintWords / sprintWordGoal) * 100) : 0}%</p>
          </div>
        </div>
        <div className="mt-6 h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${Math.min((sprintWords / sprintWordGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {!sprintRunning && sprintTimeLeft === 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Duration (minutes)</label>
                <select value={sprintTime} onChange={e => setSprintTime(Number(e.target.value))} className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {[5, 10, 15, 20, 25, 30, 45, 60].map(m => (
                    <option key={m} value={m}>{m} min</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Word Goal</label>
                <select value={sprintWordGoal} onChange={e => setSprintWordGoal(Number(e.target.value))} className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {[100, 250, 500, 750, 1000, 1500, 2000].map(w => (
                    <option key={w} value={w}>{w} words</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={onStart} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20">
              <Icons.play className="w-6 h-6" /> Start Sprint
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            {sprintRunning ? (
              <button onClick={onPause} className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                <Icons.pause className="w-5 h-5" /> Pause
              </button>
            ) : (
              <button onClick={onResume} className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                <Icons.play className="w-5 h-5" /> Resume
              </button>
            )}
            <button onClick={onReset} className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
              <Icons.refresh className="w-5 h-5" /> Reset
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-white/5">
        <textarea
          value={sprintText}
          onChange={e => setSprintText(e.target.value)}
          placeholder={sprintRunning ? "Start writing! Every word counts..." : "Your sprint text will appear here..."}
          className="w-full h-64 bg-transparent text-white p-6 focus:outline-none resize-none text-lg leading-relaxed placeholder-slate-500"
          disabled={!sprintRunning && sprintTimeLeft === 0}
        />
      </div>
    </div>
  );
}
