import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const EyeIcon = ({ open }) => open ? (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

function StrengthBar({ password }) {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8)           score++;
    if (password.length >= 12)          score++;
    if (/[A-Z]/.test(password))         score++;
    if (/[0-9]/.test(password))         score++;
    if (/[^A-Za-z0-9]/.test(password))  score++;

    const colors = ["#e8e4da", "#c0392b", "#e67e00", "#f0b429", "#2ecc71", "#27ae60"];
    const labels = ["", "Too weak", "Weak", "Fair", "Good", "Strong"];

    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map(function(i) {
                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1, height: 3,
                                background: i <= score ? colors[score] : "#e8e4da",
                                transition: "background .2s",
                            }}
                        />
                    );
                })}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: colors[score] }}>
                {labels[score]}
            </span>
        </div>
    );
}

function Field({ label, htmlFor, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor={htmlFor} style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV }}>
                {label}
            </label>
            {children}
        </div>
    );
}

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate       = useNavigate();
    const token          = searchParams.get("token") || "";

    // Clear all lockout state on mount so admin can sign in after reset
    useEffect(function() {
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("locked_until");
    }, []);

    const [form, setForm]       = useState({ password: "", password_confirmation: "" });
    const [showPw, setShowPw]   = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone]       = useState(false);

    const inputStyle = {
        fontSize: 13.5, fontFamily: SERIF, color: "#1a1a1a",
        padding: "11px 14px", border: "1.5px solid #c8c4b8",
        background: "#fdfcf8", outline: "none",
        width: "100%", boxSizing: "border-box",
        transition: "border-color .15s",
    };

    function change(e) {
        setForm(function(f) { return { ...f, [e.target.name]: e.target.value }; });
        setError("");
    }

    function validate() {
        if (!token)                                       return "Invalid or missing reset token.";
        if (form.password.length < 8)                     return "Password must be at least 8 characters.";
        if (form.password !== form.password_confirmation) return "Passwords do not match.";
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(API_URL + "/admin/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token:                 token,
                    password:              form.password,
                    password_confirmation: form.password_confirmation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Reset failed. The link may have expired.");
            }

            // Clear lockout so admin can sign in immediately after reset
            localStorage.removeItem("login_attempts");
            localStorage.removeItem("locked_until");

            setDone(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function goToLogin() {
        // Clear lockout one more time just before navigating
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("locked_until");
        navigate("/admin/login", { replace: true });
    }

    // Invalid token screen
    if (!token) {
        return (
            <div style={{ background: "#f2efe8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(to right, #92400e, " + GOLD + ", #92400e)", zIndex: 100 }} />
                <div style={{ width: "100%", maxWidth: 420 }}>
                    <div style={{ border: "1.5px solid " + NAV, background: "#fff", overflow: "hidden", boxShadow: "0 8px 40px rgba(10,31,82,0.12)" }}>
                        <div style={{ background: NAV, padding: "28px", textAlign: "center" }}>
                            <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: SERIF, margin: 0 }}>Invalid Link</h1>
                            <div style={{ height: 3, background: GOLD, margin: "16px -28px -28px" }} />
                        </div>
                        <div style={{ padding: "36px 28px", textAlign: "center" }}>
                            <div style={{ width: 52, height: 52, background: "#fef0f0", border: "1.5px solid #c0392b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <p style={{ fontSize: 13.5, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.75, margin: "0 0 24px" }}>
                                This reset link is <strong>invalid or has expired</strong>. Please request a new one from the login page.
                            </p>
                            <button
                                onClick={goToLogin}
                                style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "12px 28px", background: NAV, color: GOLD, border: "none", cursor: "pointer" }}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: "#f2efe8", minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "32px 16px", position: "relative",
        }}>
            <div style={{
                position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
                backgroundImage: "radial-gradient(circle at 20% 20%, rgba(10,31,82,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(245,197,24,0.08) 0%, transparent 60%)",
            }} />

            <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(to right, #92400e, " + GOLD + ", #92400e)", zIndex: 100 }} />

            <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

                <p style={{ textAlign: "center", fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: NAV, opacity: 0.4, margin: "0 0 16px" }}>
                    San Roque Elementary School
                </p>

                <div style={{ border: "1.5px solid " + NAV, background: "#fff", overflow: "hidden", boxShadow: "0 8px 40px rgba(10,31,82,0.12)" }}>

                    {/* Header */}
                    <div style={{ background: NAV, padding: "32px 28px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, border: "20px solid " + GOLD + "18", borderRadius: "50%" }} />
                        <div style={{ position: "absolute", bottom: -30, left: -10, width: 80, height: 80, border: "15px solid " + GOLD + "10", borderRadius: "50%" }} />

                        <img
                            src="/images/logo.png" alt="SRES"
                            style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid " + GOLD, background: "#fff", padding: 3, objectFit: "cover", display: "block", margin: "0 auto 16px", position: "relative", zIndex: 1 }}
                            onError={function(e) { e.target.style.display = "none"; }}
                        />

                        {!done && (
                            <div style={{ width: 44, height: 44, background: GOLD + "20", border: "1.5px solid " + GOLD + "40", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", position: "relative", zIndex: 1 }}>
                                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="5" y="11" width="14" height="10" rx="1"/>
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                                    <circle cx="12" cy="16" r="1" fill={GOLD}/>
                                </svg>
                            </div>
                        )}

                        <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: SERIF, margin: "0 0 4px", position: "relative", zIndex: 1 }}>
                            {done ? "Password Updated" : "Set New Password"}
                        </h1>
                        <p style={{ color: GOLD + "80", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0, position: "relative", zIndex: 1 }}>
                            Secure Admin Access
                        </p>
                    </div>

                    <div style={{ height: 3, background: "linear-gradient(to right, " + GOLD + ", #f5a818, " + GOLD + ")" }} />

                    {/* Success state */}
                    {done ? (
                        <div style={{ padding: "40px 28px", textAlign: "center" }}>
                            <div style={{ width: 56, height: 56, background: "#d4edda", border: "1.5px solid #28a745", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#155724" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: NAV, fontFamily: SERIF, margin: "0 0 10px" }}>
                                Password changed!
                            </h3>
                            <p style={{ fontSize: 13, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.75, margin: "0 0 28px" }}>
                                Your password has been reset successfully. You can now sign in with your new password.
                            </p>
                            <button
                                onClick={goToLogin}
                                style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "13px 32px", background: NAV, color: GOLD, border: "none", cursor: "pointer" }}
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : (

                    /* Form */
                    <form onSubmit={handleSubmit} style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

                        <Field label="New Password" htmlFor="password">
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPw ? "text" : "password"}
                                    value={form.password}
                                    onChange={change}
                                    placeholder="Minimum 8 characters"
                                    style={{ ...inputStyle, paddingRight: 44 }}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={function() { setShowPw(function(v) { return !v; }); }}
                                    tabIndex={-1}
                                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", alignItems: "center" }}
                                >
                                    <EyeIcon open={showPw} />
                                </button>
                            </div>
                            <StrengthBar password={form.password} />
                        </Field>

                        <Field label="Confirm Password" htmlFor="password_confirmation">
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showCpw ? "text" : "password"}
                                    value={form.password_confirmation}
                                    onChange={change}
                                    placeholder="Repeat your new password"
                                    style={{
                                        ...inputStyle,
                                        paddingRight: 44,
                                        borderColor: form.password_confirmation && form.password !== form.password_confirmation
                                            ? "#c0392b"
                                            : form.password_confirmation && form.password === form.password_confirmation
                                            ? "#27ae60"
                                            : "#c8c4b8",
                                    }}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={function() { setShowCpw(function(v) { return !v; }); }}
                                    tabIndex={-1}
                                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", alignItems: "center" }}
                                >
                                    <EyeIcon open={showCpw} />
                                </button>
                            </div>
                            {form.password_confirmation && (
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: form.password === form.password_confirmation ? "#27ae60" : "#c0392b" }}>
                                    {form.password === form.password_confirmation ? "Passwords match" : "Passwords do not match"}
                                </span>
                            )}
                        </Field>

                        {error && (
                            <div style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "10px 14px", fontSize: 12, color: "#c0392b", fontWeight: 700, fontFamily: SERIF, lineHeight: 1.6 }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%", padding: "13px 0",
                                background: loading ? "#8a9ab5" : NAV,
                                color: GOLD, fontSize: 11, fontWeight: 800,
                                letterSpacing: "0.18em", textTransform: "uppercase",
                                border: "none", cursor: loading ? "not-allowed" : "pointer",
                                transition: "background .15s",
                            }}
                        >
                            {loading ? "Resetting…" : "Reset Password →"}
                        </button>

                        <div style={{ textAlign: "center", paddingTop: 12, borderTop: "1px solid #e8e4da" }}>
                            <button onClick={goToLogin}
                                style={{ fontSize: 11, color: NAV, opacity: 0.45, background: "none", border: "none", cursor: "pointer", fontFamily: SERIF }}
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                    )}

                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#0a1f5250", fontWeight: 600 }}>
                    {new Date().getFullYear()} San Roque Elementary School · Admin Portal
                </p>
            </div>
        </div>
    );
}