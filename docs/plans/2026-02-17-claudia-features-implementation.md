# Claudia's Feature Requests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 4 major features (Writer's Quiz, Theme System, Dashboard Tasks, Extra Tools) plus model update before Claudia's demo night tomorrow.

**Architecture:** All features build on the existing React Context + localStorage pattern. New components slot into the existing view routing in `App.jsx`. Quiz results and completed tasks are stored on the user object. Theme is applied via CSS classes on the app wrapper. No new dependencies needed.

**Tech Stack:** React 18, Tailwind CSS 3, Netlify Functions (CommonJS), Claude API (claude-sonnet-4-6)

---

### Task 1: Update Claude model to claude-sonnet-4-6

**Files:**
- Modify: `netlify/functions/ai-chat.cjs:66`
- Modify: `netlify/functions/ai-edit.cjs:101`
- Modify: `netlify/functions/ai-title.cjs:32`

**Step 1: Update all three model references**

In each file, change `'claude-sonnet-4-5-20250929'` to `'claude-sonnet-4-6'`.

**Step 2: Commit**

```bash
git add netlify/functions/ai-chat.cjs netlify/functions/ai-edit.cjs netlify/functions/ai-title.cjs
git commit -m "chore: update Claude model to claude-sonnet-4-6"
```

---

### Task 2: Create quiz questions data

**Files:**
- Create: `src/constants/quizQuestions.js`

**Step 1: Create the quiz data file**

Export a `QUIZ_QUESTIONS` array of 40 objects, 5 per category (8 categories). Each question object:

```js
{
  id: 'q1',
  category: 'Writing Identity',
  question: 'How would you describe yourself as a writer?',
  type: 'single', // or 'multi'
  options: [
    { value: 'fiction', label: 'Fiction storyteller' },
    { value: 'poet', label: 'Poet' },
    { value: 'journalist', label: 'Journalist / Nonfiction' },
    { value: 'screenwriter', label: 'Screenwriter / Playwright' },
  ]
}
```

8 categories, 5 questions each:
1. **Writing Identity** (q1-q5): writer type, experience level, identity, motivation source, aspiration
2. **Genre & Style** (q6-q10): favorite genre, style preference, tone preference, influences, subgenre
3. **Goals & Motivation** (q11-q15): current project, biggest goal, deadline driver, success definition, motivation
4. **Strengths & Weaknesses** (q16-q20): strongest skill, weakest area, natural talent, biggest challenge, improvement priority
5. **Writing Habits** (q21-q25): best time, frequency, session length, writing location, tools
6. **Reading Preferences** (q26-q30): favorite read genre, what draws them in, favorite aspect, reading frequency, influence on writing
7. **Creative Process** (q31-q35): planner vs pantser, idea source, revision approach, starting point, collaboration
8. **Growth Areas** (q36-q40): skill to develop, feedback preference, learning style, risk tolerance, next step

Also export a `buildProfileFromAnswers(answers)` function that converts raw answers into the profile summary object:

```js
export function buildProfileFromAnswers(answers) {
  return {
    writerType: answers.q1 || 'creative writer',
    experience: answers.q2 || 'intermediate',
    goals: [answers.q11, answers.q12].filter(Boolean),
    strengths: [answers.q16, answers.q17].filter(Boolean),
    weaknesses: [answers.q18, answers.q19].filter(Boolean),
    preferredGenres: Array.isArray(answers.q6) ? answers.q6 : [answers.q6].filter(Boolean),
    writingHabits: {
      bestTime: answers.q21 || 'anytime',
      frequency: answers.q22 || 'weekly',
    },
    readingPreferences: Array.isArray(answers.q26) ? answers.q26 : [answers.q26].filter(Boolean),
    processStyle: answers.q31 || 'mix',
    growthAreas: [answers.q36, answers.q37].filter(Boolean),
  };
}
```

**Step 2: Commit**

```bash
git add src/constants/quizQuestions.js
git commit -m "feat: add 40-question writer's profile quiz data"
```

---

### Task 3: Build the WriterQuiz component

**Files:**
- Create: `src/components/quiz/WriterQuiz.jsx`

**Step 1: Create the quiz UI**

Full-screen quiz component with:
- Progress bar showing current question number (e.g., "Question 12 of 40")
- Category label for the current section
- Question text
- Radio buttons for single-select, checkboxes for multi-select
- "Back" button (disabled on q1) and "Next" / "Complete" button
- Gradient background matching the app's design language
- On completion: calls `buildProfileFromAnswers()`, then calls `onComplete(quizResults)` prop

```jsx
import React, { useState } from 'react';
import { QUIZ_QUESTIONS, buildProfileFromAnswers } from '../../constants/quizQuestions';
import Icons from '../icons/Icons';

export default function WriterQuiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUIZ_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (value) => {
    if (question.type === 'multi') {
      const current = answers[question.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const canProceed = question.type === 'multi'
    ? (answers[question.id] || []).length > 0
    : !!answers[question.id];

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete
      const profile = buildProfileFromAnswers(answers);
      onComplete({
        completedAt: new Date().toISOString(),
        answers,
        profile,
      });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isSelected = (value) => {
    if (question.type === 'multi') {
      return (answers[question.id] || []).includes(value);
    }
    return answers[question.id] === value;
  };

  const isLast = currentIndex === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 z-50 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
             style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-indigo-400 text-sm font-medium">{question.category}</span>
            <p className="text-slate-400 text-sm mt-1">Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</p>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white text-center mb-8">{question.question}</h2>
          {question.type === 'multi' && (
            <p className="text-slate-400 text-sm text-center mb-6">Select all that apply</p>
          )}

          {/* Options */}
          <div className="space-y-3 max-w-lg mx-auto">
            {question.options.map(opt => (
              <button key={opt.value} onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                  isSelected(opt.value)
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-${question.type === 'multi' ? 'md' : 'full'} border-2 flex items-center justify-center ${
                    isSelected(opt.value) ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'
                  }`}>
                    {isSelected(opt.value) && <Icons.check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{opt.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 max-w-lg mx-auto">
            <button onClick={handleBack} disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                currentIndex === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-white/10'
              }`}>
              Back
            </button>
            <button onClick={handleNext} disabled={!canProceed}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}>
              {isLast ? 'Complete Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/quiz/WriterQuiz.jsx
git commit -m "feat: add WriterQuiz full-screen onboarding component"
```

---

### Task 4: Integrate quiz into registration flow

**Files:**
- Modify: `src/context/AppContext.jsx` — add `quizResults` and `completedTasks` to `createUser()`
- Modify: `src/App.jsx` — show quiz after registration, add `tools` view route

**Step 1: Update user data model in AppContext.jsx**

In the `createUser` function, add these fields:
```js
quizResults: null,
completedTasks: [],
```

**Step 2: Update App.jsx to show quiz for new users**

Import `WriterQuiz`. After the auth check (`if (!user) return <AuthScreen />`), add a quiz gate:

```jsx
import WriterQuiz from './components/quiz/WriterQuiz';

// Inside AppContent, after the auth check:
if (user && !user.quizResults) {
  return <WriterQuiz onComplete={(results) => updateUser({ quizResults: results })} />;
}
```

This means any logged-in user without quiz results sees the quiz first. New registrations AND existing users who haven't taken the quiz will get it.

**Step 3: Commit**

```bash
git add src/context/AppContext.jsx src/App.jsx
git commit -m "feat: integrate quiz into registration flow with data model"
```

---

### Task 5: Add "Retake Quiz" button to Settings

**Files:**
- Modify: `src/components/settings/Settings.jsx`

**Step 1: Add quiz section to Settings**

After the Profile section, add a new card:

```jsx
{/* Writer's Profile Quiz */}
<div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 p-6">
  <h2 className="font-semibold mb-4">Writer's Profile</h2>
  {user.quizResults ? (
    <div>
      <p className="text-sm text-slate-400 mb-3">
        Quiz completed {new Date(user.quizResults.completedAt).toLocaleDateString()}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {user.quizResults.profile?.preferredGenres?.map(g => (
          <span key={g} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">{g}</span>
        ))}
        {user.quizResults.profile?.strengths?.map(s => (
          <span key={s} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">{s}</span>
        ))}
      </div>
      <button onClick={() => updateUser({ quizResults: null })}
        className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-slate-300">
        Retake Quiz
      </button>
    </div>
  ) : (
    <div>
      <p className="text-sm text-slate-400 mb-3">You haven't taken the writer's profile quiz yet.</p>
      <button onClick={() => updateUser({ quizResults: null })}
        className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors text-white">
        Take Quiz
      </button>
    </div>
  )}
</div>
```

Setting `quizResults` to `null` triggers the quiz gate in `App.jsx`.

**Step 2: Commit**

```bash
git add src/components/settings/Settings.jsx
git commit -m "feat: add retake quiz button to settings page"
```

---

### Task 6: Inject quiz profile into AI chat system prompt

**Files:**
- Modify: `netlify/functions/ai-chat.cjs`
- Modify: `src/components/assistant/AIChatPage.jsx` — pass `quizProfile` in context

**Step 1: Pass quiz profile from AIChatPage**

In `AIChatPage.jsx`, update the `context` object in `handleSendAI`:

```js
const context = {
  userName: user.name,
  genre: user.genre || 'Literary Fiction',
  projectCount: user.projects?.length || 0,
  wordCount: getTotalWords(),
  personality: aiPersonality,
  customContext: aiCustomContext,
  useEmojis: aiUseEmojis,
  chatHistory: currentChat?.messages || [],
  quizProfile: user.quizResults?.profile || null,
};
```

**Step 2: Use quiz profile in ai-chat.cjs**

In `ai-chat.cjs`, destructure `quizProfile` from context:

```js
const { userName = 'Writer', genre = 'Literary Fiction', personality = 'helpful', useEmojis = false, chatHistory = [], customContext = '', quizProfile = null } = context || {};
```

After the `customContext` block, add:

```js
if (quizProfile) {
  systemPrompt += `\n\nWriter's Profile (from their quiz):
- Writer type: ${quizProfile.writerType || 'creative writer'}
- Experience: ${quizProfile.experience || 'intermediate'}
- Goals: ${(quizProfile.goals || []).join(', ') || 'not specified'}
- Strengths: ${(quizProfile.strengths || []).join(', ') || 'not specified'}
- Areas to improve: ${(quizProfile.weaknesses || []).join(', ') || 'not specified'}
- Preferred genres: ${(quizProfile.preferredGenres || []).join(', ') || genre}
- Writing habits: writes ${quizProfile.writingHabits?.frequency || 'regularly'}, best time: ${quizProfile.writingHabits?.bestTime || 'anytime'}
- Process: ${quizProfile.processStyle || 'flexible'}
- Growth areas: ${(quizProfile.growthAreas || []).join(', ') || 'general improvement'}

Use this profile to personalize advice. Reference their specific strengths and goals when relevant.`;
}
```

**Step 3: Commit**

```bash
git add netlify/functions/ai-chat.cjs src/components/assistant/AIChatPage.jsx
git commit -m "feat: inject quiz profile into AI chat for personalized responses"
```

---

### Task 7: Implement working theme system

**Files:**
- Modify: `src/App.jsx` — wrap content in theme classes
- Modify: `src/index.css` — add light theme CSS custom properties/overrides

**Step 1: Apply theme classes in App.jsx**

In `AppContent`, read settings and apply theme/font classes to the outer `<div>`:

```jsx
const { user, view, setView, settings } = useApp();

// Build theme classes
const themeClass = settings.theme === 'light' ? 'theme-light' : '';
const fontSizeClass = settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base';
const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : settings.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
```

Apply to the outer div:
```jsx
<div className={`min-h-screen text-white ${fontSizeClass} ${fontFamilyClass} ${themeClass} ${
  settings.theme === 'light'
    ? 'bg-gray-50 text-slate-900'
    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950'
}`}>
```

**Step 2: Add light theme CSS overrides in index.css**

```css
/* Light theme overrides */
.theme-light {
  color-scheme: light;
}

.theme-light .bg-slate-800\/30,
.theme-light .bg-slate-800\/50 {
  background-color: rgba(255, 255, 255, 0.8) !important;
}

.theme-light .border-white\/5,
.theme-light .border-white\/10 {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.theme-light .text-white {
  color: #1e293b !important;
}

.theme-light .text-slate-400 {
  color: #64748b !important;
}

.theme-light .text-slate-300 {
  color: #475569 !important;
}

.theme-light .text-slate-500 {
  color: #94a3b8 !important;
}

.theme-light .bg-slate-900\/50 {
  background-color: rgba(241, 245, 249, 0.8) !important;
}

.theme-light .bg-white\/5 {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

.theme-light .hover\:bg-white\/5:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.theme-light .hover\:bg-white\/10:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

.theme-light .bg-white\/10 {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

.theme-light .backdrop-blur,
.theme-light .backdrop-blur-xl,
.theme-light .backdrop-blur-2xl {
  backdrop-filter: blur(12px);
}

.theme-light .divide-white\/5 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.theme-light select,
.theme-light input,
.theme-light textarea {
  background-color: #f1f5f9 !important;
  color: #1e293b !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
}

.theme-light ::placeholder {
  color: #94a3b8 !important;
}
```

**Step 3: Hide dark background effects in light mode**

In `App.jsx`, wrap the background blurs in a condition:
```jsx
{settings.theme !== 'light' && (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
  </div>
)}
```

**Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat: implement working theme system with light mode, font size, and font family"
```

---

### Task 8: Build personalized dashboard tasks

**Files:**
- Create: `src/services/taskGenerator.js`
- Modify: `src/components/dashboard/Dashboard.jsx`

**Step 1: Create the task generator**

```js
// src/services/taskGenerator.js

const TASK_TEMPLATES = [
  // Weakness-based tasks
  { signal: 'weakness', match: 'dialogue', title: 'Practice Natural Dialogue', desc: 'Write a 2-person conversation that reveals character without exposition.', dest: 'editor', destTool: 'dialogue', difficulty: 'Easy' },
  { signal: 'weakness', match: 'pacing', title: 'Try the Flow Tool', desc: 'Paste a scene and use the Flow tool to improve its pacing.', dest: 'editor', destTool: 'flow', difficulty: 'Medium' },
  { signal: 'weakness', match: 'description', title: 'Describe a Setting', desc: 'Write 200 words describing a place using all five senses.', dest: 'focus', difficulty: 'Easy' },
  { signal: 'weakness', match: 'grammar', title: 'Polish Your Grammar', desc: 'Paste a paragraph and run the Grammar tool to learn common patterns.', dest: 'editor', destTool: 'grammar', difficulty: 'Easy' },
  { signal: 'weakness', match: 'vocabulary', title: 'Expand Your Word Choice', desc: 'Take a paragraph and use the Vocabulary tool to find stronger words.', dest: 'editor', destTool: 'vocabulary', difficulty: 'Medium' },
  { signal: 'weakness', match: 'showing', title: 'Show, Don\'t Tell', desc: 'Rewrite "She was angry" as a scene that shows the emotion.', dest: 'focus', difficulty: 'Challenging' },
  { signal: 'weakness', match: 'plot', title: 'Outline a Story Arc', desc: 'Ask the AI Assistant to help you outline a 3-act structure.', dest: 'assistant', difficulty: 'Medium' },
  { signal: 'weakness', match: 'character', title: 'Build a Character Profile', desc: 'Create a detailed character sketch with the AI Assistant.', dest: 'assistant', difficulty: 'Medium' },

  // Goal-based tasks
  { signal: 'goal', match: 'novel', title: 'Write 500 Words Today', desc: 'Open your project and add 500 words to your novel draft.', dest: 'projects', difficulty: 'Medium' },
  { signal: 'goal', match: 'short stor', title: 'Draft a Flash Fiction', desc: 'Write a complete story in under 500 words.', dest: 'focus', difficulty: 'Challenging' },
  { signal: 'goal', match: 'poem', title: 'Write a Poem', desc: 'Try a new poetry form — haiku, sonnet, or free verse.', dest: 'focus', difficulty: 'Medium' },
  { signal: 'goal', match: 'improv', title: 'Revise a Paragraph', desc: 'Pick your weakest paragraph and enhance it with the editor.', dest: 'editor', destTool: 'enhance', difficulty: 'Easy' },
  { signal: 'goal', match: 'publish', title: 'Check Writing Contests', desc: 'Browse contests that match your genre and plan a submission.', dest: 'tools', difficulty: 'Easy' },
  { signal: 'goal', match: 'finish', title: 'Set a Writing Goal', desc: 'Add a weekly word count goal to your calendar.', dest: 'calendar', difficulty: 'Easy' },

  // Habit-based tasks
  { signal: 'habit-time', match: 'morning', title: 'Morning Writing Sprint', desc: 'Start your day with a 10-minute writing sprint.', dest: 'sprints', difficulty: 'Easy' },
  { signal: 'habit-time', match: 'evening', title: 'Evening Writing Sprint', desc: 'Wind down with a focused 15-minute writing sprint.', dest: 'sprints', difficulty: 'Easy' },
  { signal: 'habit-time', match: 'afternoon', title: 'Afternoon Focus Session', desc: 'Use Focus Mode for a distraction-free afternoon writing block.', dest: 'focus', difficulty: 'Medium' },
  { signal: 'habit-freq', match: 'daily', title: 'Set a Daily Writing Goal', desc: 'Add a daily writing goal to your calendar to build consistency.', dest: 'calendar', difficulty: 'Easy' },

  // Strength-based tasks (challenges)
  { signal: 'strength', match: 'world', title: 'Build a World in 200 Words', desc: 'Create an entire setting — history, rules, culture — in just 200 words.', dest: 'focus', difficulty: 'Challenging' },
  { signal: 'strength', match: 'character', title: 'Write a Character Monologue', desc: 'Give a character 300 words to reveal their deepest secret.', dest: 'focus', difficulty: 'Challenging' },
  { signal: 'strength', match: 'plot', title: 'Plot a Story in 5 Sentences', desc: 'Condense an entire story arc into exactly 5 sentences.', dest: 'focus', difficulty: 'Challenging' },
  { signal: 'strength', match: 'dialogue', title: 'Write a Scene in Pure Dialogue', desc: 'Tell a complete scene using only dialogue — no narration.', dest: 'focus', difficulty: 'Challenging' },

  // Growth-based tasks
  { signal: 'growth', match: 'dialogue', title: 'Study Great Dialogue', desc: 'Ask the AI to show you examples of effective dialogue techniques.', dest: 'assistant', difficulty: 'Easy' },
  { signal: 'growth', match: 'description', title: 'Learn Sensory Writing', desc: 'Ask the AI about techniques for vivid, sensory descriptions.', dest: 'assistant', difficulty: 'Easy' },
  { signal: 'growth', match: 'voice', title: 'Find Your Voice', desc: 'Write the same scene in 3 different styles to explore your voice.', dest: 'focus', difficulty: 'Challenging' },

  // Generic tasks (always available as fillers)
  { signal: 'generic', title: 'Explore the AI Editor', desc: 'Paste some writing and try the Enhance tool to see suggestions.', dest: 'editor', destTool: 'enhance', difficulty: 'Easy' },
  { signal: 'generic', title: 'Start a New Project', desc: 'Create a new writing project to organize your work.', dest: 'projects', difficulty: 'Easy' },
  { signal: 'generic', title: 'Chat with Echo', desc: 'Ask the AI Assistant for writing advice or brainstorm ideas.', dest: 'assistant', difficulty: 'Easy' },
  { signal: 'generic', title: 'Try a Writing Sprint', desc: 'Challenge yourself with a timed writing sprint.', dest: 'sprints', difficulty: 'Medium' },
  { signal: 'generic', title: 'Enter Focus Mode', desc: 'Write distraction-free in Focus Mode with a word goal.', dest: 'focus', difficulty: 'Medium' },
  { signal: 'generic', title: 'Browse Writing Resources', desc: 'Check out contests, books, and tools in Extra Tools.', dest: 'tools', difficulty: 'Easy' },
];

export function generateTasks(quizProfile, chatSessions = [], completedTasks = []) {
  const tasks = [];
  const usedTitles = new Set(completedTasks);

  const addTask = (template) => {
    const id = template.title.toLowerCase().replace(/\s+/g, '-');
    if (!usedTitles.has(id) && !tasks.find(t => t.id === id)) {
      tasks.push({ id, ...template });
      usedTitles.add(id);
    }
  };

  if (quizProfile) {
    // Weakness-based
    for (const w of (quizProfile.weaknesses || [])) {
      TASK_TEMPLATES.filter(t => t.signal === 'weakness' && w.toLowerCase().includes(t.match))
        .forEach(addTask);
    }

    // Goal-based
    for (const g of (quizProfile.goals || [])) {
      TASK_TEMPLATES.filter(t => t.signal === 'goal' && g.toLowerCase().includes(t.match))
        .forEach(addTask);
    }

    // Habit-based
    const bestTime = quizProfile.writingHabits?.bestTime || '';
    TASK_TEMPLATES.filter(t => t.signal === 'habit-time' && bestTime.toLowerCase().includes(t.match))
      .forEach(addTask);

    const freq = quizProfile.writingHabits?.frequency || '';
    TASK_TEMPLATES.filter(t => t.signal === 'habit-freq' && freq.toLowerCase().includes(t.match))
      .forEach(addTask);

    // Strength challenges
    for (const s of (quizProfile.strengths || [])) {
      TASK_TEMPLATES.filter(t => t.signal === 'strength' && s.toLowerCase().includes(t.match))
        .forEach(addTask);
    }

    // Growth areas
    for (const g of (quizProfile.growthAreas || [])) {
      TASK_TEMPLATES.filter(t => t.signal === 'growth' && g.toLowerCase().includes(t.match))
        .forEach(addTask);
    }
  }

  // Fill with generics if we have fewer than 5
  if (tasks.length < 5) {
    TASK_TEMPLATES.filter(t => t.signal === 'generic').forEach(addTask);
  }

  // Return up to 5 tasks
  return tasks.slice(0, 5);
}
```

**Step 2: Add task cards to Dashboard.jsx**

Import `generateTasks` and render a tasks section after the welcome banner:

```jsx
import { generateTasks } from '../../services/taskGenerator';

// Inside the component:
const tasks = generateTasks(user.quizResults?.profile, user.chatSessions, user.completedTasks || []);

const handleCompleteTask = (taskId) => {
  updateUser({ completedTasks: [...(user.completedTasks || []), taskId] });
  notify('Task completed!');
};

const handleDismissTask = (taskId) => {
  updateUser({ completedTasks: [...(user.completedTasks || []), taskId] });
};

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-amber-500/20 text-amber-400',
  Challenging: 'bg-purple-500/20 text-purple-400',
};
```

Render task cards after the welcome banner and before stats:

```jsx
{tasks.length > 0 && (
  <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
    <div className="p-4 border-b border-white/5">
      <h2 className="font-semibold">Your Writing Tasks</h2>
      <p className="text-sm text-slate-400 mt-1">Personalized based on your profile</p>
    </div>
    <div className="divide-y divide-white/5">
      {tasks.map(task => (
        <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{task.title}</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[task.difficulty]}`}>
                {task.difficulty}
              </span>
            </div>
            <p className="text-sm text-slate-400">{task.desc}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleDismissTask(task.id)} className="p-2 text-slate-500 hover:text-slate-300 transition-colors" title="Dismiss">
              <Icons.x className="w-4 h-4" />
            </button>
            <button onClick={() => { handleCompleteTask(task.id); setView(task.dest); }}
              className="p-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors" title="Go">
              <Icons.chevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

Also add `updateUser` and `notify` to the destructured context:
```jsx
const { user, setView, getTotalWords, updateUser, notify } = useApp();
```

**Step 3: Commit**

```bash
git add src/services/taskGenerator.js src/components/dashboard/Dashboard.jsx
git commit -m "feat: add personalized dashboard tasks based on quiz profile"
```

---

### Task 9: Build curated Extra Tools data

**Files:**
- Create: `src/constants/extraTools.js`

**Step 1: Create curated data**

Export `WRITING_CONTESTS`, `RECOMMENDED_BOOKS`, `WRITING_TOOLS` arrays. All with real URLs.

```js
export const WRITING_CONTESTS = [
  { name: 'Scholastic Art & Writing Awards', org: 'Alliance for Young Artists & Writers', deadline: 'Varies by region (typically Dec)', genres: ['Fiction', 'Poetry', 'Nonfiction', 'Journalism'], prize: 'Scholarships up to $10,000', url: 'https://www.artandwriting.org/', description: 'The longest-running creative writing recognition program for teens in the US.' },
  { name: 'NaNoWriMo Young Writers Program', org: 'National Novel Writing Month', deadline: 'November (annual)', genres: ['Fiction', 'Fantasy', 'Science Fiction', 'Romance', 'Mystery'], prize: 'Completion certificate + community', url: 'https://ywp.nanowrimo.org/', description: 'Write a novel in November with a community of young writers worldwide.' },
  // ... (15-20 total, written in the actual file)
];

export const RECOMMENDED_BOOKS = [
  { title: 'On Writing', author: 'Stephen King', genres: ['Fiction', 'Horror', 'Literary Fiction'], type: 'craft', description: 'Part memoir, part masterclass on the craft of writing.', goodreadsUrl: 'https://www.goodreads.com/book/show/10569.On_Writing', libraryUrl: 'https://www.worldcat.org/title/on-writing' },
  // ... (15-20 total)
];

export const WRITING_TOOLS_LIST = [
  { name: 'Grammarly', category: 'Grammar & Style', description: 'AI-powered grammar and style checker.', url: 'https://www.grammarly.com/', free: true },
  // ... (10-15 total)
];
```

**Step 2: Commit**

```bash
git add src/constants/extraTools.js
git commit -m "feat: add curated writing contests, books, and tools data"
```

---

### Task 10: Build ExtraToolsPage component

**Files:**
- Create: `src/components/tools/ExtraToolsPage.jsx`

**Step 1: Create the tabbed page**

Tabs: Contests, Books, Editors & Tools, AI Recommendations

Each tab renders its curated data as cards. Items matching the user's preferred genres get a highlighted badge ("Matches your interests"). An "AI Recommendations" tab has a "Get More Recommendations" button that calls a new Netlify Function.

The component should:
- Read `user.quizResults?.profile?.preferredGenres` for filtering/highlighting
- Sort matched items first
- Show a tab bar at the top
- Cards with title, description, external link button, genre tags
- "Get More Recommendations" button in the AI tab

Full component structure (abbreviated here, complete code in implementation):

```jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { WRITING_CONTESTS, RECOMMENDED_BOOKS, WRITING_TOOLS_LIST } from '../../constants/extraTools';

const TABS = [
  { id: 'contests', label: 'Contests', icon: Icons.award },
  { id: 'books', label: 'Books', icon: Icons.book },
  { id: 'tools', label: 'Editors & Tools', icon: Icons.edit },
  { id: 'ai', label: 'AI Picks', icon: Icons.zap },
];

export default function ExtraToolsPage() {
  const { user, notify } = useApp();
  const [activeTab, setActiveTab] = useState('contests');
  const [aiRecs, setAiRecs] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const userGenres = user.quizResults?.profile?.preferredGenres || [];
  const matchesGenre = (genres) => genres?.some(g => userGenres.some(ug => g.toLowerCase().includes(ug.toLowerCase()) || ug.toLowerCase().includes(g.toLowerCase())));

  // Sort: matched items first
  const sortByMatch = (items) => [...items].sort((a, b) => {
    const aMatch = matchesGenre(a.genres);
    const bMatch = matchesGenre(b.genres);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const handleGetAiRecs = async () => { /* calls /.netlify/functions/ai-recommend */ };

  return ( /* tabbed layout with cards */ );
}
```

**Step 2: Commit**

```bash
git add src/components/tools/ExtraToolsPage.jsx
git commit -m "feat: add Extra Tools page with contests, books, editors, and AI recs"
```

---

### Task 11: Create AI recommendations Netlify Function

**Files:**
- Create: `netlify/functions/ai-recommend.cjs`
- Modify: `src/components/tools/ExtraToolsPage.jsx` — wire up the API call

**Step 1: Create the serverless function**

```js
// netlify/functions/ai-recommend.cjs
exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
  }
  try {
    if (!event.body) {
      return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
    }
    const { profile } = JSON.parse(event.body);
    const systemPrompt = `You recommend writing resources. Based on the writer's profile, suggest 5 personalized recommendations...`;
    // Call Claude API, parse response, return JSON
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
  }
};
```

**Step 2: Wire up in ExtraToolsPage**

The `handleGetAiRecs` function calls `/.netlify/functions/ai-recommend` with the user's profile and displays results.

**Step 3: Commit**

```bash
git add netlify/functions/ai-recommend.cjs src/components/tools/ExtraToolsPage.jsx
git commit -m "feat: add AI recommendations Netlify Function for Extra Tools"
```

---

### Task 12: Add Extra Tools to sidebar and routing

**Files:**
- Modify: `src/components/layout/Sidebar.jsx` — add nav item
- Modify: `src/App.jsx` — add route + import

**Step 1: Add nav item to Sidebar**

In the `NAV` array, insert between Analytics and Settings:
```js
{ id: 'tools', icon: Icons.star, label: 'Extra Tools' },
```

**Step 2: Add route in App.jsx**

Import `ExtraToolsPage` and add:
```jsx
{view === 'tools' && <ExtraToolsPage />}
```

**Step 3: Commit**

```bash
git add src/components/layout/Sidebar.jsx src/App.jsx
git commit -m "feat: add Extra Tools to sidebar navigation and routing"
```

---

### Task 13: Pre-populate demo account with quiz data

**Files:**
- Modify: `src/context/AppContext.jsx` — give `claudia` user pre-filled quiz results

**Step 1: Add quiz results to claudia's demo account**

In `createInitialData()`, add `quizResults` to the claudia user so the demo account already has personalized tasks and AI context:

```js
quizResults: {
  completedAt: '2026-02-15T12:00:00Z',
  answers: {},
  profile: {
    writerType: 'creative fiction writer',
    experience: 'intermediate',
    goals: ['finish first novel', 'improve dialogue'],
    strengths: ['world-building', 'plot development'],
    weaknesses: ['dialogue', 'pacing'],
    preferredGenres: ['Literary Fiction', 'Fantasy'],
    writingHabits: { bestTime: 'evening', frequency: 'daily' },
    readingPreferences: ['complex characters', 'plot twists'],
    processStyle: 'pantser',
    growthAreas: ['dialogue', 'showing vs telling'],
  }
},
completedTasks: [],
```

**Step 2: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: pre-populate demo account with quiz results for demo night"
```

---

### Task 14: Final build verification and push

**Step 1: Run the build**

```bash
npm run build
```

Expected: Clean build, no errors.

**Step 2: Visual smoke test**

Run `netlify dev` (or `npm run dev`) and verify:
- New account → quiz appears
- Quiz completes → lands on dashboard with personalized tasks
- Task arrows navigate to correct views
- Settings → Retake Quiz works
- Theme toggle to Light actually changes the UI
- Font size/family changes apply
- Extra Tools page shows curated data with genre badges
- AI chat mentions quiz profile context
- Existing claudia account has pre-filled quiz and tasks

**Step 3: Final commit and push**

```bash
git push origin main
```

---

## Implementation Order Summary

| # | Task | Files | Depends On |
|---|------|-------|-----------|
| 1 | Model update | 3 Netlify Functions | None |
| 2 | Quiz questions data | `quizQuestions.js` | None |
| 3 | WriterQuiz component | `WriterQuiz.jsx` | Task 2 |
| 4 | Quiz flow integration | `AppContext.jsx`, `App.jsx` | Task 3 |
| 5 | Retake quiz in Settings | `Settings.jsx` | Task 4 |
| 6 | AI chat quiz injection | `ai-chat.cjs`, `AIChatPage.jsx` | Task 4 |
| 7 | Theme system | `App.jsx`, `index.css` | None |
| 8 | Dashboard tasks | `taskGenerator.js`, `Dashboard.jsx` | Task 4 |
| 9 | Extra Tools data | `extraTools.js` | None |
| 10 | ExtraToolsPage component | `ExtraToolsPage.jsx` | Task 9 |
| 11 | AI recommendations | `ai-recommend.cjs`, `ExtraToolsPage.jsx` | Task 10 |
| 12 | Sidebar + routing | `Sidebar.jsx`, `App.jsx` | Task 10 |
| 13 | Demo account data | `AppContext.jsx` | Task 4 |
| 14 | Build + push | — | All |

**Parallelizable:** Tasks 1, 2, 7, 9 can all be done simultaneously. Tasks 3-6 are sequential. Tasks 10-12 are sequential after 9.
