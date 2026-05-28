import { Link } from "react-router-dom";

export default function HeaderBtn({ title, btnTitle, click,  bgcolor = 'bg-emerald-500', bgcolorHover = 'hover:bg-emerald-700', confirmText, link }) {
    return(
        <>
            <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{title}</h1>
                {link ? (
                    <Link to={link} className={`px-4 py-2 ${bgcolor} text-white rounded ${bgcolorHover} transition hover:cursor-pointer`}>
                        <button className={`px-4 py-2 ${bgcolor} text-white rounded ${bgcolorHover} transition hover:cursor-pointer`} >
                        {btnTitle}
                        </button>
                    </Link>
                ): (
                    <button className={`px-4 py-2 ${bgcolor} text-white rounded ${bgcolorHover} transition hover:cursor-pointer`} onClick={confirmText ? () => {
                        if(confirm(confirmText)) {
                            click();
                        }
                    } : click}>
                        {btnTitle}
                    </button>
                )}
            </div>
        </>
    )
}