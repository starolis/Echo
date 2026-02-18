# AI Grader Feature — Design Document

**Date:** 2026-02-18
**Requested by:** Claudia (student)
**Status:** Approved

---

## Overview

A new standalone view in Echo that lets users submit their writing to be graded by AI against a rubric. Users can pick from 5 premade skill-focused rubric templates or write their own custom criteria. Grading results are displayed in one of three user-selectable formats (report card, written feedback, or rubric table). History is saved so users can track improvement over time.

---

## Page Layout

Two-column grid (`lg:grid-cols-3`) matching the app's existing layout pattern.

**Top bar:** Title "AI Grader" with tab toggle — "New Grade" | "History"

**Left column (2/3 width):**
- Import from project dropdown (lists user's existing projects, selecting one populates textarea)
- Large textarea for writing (paste or type directly)
- Word count below textarea

**Right column (1/3 width):**
- Rubric selection panel (premade templates + custom rubric textarea)
- Feedback format preference toggle (Report Card / Written Feedback / Rubric Table)
- "Grade My Work" button
- After grading: results replace the rubric panel, with "New Grade" button to reset

---

## Rubric System

### Custom Rubric (first-class option)
A textarea where the user types grading criteria in plain language. Example: "Grade on creativity, use of metaphor, stays under 500 words, and has a clear theme." The AI interprets and grades against whatever the user writes.

### Premade Skill-Focused Templates

| Rubric | What it grades | Categories |
|--------|---------------|------------|
| **Grammar & Mechanics** | Spelling, punctuation, capitalization, sentence structure | Spelling, Punctuation, Sentence Structure, Capitalization |
| **Vocabulary & Word Choice** | Word variety, precise language, sensory details | Word Variety, Precise Language, Sensory Details, Avoiding Repetition |
| **Story Structure** | Beginning/middle/end, pacing, conflict, resolution | Opening Hook, Rising Action, Climax, Resolution |
| **Character Development** | Character depth, motivation, growth, dialogue | Character Introduction, Motivation, Growth/Arc, Believability |
| **Dialogue** | Natural speech, attribution, advancing plot through conversation | Naturalism, Tags & Attribution, Advancing Plot, Distinct Voices |

---

## Feedback Formats

User-selectable preference (persisted in user settings, default: Report Card).

### Report Card (default)
- Overall letter grade (A+ through F) with percentage score
- Per-category letter grades
- 2-3 sentence summary of strengths
- 2-3 specific improvement suggestions
- Colored grade badges (green A/B, amber C, red D/F)

### Written Feedback
- Paragraph-style teacher comments organized by rubric category
- No scores or grades — narrative only
- Encouraging closing remark

### Rubric Table
- Grid with each criterion scored 1-4 (Beginning / Developing / Proficient / Advanced)
- Brief note per criterion
- Total score at bottom

---

## Context Awareness

The grading prompt includes:
- User's genre preference
- Quiz profile (strengths/weaknesses) for personalized feedback
- Workshop student context — encouraging, age-appropriate tone
- The selected rubric criteria (premade or custom)
- The requested feedback format

---

## Grading History

Stored in `user.gradingHistory` (array, persisted via localStorage).

Each entry contains:
- `id` — timestamp-based ID
- `date` — ISO date string
- `textSnippet` — first ~50 characters of graded text
- `rubricName` — template name or "Custom"
- `feedbackFormat` — which format was used
- `overallGrade` — letter grade or score (for quick display in list)
- `results` — full results object

**History view:** Scrollable list with date, snippet, rubric name, and grade badge. Click to expand and see full results. Delete individual entries.

---

## Architecture

### New Files
- `src/components/grader/AIGrader.jsx` — Main view component
- `src/components/grader/GradeResults.jsx` — Results display (all 3 formats)
- `src/components/grader/GradingHistory.jsx` — History list
- `src/constants/rubrics.js` — 5 premade rubric templates
- `netlify/functions/ai-grade.cjs` — Serverless proxy function

### Modified Files
- `src/components/layout/Sidebar.jsx` — Add "AI Grader" nav item
- `src/App.jsx` — Add `view === 'grader'` render block
- `src/services/api.js` — Add `performAIGrade()` wrapper
- `src/context/AppContext.jsx` — Add `gradingHistory` to defaults + legacy migration

### Data Flow
1. User pastes text or imports from project
2. User picks premade rubric OR writes custom criteria
3. User picks feedback format (defaults to Report Card)
4. Click "Grade My Work" → `performAIGrade()` → `ai-grade.cjs`
5. Netlify function sends text + rubric + format + context to Claude
6. Response parsed and displayed in chosen format
7. Result saved to `user.gradingHistory` via `updateUser()`

### API Response Structure
```json
{
  "overallGrade": "B+",
  "overallScore": 87,
  "categories": [
    {
      "name": "Spelling",
      "grade": "A",
      "score": 95,
      "rubricScore": 4,
      "feedback": "Excellent spelling throughout..."
    }
  ],
  "strengths": ["Strong opening hook", "Vivid sensory details"],
  "improvements": ["Vary sentence length more", "Strengthen the resolution"],
  "summary": "Overall narrative feedback paragraph...",
  "error": false
}
```

The display component selects which fields to render based on the chosen feedback format.
