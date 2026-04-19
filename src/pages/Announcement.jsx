import { useState, useEffect, useCallback } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";
const NAV      = "#0a1f52";
const GOLD     = "#f5c518";
const BG       = "#f2efe8";
const SERIF    = "Georgia, serif";
const API_URL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const PRIORITY = {
    high:   { label: "Action Required", bar: "#c0392b" },
    medium: { label: "Please Note",     bar: "#e67e00" },
    low:    { label: "Info",            bar: "#0a6640" },
};

const TABS = [
    { key: "all",          label: "All"           },
    { key: "announcement", label: "Announcements" },
    { key: "news",         label: "News & Events" },
];

function PriorityFlag({ importance }) {
    const p = PRIORITY[importance] || PRIORITY.low;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "3px 10px", border: `1.5px solid ${p.bar}`, color: p.bar, background: `${p.bar}12` }}>
            <span style={{ width: 6, height: 6, background: p.bar, display: "inline-block" }} />
            {p.label}
        </span>
    );
}

function CategoryBadge({ label }) {
    return (
        <span style={{ display: "inline-block", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "3px 10px", background: GOLD, color: NAV }}>
            {label}
        </span>
    );
}

function normalizeDetails(details) {
    if (!details) return "";
    if (typeof details === "string") return details;
    const parts = [];
    if (details.body)                        parts.push(details.body);
    if (Array.isArray(details.highlights))   parts.push(...details.highlights);
    if (Array.isArray(details.items))        parts.push(...details.items.map(i => `${i.label}: ${i.value}`));
    return parts.join("\n");
}

function DetailBody({ details }) {
    const text = normalizeDetails(details);
    if (!text) return null;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;
    if (lines.length === 1) {
        return (
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontFamily: SERIF }}>
                {lines[0]}
            </p>
        );
    }
    return (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {lines.map((line, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.82)", fontFamily: SERIF, lineHeight: 1.5 }}>
                    <span style={{ width: 10, height: 10, background: GOLD, flexShrink: 0, marginTop: 3 }} />
                    {line}
                </li>
            ))}
        </ul>
    );
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
}

function AnnouncementCard({ item }) {
    const [open, setOpen] = useState(false);
    const p = PRIORITY[item.importance] || PRIORITY.low;
    const detailsText = normalizeDetails(item.details);
    const hasDetails  = detailsText.trim().length > 0;

    return (
        <article style={{ background: "#fff", border: `1.5px solid ${NAV}`, overflow: "hidden" }}>
            <div style={{ display: "flex", minHeight: item.image_url ? 140 : "auto" }}>
                <div style={{ width: 5, background: p.bar, flexShrink: 0 }} />
                {item.image_url && (
                    <div style={{ width: 180, flexShrink: 0, overflow: "hidden", background: "#e4e0d4" }}>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>
                )}
                <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <PriorityFlag importance={item.importance} />
                        {item.category?.name && (
                            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: NAV, opacity: 0.45 }}>
                                {item.category.name}
                            </span>
                        )}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: NAV, lineHeight: 1.3, fontFamily: SERIF }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#3a3a3a", lineHeight: 1.75, fontFamily: SERIF }}>{item.content}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e4e0d4", marginTop: "auto", flexWrap: "wrap", gap: 8 }}>
                        <time style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAV, opacity: 0.45 }}>
                            Posted: {item.date || formatDate(item.posted_at)}
                        </time>
                        {hasDetails && (
                            <button onClick={() => setOpen(!open)}
                                style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px", border: `1.5px solid ${NAV}`, cursor: "pointer", background: open ? NAV : "transparent", color: open ? GOLD : NAV, transition: "all 0.15s" }}>
                                {open ? "Close" : "See Details"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {open && hasDetails && (
                <div style={{ borderTop: `1.5px solid ${NAV}`, background: NAV, padding: "18px 20px 20px" }}>
                    <DetailBody details={item.details} />
                </div>
            )}
        </article>
    );
}

function NewsCard({ item }) {
    const [open, setOpen] = useState(false);
    const detailsText = normalizeDetails(item.details);
    const hasDetails  = detailsText.trim().length > 0;

    return (
        <article style={{ background: "#fff", border: `1.5px solid ${NAV}`, overflow: "hidden" }}>
            <div style={{ display: "flex", minHeight: item.image_url ? 140 : "auto" }}>
                <div style={{ width: 5, background: GOLD, flexShrink: 0 }} />
                {item.image_url && (
                    <div style={{ width: 180, flexShrink: 0, overflow: "hidden", background: "#e4e0d4" }}>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>
                )}
                <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <CategoryBadge label={item.category?.name || "News"} />
                        {item.is_featured && (
                            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, background: NAV, padding: "3px 8px" }}>
                                Featured
                            </span>
                        )}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: NAV, lineHeight: 1.3, fontFamily: SERIF }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#3a3a3a", lineHeight: 1.75, fontFamily: SERIF }}>{item.content}</p>
                    {(item.event_date || item.event_location) && (
                        <p style={{ margin: 0, fontSize: 12, color: NAV, opacity: 0.6, fontFamily: SERIF }}>
                            {item.event_date ? formatDate(item.event_date) : ""}
                            {item.event_date && item.event_location ? " · " : ""}
                            {item.event_location || ""}
                        </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e4e0d4", marginTop: "auto", flexWrap: "wrap", gap: 8 }}>
                        <time style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAV, opacity: 0.45 }}>
                            {item.date || formatDate(item.posted_at)}
                        </time>
                        {hasDetails && (
                            <button onClick={() => setOpen(!open)}
                                style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px", border: `1.5px solid ${NAV}`, cursor: "pointer", background: open ? NAV : "transparent", color: open ? GOLD : NAV, transition: "all 0.15s" }}>
                                {open ? "Close" : "Read More"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {open && hasDetails && (
                <div style={{ borderTop: `1.5px solid ${NAV}`, background: NAV, padding: "18px 20px 20px" }}>
                    <DetailBody details={item.details} />
                </div>
            )}
        </article>
    );
}

function SectionHeader({ label, count }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 4, height: 18, background: GOLD }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: NAV }}>
                {label} · {count} {count === 1 ? "item" : "items"}
            </span>
            <div style={{ flex: 1, height: 1, background: NAV, opacity: 0.1 }} />
        </div>
    );
}

function Skeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: "#fff", border: `1.5px solid ${NAV}`, display: "flex", overflow: "hidden" }}>
                    <div style={{ width: 5, background: "#e4e0d4", flexShrink: 0 }} />
                    <div style={{ width: 180, flexShrink: 0, background: "#e4e0d4", minHeight: 140 }} />
                    <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ width: 80,    height: 10, background: "#e4e0d4", borderRadius: 4 }} />
                        <div style={{ width: "60%", height: 14, background: "#e4e0d4", borderRadius: 4 }} />
                        <div style={{ width: "90%", height: 10, background: "#e4e0d4", borderRadius: 4 }} />
                        <div style={{ width: "75%", height: 10, background: "#e4e0d4", borderRadius: 4 }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function extractItems(data) {
    if (!data) return [];
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data))      return data;
    if (Array.isArray(data.announcements)) return data.announcements;
    return [];
}

export default function Announcement() {
    const [activeTab,      setActiveTab]      = useState("all");
    const [catFilter,      setCatFilter]      = useState("all");
    const [announcements,  setAnnouncements]  = useState([]);
    const [news,           setNews]           = useState([]);
    const [annCategories,  setAnnCategories]  = useState([]);
    const [newsCategories, setNewsCategories] = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [annRes, newsRes] = await Promise.all([
                fetch(`${API_URL}/announcements`),
                fetch(`${API_URL}/news`),
            ]);

            for (const [label, res] of [["announcements", annRes], ["news", newsRes]]) {
                const ct = res.headers.get("content-type") || "";
                if (!ct.includes("application/json")) {
                    throw new Error(`Failed to load ${label}. Please try again later.`);
                }
            }

            const [annData, newsData] = await Promise.all([annRes.json(), newsRes.json()]);

            if (!annRes.ok)  throw new Error(annData.message  || "Failed to load announcements.");
            if (!newsRes.ok) throw new Error(newsData.message || "Failed to load news.");

            const annList  = extractItems(annData);
            const newsList = extractItems(newsData);

            setAnnouncements(annList);
            setNews(newsList);

            const uniq = (arr, key) =>
                [...new Map(arr.map((x) => [x.category?.[key], x.category]).filter(([k]) => k)).values()];
            setAnnCategories(uniq(annList,  "slug"));
            setNewsCategories(uniq(newsList, "slug"));
        } catch (err) {
            setError("There was a problem connecting to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    function switchTab(key) { setActiveTab(key); setCatFilter("all"); }

    const filteredAnn  = catFilter === "all" ? announcements : announcements.filter((a) => a.category?.slug === catFilter);
    const filteredNews = catFilter === "all" ? news          : news.filter((n) => n.category?.slug === catFilter);
    const showAnn      = activeTab === "all" || activeTab === "announcement";
    const showNews     = activeTab === "all" || activeTab === "news";
    const subCats      = activeTab === "news" ? newsCategories : activeTab === "announcement" ? annCategories : [];
    const totalItems   = (showAnn ? filteredAnn.length : 0) + (showNews ? filteredNews.length : 0);

    return (
        <div style={{ background: BG, minHeight: "100vh" }}>

            {/* HERO */}
            <section style={{ background: NAV, position: "relative", overflow: "hidden", minHeight: 340 }}>
                <div style={{ position: "absolute", right: 0, top: 0, width: "60%", height: "100%", clipPath: "polygon(12% 0,100% 0,100% 100%,0% 100%)" }}>
                    <img src={HERO_IMG} alt="SRES Campus" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,#0a1f52 0%,transparent 40%)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(10,31,82,0.45)" }} />
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right,#92400e,${GOLD},#92400e)`, zIndex: 10 }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "80px 24px 96px" }}>
                    <p style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>San Roque Elementary School</p>
                    <h1 style={{ margin: "0 0 20px", color: "#fff", fontSize: "clamp(2.8rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
                        Notices &amp; <span style={{ color: GOLD }}>Updates</span>
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: 0 }}>
                        Announcements, news, and events from San Roque Elementary School — for students, parents, and faculty.
                    </p>
                </div>
            </section>

            {/* TABS */}
            <nav style={{ background: NAV, borderBottom: `4px solid ${GOLD}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 8px", display: "flex", flexWrap: "wrap" }}>
                    {TABS.map((t) => (
                        <button key={t.key} onClick={() => switchTab(t.key)}
                            style={{ fontSize: "clamp(9px,2vw,11px)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "clamp(10px,2vw,13px) clamp(10px,3vw,24px)", border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeTab === t.key ? GOLD : "transparent", color: activeTab === t.key ? NAV : "rgba(255,255,255,0.48)", transition: "all 0.15s", flex: "1 1 auto" }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* SUB-CATEGORY FILTER */}
            {subCats.length > 0 && (
                <div style={{ background: "#e8e4dc", borderBottom: "1px solid #ccc8bf" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 8px", display: "flex", flexWrap: "wrap" }}>
                        <button onClick={() => setCatFilter("all")} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 18px", border: "none", cursor: "pointer", background: catFilter === "all" ? NAV : "transparent", color: catFilter === "all" ? GOLD : NAV, transition: "all 0.15s" }}>All</button>
                        {subCats.map((c) => (
                            <button key={c.slug} onClick={() => setCatFilter(c.slug)} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 18px", border: "none", cursor: "pointer", background: catFilter === c.slug ? NAV : "transparent", color: catFilter === c.slug ? GOLD : NAV, transition: "all 0.15s" }}>
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CONTENT */}
            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 16px 72px" }}>

                {error && !loading && (
                    <div style={{ border: `1.5px solid #ef4444`, padding: "28px 24px", background: "#fff", marginBottom: 24 }}>
                        <p style={{ margin: "0 0 6px", fontWeight: 800, color: NAV, fontFamily: SERIF }}>Could not load content</p>
                        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b", fontFamily: SERIF }}>{error}</p>
                        <button onClick={load} style={{ fontSize: 11, fontWeight: 800, padding: "8px 18px", background: NAV, color: GOLD, border: "none", cursor: "pointer", borderRadius: 4 }}>Try Again</button>
                    </div>
                )}

                {loading ? (
                    <Skeleton />
                ) : !error && totalItems === 0 ? (
                    <div style={{ border: `1.5px solid ${NAV}`, padding: "60px 24px", textAlign: "center", background: "#fff" }}>
                        <p style={{ fontSize: 14, color: NAV, opacity: 0.38, fontFamily: SERIF, margin: "0 0 8px" }}>No items in this category yet.</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: SERIF, margin: 0 }}>Check back soon for updates.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                        {showAnn && filteredAnn.length > 0 && (
                            <section>
                                {activeTab === "all" && <SectionHeader label="Announcements" count={filteredAnn.length} />}
                                {activeTab === "announcement" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                                        <div style={{ width: 4, height: 18, background: GOLD }} />
                                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: NAV }}>
                                            {filteredAnn.length} {filteredAnn.length === 1 ? "Notice" : "Notices"}
                                        </span>
                                        <div style={{ flex: 1, height: 1, background: NAV, opacity: 0.1 }} />
                                    </div>
                                )}
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {filteredAnn.map((item) => <AnnouncementCard key={`ann-${item.id}`} item={item} />)}
                                </div>
                            </section>
                        )}
                        {showNews && filteredNews.length > 0 && (
                            <section>
                                {activeTab === "all" && <SectionHeader label="News & Highlights" count={filteredNews.length} />}
                                {activeTab === "news" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                                        <div style={{ width: 4, height: 18, background: GOLD }} />
                                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: NAV }}>
                                            {filteredNews.length} {filteredNews.length === 1 ? "Article" : "Articles"}
                                        </span>
                                        <div style={{ flex: 1, height: 1, background: NAV, opacity: 0.1 }} />
                                    </div>
                                )}
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {filteredNews.map((item) => <NewsCard key={`news-${item.id}`} item={item} />)}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {(activeTab === "all" || activeTab === "announcement") && !loading && !error && (
                    <div style={{ marginTop: 40, padding: "14px 18px", border: `1.5px solid ${NAV}`, background: "#fff" }}>
                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: NAV, opacity: 0.45, display: "block", marginBottom: 10 }}>Priority Guide</span>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {Object.entries(PRIORITY).map(([key, p]) => (
                                <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 10px", border: `1.5px solid ${p.bar}`, color: p.bar, background: `${p.bar}12` }}>
                                    <span style={{ width: 6, height: 6, background: p.bar, display: "inline-block" }} />{p.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}