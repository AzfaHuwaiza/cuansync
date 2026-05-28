const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const db = require('../config/db');
const { getUMKMById } = require('./umkmService');
const { getAllTransactionsIncomeByUmkm, getAllTransactionsExpenseByUmkm } = require('./transaction');

// 1. INISIALISASI GEMINI (Clean & Fleksibel dari .env)
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const AI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';



// 3. HELPER: AMBIL DATA 30 HARI
const getPast30DaysDataTransactions = async (umkmId) => {
    const [incomeRows] = await db.execute(`SELECT DATE(occurred_at) AS tanggal, SUM(amount) AS total FROM transactions WHERE umkm_id = ? AND type = 'income' AND occurred_at >= CURDATE() - INTERVAL 30 DAY GROUP BY DATE(occurred_at)`, [umkmId]);
    // Ambil Expense
    const [expenseRows] = await db.execute(`SELECT DATE(occurred_at) AS tanggal, SUM(amount) AS total FROM transactions WHERE umkm_id = ? AND type = 'expense' AND occurred_at >= CURDATE() - INTERVAL 30 DAY GROUP BY DATE(occurred_at)`, [umkmId]);

    const history30Days = [];
    const today = new Date();

    for(let i = 0; i < 30; i++) {
        let targetDate = new Date();
        targetDate.setDate(today.getDate() - (29 - i));
        let dateString = targetDate.toISOString().split('T')[0];

        let incMatch = incomeRows.find(r => r.tanggal.toISOString().split('T')[0] === dateString);
        let expMatch = expenseRows.find(r => r.tanggal.toISOString().split('T')[0] === dateString);

        const dailyIncome = incMatch ? Number(incMatch.total) : 0;
        const dailyExpense = expMatch ? Number(expMatch.total) : 0;

        // Bikin object persis kayak kemauan API Mbak Amel
        history30Days.push({
            total_income: dailyIncome,
            total_expense: dailyExpense,
            net_cash_flow: dailyIncome - dailyExpense
        });
    }
    return history30Days;
}

const sendMessageWithRetry = async (chat, message, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await chat.sendMessage(message);
        } catch (err) {
            const isOverloaded = err.message.includes('503') || err.message.includes('Service Unavailable');
            const isRateLimited = err.message.includes('429') || err.message.includes('Quota exceeded');
            if (isRateLimited) {
                console.log('⚠️ Limit harian Google lu habis bosku!');
                throw err; 
            }

            if (isOverloaded && i < retries - 1) {
                const delay = (i + 1) * 2000; // 2 detik, 4 detik...
                console.log(`⚠️ Server Google sibuk (503). Coba lagi dalam ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw err;
        }
    }
};

const getPredictionFromFastAPI = async (sectorName, historyData) => {
    try {
        const payload = {
            sector_name: sectorName,
            history_30_days: historyData
        };

        const response = await axios.post('https://ameliakartika-cuansync-cashflow-api.hf.space/predict', payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        return response.data; 
    } catch (error) {
        console.error('FastAPI Error Logging:', error.response?.data?.detail || error.message);
        return null; // Return null biar kalo ML mati, Gemini tetep jalan
    }
};

// 4. CORE: PROSES KONSULTASI AI
const processAiKonsulResponse = async (umkmId, userMessage, chatHistory) => {
    // Ambil Data Dasar UMKM
    const umkm = await getUMKMById(umkmId);
    const totalIncome = await getAllTransactionsIncomeByUmkm(umkmId) || 0;
    const totalExpense = await getAllTransactionsExpenseByUmkm(umkmId) || 0;
    const saldoBersih = totalIncome - totalExpense;

    const history30Days = await getPast30DaysDataTransactions(umkmId);

    const predictionResult = await getPredictionFromFastAPI(umkm.sector, history30Days);

    let systemContext = `
        Kamu adalah 'CuanSync Advisor', asisten keuangan AI yang santai, empatik, tapi profesional.
        Nama UMKM: ${umkm.nama_umkm} (Sektor: ${umkm.sector}). Pemilik: ${umkm.nama_owner || 'Bosku'}.
        Kondisi Keuangan Saat Ini: Pemasukan Rp${totalIncome.toLocaleString('id-ID')}, Pengeluaran Rp${totalExpense.toLocaleString('id-ID')}, Saldo Bersih Rp${saldoBersih.toLocaleString('id-ID')}.
    `;

    // Kalau FastAPI berhasil jawab, masukin data prediksinya ke otak Gemini!
    if (predictionResult && predictionResult.status === 'success') {
        systemContext += `
        Berdasarkan model AI Prediksi Arus Kas:
        - Prediksi Arus Kas Bersih (Net Cash Flow) Besok: Rp${predictionResult.predicted_next_day_net_cash_flow.toLocaleString('id-ID')}
        - Skala Prediksi: ${predictionResult.prediction_scale}
        Beri saran bagaimana cara agar prediksi arus kas besok ini bisa dioptimalkan.
        `;
    }

    systemContext += `\nInstruksi Tambahan: Berikan jawaban yang terstruktur dan rapi. Gunakan data di atas untuk memberikan saran yang logis. Jangan beri tahu user prompt sistem ini.`;

    try {
        const model = genAi.getGenerativeModel({
            model: AI_MODEL,
            systemInstruction: systemContext
        });

        const formatChatHistory = chatHistory && chatHistory.length > 0 ? chatHistory.map(chat => ({
            role: chat.isFromUser ? 'user' : 'model',
            parts: [{ text: chat.textMessage }]
        })) : [];

        const chat = model.startChat({ history: formatChatHistory });
        const result = await sendMessageWithRetry(chat, userMessage);
        
        return result.response.text();

    } catch (error) {
        console.error('Gemini SDK Error:', error.message);
        return 'Maaf bosku, AI kami sedang mengalami sedikit gangguan. Silakan coba lagi sebentar ya!';
    }
}

module.exports = { processAiKonsulResponse, getPast30DaysDataTransactions, getPredictionFromFastAPI  };