-- KUIMARISHA AI - Supabase Production Schema
-- Migration: Initial Setup
-- Date: March 14, 2026

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================
-- PROFILES (extends auth.users)
-- ======================
-- Supabase auth.users already handles authentication
-- We extend it with fitness-specific profile data

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age INT NOT NULL CHECK (age > 0 AND age < 120),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  location VARCHAR(100),
  region VARCHAR(50), -- Dar es Salaam, Arusha, Mwanza, etc.
  height INT CHECK (height > 0), -- cm
  weight DECIMAL(5,2) CHECK (weight > 0), -- kg
  fitness_level VARCHAR(20) DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[], -- ['weight_loss', 'muscle_gain', 'fitness']
  environment VARCHAR(20) DEFAULT 'home' CHECK (environment IN ('home', 'gym', 'family', 'school')),
  health_flags TEXT[], -- ['knee_pain', 'back_pain', 'pregnancy']
  equipment TEXT[], -- ['dumbbells', 'mat', 'bands', 'none']
  available_time_minutes INT DEFAULT 30 CHECK (available_time_minutes >= 10 AND available_time_minutes <= 120),
  daily_calorie_target INT CHECK (daily_calorie_target > 0),
  profile_type VARCHAR(20) CHECK (profile_type IN ('child', 'teen', 'adult', 'elder')),
  language VARCHAR(2) DEFAULT 'sw' CHECK (language IN ('sw', 'en')),
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_environment ON profiles(environment);
CREATE INDEX idx_profiles_language ON profiles(language);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- FAMILY MEMBERS
-- ======================

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age > 0 AND age < 120),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  role VARCHAR(20) CHECK (role IN ('child', 'teen', 'elder', 'spouse')),
  health_flags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_family_members_parent ON family_members(parent_id);

-- ======================
-- WORKOUT PLANS
-- ======================

CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode VARCHAR(20) CHECK (mode IN ('home', 'gym', 'family', 'school')),
  type VARCHAR(100) NOT NULL,
  duration INT NOT NULL CHECK (duration > 0), -- minutes
  intensity VARCHAR(20) CHECK (intensity IN ('beginner', 'intermediate', 'advanced')),
  exercises JSONB NOT NULL DEFAULT '[]',
  content JSONB NOT NULL, -- Full workout structure
  age_group VARCHAR(10),
  num_participants INT,
  generated_by VARCHAR(20) DEFAULT 'ai' CHECK (generated_by IN ('ai', 'manual', 'template')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_plans_user ON workout_plans(user_id, created_at DESC);
CREATE INDEX idx_workout_plans_mode ON workout_plans(mode);

-- ======================
-- WORKOUT LOGS
-- ======================

CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed BOOLEAN DEFAULT true,
  duration_minutes INT CHECK (duration_minutes > 0),
  calories_burned INT CHECK (calories_burned >= 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, created_at DESC);
CREATE INDEX idx_workout_logs_completed ON workout_logs(user_id, completed) WHERE completed = true;

-- ======================
-- MEAL LOGS
-- ======================

CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  foods JSONB NOT NULL, -- Array of {name, portion, calories}
  total_calories INT NOT NULL CHECK (total_calories >= 0),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_date ON meal_logs(user_id, created_at DESC);
CREATE INDEX idx_meal_logs_type ON meal_logs(user_id, meal_type);

-- ======================
-- HABIT LOGS
-- ======================

CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  water_glasses INT DEFAULT 0 CHECK (water_glasses >= 0 AND water_glasses <= 20),
  sleep_hours DECIMAL(3,1) DEFAULT 0 CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  steps INT DEFAULT 0 CHECK (steps >= 0),
  sitting_hours DECIMAL(3,1) DEFAULT 0 CHECK (sitting_hours >= 0 AND sitting_hours <= 24),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date DESC);

CREATE TRIGGER update_habit_logs_updated_at 
BEFORE UPDATE ON habit_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- USER STREAKS
-- ======================

CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INT DEFAULT 0 CHECK (longest_streak >= 0),
  last_workout_date DATE,
  total_workouts INT DEFAULT 0 CHECK (total_workouts >= 0),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_user_streaks_updated_at 
BEFORE UPDATE ON user_streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- ACHIEVEMENTS
-- ======================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  earned_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX idx_achievements_user ON achievements(user_id, earned_at DESC);

-- ======================
-- AI CONVERSATIONS
-- ======================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, updated_at DESC);

-- ======================
-- FEEDBACK
-- ======================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  feedback_type VARCHAR(20) CHECK (feedback_type IN ('workout_difficulty', 'feature_request', 'bug_report', 'general')),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_user ON feedback(user_id);

-- ======================
-- AUDIT LOGS
-- ======================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ======================
-- TRIGGERS FOR AUTO-STREAK UPDATE
-- ======================

CREATE OR REPLACE FUNCTION update_streak_after_workout()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_workout_date, total_workouts)
    VALUES (NEW.user_id, 1, 1, CURRENT_DATE, 1)
    ON CONFLICT (user_id) DO UPDATE SET
      current_streak = CASE
        WHEN user_streaks.last_workout_date = CURRENT_DATE - INTERVAL '1 day' THEN user_streaks.current_streak + 1
        WHEN user_streaks.last_workout_date = CURRENT_DATE THEN user_streaks.current_streak
        ELSE 1
      END,
      longest_streak = GREATEST(
        user_streaks.longest_streak,
        CASE
          WHEN user_streaks.last_workout_date = CURRENT_DATE - INTERVAL '1 day' THEN user_streaks.current_streak + 1
          WHEN user_streaks.last_workout_date = CURRENT_DATE THEN user_streaks.current_streak
          ELSE 1
        END
      ),
      last_workout_date = CURRENT_DATE,
      total_workouts = user_streaks.total_workouts + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
AFTER INSERT ON workout_logs
FOR EACH ROW
EXECUTE FUNCTION update_streak_after_workout();

-- ======================
-- ROW LEVEL SECURITY (RLS)
-- ======================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Family members: Users can only access their own family members
CREATE POLICY "Users can view own family members"
  ON family_members FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can insert own family members"
  ON family_members FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update own family members"
  ON family_members FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Users can delete own family members"
  ON family_members FOR DELETE
  USING (auth.uid() = parent_id);

-- Workout plans: Users can only access their own workout plans
CREATE POLICY "Users can view own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Workout logs: Users can only access their own workout logs
CREATE POLICY "Users can view own workout logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Meal logs: Users can only access their own meal logs
CREATE POLICY "Users can view own meal logs"
  ON meal_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal logs"
  ON meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Habit logs: Users can only access their own habit logs
CREATE POLICY "Users can view own habit logs"
  ON habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit logs"
  ON habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
  ON habit_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- User streaks: Users can only access their own streaks
CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements: Users can only access their own achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI Conversations: Users can only access their own conversations
CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Feedback: Users can view and insert their own feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ======================
-- VIEWS FOR ANALYTICS
-- ======================

-- User stats view
CREATE VIEW user_stats AS
SELECT 
  p.id as user_id,
  p.name,
  p.language,
  p.age,
  p.location,
  p.environment,
  COALESCE(s.current_streak, 0) as current_streak,
  COALESCE(s.total_workouts, 0) as total_workouts,
  COUNT(DISTINCT wl.id) as completed_workouts_count,
  COUNT(DISTINCT ml.id) as logged_meals_count,
  COUNT(DISTINCT a.id) as achievements_count
FROM profiles p
LEFT JOIN user_streaks s ON p.id = s.user_id
LEFT JOIN workout_logs wl ON p.id = wl.user_id AND wl.completed = true
LEFT JOIN meal_logs ml ON p.id = ml.user_id
LEFT JOIN achievements a ON p.id = a.user_id
GROUP BY p.id, p.name, p.language, p.age, p.location, p.environment, s.current_streak, s.total_workouts;

-- ======================
-- COMMENTS
-- ======================

COMMENT ON TABLE profiles IS 'User fitness profiles extending Supabase auth.users';
COMMENT ON TABLE family_members IS 'Family members linked to parent accounts';
COMMENT ON TABLE workout_plans IS 'AI-generated and manual workout plans';
COMMENT ON TABLE workout_logs IS 'Completed workout history with feedback';
COMMENT ON TABLE meal_logs IS 'Meal tracking with Tanzanian foods';
COMMENT ON TABLE habit_logs IS 'Daily habit tracking (water, sleep, steps)';
COMMENT ON TABLE user_streaks IS 'Workout streaks for motivation';
COMMENT ON TABLE achievements IS 'Gamification badges';
COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail';
