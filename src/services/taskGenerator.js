const TASK_TEMPLATES = [
  // Weakness-based tasks
  { signal: 'weakness', match: 'Dialogue', title: 'Practice Writing Dialogue', description: 'Write a 200-word scene that is only dialogue between two characters.', difficulty: 'medium', view: 'editor' },
  { signal: 'weakness', match: 'Plotting', title: 'Outline a Short Story', description: 'Create a beginning, middle, and end outline for a story idea.', difficulty: 'easy', view: 'projects' },
  { signal: 'weakness', match: 'Description', title: 'Describe a Place', description: 'Write a vivid 150-word description of a place using all five senses.', difficulty: 'medium', view: 'editor' },
  { signal: 'weakness', match: 'Grammar', title: 'Edit for Clarity', description: 'Take a recent paragraph and run it through the AI editor for grammar improvements.', difficulty: 'easy', view: 'editor' },
  { signal: 'weakness', match: 'Character', title: 'Create a Character Profile', description: 'Write a detailed character profile: name, motivation, flaw, and a secret.', difficulty: 'medium', view: 'projects' },
  { signal: 'weakness', match: 'Pacing', title: 'Speed Up a Scene', description: 'Rewrite a slow scene using shorter sentences and more action.', difficulty: 'hard', view: 'editor' },
  { signal: 'weakness', match: 'World', title: 'Build a Setting', description: 'Create a one-page world-building document for a fictional place.', difficulty: 'medium', view: 'projects' },
  { signal: 'weakness', match: 'Voice', title: 'Find Your Voice', description: 'Write the same event from two different character perspectives.', difficulty: 'hard', view: 'editor' },

  // Goal-based tasks
  { signal: 'goal', match: 'Finish', title: 'Set a Completion Date', description: 'Pick a project and set a calendar goal for its completion.', difficulty: 'easy', view: 'calendar' },
  { signal: 'goal', match: 'Publish', title: 'Find a Contest', description: 'Browse the Extra Tools page and pick a contest to submit to.', difficulty: 'easy', view: 'tools' },
  { signal: 'goal', match: 'Improve', title: 'Use AI Editing', description: 'Select a paragraph and try 3 different AI editing tools on it.', difficulty: 'medium', view: 'editor' },
  { signal: 'goal', match: 'habit', title: 'Set a Daily Goal', description: 'Create a daily writing goal on the calendar page.', difficulty: 'easy', view: 'calendar' },
  { signal: 'goal', match: 'Start', title: 'Start a New Project', description: 'Create a new project with a title and opening paragraph.', difficulty: 'easy', view: 'projects' },

  // Habit-based tasks
  { signal: 'habit', match: 'rarely', title: 'Do a Quick Sprint', description: 'Try a 5-minute writing sprint to build momentum.', difficulty: 'easy', view: 'sprints' },
  { signal: 'habit', match: 'sometimes', title: 'Schedule Writing Time', description: 'Set 3 writing goals on your calendar for this week.', difficulty: 'easy', view: 'calendar' },
  { signal: 'habit', match: 'morning', title: 'Morning Sprint', description: 'Start your day with a 10-minute writing sprint.', difficulty: 'medium', view: 'sprints' },
  { signal: 'habit', match: 'evening', title: 'Evening Focus Session', description: 'Try a focus mode session before bed tonight.', difficulty: 'medium', view: 'focus' },

  // Strength-based tasks
  { signal: 'strength', match: 'Dialogue', title: 'Write a Dialogue Scene', description: 'Use your dialogue skills to write a conversation that reveals character.', difficulty: 'medium', view: 'editor' },
  { signal: 'strength', match: 'Description', title: 'Paint with Words', description: 'Write a 300-word descriptive passage that transports the reader.', difficulty: 'medium', view: 'editor' },
  { signal: 'strength', match: 'Character', title: 'Deep Character Study', description: 'Write a monologue from a character unlike yourself.', difficulty: 'hard', view: 'editor' },
  { signal: 'strength', match: 'Plotting', title: 'Plot a Twist', description: 'Outline a story with a surprise ending the reader won\'t see coming.', difficulty: 'hard', view: 'projects' },

  // Growth-based tasks
  { signal: 'growth', match: 'experiment', title: 'Try a New Genre', description: 'Write 200 words in a genre you\'ve never tried before.', difficulty: 'medium', view: 'editor' },
  { signal: 'growth', match: 'feedback', title: 'Ask the AI for Feedback', description: 'Share a paragraph with the AI Assistant and ask for honest feedback.', difficulty: 'easy', view: 'assistant' },
  { signal: 'growth', match: 'read', title: 'Check Out a Book', description: 'Browse recommended books on the Extra Tools page and pick one.', difficulty: 'easy', view: 'tools' },
  { signal: 'growth', match: 'technique', title: 'Study a Technique', description: 'Ask the AI Assistant to explain a writing technique and give you an exercise.', difficulty: 'medium', view: 'assistant' },
  { signal: 'growth', match: 'confidence', title: 'Celebrate a Win', description: 'Reread something you wrote and highlight what you like about it.', difficulty: 'easy', view: 'projects' },
];

// Always-available fallback tasks (large pool to always fill 7 slots)
const FALLBACK_TASKS = [
  { title: 'Free Write for 10 Minutes', description: 'Open the editor and write whatever comes to mind. No editing allowed!', difficulty: 'easy', view: 'editor' },
  { title: 'Start a Writing Sprint', description: 'Challenge yourself with a timed writing sprint.', difficulty: 'medium', view: 'sprints' },
  { title: 'Chat with Your AI Assistant', description: 'Ask Echo for a writing prompt or creative advice.', difficulty: 'easy', view: 'assistant' },
  { title: 'Grade Your Writing', description: 'Use the AI Grader to get feedback on a piece of writing.', difficulty: 'easy', view: 'grader' },
  { title: 'Try Focus Mode', description: 'Write distraction-free with ambient sounds in Focus Mode.', difficulty: 'easy', view: 'focus' },
  { title: 'Set a Calendar Goal', description: 'Pick a day on the calendar and set a writing goal for yourself.', difficulty: 'easy', view: 'calendar' },
  { title: 'Explore Writing Contests', description: 'Browse the Extra Tools page for contests that match your interests.', difficulty: 'easy', view: 'tools' },
  { title: 'Write a Poem', description: 'Open the editor and write a short poem about something you see right now.', difficulty: 'medium', view: 'editor' },
  { title: 'Describe Your Favorite Place', description: 'Write a vivid paragraph about a place that makes you happy.', difficulty: 'easy', view: 'editor' },
  { title: 'Write a Letter to Your Future Self', description: 'Open a new project and write a letter to yourself one year from now.', difficulty: 'easy', view: 'projects' },
  { title: 'Try the Enhance Tool', description: 'Paste a paragraph into the Editor and use the Enhance tool to improve it.', difficulty: 'easy', view: 'editor' },
  { title: 'Create a Character', description: 'Write a short character sketch: name, age, biggest fear, and a secret.', difficulty: 'medium', view: 'editor' },
  { title: 'Write a Six-Word Story', description: 'Challenge: tell a complete story in exactly six words.', difficulty: 'hard', view: 'editor' },
  { title: 'Start a New Project', description: 'Create a brand new project with a title and opening paragraph.', difficulty: 'easy', view: 'projects' },
  { title: 'Do a 5-Minute Sprint', description: 'Set the timer to 5 minutes and write as fast as you can.', difficulty: 'easy', view: 'sprints' },
  { title: 'Ask for a Writing Prompt', description: 'Ask the AI Assistant to give you a creative writing prompt.', difficulty: 'easy', view: 'assistant' },
  { title: 'Review Your Analytics', description: 'Check the Analytics page to see your writing progress.', difficulty: 'easy', view: 'analytics' },
  { title: 'Write a Conversation', description: 'Write a dialogue between two people who disagree about something small.', difficulty: 'medium', view: 'editor' },
  { title: 'Rewrite a Scene', description: 'Pick something you already wrote and rewrite it from a different perspective.', difficulty: 'hard', view: 'editor' },
  { title: 'Write About Today', description: 'Write a short journal entry about what happened today.', difficulty: 'easy', view: 'editor' },
];

const TARGET_TASK_COUNT = 7;

export function generateTasks(profile, completedTaskTitles = []) {
  const completed = new Set(completedTaskTitles);

  if (!profile) {
    const tasks = FALLBACK_TASKS.filter(t => !completed.has(t.title));
    return tasks.slice(0, TARGET_TASK_COUNT);
  }

  const matched = [];
  const profileSignals = {
    weakness: profile.weaknesses || [],
    goal: profile.goals || [],
    habit: [profile.writingHabits?.frequency, profile.writingHabits?.bestTime].filter(Boolean),
    strength: profile.strengths || [],
    growth: profile.growthAreas || [],
  };

  for (const template of TASK_TEMPLATES) {
    const values = profileSignals[template.signal] || [];
    const matches = values.some(v =>
      v.toLowerCase().includes(template.match.toLowerCase()) ||
      template.match.toLowerCase().includes(v.toLowerCase())
    );
    if (matches && !completed.has(template.title)) {
      matched.push(template);
    }
  }

  // Always return exactly 7 tasks, filling from fallbacks as needed
  const tasks = matched.slice(0, TARGET_TASK_COUNT);
  const usedTitles = new Set(tasks.map(t => t.title));

  for (const fallback of FALLBACK_TASKS) {
    if (tasks.length >= TARGET_TASK_COUNT) break;
    if (!completed.has(fallback.title) && !usedTitles.has(fallback.title)) {
      tasks.push(fallback);
      usedTitles.add(fallback.title);
    }
  }

  return tasks.slice(0, TARGET_TASK_COUNT);
}
