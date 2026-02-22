# FutureMe AI – Life OS

A full-stack AI-powered life optimization and habit tracking web app: personal life OS, success dashboard, fitness + productivity tracker, dream life projection engine, and AI self-improvement assistant.

## Tech stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, ShadCN-style UI, Framer Motion, Recharts
- **Backend:** Next.js API routes, PostgreSQL (Prisma), JWT auth, bcrypt
- **AI:** OpenAI API for insights and suggestions

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – Secret for JWT signing (use a long random string in production)
- `OPENAI_API_KEY` – OpenAI API key (for AI Insights page)

### 3. Database

```bash
npx prisma generate
npx prisma db push
```

(Or use `prisma migrate dev` for migrations.)

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` – Landing
- `/login`, `/register` – Auth
- `/onboarding` – First-time onboarding (goal, schedule, fitness, dream life)
- `/dashboard` – Main dashboard (habits, streak, scores, water/calories, weekly graph, heatmap)
- `/habits` – Create and track habits; toggle today’s completion (with sound)
- `/fitness` – Workouts, water, calories, protein
- `/productivity` – Pomodoro timer, focus minutes, tasks, distractions
- `/analytics` – Weekly/monthly charts, most consistent / weakest habit
- `/ai-insights` – Generate AI suggestions from your data
- `/future-self` – Projected outcomes at 3m, 6m, 1y, 3y
- `/settings` – Theme (dark/light), notifications
- `/profile` – User info and gamification (XP, level, discipline score)

## Features

- **Auth:** Register, login, JWT in HTTP-only cookie, onboarding
- **Habits:** Unlimited habits, types (Study, Gym, Water, etc.), frequency, priority, streak & consistency
- **Fitness:** Workout log, water/calories/protein
- **Productivity:** Pomodoro, focus time, tasks, distractions, score
- **AI:** Structured prompts with user data for habit/schedule/fitness/productivity suggestions
- **Future projection:** Consistency-based projections (body, skills, productivity, success %, dream alignment)
- **Gamification:** XP, level, discipline score (foundation for badges/achievements)
- **UI:** Dark/light theme, glass-style cards, Framer Motion, Recharts

## After generation

You can ask to:

- Refactor for performance and optimize UI
- Improve animation smoothness
- Polish UI to premium Apple-level
- Improve AI suggestion accuracy
- Make the Future Projection engine more realistic

## License

MIT
