import { ArrowLeft, TrendingUp, Flame, Activity, Droplet, Calendar } from 'lucide-react';
import { UserProfile, WorkoutLog, MealLog, HabitLog } from '../App';

interface ProgressProps {
  profile: UserProfile;
  workoutLogs: WorkoutLog[];
  mealLogs: MealLog[];
  habitLogs: HabitLog[];
  onBack: () => void;
}

export function Progress({ profile, workoutLogs, mealLogs, habitLogs, onBack }: ProgressProps) {
  const text = profile.language === 'sw' ? {
    progress: 'Maendeleo',
    thisWeek: 'Wiki Hii',
    workouts: 'Mazoezi',
    calories: 'Kalori',
    water: 'Maji',
    steps: 'Hatua',
    consistency: 'Uthabiti',
    total: 'Jumla',
    average: 'Wastani',
    streak: 'Mfululizo',
    days: 'siku',
  } : {
    progress: 'Progress',
    thisWeek: 'This Week',
    workouts: 'Workouts',
    calories: 'Calories',
    water: 'Water',
    steps: 'Steps',
    consistency: 'Consistency',
    total: 'Total',
    average: 'Average',
    streak: 'Streak',
    days: 'days',
  };

  // Calculate stats
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const workoutsByDay = last7Days.map(date => ({
    date,
    count: workoutLogs.filter(w => w.date.startsWith(date)).length,
    minutes: workoutLogs.filter(w => w.date.startsWith(date)).reduce((sum, w) => sum + w.duration, 0),
  }));

  const caloriesByDay = last7Days.map(date => ({
    date,
    total: mealLogs.filter(m => m.date.startsWith(date)).reduce((sum, m) => sum + m.totalCalories, 0),
  }));

  const waterByDay = last7Days.map(date => ({
    date,
    glasses: habitLogs.find(h => h.date === date)?.water || 0,
  }));

  const stepsByDay = last7Days.map(date => ({
    date,
    count: habitLogs.find(h => h.date === date)?.steps || 0,
  }));

  const totalWorkouts = workoutLogs.length;
  const totalMinutes = workoutLogs.reduce((sum, w) => sum + w.duration, 0);
  const avgCalories = Math.round(mealLogs.reduce((sum, m) => sum + m.totalCalories, 0) / (mealLogs.length || 1));
  const workoutStreak = calculateStreak(workoutsByDay);

  function calculateStreak(data: { count: number }[]): number {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count > 0) streak++;
      else break;
    }
    return streak;
  }

  const maxWorkoutMinutes = Math.max(...workoutsByDay.map(d => d.minutes), 1);
  const maxCalories = Math.max(...caloriesByDay.map(d => d.total), 1);
  const maxSteps = Math.max(...stepsByDay.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl text-white tracking-tight flex-1" style={{ fontWeight: 800 }}>
              {text.progress}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#1EB53A]/20 to-[#0F7A28]/10 border border-[#1EB53A]/30 rounded-3xl p-6">
            <Activity className="w-8 h-8 text-[#1EB53A] mb-3" strokeWidth={2.5} />
            <div className="text-4xl text-white mb-1" style={{ fontWeight: 800 }}>
              {totalWorkouts}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              {text.total} {text.workouts}
            </div>
            <div className="text-xs text-white/40 mt-2">
              {totalMinutes} minutes
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FF6B35]/20 to-[#E85A2A]/10 border border-[#FF6B35]/30 rounded-3xl p-6">
            <Flame className="w-8 h-8 text-[#FF6B35] mb-3" strokeWidth={2.5} />
            <div className="text-4xl text-white mb-1" style={{ fontWeight: 800 }}>
              {avgCalories}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              {text.average} {text.calories}
            </div>
            <div className="text-xs text-white/40 mt-2">
              per day
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#00A3DD]/20 to-[#0077A3]/10 border border-[#00A3DD]/30 rounded-3xl p-6">
            <TrendingUp className="w-8 h-8 text-[#00A3DD] mb-3" strokeWidth={2.5} />
            <div className="text-4xl text-white mb-1" style={{ fontWeight: 800 }}>
              {workoutStreak}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              {text.streak}
            </div>
            <div className="text-xs text-white/40 mt-2">
              {text.days}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1EB53A]/20 to-[#0F7A28]/10 border border-[#1EB53A]/30 rounded-3xl p-6">
            <Calendar className="w-8 h-8 text-[#1EB53A] mb-3" strokeWidth={2.5} />
            <div className="text-4xl text-white mb-1" style={{ fontWeight: 800 }}>
              {workoutsByDay.filter(d => d.count > 0).length}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              Active Days
            </div>
            <div className="text-xs text-white/40 mt-2">
              this week
            </div>
          </div>
        </div>

        {/* Workout Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>{text.workouts}</h2>
            <Activity className="w-5 h-5 text-[#1EB53A]" strokeWidth={2.5} />
          </div>

          {/* Bar Chart - Apple Health style */}
          <div className="space-y-4">
            {workoutsByDay.map((day, idx) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const heightPercent = (day.minutes / maxWorkoutMinutes) * 100;
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-8 text-xs text-white/60" style={{ fontWeight: 600 }}>
                    {dayName}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full transition-all duration-500"
                      style={{ width: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-white" style={{ fontWeight: 700 }}>
                    {day.minutes}
                  </div>
                  <div className="w-8 text-xs text-white/40">min</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calories Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>{text.calories}</h2>
            <Flame className="w-5 h-5 text-[#FF6B35]" strokeWidth={2.5} />
          </div>

          <div className="space-y-4">
            {caloriesByDay.map((day) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const heightPercent = (day.total / maxCalories) * 100;
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-8 text-xs text-white/60" style={{ fontWeight: 600 }}>
                    {dayName}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-full transition-all duration-500"
                      style={{ width: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-white" style={{ fontWeight: 700 }}>
                    {day.total}
                  </div>
                  <div className="w-8 text-xs text-white/40">cal</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>{text.steps}</h2>
            <TrendingUp className="w-5 h-5 text-[#00A3DD]" strokeWidth={2.5} />
          </div>

          <div className="space-y-4">
            {stepsByDay.map((day) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              const heightPercent = (day.count / maxSteps) * 100;
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-8 text-xs text-white/60" style={{ fontWeight: 600 }}>
                    {dayName}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#00A3DD] to-[#0077A3] rounded-full transition-all duration-500"
                      style={{ width: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-white" style={{ fontWeight: 700 }}>
                    {day.count.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h2 className="text-xl text-white mb-4" style={{ fontWeight: 700 }}>Weekly Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60" style={{ fontWeight: 600 }}>Total workouts</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>{workoutsByDay.reduce((sum, d) => sum + d.count, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60" style={{ fontWeight: 600 }}>Total minutes</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>{workoutsByDay.reduce((sum, d) => sum + d.minutes, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60" style={{ fontWeight: 600 }}>Avg calories</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>
                {Math.round(caloriesByDay.reduce((sum, d) => sum + d.total, 0) / 7)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60" style={{ fontWeight: 600 }}>Total water</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>
                {waterByDay.reduce((sum, d) => sum + d.glasses, 0)} glasses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
