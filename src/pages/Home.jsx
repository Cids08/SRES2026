import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Music, Calculator, BookOpen, BookMarked,
    Clock, Footprints, ChevronDown, ChevronUp,
    Star, Users, Award, GraduationCap, Play,
    CheckCircle2, Calendar, User,
} from "lucide-react";

/* ─── Backend-ready image config ────────────────────────────
   Swap these paths for API/CMS values later.
   e.g. replace with: import { getSiteConfig } from "@/api/config";
   or feed via props: <Home heroImage={config.heroImage} />
────────────────────────────────────────────────────────── */
const IMAGES = {
    hero:       "/images/hero-img-1-min.jpg",  // ← hero background image
    instructor: "/images/staff_6.jpg",
    aboutVideo: "/images/gal_3.jpg",
    whyUs:      "/images/gal_4.jpg",
};

/* ─── Data ──────────────────────────────────────────────── */
const SUBJECTS = [
    { Icon: Music,      title: "Music Class",       desc: "A creative space where students learn about rhythm, melody, instruments, and musical expression through listening, singing, and playing." },
    { Icon: Calculator, title: "Math Class",         desc: "Focused on numbers, problem-solving, and logical thinking — covering arithmetic, algebra, geometry, and more." },
    { Icon: BookOpen,   title: "English Class",      desc: "Develops reading, writing, speaking, and comprehension skills, often exploring literature and grammar." },
    { Icon: BookMarked, title: "Reading for Kids",   desc: "Builds literacy skills, fosters imagination, and encourages a love for books through storytelling and comprehension exercises." },
    { Icon: Clock,      title: "History Class",      desc: "A study of past events, civilizations, and influential figures — helping students understand how the past shapes the present." },
    { Icon: Footprints, title: "Sports",             desc: "Promotes fitness, teamwork, and coordination through various sports, exercises, and games." },
];

const NEWS = [
    { img: "/images/hero-img-1-min.jpg", title: "2025 Grand Alumni Homecoming",  date: "May 6, 2025",   body: "The first ever alumni homecoming event of San Roque Elementary School." },
    { img: "/images/gal_3.jpg",          title: "Enroll Your Kids This Summer",  date: "June 22, 2025", body: "Give your children the opportunity to learn, grow, and excel by enrolling them this summer — quality education and a nurturing environment await." },
];

const WHY_ITEMS = [
    {
        title: "Good Teachers and Staff",
        body: "Our dedicated and passionate educators are highly trained to provide quality instruction and guidance, ensuring that every child reaches their full potential. Our supportive staff also plays a vital role in creating a positive and nurturing learning environment.",
        img: "/images/gal_3.jpg",
    },
    {
        title: "We Value Good Characters",
        body: "Beyond academics, we emphasize the importance of kindness, respect, and responsibility. We instill strong moral values in our students, shaping them into well-rounded individuals prepared for the future.",
        img: "/images/gal_1.jpg",
    },
    {
        title: "Your Children are Safe",
        body: "We prioritize the safety and well-being of every student, maintaining a secure and caring school environment where they can learn with confidence and peace of mind.",
        img: "/images/gal_3.jpg",
    },
];

/* ─── Animated counter ───────────────────────────────────── */
function Counter({ target }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const duration = 1400;
                    const steps = 60;
                    const increment = target / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) { setCount(target); clearInterval(timer); }
                        else setCount(Math.floor(current));
                    }, duration / steps);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}</span>;
}

/* ─── Accordion ──────────────────────────────────────────── */
function Accordion({ items }) {
    const [open, setOpen] = useState(0);
    return (
        <div className="space-y-3">
            {items.map(({ title, body, img }, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setOpen(open === i ? -1 : i)}
                        className={`w-full flex items-center justify-between px-5 py-4 text-left text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
                            open === i ? "bg-[#0a1f52] text-white" : "text-[#0a1f52] hover:bg-blue-50"
                        }`}
                    >
                        {title}
                        {open === i
                            ? <ChevronUp size={16} className="flex-shrink-0" />
                            : <ChevronDown size={16} className="flex-shrink-0" />}
                    </button>
                    {open === i && (
                        <div className="px-5 py-4 flex gap-4 items-start">
                            <img src={img} alt={title}
                                className="w-24 h-20 object-cover rounded-lg flex-shrink-0 hidden sm:block" />
                            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─── Section label ──────────────────────────────────────── */
function SectionLabel({ children }) {
    return (
        <span className="inline-block bg-yellow-500/10 text-yellow-800 border border-yellow-400/30 text-[10px] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full mb-3">
            {children}
        </span>
    );
}

/* ─── Gold underline ──────────────────────────────────────── */
function GoldLine() {
    return <div className="w-12 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full my-4" />;
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
    return (
        <div className="bg-gray-50">

            {/* ── 1. HERO ──────────────────────────────────────────── */}
            <section
                className="relative text-white overflow-hidden"
                style={{
                    backgroundImage: `url('${IMAGES.hero}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Dark overlay — keeps text readable over any photo */}
                <div className="absolute inset-0 bg-[#0a1f52]/70 pointer-events-none" />

                {/* Subtle decorative blobs on top of overlay */}
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-yellow-400/5 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
                    {/* Badge — pinned left */}
                    <div className="flex mb-6">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-1.5">
                            <Star size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                            <span className="text-yellow-300 text-[10px] font-extrabold uppercase tracking-widest">
                                DepEd · Division of Catanduanes
                            </span>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-2xl mb-6">
                        Partner for Your{" "}
                        <span className="text-yellow-400">Future</span>{" "}
                        of Learning
                    </h1>

                    {/* Description */}
                    <p className="text-white/75 text-[15px] leading-relaxed max-w-lg mb-8 border-l-4 border-yellow-500 pl-4">
                        At San Roque Elementary School, we provide quality education in a safe and
                        supportive environment. Guided by our core values, we prepare learners to
                        become responsible and successful members of society.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/history"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1f52] font-extrabold text-sm px-7 py-3 rounded-full transition-colors duration-200"
                        >
                            Learn More
                        </Link>
                        <Link
                            to="/announcement"
                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/50 hover:border-white/80 text-white font-bold text-sm px-7 py-3 rounded-full backdrop-blur-sm transition-all duration-200"
                        >
                            View Announcements
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2. Teach With Us ──────────────────────────── */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionLabel>Join Our Team</SectionLabel>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] leading-tight">
                            Teach With Us
                        </h2>
                        <GoldLine />
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            San Roque Elementary School is looking for passionate and dedicated
                            individuals to join our team of educators. If you have the heart for
                            teaching and the commitment to shaping the future of young learners,
                            we invite you to become part of our school community.
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            We value teachers who embody the following qualities:
                        </p>
                        <ul className="space-y-3 mb-8">
                            {["Passion for Teaching", "Patience and Understanding", "Compassion and Empathy"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 size={18} className="text-yellow-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-[#0a1f52] hover:bg-[#1a3a8a] text-white font-bold text-sm px-7 py-3 rounded-full transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Image */}
                    <div className="relative">
                        <img
                            src={IMAGES.instructor}
                            alt="Instructor"
                            className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        />
                        <div
                            className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full -z-10"
                            style={{ backgroundImage: "radial-gradient(circle, #c9a22740 1.5px, transparent 1.5px)", backgroundSize: "10px 10px" }}
                        />
                    </div>
                </div>
            </section>

            {/* ── 3. BEST EDUCATION / SUBJECTS ─────────────────────── */}
            <section className="bg-[#f4f6fb] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <SectionLabel>What We Offer</SectionLabel>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] mt-2 mb-3">
                            We Have Best Education
                        </h2>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            We provide the highest quality education, fostering knowledge, skills, and growth for a successful future.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SUBJECTS.map(({ Icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                            >
                                <div className="w-13 h-13 rounded-full bg-[#0a1f52]/6 border border-[#0a1f52]/12 flex items-center justify-center mx-auto mb-4 p-3">
                                    <Icon size={24} className="text-[#0a1f52]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[#0a1f52] font-bold text-sm mb-2">{title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. ABOUT US + VIDEO ───────────────────────────────── */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionLabel>About Us</SectionLabel>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] leading-tight mt-2">
                            Nurturing Every Child's Full Potential
                        </h2>
                        <GoldLine />
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            With our steadfast focus on academic excellence, character development, and
                            overall growth, our goal is to nurture each student's full potential to
                            succeed in life.
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed mb-5">
                            We provide a supportive environment where students can develop their
                            talents, discover their passions, and achieve their goals. Well-known for:
                        </p>
                        <ul className="space-y-2 mb-8">
                            {["Professional Teachers", "Eco-Friendly School"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                                    <CheckCircle2 size={17} className="text-yellow-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        {/* Stat counters */}
                        <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-gray-100">
                            {[
                                { Icon: Users,         value: 167, label: "Students" },
                                { Icon: GraduationCap, value: 10,  label: "Teachers" },
                                { Icon: Award,         value: 12,  label: "Awards"   },
                            ].map(({ Icon, value, label }) => (
                                <div key={label} className="text-center">
                                    <div className="text-2xl font-extrabold text-[#0a1f52]">
                                        <Counter target={value} />
                                    </div>
                                    <div className="text-gray-400 text-[11px] uppercase tracking-wide mt-1">{label}</div>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/enroll"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1f52] font-extrabold text-sm px-7 py-3 rounded-full transition-colors duration-200"
                        >
                            Apply for Admission
                        </Link>
                    </div>

                    {/* Video thumbnail */}
                    <div className="relative">
                        <a
                            href="https://www.youtube.com/shorts/lSt3kYqCuww"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={IMAGES.aboutVideo}
                                alt="School video"
                                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-[#0a1f52]/40 flex items-center justify-center group-hover:bg-[#0a1f52]/55 transition-colors duration-200">
                                <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <Play size={22} className="text-[#0a1f52] fill-[#0a1f52] ml-1" />
                                </div>
                            </div>
                        </a>
                        {/* Decorative */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-dashed border-yellow-400/30 -z-10" />
                    </div>
                </div>
            </section>

            {/* ── 5. SCHOOL NEWS ───────────────────────────────────── */}
            <section className="bg-[#f4f6fb] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <SectionLabel>Latest Updates</SectionLabel>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] mt-2 mb-2">
                            School News
                        </h2>
                        <p className="text-gray-500 text-sm">News will be posted here. Stay tuned for more updates.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {NEWS.map(({ img, title, date, body }) => (
                            <Link
                                key={title}
                                to="/announcement"
                                className="group flex bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div className="w-36 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={img}
                                        alt={title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-5 flex-1 min-w-0">
                                    <h3 className="text-[#0a1f52] font-bold text-sm leading-snug mb-2 group-hover:text-yellow-700 transition-colors">
                                        {title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-400 text-[11px] mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} /> {date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={11} /> Admin
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{body}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. PRICING ───────────────────────────────────────── */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <SectionLabel>Tuition</SectionLabel>
                    <h2 className="text-3xl font-extrabold text-[#0a1f52] mt-2 mb-6">Pricing</h2>
                    <div className="inline-flex items-center gap-3 bg-[#0a1f52] text-yellow-400 rounded-full px-10 py-5">
                        <Star size={20} className="fill-yellow-400" />
                        <span className="text-xl font-extrabold">All Free — Public School</span>
                        <Star size={20} className="fill-yellow-400" />
                    </div>
                    <p className="text-gray-400 text-sm mt-5">
                        San Roque Elementary School is a public institution. Education is free for all enrolled students.
                    </p>
                </div>
            </section>

            {/* ── 7. WHY CHOOSE US ──────────────────────────────────── */}
            <section className="bg-[#f4f6fb] py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="relative">
                        <img
                            src={IMAGES.whyUs}
                            alt="Why choose us"
                            className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        />
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full -z-10"
                            style={{ backgroundImage: "radial-gradient(circle, #0a1f5230 1.5px, transparent 1.5px)", backgroundSize: "10px 10px" }} />
                    </div>
                    <div>
                        <SectionLabel>Why Choose Us</SectionLabel>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f52] mt-2 leading-tight">
                            The SRES Difference
                        </h2>
                        <GoldLine />
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Choose San Roque Elementary School for a strong foundation in learning, a
                            supportive environment, and dedicated teachers committed to your child's success.
                        </p>
                        <Accordion items={WHY_ITEMS} />
                    </div>
                </div>
            </section>

        </div>
    );
}