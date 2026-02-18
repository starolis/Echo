import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Icons from '../icons/Icons';
import SprintTimer from './SprintTimer';
import SprintHistory from './SprintHistory';

export default function SprintsPage() {
  const { user, updateUser, notify } = useApp();

  const [sprintTime, setSprintTime] = useState(15);
  const [sprintWordGoal, setSprintWordGoal] = useState(500);
  const [sprintRunning, setSprintRunning] = useState(false);
  const [sprintTimeLeft, setSprintTimeLeft] = useState(0);
  const [sprintWords, setSprintWords] = useState(0);
  const [sprintStartWords, setSprintStartWords] = useState(0);
  const [sprintText, setSprintText] = useState('');

  // Bug fix #4: Load sprint history and streak from user data
  const [sprintHistory, setSprintHistory] = useState(user?.sprintHistory || []);
  const [currentStreak, setCurrentStreak] = useState(user?.sprintStreak || 0);

  const sprintIntervalRef = useRef(null);
  const sprintTextRef = useRef(sprintText);

  // Keep ref in sync with state so interval callback always sees current text
  useEffect(() => {
    sprintTextRef.current = sprintText;
  }, [sprintText]);

  // Bug fix #4: Persist sprint history and streak to user data
  useEffect(() => {
    if (sprintHistory.length > 0 || currentStreak > 0) {
      updateUser({ sprintHistory, sprintStreak: currentStreak });
    }
  }, [sprintHistory, currentStreak, updateUser]);

  useEffect(() => {
    if (sprintRunning && sprintTimeLeft > 0) {
      sprintIntervalRef.current = setInterval(() => {
        setSprintTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(sprintIntervalRef.current);
            setSprintRunning(false);
            const wordsWritten = sprintTextRef.current.split(/\s+/).filter(w => w).length - sprintStartWords;
            const newSprint = {
              id: Date.now(),
              date: new Date().toISOString(),
              duration: sprintTime,
              wordsWritten,
              goal: sprintWordGoal,
              completed: wordsWritten >= sprintWordGoal
            };
            setSprintHistory(prev => [...prev, newSprint]);
            if (wordsWritten >= sprintWordGoal) {
              setCurrentStreak(prev => prev + 1);
              notify(`Sprint complete! ${wordsWritten} words written!`);
            } else {
              setCurrentStreak(0);
              notify(`Sprint ended. ${wordsWritten} words written.`);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sprintIntervalRef.current);
  }, [sprintRunning, sprintTimeLeft]);

  useEffect(() => {
    if (sprintRunning) {
      setSprintWords(sprintText.split(/\s+/).filter(w => w).length - sprintStartWords);
    }
  }, [sprintText, sprintRunning, sprintStartWords]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startSprint = () => {
    setSprintTimeLeft(sprintTime * 60);
    setSprintStartWords(sprintText.split(/\s+/).filter(w => w).length);
    setSprintWords(0);
    setSprintRunning(true);
  };

  const pauseSprint = () => {
    setSprintRunning(false);
    clearInterval(sprintIntervalRef.current);
  };

  const resumeSprint = () => setSprintRunning(true);

  const resetSprint = () => {
    setSprintRunning(false);
    setSprintTimeLeft(0);
    setSprintWords(0);
    clearInterval(sprintIntervalRef.current);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Writing Sprints</h1>
        <div className="flex items-center gap-2">
          <Icons.flame className="w-5 h-5 text-orange-400" />
          <span className="text-sm">{currentStreak} day streak</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SprintTimer
            sprintTime={sprintTime}
            setSprintTime={setSprintTime}
            sprintWordGoal={sprintWordGoal}
            setSprintWordGoal={setSprintWordGoal}
            sprintRunning={sprintRunning}
            sprintTimeLeft={sprintTimeLeft}
            sprintWords={sprintWords}
            sprintText={sprintText}
            setSprintText={setSprintText}
            formatTime={formatTime}
            onStart={startSprint}
            onPause={pauseSprint}
            onResume={resumeSprint}
            onReset={resetSprint}
          />
        </div>

        <SprintHistory sprintHistory={sprintHistory} />
      </div>
    </div>
  );
}
