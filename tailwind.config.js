/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // SectionLabel component
    "bg-yellow-500/10",
    "text-yellow-800",
    "border-yellow-400/30",

    // Arbitrary opacity values Tailwind often misses
    "bg-[#0a1f52]/6",
    "bg-[#0a1f52]/12",
    "border-[#0a1f52]/12",

    // Hover states inside group / ternaries
    "group-hover:text-yellow-700",
    "hover:bg-blue-50",

    // Accordion active state
    "bg-[#0a1f52]",
    "text-[#0a1f52]",

    // Hero & general yellows
    "text-yellow-400",
    "text-yellow-300",
    "fill-yellow-400",
    "bg-yellow-500/20",
    "border-yellow-500/50",
    "border-yellow-500/30",
    "after:bg-yellow-500",

    // Navbar active/inactive link states
    "text-white/65",
    "text-white/60",
    "bg-yellow-500/15",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}