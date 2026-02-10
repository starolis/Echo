import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { EDIT_TOOLS } from '../../constants/editTools';
import { performAIEdit } from '../../services/api';
import ToolsPanel from './ToolsPanel';
import EditResults from './EditResults';

export default function Editor() {
  const { user, notify } = useApp();

  const [editorContent, setEditorContent] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [editResult, setEditResult] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [highlightedChangeIdx, setHighlightedChangeIdx] = useState(null);

  const toggleToolOption = (toolId, optionId) => {
    setSelectedOptions(prev => {
      const current = prev[toolId] || [];
      const isSelected = current.includes(optionId);
      return {
        ...prev,
        [toolId]: isSelected
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  const getSelectedOptionsForTool = (toolId) => selectedOptions[toolId] || [];

  const handleImprove = async () => {
    if (!editorContent.trim()) { notify('Enter some text first', 'error'); return; }
    if (!selectedTool) { notify('Select an editing tool first', 'error'); return; }

    let toolOptions = selectedOptions[selectedTool] || [];
    if (toolOptions.length === 0) {
      const tool = EDIT_TOOLS.find(t => t.id === selectedTool);
      if (tool?.options?.length > 0) {
        toolOptions = [tool.options[0].id];
      }
    }

    setEditLoading(true);
    setEditResult(null);
    setHighlightedChangeIdx(null);

    try {
      const result = await performAIEdit(editorContent, selectedTool, toolOptions, {
        genre: user?.genre || 'Literary Fiction',
      });
      setEditResult(result);
    } catch (error) {
      notify('Error improving text', 'error');
      console.error(error);
    }

    setEditLoading(false);
  };

  const handleAcceptEdit = () => {
    if (!editResult || !editResult.result) return;
    setEditorContent(editResult.result);
    setEditResult(null);
    setHighlightedChangeIdx(null);
    notify('Changes applied');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editor</h1>
        <span className="text-sm text-slate-400">{editorContent.split(/\s+/).filter(w=>w).length} words</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <textarea
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            placeholder="Paste or write your text here..."
            className="w-full flex-1 min-h-[300px] bg-transparent text-white p-4 focus:outline-none resize-none text-sm leading-relaxed placeholder-slate-500"
          />
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleImprove}
              disabled={!editorContent.trim() || !selectedTool || editLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                editorContent.trim() && selectedTool && !editLoading
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/30 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              }`}
            >
              {editLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Icons.zap className="w-6 h-6" />
                  Improve My Writing
                </>
              )}
            </button>
          </div>
        </div>

        <ToolsPanel
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          expandedTool={expandedTool}
          setExpandedTool={setExpandedTool}
          selectedOptions={selectedOptions}
          toggleToolOption={toggleToolOption}
          getSelectedOptionsForTool={getSelectedOptionsForTool}
        />
      </div>

      <EditResults
        editResult={editResult}
        highlightedChangeIdx={highlightedChangeIdx}
        setHighlightedChangeIdx={setHighlightedChangeIdx}
        onAccept={handleAcceptEdit}
        onDismiss={() => { setEditResult(null); setHighlightedChangeIdx(null); }}
      />
    </div>
  );
}
