import { useState, useEffect } from "react";
import { addTransaction } from "../services/transactions";
import { getDataProductUMKM } from "../services/productServices";
import Modal from "../components/modal";
import { Link } from "react-router-dom"; 

export default function ModalTransaksi({ isOpen, onClose, umkmId, onSuccess }) {
    const [formData, setFormData] = useState({
        type: 'income',
        amount: '',
        product_name: '',
        category: '',
        date: '',
        note: '',
    });
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch produk saat modal dibuka
    useEffect(() => {
        if (!isOpen || !umkmId) return;
        
        const fetchProducts = async () => {
            try {
                const response = await getDataProductUMKM(umkmId);
                const fetchedProducts = response.data.products || [];
                setProducts(fetchedProducts);
                
                const today = new Date().toISOString().slice(0, 16); 
                
                setFormData(prev => ({
                    ...prev,
                    product_name: fetchedProducts.length > 0 ? fetchedProducts[0].name : '',
                    date: today
                }));
            } catch (err) {
                console.error('Gagal mengambil data produk:', err);
            }
        };
        fetchProducts();
    }, [isOpen, umkmId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const payload = {
                umkm_id: umkmId,
                type: formData.type,
                amount: Number(formData.amount),
                product_name: formData.product_name,
                note: formData.note,
            };
            
            await addTransaction(payload);
            
            // Reset form dan tutup
            setFormData({ type: 'income', amount: '', product_name: '', category: '', date: '', note: '' });
            onClose();
            if (onSuccess) onSuccess(); 
            
        } catch (error) {
            setError(error.message || 'Gagal Menghubungi server');
        } finally {
            setLoading(false);
        }
    };

    // 👇 KITA BUNGKUS PAKE MODAL TEMPLATE 👇
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Catat Transaksi">
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <form id="transaction-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Toggle Masuk / Keluar */}
                <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all font-bold ${
                        formData.type === 'income' 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                        <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleChange} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.type === 'income' ? 'border-emerald-500' : 'border-slate-400'}`}>
                            {formData.type === 'income' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                        </div>
                        Masuk
                    </label>

                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition-all font-bold ${
                        formData.type === 'expense' 
                        ? 'border-rose-500 bg-rose-50/50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                        <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleChange} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.type === 'expense' ? 'border-rose-500' : 'border-slate-400'}`}>
                            {formData.type === 'expense' && <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
                        </div>
                        Keluar
                    </label>
                </div>

                {/* Nominal */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nominal (Rp)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>

                {/* Nama Produk / Aktivitas */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nama Produk / Aktivitas</label>
                    {products.length > 0 ? (
                        <select name="product_name" value={formData.product_name} onChange={handleChange} required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="" disabled>Pilih Produk</option>
                            {products.map(p => <option key={p.name} value={p.name}>{p.name.toUpperCase()}</option>)}
                        </select>
                    ) : (
                        <div className="dark:text-red-700 dark:font-bold">
                            Produk Belum Ada Silahkan Tambah Produk Lebih Dahulu 
                            <Link to="/productUser" className="text-emerald-500 hover:underline block text-center uppercase underline">di sini</Link>
                        </div>
                    )}
                </div>

                {/* Catatan Opsional */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Catatan Opsional</label>
                    <textarea name="note" value={formData.note} onChange={handleChange} rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    ></textarea>
                </div>

                {/* Tombol Submit di dalam form biar rapi */}
                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}