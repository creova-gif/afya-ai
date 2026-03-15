KUIMARISHA AI — Full World-Class Implementation Blueprint
4️⃣ Payments & Subscriptions
Frontend Screens
Screen	Components	Notes
Subscription Screen	Tier selection, feature list, subscribe button	Shows M-Pesa, Airtel, Tigopesa options.
Payment Confirmation	Transaction summary, receipt download	Shows success/failure, subscription expiry.
Premium Feature Lock	Lock overlay on premium-only workouts/meals	Checks subscription status.
Database Tables
Table	Columns	Notes
subscriptions	id, user_id, plan_type, start_date, end_date, status (active/inactive/canceled), payment_reference, created_at	Tracks user subscriptions.
transactions	id, user_id, amount, method, status, reference_code, created_at	Tracks all payments.
APIs
Endpoint	Method	Request Body	Response	Notes
/payments/initiate	POST	{ user_id, plan_type, method }	{ payment_url, transaction_id }	Generate payment request.
/payments/verify	POST	{ transaction_id }	{ success, subscription_status }	Verify payment completion.
/subscriptions/status	GET	{ user_id }	{ subscription_status, plan_type, expires_at }	Check access for premium features.
Logic

Verify subscription before premium workout/meal access.

Trigger renewal notifications via push notifications.

Handle failed/expired payments gracefully.

5️⃣ Push Notifications & Engagement
Frontend Screens
Screen	Components	Notes
Settings	Notification toggles for workout, meals, streaks	User can customize notifications.
Notification Pop-up	Inline banner, modal	Click navigates to relevant screen.
Database Tables
Table	Columns	Notes
notifications	id, user_id, type, content, status (sent/delivered/read), created_at	Store sent notifications.
notification_settings	id, user_id, type, enabled	User preferences for each notification type.
APIs
Endpoint	Method	Request Body	Response	Notes
/notifications/send	POST	{ user_id, type, content }	{ success }	Send push notifications.
/notifications/settings	GET/POST	{ user_id, type, enabled }	{ settings }	Retrieve/update notification preferences.
Logic

Trigger notifications on:

Workout reminders (scheduled by user)

Water intake reminders

Meal logging reminders

Streak completions, achievements

Integrate Firebase Cloud Messaging (FCM) or OneSignal.

6️⃣ Wearable & Device Integration
Frontend Screens
Screen	Components	Notes
Device Sync	Connect wearable, sync status, last synced	Apple Health, Google Fit, Fitbit.
Activity Dashboard	Shows real-time steps, heart rate, sleep	Merges wearable and manual logging.
Database Tables
Table	Columns	Notes
devices	id, user_id, device_type, device_token, connected_at	Stores linked wearable devices.
device_metrics	id, user_id, family_member_id, steps, heart_rate, sleep_hours, calories_burned, recorded_at	Real-time metrics from wearables.
APIs
Endpoint	Method	Request Body	Response	Notes
/devices/connect	POST	{ user_id, device_type, oauth_token }	{ success }	Link wearable account.
/devices/metrics	GET	{ user_id, device_id, date_range }	{ metrics }	Fetch synced data.
Logic

Merge wearable data with AI Coach for personalized advice.

Sync automatically or on-demand.

Handle offline logging to sync queue if wearable unavailable.

7️⃣ Social & Gamification
Frontend Screens
Screen	Components	Notes
Friends List	Add friends, progress overview	Show achievements & stats.
Leaderboards	Global, regional, school, age group	Rankings based on workouts, streaks, challenges.
Challenges	Join weekly/monthly challenges, team challenges	Display progress and rewards.
Activity Feed	Updates on friends’ workouts, achievements	Scrollable feed, images & badges.
Share Progress	Share badges/workouts to WhatsApp, Instagram	Uses OS-level share sheet.
Database Tables
Table	Columns	Notes
friends	id, user_id, friend_user_id, status (pending/accepted)	Tracks friend connections.
challenges	id, name, type, participants_json, start_date, end_date, rewards_json	Tracks ongoing/finished challenges.
leaderboards	id, user_id, points, rank_type (global/regional/school/age_group), updated_at	Stores computed leaderboard standings.
activity_feed	id, user_id, type (workout/achievement), content, created_at	User-visible social feed.
APIs
Endpoint	Method	Request Body	Response	Notes
/friends/add	POST	{ user_id, friend_email }	{ status }	Invite friend.
/challenges/join	POST	{ user_id, challenge_id }	{ success }	Join a challenge.
/leaderboards/get	GET	{ rank_type, user_id }	{ leaderboard_list }	Fetch rankings.
/activity-feed	GET/POST	{ user_id, type, content }	{ feed_items }	Show social updates.
Logic

Apply age/health safety rules in challenges (children ≤12 cannot join HIIT challenges).

Reward points for completion, streaks, and milestones.

Push notifications when friends complete workouts.

8️⃣ Camera & AI Form Check / Progress Photos
Frontend Screens
Screen	Components	Notes
Form Check Camera	Live camera view, overlay skeleton for posture	Provides real-time feedback.
Progress Photos	Upload photos, compare before/after	Optional AI body analysis.
Database Tables
Table	Columns	Notes
progress_photos	id, user_id, family_member_id, photo_url, taken_at	Stores photos in cloud storage.
form_feedback	id, user_id, exercise_id, feedback_json, created_at	Stores AI-assessed exercise form feedback.
APIs
Endpoint	Method	Request Body	Response	Notes
/form-check/analyze	POST	{ user_id, exercise_id, video_stream }	{ corrections, score }	Returns posture corrections.
/progress-photos/upload	POST	{ user_id, family_member_id, photo_file }	{ photo_url }	Stores photo and metadata.
/progress-photos/list	GET	{ user_id, family_member_id }	{ photos[] }	Fetch uploaded photos.
Logic

Use TensorFlow.js / MediaPipe for real-time pose detection.

AI analyzes exercise form and counts reps.

AI provides feedback: “Knees too bent, straighten back” (bilingual).

Progress photos can be combined with AI body composition estimation.

9️⃣ Meal Logging & Recipe Database
Frontend Screens
Screen	Components	Notes
Meal Logging	Food search, add custom foods, add photos	Syncs with Tanzanian food DB.
Recipe Database	Browse recipes, nutrition info, cooking instructions	Link to meal planner & shopping list.
Meal Planner	Weekly calendar view, auto-generate meals	Personalized via AI Coach.
Database Tables
Table	Columns	Notes
foods	id, name, calories, protein, carbs, fat, portion_size, swahili_name	Tanzanian food DB.
meal_logs	Already defined, linked to foods table	Persisted per user/family member.
recipes	id, name, ingredients_json, steps_json, nutrition_json, image_url	Meal instructions and nutritional data.
shopping_list	id, user_id, items_json, generated_from_recipes	Grocery items for weekly planning.
APIs
Endpoint	Method	Request Body	Response	Notes
/foods/search	GET	{ query, language }	{ foods[] }	Search Tanzanian foods.
/recipes/list	GET	{ filters: dietary_flags, age_group }	{ recipes[] }	Browse recipes.
/meal-planner/generate	POST	{ user_id, family_member_id, goal, dietary_flags }	{ meal_plan }	AI-generated weekly meal plan.
/shopping-list/generate	POST	{ user_id, selected_recipes }	{ shopping_list }	Auto-generated grocery list.
Logic

AI generates meals respecting calories, dietary flags, and preferences.

Optional photo logging with AI-calorie estimation.

Recipes linked to family members’ nutritional goals.

10️⃣ Advanced UX & Personalization
Feature	Implementation Notes
Profile Pictures	Camera/crop upload → update profiles.avatar_url.
Customizable Dashboard	Rearrangeable widgets → store layout in profiles.dashboard_config.
Dark/Light Mode Toggle	Store preference in profiles.theme_preference.
Multiple Languages	Add new languages table → UI translation files → profiles.language_preference.
Calendar View	Workouts & meals scheduled → synced with device calendar via APIs.
11️⃣ Advanced Analytics & Reporting
Database Tables
Table	Columns	Notes
analytics_logs	id, user_id, type (workout/meal/habit), data_json, created_at	Raw data for analysis.
reports	id, user_id, type (pdf/csv), content_url, generated_at	Stores exported reports.
APIs
Endpoint	Method	Request Body	Response	Notes
/analytics/progress	GET	{ user_id, date_range, type }	{ charts, predictions }	Advanced analytics.
/reports/export	POST	{ user_id, format, date_range }	{ file_url }	Generate PDF/CSV reports.
Logic

Trend analysis for body composition, calorie intake, workouts.

AI-based predictions for goal achievement.

Exportable for schools, gyms, or personal tracking.

✅ Summary — Complete End-to-End Mapping
Module	Tables	APIs	Frontend Screens	AI/Logic
Auth	users, profiles, sessions	/auth/*	Login, Forgot Password, Settings	Optional password suggestions
AI Coach	ai_conversations, workout_plans, meal_plans, ai_feedback_logs	/ai/*	AI Chat, AI Workout/Meal Planner	Prompt templates, context-aware, health flags
Data Persistence	workout_logs, meal_logs, habit_logs, family_members, sync_queue	/logs/*, /sync/queue	Dashboards, Logging Screens	Offline sync, real-time updates
Payments	subscriptions, transactions	/payments/, /subscriptions/	Subscription, Payment Confirmation, Premium Lock	Feature gating, payment verification
Notifications	notifications, notification_settings	/notifications/*	Settings, Notification Pop-ups	Push triggers for engagement
Wearables	devices, device_metrics	/devices/*	Device Sync, Activity Dashboard	Auto-sync, AI advice integration
Social & Gamification	friends, challenges, leaderboards, activity_feed	/friends/, /challenges/, /leaderboards/*, /activity-feed	Friends, Leaderboards, Challenges, Activity Feed, Share	Points, badges, safety rules
Camera/AI Form	progress_photos, form_feedback	/form-check/, /progress-photos/	Form Check Camera, Progress Photos	Pose detection, rep counting, feedback
Meal/Recipe	foods, recipes, meal_logs, shopping_list	/foods/, /recipes/, /meal-planner/, /shopping-list/	Meal Logging, Recipe Browser, Meal Planner	AI meal generation, calorie estimation
UX & Personalization	profiles.dashboard_config, profiles.avatar_url, profiles.theme_preference	/profiles/*	Dashboard, Profile Screens, Calendar View	Layout customization, theme, multi-language
Analytics & Reporting	analytics_logs, reports	/analytics/, /reports/	Analytics Dashboard, Export Reports	Trend analysis, AI predictions, goal tracking

💡 Verdict:
Following this blueprint, your dev team can implement every feature: from login → AI coaching → workout/meal logging → social + gamification → wearable sync → advanced AI.

The app will then be production-ready, scalable, Tanzanian-market optimized, and world-class, ready for schools, gyms, and families.