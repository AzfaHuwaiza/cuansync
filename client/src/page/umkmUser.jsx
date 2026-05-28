import { useState, useEffect, useCallback } from "react";
import Header from "../components/header";
import { getUMKMByUser, deleteUMKM } from "../services/umkmService";
import { IoSearch } from "react-icons/io5";
import { IoStorefront } from "react-icons/io5";
import { FaPen, FaTrash } from "react-icons/fa"; // Icon buat edit & hapus
import { getIdUser } from "../utils/authStorage"; // Ambil ID user yg login
import ModalEditUmkm from "../modalSelect/modalUpdateUmkm"; // 👈 Import modal editnya (Sesuaikan path)

export default function UmkmUser() {
    const userId = getIdUser(); // Dapet ID dari token
    const [umkm, setUmkm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    // State untuk Modal Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUmkmToEdit, setSelectedUmkmToEdit] = useState(null);

    // Pakai useCallback agar bisa dipanggil ulang dari modal onSuccess
    const fetchUmkm = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUMKMByUser(userId);
            setUmkm(response.umkm);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUmkm();
    }, [fetchUmkm]);



    // FUNGSI HAPUS UMKM
    const handleDelete = async (id, namaUmkm) => {
        if (window.confirm(`Yakin ingin menghapus UMKM "${namaUmkm}" secara permanen? Data yang dihapus tidak dapat dikembalikan.`)) {
            try {
                await deleteUMKM(id);
                alert("UMKM berhasil dihapus!");
                fetchUmkm(); // Tarik ulang data biar kartu UMKM-nya hilang dari layar
            } catch (err) {
                alert(err.message || "Gagal menghapus UMKM.");
            }
        }
    };

    // FUNGSI BUKA MODAL EDIT
    const handleEditClick = (umkmData) => {
        setSelectedUmkmToEdit(umkmData);
        setIsEditModalOpen(true);
    };

    const filters = ["All", ...new Set(umkm.map(u => u.sector).filter(Boolean))];

    const filterUmkm = umkm.filter((u) => {
        const matchSearch = u.nama_umkm?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = activeFilter === 'All' || u.sector === activeFilter;
        return matchSearch && matchFilter;
    });

    return (
        <>
            <Header pageTitle="Jejaring Bisnis">
                <main className="bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto min-h-screen pb-12 transition-colors relative">
                    
                    {/* 👇 PASANG MODAL EDIT DI SINI 👇 */}
                    <ModalEditUmkm 
                        isOpen={isEditModalOpen} 
                        onClose={() => setIsEditModalOpen(false)} 
                        umkmData={selectedUmkmToEdit}
                        onSuccess={fetchUmkm} // Otomatis refresh data di background kalo sukses edit
                    />

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
                                filterUmkm.map((u, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
                                        
                                        {/* 👇 TOMBOL EDIT & HAPUS (HANYA MUNCUL KALO UMKM INI PUNYA DIA) 👇 */}
                                        {u.user_id === userId && (
                                            <div className="absolute top-3 left-3 z-10 flex gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(u)}
                                                    className="hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                                                    title="Edit UMKM"
                                                >
                                                    <FaPen size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(u.id, u.nama_umkm)}
                                                    className="hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                                                    title="Hapus UMKM"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        )}

                                        {/* IMAGE */}
                                        <div className="bg-slate-100 dark:bg-slate-700 relative h-44 flex items-center justify-center">
                                            {u.photo_url ? (
                                                <img src={serverBaseUrl + u.photo_url} alt={u.nama_umkm} className="w-full h-full object-cover" />
                                            ) : (
                                                <IoStorefront className="text-slate-300 dark:text-slate-600" size={48} />
                                            )}
                                            <div className="top-3 absolute right-3 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                {u.sector}
                                            </div>
                                        </div>

                                        {/* INFO */}
                                        <div className="p-5 flex-1">
                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1">{u.nama_umkm}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm line-clamp-2">{u.note}</p>
                                        </div>
                                        
                                        {/* OWNER INFO DIBUANG SESUAI PERMINTAAN LU */}
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