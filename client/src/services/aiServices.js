import { apiClient } from "../utils/apiClient";

export const sendAiMessage = async (dataPayload) => {
    return apiClient('/chatKonsul/konsul', {
        method: 'POST',
        body: JSON.stringify(dataPayload),
    });
};

export const getAiPrediction = async (umkmId) => {
    return apiClient(`/chatKonsul/predict/${umkmId}`, {
        method: 'GET',
    });
};