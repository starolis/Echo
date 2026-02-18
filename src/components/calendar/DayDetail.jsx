import React from 'react';
import Icons from '../icons/Icons';

export default function DayDetail({ selectedDate, writingGoals, onToggleComplete, onSetGoal }) {
  const getDateKey = (date) => date.toISOString().split('T')[0];

  if (!selectedDate) {
    return (
      <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 text-center">
        <Icons.calendar className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400">Select a day to view or set a writing goal.</p>
      </div>
    );
  }

  const dateKey = getDateKey(selectedDate);
  const goal = writingGoals[dateKey];

  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6">
      <h3 className="font-semibold mb-4">
        {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h3>

      {goal ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${goal.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{goal.type === 'custom' ? 'Custom Goal' : goal.type === 'words' ? 'Word Goal' : 'Time Goal'}</span>
              {goal.completed ? (
                <span className="text-green-400 text-sm flex items-center gap-1"><Icons.check className="w-4 h-4" /> Done</span>
              ) : (
                <span className="text-amber-400 text-sm">Pending</span>
              )}
            </div>
            {goal.type === 'custom' ? (
              <p className="text-lg font-bold">{goal.description || 'Custom goal'}</p>
            ) : (
              <p className="text-2xl font-bold">{goal.target} {goal.type === 'words' ? 'words' : 'minutes'}</p>
            )}
            {goal.time && <p className="text-sm text-slate-400 mt-1">Scheduled: {goal.time}</p>}
            {goal.notes && <p className="text-sm text-slate-400 mt-2 italic">{goal.notes}</p>}
          </div>
          <button
            onClick={() => onToggleComplete(dateKey)}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              goal.completed ? 'bg-slate-700 hover:bg-slate-600' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-slate-400">No goal set for this day.</p>
          <button
            onClick={onSetGoal}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30"
          >
            Set a Goal
          </button>
        </div>
      )}
    </div>
  );
}
