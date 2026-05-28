import { useState } from "react";
import { addUMKM } from "../services/umkmService";
import Modal from "../components/modal"; // 👈 Pake template induk yang kemaren

export default function ModalTambahUmkm({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        description: '',
    });
    
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // Buat nampilin foto sebelum di-upload
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Handle Input Teks & Select
    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    // Handle Input File (Foto)
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Bikin URL bayangan buat preview
            if (fieldErrors.photo) {
                setFieldErrors(prev => ({ ...prev, photo: null }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            const formBox = new FormData();
            formBox.append('name', formData.name);
            formBox.append('sector', formData.sector);
            formBox.append('description', formData.description);
            if (file) {
                formBox.append('photo', file);
            }

            // Eksekusi API
            const response = await addUMKM(formBox);
            alert("Mantap bosku! UMKM berhasil ditambahkan.");
            
            // Bersihin form setelah sukses
            setFormData({ name: '', sector: '', description: '' });
            setFile(null);
            setPreview(null);
            
            // Tutup modal & Refresh data di halaman utama
            onClose();
            if (onSuccess) onSuccess(response.data.umkm || response.data); 

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

    // Kalau modal lagi ditutup, jangan render isinya
    if (!isOpen) return null;

    const sectorOptions = ['Kerajinan', 'Transportasi', 'Pendidikan', 'Pertanian', 'Fashion', 'Kuliner', 'Teknologi', 'Kesehatan', 'Jasa', 'Properti'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah UMKM Baru">
            
            {error && (
                <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-100 dark:border-rose-800">
                    {error}
                </div>
            )}

            <form id="umkm-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nama UMKM */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama UMKM / Bisnis</label>
                    <input 
                        type="text" name="name" value={formData.name} onChange={handleInput} placeholder="Misal: Warkop Panji"
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {fieldErrors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
                </div>

                {/* Sektor UMKM */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Sektor UMKM</label>
                    <select 
                        name="sector" value={formData.sector} onChange={handleInput} disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.sector ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                        <option value="" disabled>Pilih Sektor Bisnis</option>
                        {sectorOptions.map((sec, idx) => (
                            <option key={idx} value={sec}>{sec}</option>
                        ))}
                    </select>
                    {fieldErrors.sector && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.sector}</p>}
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi Singkat</label>
                    <textarea 
                        name="description" value={formData.description} onChange={handleInput} rows="3" placeholder="Ceritakan sedikit tentang bisnis Anda..." disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 resize-none transition-colors ${fieldErrors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    ></textarea>
                    {fieldErrors.description && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.description}</p>}
                </div>

                {/* Foto UMKM (Preview + Upload) */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Foto UMKM (Opsional)</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 shrink-0 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-slate-400 text-center font-semibold leading-tight">No<br/>Image</span>
                            )}
                        </div>
                        <input 
                            type="file" name="photo" onChange={handleFileChange} accept="image/*" disabled={loading}
                            className={`w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-500/20 dark:file:text-emerald-400 hover:file:bg-emerald-100 text-slate-500 dark:text-slate-400 file:cursor-pointer cursor-pointer border rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${fieldErrors.photo ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                        />
                    </div>
                    {fieldErrors.photo && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.photo}</p>}
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2">
                    <button 
                        type="submit" disabled={loading}
                        className="hover:cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan UMKM Baru'}
                    </button>
                </div>

            </form>
        </Modal>
    );
}