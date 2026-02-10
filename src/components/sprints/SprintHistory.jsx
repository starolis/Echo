import React from 'react';
import Icons from '../icons/Icons';

export default function SprintHistory({ sprintHistory }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Icons.award className="w-5 h-5 text-yellow-400" /> Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <span className="text-slate-400">Total Sprints</span>
            <span className="font-bold">{sprintHistory.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <span className="text-slate-400">Completed</span>
            <span className="font-bold text-green-400">{sprintHistory.filter(s => s.completed).length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <span className="text-slate-400">Total Words</span>
            <span className="font-bold">{sprintHistory.reduce((s, h) => s + h.wordsWritten, 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
            <span className="text-slate-400">Best Sprint</span>
            <span className="font-bold text-indigo-400">{sprintHistory.length > 0 ? Math.max(...sprintHistory.map(s => s.wordsWritten)) : 0} words</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
        <h3 className="font-semibold mb-4">Recent Sprints</h3>
        {sprintHistory.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No sprints yet. Start your first one!</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...sprintHistory].reverse().slice(0, 10).map(sprint => (
              <div key={sprint.id} className={`p-3 rounded-xl ${sprint.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{sprint.wordsWritten} words</span>
                  {sprint.completed && <Icons.check className="w-4 h-4 text-green-400" />}
                </div>
                <p className="text-xs text-slate-400">{sprint.duration} min • {new Date(sprint.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
