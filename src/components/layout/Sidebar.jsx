import React from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';

const NAV = [
  { id: 'home', icon: Icons.home, label: 'Dashboard' },
  { id: 'editor', icon: Icons.edit, label: 'Editor' },
  { id: 'projects', icon: Icons.folder, label: 'Projects' },
  { id: 'sprints', icon: Icons.timer, label: 'Writing Sprints' },
  { id: 'focus', icon: Icons.focus, label: 'Focus Mode' },
  { id: 'calendar', icon: Icons.calendar, label: 'Calendar' },
  { id: 'assistant', icon: Icons.message, label: 'AI Assistant' },
  { id: 'analytics', icon: Icons.chart, label: 'Analytics' },
  { id: 'grader', icon: Icons.award, label: 'AI Grader' },
  { id: 'tools', icon: Icons.star, label: 'Extra Tools' },
  { id: 'settings', icon: Icons.settings, label: 'Settings' },
];

export default function Sidebar() {
  const { view, setView, sidebarOpen, setSidebarOpen, handleLogout } = useApp();

  return (
    <>
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-slate-800/50 backdrop-blur-xl border-r border-white/5 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-16 lg:pt-0`}>
        <nav className="p-4 space-y-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                view === item.id
                  ? 'bg-gradient-to-r from-white/10 to-indigo-500/10 text-white border border-white/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <hr className="border-white/5 my-4" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <Icons.logout className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}
