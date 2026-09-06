# 🏥 MediCare+ — Healthcare Platform

A professional healthcare platform that connects **patients**, **doctors**, **hospitals** and **admins** in a single digital space — with transparent pricing, real-time room & doctor availability, and convenient appointment booking.

Built with **React + Vite**. The current version uses a mock backend (browser `localStorage`) so everything works out of the box. A Django backend with REST APIs can be connected later without changing the UI.

---

## ✨ Features

### Public / Patient
- Landing page with hero, services, popular doctors, searchable hospitals, testimonials, wellness programs
- **Find Doctors** — search by name / speciality / hospital / city, filter by availability
- **Hospitals** — browse & view detail pages with doctors + rooms
- **Room Availability** — live beds and per-day prices per hospital
- **Pricing** — transparent service & room costs + insurance partners
- **Appointment Booking** — pick doctor, date, time slot; get a **turn number**; add to Google Calendar
- **Patient Dashboard** — My Appointments (upcoming/completed/canceled), Payments (paid, pending, refunds), Medical Reports, Feedback & Reviews, Profile, Notifications, Settings

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
- Register (mobile + password + OTP verification)
- Login by **mobile + password** **or** **mobile + OTP**
- Forgot password (verify mobile + OTP)
- Role-based access & protected routes

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Build | Vite 5 |
| Styling | Custom CSS (design system + animations) |
| State | React Context + localStorage (mock backend) |
| Future backend | Django + REST API (placeholder functions in `src/utils/db.js`) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) **v18 or later** (tested on v20)
- npm (comes with Node)

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development mode
```bash
npm run dev
```
Open the URL shown in your terminal — usually **http://localhost:5173**

### 3. Build for production
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

> **OTP demo:** wherever an OTP is asked (register / login / forgot password), use **`123456`**.

---

## 📂 Project Structure

```
healthcare-app/
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
    │   ├── db.js                # localStorage "backend" (swap for Django APIs)
    │   └── toast.js             # Toast notifications
    ├── context/
    │   └── AuthContext.jsx      # Register / login / session
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

## 🔌 Connecting the Django Backend (later)

All data reads/writes go through **`src/utils/db.js`**. The rest of the app never talks to `localStorage` directly, so you only need to change this one file.

1. Create your Django models mirroring the data shapes in `src/data/mockData.js`.
2. Add `fetch()` calls inside the functions of `db.js`, e.g.:

```js
// instead of: localStorage.getItem(...)
export const db = {
  getDoctors: async () => (await fetch('/api/doctors/')).json(),
  saveDoctors: (data) => fetch('/api/doctors/', { method: 'POST', body: JSON.stringify(data) }),
  // ...same for every other collection
}
```

3. Update `AuthContext.jsx` to hit `/api/auth/login`, `/api/auth/register`, etc.
4. Add a `proxy` in `vite.config.js` to forward `/api` to your Django server:

```js
server: {
  proxy: { '/api': 'http://localhost:8000' }
}
```

The UI and routing will keep working unchanged.

---

## 🎨 Design & UX

- Professional **teal / healthcare** color palette with soft neutrals
- Smooth **fade-in-up**, **scale**, and **slide** animations with staggered delays
- Hover lifts, button presses, progress bars, animated toasts, pulse emergency accents
- Fully **responsive** — sidebar collapses to a slide-in menu on mobile
- Semantic components: `StatCard`, `Modal`, `Pill`, `EmptyState`, `Rating`, `SectionTitle`

---

## 📜 License
Free to use for your project. (This is a frontend demo with mock data — replace with a real backend before production.)
