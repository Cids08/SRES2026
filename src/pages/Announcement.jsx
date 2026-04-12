import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const CATEGORIES = [
  { key: "all",         label: "All"          },
  { key: "enrollment",  label: "Enrollment"   },
  { key: "achievement", label: "Achievements" },
  { key: "general",     label: "General"      },
];

const PRIORITY = {
  high:   { label: "Action Required", bar: "#c0392b" },
  medium: { label: "Please Note",     bar: "#e67e00" },
  low:    { label: "Info",            bar: "#0a6640" },
};

const ANNOUNCEMENTS = [
  {
    id: 1, category: "enrollment", importance: "high",
    title: "Fall 2025 Enrollment Now Open",
    summary: "Registration for the Fall 2025 semester is now open. Secure your child's spot by submitting your application before May 15, 2025.",
    date: "April 1, 2025",
    details: {
      items: [
        "Application deadline: May 15, 2025",
        "Required documents: Transcripts, valid ID, Proof of residence",
        "Application fee waived for returning students",
        "Limited seats — early applications are encouraged",
        "Early bird discount of 10% for applications before April 30",
        "Online applications preferred through the student portal",
      ],
    },
  },
  {
    id: 2, category: "enrollment", importance: "medium",
    title: "Scholarship Applications Open",
    summary: "Merit-based and need-based scholarship applications for the upcoming academic year are now being accepted. Deadline is April 30, 2025.",
    date: "March 25, 2025",
    details: {
      body: "The following scholarships are available for qualified applicants:",
      items: [
        "Academic Excellence Scholarship — GPA 3.8 or higher",
        "Leadership Scholarship — demonstrated leadership experience",
        "Community Service Award — 100+ verified volunteer hours",
        "Need-based Financial Aid — family income verification required",
      ],
      footer: "All applications require two recommendation letters and a personal statement.",
    },
  },
  {
    id: 3, category: "achievement", importance: "medium",
    title: "National Science Competition — 1st Place",
    summary: "Congratulations to our Science Club for securing first place in the National Science Competition 2025 with their project on renewable energy.",
    date: "March 28, 2025",
    details: {
      body: "Our Science Club won first place in the prestigious National Science Competition. The team will represent our school at the International Science Fair in June. A celebration will be held in the auditorium on April 10th at 3:30 PM — all parents and students are welcome to attend.",
    },
  },
  {
    id: 4, category: "achievement", importance: "low",
    title: "Arts Festival Honorable Mention",
    summary: "Our Art Department received an honorable mention at the Regional Arts Festival for the mixed media installation 'Perspectives on Climate.'",
    date: "March 20, 2025",
    details: {
      body: "The collaborative installation featured work from 15 students across all grade levels. It will remain on display in the school gallery until April 15th. We invite everyone to visit and celebrate the creativity of our young artists.",
    },
  },
  {
    id: 5, category: "general", importance: "high",
    title: "Main Building Maintenance — April 10–15",
    summary: "The main building will undergo scheduled maintenance from April 10–15, 2025. All affected classes will be temporarily relocated.",
    date: "March 30, 2025",
    details: {
      body: "During the maintenance period, the following relocations will be in effect:",
      items: [
        "100-series classrooms → Science Building, rooms S101–S110",
        "200-series classrooms → Library study rooms",
        "Administrative offices → Conference Center",
      ],
      footer: "Maintenance covers HVAC upgrades, electrical repairs, and Wi-Fi infrastructure improvements.",
    },
  },
  {
    id: 6, category: "general", importance: "low",
    title: "Extended Library Hours — Exam Period",
    summary: "The library will be open from 7:00 AM to 10:00 PM on weekdays during the exam period (April 20–30).",
    date: "March 27, 2025",
    details: {
      items: [
        "Weekdays: 7:00 AM – 10:00 PM",
        "Weekends: 9:00 AM – 8:00 PM",
        "Group study rooms available (reservation required)",
        "Extended laptop lending up to 48 hours",
        "Free printing up to 50 pages per student",
        "Librarians available for research help until 8:00 PM",
      ],
    },
  },
];

function PriorityFlag({ importance }) {
  const p = PRIORITY[importance];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", padding: "3px 10px", border: `1.5px solid ${p.bar}`, color: p.bar, background: `${p.bar}12` }}>
      <span style={{ width: 6, height: 6, background: p.bar, display: "inline-block" }} />
      {p.label}
    </span>
  );
}

function AnnouncementCard({ item }) {
  const [open, setOpen] = useState(false);
  const p = PRIORITY[item.importance];
  return (
    <article style={{ background: "#fff", border: "1.5px solid #0a1f52", overflow: "hidden" }}>
      <div style={{ display: "flex" }}>
        <div style={{ width: 5, background: p.bar, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          <PriorityFlag importance={item.importance} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0a1f52", lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{item.title}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#3a3a3a", lineHeight: 1.75, fontFamily: "Georgia, serif" }}>{item.summary}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e4e0d4", marginTop: "auto", flexWrap: "wrap", gap: 8 }}>
            <time style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0a1f52", opacity: 0.45 }}>Posted: {item.date}</time>
            <button onClick={() => setOpen(!open)} style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px", border: "1.5px solid #0a1f52", cursor: "pointer", background: open ? "#0a1f52" : "transparent", color: open ? "#f5c518" : "#0a1f52", transition: "all 0.15s" }}>
              {open ? "Close" : "See Details"}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1.5px solid #0a1f52", background: "#0a1f52", padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {item.details.body && <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontFamily: "Georgia, serif" }}>{item.details.body}</p>}
          {item.details.items && (
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
              {item.details.items.map((d, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.82)", fontFamily: "Georgia, serif", lineHeight: 1.5 }}>
                  <span style={{ width: 10, height: 10, background: "#f5c518", flexShrink: 0, marginTop: 3 }} />{d}
                </li>
              ))}
            </ul>
          )}
          {item.details.footer && <p style={{ margin: 0, fontSize: 12, color: "rgba(245,197,24,0.75)", lineHeight: 1.7, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10 }}>{item.details.footer}</p>}
        </div>
      )}
    </article>
  );
}

export default function Announcement() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter((a) => a.category === active);

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
              Notices &amp; <span style={{ color: "#facc15" }}>Updates</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 448, margin: 0 }}>
              Important announcements for students, parents, and faculty of San Roque Elementary School.
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
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a1f52" }}>{filtered.length} {filtered.length === 1 ? "Notice" : "Notices"}</span>
          <div style={{ flex: 1, height: 1, background: "#0a1f52", opacity: 0.1 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((item) => <AnnouncementCard key={item.id} item={item} />)}
          {filtered.length === 0 && (
            <div style={{ border: "1.5px solid #0a1f52", padding: "60px 24px", textAlign: "center", background: "#fff" }}>
              <p style={{ fontSize: 14, color: "#0a1f52", opacity: 0.38, fontFamily: "Georgia, serif", margin: 0 }}>No announcements in this category yet.</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: 36, padding: "14px 18px", border: "1.5px solid #0a1f52", background: "#fff" }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a1f52", opacity: 0.45, display: "block", marginBottom: 10 }}>Priority Guide</span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(PRIORITY).map(([key, p]) => (
              <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 10px", border: `1.5px solid ${p.bar}`, color: p.bar, background: `${p.bar}12` }}>
                <span style={{ width: 6, height: 6, background: p.bar, display: "inline-block" }} />{p.label}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}