import { apiClient } from "../utils/apiClient";


export const getProfile = async () => {
    return apiClient('/profile', {
        method: 'GET',
    });
};

export const updateProfile = async (dataForm) => {
    return apiClient('/profile', {
        method: 'PUT',
        body: dataForm,
    })
}