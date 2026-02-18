import React from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import EchoLogo from '../../shared/EchoLogo';

export default function Header() {
  const { user, setView, totalWords, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <header className="relative bg-slate-800/30 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Icons.menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <EchoLogo size={32} />
            <span className="text-lg font-semibold hidden sm:block">Echo</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
            <Icons.book className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-slate-300">{totalWords.toLocaleString()} words</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('settings')}>
            {user.profileImage ? (
              <img src={user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
