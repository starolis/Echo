import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/layout/Toast';
import Dashboard from './components/dashboard/Dashboard';
import Editor from './components/editor/Editor';
import ProjectList from './components/projects/ProjectList';
import AIChatPage from './components/assistant/AIChatPage';
import SprintsPage from './components/sprints/SprintsPage';
import FocusSetup from './components/focus/FocusSetup';
import FocusMode from './components/focus/FocusMode';
import CalendarPage from './components/calendar/CalendarPage';
import Analytics from './components/analytics/Analytics';
import Settings from './components/settings/Settings';

function AppContent() {
  const { user, view, setView } = useApp();

  // Project state shared between dashboard and projects view
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [focusGoal, setFocusGoal] = useState(1000);
  const [focusAmbiance, setFocusAmbiance] = useState('none');
  const [focusShowStats, setFocusShowStats] = useState(true);
  const [focusTypewriter, setFocusTypewriter] = useState(false);

  if (!user) return <AuthScreen />;

  const handleContinueProject = (p) => {
    setEditingProjectId(p.id);
    setView('projects');
  };

  const handleNewProject = () => {
    setEditingProjectId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <Header />

      <div className="relative flex">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {view === 'home' && (
            <Dashboard
              onContinueProject={handleContinueProject}
              onNewProject={handleNewProject}
            />
          )}
          {view === 'editor' && <Editor />}
          {view === 'projects' && (
            <ProjectList
              editingProjectId={editingProjectId}
              setEditingProjectId={setEditingProjectId}
            />
          )}
          {view === 'assistant' && <AIChatPage />}
          {view === 'sprints' && <SprintsPage />}
          {view === 'focus' && !focusMode && (
            <FocusSetup
              focusGoal={focusGoal}
              setFocusGoal={setFocusGoal}
              focusAmbiance={focusAmbiance}
              setFocusAmbiance={setFocusAmbiance}
              focusShowStats={focusShowStats}
              setFocusShowStats={setFocusShowStats}
              focusTypewriter={focusTypewriter}
              setFocusTypewriter={setFocusTypewriter}
              onEnter={() => setFocusMode(true)}
            />
          )}
          {view === 'focus' && focusMode && (
            <FocusMode
              focusGoal={focusGoal}
              focusAmbiance={focusAmbiance}
              focusShowStats={focusShowStats}
              focusTypewriter={focusTypewriter}
              onExit={() => setFocusMode(false)}
            />
          )}
          {view === 'calendar' && <CalendarPage />}
          {view === 'analytics' && <Analytics />}
          {view === 'settings' && <Settings />}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
