import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/* ─── Helpers ────────────────────────────────────────────── */
function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Stat card ──────────────────────────────────────────── */
function StatCard({ label, value, fill, icon }) {
    return (
        <div style={{ background: "#fff", border: `1.5px solid ${NAV}`, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV, opacity: 0.5, margin: 0 }}>
                    {label}
                </p>
                <div style={{ color: `${GOLD}` }}>{icon}</div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: NAV, margin: "0 0 10px", lineHeight: 1 }}>
                {value ?? "—"}
            </p>
            <div style={{ height: 3, background: "#e8e4da" }}>
                <div style={{ height: "100%", background: GOLD, width: `${fill}%`, transition: "width .6s" }} />
            </div>
        </div>
    );
}

/* ─── Panel wrapper ──────────────────────────────────────── */
function Panel({ title, action, actionLabel, children }) {
    return (
        <div style={{ background: "#fff", border: `1.5px solid ${NAV}`, overflow: "hidden" }}>
            <div style={{ background: NAV, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 14, background: GOLD }} />
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
                        {title}
                    </span>
                </div>
                {action && (
                    <button
                        onClick={action}
                        style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", background: GOLD, color: NAV, border: "none", cursor: "pointer" }}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
            <div style={{ padding: "12px 16px" }}>{children}</div>
        </div>
    );
}

/* ─── Status badge ───────────────────────────────────────── */
function Badge({ status }) {
    const map = {
        pending:  { bg: "#fff3cd", color: "#856404", border: "#ffc107", label: "Pending"  },
        approved: { bg: "#d4edda", color: "#155724", border: "#28a745", label: "Approved" },
        rejected: { bg: "#f8d7da", color: "#721c24", border: "#dc3545", label: "Rejected" },
    };
    const s = map[status?.toLowerCase()] || map.pending;
    return (
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {s.label}
        </span>
    );
}

/* ─── Quick action button ────────────────────────────────── */
function QuickBtn({ label, icon, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 0",
                background: "transparent", border: "none",
                borderBottom: "1px solid #f0ede4",
                fontSize: 12.5, fontWeight: 700,
                color: hov ? GOLD : NAV,
                cursor: "pointer", fontFamily: SERIF,
                textAlign: "left", transition: "color .15s",
            }}
        >
            <span style={{ color: GOLD, flexShrink: 0 }}>{icon}</span>
            {label}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
export default function Dashboard() {
    const navigate = useNavigate();
    const user     = JSON.parse(localStorage.getItem("admin_user") || "{}");

    const [stats,   setStats]   = useState(null);
    const [recent,  setRecent]  = useState([]);
    const [loading, setLoading] = useState(true);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    useEffect(() => {
        async function load() {
            try {
                const [sRes, eRes] = await Promise.all([
                    fetch(`${API_URL}/admin/stats`,       { headers: authHeader() }),
                    fetch(`${API_URL}/admin/enrollments?per_page=5`, { headers: authHeader() }),
                ]);
                if (sRes.ok) {
                    const s = await sRes.json();
                    setStats(s);
                }
                if (eRes.ok) {
                    const e = await eRes.json();
                    setRecent(Array.isArray(e) ? e.slice(0, 5) : (e.data || []).slice(0, 5));
                }
            } catch (_) {
                /* API not ready — show placeholder UI */
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    /* Placeholder stats if API not ready */
    const s = stats || { students: 167, enrollments: 24, pending: 8, faculty: 10 };

    const STATS = [
        { label: "Total Students",   value: s.students,    fill: 83,  icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
        { label: "Enrollments",      value: s.enrollments, fill: 48,  icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
        { label: "Pending Review",   value: s.pending,     fill: 33,  icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        { label: "Faculty",          value: s.faculty,     fill: 50,  icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ];

    const QUICK = [
        { label: "Review new enrollments",  path: "/admin/enrollments",   icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
        { label: "Post announcement",       path: "/admin/announcements", icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
        { label: "Add news article",        path: "/admin/news",          icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
        { label: "Upload gallery photos",   path: "/admin/gallery",       icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
        { label: "Manage staff records",    path: "/admin/staff",         icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ];

    return (
        <div>
            {/* Welcome */}
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 18, fontWeight: 800, color: NAV, fontFamily: SERIF, margin: "0 0 3px" }}>
                    {greeting}, {user.name?.split(" ")[0] || "Admin"}.
                </h1>
                <p style={{ fontSize: 13, color: "#5a5a5a", fontFamily: SERIF, margin: 0 }}>
                    Here's what's happening at San Roque Elementary School.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
                {STATS.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Two panels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>

                {/* Recent enrollments */}
                <Panel title="Recent Enrollments" actionLabel="View All" action={() => navigate("/admin/enrollments")}>
                    {loading && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[1,2,3].map((i) => (
                                <div key={i} style={{ height: 36, background: "#f0ede4", borderRadius: 0 }} />
                            ))}
                        </div>
                    )}
                    {!loading && recent.length === 0 && (
                        <p style={{ fontSize: 12, color: "#888", fontFamily: SERIF, textAlign: "center", padding: "16px 0" }}>
                            No enrollments yet.
                        </p>
                    )}
                    {!loading && recent.map((e, i) => (
                        <div key={e.id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ede4" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 800, color: NAV, fontFamily: SERIF, margin: "0 0 2px" }}>
                                    {[e.firstName, e.lastName].filter(Boolean).join(" ") || e.name || "—"}
                                </p>
                                <p style={{ fontSize: 10, color: "#888", margin: 0 }}>
                                    {e.gradeLevel || e.grade || "—"} · {formatDate(e.created_at)}
                                </p>
                            </div>
                            <Badge status={e.status || "pending"} />
                        </div>
                    ))}
                    {/* Placeholder rows if API returned nothing but not loading */}
                    {!loading && recent.length === 0 && (
                        <>
                            {[
                                { name: "Juan Dela Cruz",  grade: "Grade 3", status: "pending"  },
                                { name: "Maria Santos",    grade: "Kinder",  status: "approved" },
                                { name: "Pedro Reyes",     grade: "Grade 5", status: "pending"  },
                                { name: "Ana Lim",         grade: "Grade 1", status: "approved" },
                            ].map((r, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ede4" }}>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 800, color: NAV, fontFamily: SERIF, margin: "0 0 2px" }}>{r.name}</p>
                                        <p style={{ fontSize: 10, color: "#888", margin: 0 }}>{r.grade}</p>
                                    </div>
                                    <Badge status={r.status} />
                                </div>
                            ))}
                        </>
                    )}
                </Panel>

                {/* Quick actions */}
                <Panel title="Quick Actions">
                    {QUICK.map((q) => (
                        <QuickBtn key={q.label} label={q.label} icon={q.icon} onClick={() => navigate(q.path)} />
                    ))}
                    <div style={{ paddingTop: 2 }} />
                </Panel>
            </div>

            {/* Footer note */}
            <p style={{ fontSize: 11, color: "#0a1f5240", fontFamily: SERIF, textAlign: "center", marginTop: 32 }}>
                San Roque Elementary School · Admin Panel · {new Date().getFullYear()}
            </p>
        </div>
    );
}