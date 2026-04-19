import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV      = "#0a1f52";
const GOLD     = "#f5c518";
const SERIF    = "Georgia, serif";
const API_URL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const BASE_URL = API_URL.replace("/api", "");

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}
function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
function fullName(s) {
    return [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");
}
function getInitials(s) {
    return [s.first_name, s.last_name].filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function getPhotoUrl(student) {
    if (student.profile_picture_url) return student.profile_picture_url;
    if (student.profile_picture) return BASE_URL + "/storage/" + student.profile_picture;
    return null;
}

const STATUS_CFG = {
    active:    { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Active"    },
    inactive:  { bg: "#fef9c3", color: "#713f12", border: "#ca8a04", dot: "#ca8a04", label: "Inactive"  },
    graduated: { bg: "#ede9fe", color: "#4c1d95", border: "#7c3aed", dot: "#7c3aed", label: "Graduated" },
};

/* ─── Toast ─────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
            {toasts.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.type === "success" ? "#052e16" : "#450a0a", color: t.type === "success" ? "#bbf7d0" : "#fecaca", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid " + (t.type === "success" ? "#166534" : "#991b1b"), minWidth: 240, animation: "toastIn .25s ease", pointerEvents: "none" }}>
                    <span style={{ fontSize: 16 }}>{t.type === "success" ? "✓" : "✕"}</span>
                    {t.message}
                </div>
            ))}
            <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(message, type = "success") {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }
    return { toasts, addToast };
}

/* ─── Confirm Modal ──────────────────────────────────────────────────── */
function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onCancel}>
            <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: NAV, padding: "20px 24px" }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>{title}</p>
                </div>
                <div style={{ padding: "22px 24px 24px" }}>
                    <p style={{ margin: "0 0 22px", fontSize: 14, color: "#334155", lineHeight: 1.6, fontFamily: SERIF }}>{message}</p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button onClick={onCancel} style={{ fontSize: 12, fontWeight: 700, padding: "10px 22px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 9, cursor: "pointer" }}>Cancel</button>
                        <button onClick={onConfirm} style={{ fontSize: 12, fontWeight: 800, padding: "10px 22px", background: confirmColor || NAV, color: GOLD, border: "none", borderRadius: 9, cursor: "pointer" }}>{confirmLabel || "Confirm"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Badge ──────────────────────────────────────────────────────────── */
function Badge({ status }) {
    const cfg = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.active;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 12px", background: cfg.bg, color: cfg.color, border: "1.5px solid " + cfg.border, borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

/* ─── Avatar ─────────────────────────────────────────────────────────── */
function Avatar({ student, size, onClick, badge }) {
    const [imgErr, setImgErr] = useState(false);
    const [hov,    setHov]    = useState(false);
    const photoUrl = getPhotoUrl(student);
    const hasPhoto = !!photoUrl && !imgErr;
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <div
                onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
                onMouseEnter={() => onClick && setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{ width: size, height: size, borderRadius: "50%", background: hasPhoto ? "#e2e8f0" : NAV, border: "3px solid " + (hov && onClick ? GOLD : "#e2e8f0"), display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: onClick ? "pointer" : "default", transition: "all .18s", boxShadow: hov && onClick ? "0 0 0 3px " + GOLD + "50" : "0 2px 8px rgba(0,0,0,0.1)", position: "relative" }}
            >
                {hasPhoto ? (
                    <img src={photoUrl} alt={fullName(student)} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: hov && onClick ? 0.65 : 1, transition: "opacity .18s" }} />
                ) : (
                    <span style={{ fontSize: size * 0.33, fontWeight: 900, color: GOLD, userSelect: "none", fontFamily: SERIF }}>{getInitials(student)}</span>
                )}
                {onClick && hov && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,31,82,0.55)", borderRadius: "50%" }}>
                        <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </div>
                )}
            </div>
            {badge && (
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, background: GOLD, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={NAV} strokeWidth={3}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
            )}
        </div>
    );
}

/* ─── Photo Modal ────────────────────────────────────────────────────── */
function PhotoModal({ student, onClose, onDone }) {
    const [preview, setPreview] = useState(getPhotoUrl(student));
    const [file,    setFile]    = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");
    const inputRef = useRef(null);

    function pick(e) {
        const f = e.target.files[0];
        if (!f) return;
        if (f.size > 2 * 1024 * 1024) { setError("File too large. Max 2MB."); return; }
        setFile(f); setPreview(URL.createObjectURL(f)); setError("");
    }

    async function save() {
        if (!file) return;
        setLoading(true); setError("");
        try {
            const fd = new FormData();
            fd.append("photo", file);
            const res = await fetch(API_URL + "/admin/students/" + student.id + "/photo", { method: "POST", headers: authHeader(), body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed.");
            onDone({ ...student, profile_picture_url: data.profile_picture_url, profile_picture: data.profile_picture });
            onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function remove() {
        if (!window.confirm("Remove this student's photo?")) return;
        setLoading(true); setError("");
        try {
            const res = await fetch(API_URL + "/admin/students/" + student.id + "/photo", { method: "DELETE", headers: authHeader() });
            if (!res.ok) throw new Error("Failed to remove.");
            onDone({ ...student, profile_picture_url: null, profile_picture: null });
            onClose();
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    const hasExisting = !!(student.profile_picture_url || student.profile_picture);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: NAV, padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Change Photo</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: GOLD + "99" }}>{fullName(student)}</p>
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
                <div style={{ padding: "28px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                    <div onClick={() => inputRef.current?.click()} style={{ width: 140, height: 140, borderRadius: "50%", border: "3px dashed " + (file ? GOLD : "#d1d5db"), background: file ? "#fffbeb" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                        ) : (
                            <div style={{ textAlign: "center", padding: 16 }}>
                                <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.5} style={{ display: "block", margin: "0 auto 8px" }}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Click to upload</span>
                            </div>
                        )}
                    </div>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} style={{ display: "none" }} />
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "-8px 0 0" }}>JPG, PNG or WEBP · Max 2MB</p>
                    {error && <div style={{ width: "100%", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{error}</div>}
                    <div style={{ display: "flex", gap: 10, width: "100%" }}>
                        {hasExisting && <button onClick={remove} disabled={loading} style={{ flex: 1, padding: "11px 0", fontSize: 11, fontWeight: 700, background: "#fff", border: "1.5px solid #fca5a5", color: "#dc2626", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer" }}>Remove</button>}
                        <button onClick={() => inputRef.current?.click()} style={{ flex: 1, padding: "11px 0", fontSize: 11, fontWeight: 700, background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, cursor: "pointer" }}>Choose</button>
                        <button onClick={save} disabled={!file || loading} style={{ flex: 2, padding: "11px 0", fontSize: 11, fontWeight: 800, background: !file || loading ? "#e2e8f0" : NAV, color: !file || loading ? "#94a3b8" : GOLD, border: "none", borderRadius: 10, cursor: !file || loading ? "not-allowed" : "pointer" }}>
                            {loading ? "Saving…" : "Save Photo"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Detail Modal ───────────────────────────────────────────────────── */
function DetailModal({ student: initial, onClose, onUpdated, addToast }) {
    const [student,      setStudent]      = useState(initial);
    const [photoModal,   setPhotoModal]   = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [confirm,      setConfirm]      = useState(null); // { statusKey }

    function handlePhotoUpdate(updated) { setStudent(updated); onUpdated(updated); }

    function requestStatusChange(statusKey) {
        const currentVal = (student.status || "active").toLowerCase();
        if (statusKey === currentVal || savingStatus) return;
        setConfirm({ statusKey });
    }

    async function doStatusChange(statusKey) {
        setConfirm(null);
        setSavingStatus(true);
        try {
            const res = await fetch(API_URL + "/admin/students/" + student.id + "/status", {
                method: "PATCH",
                headers: { ...authHeader(), "Content-Type": "application/json" },
                body: JSON.stringify({ status: statusKey }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed.");
            const updated = { ...student, status: statusKey };
            setStudent(updated);
            onUpdated(updated);
            addToast(`Status changed to ${STATUS_CFG[statusKey]?.label} for ${fullName(updated)}.`);
        } catch (err) {
            addToast(err.message || "Failed to update status.", "error");
        } finally {
            setSavingStatus(false);
        }
    }

    const currentStatus = (student.status || "active").toLowerCase();

    const info = [
        { label: "Student No.",     value: student.student_number },
        { label: "Grade Level",     value: student.grade_level    },
        { label: "Section",         value: student.section        },
        { label: "Gender",          value: student.gender         },
        { label: "Date of Birth",   value: formatDate(student.date_of_birth) },
        { label: "Parent/Guardian", value: student.parent_name    },
        { label: "Contact Number",  value: student.contact_number },
        { label: "Enrolled Since",  value: formatDate(student.created_at) },
        { label: "Address",         value: student.address,        wide: true },
    ];

    return (
        <>
            <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
                <div style={{ width: "100%", maxWidth: 580, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={(e) => e.stopPropagation()}>

                    {/* Banner */}
                    <div style={{ background: NAV, padding: "24px 24px 80px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>Student Profile</span>
                            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>
                    </div>

                    {/* Profile card */}
                    <div style={{ margin: "-52px 20px 0", background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "flex-start", gap: 18, position: "relative", zIndex: 1 }}>
                        <Avatar student={student} size={80} onClick={() => setPhotoModal(true)} badge />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{student.student_number}</p>
                            <h2 style={{ margin: "0 0 16px", fontSize: 19, fontWeight: 800, color: "#0f172a", fontFamily: SERIF, lineHeight: 1.2 }}>{fullName(student)}</h2>

                            {/* Status buttons */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", flexShrink: 0 }}>Status:</span>
                                {["active", "inactive", "graduated"].map((statusKey) => {
                                    const cfg      = STATUS_CFG[statusKey];
                                    const isActive = currentStatus === statusKey;
                                    return (
                                        <button
                                            key={statusKey}
                                            onClick={() => requestStatusChange(statusKey)}
                                            disabled={savingStatus}
                                            style={{
                                                display: "inline-flex", alignItems: "center", gap: 7,
                                                fontSize: 12, fontWeight: 700,
                                                padding: "8px 18px", borderRadius: 20, fontFamily: SERIF,
                                                background: isActive ? cfg.border : "#f8fafc",
                                                color:      isActive ? "#fff"     : "#475569",
                                                border:     isActive ? "2px solid " + cfg.border : "2px solid #e2e8f0",
                                                cursor:    savingStatus ? "not-allowed" : isActive ? "default" : "pointer",
                                                opacity:   savingStatus && !isActive ? 0.4 : 1,
                                                transition: "all .18s",
                                                boxShadow: isActive ? "0 2px 8px " + cfg.border + "55" : "none",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive && !savingStatus) {
                                                    e.currentTarget.style.background  = cfg.bg;
                                                    e.currentTarget.style.color       = cfg.color;
                                                    e.currentTarget.style.borderColor = cfg.border;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background  = "#f8fafc";
                                                    e.currentTarget.style.color       = "#475569";
                                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                                }
                                            }}
                                        >
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.9)" : cfg.dot, flexShrink: 0 }} />
                                            {cfg.label}
                                            {isActive && <span style={{ fontSize: 10, opacity: 0.75 }}>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {savingStatus && <p style={{ margin: "8px 0 0", fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Saving…</p>}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div style={{ padding: "20px 22px 8px" }}>
                        <p style={{ margin: "0 0 14px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>Student Information</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {info.map((row, i) => (
                                <div key={i} style={{ gridColumn: row.wide ? "1 / -1" : "auto", background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #f1f5f9" }}>
                                    <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>{row.label}</p>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: row.value ? "#0f172a" : "#cbd5e1", fontFamily: SERIF, lineHeight: 1.45, wordBreak: "break-word" }}>
                                        {row.value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Photo hint */}
                    <div style={{ margin: "10px 22px 0", background: "#fffbeb", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #fde68a" }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ margin: 0, fontSize: 12, color: "#92400e", fontWeight: 600 }}>Click the photo to upload or change the profile picture.</p>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "16px 22px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                        <span style={{ fontSize: 11, color: "#cbd5e1" }}>ID #{student.id}</span>
                        <button onClick={onClose} style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 30px", background: NAV, color: GOLD, border: "none", borderRadius: 10, cursor: "pointer" }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {photoModal && <PhotoModal student={student} onClose={() => setPhotoModal(false)} onDone={handlePhotoUpdate} />}

            {confirm && (
                <ConfirmModal
                    title="Change Student Status"
                    message={`Change ${fullName(student)}'s status to "${STATUS_CFG[confirm.statusKey]?.label}"?`}
                    confirmLabel={`Set ${STATUS_CFG[confirm.statusKey]?.label}`}
                    confirmColor={STATUS_CFG[confirm.statusKey]?.border}
                    onConfirm={() => doStatusChange(confirm.statusKey)}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function Students() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();
    const [students,     setStudents]  = useState([]);
    const [loading,      setLoading]   = useState(true);
    const [selected,     setSelected]  = useState(null);
    const [search,       setSearch]    = useState("");
    const [gradeFilter,  setGrade]     = useState("");
    const [statusFilter, setStatus]    = useState("");
    const [page,         setPage]      = useState(1);
    const [meta,         setMeta]      = useState(null);

    const GRADES = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 15 });
            if (search)       params.set("search",      search);
            if (gradeFilter)  params.set("grade_level", gradeFilter);
            if (statusFilter) params.set("status",      statusFilter);
            const res = await fetch(API_URL + "/admin/students?" + params, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) { setStudents(data); setMeta(null); }
                else { setStudents(data.data || []); setMeta(data); }
            }
        } catch (_) {}
        finally { setLoading(false); }
    }, [page, search, gradeFilter, statusFilter, navigate]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => { setPage(1); }, [search, gradeFilter, statusFilter]);

    function handleUpdated(updated) {
        setStudents((prev) => prev.map((s) => s.id === updated.id ? updated : s));
        if (selected?.id === updated.id) setSelected(updated);
    }

    const total    = meta ? meta.total : students.length;
    const active   = students.filter((s) => s.status === "active").length;
    const inactive = students.filter((s) => s.status === "inactive").length;

    // Stat cards config — clicking sets the status filter
    const statCards = [
        { label: "Total Students", value: total,    bg: "#f0f4ff", color: NAV,       border: NAV + "20",    filterVal: ""         },
        { label: "Active",         value: active,   bg: "#dcfce7", color: "#14532d", border: "#16a34a40",   filterVal: "active"   },
        { label: "Inactive",       value: inactive, bg: "#fef9c3", color: "#713f12", border: "#ca8a0440",   filterVal: "inactive" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                    <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Student Records</h1>
                </div>
                <button onClick={load} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>↻ Refresh</button>
            </div>

            {/* Clickable stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                {statCards.map((card) => {
                    const isSelected = statusFilter === card.filterVal;
                    return (
                        <div
                            key={card.label}
                            onClick={() => { setStatus(card.filterVal); setPage(1); }}
                            style={{
                                background: card.bg,
                                borderRadius: 12,
                                padding: "16px 18px",
                                border: "2px solid " + (isSelected ? card.color : card.border),
                                cursor: "pointer",
                                transition: "all .18s",
                                boxShadow: isSelected ? "0 4px 16px " + card.color + "30" : "none",
                                transform: isSelected ? "translateY(-2px)" : "none",
                                position: "relative",
                                outline: "none",
                            }}
                            onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = "0 2px 8px " + card.color + "20"; } }}
                            onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = card.border; e.currentTarget.style.boxShadow = "none"; } }}
                        >
                            {isSelected && (
                                <div style={{ position: "absolute", top: 10, right: 12, width: 18, height: 18, background: card.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            )}
                            <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: card.color, fontFamily: SERIF, lineHeight: 1 }}>{card.value}</p>
                            <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: card.color, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em" }}>{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Search & filters */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input type="text" placeholder="Search by name or student number…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 180px", fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", minWidth: 150 }} />
                <select value={gradeFilter} onChange={(e) => { setGrade(e.target.value); setPage(1); }} style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                    <option value="">All Grades</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                </select>
                {(search || gradeFilter || statusFilter) && (
                    <button onClick={() => { setSearch(""); setGrade(""); setStatus(""); setPage(1); }} style={{ fontSize: 11, fontWeight: 700, padding: "9px 14px", background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", borderRadius: 8, cursor: "pointer" }}>Clear ×</button>
                )}
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Student List</span>
                    </div>
                    {meta && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{meta.from}–{meta.to} of {meta.total} students</span>}
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                    <colgroup><col style={{ width: 68 }} /><col /><col style={{ width: 130 }} /><col style={{ width: 130 }} /><col style={{ width: 140 }} /><col style={{ width: 110 }} /></colgroup>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                            <th style={{ padding: "12px 16px" }}></th>
                            {["Student", "Grade", "Gender", "Status", ""].map((h) => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: h === "" ? "right" : "left", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && Array.from({ length: 4 }).map((_, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                <td style={{ padding: "14px 16px" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9" }} /></td>
                                {[180, 100, 80, 90, 60].map((w, j) => (
                                    <td key={j} style={{ padding: "14px 16px" }}>
                                        <div style={{ height: 13, width: w, background: "#f1f5f9", borderRadius: 6 }} />
                                        {j === 0 && <div style={{ height: 10, width: 80, background: "#f1f5f9", borderRadius: 4, marginTop: 6 }} />}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {!loading && students.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 56, height: 56, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontFamily: SERIF }}>No students found.</p>
                                </div>
                            </td></tr>
                        )}

                        {!loading && students.map((s) => {
                            const name = [s.first_name, s.last_name].filter(Boolean).join(" ");
                            return (
                                <tr key={s.id} onClick={() => setSelected(s)} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background .1s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f4ff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                                    <td style={{ padding: "12px 16px" }}><Avatar student={s} size={44} /></td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <p style={{ margin: 0, fontWeight: 800, color: NAV, fontFamily: SERIF, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                                        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#94a3b8", fontWeight: 700, background: "#f1f5f9", padding: "2px 7px", borderRadius: 4, display: "inline-block", marginTop: 3 }}>{s.student_number}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#475569", fontFamily: SERIF }}>{s.grade_level || "—"}</td>
                                    <td style={{ padding: "12px 16px", color: "#475569", fontFamily: SERIF }}>{s.gender || "—"}</td>
                                    <td style={{ padding: "12px 16px" }}><Badge status={s.status} /></td>
                                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                        <button onClick={(e) => { e.stopPropagation(); setSelected(s); }} style={{ fontSize: 11, fontWeight: 800, padding: "8px 16px", background: NAV, color: GOLD, border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>View →</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {meta && meta.last_page > 1 && (
                    <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: SERIF }}>Page {meta.current_page} of {meta.last_page}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[["← Prev", -1], ["Next →", 1]].map(([label, dir]) => {
                                const disabled = dir === -1 ? meta.current_page <= 1 : meta.current_page >= meta.last_page;
                                return <button key={label} onClick={() => setPage((p) => p + dir)} disabled={disabled} style={{ fontSize: 11, fontWeight: 700, padding: "9px 18px", background: disabled ? "#f1f5f9" : NAV, color: disabled ? "#cbd5e1" : GOLD, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" }}>{label}</button>;
                            })}
                        </div>
                    </div>
                )}
            </div>

            {selected && (
                <DetailModal
                    student={selected}
                    onClose={() => setSelected(null)}
                    onUpdated={handleUpdated}
                    addToast={addToast}
                />
            )}

            <Toast toasts={toasts} />
        </div>
    );
}