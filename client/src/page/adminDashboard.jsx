import Header from "../components/header"
import FotoDefault from '../assets/default.png'
import CountCard from "../components/countCard"
import { FiUser } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import { TbReceiptDollarFilled } from "react-icons/tb";
import { getAllTransactionsCount } from "../services/transactions";
import { getAllCountUMKM } from "../services/umkmService";
import { getAllUsers } from "../services/authServices";
import { useState,useEffect } from "react";
import { formatTanggal } from "../utils/tanggalFormat";


export default function AdminDashboard(){

    const [totalUmkm, setTotalUmkm] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    useEffect(() => {
        const fetchData = async () => {
            try{
                const [umkmResponse, usersResponse, transactionsResponse] = await Promise.all([
                    getAllCountUMKM(),
                    getAllUsers(),
                    getAllTransactionsCount()
                ]);
                setTotalUmkm(umkmResponse.data);
                setTotalUsers(usersResponse.data);
                setTotalTransactions(transactionsResponse.data.transactions);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    
    const adminStats = [
        { icon: <BiStore size={40} className="text-white" />, title: 'Total Bisnis UMKM', count: totalUmkm.totalUMKM, bgIconClass: 'bg-blue-600' },
        { icon: <FiUser size={40} className="text-white" />, title: 'Total Pengguna', count: totalUsers.totalUsers, bgIconClass: 'bg-violet-700' },
        { icon: <TbReceiptDollarFilled size={40} className="text-white" />, title: 'Total Transaksi', count: totalTransactions, bgIconClass: 'bg-emerald-600' }
    ];

    // Data dari backend (UMKM terbaru)
    const dataUmkm = totalUmkm.umkmLast || [];
    const umkmList = dataUmkm.map(umkm => ({
        id: umkm.id,
        nama: umkm.namaUmkm,
        sektor: umkm.sector,
        owner: umkm.namaOwner,
        photo: umkm.photo_url
    }));
    
    
    
    // Data dari backend (pengguna terbaru)
    const dataUsers = totalUsers.users || [];
    const usersList = dataUsers.map(user => ({
        id: user.id,
        nama: user.name,
        email: user.email,
        tgl: formatTanggal(user.create_at),
        img: user.img
    }));
    
    return(
        <>
                <Header pageTitle="Ringkasan Sistem">
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">Ringkasan performa platform secara keseluruhan.</p>
                        {/* STATISTIK ADMIN */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 mt-4">
                            {adminStats.map((start,index) => (
                                <CountCard 
                                    key={index}
                                    icon={start.icon}
                                    title={start.title}
                                    count={start.count}
                                    bgIconClass={start.bgIconClass}
                                />
                            ))}
                        </div>

                        {/* LIST UMKM TERBARU DAN USERS TERBARU */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* LIST UMKM */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                                <div className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 px-6 py-4 transition-colors">
                                    <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"> <BiStore size={20} /> UMKM Terbaru</h2>

                                </div>
                                <div className="flex flex-col p-2">
                                    {umkmList.map((umkm) => (
                                        <div key={umkm.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                                                <img src={umkm.photo ? umkm.photo?.startsWith('http') ? umkm.photo : `${serverBaseUrl}${umkm.photo}` : FotoDefault} alt="" className="w-full h-full" />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-800 dark:text-slate-100">{umkm.nama}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{umkm.sektor} • Owner: {umkm.owner}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* LIST USERS */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                                <div className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 px-6 py-4 transition-colors">
                                    <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><FiUser size={20} /> Pengguna Baru</h2>
                                </div>

                                <div className="flex flex-col p-2">
                                    {usersList.map((user,index) => {
                                        return(
                                            <div key={index} className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    {/* NAMA INISIAL */}
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                                                        {user.img ? (
                                                            <img src={user.img?.startsWith('http') ? user.img : `${serverBaseUrl}${user.img}`} alt={user.nama.charAt(0).toUpperCase()} className="w-full h-full rounded-full" />
                                                        ) : (
                                                            user.nama.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{user.nama}</h3>
                                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-slate-600 dark:text-slate-400">
                                                    {user.tgl}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </Header>

        </>
    )
}