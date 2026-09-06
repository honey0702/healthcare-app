import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { seedServices } from '../../data/mockData'
import { Rating, SectionTitle } from '../../components/ui'
import { Icon } from '../../components/Icons'

export default function Home() {
  const [query, setQuery] = useState('')
  const doctors = db.getDoctors()
  const hospitals = db.getHospitals()

  const popularDoctors = useMemo(
    () => doctors.filter((d) => d.available && d.city === 'Ahmedabad').slice(0, 3),
    [doctors]
  )
  const filteredHospitals = hospitals.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.city.toLowerCase().includes(query.toLowerCase())).slice(0, 4)

  const doctorFor = (id) => doctors.find((d) => d.id === id)

  return (
    <div>
      {/* ============ HERO ============ */}
      <section style={{ background: 'linear-gradient(135deg,#f0fdfa 0%,#e0f7f5 55%,#f6f8fb 100%)', padding: '70px 0 90px', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 40 }}>
            <div className="anim-up">
              <span className="tag mb-3">🏥 Trusted by 50,000+ patients</span>
              <h1 style={{ fontSize: 'clamp(34px,5vw,54px)', fontWeight: 800, lineHeight: 1.12, marginBottom: 18 }}>
                Your Health, <br />
                <span className="text-gradient">Simplified & Connected.</span>
              </h1>
              <p style={{ fontSize: 17, maxWidth: 520, marginBottom: 26 }}>
                Find the right doctor, check real-time room availability, compare transparent prices and book appointments in seconds — all in one place.
              </p>

              {/* Search bar */}
              <div className="search-bar" style={{ maxWidth: 520, marginBottom: 22 }}>
                <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  placeholder="Search doctor or hospital by name or location…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ paddingLeft: 46 }}
                />
              </div>

              <div className="flex gap-2 wrap">
                <Link to="/doctors" className="btn btn-primary btn-lg">Find Doctors <Icon.Arrow /></Link>
                <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
              </div>

              <div className="flex gap-4 wrap" style={{ marginTop: 30 }}>
                {[['4.8★', 'Patient Rating'], ['100+', 'Hospitals'], ['300+', 'Doctors']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-dark)' }}>{v}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-up d2" style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
              <div className="float-anim" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 160, lineHeight: 1 }}>🩺</div>
                <div className="card" style={{ maxWidth: 300, margin: '10px auto 0', textAlign: 'left' }}>
                  <div className="flex-between"><span className="badge badge-green">● Available</span><Rating value={4.8} /></div>
                  <h3 style={{ marginTop: 8, fontSize: 17 }}>Dr. Ayesha Khan</h3>
                  <div className="muted" style={{ fontSize: 13 }}>Cardiologist · City Care Hospital</div>
                  <Link to="/doctors" className="btn btn-primary btn-sm btn-block mt-3">Book Appointment</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section">
        <div className="container">
          <SectionTitle kicker="Our Services" title="Everything Healthcare, One Platform" desc="Designed to remove the friction from every step of your medical journey." />
          <div className="grid grid-3 stagger">
            {seedServices.map((s) => (
              <div key={s.id} className="card">
                <div className="stat-icon mb-3" style={{ background: 'var(--brand-faint)', color: 'var(--brand)', fontSize: 26 }}>{s.icon}</div>
                <h3 style={{ marginBottom: 8, fontSize: 18 }}>{s.title}</h3>
                <p style={{ fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR DOCTORS ============ */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <SectionTitle kicker="Popular Near You" title="Top Doctors in Ahmedabad" desc="Hand-picked specialists with real-time availability based on your location." />
          <div className="grid grid-3 stagger">
            {popularDoctors.map((d) => (
              <div key={d.id} className="card">
                <div className="flex-between mb-3">
                  <span className="avatar avatar-lg">{d.image}</span>
                  <span className="badge badge-green">● Available</span>
                </div>
                <h3 style={{ fontSize: 17 }}>{d.name}</h3>
                <div className="muted" style={{ fontSize: 14, marginBottom: 4 }}>{d.speciality}</div>
                <Rating value={d.rating} />
                <div className="flex-between mt-3">
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--ink)' }}>₹{d.fee}</div>
                    <div className="muted" style={{ fontSize: 12 }}>Consultation</div>
                  </div>
                  <Link to="/doctors" className="btn btn-outline btn-sm">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-center mt-5">
            <Link to="/doctors" className="btn btn-primary">See All Doctors <Icon.Arrow /></Link>
          </div>
        </div>
      </section>

      {/* ============ HOSPITALS (searchable) ============ */}
      <section className="section">
        <div className="container">
          <SectionTitle kicker="Hospitals" title="Find Hospitals Near You" desc="Search by hospital name or your city location." />
          <div className="search-bar" style={{ maxWidth: 460, margin: '0 auto 30px' }}>
            <Icon.Search style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input placeholder="Search hospital name or city…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 46 }} />
          </div>
          <div className="grid grid-2 stagger">
            {filteredHospitals.map((h) => (
              <div key={h.id} className="card flex gap-4">
                <div className="stat-icon" style={{ width: 64, height: 64, background: 'var(--brand-faint)', fontSize: 30 }}>{h.image}</div>
                <div style={{ flex: 1 }}>
                  <div className="flex-between"><h3 style={{ fontSize: 17 }}>{h.name}</h3><Rating value={h.rating} /></div>
                  <div className="flex gap-2 wrap" style={{ margin: '6px 0', fontSize: 13 }}>
                    <span className="badge badge-gray"><Icon.MapPin /> {h.area}, {h.city}</span>
                    <span className="badge badge-gray"><Icon.Bed /> {h.beds} beds</span>
                  </div>
                  <div className="flex gap-2 wrap" style={{ marginBottom: 12 }}>
                    {h.specialities.slice(0, 3).map((s) => <span key={s} className="tag">{s}</span>)}
                  </div>
                  <Link to={`/hospital/${h.id}`} className="btn btn-ghost btn-sm">View Details <Icon.Arrow /></Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-center mt-5">
            <Link to="/hospitals" className="btn btn-outline">Browse All Hospitals</Link>
          </div>
        </div>
      </section>

      {/* ============ WHY US / STATS ============ */}
      <section className="section" style={{ background: 'var(--grad-ink)', color: '#cbd5e1' }}>
        <div className="container">
          <div className="grid grid-4" style={{ textAlign: 'center' }}>
            {[
              ['⏱️', 'Zero Waiting', 'Booked turn numbers so you never wait long'],
              ['💰', 'Transparent Pricing', 'Know room & service costs upfront'],
              ['🛡️', 'Insurance Cashless', 'Coverage across 200+ hospitals'],
              ['🏥', 'Real Availability', 'Live beds & doctor availability'],
            ].map(([ic, t, d]) => (
              <div key={t} className="anim-up">
                <div style={{ fontSize: 40, marginBottom: 10 }}>{ic}</div>
                <h3 style={{ color: '#fff', fontSize: 19, marginBottom: 6 }}>{t}</h3>
                <p style={{ fontSize: 14 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEEDBACK ============ */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <SectionTitle kicker="Testimonials" title="What Our Patients Say" />
          <div className="grid grid-3 stagger">
            {[
              { n: 'Rahul S.', t: 'Booked a cardiologist in under 2 minutes. Loved the transparent fees and the turn number feature!', s: 5 },
              { n: 'Meena P.', t: 'The room availability checker saved me hours. Found an ICU slot instantly during an emergency.', s: 5 },
              { n: 'Amit D.', t: 'Finally a platform with clear pricing. No hidden charges at the hospital because of MediCare+.', s: 4 },
            ].map((f) => (
              <div key={f.n} className="card">
                <Rating value={f.s} />
                <p style={{ margin: '12px 0', fontSize: 15 }}>“{f.t}”</p>
                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                  <span className="avatar" style={{ width: 34, height: 34, fontSize: 14 }}>{f.n[0]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{f.n}</div>
                    <div className="muted" style={{ fontSize: 12 }}>Verified Patient</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section" style={{ background: 'var(--brand-faint)' }}>
        <div className="container">
          <div className="card" style={{ background: 'var(--grad-brand)', color: '#fff', textAlign: 'center', padding: '50px 30px', border: 'none' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(26px,4vw,38px)', marginBottom: 12 }}>Ready to Take Control of Your Health?</h2>
            <p style={{ maxWidth: 520, margin: '0 auto 24px', fontSize: 16, color: '#f0fdfa' }}>Join thousands of patients who book smarter, pay transparently and recover faster.</p>
            <div className="flex-center gap-2 wrap">
              <Link to="/register" className="btn btn-dark btn-lg">Create Free Account</Link>
              <Link to="/doctors" className="btn btn-outline btn-lg" style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>Find a Doctor</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
