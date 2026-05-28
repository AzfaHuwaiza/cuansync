import { useMemo, useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import Header from "../components/header";
import { getAllUMKMByAdmin, deleteUMKM } from "../services/umkmService";
import TableTemplate from "../components/tableTemplate";
import { FiTrash2 } from "react-icons/fi";

export default function DirektoryUMKM() {
    const [umkm, setUmkm] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                setLoading(true);
                const response = await getAllUMKMByAdmin();
                setUmkm(response.data.umkm || []);
            } catch (err) {
                console.error(err);
                setUmkm([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUmkm();
    }, []);

    const handleDeleteUmkm = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus UMKM ini?")) return;
        try {
            await deleteUMKM(id);
            setUmkm((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Gagal menghapus UMKM:", err);
            alert("Gagal menghapus UMKM. Silakan coba lagi.");
        }
    };

    const filteredUmkm = useMemo(() => {
        const keyword = searchQuery.trim().toLowerCase();
        if (!keyword) return umkm;

        return umkm.filter((item) => {
            return (
                (item.namaUmkm && item.namaUmkm.toLowerCase().includes(keyword)) ||
                (item.sector && item.sector.toLowerCase().includes(keyword)) ||
                (item.namaOwner && item.namaOwner.toLowerCase().includes(keyword))
            );
        });
    }, [umkm, searchQuery]);

    const tableColumns = useMemo(
        () => [
            {
                header: "Profil UMKM/Bisnis",
                className: "w-96",
                render: (row) => (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {row.img ? (
                                <img
                                    src={row.img?.startsWith('http') ? row.img : `${serverBaseUrl}${row.img}`}
                                    alt={row.namaUmkm}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <BsShop size={26} className="text-slate-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{row.namaUmkm}</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-300 mt-0.5">
                                {row.description || "-"}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                header: "Sektor",
                className: "w-48",
                render: (row) => (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg border border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/20">
                        {row.sector || "-"}
                    </span>
                ),
            },
            {
                header: "Pemilik",
                className: "w-64",
                tdClassName: "text-sm font-medium text-slate-700 dark:text-gray-200",
                render: (row) =>
                    row.namaOwner ? (
                        row.namaOwner
                    ) : (
                        <span className="text-slate-400 italic">Tidak diketahui</span>
                    ),
            },
            {
                header: "Total Transaksi",
                className: "w-48 text-center",
                tdClassName: "text-center",
                render: (row) => (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-500/20">
                        {row.totalTransactions ?? 0}
                    </span>
                ),
            },
            {
                header: "Aksi",
                className: "w-32 text-center",
                tdClassName: "text-center",
                render: (row) => (
                    <div className="flex justify-center gap-2">
                        <button className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/15 rounded-lg transition-colors" onClick={() => handleDeleteUmkm(row.id)}>
                            <FiTrash2 size={28} />
                        </button>
                    </div>
                ),
            }
        ],
        [serverBaseUrl],
    );

    return (
        <>
            <Header pageTitle="Direktori UMKM">
                <div className="p-8 min-h-screen max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 relative transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Direktori UMKM</h2>

                        <div className="relative w-full sm:w-96">
                            <FiSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Cari UMKM atau Sektor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <TableTemplate
                        columns={tableColumns}
                        data={filteredUmkm}
                        isLoading={loading}
                        emptyMessage="Belum ada UMKM yang terdaftar."
                    />
                </div>
            </Header>
        </>
    );
}