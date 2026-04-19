import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const QUICK_LINKS = [
    { label: "About Us",      path: "/history"      },
    { label: "Our Staff",     path: "/staff"        },
    { label: "News & Events", path: "/news"         },
    { label: "Gallery",       path: "/gallery"      },
    { label: "Announcements", path: "/announcement" },
    { label: "Admission",     path: "/enroll"       },
];

const CONTACT = [
    { Icon: MapPin, text: "San Roque, Viga, Catanduanes 4805",
      href: "https://www.google.com/maps/place/San+Roque,+Viga,+Catanduanes", external: true },
    { Icon: Phone, text: "+63 9605519104",       href: "tel:09605519104"            },
    { Icon: Mail,  text: "113330@deped.gov.ph",  href: "mailto:113330@deped.gov.ph" },
    { Icon: Clock, text: "Mon–Fri, 8:00 AM – 5:00 PM" },
];

/* ─── Inline SVG social icons ───────────────────────────── */
function FacebookIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function MessengerIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.688 7.205V22l3.368-1.85c.9.25 1.854.385 2.844.385 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.02 12.44l-2.55-2.72-4.98 2.72 5.476-5.814 2.612 2.72 4.918-2.72-5.476 5.814z" />
        </svg>
    );
}

const SOCIALS = [
    { label: "Facebook",  Icon: FacebookIcon,  href: "https://www.facebook.com/profile.php?id=100064610601018" },
    { label: "Messenger", Icon: MessengerIcon, href: "https://m.me/profile.php?id=100064610601018" },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#071640] text-white">

            {/* Gold stripe */}
            <div className="h-[4px] bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <img src="/images/logo.png" alt="SRES Logo"
                            className="h-11 w-11 rounded-full object-cover border-2 border-yellow-500 bg-white p-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-extrabold text-base leading-tight">SRES</p>
                            <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                                Est. San Roque, Catanduanes
                            </p>
                        </div>
                    </div>
                    <h6 className="text-white/80 font-semibold text-sm mb-3">
                        San Roque Elementary School
                    </h6>
                    <p className="text-white/50 text-[13px] leading-relaxed mb-5">
                        Learning at San Roque Elementary School goes beyond the classroom.
                        Every child has the potential to excel in academics and in character.
                    </p>

                    {/* Social icons */}
                    <div className="flex gap-2">
                        {SOCIALS.map(({ label, Icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-9 h-9 rounded-full bg-white/8 border border-yellow-600/25 hover:bg-yellow-500/20 hover:border-yellow-500 flex items-center justify-center text-white/55 hover:text-yellow-400 transition-all duration-200"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-yellow-400 mb-5">
                        Quick Links
                    </p>
                    <ul className="space-y-2.5">
                        {QUICK_LINKS.map(({ label, path }) => (
                            <li key={path}>
                                <Link to={path}
                                    className="group flex items-center gap-2.5 text-[13px] text-white/55 hover:text-white transition-all duration-200">
                                    <span className="block w-5 h-px bg-yellow-600 group-hover:w-8 transition-all duration-200 flex-shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-yellow-400 mb-5">
                        Contact Us
                    </p>
                    <ul className="space-y-3.5">
                        {CONTACT.map(({ Icon, text, href, external }) => (
                            <li key={text} className="flex items-start gap-3">
                                <div className="w-[30px] h-[30px] rounded-lg bg-yellow-500/10 border border-yellow-600/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon size={13} className="text-yellow-400" strokeWidth={2} />
                                </div>
                                {href ? (
                                    <a href={href}
                                        target={external ? "_blank" : undefined}
                                        rel={external ? "noopener noreferrer" : undefined}
                                        className="text-[13px] text-white/55 hover:text-white leading-snug transition-colors duration-200">
                                        {text}
                                    </a>
                                ) : (
                                    <span className="text-[13px] text-white/55 leading-snug">{text}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left space-y-1">
                    <p className="text-[11.5px] text-white/30">
                        By using this site, you agree to the{" "}
                        <span className="text-white/45">Terms of Use</span> and{" "}
                        <span className="text-white/45">Privacy Policy</span>.
                    </p>
                    <p className="text-[11.5px] text-white/30">
                        © {year} San Roque Elementary School — Designed by{" "}
                        <span className="text-white/45">Saludares &amp; Friends</span> · Developed by{" "}
                        <a href="https://www.facebook.com/carljohnmorales.08"
                            target="_blank" rel="noopener noreferrer"
                            className="text-white/45 hover:text-yellow-400 transition-colors">
                            Ace
                        </a>.
                    </p>
                </div>
                <Link to="/admin/login" title="" aria-label="Admin">
                    <span className="block w-2 h-2 rounded-full bg-white/10 hover:bg-white/25 transition-colors duration-300" />
                </Link>
            </div>
        </footer>
    );
}