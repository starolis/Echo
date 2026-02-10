import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CalendarGrid from './CalendarGrid';
import DayDetail from './DayDetail';
import GoalModal from './GoalModal';

export default function CalendarPage() {
  const { user, updateUser, notify } = useApp();

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  // Bug fix #6: Use user.writingGoals as single source of truth
  const [writingGoals, setWritingGoals] = useState(user?.writingGoals || {});
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ type: 'words', target: 500, time: '' });

  const getDateKey = (date) => date.toISOString().split('T')[0];

  const saveGoal = () => {
    if (!selectedDate) return;
    const key = getDateKey(selectedDate);
    const updatedGoals = { ...writingGoals, [key]: { ...goalForm, completed: false } };
    setWritingGoals(updatedGoals);
    updateUser({ writingGoals: updatedGoals });
    setShowGoalModal(false);
    notify('Goal saved!');
  };

  const toggleGoalComplete = (dateKey) => {
    const goal = writingGoals[dateKey] || user?.writingGoals?.[dateKey];
    if (!goal) return;
    const updated = { ...goal, completed: !goal.completed };
    const updatedGoals = { ...writingGoals, [dateKey]: updated };
    setWritingGoals(updatedGoals);
    updateUser({ writingGoals: updatedGoals });
  };

  // Monthly stats
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const allGoals = { ...user?.writingGoals, ...writingGoals };
  const monthGoals = Object.entries(allGoals).filter(([key]) => {
    const date = new Date(key);
    return date >= monthStart && date <= monthEnd;
  });
  const completed = monthGoals.filter(([, g]) => g.completed).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Writing Calendar</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <CalendarGrid
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          writingGoals={writingGoals}
          userWritingGoals={user?.writingGoals}
        />

        <div className="space-y-4">
          <DayDetail
            selectedDate={selectedDate}
            writingGoals={writingGoals}
            userWritingGoals={user?.writingGoals}
            onToggleComplete={toggleGoalComplete}
            onSetGoal={() => setShowGoalModal(true)}
          />

          <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-4">
            <h3 className="font-semibold mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-slate-400">Goals Set</span>
                <span className="font-bold">{monthGoals.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-slate-400">Completed</span>
                <span className="font-bold text-green-400">{completed}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-slate-400">Success Rate</span>
                <span className="font-bold text-indigo-400">
                  {monthGoals.length > 0 ? Math.round((completed / monthGoals.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGoalModal && selectedDate && (
        <GoalModal
          selectedDate={selectedDate}
          goalForm={goalForm}
          setGoalForm={setGoalForm}
          onSave={saveGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}
    </div>
  );
}
