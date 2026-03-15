import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Flame, Target, Download, Calendar } from 'lucide-react';
import { UserProfile, WorkoutLog, MealLog, HabitLog } from '../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsProps {
  profile: UserProfile;
  workoutLogs: WorkoutLog[];
  mealLogs: MealLog[];
  habitLogs: HabitLog[];
  onBack: () => void;
}

export function Analytics({ profile, workoutLogs, mealLogs, habitLogs, onBack }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const text = profile.language === 'sw' ? {
    title: 'Uchambuzi',
    overview: 'Muhtasari',
    workouts: 'Mazoezi',
    nutrition: 'Lishe',
    habits: 'Tabia',
    timeRange: {
      week: 'Wiki',
      month: 'Mwezi',
      year: 'Mwaka',
    },
    totalWorkouts: 'Jumla ya Mazoezi',
    avgDuration: 'Wastani wa Muda',
    caloriesBurned: 'Kalori Zilizochomwa',
    avgCalories: 'Wastani wa Kalori',
    waterIntake: 'Maji Yaliyonywa',
    sleepHours: 'Masaa ya Usingizi',
    steps: 'Hatua',
    minutes: 'dakika',
    glasses: 'glasi',
    hours: 'masaa',
    downloadReport: 'Pakua Ripoti',
    trend: 'Mwenendo',
    prediction: 'Utabiri',
    goals: 'Malengo',
  } : {
    title: 'Analytics',
    overview: 'Overview',
    workouts: 'Workouts',
    nutrition: 'Nutrition',
    habits: 'Habits',
    timeRange: {
      week: 'Week',
      month: 'Month',
      year: 'Year',
    },
    totalWorkouts: 'Total Workouts',
    avgDuration: 'Avg Duration',
    caloriesBurned: 'Calories Burned',
    avgCalories: 'Avg Calories',
    waterIntake: 'Water Intake',
    sleepHours: 'Sleep Hours',
    steps: 'Steps',
    minutes: 'min',
    glasses: 'glasses',
    hours: 'hours',
    downloadReport: 'Download Report',
    trend: 'Trend',
    prediction: 'Prediction',
    goals: 'Goals',
  };

  // Calculate statistics
  const stats = {
    totalWorkouts: workoutLogs.length,
    avgDuration: workoutLogs.length > 0 
      ? Math.round(workoutLogs.reduce((sum, w) => sum + w.duration, 0) / workoutLogs.length)
      : 0,
    totalCaloriesBurned: workoutLogs.length * 300, // Rough estimate
    avgCaloriesConsumed: mealLogs.length > 0
      ? Math.round(mealLogs.reduce((sum, m) => sum + m.totalCalories, 0) / mealLogs.length)
      : 0,
    totalWater: habitLogs.reduce((sum, h) => sum + h.water, 0),
    avgSleep: habitLogs.length > 0
      ? (habitLogs.reduce((sum, h) => sum + h.sleep, 0) / habitLogs.length).toFixed(1)
      : 0,
    totalSteps: habitLogs.reduce((sum, h) => sum + h.steps, 0),
  };

  // Generate workout trend data
  const workoutTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayWorkouts = workoutLogs.filter(w => w.date.startsWith(dateStr));
    
    return {
      day: date.toLocaleDateString(profile.language === 'sw' ? 'sw-TZ' : 'en-US', { weekday: 'short' }),
      workouts: dayWorkouts.length,
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    };
  });

  // Generate calorie trend data
  const calorieTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayMeals = mealLogs.filter(m => m.date.startsWith(dateStr));
    
    return {
      day: date.toLocaleDateString(profile.language === 'sw' ? 'sw-TZ' : 'en-US', { weekday: 'short' }),
      calories: dayMeals.reduce((sum, m) => sum + m.totalCalories, 0),
      target: profile.dailyCalorieTarget || 2000,
    };
  });

  // Workout type distribution
  const workoutTypeData = workoutLogs.reduce((acc, workout) => {
    const existing = acc.find(item => item.type === workout.type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: workout.type, count: 1 });
    }
    return acc;
  }, [] as { type: string; count: number }[]);

  const COLORS = ['#1EB53A', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white pb-20">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{text.title}</h1>
            </div>
            <button className="p-3 bg-gradient-to-r from-[#1EB53A] to-emerald-500 rounded-2xl hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                timeRange === range
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-black/30 text-white/60 hover:bg-black/50'
              }`}
            >
              {text.timeRange[range]}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 p-6 rounded-3xl border border-blue-500/30"
          >
            <Activity className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.totalWorkouts}</div>
            <div className="text-sm text-white/60">{text.totalWorkouts}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-6 rounded-3xl border border-green-500/30"
          >
            <Flame className="w-8 h-8 text-orange-500 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.totalCaloriesBurned}</div>
            <div className="text-sm text-white/60">{text.caloriesBurned}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 p-6 rounded-3xl border border-purple-500/30"
          >
            <Target className="w-8 h-8 text-purple-500 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.avgDuration}</div>
            <div className="text-sm text-white/60">{text.avgDuration}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 p-6 rounded-3xl border border-yellow-500/30"
          >
            <TrendingUp className="w-8 h-8 text-yellow-500 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stats.totalWater}</div>
            <div className="text-sm text-white/60">{text.waterIntake}</div>
          </motion.div>
        </div>

        {/* Workout Trend Chart */}
        <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">{text.workouts} - {text.trend}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={workoutTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1F0F',
                  border: '1px solid #1EB53A',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="workouts" fill="#1EB53A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calorie Trend Chart */}
        <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">{text.nutrition} - {text.trend}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={calorieTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1F0F',
                  border: '1px solid #1EB53A',
                  borderRadius: '12px',
                }}
              />
              <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Type Distribution */}
        {workoutTypeData.length > 0 && (
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">{text.workouts} - Distribution</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {workoutTypeData.map((item, index) => (
                  <div key={item.type} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white/80">{item.type}</span>
                    <span className="text-white/60">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Download Report Button */}
        <button className="w-full py-4 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          {text.downloadReport} (PDF)
        </button>
      </div>
    </div>
  );
}
