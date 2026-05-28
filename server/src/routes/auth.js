const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { loginUser, logoutUser, verifyRefreshToken, registerUser, updateUser, getAllCountUsers, getAllUsers, get5Users, updateRoleUser } = require('../services/authService');
const { userValidator, userUpdateValidator } = require('../validator/userValidator');
const { validateRouter, asyncHandler } = require('../helper/validator');
const authenticate = require('../middleware/authMiddleware');
const { success, failed } = require('../helper/response');
const { roleCheck } = require('../middleware/roleMiddleware');


router.post('/register', validateRouter(userValidator), asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;
    const newUser = await registerUser(email, password, name, role);
    return success(res, { user: newUser }, 'Daftar berhasil', 201);
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return failed(res, 'Email dan password harus diisi', 400);

    const tokens = await loginUser(email, password);

    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return success(res, { data: tokens }, 'Login berhasil');
}));

router.put('/refresh-token', asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const { id_user } = req.body;
    if(!refreshToken || !id_user) return failed(res, 'Refresh token dan ID user harus diisi', 400);

    const decoded = await verifyRefreshToken(refreshToken, id_user);
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });
    return success(res, { accessToken }, 'Access token berhasil diperbarui');
}));


router.delete('/logout', authenticate, asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return failed(res, 'Refresh token harus diisi', 400);

    await logoutUser(refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return success(res,'Logout berhasil');
}));

router.put('/update',authenticate, validateRouter(userUpdateValidator), asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { email, name } = req.body;
    const updatedUser = await updateUser(id, email, name);
    return success(res, { user: updatedUser }, 'User berhasil diperbarui');
    
}));

router.get('/users', authenticate, roleCheck(['admin']), asyncHandler(async (req, res) => {
    const id = req.user.id;
    const totalUsers = await getAllCountUsers();
    const users = await get5Users();
    return success(res, { totalUsers, users }, 'Total pengguna berhasil diambil');
}));

router.get('/users/all', authenticate, roleCheck(['admin']), asyncHandler(async (req, res) => {
    const id = req.user.id;
    const totalUsers = await getAllCountUsers();
    const users = await getAllUsers();
    return success(res, { totalUsers, users }, 'Total pengguna berhasil diambil');
}));

router.put('/users/role', authenticate, roleCheck(['admin']), asyncHandler(async (req,res) => {
    const { id, role } = req.body;

    if(id === 'USR001') return failed(res, 'Tidak dapat mengubah role super admin', 403); 
    const updatedUser = await updateRoleUser(id, role);
    return success(res, { user: updatedUser }, 'Role user berhasil diperbarui');
}))


module.exports = router;