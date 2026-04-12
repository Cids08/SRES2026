import { NavLink, useNavigate } from "react-router-dom";

const NAV  = "#0a1f52";
const GOLD = "#f5c518";

const MENU = [
    {
        label: "Main",
        items: [
            {
                to: "/admin",
                label: "Dashboard",
                end: true,
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                ),
            },
        ],
    },
    {
        label: "Manage",
        items: [
            {
                to: "/admin/enrollments",
                label: "Enrollments",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                ),
            },
            {
                to: "/admin/announcements",
                label: "Announcements",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
                    </svg>
                ),
            },
            {
                to: "/admin/news",
                label: "News",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                ),
            },
            {
                to: "/admin/gallery",
                label: "Gallery",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                ),
            },
            {
                to: "/admin/staff",
                label: "Staff",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                ),
            },
        ],
    },
    {
        label: "Settings",
        items: [
            {
                to: "/admin/settings",
                label: "Settings",
                icon: (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                ),
            },
        ],
    },
];

export default function AdminSidebar({ collapsed = false }) {
    const navigate   = useNavigate();
    const user       = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const initials   = (user.name || "Admin").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    function logout() {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
    }

    return (
        <aside style={{
            width: collapsed ? 56 : 210,
            flexShrink: 0,
            background: "#071640",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            transition: "width .25s",
            overflow: "hidden",
        }}>
            {/* Brand */}
            <div style={{ padding: "14px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${GOLD}`, background: NAV, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <img src="/images/logo.png" alt="SRES" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                </div>
                {!collapsed && (
                    <div style={{ minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>SRES</p>
                        <span style={{ color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Admin Panel</span>
                    </div>
                )}
            </div>

            {/* Admin info */}
            {!collapsed && (
                <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 900, color: NAV }}>
                        {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.name || "Administrator"}
                        </p>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{user.role || "Admin"}</span>
                    </div>
                </div>
            )}

            {/* Menu */}
            <nav style={{ flex: 1, paddingTop: 8, overflowY: "auto" }}>
                {MENU.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}80`, padding: "12px 14px 5px", margin: 0 }}>
                                {group.label}
                            </p>
                        )}
                        {group.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                style={({ isActive }) => ({
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 9,
                                    padding: collapsed ? "10px 0" : "9px 14px",
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    color: isActive ? GOLD : "rgba(255,255,255,0.5)",
                                    background: isActive ? `${GOLD}12` : "transparent",
                                    borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                                    transition: "all .15s",
                                })}
                            >
                                {item.icon}
                                {!collapsed && item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Logout */}
            <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
                <button
                    onClick={logout}
                    style={{
                        width: "100%", padding: collapsed ? "8px 0" : "8px 12px",
                        background: "rgba(192,57,43,0.15)",
                        border: "1.5px solid rgba(192,57,43,0.35)",
                        color: "#e74c3c",
                        fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                        textTransform: "uppercase", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        transition: "background .15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(192,57,43,0.28)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(192,57,43,0.15)"; }}
                >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {!collapsed && "Sign Out"}
                </button>
            </div>
        </aside>
    );
}