import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Analytics() {
  const { user, getTotalWords } = useApp();
  const totalWords = getTotalWords();

  // Bug fix #8: Both plans have analytics, no lock needed
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Analytics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Words', value: totalWords.toLocaleString() },
          { label: 'Projects', value: (user.projects || []).length },
          { label: 'Avg Words/Project', value: (user.projects || []).length ? Math.round(totalWords / user.projects.length).toLocaleString() : 0 },
          { label: 'Sessions', value: user.stats?.sessionsCompleted || 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl p-5 border border-white/5">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
