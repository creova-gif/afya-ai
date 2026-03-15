KUIMARISHA AI — Full Implementation Blueprint
1️⃣ Authentication & Account Management
Frontend Screens
Screen	Components	Notes
Login	Email input, password input, login button, social login buttons (Google/Facebook/Apple), “Forgot Password” link	Uses Supabase Auth.
Forgot Password	Email input, submit button, confirmation message	Sends reset link via Supabase Auth.
Logout	Button in Settings tab	Clears session and redirects to Login.
Social Login	Buttons integrated in Login screen	OAuth flow handled by Supabase.
Database Tables
Table	Columns	Notes
users	id (UUID, PK), email, password_hash, created_at, updated_at	Supabase Auth stores credentials.
profiles	id, user_id (FK), name, age, gender, avatar_url, language_preference, created_at, updated_at	Linked to users table.
sessions	id, user_id, token, expires_at	Optional for tracking login sessions beyond Supabase default.
APIs
Endpoint	Method	Request Body	Response	Notes
/auth/login	POST	{ email, password }	{ token, user_profile }	Returns session token and user data.
/auth/social-login	POST	{ provider, oauth_token }	{ token, user_profile }	Handles Google/Facebook/Apple OAuth.
/auth/logout	POST	{ token }	{ success: true }	Clears session server-side.
/auth/forgot-password	POST	{ email }	{ message }	Sends reset link.
/auth/reset-password	POST	{ token, new_password }	{ success: true }	Resets password securely.
AI Logic

None directly needed for authentication.

Optional: AI can suggest secure passwords during registration.

2️⃣ Real AI Integration
Frontend Screens
Screen	Components	Notes
AI Coach Chat	Chat window, input box, quick suggestion buttons, speech input	Bilingual (Swahili/English).
AI Meal Planner	Food suggestions, meal recommendations, “Add to diary” button	Context-aware based on health flags.
AI Workout Generator	Suggested workouts, difficulty slider, environment filter	Uses age & health flag safety rules.
AI Feedback & Motivation	Pop-ups/messages during workouts or after logging meals	Encourages engagement, uses motivational tone.
Database Tables
Table	Columns	Notes
ai_conversations	id, user_id, family_member_id (nullable), prompt_text, ai_response_text, created_at	Stores all AI interactions.
workout_plans	id, user_id, family_member_id, plan_json, created_at	Stores AI-generated workouts for persistence.
meal_plans	id, user_id, family_member_id, plan_json, created_at	Stores AI-generated meal plans.
ai_feedback_logs	id, user_id, feedback_type (motivational, warning, suggestion), content, created_at	Tracks AI-sent messages.
APIs
Endpoint	Method	Request Body	Response	Notes
/ai/chat	POST	{ user_id, message, context }	{ reply_text }	Returns AI-generated chat message.
/ai/workout	POST	{ user_id, family_member_id, goal, equipment, health_flags }	{ workout_plan }	Generates context-aware workout.
/ai/meal	POST	{ user_id, family_member_id, dietary_flags }	{ meal_plan }	Generates meal suggestions.
/ai/feedback	POST	{ user_id, family_member_id, activity_data }	{ feedback_text }	AI motivational/health feedback.
AI Logic

Prompt Templates: /services/ai-prompts.ts

Age-based safety rules:

Children ≤12 → bodyweight only, no HIIT.

Teens → moderate exercises.

Elders 50+ → low-impact, no jumping.

Health flag filtering:

Knee/back pain, pregnancy → remove high-risk exercises.

Equipment availability → generate home/gym friendly workouts.

Context Awareness: AI must consider:

User profile, family member profile

Logged activity (workout, meals, habits)

Environment & equipment

Bilingual Output: Swahili-first, fallback English.

Persistence: Every AI response stored in ai_conversations.

3️⃣ Data Persistence & Sync
Frontend Screens
Screen	Components	Notes
Dashboard	Activity rings, metrics cards	Fetch live data from DB.
Workout Logging	Exercise tracker, reps/duration input, “Save Workout”	Sync to backend.
Meal Logging	Food search, meal type selection, calories, “Save Meal”	Sync to backend.
Habit Logging	Water intake, sleep, steps, sitting	Sync to backend.
Family Profile Management	Add/remove family members, switch profiles	Updates family_members table.
Database Tables
Table	Columns	Notes
workout_logs	id, user_id, family_member_id, workout_plan_id, exercises_json, calories_burned, duration, created_at	Persist live workouts.
meal_logs	id, user_id, family_member_id, meal_type, foods_json, calories, created_at	Persist meal entries.
habit_logs	id, user_id, family_member_id, water_glasses, sleep_hours, steps_count, sitting_hours, created_at	Persist habits.
family_members	id, user_id, name, age, avatar_url, health_flags, created_at	Family profiles.
sync_queue	id, user_id, action_type, payload_json, status (pending/done), created_at	Stores offline actions to retry later.
APIs
Endpoint	Method	Request Body	Response	Notes
/logs/workout	POST	{ user_id, family_member_id, workout_log }	{ success: true }	Saves workout to DB.
/logs/meal	POST	{ user_id, family_member_id, meal_log }	{ success: true }	Saves meal to DB.
/logs/habit	POST	{ user_id, family_member_id, habit_log }	{ success: true }	Saves habits to DB.
/logs/family	POST	{ user_id, family_member_data }	{ success: true }	Add/update family profile.
/sync/queue	GET	{ user_id }	{ pending_actions }	Fetch pending offline actions.
/sync/queue	POST	{ action_type, payload }	{ success: true }	Push queued action after offline resolution.
Sync Logic

Offline Mode:

User actions stored in sync_queue with status pending.

Retry automatically when connectivity returns.

Conflict Resolution:

If same data updated from multiple devices → latest timestamp wins.

Real-Time Updates:

Optional: Supabase Realtime to push new workout/meal/habit logs to frontend dashboards.

✅ Summary of Full Implementation Mapping
Layer	Feature	Tables	APIs	Screens	AI Logic
Auth	Login, Logout, Forgot Password, Social Login	users, profiles, sessions	/auth/*	Login, Forgot Password, Settings	Optional secure password suggestion
AI Coach	Chat, Workout, Meal, Feedback	ai_conversations, workout_plans, meal_plans, ai_feedback_logs	/ai/*	AI Coach Chat, AI Workout Planner, AI Meal Planner	Prompt templates, health flag filtering, context-aware
Data Persistence	Workouts, Meals, Habits, Family	workout_logs, meal_logs, habit_logs, family_members, sync_queue	/logs/*, /sync/queue	Dashboard, Workout Logging, Meal Logging, Habit Logging, Family Management	Offline sync logic, real-time updates

This blueprint provides end-to-end mapping:

Every missing feature → table → API → frontend → AI logic (if applicable).

Supports offline-first sync, bilingual AI, family profiles, and secure authentication.

Can serve as a master implementation guide for your dev team.