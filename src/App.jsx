import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastStack from './components/ToastStack'
import DashboardLayout from './components/DashboardLayout'
import { RequireAuth, RedirectIfAuthed } from './components/RouteGuard'
import { Icon } from './components/Icons'

// Public pages
import Home from './pages/public/Home'
import Doctors from './pages/public/Doctors'
import DoctorDetail from './pages/public/DoctorDetail'
import Hospitals from './pages/public/Hospitals'
import HospitalDetail from './pages/public/HospitalDetail'
import Rooms from './pages/public/Rooms'
import Pricing from './pages/public/Pricing'
import About from './pages/public/About'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'

// Patient
import PatientHome from './pages/patient/PatientHome'
import Appointments from './pages/patient/Appointments'
import BookAppointment from './pages/patient/BookAppointment'
import Payments from './pages/patient/Payments'
import Reports from './pages/patient/Reports'
import Feedback from './pages/patient/Feedback'
import Profile from './pages/patient/Profile'

// Doctor
import DoctorHome from './pages/doctor/DoctorHome'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorPatients from './pages/doctor/DoctorPatients'
import Availability from './pages/doctor/Availability'
import DoctorReports from './pages/doctor/DoctorReports'
import Earnings from './pages/doctor/Earnings'
import DoctorReviews from './pages/doctor/DoctorReviews'
import DoctorProfile from './pages/doctor/DoctorProfile'

// Admin
import AdminHome from './pages/admin/AdminHome'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminPatients from './pages/admin/AdminPatients'
import AdminHospitals from './pages/admin/AdminHospitals'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminRooms from './pages/admin/AdminRooms'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReviews from './pages/admin/AdminReviews'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminWellness from './pages/admin/AdminWellness'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReports from './pages/admin/AdminReports'

// Shared
import Notifications from './pages/shared/Notifications'
import Settings from './pages/shared/Settings'

const patientMenu = [
  { label: 'Dashboard', items: [
    { label: 'Overview', to: '/patient', icon: <Icon.Grid /> },
    { label: 'My Appointments', to: '/patient/appointments', icon: <Icon.Calendar /> },
    { label: 'Payments', to: '/patient/payments', icon: <Icon.Wallet /> },
    { label: 'Medical Reports', to: '/patient/reports', icon: <Icon.File /> },
    { label: 'Feedback & Reviews', to: '/patient/feedback', icon: <Icon.Star /> },
  ]},
  { label: 'Account', items: [
    { label: 'My Profile', to: '/patient/profile', icon: <Icon.User /> },
    { label: 'Notifications', to: '/patient/notifications', icon: <Icon.Bell /> },
    { label: 'Settings', to: '/patient/settings', icon: <Icon.Gear /> },
  ]},
]

const doctorMenu = [
  { label: 'Practice', items: [
    { label: 'Overview', to: '/doctor', icon: <Icon.Grid /> },
    { label: 'Appointments', to: '/doctor/appointments', icon: <Icon.Calendar /> },
    { label: 'My Patients', to: '/doctor/patients', icon: <Icon.Users /> },
    { label: 'Availability', to: '/doctor/availability', icon: <Icon.Clock /> },
    { label: 'Upload Reports', to: '/doctor/reports', icon: <Icon.File /> },
    { label: 'Earnings', to: '/doctor/earnings', icon: <Icon.Rupee /> },
    { label: 'Reviews', to: '/doctor/reviews', icon: <Icon.Star /> },
  ]},
  { label: 'Account', items: [
    { label: 'Notifications', to: '/doctor/notifications', icon: <Icon.Bell /> },
    { label: 'Profile', to: '/doctor/profile', icon: <Icon.User /> },
    { label: 'Settings', to: '/doctor/settings', icon: <Icon.Gear /> },
  ]},
]

const adminMenu = [
  { label: 'Management', items: [
    { label: 'Dashboard', to: '/admin', icon: <Icon.Grid /> },
    { label: 'Doctors', to: '/admin/doctors', icon: <Icon.Doctor /> },
    { label: 'Patients', to: '/admin/patients', icon: <Icon.Users /> },
    { label: 'Hospitals', to: '/admin/hospitals', icon: <Icon.Hospital /> },
    { label: 'Appointments', to: '/admin/appointments', icon: <Icon.Calendar /> },
    { label: 'Rooms', to: '/admin/rooms', icon: <Icon.Bed /> },
    { label: 'Payments', to: '/admin/payments', icon: <Icon.Wallet /> },
    { label: 'Reviews', to: '/admin/reviews', icon: <Icon.Star /> },
  ]},
  { label: 'Content & System', items: [
    { label: 'Wellness Content', to: '/admin/wellness', icon: <Icon.Book /> },
    { label: 'Notifications', to: '/admin/notifications', icon: <Icon.Bell /> },
    { label: 'Users', to: '/admin/users', icon: <Icon.User /> },
    { label: 'Reports', to: '/admin/reports', icon: <Icon.Chart /> },
  ]},
]

export default function App() {
  return (
    <>
      <ToastStack />
      <Routes>
        {/* Public routes wrapped in navbar/footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospital/:id" element={<HospitalDetail />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Auth pages */}
        <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Patient */}
        <Route path="/patient" element={<RequireAuth roles={['patient']}><DashboardLayout menu={patientMenu} /></RequireAuth>}>
          <Route index element={<PatientHome />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Doctor */}
        <Route path="/doctor" element={<RequireAuth roles={['doctor']}><DashboardLayout menu={doctorMenu} /></RequireAuth>}>
          <Route index element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="availability" element={<Availability />} />
          <Route path="reports" element={<DoctorReports />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<DoctorReviews />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<RequireAuth roles={['admin']}><DashboardLayout menu={adminMenu} /></RequireAuth>}>
          <Route index element={<AdminHome />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="hospitals" element={<AdminHospitals />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="wellness" element={<AdminWellness />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  )
}

function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="container section" style={{ textAlign: 'center', maxWidth: 520 }}>
      <div style={{ fontSize: 64 }}>🔍</div>
      <h1 style={{ fontSize: 40, margin: '10px 0' }}>404</h1>
      <p className="muted" style={{ marginBottom: 20 }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </div>
  )
}
