import { useState, useRef } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";
const API_URL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const SENDER_TYPES = [
  { key: "parent",  label: "Parent / Guardian" },
  { key: "student", label: "Student"            },
  { key: "teacher", label: "Teacher / Staff"    },
  { key: "other",   label: "Other"              },
];

const SUBJECTS = {
  parent: [
    "Enrollment / Admission Inquiry",
    "Child's Academic Concern",
    "Attendance or Absence Notice",
    "Request for Meeting with Teacher",
    "Request for Form 138 (Report Card)",
    "Request for Form 137 / Transfer Documents",
    "Barangay or Residency Certificate Requirement",
    "Other Concern",
  ],
  student: [
    "Academic Concern",
    "Lost and Found",
    "Request for School Certificate or Records",
    "Report a Concern",
    "Other Inquiry",
  ],
  teacher: [
    "Administrative Request",
    "Curriculum or Instructional Concern",
    "Schedule or Classroom Matter",
    "Report or Documentation",
    "Event or Activity Coordination",
    "Other",
  ],
  other: [
    "General Inquiry",
    "Barangay / LGU Coordination",
    "Alumni Concern",
    "Media or Press Inquiry",
    "Other",
  ],
};

const OFFICES = [
  {
    label: "Principal's Office",
    hours: "Mon – Fri, 7:00 AM – 5:00 PM",
    note: "Main Building · For all official inquiries and concerns",
  },
  {
    label: "Class Adviser / Teacher-in-Charge",
    hours: "Mon – Fri, 7:00 AM – 4:00 PM",
    note: "Contact your child's class adviser first for academic and attendance concerns",
  },
  {
    label: "School Records",
    hours: "Mon – Fri, 8:00 AM – 4:00 PM",
    note: "For Form 137, Form 138, certificates, and transfer requests",
  },
];

const QUICK_LINKS = [
  { label: "Go to Online Enrollment Form",         href: "/enroll"                          },
  { label: "DepEd Schools Division — Catanduanes", href: "https://catanduanes.deped.gov.ph" },
  { label: "DepEd Official Website",               href: "https://www.deped.gov.ph"         },
  { label: "Request Form 137 / Transfer Docs",     href: "#contact-form"                    },
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
  const [step,       setStep]       = useState(1);
  const [senderType, setSenderType] = useState("");
  const [form,       setForm]       = useState({
    name: "", email: "", gradeSection: "",
    subject: "", message: "",
    honeypot: "", // hidden bot trap — never shown to real users
  });
  const [errors,     setErrors]     = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState("");

  // Records when the form was opened — bots submit instantly
  const formOpenedAt = useRef(Date.now());

  function choose(key) {
    // Reset the timer each time user reaches step 2
    formOpenedAt.current = Date.now();
    setSenderType(key);
    setStep(2);
  }

  function change(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined }));
    setApiError("");
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    if (!form.subject)        e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    if (form.message.trim().length < 10) e.message = "Message is too short.";
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) { setErrors(er); return; }

    // ── Bot check: submitted too fast (under 3 seconds) ──
    if (Date.now() - formOpenedAt.current < 3000) {
      setSubmitted(true); // fake success — don't reveal the block
      return;
    }

    // ── Bot check: honeypot was filled ──
    // We still send to server but server will also silently reject it.
    // This client-side check is just an extra layer.
    if (form.honeypot) {
      setSubmitted(true); // fake success
      return;
    }

    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          honeypot:      form.honeypot,        // bot trap field
          sender_type:   senderType,
          name:          form.name,
          email:         form.email,
          grade_section: form.gradeSection || null,
          subject:       form.subject,
          message:       form.message,
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error("Server error. Please try again.");

      // ── Rate limit hit ──
      if (res.status === 429) {
        throw new Error("You've sent too many messages. Please wait an hour before trying again.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");

      setSubmitted(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
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
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0a1f52" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif" }}>
            Thank you, {form.name}.
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#4a4a4a", lineHeight: 1.75, fontFamily: "Georgia, serif" }}>
            Your message has been received. Our staff will get back to you within <strong>1–2 school days</strong>.
            For urgent concerns, please visit the school office in person or call us directly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setSenderType("");
              setForm({ name: "", email: "", gradeSection: "", subject: "", message: "", honeypot: "" });
              setApiError("");
              formOpenedAt.current = Date.now();
            }}
            style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 20px", background: "#0a1f52", color: "#f5c518", border: "none", cursor: "pointer" }}
          >
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
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>
            Step 1 — Who Are You?
          </span>
        </div>
        <div style={{ padding: "24px 20px" }}>
          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#3a3a3a", fontFamily: "Georgia, serif", lineHeight: 1.7 }}>
            Please identify yourself so we can direct your message to the right person.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SENDER_TYPES.map(s => (
              <button
                key={s.key}
                onClick={() => choose(s.key)}
                style={{ all: "unset", cursor: "pointer", padding: "18px 16px", border: "1.5px solid #0a1f52", background: "#fdfcf8", display: "flex", flexDirection: "column", gap: 4, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0a1f52"; e.currentTarget.querySelector("span").style.color = "#f5c518"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fdfcf8"; e.currentTarget.querySelector("span").style.color = "#0a1f52"; }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif", transition: "color 0.15s" }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sender      = SENDER_TYPES.find(s => s.key === senderType);
  const subjects    = SUBJECTS[senderType] || [];
  const showSection = senderType === "student" || senderType === "parent";

  return (
    <form id="contact-form" onSubmit={submit} style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
      <div style={{ background: "#0a1f52", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 16, background: "#f5c518" }} />
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,197,24,0.7)", display: "block" }}>Sending as</span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>{sender?.label}</span>
          </div>
        </div>
        <button type="button" onClick={() => setStep(1)}
          style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 12px", border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>
          ← Change
        </button>
      </div>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Honeypot — invisible to humans, bots will fill it ── */}
        <input
          name="honeypot"
          value={form.honeypot}
          onChange={change}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: "none" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <FieldWrap label="Full Name" error={errors.name} required>
            <input name="name" type="text" value={form.name} onChange={change} placeholder="Juan dela Cruz"
              style={{ ...INPUT_STYLE, borderColor: errors.name ? "#c0392b" : "#0a1f52" }} />
          </FieldWrap>
          <FieldWrap label="Email Address" error={errors.email} required>
            <input name="email" type="email" value={form.email} onChange={change} placeholder="juan@email.com"
              style={{ ...INPUT_STYLE, borderColor: errors.email ? "#c0392b" : "#0a1f52" }} />
          </FieldWrap>
        </div>

        {showSection && (
          <FieldWrap label={senderType === "student" ? "Your Grade & Section" : "Child's Grade & Section"}>
            <input name="gradeSection" type="text" value={form.gradeSection} onChange={change}
              placeholder="e.g. Grade 5 – Mabini" style={INPUT_STYLE} />
          </FieldWrap>
        )}

        <FieldWrap label="Subject / Concern" error={errors.subject} required>
          <select name="subject" value={form.subject} onChange={change}
            style={{ ...INPUT_STYLE, borderColor: errors.subject ? "#c0392b" : "#0a1f52", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1f52' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
            <option value="">— Select a subject —</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FieldWrap>

        <FieldWrap label="Your Message" error={errors.message} required>
          <textarea name="message" rows={5} value={form.message} onChange={change}
            placeholder="Please describe your concern or inquiry in detail..."
            style={{ ...INPUT_STYLE, resize: "vertical", borderColor: errors.message ? "#c0392b" : "#0a1f52" }} />
        </FieldWrap>

        {apiError && (
          <div style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "10px 14px", fontSize: 12, color: "#c0392b", fontWeight: 700, fontFamily: "Georgia, serif" }}>
            {apiError}
          </div>
        )}

        <p style={{ margin: 0, fontSize: 12, color: "#666", fontFamily: "Georgia, serif", lineHeight: 1.7, borderTop: "1px solid #e4e0d4", paddingTop: 12 }}>
          We typically respond within <strong>1–2 school days</strong>. For urgent matters, please visit the school office in person or call us directly.
        </p>

        <button type="submit" disabled={submitting}
          style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "14px", background: submitting ? "#8a9ab5" : "#0a1f52", color: "#f5c518", border: "none", cursor: submitting ? "not-allowed" : "pointer", width: "100%", transition: "background 0.15s" }}>
          {submitting ? "Sending…" : "Submit Message"}
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
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "80px 24px 96px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p style={{ color: "#facc15", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
              San Roque Elementary School
            </p>
            <h1 style={{ margin: "0 0 20px 0", color: "#fff", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              Contact <span style={{ color: "#facc15" }}>Us</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
              We are here for every student, parent, and teacher. Reach out and our staff will be happy to assist you.
            </p>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 16px 72px" }}>

        {/* INFO STRIP */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 40 }}>
          {[
            { key: "Location",     main: "San Roque, Viga",     sub: "Catanduanes, Philippines" },
            { key: "School Hours", main: "Mon – Fri",           sub: "7:00 AM – 5:00 PM"        },
            { key: "Email",        main: "113330@deped.gov.ph", sub: null                        },
            { key: "Phone",        main: "+63 9605519104",      sub: null                        },
          ].map(i => (
            <div key={i.key} style={{ background: "#0a1f52", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f5c518" }}>{i.key}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", wordBreak: "break-all" }}>{i.main}</span>
              {i.sub && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{i.sub}</span>}
            </div>
          ))}
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          <ContactForm />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Who to Approach */}
            <div style={{ border: "1.5px solid #0a1f52", background: "#fff", overflow: "hidden" }}>
              <div style={{ background: "#0a1f52", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 16, background: "#f5c518" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Who to Approach</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {OFFICES.map((o, i) => (
                  <div key={i} style={{ padding: "14px 18px", borderBottom: i < OFFICES.length - 1 ? "1px solid #e4e0d4" : "none" }}>
                    <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif" }}>{o.label}</p>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#5a5a5a" }}>{o.hours}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: "#0a1f52", opacity: 0.6, fontFamily: "Georgia, serif", lineHeight: 1.5 }}>{o.note}</p>
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
              {QUICK_LINKS.map((l, i) => (
                <a key={i} href={l.href}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", textDecoration: "none", borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid #e4e0d4" : "none", fontSize: 12.5, fontWeight: 700, color: "#0a1f52", fontFamily: "Georgia, serif", transition: "background 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f5c518"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  {l.label}
                  <span style={{ fontSize: 14, color: "#0a1f52", opacity: 0.4, flexShrink: 0, marginLeft: 8 }}>→</span>
                </a>
              ))}
            </div>

            {/* Public school notice */}
            <div style={{ background: "#fffbea", border: "1.5px solid #f5c518", padding: "14px 18px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#92400e" }}>Public School Notice</p>
              <p style={{ margin: 0, fontSize: 12.5, color: "#78350f", fontFamily: "Georgia, serif", lineHeight: 1.7 }}>
                San Roque Elementary School is a <strong>free public school</strong> under the Department of Education (DepEd). We do not collect tuition or enrollment fees. For concerns about DepEd policies or school governance, you may also contact the <strong>Schools Division of Catanduanes</strong>.
              </p>
            </div>

            {/* Map */}
            <div style={{ border: "1.5px solid #0a1f52", overflow: "hidden" }}>
              <div style={{ background: "#0a1f52", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 16, background: "#f5c518" }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Find Us</span>
              </div>
              <iframe title="SRES Location" src="https://maps.google.com/maps?q=Viga,+Catanduanes&output=embed"
                width="100%" height="180" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}