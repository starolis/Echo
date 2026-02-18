// ---------------------------------------------------------------------------
// Quiz Questions for onboarding personalization
// 8 categories x 5 questions = 40 total
// ---------------------------------------------------------------------------

export const QUIZ_QUESTIONS = [
  // ===================== 1. Writing Identity (q1-q5) =====================
  {
    id: 'q1',
    category: 'Writing Identity',
    question: 'How would you describe yourself as a writer?',
    type: 'single',
    options: [
      { value: 'fiction', label: 'Fiction storyteller' },
      { value: 'poet', label: 'Poet' },
      { value: 'journalist', label: 'Journalist / Non-fiction writer' },
      { value: 'screenwriter', label: 'Screenwriter / Playwright' },
      { value: 'explorer', label: 'A little bit of everything' },
    ],
  },
  {
    id: 'q2',
    category: 'Writing Identity',
    question: 'What\'s your experience level with writing?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Just getting started' },
      { value: 'intermediate', label: 'I\'ve been writing for a while' },
      { value: 'advanced', label: 'I\'m pretty experienced' },
      { value: 'published', label: 'I\'ve been published or shared my work publicly' },
    ],
  },
  {
    id: 'q3',
    category: 'Writing Identity',
    question: 'Which statement feels most like you?',
    type: 'single',
    options: [
      { value: 'dreamer', label: 'I have tons of ideas but struggle to finish things' },
      { value: 'grinder', label: 'I can power through a draft once I start' },
      { value: 'perfectionist', label: 'I rewrite the same paragraph until it\'s perfect' },
      { value: 'sporadic', label: 'I write in passionate bursts, then take long breaks' },
    ],
  },
  {
    id: 'q4',
    category: 'Writing Identity',
    question: 'What draws you to writing the most?',
    type: 'single',
    options: [
      { value: 'expression', label: 'Expressing my feelings and thoughts' },
      { value: 'storytelling', label: 'Creating worlds and characters' },
      { value: 'connection', label: 'Connecting with other people through words' },
      { value: 'escape', label: 'Escaping into my imagination' },
      { value: 'career', label: 'Building a career or platform' },
    ],
  },
  {
    id: 'q5',
    category: 'Writing Identity',
    question: 'What\'s your biggest writing aspiration?',
    type: 'single',
    options: [
      { value: 'novel', label: 'Finish a novel' },
      { value: 'collection', label: 'Publish a poetry or short story collection' },
      { value: 'audience', label: 'Build an audience for my writing' },
      { value: 'improve', label: 'Just get better at the craft' },
      { value: 'fun', label: 'Have fun and see where it goes' },
    ],
  },

  // ===================== 2. Genre & Style (q6-q10) =====================
  {
    id: 'q6',
    category: 'Genre & Style',
    question: 'Which genres do you love to write? Pick all that apply.',
    type: 'multi',
    options: [
      { value: 'literary-fiction', label: 'Literary Fiction' },
      { value: 'fantasy', label: 'Fantasy' },
      { value: 'scifi', label: 'Science Fiction' },
      { value: 'romance', label: 'Romance' },
      { value: 'mystery-thriller', label: 'Mystery/Thriller' },
      { value: 'horror', label: 'Horror' },
      { value: 'historical-fiction', label: 'Historical Fiction' },
      { value: 'young-adult', label: 'Young Adult' },
      { value: 'nonfiction', label: 'Non-Fiction' },
      { value: 'poetry', label: 'Poetry' },
    ],
  },
  {
    id: 'q7',
    category: 'Genre & Style',
    question: 'How would you describe your writing style?',
    type: 'single',
    options: [
      { value: 'descriptive', label: 'Rich and descriptive — I paint pictures with words' },
      { value: 'concise', label: 'Short and punchy — every word earns its place' },
      { value: 'conversational', label: 'Conversational — like talking to a friend' },
      { value: 'lyrical', label: 'Lyrical and poetic — rhythm matters to me' },
      { value: 'experimental', label: 'Experimental — I like breaking rules' },
    ],
  },
  {
    id: 'q8',
    category: 'Genre & Style',
    question: 'What tone do you naturally gravitate toward?',
    type: 'single',
    options: [
      { value: 'dark', label: 'Dark and moody' },
      { value: 'humorous', label: 'Funny and lighthearted' },
      { value: 'emotional', label: 'Emotional and heartfelt' },
      { value: 'suspenseful', label: 'Tense and suspenseful' },
      { value: 'whimsical', label: 'Whimsical and playful' },
    ],
  },
  {
    id: 'q9',
    category: 'Genre & Style',
    question: 'Which types of stories or authors inspire you? Pick all that fit.',
    type: 'multi',
    options: [
      { value: 'classic-lit', label: 'Classic literature (Austen, Bront\u00EB, Dickens)' },
      { value: 'modern-lit', label: 'Modern literary fiction (Murakami, Morrison)' },
      { value: 'ya-icons', label: 'YA icons (Riordan, Collins, Green)' },
      { value: 'epic-fantasy', label: 'Epic fantasy (Tolkien, Sanderson, Le Guin)' },
      { value: 'poets', label: 'Poets (Angelou, Plath, Kaur)' },
      { value: 'genre-masters', label: 'Genre masters (King, Christie, Asimov)' },
    ],
  },
  {
    id: 'q10',
    category: 'Genre & Style',
    question: 'Do you have a preferred niche or subgenre?',
    type: 'single',
    options: [
      { value: 'coming-of-age', label: 'Coming-of-age stories' },
      { value: 'dystopian', label: 'Dystopian / speculative worlds' },
      { value: 'romance-subplot', label: 'Romance and relationship-driven plots' },
      { value: 'whodunit', label: 'Whodunits and puzzle stories' },
      { value: 'slice-of-life', label: 'Slice-of-life and personal essays' },
      { value: 'none', label: 'I don\'t have one yet' },
    ],
  },

  // ===================== 3. Goals & Motivation (q11-q15) =====================
  {
    id: 'q11',
    category: 'Goals & Motivation',
    question: 'What are you working on right now (or want to start)?',
    type: 'single',
    options: [
      { value: 'novel', label: 'A novel or novella' },
      { value: 'short-stories', label: 'Short stories' },
      { value: 'poetry', label: 'Poetry' },
      { value: 'journal', label: 'A journal or personal writing' },
      { value: 'not-sure', label: 'Not sure yet — I\'m exploring' },
    ],
  },
  {
    id: 'q12',
    category: 'Goals & Motivation',
    question: 'What\'s your biggest writing goal right now?',
    type: 'single',
    options: [
      { value: 'finish-draft', label: 'Finish a first draft' },
      { value: 'write-daily', label: 'Build a daily writing habit' },
      { value: 'improve-craft', label: 'Improve my craft and technique' },
      { value: 'share-work', label: 'Share my work with others' },
      { value: 'find-voice', label: 'Find my unique voice' },
    ],
  },
  {
    id: 'q13',
    category: 'Goals & Motivation',
    question: 'What keeps you motivated to write?',
    type: 'single',
    options: [
      { value: 'passion', label: 'Pure love of storytelling' },
      { value: 'deadlines', label: 'Deadlines and accountability' },
      { value: 'feedback', label: 'Feedback and encouragement from others' },
      { value: 'progress', label: 'Seeing my progress over time' },
      { value: 'mood', label: 'Inspiration strikes and I ride the wave' },
    ],
  },
  {
    id: 'q14',
    category: 'Goals & Motivation',
    question: 'How do you define success as a writer?',
    type: 'single',
    options: [
      { value: 'published', label: 'Getting published' },
      { value: 'finished', label: 'Finishing what I start' },
      { value: 'moved-someone', label: 'Making someone feel something with my words' },
      { value: 'growth', label: 'Becoming a better writer than I was yesterday' },
      { value: 'community', label: 'Being part of a writing community' },
    ],
  },
  {
    id: 'q15',
    category: 'Goals & Motivation',
    question: 'How do you feel about deadlines?',
    type: 'single',
    options: [
      { value: 'love', label: 'Love them — they keep me on track' },
      { value: 'helpful', label: 'Helpful if they\'re flexible' },
      { value: 'stressful', label: 'Stressful but I need them' },
      { value: 'avoid', label: 'I\'d rather write at my own pace' },
    ],
  },

  // ===================== 4. Strengths & Weaknesses (q16-q20) =====================
  {
    id: 'q16',
    category: 'Strengths & Weaknesses',
    question: 'What do you think is your strongest writing skill?',
    type: 'single',
    options: [
      { value: 'dialogue', label: 'Writing dialogue' },
      { value: 'worldbuilding', label: 'Worldbuilding and settings' },
      { value: 'characters', label: 'Creating memorable characters' },
      { value: 'prose', label: 'Beautiful prose and word choice' },
      { value: 'plot', label: 'Plotting and story structure' },
    ],
  },
  {
    id: 'q17',
    category: 'Strengths & Weaknesses',
    question: 'Pick any other skills you feel confident about.',
    type: 'multi',
    options: [
      { value: 'voice', label: 'Strong narrative voice' },
      { value: 'pacing', label: 'Good pacing' },
      { value: 'emotion', label: 'Writing emotion and tension' },
      { value: 'humor', label: 'Humor and wit' },
      { value: 'research', label: 'Research and accuracy' },
      { value: 'editing', label: 'Self-editing' },
    ],
  },
  {
    id: 'q18',
    category: 'Strengths & Weaknesses',
    question: 'What\'s your weakest area as a writer?',
    type: 'single',
    options: [
      { value: 'plotting', label: 'Plotting and structure' },
      { value: 'dialogue', label: 'Writing realistic dialogue' },
      { value: 'description', label: 'Descriptive writing' },
      { value: 'editing', label: 'Editing and revising' },
      { value: 'consistency', label: 'Staying consistent and finishing' },
    ],
  },
  {
    id: 'q19',
    category: 'Strengths & Weaknesses',
    question: 'What\'s your biggest writing challenge day-to-day?',
    type: 'single',
    options: [
      { value: 'writers-block', label: 'Writer\'s block' },
      { value: 'time', label: 'Finding time to write' },
      { value: 'focus', label: 'Staying focused during sessions' },
      { value: 'self-doubt', label: 'Self-doubt and inner critic' },
      { value: 'starting', label: 'Getting started on something new' },
    ],
  },
  {
    id: 'q20',
    category: 'Strengths & Weaknesses',
    question: 'If you could magically improve one thing about your writing, what would it be?',
    type: 'single',
    options: [
      { value: 'endings', label: 'Writing satisfying endings' },
      { value: 'openings', label: 'Crafting compelling openings' },
      { value: 'showing', label: 'Show, don\'t tell' },
      { value: 'pacing', label: 'Better pacing' },
      { value: 'voice', label: 'A more distinctive voice' },
    ],
  },

  // ===================== 5. Writing Habits (q21-q25) =====================
  {
    id: 'q21',
    category: 'Writing Habits',
    question: 'When do you feel most creative?',
    type: 'single',
    options: [
      { value: 'morning', label: 'Early morning' },
      { value: 'afternoon', label: 'Afternoon' },
      { value: 'evening', label: 'Evening' },
      { value: 'late-night', label: 'Late at night' },
      { value: 'random', label: 'Whenever inspiration hits' },
    ],
  },
  {
    id: 'q22',
    category: 'Writing Habits',
    question: 'How often do you write?',
    type: 'single',
    options: [
      { value: 'daily', label: 'Every day' },
      { value: 'few-times', label: 'A few times a week' },
      { value: 'weekly', label: 'About once a week' },
      { value: 'sporadic', label: 'Whenever I feel like it' },
      { value: 'rarely', label: 'Not as often as I\'d like' },
    ],
  },
  {
    id: 'q23',
    category: 'Writing Habits',
    question: 'How long is a typical writing session for you?',
    type: 'single',
    options: [
      { value: 'short', label: 'Under 30 minutes' },
      { value: 'medium', label: '30 minutes to an hour' },
      { value: 'long', label: '1-2 hours' },
      { value: 'marathon', label: '2+ hours' },
      { value: 'varies', label: 'It really depends on the day' },
    ],
  },
  {
    id: 'q24',
    category: 'Writing Habits',
    question: 'Where do you like to write?',
    type: 'single',
    options: [
      { value: 'home', label: 'At home, in my own space' },
      { value: 'cafe', label: 'Coffee shops or cafes' },
      { value: 'library', label: 'The library' },
      { value: 'outdoors', label: 'Outdoors or in nature' },
      { value: 'anywhere', label: 'Anywhere I can open my laptop or notebook' },
    ],
  },
  {
    id: 'q25',
    category: 'Writing Habits',
    question: 'What\'s your preferred writing tool?',
    type: 'single',
    options: [
      { value: 'computer', label: 'Typing on a computer' },
      { value: 'phone', label: 'Typing on my phone or tablet' },
      { value: 'handwriting', label: 'Handwriting in a notebook' },
      { value: 'mix', label: 'A mix of digital and handwritten' },
    ],
  },

  // ===================== 6. Reading Preferences (q26-q30) =====================
  {
    id: 'q26',
    category: 'Reading Preferences',
    question: 'What do you read the most? Pick all that apply.',
    type: 'multi',
    options: [
      { value: 'novels', label: 'Novels' },
      { value: 'short-stories', label: 'Short stories' },
      { value: 'poetry', label: 'Poetry' },
      { value: 'comics', label: 'Comics and graphic novels' },
      { value: 'nonfiction', label: 'Non-fiction and essays' },
      { value: 'fanfiction', label: 'Fanfiction' },
    ],
  },
  {
    id: 'q27',
    category: 'Reading Preferences',
    question: 'What draws you into a story first?',
    type: 'single',
    options: [
      { value: 'characters', label: 'Fascinating characters' },
      { value: 'plot', label: 'A gripping plot' },
      { value: 'world', label: 'An immersive world' },
      { value: 'voice', label: 'A unique narrative voice' },
      { value: 'theme', label: 'A theme that resonates with me' },
    ],
  },
  {
    id: 'q28',
    category: 'Reading Preferences',
    question: 'What\'s your favorite element in a great story?',
    type: 'single',
    options: [
      { value: 'twist', label: 'A twist I never saw coming' },
      { value: 'emotional', label: 'An emotional gut punch' },
      { value: 'beautiful-prose', label: 'Sentences so beautiful I re-read them' },
      { value: 'complex-characters', label: 'Complex, morally grey characters' },
      { value: 'satisfying-ending', label: 'A deeply satisfying ending' },
    ],
  },
  {
    id: 'q29',
    category: 'Reading Preferences',
    question: 'How much do you read?',
    type: 'single',
    options: [
      { value: 'voracious', label: 'I devour books constantly' },
      { value: 'regular', label: 'I read regularly but not obsessively' },
      { value: 'sometimes', label: 'I go through reading phases' },
      { value: 'rarely', label: 'I don\'t read as much as I\'d like' },
    ],
  },
  {
    id: 'q30',
    category: 'Reading Preferences',
    question: 'How does reading influence your writing?',
    type: 'single',
    options: [
      { value: 'heavily', label: 'A lot — I borrow techniques from what I read' },
      { value: 'somewhat', label: 'Somewhat — it inspires my mood and themes' },
      { value: 'subconsciously', label: 'Probably more than I realize' },
      { value: 'separately', label: 'I keep reading and writing pretty separate' },
    ],
  },

  // ===================== 7. Creative Process (q31-q35) =====================
  {
    id: 'q31',
    category: 'Creative Process',
    question: 'Are you a planner or a pantser?',
    type: 'single',
    options: [
      { value: 'planner', label: 'Planner — I outline everything before I write' },
      { value: 'pantser', label: 'Pantser — I dive in and figure it out as I go' },
      { value: 'plantser', label: 'Plantser — a little of both' },
      { value: 'unsure', label: 'I\'m still figuring out what works for me' },
    ],
  },
  {
    id: 'q32',
    category: 'Creative Process',
    question: 'Where do your best ideas usually come from?',
    type: 'single',
    options: [
      { value: 'daydreaming', label: 'Daydreaming and imagination' },
      { value: 'real-life', label: 'Real-life experiences and observations' },
      { value: 'other-media', label: 'Other books, movies, or music' },
      { value: 'prompts', label: 'Writing prompts and exercises' },
      { value: 'conversations', label: 'Conversations and what-if questions' },
    ],
  },
  {
    id: 'q33',
    category: 'Creative Process',
    question: 'How do you feel about revising your work?',
    type: 'single',
    options: [
      { value: 'love', label: 'Love it — revision is where the magic happens' },
      { value: 'necessary', label: 'It\'s necessary but not my favorite part' },
      { value: 'struggle', label: 'I struggle to know what to change' },
      { value: 'avoid', label: 'I tend to avoid it if I can' },
    ],
  },
  {
    id: 'q34',
    category: 'Creative Process',
    question: 'How do you usually start a new piece of writing?',
    type: 'single',
    options: [
      { value: 'first-line', label: 'With a killer first line' },
      { value: 'character', label: 'With a character in mind' },
      { value: 'scene', label: 'With a scene or image' },
      { value: 'theme', label: 'With a theme or message' },
      { value: 'freewrite', label: 'I just start writing and see what happens' },
    ],
  },
  {
    id: 'q35',
    category: 'Creative Process',
    question: 'Do you prefer writing alone or collaborating?',
    type: 'single',
    options: [
      { value: 'solo', label: 'Totally solo — writing is personal' },
      { value: 'mostly-solo', label: 'Mostly solo, but I like sharing drafts' },
      { value: 'collaborative', label: 'I enjoy co-writing and brainstorming with others' },
      { value: 'community', label: 'I love being part of a writing group or community' },
    ],
  },

  // ===================== 8. Growth Areas (q36-q40) =====================
  {
    id: 'q36',
    category: 'Growth Areas',
    question: 'What writing skill do you most want to develop?',
    type: 'single',
    options: [
      { value: 'dialogue', label: 'Writing better dialogue' },
      { value: 'worldbuilding', label: 'Worldbuilding' },
      { value: 'structure', label: 'Story structure and plotting' },
      { value: 'prose-style', label: 'Prose style and voice' },
      { value: 'emotional-depth', label: 'Emotional depth in characters' },
    ],
  },
  {
    id: 'q37',
    category: 'Growth Areas',
    question: 'What kind of feedback helps you the most?',
    type: 'single',
    options: [
      { value: 'encouragement', label: 'Encouragement and what\'s working' },
      { value: 'constructive', label: 'Honest, constructive critique' },
      { value: 'specific', label: 'Specific line-by-line suggestions' },
      { value: 'big-picture', label: 'Big-picture story feedback' },
      { value: 'mixed', label: 'A mix of praise and critique' },
    ],
  },
  {
    id: 'q38',
    category: 'Growth Areas',
    question: 'How do you learn best as a writer?',
    type: 'single',
    options: [
      { value: 'reading', label: 'Reading great writing and studying it' },
      { value: 'practice', label: 'Practicing and writing a lot' },
      { value: 'courses', label: 'Taking classes or courses' },
      { value: 'feedback', label: 'Getting feedback on my work' },
      { value: 'teaching', label: 'Explaining writing concepts to others' },
    ],
  },
  {
    id: 'q39',
    category: 'Growth Areas',
    question: 'How do you feel about taking creative risks?',
    type: 'single',
    options: [
      { value: 'bold', label: 'I love experimenting and pushing boundaries' },
      { value: 'cautious', label: 'I\'ll try new things if I feel safe' },
      { value: 'comfort-zone', label: 'I mostly stick to what I know works' },
      { value: 'growing', label: 'I\'m learning to be braver with my writing' },
    ],
  },
  {
    id: 'q40',
    category: 'Growth Areas',
    question: 'What\'s the next step you want to take with your writing?',
    type: 'single',
    options: [
      { value: 'start-project', label: 'Start a new project' },
      { value: 'finish-project', label: 'Finish something I\'ve started' },
      { value: 'get-feedback', label: 'Get feedback on my work' },
      { value: 'learn-technique', label: 'Learn a new technique or form' },
      { value: 'write-more', label: 'Just write more often' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper: Build a lookup map { questionId -> { value -> label } }
// ---------------------------------------------------------------------------
const _optionLookup = {};
for (const q of QUIZ_QUESTIONS) {
  const map = {};
  for (const opt of q.options) {
    map[opt.value] = opt.label;
  }
  _optionLookup[q.id] = map;
}

/**
 * Resolve a single answer (value or array of values) to human-readable labels.
 * Returns a string for single answers, or an array of strings for multi answers.
 */
function resolveLabel(questionId, answer) {
  const map = _optionLookup[questionId];
  if (!map) return answer;

  if (Array.isArray(answer)) {
    return answer.map((v) => map[v] || v);
  }
  return map[answer] || answer;
}

/**
 * Safely resolve labels as an array — always returns an array even for single
 * answers so that profile fields expecting arrays stay consistent.
 */
function resolveLabels(questionId, answer) {
  const result = resolveLabel(questionId, answer);
  return Array.isArray(result) ? result : [result];
}

// ---------------------------------------------------------------------------
// Build a human-readable profile object from raw quiz answers
// ---------------------------------------------------------------------------

/**
 * @param {Object} answers - e.g. { q1: 'fiction', q6: ['fantasy', 'scifi'], ... }
 * @returns {Object} Human-readable writer profile
 */
export function buildProfileFromAnswers(answers = {}) {
  return {
    writerType: resolveLabel('q1', answers.q1),
    experience: resolveLabel('q2', answers.q2),
    goals: [
      ...resolveLabels('q11', answers.q11),
      ...resolveLabels('q12', answers.q12),
    ],
    strengths: [
      ...resolveLabels('q16', answers.q16),
      ...resolveLabels('q17', answers.q17),
    ],
    weaknesses: [
      ...resolveLabels('q18', answers.q18),
      ...resolveLabels('q20', answers.q20),
    ],
    preferredGenres: resolveLabels('q6', answers.q6),
    writingHabits: {
      bestTime: resolveLabel('q21', answers.q21),
      frequency: resolveLabel('q22', answers.q22),
    },
    readingPreferences: resolveLabels('q26', answers.q26),
    processStyle: resolveLabel('q31', answers.q31),
    growthAreas: [
      ...resolveLabels('q36', answers.q36),
      ...resolveLabels('q37', answers.q37),
    ],
  };
}
