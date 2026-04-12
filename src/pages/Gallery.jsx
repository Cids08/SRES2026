import { useState, useEffect } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

function ChevLeft() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}
function ChevRight() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}
function IconX() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function IconDown() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}

const ALBUMS = [
  { id: "sports",     label: "Sports Events",  desc: "Field day, tournaments & more",     count: 24, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `Sports Day — Photo ${i+1}` })) },
  { id: "graduation", label: "Graduation",      desc: "Class of 2025 ceremony",            count: 18, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `Graduation — Photo ${i+1}` })) },
  { id: "arts",       label: "Arts & Music",    desc: "Plays, concerts & exhibitions",     count: 15, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `Arts Night — Photo ${i+1}` })) },
  { id: "trips",      label: "Field Trips",     desc: "Educational tours & excursions",    count: 20, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `Field Trip — Photo ${i+1}` })) },
  { id: "science",    label: "Science Fair",    desc: "Student projects & experiments",    count: 12, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `Science Fair — Photo ${i+1}` })) },
  { id: "events",     label: "School Events",   desc: "Celebrations & special gatherings", count: 22, photos: Array.from({ length: 9 }, (_, i) => ({ id: i+1, src: "/images/1.png", caption: `School Event — Photo ${i+1}` })) },
];

const ROMAN = ["I","II","III","IV","V","VI"];

export default function Gallery() {
  const [activeId, setActiveId] = useState(null);
  const [modal, setModal] = useState(null);
  const album = ALBUMS.find((a) => a.id === activeId);

  useEffect(() => {
    function onKey(e) {
      if (!modal || !album) return;
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft")  nav(-1);
      if (e.key === "Escape")     setModal(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, album]);

  function nav(dir) {
    if (!modal || !album) return;
    const newIdx = (modal.index + dir + album.photos.length) % album.photos.length;
    setModal({ photo: album.photos[newIdx], index: newIdx });
  }

  return (
    <div style={{ background: "#f2efe8", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{ background: "#0a1f52", position: "relative", overflow: "hidden", minHeight: 340 }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: "60%", height: "100%", clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}>
          <img src={HERO_IMG} alt="SRES Campus" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,31,82,0.45)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(to right, #92400e, #facc15, #92400e)", zIndex: 10 }} />

        {/* Content — left-aligned, flex column, same as About */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "80px 24px 96px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p style={{ color: "#facc15", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
              San Roque Elementary School
            </p>
            <h1 style={{ margin: "0 0 20px 0", color: "#fff", fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
              Photo <span style={{ color: "#facc15" }}>Gallery</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 448, margin: 0 }}>
              Capturing school memories that last a lifetime. Browse our collection of moments and milestones.
            </p>
          </div>
        </div>
      </section>

      {/* ── BREADCRUMB BAR ── */}
      <div style={{ background: "#0a1f52", borderBottom: "4px solid #f5c518" }}>
        {activeId ? (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", gap: 0 }}>
            <button onClick={() => setActiveId(null)} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 20px", border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.48)", display: "flex", alignItems: "center", gap: 8 }}>
              ← All Albums
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>|</span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 20px", color: "#f5c518", background: "#f5c51820" }}>
              {album?.label}
            </span>
          </div>
        ) : (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "13px 40px" }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f5c518" }}>{ALBUMS.length} Albums</span>
          </div>
        )}
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 40px 72px" }}>

        {/* ALBUM GRID */}
        {!activeId && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 4, height: 18, background: "#f5c518" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a1f52" }}>Select an Album</span>
              <div style={{ flex: 1, height: 1, background: "#0a1f52", opacity: 0.1 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {ALBUMS.map((al, i) => (
                <button key={al.id} onClick={() => setActiveId(al.id)}
                  style={{ all: "unset", cursor: "pointer", display: "block", background: "#fff", border: "1.5px solid #0a1f52", overflow: "hidden", transition: "transform 0.18s, box-shadow 0.18s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(10,31,82,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#0a1f52" }}>
                    <img src={al.photos[0].src} alt={al.label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "grayscale(60%)" }} onError={(e) => { e.target.style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: "rgba(245,197,24,0.18)", fontFamily: "Georgia, serif", letterSpacing: "-0.02em", userSelect: "none" }}>{ROMAN[i]}</span>
                    </div>
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#f5c518", padding: "3px 10px" }}>
                      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0a1f52" }}>{al.count} photos</span>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", borderTop: "3px solid #f5c518" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: "#0a1f52", fontFamily: "Georgia, serif" }}>{al.label}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#5a5a5a" }}>{al.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* PHOTOS GRID */}
        {activeId && album && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 4, height: 18, background: "#f5c518" }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a1f52" }}>{album.photos.length} Photos</span>
              <div style={{ flex: 1, height: 1, background: "#0a1f52", opacity: 0.1 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
              {album.photos.map((photo, idx) => (
                <button key={photo.id} onClick={() => setModal({ photo, index: idx })}
                  style={{ all: "unset", cursor: "zoom-in", display: "block", position: "relative", aspectRatio: "1", overflow: "hidden", background: "#0a1f52", border: "1.5px solid #0a1f52" }}
                  onMouseEnter={(e) => { e.currentTarget.querySelector("img").style.opacity = "0.55"; e.currentTarget.querySelector(".cap").style.opacity = "1"; }}
                  onMouseLeave={(e) => { e.currentTarget.querySelector("img").style.opacity = "0.9"; e.currentTarget.querySelector(".cap").style.opacity = "0"; }}
                >
                  <img src={photo.src} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9, transition: "opacity 0.2s" }} onError={(e) => { e.target.style.opacity = "0.1"; }} />
                  <div className="cap" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 10px", background: "#0a1f52", opacity: 0, transition: "opacity 0.2s" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#f5c518", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.caption}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── LIGHTBOX ── */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(10,31,82,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", maxWidth: 700, width: "100%", border: "1.5px solid #f5c518", overflow: "hidden" }}>
            <div style={{ background: "#0a1f52", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#f5c518", letterSpacing: "0.1em" }}>{modal.photo.caption}</span>
              <button onClick={() => setModal(null)} style={{ all: "unset", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center" }}><IconX /></button>
            </div>
            <div style={{ background: "#0a1f52", position: "relative" }}>
              <img src={modal.photo.src} alt={modal.photo.caption} style={{ width: "100%", maxHeight: 440, objectFit: "contain", display: "block" }} />
              {album && album.photos.length > 1 && (
                <>
                  <button onClick={() => nav(-1)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "#f5c518", border: "none", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0a1f52" }}><ChevLeft /></button>
                  <button onClick={() => nav(1)}  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#f5c518", border: "none", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0a1f52" }}><ChevRight /></button>
                </>
              )}
            </div>
            <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1.5px solid #0a1f52" }}>
              <span style={{ fontSize: 11, color: "#0a1f52", opacity: 0.45, fontWeight: 700 }}>{album ? `${modal.index + 1} / ${album.photos.length}` : ""}</span>
              <a href={modal.photo.src} download style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "7px 14px", background: "#0a1f52", color: "#f5c518", textDecoration: "none" }}>
                <IconDown /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}