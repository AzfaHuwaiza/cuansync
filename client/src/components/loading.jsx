import { Link } from "react-router-dom";

function Bars({ size = "md" }) {
    const bar =
        size === "sm"
            ? "h-3 w-1.5"
            : size === "lg"
              ? "h-6 w-2.5"
              : "h-4 w-2";

    const base = `${bar} rounded-full`;

    return (
        <div className="flex items-end justify-center gap-2" aria-hidden="true">
            <span
                className={`${base} bg-blue-500 animate-bounce`}
                style={{ animationDelay: "0ms" }}
            />
            <span
                className={`${base} bg-green-500 animate-bounce`}
                style={{ animationDelay: "120ms" }}
            />
            <span
                className={`${base} bg-yellow-400 animate-bounce`}
                style={{ animationDelay: "240ms" }}
            />
            <span
                className={`${base} bg-blue-500 animate-bounce`}
                style={{ animationDelay: "360ms" }}
            />
            <span
                className={`${base} bg-green-500 animate-bounce`}
                style={{ animationDelay: "480ms" }}
            />
        </div>
    );
}

export default function Loading({
    label = "Memuat data…",
    hint,
    size = "md",
    className = "",
}) {
    return (
        <div className={`w-full ${className}`} role="status" aria-live="polite">
            <div className="mx-auto w-full max-w-xl rounded-2xl border border-blue-200 bg-white p-6 text-center">
                <div className="mx-auto grid w-full max-w-sm place-items-center">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-2xl bg-yellow-200/60 blur-sm" />
                        <div className="relative rounded-2xl border border-green-200 bg-white px-6 py-5">
                            <Bars size={size} />
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-base font-semibold text-blue-950">{label}</p>
                {hint ? (
                    <p className="mt-1 text-sm text-blue-700">{hint}</p>
                ) : (
                    <p className="mt-1 text-sm text-blue-700">
                        Mohon tunggu sebentar, proses sedang berjalan.
                    </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 font-semibold text-blue-800">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Aman
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-3 py-1 font-semibold text-green-800">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Stabil
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-3 py-1 font-semibold text-yellow-800">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        Cepat
                    </span>
                </div>
            </div>
        </div>
    );
}

export function EmptyState({
    title = "Belum ada data",
    description = "Data masih kosong. Coba lagi nanti atau tambah data baru.",
    variant = "default",
    actionText,
    to,
    onAction,
    className = "",
}) {
    const isError = variant === "error";

    const border = isError ? "border-red-200" : "border-blue-200";
    const badgeBg = isError ? "bg-red-50" : "bg-yellow-50";
    const badgeBorder = isError ? "border-red-200" : "border-yellow-200";
    const badgeText = isError ? "text-red-700" : "text-yellow-800";
    const titleText = isError ? "text-red-900" : "text-blue-950";
    const descText = isError ? "text-red-700" : "text-blue-700";

    const actionBase =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";

    const actionClass = isError
        ? `${actionBase} border border-red-200 bg-white text-red-700 hover:bg-red-50`
        : `${actionBase} border border-blue-200 bg-blue-500 text-white hover:bg-blue-600`;

    let actionNode = null;
    if (actionText && to) {
        actionNode = (
            <Link to={to} className={actionClass}>
                {actionText}
            </Link>
        );
    } else if (actionText && onAction) {
        actionNode = (
            <button type="button" onClick={onAction} className={actionClass}>
                {actionText}
            </button>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            <div className={`mx-auto w-full max-w-2xl rounded-2xl border ${border} bg-white p-6`}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <div className="absolute -inset-2 rounded-2xl bg-green-200/60 blur-sm" />
                            <div className="relative h-14 w-14 rounded-2xl border border-green-200 bg-white p-2">
                                <div className="h-full w-full rounded-xl border border-blue-200 bg-blue-50" />
                                <div className="absolute left-3 top-3 h-5 w-5 rounded-lg bg-yellow-200" />
                            </div>
                        </div>

                        <div>
                            <div
                                className={`inline-flex items-center rounded-full border ${badgeBorder} ${badgeBg} px-3 py-1 text-xs font-semibold ${badgeText}`}
                            >
                                {isError ? "Terjadi kendala" : "Kosong"}
                            </div>
                            <h3 className={`mt-2 text-lg font-bold ${titleText}`}>{title}</h3>
                            <p className={`mt-1 text-sm leading-relaxed ${descText}`}>{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {actionNode}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <p className="text-xs font-semibold text-blue-800">Saran</p>
                        <p className="mt-1 text-sm text-blue-700">Coba refresh halaman.</p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-white p-3">
                        <p className="text-xs font-semibold text-green-800">Tips</p>
                        <p className="mt-1 text-sm text-green-700">Pastikan koneksi stabil.</p>
                    </div>
                    <div className="rounded-xl border border-yellow-200 bg-white p-3">
                        <p className="text-xs font-semibold text-yellow-800">Cepat</p>
                        <p className="mt-1 text-sm text-yellow-700">Tambah data baru bila perlu.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
