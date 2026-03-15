// Profile Mapper - Convert between App types and Database types
import { Database } from '../types/database-supabase';
import { UserProfile } from '../App';

type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];
type DatabaseProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Convert database profile to app profile format
 */
export function mapDatabaseProfileToAppProfile(dbProfile: DatabaseProfile): UserProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name || '',
    age: dbProfile.age,
    gender: dbProfile.gender || 'other',
    language: dbProfile.language,
    location: dbProfile.location || '',
    height: dbProfile.height || 0,
    weight: Number(dbProfile.weight) || 0,
    activityLevel: mapFitnessLevelToActivityLevel(dbProfile.fitness_level),
    goals: dbProfile.goals || [],
    environment: dbProfile.environment,
    equipment: dbProfile.equipment || [],
    healthFlags: dbProfile.health_flags || [],
    availableTimeMinutes: dbProfile.available_time_minutes,
    dailyCalorieTarget: dbProfile.daily_calorie_target || undefined,
    workoutIntensity: dbProfile.fitness_level,
    isPrimary: true,
    profileType: dbProfile.profile_type || 'adult',
  };
}

/**
 * Convert app profile to database profile format
 */
export function mapAppProfileToDatabaseProfile(appProfile: Partial<UserProfile>): Partial<DatabaseProfileInsert> {
  return {
    age: appProfile.age,
    gender: appProfile.gender,
    location: appProfile.location,
    height: appProfile.height,
    weight: appProfile.weight,
    fitness_level: appProfile.workoutIntensity || 'beginner',
    goals: appProfile.goals,
    environment: appProfile.environment,
    equipment: appProfile.equipment,
    health_flags: appProfile.healthFlags,
    available_time_minutes: appProfile.availableTimeMinutes,
    daily_calorie_target: appProfile.dailyCalorieTarget,
    profile_type: appProfile.profileType,
    language: appProfile.language,
    name: appProfile.name,
  };
}

/**
 * Map fitness level to activity level for backward compatibility
 */
function mapFitnessLevelToActivityLevel(
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
): 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' {
  const mapping = {
    beginner: 'light' as const,
    intermediate: 'moderate' as const,
    advanced: 'active' as const,
  };
  return mapping[fitnessLevel] || 'moderate';
}

/**
 * Convert database workout log to app format
 */
export function mapDatabaseWorkoutToApp(dbWorkout: any): any {
  return {
    id: dbWorkout.id,
    date: dbWorkout.created_at,
    type: 'workout',
    duration: dbWorkout.duration_minutes,
    difficulty: dbWorkout.difficulty,
    completed: dbWorkout.completed,
  };
}

/**
 * Convert database meal log to app format
 */
export function mapDatabaseMealToApp(dbMeal: any): any {
  return {
    id: dbMeal.id,
    date: dbMeal.created_at,
    type: dbMeal.meal_type,
    foods: Array.isArray(dbMeal.foods) ? dbMeal.foods : [],
    totalCalories: dbMeal.total_calories,
  };
}

/**
 * Convert database habit log to app format
 */
export function mapDatabaseHabitToApp(dbHabit: any): any {
  return {
    date: dbHabit.date,
    water: dbHabit.water_glasses || 0,
    sleep: dbHabit.sleep_hours || 0,
    steps: dbHabit.steps || 0,
    sitting: dbHabit.sitting_hours || 0,
  };
}
