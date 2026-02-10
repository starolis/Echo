export const DEFAULT_SETTINGS = {
  theme: 'dark', fontSize: 'medium', fontFamily: 'system',
  editorTheme: 'dark', autoSave: true, spellCheck: true,
  aiTone: 'friendly', aiVerbosity: 'balanced',
};

export const SETTING_OPTIONS = {
  theme: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }],
  fontSize: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }],
  fontFamily: [{ value: 'system', label: 'System' }, { value: 'serif', label: 'Serif' }, { value: 'mono', label: 'Mono' }],
  aiTone: [{ value: 'formal', label: 'Formal' }, { value: 'friendly', label: 'Friendly' }, { value: 'casual', label: 'Casual' }],
  aiVerbosity: [{ value: 'concise', label: 'Concise' }, { value: 'balanced', label: 'Balanced' }, { value: 'detailed', label: 'Detailed' }],
};
