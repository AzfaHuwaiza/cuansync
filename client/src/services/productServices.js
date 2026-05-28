import { apiClient } from "../utils/apiClient";

export const getDataProductUMKM = async (umkm_id) => {
    return apiClient(`/product/umkm/${umkm_id}`, {
        method: 'GET',
    });
};

export const addProduct = async (dataForm) => {
    return apiClient('/product', {
        method: 'POST',
        body: JSON.stringify(dataForm),
    });
};

export const getAllProduct = async () => {
    return apiClient('/product', {
        method: 'GET',
    });
};

export const deleteProduct = async (id) => {
    return apiClient(`/product/${id}`, {
        method: 'DELETE',
    });
};

export const updateProduct = async (id, dataForm) => {
    return apiClient(`/product/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dataForm),
    });
};

export const getProductDetail = async (id) => {
    return apiClient(`/product/detail/${id}`, {
        method: 'GET',
    });
};

export const getProductByUser = async () => {
    return apiClient(`/product/user`, {
        method: 'GET',
    });
};