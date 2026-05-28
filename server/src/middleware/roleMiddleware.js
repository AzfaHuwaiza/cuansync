const { failed } = require('../helper/response');

const roleCheck = (allowedRoles = []) => {
    return (req , res , next) => {
        if(!req.user || !req.user.role) return failed(res, 'Akses ditolak, Role tidak ditemukan', 403);

        if(!allowedRoles.includes(req.user.role)) return failed(res, 'Akses ditolak, Anda tidak memiliki izin untuk mengakses resource ini', 403);

        next();
    };
};

module.exports = { roleCheck };