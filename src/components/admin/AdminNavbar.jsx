import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const STORAGE = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}

function displayName(user) {
    if (user.name && user.name !== "Admin") return user.name;
    if (user.email) {
        const local = user.email.split("@")[0];
        return local.replace(/[0-9_]/g, " ").replace(/\./g, " ")
            .split(" ").filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
    return "Administrator";
}

function getInitials(name) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const PAGE_TITLES = {
    "/admin":                         "Dashboard",
    "/admin/students":                "Students",
    "/admin/enrollments":             "Enrollments",
    "/admin/announcements":           "Announcements & News",
    "/admin/announcement-categories": "Categories",
    "/admin/gallery":                 "Gallery",
    "/admin/staff":                   "Staff",
    "/admin/messages":                "Contact Messages",
    "/admin/settings":                "Settings",
};

export default function AdminNavbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const fileRef  = useRef();

    const [ddOpen,    setDdOpen]    = useState(false);
    const [uploading, setUploading] = useState(false);

    const user     = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const name     = displayName(user);
    const initials = getInitials(name);
    const title    = PAGE_TITLES[location.pathname] || "Admin";
    const photoUrl = user.profile_photo ? `${STORAGE}/${user.profile_photo}` : null;

    function handleBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDdOpen(false);
        }
    }

    async function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append("profile_photo", file);
            // Do NOT pass Content-Type — browser sets multipart boundary automatically
            const token = localStorage.getItem("admin_token");
            const headers = token ? { Authorization: "Bearer " + token } : {};
            const res  = await fetch(`${API_URL}/admin/profile`, { method: "POST", headers, body: form });
            const data = await res.json();
            if (res.ok) {
                const current = JSON.parse(localStorage.getItem("admin_user") || "{}");
                localStorage.setItem("admin_user", JSON.stringify({ ...current, ...data.user }));
                window.location.reload();
            }
        } catch (_) {}
        setUploading(false);
    }

    function logout() {
        try { fetch(`${API_URL}/admin/logout`, { method: "POST", headers: authHeader() }); } catch (_) {}
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
    }

    return (
        <header style={{
            background: NAV,
            borderBottom: `2px solid ${GOLD}30`,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 54,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>

            {/* Left: hamburger + page title */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    onClick={onToggleSidebar}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", borderRadius: 6, transition: "color .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="3" y1="6"  x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Gold accent line */}
                <div style={{ width: 2, height: 18, background: `${GOLD}50`, borderRadius: 2 }} />

                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: SERIF, letterSpacing: "0.02em" }}>{title}</span>
            </div>

            {/* Right: user dropdown */}
            <div style={{ position: "relative" }} onBlur={handleBlur}>
                <button
                    onClick={() => setDdOpen(o => !o)}
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "rgba(255,255,255,0.08)",
                        border: `1.5px solid rgba(255,255,255,0.15)`,
                        borderRadius: 8, cursor: "pointer",
                        padding: "5px 10px 5px 5px",
                        transition: "all .15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = `${GOLD}60`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                >
                    {/* Avatar */}
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: GOLD, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${GOLD}` }}>
                        {photoUrl
                            ? <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 10, fontWeight: 900, color: NAV }}>{initials}</span>
                        }
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{name}</span>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2.5}
                        style={{ transform: ddOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>

                {ddOpen && (
                    <div style={{
                        position: "absolute", top: "calc(100% + 8px)", right: 0,
                        background: "#fff",
                        border: `1.5px solid #e2e8f0`,
                        minWidth: 220, zIndex: 200,
                        boxShadow: "0 8px 32px rgba(10,31,82,0.18)",
                        borderRadius: 12, overflow: "hidden",
                    }}>
                        {/* Profile header */}
                        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", background: NAV, display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: GOLD, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${GOLD}` }}>
                                    {photoUrl
                                        ? <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        : <span style={{ fontSize: 13, fontWeight: 900, color: NAV }}>{initials}</span>
                                    }
                                </div>
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: GOLD, border: `1.5px solid ${NAV}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                                    title="Change photo"
                                >
                                    {uploading
                                        ? <span style={{ fontSize: 6, color: NAV }}>…</span>
                                        : <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke={NAV} strokeWidth={2.5}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                    }
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: SERIF }}>{name}</p>
                                <p style={{ margin: 0, fontSize: 10, color: `${GOLD}99`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email || ""}</p>
                            </div>
                        </div>

                        {/* Go to Settings */}
                        <button
                            onClick={() => { setDdOpen(false); navigate("/admin/settings"); }}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: "transparent", border: "none", borderBottom: "1px solid #f1f5f9", fontSize: 12, fontWeight: 600, color: "#334155", cursor: "pointer", textAlign: "left" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                            Account Settings
                        </button>

                        {/* Sign out */}
                        <button
                            onClick={() => { setDdOpen(false); logout(); }}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", background: "transparent", border: "none", fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer", textAlign: "left" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}