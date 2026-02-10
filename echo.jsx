import React, { useState, useEffect, useRef } from 'react';

// ============ ICONS ============
const Icons = {
  home: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  edit: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  folder: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  message: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  chart: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  send: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  trash: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  check: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>,
  x: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  menu: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  camera: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  user: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  zap: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  book: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  clock: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  alertCircle: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  smile: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  chevronDown: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  timer: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3L2 6"/><path d="M22 6l-3-3"/><path d="M12 5V3"/></svg>,
  calendar: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  focus: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  target: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  coffee: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  moon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  play: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  refresh: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  users: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  award: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  flame: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  chevronLeft: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  chevronRight: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  bell: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  volume: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  volumeX: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
};

// ============ LOGO ============
const EchoLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8"/>
        <stop offset="100%" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#logoGrad)" strokeWidth="2.5">
      {[14, 24, 34, 44].map((r, i) => (
        <ellipse key={i} cx="50" cy="50" rx={r} ry={r * 0.85} opacity={0.25 + i * 0.2}/>
      ))}
    </g>
    <circle cx="50" cy="50" r="6" fill="url(#logoGrad)"/>
  </svg>
);

// ============ CONSTANTS ============
const PLANS = {
  free: { id: 'free', name: 'Free', price: 0, hasAnalytics: true },
  pro: { id: 'pro', name: 'Pro', price: 9.99, hasAnalytics: true },
};

const GENRES = ['Literary Fiction', 'Fantasy', 'Science Fiction', 'Romance', 'Mystery/Thriller', 'Horror', 'Historical Fiction', 'Young Adult', 'Non-Fiction', 'Poetry'];

const DEFAULT_SETTINGS = {
  theme: 'dark', fontSize: 'medium', fontFamily: 'system',
  editorTheme: 'dark', autoSave: true, spellCheck: true,
  aiTone: 'friendly', aiVerbosity: 'balanced',
};

const SETTING_OPTIONS = {
  theme: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }],
  fontSize: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }],
  fontFamily: [{ value: 'system', label: 'System' }, { value: 'serif', label: 'Serif' }, { value: 'mono', label: 'Mono' }],
  aiTone: [{ value: 'formal', label: 'Formal' }, { value: 'friendly', label: 'Friendly' }, { value: 'casual', label: 'Casual' }],
  aiVerbosity: [{ value: 'concise', label: 'Concise' }, { value: 'balanced', label: 'Balanced' }, { value: 'detailed', label: 'Detailed' }],
};

const EDIT_TOOLS = [
  {
    id: 'enhance',
    name: 'Enhance',
    desc: 'Make language more vivid',
    options: [
      { id: 'vivid-verbs', label: 'Vivid Verbs', desc: 'Replace weak verbs with stronger ones' },
      { id: 'sensory-details', label: 'Sensory Details', desc: 'Add sight, sound, smell, taste, touch' },
      { id: 'show-dont-tell', label: 'Show Don\'t Tell', desc: 'Convert telling to showing' },
      { id: 'metaphors', label: 'Add Metaphors', desc: 'Insert figurative language' },
    ]
  },
  {
    id: 'shorten',
    name: 'Shorten',
    desc: 'Reduce length',
    options: [
      { id: 'shorten-25', label: 'Trim 25%', desc: 'Light trim, keep most detail' },
      { id: 'shorten-50', label: 'Cut 50%', desc: 'Significant reduction' },
      { id: 'shorten-75', label: 'Compress 75%', desc: 'Keep only essentials' },
      { id: 'remove-fillers', label: 'Remove Fillers', desc: 'Cut very, really, just, etc.' },
      { id: 'remove-redundancy', label: 'Cut Redundancy', desc: 'Remove repeated ideas' },
      { id: 'tighten-sentences', label: 'Tighten Sentences', desc: 'Make each sentence leaner' },
      { id: 'cut-adverbs', label: 'Cut Adverbs', desc: 'Remove unnecessary -ly words' },
    ]
  },
  {
    id: 'expand',
    name: 'Expand',
    desc: 'Add length',
    options: [
      { id: 'expand-25', label: 'Expand +25%', desc: 'Add a bit more detail' },
      { id: 'expand-50', label: 'Expand +50%', desc: 'Substantially more content' },
      { id: 'expand-100', label: 'Double Length', desc: 'Expand to 2x original' },
      { id: 'add-description', label: 'Add Description', desc: 'Expand setting and atmosphere' },
      { id: 'deepen-emotion', label: 'Deepen Emotion', desc: 'Add internal feelings and reactions' },
      { id: 'add-context', label: 'Add Context', desc: 'Include background information' },
      { id: 'extend-dialogue', label: 'Extend Dialogue', desc: 'Add beats and responses' },
    ]
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    desc: 'Adjust word level',
    options: [
      { id: 'vocab-simple', label: 'Simple', desc: 'Basic, everyday words (grade 5)' },
      { id: 'vocab-standard', label: 'Standard', desc: 'Clear, accessible language (grade 8)' },
      { id: 'vocab-advanced', label: 'Advanced', desc: 'Sophisticated vocabulary (grade 12)' },
      { id: 'vocab-academic', label: 'Academic', desc: 'Scholarly, technical language' },
    ]
  },
  {
    id: 'simplify',
    name: 'Simplify',
    desc: 'Clearer language',
    options: [
      { id: 'plain-language', label: 'Plain Language', desc: 'Use everyday words' },
      { id: 'shorter-sentences', label: 'Shorter Sentences', desc: 'Break up complex sentences' },
      { id: 'remove-jargon', label: 'Remove Jargon', desc: 'Replace technical terms' },
      { id: 'active-voice', label: 'Active Voice', desc: 'Convert passive to active' },
    ]
  },
  {
    id: 'tone',
    name: 'Tone',
    desc: 'Adjust voice',
    options: [
      { id: 'formal', label: 'More Formal', desc: 'Professional, polished tone' },
      { id: 'casual', label: 'More Casual', desc: 'Relaxed, conversational' },
      { id: 'dramatic', label: 'More Dramatic', desc: 'Heighten tension and stakes' },
      { id: 'humorous', label: 'Add Humor', desc: 'Lighten with wit' },
    ]
  },
  {
    id: 'grammar',
    name: 'Grammar',
    desc: 'Fix errors',
    options: [
      { id: 'spelling', label: 'Spelling', desc: 'Fix misspelled words' },
      { id: 'punctuation', label: 'Punctuation', desc: 'Fix commas, periods, etc.' },
      { id: 'grammar-rules', label: 'Grammar Rules', desc: 'Fix grammatical errors' },
      { id: 'consistency', label: 'Consistency', desc: 'Fix tense and POV shifts' },
    ]
  },
  {
    id: 'flow',
    name: 'Flow',
    desc: 'Improve rhythm',
    options: [
      { id: 'transitions', label: 'Transitions', desc: 'Connect ideas smoothly' },
      { id: 'vary-length', label: 'Vary Sentences', desc: 'Mix short and long' },
      { id: 'paragraph-breaks', label: 'Paragraphs', desc: 'Improve pacing with breaks' },
      { id: 'rhythm', label: 'Rhythm', desc: 'Better cadence and flow' },
    ]
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    desc: 'Improve speech',
    options: [
      { id: 'natural-speech', label: 'Natural Speech', desc: 'Make dialogue sound real' },
      { id: 'distinct-voices', label: 'Distinct Voices', desc: 'Differentiate characters' },
      { id: 'subtext', label: 'Add Subtext', desc: 'What\'s unsaid matters' },
      { id: 'action-beats', label: 'Action Beats', desc: 'Replace said with action' },
    ]
  },
];

// ============ AI EDITING ENGINE ============
const performAIEdit = async (text, toolId, selectedOptions, context = {}) => {
  if (!text.trim()) {
    return {
      result: text,
      changes: [],
      feedback: 'Enter some text to edit.',
      error: true
    };
  }
 
  const { genre = 'Literary Fiction' } = context;
  const tool = EDIT_TOOLS.find(t => t.id === toolId);
  const wordCount = text.split(/\s+/).filter(w => w).length;
 
  const optionLabels = selectedOptions.map(optId => {
    const opt = tool?.options?.find(o => o.id === optId);
    return opt ? `${opt.label}: ${opt.desc}` : optId;
  }).join('\n- ');
 
  // Calculate target word counts for percentage options
  let lengthInstruction = '';
  if (selectedOptions.includes('shorten-25')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.75)} words (reduce by 25%)`;
  else if (selectedOptions.includes('shorten-50')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.5)} words (reduce by 50%)`;
  else if (selectedOptions.includes('shorten-75')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.25)} words (reduce by 75%)`;
  else if (selectedOptions.includes('expand-25')) lengthInstruction = `Target: ~${Math.round(wordCount * 1.25)} words (expand by 25%)`;
  else if (selectedOptions.includes('expand-50')) lengthInstruction = `Target: ~${Math.round(wordCount * 1.5)} words (expand by 50%)`;
  else if (selectedOptions.includes('expand-100')) lengthInstruction = `Target: ~${Math.round(wordCount * 2)} words (double length)`;
 
  // Vocabulary level instructions
  let vocabInstruction = '';
  if (selectedOptions.includes('vocab-simple')) vocabInstruction = 'Use simple, everyday vocabulary suitable for a 5th grade reading level. Avoid complex words.';
  else if (selectedOptions.includes('vocab-standard')) vocabInstruction = 'Use clear, accessible vocabulary suitable for an 8th grade reading level.';
  else if (selectedOptions.includes('vocab-advanced')) vocabInstruction = 'Use sophisticated, varied vocabulary suitable for a 12th grade reading level.';
  else if (selectedOptions.includes('vocab-academic')) vocabInstruction = 'Use scholarly, academic vocabulary with precise terminology.';
 
  const systemPrompt = `You are a professional editor. Edit the text according to these instructions.

**Tool:** ${tool?.name || toolId}
**Options:**
- ${optionLabels || 'General improvements'}
${lengthInstruction ? `\n**Length Target:** ${lengthInstruction}` : ''}
${vocabInstruction ? `\n**Vocabulary:** ${vocabInstruction}` : ''}

**Current word count:** ${wordCount} words

**Rules:**
1. Apply ONLY the selected options
2. Preserve the author's voice
3. ${lengthInstruction ? 'Hit the target word count as closely as possible' : 'Make meaningful improvements'}
4. Return JSON format:

{
  "editedText": "The full edited text",
  "changes": [
    { "original": "original phrase", "revised": "new phrase", "reason": "why changed" }
  ],
  "summary": "2-3 sentence summary",
  "stats": { "wordsBefore": ${wordCount}, "wordsAfter": number, "changesCount": number }
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Edit this text:\n\n${text}` }]
      })
    });

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';
   
    // Parse the JSON response
    try {
      // Find JSON in the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          result: parsed.editedText || text,
          changes: parsed.changes || [],
          feedback: parsed.summary || 'Edits applied.',
          stats: parsed.stats || { wordsBefore: text.split(/\s+/).length, wordsAfter: parsed.editedText?.split(/\s+/).length || 0, changesCount: parsed.changes?.length || 0 },
          error: false
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }
   
    // Fallback if JSON parsing fails
    return {
      result: responseText,
      changes: [],
      feedback: 'Edits applied (detailed changes unavailable).',
      stats: { wordsBefore: text.split(/\s+/).length, wordsAfter: responseText.split(/\s+/).length, changesCount: 0 },
      error: false
    };
  } catch (error) {
    console.error('AI Edit Error:', error);
    return {
      result: text,
      changes: [],
      feedback: `Error: ${error.message}`,
      error: true
    };
  }
};


// ============ AI RESPONSE ENGINE ============
const generateAIResponse = async (message, context) => {
  const { userName = 'Writer', genre = 'Literary Fiction', personality = 'helpful', useEmojis = false, chatHistory = [] } = context || {};
 
  const msg = message.toLowerCase().trim();
  const e = (emoji) => useEmojis ? emoji + ' ' : '';
 
  // Personality greetings and styles
  const greetings = {
    helpful: `Hi ${userName}!`,
    witty: `Well well, ${userName}!`,
    mentor: `Welcome, ${userName}.`,
    casual: `Hey ${userName}!`,
    professional: `Good day, ${userName}.`,
  };
  const greeting = greetings[personality] || greetings.helpful;
 
  // Try API call first (without forcing context injection)
  try {
    const personalityDescriptions = {
      helpful: 'You are supportive, informative, and encouraging. You give thorough but clear answers.',
      witty: 'You are clever and humorous, using wordplay and light jokes while still being helpful.',
      mentor: 'You are wise and encouraging, like an experienced writing teacher.',
      casual: 'You are relaxed and friendly, like a buddy. You use casual language.',
      professional: 'You are formal and precise with structured, actionable advice.',
    };
   
    const systemPrompt = `You are an AI writing assistant called Echo. You help writers with their craft and can chat about anything.

Personality: ${personalityDescriptions[personality] || personalityDescriptions.helpful}

Guidelines:
- Be conversational and natural
- ${useEmojis ? 'Use emojis occasionally for warmth' : 'Do NOT use emojis'}
- Actually write content when asked (stories, poems, scenes)
- Provide the full number of items when asked for lists
- Keep responses focused and helpful
- Only reference the user's specific work if THEY bring it up first
- Do NOT assume or inject details about their projects unless they mention them`;

    const messages = [];
    const recentHistory = chatHistory.slice(-6);
    for (const m of recentHistory) {
      messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: messages
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.content && data.content[0]?.text) {
        return data.content[0].text;
      }
    }
  } catch (err) {
    console.log('API not available, using smart responses');
  }
 
  // Smart fallback responses
 
  // Greetings
  if (msg.match(/^(hi|hello|hey|good morning|good evening|good afternoon|yo|sup|what'?s up|howdy)/i)) {
    const responses = {
      helpful: `${e('👋')}${greeting} Great to see you! I'm here to help with your writing or just chat. What's on your mind?`,
      witty: `${e('✨')}${greeting} Ready to make some literary magic? What can I do for you?`,
      mentor: `${e('🌟')}${greeting} Every writing session is a step forward. How can I help today?`,
      casual: `${e('😊')}${greeting} What's good? How can I help?`,
      professional: `${greeting} How may I assist you today?`,
    };
    return responses[personality] || responses.helpful;
  }
 
  // How are you
  if (msg.match(/how are you|how'?s it going|how do you do/i)) {
    const responses = {
      helpful: `${e('😊')}I'm doing great, thanks for asking! How about you - what brings you here today?`,
      witty: `Living my best AI life! No coffee needed, infinite patience, and I never get writer's block. How are YOU doing?`,
      mentor: `I'm well, ${userName}. More importantly, how are you feeling today?`,
      casual: `I'm good! Just vibing, ready to help. What's up with you?`,
      professional: `I'm functioning optimally. How may I assist you today?`,
    };
    return responses[personality] || responses.helpful;
  }
 
  // Writing requests - stories
  if (msg.match(/write.*(story|tale|narrative)|story about/i)) {
    let topic = msg.replace(/.*(?:story|tale|narrative) (?:about |on |regarding )?/i, '').trim() || 'an unexpected encounter';
    topic = topic.replace(/[.?!]/g, '').trim();
    const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
   
    return `**${capTopic}**

The rain had been falling for three days straight when it finally happened.

Maya stood at her window, watching the water streak down the glass, when she noticed something unusual in the garden below. At first, she thought it was just a shadow, a trick of the storm-darkened afternoon. But then it moved.

"That's impossible," she whispered, pressing her palm against the cold glass.

${capTopic} wasn't supposed to be real. It was just a story her grandmother used to tell, a fairy tale to explain away the unexplainable. Yet there it was, exactly as the old woman had described.

Maya's heart hammered against her ribs. She had two choices: pretend she hadn't seen anything and go back to her ordinary life, or open that back door and step into a world she'd only dreamed about.

Her hand was already reaching for her coat.

---
${e('✨')}Want me to continue? I can take this in any direction you'd like!`;
  }
 
  // Writing requests - poems
  if (msg.match(/write.*(poem|poetry|verse)|poem about/i)) {
    let topic = msg.replace(/.*(?:poem|poetry|verse) (?:about |on |regarding )?/i, '').trim() || 'hope';
    topic = topic.replace(/[.?!]/g, '').trim();
    const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
   
    return `**${capTopic}**

In the space between heartbeats,
where silence learns to speak,
I found ${topic} waiting—
patient, persistent, meek.

Not loud like thunder claiming sky,
nor bright as summer's flare,
but steady as the tide's return,
as constant as the air.

It asks for nothing, offers all,
this quiet, gentle thing—
a reminder that in darkness,
even small lights sing.

---
${e('📝')}I can try a different style if you'd like—perhaps something more modern, darker, or with a specific structure like a sonnet or haiku?`;
  }
 
  // List requests - ideas
  if (msg.match(/(\d+)\s*(ideas?|prompts?|suggestions?)/i) || msg.match(/list.*ideas|give me.*ideas/i)) {
    const numMatch = msg.match(/(\d+)/);
    const count = numMatch ? Math.min(parseInt(numMatch[1]), 20) : 10;
   
    const prompts = [
      "A translator discovers hidden messages in an author's work that seem meant for them personally",
      "Two strangers share a hospital waiting room through the longest night of their lives",
      "A woman inherits her estranged mother's house and finds decades of unsent letters",
      "The last independent bookstore in town faces its final week",
      "A retired teacher receives a letter from a student they don't remember",
      "Three siblings return home to sort through their late father's belongings",
      "A food critic loses their sense of taste and must rediscover why they love food",
      "Two people who shared one meaningful conversation meet again twenty years later",
      "A ghostwriter wants to tell their own story but has forgotten how",
      "The night shift at a 24-hour diner where everyone is running from something",
      "A professor's marginalia becomes a secret correspondence with a stranger",
      "An archivist discovers their own family in a collection of 'lost' histories",
      "A witch whose spells only work when she tells the truth",
      "A dragon who hoards stories instead of gold",
      "A kingdom where shadows have their own monarchy",
      "The last human who remembers Earth's original sky",
      "An AI that develops nostalgia for a past it never lived",
      "A generation ship where the destination is forgotten",
      "Memory editing becomes so common that original memories are status symbols",
      "The retirement home for obsolete androids"
    ];
   
    const shuffled = [...prompts].sort(() => Math.random() - 0.5).slice(0, count);
   
    let response = `${e('💡')}**${count} Story Ideas:**\n\n`;
    shuffled.forEach((idea, i) => {
      response += `${i + 1}. ${idea}\n`;
    });
    response += `\n---\n${e('✨')}Want me to develop any of these further? Just tell me which number catches your eye!`;
   
    return response;
  }
 
  // Writing help
  if (msg.match(/help.*(writ|stuck|block)|writer'?s block|can'?t write|don'?t know what/i)) {
    return `${e('💪')}Writer's block is tough, but you've got this! Here are some strategies:

**Quick Fixes:**
• Write the worst version first—give yourself permission to be terrible
• Start in the middle of a scene, skip the beginning
• Set a timer for 10 minutes and don't stop typing

**Deeper Approaches:**
• What's the one thing your character wants right now? Write toward that
• Change your environment—new location, different music
• Talk through your story out loud (or to me!)

**Questions to Spark Ideas:**
• What's the worst thing that could happen to your character?
• What secret are they keeping?
• What would they never, ever do? Now make them do it.

${e('🎯')}Which of these resonates with you? Or tell me more about where you're stuck!`;
  }
 
  // Character development
  if (msg.match(/character|protagonist|antagonist|villain|hero/i)) {
    return `${e('👤')}Great question about characters! Here's what makes characters memorable:

**The Essentials:**
• **Want**: What do they desire more than anything?
• **Need**: What do they actually need (often different from want)?
• **Flaw**: What holds them back?
• **Ghost**: What past event shaped them?

**Making Them Real:**
• Give them contradictions (a brave person with a secret fear)
• Show their habits and small rituals
• Let them be wrong sometimes
• Give them a unique voice—how do they speak differently?

**Quick Exercise:**
Try answering: "My character would never _____ because _____."
Then ask: "What would make them do exactly that?"

${e('💭')}Would you like me to help you develop a specific character? Tell me what you have so far!`;
  }
 
  // Dialogue help
  if (msg.match(/dialogue|conversation|speech|talking/i)) {
    return `${e('💬')}Dialogue is where characters come alive! Here are my best tips:

**The Golden Rules:**
• Every line should do double duty (reveal character AND advance plot)
• Cut the small talk unless it reveals something
• People rarely say exactly what they mean
• Give each character a distinct speech pattern

**Common Fixes:**
• ❌ "Hello, how are you?" "I'm fine, thanks."
• ✅ Jump into the middle of conversations
• ❌ Long speeches explaining feelings
• ✅ Show feelings through what they DON'T say

**Subtext Exercise:**
Write a conversation where two people discuss the weather, but they're really talking about their failing relationship.

${e('📝')}Want me to help punch up some dialogue you're working on? Share a snippet!`;
  }
 
  // Plot help
  if (msg.match(/plot|story structure|outline|pacing/i)) {
    return `${e('📊')}Let's talk story structure! Here's a framework that works:

**The Essential Beats:**
1. **Hook** - Grab attention immediately
2. **Setup** - Establish normal world and character
3. **Catalyst** - Something disrupts everything
4. **Debate** - Character resists the call
5. **Midpoint** - Stakes raise, no going back
6. **Crisis** - Everything falls apart
7. **Climax** - Final confrontation
8. **Resolution** - New normal established

**Pacing Tips:**
• Vary your scene lengths
• Follow intense scenes with breathing room
• End chapters on hooks
• Every scene needs conflict (even small)

${e('🗺️')}Are you working on a specific plot? Tell me your premise and I can help you structure it!`;
  }
 
  // Thank you
  if (msg.match(/thank|thanks|thx|appreciate/i)) {
    const responses = {
      helpful: `${e('😊')}You're so welcome! Let me know if you need anything else.`,
      witty: `${e('✨')}Aw shucks! Anytime, friend!`,
      mentor: `It's my pleasure. Keep creating!`,
      casual: `No prob! Happy to help anytime.`,
      professional: `You're welcome. I'm here whenever you need assistance.`,
    };
    return responses[personality] || responses.helpful;
  }
 
  // Jokes
  if (msg.match(/joke|funny|make me laugh|humor/i)) {
    const jokes = [
      "Why do writers always feel cold? Because they're surrounded by drafts!",
      "A writer's favorite state? A rough draft state of mind.",
      "How many writers does it take to change a lightbulb? But why does it HAVE to change?",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "What's a writer's favorite snack? Synonym rolls!",
      "Why did the writer break up with the thesaurus? It kept putting words in their mouth."
    ];
    return `${e('😄')}${jokes[Math.floor(Math.random() * jokes.length)]}\n\n${e('📝')}Need another one, or shall we get back to writing?`;
  }
 
  // Weather/small talk
  if (msg.match(/weather|rain|sun|cold|hot|temperature/i)) {
    return `${e('🌤️')}I don't have real-time weather data, but whatever the weather, it's perfect writing weather! Rainy day? Cozy vibes. Sunny? Write outside. Snowy? Hot cocoa and creativity!\n\nAnything I can help you with?`;
  }
 
  // Emotions
  if (msg.match(/i('m| am) (sad|depressed|down|upset|anxious|stressed|worried)/i)) {
    return `${e('💙')}I hear you. Those feelings are valid, and I'm sorry you're going through a tough time.\n\nSometimes writing can be therapeutic—getting those feelings onto paper. But there's also no pressure to be productive when you're struggling.\n\nWould you like to:\n• Just chat about how you're feeling?\n• Try a gentle writing exercise?\n• Work on something completely distracting?\n\nI'm here for whatever you need.`;
  }
 
  if (msg.match(/i('m| am) (happy|excited|great|good|amazing|fantastic)/i)) {
    return `${e('🎉')}That's wonderful to hear! Happy moods can be fantastic for creative writing.\n\nWant to channel that positive energy into something? I could help you:\n• Start an exciting new story\n• Write something celebratory\n• Brainstorm ambitious ideas\n\nWhat sounds fun?`;
  }
 
  // Goodbye
  if (msg.match(/bye|goodbye|see you|gotta go|gtg|cya|talk later/i)) {
    const responses = {
      helpful: `${e('👋')}Goodbye! Come back anytime. Happy writing!`,
      witty: `${e('✨')}Off you go! May your drafts be smooth and your coffee strong!`,
      mentor: `Until next time. Remember: every word you write is progress.`,
      casual: `Later! Have a good one!`,
      professional: `Goodbye. I look forward to our next session.`,
    };
    return responses[personality] || responses.helpful;
  }
 
  // Default helpful response
  return `${e('💭')}${greeting} I'd love to help with that! I can:

• **Write for you** - Stories, poems, scenes, descriptions
• **Brainstorm** - Ideas, plots, characters, settings
• **Advise** - Craft tips, structure, dialogue, pacing
• **Edit** - Help improve what you've written
• **Chat** - Just hang out and talk about anything!

What would you like to explore?`;
};

// ============ DATA ============
const save = d => localStorage.setItem('echo_v3', JSON.stringify(d));
const load = () => { try { return JSON.parse(localStorage.getItem('echo_v3')); } catch { return null; } };

const createUser = (username, name, pass) => ({
  username, name, pass,
  profileImage: null,
  genre: 'Literary Fiction',
  projects: [],
  stats: { wordsWritten: 0, sessionsCompleted: 0 },
  subscription: 'free',
  settings: { ...DEFAULT_SETTINGS },
  chatSessions: [],
  currentChatId: null,
  aiPersonality: 'helpful',
  aiCustomContext: '',
});

const createInitialData = () => ({
  users: {
    claudia: {
      ...createUser('claudia', 'Claudia', '12345'),
      genre: 'Literary Fiction',
      subscription: 'pro',
      stats: { wordsWritten: 12450, sessionsCompleted: 34 },
      projects: [
        { id: 1, title: 'The Weight of Silence', content: 'Professor Elena Marsh had spent thirty years studying the architecture of language—how words built bridges between minds, how syntax could shelter or expose. Now, staring at the hospital ceiling, she understood that some spaces could only be filled with silence.\n\nThe stroke had taken her speech but left her mind intact, a cruel precision that felt almost personal.', createdAt: '2025-01-15', updatedAt: '2025-02-01', status: 'In Progress' },
      ],
      chatSessions: [],
      currentChatId: null,
      aiPersonality: 'helpful',
      aiCustomContext: '',
    },
  },
  posts: [],
});

// ============ MAIN APP ============
export default function EchoApp() {
  const [data, setData] = useState(createInitialData);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
 
  const [loginForm, setLoginForm] = useState({ username: '', password: '', name: '' });
 
  // Editor state
  const [editorContent, setEditorContent] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [editResult, setEditResult] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [highlightedChangeIdx, setHighlightedChangeIdx] = useState(null);
 
  // Project state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectContent, setProjectContent] = useState('');
  const [projectStatus, setProjectStatus] = useState('Draft');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
 
  // AI state
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [aiPersonality, setAiPersonality] = useState(user?.aiPersonality || 'helpful');
  const [aiCustomContext, setAiCustomContext] = useState(user?.aiCustomContext || '');
  const [aiUseEmojis, setAiUseEmojis] = useState(user?.aiUseEmojis || false);
 
  // Sprint state
  const [sprintTime, setSprintTime] = useState(15); // minutes
  const [sprintWordGoal, setSprintWordGoal] = useState(500);
  const [sprintRunning, setSprintRunning] = useState(false);
  const [sprintTimeLeft, setSprintTimeLeft] = useState(0);
  const [sprintWords, setSprintWords] = useState(0);
  const [sprintStartWords, setSprintStartWords] = useState(0);
  const [sprintText, setSprintText] = useState('');
  const [sprintHistory, setSprintHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
 
  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [focusGoal, setFocusGoal] = useState(1000);
  const [focusAmbiance, setFocusAmbiance] = useState('none');
  const [focusShowStats, setFocusShowStats] = useState(true);
  const [focusTypewriter, setFocusTypewriter] = useState(false);
 
  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [writingGoals, setWritingGoals] = useState({});
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ type: 'words', target: 500, time: '' });
 
  // Sync AI settings when user changes
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
 
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const sprintIntervalRef = useRef(null);
 
  useEffect(() => { const saved = load(); if (saved) setData(saved); setLoaded(true); }, []);
  useEffect(() => { if (loaded) save(data); }, [data, loaded]);
  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [user?.chatSessions, user?.currentChatId]);
 
  // Sprint timer effect
  useEffect(() => {
    if (sprintRunning && sprintTimeLeft > 0) {
      sprintIntervalRef.current = setInterval(() => {
        setSprintTimeLeft(prev => {
          if (prev <= 1) {
            // Sprint ended
            clearInterval(sprintIntervalRef.current);
            setSprintRunning(false);
            const wordsWritten = sprintText.split(/\s+/).filter(w => w).length - sprintStartWords;
            const newSprint = {
              id: Date.now(),
              date: new Date().toISOString(),
              duration: sprintTime,
              wordsWritten,
              goal: sprintWordGoal,
              completed: wordsWritten >= sprintWordGoal
            };
            setSprintHistory(prev => [...prev, newSprint]);
            if (wordsWritten >= sprintWordGoal) {
              setCurrentStreak(prev => prev + 1);
              notify(`🎉 Sprint complete! ${wordsWritten} words written!`);
            } else {
              setCurrentStreak(0);
              notify(`Sprint ended. ${wordsWritten} words written.`);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sprintIntervalRef.current);
  }, [sprintRunning, sprintTimeLeft]);
 
  // Update sprint words in real-time
  useEffect(() => {
    if (sprintRunning) {
      setSprintWords(sprintText.split(/\s+/).filter(w => w).length - sprintStartWords);
    }
  }, [sprintText, sprintRunning, sprintStartWords]);
 
  const startSprint = () => {
    setSprintTimeLeft(sprintTime * 60);
    setSprintStartWords(sprintText.split(/\s+/).filter(w => w).length);
    setSprintWords(0);
    setSprintRunning(true);
  };
 
  const pauseSprint = () => {
    setSprintRunning(false);
    clearInterval(sprintIntervalRef.current);
  };
 
  const resumeSprint = () => {
    setSprintRunning(true);
  };
 
  const resetSprint = () => {
    setSprintRunning(false);
    setSprintTimeLeft(0);
    setSprintWords(0);
    clearInterval(sprintIntervalRef.current);
  };
 
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
 
  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };
 
  const getDateKey = (date) => date.toISOString().split('T')[0];
 
  const saveGoal = () => {
    if (!selectedDate) return;
    const key = getDateKey(selectedDate);
    setWritingGoals(prev => ({
      ...prev,
      [key]: { ...goalForm, completed: false }
    }));
    updateUser({
      writingGoals: {
        ...(user.writingGoals || {}),
        [key]: { ...goalForm, completed: false }
      }
    });
    setShowGoalModal(false);
    notify('Goal saved!');
  };
 
  const toggleGoalComplete = (dateKey) => {
    const goal = writingGoals[dateKey] || user?.writingGoals?.[dateKey];
    if (!goal) return;
    const updated = { ...goal, completed: !goal.completed };
    setWritingGoals(prev => ({ ...prev, [dateKey]: updated }));
    updateUser({
      writingGoals: { ...(user.writingGoals || {}), [dateKey]: updated }
    });
  };
 
  const notify = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
 
  const updateUser = (changes) => {
    if (!user) return;
    const updated = { ...user, ...changes };
    setUser(updated);
    setData(prev => ({ ...prev, users: { ...prev.users, [user.username]: updated } }));
  };
 
  const getTotalWords = () => user?.projects?.reduce((s, p) => s + (p.content?.split(/\s+/).filter(w => w).length || 0), 0) || 0;
 
  // Auth
  const handleLogin = () => {
    const u = data.users[loginForm.username];
    if (u && u.pass === loginForm.password) {
      setUser(u);
      setLoginForm({ username: '', password: '', name: '' });
    } else {
      notify('Invalid credentials', 'error');
    }
  };
 
  const handleRegister = () => {
    if (!loginForm.username || !loginForm.password || !loginForm.name) {
      notify('Please fill all fields', 'error');
      return;
    }
    if (data.users[loginForm.username]) {
      notify('Username taken', 'error');
      return;
    }
    const newUser = createUser(loginForm.username, loginForm.name, loginForm.password);
    setData(prev => ({ ...prev, users: { ...prev.users, [loginForm.username]: newUser } }));
    setUser(newUser);
    setLoginForm({ username: '', password: '', name: '' });
    notify('Welcome to Echo!');
  };
 
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { updateUser({ profileImage: reader.result }); notify('Profile updated'); };
      reader.readAsDataURL(file);
    }
  };
 
  // Editor - Advanced AI-based editing
  const handleImprove = async () => {
    if (!editorContent.trim()) {
      notify('Enter some text first', 'error');
      return;
    }
    if (!selectedTool) {
      notify('Select an editing tool first', 'error');
      return;
    }
   
    // Get selected options for this tool, default to first option if none selected
    const toolOptions = selectedOptions[selectedTool] || [];
    if (toolOptions.length === 0) {
      const tool = EDIT_TOOLS.find(t => t.id === selectedTool);
      if (tool?.options?.length > 0) {
        // Default to first option
        toolOptions.push(tool.options[0].id);
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
 
  const getSelectedOptionsForTool = (toolId) => {
    return selectedOptions[toolId] || [];
  };
 
  // Projects
  const handleSaveProject = () => {
    if (!projectTitle.trim()) { notify('Enter a title', 'error'); return; }
    const project = {
      id: editingProjectId || Date.now(),
      title: projectTitle.trim(),
      content: projectContent,
      status: projectStatus,
      createdAt: editingProjectId ? user.projects.find(p => p.id === editingProjectId)?.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    updateUser({
      projects: editingProjectId ? user.projects.map(p => p.id === editingProjectId ? project : p) : [...(user.projects || []), project]
    });
    setEditingProjectId(project.id);
    notify('Saved');
  };
 
  const handleContinueProject = (p) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    setProjectContent(p.content);
    setProjectStatus(p.status || 'Draft');
    setShowProjectForm(true);
    setView('projects');
  };
 
  const handleDeleteProject = (id) => {
    updateUser({ projects: (user.projects || []).filter(p => p.id !== id) });
    if (editingProjectId === id) { setEditingProjectId(null); setProjectTitle(''); setProjectContent(''); setShowProjectForm(false); }
    notify('Deleted');
  };
 
  const handleNewProject = () => { setEditingProjectId(null); setProjectTitle(''); setProjectContent(''); setProjectStatus('Draft'); setShowProjectForm(true); };
 
  // AI Chat
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
   
    // Create new chat if needed
    if (!currentId || !sessions.find(c => c.id === currentId)) {
      const newChat = { id: Date.now(), title: 'New conversation', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      sessions = [...sessions, newChat];
      currentId = newChat.id;
    }
   
    const userMessage = { role: 'user', text: aiInput };
    const inputText = aiInput;
    setAiInput('');
   
    // Get the current chat for history
    const currentChat = sessions.find(c => c.id === currentId);
   
    // Add user message immediately so it shows in UI
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
      const aiResponse = await generateAIResponse(inputText, context);
      const aiMessage = { role: 'ai', text: aiResponse };
     
      // Add AI response using the sessionsWithUserMsg we already have
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
 
  // Settings
  const handleSettingChange = (key, value) => updateUser({ settings: { ...(user.settings || DEFAULT_SETTINGS), [key]: value } });
  const handleGenreChange = (genre) => { updateUser({ genre }); notify('Genre updated'); };
 
  // ============ AUTH SCREEN ============
  if (!user) {
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
            <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Username" />
            <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Password" />
            {authMode === 'register' && (
              <input type="text" value={loginForm.name} onChange={e => setLoginForm({...loginForm, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Display Name" />
            )}
            <button onClick={authMode === 'login' ? handleLogin : handleRegister} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
              {authMode === 'login' ? 'Sign In' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  const plan = PLANS[user.subscription] || PLANS.free;
  const totalWords = getTotalWords();
  const settings = user.settings || DEFAULT_SETTINGS;
 
  const NAV = [
    { id: 'home', icon: Icons.home, label: 'Dashboard' },
    { id: 'editor', icon: Icons.edit, label: 'Editor' },
    { id: 'projects', icon: Icons.folder, label: 'Projects' },
    { id: 'sprints', icon: Icons.timer, label: 'Writing Sprints' },
    { id: 'focus', icon: Icons.focus, label: 'Focus Mode' },
    { id: 'calendar', icon: Icons.calendar, label: 'Calendar' },
    { id: 'assistant', icon: Icons.message, label: 'AI Assistant' },
    { id: 'analytics', icon: Icons.chart, label: 'Analytics', locked: !plan.hasAnalytics },
    { id: 'settings', icon: Icons.settings, label: 'Settings' },
  ];
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>
     
      {/* Header */}
      <header className="relative bg-slate-800/30 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Icons.menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
              <EchoLogo size={32} />
              <span className="text-lg font-semibold hidden sm:block">Echo</span>
            </div>
          </div>
         
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Icons.book className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-slate-300">{totalWords.toLocaleString()} words</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('settings')}>
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
     
      <div className="relative flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-slate-800/50 backdrop-blur-xl border-r border-white/5 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-16 lg:pt-0`}>
          <nav className="p-4 space-y-1">
            {NAV.map(item => (
              <button key={item.id} onClick={() => { if (!item.locked) { setView(item.id); setSidebarOpen(false); } }} disabled={item.locked} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${view === item.id ? 'bg-gradient-to-r from-white/10 to-indigo-500/10 text-white border border-white/10' : item.locked ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.locked && <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded-full">Pro</span>}
              </button>
            ))}
            <hr className="border-white/5 my-4" />
            <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <Icons.logout className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>
       
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
       
        {/* Main */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
         
          {/* Dashboard */}
          {view === 'home' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10">
                <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
              </div>
             
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Words', value: totalWords.toLocaleString() },
                  { label: 'Projects', value: (user.projects || []).length },
                  { label: 'Sessions', value: user.stats?.sessionsCompleted || 0 },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl p-5 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
             
              <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="font-semibold">Recent Projects</h2>
                  <button onClick={() => { handleNewProject(); setView('projects'); }} className="text-sm text-indigo-400 hover:text-indigo-300">New Project</button>
                </div>
                <div className="divide-y divide-white/5">
                  {(user.projects || []).slice(0, 3).map(p => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-slate-400 text-sm">{p.content?.split(/\s+/).filter(w=>w).length || 0} words</p>
                      </div>
                      <button onClick={() => handleContinueProject(p)} className="ml-4 text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Continue</button>
                    </div>
                  ))}
                  {(!user.projects || user.projects.length === 0) && (
                    <div className="p-8 text-center text-slate-500">No projects yet</div>
                  )}
                </div>
              </div>
             
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Icons.edit, title: 'Editor', desc: 'Write and improve with AI', view: 'editor' },
                  { icon: Icons.message, title: 'AI Assistant', desc: 'Get personalized help', view: 'assistant' },
                ].map((item, i) => (
                  <button key={i} onClick={() => setView(item.view)} className="bg-slate-800/30 backdrop-blur hover:bg-slate-800/50 rounded-xl p-5 border border-white/5 text-left transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
         
          {/* Editor */}
          {view === 'editor' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Editor</h1>
                <span className="text-sm text-slate-400">{editorContent.split(/\s+/).filter(w=>w).length} words</span>
              </div>
             
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Main Editor Panel */}
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                  {/* Text Area */}
                  <textarea
                    value={editorContent}
                    onChange={e => setEditorContent(e.target.value)}
                    placeholder="Paste or write your text here..."
                    className="w-full flex-1 min-h-[300px] bg-transparent text-white p-4 focus:outline-none resize-none text-sm leading-relaxed placeholder-slate-500"
                  />
                 
                  {/* Improve Button */}
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
               
                {/* Tools Panel */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5">
                    <h2 className="font-semibold">Editing Tools</h2>
                    <p className="text-xs text-slate-400 mt-1">Click to select, expand for options</p>
                  </div>
                 
                  <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
                    {EDIT_TOOLS.map(tool => (
                      <div key={tool.id} className="rounded-xl overflow-hidden">
                        {/* Tool Header */}
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
                       
                        {/* Tool Options Dropdown */}
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
                 
                  {/* Selected Summary */}
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
              </div>
             
              {/* Results Panel */}
              {editResult && !editResult.error && (
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
                  {/* Feedback Summary */}
                  <div className="p-4 border-b border-white/5 bg-gradient-to-r from-green-600/10 to-emerald-600/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-green-400 flex items-center gap-2">
                          <Icons.check className="w-5 h-5" /> Edit Complete
                        </h3>
                        <p className="text-sm text-slate-300 mt-1">{editResult.feedback}</p>
                      </div>
                      {editResult.stats && (
                        <div className="text-right text-sm">
                          <p className="text-slate-400">{editResult.stats.wordsBefore} → {editResult.stats.wordsAfter} words</p>
                          <p className="text-indigo-400">{editResult.stats.changesCount || editResult.changes?.length || 0} changes</p>
                        </div>
                      )}
                    </div>
                  </div>
                 
                  <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    {/* Changes List */}
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Changes Made</h4>
                      {editResult.changes && editResult.changes.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {editResult.changes.map((change, i) => (
                            <button
                              key={i}
                              onClick={() => setHighlightedChangeIdx(highlightedChangeIdx === i ? null : i)}
                              className={`w-full text-left p-3 rounded-xl transition-all ${
                                highlightedChangeIdx === i
                                  ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30'
                                  : 'bg-slate-900/50 hover:bg-slate-900/80'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-red-400/80 line-through text-sm flex-1">{change.original}</span>
                              </div>
                              <div className="flex items-start gap-2 mt-1">
                                <span className="text-green-400 text-sm flex-1">{change.revised}</span>
                              </div>
                              {change.reason && (
                                <p className="text-xs text-slate-500 mt-2 italic">{change.reason}</p>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No specific changes tracked</p>
                      )}
                    </div>
                   
                    {/* Improved Text Preview */}
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Improved Version</h4>
                      <div className="bg-slate-900/50 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {highlightedChangeIdx !== null && editResult.changes[highlightedChangeIdx] ? (
                            // Highlight the selected change in the text
                            editResult.result.split(editResult.changes[highlightedChangeIdx].revised).map((part, i, arr) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <mark className="bg-indigo-500/30 text-indigo-200 px-1 rounded">
                                    {editResult.changes[highlightedChangeIdx].revised}
                                  </mark>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            editResult.result
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                 
                  {/* Action Buttons */}
                  <div className="p-4 border-t border-white/5 flex gap-3">
                    <button
                      onClick={handleAcceptEdit}
                      className="flex-1 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800"
                    >
                      <Icons.check className="w-5 h-5" /> Accept Changes
                    </button>
                    <button
                      onClick={() => { setEditResult(null); setHighlightedChangeIdx(null); }}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2"
                    >
                      <Icons.x className="w-5 h-5" /> Dismiss
                    </button>
                  </div>
                </div>
              )}
             
              {/* Error State */}
              {editResult && editResult.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-red-400">{editResult.feedback}</p>
                  <button onClick={() => setEditResult(null)} className="mt-2 text-sm text-slate-400 hover:text-white">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
         
          {/* Projects */}
          {view === 'projects' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Projects</h1>
                <button onClick={handleNewProject} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 transition-all">
                  <Icons.plus className="w-4 h-4" /> New Project
                </button>
              </div>
             
              {showProjectForm && (
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex flex-wrap items-center gap-4">
                    <input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project title" className="flex-1 min-w-[200px] bg-transparent text-lg font-semibold focus:outline-none placeholder-slate-500" />
                    <select value={projectStatus} onChange={e => setProjectStatus(e.target.value)} className="bg-slate-700 rounded-lg px-3 py-2 text-sm">
                      <option>Draft</option>
                      <option>In Progress</option>
                      <option>Complete</option>
                    </select>
                    <button onClick={() => setShowProjectForm(false)} className="text-slate-400 hover:text-white px-3 py-2 text-sm transition-colors">Cancel</button>
                    <button onClick={handleSaveProject} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">Save</button>
                  </div>
                  <textarea value={projectContent} onChange={e => setProjectContent(e.target.value)} placeholder="Start writing..." className="w-full h-64 bg-transparent text-white p-4 focus:outline-none resize-none text-sm leading-relaxed placeholder-slate-500" />
                </div>
              )}
             
              {(user.projects || []).length === 0 && !showProjectForm ? (
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                    <Icons.edit className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">Create your first project to start organizing your writing. Projects help you keep your work organized and track progress.</p>
                  <button onClick={handleNewProject} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
                    Create Your First Project
                  </button>
                 
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-sm text-slate-500 mb-4">Or try the Editor for quick writing</p>
                    <button onClick={() => setView('editor')} className="text-indigo-400 hover:text-indigo-300 text-sm">
                      Open Editor →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {(user.projects || []).map(p => (
                    <div key={p.id} className={`bg-slate-800/30 backdrop-blur rounded-xl border p-4 transition-all ${editingProjectId === p.id ? 'border-indigo-500/50' : 'border-white/5'}`}>
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold">{p.title}</h3>
                          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{p.content}</p>
                          <p className="text-slate-500 text-xs mt-2">{p.content?.split(/\s+/).filter(w=>w).length || 0} words</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => handleContinueProject(p)} className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">Continue</button>
                          <button onClick={() => handleDeleteProject(p.id)} className="text-slate-400 hover:text-red-400 p-2 transition-colors">
                            <Icons.trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
         
          {/* AI Assistant */}
          {view === 'assistant' && (
            <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
              <div className="grid md:grid-cols-4 gap-4 h-full">
                {/* Sidebar */}
                <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 flex flex-col">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium">History</span>
                    <button onClick={handleNewChat} className="text-indigo-400 hover:text-indigo-300 text-sm">New</button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {(user.chatSessions || []).length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        <p>No conversations</p>
                        <button onClick={handleNewChat} className="text-indigo-400 mt-2">Start one</button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {[...(user.chatSessions || [])].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(chat => (
                          <div key={chat.id} className={`group relative rounded-lg transition-colors ${user.currentChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                            <button onClick={() => handleSelectChat(chat.id)} className="w-full p-2 text-left">
                              <p className="text-sm truncate">{chat.title}</p>
                              <p className="text-xs text-slate-500">{chat.messages.length} messages</p>
                            </button>
                            <button onClick={() => handleDeleteChat(chat.id)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1">
                              <Icons.x className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
               
                {/* Chat */}
                <div className="md:col-span-3 bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 flex flex-col">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">AI Writing Assistant</h2>
                      <p className="text-sm text-slate-400">
                        {aiPersonality.charAt(0).toUpperCase() + aiPersonality.slice(1)} mode • {user.genre}
                      </p>
                    </div>
                    <button onClick={() => setShowPersonalityModal(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Personality & Context">
                      <Icons.smile className="w-5 h-5 text-yellow-400" />
                    </button>
                  </div>
                 
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!getCurrentChat() || getCurrentChat()?.messages.length === 0 ? (
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
                      getCurrentChat()?.messages.map((m, i) => (
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
                      <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendAI(); }}} placeholder="Ask me anything..." className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500" disabled={aiLoading} />
                      <button onClick={handleSendAI} disabled={aiLoading || !aiInput.trim()} className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30 disabled:ring-0 disabled:shadow-none">
                        <Icons.send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Personality Modal */}
              {showPersonalityModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPersonalityModal(false)}>
                  <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icons.smile className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-semibold">AI Personality</h3>
                      </div>
                      <button onClick={() => setShowPersonalityModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Icons.x className="w-5 h-5" />
                      </button>
                    </div>
                   
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Choose Personality</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'helpful', label: 'Helpful', emoji: '🤝', desc: 'Supportive & informative' },
                            { id: 'witty', label: 'Witty', emoji: '😄', desc: 'Clever with humor' },
                            { id: 'mentor', label: 'Mentor', emoji: '🎓', desc: 'Wise & encouraging' },
                            { id: 'casual', label: 'Casual', emoji: '😎', desc: 'Relaxed & friendly' },
                            { id: 'professional', label: 'Professional', emoji: '💼', desc: 'Formal & precise' },
                          ].map(p => (
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
                     
                      <button onClick={saveAiSettings} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 py-3 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
         
          {/* Writing Sprints */}
          {view === 'sprints' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Writing Sprints</h1>
                <div className="flex items-center gap-2">
                  <Icons.flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">{currentStreak} day streak</span>
                </div>
              </div>
             
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Sprint Timer */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
                    {/* Timer Display */}
                    <div className="p-8 text-center border-b border-white/5 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10">
                      <div className="text-7xl font-mono font-bold mb-4">
                        {sprintTimeLeft > 0 ? formatTime(sprintTimeLeft) : formatTime(sprintTime * 60)}
                      </div>
                      <div className="flex items-center justify-center gap-8 text-sm">
                        <div>
                          <span className="text-slate-400">Words Written</span>
                          <p className="text-2xl font-bold text-green-400">{sprintWords}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Goal</span>
                          <p className="text-2xl font-bold">{sprintWordGoal}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Progress</span>
                          <p className="text-2xl font-bold text-indigo-400">{sprintWordGoal > 0 ? Math.round((sprintWords / sprintWordGoal) * 100) : 0}%</p>
                        </div>
                      </div>
                     
                      {/* Progress Bar */}
                      <div className="mt-6 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${Math.min((sprintWords / sprintWordGoal) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                   
                    {/* Controls */}
                    <div className="p-6">
                      {!sprintRunning && sprintTimeLeft === 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm text-slate-400 mb-2">Duration (minutes)</label>
                              <select
                                value={sprintTime}
                                onChange={e => setSprintTime(Number(e.target.value))}
                                className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                {[5, 10, 15, 20, 25, 30, 45, 60].map(m => (
                                  <option key={m} value={m}>{m} min</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-slate-400 mb-2">Word Goal</label>
                              <select
                                value={sprintWordGoal}
                                onChange={e => setSprintWordGoal(Number(e.target.value))}
                                className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                {[100, 250, 500, 750, 1000, 1500, 2000].map(w => (
                                  <option key={w} value={w}>{w} words</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={startSprint}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20"
                          >
                            <Icons.play className="w-6 h-6" /> Start Sprint
                          </button>
                        </>
                      ) : (
                        <div className="flex gap-4">
                          {sprintRunning ? (
                            <button
                              onClick={pauseSprint}
                              className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                              <Icons.pause className="w-5 h-5" /> Pause
                            </button>
                          ) : (
                            <button
                              onClick={resumeSprint}
                              className="flex-1 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                            >
                              <Icons.play className="w-5 h-5" /> Resume
                            </button>
                          )}
                          <button
                            onClick={resetSprint}
                            className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                          >
                            <Icons.refresh className="w-5 h-5" /> Reset
                          </button>
                        </div>
                      )}
                    </div>
                   
                    {/* Writing Area */}
                    <div className="border-t border-white/5">
                      <textarea
                        value={sprintText}
                        onChange={e => setSprintText(e.target.value)}
                        placeholder={sprintRunning ? "Start writing! Every word counts..." : "Your sprint text will appear here..."}
                        className="w-full h-64 bg-transparent text-white p-6 focus:outline-none resize-none text-lg leading-relaxed placeholder-slate-500"
                        disabled={!sprintRunning && sprintTimeLeft === 0}
                      />
                    </div>
                  </div>
                </div>
               
                {/* Sprint History & Stats */}
                <div className="space-y-4">
                  <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Icons.award className="w-5 h-5 text-yellow-400" /> Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Total Sprints</span>
                        <span className="font-bold">{sprintHistory.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Completed</span>
                        <span className="font-bold text-green-400">{sprintHistory.filter(s => s.completed).length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Total Words</span>
                        <span className="font-bold">{sprintHistory.reduce((s, h) => s + h.wordsWritten, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="text-slate-400">Best Sprint</span>
                        <span className="font-bold text-indigo-400">{sprintHistory.length > 0 ? Math.max(...sprintHistory.map(s => s.wordsWritten)) : 0} words</span>
                      </div>
                    </div>
                  </div>
                 
                  <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                    <h3 className="font-semibold mb-4">Recent Sprints</h3>
                    {sprintHistory.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No sprints yet. Start your first one!</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[...sprintHistory].reverse().slice(0, 10).map(sprint => (
                          <div key={sprint.id} className={`p-3 rounded-xl ${sprint.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{sprint.wordsWritten} words</span>
                              {sprint.completed && <Icons.check className="w-4 h-4 text-green-400" />}
                            </div>
                            <p className="text-xs text-slate-400">{sprint.duration} min • {new Date(sprint.date).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
         
          {/* Focus Mode */}
          {view === 'focus' && !focusMode && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-xl font-bold">Focus Mode</h1>
              <p className="text-slate-400">Enter a distraction-free writing environment with customizable ambiance.</p>
             
              <div className="grid md:grid-cols-2 gap-6">
                {/* Settings */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 space-y-6">
                  <h3 className="font-semibold">Session Settings</h3>
                 
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Word Goal</label>
                    <select
                      value={focusGoal}
                      onChange={e => setFocusGoal(Number(e.target.value))}
                      className="w-full bg-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[250, 500, 750, 1000, 1500, 2000, 3000, 5000].map(w => (
                        <option key={w} value={w}>{w} words</option>
                      ))}
                    </select>
                  </div>
                 
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Ambiance</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', label: 'None', icon: '🔇' },
                        { id: 'rain', label: 'Rain', icon: '🌧️' },
                        { id: 'forest', label: 'Forest', icon: '🌲' },
                        { id: 'cafe', label: 'Café', icon: '☕' },
                        { id: 'fire', label: 'Fireplace', icon: '🔥' },
                        { id: 'ocean', label: 'Ocean', icon: '🌊' },
                      ].map(amb => (
                        <button
                          key={amb.id}
                          onClick={() => setFocusAmbiance(amb.id)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            focusAmbiance === amb.id
                              ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-xl">{amb.icon}</span>
                          <p className="text-sm mt-1">{amb.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                 
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
                      <span>Show word count</span>
                      <button
                        onClick={() => setFocusShowStats(!focusShowStats)}
                        className={`w-12 h-6 rounded-full transition-all ${focusShowStats ? 'bg-indigo-600' : 'bg-slate-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${focusShowStats ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </label>
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer">
                      <span>Typewriter mode</span>
                      <button
                        onClick={() => setFocusTypewriter(!focusTypewriter)}
                        className={`w-12 h-6 rounded-full transition-all ${focusTypewriter ? 'bg-indigo-600' : 'bg-slate-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${focusTypewriter ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </label>
                  </div>
                </div>
               
                {/* Preview & Start */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 flex flex-col">
                  <h3 className="font-semibold mb-4">Ready to Focus?</h3>
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                      <Icons.focus className="w-12 h-12" />
                    </div>
                    <p className="text-slate-400 mb-6">
                      Focus mode hides all distractions and lets you concentrate on your writing.
                    </p>
                    <button
                      onClick={() => setFocusMode(true)}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Enter Focus Mode
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
         
          {/* Focus Mode Active */}
          {view === 'focus' && focusMode && (
            <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
              {/* Minimal Header */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setFocusMode(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <Icons.x className="w-5 h-5" />
                </button>
                {focusShowStats && (
                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <span>{focusText.split(/\s+/).filter(w => w).length} / {focusGoal} words</span>
                    <span>{Math.round((focusText.split(/\s+/).filter(w => w).length / focusGoal) * 100)}%</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{focusAmbiance !== 'none' ? '🎵 ' + focusAmbiance : ''}</span>
                </div>
              </div>
             
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                  style={{ width: `${Math.min((focusText.split(/\s+/).filter(w => w).length / focusGoal) * 100, 100)}%` }}
                />
              </div>
             
              {/* Writing Area */}
              <div className="flex-1 flex items-center justify-center p-8">
                <textarea
                  value={focusText}
                  onChange={e => setFocusText(e.target.value)}
                  placeholder="Begin writing..."
                  className={`w-full max-w-3xl h-full bg-transparent text-slate-200 focus:outline-none resize-none text-xl leading-relaxed placeholder-slate-600 ${focusTypewriter ? 'text-center' : ''}`}
                  autoFocus
                  style={{ caretColor: '#6366f1' }}
                />
              </div>
             
              {/* Goal Achievement */}
              {focusText.split(/\s+/).filter(w => w).length >= focusGoal && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/30 px-6 py-3 rounded-full flex items-center gap-3">
                  <Icons.check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Goal reached! Keep going or exit when ready.</span>
                </div>
              )}
            </div>
          )}
         
          {/* Calendar */}
          {view === 'calendar' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Writing Calendar</h1>
              </div>
             
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Icons.chevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold">
                      {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Icons.chevronRight className="w-5 h-5" />
                    </button>
                  </div>
                 
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm text-slate-500 py-2">{day}</div>
                    ))}
                  </div>
                 
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { firstDay, daysInMonth } = getDaysInMonth(calendarMonth);
                      const days = [];
                      const today = new Date();
                     
                      // Empty cells for days before the first day of the month
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="aspect-square" />);
                      }
                     
                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                        const dateKey = getDateKey(date);
                        const goal = writingGoals[dateKey] || user?.writingGoals?.[dateKey];
                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isPast = date < new Date(today.setHours(0,0,0,0));
                       
                        days.push(
                          <button
                            key={day}
                            onClick={() => setSelectedDate(date)}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${
                              isSelected
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                                : isToday
                                  ? 'bg-white/10 ring-1 ring-white/30'
                                  : 'hover:bg-white/5'
                            } ${isPast && !goal?.completed ? 'opacity-50' : ''}`}
                          >
                            <span className={isToday ? 'font-bold' : ''}>{day}</span>
                            {goal && (
                              <div className={`absolute bottom-1 w-2 h-2 rounded-full ${goal.completed ? 'bg-green-400' : 'bg-amber-400'}`} />
                            )}
                          </button>
                        );
                      }
                     
                      return days;
                    })()}
                  </div>
                 
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <span>Scheduled</span>
                    </div>
                  </div>
                </div>
               
                {/* Selected Day / Goal Setting */}
                <div className="space-y-4">
                  {selectedDate ? (
                    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6">
                      <h3 className="font-semibold mb-4">
                        {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                     
                      {(() => {
                        const dateKey = getDateKey(selectedDate);
                        const goal = writingGoals[dateKey] || user?.writingGoals?.[dateKey];
                       
                        if (goal) {
                          return (
                            <div className="space-y-4">
                              <div className={`p-4 rounded-xl ${goal.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{goal.type === 'words' ? 'Word Goal' : 'Time Goal'}</span>
                                  {goal.completed ? (
                                    <span className="text-green-400 text-sm flex items-center gap-1"><Icons.check className="w-4 h-4" /> Done</span>
                                  ) : (
                                    <span className="text-amber-400 text-sm">Pending</span>
                                  )}
                                </div>
                                <p className="text-2xl font-bold">{goal.target} {goal.type === 'words' ? 'words' : 'minutes'}</p>
                                {goal.time && <p className="text-sm text-slate-400 mt-1">Scheduled: {goal.time}</p>}
                              </div>
                              <button
                                onClick={() => toggleGoalComplete(dateKey)}
                                className={`w-full py-3 rounded-xl font-medium transition-all ${
                                  goal.completed
                                    ? 'bg-slate-700 hover:bg-slate-600'
                                    : 'bg-green-600 hover:bg-green-500'
                                }`}
                              >
                                {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                            </div>
                          );
                        }
                       
                        return (
                          <div className="space-y-4">
                            <p className="text-slate-400">No goal set for this day.</p>
                            <button
                              onClick={() => setShowGoalModal(true)}
                              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30"
                            >
                              Set a Goal
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6 text-center">
                      <Icons.calendar className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                      <p className="text-slate-400">Select a day to view or set a writing goal.</p>
                    </div>
                  )}
                 
                  {/* Quick Stats */}
                  <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                    <h3 className="font-semibold mb-4">This Month</h3>
                    <div className="space-y-3">
                      {(() => {
                        const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
                        const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
                        const allGoals = { ...user?.writingGoals, ...writingGoals };
                        const monthGoals = Object.entries(allGoals).filter(([key]) => {
                          const date = new Date(key);
                          return date >= monthStart && date <= monthEnd;
                        });
                        const completed = monthGoals.filter(([, g]) => g.completed).length;
                       
                        return (
                          <>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                              <span className="text-slate-400">Goals Set</span>
                              <span className="font-bold">{monthGoals.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                              <span className="text-slate-400">Completed</span>
                              <span className="font-bold text-green-400">{completed}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                              <span className="text-slate-400">Success Rate</span>
                              <span className="font-bold text-indigo-400">
                                {monthGoals.length > 0 ? Math.round((completed / monthGoals.length) * 100) : 0}%
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Goal Modal */}
              {showGoalModal && selectedDate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowGoalModal(false)}>
                  <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="font-semibold">Set Writing Goal</h3>
                      <button onClick={() => setShowGoalModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Icons.x className="w-5 h-5" />
                      </button>
                    </div>
                   
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-slate-400">
                        {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                     
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Goal Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setGoalForm(prev => ({ ...prev, type: 'words' }))}
                            className={`p-3 rounded-xl text-center transition-all ${
                              goalForm.type === 'words' ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <Icons.edit className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm">Words</span>
                          </button>
                          <button
                            onClick={() => setGoalForm(prev => ({ ...prev, type: 'time' }))}
                            className={`p-3 rounded-xl text-center transition-all ${
                              goalForm.type === 'time' ? 'bg-indigo-600/20 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <Icons.clock className="w-5 h-5 mx-auto mb-1" />
                            <span className="text-sm">Time</span>
                          </button>
                        </div>
                      </div>
                     
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">
                          Target ({goalForm.type === 'words' ? 'words' : 'minutes'})
                        </label>
                        <input
                          type="number"
                          value={goalForm.target}
                          onChange={e => setGoalForm(prev => ({ ...prev, target: Number(e.target.value) }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                     
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Scheduled Time (optional)</label>
                        <input
                          type="time"
                          value={goalForm.time}
                          onChange={e => setGoalForm(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                     
                      <button
                        onClick={saveGoal}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 rounded-xl font-medium transition-all ring-1 ring-indigo-500/30"
                      >
                        Save Goal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
         
          {/* Analytics */}
          {view === 'analytics' && plan.hasAnalytics && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-xl font-bold">Analytics</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Words', value: totalWords.toLocaleString() },
                  { label: 'Projects', value: (user.projects || []).length },
                  { label: 'Avg Words/Project', value: (user.projects || []).length ? Math.round(totalWords / user.projects.length).toLocaleString() : 0 },
                  { label: 'Sessions', value: user.stats?.sessionsCompleted || 0 },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/30 backdrop-blur rounded-xl p-5 border border-white/5">
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
         
          {/* Settings */}
          {view === 'settings' && (
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
                        {user.name?.[0]?.toUpperCase()}
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
          )}
        </main>
      </div>
     
      {toast && (
        <div className={`fixed bottom-4 right-4 px-5 py-3 rounded-xl shadow-2xl z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white text-sm font-medium`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}