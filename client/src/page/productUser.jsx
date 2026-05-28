import { useState, useEffect, useCallback } from "react";
import Header from "../components/header";
import { getProductByUser, deleteProduct } from "../services/productServices"; // 👈 IMPORT deleteProduct
import { getUMKMByUser } from "../services/umkmService"; 
import { getIdUser } from "../utils/authStorage";
import HeaderBtn from "../components/headerBtn";
import { BsBoxSeamFill } from "react-icons/bs";
import { BiStore } from "react-icons/bi"; 
import { FaPen, FaTrash } from "react-icons/fa"; // 👈 IMPORT ICON
import { formatRupiah } from "../utils/formatUang";
import ModalTambahProduct from "../modalSelect/modalProduct";
import ModalEditProduct from "../modalSelect/modalEditProduct"; // 👈 IMPORT MODAL EDIT LU

export default function ProductUser() {
    const userId = getIdUser();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [umkmList, setUmkmList] = useState([]);
    const [selectedUmkm, setSelectedUmkm] = useState("");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);

    // 1. Fetch data UMKM
    useEffect(() => {
        const fetchUmkm = async () => {
            try {
                const umkmResponse = await getUMKMByUser(userId);
                const daftarUMKM = umkmResponse.data.umkm;
                setUmkmList(daftarUMKM);
                
                if(daftarUMKM.length > 0) {
                    setSelectedUmkm(daftarUMKM[0].id);
                }
            } catch (err) {
                console.error("Gagal mengambil data UMKM:", err);
            }
        };
        fetchUmkm();
    }, [userId]);

    // 2. Fetch data Produk
    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProductByUser();
            setProducts(response.products || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    // 3. FUNGSI HAPUS PRODUK
    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`Yakin ingin menghapus produk "${productName}" secara permanen?`)) {
            try {
                await deleteProduct(productId);
                alert("Produk berhasil dihapus!");
                fetchProduct(); // Tarik ulang data otomatis
            } catch (err) {
                alert(err.message || "Gagal menghapus produk.");
            }
        }
    };

    // 4. FUNGSI BUKA MODAL EDIT
    const handleEditClick = (product) => {
        setSelectedProductToEdit(product);
        setIsEditModalOpen(true);
    };

    return (
        <>
            <Header pageTitle="Produk Saya">
            <main className="bg-slate-50 dark:bg-slate-950 max-w-7xl p-8 mx-auto min-h-screen transition-colors duration-300 relative">
                
                {/* MODAL TAMBAH PRODUK */}
                <ModalTambahProduct 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    umkmId={selectedUmkm}
                    onSuccess={fetchProduct} 
                />

                {/* 👇 MODAL EDIT PRODUK 👇 */}
                <ModalEditProduct 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    productData={selectedProductToEdit}
                    onSuccess={fetchProduct} 
                />

                {/* DROPDOWN PILIH UMKM */}
                <div className="mb-4 flex justify-end">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <BiStore className="text-slate-400 text-xl" />
                        <select 
                            value={selectedUmkm} 
                            onChange={(e) => setSelectedUmkm(e.target.value)} 
                            className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                        >
                            {umkmList.length > 0 ? (
                                umkmList.map((w) => <option key={w.id} value={w.id} className="dark:text-black">{w.nama_umkm}</option>)
                            ) : (
                                <option value="" disabled>Belum ada UMKM</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* HEADER BTN */}
                <HeaderBtn 
                    title="Daftar Produk Yang Dimiliki" 
                    btnTitle="Tambah Produk" 
                    click={() => { // 👈 Sesuaikan dengan props click di komponen lu
                        if(!selectedUmkm) {
                            alert("Anda harus memiliki/memilih UMKM terlebih dahulu untuk menambah produk!");
                        } else {
                            setIsModalOpen(true);
                        }
                    }} 
                />
                
                {/* GRID DAFTAR PRODUK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center items-center gap-6 mt-6">
                    {products.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center col-span-full">
                            Tidak ada produk yang dimiliki.
                        </p>
                    ) : (
                        products.map((product, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 group relative">
                                
                                {/* 👇 TOMBOL EDIT & HAPUS MELAYANG 👇 */}
                                <div className="absolute top-5 right-5 z-10 flex gap-2">
                                    <button 
                                        onClick={() => handleEditClick(product)}
                                        className="hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
                                        title="Edit Produk"
                                    >
                                        <FaPen size={13} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                        className="hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                                        title="Hapus Produk"
                                    >
                                        <FaTrash size={13} />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center pr-16"> {/* pr-16 biar teks ga nabrak tombol */}
                                        <div className="w-15 h-15 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-5 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                                            <BsBoxSeamFill size={40} className="text-emerald-500" />
                                        </div>
                                        <h3 className="pl-4 text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </div>

                                    <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="mt-8 border-t border-slate-50 dark:border-slate-800 pt-5">
                                    <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">
                                        Harga Dasar :
                                    </p>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        {formatRupiah(product.base_price || product.harga)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
            </Header>
        </>
    )
}