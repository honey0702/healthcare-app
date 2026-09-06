/* ============================================================
   Mock backend / seed data.
   This file acts as the temporary database until the Django
   backend + REST APIs are connected. All state is persisted in
   localStorage by the DB helpers in utils/db.js
   ============================================================ */

export const seedHospitals = [
  {
    id: 'h1', name: 'City Care Multi-Speciality Hospital', city: 'Ahmedabad',
    area: 'Maninagar', rating: 4.7, beds: 320, phone: '+91 98120 33441',
    specialities: ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics'],
    image: '🏥',
  },
  {
    id: 'h2', name: 'Sunrise General Hospital', city: 'Ahmedabad',
    area: 'Navrangpura', rating: 4.5, beds: 180, phone: '+91 98250 77812',
    specialities: ['General Medicine', 'Gynecology', 'ENT', 'Dermatology'],
    image: '🏨',
  },
  {
    id: 'h3', name: 'LifeLine Heart Institute', city: 'Surat',
    area: 'Adajan', rating: 4.8, beds: 120, phone: '+91 99095 66720',
    specialities: ['Cardiology', 'Cardiac Surgery', 'ICU'],
    image: '🫀',
  },
  {
    id: 'h4', name: 'Green Valley Ortho Clinic', city: 'Vadodara',
    area: 'Alkapuri', rating: 4.4, beds: 60, phone: '+91 99244 88901',
    specialities: ['Orthopedics', 'Physiotherapy', 'Sports Medicine'],
    image: '🦴',
  },
  {
    id: 'h5', name: 'Metro Polyclinic', city: 'Rajkot',
    area: 'Kalawad Road', rating: 4.2, beds: 90, phone: '+91 98244 11233',
    specialities: ['General Medicine', 'Pediatrics', 'Dental', 'ENT'],
    image: '🏥',
  },
  {
    id: 'h6', name: 'Aarogya Women & Child Hospital', city: 'Gandhinagar',
    area: 'Sector 21', rating: 4.6, beds: 75, phone: '+91 90990 44567',
    specialities: ['Gynecology', 'Obstetrics', 'Pediatrics', 'Neonatology'],
    image: '👶',
  },
]

export const seedDoctors = [
  { id: 'd1', name: 'Dr. Ayesha Khan', speciality: 'Cardiologist', hospitalId: 'h1', city: 'Ahmedabad', exp: 14, fee: 800, rating: 4.8, available: true, image: '🩺', gender: 'Female', college: 'AIIMS Delhi', degree: 'MBBS, MD (Cardiology)' },
  { id: 'd2', name: 'Dr. Rohan Mehta', speciality: 'Orthopedic Surgeon', hospitalId: 'h1', city: 'Ahmedabad', exp: 11, fee: 700, rating: 4.6, available: true, image: '🦴', gender: 'Male', college: 'CIMS', degree: 'MBBS, MS (Ortho)' },
  { id: 'd3', name: 'Dr. Kavita Joshi', speciality: 'Gynecologist', hospitalId: 'h2', city: 'Ahmedabad', exp: 9, fee: 600, rating: 4.7, available: true, image: '👩‍⚕️', gender: 'Female', college: 'BJ Medical College', degree: 'MBBS, MD (Gyn)' },
  { id: 'd4', name: 'Dr. Arjun Patel', speciality: 'Neurologist', hospitalId: 'h3', city: 'Surat', exp: 16, fee: 1000, rating: 4.9, available: true, image: '🧠', gender: 'Male', college: 'AIIMS New Delhi', degree: 'MBBS, DM (Neuro)' },
  { id: 'd5', name: 'Dr. Neha Shah', speciality: 'Pediatrician', hospitalId: 'h2', city: 'Ahmedabad', exp: 8, fee: 550, rating: 4.5, available: true, image: '👶', gender: 'Female', college: 'GMC Surat', degree: 'MBBS, MD (Pedia)' },
  { id: 'd6', name: 'Dr. Sameer Rao', speciality: 'Dermatologist', hospitalId: 'h4', city: 'Vadodara', exp: 7, fee: 650, rating: 4.4, available: false, image: '✨', gender: 'Male', college: 'Baroda Medical College', degree: 'MBBS, MD (Derm)' },
  { id: 'd7', name: 'Dr. Priya Iyer', speciality: 'General Physician', hospitalId: 'h5', city: 'Rajkot', exp: 12, fee: 500, rating: 4.6, available: true, image: '🩺', gender: 'Female', college: 'KEM Mumbai', degree: 'MBBS, MD (Gen Med)' },
  { id: 'd8', name: 'Dr. Vikram Singh', speciality: 'ENT Specialist', hospitalId: 'h1', city: 'Ahmedabad', exp: 10, fee: 600, rating: 4.5, available: true, image: '👂', gender: 'Male', college: 'NHL Medical College', degree: 'MBBS, MS (ENT)' },
]

export const seedRooms = [
  { id: 'r1', hospitalId: 'h1', type: 'General Ward', price: 1500, available: 12, total: 20, amenities: ['Attached washroom', 'Nursing care', 'TV'] },
  { id: 'r2', hospitalId: 'h1', type: 'Semi-Private', price: 3200, available: 4, total: 10, amenities: ['Twin sharing', 'Attached washroom', 'TV', 'Cafeteria'] },
  { id: 'r3', hospitalId: 'h1', type: 'Private Room', price: 5000, available: 3, total: 8, amenities: ['Single bed', 'Attached washroom', 'TV', 'Wi-Fi', 'Patient attendant'] },
  { id: 'r4', hospitalId: 'h1', type: 'ICU / HDU', price: 9000, available: 2, total: 8, amenities: ['Ventilator support', 'Monitors', '24x7 ICU staff'] },
  { id: 'r5', hospitalId: 'h2', type: 'General Ward', price: 1200, available: 8, total: 16, amenities: ['Attached washroom', 'Nursing care'] },
  { id: 'r6', hospitalId: 'h2', type: 'Private Room', price: 4200, available: 2, total: 6, amenities: ['Single bed', 'TV', 'Wi-Fi', 'Attendant'] },
  { id: 'r7', hospitalId: 'h3', type: 'Private Room', price: 5500, available: 5, total: 12, amenities: ['Single bed', 'TV', 'Wi-Fi', 'Cardiac monitor'] },
  { id: 'r8', hospitalId: 'h3', type: 'ICU / HDU', price: 9500, available: 1, total: 6, amenities: ['Ventilator support', 'Monitors', '24x7 ICU staff'] },
  { id: 'r9', hospitalId: 'h4', type: 'General Ward', price: 1000, available: 6, total: 10, amenities: ['Attached washroom', 'Nursing care'] },
  { id: 'r10', hospitalId: 'h4', type: 'Private Room', price: 3800, available: 2, total: 5, amenities: ['Single bed', 'TV', 'Attendant'] },
]

export const seedPrices = [
  { service: 'Outpatient Consultation', unit: 'per visit', price: 500 },
  { service: 'Emergency Room Visit', unit: 'per visit', price: 2000 },
  { service: 'Blood Test (CBC)', unit: 'per test', price: 400 },
  { service: 'X-Ray (Chest)', unit: 'per image', price: 700 },
  { service: 'MRI Scan', unit: 'per scan', price: 6500 },
  { service: 'General Ward / Day', unit: 'per day', price: 1500 },
  { service: 'Private Room / Day', unit: 'per day', price: 5000 },
  { service: 'ICU / HDU / Day', unit: 'per day', price: 9000 },
  { service: 'Normal Delivery', unit: 'package', price: 45000 },
  { service: 'Appendectomy', unit: 'package', price: 60000 },
  { service: 'Angioplasty', unit: 'package', price: 180000 },
  { service: 'Knee Replacement', unit: 'package', price: 250000 },
]

export const seedInsurances = [
  { provider: 'Star Health', cashless: true, network: 'Covers 200+ hospitals', coverage: 'Up to ₹10L' },
  { provider: 'HDFC ERGO', cashless: true, network: 'Covers 350+ hospitals', coverage: 'Up to ₹15L' },
  { provider: 'Bajaj Allianz', cashless: true, network: 'Covers 280+ hospitals', coverage: 'Up to ₹8L' },
  { provider: 'LIC Jeevan', cashless: false, network: 'Reimbursement based', coverage: 'Up to ₹5L' },
]

export const seedWellness = [
  { id: 'w1', title: 'Morning Yoga for Beginners', type: 'Video', duration: '20 min', level: 'Beginner', category: 'Fitness' },
  { id: 'w2', title: 'Heart-Healthy Diet Guide', type: 'Article', read: '8 min', category: 'Nutrition' },
  { id: 'w3', title: 'Stress & Anxiety Management', type: 'Video', duration: '15 min', category: 'Mental Health' },
  { id: 'w4', title: 'Daily Walking Routine (10k steps)', type: 'Article', read: '5 min', category: 'Fitness' },
  { id: 'w5', title: 'Understanding Blood Pressure', type: 'Article', read: '7 min', category: 'Education' },
  { id: 'w6', title: 'Immunity Boosting Tips', type: 'Video', duration: '12 min', category: 'Nutrition' },
]

export const seedServices = [
  { id: 's1', title: 'Find Doctors', desc: 'Search specialists by location and name with real availability.', icon: '🩺' },
  { id: 's2', title: 'Book Appointments', desc: 'Reserve your slot and track your turn number instantly.', icon: '📅' },
  { id: 's3', title: 'Room Availability', desc: 'Check room types, prices and live availability at any hospital.', icon: '🛏️' },
  { id: 's4', title: 'Transparent Pricing', desc: 'Clear cost of every room and service before you decide.', icon: '💰' },
  { id: 's5', title: 'Insurance Support', desc: 'Cashless options from top providers for your treatment.', icon: '🛡️' },
  { id: 's6', title: 'Medical Reports', desc: 'Store, view and share all your medical reports securely.', icon: '📋' },
]
