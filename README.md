# 🏥 MediCare+ — Healthcare Platform

A professional healthcare platform that connects **patients**, **doctors**, **hospitals** and **admins** in a single digital space — with transparent pricing, real-time room & doctor availability, and convenient appointment booking.

Built with **React + Vite** and a Django REST API. Authentication (patient/doctor registration and mobile + password login) is backed by Django, JWT tokens, and SQLite. The remaining healthcare data features still use the browser `localStorage` mock layer and will be migrated to the API in later phases.

---

## ✨ Features

### Public / Patient
- Landing page with hero, services, popular doctors, searchable hospitals, testimonials, wellness programs
- **Find Doctors** — search by name / speciality / hospital / city, filter by availability
- **Hospitals** — browse & view detail pages with doctors + rooms
- **Room Availability** — live beds and per-day prices per hospital
- **Pricing** — transparent service & room costs + insurance partners
- **Appointment Booking** — pick doctor, date, time slot; get a **turn number**; add to Google Calendar
- **Patient Dashboard** — API-backed summary cards, next/upcoming appointments, recent payments, medical reports, notifications, recommended doctors, plus My Appointments (upcoming/completed/canceled), Feedback & Reviews, Profile, and Settings

### Doctor
- Registration with professional details (**degree, college, experience, speciality**) → goes for **admin verification**
- Dashboard — today's appointments, pending requests, total patients
- **Appointments** — approve / reject / mark completed
- **Patients** — view patient information
- **Availability** — set working days, time slots & leave
- **Upload Reports** to patients, **Earnings**, **Reviews**, **Notifications**, Profile, Settings

### Admin
- Simple login (no OTP)
- Dashboard with overall system statistics
- **Doctor Management** — approve / reject registrations
- **Patient / User Management**
- **Hospital Management** — add / edit / delete
- **Appointment Management**, **Room Management**, **Payment/Refund Management**
- **Reviews**, **Send Notifications**, **Wellness Content**, **System Reports** with charts

### Authentication
- Register as a patient or doctor with mobile + password
- Patient registration returns JWT tokens immediately
- Doctor registration is marked pending until admin approval
- Login by **mobile + password** with JWT access/refresh tokens
- Role-based access & protected routes
- Password reset and OTP flows are intentionally deferred to a later API phase

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Build | Vite 5 |
| Styling | Custom CSS (design system + animations) |
| State | React Context + JWT session storage |
| Backend | Django 5.2, Django REST Framework, SimpleJWT |
| API docs | drf-spectacular Swagger UI + ReDoc |
| Database | SQLite for local development |
| Remaining data | localStorage mock layer (being migrated incrementally) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) **v18 or later** (tested on v20)
- npm (comes with Node)
- Python **3.11 or later**

### 1. Start the Django backend
```bash
cd backend
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend exposes the authentication API under `/api/auth/`. The default SQLite database is created at `backend/db.sqlite3` and is ignored by Git.

To create the showcase accounts and sample patient dashboard records, run this once from `backend/`:
```bash
python manage.py seed_demo_accounts
```

### 2. Start the React frontend
In a second terminal, from the repository root:
```bash
npm install
npm run dev
```
Open the URL shown in your terminal — usually **http://localhost:5173**. Vite proxies `/api` requests to Django on port 8000. To use a different backend URL, set `VITE_BACKEND_URL` before starting Vite.

### 3. API documentation
With Django running, open:
- Swagger UI: **http://localhost:8000/api/docs/**
- ReDoc: **http://localhost:8000/api/redoc/**
- OpenAPI schema: **http://localhost:8000/api/schema/**

Authentication uses Bearer JWT tokens. `POST /api/auth/register/` returns tokens for patients; doctor registrations are marked `pending` until an admin approves them. `POST /api/auth/login/` returns access and refresh tokens for approved accounts. `GET /api/auth/me/` validates the current access token.

### 4. Build for production
```bash
npm run build
```
The optimized bundle is output to the `dist/` folder. Preview it with:
```bash
npm run preview
```

---

## 🔐 Demo Accounts

The app is seeded with demo accounts so you can test all three roles immediately.

| Role | Mobile | Password | What you can do |
|------|--------|----------|-----------------|
| **Patient** | `9700000000` | `patient123` | Book appointments, payments, reports, feedback |
| **Doctor** | `9800000000` | `doctor123` | Approve appointments, availability, reports, earnings |
| **Admin** | `9900000000` | `admin123` | Approve doctors, manage hospitals/rooms/payments, reports |

Run `python manage.py seed_demo_accounts` from `backend/` to create these accounts in Django. OTP and password-reset demos are no longer enabled in the first API release.

---

## 📂 Project Structure

```
healthcare-app/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                 # Django project settings and URLs
│   ├── accounts/               # User model + register/login API
│   └── dashboard/              # Patient home dashboard models and API
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # App entry (BrowserRouter + AuthProvider)
    ├── App.jsx                  # All routes + dashboard menus
    ├── styles/
    │   └── index.css            # Design system, colors, animations
    ├── data/
    │   └── mockData.js          # Seed data (hospitals, doctors, rooms…)
    ├── utils/
    │   ├── api.js               # Django authentication API client
    │   ├── db.js                # Remaining localStorage mock data + JWT session
    │   └── toast.js             # Toast notifications
    ├── context/
    │   └── AuthContext.jsx      # Django register / login / session
    ├── components/
    │   ├── Navbar.jsx  Footer.jsx  ToastStack.jsx
    │   ├── DashboardLayout.jsx  RouteGuard.jsx
    │   ├── Icons.jsx  ui.jsx
    └── pages/
        ├── public/              # Home, Doctors, Hospitals, Rooms, Pricing, About, Login…
        ├── patient/             # Patient dashboard
        ├── doctor/              # Doctor dashboard
        ├── admin/               # Admin panel
        └── shared/              # Notifications, Settings
```

---

## 🔌 Authentication API

The Django API currently provides authentication and the patient home dashboard:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/auth/register/` | Create a patient or doctor account |
| `POST` | `/api/auth/login/` | Authenticate with mobile + password |
| `GET` | `/api/auth/me/` | Return the authenticated user (`Authorization: Bearer <access-token>`) |
| `GET` | `/api/patient/dashboard/` | Patient home dashboard data (patient JWT required) |
| `GET` | `/api/docs/` | Interactive Swagger UI |
| `GET` | `/api/redoc/` | ReDoc API reference |
| `GET` | `/api/schema/` | OpenAPI schema |

The frontend API client lives in `src/utils/api.js`, and JWT session persistence lives in `src/utils/db.js`. The patient home page now loads its dashboard data from Django; the other dashboard pages continue to use mock data until their Django endpoints are added.

---

## 🎨 Design & UX

- Professional **teal / healthcare** color palette with soft neutrals
- Smooth **fade-in-up**, **scale**, and **slide** animations with staggered delays
- Hover lifts, button presses, progress bars, animated toasts, pulse emergency accents
- Fully **responsive** — sidebar collapses to a slide-in menu on mobile
- Semantic components: `StatCard`, `Modal`, `Pill`, `EmptyState`, `Rating`, `SectionTitle`

---

## 📜 License
Free to use for your project. Authentication is backed by Django; the remaining mock data modules should be migrated before production.
