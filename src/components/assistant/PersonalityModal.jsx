import React from 'react';
import Icons from '../icons/Icons';

const PERSONALITIES = [
  { id: 'helpful', label: 'Helpful', emoji: '🤝', desc: 'Supportive & informative' },
  { id: 'witty', label: 'Witty', emoji: '😄', desc: 'Clever with humor' },
  { id: 'mentor', label: 'Mentor', emoji: '🎓', desc: 'Wise & encouraging' },
  { id: 'casual', label: 'Casual', emoji: '😎', desc: 'Relaxed & friendly' },
  { id: 'professional', label: 'Professional', emoji: '💼', desc: 'Formal & precise' },
];

export default function PersonalityModal({ aiPersonality, setAiPersonality, aiCustomContext, setAiCustomContext, aiUseEmojis, setAiUseEmojis, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.smile className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">AI Personality</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <Icons.x className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Choose Personality</label>
            <div className="grid grid-cols-2 gap-2">
              {PERSONALITIES.map(p => (
                <button key={p.id} onClick={() => setAiPersonality(p.id)} className={`p-3 rounded-xl text-left transition-all ${aiPersonality === p.id ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 ring-1 ring-indigo-500/50' : 'bg-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.emoji}</span>
                    <span className="font-medium text-sm">{p.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Custom Context (optional)</label>
            <textarea value={aiCustomContext} onChange={e => setAiCustomContext(e.target.value)} placeholder="e.g., I'm working on a mystery novel set in 1920s Paris. My protagonist is a female detective named Claire..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-24" />
            <p className="text-xs text-slate-500 mt-1">The AI will remember this context in your conversations</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-sm">Use Emojis</p>
              <p className="text-xs text-slate-400">Allow AI to use emojis in responses</p>
            </div>
            <button onClick={() => setAiUseEmojis(!aiUseEmojis)} className={`w-12 h-6 rounded-full transition-all ${aiUseEmojis ? 'bg-indigo-600' : 'bg-slate-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${aiUseEmojis ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <button onClick={onSave} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 py-3 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
