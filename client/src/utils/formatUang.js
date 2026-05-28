export const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number)
     .replace('Rp', 'Rp.');
    
}

export const formatRupiahCompact = (number) => {
    if(number === undefined || number === null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency',
        currency: 'IDR',
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(number)
    .replace('Rp', 'Rp.');
}