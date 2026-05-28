const { createTransaction,getChartTransactionsByUmkm, getAllCountTransactions , getTransactionsByUMKM, getAllTransactions, getAllTransactionsByUserId, deleteTransaction, getTransactionById,getTotalTransactionsByUmkm, getAllTransactionsExpenseByUmkm, getAllTransactionsIncomeByUmkm } = require('../services/transaction');
const { validateTransaction } = require('../validator/transactionValidator');
const { getUMKMById } = require('../services/umkmService');
const { validateRouter, asyncHandler } = require('../helper/validator');
const { success, failed } = require('../helper/response');
const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');


// TAMBAH TRANSAKSI SESUAI UMKM YANG DIMILIKI USER SENDIRI
router.post('/', authenticate, validateRouter(validateTransaction), asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { umkm_id, type, amount, note, product_name } = req.body;
    const newTransaction = await createTransaction(umkm_id, type, amount, note, product_name);
    const umkm = await getUMKMById(umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk menambahkan transaksi ke UMKM ini', 403);
    return success(res, { transaction: newTransaction }, 'Transaksi berhasil dibuat', 201);
}));

// AMBIL DAFTAR TRANSAKSI BERDASARKAN UMKM SESUAI UMKM YANG DIMILIKI USER SENDIRI
router.get('/umkm/:umkm_id', authenticate, asyncHandler(async (req, res) =>{
    const user_id = req.user.id;
    const umkm_id = req.params.umkm_id;
    const transactions = await getTransactionsByUMKM(umkm_id);
    const umkm = await getUMKMById(umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk melihat transaksi UMKM ini', 403);

    return success(res, { transactions }, 'Daftar transaksi UMKM berhasil diambil');
}));

// AMBIL TOTAL SEMUA TRANSAKSI SESUAI UMKM YANG DIMILIKI USER SENDIRI
router.get('/count/:umkm_id', authenticate, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const umkmId = req.params.umkm_id;
    const transactions = await getTotalTransactionsByUmkm(umkmId);
    const umkm = await getUMKMById(umkmId);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk melihat transaksi UMKM ini', 403);
    return success(res, { transactions }, 'Total transaksi UMKM berhasil diambil');
}));

router.get('/income/:umkm_id', authenticate, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const umkm_id = req.params.umkm_id;
    const totalIncome = await getAllTransactionsIncomeByUmkm(umkm_id);
    const umkm = await getUMKMById(umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk melihat transaksi UMKM ini', 403);
    return success(res, { totalIncome }, 'Total pemasukan UMKM berhasil diambil');
}));

router.get('/expense/:umkm_id', authenticate, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const umkm_id = req.params.umkm_id;
    const totalExpense = await getAllTransactionsExpenseByUmkm(umkm_id);
    const umkm = await getUMKMById(umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk melihat transaksi UMKM ini', 403);
    return success(res, { totalExpense }, 'Total pengeluaran UMKM berhasil diambil');
}));

router.get('/count', authenticate, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const transactions = await getAllCountTransactions();
    return success(res, { transactions }, 'Daftar transaksi berhasil diambil');
}));

router.get('/user/:userId', authenticate, asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const transactions = await getAllTransactionsByUserId(user_id);
    return success(res, { transactions }, 'Daftar transaksi berhasil diambil');
}));

router.get('/chart/:umkmId',authenticate, asyncHandler(async (req,res) => {
    const user_id = req.user.id;
    const umkmId = req.params.umkmId;
    const range = req.query.range || '1_year';
    const umkm = await getUMKMById(umkmId);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk melihat transaksi UMKM ini', 403);
    const chartData = await getChartTransactionsByUmkm(umkmId, range);
    return success(res, { chartData }, 'Data chart transaksi berhasil diambil');
}))


router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    const transaction = await getTransactionById(id);
    if(!transaction) return failed(res, 'Transaksi tidak ditemukan', 404);
    const umkm = await getUMKMById(transaction.umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk menghapus transaksi ini', 403);

    const result = await deleteTransaction(id);
    return success(res, result.message);
}));

module.exports = router;