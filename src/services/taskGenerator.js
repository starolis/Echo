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
  { signal: 'habit', match: 'night', title: 'Evening Focus Session', description: 'Try a focus mode session before bed tonight.', difficulty: 'medium', view: 'focus' },

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

// Always-available fallback tasks
const FALLBACK_TASKS = [
  { title: 'Free Write for 10 Minutes', description: 'Open the editor and write whatever comes to mind. No editing allowed!', difficulty: 'easy', view: 'editor' },
  { title: 'Start a Writing Sprint', description: 'Challenge yourself with a timed writing sprint.', difficulty: 'medium', view: 'sprints' },
  { title: 'Chat with Your AI Assistant', description: 'Ask Echo for a writing prompt or creative advice.', difficulty: 'easy', view: 'assistant' },
];

export function generateTasks(profile, completedTaskTitles = []) {
  if (!profile) return FALLBACK_TASKS;

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
    if (matches && !completedTaskTitles.includes(template.title)) {
      matched.push(template);
    }
  }

  // Return up to 5 tasks, mixing in fallbacks if needed
  const tasks = matched.slice(0, 5);
  if (tasks.length < 3) {
    for (const fallback of FALLBACK_TASKS) {
      if (tasks.length >= 3) break;
      if (!completedTaskTitles.includes(fallback.title) && !tasks.find(t => t.title === fallback.title)) {
        tasks.push(fallback);
      }
    }
  }

  return tasks;
}
