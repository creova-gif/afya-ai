-- KUIMARISHA AI Database Schema
-- PostgreSQL 14+
-- Production-ready schema for Tanzania health & fitness platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- USERS & AUTHENTICATION
-- ======================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  language VARCHAR(2) DEFAULT 'sw' CHECK (language IN ('sw', 'en')),
  role VARCHAR(20) DEFAULT 'individual' CHECK (role IN ('individual', 'parent', 'school', 'teacher', 'admin')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  CONSTRAINT phone_or_email CHECK (phone IS NOT NULL OR email IS NOT NULL)
);

CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);

-- ======================
-- PROFILES
-- ======================

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age INT NOT NULL CHECK (age > 0 AND age < 120),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  location VARCHAR(100),
  region VARCHAR(50), -- Dar es Salaam, Arusha, Mwanza, etc.
  height INT CHECK (height > 0), -- cm
  weight DECIMAL(5,2) CHECK (weight > 0), -- kg
  fitness_level VARCHAR(20) DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[], -- ['weight_loss', 'muscle_gain', 'fitness', etc.]
  environment VARCHAR(20) DEFAULT 'home' CHECK (environment IN ('home', 'gym', 'family', 'school')),
  health_flags TEXT[], -- ['knee_pain', 'back_pain', 'pregnancy', etc.]
  equipment TEXT[], -- ['dumbbells', 'mat', 'bands', 'none']
  available_time_minutes INT DEFAULT 30 CHECK (available_time_minutes >= 10 AND available_time_minutes <= 120),
  daily_calorie_target INT CHECK (daily_calorie_target > 0),
  profile_type VARCHAR(20) CHECK (profile_type IN ('child', 'teen', 'adult', 'elder')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_environment ON profiles(environment);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- FAMILY MEMBERS
-- ======================

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode VARCHAR(20) CHECK (mode IN ('home', 'gym', 'family', 'school')),
  type VARCHAR(100) NOT NULL, -- 'Home Full Body', 'Gym Strength', etc.
  duration INT NOT NULL CHECK (duration > 0), -- minutes
  intensity VARCHAR(20) CHECK (intensity IN ('beginner', 'intermediate', 'advanced')),
  content JSONB NOT NULL, -- Full workout structure
  age_group VARCHAR(10), -- For school mode: '6-9', '10-12', '13+'
  num_participants INT, -- For family/school mode
  generated_by VARCHAR(20) DEFAULT 'ai' CHECK (generated_by IN ('ai', 'manual', 'template')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_plans_user ON workout_plans(user_id, created_at DESC);
CREATE INDEX idx_workout_plans_mode ON workout_plans(mode);
CREATE INDEX idx_workout_plans_generated ON workout_plans(generated_by);

-- ======================
-- WORKOUT LOGS
-- ======================

CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

CREATE TRIGGER update_habit_logs_updated_at BEFORE UPDATE ON habit_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- USER STREAKS
-- ======================

CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INT DEFAULT 0 CHECK (longest_streak >= 0),
  last_workout_date DATE,
  total_workouts INT DEFAULT 0 CHECK (total_workouts >= 0),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON user_streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================
-- ACHIEVEMENTS
-- ======================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL, -- 'first_workout', 'streak_3', 'workouts_10', etc.
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10), -- Emoji
  earned_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX idx_achievements_user ON achievements(user_id, earned_at DESC);

-- ======================
-- AI CONVERSATIONS (Optional - for chat history)
-- ======================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB, -- User context at time of conversation
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, updated_at DESC);

-- ======================
-- FEEDBACK (for AI improvement)
-- ======================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
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
-- SCHOOL PROGRAMS (for institutional accounts)
-- ======================

CREATE TABLE school_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name VARCHAR(200) NOT NULL,
  location VARCHAR(100),
  contact_phone VARCHAR(15),
  contact_email VARCHAR(255),
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  num_students INT CHECK (num_students > 0),
  subscription_tier VARCHAR(20) CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_expires_at DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_school_programs_teacher ON school_programs(teacher_id);
CREATE INDEX idx_school_programs_active ON school_programs(is_active) WHERE is_active = true;

-- ======================
-- PAYMENT TRANSACTIONS (for premium features)
-- ======================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'TZS',
  payment_method VARCHAR(20) CHECK (payment_method IN ('mpesa', 'tigopesa', 'airtelmoney', 'card', 'bank')),
  payment_provider VARCHAR(50), -- 'DPO', 'Flutterwave', etc.
  transaction_ref VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  subscription_type VARCHAR(20) CHECK (subscription_type IN ('monthly', 'yearly', 'one_time')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_ref ON transactions(transaction_ref);

-- ======================
-- SUBSCRIPTIONS
-- ======================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'premium', 'family', 'school')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT false,
  
  UNIQUE(user_id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at) WHERE status = 'active';

-- ======================
-- VIEWS (for common queries)
-- ======================

-- User stats view
CREATE VIEW user_stats AS
SELECT 
  u.id as user_id,
  u.language,
  p.age,
  p.location,
  p.environment,
  s.current_streak,
  s.total_workouts,
  COUNT(DISTINCT wl.id) as completed_workouts,
  COUNT(DISTINCT ml.id) as logged_meals,
  COUNT(DISTINCT a.id) as achievements_earned
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN user_streaks s ON u.id = s.user_id
LEFT JOIN workout_logs wl ON u.id = wl.user_id AND wl.completed = true
LEFT JOIN meal_logs ml ON u.id = ml.user_id
LEFT JOIN achievements a ON u.id = a.user_id
GROUP BY u.id, u.language, p.age, p.location, p.environment, s.current_streak, s.total_workouts;

-- Today's activity view
CREATE VIEW todays_activity AS
SELECT 
  wl.user_id,
  COUNT(DISTINCT wl.id) as workouts_today,
  SUM(wl.duration_minutes) as minutes_exercised,
  COUNT(DISTINCT ml.id) as meals_logged,
  COALESCE(hl.water_glasses, 0) as water_glasses,
  COALESCE(hl.steps, 0) as steps
FROM workout_logs wl
LEFT JOIN meal_logs ml ON wl.user_id = ml.user_id AND DATE(ml.created_at) = CURRENT_DATE
LEFT JOIN habit_logs hl ON wl.user_id = hl.user_id AND hl.date = CURRENT_DATE
WHERE DATE(wl.created_at) = CURRENT_DATE
GROUP BY wl.user_id, hl.water_glasses, hl.steps;

-- ======================
-- FUNCTIONS
-- ======================

-- Function to update streak after workout
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
-- SEED DATA (Development)
-- ======================

-- Insert sample user
INSERT INTO users (id, phone, password_hash, language, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '+255712345678', '$2b$10$example_hash', 'sw', 'parent'),
  ('00000000-0000-0000-0000-000000000002', '+255723456789', '$2b$10$example_hash', 'sw', 'teacher')
ON CONFLICT DO NOTHING;

-- Insert sample profile
INSERT INTO profiles (user_id, age, gender, location, region, fitness_level, goals, environment, available_time_minutes, profile_type)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 32, 'female', 'Dar es Salaam', 'Dar es Salaam', 'beginner', 
   ARRAY['weight_loss', 'energy'], 'home', 30, 'adult')
ON CONFLICT DO NOTHING;

-- ======================
-- GRANTS (adjust for your setup)
-- ======================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- ======================
-- COMMENTS
-- ======================

COMMENT ON TABLE users IS 'Core user authentication and account information';
COMMENT ON TABLE profiles IS 'User health and fitness profiles';
COMMENT ON TABLE family_members IS 'Family members linked to parent accounts';
COMMENT ON TABLE workout_plans IS 'AI-generated and manual workout plans';
COMMENT ON TABLE workout_logs IS 'Completed workout history with feedback';
COMMENT ON TABLE meal_logs IS 'User meal tracking with Tanzanian foods';
COMMENT ON TABLE habit_logs IS 'Daily habit tracking (water, sleep, steps)';
COMMENT ON TABLE user_streaks IS 'Workout streaks and motivation metrics';
COMMENT ON TABLE achievements IS 'Gamification achievements and badges';
COMMENT ON TABLE transactions IS 'Payment transactions for premium features';
COMMENT ON TABLE subscriptions IS 'User subscription status and tiers';

-- ======================
-- ANALYTICS QUERIES (Examples)
-- ======================

-- Active users in last 7 days
-- SELECT COUNT(DISTINCT user_id) FROM workout_logs WHERE created_at >= NOW() - INTERVAL '7 days';

-- Average workout completion rate
-- SELECT 
--   AVG(CASE WHEN completed THEN 1 ELSE 0 END) * 100 as completion_rate
-- FROM workout_logs;

-- Most popular workout environments
-- SELECT environment, COUNT(*) FROM profiles GROUP BY environment ORDER BY count DESC;

-- Top performing regions (by streak)
-- SELECT p.region, AVG(s.current_streak) as avg_streak
-- FROM profiles p
-- JOIN user_streaks s ON p.user_id = s.user_id
-- GROUP BY p.region
-- ORDER BY avg_streak DESC;
