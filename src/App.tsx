import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { WorkoutSession } from './components/WorkoutSession';
import { FoodTracking } from './components/FoodTracking';
import { AICoach } from './components/AICoach';
import { FamilyProfiles } from './components/FamilyProfiles';
import { HabitsTracking } from './components/HabitsTracking';
import { Progress } from './components/Progress';
import { SchoolMode } from './components/SchoolMode';
import { Settings } from './components/Settings';
import { WellnessOverview } from './components/WellnessOverview';
import { Achievements } from './components/Achievements';
import { Subscription } from './components/Subscription';
import { Social } from './components/Social';
import { FormCheck } from './components/FormCheck';
import { ProgressPhotos } from './components/ProgressPhotos';
import { MealPlanner } from './components/MealPlanner';
import { Analytics } from './components/Analytics';
import * as API from './services/api';
import AIService from './services/ai-service';
import { WorkoutContext } from './services/ai-prompts';
import { trackWorkout, trackMeal, trackWater, loadGamificationStats } from './services/gamification';
import { notificationService, setupNotifications } from './services/notifications';
import { offlineSyncService, queueWorkout, queueMeal, queueHabit } from './services/offline-sync';
import { subscriptionService } from './services/subscription';
import { toast } from 'sonner@2.0.3';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  language: 'sw' | 'en';
  location: string;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  environment: 'home' | 'gym' | 'school';
  equipment: string[];
  healthFlags: string[];
  availableTimeMinutes: number;
  dailyCalorieTarget?: number;
  workoutIntensity?: 'beginner' | 'intermediate' | 'advanced';
  isPrimary?: boolean;
  profileType: 'parent' | 'child' | 'elder' | 'teen' | 'adult';
  email?: string;
  password?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

export interface MealLog {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: { name: string; portion: string; calories: number }[];
  totalCalories: number;
}

export interface HabitLog {
  date: string;
  water: number; // glasses
  sleep: number; // hours
  steps: number;
  sitting: number; // hours
}

export type Screen = 
  | 'home' 
  | 'login'
  | 'onboarding' 
  | 'dashboard' 
  | 'workout' 
  | 'food' 
  | 'coach' 
  | 'family' 
  | 'habits' 
  | 'progress' 
  | 'school'
  | 'settings'
  | 'wellness'
  | 'achievements'
  | 'subscription'
  | 'social'
  | 'formcheck'
  | 'progressphotos'
  | 'mealplanner'
  | 'analytics';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize gamification and notifications
  useEffect(() => {
    loadGamificationStats();
    
    // Request notification permission and setup schedule
    if (currentProfile) {
      notificationService.requestPermission().then(granted => {
        if (granted) {
          setupNotifications(currentProfile.language);
        }
      });
    }
  }, [currentProfile]);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        // Running in demo mode - this is normal!
        setIsLoading(false);
        return;
      }

      const session = await API.Auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await loadUserData(session.user.id);
        setHasCompletedOnboarding(true);
        setCurrentScreen('dashboard');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUserData(userId: string) {
    try {
      // Load profile
      const dbProfile = await API.Profile.getProfile(userId);
      if (dbProfile) {
        setCurrentProfile(mapDatabaseProfileToAppProfile(dbProfile));
      }

      // Load workout logs
      const dbWorkouts = await API.Workout.getWorkoutLogs(userId, 30);
      setWorkoutLogs(dbWorkouts.map(mapDatabaseWorkoutToApp));

      // Load meal logs
      const dbMeals = await API.Meal.getMealLogs(userId, 30);
      setMealLogs(dbMeals.map(mapDatabaseMealToApp));

      // Load habit logs
      const dbHabits = await API.Habit.getHabitLogs(userId, 30);
      setHabitLogs(dbHabits.map(mapDatabaseHabitToApp));

      // Load family members
      const dbFamily = await API.Family.getFamilyMembers(userId);
      const familyProfiles = dbFamily.map((member: any) => ({
        id: member.id,
        name: member.name,
        age: member.age,
        gender: member.gender || 'other',
        language: member.language || 'sw',
        location: '',
        height: 0,
        weight: 0,
        activityLevel: 'moderate' as const,
        goals: [],
        environment: 'home' as const,
        equipment: [],
        healthFlags: [],
        availableTimeMinutes: 30,
        isPrimary: false,
        profileType: member.relationship as any,
      }));
      setAllProfiles(familyProfiles);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setError(null);
    
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

    // DEMO MODE - No Supabase
    if (!isSupabaseConfigured) {
      // App works perfectly in demo mode - no warnings needed
      setCurrentProfile({
        ...profile,
        id: 'demo-user-' + Date.now(),
      });
      setHasCompletedOnboarding(true);
      
      // Initialize today's habit log
      const today = new Date().toISOString().split('T')[0];
      setHabitLogs([{ date: today, water: 0, sleep: 0, steps: 0, sitting: 0 }]);
      
      setCurrentScreen('dashboard');
      return;
    }

    // PRODUCTION MODE - With Supabase
    try {
      // Validate required fields
      if (!profile.email || !profile.password) {
        setError('Email and password are required');
        alert('Email and password are required');
        return;
      }

      // Register user with Supabase
      const { user, session } = await API.Auth.register({
        email: profile.email,
        password: profile.password,
        language: profile.language,
      });

      if (!user) {
        throw new Error('Registration failed - no user returned');
      }

      setUserId(user.id);

      // Create profile in database
      await API.Profile.upsertProfile(user.id, {
        age: profile.age,
        gender: profile.gender,
        location: profile.location,
        height: profile.height,
        weight: profile.weight,
        fitness_level: profile.workoutIntensity || 'beginner',
        goals: profile.goals,
        environment: profile.environment,
        equipment: profile.equipment,
        health_flags: profile.healthFlags,
        available_time_minutes: profile.availableTimeMinutes,
        daily_calorie_target: profile.dailyCalorieTarget,
        language: profile.language,
        name: profile.name,
      });

      // Load profile from database
      const dbProfile = await API.Profile.getProfile(user.id);
      if (dbProfile) {
        setCurrentProfile(mapDatabaseProfileToAppProfile(dbProfile));
      }

      setHasCompletedOnboarding(true);
      
      // Initialize today's habit log
      const today = new Date().toISOString().split('T')[0];
      setHabitLogs([{ date: today, water: 0, sleep: 0, steps: 0, sitting: 0 }]);
      
      setCurrentScreen('dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setError(null);

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (!isSupabaseConfigured) {
      // Demo mode - just create a demo user
      setCurrentProfile({
        id: 'demo-user-' + Date.now(),
        name: 'Demo User',
        age: 30,
        gender: 'male',
        language: 'sw',
        location: 'Dar es Salaam',
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        goals: ['fitness'],
        environment: 'home',
        equipment: [],
        healthFlags: [],
        availableTimeMinutes: 30,
        profileType: 'adult',
      });
      setHasCompletedOnboarding(true);
      setCurrentScreen('dashboard');
      return;
    }

    try {
      const { user, session } = await API.Auth.login({ email, password });
      
      if (!user) {
        throw new Error('Login failed - no user returned');
      }

      setUserId(user.id);
      await loadUserData(user.id);
      setHasCompletedOnboarding(true);
      setCurrentScreen('dashboard');
    } catch (err) {
      console.error('Login error:', err);
      throw err; // Re-throw for Login component to handle
    }
  };

  const handleLogout = async () => {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (isSupabaseConfigured) {
        await API.Auth.logout();
      }

      // Clear all state
      setUserId(null);
      setCurrentProfile(null);
      setAllProfiles([]);
      setWorkoutLogs([]);
      setMealLogs([]);
      setHabitLogs([]);
      setCurrentWorkout(null);
      setHasCompletedOnboarding(false);
      setCurrentScreen('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAddProfile = (profile: UserProfile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      isPrimary: false,
    };
    setAllProfiles([...allProfiles, newProfile]);
  };

  const handleSwitchProfile = (profileId: string) => {
    const profile = allProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      setCurrentScreen('dashboard');
    }
  };

  const handleStartWorkout = (workout: any) => {
    setCurrentWorkout(workout);
    setCurrentScreen('workout');
  };

  const handleCompleteWorkout = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (currentWorkout && currentProfile) {
      const log: WorkoutLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: currentWorkout.type,
        duration: currentWorkout.duration,
        difficulty,
        completed: true,
      };
      
      // Update local state immediately
      setWorkoutLogs([...workoutLogs, log]);
      setCurrentWorkout(null);
      setCurrentScreen('dashboard');

      // Track gamification
      trackWorkout();

      // Persist to database if user is logged in
      if (userId) {
        try {
          await API.Workout.logWorkout(userId, {
            workout_type: currentWorkout.type,
            duration_minutes: currentWorkout.duration,
            difficulty,
            completed: true,
            date: new Date().toISOString().split('T')[0],
          });
          console.log('Workout logged to database successfully');
        } catch (err) {
          console.error('Failed to log workout to database:', err);
          // Non-critical error - user can continue
        }
      }
    }
  };

  const handleAddMeal = async (meal: MealLog) => {
    // Update local state immediately
    setMealLogs([...mealLogs, meal]);

    // Track gamification
    trackMeal();

    // Persist to database if user is logged in
    if (userId) {
      try {
        await API.Meal.logMeal(userId, {
          meal_type: meal.type,
          foods: meal.foods,
          total_calories: meal.totalCalories,
          date: meal.date.split('T')[0],
        });
        console.log('Meal logged to database successfully');
      } catch (err) {
        console.error('Failed to log meal to database:', err);
        // Non-critical error - user can continue
      }
    }
  };

  const handleUpdateHabit = async (habit: Partial<HabitLog>) => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = habitLogs.findIndex(log => log.date === today);
    
    let updatedHabit: HabitLog;
    
    if (existingIndex >= 0) {
      const updated = [...habitLogs];
      updated[existingIndex] = { ...updated[existingIndex], ...habit };
      setHabitLogs(updated);
      updatedHabit = updated[existingIndex];
    } else {
      const newHabit = { date: today, water: 0, sleep: 0, steps: 0, sitting: 0, ...habit };
      setHabitLogs([...habitLogs, newHabit]);
      updatedHabit = newHabit;
    }

    // Track gamification
    if (updatedHabit.water) {
      trackWater(updatedHabit.water);
    }

    // Persist to database if user is logged in
    if (userId) {
      try {
        await API.Habit.logHabit(userId, {
          water_glasses: updatedHabit.water,
          sleep_hours: updatedHabit.sleep,
          steps: updatedHabit.steps,
          sitting_hours: updatedHabit.sitting,
          date: today,
        });
        console.log('Habit logged to database successfully');
      } catch (err) {
        console.error('Failed to log habit to database:', err);
        // Non-critical error - user can continue
      }
    }
  };

  const getTodayHabits = (): HabitLog => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs.find(log => log.date === today) || { date: today, water: 0, sleep: 0, steps: 0, sitting: 0 };
  };

  const getTodayMeals = (): MealLog[] => {
    const today = new Date().toISOString().split('T')[0];
    return mealLogs.filter(log => log.date.startsWith(today));
  };

  const getTodayWorkouts = (): WorkoutLog[] => {
    const today = new Date().toISOString().split('T')[0];
    return workoutLogs.filter(log => log.date.startsWith(today));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-3xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl text-white" style={{ fontWeight: 700 }}>Loading Kuimarisha...</p>
          <p className="text-sm text-white/60 mt-2" style={{ fontWeight: 500 }}>Inakagua akaunti yako</p>
        </div>
      </div>
    );
  }

  // Show home or onboarding if not completed
  if (!hasCompletedOnboarding) {
    if (currentScreen === 'home') {
      return <Home onGetStarted={() => setCurrentScreen('onboarding')} onSignIn={() => setCurrentScreen('login')} />;
    }
    if (currentScreen === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onBack={() => setCurrentScreen('home')}
          onSignUp={() => setCurrentScreen('onboarding')}
          language={currentProfile?.language || 'sw'}
        />
      );
    }
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main app navigation
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {currentScreen === 'dashboard' && currentProfile && (
        <Dashboard
          profile={currentProfile}
          onNavigate={setCurrentScreen}
          todayWorkouts={getTodayWorkouts()}
          todayMeals={getTodayMeals()}
          todayHabits={getTodayHabits()}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {currentScreen === 'workout' && currentWorkout && currentProfile && (
        <WorkoutSession
          workout={currentWorkout}
          profile={currentProfile}
          onComplete={handleCompleteWorkout}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'food' && currentProfile && (
        <FoodTracking
          profile={currentProfile}
          todayMeals={getTodayMeals()}
          onAddMeal={handleAddMeal}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'coach' && currentProfile && (
        <AICoach
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {currentScreen === 'family' && (
        <FamilyProfiles
          profiles={allProfiles}
          currentProfile={currentProfile}
          onAddProfile={handleAddProfile}
          onSwitchProfile={handleSwitchProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'habits' && currentProfile && (
        <HabitsTracking
          profile={currentProfile}
          todayHabits={getTodayHabits()}
          onUpdateHabit={handleUpdateHabit}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'progress' && currentProfile && (
        <Progress
          profile={currentProfile}
          workoutLogs={workoutLogs}
          mealLogs={mealLogs}
          habitLogs={habitLogs}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'school' && currentProfile && (
        <SchoolMode
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
          onStartWorkout={handleStartWorkout}
        />
      )}

      {currentScreen === 'settings' && currentProfile && (
        <Settings
          profile={currentProfile}
          onUpdateProfile={setCurrentProfile}
          onBack={() => setCurrentScreen('dashboard')}
          onLogout={handleLogout}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === 'wellness' && currentProfile && (
        <WellnessOverview
          profile={currentProfile}
          workoutLogs={workoutLogs}
          mealLogs={mealLogs}
          habitLogs={habitLogs}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'achievements' && currentProfile && (
        <Achievements
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'subscription' && currentProfile && (
        <Subscription
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'social' && currentProfile && (
        <Social
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'formcheck' && currentProfile && currentWorkout && (
        <FormCheck
          profile={currentProfile}
          exercise={currentWorkout.type || 'Squat'}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'progressphotos' && currentProfile && (
        <ProgressPhotos
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'mealplanner' && currentProfile && (
        <MealPlanner
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'analytics' && currentProfile && (
        <Analytics
          profile={currentProfile}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
    </div>
  );
}

// Helper functions to map database objects to app objects
function mapDatabaseProfileToAppProfile(dbProfile: any): UserProfile {
  return {
    id: dbProfile.user_id,
    name: dbProfile.name || 'User',
    age: dbProfile.age || 25,
    gender: dbProfile.gender || 'other',
    language: dbProfile.language || 'sw',
    location: dbProfile.location || 'Tanzania',
    height: dbProfile.height || 170,
    weight: dbProfile.weight || 70,
    activityLevel: 'moderate',
    goals: dbProfile.goals || [],
    environment: dbProfile.environment || 'home',
    equipment: dbProfile.equipment || [],
    healthFlags: dbProfile.health_flags || [],
    availableTimeMinutes: dbProfile.available_time_minutes || 30,
    dailyCalorieTarget: dbProfile.daily_calorie_target,
    workoutIntensity: dbProfile.fitness_level,
    profileType: 'adult',
  };
}

function mapDatabaseWorkoutToApp(dbWorkout: any): WorkoutLog {
  return {
    id: dbWorkout.id,
    date: dbWorkout.date,
    type: dbWorkout.workout_type || 'General',
    duration: dbWorkout.duration_minutes || 0,
    difficulty: dbWorkout.difficulty || 'medium',
    completed: true,
  };
}

function mapDatabaseMealToApp(dbMeal: any): MealLog {
  return {
    id: dbMeal.id,
    date: dbMeal.date,
    type: dbMeal.meal_type || 'snack',
    foods: dbMeal.foods || [],
    totalCalories: dbMeal.total_calories || 0,
  };
}

function mapDatabaseHabitToApp(dbHabit: any): HabitLog {
  return {
    date: dbHabit.date,
    water: dbHabit.water_glasses || 0,
    sleep: dbHabit.sleep_hours || 0,
    steps: dbHabit.steps || 0,
    sitting: dbHabit.sitting_hours || 0,
  };
}