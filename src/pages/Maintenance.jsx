const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

export default function Maintenance({ pageName = "This page" }) {
    return (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f8fafc" }}>
            <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>

                <div style={{ width: 90, height: 90, borderRadius: "50%", background: NAV, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 8px 32px rgba(10,31,82,0.18)" }}>
                    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
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

                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD, opacity: 0.4, animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                </div>

                <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAV, color: GOLD, textDecoration: "none", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 10 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Homepage
                </a>

                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.2; transform: scale(0.8); }
                        50%       { opacity: 0.8; transform: scale(1.1); }
                    }
                `}</style>
            </div>
        </div>
    );
}