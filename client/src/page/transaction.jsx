import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import { getTransactions,deleteTransaction } from "../services/transactions";
import { getIdUmkm } from "../utils/authStorage";
import { formatTanggal } from "../utils/tanggalFormat";
import { formatRupiah } from "../utils/formatUang";


export default function Transactions() {
    const { id } = useParams();
    const umkm_id = id ?? getIdUmkm();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!umkm_id) {
                setTransactions([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try{
                const response = await getTransactions(umkm_id);
                setTransactions(response.data.transactions);
            } catch (err) {
                setError(err?.message || 'Gagal Menghubungi server');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [umkm_id]);

    return(
        <>
            <main>
                <Header />
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Transaksi Perusahaan Anda</h1>
                    {transactions.length > 0 ? (
                        <ul className="space-y-2">
                            {transactions.map((transaction) => (
                                <li key={transaction.id} className="border p-4 rounded">
                                    <p><strong>ID Transaksi: </strong> {transaction.id}</p>
                                    <p><strong>Produk: </strong> {transaction.product_name}</p>
                                    <p><strong>Jenis: </strong> {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
                                    <p><strong>Total : </strong> {formatRupiah(transaction.amount)}</p>
                                    <p><strong>Tanggal: </strong> {formatTanggal(transaction.occurred_at)}</p>
                                    <p><strong>Deskripsi: </strong> {transaction.note}</p>
                                    <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={async () => {
                                        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                                            try {
                                                await deleteTransaction(transaction.id);
                                                // Setelah berhasil dihapus, perbarui daftar transaksi
                                                setTransactions(transactions.filter(t => t.id !== transaction.id));
                                            } catch (err) {
                                                setError(err?.message || 'Gagal Menghubungi server');
                                            }
                                        }
                                    }}>
                                        Hapus
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">{loading ? 'Loading...' : (error || 'Tidak ada transaksi ditemukan.')}</p>
                    )}
                </div>
            </main>
        </>
    )

}