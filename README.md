# Afya AI

**A health and fitness companion app with AI coaching, food tracking, meal planning, and workout guidance.**

![Status](https://img.shields.io/badge/status-active_development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)
![Stack](https://img.shields.io/badge/stack-React_%2F_Vite_%2F_Supabase-blue)

## What this is

Afya AI ("afya" — Swahili for health) is a personal health and fitness app combining an AI coach, food/meal tracking, workout sessions with form-check guidance, habit tracking, progress photos, family profiles, and a "School Mode" variant. It includes Supabase integration (migrations and edge functions present) and multi-language support.

[ADD SCREENSHOT HERE]

## Status: In active development

Most core screens are built out, and there's real Supabase wiring in place — but this has not been reviewed for data privacy/health-data handling compliance, which matters given the sensitive nature of health and fitness data. Do not treat as production-ready until that review happens.

### Roadmap
- Privacy/compliance review for health-data handling
- Verify which Supabase functions are live vs. scaffolded
- User testing on the AI coach and form-check features

## Quickstart

```bash
npm i
npm run dev
```

## Folder overview

- `src/components/` — feature screens (Dashboard, FoodTracking, WorkoutSession, MealPlanner, AICoach, etc.)
- `src/supabase/` — migrations and edge functions
- `src/services/` — data/service layer

## Contributing

See the [org-wide CONTRIBUTING.md](https://github.com/creova-gif/.github/blob/main/CONTRIBUTING.md) for guidelines, including our AI-assisted contribution policy.

## License

Proprietary — © CREOVA. All rights reserved.
