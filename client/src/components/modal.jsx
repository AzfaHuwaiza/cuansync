
export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modalOverlay') onClose();     
    }

    return(
        <>
            <div 
                id="modal-overlay" 
                onClick={handleOutsideClick} 
                className="fixed inset-0 z-50 flex justify-center items-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all"
            >
                {/* Modal Box */}
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                    
                    {/* Modal Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="hover:cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-rose-500 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Modal Body (Isi form akan masuk ke sini lewat 'children') */}
                    <div className="p-6 overflow-y-auto">
                        {children}
                    </div>

                </div>
            </div>
        </>
    )
}