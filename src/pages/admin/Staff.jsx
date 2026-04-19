import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function authHeader() {
    const t = localStorage.getItem("admin_token");
    return t ? { Authorization: "Bearer " + t } : {};
}
function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

const GRADE_LABELS = ["Faculty","Principal","Kinder","Grade I","Grade II","Grade III","Grade IV","Grade V","Grade VI"];

function gradeLabel(position) {
    if (!position) return "Faculty";
    const p = position.toLowerCase();
    if (p.includes("principal"))                                  return "Principal";
    if (p.includes("kinder"))                                     return "Kinder";
    if (p.includes("grade i ") || p.endsWith("grade i"))         return "Grade I";
    if (p.includes("grade ii ") || p.endsWith("grade ii"))       return "Grade II";
    if (p.includes("grade iii") || p.endsWith("grade iii"))      return "Grade III";
    if (p.includes("grade iv"))                                   return "Grade IV";
    if (p.includes("grade v ") || p.endsWith("grade v"))         return "Grade V";
    if (p.includes("grade vi"))                                   return "Grade VI";
    return "Faculty";
}

const STATUS_CFG = {
    active:   { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Active"   },
    inactive: { bg: "#f1f5f9", color: "#475569", border: "#94a3b8", dot: "#94a3b8", label: "Inactive" },
};

/* ── Toast ── */
function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(msg, type = "success") {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
    }
    return { toasts, addToast };
}
function Toast({ toasts }) {
    return (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
            {toasts.map(t => (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, background: t.type==="success"?"#052e16":"#450a0a", color: t.type==="success"?"#bbf7d0":"#fecaca", padding:"12px 18px", borderRadius:12, fontSize:13, fontWeight:700, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", border:"1px solid "+(t.type==="success"?"#166534":"#991b1b"), minWidth:240, pointerEvents:"none" }}>
                    <span style={{ fontSize:16 }}>{t.type==="success"?"✓":"✕"}</span>
                    {t.msg}
                </div>
            ))}
        </div>
    );
}

/* ── Confirm modal ── */
function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
    return (
        <div style={{ position:"fixed", inset:0, zIndex:1400, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onCancel}>
            <div style={{ width:"100%", maxWidth:380, background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.28)" }} onClick={e => e.stopPropagation()}>
                <div style={{ background:NAV, padding:"20px 24px" }}>
                    <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#fff", fontFamily:SERIF }}>{title}</p>
                </div>
                <div style={{ padding:"22px 24px 24px" }}>
                    <p style={{ margin:"0 0 22px", fontSize:14, color:"#334155", lineHeight:1.6, fontFamily:SERIF }}>{message}</p>
                    <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                        <button onClick={onCancel} style={{ fontSize:12, fontWeight:700, padding:"10px 22px", background:"#f1f5f9", border:"1.5px solid #e2e8f0", color:"#475569", borderRadius:9, cursor:"pointer" }}>Cancel</button>
                        <button onClick={onConfirm} style={{ fontSize:12, fontWeight:800, padding:"10px 22px", background:confirmColor||NAV, color:"#fff", border:"none", borderRadius:9, cursor:"pointer" }}>{confirmLabel||"Confirm"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Status badge ── */
function StatusBadge({ isActive }) {
    const cfg = isActive ? STATUS_CFG.active : STATUS_CFG.inactive;
    return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, padding:"5px 12px", background:cfg.bg, color:cfg.color, border:"1.5px solid "+cfg.border, borderRadius:20, whiteSpace:"nowrap" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
            {cfg.label}
        </span>
    );
}

/* ── Grade badge ── */
function GradeBadge({ position }) {
    const label = gradeLabel(position);
    return (
        <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 12px", background:NAV, color:GOLD, border:"1px solid "+GOLD+"60", borderRadius:999 }}>
            {label}
        </span>
    );
}

/* ── Avatar ── */
function Avatar({ staff, size, onClick }) {
    const [err, setErr] = useState(false);
    const [hov, setHov] = useState(false);
    const hasImg  = !!staff.image_url && !err;
    const initials = staff.name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";

    return (
        <div
            onClick={onClick ? e => { e.stopPropagation(); onClick(); } : undefined}
            onMouseEnter={() => onClick && setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ width:size, height:size, borderRadius:"50%", background:hasImg?"#e2e8f0":NAV, border:"3px solid "+(hov&&onClick?GOLD:"#e2e8f0"), display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", cursor:onClick?"pointer":"default", transition:"all .18s", boxShadow:hov&&onClick?"0 0 0 3px "+GOLD+"50":"0 2px 8px rgba(0,0,0,0.1)", flexShrink:0, position:"relative" }}>
            {hasImg ? (
                <img src={staff.image_url} alt={staff.name} onError={() => setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:hov&&onClick?0.55:1, transition:"opacity .18s" }} />
            ) : (
                <span style={{ fontSize:size*0.33, fontWeight:900, color:GOLD, userSelect:"none", fontFamily:SERIF }}>{initials}</span>
            )}
            {onClick && hov && (
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(10,31,82,0.55)", borderRadius:"50%" }}>
                    <svg width={size*0.28} height={size*0.28} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
            )}
        </div>
    );
}

/* ── Photo modal ── */
function PhotoModal({ staff, onClose, onDone, addToast }) {
    const [preview, setPreview] = useState(staff.image_url || null);
    const [file,    setFile]    = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    function pick(e) {
        const f = e.target.files[0];
        if (!f) return;
        if (f.size > 5*1024*1024) { addToast("Image must be under 5 MB.", "error"); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }

    async function save() {
        if (!file) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("image", file);
            const res  = await fetch(`${API_URL}/admin/staff/${staff.id}/photo`, { method:"POST", headers:authHeader(), body:fd });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `Server error (${res.status}).`);
            addToast("Photo updated.");
            onDone({ ...staff, image_url: data.image_url });
            onClose();
        } catch (err) { addToast(err.message||"Upload failed.", "error"); }
        finally { setLoading(false); }
    }

    async function remove() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/staff/${staff.id}/photo`, { method:"DELETE", headers:authHeader() });
            if (!res.ok) throw new Error("Failed to remove photo.");
            addToast("Photo removed.");
            onDone({ ...staff, image_url: null });
            onClose();
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoading(false); }
    }

    return (
        <div style={{ position:"fixed", inset:0, zIndex:1300, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
            <div style={{ width:"100%", maxWidth:360, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.35)" }} onClick={e => e.stopPropagation()}>
                <div style={{ background:NAV, padding:"20px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                        <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#fff", fontFamily:SERIF }}>Change Photo</p>
                        <p style={{ margin:"3px 0 0", fontSize:12, color:GOLD+"99" }}>{staff.name}</p>
                    </div>
                    <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
                <div style={{ padding:"28px 24px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
                    <div onClick={() => inputRef.current?.click()} style={{ width:140, height:140, borderRadius:"50%", border:"3px dashed "+(file?GOLD:"#d1d5db"), background:file?"#fffbeb":"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", cursor:"pointer" }}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.style.display="none"; }} />
                        ) : (
                            <div style={{ textAlign:"center", padding:16 }}>
                                <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.5} style={{ display:"block", margin:"0 auto 8px" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>Click to upload</span>
                            </div>
                        )}
                    </div>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} style={{ display:"none" }} />
                    <p style={{ fontSize:11, color:"#9ca3af", margin:"-8px 0 0" }}>JPG, PNG or WEBP · Max 5MB</p>
                    <div style={{ display:"flex", gap:10, width:"100%" }}>
                        {staff.image_url && (
                            <button onClick={remove} disabled={loading} style={{ flex:1, padding:"11px 0", fontSize:11, fontWeight:700, background:"#fff", border:"1.5px solid #fca5a5", color:"#dc2626", borderRadius:10, cursor:loading?"not-allowed":"pointer" }}>Remove</button>
                        )}
                        <button onClick={() => inputRef.current?.click()} style={{ flex:1, padding:"11px 0", fontSize:11, fontWeight:700, background:"#f1f5f9", border:"1.5px solid #e2e8f0", color:"#475569", borderRadius:10, cursor:"pointer" }}>Choose</button>
                        <button onClick={save} disabled={!file||loading} style={{ flex:2, padding:"11px 0", fontSize:11, fontWeight:800, background:!file||loading?"#e2e8f0":NAV, color:!file||loading?"#94a3b8":GOLD, border:"none", borderRadius:10, cursor:!file||loading?"not-allowed":"pointer" }}>
                            {loading ? "Saving…" : "Save Photo"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   STAFF FORM MODAL
   Key fix: display_order clamped to [0, maxOrder]
            so admin can't set a number beyond existing max
══════════════════════════════════════════════════════════ */
function StaffFormModal({ staff: existingStaff, allStaff = [], onClose, onSaved, addToast }) {
    const isEdit = !!existingStaff;

    /* ── Compute the allowed maximum order ──────────────────
       On create : max existing order (new item appended at end = max+1, handled by API)
       On edit   : max existing order (can swap into any existing slot)
       The admin picks a slot 0..maxOrder.
       The API auto-assigns max+1 if creating without specifying.
    ──────────────────────────────────────────────────────── */
    const currentMax = allStaff.length > 0
        ? Math.max(...allStaff.map(s => s.display_order ?? 0))
        : 0;

    /* On create, default to currentMax+1 (appended at end) but clamp UI to currentMax */
    const defaultOrder = isEdit
        ? (existingStaff.display_order ?? 0)
        : currentMax + 1;  // API will auto-assign, we show it read-only on create

    function stripGradeSuffix(pos) {
        if (!pos) return "";
        return pos.replace(/\s*(principal|kinder|grade\s+(i{1,3}|iv|vi?|vi{1,2}))\s*adviser\s*$/i, "").trim();
    }

    const initGradeLabel    = isEdit ? gradeLabel(existingStaff.position) : "Faculty";
    const initBasePosition  = isEdit ? (stripGradeSuffix(existingStaff.position) || existingStaff.position) : "";

    const [form, setForm] = useState({
        name:          existingStaff?.name         || "",
        basePosition:  initBasePosition,
        gradeLabel:    initGradeLabel,
        display_order: defaultOrder,
        is_active:     existingStaff?.is_active !== undefined ? Boolean(existingStaff.is_active) : true,
        facebook_url:  existingStaff?.facebook_url || "",
        twitter_url:   existingStaff?.twitter_url  || "",
        linkedin_url:  existingStaff?.linkedin_url || "",
    });
    const [loading, setLoading] = useState(false);
    const [errors,  setErrors]  = useState({});

    function set(k, v) { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); }

    function buildPosition() {
        const base  = form.basePosition.trim();
        const label = form.gradeLabel;
        if (!base) return label === "Faculty" ? "" : label + " Adviser";
        if (label === "Faculty" || label === "Principal") return base;
        return base + " — " + label;
    }

    const positionPreview = buildPosition() || form.basePosition.trim() || "—";

    function validate() {
        const e = {};
        if (!form.name.trim())         e.name         = "Full name is required.";
        if (!form.basePosition.trim()) e.basePosition = "Position / role is required.";
        if (isEdit) {
            const n = Number(form.display_order);
            if (isNaN(n) || n < 0)          e.display_order = "Enter a valid number (0 or above).";
            else if (n > currentMax)         e.display_order = `Maximum allowed order is ${currentMax}. You cannot skip positions.`;
        }
        setErrors(e);
        return !Object.keys(e).length;
    }

    async function submit() {
        if (!validate()) return;
        setLoading(true);
        try {
            const url    = isEdit ? `${API_URL}/admin/staff/${existingStaff.id}` : `${API_URL}/admin/staff`;
            const method = isEdit ? "PUT" : "POST";

            /* On create we omit display_order — API auto-assigns max+1 */
            const body = {
                name:          form.name.trim(),
                position:      positionPreview,
                is_active:     form.is_active,
                facebook_url:  form.facebook_url.trim()  || null,
                twitter_url:   form.twitter_url.trim()   || null,
                linkedin_url:  form.linkedin_url.trim()  || null,
            };
            if (isEdit) body.display_order = Number(form.display_order);

            const res  = await fetch(url, {
                method,
                headers: { ...authHeader(), "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (data.errors) {
                    const mapped = {};
                    Object.entries(data.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
                    setErrors(mapped);
                    addToast(Object.values(mapped)[0] || "Please fix the errors.", "error");
                } else {
                    addToast(data.message || `Server error (${res.status}).`, "error");
                }
                return;
            }
            addToast(isEdit ? `"${form.name}" updated.` : `"${form.name}" added to staff.`);
            onSaved(data.staff || data);
            onClose();
        } catch {
            addToast("Network error — check that the API server is running.", "error");
        } finally { setLoading(false); }
    }

    const inp = { fontSize:13, fontFamily:SERIF, color:"#1a1a1a", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", width:"100%", boxSizing:"border-box" };

    return (
        <div style={{ position:"fixed", inset:0, zIndex:1100, background:"rgba(10,31,82,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", overflowY:"auto" }} onClick={onClose}>
            <div style={{ width:"100%", maxWidth:600, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.25)", marginBlock:"auto" }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ background:NAV, padding:"24px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(245,197,24,0.07)" }} />
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
                        <div>
                            <p style={{ margin:0, fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD+"80" }}>
                                {isEdit ? "Edit Staff Member" : "New Staff Member"}
                            </p>
                            <h2 style={{ margin:"4px 0 0", fontSize:19, fontWeight:800, color:"#fff", fontFamily:SERIF }}>
                                {isEdit ? existingStaff.name : "Add to Staff Directory"}
                            </h2>
                        </div>
                        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                    </div>
                </div>

                <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:16, maxHeight:"75vh", overflowY:"auto" }}>

                    {/* Name */}
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>Full Name <span style={{ color:"#ef4444" }}>*</span></label>
                        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Maria Santos Dela Cruz" style={{ ...inp, borderColor:errors.name?"#ef4444":"#e2e8f0" }} />
                        {errors.name && <span style={{ fontSize:11, color:"#ef4444" }}>⚠ {errors.name}</span>}
                    </div>

                    {/* Position block */}
                    <div style={{ background:"#f8fafc", borderRadius:12, padding:"16px", border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", gap:12 }}>
                        <p style={{ margin:0, fontSize:9, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#94a3b8" }}>Position / Role</p>

                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>Role Title <span style={{ color:"#ef4444" }}>*</span></label>
                            <input value={form.basePosition} onChange={e => set("basePosition", e.target.value)} placeholder="e.g. Adviser, Subject Teacher, Principal" style={{ ...inp, background:"#fff", borderColor:errors.basePosition?"#ef4444":"#e2e8f0" }} />
                            {errors.basePosition && <span style={{ fontSize:11, color:"#ef4444" }}>⚠ {errors.basePosition}</span>}
                        </div>

                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>
                                Grade Level Badge <span style={{ fontSize:9, color:"#94a3b8", textTransform:"none", letterSpacing:0 }}>(shown on card's top-right corner)</span>
                            </label>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                                {GRADE_LABELS.map(gl => {
                                    const active = form.gradeLabel === gl;
                                    return (
                                        <button key={gl} type="button" onClick={() => set("gradeLabel", gl)}
                                            style={{ fontSize:11, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", padding:"7px 14px", borderRadius:999, cursor:"pointer", transition:"all .15s",
                                                background:active?NAV:"#fff", color:active?GOLD:"#475569", border:active?`2px solid ${NAV}`:"2px solid #e2e8f0" }}>
                                            {gl}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8", flexShrink:0 }}>Preview:</span>
                            <span style={{ fontSize:13, fontWeight:700, color:NAV, fontFamily:SERIF }}>{positionPreview}</span>
                            <span style={{ marginLeft:"auto", flexShrink:0 }}><GradeBadge position={positionPreview} /></span>
                        </div>
                    </div>

                    {/* Display order + Status */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>Display Order</label>

                            {isEdit ? (
                                <>
                                    {/* Range slider — visual, clamped to 0..currentMax */}
                                    <input
                                        type="range"
                                        min={0}
                                        max={currentMax}
                                        step={1}
                                        value={Math.min(Number(form.display_order), currentMax)}
                                        onChange={e => set("display_order", Number(e.target.value))}
                                        style={{ accentColor: NAV, width:"100%", cursor:"pointer" }}
                                    />
                                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                        <span style={{ fontSize:11, color:"#94a3b8" }}>0 (first) — {currentMax} (last)</span>
                                        <span style={{ fontSize:14, fontWeight:900, color:NAV, background:"#f0f4ff", border:"1.5px solid "+NAV+"30", padding:"3px 14px", borderRadius:6 }}>
                                            #{Math.min(Number(form.display_order), currentMax)}
                                        </span>
                                    </div>
                                    {errors.display_order && <span style={{ fontSize:11, color:"#ef4444" }}>⚠ {errors.display_order}</span>}
                                    <span style={{ fontSize:11, color:"#94a3b8" }}>Lower number = shown first. Drag to reorder.</span>
                                </>
                            ) : (
                                /* On create, order is auto-assigned — show read-only info */
                                <div style={{ padding:"10px 14px", background:"#f0f4ff", border:"1.5px solid "+NAV+"25", borderRadius:8 }}>
                                    <p style={{ margin:0, fontSize:13, fontWeight:800, color:NAV, fontFamily:SERIF }}>#{currentMax + 1} (auto)</p>
                                    <p style={{ margin:"3px 0 0", fontSize:11, color:"#64748b" }}>Automatically placed after the current last staff member (#{currentMax}). You can reorder later by editing.</p>
                                </div>
                            )}
                        </div>

                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>Status</label>
                            <div style={{ display:"flex", gap:10 }}>
                                {[{ val:true, label:"Active", color:"#16a34a" }, { val:false, label:"Inactive", color:"#94a3b8" }].map(({ val, label, color }) => {
                                    const active = form.is_active === val;
                                    return (
                                        <button key={String(val)} type="button" onClick={() => set("is_active", val)}
                                            style={{ flex:1, padding:"10px 0", fontSize:12, fontWeight:700, borderRadius:9, cursor:"pointer", transition:"all .15s",
                                                background:active?color:"#f8fafc", color:active?"#fff":"#475569", border:active?`2px solid ${color}`:"2px solid #e2e8f0" }}>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Social links */}
                    <div style={{ background:"#f8fafc", borderRadius:12, padding:"16px", border:"1px solid #f1f5f9", display:"flex", flexDirection:"column", gap:12 }}>
                        <p style={{ margin:0, fontSize:9, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#94a3b8" }}>Social Links (optional)</p>
                        {[
                            { key:"facebook_url", label:"Facebook URL",    ph:"https://facebook.com/…" },
                            { key:"twitter_url",  label:"Twitter / X URL", ph:"https://twitter.com/…"  },
                            { key:"linkedin_url", label:"LinkedIn URL",    ph:"https://linkedin.com/in/…" },
                        ].map(({ key, label, ph }) => (
                            <div key={key} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                                <label style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#64748b" }}>{label}</label>
                                <input type="url" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={{ ...inp, background:"#fff" }} />
                            </div>
                        ))}
                    </div>

                    {isEdit && (
                        <div style={{ background:"#fffbeb", borderRadius:10, padding:"12px 16px", border:"1px solid #fde68a", display:"flex", alignItems:"center", gap:8 }}>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <p style={{ margin:0, fontSize:12, color:"#92400e", fontWeight:600 }}>To change the profile photo, close this and click the avatar in the detail view.</p>
                        </div>
                    )}
                </div>

                <div style={{ padding:"16px 24px 24px", display:"flex", justifyContent:"flex-end", gap:10, borderTop:"1px solid #f1f5f9" }}>
                    <button onClick={onClose} style={{ fontSize:12, fontWeight:700, padding:"12px 24px", background:"#f1f5f9", border:"1.5px solid #e2e8f0", color:"#475569", borderRadius:10, cursor:"pointer" }}>Cancel</button>
                    <button onClick={submit} disabled={loading}
                        style={{ fontSize:12, fontWeight:800, padding:"12px 28px", background:loading?"#e2e8f0":NAV, color:loading?"#94a3b8":GOLD, border:"none", borderRadius:10, cursor:loading?"not-allowed":"pointer" }}>
                        {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Staff Member"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   DETAIL MODAL
══════════════════════════════════════════════════════════ */
function DetailModal({ staff: initial, allStaff, onClose, onUpdated, addToast }) {
    const [staff,        setStaff]        = useState(initial);
    const [photoModal,   setPhotoModal]   = useState(false);
    const [editing,      setEditing]      = useState(false);
    const [confirm,      setConfirm]      = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);

    function handlePhotoUpdate(updated) { setStaff(updated); onUpdated(updated); }
    function handleEdited(updated)      { setStaff(updated); onUpdated(updated); }

    async function toggleStatus() {
        const next = !staff.is_active;
        setSavingStatus(true);
        try {
            const res = await fetch(`${API_URL}/admin/staff/${staff.id}`, {
                method: "PUT",
                headers: { ...authHeader(), "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Update failed.");
            const updated = { ...staff, is_active: next };
            setStaff(updated);
            onUpdated(updated);
            addToast(`${staff.name} is now ${next ? "Active" : "Inactive"}.`);
        } catch (err) {
            addToast(err.message, "error");
        } finally { setSavingStatus(false); }
    }

    const infoRows = [
        { label: "Position",      value: staff.position },
        { label: "Grade Badge",   value: <GradeBadge position={staff.position} /> },
        { label: "Display Order", value: `#${staff.display_order}` },
        { label: "Status",        value: <StatusBadge isActive={staff.is_active} /> },
        { label: "Added",         value: formatDate(staff.created_at) },
        { label: "Facebook",  value: staff.facebook_url  ? <a href={staff.facebook_url}  target="_blank" rel="noreferrer" style={{ color:"#1877f2", fontWeight:700 }}>View Profile</a> : null },
        { label: "Twitter/X", value: staff.twitter_url   ? <a href={staff.twitter_url}   target="_blank" rel="noreferrer" style={{ color:"#000",    fontWeight:700 }}>View Profile</a> : null },
        { label: "LinkedIn",  value: staff.linkedin_url  ? <a href={staff.linkedin_url}  target="_blank" rel="noreferrer" style={{ color:"#0a66c2", fontWeight:700 }}>View Profile</a> : null },
    ];

    return (
        <>
            <div style={{ position:"fixed", inset:0, zIndex:1100, background:"rgba(10,31,82,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", overflowY:"auto" }} onClick={onClose}>
                <div style={{ width:"100%", maxWidth:560, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.25)", marginBlock:"auto" }} onClick={e => e.stopPropagation()}>

                    <div style={{ background:NAV, padding:"24px 24px 80px", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(245,197,24,0.07)" }} />
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
                            <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD+"80" }}>Staff Profile</span>
                            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                        </div>
                    </div>

                    <div style={{ margin:"-52px 20px 0", background:"#fff", borderRadius:16, padding:"20px 22px", boxShadow:"0 4px 24px rgba(0,0,0,0.12)", display:"flex", alignItems:"flex-start", gap:18, position:"relative", zIndex:1 }}>
                        <Avatar staff={staff} size={80} onClick={() => setPhotoModal(true)} />
                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                <p style={{ margin:0, fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:"0.1em", textTransform:"uppercase" }}>ID #{staff.id}</p>
                                <GradeBadge position={staff.position} />
                            </div>
                            <h2 style={{ margin:"0 0 4px", fontSize:19, fontWeight:800, color:"#0f172a", fontFamily:SERIF, lineHeight:1.2 }}>{staff.name}</h2>
                            <p style={{ margin:"0 0 14px", fontSize:13, color:"#64748b", fontFamily:SERIF }}>{staff.position}</p>

                            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                                <span style={{ fontSize:11, fontWeight:700, color:"#64748b" }}>Status:</span>
                                {[{ key:true, label:"Active", color:"#16a34a" }, { key:false, label:"Inactive", color:"#94a3b8" }].map(({ key, label, color }) => {
                                    const isCur = staff.is_active === key;
                                    return (
                                        <button key={String(key)} onClick={() => !isCur && !savingStatus && toggleStatus()} disabled={savingStatus}
                                            style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:12, fontWeight:700, padding:"8px 18px", borderRadius:20,
                                                background:isCur?color:"#f8fafc", color:isCur?"#fff":"#475569",
                                                border:isCur?`2px solid ${color}`:"2px solid #e2e8f0",
                                                cursor:savingStatus?"not-allowed":isCur?"default":"pointer", transition:"all .18s" }}>
                                            <span style={{ width:8, height:8, borderRadius:"50%", background:isCur?"rgba(255,255,255,0.9)":color, flexShrink:0 }} />
                                            {label}
                                        </button>
                                    );
                                })}
                                {savingStatus && <span style={{ fontSize:11, color:"#94a3b8", fontStyle:"italic" }}>Saving…</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ margin:"12px 22px 0", background:"#fffbeb", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:8, border:"1px solid #fde68a" }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ margin:0, fontSize:12, color:"#92400e", fontWeight:600 }}>Click the photo to upload or change the profile picture.</p>
                    </div>

                    <div style={{ padding:"16px 22px 8px" }}>
                        <p style={{ margin:"0 0 12px", fontSize:9, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"#94a3b8" }}>Staff Information</p>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                            {infoRows.map((row, i) => (
                                <div key={i} style={{ background:"#f8fafc", borderRadius:10, padding:"12px 16px", border:"1px solid #f1f5f9" }}>
                                    <p style={{ margin:"0 0 5px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8" }}>{row.label}</p>
                                    <div style={{ fontSize:13, fontWeight:600, color:row.value?"#0f172a":"#cbd5e1", fontFamily:SERIF }}>{row.value || "—"}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding:"16px 22px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                        <button onClick={() => setConfirm(true)} style={{ fontSize:11, fontWeight:700, padding:"10px 18px", background:"#fff", border:"1.5px solid #fca5a5", color:"#dc2626", borderRadius:10, cursor:"pointer" }}>Delete</button>
                        <div style={{ display:"flex", gap:10 }}>
                            <button onClick={() => setEditing(true)} style={{ fontSize:12, fontWeight:800, padding:"12px 24px", background:GOLD, color:NAV, border:"none", borderRadius:10, cursor:"pointer" }}>Edit →</button>
                            <button onClick={onClose} style={{ fontSize:12, fontWeight:800, padding:"12px 24px", background:NAV, color:GOLD, border:"none", borderRadius:10, cursor:"pointer" }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {photoModal && <PhotoModal staff={staff} onClose={() => setPhotoModal(false)} onDone={handlePhotoUpdate} addToast={addToast} />}
            {editing && (
                <StaffFormModal staff={staff} allStaff={allStaff} onClose={() => setEditing(false)}
                    onSaved={u => { handleEdited(u); setEditing(false); }} addToast={addToast} />
            )}
            {confirm && (
                <ConfirmModal title="Delete Staff Member" message={`Delete "${staff.name}" permanently? This cannot be undone.`}
                    confirmLabel="Delete" confirmColor="#dc2626"
                    onConfirm={async () => {
                        setConfirm(false);
                        try {
                            const res = await fetch(`${API_URL}/admin/staff/${staff.id}`, { method:"DELETE", headers:authHeader() });
                            if (!res.ok) throw new Error("Delete failed.");
                            addToast(`"${staff.name}" deleted.`);
                            onUpdated({ ...staff, _deleted: true });
                            onClose();
                        } catch (err) { addToast(err.message, "error"); }
                    }}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AdminStaff() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();

    const [staff,      setStaff]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [selected,   setSelected]   = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [search,     setSearch]     = useState("");
    const [filter,     setFilter]     = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/staff`, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            const data = await res.json();
            setStaff(Array.isArray(data) ? data : data.data || []);
        } catch (_) {
            addToast("Failed to load staff.", "error");
        } finally { setLoading(false); }
    }, [navigate]);

    useEffect(() => { load(); }, [load]);

    function handleUpdated(updated) {
        if (updated._deleted) {
            setStaff(prev => prev.filter(s => s.id !== updated.id));
            if (selected?.id === updated.id) setSelected(null);
            return;
        }
        setStaff(prev => {
            const exists = prev.find(s => s.id === updated.id);
            return exists ? prev.map(s => s.id === updated.id ? updated : s) : [...prev, updated];
        });
        if (selected?.id === updated.id) setSelected(updated);
    }

    const filtered = staff.filter(s => {
        const q      = search.toLowerCase();
        const matchQ = !q || s.name.toLowerCase().includes(q) || s.position.toLowerCase().includes(q);
        const matchF = !filter || (filter === "active" ? s.is_active : !s.is_active);
        return matchQ && matchF;
    });

    const total    = staff.length;
    const active   = staff.filter(s => s.is_active).length;
    const inactive = staff.filter(s => !s.is_active).length;

    return (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Header */}
            <div style={{ background:NAV, borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                    <p style={{ margin:0, fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD, opacity:0.7 }}>Admin Panel</p>
                    <h1 style={{ margin:"4px 0 0", fontSize:22, fontWeight:800, color:"#fff", fontFamily:SERIF }}>Staff Directory</h1>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                    <button onClick={load} style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 20px", background:"rgba(255,255,255,0.12)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:8, cursor:"pointer" }}>↻ Refresh</button>
                    <button onClick={() => setShowCreate(true)} style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 20px", background:GOLD, color:NAV, border:"none", borderRadius:8, cursor:"pointer" }}>+ Add Staff</button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))", gap:10 }}>
                {[
                    { label:"Total",    value:total,    bg:"#f0f4ff", color:NAV,        border:NAV+"20",    fv:""         },
                    { label:"Active",   value:active,   bg:"#dcfce7", color:"#14532d", border:"#16a34a40", fv:"active"   },
                    { label:"Inactive", value:inactive, bg:"#f1f5f9", color:"#475569", border:"#94a3b840", fv:"inactive" },
                ].map(card => {
                    const sel = filter === card.fv;
                    return (
                        <div key={card.label} onClick={() => setFilter(sel?"":card.fv)}
                            style={{ background:card.bg, borderRadius:12, padding:"16px 18px", border:"2px solid "+(sel?card.color:card.border), cursor:"pointer", transition:"all .18s", transform:sel?"translateY(-2px)":"none" }}
                            onMouseEnter={e => { if(!sel) e.currentTarget.style.borderColor=card.color; }}
                            onMouseLeave={e => { if(!sel) e.currentTarget.style.borderColor=card.border; }}>
                            <p style={{ margin:0, fontSize:28, fontWeight:900, color:card.color, fontFamily:SERIF, lineHeight:1 }}>{card.value}</p>
                            <p style={{ margin:"6px 0 0", fontSize:10, fontWeight:700, color:card.color, opacity:0.65, textTransform:"uppercase", letterSpacing:"0.1em" }}>{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div style={{ background:"#fff", borderRadius:12, padding:"14px 18px", border:"1.5px solid #f1f5f9", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                <input type="text" placeholder="Search by name or position…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ flex:"1 1 180px", fontSize:13, fontFamily:SERIF, color:"#1a1a1a", padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", minWidth:150 }} />
                <select value={filter} onChange={e => setFilter(e.target.value)}
                    style={{ fontSize:12, fontFamily:SERIF, color:"#334155", padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", cursor:"pointer" }}>
                    <option value="">All Statuses</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                </select>
                {(search||filter) && (
                    <button onClick={() => { setSearch(""); setFilter(""); }} style={{ fontSize:11, fontWeight:700, padding:"9px 14px", background:"#fef2f2", border:"1.5px solid #fecaca", color:"#dc2626", borderRadius:8, cursor:"pointer" }}>Clear ×</button>
                )}
                <span style={{ fontSize:11, color:"#94a3b8", marginLeft:"auto", fontFamily:SERIF }}>{filtered.length} result{filtered.length!==1?"s":""}</span>
            </div>

            {/* Table */}
            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:"1.5px solid #f1f5f9", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:4, height:18, background:GOLD, borderRadius:2 }} />
                        <span style={{ fontSize:13, fontWeight:800, color:NAV }}>Staff Members</span>
                    </div>
                    <span style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{staff.length} total</span>
                </div>

                <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:640 }}>
                        <thead>
                            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                                <th style={{ padding:"12px 16px", width:60 }}></th>
                                {["Name","Position","Badge","Order","Status",""].map(h => (
                                    <th key={h} style={{ padding:"12px 16px", textAlign:h===""?"right":"left", fontSize:9, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:"#64748b", whiteSpace:"nowrap" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({ length:5 }).map((_,i) => (
                                <tr key={i} style={{ borderBottom:"1px solid #f8fafc" }}>
                                    <td style={{ padding:"14px 16px" }}><div style={{ width:44, height:44, borderRadius:"50%", background:"#f1f5f9" }} /></td>
                                    {[140,120,80,50,80,60].map((w,j) => (
                                        <td key={j} style={{ padding:"14px 16px" }}><div style={{ height:13, width:w, background:"#f1f5f9", borderRadius:6 }} /></td>
                                    ))}
                                </tr>
                            ))}

                            {!loading && filtered.length===0 && (
                                <tr><td colSpan={7} style={{ padding:"60px 20px", textAlign:"center" }}>
                                    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                                        <div style={{ width:56, height:56, background:"#f1f5f9", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </div>
                                        <p style={{ margin:0, fontSize:14, color:"#94a3b8", fontFamily:SERIF }}>
                                            {search||filter ? "No staff match your filters." : "No staff members yet."}
                                        </p>
                                        {!search && !filter && (
                                            <button onClick={() => setShowCreate(true)} style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"10px 20px", background:NAV, color:GOLD, border:"none", borderRadius:8, cursor:"pointer" }}>
                                                Add First Staff Member
                                            </button>
                                        )}
                                    </div>
                                </td></tr>
                            )}

                            {!loading && filtered.map(s => (
                                <tr key={s.id} onClick={() => setSelected(s)}
                                    style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", transition:"background .1s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background="#f0f4ff"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                                    <td style={{ padding:"12px 16px" }}><Avatar staff={s} size={44} /></td>
                                    <td style={{ padding:"12px 16px" }}>
                                        <p style={{ margin:0, fontWeight:800, color:NAV, fontFamily:SERIF, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{s.name}</p>
                                        {(s.facebook_url||s.twitter_url||s.linkedin_url) && (
                                            <div style={{ display:"flex", gap:5, marginTop:3 }}>
                                                {[{url:s.facebook_url,l:"f",c:"#1877f2"},{url:s.twitter_url,l:"𝕏",c:"#000"},{url:s.linkedin_url,l:"in",c:"#0a66c2"}]
                                                    .filter(x => x.url)
                                                    .map(x => (
                                                        <a key={x.l} href={x.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                                            style={{ fontSize:9, fontWeight:900, color:"#fff", background:x.c, padding:"1px 5px", borderRadius:3, textDecoration:"none" }}>{x.l}</a>
                                                    ))}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding:"12px 16px", color:"#475569", fontFamily:SERIF, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:140 }}>{s.position}</td>
                                    <td style={{ padding:"12px 16px" }}><GradeBadge position={s.position} /></td>
                                    <td style={{ padding:"12px 16px" }}>
                                        <span style={{ fontSize:12, fontWeight:800, color:NAV, background:"#f0f4ff", border:"1.5px solid "+NAV+"30", padding:"3px 10px", borderRadius:6 }}>#{s.display_order}</span>
                                    </td>
                                    <td style={{ padding:"12px 16px" }}><StatusBadge isActive={s.is_active} /></td>
                                    <td style={{ padding:"12px 16px", textAlign:"right" }}>
                                        <button onClick={e => { e.stopPropagation(); setSelected(s); }}
                                            style={{ fontSize:11, fontWeight:800, padding:"8px 16px", background:NAV, color:GOLD, border:"none", borderRadius:8, cursor:"pointer" }}
                                            onMouseEnter={e => { e.currentTarget.style.opacity="0.85"; }}
                                            onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
                                            View →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected   && <DetailModal staff={selected} allStaff={staff} onClose={() => setSelected(null)} onUpdated={handleUpdated} addToast={addToast} />}
            {showCreate && <StaffFormModal allStaff={staff} onClose={() => setShowCreate(false)} onSaved={saved => { handleUpdated(saved); setShowCreate(false); }} addToast={addToast} />}
            <Toast toasts={toasts} />
        </div>
    );
}