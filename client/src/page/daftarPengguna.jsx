import { useState, useEffect, useCallback } from "react";
import Header from "../components/header";
import TableTemplate from "../components/tableTemplate";
import { getAllUsersAdmin } from "../services/authServices";
import { FaRegUser } from "react-icons/fa";
import { formatTanggal } from "../utils/tanggalFormat";
import { FaPen } from "react-icons/fa";
import ModalUpdateRole from "../modalSelect/updateRole"; // 👈 IMPORT MODALNYA

export default function DaftarPengguna() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State untuk Modal Update Role
    const [isModalRoleOpen, setIsModalRoleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Nyimpen data user yang mau di-edit

    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    // Keluarin fetchUsers pake useCallback biar bisa dipanggil ulang pas sukses update role
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllUsersAdmin();
            setUsers(response.data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const tableColumns = [
        { header: 'ID', className: 'w-64 ', render: (row) => ( row.id ) },
        { header: 'Pengguna',  render: (row) => (
            <div className="flex items-center gap-4">
                <div className="w-15 h-15 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {row.img ? (
                        <img src={`${serverBaseUrl}${row.img}`} alt={row.name} className="w-full h-full object-cover" />
                    ) : (
                        <FaRegUser size={30} className="text-slate-400 dark:text-slate-500" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{row.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{row.email}</p>
                </div>
            </div>
        )},
        { header: 'Kontak', className: 'w-48', render: (row) => (
            <p className="text-sm text-slate-700 dark:text-slate-300">{row.kontak || <span className="text-slate-400 dark:text-slate-500 italic">Tidak tersedia</span>}</p>
        )},
        { header: 'Role', className: 'w-50 text-center' ,tdClassName: 'text-center', render: (row) => (
            <span className={`px-3 py-1 font-semibold text-xs uppercase rounded-lg border ${row.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {row.role}
            </span>
        ) },
        { header: 'Tanggal Daftar', className: 'w-48', render: (row) => (
            <p className="text-sm text-slate-700 dark:text-slate-300">{formatTanggal(row.create_at)}</p>
        )},
        { header: 'Update Profile', className: 'w-48', render: (row) => (
            row.update_profile ? <p className="text-sm text-slate-700 dark:text-slate-300">{formatTanggal(row.update_profile)}</p> : <span className="text-slate-400 dark:text-slate-500 italic">Belum pernah update</span>
        )},
        { header: 'Ubah Role', className: 'w-48 text-center', tdClassName: 'text-center', render: (row) => (
            <button 
                onClick={() => {
                    setSelectedUser(row);
                    setIsModalRoleOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
                <FaPen  size={20}/> 
            </button>
        ) },
    ];

    return (
        <>
            <Header pageTitle="Daftar Pengguna">
                <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative transition-colors">
                    
                    {/* 👇 PASANG MODAL DI SINI 👇 */}
                    <ModalUpdateRole 
                        isOpen={isModalRoleOpen} 
                        onClose={() => setIsModalRoleOpen(false)} 
                        user={selectedUser} 
                        onSuccess={fetchUsers} 
                    />

                    {/* HEADER */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Daftar Pengguna Sistem</h1>
                    </div>

                    <TableTemplate 
                        columns={tableColumns} 
                        data={users} 
                        emptyMessage="Belum ada pengguna yang terdaftar." 
                    />
                </div>
            </Header>
        </>
    )
}