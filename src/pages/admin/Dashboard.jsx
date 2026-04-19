import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV          = "#0a1f52";
const GOLD         = "#f5c518";
const SERIF        = "Georgia, serif";
const MSG_PER_PAGE = 5;
const API_URL      = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}
function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Status badge ────────────────────────────────────────── */
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

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, sub, icon, bg, color, border, accent, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <div onClick={onClick} onMouseEnter={() => onClick && setHov(true)} onMouseLeave={() => onClick && setHov(false)}
            style={{ background: hov ? NAV : (bg || "#fff"), border: "1.5px solid " + (hov ? GOLD : (border || NAV + "20")), borderRadius: 14, overflow: "hidden", cursor: onClick ? "pointer" : "default", transition: "all .18s", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 3, background: hov ? GOLD : (accent || GOLD) }} />
            <div style={{ padding: "18px 20px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: hov ? GOLD : (color || NAV), opacity: hov ? 0.75 : 0.5, margin: 0, transition: "all .18s" }}>{label}</p>
                    <div style={{ width: 34, height: 34, background: hov ? GOLD + "25" : GOLD + "18", border: "1px solid " + (hov ? GOLD + "80" : GOLD + "40"), borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, flexShrink: 0 }}>{icon}</div>
                </div>
                <p style={{ fontSize: 34, fontWeight: 900, color: hov ? "#fff" : (color || NAV), margin: "0 0 6px", lineHeight: 1, fontFamily: SERIF, transition: "color .18s" }}>{value ?? <span style={{ opacity: 0.25 }}>—</span>}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {sub && <p style={{ fontSize: 11, color: hov ? "rgba(255,255,255,0.5)" : "#94a3b8", margin: 0, fontFamily: SERIF, transition: "color .18s" }}>{sub}</p>}
                    {onClick && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: hov ? GOLD : NAV + "50", transition: "color .18s", marginLeft: "auto" }}>View →</span>}
                </div>
            </div>
        </div>
    );
}

/* ── Panel ───────────────────────────────────────────────── */
function Panel({ title, actionLabel, onAction, children }) {
    return (
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>{title}</span>
                </div>
                {onAction && (
                    <button onClick={onAction} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 14px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                        {actionLabel}
                    </button>
                )}
            </div>
            <div style={{ padding: "14px 18px" }}>{children}</div>
        </div>
    );
}

/* ── Quick action button ─────────────────────────────────── */
function QuickBtn({ label, desc, icon, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: hov ? "#f0f4ff" : "transparent", border: "none", borderRadius: 10, borderLeft: hov ? "3px solid " + GOLD : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "all .14s", marginBottom: 2 }}>
            <div style={{ width: 34, height: 34, flexShrink: 0, background: hov ? GOLD : GOLD + "18", border: "1px solid " + GOLD + "40", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: hov ? NAV : GOLD, transition: "all .14s" }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: NAV, margin: "0 0 1px", fontFamily: SERIF }}>{label}</p>
                {desc && <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{desc}</p>}
            </div>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={hov ? GOLD : "#cbd5e1"} strokeWidth={2.5} style={{ flexShrink: 0, transition: "stroke .14s" }}><polyline points="9 18 15 12 9 6"/></svg>
        </button>
    );
}

/* ── Recent enrollment row ───────────────────────────────── */
function EnrollRow({ e }) {
    const name     = [e.first_name, e.last_name].filter(Boolean).join(" ") || "—";
    const initials = [e.first_name, e.last_name].filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: NAV, border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, fontFamily: SERIF }}>{initials}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: NAV, fontFamily: SERIF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94a3b8" }}>{e.grade_level || "—"} · {formatDate(e.created_at)}</p>
                </div>
            </div>
            <Badge status={e.status || "pending"} />
        </div>
    );
}

/* ── Recent message row ──────────────────────────────────── */
function MsgRow({ m }) {
    return (
        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "10px 12px 10px 0", fontSize: 13, fontWeight: 800, color: NAV, fontFamily: SERIF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                {m.name}
            </td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>
                {m.subject}
            </td>
            <td style={{ padding: "10px 0 10px 12px", fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", textAlign: "right" }}>
                {formatDate(m.created_at)}
            </td>
        </tr>
    );
}

/* ── Skeleton loader ─────────────────────────────────────── */
function Skeleton({ rows = 4, avatar = false }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
                    {avatar && <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#f1f5f9", flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                        <div style={{ height: 12, background: "#f1f5f9", borderRadius: 6, width: "70%", marginBottom: 6 }} />
                        <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "45%" }} />
                    </div>
                </div>
            ))}
        </div>
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
    const [msgs,    setMsgs]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [msgPage, setMsgPage] = useState(1);   // ← moved inside component

    const hour     = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const today    = new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    useEffect(() => {
        async function load() {
            try {
                const [sRes, eRes, mRes] = await Promise.all([
                    fetch(API_URL + "/admin/stats",                        { headers: authHeader() }),
                    fetch(API_URL + "/admin/enrollments?per_page=5",       { headers: authHeader() }),  // ← fixed
                    fetch(API_URL + "/admin/contact-messages?per_page=50", { headers: authHeader() }),  // ← fixed + loads more for pagination
                ]);
                if (sRes.ok) setStats(await sRes.json());
                if (eRes.ok) { const d = await eRes.json(); setRecent(Array.isArray(d) ? d.slice(0, 5) : (d.data || []).slice(0, 5)); }
                if (mRes.ok) { const d = await mRes.json(); setMsgs(Array.isArray(d)   ? d              : (d.data || [])); }
            } catch (_) {}
            finally { setLoading(false); }
        }
        load();
    }, []);

    const s = stats || { students: 0, enrollments: 0, pending: 0, approved: 0, rejected: 0, faculty: 0, messages: 0 };

    const STAT_CARDS = [
        {
            label: "Total Students", value: s.students, sub: "Currently enrolled", accent: GOLD,
            icon: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            onClick: () => navigate("/admin/students"),
        },
        {
            label: "Enrollments", value: s.enrollments, sub: "Total submissions", accent: "#16a34a",
            icon: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
            onClick: () => navigate("/admin/enrollments"),
        },
        {
            label: "Pending Review", value: s.pending, sub: "Awaiting action", accent: "#d97706",
            icon: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            onClick: () => navigate("/admin/enrollments"),
        },
        {
            label: "Faculty", value: s.faculty, sub: "Active teachers", accent: "#1560bd",
            icon: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            onClick: () => navigate("/admin/staff"),
        },
    ];

    const QUICK_ACTIONS = [
        { label: "Review Enrollments", desc: "Check pending applications", path: "/admin/enrollments",   icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
        { label: "Post Announcement",  desc: "Publish school notices",     path: "/admin/announcements", icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
        { label: "Upload Gallery",     desc: "Add photos to an album",     path: "/admin/gallery",       icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
        { label: "Manage Teachers",    desc: "Update faculty records",     path: "/admin/staff",         icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    ];

    /* ── Pagination helpers ── */
    const totalPages = Math.ceil(msgs.length / MSG_PER_PAGE);
    const paginated  = msgs.slice((msgPage - 1) * MSG_PER_PAGE, msgPage * MSG_PER_PAGE);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* ── Welcome banner ── */}
            <div style={{ background: NAV, borderRadius: 16, padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -24, top: -24, width: 140, height: 140, borderRadius: "50%", background: GOLD + "10", pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 80, bottom: -36, width: 90, height: 90, borderRadius: "50%", background: GOLD + "08", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD + "80" }}>San Roque Elementary School</p>
                    <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF, lineHeight: 1.2 }}>
                        {greeting}, {user.name?.split(" ")[0] || "Admin"}.
                    </h1>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: SERIF }}>{today}</p>
                </div>
                {s.pending > 0 && (
                    <button onClick={() => navigate("/admin/enrollments")}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", background: GOLD, color: NAV, border: "none", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", position: "relative", zIndex: 1 }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {s.pending} Pending {s.pending === 1 ? "Enrollment" : "Enrollments"}
                    </button>
                )}
            </div>

            {/* ── Stat cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {STAT_CARDS.map(card => <StatCard key={card.label} {...card} />)}
            </div>

            {/* ── Enrollment status bar ── */}
            {stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    {[
                        { label: "Approved", value: s.approved, ...STATUS_CFG.approved },
                        { label: "Pending",  value: s.pending,  ...STATUS_CFG.pending  },
                        { label: "Rejected", value: s.rejected, ...STATUS_CFG.rejected },
                    ].map((item, i) => (
                        <div key={item.label} onClick={() => navigate("/admin/enrollments")}
                            style={{ padding: "18px 20px", textAlign: "center", background: item.bg, borderLeft: i > 0 ? "1px solid " + item.border + "30" : "none", cursor: "pointer", transition: "filter .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.96)"; }}
                            onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}>
                            <p style={{ fontSize: 28, fontWeight: 900, color: item.color, margin: "0 0 4px", fontFamily: SERIF }}>{item.value ?? 0}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: item.color, margin: 0, opacity: 0.8 }}>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Two column ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>

                {/* Recent enrollments */}
                <Panel title="Recent Enrollments" actionLabel="View All" onAction={() => navigate("/admin/enrollments")}>
                    {loading ? <Skeleton rows={4} avatar /> : recent.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "24px 0" }}>
                            <div style={{ width: 44, height: 44, background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontFamily: SERIF }}>No enrollments yet.</p>
                        </div>
                    ) : recent.map(e => <EnrollRow key={e.id || Math.random()} e={e} />)}
                </Panel>

                {/* Quick actions */}
                <Panel title="Quick Actions">
                    {QUICK_ACTIONS.map(q => <QuickBtn key={q.label} {...q} onClick={() => navigate(q.path)} />)}
                </Panel>
            </div>

            {/* ── Recent messages ── */}
            <Panel title="Recent Messages" actionLabel="View All" onAction={() => navigate("/admin/messages")}>
                {loading ? <Skeleton rows={3} /> : msgs.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontFamily: SERIF, textAlign: "center", padding: "20px 0" }}>No messages yet.</p>
                ) : (
                    <>
                        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                            <colgroup>
                                <col style={{ width: "22%" }} />
                                <col style={{ width: "56%" }} />
                                <col style={{ width: "22%" }} />
                            </colgroup>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                    <th style={{ padding: "6px 12px 8px 0", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: NAV, opacity: 0.4, textAlign: "left" }}>Sender</th>
                                    <th style={{ padding: "6px 12px 8px",    fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: NAV, opacity: 0.4, textAlign: "left" }}>Subject</th>
                                    <th style={{ padding: "6px 0 8px 12px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: NAV, opacity: 0.4, textAlign: "right" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(m => <MsgRow key={m.id || Math.random()} m={m} />)}
                            </tbody>
                        </table>

                        {/* ── Pagination bar ── */}
                        {totalPages > 1 && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontFamily: SERIF }}>
                                    Showing {(msgPage - 1) * MSG_PER_PAGE + 1}–{Math.min(msgPage * MSG_PER_PAGE, msgs.length)} of {msgs.length}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

                                    {/* Prev */}
                                    <button onClick={() => setMsgPage(p => Math.max(1, p - 1))} disabled={msgPage === 1}
                                        style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1.5px solid " + (msgPage === 1 ? "#e2e8f0" : NAV + "30"), borderRadius: 8, cursor: msgPage === 1 ? "not-allowed" : "pointer", color: msgPage === 1 ? "#cbd5e1" : NAV, transition: "all .14s" }}
                                        onMouseEnter={e => { if (msgPage !== 1) e.currentTarget.style.background = GOLD + "20"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => setMsgPage(page)}
                                            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: msgPage === page ? NAV : "transparent", border: "1.5px solid " + (msgPage === page ? NAV : NAV + "20"), borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 800, color: msgPage === page ? GOLD : NAV, transition: "all .14s" }}
                                            onMouseEnter={e => { if (msgPage !== page) e.currentTarget.style.background = GOLD + "20"; }}
                                            onMouseLeave={e => { if (msgPage !== page) e.currentTarget.style.background = "transparent"; }}>
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button onClick={() => setMsgPage(p => Math.min(totalPages, p + 1))} disabled={msgPage === totalPages}
                                        style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1.5px solid " + (msgPage === totalPages ? "#e2e8f0" : NAV + "30"), borderRadius: 8, cursor: msgPage === totalPages ? "not-allowed" : "pointer", color: msgPage === totalPages ? "#cbd5e1" : NAV, transition: "all .14s" }}
                                        onMouseEnter={e => { if (msgPage !== totalPages) e.currentTarget.style.background = GOLD + "20"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="9 18 15 12 9 6"/></svg>
                                    </button>

                                </div>
                            </div>
                        )}
                    </>
                )}
            </Panel>

            {/* ── Footer ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ width: 20, height: 2, background: GOLD, borderRadius: 1 }} />
                <p style={{ fontSize: 11, color: "#0a1f5235", fontFamily: SERIF, margin: 0, letterSpacing: "0.08em" }}>
                    San Roque Elementary School · Admin Panel · {new Date().getFullYear()}
                </p>
                <div style={{ width: 20, height: 2, background: GOLD, borderRadius: 1 }} />
            </div>
        </div>
    );
}