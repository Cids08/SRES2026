import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const SENDER_TYPES = [
  { key: "parent",  label: "Parent / Guardian" },
  { key: "student", label: "Student"            },
  { key: "teacher", label: "Teacher / Staff"    },
  { key: "other",   label: "Other"              },
];

const SUBJECTS = {
  parent:  ["Enrollment / Admission Inquiry", "Child's Academic Concern", "Attendance or Absence Notice", "Request for Meeting with Teacher", "Scholarship / Financial Aid", "School Fees & Payments", "Other Concern"],
  student: ["Academic Help / Tutoring", "Lost and Found", "Request for Certificate or Records", "Report a Concern", "Scholarship Inquiry", "Clubs and Organizations", "Other Inquiry"],
  teacher: ["Administrative Request", "Curriculum Concern", "Schedule or Room Booking", "Report or Documentation", "Event Coordination", "Other"],
  other:   ["General Inquiry", "Partnership or Collaboration", "Alumni Concern", "Media or Press", "Other"],
};

const OFFICES = [
  { label: "Principal's Office",  hours: "Mon – Fri, 8:00 AM – 5:00 PM", note: "Room 101, Main Building" },
  { label: "Guidance Office",     hours: "Mon – Fri, 8:00 AM – 4:00 PM", note: "Room 104, Main Building" },
  { label: "Registrar / Records", hours: "Mon – Fri, 8:00 AM – 4:30 PM", note: "Room 102, Main Building" },
];

const INPUT_STYLE = {
  fontSize: 13.5, fontFamily: "Georgia, serif", color: "#1a1a1a",
  padding: "10px 14px", border: "1.5px solid #0a1f52", background: "#fdfcf8",
  outline: "none", width: "100%", boxSizing: "border-box",
};

function FieldWrap({ label, error, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a1f52" }}>
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}>{error}</span>}
    </div>
  );
}

function ContactForm() {
  const [step, setStep] = useState(1);
  const [senderType, setSenderType] = useState("");
  const [form, setForm] = useState({ name: "", email: "", gradeSection: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function choose(key) { setSenderType(key); setStep(2); }
  function change(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setErrors((er) => ({ ...er, [e.target.name]: undefined })); }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  }

  function submit(e) {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) { setErrors(er); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ border: "1.5px solid #0a1f52", background: "#fff" }}>
        <div style={{ background: "#0a1f52", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 16, background: "#f5c518" }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Message Sent</span>
        </div>
        <div style={{ padding: "40px 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#f5c518", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0a1f52" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif" }}>Thank you, {form.name}.</h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#4a4a4a", lineHeight: 1.75, fontFamily: "Georgia, serif" }}>Your message has been received. Our team will respond within 1–2 school days.</p>
          <button onClick={() => { setSubmitted(false); setStep(1); setSenderType(""); setForm({ name: "", email: "", gradeSection: "", subject: "", message: "" }); }} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 20px", background: "#0a1f52", color: "#f5c518", border: "none", cursor: "pointer" }}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
        <div style={{ background: "#0a1f52", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 16, background: "#f5c518" }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Step 1 — Who Are You?</span>
        </div>
        <div style={{ padding: "24px 20px" }}>
          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#3a3a3a", fontFamily: "Georgia, serif", lineHeight: 1.7 }}>Please identify yourself so we can direct your message appropriately.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SENDER_TYPES.map((s) => (
              <button key={s.key} onClick={() => choose(s.key)}
                style={{ all: "unset", cursor: "pointer", padding: "18px 16px", border: "1.5px solid #0a1f52", background: "#fdfcf8", display: "flex", flexDirection: "column", gap: 4, transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0a1f52"; e.currentTarget.querySelector("span").style.color = "#f5c518"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fdfcf8"; e.currentTarget.querySelector("span").style.color = "#0a1f52"; }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif", transition: "color 0.15s" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sender = SENDER_TYPES.find((s) => s.key === senderType);
  const subjects = SUBJECTS[senderType] || [];
  const showSection = senderType === "student" || senderType === "parent";

  return (
    <form onSubmit={submit} style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
      <div style={{ background: "#0a1f52", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 16, background: "#f5c518" }} />
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,197,24,0.7)", display: "block" }}>Sending as</span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>{sender?.label}</span>
          </div>
        </div>
        <button type="button" onClick={() => setStep(1)} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>
          ← Change
        </button>
      </div>
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FieldWrap label="Full Name" error={errors.name} required>
            <input name="name" type="text" value={form.name} onChange={change} placeholder="Juan dela Cruz" style={{ ...INPUT_STYLE, borderColor: errors.name ? "#c0392b" : "#0a1f52" }} />
          </FieldWrap>
          <FieldWrap label="Email Address" error={errors.email} required>
            <input name="email" type="email" value={form.email} onChange={change} placeholder="juan@email.com" style={{ ...INPUT_STYLE, borderColor: errors.email ? "#c0392b" : "#0a1f52" }} />
          </FieldWrap>
        </div>
        {showSection && (
          <FieldWrap label={senderType === "student" ? "Your Grade & Section" : "Child's Grade & Section"}>
            <input name="gradeSection" type="text" value={form.gradeSection} onChange={change} placeholder="e.g. Grade 5 – Mabini" style={INPUT_STYLE} />
          </FieldWrap>
        )}
        <FieldWrap label="Subject / Concern" error={errors.subject} required>
          <select name="subject" value={form.subject} onChange={change} style={{ ...INPUT_STYLE, borderColor: errors.subject ? "#c0392b" : "#0a1f52", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1f52' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
            <option value="">— Select a subject —</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FieldWrap>
        <FieldWrap label="Your Message" error={errors.message} required>
          <textarea name="message" rows={5} value={form.message} onChange={change} placeholder="Describe your concern or inquiry in detail..." style={{ ...INPUT_STYLE, resize: "vertical", borderColor: errors.message ? "#c0392b" : "#0a1f52" }} />
        </FieldWrap>
        <p style={{ margin: 0, fontSize: 12, color: "#666", fontFamily: "Georgia, serif", lineHeight: 1.7, borderTop: "1px solid #e4e0d4", paddingTop: 12 }}>
          We typically respond within <strong>1–2 school days</strong>. For urgent matters, please visit the school office or call us directly.
        </p>
        <button type="submit" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "14px", background: "#0a1f52", color: "#f5c518", border: "none", cursor: "pointer", width: "100%", transition: "background 0.15s" }}>
          Submit Message
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <div style={{ background: "#f2efe8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{ background: "#0a1f52", position: "relative", overflow: "hidden", minHeight: 340 }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: "60%", height: "100%", clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}>
          <img src={HERO_IMG} alt="SRES Campus" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,31,82,0.45)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(to right, #92400e, #facc15, #92400e)", zIndex: 10 }} />

        {/* Content — left-aligned, flex column, same as About */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "80px 24px 96px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p style={{ color: "#facc15", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
              San Roque Elementary School
            </p>
            <h1 style={{ margin: "0 0 20px 0", color: "#fff", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              Contact <span style={{ color: "#facc15" }}>Us</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 448, margin: 0 }}>
              We are here for every student, parent, and teacher. Reach out with questions, concerns, or feedback.
            </p>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 40px 72px" }}>
        {/* INFO STRIP */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 40 }}>
          {[
            { key: "Location", main: "San Roque, Viga", sub: "Catanduanes, Philippines" },
            { key: "Office Hours", main: "Mon – Fri", sub: "8:00 AM – 5:00 PM" },
            { key: "Email", main: "113330@deped.gov.ph", sub: null },
            { key: "Phone", main: "+63 9605519104", sub: null },
          ].map((i) => (
            <div key={i.key} style={{ background: "#0a1f52", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f5c518" }}>{i.key}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", wordBreak: "break-all" }}>{i.main}</span>
              {i.sub && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{i.sub}</span>}
            </div>
          ))}
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          <ContactForm />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* School Offices */}
            <div style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
              <div style={{ background: "#0a1f52", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 16, background: "#f5c518" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>School Offices</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {OFFICES.map((o, i) => (
                  <div key={i} style={{ padding: "14px 18px", borderBottom: i < OFFICES.length - 1 ? "1px solid #e4e0d4" : "none" }}>
                    <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif" }}>{o.label}</p>
                    <p style={{ margin: "0 0 2px", fontSize: 12, color: "#5a5a5a" }}>{o.hours}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#0a1f52", opacity: 0.5 }}>{o.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
              <div style={{ background: "#0a1f52", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 16, background: "#f5c518" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Quick Links</span>
              </div>
              {[
                "Download Enrollment Form",
                "Request School Records",
                "View Scholarship Information",
                "Download School Calendar",
              ].map((l, i, arr) => (
                <a key={i} href="#" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", textDecoration: "none", borderBottom: i < arr.length - 1 ? "1px solid #e4e0d4" : "none", fontSize: 12.5, fontWeight: 700, color: "#0a1f52", fontFamily: "Georgia, serif", transition: "background 0.12s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f5c518"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {l} <span style={{ fontSize: 14, color: "#0a1f52", opacity: 0.4 }}>→</span>
                </a>
              ))}
            </div>

            {/* Map */}
            <div style={{ border: "1.5px solid #0a1f52", overflow: "hidden" }}>
              <div style={{ background: "#0a1f52", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 16, background: "#f5c518" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Find Us</span>
              </div>
              <iframe title="SRES Location" src="https://maps.google.com/maps?q=Viga,+Catanduanes&output=embed" width="100%" height="180" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}