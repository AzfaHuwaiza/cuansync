
const router = require('express').Router();
const { processAiKonsulResponse, getPast30DaysDataTransactions, getPredictionFromFastAPI } = require('../services/aiService');
const { success, failed } = require('../helper/response');
const authenticate = require('../middleware/authMiddleware');
const { asyncHandler } = require('../helper/validator');
const { getUMKMById } = require('../services/umkmService');

router.post('/konsul', authenticate, asyncHandler(async(req, res) => {
    const { umkmId, message, chatHistory } = req.body;
    const userId = req.user.id;

    const umkm = await getUMKMById(umkmId);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== userId) return failed(res, 'Akses ditolak', 403);
    
    const replay = await processAiKonsulResponse(umkmId, message, chatHistory);
    return success(res, { replay }, 'Konsultasi AI berhasil diproses');
}));

router.get('/predict/:umkmId', authenticate, asyncHandler(async(req, res) => {
    const { umkmId } = req.params;
    const userId = req.user.id;

    const umkm = await getUMKMById(umkmId);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== userId) return failed(res, 'Akses ditolak', 403);


    const history30Days = await getPast30DaysDataTransactions(umkmId);
    const predictionResult = await getPredictionFromFastAPI(umkm.sector, history30Days);

    if(!predictionResult) {
        return failed(res, 'Server AI Machine Learning sedang sibuk/mati', 503);
    }

    return success(res, {
        prediction_tomorrow: predictionResult.predicted_next_day_net_cash_flow,
        scale: predictionResult.prediction_scale
    }, 'Prediksi berhasil ditarik');
}));

module.exports = router;