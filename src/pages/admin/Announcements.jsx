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
function formatDateTime(d) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function isExpired(item) {
    if (!item.expires_at) return false;
    return new Date(item.expires_at) <= new Date();
}

/* ─── Config ─────────────────────────────────────────────── */
const IMPORTANCE_CFG = {
    high:   { bg: "#fef2f2", color: "#7f1d1d", border: "#ef4444", dot: "#ef4444", label: "High"   },
    medium: { bg: "#fffbeb", color: "#713f12", border: "#f59e0b", dot: "#f59e0b", label: "Medium" },
    low:    { bg: "#f0fdf4", color: "#14532d", border: "#22c55e", dot: "#22c55e", label: "Low"    },
};
const STATUS_CFG = {
    1: { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Published" },
    0: { bg: "#f1f5f9", color: "#475569", border: "#94a3b8", dot: "#94a3b8", label: "Draft"     },
};
const TYPE_CFG = {
    announcement: { bg: "#eff6ff", color: "#1e40af", border: "#93c5fd", label: "Announcement" },
    news:         { bg: "#fefce8", color: "#854d0e", border: "#fde047", label: "News"         },
};

/* ─── Toast ──────────────────────────────────────────────── */
function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(message, type = "success") {
        const id = Date.now() + Math.random();
        setToasts((p) => [...p, { id, message, type }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
    }
    return { toasts, addToast };
}
function Toast({ toasts }) {
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
            {toasts.map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.type === "success" ? "#052e16" : "#450a0a", color: t.type === "success" ? "#bbf7d0" : "#fecaca", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid " + (t.type === "success" ? "#166534" : "#991b1b"), minWidth: 240 }}>
                    <span style={{ fontSize: 16 }}>{t.type === "success" ? "✓" : "✕"}</span>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

/* ─── Confirm Modal ──────────────────────────────────────── */
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

/* ─── Badges ─────────────────────────────────────────────── */
function ImportanceBadge({ importance }) {
    const cfg = IMPORTANCE_CFG[importance?.toLowerCase()] || IMPORTANCE_CFG.medium;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 12px", background: cfg.bg, color: cfg.color, border: "1.5px solid " + cfg.border, borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />{cfg.label}
        </span>
    );
}
function PublishedBadge({ isPublished }) {
    const cfg = STATUS_CFG[isPublished ? 1 : 0];
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 12px", background: cfg.bg, color: cfg.color, border: "1.5px solid " + cfg.border, borderRadius: 20, whiteSpace: "nowrap" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />{cfg.label}
        </span>
    );
}
function TypeBadge({ type }) {
    const cfg = TYPE_CFG[type] || TYPE_CFG.announcement;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, padding: "4px 10px", background: cfg.bg, color: cfg.color, border: "1.5px solid " + cfg.border, borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {cfg.label}
        </span>
    );
}
function HomepageBadge() {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, padding: "4px 10px", background: "#fefce8", color: "#854d0e", border: "1.5px solid #fde047", borderRadius: 20, whiteSpace: "nowrap" }}>
            🏠 Homepage
        </span>
    );
}
function ExpiredBadge() {
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, padding: "4px 10px", background: "#fff1f2", color: "#881337", border: "1.5px solid #fda4af", borderRadius: 20, whiteSpace: "nowrap" }}>
            ⏰ Expired
        </span>
    );
}

/* ─── Form field ─────────────────────────────────────────── */
function Field({ label, required, error, hint, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>
                {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
            </label>
            {children}
            {hint  && !error && <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{hint}</span>}
            {error && <span style={{ fontSize: 11, color: "#ef4444", marginTop: 2, fontWeight: 600 }}>⚠ {error}</span>}
        </div>
    );
}
const inpStyle = { fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", width: "100%", boxSizing: "border-box" };
const taStyle  = { ...inpStyle, resize: "vertical", minHeight: 90, lineHeight: 1.6 };
const selStyle = { ...inpStyle, cursor: "pointer" };

/* ─── Toggle button pair ─────────────────────────────────── */
function TogglePair({ options, value, onChange }) {
    return (
        <div style={{ display: "flex", gap: 10 }}>
            {options.map(({ val, label, activeColor, activeText }) => {
                const active = value === val;
                return (
                    <button key={String(val)} type="button" onClick={() => onChange(val)}
                        style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 700, borderRadius: 9, cursor: "pointer", transition: "all .15s",
                            background: active ? (activeColor || NAV) : "#f8fafc",
                            color:      active ? (activeText || GOLD) : "#475569",
                            border:     active ? "2px solid " + (activeColor || NAV) : "2px solid #e2e8f0",
                        }}>
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

/* ─── Create / Edit Modal ────────────────────────────────── */
function AnnouncementModal({ item, categories, onClose, onSaved, addToast }) {
    const isEdit = !!item;
    const [form, setForm] = useState({
        type:              item?.type              || "announcement",
        category_id:       item?.category_id       || (categories[0]?.id ?? ""),
        title:             item?.title             || "",
        content:           item?.content           || "",
        details:           item?.details           || "",
        importance:        item?.importance        || "medium",
        is_featured:       item?.is_featured       ? true : false,
        show_on_homepage:  item?.show_on_homepage  ? true : false,
        event_date:        item?.event_date        ? item.event_date.slice(0, 16) : "",
        event_location:    item?.event_location    || "",
        posted_at:         item?.posted_at         ? item.posted_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
        expires_at:        item?.expires_at        ? item.expires_at.slice(0, 16) : "",
        is_published:      item?.is_published !== undefined ? Number(item.is_published) : 1,
    });
    const [imageFile,    setImageFile]    = useState(null);
    const [imagePreview, setImagePreview] = useState(item?.image_url || null);
    const [loading,      setLoading]      = useState(false);
    const [errors,       setErrors]       = useState({});

    const isNews = form.type === "news";

    function set(key, val) {
        setForm((f) => ({ ...f, [key]: val }));
        setErrors((e) => ({ ...e, [key]: "" }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) { addToast("Image must be under 4 MB.", "error"); return; }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function validate() {
        const e = {};
        if (!form.title.trim())   e.title       = "Title is required.";
        if (!form.content.trim()) e.content     = "Content is required.";
        if (!form.category_id)    e.category_id = "Category is required.";
        if (!form.posted_at)      e.posted_at   = "Posted date is required.";
        if (!isNews && !form.importance) e.importance = "Importance is required.";

        if (form.expires_at && form.posted_at) {
            const exp    = new Date(form.expires_at);
            const posted = new Date(form.posted_at);
            if (isNaN(exp.getTime())) {
                e.expires_at = "Enter a valid expiry date.";
            } else if (exp.getFullYear() < 2000) {
                e.expires_at = "Expiry year looks incorrect — did you mean a future date?";
            } else if (exp <= posted) {
                e.expires_at = "Expiry date must be after the posted date.";
            }
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setLoading(true);

        const fd = new FormData();
        fd.append("type",             form.type);
        fd.append("category_id",      form.category_id);
        fd.append("title",            form.title);
        fd.append("content",          form.content);
        fd.append("details",          form.details || "");
        fd.append("importance",       form.importance || "medium");
        fd.append("is_featured",      form.is_featured ? "1" : "0");
        fd.append("show_on_homepage", form.show_on_homepage ? "1" : "0");
        fd.append("event_date",       form.event_date     || "");
        fd.append("event_location",   form.event_location || "");
        fd.append("posted_at",        form.posted_at);
        if (form.expires_at && form.expires_at.trim()) {
            fd.append("expires_at", form.expires_at);
        }
        fd.append("is_published", String(form.is_published));
        if (imageFile) fd.append("image", imageFile);
        if (isEdit) fd.append("_method", "PUT");

        const url = isEdit
            ? `${API_URL}/admin/announcements/${item.id}`
            : `${API_URL}/admin/announcements`;

        try {
            const res  = await fetch(url, { method: "POST", headers: authHeader(), body: fd });
            let data = {};
            try { data = await res.json(); } catch (_) {}

            if (!res.ok) {
                if (data.errors) {
                    const mapped = {};
                    Object.entries(data.errors).forEach(([k, v]) => {
                        mapped[k] = Array.isArray(v) ? v[0] : v;
                    });
                    setErrors(mapped);
                    const firstMsg = Object.values(mapped)[0];
                    addToast(firstMsg || "Please fix the highlighted fields.", "error");
                } else {
                    addToast(data.message || `Server error (${res.status}).`, "error");
                }
                return;
            }

            addToast(isEdit ? `"${form.title}" updated.` : `"${form.title}" created.`);
            onSaved(data.announcement || data);
            onClose();
        } catch (err) {
            addToast("Network error — check that your API server is running.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 660, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div style={{ background: NAV, padding: "24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>
                                {isEdit ? "Edit" : "New"} · {isNews ? "News & Events" : "Announcement"}
                            </p>
                            <h2 style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>
                                {isEdit ? "Update Record" : "Create Post"}
                            </h2>
                        </div>
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                </div>

                <div style={{ padding: "24px 24px 8px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflowY: "auto" }}>

                    {!isEdit && (
                        <Field label="Post Type" required>
                            <TogglePair
                                value={form.type}
                                onChange={(v) => set("type", v)}
                                options={[
                                    { val: "announcement", label: "Announcement" },
                                    { val: "news",         label: "News & Events" },
                                ]}
                            />
                        </Field>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Category" required error={errors.category_id}>
                            <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} style={{ ...selStyle, borderColor: errors.category_id ? "#ef4444" : "#e2e8f0" }}>
                                <option value="">Select category…</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </Field>

                        {!isNews ? (
                            <Field label="Importance" required error={errors.importance}>
                                <select value={form.importance} onChange={(e) => set("importance", e.target.value)} style={{ ...selStyle, borderColor: errors.importance ? "#ef4444" : "#e2e8f0" }}>
                                    <option value="high">High — Action Required</option>
                                    <option value="medium">Medium — Please Note</option>
                                    <option value="low">Low — Info</option>
                                </select>
                            </Field>
                        ) : (
                            <Field label="Featured?">
                                <TogglePair
                                    value={form.is_featured}
                                    onChange={(v) => set("is_featured", v)}
                                    options={[
                                        { val: true,  label: "Featured", activeColor: GOLD,     activeText: NAV   },
                                        { val: false, label: "Normal",   activeColor: "#94a3b8", activeText: "#fff" },
                                    ]}
                                />
                            </Field>
                        )}
                    </div>

                    <Field label="Show on Homepage" hint="This post will appear in the School News section on the home page.">
                        <TogglePair
                            value={form.show_on_homepage}
                            onChange={(v) => set("show_on_homepage", v)}
                            options={[
                                { val: true,  label: "🏠 Show on Homepage", activeColor: "#0f766e", activeText: "#fff" },
                                { val: false, label: "Hide from Homepage",  activeColor: "#94a3b8", activeText: "#fff" },
                            ]}
                        />
                    </Field>

                    <Field label="Title" required error={errors.title}>
                        <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Enter title…" style={{ ...inpStyle, borderColor: errors.title ? "#ef4444" : "#e2e8f0" }} />
                    </Field>

                    <Field label="Content (Summary)" required error={errors.content}>
                        <textarea value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Brief summary shown on the listing…" style={{ ...taStyle, borderColor: errors.content ? "#ef4444" : "#e2e8f0" }} />
                    </Field>

                    <Field label="Details (Optional)">
                        <textarea value={form.details} onChange={(e) => set("details", e.target.value)} placeholder="Extended details or bullet points (one per line)…" style={{ ...taStyle, minHeight: 70 }} />
                    </Field>

                    <Field label={isNews ? "Cover Image" : "Cover Image (Optional)"}>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ ...inpStyle, padding: "8px 14px" }} />
                        {imagePreview && (
                            <div style={{ position: "relative", marginTop: 8 }}>
                                <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e2e8f0" }} />
                                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, background: "#dc2626", border: "none", borderRadius: "50%", cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    ×
                                </button>
                            </div>
                        )}
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>Max 4 MB · JPEG, PNG, WebP</span>
                    </Field>

                    {isNews && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            <Field label="Event Date">
                                <input type="datetime-local" value={form.event_date} onChange={(e) => set("event_date", e.target.value)} style={inpStyle} />
                            </Field>
                            <Field label="Event Location">
                                <input type="text" value={form.event_location} onChange={(e) => set("event_location", e.target.value)} placeholder="e.g. School Gymnasium" style={inpStyle} />
                            </Field>
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Posted At" required error={errors.posted_at}>
                            <input
                                type="datetime-local"
                                value={form.posted_at}
                                onChange={(e) => set("posted_at", e.target.value)}
                                style={{ ...inpStyle, borderColor: errors.posted_at ? "#ef4444" : "#e2e8f0" }}
                            />
                        </Field>
                        <Field label="Expires At" hint="Leave blank for no expiry" error={errors.expires_at}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <input
                                    type="datetime-local"
                                    value={form.expires_at}
                                    onChange={(e) => set("expires_at", e.target.value)}
                                    style={{ ...inpStyle, flex: 1, borderColor: errors.expires_at ? "#ef4444" : "#e2e8f0" }}
                                />
                                {form.expires_at && (
                                    <button type="button" onClick={() => set("expires_at", "")} title="Clear expiry date"
                                        style={{ flexShrink: 0, width: 34, height: 40, background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 8, cursor: "pointer", color: "#dc2626", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                                )}
                            </div>
                        </Field>
                    </div>

                    <Field label="Visibility">
                        <TogglePair
                            value={form.is_published}
                            onChange={(v) => set("is_published", v)}
                            options={[
                                { val: 1, label: "Published", activeColor: "#16a34a", activeText: "#fff" },
                                { val: 0, label: "Draft",     activeColor: "#94a3b8", activeText: "#fff" },
                            ]}
                        />
                    </Field>
                </div>

                <div style={{ padding: "16px 24px 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={onClose} style={{ fontSize: 12, fontWeight: 700, padding: "12px 24px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}
                        style={{ fontSize: 12, fontWeight: 800, padding: "12px 32px", background: loading ? "#e2e8f0" : NAV, color: loading ? "#94a3b8" : GOLD, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.06em" }}>
                        {loading ? "Saving…" : isEdit ? "Save Changes" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Detail Modal ───────────────────────────────────────── */
function DetailModal({ item: initial, categories, onClose, onUpdated, onDelete, addToast }) {
    const [item,    setItem]    = useState(initial);
    const [editing, setEditing] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const cat    = categories.find((c) => c.id == item.category_id) || item.category;
    const isNews = item.type === "news";
    const expired = isExpired(item);

    function handleSaved(updated) { setItem(updated); onUpdated(updated); }

    async function doDelete() {
        setConfirm(false);
        try {
            const res = await fetch(`${API_URL}/admin/announcements/${item.id}`, { method: "DELETE", headers: authHeader() });
            if (!res.ok) throw new Error("Delete failed.");
            addToast(`"${item.title}" deleted.`);
            onDelete(item.id);
            onClose();
        } catch (err) {
            addToast(err.message || "Failed to delete.", "error");
        }
    }

    const infoRows = [
        { label: "Type",             value: <TypeBadge type={item.type} /> },
        { label: "Category",         value: cat?.name },
        { label: "Status",           value: <PublishedBadge isPublished={item.is_published} /> },
        { label: "Show on Homepage", value: item.show_on_homepage ? <HomepageBadge /> : "No" },
        ...(!isNews ? [{ label: "Priority", value: <ImportanceBadge importance={item.importance} /> }] : []),
        ...(isNews  ? [
            { label: "Featured",       value: item.is_featured ? "Yes" : "No" },
            { label: "Event Date",     value: formatDateTime(item.event_date) },
            { label: "Event Location", value: item.event_location },
        ] : []),
        { label: "Posted At",  value: formatDateTime(item.posted_at)  },
        { label: "Expires At", value: item.expires_at ? formatDateTime(item.expires_at) : "No expiry" },
        { label: "Views",      value: item.view_count ?? 0 },
    ];

    return (
        <>
            <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
                <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={(e) => e.stopPropagation()}>

                    <div style={{ background: NAV, padding: "24px 24px 80px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <TypeBadge type={item.type} />
                                {item.show_on_homepage && <HomepageBadge />}
                                {expired && <ExpiredBadge />}
                                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>Detail View</span>
                            </div>
                            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                        </div>
                    </div>

                    <div style={{ margin: "-52px 20px 0", background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", position: "relative", zIndex: 1 }}>
                        {item.image_url && (
                            <img src={item.image_url} alt={item.title} style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />
                        )}
                        <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>#{item.id} · {cat?.name || "Uncategorized"}</p>
                        <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#0f172a", fontFamily: SERIF, lineHeight: 1.25 }}>{item.title}</h2>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <TypeBadge type={item.type} />
                            {!isNews && <ImportanceBadge importance={item.importance} />}
                            <PublishedBadge isPublished={item.is_published} />
                            {item.show_on_homepage && <HomepageBadge />}
                            {expired && <ExpiredBadge />}
                        </div>
                    </div>

                    <div style={{ padding: "20px 22px 4px", display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                            <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>Summary</p>
                            <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #f1f5f9", maxHeight: 160, overflowY: "auto" }}>
                                <p style={{ margin: 0, fontSize: 14, color: "#334155", lineHeight: 1.7, fontFamily: SERIF, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{item.content || "—"}</p>
                            </div>
                        </div>
                        {item.details && (
                            <div>
                                <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>Details</p>
                                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #f1f5f9", maxHeight: 160, overflowY: "auto" }}>
                                    <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.75, fontFamily: SERIF, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{item.details}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: "16px 22px 8px" }}>
                        <p style={{ margin: "0 0 12px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#94a3b8" }}>Information</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {infoRows.map((row, i) => (
                                <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #f1f5f9" }}>
                                    <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>{row.label}</p>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: row.value ? "#0f172a" : "#cbd5e1", fontFamily: SERIF }}>
                                        {row.value || "—"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: "16px 22px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => setConfirm(true)} style={{ fontSize: 11, fontWeight: 700, padding: "10px 18px", background: "#fff", border: "1.5px solid #fca5a5", color: "#dc2626", borderRadius: 10, cursor: "pointer" }}>Delete</button>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setEditing(true)} style={{ fontSize: 12, fontWeight: 800, padding: "12px 24px", background: GOLD, color: NAV, border: "none", borderRadius: 10, cursor: "pointer" }}>Edit</button>
                            <button onClick={onClose} style={{ fontSize: 12, fontWeight: 800, padding: "12px 24px", background: NAV, color: GOLD, border: "none", borderRadius: 10, cursor: "pointer" }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {editing && <AnnouncementModal item={item} categories={categories} onClose={() => setEditing(false)} onSaved={handleSaved} addToast={addToast} />}
            {confirm && <ConfirmModal title="Delete Item" message={`Delete "${item.title}"? This cannot be undone.`} confirmLabel="Delete" confirmColor="#dc2626" onConfirm={doDelete} onCancel={() => setConfirm(false)} />}
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function Announcements() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();
    const [items,      setItems]      = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [selected,   setSelected]   = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [search,     setSearch]     = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [catFilter,  setCatFilter]  = useState("");
    const [impFilter,  setImpFilter]  = useState("");
    const [pubFilter,  setPubFilter]  = useState("");
    const [homepageFilter, setHomepageFilter] = useState("");
    const [expiredFilter,  setExpiredFilter]  = useState("");
    const [page,       setPage]       = useState(1);
    const [meta,       setMeta]       = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/admin/announcement-categories`, { headers: authHeader() })
            .then((r) => r.json())
            .then((d) => setCategories(Array.isArray(d) ? d : d.data || []))
            .catch(() => {});
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 15 });
            if (search)         params.set("search",           search);
            if (typeFilter)     params.set("type",             typeFilter);
            if (catFilter)      params.set("category_id",      catFilter);
            if (impFilter)      params.set("importance",       impFilter);
            if (pubFilter)      params.set("is_published",     pubFilter);
            if (homepageFilter) params.set("show_on_homepage", homepageFilter);

            const res = await fetch(`${API_URL}/admin/announcements?${params}`, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) { setItems(data); setMeta(null); }
                else { setItems(data.data || []); setMeta(data); }
            }
        } catch (_) {}
        finally { setLoading(false); }
    }, [page, search, typeFilter, catFilter, impFilter, pubFilter, homepageFilter, navigate]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => { setPage(1); }, [search, typeFilter, catFilter, impFilter, pubFilter, homepageFilter]);

    function handleUpdated(updated) {
        setItems((prev) => prev.map((a) => a.id === updated.id ? updated : a));
        if (selected?.id === updated.id) setSelected(updated);
    }
    function handleCreated(created) { setItems((prev) => [created, ...prev]); }
    function handleDeleted(id)      { setItems((prev) => prev.filter((a) => a.id !== id)); }

    // Client-side expired filter (applied on top of server results)
    const displayItems = expiredFilter === "1"
        ? items.filter((a) => isExpired(a))
        : expiredFilter === "0"
            ? items.filter((a) => !isExpired(a))
            : items;

    const total         = meta ? meta.total : items.length;
    const published     = items.filter((a) => a.is_published).length;
    const drafts        = items.filter((a) => !a.is_published).length;
    const annCount      = items.filter((a) => a.type === "announcement").length;
    const newsCount     = items.filter((a) => a.type === "news").length;
    const homepageCount = items.filter((a) => a.show_on_homepage).length;
    const expiredCount  = items.filter((a) => isExpired(a)).length;

    // ── Stat cards — clickable like Students.jsx ───────────────────
    const statCards = [
        { label: "Total",         value: total,         bg: "#f0f4ff", color: NAV,       border: NAV + "20",  filterKey: null,             filterVal: null        },
        { label: "Published",     value: published,     bg: "#dcfce7", color: "#14532d", border: "#16a34a40", filterKey: "pubFilter",      filterVal: "1"         },
        { label: "Drafts",        value: drafts,        bg: "#f1f5f9", color: "#475569", border: "#94a3b840", filterKey: "pubFilter",      filterVal: "0"         },
        { label: "Announcements", value: annCount,      bg: "#eff6ff", color: "#1e40af", border: "#93c5fd",   filterKey: "typeFilter",     filterVal: "announcement" },
        { label: "News",          value: newsCount,     bg: "#fefce8", color: "#854d0e", border: "#fde04780", filterKey: "typeFilter",     filterVal: "news"      },
        { label: "On Homepage",   value: homepageCount, bg: "#f0fdfa", color: "#0f766e", border: "#99f6e440", filterKey: "homepageFilter", filterVal: "1"         },
        { label: "Expired",       value: expiredCount,  bg: "#fff1f2", color: "#881337", border: "#fda4af",   filterKey: "expiredFilter",  filterVal: "1"         },
    ];

    const filterState = { pubFilter, typeFilter, homepageFilter, expiredFilter };
    const filterSetters = { pubFilter: setPubFilter, typeFilter: setTypeFilter, homepageFilter: setHomepageFilter, expiredFilter: setExpiredFilter };

    function handleCardClick(card) {
        if (card.filterKey === null) {
            // "Total" — clear all filters
            setTypeFilter(""); setCatFilter(""); setImpFilter("");
            setPubFilter(""); setHomepageFilter(""); setExpiredFilter("");
            setPage(1);
            return;
        }
        const current = filterState[card.filterKey];
        filterSetters[card.filterKey](current === card.filterVal ? "" : card.filterVal);
        setPage(1);
    }

    function isCardActive(card) {
        if (card.filterKey === null) {
            return !typeFilter && !catFilter && !impFilter && !pubFilter && !homepageFilter && !expiredFilter;
        }
        return filterState[card.filterKey] === card.filterVal;
    }

    const hasActiveFilter = !!(search || typeFilter || catFilter || impFilter || pubFilter || homepageFilter || expiredFilter);
    const COL_WIDTHS = ["48px", "auto", "130px", "130px", "110px", "100px", "110px", "90px"];
    const TH_LABELS  = ["", "Title", "Type", "Category", "Status", "Homepage", "Posted", ""];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header */}
            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                    <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Announcements & News</h1>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={load} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer" }}>Refresh</button>
                    <button onClick={() => setShowCreate(true)} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 20px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>+ New Post</button>
                </div>
            </div>

            {/* ── Clickable Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                {statCards.map((card) => {
                    const active = isCardActive(card);
                    return (
                        <div
                            key={card.label}
                            onClick={() => handleCardClick(card)}
                            style={{
                                background:   card.bg,
                                borderRadius: 12,
                                padding:      "16px 18px",
                                border:       "2px solid " + (active ? card.color : card.border),
                                cursor:       "pointer",
                                transition:   "all .18s",
                                boxShadow:    active ? "0 4px 16px " + card.color + "30" : "none",
                                transform:    active ? "translateY(-2px)" : "none",
                                position:     "relative",
                                outline:      "none",
                            }}
                            onMouseEnter={(e) => {
                                if (!active) {
                                    e.currentTarget.style.borderColor = card.color;
                                    e.currentTarget.style.boxShadow  = "0 2px 8px " + card.color + "20";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!active) {
                                    e.currentTarget.style.borderColor = card.border;
                                    e.currentTarget.style.boxShadow  = "none";
                                }
                            }}
                        >
                            {/* ✓ Checkmark badge when active — matches Students.jsx */}
                            {active && (
                                <div style={{ position: "absolute", top: 10, right: 12, width: 18, height: 18, background: card.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            )}
                            <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: card.color, fontFamily: SERIF, lineHeight: 1 }}>{card.value}</p>
                            <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: card.color, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em" }}>{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1.5px solid #f1f5f9", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input type="text" placeholder="Search title or content…" value={search} onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: "1 1 180px", fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", minWidth: 150 }} />
                {[
                    { val: typeFilter,     onChange: setTypeFilter,     opts: [["", "All Types"], ["announcement", "Announcements"], ["news", "News & Events"]] },
                    { val: catFilter,      onChange: setCatFilter,      opts: [["", "All Categories"], ...categories.map((c) => [String(c.id), c.name])] },
                    { val: impFilter,      onChange: setImpFilter,      opts: [["", "All Priorities"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]] },
                    { val: pubFilter,      onChange: setPubFilter,      opts: [["", "All Statuses"], ["1", "Published"], ["0", "Draft"]] },
                    { val: homepageFilter, onChange: setHomepageFilter, opts: [["", "All Posts"], ["1", "🏠 On Homepage"], ["0", "Hidden from Homepage"]] },
                    { val: expiredFilter,  onChange: setExpiredFilter,  opts: [["", "All (incl. expired)"], ["1", "⏰ Expired Only"], ["0", "Active Only"]] },
                ].map(({ val, onChange, opts }, i) => (
                    <select key={i} value={val} onChange={(e) => { onChange(e.target.value); setPage(1); }}
                        style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "9px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                ))}
                {hasActiveFilter && (
                    <button onClick={() => { setSearch(""); setTypeFilter(""); setCatFilter(""); setImpFilter(""); setPubFilter(""); setHomepageFilter(""); setExpiredFilter(""); setPage(1); }}
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
                        <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Posts</span>
                        {expiredFilter === "1" && (
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", background: "#fff1f2", color: "#881337", border: "1px solid #fda4af", borderRadius: 20 }}>⏰ Showing expired only</span>
                        )}
                    </div>
                    {meta && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{meta.from}–{meta.to} of {meta.total}</span>}
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 780 }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                {TH_LABELS.map((h, i) => (
                                    <th key={i} style={{
                                        padding: "12px 16px",
                                        width: COL_WIDTHS[i],
                                        textAlign: i === TH_LABELS.length - 1 ? "right" : "left",
                                        fontSize: 9,
                                        fontWeight: 800,
                                        letterSpacing: "0.14em",
                                        textTransform: "uppercase",
                                        color: "#64748b",
                                        whiteSpace: "nowrap",
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "12px 16px", width: COL_WIDTHS[0] }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9" }} />
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <div style={{ height: 13, width: 180, background: "#f1f5f9", borderRadius: 6 }} />
                                    </td>
                                    {[90, 100, 90, 70, 90].map((w, j) => (
                                        <td key={j} style={{ padding: "12px 16px", width: COL_WIDTHS[j + 2] }}>
                                            <div style={{ height: 13, width: w, background: "#f1f5f9", borderRadius: 6 }} />
                                        </td>
                                    ))}
                                    <td style={{ padding: "12px 16px", width: COL_WIDTHS[7], textAlign: "right" }}>
                                        <div style={{ height: 30, width: 60, background: "#f1f5f9", borderRadius: 8, marginLeft: "auto" }} />
                                    </td>
                                </tr>
                            ))}

                            {!loading && displayItems.length === 0 && (
                                <tr><td colSpan={8} style={{ padding: "60px 20px", textAlign: "center" }}>
                                    <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontFamily: SERIF }}>No posts found.</p>
                                </td></tr>
                            )}

                            {!loading && displayItems.map((a) => {
                                const cat     = a.category || categories.find((c) => c.id == a.category_id);
                                const typCfg  = TYPE_CFG[a.type] || TYPE_CFG.announcement;
                                const expired = isExpired(a);
                                return (
                                    <tr key={a.id} onClick={() => setSelected(a)}
                                        style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background .1s", opacity: expired ? 0.75 : 1 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f4ff"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[0], verticalAlign: "middle" }}>
                                            {a.image_url ? (
                                                <img src={a.image_url} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", border: "1.5px solid #e2e8f0", display: "block" }} />
                                            ) : (
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: typCfg.bg, border: "1.5px solid " + typCfg.border, flexShrink: 0 }} />
                                            )}
                                        </td>

                                        {/* Title + expired pill */}
                                        <td style={{ padding: "12px 16px", verticalAlign: "middle", maxWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                                                <p style={{ margin: 0, fontWeight: 800, color: NAV, fontFamily: SERIF, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                                                {expired && (
                                                    <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 800, padding: "2px 7px", background: "#fff1f2", color: "#881337", border: "1px solid #fda4af", borderRadius: 20 }}>⏰</span>
                                                )}
                                            </div>
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[2], verticalAlign: "middle" }}>
                                            <TypeBadge type={a.type} />
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[3], verticalAlign: "middle", color: "#475569", fontFamily: SERIF, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {cat?.name || "—"}
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[4], verticalAlign: "middle" }}>
                                            <PublishedBadge isPublished={a.is_published} />
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[5], verticalAlign: "middle" }}>
                                            {a.show_on_homepage
                                                ? <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", background: "#f0fdfa", color: "#0f766e", border: "1.5px solid #99f6e4", borderRadius: 20, whiteSpace: "nowrap" }}>🏠 Yes</span>
                                                : <span style={{ fontSize: 11, color: "#cbd5e1" }}>—</span>
                                            }
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[6], verticalAlign: "middle", color: "#94a3b8", fontFamily: SERIF, fontSize: 12, whiteSpace: "nowrap" }}>
                                            {formatDate(a.posted_at)}
                                        </td>

                                        <td style={{ padding: "12px 16px", width: COL_WIDTHS[7], verticalAlign: "middle", textAlign: "right" }}>
                                            <button onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                                                style={{ fontSize: 11, fontWeight: 800, padding: "8px 16px", background: NAV, color: GOLD, border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page > 1 && (
                    <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: SERIF }}>Page {meta.current_page} of {meta.last_page}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[["Prev", -1], ["Next", 1]].map(([label, dir]) => {
                                const disabled = dir === -1 ? meta.current_page <= 1 : meta.current_page >= meta.last_page;
                                return (
                                    <button key={label} onClick={() => setPage((p) => p + dir)} disabled={disabled}
                                        style={{ fontSize: 11, fontWeight: 700, padding: "9px 18px", background: disabled ? "#f1f5f9" : NAV, color: disabled ? "#cbd5e1" : GOLD, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" }}>
                                        {label}
                                    </button>
                                );
            })}
                        </div>
                    </div>
                )}
            </div>

            {selected   && <DetailModal item={selected} categories={categories} onClose={() => setSelected(null)} onUpdated={handleUpdated} onDelete={handleDeleted} addToast={addToast} />}
            {showCreate && <AnnouncementModal categories={categories} onClose={() => setShowCreate(false)} onSaved={handleCreated} addToast={addToast} />}
            <Toast toasts={toasts} />
        </div>
    );
}