import React from 'react';
import Icons from '../icons/Icons';
import { EDIT_TOOLS } from '../../constants/editTools';

export default function ToolsPanel({ selectedTool, setSelectedTool, expandedTool, setExpandedTool, selectedOptions, toggleToolOption, getSelectedOptionsForTool }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold">Editing Tools</h2>
        <p className="text-xs text-slate-400 mt-1">Click to select, expand for options</p>
      </div>

      <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
        {EDIT_TOOLS.map(tool => (
          <div key={tool.id} className="rounded-xl overflow-hidden">
            <div
              className={`flex items-center gap-2 p-3 cursor-pointer transition-all ${
                selectedTool === tool.id
                  ? 'bg-gradient-to-r from-indigo-600/30 via-indigo-800/30 to-slate-900/30 ring-1 ring-indigo-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <button
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedTool === tool.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                }`}>
                  {selectedTool === tool.id && <Icons.check className="w-3 h-3 text-white" />}
                </div>
                <span className="font-medium text-sm">{tool.name}</span>
              </button>
              <button
                onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Icons.chevronDown className={`w-4 h-4 transition-transform ${expandedTool === tool.id ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {expandedTool === tool.id && tool.options && (
              <div className="bg-slate-900/50 p-2 space-y-1">
                {tool.options.map(opt => {
                  const isSelected = getSelectedOptionsForTool(tool.id).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        toggleToolOption(tool.id, opt.id);
                        setSelectedTool(tool.id);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm border ${
                          isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                        }`}>
                          {isSelected && <Icons.check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 ml-5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTool && (
        <div className="p-3 border-t border-white/5 bg-indigo-500/10">
          <p className="text-xs text-indigo-400">
            <span className="font-medium">{EDIT_TOOLS.find(t => t.id === selectedTool)?.name}</span>
            {getSelectedOptionsForTool(selectedTool).length > 0 && (
              <span className="text-slate-400"> • {getSelectedOptionsForTool(selectedTool).length} option{getSelectedOptionsForTool(selectedTool).length > 1 ? 's' : ''} selected</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
