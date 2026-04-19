import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const STORAGE = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function authHeader() {
    const t = localStorage.getItem("admin_token");
    return t ? { Authorization: "Bearer " + t } : {};
}

/* ── Icons ── */
const Icons = {
    dashboard:     <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    announcements: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    categories:    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    gallery:       <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    enrollments:   <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    students:      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    staff:         <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    messages:      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    settings:      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    viewSite:      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

const NAV_GROUPS = [
    { section: null, items: [{ to: "/admin", label: "Dashboard", icon: "dashboard", exact: true }] },
    { section: "Content", items: [
        { to: "/admin/announcements",           label: "Announcements & News", icon: "announcements" },
        { to: "/admin/announcement-categories", label: "Categories",           icon: "categories"    },
        { to: "/admin/gallery",                 label: "Gallery",              icon: "gallery"       },
    ]},
    { section: "School", items: [
        { to: "/admin/enrollments", label: "Enrollments", icon: "enrollments" },
        { to: "/admin/students",    label: "Students",    icon: "students"    },
        { to: "/admin/staff",       label: "Staff",       icon: "staff"       },
    ]},
    { section: "Inbox", items: [
        { to: "/admin/messages", label: "Contact Messages", icon: "messages", badge: "unread" },
    ]},
    { section: "System", items: [
        { to: "/admin/settings", label: "Settings", icon: "settings" },
    ]},
];

function NavItem({ to, label, icon, exact, collapsed, badgeCount }) {
    return (
        <NavLink to={to} end={exact} title={collapsed ? label : undefined}
            style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: collapsed ? "9px 0" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: isActive ? 800 : 500,
                color:      isActive ? NAV : "rgba(255,255,255,0.6)",
                background: isActive ? GOLD : "transparent",
                transition: "all 0.15s",
                marginBottom: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "left",
            })}
            onMouseEnter={e => {
                const isActive = e.currentTarget.style.background === GOLD || e.currentTarget.style.background === "rgb(245, 197, 24)";
                if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }
            }}
            onMouseLeave={e => {
                const isActive = e.currentTarget.style.background === GOLD || e.currentTarget.style.background === "rgb(245, 197, 24)";
                if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }
            }}
        >
            <span style={{ flexShrink: 0, display: "flex", opacity: 0.9, position: "relative" }}>
                {Icons[icon]}
                {collapsed && badgeCount > 0 && (
                    <span style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "1.5px solid " + NAV }}/>
                )}
            </span>
            {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
            {!collapsed && badgeCount > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 17, height: 17, padding: "0 4px", background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 900, borderRadius: 999, flexShrink: 0 }}>
                    {badgeCount > 99 ? "99+" : badgeCount}
                </span>
            )}
        </NavLink>
    );
}

function displayName(user) {
    if (user.name && user.name !== "Admin") return user.name;
    if (user.email) {
        const local = user.email.split("@")[0];
        return local.replace(/[0-9_]/g, " ").replace(/\./g, " ").split(" ").filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return "Administrator";
}

export default function AdminSidebar({ collapsed }) {
    const user     = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const name     = displayName(user);
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const photoUrl = user.profile_photo ? `${STORAGE}/${user.profile_photo}` : null;
    const W        = collapsed ? 60 : 228;

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = useCallback(async () => {
        try {
            const res  = await fetch(`${API_URL}/admin/contact-messages/counts`, { headers: authHeader() });
            if (!res.ok) return;
            const data = await res.json();
            setUnreadCount(data.unread ?? 0);
        } catch (_) {}
    }, []);

    useEffect(() => {
        fetchUnread();
        const id = setInterval(fetchUnread, 60_000);
        return () => clearInterval(id);
    }, [fetchUnread]);

    const badgeCounts = { unread: unreadCount };

    return (
        <aside style={{
            width: W,
            minWidth: W,
            background: NAV,
            height: "100vh",
            position: "sticky",
            top: 0,
            display: "flex",
            flexDirection: "column",
            transition: "width 0.22s ease",
            overflow: "hidden",
            flexShrink: 0,
            zIndex: 50,
        }}>

            {/* Branding */}
            <div style={{
                padding: collapsed ? "16px 0" : "18px 16px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 10,
                transition: "padding 0.22s",
            }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: GOLD, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: NAV, fontFamily: SERIF }}>SR</span>
                </div>
                {!collapsed && (
                    <div>
                        <p style={{ margin: 0, fontSize: 7, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>Admin Panel</p>
                        <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: SERIF, lineHeight: 1.2 }}>
                            SRES <span style={{ color: GOLD }}>Management</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav style={{
                flex: 1,
                padding: collapsed ? "10px 6px" : "12px 8px",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                display: "flex",
                flexDirection: "column",
                transition: "padding 0.22s",
            }}>
                <style>{`aside nav::-webkit-scrollbar { display: none; }`}</style>
                {NAV_GROUPS.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: 4 }}>
                        {group.section && !collapsed && (
                            <p style={{ margin: "8px 8px 4px", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                                {group.section}
                            </p>
                        )}
                        {group.section && collapsed && (
                            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "6px 4px" }}/>
                        )}
                        {group.items.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed}
                                badgeCount={item.badge ? (badgeCounts[item.badge] ?? 0) : 0}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div style={{
                padding: collapsed ? "10px 6px 14px" : "10px 8px 14px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                transition: "padding 0.22s",
            }}>
                {!collapsed && (
                    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", marginBottom: 2, background: "rgba(255,255,255,0.06)", borderRadius: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: GOLD, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {photoUrl
                                ? <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                : <span style={{ fontSize: 9, fontWeight: 900, color: NAV }}>{initials}</span>
                            }
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                            <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.38)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                        </div>
                    </div>
                )}
                <a href="/" target="_blank" rel="noopener noreferrer" title={collapsed ? "View Site" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "9px 0" : "8px 10px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.38)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; e.currentTarget.style.background = "transparent"; }}
                >
                    {Icons.viewSite}
                    {!collapsed && <span>View Site</span>}
                </a>
            </div>
        </aside>
    );
}