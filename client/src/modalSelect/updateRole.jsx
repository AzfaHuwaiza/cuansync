import { useState, useEffect } from "react";
import { updateRoleUser } from "../services/authServices";
import Modal from "../components/modal"; 

export default function ModalUpdateRole({ isOpen, onClose, user, onSuccess }) {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Otomatis ngisi nilai role di dropdown sesuai data user yang diklik
    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Tembak API buatan lu
            await updateRoleUser(user.id, role);
            alert(`Role pengguna ${user.name} berhasil diubah menjadi ${role.toUpperCase()}!`);
            
            onClose(); // Tutup modal
            if (onSuccess) onSuccess(); // Refresh tabel

        } catch (err) {
            setError(err.message || 'Gagal mengubah role server');
        } finally {
            setLoading(false);
        }
    };

    // Jangan render apa-apa kalo modal ditutup atau data user belum ada
    if (!isOpen || !user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ubah Role Pengguna">
            
            {error && (
                <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-100 dark:border-rose-800">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Info singkat user yang mau diubah */}
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    Ubah akses untuk: <br/>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{user.name}</span> ({user.email})
                </p>

                {/* Dropdown Role */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Akses Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={loading || role === user.role} // Tombol mati kalo rolenya ga diganti
                        className="hover:cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

            </form>
        </Modal>
    );
}