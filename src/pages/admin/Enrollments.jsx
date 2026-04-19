import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}
function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
function getInitials(e) {
    return [e.first_name, e.last_name].filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}
function fullName(e) {
    return [e.first_name, e.middle_name, e.last_name].filter(Boolean).join(" ") || "—";
}

/* ── Toast ───────────────────────────────────────────────── */
function Toast({ toasts }) {
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
            {toasts.map(t => (
                <div key={t.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 20px", borderRadius: 12,
                    background: t.type === "approved" ? "#dcfce7" : t.type === "rejected" ? "#fee2e2" : "#f0f4ff",
                    border: `1.5px solid ${t.type === "approved" ? "#16a34a" : t.type === "rejected" ? "#dc2626" : NAV}`,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    minWidth: 260, maxWidth: 340,
                    animation: "slideIn .25s ease",
                    pointerEvents: "auto",
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: t.type === "approved" ? "#16a34a" : t.type === "rejected" ? "#dc2626" : NAV,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        {t.type === "approved"
                            ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            : t.type === "rejected"
                            ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        }
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: t.type === "approved" ? "#14532d" : t.type === "rejected" ? "#7f1d1d" : NAV, fontFamily: SERIF }}>
                            {t.title}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#64748b", fontFamily: SERIF }}>{t.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Status config ───────────────────────────────────────── */
const STATUS_CFG = {
    pending:  { bg: "#fffbea", color: "#92400e", border: "#d97706", dot: "#d97706", label: "Pending"  },
    approved: { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Approved" },
    rejected: { bg: "#fee2e2", color: "#7f1d1d", border: "#dc2626", dot: "#dc2626", label: "Rejected" },
};

function Badge({ status }) {
    const cfg = STATUS_CFG[status?.toLowerCase()] || STATUS_CFG.pending;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 12px", background: cfg.bg, color: cfg.color, border: "1.5px solid " + cfg.border, borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

/* ── Info row ────────────────────────────────────────────── */
function InfoRow({ label, value }) {
    return (
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #f1f5f9" }}>
            <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>{label}</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: value ? "#0f172a" : "#cbd5e1", fontFamily: SERIF, lineHeight: 1.45, wordBreak: "break-word" }}>{value || "—"}</p>
        </div>
    );
}

/* ── Confirm Modal ───────────────────────────────────────── */
function ConfirmModal({ action, studentName, onConfirm, onCancel }) {
    const isApprove = action === "approved";
    const isReject  = action === "rejected";

    const cfg = isApprove
        ? {
            color: "#16a34a", bg: "#dcfce7",
            title: "Approve this enrollment?",
            body: "Once approved, this action cannot be undone. The enrollment will be permanently locked as Approved.",
            cta: "Yes, approve",
            icon: <polyline points="20 6 9 17 4 12" />,
          }
        : isReject
        ? {
            color: "#dc2626", bg: "#fee2e2",
            title: "Reject this enrollment?",
            body: "The enrollment will be marked as Rejected. You can reset it back to Pending later if needed.",
            cta: "Yes, reject",
            icon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
          }
        : {
            color: "#d97706", bg: "#fffbea",
            title: "Reset to Pending?",
            body: "The enrollment status will be reset to Pending for further review.",
            cta: "Yes, reset",
            icon: <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></>,
          };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(10,31,82,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onCancel}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 28px 24px", maxWidth: 400, width: "100%", boxShadow: "0 24px 70px rgba(0,0,0,0.22)" }} onClick={e => e.stopPropagation()}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        {cfg.icon}
                    </svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#0f172a", fontFamily: SERIF }}>{cfg.title}</h3>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{cfg.body}</p>
                <p style={{ margin: "0 0 24px", fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: SERIF }}>
                    Student: <span style={{ color: cfg.color }}>{studentName}</span>
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onCancel}
                        style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#334155"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: cfg.color, color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: SERIF }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                        {cfg.cta}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Detail Modal ────────────────────────────────────────── */
function DetailModal({ enrollment, onClose, onStatusChange }) {
    const [loading,   setLoading]   = useState(false);
    const [curStatus, setCurStatus] = useState(enrollment.status || "pending");
    const [confirm,   setConfirm]   = useState(null);

    const name = fullName(enrollment);

    function requestStatus(newStatus) {
        if (newStatus === curStatus || loading) return;
        setConfirm(newStatus);
    }

    async function commitStatus() {
        if (!confirm || loading) return;
        const newStatus = confirm;
        setConfirm(null);
        setLoading(true);
        try {
            const res = await fetch(API_URL + "/admin/enrollments/" + enrollment.id + "/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setCurStatus(newStatus);
                onStatusChange(enrollment.id, newStatus, name);
            }
        } catch (_) {}
        finally { setLoading(false); }
    }

    const isApproved = curStatus === "approved";
    const isRejected = curStatus === "rejected";

    const sections = [
        {
            title: "Enrollment Details",
            rows: [
                { label: "Student Type", value: enrollment.student_type },
                { label: "Grade Level",  value: enrollment.grade_level  },
                { label: "Submitted",    value: formatDate(enrollment.created_at) },
            ],
        },
        {
            title: "Student Information",
            rows: [
                { label: "Full Name",       value: name },
                { label: "Date of Birth",   value: formatDate(enrollment.date_of_birth) },
                { label: "Gender",          value: enrollment.gender },
                { label: "Previous School", value: enrollment.previous_school },
                { label: "Special Needs",   value: enrollment.special_needs },
                { label: "Facebook",        value: enrollment.facebook_link },
            ],
        },
        {
            title: "Parent / Guardian",
            rows: [
                { label: "Full Name",    value: enrollment.parent_name  },
                { label: "Relationship", value: enrollment.relationship  },
                { label: "Mobile",       value: enrollment.mobile_number },
                { label: "Email",        value: enrollment.email         },
                { label: "Address",      value: enrollment.address, wide: true },
            ],
        },
        {
            title: "Emergency Contact",
            rows: [
                { label: "Full Name",    value: enrollment.emergency_name         },
                { label: "Relationship", value: enrollment.emergency_relationship },
                { label: "Phone",        value: enrollment.emergency_phone        },
            ],
        },
    ];

    return (
        <>
            <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
                <div style={{ width: "100%", maxWidth: 620, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={e => e.stopPropagation()}>

                    {/* Banner */}
                    <div style={{ background: NAV, padding: "24px 24px 80px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>Enrollment #{enrollment.id}</span>
                            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>
                    </div>

                    {/* Profile card */}
                    <div style={{ margin: "-52px 20px 0", background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: NAV, border: "3px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: 26, fontWeight: 900, color: GOLD, fontFamily: SERIF }}>{getInitials(enrollment)}</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{enrollment.grade_level || "—"}</p>
                                <h2 style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 800, color: "#0f172a", fontFamily: SERIF, lineHeight: 1.2 }}>{name}</h2>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Current status:</span>
                                    <Badge status={curStatus} />
                                </div>
                            </div>
                        </div>

                        {/* Action area */}
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                            <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>Update Enrollment Status</p>

                            {isApproved ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#dcfce7", border: "1.5px solid #16a34a", borderRadius: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#14532d", fontFamily: SERIF }}>Enrollment Approved — Status is Final</p>
                                        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#166534" }}>This enrollment has been accepted and cannot be changed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                    <button
                                        onClick={() => requestStatus("approved")}
                                        disabled={loading}
                                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 800, fontFamily: SERIF, cursor: loading ? "not-allowed" : "pointer", background: "#f0fdf4", color: "#16a34a", outline: "2px solid #86efac", opacity: loading ? 0.5 : 1, transition: "all .18s" }}
                                        onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; } }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; }}>
                                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        {loading ? "Saving…" : "Accept Enrollment"}
                                    </button>

                                    <button
                                        onClick={() => requestStatus("rejected")}
                                        disabled={loading || isRejected}
                                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 800, fontFamily: SERIF, cursor: loading || isRejected ? "not-allowed" : "pointer", background: isRejected ? "#dc2626" : "#fef2f2", color: isRejected ? "#fff" : "#dc2626", outline: isRejected ? "none" : "2px solid #fecaca", opacity: loading && !isRejected ? 0.5 : 1, transition: "all .18s" }}
                                        onMouseEnter={e => { if (!isRejected && !loading) { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; } }}
                                        onMouseLeave={e => { if (!isRejected) { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; } }}>
                                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        {isRejected ? "Rejected ✓" : loading ? "Saving…" : "Reject Enrollment"}
                                    </button>

                                    {isRejected && (
                                        <button
                                            onClick={() => requestStatus("pending")}
                                            disabled={loading}
                                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 11, fontWeight: 700, fontFamily: SERIF, cursor: loading ? "not-allowed" : "pointer", background: "#f8fafc", color: "#94a3b8", transition: "all .15s" }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#475569"; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}>
                                            ↺ Reset to Pending
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info sections */}
                    <div style={{ padding: "20px 22px 8px", display: "flex", flexDirection: "column", gap: 20 }}>
                        {sections.map(sec => (
                            <div key={sec.title}>
                                <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>{sec.title}</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {sec.rows.filter(r => r.value).map((row, i) => (
                                        <div key={i} style={{ gridColumn: row.wide ? "1 / -1" : "auto" }}>
                                            <InfoRow label={row.label} value={row.value} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Documents */}
                        <div>
                            <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>Documents</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <InfoRow label="2×2 ID Pictures" value={enrollment.has_id_pictures ? "Will bring" : null} />
                            </div>
                            {enrollment.documents && enrollment.documents.length > 0 ? (
                                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                                    {enrollment.documents.map(doc => (
                                        <div key={doc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: NAV, fontFamily: SERIF }}>{doc.document_type}</p>
                                                <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{doc.file_name} · {Math.round(doc.file_size / 1024)} KB</p>
                                            </div>
                                            <a href={API_URL.replace("/api", "") + "/storage/" + doc.file_path} target="_blank" rel="noopener noreferrer"
                                                style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", background: NAV, color: GOLD, textDecoration: "none", borderRadius: 8 }}>
                                                View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: 12, color: "#94a3b8", fontFamily: SERIF, margin: "8px 0 0" }}>No documents uploaded.</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "16px 22px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                        <span style={{ fontSize: 11, color: "#cbd5e1" }}>Submitted {formatDate(enrollment.created_at)}</span>
                        <button onClick={onClose}
                            style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 30px", background: NAV, color: GOLD, border: "none", borderRadius: 10, cursor: "pointer" }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmModal
                    action={confirm}
                    studentName={name}
                    onConfirm={commitStatus}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
   ENROLLMENTS PAGE
══════════════════════════════════════════════════════════ */
export default function Enrollments() {
    const navigate = useNavigate();

    const [enrollments,  setEnrollments] = useState([]);
    const [loading,      setLoading]     = useState(true);
    const [selected,     setSelected]    = useState(null);
    const [search,       setSearch]      = useState("");
    const [statusFilter, setStatus]      = useState("");
    const [gradeFilter,  setGrade]       = useState("");
    const [page,         setPage]        = useState(1);
    const [meta,         setMeta]        = useState(null);
    const [toasts,       setToasts]      = useState([]);

    const GRADES = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];

    function showToast(type, title, message) {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 15 });
            if (search)       params.set("search",      search);
            if (statusFilter) params.set("status",      statusFilter);
            if (gradeFilter)  params.set("grade_level", gradeFilter);

            const res = await fetch(API_URL + "/admin/enrollments?" + params, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) { setEnrollments(data); setMeta(null); }
                else { setEnrollments(data.data || []); setMeta(data); }
            }
        } catch (_) {}
        finally { setLoading(false); }
    }, [page, search, statusFilter, gradeFilter, navigate]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => { setPage(1); }, [search, statusFilter, gradeFilter]);

    function handleStatusChange(id, newStatus, studentName) {
        setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));

        if (newStatus === "approved") {
            showToast("approved", "Enrollment Accepted", `${studentName}'s enrollment has been approved.`);
        } else if (newStatus === "rejected") {
            showToast("rejected", "Enrollment Rejected", `${studentName}'s enrollment has been rejected.`);
        } else {
            showToast("info", "Status Updated", `${studentName}'s enrollment reset to pending.`);
        }
    }

    async function openDetail(enrollment) {
        try {
            const res = await fetch(API_URL + "/admin/enrollments/" + enrollment.id, { headers: authHeader() });
            setSelected(res.ok ? await res.json() : enrollment);
        } catch (_) { setSelected(enrollment); }
    }

    const counts = {
        total:    meta?.total ?? enrollments.length,
        pending:  enrollments.filter(e => e.status === "pending").length,
        approved: enrollments.filter(e => e.status === "approved").length,
        rejected: enrollments.filter(e => e.status === "rejected").length,
    };

    const statCards = [
        { label: "Total",    value: counts.total,    bg: "#f0f4ff", color: NAV,       border: NAV + "20",  filterVal: ""         },
        { label: "Pending",  value: counts.pending,  bg: "#fffbea", color: "#92400e", border: "#d9770640", filterVal: "pending"  },
        { label: "Approved", value: counts.approved, bg: "#dcfce7", color: "#14532d", border: "#16a34a40", filterVal: "approved" },
        { label: "Rejected", value: counts.rejected, bg: "#fee2e2", color: "#7f1d1d", border: "#dc262640", filterVal: "rejected" },
    ];

    return (
        <>
            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
            <Toast toasts={toasts} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Header */}
                <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                        <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Enrollment Management</h1>
                    </div>
                    <button onClick={load} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>↻ Refresh</button>
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                    {statCards.map(card => {
                        const isSelected = statusFilter === card.filterVal;
                        return (
                            <div
                                key={card.label}
                                onClick={() => { setStatus(card.filterVal); setPage(1); }}
                                style={{
                                    background: card.bg, borderRadius: 12, padding: "16px 18px",
                                    border: "2px solid " + (isSelected ? card.color : card.border),
                                    cursor: "pointer", transition: "all .18s", position: "relative",
                                    boxShadow: isSelected ? "0 4px 16px " + card.color + "30" : "none",
                                    transform: isSelected ? "translateY(-2px)" : "none",
                                }}
                                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = "0 2px 8px " + card.color + "20"; } }}
                                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = card.border; e.currentTarget.style.boxShadow = "none"; } }}
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

                {/* Filters */}
                <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
                        style={{ flex: "1 1 180px", fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", minWidth: 150 }} />
                    <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
                        style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select value={gradeFilter} onChange={e => { setGrade(e.target.value); setPage(1); }}
                        style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                        <option value="">All Grades</option>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {(search || statusFilter || gradeFilter) && (
                        <button onClick={() => { setSearch(""); setStatus(""); setGrade(""); setPage(1); }}
                            style={{ fontSize: 11, fontWeight: 700, padding: "9px 14px", background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", borderRadius: 8, cursor: "pointer" }}>
                            Clear ×
                        </button>
                    )}
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                            <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Enrollment Records</span>
                        </div>
                        {meta && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{meta.from}–{meta.to} of {meta.total}</span>}
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: 68 }} /><col />
                            <col style={{ width: 120 }} /><col style={{ width: 120 }} />
                            <col style={{ width: 110 }} /><col style={{ width: 130 }} />
                            <col style={{ width: 100 }} />
                        </colgroup>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                <th style={{ padding: "12px 16px" }}></th>
                                {["Student", "Grade", "Type", "Submitted", "Status", ""].map(h => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: h === "" ? "right" : "left", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "14px 16px" }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f1f5f9" }} /></td>
                                    {[180, 90, 90, 80, 90, 60].map((w, j) => (
                                        <td key={j} style={{ padding: "14px 16px" }}>
                                            <div style={{ height: 13, width: w, background: "#f1f5f9", borderRadius: 6 }} />
                                            {j === 0 && <div style={{ height: 10, width: 80, background: "#f1f5f9", borderRadius: 4, marginTop: 6 }} />}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {!loading && enrollments.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: "60px 20px", textAlign: "center" }}>
                                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 56, height: 56, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontFamily: SERIF }}>No enrollments found.</p>
                                    </div>
                                </td></tr>
                            )}

                            {!loading && enrollments.map(e => {
                                const name = [e.first_name, e.last_name].filter(Boolean).join(" ") || "—";
                                return (
                                    <tr key={e.id} onClick={() => openDetail(e)}
                                        style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background .1s" }}
                                        onMouseEnter={ev => { ev.currentTarget.style.background = "#f0f4ff"; }}
                                        onMouseLeave={ev => { ev.currentTarget.style.background = "transparent"; }}>
                                        <td style={{ padding: "12px 16px" }}>
                                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: NAV, border: "2.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <span style={{ fontSize: 14, fontWeight: 900, color: GOLD, fontFamily: SERIF }}>{getInitials(e)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <p style={{ margin: 0, fontWeight: 800, color: NAV, fontFamily: SERIF, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                                            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#94a3b8" }}>{e.gender || "—"} · {e.email || "—"}</p>
                                        </td>
                                        <td style={{ padding: "12px 16px", color: "#475569", fontFamily: SERIF, fontSize: 13 }}>{e.grade_level || "—"}</td>
                                        <td style={{ padding: "12px 16px", color: "#475569", fontFamily: SERIF, fontSize: 13, textTransform: "capitalize" }}>{e.student_type || "—"}</td>
                                        <td style={{ padding: "12px 16px", color: "#94a3b8", fontFamily: SERIF, fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(e.created_at)}</td>
                                        <td style={{ padding: "12px 16px" }}><Badge status={e.status} /></td>
                                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                            <button onClick={ev => { ev.stopPropagation(); openDetail(e); }}
                                                style={{ fontSize: 11, fontWeight: 800, padding: "8px 16px", background: NAV, color: GOLD, border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}
                                                onMouseEnter={ev => { ev.currentTarget.style.opacity = "0.85"; }}
                                                onMouseLeave={ev => { ev.currentTarget.style.opacity = "1"; }}>
                                                View →
                                            </button>
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
                                    return (
                                        <button key={label} onClick={() => setPage(p => p + dir)} disabled={disabled}
                                            style={{ fontSize: 11, fontWeight: 700, padding: "9px 18px", background: disabled ? "#f1f5f9" : NAV, color: disabled ? "#cbd5e1" : GOLD, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" }}>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selected && (
                <DetailModal
                    enrollment={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </>
    );
}