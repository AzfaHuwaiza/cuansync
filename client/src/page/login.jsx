import { getRole } from "../utils/authStorage";
import { useState } from "react";
import { loginUser } from "../services/authServices";
import Form from "../components/form";
import { simpanAuth } from "../utils/authStorage";

export default function Login(){
    const role = getRole();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginUser(formData);
            setFormData({ email: "", password: "" });
            simpanAuth(response.id, response.umkmId, response.role);
            alert(response.message);
            if (role === 'admin') {
                window.location.href = '/adminDashboard';
            } else {
                window.location.href = '/dashboard';
            }
        }catch(err){
            setError(err.message || 'Gagal Menghubungi server');
        } finally {
            setLoading(false);
        }

    }

    const loginFields = [
        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'emailKamu@contoh.com', autoComplete: 'nope' },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'Password Kamu', autoComplete: 'new-password' },
    ];
 

    return(
        <>
            <main className="min-h-screen bg-linear-to-br from-blue-700 via-green-600 to-yellow-300 p-4 md:p-10">
                <div className="m-auto flex h-full max-w-5xl items-center justify-center">
                    <div className="grid w-full overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-lg backdrop-blur md:grid-cols-2">
                        <aside className="relative p-8 text-white md:p-10 bg-linear-to-br from-blue-800 via-blue-700 to-green-700">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                                Akses Aman
                            </div>
                            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                                Selamat datang kembali
                            </h1>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
                                Masuk untuk melanjutkan. Jika sudah login, kamu akan langsung diarahkan ke halaman utama.
                            </p>

                            <div className="mt-8 grid gap-3 text-sm">
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                    <p className="font-semibold">Biru</p>
                                    <p className="mt-1 text-white/80">Kepercayaan & akses terkontrol.</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                    <p className="font-semibold">Hijau</p>
                                    <p className="mt-1 text-white/80">Proses cepat & nyaman.</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                    <p className="font-semibold">Kuning</p>
                                    <p className="mt-1 text-white/80">Highlight status & informasi penting.</p>
                                </div>
                            </div>
                        </aside>

                        <section className="bg-white p-8 md:p-10">
                            <Form
                                title="Login"
                                fields={loginFields}
                                formData={formData}
                                handleChange={handleChange}
                                onSubmit={handleSubmit}
                                buttonText="Masuk"
                                loading={loading}
                                link="/register"
                                infoText="Belum punya akun?"
                                tujuanLink="Daftar di sini"
                                error={error}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}