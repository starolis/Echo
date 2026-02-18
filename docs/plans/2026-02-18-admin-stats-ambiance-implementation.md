# Admin Stats Overlay + Focus Ambiance Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a hidden teacher stats overlay (Ctrl+4, claudia-only) and fix the non-functional focus mode ambiance audio.

**Architecture:** Two independent features. The admin overlay reads aggregated user data from AppContext's `data.users` object and renders an anonymous summary. The ambiance fix adds HTML5 Audio playback to the existing FocusMode component using free ambient sound URLs with graceful error handling.

**Tech Stack:** React 18, Tailwind CSS, HTML5 Audio API, existing AppContext data layer.

---

### Task 1: Add login tracking fields to user model

**Files:**
- Modify: `src/context/AppContext.jsx`

**Step 1: Add fields to createUser**

In `createUser()`, add after `completedTasks: []`:
```js
lastLogin: null,
loginCount: 0,
```

**Step 2: Update handleLogin to record login data**

In `handleLogin`, after `if (u && u.pass === password)`, before `setUser(u)`:
```js
const now = new Date().toISOString();
const updated = { ...u, lastLogin: now, loginCount: (u.loginCount || 0) + 1 };
setData(d => ({ ...d, users: { ...d.users, [username]: updated } }));
setUser(updated);
return true;
```
Remove the old `setUser(u); return true;` lines.

**Step 3: Update claudia demo account**

Add to the claudia demo object:
```js
lastLogin: '2026-02-17T20:30:00.000Z',
loginCount: 12,
```

**Step 4: Commit**
```bash
git add src/context/AppContext.jsx
git commit -m "feat: add login tracking fields to user model"
```

---

### Task 2: Create AdminStatsOverlay component

**Files:**
- Create: `src/components/admin/AdminStatsOverlay.jsx`

**Step 1: Create the component**

The component receives `users` (the `data.users` object) and `onClose` callback.

It computes:
- Total user count
- Quiz completion rate (% of users with quizResults)
- Avg projects per user
- Avg sessions completed
- Genre distribution (from quiz profiles)
- Common strengths and weaknesses
- Writer type distribution
- Login frequency (avg loginCount)
- Most common writing time (from quiz profiles)

All data is anonymous — no usernames or names rendered. Never accesses `projects[].content` or `chatSessions[].messages`.

Layout: Fixed overlay with backdrop, card-based sections, close button (Escape key + X button).

**Step 2: Commit**
```bash
git add src/components/admin/AdminStatsOverlay.jsx
git commit -m "feat: add anonymous admin stats overlay component"
```

---

### Task 3: Wire up Ctrl+4 shortcut in App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add import and state**

Import the new component:
```jsx
import AdminStatsOverlay from './components/admin/AdminStatsOverlay';
```

Add state in AppContent:
```jsx
const [showAdminStats, setShowAdminStats] = useState(false);
```

Also destructure `data` from `useApp()`.

**Step 2: Add keyboard listener**

Add `useEffect` after the existing state declarations:
```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '4' && user?.username === 'claudia') {
      e.preventDefault();
      setShowAdminStats(prev => !prev);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [user?.username]);
```

**Step 3: Render overlay**

Before the closing `</div>` of the main wrapper, add:
```jsx
{showAdminStats && (
  <AdminStatsOverlay users={data.users} onClose={() => setShowAdminStats(false)} />
)}
```

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "feat: wire Ctrl+4 admin stats shortcut for teacher account"
```

---

### Task 4: Create ambiance sounds constant file

**Files:**
- Create: `src/constants/ambianceSounds.js`

**Step 1: Create the file**

Research and find free, publicly hosted ambient sound URLs (archive.org, GitHub raw, or similar). Map each ambiance ID to its URL:
```js
export const AMBIANCE_SOUNDS = {
  rain: 'https://...',
  forest: 'https://...',
  cafe: 'https://...',
  fire: 'https://...',
  ocean: 'https://...',
};
```

**Step 2: Commit**
```bash
git add src/constants/ambianceSounds.js
git commit -m "feat: add ambient sound URLs for focus mode"
```

---

### Task 5: Add audio playback + mute toggle to FocusMode

**Files:**
- Modify: `src/components/focus/FocusMode.jsx`

**Step 1: Add audio useEffect**

Import the sounds map and add state + effect:
```jsx
import { AMBIANCE_SOUNDS } from '../../constants/ambianceSounds';

const [muted, setMuted] = useState(false);
```

Add `useEffect` that:
1. If `focusAmbiance === 'none'`, do nothing
2. Creates `new Audio(AMBIANCE_SOUNDS[focusAmbiance])`
3. Sets `audio.loop = true`, `audio.volume = 0.5`
4. Plays (with `.catch()` for autoplay policy)
5. Returns cleanup function that pauses and clears
6. Depends on `[focusAmbiance, muted]`

**Step 2: Add mute toggle button**

Replace the ambiance label in the header with a clickable mute/unmute button:
```jsx
{focusAmbiance !== 'none' && (
  <button onClick={() => setMuted(m => !m)} className="...">
    {muted ? '🔇' : '🎵'} {focusAmbiance}
  </button>
)}
```

**Step 3: Commit**
```bash
git add src/components/focus/FocusMode.jsx
git commit -m "feat: add ambient audio playback and mute toggle to focus mode"
```

---

### Task 6: Final build verification + push

**Step 1: Run build**
```bash
npm run build
```

**Step 2: Commit any remaining changes and push**
```bash
git push origin main
```
