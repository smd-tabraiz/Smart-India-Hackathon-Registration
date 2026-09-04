# 🚀 Smart India Hackathon (SIH 2026) Registration Portal
### *Coders Club × Centre for Entrepreneurship (CIE)*
**G. Pulla Reddy Engineering College (Autonomous), Kurnool**

Official internal nomination and team registration platform for the **Smart India Hackathon (SIH 2026)**, developed and managed jointly by **Coders Club** and **Centre for Entrepreneurship (CIE)**.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔒 Security & Sensitive Data Protection](#-security--sensitive-data-protection)
- [🚀 Step-by-Step Render Deployment Guide](#-step-by-step-render-deployment-guide)
- [💻 Local Development Setup](#-local-development-setup)
- [⚙️ Environment Variables Reference](#️-environment-variables-reference)
- [📁 Project Structure](#-project-structure)
- [👩‍💻 Credits & Author](#-credits--author)

---

## ✨ Key Features

1. **Strict SIH Team Validation**:
   - Exactly 6 students per team.
   - **Mandatory Female Representation Rule**: At least 1 female (`F`) member per team.
   - Exactly 1 designated Team Leader.
   - Unique Roll Number deduplication across all team members and across the entire database.
2. **Authorized Branch Selection**:
   - Registration strictly restricted to 8 approved departments:
     - `CSE`
     - `CSE - (AI & ML)`
     - `CSE - (DS)`
     - `CSBS`
     - `ECE`
     - `EEE`
     - `MECH`
     - `CIVIL`
3. **Team Leader Portal**:
   - Secure leader account creation and login.
   - Clean printable roster view (optimized `print:hidden` styling so printing renders strictly the official 6-member team roster without headers or footers).
   - Instant access to official SIH PPT presentation format template and WhatsApp coordination group.
4. **Faculty & Admin Nomination Control**:
   - Dual administrator account authentication.
   - Search by student roll number, team name, team ID, leader email, or problem statement ID.
   - Filter by branch and academic year.
   - Live editable roster modal, team status updates, and team deletion/disqualification with cascading leader cleanup.
   - Real-time nomination statistics (total teams, total students, female participants, today's registrations).
5. **Google Sheets Integration**:
   - One-click navigation to the official Google Sheet: [SIH_registrations](https://docs.google.com/spreadsheets/d/1LHSq7l3zEeAtCKd8ZfqyDA7RJFcyMR541cljhQClUGY/edit?usp=sharing).
   - In-app Live Spreadsheet view with 1-click clipboard export formatted for Google Sheets.
6. **Dual Persistence & Offline Resilience**:
   - Operates with MongoDB Atlas.
   - Features an offline disk fallback store (`server/data/store.json`) with zero query timeouts (`bufferCommands: false`), ensuring 100% operational uptime.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React, React Router DOM v6, Axios
- **Backend**: Node.js (>=18), Express.js, Mongoose / MongoDB Atlas, JSON Web Tokens (JWT), BcryptJS
- **Security**: Helmet, Express Rate Limiter, CORS proxy protection, sanitized inputs
- **Deployment**: Render (Unified Web Service architecture)

---

## 🔒 Security & Sensitive Data Protection

> [!CAUTION]
> **NEVER commit `.env` or files containing secrets to GitHub or any public repository!**

The project is pre-configured with a strict `.gitignore` to prevent secret leaks:
- `server/.env` is **untracked** from git.
- `server/data/*.json` (containing real passwords and registrations) is **ignored**.
- Registration CSV/TSV dumps are **ignored**.

### Safe Workflow:
1. Only commit code files and `.env.example`.
2. Enter your actual passwords, database URLs, and API keys **strictly within the Render Dashboard** (Environment Variables section).

---

## 🚀 Step-by-Step Render Deployment Guide

This project is configured for **Render Single Web Service deployment**, where the Express backend serves both the API and the production-built React frontend. This eliminates CORS issues and runs completely on **Render's Free Tier**.

### Step 1: Push Code to GitHub

1. Open your terminal in the project root (`d:\sih_final`):
   ```bash
   git status
   ```
   *(Verify that `.env` and `store.json` are NOT listed in staged files).*

2. Add and commit all changes:
   ```bash
   git add .
   git commit -m "Prepare fullstack portal for Render deployment"
   ```

3. Push your branch to GitHub:
   ```bash
   git push origin main
   ```

---

### Step 2: Configure MongoDB Atlas Network Access

Before deploying on Render, ensure your MongoDB Atlas cluster allows incoming connections from Render's cloud servers:
1. Log in to **[MongoDB Atlas](https://cloud.mongodb.com/)**.
2. Navigate to **Security** -> **Network Access**.
3. Click **"+ Add IP Address"**.
4. Select **"Allow Access From Anywhere"** (`0.0.0.0/0`).
5. Click **Confirm**.

---

### Step 3: Create a New Web Service on Render

1. Log in to **[Render](https://dashboard.render.com/)**.
2. Click the **"New +"** button at the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and connect your GitHub repository.
4. Fill in the service configuration:

| Setting | Value |
| :--- | :--- |
| **Name** | `sih-2026-portal` *(or your preferred name)* |
| **Region** | Oregon (US West) or Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | *(Leave empty - defaults to root)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

### Step 4: Add Environment Variables in Render

Scroll down to the **"Environment Variables"** section in Render, click **"Add Environment Variable"**, and add the following keys:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production caching & static serving |
| `PORT` | `10000` | Port automatically set by Render |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/sih_portal` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `generate_any_secure_random_key_here` | Secret key for leader & admin tokens |
| `ADMIN_EMAIL` | `admin@codersclub.edu.in` | Primary admin username |
| `ADMIN_PASSWORD` | `your_secure_primary_password` | Primary admin password |
| `ADMIN_EMAIL_2` | `asmaeram006@gmail.com` | Secondary admin username |
| `ADMIN_PASSWORD_2` | `your_secure_secondary_password` | Secondary admin password |
| `SENDGRID_API_KEY` | *(Optional)* `SG.your_sendgrid_key` | For email confirmations |
| `SENDGRID_FROM_EMAIL` | `codersclub@gprec.ac.in` | Verified sender email |
| `SENDGRID_FROM_NAME` | `Coders Club & CIE SIH Portal` | Sender display name |
| `WHATSAPP_GROUP_LINK` | `https://chat.whatsapp.com/...` | Group link shown on leader dashboard |
| `PPT_TEMPLATE_URL` | `https://docs.google.com/presentation/...` | Official SIH PPT format |
| `LIVE_SPREADSHEET_URL`| `https://docs.google.com/spreadsheets/d/1LHSq7l3zEeAtCKd8ZfqyDA7RJFcyMR541cljhQClUGY/edit?usp=sharing` | Official Google Sheets sync sheet |

---

### Step 5: Deploy & Verify

1. Click **"Create Web Service"**.
2. Render will run `npm run build`:
   - Installs React client dependencies.
   - Compiles Vite production bundle into `client/dist`.
   - Installs Express server dependencies.
   - Starts Express server (`npm start`).
3. Once the build finishes and displays **"Your service is live 🎉"**, visit your assigned Render URL:
   `https://sih-2026-portal.onrender.com`
4. Test the live site:
   - Register a team with the new branches.
   - Log in to the Leader Dashboard and test printing the roster.
   - Log in to `/admin/login` using either admin account and verify the admin control dashboard.
   - Click **Live Excel Sheet** to verify that it opens the official Google Sheet.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/sih_website.git
cd sih_website

# Install all dependencies (both client and server)
npm run install:all
```

### 2. Configure Local Environment
Copy `.env.example` in the `server` directory to `.env`:
```bash
cp server/.env.example server/.env
```
Update `server/.env` with your credentials.

### 3. Run Locally
Run client and server concurrently in two terminal tabs:
```bash
# Tab 1: Start Backend (Port 5005)
cd server
npm run dev

# Tab 2: Start Frontend (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables Reference

A reference template is available in [`server/.env.example`](file:///d:/sih_final/server/.env.example).

```env
PORT=5005
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sih_portal
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@codersclub.edu.in
ADMIN_PASSWORD=your_primary_password
ADMIN_EMAIL_2=asmaeram006@gmail.com
ADMIN_PASSWORD_2=your_secondary_password
SENDGRID_API_KEY=SG.your_key
SENDGRID_FROM_EMAIL=codersclub@gprec.ac.in
SENDGRID_FROM_NAME=Coders Club & CIE SIH Portal
WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/your_link
PPT_TEMPLATE_URL=https://docs.google.com/presentation/d/...
LIVE_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/1LHSq7l3zEeAtCKd8ZfqyDA7RJFcyMR541cljhQClUGY/edit?usp=sharing
```

---

## 📁 Project Structure

```text
sih_final/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Favicon, logos, static PPT assets
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext (State & Session Management)
│   │   ├── pages/              # Home, Register, Login, Dashboard, AdminDashboard, LiveSpreadsheet, etc.
│   │   ├── services/           # Axios API Client (/api baseURL)
│   │   └── index.css           # Tailwind styles & Print directives
│   ├── package.json
│   └── vite.config.js          # Vite config with /api dev proxy
├── server/                     # Express.js Backend
│   ├── data/                   # store.json (Offline persistence fallback - gitignored)
│   ├── src/
│   │   ├── config/             # MongoDB Mongoose & LocalStore fallback
│   │   ├── controllers/        # Team, Auth, Admin, and Spreadsheet controllers
│   │   ├── middleware/         # Auth verification & Central error handling
│   │   ├── models/             # Team & User schemas
│   │   ├── routes/             # API routes (/api/auth, /api/teams, /api/admin, /api/spreadsheet)
│   │   └── server.js           # Express App (Serves API + Client in Production)
│   ├── .env.example            # Safe configuration template (No secrets)
│   └── package.json
├── .gitignore                  # Strict exclusion of .env, data, dumps & node_modules
├── package.json                # Root package.json for Render unified build
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
└── README.md                   # Project documentation & Deployment Guide
```

---

## 👩‍💻 Credits & Author

- **Platform Architecture & Development**: **Asma Eram** *(Full Stack Developer & Student Co-ordinator of CodersClub)*
- **Organizations**:
  - **Coders Club**, Department of Computer Science & Engineering
  - **Centre for Entrepreneurship (CIE)**
  - **G. Pulla Reddy Engineering College (Autonomous), Kurnool**
- **Contact**: `codersclub@gprec.ac.in` | `+91 74164 20488` / `+91 81064 71349`
