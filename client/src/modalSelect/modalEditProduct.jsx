import { useState, useEffect } from "react";
import { updateProduct } from "../services/productServices";
import Modal from "../components/modal"; // 👈 Sesuaikan path importnya dengan punya lu

export default function ModalEditProduct({ isOpen, onClose, productData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        base_price: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Daftar Kategori (Samain kayak di Modal Tambah)
    const categoryOptions = [
        'Teknologi', 'Pertanian', 'Minuman', 'Makanan', 'Elektronik', 
        'Kerajinan', 'Kesehatan', 'Pakaian', 'Kecantikan', 'Logistik', 
        'Servis Kendaraan', 'Event Organizer', 'Alat Kesehatan', 'Suplemen', 
        'Obat Herbal', 'Pakaian Pria', 'Desain', 'Perawatan', 'Jasa Medis', 
        'Interior', 'Kursus Offline', 'Buku', 'Kursus Online', 'Dessert', 
        'Makanan Berat', 'Bibit', 'Alat Tani', 'Produk Olahan', 'Bimbel', 
        'Pelatihan', 'IoT', 'Software', 'Jasa IT', 'Servis'
    ];

    // Auto-fill form saat modal dibuka
    useEffect(() => {
        if (productData && isOpen) {
            setFormData({
                name: productData.name || productData.nama_product || '',
                category: productData.category || '',
                base_price: productData.base_price || productData.harga || '',
            });
            setError(null);
            setFieldErrors({});
        }
    }, [productData, isOpen]);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            const payload = {
                ...formData,
                umkm_id: productData.umkm_id, // Wajib dikirim karena Backend lu minta umkm_id pas update
                base_price: formData.base_price === '' ? '' : Number(formData.base_price),
            };

            await updateProduct(productData.id, payload);
            alert("Mantap bosku! Produk berhasil diperbarui.");
            
            onClose();
            if (onSuccess) onSuccess(); 

        } catch (err) {
            if (err.errors) {
                setFieldErrors(err.errors);
            } else {
                setError(err.message || 'Gagal Menghubungi server');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !productData) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Produk">
            
            {error && (
                <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-100 dark:border-rose-800">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nama Produk */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Produk</label>
                    <input 
                        type="text" name="name" value={formData.name} onChange={handleInput} 
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {fieldErrors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                    <select 
                        name="category" value={formData.category} onChange={handleInput} disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.category ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                        <option value="" disabled>Pilih Kategori Produk</option>
                        {categoryOptions.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {fieldErrors.category && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.category}</p>}
                </div>

                {/* Harga Dasar */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harga Dasar (Rp)</label>
                    <input 
                        type="number" name="base_price" value={formData.base_price} onChange={handleInput} 
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.base_price ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {fieldErrors.base_price && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.base_price}</p>}
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2">
                    <button 
                        type="submit" disabled={loading}
                        className="hover:cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

            </form>
        </Modal>
    );
}