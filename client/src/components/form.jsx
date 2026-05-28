import { Link } from "react-router-dom"

export default function Form({ title, fields, formData, handleChange, onSubmit, buttonText, loading , infoText , link , tujuanLink , error, fieldError }){
    return(
        <>
            <div className="w-full p-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
                    <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        Secure
                    </span>
                </div>
                {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                        <p className="font-semibold">Terjadi Kesalahan:</p>
                        <p className="mt-1 leading-relaxed">{error}</p>
                    </div>
                )}
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    {fields.map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {field.label}
                            </label>
                            <div className="mt-2">
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        required={field.required !== false}
                                        onChange={handleChange}
                                        className={`block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/30 ${field.hidden ? 'hidden' : ''}`}
                                    >
                                        {field.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.id}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        required={field.required !== false}
                                        value={field.type === 'file' ? undefined : formData[field.id] || ''}
                                        onChange={handleChange}
                                        accept={field.accept}
                                        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/30 ${field.hidden ? 'hidden' : ''}`}
                                        autoComplete={field.autoComplete || 'off'}
                                        hidden={field.hidden}
                                    />
                                )}
                            </div>

                            {fieldError && fieldError[field.id] && (
                                <p className="mt-2 text-sm font-medium text-red-600">{fieldError[field.id]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className={
                            `mt-2 w-full rounded-xl bg-linear-to-r from-blue-600 via-green-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition ` +
                            (loading ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-105 active:brightness-95')
                        }
                    >
                        {loading ? "Memproses..." : buttonText}
                    </button>
                </form>
                {infoText && link && tujuanLink && (
                    <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        <p>
                            {infoText}{' '}
                            <Link to={link} className="font-semibold text-blue-700 hover:underline">
                                {tujuanLink}
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}