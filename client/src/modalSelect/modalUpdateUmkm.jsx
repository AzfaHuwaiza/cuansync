import { useState, useEffect } from "react";
import { updateUMKM } from "../services/umkmService";
import Modal from "../components/modal";

export default function ModalEditUmkm({ isOpen, onClose, umkmData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        description: '',
    });
    
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    // Pre-fill data ke form saat modal dibuka
    useEffect(() => {
        if (umkmData && isOpen) {
            setFormData({
                name: umkmData.nama_umkm || umkmData.name || '',
                sector: umkmData.sector || '',
                description: umkmData.note || '',
            });
            // Tampilkan preview foto lama jika ada
            if (umkmData.photo_url) {
                setPreview(`${serverBaseUrl}${umkmData.photo_url}`);
            } else {
                setPreview(null);
            }
            setFile(null); // Reset file upload yang baru
            setError(null);
            setFieldErrors({});
        }
    }, [umkmData, isOpen, serverBaseUrl]);

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
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

            // Eksekusi API Update
            await updateUMKM(umkmData.id, formBox);
            alert("Mantap bosku! UMKM berhasil diperbarui.");
            
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

    if (!isOpen || !umkmData) return null;

    const sectorOptions = ['Kerajinan', 'Transportasi', 'Pendidikan', 'Pertanian', 'Fashion', 'Kuliner', 'Teknologi', 'Kesehatan', 'Jasa', 'Properti'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit UMKM Anda">
            {error && (
                <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-100 dark:border-rose-800">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama UMKM / Bisnis</label>
                    <input 
                        type="text" name="name" value={formData.name} onChange={handleInput} 
                        disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors ${fieldErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {fieldErrors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.name}</p>}
                </div>

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

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi Singkat</label>
                    <textarea 
                        name="description" value={formData.description} onChange={handleInput} rows="3" disabled={loading}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 resize-none transition-colors ${fieldErrors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'}`}
                    ></textarea>
                    {fieldErrors.description && <p className="text-rose-500 text-xs mt-1 font-bold">{fieldErrors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ganti Foto (Opsional)</label>
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

                <div className="pt-2">
                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}