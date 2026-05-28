const db = require('../config/db');
const ClientError = require('../exceptions/ClientError');

const createTransaction = async (umkm_id, type , amount, note, product_name) => {
    const [existing] = await db.execute('SELECT id FROM umkms WHERE id = ?', [umkm_id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');

    const [lastTransaction] = await db.execute('SELECT id FROM transactions ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED) DESC LIMIT 1 FOR UPDATE');
    let newTransactionId = 'TRX001';
    if(lastTransaction.length > 0){
        const lastId = lastTransaction[0].id;
        const lastNumber = parseInt(lastId.replace('TRX', ''), 10);
        newTransactionId = `TRX${String(lastNumber + 1).padStart(3, '0')}`;
    }

    const [result] = await db.execute('INSERT INTO transactions (id, umkm_id, type, amount, note, product_name) VALUES (?, ?, ?, ?, ?, ?)', [newTransactionId, umkm_id, type, amount, note, product_name]);
    return { id: newTransactionId, umkm_id, type, amount, note, product_name };
}

const getTransactionsByUMKM = async (umkm_id) => {
    const [existing] = await db.execute('SELECT id FROM umkms WHERE id = ?', [umkm_id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');

    const [rows] = await db.execute('SELECT id, umkm_id, type, amount, note, product_name, occurred_at FROM transactions WHERE umkm_id = ?', [umkm_id]);
    return rows;
}

const getTransactionById = async (id) => {
    const [rows] = await db.execute('SELECT id, umkm_id, type, amount, note, product_name, occurred_at FROM transactions WHERE id = ?', [id]);
    return rows[0];
}

const getAllTransactions = async () => {
    const [rows] = await db.execute('SELECT t.id, um.name AS nama_umkm, t.type, t.amount, t.product_name, t.occurred_at FROM transactions t JOIN umkms um ON t.umkm_id = um.id');
    return rows;
}

const deleteTransaction = async (id) => {
    const [existing] = await db.execute('SELECT id FROM transactions WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('Transaksi tidak ditemukan');

    await db.execute('DELETE FROM transactions WHERE id = ?', [id]);
    return { message: 'Transaksi berhasil dihapus' };
}

const getAllTransactionsIncomeByUmkm = async (umkm_id) => {
    const [rows] = await db.execute(`SELECT SUM(amount) AS totalIncome FROM transactions WHERE umkm_id = ? AND type = 'income'`, [umkm_id]);
    return rows[0].totalIncome;
}

const getAllTransactionsByUserId = async (user_id) => {
    const [rows] = await db.execute('SELECT t.id, t.product_name AS namaProduct, pr.category AS kategori, t.type, t.amount, t.note, t.occurred_at FROM transactions t JOIN umkms um ON t.umkm_id = um.id LEFT JOIN umkm_members ums ON um.id = ums.umkm_id LEFT JOIN products pr ON pr.umkm_id = um.id WHERE ums.user_id = ? ORDER BY t.occurred_at DESC', [user_id]);
    return rows;
}

const getTotalTransactionsByUmkm = async (umkm_id) => {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalTransactions FROM transactions WHERE umkm_id = ?', [umkm_id]);
    return rows[0].totalTransactions;
}

const getAllCountTransactions = async () => {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalTransactions FROM transactions');
    return rows[0].totalTransactions;
}

const getAllTransactionsExpenseByUmkm = async (umkm_id) => {
    const [rows] = await db.execute(`SELECT SUM(amount) AS totalExpense FROM transactions WHERE umkm_id = ? AND type = 'expense'`, [umkm_id]);
    return rows[0].totalExpense;
}

const getChartTransactionsByUmkm = async (umkm_id, range) => {
    let selectQuery = '';
    let whereQuery = '';
    let groupByQuery = '';

    if(range === '1_month'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%d %b') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
        groupByQuery = 'DATE(occurred_at)';
    }else if(range === '3_months'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%b %Y') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)';
        groupByQuery = 'MONTH(occurred_at), YEAR(occurred_at)';
    }else if(range === '6_months'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%b %Y') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)';
        groupByQuery = 'MONTH(occurred_at), YEAR(occurred_at)';
    }else if(range === '5_year'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%Y') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 5 YEAR)';
        groupByQuery = 'YEAR(occurred_at)';
    }else if(range === '1_days'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%H:%i') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
        groupByQuery = 'HOUR(occurred_at), MINUTE(occurred_at)';
    }else if(range === '12_hours'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%H:%i') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 12 HOUR)';
        groupByQuery = 'HOUR(occurred_at), MINUTE(occurred_at)';
    }else if(range === '7_days'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%d %b') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        groupByQuery = 'DATE(occurred_at)';
    }else if(range === '3_days'){
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%d %b') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 3 DAY)';
        groupByQuery = 'DATE(occurred_at)';
    }else{
        selectQuery = `DATE_FORMAT(MIN(occurred_at), '%b %Y') AS label`;
        whereQuery = 'occurred_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        groupByQuery = 'MONTH(occurred_at), YEAR(occurred_at)';
    }

    const query = `SELECT ${selectQuery}, COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS pemasukan,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS pengeluaran
    FROM transactions WHERE umkm_id = ? AND ${whereQuery} GROUP BY ${groupByQuery} ORDER BY MIN(occurred_at) ASC`;

    const [rows] = await db.execute(query, [umkm_id]);
    return rows;
}

module.exports = { createTransaction, getTransactionsByUMKM, getAllTransactions, deleteTransaction, getTransactionById, getAllTransactionsIncomeByUmkm, getAllTransactionsExpenseByUmkm, getTotalTransactionsByUmkm, getAllCountTransactions, getChartTransactionsByUmkm, getAllTransactionsByUserId };