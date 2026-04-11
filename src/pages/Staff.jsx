import { Link } from "react-router-dom";

/* ─── Social Icons (inline SVG) ──────────────────────────── */
function IconFacebook({ size = 15 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function IconMessenger({ size = 15 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.686 7.205V22l3.372-1.853A10.737 10.737 0 0 0 12 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.008 12.44-2.544-2.713-4.963 2.713 5.461-5.793 2.607 2.713 4.9-2.713-5.461 5.793z" />
        </svg>
    );
}

/* ─── Images ─────────────────────────────────────────────── */
const IMAGES = {
    hero: "/images/hero-img-1-min.jpg",
};

/* ─── Staff Data ──────────────────────────────────────────── */
const PRINCIPAL = {
    name: "Randy T. Odi",
    position: "School Principal",
    img: "/images/staff_1.jpg",
    facebook: "#",
    messenger: "#",
    quote: "I can do all things through Christ which strengtheneth me.",
};

const STAFF = [
    { name: "Mercy O. De Leon",    position: "Kinder Adviser",   grade: "Kinder",   img: "/images/staff_2.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Janice T. Odiaman",   position: "Grade I Adviser",  grade: "Grade I",  img: "/images/staff_3.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Elizabeth T. Villary",position: "Grade II Adviser", grade: "Grade II", img: "/images/staff_4.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Analisa O. Cepriano", position: "Grade III Adviser",grade: "Grade III",img: "/images/staff_5.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Cecile C. Alano",     position: "Grade IV Adviser", grade: "Grade IV", img: "/images/staff_6.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Elena T. Odi",        position: "Grade V Adviser",  grade: "Grade V",  img: "/images/staff_7.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Christina O. Tuplano",position: "Grade VI Adviser", grade: "Grade VI", img: "/images/staff_8.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Ginalyn T. Manlangit",position: "Grade VI Adviser", grade: "Grade VI", img: "/images/staff_9.jpg",  facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
    { name: "Ramil T. Dela Cruz",  position: "Subject Teacher",  grade: "Faculty",  img: "/images/staff_10.jpg", facebook: "#", messenger: "#", quote: "I can do all things through Christ which strengtheneth me." },
];

/* ─── Staff Card ──────────────────────────────────────────── */
function StaffCard({ name, position, grade, img, facebook, messenger, quote }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 relative">
            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0a1f52] to-[#1a3a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />

            {/* Photo */}
            <div className="relative h-80 overflow-hidden bg-[#f4f6fb]">
                <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Grade badge */}
                <span className="absolute top-3 right-3 bg-[#0a1f52] text-yellow-400 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-400/40">
                    {grade}
                </span>
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="text-[#0a1f52] font-bold text-[15px] mb-0.5">{name}</h3>
                <span className="block text-[11px] font-extrabold uppercase tracking-wide text-yellow-700 mb-3">{position}</span>
                <p className="text-gray-400 text-xs leading-relaxed italic mb-4">"{quote}"</p>

                {/* Social — Facebook & Messenger only */}
                <div className="flex gap-2">
                    <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#0a1f52] hover:text-yellow-400 hover:border-[#0a1f52] transition-all duration-200"
                        title="Facebook"
                    >
                        <IconFacebook size={14} />
                    </a>
                    <a
                        href={messenger}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#0a1f52] hover:text-yellow-400 hover:border-[#0a1f52] transition-all duration-200"
                        title="Messenger"
                    >
                        <IconMessenger size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   STAFF PAGE
══════════════════════════════════════════════════════════ */
export default function Staff() {
    return (
        <div className="bg-[#f4f6fb]">

            {/* ── HERO — mirrors About page ─────────────────────── */}
            <section className="relative overflow-hidden" style={{ minHeight: 340 }}>
                {/* Left navy half */}
                <div className="absolute inset-0 bg-[#0a1f52]" />

                {/* Right photo, clipped diagonally */}
                <div
                    className="absolute right-0 top-0 h-full w-3/5"
                    style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <img
                        src={IMAGES.hero}
                        alt="SRES Staff"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to right, #0a1f52 0%, transparent 40%)" }}
                    />
                    <div className="absolute inset-0 bg-[#0a1f52]/45" />
                </div>

                {/* Gold bottom stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 z-10" />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                        <div>
                            <p className="text-yellow-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3">
                                San Roque Elementary School
                            </p>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-none mb-5">
                                Our <span className="text-yellow-400">Teachers</span>
                            </h1>
                            <p className="text-white/55 text-[15px] leading-relaxed max-w-md">
                                We're here to help. Meet the dedicated educators who make San Roque
                                Elementary School a place of success and learning.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STAFF SECTION ─────────────────────────────────── */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Section header */}
                    <div className="text-center mb-14">
                        <span className="inline-block bg-yellow-500/10 text-yellow-800 border border-yellow-400/30 text-[10px] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3">
                            Our Teachers
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] mt-1 mb-2">
                            The Heart of SRES
                        </h2>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Each teacher brings dedication, expertise, and genuine care for every child in our school community.
                        </p>
                    </div>

                    {/* ── Principal (featured) ── */}
                    <div className="flex justify-center mb-14">
                        <div className="bg-[#0a1f52] rounded-2xl overflow-hidden flex flex-col sm:flex-row max-w-[580px] w-full shadow-xl relative">
                            {/* Gold bottom line */}
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

                            {/* Photo */}
                            <img
                                src={PRINCIPAL.img}
                                alt={PRINCIPAL.name}
                                className="w-full sm:w-52 h-64 sm:h-auto object-contain object-center flex-shrink-0 bg-[#0d2660]"
                            />

                            {/* Body */}
                            <div className="p-7 flex flex-col justify-center">
                                <span className="inline-flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-400/35 text-yellow-200 text-[9px] font-extrabold uppercase tracking-[0.16em] px-3 py-1 rounded-full mb-3 w-fit">
                                    ★ &nbsp; School Principal
                                </span>
                                <h3 className="text-white font-extrabold text-xl mb-1">{PRINCIPAL.name}</h3>
                                <span className="block text-yellow-400 text-[11px] font-extrabold uppercase tracking-widest mb-3">{PRINCIPAL.position}</span>
                                <p className="text-white/55 text-sm leading-relaxed italic mb-5">"{PRINCIPAL.quote}"</p>

                                <div className="flex gap-2">
                                    <a
                                        href={PRINCIPAL.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg bg-white/8 border border-white/15 flex items-center justify-center text-white/60 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400/40 transition-all duration-200"
                                        title="Facebook"
                                    >
                                        <IconFacebook size={15} />
                                    </a>
                                    <a
                                        href={PRINCIPAL.messenger}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg bg-white/8 border border-white/15 flex items-center justify-center text-white/60 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400/40 transition-all duration-200"
                                        title="Messenger"
                                    >
                                        <IconMessenger size={15} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Divider ── */}
                    <div className="relative text-center mb-10">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
                        <span className="relative bg-[#f4f6fb] px-4 text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                            Meet Our Teachers
                        </span>
                    </div>

                    {/* ── Staff Grid ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {STAFF.map((member) => (
                            <StaffCard key={member.name} {...member} />
                        ))}
                    </div>

                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="bg-yellow-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-[#0a1f52]/50 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-2">Join the Team</p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1f52] leading-snug">
                            Interested in becoming<br />an SRES teacher?
                        </h2>
                        <p className="text-[#0a1f52]/60 text-sm mt-2 max-w-sm">
                            We're always looking for passionate teachers dedicated to shaping young minds.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-[#0a1f52] hover:bg-[#1a3a8a] text-white font-extrabold text-sm px-8 py-3.5 rounded-full transition-colors duration-200"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}