# Design: Admin Stats Overlay + Focus Mode Ambiance Fix

**Date:** 2026-02-18
**Status:** Approved

## Feature 1: Admin Stats Overlay (Ctrl+4)

### Problem
Claudia (the teacher) wants to view anonymized aggregate statistics about other users from her account. This should be a hidden feature accessible only via keyboard shortcut.

### Privacy Requirements
- No usernames or names displayed — only percentages and aggregates
- No access to writing content or chat sessions
- Only reads: quiz results, project counts, session stats, login data

### Data Model Changes
Add to `createUser()`:
- `lastLogin: null` — ISO timestamp, set on each successful login
- `loginCount: 0` — incremented on each successful login

Update `handleLogin` to set both fields.

### Keyboard Shortcut
- `Ctrl+4` in `App.jsx` via `useEffect` keydown listener
- Only activates when `user?.username === 'claudia'`
- Toggles `showAdminStats` state

### AdminStatsOverlay Component
File: `src/components/admin/AdminStatsOverlay.jsx`

Overlay modal showing:
- **Summary:** Total users, quiz completion %, avg projects per user
- **Quiz Insights:** Genre distribution, common strengths/weaknesses, writer type breakdown
- **Activity:** Avg sessions, login frequency, common writing times
- All data computed as aggregates from `data.users`

## Feature 2: Focus Mode Ambiance Fix

### Problem
The ambiance selector in FocusSetup works in the UI but no audio plays in FocusMode.

### Solution
- New constant file `src/constants/ambianceSounds.js` with URLs to free looping ambient audio
- `useEffect` in FocusMode.jsx creates `new Audio()`, sets `loop = true`, plays on mount
- Cleans up on unmount or ambiance change
- Mute toggle button added to FocusMode header bar

### Sound Sources
Free CDN-hosted ambient audio loops (rain, forest, café, fireplace, ocean).
