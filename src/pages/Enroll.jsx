import { useState, useRef } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";
const API_URL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";
const SANS  = "'Segoe UI', system-ui, sans-serif";

const GRADE_LEVELS   = ["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"];
const MUNICIPALITIES = ["Bagamanoc","Baras","Bato","Caramoran","Gigmoto","Pandan","Panganiban","San Andres","San Miguel","Viga","Virac"];
const VIGA_BARANGAYS = ["Alinawan","Batan","Buyo","Cagdarao","Capacuan","Codon","Comagaycay","Danicop","Gobonseng","Hawan","Itok","Mayngaway","Palnab","Rawis","San Roque","San Vicente","Sogod","Tabgon","Tagas","Talisoy"];

const STEPS = [
  { label: "Enrollment" }, { label: "Student" },
  { label: "Parent" }, { label: "Emergency" },
  { label: "Documents" }, { label: "Review" },
];

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const startYear = month >= 5 ? year : year - 1;
const endYear = startYear + 1;
const schoolYear = `${startYear}–${endYear}`;

/* ─── Icons ──────────────────────────────────────────────── */
const Ico = {
  user:   <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone:  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:   <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  home:   <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  upload: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  trash:  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  check:  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  info:   <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  fb:     <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  cal:    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chev:   <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  back:   <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
};

/* ─── Helpers ────────────────────────────────────────────── */
function today() { return new Date().toISOString().split("T")[0]; }
function calcAge(dob) {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25));
}
function validateDOB(dob, grade) {
  if (!dob) return "Date of birth is required.";
  if (new Date(dob) > new Date()) return "Date of birth cannot be in the future.";
  const age = calcAge(dob);
  if (age > 20) return "Please double-check the year — age seems too high.";
  const min = { "Kindergarten":5,"Grade 1":6,"Grade 2":7,"Grade 3":8,"Grade 4":9,"Grade 5":10,"Grade 6":11 };
  if (grade && min[grade] && age < min[grade])
    return `Child must be at least ${min[grade]} years old for ${grade}. Current age: ${age}.`;
  return "";
}
function validatePH(n) {
  const c = n.replace(/\D/g,"");
  if (!c) return "Mobile number is required.";
  if (c.length !== 11 || !c.startsWith("09")) return "Enter a valid PH number (09XX-XXX-XXXX).";
  return "";
}
function fmtMob(v) {
  const d = v.replace(/\D/g,"").slice(0,11);
  if (d.length<=4) return d;
  if (d.length<=7) return d.slice(0,4)+"-"+d.slice(4);
  return d.slice(0,4)+"-"+d.slice(4,7)+"-"+d.slice(7);
}
function fmtBytes(b) {
  if (b<1024) return b+" B";
  if (b<1024*1024) return (b/1024).toFixed(1)+" KB";
  return (b/(1024*1024)).toFixed(1)+" MB";
}

const inp = (err) => ({
  fontFamily: SANS, fontSize: 13.5, color: "#1e293b",
  padding: "10px 14px", width: "100%", boxSizing: "border-box",
  border: `1.5px solid ${err ? "#dc2626" : "#cbd5e1"}`,
  background: err ? "#fef9f9" : "#fafbfc",
  outline: "none", appearance: "none", transition: "border-color .15s",
});

function Field({ label, required, hint, error, icon, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color: error ? "#dc2626" : NAV }}>
        {icon && <span style={{ color:"#64748b" }}>{icon}</span>}
        {label}{required && <span style={{ color:"#dc2626" }}>*</span>}
      </label>
      {children}
      {hint && !error && <span style={{ fontSize:11.5, color:"#64748b", fontFamily:SERIF, lineHeight:1.5 }}>{hint}</span>}
      {error && (
        <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#dc2626", fontWeight:700 }}>
          {Ico.info} {error}
        </span>
      )}
    </div>
  );
}

function Inp({ name, type="text", value, onChange, placeholder, error, max, min, prefix }) {
  return (
    <div style={{ position:"relative" }}>
      {prefix && <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none", display:"flex" }}>{prefix}</span>}
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        max={max} min={min} style={{ ...inp(error), paddingLeft: prefix ? 36 : 14 }}
        onFocus={e=>{e.target.style.borderColor=NAV; e.target.style.background="#fff";}}
        onBlur={e=>{e.target.style.borderColor=error?"#dc2626":"#cbd5e1"; e.target.style.background=error?"#fef9f9":"#fafbfc";}} />
    </div>
  );
}

function Sel({ name, value, onChange, options, placeholder, error }) {
  return (
    <select name={name} value={value} onChange={onChange}
      style={{ ...inp(error),
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%230a1f52' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 13px center", paddingRight:36,
      }}
      onFocus={e=>{e.target.style.borderColor=NAV; e.target.style.background="#fff";}}
      onBlur={e=>{e.target.style.borderColor=error?"#dc2626":"#cbd5e1"; e.target.style.background=error?"#fef9f9":"#fafbfc";}}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RadioCard({ name, value, label, sublabel, checked, onChange }) {
  return (
    <label style={{
      display:"flex", alignItems:"center", gap:14, padding:"14px 18px",
      border:`1.5px solid ${checked ? NAV : "#e2e8f0"}`,
      background: checked ? NAV : "#fff", cursor:"pointer", transition:"all .15s",
    }}>
      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${checked?GOLD:"#cbd5e1"}`, background:checked?GOLD:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
        {checked && <div style={{ width:8, height:8, borderRadius:"50%", background:NAV }} />}
      </div>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ display:"none" }} />
      <div style={{ flex:1 }}>
        <p style={{ margin:0, fontSize:13.5, fontWeight:800, fontFamily:SERIF, color:checked?"#fff":NAV }}>{label}</p>
        {sublabel && <p style={{ margin:"2px 0 0", fontSize:11.5, fontFamily:SERIF, color:checked?"rgba(255,255,255,.6)":"#64748b" }}>{sublabel}</p>}
      </div>
      {checked && <span style={{ color:GOLD, flexShrink:0 }}>{Ico.check}</span>}
    </label>
  );
}

function Card({ title, icon, desc, children }) {
  return (
    <div style={{ border:`1.5px solid #e2e8f0`, background:"#fff", overflow:"hidden", marginBottom:16 }}>
      <div style={{ background:NAV, padding:"13px 20px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:4, height:18, background:GOLD, flexShrink:0 }} />
        {icon && <span style={{ color:GOLD, display:"flex" }}>{icon}</span>}
        <div>
          <p style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>{title}</p>
          {desc && <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,.45)", fontFamily:SERIF }}>{desc}</p>}
        </div>
      </div>
      <div style={{ padding:"22px 20px" }}>{children}</div>
    </div>
  );
}

const g2 = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 };
const g3 = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:14 };

function StepBar({ current }) {
  return (
    <div style={{ background: NAV, borderBottom: `4px solid ${GOLD}` }}>
      <style>{`
        .sres-stepbar { display:grid; grid-template-columns:repeat(3,1fr); width:100%; }
        @media (min-width:560px) { .sres-stepbar { grid-template-columns:repeat(6,1fr); } }
        .sres-step { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; padding:13px 6px; cursor:default; border-right:1px solid rgba(255,255,255,0.07); transition:background 0.2s; }
        .sres-step:last-child { border-right:none; }
        @media (max-width:559px) {
          .sres-step:nth-child(3) { border-right:none; }
          .sres-step { border-bottom:1px solid rgba(255,255,255,0.07); }
          .sres-step:nth-child(4), .sres-step:nth-child(5), .sres-step:nth-child(6) { border-bottom:none; }
        }
      `}</style>
      <div className="sres-stepbar">
        {STEPS.map((s, i) => {
          const active = i === current;
          const done   = i < current;
          return (
            <div key={i} className="sres-step" style={{ background: active ? GOLD : done ? "#132a6b" : "transparent" }}>
              <span style={{ fontSize:10, fontWeight:900, color:active?NAV:done?GOLD:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", lineHeight:1 }}>
                {done ? Ico.check : i + 1}
              </span>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:active?NAV:done?GOLD:"rgba(255,255,255,0.35)", whiteSpace:"nowrap", marginTop:3 }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavRow({ onBack, onNext, nextLabel="Next", gold=false, disabled=false, loading=false }) {
  const btnBg  = (disabled||loading) ? "#94a3b8" : gold ? GOLD : NAV;
  const btnClr = (disabled||loading) ? "#fff"    : gold ? NAV  : GOLD;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, gap:10, flexWrap:"wrap" }}>
      {onBack
        ? <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"11px 22px", border:`1.5px solid ${NAV}`, background:"transparent", color:NAV, cursor:"pointer" }}>
            {Ico.back} Back
          </button>
        : <div />}
      <button onClick={onNext} disabled={disabled||loading} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"12px 28px", border:"none", background:btnBg, color:btnClr, cursor:(disabled||loading)?"not-allowed":"pointer" }}>
        {loading ? "Submitting…" : nextLabel}
        {!loading && !disabled && Ico.chev}
      </button>
    </div>
  );
}

function RevSec({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, paddingBottom:6, borderBottom:`1px solid rgba(245,197,24,.2)` }}>
        <div style={{ width:3, height:12, background:GOLD }} />
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:`${GOLD}BB` }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function RevRow({ label, value, ok }) {
  return (
    <div style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.06)", flexWrap:"wrap" }}>
      <span style={{ minWidth:170, flexShrink:0, fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(245,197,24,.6)", paddingTop:2 }}>{label}</span>
      <span style={{ fontFamily:SERIF, fontSize:13, color:ok?GOLD:"rgba(255,255,255,.88)", flex:1, fontWeight:ok?800:400 }}>{value||"—"}</span>
    </div>
  );
}

function FileUpload({ label, file, onFile, onRemove }) {
  const ref = useRef();
  const isImg = file && file.type.startsWith("image/");
  const isPDF = file && file.type==="application/pdf";

  if (!file) {
    return (
      <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, border:`2px dashed #cbd5e1`, padding:"18px 14px", background:"#fafbfc", cursor:"pointer", marginTop:10, transition:"border-color .15s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=NAV}
        onMouseLeave={e=>e.currentTarget.style.borderColor="#cbd5e1"}>
        <span style={{ color:"#94a3b8" }}>{Ico.upload}</span>
        <div style={{ textAlign:"center" }}>
          <p style={{ margin:"0 0 2px", fontSize:12, fontWeight:700, color:NAV, fontFamily:SERIF }}>Click to upload {label}</p>
          <p style={{ margin:0, fontSize:11, color:"#94a3b8", fontFamily:SERIF }}>JPEG, PNG or PDF · max 5 MB</p>
          <p style={{ margin:"3px 0 0", fontSize:11, color:"#64748b", fontFamily:SERIF, fontStyle:"italic" }}>Pwedeng photo gamit cellphone — basta mababasa</p>
        </div>
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display:"none" }} onChange={e=>{if(e.target.files[0]) onFile(e.target.files[0]);}} />
      </label>
    );
  }

  return (
    <div style={{ border:`1.5px solid ${NAV}`, marginTop:10, overflow:"hidden" }}>
      <div style={{ background:NAV, padding:"7px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:GOLD }}>{Ico.check}</span>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#fff" }}>Uploaded Successfully</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>ref.current?.click()} style={{ fontSize:10, fontWeight:700, color:GOLD, background:"transparent", border:"none", cursor:"pointer" }}>Replace</button>
          <button onClick={onRemove} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:700, color:"#fca5a5", background:"transparent", border:"none", cursor:"pointer" }}>
            {Ico.trash} Remove
          </button>
          <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display:"none" }} onChange={e=>{if(e.target.files[0]) onFile(e.target.files[0]);}} />
        </div>
      </div>
      <div style={{ background:"#f8fafc", padding:14, display:"flex", alignItems:"center", gap:14 }}>
        {isImg && <img src={URL.createObjectURL(file)} alt="preview" style={{ width:72, height:72, objectFit:"cover", border:`1px solid #e2e8f0`, flexShrink:0 }} />}
        {isPDF && (
          <div style={{ width:48, height:56, background:NAV, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:10, fontWeight:900, color:GOLD, letterSpacing:1 }}>PDF</span>
          </div>
        )}
        <div style={{ minWidth:0 }}>
          <p style={{ margin:"0 0 3px", fontSize:12, fontWeight:700, color:NAV, fontFamily:SERIF, wordBreak:"break-all" }}>{file.name}</p>
          <p style={{ margin:"0 0 6px", fontSize:11, color:"#64748b", fontFamily:SERIF }}>{fmtBytes(file.size)}</p>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:7, height:7, background:"#22c55e", borderRadius:"50%" }} />
            <span style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>Ready to submit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocItem({ num, title, desc, tagalog, required, showUpload=true, checked, onCheck, file, onFile, onRemove }) {
  return (
    <div style={{ border:`1.5px solid ${checked?NAV:"#e2e8f0"}`, background:checked?"#fff":"#fafbfc", marginBottom:10, overflow:"hidden", transition:"border-color .2s" }}>
      <div style={{ display:"flex" }}>
        <div style={{ width:48, background:checked?NAV:"#f1f5f9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"16px 0", gap:8, flexShrink:0, alignSelf:"stretch", transition:"background .2s" }}>
          <span style={{ fontSize:15, fontWeight:900, color:checked?GOLD:"#94a3b8", lineHeight:1 }}>{num}</span>
          {checked && (
            <div style={{ width:22, height:22, background:GOLD, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:NAV }}>{Ico.check}</span>
            </div>
          )}
        </div>
        <div style={{ flex:1, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:800, color:NAV, fontFamily:SERIF }}>{title}</span>
                {required
                  ? <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"2px 8px", background:"#fef2f2", border:"1px solid #fca5a5", color:"#dc2626" }}>Required</span>
                  : <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"2px 8px", background:"#f0fdf4", border:"1px solid #86efac", color:"#16a34a" }}>Optional</span>}
              </div>
              <p style={{ margin:"0 0 2px", fontSize:12.5, color:"#475569", fontFamily:SERIF, lineHeight:1.5 }}>{desc}</p>
              {tagalog && <p style={{ margin:0, fontSize:11.5, color:"#94a3b8", fontFamily:SERIF, fontStyle:"italic" }}>{tagalog}</p>}
            </div>
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }}>
              <span style={{ fontSize:11, fontWeight:700, color:checked?NAV:"#94a3b8", whiteSpace:"nowrap" }}>
                {checked ? "I have this" : "Mark available"}
              </span>
              <div style={{ width:44, height:24, background:checked?NAV:"#e2e8f0", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:4, left:checked?24:4, width:16, height:16, background:checked?GOLD:"#fff", border:checked?"none":"1px solid #cbd5e1", transition:"left .2s" }} />
              </div>
              <input type="checkbox" checked={checked} onChange={onCheck} style={{ display:"none" }} />
            </label>
          </div>
          {checked && showUpload && (
            <FileUpload label={title} file={file} onFile={onFile} onRemove={onRemove} />
          )}
          {checked && !showUpload && (
            <div style={{ marginTop:10, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ color:"#b45309", flexShrink:0, display:"flex", marginTop:2 }}>{Ico.info}</span>
              <p style={{ margin:0, fontSize:12, color:"#78350f", fontFamily:SERIF, lineHeight:1.6 }}>
                Bring <strong>4 physical copies</strong> to the school office on enrollment day — no upload needed.
                <br/><em style={{ color:"#92400e", fontSize:11 }}>Magdala ng 4 na pisikal na kopya sa school — hindi kailangan ng upload.</em>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export default function Enroll() {
  const [step,       setStep]       = useState(0);
  const [agreed,     setAgreed]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");
  const [errors,     setErrors]     = useState({});

  // ── Security: track when step 0 was first loaded ──
  const formOpenedAt = useRef(Date.now());

  const [form, setForm] = useState({
    enrollmentStatus:"", gradeLevel:"",
    firstName:"", middleName:"", lastName:"",
    dateOfBirth:"", gender:"", facebookLink:"",
    previousSchool:"", specialNeeds:"",
    parentName:"", relationship:"",
    mobileNumber:"", email:"",
    houseStreet:"", barangay:"", municipality:"Viga", province:"Catanduanes",
    emergencyName:"", emergencyRelationship:"", emergencyPhone:"",
    doc_birth:false, doc_report:false, doc_tor:false, doc_brgy:false, doc_id:false,
    honeypot:"", // ← hidden bot trap
  });

  const [files, setFiles] = useState({ birth:null, report:null, tor:null, brgy:null });

  const set    = k => e => { const v=e.target.type==="checkbox"?e.target.checked:e.target.value; setForm(f=>({...f,[k]:v})); setErrors(er=>({...er,[k]:undefined})); };
  const setMob = k => e => { setForm(f=>({...f,[k]:fmtMob(e.target.value)})); setErrors(er=>({...er,[k]:undefined})); };
  const setFile= k => f  => setFiles(p=>({...p,[k]:f}));
  const rmFile = k => () => setFiles(p=>({...p,[k]:null}));

  const scrollTop = () => window.scrollTo({top:0, behavior:"smooth"});

  function validateStep(s) {
    const e = {};
    if (s===0) {
      if (!form.enrollmentStatus) e.enrollmentStatus = "Please select a student type.";
      if (!form.gradeLevel)       e.gradeLevel       = "Please select a grade level.";
    }
    if (s===1) {
      if (!form.firstName.trim()) e.firstName = "First name is required.";
      if (!form.lastName.trim())  e.lastName  = "Last name is required.";
      const de = validateDOB(form.dateOfBirth, form.gradeLevel);
      if (de) e.dateOfBirth = de;
      if (!form.gender) e.gender = "Please select a gender.";
      if (form.enrollmentStatus==="Transferee" && !form.previousSchool.trim())
        e.previousSchool = "Previous school is required for transferees.";
    }
    if (s===2) {
      if (!form.parentName.trim())  e.parentName  = "Parent/guardian name is required.";
      if (!form.relationship)       e.relationship = "Please select a relationship.";
      const me = validatePH(form.mobileNumber);
      if (me) e.mobileNumber = me;
      if (!form.email.trim())       e.email = "Email address is required.";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email.";
      if (!form.houseStreet.trim()) e.houseStreet = "House/street number is required.";
      if (!form.barangay)           e.barangay = "Please select a barangay.";
    }
    if (s===3) {
      if (!form.emergencyName.trim())          e.emergencyName         = "Contact name is required.";
      if (!form.emergencyRelationship.trim())  e.emergencyRelationship = "Relationship is required.";
      const me = validatePH(form.emergencyPhone);
      if (me) e.emergencyPhone = me;
    }
    return e;
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setStep(s=>s+1); scrollTop();
  }
  function back() { setStep(s=>s-1); scrollTop(); }

  async function handleSubmit() {
    if (!agreed) { setSubmitErr("Please confirm the accuracy of information before submitting."); return; }

    // ── Bot check: submitted too fast (under 5 seconds total) ──
    if (Date.now() - formOpenedAt.current < 5000) {
      setStep(6); // fake success
      return;
    }

    // ── Bot check: honeypot filled ──
    if (form.honeypot) {
      setStep(6); // fake success
      return;
    }

    setSubmitting(true); setSubmitErr("");

    const address = [form.houseStreet, form.barangay, form.municipality, form.province].filter(Boolean).join(", ");

    try {
      const res = await fetch(`${API_URL}/enroll`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          honeypot:                form.honeypot,         // ← send to server too
          student_type:            form.enrollmentStatus,
          grade_level:             form.gradeLevel,
          first_name:              form.firstName,
          middle_name:             form.middleName,
          last_name:               form.lastName,
          date_of_birth:           form.dateOfBirth,
          gender:                  form.gender,
          facebook_link:           form.facebookLink,
          previous_school:         form.previousSchool,
          special_needs:           form.specialNeeds,
          parent_name:             form.parentName,
          relationship:            form.relationship,
          mobile_number:           form.mobileNumber,
          email:                   form.email,
          address,
          emergency_name:          form.emergencyName,
          emergency_relationship:  form.emergencyRelationship,
          emergency_phone:         form.emergencyPhone,
          has_id_pictures:         form.doc_id ? 1 : 0,
          agreement:               1,
        }),
      });

      // ── Rate limit hit ──
      if (res.status === 429) {
        setSubmitErr("Too many enrollment submissions from this device. Please try again later.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) { setSubmitErr(data.message||"An error occurred. Please try again."); setSubmitting(false); return; }
      setStep(6);
    } catch {
      setSubmitErr("Cannot connect to the server. Please check your internet connection.");
      setSubmitting(false);
    }
  }

  const age      = calcAge(form.dateOfBirth);
  const docCount = [form.doc_birth,form.doc_report,form.doc_tor,form.doc_brgy,form.doc_id].filter(Boolean).length;

  /* ── Success ── */
  if (step === 6) return (
    <div style={{ background:"#f2efe8", minHeight:"100vh" }}>
      <div style={{ background:NAV, borderBottom:`4px solid ${GOLD}`, padding:"14px 20px" }}>
        <p style={{ color:GOLD, fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>San Roque Elementary School</p>
      </div>
      <div style={{ maxWidth:520, margin:"60px auto", padding:"0 16px" }}>
        <div style={{ border:`1.5px solid ${NAV}`, background:"#fff", overflow:"hidden" }}>
          <div style={{ background:NAV, padding:"16px 22px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:4, height:18, background:GOLD }} />
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#fff" }}>Enrollment Submitted Successfully</span>
          </div>
          <div style={{ padding:"44px 28px", textAlign:"center" }}>
            <div style={{ width:68, height:68, background:NAV, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px" }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:NAV, fontFamily:SERIF }}>Thank you, {form.firstName}!</h2>
            <p style={{ margin:"0 0 6px", fontSize:14, color:"#475569", fontFamily:SERIF, lineHeight:1.8 }}>Your enrollment form has been submitted successfully.</p>
            <p style={{ margin:"0 0 28px", fontSize:13, color:"#94a3b8", fontFamily:SERIF }}>
              A confirmation will be sent to <strong style={{ color:NAV }}>{form.email}</strong>.
            </p>
            <div style={{ background:NAV, padding:"18px 22px", textAlign:"left", marginBottom:26 }}>
              <p style={{ margin:"0 0 12px", fontSize:9, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:GOLD }}>What happens next?</p>
              <ol style={{ margin:0, paddingLeft:18, display:"flex", flexDirection:"column", gap:10 }}>
                {["Bring original copies of required documents to the school office.","School staff will review your application.","You will be contacted for orientation and confirmation details."].map((t,i)=>(
                  <li key={i} style={{ fontSize:13, color:"rgba(255,255,255,.82)", fontFamily:SERIF, lineHeight:1.65 }}>{t}</li>
                ))}
              </ol>
            </div>
            <a href="/" style={{ display:"inline-block", fontSize:11, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", padding:"12px 28px", background:NAV, color:GOLD, textDecoration:"none" }}>
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#f2efe8", minHeight:"100vh" }}>

      <section style={{ background:NAV, position:"relative", overflow:"hidden", minHeight:260 }}>
        <div style={{ position:"absolute", right:0, top:0, width:"55%", height:"100%", clipPath:"polygon(14% 0, 100% 0, 100% 100%, 0% 100%)" }}>
          <img src={HERO_IMG} alt="SRES" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(10,31,82,0.5)" }} />
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"52px 20px 68px", display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
          <p style={{ color:GOLD, fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 10px" }}>
            San Roque Elementary School
          </p>
          <h1 style={{ margin:"0 0 12px", color:"#fff", fontSize:"clamp(1.8rem,5.5vw,3.6rem)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.02em", fontFamily:SERIF }}>
            Enrollment <span style={{ color:GOLD }}>Form</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,.55)", fontSize:14, lineHeight:1.75, maxWidth:420, margin:0, fontFamily:SERIF }}>
            School Year {schoolYear}. Complete all sections to secure your child's place at SRES.
          </p>
        </div>
      </section>

      <StepBar current={step} />

      {/* ── Honeypot — completely hidden from users, bots will fill it ── */}
      <input
        name="honeypot"
        value={form.honeypot}
        onChange={set("honeypot")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display:"none" }}
      />

      {step===0 && (
        <div style={{ background:"#fffbeb", borderBottom:`3px solid ${GOLD}` }}>
          <div style={{ maxWidth:920, margin:"0 auto", padding:"12px 20px", display:"flex", alignItems:"flex-start", gap:12 }}>
            <span style={{ color:"#b45309", flexShrink:0, display:"flex", marginTop:2 }}>{Ico.info}</span>
            <p style={{ margin:0, fontSize:12.5, color:"#78350f", fontFamily:SERIF, lineHeight:1.7 }}>
              <strong>Data Privacy Notice:</strong> All information collected will be used solely for enrollment processing, student records, and school communications. Your data is handled in strict confidence.
              <em style={{ color:"#92400e" }}> · Ang lahat ng impormasyon ay gagamitin lamang para sa enrollment at komunikasyon ng paaralan.</em>
            </p>
          </div>
        </div>
      )}

      <main style={{ maxWidth:920, margin:"0 auto", padding:"24px 16px 80px" }}>

        {step===0 && (
          <>
            <Card title="Enrollment Details" icon={Ico.cal} desc={`Select the student type and grade level for School Year ${schoolYear}`}>
              <div style={g2}>
                <div>
                  <p style={{ margin:"0 0 3px", fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:NAV }}>Student Type <span style={{ color:"#dc2626" }}>*</span></p>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:"#64748b", fontFamily:SERIF, fontStyle:"italic" }}>Anong klase ng estudyante ang mag-eenroll?</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <RadioCard name="enrollmentStatus" value="New Student" label="New Student" sublabel="First time enrolling at SRES" checked={form.enrollmentStatus==="New Student"} onChange={set("enrollmentStatus")} />
                    <RadioCard name="enrollmentStatus" value="Transferee"  label="Transferee"  sublabel="Coming from another school"     checked={form.enrollmentStatus==="Transferee"}  onChange={set("enrollmentStatus")} />
                    <RadioCard name="enrollmentStatus" value="Returnee"    label="Returnee"    sublabel="Previously enrolled at SRES"     checked={form.enrollmentStatus==="Returnee"}    onChange={set("enrollmentStatus")} />
                  </div>
                  {errors.enrollmentStatus && <p style={{ margin:"8px 0 0", fontSize:11, color:"#dc2626", fontWeight:700 }}>{errors.enrollmentStatus}</p>}
                </div>
                <Field label="Grade Level" required error={errors.gradeLevel} icon={Ico.cal} hint="Piliin ang grade level para sa school year 2025–2026">
                  <Sel name="gradeLevel" value={form.gradeLevel} onChange={set("gradeLevel")} options={GRADE_LEVELS} placeholder="— Select Grade Level —" error={errors.gradeLevel} />
                </Field>
              </div>
            </Card>
            <NavRow onNext={next} nextLabel="Next: Student Information" />
          </>
        )}

        {step===1 && (
          <>
            <Card title="Student Information" icon={Ico.user} desc="Personal details of the student being enrolled">
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={g3}>
                  <Field label="First Name" required error={errors.firstName} icon={Ico.user}>
                    <Inp name="firstName" value={form.firstName} onChange={set("firstName")} placeholder="Juan" error={errors.firstName} />
                  </Field>
                  <Field label="Middle Name" hint="Iwanan ng blangko kung walang gitnang pangalan">
                    <Inp name="middleName" value={form.middleName} onChange={set("middleName")} placeholder="Santos" />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName} icon={Ico.user}>
                    <Inp name="lastName" value={form.lastName} onChange={set("lastName")} placeholder="Dela Cruz" error={errors.lastName} />
                  </Field>
                </div>
                <div style={g3}>
                  <Field label="Date of Birth" required error={errors.dateOfBirth} icon={Ico.cal}
                    hint={age!==null && !errors.dateOfBirth ? `Current age: ${age} years old` : "Petsa ng kapanganakan ng bata"}>
                    <Inp name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} max={today()} min="2005-01-01" error={errors.dateOfBirth} />
                    {age!==null && !errors.dateOfBirth && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5, padding:"7px 11px", background:`${NAV}0E`, border:`1px solid ${NAV}25` }}>
                        {Ico.cal}
                        <span style={{ fontSize:11.5, fontWeight:700, color:NAV, fontFamily:SERIF }}>{age} years old</span>
                      </div>
                    )}
                  </Field>
                  <Field label="Gender" required error={errors.gender} hint="Kasarian ng estudyante">
                    <Sel name="gender" value={form.gender} onChange={set("gender")} options={["Male (Lalaki)","Female (Babae)"]} placeholder="— Select —" error={errors.gender} />
                  </Field>
                  <Field label="Parent's Facebook" hint="Para sa komunikasyon ng paaralan kung kinakailangan" icon={Ico.fb}>
                    <Inp name="facebookLink" value={form.facebookLink} onChange={set("facebookLink")} placeholder="facebook.com/name" prefix={Ico.fb} />
                  </Field>
                </div>
                {form.enrollmentStatus==="Transferee" && (
                  <Field label="Previous School" required error={errors.previousSchool} hint="Isulat ang buong pangalan ng paaralang pinanggalingan">
                    <Inp name="previousSchool" value={form.previousSchool} onChange={set("previousSchool")} placeholder="e.g. Viga Central Elementary School" error={errors.previousSchool} />
                  </Field>
                )}
                <Field label="Special Needs / Concerns" hint="Iwanan ng blangko kung wala — e.g. hearing impairment, needs reading assistance">
                  <Inp name="specialNeeds" value={form.specialNeeds} onChange={set("specialNeeds")} placeholder="Describe any special needs or leave blank if none" />
                </Field>
              </div>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Parent / Guardian" />
          </>
        )}

        {step===2 && (
          <>
            <Card title="Parent / Guardian Information" icon={Ico.user} desc="Contact details of the parent or guardian responsible for the student">
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={g2}>
                  <Field label="Full Name" required error={errors.parentName} icon={Ico.user}>
                    <Inp name="parentName" value={form.parentName} onChange={set("parentName")} placeholder="Maria Santos Dela Cruz" error={errors.parentName} />
                  </Field>
                  <Field label="Relationship to Student" required error={errors.relationship} hint="Relasyon ng magulang/guardian sa estudyante">
                    <Sel name="relationship" value={form.relationship} onChange={set("relationship")}
                      options={["Mother (Ina)","Father (Ama)","Guardian","Grandparent (Lolo/Lola)","Uncle / Aunt (Tito/Tita)","Sibling (Kapatid)","Other (Iba pa)"]}
                      placeholder="— Select —" error={errors.relationship} />
                  </Field>
                </div>
                <div style={g2}>
                  <Field label="Mobile Number" required error={errors.mobileNumber} icon={Ico.phone} hint="Format: 09XX-XXX-XXXX — isang aktibong numero">
                    <Inp name="mobileNumber" type="tel" value={form.mobileNumber} onChange={setMob("mobileNumber")} placeholder="0912-345-6789" error={errors.mobileNumber} prefix={Ico.phone} />
                  </Field>
                  <Field label="Email Address" required error={errors.email} icon={Ico.mail} hint="Dito ipapadala ang kumpirmasyon ng enrollment">
                    <Inp name="email" type="email" value={form.email} onChange={set("email")} placeholder="parent@email.com" error={errors.email} prefix={Ico.mail} />
                  </Field>
                </div>
              </div>
            </Card>
            <Card title="Home Address" icon={Ico.home} desc="Current residence of the student">
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <Field label="House / Lot No. and Street" required error={errors.houseStreet} hint="Numero ng bahay, street name, o subdivision" icon={Ico.home}>
                  <Inp name="houseStreet" value={form.houseStreet} onChange={set("houseStreet")} placeholder="e.g. Blk 2 Lot 5, Rizal Street" error={errors.houseStreet} prefix={Ico.home} />
                </Field>
                <div style={g3}>
                  <Field label="Barangay" required error={errors.barangay} hint="Pumili ng barangay sa Viga">
                    <Sel name="barangay" value={form.barangay} onChange={set("barangay")} options={VIGA_BARANGAYS} placeholder="— Select Barangay —" error={errors.barangay} />
                  </Field>
                  <Field label="Municipality" hint="Bayan o lungsod">
                    <Sel name="municipality" value={form.municipality} onChange={set("municipality")} options={MUNICIPALITIES} placeholder="— Select —" />
                  </Field>
                  <Field label="Province">
                    <Inp name="province" value={form.province} onChange={set("province")} />
                  </Field>
                </div>
                {(form.houseStreet||form.barangay) && (
                  <div style={{ padding:"10px 14px", background:"#f0fdf4", border:"1px solid #86efac", display:"flex", alignItems:"flex-start", gap:10 }}>
                    <span style={{ color:"#16a34a", flexShrink:0, display:"flex", marginTop:2 }}>{Ico.check}</span>
                    <div>
                      <p style={{ margin:"0 0 2px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#16a34a" }}>Address Preview</p>
                      <p style={{ margin:0, fontSize:13, color:"#166534", fontFamily:SERIF }}>
                        {[form.houseStreet,form.barangay,form.municipality,form.province].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Emergency Contact" />
          </>
        )}

        {step===3 && (
          <>
            <Card title="Emergency Contact" icon={Ico.phone} desc="Person to contact if the parent or guardian is unreachable">
              <div style={{ padding:"12px 16px", background:"#fff7ed", border:"1px solid #fed7aa", marginBottom:18, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ color:"#c2410c", flexShrink:0, display:"flex", marginTop:2 }}>{Ico.info}</span>
                <p style={{ margin:0, fontSize:13, color:"#9a3412", fontFamily:SERIF, lineHeight:1.7 }}>
                  <strong>Important:</strong> This must be a different person from the parent or guardian listed above.
                  <br/><em style={{ fontSize:12, color:"#9a3412" }}>Ibang tao ito — hindi ang magulang o guardian na nakalista sa nakaraang pahina.</em>
                </p>
              </div>
              <div style={g3}>
                <Field label="Full Name" required error={errors.emergencyName} icon={Ico.user}>
                  <Inp name="emergencyName" value={form.emergencyName} onChange={set("emergencyName")} placeholder="Roberto Cruz" error={errors.emergencyName} />
                </Field>
                <Field label="Relationship" required error={errors.emergencyRelationship} hint="e.g. Lolo, Tita, Kapit-bahay">
                  <Inp name="emergencyRelationship" value={form.emergencyRelationship} onChange={set("emergencyRelationship")} placeholder="e.g. Grandparent, Neighbor" error={errors.emergencyRelationship} />
                </Field>
                <Field label="Mobile Number" required error={errors.emergencyPhone} icon={Ico.phone}>
                  <Inp name="emergencyPhone" type="tel" value={form.emergencyPhone} onChange={setMob("emergencyPhone")} placeholder="0912-345-6789" error={errors.emergencyPhone} prefix={Ico.phone} />
                </Field>
              </div>
            </Card>
            <NavRow onBack={back} onNext={next} nextLabel="Next: Documents" />
          </>
        )}

        {step===4 && (
          <>
            <div style={{ background:NAV, padding:"16px 20px", marginBottom:16, border:`1.5px solid ${NAV}`, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
              {[
                ["Upload Tips","A clear phone photo is acceptable. No scanner needed. · Pwedeng photo gamit cellphone — basta mababasa."],
                ["On Enrollment Day","Still bring original documents to the school office for verification. · Magdala pa rin ng original."],
              ].map(([t,d])=>(
                <div key={t} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ color:GOLD, flexShrink:0, display:"flex", marginTop:2 }}>{Ico.info}</span>
                  <div>
                    <p style={{ margin:"0 0 2px", fontSize:9, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:GOLD }}>{t}</p>
                    <p style={{ margin:0, fontSize:12, color:"rgba(255,255,255,.65)", fontFamily:SERIF, lineHeight:1.55 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <DocItem num="01" title="Birth Certificate" required
              desc="PSA or Local Civil Registry copy — proof of the student's name and date of birth."
              tagalog="PSA o Local Civil Registry — patunay ng pangalan at kaarawan ng bata"
              checked={form.doc_birth} onCheck={set("doc_birth")} file={files.birth} onFile={setFile("birth")} onRemove={rmFile("birth")} />
            <DocItem num="02" title="Latest Report Card" required
              desc="Most recent school year — used to verify the appropriate grade level placement."
              tagalog="Pinakabagong report card — kailangan para malaman ang tamang grade level"
              checked={form.doc_report} onCheck={set("doc_report")} file={files.report} onFile={setFile("report")} onRemove={rmFile("report")} />
            <DocItem num="03" title="Transcript of Records / Form 137"
              required={form.enrollmentStatus==="Transferee"}
              desc={form.enrollmentStatus==="Transferee" ? "Required for transferees — official academic records from the previous school." : "Required for transferees only. Leave unchecked if not applicable."}
              tagalog={form.enrollmentStatus==="Transferee" ? "Kailangan para sa mga transferee — mula sa dating paaralan" : "Para sa mga transferee lamang"}
              checked={form.doc_tor} onCheck={set("doc_tor")} file={files.tor} onFile={setFile("tor")} onRemove={rmFile("tor")} />
            <DocItem num="04" title="Barangay Residency Certificate"
              desc="Issued by your local barangay hall — confirms the student's place of residence."
              tagalog="Makuha sa barangay hall — libre ito at available agad"
              checked={form.doc_brgy} onCheck={set("doc_brgy")} file={files.brgy} onFile={setFile("brgy")} onRemove={rmFile("brgy")} />
            <DocItem num="05" title="2×2 ID Pictures (4 copies)" showUpload={false}
              desc="Four identical 2×2 ID photos of the student — plain white background preferred."
              tagalog="Magdala ng 4 na pisikal na kopya sa school — hindi kailangan ng upload"
              checked={form.doc_id} onCheck={set("doc_id")} />
            <div style={{ background:"#fff", border:`1.5px solid ${NAV}`, padding:"14px 18px", marginTop:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:NAV }}>{docCount} of 5 documents marked</span>
                <span style={{ fontSize:11, fontWeight:700, color: docCount>=2 ? "#16a34a" : "#94a3b8" }}>
                  {docCount>=2 ? "✓ Minimum requirements met" : "At least Birth Certificate & Report Card needed"}
                </span>
              </div>
              <div style={{ height:6, background:"#e8e4da", overflow:"hidden" }}>
                <div style={{ height:"100%", background:docCount>=2?"#22c55e":GOLD, width:`${(docCount/5)*100}%`, transition:"width .3s" }} />
              </div>
            </div>
            <NavRow onBack={back} onNext={next} nextLabel="Review & Submit" />
          </>
        )}

        {step===5 && (
          <>
            <div style={{ border:`1.5px solid ${NAV}`, background:NAV, overflow:"hidden", marginBottom:14 }}>
              <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:"1.5px solid rgba(255,255,255,.1)" }}>
                <div style={{ width:4, height:18, background:GOLD }} />
                <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#fff" }}>Review Your Information</span>
              </div>
              <div style={{ padding:"20px 20px" }}>
                <p style={{ margin:"0 0 22px", fontSize:13, color:"rgba(255,255,255,.6)", fontFamily:SERIF, lineHeight:1.75 }}>
                  Please review all details carefully. Use the Back button to correct any information before submitting.
                </p>
                <RevSec title="Enrollment Details">
                  <RevRow label="Student Type" value={form.enrollmentStatus} />
                  <RevRow label="Grade Level"  value={form.gradeLevel} />
                </RevSec>
                <RevSec title="Student Information">
                  <RevRow label="Full Name"     value={[form.firstName,form.middleName,form.lastName].filter(Boolean).join(" ")} ok />
                  <RevRow label="Date of Birth" value={form.dateOfBirth ? `${form.dateOfBirth}${age!==null?` · ${age} years old`:""}`:""} />
                  <RevRow label="Gender"        value={form.gender} />
                  <RevRow label="Facebook"      value={form.facebookLink} />
                  {form.enrollmentStatus==="Transferee" && <RevRow label="Previous School" value={form.previousSchool} />}
                  <RevRow label="Special Needs" value={form.specialNeeds} />
                </RevSec>
                <RevSec title="Parent / Guardian">
                  <RevRow label="Full Name"    value={form.parentName} ok />
                  <RevRow label="Relationship" value={form.relationship} />
                  <RevRow label="Mobile"       value={form.mobileNumber} />
                  <RevRow label="Email"        value={form.email} />
                  <RevRow label="Address"      value={[form.houseStreet,form.barangay,form.municipality,form.province].filter(Boolean).join(", ")} />
                </RevSec>
                <RevSec title="Emergency Contact">
                  <RevRow label="Full Name"    value={form.emergencyName} />
                  <RevRow label="Relationship" value={form.emergencyRelationship} />
                  <RevRow label="Mobile"       value={form.emergencyPhone} />
                </RevSec>
                <RevSec title="Documents">
                  {[
                    ["Birth Certificate",    form.doc_birth,  files.birth?.name],
                    ["Report Card",          form.doc_report, files.report?.name],
                    ["Transcript/Form 137",  form.doc_tor,    files.tor?.name],
                    ["Barangay Certificate", form.doc_brgy,   files.brgy?.name],
                    ["2×2 ID Pictures",      form.doc_id,     null],
                  ].map(([lbl,chk,fname])=>(
                    <RevRow key={lbl} label={lbl} value={chk ? (fname ? `✓ Uploaded — ${fname}` : "✓ Will provide") : "Not yet available"} ok={chk} />
                  ))}
                </RevSec>
              </div>
            </div>

            <label style={{ display:"flex", alignItems:"flex-start", gap:14, border:`1.5px solid ${agreed?NAV:"#e2e8f0"}`, background:agreed?"#fffbeb":"#fff", padding:"16px 18px", marginBottom:14, cursor:"pointer", transition:"all .15s" }}>
              <div style={{ width:24, height:24, border:`2px solid ${agreed?GOLD:"#cbd5e1"}`, background:agreed?GOLD:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"all .15s" }}>
                {agreed && <span style={{ color:NAV }}>{Ico.check}</span>}
              </div>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ display:"none" }} />
              <div>
                <p style={{ margin:"0 0 4px", fontSize:13, color:"#1e293b", fontFamily:SERIF, lineHeight:1.75, fontWeight:700 }}>
                  I certify that all information provided is true and correct.
                </p>
                <p style={{ margin:0, fontSize:12.5, color:"#475569", fontFamily:SERIF, lineHeight:1.65 }}>
                  I authorize San Roque Elementary School to verify the details submitted and use this data for enrollment purposes.
                  <em style={{ color:"#94a3b8" }}> · Pinatutunayan ko na tama ang lahat ng impormasyong ibinigay.</em>
                </p>
              </div>
            </label>

            {submitErr && (
              <div style={{ background:"#fef2f2", border:"1.5px solid #fca5a5", padding:"12px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ color:"#dc2626", flexShrink:0, display:"flex", marginTop:2 }}>{Ico.info}</span>
                <p style={{ margin:0, fontSize:13, color:"#dc2626", fontWeight:700, fontFamily:SERIF }}>{submitErr}</p>
              </div>
            )}

            <NavRow onBack={back} onNext={handleSubmit} nextLabel="Submit Enrollment" gold disabled={!agreed} loading={submitting} />
          </>
        )}
      </main>
    </div>
  );
}