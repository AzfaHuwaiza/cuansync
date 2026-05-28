import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { hapusAuth, getIdUser, getRole } from "../utils/authStorage";
import { logoutUser } from "../services/authServices";

import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { MdDashboard } from "react-icons/md";
import { IoStorefrontSharp } from "react-icons/io5";
import { FaUsersLine } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { RiFileList3Line } from "react-icons/ri";
import { RiRobot2Fill } from "react-icons/ri";
import { IoWallet } from "react-icons/io5";
import { PiStorefrontBold } from "react-icons/pi";

const THEME_STORAGE_KEY = "cuansync.theme";

function getInitialDarkMode() {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === "dark") return true;
        if (saved === "light") return false;
    } catch {
        // ignore
    }
    return document.documentElement.classList.contains("dark");
}

function applyDarkClass(isDark) {
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

function persistTheme(isDark) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
        // ignore
    }
}

// Komponen Utama
export default function Header({ children, pageTitle, title }) {
    const role = getRole();
    const location = useLocation();
    
    const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        applyDarkClass(isDarkMode);
        persistTheme(isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode((v) => !v);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = async () => {
        try {
            const id_user = getIdUser();
            if (id_user) {
                await logoutUser();
            }
        } catch (err) {
            console.error("Logout Gagal:", err);
        } finally {
            hapusAuth();
            window.location.href = "/";
        }
    };

    const resolvedTitle = useMemo(() => {
        if (pageTitle) return pageTitle;
        if (title) return title;
        if (location.pathname === '/direktoryUmkm') return 'Direktori UMKM';
        if (location.pathname === '/daftarPengguna') return 'Daftar Pengguna';
        if (location.pathname === '/adminDashboard') return 'Ringkasan Sistem';
        return 'CuanSync';
    }, [location.pathname, pageTitle, title]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
            
            {/* OVERLAY UNTUK MOBILE */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* SIDEBAR TUNGGAL */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-gray-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 flex flex-col shadow-xl`}>
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <Link to="/home" className="text-emerald-500 font-extrabold text-2xl">
                        <div className="flex items-center gap-1">
                            <IoWallet size={24} /> CuanSync
                        </div>
                        
                    </Link>
                    <button onClick={toggleSidebar} className="ml-auto text-gray-400 hover:text-white md:hidden">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar">
                    <p className="text-xs font-bold text-slate-400 mb-4 tracking-widest">MENU UTAMA</p>
                    <nav className="flex flex-col gap-2">
                        <Link to="/konsultasiAi" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/konsultasiAi' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <RiRobot2Fill size={18} /> <span className="ml-2">Konsultasi AI</span>
                        </Link>
                        <Link to="/dashboard" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <RxDashboard size={18}/> <span className="ml-2"> Dashboard</span>
                        </Link>

                        {role === 'admin' && (
                            <>
                                <Link to="/adminDashboard" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/adminDashboard' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                                    <MdDashboard size={18}/> <span className="ml-2"> Admin Dashboard</span>
                                </Link>
                                <Link to="/direktoryUmkm" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/direktoryUmkm' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                                    <IoStorefrontSharp size={18}/> <span className="ml-2">Direktori UMKM</span>
                                </Link>
                                <Link to="/daftarPengguna" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/daftarPengguna' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                                    <FaUsersLine size={18} /> <span className="ml-2">Daftar Pengguna</span>
                                </Link>
                            </>
                        )}

                        <Link to="/umkmUser" className={`flex items-center px-4 py-3 rounded-xl transition-all gap-2 ${location.pathname === '/umkmUser' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <PiStorefrontBold size={18} /> <span className="ml-2">UMKM Saya</span>
                        </Link>
                        <Link to="/profile" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                             <FaUser size={18} /> <span className="ml-2">Profil Saya</span>
                        </Link>
                        <Link to="/allumkm" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/allumkm' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <AiFillShop size={18} /> <span className="ml-2">Semua UMKM</span>
                        </Link>
                        <Link to="/laporanTransaksi" className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === '/laporanTransaksi' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <RiFileList3Line size={18} /> <span className="ml-2">Laporan Transaksi</span>
                        </Link>
                        <Link to="/productUser" className={`flex items-center px-4 py-3 rounded-xl transition-all gap-2 ${location.pathname === '/productUser' ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}>
                            <BsBoxSeamFill size={18} /> <span className="ml-2">Katalog Etalase</span>
                        </Link>
                        
                    </nav>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-rose-500 hover:text-white transition-all font-semibold hover:cursor-pointer">
                        <FiLogOut size={20} />
                        <span>Keluar Aplikasi</span>
                    </button>
                </div>
            </aside>

            {/* AREA UTAMA (Header + Konten) */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* HEADER ATAS (Bersih, tanpa navigasi) */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                            aria-label="Toggle menu"
                        >
                            <FaBars size={18} />
                        </button>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block">
                            {resolvedTitle}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="h-10 w-10 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 inline-flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all shadow-sm hover:cursor-pointer"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} />}
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 h-10 rounded-xl shadow-sm shadow-rose-600/20 transition-all hover:cursor-pointer"
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </div>
                </header>

                {/* KONTEN HALAMAN */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
                    {children}
                </main>
            </div>
        </div>
    );
}