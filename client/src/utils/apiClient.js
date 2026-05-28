import {getIdUser, hapusAuth } from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...options.headers };

    if(!(options.body instanceof FormData)){
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    options.credentials = 'include';

    try {
        let response = await fetch(url, { ...options, headers });
        let data = await response.json();

        if (response.status === 401) {
            if (endpoint === '/auth/login' || endpoint === '/auth/register') {
                throw { message: data.message || 'Unauthorized' };
            }

            console.log('Token mungkin sudah expired, mencoba refresh token...');
            const id_user = getIdUser();
            
            if (!id_user) {
                hapusAuth();
                window.location.href = '/login';
                throw { message: 'Session habis, silakan login kembali' };
            }

            const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_user: id_user }),
            });

            await refreshRes.json();

            if (refreshRes.ok) {
                console.log('Token berhasil diperbarui, mencoba ulang permintaan...');

                response = await fetch(url, { ...options, headers });
                data = await response.json();
            } else {
                hapusAuth();
                window.location.href = '/login';
                throw { message: 'Session habis, silakan login kembali' };
            }
        }

        if (!response.ok) {
            throw { message: data.message || 'Terjadi kesalahan saat menghubungi server', errors: data.errors || null };
        }

        const hasilBongkar = data.data?.data || data.data || data || {};
        return { ...data, ...hasilBongkar };

    }catch(err) {
        console.error('Error di apiClient:', err);
        throw err;
    }
};