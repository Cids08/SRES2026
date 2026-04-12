import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar  from "../components/admin/AdminNavbar";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const token = localStorage.getItem("admin_token");

    if (!token) return <Navigate to="/admin/login" replace />;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>
            <AdminSidebar collapsed={collapsed} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <AdminNavbar onToggleSidebar={() => setCollapsed((c) => !c)} />
                <main style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}