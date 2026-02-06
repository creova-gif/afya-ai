# KUIMARISHA AI - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├──────────────────┬──────────────────┬─────────────────────────────┤
│  React Native    │   React Web      │   USSD (Future)            │
│  (iOS/Android)   │   (Desktop)      │   (Feature phones)         │
└──────────────────┴──────────────────┴─────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
│  • Rate Limiting (100 req/hr)                                   │
│  • JWT Authentication                                            │
│  • Request Logging                                               │
│  • CORS & Security Headers                                       │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                            │
├──────────────────┬──────────────────┬─────────────────────────────┤
│   Auth Service   │  Profile Service │   AI Service               │
│   • Register     │  • CRUD          │   • Prompt Builder         │
│   • Login        │  • Family Mgmt   │   • LLM Integration        │
│   • JWT          │  • Preferences   │   • Safety Rules           │
├──────────────────┼──────────────────┼─────────────────────────────┤
│ Workout Service  │   Meal Service   │   Analytics Service        │
│ • Generation     │  • Logging       │   • Streaks                │
│ • Logging        │  • Recommendations│  • Achievements           │
│ • Feedback       │  • Regional Data │   • Reports                │
└──────────────────┴──────────────────┴─────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├──────────────────┬──────────────────┬─────────────────────────────┤
│   PostgreSQL     │   Redis Cache    │   Object Storage           │
│   • Primary DB   │   • Sessions     │   • User Avatars           │
│   • Relational   │   • Rate Limits  │   • Workout Media          │
│   • ACID         │   • Hot Data     │   • (Future)               │
└──────────────────┴──────────────────┴─────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├──────────────────┬──────────────────┬─────────────────────────────┤
│   OpenAI API     │  Payment Gateway │   SMS Provider             │
│   • GPT-4        │  • M-Pesa        │   • Africa's Talking      │
│   • Embeddings   │  • Tigo Pesa     │   • Reminders              │
│   • (Swahili)    │  • Airtel Money  │   • Notifications          │
└──────────────────┴──────────────────┴─────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React Native (Expo) for mobile
- **Web**: React + Vite
- **State**: React Context + Local State
- **Storage**: AsyncStorage (mobile), localStorage (web)
- **UI**: Tailwind CSS, custom components
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS (modular architecture)
- **Language**: TypeScript
- **API**: REST (GraphQL for v2)
- **Auth**: JWT + bcrypt
- **Validation**: class-validator, class-transformer

### Database
- **Primary**: PostgreSQL 14+
- **ORM**: Prisma / TypeORM
- **Migrations**: Automated via ORM
- **Backup**: Daily automated backups
- **Replication**: Master-replica (production)

### AI/ML
- **LLM**: OpenAI GPT-4 (Swahili-capable)
- **Prompts**: Template-based with context injection
- **Safety**: Rule engine + LLM guardrails
- **Future**: Local Swahili LLM (cost reduction)

### Infrastructure
- **Hosting**: AWS / Railway / Render
- **CDN**: Cloudflare (static assets)
- **Monitoring**: Sentry (errors), DataDog (performance)
- **Analytics**: Mixpanel / PostHog

---

## Data Flow Diagrams

### 1. User Onboarding Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     ▼
┌─────────────────────┐
│ 1. Select Language  │ (sw/en)
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ 2. Basic Info       │ (age, gender, location)
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ 3. Goals & Prefs    │ (weight_loss, home/gym)
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ 4. Health Flags     │ (knee_pain, etc.)
└────┬────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ AI Generates Initial Plan    │
│ • Calculate BMR              │
│ • Determine intensity        │
│ • Create week 1 workout      │
└────┬─────────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Dashboard           │
└─────────────────────┘
```

### 2. Workout Generation Flow

```
┌─────────┐
│  User   │ "Nina maumivu ya goti"
└────┬────┘
     │
     ▼
┌──────────────────────────────┐
│ Backend: Context Builder     │
│ • Fetch user profile         │
│ • Get health flags           │
│ • Check recent difficulty    │
│ • Build workout context      │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Rule Engine (Safety Check)   │
│ • Age < 12? No HIIT          │
│ • Knee pain? No squats       │
│ • Back pain? No situps       │
│ • Adjust exercises           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ AI Service: Prompt Builder   │
│ • System: Role definition    │
│ • User: Specific request     │
│ • Context: User data         │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ OpenAI API                   │
│ • Model: GPT-4               │
│ • Temperature: 0.7           │
│ • Max tokens: 1500           │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Post-Processor               │
│ • Parse JSON response        │
│ • Validate structure         │
│ • Apply final safety check   │
│ • Format for client          │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Database: Save Plan          │
│ • workout_plans table        │
│ • Link to user               │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Client: Display Workout      │
│ • Exercise list              │
│ • Safety instructions        │
│ • Start button               │
└──────────────────────────────┘
```

### 3. Feedback Loop Flow

```
┌─────────┐
│  User   │ Completes workout
└────┬────┘
     │
     ▼
┌──────────────────────────────┐
│ Feedback Screen              │
│ 1️⃣ Rahisi                   │
│ 2️⃣ Wastani                  │
│ 3️⃣ Ngumu                    │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Backend: Log Workout         │
│ • workout_logs table         │
│ • difficulty: easy/med/hard  │
│ • completed: true            │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Update User Profile          │
│ • If easy → intensity++      │
│ • If medium → maintain       │
│ • If hard → intensity--      │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Update Streak                │
│ • current_streak++           │
│ • Check achievements         │
│ • Award badges               │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Next Workout Generation      │
│ • Uses updated intensity     │
│ • Personalized progression   │
└──────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├─> Hash password (bcrypt, 10 rounds)
   ├─> Store in users table
   └─> Generate JWT token

2. User Login
   ├─> Verify credentials
   ├─> Generate JWT (7-day expiry)
   └─> Return token + user data

3. Protected Routes
   ├─> Extract JWT from header
   ├─> Verify signature
   ├─> Check expiry
   └─> Attach user_id to request
```

### Data Protection

- **At Rest**: Database encryption enabled
- **In Transit**: HTTPS/TLS 1.3
- **PII**: Minimal collection, no medical diagnoses
- **Passwords**: bcrypt hash + salt
- **Tokens**: JWT with short expiry
- **Rate Limiting**: 100 requests/hour per user

### Age-Based Content Filtering

```typescript
function getWorkoutSafety(age: number, healthFlags: string[]) {
  const rules = [];
  
  if (age <= 12) {
    rules.push('NO_HIIT', 'NO_HEAVY_WEIGHTS', 'GAMES_ONLY');
  }
  
  if (age >= 50) {
    rules.push('NO_JUMPING', 'LOW_IMPACT', 'BALANCE_FOCUS');
  }
  
  if (healthFlags.includes('knee_pain')) {
    rules.push('NO_SQUATS', 'NO_LUNGES', 'NO_JUMPING');
  }
  
  return rules;
}
```

---

## Scalability Strategy

### Phase 1: MVP (0-10K users)
- **Architecture**: Monolith (single server)
- **Database**: Single PostgreSQL instance
- **Hosting**: Railway / Render (affordable)
- **AI**: OpenAI API (pay-per-use)
- **Cost**: ~$100/month

### Phase 2: Growth (10K-100K users)
- **Architecture**: Microservices (auth, workouts, meals)
- **Database**: PostgreSQL + read replicas
- **Cache**: Redis for sessions & hot data
- **Hosting**: AWS EC2 / ECS
- **CDN**: Cloudflare for static assets
- **Cost**: ~$500/month

### Phase 3: Scale (100K+ users)
- **Architecture**: Distributed microservices
- **Database**: Sharded PostgreSQL
- **Queue**: RabbitMQ for async tasks
- **AI**: Hybrid (OpenAI + local LLM)
- **Hosting**: Kubernetes cluster
- **Cost**: ~$2000/month

---

## API Design Principles

### RESTful Conventions

```
GET    /workouts       → List workouts
GET    /workouts/:id   → Get single workout
POST   /workouts       → Create workout
PUT    /workouts/:id   → Update workout
DELETE /workouts/:id   → Delete workout
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "uuid"
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Age must be between 1 and 120",
    "details": { "field": "age", "value": 150 }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "uuid"
  }
}
```

---

## Monitoring & Observability

### Metrics to Track

**Application Metrics**
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users (DAU, MAU)

**Business Metrics**
- Workout completion rate
- AI chat engagement
- Streak retention (7-day, 30-day)
- Premium conversion rate

**Infrastructure Metrics**
- CPU/Memory usage
- Database connections
- API latency
- Cache hit rate

### Alerting Rules

```yaml
- name: high_error_rate
  condition: error_rate > 5%
  duration: 5m
  notify: engineering_team

- name: slow_api
  condition: p95_latency > 2s
  duration: 10m
  notify: engineering_team

- name: database_connections
  condition: connections > 80% of max
  duration: 5m
  notify: ops_team
```

---

## Deployment Pipeline

```
1. Developer commits code
   └─> GitHub

2. Automated Tests
   ├─> Unit tests
   ├─> Integration tests
   └─> E2E tests (Cypress)

3. Build
   ├─> Frontend: npm run build
   ├─> Backend: npm run build
   └─> Docker images

4. Deploy to Staging
   └─> Run smoke tests

5. Manual QA
   └─> Test Swahili translations
   └─> Verify AI responses

6. Deploy to Production
   ├─> Blue-green deployment
   └─> Health checks

7. Monitor
   └─> Sentry, DataDog
```

---

## Future Architecture Enhancements

### V2 Features
- [ ] Voice AI (Swahili speech recognition)
- [ ] Video workouts (streaming)
- [ ] Wearable integration (Fitbit, Garmin)
- [ ] Social features (community feed)
- [ ] AI meal planning (photos → recognition)

### Technical Improvements
- [ ] GraphQL API (reduce over-fetching)
- [ ] WebSocket for real-time (live classes)
- [ ] Event-driven architecture (Kafka)
- [ ] Local Swahili LLM (cost + privacy)
- [ ] Mobile edge caching (offline-first)

---

## Contact

**Engineering Team**: engineering@kuimarisha.co.tz
**Architecture Questions**: cto@kuimarisha.co.tz

---

*Last Updated: 2024-01-15*
