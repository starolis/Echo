import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { RUBRICS, FEEDBACK_FORMATS } from '../../constants/rubrics';
import { performAIGrade } from '../../services/api';
import GradeResults from './GradeResults';
import GradingHistory from './GradingHistory';

export default function AIGrader() {
  const { user, updateUser, notify } = useApp();

  const [tab, setTab] = useState('grade');
  const [text, setText] = useState('');
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [customCriteria, setCustomCriteria] = useState('');
  const [feedbackFormat, setFeedbackFormat] = useState(user?.preferredGradeFormat || 'report-card');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const history = user?.gradingHistory || [];

  const handleImportProject = (projectId) => {
    const project = user.projects?.find(p => String(p.id) === String(projectId));
    if (project) {
      setText(project.content || '');
      notify(`Imported "${project.title}"`);
    }
  };

  const handleGrade = async () => {
    if (!text.trim()) {
      notify('Enter or import some text to grade.', 'error');
      return;
    }
    if (!selectedRubric && !customCriteria.trim()) {
      notify('Select a rubric or enter custom criteria.', 'error');
      return;
    }

    setLoading(true);
    setResults(null);

    const rubric = selectedRubric
      ? { type: 'template', ...RUBRICS.find(r => r.id === selectedRubric) }
      : { type: 'custom', criteria: customCriteria };

    const context = {
      genre: user?.genre || 'Literary Fiction',
      quizProfile: user?.quizResults?.profile || null,
    };

    try {
      const data = await performAIGrade(text, rubric, feedbackFormat, context);

      if (data.error) {
        notify(data.summary || 'Grading failed. Please try again.', 'error');
        setLoading(false);
        return;
      }

      setResults(data);

      // Save to history
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        textSnippet: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        rubricName: selectedRubric ? (RUBRICS.find(r => r.id === selectedRubric)?.name || 'Unknown Rubric') : 'Custom',
        feedbackFormat,
        overallGrade: data.overallGrade || null,
        overallScore: data.overallScore || null,
        results: data,
      };
      updateUser({ gradingHistory: [...history, entry] });

      // Persist feedback format preference
      if (feedbackFormat !== user?.preferredGradeFormat) {
        updateUser({ preferredGradeFormat: feedbackFormat });
      }
    } catch (err) {
      console.error('Grading error:', err);
      notify('Something went wrong. Please try again.', 'error');
    }

    setLoading(false);
  };

  const handleDeleteHistory = (entryId) => {
    updateUser({ gradingHistory: history.filter(e => e.id !== entryId) });
    notify('Grade deleted');
  };

  const handleNewGrade = () => {
    setResults(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Grader</h1>
        <div className="flex bg-slate-800/50 rounded-xl p-1">
          {[
            { id: 'grade', label: 'New Grade', icon: Icons.award },
            { id: 'history', label: 'History', icon: Icons.chart },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'grade') setResults(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === 'history' && history.length > 0 && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{history.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'history' ? (
        <GradingHistory history={history} onDelete={handleDeleteHistory} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: Text Input */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-slate-400">Your Writing</label>
              {user.projects?.length > 0 && (
                <select
                  onChange={(e) => { if (e.target.value) handleImportProject(e.target.value); e.target.value = ''; }}
                  defaultValue=""
                  className="text-sm bg-slate-700/50 border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Import from project...</option>
                  {user.projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write your text here..."
              className="flex-1 min-h-[300px] bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
            <p className="text-sm text-slate-500 mt-2">{wordCount} words</p>
          </div>

          {/* Right: Rubric Selection / Results */}
          <div className="space-y-4">
            {results ? (
              <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                <h3 className="font-semibold mb-4">Results</h3>
                <GradeResults results={results} feedbackFormat={feedbackFormat} onNewGrade={handleNewGrade} />
              </div>
            ) : (
              <>
                {/* Rubric Selection */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                  <h3 className="font-semibold mb-3">Rubric</h3>

                  {/* Custom rubric */}
                  <button
                    onClick={() => setSelectedRubric(null)}
                    className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                      selectedRubric === null
                        ? 'bg-indigo-500/20 border border-indigo-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icons.edit className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium">Custom Criteria</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Write your own grading criteria</p>
                  </button>

                  {selectedRubric === null && (
                    <textarea
                      value={customCriteria}
                      onChange={(e) => setCustomCriteria(e.target.value)}
                      placeholder="Describe what to grade on... e.g., creativity, use of metaphor, stays under 500 words, has a clear theme"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none h-24 mb-2"
                    />
                  )}

                  <div className="text-xs text-slate-500 mb-2 mt-3">Or choose a template:</div>

                  {/* Template rubrics */}
                  <div className="space-y-1.5">
                    {RUBRICS.map(r => {
                      const IconComponent = Icons[r.icon];
                      return (
                        <button
                          key={r.id}
                          onClick={() => { setSelectedRubric(r.id); setCustomCriteria(''); }}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            selectedRubric === r.id
                              ? 'bg-indigo-500/20 border border-indigo-500/30'
                              : 'bg-white/5 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="w-4 h-4 text-slate-400" />}
                            <span className="text-sm font-medium">{r.name}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Format */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                  <h3 className="font-semibold mb-3">Feedback Style</h3>
                  <div className="space-y-1.5">
                    {FEEDBACK_FORMATS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFeedbackFormat(f.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          feedbackFormat === f.id
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <span className="text-sm font-medium">{f.name}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade Button */}
                <button
                  onClick={handleGrade}
                  disabled={loading || (!text.trim()) || (!selectedRubric && !customCriteria.trim())}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all ring-1 ring-indigo-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Grading...
                    </>
                  ) : (
                    <>
                      <Icons.award className="w-5 h-5" />
                      Grade My Work
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
