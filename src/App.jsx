import React, { useState, useEffect } from 'react';
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
import ExtraToolsPage from './components/tools/ExtraToolsPage';
import Settings from './components/settings/Settings';
import WriterQuiz from './components/quiz/WriterQuiz';
import AdminStatsOverlay from './components/admin/AdminStatsOverlay';
import AIGrader from './components/grader/AIGrader';

function AppContent() {
  const { data, user, view, setView, settings, updateUser } = useApp();

  const themeClass = settings.theme === 'light' ? 'theme-light' : '';
  const fontSizeClass = settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base';
  const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : settings.fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  // Project state shared between dashboard and projects view
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [focusGoal, setFocusGoal] = useState(1000);
  const [focusAmbiance, setFocusAmbiance] = useState('none');
  const [focusShowStats, setFocusShowStats] = useState(true);
  const [focusTypewriter, setFocusTypewriter] = useState(false);

  // Admin stats overlay state
  const [showAdminStats, setShowAdminStats] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '4' && user?.username === 'claudia') {
        e.preventDefault();
        setShowAdminStats(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user?.username]);

  if (!user) return <AuthScreen />;

  // Quiz gate: show quiz for users who haven't completed or skipped it
  if (!user.quizResults && !user.quizSkipped) {
    return (
      <WriterQuiz
        onComplete={(results) => updateUser({ quizResults: results })}
        onSkip={() => updateUser({ quizSkipped: true })}
      />
    );
  }

  const handleContinueProject = (p) => {
    setEditingProjectId(p.id);
    setView('projects');
  };

  const handleNewProject = () => {
    setEditingProjectId(null);
  };

  return (
    <div className={`min-h-screen ${fontSizeClass} ${fontFamilyClass} ${themeClass} ${settings.theme === 'light' ? 'bg-gray-50 text-slate-900' : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white'}`}>
      {/* Background effects */}
      {settings.theme !== 'light' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>
      )}

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
          {view === 'grader' && <AIGrader />}
          {view === 'tools' && <ExtraToolsPage />}
          {view === 'settings' && <Settings />}
        </main>
      </div>

      {showAdminStats && (
        <AdminStatsOverlay users={data.users} onClose={() => setShowAdminStats(false)} />
      )}
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
