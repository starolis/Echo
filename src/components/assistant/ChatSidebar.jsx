import React from 'react';
import Icons from '../icons/Icons';

export default function ChatSidebar({ chatSessions, currentChatId, onNewChat, onSelectChat, onDeleteChat }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 flex flex-col">
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-medium">History</span>
        <button onClick={onNewChat} className="text-indigo-400 hover:text-indigo-300 text-sm">New</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {(chatSessions || []).length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            <p>No conversations</p>
            <button onClick={onNewChat} className="text-indigo-400 mt-2">Start one</button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {[...(chatSessions || [])].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(chat => (
              <div key={chat.id} className={`group relative rounded-lg transition-colors ${currentChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                <button onClick={() => onSelectChat(chat.id)} className="w-full p-2 text-left">
                  <p className="text-sm truncate">{chat.title}</p>
                  <p className="text-xs text-slate-500">{chat.messages.length} messages</p>
                </button>
                <button onClick={() => onDeleteChat(chat.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1">
                  <Icons.x className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
