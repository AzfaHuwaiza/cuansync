const { validateRouter, asyncHandler } = require('../helper/validator');
const { success, failed } = require('../helper/response');
const { getUMKMById } = require('../services/umkmService');
const { createProduct, updateProduct, getProductAll, getProductsByUMKM, deleteProduct, getProductById, getProductByUser } = require('../services/poductService');
const { validateProduct } = require('../validator/productValidator');
const router = require('express').Router();
const authenticate = require('../middleware/authMiddleware');

// TAMBAH PRODUK
router.post('/', authenticate, validateRouter(validateProduct), asyncHandler(async (req , res) => {
    const userId = req.user.id;
    const { umkm_id, name, category, base_price } = req.body;
    const umkm = await getUMKMById(umkm_id);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(umkm.user_id !== userId) return failed(res, 'Anda tidak memiliki akses untuk menambahkan produk ke UMKM ini', 403);
    const newProduct = await createProduct( umkm_id, name, category, base_price);
    return success(res, { product: newProduct }, 'Produk berhasil dibuat', 201);
}));

// AMBIL SELURUH DAFTAR PRODUK
router.get('/', authenticate, asyncHandler(async (req, res) =>{
    const products = await getProductAll();
    return success(res, { products }, 'Daftar produk berhasil diambil');
}));

// AMBIL DAFTAR PRODUK BERDASARKAN UMKM
router.get('/umkm/:umkm_id', authenticate, asyncHandler(async (req, res) => {
    const umkm_id = req.params.umkm_id;
    const user_id = req.user.id;
    const products = await getProductsByUMKM(umkm_id, user_id);
    return success(res, { products }, 'Daftar produk UMKM berhasil diambil');
}));

// UPDATE PRODUK BERDASARKAN ID DAN SESUAI DENGAN UMKM YANG DIMILIKI USER SENDIRI
router.put('/:id', authenticate, validateRouter(validateProduct), asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    const { name, category, base_price } = req.body;
    const product = await getProductById(id);
    if(!product) return failed(res, 'Produk tidak ditemukan', 404);
    const umkm = await getUMKMById(product.umkm_id);
    if(!umkm || umkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk memperbarui produk ini', 403);
    const updatedProduct = await updateProduct(id, product.umkm_id, name, category, base_price);
    return success(res, { product: updatedProduct }, 'Produk berhasil diperbarui');
}));

router.get('/detail/:id', authenticate, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await getProductById(id);
    if(!product) return failed(res, 'Produk tidak ditemukan', 404);
    return success(res, { product }, 'Detail produk berhasil diambil');
}));

// HAPUS PRODUK BERDASARKAN ID DAN SESUAI DENGAN UMKM YANG DIMILIKI USER SENDIRI
router.delete('/:id', authenticate, asyncHandler(async (req, res) =>{
    const id = req.params.id;
    const userId = req.user.id;
    const product = await getProductById(id);
    if(!product) return failed(res, 'Produk tidak ditemukan', 404);
    const umkm = await getUMKMById(product.umkm_id);
    if(!umkm || umkm.user_id !== userId) return failed(res, 'Anda tidak memiliki akses untuk menghapus produk ini', 403);
    const result = await deleteProduct(id);
    return success(res, result.message);
}));

router.get('/user', authenticate, asyncHandler(async (req,res) => {
    const userId = req.user.id;
    const products = await getProductByUser(userId);
    if(!userId) return failed(res, 'User tidak ditemukan', 404);
    return success(res, { products }, 'Daftar produk berdasarkan user berhasil diambil');
}))

module.exports = router;