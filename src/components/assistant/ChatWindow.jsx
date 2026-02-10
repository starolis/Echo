import React, { useRef, useEffect } from 'react';
import Icons from '../icons/Icons';

export default function ChatWindow({ currentChat, aiInput, setAiInput, aiLoading, onSend, aiPersonality, genre }) {
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="md:col-span-3 bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">AI Writing Assistant</h2>
          <p className="text-sm text-slate-400">
            {aiPersonality.charAt(0).toUpperCase() + aiPersonality.slice(1)} mode • {genre}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentChat || currentChat?.messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
              <Icons.message className="w-8 h-8" />
            </div>
            <p className="text-slate-300 mb-4">What's on your mind?</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {['Give me a story idea', 'Help with my character', 'I\'m feeling stuck', 'Tell me a joke'].map(s => (
                <button key={s} onClick={() => setAiInput(s)} className="text-sm bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          currentChat?.messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 ring-1 ring-indigo-500/30' : 'bg-white/5'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))
        )}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatRef} />
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500"
            disabled={aiLoading}
          />
          <button
            onClick={onSend}
            disabled={aiLoading || !aiInput.trim()}
            className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 disabled:ring-0 disabled:shadow-none"
          >
            <Icons.send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
