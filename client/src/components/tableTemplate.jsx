
export default function TableTemplate({ 
    columns,
    data,
    isLoading = false,
    emptyMessage = "Belum ada data yang tersedia.",
 }){
    return(
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 overflow-hidden overflow-x-auto transition-colors">
            <table className="w-full text-left border-collapse min-w-200">
                {/* HEADER */}
                <thead className="bg-slate-100 dark:bg-gray-900/30 border-b border-slate-100 dark:border-gray-700 text-slate-500 dark:text-gray-300 text-sm transition-colors">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-6 py-4 font-semibold ${col.className || ""}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody className="text-sm text-slate-700 dark:text-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-slate-500 dark:text-gray-300 py-6 animate-pulse">
                                Memuat data...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-slate-500 dark:text-gray-300 py-6">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-50 dark:border-gray-700/60 hover:bg-slate-50/50 dark:hover:bg-gray-700/25 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`px-6 py-4 ${col.tdClassName || ""}`}>
                                        {/* Kalo ada fungsi render khusus, pake itu. Kalo kaga, cetak teks biasa */}
                                        {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
 }