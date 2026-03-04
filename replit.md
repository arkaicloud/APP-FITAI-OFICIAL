# FIT.AI - Fitness Training App

## Overview
FIT.AI is a mobile-first fitness app with AI coaching capabilities. Built with React (Vite) frontend and Express backend. Uses Replit Auth for Google authentication and PostgreSQL for data persistence.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Auth**: Replit Auth (OpenID Connect - supports Google, GitHub, etc.)
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (client-side)
- **State Management**: TanStack React Query

## Database Schema
- `users` - Auth users (managed by Replit Auth)
- `sessions` - Auth sessions (managed by Replit Auth)
- `user_profiles` - User fitness profile data (weight, height, age, body fat, goal, trial/subscription status)

## Pages & Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Login | Google login with FIT.AI branding, auto-redirects if already logged in |
| `/onboarding` | Onboarding | Coach AI collects user profile data (goal, weight, height, age, body fat) |
| `/trial` | TrialBanner | 7-day free trial offer, R$17/month premium plan |
| `/home` | Home | Dashboard with greeting, consistency tracker & today's workout |
| `/treino-hoje` | TodayWorkout | Exercise list for current workout |
| `/plano` | TrainingPlan | Weekly training plan overview |
| `/dia/:day` | DayWorkout | Specific day's exercises with "Iniciar Treino" |
| `/evolucao` | Evolution | Progress stats, streak, consistency heatmap |
| `/ai` | AICoach | Full-page AI coach chat interface |
| `/perfil` | Profile | User profile with real data from database |

## Auth Flow
1. User clicks "Fazer login com Google" -> `/api/login` (Replit Auth)
2. After auth -> redirect to `/` -> auto-redirect to `/home` (if profile exists) or `/onboarding` (new user)
3. Onboarding collects data -> saves to `user_profiles` table -> shows trial banner
4. Trial banner -> enter app

## API Routes
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/profile` - Get user fitness profile
- `POST /api/profile` - Create/update user fitness profile
- `GET /api/trial-status` - Check trial/subscription status
- `GET /api/login` - Start login flow
- `GET /api/logout` - Logout
- `GET /api/callback` - Auth callback

## Key Components
- `BottomNav` - Bottom navigation bar (Home, Plano, AI, Evolucao, Perfil)
- `CoachAIChat` - Slide-up modal chat with Coach AI

## File Structure
```
client/src/
  pages/       - All page components
  components/  - Shared components (BottomNav, CoachAIChat, ui/)
  hooks/       - Custom hooks (use-auth, use-toast, use-mobile)
  lib/         - Utilities (queryClient, utils, auth-utils)
client/public/figmaAssets/ - Static assets from Figma
server/
  index.ts     - Express server entry
  routes.ts    - API routes
  storage.ts   - DatabaseStorage implementation
  db.ts        - Database connection (Drizzle + pg)
  vite.ts      - Vite dev server setup
  replit_integrations/auth/ - Replit Auth module
shared/
  schema.ts    - Re-exports models + user_profiles table
  models/auth.ts - Users & sessions tables (Replit Auth)
```

## Running
- `npm run dev` starts both backend (Express) and frontend (Vite) on port 5000
- `npm run db:push` to sync database schema
