import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, PencilLine, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home",         path: "/"             },
    { label: "About Us",     path: "/history"      },
    { label: "Our Faculty",    path: "/staff"        },
    { label: "News",         path: "/news"         },
    { label: "Gallery",      path: "/gallery"      },
    { label: "Announcement", path: "/announcement" },
    { label: "Contact Us",   path: "/contact"      },
];

export default function Navbar() {
    const location = useLocation();
    const [scrolled,   setScrolled]   = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [search,     setSearch]     = useState("");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 56);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setMobileOpen(false), [location.pathname]);

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim())
            window.location.href = `/search?q=${encodeURIComponent(search.trim())}`;
    };

    return (
        <header className="sticky top-0 z-50">

            {/* Gold stripe */}
            <div className="h-[5px] bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

            {/* Top bar — collapses on scroll */}
            <div className={`bg-[#0a1f52] overflow-hidden transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src="/images/logo.png" alt="SRES Logo"
                            className="h-10 w-10 rounded-full object-cover border-2 border-yellow-500 bg-white p-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm sm:text-[15px] leading-tight truncate">
                                San Roque Elementary School
                            </p>
                            <p className="text-yellow-400 text-[10px] font-semibold tracking-widest uppercase mt-0.5 hidden sm:block">
                                DepEd · Division of Catanduanes
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                        <span className="text-white/45 text-xs hidden lg:block">
                            Join with us and be a part of success
                        </span>
                        <Link to="/enroll"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1f52] font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors duration-200">
                            <PencilLine size={13} strokeWidth={2.5} />
                            Enroll Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Nav bar — fully opaque, no backdrop-blur to prevent color bleed from hero */}
            <nav className="bg-[#0d2460] border-b border-yellow-600/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-stretch justify-between gap-2">

                    {/* Scrolled mini brand */}
                    <Link to="/" className={`flex items-center gap-2 font-bold text-sm flex-shrink-0 transition-all duration-300 ${scrolled ? "opacity-100 py-2 mr-3 w-auto" : "opacity-0 w-0 overflow-hidden pointer-events-none"}`}>
                        <img src="/images/logo.png" alt="SRES"
                            className="h-7 w-7 rounded-full object-cover border border-yellow-400 bg-white p-0.5" />
                        <span className="text-yellow-400 whitespace-nowrap">SRES</span>
                    </Link>

                    {/* Desktop links */}
                    <ul className="hidden lg:flex items-stretch">
                        {NAV_LINKS.map(({ label, path }) => {
                            const active = isActive(path);
                            return (
                                <li key={path} className="relative flex items-stretch">
                                    <Link to={path}
                                        className={`flex items-center px-3 py-4 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200 relative ${
                                            active
                                                ? "text-yellow-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[3px] after:bg-yellow-500 after:rounded-t-sm"
                                                : "text-white/65 hover:text-white hover:bg-white/5"
                                        }`}>
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Search + hamburger */}
                    <div className="flex items-center gap-2 py-2 flex-shrink-0 ml-auto">
                        <form onSubmit={handleSearch}
                            className="hidden md:flex items-center bg-white/10 border border-white/20 rounded-full overflow-hidden focus-within:border-yellow-500/60 focus-within:bg-white/15 transition-all duration-200">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search…"
                                className="bg-transparent text-white placeholder-white/40 text-[13px] px-4 py-1.5 outline-none w-28 focus:w-40 transition-all duration-300"
                            />
                            <button type="submit" aria-label="Search"
                                className="px-3 text-white/50 hover:text-yellow-400 transition-colors">
                                <Search size={14} strokeWidth={2.5} />
                            </button>
                        </form>
                        <button
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label="Toggle navigation"
                            aria-expanded={mobileOpen}
                            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-screen" : "max-h-0"}`}>
                    <div className="bg-[#071640] border-t border-yellow-600/20 px-4 pt-3 pb-5 space-y-1">
                        {NAV_LINKS.map(({ label, path }) => {
                            const active = isActive(path);
                            return (
                                <Link key={path} to={path}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                        active
                                            ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}>
                                    {active && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />}
                                    {label}
                                </Link>
                            );
                        })}
                        <div className="pt-3 mt-1 border-t border-white/10 space-y-2">
                            <Link to="/enroll"
                                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#0a1f52] font-extrabold text-xs uppercase tracking-widest w-full py-3 rounded-full transition-colors duration-200">
                                <PencilLine size={14} strokeWidth={2.5} />
                                Enroll Now
                            </Link>
                            <form onSubmit={handleSearch} className="flex items-center border border-white/15 rounded-full overflow-hidden">
                                <input
                                    type="search"
                                    placeholder="Search…"
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-white placeholder-white/40 text-sm px-4 py-2.5 outline-none flex-1"
                                />
                                <button type="submit" className="px-4 text-white/50 hover:text-yellow-400 transition-colors">
                                    <Search size={15} strokeWidth={2.5} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}