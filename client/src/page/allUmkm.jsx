import { useState, useEffect } from "react";
import Header from "../components/header";
import { getDataUmkm } from "../services/umkmService";
import { IoSearch } from "react-icons/io5";
import { IoStorefront } from "react-icons/io5";

export default function AllUmkm() {
    const [umkm, setUmkm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getDataUmkm();
                setUmkm(response.umkm);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUmkm();
    }, []);


    const filters = ["All", ...new Set(umkm.map(umkm => umkm.sector).filter(Boolean))];

    const filterUmkm = umkm.filter((umkm) => {
        const matchSearch = umkm.nama_umkm.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === 'All' || umkm.sector === activeFilter;
        return matchSearch && matchFilter;
    });

    return (
        <>

            <Header pageTitle="Jejaring Bisnis">
            
                <main className="bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto min-h-screen pb-12 transition-colors">
                    <div className="pt-8 px-4 sm:px-8 mb-6 flex flex-col items-center justify-between sm:flex-row sm:items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Jejaring Bisnis</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Temukan UMKM lain di jaringan CuanSync.</p>
                        </div>
                        
                        {/* TOMBOL SEARCH */}
                        <div className="relative max-w-md w-full flex items-center">
                            <div className="absolute text-slate-500 dark:text-slate-400 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoSearch size={20} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Cari UMKM..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                        </div>
                    </div>

                    {/* KATEGORI FILTER */}
                    <div className="flex flex-wrap gap-2 w-full pl-4 pr-4 justify-center sm:justify-start mb-6">
                        {filters.map((filter, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveFilter(filter)} 
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                                    activeFilter === filter
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    
                    {/* UMKM LIST */}
                    <div className="px-4 sm:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterUmkm.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    UMKM tidak ditemukan.
                                </div>
                            ) : (
                                filterUmkm.map((umkm, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                        {/* IMAGE */}
                                        <div className="bg-slate-100 dark:bg-slate-700 relative h-44 flex items-center justify-center">
                                            {umkm.photo_url ? (
                                                <img src={serverBaseUrl + umkm.photo_url} alt={umkm.nama_umkm} className="w-full h-full object-cover" />
                                            ) : (
                                                <IoStorefront className="text-slate-300 dark:text-slate-600" size={48} />
                                            )}
                                            <div className="top-3 absolute right-3 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                {umkm.sector}
                                            </div>
                                        </div>

                                        {/* INFO */}
                                        <div className="p-5 flex-1">
                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1">{umkm.nama_umkm}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm line-clamp-2">{umkm.note}</p>
                                        </div>

                                        <div className="border-t border-slate-100 dark:border-slate-700 p-5 flex items-center gap-3">
                                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-lg uppercase">
                                                {umkm.nama_owner.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                                                    Pemilik
                                                </p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-none">
                                                    {umkm.nama_owner}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </Header>
        </>
    );
}