const { getAllUMKM, getUMKMById, createUMKM, updateUMKM, deleteUMKM, getUMKMByUserId, getAllCountUMKM, getAllUmkmLast, getAllUMKMByAdmin } = require('../services/umkmService');
const { validateUmkm } = require('../validator/umkmValidator');
const { validateRouter, asyncHandler } = require('../helper/validator');
const { success, failed } = require('../helper/response');
const authenticate = require('../middleware/authMiddleware');
const router = require('express').Router();
const upload = require('../middleware/claudUpload');
const { roleCheck } = require('../middleware/roleMiddleware');


router.get('/',authenticate,   asyncHandler(async (req , res) => { 
    const umkm = await getAllUMKM();
    return success(res, {umkm}, 'Daftar UMKM berhasil diambil');
}));

router.get('/umkmCount', authenticate, asyncHandler(async (req, res) => {
    const totalUMKM = await getAllCountUMKM();
    const umkmLast = await getAllUmkmLast();
    return success(res, { totalUMKM, umkmLast }, 'Total UMKM berhasil diambil');
}));

router.get('/user', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const umkm = await getUMKMByUserId(userId);
    return success(res, { umkm }, 'UMKM berhasil diambil');
}));

router.get('/admin', authenticate, roleCheck(['admin']), asyncHandler(async(req,res) => {
    const userId = req.user.id;
    const umkm = await getAllUMKMByAdmin();
    return success(res, { umkm }, 'UMKM berhasil diambil');
}))


router.get('/:id',authenticate,   asyncHandler(async (req, res) => {
    const id = req.user.id;
    const idUmkm = req.params.id;
    const umkm = await getUMKMById(idUmkm);
    if(!umkm) return failed(res, 'UMKM tidak ditemukan', 404);
    return success(res, { umkm }, 'UMKM berhasil diambil');
}));


router.post('/',authenticate, upload.single('photo'),   validateRouter(validateUmkm), asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { name, sector, description } = req.body;
    let photo_url = req.body.photo_url || null;
    if(req.file){
        photo_url = req.file.path || req.file.secure_url || req.file.url || null;
    }

    const newUmkm = await createUMKM(user_id, name, sector, description, photo_url);
    return success(res,  { umkm: newUmkm }, 'UMKM berhasil dibuat', 201);
}));

router.put('/:id',authenticate, upload.single('photo'),   validateRouter(validateUmkm), asyncHandler(async(req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    const { name, sector, description } = req.body;
    let photo_url = req.body.photo_url || null;
    if(req.file){
        photo_url = req.file.path || req.file.secure_url || req.file.url || null;
    }
    const existingUmkm = await getUMKMById(id);
    if(!existingUmkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(existingUmkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk mengubah UMKM ini', 403);

    const updateUmkm = await updateUMKM(id, user_id, name, sector, description, photo_url);
    return success(res, { umkm: updateUmkm }, 'UMKM berhasil diperbarui');
}));

router.delete('/:id',authenticate, roleCheck(['admin','user']), asyncHandler(async(req,res) => {
    const id = req.params.id;
    const user_id = req.user.id;
    const role = req.user.role;

    const existingUmkm = await getUMKMById(id);
    if(!existingUmkm) return failed(res, 'UMKM tidak ditemukan', 404);
    if(role !== 'admin' && existingUmkm.user_id !== user_id) return failed(res, 'Anda tidak memiliki akses untuk menghapus UMKM ini', 403);

    const deleteUmkm = await deleteUMKM(id, user_id, role);
    return success(res, 'UMKM berhasil dihapus');
}));
module.exports = router;