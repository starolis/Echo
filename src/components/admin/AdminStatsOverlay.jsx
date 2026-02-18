import React, { useMemo, useEffect } from 'react';
import Icons from '../icons/Icons';

// Helper: count occurrences and return sorted [label, count] pairs
function tally(items) {
  const map = {};
  items.forEach((item) => {
    if (item) map[item] = (map[item] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function AdminStatsOverlay({ users, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const stats = useMemo(() => {
    const userList = Object.values(users || {});
    const totalUsers = userList.length;

    // Quiz completion
    const usersWithQuiz = userList.filter((u) => u.quizResults?.profile);
    const quizCompletionRate = totalUsers > 0
      ? Math.round((usersWithQuiz.length / totalUsers) * 100)
      : 0;

    // Avg projects per user
    const avgProjects = totalUsers > 0
      ? (userList.reduce((sum, u) => sum + (u.projects?.length || 0), 0) / totalUsers).toFixed(1)
      : '0';

    // Avg sessions completed
    const avgSessions = totalUsers > 0
      ? (userList.reduce((sum, u) => sum + (u.stats?.sessionsCompleted || 0), 0) / totalUsers).toFixed(1)
      : '0';

    // Avg login count
    const avgLogins = totalUsers > 0
      ? (userList.reduce((sum, u) => sum + (u.loginCount || 0), 0) / totalUsers).toFixed(1)
      : '0';

    // Genre distribution (from preferredGenres)
    const allGenres = usersWithQuiz.flatMap((u) => u.quizResults.profile.preferredGenres || []);
    const genreDistribution = tally(allGenres);

    // Common strengths
    const allStrengths = usersWithQuiz.flatMap((u) => u.quizResults.profile.strengths || []);
    const strengthDistribution = tally(allStrengths);

    // Common weaknesses
    const allWeaknesses = usersWithQuiz.flatMap((u) => u.quizResults.profile.weaknesses || []);
    const weaknessDistribution = tally(allWeaknesses);

    // Writer type distribution
    const allWriterTypes = usersWithQuiz.map((u) => u.quizResults.profile.writerType);
    const writerTypeDistribution = tally(allWriterTypes);

    // Most common writing time
    const allWritingTimes = usersWithQuiz.map((u) => u.quizResults.profile.writingHabits?.bestTime).filter(Boolean);
    const writingTimeDistribution = tally(allWritingTimes);

    return {
      totalUsers,
      quizCompletionRate,
      usersWithQuizCount: usersWithQuiz.length,
      avgProjects,
      avgSessions,
      avgLogins,
      genreDistribution,
      strengthDistribution,
      weaknessDistribution,
      writerTypeDistribution,
      writingTimeDistribution,
    };
  }, [users]);

  // Max value for a distribution, used for percentage bars
  const maxOf = (dist) => (dist.length > 0 ? dist[0][1] : 1);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-900 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/30">
              <Icons.chart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Class Overview</h2>
              <p className="text-xs text-slate-400">Anonymous aggregate stats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <Icons.x className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[calc(100vh-10rem)] overflow-y-auto">
          {/* Top-level stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Quiz Completion" value={`${stats.quizCompletionRate}%`} sub={`${stats.usersWithQuizCount} of ${stats.totalUsers}`} />
            <StatCard label="Avg Projects" value={stats.avgProjects} />
            <StatCard label="Avg Sessions" value={stats.avgSessions} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Avg Logins" value={stats.avgLogins} />
            <StatCard
              label="Top Writing Time"
              value={stats.writingTimeDistribution[0]?.[0] || 'N/A'}
              sub={stats.writingTimeDistribution[0] ? `${stats.writingTimeDistribution[0][1]} users` : undefined}
            />
          </div>

          {/* Writer Type Distribution */}
          <DistributionSection
            title="Writer Types"
            data={stats.writerTypeDistribution}
            max={maxOf(stats.writerTypeDistribution)}
            color="indigo"
          />

          {/* Genre Distribution */}
          <DistributionSection
            title="Preferred Genres"
            data={stats.genreDistribution}
            max={maxOf(stats.genreDistribution)}
            color="purple"
          />

          {/* Strengths */}
          <DistributionSection
            title="Common Strengths"
            data={stats.strengthDistribution}
            max={maxOf(stats.strengthDistribution)}
            color="emerald"
          />

          {/* Weaknesses */}
          <DistributionSection
            title="Common Weaknesses"
            data={stats.weaknessDistribution}
            max={maxOf(stats.weaknessDistribution)}
            color="amber"
          />

          {/* Writing Time Distribution */}
          {stats.writingTimeDistribution.length > 1 && (
            <DistributionSection
              title="Preferred Writing Times"
              data={stats.writingTimeDistribution}
              max={maxOf(stats.writingTimeDistribution)}
              color="sky"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-slate-700/50 rounded-xl p-4">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

const BAR_COLORS = {
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  sky: 'bg-sky-500',
};

function DistributionSection({ title, data, max, color }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map(([label, count]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-36 shrink-0 truncate" title={label}>
              {label}
            </span>
            <div className="flex-1 bg-slate-600/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${BAR_COLORS[color] || 'bg-indigo-500'} transition-all`}
                style={{ width: `${Math.round((count / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
