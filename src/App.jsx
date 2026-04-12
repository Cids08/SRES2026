import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home         from "./pages/Home";
import About        from "./pages/About";
import Staff        from "./pages/Staff";
import News         from "./pages/News";
import Gallery      from "./pages/Gallery";
import Announcement from "./pages/Announcement";
import Contact      from "./pages/Contact";
import Enroll       from "./pages/Enroll";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard  from "./pages/admin/Dashboard";
import ResetPassword from "./pages/admin/ResetPassword";



export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ── Public pages (Navbar + Footer) ── */}
                <Route element={<MainLayout />}>
                    <Route path="/"             element={<Home />}         />
                    <Route path="/history"      element={<About />}        />
                    <Route path="/staff"        element={<Staff />}        />
                    <Route path="/news"         element={<News />}         />
                    <Route path="/gallery"      element={<Gallery />}      />
                    <Route path="/announcement" element={<Announcement />} />
                    <Route path="/contact"      element={<Contact />}      />
                    <Route path="/enroll"       element={<Enroll />}       />
                </Route>

                {/* ── Admin login (no layout at all) ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />

                {/* ── Admin pages (AdminSidebar + AdminNavbar, no public Navbar/Footer) ── */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index                   element={<Dashboard />}   />
                    {/* Add more admin pages here as you build them:         */}
                    {/* <Route path="enrollments"   element={<ManageEnrollments />}   /> */}
                    {/* <Route path="announcements" element={<ManageAnnouncements />} /> */}
                    {/* <Route path="news"          element={<ManageNews />}          /> */}
                    {/* <Route path="gallery"       element={<ManageGallery />}       /> */}
                    {/* <Route path="staff"         element={<ManageStaff />}         /> */}
                </Route>

            </Routes>
        </BrowserRouter>
    );
}