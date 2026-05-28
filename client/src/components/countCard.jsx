import { formatRupiahCompact } from "../utils/formatUang";

export default function CountCard({  title, count, icon, bgIconClass, rupiah, textClass, type }) {
    return(
        <>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center gap-5 hover:shadow-md transition-shadow duration-300">
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center p-2 ${bgIconClass}`}>
                    {icon}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
                    <p className={`text-xl sm:text-2xl font-extrabold ${textClass || 'text-slate-800 dark:text-slate-100'} truncate`}>{ type === 'income' ? `+` : type === 'expense' ? `-` : '' }{rupiah ? ` ${formatRupiahCompact(count)}` : count}</p>
                </div>
            </div>
        </>
    )
}