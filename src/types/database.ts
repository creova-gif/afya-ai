// Database schema types aligned with backend

export interface User {
  id: string;
  phone?: string;
  email?: string;
  password_hash?: string;
  language: 'sw' | 'en';
  role: 'individual' | 'parent' | 'school' | 'teacher';
  created_at: string;
}

export interface Profile {
  user_id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  height?: number;
  weight?: number;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  environment: 'home' | 'gym' | 'family' | 'school';
  health_flags: string[];
  available_time_minutes: number;
  daily_calorie_target?: number;
}

export interface FamilyMember {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  role: 'child' | 'elder' | 'teen';
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  mode: 'home' | 'gym' | 'family' | 'school';
  type: string;
  duration: number;
  exercises: Exercise[];
  intensity: 'beginner' | 'intermediate' | 'advanced';
  safety_instructions?: string[];
  commands?: string[];
  content: string; // JSON stringified
  created_at: string;
}

export interface Exercise {
  name: string;
  reps?: string;
  duration?: number;
  rest?: number;
  description?: string;
  command?: string;
}

export interface WorkoutLog {
  id: string;
  plan_id: string;
  user_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  duration_minutes: number;
  notes?: string;
  created_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  total_calories: number;
  description: string; // JSON stringified
  created_at: string;
}

export interface MealFood {
  name: string;
  portion: string;
  calories: number;
}

export interface HabitLog {
  id: string;
  user_id: string;
  date: string;
  water_glasses: number;
  sleep_hours: number;
  steps: number;
  sitting_hours: number;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  workout?: WorkoutPlan;
  timestamp: string;
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  name: string;
  description: string;
  earned_at: string;
}
