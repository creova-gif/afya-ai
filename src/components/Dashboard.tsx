import { useState } from 'react';
import { Activity, Flame, Droplet, Footprints, Moon, Utensils, MessageCircle, Dumbbell, Users, TrendingUp, Settings as SettingsIcon, ChevronRight, Heart, Trophy } from 'lucide-react';
import { UserProfile, WorkoutLog, MealLog, HabitLog, Screen } from '../App';
import { LanguageSwitcher } from './LanguageSwitcher';
import { gamificationService } from '../services/gamification';

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (screen: Screen) => void;
  todayWorkouts: WorkoutLog[];
  todayMeals: MealLog[];
  todayHabits: HabitLog;
  onStartWorkout: (workout: any) => void;
}

export function Dashboard({ 
  profile, 
  onNavigate, 
  todayWorkouts, 
  todayMeals, 
  todayHabits,
  onStartWorkout 
}: DashboardProps) {
  // Get gamification stats
  const gamStats = gamificationService.getStats();
  
  const text = profile.language === 'sw' ? {
    greeting: 'Habari',
    activity: 'Shughuli',
    move: 'Tembea',
    exercise: 'Zoezi',
    stand: 'Simama',
    water: 'Maji',
    calories: 'Kalori',
    steps: 'Hatua',
    sleep: 'Usingizi',
    complete: 'Kamili',
    target: 'Lengo',
    summary: 'Muhtasari',
    sharing: 'Kushiriki',
    trends: 'Mwelekeo',
    messages: 'Ujumbe',
    profile: 'Wasifu',
    achievements: 'Mafanikio',
    level: 'Kiwango',
    points: 'Pointi',
    streak: 'Mfululizo',
  } : {
    greeting: 'Hello',
    activity: 'Activity',
    move: 'Move',
    exercise: 'Exercise',
    stand: 'Stand',
    water: 'Water',
    calories: 'Calories',
    steps: 'Steps',
    sleep: 'Sleep',
    complete: 'Complete',
    target: 'Target',
    summary: 'Summary',
    sharing: 'Sharing',
    trends: 'Trends',
    messages: 'Messages',
    profile: 'Profile',
    achievements: 'Achievements',
    level: 'Level',
    points: 'Points',
    streak: 'Streak',
  };

  // Calculate stats
  const caloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const caloriesTarget = profile.dailyCalorieTarget || 2000;
  const caloriesPercent = Math.min((caloriesConsumed / caloriesTarget) * 100, 100);
  
  const waterGlasses = todayHabits.water || 0;
  const waterTarget = 8;
  const waterPercent = Math.min((waterGlasses / waterTarget) * 100, 100);
  
  const steps = todayHabits.steps || 0;
  const stepsTarget = 10000;
  const stepsPercent = Math.min((steps / stepsTarget) * 100, 100);

  const workoutMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const workoutTarget = profile.availableTimeMinutes || 30;
  const workoutPercent = Math.min((workoutMinutes / workoutTarget) * 100, 100);

  const sleepHours = todayHabits.sleep || 0;
  const sleepTarget = 8;
  const sleepPercent = Math.min((sleepHours / sleepTarget) * 100, 100);

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header - Compact Profile Card */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-[0_8px_24px_rgba(30,181,58,0.3)]">
                  <span className="text-xl text-white" style={{ fontWeight: 800 }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#000000]"></div>
              </div>
              
              {/* Name & Greeting */}
              <div>
                <p className="text-xs text-white/50" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {text.greeting}
                </p>
                <h1 className="text-lg text-white tracking-tight" style={{ fontWeight: 800 }}>
                  {profile.name}
                </h1>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher 
                currentLanguage={profile.language} 
                onLanguageChange={(lang) => {
                  const updatedProfile = { ...profile, language: lang };
                }} 
              />
              <button
                onClick={() => onNavigate('settings')}
                className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
              >
                <SettingsIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-6">
        {/* Activity Rings - Centered & Large */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-center mb-8">
            {/* Concentric rings */}
            <div className="relative w-64 h-64">
              {/* Move ring (outer - green) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  fill="none"
                  stroke="rgba(30, 181, 58, 0.15)"
                  strokeWidth="18"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  fill="none"
                  stroke="#1EB53A"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - stepsPercent / 100)}`}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(30, 181, 58, 0.5))' }}
                />
              </svg>

              {/* Exercise ring (middle - orange/red) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="88"
                  fill="none"
                  stroke="rgba(255, 107, 53, 0.15)"
                  strokeWidth="18"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="88"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - workoutPercent / 100)}`}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.5))' }}
                />
              </svg>

              {/* Water ring (inner - blue) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="66"
                  fill="none"
                  stroke="rgba(0, 163, 221, 0.15)"
                  strokeWidth="18"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="66"
                  fill="none"
                  stroke="#00A3DD"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 66}`}
                  strokeDashoffset={`${2 * Math.PI * 66 * (1 - waterPercent / 100)}`}
                  className="transition-all duration-1000"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 163, 221, 0.5))' }}
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl text-white mb-1" style={{ fontWeight: 800 }}>
                    {Math.round((stepsPercent + workoutPercent + waterPercent) / 3)}%
                  </div>
                  <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>{text.complete}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ring metrics - 3 columns */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('habits')}
              className="text-center active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#1EB53A] shadow-[0_0_8px_rgba(30,181,58,0.6)]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.move}</span>
              </div>
              <div className="text-2xl text-white mb-0.5" style={{ fontWeight: 700 }}>{steps.toLocaleString()}</div>
              <div className="text-xs text-white/40">{stepsTarget.toLocaleString()} {text.steps}</div>
            </button>
            
            <button
              onClick={() => onNavigate('workout')}
              className="text-center active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B35] shadow-[0_0_8px_rgba(255,107,53,0.6)]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.exercise}</span>
              </div>
              <div className="text-2xl text-white mb-0.5" style={{ fontWeight: 700 }}>{workoutMinutes}</div>
              <div className="text-xs text-white/40">{workoutTarget} min</div>
            </button>
            
            <button
              onClick={() => onNavigate('habits')}
              className="text-center active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#00A3DD] shadow-[0_0_8px_rgba(0,163,221,0.6)]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.water}</span>
              </div>
              <div className="text-2xl text-white mb-0.5" style={{ fontWeight: 700 }}>{waterGlasses}</div>
              <div className="text-xs text-white/40">{waterTarget} glasses</div>
            </button>
          </div>
        </div>

        {/* Stats Cards - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calories */}
          <button
            onClick={() => onNavigate('food')}
            className="bg-gradient-to-br from-[#FF6B35]/20 to-[#E85A2A]/10 border border-[#FF6B35]/30 rounded-3xl p-6 text-left active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-7 h-7 text-[#FF6B35]" strokeWidth={2.5} />
              <div className="text-xs text-[#FF6B35]/60" style={{ fontWeight: 600 }}>
                {Math.round(caloriesPercent)}%
              </div>
            </div>
            <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
              {caloriesConsumed}
            </div>
            <div className="text-sm text-white/60 mb-1" style={{ fontWeight: 600 }}>
              {text.calories}
            </div>
            <div className="text-xs text-white/40">
              {caloriesTarget} {text.target.toLowerCase()}
            </div>
          </button>

          {/* Sleep */}
          <button
            onClick={() => onNavigate('habits')}
            className="bg-gradient-to-br from-[#9333EA]/20 to-[#7C3AED]/10 border border-[#9333EA]/30 rounded-3xl p-6 text-left active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between mb-3">
              <Moon className="w-7 h-7 text-[#9333EA]" strokeWidth={2.5} />
              <div className="text-xs text-[#9333EA]/60" style={{ fontWeight: 600 }}>
                {Math.round(sleepPercent)}%
              </div>
            </div>
            <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
              {sleepHours}h
            </div>
            <div className="text-sm text-white/60 mb-1" style={{ fontWeight: 600 }}>
              {text.sleep}
            </div>
            <div className="text-xs text-white/40">
              {sleepTarget}h {text.target.toLowerCase()}
            </div>
          </button>
        </div>

        {/* Achievements Card - Full Width */}
        <button
          onClick={() => onNavigate('achievements')}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6 text-left active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg text-white mb-0.5" style={{ fontWeight: 700 }}>
                  {text.achievements}
                </div>
                <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>
                  {text.level} {gamStats.level} • {gamStats.totalPoints.toLocaleString()} {text.points}
                </div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/40" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>{text.streak}</span>
                <span>{gamStats.streaks.workout.current} {profile.language === 'sw' ? 'siku' : 'days'}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${Math.min((gamStats.streaks.workout.current / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl" style={{ fontWeight: 800 }}>
                {gamStats.achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-xs text-white/40">
                {gamStats.achievements.filter(a => !a.unlocked).length} left
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Navigation - Mobile-first, 5 tabs max, 48px minimum */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000000]/95 backdrop-blur-2xl border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 py-2 px-4 min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
          >
            <Activity className="w-6 h-6 text-[#1EB53A]" strokeWidth={2.5} />
            <span className="text-xs text-[#1EB53A]" style={{ fontWeight: 700 }}>{text.summary}</span>
          </button>

          <button
            onClick={() => onNavigate('wellness')}
            className="flex flex-col items-center gap-1 py-2 px-4 min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
          >
            <Heart className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>{text.trends}</span>
          </button>

          <button
            onClick={() => onNavigate('coach')}
            className="flex flex-col items-center gap-1 py-2 px-4 min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
          >
            <MessageCircle className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>{text.messages}</span>
          </button>

          <button
            onClick={() => onNavigate('family')}
            className="flex flex-col items-center gap-1 py-2 px-4 min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
          >
            <Users className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>{text.sharing}</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="flex flex-col items-center gap-1 py-2 px-4 min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
          >
            <SettingsIcon className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>{text.profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
}