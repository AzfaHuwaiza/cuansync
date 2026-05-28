import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { getProfile, updateProfile } from "../services/profileServices";
import { updateUser } from "../services/authServices";
import { getIdUser } from "../utils/authStorage";
import { FiCamera } from "react-icons/fi"

export default function ProfileUser({ isReadOnly = false }) {
    const userId = getIdUser();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
        phone_number: '',
        date: '',
        img: '',
        address: '',
        gender: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [file, setFile] = useState(null);
    const [tempPhotoUrl, setTempPhotoUrl] = useState(null);
    const fileInputRef = useRef(null);

    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getProfile(userId);
                const data = response.data.profile;
                const formattedDate = data.date_of_birth
                    ? new Date(data.date_of_birth).toISOString().split('T')[0]
                    : '';
                setProfile({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    phone_number: data.phone_number,
                    date: formattedDate,
                    img: data.photo_url,
                    address: data.address,
                    gender: data.gender,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (userId) fetchProfile();
    }, [userId]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors(pref => ({ ...pref, [name]: null }));
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setTempPhotoUrl(null);
            setProfile(pref => ({ ...pref, img: URL.createObjectURL(selectedFile) }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setFieldErrors({});
        setError(null);

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('phone_number', profile.phone_number);
            formData.append('date_of_birth', profile.date);
            formData.append('address', profile.address);
            formData.append('gender', profile.gender);
            if (tempPhotoUrl) {
                formData.append('photo_url', tempPhotoUrl);
            } else if (file) {
                formData.append('photo', file);
            }

            await updateProfile(formData);
            await updateUser({ email: profile.email, name: profile.name });
            setFile(null);
            const response = await getProfile(userId);
            const freshData = response.data.profile;
            setProfile(prev => ({
                ...prev,
                img: freshData.photo_url || ''
            }));
            alert("Profil berhasil diperbarui!");
            window.location.reload();
        } catch (err) {
            if (err.errors) {
                setFieldErrors(err.errors);
                if (err.temp_photo_url) {
                    setTempPhotoUrl(err.temp_photo_url);
                }
            } else {
                setError(err.message || 'Gagal Menghubungi server');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header pageTitle="Profil Saya">
                <main className="p-8 min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-start max-w-7xl mx-auto">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 mt-4">

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold">
                                {error}
                            </div>
                        )}

                        {/* TOP SECTION: AVATAR & INFO */}
                        <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-700 pb-8">
                            {/* Avatar */}
                            <div className="relative group w-24 h-24 rounded-full bg-emerald-100 dark:bg-slate-700 border-2 border-emerald-200 dark:border-slate-600 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-bold shrink-0 overflow-hidden">
                                {profile.img ? (
                                    <img src={profile.img?.startsWith('blob:') ? profile.img : `${serverBaseUrl}${profile.img}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                                )}
                                {/* Tombol Kamera Overlay */}
                                {!isReadOnly && (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all"
                                    >
                                        <FiCamera className="text-white size-6" />
                                    </div>
                                )}
                            </div>

                            {/* Info Text */}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {loading ? "Memuat..." : profile.name || "Nama Pengguna"}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
                                    {profile.email || "email@domain.com"} <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span> <span className={`uppercase ${profile.role === 'admin' ? 'text-white bg-emerald-700 p-1 rounded-lg font-semibold ' : 'text-slate-600 bg-slate-200 dark:bg-slate-600 dark:text-slate-300 rounded-lg font-semibold p-1'}`} >{profile.role}</span>
                                </p>

                                {/* Tombol Ubah Foto */}
                                {!isReadOnly && (
                                    <>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                                        >
                                            Ubah Foto Profil
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* FORM SECTION */}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                            {/* Baris 1: Nama & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text" name="name" value={profile.name} onChange={handleInput} disabled={isReadOnly || loading}
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 ${fieldErrors.name ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Gender</label>
                                    <select
                                        name="gender" value={profile.gender} onChange={handleInput} disabled={isReadOnly || loading}
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 ${fieldErrors.gender ? 'border-red-500' : 'border-slate-200'}`}
                                    >
                                        <option value="" disabled>Pilih Gender</option>
                                        <option value="Laki-laki">Laki-Laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                    {fieldErrors.gender && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.gender}</p>}
                                </div>
                            </div>

                            {/* Baris 2: No Telp & Tgl Lahir */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Nomor Telepon</label>
                                    <input
                                        type="number" name="phone_number" value={profile.phone_number} onChange={handleInput} disabled={isReadOnly || loading}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-colors"
                                    />
                                    {fieldErrors.phone_number && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.phone_number}</p>}
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Tanggal Lahir</label>
                                    <input
                                        type="date" name="date" value={profile.date} onChange={handleInput} disabled={isReadOnly || loading}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-colors"
                                    />
                                    {fieldErrors.date && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.date}</p>}
                                </div>
                            </div>

                            {/* EMAIL READ ONLY */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Email (Read Only)</label>
                                <input
                                    type="email" name="email" value={profile.email} disabled
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                                />
                                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.email}</p>}
                            </div>

                            {/* Textarea Alamat */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Alamat Lengkap</label>
                                <textarea
                                    rows="3" name="address" value={profile.address} onChange={handleInput} disabled={isReadOnly || loading}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-colors resize-none"
                                ></textarea>
                                {fieldErrors.address && <p className="text-red-500 text-xs mt-1 font-semibold">{fieldErrors.address}</p>}
                            </div>

                            {/* Tombol Simpan */}
                            {!isReadOnly && (
                                <div className="pt-4">
                                    <button
                                        type="submit" disabled={loading}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:cursor-pointer"
                                    >
                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </main>
            </Header>
        </>
    )
}