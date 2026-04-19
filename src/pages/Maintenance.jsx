import { useSettings } from "../App";

const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

export default function Maintenance({ pageName = "This page" }) {
    const { maintenance_pages, maintenance_mode } = useSettings();

    const homeUnderMaintenance =
        maintenance_mode ||
        (Array.isArray(maintenance_pages) && maintenance_pages.includes("home"));

    return (
        <div style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "#f8fafc",
        }}>
            <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>

                <div style={{ width: 90, height: 90, borderRadius: "50%", background: NAV, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 8px 32px rgba(10,31,82,0.18)" }}>
                    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
                        style={{ animation: "spin 3s linear infinite" }}>
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                </div>

                <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#94a3b8" }}>
                    San Roque Elementary School
                </p>

                <h1 style={{ margin: "0 0 16px", fontSize: 28, fontWeight: 900, color: NAV, fontFamily: SERIF, lineHeight: 1.2 }}>
                    Under Maintenance
                </h1>

                <div style={{ width: 60, height: 4, background: GOLD, borderRadius: 2, margin: "0 auto 24px" }} />

                <p style={{ margin: "0 0 12px", fontSize: 16, color: "#334155", fontFamily: SERIF, lineHeight: 1.75 }}>
                    <strong>{pageName}</strong> is currently undergoing maintenance.
                </p>

                <p style={{ margin: "0 0 32px", fontSize: 15, color: "#475569", fontFamily: SERIF, lineHeight: 1.8 }}>
                    We're working to improve things and will be back shortly. Thank you for your patience!
                </p>

                {/* Animated progress bar */}
                <div style={{ width: "100%", height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 0 32px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: GOLD, borderRadius: 2, animation: "progress 2s ease-in-out infinite" }} />
                </div>

                {/* Back to Homepage — only when home is NOT under maintenance */}
                {!homeUnderMaintenance && (
                    <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAV, color: GOLD, textDecoration: "none", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 10 }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back to Homepage
                    </a>
                )}

                {/* When home is also down — show contact info instead */}
                {homeUnderMaintenance && (
                    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", textAlign: "left" }}>
                        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>
                            Contact Us
                        </p>
                        {[
                            {
                                icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                                text: "San Roque, Viga, Catanduanes, Philippines"
                            },
                            {
                                icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                                text: "Mon – Fri, 7:00 AM – 5:00 PM"
                            },
                            {
                                icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                                href: "mailto:113330@deped.gov.ph",
                                text: "113330@deped.gov.ph"
                            },
                            {
                                icon: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.56 3.35 2 2 0 0 1 3.53 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l1.81-1.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                                href: "tel:+639605519104",
                                text: "+63 960 551 9104"
                            },
                        ].map((row, i, arr) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i === arr.length - 1 ? 0 : 8 }}>
                                <span style={{ flexShrink: 0, opacity: 0.7 }}>{row.icon}</span>
                                {row.href ? (
                                    <a href={row.href} style={{ fontSize: 13, color: NAV, fontFamily: SERIF, fontWeight: 700, textDecoration: "none" }}>{row.text}</a>
                                ) : (
                                    <span style={{ fontSize: 13, color: "#334155", fontFamily: SERIF }}>{row.text}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    @keyframes progress {
                        0%   { width: 0%;   margin-left: 0; }
                        50%  { width: 100%; margin-left: 0; }
                        100% { width: 0%;   margin-left: 100%; }
                    }
                `}</style>
            </div>
        </div>
    );
}