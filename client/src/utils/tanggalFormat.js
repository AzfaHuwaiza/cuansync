export const formatTanggalLengkap = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        timeZone: "Asia/Jakarta",
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const formatTanggal = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        timeZone: "Asia/Jakarta",
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export const tanggalLong = (tanggalLong) => {
    if (!tanggalLong) return '';
    return tanggalLong.split('T')[0];
}