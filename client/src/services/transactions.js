import { apiClient } from "../utils/apiClient";

export const getTransactions = async (umkm_id) => {
    return apiClient(`/transaction/umkm/${umkm_id}`, {
        method: 'GET',
    });
};

export const addTransaction = async (dataForm) => {
    return apiClient('/transaction', {
        method: 'POST',
        body: JSON.stringify(dataForm),
    });
};

export const deleteTransaction = async (id) => {
    return apiClient(`/transaction/${id}`, {
        method: 'DELETE',
    });
};

export const getTotalTransactionsByUmkm = async (umkm_id) => {
    return apiClient(`/transaction/count/${umkm_id}`, {
        method: 'GET',
    });
};

export const getTotalIncomeByUmkm = async (umkm_id) => {
    return apiClient(`/transaction/income/${umkm_id}`, {
        method: 'GET',
    });
}

export const getTotalExpenseByUmkm = async (umkm_id) => {
    return apiClient(`/transaction/expense/${umkm_id}`, {
        method: 'GET',
    });
}

export const getAllTransactionsCount = async () => {
    return apiClient('/transaction/count', {
        method: 'GET',
    });
}

export const getChartUmkmTransactions = async (umkmId, range) => {
    return apiClient(`/transaction/chart/${umkmId}?range=${range}`, {
        method: 'GET',
    });
}

export const getAllTransactionsByUserId = async (user_id) => {
    return apiClient(`/transaction/user/${user_id}`, {
        method: 'GET',
    });
}
