import { useState, useEffect, useCallback } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";
const API_URL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/* ── Icons ── */
function ChevLeft() {
  return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
function ChevRight() {
  return <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}
function IconX() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function IconDown() {
  return <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function IconZip() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function IconImage() {
  return <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="rgba(245,197,24,0.25)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function IconSpinner() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

function AlbumSkeleton() {
  return (
    <div style={{ background:"#fff", border:"1.5px solid #0a1f52", overflow:"hidden" }}>
      <div style={{ height:180, background:"linear-gradient(90deg,#e8e8e8 25%,#f0f0f0 50%,#e8e8e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }} />
      <div style={{ padding:"14px 16px", borderTop:"3px solid #f5c518" }}>
        <div style={{ height:14, width:"60%", background:"#e8e8e8", borderRadius:4, marginBottom:8 }} />
        <div style={{ height:11, width:"80%", background:"#f0f0f0", borderRadius:4 }} />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [albums,    setAlbums]    = useState([]);
  const [photos,    setPhotos]    = useState([]);
  const [activeId,  setActiveId]  = useState(null);
  const [modal,     setModal]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [loadingPh, setLoadingPh] = useState(false);
  const [error,     setError]     = useState(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/gallery`)
      .then(r => { if (!r.ok) throw new Error("Failed to load albums."); return r.json(); })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        setAlbums(list.filter(a => a.is_active));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeId) { setPhotos([]); return; }
    setLoadingPh(true);
    fetch(`${API_URL}/gallery/${activeId}`)
      .then(r => { if (!r.ok) throw new Error("Failed to load photos."); return r.json(); })
      .then(data => setPhotos(Array.isArray(data) ? data : (data.photos || [])))
      .catch(() => setPhotos([]))
      .finally(() => setLoadingPh(false));
  }, [activeId]);

  const nav = useCallback((dir) => {
    if (!modal || !photos.length) return;
    const newIdx = (modal.index + dir + photos.length) % photos.length;
    setModal({ photo: photos[newIdx], index: newIdx });
  }, [modal, photos]);

  useEffect(() => {
    const onKey = (e) => {
      if (!modal) return;
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft")  nav(-1);
      if (e.key === "Escape")     setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, nav]);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const album = albums.find(a => a.id === activeId);

  function photoUrl(photo) {
    if (photo.url)      return photo.url;
    if (photo.filename) return `${API_URL.replace("/api","")}/storage/gallery/${photo.filename}`;
    return "/images/1.png";
  }
  function coverUrl(al) {
    if (al.cover_url)   return al.cover_url;
    if (al.cover_image) return `${API_URL.replace("/api","")}/storage/${al.cover_image}`;
    return null;
  }

  /* ── ZIP download ── */
  async function handleBulkDownload() {
    if (!activeId || dlLoading) return;
    setDlLoading(true);
    try {
      const res = await fetch(`${API_URL}/gallery/${activeId}/download`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Download failed. Please try again.");
        return;
      }
      const blob      = await res.blob();
      const blobUrl   = URL.createObjectURL(blob);
      const albumSlug = album?.slug || `album-${activeId}`;
      const a         = document.createElement("a");
      a.href          = blobUrl;
      a.download      = `${albumSlug}-photos.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Could not download the album. Please check your connection.");
    } finally {
      setDlLoading(false);
    }
  }

  /*
   * ✅ FIXED: Single photo download
   * Instead of fetch() (blocked by CORS), we hit the Laravel proxy route
   * GET /api/gallery/{album}/photos/{photo}/download
   * The server sends Content-Disposition: attachment so the browser saves it.
   * We use a hidden <a> click — no CORS, no blob fetch, no errors.
   */
  function handlePhotoDownload() {
    if (!modal || !activeId) return;
    const url = `${API_URL}/gallery/${activeId}/photos/${modal.photo.id}/download`;
    const a   = document.createElement("a");
    a.href    = url;
    // target="_blank" lets the browser handle the Content-Disposition: attachment
    // header from the server without navigating away from the page
    a.target  = "_blank";
    a.rel     = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const [touchStart, setTouchStart] = useState(null);
  function onTouchStart(e) { setTouchStart(e.touches[0].clientX); }
  function onTouchEnd(e) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) nav(diff > 0 ? 1 : -1);
    setTouchStart(null);
  }

  return (
    <div style={{ background:"#f2efe8", minHeight:"100vh" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        .album-btn:hover  { transform:translateY(-4px) !important; box-shadow:0 10px 32px rgba(10,31,82,0.18) !important; }
        .album-btn:hover .album-cover-img { transform:scale(1.05); }
        .photo-btn:hover .photo-img { opacity:0.5 !important; }
        .photo-btn:hover .photo-cap { opacity:1 !important; }
        .nav-arrow:hover  { background:#f5c518 !important; transform:translateY(-50%) scale(1.08) !important; }
        .dl-btn:hover     { background:#f5c518 !important; color:#0a1f52 !important; }
        .bulk-btn:hover:not(:disabled) { background:#f5c518 !important; color:#0a1f52 !important; }
        .back-btn:hover   { color:rgba(255,255,255,0.85) !important; }
        .thumb-strip::-webkit-scrollbar { height:4px; }
        .thumb-strip::-webkit-scrollbar-track { background:rgba(255,255,255,0.08); }
        .thumb-strip::-webkit-scrollbar-thumb { background:#f5c518; border-radius:2px; }
        @media (max-width:640px) {
          .hero-title { font-size:2.4rem !important; }
          .main-pad   { padding:24px 16px 56px !important; }
          .breadcrumb { padding:0 16px !important; }
          .album-grid { grid-template-columns:1fr !important; }
          .photo-grid { grid-template-columns:repeat(2, 1fr) !important; }
          .lightbox-inner { width:100% !important; max-width:100% !important; border-radius:0 !important; min-height:100dvh; flex-direction:column; }
          .lightbox-img   { max-height:55dvh !important; }
          .lightbox-footer { flex-wrap:wrap; gap:8px !important; }
          .lightbox-thumb-strip { display:none !important; }
          .bulk-bar { flex-direction:column; align-items:flex-start !important; gap:10px !important; }
        }
        @media (max-width:380px) { .hero-title { font-size:2rem !important; } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:"#0a1f52", position:"relative", overflow:"hidden", minHeight:300 }}>
        <div style={{ position:"absolute", right:0, top:0, width:"60%", height:"100%", clipPath:"polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}>
          <img src={HERO_IMG} alt="SRES Campus" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
          <div style={{ position:"absolute", inset:0, background:"rgba(10,31,82,0.45)" }} />
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"linear-gradient(to right,#92400e,#facc15,#92400e)", zIndex:10 }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"72px 24px 88px" }}>
          <p style={{ color:"#facc15", fontSize:11, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 12px" }}>
            San Roque Elementary School
          </p>
          <h1 className="hero-title" style={{ margin:"0 0 18px", color:"#fff", fontSize:"clamp(2.4rem,6vw,4.5rem)", fontWeight:800, lineHeight:1, letterSpacing:"-0.02em" }}>
            Photo <span style={{ color:"#facc15" }}>Gallery</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.7, maxWidth:440, margin:0 }}>
            Capturing school memories that last a lifetime. Browse our collection of moments and milestones.
          </p>
        </div>
      </section>

      {/* ── BREADCRUMB BAR ── */}
      <div style={{ background:"#0a1f52", borderBottom:"4px solid #f5c518" }}>
        {activeId ? (
          <div className="breadcrumb" style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px", display:"flex", alignItems:"center", gap:0, flexWrap:"wrap" }}>
            <button
              className="back-btn"
              onClick={() => { setActiveId(null); setModal(null); setDlLoading(false); }}
              style={{ fontSize:11, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", padding:"14px 20px", border:"none", cursor:"pointer", background:"transparent", color:"rgba(255,255,255,0.45)", display:"flex", alignItems:"center", gap:8, transition:"color 0.18s" }}
            >
              ← All Albums
            </button>
            <span style={{ color:"rgba(255,255,255,0.2)", fontSize:16 }}>|</span>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", padding:"14px 20px", color:"#f5c518", background:"rgba(245,197,24,0.12)" }}>
              {album?.title || "Album"}
            </span>
            {!loadingPh && (
              <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", marginLeft:4 }}>
                · {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        ) : (
          <div className="breadcrumb" style={{ maxWidth:1100, margin:"0 auto", padding:"14px 40px" }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"#f5c518" }}>
              {loading ? "Loading…" : `${albums.length} Album${albums.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}
      </div>

      {/* ── MAIN ── */}
      <main className="main-pad" style={{ maxWidth:1100, margin:"0 auto", padding:"44px 40px 80px" }}>

        {error && !loading && (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ width:56, height:56, background:"#fee2e2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:"#0a1f52", margin:"0 0 8px", fontFamily:"Georgia,serif" }}>Could not load gallery</p>
            <p style={{ fontSize:13, color:"#64748b", margin:0 }}>{error}</p>
          </div>
        )}

        {/* ── ALBUM GRID ── */}
        {!activeId && !error && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
              <div style={{ width:4, height:18, background:"#f5c518" }} />
              <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", color:"#0a1f52" }}>Select an Album</span>
              <div style={{ flex:1, height:1, background:"#0a1f52", opacity:0.1 }} />
            </div>
            {loading && (
              <div className="album-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
                {Array.from({ length:6 }).map((_,i) => <AlbumSkeleton key={i} />)}
              </div>
            )}
            {!loading && albums.length === 0 && (
              <div style={{ padding:"64px 24px", textAlign:"center" }}>
                <div style={{ width:72, height:72, background:"#e8e4da", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
                  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#0a1f52" strokeWidth={1.5} opacity={0.4}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <p style={{ fontSize:16, fontWeight:800, color:"#0a1f52", fontFamily:"Georgia,serif", margin:"0 0 8px" }}>No albums yet</p>
                <p style={{ fontSize:13, color:"#64748b", margin:0 }}>Check back soon — photos will appear here when albums are published.</p>
              </div>
            )}
            {!loading && albums.length > 0 && (
              <div className="album-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
                {albums.map((al, i) => {
                  const cover = coverUrl(al);
                  return (
                    <button
                      key={al.id}
                      className="album-btn"
                      onClick={() => setActiveId(al.id)}
                      style={{ all:"unset", cursor:"pointer", display:"block", background:"#fff", border:"1.5px solid #0a1f52", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s", animation:"fadeIn .3s ease both", animationDelay:`${i*50}ms` }}
                    >
                      <div style={{ position:"relative", height:180, overflow:"hidden", background:"#0a1f52" }}>
                        {cover ? (
                          <img className="album-cover-img" src={cover} alt={al.title}
                            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.3s" }}
                            onError={e => { e.target.style.display="none"; }}
                          />
                        ) : (
                          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:56, fontWeight:900, color:"rgba(245,197,24,0.18)", fontFamily:"Georgia,serif", userSelect:"none" }}>
                              {ROMAN[i] || i+1}
                            </span>
                          </div>
                        )}
                        <div style={{ position:"absolute", top:10, right:10, background:"#f5c518", padding:"3px 10px" }}>
                          <span style={{ fontSize:9, fontWeight:900, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0a1f52" }}>
                            {al.photo_count || 0} photos
                          </span>
                        </div>
                      </div>
                      <div style={{ padding:"14px 16px", borderTop:"3px solid #f5c518" }}>
                        <h3 style={{ margin:"0 0 4px", fontSize:14, fontWeight:800, color:"#0a1f52", fontFamily:"Georgia,serif" }}>{al.title}</h3>
                        <p style={{ margin:0, fontSize:12, color:al.description ? "#5a5a5a" : "#cbd5e1", fontStyle:al.description ? "normal" : "italic" }}>
                          {al.description || "No description"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── PHOTOS VIEW ── */}
        {activeId && !error && (
          <>
            <div className="bulk-bar" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:4, height:18, background:"#f5c518", flexShrink:0 }} />
                <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", color:"#0a1f52" }}>
                  {loadingPh ? "Loading…" : `${photos.length} Photo${photos.length !== 1 ? "s" : ""}`}
                </span>
              </div>
              {!loadingPh && photos.length > 0 && (
                <button className="bulk-btn" onClick={handleBulkDownload} disabled={dlLoading}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", background:"#0a1f52", color:"#f5c518", border:"none", cursor: dlLoading ? "not-allowed" : "pointer", fontSize:11, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", transition:"background 0.18s, color 0.18s", opacity: dlLoading ? 0.7 : 1, flexShrink:0 }}>
                  {dlLoading ? <><IconSpinner />Zipping…</> : <><IconZip />Download All</>}
                </button>
              )}
            </div>

            {loadingPh && (
              <div className="photo-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                {Array.from({ length:9 }).map((_,i) => (
                  <div key={i} style={{ aspectRatio:"1", background:"linear-gradient(90deg,#e8e8e8 25%,#f0f0f0 50%,#e8e8e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite", border:"1.5px solid #0a1f52" }} />
                ))}
              </div>
            )}

            {!loadingPh && photos.length === 0 && (
              <div style={{ padding:"64px 24px", textAlign:"center" }}>
                <div style={{ width:72, height:72, background:"#e8e4da", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
                  <IconImage />
                </div>
                <p style={{ fontSize:15, fontWeight:700, color:"#0a1f52", fontFamily:"Georgia,serif", margin:"0 0 8px" }}>No photos in this album yet</p>
                <p style={{ fontSize:13, color:"#64748b", margin:0 }}>Photos will appear here once they're uploaded.</p>
              </div>
            )}

            {!loadingPh && photos.length > 0 && (
              <div className="photo-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                {photos.map((photo, idx) => (
                  <button key={photo.id} className="photo-btn"
                    onClick={() => setModal({ photo, index: idx })}
                    style={{ all:"unset", cursor:"zoom-in", display:"block", position:"relative", aspectRatio:"1", overflow:"hidden", background:"#0a1f52", border:"1.5px solid #0a1f52", animation:"fadeIn .25s ease both", animationDelay:`${idx*30}ms` }}
                  >
                    <img className="photo-img" src={photoUrl(photo)} alt={photo.caption || photo.title || "Photo"}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity:0.9, transition:"opacity 0.22s" }}
                      onError={e => { e.target.style.opacity="0.1"; }}
                    />
                    <div className="photo-cap" style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 10px", background:"linear-gradient(transparent,#0a1f52)", opacity:0, transition:"opacity 0.22s" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#f5c518", display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {photo.caption || photo.title || `Photo ${idx+1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── LIGHTBOX ── */}
      {modal && (
        <div onClick={() => setModal(null)}
          style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(5,12,35,0.96)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? 0 : 20 }}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
            style={{ background:"#fff", width:"100%", maxWidth: isMobile ? "100%" : "min(92vw, 1100px)", maxHeight: isMobile ? "100dvh" : "95vh", border: isMobile ? "none" : "2px solid #f5c518", display:"flex", flexDirection:"column", overflow:"hidden", animation:"scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}>

            {/* Header */}
            <div style={{ background:"#0a1f52", padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                <div style={{ width:3, height:16, background:"#f5c518", flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:800, color:"#f5c518", letterSpacing:"0.06em", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"calc(100vw - 120px)" }}>
                  {modal.photo.caption || modal.photo.title || album?.title || "Photo"}
                </span>
              </div>
              <button onClick={() => setModal(null)}
                style={{ all:"unset", cursor:"pointer", color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", padding:"4px", borderRadius:4, flexShrink:0, marginLeft:12 }}>
                <IconX />
              </button>
            </div>

            {/* Image */}
            <div style={{ position:"relative", background:"#0c1830", flex:1, minHeight:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img className="lightbox-img" key={modal.photo.id} src={photoUrl(modal.photo)} alt={modal.photo.caption || modal.photo.title || "Photo"}
                style={{ display:"block", maxWidth:"100%", maxHeight: isMobile ? "55dvh" : "calc(95vh - 180px)", objectFit:"contain", animation:"scaleIn 0.2s ease" }}
                onError={e => { e.target.style.opacity="0.15"; }}
              />
              {photos.length > 1 && (
                <>
                  <button className="nav-arrow" onClick={() => nav(-1)}
                    style={{ position:"absolute", left: isMobile ? 8 : 16, top:"50%", transform:"translateY(-50%)", background:"rgba(245,197,24,0.9)", border:"none", width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#0a1f52", transition:"background 0.18s, transform 0.18s", boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
                    <ChevLeft />
                  </button>
                  <button className="nav-arrow" onClick={() => nav(1)}
                    style={{ position:"absolute", right: isMobile ? 8 : 16, top:"50%", transform:"translateY(-50%)", background:"rgba(245,197,24,0.9)", border:"none", width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#0a1f52", transition:"background 0.18s, transform 0.18s", boxShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
                    <ChevRight />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && !isMobile && (
              <div className="lightbox-thumb-strip thumb-strip"
                style={{ background:"#060e22", padding:"10px 14px", display:"flex", gap:6, overflowX:"auto", flexShrink:0 }}>
                {photos.map((p, i) => (
                  <button key={p.id} onClick={() => setModal({ photo: p, index: i })}
                    style={{ all:"unset", cursor:"pointer", flexShrink:0, width:52, height:52, border: i === modal.index ? "2.5px solid #f5c518" : "2px solid transparent", overflow:"hidden", opacity: i === modal.index ? 1 : 0.45, transition:"opacity 0.18s, border-color 0.18s" }}>
                    <img src={photoUrl(p)} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="lightbox-footer" style={{ padding:"11px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1.5px solid #e2e8f0", flexShrink:0, gap:12, background:"#fff" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:"#0a1f52", opacity:0.5, fontWeight:700, fontFamily:"Georgia,serif" }}>
                  {modal.index+1} <span style={{ opacity:0.4 }}>/</span> {photos.length}
                </span>
                {photos.length <= 20 && (
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    {photos.map((_,i) => (
                      <button key={i} onClick={() => setModal({ photo: photos[i], index: i })}
                        style={{ all:"unset", cursor:"pointer", width: i === modal.index ? 18 : 6, height:6, background: i === modal.index ? "#f5c518" : "#0a1f52", borderRadius: i === modal.index ? 3 : "50%", opacity: i === modal.index ? 1 : 0.25, transition:"all 0.22s", flexShrink:0 }}
                        aria-label={`Go to photo ${i+1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ FIXED: Direct link to Laravel proxy — no fetch, no CORS */}
              <button className="dl-btn" onClick={handlePhotoDownload}
                style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", padding:"9px 16px", background:"#0a1f52", color:"#f5c518", border:"none", cursor:"pointer", transition:"background 0.18s, color 0.18s", flexShrink:0 }}>
                <IconDown />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}