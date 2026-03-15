/**
 * Gamification Service for KUIMARISHA AI
 * Handles achievements, streaks, points, and badges
 */

export interface Achievement {
  id: string;
  name: {
    sw: string;
    en: string;
  };
  description: {
    sw: string;
    en: string;
  };
  icon: string;
  category: 'workout' | 'nutrition' | 'habits' | 'social' | 'streak';
  requirement: {
    type: 'count' | 'streak' | 'total' | 'milestone';
    value: number;
    metric?: string;
  };
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
}

export interface Badge {
  id: string;
  name: {
    sw: string;
    en: string;
  };
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  earnedAt?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivityDate: string;
}

export interface GamificationStats {
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  achievements: Achievement[];
  badges: Badge[];
  streaks: {
    workout: StreakData;
    meals: StreakData;
    water: StreakData;
  };
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Workout achievements
  {
    id: 'first-workout',
    name: { sw: 'Zoezi la Kwanza', en: 'First Workout' },
    description: { sw: 'Maliza zoezi lako la kwanza', en: 'Complete your first workout' },
    icon: '🎯',
    category: 'workout',
    requirement: { type: 'count', value: 1, metric: 'workouts' },
    points: 50,
    unlocked: false,
  },
  {
    id: 'workout-warrior',
    name: { sw: 'Shujaa wa Mazoezi', en: 'Workout Warrior' },
    description: { sw: 'Maliza mazoezi 10', en: 'Complete 10 workouts' },
    icon: '💪',
    category: 'workout',
    requirement: { type: 'count', value: 10, metric: 'workouts' },
    points: 200,
    unlocked: false,
  },
  {
    id: 'workout-master',
    name: { sw: 'Bingwa wa Mazoezi', en: 'Workout Master' },
    description: { sw: 'Maliza mazoezi 50', en: 'Complete 50 workouts' },
    icon: '🏆',
    category: 'workout',
    requirement: { type: 'count', value: 50, metric: 'workouts' },
    points: 500,
    unlocked: false,
  },
  {
    id: 'workout-legend',
    name: { sw: 'Usuli wa Mazoezi', en: 'Workout Legend' },
    description: { sw: 'Maliza mazoezi 100', en: 'Complete 100 workouts' },
    icon: '👑',
    category: 'workout',
    requirement: { type: 'count', value: 100, metric: 'workouts' },
    points: 1000,
    unlocked: false,
  },

  // Streak achievements
  {
    id: 'week-streak',
    name: { sw: 'Juma Kamili', en: 'Full Week' },
    description: { sw: 'Fanya mazoezi kwa siku 7 mfululizo', en: 'Workout for 7 days in a row' },
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 7, metric: 'workout' },
    points: 300,
    unlocked: false,
  },
  {
    id: 'month-streak',
    name: { sw: 'Mwezi Kamili', en: 'Full Month' },
    description: { sw: 'Fanya mazoezi kwa siku 30 mfululizo', en: 'Workout for 30 days in a row' },
    icon: '🌟',
    category: 'streak',
    requirement: { type: 'streak', value: 30, metric: 'workout' },
    points: 1000,
    unlocked: false,
  },
  {
    id: 'unstoppable',
    name: { sw: 'Usiosimamishwa', en: 'Unstoppable' },
    description: { sw: 'Fanya mazoezi kwa siku 100 mfululizo', en: 'Workout for 100 days in a row' },
    icon: '⚡',
    category: 'streak',
    requirement: { type: 'streak', value: 100, metric: 'workout' },
    points: 5000,
    unlocked: false,
  },

  // Nutrition achievements
  {
    id: 'meal-tracker',
    name: { sw: 'Mwandikaji wa Vyakula', en: 'Meal Tracker' },
    description: { sw: 'Andika vyakula kwa siku 7 mfululizo', en: 'Log meals for 7 days in a row' },
    icon: '📝',
    category: 'nutrition',
    requirement: { type: 'streak', value: 7, metric: 'meals' },
    points: 250,
    unlocked: false,
  },
  {
    id: 'nutrition-pro',
    name: { sw: 'Mtaalamu wa Lishe', en: 'Nutrition Pro' },
    description: { sw: 'Andika vyakula kwa siku 30 mfululizo', en: 'Log meals for 30 days in a row' },
    icon: '🥗',
    category: 'nutrition',
    requirement: { type: 'streak', value: 30, metric: 'meals' },
    points: 800,
    unlocked: false,
  },
  {
    id: 'calorie-conscious',
    name: { sw: 'Mwangalifu wa Kalori', en: 'Calorie Conscious' },
    description: { sw: 'Fikia lengo la kalori kwa siku 14 mfululizo', en: 'Hit calorie goal for 14 days in a row' },
    icon: '🎯',
    category: 'nutrition',
    requirement: { type: 'streak', value: 14, metric: 'calories' },
    points: 600,
    unlocked: false,
  },

  // Habits achievements
  {
    id: 'hydration-hero',
    name: { sw: 'Shujaa wa Maji', en: 'Hydration Hero' },
    description: { sw: 'Kunywa glasi 8 za maji kwa siku 7 mfululizo', en: 'Drink 8 glasses of water for 7 days in a row' },
    icon: '💧',
    category: 'habits',
    requirement: { type: 'streak', value: 7, metric: 'water' },
    points: 300,
    unlocked: false,
  },
  {
    id: 'sleep-champion',
    name: { sw: 'Bingwa wa Usingizi', en: 'Sleep Champion' },
    description: { sw: 'Lala masaa 7-9 kwa siku 7 mfululizo', en: 'Sleep 7-9 hours for 7 days in a row' },
    icon: '😴',
    category: 'habits',
    requirement: { type: 'streak', value: 7, metric: 'sleep' },
    points: 300,
    unlocked: false,
  },
  {
    id: 'step-master',
    name: { sw: 'Bingwa wa Hatua', en: 'Step Master' },
    description: { sw: 'Fanya hatua 10,000 kwa siku 7 mfululizo', en: 'Walk 10,000 steps for 7 days in a row' },
    icon: '👟',
    category: 'habits',
    requirement: { type: 'streak', value: 7, metric: 'steps' },
    points: 400,
    unlocked: false,
  },

  // Milestone achievements
  {
    id: 'early-bird',
    name: { sw: 'Ndege wa Asubuhi', en: 'Early Bird' },
    description: { sw: 'Fanya zoezi kabla ya saa 9 asubuhi', en: 'Complete a workout before 9 AM' },
    icon: '🌅',
    category: 'workout',
    requirement: { type: 'milestone', value: 1, metric: 'morning_workout' },
    points: 100,
    unlocked: false,
  },
  {
    id: 'consistency-king',
    name: { sw: 'Mfalme wa Uthabiti', en: 'Consistency King' },
    description: { sw: 'Fanya mazoezi wiki 4 mfululizo', en: 'Workout every week for 4 weeks' },
    icon: '👑',
    category: 'streak',
    requirement: { type: 'milestone', value: 4, metric: 'weekly_consistency' },
    points: 750,
    unlocked: false,
  },
];

// Badge definitions
export const BADGES: Badge[] = [
  { id: 'beginner', name: { sw: 'Mwanzo', en: 'Beginner' }, level: 'bronze', icon: '🥉' },
  { id: 'intermediate', name: { sw: 'Wastani', en: 'Intermediate' }, level: 'silver', icon: '🥈' },
  { id: 'advanced', name: { sw: 'Juu', en: 'Advanced' }, level: 'gold', icon: '🥇' },
  { id: 'expert', name: { sw: 'Mtaalamu', en: 'Expert' }, level: 'platinum', icon: '💎' },
  { id: 'master', name: { sw: 'Bingwa', en: 'Master' }, level: 'diamond', icon: '👑' },
];

class GamificationService {
  private stats: GamificationStats = {
    totalPoints: 0,
    level: 1,
    pointsToNextLevel: 500,
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    badges: [],
    streaks: {
      workout: { current: 0, longest: 0, lastActivityDate: '' },
      meals: { current: 0, longest: 0, lastActivityDate: '' },
      water: { current: 0, longest: 0, lastActivityDate: '' },
    },
  };

  /**
   * Load gamification stats from storage
   */
  loadStats(): GamificationStats {
    try {
      const stored = localStorage.getItem('kuimarisha_gamification');
      if (stored) {
        this.stats = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load gamification stats:', error);
    }
    return this.stats;
  }

  /**
   * Save gamification stats to storage
   */
  private saveStats(): void {
    try {
      localStorage.setItem('kuimarisha_gamification', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save gamification stats:', error);
    }
  }

  /**
   * Add points to user
   */
  addPoints(points: number): void {
    this.stats.totalPoints += points;
    
    // Check for level up
    while (this.stats.totalPoints >= this.stats.pointsToNextLevel) {
      this.levelUp();
    }
    
    this.saveStats();
  }

  /**
   * Level up user
   */
  private levelUp(): void {
    this.stats.level += 1;
    this.stats.pointsToNextLevel = this.calculateNextLevelPoints(this.stats.level);
    
    // Award badge for level milestone
    if (this.stats.level === 5) this.awardBadge('beginner');
    if (this.stats.level === 10) this.awardBadge('intermediate');
    if (this.stats.level === 20) this.awardBadge('advanced');
    if (this.stats.level === 50) this.awardBadge('expert');
    if (this.stats.level === 100) this.awardBadge('master');
  }

  /**
   * Calculate points needed for next level
   */
  private calculateNextLevelPoints(level: number): number {
    return Math.floor(500 * Math.pow(1.1, level - 1));
  }

  /**
   * Award a badge to user
   */
  private awardBadge(badgeId: string): void {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge && !this.stats.badges.find(b => b.id === badgeId)) {
      this.stats.badges.push({
        ...badge,
        earnedAt: new Date().toISOString(),
      });
    }
  }

  /**
   * Update streak for activity
   */
  updateStreak(activityType: 'workout' | 'meals' | 'water', didActivity: boolean): void {
    const today = new Date().toISOString().split('T')[0];
    const streak = this.stats.streaks[activityType];
    const lastDate = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
    const todayDate = new Date(today);

    if (didActivity) {
      if (!lastDate) {
        // First activity ever
        streak.current = 1;
        streak.longest = 1;
      } else {
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, no change
          return;
        } else if (daysDiff === 1) {
          // Consecutive day
          streak.current += 1;
          if (streak.current > streak.longest) {
            streak.longest = streak.current;
          }
        } else {
          // Streak broken
          streak.current = 1;
        }
      }
      
      streak.lastActivityDate = today;
      this.saveStats();
      
      // Check for streak achievements
      this.checkStreakAchievements(activityType, streak.current);
    }
  }

  /**
   * Check and unlock streak achievements
   */
  private checkStreakAchievements(activityType: string, streakDays: number): void {
    const relevantAchievements = this.stats.achievements.filter(
      a => !a.unlocked && 
      a.requirement.type === 'streak' && 
      a.requirement.metric === activityType &&
      streakDays >= a.requirement.value
    );

    relevantAchievements.forEach(achievement => {
      this.unlockAchievement(achievement.id);
    });
  }

  /**
   * Track activity and check achievements
   */
  trackActivity(activityType: string, count: number = 1): void {
    const relevantAchievements = this.stats.achievements.filter(
      a => !a.unlocked && 
      a.requirement.type === 'count' && 
      a.requirement.metric === activityType
    );

    relevantAchievements.forEach(achievement => {
      if (!achievement.progress) {
        achievement.progress = 0;
      }
      achievement.progress += count;

      if (achievement.progress >= achievement.requirement.value) {
        this.unlockAchievement(achievement.id);
      }
    });

    this.saveStats();
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achievementId: string): Achievement | null {
    const achievement = this.stats.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.addPoints(achievement.points);
      this.saveStats();
      return achievement;
    }
    
    return null;
  }

  /**
   * Get all achievements
   */
  getAchievements(): Achievement[] {
    return this.stats.achievements;
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return this.stats.achievements.filter(a => a.unlocked);
  }

  /**
   * Get locked achievements (in progress)
   */
  getLockedAchievements(): Achievement[] {
    return this.stats.achievements.filter(a => !a.unlocked);
  }

  /**
   * Get current stats
   */
  getStats(): GamificationStats {
    return this.stats;
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.stats.level;
  }

  /**
   * Get total points
   */
  getTotalPoints(): number {
    return this.stats.totalPoints;
  }

  /**
   * Get progress to next level
   */
  getLevelProgress(): number {
    const currentLevelPoints = this.calculateNextLevelPoints(this.stats.level - 1);
    const nextLevelPoints = this.stats.pointsToNextLevel;
    const pointsIntoLevel = this.stats.totalPoints - currentLevelPoints;
    const pointsNeeded = nextLevelPoints - currentLevelPoints;
    return Math.min(100, (pointsIntoLevel / pointsNeeded) * 100);
  }

  /**
   * Reset all stats (for testing or user request)
   */
  resetStats(): void {
    this.stats = {
      totalPoints: 0,
      level: 1,
      pointsToNextLevel: 500,
      achievements: ACHIEVEMENTS.map(a => ({ ...a })),
      badges: [],
      streaks: {
        workout: { current: 0, longest: 0, lastActivityDate: '' },
        meals: { current: 0, longest: 0, lastActivityDate: '' },
        water: { current: 0, longest: 0, lastActivityDate: '' },
      },
    };
    this.saveStats();
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();

// Export utility functions
export const trackWorkout = () => {
  gamificationService.trackActivity('workouts', 1);
  gamificationService.updateStreak('workout', true);
};

export const trackMeal = () => {
  gamificationService.trackActivity('meals', 1);
  gamificationService.updateStreak('meals', true);
};

export const trackWater = (glasses: number) => {
  if (glasses >= 8) {
    gamificationService.updateStreak('water', true);
  }
};

export const getGamificationStats = () => gamificationService.getStats();
export const loadGamificationStats = () => gamificationService.loadStats();
