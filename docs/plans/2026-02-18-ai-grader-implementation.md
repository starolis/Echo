# AI Grader Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an AI Grader view that lets users grade their writing against premade skill-focused rubrics or custom criteria, with three feedback formats and grading history.

**Architecture:** New standalone sidebar view following the same patterns as Editor and AI Assistant. Uses a new Netlify Function (`ai-grade.cjs`) as the API proxy, a new `performAIGrade()` client wrapper, and stores grading history in `user.gradingHistory`. Five premade rubric templates defined in a constants file; custom rubrics are a first-class alternative.

**Tech Stack:** React 18, Tailwind CSS 3, Netlify Functions (CommonJS), Anthropic Claude API

---

### Task 1: Create rubric constants

**Files:**
- Create: `src/constants/rubrics.js`

**Context:** This follows the same pattern as `src/constants/editTools.js` — an exported array of objects. These 5 skill-focused rubrics are templates. Users can also write custom rubrics (handled in the UI, not here).

**Step 1: Create the rubrics constants file**

```javascript
// src/constants/rubrics.js
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
```

**Step 2: Verify the file is importable**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds (file is just exports, no consumers yet)

**Step 3: Commit**

```bash
git add src/constants/rubrics.js
git commit -m "feat: add rubric templates and feedback format constants for AI Grader"
```

---

### Task 2: Add `performAIGrade()` API wrapper and Netlify Function

**Files:**
- Modify: `src/services/api.js` (append new function)
- Create: `netlify/functions/ai-grade.cjs`

**Context:** Follow the exact same pattern as `performAIEdit()` in `src/services/api.js` and `ai-edit.cjs` in `netlify/functions/`. The Netlify function uses CommonJS (`exports.handler`), calls the Anthropic API with model fallback (`claude-sonnet-4-6` then `claude-sonnet-4-5-20250929`), and returns structured JSON. The function builds a system prompt that includes the rubric criteria and requested feedback format.

**Step 1: Add `performAIGrade()` to `src/services/api.js`**

Append after the existing `generateChatTitle` function:

```javascript
/**
 * AI Grade — calls the Netlify Function proxy
 */
export async function performAIGrade(text, rubric, feedbackFormat, context = {}) {
  if (!text.trim()) {
    return {
      overallGrade: null,
      overallScore: null,
      categories: [],
      strengths: [],
      improvements: [],
      summary: 'Enter some text to grade.',
      error: true,
    };
  }

  try {
    const response = await fetch('/.netlify/functions/ai-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rubric, feedbackFormat, context }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI Grade Error:', error);
    return {
      overallGrade: null,
      overallScore: null,
      categories: [],
      strengths: [],
      improvements: [],
      summary: `Error: ${error.message}. The AI grading service may not be configured yet.`,
      error: true,
    };
  }
}
```

**Step 2: Create `netlify/functions/ai-grade.cjs`**

```javascript
exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
        summary: 'API key not configured. Set ANTHROPIC_API_KEY in environment variables.',
        error: true,
      }),
    };
  }

  try {
    const { text, rubric, feedbackFormat = 'report-card', context = {} } = JSON.parse(event.body);

    if (!text || !text.trim()) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
          summary: 'Enter some text to grade.', error: true,
        }),
      };
    }

    const { genre = 'Literary Fiction', quizProfile = null } = context;
    const wordCount = text.split(/\s+/).filter(w => w).length;

    // Build rubric criteria section
    let rubricSection;
    if (rubric.type === 'custom') {
      rubricSection = `**Custom Rubric Criteria (provided by the user):**\n${rubric.criteria}`;
    } else {
      const categoryList = rubric.categories.map(c => `- **${c.name}**: ${c.description}`).join('\n');
      rubricSection = `**Rubric: ${rubric.name}**\n${rubric.description}\n\n**Categories:**\n${categoryList}`;
    }

    // Build format instructions
    let formatInstruction;
    if (feedbackFormat === 'written') {
      formatInstruction = `Return feedback as narrative paragraphs organized by category. Do NOT include letter grades or numeric scores. End with an encouraging closing remark.

Return JSON:
{
  "categories": [
    { "name": "Category Name", "feedback": "Detailed paragraph of feedback..." }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "Overall encouraging narrative summary paragraph"
}`;
    } else if (feedbackFormat === 'rubric-table') {
      formatInstruction = `Score each criterion on a 1-4 scale:
1 = Beginning (significant issues)
2 = Developing (some issues, making progress)
3 = Proficient (meets expectations)
4 = Advanced (exceeds expectations)

Return JSON:
{
  "overallScore": number (average of all scores, 1-4 scale),
  "categories": [
    { "name": "Category Name", "rubricScore": 1-4, "label": "Beginning|Developing|Proficient|Advanced", "feedback": "Brief note about this criterion" }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "Brief overall summary"
}`;
    } else {
      formatInstruction = `Assign an overall letter grade (A+ through F) with a percentage score (0-100), and a letter grade per category.

Return JSON:
{
  "overallGrade": "B+",
  "overallScore": 87,
  "categories": [
    { "name": "Category Name", "grade": "A", "score": 95, "feedback": "Brief feedback for this category" }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "2-3 sentence summary of the writing's quality"
}`;
    }

    // Quiz profile context
    let profileContext = '';
    if (quizProfile) {
      const strengths = quizProfile.strengths?.join(', ') || '';
      const weaknesses = quizProfile.weaknesses?.join(', ') || '';
      if (strengths) profileContext += `\nThe student's known strengths are: ${strengths}.`;
      if (weaknesses) profileContext += `\nAreas they are working on: ${weaknesses}.`;
      profileContext += '\nUse this to personalize your feedback — acknowledge growth in their strengths and provide constructive guidance for their weaker areas.';
    }

    const systemPrompt = `You are a supportive, encouraging writing teacher grading student work. Your audience is young writers (3rd-5th grade workshop level). Be constructive and specific — point out what works well AND what could improve. Never be harsh or discouraging.

**Genre:** ${genre}
**Word count:** ${wordCount} words
${profileContext}

${rubricSection}

**Feedback format:** ${feedbackFormat}

${formatInstruction}

**Rules:**
1. Be encouraging but honest — students learn from specific, actionable feedback
2. Always mention at least 2 things the writer did well
3. Frame improvements as opportunities, not failures
4. Give specific examples from the text when possible
5. Return ONLY valid JSON — no markdown, no text before or after the JSON`;

    const callAnthropic = async (model) => {
      return await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model, max_tokens: 3000, system: systemPrompt,
          messages: [{ role: 'user', content: `Please grade this writing:\n\n${text}` }],
        }),
      });
    };

    let response = await callAnthropic('claude-sonnet-4-6');
    if (!response.ok) {
      console.log('claude-sonnet-4-6 failed for grade, falling back to claude-sonnet-4-5-20250929');
      response = await callAnthropic('claude-sonnet-4-5-20250929');
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      console.error('Anthropic API error:', response.status, errorBody);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
          summary: response.status === 429
            ? 'The AI service is busy. Please wait a moment and try again.'
            : 'The AI grading service encountered an error. Please try again.',
          error: true,
        }),
      };
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ ...parsed, error: false }),
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        overallGrade: null, overallScore: null, categories: [],
        strengths: [], improvements: [],
        summary: 'Grading completed but results could not be parsed. Please try again.',
        error: true,
      }),
    };
  } catch (error) {
    console.error('AI Grade Error:', error);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        overallGrade: null, overallScore: null, categories: [],
        strengths: [], improvements: [],
        summary: `Error: ${error.message}`, error: true,
      }),
    };
  }
};
```

**Step 3: Verify build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/services/api.js netlify/functions/ai-grade.cjs
git commit -m "feat: add AI grading Netlify Function and client API wrapper"
```

---

### Task 3: Create `GradeResults.jsx` component

**Files:**
- Create: `src/components/grader/GradeResults.jsx`

**Context:** This component receives a `results` object and `feedbackFormat` string, and renders one of three displays. It must handle all three formats: report-card (letter grades + colored badges), written (narrative paragraphs), rubric-table (1-4 scored grid). It also receives an `onNewGrade` callback to reset the view.

**Step 1: Create the GradeResults component**

```jsx
import React from 'react';
import Icons from '../icons/Icons';

const gradeColor = (grade) => {
  if (!grade) return 'text-slate-400';
  const letter = grade.charAt(0);
  if (letter === 'A') return 'text-green-400';
  if (letter === 'B') return 'text-emerald-400';
  if (letter === 'C') return 'text-amber-400';
  return 'text-red-400';
};

const gradeBg = (grade) => {
  if (!grade) return 'bg-slate-500/20';
  const letter = grade.charAt(0);
  if (letter === 'A') return 'bg-green-500/20 border-green-500/30';
  if (letter === 'B') return 'bg-emerald-500/20 border-emerald-500/30';
  if (letter === 'C') return 'bg-amber-500/20 border-amber-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

const rubricLabel = (score) => {
  if (score >= 4) return { text: 'Advanced', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (score >= 3) return { text: 'Proficient', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (score >= 2) return { text: 'Developing', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  return { text: 'Beginning', color: 'text-red-400', bg: 'bg-red-500/20' };
};

function ReportCard({ results }) {
  return (
    <div className="space-y-4">
      <div className={`text-center p-6 rounded-2xl border ${gradeBg(results.overallGrade)}`}>
        <p className="text-sm text-slate-400 mb-1">Overall Grade</p>
        <p className={`text-5xl font-bold ${gradeColor(results.overallGrade)}`}>{results.overallGrade}</p>
        {results.overallScore != null && <p className="text-slate-400 mt-1">{results.overallScore}%</p>}
      </div>
      <div className="space-y-2">
        {(results.categories || []).map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sm">{cat.name}</span>
            <div className="flex items-center gap-2">
              {cat.score != null && <span className="text-xs text-slate-500">{cat.score}%</span>}
              <span className={`font-bold ${gradeColor(cat.grade)}`}>{cat.grade}</span>
            </div>
          </div>
        ))}
      </div>
      {(results.categories || []).some(c => c.feedback) && (
        <div className="space-y-2 pt-2">
          {results.categories.filter(c => c.feedback).map((cat, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-xl">
              <p className="text-sm font-medium mb-1">{cat.name}</p>
              <p className="text-sm text-slate-400">{cat.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WrittenFeedback({ results }) {
  return (
    <div className="space-y-4">
      {(results.categories || []).map((cat, i) => (
        <div key={i} className="p-4 bg-white/5 rounded-xl">
          <h4 className="font-medium mb-2">{cat.name}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{cat.feedback}</p>
        </div>
      ))}
      {results.summary && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <p className="text-sm text-slate-300 leading-relaxed italic">{results.summary}</p>
        </div>
      )}
    </div>
  );
}

function RubricTable({ results }) {
  return (
    <div className="space-y-4">
      {results.overallScore != null && (
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <p className="text-sm text-slate-400 mb-1">Overall Score</p>
          <p className={`text-3xl font-bold ${rubricLabel(results.overallScore).color}`}>
            {results.overallScore.toFixed ? results.overallScore.toFixed(1) : results.overallScore} / 4
          </p>
        </div>
      )}
      <div className="space-y-2">
        {(results.categories || []).map((cat, i) => {
          const label = rubricLabel(cat.rubricScore);
          return (
            <div key={i} className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${label.bg} ${label.color}`}>
                    {label.text}
                  </span>
                  <span className="font-bold text-sm">{cat.rubricScore}/4</span>
                </div>
              </div>
              {cat.feedback && <p className="text-xs text-slate-400 mt-1">{cat.feedback}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GradeResults({ results, feedbackFormat, onNewGrade }) {
  return (
    <div className="space-y-4">
      {feedbackFormat === 'written' && <WrittenFeedback results={results} />}
      {feedbackFormat === 'rubric-table' && <RubricTable results={results} />}
      {feedbackFormat !== 'written' && feedbackFormat !== 'rubric-table' && <ReportCard results={results} />}

      {(results.strengths?.length > 0 || results.improvements?.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {results.strengths?.length > 0 && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                <Icons.check className="w-4 h-4" /> Strengths
              </p>
              <ul className="space-y-1">
                {results.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {results.improvements?.length > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-1">
                <Icons.zap className="w-4 h-4" /> To Improve
              </p>
              <ul className="space-y-1">
                {results.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onNewGrade}
        className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all text-sm"
      >
        Grade Another
      </button>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/grader/GradeResults.jsx
git commit -m "feat: add GradeResults component with three feedback formats"
```

---

### Task 4: Create `GradingHistory.jsx` component

**Files:**
- Create: `src/components/grader/GradingHistory.jsx`

**Context:** Displays a scrollable list of past grading results from `user.gradingHistory`. Each entry shows date, text snippet, rubric name, and grade badge. Click expands to show full results using `GradeResults`. Delete button removes individual entries.

**Step 1: Create the GradingHistory component**

```jsx
import React, { useState } from 'react';
import Icons from '../icons/Icons';
import GradeResults from './GradeResults';

const gradeColor = (grade) => {
  if (!grade) return 'text-slate-400';
  const letter = String(grade).charAt(0);
  if (letter === 'A') return 'text-green-400';
  if (letter === 'B') return 'text-emerald-400';
  if (letter === 'C') return 'text-amber-400';
  return 'text-red-400';
};

export default function GradingHistory({ history, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-8 text-center">
        <Icons.award className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400">No grading history yet.</p>
        <p className="text-slate-500 text-sm mt-1">Grade some writing and it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...history].reverse().map(entry => (
        <div key={entry.id} className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 overflow-hidden">
          <button
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{entry.rubricName}</span>
                <span className="text-xs text-slate-500">
                  {new Date(entry.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{entry.textSnippet}</p>
            </div>
            <div className="flex items-center gap-3 ml-3">
              {entry.overallGrade && (
                <span className={`text-lg font-bold ${gradeColor(entry.overallGrade)}`}>{entry.overallGrade}</span>
              )}
              {entry.overallScore != null && !entry.overallGrade && (
                <span className="text-lg font-bold text-indigo-400">{entry.overallScore}/4</span>
              )}
              <Icons.chevronRight className={`w-4 h-4 text-slate-500 transition-transform ${expandedId === entry.id ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {expandedId === entry.id && (
            <div className="px-4 pb-4 border-t border-white/5 pt-4">
              <GradeResults
                results={entry.results}
                feedbackFormat={entry.feedbackFormat}
                onNewGrade={() => setExpandedId(null)}
              />
              <button
                onClick={() => onDelete(entry.id)}
                className="mt-3 w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                Delete this grade
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/grader/GradingHistory.jsx
git commit -m "feat: add GradingHistory component with expand/collapse and delete"
```

---

### Task 5: Create `AIGrader.jsx` main view component

**Files:**
- Create: `src/components/grader/AIGrader.jsx`

**Context:** This is the main view component rendered when `view === 'grader'`. It uses `useApp()` for user data and `notify()`. Layout: 2-column grid with text input on left, rubric selection + results on right. Tab toggle at top between "New Grade" and "History". The "Import from Project" dropdown populates the textarea from an existing project. Feedback format preference is stored in user settings.

**Step 1: Create the AIGrader component**

```jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import { RUBRICS, FEEDBACK_FORMATS } from '../../constants/rubrics';
import { performAIGrade } from '../../services/api';
import GradeResults from './GradeResults';
import GradingHistory from './GradingHistory';

export default function AIGrader() {
  const { user, updateUser, notify } = useApp();

  const [tab, setTab] = useState('grade');
  const [text, setText] = useState('');
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [customCriteria, setCustomCriteria] = useState('');
  const [feedbackFormat, setFeedbackFormat] = useState(user?.preferredGradeFormat || 'report-card');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const history = user?.gradingHistory || [];

  const handleImportProject = (projectId) => {
    const project = user.projects?.find(p => p.id === Number(projectId));
    if (project) {
      setText(project.content || '');
      notify(`Imported "${project.title}"`);
    }
  };

  const handleGrade = async () => {
    if (!text.trim()) {
      notify('Enter or import some text to grade.', 'error');
      return;
    }
    if (!selectedRubric && !customCriteria.trim()) {
      notify('Select a rubric or enter custom criteria.', 'error');
      return;
    }

    setLoading(true);
    setResults(null);

    const rubric = selectedRubric
      ? { type: 'template', ...RUBRICS.find(r => r.id === selectedRubric) }
      : { type: 'custom', criteria: customCriteria };

    const context = {
      genre: user?.genre || 'Literary Fiction',
      quizProfile: user?.quizResults?.profile || null,
    };

    try {
      const data = await performAIGrade(text, rubric, feedbackFormat, context);

      if (data.error) {
        notify(data.summary || 'Grading failed. Please try again.', 'error');
        setLoading(false);
        return;
      }

      setResults(data);

      // Save to history
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        textSnippet: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
        rubricName: selectedRubric ? RUBRICS.find(r => r.id === selectedRubric)?.name : 'Custom',
        feedbackFormat,
        overallGrade: data.overallGrade || null,
        overallScore: data.overallScore || null,
        results: data,
      };
      updateUser({ gradingHistory: [...history, entry] });

      // Persist feedback format preference
      if (feedbackFormat !== user?.preferredGradeFormat) {
        updateUser({ preferredGradeFormat: feedbackFormat });
      }
    } catch (err) {
      console.error('Grading error:', err);
      notify('Something went wrong. Please try again.', 'error');
    }

    setLoading(false);
  };

  const handleDeleteHistory = (entryId) => {
    updateUser({ gradingHistory: history.filter(e => e.id !== entryId) });
    notify('Grade deleted');
  };

  const handleNewGrade = () => {
    setResults(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Grader</h1>
        <div className="flex bg-slate-800/50 rounded-xl p-1">
          {[
            { id: 'grade', label: 'New Grade', icon: Icons.award },
            { id: 'history', label: 'History', icon: Icons.chart },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'grade') setResults(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === 'history' && history.length > 0 && (
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{history.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'history' ? (
        <GradingHistory history={history} onDelete={handleDeleteHistory} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: Text Input */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-slate-400">Your Writing</label>
              {user.projects?.length > 0 && (
                <select
                  onChange={(e) => { if (e.target.value) handleImportProject(e.target.value); e.target.value = ''; }}
                  defaultValue=""
                  className="text-sm bg-slate-700/50 border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Import from project...</option>
                  {user.projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write your text here..."
              className="flex-1 min-h-[300px] bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
            />
            <p className="text-sm text-slate-500 mt-2">{wordCount} words</p>
          </div>

          {/* Right: Rubric Selection / Results */}
          <div className="space-y-4">
            {results ? (
              <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                <h3 className="font-semibold mb-4">Results</h3>
                <GradeResults results={results} feedbackFormat={feedbackFormat} onNewGrade={handleNewGrade} />
              </div>
            ) : (
              <>
                {/* Rubric Selection */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                  <h3 className="font-semibold mb-3">Rubric</h3>

                  {/* Custom rubric */}
                  <button
                    onClick={() => setSelectedRubric(null)}
                    className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                      selectedRubric === null
                        ? 'bg-indigo-500/20 border border-indigo-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icons.edit className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium">Custom Criteria</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Write your own grading criteria</p>
                  </button>

                  {selectedRubric === null && (
                    <textarea
                      value={customCriteria}
                      onChange={(e) => setCustomCriteria(e.target.value)}
                      placeholder="Describe what to grade on... e.g., creativity, use of metaphor, stays under 500 words, has a clear theme"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none h-24 mb-2"
                    />
                  )}

                  <div className="text-xs text-slate-500 mb-2 mt-3">Or choose a template:</div>

                  {/* Template rubrics */}
                  <div className="space-y-1.5">
                    {RUBRICS.map(r => (
                      <button
                        key={r.id}
                        onClick={() => { setSelectedRubric(r.id); setCustomCriteria(''); }}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          selectedRubric === r.id
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icons[r.icon] className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium">{r.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Format */}
                <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
                  <h3 className="font-semibold mb-3">Feedback Style</h3>
                  <div className="space-y-1.5">
                    {FEEDBACK_FORMATS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFeedbackFormat(f.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          feedbackFormat === f.id
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <span className="text-sm font-medium">{f.name}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{f.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade Button */}
                <button
                  onClick={handleGrade}
                  disabled={loading || (!text.trim()) || (!selectedRubric && !customCriteria.trim())}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 hover:from-indigo-500 hover:via-indigo-700 hover:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all ring-1 ring-indigo-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Grading...
                    </>
                  ) : (
                    <>
                      <Icons.award className="w-5 h-5" />
                      Grade My Work
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/grader/AIGrader.jsx
git commit -m "feat: add AIGrader main view with text input, rubric selection, and grading"
```

---

### Task 6: Wire AI Grader into sidebar navigation and App routing

**Files:**
- Modify: `src/components/layout/Sidebar.jsx:5-16` (add nav item)
- Modify: `src/App.jsx:1-19` (add import), `src/App.jsx:121-124` (add view render)
- Modify: `src/context/AppContext.jsx:7-27` (add `gradingHistory` and `preferredGradeFormat` to `createUser`)

**Context:** Add the AI Grader as a new sidebar nav item (between Analytics and Extra Tools), add the route in App.jsx, and add default fields to `createUser()` + legacy migration.

**Step 1: Add nav item to Sidebar.jsx**

In `src/components/layout/Sidebar.jsx`, add a new entry to the NAV array between the `analytics` and `tools` entries (after line 13, before line 14):

```javascript
  { id: 'grader', icon: Icons.award, label: 'AI Grader' },
```

The NAV array should now look like:
```javascript
const NAV = [
  { id: 'home', icon: Icons.home, label: 'Dashboard' },
  { id: 'editor', icon: Icons.edit, label: 'Editor' },
  { id: 'projects', icon: Icons.folder, label: 'Projects' },
  { id: 'sprints', icon: Icons.timer, label: 'Writing Sprints' },
  { id: 'focus', icon: Icons.focus, label: 'Focus Mode' },
  { id: 'calendar', icon: Icons.calendar, label: 'Calendar' },
  { id: 'assistant', icon: Icons.message, label: 'AI Assistant' },
  { id: 'analytics', icon: Icons.chart, label: 'Analytics' },
  { id: 'grader', icon: Icons.award, label: 'AI Grader' },
  { id: 'tools', icon: Icons.star, label: 'Extra Tools' },
  { id: 'settings', icon: Icons.settings, label: 'Settings' },
];
```

**Step 2: Add import and route in App.jsx**

Add import at line 19 (after AdminStatsOverlay import):
```javascript
import AIGrader from './components/grader/AIGrader';
```

Add view render at line 123 (after the analytics line, before tools):
```javascript
          {view === 'grader' && <AIGrader />}
```

**Step 3: Add defaults to AppContext.jsx**

In `createUser()` function, add two new fields after `loginCount: 0,`:
```javascript
  gradingHistory: [],
  preferredGradeFormat: 'report-card',
```

In the legacy migration block (inside the `useEffect` that calls `load()`), add:
```javascript
  if (u.gradingHistory === undefined) u.gradingHistory = [];
  if (u.preferredGradeFormat === undefined) u.preferredGradeFormat = 'report-card';
```

**Step 4: Verify build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -5`
Expected: Build succeeds with no errors

**Step 5: Verify in browser**

Run: `cd /Users/starolis/Developer/Echo && npx netlify dev` (or check the already-running dev server)
1. Log in as claudia
2. Verify "AI Grader" appears in the sidebar between Analytics and Extra Tools
3. Click it — the grader view loads
4. Paste text, select a rubric, click "Grade My Work"
5. Verify results display correctly
6. Switch to History tab — verify the grade was saved

**Step 6: Commit**

```bash
git add src/components/layout/Sidebar.jsx src/App.jsx src/context/AppContext.jsx
git commit -m "feat: wire AI Grader into sidebar navigation and app routing"
```

---

### Task 7: Final build verification and push

**Files:** None (verification only)

**Step 1: Run production build**

Run: `cd /Users/starolis/Developer/Echo && npx vite build 2>&1 | tail -10`
Expected: Build succeeds, no warnings about unused imports

**Step 2: Verify all files committed**

Run: `git status`
Expected: Clean working tree

**Step 3: Push to remote**

Run: `git push`
Expected: Push succeeds, Netlify auto-deploys
