import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV = "#0a1f52";
const GOLD = "#f5c518";
const SERIF = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const STORAGE = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/* icons */
const Icons = {
    dashboard: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    messages: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    settings: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/></svg>,
    viewSite: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

const NAV_GROUPS = [
    {
        section: null,
        items: [
            { to: "/admin", label: "Dashboard", icon: "dashboard", exact: true }
        ]
    },
    {
        section: "Inbox",
        items: [
            { to: "/admin/messages", label: "Contact Messages", icon: "messages", badge: "unread" }
        ]
    },
    {
        section: "System",
        items: [
            { to: "/admin/settings", label: "Settings", icon: "settings" }
        ]
    }
];

function displayName(user) {
    if (user.name && user.name !== "Admin") return user.name;
    if (user.email) return user.email.split("@")[0];
    return "Administrator";
}

function NavItem({ item, collapsed, badgeCount }) {
    return (
        <NavLink
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? NAV : "rgba(255,255,255,.75)",
                background: isActive ? GOLD : "transparent"
            })}
        >
            <span style={{ position: "relative" }}>
                {Icons[item.icon]}
                {collapsed && badgeCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        background: "#ef4444",
                        borderRadius: "50%"
                    }} />
                )}
            </span>

            {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}

            {!collapsed && badgeCount > 0 && (
                <span style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px"
                }}>
                    {badgeCount}
                </span>
            )}
        </NavLink>
    );
}

export default function AdminSidebar({ collapsed }) {
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const name = displayName(user);
    const initials = name.slice(0, 2).toUpperCase();
    const photoUrl = user.profile_photo ? `${STORAGE}/${user.profile_photo}` : null;
    const width = collapsed ? 60 : 228;

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/admin/contact-messages/counts`, {
                headers: authHeader()
            });

            if (!res.ok) return;

            const data = await res.json();
            setUnreadCount(Number(data.unread || 0));
        } catch (error) {
            console.error("Unread fetch failed", error);
        }
    }, []);

    useEffect(() => {
        fetchUnread();

        const interval = setInterval(fetchUnread, 30000);

        const onFocus = () => fetchUnread();
        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [fetchUnread]);

    useEffect(() => {
        fetchUnread();
    }, [location.pathname, fetchUnread]);

    const badgeCounts = {
        unread: unreadCount
    };

    return (
        <aside style={{
            width,
            minWidth: width,
            height: "100vh",
            background: NAV,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>
            <div style={{
                padding: collapsed ? "16px 0" : "18px 16px",
                borderBottom: "1px solid rgba(255,255,255,.08)"
            }}>
                {!collapsed && (
                    <h3 style={{
                        color: "#fff",
                        margin: 0,
                        fontFamily: SERIF
                    }}>
                        Admin Panel
                    </h3>
                )}
            </div>

            <nav style={{
                flex: 1,
                padding: "12px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 6
            }}>
                {NAV_GROUPS.map((group, index) => (
                    <div key={index}>
                        {group.items.map(item => (
                            <NavItem
                                key={item.to}
                                item={item}
                                collapsed={collapsed}
                                badgeCount={item.badge ? badgeCounts[item.badge] : 0}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div style={{
                padding: "12px 8px",
                borderTop: "1px solid rgba(255,255,255,.08)"
            }}>
                {!collapsed && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10
                    }}>
                        <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: GOLD,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {photoUrl
                                ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%" }} />
                                : initials}
                        </div>
                        <div style={{ color: "#fff", fontSize: 12 }}>
                            {name}
                        </div>
                    </div>
                )}

                <a href="/" style={{
                    color: "rgba(255,255,255,.6)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                }}>
                    {Icons.viewSite}
                    {!collapsed && "View Site"}
                </a>
            </div>
        </aside>
    );
}import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV = "#0a1f52";
const GOLD = "#f5c518";
const SERIF = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const STORAGE = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/* icons */
const Icons = {
    dashboard: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    messages: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    settings: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/></svg>,
    viewSite: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

const NAV_GROUPS = [
    {
        section: null,
        items: [
            { to: "/admin", label: "Dashboard", icon: "dashboard", exact: true }
        ]
    },
    {
        section: "Inbox",
        items: [
            { to: "/admin/messages", label: "Contact Messages", icon: "messages", badge: "unread" }
        ]
    },
    {
        section: "System",
        items: [
            { to: "/admin/settings", label: "Settings", icon: "settings" }
        ]
    }
];

function displayName(user) {
    if (user.name && user.name !== "Admin") return user.name;
    if (user.email) return user.email.split("@")[0];
    return "Administrator";
}

function NavItem({ item, collapsed, badgeCount }) {
    return (
        <NavLink
            to={item.to}
            end={item.exact}
            style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? NAV : "rgba(255,255,255,.75)",
                background: isActive ? GOLD : "transparent"
            })}
        >
            <span style={{ position: "relative" }}>
                {Icons[item.icon]}
                {collapsed && badgeCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        background: "#ef4444",
                        borderRadius: "50%"
                    }} />
                )}
            </span>

            {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}

            {!collapsed && badgeCount > 0 && (
                <span style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px"
                }}>
                    {badgeCount}
                </span>
            )}
        </NavLink>
    );
}

export default function AdminSidebar({ collapsed }) {
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const name = displayName(user);
    const initials = name.slice(0, 2).toUpperCase();
    const photoUrl = user.profile_photo ? `${STORAGE}/${user.profile_photo}` : null;
    const width = collapsed ? 60 : 228;

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnread = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/admin/contact-messages/counts`, {
                headers: authHeader()
            });

            if (!res.ok) return;

            const data = await res.json();
            setUnreadCount(Number(data.unread || 0));
        } catch (error) {
            console.error("Unread fetch failed", error);
        }
    }, []);

    useEffect(() => {
        fetchUnread();

        const interval = setInterval(fetchUnread, 30000);

        const onFocus = () => fetchUnread();
        window.addEventListener("focus", onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [fetchUnread]);

    useEffect(() => {
        fetchUnread();
    }, [location.pathname, fetchUnread]);

    const badgeCounts = {
        unread: unreadCount
    };

    return (
        <aside style={{
            width,
            minWidth: width,
            height: "100vh",
            background: NAV,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>
            <div style={{
                padding: collapsed ? "16px 0" : "18px 16px",
                borderBottom: "1px solid rgba(255,255,255,.08)"
            }}>
                {!collapsed && (
                    <h3 style={{
                        color: "#fff",
                        margin: 0,
                        fontFamily: SERIF
                    }}>
                        Admin Panel
                    </h3>
                )}
            </div>

            <nav style={{
                flex: 1,
                padding: "12px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 6
            }}>
                {NAV_GROUPS.map((group, index) => (
                    <div key={index}>
                        {group.items.map(item => (
                            <NavItem
                                key={item.to}
                                item={item}
                                collapsed={collapsed}
                                badgeCount={item.badge ? badgeCounts[item.badge] : 0}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            <div style={{
                padding: "12px 8px",
                borderTop: "1px solid rgba(255,255,255,.08)"
            }}>
                {!collapsed && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10
                    }}>
                        <div style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: GOLD,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {photoUrl
                                ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%" }} />
                                : initials}
                        </div>
                        <div style={{ color: "#fff", fontSize: 12 }}>
                            {name}
                        </div>
                    </div>
                )}

                <a href="/" style={{
                    color: "rgba(255,255,255,.6)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                }}>
                    {Icons.viewSite}
                    {!collapsed && "View Site"}
                </a>
            </div>
        </aside>
    );
}