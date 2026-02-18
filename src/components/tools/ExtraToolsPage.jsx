import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { WRITING_CONTESTS, RECOMMENDED_BOOKS, WRITING_TOOLS_LIST } from '../../constants/extraTools';

const TABS = [
  { id: 'contests', label: 'Contests', icon: Icons.award },
  { id: 'books', label: 'Books', icon: Icons.book },
  { id: 'tools', label: 'Editors & Tools', icon: Icons.edit },
  { id: 'ai', label: 'AI Picks', icon: Icons.zap },
];

export default function ExtraToolsPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('contests');
  const [aiRecs, setAiRecs] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const userGenres = user.quizResults?.profile?.preferredGenres || [];

  const matchesGenre = (genres) =>
    genres?.some(g =>
      userGenres.some(ug =>
        g.toLowerCase().includes(ug.toLowerCase()) || ug.toLowerCase().includes(g.toLowerCase())
      )
    );

  const sortByMatch = (items) =>
    [...items].sort((a, b) => {
      const aMatch = matchesGenre(a.genres);
      const bMatch = matchesGenre(b.genres);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

  const handleGetAiRecs = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/.netlify/functions/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: user.quizResults?.profile || {} }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.recommendations) {
          setAiRecs(data.recommendations);
        } else {
          setAiError('AI recommendations are not available right now. Try again later.');
        }
      } else {
        setAiError('Could not get recommendations. The AI service may not be configured.');
      }
    } catch {
      setAiError('Could not connect to the recommendation service.');
    }
    setAiLoading(false);
  };

  const MatchBadge = () => (
    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
      Matches your interests
    </span>
  );

  const ExternalLink = ({ url, children }) => (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
      {children}
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15,3 21,3 21,9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Extra Tools</h1>
        <p className="text-sm text-slate-400 mt-1">Contests, books, editors, and personalized recommendations</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-white/10 to-indigo-500/10 text-white border border-white/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}>
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contests tab */}
      {activeTab === 'contests' && (
        <div className="grid gap-4">
          {sortByMatch(WRITING_CONTESTS).map((contest, i) => (
            <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{contest.name}</h3>
                    {matchesGenre(contest.genres) && <MatchBadge />}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{contest.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>By {contest.org}</span>
                    <span>Deadline: {contest.deadline}</span>
                    <span>Prize: {contest.prize}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {contest.genres.map(g => (
                      <span key={g} className={`px-2 py-0.5 rounded-full text-xs ${
                        userGenres.some(ug => g.toLowerCase().includes(ug.toLowerCase()))
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-white/5 text-slate-500'
                      }`}>{g}</span>
                    ))}
                  </div>
                </div>
                <ExternalLink url={contest.url}>Visit</ExternalLink>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Books tab */}
      {activeTab === 'books' && (
        <div className="grid gap-4">
          {sortByMatch(RECOMMENDED_BOOKS).map((book, i) => (
            <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{book.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      book.type === 'craft' ? 'bg-blue-500/20 text-blue-400' :
                      book.type === 'inspiration' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{book.type}</span>
                    {matchesGenre(book.genres) && <MatchBadge />}
                  </div>
                  <p className="text-sm text-slate-400 mb-1">by {book.author}</p>
                  <p className="text-sm text-slate-400">{book.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {book.genres.map(g => (
                      <span key={g} className={`px-2 py-0.5 rounded-full text-xs ${
                        userGenres.some(ug => g.toLowerCase().includes(ug.toLowerCase()))
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-white/5 text-slate-500'
                      }`}>{g}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <ExternalLink url={book.goodreadsUrl}>Goodreads</ExternalLink>
                  <ExternalLink url={book.libraryUrl}>Library</ExternalLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tools tab */}
      {activeTab === 'tools' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {WRITING_TOOLS_LIST.map((tool, i) => (
            <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{tool.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${tool.free ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {tool.free ? 'Free' : 'Paid'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{tool.category}</p>
                  <p className="text-sm text-slate-400">{tool.description}</p>
                </div>
                <ExternalLink url={tool.url}>Visit</ExternalLink>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Picks tab */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6 text-center">
            <Icons.zap className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">AI-Powered Recommendations</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Get personalized suggestions based on your writer profile — contests to enter, books to read, and tools to try.
            </p>
            <button onClick={handleGetAiRecs} disabled={aiLoading}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                aiLoading
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
              }`}>
              {aiLoading ? 'Getting recommendations...' : 'Get Personalized Recommendations'}
            </button>
            {aiError && <p className="text-sm text-amber-400 mt-4">{aiError}</p>}
          </div>

          {aiRecs && (
            <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
              <h3 className="font-semibold mb-4">Your Personalized Recommendations</h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
                {aiRecs}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
