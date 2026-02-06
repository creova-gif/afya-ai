import { useState } from 'react';
import { Home } from './components/Home';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorkoutSession } from './components/WorkoutSession';
import { FoodTracking } from './components/FoodTracking';
import { AICoach } from './components/AICoach';
import { FamilyProfiles } from './components/FamilyProfiles';
import { HabitsTracking } from './components/HabitsTracking';
import { Progress } from './components/Progress';
import { SchoolMode } from './components/SchoolMode';
import { Settings } from './components/Settings';

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
  | 'onboarding' 
  | 'dashboard' 
  | 'workout' 
  | 'food' 
  | 'coach' 
  | 'family' 
  | 'habits' 
  | 'progress' 
  | 'school'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      isPrimary: true,
    };
    setCurrentProfile(newProfile);
    setAllProfiles([newProfile]);
    setHasCompletedOnboarding(true);
    
    // Initialize today's habit log
    const today = new Date().toISOString().split('T')[0];
    setHabitLogs([{ date: today, water: 0, sleep: 0, steps: 0, sitting: 0 }]);
    
    setCurrentScreen('dashboard');
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

  const handleCompleteWorkout = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (currentWorkout) {
      const log: WorkoutLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: currentWorkout.type,
        duration: currentWorkout.duration,
        difficulty,
        completed: true,
      };
      setWorkoutLogs([...workoutLogs, log]);
      setCurrentWorkout(null);
      setCurrentScreen('dashboard');
    }
  };

  const handleAddMeal = (meal: MealLog) => {
    setMealLogs([...mealLogs, meal]);
  };

  const handleUpdateHabit = (habit: Partial<HabitLog>) => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = habitLogs.findIndex(log => log.date === today);
    
    if (existingIndex >= 0) {
      const updated = [...habitLogs];
      updated[existingIndex] = { ...updated[existingIndex], ...habit };
      setHabitLogs(updated);
    } else {
      setHabitLogs([...habitLogs, { date: today, water: 0, sleep: 0, steps: 0, sitting: 0, ...habit }]);
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

  // Show home or onboarding if not completed
  if (!hasCompletedOnboarding) {
    if (currentScreen === 'home') {
      return <Home onGetStarted={() => setCurrentScreen('onboarding')} />;
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
        />
      )}
    </div>
  );
}