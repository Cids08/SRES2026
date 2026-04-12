import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const MAX_ATTEMPTS  = 5;
const LOCKOUT_SEC   = 120;
const RATE_LIMIT_MS = 1000;

function getDeviceId() {
    let id = localStorage.getItem("device_id");
    if (!id) {
        id = crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("device_id", id);
    }
    return id;
}

function trustDevice() {
    const trusted = JSON.parse(localStorage.getItem("trusted_devices") || "[]");
    const id = getDeviceId();
    if (!trusted.includes(id)) {
        trusted.push(id);
        localStorage.setItem("trusted_devices", JSON.stringify(trusted));
    }
}

function getLockoutState() {
    return {
        attempts:    parseInt(localStorage.getItem("login_attempts") || "0", 10),
        lockedUntil: parseInt(localStorage.getItem("locked_until")   || "0", 10),
    };
}

function recordFailedAttempt() {
    let { attempts } = getLockoutState();
    attempts += 1;
    localStorage.setItem("login_attempts", attempts);
    if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem("locked_until", Date.now() + LOCKOUT_SEC * 1000);
    }
    return attempts;
}

function clearAttempts() {
    localStorage.removeItem("login_attempts");
    localStorage.removeItem("locked_until");
}

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

const LockIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="1"/>
        <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
        <circle cx="12" cy="16" r="1" fill={GOLD}/>
    </svg>
);

const ShieldIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const MailIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);

function OtpInput({ value, onChange, disabled }) {
    const refs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    function handleKey(i, e) {
        if (e.key === "Backspace" && !e.target.value && i > 0) refs[i - 1].current?.focus();
    }
    function handleChange(i, e) {
        const digit = e.target.value.replace(/\D/g, "").slice(-1);
        const arr = value.split("");
        arr[i] = digit;
        const next = arr.join("").padEnd(6, " ").slice(0, 6);
        onChange(next.trimEnd());
        if (digit && i < 5) refs[i + 1].current?.focus();
    }
    function handlePaste(e) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        onChange(pasted);
        refs[Math.min(pasted.length, 5)].current?.focus();
        e.preventDefault();
    }

    return (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {Array.from({ length: 6 }).map(function(_, i) {
                return (
                    <input
                        key={i}
                        ref={refs[i]}
                        id={"otp-" + i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={disabled}
                        value={value[i] || ""}
                        onChange={function(e) { handleChange(i, e); }}
                        onKeyDown={function(e) { handleKey(i, e); }}
                        onPaste={handlePaste}
                        aria-label={"Digit " + (i + 1) + " of 6"}
                        style={{
                            width: 44, height: 52, textAlign: "center",
                            fontSize: 22, fontWeight: 900, fontFamily: "monospace",
                            border: "2px solid " + (value[i] ? GOLD : "#d0ccc0"),
                            background: value[i] ? "#fffbea" : "#fdfcf8",
                            color: NAV, outline: "none",
                            transition: "all .15s",
                            borderRadius: 0,
                        }}
                    />
                );
            })}
        </div>
    );
}

function Countdown({ until, onExpire }) {
    const [secs, setSecs] = useState(Math.ceil((until - Date.now()) / 1000));
    useEffect(function() {
        const t = setInterval(function() {
            const r = Math.ceil((until - Date.now()) / 1000);
            if (r <= 0) { clearInterval(t); onExpire(); } else setSecs(r);
        }, 500);
        return function() { clearInterval(t); };
    }, [until]);
    return String(Math.floor(secs / 60)) + ":" + String(secs % 60).padStart(2, "0");
}

export default function AdminLogin() {
    const navigate = useNavigate();

    const [step, setStep]               = useState("login");
    const [form, setForm]               = useState({ email: "", password: "" });
    const [forgotEmail, setForgotEmail] = useState("");
    const [honeypot, setHoneypot]       = useState("");
    const [showPw, setShowPw]           = useState(false);
    const [otp, setOtp]                 = useState("");
    const [trustChecked, setTrust]      = useState(false);
    const [error, setError]             = useState("");
    const [info, setInfo]               = useState("");
    const [loading, setLoading]         = useState(false);
    const [attempts, setAttempts]       = useState(0);
    const [lockedUntil, setLockedUntil] = useState(0);

    const lastSubmit   = useRef(0);
    const emailRef     = useRef(null);
    const passwordRef  = useRef(null);
    const pendingToken = useRef("");

    // Re-read lockout state on mount
    useEffect(function() {
        var state = getLockoutState();
        setAttempts(state.attempts);
        setLockedUntil(state.lockedUntil);
    }, []);

    // Catch autofill values after browser populates fields
    useEffect(function() {
        const timer = setTimeout(function() {
            if (emailRef.current?.value && !form.email) {
                setForm(function(f) { return { ...f, email: emailRef.current.value }; });
            }
            if (passwordRef.current?.value && !form.password) {
                setForm(function(f) { return { ...f, password: passwordRef.current.value }; });
            }
        }, 500);
        return function() { clearTimeout(timer); };
    }, []);

    const isLocked = lockedUntil > Date.now();

    function change(e) {
        setForm(function(f) { return { ...f, [e.target.name]: e.target.value }; });
        setError("");
    }

    function clearLockout() {
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("locked_until");
        setAttempts(0);
        setLockedUntil(0);
    }

    async function apiFetch(path, body) {
        const res = await fetch(API_URL + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
            throw new Error("Server error (HTTP " + res.status + "). Is the API running?");
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || "Request failed.");
        return data;
    }

    async function submitLogin(e) {
        e.preventDefault();
        if (honeypot) return;

        // Fresh lockout check
        const freshLockout = parseInt(localStorage.getItem("locked_until") || "0", 10);
        if (freshLockout > Date.now()) {
            setLockedUntil(freshLockout);
            setError("Account is temporarily locked. Please wait.");
            return;
        }

        const now = Date.now();
        if (now - lastSubmit.current < RATE_LIMIT_MS) return;
        lastSubmit.current = now;

        // Three layers of autofill detection
        const refEmail    = emailRef.current?.value    || "";
        const refPassword = passwordRef.current?.value || "";
        const domEmail    = document.getElementById("login-email")?.value    || "";
        const domPassword = document.getElementById("login-password")?.value || "";

        const finalEmail    = refEmail    || domEmail    || form.email;
        const finalPassword = refPassword || domPassword || form.password;

        if (!finalEmail.trim() || !finalPassword.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        if (form.email !== finalEmail)       setForm(function(f) { return { ...f, email: finalEmail }; });
        if (form.password !== finalPassword) setForm(function(f) { return { ...f, password: finalPassword }; });

        setLoading(true);
        setError("");

        try {
            const data = await apiFetch("/admin/login", {
                email:     finalEmail,
                password:  finalPassword,
                device_id: getDeviceId(),
            });

            clearAttempts();
            setAttempts(0);
            setLockedUntil(0);
            pendingToken.current = data.token;

            if (data.requires_2fa) {
                setInfo("A verification code was sent to " + data.email_hint + ".");
                setStep("2fa");
            } else if (data.new_device) {
                setInfo("We don't recognize this device. A code was sent to your email.");
                setStep("new-device");
            } else {
                finalizeLogin(data.token, data.user);
            }
        } catch (err) {
            const count = recordFailedAttempt();
            const state = getLockoutState();
            setAttempts(count);
            if (count >= MAX_ATTEMPTS) {
                setLockedUntil(state.lockedUntil);
                setError("Too many failed attempts. Try again in " + (LOCKOUT_SEC / 60) + " minutes.");
            } else {
                setError(err.message);
                if (MAX_ATTEMPTS - count <= 2) {
                    setInfo("Warning: " + (MAX_ATTEMPTS - count) + " attempt(s) remaining.");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    async function submitOtp(e) {
        e.preventDefault();
        if (otp.length < 6) { setError("Enter the full 6-digit code."); return; }
        setLoading(true);
        setError("");
        try {
            const data = await apiFetch("/admin/verify-otp", {
                token:     pendingToken.current,
                otp:       otp,
                device_id: getDeviceId(),
                trust:     trustChecked,
            });
            if (trustChecked) trustDevice();
            finalizeLogin(data.token, data.user);
        } catch (err) {
            setError(err.message);
            setOtp("");
        } finally {
            setLoading(false);
        }
    }

    async function resendOtp() {
        setLoading(true);
        setError("");
        try {
            await apiFetch("/admin/resend-otp", { token: pendingToken.current });
            setInfo("A new code has been sent to your email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function submitForgot(e) {
        e.preventDefault();
        if (!forgotEmail.trim()) { setError("Please enter your email address."); return; }
        setLoading(true);
        setError("");
        try {
            await apiFetch("/admin/forgot-password", { email: forgotEmail });
            setStep("forgot-sent");
        } catch (err) {
            setStep("forgot-sent");
        } finally {
            setLoading(false);
        }
    }

    function finalizeLogin(token, user) {
        clearAttempts();
        setAttempts(0);
        setLockedUntil(0);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(user));
        navigate("/admin", { replace: true });
    }

    const inputStyle = {
        fontSize: 13.5, fontFamily: SERIF, color: "#1a1a1a",
        padding: "11px 14px", border: "1.5px solid #c8c4b8",
        background: "#fdfcf8", outline: "none",
        width: "100%", boxSizing: "border-box",
        transition: "border-color .15s",
    };

    const attemptBar   = Math.max(0, ((MAX_ATTEMPTS - attempts) / MAX_ATTEMPTS) * 100);
    const attemptColor = attempts === 0 ? GOLD : attempts >= MAX_ATTEMPTS - 1 ? "#c0392b" : "#e67e00";

    const STEP_ICONS = {
        "2fa":         <LockIcon />,
        "new-device":  <ShieldIcon />,
        "forgot":      <MailIcon />,
        "forgot-sent": <MailIcon />,
    };
    const STEP_TITLES = {
        login:         "Admin Portal",
        "2fa":         "Two-Factor Verification",
        "new-device":  "New Device Detected",
        forgot:        "Reset Password",
        "forgot-sent": "Check Your Email",
    };

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
                            src="/images/logo.png" alt="SRES Logo"
                            style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid " + GOLD, background: "#fff", padding: 3, objectFit: "cover", display: "block", margin: "0 auto 16px", position: "relative", zIndex: 1 }}
                            onError={function(e) { e.target.style.display = "none"; }}
                        />

                        {step !== "login" && (
                            <div style={{ width: 48, height: 48, background: GOLD + "20", border: "1.5px solid " + GOLD + "40", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", position: "relative", zIndex: 1 }}>
                                {STEP_ICONS[step]}
                            </div>
                        )}

                        <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: SERIF, margin: "0 0 4px", position: "relative", zIndex: 1 }}>
                            {STEP_TITLES[step]}
                        </h1>
                        <p style={{ color: GOLD + "80", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0, position: "relative", zIndex: 1 }}>
                            Secure Admin Access
                        </p>
                    </div>

                    <div style={{ height: 3, background: "linear-gradient(to right, " + GOLD + ", #f5a818, " + GOLD + ")" }} />

                    {/* LOGIN STEP */}
                    {step === "login" && (
                        <form onSubmit={submitLogin} style={{ padding: "28px 28px 24px" }}>

                            <input
                                name="website" value={honeypot}
                                onChange={function(e) { setHoneypot(e.target.value); }}
                                tabIndex={-1} autoComplete="off" aria-hidden="true"
                                style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
                            />

                            {isLocked && (
                                <div style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "14px 16px", marginBottom: 20, textAlign: "center" }}>
                                    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c0392b" }}>
                                        Account Temporarily Locked
                                    </p>
                                    <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#c0392b", fontFamily: "monospace" }}>
                                        <Countdown
                                            until={lockedUntil}
                                            onExpire={function() { clearAttempts(); setAttempts(0); setLockedUntil(0); setError(""); }}
                                        />
                                    </p>
                                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#c0392b", opacity: 0.7 }}>minutes remaining</p>
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 18 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label htmlFor="login-email" style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV }}>
                                        Email Address
                                    </label>
                                    <input
                                        id="login-email"
                                        ref={emailRef}
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={change}
                                        placeholder="admin@admin.com"
                                        style={inputStyle}
                                        autoComplete="username"
                                        disabled={isLocked || loading}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label htmlFor="login-password" style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV }}>
                                        Password
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            id="login-password"
                                            ref={passwordRef}
                                            name="password"
                                            type={showPw ? "text" : "password"}
                                            value={form.password}
                                            onChange={change}
                                            placeholder="••••••••"
                                            style={{ ...inputStyle, paddingRight: 44 }}
                                            autoComplete="current-password"
                                            disabled={isLocked || loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={function() { setShowPw(function(v) { return !v; }); }}
                                            tabIndex={-1}
                                            aria-label={showPw ? "Hide password" : "Show password"}
                                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", alignItems: "center" }}
                                        >
                                            <EyeIcon open={showPw} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {attempts > 0 && !isLocked && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: attemptColor }}>Failed Attempts</span>
                                        <span style={{ fontSize: 9, fontWeight: 800, color: attemptColor }}>{MAX_ATTEMPTS - attempts} of {MAX_ATTEMPTS} remaining</span>
                                    </div>
                                    <div style={{ height: 4, background: "#e8e4da" }}>
                                        <div style={{ height: "100%", background: attemptColor, width: attemptBar + "%", transition: "width .4s, background .4s" }} />
                                    </div>
                                </div>
                            )}

                            {info && !error && (
                                <div style={{ background: "#fffbea", border: "1.5px solid #f5c518", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#92400e", fontFamily: SERIF, lineHeight: 1.6 }}>
                                    {info}
                                </div>
                            )}
                            {error && (
                                <div role="alert" style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#c0392b", fontWeight: 700, fontFamily: SERIF, lineHeight: 1.6 }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || isLocked}
                                style={{
                                    width: "100%", padding: "13px 0",
                                    background: loading || isLocked ? "#8a9ab5" : NAV,
                                    color: GOLD, fontSize: 11, fontWeight: 800,
                                    letterSpacing: "0.18em", textTransform: "uppercase",
                                    border: "none", cursor: loading || isLocked ? "not-allowed" : "pointer",
                                    transition: "background .15s", marginBottom: 16,
                                }}
                            >
                                {loading ? "Verifying…" : isLocked ? "Account Locked" : "Sign In →"}
                            </button>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #e8e4da" }}>
                                <a href="/" style={{ fontSize: 11, color: NAV, opacity: 0.45, textDecoration: "none", fontFamily: SERIF }}>
                                    Back to website
                                </a>
                                <button
                                    type="button"
                                    onClick={function() { setStep("forgot"); setError(""); setInfo(""); }}
                                    style={{ fontSize: 11, color: NAV, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: SERIF, textDecoration: "underline", opacity: 0.6 }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 2FA / NEW DEVICE STEP */}
                    {(step === "2fa" || step === "new-device") && (
                        <form onSubmit={submitOtp} style={{ padding: "28px 28px 24px" }}>
                            {info && (
                                <div style={{ background: "#fffbea", border: "1.5px solid #f5c518", padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#78350f", fontFamily: SERIF, lineHeight: 1.7, textAlign: "center" }}>
                                    {info}
                                </div>
                            )}

                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV, textAlign: "center", marginBottom: 14 }}>
                                    Verification Code
                                </p>
                                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                            </div>

                            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1.5px solid #e8e4da", background: "#fdfcf8", cursor: "pointer", marginBottom: 16 }}>
                                <input
                                    type="checkbox"
                                    checked={trustChecked}
                                    onChange={function(e) { setTrust(e.target.checked); }}
                                    style={{ width: 15, height: 15, accentColor: NAV }}
                                />
                                <div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: NAV, fontFamily: SERIF, display: "block" }}>Trust this device</span>
                                    <span style={{ fontSize: 11, color: "#888", fontFamily: SERIF }}>Skip verification for 30 days on this device</span>
                                </div>
                            </label>

                            {error && (
                                <div role="alert" style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#c0392b", fontWeight: 700, fontFamily: SERIF }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                style={{
                                    width: "100%", padding: "13px 0", marginBottom: 16,
                                    background: loading || otp.length < 6 ? "#8a9ab5" : NAV,
                                    color: GOLD, fontSize: 11, fontWeight: 800,
                                    letterSpacing: "0.18em", textTransform: "uppercase",
                                    border: "none", cursor: loading || otp.length < 6 ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Verifying…" : "Verify & Sign In →"}
                            </button>

                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #e8e4da" }}>
                                <button
                                    type="button"
                                    onClick={function() { setStep("login"); setOtp(""); setError(""); setInfo(""); }}
                                    style={{ fontSize: 11, color: NAV, opacity: 0.45, background: "none", border: "none", cursor: "pointer", fontFamily: SERIF }}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    disabled={loading}
                                    style={{ fontSize: 11, color: NAV, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: SERIF, textDecoration: "underline" }}
                                >
                                    Resend code
                                </button>
                            </div>
                        </form>
                    )}

                    {/* FORGOT PASSWORD STEP */}
                    {step === "forgot" && (
                        <form onSubmit={submitForgot} style={{ padding: "28px 28px 24px" }}>
                            <p style={{ fontSize: 13, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.75, margin: "0 0 20px", textAlign: "center" }}>
                                Enter your admin email address and we will send you a link to reset your password.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                                <label htmlFor="forgot-email" style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV }}>
                                    Email Address
                                </label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    value={forgotEmail}
                                    onChange={function(e) { setForgotEmail(e.target.value); setError(""); }}
                                    placeholder="admin@admin.com"
                                    style={inputStyle}
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div role="alert" style={{ background: "#fef0f0", border: "1.5px solid #c0392b", padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#c0392b", fontWeight: 700, fontFamily: SERIF }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%", padding: "13px 0", marginBottom: 16,
                                    background: loading ? "#8a9ab5" : NAV,
                                    color: GOLD, fontSize: 11, fontWeight: 800,
                                    letterSpacing: "0.18em", textTransform: "uppercase",
                                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Sending…" : "Send Reset Link →"}
                            </button>

                            <div style={{ paddingTop: 14, borderTop: "1px solid #e8e4da", textAlign: "center" }}>
                                <button
                                    type="button"
                                    onClick={function() {
                                        clearLockout();
                                        setStep("login");
                                        setError("");
                                    }}
                                    style={{ fontSize: 11, color: NAV, opacity: 0.45, background: "none", border: "none", cursor: "pointer", fontFamily: SERIF }}
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* FORGOT SENT STEP */}
                    {step === "forgot-sent" && (
                        <div style={{ padding: "36px 28px 28px", textAlign: "center" }}>
                            <div style={{ width: 56, height: 56, background: "#d4edda", border: "1.5px solid #28a745", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#155724" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: NAV, fontFamily: SERIF, margin: "0 0 10px" }}>
                                Check your inbox
                            </h3>
                            <p style={{ fontSize: 13, color: "#3a3a3a", fontFamily: SERIF, lineHeight: 1.75, margin: "0 0 24px" }}>
                                If <strong>{forgotEmail}</strong> is registered as an admin, you will receive a password reset link shortly.
                            </p>
                            <button
                                onClick={function() {
                                    clearLockout();
                                    setStep("login");
                                    setForgotEmail("");
                                    setError("");
                                }}
                                style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "11px 28px", background: NAV, color: GOLD, border: "none", cursor: "pointer" }}
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#0a1f5250", fontWeight: 600 }}>
                    {new Date().getFullYear()} San Roque Elementary School · Admin Portal
                </p>
            </div>
        </div>
    );
}