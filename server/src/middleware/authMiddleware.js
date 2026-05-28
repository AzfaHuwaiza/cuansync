const Jwt = require('jsonwebtoken');
const ClientError = require('../exceptions/ClientError');

const authenticate = (req , res , next) => {
    try{
        const authHeader = req.cookies.accessToken;

        if(!authHeader) throw new ClientError('Akses ditolak, Token tidak ditemukan', 401);
        
        const decode = Jwt.verify(authHeader, process.env.ACCESS_TOKEN);

        req.user = decode;
        next();

    }catch(err){
        if(err.name === 'TokenExpiredError'){
            next(new ClientError('Token sudah kadaluarsa, silahkan login kembali', 401));
        } else {
            next(new ClientError('Akses ditolak, Token tidak valid', 401));
        }
    }
}

module.exports = authenticate;