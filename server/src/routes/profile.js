const router = require('express').Router();
const profileValidator = require('../validator/profileValidator');
const authenticate = require('../middleware/authMiddleware');
const { validateRouter,asyncHandler } = require('../helper/validator');
const { success, failed } = require('../helper/response');
const { getProfileId, updateProfile } = require('../services/profileService');
const upload = require('../middleware/claudUpload');
const { roleCheck } = require('../middleware/roleMiddleware');


router.get('/', authenticate,roleCheck(['user', 'admin']), asyncHandler(async (req , res) => {
    const user_id = req.user.id;
    const profile = await getProfileId(user_id);
    if(!profile) return failed(res, 'Profil Belum Dilengkapi', 404);
    return success(res, { profile }, 'Profil berhasil diambil');
}));

router.put('/', authenticate, roleCheck(['user', 'admin']), upload.single('photo'), validateRouter(profileValidator), asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const { gender, phone_number, address, date_of_birth } = req.body;
    let photo_url = req.body.photo_url || null;
    if(req.file){
        photo_url = req.file.path ? req.file.path : `/uploads/profiles/${req.file.filename}`;
    }
    const updatedProfile = await updateProfile(user_id, { gender, phone_number, address, date_of_birth, photo_url });
    return success(res, { profile: updatedProfile }, 'Profil berhasil diperbarui');
}));

module.exports = router;