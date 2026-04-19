import { useSettings } from "../App";

const NAV  = "#0a1f52";
const GOLD = "#f5c518";

export default function AnnouncementTicker() {
    const { announcement_ticker } = useSettings();

    if (!announcement_ticker || !announcement_ticker.trim()) return null;

    const repeated = Array(3).fill(announcement_ticker).join("\u00a0\u00a0\u00a0\u00a0•\u00a0\u00a0\u00a0\u00a0");

    return (
        <>
            <style>{`
                @keyframes sres-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.3334%); }
                }
                .sres-ticker-wrap {
                    overflow: hidden;
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .sres-ticker-inner {
                    display: inline-block;
                    white-space: nowrap;
                    padding-left: 48px;
                    animation: sres-scroll 24s linear infinite;
                    will-change: transform;
                }
                .sres-ticker-inner:hover {
                    animation-play-state: paused;
                }
                .sres-fade-left {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 32px;
                    background: linear-gradient(to right, #0a1f52, transparent);
                    pointer-events: none;
                    z-index: 2;
                }
                .sres-fade-right {
                    position: absolute;
                    right: 0; top: 0; bottom: 0;
                    width: 32px;
                    background: linear-gradient(to left, #0a1f52, transparent);
                    pointer-events: none;
                    z-index: 2;
                }
            `}</style>

            <div style={{
                background: NAV,
                borderBottom: `3px solid ${GOLD}`,
                display: "flex",
                alignItems: "stretch",
                height: 38,
                overflow: "hidden",
            }}>
                <div style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: GOLD,
                    padding: "0 16px",
                    height: "100%",
                }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={NAV} strokeWidth={2.8} style={{ flexShrink: 0 }}>
                        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span style={{
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: NAV,
                        fontFamily: "Arial, sans-serif",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                    }}>
                        Announcement
                    </span>
                </div>

                <div className="sres-ticker-wrap">
                    <div className="sres-fade-left" />
                    <div className="sres-ticker-inner">
                        <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#fff",
                            fontFamily: "Georgia, serif",
                            letterSpacing: "0.02em",
                        }}>
                            {repeated}
                        </span>
                    </div>
                    <div className="sres-fade-right" />
                </div>
            </div>
        </>
    );
}