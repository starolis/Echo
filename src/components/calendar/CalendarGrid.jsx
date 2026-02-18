import React from 'react';
import Icons from '../icons/Icons';

export default function CalendarGrid({ calendarMonth, setCalendarMonth, selectedDate, setSelectedDate, writingGoals }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getDateKey = (date) => date.toISOString().split('T')[0];

  const { firstDay, daysInMonth } = getDaysInMonth(calendarMonth);
  const today = new Date();
  // Bug fix #3: Use a separate variable for start-of-today comparison instead of mutating `today`
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const dateKey = getDateKey(date);
    const goal = writingGoals[dateKey];
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    const isPast = date < startOfToday;

    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(date)}
        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${
          isSelected
            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
            : isToday
              ? 'bg-white/10 ring-1 ring-white/30'
              : 'hover:bg-white/5'
        } ${isPast && !goal?.completed ? 'opacity-50' : ''}`}
      >
        <span className={isToday ? 'font-bold' : ''}>{day}</span>
        {goal && (
          <div className={`absolute bottom-1 w-2 h-2 rounded-full ${goal.completed ? 'bg-green-400' : 'bg-amber-400'}`} />
        )}
      </button>
    );
  }

  return (
    <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Icons.chevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Icons.chevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm text-slate-500 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Scheduled</span>
        </div>
      </div>
    </div>
  );
}
