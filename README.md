# 🚀 SIH 2026 Team Registration Portal

<div align="center">

![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue?style=for-the-badge&logo=rocket)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![ngrok](https://img.shields.io/badge/ngrok-Public%20Tunnel-1F1E37?style=for-the-badge&logo=ngrok)

**A complete MERN stack portal for Smart India Hackathon 2026 team registration, internal nomination, and evaluation.**  
**Organized by Coders' Club in collaboration with Centre for Entrepreneurship (CIE).**

---

### 👩‍💻 Developed By
**Asma Eram** — *Full Stack Developer*

---

[🌐 Live Public Portal](https://bunny-quote-game.ngrok-free.dev) • [📊 Live Excel Spreadsheet](https://bunny-quote-game.ngrok-free.dev/spreadsheet) • [🔐 Admin Control Panel](https://bunny-quote-game.ngrok-free.dev/admin/login) • [📑 SIH PPT Template](https://bunny-quote-game.ngrok-free.dev/ppt-template)

</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Club Collaboration & Branding](#club-collaboration--branding)
- [Website URL Path Addresses](#website-url-path-addresses)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables (.env)](#environment-variables-env)
- [Running the Application](#running-the-application)
- [ngrok Public Access](#ngrok-public-access)
- [Admin Credentials](#admin-credentials)
- [API Endpoints](#api-endpoints)
- [Email Delivery System](#email-delivery-system)
- [Mobile Responsiveness](#mobile-responsiveness)
- [GitHub Repository Setup](#github-repository-setup)
- [License & Credits](#license--credits)

---

## 🎯 About the Project

The **SIH 2026 Team Registration Portal** is a production-grade full-stack platform designed to streamline student team registrations for the Smart India Hackathon 2026 internal nominations.

### 📜 Mandatory SIH Rules Enforced:
- ✅ **Strict Team Size**: Exactly **6 members** per team.
- ✅ **Gender Diversity Rule**: At least **1 female student** is required in every team of 6.
- ✅ **Leader Designation**: Exactly **1 member** designated as the Team Leader.
- ✅ **Unique Roll Numbers**: Real-time cross-checking prevents duplicate roll number registrations across teams.
- ✅ **Auto-Generated Team ID**: Standardized server-generated format `SIH26-CC-XXXX`.
- ✅ **Data Integrity**: Team leaders cannot modify members after submission to ensure fair evaluation by CIE and faculty mentors.

---

## ✨ Key Features

### 👨‍🎓 Student & Team Leader Features
- **4-Step Intuitive Registration Wizard**:
  - *Step 1*: Team Name, Problem Statement ID, Team Leader Email & Password.
  - *Step 2*: Detailed information for all 6 members (Name, Roll No, Year, Branch, Gender, Category, Leader selection).
  - *Step 3*: Comprehensive review card with scroll-to-error validation before final submission.
  - *Step 4*: Registration success card with generated Team ID, instant online confirmation slip, and WhatsApp group link.
- **Smart Auto-Scroll Error Validation**: Automatically scrolls down directly to any invalid fields when clicking "Review".
- **Confirmation Email**: Automatic email sent to Team Leader with complete team list, verification details, and WhatsApp community link.
- **Team Leader Dashboard (`/dashboard`)**: View team registration details, status, member roster, and print registration cards.
- **SIH PPT Template Page (`/ppt-template`)**: Interactive 6-slide preview and direct 1-click download of the official `SIH2026-IDEA-Presentation-Format.pptx` (924 KB).

### 🔐 Faculty & Admin Control Features
- **Secure Admin Portal (`/admin/login`)**: Protected by JWT authentication and faculty credentials.
- **Admin Nomination Dashboard (`/admin/dashboard`)**:
  - Live statistics (total teams, total students, gender distribution, branch breakdown).
  - Search by team name, team ID, or problem statement ID.
  - Filter registrations by Branch, Year, and Gender.
  - View full member roster, update details, or delete entries.
  - **1-Click CSV Export** of all registered teams and student data for SIH submission.

### 📊 Real-Time Live Excel Spreadsheet (`/spreadsheet`)
- Synchronized with MongoDB Atlas.
- Editable grid with formula bar and cell selection.
- **Mobile Cards View** toggle optimized for mobile phones.
- Export to CSV and instant link sharing.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Single Page Application with fast HMR |
| **Styling** | Tailwind CSS | Modern dark UI with slate, cyan, and blue accents |
| **Routing** | React Router v6 | Client-side routing with protected routes |
| **Icons** | Lucide React | Clean, scalable vector icons |
| **HTTP Client** | Axios | REST API communication with JWT interceptors |
| **Backend** | Node.js, Express.js | Modular RESTful API |
| **Database** | MongoDB Atlas, Mongoose | Cloud NoSQL database with in-memory fallback |
| **Auth** | JWT, bcryptjs | Encrypted passwords and stateless token auth |
| **Email** | Nodemailer | Gmail SMTP service + Ethereal sandbox fallback |
| **Tunnel** | ngrok | Secure TLS public domain tunneling |

---

## 🏛️ Club Collaboration & Branding

This portal is jointly managed by:
- **Coders' Club** (`/cc_logo.jpg`): Promoting competitive coding, algorithmic skills, and hackathon culture.
- **Centre for Entrepreneurship (CIE)** (`/cie_logo.jpg`): Incubation center supporting student innovation, startup prototypes, and patents.

Both official club logos are featured across the Navigation Bar, Team Dashboard, Admin Dashboard, and Footer.

---

## 🌐 Website URL Path Addresses

### 🔗 Public Live URLs (via ngrok)
| Page / Resource | Public URL | Description |
|---|---|---|
| **Portal Home** | `https://bunny-quote-game.ngrok-free.dev/` | Landing page, guidelines, and timeline |
| **Team Registration** | `https://bunny-quote-game.ngrok-free.dev/register` | 4-step wizard with auto-scroll validation |
| **Leader Login** | `https://bunny-quote-game.ngrok-free.dev/login` | Team leader authentication |
| **Leader Dashboard** | `https://bunny-quote-game.ngrok-free.dev/dashboard` | Team details and printable card |
| **Admin Login** | `https://bunny-quote-game.ngrok-free.dev/admin/login` | Faculty administrator login |
| **Admin Dashboard** | `https://bunny-quote-game.ngrok-free.dev/admin/dashboard` | Live statistics, filters, and CSV export |
| **Live Excel Spreadsheet** | `https://bunny-quote-game.ngrok-free.dev/spreadsheet` | Real-time editable grid & mobile view |
| **SIH PPT Template** | `https://bunny-quote-game.ngrok-free.dev/ppt-template` | Interactive slides preview & PPTX download |
| **Direct PPTX Download** | `https://bunny-quote-game.ngrok-free.dev/SIH2026-IDEA-Presentation-Format.pptx` | 924 KB official SIH presentation format |
| **API Health Check** | `https://bunny-quote-game.ngrok-free.dev/api/health` | Backend status verification |

### 💻 Localhost Development URLs
- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:5005` (or `http://127.0.0.1:5005`)

---

## 📁 Project Structure

```
sih_final/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets (served at root)
│   │   ├── cc_logo.jpg         # Coders' Club official logo
│   │   ├── cie_logo.jpg        # Centre for Entrepreneurship official logo
│   │   └── SIH2026-IDEA-Presentation-Format.pptx # Official SIH PPT template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Top navigation with club logos & mobile drawer
│   │   │   ├── Footer.jsx      # Mobile-responsive footer with developer credits
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user and team authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page & SIH overview
│   │   │   ├── AboutUs.jsx     # About Coders' Club & CIE
│   │   │   ├── Register.jsx    # 4-step wizard with auto-scroll error validation
│   │   │   ├── Login.jsx       # Team leader login
│   │   │   ├── Dashboard.jsx   # Team leader dashboard
│   │   │   ├── AdminLogin.jsx  # Admin authentication
│   │   │   ├── AdminDashboard.jsx # Admin management & CSV export
│   │   │   ├── LiveSpreadsheet.jsx# Live editable Excel grid & mobile view
│   │   │   ├── PptTemplate.jsx # Interactive presentation slides & download
│   │   │   ├── Faq.jsx         # Frequently asked questions
│   │   │   ├── Terms.jsx       # Nomination regulations & rules
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js          # Configured Axios instance with /api proxy
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx
│   ├── vite.config.js          # Vite config with IPv4 reverse proxy & allowedHosts
│   └── package.json
│
└── server/                     # Node.js + Express Backend
    ├── src/
    │   ├── config/
    │   │   └── db.js           # Mongoose Atlas connection
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── teamController.js # Registration, validation & in-memory fallback
    │   │   ├── adminController.js
    │   │   └── spreadsheetController.js
    │   ├── middleware/
    │   │   ├── auth.js         # JWT verification & role authorization
    │   │   └── errorHandler.js
    │   ├── models/
    │   │   ├── User.js         # Leader credentials schema
    │   │   └── Team.js         # Team & 6-member schema
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── teamRoutes.js
    │   │   ├── adminRoutes.js
    │   │   └── spreadsheetRoutes.js
    │   ├── utils/
    │   │   ├── sendGrid.js     # Email utility (Gmail SMTP + Ethereal fallback)
    │   │   └── teamIdGenerator.js # SIH26-CC-XXXX generator
    │   └── server.js           # Express app with trust proxy & rate limiter
    ├── tunnel.js               # ngrok runner script for custom domain
    ├── .env                    # Secret environment keys
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- [ngrok](https://ngrok.com/) account (free tier for public tunneling)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/sih-2026-portal.git
cd sih-2026-portal

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

---

## 🔧 Environment Variables (.env)

Create `server/.env` with the following configuration:

```env
# Server Configuration
PORT=5005
NODE_ENV=development

# MongoDB Atlas URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sih_portal?appName=Cluster0

# JSON Web Token Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Static Credentials
ADMIN_EMAIL=admin@codersclub.edu.in
ADMIN_PASSWORD=AdminSIH2026!Secure

# Client URL (Local or ngrok public URL)
CLIENT_URL=https://bunny-quote-game.ngrok-free.dev

# WhatsApp Group for Registered Leaders
WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/SIH2026CodersClubCIE

# Email Configuration (Gmail SMTP - Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_google_app_password

# ngrok authtoken
NGROK_AUTHTOKEN=your_ngrok_authtoken_here
```

---

## ▶️ Running the Application

### 1. Start Backend Server (Port 5005)
```bash
cd server
node src/server.js
```
*Backend runs at `http://localhost:5005` (Health check: `/api/health`)*

### 2. Start Frontend Dev Server (Port 5173)
```bash
cd client
npm run dev
```
*Frontend runs at `http://localhost:5173`*

### 3. Start ngrok Public Tunnel (Custom Static Domain)
```bash
cd server
npx ngrok http --url=bunny-quote-game.ngrok-free.dev 5173
```
*Public link: `https://bunny-quote-game.ngrok-free.dev`*

---

## 🔐 Admin Credentials

| Role | Login URL | Email | Password |
|---|---|---|---|
| **Faculty / Admin** | `/admin/login` | `admin@codersclub.edu.in` | `AdminSIH2026!Secure` |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Team Leader Login
- `POST /api/auth/admin-login` — Admin Login
- `GET /api/auth/me` — Get Current User Profile (JWT Protected)

### Teams (`/api/teams`)
- `POST /api/teams/register` — Register Team (6 members, 1 female mandatory)
- `GET /api/teams/my-team` — Leader Dashboard Profile (Leader Protected)
- `PUT /api/teams/my-team` — Update Team Info (Leader Protected)

### Admin (`/api/admin`)
- `GET /api/admin/stats` — Live Summary Metrics (Admin Protected)
- `GET /api/admin/teams` — Filtered Team List (Admin Protected)
- `GET /api/admin/teams/:id` — Single Team Details (Admin Protected)
- `PUT /api/admin/teams/:id` — Update Team by Admin (Admin Protected)
- `DELETE /api/admin/teams/:id` — Delete Team (Admin Protected)
- `GET /api/admin/export/csv` — Export Registrations to CSV (Admin Protected)

### Live Spreadsheet (`/api/spreadsheet`)
- `GET /api/spreadsheet/data` — Fetch Live Grid Records
- `POST /api/spreadsheet/sync` — Sync Grid Edits to MongoDB

---

## 📧 Email Delivery System

The backend automatically dispatches an HTML confirmation email when a team registers.

1. **Gmail SMTP (Production)**:
   - Configure `SMTP_USER` and `SMTP_PASS` (16-character [Google App Password](https://myaccount.google.com/apppasswords)) in `server/.env`.
   - Sends real emails directly to the leader's email address.
2. **Ethereal Sandbox (Development Fallback)**:
   - If SMTP credentials are not set, the system generates an automatic live test inbox.
   - The confirmation link is displayed on the success screen (**"📨 Open Official Email Confirmation Slip"**) and printed in the backend console.

---

## 📱 Mobile Responsiveness

- **Mobile Drawer Navigation**: Animated hamburger menu with tap-friendly links.
- **Auto-Scroll Error Targeting**: On smartphones, form validation errors automatically center on screen so users never miss a required field.
- **Mobile Spreadsheet Card View**: Allows smooth data inspection on small screens without horizontal scroll frustration.
- **Touch Targets**: All buttons adhere to 44px+ touch standards.

## 🐙 GitHub Repository Setup
 
To push this project to your GitHub account:

```bash
cd D:\sih_final

# 1. Initialize git repository (if not already done)
git init

# 2. Stage all files
git add .

# 3. Commit changes
git commit -m "feat: SIH 2026 Team Registration Portal with live Excel, PPT template, and email engine"

# 4. Set main branch
git branch -M main

# 5. Link to your remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/sih-2026-registration-portal.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📄 License & Credits

Built for internal nomination and management of **Smart India Hackathon 2026**.

```
🚀 Created by Asma Eram (Full Stack Developer)
🏛️ Organized by Coders' Club × Centre for Entrepreneurship (CIE)
```
