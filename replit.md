# FIT.AI - Fitness Training App

## Overview
FIT.AI is a mobile-first fitness app with AI coaching capabilities. Built with React (Vite) frontend and Express backend.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Routing**: wouter (client-side)
- **State Management**: TanStack React Query
- **Storage**: In-memory (MemStorage) - ready for database integration

## Pages & Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Login | Google login with FIT.AI branding |
| `/onboarding` | Onboarding | Coach AI welcome chat sequence |
| `/home` | Home | Dashboard with consistency tracker & today's workout |
| `/treino-hoje` | TodayWorkout | Exercise list for current workout |
| `/plano` | TrainingPlan | Weekly training plan overview |
| `/dia/:day` | DayWorkout | Specific day's exercises with "Iniciar Treino" |
| `/evolucao` | Evolution | Progress stats, streak, consistency heatmap |
| `/ai` | AICoach | Full-page AI coach chat interface |
| `/perfil` | Profile | User profile with body stats |

## Key Components
- `BottomNav` - Bottom navigation bar (Home, Plano, AI, Evolução, Perfil)
- `CoachAIChat` - Slide-up modal chat with Coach AI

## File Structure
```
client/src/
  pages/       - All page components
  components/  - Shared components (BottomNav, CoachAIChat, ui/)
  hooks/       - Custom hooks
  lib/         - Utilities (queryClient, utils)
client/public/figmaAssets/ - Static assets from Figma
server/        - Express backend (routes, storage, vite setup)
shared/        - Shared schema types
```

## Running
- `npm run dev` starts both backend (Express) and frontend (Vite) on port 5000
