export const RUBRICS = [
  {
    id: 'grammar',
    name: 'Grammar & Mechanics',
    icon: 'check',
    description: 'Spelling, punctuation, capitalization, and sentence structure',
    categories: [
      { name: 'Spelling', description: 'Correct spelling throughout' },
      { name: 'Punctuation', description: 'Proper use of commas, periods, quotes, etc.' },
      { name: 'Sentence Structure', description: 'Complete sentences, no run-ons or fragments' },
      { name: 'Capitalization', description: 'Correct capitalization of proper nouns and sentence starts' },
    ],
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary & Word Choice',
    icon: 'edit',
    description: 'Word variety, precise language, and sensory details',
    categories: [
      { name: 'Word Variety', description: 'Uses diverse vocabulary, avoids repetition' },
      { name: 'Precise Language', description: 'Chooses specific, accurate words' },
      { name: 'Sensory Details', description: 'Engages sight, sound, smell, taste, touch' },
      { name: 'Avoiding Repetition', description: 'Varies word choices and phrasing' },
    ],
  },
  {
    id: 'structure',
    name: 'Story Structure',
    icon: 'folder',
    description: 'Beginning, middle, end, pacing, conflict, and resolution',
    categories: [
      { name: 'Opening Hook', description: 'Grabs the reader\'s attention' },
      { name: 'Rising Action', description: 'Builds tension and develops conflict' },
      { name: 'Climax', description: 'Reaches a satisfying high point' },
      { name: 'Resolution', description: 'Wraps up the story meaningfully' },
    ],
  },
  {
    id: 'character',
    name: 'Character Development',
    icon: 'smile',
    description: 'Character depth, motivation, growth, and believability',
    categories: [
      { name: 'Character Introduction', description: 'Characters are clearly introduced' },
      { name: 'Motivation', description: 'Characters have clear goals and reasons' },
      { name: 'Growth/Arc', description: 'Characters change or learn through the story' },
      { name: 'Believability', description: 'Characters feel real and consistent' },
    ],
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    icon: 'message',
    description: 'Natural speech, attribution, and advancing plot through conversation',
    categories: [
      { name: 'Naturalism', description: 'Dialogue sounds like real people talking' },
      { name: 'Tags & Attribution', description: 'Clear who is speaking without overdoing it' },
      { name: 'Advancing Plot', description: 'Conversation moves the story forward' },
      { name: 'Distinct Voices', description: 'Each character sounds different' },
    ],
  },
];

export const FEEDBACK_FORMATS = [
  { id: 'report-card', name: 'Report Card', description: 'Letter grades with category scores' },
  { id: 'written', name: 'Written Feedback', description: 'Teacher-style narrative comments' },
  { id: 'rubric-table', name: 'Rubric Table', description: 'Scored grid (1-4 per criterion)' },
];
