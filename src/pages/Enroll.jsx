import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const BG    = "#f2efe8";
const CARD  = "#fff";
const SERIF = "Georgia, serif";

const GRADE_LEVELS = [
  "Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
];

const STEPS = [
  { label: "Enrollment" },
  { label: "Student"    },
  { label: "Parent"     },
  { label: "Emergency"  },
  { label: "Documents"  },
  { label: "Review"     },
];

/* ─── Field wrapper ──────────────────────────────────────── */
function Field({ label, required, hint, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV }}>
        {label}{required && <span style={{ color: "#c0392b", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && <span style={{ fontSize: 11, color: "#5a5a5a", fontFamily: SERIF }}>{hint}</span>}
      {error        && <span style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}>{error}</span>}
    </div>
  );
}

const baseInput = (err) => ({
  fontSize: 13.5, fontFamily: SERIF, color: "#1a1a1a",
  padding: "10px 14px", border: `1.5px solid ${err ? "#c0392b" : NAV}`,
  background: "#fdfcf8", outline: "none", width: "100%", boxSizing: "border-box",
  appearance: "none",
});

function Inp({ name, type = "text", value, onChange, placeholder, error }) {
  return <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} style={baseInput(error)} />;
}

function Sel({ name, value, onChange, options, placeholder, error }) {
  return (
    <select name={name} value={value} onChange={onChange} style={{
      ...baseInput(error),
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230a1f52' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
    }}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ name, value, onChange, placeholder, rows = 3, error }) {
  return <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...baseInput(error), resize: "vertical" }} />;
}

/* ─── Radio tile ─────────────────────────────────────────── */
function RadioTile({ name, value, label, checked, onChange }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
      border: `1.5px solid ${checked ? GOLD : NAV}`,
      background: checked ? NAV : "#fdfcf8", cursor: "pointer", transition: "all .15s",
    }}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
        style={{ width: 16, height: 16, accentColor: GOLD, flexShrink: 0 }} />
      <span style={{ fontSize: 13.5, fontFamily: SERIF, fontWeight: 700, color: checked ? "#fff" : NAV }}>
        {label}
      </span>
    </label>
  );
}

/* ─── Section card ───────────────────────────────────────── */
function SectionCard({ title, children }) {
  return (
    <div style={{ border: `1.5px solid ${NAV}`, background: CARD, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ background: NAV, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 4, height: 16, background: GOLD }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "20px 18px" }}>{children}</div>
    </div>
  );
}

/* ─── Responsive grids ───────────────────────────────────── */
const g2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };
const g3 = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 };

/* ─── Document item ──────────────────────────────────────── */
function DocItem({ label, required, sub, showUpload = true, checked, onChange }) {
  return (
    <div style={{
      border: `1.5px solid ${checked ? GOLD : "#c8c4b8"}`,
      background: checked ? "#fffbea" : "#fdfcf8",
      padding: "14px 16px", marginBottom: 10, transition: "all .15s",
    }}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: showUpload ? 12 : 0 }}>
        <input type="checkbox" checked={checked} onChange={onChange}
          style={{ width: 16, height: 16, marginTop: 2, accentColor: NAV, flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: NAV, fontFamily: SERIF }}>
            {label}
            {required && (
              <span style={{
                marginLeft: 8, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase", padding: "2px 8px",
                border: "1.5px solid #c0392b", color: "#c0392b", background: "#fef0f0",
              }}>Required</span>
            )}
          </span>
          {sub && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#5a5a5a", fontFamily: SERIF }}>{sub}</p>}
        </div>
      </label>
      {showUpload && (
        <>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" style={{
            display: "block", width: "100%", fontSize: 12, color: "#5a5a5a",
            fontFamily: SERIF, cursor: "pointer", border: `1.5px dashed ${NAV}`,
            padding: "8px 10px", background: "#fff", boxSizing: "border-box",
          }} />
          <p style={{ margin: "5px 0 0", fontSize: 11, color: "#888", fontFamily: SERIF }}>
            JPEG, PNG or PDF · max 5 MB
          </p>
        </>
      )}
    </div>
  );
}

/* ─── Step bar ───────────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div style={{ background: NAV }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 8px",
        display: "flex", flexWrap: "wrap",
        borderBottom: `4px solid ${GOLD}`,
      }}>
        {STEPS.map((s, i) => {
          const active = i === current;
          const done   = i < current;
          return (
            <div key={i} style={{
              flex: "1 1 auto",
              padding: "clamp(8px,1.5vw,12px) clamp(6px,2vw,14px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2,
              background: active ? GOLD : done ? "#1e3a7a" : "transparent",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{
                fontSize: "clamp(10px,2vw,13px)", fontWeight: 900,
                color: active ? NAV : done ? GOLD : "rgba(255,255,255,0.3)",
              }}>
                {done ? "✓" : i + 1}
              </span>
              <span style={{
                fontSize: "clamp(7px,1.5vw,9px)", fontWeight: 800,
                letterSpacing: "0.08em", textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: active ? NAV : done ? GOLD : "rgba(255,255,255,0.3)",
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Nav buttons ────────────────────────────────────────── */
function NavRow({ onBack, onNext, nextLabel = "Next →", gold = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 10, flexWrap: "wrap" }}>
      {onBack
        ? <button onClick={onBack} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 22px", border: `1.5px solid ${NAV}`, background: "transparent", color: NAV, cursor: "pointer" }}>← Back</button>
        : <div />}
      <button onClick={onNext} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 28px", border: "none", background: gold ? GOLD : NAV, color: gold ? NAV : GOLD, cursor: "pointer" }}>
        {nextLabel}
      </button>
    </div>
  );
}

/* ─── Review helpers ─────────────────────────────────────── */
function RevSection({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 4, height: 14, background: GOLD }} />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function RevRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 13, flexWrap: "wrap" }}>
      <span style={{ minWidth: 140, flexShrink: 0, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,197,24,0.75)", paddingTop: 2 }}>
        {label}
      </span>
      <span style={{ color: "rgba(255,255,255,0.88)", fontFamily: SERIF, flex: 1 }}>
        {value || "—"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Enroll() {
  const [step, setStep]     = useState(0);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    enrollmentStatus: "", gradeLevel: "",
    firstName: "", middleName: "", lastName: "",
    dateOfBirth: "", gender: "", studentEmail: "",
    previousSchool: "", specialNeeds: "",
    parentName: "", relationship: "",
    mobileNumber: "", landline: "", email: "", address: "",
    emergencyName: "", emergencyRelationship: "", emergencyPhone: "",
    doc_birth: false, doc_report: false, doc_tor: false,
    doc_brgy: false, doc_id: false,
  });

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const next = () => { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ── Success ────────────────────────────────────────────── */
  if (step === 6) {
    return (
      <div style={{ background: BG, minHeight: "100vh" }}>
        <div style={{ background: NAV, borderBottom: `4px solid ${GOLD}`, padding: "16px 20px" }}>
          <p style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            San Roque Elementary School
          </p>
        </div>
        <div style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px" }}>
          <div style={{ border: `1.5px solid ${NAV}`, background: CARD, overflow: "hidden" }}>
            <div style={{ background: NAV, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 16, background: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Enrollment Submitted</span>
            </div>
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={NAV} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: NAV, fontFamily: SERIF }}>Thank you, {form.firstName}!</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "#3a3a3a", lineHeight: 1.75, fontFamily: SERIF }}>
                Your enrollment has been submitted. A confirmation will be sent to{" "}
                <strong style={{ color: NAV }}>{form.email}</strong>.
              </p>
              <div style={{ background: NAV, padding: "18px 20px", textAlign: "left", marginBottom: 24 }}>
                <p style={{ margin: "0 0 12px", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD }}>
                  What happens next?
                </p>
                <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Bring original copies of required documents to the school office",
                    "School staff will review your application",
                    "You will be contacted for orientation details",
                  ].map((t, i) => (
                    <li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", fontFamily: SERIF, lineHeight: 1.6 }}>{t}</li>
                  ))}
                </ol>
              </div>
              <a href="/" style={{ display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "12px 28px", background: NAV, color: GOLD, textDecoration: "none" }}>
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f2efe8", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────
          FIX 1: paddingBottom: 0 so the absolute gold bar sits
                 flush at the very bottom — no gap, no overlap.
          FIX 2: h1 uses whiteSpace "nowrap" + clamp font size
                 so "Enrollment Form" stays on ONE line like
                 the Announcement page, scaling down on mobile.
      ──────────────────────────────────────────────────── */}
      <section style={{
        background: "#0a1f52",
        position: "relative",
        overflow: "hidden",
        minHeight: 300,
        /* paddingBottom: 0 is the default — the gold bar is
           absolute at bottom:0 so it always hugs the edge */
      }}>

        {/* Right photo panel */}
        <div style={{
          position: "absolute", right: 0, top: 0,
          width: "60%", height: "100%",
          clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
        }}>
          <img src={HERO_IMG} alt="SRES Campus"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,31,82,0.45)" }} />
        </div>

        {/* Gold bar — identical to Announcement page */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 4,
          background: "linear-gradient(to right, #92400e, #facc15, #92400e)",
          zIndex: 10,
        }} />

        {/* Hero content */}
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1280, margin: "0 auto",
          /* Extra bottom padding keeps text clear of the 4px gold bar */
          padding: "80px 24px 100px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: 640 }}>

            <p style={{
              color: "#facc15", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.2em", textTransform: "uppercase",
              margin: "0 0 12px 0",
            }}>
              San Roque Elementary School
            </p>

            {/* FIX: one line, scales with viewport, never wraps */}
            <h1 style={{
              margin: "0 0 20px 0",
              color: "#fff",
              fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",   /* ← keeps it on one line */
            }}>
              Enrollment <span style={{ color: "#facc15" }}>Form</span>
            </h1>

            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(13px, 2vw, 15px)",
              lineHeight: 1.7,
              maxWidth: 448,
              margin: 0,
            }}>
              School Year 2025–2026. Complete all sections to secure your child's place.
            </p>

          </div>
        </div>
      </section>

      {/* Step bar — sits directly below hero, gold bar from hero is flush above it */}
      <StepBar current={step} />

      {/* Data notice — only on step 0 */}
      {step === 0 && (
        <div style={{ background: "#fffbea", borderBottom: `3px solid ${GOLD}` }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 20px" }}>
            <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#92400e" }}>
              How we use your information
            </p>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 2 }}>
              {["Processing your child's enrollment and creating student records", "Emergency contact and school communications", "All data handled confidentially and securely"].map((t, i) => (
                <li key={i} style={{ fontSize: 12, color: "#78350f", fontFamily: SERIF, lineHeight: 1.65 }}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 72px" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <>
            <SectionCard title="Enrollment details">
              <div style={g2}>
                <Field label="Student type" required>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
                    {["New Student", "Transferee", "Returnee"].map((v) => (
                      <RadioTile key={v} name="enrollmentStatus" value={v} label={v}
                        checked={form.enrollmentStatus === v} onChange={set("enrollmentStatus")} />
                    ))}
                  </div>
                </Field>
                <Field label="Grade level" required hint="Select the grade your child will enter this school year">
                  <Sel name="gradeLevel" value={form.gradeLevel} onChange={set("gradeLevel")}
                    options={GRADE_LEVELS} placeholder="— Select grade level —" />
                </Field>
              </div>
            </SectionCard>
            <NavRow onNext={next} nextLabel="Next: Student Info →" />
          </>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <SectionCard title="Student information">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={g3}>
                  <Field label="First name" required><Inp name="firstName" value={form.firstName} onChange={set("firstName")} placeholder="Juan" /></Field>
                  <Field label="Middle name"><Inp name="middleName" value={form.middleName} onChange={set("middleName")} placeholder="Santos" /></Field>
                  <Field label="Last name" required><Inp name="lastName" value={form.lastName} onChange={set("lastName")} placeholder="Dela Cruz" /></Field>
                </div>
                <div style={g3}>
                  <Field label="Date of birth" required><Inp name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} /></Field>
                  <Field label="Gender" required>
                    <Sel name="gender" value={form.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} placeholder="— Select —" />
                  </Field>
                  <Field label="Student email" hint="Leave blank if not applicable">
                    <Inp name="studentEmail" type="email" value={form.studentEmail} onChange={set("studentEmail")} placeholder="optional" />
                  </Field>
                </div>
                <div style={g2}>
                  <Field label="Previous school" hint="For transferees only"><Inp name="previousSchool" value={form.previousSchool} onChange={set("previousSchool")} placeholder="Name of previous school" /></Field>
                  <Field label="Special needs / concerns" hint="Leave blank if none"><Inp name="specialNeeds" value={form.specialNeeds} onChange={set("specialNeeds")} placeholder="e.g. hearing impairment" /></Field>
                </div>
              </div>
            </SectionCard>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Parent Info →" />
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <SectionCard title="Parent / guardian information">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={g2}>
                  <Field label="Full name" required><Inp name="parentName" value={form.parentName} onChange={set("parentName")} placeholder="Maria Santos Dela Cruz" /></Field>
                  <Field label="Relationship to student" required>
                    <Sel name="relationship" value={form.relationship} onChange={set("relationship")} options={["Mother", "Father", "Guardian", "Other"]} placeholder="— Select —" />
                  </Field>
                </div>
                <div style={g3}>
                  <Field label="Mobile number" required><Inp name="mobileNumber" type="tel" value={form.mobileNumber} onChange={set("mobileNumber")} placeholder="09XX-XXX-XXXX" /></Field>
                  <Field label="Landline" hint="Optional"><Inp name="landline" type="tel" value={form.landline} onChange={set("landline")} placeholder="(052) XXX-XXXX" /></Field>
                  <Field label="Email address" required><Inp name="email" type="email" value={form.email} onChange={set("email")} placeholder="parent@email.com" /></Field>
                </div>
                <Field label="Complete home address" required>
                  <Textarea name="address" value={form.address} onChange={set("address")} placeholder="House/Lot No., Street, Barangay, Municipality, Province" rows={3} />
                </Field>
              </div>
            </SectionCard>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Emergency →" />
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <SectionCard title="Emergency contact">
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.7 }}>
                Who should we call if we cannot reach the parent or guardian?
              </p>
              <div style={g3}>
                <Field label="Full name" required><Inp name="emergencyName" value={form.emergencyName} onChange={set("emergencyName")} placeholder="e.g. Roberto Cruz" /></Field>
                <Field label="Relationship" required><Inp name="emergencyRelationship" value={form.emergencyRelationship} onChange={set("emergencyRelationship")} placeholder="e.g. Uncle, Aunt" /></Field>
                <Field label="Contact number" required><Inp name="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={set("emergencyPhone")} placeholder="09XX-XXX-XXXX" /></Field>
              </div>
            </SectionCard>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Documents →" />
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <SectionCard title="Required documents">
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.7 }}>
                Check the documents you have and upload a scan or photo. Bring originals to school.
                Items marked <strong style={{ color: "#c0392b" }}>Required</strong> must be submitted to complete enrollment.
              </p>
              <DocItem label="Birth Certificate" required sub="PSA or Local Civil Registry copy" checked={form.doc_birth} onChange={set("doc_birth")} />
              <DocItem label="Latest Report Card" required sub="Most recent school year" checked={form.doc_report} onChange={set("doc_report")} />
              <DocItem label="Transcript of Records / Form 137" sub="For transferees only" checked={form.doc_tor} onChange={set("doc_tor")} />
              <DocItem label="Barangay Residency Certificate" sub="Issued by your local barangay hall" checked={form.doc_brgy} onChange={set("doc_brgy")} />
              <DocItem label="2×2 ID Pictures (4 copies)" showUpload={false} sub="Bring physical copies to the school office — no upload needed" checked={form.doc_id} onChange={set("doc_id")} />
            </SectionCard>
            <NavRow onBack={back} onNext={next} nextLabel="Review & Submit →" />
          </>
        )}

        {/* STEP 5 — Review */}
        {step === 5 && (
          <>
            <div style={{ border: `1.5px solid ${NAV}`, background: NAV, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1.5px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: 4, height: 16, background: GOLD }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>Review your information</span>
              </div>
              <div style={{ padding: "20px 18px" }}>
                <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: SERIF, lineHeight: 1.75 }}>
                  Please check everything carefully. Go back to make any changes before submitting.
                </p>
                <RevSection title="Enrollment details">
                  <RevRow label="Student type" value={form.enrollmentStatus} />
                  <RevRow label="Grade level" value={form.gradeLevel} />
                </RevSection>
                <RevSection title="Student information">
                  <RevRow label="Full name" value={[form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ")} />
                  <RevRow label="Date of birth" value={form.dateOfBirth} />
                  <RevRow label="Gender" value={form.gender} />
                  <RevRow label="Student email" value={form.studentEmail} />
                  <RevRow label="Previous school" value={form.previousSchool} />
                  <RevRow label="Special needs" value={form.specialNeeds} />
                </RevSection>
                <RevSection title="Parent / guardian">
                  <RevRow label="Full name" value={form.parentName} />
                  <RevRow label="Relationship" value={form.relationship} />
                  <RevRow label="Mobile" value={form.mobileNumber} />
                  <RevRow label="Landline" value={form.landline} />
                  <RevRow label="Email" value={form.email} />
                  <RevRow label="Address" value={form.address} />
                </RevSection>
                <RevSection title="Emergency contact">
                  <RevRow label="Full name" value={form.emergencyName} />
                  <RevRow label="Relationship" value={form.emergencyRelationship} />
                  <RevRow label="Contact number" value={form.emergencyPhone} />
                </RevSection>
                <RevSection title="Documents">
                  <RevRow label="Birth Certificate" value={form.doc_birth ? "✓ Will provide" : "Not checked"} />
                  <RevRow label="Report Card" value={form.doc_report ? "✓ Will provide" : "Not checked"} />
                  <RevRow label="Transcript / Form 137" value={form.doc_tor ? "✓ Will provide" : "Not checked"} />
                  <RevRow label="Barangay Certificate" value={form.doc_brgy ? "✓ Will provide" : "Not checked"} />
                  <RevRow label="2×2 ID Pictures" value={form.doc_id ? "✓ Will bring" : "Not checked"} />
                </RevSection>
              </div>
            </div>

            {/* Agreement */}
            <label style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              border: `1.5px solid ${agreed ? GOLD : NAV}`,
              background: agreed ? "#fffbea" : CARD,
              padding: "16px 18px", marginBottom: 14, cursor: "pointer", transition: "all .15s",
            }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: 17, height: 17, marginTop: 2, accentColor: NAV, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#1a1a1a", fontFamily: SERIF, lineHeight: 1.75 }}>
                I certify that all information provided is true and correct. I authorize San Roque Elementary School to verify the details submitted and use this data for enrollment purposes.
              </span>
            </label>

            <NavRow
              onBack={back}
              onNext={() => {
                if (!agreed) { alert("Please confirm your information is accurate before submitting."); return; }
                setStep(6);
              }}
              nextLabel="Submit Enrollment"
              gold
            />
          </>
        )}
      </main>
    </div>
  );
}