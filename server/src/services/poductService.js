const db = require('../config/db');
const ClientError = require('../exceptions/ClientError');


const createProduct = async (umkm_id, name, category, base_price) => {
    const [existing] = await db.execute('SELECT id FROM umkms WHERE id = ? ', [umkm_id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');

    const [lastProduct] = await db.execute('SELECT id FROM products ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED) DESC LIMIT 1 FOR UPDATE');
    let newProductId = 'PRD001';
    if(lastProduct.length > 0){
        const lastId = lastProduct[0].id;
        const lastNumber = parseInt(lastId.replace('PRD', ''), 10);
        newProductId = `PRD${String(lastNumber + 1).padStart(3, '0')}`;
    }

    const [result] = await db.execute('INSERT INTO products (id, umkm_id, name, category, base_price) VALUES (?, ?, ?, ?, ?)', [newProductId, umkm_id, name, category, base_price]);
    return { id: newProductId, umkm_id, name, category, base_price };
}

const getProductsByUMKM = async (umkm_id,user_id) => {
    const [existing] = await db.execute('SELECT id FROM umkms WHERE id = ? ', [umkm_id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');
    
    const [rows] = await db.execute('SELECT pr.id, mem.user_id AS user_id, pr.umkm_id, pr.name, pr.category, pr.base_price FROM products pr JOIN umkm_members mem ON mem.umkm_id = pr.umkm_id WHERE pr.umkm_id = ? ', [umkm_id, user_id]);
    return rows;
}

const getProductAll = async () => {
    const [rows] = await db.execute('SELECT pr.id, um.name AS nama_umkm, pr.name AS nama_product, pr.category, pr.base_price FROM products pr LEFT JOIN umkms um ON pr.umkm_id = um.id');
    return rows;
}

const getProductById = async (id) => {
    const [rows] = await db.execute('SELECT id, umkm_id, name, category, base_price FROM products WHERE id = ?', [id]);
    return rows[0];
}

const deleteProduct = async (id) => {
    const [existing] = await db.execute('SELECT id FROM products WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('Produk tidak ditemukan');

    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return { message: 'Produk berhasil dihapus' };
}

const updateProduct = async (id, umkm_id, name, category, base_price) => {
    const [existing] = await db.execute('SELECT id FROM products WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('Produk tidak ditemukan');

    const [result] = await db.execute('UPDATE products SET umkm_id = ?, name = ?, category = ?, base_price = ? WHERE id = ?', [umkm_id, name, category, base_price, id]);
    return { id, umkm_id, name, category, base_price };
}

const getProductByUser = async (userId) => {
    const [rows] = await db.execute('SELECT pr.id, pr.umkm_id, pr.name, pr.category, pr.base_price AS harga FROM products pr JOIN umkm_members mem ON mem.umkm_id = pr.umkm_id WHERE mem.user_id = ?', [userId]);
    return rows;
}

module.exports = { createProduct, getProductsByUMKM, getProductAll, deleteProduct, updateProduct, getProductById, getProductByUser };