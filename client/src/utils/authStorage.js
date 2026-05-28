export const simpanAuth = (id_user, umkmId = null, role) => {
    localStorage.setItem('id_user', id_user);
    if(umkmId) localStorage.setItem('umkmId', umkmId);
    localStorage.setItem('role', role);
};

export const getIdUser = () => {
    return localStorage.getItem('id_user');
}

export const getRole = () => {
    return localStorage.getItem('role');
}

export const getIdUmkm = () => {
    return localStorage.getItem('umkmId');
}

export const hapusAuth = () => {
    localStorage.removeItem('id_user');
    localStorage.removeItem('umkmId');
}

