import { useState } from "react";

const inputCls =
  "w-full bg-[#f8fafc] border-[1.5px] border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0a1f52] focus:bg-white focus:ring-2 focus:ring-[#0a1f52]/10";

/* ── Helpers ── */
function getAge(dob) {
  const today = new Date(), birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function checkAgeForGrade(grade, age) {
  const ranges = {
    Kindergarten: [5, 7], "Grade 1": [6, 8], "Grade 2": [7, 9],
    "Grade 3": [8, 10], "Grade 4": [9, 11], "Grade 5": [10, 12], "Grade 6": [11, 14],
  };
  const r = ranges[grade];
  if (!r) return true;
  return age >= r[0] && age <= r[1];
}

function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function validPHPhone(n) { return /^(09|\+639)\d{9}$/.test(n.replace(/[-\s]/g, "")); }

/* ── Sub-components ── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.8rem] font-bold text-[#1e293b]">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
      {hint && <span className="text-[0.73rem] text-[#64748b]">{hint}</span>}
      {error && <span className="text-[0.73rem] text-red-600 font-semibold">{error}</span>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl p-6 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[0.7rem] font-extrabold uppercase tracking-widest text-[#0a1f52]">{title}</span>
        <div className="flex-1 h-0.5 bg-[#f59e0b] rounded" />
      </div>
      {children}
    </div>
  );
}

const STEPS = ["Enrollment", "Student", "Parent", "Emergency", "Documents", "Review"];

function StepBar({ current }) {
  return (
    <div className="bg-[#0a1f52] rounded-2xl p-3 mb-6 flex gap-1.5">
      {STEPS.map((label, i) => (
        <div
          key={label}
          className={`flex-1 rounded-xl py-2 text-center text-[0.68rem] font-bold transition-all
            ${i === current ? "bg-[#f59e0b] text-[#0a1f52]"
            : i < current  ? "bg-[#1e3a7a] text-[#f59e0b]"
            : "text-[#7a94c4]"}`}
        >
          <span className="block text-base font-extrabold leading-none mb-0.5">{i + 1}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="h-1.5 bg-[#dde3f0] rounded-full mb-4 overflow-hidden">
      <div
        className="h-full bg-[#f59e0b] rounded-full transition-all duration-500"
        style={{ width: `${((step + 1) / 6) * 100}%` }}
      />
    </div>
  );
}

function NavRow({ onBack, onNext, nextLabel = "Next", gold = false }) {
  return (
    <div className="flex justify-between items-center mt-5 mb-8">
      {onBack ? (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full border-[1.5px] border-[#cbd5e1] bg-white text-[#475569] text-sm font-bold hover:bg-[#f1f5f9] transition-colors"
        >
          ‹ Back
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        className={`inline-flex items-center gap-1 px-6 py-2.5 rounded-full border-none text-sm font-bold transition-colors
          ${gold ? "bg-[#f59e0b] text-[#0a1f52] hover:bg-[#d97706]" : "bg-[#0a1f52] text-white hover:bg-[#1a3a8a]"}`}
      >
        {nextLabel}
      </button>
    </div>
  );
}

function RadioOpt({ name, value, label, checked, onChange }) {
  return (
    <label className={`flex items-center gap-3 px-3.5 py-2.5 border-[1.5px] rounded-xl cursor-pointer transition-all
      ${checked ? "border-[#0a1f52] bg-blue-50" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
      <input
        type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="w-4 h-4 accent-[#0a1f52] flex-shrink-0"
      />
      <span className="text-sm font-semibold text-[#1e293b]">{label}</span>
    </label>
  );
}

function DocItem({ label, required, sub, showUpload = true, checked, onCheck }) {
  return (
    <div className={`border-[1.5px] rounded-xl p-4 mb-3 transition-all
      ${checked ? "border-[#0a1f52] bg-blue-50" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
      <label className="flex items-start gap-3 cursor-pointer mb-3">
        <input
          type="checkbox" checked={checked} onChange={onCheck}
          className="w-[18px] h-[18px] mt-0.5 accent-[#0a1f52] flex-shrink-0"
        />
        <div>
          <span className="text-sm font-bold text-[#1e293b]">
            {label}
            {required && (
              <span className="ml-2 text-[0.65rem] font-bold bg-red-50 text-red-600 border border-red-300 px-2 py-0.5 rounded-full align-middle">
                Required
              </span>
            )}
          </span>
          {sub && <p className="text-[0.775rem] text-[#64748b] mt-0.5">{sub}</p>}
        </div>
      </label>
      {showUpload && (
        <>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf"
            className="w-full px-3 py-2 bg-white border-[1.5px] border-dashed border-[#cbd5e1] rounded-lg text-[0.78rem] text-[#64748b] cursor-pointer"
          />
          <p className="text-[0.73rem] text-[#94a3b8] mt-1.5">JPEG, PNG or PDF · max 5 MB</p>
        </>
      )}
    </div>
  );
}

function RevSection({ title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[0.7rem] font-extrabold uppercase tracking-widest text-[#0a1f52]">{title}</span>
        <div className="flex-1 h-0.5 bg-[#fde68a] rounded" />
      </div>
      {children}
    </div>
  );
}

function RevRow({ label, value }) {
  return (
    <div className="flex gap-2 py-2 border-b border-[#f1f5f9] last:border-b-0 text-sm">
      <span className="w-40 flex-shrink-0 text-[#64748b] font-semibold">{label}</span>
      <span className="text-[#1e293b] font-semibold">{value || "—"}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Enroll() {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

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

  /* ── Validation ── */
  function validate(s) {
    const f = form;
    const errs = {};

    if (s === 0) {
      if (!f.enrollmentStatus) errs.enrollmentStatus = "Please select a student type.";
      if (!f.gradeLevel) errs.gradeLevel = "Please select a grade level.";
      if (f.gradeLevel && f.dateOfBirth) {
        const age = getAge(f.dateOfBirth);
        if (!checkAgeForGrade(f.gradeLevel, age))
          errs.gradeLevel = "Your child's age does not match the selected grade level.";
      }
    }

    if (s === 1) {
      if (!f.firstName.trim())  errs.firstName  = "First name is required.";
      if (!f.lastName.trim())   errs.lastName   = "Last name is required.";
      if (!f.dateOfBirth)       errs.dateOfBirth = "Date of birth is required.";
      if (!f.gender)            errs.gender     = "Please select a gender.";
      if (f.studentEmail && !validEmail(f.studentEmail))
        errs.studentEmail = "Enter a valid email address.";
    }

    if (s === 2) {
      if (!f.parentName.trim()) errs.parentName = "Parent/guardian name is required.";
      if (!f.relationship)      errs.relationship = "Please select a relationship.";
      if (!f.mobileNumber.trim()) errs.mobileNumber = "Mobile number is required.";
      else if (!validPHPhone(f.mobileNumber))
        errs.mobileNumber = "Enter a valid PH mobile number (e.g. 09XX-XXX-XXXX).";
      if (!f.email.trim())      errs.email   = "Email address is required.";
      else if (!validEmail(f.email)) errs.email = "Enter a valid email address.";
      if (!f.address.trim())    errs.address = "Complete home address is required.";
    }

    if (s === 3) {
      if (!f.emergencyName.trim())         errs.emergencyName         = "Emergency contact name is required.";
      if (!f.emergencyRelationship.trim()) errs.emergencyRelationship = "Relationship is required.";
      if (!f.emergencyPhone.trim())        errs.emergencyPhone        = "Contact number is required.";
      else if (!validPHPhone(f.emergencyPhone))
        errs.emergencyPhone = "Enter a valid PH mobile number (e.g. 09XX-XXX-XXXX).";
    }

    return errs;
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    try { window.parent.scrollTo({ top: 0, behavior: "smooth" }); } catch (_) {}
  }

  function next() {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
    scrollTop();
  }

  function back() {
    setErrors({});
    setStep((s) => s - 1);
    scrollTop();
  }

  /* ── Success ── */
  if (step === 6) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white border-[1.5px] border-[#e2e8f0] rounded-2xl p-8 text-center">
          <div className="w-[72px] h-[72px] bg-emerald-50 border-[3px] border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-[#0a1f52] mb-2">Enrollment submitted!</h2>
          <p className="text-sm text-[#475569] font-medium mb-6">
            Thank you for enrolling with San Roque Elementary School. A confirmation will be sent to{" "}
            <strong className="text-[#0a1f52]">{form.email}</strong>.
          </p>
          <div className="bg-[#fffbeb] border-[1.5px] border-[#fcd34d] rounded-2xl p-4 text-left mb-6">
            <p className="text-[0.825rem] font-extrabold text-[#78350f] mb-2">What happens next?</p>
            <ol className="list-decimal pl-5 text-[0.825rem] text-[#92400e] font-semibold space-y-1.5 leading-relaxed">
              <li>Bring original copies of required documents to the school office</li>
              <li>School staff will review your application</li>
              <li>You will be contacted for orientation details</li>
            </ol>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#0a1f52] hover:bg-[#1a3a8a] text-white font-bold text-sm px-7 py-3 rounded-full transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const e = errors;

  return (
    <div className="min-h-screen bg-[#f0f4ff] py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="bg-[#0a1f52] rounded-2xl px-6 py-8 text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white mb-1">Enrollment Form</h1>
          <p className="text-[#a8bfe8] text-sm">San Roque Elementary School · School Year 2025–2026</p>
        </div>

        {/* Notice */}
        <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] rounded-xl px-5 py-4 mb-6">
          <p className="text-[0.875rem] font-bold text-[#78350f] mb-1.5">How we use your information</p>
          <ul className="list-disc pl-4 text-[0.825rem] text-[#92400e] font-semibold space-y-0.5 leading-loose">
            <li>Processing your child's enrollment and creating student records</li>
            <li>Emergency contact and school communications</li>
            <li>All data is handled confidentially and securely</li>
          </ul>
        </div>

        <ProgressBar step={step} />
        <StepBar current={step} />

        {/* ── Step 0: Enrollment ── */}
        {step === 0 && (
          <>
            <Card title="Enrollment details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <Field label="Student type" required error={e.enrollmentStatus}>
                  <div className="flex flex-col gap-2 mt-1">
                    {["New Student", "Transferee", "Returnee"].map((v) => (
                      <RadioOpt key={v} name="enrollmentStatus" value={v} label={v}
                        checked={form.enrollmentStatus === v} onChange={set("enrollmentStatus")} />
                    ))}
                  </div>
                </Field>
                <Field label="Grade level" required hint="Select the grade your child will enter this school year" error={e.gradeLevel}>
                  <select className={inputCls} value={form.gradeLevel} onChange={set("gradeLevel")}>
                    <option value="">Select grade level</option>
                    {["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </Card>
            <NavRow onNext={next} nextLabel="Next: Student info ›" />
          </>
        )}

        {/* ── Step 1: Student ── */}
        {step === 1 && (
          <>
            <Card title="Student information">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Field label="First name" required error={e.firstName}>
                  <input className={inputCls} placeholder="Juan" value={form.firstName} onChange={set("firstName")} />
                </Field>
                <Field label="Middle name">
                  <input className={inputCls} placeholder="Santos" value={form.middleName} onChange={set("middleName")} />
                </Field>
                <Field label="Last name" required error={e.lastName}>
                  <input className={inputCls} placeholder="Dela Cruz" value={form.lastName} onChange={set("lastName")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Field label="Date of birth" required error={e.dateOfBirth}>
                  <input type="date" className={inputCls} value={form.dateOfBirth} onChange={set("dateOfBirth")} />
                </Field>
                <Field label="Gender" required error={e.gender}>
                  <select className={inputCls} value={form.gender} onChange={set("gender")}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </Field>
                <Field label="Student email" hint="Leave blank if none" error={e.studentEmail}>
                  <input type="email" className={inputCls} placeholder="optional" value={form.studentEmail} onChange={set("studentEmail")} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Previous school" hint="For transferees only">
                  <input className={inputCls} placeholder="Name of previous school" value={form.previousSchool} onChange={set("previousSchool")} />
                </Field>
                <Field label="Special needs / concerns" hint="Leave blank if none">
                  <input className={inputCls} placeholder="e.g. hearing impairment" value={form.specialNeeds} onChange={set("specialNeeds")} />
                </Field>
              </div>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Parent info ›" />
          </>
        )}

        {/* ── Step 2: Parent ── */}
        {step === 2 && (
          <>
            <Card title="Parent / guardian information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field label="Full name" required error={e.parentName}>
                  <input className={inputCls} placeholder="Maria Santos Dela Cruz" value={form.parentName} onChange={set("parentName")} />
                </Field>
                <Field label="Relationship to student" required error={e.relationship}>
                  <select className={inputCls} value={form.relationship} onChange={set("relationship")}>
                    <option value="">Select</option>
                    <option>Mother</option><option>Father</option><option>Guardian</option><option>Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Field label="Mobile number" required error={e.mobileNumber}>
                  <input type="tel" className={inputCls} placeholder="09XX-XXX-XXXX" value={form.mobileNumber} onChange={set("mobileNumber")} />
                </Field>
                <Field label="Landline" hint="Optional">
                  <input type="tel" className={inputCls} placeholder="(052) XXX-XXXX" value={form.landline} onChange={set("landline")} />
                </Field>
                <Field label="Email address" required error={e.email}>
                  <input type="email" className={inputCls} placeholder="parent@email.com" value={form.email} onChange={set("email")} />
                </Field>
              </div>
              <Field label="Complete home address" required error={e.address}>
                <textarea className={inputCls + " resize-y min-h-[80px]"}
                  placeholder="House/Lot No., Street, Barangay, Municipality, Province"
                  value={form.address} onChange={set("address")} />
              </Field>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Emergency ›" />
          </>
        )}

        {/* ── Step 3: Emergency ── */}
        {step === 3 && (
          <>
            <Card title="Emergency contact">
              <p className="text-[0.825rem] text-[#475569] font-medium mb-4">
                Who should we call if we cannot reach the parent or guardian?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Full name" required error={e.emergencyName}>
                  <input className={inputCls} placeholder="e.g. Roberto Cruz" value={form.emergencyName} onChange={set("emergencyName")} />
                </Field>
                <Field label="Relationship" required error={e.emergencyRelationship}>
                  <input className={inputCls} placeholder="e.g. Uncle, Aunt" value={form.emergencyRelationship} onChange={set("emergencyRelationship")} />
                </Field>
                <Field label="Contact number" required error={e.emergencyPhone}>
                  <input type="tel" className={inputCls} placeholder="09XX-XXX-XXXX" value={form.emergencyPhone} onChange={set("emergencyPhone")} />
                </Field>
              </div>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Documents ›" />
          </>
        )}

        {/* ── Step 4: Documents ── */}
        {step === 4 && (
          <>
            <Card title="Required documents">
              <p className="text-[0.825rem] text-[#475569] font-medium mb-4">
                Check the documents you have and upload a scan or photo. Bring originals to school.
                Items marked <span className="text-red-600 font-bold">Required</span> must be submitted to complete enrollment.
              </p>
              <DocItem label="Birth Certificate" required sub="PSA or Local Civil Registry copy"
                checked={form.doc_birth} onCheck={set("doc_birth")} />
              <DocItem label="Latest Report Card" required sub="Most recent school year"
                checked={form.doc_report} onCheck={set("doc_report")} />
              <DocItem label="Transcript of Records / Form 137" sub="For transferees only — leave blank if not applicable"
                checked={form.doc_tor} onCheck={set("doc_tor")} />
              <DocItem label="Barangay Residency Certificate" sub="Issued by your local barangay hall"
                checked={form.doc_brgy} onCheck={set("doc_brgy")} />
              <DocItem label="2×2 ID Pictures (4 copies)" showUpload={false}
                sub="Bring physical copies to the school office — no upload needed"
                checked={form.doc_id} onCheck={set("doc_id")} />
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Review & submit ›" />
          </>
        )}

        {/* ── Step 5: Review ── */}
        {step === 5 && (
          <>
            <Card title="Review your information">
              <p className="text-[0.825rem] text-[#475569] font-medium mb-4">
                Please check everything carefully. Go back to make changes before submitting.
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
                <RevRow label="Birth Certificate"    value={form.doc_birth  ? "✓ Will provide" : "Not checked"} />
                <RevRow label="Report Card"          value={form.doc_report ? "✓ Will provide" : "Not checked"} />
                <RevRow label="Transcript / Form 137" value={form.doc_tor  ? "✓ Will provide" : "Not checked"} />
                <RevRow label="Barangay Certificate" value={form.doc_brgy  ? "✓ Will provide" : "Not checked"} />
                <RevRow label="2×2 ID Pictures"      value={form.doc_id    ? "✓ Will bring"   : "Not checked"} />
              </RevSection>
            </Card>

            <label className={`flex items-start gap-3 border-[1.5px] rounded-2xl px-5 py-4 mb-5 cursor-pointer transition-all
              ${agreed ? "border-[#0a1f52] bg-blue-50" : "border-[#fcd34d] bg-[#fffbeb]"}`}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="w-[18px] h-[18px] mt-0.5 accent-[#0a1f52] flex-shrink-0" />
              <span className="text-sm text-[#1e293b] font-medium leading-relaxed">
                I certify that all information provided is true and correct. I authorize San Roque Elementary School to verify the details submitted and use this data for enrollment purposes.
              </span>
            </label>

            <NavRow
              onBack={back}
              onNext={() => {
                if (!agreed) { alert("Please confirm your information is accurate before submitting."); return; }
                setStep(6);
                scrollTop();
              }}
              nextLabel="Submit enrollment"
              gold
            />
          </>
        )}

      </div>
    </div>
  );
}