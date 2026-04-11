import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const CATEGORIES = [
    { key: "all",         label: "All Announcements" },
    { key: "enrollment",  label: "Enrollment" },
    { key: "achievement", label: "Achievements" },
    { key: "general",     label: "General" },
];

const IMPORTANCE_STYLES = {
    high:   { badge: "bg-red-100 text-red-700 border-red-200",    border: "border-l-red-500",    label: "High"   },
    medium: { badge: "bg-orange-100 text-orange-700 border-orange-200", border: "border-l-orange-500", label: "Medium" },
    low:    { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", border: "border-l-emerald-500", label: "Low" },
};

const ANNOUNCEMENTS = [
    {
        id: 1,
        category: "enrollment",
        importance: "high",
        title: "Fall 2025 Enrollment Now Open",
        summary: "Registration for the Fall 2025 semester is now open. Secure your spot by submitting your application before May 15, 2025.",
        date: "April 1, 2025",
        details: {
            heading: "Fall 2025 Enrollment Details",
            items: [
                "Application deadline: May 15, 2025",
                "Required documents: Transcripts, ID, Proof of residence",
                "Application fee waived for returning students",
                "Limited seats available for all programs",
                "Early bird discount of 10% for applications submitted before April 30",
                "Online applications preferred through the student portal",
            ],
        },
    },
    {
        id: 2,
        category: "enrollment",
        importance: "medium",
        title: "Scholarship Applications",
        summary: "Merit-based and need-based scholarship applications for the upcoming academic year are now being accepted.",
        date: "March 25, 2025",
        details: {
            heading: "Scholarship Information",
            body: "Application deadline is April 30, 2025. The following scholarships are available:",
            items: [
                "Academic Excellence Scholarship: For students with GPA 3.8 or higher",
                "Leadership Scholarship: For students with demonstrated leadership experience",
                "Community Service Award: For students with 100+ volunteer hours",
                "Need-based Financial Aid: Based on family income verification",
            ],
            footer: "All applications require two recommendation letters and a personal statement.",
        },
    },
    {
        id: 3,
        category: "achievement",
        importance: "medium",
        title: "National Science Competition Winners",
        summary: "Congratulations to our Science Club for securing the first place in the National Science Competition 2025!",
        date: "March 28, 2025",
        details: {
            heading: "National Science Competition Victory",
            body: "Our school's Science Club has won first place in the prestigious National Science Competition with their innovative project on renewable energy solutions. The team will represent our school at the International Science Fair in June. A celebration event will be held in the auditorium on April 10th at 3:30 PM.",
        },
    },
    {
        id: 4,
        category: "achievement",
        importance: "low",
        title: "Arts Festival Recognition",
        summary: "Our school's Art Department received an honorable mention at the Regional Arts Festival for the innovative mixed media display.",
        date: "March 20, 2025",
        details: {
            heading: "Arts Festival Achievement",
            body: "The Art Department's mixed media installation titled 'Perspectives on Climate' received an honorable mention at this year's Regional Arts Festival. The collaborative project featured work from 15 students across all grade levels. The installation will be on display in the school gallery until April 15th.",
        },
    },
    {
        id: 5,
        category: "general",
        importance: "high",
        title: "Campus Maintenance Schedule",
        summary: "The main building will undergo maintenance from April 10–15, 2025. All classes normally held in the main building will be relocated.",
        date: "March 30, 2025",
        details: {
            heading: "Maintenance Schedule & Room Assignments",
            body: "During the maintenance period (April 10–15), the following relocations will be in effect:",
            items: [
                "All 100-series classrooms → Science Building, rooms S101–S110",
                "All 200-series classrooms → Library study rooms",
                "Administrative offices → Conference Center",
            ],
            footer: "Maintenance includes HVAC upgrades, electrical repairs, and Wi-Fi infrastructure improvements.",
        },
    },
    {
        id: 6,
        category: "general",
        importance: "low",
        title: "Library Extended Hours",
        summary: "During the exam period (April 20–30), the library will be open from 7:00 AM to 10:00 PM on weekdays.",
        date: "March 27, 2025",
        details: {
            heading: "Extended Library Hours & Services",
            items: [
                "Weekdays: 7:00 AM – 10:00 PM",
                "Weekends: 9:00 AM – 8:00 PM",
                "Additional group study rooms (reservation required)",
                "Extended laptop lending up to 48 hours",
                "Free printing up to 50 pages per student",
                "Librarians available for research assistance until 8:00 PM daily",
            ],
        },
    },
];

function AnnouncementCard({ item }) {
    const [open, setOpen] = useState(false);
    const style = IMPORTANCE_STYLES[item.importance];

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${style.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                            {style.label} Priority
                        </span>
                        <h3 className="text-[#0a1f52] font-bold text-base leading-snug">{item.title}</h3>
                    </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.summary}</p>

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <span className="text-gray-400 text-xs">Posted on: {item.date}</span>
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-[11px] font-extrabold uppercase tracking-wide px-4 py-2 rounded-full bg-[#0a1f52] text-white hover:bg-[#1a3a8a] transition-colors duration-200"
                    >
                        {open ? "Hide Details" : "View Details"}
                    </button>
                </div>
            </div>

            {/* Expandable details */}
            {open && (
                <div className="border-t border-gray-100 bg-[#f4f6fb] px-6 py-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-3">{item.details.heading}</p>
                    {item.details.body && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.details.body}</p>
                    )}
                    {item.details.items && (
                        <ul className="space-y-1.5 mb-3">
                            {item.details.items.map((d) => (
                                <li key={d} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5 flex-shrink-0">★</span> {d}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.details.footer && (
                        <p className="text-sm text-gray-500 italic mt-2">{item.details.footer}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Announcement() {
    const [active, setActive] = useState("all");

    const filtered = active === "all" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter((a) => a.category === active);

    return (
        <div className="bg-[#f4f6fb]">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                <div className="absolute inset-0 bg-[#0a1f52]" />
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img src={HERO_IMG} alt="Announcements" className="w-full h-full object-cover" />
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
                                Updates &amp; <span className="text-yellow-400">Notices</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                Get the latest information on school activities, achievements, and
                                important reminders. Stay connected with our school community!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* Filter tabs */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => setActive(c.key)}
                                className={`text-[11px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all duration-200 ${
                                    active === c.key
                                        ? "bg-[#0a1f52] text-white border-[#0a1f52]"
                                        : "bg-white text-[#0a1f52] border-gray-200 hover:border-[#0a1f52]"
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {/* Announcements list */}
                    <div className="space-y-5">
                        {filtered.map((item) => (
                            <AnnouncementCard key={item.id} item={item} />
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-center text-gray-400 py-12 text-sm">No announcements in this category yet.</p>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 py-5">
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-3">Priority Guide</p>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(IMPORTANCE_STYLES).map(([key, s]) => (
                                <span key={key} className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${s.badge}`}>
                                    {s.label} Priority
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}