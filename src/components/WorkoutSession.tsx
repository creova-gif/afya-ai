import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Check, Zap } from 'lucide-react';
import { UserProfile } from '../App';

interface WorkoutSessionProps {
  workout: any;
  profile: UserProfile;
  onComplete: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onBack: () => void;
}

export function WorkoutSession({ workout, profile, onComplete, onBack }: WorkoutSessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const exercises = workout?.exercises || [
    { name: 'Jumping Jacks', duration: 30, icon: '🏃' },
    { name: 'Push-ups', duration: 30, icon: '💪' },
    { name: 'Squats', duration: 30, icon: '🦵' },
    { name: 'Plank', duration: 30, icon: '🧘' },
    { name: 'Burpees', duration: 30, icon: '🔥' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    setIsActive(false);
    setShowCompleteModal(true);
  };

  const text = profile.language === 'sw' ? {
    workout: 'Mazoezi',
    start: 'Anza',
    pause: 'Simama',
    resume: 'Endelea',
    complete: 'Kamilisha',
    next: 'Ifuatayo',
    howWasIt: 'Ilikuwaje?',
    easy: 'Rahisi',
    medium: 'Wastani',
    hard: 'Ngumu',
    exercise: 'Zoezi',
    of: 'ya',
  } : {
    workout: 'Workout',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    complete: 'Complete',
    next: 'Next',
    howWasIt: 'How was it?',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    exercise: 'Exercise',
    of: 'of',
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
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
              <h1 className="text-2xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                {text.workout}
              </h1>
              <p className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                {text.exercise} {currentExercise + 1} {text.of} {exercises.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Current Exercise */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-6">{exercises[currentExercise].icon}</div>
          <h2 className="text-4xl text-white mb-4" style={{ fontWeight: 800 }}>
            {exercises[currentExercise].name}
          </h2>
          <p className="text-xl text-white/60" style={{ fontWeight: 600 }}>
            {exercises[currentExercise].duration}s
          </p>
        </div>

        {/* Big Timer Circle */}
        <div className="relative w-80 h-80 mb-12">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="rgba(30, 181, 58, 0.2)"
              strokeWidth="20"
            />
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="#1EB53A"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 150}`}
              strokeDashoffset={`${2 * Math.PI * 150 * (1 - (seconds % 30) / 30)}`}
              className="transition-all duration-100"
            />
          </svg>

          {/* Center time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl text-white mb-2" style={{ fontWeight: 800 }}>
                {formatTime(seconds)}
              </div>
              <div className="text-lg text-white/60" style={{ fontWeight: 600 }}>
                Total Time
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-[0_10px_40px_rgba(30,181,58,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-10 h-10 text-white ml-1" strokeWidth={2.5} />
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] flex items-center justify-center shadow-[0_10px_40px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Pause className="w-10 h-10 text-white" strokeWidth={2.5} />
            </button>
          )}

          {currentExercise < exercises.length - 1 ? (
            <button
              onClick={() => setCurrentExercise(prev => prev + 1)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all active:scale-95"
              style={{ fontWeight: 700 }}
            >
              {text.next}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
              style={{ fontWeight: 700 }}
            >
              {text.complete}
            </button>
          )}
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-6 pb-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4">
          <div className="space-y-2">
            {exercises.map((ex, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  idx === currentExercise
                    ? 'bg-[#1EB53A]/20 border border-[#1EB53A]/40'
                    : idx < currentExercise
                    ? 'bg-white/5 opacity-60'
                    : 'bg-white/5'
                }`}
              >
                <div className="text-2xl">{ex.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-white" style={{ fontWeight: 600 }}>{ex.name}</div>
                  <div className="text-xs text-white/60">{ex.duration}s</div>
                </div>
                {idx < currentExercise && (
                  <Check className="w-5 h-5 text-[#1EB53A]" strokeWidth={3} />
                )}
                {idx === currentExercise && (
                  <Zap className="w-5 h-5 text-[#1EB53A] animate-pulse" strokeWidth={2.5} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-gradient-to-br from-[#1EB53A]/30 to-[#0F7A28]/20 backdrop-blur-xl border-t-2 border-[#1EB53A] rounded-t-[3rem] p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl text-white mb-3" style={{ fontWeight: 800 }}>
                Great Job!
              </h2>
              <p className="text-lg text-white/80" style={{ fontWeight: 600 }}>
                {text.howWasIt}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onComplete('easy')}
                className="w-full py-5 bg-[#00A3DD]/20 hover:bg-[#00A3DD]/30 border-2 border-[#00A3DD]/40 rounded-2xl text-white text-lg transition-all active:scale-[0.98]"
                style={{ fontWeight: 700 }}
              >
                😊 {text.easy}
              </button>
              <button
                onClick={() => onComplete('medium')}
                className="w-full py-5 bg-[#1EB53A]/20 hover:bg-[#1EB53A]/30 border-2 border-[#1EB53A]/40 rounded-2xl text-white text-lg transition-all active:scale-[0.98]"
                style={{ fontWeight: 700 }}
              >
                💪 {text.medium}
              </button>
              <button
                onClick={() => onComplete('hard')}
                className="w-full py-5 bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 border-2 border-[#FF6B35]/40 rounded-2xl text-white text-lg transition-all active:scale-[0.98]"
                style={{ fontWeight: 700 }}
              >
                🔥 {text.hard}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
