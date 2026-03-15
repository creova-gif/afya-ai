import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Target, Flame, Award, Lock, Star, TrendingUp } from 'lucide-react';
import { UserProfile } from '../App';
import { 
  gamificationService, 
  Achievement, 
  Badge,
  GamificationStats 
} from '../services/gamification';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AchievementsProps {
  profile: UserProfile;
  onBack: () => void;
}

export function Achievements({ profile, onBack }: AchievementsProps) {
  const [stats, setStats] = useState<GamificationStats>(gamificationService.getStats());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load stats on mount
    const loadedStats = gamificationService.loadStats();
    setStats(loadedStats);
  }, []);

  const text = {
    sw: {
      title: 'Mafanikio',
      level: 'Kiwango',
      points: 'Pointi',
      toNextLevel: 'Hadi kiwango kijacho',
      achievements: 'Mafanikio',
      badges: 'Vibali',
      streaks: 'Mfululizo',
      unlocked: 'Imefunguliwa',
      locked: 'Imefungwa',
      progress: 'Maendeleo',
      categories: {
        all: 'Yote',
        workout: 'Mazoezi',
        nutrition: 'Lishe',
        habits: 'Tabia',
        streak: 'Mfululizo',
      },
      workoutStreak: 'Mfululizo wa Mazoezi',
      mealStreak: 'Mfululizo wa Vyakula',
      waterStreak: 'Mfululizo wa Maji',
      current: 'Sasa',
      longest: 'Ndefu zaidi',
      days: 'siku',
      noAchievements: 'Hakuna mafanikio bado',
      keepWorking: 'Endelea kufanya bidii kufikia mafanikio!',
    },
    en: {
      title: 'Achievements',
      level: 'Level',
      points: 'Points',
      toNextLevel: 'To next level',
      achievements: 'Achievements',
      badges: 'Badges',
      streaks: 'Streaks',
      unlocked: 'Unlocked',
      locked: 'Locked',
      progress: 'Progress',
      categories: {
        all: 'All',
        workout: 'Workout',
        nutrition: 'Nutrition',
        habits: 'Habits',
        streak: 'Streak',
      },
      workoutStreak: 'Workout Streak',
      mealStreak: 'Meal Streak',
      waterStreak: 'Water Streak',
      current: 'Current',
      longest: 'Longest',
      days: 'days',
      noAchievements: 'No achievements yet',
      keepWorking: 'Keep working to unlock achievements!',
    },
  };

  const t = text[profile.language || 'sw'];
  const levelProgress = gamificationService.getLevelProgress();

  const filteredAchievements = selectedCategory === 'all'
    ? stats.achievements
    : stats.achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = filteredAchievements.filter(a => a.unlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.unlocked);

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'from-purple-500 to-pink-500';
    if (level >= 20) return 'from-yellow-500 to-orange-500';
    if (level >= 10) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStreakColor = (days: number) => {
    if (days >= 100) return 'text-purple-500';
    if (days >= 30) return 'text-orange-500';
    if (days >= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white pb-20">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{t.title}</h1>
            </div>
            <Trophy className="w-8 h-8 text-[#1EB53A]" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${getLevelColor(stats.level)} p-6 rounded-3xl shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">{t.level}</p>
              <p className="text-4xl font-bold text-white">{stats.level}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-medium">{t.points}</p>
              <p className="text-2xl font-bold text-white">{stats.totalPoints.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/80">
              <span>{t.toNextLevel}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3 bg-white/20" />
          </div>
        </motion.div>

        {/* Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0A1F0F]/60 backdrop-blur-md p-6 rounded-3xl border border-[#1EB53A]/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            {t.streaks}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Workout Streak */}
            <div className="text-center p-4 bg-black/30 rounded-2xl">
              <div className={`text-3xl font-bold ${getStreakColor(stats.streaks.workout.current)}`}>
                {stats.streaks.workout.current}
              </div>
              <div className="text-xs text-white/60 mt-1">{t.workoutStreak}</div>
              <div className="text-xs text-white/40 mt-2">
                {t.longest}: {stats.streaks.workout.longest}
              </div>
            </div>

            {/* Meal Streak */}
            <div className="text-center p-4 bg-black/30 rounded-2xl">
              <div className={`text-3xl font-bold ${getStreakColor(stats.streaks.meals.current)}`}>
                {stats.streaks.meals.current}
              </div>
              <div className="text-xs text-white/60 mt-1">{t.mealStreak}</div>
              <div className="text-xs text-white/40 mt-2">
                {t.longest}: {stats.streaks.meals.longest}
              </div>
            </div>

            {/* Water Streak */}
            <div className="text-center p-4 bg-black/30 rounded-2xl">
              <div className={`text-3xl font-bold ${getStreakColor(stats.streaks.water.current)}`}>
                {stats.streaks.water.current}
              </div>
              <div className="text-xs text-white/60 mt-1">{t.waterStreak}</div>
              <div className="text-xs text-white/40 mt-2">
                {t.longest}: {stats.streaks.water.longest}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        {stats.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A1F0F]/60 backdrop-blur-md p-6 rounded-3xl border border-[#1EB53A]/20"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              {t.badges}
            </h2>
            
            <div className="flex gap-3 flex-wrap">
              {stats.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex flex-col items-center p-3 bg-black/30 rounded-2xl"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-xs text-white/80">
                    {badge.name[profile.language || 'sw']}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0A1F0F]/60 backdrop-blur-md p-6 rounded-3xl border border-[#1EB53A]/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#1EB53A]" />
            {t.achievements}
          </h2>

          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {Object.entries(t.categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? 'bg-[#1EB53A] text-white'
                    : 'bg-black/30 text-white/60 hover:bg-black/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t.unlocked} ({unlockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {unlockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#1EB53A]/20 to-transparent rounded-2xl border border-[#1EB53A]/30"
                  >
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">
                        {achievement.name[profile.language || 'sw']}
                      </h4>
                      <p className="text-sm text-white/60">
                        {achievement.description[profile.language || 'sw']}
                      </p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-[#1EB53A] mt-1">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1EB53A]">
                        +{achievement.points}
                      </div>
                      <div className="text-xs text-white/40">{t.points}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {t.locked} ({lockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {lockedAchievements.map((achievement, index) => {
                  const progress = achievement.progress || 0;
                  const target = achievement.requirement.value;
                  const percentage = Math.min(100, (progress / target) * 100);

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-black/30 rounded-2xl border border-white/10"
                    >
                      <div className="text-4xl opacity-40">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white/60">
                          {achievement.name[profile.language || 'sw']}
                        </h4>
                        <p className="text-sm text-white/40">
                          {achievement.description[profile.language || 'sw']}
                        </p>
                        {achievement.requirement.type === 'count' && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs text-white/40">
                              <span>{t.progress}</span>
                              <span>{progress} / {target}</span>
                            </div>
                            <Progress value={percentage} className="h-2 bg-white/10" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white/40">
                          +{achievement.points}
                        </div>
                        <div className="text-xs text-white/30">{t.points}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">{t.noAchievements}</p>
              <p className="text-sm text-white/30 mt-2">{t.keepWorking}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
