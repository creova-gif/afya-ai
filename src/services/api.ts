// API Service Layer - Ready for real backend integration

import { 
  User, 
  Profile, 
  FamilyMember, 
  WorkoutPlan, 
  WorkoutLog, 
  MealLog,
  HabitLog,
  ChatMessage,
  UserStreak,
  Achievement
} from '../types/database';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Generic fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const AuthAPI = {
  async register(data: {
    phone?: string;
    email?: string;
    password: string;
    language: 'sw' | 'en';
  }): Promise<{ user: User; token: string }> {
    // Mock implementation - replace with real API
    const mockUser: User = {
      id: Date.now().toString(),
      phone: data.phone,
      email: data.email,
      language: data.language,
      role: 'individual',
      created_at: new Date().toISOString(),
    };
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('auth_token', token);
    return { user: mockUser, token };
  },

  async login(data: {
    phone?: string;
    email?: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    // Mock implementation
    return this.register({ ...data, language: 'sw' });
  },

  logout() {
    localStorage.removeItem('auth_token');
  },
};

// Profile API
export const ProfileAPI = {
  async getProfile(userId: string): Promise<Profile> {
    // Mock - replace with: return apiRequest<Profile>(`/profile/${userId}`);
    return JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}');
  },

  async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    // Mock - replace with real API
    const profile = { ...data, user_id: userId } as Profile;
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    return profile;
  },
};

// AI Coach API
export const AICoachAPI = {
  async chat(data: {
    user_id: string;
    message: string;
    context: {
      age: number;
      language: 'sw' | 'en';
      environment: string;
      health_flags: string[];
      goals: string[];
      location: string;
    };
  }): Promise<{ response: string; workout?: WorkoutPlan }> {
    // This will call real LLM API in production
    // For now, using local logic from AICoach component
    return { response: 'Mock AI response' };
  },

  async generateWorkout(data: {
    user_id: string;
    age: number;
    environment: 'home' | 'gym' | 'family' | 'school';
    duration: number;
    intensity: 'beginner' | 'intermediate' | 'advanced';
    health_flags: string[];
    language: 'sw' | 'en';
  }): Promise<WorkoutPlan> {
    // Mock - replace with real AI endpoint
    const mockPlan: WorkoutPlan = {
      id: Date.now().toString(),
      user_id: data.user_id,
      mode: data.environment,
      type: 'AI Generated Workout',
      duration: data.duration,
      exercises: [],
      intensity: data.intensity,
      content: JSON.stringify({}),
      created_at: new Date().toISOString(),
    };
    return mockPlan;
  },

  async submitFeedback(data: {
    user_id: string;
    plan_id: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }): Promise<{ adjusted_intensity: string; message: string }> {
    // This adjusts AI for next workout
    const adjustments = {
      easy: { adjusted_intensity: 'intermediate', message: 'Tutaongeza nguvu kidogo' },
      medium: { adjusted_intensity: 'intermediate', message: 'Kiwango sahihi!' },
      hard: { adjusted_intensity: 'beginner', message: 'Tutapunguza kidogo' },
    };
    return adjustments[data.difficulty];
  },
};

// Workout API
export const WorkoutAPI = {
  async getTodayWorkout(userId: string): Promise<WorkoutPlan | null> {
    // Mock - replace with real API
    const plans = JSON.parse(localStorage.getItem(`workout_plans_${userId}`) || '[]');
    return plans[0] || null;
  },

  async logWorkout(data: {
    user_id: string;
    plan_id: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    duration_minutes: number;
  }): Promise<WorkoutLog> {
    const log: WorkoutLog = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    
    // Save to localStorage (mock)
    const logs = JSON.parse(localStorage.getItem(`workout_logs_${data.user_id}`) || '[]');
    logs.push(log);
    localStorage.setItem(`workout_logs_${data.user_id}`, JSON.stringify(logs));
    
    // Update streak
    await this.updateStreak(data.user_id);
    
    return log;
  },

  async getWorkoutHistory(userId: string, limit = 30): Promise<WorkoutLog[]> {
    const logs = JSON.parse(localStorage.getItem(`workout_logs_${userId}`) || '[]');
    return logs.slice(0, limit);
  },

  async updateStreak(userId: string): Promise<UserStreak> {
    const logs = await this.getWorkoutHistory(userId);
    const today = new Date().toISOString().split('T')[0];
    const completedLogs = logs.filter(log => log.completed);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let checkDate = new Date();
    
    // Calculate current streak
    for (let i = 0; i < completedLogs.length; i++) {
      const logDate = new Date(completedLogs[i].created_at).toISOString().split('T')[0];
      const expectedDate = checkDate.toISOString().split('T')[0];
      
      if (logDate === expectedDate) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    longestStreak = Math.max(currentStreak, longestStreak);
    
    const streak: UserStreak = {
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_workout_date: today,
    };
    
    localStorage.setItem(`streak_${userId}`, JSON.stringify(streak));
    return streak;
  },

  async getStreak(userId: string): Promise<UserStreak> {
    const streak = localStorage.getItem(`streak_${userId}`);
    return streak ? JSON.parse(streak) : {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_workout_date: '',
    };
  },
};

// Meal API
export const MealAPI = {
  async getRecommendations(data: {
    user_id: string;
    location: string;
    language: 'sw' | 'en';
    calorie_target?: number;
  }): Promise<{ breakfast: string[]; lunch: string[]; dinner: string[] }> {
    // This would call AI for personalized meal suggestions
    const regionalMeals: Record<string, any> = {
      'Dar es Salaam': {
        breakfast: ['Uji wa mtama', 'Chai na mkate', 'Ndizi na karanga'],
        lunch: ['Wali na maharage', 'Ugali na dagaa', 'Pilau'],
        dinner: ['Ugali na mboga', 'Wali na samaki', 'Chipsi mayai'],
      },
    };
    return regionalMeals[data.location] || regionalMeals['Dar es Salaam'];
  },

  async logMeal(data: {
    user_id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: { name: string; portion: string; calories: number }[];
  }): Promise<MealLog> {
    const total_calories = data.foods.reduce((sum, food) => sum + food.calories, 0);
    
    const log: MealLog = {
      id: Date.now().toString(),
      user_id: data.user_id,
      meal_type: data.meal_type,
      foods: data.foods,
      total_calories,
      description: JSON.stringify(data.foods),
      created_at: new Date().toISOString(),
    };
    
    const logs = JSON.parse(localStorage.getItem(`meal_logs_${data.user_id}`) || '[]');
    logs.push(log);
    localStorage.setItem(`meal_logs_${data.user_id}`, JSON.stringify(logs));
    
    return log;
  },

  async getMealHistory(userId: string, days = 7): Promise<MealLog[]> {
    const logs = JSON.parse(localStorage.getItem(`meal_logs_${userId}`) || '[]');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return logs.filter((log: MealLog) => 
      new Date(log.created_at) >= cutoffDate
    );
  },
};

// Habit API
export const HabitAPI = {
  async logHabit(data: {
    user_id: string;
    date: string;
    water_glasses?: number;
    sleep_hours?: number;
    steps?: number;
    sitting_hours?: number;
  }): Promise<HabitLog> {
    const existing = await this.getHabitByDate(data.user_id, data.date);
    
    const log: HabitLog = {
      id: existing?.id || Date.now().toString(),
      user_id: data.user_id,
      date: data.date,
      water_glasses: data.water_glasses ?? existing?.water_glasses ?? 0,
      sleep_hours: data.sleep_hours ?? existing?.sleep_hours ?? 0,
      steps: data.steps ?? existing?.steps ?? 0,
      sitting_hours: data.sitting_hours ?? existing?.sitting_hours ?? 0,
      created_at: existing?.created_at || new Date().toISOString(),
    };
    
    const logs = JSON.parse(localStorage.getItem(`habit_logs_${data.user_id}`) || '[]');
    const index = logs.findIndex((l: HabitLog) => l.date === data.date);
    
    if (index >= 0) {
      logs[index] = log;
    } else {
      logs.push(log);
    }
    
    localStorage.setItem(`habit_logs_${data.user_id}`, JSON.stringify(logs));
    return log;
  },

  async getHabitByDate(userId: string, date: string): Promise<HabitLog | null> {
    const logs = JSON.parse(localStorage.getItem(`habit_logs_${userId}`) || '[]');
    return logs.find((log: HabitLog) => log.date === date) || null;
  },

  async getHabitHistory(userId: string, days = 30): Promise<HabitLog[]> {
    const logs = JSON.parse(localStorage.getItem(`habit_logs_${userId}`) || '[]');
    return logs.slice(0, days);
  },
};

// Family API
export const FamilyAPI = {
  async addFamilyMember(data: {
    parent_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    role: 'child' | 'elder' | 'teen';
  }): Promise<FamilyMember> {
    const member: FamilyMember = {
      id: Date.now().toString(),
      parent_id: data.parent_id,
      name: data.name,
      age: data.age,
      gender: data.gender,
      role: data.role,
      created_at: new Date().toISOString(),
    };
    
    const members = JSON.parse(localStorage.getItem(`family_${data.parent_id}`) || '[]');
    members.push(member);
    localStorage.setItem(`family_${data.parent_id}`, JSON.stringify(members));
    
    return member;
  },

  async getFamilyMembers(parentId: string): Promise<FamilyMember[]> {
    return JSON.parse(localStorage.getItem(`family_${parentId}`) || '[]');
  },
};

// Achievement API
export const AchievementAPI = {
  async checkAndAwardAchievements(userId: string): Promise<Achievement[]> {
    const logs = await WorkoutAPI.getWorkoutHistory(userId);
    const streak = await WorkoutAPI.getStreak(userId);
    
    const newAchievements: Achievement[] = [];
    const existing = JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]');
    const existingTypes = existing.map((a: Achievement) => a.achievement_type);
    
    // First workout
    if (logs.length >= 1 && !existingTypes.includes('first_workout')) {
      newAchievements.push({
        id: Date.now().toString(),
        user_id: userId,
        achievement_type: 'first_workout',
        name: 'Mwanzo',
        description: 'Kamilisha mazoezi ya kwanza',
        earned_at: new Date().toISOString(),
      });
    }
    
    // 3-day streak
    if (streak.current_streak >= 3 && !existingTypes.includes('streak_3')) {
      newAchievements.push({
        id: (Date.now() + 1).toString(),
        user_id: userId,
        achievement_type: 'streak_3',
        name: 'Mfululizo wa Siku 3',
        description: 'Zoeza kwa siku 3 mfululizo',
        earned_at: new Date().toISOString(),
      });
    }
    
    // 10 workouts
    if (logs.filter(l => l.completed).length >= 10 && !existingTypes.includes('workouts_10')) {
      newAchievements.push({
        id: (Date.now() + 2).toString(),
        user_id: userId,
        achievement_type: 'workouts_10',
        name: 'Mwanzo Mzuri',
        description: 'Kamilisha mazoezi 10',
        earned_at: new Date().toISOString(),
      });
    }
    
    if (newAchievements.length > 0) {
      const allAchievements = [...existing, ...newAchievements];
      localStorage.setItem(`achievements_${userId}`, JSON.stringify(allAchievements));
    }
    
    return newAchievements;
  },

  async getAchievements(userId: string): Promise<Achievement[]> {
    return JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]');
  },
};

export default {
  Auth: AuthAPI,
  Profile: ProfileAPI,
  AICoach: AICoachAPI,
  Workout: WorkoutAPI,
  Meal: MealAPI,
  Habit: HabitAPI,
  Family: FamilyAPI,
  Achievement: AchievementAPI,
};
