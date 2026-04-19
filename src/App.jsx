import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout  from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

/* ── Public pages ── */
import Home         from "./pages/Home";
import About        from "./pages/About";
import Staff        from "./pages/Staff";
import Gallery      from "./pages/Gallery";
import Announcement from "./pages/Announcement";
import Contact      from "./pages/Contact";
import Enroll       from "./pages/Enroll";

/* ── Admin pages ── */
import AdminLogin             from "./pages/admin/AdminLogin";
import ResetPassword          from "./pages/admin/ResetPassword";
import Dashboard              from "./pages/admin/Dashboard";
import Enrollments            from "./pages/admin/Enrollments";
import Students               from "./pages/admin/Students";
import ManageAnnouncements    from "./pages/admin/Announcements";
import AnnouncementCategories from "./pages/admin/AnnouncementCategories";
import AdminGallery           from "./pages/admin/Gallery";
import AdminStaff             from "./pages/admin/Staff";
import Messages               from "./pages/admin/Message";
import Settings               from "./pages/admin/Settings";

/* ── Guard pages ── */
import EnrollmentClosed from "./pages/EnrollmentClosed";
import Maintenance      from "./pages/Maintenance";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/* ─────────────────────────────────────────────────────────────────────────
   SETTINGS CONTEXT
   Fetches /api/settings (public endpoint) on mount and every 2 minutes.
   All public pages read from this — no extra fetch needed in each component.
───────────────────────────────────────────────────────────────────────── */
const DEFAULTS = {
    enrollment_open:     true,
    maintenance_mode:    false,
    maintenance_pages:   [],
    school_year:         "2025–2026",
    announcement_ticker: "",
    school_name:         "San Roque Elementary School",
    school_tagline:      "DepEd · Division of Catanduanes",
    school_email:        "113330@deped.gov.ph",
    school_phone:        "+63 9605519104",
    school_address:      "San Roque, Viga, Catanduanes, Philippines",
    _loaded:             false,
};

const SettingsContext = createContext(DEFAULTS);

function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULTS);

    function fetchSettings() {
        fetch(`${API_URL}/settings`)
            .then(r => {
                if (!r.ok) throw new Error("Settings fetch failed");
                return r.json();
            })
            .then(d => {
                setSettings({
                    enrollment_open:     d.enrollment_open  === true || d.enrollment_open  === "true" || d.enrollment_open  === 1,
                    maintenance_mode:    d.maintenance_mode === true || d.maintenance_mode === "true" || d.maintenance_mode === 1,
                    maintenance_pages:   Array.isArray(d.maintenance_pages) ? d.maintenance_pages : [],
                    school_year:         d.school_year         || "2025–2026",
                    // IMPORTANT: read announcement_ticker from API response
                    announcement_ticker: d.announcement_ticker ?? "",
                    school_name:         d.school_name    || "San Roque Elementary School",
                    school_tagline:      d.school_tagline || "DepEd · Division of Catanduanes",
                    school_email:        d.school_email   || "113330@deped.gov.ph",
                    school_phone:        d.school_phone   || "+63 9605519104",
                    school_address:      d.school_address || "San Roque, Viga, Catanduanes, Philippines",
                    _loaded: true,
                });
            })
            .catch(() => {
                // On error keep defaults but mark as loaded so guards don't block forever
                setSettings(s => ({ ...s, _loaded: true }));
            });
    }

    useEffect(() => {
        fetchSettings();
        const id = setInterval(fetchSettings, 2 * 60 * 1000); // re-poll every 2 min
        return () => clearInterval(id);
    }, []);

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}

// Export this hook — use it in Home, MainLayout, Navbar, Footer, etc.
// e.g.  const { announcement_ticker, school_name } = useSettings();
export function useSettings() {
    return useContext(SettingsContext);
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGE GUARDS
───────────────────────────────────────────────────────────────────────── */

/** Shows Maintenance screen while a page is under maintenance */
function MaintenanceGuard({ pageKey, label, children }) {
    const { maintenance_mode, maintenance_pages, _loaded } = useSettings();

    if (!_loaded) return null; // wait — don't flash wrong content

    if (maintenance_mode) return <Maintenance pageName={label} />;

    if (Array.isArray(maintenance_pages) && maintenance_pages.includes(pageKey)) {
        return <Maintenance pageName={label} />;
    }

    return children;
}

/** Shows EnrollmentClosed when enrollment is toggled off in admin */
function EnrollGuard() {
    const { enrollment_open, _loaded } = useSettings();

    if (!_loaded) return null;
    return enrollment_open ? <Enroll /> : <EnrollmentClosed />;
}

/* ─────────────────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────────────────── */
export default function App() {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <Routes>

                    {/* ── Public pages (MainLayout = Navbar + Footer) ── */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={
                            <MaintenanceGuard pageKey="home" label="Homepage">
                                <Home />
                            </MaintenanceGuard>
                        } />
                        <Route path="/history" element={
                            <MaintenanceGuard pageKey="history" label="School History">
                                <About />
                            </MaintenanceGuard>
                        } />
                        <Route path="/staff" element={
                            <MaintenanceGuard pageKey="staff" label="Faculty & Staff">
                                <Staff />
                            </MaintenanceGuard>
                        } />
                        <Route path="/gallery" element={
                            <MaintenanceGuard pageKey="gallery" label="Gallery">
                                <Gallery />
                            </MaintenanceGuard>
                        } />
                        <Route path="/announcement" element={
                            <MaintenanceGuard pageKey="announcement" label="Announcements">
                                <Announcement />
                            </MaintenanceGuard>
                        } />
                        <Route path="/contact" element={
                            <MaintenanceGuard pageKey="contact" label="Contact Us">
                                <Contact />
                            </MaintenanceGuard>
                        } />
                        <Route path="/enroll" element={
                            <MaintenanceGuard pageKey="enroll" label="Online Enrollment">
                                <EnrollGuard />
                            </MaintenanceGuard>
                        } />
                    </Route>

                    {/* ── Admin auth (no layout) ── */}
                    <Route path="/admin/login"          element={<AdminLogin />}    />
                    <Route path="/admin/reset-password" element={<ResetPassword />} />

                    {/* ── Admin panel (sidebar + topbar) ── */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index                          element={<Dashboard />}              />
                        <Route path="enrollments"             element={<Enrollments />}            />
                        <Route path="students"                element={<Students />}               />
                        <Route path="announcements"           element={<ManageAnnouncements />}    />
                        <Route path="announcement-categories" element={<AnnouncementCategories />} />
                        <Route path="gallery"                 element={<AdminGallery />}           />
                        <Route path="staff"                   element={<AdminStaff />}             />
                        <Route path="messages"                element={<Messages />}               />
                        <Route path="settings"                element={<Settings />}               />
                    </Route>

                </Routes>
            </SettingsProvider>
        </BrowserRouter>
    );
}