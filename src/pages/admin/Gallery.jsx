import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function authHeader() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: "Bearer " + token } : {};
}
function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}
function fmtBytes(b) {
    if (!b) return "—";
    if (b < 1024)         return b + " B";
    if (b < 1024 * 1024)  return (b / 1024).toFixed(1) + " KB";
    return (b / (1024 * 1024)).toFixed(1) + " MB";
}

/* ── SVG Icons ───────────────────────────────────────────── */
const Ico = {
    image: (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    imageLg: (
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    folder: (
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    upload: (
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
    ),
    edit: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    ),
    trash: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
    ),
    trashLg: (
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
    ),
    download: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    close: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    search: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    ),
    arrowLeft: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
    ),
    plus: (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
    star: (
        <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
    chevLeft: (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
        </svg>
    ),
    chevRight: (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
        </svg>
    ),
};

/* ── Status config ── */
const STATUS_CFG = {
    1: { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Active"   },
    0: { bg: "#f1f5f9", color: "#475569", border: "#94a3b8", dot: "#94a3b8", label: "Inactive" },
};

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
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
                <div key={t.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: t.type === "success" ? "#dcfce7" : "#fee2e2",
                    color:      t.type === "success" ? "#14532d"  : "#7f1d1d",
                    border:     `1.5px solid ${t.type === "success" ? "#16a34a" : "#dc2626"}`,
                    padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 240,
                    animation: "toastIn .25s ease", pointerEvents: "none",
                }}>
                    <span style={{ display: "flex", color: t.type === "success" ? "#16a34a" : "#dc2626" }}>
                        {t.type === "success"
                            ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                    </span>
                    {t.message}
                </div>
            ))}
            <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   CONFIRM MODAL
══════════════════════════════════════════════════════ */
function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1400, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onCancel}>
            <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.28)" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: NAV, padding: "20px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(220,38,38,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fca5a5" }}>
                        {Ico.trashLg}
                    </div>
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

/* ══════════════════════════════════════════════════════
   FORM HELPERS
══════════════════════════════════════════════════════ */
function Field({ label, required, error, hint, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>
                {label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
            </label>
            {children}
            {hint  && !error && <span style={{ fontSize: 11, color: "#94a3b8" }}>{hint}</span>}
            {error && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>⚠ {error}</span>}
        </div>
    );
}
const inpStyle = { fontSize: 13, fontFamily: SERIF, color: "#1a1a1a", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", width: "100%", boxSizing: "border-box" };
const taStyle  = { ...inpStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 };

function StatusToggle({ value, onChange }) {
    return (
        <div style={{ display: "flex", gap: 10 }}>
            {[{ val: true, label: "Active", color: "#16a34a" }, { val: false, label: "Inactive", color: "#94a3b8" }].map(({ val, label, color }) => {
                const active = value === val;
                return (
                    <button key={String(val)} type="button" onClick={() => onChange(val)}
                        style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 700, borderRadius: 9, cursor: "pointer", transition: "all .15s",
                            background: active ? color : "#f8fafc",
                            color:      active ? "#fff" : "#475569",
                            border:     active ? `2px solid ${color}` : "2px solid #e2e8f0",
                        }}>
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   ALBUM FORM MODAL
══════════════════════════════════════════════════════ */
function AlbumModal({ album, onClose, onSaved, addToast }) {
    const isEdit = !!album;
    const [form, setForm] = useState({
        title:       album?.title       || "",
        description: album?.description || "",
        is_active:   album?.is_active   !== undefined ? album.is_active : true,
    });
    const [coverFile,    setCoverFile]    = useState(null);
    const [coverPreview, setCoverPreview] = useState(album?.cover_url || null);
    const [loading, setLoading] = useState(false);
    const [errors,  setErrors]  = useState({});

    function set(key, val) { setForm((f) => ({ ...f, [key]: val })); setErrors((e) => ({ ...e, [key]: "" })); }

    function handleCover(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { addToast("Cover image must be under 5 MB.", "error"); return; }
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    function validate() {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        setLoading(true);
        const fd = new FormData();
        fd.append("title",       form.title);
        fd.append("description", form.description || "");
        fd.append("is_active",   form.is_active ? "1" : "0");
        if (coverFile) fd.append("cover_image", coverFile);
        if (isEdit) fd.append("_method", "PUT");

        const url = isEdit ? `${API_URL}/admin/albums/${album.id}` : `${API_URL}/admin/albums`;
        try {
            const res = await fetch(url, { method: "POST", headers: authHeader(), body: fd });
            let data = {};
            try { data = await res.json(); } catch (_) {}
            if (!res.ok) {
                if (data.errors) {
                    const mapped = {};
                    Object.entries(data.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
                    setErrors(mapped);
                    addToast(Object.values(mapped)[0] || "Please fix the errors.", "error");
                } else {
                    addToast(data.message || `Server error (${res.status}).`, "error");
                }
                return;
            }
            addToast(isEdit ? `"${form.title}" updated.` : `"${form.title}" created.`);
            onSaved(data.album || data);
            onClose();
        } catch (_) {
            addToast("Network error — is the API server running?", "error");
        } finally { setLoading(false); }
    }

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 540, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: NAV, padding: "24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>
                                {isEdit ? "Edit Album" : "New Album"}
                            </p>
                            <h2 style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>
                                {isEdit ? "Update Album" : "Create Album"}
                            </h2>
                        </div>
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                </div>
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <Field label="Album Title" required error={errors.title}>
                        <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Graduation 2025" style={{ ...inpStyle, borderColor: errors.title ? "#ef4444" : "#e2e8f0" }} />
                    </Field>
                    <Field label="Description" hint="Shown as subtitle under the album title">
                        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description of this album…" style={taStyle} />
                    </Field>
                    <Field label="Cover Image" hint="Max 5 MB · JPEG, PNG, WebP">
                        <input type="file" accept="image/*" onChange={handleCover} style={{ ...inpStyle, padding: "8px 14px" }} />
                        {coverPreview && (
                            <div style={{ marginTop: 8, position: "relative", borderRadius: 10, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                                <img src={coverPreview} alt="cover preview" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                                <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {Ico.close}
                                </button>
                            </div>
                        )}
                    </Field>
                    <Field label="Status">
                        <StatusToggle value={form.is_active} onChange={(v) => set("is_active", v)} />
                    </Field>
                </div>
                <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                    <button onClick={onClose} style={{ fontSize: 12, fontWeight: 700, padding: "12px 24px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}
                        style={{ fontSize: 12, fontWeight: 800, padding: "12px 28px", background: loading ? "#e2e8f0" : NAV, color: loading ? "#94a3b8" : GOLD, border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer" }}>
                        {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Album"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   PHOTO UPLOAD MODAL
══════════════════════════════════════════════════════ */
function PhotoUploadModal({ album, onClose, onUploaded, addToast }) {
    const [files,    setFiles]    = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading,  setLoading]  = useState(false);
    const [progress, setProgress] = useState(0);
    const dropRef = useRef(null);

    function handleFiles(rawFiles) {
        const valid = Array.from(rawFiles).filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
        if (valid.length < rawFiles.length) addToast("Some files skipped (non-image or > 5 MB).", "error");
        setFiles((prev) => [...prev, ...valid]);
        valid.forEach((f) => {
            const reader = new FileReader();
            reader.onload = (e) => setPreviews((prev) => [...prev, { name: f.name, src: e.target.result }]);
            reader.readAsDataURL(f);
        });
    }

    function removeFile(i) {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
        setPreviews((prev) => prev.filter((_, idx) => idx !== i));
    }

    function onDrop(e) {
        e.preventDefault();
        dropRef.current.style.borderColor = "#e2e8f0";
        handleFiles(e.dataTransfer.files);
    }

    async function handleUpload() {
        if (!files.length) { addToast("Select at least one image.", "error"); return; }
        setLoading(true);
        let uploaded = 0;
        for (const file of files) {
            const fd = new FormData();
            fd.append("photo", file);
            fd.append("title", file.name.replace(/\.[^.]+$/, ""));
            try {
                const res = await fetch(`${API_URL}/admin/albums/${album.id}/photos`, { method: "POST", headers: authHeader(), body: fd });
                if (!res.ok) {
                    let d = {};
                    try { d = await res.json(); } catch (_) {}
                    addToast(d.message || `Failed to upload ${file.name}.`, "error");
                } else { uploaded++; }
            } catch (_) { addToast(`Network error uploading ${file.name}.`, "error"); }
            setProgress(Math.round(((files.indexOf(file) + 1) / files.length) * 100));
        }
        setLoading(false);
        if (uploaded > 0) {
            addToast(`${uploaded} photo${uploaded > 1 ? "s" : ""} uploaded.`);
            onUploaded();
            onClose();
        }
    }

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(10,31,82,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }} onClick={onClose}>
            <div style={{ width: "100%", maxWidth: 600, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", marginBlock: "auto" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ background: NAV, padding: "24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(245,197,24,0.07)" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                        <div>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD + "80" }}>Upload Photos</p>
                            <h2 style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>{album.title}</h2>
                        </div>
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                </div>
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Drop zone */}
                    <div ref={dropRef}
                        onDragOver={(e) => { e.preventDefault(); dropRef.current.style.borderColor = GOLD; }}
                        onDragLeave={() => { dropRef.current.style.borderColor = "#e2e8f0"; }}
                        onDrop={onDrop}
                        style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: "36px 24px", textAlign: "center", transition: "border-color .2s", cursor: "pointer", background: "#f8fafc" }}
                        onClick={() => document.getElementById("photo-file-input").click()}
                    >
                        <div style={{ width: 52, height: 52, background: "#f0f4ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: NAV }}>
                            {Ico.upload}
                        </div>
                        <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: NAV, fontFamily: SERIF }}>Drag & drop images here</p>
                        <p style={{ margin: "0 0 16px", fontSize: 12, color: "#94a3b8" }}>or click to browse · Max 5 MB per file · JPEG, PNG, WebP</p>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "9px 22px", background: NAV, color: GOLD, borderRadius: 8, cursor: "pointer" }}>
                            Browse Files
                        </span>
                        <input id="photo-file-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
                    </div>

                    {/* Preview grid */}
                    {previews.length > 0 && (
                        <div>
                            <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#64748b" }}>
                                {previews.length} file{previews.length > 1 ? "s" : ""} selected
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, maxHeight: 260, overflowY: "auto", padding: 2 }}>
                                {previews.map((p, i) => (
                                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                                        <img src={p.src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                        <button onClick={() => removeFile(i)}
                                            style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(220,38,38,0.85)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {Ico.close}
                                        </button>
                                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,31,82,0.7)", padding: "3px 5px" }}>
                                            <span style={{ fontSize: 9, color: "#fff", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress bar */}
                    {loading && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>Uploading…</span>
                                <span style={{ fontSize: 11, color: NAV, fontWeight: 800 }}>{progress}%</span>
                            </div>
                            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", background: GOLD, borderRadius: 99, width: progress + "%", transition: "width .3s" }} />
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ padding: "0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                    <button onClick={onClose} style={{ fontSize: 12, fontWeight: 700, padding: "12px 24px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                    <button onClick={handleUpload} disabled={loading || files.length === 0}
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, padding: "12px 28px", background: (loading || !files.length) ? "#e2e8f0" : NAV, color: (loading || !files.length) ? "#94a3b8" : GOLD, border: "none", borderRadius: 10, cursor: (loading || !files.length) ? "not-allowed" : "pointer" }}>
                        {loading ? "Uploading…" : <>{Ico.upload} Upload {files.length || ""} Photo{files.length !== 1 ? "s" : ""}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   PHOTO LIGHTBOX
══════════════════════════════════════════════════════ */
function PhotoLightbox({ photo, album, photos, onClose, onDeleted, addToast }) {
    const idx   = photos.findIndex((p) => p.id === photo.id);
    const [cur, setCur]         = useState(idx);
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        function onKey(e) {
            if (e.key === "ArrowRight") setCur((i) => (i + 1) % photos.length);
            if (e.key === "ArrowLeft")  setCur((i) => (i - 1 + photos.length) % photos.length);
            if (e.key === "Escape")     onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [photos]);

    const curPhoto = photos[cur];
    const photoSrc = curPhoto.url || `${API_URL.replace("/api", "")}/storage/gallery/${curPhoto.filename}`;

    async function doDelete() {
        setConfirm(false);
        try {
            const res = await fetch(`${API_URL}/admin/albums/${album.id}/photos/${curPhoto.id}`, { method: "DELETE", headers: authHeader() });
            if (!res.ok) throw new Error("Delete failed.");
            addToast("Photo deleted.");
            onDeleted(curPhoto.id);
            if (photos.length <= 1) { onClose(); return; }
            setCur((i) => Math.max(0, i - 1));
        } catch (err) { addToast(err.message || "Failed to delete.", "error"); }
    }

    return (
        <>
            <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(10,31,82,0.96)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={onClose}>

                {/* Top bar */}
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: NAV, borderBottom: `2px solid ${GOLD}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>{album.title}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{cur + 1} / {photos.length}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setConfirm(true)}
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, padding: "7px 14px", background: "rgba(220,38,38,0.15)", border: "1.5px solid rgba(220,38,38,0.4)", color: "#fca5a5", borderRadius: 8, cursor: "pointer" }}>
                            {Ico.trash} Delete
                        </button>
                        <a href={photoSrc} download target="_blank" rel="noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, padding: "7px 14px", background: "rgba(245,197,24,0.12)", border: "1.5px solid rgba(245,197,24,0.3)", color: GOLD, borderRadius: 8, textDecoration: "none" }}>
                            {Ico.download} Download
                        </a>
                        <button onClick={onClose}
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, padding: "7px 14px", background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 8, cursor: "pointer" }}>
                            {Ico.close} Close
                        </button>
                    </div>
                </div>

                {/* Image area */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "70px 80px 80px", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
                    <img src={photoSrc} alt={curPhoto.caption || curPhoto.title}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4 }}
                        onError={e => { e.target.style.opacity = "0.2"; }}
                    />
                </div>

                {/* Nav arrows */}
                {photos.length > 1 && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); setCur((i) => (i - 1 + photos.length) % photos.length); }}
                            style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", background: GOLD, border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", color: NAV, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                            {Ico.chevLeft}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setCur((i) => (i + 1) % photos.length); }}
                            style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", background: GOLD, border: "none", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", color: NAV, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                            {Ico.chevRight}
                        </button>
                    </>
                )}

                {/* Caption */}
                {(curPhoto.caption || curPhoto.title) && (
                    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,31,82,0.85)", padding: "12px 24px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: SERIF }}>{curPhoto.caption || curPhoto.title}</p>
                    </div>
                )}
            </div>

            {confirm && (
                <ConfirmModal
                    title="Delete Photo"
                    message="Permanently delete this photo? This cannot be undone."
                    confirmLabel="Delete"
                    confirmColor="#dc2626"
                    onConfirm={doDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

/* ══════════════════════════════════════════════════════
   ALBUM DETAIL VIEW
══════════════════════════════════════════════════════ */
function AlbumDetailView({ album: initialAlbum, onBack, onAlbumUpdated, addToast }) {
    const [album,        setAlbum]        = useState(initialAlbum);
    const [photos,       setPhotos]       = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [showUpload,   setShowUpload]   = useState(false);
    const [showEdit,     setShowEdit]     = useState(false);
    const [lightbox,     setLightbox]     = useState(null);
    const [confirmAlbum, setConfirmAlbum] = useState(false);

    const loadPhotos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/albums/${album.id}/photos`, { headers: authHeader() });
            const data = await res.json();
            setPhotos(Array.isArray(data) ? data : data.data || []);
        } catch (_) {}
        finally { setLoading(false); }
    }, [album.id]);

    useEffect(() => { loadPhotos(); }, [loadPhotos]);

    function handlePhotoDeleted(id) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setAlbum((a) => ({ ...a, photo_count: Math.max(0, (a.photo_count || 0) - 1) }));
    }

    function handleAlbumSaved(updated) {
        setAlbum(updated);
        onAlbumUpdated(updated);
    }

    async function deleteAlbum() {
        setConfirmAlbum(false);
        try {
            const res = await fetch(`${API_URL}/admin/albums/${album.id}`, { method: "DELETE", headers: authHeader() });
            if (!res.ok) throw new Error("Delete failed.");
            addToast(`"${album.title}" deleted.`);
            onBack(album.id);
        } catch (err) { addToast(err.message || "Failed to delete album.", "error"); }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Sub-header */}
            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <button onClick={() => onBack(null)}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {Ico.arrowLeft} Albums
                    </button>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Album</p>
                        <h1 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: SERIF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</h1>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => setShowEdit(true)}
                        style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 18px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer" }}>
                        {Ico.edit} Edit Album
                    </button>
                    <button onClick={() => setConfirmAlbum(true)}
                        style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 18px", background: "rgba(220,38,38,0.15)", color: "#fca5a5", border: "1.5px solid rgba(220,38,38,0.35)", borderRadius: 8, cursor: "pointer" }}>
                        {Ico.trash} Delete
                    </button>
                    <button onClick={() => setShowUpload(true)}
                        style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 18px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>
                        {Ico.plus} Upload Photos
                    </button>
                </div>
            </div>

            {/* Album info strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                {[
                    { label: "Photos",  value: photos.length,                bg: "#f0f4ff", color: NAV       },
                    { label: "Status",  value: album.is_active ? "Active" : "Inactive", bg: album.is_active ? "#dcfce7" : "#f1f5f9", color: album.is_active ? "#14532d" : "#475569" },
                    { label: "Created", value: fmtDate(album.created_at),    bg: "#fefce8", color: "#854d0e" },
                ].map((c) => (
                    <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: "16px 18px", border: "1.5px solid " + c.color + "30" }}>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: c.color, fontFamily: SERIF, lineHeight: 1 }}>{c.value}</p>
                        <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: c.color, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</p>
                    </div>
                ))}
                {album.description && (
                    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1.5px solid #f1f5f9", gridColumn: "span 2" }}>
                        <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>Description</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#334155", fontFamily: SERIF, lineHeight: 1.6 }}>{album.description}</p>
                    </div>
                )}
            </div>

            {/* Photos grid */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Photos</span>
                    {!loading && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{photos.length} total</span>}
                </div>

                {loading && (
                    <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ aspectRatio: "1", background: "#f1f5f9", borderRadius: 10 }} />
                        ))}
                    </div>
                )}

                {!loading && photos.length === 0 && (
                    <div style={{ padding: "60px 24px", textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, background: "#f0f4ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: NAV, opacity: 0.4 }}>
                            {Ico.imageLg}
                        </div>
                        <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: NAV, fontFamily: SERIF }}>No photos yet</p>
                        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#94a3b8" }}>Upload photos to this album to get started.</p>
                        <button onClick={() => setShowUpload(true)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, padding: "12px 24px", background: NAV, color: GOLD, border: "none", borderRadius: 10, cursor: "pointer" }}>
                            {Ico.plus} Upload Photos
                        </button>
                    </div>
                )}

                {!loading && photos.length > 0 && (
                    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                        {photos.map((photo) => {
                            const src = photo.url || `${API_URL.replace("/api", "")}/storage/gallery/${photo.filename}`;
                            return (
                                <button key={photo.id} onClick={() => setLightbox(photo)}
                                    style={{ all: "unset", cursor: "zoom-in", position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "#0a1f52", border: "1.5px solid #e2e8f0", display: "block" }}
                                    onMouseEnter={(e) => { e.currentTarget.querySelector("img").style.opacity = "0.5"; e.currentTarget.querySelector(".hov").style.opacity = "1"; }}
                                    onMouseLeave={(e) => { e.currentTarget.querySelector("img").style.opacity = "1"; e.currentTarget.querySelector(".hov").style.opacity = "0"; }}
                                >
                                    <img src={src} alt={photo.caption || photo.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity .2s" }}
                                        onError={(e) => { e.target.style.opacity = "0.2"; }}
                                    />
                                    <div className="hov" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, opacity: 0, transition: "opacity .2s" }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(245,197,24,0.9)", display: "flex", alignItems: "center", justifyContent: "center", color: NAV }}>
                                            {Ico.search}
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase" }}>View</span>
                                    </div>
                                    {photo.is_featured && (
                                        <div style={{ position: "absolute", top: 6, left: 6, background: GOLD, borderRadius: 4, padding: "2px 6px", display: "flex", alignItems: "center", gap: 3, color: NAV }}>
                                            {Ico.star}
                                            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.1em" }}>COVER</span>
                                        </div>
                                    )}
                                    {(photo.caption || photo.title) && (
                                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,31,82,0.75)", padding: "6px 8px" }}>
                                            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photo.caption || photo.title}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {/* Upload tile */}
                        <button onClick={() => setShowUpload(true)}
                            style={{ all: "unset", cursor: "pointer", aspectRatio: "1", borderRadius: 10, border: "2px dashed #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "#f8fafc", transition: "border-color .2s, background .2s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = "#fefce8"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                        >
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", color: NAV }}>
                                {Ico.plus}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Upload</span>
                        </button>
                    </div>
                )}
            </div>

            {showUpload  && <PhotoUploadModal album={album} onClose={() => setShowUpload(false)} onUploaded={loadPhotos} addToast={addToast} />}
            {showEdit    && <AlbumModal album={album} onClose={() => setShowEdit(false)} onSaved={handleAlbumSaved} addToast={addToast} />}
            {lightbox    && <PhotoLightbox photo={lightbox} album={album} photos={photos} onClose={() => setLightbox(null)} onDeleted={handlePhotoDeleted} addToast={addToast} />}
            {confirmAlbum && (
                <ConfirmModal
                    title="Delete Album"
                    message={`Delete "${album.title}" and all its photos? This cannot be undone.`}
                    confirmLabel="Delete Album"
                    confirmColor="#dc2626"
                    onConfirm={deleteAlbum}
                    onCancel={() => setConfirmAlbum(false)}
                />
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE — Album list
══════════════════════════════════════════════════════ */
export default function AdminGallery() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();
    const [albums,      setAlbums]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [showCreate,  setShowCreate]  = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/albums`, { headers: authHeader() });
            if (res.status === 401) { navigate("/admin/login"); return; }
            const data = await res.json();
            setAlbums(Array.isArray(data) ? data : data.data || []);
        } catch (_) {}
        finally { setLoading(false); }
    }, [navigate]);

    useEffect(() => { load(); }, [load]);

    function handleAlbumCreated(album) { setAlbums((prev) => [album, ...prev]); }
    function handleAlbumUpdated(updated) { setAlbums((prev) => prev.map((a) => a.id === updated.id ? updated : a)); }
    function handleBack(deletedId) {
        if (deletedId) setAlbums((prev) => prev.filter((a) => a.id !== deletedId));
        setActiveAlbum(null);
    }

    if (activeAlbum) {
        return (
            <>
                <AlbumDetailView album={activeAlbum} onBack={handleBack} onAlbumUpdated={handleAlbumUpdated} addToast={addToast} />
                <Toast toasts={toasts} />
            </>
        );
    }

    const total    = albums.length;
    const active   = albums.filter((a) => a.is_active).length;
    const inactive = albums.filter((a) => !a.is_active).length;
    const photos   = albums.reduce((sum, a) => sum + (a.photo_count || 0), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Page header */}
            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                    <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Photo Gallery</h1>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={load}
                        style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 18px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer" }}>
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Refresh
                    </button>
                    <button onClick={() => setShowCreate(true)}
                        style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 18px", background: GOLD, color: NAV, border: "none", borderRadius: 8, cursor: "pointer" }}>
                        {Ico.plus} New Album
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                {[
                    { label: "Albums",   value: total,    bg: "#f0f4ff", color: NAV,       border: NAV + "20"  },
                    { label: "Active",   value: active,   bg: "#dcfce7", color: "#14532d", border: "#16a34a40" },
                    { label: "Inactive", value: inactive, bg: "#f1f5f9", color: "#475569", border: "#94a3b840" },
                    { label: "Photos",   value: photos,   bg: "#fefce8", color: "#854d0e", border: "#fde04780" },
                ].map((c) => (
                    <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: "16px 18px", border: "1.5px solid " + c.border }}>
                        <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: c.color, fontFamily: SERIF, lineHeight: 1 }}>{c.value}</p>
                        <p style={{ margin: "6px 0 0", fontSize: 10, fontWeight: 700, color: c.color, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Album table */}
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 18, background: GOLD, borderRadius: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: NAV }}>Albums</span>
                    {!loading && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{albums.length} total</span>}
                </div>

                {loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, padding: 16 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #f1f5f9" }}>
                                <div style={{ height: 150, background: "#f1f5f9" }} />
                                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    <div style={{ height: 14, width: "60%", background: "#f1f5f9", borderRadius: 6 }} />
                                    <div style={{ height: 11, width: "80%", background: "#f1f5f9", borderRadius: 6 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && albums.length === 0 && (
                    <div style={{ padding: "72px 24px", textAlign: "center" }}>
                        <div style={{ width: 64, height: 64, background: "#f0f4ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: NAV, opacity: 0.4 }}>
                            {Ico.folder}
                        </div>
                        <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: NAV, fontFamily: SERIF }}>No albums yet</p>
                        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94a3b8" }}>Create your first album to start uploading photos.</p>
                        <button onClick={() => setShowCreate(true)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, padding: "12px 28px", background: NAV, color: GOLD, border: "none", borderRadius: 10, cursor: "pointer" }}>
                            {Ico.plus} Create First Album
                        </button>
                    </div>
                )}

                {!loading && albums.length > 0 && (
                    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                        {albums.map((album) => {
                            const stCfg = STATUS_CFG[album.is_active ? 1 : 0];
                            const cover = album.cover_url || (album.cover_image ? `${API_URL.replace("/api", "")}/storage/${album.cover_image}` : null);
                            return (
                                <div key={album.id}
                                    style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e2e8f0", background: "#fff", transition: "transform .18s, box-shadow .18s", cursor: "pointer" }}
                                    onClick={() => setActiveAlbum(album)}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(10,31,82,0.14)"; e.currentTarget.style.borderColor = NAV; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                                >
                                    {/* Cover */}
                                    <div style={{ height: 150, background: NAV, position: "relative", overflow: "hidden" }}>
                                        {cover ? (
                                            <img src={cover} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.target.style.display = "none"; }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(245,197,24,0.2)" }}>
                                                {Ico.imageLg}
                                            </div>
                                        )}
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,31,82,0.6) 0%, transparent 60%)" }} />
                                        {/* Photo count */}
                                        <div style={{ position: "absolute", top: 10, right: 10, background: GOLD, padding: "3px 10px", borderRadius: 4 }}>
                                            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: NAV }}>{album.photo_count || 0} photos</span>
                                        </div>
                                        {/* Status */}
                                        <div style={{ position: "absolute", top: 10, left: 10, background: stCfg.bg, border: "1.5px solid " + stCfg.border, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: stCfg.dot }} />
                                            <span style={{ fontSize: 9, fontWeight: 800, color: stCfg.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stCfg.label}</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: "14px 16px", borderTop: `3px solid ${GOLD}` }}>
                                        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: NAV, fontFamily: SERIF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.title}</h3>
                                        <p style={{ margin: "0 0 10px", fontSize: 12, color: album.description ? "#64748b" : "#cbd5e1", fontStyle: album.description ? "normal" : "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {album.description || "No description"}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{fmtDate(album.created_at)}</span>
                                            <span style={{ fontSize: 11, fontWeight: 800, color: NAV, letterSpacing: "0.08em" }}>Open →</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showCreate && <AlbumModal onClose={() => setShowCreate(false)} onSaved={handleAlbumCreated} addToast={addToast} />}
            <Toast toasts={toasts} />
        </div>
    );
}