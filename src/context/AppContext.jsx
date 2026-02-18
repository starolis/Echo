import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { save, load } from '../services/storage';
import { DEFAULT_SETTINGS } from '../constants/settings';

const AppContext = createContext(null);

const createUser = (username, name, pass) => ({
  username, name, pass,
  profileImage: null,
  genre: 'Literary Fiction',
  projects: [],
  stats: { wordsWritten: 0, sessionsCompleted: 0 },
  subscription: 'free',
  settings: { ...DEFAULT_SETTINGS },
  chatSessions: [],
  currentChatId: null,
  aiPersonality: 'helpful',
  aiCustomContext: '',
  aiUseEmojis: false,
  writingGoals: {},
  sprintHistory: [],
  sprintStreak: 0,
  quizResults: null,
  completedTasks: [],
  lastLogin: null,
  loginCount: 0,
});

const createInitialData = () => ({
  users: {
    claudia: {
      ...createUser('claudia', 'Claudia', '12345'),
      genre: 'Literary Fiction',
      subscription: 'pro',
      stats: { wordsWritten: 12450, sessionsCompleted: 34 },
      projects: [
        { id: 1, title: 'The Weight of Silence', content: 'Professor Elena Marsh had spent thirty years studying the architecture of language—how words built bridges between minds, how syntax could shelter or expose. Now, staring at the hospital ceiling, she understood that some spaces could only be filled with silence.\n\nThe stroke had taken her speech but left her mind intact, a cruel precision that felt almost personal.', createdAt: '2025-01-15', updatedAt: '2025-02-01', status: 'In Progress' },
      ],
      chatSessions: [],
      currentChatId: null,
      aiPersonality: 'helpful',
      aiCustomContext: '',
      aiUseEmojis: false,
      writingGoals: {},
      sprintHistory: [],
      sprintStreak: 0,
      quizResults: {
        completedAt: '2026-02-15T10:00:00.000Z',
        answers: {},
        profile: {
          writerType: 'Creative Storyteller',
          experience: 'Intermediate',
          preferredGenres: ['Literary Fiction', 'Mystery', 'Fantasy'],
          strengths: ['Character Development', 'Dialogue', 'Vivid Description'],
          weaknesses: ['Plotting', 'Pacing'],
          goals: ['Finish a novel', 'Improve craft', 'Build a writing habit'],
          writingHabits: { frequency: 'A few times a week', bestTime: 'Evening' },
          processStyle: 'Discovery writer',
          growthAreas: ['Experiment with new genres', 'Get feedback on work'],
          readingPreferences: ['Literary Fiction', 'Fantasy', 'Poetry'],
        },
      },
      completedTasks: [],
      lastLogin: '2026-02-17T20:30:00.000Z',
      loginCount: 12,
    },
  },
  posts: [],
});

export function AppProvider({ children }) {
  const [data, setData] = useState(createInitialData);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = load();
    if (saved) setData(saved);
    setLoaded(true);
  }, []);

  // Keep a ref to the latest data so event handlers always access current state
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    if (loaded) save(data);
  }, [data, loaded]);

  // Save on page close/reload and tab switch to prevent data loss
  useEffect(() => {
    const flush = () => save(dataRef.current);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateUser = useCallback((changes) => {
    setUser(prev => {
      if (!prev) return prev;
      if (typeof changes === 'function') {
        const resolved = changes(prev);
        const updated = { ...prev, ...resolved };
        setData(d => ({ ...d, users: { ...d.users, [prev.username]: updated } }));
        return updated;
      } else {
        const updated = { ...prev, ...changes };
        setData(d => ({ ...d, users: { ...d.users, [prev.username]: updated } }));
        return updated;
      }
    });
  }, []);

  const getTotalWords = useCallback(() =>
    user?.projects?.reduce((s, p) => s + (p.content?.split(/\s+/).filter(w => w).length || 0), 0) || 0,
  [user?.projects]);

  const handleLogin = (username, password) => {
    const u = data.users[username];
    if (u && u.pass === password) {
      const now = new Date().toISOString();
      const updated = { ...u, lastLogin: now, loginCount: (u.loginCount || 0) + 1 };
      setData(d => ({ ...d, users: { ...d.users, [username]: updated } }));
      setUser(updated);
      return true;
    }
    notify('Invalid credentials', 'error');
    return false;
  };

  const handleRegister = (username, password, name) => {
    if (!username || !password || !name) {
      notify('Please fill all fields', 'error');
      return false;
    }
    if (data.users[username]) {
      notify('Username taken', 'error');
      return false;
    }
    const newUser = createUser(username, name, password);
    const now = new Date().toISOString();
    const withLogin = { ...newUser, lastLogin: now, loginCount: 1 };
    setData(prev => ({ ...prev, users: { ...prev.users, [username]: withLogin } }));
    setUser(withLogin);
    notify('Welcome to Echo!');
    return true;
  };

  const handleLogout = () => setUser(null);

  const settings = user?.settings || DEFAULT_SETTINGS;

  const value = {
    data, user, view, setView,
    toast, notify,
    updateUser, getTotalWords,
    handleLogin, handleRegister, handleLogout,
    settings,
    sidebarOpen, setSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
