import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const CATEGORIES = [
  { key: "all",       label: "All News"  },
  { key: "event",     label: "Events"    },
  { key: "academic",  label: "Academic"  },
  { key: "community", label: "Community" },
];

const CAT_LABEL = { event: "Event", academic: "Academic", community: "Community" };

const NEWS = [
  {
    id: 1, category: "event",
    title: "Grand Alumni Homecoming 2024",
    summary: "Join us for our much-anticipated Annual Alumni Homecoming. Reconnect with old classmates, share memories, and celebrate the enduring spirit of San Roque Elementary School.",
    date: "April 1, 2024", img: "/images/img-school-5-min.jpg",
    details: {
      items: [
        { label: "Date", value: "May 6, 2024" },
        { label: "Time", value: "2:00 PM – 8:00 PM" },
        { label: "Venue", value: "SRES School Grounds" },
        { label: "Dress Code", value: "Smart Casual" },
      ],
      list: ["Nostalgic photo exhibitions", "Guided school tour", "Alumni achievements showcase", "Dinner and networking", "Special performances"],
    },
  },
  {
    id: 2, category: "academic",
    title: "Math Olympiad — Multiple Medals Won",
    summary: "Our mathematics team demonstrated exceptional skills at the regional competition, bringing home multiple medals and pride to San Roque Elementary School.",
    date: "March 10, 2024", img: null,
    details: {
      items: [
        { label: "Competition", value: "Regional Math Olympiad" },
        { label: "Date", value: "March 10, 2024" },
        { label: "Result", value: "Multiple Medals" },
      ],
      body: "Our talented math team showcased exceptional problem-solving skills. We congratulate every student who represented the school with excellence and determination.",
    },
  },
  {
    id: 3, category: "community",
    title: "Community Service Day",
    summary: "Students and faculty united for a local environmental cleanup and community outreach, reinforcing our school's commitment to service and bayanihan.",
    date: "March 5, 2024", img: null,
    details: {
      items: [
        { label: "Date", value: "March 5, 2024" },
        { label: "Location", value: "Viga Community Areas" },
        { label: "Focus", value: "Environmental Cleanup" },
      ],
      body: "Our students showed that true education extends beyond the classroom. Their dedication to community service reflects the values we nurture at SRES every day.",
    },
  },
  {
    id: 4, category: "event",
    title: "Annual Student Art Exhibition",
    summary: "The school gallery showcased creativity and imagination from pupils across all grade levels — paintings, drawings, and mixed-media works on proud display.",
    date: "February 28, 2024", img: null,
    details: {
      items: [
        { label: "Date", value: "February 28, 2024" },
        { label: "Venue", value: "School Art Gallery" },
        { label: "Open to", value: "Parents & Community" },
      ],
      body: "Every artwork in the exhibition told a story unique to its young artist. The creativity on display was a testament to the dedication of our pupils and their teachers.",
    },
  },
];

function Badge({ label }) {
  return (
    <span style={{ display: "inline-block", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "3px 10px", background: "#f5c518", color: "#0a1f52" }}>
      {label}
    </span>
  );
}

function NewsCard({ item, featured }) {
  const [open, setOpen] = useState(false);
  return (
    <article style={{ background: "#fff", border: "1.5px solid #0a1f52", overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {item.img && (
          <div style={{ width: featured ? "100%" : 156, height: featured ? 200 : "auto", minHeight: featured ? 200 : 120, overflow: "hidden", flexShrink: 0 }}>
            <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
        {!item.img && <div style={{ width: 6, background: "#f5c518", flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 200, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Badge label={CAT_LABEL[item.category]} />
          <h3 style={{ margin: 0, fontSize: featured ? 17 : 14.5, fontWeight: 800, color: "#0a1f52", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{item.title}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#3a3a3a", lineHeight: 1.75, fontFamily: "Georgia, serif" }}>{item.summary}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e4e0d4", marginTop: "auto", flexWrap: "wrap", gap: 8 }}>
            <time style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a1f52", opacity: 0.45 }}>{item.date}</time>
            <button onClick={() => setOpen(!open)} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px", border: "1.5px solid #0a1f52", cursor: "pointer", background: open ? "#0a1f52" : "transparent", color: open ? "#f5c518" : "#0a1f52", transition: "all 0.15s" }}>
              {open ? "Close" : "Read More"}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1.5px solid #0a1f52", background: "#0a1f52", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {item.details.items && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 2 }}>
              {item.details.items.map((d, i) => (
                <div key={i} style={{ background: "#0d2660", padding: "10px 14px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#f5c518" }}>{d.label}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif" }}>{d.value}</p>
                </div>
              ))}
            </div>
          )}
          {item.details.list && (
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {item.details.list.map((h, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif", lineHeight: 1.5 }}>
                  <span style={{ width: 10, height: 10, background: "#f5c518", flexShrink: 0, marginTop: 3 }} />{h}
                </li>
              ))}
            </ul>
          )}
          {item.details.body && <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.8, fontFamily: "Georgia, serif" }}>{item.details.body}</p>}
        </div>
      )}
    </article>
  );
}

export default function News() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? NEWS : NEWS.filter((n) => n.category === active);

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
              School <span style={{ color: "#facc15" }}>Highlights</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 448, margin: 0 }}>
              News, events, and stories from our school community — for students, parents, and teachers.
            </p>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <nav style={{ background: "#0a1f52", borderBottom: "4px solid #f5c518" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px", display: "flex" }}>
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setActive(c.key)} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 20px", border: "none", cursor: "pointer", background: active === c.key ? "#f5c518" : "transparent", color: active === c.key ? "#0a1f52" : "rgba(255,255,255,0.48)", transition: "all 0.15s" }}>
              {c.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 40px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 4, height: 18, background: "#f5c518" }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a1f52" }}>{filtered.length} {filtered.length === 1 ? "Article" : "Articles"}</span>
          <div style={{ flex: 1, height: 1, background: "#0a1f52", opacity: 0.1 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((item, i) => <NewsCard key={item.id} item={item} featured={i === 0} />)}
          {filtered.length === 0 && (
            <div style={{ border: "1.5px solid #0a1f52", padding: "60px 24px", textAlign: "center", background: "#fff" }}>
              <p style={{ fontSize: 14, color: "#0a1f52", opacity: 0.38, fontFamily: "Georgia, serif", margin: 0 }}>No articles in this category yet.</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: 36, padding: "14px 18px", border: "1.5px solid #0a1f52", background: "#fff", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a1f52", opacity: 0.45 }}>Categories:</span>
          {["event", "academic", "community"].map((k) => <Badge key={k} label={CAT_LABEL[k]} />)}
        </div>
      </main>
    </div>
  );
}