import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { sendChatMessage } from '../../services/api';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import PersonalityModal from './PersonalityModal';

export default function AIChatPage() {
  const { user, updateUser, notify, getTotalWords } = useApp();

  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [aiPersonality, setAiPersonality] = useState(user?.aiPersonality || 'helpful');
  const [aiCustomContext, setAiCustomContext] = useState(user?.aiCustomContext || '');
  const [aiUseEmojis, setAiUseEmojis] = useState(user?.aiUseEmojis || false);

  useEffect(() => {
    if (user) {
      setAiPersonality(user.aiPersonality || 'helpful');
      setAiCustomContext(user.aiCustomContext || '');
      setAiUseEmojis(user.aiUseEmojis || false);
    }
  }, [user?.username]);

  const saveAiSettings = () => {
    updateUser({ aiPersonality, aiCustomContext, aiUseEmojis });
    setShowPersonalityModal(false);
    notify('AI settings saved!');
  };

  const getCurrentChat = () => user?.chatSessions?.find(c => c.id === user.currentChatId);

  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: 'New conversation', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    updateUser({ chatSessions: [...(user.chatSessions || []), newChat], currentChatId: newChat.id });
  };

  const handleSelectChat = (chatId) => updateUser({ currentChatId: chatId });

  const handleDeleteChat = (chatId) => {
    const newSessions = (user.chatSessions || []).filter(c => c.id !== chatId);
    updateUser({ chatSessions: newSessions, currentChatId: user.currentChatId === chatId ? (newSessions[0]?.id || null) : user.currentChatId });
  };

  const handleSendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);

    let sessions = [...(user.chatSessions || [])];
    let currentId = user.currentChatId;

    if (!currentId || !sessions.find(c => c.id === currentId)) {
      const newChat = { id: Date.now(), title: 'New conversation', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      sessions = [...sessions, newChat];
      currentId = newChat.id;
    }

    const userMessage = { role: 'user', text: aiInput };
    const inputText = aiInput;
    setAiInput('');

    const currentChat = sessions.find(c => c.id === currentId);

    const sessionsWithUserMsg = sessions.map(c => {
      if (c.id === currentId) {
        const title = c.messages.length === 0 ? inputText.slice(0, 35) + (inputText.length > 35 ? '...' : '') : c.title;
        return { ...c, messages: [...c.messages, userMessage], title, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    updateUser({ chatSessions: sessionsWithUserMsg, currentChatId: currentId });

    const context = {
      userName: user.name,
      genre: user.genre || 'Literary Fiction',
      projectCount: user.projects?.length || 0,
      wordCount: getTotalWords(),
      personality: aiPersonality,
      customContext: aiCustomContext,
      useEmojis: aiUseEmojis,
      chatHistory: currentChat?.messages || [],
    };

    try {
      const aiResponse = await sendChatMessage(inputText, context);
      const aiMessage = { role: 'ai', text: aiResponse };

      const updatedSessions = sessionsWithUserMsg.map(c => {
        if (c.id === currentId) {
          return { ...c, messages: [...c.messages, aiMessage], updatedAt: new Date().toISOString() };
        }
        return c;
      });
      updateUser({ chatSessions: updatedSessions, currentChatId: currentId });
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      const updatedSessions = sessionsWithUserMsg.map(c => {
        if (c.id === currentId) {
          return { ...c, messages: [...c.messages, errorMessage], updatedAt: new Date().toISOString() };
        }
        return c;
      });
      updateUser({ chatSessions: updatedSessions, currentChatId: currentId });
    }

    setAiLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
      <div className="grid md:grid-cols-4 gap-4 h-full">
        <ChatSidebar
          chatSessions={user.chatSessions}
          currentChatId={user.currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />

        <div className="md:col-span-3 relative">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={() => setShowPersonalityModal(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Personality & Context">
              <Icons.smile className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
          <ChatWindow
            currentChat={getCurrentChat()}
            aiInput={aiInput}
            setAiInput={setAiInput}
            aiLoading={aiLoading}
            onSend={handleSendAI}
            aiPersonality={aiPersonality}
            genre={user.genre || 'Literary Fiction'}
          />
        </div>
      </div>

      {showPersonalityModal && (
        <PersonalityModal
          aiPersonality={aiPersonality}
          setAiPersonality={setAiPersonality}
          aiCustomContext={aiCustomContext}
          setAiCustomContext={setAiCustomContext}
          aiUseEmojis={aiUseEmojis}
          setAiUseEmojis={setAiUseEmojis}
          onSave={saveAiSettings}
          onClose={() => setShowPersonalityModal(false)}
        />
      )}
    </div>
  );
}
