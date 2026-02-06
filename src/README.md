# KUIMARISHA AI

**Swahili-first Health & Fitness Operating System for Tanzania**

*Afya ya Mtanzania, kwa lugha yake, kwa maisha yake.*

---

## 🎯 OVERVIEW

KUIMARISHA AI is a complete fitness and health platform designed specifically for Tanzanian families, schools, and communities. It combines AI-powered coaching with local food knowledge, cultural context, and Kiswahili-first communication.

### Key Features
- ✅ **AI Coach** - Personalized workouts in Kiswahili/English
- ✅ **Family Profiles** - Multi-user support with parent dashboard
- ✅ **School Mode** - PE lesson generator with age-based safety
- ✅ **Local Food Database** - 15+ Tanzanian foods with simple portions
- ✅ **Offline-Ready** - Low-data design for rural areas
- ✅ **Progress Tracking** - Streaks, achievements, habits

---

## 🏗️ ARCHITECTURE

```
Frontend (React/React Native)
        ↓
    API Layer
        ↓
  Context Builder + Rules Engine
        ↓
  AI Layer (LLM + Safety Rules)
        ↓
Database (PostgreSQL/Supabase)
```

---

## 📊 DATABASE SCHEMA

### Users & Authentication
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  language VARCHAR(2) DEFAULT 'sw',
  role VARCHAR(20) CHECK (role IN ('individual', 'parent', 'school', 'teacher')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age INT NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  location VARCHAR(100),
  height INT, -- cm
  weight DECIMAL(5,2), -- kg
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  environment VARCHAR(20) CHECK (environment IN ('home', 'gym', 'family', 'school')),
  health_flags TEXT[],
  available_time_minutes INT DEFAULT 30,
  daily_calorie_target INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Family
```sql
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(10),
  role VARCHAR(20) CHECK (role IN ('child', 'teen', 'elder')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Workouts
```sql
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mode VARCHAR(20),
  type VARCHAR(100),
  duration INT NOT NULL,
  intensity VARCHAR(20),
  content JSONB NOT NULL, -- exercises, safety instructions
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed BOOLEAN DEFAULT true,
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, created_at DESC);
```

### Meals
```sql
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  foods JSONB NOT NULL,
  total_calories INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_date ON meal_logs(user_id, created_at DESC);
```

### Habits
```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  water_glasses INT DEFAULT 0,
  sleep_hours DECIMAL(3,1) DEFAULT 0,
  steps INT DEFAULT 0,
  sitting_hours DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date DESC);
```

### Streaks & Achievements
```sql
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_workout_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  description TEXT,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);
```

---

## 🔌 API ENDPOINTS

### Base URL
```
Production: https://api.kuimarisha.co.tz/v1
Development: http://localhost:3000/api/v1
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "phone": "+255712345678",
  "email": "user@example.com",
  "password": "secure_password",
  "language": "sw"
}

Response 201:
{
  "user": {
    "id": "uuid",
    "phone": "+255712345678",
    "language": "sw",
    "role": "individual"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+255712345678",
  "password": "secure_password"
}

Response 200:
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

### Profile

#### Get Profile
```http
GET /profile
Authorization: Bearer {token}

Response 200:
{
  "user_id": "uuid",
  "age": 32,
  "gender": "female",
  "location": "Dar es Salaam",
  "fitness_level": "beginner",
  "goals": ["weight_loss", "energy"],
  "environment": "home",
  "health_flags": ["knee_pain"]
}
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "goals": ["weight_loss", "flexibility"],
  "available_time_minutes": 45
}

Response 200:
{
  "user_id": "uuid",
  ...updated_fields
}
```

### AI Coach

#### Chat with AI
```http
POST /ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Nina maumivu ya goti leo",
  "context": {
    "age": 32,
    "language": "sw",
    "environment": "home",
    "health_flags": ["knee_pain"]
  }
}

Response 200:
{
  "response": "Pole sana! Nimekuandalia mazoezi salama...",
  "workout": {
    "type": "Low-Impact Safe Workout",
    "exercises": [...]
  }
}
```

#### Generate Workout
```http
POST /ai/generate-workout
Authorization: Bearer {token}
Content-Type: application/json

{
  "age": 32,
  "environment": "home",
  "duration": 30,
  "intensity": "beginner",
  "health_flags": [],
  "language": "sw"
}

Response 200:
{
  "id": "uuid",
  "type": "Home Full Body",
  "duration": 30,
  "exercises": [
    {
      "name": "Squats",
      "reps": "10-15",
      "rest": 30
    }
  ],
  "safety_instructions": [...]
}
```

#### Submit Feedback
```http
POST /ai/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_id": "uuid",
  "difficulty": "easy"
}

Response 200:
{
  "adjusted_intensity": "intermediate",
  "message": "Tutaongeza nguvu kidogo"
}
```

### Workouts

#### Get Today's Workout
```http
GET /workouts/today
Authorization: Bearer {token}

Response 200:
{
  "id": "uuid",
  "type": "Home Full Body",
  "duration": 30,
  "exercises": [...]
}
```

#### Log Workout
```http
POST /workouts/log
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_id": "uuid",
  "difficulty": "medium",
  "completed": true,
  "duration_minutes": 28
}

Response 201:
{
  "id": "uuid",
  "plan_id": "uuid",
  "difficulty": "medium",
  "completed": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Meals

#### Get Recommendations
```http
GET /meals/recommendations?location=Dar es Salaam
Authorization: Bearer {token}

Response 200:
{
  "breakfast": ["Uji wa mtama", "Chai na mkate"],
  "lunch": ["Wali na maharage", "Ugali na dagaa"],
  "dinner": ["Ugali na mboga", "Wali na samaki"]
}
```

#### Log Meal
```http
POST /meals/log
Authorization: Bearer {token}
Content-Type: application/json

{
  "meal_type": "lunch",
  "foods": [
    {
      "name": "Wali",
      "portion": "Sahani ya wastani",
      "calories": 300
    },
    {
      "name": "Maharage",
      "portion": "Bakuli ndogo",
      "calories": 200
    }
  ]
}

Response 201:
{
  "id": "uuid",
  "meal_type": "lunch",
  "total_calories": 500,
  "created_at": "2024-01-15T13:00:00Z"
}
```

### Family

#### Add Family Member
```http
POST /family/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Amina",
  "age": 8,
  "gender": "female",
  "role": "child"
}

Response 201:
{
  "id": "uuid",
  "parent_id": "uuid",
  "name": "Amina",
  "age": 8
}
```

---

## 🤖 AI INTEGRATION

### LLM Provider Setup

#### Option 1: OpenAI (Recommended for MVP)
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: AIPromptBuilder.getSystemPrompt('sw') },
    { role: 'user', content: AIPromptBuilder.getWorkoutPrompt(context) }
  ],
  temperature: 0.7,
});
```

#### Option 2: Local Swahili LLM (Future)
```typescript
// Using llama.cpp or similar
const response = await localLLM.generate({
  prompt: buildCompleteLLMPrompt({ type: 'workout', context }),
  max_tokens: 1000,
});
```

### Prompt Templates

All prompts are in `/services/ai-prompts.ts`:

- **System Prompt**: Defines AI role, safety rules, constraints
- **Workout Prompt**: Generates safe, age-appropriate workouts
- **Chat Prompt**: Conversational AI with context
- **Meal Prompt**: Regional food recommendations
- **Feedback Prompt**: Adjusts intensity based on user feedback
- **School Prompt**: PE lesson generator with commands

---

## 🚀 DEPLOYMENT

### Frontend (React Native / Web)

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Mobile (React Native)
npx expo start
```

### Backend (Node.js + NestJS)

```bash
# Install
npm install

# Environment variables
cp .env.example .env
# Add: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY

# Run migrations
npm run migrate

# Start server
npm run start:prod
```

### Database (PostgreSQL)

```bash
# Use Supabase (recommended) or self-hosted PostgreSQL
# Run schema from /database/schema.sql

psql -U postgres -d kuimarisha < database/schema.sql
```

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/kuimarisha
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
NODE_ENV=production
PORT=3000

# Frontend
REACT_APP_API_URL=https://api.kuimarisha.co.tz/v1
REACT_APP_ENV=production
```

---

## 📱 MVP SCOPE (90 Days)

### Month 1: Foundation
- [x] Database schema
- [x] Authentication API
- [x] Profile management
- [x] AI prompt templates
- [x] Basic frontend

### Month 2: Core Features
- [x] Workout generation
- [x] Food tracking
- [x] AI Coach chat
- [x] Family profiles
- [x] Progress tracking

### Month 3: Polish & Launch
- [ ] School mode testing
- [ ] Swahili language QA
- [ ] User testing (10 families)
- [ ] Performance optimization
- [ ] Beta launch (Dar es Salaam)

---

## 🧪 TESTING

### Test Users
```sql
-- Create test user
INSERT INTO users (phone, password_hash, language, role)
VALUES ('+255712345678', 'hashed_password', 'sw', 'parent');

-- Create test profile
INSERT INTO profiles (user_id, age, gender, location, fitness_level, environment)
VALUES ('uuid', 32, 'female', 'Dar es Salaam', 'beginner', 'home');
```

### Test Scenarios
1. **Onboarding**: New user completes profile setup
2. **Daily Workout**: User gets AI workout, completes it, gives feedback
3. **Family Mode**: Parent adds child, generates family workout
4. **School Mode**: Teacher creates PE lesson for Grade 4
5. **Meal Logging**: User logs ugali + maharage

---

## 🔐 SECURITY

- **JWT Auth**: 7-day expiry, refresh tokens
- **Password Hashing**: bcrypt, 10 rounds
- **Rate Limiting**: 100 requests/hour per user
- **Data Privacy**: No PII sharing, minimal collection
- **Age Protection**: Content filtering for children

---

## 🌍 LOCALIZATION

- **Primary**: Kiswahili (sw)
- **Secondary**: English (en)
- **Future**: French (Burundi, Rwanda expansion)

All UI strings in `/locales/`:
- `sw.json` - Kiswahili
- `en.json` - English

---

## 💰 MONETIZATION

### Pricing (Tanzania)
- **Free**: Home workouts, basic tracking
- **Premium**: TZS 10,000/month (~$4)
  - AI Coach unlimited
  - Family profiles
  - Meal tracking
- **School**: TZS 500,000/year (~$200)
  - 500 students
  - Teacher dashboard
  - Reports

### Payment Integration
- **Mobile Money**: M-Pesa, Tigo Pesa, Airtel Money
- **Provider**: DPO Payment / Flutterwave

---

## 📊 METRICS TO TRACK

- Daily Active Users (DAU)
- Workout Completion Rate
- AI Chat Engagement
- Streak Retention (7-day, 30-day)
- Family Profile Adoption
- School Program Enrollment

---

## 🤝 PARTNERS

### Target Partnerships
1. **Government**: Ministry of Education (PE programs)
2. **NGOs**: Health organizations, community programs
3. **Schools**: Dar es Salaam pilot (10 schools)
4. **Gyms**: Equipment discounts for premium users

---

## 📞 SUPPORT

- **Email**: support@kuimarisha.co.tz
- **WhatsApp**: +255 XXX XXX XXX
- **Documentation**: https://docs.kuimarisha.co.tz

---

## 📄 LICENSE

Proprietary - KUIMARISHA AI © 2024

---

**Built with ❤️ in Tanzania, for Tanzania 🇹🇿**

*Afya ya Mtanzania, kwa lugha yake, kwa maisha yake.*
