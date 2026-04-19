import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnnouncementTicker from "../components/AnnouncementTicker";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/*
                Ticker is OUTSIDE the sticky <header> in Navbar.
                This means it scrolls away when the user scrolls down,
                and the sticky navbar takes over cleanly beneath it.
            */}
            <AnnouncementTicker />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}