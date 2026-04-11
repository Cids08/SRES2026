import { useState } from "react";

const HERO_IMG = "/images/hero-img-1-min.jpg";

/* ─── Inline SVG Icons ────────────────────────────────────── */
function IconPin({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function IconClock({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
function IconPhone({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

const INFO_CARDS = [
    {
        Icon: IconPin,
        title: "Location",
        lines: ["San Roque, Viga, Catanduanes"],
    },
    {
        Icon: IconClock,
        title: "Open Hours",
        lines: ["Monday – Friday", "8:00 AM – 5:00 PM"],
    },
    {
        Icon: IconPhone,
        title: "Contact",
        lines: ["113330@deped.gov.ph", "+63 9605519104"],
    },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.name.trim())    e.name    = "Name is required.";
        if (!form.email.trim())   e.email   = "Email is required.";
        if (!form.subject.trim()) e.subject = "Subject is required.";
        if (!form.message.trim()) e.message = "Message is required.";
        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }
        setErrors({});
        setSubmitted(true);
    }

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setErrors((er) => ({ ...er, [e.target.name]: undefined }));
    }

    return (
        <div className="bg-[#f4f6fb]">

            {/* ── HERO ── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                <div className="absolute inset-0 bg-[#0a1f52]" />
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img src={HERO_IMG} alt="Contact Us" className="w-full h-full object-cover" />
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
                                Contact <span className="text-yellow-400">Us</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                We're here to help. Reach out to us with any questions or concerns
                                about our school community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INFO CARDS ── */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                        {INFO_CARDS.map(({ Icon, title, lines }) => (
                            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                                <div className="w-14 h-14 rounded-2xl bg-[#0a1f52]/6 border border-[#0a1f52]/10 flex items-center justify-center mx-auto mb-4 text-[#0a1f52]">
                                    <Icon size={22} />
                                </div>
                                <h3 className="text-[#0a1f52] font-extrabold text-sm uppercase tracking-widest mb-3">{title}</h3>
                                {lines.map((l) => (
                                    <p key={l} className="text-gray-500 text-sm leading-relaxed">{l}</p>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* ── CONTACT FORM ── */}
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="inline-block bg-yellow-500/10 text-yellow-800 border border-yellow-400/30 text-[10px] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3">
                                Get In Touch
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52]">Send Us a Message</h2>
                        </div>

                        {submitted ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h3 className="text-emerald-800 font-extrabold text-lg mb-2">Message Sent!</h3>
                                <p className="text-emerald-600 text-sm">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-1.5">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Juan dela Cruz"
                                            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#0a1f52]/20 focus:border-[#0a1f52] transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="juan@email.com"
                                            className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#0a1f52]/20 focus:border-[#0a1f52] transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#0a1f52]/20 focus:border-[#0a1f52] transition-all duration-200 ${errors.subject ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#0a1f52] mb-1.5">Message</label>
                                    <textarea
                                        name="message"
                                        rows={6}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#0a1f52]/20 focus:border-[#0a1f52] transition-all duration-200 resize-none ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#0a1f52] hover:bg-[#1a3a8a] text-white font-extrabold text-sm py-3.5 rounded-full transition-colors duration-200"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

        </div>
    );
}