import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import ProjectForm from './ProjectForm';

export default function ProjectList({ editingProjectId, setEditingProjectId }) {
  const { user, updateUser, setView, notify } = useApp();

  const [projectTitle, setProjectTitle] = useState('');
  const [projectContent, setProjectContent] = useState('');
  const [projectStatus, setProjectStatus] = useState('Draft');
  const [showProjectForm, setShowProjectForm] = useState(false);

  const handleNewProject = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectContent('');
    setProjectStatus('Draft');
    setShowProjectForm(true);
  };

  const handleContinueProject = (p) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    setProjectContent(p.content);
    setProjectStatus(p.status || 'Draft');
    setShowProjectForm(true);
  };

  const handleSaveProject = () => {
    if (!projectTitle.trim()) { notify('Enter a title', 'error'); return; }
    const project = {
      id: editingProjectId || Date.now(),
      title: projectTitle.trim(),
      content: projectContent,
      status: projectStatus,
      createdAt: editingProjectId ? user.projects.find(p => p.id === editingProjectId)?.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    updateUser({
      projects: editingProjectId ? user.projects.map(p => p.id === editingProjectId ? project : p) : [...(user.projects || []), project]
    });
    setEditingProjectId(project.id);
    notify('Saved');
  };

  const handleDeleteProject = (id) => {
    updateUser({ projects: (user.projects || []).filter(p => p.id !== id) });
    if (editingProjectId === id) {
      setEditingProjectId(null);
      setProjectTitle('');
      setProjectContent('');
      setShowProjectForm(false);
    }
    notify('Deleted');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Projects</h1>
        <button onClick={handleNewProject} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 transition-all">
          <Icons.plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {showProjectForm && (
        <ProjectForm
          projectTitle={projectTitle}
          setProjectTitle={setProjectTitle}
          projectContent={projectContent}
          setProjectContent={setProjectContent}
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          onSave={handleSaveProject}
          onCancel={() => setShowProjectForm(false)}
        />
      )}

      {(user.projects || []).length === 0 && !showProjectForm ? (
        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
            <Icons.edit className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Create your first project to start organizing your writing. Projects help you keep your work organized and track progress.</p>
          <button onClick={handleNewProject} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
            Create Your First Project
          </button>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-sm text-slate-500 mb-4">Or try the Editor for quick writing</p>
            <button onClick={() => setView('editor')} className="text-indigo-400 hover:text-indigo-300 text-sm">
              Open Editor →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {(user.projects || []).map(p => (
            <div key={p.id} className={`bg-slate-800/30 backdrop-blur rounded-xl border p-4 transition-all ${editingProjectId === p.id ? 'border-indigo-500/50' : 'border-white/5'}`}>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{p.content}</p>
                  <p className="text-slate-500 text-xs mt-2">{p.content?.split(/\s+/).filter(w=>w).length || 0} words</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleContinueProject(p)} className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Continue</button>
                  <button onClick={() => handleDeleteProject(p.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors">
                    <Icons.trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export helper for Dashboard to use
export function useProjectActions() {
  const { user, updateUser, setView, notify } = useApp();
  const [editingProjectId, setEditingProjectId] = useState(null);

  const handleContinueProject = (p) => {
    setEditingProjectId(p.id);
    setView('projects');
  };

  const handleNewProject = () => {
    setEditingProjectId(null);
    setView('projects');
  };

  return { editingProjectId, setEditingProjectId, handleContinueProject, handleNewProject };
}
