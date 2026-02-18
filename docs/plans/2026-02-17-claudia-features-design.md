# Echo Feature Design: Claudia's Demo Night Requests

**Date:** 2026-02-17
**Context:** Student presenting to audience tomorrow. Four major feature additions requested.

---

## Feature 1: Writer's Profile Quiz (40 Questions)

### Purpose
Onboarding quiz that captures writer identity, goals, strengths, and preferences. Results personalize the AI Assistant and generate dashboard tasks.

### UX Flow
1. User registers -> full-screen quiz appears (not dashboard)
2. Questions shown one at a time with progress bar (1/40)
3. Multiple choice or multi-select per question
4. Back button to revisit previous questions
5. On completion -> profile summary stored, user lands on dashboard
6. "Retake Quiz" button in Settings re-opens the quiz

### Quiz Categories (5 questions each, 40 total)
1. **Writing Identity** - Writer type, experience level, aspirations
2. **Genre & Style** - Favorite genres, preferred style, influences
3. **Goals & Motivation** - Current projects, ambitions, what drives them
4. **Strengths & Weaknesses** - What comes naturally, what's hard
5. **Writing Habits** - When, where, how often they write
6. **Reading Preferences** - What they read, favorite aspects
7. **Creative Process** - Planner vs pantser, ideation methods
8. **Growth Areas** - Skills to develop, feedback preferences

### Data Schema
```js
user.quizResults = {
  completedAt: 'ISO timestamp',
  answers: { q1: 'value', q2: ['multi', 'select'], ... },
  profile: {
    writerType: 'creative fiction writer',
    experience: 'intermediate',
    goals: ['finish first novel', 'improve dialogue'],
    strengths: ['world-building', 'plot'],
    weaknesses: ['dialogue', 'pacing'],
    preferredGenres: ['Fantasy', 'Science Fiction'],
    writingHabits: { bestTime: 'evening', frequency: 'daily' },
    readingPreferences: ['complex characters', 'plot twists'],
    processStyle: 'pantser',
    growthAreas: ['dialogue', 'showing vs telling']
  }
}
```

### AI Integration
The `profile` summary is injected into the AI chat system prompt in `ai-chat.cjs` so Echo gives contextually aware advice.

---

## Feature 2: Data Persistence & Working Theme System

### Theme System
- Read `user.settings.theme` ('dark' | 'light') and apply CSS classes to app wrapper
- Light theme: white/gray backgrounds, dark text, adjusted borders/shadows
- Font size: Apply text sizing classes based on `user.settings.fontSize`
- Font family: Apply font-family classes based on `user.settings.fontFamily`
- All changes are per-account (already handled by user data model)

### Persistence
- All data already persists via localStorage per user
- The gap is that settings are stored but never visually applied
- Fix: Theme wrapper component that reads settings and applies appropriate classes

---

## Feature 3: Personalized Dashboard Tasks

### Generation Logic
- On dashboard load, derive tasks from quiz profile + recent AI chat topics
- Show 3-5 tasks at a time
- Tasks link directly to destination views

### Task Card
- Title + description
- Difficulty badge: Easy (green), Medium (amber), Challenging (purple)
- Arrow/button linking to destination view
- Dismiss/complete actions

### Task Sources
| Signal | Example Task | Destination | Difficulty |
|--------|-------------|-------------|-----------|
| Weakness: dialogue | "Practice natural dialogue" | Editor (Dialogue tool) | Easy |
| Goal: finish novel | "Write 500 words today" | Projects | Medium |
| Habit: evenings | "Set an evening writing goal" | Calendar | Easy |
| Strength: world-building | "Build a world in 200 words" | Focus Mode | Challenging |
| Chat topic: pacing | "Try the Flow tool" | Editor (Flow tool) | Medium |

### Storage
```js
user.completedTasks = ['task-id-1', 'task-id-2', ...]
```

---

## Feature 4: Extra Tools Page

### Sidebar
New "Extra Tools" nav item with star icon, between Analytics and Settings.

### Page Sections (tabs)

#### 1. Writing Contests (~15-20 curated)
Real contests with working links, filtered by user's genre preferences.
- Scholastic Art & Writing Awards
- NaNoWriMo Young Writers Program
- Reedsy Short Story Contest
- NYC Midnight Flash Fiction
- Writer's Digest competitions
- Genre-specific awards (Hugo, Edgar, etc.)

Each shows: name, organizer, deadline, genre match, prize info, direct link.

#### 2. Recommended Books (~15-20 curated)
Craft books and genre-specific recommendations.
- "On Writing" by Stephen King
- "Bird by Bird" by Anne Lamott
- "The Elements of Style"
- Genre-specific picks

Links to Goodreads and library search.

#### 3. Editors & Writing Tools
External tools and services with links.
- Grammarly, ProWritingAid, Hemingway Editor
- Scrivener, Google Docs
- Beta reader platforms

#### 4. AI Recommendations
"Get More Recommendations" button calls Claude API with user's full profile for personalized suggestions. Falls back gracefully without API key.

### Filtering
All curated content tagged by genre. Items matching user's preferences highlighted with a badge. Everything visible but personalized items shown first.

---

## Cross-cutting: Model Update

Update all Netlify Functions from `claude-sonnet-4-5-20250929` to `claude-sonnet-4-6` (released 2026-02-17).

Files affected:
- `netlify/functions/ai-chat.cjs`
- `netlify/functions/ai-edit.cjs`
- `netlify/functions/ai-title.cjs`
