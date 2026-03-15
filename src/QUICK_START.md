# ⚡ KUIMARISHA AI - Quick Start Guide

## 🚀 **Get Your Backend Running in 5 Minutes**

### **Step 1: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### **Step 2: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `kuimarisha-ai`
4. Wait 2 minutes

### **Step 3: Run Migration**
1. Open Supabase Dashboard → **SQL Editor**
2. Copy `/supabase/migrations/20260314000000_initial_schema.sql`
3. Paste and click **Run**
4. ✅ 11 tables created!

### **Step 4: Configure Environment**
Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Step 5: Update API Import**
```typescript
// In your files, change:
import API from './services/api';

// To:
import API from './services/api-supabase';
```

### **Step 6: Test**
```bash
npm run dev
```

1. Complete onboarding
2. Check Supabase → **Table Editor** → **profiles**
3. See your data! 🎉

---

## 📁 **Key Files**

| File | Purpose |
|------|---------|
| `/services/api-supabase.ts` | ✅ Production API (use this) |
| `/services/api.ts` | ❌ Mock API (deprecated) |
| `/utils/supabase/client.ts` | Supabase client |
| `/types/database-supabase.ts` | TypeScript types |
| `/supabase/migrations/*` | Database schema |

---

## 🔧 **Common Commands**

### **Development:**
```bash
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build
```

### **Database:**
```bash
# In Supabase Dashboard SQL Editor:
SELECT * FROM profiles;             # View all profiles
SELECT * FROM workout_logs;         # View workouts
SELECT * FROM audit_logs;           # View audit trail
```

---

## 🐛 **Quick Troubleshooting**

### **"Invalid API key"**
- Check `.env.local` exists
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart dev server

### **"No data showing"**
- Check user is logged in
- Verify RLS policies (already configured)
- Check browser console for errors

### **"Cannot find module '@supabase/supabase-js'"**
```bash
npm install @supabase/supabase-js
```

---

## 📊 **API Usage Examples**

### **Register User:**
```typescript
import API from './services/api-supabase';

const { user, session } = await API.Auth.register({
  email: 'user@example.com',
  password: 'securepass123',
  language: 'sw',
  name: 'Juma Hassan',
});
```

### **Create Profile:**
```typescript
await API.Profile.upsertProfile(user.id, {
  age: 25,
  gender: 'male',
  location: 'Dar es Salaam',
  fitness_level: 'beginner',
  goals: ['weight_loss'],
  environment: 'home',
});
```

### **Log Workout:**
```typescript
await API.Workout.logWorkout({
  user_id: user.id,
  difficulty: 'medium',
  completed: true,
  duration_minutes: 30,
});
```

---

## ✅ **What's Different?**

| Before (Mock) | After (Production) |
|--------------|-------------------|
| localStorage | PostgreSQL database |
| Fake tokens | Real JWT authentication |
| Single device | Multi-device cloud sync |
| No security | Row Level Security |
| No audit logs | Full audit trail |
| Data lost on clear | Persistent forever |

---

## 🎯 **Next Steps**

1. ✅ Follow this quick start
2. ✅ Read `/SUPABASE_SETUP_GUIDE.md` for details
3. ✅ Test all features
4. 🟡 Add AI integration (optional)
5. 🟡 Implement offline sync (optional)

---

**Time to Production:** ~5 minutes setup + 1 hour testing = Ready! 🚀
