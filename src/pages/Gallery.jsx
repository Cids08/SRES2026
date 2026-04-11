import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

/* ─── Inline SVG Icons ────────────────────────────────────── */
function IconArrowLeft({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
    );
}
function IconGrid({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
    );
}
function IconColumns({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="18" /><rect x="14" y="3" width="7" height="18" />
        </svg>
    );
}
function IconX({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function IconDownload({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}
function IconImage({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

/* ─── Albums Data ─────────────────────────────────────────── */
const ALBUMS = [
    {
        id: "sports",
        title: "Sports Events",
        desc: "Field day, basketball tournaments, and more",
        cover: "/images/1.png",
        count: 24,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `Sports photo ${i + 1}`,
        })),
    },
    {
        id: "graduation",
        title: "Graduation",
        desc: "Class of 2025 graduation ceremony",
        cover: "/images/1.png",
        count: 18,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `Graduation photo ${i + 1}`,
        })),
    },
    {
        id: "arts",
        title: "Arts & Music",
        desc: "School plays, concerts, and art exhibitions",
        cover: "/images/1.png",
        count: 15,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `Arts photo ${i + 1}`,
        })),
    },
    {
        id: "trips",
        title: "Field Trips",
        desc: "Educational tours and excursions",
        cover: "/images/1.png",
        count: 20,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `Field trip photo ${i + 1}`,
        })),
    },
    {
        id: "science",
        title: "Science Fair",
        desc: "Student projects and experiments",
        cover: "/images/1.png",
        count: 12,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `Science fair photo ${i + 1}`,
        })),
    },
    {
        id: "events",
        title: "School Events",
        desc: "Special celebrations and gatherings",
        cover: "/images/1.png",
        count: 22,
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            src: "/images/1.png",
            caption: `School event photo ${i + 1}`,
        })),
    },
];

export default function Gallery() {
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [view, setView] = useState("grid"); // "grid" | "masonry"
    const [modal, setModal] = useState(null); // { src, caption }

    const album = ALBUMS.find((a) => a.id === activeAlbum);

    return (
        <div className="bg-[#f4f6fb]">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                <div className="absolute inset-0 bg-[#0a1f52]" />
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img src={HERO_IMG} alt="Gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
                    <div className="absolute inset-0 bg-[#0a1f52]/45" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 z-10" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                        <div>
                            <p className="text-yellow-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3">
                                San Roque Elementary School
                            </p>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-none mb-5">
                                Photo <span className="text-yellow-400">Gallery</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                Capturing memories that last a lifetime. Explore our collection of
                                school memories and events.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* ── ALBUMS VIEW ── */}
                    {!activeAlbum && (
                        <>
                            <div className="text-center mb-12">
                                <span className="inline-block bg-yellow-500/10 text-yellow-800 border border-yellow-400/30 text-[10px] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3">
                                    Our Albums
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] mt-1 mb-2">Photo Albums</h2>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">Explore our collection of school memories and events.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ALBUMS.map((al) => (
                                    <button
                                        key={al.id}
                                        onClick={() => setActiveAlbum(al.id)}
                                        className="group text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                                    >
                                        {/* Cover photo */}
                                        <div className="relative h-48 overflow-hidden bg-[#f4f6fb]">
                                            <img
                                                src={al.cover}
                                                alt={al.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-[#0a1f52]/0 group-hover:bg-[#0a1f52]/50 transition-all duration-300 flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-[#0a1f52] text-[11px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full">
                                                    View Album
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-[#0a1f52] font-bold text-base mb-1">{al.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3">{al.desc}</p>
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{al.count} photos</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── PHOTOS VIEW ── */}
                    {activeAlbum && album && (
                        <>
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                                <button
                                    onClick={() => setActiveAlbum(null)}
                                    className="inline-flex items-center gap-2 text-[#0a1f52] font-extrabold text-sm border border-[#0a1f52]/20 bg-white px-5 py-2.5 rounded-full hover:bg-[#0a1f52] hover:text-white transition-all duration-200"
                                >
                                    <IconArrowLeft /> Back to Albums
                                </button>

                                <h2 className="text-xl font-extrabold text-[#0a1f52]">{album.title}</h2>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setView("grid")}
                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${view === "grid" ? "bg-[#0a1f52] text-white border-[#0a1f52]" : "bg-white text-gray-400 border-gray-200 hover:border-[#0a1f52]"}`}
                                    >
                                        <IconGrid />
                                    </button>
                                    <button
                                        onClick={() => setView("masonry")}
                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${view === "masonry" ? "bg-[#0a1f52] text-white border-[#0a1f52]" : "bg-white text-gray-400 border-gray-200 hover:border-[#0a1f52]"}`}
                                    >
                                        <IconColumns />
                                    </button>
                                </div>
                            </div>

                            {/* Photos grid */}
                            <div className={`grid gap-4 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"}`}>
                                {album.photos.map((photo) => (
                                    <button
                                        key={photo.id}
                                        onClick={() => setModal(photo)}
                                        className="group relative overflow-hidden rounded-xl bg-[#f4f6fb] border border-gray-100 aspect-square hover:shadow-md transition-all duration-200"
                                    >
                                        <img
                                            src={photo.src}
                                            alt={photo.caption}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display = "flex";
                                            }}
                                        />
                                        {/* Fallback */}
                                        <div className="hidden absolute inset-0 items-center justify-center text-gray-300 flex-col gap-2">
                                            <IconImage size={32} />
                                            <span className="text-xs text-gray-400">No image</span>
                                        </div>
                                        {/* Hover caption */}
                                        <div className="absolute inset-0 bg-[#0a1f52]/0 group-hover:bg-[#0a1f52]/55 transition-all duration-200 flex items-end p-3">
                                            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold transition-opacity duration-200">
                                                {photo.caption}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </section>

            {/* ── MODAL ── */}
            {modal && (
                <div
                    className="fixed inset-0 bg-[#0a1f52]/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="text-[#0a1f52] font-bold text-sm">Photo Details</h3>
                            <button
                                onClick={() => setModal(null)}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-200"
                            >
                                <IconX />
                            </button>
                        </div>
                        {/* Image */}
                        <div className="bg-[#f4f6fb]">
                            <img src={modal.src} alt={modal.caption} className="w-full max-h-96 object-contain" />
                        </div>
                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                            <p className="text-gray-500 text-sm">{modal.caption}</p>
                            <a
                                href={modal.src}
                                download
                                className="inline-flex items-center gap-2 bg-[#0a1f52] hover:bg-[#1a3a8a] text-white text-[11px] font-extrabold uppercase tracking-wide px-4 py-2 rounded-full transition-colors duration-200"
                            >
                                <IconDownload size={14} /> Download
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}