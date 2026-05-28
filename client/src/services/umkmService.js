import { apiClient } from "../utils/apiClient";

export const getDataUmkm = async () => {
    return apiClient('/umkm', {
        method: 'GET',
    });
};

export const getDetailUMKM = async (umkm_id) => {
    return apiClient(`/umkm/${umkm_id}`, {
        method: 'GET',
    });
};

export const addUMKM = async (dataForm) => {
    return apiClient('/umkm', {
        method: 'POST',
        body: dataForm,
    });
};

export const getUMKMByUser = async () => {
    return apiClient(`/umkm/user`, {
        method: 'GET',
    })
}

export const updateUMKM = async (id, dataForm) => {
    return apiClient(`/umkm/${id}`, {
        method: 'PUT',
        body: dataForm,
    });
}

export const deleteUMKM = async (id) => {
    return apiClient(`/umkm/${id}`, {
        method: 'DELETE',
    });
}

export const getAllCountUMKM = async () => {
    return apiClient('/umkm/umkmCount', {
        method: 'GET'
    });
};

export const getAllUMKMByAdmin = async () => {
    return apiClient('/umkm/admin', {
        method: 'GET'
    });
}