import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatRupiahCompact } from '../utils/formatUang';

export default function LineChartComponent({ chart, range, onRangeChange }){
    return(
        <>
            <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-10 transition-colors'>
                {/* Header GRAFIK DAN DROPDOWN */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
                    <div>
                        <h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>Statistik Keuangan</h2>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>Pantau performa keuangan UMKM Anda</p>
                    </div>

                    <select value={range} onChange={(e) => onRangeChange(e.target.value)} className='bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none font-semibold cursor-pointer transition-colors'>
                        <option value='1_days'>1 Hari</option>
                        <option value='3_days'>3 Hari</option>
                        <option value='7_days'>7 Hari</option>
                        <option value='12_hours'>12 Jam</option>
                        <option value='1_month'>1 Bulan</option>
                        <option value='3_month'>3 Bulan</option>
                        <option value='6_month'>6 Bulan</option>
                        <option value='1_year'>1 Tahun</option>
                        <option value='5_year'>5 Tahun</option>
                    </select>
                </div>

                <div className='w-full h-[300px]'>
                    {chart.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                {/* SUMBU X/BAWAH */}
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                {/* SUMBU Y/ KIRI */}
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => formatRupiahCompact(value)} dx={-10} />

                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => formatRupiahCompact(value)} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                <Line type="monotone" name="Pemasukan" dataKey="pemasukan" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" name="Pengeluaran" dataKey="pengeluaran" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ):(
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">
                            Belum ada data transaksi untuk rentang waktu ini.
                        </div>
                    )}

                </div>

            </div>

        </>
    )
}