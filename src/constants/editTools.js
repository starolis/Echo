export const EDIT_TOOLS = [
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
