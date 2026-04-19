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
    return new Date(d).toLocaleDateString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

const STATUS_CFG = {
    unread:  { bg: "#fef9c3", color: "#713f12", border: "#ca8a04", dot: "#ca8a04", label: "Unread"  },
    read:    { bg: "#f0f4ff", color: NAV,       border: NAV,       dot: NAV,       label: "Read"    },
    replied: { bg: "#dcfce7", color: "#14532d", border: "#16a34a", dot: "#16a34a", label: "Replied" },
};
const SENDER_LABELS = { parent:"Parent / Guardian", student:"Student", teacher:"Teacher / Staff", other:"Other" };
const SENDER_COLORS = {
    parent:  { bg:"#ede9fe", color:"#4c1d95", border:"#7c3aed" },
    student: { bg:"#dbeafe", color:"#1e3a8a", border:"#3b82f6" },
    teacher: { bg:"#fce7f3", color:"#831843", border:"#ec4899" },
    other:   { bg:"#f1f5f9", color:"#475569", border:"#94a3b8" },
};

/* ── Toast ── */
function Toast({ toasts }) {
    return (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:10, pointerEvents:"none" }}>
            {toasts.map(t => (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, background:t.type==="success"?"#052e16":"#450a0a", color:t.type==="success"?"#bbf7d0":"#fecaca", padding:"12px 18px", borderRadius:12, fontSize:13, fontWeight:700, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", border:"1px solid "+(t.type==="success"?"#166534":"#991b1b"), minWidth:240, animation:"toastIn .25s ease", pointerEvents:"none" }}>
                    <span style={{ fontSize:16 }}>{t.type==="success"?"✓":"✕"}</span>
                    {t.message}
                </div>
            ))}
            <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
}
function useToast() {
    const [toasts, setToasts] = useState([]);
    function addToast(message, type="success") {
        const id = Date.now()+Math.random();
        setToasts(p=>[...p,{id,message,type}]);
        setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
    }
    return { toasts, addToast };
}

/* ── Confirm modal ── */
function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
    return (
        <div style={{ position:"fixed", inset:0, zIndex:1300, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onCancel}>
            <div style={{ width:"100%", maxWidth:380, background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 24px 64px rgba(0,0,0,0.28)" }} onClick={e=>e.stopPropagation()}>
                <div style={{ background:NAV, padding:"20px 24px" }}>
                    <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#fff", fontFamily:SERIF }}>{title}</p>
                </div>
                <div style={{ padding:"22px 24px 24px" }}>
                    <p style={{ margin:"0 0 22px", fontSize:14, color:"#334155", lineHeight:1.6, fontFamily:SERIF }}>{message}</p>
                    <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                        <button onClick={onCancel} style={{ fontSize:12, fontWeight:700, padding:"10px 22px", background:"#f1f5f9", border:"1.5px solid #e2e8f0", color:"#475569", borderRadius:9, cursor:"pointer" }}>Cancel</button>
                        <button onClick={onConfirm} style={{ fontSize:12, fontWeight:800, padding:"10px 22px", background:confirmColor||NAV, color:"#fff", border:"none", borderRadius:9, cursor:"pointer" }}>{confirmLabel||"Confirm"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Badges ── */
function StatusBadge({ status }) {
    const cfg = STATUS_CFG[status]||STATUS_CFG.unread;
    return (
        <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, padding:"5px 12px", background:cfg.bg, color:cfg.color, border:"1.5px solid "+cfg.border, borderRadius:20, whiteSpace:"nowrap" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot, flexShrink:0 }}/>
            {cfg.label}
        </span>
    );
}
function SenderBadge({ type }) {
    const cfg = SENDER_COLORS[type]||SENDER_COLORS.other;
    return (
        <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700, padding:"3px 10px", background:cfg.bg, color:cfg.color, border:"1px solid "+cfg.border, borderRadius:20, whiteSpace:"nowrap" }}>
            {SENDER_LABELS[type]||type}
        </span>
    );
}
function SenderAvatar({ msg, size=44 }) {
    const initials = (msg.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const idx = ["parent","student","teacher","other"].indexOf(msg.sender_type);
    const cfg = Object.values(SENDER_COLORS)[idx]||SENDER_COLORS.other;
    return (
        <div style={{ width:size, height:size, borderRadius:"50%", background:cfg.bg, border:"2.5px solid "+cfg.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:size*0.32, fontWeight:900, color:cfg.color, fontFamily:SERIF }}>{initials}</span>
        </div>
    );
}

/* ── Detail Modal ── */
function DetailModal({ message:initial, onClose, onUpdated, onDeleted, addToast }) {
    const [msg,          setMsg]          = useState(initial);
    const [loading,      setLoading]      = useState(false);
    const [confirm,      setConfirm]      = useState(null);
    const [replyBody,    setReplyBody]    = useState("");
    const [replySent,    setReplySent]    = useState(false);
    const [sendingReply, setSendingReply] = useState(false);

    async function markReplied() {
        if (msg.status==="replied"||loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/contact-messages/${msg.id}/replied`,{ method:"PATCH", headers:authHeader() });
            if (!res.ok) throw new Error("Failed to update.");
            const updated = {...msg, status:"replied"};
            setMsg(updated); onUpdated(updated);
            addToast("Message marked as replied.");
        } catch(err) { addToast(err.message,"error"); }
        finally { setLoading(false); }
    }

    async function sendReply() {
        if (!replyBody.trim()) { addToast("Reply message cannot be empty.","error"); return; }
        setSendingReply(true);
        try {
            const res  = await fetch(`${API_URL}/admin/contact-messages/${msg.id}/reply`,{
                method:"POST", headers:{...authHeader(),"Content-Type":"application/json"},
                body: JSON.stringify({body:replyBody}),
            });
            const data = await res.json().catch(()=>({}));
            if (!res.ok) throw new Error(data.message||"Failed to send reply.");
            const updated = data.contact_message||{...msg,status:"replied"};
            setMsg(updated); onUpdated(updated);
            setReplySent(true); setReplyBody("");
            addToast("Reply sent to "+msg.email+"!");
        } catch(err) { addToast(err.message,"error"); }
        finally { setSendingReply(false); }
    }

    async function doDelete() {
        setConfirm(null); setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/contact-messages/${msg.id}`,{ method:"DELETE", headers:authHeader() });
            if (!res.ok) throw new Error("Failed to delete.");
            onDeleted(msg.id); addToast("Message deleted."); onClose();
        } catch(err) { addToast(err.message,"error"); }
        finally { setLoading(false); }
    }

    return (
        <>
            <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(10,31,82,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", overflowY:"auto" }} onClick={onClose}>
                <div style={{ width:"100%", maxWidth:600, background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,0.25)", marginBlock:"auto" }} onClick={e=>e.stopPropagation()}>

                    {/* Banner */}
                    <div style={{ background:NAV, padding:"24px 24px 80px", position:"relative", overflow:"hidden" }}>
                        <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(245,197,24,0.07)" }}/>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
                            <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD+"80" }}>Message #{msg.id}</span>
                            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                        </div>
                    </div>

                    {/* Sender card */}
                    <div style={{ margin:"-52px 20px 0", background:"#fff", borderRadius:16, padding:"20px 22px", boxShadow:"0 4px 24px rgba(0,0,0,0.12)", display:"flex", alignItems:"flex-start", gap:18, flexWrap:"wrap", position:"relative", zIndex:1 }}>
                        <SenderAvatar msg={msg} size={80}/>
                        <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                                <SenderBadge type={msg.sender_type}/>
                                <StatusBadge status={msg.status}/>
                            </div>
                            <h2 style={{ margin:"0 0 4px", fontSize:19, fontWeight:800, color:"#0f172a", fontFamily:SERIF, lineHeight:1.2 }}>{msg.name}</h2>
                            <p style={{ margin:0, fontSize:13, color:"#64748b" }}>{msg.email}</p>
                            {msg.grade_section && <p style={{ margin:"2px 0 0", fontSize:12, color:"#94a3b8" }}>Grade / Section: {msg.grade_section}</p>}
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:12 }}>
                        <div style={{ background:"#f8fafc", borderRadius:10, padding:"12px 16px", border:"1px solid #f1f5f9" }}>
                            <p style={{ margin:"0 0 5px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8" }}>Subject</p>
                            <p style={{ margin:0, fontSize:14, fontWeight:700, color:NAV, fontFamily:SERIF }}>{msg.subject}</p>
                        </div>
                        <div style={{ background:"#f8fafc", borderRadius:10, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
                            <p style={{ margin:"0 0 8px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8" }}>Message</p>
                            <p style={{ margin:0, fontSize:14, color:"#334155", fontFamily:SERIF, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{msg.message}</p>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                            {[["Received",msg.created_at],["Read At",msg.read_at]].map(([l,v])=>(
                                <div key={l} style={{ background:"#f8fafc", borderRadius:10, padding:"12px 16px", border:"1px solid #f1f5f9" }}>
                                    <p style={{ margin:"0 0 5px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8" }}>{l}</p>
                                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:"#0f172a", fontFamily:SERIF }}>{formatDate(v)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Reply composer */}
                        <div style={{ background:replySent?"#f0fdf4":"#f0f4ff", borderRadius:12, padding:"16px 18px", border:`1.5px solid ${replySent?"#86efac":NAV+"30"}`, transition:"background .3s, border-color .3s" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={replySent?"#16a34a":NAV} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:replySent?"#16a34a":NAV }}>
                                        {replySent?"Reply Sent ✓":`Reply to ${msg.email}`}
                                    </span>
                                </div>
                                {replySent && (
                                    <button onClick={()=>setReplySent(false)} style={{ fontSize:10, fontWeight:700, padding:"4px 12px", background:"#dcfce7", border:"1px solid #86efac", color:"#14532d", borderRadius:6, cursor:"pointer" }}>Send Another</button>
                                )}
                            </div>
                            {replySent ? (
                                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#dcfce7", border:"2px solid #16a34a", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <div>
                                        <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#14532d", fontFamily:SERIF }}>Reply delivered successfully!</p>
                                        <p style={{ margin:0, fontSize:12, color:"#16a34a" }}>Your message was sent to <strong>{msg.email}</strong>. This inquiry has been marked as replied.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <textarea value={replyBody} onChange={e=>setReplyBody(e.target.value)}
                                        placeholder={`Write your reply to ${msg.name}…\n\nYour message will be sent directly to their email address.`}
                                        rows={6} maxLength={3000}
                                        style={{ width:"100%", fontSize:13, fontFamily:SERIF, color:"#334155", padding:"12px 14px", border:"1.5px solid #e2e8f0", borderRadius:10, outline:"none", resize:"vertical", boxSizing:"border-box", lineHeight:1.75, background:"#fff", transition:"border-color .15s" }}
                                        onFocus={e=>{e.target.style.borderColor=NAV;}}
                                        onBlur={e=>{e.target.style.borderColor="#e2e8f0";}}
                                    />
                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, flexWrap:"wrap", gap:8 }}>
                                        <span style={{ fontSize:11, color:replyBody.length>2800?"#dc2626":"#94a3b8" }}>{replyBody.length} / 3000</span>
                                        <button onClick={sendReply} disabled={sendingReply||!replyBody.trim()}
                                            style={{ fontSize:12, fontWeight:800, padding:"11px 26px", background:sendingReply||!replyBody.trim()?"#e2e8f0":NAV, color:sendingReply||!replyBody.trim()?"#94a3b8":GOLD, border:"none", borderRadius:9, cursor:sendingReply||!replyBody.trim()?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8 }}>
                                            {sendingReply ? (
                                                <><span style={{ width:12, height:12, border:"2px solid #94a3b8", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }}/>Sending…</>
                                            ) : (
                                                <><svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Reply</>
                                            )}
                                        </button>
                                    </div>
                                    <p style={{ margin:"10px 0 0", fontSize:11, color:"#94a3b8", fontStyle:"italic" }}>📧 This reply will be sent to <strong>{msg.email}</strong> and the inquiry will automatically be marked as replied.</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding:"0 22px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
                        <button onClick={()=>setConfirm("delete")}
                            style={{ fontSize:12, fontWeight:700, padding:"10px 20px", background:"#fef2f2", border:"1.5px solid #fecaca", color:"#dc2626", borderRadius:9, cursor:"pointer", transition:"all .15s" }}
                            onMouseEnter={e=>{e.currentTarget.style.background="#dc2626";e.currentTarget.style.color="#fff";}}
                            onMouseLeave={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.color="#dc2626";}}>
                            Delete Message
                        </button>
                        <div style={{ display:"flex", gap:10 }}>
                            {msg.status!=="replied" && (
                                <button onClick={markReplied} disabled={loading}
                                    style={{ fontSize:12, fontWeight:700, padding:"10px 20px", background:"#dcfce7", border:"1.5px solid #16a34a", color:"#14532d", borderRadius:9, cursor:loading?"not-allowed":"pointer", transition:"all .15s" }}
                                    onMouseEnter={e=>{if(!loading){e.currentTarget.style.background="#16a34a";e.currentTarget.style.color="#fff";}}}
                                    onMouseLeave={e=>{e.currentTarget.style.background="#dcfce7";e.currentTarget.style.color="#14532d";}}>
                                    {loading?"Saving…":"✓ Mark as Replied"}
                                </button>
                            )}
                            <button onClick={onClose}
                                style={{ fontSize:12, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", padding:"10px 28px", background:NAV, color:GOLD, border:"none", borderRadius:9, cursor:"pointer" }}
                                onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}}
                                onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {confirm==="delete" && (
                <ConfirmModal title="Delete Message" message={`Delete the message from ${msg.name}? This cannot be undone.`}
                    confirmLabel="Delete" confirmColor="#dc2626" onConfirm={doDelete} onCancel={()=>setConfirm(null)}/>
            )}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGES PAGE
   Key fix: globalCounts fetched from /counts endpoint
   — stat cards always reflect true DB totals
   — unread count updates immediately on read/status change
══════════════════════════════════════════════════════════ */
export default function Messages() {
    const navigate = useNavigate();
    const { toasts, addToast } = useToast();

    const [messages,      setMessages]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [selected,      setSelected]      = useState(null);
    const [search,        setSearch]        = useState("");
    const [statusFilter,  setStatus]        = useState("");
    const [senderFilter,  setSender]        = useState("");
    const [page,          setPage]          = useState(1);
    const [meta,          setMeta]          = useState(null);
    /* True global counts — never affected by current filter/search */
    const [counts,        setCounts]        = useState({ total:0, unread:0, read:0, replied:0 });

    /* ── Fetch global counts from dedicated endpoint ── */
    const loadCounts = useCallback(async () => {
        try {
            const res  = await fetch(`${API_URL}/admin/contact-messages/counts`, { headers: authHeader() });
            if (!res.ok) return;
            const data = await res.json();
            setCounts({ total: data.total??0, unread: data.unread??0, read: data.read??0, replied: data.replied??0 });
        } catch (_) {}
    }, []);

    /* ── Fetch filtered message list ── */
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 15 });
            if (statusFilter) params.set("status",      statusFilter);
            if (senderFilter) params.set("sender_type", senderFilter);
            if (search)       params.set("search",      search);

            const res = await fetch(`${API_URL}/admin/contact-messages?${params}`, { headers: authHeader() });
            if (res.status===401) { navigate("/admin/login"); return; }
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) { setMessages(data); setMeta(null); }
                else { setMessages(data.data||[]); setMeta(data); }
            }
        } catch (_) {}
        finally { setLoading(false); }
    }, [page, statusFilter, senderFilter, search, navigate]);

    useEffect(() => { load(); loadCounts(); }, [load, loadCounts]);
    useEffect(() => { setPage(1); }, [statusFilter, senderFilter, search]);

    /* Open detail — optimistically mark unread → read */
    async function openDetail(msg) {
        try {
            const res  = await fetch(`${API_URL}/admin/contact-messages/${msg.id}`, { headers: authHeader() });
            const data = res.ok ? await res.json() : msg;
            if (msg.status==="unread") {
                setMessages(prev => prev.map(m => m.id===msg.id ? {...m,status:"read"} : m));
                /* Decrement unread, increment read immediately */
                setCounts(c => ({ ...c, unread: Math.max(0, c.unread-1), read: c.read+1 }));
            }
            setSelected(data);
        } catch (_) { setSelected(msg); }
    }

    function handleUpdated(updated) {
        setMessages(prev => prev.map(m => m.id===updated.id ? updated : m));
        if (selected?.id===updated.id) setSelected(updated);
        /* Refresh true counts after any status change */
        loadCounts();
    }

    function handleDeleted(id) {
        setMessages(prev => prev.filter(m => m.id!==id));
        setSelected(null);
        loadCounts();
    }

    const statCards = [
        { label:"Total",   value:counts.total,   bg:"#f0f4ff", color:NAV,        border:NAV+"20",    filterVal:""        },
        { label:"Unread",  value:counts.unread,  bg:"#fef9c3", color:"#713f12",  border:"#ca8a0440", filterVal:"unread"  },
        { label:"Replied", value:counts.replied, bg:"#dcfce7", color:"#14532d",  border:"#16a34a40", filterVal:"replied" },
    ];

    return (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Header */}
            <div style={{ background:NAV, borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                    <p style={{ margin:0, fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:GOLD, opacity:0.7 }}>Admin Panel</p>
                    <h1 style={{ margin:"4px 0 0", fontSize:22, fontWeight:800, color:"#fff", fontFamily:SERIF }}>Contact Messages</h1>
                </div>
                <button onClick={()=>{load();loadCounts();}} style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", padding:"10px 20px", background:GOLD, color:NAV, border:"none", borderRadius:8, cursor:"pointer" }}>↻ Refresh</button>
            </div>

            {/* Stat cards — always show global counts */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10 }}>
                {statCards.map(card => {
                    const isSel = statusFilter===card.filterVal;
                    return (
                        <div key={card.label} onClick={()=>{ setStatus(card.filterVal); setPage(1); }}
                            style={{ background:card.bg, borderRadius:12, padding:"16px 18px", border:"2px solid "+(isSel?card.color:card.border), cursor:"pointer", transition:"all .18s", boxShadow:isSel?"0 4px 16px "+card.color+"30":"none", transform:isSel?"translateY(-2px)":"none", position:"relative" }}
                            onMouseEnter={e=>{ if(!isSel){e.currentTarget.style.borderColor=card.color;e.currentTarget.style.boxShadow="0 2px 8px "+card.color+"20";} }}
                            onMouseLeave={e=>{ if(!isSel){e.currentTarget.style.borderColor=card.border;e.currentTarget.style.boxShadow="none";} }}>
                            {isSel && (
                                <div style={{ position:"absolute", top:10, right:12, width:18, height:18, background:card.color, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            )}
                            <p style={{ margin:0, fontSize:30, fontWeight:900, color:card.color, fontFamily:SERIF, lineHeight:1 }}>{card.value}</p>
                            <p style={{ margin:"6px 0 0", fontSize:10, fontWeight:700, color:card.color, opacity:0.65, textTransform:"uppercase", letterSpacing:"0.1em" }}>{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ background:"#fff", borderRadius:12, padding:"14px 18px", border:"1.5px solid #f1f5f9", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                <input type="text" placeholder="Search by name, email or subject…" value={search} onChange={e=>setSearch(e.target.value)}
                    style={{ flex:"1 1 180px", fontSize:13, fontFamily:SERIF, color:"#1a1a1a", padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", minWidth:150 }}/>
                <select value={statusFilter} onChange={e=>{setStatus(e.target.value);setPage(1);}}
                    style={{ fontSize:12, fontFamily:SERIF, color:"#334155", padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", cursor:"pointer" }}>
                    <option value="">All Statuses</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                </select>
                <select value={senderFilter} onChange={e=>{setSender(e.target.value);setPage(1);}}
                    style={{ fontSize:12, fontFamily:SERIF, color:"#334155", padding:"9px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, outline:"none", background:"#f8fafc", cursor:"pointer" }}>
                    <option value="">All Senders</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Staff</option>
                    <option value="other">Other</option>
                </select>
                {(search||statusFilter||senderFilter) && (
                    <button onClick={()=>{setSearch("");setStatus("");setSender("");setPage(1);}}
                        style={{ fontSize:11, fontWeight:700, padding:"9px 14px", background:"#fef2f2", border:"1.5px solid #fecaca", color:"#dc2626", borderRadius:8, cursor:"pointer" }}>Clear ×</button>
                )}
            </div>

            {/* Table */}
            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", border:"1.5px solid #f1f5f9", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:4, height:18, background:GOLD, borderRadius:2 }}/>
                        <span style={{ fontSize:13, fontWeight:800, color:NAV }}>Inbox</span>
                    </div>
                    {meta && <span style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{meta.from}–{meta.to} of {meta.total}</span>}
                </div>

                <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:600 }}>
                        <thead>
                            <tr style={{ background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                                <th style={{ padding:"12px 16px", width:60 }}></th>
                                {["Sender","Subject","Type","Status",""].map(h=>(
                                    <th key={h} style={{ padding:"12px 16px", textAlign:h===""?"right":"left", fontSize:9, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:"#64748b", whiteSpace:"nowrap" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && Array.from({length:5}).map((_,i)=>(
                                <tr key={i} style={{ borderBottom:"1px solid #f8fafc" }}>
                                    <td style={{ padding:"14px 16px" }}><div style={{ width:44, height:44, borderRadius:"50%", background:"#f1f5f9" }}/></td>
                                    {[160,180,90,90,60].map((w,j)=>(
                                        <td key={j} style={{ padding:"14px 16px" }}>
                                            <div style={{ height:13, width:w, background:"#f1f5f9", borderRadius:6 }}/>
                                            {j===0 && <div style={{ height:10, width:80, background:"#f1f5f9", borderRadius:4, marginTop:6 }}/>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {!loading && messages.length===0 && (
                                <tr><td colSpan={6} style={{ padding:"60px 20px", textAlign:"center" }}>
                                    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                                        <div style={{ width:56, height:56, background:"#f1f5f9", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        </div>
                                        <p style={{ margin:0, fontSize:14, color:"#94a3b8", fontFamily:SERIF }}>No messages found.</p>
                                    </div>
                                </td></tr>
                            )}
                            {!loading && messages.map(m=>{
                                const isUnread = m.status==="unread";
                                return (
                                    <tr key={m.id} onClick={()=>openDetail(m)}
                                        style={{ borderBottom:"1px solid #f8fafc", cursor:"pointer", transition:"background .1s", background:isUnread?"#fffbeb":"transparent" }}
                                        onMouseEnter={ev=>{ev.currentTarget.style.background="#f0f4ff";}}
                                        onMouseLeave={ev=>{ev.currentTarget.style.background=isUnread?"#fffbeb":"transparent";}}>
                                        <td style={{ padding:"12px 16px" }}><SenderAvatar msg={m} size={44}/></td>
                                        <td style={{ padding:"12px 16px" }}>
                                            <p style={{ margin:0, fontWeight:isUnread?900:700, color:NAV, fontFamily:SERIF, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>{m.name}</p>
                                            <p style={{ margin:"2px 0 0", fontSize:11, color:"#94a3b8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.email}</p>
                                        </td>
                                        <td style={{ padding:"12px 16px" }}>
                                            <p style={{ margin:0, fontSize:13, color:"#334155", fontFamily:SERIF, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:isUnread?700:400, maxWidth:160 }}>{m.subject}</p>
                                            <p style={{ margin:"2px 0 0", fontSize:10, color:"#94a3b8" }}>{formatDate(m.created_at)}</p>
                                        </td>
                                        <td style={{ padding:"12px 16px" }}><SenderBadge type={m.sender_type}/></td>
                                        <td style={{ padding:"12px 16px" }}><StatusBadge status={m.status}/></td>
                                        <td style={{ padding:"12px 16px", textAlign:"right" }}>
                                            <button onClick={ev=>{ev.stopPropagation();openDetail(m);}}
                                                style={{ fontSize:11, fontWeight:800, padding:"8px 16px", background:NAV, color:GOLD, border:"none", borderRadius:8, cursor:"pointer", whiteSpace:"nowrap" }}
                                                onMouseEnter={ev=>{ev.currentTarget.style.opacity="0.85";}}
                                                onMouseLeave={ev=>{ev.currentTarget.style.opacity="1";}}>
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {meta && meta.last_page>1 && (
                    <div style={{ padding:"14px 20px", borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                        <span style={{ fontSize:12, color:"#94a3b8", fontFamily:SERIF }}>Page {meta.current_page} of {meta.last_page}</span>
                        <div style={{ display:"flex", gap:8 }}>
                            {[["← Prev",-1],["Next →",1]].map(([label,dir])=>{
                                const disabled = dir===-1?meta.current_page<=1:meta.current_page>=meta.last_page;
                                return (
                                    <button key={label} onClick={()=>setPage(p=>p+dir)} disabled={disabled}
                                        style={{ fontSize:11, fontWeight:700, padding:"9px 18px", background:disabled?"#f1f5f9":NAV, color:disabled?"#cbd5e1":GOLD, border:"none", borderRadius:8, cursor:disabled?"not-allowed":"pointer" }}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {selected && (
                <DetailModal message={selected} onClose={()=>setSelected(null)} onUpdated={handleUpdated} onDeleted={handleDeleted} addToast={addToast}/>
            )}
            <Toast toasts={toasts}/>
        </div>
    );
}