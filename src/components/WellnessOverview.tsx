import { ArrowLeft, Activity, Flame, Droplet, Moon, Footprints, TrendingUp, Heart } from 'lucide-react';
import { UserProfile, WorkoutLog, MealLog, HabitLog } from '../App';

interface WellnessOverviewProps {
  profile: UserProfile;
  workoutLogs: WorkoutLog[];
  mealLogs: MealLog[];
  habitLogs: HabitLog[];
  onBack: () => void;
}

export function WellnessOverview({ profile, workoutLogs, mealLogs, habitLogs, onBack }: WellnessOverviewProps) {
  const text = profile.language === 'sw' ? {
    wellness: 'Afya ya Kila Siku',
    wellnessScore: 'Alama ya Afya',
    excellent: 'Nzuri Sana',
    good: 'Nzuri',
    fair: 'Wastani',
    keepGoing: 'Endelea',
    today: 'Leo',
    thisWeek: 'Wiki Hii',
    calories: 'Kalori',
    water: 'Maji',
    sleep: 'Usingizi',
    steps: 'Hatua',
    workouts: 'Mazoezi',
    meals: 'Milo',
    target: 'Lengo',
    consumed: 'Uliyokula',
    remaining: 'Iliyobaki',
    glasses: 'vikombe',
    hours: 'masaa',
    weeklyTrend: 'Mwenendo wa Wiki',
    avgCalories: 'Wastani wa kalori za kila siku',
    avgSleep: 'Wastani wa usingizi',
    avgWater: 'Wastani wa maji',
    totalWorkouts: 'Mazoezi wiki hii',
    disclaimer: 'Data ya ustawi ni kwa ufuatiliaji wa kibinafsi tu. Wasiliana na timu yako ya utunzaji kwa maamuzi ya kimatibabu.',
  } : {
    wellness: 'Daily Wellness',
    wellnessScore: 'Wellness Score',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    keepGoing: 'Keep Going',
    today: 'Today',
    thisWeek: 'This Week',
    calories: 'Calories',
    water: 'Water',
    sleep: 'Sleep',
    steps: 'Steps',
    workouts: 'Workouts',
    meals: 'Meals',
    target: 'Target',
    consumed: 'Consumed',
    remaining: 'Remaining',
    glasses: 'glasses',
    hours: 'hours',
    weeklyTrend: 'Weekly Trend',
    avgCalories: 'Avg. daily calories',
    avgSleep: 'Avg. sleep',
    avgWater: 'Avg. water',
    totalWorkouts: 'Workouts this week',
    disclaimer: 'Wellness data is for personal tracking only. Consult your care team for medical decisions.',
  };

  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habitLogs.find(log => log.date === today) || { date: today, water: 0, sleep: 0, steps: 0, sitting: 0 };
  const todayMeals = mealLogs.filter(log => log.date.startsWith(today));
  const todayWorkouts = workoutLogs.filter(log => log.date.startsWith(today));

  // Calculate metrics
  const caloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const caloriesTarget = profile.dailyCalorieTarget || 2000;
  const caloriesRemaining = Math.max(0, caloriesTarget - caloriesConsumed);
  const caloriesPercent = Math.min((caloriesConsumed / caloriesTarget) * 100, 100);

  const waterGlasses = todayHabits.water || 0;
  const waterTarget = 8;
  const waterPercent = Math.min((waterGlasses / waterTarget) * 100, 100);

  const sleepHours = todayHabits.sleep || 0;
  const sleepTarget = 8;
  const sleepPercent = Math.min((sleepHours / sleepTarget) * 100, 100);

  const steps = todayHabits.steps || 0;
  const stepsTarget = 10000;
  const stepsPercent = Math.min((steps / stepsTarget) * 100, 100);

  // Calculate wellness score (0-100)
  const wellnessScore = Math.round(
    (waterPercent * 0.25) + 
    (sleepPercent * 0.25) + 
    (stepsPercent * 0.25) + 
    (Math.min(todayWorkouts.length * 33, 100) * 0.25)
  );

  const getScoreLabel = (score: number) => {
    if (score >= 75) return text.excellent;
    if (score >= 50) return text.good;
    if (score >= 25) return text.fair;
    return text.keepGoing;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10B981';
    if (score >= 50) return '#1EB53A';
    if (score >= 25) return '#F59E0B';
    return '#FF6B35';
  };

  // Weekly trend data (mock for now)
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekData = weekDays.map((label, i) => ({
    label,
    steps: i === 3 ? steps : Math.floor(Math.random() * 6000 + 2000),
    isToday: i === 3,
  }));

  const maxSteps = Math.max(...weekData.map(d => d.steps), 1);

  // Weekly averages
  const weeklyAvgCalories = Math.round((caloriesConsumed * 7) / 7); // Simplified
  const weeklyAvgSleep = habitLogs.length > 0 
    ? (habitLogs.reduce((sum, log) => sum + log.sleep, 0) / habitLogs.length).toFixed(1) 
    : '0';
  const weeklyAvgWater = habitLogs.length > 0 
    ? (habitLogs.reduce((sum, log) => sum + log.water, 0) / habitLogs.length).toFixed(1) 
    : '0';

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
            <div>
              <h1 className="text-2xl text-white" style={{ fontWeight: 800 }}>
                {text.wellness}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Wellness Score Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-white/60 mb-1" style={{ fontWeight: 600 }}>{text.wellnessScore}</p>
              <h2 className="text-5xl text-white mb-2" style={{ fontWeight: 800 }}>
                {wellnessScore}
                <span className="text-xl text-white/60 ml-2">/100</span>
              </h2>
              <p className="text-lg" style={{ fontWeight: 600, color: getScoreColor(wellnessScore) }}>
                {getScoreLabel(wellnessScore)}
              </p>
            </div>
            
            {/* Circular progress */}
            <div className="relative w-28 h-28">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  fill="none"
                  stroke={getScoreColor(wellnessScore)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - wellnessScore / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" strokeWidth={2.5} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Quick metrics grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Droplet, value: waterGlasses, target: waterTarget, unit: '', color: '#00A3DD', percent: waterPercent },
              { icon: Moon, value: sleepHours, target: sleepTarget, unit: 'h', color: '#8B5CF6', percent: sleepPercent },
              { icon: Footprints, value: Math.round(steps / 1000), target: Math.round(stepsTarget / 1000), unit: 'k', color: '#1EB53A', percent: stepsPercent },
              { icon: Flame, value: Math.round(caloriesConsumed / 100), target: Math.round(caloriesTarget / 100), unit: '00', color: '#FF6B35', percent: caloriesPercent },
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} strokeWidth={2.5} />
                </div>
                <div className="text-lg text-white" style={{ fontWeight: 700 }}>
                  {metric.value}{metric.unit}
                </div>
                <div className="text-xs text-white/40">
                  /{metric.target}{metric.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calorie Summary */}
        <div className="bg-gradient-to-br from-[#FF6B35]/20 to-[#E85A2A]/10 border border-[#FF6B35]/30 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/60 mb-1" style={{ fontWeight: 600 }}>{text.today}</p>
              <h3 className="text-3xl text-white" style={{ fontWeight: 800 }}>
                {caloriesConsumed}
                <span className="text-sm text-white/60 ml-2">kcal</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60 mb-1" style={{ fontWeight: 600 }}>{text.remaining}</p>
              <p className="text-2xl" style={{ fontWeight: 700, color: caloriesRemaining > 0 ? '#10B981' : '#FF6B35' }}>
                {caloriesRemaining}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-black/20 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${caloriesPercent}%`,
                background: caloriesPercent > 100 ? '#FF6B35' : 'linear-gradient(to right, #FF6B35, #E85A2A)'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/40">
            <span>{text.consumed}: {caloriesConsumed}</span>
            <span>{text.target}: {caloriesTarget}</span>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-sm text-white/60 mb-4" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {text.weeklyTrend}
          </h3>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {weekData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${Math.max((day.steps / maxSteps) * 100, 5)}%`,
                    background: day.isToday 
                      ? 'linear-gradient(to top, #1EB53A, #0F7A28)'
                      : 'rgba(255, 255, 255, 0.2)',
                  }}
                />
                <span className="text-xs text-white/60" style={{ fontWeight: day.isToday ? 700 : 400 }}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: text.avgCalories, value: weeklyAvgCalories, unit: 'kcal', color: '#FF6B35' },
            { label: text.avgSleep, value: weeklyAvgSleep, unit: text.hours, color: '#8B5CF6' },
            { label: text.avgWater, value: weeklyAvgWater, unit: text.glasses, color: '#00A3DD' },
            { label: text.totalWorkouts, value: workoutLogs.length, unit: '', color: '#1EB53A' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="rounded-2xl p-5 border"
              style={{ 
                backgroundColor: `${stat.color}15`,
                borderColor: `${stat.color}30`
              }}
            >
              <p className="text-xs mb-2" style={{ fontWeight: 600, color: stat.color }}>
                {stat.label}
              </p>
              <p className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
                {stat.value}
              </p>
              <p className="text-xs text-white/40">{stat.unit}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-white/40 text-center leading-relaxed">
            {text.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
