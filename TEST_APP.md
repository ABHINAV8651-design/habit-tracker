# How to Test Your Application

## If deployed on Render

Your app URL will look like:
**https://futureme-ai-life-os.onrender.com**  
(or whatever name you gave the Web Service in Render)

### 1. Check the server is up (health)

Open in browser:
```
https://YOUR-APP-NAME.onrender.com/api/health
```
You should see JSON: `{"status":"ok","service":"futureme-ai-life-os","timestamp":"..."}`

- **If this fails or times out:** On Render free tier the service can **spin down** after inactivity. The first request after spin-down can take **30–60 seconds** (cold start). Wait and try again.
- **If you see the JSON:** The server is running. Go to step 2.

### 2. Open the app (home page)

Open in browser:
```
https://YOUR-APP-NAME.onrender.com/
```

You should see:
- Dark background
- “FutureMe AI – Life OS” heading
- “Sign in” and “Get started” buttons

- **If the page is blank:** Wait 10–20 seconds (cold start or JS loading), then refresh. If it’s still blank, open DevTools (F12) → Console and check for red errors.

### 3. Test the flow

1. Click **Get started** → register with email + password.
2. Complete **onboarding** (name, goal, etc.).
3. You should land on the **dashboard**.
4. Open **Habits** → add a habit → mark it done.

---

## If running locally

1. In the project folder run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```
2. Open: **http://localhost:3000**
3. Use the same flow as in step 3 above.

---

## Quick links (replace YOUR-APP-NAME with your Render service name)

| What              | URL                                              |
|-------------------|---------------------------------------------------|
| Health check      | `https://YOUR-APP-NAME.onrender.com/api/health`  |
| Home / landing    | `https://YOUR-APP-NAME.onrender.com/`             |
| Login             | `https://YOUR-APP-NAME.onrender.com/login`       |
| Register          | `https://YOUR-APP-NAME.onrender.com/register`    |
