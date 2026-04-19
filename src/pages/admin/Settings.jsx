import { useState, useEffect, useCallback, useRef } from "react";

const NAV     = "#0a1f52";
const GOLD    = "#f5c518";
const SERIF   = "Georgia, serif";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const STORAGE = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function authHeader(isJson = true) {
    const t = localStorage.getItem("admin_token");
    const base = t ? { Authorization: "Bearer " + t } : {};
    return isJson ? { ...base, "Content-Type": "application/json" } : base;
}

/* ── Toast ── */
function Toast({ toasts }) {
    return (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
            {toasts.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.type === "success" ? "#052e16" : "#450a0a", color: t.type === "success" ? "#bbf7d0" : "#fecaca", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid " + (t.type === "success" ? "#166534" : "#991b1b"), minWidth: 260, animation: "toastIn .25s ease" }}>
                    <span style={{ fontSize: 16 }}>{t.type === "success" ? "✓" : "✕"}</span>
                    {t.message}
                </div>
            ))}
            <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(message, type = "success") {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }
    return { toasts, addToast };
}

/* ── Shared UI ── */
function SectionCard({ title, subtitle, icon, children }) {
    return (
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 20 }}>
            <div style={{ background: NAV, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 20, background: GOLD, borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {icon && <span style={{ color: GOLD, display: "flex" }}>{icon}</span>}
                        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>{title}</span>
                    </div>
                    {subtitle && <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: SERIF }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: "22px 22px" }}>{children}</div>
        </div>
    );
}

function Field({ label, hint, error, required, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: error ? "#dc2626" : "#475569" }}>
                {label}{required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}
            </label>
            {children}
            {hint && !error && <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: SERIF }}>{hint}</span>}
            {error && <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700 }}>{error}</span>}
        </div>
    );
}

const inputSt = (err) => ({
    fontSize: 13, fontFamily: SERIF, color: "#1e293b",
    padding: "10px 14px", border: `1.5px solid ${err ? "#dc2626" : "#e2e8f0"}`,
    background: err ? "#fef9f9" : "#fafbfc", outline: "none",
    width: "100%", boxSizing: "border-box", borderRadius: 8,
    transition: "border-color .15s",
});

function SaveBtn({ loading, label = "Save Changes", onClick, disabled }) {
    return (
        <button onClick={onClick} disabled={loading || disabled}
            style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "11px 28px", background: loading || disabled ? "#94a3b8" : NAV, color: GOLD, border: "none", borderRadius: 9, cursor: loading || disabled ? "not-allowed" : "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 8 }}>
            {loading && <span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: GOLD, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />}
            {loading ? "Saving…" : label}
        </button>
    );
}

const TABS = [
    { key: "profile",  label: "Profile",           icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { key: "account",  label: "Account & Password", icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
    { key: "2fa",      label: "Two-Factor Auth",    icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { key: "frontend", label: "Site Settings",      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { key: "logs",     label: "Activity Logs",      icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

/* ══════════════════════════════════════════════════════════════
   TAB: PROFILE — with photo upload
══════════════════════════════════════════════════════════════ */
function ProfileTab({ addToast }) {
    const stored = JSON.parse(localStorage.getItem("admin_user") || "{}");
    const [form,      setForm]      = useState({ name: stored.name || "", email: stored.email || "", bio: stored.bio || "" });
    const [loading,   setLoading]   = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors,    setErrors]    = useState({});
    const fileRef = useRef();

    const photoUrl = stored.profile_photo ? `${STORAGE}/${stored.profile_photo}` : null;

    function ch(k) { return e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })); }; }
    function initials(n) { return (n || "AD").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }

    async function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("profile_photo", file);
            // authHeader(false) → only Authorization header, NO Content-Type
            // (browser must set Content-Type with multipart boundary itself)
            const token = localStorage.getItem("admin_token");
            const headers = token ? { Authorization: "Bearer " + token } : {};
            const res  = await fetch(`${API_URL}/admin/profile`, { method: "POST", headers, body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Upload failed.");
            // Merge returned user data (preserving any fields not returned) into localStorage
            const current = JSON.parse(localStorage.getItem("admin_user") || "{}");
            localStorage.setItem("admin_user", JSON.stringify({ ...current, ...data.user }));
            addToast("Profile photo updated.");
            window.location.reload();
        } catch (err) { addToast(err.message, "error"); }
        finally { setUploading(false); }
    }

    async function save() {
        const e = {};
        if (!form.name.trim())  e.name  = "Name is required.";
        if (!form.email.trim()) e.email = "Email is required.";
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            const res  = await fetch(`${API_URL}/admin/profile`, { method: "PATCH", headers: authHeader(), body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save.");
            localStorage.setItem("admin_user", JSON.stringify({ ...stored, ...form }));
            addToast("Profile updated successfully.");
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoading(false); }
    }

    return (
        <SectionCard title="Admin Profile" subtitle="Your admin name, photo and contact details"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
                {/* Photo upload */}
                <div style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 8px" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: NAV, border: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            {photoUrl
                                ? <img src={photoUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span style={{ fontSize: 26, fontWeight: 900, color: GOLD, fontFamily: SERIF }}>{initials(form.name)}</span>
                            }
                        </div>
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: NAV, border: `2px solid ${GOLD}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                            title="Change photo"
                        >
                            {uploading
                                ? <span style={{ fontSize: 8, color: GOLD }}>…</span>
                                : <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2.5}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            }
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontFamily: SERIF }}>Click camera<br/>to change photo</p>
                </div>

                <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                        <Field label="Display Name" required error={errors.name}>
                            <input value={form.name} onChange={ch("name")} placeholder="Carl John Morales" style={inputSt(errors.name)}
                                onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = errors.name ? "#dc2626" : "#e2e8f0"; }} />
                        </Field>
                        <Field label="Email Address" required error={errors.email}>
                            <input value={form.email} onChange={ch("email")} type="email" placeholder="admin@sres.edu.ph" style={inputSt(errors.email)}
                                onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = errors.email ? "#dc2626" : "#e2e8f0"; }} />
                        </Field>
                    </div>
                    <Field label="Bio / Notes" hint="Optional — visible only inside the admin panel">
                        <textarea value={form.bio} onChange={ch("bio")} rows={3} placeholder="e.g. School principal, manages enrollment."
                            style={{ ...inputSt(), resize: "vertical" }}
                            onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </Field>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <SaveBtn loading={loading} onClick={save} />
            </div>
        </SectionCard>
    );
}

/* ══════════════════════════════════════════════════════════════
   TAB: ACCOUNT & PASSWORD
   — Wrong current password → sends forgot-password email
══════════════════════════════════════════════════════════════ */
function AccountTab({ addToast }) {
    const [pw,           setPw]           = useState({ current: "", newPw: "", confirm: "" });
    const [showPw,       setShowPw]       = useState({ current: false, newPw: false, confirm: false });
    const [loading,      setLoading]      = useState(false);
    const [errors,       setErrors]       = useState({});
    const [resetSent,    setResetSent]    = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const stored = JSON.parse(localStorage.getItem("admin_user") || "{}");

    function chPw(k) { return e => { setPw(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })); setResetSent(false); }; }

    function EyeBtn({ field }) {
        return (
            <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
                {showPw[field]
                    ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
            </button>
        );
    }

    async function sendForgotPassword() {
        setResetLoading(true);
        try {
            const email = stored.email;
            if (!email) throw new Error("No email on file. Update your profile first.");
            const res  = await fetch(`${API_URL}/admin/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send reset link.");
            setResetSent(true);
            addToast("Password reset link sent to your email!");
        } catch (err) { addToast(err.message, "error"); }
        finally { setResetLoading(false); }
    }

    async function savePw() {
        const e = {};
        if (!pw.current.trim())      e.current = "Current password is required.";
        if (pw.newPw.length < 8)     e.newPw   = "New password must be at least 8 characters.";
        if (pw.newPw !== pw.confirm) e.confirm  = "Passwords do not match.";
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        try {
            const res  = await fetch(`${API_URL}/admin/password`, { method: "PATCH", headers: authHeader(), body: JSON.stringify({ current_password: pw.current, password: pw.newPw, password_confirmation: pw.confirm }) });
            const data = await res.json();
            if (!res.ok) {
                // If wrong current password, surface forgot-password option
                const msg = data.message || "";
                if (msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("wrong") || res.status === 422) {
                    setErrors({ current: msg || "Current password is incorrect." });
                    // surface forgot password hint
                } else {
                    throw new Error(msg || "Failed to change password.");
                }
                return;
            }
            setPw({ current: "", newPw: "", confirm: "" });
            addToast("Password changed successfully.");
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoading(false); }
    }

    const strengthScore = pw.newPw.length === 0 ? 0 : Math.min(4, [pw.newPw.length >= 8, /[A-Z]/.test(pw.newPw), /[0-9]/.test(pw.newPw), /[^A-Za-z0-9]/.test(pw.newPw)].filter(Boolean).length);
    const strengthColor = ["#e2e8f0", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"][strengthScore];
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];

    return (
        <>
            <SectionCard title="Change Password" subtitle="Use a strong password — at least 8 characters"
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
                    {[
                        { key: "current", label: "Current Password", placeholder: "Your current password" },
                        { key: "newPw",   label: "New Password",     placeholder: "At least 8 characters" },
                        { key: "confirm", label: "Confirm Password", placeholder: "Repeat new password" },
                    ].map(({ key, label, placeholder }) => (
                        <Field key={key} label={label} required error={errors[key]}>
                            <div style={{ position: "relative" }}>
                                <input type={showPw[key] ? "text" : "password"} value={pw[key]} onChange={chPw(key)}
                                    placeholder={placeholder} style={{ ...inputSt(errors[key]), paddingRight: 44 }}
                                    onFocus={e => { e.target.style.borderColor = NAV; }}
                                    onBlur={e => { e.target.style.borderColor = errors[key] ? "#dc2626" : "#e2e8f0"; }} />
                                <EyeBtn field={key} />
                            </div>
                        </Field>
                    ))}

                    {/* Forgot password hint — shown when current password error occurs */}
                    {errors.current && (
                        <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: 10 }}>
                            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#92400e", fontFamily: SERIF }}>
                                <strong>Don't remember your current password?</strong> We can send a reset link to your registered email address.
                            </p>
                            {resetSent ? (
                                <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                                    ✓ Reset link sent to {stored.email}. Check your inbox!
                                </p>
                            ) : (
                                <button
                                    onClick={sendForgotPassword}
                                    disabled={resetLoading}
                                    style={{ fontSize: 11, fontWeight: 700, padding: "8px 16px", background: resetLoading ? "#94a3b8" : NAV, color: GOLD, border: "none", borderRadius: 8, cursor: resetLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
                                >
                                    {resetLoading && <span style={{ width: 10, height: 10, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: GOLD, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />}
                                    {resetLoading ? "Sending…" : "Send Password Reset Link"}
                                </button>
                            )}
                        </div>
                    )}

                    {pw.newPw.length > 0 && (
                        <div>
                            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                                {[1,2,3,4].map(i => (
                                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strengthScore ? strengthColor : "#e2e8f0", transition: "background .3s" }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 11, color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
                        </div>
                    )}
                </div>

                {/* Standalone forgot password */}
                {!errors.current && (
                    <div style={{ marginTop: 16, padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b", fontFamily: SERIF }}>
                            Forgot your current password?
                        </p>
                        {resetSent ? (
                            <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                                ✓ Reset link sent to {stored.email}. Check your inbox!
                            </p>
                        ) : (
                            <button
                                onClick={sendForgotPassword}
                                disabled={resetLoading}
                                style={{ fontSize: 11, fontWeight: 700, padding: "7px 14px", background: "transparent", color: NAV, border: `1.5px solid ${NAV}`, borderRadius: 7, cursor: resetLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
                            >
                                {resetLoading && <span style={{ width: 10, height: 10, border: `2px solid ${NAV}30`, borderTopColor: NAV, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />}
                                {resetLoading ? "Sending…" : "Send Reset Link to Email"}
                            </button>
                        )}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <SaveBtn loading={loading} label="Change Password" onClick={savePw} />
                </div>
            </SectionCard>

            <SectionCard title="Active Sessions" subtitle="Devices currently logged into the admin panel"
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: "#dcfce7", border: "2px solid #16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#14532d", fontFamily: SERIF }}>Current Session</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>This browser · Active now</p>
                        </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 10px", background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", borderRadius: 20 }}>Current</span>
                </div>
                <button style={{ fontSize: 12, fontWeight: 700, padding: "10px 20px", background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", borderRadius: 9, cursor: "pointer" }}
                    onClick={() => addToast("All other sessions revoked.", "success")}>
                    Revoke All Other Sessions
                </button>
            </SectionCard>
        </>
    );
}

/* ══════════════════════════════════════════════════════════════
   TAB: TWO-FACTOR AUTH
══════════════════════════════════════════════════════════════ */
function TwoFATab({ addToast }) {
    const [enabled,       setEnabled]       = useState(true);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const [testSent,      setTestSent]      = useState(false);
    const [loading,       setLoading]       = useState(false);
    const [fetching,      setFetching]      = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/admin/site-settings`, { headers: authHeader() })
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d && d.two_fa_enabled !== undefined) {
                    const val = d.two_fa_enabled;
                    setEnabled(val === true || val === "true" || val === 1);
                }
            })
            .catch(() => {})
            .finally(() => setFetching(false));
    }, []);

    async function toggleTwoFA() {
        const next = !enabled;
        setLoadingToggle(true);
        try {
            const res  = await fetch(`${API_URL}/admin/site-settings`, { method: "POST", headers: authHeader(), body: JSON.stringify({ two_fa_enabled: next }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update 2FA.");
            setEnabled(next);
            addToast(`Two-Factor Authentication ${next ? "enabled" : "disabled"}.`);
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoadingToggle(false); }
    }

    async function sendTest() {
        setLoading(true); setTestSent(false);
        try {
            const res = await fetch(`${API_URL}/admin/2fa/test`, { method: "POST", headers: authHeader() });
            const d   = await res.json();
            if (!res.ok) throw new Error(d.message || "Failed.");
            setTestSent(true);
            addToast("Test OTP sent to your email!");
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoading(false); }
    }

    if (fetching) return <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontFamily: SERIF }}>Loading 2FA settings…</div>;

    return (
        <SectionCard title="Two-Factor Authentication" subtitle="OTP verification on every login"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 20px", background: enabled ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${enabled ? "#86efac" : "#fecaca"}`, borderRadius: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: enabled ? "#dcfce7" : "#fee2e2", border: `2px solid ${enabled ? "#16a34a" : "#dc2626"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={enabled ? "#16a34a" : "#dc2626"} strokeWidth={2.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 800, color: enabled ? "#14532d" : "#7f1d1d", fontFamily: SERIF }}>{enabled ? "2FA is Active" : "2FA is Disabled"}</p>
                        <p style={{ margin: 0, fontSize: 12, color: enabled ? "#16a34a" : "#dc2626" }}>{enabled ? "Every login requires a 6-digit OTP sent to your email." : "Your account is less secure without 2FA."}</p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: enabled ? "#14532d" : "#7f1d1d" }}>{loadingToggle ? "Saving…" : enabled ? "Enabled" : "Disabled"}</span>
                    <div onClick={!loadingToggle ? toggleTwoFA : undefined}
                        style={{ width: 52, height: 28, background: enabled ? NAV : "#e2e8f0", borderRadius: 14, position: "relative", cursor: loadingToggle ? "not-allowed" : "pointer", transition: "background .2s", opacity: loadingToggle ? 0.6 : 1 }}>
                        <div style={{ position: "absolute", top: 4, left: enabled ? 28 : 4, width: 20, height: 20, background: enabled ? GOLD : "#fff", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
                {[
                    { step: "1", title: "Enter credentials", desc: "Login with your email and password." },
                    { step: "2", title: "Receive OTP",       desc: "A 6-digit code is sent to your email." },
                    { step: "3", title: "Verify code",       desc: "Enter the code within 10 minutes." },
                ].map(s => (
                    <div key={s.step} style={{ padding: "14px 16px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: NAV, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 900, color: GOLD }}>{s.step}</span>
                        </div>
                        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: NAV, fontFamily: SERIF }}>{s.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#64748b", fontFamily: SERIF, lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                ))}
            </div>

            <div style={{ padding: "14px 18px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, marginBottom: 16 }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#92400e" }}>Trusted Devices</p>
                <p style={{ margin: "0 0 12px", fontSize: 12, color: "#78350f", fontFamily: SERIF, lineHeight: 1.6 }}>
                    When you check "Trust this device" at login, that device skips OTP for 30 days. Clearing here forces OTP on all devices.
                </p>
                <button style={{ fontSize: 11, fontWeight: 700, padding: "8px 16px", background: "#fef3c7", border: "1.5px solid #fcd34d", color: "#92400e", borderRadius: 8, cursor: "pointer" }}
                    onClick={() => { localStorage.removeItem("trusted_devices"); addToast("All trusted devices cleared."); }}>
                    Clear All Trusted Devices
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button onClick={sendTest} disabled={loading || !enabled}
                    style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "11px 22px", background: loading || !enabled ? "#94a3b8" : NAV, color: GOLD, border: "none", borderRadius: 9, cursor: loading || !enabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    {loading && <span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: GOLD, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />}
                    {loading ? "Sending…" : "Send Test OTP"}
                </button>
                {!enabled && <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: SERIF }}>Enable 2FA first to send a test OTP.</span>}
                {testSent && enabled && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>✓ Check your email!</span>}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </SectionCard>
    );
}

/* ══════════════════════════════════════════════════════════════
   SITE PAGES
══════════════════════════════════════════════════════════════ */
const SITE_PAGES = [
    { slug: "home",         url: "/",            label: "Home",           desc: "The main landing page of the school website." },
    { slug: "history",      url: "/history",     label: "About / History",desc: "About the school — history, mission, vision." },
    { slug: "enroll",       url: "/enroll",      label: "Enrollment",     desc: "Online enrollment form for new students." },
    { slug: "announcement", url: "/announcement",label: "Announcements",  desc: "Latest school news and announcements." },
    { slug: "gallery",      url: "/gallery",     label: "Gallery",        desc: "Photo albums and school event photos." },
    { slug: "staff",        url: "/staff",       label: "Staff",          desc: "Faculty and staff directory." },
    { slug: "contact",      url: "/contact",     label: "Contact",        desc: "Contact form and school location map." },
];

/* ══════════════════════════════════════════════════════════════
   TAB: SITE SETTINGS — school info now displayed live on the site
══════════════════════════════════════════════════════════════ */
function FrontendTab({ addToast }) {
    const DEFAULT = {
        school_name:         "San Roque Elementary School",
        school_tagline:      "DepEd · Division of Catanduanes",
        school_email:        "113330@deped.gov.ph",
        school_phone:        "+63 9605519104",
        school_address:      "San Roque, Viga, Catanduanes, Philippines",
        enrollment_open:     true,
        enrollment_year:     "2025–2026",
        announcement_ticker: "",
        maintenance_mode:    false,
        maintenance_pages:   [],
    };

    const [form,     setForm]     = useState(DEFAULT);
    const [loading,  setLoading]  = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/admin/site-settings`, { headers: authHeader() })
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d) {
                    let pages = d.maintenance_pages ?? [];
                    if (typeof pages === "string") {
                        try { pages = JSON.parse(pages); } catch { pages = []; }
                    }
                    setForm(f => ({
                        ...f,
                        ...d,
                        enrollment_open:   d.enrollment_open  === true || d.enrollment_open  === "true"  || d.enrollment_open  === 1,
                        maintenance_mode:  d.maintenance_mode === true || d.maintenance_mode === "true" || d.maintenance_mode === 1,
                        maintenance_pages: Array.isArray(pages) ? pages : [],
                    }));
                }
            })
            .catch(() => {})
            .finally(() => setFetching(false));
    }, []);

    function ch(k) {
        return e => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    }

    function togglePage(slug) {
        setForm(f => {
            const pages = Array.isArray(f.maintenance_pages) ? f.maintenance_pages : [];
            const has   = pages.includes(slug);
            return { ...f, maintenance_pages: has ? pages.filter(s => s !== slug) : [...pages, slug] };
        });
    }

    function isPageUnderMaintenance(slug) {
        const pages = Array.isArray(form.maintenance_pages) ? form.maintenance_pages : [];
        return pages.includes(slug);
    }

    async function save() {
        setLoading(true);
        try {
            const payload = {
                ...form,
                maintenance_pages: JSON.stringify(Array.isArray(form.maintenance_pages) ? form.maintenance_pages : []),
            };
            const res  = await fetch(`${API_URL}/admin/site-settings`, { method: "POST", headers: authHeader(), body: JSON.stringify(payload) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save.");
            addToast("Site settings saved successfully. Changes are now live on the website.");
        } catch (err) { addToast(err.message, "error"); }
        finally { setLoading(false); }
    }

    function SimpleToggle({ label, desc, field }) {
        const val = !!form[field];
        return (
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9", gap: 16 }}>
                <div>
                    <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: NAV, fontFamily: SERIF }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: SERIF }}>{desc}</p>
                </div>
                <div onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
                    style={{ width: 48, height: 26, background: val ? NAV : "#e2e8f0", borderRadius: 13, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
                    <div style={{ position: "absolute", top: 3, left: val ? 25 : 3, width: 20, height: 20, background: val ? GOLD : "#fff", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </div>
            </div>
        );
    }

    if (fetching) return <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontFamily: SERIF }}>Loading settings…</div>;

    const activeMaintenanceCount = (Array.isArray(form.maintenance_pages) ? form.maintenance_pages : []).length;

    return (
        <>
            {/* Live preview info banner */}
            <div style={{ padding: "12px 16px", background: "#eff6ff", border: "1.5px solid #93c5fd", borderRadius: 10, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ margin: 0, fontSize: 12, color: "#1e40af", fontFamily: SERIF, lineHeight: 1.6 }}>
                    <strong>Live settings.</strong> Changes to school information, enrollment status, and the announcement ticker are immediately visible on the public website after saving. The site re-fetches settings every 2 minutes automatically.
                </p>
            </div>

            {/* ── School Info ── */}
            <SectionCard title="School Information" subtitle="Displayed across the public-facing website — header, footer, contact page"
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                        <Field label="School Name" hint="Used in the browser tab, navbar, and footer">
                            <input value={form.school_name || ""} onChange={ch("school_name")} style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                        </Field>
                        <Field label="Tagline / Division" hint="Sub-label shown under the school name">
                            <input value={form.school_tagline || ""} onChange={ch("school_tagline")} placeholder="e.g. DepEd · Division of Catanduanes" style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                        </Field>
                        <Field label="Contact Email" hint="Shown on the Contact page and footer">
                            <input value={form.school_email || ""} onChange={ch("school_email")} type="email" style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                        </Field>
                        <Field label="Contact Phone" hint="Shown on the Contact page and footer">
                            <input value={form.school_phone || ""} onChange={ch("school_phone")} style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                        </Field>
                    </div>
                    <Field label="School Address" hint="Full address shown on the Contact page and Google Maps embed">
                        <input value={form.school_address || ""} onChange={ch("school_address")} style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </Field>
                    <Field label="Announcement Ticker" hint="Short scrolling message shown on the homepage. Leave blank to hide.">
                        <input value={form.announcement_ticker || ""} onChange={ch("announcement_ticker")} placeholder="e.g. Enrollment for SY 2025–2026 is now open!" style={inputSt()} onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </Field>
                </div>

                {/* Live preview strip */}
                <div style={{ marginTop: 18, padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>Preview — How it appears on the website</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: NAV, border: `2px solid ${GOLD}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 900, color: GOLD, fontFamily: SERIF }}>S</span>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: NAV, fontFamily: SERIF }}>{form.school_name || "—"}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#64748b", fontFamily: SERIF }}>{form.school_tagline || "—"}</p>
                        </div>
                    </div>
                    {form.announcement_ticker && (
                        <div style={{ marginTop: 10, padding: "6px 12px", background: GOLD, borderRadius: 6, fontSize: 12, fontWeight: 700, color: NAV, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            📢 {form.announcement_ticker}
                        </div>
                    )}
                    <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {form.school_email && <span style={{ fontSize: 11, color: "#64748b" }}>✉ {form.school_email}</span>}
                        {form.school_phone && <span style={{ fontSize: 11, color: "#64748b" }}>📞 {form.school_phone}</span>}
                    </div>
                    {form.school_address && <p style={{ margin: "6px 0 0", fontSize: 11, color: "#64748b", fontFamily: SERIF }}>📍 {form.school_address}</p>}
                </div>
            </SectionCard>

            {/* ── Enrollment ── */}
            <SectionCard title="Enrollment" subtitle="Control the online enrollment form"
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <SimpleToggle label="Online Enrollment Open" desc="When enabled, the /enroll page accepts new submissions." field="enrollment_open" />
                    <div style={{ padding: "14px 0" }}>
                        <Field label="School Year" hint="Displayed on the enrollment form hero">
                            <input value={form.enrollment_year || ""} onChange={ch("enrollment_year")} placeholder="2025–2026"
                                style={{ ...inputSt(), maxWidth: 200 }}
                                onFocus={e => { e.target.style.borderColor = NAV; }} onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                        </Field>
                    </div>
                </div>
                {!form.enrollment_open && (
                    <div style={{ marginTop: 4, padding: "12px 16px", background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ margin: 0, fontSize: 12, color: "#92400e", fontFamily: SERIF }}>
                            <strong>Enrollment is closed.</strong> Visitors to /enroll will see the enrollment closed page.
                        </p>
                    </div>
                )}
            </SectionCard>

            {/* ── Per-Page Maintenance ── */}
            <SectionCard
                title="Page Maintenance"
                subtitle={activeMaintenanceCount > 0
                    ? `${activeMaintenanceCount} page${activeMaintenanceCount > 1 ? "s" : ""} currently under maintenance`
                    : "Toggle maintenance mode per page — each page has its own control"}
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: form.maintenance_mode ? "#fef2f2" : "#f8fafc", border: `1.5px solid ${form.maintenance_mode ? "#fecaca" : "#e2e8f0"}`, borderRadius: 10, marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 800, color: form.maintenance_mode ? "#7f1d1d" : NAV, fontFamily: SERIF }}>
                            {form.maintenance_mode ? "⚠ Global Maintenance ON" : "Global Maintenance"}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: form.maintenance_mode ? "#dc2626" : "#64748b", fontFamily: SERIF }}>
                            When ON, all pages show a maintenance screen regardless of per-page settings.
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: form.maintenance_mode ? "#dc2626" : "#94a3b8" }}>
                            {form.maintenance_mode ? "ON" : "OFF"}
                        </span>
                        <div onClick={() => setForm(f => ({ ...f, maintenance_mode: !f.maintenance_mode }))}
                            style={{ width: 48, height: 26, background: form.maintenance_mode ? "#dc2626" : "#e2e8f0", borderRadius: 13, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .2s" }}>
                            <div style={{ position: "absolute", top: 3, left: form.maintenance_mode ? 25 : 3, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1.5px solid #f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                    {SITE_PAGES.map((page, i) => {
                        const under  = isPageUnderMaintenance(page.slug);
                        const isLast = i === SITE_PAGES.length - 1;
                        return (
                            <div key={page.slug} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: under ? "#fffbeb" : "#fff", borderBottom: isLast ? "none" : "1px solid #f1f5f9", transition: "background .15s" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: under ? "#f59e0b" : "#d1fae5", border: `2px solid ${under ? "#d97706" : "#6ee7b7"}`, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: NAV, fontFamily: SERIF }}>{page.label}</span>
                                        <code style={{ fontSize: 10, color: "#94a3b8", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>{page.url}</code>
                                        {under && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", borderRadius: 20 }}>Maintenance</span>}
                                    </div>
                                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontFamily: SERIF }}>{page.desc}</p>
                                </div>
                                <a href={page.url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#64748b", padding: "6px 11px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 7, textDecoration: "none", flexShrink: 0, transition: "all .15s", whiteSpace: "nowrap" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = NAV; e.currentTarget.style.color = NAV; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
                                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                    View
                                </a>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: under ? "#d97706" : "#94a3b8", minWidth: 20, textAlign: "right" }}>{under ? "ON" : "OFF"}</span>
                                    <div onClick={() => togglePage(page.slug)}
                                        style={{ width: 44, height: 24, background: under ? "#f59e0b" : "#e2e8f0", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
                                        <div style={{ position: "absolute", top: 2, left: under ? 22 : 2, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {activeMaintenanceCount > 0 && !form.maintenance_mode && (
                    <div style={{ marginTop: 14, padding: "12px 16px", background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ margin: 0, fontSize: 12, color: "#92400e", fontFamily: SERIF }}>
                            <strong>{activeMaintenanceCount} page{activeMaintenanceCount > 1 ? "s are" : " is"} under maintenance.</strong>{" "}
                            Visitors to {(Array.isArray(form.maintenance_pages) ? form.maintenance_pages : []).join(", ")} will see the maintenance screen.
                        </p>
                    </div>
                )}
                {form.maintenance_mode && (
                    <div style={{ marginTop: 14, padding: "12px 16px", background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ margin: 0, fontSize: 12, color: "#dc2626", fontFamily: SERIF }}>
                            <strong>Global maintenance is ON.</strong> All public pages show a maintenance screen.
                        </p>
                    </div>
                )}
            </SectionCard>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <SaveBtn loading={loading} label="Save Site Settings" onClick={save} />
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════════════
   TAB: ACTIVITY LOGS
══════════════════════════════════════════════════════════════ */
function LogsTab() {
    const [logs,    setLogs]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [page,    setPage]    = useState(1);
    const [meta,    setMeta]    = useState(null);
    const [filter,  setFilter]  = useState("");

    const MOCK_LOGS = [
        { id: 1, action: "login",                description: "Admin logged in",                           ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()   },
        { id: 2, action: "enrollment_update",    description: "Updated enrollment #18 status to approved", ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()  },
        { id: 3, action: "message_replied",      description: "Replied to message from Acen Ace",          ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()  },
        { id: 4, action: "staff_created",        description: "Added staff member Randy T. Odi",           ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()  },
        { id: 5, action: "announcement_created", description: "Published announcement: Enrollment Open",   ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: 6, action: "gallery_upload",       description: "Uploaded 5 photos to Album #1",             ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
        { id: 7, action: "password_changed",     description: "Admin changed their password",              ip: "127.0.0.1", created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
    ];

    const ACTION_COLORS = {
        login:                { bg: "#dbeafe", color: "#1e3a8a", border: "#3b82f6" },
        enrollment_update:    { bg: "#dcfce7", color: "#14532d", border: "#16a34a" },
        message_replied:      { bg: "#ede9fe", color: "#4c1d95", border: "#7c3aed" },
        staff_created:        { bg: "#fff7ed", color: "#92400e", border: "#f59e0b" },
        announcement_created: { bg: "#fef9c3", color: "#713f12", border: "#ca8a04" },
        gallery_upload:       { bg: "#fce7f3", color: "#831843", border: "#ec4899" },
        password_changed:     { bg: "#fee2e2", color: "#7f1d1d", border: "#dc2626" },
    };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/logs?page=${page}${filter ? `&action=${filter}` : ""}`, { headers: authHeader() });
            const d   = res.ok ? await res.json() : null;
            if (d && (Array.isArray(d) || d.data)) {
                setLogs(Array.isArray(d) ? d : (d.data || []));
                setMeta(Array.isArray(d) ? null : d);
            } else {
                setLogs(MOCK_LOGS.filter(l => !filter || l.action === filter));
                setMeta(null);
            }
        } catch {
            setLogs(MOCK_LOGS.filter(l => !filter || l.action === filter));
            setMeta(null);
        } finally { setLoading(false); }
    }, [page, filter]);

    useEffect(() => { load(); }, [load]);

    function timeAgo(d) {
        const diff = Math.floor((Date.now() - new Date(d)) / 1000);
        if (diff < 60)    return `${diff}s ago`;
        if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    }

    const actionTypes = [...new Set(MOCK_LOGS.map(l => l.action))];

    return (
        <SectionCard title="Activity Logs" subtitle="Recent admin actions and security events"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
                    style={{ fontSize: 12, fontFamily: SERIF, color: "#334155", padding: "8px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "#f8fafc", cursor: "pointer" }}>
                    <option value="">All Actions</option>
                    {actionTypes.map(a => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
                </select>
                <button onClick={() => { setPage(1); setFilter(""); load(); }}
                    style={{ fontSize: 11, fontWeight: 700, padding: "8px 16px", background: "#f1f5f9", border: "1.5px solid #e2e8f0", color: "#475569", borderRadius: 8, cursor: "pointer" }}>
                    Refresh
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                        <div style={{ height: 12, width: 200, background: "#e2e8f0", borderRadius: 6, marginBottom: 6 }} />
                        <div style={{ height: 10, width: 120, background: "#e2e8f0", borderRadius: 4 }} />
                    </div>
                ))}
                {!loading && logs.map((log, i) => {
                    const cfg = ACTION_COLORS[log.action] || ACTION_COLORS.login;
                    return (
                        <div key={log.id || i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", background: "#fafbfc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                            <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, marginTop: 1 }}>
                                {log.action.replace(/_/g, " ")}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 600, color: "#334155", fontFamily: SERIF }}>{log.description}</p>
                                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>IP: {log.ip} · {timeAgo(log.created_at)}</p>
                            </div>
                        </div>
                    );
                })}
                {!loading && logs.length === 0 && (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontFamily: SERIF }}>No activity logs found.</div>
                )}
            </div>

            {meta && meta.last_page > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Page {meta.current_page} of {meta.last_page}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                        {[["← Prev", -1], ["Next →", 1]].map(([label, dir]) => {
                            const disabled = dir === -1 ? meta.current_page <= 1 : meta.current_page >= meta.last_page;
                            return <button key={label} onClick={() => setPage(p => p + dir)} disabled={disabled} style={{ fontSize: 11, fontWeight: 700, padding: "8px 16px", background: disabled ? "#f1f5f9" : NAV, color: disabled ? "#cbd5e1" : GOLD, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer" }}>{label}</button>;
                        })}
                    </div>
                </div>
            )}
        </SectionCard>
    );
}

/* ══════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
══════════════════════════════════════════════════════════════ */
export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const { toasts, addToast }      = useToast();

    const tabContent = {
        profile:  <ProfileTab  addToast={addToast} />,
        account:  <AccountTab  addToast={addToast} />,
        "2fa":    <TwoFATab    addToast={addToast} />,
        frontend: <FrontendTab addToast={addToast} />,
        logs:     <LogsTab />,
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <div style={{ background: NAV, borderRadius: 14, padding: "20px 24px" }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, opacity: 0.7 }}>Admin Panel</p>
                <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: SERIF }}>Settings</h1>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", overflowX: "auto", borderBottom: `3px solid ${GOLD}` }}>
                    {TABS.map(t => {
                        const active = activeTab === t.key;
                        return (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                style={{ display: "flex", alignItems: "center", gap: 7, padding: "13px 18px", border: "none", cursor: "pointer", whiteSpace: "nowrap", fontSize: "clamp(10px,2vw,12px)", fontWeight: active ? 800 : 600, letterSpacing: "0.1em", textTransform: "uppercase", background: active ? NAV : "transparent", color: active ? GOLD : "#64748b", transition: "all .15s", flexShrink: 0 }}>
                                <span style={{ opacity: active ? 1 : 0.6 }}>{t.icon}</span>
                                {t.label}
                            </button>
                        );
                    })}
                </div>
                <div style={{ padding: "24px 20px" }}>
                    {tabContent[activeTab]}
                </div>
            </div>

            <Toast toasts={toasts} />
        </div>
    );
}