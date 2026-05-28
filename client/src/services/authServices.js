import { apiClient } from "../utils/apiClient";

export const loginUser = async (dataFrom) => {
    return apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(dataFrom),
    });
};

export const registerUser = async (dataFrom) => {
    return apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(dataFrom),
    });
};

export const logoutUser = async () => {
    return apiClient('/auth/logout', {
        method: 'DELETE',
    });
}

export const updateUser = async (dataForm) => {
    return apiClient('/auth/update', {
        method: 'PUT',
        body: JSON.stringify(dataForm),
    });
}

export const getAllUsers = async () => {
    return apiClient('/auth/users', {
        method: 'GET',
    });
}

export const getAllUsersAdmin = async () => {
    return apiClient('/auth/users/all', {
        method: 'GET',
    });
}

export const updateRoleUser = async (id, role) => {
    return apiClient('/auth/users/role', {
        method: 'PUT',
        body: JSON.stringify({ id, role }),
    });
}

