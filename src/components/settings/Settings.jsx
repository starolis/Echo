import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { GENRES } from '../../constants/plans';
import { DEFAULT_SETTINGS, SETTING_OPTIONS } from '../../constants/settings';

export default function Settings() {
  const { user, updateUser, notify, settings } = useApp();
  const fileInputRef = useRef(null);

  const handleSettingChange = (key, value) => updateUser({ settings: { ...(user.settings || DEFAULT_SETTINGS), [key]: value } });
  const handleGenreChange = (genre) => { updateUser({ genre }); notify('Genre updated'); };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { updateUser({ profileImage: reader.result }); notify('Profile updated'); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Profile */}
      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.profileImage ? (
              <img src={user.profileImage} alt="" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 p-2 rounded-full transition-colors border-2 border-slate-900">
              <Icons.camera className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-slate-400">@{user.username}</p>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm text-slate-400 mb-2">Writing Genre</label>
          <select value={user.genre || 'Literary Fiction'} onChange={e => handleGenreChange(e.target.value)} className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 w-full max-w-xs">
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
        <h2 className="font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          {[{ key: 'theme', label: 'Theme' }, { key: 'fontSize', label: 'Font Size' }, { key: 'fontFamily', label: 'Font' }].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <select value={settings[key] || DEFAULT_SETTINGS[key]} onChange={e => handleSettingChange(key, e.target.value)} className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {SETTING_OPTIONS[key]?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* AI */}
      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
        <h2 className="font-semibold mb-4">AI Assistant</h2>
        <div className="space-y-4">
          {[{ key: 'aiTone', label: 'Tone' }, { key: 'aiVerbosity', label: 'Response Length' }].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <select value={settings[key] || DEFAULT_SETTINGS[key]} onChange={e => handleSettingChange(key, e.target.value)} className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {SETTING_OPTIONS[key]?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          {[{ key: 'autoSave', label: 'Auto-Save' }, { key: 'spellCheck', label: 'Spell Check' }].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <button onClick={() => handleSettingChange(key, !(settings[key] ?? DEFAULT_SETTINGS[key]))} className={`w-12 h-6 rounded-full transition-colors ${(settings[key] ?? DEFAULT_SETTINGS[key]) ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${(settings[key] ?? DEFAULT_SETTINGS[key]) ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
