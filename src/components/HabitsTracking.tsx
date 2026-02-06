import { useState } from 'react';
import { ArrowLeft, Droplet, Moon, Footprints, Armchair, Plus, Minus, Check } from 'lucide-react';
import { UserProfile, HabitLog } from '../App';

interface HabitsTrackingProps {
  profile: UserProfile;
  todayHabits: HabitLog;
  onUpdateHabit: (habit: Partial<HabitLog>) => void;
  onBack: () => void;
}

export function HabitsTracking({ profile, todayHabits, onUpdateHabit, onBack }: HabitsTrackingProps) {
  const text = profile.language === 'sw' ? {
    habits: 'Tabia',
    water: 'Maji',
    glasses: 'Glasi',
    sleep: 'Usingizi',
    hours: 'Masaa',
    steps: 'Hatua',
    today: 'Leo',
    sitting: 'Kukaa',
    target: 'Lengo',
    progress: 'Maendeleo',
  } : {
    habits: 'Habits',
    water: 'Water',
    glasses: 'Glasses',
    sleep: 'Sleep',
    hours: 'Hours',
    steps: 'Steps',
    today: 'Today',
    sitting: 'Sitting',
    target: 'Target',
    progress: 'Progress',
  };

  const habits = [
    {
      id: 'water',
      icon: <Droplet className="w-8 h-8" strokeWidth={2.5} />,
      color: '#00A3DD',
      name: text.water,
      unit: text.glasses,
      current: todayHabits.water || 0,
      target: 8,
      gradient: 'from-[#00A3DD] to-[#0077A3]',
      bgGradient: 'from-[#00A3DD]/20 to-[#0077A3]/10',
    },
    {
      id: 'sleep',
      icon: <Moon className="w-8 h-8" strokeWidth={2.5} />,
      color: '#8B5CF6',
      name: text.sleep,
      unit: text.hours,
      current: todayHabits.sleep || 0,
      target: 8,
      gradient: 'from-[#8B5CF6] to-[#7C3AED]',
      bgGradient: 'from-[#8B5CF6]/20 to-[#7C3AED]/10',
    },
    {
      id: 'steps',
      icon: <Footprints className="w-8 h-8" strokeWidth={2.5} />,
      color: '#1EB53A',
      name: text.steps,
      unit: text.today,
      current: todayHabits.steps || 0,
      target: 10000,
      gradient: 'from-[#1EB53A] to-[#0F7A28]',
      bgGradient: 'from-[#1EB53A]/20 to-[#0F7A28]/10',
    },
    {
      id: 'sitting',
      icon: <Armchair className="w-8 h-8" strokeWidth={2.5} />,
      color: '#FF6B35',
      name: text.sitting,
      unit: text.hours,
      current: todayHabits.sitting || 0,
      target: 8,
      gradient: 'from-[#FF6B35] to-[#E85A2A]',
      bgGradient: 'from-[#FF6B35]/20 to-[#E85A2A]/10',
    },
  ];

  const handleIncrement = (id: string, current: number) => {
    onUpdateHabit({ [id]: current + (id === 'steps' ? 1000 : 1) });
  };

  const handleDecrement = (id: string, current: number) => {
    if (current > 0) {
      onUpdateHabit({ [id]: Math.max(0, current - (id === 'steps' ? 1000 : 1)) });
    }
  };

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
            <div className="flex-1">
              <h1 className="text-3xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                {text.habits}
              </h1>
              <p className="text-sm text-white/60 mt-1" style={{ fontWeight: 600 }}>
                Track your daily habits
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {habits.map((habit) => {
          const percent = Math.min((habit.current / habit.target) * 100, 100);
          const isComplete = habit.current >= habit.target;

          return (
            <div
              key={habit.id}
              className={`bg-gradient-to-br ${habit.bgGradient} backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden`}
            >
              {/* Progress background */}
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-10 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${habit.color}40 0%, transparent ${percent}%)`,
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${habit.gradient} flex items-center justify-center shadow-lg`}
                      style={{ color: 'white' }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl text-white" style={{ fontWeight: 700 }}>
                        {habit.name}
                      </h3>
                      <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                        {habit.unit}
                      </p>
                    </div>
                  </div>
                  {isComplete && (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Progress Ring */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="12"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="white"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - percent / 100)}`}
                        className="transition-all duration-500"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl text-white mb-2" style={{ fontWeight: 800 }}>
                        {habit.id === 'steps' ? habit.current.toLocaleString() : habit.current}
                      </div>
                      <div className="text-sm text-white/80" style={{ fontWeight: 600 }}>
                        of {habit.id === 'steps' ? habit.target.toLocaleString() : habit.target}
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {Math.round(percent)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleDecrement(habit.id, habit.current)}
                    disabled={habit.current === 0}
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-6 h-6 text-white" strokeWidth={3} />
                  </button>

                  <div className="flex-1 text-center">
                    <div className="text-2xl text-white" style={{ fontWeight: 700 }}>
                      {habit.id === 'steps' ? habit.current.toLocaleString() : habit.current}
                    </div>
                    <div className="text-sm text-white/60">{habit.unit}</div>
                  </div>

                  <button
                    onClick={() => handleIncrement(habit.id, habit.current)}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${habit.gradient} border border-white/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95`}
                  >
                    <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                  </button>
                </div>

                {/* Quick add buttons for steps */}
                {habit.id === 'steps' && (
                  <div className="flex items-center gap-2 mt-4">
                    {[1000, 2500, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => onUpdateHabit({ steps: habit.current + amount })}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all active:scale-95"
                        style={{ fontWeight: 600 }}
                      >
                        +{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Daily Summary */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="text-xl text-white mb-4" style={{ fontWeight: 700 }}>
            Today's Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80" style={{ fontWeight: 600 }}>Habits completed</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>
                {habits.filter(h => h.current >= h.target).length} / {habits.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80" style={{ fontWeight: 600 }}>Overall progress</span>
              <span className="text-white text-lg" style={{ fontWeight: 700 }}>
                {Math.round(habits.reduce((sum, h) => sum + Math.min((h.current / h.target) * 100, 100), 0) / habits.length)}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full transition-all duration-500"
              style={{
                width: `${habits.reduce((sum, h) => sum + Math.min((h.current / h.target) * 100, 100), 0) / habits.length}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
