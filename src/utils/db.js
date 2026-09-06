/* ============================================================
   Temporary DB layer using localStorage.
   When the Django backend + REST API is ready, replace the
   functions here with fetch() calls to your endpoints. The rest
   of the app will keep working unchanged.
   ============================================================ */
import { seedHospitals, seedDoctors, seedRooms, seedPrices, seedInsurances, seedWellness } from '../data/mockData'

const KEYS = {
  hospitals: 'mc_hospitals',
  doctors: 'mc_doctors',
  rooms: 'mc_rooms',
  prices: 'mc_prices',
  insurances: 'mc_insurances',
  wellness: 'mc_wellness',
  users: 'mc_users',
  sessions: 'mc_session',
  appointments: 'mc_appointments',
  reviews: 'mc_reviews',
  reports: 'mc_reports',
  payments: 'mc_payments',
  notifications: 'mc_notifications',
}

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function ensureSeed() {
  if (!localStorage.getItem(KEYS.hospitals)) write(KEYS.hospitals, seedHospitals)
  if (!localStorage.getItem(KEYS.doctors)) write(KEYS.doctors, seedDoctors)
  if (!localStorage.getItem(KEYS.rooms)) write(KEYS.rooms, seedRooms)
  if (!localStorage.getItem(KEYS.prices)) write(KEYS.prices, seedPrices)
  if (!localStorage.getItem(KEYS.insurances)) write(KEYS.insurances, seedInsurances)
  if (!localStorage.getItem(KEYS.wellness)) write(KEYS.wellness, seedWellness)
  if (!localStorage.getItem(KEYS.users)) {
    // Seed demo accounts so all three roles can be tested immediately
    const seedUsers = [
      { id: 'u-admin', name: 'Site Administrator', role: 'admin', email: 'admin@medicare.com', mobile: '9900000000', password: 'admin123', status: 'approved' },
      { id: 'u-dr', name: 'Dr. Ayesha Khan', role: 'doctor', email: 'doctor@medicare.com', mobile: '9800000000', password: 'doctor123', status: 'approved', degree: 'MBBS, MD (Cardiology)', college: 'AIIMS Delhi', experience: 14, speciality: 'Cardiologist', hospitalId: 'h1', doctorId: 'd1', fee: 800 },
      { id: 'u-pt', name: 'Rahul Sharma', role: 'patient', email: 'patient@medicare.com', mobile: '9700000000', password: 'patient123', status: 'approved', gender: 'Male', bloodGroup: 'B+', birthdate: '1994-05-12', address: 'Maninagar, Ahmedabad' },
    ]
    write(KEYS.users, seedUsers)
  }
  if (!localStorage.getItem(KEYS.appointments)) {
    write(KEYS.appointments, [
      { id: 'a1', patientId: 'u-pt', doctorId: 'd1', doctorName: 'Dr. Ayesha Khan', hospitalId: 'h1', hospitalName: 'City Care Multi-Speciality Hospital', date: '2026-09-05', time: '10:30 AM', turn: 3, status: 'confirmed', reason: 'Chest pain follow-up', fee: 800, createdAt: '2026-09-01' },
      { id: 'a2', patientId: 'u-pt', doctorId: 'd3', doctorName: 'Dr. Kavita Joshi', hospitalId: 'h2', hospitalName: 'Sunrise General Hospital', date: '2026-08-20', time: '04:00 PM', turn: 7, status: 'completed', reason: 'Routine checkup', fee: 600, createdAt: '2026-08-15' },
      { id: 'a3', patientId: 'u-pt', doctorId: 'd8', doctorName: 'Dr. Vikram Singh', hospitalId: 'h1', hospitalName: 'City Care Multi-Speciality Hospital', date: '2026-07-02', time: '11:00 AM', turn: 12, status: 'canceled', reason: 'Ear infection', fee: 600, createdAt: '2026-06-28' },
    ])
  }
  if (!localStorage.getItem(KEYS.reviews)) {
    write(KEYS.reviews, [
      { id: 'rev1', patientId: 'u-pt', patientName: 'Rahul Sharma', doctorId: 'd1', doctorName: 'Dr. Ayesha Khan', rating: 5, comment: 'Very caring and explained everything clearly.', date: '2026-08-25' },
      { id: 'rev2', patientId: 'u-pt', patientName: 'Rahul Sharma', doctorId: 'd3', doctorName: 'Dr. Kavita Joshi', rating: 4, comment: 'Good experience, minimal waiting time.', date: '2026-08-21' },
    ])
  }
  if (!localStorage.getItem(KEYS.payments)) {
    write(KEYS.payments, [
      { id: 'p1', patientId: 'u-pt', amount: 600, type: 'consultation', status: 'completed', method: 'UPI', date: '2026-08-20', ref: 'PAY-88123' },
      { id: 'p2', patientId: 'u-pt', amount: 800, type: 'consultation', status: 'pending', method: '—', date: '2026-09-05', ref: 'PAY-88240' },
    ])
  }
  if (!localStorage.getItem(KEYS.notifications)) {
    write(KEYS.notifications, [
      { id: 'n1', userId: 'u-pt', title: 'Appointment confirmed', message: 'Your appointment with Dr. Ayesha Khan is confirmed for 10:30 AM.', read: false, date: '2026-09-01' },
      { id: 'n2', userId: 'u-dr', title: 'New appointment request', message: 'Rahul Sharma requested an appointment on 05 Sep.', read: false, date: '2026-09-01' },
    ])
  }
}

ensureSeed()

export const db = {
  getHospitals: () => read(KEYS.hospitals),
  saveHospitals: (v) => write(KEYS.hospitals, v),

  getDoctors: () => read(KEYS.doctors),
  saveDoctors: (v) => write(KEYS.doctors, v),

  getRooms: () => read(KEYS.rooms),
  saveRooms: (v) => write(KEYS.rooms, v),

  getPrices: () => read(KEYS.prices),
  getInsurances: () => read(KEYS.insurances),
  getWellness: () => read(KEYS.wellness),
  saveWellness: (v) => write(KEYS.wellness, v),

  getUsers: () => read(KEYS.users),
  saveUsers: (v) => write(KEYS.users, v),

  getAppointments: () => read(KEYS.appointments),
  saveAppointments: (v) => write(KEYS.appointments, v),

  getReviews: () => read(KEYS.reviews),
  saveReviews: (v) => write(KEYS.reviews, v),

  getReports: () => read(KEYS.reports),
  saveReports: (v) => write(KEYS.reports, v),

  getPayments: () => read(KEYS.payments),
  savePayments: (v) => write(KEYS.payments, v),

  getNotifications: () => read(KEYS.notifications),
  saveNotifications: (v) => write(KEYS.notifications, v),

  getSession: () => read(KEYS.sessions, null),
  saveSession: (user) => write(KEYS.sessions, user),
  clearSession: () => localStorage.removeItem(KEYS.sessions),

  id: (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
}

export const uid = db.id
