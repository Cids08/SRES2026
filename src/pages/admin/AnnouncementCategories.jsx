import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}

/* ─── Toast ─────────────────────────────────────────────────────────── */
function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(message, type = "success") {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }
    return { toasts, addToast };
}
function Toast({ toasts }) {
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
            {toasts.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.type === "success" ? "#052e16" : "#450a0a", color: t.type === "success" ? "#bbf7d0" : "#fecaca", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid " + (t.type === "success" ? "#166534" : "#991b1b"), minWidth: 240, pointerEvents: "none" }}>
                    <span style={{ fontSize: 16 }}>{t.type === "success" ? "✓" : "✕"}</span>
                    {t.message}
                </div>
            ))}
        </div>
    );
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
                        <button onClick={onConfirm} style={{ fontSize: 12, fontWeight: 800, padding: "10px 22px", background: confirmColor || NAV, color: "#fff", border: "none", borderRadius: 9, cursor: "pointer" }}>{confirmLabel || "Confirm"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Category Form Modal ────────────────────────────────────────────── */
function CategoryModal({ category, onClose, onSaved, addToast }) {
    const isEdit = !!category;
    const [form, setForm] = useState({
        name:        category?.name        || "",
        description: category?.description || "",
        is_active:   category?.is_active   !== undefined ? category.is_active : true,
    });
    const [loading, setLoading] = useState(false);
    const [errors,  setErrors]  = useState({});

    function set(key, val) { setForm((f) => ({ ...f, [key]: val })); setErrors((e) => ({ ...e, [key]: "" })); }

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setLoading(true);
        try {
            const url    = isEdit ? `${API_URL}/admin/announcement-categories/${category.id}` : `${API_URL}/admin/announcement-categories`;
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { ...authHeader(), "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, is_active: Boolean(form.is_active) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save.");
            addToast(isEdit ? `"${form.name}" updated.` : `"${form.name}" created.`);
            onSaved(data.category);
            onClose();
        } catch (err) {
            addToast(err.message || "Something went wrong.", "error");
        } finally { setLoading(false); }
    }

    const inputStyle = { fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", width: "100%", boxSizing: "border-box" };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 480, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>

                <div style={{ background: NAV, padding: "24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>
                                {isEdit ? "Edit Category" : "New Category"}
                            </p>
                            <h2 style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>
                                {isEdit ? "Update Category" : "Create Category"}
                            </h2>
                        </div>
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                </div>

                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>Name <span style={{ color: "#ef4444" }}>*</span></label>
                        <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Enrollment, Events, Health" style={inputStyle} />
                        {errors.name && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>Description</label>
                        <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description (optional)" style={inputStyle} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>Status</label>
                        <div style={{ display: "flex", gap: 10 }}>
                            {[{ val: true, label: "Active" }, { val: false, label: "Inactive" }].map(({ val, label }) => {
                                const active = form.is_active === val;
                                return (
                                    <button key={label} type="button" onClick={() => set("is_active", val)}
                                        style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 700, borderRadius: 9, cursor: "pointer",
                                            background: active ? (val ? "#16a34a" : "#dc2626") : "#f8fafc",
                                            color:      active ? "#fff" : "#475569",
                                            border:     active ? "2px solid " + (val ? "#16a34a" : "#dc2626") : "2px solid #e2e8f0",
                                        }}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={onClose} style={{ fontSize: 12, fontWeight: 700, padding: "12px 24px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}
                        style={{ fontSize: 12, fontWeight: 800, padding: "12px 28px", background: loading ? "#e2e8f0" : NAV, color: loading ? "#94a3b8" : GOLD, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer" }}>
                        {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function AnnouncementCategories() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editing,    setEditing]    = useState(null);
    const [confirm,    setConfirm]    = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/announcement-categories`, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : data.data || []);
        } catch (_) {}
        finally { setLoading(false); }
    }, [navigate]);

    useEffect(() => { load(); }, [load]);

    function handleSaved(cat) {
        setCategories((prev) => {
            const exists = prev.find((c) => c.id === cat.id);
            return exists ? prev.map((c) => c.id === cat.id ? cat : c) : [cat, ...prev];
        });
    }

    async function handleDelete(cat) {
        try {
            const res = await fetch(`${API_URL}/admin/announcement-categories/${cat.id}`, { method: "DELETE", headers: authHeader() });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            addToast(`"${cat.name}" deleted.`);
            setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        } catch (err) {
            addToast(err.message || "Failed to delete.", "error");
        } finally { setConfirm(null); }
    }

    const active   = categories.filter((c) => c.is_active).length;
    const inactive = categories.filter((c) => !c.is_active).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header */}
            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                    <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Announcement Categories</h1>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={load} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer" }}>↻ Refresh</button>
                    <button onClick={() => setShowCreate(true)} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>+ New Category</button>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                {[
                    { label: "Total",    value: categories.length, bg: "#f0f4ff", color: NAV,       border: NAV + "20"  },
                    { label: "Active",   value: active,            bg: "#dcfce7", color: "#14532d", border: "#16a34a40" },
                    { label: "Inactive", value: inactive,          bg: "#f1f5f9", color: "#475569", border: "#94a3b840" },
                ].map((card) => (
                    <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: "16px 18px", border: "2px solid " + card.border }}>
                        <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: card.color, fontFamily: SERIF, lineHeight: 1 }}>{card.value}</p>
                        <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: card.color, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em" }}>{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Category List</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>— shared by Announcements & News</span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                            {["Name", "Slug", "Description", "Status", ""].map((h) => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: h === "" ? "right" : "left", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                {[160, 120, 200, 80, 100].map((w, j) => (
                                    <td key={j} style={{ padding: "14px 16px" }}>
                                        <div style={{ height: 13, width: w, background: "#f1f5f9", borderRadius: 6 }} />
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {!loading && categories.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                                <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontFamily: SERIF }}>No categories yet. Create one!</p>
                            </td></tr>
                        )}

                        {!loading && categories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: "1px solid #f8fafc" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f4ff"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                                <td style={{ padding: "14px 16px", fontWeight: 800, color: NAV, fontFamily: SERIF }}>{cat.name}</td>
                                <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 12, fontFamily: "monospace" }}>{cat.slug}</td>
                                <td style={{ padding: "14px 16px", color: "#475569", fontSize: 12, fontFamily: SERIF }}>{cat.description || "—"}</td>
                                <td style={{ padding: "14px 16px" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 12px",
                                        background: cat.is_active ? "#dcfce7" : "#f1f5f9",
                                        color:      cat.is_active ? "#14532d" : "#475569",
                                        border:     "1.5px solid " + (cat.is_active ? "#16a34a" : "#94a3b8"),
                                        borderRadius: 20 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.is_active ? "#16a34a" : "#94a3b8" }} />
                                        {cat.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                        <button onClick={() => setEditing(cat)}
                                            style={{ fontSize: 11, fontWeight: 800, padding: "8px 16px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>Edit</button>
                                        <button onClick={() => setConfirm(cat)}
                                            style={{ fontSize: 11, fontWeight: 800, padding: "8px 16px", background: "#fff", border: "1.5px solid #fca5a5", color: "#dc2626", borderRadius: 8, cursor: "pointer" }}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showCreate && <CategoryModal onClose={() => setShowCreate(false)} onSaved={handleSaved} addToast={addToast} />}
            {editing    && <CategoryModal category={editing} onClose={() => setEditing(null)} onSaved={handleSaved} addToast={addToast} />}
            {confirm    && (
                <ConfirmModal
                    title="Delete Category"
                    message={`Delete "${confirm.name}"? This cannot be undone. Make sure no announcements or news use this category first.`}
                    confirmLabel="Delete"
                    confirmColor="#dc2626"
                    onConfirm={() => handleDelete(confirm)}
                    onCancel={() => setConfirm(null)}
                />
            )}
            <Toast toasts={toasts} />
        </div>
    );
}