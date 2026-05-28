import { IoIosTrendingUp } from "react-icons/io";
import { IoIosTrendingDown } from "react-icons/io";
import { formatTanggalLengkap } from "../utils/tanggalFormat";
import { formatRupiah } from "../utils/formatUang";

export default function TransaksiList({ type, nama_produk, tanggal,amount,note }) {
    return(
        <>
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                
                <div className="flex items-center gap-4">
                    {/* Logika Warna Icon: income = Ijo, expense = Merah */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {type === 'income' ? <IoIosTrendingUp size={23} /> : <IoIosTrendingDown size={23} />}
                    </div>
                    
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{nama_produk}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {formatTanggalLengkap(tanggal)} {note ? `• ${note}` : ''}
                        </p>
                    </div>
                </div>

                {/* Logika Warna Duit & Plus Minus */}
                <div className={`font-bold ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {type === 'income' ? '+' : '-'} {formatRupiah(amount)}
                </div>

            </div>
        </>
    )
}