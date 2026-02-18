import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { generateTasks } from '../../services/taskGenerator';

const DIFFICULTY_STYLES = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400',
  hard: 'bg-red-500/20 text-red-400',
};

export default function Dashboard({ onContinueProject, onNewProject }) {
  const { user, setView, updateUser, getTotalWords } = useApp();
  const [taskPage, setTaskPage] = useState(0);
  const totalWords = getTotalWords();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Words', value: totalWords.toLocaleString() },
          { label: 'Projects', value: (user.projects || []).length },
          { label: 'Sessions', value: user.stats?.sessionsCompleted || 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl p-5 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold">Recent Projects</h2>
          <button onClick={() => { onNewProject(); setView('projects'); }} className="text-sm text-indigo-400 hover:text-indigo-300">New Project</button>
        </div>
        <div className="divide-y divide-white/5">
          {(user.projects || []).slice(0, 3).map(p => (
            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.title}</p>
                <p className="text-slate-400 text-sm">{p.content?.split(/\s+/).filter(w=>w).length || 0} words</p>
              </div>
              <button onClick={() => onContinueProject(p)} className="ml-4 text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Continue</button>
            </div>
          ))}
          {(!user.projects || user.projects.length === 0) && (
            <div className="p-8 text-center text-slate-500">No projects yet</div>
          )}
        </div>
      </div>

      {/* Personalized Tasks */}
      {user.quizResults?.profile && (() => {
        const tasks = generateTasks(user.quizResults.profile, user.completedTasks || []);
        const TASKS_PER_PAGE = 3;
        const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
        const visible = tasks.slice(taskPage * TASKS_PER_PAGE, (taskPage + 1) * TASKS_PER_PAGE);

        const handleComplete = (title) => {
          updateUser({ completedTasks: [...(user.completedTasks || []), title] });
        };

        return (
          <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold">Suggested for You</h2>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setTaskPage(p => Math.max(0, p - 1))} disabled={taskPage === 0}
                    className={`p-1 rounded ${taskPage === 0 ? 'text-slate-600' : 'text-slate-400 hover:text-white'}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <span className="text-xs text-slate-500">{taskPage + 1}/{totalPages}</span>
                  <button onClick={() => setTaskPage(p => Math.min(totalPages - 1, p + 1))} disabled={taskPage >= totalPages - 1}
                    className={`p-1 rounded ${taskPage >= totalPages - 1 ? 'text-slate-600' : 'text-slate-400 hover:text-white'}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </div>
            <div className="divide-y divide-white/5">
              {visible.map((task, i) => (
                <div key={task.title} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{task.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${DIFFICULTY_STYLES[task.difficulty]}`}>{task.difficulty}</span>
                    </div>
                    <p className="text-sm text-slate-400">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setView(task.view)} className="text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-1.5 rounded-lg transition-colors">Go</button>
                    <button onClick={() => handleComplete(task.title)} className="text-sm bg-white/5 hover:bg-white/10 text-slate-400 px-3 py-1.5 rounded-lg transition-colors">Done</button>
                  </div>
                </div>
              ))}
              {visible.length === 0 && (
                <div className="p-8 text-center text-slate-500">All tasks completed! Great work.</div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Icons.edit, title: 'Editor', desc: 'Write and improve with AI', view: 'editor' },
          { icon: Icons.message, title: 'AI Assistant', desc: 'Get personalized help', view: 'assistant' },
        ].map((item, i) => (
          <button key={i} onClick={() => setView(item.view)} className="bg-slate-800/30 backdrop-blur hover:bg-slate-800/50 rounded-xl p-5 border border-white/5 text-left transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
              <item.icon className="w-6 h-6" />
            </div>
            <p className="font-semibold text-lg">{item.title}</p>
            <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
