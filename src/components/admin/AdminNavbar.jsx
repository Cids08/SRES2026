import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV  = "#0a1f52";
const GOLD = "#f5c518";

const PAGE_TITLES = {
    "/admin":              "Dashboard",
    "/admin/enrollments":  "Enrollments",
    "/admin/announcements":"Announcements",
    "/admin/news":         "News",
    "/admin/gallery":      "Gallery",
    "/admin/staff":        "Staff",
    "/admin/settings":     "Settings",
};

export default function AdminNavbar({ onToggleSidebar }) {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [ddOpen, setDdOpen] = useState(false);

    const user     = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const initials = (user.name || "Admin").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const title    = PAGE_TITLES[location.pathname] || "Admin";

    function logout() {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
    }

    return (
        <header style={{
            background: NAV,
            borderBottom: `3px solid ${GOLD}`,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 52,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            {/* Left: hamburger + page title */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center" }}
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 3, height: 16, background: GOLD }} />
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
                        {title}
                    </span>
                </div>
            </div>

            {/* Right: visit site + user dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.13em", textTransform: "uppercase", color: `${GOLD}99`, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
                >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View Site
                </a>

                {/* User dropdown */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setDdOpen((o) => !o)}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                    >
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: NAV, flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div style={{ textAlign: "left", display: "none" /* hidden on mobile */ }}>
                            <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                                {user.name || "Administrator"}
                            </p>
                            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{user.role || "Admin"}</span>
                        </div>
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={2.5}>
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>

                    {ddOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 10px)", right: 0,
                            background: "#fff", border: `1.5px solid ${NAV}`,
                            minWidth: 180, zIndex: 200,
                        }}>
                            <div style={{ padding: "12px 14px", borderBottom: `1px solid #e4e0d4` }}>
                                <p style={{ fontSize: 13, fontWeight: 800, color: NAV, margin: "0 0 2px", fontFamily: "Georgia, serif" }}>
                                    {user.name || "Administrator"}
                                </p>
                                <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{user.email || ""}</p>
                            </div>
                            <button
                                onClick={() => { setDdOpen(false); navigate("/admin/settings"); }}
                                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: "transparent", border: "none", fontSize: 12, fontWeight: 700, color: NAV, cursor: "pointer", fontFamily: "Georgia, serif", textAlign: "left" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5c51820"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                                Settings
                            </button>
                            <div style={{ borderTop: "1px solid #e4e0d4" }}>
                                <button
                                    onClick={() => { setDdOpen(false); logout(); }}
                                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: "transparent", border: "none", fontSize: 12, fontWeight: 700, color: "#c0392b", cursor: "pointer", fontFamily: "Georgia, serif", textAlign: "left" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fef0f0"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                >
                                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                        <polyline points="16 17 21 12 16 7"/>
                                        <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}