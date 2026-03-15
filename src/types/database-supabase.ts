// Supabase Database Types
// Auto-generated types for type-safe database queries

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          age: number
          gender: 'male' | 'female' | 'other' | null
          location: string | null
          region: string | null
          height: number | null
          weight: number | null
          fitness_level: 'beginner' | 'intermediate' | 'advanced'
          goals: string[] | null
          environment: 'home' | 'gym' | 'family' | 'school'
          health_flags: string[] | null
          equipment: string[] | null
          available_time_minutes: number
          daily_calorie_target: number | null
          profile_type: 'child' | 'teen' | 'adult' | 'elder' | null
          language: 'sw' | 'en'
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          age: number
          gender?: 'male' | 'female' | 'other' | null
          location?: string | null
          region?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          goals?: string[] | null
          environment?: 'home' | 'gym' | 'family' | 'school'
          health_flags?: string[] | null
          equipment?: string[] | null
          available_time_minutes?: number
          daily_calorie_target?: number | null
          profile_type?: 'child' | 'teen' | 'adult' | 'elder' | null
          language?: 'sw' | 'en'
          name?: string | null
        }
        Update: {
          age?: number
          gender?: 'male' | 'female' | 'other' | null
          location?: string | null
          region?: string | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          goals?: string[] | null
          environment?: 'home' | 'gym' | 'family' | 'school'
          health_flags?: string[] | null
          equipment?: string[] | null
          available_time_minutes?: number
          daily_calorie_target?: number | null
          profile_type?: 'child' | 'teen' | 'adult' | 'elder' | null
          language?: 'sw' | 'en'
          name?: string | null
        }
      }
      family_members: {
        Row: {
          id: string
          parent_id: string
          name: string
          age: number
          gender: 'male' | 'female' | 'other' | null
          role: 'child' | 'teen' | 'elder' | 'spouse' | null
          health_flags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          age: number
          gender?: 'male' | 'female' | 'other' | null
          role?: 'child' | 'teen' | 'elder' | 'spouse' | null
          health_flags?: string[] | null
        }
        Update: {
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other' | null
          role?: 'child' | 'teen' | 'elder' | 'spouse' | null
          health_flags?: string[] | null
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          mode: 'home' | 'gym' | 'family' | 'school' | null
          type: string
          duration: number
          intensity: 'beginner' | 'intermediate' | 'advanced' | null
          exercises: Json
          content: Json
          age_group: string | null
          num_participants: number | null
          generated_by: 'ai' | 'manual' | 'template'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mode?: 'home' | 'gym' | 'family' | 'school' | null
          type: string
          duration: number
          intensity?: 'beginner' | 'intermediate' | 'advanced' | null
          exercises?: Json
          content: Json
          age_group?: string | null
          num_participants?: number | null
          generated_by?: 'ai' | 'manual' | 'template'
        }
        Update: {
          mode?: 'home' | 'gym' | 'family' | 'school' | null
          type?: string
          duration?: number
          intensity?: 'beginner' | 'intermediate' | 'advanced' | null
          exercises?: Json
          content?: Json
          age_group?: string | null
          num_participants?: number | null
        }
      }
      workout_logs: {
        Row: {
          id: string
          plan_id: string | null
          user_id: string
          difficulty: 'easy' | 'medium' | 'hard'
          completed: boolean
          duration_minutes: number | null
          calories_burned: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plan_id?: string | null
          user_id: string
          difficulty: 'easy' | 'medium' | 'hard'
          completed?: boolean
          duration_minutes?: number | null
          calories_burned?: number | null
          notes?: string | null
        }
        Update: {
          difficulty?: 'easy' | 'medium' | 'hard'
          completed?: boolean
          duration_minutes?: number | null
          calories_burned?: number | null
          notes?: string | null
        }
      }
      meal_logs: {
        Row: {
          id: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods: Json
          total_calories: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods: Json
          total_calories: number
          description?: string | null
        }
        Update: {
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          foods?: Json
          total_calories?: number
          description?: string | null
        }
      }
      habit_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          water_glasses: number
          sleep_hours: number
          steps: number
          sitting_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          water_glasses?: number
          sleep_hours?: number
          steps?: number
          sitting_hours?: number
        }
        Update: {
          water_glasses?: number
          sleep_hours?: number
          steps?: number
          sitting_hours?: number
        }
      }
      user_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_workout_date: string | null
          total_workouts: number
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          total_workouts?: number
        }
        Update: {
          current_streak?: number
          longest_streak?: number
          last_workout_date?: string | null
          total_workouts?: number
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          name: string
          description: string | null
          icon: string | null
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          name: string
          description?: string | null
          icon?: string | null
        }
        Update: {
          achievement_type?: string
          name?: string
          description?: string | null
          icon?: string | null
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          messages: Json
          context: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages?: Json
          context?: Json | null
        }
        Update: {
          messages?: Json
          context?: Json | null
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string | null
          workout_plan_id: string | null
          feedback_type: 'workout_difficulty' | 'feature_request' | 'bug_report' | 'general' | null
          rating: number | null
          comment: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          workout_plan_id?: string | null
          feedback_type?: 'workout_difficulty' | 'feature_request' | 'bug_report' | 'general' | null
          rating?: number | null
          comment?: string | null
          metadata?: Json | null
        }
        Update: {
          feedback_type?: 'workout_difficulty' | 'feature_request' | 'bug_report' | 'general' | null
          rating?: number | null
          comment?: string | null
          metadata?: Json | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: Record<string, never>
      }
    }
    Views: {
      user_stats: {
        Row: {
          user_id: string
          name: string | null
          language: string
          age: number
          location: string | null
          environment: string
          current_streak: number
          total_workouts: number
          completed_workouts_count: number
          logged_meals_count: number
          achievements_count: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
