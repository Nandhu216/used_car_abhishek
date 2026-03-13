## Deployment Guide (Vercel + Render + MongoDB Atlas)

This document explains how to deploy your **Used Car Marketplace (MERN)** using:
- **MongoDB Atlas** for the database
- **Render** for the backend API
- **Vercel** for the frontend

The goal is:
- One shared **Atlas cluster**
- One **Render Web Service** for `server/`
- One **Vercel Project** for `client/`
- Simple **CORS** controlled only via environment variables

---

## 1. Prerequisites

- A GitHub repository with this project (root folder containing `client/` and `server/`)
- Accounts on:
  - [MongoDB Atlas](https://www.mongodb.com/atlas)
  - [Render](https://render.com)
  - [Vercel](https://vercel.com)
- Node.js installed locally (for testing before you deploy)

---

## 2. MongoDB Atlas Setup

1. **Create a Cluster**
   - Log in to Atlas.
   - Click **Build a Database** → choose **Free** tier.
   - Select any region close to your audience and create the cluster.

2. **Create a Database User**
   - In Atlas, go to **Database Access**.
   - Click **Add New Database User**.
   - Set:
     - **Username**: something like `appuser`
     - **Password**: generate a strong password (save it in a safe place).
   - Set privileges to `Read and write to any database` (for this project that is fine).

3. **Allow Network Access**
   - Go to **Network Access** → **IP Access List**.
   - For simplicity during development, you can add:
     - `0.0.0.0/0` (allows all IPs).  
       - This is OK for a student project, but not for production.

4. **Get Connection String**
   - Go to **Database** → your cluster → **Connect** → **Connect your application**.
   - Copy the **connection string**, it will look like:

     ```text
     mongodb+srv://appuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/used-car-marketplace?retryWrites=true&w=majority
     ```

   - Replace `YOUR_PASSWORD` with the real password.
   - Replace `used-car-marketplace` with your desired **database name** if needed.

You will use this value as `MONGO_URI` in Render.

---

## 3. Backend Deployment on Render

The backend is in the `server/` folder.

### 3.1. Prepare the Backend for Deployment

You already have:
- `server/server.js` with CORS using `FRONTEND_URL`
- `server/package.json` with `start` script

**Important CORS line (already in code):**

```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

This means:
- Locally: frontend is allowed from `http://localhost:5173`.
- On Render: you will set `FRONTEND_URL` in Render dashboard to your **Vercel URL**.

### 3.2. Create a Render Web Service

1. Go to [Render dashboard](https://dashboard.render.com/).
2. Click **New** → **Web Service**.
3. Choose **Build from a Git repository**.
4. Connect your GitHub and select your project repo.
5. In the **Root Directory / Service Settings**:
   - **Root directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: leave default or set:

     ```bash
     npm install
     ```

   - **Start Command**:

     ```bash
     npm start
     ```

6. Click **Create Web Service**.

Render will now install dependencies and start your Express server.

### 3.3. Configure Environment Variables on Render

In your Render Web Service settings, go to **Environment → Environment Variables** and add:

- **`NODE_ENV`**: `production`
- **`PORT`**: `10000` (Render usually sets this automatically; if they mention a specific port, you can omit this and let Render handle it.)
- **`MONGO_URI`**: your Atlas connection string from step 2
- **`JWT_SECRET`**: any strong random string (e.g. `some-long-random-secret`)
- **`FRONTEND_URL`**: your **Vercel frontend URL** (you will know it after Vercel deploys; you can temporarily leave this as `http://localhost:5173` while testing, then change it)

> You can come back later and update `FRONTEND_URL` without touching the code or Git. That is exactly why this CORS setup was used.

### 3.4. Get Your Backend URL

After Render finishes the first deploy:
- You will see a URL like:

  ```text
  https://your-app-name.onrender.com
  ```

All API routes are under `/api`, for example:
- `https://your-app-name.onrender.com/api/auth/login`
- `https://your-app-name.onrender.com/api/cars`

You will use this base URL in the frontend configuration.

---

## 4. Frontend Deployment on Vercel

The frontend is in the `client/` folder and is built with **Vite + React**.

### 4.1. Frontend API Base URL

In `client/src/api/client.js` the base URL is:

```js
const API_PREFIX = import.meta.env.VITE_API_BASE_URL || "/api";
```

- **Development (local)**:
  - `VITE_API_BASE_URL` can be left **unset**.
  - Vite dev server will use `/api` and your existing proxy in `vite.config.js` should forward requests to `http://localhost:5000`.
- **Production (Vercel)**:
  - You **must set** `VITE_API_BASE_URL` to your Render backend URL with `/api` suffix, e.g.:

    ```text
    https://your-app-name.onrender.com/api
    ```

This way the frontend will call the correct backend in production.

### 4.2. Create a Vercel Project

1. Go to [Vercel](https://vercel.com/).
2. Click **New Project**.
3. Import your GitHub repo.
4. In the project configuration:
   - **Root Directory**: set to `client`
   - Vercel will auto-detect **Vite** and set:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

### 4.3. Configure Environment Variables on Vercel

In your Vercel project:

1. Go to **Settings → Environment Variables**.
2. Add:
   - **`VITE_API_BASE_URL`**:
     - **Value**: your Render backend base URL including `/api`, for example:

       ```text
       https://your-app-name.onrender.com/api
       ```
     - **Environment**: `Production` (and optionally `Preview` if you want)

3. Save the variables and **redeploy** if necessary.

### 4.4. First Deploy on Vercel

1. After environment variables are set, trigger a deployment:
   - Either push a new commit to GitHub
   - Or click **Deploy** from the Vercel dashboard.
2. Wait for the build to finish.
3. Vercel will give you a URL like:

   ```text
   https://your-frontend-name.vercel.app
   ```

4. Copy this URL and go back to **Render** and set:
   - `FRONTEND_URL = https://your-frontend-name.vercel.app`

5. Redeploy or restart the Render service so it picks up the new environment variable.

---

## 5. CORS and Cookies / Credentials

You have already configured:

```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

Notes:
- **`origin`**:
  - In development, this falls back to `http://localhost:5173`.
  - In production, `process.env.FRONTEND_URL` (from Render) must be your Vercel URL.
- **`credentials: true`**:
  - Allows cross-site cookies / auth headers if you use them.
  - On the frontend, when using `fetch`, if you ever use cookies you must add `credentials: "include"`; currently you use JWT in headers, so this mainly keeps the door open if you extend later.

If you ever change your Vercel domain (e.g. custom domain), **only update `FRONTEND_URL` in Render**; no code change is needed.

---

## 6. Local Development vs Production Summary

- **Local Development**
  - Backend: `npm run dev` in `server/` (or equivalent)
  - Frontend: `npm run dev` in `client/`
  - CORS origin: `http://localhost:5173`
  - API base URL (`API_PREFIX`): `/api` (proxied by Vite to `http://localhost:5000`)

- **Production**
  - Backend (Render): `https://your-app-name.onrender.com`
  - Frontend (Vercel): `https://your-frontend-name.vercel.app`
  - CORS origin: `FRONTEND_URL` on Render (set to Vercel URL)
  - API base URL in frontend: `VITE_API_BASE_URL` on Vercel (set to `https://your-app-name.onrender.com/api`)

---

## 7. Quick Checklist

1. **MongoDB Atlas**
   - [ ] Cluster created
   - [ ] Database user created
   - [ ] IP access configured
   - [ ] `MONGO_URI` ready

2. **Render (Backend)**
   - [ ] Web Service created with root `server`
   - [ ] `MONGO_URI` set
   - [ ] `JWT_SECRET` set
   - [ ] `FRONTEND_URL` set (first `http://localhost:5173`, later Vercel URL)
   - [ ] Deploy successful, API reachable at `/api/health`

3. **Vercel (Frontend)**
   - [ ] Project created with root `client`
   - [ ] `VITE_API_BASE_URL` set to `https://your-app-name.onrender.com/api`
   - [ ] Deploy successful, home page loads

4. **Final CORS Check**
   - [ ] From the Vercel site, login / register / APIs all work without CORS errors in browser console.

If you see CORS errors:
- Double-check `FRONTEND_URL` in Render matches **exactly** the URL you are opening in the browser (including `https` and domain).
- Ensure the frontend is using the correct `VITE_API_BASE_URL`.

