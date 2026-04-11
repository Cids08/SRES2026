import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Staff from "./pages/Staff";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Announcement from "./pages/Announcement";
import Contact from "./pages/Contact";
import Enroll from "./pages/Enroll";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* All public pages share the MainLayout (Navbar + Footer) */}
                <Route element={<MainLayout />}>
                    <Route path="/"             element={<Home />}         />
                    <Route path="/history"      element={<About />}        />
                    <Route path="/staff"        element={<Staff />}        />
                    <Route path="/news"         element={<News />}         />
                    <Route path="/gallery"      element={<Gallery />}      />
                    <Route path="/announcement" element={<Announcement />} />
                    <Route path="/contact"      element={<Contact />}      />
                    <Route path="/enroll" element={<Enroll />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}