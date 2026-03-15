// ✅ PRODUCTION API SERVICE - Real Supabase Integration
// Replaces all mock localStorage calls with real database operations

import { supabase, getCurrentUser } from '../utils/supabase/client';
import type { Database } from '../types/database-supabase';

// Type aliases for easier usage
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type FamilyMember = Database['public']['Tables']['family_members']['Row'];
type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert'];

type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row'];
type WorkoutPlanInsert = Database['public']['Tables']['workout_plans']['Insert'];

type WorkoutLog = Database['public']['Tables']['workout_logs']['Row'];
type WorkoutLogInsert = Database['public']['Tables']['workout_logs']['Insert'];

type MealLog = Database['public']['Tables']['meal_logs']['Row'];
type MealLogInsert = Database['public']['Tables']['meal_logs']['Insert'];

type HabitLog = Database['public']['Tables']['habit_logs']['Row'];
type HabitLogInsert = Database['public']['Tables']['habit_logs']['Insert'];
type HabitLogUpdate = Database['public']['Tables']['habit_logs']['Update'];

type UserStreak = Database['public']['Tables']['user_streaks']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];

// ======================
// AUDIT LOGGING HELPER
// ======================

async function logAudit(action: string, entityType?: string, entityId?: string, metadata?: any) {
  try {
    const user = await getCurrentUser();
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

// ======================
// AUTH API - Real Supabase Auth
// ======================

export const AuthAPI = {
  /**
   * Register new user with email/phone
   * ✅ PRODUCTION READY - Uses Supabase Auth
   */
  async register(data: {
    email?: string;
    phone?: string;
    password: string;
    language: 'sw' | 'en';
    name?: string;
  }): Promise<{ user: any; session: any }> {
    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      phone: data.phone,
      password: data.password,
      options: {
        data: {
          language: data.language,
          name: data.name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Log audit
    await logAudit('user_registered', 'user', authData.user.id);

    return {
      user: authData.user,
      session: authData.session,
    };
  },

  /**
   * Login with email/phone and password
   * ✅ PRODUCTION READY - Uses Supabase Auth
   */
  async login(data: {
    email?: string;
    phone?: string;
    password: string;
  }): Promise<{ user: any; session: any }> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      phone: data.phone,
      password: data.password,
    });

    if (error) throw error;
    if (!authData.session) throw new Error('Login failed');

    // Log audit
    await logAudit('user_login', 'user', authData.user.id);

    return {
      user: authData.user,
      session: authData.session,
    };
  },

  /**
   * Logout current user
   * ✅ PRODUCTION READY
   */
  async logout() {
    const user = await getCurrentUser();
    await logAudit('user_logout', 'user', user?.id);
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   * ✅ PRODUCTION READY
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};

// ======================
// PROFILE API - Real Database
// ======================

export const ProfileAPI = {
  /**
   * Get user profile
   * ✅ PRODUCTION READY - Real Supabase query with RLS
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  /**
   * Create or update user profile
   * ✅ PRODUCTION READY - Upsert to database
   */
  async upsertProfile(userId: string, profileData: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('profile_updated', 'profile', userId);
    return data;
  },

  /**
   * Update profile fields
   * ✅ PRODUCTION READY
   */
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    await logAudit('profile_updated', 'profile', userId, { fields: Object.keys(updates) });
    return data;
  },
};

// ======================
// WORKOUT API - Real Database
// ======================

export const WorkoutAPI = {
  /**
   * Get today's workout plan
   * ✅ PRODUCTION READY
   */
  async getTodayWorkout(userId: string): Promise<WorkoutPlan | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Log completed workout
   * ✅ PRODUCTION READY - Triggers automatic streak update
   */
  async logWorkout(logData: {
    user_id: string;
    plan_id?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    duration_minutes: number;
  }): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        user_id: logData.user_id,
        plan_id: logData.plan_id,
        difficulty: logData.difficulty,
        completed: logData.completed,
        duration_minutes: logData.duration_minutes,
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('workout_completed', 'workout_log', data.id, {
      difficulty: logData.difficulty,
      duration: logData.duration_minutes,
    });

    // Streak is automatically updated by database trigger
    return data;
  },

  /**
   * Get workout history
   * ✅ PRODUCTION READY
   */
  async getWorkoutHistory(userId: string, limit = 30): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get user streak
   * ✅ PRODUCTION READY
   */
  async getStreak(userId: string): Promise<UserStreak | null> {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Save workout plan
   * ✅ PRODUCTION READY
   */
  async saveWorkoutPlan(planData: WorkoutPlanInsert): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert(planData)
      .select()
      .single();

    if (error) throw error;

    await logAudit('workout_plan_created', 'workout_plan', data.id);
    return data;
  },
};

// ======================
// MEAL API - Real Database
// ======================

export const MealAPI = {
  /**
   * Log meal
   * ✅ PRODUCTION READY
   */
  async logMeal(mealData: {
    user_id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: { name: string; portion: string; calories: number }[];
  }): Promise<MealLog> {
    const total_calories = mealData.foods.reduce((sum, food) => sum + food.calories, 0);

    const { data, error } = await supabase
      .from('meal_logs')
      .insert({
        user_id: mealData.user_id,
        meal_type: mealData.meal_type,
        foods: mealData.foods,
        total_calories,
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('meal_logged', 'meal_log', data.id, {
      meal_type: mealData.meal_type,
      calories: total_calories,
    });

    return data;
  },

  /**
   * Get meal history
   * ✅ PRODUCTION READY
   */
  async getMealHistory(userId: string, days = 7): Promise<MealLog[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', cutoffDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get today's meals
   * ✅ PRODUCTION READY
   */
  async getTodayMeals(userId: string): Promise<MealLog[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// ======================
// HABIT API - Real Database
// ======================

export const HabitAPI = {
  /**
   * Log or update daily habits
   * ✅ PRODUCTION READY - Upserts for idempotency
   */
  async logHabit(habitData: {
    user_id: string;
    date: string;
    water_glasses?: number;
    sleep_hours?: number;
    steps?: number;
    sitting_hours?: number;
  }): Promise<HabitLog> {
    const { data, error } = await supabase
      .from('habit_logs')
      .upsert({
        user_id: habitData.user_id,
        date: habitData.date,
        water_glasses: habitData.water_glasses ?? 0,
        sleep_hours: habitData.sleep_hours ?? 0,
        steps: habitData.steps ?? 0,
        sitting_hours: habitData.sitting_hours ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    await logAudit('habit_updated', 'habit_log', data.id, { date: habitData.date });
    return data;
  },

  /**
   * Get habit by date
   * ✅ PRODUCTION READY
   */
  async getHabitByDate(userId: string, date: string): Promise<HabitLog | null> {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Get habit history
   * ✅ PRODUCTION READY
   */
  async getHabitHistory(userId: string, days = 30): Promise<HabitLog[]> {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(days);

    if (error) throw error;
    return data || [];
  },
};

// ======================
// FAMILY API - Real Database
// ======================

export const FamilyAPI = {
  /**
   * Add family member
   * ✅ PRODUCTION READY
   */
  async addFamilyMember(memberData: {
    parent_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    role: 'child' | 'teen' | 'elder' | 'spouse';
  }): Promise<FamilyMember> {
    const { data, error } = await supabase
      .from('family_members')
      .insert(memberData)
      .select()
      .single();

    if (error) throw error;

    await logAudit('family_member_added', 'family_member', data.id);
    return data;
  },

  /**
   * Get family members
   * ✅ PRODUCTION READY
   */
  async getFamilyMembers(parentId: string): Promise<FamilyMember[]> {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Remove family member
   * ✅ PRODUCTION READY
   */
  async removeFamilyMember(memberId: string): Promise<void> {
    await logAudit('family_member_removed', 'family_member', memberId);

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  },
};

// ======================
// ACHIEVEMENT API - Real Database
// ======================

export const AchievementAPI = {
  /**
   * Check and award new achievements
   * ✅ PRODUCTION READY
   */
  async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    // Get user stats
    const workoutLogs = await WorkoutAPI.getWorkoutHistory(userId);
    const streak = await WorkoutAPI.getStreak(userId);
    const existing = await this.getAchievements(userId);
    
    const existingTypes = existing.map((a) => a.achievement_type);
    const newAchievements: any[] = [];

    // First workout
    if (workoutLogs.length >= 1 && !existingTypes.includes('first_workout')) {
      newAchievements.push({
        user_id: userId,
        achievement_type: 'first_workout',
        name: 'Mwanzo',
        description: 'Kamilisha mazoezi ya kwanza',
        icon: '🎯',
      });
    }

    // 3-day streak
    if (streak && streak.current_streak >= 3 && !existingTypes.includes('streak_3')) {
      newAchievements.push({
        user_id: userId,
        achievement_type: 'streak_3',
        name: 'Mfululizo wa Siku 3',
        description: 'Zoeza kwa siku 3 mfululizo',
        icon: '🔥',
      });
    }

    // 7-day streak
    if (streak && streak.current_streak >= 7 && !existingTypes.includes('streak_7')) {
      newAchievements.push({
        user_id: userId,
        achievement_type: 'streak_7',
        name: 'Wiki Kamili',
        description: 'Zoeza kwa wiki mzima',
        icon: '⭐',
      });
    }

    // 10 workouts
    const completedCount = workoutLogs.filter((l) => l.completed).length;
    if (completedCount >= 10 && !existingTypes.includes('workouts_10')) {
      newAchievements.push({
        user_id: userId,
        achievement_type: 'workouts_10',
        name: 'Mwanzo Mzuri',
        description: 'Kamilisha mazoezi 10',
        icon: '💪',
      });
    }

    // Insert new achievements
    if (newAchievements.length > 0) {
      const { data, error } = await supabase
        .from('achievements')
        .insert(newAchievements)
        .select();

      if (error) throw error;

      // Log each achievement
      for (const achievement of data) {
        await logAudit('achievement_earned', 'achievement', achievement.id, {
          type: achievement.achievement_type,
        });
      }

      return data || [];
    }

    return [];
  },

  /**
   * Get user achievements
   * ✅ PRODUCTION READY
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// ======================
// Export all APIs
// ======================

export default {
  Auth: AuthAPI,
  Profile: ProfileAPI,
  Workout: WorkoutAPI,
  Meal: MealAPI,
  Habit: HabitAPI,
  Family: FamilyAPI,
  Achievement: AchievementAPI,
};
