import Header from "../components/header"
import { getAllTransactionsByUserId, deleteTransaction } from "../services/transactions"
import { useState, useEffect } from "react"
import { getIdUser } from "../utils/authStorage";
import { FaTrashAlt } from "react-icons/fa";
import { formatTanggalLengkap } from "../utils/tanggalFormat";
import HeaderBtn from "../components/headerBtn";
import { formatRupiah } from "../utils/formatUang";
import TableTemplate from "../components/tableTemplate";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function LaporanTransaksi() {
    const userId = getIdUser();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Laporan Transaksi", 14, 15);
        
        const tableColumn = ["Tanggal", "Produk", "Kategori", "Nominal", "Tipe"];
        const tableRows = transactions.map(t => [
            formatTanggalLengkap(t.occurred_at),
            t.namaProduct,
            t.kategori,
            formatRupiah(t.amount),
            t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
        ]);

        // Panggil autoTable dengan passing doc sebagai argumen pertama
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("laporan_transaksi.pdf");
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllTransactionsByUserId(userId);
                setTransactions(response.transactions);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTransactions();
    }, [userId]);

    const handleDelete = async (trxId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await deleteTransaction(trxId);
                setTransactions(transactions.filter(t => t.id !== trxId));
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const tableColumns = [
        { header: 'Tanggal', className: 'w-32', tdClassName: 'text-slate-500 dark:text-slate-400', render: (row) => formatTanggalLengkap(row.occurred_at) },
        { header: "Produk/Deskripsi", 
            render: (row) => (
                <>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{row.namaProduct}</p>
                    {row.note && <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{row.note}</p>}
                </>
            )
        },
        { 
            header: "Kategori", 
            className: "w-40",
            render: (row) => (
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                    {row.kategori}
                </span>
            ) 
        },
        { 
            header: "Nominal", 
            className: "w-40",
            render: (row) => (
                <span className={`font-bold ${row.type === 'income' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {formatRupiah(row.amount)}
                </span>
            ) 
        },
        { 
            header: "Tipe", 
            className: "w-28",
            render: (row) => (
                <span className={`shadow-sm px-3 py-1 rounded text-xs font-bold ${
                    row.type === 'income' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                }`}>
                    {row.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
            ) 
        },
        { 
            header: "Aksi", 
            className: "w-20",
            render: (row) => (
                <button 
                    className="hover:cursor-pointer text-rose-600 hover:text-rose-800 dark:text-rose-500 dark:hover:text-rose-400 transition-transform hover:scale-110" 
                    onClick={() => handleDelete(row.id)}
                >
                    <FaTrashAlt className="size-5" />
                </button>
            ) 
        }
    ]

    return (
        <>
            <Header pageTitle="Laporan Transaksi">
                <main className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-900">
                    <HeaderBtn title="Buku Kas Laporan" btnTitle="Export Laporan" click={exportPDF} confirmText={'Apakah kamu mau cetak laporan transaksi ini?'}/>
                    <div className="dark:bg-slate-800 rounded-xl">
                        <TableTemplate 
                            columns={tableColumns} 
                            data={transactions} 
                            isLoading={loading} 
                            emptyMessage="Belum ada transaksi yang tercatat."
                            
                        />
                    </div>
                </main>
            </Header>
        </>
    )
}