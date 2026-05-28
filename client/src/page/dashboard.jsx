import Header from "../components/header"
import FotoDefault from '../assets/default.png'
import CountCard from "../components/countCard"
import { IoIosTrendingUp, IoIosTrendingDown } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { useState, useEffect, useCallback } from "react";
import { getAiPrediction } from "../services/aiServices";
import { getTotalIncomeByUmkm, getTotalExpenseByUmkm, getTransactions, getChartUmkmTransactions } from "../services/transactions";
import { Link, useParams } from "react-router-dom";
import { getUMKMByUser, getDetailUMKM } from "../services/umkmService";
import { getIdUser } from "../utils/authStorage";
import { BiStore } from "react-icons/bi";
import { TbReceiptDollarFilled } from "react-icons/tb";
import TransaksiList from "../components/transaksiList";
import LineChartComponent from "../components/lineChart";
import { FaPlus } from "react-icons/fa";
import ModalTransaksi from "../modalSelect/modalTransaksi";
import ModalTambahUmkm from "../modalSelect/modalUmkm";
import { FaMoneyBillTrendUp } from "react-icons/fa6";


export default function Dashboard(){
    const { umkmId } = useParams();
    const userId = getIdUser();
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [transactionData, setTransactionData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [chartRange, setChartRange] = useState('1_month');
    const [umkmList, setUmkmList] = useState([]);
    const [selectedUmkm, setSelectedUmkm] = useState("");
    const [activeUmkmData, setActiveUmkmData] = useState(null);
    const [predictionData, setPredictionData] = useState(0);
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTambahUmkmOpen, setIsTambahUmkmOpen] = useState(false);

    const saldoBersih = Number(totalIncome) - Number(totalExpense);
    const fieldCount = [
        { icon: <IoIosTrendingUp size={40} className="text-white"/>, title: 'Total Pemasukan', count: totalIncome, bgIconClass: 'bg-emerald-600', rupiah: true, type: 'income' },
        { icon: <IoIosTrendingDown size={40} className="text-white"/>, title: 'Total Pengeluaran', count: totalExpense, bgIconClass: 'bg-rose-600', rupiah: true, type: 'expense' },
        { icon: <CiWallet size={40} className="text-white"/>, title: 'Saldo Bersih', count: saldoBersih, bgIconClass: 'bg-blue-600', rupiah: true, textClass: saldoBersih >= 0 ? 'text-emerald-500' : 'text-rose-500', type: saldoBersih > 0 ? 'income' : '' },
        { icon: <FaMoneyBillTrendUp size={40} className="text-white"/>, title: 'Prediksi Arus Kas Besok', count: predictionData, bgIconClass: 'bg-emerald-500', rupiah: true, textClass: predictionData >= 0 ? 'text-emerald-500' : 'text-rose-500', type: predictionData > 0 ? 'income' : '' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const umkmResponse = await getUMKMByUser(userId);
            const daftarUMKM = umkmResponse.data.umkm;
            setUmkmList(daftarUMKM);
            if(daftarUMKM.length > 0) setSelectedUmkm(umkmId || daftarUMKM[0].id);
        };
        fetchData();
    }, [umkmId, userId]);

    const fetchDashboardData = useCallback(async () => {
        if(!selectedUmkm) return;
        const [i, e, u, t, predict] = await Promise.all([
            getTotalIncomeByUmkm(selectedUmkm), 
            getTotalExpenseByUmkm(selectedUmkm), 
            getDetailUMKM(selectedUmkm), 
            getTransactions(selectedUmkm),
            getAiPrediction(selectedUmkm)
        ]);
        setTotalIncome(i.data.totalIncome || 0);
        setTotalExpense(e.data.totalExpense || 0);
        setActiveUmkmData(u.data.umkm);
        setTransactionData(t.data.transactions || []);
        setPredictionData(predict.data.prediction_tomorrow || 0);
        
        const chart = await getChartUmkmTransactions(selectedUmkm, chartRange);
        setChartData(chart.data.chartData || []);
    }, [selectedUmkm, chartRange]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);


    return(
        <Header pageTitle="Dashboard UMKM">
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">

                {/* ALL MODALS */}
                <ModalTransaksi isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} umkmId={selectedUmkm} onSuccess={fetchDashboardData} />
                <ModalTambahUmkm isOpen={isTambahUmkmOpen} onClose={() => setIsTambahUmkmOpen(false)} onSuccess={fetchDashboardData} />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    {/* Header Controls */}
                    <div className="mb-4 flex justify-end">
                        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                            <BiStore className="text-slate-400 text-xl" />
                            <select value={selectedUmkm} onChange={(e) => setSelectedUmkm(e.target.value)} className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer">
                                {umkmList.map((w) => <option key={w.id} value={w.id} className="dark:text-black">{w.nama_umkm}</option>)}
                            </select>
                            <button 
                                onClick={() => setIsTambahUmkmOpen(true)}
                                className="hover:cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <img src={activeUmkmData?.photo_url?.startsWith('http') ? activeUmkmData.photo_url : `${serverBaseUrl}${activeUmkmData?.photo_url}`} alt={activeUmkmData?.nama_umkm} className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{activeUmkmData?.nama_umkm || 'UMKM Belum Ada'}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{activeUmkmData?.sector || ''}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="hover:cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-sm"
                        >
                            + Tambah Transaksi
                        </button>
                    </div>

                    <LineChartComponent range={chartRange} onRangeChange={setChartRange} chart={chartData}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
                        {fieldCount.map((f, i) => <CountCard key={i} {...f} />)}
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                            <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"> <TbReceiptDollarFilled size={25} className="text-emerald-500" /> Riwayat Transaksi</h2>
                        </div>
                        {transactionData.map(t => <TransaksiList key={t.id} 
                            nama_produk={t.product_name}
                            type={t.type}
                            amount={t.amount}
                            tanggal={t.occurred_at}
                            note={t.note}
                        />)}
                    </div>
                </div>
            </main>
        </Header>
    )
}