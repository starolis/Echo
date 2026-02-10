import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EchoLogo from '../../shared/EchoLogo';

export default function AuthScreen() {
  const { handleLogin, handleRegister } = useApp();
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', name: '' });

  const onSubmit = () => {
    if (authMode === 'login') {
      handleLogin(form.username, form.password);
    } else {
      if (handleRegister(form.username, form.password, form.name)) {
        setForm({ username: '', password: '', name: '' });
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative bg-slate-800/60 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <EchoLogo size={52} />
          <span className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Echo</span>
        </div>
        <p className="text-center text-slate-400 text-sm mb-8">AI-Powered Writing Assistant</p>

        <div className="flex mb-6 bg-slate-900/50 rounded-xl p-1">
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setAuthMode(m)} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${authMode === m ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} onKeyDown={onKeyDown} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Username" />
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={onKeyDown} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Password" />
          {authMode === 'register' && (
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} onKeyDown={onKeyDown} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Display Name" />
          )}
          <button onClick={onSubmit} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
            {authMode === 'login' ? 'Sign In' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}
