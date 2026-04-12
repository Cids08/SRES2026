import { Link } from "react-router-dom";
import { Target, Eye, Leaf, Heart, Flag, BookHeart, Users, GraduationCap, Award, ArrowRight, CheckCircle2 } from "lucide-react";

/* ─── Backend-ready image config ─────────────────────────── */
const IMAGES = {
    hero:   "/images/hero-img-1-min.jpg",
    school: "/images/gal_1.jpg",
    gal2:   "/images/gal_3.jpg",
    gal3:   "/images/gal_4.jpg",
};

/* ─── Content ─────────────────────────────────────────────── */
const MISSION_POINTS = [
    "Students learn in a child-friendly, gender-sensitive, safe and motivating environment.",
    "Teachers facilitate learning and constantly nurture every learner.",
    "Administrators and staff ensure an enabling and supportive environment for effective learning.",
    "Family, community and other stakeholders are actively engaged in developing life-long learners.",
];

const CORE_VALUES = [
    { Icon: BookHeart, word: "Maka-Diyos",    letter: "M", desc: "Respect for God and moral uprightness in all actions of the school community." },
    { Icon: Heart,     word: "Maka-tao",      letter: "A", desc: "Compassion, respect, and meaningful service to every person we meet."          },
    { Icon: Leaf,      word: "Makakalikasan", letter: "K", desc: "Responsible care and stewardship for our natural environment."                 },
    { Icon: Flag,      word: "Makabansa",     letter: "A", desc: "Deep love of country and genuine commitment to national progress."             },
];

const STATS = [
    { value: "167+", label: "Students",  sub: "Currently enrolled",     Icon: Users         },
    { value: "10",   label: "Teachers",  sub: "Certified educators",     Icon: GraduationCap },
    { value: "12",   label: "Awards",    sub: "Citations & recognition", Icon: Award         },
];

/* ═══════════════════════════════════════════════════════════
   ABOUT / HISTORY PAGE
══════════════════════════════════════════════════════════ */
export default function History() {
    return (
        <div style={{ background: "#f2efe8", minHeight: "100vh" }}>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                {/* Left navy half */}
                <div className="absolute inset-0 bg-[#0a1f52]" />

                {/* Right photo, clipped diagonally */}
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img src={IMAGES.hero} alt="SRES Staff" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }} />
                    <div className="absolute inset-0 bg-[#0a1f52]/45" />
                </div>

                {/* Content — left-aligned, flex column, same as About */}
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "80px 24px 96px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <p style={{ color: "#facc15", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                            San Roque Elementary School
                            </p>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-none mb-5">
                                About <span className="text-yellow-400">Us</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                Dedicated to providing quality education and nurturing the potential
                                of every student in Viga, Catanduanes.
                            </p>
                        </div>
                    </div>
            </section>

            {/* ── 2. INTRO + STATS ─────────────────────────────────── */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">

                    {/* Left — story text */}
                    <div className="lg:col-span-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-yellow-600 mb-4">Our Story</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] leading-snug mb-5">
                            A community built on <br className="hidden sm:block" />
                            learning and purpose.
                        </h2>
                        <div className="w-10 h-1 bg-yellow-400 rounded-full mb-7" />
                        <p className="text-gray-500 text-[15px] leading-relaxed mb-4">
                            San Roque Elementary School has long stood as a pillar of quality public
                            education in Barangay San Roque, Viga, Catanduanes. For years we have
                            remained steadfast in developing well-rounded, responsible, and capable
                            Filipino learners.
                        </p>
                        <p className="text-gray-500 text-[15px] leading-relaxed mb-9">
                            Under the Department of Education — Division of Catanduanes, our school
                            continues to grow in excellence, character, and community service. We take
                            pride in every graduate who carries our values forward into the nation.
                        </p>
                        <Link
                            to="/staff"
                            className="inline-flex items-center gap-2 text-[#0a1f52] font-extrabold text-sm border-b-2 border-yellow-400 pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors duration-200"
                        >
                            Meet our teachers <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Right — school image */}
                    <div className="lg:col-span-2">
                        <div className="relative rounded-3xl overflow-hidden h-64">
                            <img
                                src={IMAGES.school}
                                alt="San Roque Elementary School"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#0a1f52]/20" />
                            {/* Yellow corner accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. MISSION & VISION ──────────────────────────────── */}
            <section className="py-16 sm:py-24 bg-[#0a1f52]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Section label */}
                    <div className="mb-12">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-yellow-400 mb-2">Who We Are</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Mission &amp; Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Mission card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-400/30 transition-colors duration-200">
                            {/* Card top bar */}
                            <div className="flex items-center gap-4 px-8 py-5 border-b border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
                                    <Target size={20} className="text-[#0a1f52]" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-yellow-400/60 text-[10px] font-extrabold uppercase tracking-widest">What we do</p>
                                    <h3 className="text-white font-extrabold text-lg">Our Mission</h3>
                                </div>
                            </div>
                            {/* Body */}
                            <div className="px-8 py-7">
                                <p className="text-white/50 text-sm leading-relaxed mb-6">
                                    To protect and promote the right of every Filipino to quality, equality,
                                    culture-based, and complete basic education where all stakeholders
                                    play a meaningful role:
                                </p>
                                <ul className="space-y-4">
                                    {MISSION_POINTS.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-1 w-5 h-5 rounded-full bg-yellow-500/15 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold text-yellow-400">
                                                {i + 1}
                                            </span>
                                            <p className="text-white/65 text-sm leading-relaxed">{point}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Vision + quote stack */}
                        <div className="flex flex-col gap-6">
                            {/* Vision card */}
                            <div className="bg-yellow-500 rounded-3xl overflow-hidden flex-1">
                                <div className="flex items-center gap-4 px-8 py-5 border-b border-[#0a1f52]/15">
                                    <div className="w-10 h-10 rounded-xl bg-[#0a1f52] flex items-center justify-center flex-shrink-0">
                                        <Eye size={20} className="text-yellow-400" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-[#0a1f52]/50 text-[10px] font-extrabold uppercase tracking-widest">What we aspire</p>
                                        <h3 className="text-[#0a1f52] font-extrabold text-lg">Our Vision</h3>
                                    </div>
                                </div>
                                <div className="px-8 py-7">
                                    <p className="text-[#0a1f52]/75 text-sm leading-relaxed mb-4">
                                        We dream of Filipinos who passionately love their country and whose
                                        values and competencies enable them to realize their full potential
                                        and contribute meaningfully to building the nation.
                                    </p>
                                    <p className="text-[#0a1f52]/75 text-sm leading-relaxed">
                                        As a learner-centered public institution, the Department of Education
                                        continuously improves itself to better serve its stakeholders.
                                    </p>
                                </div>
                            </div>

                            {/* Quote card */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6 flex items-start gap-4">
                                <span className="text-yellow-400/25 text-7xl font-serif leading-none mt-[-12px] flex-shrink-0">"</span>
                                <div>
                                    <p className="text-white font-bold text-base leading-snug">
                                        Every child is a future builder of our nation.
                                    </p>
                                    <p className="text-white/35 text-xs mt-2 font-medium uppercase tracking-wider">
                                        — SRES School Culture
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. CORE VALUES ───────────────────────────────────── */}
            <section className="py-16 sm:py-24 bg-[#f4f7ff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                        <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-yellow-600 mb-2">What Drives Us</p>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52]">Core Values</h2>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs sm:text-right hidden sm:block">
                            The MAKA values embedded in every<br />learner we nurture at SRES.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {CORE_VALUES.map(({ Icon, word, letter, desc }, i) => (
                            <div
                                key={word}
                                className="bg-white border border-[#0a1f52]/8 rounded-3xl p-7 hover:-translate-y-1 hover:shadow-lg hover:border-yellow-400/40 transition-all duration-200 group"
                            >
                                {/* Number + icon row */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-5xl font-extrabold text-[#0a1f52]/10 leading-none group-hover:text-yellow-400/20 transition-colors duration-200">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="w-11 h-11 rounded-xl bg-[#0a1f52] group-hover:bg-yellow-500 flex items-center justify-center transition-colors duration-200">
                                        <Icon size={20} className="text-yellow-400 group-hover:text-[#0a1f52] transition-colors duration-200" strokeWidth={1.5} />
                                    </div>
                                </div>
                                {/* Letter pill */}
                                <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-0.5 mb-3">
                                    <span className="text-yellow-700 font-extrabold text-[11px] uppercase tracking-widest">{letter}</span>
                                </div>
                                <h4 className="font-extrabold text-[#0a1f52] text-sm mb-2">{word}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. PHOTO STRIP ───────────────────────────────────── */}
            <section className="py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-3 gap-3 rounded-3xl overflow-hidden h-56 sm:h-72">
                        <div className="relative col-span-1 overflow-hidden">
                            <img src={IMAGES.school} alt="School" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="relative col-span-1 overflow-hidden">
                            <img src={IMAGES.gal2} alt="School life" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="relative col-span-1 overflow-hidden">
                            <img src={IMAGES.gal3} alt="Campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. CTA ───────────────────────────────────────────── */}
            <section className="bg-yellow-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-[#0a1f52]/50 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2">Enroll Today</p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1f52] leading-snug">
                            Ready to be part of the<br />SRES family?
                        </h2>
                        <p className="text-[#0a1f52]/60 text-sm mt-2 max-w-sm">
                            Quality education is free and open to all. Give your child the best start.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link
                            to="/enroll"
                            className="inline-flex items-center gap-2 bg-[#0a1f52] hover:bg-[#1a3a8a] text-white font-extrabold text-sm px-8 py-3.5 rounded-full transition-colors duration-200"
                        >
                            Apply for Admission
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-[#0a1f52]/10 hover:bg-[#0a1f52]/20 border border-[#0a1f52]/25 text-[#0a1f52] font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}