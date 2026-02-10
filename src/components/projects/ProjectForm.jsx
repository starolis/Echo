import React from 'react';

export default function ProjectForm({ projectTitle, setProjectTitle, projectContent, setProjectContent, projectStatus, setProjectStatus, onSave, onCancel }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex flex-wrap items-center gap-4">
        <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project title" className="flex-1 min-w-[200px] bg-transparent text-lg font-semibold focus:outline-none placeholder-slate-500" />
        <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="bg-slate-700 rounded-lg px-3 py-2 text-sm">
          <option>Draft</option>
          <option>In Progress</option>
          <option>Complete</option>
        </select>
        <button onClick={onCancel} className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Cancel</button>
        <button onClick={onSave} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">Save</button>
      </div>
      <textarea value={projectContent} onChange={e => setProjectContent(e.target.value)} placeholder="Start writing..." className="w-full h-64 bg-transparent text-white p-4 focus:outline-none resize-none text-sm leading-relaxed placeholder-slate-500" />
    </div>
  );
}
