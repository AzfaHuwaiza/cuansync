
export default function Card({ title, description, imageUrl, children, details, umkm, }) {
    return(
        <>
            <div className="rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                {umkm && (
                    <div className='relative w-full h-48 bg-gradient-to-t from-black/70 via-black/50 to-transparent'>
                    {imageUrl ? (
                        <img src={imageUrl} title={title} className="w-full h-full object-cover"  />
                    ) : (
                        <div className='flex justify-center items-center h-full w-full'>
                            <span className='text-white text-lg font-medium drop-shadow-sm'>Tidak Ada Foto UMKM</span>
                        </div>
                    )}
                    </div>
                )}

                <div className="p-4 flex-1">

                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2">{title}</h2>
                    {description && (
                        <p className="text-gray-500 dark:text-slate-300 mb-6 line-clamp-3">{description}</p>
                    )}
                    {details && details.length > 0 && (
                        <ul className="text-gray-600 dark:text-slate-300 text-sm mb-4 space-y-1">
                            {details.map((detail, index) => (
                                <li key={index} className="flex">
                                    <span className="font-medium">{detail.label} </span>
                                    <span className="font-normal spacing"> : </span>
                                    <span> {detail.value}</span>
                                </li>
                            ))}
                        </ul>
                    )} 
                </div> 
                {children && (
                    <div className="p-4 mt-auto w-full mb-3">
                        {children}
                    </div>
                )}
            </div>
        </>
    )
}
