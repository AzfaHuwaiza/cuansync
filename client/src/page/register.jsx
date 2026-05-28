import { useState } from "react"
import { registerUser } from "../services/authServices";
import Form from "../components/form";
import { useNavigate } from "react-router-dom";



export default function Register(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        role: "",
    });
    const navigate = useNavigate();

    const [fieldError, setFieldError] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id] : e.target.value });
        if(fieldError[e.target.id]){
            setFieldError({ ...fieldError, [e.target.id]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldError({});
        try{
            const response = await registerUser(formData);
            alert(response.message);
            navigate('/');
        }catch(err){
            if(err.errors){
                setFieldError(err.errors);
            }else{
                setError(err.message || 'Gagal Menghubungi server');
            }
        }finally{
            setLoading(false);
        }
    }
    const registerFields = [
        { id: 'email', label: 'Email', type: 'email', placeholder: 'Contoh: user@example.com', autoComplete: 'nope' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Masukkan password', autoComplete: 'new-password' },
        { id: 'name', label: 'Name', type: 'text', placeholder: 'Masukkan nama lengkap', autoComplete: 'nope' },
        { id: 'role', label: 'Role', type: 'select', options: [
            { value: '', label: 'Pilih Role' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
        ]},
    ]

    return(
        <>
            <main className="min-h-screen bg-linear-to-br from-blue-700 via-green-600 to-yellow-300 p-4 md:p-10">
                <div className="m-auto flex h-full max-w-5xl items-center justify-center">
                    <div className="grid w-full overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-lg backdrop-blur md:grid-cols-2">
                        <aside className="relative p-8 text-white md:p-10 bg-linear-to-br from-green-700 via-blue-700 to-blue-800">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                                Buat Akun Baru
                            </div>
                            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                                Mulai dari sini
                            </h1>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
                                Daftar dengan email dan password. Jika ada validasi dari backend, pesan akan tampil tepat di bawah input yang bermasalah.
                            </p>

                            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5">
                                <p className="text-sm font-semibold">Tips</p>
                                <ul className="mt-2 space-y-2 text-sm text-white/85">
                                    <li>Gunakan password minimal 6 karakter.</li>
                                    <li>Pastikan email aktif.</li>
                                    <li>Nama lengkap memudahkan identifikasi.</li>
                                </ul>
                            </div>
                        </aside>

                        <section className="bg-white p-8 md:p-10">
                            <Form
                                title="Register"
                                fields={registerFields}
                                formData={formData}
                                onSubmit={handleSubmit}
                                handleChange={handleChange}
                                buttonText="Daftar"
                                error={error}
                                loading={loading}
                                link="/"
                                tujuanLink="Login di sini"
                                infoText="Sudah punya akun?"
                                fieldError={fieldError}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}