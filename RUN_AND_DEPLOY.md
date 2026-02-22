# How to Run & Deploy FutureMe AI – Life OS

## Prerequisites

- **Node.js 18+** and npm ([nodejs.org](https://nodejs.org))
- **PostgreSQL** (local or cloud)
- **Git** (for deployment)

---

## 1. Run locally

### Step 1: Install dependencies

```bash
cd "c:\Users\DELL\habit tracker"
npm install
```

### Step 2: Environment variables

Copy the example env file and edit it:

```bash
copy .env.example .env
```

Edit `.env` and set:

- **DATABASE_URL** – PostgreSQL connection string  
  - Local example: `postgresql://postgres:password@localhost:5432/futureme`
  - Or use a free DB: [Neon](https://neon.tech) / [Supabase](https://supabase.com) and paste their connection string.
- **JWT_SECRET** – Any long random string (e.g. `my-super-secret-key-change-me`)
- **OPENAI_API_KEY** – Your OpenAI API key (optional; needed only for **AI Insights**)

### Step 3: Database setup

```bash
npx prisma generate
npx prisma db push
```

### Step 4: Start the app

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

**One-shot setup (Windows):** From the project folder you can run:

- **PowerShell:** `.\setup-and-run.ps1`
- **CMD:** `setup-and-run.cmd`

These install deps, create `.env` from `.env.example` if missing, run `prisma generate`, `prisma db push`, then `npm run dev`. Edit `.env` and set `DATABASE_URL` before running if you have PostgreSQL ready.

### Quick test

1. Click **Get started** → register with email/password.
2. Complete **onboarding** (name, goal, schedule, etc.).
3. You’ll land on the **dashboard**.
4. Go to **Habits** → add a habit → tick it done (you’ll hear a short success sound).
5. Try **Fitness**, **Productivity** (Pomodoro), **AI Insights**, **Future Self**.

---

## 2. Deploy on Render with GitHub

### A. Push code to GitHub

From the project folder:

```bash
cd "c:\Users\DELL\habit tracker"

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ABHINAV8651-design/habit-tracker.git
git push -u origin main
```

(Use your GitHub username/password or a **Personal Access Token** when prompted.)

### B. Create PostgreSQL on Render

1. Go to [dashboard.render.com](https://dashboard.render.com).
2. **New +** → **PostgreSQL**.
3. Name: `habit-tracker-db`, Region: pick one, Plan: **Free**.
4. Create. Copy the **Internal Database URL** (or **External** if you prefer).

### C. Create Web Service

1. **New +** → **Web Service**.
2. Connect **GitHub** and select repo: **ABHINAV8651-design/habit-tracker**.
3. Settings:
   - **Name:** `futureme-ai-life-os` (or any name).
   - **Region:** same as DB.
   - **Branch:** `main`.
   - **Runtime:** Node.
   - **Build command:**  
     `npm install && npx prisma generate && npm run build`
   - **Start command:**  
     `npm start`
   - **Instance type:** Free (or paid if you prefer).

4. **Environment** (Add Environment Variable):
   - `DATABASE_URL` = (paste PostgreSQL URL from step B).
   - `JWT_SECRET` = (long random string, e.g. from [randomkeygen.com](https://randomkeygen.com)).
   - `OPENAI_API_KEY` = (your OpenAI key; optional, for AI Insights).

5. Click **Create Web Service**.

Render will build and deploy. When the build succeeds, open the service URL (e.g. `https://futureme-ai-life-os.onrender.com`).

### D. Run migrations on Render (first deploy)

After the first deploy, run migrations once using **Shell** in the Render dashboard:

1. Open your **Web Service** → **Shell** tab.
2. Run:

```bash
npx prisma db push
```

Then refresh your app URL.

---

## 3. Optional: Deploy using Render Blueprint

If you use the included `render.yaml`:

1. In Render: **New +** → **Blueprint**.
2. Connect the same GitHub repo.
3. Render will create the **PostgreSQL** database and **Web Service** from the blueprint.
4. In the **Web Service** → **Environment**, add:
   - `JWT_SECRET` (generate or paste).
   - `OPENAI_API_KEY` (optional).

Then open the service URL and run `npx prisma db push` in the Shell as in step D above.

---

## Summary

| Task              | Command / action |
|-------------------|-------------------|
| Run locally       | `npm install` → set `.env` → `npx prisma db push` → `npm run dev` |
| Push to GitHub    | `git init`, `git add .`, `git commit -m "first commit"`, `git branch -M main`, `git remote add origin https://github.com/ABHINAV8651-design/habit-tracker.git`, `git push -u origin main` |
| Deploy on Render  | Create PostgreSQL → Create Web Service → set env vars → after deploy run `npx prisma db push` in Shell |

If something fails, check: Node version (18+), correct `DATABASE_URL`, and that **Build** and **Start** commands on Render match the ones above.
