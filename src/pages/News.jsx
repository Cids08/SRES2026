import { useState } from "react";
import { Link } from "react-router-dom";

const HERO_IMG = "/images/hero-img-1-min.jpg";

const CATEGORIES = [
    { key: "all",       label: "All News" },
    { key: "event",     label: "Events" },
    { key: "academic",  label: "Academic" },
    { key: "community", label: "Community" },
];

const CATEGORY_STYLES = {
    event:     { badge: "bg-red-100 text-red-700 border-red-200",     border: "border-l-red-500"    },
    academic:  { badge: "bg-cyan-100 text-cyan-700 border-cyan-200",   border: "border-l-cyan-500"  },
    community: { badge: "bg-green-100 text-green-700 border-green-200",border: "border-l-green-500" },
};

const NEWS = [
    {
        id: 1,
        category: "event",
        title: "Grand Alumni Homecoming 2024",
        summary: "Join us for our much-anticipated Annual Alumni Homecoming! Reconnect with old classmates, share memories, and celebrate the enduring spirit of San Roque Elementary School.",
        date: "April 1, 2024",
        img: "/images/img-school-5-min.jpg",
        details: {
            heading: "Event Details",
            items: [
                { label: "Date", value: "May 6, 2024" },
                { label: "Time", value: "2:00 PM – 8:00 PM" },
                { label: "Venue", value: "San Roque Elementary School Grounds" },
                { label: "Dress Code", value: "Smart Casual" },
            ],
            highlights: [
                "Nostalgic photo exhibitions",
                "School tour",
                "Alumni achievements showcase",
                "Dinner and networking",
                "Special performances",
            ],
        },
    },
    {
        id: 2,
        category: "academic",
        title: "Math Olympiad Success",
        summary: "Our math team demonstrates exceptional problem-solving skills, bringing home multiple medals from the national competition.",
        date: "March 10, 2024",
        img: null,
        details: {
            heading: "Competition Highlights",
            items: [
                { label: "Date", value: "March 10, 2024" },
                { label: "Location", value: "Regional Math Competition" },
                { label: "Achievement", value: "Multiple Medals" },
            ],
            body: "Our talented math team showcased exceptional problem-solving skills and mathematical prowess, bringing home multiple medals from the regional mathematics competition.",
        },
    },
    {
        id: 3,
        category: "community",
        title: "Community Service Day",
        summary: "Students and teachers unite to make a difference, participating in local environmental cleanup and community support initiatives.",
        date: "March 5, 2024",
        img: null,
        details: {
            heading: "Event Details",
            items: [
                { label: "Date", value: "March 5, 2024" },
                { label: "Location", value: "Local Community Areas" },
                { label: "Focus", value: "Environmental Cleanup" },
            ],
            body: "Students and teachers collaborated to make a meaningful difference in the local community through environmental cleanup and support initiatives.",
        },
    },
    {
        id: 4,
        category: "event",
        title: "Art Exhibition Highlights",
        summary: "Annual student art exhibition showcases creativity, imagination, and artistic talent across various mediums and grade levels.",
        date: "February 28, 2024",
        img: null,
        details: {
            heading: "Exhibition Details",
            items: [
                { label: "Date", value: "February 28, 2024" },
                { label: "Location", value: "School Art Gallery" },
                { label: "Participants", value: "All Grade Levels" },
            ],
            body: "Our annual student art exhibition celebrated creativity and imagination, featuring incredible artwork from students across all grade levels.",
        },
    },
];

function NewsCard({ item }) {
    const [open, setOpen] = useState(false);
    const style = CATEGORY_STYLES[item.category];

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${style.border} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
            {/* Top — image (if any) + content */}
            <div className="flex flex-col sm:flex-row">
                {item.img && (
                    <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        {/* Category badge + title */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                                {item.category}
                            </span>
                            <h3 className="text-[#0a1f52] font-bold text-base leading-snug">{item.title}</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.summary}</p>
                    </div>
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
            </div>

            {/* Expandable details */}
            {open && (
                <div className="border-t border-gray-100 bg-[#f4f6fb] px-6 py-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-3">{item.details.heading}</p>
                    {item.details.items && (
                        <ul className="space-y-1 mb-3">
                            {item.details.items.map((d) => (
                                <li key={d.label} className="text-sm text-gray-600">
                                    <span className="font-semibold text-[#0a1f52]">{d.label}:</span> {d.value}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.details.highlights && (
                        <ul className="space-y-1 mb-3">
                            {item.details.highlights.map((h) => (
                                <li key={h} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">★</span> {h}
                                </li>
                            ))}
                        </ul>
                    )}
                    {item.details.body && (
                        <p className="text-sm text-gray-600 leading-relaxed">{item.details.body}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function News() {
    const [active, setActive] = useState("all");

    const filtered = active === "all" ? NEWS : NEWS.filter((n) => n.category === active);

    return (
        <div className="bg-[#f4f6fb]">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                <div className="absolute inset-0 bg-[#0a1f52]" />
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img src={HERO_IMG} alt="SRES News" className="w-full h-full object-cover" />
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
                                School <span className="text-yellow-400">Highlights</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                Discover the exciting moments, student achievements, and upcoming events
                                that make our school community special.
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

                    {/* News list */}
                    <div className="space-y-5">
                        {filtered.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-center text-gray-400 py-12 text-sm">No news in this category yet.</p>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-10 bg-white rounded-2xl border border-gray-100 px-6 py-5">
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-3">Category Guide</p>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { key: "event",     label: "Event" },
                                { key: "academic",  label: "Academic" },
                                { key: "community", label: "Community" },
                            ].map(({ key, label }) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${CATEGORY_STYLES[key].badge}`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}