import { useState } from 'react';
import { Activity, Flame, Droplet, Footprints, Moon, Utensils, MessageCircle, Dumbbell, Users, TrendingUp, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { UserProfile, WorkoutLog, MealLog, HabitLog, Screen } from '../App';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NearbyGyms } from './NearbyGyms';
import { AllGymsModal } from './AllGymsModal';
import { getNearbyGyms } from '../data/tanzania-gyms';

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
  const [showAllGymsModal, setShowAllGymsModal] = useState(false);
  const nearbyGyms = getNearbyGyms(profile.location, 10);

  const text = profile.language === 'sw' ? {
    greeting: 'Habari',
    summary: 'Muhtasari',
    activity: 'Shughuli',
    nutrition: 'Lishe',
    mindfulness: 'Utulivu',
    move: 'Tembea',
    exercise: 'Zoezi',
    stand: 'Simama',
    water: 'Maji',
    calories: 'Kalori',
    steps: 'Hatua',
    sleep: 'Usingizi',
    quickActions: 'Vitendo Haraka',
    workout: 'Mazoezi',
    meals: 'Mlo',
    coach: 'AI Coach',
    habits: 'Tabia',
    progress: 'Maendeleo',
    family: 'Familia',
    askCoach: 'Uliza Coach',
  } : {
    greeting: 'Hello',
    summary: 'Summary',
    activity: 'Activity',
    nutrition: 'Nutrition',
    mindfulness: 'Mindfulness',
    move: 'Move',
    exercise: 'Exercise',
    stand: 'Stand',
    water: 'Water',
    calories: 'Calories',
    steps: 'Steps',
    sleep: 'Sleep',
    quickActions: 'Quick Actions',
    workout: 'Workout',
    meals: 'Meals',
    coach: 'AI Coach',
    habits: 'Habits',
    progress: 'Progress',
    family: 'Family',
    askCoach: 'Ask Coach',
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

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header - Apple Health style */}
      <div className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-white/60" style={{ fontWeight: 600 }}>{text.greeting}</p>
              <h1 className="text-3xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                {profile.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher 
                currentLanguage={profile.language} 
                onLanguageChange={(lang) => {
                  // Update profile language
                  const updatedProfile = { ...profile, language: lang };
                  // This would typically call a prop to update the profile
                }} 
              />
              <button
                onClick={() => onNavigate('settings')}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <SettingsIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Activity Rings - Apple Watch style */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <h2 className="text-xl text-white mb-6" style={{ fontWeight: 700 }}>{text.activity}</h2>
          
          <div className="flex items-center justify-center mb-8">
            {/* Concentric rings */}
            <div className="relative w-56 h-56">
              {/* Move ring (outer - green) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="rgba(30, 181, 58, 0.2)"
                  strokeWidth="16"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  fill="none"
                  stroke="#1EB53A"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - stepsPercent / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Exercise ring (middle - orange) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="80"
                  fill="none"
                  stroke="rgba(255, 107, 53, 0.2)"
                  strokeWidth="16"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="80"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - workoutPercent / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Stand ring (inner - blue) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="60"
                  fill="none"
                  stroke="rgba(0, 163, 221, 0.2)"
                  strokeWidth="16"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="60"
                  fill="none"
                  stroke="#00A3DD"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - waterPercent / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl text-white" style={{ fontWeight: 800 }}>
                    {Math.round((stepsPercent + workoutPercent + waterPercent) / 3)}%
                  </div>
                  <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ring legends */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#1EB53A]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.move}</span>
              </div>
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>{steps.toLocaleString()}</div>
              <div className="text-xs text-white/40">{stepsTarget.toLocaleString()} {text.steps}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#FF6B35]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.exercise}</span>
              </div>
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>{workoutMinutes}</div>
              <div className="text-xs text-white/40">{workoutTarget} min</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-[#00A3DD]"></div>
                <span className="text-xs text-white/60" style={{ fontWeight: 600 }}>{text.water}</span>
              </div>
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>{waterGlasses}</div>
              <div className="text-xs text-white/40">{waterTarget} glasses</div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Apple Health style */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calories */}
          <button
            onClick={() => onNavigate('food')}
            className="bg-gradient-to-br from-[#FF6B35]/20 to-[#E85A2A]/10 border border-[#FF6B35]/30 rounded-3xl p-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Flame className="w-8 h-8 text-[#FF6B35] mb-3" strokeWidth={2.5} />
            <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
              {caloriesConsumed}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              {text.calories}
            </div>
            <div className="text-xs text-white/40 mt-2">
              {caloriesTarget} target
            </div>
          </button>

          {/* Sleep */}
          <button
            onClick={() => onNavigate('habits')}
            className="bg-gradient-to-br from-[#00A3DD]/20 to-[#0077A3]/10 border border-[#00A3DD]/30 rounded-3xl p-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Moon className="w-8 h-8 text-[#00A3DD] mb-3" strokeWidth={2.5} />
            <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
              {todayHabits.sleep || 0}
            </div>
            <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
              {text.sleep}
            </div>
            <div className="text-xs text-white/40 mt-2">
              8 hours target
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl text-white mb-4 px-1" style={{ fontWeight: 700 }}>{text.quickActions}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('workout')}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <Dumbbell className="w-6 h-6 text-[#1EB53A] mb-3" strokeWidth={2.5} />
              <div className="text-sm text-white" style={{ fontWeight: 700 }}>{text.workout}</div>
            </button>

            <button
              onClick={() => onNavigate('food')}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <Utensils className="w-6 h-6 text-[#FF6B35] mb-3" strokeWidth={2.5} />
              <div className="text-sm text-white" style={{ fontWeight: 700 }}>{text.meals}</div>
            </button>

            <button
              onClick={() => onNavigate('coach')}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-6 h-6 text-[#00A3DD] mb-3" strokeWidth={2.5} />
              <div className="text-sm text-white" style={{ fontWeight: 700 }}>{text.coach}</div>
            </button>

            <button
              onClick={() => onNavigate('progress')}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              <TrendingUp className="w-6 h-6 text-[#1EB53A] mb-3" strokeWidth={2.5} />
              <div className="text-sm text-white" style={{ fontWeight: 700 }}>{text.progress}</div>
            </button>
          </div>
        </div>

        {/* Nearby Gyms */}
        {nearbyGyms.length > 0 && (
          <div>
            <NearbyGyms 
              gyms={nearbyGyms.slice(0, 3)} 
              onViewAll={() => setShowAllGymsModal(true)}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation - iOS style */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#000000]/90 backdrop-blur-2xl border-t border-white/10">
        <div className="flex items-center justify-around px-6 py-3 safe-bottom">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <Activity className="w-6 h-6 text-[#1EB53A]" strokeWidth={2.5} />
            <span className="text-xs text-[#1EB53A]" style={{ fontWeight: 700 }}>Summary</span>
          </button>

          <button
            onClick={() => onNavigate('habits')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <Droplet className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>Habits</span>
          </button>

          <button
            onClick={() => onNavigate('family')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <Users className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>Family</span>
          </button>

          <button
            onClick={() => onNavigate('coach')}
            className="flex flex-col items-center gap-1 py-2"
          >
            <MessageCircle className="w-6 h-6 text-white/40" strokeWidth={2.5} />
            <span className="text-xs text-white/40" style={{ fontWeight: 600 }}>Coach</span>
          </button>
        </div>
      </div>

      {/* All Gyms Modal */}
      {showAllGymsModal && (
        <AllGymsModal onClose={() => setShowAllGymsModal(false)} />
      )}
    </div>
  );
}