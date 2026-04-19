/* EnrollmentClosed.jsx
   Shown when admin has turned off enrollment in Site Settings.
   Route: /enroll  (replace the Enroll component or wrap it — see Enroll.jsx)
*/
const NAV   = "#0a1f52";
const GOLD  = "#f5c518";
const SERIF = "Georgia, serif";

export default function EnrollmentClosed() {
    return (
        <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", background:"#f8fafc" }}>
            <div style={{ width:"100%", maxWidth:520, textAlign:"center" }}>

                {/* Icon */}
                <div style={{ width:90, height:90, borderRadius:"50%", background:NAV, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", boxShadow:"0 8px 32px rgba(10,31,82,0.18)" }}>
                    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>

                {/* School logo / name */}
                <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#94a3b8" }}>
                    San Roque Elementary School
                </p>

                <h1 style={{ margin:"0 0 16px", fontSize:28, fontWeight:900, color:NAV, fontFamily:SERIF, lineHeight:1.2 }}>
                    Enrollment Has Officially Ended
                </h1>

                {/* Divider */}
                <div style={{ width:60, height:4, background:GOLD, borderRadius:2, margin:"0 auto 24px" }}/>

                <p style={{ margin:"0 0 12px", fontSize:16, color:"#334155", fontFamily:SERIF, lineHeight:1.75 }}>
                    Online enrollment for this school year has officially ended.
                </p>

                <p style={{ margin:"0 0 32px", fontSize:15, color:"#475569", fontFamily:SERIF, lineHeight:1.8 }}>
                    If you would like to enroll your child, kindly visit the school office in person during office hours. Our staff will be happy to assist you.
                </p>

                {/* Info box */}
                <div style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:14, padding:"20px 24px", marginBottom:32, textAlign:"left" }}>
                    <p style={{ margin:"0 0 12px", fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:"#94a3b8" }}>School Office</p>

                    {[
                        { icon:<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text:"San Roque, Viga, Catanduanes" },
                        { icon:<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, text:"Monday – Friday, 7:00 AM – 4:00 PM" },
                    ].map((row,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom: i===0?8:0 }}>
                            <span style={{ flexShrink:0, opacity:0.7 }}>{row.icon}</span>
                            <span style={{ fontSize:13, color:"#334155", fontFamily:SERIF }}>{row.text}</span>
                        </div>
                    ))}
                </div>

                <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:8, background:NAV, color:GOLD, textDecoration:"none", fontSize:13, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"14px 32px", borderRadius:10 }}
                    onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Homepage
                </a>
            </div>
        </div>
    );
}