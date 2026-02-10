import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    if (loaded) save(data);
  }, [data, loaded]);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateUser = (changes) => {
    if (!user) return;
    const updated = { ...user, ...changes };
    setUser(updated);
    setData(prev => ({ ...prev, users: { ...prev.users, [user.username]: updated } }));
  };

  const getTotalWords = () =>
    user?.projects?.reduce((s, p) => s + (p.content?.split(/\s+/).filter(w => w).length || 0), 0) || 0;

  const handleLogin = (username, password) => {
    const u = data.users[username];
    if (u && u.pass === password) {
      setUser(u);
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
    setData(prev => ({ ...prev, users: { ...prev.users, [username]: newUser } }));
    setUser(newUser);
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
